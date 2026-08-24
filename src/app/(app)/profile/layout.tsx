import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Profile', path: '/profile' });

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
