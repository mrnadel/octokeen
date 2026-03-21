'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';

interface FlaggedItem {
  contentId: string;
  contentType: ContentFeedbackType;
  questionText: string;
  totalFlags: number;
  reasons: Record<FeedbackReason, number>;
  dismissedAt: string | null;
}

const REASON_LABELS: Record<FeedbackReason, string> = {
  confusing: 'Confusing',
  incorrect: 'Incorrect',
  'too-easy': 'Too Easy',
  'too-hard': 'Too Hard',
};

export default function AdminFeedbackPage() {
  const { status } = useSession();
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDismissed, setShowDismissed] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/content-feedback?includeDismissed=${showDismissed}`
      );
      if (!res.ok) {
        setError(res.status === 403 ? 'Access denied' : 'Failed to load');
        return;
      }
      const data = await res.json();
      setItems(data.items);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [showDismissed]);

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status, fetchData]);

  const handleDismiss = async (contentType: string, contentId: string) => {
    try {
      await fetch('/api/admin/content-feedback/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId }),
      });
      fetchData();
    } catch {
      // Silently fail — data will be stale but consistent on next refresh
    }
  };

  if (status === 'loading') return <p style={{ padding: 40 }}>Loading...</p>;
  if (status !== 'authenticated') return <p style={{ padding: 40 }}>Not authenticated</p>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Content Feedback</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
        Flagged questions sorted by total flags. Review and dismiss after fixing.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={showDismissed}
          onChange={(e) => setShowDismissed(e.target.checked)}
        />
        Show dismissed items
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p style={{ color: '#999', fontSize: 14 }}>No flagged content yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E5E5', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', fontWeight: 700 }}>ID</th>
              <th style={{ padding: '8px 12px', fontWeight: 700 }}>Type</th>
              <th style={{ padding: '8px 12px', fontWeight: 700 }}>Question</th>
              <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'center' }}>Flags</th>
              <th style={{ padding: '8px 12px', fontWeight: 700 }}>Reasons</th>
              <th style={{ padding: '8px 12px', fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const key = `${item.contentType}:${item.contentId}`;
              const isExpanded = expandedId === key;
              return (
                <tr
                  key={key}
                  onClick={() => setExpandedId(isExpanded ? null : key)}
                  style={{
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer',
                    background: item.dismissedAt ? '#FAFAFA' : 'white',
                    opacity: item.dismissedAt ? 0.6 : 1,
                  }}
                >
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>
                    {item.contentId}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: item.contentType === 'question' ? '#E8F5E9' : '#E3F2FD',
                        color: item.contentType === 'question' ? '#2E7D32' : '#1565C0',
                      }}
                    >
                      {item.contentType === 'question' ? 'Practice' : 'Lesson'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: 300 }}>
                    {isExpanded ? item.questionText : item.questionText.slice(0, 60) + (item.questionText.length > 60 ? '...' : '')}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, fontSize: 16 }}>
                    {item.totalFlags}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(Object.entries(item.reasons) as [FeedbackReason, number][])
                        .filter(([, count]) => count > 0)
                        .map(([reason, count]) => (
                          <span
                            key={reason}
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: '#F5F5F5',
                              color: '#666',
                            }}
                          >
                            {REASON_LABELS[reason]} ({count})
                          </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {!item.dismissedAt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(item.contentType, item.contentId);
                        }}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '6px 14px',
                          borderRadius: 8,
                          border: '1.5px solid #E5E5E5',
                          background: 'white',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Dismiss
                      </button>
                    )}
                    {item.dismissedAt && (
                      <span style={{ fontSize: 11, color: '#999' }}>Dismissed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
