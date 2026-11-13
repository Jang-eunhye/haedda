'use client';

import { useMemo, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import type { Todo, TodoCategory } from '@haedda/types';
import { searchTodos } from '@haedda/utils';
import EmptyState from './EmptyState';
import TodoCard from './TodoCard';

const SEARCH_TAGLINE = '필터와 상관없이 전체 할일에서 찾아요';

interface Props {
  todos: Todo[];
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
  onClose: () => void;
}

/** 필터와 상관없이 전체 할일에서 내용·메모·카테고리 이름으로 찾는다 */
export default function TodoSearchView({ todos, categories, onComplete, onOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchTodos(todos, query, categories), [todos, query, categories]);
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="shrink-0 mb-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-xl px-3 focus-within:border-foreground/30">
          <MdSearch size={18} className="text-muted shrink-0" aria-hidden />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
            }}
            placeholder="할일 내용, 메모, 카테고리로 찾기"
            aria-label="할일 검색"
            className="flex-1 min-w-0 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="검색 닫기"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground transition-colors"
        >
          <MdClose size={20} aria-hidden />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 pb-20">
        {!hasQuery ? (
          <EmptyState
            icon="🔍"
            tagline={SEARCH_TAGLINE}
            title="할일을 찾아보세요"
            description="할일 내용이나 메모, 카테고리 이름으로 찾을 수 있어요"
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="🔍"
            tagline={SEARCH_TAGLINE}
            title="찾는 할일이 없어요"
            description="다른 단어로 찾아보세요"
          />
        ) : (
          <>
            <p className="text-xs text-muted mb-2">{results.length}개 찾았어요</p>
            <div className="space-y-3">
              {results.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  categories={categories}
                  onComplete={onComplete}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
