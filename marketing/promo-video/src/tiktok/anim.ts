import { interpolate, spring } from 'remotion';
import { FPS } from './theme';

type Cfg = { damping?: number; stiffness?: number; mass?: number };

/** Springs 0 -> 1 after `delay` frames. The default feel across the whole ad. */
export const pop = (frame: number, delay = 0, cfg: Cfg = {}) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 14, stiffness: 120, mass: 0.7, ...cfg },
    durationInFrames: 30,
  });

/** Linear 0 -> 1 ramp over `length` frames starting at `delay`, clamped. */
export const ramp = (frame: number, delay: number, length: number) =>
  interpolate(frame, [delay, delay + length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fade + rise, for text and cards entering. */
export const fadeUp = (frame: number, delay = 0, distance = 60) => {
  const p = pop(frame, delay);
  return {
    opacity: ramp(frame, delay, 8),
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

/** Fades a scene's contents out over its last `length` frames. */
export const fadeOutTail = (frame: number, duration: number, length = 8) =>
  interpolate(frame, [duration - length, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
