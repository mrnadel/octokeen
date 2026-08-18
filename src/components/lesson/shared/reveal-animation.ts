import type { TargetAndTransition } from 'framer-motion';

/** Per-card tuning for the post-answer reveal. Values differ by card by design. */
export interface RevealTuning {
  /** Peak of the pop on the correct option, e.g. 1.04. */
  scalePeak: number;
  /** Full keyframe track for the shake on a wrongly-picked option. */
  shakeKeyframes: readonly number[];
  /** Opacity applied to options that were neither correct nor picked. */
  dimOpacity: number;
  /** Scale applied to options that were neither correct nor picked. */
  dimScale: number;
}

export interface RevealState {
  /** True once the answer is locked in and feedback should show. */
  revealed: boolean;
  isCorrectOption: boolean;
  isSelected: boolean;
}

const IDLE: TargetAndTransition = { opacity: 1, y: 0 };

/**
 * Animation target for an answer option once the answer is revealed:
 * the correct option pops, a wrong pick shakes, everything else dims.
 * Single source of truth for the shape; each card supplies its own tuning.
 */
export function buildRevealAnimation(
  { revealed, isCorrectOption, isSelected }: RevealState,
  { scalePeak, shakeKeyframes, dimOpacity, dimScale }: RevealTuning,
): TargetAndTransition {
  if (!revealed) return IDLE;
  if (isCorrectOption) return { opacity: 1, y: 0, scale: [1, scalePeak, 1] };
  if (isSelected) return { opacity: 1, y: 0, x: [...shakeKeyframes] };
  return { opacity: dimOpacity, y: 0, scale: dimScale };
}
