import { readStdin } from './lib/read-stdin.ts';
import { splitMessage } from './lib/split-message.ts';
import { sendToChannel } from './lib/discord.ts';

const main = async (): Promise<void> => {
  const argMessage = process.argv[2];
  const raw = argMessage ?? (await readStdin());
  const message = raw.trim();

  if (!message) {
    console.error('[send-discord] 送信するメッセージが空です。');
    process.exit(1);
  }

  const token = process.env.TOKEN;
  const channelId = process.env.CHANNEL_ID;
  if (!token || !channelId) {
    console.error(
      '[send-discord] TOKEN または CHANNEL_ID が環境変数に設定されていません。',
    );
    process.exit(1);
  }

  const chunks = splitMessage(message);
  await sendToChannel(token, channelId, chunks);
  console.log('[send-discord] 送信完了');
};

main().catch((err: unknown) => {
  console.error('[send-discord] エラー:', err);
  process.exit(1);
});
