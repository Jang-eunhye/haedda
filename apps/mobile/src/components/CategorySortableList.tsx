import { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import type { TodoCategory } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import CategoryChip from './CategoryChip';
import Icon, { type IconName } from './Icon';

const ROW_HEIGHT = 61;

interface DragState {
  id: string;
  from: number;
  to: number;
}

function arrayMove<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** 끌려가는 줄이 지나간 자리의 줄들이 비켜서는 거리 */
function getShift(index: number, drag: DragState | null): number {
  if (!drag) return 0;
  if (drag.from < drag.to && index > drag.from && index <= drag.to) return -ROW_HEIGHT;
  if (drag.from > drag.to && index >= drag.to && index < drag.from) return ROW_HEIGHT;
  return 0;
}

interface RowProps {
  category: TodoCategory;
  isDragging: boolean;
  shift: number;
  dragY: Animated.Value;
  onDragStart: () => void;
  onDragMove: (dy: number) => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableCategoryRow({
  category,
  isDragging,
  shift,
  dragY,
  onDragStart,
  onDragMove,
  onDragEnd,
  onEdit,
  onDelete,
}: RowProps) {
  // PanResponder는 한 번만 만들고, 최신 콜백은 ref로 읽는다
  const handlers = useRef({ onDragStart, onDragMove, onDragEnd });
  handlers.current = { onDragStart, onDragMove, onDragEnd };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => handlers.current.onDragStart(),
      onPanResponderMove: (_, gesture) => handlers.current.onDragMove(gesture.dy),
      onPanResponderRelease: () => handlers.current.onDragEnd(),
      onPanResponderTerminate: () => handlers.current.onDragEnd(),
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.row,
        isDragging && styles.rowDragging,
        { transform: [{ translateY: isDragging ? dragY : shift }] },
      ]}
    >
      <View
        {...panResponder.panHandlers}
        accessible
        accessibilityLabel={`${category.label} 순서 변경`}
        style={styles.handle}
      >
        <Icon name="drag" size={22} color={isDragging ? colors.foreground : colors.muted} />
      </View>
      <View style={styles.body}>
        <CategoryChip label={category.label} color={category.color} selected={false} />
        <View style={styles.spacer} />
        <RowButton icon="edit" label={`${category.label} 수정`} onPress={onEdit} />
        <RowButton icon="delete" label={`${category.label} 삭제`} onPress={onDelete} />
      </View>
    </Animated.View>
  );
}

function RowButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Icon name={icon} size={18} color={colors.muted} />
    </Pressable>
  );
}

interface Props {
  categories: TodoCategory[];
  onReorder: (next: TodoCategory[]) => void;
  onEdit: (category: TodoCategory) => void;
  onDelete: (category: TodoCategory) => void;
  /** 끌기 시작·종료 시 호출 (바깥 스크롤을 잠그는 용도) */
  onDraggingChange?: (dragging: boolean) => void;
}

export default function CategorySortableList({
  categories,
  onReorder,
  onEdit,
  onDelete,
  onDraggingChange,
}: Props) {
  const dragY = useRef(new Animated.Value(0)).current;
  const dragRef = useRef<DragState | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const updateDrag = (next: DragState | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  const handleDragStart = (id: string, index: number) => {
    dragY.setValue(0);
    updateDrag({ id, from: index, to: index });
    onDraggingChange?.(true);
  };

  const handleDragMove = (dy: number) => {
    const current = dragRef.current;
    if (!current) return;

    const min = -current.from * ROW_HEIGHT;
    const max = (categories.length - 1 - current.from) * ROW_HEIGHT;
    const clamped = Math.max(min, Math.min(max, dy));
    dragY.setValue(clamped);

    const to = current.from + Math.round(clamped / ROW_HEIGHT);
    if (to !== current.to) updateDrag({ ...current, to });
  };

  const handleDragEnd = () => {
    const current = dragRef.current;
    if (!current) return;

    updateDrag(null);
    dragY.setValue(0);
    onDraggingChange?.(false);
    if (current.from !== current.to) {
      onReorder(arrayMove(categories, current.from, current.to));
    }
  };

  return (
    <View>
      {categories.map((category, index) => (
        <SortableCategoryRow
          key={category.id}
          category={category}
          isDragging={drag?.id === category.id}
          shift={getShift(index, drag)}
          dragY={dragY}
          onDragStart={() => handleDragStart(category.id, index)}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    paddingRight: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDragging: {
    zIndex: 1,
    elevation: 2,
    backgroundColor: colors.background,
  },
  handle: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.background,
  },
});
