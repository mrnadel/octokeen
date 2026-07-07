import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Create Account');

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
