'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Reward } from '../types';
import { MdRemove } from 'react-icons/md';
import StickerStar from './StickerStar';

interface Props {
  reward: Reward;
  totalStickers: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClaimRewardModal({ reward, totalStickers, onClose, onConfirm }: Props) {
  const [mounted, setMounted] = useState(false);
  const canClaim = totalStickers >= reward.stickerCost;
  const remaining = totalStickers - reward.stickerCost;

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
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:pb-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent-soft border border-accent-muted/50 flex items-center justify-center text-3xl">
            🎁
          </div>
          <h3 className="text-lg font-bold text-foreground">{reward.content}</h3>
          <p className="text-sm text-muted mt-1">보상을 받을까요?</p>
        </div>

        <div className="bg-background rounded-2xl p-4 space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-muted">현재 보유</span>
            <span className="font-semibold text-foreground tabular-nums">{totalStickers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">차감 스티커</span>
            <span className="font-semibold text-foreground inline-flex items-center gap-3 tabular-nums">
              <MdRemove size={16} className="text-muted shrink-0" aria-hidden />
              {reward.stickerCost}
            </span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-sm">
            <span className="text-muted">받은 후</span>
            <span className={`font-bold tabular-nums inline-flex items-center gap-1 ${canClaim ? 'text-foreground' : 'text-danger'}`}>
              <StickerStar size="sm" /> {canClaim ? remaining : totalStickers}
            </span>
          </div>
        </div>

        {!canClaim && (
          <p className="text-xs text-danger text-center mb-4">
            스티커가 부족해요. 미션을 완료하고 더 모아보세요!
          </p>
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-sm text-muted font-semibold hover:bg-background transition-colors active:scale-[0.98]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canClaim}
            className="flex-1 py-3 rounded-xl bg-foreground text-white text-sm font-semibold disabled:opacity-40 hover:bg-foreground/90 transition-all active:scale-[0.98]"
          >
            받기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
