import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import { PastEvalContext, usePastEvalProvider } from '@/hooks/usePastEval';
import { ProfileContext, useProfileProvider } from '@/hooks/useProfile';

// 폰트가 준비될 때까지 스플래시를 유지(깜빡임 방지).
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const auth = useAuthProvider();
  const profile = useProfileProvider();
  const pastEval = usePastEvalProvider();

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

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthContext.Provider value={auth}>
      <ProfileContext.Provider value={profile}>
        <PastEvalContext.Provider value={pastEval}>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </PastEvalContext.Provider>
      </ProfileContext.Provider>
    </AuthContext.Provider>
  );
}
