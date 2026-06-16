'use client';

import { useState, useEffect } from 'react';
import { Mission, Reward, MissionInput } from '../types';
import { isDeadlineExpired, normalizeDeadline } from '../utils/date';

const MISSIONS_KEY = 'haedda_missions';
const REWARDS_KEY = 'haedda_rewards';
const STICKERS_KEY = 'haedda_stickers';

function normalizeMission(raw: unknown): Mission | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== 'string' || typeof m.content !== 'string') return null;
  if (typeof m.deadline !== 'string' || typeof m.stickerCount !== 'number') return null;
  if (m.completed === true) return null;
  return {
    id: m.id,
    content: m.content,
    deadline: normalizeDeadline(m.deadline),
    stickerCount: m.stickerCount,
  };
}

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const m = localStorage.getItem(MISSIONS_KEY);
      const r = localStorage.getItem(REWARDS_KEY);
      const s = localStorage.getItem(STICKERS_KEY);
      if (m) {
        const parsed: unknown[] = JSON.parse(m);
        setMissions(
          parsed.map(normalizeMission).filter((x): x is Mission => x !== null)
        );
      }
      if (r) setRewards(JSON.parse(r));
      if (s) setTotalStickers(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  }, [missions, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  }, [rewards, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STICKERS_KEY, JSON.stringify(totalStickers));
  }, [totalStickers, ready]);

  const addMission = (data: MissionInput) => {
    setMissions(prev => [...prev, { ...data, id: crypto.randomUUID() }]);
  };

  const completeMission = (id: string): { earned: number; content: string } | null => {
    let result: { earned: number; content: string } | null = null;
    setMissions(prev => {
      const mission = prev.find(m => m.id === id);
      if (!mission) return prev;
      const earned = isDeadlineExpired(mission.deadline) ? 0 : mission.stickerCount;
      if (earned > 0) setTotalStickers(s => s + earned);
      result = { earned, content: mission.content };
      return prev.filter(m => m.id !== id);
    });
    return result;
  };

  const addReward = (data: Omit<Reward, 'id'>) => {
    setRewards(prev => [...prev, { ...data, id: crypto.randomUUID() }]);
  };

  const claimReward = (id: string): boolean => {
    const reward = rewards.find(r => r.id === id);
    if (!reward) return false;

    let claimed = false;
    setTotalStickers(s => {
      if (s < reward.stickerCost) return s;
      claimed = true;
      return s - reward.stickerCost;
    });
    return claimed;
  };

  const updateMission = (id: string, data: MissionInput) => {
    setMissions(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteMission = (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const updateReward = (id: string, data: Omit<Reward, 'id'>) => {
    setRewards(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  return {
    missions,
    rewards,
    totalStickers,
    addMission,
    completeMission,
    updateMission,
    deleteMission,
    addReward,
    claimReward,
    updateReward,
    deleteReward,
  };
}
