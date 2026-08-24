import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Start your learning journey. Try a sample question, create your free account, and begin mastering any subject.',
  alternates: { canonical: '/get-started' },
  openGraph: {
    title: 'Get Started with Octokeen',
    description: 'Gamified learning across professions. Try a sample question and create your account in minutes.',
  },
};

/**
 * The page is a five-step wizard whose only headings are per-step, so it had no
 * `<h1>` at all: nothing on screen describes the page as a whole, and the steps
 * render inside a client component that swaps them out. The heading lives here,
 * in the server layout, so it is in the initial HTML rather than appearing on
 * hydration, and it is visually hidden because the wizard's design has no place
 * to put a persistent title. `sr-only` is the pattern already used for this
 * across the auth pages.
 */
export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="sr-only">Get started with Octokeen</h1>
      {children}
    </>
  );
}
