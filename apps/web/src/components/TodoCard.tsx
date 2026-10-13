import { MdCalendarToday, MdOutlineAutorenew } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import { Todo } from '@haedda/types';
import { TodoCategory } from '../utils/categories';
import { formatDeadlineCardLine, formatRecurrenceLabel, isDeadlineExpired } from '@haedda/utils';
import StickerRow from './StickerRow';
import CategoryStripe from './CategoryStripe';

interface Props {
  todo: Todo;
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function TodoCard({ todo, categories, onComplete, onOpen }: Props) {
  const isExpired = isDeadlineExpired(todo.deadline);
  const isRecurring = !!todo.recurrence;
  const missedCount = todo.missedCount ?? 0;
  const streak = todo.consecutiveCompletions ?? 0;
  const isOneTimeExpired = !isRecurring && isExpired;
  const deadlineLine = formatDeadlineCardLine(todo.deadline);
  const showStickerRow = todo.stickerCount > 0;
  const showRecurringStatus =
    (isRecurring && missedCount > 0) || (isRecurring && missedCount === 0 && streak > 0);
  const showMetaSection = showRecurringStatus || !!deadlineLine;

  return (
    <article className="group flex overflow-hidden bg-surface rounded-2xl border border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {todo.categoryId && (
        <CategoryStripe categoryId={todo.categoryId} categories={categories} />
      )}
      <div className="flex-1 min-w-0 pt-2.5 pb-2 px-4">
        <button
          type="button"
          onClick={() => onOpen(todo)}
          className="w-full text-left cursor-pointer rounded-xl -m-1 p-1 hover:bg-background/60 transition-colors active:scale-[0.995] flex flex-col gap-1.5"
        >
          <div className="flex flex-col gap-1.5">
            {showStickerRow && (
              <StickerRow
                count={todo.stickerCount}
                size="md"
                crossedOut={isOneTimeExpired}
              />
            )}

            <div className="flex items-center flex-wrap gap-x-1.5 font-medium text-[15px] leading-snug break-words text-foreground">
              {isRecurring && todo.recurrence && (
                <span className="inline-flex align-middle shrink-0 items-center gap-1 text-[11px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent-muted/50">
                  <MdOutlineAutorenew size={12} className="shrink-0" aria-hidden />
                  {formatRecurrenceLabel(todo.recurrence)}
                </span>
              )}
              {todo.content}
            </div>
          </div>

          {showMetaSection && (
            <div className="flex flex-col gap-1">
              {isRecurring && missedCount > 0 && (
                <p className="text-xs text-danger">미완료 {missedCount}회</p>
              )}

              {isRecurring && missedCount === 0 && streak > 0 && (
                <p className="text-xs text-success">{streak}회 연속 완료</p>
              )}

              {deadlineLine && (
                <div
                  className={`text-xs flex items-center gap-1.5 flex-wrap ${
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
            </div>
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
