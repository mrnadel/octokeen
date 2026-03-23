'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Trophy, Users, User, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import FriendsBadge from '@/components/friends/FriendsBadge';

const tabs = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/quests', label: 'Quests', icon: Swords },
  { href: '/practice/topics', label: 'Practice', icon: BookOpen },
  { href: '/league', label: 'League', icon: Trophy },
  { href: '/friends', label: 'Friends', icon: Users, badge: true },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-200 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                isActive ? 'text-primary-600' : 'text-surface-400'
              )}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && <FriendsBadge />}
              </span>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
