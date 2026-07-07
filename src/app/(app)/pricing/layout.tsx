import { createAppMetadata } from '@/lib/metadata';

export const metadata = createAppMetadata(
  'Pricing | Free & Pro Plans',
  'Compare Octokeen Free and Pro plans. Unlimited practice, all 10 units, adaptive learning, and interview simulation starting at $9/mo.',
  '/pricing',
);

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
