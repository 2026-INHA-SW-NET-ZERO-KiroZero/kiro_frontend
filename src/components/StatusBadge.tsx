import { StyleSheet, Text, View } from 'react-native';

import { font, radius, space, statusChip } from '@/theme/theme';

type StatusBadgeProps = {
  status: keyof typeof statusChip;
  label?: string;
  /** 'md'=기본(목록 카드), 'sm'=축소(추천 카드, dc.html 10.5px/3·7/radius 7). */
  size?: 'md' | 'sm';
};

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const chip = statusChip[status];
  const text = 'label' in chip ? chip.label : label;

  return (
    <View style={[styles.badge, size === 'sm' && styles.badgeSm, { backgroundColor: chip.bg }]}>
      <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: chip.fg }]}>
        {text}
      </Text>
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
  badgeSm: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: radius.chip,
  },
  label: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
  labelSm: {
    fontSize: font.size.tiny2,
  },
});
