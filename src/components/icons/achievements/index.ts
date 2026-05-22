export * from './shared';
export * from './knowledge';
export * from './consistency';
export * from './challenge';
export * from './exploration';
export * from './mastery';
export * from './hidden';

// ════════════════════════════════════════════════════════════════════════════
// Achievement Icon Map
// ════════════════════════════════════════════════════════════════════════════

import React from 'react';
import { IconProps } from './shared';
import {
  FirstPrinciplesIcon,
  BuildingMomentumIcon,
  SolidFoundationIcon,
  CenturionIcon,
  FlawlessExecutionIcon,
  NoEasyModeIcon,
  BackOfEnvelopeIcon,
} from './knowledge';
import {
  GettingWarmedUpIcon,
  SevenDayStreakIcon,
  FortnightOfFocusIcon,
  IronWillIcon,
  ChallengerIcon,
  WeekendWarriorIcon,
} from './consistency';
import {
  QuickDrawIcon,
  ConfidenceCalibratedIcon,
  EagleEyeIcon,
  ScenarioCommanderIcon,
  GauntletRunnerIcon,
} from './challenge';
import {
  FirstStepsIcon,
  RenaissanceEngineerIcon,
  PolymathIcon,
  FormatMasterIcon,
  BookmarkedIcon,
} from './exploration';
import {
  TopicMasterIcon,
  MultiDomainExpertIcon,
  WeaknessConqueredIcon,
  InterviewReadyIcon,
} from './mastery';
import {
  NightOwlIcon,
  EarlyBirdIcon,
  LearningFromFailureIcon,
} from './hidden';

export const achievementIconMap: Record<
  string,
  ({ size, className }: IconProps) => React.ReactElement
> = {
  // Knowledge
  'ach-first-correct': FirstPrinciplesIcon,
  'ach-ten-correct': BuildingMomentumIcon,
  'ach-fifty-correct': SolidFoundationIcon,
  'ach-hundred-correct': CenturionIcon,
  'ach-perfect-session': FlawlessExecutionIcon,
  'ach-all-advanced': NoEasyModeIcon,
  'ach-estimation-ace': BackOfEnvelopeIcon,
  // Consistency
  'ach-streak-3': GettingWarmedUpIcon,
  'ach-streak-7': SevenDayStreakIcon,
  'ach-streak-14': FortnightOfFocusIcon,
  'ach-streak-30': IronWillIcon,
  'ach-daily-challenge-5': ChallengerIcon,
  'ach-weekend-warrior': WeekendWarriorIcon,
  // Challenge
  'ach-speed-round': QuickDrawIcon,
  'ach-confidence-calibrated': ConfidenceCalibratedIcon,
  'ach-flaw-finder': EagleEyeIcon,
  'ach-scenario-master': ScenarioCommanderIcon,
  'ach-hard-streak': GauntletRunnerIcon,
  // Exploration
  'ach-first-topic': FirstStepsIcon,
  'ach-five-topics': RenaissanceEngineerIcon,
  'ach-all-topics': PolymathIcon,
  'ach-all-types': FormatMasterIcon,
  'ach-bookworm': BookmarkedIcon,
  // Mastery
  'ach-topic-master': TopicMasterIcon,
  'ach-multi-master': MultiDomainExpertIcon,
  'ach-weakness-conquered': WeaknessConqueredIcon,
  'ach-interview-ready': InterviewReadyIcon,
  // Hidden
  'ach-night-owl': NightOwlIcon,
  'ach-early-bird': EarlyBirdIcon,
  'ach-wrong-five': LearningFromFailureIcon,
};
