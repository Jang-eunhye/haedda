'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { AppRepositories } from '@haedda/storage';
import { StorageProvider } from './storage-context';
import { CategoriesProvider } from './useCategories';
import { TodosProvider } from './useTodos';

const ReloadContext = createContext<(() => void) | null>(null);

export function AppDataProvider({
  storage,
  children,
}: {
  storage: AppRepositories;
  children: React.ReactNode;
}) {
  // 값이 바뀌면 아래 Provider들이 새로 만들어지면서 저장소에서 다시 불러온다 (백업 복원 후)
  const [generation, setGeneration] = useState(0);
  const reload = useCallback(() => setGeneration(g => g + 1), []);

  return (
    <StorageProvider storage={storage}>
      <ReloadContext.Provider value={reload}>
        <CategoriesProvider key={`categories-${generation}`}>
          <TodosProvider key={`todos-${generation}`}>{children}</TodosProvider>
        </CategoriesProvider>
      </ReloadContext.Provider>
    </StorageProvider>
  );
}

/** 저장소에서 데이터를 다시 불러온다. 화면 상태(열린 모달 등)는 처음으로 돌아간다 */
export function useReloadAppData() {
  const ctx = useContext(ReloadContext);
  if (!ctx) {
    throw new Error('useReloadAppData must be used within AppDataProvider');
  }
  return ctx;
}
