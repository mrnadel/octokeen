import Link from 'next/link';

import { FEATURED_GUIDE_LINKS } from '@/data/learn/featured';

import { AnimateIn } from './AnimateIn';

/**
 * The landing page's one link into `/learn`, above the final call to action.
 *
 * Deliberately plain: a list of headlines and nothing else. The section earns
 * its place because a visitor who is not ready to start a course still has
 * somewhere to go, and because `/learn` was otherwise reachable only from the
 * sitemap. It is styled to read as a quiet appendix to the page rather than as
 * a second offer competing with the hero and the demo.
 */
export function LandingGuides() {
  return (
    <section style={{ padding: '0 24px 72px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <AnimateIn>
          <h2
            className="landing-section-heading"
            style={{ textAlign: 'center', fontWeight: 900, color: '#1E293B', marginBottom: 10, letterSpacing: -0.5 }}
          >
            Or just read something
          </h2>
          <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#94A3B8', marginBottom: 24 }}>
            Free written guides. No account, no paywall halfway down.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {FEATURED_GUIDE_LINKS.map(({ path, label }) => (
              <li key={path}>
                <Link className="landing-guide-link" href={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link className="landing-guide-all" href="/learn">
              Browse all guides and courses
            </Link>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
