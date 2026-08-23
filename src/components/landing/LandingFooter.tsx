import Link from 'next/link';

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
        <p style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>
          <Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms</Link>
          {' '}&middot;{' '}
          <Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy</Link>
          {' '}&middot;{' '}
          <Link href="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Contact</Link>
        </p>
      </div>
    </footer>
  );
}
