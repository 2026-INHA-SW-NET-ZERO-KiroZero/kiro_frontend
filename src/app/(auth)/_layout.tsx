import { Stack } from 'expo-router';

/** 인증 그룹: 탭바·백스택 없음(PRD §2.3). */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
