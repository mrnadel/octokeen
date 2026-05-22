/**
 * Reward frames — earned through achievements and special milestones.
 */

import { type FrameDef } from './utils';

export const rewardFrameDefs: Record<string, FrameDef> = {
  // ── First Gold: matte gold circle with single laurel leaf at top ──
  'first-gold': {
    defs: (s) => (
      <linearGradient id="firstgold-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      const topX = c;
      const topY = c - r + 1;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#firstgold-grad)" strokeWidth={4} />
          {/* Single laurel leaf at top */}
          <ellipse
            cx={topX}
            cy={topY}
            rx={3.5}
            ry={1.5}
            fill="#EAB308"
            transform={`rotate(-90 ${topX} ${topY})`}
          />
        </>
      );
    },
    glowColor: 'rgba(234,179,8,0.25)',
    glowBlur: 8,
  },

  // ── Marathon: double royal blue circles with runner dot and fading trail ──
  marathon: {
    defs: (s) => (
      <linearGradient id="marathon-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#marathon-grad)" strokeWidth={3} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#marathon-grad)" strokeWidth={2} opacity={0.5} />
          {/* Runner dot with fading trail (3 dots along outer ring) */}
          {[0, -12, -24].map((offset, idx) => {
            const angle = (offset - 90) * (Math.PI / 180);
            return (
              <circle
                key={idx}
                cx={c + r1 * Math.cos(angle)}
                cy={c + r1 * Math.sin(angle)}
                r={2 - idx * 0.5}
                fill="#3B82F6"
                opacity={1 - idx * 0.3}
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(59,130,246,0.25)',
    glowBlur: 10,
  },

  // ── Early Bird: sunrise gradient circle with ray lines at top ──
  'early-bird': {
    defs: (s) => (
      <linearGradient id="earlybird-grad" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="40%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      const rayLen = 4;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#earlybird-grad)" strokeWidth={4} />
          {/* 3 ray lines at top (-90, -60, -120 degrees) */}
          {[-90, -60, -120].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={c + r * Math.cos(rad)}
                y1={c + r * Math.sin(rad)}
                x2={c + (r + rayLen) * Math.cos(rad)}
                y2={c + (r + rayLen) * Math.sin(rad)}
                stroke="#FBBF24"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(249,115,22,0.25)',
    glowBlur: 10,
  },

  // ── Perfect Unit: emerald→teal gradient circle with 5 checkmarks at top ──
  'perfect-unit': {
    defs: (s) => (
      <linearGradient id="perfectunit-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#perfectunit-grad)" strokeWidth={3.5} />
          {/* 5 small checkmark paths at top */}
          {[-72, -54, -36, -18, 0].map((offsetDeg, idx) => {
            const angle = (-90 + offsetDeg * 0.5) * (Math.PI / 180);
            const tx = c + (r - 1) * Math.cos(angle + (idx - 2) * 0.12);
            const ty = c + (r - 1) * Math.sin(angle + (idx - 2) * 0.12);
            return (
              <path
                key={idx}
                d={`M ${tx - 1.5} ${ty} L ${tx - 0.5} ${ty + 1.5} L ${tx + 1.5} ${ty - 1}`}
                fill="none"
                stroke="#10B981"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(16,185,129,0.25)',
    glowBlur: 10,
  },

  // ── Speed Demon: yellow→orange→red gradient circle with 3 lightning bolts ──
  'speed-demon': {
    defs: (s) => (
      <linearGradient id="speeddemon-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#speeddemon-grad)" strokeWidth={3} />
          {/* 3 lightning bolt paths at 120 degree intervals */}
          {[0, 120, 240].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const bx = c + (r - 1) * Math.cos(rad);
            const by = c + (r - 1) * Math.sin(rad);
            return (
              <path
                key={angle}
                d={`M ${bx - 1.5} ${by - 2.5} L ${bx + 0.5} ${by - 0.5} L ${bx - 0.5} ${by + 0.5} L ${bx + 1.5} ${by + 2.5}`}
                fill="none"
                stroke="#FBBF24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(251,191,36,0.25)',
    glowBlur: 10,
  },

  // ── Perfectionist: bullseye 3 concentric circles with crosshair lines ──
  perfectionist: {
    defs: () => <></>,
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      const r3 = c - 8;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="#FCA5A5" strokeWidth={2} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="#EF4444" strokeWidth={2} />
          <circle cx={c} cy={c} r={r3} fill="none" stroke="#991B1B" strokeWidth={2} />
          {/* Crosshair lines */}
          <line x1={c} y1={c - r1} x2={c} y2={c - r3} stroke="#FCA5A5" strokeWidth={1} opacity={0.5} />
          <line x1={c} y1={c + r3} x2={c} y2={c + r1} stroke="#FCA5A5" strokeWidth={1} opacity={0.5} />
          <line x1={c - r1} y1={c} x2={c - r3} y2={c} stroke="#FCA5A5" strokeWidth={1} opacity={0.5} />
          <line x1={c + r3} y1={c} x2={c + r1} y2={c} stroke="#FCA5A5" strokeWidth={1} opacity={0.5} />
        </>
      );
    },
    glowColor: 'rgba(239,68,68,0.25)',
    glowBlur: 10,
  },
};
