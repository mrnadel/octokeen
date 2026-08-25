import { PublicPageShell } from '@/components/layout/PublicPageShell';

/**
 * Chrome for the public `/learn` section. The shell is shared with `/about`;
 * see `src/components/layout/PublicPageShell.tsx` for why it sits outside the
 * `(app)` route group.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
