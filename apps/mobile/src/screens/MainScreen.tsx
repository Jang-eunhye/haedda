import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCategories, useTodos } from '@haedda/hooks';
import type { TabType } from '@haedda/types';
import AppHeader from '@/src/components/AppHeader';
import RewardTab from '@/src/components/RewardTab';
import TodoTab from '@/src/components/TodoTab';
import { useReminders } from '@/src/reminders/ReminderProvider';
import { colors } from '@/src/theme/colors';
import { afterModalClose } from '@/src/utils/afterModalClose';

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const {
    todos,
    rewards,
    totalStickers,
    ready,
    addTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    addReward,
    claimReward,
    updateReward,
    deleteReward,
  } = useTodos();
  const { categories } = useCategories();
  const { askPermissionOnce } = useReminders();

  // 첫 할일을 추가하면 알림 권한을 한 번 물어본다 (추가 모달이 닫힌 뒤)
  const handleAddTodo: typeof addTodo = data => {
    addTodo(data);
    afterModalClose(askPermissionOnce);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalStickers={totalStickers}
        onSettingsPress={() => router.push('/settings')}
      />

      {!ready ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.muted} />
        </View>
      ) : activeTab === 'todo' ? (
        <TodoTab
          todos={todos}
          categories={categories}
          onAddTodo={handleAddTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
          onCompleteTodo={completeTodo}
        />
      ) : (
        <RewardTab
          rewards={rewards}
          totalStickers={totalStickers}
          onAddReward={addReward}
          onUpdateReward={updateReward}
          onDeleteReward={deleteReward}
          onClaimReward={claimReward}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
