import { Client, GatewayIntentBits } from 'discord.js';

/**
 * チャンクを順序保証で1件ずつ送信する。
 * `Promise.all` のような並列ではなくreduceでチェインすることで、
 * Discord側に届くメッセージ順を投入順と一致させる。
 *
 * @param send   1チャンクを送信する関数
 * @param chunks 送信対象のチャンク列
 */
const sendChunksSequentially = (
  send: (text: string) => Promise<unknown>,
  chunks: readonly string[],
): Promise<void> =>
  chunks.reduce<Promise<void>>(
    (prev, chunk) => prev.then(async () => {
      await send(chunk);
    }),
    Promise.resolve(),
  );

/**
 * Discordチャンネルへ分割済みメッセージを順次送信する。
 * `client.login` から `client.destroy` までをラップし、
 * cron / headless 実行でNodeプロセスが残らないようにする。
 *
 * @param token     Discord botトークン
 * @param channelId 送信先テキストチャンネルID
 * @param chunks    送信するメッセージのチャンク列(順序保持)
 * @throws チャンネルが取得できない、もしくはテキスト送信不可の場合
 */
export const sendToChannel = async (
  token: string,
  channelId: string,
  chunks: readonly string[],
): Promise<void> => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  try {
    await client.login(token);
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
      throw new Error(
        `チャンネルがテキストチャンネルとして取得できませんでした: ${channelId}`,
      );
    }
    await sendChunksSequentially((text) => channel.send(text), chunks);
  } finally {
    await client.destroy();
  }
};
