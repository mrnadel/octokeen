import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Settings');

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
