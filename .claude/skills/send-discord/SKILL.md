---
name: send-discord
description: anthropics/claude-codeリポジトリのCHANGELOG.mdに加えられた変更を取得して要約し、設定済みのDiscordチャンネルに通知する。新しいcommitが無い場合は何もしない。
---

# /send-discord

このskillは `/get-change-log` 相当の処理で要約を作成し、その要約をDiscordチャンネルに送信する。cron等から `claude -p "/send-discord"` の形でheadless実行される想定。

## 前提

- プロジェクトルートに `.env` が存在し、`TOKEN` と `CHANNEL_ID` が設定されていること。
- `claude-code/` がclone済みであること(なければ `bash scripts/setup.sh`)。
- `node_modules/` が存在すること(なければ `npm install`)。

## 手順

1. **更新検出**
   - `bash scripts/check-updates.sh` を実行し、標準出力を取得する。
   - 出力の1行目が `NO_UPDATES` の場合は **何も送信せず** にskillを終了する(冪等な静音実行)。

2. **要約生成**
   - `---COMMITS---` と `---DIFF---` の内容から日本語の要約を生成する。
   - 方針は `/get-change-log` skill と同じ:
     - 全体概要を1〜2文。
     - 主要な変更を箇条書き。
     - バージョン番号があれば冒頭に明記。
   - Discordに投稿する想定なので、絵文字や見出しは控えめにし、長すぎないように要点を絞る。

3. **Discord送信**
   - 生成した要約を引数として `node --env-file=.env src/send-discord.ts "<要約>"` を実行する。
   - 要約に改行や引用符が含まれる場合は適切にエスケープすること。長文や特殊文字を含む場合は `printf '%s' "$SUMMARY" | node --env-file=.env src/send-discord.ts` のようにstdin経由で渡してもよい(send-discord.ts は argv が無ければ stdin を読む)。
   - 送信後、`[send-discord] 送信完了` のログが出ることを確認する。

4. **ローカル前進**
   - Discord送信が成功した後でのみ `bash scripts/apply-updates.sh` を実行し、`claude-code/` のローカルmainを進める。
   - 送信に失敗した場合は apply-updates.sh を呼ばないこと。次回実行時に同じ差分を再取得して再送信を試みる。

## 注意事項

- 送信失敗時はexit code非ゼロを返し、cron側でエラー検知できるようにすること。
- 2000文字を超える要約は `src/send-discord.ts` 側で改行優先に分割される。要約を無理に1メッセージへ詰める必要は無いが、長すぎないように要点を絞ることを優先する。
- Discord通知に失敗してもローカルは進めない、という不変条件を守ること。
