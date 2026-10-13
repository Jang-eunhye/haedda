import { StyleSheet, View } from 'react-native';
import type { TodoCategory } from '@haedda/types';
import CategoryChip from './CategoryChip';

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
    <View style={styles.row} accessibilityLabel={ariaLabel}>
      {categories.map(category => {
        const selected = value === category.id;
        return (
          <CategoryChip
            key={category.id}
            label={category.label}
            color={category.color}
            selected={selected}
            onPress={() => onChange(selected ? undefined : category.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
