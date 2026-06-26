'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { TabType } from '../types';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import TodoTab from './TodoTab';
import RewardTab from './RewardTab';
import RewardNavButton from './RewardNavButton';
import HaeddaLogo from './HaeddaLogo';

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
          <header className="shrink-0 px-5 pt-5 pb-4 sm:px-6 border-b border-border/60">
            <div className="flex items-center justify-between gap-4">
              <h1 className="m-0 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('todo')}
                  aria-label="할일"
                  aria-current={activeTab === 'todo' ? 'page' : undefined}
                  className="rounded-lg active:scale-[0.98] transition-transform"
                >
                  <HaeddaLogo height={44} />
                </button>
              </h1>
              <div className="flex items-center gap-2 shrink-0">
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors active:scale-95"
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
