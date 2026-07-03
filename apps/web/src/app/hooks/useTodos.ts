'use client';

import { useState, useEffect, useRef } from 'react';
import { Todo, Reward, TodoInput, TodoCompleteResult } from '@haedda/types';
import {
  LEGACY_MISSIONS_STORAGE_KEY,
  REWARDS_STORAGE_KEY,
  STICKERS_STORAGE_KEY,
  TODOS_STORAGE_KEY,
} from '@haedda/constants';
import {
  claimReward as claimRewardDomain,
  clearCategoryFromTodos,
  completeTodoInList,
  createReward,
  createTodo,
  deleteRewardFromList,
  deleteTodoFromList,
  mergeRecurringRefreshIntoStored,
  parseTodosFromUnknown,
  updateRewardInList,
  updateTodoInList,
} from '@haedda/domain';

function loadTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(TODOS_STORAGE_KEY);
    if (stored) {
      return parseTodosFromUnknown(JSON.parse(stored));
    }

    const legacy = localStorage.getItem(LEGACY_MISSIONS_STORAGE_KEY);
    if (legacy) {
      const todos = parseTodosFromUnknown(JSON.parse(legacy));
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      localStorage.removeItem(LEGACY_MISSIONS_STORAGE_KEY);
      return todos;
    }
  } catch {}
  return [];
}

function persistRecurringRefresh(refreshedTodos: Todo[]): void {
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    const { merged, changed } = mergeRecurringRefreshIntoStored(parsed, refreshedTodos);
    if (changed) {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {}
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const userMutatedRef = useRef(false);

  useEffect(() => {
    try {
      const loaded = loadTodosFromStorage();
      persistRecurringRefresh(loaded);
      setTodos(loaded);
      const r = localStorage.getItem(REWARDS_STORAGE_KEY);
      const s = localStorage.getItem(STICKERS_STORAGE_KEY);
      if (r) setRewards(JSON.parse(r));
      if (s) setTotalStickers(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !userMutatedRef.current) return;
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
  }, [rewards, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STICKERS_STORAGE_KEY, JSON.stringify(totalStickers));
  }, [totalStickers, ready]);

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
