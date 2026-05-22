import type { Metadata } from 'next';
export { default } from './ShopClient';

export const metadata: Metadata = {
  title: 'Gem Shop',
  description: 'Spend your Octokeen gems on streak freezes, double XP boosts, and exclusive cosmetics in the gem shop.',
  openGraph: {
    title: 'Gem Shop | Octokeen',
    description: 'Spend your Octokeen gems on streak freezes, double XP boosts, and exclusive cosmetics in the gem shop.',
    url: '/shop',
  },
  twitter: {
    card: 'summary',
    title: 'Gem Shop | Octokeen',
    description: 'Spend your Octokeen gems on streak freezes, double XP boosts, and exclusive cosmetics in the gem shop.',
  },
};
