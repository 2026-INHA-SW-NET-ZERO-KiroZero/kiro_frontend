import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { color, radius, shadow } from '@/theme/theme';

type CardProps = {
  children: ReactNode;
  radius?: number;
  style?: ViewStyle;
};

export function Card({ children, radius: cornerRadius = radius.card, style }: CardProps) {
  return <View style={[styles.card, { borderRadius: cornerRadius }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    ...shadow.card,
  },
});
