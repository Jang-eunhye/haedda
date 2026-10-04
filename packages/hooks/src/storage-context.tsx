'use client';

import { createContext, useContext } from 'react';
import type { AppRepositories } from '@haedda/storage';

const StorageContext = createContext<AppRepositories | null>(null);

export function StorageProvider({
  storage,
  children,
}: {
  storage: AppRepositories;
  children: React.ReactNode;
}) {
  return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
}

export function useAppStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) {
    throw new Error('useAppStorage must be used within StorageProvider');
  }
  return ctx;
}
