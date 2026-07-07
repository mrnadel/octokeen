// Shared color tokens — single source of truth for colors used across 2+ files.
// Consumers: teachingColors.ts, lessonColors.ts, unitThemes.ts, unitBackgrounds.ts

export const colors = {
  sapphire: { bg: '#EBF3FF', main: '#3B82F6', dark: '#1E5BB8', mid: '#2D6FD7' },
  teal: { main: '#14B8A6', dark: '#0D9488' },
  amber: { main: '#F59E0B' },
  sky: { 400: '#38BDF8' },
  indigo: { 400: '#818CF8' },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;
