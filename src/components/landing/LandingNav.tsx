import Link from 'next/link';

export function LandingNav() {
  return (
    <nav aria-label="Main navigation" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#FAFAFA' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/icon-48.png" alt="" width={34} height={34} style={{ borderRadius: 10, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
          <span style={{ color: '#0D9488' }}>Octokeen</span>
        </Link>
        <Link href="/login" style={{
          fontSize: 14, fontWeight: 800, color: '#0D9488',
          textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 0.8,
          padding: '10px 20px', border: '2px solid #E2E8F0', borderRadius: 12,
          minHeight: 44, display: 'inline-flex', alignItems: 'center',
        }}>
          Log in
        </Link>
      </div>
    </nav>
  );
}
