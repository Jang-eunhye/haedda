'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDeadlineLabel } from '../utils/date';
import StickerStar from './StickerStar';

interface Props {
  content: string;
  earned: number;
  stickerCount: number;
  isRecurring: boolean;
  nextDeadline?: string;
  onConfirm: () => void;
}

export default function TodoCompleteResultModal({
  content,
  earned,
  stickerCount,
  isRecurring,
  nextDeadline,
  onConfirm,
}: Props) {
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:pb-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-success-soft flex items-center justify-center text-3xl">
            🎉
          </div>
          <h3 className="text-lg font-bold text-foreground">할일 완료!</h3>
          <p className="text-sm text-muted mt-1 break-words px-2">{content}</p>
        </div>

        {stickerCount > 0 && (
          <div className="bg-background rounded-2xl p-5 text-center mb-4">
            {earned > 0 ? (
              <>
                <p className="text-xs font-medium text-muted mb-1">획득 스티커</p>
                <p className="text-3xl font-bold text-accent tabular-nums inline-flex items-center justify-center gap-1">
                  +{earned} <StickerStar size="xl" />
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted">스티커 없음</p>
                <p className="text-xs text-muted mt-1">기한이 지나 스티커를 받지 못했어요</p>
              </>
            )}
          </div>
        )}

        {isRecurring && nextDeadline && (
          <p className="text-xs text-muted text-center mb-5">
            다음 마감: {formatDeadlineLabel(nextDeadline)}
          </p>
        )}

        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-3 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98]"
        >
          확인
        </button>
      </div>
    </div>,
    document.body
  );
}
