import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, shadow, space } from '@/theme/theme';

type SegmentedProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: color.greyChipBg,
    borderRadius: radius.x2,
    padding: space.xs,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  segmentActive: {
    backgroundColor: color.white,
    ...shadow.card,
  },
  label: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
  labelActive: { color: color.ink },
  labelInactive: { color: color.textMute },
});
