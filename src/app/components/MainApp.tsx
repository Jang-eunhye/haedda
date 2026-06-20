'use client';

import { useState } from 'react';
import { TabType } from '../types';
import { useTodos } from '../hooks/useTodos';
import TodoTab from './TodoTab';
import RewardTab from './RewardTab';
import StickerBanner from './StickerBanner';

const TABS: { key: TabType; label: string }[] = [
  { key: 'todo', label: '할일' },
  { key: 'reward', label: '보상' },
];

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

  return (
    <div className="h-dvh bg-background overflow-hidden">
      <div className="mx-auto w-full max-w-lg h-full flex flex-col sm:py-6 sm:px-4">
        <div className="flex flex-col h-full bg-surface sm:rounded-3xl sm:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] sm:border sm:border-border overflow-hidden">
          <div className="shrink-0">
            <header className="px-5 pt-5 pb-3 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  해따
                </h1>
                <StickerBanner count={totalStickers} />
              </div>
            </header>

            <div className="px-4 pb-3 sm:px-6">
              <div className="flex p-1 bg-background rounded-2xl">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === key
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:pb-6">
            {activeTab === 'todo' ? (
              <TodoTab
                todos={todos}
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
