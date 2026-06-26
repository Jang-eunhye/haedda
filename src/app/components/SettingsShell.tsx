'use client';

import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { APP_HEADER_CLASS, APP_HEADER_ICON_BTN_CLASS } from './appShellClasses';

interface Props {
  title: string;
  backHref?: string;
  children: React.ReactNode;
}

export default function SettingsShell({ title, backHref = '/', children }: Props) {
  return (
    <div className="h-dvh bg-background overflow-hidden">
      <div className="mx-auto w-full max-w-lg h-full flex flex-col sm:py-6 sm:px-4">
        <div className="flex flex-col h-full bg-surface sm:rounded-3xl sm:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] sm:border sm:border-border overflow-hidden">
          <header className={APP_HEADER_CLASS}>
            <div className="flex items-center gap-2 w-full min-h-0">
              <Link
                href={backHref}
                aria-label="뒤로"
                className={APP_HEADER_ICON_BTN_CLASS}
              >
                <MdArrowBack size={20} aria-hidden />
              </Link>
              <h1 className="text-lg font-bold text-foreground tracking-tight truncate">
                {title}
              </h1>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
