'use client';

import { useState } from 'react';
import { TabType } from '../types';
import { useMissions } from '../hooks/useMissions';
import MissionTab from './MissionTab';
import RewardTab from './RewardTab';
import StickerBanner from './StickerBanner';

const TABS: { key: TabType; label: string }[] = [
  { key: 'mission', label: '미션' },
  { key: 'reward', label: '보상' },
];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('mission');
  const { missions, totalStickers, addMission, completeMission } = useMissions();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-lg min-h-screen flex flex-col sm:py-6 sm:px-4">
        <div className="flex flex-col flex-1 bg-surface sm:rounded-3xl sm:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] sm:border sm:border-border overflow-hidden">
          <header className="px-5 pt-6 pb-4 sm:px-6">
            <h1 className="text-xl font-bold text-foreground tracking-tight text-center">
              해따
            </h1>
            <p className="text-xs text-muted text-center mt-0.5">
              미션을 완료하고 스티커를 모아보세요
            </p>
          </header>

          <StickerBanner count={totalStickers} />

          <div className="px-4 pb-3 sm:px-6 mt-4">
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

          <main className="flex-1 px-4 py-4 sm:px-6 sm:pb-6">
            {activeTab === 'mission' ? (
              <MissionTab
                missions={missions}
                onAddMission={addMission}
                onCompleteMission={completeMission}
              />
            ) : (
              <RewardTab />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
