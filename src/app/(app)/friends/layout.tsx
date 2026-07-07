import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Friends');

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
