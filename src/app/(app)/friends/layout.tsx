import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Friends', path: '/friends' });

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
