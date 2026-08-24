import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Achievements', path: '/achievements' });

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
