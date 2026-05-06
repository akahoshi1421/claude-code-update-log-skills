#!/usr/bin/env bash
set -euo pipefail

# claude-codeリポジトリのローカルmainを最新まで進める。
# 要約・通知が成功した後にだけ呼ぶこと。途中で失敗した場合は
# このスクリプトを呼ばずに終了し、次回再実行時に同じ差分を再取得する。

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$ROOT_DIR/claude-code"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "[apply-updates] $REPO_DIR が見つかりません。先に scripts/setup.sh を実行してください。" >&2
  exit 1
fi

cd "$REPO_DIR"
git pull origin main --ff-only
