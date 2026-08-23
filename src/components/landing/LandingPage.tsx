import { AnimateIn } from './AnimateIn';
import { LandingAnalytics } from './LandingAnalytics';
import { LandingBottomCta } from './LandingBottomCta';
import { LandingDemo } from './LandingDemo';
import { LandingFooter } from './LandingFooter';
import { LandingHero } from './LandingHero';
import { LandingNav } from './LandingNav';
import { LandingStyles } from './LandingStyles';

/**
 * Signed-out marketing page. Everything here renders on the server; the only
 * client islands are the scroll reveal, the analytics ping and the demo quiz.
 */
export function LandingPage() {
  return (
    <div className="landing-page" style={{ fontFamily: "'Nunito', sans-serif", background: '#FAFAFA', color: '#0F172A', minHeight: '100vh' }}>
      <LandingAnalytics />
      <LandingNav />
      <LandingHero />

      <section className="landing-demo-section" style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <AnimateIn>
            <h2 className="landing-section-heading" style={{
              textAlign: 'center', fontWeight: 900, color: '#1E293B', marginBottom: 32, letterSpacing: -0.5,
            }}>
              Can you get all 3 right?
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <LandingDemo />
          </AnimateIn>
        </div>
      </section>

      <LandingBottomCta />
      <LandingFooter />
      <LandingStyles />
    </div>
  );
}
