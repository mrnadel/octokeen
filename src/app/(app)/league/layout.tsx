import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'League',
  description: 'Compete with other engineers in the Octokeen weekly league.',
  robots: { index: false },
};

export default function LeagueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
