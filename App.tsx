import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { color, font } from './src/theme/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>KiroZero</Text>
      <Text style={styles.subtitle}>하네스 준비 완료 — 화면 구현을 시작하세요.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.appBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: font.size.display,
    fontWeight: font.weight.bold,
    color: color.ink,
    marginBottom: 8,
    letterSpacing: font.tracking.tighter,
  },
  subtitle: {
    fontSize: font.size.sm,
    color: color.textMute,
  },
});
