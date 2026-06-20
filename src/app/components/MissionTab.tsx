'use client';

import { useMemo, useState } from 'react';
import { Mission, MissionInput, MissionCompleteResult } from '../types';
import MissionCard from './MissionCard';
import MissionFormModal from './MissionFormModal';
import MissionDetailModal from './MissionDetailModal';
import ConfirmMissionModal from './ConfirmMissionModal';
import MissionCompleteResultModal from './MissionCompleteResultModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyState from './EmptyState';
import Fab from './Fab';
import SortSelect from './SortSelect';

const APP_TAGLINE = '미션을 완료하고 스티커를 모아보세요';

type MissionSort = 'registered' | 'deadline' | 'sticker-desc';

const MISSION_SORT_OPTIONS = [
  { value: 'registered' as const, label: '등록순' },
  { value: 'deadline' as const, label: '마감일순' },
  { value: 'sticker-desc' as const, label: '스티커 많은 순' },
];

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
  const [detailTarget, setDetailTarget] = useState<Mission | null>(null);
  const [editTarget, setEditTarget] = useState<Mission | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Mission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Mission | null>(null);
  const [completeResult, setCompleteResult] = useState<MissionCompleteResult | null>(null);
  const [sort, setSort] = useState<MissionSort>('registered');

  const sortedMissions = useMemo(() => {
    if (sort === 'registered') return missions;
    if (sort === 'deadline') {
      return [...missions].sort((a, b) => a.deadline.localeCompare(b.deadline));
    }
    return [...missions].sort((a, b) => b.stickerCount - a.stickerCount);
  }, [missions, sort]);

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
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              미션
              <span className="text-sm font-semibold text-muted tabular-nums">({missions.length})</span>
            </h2>
            <SortSelect
              value={sort}
              onChange={setSort}
              options={MISSION_SORT_OPTIONS}
              ariaLabel="미션 정렬"
            />
          </div>
          <div className="space-y-3">
            {sortedMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={handleCompleteClick}
                onOpen={setDetailTarget}
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

      {detailTarget && (
        <MissionDetailModal
          mission={detailTarget}
          onClose={() => setDetailTarget(null)}
          onEdit={() => {
            setEditTarget(detailTarget);
            setDetailTarget(null);
          }}
          onDelete={() => setDeleteTarget(detailTarget)}
          onComplete={() => {
            setConfirmTarget(detailTarget);
            setDetailTarget(null);
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

      {deleteTarget && (
        <DeleteConfirmModal
          title="미션을 삭제할까요?"
          content={deleteTarget.content}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDeleteMission(deleteTarget.id);
            setDeleteTarget(null);
            setDetailTarget(null);
            setEditTarget(null);
          }}
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
