'use client';

export function CalcInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>{label}</label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        border: '1.5px solid #E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}>
        {prefix && (
          <span style={{ padding: '0 0 0 12px', fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: 'none',
            outline: 'none',
            fontSize: 15,
            fontWeight: 700,
            color: '#1E293B',
            background: 'transparent',
            width: '100%',
            minWidth: 0,
          }}
        />
        {suffix && (
          <span style={{ padding: '0 12px 0 0', fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
