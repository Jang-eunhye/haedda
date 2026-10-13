import { View } from 'react-native';
import type { TodoCategory } from '@haedda/types';
import { getCategoryById } from '@haedda/utils';
import { CATEGORY_COLOR } from '@/src/theme/colors';

interface Props {
  categoryId: string;
  categories: TodoCategory[];
}

export default function CategoryStripe({ categoryId, categories }: Props) {
  const category = getCategoryById(categories, categoryId);
  if (!category) return null;

  return (
    <View
      style={{ width: 4, backgroundColor: CATEGORY_COLOR[category.color] }}
      accessibilityLabel={category.label}
    />
  );
}
