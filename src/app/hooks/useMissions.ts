'use client';

import { useState, useEffect } from 'react';
import { Mission } from '../types';

const STORAGE_KEY = 'haedda_missions';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  }, [missions]);

  const addMission = (data: Omit<Mission, 'id' | 'completed'>) => {
    setMissions(prev => [
      ...prev,
      { ...data, id: crypto.randomUUID(), completed: false },
    ]);
  };

  return { missions, addMission };
}
