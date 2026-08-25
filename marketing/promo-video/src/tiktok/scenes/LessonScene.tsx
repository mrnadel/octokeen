import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, NUNITO, SAFE, SCENES } from '../theme';
import { pop, ramp } from '../anim';
import { ProgressPips } from '../ui/ProgressPips';
import { AnswerOption, OptionState } from '../ui/AnswerOption';
import { PrimaryButton } from '../ui/PrimaryButton';
import { NativeText } from '../ui/NativeText';

/**
 * The app at full bleed, no device mockup. This is the screen-recording ad
 * format: it costs the same to build as a floating phone but it reads as
 * footage of someone using the app rather than as a product render, and
 * native-looking creative is what carries lower install costs on this feed.
 */

const OPTIONS = [
  { letter: 'A', label: 'Deposit, transfer, withdraw' },
  { letter: 'B', label: 'Earn it, spend it, save it' },
  { letter: 'C', label: 'Budget, invest, donate' },
  { letter: 'D', label: 'Borrow, spend, repay' },
];
const CORRECT = 1;
/** How far the options ride up to make room for the feedback banner. */
const OPTIONS_LIFT = 380;

// Beats within the scene, in local frames. Retiming the ad is editing this.
const T = {
  optionsFrom: 6,
  optionStagger: 6,
  fingerIn: 36,
  tap: 54,
  reveal: 62,
  banner: 70,
  callout: 96,
} as const;

/** Thumb-tap indicator: a soft disc that drops onto the chosen option. */
const Tap: React.FC<{ frame: number }> = ({ frame }) => {
  const approach = ramp(frame, T.fingerIn, 14);
  const press = ramp(frame, T.tap, 5);
  const release = ramp(frame, T.tap + 6, 8);
  const opacity = approach * (1 - release);
  const ripple = ramp(frame, T.tap, 14);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 90,
        opacity,
      }}
    >
      <div
        style={{
          position: 'relative',
          transform: `translateY(${interpolate(approach, [0, 1], [230, 0])}px) scale(${
            1.15 - press * 0.3
          })`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 170,
            height: 170,
            marginLeft: -85,
            marginTop: -85,
            borderRadius: '50%',
            border: `5px solid ${C.macaw}`,
            opacity: (1 - ripple) * 0.8,
            transform: `scale(${0.4 + ripple * 1.5})`,
          }}
        />
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(28,176,246,0.3)',
            border: `5px solid ${C.macaw}`,
          }}
        />
      </div>
    </div>
  );
};

const optionState = (frame: number, index: number): OptionState => {
  if (frame >= T.reveal) return index === CORRECT ? 'correct' : 'dimmed';
  if (frame >= T.tap && index === CORRECT) return 'pressed';
  return 'idle';
};

export const LessonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = SCENES.lesson;

  const pipProgress = 2 + ramp(frame, T.reveal, 18);
  const bannerIn = pop(frame, T.banner, { damping: 18, stiffness: 110 });

  // The benefit callout: 5 words, upper third, once the answer has landed.
  const calloutIn = pop(frame, T.callout);
  const calloutOut = ramp(frame, duration - 14, 10);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: NUNITO,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: SAFE.bottom,
      }}
    >
      <ProgressPips progress={pipProgress} />

      <div style={{ padding: '44px 48px 0' }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            color: C.surface500,
          }}
        >
          CHOOSE THE CORRECT ANSWER
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 900,
            color: C.surface900,
            lineHeight: 1.16,
            marginTop: 20,
          }}
        >
          What are the 3 basic things you can do with money?
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img
          src={staticFile('mascot/thinking.png')}
          style={{
            width: 250,
            opacity: 1 - ramp(frame, T.reveal - 8, 10),
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          padding: '0 40px 40px',
          transform: `translateY(${-bannerIn * OPTIONS_LIFT}px)`,
        }}
      >
        {OPTIONS.map((o, i) => {
          const delay = T.optionsFrom + i * T.optionStagger;
          const p = pop(frame, delay);
          return (
            <div key={o.letter} style={{ position: 'relative' }}>
              <AnswerOption
                letter={o.letter}
                label={o.label}
                state={optionState(frame, i)}
                style={{
                  opacity: ramp(frame, delay, 6),
                  transform: `translateY(${(1 - p) * 60}px)`,
                }}
              />
              {i === CORRECT ? <Tap frame={frame} /> : null}
            </div>
          );
        })}
      </div>

      {/* Correct-answer banner rising over the bottom of the screen. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: SAFE.bottom,
          background: C.seaSponge,
          borderTop: `6px solid ${C.featherGreen}`,
          padding: '40px 40px 44px',
          transform: `translateY(${(1 - bannerIn) * 900}px)`,
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 900, color: C.treeFrog }}>Correct!</div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: C.treeFrog,
            marginTop: 12,
            lineHeight: 1.35,
          }}
        >
          Every financial action is earning, spending, or saving.
        </div>
        <PrimaryButton label="Continue" style={{ marginTop: 26 }} />
      </div>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 396,
          opacity: ramp(frame, T.callout, 6) * (1 - calloutOut),
        }}
      >
        <NativeText
          lines={['You just learned that', 'in five seconds']}
          size={62}
          style={{ transform: `translateY(${(1 - calloutIn) * 30}px) rotate(-1.5deg)` }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
