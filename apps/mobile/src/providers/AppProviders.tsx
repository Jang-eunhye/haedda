import { CategoriesProvider } from '@/src/hooks/useCategories';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <CategoriesProvider>{children}</CategoriesProvider>;
}
