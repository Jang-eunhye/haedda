// 테스트 전용 로더: 새 패키지 설치 없이 Node 내장 테스트 러너로 TS 소스를 바로 실행한다.
// - @haedda/<pkg> → packages/<pkg>/src/index.ts
// - 확장자 없는 상대 경로 import → .ts / .tsx / index.ts 로 찾아준다
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@haedda/')) {
    const name = specifier.slice('@haedda/'.length);
    const entry = path.join(ROOT, 'packages', name, 'src', 'index.ts');
    if (existsSync(entry)) return nextResolve(pathToFileURL(entry).href, context);
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (isFile(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
  }
  return nextResolve(specifier, context);
}
