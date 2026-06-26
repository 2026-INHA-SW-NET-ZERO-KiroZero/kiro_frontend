import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius, space } from '@/theme/theme';

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  disabled = false,
  error = false,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? color.brandAlt : focused ? color.brand : color.borderInput;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.placeholder}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { borderColor }, disabled && styles.inputDisabled]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space.md,
  },
  label: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink3,
    letterSpacing: font.tracking.base,
  },
  input: {
    backgroundColor: color.white,
    borderWidth: 1.5,
    borderRadius: radius.x2,
    paddingVertical: space.x5,
    paddingHorizontal: space.x6,
    fontSize: font.size.bodySm,
    fontFamily: font.family.medium,
    color: color.ink,
  },
  inputDisabled: {
    backgroundColor: color.disabledBg,
    color: color.disabledText,
  },
});
