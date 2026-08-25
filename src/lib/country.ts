/**
 * Country resolution.
 *
 * The user's country picks localized content variants (`question.variants[code]`)
 * and labels a few finance figures. We do not ask for it during onboarding —
 * one more tap before the first lesson costs more than the guess is worth — so
 * it is detected instead, and Settings → Region stays the way to correct it.
 *
 * Detection order, most to least trustworthy:
 *   1. `ok-geo` cookie, written by `src/proxy.ts` from Vercel's edge geo header.
 *   2. The region subtag of the browser locale (`en-GB` → `GB`).
 *   3. The IANA timezone (`Asia/Jerusalem` → `IL`).
 *
 * Anything the user picks themselves is stored under `STORAGE_KEYS.COUNTRY`
 * and always wins: detection only ever fills an empty slot.
 */

import { STORAGE_KEYS } from '@/lib/storage-keys';

// ── Supported regions ─────────────────────────────────────────

/** Regions offered in Settings. `EU` is a catch-all for other EU members, `XX` for everywhere else. */
export const REGION_OPTIONS = [
  { code: 'US', label: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'GB', label: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'AU', label: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'CA', label: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'IL', label: 'Israel', flag: '\u{1F1EE}\u{1F1F1}' },
  { code: 'IN', label: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'DE', label: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', label: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'JP', label: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'KR', label: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'BR', label: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'MX', label: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}' },
  { code: 'NL', label: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}' },
  { code: 'SE', label: 'Sweden', flag: '\u{1F1F8}\u{1F1EA}' },
  { code: 'CH', label: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}' },
  { code: 'SG', label: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: 'NZ', label: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}' },
  { code: 'ZA', label: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
  { code: 'AE', label: 'United Arab Emirates', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'EU', label: 'Europe (other)', flag: '\u{1F1EA}\u{1F1FA}' },
  { code: 'XX', label: 'Other', flag: '\u{1F30D}' },
] as const;

export type RegionCode = (typeof REGION_OPTIONS)[number]['code'];

const SUPPORTED = new Set<string>(REGION_OPTIONS.map((r) => r.code));

/** EU members without their own entry above — they collapse to `EU`. */
const EU_MEMBERS = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

/** Name of the cookie `src/proxy.ts` writes with the edge-detected country. */
export const GEO_COOKIE = 'ok-geo';

/**
 * Codes the old onboarding step wrote that no longer exist. Users who answered
 * it still have these stored, and their answer is a real choice — translate it
 * rather than discarding it and guessing over the top.
 */
const LEGACY_ALIASES: Record<string, RegionCode> = {
  INT: 'XX',
  UK: 'GB',
};

/**
 * Fold any ISO 3166-1 alpha-2 code into a region we actually support.
 * Unknown European countries become `EU`; everything else becomes `XX`.
 */
export function normalizeCountry(raw: string | null | undefined): RegionCode | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (LEGACY_ALIASES[code]) return LEGACY_ALIASES[code];
  if (!/^[A-Z]{2}$/.test(code)) return null;
  if (SUPPORTED.has(code)) return code as RegionCode;
  if (EU_MEMBERS.has(code)) return 'EU';
  return 'XX';
}

// ── Detection ─────────────────────────────────────────────────

/**
 * Timezones worth mapping. Only zones that resolve to a region we support are
 * listed; a prefix match handles the rest of each country's zones.
 */
const TIMEZONE_PREFIXES: [prefix: string, code: RegionCode][] = [
  ['Asia/Jerusalem', 'IL'],
  ['Asia/Tel_Aviv', 'IL'],
  ['Europe/London', 'GB'],
  ['Europe/Belfast', 'GB'],
  ['Europe/Dublin', 'EU'],
  ['Europe/Berlin', 'DE'],
  ['Europe/Paris', 'FR'],
  ['Europe/Amsterdam', 'NL'],
  ['Europe/Stockholm', 'SE'],
  ['Europe/Zurich', 'CH'],
  ['Europe/', 'EU'],
  ['Australia/', 'AU'],
  ['Pacific/Auckland', 'NZ'],
  ['Asia/Tokyo', 'JP'],
  ['Asia/Seoul', 'KR'],
  ['Asia/Kolkata', 'IN'],
  ['Asia/Calcutta', 'IN'],
  ['Asia/Singapore', 'SG'],
  ['Asia/Dubai', 'AE'],
  ['Africa/Johannesburg', 'ZA'],
  ['America/Toronto', 'CA'],
  ['America/Vancouver', 'CA'],
  ['America/Edmonton', 'CA'],
  ['America/Winnipeg', 'CA'],
  ['America/Halifax', 'CA'],
  ['America/St_Johns', 'CA'],
  ['America/Sao_Paulo', 'BR'],
  ['America/Bahia', 'BR'],
  ['America/Fortaleza', 'BR'],
  ['America/Recife', 'BR'],
  ['America/Manaus', 'BR'],
  ['America/Mexico_City', 'MX'],
  ['America/Monterrey', 'MX'],
  ['America/Tijuana', 'MX'],
  ['America/Cancun', 'MX'],
];

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function fromLocale(): RegionCode | null {
  const locales = [
    ...(typeof navigator !== 'undefined' ? navigator.languages ?? [] : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ].filter(Boolean);
  for (const locale of locales) {
    // `en-GB` / `he-IL` / `en-Latn-US` — the region subtag is the 2-letter part.
    const region = locale.split('-').find((part) => /^[A-Za-z]{2}$/.test(part) && part === part.toUpperCase());
    const code = normalizeCountry(region);
    // A bare `en` yields nothing; `en-US` yields US. Skip locales without a region.
    if (code) return code;
  }
  return null;
}

function fromTimezone(): RegionCode | null {
  let zone: string;
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return null;
  }
  if (!zone) return null;
  for (const [prefix, code] of TIMEZONE_PREFIXES) {
    if (zone.startsWith(prefix)) return code;
  }
  // Remaining North American zones are overwhelmingly US.
  if (zone.startsWith('America/') || zone.startsWith('US/')) return 'US';
  return null;
}

/** Best guess at the user's region, or `null` when nothing is detectable. */
export function detectCountry(): RegionCode | null {
  if (typeof window === 'undefined') return null;
  return normalizeCountry(readCookie(GEO_COOKIE)) ?? fromLocale() ?? fromTimezone();
}

/**
 * The region to use right now: the stored choice if there is one, otherwise a
 * fresh detection. Does not write anything — see `useCountryInit`.
 */
export function getCountry(): RegionCode | null {
  if (typeof window === 'undefined') return null;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEYS.COUNTRY);
  } catch {
    /* private mode */
  }
  return normalizeCountry(stored) ?? detectCountry();
}
