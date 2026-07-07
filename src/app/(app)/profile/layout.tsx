import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Profile');

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
