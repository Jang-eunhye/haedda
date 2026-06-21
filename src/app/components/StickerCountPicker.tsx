'use client';

import { useState, useEffect, useRef } from 'react';
import StickerStar from './StickerStar';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  inputAriaLabel?: string;
  className?: string;
}

export default function StickerCountPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  inputAriaLabel = '스티커 개수',
  className = '',
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  const adjust = (delta: number) => {
    onChange(clamp(value + delta));
  };

  const startEdit = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const commitEdit = () => {
    const parsed = parseInt(draft, 10);
    if (!Number.isNaN(parsed)) {
      onChange(clamp(parsed));
    }
    setEditing(false);
  };

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  return (
    <div
      className={`flex items-center justify-center gap-6 py-2 bg-background rounded-xl border border-border ${className}`}
    >
      <button
        type="button"
        onClick={() => adjust(-1)}
        disabled={value <= min}
        className="w-10 h-10 rounded-xl bg-surface border border-border text-foreground font-bold text-lg hover:bg-background transition-colors disabled:opacity-30 active:scale-95"
      >
        −
      </button>
      <div className="flex items-center gap-2 min-w-[80px] justify-center">
        <StickerStar size="lg" />
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={e => setDraft(e.target.value.replace(/\D/g, ''))}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitEdit();
              }
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
            aria-label={inputAriaLabel}
            className="w-14 text-2xl font-bold text-accent tabular-nums text-center bg-transparent focus:outline-none border-b-2 border-accent/40"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`${inputAriaLabel} 직접 입력`}
            className="text-2xl font-bold text-accent tabular-nums hover:opacity-70 transition-opacity"
          >
            {value}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => adjust(1)}
        disabled={value >= max}
        className="w-10 h-10 rounded-xl bg-surface border border-border text-foreground font-bold text-lg hover:bg-background transition-colors disabled:opacity-30 active:scale-95"
      >
        +
      </button>
    </div>
  );
}
