import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Progress');

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
