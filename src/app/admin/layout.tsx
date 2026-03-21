'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin/feedback', label: 'Feedback' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/subscriptions', label: 'Subs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: 'system-ui' }}>
      {/* Top bar: back + title */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #E5E5E5',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          height: 48,
          gap: 12,
        }}
      >
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
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>&larr;</span>
          App
        </Link>

        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#111',
            marginLeft: 'auto',
          }}
        >
          Admin
        </span>
      </div>

      {/* Nav tabs: horizontally scrollable */}
      <nav
        style={{
          background: 'white',
          borderBottom: '2px solid #E5E5E5',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '0 12px',
            gap: 2,
            minWidth: 'max-content',
          }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#111' : '#888',
                  textDecoration: 'none',
                  padding: '10px 14px',
                  borderBottom: isActive ? '2px solid #111' : '2px solid transparent',
                  marginBottom: -2,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Page content */}
      <main style={{ padding: '16px' }}>
        {children}
      </main>
    </div>
  );
}
