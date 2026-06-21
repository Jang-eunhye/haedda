'use client';

import { useState, useEffect } from 'react';
import { Todo, Reward, TodoInput, TodoCompleteResult, TodoRecurrence } from '../types';
import { isDeadlineExpired, normalizeDeadline } from '../utils/date';
import { computeNextDeadlineAfter, refreshRecurringTodo } from '../utils/recurrence';

const TODOS_KEY = 'haedda_todos';
const LEGACY_MISSIONS_KEY = 'haedda_missions';
const REWARDS_KEY = 'haedda_rewards';
const STICKERS_KEY = 'haedda_stickers';

function normalizeRecurrence(raw: unknown): TodoRecurrence | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type === 'daily') return { type: 'daily' };
  if (r.type === 'weekly' && Array.isArray(r.weekdays)) {
    const weekdays = r.weekdays.filter((d): d is number => typeof d === 'number');
    return weekdays.length > 0 ? { type: 'weekly', weekdays } : undefined;
  }
  if (r.type === 'monthly') {
    if (r.dayOfMonth === 'last') return { type: 'monthly', dayOfMonth: 'last' };
    if (typeof r.dayOfMonth === 'number') {
      return { type: 'monthly', dayOfMonth: r.dayOfMonth };
    }
  }
  return undefined;
}

function normalizeTodo(raw: unknown): Todo | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== 'string' || typeof m.content !== 'string') return null;
  if (typeof m.deadline !== 'string' || typeof m.stickerCount !== 'number') return null;
  if (m.completed === true) return null;

  const recurrence = normalizeRecurrence(m.recurrence);
  const memo = typeof m.memo === 'string' ? m.memo.trim() : undefined;
  const todo: Todo = {
    id: m.id,
    content: m.content,
    deadline: normalizeDeadline(m.deadline),
    stickerCount: m.stickerCount,
    ...(memo ? { memo } : {}),
    recurrence,
    missedCount: typeof m.missedCount === 'number' ? m.missedCount : 0,
    consecutiveCompletions:
      typeof m.consecutiveCompletions === 'number' ? m.consecutiveCompletions : 0,
  };

  if (recurrence) {
    return refreshRecurringTodo(todo);
  }

  return todo;
}

function loadTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(TODOS_KEY);
    if (stored) {
      const parsed: unknown[] = JSON.parse(stored);
      return parsed.map(normalizeTodo).filter((x): x is Todo => x !== null);
    }

    const legacy = localStorage.getItem(LEGACY_MISSIONS_KEY);
    if (legacy) {
      const parsed: unknown[] = JSON.parse(legacy);
      const todos = parsed.map(normalizeTodo).filter((x): x is Todo => x !== null);
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
      localStorage.removeItem(LEGACY_MISSIONS_KEY);
      return todos;
    }
  } catch {}
  return [];
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setTodos(loadTodosFromStorage());
      const r = localStorage.getItem(REWARDS_KEY);
      const s = localStorage.getItem(STICKERS_KEY);
      if (r) setRewards(JSON.parse(r));
      if (s) setTotalStickers(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  }, [rewards, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STICKERS_KEY, JSON.stringify(totalStickers));
  }, [totalStickers, ready]);

  const addTodo = (data: TodoInput) => {
    const { memo, ...rest } = data;
    const todo: Todo = {
      ...rest,
      id: crypto.randomUUID(),
      ...(memo ? { memo } : {}),
    };
    setTodos(prev => [...prev, todo]);
  };

  const completeTodo = (id: string): TodoCompleteResult | null => {
    let result: TodoCompleteResult | null = null;
    setTodos(prev => {
      const todo = prev.find(t => t.id === id);
      if (!todo) return prev;

      const earned = isDeadlineExpired(todo.deadline) ? 0 : todo.stickerCount;
      if (earned > 0) setTotalStickers(s => s + earned);

      if (todo.recurrence) {
        const onTime = !isDeadlineExpired(todo.deadline);
        const nextDeadline = computeNextDeadlineAfter(todo.recurrence, todo.deadline);
        result = {
          earned,
          stickerCount: todo.stickerCount,
          content: todo.content,
          isRecurring: true,
          nextDeadline,
        };
        return prev.map(t =>
          t.id === id
            ? {
                ...t,
                deadline: nextDeadline,
                missedCount: 0,
                consecutiveCompletions: onTime
                  ? (todo.consecutiveCompletions ?? 0) + 1
                  : 0,
              }
            : t
        );
      }

      result = { earned, stickerCount: todo.stickerCount, content: todo.content, isRecurring: false };
      return prev.filter(t => t.id !== id);
    });
    return result;
  };

  const addReward = (data: Omit<Reward, 'id'>) => {
    setRewards(prev => [...prev, { ...data, id: crypto.randomUUID() }]);
  };

  const claimReward = (id: string): boolean => {
    const reward = rewards.find(r => r.id === id);
    if (!reward) return false;

    let claimed = false;
    setTotalStickers(s => {
      if (s < reward.stickerCost) return s;
      claimed = true;
      return s - reward.stickerCost;
    });
    return claimed;
  };

  const updateTodo = (id: string, data: TodoInput) => {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const next = { ...t, ...data };
        if (!data.memo) delete next.memo;
        return next;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateReward = (id: string, data: Omit<Reward, 'id'>) => {
    setRewards(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
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
  };
}
