from __future__ import annotations

import json
import mimetypes
import os
import signal
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict
from urllib.parse import parse_qs, unquote, urlsplit

from .clash_verge_status import (
    ClashVergeSnapshotUnavailable,
    clash_verge_service_from_environment,
)
from .dashboard import DashboardError, service_from_environment
from .openrouter_usage import (
    OpenRouterSnapshotUnavailable,
    openrouter_service_from_environment,
)
from .live_activity import (
    LiveActivitySnapshotUnavailable,
    live_activity_service_from_environment,
)
from .provider_quotas import (
    ProviderSnapshotUnavailable,
    provider_service_from_environment,
)
from .tailscale_status import (
    TailscaleSnapshotUnavailable,
    tailscale_service_from_environment,
)


BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
SERVICE = service_from_environment()
PROVIDER_SERVICE = provider_service_from_environment()
TAILSCALE_SERVICE = tailscale_service_from_environment()
CLASH_VERGE_SERVICE = clash_verge_service_from_environment()
OPENROUTER_SERVICE = openrouter_service_from_environment()
LIVE_ACTIVITY_SERVICE = live_activity_service_from_environment()


class DashboardHandler(BaseHTTPRequestHandler):
    server_version = "CCSwitchDashboard/1.0"
    # Every non-streaming response sets Content-Length, so keep-alive is safe;
    # HTTP/1.1 is required for the chunked-free SSE stream below.
    protocol_version = "HTTP/1.1"

    def log_message(self, format: str, *args: Any) -> None:
        # Keep access logs useful without printing client IPs, query strings, or data.
        path = urlsplit(self.path).path
        print('client - - [{}] "{} {}" {}'.format(
            self.log_date_time_string(),
            self.command,
            path,
            args[1] if len(args) > 1 else "-",
        ), flush=True)

    def _security_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self'; "
            "img-src 'self' data:; connect-src 'self'; base-uri 'none'; "
            "form-action 'none'; frame-ancestors 'none'",
        )

    def _write_json(self, status: HTTPStatus, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode(
            "utf-8"
        )
        self.send_response(status)
        self._security_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _serve_static(self, request_path: str) -> None:
        relative = "index.html" if request_path == "/" else unquote(request_path.lstrip("/"))
        candidate = (STATIC_DIR / relative).resolve()
        static_root = STATIC_DIR.resolve()
        if static_root not in candidate.parents and candidate != static_root:
            self._write_json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return
        if not candidate.is_file():
            self._write_json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return

        body = candidate.read_bytes()
        content_type, _ = mimetypes.guess_type(str(candidate))
        self.send_response(HTTPStatus.OK)
        self._security_headers()
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _stream_live_activity(self) -> None:
        """Server-sent events stream of live-activity snapshots.

        Sends the current snapshot immediately, then re-reads it every second
        and only pushes when the serialized payload changes (the snapshot's
        meta.generatedAt is stable while the file is unchanged). A comment
        heartbeat keeps intermediaries from closing the idle connection.
        """
        self.send_response(HTTPStatus.OK)
        self._security_headers()
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

        last_sent: str | None = None
        last_ping = time.monotonic()
        try:
            while True:
                try:
                    payload = LIVE_ACTIVITY_SERVICE.get_activity()
                except LiveActivitySnapshotUnavailable:
                    payload = None
                if payload is not None:
                    body = json.dumps(payload, ensure_ascii=False, sort_keys=True)
                    if body != last_sent:
                        last_sent = body
                        self.wfile.write("data: {}\n\n".format(body).encode("utf-8"))
                        self.wfile.flush()
                now = time.monotonic()
                if now - last_ping >= 15:
                    last_ping = now
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
                time.sleep(1)
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            self.close_connection = True

    def _route(self) -> None:
        parsed = urlsplit(self.path)
        if parsed.path == "/api/v1/health":
            try:
                payload = SERVICE.health()
                self._write_json(HTTPStatus.OK, payload)
            except DashboardError:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {"status": "unavailable", "database": "unreadable"},
                )
            return

        if parsed.path == "/api/v1/providers":
            try:
                payload = PROVIDER_SERVICE.get_providers()
            except ProviderSnapshotUnavailable:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "provider_data_unavailable",
                        "message": "CodexBar provider data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path == "/api/v1/tailscale":
            try:
                payload = TAILSCALE_SERVICE.get_status()
            except TailscaleSnapshotUnavailable:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "tailscale_data_unavailable",
                        "message": "Tailscale status data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path == "/api/v1/clash-verge":
            try:
                payload = CLASH_VERGE_SERVICE.get_status()
            except ClashVergeSnapshotUnavailable:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "clash_verge_data_unavailable",
                        "message": "Clash Verge status data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path == "/api/v1/openrouter":
            try:
                payload = OPENROUTER_SERVICE.get_usage()
            except OpenRouterSnapshotUnavailable:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "openrouter_data_unavailable",
                        "message": "OpenRouter usage data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path == "/api/v1/live-activity/stream":
            self._stream_live_activity()
            return

        if parsed.path == "/api/v1/live-activity":
            try:
                payload = LIVE_ACTIVITY_SERVICE.get_activity()
            except LiveActivitySnapshotUnavailable:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "live_activity_unavailable",
                        "message": "Live activity data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path == "/api/v1/dashboard":
            query = parse_qs(parsed.query)
            range_key = query.get("range", ["today"])[0]
            app_filter = query.get("app", ["all"])[0]
            try:
                payload = SERVICE.get_dashboard(range_key, app_filter)
            except ValueError:
                self._write_json(
                    HTTPStatus.BAD_REQUEST,
                    {"error": "invalid_filter", "message": "Unsupported dashboard filter"},
                )
            except DashboardError:
                self._write_json(
                    HTTPStatus.SERVICE_UNAVAILABLE,
                    {
                        "error": "data_unavailable",
                        "message": "CC Switch usage data is temporarily unavailable",
                    },
                )
            else:
                self._write_json(HTTPStatus.OK, payload)
            return

        if parsed.path.startswith("/api/"):
            self._write_json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return

        self._serve_static(parsed.path)

    def do_GET(self) -> None:
        try:
            self._route()
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as exc:
            print(
                "Unhandled request error: {}".format(type(exc).__name__),
                flush=True,
            )
            try:
                self._write_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": "internal_error", "message": "The request could not be completed"},
                )
            except (BrokenPipeError, ConnectionResetError):
                return

    def do_HEAD(self) -> None:
        self.do_GET()


def main() -> None:
    host = os.environ.get("DASHBOARD_HOST", "127.0.0.1")
    port = int(os.environ.get("DASHBOARD_PORT", "8787"))
    server = ThreadingHTTPServer((host, port), DashboardHandler)

    def stop_server(*_: Any) -> None:
        # shutdown() must run outside the serving thread.
        import threading

        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop_server)
    signal.signal(signal.SIGINT, stop_server)
    print("CC Switch dashboard listening on {}:{}".format(host, port), flush=True)
    try:
        server.serve_forever(poll_interval=0.5)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
