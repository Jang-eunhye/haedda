'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ title, content, onCancel, onConfirm }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4"
      onClick={onCancel}
    >
      <div
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:pb-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted mt-2 break-words px-2">{content}</p>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-border text-sm text-muted font-semibold hover:bg-background transition-colors active:scale-[0.98]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
