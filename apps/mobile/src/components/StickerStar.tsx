import { StyleSheet, Text } from 'react-native';

export const STICKER_STAR = '⭐' as const;

const FONT_SIZE = {
  sm: 14,
  md: 20,
  lg: 24,
  xl: 30,
} as const;

export type StickerSize = keyof typeof FONT_SIZE;

interface Props {
  size?: StickerSize;
  crossedOut?: boolean;
}

export default function StickerStar({ size = 'md', crossedOut = false }: Props) {
  const fontSize = FONT_SIZE[size];

  return (
    <Text
      style={[
        styles.star,
        { fontSize, lineHeight: Math.round(fontSize * 1.25) },
        crossedOut && styles.crossedOut,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {STICKER_STAR}
    </Text>
  );
}

const styles = StyleSheet.create({
  star: {
    includeFontPadding: false,
  },
  crossedOut: {
    opacity: 0.4,
  },
});
