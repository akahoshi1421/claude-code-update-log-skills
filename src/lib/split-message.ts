export const DISCORD_MAX_LENGTH = 2000;

const splitOnce = (text: string, max: number): readonly [string, string] => {
  const cutCandidate = text.lastIndexOf('\n', max);
  const cutAt = cutCandidate > 0 ? cutCandidate : max;
  return [text.slice(0, cutAt), text.slice(cutAt).replace(/^\n/, '')];
};

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

export const splitMessage = (
  message: string,
  max: number = DISCORD_MAX_LENGTH,
): readonly string[] =>
  message.length <= max ? [message] : splitRecursive(message, max, []);
