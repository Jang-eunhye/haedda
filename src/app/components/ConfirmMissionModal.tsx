'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mission } from '../types';
import { isDeadlineExpired } from '../utils/date';
import { formatRecurrenceLabel } from '../utils/recurrence';

interface Props {
  mission: Mission;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmMissionModal({ mission, onCancel, onConfirm }: Props) {
  const [mounted, setMounted] = useState(false);
  const isExpired = isDeadlineExpired(mission.deadline);
  const expectedStickers = isExpired ? 0 : mission.stickerCount;

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
      onClick={onCancel}
    >
      <div
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 sm:pb-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-foreground">미션을 완료할까요?</h3>
          <p className="text-sm text-muted mt-2 break-words px-2">{mission.content}</p>
        </div>

        <div className="bg-background rounded-2xl p-4 text-center mb-5">
          {expectedStickers > 0 ? (
            <>
              <p className="text-xs font-medium text-muted mb-1">획득 예정 스티커</p>
              <p className="text-2xl font-bold text-accent tabular-nums">+{expectedStickers} ⭐</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted">획득 스티커 없음</p>
              <p className="text-xs text-muted mt-1">기한이 지나 스티커를 받을 수 없어요</p>
            </>
          )}
        </div>

        {mission.recurrence && (
          <p className="text-xs text-muted text-center mb-5">
            {formatRecurrenceLabel(mission.recurrence)} · 완료 후 다음 주기로 넘어갑니다
          </p>
        )}

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
            완료
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
