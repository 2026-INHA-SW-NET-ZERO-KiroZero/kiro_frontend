import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius, space } from '@/theme/theme';

type SheetBaseProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export function SheetBase({ visible, onClose, children, title }: SheetBaseProps) {
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(1);
    }
  }, [visible, translateY]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + space.x6 },
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 600],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.grabber} />
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
  },
  sheet: {
    backgroundColor: color.white,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: space.screenX,
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: color.grabber,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: space.md,
    marginBottom: space.x6,
  },
  title: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
    marginBottom: space.x4,
  },
});
