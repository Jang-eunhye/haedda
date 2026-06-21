'use client';

import { useState } from 'react';
import {
  DeadlinePreset,
  DEADLINE_PRESET_OPTIONS,
  detectDeadlinePreset,
  formatPresetHint,
  getDeadlineForPreset,
} from '../utils/deadlinePreset';
import { formatDeadlineCountdown, formatDeadlineDisplay } from '../utils/date';
import DatePicker from './DatePicker';

interface Props {
  deadline: string | undefined;
  onChange: (deadline: string | undefined) => void;
}

function initialPreset(deadline: string | undefined): DeadlinePreset {
  const detected = detectDeadlinePreset(deadline);
  if (detected === 'custom') return 'today';
  return detected;
}

function DeadlineSummaryBox({ deadline }: { deadline: string | undefined }) {
  if (!deadline) return null;
  const countdown = formatDeadlineCountdown(deadline);

  return (
    <div className="rounded-xl bg-background border border-border px-3.5 py-2.5">
      <p className="text-xs text-muted tabular-nums">
        {formatDeadlineDisplay(deadline)}
        {countdown && (
          <span className="ml-1.5 font-semibold text-foreground">{countdown}</span>
        )}
      </p>
    </div>
  );
}

export default function DeadlinePresetPicker({ deadline, onChange }: Props) {
  const [isCustomOpen, setIsCustomOpen] = useState(
    () => detectDeadlinePreset(deadline) === 'custom'
  );
  const [selectedPreset, setSelectedPreset] = useState<DeadlinePreset>(() =>
    initialPreset(deadline)
  );

  const handlePreset = (next: DeadlinePreset) => {
    setIsCustomOpen(false);
    setSelectedPreset(next);
    if (next === 'later') {
      onChange(undefined);
      return;
    }
    onChange(getDeadlineForPreset(next));
  };

  const handleToggleCustom = () => {
    if (isCustomOpen) {
      setIsCustomOpen(false);
      const detected = detectDeadlinePreset(deadline);
      if (detected !== 'custom' && detected !== 'later') {
        setSelectedPreset(detected);
      }
      return;
    }
    setIsCustomOpen(true);
    if (!deadline) onChange(getDeadlineForPreset('today'));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">기한</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-muted">직접 선택</span>
          <button
            type="button"
            role="switch"
            aria-checked={isCustomOpen}
            aria-label="날짜 직접 선택"
            onClick={handleToggleCustom}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
              isCustomOpen ? 'bg-foreground' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isCustomOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {isCustomOpen ? (
        <>
          <DatePicker
            value={deadline ?? getDeadlineForPreset('today')}
            onChange={onChange}
          />
          {deadline && <DeadlineSummaryBox deadline={deadline} />}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {DEADLINE_PRESET_OPTIONS.map(opt => {
              const selected = selectedPreset === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handlePreset(opt.value)}
                  className={`shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
                    selected
                      ? 'bg-foreground text-white'
                      : 'bg-background text-muted border border-border hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {selectedPreset === 'later' ? (
            <p className="text-xs text-muted leading-relaxed">{formatPresetHint('later')}</p>
          ) : (
            deadline && <DeadlineSummaryBox deadline={deadline} />
          )}
        </>
      )}
    </div>
  );
}
