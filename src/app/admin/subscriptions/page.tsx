'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Overview {
  free: number;
  pro: number;
  team: number;
  activeSubscriptions: number;
  trialUsers: number;
  revenueThisMonthCents: number;
}

interface Subscription {
  id: string;
  tier: string;
  status: string;
  billingInterval: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  userName: string | null;
  userEmail: string | null;
}

interface Payment {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
}

interface ApiData {
  overview: Overview;
  subscriptions: Subscription[];
  recentPayments: Payment[];
}

const tierBadgeStyle = (tier: string): React.CSSProperties => {
  const colors: Record<string, { bg: string; color: string }> = {
    free: { bg: '#F0F0F0', color: '#666' },
    pro: { bg: '#E8F5E9', color: '#2E7D32' },
    team: { bg: '#E3F2FD', color: '#1565C0' },
  };
  const c = colors[tier] ?? colors.free;
  return {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 6,
    background: c.bg,
    color: c.color,
    textTransform: 'capitalize',
  };
};

const paymentStatusStyle = (status: string): React.CSSProperties => {
  const colors: Record<string, { bg: string; color: string }> = {
    succeeded: { bg: '#E8F5E9', color: '#2E7D32' },
    failed: { bg: '#FFEBEE', color: '#C62828' },
    pending: { bg: '#FFF8E1', color: '#F57F17' },
  };
  const c = colors[status] ?? colors.pending;
  return {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 6,
    background: c.bg,
    color: c.color,
    textTransform: 'capitalize',
  };
};

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminSubscriptionsPage() {
  const { status } = useSession();
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/subscriptions');
        if (!res.ok) {
          setError(res.status === 403 ? 'Access denied' : 'Failed to load');
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  if (status === 'loading') return <p style={{ padding: 40 }}>Loading...</p>;
  if (status !== 'authenticated') return <p style={{ padding: 40 }}>Not authenticated</p>;

  const thStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontWeight: 700,
    textAlign: 'left',
  };

  const tdStyle: React.CSSProperties = {
    padding: '10px 12px',
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Subscriptions</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
        Subscription and revenue overview.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data && (
        <>
          {/* Overview Cards */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Free', value: data.overview.free },
              { label: 'Pro', value: data.overview.pro },
              { label: 'Team', value: data.overview.team },
              { label: 'Active Subscriptions', value: data.overview.activeSubscriptions },
              { label: 'Trial Users', value: data.overview.trialUsers },
              { label: 'Revenue (this month)', value: formatDollars(data.overview.revenueThisMonthCents) },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid #E5E5E5',
                  padding: '20px 24px',
                  flex: '1 1 140px',
                  minWidth: 140,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Subscription List */}
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Paid Subscriptions</h2>
          {data.subscriptions.length === 0 ? (
            <p style={{ color: '#999', fontSize: 14, marginBottom: 32 }}>No paid subscriptions yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: 32 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E5E5' }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Tier</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Billing</th>
                    <th style={thStyle}>Period End</th>
                    <th style={thStyle}>Cancel at End</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscriptions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{sub.userName ?? 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{sub.userEmail ?? ''}</div>
                      </td>
                      <td style={tdStyle}>
                        <span style={tierBadgeStyle(sub.tier)}>{sub.tier}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ textTransform: 'capitalize' }}>{sub.status}</span>
                      </td>
                      <td style={tdStyle}>
                        {sub.billingInterval ? sub.billingInterval : '-'}
                      </td>
                      <td style={tdStyle}>
                        {sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                          : '-'}
                      </td>
                      <td style={tdStyle}>
                        {sub.cancelAtPeriodEnd ? (
                          <span style={{ color: '#C62828', fontWeight: 700 }}>Yes</span>
                        ) : (
                          <span style={{ color: '#999' }}>No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Payments */}
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Payments</h2>
          {data.recentPayments.length === 0 ? (
            <p style={{ color: '#999', fontSize: 14 }}>No payments yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E5E5' }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Currency</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{p.userName ?? 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{p.userEmail ?? ''}</div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        {formatDollars(p.amountCents)}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ textTransform: 'uppercase' }}>{p.currency}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={paymentStatusStyle(p.status)}>{p.status}</span>
                      </td>
                      <td style={tdStyle}>
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
