import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

import { color } from '@/theme/theme';

type IconProps = {
  name: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color: tint = color.ink }: IconProps) {
  return <MaterialIcons name={name} size={size} color={tint} />;
}
