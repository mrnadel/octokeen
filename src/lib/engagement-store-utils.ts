import type {
  EngagementState,
  GemsState,
  GemTransaction,
  LeagueState,
  StreakEnhancements,
  ComebackState,
  DailyRewardCalendarState,
  NudgeState,
  Quest,
  QuestTrackingKey,
} from '@/data/engagement-types';
import {
  MAX_STREAK_FREEZES,
} from '@/data/engagement-types';
import {
  REWARD_CYCLE_LENGTH,
} from '@/data/daily-rewards';
import {
  getCurrentWeekMonday,
  DAILY_QUEST_COUNT,
  WEEKLY_QUEST_COUNT,
} from '@/lib/quest-engine';
import { drawCompetitorsFromPool } from '@/lib/fake-user-generator';

// --------------- Default State Factories ---------------

export function getDefaultGems(): GemsState {
  return {
    balance: 0,
    totalEarned: 0,
    transactions: [],
    inventory: {
      activeTitles: [],
      activeFrames: [],
    },
    selectedTitle: null,
    selectedFrame: null,
  };
}

export function getDefaultLeague(): LeagueState {
  const monday = getCurrentWeekMonday();
  return {
    currentTier: 1,
    weeklyXp: 0,
    weekStartDate: monday,
    competitors: drawCompetitorsFromPool(monday, 1),
    lastWeekResult: null,
    resultSeen: true,
  };
}

export function getDefaultStreak(): StreakEnhancements {
  return {
    freezesOwned: 0,
    freezeUsedToday: false,
    lastStreakBreakDate: null,
    lastStreakValueBeforeBreak: 0,
    repairAvailable: false,
    milestonesReached: [],
  };
}

export function getDefaultComeback(): ComebackState {
  return {
    isInComebackFlow: false,
    comebackQuestsCompleted: 0,
    daysAway: 0,
    lastDismissedDate: null,
  };
}

export function getDefaultNudge(): NudgeState {
  return {
    lastDay1NudgeDate: null,
    lastDay2NudgeDate: null,
    daysAway: 0,
  };
}

export function getDefaultDailyRewardCalendar(): DailyRewardCalendarState {
  return {
    currentDay: 1,
    lastClaimDate: null,
    todayClaimed: false,
    cycleStartDate: null,
    cyclesCompleted: 0,
  };
}

export function getDefaultState(): EngagementState {
  return {
    gems: getDefaultGems(),
    dailyQuests: [],
    weeklyQuests: [],
    dailyQuestDate: null,
    weeklyQuestDate: null,
    dailyChestClaimed: false,
    weeklyChestClaimed: false,
    lastDailyQuestIds: [],
    lastWeeklyQuestIds: [],
    league: getDefaultLeague(),
    streak: getDefaultStreak(),
    comeback: getDefaultComeback(),
    nudge: getDefaultNudge(),
    dailyRewardCalendar: getDefaultDailyRewardCalendar(),
    dismissedNudges: [],
    doubleXpExpiry: null,
    mistakeQuestionIds: [],
    lastDailyChallengeDate: null,
    _hasHydrated: false,
  };
}

// --------------- Inventory Helpers ---------------

/** Grant a title or frame to the inventory if not already owned. Returns updated GemsState. */
export function grantInventoryItem(
  gems: GemsState,
  type: 'title' | 'frame',
  itemId: string,
): GemsState {
  const key = type === 'title' ? 'activeTitles' : 'activeFrames';
  if (gems.inventory[key].includes(itemId)) return gems;
  return {
    ...gems,
    inventory: {
      ...gems.inventory,
      [key]: [...gems.inventory[key], itemId],
    },
  };
}

// --------------- Helper: create a gem transaction ---------------

export function createGemTransaction(amount: number, source: string): GemTransaction {
  return {
    id: `gem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    amount,
    source,
    timestamp: new Date().toISOString(),
  };
}

// --------------- Helper: update quests in an array ---------------

export function progressQuests(
  quests: Quest[],
  key: QuestTrackingKey,
  value: number,
  filter?: Record<string, unknown>,
): Quest[] {
  // Special mode: { _absolute: true } sets progress to `value` instead of adding
  const isAbsolute = filter && '_absolute' in filter;
  const cleanFilter = (() => {
    if (!filter) return undefined;
    const { _absolute, ...rest } = filter as Record<string, unknown>;
    return Object.keys(rest).length > 0 ? rest : undefined;
  })();

  return quests.map((quest) => {
    if (quest.trackingKey !== key) return quest;
    if (quest.completed) return quest;

    // Filter matching:
    // - If the caller provides a filter AND the quest has a filter, the caller's
    //   filter keys must match the quest's filter values (strict match).
    // - If the caller provides a filter but the quest has none, the quest still
    //   progresses (the filter is extra context, not a restriction).
    // - If the caller does NOT provide a filter but the quest has one, the quest
    //   still progresses (backwards-compat for soft filters like currentUnit).
    if (cleanFilter && quest.filter) {
      const filterMatches = Object.keys(cleanFilter).every(
        (k) => quest.filter && quest.filter[k] === cleanFilter[k],
      );
      if (!filterMatches) return quest;
    }

    const newProgress = isAbsolute
      ? Math.min(value, quest.target)
      : Math.min(quest.progress + value, quest.target);
    const completed = newProgress >= quest.target;
    return { ...quest, progress: newProgress, completed };
  });
}
