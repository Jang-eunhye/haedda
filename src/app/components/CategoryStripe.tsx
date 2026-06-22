import { CATEGORY_STRIPE_CLASS, getCategoryById } from '../utils/categories';

interface Props {
  categoryId: string;
}

export default function CategoryStripe({ categoryId }: Props) {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  return (
    <div
      className={`w-1 shrink-0 ${CATEGORY_STRIPE_CLASS[category.color]}`}
      aria-label={category.label}
    />
  );
}
