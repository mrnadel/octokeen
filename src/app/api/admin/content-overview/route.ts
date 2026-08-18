import { db } from '@/lib/db';
import { contentFeedback, contentFeedbackDismissals } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { runContentQA, type CourseInput } from '@/lib/content-qa';
import { loadActiveCourses, type LoadedCourse } from '@/lib/api/course-content';
import { logger } from '@/lib/logger';

const USER_REPORT_LIMIT = 100;
const CHOICE_COUNT = 4;

// ─── Types ────────────────────────────────────────────────────

interface CourseStats {
  courseId: string;
  courseName: string;
  unitCount: number;
  lessonCount: number;
  questionCount: number;
  teachingCount: number;
  totalCards: number;
  typeCounts: Record<string, number>;
}

interface IndexBias {
  courseId: string;
  courseName: string;
  distribution: number[];
  total: number;
}

// ─── Helpers ──────────────────────────────────────────────────

/** Build per-course stats: lesson/question/teaching counts and type distribution. */
function buildCourseStats(courses: LoadedCourse[]): CourseStats[] {
  return courses.map(c => {
    const typeCounts: Record<string, number> = {};
    let lessonCount = 0;
    let questionCount = 0;
    let teachingCount = 0;
    let totalCards = 0;

    for (const unit of c.units) {
      for (const lesson of unit.lessons) {
        lessonCount++;
        for (const q of lesson.questions) {
          totalCards++;
          typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
          if (q.type === 'teaching') {
            teachingCount++;
          } else {
            questionCount++;
          }
        }
      }
    }

    return {
      courseId: c.id,
      courseName: c.name,
      unitCount: c.units.length,
      lessonCount,
      questionCount,
      teachingCount,
      totalCards,
      typeCounts,
    };
  });
}

/** Build correctIndex distribution (A/B/C/D bias) per course. */
function buildIndexBias(courses: LoadedCourse[]): IndexBias[] {
  return courses.map(c => {
    const counts = new Array<number>(CHOICE_COUNT).fill(0);
    let total = 0;

    for (const unit of c.units) {
      for (const lesson of unit.lessons) {
        for (const q of lesson.questions) {
          if (
            (q.type === 'multiple-choice' || q.type === 'scenario' || q.type === 'pick-the-best') &&
            q.correctIndex !== undefined &&
            q.correctIndex !== null
          ) {
            if (q.correctIndex >= 0 && q.correctIndex < CHOICE_COUNT) {
              counts[q.correctIndex]++;
              total++;
            }
          }
        }
      }
    }

    return {
      courseId: c.id,
      courseName: c.name,
      distribution: counts,
      total,
    };
  });
}

// ─── Route handler ────────────────────────────────────────────

export const GET = withAdminAuth(async () => {
  try {
    // 1. Load all course data with full questions
    const courses = await loadActiveCourses();

    // 2. Run static QA checks
    const qaInput: CourseInput[] = courses.map(c => ({
      id: c.id,
      name: c.name,
      units: c.units,
    }));
    const qaViolations = runContentQA(qaInput);

    // 3. Build course stats
    const courseStats = buildCourseStats(courses);

    // 4. Question accuracy from mastery_events (questions with >= 10 attempts)
    const questionQuality = await db.execute<{
      question_id: string;
      attempts: number;
      correct_count: number;
      accuracy_pct: number;
    }>(sql`
      SELECT
        question_id,
        COUNT(*)::int AS attempts,
        COUNT(*) FILTER (WHERE correct)::int AS correct_count,
        ROUND(COUNT(*) FILTER (WHERE correct)::numeric / NULLIF(COUNT(*), 0) * 100, 1)::float AS accuracy_pct
      FROM mastery_events
      GROUP BY question_id
      HAVING COUNT(*) >= 10
      ORDER BY accuracy_pct ASC
      LIMIT 200
    `);

    // 6. User reports — recent feedback, excluding dismissed
    const allFeedback = await db
      .select({
        contentId: contentFeedback.contentId,
        contentType: contentFeedback.contentType,
        reason: contentFeedback.reason,
        comment: contentFeedback.comment,
        createdAt: contentFeedback.createdAt,
      })
      .from(contentFeedback);

    const dismissals = await db
      .select({
        contentType: contentFeedbackDismissals.contentType,
        contentId: contentFeedbackDismissals.contentId,
        dismissedAt: contentFeedbackDismissals.dismissedAt,
      })
      .from(contentFeedbackDismissals);

    const dismissalSet = new Set(
      dismissals.map(d => `${d.contentType}:${d.contentId}`)
    );

    const userReports = allFeedback
      .filter(r => !dismissalSet.has(`${r.contentType}:${r.contentId}`))
      .sort((a, b) => {
        const da = a.createdAt ? a.createdAt.getTime() : 0;
        const db2 = b.createdAt ? b.createdAt.getTime() : 0;
        return db2 - da;
      })
      .slice(0, USER_REPORT_LIMIT);

    // 7. Index bias
    const indexBias = buildIndexBias(courses);

    return jsonOk({
      courseStats,
      qaViolations,
      questionQuality: [...questionQuality],
      userReports,
      indexBias,
    });
  } catch (error) {
    logger.error('[content-overview] Error:', error);
    return jsonError('Internal server error', 500);
  }
});
