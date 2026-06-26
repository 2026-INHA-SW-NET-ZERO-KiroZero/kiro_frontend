import { Placeholder } from '@/components/Placeholder';

export default function LoginScreen() {
  return (
    <Placeholder
      title="로그인"
      subtitle="Login (골격)"
      links={[
        { href: '/(tabs)/home', label: '로그인 → 홈', replace: true },
        { href: '/(auth)/signup', label: '회원가입' },
      ]}
    />
  );
}
