import { useEffect, useMemo, useState } from 'react';
import { BackHandler, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Todo, TodoCategory } from '@haedda/types';
import { searchTodos } from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import EmptyState from './EmptyState';
import Icon from './Icon';
import TodoCard from './TodoCard';

const SEARCH_TAGLINE = '필터와 상관없이 전체 할일에서 찾아요';

interface Props {
  todos: Todo[];
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
  onClose: () => void;
}

/** 필터와 상관없이 전체 할일에서 내용·메모·카테고리 이름으로 찾는다 */
export default function TodoSearchView({ todos, categories, onComplete, onOpen, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchTodos(todos, query, categories), [todos, query, categories]);
  const hasQuery = query.trim().length > 0;

  // 안드로이드 뒤로가기 버튼은 앱을 나가지 않고 검색만 닫는다
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose]);

  return (
    <>
      <View style={styles.bar}>
        <View style={styles.field}>
          <Icon name="search" size={18} color={colors.muted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="할일 내용, 메모, 카테고리로 찾기"
            placeholderTextColor={colors.mutedSoft}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="할일 검색"
            style={styles.input}
          />
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="검색 닫기"
          hitSlop={8}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <Icon name="close" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <FlatList
        data={hasQuery ? results : []}
        keyExtractor={todo => todo.id}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: 96 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          hasQuery && results.length > 0 ? (
            <Text style={styles.count}>{results.length}개 찾았어요</Text>
          ) : null
        }
        ListEmptyComponent={
          hasQuery ? (
            <EmptyState
              icon="🔍"
              tagline={SEARCH_TAGLINE}
              title="찾는 할일이 없어요"
              description="다른 단어로 찾아보세요"
            />
          ) : (
            <EmptyState
              icon="🔍"
              tagline={SEARCH_TAGLINE}
              title="할일을 찾아보세요"
              description="할일 내용이나 메모, 카테고리 이름으로 찾을 수 있어요"
            />
          )
        }
        renderItem={({ item }) => (
          <TodoCard todo={item} categories={categories} onComplete={onComplete} onOpen={onOpen} />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePressed: {
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
  count: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
