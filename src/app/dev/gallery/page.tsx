import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryLoader } from './GalleryLoader';

export const metadata: Metadata = {
  title: 'Dev — Gallery',
  robots: { index: false, follow: false },
};

export default function GalleryPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <GalleryLoader />;
}
