import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { authed, loading } = useAuth();

  if (loading) return null;
  return <Redirect href={authed ? '/(tabs)/home' : '/(auth)/login'} />;
}
