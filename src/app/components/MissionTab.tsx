'use client';

import { useState } from 'react';
import { Mission } from '../types';
import MissionCard from './MissionCard';
import AddMissionModal from './AddMissionModal';

interface Props {
  missions: Mission[];
  onAddMission: (mission: Omit<Mission, 'id' | 'completed' | 'earnedStickers'>) => void;
  onCompleteMission: (id: string) => void;
}

export default function MissionTab({ missions, onAddMission, onCompleteMission }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const active = missions.filter(m => !m.completed);
  const done = missions.filter(m => m.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">미션</h2>
          <p className="text-xs text-muted mt-0.5">
            진행 중 <span className="text-foreground font-semibold">{active.length}</span>개
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-foreground text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-foreground/90 active:scale-[0.98] transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          미션 추가
        </button>
      </div>

      {active.length === 0 && done.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background flex items-center justify-center text-3xl">
            🎯
          </div>
          <p className="text-sm font-semibold text-foreground">아직 미션이 없어요</p>
          <p className="text-xs mt-1.5 text-muted max-w-[220px] mx-auto leading-relaxed">
            미션을 추가하고 완료하면 스티커를 받을 수 있어요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map(mission => (
            <MissionCard key={mission.id} mission={mission} onComplete={onCompleteMission} />
          ))}

          {done.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-3 px-1">
                완료된 미션
              </p>
              <div className="space-y-3">
                {done.map(mission => (
                  <MissionCard key={mission.id} mission={mission} onComplete={onCompleteMission} />
                ))}
              </div>
            </div>
          )}
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
