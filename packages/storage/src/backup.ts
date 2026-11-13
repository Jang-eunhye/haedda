import type { BackupData } from '@haedda/domain';
import type { AppRepositories } from './index';

/** 백업 데이터로 저장소 전체를 덮어쓴다. 다 쓴 뒤에 화면 쪽에서 데이터를 다시 불러와야 한다 */
export async function restoreBackup(repos: AppRepositories, data: BackupData): Promise<void> {
  await repos.categories.saveCategories(data.categories);
  await repos.rewards.saveRewards(data.rewards);
  await repos.stickers.saveTotalStickers(data.totalStickers);
  await repos.todos.saveTodos(data.todos);
}
