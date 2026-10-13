import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCategories, useTodos } from '@haedda/hooks';
import type { TodoCategory } from '@haedda/types';
import CategoryFormModal from '@/src/components/CategoryFormModal';
import CategorySortableList from '@/src/components/CategorySortableList';
import DeleteConfirmModal from '@/src/components/DeleteConfirmModal';
import EmptyState from '@/src/components/EmptyState';
import Fab from '@/src/components/Fab';
import SettingsShell from '@/src/components/SettingsShell';

export default function CategorySettingsScreen() {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } =
    useCategories();
  const { clearCategoryFromTodos } = useTodos();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TodoCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TodoCategory | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    clearCategoryFromTodos(deleteTarget.id);
    setDeleteTarget(null);
    if (editTarget?.id === deleteTarget.id) setEditTarget(null);
  };

  return (
    <SettingsShell
      title="카테고리"
      backHref="/settings"
      scrollEnabled={!isDragging}
      floating={<Fab onPress={() => setIsAddOpen(true)} label="카테고리 추가" />}
    >
      {categories.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            icon="🏷️"
            tagline="할일을 분류해 보세요"
            title="카테고리가 없어요"
            description="아래 + 버튼으로 첫 카테고리를 추가해 보세요"
          />
        </View>
      ) : (
        <CategorySortableList
          categories={categories}
          onReorder={reorderCategories}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onDraggingChange={setIsDragging}
        />
      )}

      {isAddOpen && (
        <CategoryFormModal
          onClose={() => setIsAddOpen(false)}
          onSave={data => {
            addCategory(data);
            setIsAddOpen(false);
          }}
        />
      )}

      {editTarget && (
        <CategoryFormModal
          category={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={data => {
            updateCategory(editTarget.id, data);
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="카테고리를 삭제할까요?"
          content={`"${deleteTarget.label}" 카테고리가 삭제됩니다. 해당 카테고리의 할일은 미분류로 표시됩니다.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </SettingsShell>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
});
