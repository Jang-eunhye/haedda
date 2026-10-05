/**
 * UUID v4 형식의 id를 만든다.
 * React Native(Hermes)에는 전역 crypto가 없어서, 없으면 Math.random으로 대체한다.
 * 로컬 식별자 용도라 암호학적 난수가 필요하지 않다.
 */
export function generateId(): string {
  const webCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (typeof webCrypto?.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
