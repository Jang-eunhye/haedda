'use client';

import { useMemo, useState, useEffect } from 'react';
import { Todo, TodoInput, TodoCompleteResult } from '../types';
import TodoCard from './TodoCard';
import TodoFormModal from './TodoFormModal';
import TodoDetailModal from './TodoDetailModal';
import ConfirmTodoModal from './ConfirmTodoModal';
import TodoCompleteResultModal from './TodoCompleteResultModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyState from './EmptyState';
import Fab from './Fab';
import SortSelect from './SortSelect';
import FilterChips from './FilterChips';
import FilterExcludeOption from './FilterExcludeOption';
import MissedTodosBanner from './MissedTodosBanner';
import { isMissedTodo, matchesTodoFilter, sortMissedTodos, TodoFilter } from '../utils/todoFilter';

const APP_TAGLINE = '할일을 완료하고 스티커를 모아보세요';

type TodoSort = 'recent' | 'deadline' | 'sticker-desc';

const TODO_FILTER_OPTIONS = [
  { value: 'all' as const, label: '전체' },
  { value: 'today' as const, label: '오늘' },
  { value: 'week' as const, label: '이번주' },
  { value: 'month' as const, label: '이번달' },
  { value: 'later' as const, label: '나중에' },
  { value: 'sticker' as const, label: '⭐', ariaLabel: '스티커' },
];

const TODO_SORT_OPTIONS = [
  { value: 'recent' as const, label: '최신순' },
  { value: 'deadline' as const, label: '마감일순' },
  { value: 'sticker-desc' as const, label: '스티커 많은 순' },
];

interface Props {
  todos: Todo[];
  onAddTodo: (todo: TodoInput) => void;
  onUpdateTodo: (id: string, data: TodoInput) => void;
  onDeleteTodo: (id: string) => void;
  onCompleteTodo: (id: string) => TodoCompleteResult | null;
}

export default function TodoTab({
  todos,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onCompleteTodo,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Todo | null>(null);
  const [editTarget, setEditTarget] = useState<Todo | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Todo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const [completeResult, setCompleteResult] = useState<TodoCompleteResult | null>(null);
  const [sort, setSort] = useState<TodoSort>('recent');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [excludeTodayFromWeek, setExcludeTodayFromWeek] = useState(true);
  const [excludeWeekFromMonth, setExcludeWeekFromMonth] = useState(true);
  const [missedExpanded, setMissedExpanded] = useState(false);

  const filterOptions = useMemo(
    () => ({ excludeTodayFromWeek, excludeWeekFromMonth }),
    [excludeTodayFromWeek, excludeWeekFromMonth]
  );

  const missedTodos = useMemo(
    () => sortMissedTodos(todos.filter(isMissedTodo)),
    [todos]
  );
  const missedTodoCount = missedTodos.length;

  useEffect(() => {
    if (missedTodoCount === 0) setMissedExpanded(false);
  }, [missedTodoCount]);

  const filteredTodos = useMemo(
    () => todos.filter(todo => matchesTodoFilter(todo, filter, filterOptions)),
    [todos, filter, filterOptions]
  );

  const sortedTodos = useMemo(() => {
    if (sort === 'recent') return [...filteredTodos].reverse();
    if (sort === 'deadline') {
      return [...filteredTodos].sort((a, b) =>
        (a.deadline ?? '9999-12-31').localeCompare(b.deadline ?? '9999-12-31')
      );
    }
    return [...filteredTodos].sort((a, b) => b.stickerCount - a.stickerCount);
  }, [filteredTodos, sort]);

  const handleCompleteClick = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) setConfirmTarget(todo);
  };

  const handleConfirmComplete = () => {
    if (!confirmTarget) return;
    const result = onCompleteTodo(confirmTarget.id);
    setConfirmTarget(null);
    if (result) setCompleteResult(result);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {todos.length === 0 ? (
        <EmptyState
          icon="🎯"
          tagline={APP_TAGLINE}
          title="아직 할일이 없어요"
          description="오른쪽 아래 + 버튼으로 첫 할일을 추가해 보세요"
        />
      ) : (
        <>
          <div className="shrink-0 mb-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              할일
              <span className="text-sm font-semibold text-muted tabular-nums">
                ({sortedTodos.length})
              </span>
            </h2>
          </div>
          {missedTodoCount > 0 && (
            <MissedTodosBanner
              count={missedTodoCount}
              expanded={missedExpanded}
              onToggle={() => setMissedExpanded(v => !v)}
              todos={missedTodos}
              onComplete={handleCompleteClick}
              onOpen={setDetailTarget}
            />
          )}
          {!missedExpanded && (
            <>
              <div className="shrink-0 mb-3 space-y-1.5">
                <FilterChips
                  value={filter}
                  onChange={setFilter}
                  options={TODO_FILTER_OPTIONS}
                  ariaLabel="할일 필터"
                />
                <div className="flex items-center justify-end gap-3">
                  {filter === 'week' && (
                    <>
                      <FilterExcludeOption
                        label="오늘 목록 제외"
                        checked={excludeTodayFromWeek}
                        onChange={setExcludeTodayFromWeek}
                      />
                      <span className="w-px h-4 bg-border shrink-0" aria-hidden />
                    </>
                  )}
                  {filter === 'month' && (
                    <>
                      <FilterExcludeOption
                        label="이번주 목록 제외"
                        checked={excludeWeekFromMonth}
                        onChange={setExcludeWeekFromMonth}
                      />
                      <span className="w-px h-4 bg-border shrink-0" aria-hidden />
                    </>
                  )}
                  <SortSelect
                    value={sort}
                    onChange={setSort}
                    options={TODO_SORT_OPTIONS}
                    ariaLabel="할일 목록 정렬"
                  />
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 pb-28">
                {sortedTodos.length === 0 ? (
                  <EmptyState
                    icon="🔍"
                    tagline={APP_TAGLINE}
                    title="해당하는 할일이 없어요"
                    description="다른 필터를 선택해 보세요"
                  />
                ) : (
                  <div className="space-y-3">
                    {sortedTodos.map(todo => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onComplete={handleCompleteClick}
                        onOpen={setDetailTarget}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {isAddOpen && (
        <TodoFormModal
          onClose={() => setIsAddOpen(false)}
          onSave={data => {
            onAddTodo(data);
            setIsAddOpen(false);
          }}
        />
      )}

      {detailTarget && (
        <TodoDetailModal
          todo={detailTarget}
          onClose={() => setDetailTarget(null)}
          onEdit={() => {
            setEditTarget(detailTarget);
            setDetailTarget(null);
          }}
          onDelete={() => setDeleteTarget(detailTarget)}
          onComplete={() => {
            setConfirmTarget(detailTarget);
            setDetailTarget(null);
          }}
        />
      )}

      {editTarget && (
        <TodoFormModal
          todo={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={data => {
            onUpdateTodo(editTarget.id, data);
            setEditTarget(null);
          }}
        />
      )}

      {confirmTarget && (
        <ConfirmTodoModal
          todo={confirmTarget}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={handleConfirmComplete}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="할일을 삭제할까요?"
          content={deleteTarget.content}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDeleteTodo(deleteTarget.id);
            setDeleteTarget(null);
            setDetailTarget(null);
            setEditTarget(null);
          }}
        />
      )}

      {completeResult && (
        <TodoCompleteResultModal
          content={completeResult.content}
          earned={completeResult.earned}
          stickerCount={completeResult.stickerCount}
          isRecurring={completeResult.isRecurring}
          nextDeadline={completeResult.nextDeadline}
          onConfirm={() => setCompleteResult(null)}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="할일 추가" />
    </div>
  );
}
