'use client';

import { useMemo, useState } from 'react';
import { FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineAutorenew } from 'react-icons/md';
import type { CategoryColor, HistoryEntry, Todo } from '@haedda/types';
import {
  buildMonthGrid,
  formatCalendarDayTitle,
  groupCompletionsByDay,
  groupTodosByDeadline,
  shiftMonth,
} from '@haedda/domain';
import { getTodayISO, parseDateParts } from '@haedda/utils';
import { TodoCategory } from '../utils/categories';
import ViewModeToggle, { type TodoViewMode } from './ViewModeToggle';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 달력 점 색 (카테고리 없으면 회색) */
const DOT_CLASS: Record<CategoryColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  lime: 'bg-lime-500',
  yellow: 'bg-yellow-400',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
};

/** 체크박스 테두리 색 */
const RING_CLASS: Record<CategoryColor, string> = {
  red: 'border-red-500',
  orange: 'border-orange-500',
  lime: 'border-lime-500',
  yellow: 'border-yellow-400',
  indigo: 'border-indigo-500',
  teal: 'border-teal-500',
  cyan: 'border-cyan-500',
  blue: 'border-blue-500',
  violet: 'border-violet-500',
  pink: 'border-pink-500',
};

interface Props {
  todos: Todo[];
  history: HistoryEntry[];
  categories: TodoCategory[];
  viewMode: TodoViewMode;
  onViewModeChange: (mode: TodoViewMode) => void;
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

function colorOf(categories: TodoCategory[], categoryId?: string): CategoryColor | undefined {
  return categories.find(c => c.id === categoryId)?.color;
}

function TodoRow({
  todo,
  color,
  onComplete,
  onOpen,
}: {
  todo: Todo;
  color?: CategoryColor;
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}) {
  return (
    <li className="flex items-center gap-3 py-3 px-1">
      <button
        type="button"
        aria-label={`${todo.content} 완료하기`}
        onClick={() => onComplete(todo.id)}
        className={`w-6 h-6 shrink-0 rounded-full border-2 bg-transparent hover:bg-background active:scale-95 transition ${
          color ? RING_CLASS[color] : 'border-zinc-300'
        }`}
      />
      <button
        type="button"
        onClick={() => onOpen(todo)}
        className="flex-1 min-w-0 flex items-center gap-1.5 text-left"
      >
        <span className="text-[15px] font-medium text-foreground truncate">{todo.content}</span>
        {todo.recurrence && (
          <MdOutlineAutorenew size={14} className="shrink-0 text-muted" aria-label="반복" />
        )}
      </button>
      {todo.stickerCount > 0 && (
        <span className="shrink-0 text-[13px] tracking-[1px]" aria-label={`스티커 ${todo.stickerCount}개`}>
          {todo.stickerCount <= 3 ? '⭐'.repeat(todo.stickerCount) : `⭐ ${todo.stickerCount}`}
        </span>
      )}
    </li>
  );
}

function CompletedRow({ entry }: { entry: HistoryEntry }) {
  return (
    <li className="flex items-center gap-3 py-3 px-1">
      <span
        aria-label="완료함"
        className="w-6 h-6 shrink-0 rounded-full bg-accent text-white flex items-center justify-center"
      >
        <FiCheck size={14} strokeWidth={3} aria-hidden />
      </span>
      <span className="flex-1 min-w-0 text-[15px] font-medium text-muted truncate">{entry.content}</span>
      {entry.stickers > 0 && (
        <span className="shrink-0 text-[13px] font-bold text-accent tabular-nums">+{entry.stickers} ⭐</span>
      )}
    </li>
  );
}

export default function TodoCalendarView({
  todos,
  history,
  categories,
  viewMode,
  onViewModeChange,
  onComplete,
  onOpen,
}: Props) {
  const today = getTodayISO();
  const initial = parseDateParts(today);
  const [month, setMonth] = useState({ year: initial.year, month: initial.month });
  const [selected, setSelected] = useState(today);
  const [showNoDeadline, setShowNoDeadline] = useState(false);

  const grid = useMemo(() => buildMonthGrid(month.year, month.month), [month]);
  const todosByDay = useMemo(() => groupTodosByDeadline(todos), [todos]);
  const completionsByDay = useMemo(() => groupCompletionsByDay(history), [history]);
  const noDeadlineTodos = useMemo(() => todos.filter(t => !t.deadline), [todos]);

  const selectedTodos = todosByDay.get(selected) ?? [];
  const selectedDone = completionsByDay.get(selected) ?? [];
  const selectedEarned = selectedDone.reduce((sum, e) => sum + Math.max(0, e.stickers), 0);

  const moveMonth = (delta: number) => {
    const next = shiftMonth(month.year, month.month, delta);
    setMonth(next);
    const thisMonth = parseDateParts(today);
    const isCurrent = next.year === thisMonth.year && next.month === thisMonth.month;
    setSelected(
      isCurrent ? today : `${next.year}-${String(next.month).padStart(2, '0')}-01`
    );
  };

  const isEmptyDay = selectedTodos.length === 0 && selectedDone.length === 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 pb-24">
      <div className="flex items-center justify-between pt-1 pb-3">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {month.year !== initial.year ? `${month.year}년 ` : ''}
            {month.month}월
          </h2>
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:bg-background"
          >
            <FiChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:bg-background"
          >
            <FiChevronRight size={18} aria-hidden />
          </button>
        </div>
        <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
      </div>

      <div className="grid grid-cols-7 mb-0.5" aria-hidden>
        {WEEKDAYS.map((label, i) => (
          <span
            key={label}
            className={`text-center text-[11px] leading-4 font-medium ${
              i === 0 ? 'text-red-500/75' : 'text-muted'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5" role="group" aria-label={`${month.month}월 달력`}>
        {grid.map((cell, i) => {
          if (!cell) return <span key={`blank-${i}`} />;
          const dayTodos = todosByDay.get(cell.day) ?? [];
          const done = (completionsByDay.get(cell.day)?.length ?? 0) > 0;
          const isSelected = cell.day === selected;
          const isToday = cell.day === today;
          const isPast = cell.day < today;
          let circle = 'text-foreground';
          if (isSelected) circle = 'bg-foreground text-white';
          else if (done) circle = 'bg-accent-muted text-foreground';
          else if (isPast) circle = 'text-zinc-400';
          return (
            <button
              key={cell.day}
              type="button"
              aria-label={`${month.month}월 ${cell.date}일${done ? ', 완료한 날' : ''}${
                dayTodos.length > 0 ? `, 할일 ${dayTodos.length}개` : ''
              }`}
              aria-pressed={isSelected}
              onClick={() => setSelected(cell.day)}
              className="h-11 flex flex-col items-center gap-[3px]"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm tabular-nums transition-colors ${circle} ${
                  isToday ? 'font-bold' : 'font-medium'
                } ${isToday && !isSelected ? 'ring-1 ring-foreground/30' : ''}`}
              >
                {cell.date}
              </span>
              <span className="h-1 flex gap-0.5">
                {dayTodos.slice(0, 3).map(todo => {
                  const color = colorOf(categories, todo.categoryId);
                  return (
                    <span
                      key={todo.id}
                      className={`w-1 h-1 rounded-full ${color ? DOT_CLASS[color] : 'bg-zinc-400'}`}
                    />
                  );
                })}
              </span>
            </button>
          );
        })}
      </div>

      <section aria-label="고른 날의 할일">
        <div className="flex items-baseline justify-between px-1 pt-5 pb-1">
          <h3 className="text-[15px] font-bold text-foreground">
            {selected === today ? '오늘 · ' : ''}
            {formatCalendarDayTitle(selected)}
          </h3>
          {selectedEarned > 0 && (
            <span className="text-[13px] font-bold text-accent tabular-nums">+{selectedEarned} ⭐</span>
          )}
        </div>

        {isEmptyDay ? (
          <p className="px-1 py-4 text-sm text-muted">
            {selected < today ? '이날은 완료한 할일이 없어요' : '이날 마감인 할일이 없어요'}
          </p>
        ) : (
          <ul>
            {selectedDone.map(entry => (
              <CompletedRow key={entry.id} entry={entry} />
            ))}
            {selectedTodos.map(todo => (
              <TodoRow
                key={todo.id}
                todo={todo}
                color={colorOf(categories, todo.categoryId)}
                onComplete={onComplete}
                onOpen={onOpen}
              />
            ))}
          </ul>
        )}
      </section>

      {noDeadlineTodos.length > 0 && (
        <section aria-label="기한 없는 할일" className="pt-3">
          <button
            type="button"
            onClick={() => setShowNoDeadline(v => !v)}
            aria-expanded={showNoDeadline}
            className="mx-1 flex items-center gap-1 px-3 py-2 rounded-full bg-zinc-100 text-[13px] font-semibold text-muted"
          >
            기한 없음 <span className="text-foreground tabular-nums">{noDeadlineTodos.length}</span>
            <FiChevronRight
              size={14}
              aria-hidden
              className={`transition-transform ${showNoDeadline ? 'rotate-90' : ''}`}
            />
          </button>
          {showNoDeadline && (
            <ul className="pt-1">
              {noDeadlineTodos.map(todo => (
                <TodoRow
                  key={todo.id}
                  todo={todo}
                  color={colorOf(categories, todo.categoryId)}
                  onComplete={onComplete}
                  onOpen={onOpen}
                />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
