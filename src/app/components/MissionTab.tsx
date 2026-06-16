'use client';

import { useState } from 'react';
import { Mission } from '../types';
import MissionCard from './MissionCard';
import MissionFormModal from './MissionFormModal';
import Fab from './Fab';

interface Props {
  missions: Mission[];
  onAddMission: (mission: Omit<Mission, 'id' | 'completed' | 'earnedStickers'>) => void;
  onUpdateMission: (
    id: string,
    data: Omit<Mission, 'id' | 'completed' | 'earnedStickers'>
  ) => void;
  onDeleteMission: (id: string) => void;
  onCompleteMission: (id: string) => void;
}

export default function MissionTab({
  missions,
  onAddMission,
  onUpdateMission,
  onDeleteMission,
  onCompleteMission,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Mission | null>(null);

  const active = missions.filter(m => !m.completed);
  const done = missions.filter(m => m.completed);

  return (
    <div className="pb-20">
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">미션</h2>
        <p className="text-xs text-muted mt-0.5">
          진행 중 <span className="text-foreground font-semibold">{active.length}</span>개
        </p>
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
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={onCompleteMission}
              onEdit={setEditTarget}
              onDelete={onDeleteMission}
            />
          ))}

          {done.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-3 px-1">
                완료된 미션
              </p>
              <div className="space-y-3">
                {done.map(mission => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onComplete={onCompleteMission}
                    onEdit={setEditTarget}
                    onDelete={onDeleteMission}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isAddOpen && (
        <MissionFormModal
          onClose={() => setIsAddOpen(false)}
          onSave={data => {
            onAddMission(data);
            setIsAddOpen(false);
          }}
        />
      )}

      {editTarget && (
        <MissionFormModal
          mission={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={data => {
            onUpdateMission(editTarget.id, data);
            setEditTarget(null);
          }}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="미션 추가" />
    </div>
  );
}
