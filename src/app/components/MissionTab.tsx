'use client';

import { useState } from 'react';
import { Mission, MissionInput } from '../types';
import MissionCard from './MissionCard';
import MissionFormModal from './MissionFormModal';
import ConfirmMissionModal from './ConfirmMissionModal';
import MissionCompleteResultModal from './MissionCompleteResultModal';
import Fab from './Fab';

interface Props {
  missions: Mission[];
  onAddMission: (mission: MissionInput) => void;
  onUpdateMission: (id: string, data: MissionInput) => void;
  onDeleteMission: (id: string) => void;
  onCompleteMission: (id: string) => { earned: number; content: string } | null;
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
  const [confirmTarget, setConfirmTarget] = useState<Mission | null>(null);
  const [completeResult, setCompleteResult] = useState<{
    earned: number;
    content: string;
  } | null>(null);

  const handleCompleteClick = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) setConfirmTarget(mission);
  };

  const handleConfirmComplete = () => {
    if (!confirmTarget) return;
    const result = onCompleteMission(confirmTarget.id);
    setConfirmTarget(null);
    if (result) setCompleteResult(result);
  };

  return (
    <div className="pb-20">
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">미션</h2>
        <p className="text-xs text-muted mt-0.5">
          진행 중 <span className="text-foreground font-semibold">{missions.length}</span>개
        </p>
      </div>

      {missions.length === 0 ? (
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
          {missions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={handleCompleteClick}
              onEdit={setEditTarget}
              onDelete={onDeleteMission}
            />
          ))}
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

      {confirmTarget && (
        <ConfirmMissionModal
          mission={confirmTarget}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={handleConfirmComplete}
        />
      )}

      {completeResult && (
        <MissionCompleteResultModal
          content={completeResult.content}
          earned={completeResult.earned}
          onConfirm={() => setCompleteResult(null)}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="미션 추가" />
    </div>
  );
}
