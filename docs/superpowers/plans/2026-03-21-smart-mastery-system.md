# Smart Mastery System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a unified mastery system that logs every answer event (from both practice and course modes) and computes topic mastery using a recency-weighted, difficulty-adjusted algorithm.

**Architecture:** A new `useMasteryStore` Zustand store collects answer events from both existing stores. A pure `computeMastery()` function computes scores on read. Course units get a `topicId` field to map lessons to topics. The profile page uses computed mastery instead of raw accuracy.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand 5 (persist middleware), Drizzle ORM (PostgreSQL), Tailwind CSS 4, Framer Motion 12

**Spec:** `docs/superpowers/specs/2026-03-21-smart-mastery-system-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/data/mastery.ts` | `AnswerEvent` type, `computeMastery()`, `computeAllMastery()`, `getMasteryLevel()` pure functions |
| `src/store/useMasteryStore.ts` | Zustand store: `events[]`, `lastSyncedIndex`, `addEvent()`, `clearEvents()` |
| `src/app/api/mastery/route.ts` | GET/POST API for syncing mastery events to/from DB |

### Modified Files
| File | Change |
|------|--------|
| `src/data/course/types.ts` | Add `topicId?: TopicId` to `Unit` interface |
| `src/data/course/units/unit-1-statics.ts` | Add `topicId: 'engineering-mechanics'` |
| `src/data/course/units/unit-2-dynamics.ts` | Add `topicId: 'engineering-mechanics'` |
| `src/data/course/units/unit-3-strength.ts` | Add `topicId: 'strength-of-materials'` |
| `src/data/course/units/unit-4-thermo.ts` | Add `topicId: 'thermodynamics'` |
| `src/data/course/units/unit-5-heat.ts` | Add `topicId: 'heat-transfer'` |
| `src/data/course/units/unit-6-fluids.ts` | Add `topicId: 'fluid-mechanics'` |
| `src/data/course/units/unit-7-materials.ts` | Add `topicId: 'materials-engineering'` |
| `src/data/course/units/unit-8-machine.ts` | Add `topicId: 'machine-elements'` |
| `src/data/course/units/unit-9-gdt.ts` | Add `topicId: 'design-tolerancing'` |
| `src/components/session/SessionView.tsx` | Log mastery event after `answerQuestion()` |
| `src/components/lesson/LessonView.tsx` | Log mastery event after `submitAnswer()` |
| `src/lib/db/schema.ts` | Add `masteryEvents` table |
| `src/app/api/user/reset-progress/route.ts` | Also delete `masteryEvents` on reset |
| `src/app/(app)/profile/page.tsx` | Replace basic mastery with computed mastery |

---

## Task 1: Mastery Types & Pure Computation Function

**Files:**
- Create: `src/data/mastery.ts`

- [ ] **Step 1: Create mastery types and computation function**

```typescript
// src/data/mastery.ts
import type { TopicId, Difficulty } from './types';

export interface AnswerEvent {
  id: string;
  questionId: string;
  topicId: TopicId;
  subtopic?: string;
  difficulty: Difficulty;
  correct: boolean;
  source: 'practice' | 'course';
  answeredAt: string; // ISO timestamp
}

export interface MasteryScore {
  topicId: TopicId;
  score: number;       // 0–100
  level: MasteryLevel;
  eventCount: number;
  lastPracticed: string | null; // ISO date or null
}

export type MasteryLevel = 'strong' | 'developing' | 'needs-work' | 'not-started';

const HALF_LIFE_DAYS = 14;
const CONFIDENCE_THRESHOLD = 8;
const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = {
  beginner: 0.6,
  intermediate: 1.0,
  advanced: 1.5,
};

export function computeMastery(events: AnswerEvent[]): number {
  if (events.length === 0) return 0;

  const now = Date.now();
  let totalWeight = 0;
  let correctWeight = 0;

  for (const event of events) {
    const daysSince =
      (now - new Date(event.answeredAt).getTime()) / (1000 * 60 * 60 * 24);
    const recency = Math.pow(0.5, daysSince / HALF_LIFE_DAYS);
    const diffWeight = DIFFICULTY_WEIGHTS[event.difficulty];
    const weight = recency * diffWeight;

    totalWeight += weight;
    if (event.correct) correctWeight += weight;
  }

  const rawAccuracy = correctWeight / totalWeight;
  const confidence = Math.min(totalWeight / CONFIDENCE_THRESHOLD, 1.0);
  return Math.round(rawAccuracy * confidence * 100);
}

export function getMasteryLevel(score: number, eventCount: number): MasteryLevel {
  if (eventCount === 0) return 'not-started';
  if (score >= 75) return 'strong';
  if (score >= 40) return 'developing';
  return 'needs-work';
}

export function computeAllMastery(
  events: AnswerEvent[],
  topicIds: TopicId[]
): MasteryScore[] {
  return topicIds.map((topicId) => {
    const topicEvents = events.filter((e) => e.topicId === topicId);
    const score = computeMastery(topicEvents);
    const lastEvent = [...topicEvents]
      .sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())[0];

    return {
      topicId,
      score,
      level: getMasteryLevel(score, topicEvents.length),
      eventCount: topicEvents.length,
      lastPracticed: lastEvent?.answeredAt?.split('T')[0] ?? null,
    };
  });
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `src/data/mastery.ts`

- [ ] **Step 3: Commit**

```bash
git add src/data/mastery.ts
git commit -m "feat: add mastery types and computation function"
```

---

## Task 2: Mastery Zustand Store

**Files:**
- Create: `src/store/useMasteryStore.ts`

- [ ] **Step 1: Create the mastery store**

```typescript
// src/store/useMasteryStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnswerEvent } from '@/data/mastery';
import type { TopicId, Difficulty } from '@/data/types';

const PRUNE_DAYS = 90;

interface MasteryState {
  events: AnswerEvent[];
  lastSyncedIndex: number;

  addEvent: (event: Omit<AnswerEvent, 'id' | 'answeredAt'>) => void;
  clearEvents: () => void;
  getTopicEvents: (topicId: TopicId) => AnswerEvent[];
}

export const useMasteryStore = create<MasteryState>()(
  persist(
    (set, get) => ({
      events: [],
      lastSyncedIndex: 0,

      addEvent: (partial) => {
        const event: AnswerEvent = {
          ...partial,
          id: crypto.randomUUID(),
          answeredAt: new Date().toISOString(),
        };

        set((state) => {
          // Prune events older than PRUNE_DAYS from local storage
          const cutoff = Date.now() - PRUNE_DAYS * 24 * 60 * 60 * 1000;
          const pruned = state.events.filter(
            (e) => new Date(e.answeredAt).getTime() > cutoff
          );

          return {
            events: [...pruned, event],
            // Adjust lastSyncedIndex if pruning removed synced events
            lastSyncedIndex: Math.min(state.lastSyncedIndex, pruned.length),
          };
        });
      },

      clearEvents: () => set({ events: [], lastSyncedIndex: 0 }),

      getTopicEvents: (topicId) =>
        get().events.filter((e) => e.topicId === topicId),
    }),
    {
      name: 'mastery-events',
    }
  )
);
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `src/store/useMasteryStore.ts`

- [ ] **Step 3: Commit**

```bash
git add src/store/useMasteryStore.ts
git commit -m "feat: add mastery event store with local pruning"
```

---

## Task 3: Course Unit Topic Mapping

**Files:**
- Modify: `src/data/course/types.ts` (line 25-32, Unit interface)
- Modify: `src/data/course/units/unit-1-statics.ts` through `unit-9-gdt.ts` (9 files)

- [ ] **Step 1: Add topicId to Unit type**

In `src/data/course/types.ts`, add import and field to Unit interface:

```typescript
// Add at top of file (line 1):
import type { TopicId } from '../types';

// Update Unit interface (line 25-32) to:
export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topicId?: TopicId;
  lessons: Lesson[];
}
```

- [ ] **Step 2: Add topicId to each unit file**

For each unit file, add `topicId` after the `icon` field:

| File | Add after `icon: '...',` |
|------|--------------------------|
| `src/data/course/units/unit-1-statics.ts` | `topicId: 'engineering-mechanics',` |
| `src/data/course/units/unit-2-dynamics.ts` | `topicId: 'engineering-mechanics',` |
| `src/data/course/units/unit-3-strength.ts` | `topicId: 'strength-of-materials',` |
| `src/data/course/units/unit-4-thermo.ts` | `topicId: 'thermodynamics',` |
| `src/data/course/units/unit-5-heat.ts` | `topicId: 'heat-transfer',` |
| `src/data/course/units/unit-6-fluids.ts` | `topicId: 'fluid-mechanics',` |
| `src/data/course/units/unit-7-materials.ts` | `topicId: 'materials-engineering',` |
| `src/data/course/units/unit-8-machine.ts` | `topicId: 'machine-elements',` |
| `src/data/course/units/unit-9-gdt.ts` | `topicId: 'design-tolerancing',` |

Do NOT modify `unit-10-interview.ts` — it has no single topic mapping.

Example for unit-1-statics.ts — change:
```typescript
export const unit1: Unit = {
  id: 'u1-statics',
  title: 'Statics & Equilibrium',
  description: 'Forces, moments, trusses, friction, and centroids — the foundation of mechanical analysis.',
  color: '#10B981',
  icon: '⚖️',
  lessons: [
```
to:
```typescript
export const unit1: Unit = {
  id: 'u1-statics',
  title: 'Statics & Equilibrium',
  description: 'Forces, moments, trusses, friction, and centroids — the foundation of mechanical analysis.',
  color: '#10B981',
  icon: '⚖️',
  topicId: 'engineering-mechanics',
  lessons: [
```

Apply the same pattern to all 9 files.

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/data/course/types.ts src/data/course/units/
git commit -m "feat: add topicId mapping to course units"
```

---

## Task 4: Integrate Mastery Logging into SessionView (Practice)

**Files:**
- Modify: `src/components/session/SessionView.tsx` (lines 3, 55)

- [ ] **Step 1: Add mastery store import**

In `src/components/session/SessionView.tsx`, add after existing imports (after line 8):

```typescript
import { useMasteryStore } from '@/store/useMasteryStore';
```

- [ ] **Step 2: Add mastery store hook and update handleAnswer**

Inside the `SessionView` component, after the existing destructuring (after line 13):

```typescript
  const addMasteryEvent = useMasteryStore((s) => s.addEvent);
```

Replace the `handleAnswer` function (line 55-57):

```typescript
  // BEFORE:
  const handleAnswer = (correct: boolean, confidence?: number, timeSpent?: number) => {
    answerQuestion(currentQuestion.id, correct, confidence, timeSpent);
  };

  // AFTER:
  const handleAnswer = (correct: boolean, confidence?: number, timeSpent?: number) => {
    answerQuestion(currentQuestion.id, correct, confidence, timeSpent);
    addMasteryEvent({
      questionId: currentQuestion.id,
      topicId: currentQuestion.topic,
      subtopic: currentQuestion.subtopic,
      difficulty: currentQuestion.difficulty,
      correct,
      source: 'practice',
    });
  };
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/session/SessionView.tsx
git commit -m "feat: log mastery events from practice sessions"
```

---

## Task 5: Integrate Mastery Logging into LessonView (Course)

**Files:**
- Modify: `src/components/lesson/LessonView.tsx` (lines 6, 93-99)

- [ ] **Step 1: Add mastery store import**

In `src/components/lesson/LessonView.tsx`, add after existing imports (after line 13):

```typescript
import { useMasteryStore } from '@/store/useMasteryStore';
```

- [ ] **Step 2: Add mastery store hook**

Inside the `LessonView` component, after `const questionRef = useRef<QuestionCardHandle>(null);` (after line 31):

```typescript
  const addMasteryEvent = useMasteryStore((s) => s.addEvent);
```

- [ ] **Step 3: Update handleAnswer to log mastery events**

Replace the `handleAnswer` callback (lines 93-99):

```typescript
  // BEFORE:
  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentQuestion) return;
      submitAnswer(currentQuestion.id, correct);
      setLastAnswerCorrect(correct);
      if (correct) {
        setXpGain(prev => prev + 10);
      }
    },
    [currentQuestion, submitAnswer]
  );

  // AFTER:
  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentQuestion) return;
      submitAnswer(currentQuestion.id, correct);
      setLastAnswerCorrect(correct);
      if (correct) {
        setXpGain(prev => prev + 10);
      }
      // Log mastery event if the unit has a topicId
      const topicId = lessonData?.unit.topicId;
      if (topicId) {
        addMasteryEvent({
          questionId: currentQuestion.id,
          topicId,
          difficulty: 'intermediate', // course questions have no difficulty field
          correct,
          source: 'course',
        });
      }
    },
    [currentQuestion, submitAnswer, lessonData, addMasteryEvent]
  );
```

- [ ] **Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/lesson/LessonView.tsx
git commit -m "feat: log mastery events from course lessons"
```

---

## Task 6: Database Schema — masteryEvents Table

**Files:**
- Modify: `src/lib/db/schema.ts`

- [ ] **Step 1: Add masteryEvents table and index import**

In `src/lib/db/schema.ts`, add `index` to the drizzle-orm imports if not already present, then add the table definition after the existing tables (before any `relations` definitions):

Add `index` to the existing imports (preserve all existing imports like `primaryKey` and `uniqueIndex`):
```typescript
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  real,
  boolean,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
```

Add table definition:
```typescript
// ── Mastery Events ──────────────────────────────────────────
export const masteryEvents = pgTable('mastery_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  topicId: text('topic_id').notNull(),
  subtopic: text('subtopic'),
  difficulty: text('difficulty').notNull(),
  correct: boolean('correct').notNull(),
  source: text('source').notNull(),
  answeredAt: timestamp('answered_at', { mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => [
  index('mastery_events_user_topic_idx').on(table.userId, table.topicId),
]);
```

- [ ] **Step 2: Generate and run migration**

Run: `npx drizzle-kit generate`
Then: `npx drizzle-kit push` (or the project's migration command)

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts drizzle/
git commit -m "feat: add mastery_events database table"
```

---

## Task 7: Mastery API Route

**Files:**
- Create: `src/app/api/mastery/route.ts`

- [ ] **Step 1: Create the mastery API**

```typescript
// src/app/api/mastery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { masteryEvents } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await db
    .select({
      id: masteryEvents.id,
      questionId: masteryEvents.questionId,
      topicId: masteryEvents.topicId,
      subtopic: masteryEvents.subtopic,
      difficulty: masteryEvents.difficulty,
      correct: masteryEvents.correct,
      source: masteryEvents.source,
      answeredAt: masteryEvents.answeredAt,
    })
    .from(masteryEvents)
    .where(eq(masteryEvents.userId, userId));

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { events } = (await request.json()) as {
    events: {
      id: string;
      questionId: string;
      topicId: string;
      subtopic?: string;
      difficulty: string;
      correct: boolean;
      source: string;
      answeredAt: string;
    }[];
  };

  if (!events || events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  // Batch insert with ON CONFLICT DO NOTHING for deduplication
  const rows = events.map((event) => ({
    id: event.id,
    userId,
    questionId: event.questionId,
    topicId: event.topicId,
    subtopic: event.subtopic ?? null,
    difficulty: event.difficulty,
    correct: event.correct,
    source: event.source,
    answeredAt: event.answeredAt,
  }));

  await db.insert(masteryEvents).values(rows).onConflictDoNothing();

  return NextResponse.json({ ok: true, inserted: rows.length });
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/mastery/route.ts
git commit -m "feat: add mastery events API route"
```

---

## Task 8: Add masteryEvents to Reset Progress

**Files:**
- Modify: `src/app/api/user/reset-progress/route.ts`

- [ ] **Step 1: Add masteryEvents import and delete**

In `src/app/api/user/reset-progress/route.ts`, update the imports (lines 4-10):

```typescript
// BEFORE:
import {
  userProgress,
  courseProgress,
  topicProgress,
  sessionHistory,
  dailyUsage,
} from '@/lib/db/schema';

// AFTER:
import {
  userProgress,
  courseProgress,
  topicProgress,
  sessionHistory,
  dailyUsage,
  masteryEvents,
} from '@/lib/db/schema';
```

Add to the `Promise.all` delete array (line 29-35):

```typescript
  // BEFORE:
  await Promise.all([
    db.delete(sessionHistory).where(eq(sessionHistory.userId, userId)),
    db.delete(topicProgress).where(eq(topicProgress.userId, userId)),
    db.delete(dailyUsage).where(eq(dailyUsage.userId, userId)),
    db.delete(userProgress).where(eq(userProgress.userId, userId)),
    db.delete(courseProgress).where(eq(courseProgress.userId, userId)),
  ]);

  // AFTER:
  await Promise.all([
    db.delete(sessionHistory).where(eq(sessionHistory.userId, userId)),
    db.delete(topicProgress).where(eq(topicProgress.userId, userId)),
    db.delete(dailyUsage).where(eq(dailyUsage.userId, userId)),
    db.delete(userProgress).where(eq(userProgress.userId, userId)),
    db.delete(courseProgress).where(eq(courseProgress.userId, userId)),
    db.delete(masteryEvents).where(eq(masteryEvents.userId, userId)),
  ]);
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/user/reset-progress/route.ts
git commit -m "feat: clear mastery events on progress reset"
```

---

## Task 9: Update Profile Page — Replace Basic Mastery with Computed Mastery

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`

- [ ] **Step 1: Add mastery imports**

Add after existing imports at top of file:

```typescript
import { useMasteryStore } from '@/store/useMasteryStore';
import { computeAllMastery, getMasteryLevel } from '@/data/mastery';
import type { MasteryScore } from '@/data/mastery';
```

- [ ] **Step 2: Replace topicStats computation**

Replace the existing `topicStats` useMemo (lines 289-302) with computed mastery:

```typescript
  // BEFORE:
  const topicStats = useMemo(
    () =>
      topics.map((topic) => {
        const tp = progress.topicProgress.find((p) => p.topicId === topic.id);
        const attempted = tp?.questionsAttempted ?? 0;
        const correct = tp?.questionsCorrect ?? 0;
        return {
          ...topic,
          attempted,
          accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
        };
      }),
    [progress.topicProgress]
  );

  // AFTER:
  const masteryEvents = useMasteryStore((s) => s.events);
  const topicIds = topics.map((t) => t.id);
  const masteryScores = useMemo(
    () => computeAllMastery(masteryEvents, topicIds),
    [masteryEvents, topicIds]
  );

  const topicStats = useMemo(
    () =>
      topics.map((topic) => {
        const ms = masteryScores.find((m) => m.topicId === topic.id);
        return {
          ...topic,
          mastery: ms?.score ?? 0,
          level: ms?.level ?? 'not-started',
          eventCount: ms?.eventCount ?? 0,
          lastPracticed: ms?.lastPracticed ?? null,
        };
      }),
    [masteryScores]
  );
```

- [ ] **Step 3: Update TopicBar component rendering**

Find the `TopicBar` component or the topic rendering section in the profile page. Update it to use the new mastery data:

Replace any references to `stat.accuracy` and `stat.attempted` with the new fields. The bar should show:
- `stat.mastery` as the percentage (0–100)
- `stat.level` for the label color/text
- `stat.lastPracticed` for "Last practiced X days ago"

The mastery level colors:
```typescript
const masteryColors = {
  'strong': 'bg-emerald-500',
  'developing': 'bg-amber-500',
  'needs-work': 'bg-red-400',
  'not-started': 'bg-surface-200',
};

const masteryLabels = {
  'strong': 'Strong',
  'developing': 'Developing',
  'needs-work': 'Needs Work',
  'not-started': 'Not Started',
};
```

For the bar display, replace the old accuracy bar text:
```typescript
// BEFORE:
{stat.attempted > 0 ? `${stat.accuracy}% accuracy · ${stat.attempted} questions` : '—'}

// AFTER:
{stat.eventCount > 0
  ? `${stat.mastery}% mastery · ${masteryLabels[stat.level]}${stat.lastPracticed ? ` · Last: ${formatDaysAgo(stat.lastPracticed)}` : ''}`
  : 'Not started'}
```

Add this helper at the top of the file (near the compression constants):
```typescript
function formatDaysAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}
```

- [ ] **Step 4: Also clear mastery store on reset progress**

In the `handleResetProgress` function, after calling the API, also clear the mastery store:

```typescript
// After the fetch to /api/user/reset-progress:
useMasteryStore.getState().clearEvents();
```

- [ ] **Step 5: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 6: Verify build passes**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/app/(app)/profile/page.tsx
git commit -m "feat: replace basic mastery with smart computed mastery on profile"
```

---

## Task 10: Final Build Verification & Integration Test

- [ ] **Step 1: Run full build**

Run: `npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Manual smoke test checklist**

1. Start dev server: `npm run dev`
2. Go to a practice session (adaptive) → answer a few questions → verify mastery events appear in localStorage (`mastery-events` key)
3. Go to a course lesson (any unit except u10) → answer questions → verify mastery events logged with source='course'
4. Go to profile page → verify Topic Mastery section shows computed scores
5. Try profile reset → verify mastery events are cleared

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete smart mastery system implementation"
```
