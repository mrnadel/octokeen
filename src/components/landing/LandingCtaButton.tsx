import Link from 'next/link';

export interface LandingCtaButtonProps {
  /** Padding shorthand, so the results card can use a slightly smaller button. */
  padding?: string;
}

const BASE_STYLE = {
  display: 'inline-block', background: '#0D9488', color: '#fff',
  fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
  border: 'none', borderRadius: 16, boxShadow: '0 5px 0 #0F766E', textDecoration: 'none',
  transition: 'transform 0.1s, box-shadow 0.1s, filter 0.1s',
} as const;

export function LandingCtaButton({ padding = '16px 48px' }: LandingCtaButtonProps) {
  return (
    <Link href="/try" className="landing-btn-primary" style={{ ...BASE_STYLE, padding }}>
      Try a free lesson
    </Link>
  );
}
