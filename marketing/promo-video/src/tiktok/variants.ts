import React from 'react';
import { DoomscrollHook } from './hooks/DoomscrollHook';
import { QuizHook, CallOutHook, ClaimHook } from './hooks/OverAppHook';
import { VoLine } from './vo';

/**
 * One ad is not a TikTok campaign. Hook choice alone moves cost per install by
 * several times on identical body footage, ad groups running five or more
 * creatives beat ad groups running fewer, and creative fatigues within about a
 * week. So the body is built once and the hook is the variable: these four
 * ship together as a starting set, and losers get replaced rather than fixed.
 */
export type Variant = {
  id: string;
  /** Which hook formula this tests, so results can be read as a conclusion. */
  formula: string;
  hook: React.FC;
  hookVo: VoLine[];
};

export const VARIANTS: Variant[] = [
  {
    id: 'quiz',
    formula: 'Direct question, app on screen from frame zero',
    hook: QuizHook,
    hookVo: [
      { at: 2, text: 'Ninety percent of adults get this wrong.' },
      { at: 44, text: 'Can you?' },
    ],
  },
  {
    id: 'doomscroll',
    formula: 'Pattern interrupt, the viewer’s own screen time',
    hook: DoomscrollHook,
    hookVo: [
      { at: 2, text: "You've been on your phone three and a half hours today." },
      { at: 46, text: 'Five minutes could fix that.' },
    ],
  },
  {
    id: 'callout',
    formula: 'Direct address, names the audience',
    hook: CallOutHook,
    hookVo: [
      { at: 2, text: "You're an adult who never got taught how money works." },
      { at: 44, text: 'Five minutes a day.' },
    ],
  },
  {
    id: 'claim',
    formula: 'Bold claim, spoken as a user not a brand',
    hook: ClaimHook,
    hookVo: [
      { at: 2, text: 'I learned more in five minutes here than four years of school.' },
      { at: 44, text: 'Not even joking.' },
    ],
  },
];
