import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Friends',
  description: 'Add friends, compare progress, and study together on Octokeen.',
  robots: { index: false },
};

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
