'use client';

import { CategoriesProvider } from '../hooks/useCategories';
import AppVersionGuard from '../components/AppVersionGuard';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppVersionGuard>
      <CategoriesProvider>{children}</CategoriesProvider>
    </AppVersionGuard>
  );
}
