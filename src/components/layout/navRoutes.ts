/**
 * The app's primary navigation destinations, declared once.
 *
 * DesktopSideNav and MobileBottomNav render different icon sets and styling,
 * but they must agree on where the tabs point and what they are called —
 * that agreement lives here so a renamed route can't break only one of them.
 */

export type NavRouteId = 'home' | 'quests' | 'practice' | 'league' | 'friends' | 'profile';

export interface NavRoute {
  id: NavRouteId;
  href: string;
  label: string;
}

export const NAV_ROUTES: Record<NavRouteId, NavRoute> = {
  home: { id: 'home', href: '/', label: 'Home' },
  quests: { id: 'quests', href: '/quests', label: 'Quests' },
  practice: { id: 'practice', href: '/practice', label: 'Practice' },
  league: { id: 'league', href: '/league', label: 'League' },
  friends: { id: 'friends', href: '/friends', label: 'Friends' },
  profile: { id: 'profile', href: '/profile', label: 'Profile' },
};

/** Tabs shown in the desktop side nav, in order. */
export const DESKTOP_NAV_ORDER = [
  'home',
  'quests',
  'practice',
  'league',
  'friends',
  'profile',
] as const satisfies readonly NavRouteId[];

/** Tabs shown in the mobile bottom bar, in order. Friends is desktop-only. */
export const MOBILE_NAV_ORDER = [
  'home',
  'quests',
  'practice',
  'league',
  'profile',
] as const satisfies readonly NavRouteId[];

export type DesktopNavRouteId = (typeof DESKTOP_NAV_ORDER)[number];
export type MobileNavRouteId = (typeof MOBILE_NAV_ORDER)[number];

/** A tab is active on an exact match, or when the path sits below it. */
export function isNavRouteActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(href));
}
