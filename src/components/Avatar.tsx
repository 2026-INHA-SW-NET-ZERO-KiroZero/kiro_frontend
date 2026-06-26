import { StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/theme';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  name: string;
  color: string;
  size?: AvatarSize;
};

const DIMENSION: Record<AvatarSize, number> = { sm: 27, md: 34, lg: 46 };
const FONT_SIZE: Record<AvatarSize, number> = {
  sm: font.size.tiny,
  md: font.size.micro2,
  lg: font.size.bodySm,
};

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function Avatar({ name, color: bg, size = 'md' }: AvatarProps) {
  const dimension = DIMENSION[size];

  return (
    <View style={[styles.avatar, { width: dimension, height: dimension, backgroundColor: bg }]}>
      <Text style={[styles.label, { fontSize: FONT_SIZE[size] }]}>{initial(name)}</Text>
    </View>
  );
}

type Participant = { name: string; color: string };

type AvatarStackProps = {
  participants: Participant[];
};

export function AvatarStack({ participants }: AvatarStackProps) {
  return (
    <View style={styles.stack}>
      {participants.map((participant, index) => (
        <View
          key={`${participant.name}-${index}`}
          style={[styles.stackItem, index > 0 && styles.stackOverlap]}
        >
          <Avatar name={participant.name} color={participant.color} size="sm" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.base,
  },
  stack: {
    flexDirection: 'row',
  },
  stackItem: {
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: color.white,
  },
  stackOverlap: {
    marginLeft: -8,
  },
});
