'use client';

import { useState } from 'react';
import { Mission } from '../types';
import MissionCard from './MissionCard';
import AddMissionModal from './AddMissionModal';

interface Props {
  missions: Mission[];
  onAddMission: (mission: Omit<Mission, 'id' | 'completed'>) => void;
}

export default function MissionTab({ missions, onAddMission }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-700">
          미션 <span className="text-amber-500">{missions.length}</span>
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm"
        >
          + 미션 추가
        </button>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🎯</div>
          <p className="text-sm font-medium">아직 미션이 없어요</p>
          <p className="text-xs mt-1 text-gray-300">미션을 추가해 스티커를 모아보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddMissionModal
          onClose={() => setIsModalOpen(false)}
          onAdd={data => {
            onAddMission(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
