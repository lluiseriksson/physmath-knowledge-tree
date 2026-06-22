#!/usr/bin/env python3
"""Backward-compatible entry point for deterministic generated graph views."""

from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
NODE = shutil.which("node")

if NODE is None:
    raise SystemExit("Node.js 22 or newer is required; run `npm run generate:views`.")

result = subprocess.run(
    [NODE, str(ROOT / "scripts" / "generate-views.mjs")],
    cwd=ROOT,
    check=False,
)
sys.exit(result.returncode)
