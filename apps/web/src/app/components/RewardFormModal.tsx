'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Reward } from '@haedda/types';
import { MdDeleteOutline } from 'react-icons/md';
import StickerCountPicker from './StickerCountPicker';

const CONTENT_MAX = 50;

interface Props {
  onClose: () => void;
  onSave: (data: Omit<Reward, 'id'>) => void;
  onDelete?: () => void;
  reward?: Reward;
}

export default function RewardFormModal({ onClose, onSave, onDelete, reward }: Props) {
  const isEdit = !!reward;
  const [content, setContent] = useState(reward?.content ?? '');
  const [stickerCost, setStickerCost] = useState(reward?.stickerCost ?? 1);
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
    if (!content.trim()) return;
    onSave({ content: content.trim(), stickerCost });
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

        <div
          className={`flex items-center justify-center min-h-[36px] mb-5 ${
            isEdit && onDelete ? 'relative' : ''
          }`}
        >
          <span className="text-sm font-semibold text-muted">
            {isEdit ? '보상 수정' : '새 보상'}
          </span>
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="삭제"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-background transition-colors active:scale-95"
            >
              <MdDeleteOutline size={18} aria-hidden />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              보상 내용
            </label>
            <div className="relative">
              <input
                type="text"
                value={content}
                onChange={e => setContent(e.target.value.slice(0, CONTENT_MAX))}
                placeholder="예) 아이스크림, 게임 30분"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-colors placeholder:text-muted/60"
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums ${
                  content.length >= CONTENT_MAX ? 'text-danger' : 'text-muted/60'
                }`}
              >
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              필요 스티커
            </label>
            <StickerCountPicker
              value={stickerCost}
              onChange={setStickerCost}
              max={99}
              inputAriaLabel="필요 스티커 개수"
            />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm text-muted font-semibold hover:bg-background transition-colors active:scale-[0.98]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-1 py-3 rounded-xl bg-foreground text-white text-sm font-semibold disabled:opacity-40 hover:bg-foreground/90 transition-all active:scale-[0.98]"
            >
              {isEdit ? '저장하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
