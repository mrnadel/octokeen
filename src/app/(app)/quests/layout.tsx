import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Quests', path: '/quests' });

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
