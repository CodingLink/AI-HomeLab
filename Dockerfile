FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DASHBOARD_HOST=0.0.0.0 \
    DASHBOARD_PORT=8787 \
    CC_SWITCH_DB=/data/cc-switch.db

WORKDIR /app

RUN groupadd --system --gid 10001 dashboard \
    && useradd --system --uid 10001 --gid dashboard --home-dir /nonexistent dashboard

COPY --chown=dashboard:dashboard app ./app
COPY --chown=dashboard:dashboard static ./static

USER dashboard

EXPOSE 8787

HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
    CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8787/api/v1/health', timeout=2).read()"]

CMD ["python", "-m", "app.server"]
