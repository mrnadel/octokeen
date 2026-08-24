import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Settings', path: '/settings' });

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
