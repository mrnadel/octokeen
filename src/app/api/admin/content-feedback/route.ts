import { db } from '@/lib/db';
import { contentFeedback, contentFeedbackDismissals } from '@/lib/db/schema';
import { jsonOk } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { loadActiveCourseUnits } from '@/lib/api/course-content';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';
import type { Unit } from '@/data/course/types';

const MAX_QUESTION_TEXT_LENGTH = 80;

function getCourseQuestionText(units: Unit[], contentId: string): string | null {
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      const q = lesson.questions.find((q) => q.id === contentId);
      if (q) return q.question;
    }
  }
  return null;
}

function getQuestionText(units: Unit[], _contentType: string, contentId: string): string {
  const text = getCourseQuestionText(units, contentId);
  return text ? text.slice(0, MAX_QUESTION_TEXT_LENGTH) : `[Unknown: ${contentId}]`;
}

export const GET = withAdminAuth(async (req) => {
  const allUnits = await loadActiveCourseUnits();
  const includeDismissed = req.nextUrl.searchParams.get('includeDismissed') === 'true';

  // Fetch all flags
  const rows = await db
    .select({
      contentType: contentFeedback.contentType,
      contentId: contentFeedback.contentId,
      reason: contentFeedback.reason,
      comment: contentFeedback.comment,
      createdAt: contentFeedback.createdAt,
    })
    .from(contentFeedback);

  // Fetch all dismissals
  const dismissals = await db
    .select()
    .from(contentFeedbackDismissals);

  const dismissalMap = new Map(
    dismissals.map((d) => [`${d.contentType}:${d.contentId}`, d.dismissedAt])
  );

  // Aggregate by (contentType, contentId)
  const grouped = new Map<string, {
    contentType: string;
    contentId: string;
    totalFlags: number;
    reasons: Record<string, number>;
    comments: string[];
    latestFlagAt: Date | null;
  }>();

  for (const row of rows) {
    const key = `${row.contentType}:${row.contentId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        contentType: row.contentType,
        contentId: row.contentId,
        totalFlags: 0,
        reasons: { confusing: 0, incorrect: 0, 'too-easy': 0, 'too-hard': 0, 'bad-graphic': 0, other: 0 },
        comments: [],
        latestFlagAt: null,
      });
    }
    const g = grouped.get(key)!;
    g.totalFlags++;
    g.reasons[row.reason] = (g.reasons[row.reason] || 0) + 1;
    if (row.comment) g.comments.push(row.comment);
    if (!g.latestFlagAt || (row.createdAt && row.createdAt > g.latestFlagAt)) {
      g.latestFlagAt = row.createdAt;
    }
  }

  // Build result
  const items = [];
  for (const [key, g] of grouped) {
    const dismissedAt = dismissalMap.get(key) ?? null;

    // Filter dismissed if needed
    if (!includeDismissed && dismissedAt && g.latestFlagAt && dismissedAt >= g.latestFlagAt) {
      continue;
    }

    items.push({
      contentId: g.contentId,
      contentType: g.contentType as ContentFeedbackType,
      questionText: getQuestionText(allUnits, g.contentType, g.contentId),
      totalFlags: g.totalFlags,
      reasons: g.reasons as Record<FeedbackReason, number>,
      comments: g.comments,
      dismissedAt: dismissedAt?.toISOString() ?? null,
    });
  }

  // Sort by totalFlags descending
  items.sort((a, b) => b.totalFlags - a.totalFlags);

  return jsonOk({ items });
});
