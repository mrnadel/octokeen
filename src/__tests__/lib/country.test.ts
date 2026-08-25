import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { normalizeCountry, detectCountry, getCountry, GEO_COOKIE } from '@/lib/country';
import { STORAGE_KEYS } from '@/lib/storage-keys';

/** Point `Intl.DateTimeFormat().resolvedOptions().timeZone` at a chosen zone. */
function mockTimezone(timeZone: string) {
  const real = Intl.DateTimeFormat;
  vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(((...args: unknown[]) => {
    const instance = new (real as unknown as new (...a: unknown[]) => Intl.DateTimeFormat)(...args);
    return {
      ...instance,
      resolvedOptions: () => ({ ...instance.resolvedOptions(), timeZone }),
    } as Intl.DateTimeFormat;
  }) as unknown as typeof Intl.DateTimeFormat);
}

function mockLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(languages[0] ?? '');
}

describe('normalizeCountry', () => {
  it('keeps a supported country as-is', () => {
    expect(normalizeCountry('IL')).toBe('IL');
    expect(normalizeCountry('gb')).toBe('GB');
  });

  it('folds an unlisted EU member into EU', () => {
    expect(normalizeCountry('PT')).toBe('EU');
    expect(normalizeCountry('PL')).toBe('EU');
  });

  it('folds everything else into XX', () => {
    expect(normalizeCountry('AR')).toBe('XX');
    expect(normalizeCountry('NG')).toBe('XX');
  });

  it('translates codes the retired onboarding step used to write', () => {
    expect(normalizeCountry('INT')).toBe('XX');
    expect(normalizeCountry('UK')).toBe('GB');
  });

  it('rejects junk', () => {
    expect(normalizeCountry(null)).toBeNull();
    expect(normalizeCountry('')).toBeNull();
    expect(normalizeCountry('USA')).toBeNull();
    expect(normalizeCountry('1L')).toBeNull();
  });
});

describe('detectCountry', () => {
  beforeEach(() => {
    document.cookie = `${GEO_COOKIE}=; max-age=0; path=/`;
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = `${GEO_COOKIE}=; max-age=0; path=/`;
  });

  it('prefers the edge geo cookie over the browser locale', () => {
    document.cookie = `${GEO_COOKIE}=IL; path=/`;
    mockLanguages(['en-US']);

    expect(detectCountry()).toBe('IL');
  });

  it('falls back to the locale region subtag', () => {
    mockLanguages(['en-GB']);

    expect(detectCountry()).toBe('GB');
  });

  it('skips locales that carry no region', () => {
    mockLanguages(['en', 'fr-CA']);

    expect(detectCountry()).toBe('CA');
  });

  it('falls back to the timezone when the locale has no region at all', () => {
    mockLanguages(['en']);
    mockTimezone('Asia/Jerusalem');

    expect(detectCountry()).toBe('IL');
  });

  it('maps unlisted European timezones to EU', () => {
    mockLanguages(['en']);
    mockTimezone('Europe/Warsaw');

    expect(detectCountry()).toBe('EU');
  });

  it('treats leftover American timezones as US', () => {
    mockLanguages(['en']);
    mockTimezone('America/Denver');

    expect(detectCountry()).toBe('US');
  });

  it('does not mistake a Canadian timezone for a US one', () => {
    mockLanguages(['en']);
    mockTimezone('America/Toronto');

    expect(detectCountry()).toBe('CA');
  });
});

describe('getCountry', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${GEO_COOKIE}=; max-age=0; path=/`;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('lets the stored choice beat detection', () => {
    localStorage.setItem(STORAGE_KEYS.COUNTRY, 'JP');
    document.cookie = `${GEO_COOKIE}=IL; path=/`;

    expect(getCountry()).toBe('JP');
  });

  it('detects when nothing is stored', () => {
    document.cookie = `${GEO_COOKIE}=IL; path=/`;

    expect(getCountry()).toBe('IL');
  });

  it('ignores a corrupted stored value and detects instead', () => {
    localStorage.setItem(STORAGE_KEYS.COUNTRY, 'not-a-country');
    document.cookie = `${GEO_COOKIE}=GB; path=/`;

    expect(getCountry()).toBe('GB');
  });
});
