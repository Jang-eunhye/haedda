'use client';

import { CATEGORY_CHIP_CLASS, TodoCategory } from '../utils/categories';

interface Props {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
  categories: TodoCategory[];
  ariaLabel?: string;
}

export default function CategoryPicker({
  value,
  onChange,
  categories,
  ariaLabel = '카테고리',
}: Props) {
  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1.5"
    >
      {categories.map(category => {
        const selected = value === category.id;
        const styles = CATEGORY_CHIP_CLASS[category.color];

        return (
          <button
            key={category.id}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onChange(selected ? undefined : category.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-[0.97] ${
              selected ? styles.selected : styles.unselected
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
