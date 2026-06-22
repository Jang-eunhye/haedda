'use client';

import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import SettingsShell from './SettingsShell';

export default function SettingsPage() {
  return (
    <SettingsShell title="설정">
      <nav aria-label="설정 메뉴">
        <Link
          href="/settings/categories"
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border bg-background hover:bg-background/80 transition-colors active:scale-[0.99]"
        >
          <span className="flex-1 text-sm font-semibold text-foreground">카테고리 관리</span>
          <MdChevronRight size={20} className="text-muted shrink-0" aria-hidden />
        </Link>
      </nav>
    </SettingsShell>
  );
}
