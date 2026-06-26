'use client';

import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

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
          <header className="shrink-0 px-4 pt-5 pb-4 sm:px-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <Link
                href={backHref}
                aria-label="뒤로"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors active:scale-95 shrink-0"
              >
                <MdArrowBack size={20} aria-hidden />
              </Link>
              <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
