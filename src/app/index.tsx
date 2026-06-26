import { Redirect } from 'expo-router';

/** 부팅 시 로그인으로 진입(PRD §2.3). 인증 스토어 연결은 후속 이슈. */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
