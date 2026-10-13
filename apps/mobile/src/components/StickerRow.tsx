import { StyleSheet, View } from 'react-native';
import StickerStar, { type StickerSize } from './StickerStar';

interface Props {
  count: number;
  size?: StickerSize;
  crossedOut?: boolean;
  centered?: boolean;
  gap?: number;
}

export default function StickerRow({
  count,
  size = 'md',
  crossedOut = false,
  centered = false,
  gap = 2,
}: Props) {
  return (
    <View
      style={[styles.row, { gap }, centered && styles.centered]}
      accessible
      accessibilityLabel={
        crossedOut ? `스티커 ${count}개, 기한 지남` : `스티커 ${count}개`
      }
    >
      {Array.from({ length: count }, (_, i) => (
        <StickerStar key={i} size={size} crossedOut={crossedOut} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  centered: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
