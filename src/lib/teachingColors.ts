export interface TeachingColors {
  /** Whether cards should use backdrop-filter glass effect */
  isGlass: boolean;
  /** Card background (solid color or semi-transparent) */
  cardBg: string;
  /** Primary text (headline) */
  title: string;
  /** Secondary text (one-liner, detail) */
  body: string;
  /** Muted text (labels, tags) */
  muted: string;
  /** Accent color for highlights, numbers, strong text */
  accent: string;
  /** Softer accent for tags, secondary highlights */
  accentSoft: string;
  /** Card border */
  border: string;
  /** Hint background */
  hintBg: string;
  /** Hint border */
  hintBorder: string;
  /** Hint text */
  hintText: string;
  /** Expand card background (for "tell me more" detail cards) */
  expandCardBg: string;
  /** Expand card border */
  expandCardBorder: string;
}

interface TeachingColorInput {
  isDark: boolean;
  hasBackground: boolean;
  bgTheme: 'dark' | 'light' | null;
}

/** Pure function — no hooks, easily testable. */
export function getTeachingColors({ isDark, hasBackground, bgTheme }: TeachingColorInput): TeachingColors {
  const effectiveDark = hasBackground
    ? (bgTheme ?? 'dark') === 'dark'
    : isDark;

  if (hasBackground && effectiveDark) {
    // Glass over dark background (e.g. space-stars)
    return {
      isGlass: true,
      cardBg: 'rgba(15, 23, 42, 0.6)',
      title: '#F1F5F9',
      body: '#CBD5E1',
      muted: '#64748B',
      accent: '#38BDF8',
      accentSoft: '#818CF8',
      border: 'rgba(148, 163, 184, 0.12)',
      hintBg: 'rgba(129, 140, 248, 0.08)',
      hintBorder: 'rgba(129, 140, 248, 0.15)',
      hintText: '#A78BFA',
      expandCardBg: 'rgba(15, 23, 42, 0.6)',
      expandCardBorder: 'rgba(148, 163, 184, 0.12)',
    };
  }

  if (hasBackground && !effectiveDark) {
    // Glass over light background
    return {
      isGlass: true,
      cardBg: 'rgba(255, 255, 255, 0.6)',
      title: '#1E293B',
      body: '#475569',
      muted: '#94A3B8',
      accent: '#0D9488',
      accentSoft: '#14B8A6',
      border: 'rgba(0, 0, 0, 0.08)',
      hintBg: 'rgba(254, 243, 199, 0.7)',
      hintBorder: 'rgba(253, 230, 138, 0.6)',
      hintText: '#92400E',
      expandCardBg: 'rgba(255, 255, 255, 0.6)',
      expandCardBorder: 'rgba(0, 0, 0, 0.08)',
    };
  }

  if (isDark) {
    // Solid dark (app dark mode, no background)
    return {
      isGlass: false,
      cardBg: '#1E293B',
      title: '#F1F5F9',
      body: '#CBD5E1',
      muted: '#64748B',
      accent: '#38BDF8',
      accentSoft: '#818CF8',
      border: '#334155',
      hintBg: 'rgba(181, 110, 0, 0.15)',
      hintBorder: '#92400E',
      hintText: '#F59E0B',
      expandCardBg: '#1E293B',
      expandCardBorder: '#334155',
    };
  }

  // Solid light (app light mode, no background)
  return {
    isGlass: false,
    cardBg: '#FFFFFF',
    title: '#1E293B',
    body: '#475569',
    muted: '#94A3B8',
    accent: '#0D9488',
    accentSoft: '#14B8A6',
    border: '#E2E8F0',
    hintBg: '#FEF3C7',
    hintBorder: '#FDE68A',
    hintText: '#92400E',
    expandCardBg: '#FFFFFF',
    expandCardBorder: '#E2E8F0',
  };
}
