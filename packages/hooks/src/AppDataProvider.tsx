'use client';

import type { AppRepositories } from '@haedda/storage';
import { StorageProvider } from './storage-context';
import { CategoriesProvider } from './useCategories';
import { TodosProvider } from './useTodos';

export function AppDataProvider({
  storage,
  children,
}: {
  storage: AppRepositories;
  children: React.ReactNode;
}) {
  return (
    <StorageProvider storage={storage}>
      <CategoriesProvider>
        <TodosProvider>{children}</TodosProvider>
      </CategoriesProvider>
    </StorageProvider>
  );
}
