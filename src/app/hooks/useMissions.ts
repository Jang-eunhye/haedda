'use client';

import { useState, useEffect } from 'react';
import { Mission, Reward } from '../types';
import { isDeadlineExpired } from '../utils/date';

const MISSIONS_KEY = 'haedda_missions';
const REWARDS_KEY = 'haedda_rewards';
const STICKERS_KEY = 'haedda_stickers';

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
      if (m) setMissions(JSON.parse(m));
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

  const addMission = (data: Omit<Mission, 'id' | 'completed' | 'earnedStickers'>) => {
    setMissions(prev => [
      ...prev,
      { ...data, id: crypto.randomUUID(), completed: false },
    ]);
  };

  const completeMission = (id: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id !== id || m.completed) return m;
        const isExpired = isDeadlineExpired(m.deadline);
        const earned = isExpired ? 0 : m.stickerCount;
        if (earned > 0) setTotalStickers(s => s + earned);
        return { ...m, completed: true, earnedStickers: earned };
      })
    );
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

  return {
    missions,
    rewards,
    totalStickers,
    addMission,
    completeMission,
    addReward,
    claimReward,
  };
}
