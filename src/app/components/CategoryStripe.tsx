import { CATEGORY_STRIPE_CLASS, TodoCategory, getCategoryById } from '../utils/categories';

interface Props {
  categoryId: string;
  categories: TodoCategory[];
}

export default function CategoryStripe({ categoryId, categories }: Props) {
  const category = getCategoryById(categories, categoryId);
  if (!category) return null;

  return (
    <div
      className={`w-1 shrink-0 ${CATEGORY_STRIPE_CLASS[category.color]}`}
      aria-label={category.label}
    />
  );
}
