import type { Todo } from '@haedda/types';

/** 로드 시 refresh 결과만 storage raw에 반영 (categoryId 등 다른 필드는 유지) */
export function mergeRecurringRefreshIntoStored(
  storedItems: unknown[],
  refreshedTodos: Todo[]
): { merged: unknown[]; changed: boolean } {
  const refreshedById = new Map(
    refreshedTodos.filter(t => t.recurrence).map(t => [t.id, t])
  );

  let changed = false;
  const merged = storedItems.map(item => {
    if (!item || typeof item !== 'object') return item;
    const record = item as Record<string, unknown>;
    const id = typeof record.id === 'string' ? record.id : null;
    if (!id) return item;

    const refreshed = refreshedById.get(id);
    if (!refreshed) return item;

    const next = { ...record };
    let itemChanged = false;

    const newMissed = refreshed.missedCount ?? 0;
    const oldMissed = typeof record.missedCount === 'number' ? record.missedCount : 0;
    if (newMissed !== oldMissed) {
      next.missedCount = newMissed;
      itemChanged = true;
    }

    const newDeadline = refreshed.deadline;
    const oldDeadline = typeof record.deadline === 'string' ? record.deadline : undefined;
    if (newDeadline !== oldDeadline) {
      if (newDeadline) next.deadline = newDeadline;
      else delete next.deadline;
      itemChanged = true;
    }

    if (itemChanged) {
      changed = true;
      return next;
    }
    return item;
  });

  return { merged, changed };
}
