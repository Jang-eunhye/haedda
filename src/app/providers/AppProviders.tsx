'use client';

import { CategoriesProvider } from '../hooks/useCategories';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <CategoriesProvider>{children}</CategoriesProvider>;
}
