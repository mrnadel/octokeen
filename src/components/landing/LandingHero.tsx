import Link from 'next/link';

import { AnimateIn } from './AnimateIn';
import { LandingCtaButton } from './LandingCtaButton';

export function LandingHero() {
  return (
    <section className="landing-hero-section" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <AnimateIn>
          <h1 className="landing-hero-h1" style={{ fontWeight: 900, lineHeight: 1.1, color: '#1E293B', marginBottom: 20, letterSpacing: -1 }}>
            The free, fun way to<br />
            <span style={{ color: '#14B8A6' }}>learn things that stick</span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="landing-hero-p" style={{ fontWeight: 600, color: '#64748B', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 40px' }}>
            Five-minute lessons in money, psychology, and space. Gamified from the ground up.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <LandingCtaButton />
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <p style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>
            <Link href="/get-started" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
            {' \u00B7 '}
            <Link href="/login" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
