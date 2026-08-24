import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Pricing | Free & Pro Plans',
  description: 'Compare Octokeen Free and Pro plans. Every course in full, unlimited hearts, adaptive practice and full analytics from $6.67/mo billed yearly.',
  path: '/pricing',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
