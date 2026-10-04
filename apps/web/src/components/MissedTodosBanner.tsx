'use client';

import { MdKeyboardArrowDown, MdWarningAmber } from 'react-icons/md';
import { Todo } from '@haedda/types';
import { TodoCategory } from '../utils/categories';
import TodoCard from './TodoCard';

interface Props {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  todos: Todo[];
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function MissedTodosBanner({
  count,
  expanded,
  onToggle,
  todos,
  categories,
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
      {expanded ? (
        <div className="flex items-center justify-between gap-2 py-1.5 shrink-0 px-4 sm:px-6">
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
            aria-label="놓친 할일 닫기"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-danger/10 transition-colors active:scale-[0.97]"
          >
            <MdKeyboardArrowDown
              size={26}
              className="transition-transform duration-200 rotate-180"
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label="놓친 할일 보기"
          className="flex items-center justify-between gap-2 w-full py-1.5 shrink-0 px-3 text-left rounded-2xl hover:bg-danger/5 transition-colors active:scale-[0.99]"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <MdWarningAmber className="shrink-0 text-danger" size={18} aria-hidden />
            <p className="text-sm font-semibold text-foreground leading-tight">
              놓친 할일{' '}
              <span className="tabular-nums text-danger">{count}</span>개
            </p>
          </div>
          <span className="shrink-0 w-7 h-7 flex items-center justify-center text-muted">
            <MdKeyboardArrowDown size={26} className="transition-transform duration-200" />
          </span>
        </button>
      )}

      {expanded && (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-3 space-y-2.5">
          {todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              categories={categories}
              onComplete={onComplete}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
