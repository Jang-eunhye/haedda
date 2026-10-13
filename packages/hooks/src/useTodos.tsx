'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Todo, Reward, TodoInput, TodoCompleteResult } from '@haedda/types';
import {
  claimReward as claimRewardDomain,
  clearCategoryFromTodos,
  completeTodoInList,
  createReward,
  createTodo,
  deleteRewardFromList,
  deleteTodoFromList,
  updateRewardInList,
  updateTodoInList,
} from '@haedda/domain';
import { useAppStorage } from './storage-context';

function useTodosState() {
  const appStorage = useAppStorage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const userMutatedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const loaded = await appStorage.todos.loadTodos();
        await appStorage.todos.persistRecurringRefresh(loaded);
        if (cancelled) return;

        setTodos(loaded);
        const [loadedRewards, loadedStickers] = await Promise.all([
          appStorage.rewards.loadRewards(),
          appStorage.stickers.loadTotalStickers(),
        ]);
        if (cancelled) return;

        setRewards(loadedRewards);
        setTotalStickers(loadedStickers);
      } catch {}
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [appStorage]);

  useEffect(() => {
    if (!ready || !userMutatedRef.current) return;
    void appStorage.todos.saveTodos(todos);
  }, [todos, ready, appStorage]);

  useEffect(() => {
    if (!ready) return;
    void appStorage.rewards.saveRewards(rewards);
  }, [rewards, ready, appStorage]);

  useEffect(() => {
    if (!ready) return;
    void appStorage.stickers.saveTotalStickers(totalStickers);
  }, [totalStickers, ready, appStorage]);

  const addTodo = (data: TodoInput) => {
    userMutatedRef.current = true;
    setTodos(prev => [...prev, createTodo(data)]);
  };

  const completeTodo = (id: string): TodoCompleteResult | null => {
    userMutatedRef.current = true;
    let result: TodoCompleteResult | null = null;
    setTodos(prev => {
      const outcome = completeTodoInList(prev, id);
      result = outcome.result;
      if (outcome.stickersEarned > 0) {
        setTotalStickers(s => s + outcome.stickersEarned);
      }
      return outcome.todos;
    });
    return result;
  };

  const addReward = (data: Omit<Reward, 'id'>) => {
    setRewards(prev => [...prev, createReward(data)]);
  };

  const claimReward = (id: string): boolean => {
    let claimed = false;
    setTotalStickers(current => {
      const outcome = claimRewardDomain(rewards, current, id);
      claimed = outcome.success;
      return outcome.nextTotalStickers;
    });
    return claimed;
  };

  const updateTodo = (id: string, data: TodoInput) => {
    userMutatedRef.current = true;
    setTodos(prev => updateTodoInList(prev, id, data));
  };

  const deleteTodo = (id: string) => {
    userMutatedRef.current = true;
    setTodos(prev => deleteTodoFromList(prev, id));
  };

  const updateReward = (id: string, data: Omit<Reward, 'id'>) => {
    setRewards(prev => updateRewardInList(prev, id, data));
  };

  const deleteReward = (id: string) => {
    setRewards(prev => deleteRewardFromList(prev, id));
  };

  const clearCategoryFromTodosHandler = (categoryId: string) => {
    userMutatedRef.current = true;
    setTodos(prev => clearCategoryFromTodos(prev, categoryId));
  };

  return {
    todos,
    rewards,
    totalStickers,
    ready,
    addTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    addReward,
    claimReward,
    updateReward,
    deleteReward,
    clearCategoryFromTodos: clearCategoryFromTodosHandler,
  };
}

type TodosContextValue = ReturnType<typeof useTodosState>;

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const value = useTodosState();
  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) {
    throw new Error('useTodos must be used within TodosProvider');
  }
  return ctx;
}
