'use client';

import Link from 'next/link';
import { useIsDark } from '@/store/useThemeStore';
import { useGems } from '@/store/useEngagementStore';
import { shopItems } from '@/data/gem-shop';
import { CURRENCY, currencyLabel } from '@/data/currency';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';

function formatGemSource(source: string): string {
  return source
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\bxp\b/gi, 'XP')
    .replace(/\bdaily\b/gi, 'Daily')
    .replace(/\bweekly\b/gi, 'Weekly')
    .replace(/\bquest\b/gi, 'Quest')
    .replace(/\blesson\b/gi, 'Lesson')
    .replace(/\bchest\b/gi, 'Chest')
    .replace(/\bpurchase\b/gi, 'Purchase');
}

export function GemsPopoverContent({
  gems,
  onGoToShop,
}: {
  gems: ReturnType<typeof useGems>;
  onGoToShop: () => void;
}) {
  const isDark = useIsDark();
  const recentTx = gems.transactions.slice(-5).reverse();
  const affordable = shopItems
    .filter((i) => i.cost <= gems.balance)
    .sort((a, b) => a.cost - b.cost);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
            }}
          >
            <CurrencyIcon size={24} />
          </div>
          <div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#7C3AED', lineHeight: 1 }}>
              {gems.balance.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: isDark ? '#64748B' : '#AFAFAF', fontWeight: 600, marginTop: 2 }}>
              {gems.totalEarned.toLocaleString()} total earned
            </p>
          </div>
        </div>
      </div>

      {/* Affordable items hint */}
      {affordable.length > 0 && (
        <div
          style={{
            background: isDark ? 'rgba(124,58,237,0.1)' : '#F5F3FF',
            borderRadius: 12,
            padding: '10px 12px',
            marginBottom: 14,
            border: isDark ? '1px solid rgba(124,58,237,0.2)' : '1px solid #EDE9FE',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>
            You can afford {affordable.length} item{affordable.length !== 1 ? 's' : ''} in the shop!
          </p>
          <div className="flex items-center" style={{ gap: 4, marginTop: 6 }}>
            {affordable.slice(0, 5).map((item) => (
              <span key={item.id} style={{ fontSize: 16 }} title={`${item.name} — ${item.cost} ${currencyLabel(item.cost)}`}>
                {item.icon}
              </span>
            ))}
            {affordable.length > 5 && (
              <span style={{ fontSize: 10, fontWeight: 800, color: '#A78BFA', marginLeft: 2 }}>
                +{affordable.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {recentTx.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Recent
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: '5px 8px',
                    borderRadius: 8,
                    background: isPositive
                      ? (isDark ? 'rgba(22,163,74,0.1)' : '#FAFFF5')
                      : (isDark ? 'rgba(220,38,38,0.1)' : '#FFF5F5'),
                  }}
                >
                  <span style={{ fontSize: 12, color: isDark ? '#CBD5E1' : '#4B5563', fontWeight: 600, textTransform: 'capitalize', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatGemSource(tx.source)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: isPositive ? '#16A34A' : '#DC2626', flexShrink: 0, marginLeft: 8 }}>
                    {isPositive ? '+' : ''}{tx.amount} <CurrencyIcon size={14} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentTx.length === 0 && (
        <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#AFAFAF', fontWeight: 600 }}>
            Complete quests and lessons to earn {CURRENCY.plural}!
          </p>
        </div>
      )}

      {/* Shop CTA */}
      <Link
        href="/shop"
        onClick={onGoToShop}
        className="flex items-center justify-center transition-all hover:brightness-110 active:scale-95"
        style={{
          gap: 6,
          padding: '10px 16px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
        }}
      >
        🛍️ Visit {CURRENCY.shopName}
      </Link>
    </div>
  );
}
