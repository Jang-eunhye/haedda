import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';
import StickerStar from './StickerStar';

const LOGO_HEIGHT = 42;
const LOGO_ASPECT = 512 / 384;

interface Props {
  totalStickers: number;
}

export default function AppHeader({ totalStickers }: Props) {
  return (
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/haedda-logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityRole="header"
        accessibilityLabel="해따"
      />
      <View
        style={styles.stickers}
        accessible
        accessibilityLabel={`스티커 ${totalStickers}개`}
      >
        <Icon name="store" size={20} color={colors.muted} />
        <View style={styles.divider} />
        <View style={styles.count}>
          <StickerStar size="sm" />
          <Text style={styles.countLabel}>{totalStickers}</Text>
        </View>
      </View>
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
  stickers: {
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
