'use client';

import { useState } from 'react';
import { TabType } from '../types';
import { useTodos } from '../hooks/useTodos';
import TodoTab from './TodoTab';
import RewardTab from './RewardTab';
import StickerBanner from './StickerBanner';
import BottomNav from './BottomNav';

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
          <header className="shrink-0 px-5 pt-5 pb-4 sm:px-6 border-b border-border/60">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                해따
              </h1>
              <StickerBanner count={totalStickers} />
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6">
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

          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
