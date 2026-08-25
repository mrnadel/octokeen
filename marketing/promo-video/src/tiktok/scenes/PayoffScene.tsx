import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, NUNITO, SAFE, SCENES } from '../theme';
import { pop, ramp } from '../anim';

const COURSES = [
  { src: 'badges/course-personal-finance.png', label: 'Money' },
  { src: 'badges/course-psychology.png', label: 'Psychology' },
  { src: 'badges/course-space-astronomy.png', label: 'Space' },
];

const StatRow: React.FC<{
  frame: number;
  delay: number;
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}> = ({ frame, delay, icon, value, label }) => {
  const p = pop(frame, delay, { damping: 11, stiffness: 150 });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        background: 'rgba(255,255,255,0.14)',
        border: '3px solid rgba(255,255,255,0.28)',
        borderRadius: 28,
        padding: '22px 34px',
        width: 780,
        opacity: ramp(frame, delay, 5),
        transform: `translateX(${(1 - p) * -120}px) scale(${0.9 + p * 0.1})`,
      }}
    >
      <div
        style={{
          width: 104,
          height: 104,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 72, fontWeight: 900, color: C.white, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = SCENES.payoff;

  const xp = Math.round(
    interpolate(frame, [4, 22], [0, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const chipsIn = ramp(frame, 36, 10);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.indigoDeep} 0%, ${C.indigo} 46%, ${C.violet} 100%)`,
        fontFamily: NUNITO,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <StatRow
          frame={frame}
          delay={2}
          icon={<Img src={staticFile('badges/gem.png')} style={{ width: 104 }} />}
          value={<span style={{ color: C.gold }}>+{xp} XP</span>}
          label="every lesson"
        />
        <StatRow
          frame={frame}
          delay={13}
          icon={<Img src={staticFile('mascot/on-fire.png')} style={{ width: 104 }} />}
          value="7 day streak"
          label="keep the chain alive"
        />
        <StatRow
          frame={frame}
          delay={24}
          icon={<Img src={staticFile('badges/medal-gold.png')} style={{ width: 104 }} />}
          value="Level 10"
          label="and climbing"
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 22,
          marginTop: 64,
          opacity: chipsIn,
        }}
      >
        {COURSES.map((c, i) => {
          const p = pop(frame, 36 + i * 6, { damping: 12, stiffness: 170 });
          return (
            <div
              key={c.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 26,
                padding: '20px 26px',
                width: 226,
                transform: `translateY(${(1 - p) * 70}px) scale(${0.86 + p * 0.14})`,
              }}
            >
              <Img
                src={staticFile(c.src)}
                style={{ width: 96, height: 96, objectFit: 'contain' }}
              />
              <div style={{ fontSize: 30, fontWeight: 800, color: C.surface800 }}>{c.label}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 48,
          fontSize: 38,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.8)',
          opacity: ramp(frame, 52, 8) * (1 - ramp(frame, duration - 8, 8)),
        }}
      >
        3 courses. More every month.
      </div>
    </AbsoluteFill>
  );
};
