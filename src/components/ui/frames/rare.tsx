/**
 * Rare frames — more complex shapes with gradients.
 */

import { type FrameDef } from './utils';

export const rareFrameDefs: Record<string, FrameDef> = {
  // ── Wrench: double ring with rectangular notches ──
  wrench: {
    defs: (s) => (
      <linearGradient id="wrench-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5.5;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#wrench-grad)" strokeWidth={3} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#wrench-grad)" strokeWidth={1.5} strokeDasharray="3 5" />
          {/* Rectangular notches at cardinal points */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const nx = c + ((r1 + r2) / 2) * Math.cos(rad);
            const ny = c + ((r1 + r2) / 2) * Math.sin(rad);
            return (
              <rect
                key={angle}
                x={nx - 2}
                y={ny - 1}
                width={4}
                height={2}
                fill="#475569"
                transform={`rotate(${angle} ${nx} ${ny})`}
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(100,116,139,0.25)',
    glowBlur: 10,
  },

  // ── Piston: two concentric circles with connecting lines ──
  piston: {
    defs: (s) => (
      <linearGradient id="piston-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 6;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#piston-grad)" strokeWidth={3} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#piston-grad)" strokeWidth={2} />
          {/* Connecting lines at 45, 135, 225, 315 degrees */}
          {[45, 135, 225, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={c + r2 * Math.cos(rad)}
                y1={c + r2 * Math.sin(rad)}
                x2={c + r1 * Math.cos(rad)}
                y2={c + r1 * Math.sin(rad)}
                stroke="url(#piston-grad)"
                strokeWidth={1.5}
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(239,68,68,0.25)',
    glowBlur: 10,
  },

  // ── Circuit: PCB green circle with trace lines and solder pads ──
  circuit: {
    defs: () => <></>,
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      const traceLen = 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="#16A34A" strokeWidth={3} />
          {/* 8 perpendicular trace lines with solder pad circles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = c + r * Math.cos(rad);
            const y1 = c + r * Math.sin(rad);
            const x2 = c + (r + traceLen) * Math.cos(rad);
            const y2 = c + (r + traceLen) * Math.sin(rad);
            return (
              <g key={angle}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4ADE80" strokeWidth={1.5} />
                <circle cx={x2} cy={y2} r={1.5} fill="#4ADE80" />
              </g>
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(22,163,74,0.25)',
    glowBlur: 10,
  },

  // ── Thermal: 5-stop blue→cyan→green→yellow→red gradient circle ──
  thermal: {
    defs: (s) => (
      <linearGradient id="thermal-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="25%" stopColor="#06B6D4" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="75%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#thermal-grad)" strokeWidth={5} />
      );
    },
    glowColor: 'rgba(234,179,8,0.25)',
    glowBlur: 10,
  },

  // ── Weld: zigzag chevron texture circle with inner glow ──
  weld: {
    defs: (s) => (
      <linearGradient id="weld-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      const notches = 24;
      const notchDepth = 2;
      let d = '';
      for (let i = 0; i < notches; i++) {
        const a1 = (360 / notches) * i - 90;
        const aMid = (360 / notches) * (i + 0.5) - 90;
        const a2 = (360 / notches) * (i + 1) - 90;
        const rad1 = (a1 * Math.PI) / 180;
        const radMid = (aMid * Math.PI) / 180;
        const rad2 = (a2 * Math.PI) / 180;
        const x1 = c + r * Math.cos(rad1);
        const y1 = c + r * Math.sin(rad1);
        const xMid = c + (r + notchDepth) * Math.cos(radMid);
        const yMid = c + (r + notchDepth) * Math.sin(radMid);
        const x2 = c + r * Math.cos(rad2);
        const y2 = c + r * Math.sin(rad2);
        if (i === 0) d += `M ${x1} ${y1} `;
        d += `L ${xMid} ${yMid} L ${x2} ${y2} `;
      }
      d += 'Z';
      return (
        <>
          <path d={d} fill="none" stroke="url(#weld-grad)" strokeWidth={2} strokeLinejoin="round" />
          {/* Inner thin glow circle */}
          <circle cx={c} cy={c} r={c - 6} fill="none" stroke="#FB923C" strokeWidth={1} opacity={0.3} />
        </>
      );
    },
    glowColor: 'rgba(251,146,60,0.3)',
    glowBlur: 10,
  },
};
