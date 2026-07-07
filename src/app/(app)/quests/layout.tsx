import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Quests');

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
