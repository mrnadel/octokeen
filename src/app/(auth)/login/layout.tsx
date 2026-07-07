import { createPrivateMetadata } from '@/lib/metadata';

export const metadata = createPrivateMetadata('Log In');

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
