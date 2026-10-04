import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTodos } from '@/src/hooks/useTodos';
import { formatDeadlineDisplay } from '@haedda/utils';

export default function TodoListScreen() {
  const { todos, ready, addTodo, completeTodo, totalStickers } = useTodos();
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    const content = draft.trim();
    if (!content) return;
    addTodo({ content, stickerCount: 1 });
    setDraft('');
  };

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Haedda</Text>
        <Text style={styles.stickers}>스티커 {totalStickers}</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="할일 추가"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>추가</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        contentContainerStyle={todos.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>할일이 없어요</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.todoRow} onPress={() => completeTodo(item.id)}>
            <View style={styles.todoContent}>
              <Text style={styles.todoText}>{item.content}</Text>
              <Text style={styles.todoMeta}>
                {formatDeadlineDisplay(item.deadline)} · ★{item.stickerCount}
              </Text>
            </View>
            <Text style={styles.completeLabel}>완료</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  stickers: {
    fontSize: 14,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  todoContent: {
    flex: 1,
    paddingRight: 12,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  todoMeta: {
    fontSize: 13,
    color: '#666',
  },
  completeLabel: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
});
