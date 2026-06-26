import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { color, radius, shadow } from '@/theme/theme';

type FABProps = {
  onPress: () => void;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
};

export function FAB({ onPress, icon = 'add' }: FABProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={26} color={color.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.brandBtn,
  },
  pressed: {
    opacity: 0.92,
  },
});
