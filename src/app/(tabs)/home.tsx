import { Placeholder } from '@/components/Placeholder';

export default function HomeScreen() {
  return (
    <Placeholder
      title="홈"
      subtitle="Home (골격)"
      links={[
        { href: '/roomDetail', label: '방 상세' },
        { href: '/recommend', label: 'AI 추천' },
        { href: '/notifications', label: '알림' },
      ]}
    />
  );
}
