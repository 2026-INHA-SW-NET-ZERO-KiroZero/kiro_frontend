import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius, space } from '@/theme/theme';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ToggleChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function ToggleChip({ label, selected = false, onPress }: ToggleChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.toggle, selected ? styles.toggleSelected : styles.toggleUnselected]}
    >
      <Text
        style={[styles.toggleLabel, selected ? styles.labelActive : styles.toggleLabelUnselected]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingVertical: space.md,
    paddingHorizontal: space.x4,
    alignSelf: 'flex-start',
  },
  chipActive: {
    borderWidth: 1.5,
    borderColor: color.brand,
    backgroundColor: color.redBgSoft,
  },
  chipInactive: {
    borderWidth: 1,
    borderColor: color.borderInput2,
    backgroundColor: color.white,
  },
  label: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.base,
  },
  labelActive: { color: color.brandStrong },
  labelInactive: { color: color.ink4 },
  toggle: {
    borderRadius: radius.lg,
    paddingVertical: space.sm,
    paddingHorizontal: space.x3,
    alignSelf: 'flex-start',
  },
  toggleSelected: {
    borderWidth: 1.5,
    borderColor: color.brand,
    backgroundColor: color.redBgSoft,
  },
  toggleUnselected: {
    borderWidth: 1.5,
    borderColor: color.borderInput,
    backgroundColor: color.white,
  },
  toggleLabel: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.base,
  },
  toggleLabelUnselected: { color: color.ink3 },
});
