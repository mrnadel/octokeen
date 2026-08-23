import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

/**
 * Chrome for the public `/learn` section.
 *
 * Deliberately outside the `(app)` route group: that layout is a client
 * component that reads the session, so anything inside it renders empty to a
 * crawler. Everything here is a server component, and the only client code
 * under `/learn` is the three small islands in `src/components/learn/`.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] dark:bg-surface-950">
      <header className="border-b border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7" priority />
            <span className="text-base font-extrabold text-surface-900 dark:text-surface-50">
              {APP_NAME}
            </span>
          </Link>
          <Link
            href="/try"
            className="rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-extrabold text-white"
          >
            Try a lesson
          </Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
