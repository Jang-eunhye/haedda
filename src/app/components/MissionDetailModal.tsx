'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mission } from '../types';
import {
  formatDeadlineLabel,
  getTodayISO,
  isDeadlineExpired,
  normalizeDeadline,
} from '../utils/date';
import { formatRecurrenceLabel } from '../utils/recurrence';
import StickerStar from './StickerStar';

interface Props {
  mission: Mission;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

function getDeadlineStatus(deadline: string, isRecurring: boolean): string {
  const normalized = normalizeDeadline(deadline);
  const today = getTodayISO();

  if (!isRecurring && today > normalized) return '기한 초과';
  if (today === normalized) return '오늘까지';

  const [y, m, d] = normalized.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((target.getTime() - todayStart.getTime()) / 86_400_000);
  return diff === 1 ? '내일까지' : `D-${diff}`;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 px-4">
      <span className="text-sm text-muted shrink-0">{label}</span>
      <div className="text-sm font-medium text-foreground text-right">{children}</div>
    </div>
  );
}

export default function MissionDetailModal({
  mission,
  onClose,
  onEdit,
  onDelete,
  onComplete,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const isExpired = isDeadlineExpired(mission.deadline);
  const isRecurring = !!mission.recurrence;
  const missedCount = mission.missedCount ?? 0;
  const streak = mission.consecutiveCompletions ?? 0;
  const showExpired = isExpired && !isRecurring;
  const deadlineStatus = getDeadlineStatus(mission.deadline, isRecurring);
  const showStreak = isRecurring && streak > 0;
  const showMissed = isRecurring && missedCount > 0;

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
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] sm:shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 sm:hidden" />

        <div className="relative flex items-center justify-center px-5 pt-4 pb-2 sm:px-6 sm:pt-5 min-h-[52px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-muted">미션 상세</span>
          <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <button
              type="button"
              onClick={onEdit}
              aria-label="수정"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="삭제"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-background transition-colors active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 pb-8 sm:px-6 sm:pb-6">
          <div
            className={`flex flex-wrap items-center justify-center gap-1 py-2 ${showExpired ? 'opacity-40' : ''}`}
            aria-label={`스티커 ${mission.stickerCount}개`}
          >
            {Array.from({ length: mission.stickerCount }, (_, i) => (
              <StickerStar key={i} size="lg" />
            ))}
          </div>

          <h2 className="mt-3 text-xl font-bold leading-snug break-words text-foreground text-center">
            {mission.content}
          </h2>

          {showStreak && (
            <div className="mt-4 rounded-xl bg-success-soft border border-success/20 px-3 py-3 text-center">
              <p className="text-2xl font-bold text-success tabular-nums">{streak}</p>
              <p className="text-xs text-muted mt-0.5">연속 완료</p>
            </div>
          )}

          {showMissed && (
            <div className="mt-4 rounded-xl bg-red-50 border border-danger/20 px-3 py-3 text-center">
              <p className="text-2xl font-bold text-danger tabular-nums">{missedCount}</p>
              <p className="text-xs text-muted mt-0.5">미완료</p>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-background border border-border divide-y divide-border">
            <InfoRow label="마감일">{formatDeadlineLabel(mission.deadline)}</InfoRow>
            <InfoRow label="남은 기한">
              <span className={showExpired ? 'text-danger' : ''}>{deadlineStatus}</span>
            </InfoRow>
            {isRecurring && mission.recurrence && (
              <InfoRow label="반복">{formatRecurrenceLabel(mission.recurrence)}</InfoRow>
            )}
            {!isRecurring && (
              <InfoRow label="유형">
                <span className="text-muted">1회성 미션</span>
              </InfoRow>
            )}
          </div>

          {isRecurring && (
            <p className="mt-3 text-xs text-muted text-center">
              완료하면 다음 주기로 자동 넘어가요
            </p>
          )}

          <button
            type="button"
            onClick={onComplete}
            className="w-full mt-5 py-3.5 rounded-xl text-sm font-semibold bg-foreground text-white hover:bg-foreground/90 active:scale-[0.98] transition-all duration-150"
          >
            완료하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
