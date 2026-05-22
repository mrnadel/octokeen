/**
 * Barrel export for avatar frame definitions.
 *
 * Combines all category FRAME_DEFS into a single lookup record and
 * re-exports the FrameDef type so consumers only need to import from here.
 */

export type { FrameDef } from './utils';

import { commonFrameDefs } from './common';
import { leagueFrameDefs } from './league';
import { streakFrameDefs } from './streak';
import { rareFrameDefs } from './rare';
import { epicFrameDefs } from './epic';
import { legendaryFrameDefs } from './legendary';
import { rewardFrameDefs } from './reward';

export const FRAME_DEFS = {
  ...commonFrameDefs,
  ...leagueFrameDefs,
  ...streakFrameDefs,
  ...rareFrameDefs,
  ...epicFrameDefs,
  ...legendaryFrameDefs,
  ...rewardFrameDefs,
};
