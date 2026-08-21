import { createAppMetadata } from '@/lib/metadata';

export const metadata = createAppMetadata(
  'Pricing | Free & Pro Plans',
  'Compare Octokeen Free and Pro plans. Every course in full, unlimited hearts, adaptive practice and full analytics from $12.99/mo.',
  '/pricing',
);

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
