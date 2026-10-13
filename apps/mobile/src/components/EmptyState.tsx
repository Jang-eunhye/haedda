import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';

interface Props {
  icon: string;
  tagline: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, tagline, title, description }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.tagline}>{tagline}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 8,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 32,
    lineHeight: 40,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 280,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 12,
    lineHeight: 19,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 8,
  },
});
