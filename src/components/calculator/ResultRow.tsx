'use client';

export function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #F1F5F9',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: color || '#1E293B' }}>{value}</span>
    </div>
  );
}
