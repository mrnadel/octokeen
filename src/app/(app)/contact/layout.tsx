import { createAppMetadata } from '@/lib/metadata';

export const metadata = createAppMetadata(
  'Contact & Support',
  'Get help with Octokeen. Browse FAQs or email our support team for account, billing, or content questions.',
  '/contact',
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
