'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  ariaLabel: string;
}

export default function FilterChips<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none"
    >
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
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
  );
}
