'use client';

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FilterExcludeOption({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
      <span className="text-xs text-muted">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-border text-foreground accent-foreground shrink-0"
      />
    </label>
  );
}
