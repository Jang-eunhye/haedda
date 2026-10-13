import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TabType } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';
import StickerStar from './StickerStar';

const LOGO_HEIGHT = 42;
const LOGO_ASPECT = 512 / 384;

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalStickers: number;
}

export default function AppHeader({ activeTab, onTabChange, totalStickers }: Props) {
  const rewardActive = activeTab === 'reward';

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => onTabChange('todo')}
        accessibilityRole="button"
        accessibilityLabel="할일"
        accessibilityState={{ selected: activeTab === 'todo' }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Image
          source={require('@/assets/images/haedda-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        onPress={() => onTabChange(rewardActive ? 'todo' : 'reward')}
        accessibilityRole="button"
        accessibilityLabel={
          rewardActive ? '할일로 돌아가기' : `보상, 스티커 ${totalStickers}개`
        }
        accessibilityState={{ selected: rewardActive }}
        style={({ pressed }) => [
          styles.reward,
          rewardActive && styles.rewardActive,
          pressed && styles.pressed,
        ]}
      >
        <Icon
          name="store"
          size={20}
          color={rewardActive ? colors.foreground : colors.muted}
        />
        <View style={styles.divider} />
        <View style={styles.count}>
          <StickerStar size="sm" />
          <Text style={styles.countLabel}>{totalStickers}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: Math.round(LOGO_HEIGHT * LOGO_ASPECT),
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    backgroundColor: colors.accentSoft,
  },
  rewardActive: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: colors.accentMuted,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.accentMuted,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countLabel: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
});
