import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 폰트가 준비될 때까지 스플래시를 유지(깜빡임 방지).
SplashScreen.preventAutoHideAsync();

/**
 * 루트 레이아웃: Pretendard(600/700/800) 로드를 스플래시로 게이트한 뒤
 * auth 그룹 + tabs + stack 화면을 헤더 없는 네이티브 스택으로 묶는다.
 * 부팅 진입은 `index` → `(auth)/login` 리다이렉트(PRD §2.3).
 * weight별 family 이름은 `theme.font.family`와 일치(fontFamily로 소비).
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard-ExtraBold.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 폰트 로드 전에는 렌더하지 않는다(스플래시 유지). 실패해도 시스템 폰트로 진행.
  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
