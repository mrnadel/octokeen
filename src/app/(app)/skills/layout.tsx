import { buildPrivateMetadata } from '@/lib/seo/metadata';

export const metadata = buildPrivateMetadata({ title: 'Skills', path: '/skills' });

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
