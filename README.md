# claude-code-update-log-skills

これは日々進化するClaude Codeのアップデート内容を追い、通知するためのskillsです。

https://github.com/anthropics/claude-code の`CHANGELOG.md`のgitの履歴を追うことでどのような変更点が加えられたかを日々追うことができます。

## 導入方法

1. この`README.md`ファイルがあるディレクトリ上で https://github.com/anthropics/claude-code をcloneします。
2. `npm i`をします。
3. .envを作成します。
4. 作成した.envに`TOKEN`にDiscordのAPI_TOKEN、`CHANNEL_ID`に通知したいDiscordのチャンネルIDを書きます。
5. cron等を設定し、Raspberry PiやAWS Lambda等で定期実行させてください。

## コマンド一覧

### /get-change-log

変更のlogを追えます。コマンドを叩くと、gitの前回から差分がないかを取得します。
その後、新しいcommitが存在し、前回との差分があった際、追加分のcommit logを元にどのような変更があったかを要約します。

### /send-discord

実行すると内部で`/get-change-log`相当のものが実行されます。その後、要約された文章をDiscordの指定したチャンネルに通知します。
