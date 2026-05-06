/** Discordチャンネルへ送信できる1メッセージあたりの最大文字数。 */
export const DISCORD_MAX_LENGTH = 2000;

/**
 * テキストを「max文字以内の先頭部分」と「残り」の2つに分ける。
 * `max` 位置以前に改行(`\n`)があればそこで切って自然な切れ目を保ち、
 * 改行が無ければ `max` 位置で強制分割する。
 *
 * @param text 分割対象の文字列
 * @param max  先頭部分の最大文字数
 * @returns `[先頭, 残り]` のタプル(残りは先頭の改行を1つだけ削る)
 */
const splitOnce = (text: string, max: number): readonly [string, string] => {
  const cutCandidate = text.lastIndexOf('\n', max);
  const cutAt = cutCandidate > 0 ? cutCandidate : max;
  return [text.slice(0, cutAt), text.slice(cutAt).replace(/^\n/, '')];
};

/**
 * `splitMessage` の再帰本体。`text` が `max` 以下になるまで先頭から
 * 切り出して `acc` に積む。`for` / `while` を避けるため再帰で書いている。
 *
 * @param text 残りのテキスト
 * @param max  1チャンクの最大文字数
 * @param acc  これまでに切り出されたチャンク列(immutable)
 */
const splitRecursive = (
  text: string,
  max: number,
  acc: readonly string[],
): readonly string[] => {
  if (text.length <= max) {
    return text.length > 0 ? [...acc, text] : acc;
  }
  const [head, tail] = splitOnce(text, max);
  return splitRecursive(tail, max, [...acc, head]);
};

/**
 * 長文メッセージを `max` 文字以下のチャンク列に分割する。
 * 改行優先で切るため、句点や段落の途中でぶつ切りにならない。
 *
 * @param message 分割対象のメッセージ
 * @param max     1チャンクの最大文字数(既定: {@link DISCORD_MAX_LENGTH})
 * @returns 分割後のチャンク列。`message` が `max` 以下なら長さ1の配列。
 */
export const splitMessage = (
  message: string,
  max: number = DISCORD_MAX_LENGTH,
): readonly string[] =>
  message.length <= max ? [message] : splitRecursive(message, max, []);
