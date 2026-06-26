import { Placeholder } from '@/components/Placeholder';

export default function MeetingsScreen() {
  return (
    <Placeholder
      title="내 모임"
      subtitle="My Meetings (골격)"
      links={[
        { href: '/myApplication', label: '신청 내역' },
        { href: '/pastApplication', label: '지난 모임' },
        { href: '/pastEval', label: '모임 평가' },
      ]}
    />
  );
}
