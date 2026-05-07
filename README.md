# claude-code-update-log-skills

これは日々進化するClaude Codeのアップデート内容を追い、通知するためのskillsです。

https://github.com/anthropics/claude-code の`CHANGELOG.md`のgitの履歴を追うことでどのような変更点が加えられたかを日々追うことができます。

## 導入方法

1. リポジトリをclone
1. セットアップスクリプトを実行 `bash scripts/setup.sh`
1. `.env`ファイルをリポジトリ直下に作成
1. 作成した`.env`に`TOKEN`にDiscordのAPI_TOKEN、`CHANNEL_ID`に通知したいDiscordのチャンネルIDを記載
1. cron等を設定し、Raspberry PiやAWS Lambda等で定期実行 `claude -p "/send-discord"`

## コマンド一覧

### /get-change-log

変更のlogを追えます。コマンドを叩くと、gitの前回から差分がないかを取得します。
その後、新しいcommitが存在し、前回との差分があった際、追加分のcommit logを元にどのような変更があったかを要約します。

### /send-discord

実行すると内部で`/get-change-log`相当のものが実行されます。その後、要約された文章をDiscordの指定したチャンネルに通知します。
