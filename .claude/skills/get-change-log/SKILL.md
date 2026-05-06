---
name: get-change-log
description: anthropics/claude-codeリポジトリのCHANGELOG.mdに加えられた変更を取得し、新しいcommitがあれば日本語で要約する。差分が無い場合はその旨を返す。
---

# /get-change-log

このskillはローカルの`claude-code/`リポジトリとリモートの差分を確認し、CHANGELOG.mdの新しいエントリを日本語で要約する。

## 手順

1. **リポジトリ存在確認**
   - プロジェクトルート直下に `claude-code/` が無い場合は `bash scripts/setup.sh` を実行する。

2. **更新検出**
   - `bash scripts/check-updates.sh` を実行し、標準出力を取得する。
   - 出力の1行目が `NO_UPDATES` の場合は「更新はありません」と返してこのskillを終了する。

3. **要約**
   - 出力の `---COMMITS---` セクションに `git log` のonelineが、`---DIFF---` セクションに CHANGELOG.md のdiffが含まれる。
   - 以下の方針で日本語の要約を作成する:
     - 全体の概要を1〜2文でまとめる(例: 「N件のcommitで○○機能の追加と○○の修正が入りました」)。
     - 主要な変更を箇条書きで列挙する。CHANGELOG.mdのdiffで`+`行に追加されたエントリを優先する。
     - リリースバージョン (例: `v1.0.42`) が含まれる場合は冒頭に明記する。
     - 内部的な変更だけのcommit (テスト/リファクタ等) は省略してよい。
   - 要約結果は markdown 形式で返す。

4. **ローカル前進**
   - 要約の生成が成功した後でのみ `bash scripts/apply-updates.sh` を実行し、ローカル `claude-code/` のmainを最新まで進める。
   - 要約に失敗した場合や中断された場合は apply-updates.sh を呼ばないこと(次回再実行時に同じ差分を再取得できるようにするため)。

## 注意事項

- `scripts/check-updates.sh` は副作用なし(`git fetch`のみ)、`scripts/apply-updates.sh` は副作用あり(`git pull --ff-only`)。順序を守ること。
- diffが大きい場合は要点のみに絞る。CHANGELOG.md の変更行に集中し、コードのdiffは原則含めない(check-updates.sh が CHANGELOG.md に絞ったdiffのみ出力するためそのまま読めばよい)。
