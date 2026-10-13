import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Todo, TodoCategory } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';
import TodoCard from './TodoCard';

interface Props {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  todos: Todo[];
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function MissedTodosBanner({
  count,
  expanded,
  onToggle,
  todos,
  categories,
  onComplete,
  onOpen,
}: Props) {
  const title = (
    <View style={styles.title}>
      <Icon name="warning" size={18} color={colors.danger} />
      <Text style={styles.titleLabel}>
        놓친 할일 <Text style={styles.count}>{count}</Text>개
      </Text>
    </View>
  );

  if (!expanded) {
    return (
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel="놓친 할일 보기"
        accessibilityState={{ expanded }}
        style={({ pressed }) => [
          styles.banner,
          styles.collapsed,
          styles.header,
          pressed && styles.pressed,
        ]}
      >
        {title}
        <View style={styles.toggle}>
          <Icon name="chevronDown" size={26} color={colors.muted} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.banner, styles.expanded]}>
      <View style={[styles.header, styles.headerExpanded]}>
        {title}
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel="놓친 할일 닫기"
          accessibilityState={{ expanded }}
          hitSlop={8}
          style={styles.toggle}
        >
          <Icon name="chevronUp" size={26} color={colors.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {todos.map(todo => (
          <TodoCard
            key={todo.id}
            todo={todo}
            categories={categories}
            onComplete={onComplete}
            onOpen={onOpen}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerBorder,
    overflow: 'hidden',
  },
  collapsed: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  expanded: {
    flex: 1,
    marginHorizontal: -16,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 6,
  },
  headerExpanded: {
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  titleLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  count: {
    color: colors.danger,
    fontVariant: ['tabular-nums'],
  },
  toggle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 10,
  },
});
