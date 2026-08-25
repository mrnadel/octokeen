import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, NUNITO, SAFE } from '../theme';
import { pop, ramp } from '../anim';
import { PrimaryButton } from '../ui/PrimaryButton';

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  const mascot = pop(frame, 0, { damping: 10, stiffness: 160 });
  const bob = Math.sin(frame / 7) * 10;
  const wordmark = pop(frame, 10);
  const btn = pop(frame, 22, { damping: 11, stiffness: 150 });
  const breathe = 1 + Math.sin(frame / 8) * 0.02;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, #EEF2FF 0%, ${C.bg} 60%)`,
        fontFamily: NUNITO,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
      }}
    >
      <Img
        src={staticFile('mascot/celebrating.png')}
        style={{
          width: 460,
          transform: `translateY(${interpolate(mascot, [0, 1], [140, bob])}px) scale(${
            0.7 + mascot * 0.3
          })`,
          opacity: ramp(frame, 0, 6),
        }}
      />

      <div
        style={{
          fontSize: 104,
          fontWeight: 900,
          color: C.surface900,
          marginTop: 18,
          opacity: ramp(frame, 10, 8),
          transform: `translateY(${(1 - wordmark) * 40}px)`,
        }}
      >
        octokeen
        <span style={{ color: C.indigo }}>.com</span>
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: C.surface500,
          marginTop: 14,
          opacity: ramp(frame, 16, 8),
        }}
      >
        5 minutes a day. Free to start.
      </div>

      <div
        style={{
          marginTop: 44,
          width: 620,
          opacity: ramp(frame, 22, 6),
          transform: `translateY(${(1 - btn) * 50}px) scale(${breathe})`,
        }}
      >
        <PrimaryButton label="Start learning" color={C.indigo} shadow={C.indigoDeep} />
      </div>
    </AbsoluteFill>
  );
};
