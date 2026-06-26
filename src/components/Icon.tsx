import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

import { color } from '@/theme/theme';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color: tint = color.ink }: IconProps) {
  return <MaterialIcons name={name} size={size} color={tint} />;
}
