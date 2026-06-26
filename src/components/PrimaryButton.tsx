import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius, shadow, space } from '@/theme/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({ label, onPress, disabled, loading }: PrimaryButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={[styles.base, inactive ? styles.inactive : styles.active]}
    >
      {loading ? (
        <ActivityIndicator color={color.white} />
      ) : (
        <Text style={[styles.label, inactive ? styles.labelInactive : styles.labelActive]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.x3,
    paddingVertical: space.x6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: color.brand,
    ...shadow.brandBtn,
  },
  inactive: {
    backgroundColor: color.greyChipBg,
  },
  label: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  labelActive: { color: color.white },
  labelInactive: { color: color.textMute },
});
