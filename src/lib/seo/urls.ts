import { APP_URL } from '@/lib/constants';

/**
 * Normalizes a route path to the exact form used in canonicals and the
 * sitemap: one leading slash, no trailing slash, no duplicate separators.
 * Every URL the app advertises goes through here so canonical, OpenGraph and
 * sitemap entries can never disagree about trailing slashes.
 */
export function normalizePath(path: string): string {
  const collapsed = `/${path}`.replace(/\/{2,}/g, '/');
  if (collapsed === '/') return '/';
  return collapsed.replace(/\/+$/, '');
}

/** Absolute URL for a route path, rooted at the canonical origin. */
export function absoluteUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === '/' ? APP_URL : `${APP_URL}${normalized}`;
}

/** Joins pre-slugged segments into a path. Empty segments are dropped. */
export function joinPath(...segments: string[]): string {
  return normalizePath(segments.filter(Boolean).join('/'));
}
