'use client';

import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import SettingsShell from './SettingsShell';

export default function SettingsPage() {
  return (
    <SettingsShell title="설정">
      <nav aria-label="설정 메뉴">
        <ul className="-mx-4 sm:-mx-6 divide-y divide-border border-b border-border">
          <li>
            <Link
              href="/settings/categories"
              className="flex items-center gap-3 px-4 sm:px-6 py-3.5 text-foreground hover:bg-background/60 active:bg-background transition-colors"
            >
              <span className="flex-1 text-sm font-medium">카테고리 관리</span>
              <MdChevronRight size={20} className="text-muted shrink-0" aria-hidden />
            </Link>
          </li>
          
        </ul>
      </nav>
    </SettingsShell>
  );
}
