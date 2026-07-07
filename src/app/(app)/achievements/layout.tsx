import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Achievements');

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
