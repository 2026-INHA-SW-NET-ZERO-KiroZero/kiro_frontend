import { StyleSheet, Text, View } from 'react-native';

import { font, radius, space, statusChip } from '@/theme/theme';

type StatusBadgeProps = {
  status: keyof typeof statusChip;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const chip = statusChip[status];
  const text = 'label' in chip ? chip.label : label;

  return (
    <View style={[styles.badge, { backgroundColor: chip.bg }]}>
      <Text style={[styles.label, { color: chip.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: space.lg,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
});
