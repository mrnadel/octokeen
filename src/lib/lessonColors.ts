import type { UnitTheme } from './unitThemes';
import { useIsDark } from '@/store/useThemeStore';
import { colors } from './color-tokens';

/** Fixed accent theme for lessons/questions — not tied to any unit. */
export const LESSON_ACCENT: UnitTheme = {
  bg: colors.sapphire.bg,
  color: colors.sapphire.main,
  dark: colors.sapphire.dark,
  mid: colors.sapphire.mid,
};

/** Shared dark-mode-aware color palette for lesson/quiz components. */
export function useLessonColors() {
  const isDark = useIsDark();
  return {
    isDark,
    bg: isDark ? colors.slate[900] : '#FAFAFA',
    cardBg: isDark ? colors.slate[800] : 'white',
    headerBg: isDark ? colors.slate[800] : 'white',
    headerBorder: isDark ? colors.slate[700] : '#E5E5E5',
    title: isDark ? colors.slate[200] : '#3C3C3C',
    subtitle: isDark ? colors.slate[300] : '#555555',
    muted: isDark ? colors.slate[600] : '#CFCFCF',
    border: isDark ? colors.slate[700] : '#E5E5E5',
    trackBg: isDark ? colors.slate[700] : '#E5E5E5',
    closeBtnBg: isDark ? colors.slate[700] : '#F5F5F5',
    closeBtnStroke: isDark ? colors.slate[400] : '#AFAFAF',
    optionBg: isDark ? colors.slate[800] : 'white',
    optionText: isDark ? colors.slate[200] : '#3C3C3C',
    optionSelectedBg: isDark ? colors.slate[800] : 'white',
    emptyBg: isDark ? colors.slate[700] : '#F0F0F0',
    emptyActiveBg: isDark ? '#312e81' : '#E8E8FF',
    hintBg: isDark ? 'rgba(181,110,0,0.15)' : '#FFF9E8',
    hintColor: isDark ? colors.amber.main : '#B56E00',
    calcBg: isDark ? colors.slate[800] : 'white',
    disclaimerBg: isDark ? colors.slate[800] : '#FFFFFF',
    disclaimerBorder: isDark ? colors.slate[700] : '#E5E7EB',
    disclaimerText: isDark ? colors.slate[200] : '#3C3C3C',
    disclaimerMuted: isDark ? colors.slate[300] : '#666666',
    skipBg: isDark ? colors.slate[700] : '#F5F5F5',
    skipColor: isDark ? colors.slate[400] : '#AFAFAF',
    dangerBg: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
  };
}
