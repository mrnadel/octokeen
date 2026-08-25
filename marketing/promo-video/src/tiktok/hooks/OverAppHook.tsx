import React from 'react';
import { AbsoluteFill, Freeze, useCurrentFrame } from 'remotion';
import { C, HOOK_FRAMES, NUNITO } from '../theme';
import { ramp } from '../anim';
import { NativeText } from '../ui/NativeText';
import { LessonScene } from '../scenes/LessonScene';

/**
 * Shell for every hook that opens with the app already on screen.
 *
 * The single most expensive mistake available on this platform is spending
 * the three-second decision window on something other than the product, so
 * these variants freeze the lesson mid-question behind the copy: the viewer
 * sees a real question they want to answer from frame zero, and the hook line
 * is the reason they stay for it.
 */
export const OverAppHook: React.FC<{
  first: string[];
  second: string[];
  /** Which frame of the lesson to hold behind the copy. */
  backdropFrame?: number;
}> = ({ first, second, backdropFrame = 34 }) => {
  const frame = useCurrentFrame();

  const firstIn = ramp(frame, 2, 5) * (1 - ramp(frame, 40, 5));
  const secondIn = ramp(frame, 44, 5);
  // The scrim lifts as the copy resolves, so the question is fully readable
  // by the time the hook hands over.
  const scrim = 0.62 * (1 - ramp(frame, HOOK_FRAMES - 22, 20));

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: NUNITO }}>
      <Freeze frame={backdropFrame}>
        <LessonScene />
      </Freeze>

      <AbsoluteFill style={{ background: `rgba(8,10,18,${scrim})` }} />

      {/* Sits in the app's empty mid-screen band, clear of both the question
          above and the answer options below. */}
      {/* Anchored into the app's empty mid-screen band: below the question,
          above the answer options, so nothing readable is covered. Each layer
          carries its own offset because an absolutely positioned child is laid
          out against its parent's padding edge, not inside its padding. */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 560, opacity: firstIn }}>
        <NativeText lines={first} size={70} style={{ transform: 'rotate(-1.5deg)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 560, opacity: secondIn }}>
        <NativeText
          lines={second}
          size={70}
          color={C.gold}
          style={{ transform: 'rotate(-1.5deg)' }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Direct question. Turns the viewer into a participant before they decide. */
export const QuizHook: React.FC = () => (
  <OverAppHook first={['90% of adults', 'get this wrong']} second={['can you?']} />
);

/** Direct address. Names the audience so the right person stops scrolling. */
export const CallOutHook: React.FC = () => (
  <OverAppHook
    first={["you're an adult who", 'never got taught', 'how money works']}
    second={['5 minutes a day']}
  />
);

/** Bold claim, delivered as if by a user rather than by the brand. */
export const ClaimHook: React.FC = () => (
  <OverAppHook
    first={['learned more in', '5 minutes here than', '4 years of school']}
    second={['not even joking']}
  />
);
