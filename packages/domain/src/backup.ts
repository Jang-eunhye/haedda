import type { Reward, Todo, TodoCategory } from '@haedda/types';
import { parseCategoriesFromUnknown } from './category/mutate';
import { parseRewardsFromUnknown } from './reward/mutate';
import { parseTodosFromUnknown } from './todo/normalize-todo';

/** 백업 파일임을 알아보는 표시. 다른 JSON을 실수로 불러오는 것을 막는다 */
export const BACKUP_FORMAT = 'haedda-backup';
/** 데이터 구조가 바뀌면 올리고, parseBackup에서 옛 버전을 변환한다 */
export const BACKUP_VERSION = 1;

export interface BackupData {
  todos: Todo[];
  rewards: Reward[];
  totalStickers: number;
  categories: TodoCategory[];
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  data: BackupData;
}

export type ParseBackupResult =
  | { ok: true; data: BackupData; exportedAt: string | null }
  | { ok: false; error: string };

export function createBackup(data: BackupData, now: Date = new Date()): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
}

export function serializeBackup(data: BackupData, now: Date = new Date()): string {
  return JSON.stringify(createBackup(data, now));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 붙여넣은 텍스트나 파일 내용을 백업 데이터로 바꾼다.
 * 형식이 맞지 않으면 아무것도 바꾸지 않도록 ok: false를 돌려준다.
 * 항목 하나하나는 저장소에서 읽을 때와 같은 규칙으로 검사해서, 깨진 항목만 빠진다.
 */
export function parseBackup(text: string): ParseBackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    return { ok: false, error: '백업 내용을 읽을 수 없어요. 내보낸 텍스트 전체를 그대로 붙여넣어 주세요.' };
  }

  if (!isRecord(parsed) || parsed.format !== BACKUP_FORMAT) {
    return { ok: false, error: '해따에서 내보낸 백업이 아니에요.' };
  }

  if (typeof parsed.version !== 'number' || parsed.version > BACKUP_VERSION) {
    return { ok: false, error: '더 새로운 버전의 해따에서 만든 백업이에요. 앱을 업데이트한 뒤 다시 시도해 주세요.' };
  }

  const data = parsed.data;
  if (!isRecord(data) || !Array.isArray(data.todos) || !Array.isArray(data.rewards)) {
    return { ok: false, error: '백업 내용이 손상됐어요.' };
  }

  const stickers = data.totalStickers;
  const totalStickers =
    typeof stickers === 'number' && Number.isFinite(stickers) && stickers > 0
      ? Math.floor(stickers)
      : 0;

  return {
    ok: true,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : null,
    data: {
      todos: parseTodosFromUnknown(data.todos),
      rewards: parseRewardsFromUnknown(data.rewards),
      totalStickers,
      categories: parseCategoriesFromUnknown(data.categories),
    },
  };
}
