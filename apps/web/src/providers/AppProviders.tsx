'use client';

import { AppDataProvider } from '@haedda/hooks';
import { appStorage } from '../storage';
import AppVersionGuard from '../components/AppVersionGuard';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppVersionGuard>
      <AppDataProvider storage={appStorage}>{children}</AppDataProvider>
    </AppVersionGuard>
  );
}
