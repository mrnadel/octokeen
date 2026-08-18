/**
 * Date-key formatting — leaf module, zero imports.
 *
 * A "date key" is a `YYYY-MM-DD` string used as the identity of a calendar day
 * across streaks, quests, league weeks and daily rewards.
 *
 * This module has no dependencies so every date helper can point at it without
 * creating an import cycle: `lib/utils` re-exports `getTodayDate` from
 * `lib/quest-engine`, so `quest-engine` can never import back from `lib/utils`.
 */

/**
 * Format a Date as `YYYY-MM-DD` from its *local* calendar fields.
 *
 * Local, not UTC — a user practising at 11pm local time must not be handed
 * tomorrow's key and have their streak broken.
 */
export function toLocalDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
