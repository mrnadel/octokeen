import { db } from '@/lib/db';
import { friendQuests } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { friendQuestClaimSchema } from '@/lib/validation';
import { pickFriendQuest } from '@/lib/friend-quests';
import { insertActivity } from '@/lib/activity-feed';
import { parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

/**
 * POST /api/friends/quests/claim
 * Claim the reward for a completed friend quest.
 * Each user in the pair claims independently.
 */
export const POST = withAuth(async (req, { userId }) => {
  const { data, error } = await parseBody(req, friendQuestClaimSchema);
  if (error) return error;

  const { questId } = data;

  // Get the quest: must belong to this user and be completed
  const [quest] = await db
    .select()
    .from(friendQuests)
    .where(
      and(
        eq(friendQuests.id, questId),
        eq(friendQuests.completed, true),
        or(eq(friendQuests.userId, userId), eq(friendQuests.partnerId, userId)),
      ),
    )
    .limit(1);

  if (!quest) {
    return jsonError('Quest not found or not completed', 404);
  }

  // Determine which user is claiming
  const isUserA = quest.userId === userId;
  const alreadyClaimed = isUserA ? quest.rewardClaimedUser : quest.rewardClaimedPartner;

  if (alreadyClaimed) {
    return jsonError('Reward already claimed', 409);
  }

  // Get reward amounts from quest definition
  const def = pickFriendQuest(quest.userId, quest.partnerId, quest.questWeek);

  // Mark this user's reward as claimed
  await db
    .update(friendQuests)
    .set(
      isUserA
        ? { rewardClaimedUser: true }
        : { rewardClaimedPartner: true },
    )
    .where(eq(friendQuests.id, questId));

  // NOTE: Do NOT insert gem_transactions here — the client's addGems() creates
  // a local transaction that is synced via POST /api/engagement (newGemTransactions).
  // Inserting here would double-credit the user.

  // Create activity feed entry for quest reward claim
  const partnerId = isUserA ? quest.partnerId : quest.userId;
  await insertActivity(userId, 'friend_quest_complete', {
    questType: quest.questType,
    questTitle: def.title,
    partnerId,
  });

  return jsonOk({
    ok: true,
    rewardGems: def.rewardGems,
  });
});
