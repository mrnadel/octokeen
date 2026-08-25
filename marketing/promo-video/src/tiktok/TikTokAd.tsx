import React from 'react';
import { AbsoluteFill, Audio, Series, staticFile } from 'remotion';
import { C, NUNITO, SCENES } from './theme';
import { LessonScene } from './scenes/LessonScene';
import { PayoffScene } from './scenes/PayoffScene';
import { CtaScene } from './scenes/CtaScene';
import { HAS_VOICEOVER, voFile } from './vo';
import { VARIANTS } from './variants';

/**
 * Takes the variant id rather than the variant itself: Remotion serializes a
 * composition's props, so a React component cannot travel through them.
 */
export const TikTokAd: React.FC<{ id: string }> = ({ id }) => {
  const variant = VARIANTS.find((v) => v.id === id);
  if (!variant) throw new Error(`Unknown ad variant: ${id}`);
  const Hook = variant.hook;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: NUNITO }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.hook.duration}>
          <Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.lesson.duration}>
          <LessonScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.payoff.duration}>
          <PayoffScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.cta.duration}>
          <CtaScene />
        </Series.Sequence>
      </Series>

      {HAS_VOICEOVER.includes(id) ? <Audio src={staticFile(voFile(id))} /> : null}
    </AbsoluteFill>
  );
};
