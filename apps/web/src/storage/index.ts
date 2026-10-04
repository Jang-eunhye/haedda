import { createRepositories, createWebStorage } from '@haedda/storage';

const storage = createWebStorage();

export const appStorage = createRepositories(storage);
