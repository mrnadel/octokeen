// ============================================================
// Avatar Frame Style IDs — single source of truth
// ============================================================
//
// The renderer (src/components/ui/frames) must supply a FrameDef for every id
// listed here, and may not define a frame that is absent from this list. The
// union lives in the data layer, not next to the renderer, because the shop
// (gem-shop.ts), the daily reward calendar (daily-rewards.ts), the streak
// milestones (streak-milestones.ts) and the level rewards (level-rewards.ts)
// all reference these ids — and none of them should depend on React.
//
// `frameStyle` is the RENDERER key. It is a different namespace from the frame
// *item* id (`shop-frame-gold`, `reward-frame-calendar-collector`), which
// identifies a purchasable/grantable inventory entry and resolves via
// findFrameById().

export const FRAME_STYLE_IDS = [
  'all-gold',
  'aurora',
  'blueprint',
  'bolt',
  'calendar-collector',
  'cast-iron',
  'circuit',
  'concrete',
  'copper',
  'diamond',
  'early-bird',
  'emerald',
  'first-gold',
  'fusion-reactor',
  'gasket',
  'gear',
  'gold',
  'league-bronze',
  'league-gold',
  'league-masters',
  'league-platinum',
  'league-silver',
  'marathon',
  'neon',
  'perfect-unit',
  'perfectionist',
  'piston',
  'plasma',
  'rivet',
  'ruby',
  'sapphire',
  'singularity',
  'speed-demon',
  'spring',
  'star-drive',
  'steel',
  'streak-centurion',
  'streak-diamond',
  'streak-iron',
  'sunset',
  'supernova',
  'thermal',
  'titanium',
  'turbine',
  'weld',
  'wire',
  'wrench',
] as const;

export type FrameStyleId = (typeof FRAME_STYLE_IDS)[number];
