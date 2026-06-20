'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Todo, TodoInput } from '../types';
import { getTodayISO, normalizeDeadline } from '../utils/date';
import { computeNextDeadline } from '../utils/recurrence';
import DatePicker from './DatePicker';
import RecurrencePicker, {
  buildRecurrenceFromForm,
  getFrequencyFromTodo,
  RecurrenceFrequency,
} from './RecurrencePicker';
import StickerStar from './StickerStar';

const CONTENT_MAX = 50;

interface Props {
  onClose: () => void;
  onSave: (data: TodoInput) => void;
  todo?: Todo;
}

export default function TodoFormModal({ onClose, onSave, todo }: Props) {
  const isEdit = !!todo;
  const [content, setContent] = useState(todo?.content ?? '');
  const [deadline, setDeadline] = useState(
    todo ? normalizeDeadline(todo.deadline) : getTodayISO()
  );
  const [stickerCount, setStickerCount] = useState(
    todo && todo.stickerCount > 0 ? todo.stickerCount : 1
  );
  const [hasSticker, setHasSticker] = useState((todo?.stickerCount ?? 0) > 0);
  const [isRecurring, setIsRecurring] = useState(!!todo?.recurrence);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(
    getFrequencyFromTodo(todo?.recurrence)
  );
  const [weekdays, setWeekdays] = useState<number[]>(todo?.recurrence?.weekdays ?? []);
  const [monthlyMode, setMonthlyMode] = useState<'day' | 'last'>(() => {
    if (todo?.recurrence?.type === 'monthly') {
      return todo.recurrence.dayOfMonth === 'last' ? 'last' : 'day';
    }
    return 'last';
  });
  const [dayOfMonth, setDayOfMonth] = useState<number>(
    typeof todo?.recurrence?.dayOfMonth === 'number' ? todo.recurrence.dayOfMonth : 1
  );
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
    if (isRecurring && frequency === 'weekly' && weekdays.length === 0) return;

    const recurrence = buildRecurrenceFromForm(
      isRecurring,
      frequency,
      weekdays,
      monthlyMode,
      dayOfMonth
    );

    let finalDeadline = deadline;
    if (recurrence) {
      finalDeadline = computeNextDeadline(recurrence, new Date(), true);
    } else if (!deadline) {
      return;
    }

    onSave({
      content: content.trim(),
      deadline: finalDeadline,
      stickerCount: hasSticker ? stickerCount : 0,
      recurrence,
    });
  };

  const adjustSticker = (delta: number) => {
    setStickerCount(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const canSubmit =
    content.trim() &&
    (isRecurring ? frequency !== 'weekly' || weekdays.length > 0 : !!deadline);

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
        <h3 className={`text-lg font-bold text-foreground ${isEdit ? 'mb-1' : 'mb-5'}`}>
          {isEdit ? '할일 수정' : '할일 추가'}
        </h3>
        {isEdit && (
          <p className="text-xs text-muted mb-5">할일 내용을 수정해 보세요</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-0">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              할일 내용
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value.slice(0, CONTENT_MAX))}
                placeholder="무엇을 할까요?"
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-colors placeholder:text-muted/60"
              />
              <span
                className={`absolute bottom-3 right-3 text-xs tabular-nums ${
                  content.length >= CONTENT_MAX ? 'text-danger' : 'text-muted/60'
                }`}
              >
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
          </div>

          <div className="border-t border-border/50 pt-5 mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">반복 할일</p>
              <button
                type="button"
                role="switch"
                aria-checked={isRecurring}
                onClick={() => setIsRecurring(v => !v)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
                  isRecurring ? 'bg-foreground' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isRecurring ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isRecurring && (
              <div className="mt-4">
                <RecurrencePicker
                  frequency={frequency}
                  onFrequencyChange={setFrequency}
                  weekdays={weekdays}
                  onWeekdaysChange={setWeekdays}
                  monthlyMode={monthlyMode}
                  onMonthlyModeChange={setMonthlyMode}
                  dayOfMonth={dayOfMonth}
                  onDayOfMonthChange={setDayOfMonth}
                />
              </div>
            )}
          </div>

          {!isRecurring && (
            <div className="border-t border-border/50 pt-5 mt-5">
              <label className="block text-sm font-semibold text-foreground mb-2">기한</label>
              <DatePicker value={deadline} onChange={setDeadline} />
            </div>
          )}

          <div className="border-t border-border/50 pt-5 mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">스티커 걸기</p>
              <button
                type="button"
                role="switch"
                aria-checked={hasSticker}
                onClick={() => setHasSticker(v => !v)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
                  hasSticker ? 'bg-foreground' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    hasSticker ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasSticker && (
              <div className="mt-4 flex items-center justify-center gap-6 py-2 bg-background rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => adjustSticker(-1)}
                  disabled={stickerCount <= 1}
                  className="w-10 h-10 rounded-xl bg-surface border border-border text-foreground font-bold text-lg hover:bg-background transition-colors disabled:opacity-30 active:scale-95"
                >
                  −
                </button>
                <div className="flex items-center gap-2 min-w-[80px] justify-center">
                  <StickerStar size="lg" />
                  <span className="text-2xl font-bold text-accent tabular-nums">{stickerCount}</span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustSticker(1)}
                  disabled={stickerCount >= 10}
                  className="w-10 h-10 rounded-xl bg-surface border border-border text-foreground font-bold text-lg hover:bg-background transition-colors disabled:opacity-30 active:scale-95"
                >
                  +
                </button>
              </div>
            )}
            {!isEdit && (
              <p className="text-xs text-muted mt-3">완료하면 스티커를 받을 수 있어요</p>
            )}
          </div>

          <div className="flex gap-2.5 pt-5 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm text-muted font-semibold hover:bg-background transition-colors active:scale-[0.98]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
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
