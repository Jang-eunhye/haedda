'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { TabType } from '@haedda/types';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import TodoTab from './TodoTab';
import RewardTab from './RewardTab';
import RewardNavButton from './RewardNavButton';
import HaeddaLogo from './HaeddaLogo';
import { APP_HEADER_CLASS, APP_HEADER_ICON_BTN_CLASS } from './appShellClasses';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const {
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
  } = useTodos();
  const { categories } = useCategories();

  return (
    <div className="h-dvh bg-background overflow-hidden">
      <div className="mx-auto w-full max-w-lg h-full flex flex-col sm:py-6 sm:px-4">
        <div className="flex flex-col h-full bg-surface sm:rounded-3xl sm:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] sm:border sm:border-border overflow-hidden">
          <header className={APP_HEADER_CLASS}>
            <div className="flex items-center justify-between gap-3 w-full min-h-0">
              <h1 className="m-0 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('todo')}
                  aria-label="할일"
                  aria-current={activeTab === 'todo' ? 'page' : undefined}
                  className="flex items-center rounded-lg active:scale-[0.98] transition-transform"
                >
                  <HaeddaLogo height={42} />
                </button>
              </h1>
              <div className="flex items-center gap-1.5 shrink-0">
                <RewardNavButton
                  count={totalStickers}
                  isActive={activeTab === 'reward'}
                  onClick={() =>
                    setActiveTab((tab) => (tab === 'reward' ? 'todo' : 'reward'))
                  }
                />
                <Link
                  href="/settings"
                  aria-label="설정"
                  className={APP_HEADER_ICON_BTN_CLASS}
                >
                  <MdSettings size={20} aria-hidden />
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-hidden px-4 pt-4 sm:px-6 flex flex-col">
            {activeTab === 'todo' ? (
              <TodoTab
                todos={todos}
                categories={categories}
                onAddTodo={addTodo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
                onCompleteTodo={completeTodo}
              />
            ) : (
              <RewardTab
                rewards={rewards}
                totalStickers={totalStickers}
                onAddReward={addReward}
                onUpdateReward={updateReward}
                onDeleteReward={deleteReward}
                onClaimReward={claimReward}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
