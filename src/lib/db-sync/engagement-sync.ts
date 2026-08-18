/**
 * Engagement and hearts sync helpers.
 *
 * Handles hydration of `useEngagementStore` + `useHeartsStore` from the DB,
 * debounced write-back, and beforeunload beacon flush.
 */

import { useEngagementStore } from '@/store/useEngagementStore';
import { useHeartsStore } from '@/store/useHeartsStore';
import { makePostOpts, jsonPostHeaders, ENGAGEMENT_DEBOUNCE_MS } from './utils';
import { shallow } from 'zustand/shallow';

// ---------------------------------------------------------------------------
// Payload builder — shared between debounced sync and beforeunload flush
// ---------------------------------------------------------------------------

/**
 * Build the engagement API payload.
 * @param lastSyncedTxCount  Number of gem transactions already confirmed synced.
 * @param includeQuests      Whether to include quest state in the payload.
 * @returns `{ payload, nextSyncedCount }` — caller advances the ref only on success.
 */
export function buildEngagementPayload(
  lastSyncedTxCount: number,
  includeQuests: boolean,
): { payload: Record<string, unknown>; nextSyncedCount: number } {
  const eng = useEngagementStore.getState();
  const hearts = useHeartsStore.getState();

  // Extract only new gem transactions since last sync.
  const allTx = eng.gems.transactions;
  const newTxCount = allTx.length - lastSyncedTxCount;
  const newGemTransactions = newTxCount > 0
    ? allTx.slice(0, newTxCount).map((t) => ({ amount: t.amount, source: t.source }))
    : undefined;
  const nextSyncedCount = allTx.length;

  const payload: Record<string, unknown> = {
    gems: {
      balance: eng.gems.balance,
      totalEarned: eng.gems.totalEarned,
      inventory: eng.gems.inventory,
      selectedTitle: eng.gems.selectedTitle,
      selectedFrame: eng.gems.selectedFrame,
    },
    streak: {
      freezesOwned: eng.streak.freezesOwned,
      milestonesReached: eng.streak.milestonesReached,
    },
    hearts: {
      current: hearts.current,
      lastRechargeAt: hearts.lastRechargeAt,
    },
    doubleXpExpiry: eng.doubleXpExpiry,
    newGemTransactions,
    // Daily reward calendar sync
    dailyRewardCalendar: {
      day: eng.dailyRewardCalendar.currentDay,
      lastClaimDate: eng.dailyRewardCalendar.lastClaimDate,
      weekStartDate: eng.dailyRewardCalendar.cycleStartDate ?? '',
      claimedDays: eng.dailyRewardCalendar.todayClaimed
        ? Array.from({ length: eng.dailyRewardCalendar.currentDay }, (_, i) => i + 1)
        : Array.from({ length: eng.dailyRewardCalendar.currentDay - 1 }, (_, i) => i + 1),
    },
  };

  if (includeQuests) {
    payload.quests = {
      dailyQuests: eng.dailyQuests,
      weeklyQuests: eng.weeklyQuests,
      dailyQuestDate: eng.dailyQuestDate,
      weeklyQuestDate: eng.weeklyQuestDate,
      dailyChestClaimed: eng.dailyChestClaimed,
      weeklyChestClaimed: eng.weeklyChestClaimed,
    };
  }

  return { payload, nextSyncedCount };
}

// ---------------------------------------------------------------------------
// Hydration
// ---------------------------------------------------------------------------

/**
 * Hydrate `useEngagementStore` and `useHeartsStore` from the DB response.
 * Returns the current gem transaction count so the caller can initialise its
 * synced-count ref (preventing re-syncing already-persisted transactions).
 */
export function hydrateEngagementStore(eng: {
  gems: {
    balance?: number;
    totalEarned?: number;
    inventory?: { activeTitles?: string[]; activeFrames?: string[] };
    selectedTitle?: string | null;
    selectedFrame?: string | null;
  };
  streak: {
    freezesOwned?: number;
    milestonesReached?: number[];
  };
  doubleXpExpiry?: string | null;
  hearts?: {
    current?: number;
    lastRechargeAt?: number;
  };
  quests?: {
    daily?: {
      questDate?: string;
      quests?: unknown[];
      chestClaimed?: boolean;
    };
    weekly?: {
      questDate?: string;
      quests?: unknown[];
      chestClaimed?: boolean;
    };
  };
  dailyRewardCalendar?: {
    currentDay: number;
    lastClaimDate: string | null;
    todayClaimed: boolean;
    cycleStartDate: string | null;
    cyclesCompleted: number;
  };
}): number {
  const localEng = useEngagementStore.getState();

  // DB wins for economy fields (balance is computed from ledger server-side)
  useEngagementStore.setState((s) => ({
    gems: {
      ...s.gems,
      balance: eng.gems.balance ?? s.gems.balance,
      totalEarned: eng.gems.totalEarned ?? s.gems.totalEarned,
      inventory: {
        activeTitles: [...new Set([
          ...(eng.gems.inventory?.activeTitles ?? []),
          ...s.gems.inventory.activeTitles,
        ])],
        activeFrames: [...new Set([
          ...(eng.gems.inventory?.activeFrames ?? []),
          ...s.gems.inventory.activeFrames,
        ])],
      },
      selectedTitle: eng.gems.selectedTitle ?? s.gems.selectedTitle,
      selectedFrame: eng.gems.selectedFrame ?? s.gems.selectedFrame,
    },
    streak: {
      ...s.streak,
      freezesOwned: eng.streak.freezesOwned ?? s.streak.freezesOwned,
      milestonesReached: [...new Set([
        ...(eng.streak.milestonesReached ?? []),
        ...s.streak.milestonesReached,
      ])],
    },
    doubleXpExpiry: eng.doubleXpExpiry ?? s.doubleXpExpiry,
  }));

  // Hydrate hearts — server value is authoritative (clamped + recharge-validated)
  if (eng.hearts) {
    useHeartsStore.setState({
      current: eng.hearts.current ?? 5,
      lastRechargeAt: eng.hearts.lastRechargeAt ?? Date.now(),
    });
  }

  // Hydrate quests from DB if they match the current date
  // (local quests for today/this week take priority since they may have newer progress)
  if (eng.quests) {
    const localDaily = localEng.dailyQuestDate;
    const localWeekly = localEng.weeklyQuestDate;

    if (eng.quests.daily && eng.quests.daily.questDate === localDaily) {
      const dbQuests = eng.quests.daily.quests as typeof localEng.dailyQuests;
      if (Array.isArray(dbQuests) && dbQuests.length > 0) {
        useEngagementStore.setState((s) => {
          if (s.dailyQuests.length === 0) {
            return {
              dailyQuests: dbQuests,
              dailyChestClaimed: eng.quests!.daily!.chestClaimed ?? false,
            };
          }
          const merged = s.dailyQuests.map((lq) => {
            const dbq = dbQuests.find((dq: { definitionId?: string }) => dq.definitionId === lq.definitionId);
            if (!dbq) return lq;
            return {
              ...lq,
              progress: Math.max(lq.progress, dbq.progress ?? 0),
              completed: lq.completed || dbq.completed,
              claimed: lq.claimed || dbq.claimed,
            };
          });
          return {
            dailyQuests: merged,
            dailyChestClaimed: s.dailyChestClaimed || eng.quests!.daily!.chestClaimed,
          };
        });
      }
    }

    if (eng.quests.weekly && eng.quests.weekly.questDate === localWeekly) {
      const dbQuests = eng.quests.weekly.quests as typeof localEng.weeklyQuests;
      if (Array.isArray(dbQuests) && dbQuests.length > 0) {
        useEngagementStore.setState((s) => {
          if (s.weeklyQuests.length === 0) {
            return {
              weeklyQuests: dbQuests,
              weeklyChestClaimed: eng.quests!.weekly!.chestClaimed ?? false,
            };
          }
          const merged = s.weeklyQuests.map((lq) => {
            const dbq = dbQuests.find((dq: { definitionId?: string }) => dq.definitionId === lq.definitionId);
            if (!dbq) return lq;
            return {
              ...lq,
              progress: Math.max(lq.progress, dbq.progress ?? 0),
              completed: lq.completed || dbq.completed,
              claimed: lq.claimed || dbq.claimed,
            };
          });
          return {
            weeklyQuests: merged,
            weeklyChestClaimed: s.weeklyChestClaimed || eng.quests!.weekly!.chestClaimed,
          };
        });
      }
    }
  }

  // Hydrate daily reward calendar from DB
  if (eng.dailyRewardCalendar) {
    const localCal = localEng.dailyRewardCalendar;
    // Use the fresher state (more recent claim date wins)
    const useDb = (eng.dailyRewardCalendar.lastClaimDate ?? '') > (localCal.lastClaimDate ?? '');
    if (useDb) {
      useEngagementStore.setState({ dailyRewardCalendar: eng.dailyRewardCalendar });
    }
  }

  // Return current tx count so the hook can seed its synced-count ref
  return useEngagementStore.getState().gems.transactions.length;
}

// ---------------------------------------------------------------------------
// Debounced subscription sync
// ---------------------------------------------------------------------------

/**
 * Subscribe to `useEngagementStore` and `useHeartsStore` changes and
 * debounce-sync to `/api/engagement`.
 *
 * @param getLastSyncedCount  Getter for the current synced-tx-count ref value.
 * @param setLastSyncedCount  Setter to advance the synced-tx-count ref on success.
 * @returns `{ unsubEngagement, unsubHearts, cleanup }`
 */
export function subscribeEngagementSync(
  getLastSyncedCount: () => number,
  setLastSyncedCount: (n: number) => void,
): { unsubEngagement: () => void; unsubHearts: () => void; cleanup: () => void } {
  let engagementTimer: ReturnType<typeof setTimeout>;

  function syncEngagement(includeQuests: boolean) {
    clearTimeout(engagementTimer);
    engagementTimer = setTimeout(() => {
      const { payload, nextSyncedCount } = buildEngagementPayload(getLastSyncedCount(), includeQuests);

      // Advance the synced counter only after the fetch succeeds, so a network
      // failure does not silently discard gem transactions.
      fetch('/api/engagement', makePostOpts(payload))
        .then((res) => {
          if (res.ok) setLastSyncedCount(nextSyncedCount);
        })
        .catch(console.error);
    }, ENGAGEMENT_DEBOUNCE_MS);
  }

  const unsubEngagement = useEngagementStore.subscribe(
    (state) => ({
      gems: state.gems,
      streak: state.streak,
      doubleXpExpiry: state.doubleXpExpiry,
      dailyQuests: state.dailyQuests,
      weeklyQuests: state.weeklyQuests,
      dailyQuestDate: state.dailyQuestDate,
      weeklyQuestDate: state.weeklyQuestDate,
      dailyChestClaimed: state.dailyChestClaimed,
      weeklyChestClaimed: state.weeklyChestClaimed,
      dailyRewardCalendar: state.dailyRewardCalendar,
    }),
    () => syncEngagement(true),
    { equalityFn: shallow },
  );

  // Also sync when hearts change independently (e.g. heart loss during lesson)
  let prevHearts = {
    current: useHeartsStore.getState().current,
    lastRechargeAt: useHeartsStore.getState().lastRechargeAt,
  };
  const unsubHearts = useHeartsStore.subscribe((state) => {
    const next = { current: state.current, lastRechargeAt: state.lastRechargeAt };
    if (next.current !== prevHearts.current || next.lastRechargeAt !== prevHearts.lastRechargeAt) {
      prevHearts = next;
      syncEngagement(false);
    }
  });

  return {
    unsubEngagement,
    unsubHearts,
    cleanup: () => clearTimeout(engagementTimer),
  };
}

// ---------------------------------------------------------------------------
// beforeunload beacon flush
// ---------------------------------------------------------------------------

/**
 * Flush pending engagement data via `sendBeacon` (or keepalive fetch fallback)
 * when the user navigates away before the debounce fires.
 * Returns the event handler so the caller can add/remove it.
 */
export function makeBeforeUnloadHandler(getLastSyncedCount: () => number): () => void {
  return function handleBeforeUnload() {
    const { payload } = buildEngagementPayload(getLastSyncedCount(), false);
    const body = JSON.stringify(payload);
    const url = '/api/engagement';

    // sendBeacon is the only reliable way to dispatch a request on unload.
    // It does not support custom headers, so the server must not require
    // Content-Type validation — the standard JSON body is still sent.
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon(url, blob)) {
      // Fallback: best-effort keepalive fetch (may not complete on all browsers)
      fetch(url, {
        method: 'POST',
        headers: jsonPostHeaders(),
        body,
        keepalive: true,
      }).catch(() => {});
    }
  };
}
