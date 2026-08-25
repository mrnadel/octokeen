import React from 'react';
import { Composition } from 'remotion';
import { PromoVideo } from './PromoVideo';
import { FPS, TOTAL_FRAMES, WIDTH, HEIGHT } from './constants';
import { TikTokAd } from './tiktok/TikTokAd';
import { VARIANTS } from './tiktok/variants';
import {
  FPS as TT_FPS,
  TOTAL_FRAMES as TT_FRAMES,
  WIDTH as TT_WIDTH,
  HEIGHT as TT_HEIGHT,
} from './tiktok/theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* One composition per hook variant; they share the whole body. */}
      {VARIANTS.map((variant) => (
        <Composition
          key={variant.id}
          id={`TikTokAd-${variant.id}`}
          component={TikTokAd}
          durationInFrames={TT_FRAMES}
          fps={TT_FPS}
          width={TT_WIDTH}
          height={TT_HEIGHT}
          defaultProps={{ id: variant.id }}
        />
      ))}
    </>
  );
};
