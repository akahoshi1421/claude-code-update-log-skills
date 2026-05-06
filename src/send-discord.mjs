import { Client, GatewayIntentBits } from 'discord.js';

const DISCORD_MAX_LENGTH = 2000;

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function splitMessage(message, max = DISCORD_MAX_LENGTH) {
  if (message.length <= max) return [message];
  const chunks = [];
  let remaining = message;
  while (remaining.length > max) {
    // 改行で区切れる位置を探して、できるだけ自然に分割する
    let cutAt = remaining.lastIndexOf('\n', max);
    if (cutAt <= 0) cutAt = max;
    chunks.push(remaining.slice(0, cutAt));
    remaining = remaining.slice(cutAt).replace(/^\n/, '');
  }
  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}

async function main() {
  const argMessage = process.argv[2];
  const message = (argMessage ?? await readStdin()).trim();

  if (!message) {
    console.error('[send-discord] 送信するメッセージが空です。');
    process.exit(1);
  }

  const token = process.env.TOKEN;
  const channelId = process.env.CHANNEL_ID;
  if (!token || !channelId) {
    console.error('[send-discord] TOKEN または CHANNEL_ID が環境変数に設定されていません。');
    process.exit(1);
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  try {
    await client.login(token);
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`チャンネルがテキストチャンネルとして取得できませんでした: ${channelId}`);
    }
    for (const chunk of splitMessage(message)) {
      await channel.send(chunk);
    }
    console.log('[send-discord] 送信完了');
  } finally {
    await client.destroy();
  }
}

main().catch((err) => {
  console.error('[send-discord] エラー:', err);
  process.exit(1);
});
