import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Octoken Shop');

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
