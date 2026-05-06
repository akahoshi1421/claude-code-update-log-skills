#!/usr/bin/env bash
set -euo pipefail

# 副作用なしでリモートとの差分を検出して標準出力する。
# 出力フォーマット:
#   差分なし: "NO_UPDATES" の1行のみ
#   差分あり:
#     NEW_COMMITS=<件数>
#     ---COMMITS---
#     <git log HEAD..origin/main --oneline>
#     ---DIFF---
#     <git diff HEAD..origin/main -- CHANGELOG.md>

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$ROOT_DIR/claude-code"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "[check-updates] $REPO_DIR が見つかりません。先に scripts/setup.sh を実行してください。" >&2
  exit 1
fi

cd "$REPO_DIR"

# リモート最新を取得 (作業ツリーは触らない)
git fetch origin main --quiet

NEW_COMMITS=$(git rev-list --count HEAD..origin/main)

if [ "$NEW_COMMITS" -eq 0 ]; then
  echo "NO_UPDATES"
  exit 0
fi

echo "NEW_COMMITS=$NEW_COMMITS"
echo "---COMMITS---"
git log HEAD..origin/main --oneline
echo "---DIFF---"
git diff HEAD..origin/main -- CHANGELOG.md
