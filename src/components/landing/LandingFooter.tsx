import Link from 'next/link';

const LINK = { color: '#94A3B8', textDecoration: 'none' } as const;
const ROW = { marginTop: 8, fontSize: 13, fontWeight: 600, color: '#94A3B8' } as const;

/**
 * The only site-wide navigation a signed-out visitor gets, so it is also the
 * only crawl path to the pages nothing else links to. `/pricing` and
 * `/refund-policy` were orphaned until they were listed here: both were in the
 * sitemap with no internal link pointing at them from anywhere on the site.
 *
 * Server-rendered on purpose. The links have to be in the initial HTML, not
 * added on hydration, or crawlers that do not run JavaScript never see them.
 * Two rows rather than one so six links do not wrap raggedly on a phone.
 */
export function LandingFooter() {
  return (
    <footer style={{ padding: '40px 24px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p>
          <Link href="/" style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <img src="/icon-48.png" alt="" width={26} height={26} style={{ borderRadius: 8 }} />
            <span style={{ color: '#0D9488' }}>Octokeen</span>
          </Link>
        </p>
        <p style={ROW}>
          <Link href="/learn" style={LINK}>Free guides</Link>
          {' '}&middot;{' '}
          <Link href="/pricing" style={LINK}>Pricing</Link>
          {' '}&middot;{' '}
          <Link href="/contact" style={LINK}>Contact</Link>
        </p>
        <p style={ROW}>
          <Link href="/terms" style={LINK}>Terms</Link>
          {' '}&middot;{' '}
          <Link href="/privacy" style={LINK}>Privacy</Link>
          {' '}&middot;{' '}
          <Link href="/refund-policy" style={LINK}>Refund policy</Link>
        </p>
      </div>
    </footer>
  );
}
