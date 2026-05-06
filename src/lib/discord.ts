import { Client, GatewayIntentBits } from 'discord.js';

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
