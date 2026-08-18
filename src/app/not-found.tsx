import type { Metadata } from 'next';
import { NotFoundScreen } from '@/components/errors/NotFoundScreen';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <NotFoundScreen
      gearSizeClass="w-28 h-28"
      labelSizeClass="text-3xl"
      description="This page doesn't exist — like a frictionless surface, it's only theoretical."
    />
  );
}
