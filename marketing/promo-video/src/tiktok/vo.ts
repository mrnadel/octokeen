/**
 * The voiceover script.
 *
 * Sound-on is the norm on this platform and the hook line is expected to be
 * spoken at second zero, so a silent cut is a compromise rather than a choice.
 * The video still reads correctly muted, because most of the feed watches
 * muted, but every variant should ship with its track.
 *
 * Generate each variant's lines as one continuous track, save it as
 * `public/vo-<variant id>.mp3`, and add the id to HAS_VOICEOVER.
 */

/** Variant ids whose `public/vo-<id>.mp3` exists. Empty means render silent. */
export const HAS_VOICEOVER: string[] = [];

export const voFile = (id: string) => `vo-${id}.mp3`;

export type VoLine = { at: number; text: string };

/** Spoken over the lesson, payoff and CTA. Shared by every variant. */
export const BODY_VO: VoLine[] = [
  { at: 84, text: 'Three basic things you can do with money. Pick one.' },
  { at: 170, text: 'Right. And that took five seconds.' },
  { at: 276, text: 'Streaks, XP, levels. The dopamine, but useful.' },
  { at: 372, text: 'Octokeen dot com. Free to start.' },
];
