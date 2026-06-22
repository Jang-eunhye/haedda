'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CategoryColor,
  CATEGORY_COLOR_CLASS,
  CATEGORY_COLOR_LABELS,
  CATEGORY_COLORS,
  TodoCategory,
} from '../utils/categories';

const LABEL_MAX = 10;

interface Props {
  onClose: () => void;
  onSave: (data: { label: string; color: CategoryColor }) => void;
  category?: TodoCategory;
}

export default function CategoryFormModal({ onClose, onSave, category }: Props) {
  const isEdit = !!category;
  const [label, setLabel] = useState(category?.label ?? '');
  const [color, setColor] = useState<CategoryColor>(category?.color ?? 'red');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSave({ label: label.trim(), color });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:pb-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-center min-h-[36px] mb-5">
          <span className="text-sm font-semibold text-muted">
            {isEdit ? '카테고리 수정' : '새 카테고리'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              이름
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value.slice(0, LABEL_MAX))}
              placeholder="예: 업무"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              색상
            </label>
            <div
              className="flex flex-wrap gap-3"
              role="radiogroup"
              aria-label="카테고리 색상"
            >
              {CATEGORY_COLORS.map(value => {
                const selected = color === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={CATEGORY_COLOR_LABELS[value]}
                    onClick={() => setColor(value)}
                    className={`w-8 h-8 rounded-full shrink-0 transition-all active:scale-95 ${CATEGORY_COLOR_CLASS[value]} ${
                      selected
                        ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!label.trim()}
            className="w-full py-3.5 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {isEdit ? '저장' : '추가'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
