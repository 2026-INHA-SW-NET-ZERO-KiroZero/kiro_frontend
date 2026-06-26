import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { color, font, radius, shadow, space } from '@/theme/theme';

type ButtonVariant = 'primary' | 'outline' | 'cancel';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'primary' && !disabled && shadow.brandBtn,
        variant === 'outline' && styles.outline,
        variant === 'cancel' && styles.cancel,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'outline' && styles.labelOutline,
          variant === 'cancel' && styles.labelCancel,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.x3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: color.brand,
    paddingVertical: space.x6,
  },
  outline: {
    backgroundColor: color.white,
    borderWidth: 1.5,
    borderColor: color.brandOutlineBorder,
    paddingVertical: space.x5,
  },
  cancel: {
    backgroundColor: color.white,
    borderWidth: 1.5,
    borderColor: color.borderInput,
    paddingVertical: space.x5,
  },
  disabled: {
    backgroundColor: color.disabledBg,
    borderWidth: 0,
    paddingVertical: space.x6,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  labelPrimary: { color: color.white },
  labelOutline: { color: color.brand },
  labelCancel: { color: color.textMute },
  labelDisabled: { color: color.disabledText },
});
