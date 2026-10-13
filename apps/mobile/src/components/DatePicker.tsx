import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDateISO, getTodayISO, parseDateParts } from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const CELL_WIDTH = `${100 / 7}%` as const;

function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  return cells;
}

export default function DatePicker({ value, onChange }: Props) {
  const today = getTodayISO();
  const resolved = value || today;
  const { year, month, day } = parseDateParts(resolved);

  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);

  useEffect(() => {
    setViewYear(year);
    setViewMonth(month);
  }, [year, month]);

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const moveMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  };

  const selectDay = (nextDay: number) => {
    onChange(formatDateISO(new Date(viewYear, viewMonth - 1, nextDay)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => moveMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          style={({ pressed }) => [styles.nav, pressed && styles.navPressed]}
        >
          <Icon name="chevronLeft" size={20} color={colors.muted} />
        </Pressable>
        <Text style={styles.month}>
          {viewYear}년 {viewMonth}월
        </Text>
        <Pressable
          onPress={() => moveMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          style={({ pressed }) => [styles.nav, pressed && styles.navPressed]}
        >
          <Icon name="chevronRight" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((label, index) => (
          <View key={label} style={styles.weekdayCell}>
            <Text style={[styles.weekday, index === 0 && styles.weekdaySunday]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid} accessibilityLabel="날짜 선택">
        {cells.map((cellDay, index) => {
          if (cellDay === null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }

          const iso = formatDateISO(new Date(viewYear, viewMonth - 1, cellDay));
          const isSelected = viewYear === year && viewMonth === month && cellDay === day;
          const isToday = iso === today;
          const isSunday = new Date(viewYear, viewMonth - 1, cellDay).getDay() === 0;

          return (
            <View key={iso} style={styles.cell}>
              <Pressable
                onPress={() => selectDay(cellDay)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${viewMonth}월 ${cellDay}일`}
                style={({ pressed }) => [
                  styles.day,
                  isSelected ? styles.daySelected : isToday && styles.dayToday,
                  pressed && styles.dayPressed,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected
                      ? styles.dayLabelSelected
                      : !isToday && isSunday && styles.dayLabelSunday,
                  ]}
                >
                  {cellDay}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  nav: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navPressed: {
    backgroundColor: colors.surface,
  },
  month: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekdayCell: {
    width: CELL_WIDTH,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekday: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.muted,
  },
  weekdaySunday: {
    color: 'rgba(239, 68, 68, 0.7)',
  },
  cell: {
    width: CELL_WIDTH,
    height: 40,
    padding: 2,
  },
  day: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: colors.foreground,
  },
  dayToday: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(24, 24, 27, 0.2)',
  },
  dayPressed: {
    transform: [{ scale: 0.95 }],
  },
  dayLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  dayLabelSelected: {
    color: colors.white,
  },
  dayLabelSunday: {
    color: 'rgba(239, 68, 68, 0.8)',
  },
});
