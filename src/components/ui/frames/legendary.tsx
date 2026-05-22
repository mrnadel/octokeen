/**
 * Legendary frames — animated, premium-tier.
 */

import { polyClip, starClip, type FrameDef } from './utils';

export const legendaryFrameDefs: Record<string, FrameDef> = {
  // ── Singularity: 3 concentric rings rotating independently ──
  singularity: {
    defs: (s) => (
      <linearGradient id="singularity-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      const r3 = c - 8;
      return (
        <>
          {/* Outer solid ring — rotates CW 10s */}
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#singularity-grad)" strokeWidth={3}>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="10s" repeatCount="indefinite" />
          </circle>
          {/* Middle dashed ring — rotates CCW 15s */}
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#singularity-grad)" strokeWidth={2} strokeDasharray="4 6">
            <animateTransform attributeName="transform" type="rotate" from={`360 ${c} ${c}`} to={`0 ${c} ${c}`} dur="15s" repeatCount="indefinite" />
          </circle>
          {/* Inner dotted ring — rotates CW 20s */}
          <circle cx={c} cy={c} r={r3} fill="none" stroke="url(#singularity-grad)" strokeWidth={1} strokeDasharray="1 3">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="20s" repeatCount="indefinite" />
          </circle>
        </>
      );
    },
    glowColor: 'rgba(59,130,246,0.35)',
    glowBlur: 14,
    glowOpacity: 0.6,
    animated: true,
  },

  // ── Fusion Reactor: octagon, inner circle, 3 elliptical orbits with electron dots ──
  'fusion-reactor': {
    defs: (s) => (
      <linearGradient id="fusion-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      // Octagon points
      const octPts = Array.from({ length: 8 }, (_, i) => {
        const angle = (45 * i - 22.5) * (Math.PI / 180);
        return `${c + r * Math.cos(angle)},${c + r * Math.sin(angle)}`;
      }).join(' ');
      const orbitRx = c - 6;
      const orbitRy = (c - 6) * 0.35;
      return (
        <>
          <polygon points={octPts} fill="none" stroke="url(#fusion-grad)" strokeWidth={3} strokeLinejoin="round" />
          <circle cx={c} cy={c} r={c - 8} fill="none" stroke="url(#fusion-grad)" strokeWidth={1} opacity={0.3} />
          {/* 3 elliptical orbit paths at 60 degrees apart */}
          {[0, 60, 120].map((rotation, idx) => {
            const dur = [12, 18, 24][idx];
            return (
              <g key={idx} transform={`rotate(${rotation} ${c} ${c})`}>
                <ellipse cx={c} cy={c} rx={orbitRx} ry={orbitRy} fill="none" stroke="#22D3EE" strokeWidth={0.75} opacity={0.4} />
                {/* Electron dot orbiting */}
                <circle r={2} fill="#22D3EE">
                  <animateMotion dur={`${dur}s`} repeatCount="indefinite">
                    <mpath xlinkHref={`#fusion-orbit-${idx}`} />
                  </animateMotion>
                </circle>
                {/* Hidden path for animateMotion — defined inline */}
                <ellipse id={`fusion-orbit-${idx}`} cx={c} cy={c} rx={orbitRx} ry={orbitRy} fill="none" stroke="none" />
              </g>
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(34,211,238,0.35)',
    glowBlur: 14,
    glowOpacity: 0.6,
    animated: true,
    avatarClipPath: polyClip(8, -22.5),
  },

  // ── Supernova: rotating 12-pointed starburst with stroke-width animation and debris ──
  supernova: {
    defs: (s) => (
      <linearGradient id="supernova-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="33%" stopColor="#F59E0B" />
        <stop offset="66%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const outer = c - 1;
      const inner = c - 5;
      const spikes = 12;
      const pts = Array.from({ length: spikes * 2 }, (_, i) => {
        const angle = (i * 360) / (spikes * 2) - 90;
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? outer : inner;
        return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
      }).join(' ');
      return (
        <>
          {/* Rotating starburst */}
          <polygon points={pts} fill="none" stroke="url(#supernova-grad)" strokeLinejoin="round">
            <animate attributeName="stroke-width" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="25s" repeatCount="indefinite" />
          </polygon>
          {/* 6 debris circles with opacity animation */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const dx = c + (outer + 1) * Math.cos(rad);
            const dy = c + (outer + 1) * Math.sin(rad);
            return (
              <circle key={angle} cx={dx} cy={dy} r={1.5} fill="#F97316">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" begin={`${angle / 360}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(249,115,22,0.4)',
    glowBlur: 14,
    glowOpacity: 0.7,
    animated: true,
    avatarClipPath: starClip(12, 48, 44, -90),
  },

  // ── All-Gold: thick 5-stop gold gradient circle with laurel leaves and rotating inner ring ──
  'all-gold': {
    defs: (s) => (
      <>
        <linearGradient id="allgold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="25%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="allgold-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#allgold-grad)" strokeWidth={5} />
          {/* 10 laurel leaf ellipses */}
          {Array.from({ length: 10 }, (_, i) => {
            const angle = 36 * i;
            const rad = (angle * Math.PI) / 180;
            const lx = c + (r - 1) * Math.cos(rad);
            const ly = c + (r - 1) * Math.sin(rad);
            return (
              <ellipse
                key={i}
                cx={lx}
                cy={ly}
                rx={3.5}
                ry={1.5}
                fill="url(#allgold-leaf)"
                transform={`rotate(${angle} ${lx} ${ly})`}
              />
            );
          })}
          {/* Inner dashed ring rotating at 30s */}
          <circle cx={c} cy={c} r={c - 7} fill="none" stroke="url(#allgold-grad)" strokeWidth={1} strokeDasharray="3 5" opacity={0.4}>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="30s" repeatCount="indefinite" />
          </circle>
        </>
      );
    },
    glowColor: 'rgba(245,158,11,0.35)',
    glowBlur: 14,
    glowOpacity: 0.7,
    animated: true,
  },
};
