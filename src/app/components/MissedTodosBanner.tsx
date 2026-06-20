'use client';

import { MdKeyboardArrowDown, MdWarningAmber } from 'react-icons/md';
import { Todo } from '../types';
import TodoCard from './TodoCard';

interface Props {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  todos: Todo[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function MissedTodosBanner({
  count,
  expanded,
  onToggle,
  todos,
  onComplete,
  onOpen,
}: Props) {
  return (
    <div
      className={`bg-red-50 overflow-hidden flex flex-col ${
        expanded
          ? 'flex-1 min-h-0 -mx-4 sm:-mx-6 -mb-4 rounded-none border-y border-danger/20'
          : 'mb-3 shrink-0 rounded-2xl border border-danger/20'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 py-1.5 shrink-0 ${
          expanded ? 'px-4 sm:px-6' : 'px-3'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <MdWarningAmber className="shrink-0 text-danger" size={18} aria-hidden />
          <p className="text-sm font-semibold text-foreground leading-tight">
            놓친 할일{' '}
            <span className="tabular-nums text-danger">{count}</span>개
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? '놓친 할일 닫기' : '놓친 할일 보기'}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-danger/10 transition-colors active:scale-[0.97]"
        >
          <MdKeyboardArrowDown
            size={18}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-3 space-y-2.5">
          {todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onComplete={onComplete}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
