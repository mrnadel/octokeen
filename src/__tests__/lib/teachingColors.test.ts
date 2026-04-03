import { describe, it, expect } from 'vitest';
import { getTeachingColors } from '@/lib/teachingColors';

describe('getTeachingColors', () => {
  it('returns solid light tokens when no background and app is light', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: false, bgTheme: null });
    expect(c.cardBg).toBe('#FFFFFF');
    expect(c.title).toBe('#1E293B');
    expect(c.isGlass).toBe(false);
  });

  it('returns solid dark tokens when no background and app is dark', () => {
    const c = getTeachingColors({ isDark: true, hasBackground: false, bgTheme: null });
    expect(c.cardBg).toBe('#1E293B');
    expect(c.title).toBe('#F1F5F9');
    expect(c.isGlass).toBe(false);
  });

  it('returns glass + light text when background is dark', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: 'dark' });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#F1F5F9');
    expect(c.accent).toBe('#38BDF8');
  });

  it('returns glass + dark text when background is light', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: 'light' });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#1E293B');
    expect(c.accent).toBe('#0D9488');
  });

  it('defaults bgTheme to dark when hasBackground but bgTheme is null', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: null });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#F1F5F9');
  });
});
