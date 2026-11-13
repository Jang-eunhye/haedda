'use client';

import { useCallback } from 'react';
import { type BackupData, serializeBackup } from '@haedda/domain';
import { restoreBackup } from '@haedda/storage';
import { useReloadAppData } from './AppDataProvider';
import { useAppStorage } from './storage-context';
import { useCategories } from './useCategories';
import { useTodos } from './useTodos';

export function useBackup() {
  const appStorage = useAppStorage();
  const reload = useReloadAppData();
  const { todos, rewards, totalStickers } = useTodos();
  const { categories } = useCategories();

  /** 지금 화면의 데이터를 백업 텍스트로 만든다 */
  const exportBackup = useCallback(
    () => serializeBackup({ todos, rewards, totalStickers, categories }),
    [todos, rewards, totalStickers, categories]
  );

  /** 백업 데이터로 전체를 덮어쓰고 다시 불러온다 */
  const restore = useCallback(
    async (data: BackupData) => {
      await restoreBackup(appStorage, data);
      reload();
    },
    [appStorage, reload]
  );

  const summary = { todos: todos.length, rewards: rewards.length, totalStickers, categories: categories.length };

  return { exportBackup, restore, summary };
}
