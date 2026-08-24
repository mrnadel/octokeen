import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'League', path: '/league' });

export default function LeagueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
