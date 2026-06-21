'use client';

interface Option<T extends string> {
  value: T;
  label: string;
  ariaLabel?: string;
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
      className="flex flex-wrap gap-1.5"
    >
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={opt.ariaLabel ?? opt.label}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
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
