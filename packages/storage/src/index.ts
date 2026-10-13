import type { StorageAdapter } from './types';
import { createCategoryRepository } from './repositories/category-repository';
import { createRewardRepository } from './repositories/reward-repository';
import { createStickersRepository } from './repositories/stickers-repository';
import { createTodoRepository } from './repositories/todo-repository';

export type { StorageAdapter } from './types';
export { createWebStorage } from './web';
export { createNativeStorage, type AsyncStorageLike } from './native';
export { createTodoRepository, type TodoRepository } from './repositories/todo-repository';
export { createRewardRepository, type RewardRepository } from './repositories/reward-repository';
export { createStickersRepository, type StickersRepository } from './repositories/stickers-repository';
export { createCategoryRepository, type CategoryRepository } from './repositories/category-repository';

export interface AppRepositories {
  todos: ReturnType<typeof createTodoRepository>;
  rewards: ReturnType<typeof createRewardRepository>;
  stickers: ReturnType<typeof createStickersRepository>;
  categories: ReturnType<typeof createCategoryRepository>;
}

export function createRepositories(storage: StorageAdapter): AppRepositories {
  return {
    todos: createTodoRepository(storage),
    rewards: createRewardRepository(storage),
    stickers: createStickersRepository(storage),
    categories: createCategoryRepository(storage),
  };
}
