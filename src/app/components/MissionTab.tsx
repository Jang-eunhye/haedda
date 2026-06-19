'use client';

import { useState } from 'react';
import { Mission, MissionInput, MissionCompleteResult } from '../types';
import MissionCard from './MissionCard';
import MissionFormModal from './MissionFormModal';
import ConfirmMissionModal from './ConfirmMissionModal';
import MissionCompleteResultModal from './MissionCompleteResultModal';
import EmptyState from './EmptyState';
import Fab from './Fab';

const APP_TAGLINE = '미션을 완료하고 스티커를 모아보세요';

interface Props {
  missions: Mission[];
  onAddMission: (mission: MissionInput) => void;
  onUpdateMission: (id: string, data: MissionInput) => void;
  onDeleteMission: (id: string) => void;
  onCompleteMission: (id: string) => MissionCompleteResult | null;
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
  const [completeResult, setCompleteResult] = useState<MissionCompleteResult | null>(null);

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
      {missions.length === 0 ? (
        <EmptyState
          icon="🎯"
          tagline={APP_TAGLINE}
          title="아직 미션이 없어요"
          description="오른쪽 아래 + 버튼으로 첫 미션을 추가해 보세요"
        />
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground">미션</h2>
            <p className="text-xs text-muted mt-0.5">
              진행 중 <span className="text-foreground font-semibold">{missions.length}</span>개
            </p>
          </div>
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
        </>
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
          isRecurring={completeResult.isRecurring}
          nextDeadline={completeResult.nextDeadline}
          onConfirm={() => setCompleteResult(null)}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="미션 추가" />
    </div>
  );
}
