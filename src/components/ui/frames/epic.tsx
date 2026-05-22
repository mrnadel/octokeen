/**
 * Epic frames — unique shapes.
 */

import { starClip, type FrameDef } from './utils';

export const epicFrameDefs: Record<string, FrameDef> = {
  // ── Turbine: outer circle with 8 curved blade ellipses and inner hub ──
  turbine: {
    defs: (s) => (
      <linearGradient id="turbine-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#turbine-grad)" strokeWidth={2} />
          {/* 8 curved blade ellipses arranged radially */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = 45 * i;
            const rad = (angle * Math.PI) / 180;
            const bx = c + (r - 6) * Math.cos(rad);
            const by = c + (r - 6) * Math.sin(rad);
            return (
              <ellipse
                key={i}
                cx={bx}
                cy={by}
                rx={8}
                ry={2}
                fill="none"
                stroke="url(#turbine-grad)"
                strokeWidth={1.5}
                transform={`rotate(${angle} ${bx} ${by})`}
              />
            );
          })}
          {/* Inner hub circle */}
          <circle cx={c} cy={c} r={c - 8} fill="none" stroke="url(#turbine-grad)" strokeWidth={1.5} opacity={0.5} />
        </>
      );
    },
    glowColor: 'rgba(56,189,248,0.3)',
    glowBlur: 10,
  },

  // ── Plasma: 3 concentric circles with purple→magenta→pink gradient ──
  plasma: {
    defs: (s) => (
      <linearGradient id="plasma-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      const r3 = c - 8;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#plasma-grad)" strokeWidth={3} opacity={0.9} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#plasma-grad)" strokeWidth={2} opacity={0.6} />
          <circle cx={c} cy={c} r={r3} fill="none" stroke="url(#plasma-grad)" strokeWidth={1} opacity={0.3} />
        </>
      );
    },
    glowColor: 'rgba(139,92,246,0.3)',
    glowBlur: 12,
  },

  // ── Star-Drive: 8-pointed star with gold gradient and inner dotted circle ──
  'star-drive': {
    defs: (s) => (
      <linearGradient id="stardrive-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const outer = c - 1;
      const inner = c - 5;
      const spikes = 8;
      const pts = Array.from({ length: spikes * 2 }, (_, i) => {
        const angle = (i * 360) / (spikes * 2) - 90;
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? outer : inner;
        return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
      }).join(' ');
      return (
        <>
          <polygon points={pts} fill="none" stroke="url(#stardrive-grad)" strokeWidth={2} strokeLinejoin="round" />
          <circle cx={c} cy={c} r={c - 7} fill="none" stroke="url(#stardrive-grad)" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        </>
      );
    },
    glowColor: 'rgba(245,158,11,0.3)',
    glowBlur: 10,
    avatarClipPath: starClip(8, 48, 44, -90),
  },
};
