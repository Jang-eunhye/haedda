'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="메뉴"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-surface border border-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1 min-w-[104px] overflow-hidden">
          <button
            type="button"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-background transition-colors"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-background transition-colors"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
