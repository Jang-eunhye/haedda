'use client';

import {
  CATEGORY_CHIP_CLASS,
  DEFAULT_CATEGORIES,
  TodoCategory,
} from '../utils/categories';

interface Props {
  value: string;
  onChange: (value: string) => void;
  categories?: TodoCategory[];
}

const UNCATEGORIZED_CHIP_CLASS = {
  selected: 'bg-white text-foreground border-foreground',
  unselected:
    'bg-white text-muted border-border hover:text-foreground hover:border-foreground/30',
} as const;

export default function CategoryFilterChips({
  value,
  onChange,
  categories = DEFAULT_CATEGORIES,
}: Props) {
  const uncategorizedSelected = value === 'uncategorized';

  return (
    <div
      role="tablist"
      aria-label="카테고리 필터"
      className="flex flex-wrap gap-1.5"
    >
      {categories.map(category => {
        const selected = value === category.id;
        const styles = CATEGORY_CHIP_CLASS[category.color];

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(selected ? 'all' : category.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-[0.97] ${
              selected ? styles.selected : styles.unselected
            }`}
          >
            {category.label}
          </button>
        );
      })}
      <button
        type="button"
        role="tab"
        aria-selected={uncategorizedSelected}
        onClick={() => onChange(uncategorizedSelected ? 'all' : 'uncategorized')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-[0.97] ${
          uncategorizedSelected
            ? UNCATEGORIZED_CHIP_CLASS.selected
            : UNCATEGORIZED_CHIP_CLASS.unselected
        }`}
      >
        미분류
      </button>
    </div>
  );
}
