import { MdCalendarToday, MdOutlineAutorenew } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import { Todo } from '../types';
import { formatDeadlineCardLine, isDeadlineExpired } from '../utils/date';
import { formatRecurrenceLabel } from '../utils/recurrence';
import StickerStar from './StickerStar';

interface Props {
  todo: Todo;
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function TodoCard({ todo, onComplete, onOpen }: Props) {
  const isExpired = isDeadlineExpired(todo.deadline);
  const isRecurring = !!todo.recurrence;
  const missedCount = todo.missedCount ?? 0;
  const streak = todo.consecutiveCompletions ?? 0;
  const isOneTimeExpired = !isRecurring && isExpired;
  const showMissedStripe = isRecurring && missedCount > 0;
  const deadlineLine = formatDeadlineCardLine(todo.deadline);
  const showStickerRow = todo.stickerCount > 0;

  return (
    <article className="group flex overflow-hidden bg-surface rounded-2xl border border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {showMissedStripe && (
        <div className="w-1 shrink-0 bg-danger" aria-hidden />
      )}
      <div className="flex-1 min-w-0 py-4 px-4">
        <button
          type="button"
          onClick={() => onOpen(todo)}
          className="w-full text-left cursor-pointer rounded-xl -m-1 p-1 hover:bg-background/60 transition-colors active:scale-[0.995]"
        >
          {showStickerRow && (
            <div
              className={`flex flex-wrap items-center gap-0.5 mb-2 ${isOneTimeExpired ? 'opacity-40' : ''}`}
              aria-label={`스티커 ${todo.stickerCount}개`}
            >
              {Array.from({ length: todo.stickerCount }, (_, i) => (
                <StickerStar key={i} size="md" />
              ))}
            </div>
          )}

          <p className="font-medium text-[15px] leading-snug break-words text-foreground">
            {isRecurring && todo.recurrence && (
              <span className="inline-flex align-middle shrink-0 items-center gap-1 mr-1.5 text-[11px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent-muted/50">
                <MdOutlineAutorenew size={12} className="shrink-0" aria-hidden />
                {formatRecurrenceLabel(todo.recurrence)}
              </span>
            )}
            {todo.content}
          </p>

          {isRecurring && missedCount > 0 && (
            <p className="mt-1.5 text-xs text-danger">미완료 {missedCount}회</p>
          )}

          {isRecurring && missedCount === 0 && streak > 0 && (
            <p className="mt-1.5 text-xs text-success">{streak}회 연속 완료</p>
          )}

          {deadlineLine && (
            <div
              className={`mt-2 text-xs flex items-center gap-1.5 flex-wrap ${
                isOneTimeExpired ? 'text-danger' : 'text-muted'
              }`}
            >
              <MdCalendarToday size={14} className="shrink-0" aria-hidden />
              <span>{deadlineLine.label}</span>
              <span
                className={`inline-flex items-center text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full border ${
                  isOneTimeExpired
                    ? 'text-danger bg-red-50 border-danger/20'
                    : 'text-muted bg-background border-border'
                }`}
              >
                {deadlineLine.dday}
              </span>
            </div>
          )}

          {isOneTimeExpired && todo.stickerCount > 0 && (
            <p className="text-xs text-muted mt-2">기한이 지나 스티커를 받을 수 없어요</p>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onComplete(todo.id)}
        aria-label="완료하기"
        className="w-10 shrink-0 flex items-center justify-center bg-foreground text-background hover:opacity-90 active:opacity-80 transition-opacity cursor-pointer"
      >
        <FiCheck size={20} strokeWidth={2.5} aria-hidden />
      </button>
    </article>
  );
}
