'use client';

import { useState } from 'react';
import { MdCalendarToday } from 'react-icons/md';
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

type SelectedOption = DeadlinePreset | 'custom';

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

const presetChipClass = (selected: boolean) =>
  `shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
    selected
      ? 'bg-foreground text-white'
      : 'bg-background text-muted border border-border hover:text-foreground'
  }`;

const customChipClass = (selected: boolean) =>
  `shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
    selected
      ? 'bg-foreground text-white'
      : 'bg-transparent text-muted border border-dashed border-foreground/25 hover:text-foreground hover:border-foreground/40'
  }`;

export default function DeadlinePresetPicker({ deadline, onChange }: Props) {
  const [selected, setSelected] = useState<SelectedOption>(() =>
    detectDeadlinePreset(deadline)
  );

  const handlePreset = (next: DeadlinePreset) => {
    setSelected(next);
    if (next === 'later') {
      onChange(undefined);
      return;
    }
    onChange(getDeadlineForPreset(next));
  };

  const handleCustom = () => {
    setSelected('custom');
    if (!deadline) {
      onChange(getDeadlineForPreset('today'));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">기한</p>

      <div className="flex flex-wrap gap-1.5">
        {DEADLINE_PRESET_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected === opt.value}
            onClick={() => handlePreset(opt.value)}
            className={presetChipClass(selected === opt.value)}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={selected === 'custom'}
          onClick={handleCustom}
          className={customChipClass(selected === 'custom')}
        >
          <MdCalendarToday size={14} className="shrink-0" aria-hidden />
          직접 선택
        </button>
      </div>

      {selected === 'custom' ? (
        <>
          <DatePicker
            value={deadline ?? getDeadlineForPreset('today')}
            onChange={onChange}
          />
          {deadline && <DeadlineSummaryBox deadline={deadline} />}
        </>
      ) : selected === 'later' ? (
        <p className="text-xs text-muted leading-relaxed">{formatPresetHint('later')}</p>
      ) : (
        deadline && <DeadlineSummaryBox deadline={deadline} />
      )}
    </div>
  );
}
