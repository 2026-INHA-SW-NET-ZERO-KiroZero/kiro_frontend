import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { color, font, radius, space } from '@/theme/theme';

type BorderState = 'default' | 'focus' | 'valid' | 'error';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  /** 테두리 색 상태. 지정 시 내부 focus 상태보다 우선한다. */
  borderState?: BorderState;
  /** 입력창 하단 피드백 메시지 (valid=초록, error=빨강) */
  feedbackMessage?: string | null;
  feedbackType?: 'valid' | 'error';
}

const borderColorByState: Record<BorderState, string> = {
  default: color.borderInput,
  focus: color.brand,
  valid: color.ecoBright,
  error: color.brandAlt,
};

export function TextField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  borderState,
  feedbackMessage,
  feedbackType = 'valid',
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const effectiveState: BorderState = borderState ?? (focused ? 'focus' : 'default');

  return (
    <View>
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.placeholder}
        secureTextEntry={secureTextEntry}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, { borderColor: borderColorByState[effectiveState] }]}
      />
      {feedbackMessage ? (
        <Text
          style={[
            styles.feedback,
            { color: feedbackType === 'error' ? color.brandAlt : color.ecoBright },
          ]}
        >
          {feedbackMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: radius.x2,
    backgroundColor: color.white,
    paddingVertical: space.x5,
    paddingHorizontal: space.x6,
    fontSize: font.size.bodySm,
    fontFamily: font.family.medium,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  feedback: {
    marginTop: space.md,
    marginLeft: space.xs,
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.snug,
  },
});
