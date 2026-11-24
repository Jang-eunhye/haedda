'use client';

import { FiCalendar, FiList } from 'react-icons/fi';

export type TodoViewMode = 'list' | 'calendar';

const OPTIONS: { value: TodoViewMode; label: string; Icon: typeof FiList }[] = [
  { value: 'list', label: '목록으로 보기', Icon: FiList },
  { value: 'calendar', label: '달력으로 보기', Icon: FiCalendar },
];

interface Props {
  value: TodoViewMode;
  onChange: (mode: TodoViewMode) => void;
}

export default function ViewModeToggle({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="보기 방식" className="flex shrink-0 p-0.5 rounded-[10px] bg-zinc-100">
      {OPTIONS.map(({ value: mode, label, Icon }) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => onChange(mode)}
            className={`w-8 h-7 rounded-lg flex items-center justify-center transition-colors ${
              active ? 'bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-muted'
            }`}
          >
            <Icon size={16} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
