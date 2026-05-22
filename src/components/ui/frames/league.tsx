/**
 * League tier frames — earned by reaching each league tier.
 */

import { polyClip, starClip, type FrameDef } from './utils';

export const leagueFrameDefs: Record<string, FrameDef> = {
  // ── Bronze League: simple shield outline ──
  'league-bronze': {
    defs: (s) => (
      <linearGradient id="lb-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4A574" />
        <stop offset="50%" stopColor="#CD7F32" />
        <stop offset="100%" stopColor="#A0522D" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#lb-grad)" strokeWidth={4} />
      );
    },
    glowColor: 'rgba(205,127,50,0.2)',
    glowBlur: 8,
  },

  // ── Silver League: beveled ring with notches ──
  'league-silver': {
    defs: (s) => (
      <linearGradient id="ls-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E8E8E8" />
        <stop offset="30%" stopColor="#C0C0C0" />
        <stop offset="70%" stopColor="#A8A8A8" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 3;
      return (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="url(#ls-grad)" strokeWidth={4} />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={angle} cx={c + r * Math.cos(rad)} cy={c + r * Math.sin(rad)} r={2.5} fill="#C0C0C0" stroke="white" strokeWidth={1} />
            );
          })}
        </>
      );
    },
    glowColor: 'rgba(192,192,192,0.25)',
    glowBlur: 8,
  },

  // ── Gold League: thick ornate double ring ──
  'league-gold': {
    defs: (s) => (
      <linearGradient id="lg-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="25%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#DAA520" />
        <stop offset="75%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r1 = c - 2;
      const r2 = c - 5.5;
      return (
        <>
          <circle cx={c} cy={c} r={r1} fill="none" stroke="url(#lg-grad)" strokeWidth={3} />
          <circle cx={c} cy={c} r={r2} fill="none" stroke="url(#lg-grad)" strokeWidth={1.5} />
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return <circle key={angle} cx={c + (r1 + r2) / 2 * Math.cos(rad)} cy={c + (r1 + r2) / 2 * Math.sin(rad)} r={2} fill="#FFD700" />;
          })}
        </>
      );
    },
    glowColor: 'rgba(255,215,0,0.3)',
    glowBlur: 10,
  },

  // ── Platinum League: octagonal gem cut + rotating inner ──
  'league-platinum': {
    defs: (s) => (
      <linearGradient id="lp-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="50%" stopColor="#00BCD4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    ),
    render: (s) => {
      const c = s / 2;
      const r = c - 2;
      const pts = Array.from({ length: 8 }, (_, i) => {
        const angle = (45 * i - 22.5) * (Math.PI / 180);
        return `${c + r * Math.cos(angle)},${c + r * Math.sin(angle)}`;
      }).join(' ');
      return (
        <>
          <polygon points={pts} fill="none" stroke="url(#lp-grad)" strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={c} cy={c} r={c - 6} fill="none" stroke="url(#lp-grad)" strokeWidth={1} strokeDasharray="3 5" opacity={0.5}>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="15s" repeatCount="indefinite" />
          </circle>
        </>
      );
    },
    glowColor: 'rgba(0,188,212,0.3)',
    glowBlur: 12,
    animated: true,
    avatarClipPath: polyClip(8, -22.5),
  },

  // ── Masters League: crown-shaped frame with animated glow ──
  'league-masters': {
    defs: (s) => (
      <>
        <linearGradient id="lm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E879F9" />
          <stop offset="50%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#7B1FA2" />
        </linearGradient>
        <linearGradient id="lm-grad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
      </>
    ),
    render: (s) => {
      const c = s / 2;
      const outer = c - 1;
      const inner = c - 5;
      const spikes = 5;
      // Crown-like star points
      const pts = Array.from({ length: spikes * 2 }, (_, i) => {
        const angle = (i * 360) / (spikes * 2) - 90;
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? outer : inner;
        return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
      }).join(' ');
      return (
        <>
          <polygon points={pts} fill="none" stroke="url(#lm-grad)" strokeWidth={2.5} strokeLinejoin="round">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="20s" repeatCount="indefinite" />
          </polygon>
          <circle cx={c} cy={c} r={c - 3} fill="none" stroke="url(#lm-grad2)" strokeWidth={2} opacity={0.4} />
        </>
      );
    },
    glowColor: 'rgba(156,39,176,0.35)',
    glowBlur: 14,
    glowOpacity: 0.7,
    animated: true,
    avatarClipPath: starClip(5, 48, 44, -90),
  },
};
