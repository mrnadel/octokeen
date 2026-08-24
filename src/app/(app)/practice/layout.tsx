import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Practice', path: '/practice' });

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
