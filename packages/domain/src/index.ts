export { normalizeRecurrence } from './todo/normalize-recurrence';
export { normalizeTodo, parseTodosFromUnknown } from './todo/normalize-todo';
export { mergeRecurringRefreshIntoStored } from './todo/merge-recurring-refresh';
export {
  createTodo,
  updateTodoInList,
  deleteTodoFromList,
  clearCategoryFromTodos,
} from './todo/mutate';
export { completeTodoInList, type CompleteTodoOutcome } from './todo/complete';

export {
  createReward,
  updateRewardInList,
  deleteRewardFromList,
  claimReward,
  parseRewardsFromUnknown,
  type ClaimRewardOutcome,
} from './reward/mutate';

export {
  type CategoryInput,
  normalizeCategoryLabel,
  normalizeCategory,
  parseCategoriesFromUnknown,
  createCategory,
  updateCategoryInList,
  deleteCategoryFromList,
} from './category/mutate';

export {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  type BackupData,
  type BackupFile,
  type ParseBackupResult,
  createBackup,
  serializeBackup,
  parseBackup,
} from './backup';
