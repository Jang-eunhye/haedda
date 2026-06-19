import { Mission } from '../types';
import { formatDeadlineLabel, isDeadlineExpired } from '../utils/date';
import { formatRecurrenceLabel } from '../utils/recurrence';
import ItemMenu from './ItemMenu';
import StickerStar from './StickerStar';

interface Props {
  mission: Mission;
  onComplete: (id: string) => void;
  onEdit: (mission: Mission) => void;
  onDelete: (id: string) => void;
}

export default function MissionCard({ mission, onComplete, onEdit, onDelete }: Props) {
  const isExpired = isDeadlineExpired(mission.deadline);
  const isRecurring = !!mission.recurrence;

  return (
    <article className="group bg-surface rounded-2xl p-4 border border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <div
            className={`inline-flex flex-wrap items-center gap-0.5 ${isExpired ? 'opacity-40' : ''}`}
            aria-label={`스티커 ${mission.stickerCount}개`}
          >
            {Array.from({ length: mission.stickerCount }, (_, i) => (
              <StickerStar key={i} size="md" />
            ))}
          </div>
          <p className="mt-2 font-medium text-[15px] leading-snug break-words text-foreground">
            {mission.content}
          </p>
        </div>
        <ItemMenu onEdit={() => onEdit(mission)} onDelete={() => onDelete(mission.id)} />
      </div>

      <div
        className={`mt-2 text-xs flex items-center gap-1.5 flex-wrap ${
          isExpired ? 'text-danger' : 'text-muted'
        }`}
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{formatDeadlineLabel(mission.deadline)}</span>
        {isRecurring && mission.recurrence && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent-muted/50">
            <svg
              className="w-3 h-3 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {formatRecurrenceLabel(mission.recurrence)}
          </span>
        )}
        {isExpired && <span className="font-semibold text-danger/80">· 기한 초과</span>}
      </div>

      <div className="mt-3.5">
        <button
          onClick={() => onComplete(mission.id)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-foreground text-white hover:bg-foreground/90 active:scale-[0.98] transition-all duration-150"
        >
          완료하기
        </button>
        {isExpired && (
          <p className="text-center text-xs text-muted mt-2">
            기한이 지나 스티커를 받을 수 없어요
          </p>
        )}
      </div>
    </article>
  );
}
