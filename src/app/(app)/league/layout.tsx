import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('League');

export default function LeagueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
