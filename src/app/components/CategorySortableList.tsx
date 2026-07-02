"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline, MdDragIndicator, MdEdit } from "react-icons/md";
import { CATEGORY_CHIP_CLASS, TodoCategory } from "../utils/categories";

interface RowProps {
  category: TodoCategory;
  isActive: boolean;
  isPressing: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableCategoryRow({
  category,
  isActive,
  isPressing,
  onPressStart,
  onPressEnd,
  onEdit,
  onDelete,
}: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  const chipClass = CATEGORY_CHIP_CLASS[category.color].unselected;
  const showDragFeedback = isPressing || isActive;

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-stretch gap-2 px-4 sm:px-6 ${
        showDragFeedback ? "relative z-10 bg-background" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`${category.label} 순서 변경`}
        className={`-ml-4 sm:-ml-6 pl-3 sm:pl-5 pr-2 min-w-12 flex items-center justify-center transition-colors shrink-0 touch-none cursor-grab active:cursor-grabbing ${
          showDragFeedback
            ? "text-foreground bg-background"
            : "text-muted hover:text-foreground hover:bg-background"
        }`}
        {...attributes}
        {...listeners}
        onPointerDown={(e) => {
          onPressStart();
          listeners?.onPointerDown?.(e);
        }}
        onPointerUp={onPressEnd}
        onPointerCancel={onPressEnd}
        onLostPointerCapture={onPressEnd}
      >
        <MdDragIndicator size={22} aria-hidden />
      </button>
      <div className="flex flex-1 items-center gap-2 py-3 min-w-0">
        <span
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${chipClass}`}
        >
          {category.label}
        </span>
        <span className="flex-1 min-w-0" aria-hidden />
        <button
          type="button"
          aria-label={`${category.label} 수정`}
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors active:scale-95 shrink-0"
        >
          <MdEdit size={18} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={`${category.label} 삭제`}
          onClick={onDelete}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-background transition-colors active:scale-95 shrink-0 -mr-2"
        >
          <MdDeleteOutline size={18} aria-hidden />
        </button>
      </div>
    </li>
  );
}

interface Props {
  categories: TodoCategory[];
  onReorder: (next: TodoCategory[]) => void;
  onEdit: (category: TodoCategory) => void;
  onDelete: (category: TodoCategory) => void;
}

export default function CategorySortableList({
  categories,
  onReorder,
  onEdit,
  onDelete,
}: Props) {
  const listRootRef = useRef<HTMLUListElement>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pressingId, setPressingId] = useState<string | null>(null);

  const lockScroll = useCallback(() => {
    const main = listRootRef.current?.closest("main");
    if (!main) return;
    scrollParentRef.current = main;
    main.style.overflow = "hidden";
    main.style.touchAction = "none";
  }, []);

  const unlockScroll = useCallback(() => {
    const main = scrollParentRef.current;
    if (!main) return;
    main.style.overflow = "";
    main.style.touchAction = "";
    scrollParentRef.current = null;
  }, []);

  useEffect(() => () => unlockScroll(), [unlockScroll]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    lockScroll();
    setActiveId(String(event.active.id));
    setPressingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(categories, oldIndex, newIndex));
  };

  const handleDragEndWithUnlock = (event: DragEndEvent) => {
    unlockScroll();
    setActiveId(null);
    setPressingId(null);
    handleDragEnd(event);
  };

  const handleDragCancel = () => {
    unlockScroll();
    setActiveId(null);
    setPressingId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEndWithUnlock}
    >
      <SortableContext
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={listRootRef}
          className="-mx-4 sm:-mx-6 divide-y divide-border border-b border-border"
        >
          {categories.map((category) => (
            <SortableCategoryRow
              key={category.id}
              category={category}
              isActive={activeId === category.id}
              isPressing={pressingId === category.id}
              onPressStart={() => setPressingId(category.id)}
              onPressEnd={() =>
                setPressingId((id) => (id === category.id ? null : id))
              }
              onEdit={() => onEdit(category)}
              onDelete={() => onDelete(category)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
