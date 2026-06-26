import { Placeholder } from '@/components/Placeholder';

export default function MyScreen() {
  return (
    <Placeholder
      title="MY"
      subtitle="MY (골격)"
      links={[{ href: '/editProfile', label: '프로필 편집' }]}
    />
  );
}
