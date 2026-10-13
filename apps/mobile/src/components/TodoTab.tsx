import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Todo, TodoCategory, TodoCompleteResult, TodoInput } from '@haedda/types';
import {
  isMissedTodo,
  matchesCategoryFilter,
  matchesTodoFilter,
  sortMissedTodos,
  type TodoFilter,
} from '@haedda/utils';
import CategoryFilterChips from './CategoryFilterChips';
import ConfirmTodoModal from './ConfirmTodoModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyState from './EmptyState';
import Fab from './Fab';
import FilterChips from './FilterChips';
import FilterExcludeOption from './FilterExcludeOption';
import MissedTodosBanner from './MissedTodosBanner';
import SortSelect from './SortSelect';
import TodoCard from './TodoCard';
import TodoCompleteResultModal from './TodoCompleteResultModal';
import TodoDetailModal from './TodoDetailModal';
import TodoFormModal from './TodoFormModal';
import { colors } from '@/src/theme/colors';

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
  categories: TodoCategory[];
  onAddTodo: (todo: TodoInput) => void;
  onUpdateTodo: (id: string, data: TodoInput) => void;
  onDeleteTodo: (id: string) => void;
  onCompleteTodo: (id: string) => TodoCompleteResult | null;
}

export default function TodoTab({
  todos,
  categories,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onCompleteTodo,
}: Props) {
  const insets = useSafeAreaInsets();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Todo | null>(null);
  const [editTarget, setEditTarget] = useState<Todo | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Todo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const [completeResult, setCompleteResult] = useState<TodoCompleteResult | null>(null);
  const [sort, setSort] = useState<TodoSort>('recent');
  const [filter, setFilter] = useState<TodoFilter>('today');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [excludeTodayFromWeek, setExcludeTodayFromWeek] = useState(true);
  const [excludeWeekFromMonth, setExcludeWeekFromMonth] = useState(true);
  const [missedExpanded, setMissedExpanded] = useState(false);

  const filterOptions = useMemo(
    () => ({ excludeTodayFromWeek, excludeWeekFromMonth }),
    [excludeTodayFromWeek, excludeWeekFromMonth]
  );

  const missedTodos = useMemo(() => sortMissedTodos(todos.filter(isMissedTodo)), [todos]);
  const missedTodoCount = missedTodos.length;

  useEffect(() => {
    if (missedTodoCount === 0) setMissedExpanded(false);
  }, [missedTodoCount]);

  const filteredTodos = useMemo(
    () =>
      todos.filter(
        todo =>
          matchesTodoFilter(todo, filter, filterOptions) &&
          matchesCategoryFilter(todo, categoryFilter)
      ),
    [todos, filter, filterOptions, categoryFilter]
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
    const hadStickers = confirmTarget.stickerCount > 0;
    const result = onCompleteTodo(confirmTarget.id);
    setConfirmTarget(null);
    if (result && hadStickers) setCompleteResult(result);
  };

  const deleteConfirmModal = deleteTarget && (
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
  );

  return (
    <View style={styles.tab}>
      {todos.length === 0 ? (
        <EmptyState
          icon="🎯"
          tagline={APP_TAGLINE}
          title="아직 할일이 없어요"
          description="오른쪽 아래 + 버튼으로 첫 할일을 추가해 보세요"
        />
      ) : (
        <>
          {missedTodoCount > 0 && (
            <MissedTodosBanner
              count={missedTodoCount}
              expanded={missedExpanded}
              onToggle={() => setMissedExpanded(v => !v)}
              todos={missedTodos}
              categories={categories}
              onComplete={handleCompleteClick}
              onOpen={setDetailTarget}
            />
          )}
          {!missedExpanded && (
            <>
              <View style={styles.filters}>
                <FilterChips
                  value={filter}
                  onChange={setFilter}
                  options={TODO_FILTER_OPTIONS}
                  ariaLabel="할일 필터"
                />
                <CategoryFilterChips
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  categories={categories}
                />
                <View style={styles.listOptions}>
                  {filter === 'week' && (
                    <>
                      <FilterExcludeOption
                        label="오늘 목록 제외"
                        checked={excludeTodayFromWeek}
                        onChange={setExcludeTodayFromWeek}
                      />
                      <View style={styles.optionDivider} />
                    </>
                  )}
                  {filter === 'month' && (
                    <>
                      <FilterExcludeOption
                        label="이번주 목록 제외"
                        checked={excludeWeekFromMonth}
                        onChange={setExcludeWeekFromMonth}
                      />
                      <View style={styles.optionDivider} />
                    </>
                  )}
                  <SortSelect
                    value={sort}
                    onChange={setSort}
                    options={TODO_SORT_OPTIONS}
                    ariaLabel="할일 목록 정렬"
                  />
                </View>
              </View>
              <FlatList
                data={sortedTodos}
                keyExtractor={todo => todo.id}
                style={styles.list}
                contentContainerStyle={[
                  styles.listContent,
                  { paddingBottom: 96 + insets.bottom },
                ]}
                ListEmptyComponent={
                  <EmptyState
                    icon="🔍"
                    tagline={APP_TAGLINE}
                    title="해당하는 할일이 없어요"
                    description="다른 필터를 선택해 보세요"
                  />
                }
                renderItem={({ item }) => (
                  <TodoCard
                    todo={item}
                    categories={categories}
                    onComplete={handleCompleteClick}
                    onOpen={setDetailTarget}
                  />
                )}
              />
            </>
          )}
        </>
      )}

      <Fab onPress={() => setIsAddOpen(true)} label="할일 추가" />

      {isAddOpen && (
        <TodoFormModal
          categories={categories}
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
          categories={categories}
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
          overlay={deleteConfirmModal}
        />
      )}

      {editTarget && (
        <TodoFormModal
          todo={editTarget}
          categories={categories}
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
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  filters: {
    gap: 8,
    marginBottom: 12,
  },
  listOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  optionDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
});
