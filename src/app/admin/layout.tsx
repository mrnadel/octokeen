'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin/feedback', label: 'Feedback' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/subscriptions', label: 'Subscriptions' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: 'system-ui' }}>
      {/* Top navigation bar */}
      <nav
        style={{
          background: 'white',
          borderBottom: '1px solid #E5E5E5',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: 56,
          gap: 32,
        }}
      >
        {/* Back to app */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: '#666',
            textDecoration: 'none',
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>&larr;</span>
          Back to App
        </Link>

        {/* App name */}
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#111',
            flexShrink: 0,
          }}
        >
          MechReady Admin
        </span>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 24,
            background: '#E5E5E5',
            flexShrink: 0,
          }}
        />

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#111' : '#666',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: isActive ? '#F0F0F0' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
