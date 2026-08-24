import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Progress', path: '/progress' });

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
