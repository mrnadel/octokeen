export type { FrameIconProps } from './utils';
export { AvatarPlaceholder } from './utils';
export * from './common';
export * from './epic';
export * from './legendary';
export * from './league';
export * from './streak';

import React from 'react';
import type { FrameIconProps } from './utils';
import {
  FrameGoldRing,
  FrameEmeraldHalo,
  FrameRubyBlaze,
  FrameSapphireWave,
  FrameBrushedSteel,
  FrameCopperPipe,
  FrameHexBolt,
  FrameBlueprintBorder,
  FrameTitaniumBand,
  FrameRivetRing,
  FrameCastIron,
  FrameCoilSpring,
  FrameGearTeeth,
  FrameGasketSeal,
  FrameBareWire,
  FrameConcreteRing,
  FrameDiamondAura,
  FrameSunsetGradient,
  FrameTorqueWrench,
  FramePistonRing,
  FrameCircuitBoard,
  FrameThermalGradient,
  FrameWeldBead,
} from './common';
import {
  FrameAuroraBorealis,
  FrameNeonPulse,
  FrameTurbineBlade,
  FramePlasmaArc,
  FrameStarDrive,
} from './epic';
import {
  FrameSingularity,
  FrameFusionReactor,
  FrameSupernova,
} from './legendary';
import {
  FrameBronzeLeague,
  FrameSilverLeague,
  FrameGoldLeague,
  FramePlatinumLeague,
  FrameMastersLeague,
} from './league';
import {
  FrameIronWill,
  FrameDiamondMind,
  FrameCenturion,
  FrameFirstGold,
  FrameMarathonRunner,
  FrameEarlyAdopter,
  FrameFlawless,
  FrameSpeedDemon,
  FramePerfectionist,
  FrameGoldenEngineer,
  FrameEngineersCrest,
  FrameMastersMark,
  FrameEliteBadge,
  FrameGrandmasterCrown,
} from './streak';

// ============================================================================
// MAPS: frame ID -> component
// ============================================================================

/** Map of shop frame IDs to their icon components */
export const frameIconMap: Record<string, React.FC<FrameIconProps>> = {
  'shop-frame-gold': FrameGoldRing,
  'shop-frame-emerald': FrameEmeraldHalo,
  'shop-frame-ruby': FrameRubyBlaze,
  'shop-frame-sapphire': FrameSapphireWave,
  'shop-frame-steel': FrameBrushedSteel,
  'shop-frame-copper': FrameCopperPipe,
  'shop-frame-bolt': FrameHexBolt,
  'shop-frame-blueprint': FrameBlueprintBorder,
  'shop-frame-titanium': FrameTitaniumBand,
  'shop-frame-rivet': FrameRivetRing,
  'shop-frame-cast-iron': FrameCastIron,
  'shop-frame-spring': FrameCoilSpring,
  'shop-frame-gear': FrameGearTeeth,
  'shop-frame-gasket': FrameGasketSeal,
  'shop-frame-wire': FrameBareWire,
  'shop-frame-concrete': FrameConcreteRing,
  'shop-frame-diamond': FrameDiamondAura,
  'shop-frame-sunset': FrameSunsetGradient,
  'shop-frame-wrench': FrameTorqueWrench,
  'shop-frame-piston': FramePistonRing,
  'shop-frame-circuit': FrameCircuitBoard,
  'shop-frame-thermal': FrameThermalGradient,
  'shop-frame-weld': FrameWeldBead,
  'shop-frame-aurora': FrameAuroraBorealis,
  'shop-frame-neon': FrameNeonPulse,
  'shop-frame-turbine': FrameTurbineBlade,
  'shop-frame-plasma': FramePlasmaArc,
  'shop-frame-star-drive': FrameStarDrive,
  'shop-frame-singularity': FrameSingularity,
  'shop-frame-fusion-reactor': FrameFusionReactor,
  'shop-frame-supernova': FrameSupernova,
};

/** Map of reward frame IDs to their icon components */
export const rewardFrameIconMap: Record<string, React.FC<FrameIconProps>> = {
  'reward-frame-league-bronze': FrameBronzeLeague,
  'reward-frame-league-silver': FrameSilverLeague,
  'reward-frame-league-gold': FrameGoldLeague,
  'reward-frame-league-platinum': FramePlatinumLeague,
  'reward-frame-league-masters': FrameMastersLeague,
  'reward-frame-streak-iron': FrameIronWill,
  'reward-frame-streak-diamond': FrameDiamondMind,
  'reward-frame-streak-centurion': FrameCenturion,
  'reward-frame-first-gold': FrameFirstGold,
  'reward-frame-marathon': FrameMarathonRunner,
  'reward-frame-early-bird': FrameEarlyAdopter,
  'reward-frame-perfect-unit': FrameFlawless,
  'reward-frame-speed-demon': FrameSpeedDemon,
  'reward-frame-perfectionist': FramePerfectionist,
  'reward-frame-all-gold': FrameGoldenEngineer,
  'reward-frame-level-15': FrameEngineersCrest,
  'reward-frame-level-20': FrameMastersMark,
  'reward-frame-level-25': FrameEliteBadge,
  'reward-frame-level-30': FrameGrandmasterCrown,
};
