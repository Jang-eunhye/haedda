'use client';

import { useState } from 'react';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import SettingsShell from './SettingsShell';
import CategoryFormModal from './CategoryFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Fab from './Fab';
import EmptyState from './EmptyState';
import { useCategories } from '../hooks/useCategories';
import { useTodos } from '../hooks/useTodos';
import { CATEGORY_STRIPE_CLASS, TodoCategory } from '../utils/categories';

export default function CategorySettingsPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
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
        <EmptyState
          icon="🏷️"
          tagline="할일을 분류해 보세요"
          title="카테고리가 없어요"
          description="아래 + 버튼으로 첫 카테고리를 추가해 보세요"
        />
      ) : (
        <ul className="space-y-2">
          {categories.map(category => (
            <li
              key={category.id}
              className="flex items-center gap-3 bg-background rounded-2xl border border-border px-4 py-3"
            >
              <span
                className={`w-1 h-8 rounded-full shrink-0 ${CATEGORY_STRIPE_CLASS[category.color]}`}
                aria-hidden
              />
              <span className="flex-1 min-w-0 text-sm font-semibold text-foreground truncate">
                {category.label}
              </span>
              <button
                type="button"
                aria-label={`${category.label} 수정`}
                onClick={() => setEditTarget(category)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors active:scale-95 shrink-0"
              >
                <MdEdit size={18} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`${category.label} 삭제`}
                onClick={() => setDeleteTarget(category)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-surface transition-colors active:scale-95 shrink-0"
              >
                <MdDeleteOutline size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
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
