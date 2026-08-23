import { AnimateIn } from './AnimateIn';
import { FREE_COURSE_COUNT, FREE_QUESTION_COUNT } from './free-catalog';
import { LandingCtaButton } from './LandingCtaButton';

export function LandingBottomCta() {
  return (
    <section style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <AnimateIn>
          <h2 className="landing-section-heading" style={{ fontWeight: 900, color: '#1E293B', marginBottom: 12, letterSpacing: -0.5 }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#94A3B8', marginBottom: 32 }}>
            {FREE_QUESTION_COUNT}+ questions across {FREE_COURSE_COUNT} courses. Free forever.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <LandingCtaButton />
        </AnimateIn>
      </div>
    </section>
  );
}
