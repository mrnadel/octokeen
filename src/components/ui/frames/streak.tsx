/**
 * Streak milestone frames — earned at 30, 60, 100 day streaks.
 */

import { starClip, type FrameDef } from './utils';

export const streakFrameDefs: Record<string, FrameDef> = {
  // ── Iron Will (30-day): sturdy square-ish rounded frame ──
  'streak-iron': {
    defs: (s) => (
      <linearGradient id="si-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    ),
    render: (s) => {
      const inset = 3;
      const sz = s - inset * 2;
      const radius = sz * 0.3;
      return (
        <rect x={inset} y={inset} width={sz} height={sz} rx={radius} fill="none" stroke="url(#si-grad)" strokeWidth={4} />
      );
    },
    glowColor: 'rgba(100,116,139,0.25)',
    glowBlur: 8,
    avatarClipPath: 'inset(0 round 30%)',
  },

  // ── Diamond Mind (60-day): faceted diamond cut ──
  'streak-diamond': {
    defs: (s) => (
      <linearGradient id="sd-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="33%" stopColor="#60A5FA" />
        <stop offset="66%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      // Diamond with 4 points + 4 flat sides
      const pts = [
        `${c},${c - r}`,          // top
        `${c + r * 0.7},${c - r * 0.7}`,
        `${c + r},${c}`,          // right
        `${c + r * 0.7},${c + r * 0.7}`,
        `${c},${c + r}`,          // bottom
        `${c - r * 0.7},${c + r * 0.7}`,
        `${c - r},${c}`,          // left
        `${c - r * 0.7},${c - r * 0.7}`,
      ].join(' ');
      return (
        <>
          <polygon points={pts} fill="none" stroke="url(#sd-grad)" strokeWidth={3} strokeLinejoin="round" />
          <circle cx={c} cy={c} r={c - 5} fill="none" stroke="url(#sd-grad)" strokeWidth={1} opacity={0.3} />
        </>
      );
    },
    glowColor: 'rgba(96,165,250,0.3)',
    glowBlur: 10,
    avatarClipPath: starClip(4, 48, 34, -90),
  },

  // ── Centurion (100-day): rotating laurel wreath ──
  'streak-centurion': {
    defs: (s) => (
      <>
        <linearGradient id="sc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="sc-grad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      // Double wreath: 10 leaf marks on outer ring
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#sc-grad)" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, i) => {
            const angle = (36 * i) * (Math.PI / 180);
            const x = c + (r - 1) * Math.cos(angle);
            const y = c + (r - 1) * Math.sin(angle);
            return (
              <ellipse
                key={i}
                cx={x} cy={y}
                rx={3.5} ry={1.5}
                fill="url(#sc-grad2)"
                transform={`rotate(${36 * i} ${x} ${y})`}
              />
            );
          })}
          <circle cx={c} cy={c} r={c - 6} fill="none" stroke="url(#sc-grad)" strokeWidth={1} opacity={0.3}>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`-360 ${c} ${c}`} dur="30s" repeatCount="indefinite" />
          </circle>
        </>
      );
    },
    glowColor: 'rgba(251,191,36,0.35)',
    glowBlur: 12,
    glowOpacity: 0.6,
    animated: true,
  },
};
