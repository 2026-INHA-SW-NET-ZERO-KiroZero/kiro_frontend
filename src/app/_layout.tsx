import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * 루트 레이아웃: auth 그룹 + tabs + stack 화면을 헤더 없는 네이티브 스택으로 묶는다.
 * 부팅 진입은 `index` → `(auth)/login` 리다이렉트(PRD §2.3).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
