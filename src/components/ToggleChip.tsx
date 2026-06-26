import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius, space } from '@/theme/theme';

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  emoji?: string;
}

export function ToggleChip({ label, selected, onToggle, emoji }: ToggleChipProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.x3,
  },
  selected: {
    backgroundColor: color.brand,
    borderColor: color.brand,
  },
  unselected: {
    backgroundColor: color.redBgSoft2,
    borderColor: color.redBgSoft2,
  },
  emoji: { fontSize: font.size.sm },
  label: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.snug,
  },
  labelSelected: { color: color.white },
  labelUnselected: { color: color.brandAlt },
});
