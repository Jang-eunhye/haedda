'use client';

import { useState } from 'react';
import { TabType } from './types';
import { useMissions } from './hooks/useMissions';
import MissionTab from './components/MissionTab';
import RewardTab from './components/RewardTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('mission');
  const { missions, totalStickers, addMission, completeMission } = useMissions();

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-amber-500 text-center tracking-wide">해따 ⭐</h1>
      </header>

      <div className="flex bg-white border-b border-gray-100">
        {(['mission', 'reward'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'mission' ? '미션' : `보상 · ⭐${totalStickers}`}
          </button>
        ))}
      </div>

      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'mission' ? (
          <MissionTab
            missions={missions}
            onAddMission={addMission}
            onCompleteMission={completeMission}
          />
        ) : (
          <RewardTab totalStickers={totalStickers} />
        )}
      </main>
    </div>
  );
}
