import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Octoken Shop', path: '/shop' });

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
