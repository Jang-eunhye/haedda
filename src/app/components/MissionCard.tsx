import { Mission } from '../types';
import { formatDeadlineLabel, isDeadlineExpired } from '../utils/date';
import { formatRecurrenceLabel } from '../utils/recurrence';
import ItemMenu from './ItemMenu';

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
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[15px] leading-snug break-words text-foreground">
            {mission.content}
          </p>
          {isRecurring && mission.recurrence && (
            <span className="inline-block mt-2 text-[11px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent-muted/50">
              {formatRecurrenceLabel(mission.recurrence)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-accent-soft px-2.5 py-1 rounded-full border border-accent-muted/50">
            <span className="text-sm leading-none">⭐</span>
            <span className="text-xs font-bold text-accent">×{mission.stickerCount}</span>
          </div>
          <ItemMenu onEdit={() => onEdit(mission)} onDelete={() => onDelete(mission.id)} />
        </div>
      </div>

      <div
        className={`mt-2.5 text-xs flex items-center gap-1.5 ${
          isExpired ? 'text-danger' : 'text-muted'
        }`}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>
          {isRecurring ? '이번 마감' : '마감'} · {formatDeadlineLabel(mission.deadline)}
        </span>
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
