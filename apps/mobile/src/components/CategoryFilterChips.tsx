import { ScrollView, StyleSheet } from 'react-native';
import type { TodoCategory } from '@haedda/types';
import CategoryChip from './CategoryChip';

interface Props {
  value: string;
  onChange: (value: string) => void;
  categories?: TodoCategory[];
}

export default function CategoryFilterChips({ value, onChange, categories = [] }: Props) {
  const uncategorizedSelected = value === 'uncategorized';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel="카테고리 필터"
    >
      {categories.map(category => {
        const selected = value === category.id;
        return (
          <CategoryChip
            key={category.id}
            role="tab"
            label={category.label}
            color={category.color}
            selected={selected}
            onPress={() => onChange(selected ? 'all' : category.id)}
          />
        );
      })}
      <CategoryChip
        role="tab"
        label="미분류"
        selected={uncategorizedSelected}
        onPress={() => onChange(uncategorizedSelected ? 'all' : 'uncategorized')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
  },
});
