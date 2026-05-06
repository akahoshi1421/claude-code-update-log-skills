/**
 * 標準入力をUTF-8テキストとして終端まで読み取りPromiseで返す。
 * パイプやリダイレクトで多バイト入力が来る前提のため、
 * `data` イベントごとに配列へpushして最後に結合する(let未使用)。
 *
 * @returns stdinから受け取った文字列(末尾の改行は保持)
 */
export const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: string[] = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => {
      chunks.push(chunk);
    });
    process.stdin.on('end', () => {
      resolve(chunks.join(''));
    });
    process.stdin.on('error', reject);
  });
