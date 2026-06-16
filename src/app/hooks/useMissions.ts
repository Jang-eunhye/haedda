'use client';

import { useState, useEffect } from 'react';
import { Mission } from '../types';
import { isDeadlineExpired } from '../utils/date';

const MISSIONS_KEY = 'haedda_missions';
const STICKERS_KEY = 'haedda_stickers';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [ready, setReady] = useState(false);

  // SSR과 클라이언트 불일치 방지: 마운트 후 localStorage에서 로드
  useEffect(() => {
    try {
      const m = localStorage.getItem(MISSIONS_KEY);
      const s = localStorage.getItem(STICKERS_KEY);
      if (m) setMissions(JSON.parse(m));
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

  return { missions, totalStickers, addMission, completeMission };
}
