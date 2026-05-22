/**
 * Common / standard frames — includes the original premium set (gold, diamond,
 * emerald, ruby, sapphire, sunset, aurora, neon) plus the common-tier frames.
 */

import { polyClip, starClip, type FrameDef } from './utils';

export const commonFrameDefs: Record<string, FrameDef> = {
  // ── Gold: classic thick ring with inner shine ──
  gold: {
    defs: (s) => (
      <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="30%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle
          cx={c} cy={c} r={r}
          fill="none"
          stroke="url(#gold-grad)"
          strokeWidth={5}
        />
      );
    },
    glowColor: 'rgba(245,158,11,0.25)',
    glowBlur: 10,
  },

  // ── Diamond: double ring with sparkle marks ──
  diamond: {
    defs: (s) => (
      <linearGradient id="diamond-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="50%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2.5;
      const r2 = c - 5.5;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#diamond-grad)" strokeWidth={2} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#diamond-grad)" strokeWidth={1.5} strokeDasharray="3 6" />
          {/* Sparkle dots at cardinal points */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={angle}
                cx={c + (r1 - 0.5) * Math.cos(rad)}
                cy={c + (r1 - 0.5) * Math.sin(rad)}
                r={2}
                fill="#A5B4FC"
              />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(129,140,248,0.3)',
    glowBlur: 10,
  },

  // ── Emerald: hexagonal shape ──
  emerald: {
    defs: (s) => (
      <linearGradient id="emerald-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      // Hexagon points
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (60 * i - 30) * (Math.PI / 180);
        return `${c + r * Math.cos(angle)},${c + r * Math.sin(angle)}`;
      }).join(' ');
      return (
        <polygon
          points={pts}
          fill="none"
          stroke="url(#emerald-grad)"
          strokeWidth={4}
          strokeLinejoin="round"
        />
      );
    },
    glowColor: 'rgba(16,185,129,0.3)',
    glowBlur: 10,
    avatarClipPath: polyClip(6, -30),
  },

  // ── Ruby: starburst / spiked ring ──
  ruby: {
    defs: (s) => (
      <linearGradient id="ruby-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const outer = c - 1;
      const inner = c - 6;
      const spikes = 12;
      const pts = Array.from({ length: spikes * 2 }, (_, i) => {
        const angle = (i * 360) / (spikes * 2) - 90;
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? outer : inner;
        return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
      }).join(' ');
      return (
        <polygon
          points={pts}
          fill="none"
          stroke="url(#ruby-grad)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      );
    },
    glowColor: 'rgba(239,68,68,0.3)',
    glowBlur: 10,
    avatarClipPath: starClip(12, 48, 43, -90),
  },

  // ── Sapphire: scalloped / wave edge ──
  sapphire: {
    defs: (s) => (
      <linearGradient id="sapphire-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      // Scalloped circle using arcs
      const bumps = 16;
      const bumpDepth = 3;
      let d = '';
      for (let i = 0; i < bumps; i++) {
        const a1 = (360 / bumps) * i - 90;
        const a2 = (360 / bumps) * (i + 0.5) - 90;
        const a3 = (360 / bumps) * (i + 1) - 90;
        const r1 = (a1 * Math.PI) / 180;
        const r2 = (a2 * Math.PI) / 180;
        const r3 = (a3 * Math.PI) / 180;
        const x1 = c + r * Math.cos(r1);
        const y1 = c + r * Math.sin(r1);
        const cx2 = c + (r + bumpDepth) * Math.cos(r2);
        const cy2 = c + (r + bumpDepth) * Math.sin(r2);
        const x3 = c + r * Math.cos(r3);
        const y3 = c + r * Math.sin(r3);
        if (i === 0) d += `M ${x1} ${y1} `;
        d += `Q ${cx2} ${cy2} ${x3} ${y3} `;
      }
      d += 'Z';
      return (
        <path d={d} fill="none" stroke="url(#sapphire-grad)" strokeWidth={3} />
      );
    },
    glowColor: 'rgba(59,130,246,0.3)',
    glowBlur: 10,
  },

  // ── Sunset: thick gradient ring with warm glow ──
  sunset: {
    defs: (s) => (
      <linearGradient id="sunset-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="33%" stopColor="#F97316" />
        <stop offset="66%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3.5;
      return (
        <circle
          cx={c} cy={c} r={r}
          fill="none"
          stroke="url(#sunset-grad)"
          strokeWidth={6}
        />
      );
    },
    glowColor: 'rgba(249,115,22,0.25)',
    glowBlur: 12,
    glowOpacity: 0.6,
  },

  // ── Aurora: rotating dashed ring with gradient ──
  aurora: {
    defs: (s) => (
      <>
        <linearGradient id="aurora-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="aurora-grad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#aurora-grad)" strokeWidth={3} opacity={0.8}>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#aurora-grad2)" strokeWidth={2} strokeDasharray="4 8" opacity={0.6}>
            <animateTransform attributeName="transform" type="rotate" from={`360 ${c} ${c}`} to={`0 ${c} ${c}`} dur="12s" repeatCount="indefinite" />
          </circle>
        </>
      );
    },
    glowColor: 'rgba(139,92,246,0.3)',
    glowBlur: 14,
    glowOpacity: 0.6,
    animated: true,
  },

  // ── Neon: pulsing electric ring ──
  neon: {
    defs: (s) => (
      <linearGradient id="neon-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          {/* Outer neon ring */}
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#neon-grad)" strokeWidth={3}>
            <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Inner accent */}
          <circle cx={c} cy={c} r={r - 3} fill="none" stroke="#22D3EE" strokeWidth={1} opacity={0.3} />
        </>
      );
    },
    glowColor: 'rgba(34,211,238,0.4)',
    glowBlur: 12,
    glowOpacity: 0.7,
    animated: true,
  },

  // ── Steel: solid circle, light gray gradient ──
  steel: {
    defs: (s) => (
      <linearGradient id="steel-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="50%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#steel-grad)" strokeWidth={4} />
      );
    },
    glowColor: 'rgba(107,114,128,0.2)',
    glowBlur: 8,
  },

  // ── Copper: bright copper to patina green gradient ──
  copper: {
    defs: (s) => (
      <linearGradient id="copper-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0A050" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#copper-grad)" strokeWidth={5} />
      );
    },
    glowColor: 'rgba(180,83,9,0.25)',
    glowBlur: 8,
  },

  // ── Bolt: hexagonal frame with vertex dots ──
  bolt: {
    defs: (s) => (
      <linearGradient id="bolt-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4D4D8" />
        <stop offset="50%" stopColor="#A1A1AA" />
        <stop offset="100%" stopColor="#71717A" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      const vertices = Array.from({ length: 6 }, (_, i) => {
        const angle = (60 * i - 30) * (Math.PI / 180);
        return { x: c + r * Math.cos(angle), y: c + r * Math.sin(angle) };
      });
      const pts = vertices.map((v) => `${v.x},${v.y}`).join(' ');
      return (
        <>
          <polygon points={pts} fill="none" stroke="url(#bolt-grad)" strokeWidth={4} strokeLinejoin="round" />
          {vertices.map((v, i) => (
            <circle key={i} cx={v.x} cy={v.y} r={2} fill="#A1A1AA" />
          ))}
        </>
      );
    },
    glowColor: 'rgba(161,161,170,0.2)',
    glowBlur: 8,
    avatarClipPath: polyClip(6, -30),
  },

  // ── Blueprint: double circles with cross-hair lines ──
  blueprint: {
    defs: (s) => (
      <linearGradient id="blueprint-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#93C5FD" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5;
      const tickLen = 4;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="#60A5FA" strokeWidth={2} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="#93C5FD" strokeWidth={1.5} strokeDasharray="3 4" />
          {/* Cross-hair lines at cardinal points */}
          <line x1={c} y1={c - r1 - 1} x2={c} y2={c - r1 + tickLen} stroke="#60A5FA" strokeWidth={1.5} />
          <line x1={c} y1={c + r1 + 1} x2={c} y2={c + r1 - tickLen} stroke="#60A5FA" strokeWidth={1.5} />
          <line x1={c - r1 - 1} y1={c} x2={c - r1 + tickLen} y2={c} stroke="#60A5FA" strokeWidth={1.5} />
          <line x1={c + r1 + 1} y1={c} x2={c + r1 - tickLen} y2={c} stroke="#60A5FA" strokeWidth={1.5} />
        </>
      );
    },
    glowColor: 'rgba(96,165,250,0.2)',
    glowBlur: 8,
  },

  // ── Titanium: thick near-white to dark gradient ──
  titanium: {
    defs: (s) => (
      <linearGradient id="titanium-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E4E4E7" />
        <stop offset="50%" stopColor="#A1A1AA" />
        <stop offset="100%" stopColor="#52525B" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#titanium-grad)" strokeWidth={6} />
      );
    },
    glowColor: 'rgba(161,161,170,0.2)',
    glowBlur: 8,
  },

  // ── Rivet: circle with 8 rivet dots at 45-degree intervals ──
  rivet: {
    defs: (s) => (
      <linearGradient id="rivet-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#57534E" />
        <stop offset="100%" stopColor="#44403C" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#rivet-grad)" strokeWidth={3} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={angle} cx={c + r * Math.cos(rad)} cy={c + r * Math.sin(rad)} r={2.5} fill="#44403C" />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(68,64,60,0.2)',
    glowBlur: 8,
  },

  // ── Cast Iron: rounded rectangle frame ──
  'cast-iron': {
    defs: (s) => (
      <linearGradient id="castiron-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#78716C" />
        <stop offset="50%" stopColor="#44403C" />
        <stop offset="100%" stopColor="#292524" />
      </linearGradient>
    ),
    render: (s) => {
      const inset = 3;
      const sz = s - inset * 2;
      const radius = sz * 0.35;
      return (
        <rect x={inset} y={inset} width={sz} height={sz} rx={radius} fill="none" stroke="url(#castiron-grad)" strokeWidth={4.5} />
      );
    },
    glowColor: 'rgba(68,64,60,0.2)',
    glowBlur: 8,
    avatarClipPath: 'inset(0 round 35%)',
  },

  // ── Spring: scalloped circle in green ──
  spring: {
    defs: (s) => (
      <linearGradient id="spring-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      const bumps = 16;
      const bumpDepth = 3;
      let d = '';
      for (let i = 0; i < bumps; i++) {
        const a1 = (360 / bumps) * i - 90;
        const a2 = (360 / bumps) * (i + 0.5) - 90;
        const a3 = (360 / bumps) * (i + 1) - 90;
        const r1 = (a1 * Math.PI) / 180;
        const r2 = (a2 * Math.PI) / 180;
        const r3 = (a3 * Math.PI) / 180;
        const x1 = c + r * Math.cos(r1);
        const y1 = c + r * Math.sin(r1);
        const cx2 = c + (r + bumpDepth) * Math.cos(r2);
        const cy2 = c + (r + bumpDepth) * Math.sin(r2);
        const x3 = c + r * Math.cos(r3);
        const y3 = c + r * Math.sin(r3);
        if (i === 0) d += `M ${x1} ${y1} `;
        d += `Q ${cx2} ${cy2} ${x3} ${y3} `;
      }
      d += 'Z';
      return (
        <path d={d} fill="none" stroke="url(#spring-grad)" strokeWidth={3} />
      );
    },
    glowColor: 'rgba(52,211,153,0.25)',
    glowBlur: 8,
  },

  // ── Gear: 12-tooth gear polygon ──
  gear: {
    defs: (s) => (
      <linearGradient id="gear-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D6D3D1" />
        <stop offset="50%" stopColor="#A8A29E" />
        <stop offset="100%" stopColor="#57534E" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const outerR = c - 2;
      const innerR = c - 7;
      const teeth = 12;
      const pts = Array.from({ length: teeth * 2 }, (_, i) => {
        const angle = (i * 360) / (teeth * 2) - 90;
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? outerR : innerR;
        return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
      }).join(' ');
      return (
        <polygon points={pts} fill="none" stroke="url(#gear-grad)" strokeWidth={2} strokeLinejoin="round" />
      );
    },
    glowColor: 'rgba(168,162,158,0.2)',
    glowBlur: 8,
    avatarClipPath: starClip(12, 48, 43, -90),
  },

  // ── Gasket: flat red thick circle ──
  gasket: {
    defs: () => <></>,
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#DC2626" strokeWidth={5} />
      );
    },
    glowColor: 'rgba(220,38,38,0.2)',
    glowBlur: 8,
  },

  // ── Wire: thin amber circle ──
  wire: {
    defs: () => <></>,
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#F59E0B" strokeWidth={3} />
      );
    },
    glowColor: 'rgba(245,158,11,0.2)',
    glowBlur: 8,
  },

  // ── Concrete: thick gray circle with texture ──
  concrete: {
    defs: () => <></>,
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#A3A3A3" strokeWidth={6} strokeDasharray="1 0.5" />
      );
    },
    glowColor: 'rgba(163,163,163,0.2)',
    glowBlur: 8,
  },
};
