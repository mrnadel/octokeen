'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, Trophy, Users, User, Swords, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import FriendsBadge from '@/components/friends/FriendsBadge';
import { useCourseStore } from '@/store/useCourseStore';
import { getProfession } from '@/data/professions';
import { CourseIcon } from '@/components/course/CourseIcon';
import { NAV_ROUTES, DESKTOP_NAV_ORDER, isNavRouteActive, type DesktopNavRouteId } from './navRoutes';

/** Per-tab icon. Hrefs and labels come from NAV_ROUTES. */
const TAB_ICONS: Record<DesktopNavRouteId, LucideIcon> = {
  home: LayoutDashboard,
  quests: Swords,
  practice: BookOpen,
  league: Trophy,
  friends: Users,
  profile: User,
};

export default function DesktopSideNav() {
  const pathname = usePathname();
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const profession = getProfession(activeProfession);

  return (
      <nav
        className="hidden lg:flex flex-col w-56 shrink-0 bg-[#FAFAFA] dark:bg-surface-950 h-screen sticky top-0"
        aria-label="Desktop navigation"
      >
        <div className="px-5 py-5">
          <p className="text-lg font-black text-surface-800">{APP_NAME}</p>
          {profession && (
            <Link
              href="/switch-course"
              className="flex items-center gap-1.5 mt-1 text-xs font-bold text-surface-400 hover:text-surface-600 transition-colors"
            >
              <CourseIcon professionId={profession.id} color={profession.color} size={22} />
              <span>{profession.shortName}</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-1 px-3 mt-2">
          {DESKTOP_NAV_ORDER.map((id) => {
            const route = NAV_ROUTES[id];
            const Icon = TAB_ICONS[id];
            const isActive = isNavRouteActive(pathname, route.href);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold min-h-[44px]',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
                )}
              >
                <span className="relative">
                  <Icon className="w-5 h-5" />
                  {id === 'friends' && <FriendsBadge />}
                </span>
                <span>{route.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
  );
}
