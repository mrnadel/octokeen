import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Practice');

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
