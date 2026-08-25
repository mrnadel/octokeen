import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, HOOK_FRAMES, MONO, NUNITO } from '../theme';
import { ramp } from '../anim';
import { NativeText } from '../ui/NativeText';

/** Blurred vertical streaks racing upward: a feed being thumbed through. */
const ScrollStreaks: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ opacity: 0.5 }}>
    {new Array(16).fill(0).map((_, i) => {
      const speed = 30 + ((i * 37) % 22);
      const height = 200 + ((i * 91) % 460);
      const x = 40 + ((i * 137) % 1000);
      const span = 1920 + height;
      const y = 1920 - (((frame * speed + i * 233) % span) + height);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 20 + ((i * 53) % 46),
            height,
            borderRadius: 999,
            background: i % 4 === 0 ? '#334155' : '#1E293B',
            filter: 'blur(9px)',
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/**
 * Pattern-interrupt hook: name the viewer's own screen time back at them.
 * Runs dark and product-free, so it has the least time of the four variants
 * and hands off to the app the moment it lands.
 */
export const DoomscrollHook: React.FC = () => {
  const frame = useCurrentFrame();

  const minutes = Math.round(
    interpolate(frame, [0, 18], [192, 222], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const first = ramp(frame, 22, 5) * (1 - ramp(frame, 42, 5));
  const second = ramp(frame, 46, 5);

  const wipe = ramp(frame, HOOK_FRAMES - 16, 15);
  const wipeSize = interpolate(wipe, [0, 1], [0, 2600]);

  return (
    <AbsoluteFill style={{ background: C.surface900, fontFamily: NUNITO }}>
      <ScrollStreaks frame={frame} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(255,75,75,${
            0.28 + Math.sin(frame / 5) * 0.08
          }) 0%, rgba(255,75,75,0) 58%)`,
        }}
      />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 300 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 8,
            color: C.cardinal,
          }}
        >
          SCREEN TIME TODAY
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 200,
            fontWeight: 800,
            color: C.white,
            marginTop: 20,
            textShadow: '0 0 70px rgba(255,75,75,0.45)',
          }}
        >
          {Math.floor(minutes / 60)}h {String(minutes % 60).padStart(2, '0')}m
        </div>

        <div style={{ position: 'relative', marginTop: 56, height: 200, width: '100%' }}>
          <AbsoluteFill style={{ alignItems: 'center', opacity: first }}>
            <NativeText lines={["and you'll remember", 'none of it']} size={64} />
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: 'center', opacity: second }}>
            <NativeText
              lines={['5 minutes could', 'fix that']}
              size={64}
              color={C.gold}
              highlight="rgba(0,0,0,0.8)"
            />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>

      {/* Light disc opening up, handing off to the app. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: wipeSize,
            height: wipeSize,
            borderRadius: '50%',
            background: C.bg,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
