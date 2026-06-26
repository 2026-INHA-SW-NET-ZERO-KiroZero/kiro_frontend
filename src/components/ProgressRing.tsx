import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { color } from '@/theme/theme';

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  bgColor?: string;
  children?: ReactNode;
};

export function ProgressRing({
  progress,
  size = 94,
  strokeWidth = 10,
  color: arcColor,
  bgColor = color.border,
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * clamped} ${circumference * (1 - clamped)}`}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      {children ? (
        <View style={[styles.center, { width: size, height: size }]}>{children}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
