#!/usr/bin/env bash
set -euo pipefail

# このスクリプトはプロジェクトルートから実行される想定
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REPO_URL="https://github.com/anthropics/claude-code.git"
REPO_DIR="claude-code"

if [ -d "$REPO_DIR/.git" ]; then
  echo "[setup] $REPO_DIR は既にcloneされています。skipします。"
else
  echo "[setup] $REPO_URL を $REPO_DIR にcloneします。"
  git clone "$REPO_URL" "$REPO_DIR"
fi

if [ -f package.json ]; then
  echo "[setup] npm install を実行します。"
  npm install
else
  echo "[setup] package.json が見つかりません。" >&2
  exit 1
fi

echo "[setup] 完了しました。"
