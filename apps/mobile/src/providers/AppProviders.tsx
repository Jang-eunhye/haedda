import { AppDataProvider } from '@haedda/hooks';
import { appStorage } from '@/src/storage';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppDataProvider storage={appStorage}>{children}</AppDataProvider>;
}
