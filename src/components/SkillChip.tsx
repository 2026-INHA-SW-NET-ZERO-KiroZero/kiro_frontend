import { StyleSheet, Text, View } from 'react-native';

import { font, radius, skillChip, space } from '@/theme/theme';

type SkillLevel = keyof typeof skillChip;

type SkillChipProps = {
  level: SkillLevel;
  size?: 'sm' | 'md';
};

export function SkillChip({ level, size = 'sm' }: SkillChipProps) {
  const chip = skillChip[level];
  const isMd = size === 'md';

  return (
    <View style={[styles.chip, isMd ? styles.md : styles.sm, { backgroundColor: chip.bg }]}>
      <Text style={[styles.label, isMd ? styles.labelMd : styles.labelSm, { color: chip.fg }]}>
        {level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: space.xs,
    paddingHorizontal: 9,
    borderRadius: radius.chip2,
  },
  md: {
    paddingVertical: 5,
    paddingHorizontal: space.xl,
    borderRadius: radius.sm,
  },
  label: {
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
  labelSm: { fontSize: font.size.tiny },
  labelMd: { fontSize: font.size.micro },
});
