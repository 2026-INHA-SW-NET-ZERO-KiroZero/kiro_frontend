import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, shadow, space } from '@/theme/theme';

type SegmentOption = { label: string; value: string };

interface SegmentProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  caption?: string;
}

export function Segment({ options, value, onChange, caption }: SegmentProps) {
  return (
    <View>
      <View style={styles.track}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.tab, selected ? styles.tabSelected : styles.tabUnselected]}
            >
              <Text
                style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: space.xs,
    backgroundColor: color.greyChipBg,
    borderRadius: radius.x2,
    padding: space.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.xl,
    borderRadius: radius.md,
  },
  tabSelected: {
    backgroundColor: color.brand,
    ...shadow.card,
  },
  tabUnselected: { backgroundColor: 'transparent' },
  label: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  labelSelected: { color: color.white },
  labelUnselected: { color: color.ink3 },
  caption: {
    marginTop: space.xl,
    marginLeft: space.xs,
    fontSize: font.size.capSm,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
});
