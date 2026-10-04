'use client';

import { useState } from 'react';
import SettingsShell from './SettingsShell';
import CategoryFormModal from './CategoryFormModal';
import CategorySortableList from './CategorySortableList';
import DeleteConfirmModal from './DeleteConfirmModal';
import Fab from './Fab';
import EmptyState from './EmptyState';
import { useCategories, useTodos } from '@haedda/hooks';
import { TodoCategory } from '../utils/categories';

export default function CategorySettingsPage() {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } =
    useCategories();
  const { clearCategoryFromTodos } = useTodos();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TodoCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TodoCategory | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    clearCategoryFromTodos(deleteTarget.id);
    setDeleteTarget(null);
    if (editTarget?.id === deleteTarget.id) setEditTarget(null);
  };

  return (
    <SettingsShell title="카테고리" backHref="/settings">
      {categories.length === 0 ? (
        <div className="pt-6">
          <EmptyState
            icon="🏷️"
            tagline="할일을 분류해 보세요"
            title="카테고리가 없어요"
            description="아래 + 버튼으로 첫 카테고리를 추가해 보세요"
          />
        </div>
      ) : (
        <CategorySortableList
          categories={categories}
          onReorder={reorderCategories}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
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

      <Fab onClick={() => setIsAddOpen(true)} label="카테고리 추가" />
    </SettingsShell>
  );
}
