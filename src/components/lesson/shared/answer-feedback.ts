// Shared color constants for question-card answer feedback states.
// Only values that are identical across all (or most) lesson card components live here.
// Cards with unique overrides (e.g. PickTheBest gradient, varied shadows) keep their own values.

/** Correct-answer colors */
export const CORRECT = {
  bg: '#D7FFB8',
  border: '#58CC02',
  text: '#58A700',
  /** Darker shade used for the 3px/4px bottom shadow on pressed-style buttons */
  shadow: '#46A302',
} as const;

/** Incorrect-answer colors */
export const INCORRECT = {
  bg: '#FFDFE0',
  border: '#FF4B4B',
  text: '#EA2B2B',
  /** Darker shade used for the 3px/4px bottom shadow on pressed-style buttons */
  shadow: '#CC2D2D',
} as const;

/** Disabled / unselected state after reveal */
export const DISABLED = {
  bg: '#F5F5F5',
  border: '#EFEFEF',
} as const;
