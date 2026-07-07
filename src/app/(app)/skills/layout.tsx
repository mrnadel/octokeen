import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Skills');

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
