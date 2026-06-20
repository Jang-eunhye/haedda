'use client';

import { useMemo, useState } from 'react';
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
import { matchesTodoFilter, TodoFilter } from '../utils/todoFilter';

const APP_TAGLINE = '할일을 완료하고 스티커를 모아보세요';

type TodoSort = 'registered' | 'deadline' | 'sticker-desc';

const TODO_FILTER_OPTIONS = [
  { value: 'all' as const, label: '전체' },
  { value: 'today' as const, label: '오늘' },
  { value: 'week' as const, label: '이번주' },
  { value: 'month' as const, label: '이번달' },
  { value: 'sticker' as const, label: '스티커' },
];

const TODO_SORT_OPTIONS = [
  { value: 'registered' as const, label: '등록순' },
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
  const [sort, setSort] = useState<TodoSort>('registered');
  const [filter, setFilter] = useState<TodoFilter>('all');

  const filteredTodos = useMemo(
    () => todos.filter(todo => matchesTodoFilter(todo, filter)),
    [todos, filter]
  );

  const sortedTodos = useMemo(() => {
    if (sort === 'registered') return filteredTodos;
    if (sort === 'deadline') {
      return [...filteredTodos].sort((a, b) => a.deadline.localeCompare(b.deadline));
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
    <div className="pb-28">
      {todos.length === 0 ? (
        <EmptyState
          icon="🎯"
          tagline={APP_TAGLINE}
          title="아직 할일이 없어요"
          description="오른쪽 아래 + 버튼으로 첫 할일을 추가해 보세요"
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              할일
              <span className="text-sm font-semibold text-muted tabular-nums">
                ({sortedTodos.length})
              </span>
            </h2>
            <SortSelect
              value={sort}
              onChange={setSort}
              options={TODO_SORT_OPTIONS}
              ariaLabel="할일 정렬"
            />
          </div>
          <div className="mb-4">
            <FilterChips
              value={filter}
              onChange={setFilter}
              options={TODO_FILTER_OPTIONS}
              ariaLabel="할일 필터"
            />
          </div>
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
          isRecurring={completeResult.isRecurring}
          nextDeadline={completeResult.nextDeadline}
          onConfirm={() => setCompleteResult(null)}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="할일 추가" />
    </div>
  );
}
