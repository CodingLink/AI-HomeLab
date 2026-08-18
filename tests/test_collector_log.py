import importlib.machinery
import importlib.util
import os
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "scripts" / "codexbar-collector"


def load_collector_module():
    loader = importlib.machinery.SourceFileLoader("homedash_collector", str(SCRIPT_PATH))
    spec = importlib.util.spec_from_loader(loader.name, loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


class CollectorLogTests(unittest.TestCase):
    def test_log_rotates_at_size_limit_and_preserves_private_permissions(self):
        collector = load_collector_module()
        with tempfile.TemporaryDirectory() as temporary:
            data_dir = Path(temporary) / "HomeDash"
            collector.DATA_DIR = data_dir
            collector.LOG_PATH = data_dir / "codexbar-collector.log"
            collector.LOG_BACKUP_PATH = data_dir / "codexbar-collector.log.1"
            collector.LOG_MAX_BYTES = 256

            for index in range(12):
                collector.write_collector_log(f"sanitized failure {index:02d}")

            self.assertTrue(collector.LOG_PATH.exists())
            self.assertTrue(collector.LOG_BACKUP_PATH.exists())
            self.assertLessEqual(collector.LOG_PATH.stat().st_size, 256)
            self.assertLessEqual(collector.LOG_BACKUP_PATH.stat().st_size, 256)
            self.assertEqual(os.stat(data_dir).st_mode & 0o777, 0o700)
            self.assertEqual(os.stat(collector.LOG_PATH).st_mode & 0o777, 0o600)
            self.assertEqual(os.stat(collector.LOG_BACKUP_PATH).st_mode & 0o777, 0o600)

            files = sorted(path.name for path in data_dir.iterdir())
            self.assertEqual(
                files,
                ["codexbar-collector.log", "codexbar-collector.log.1"],
            )


if __name__ == "__main__":
    unittest.main()
