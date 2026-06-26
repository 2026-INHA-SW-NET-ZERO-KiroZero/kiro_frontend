import { Placeholder } from '@/components/Placeholder';

export default function RoomDetailScreen() {
  return (
    <Placeholder
      title="방 상세"
      subtitle="Room Detail (골격)"
      showBack
      links={[
        { href: '/recommend', label: 'AI 추천' },
        { href: '/usage', label: '사용량 기록' },
        { href: '/settlement', label: '정산' },
      ]}
    />
  );
}
