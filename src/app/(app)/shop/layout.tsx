import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Octoken Shop',
  description: 'Spend Octokens on streak freezes, cosmetics, and more in the Octokeen shop.',
  robots: { index: false },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
