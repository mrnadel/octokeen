import { PublicPageShell } from '@/components/layout/PublicPageShell';

/** `/about` uses the same server-rendered chrome as `/learn`. */
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
