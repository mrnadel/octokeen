# Smart Mastery System — Design Spec

## Problem

The app has two disconnected progress systems:
- **Practice sessions** (`useStore`) track per-topic accuracy via `topicProgress`, but use a naive formula: `accuracy × min(questions/15, 1)`
- **Course lessons** (`useCourseStore`) track lesson completion with stars/accuracy, but have **no topic mapping** — they don't contribute to mastery at all

Result: the "Topic Mastery" display on the profile page ignores course work entirely and uses a simplistic algorithm that doesn't account for recency, difficulty, or confidence.

## Solution

A unified mastery system that:
1. Logs every answer as an **event** (from both practice and course modes)
2. Computes mastery per topic using a **recency-weighted, difficulty-adjusted algorithm**
3. Replaces the current basic mastery display on the profile page

## Algorithm

### Answer Event Shape

```typescript
// Client-side shape (no userId — single user per client)
interface AnswerEvent {
  id: string;
  questionId: string;
  topicId: TopicId;
  subtopic?: string;
  difficulty: Difficulty;  // 'beginner' | 'intermediate' | 'advanced'
  correct: boolean;
  source: 'practice' | 'course';
  answeredAt: string;      // ISO timestamp
}
```

Note: `userId` is added server-side by the API route during POST sync, not stored in the client event.

### Mastery Computation (Pure Function)

```typescript
function computeMastery(events: AnswerEvent[]): number {
  if (events.length === 0) return 0;

  const now = Date.now();
  const HALF_LIFE_DAYS = 14;
  const CONFIDENCE_THRESHOLD = 8; // weighted points needed for full confidence
  const DIFFICULTY_WEIGHTS = { beginner: 0.6, intermediate: 1.0, advanced: 1.5 };

  let totalWeight = 0;
  let correctWeight = 0;

  for (const event of events) {
    const daysSince = (now - new Date(event.answeredAt).getTime()) / (1000 * 60 * 60 * 24);
    const recency = Math.pow(0.5, daysSince / HALF_LIFE_DAYS);
    const diffWeight = DIFFICULTY_WEIGHTS[event.difficulty];
    const weight = recency * diffWeight;

    totalWeight += weight;
    if (event.correct) correctWeight += weight;
  }

  const rawAccuracy = correctWeight / totalWeight;                // 0–1
  const confidence = Math.min(totalWeight / CONFIDENCE_THRESHOLD, 1.0); // 0–1
  return Math.round(rawAccuracy * confidence * 100);               // 0–100
}
```

### Mastery Levels

| Range | Label | Color |
|-------|-------|-------|
| 75–100 | Strong | green |
| 40–74 | Developing | yellow/amber |
| 1–39 | Needs Work | orange/red |
| 0 | Not Started | gray |

### Weak/Strong Areas

Derived directly from mastery scores:
- `strongAreas`: topics with mastery >= 75
- `weakAreas`: topics with mastery < 40 (and at least 1 event)

Note: `useStore.weakAreas`/`strongAreas` (computed on session completion using the old 60%/80% thresholds) are left unchanged — they still drive the "weak areas" practice mode. The profile page will use the new mastery system for display only. Migration of the practice mode to use new mastery is a future enhancement.

### Subtopic-Level Mastery

The `subtopic` field is stored in each event for future use. The current implementation computes mastery at the topic level only. Subtopic-level mastery breakdown is a future enhancement using the same event data.

## Course Lesson → Topic Mapping

Add optional `topicId?: TopicId` to the `Unit` type. Mapping:

| Unit ID | Topic ID |
|---------|----------|
| u1-statics | engineering-mechanics |
| u2-dynamics | engineering-mechanics |
| u3-strength | strength-of-materials |
| u4-thermo | thermodynamics |
| u5-heat | heat-transfer |
| u6-fluids | fluid-mechanics |
| u7-materials | materials-engineering |
| u8-machine | machine-elements |
| u9-gdt | design-tolerancing |
| u10-interview | *(none — cross-cutting, excluded from mastery)* |

**Topics with no course unit**: `manufacturing`, `vibrations`, and `real-world-mechanisms` have no corresponding course unit. These topics receive mastery events only from practice sessions. The profile still shows mastery for all 11 topics.

Course questions have no `difficulty` field → default to `'intermediate'`.
Course questions have no `subtopic` field → leave `undefined`.

**Field naming**: Practice `Question` objects use `topic` (type `TopicId`), while `AnswerEvent` uses `topicId`. Implementers must map `question.topic` → `event.topicId` when logging practice events.

## Architecture

### New Files

1. **`src/data/mastery.ts`** — Types (`AnswerEvent`, `MasteryScore`) and pure computation function (`computeMastery`, `computeAllMastery`, `getMasteryLevel`)
2. **`src/store/useMasteryStore.ts`** — Zustand store with persist middleware. State: `events: AnswerEvent[]`. Actions: `addEvent()`, `getEvents(topicId?)`, `clearEvents()`. Does NOT compute mastery — that's the pure function's job.
3. **`src/app/api/mastery/route.ts`** — GET (fetch events from DB) and POST (sync events to DB, append-only)
4. **DB migration** — New `mastery_events` table

### Modified Files

1. **`src/data/course/types.ts`** — Add `topicId?: TopicId` to `Unit` interface
2. **`src/data/course/units/unit-*.ts`** (9 files) — Add `topicId` to each unit definition (skip u10)
3. **`src/components/session/SessionView.tsx`** — After `answerQuestion()`, also call `masteryStore.addEvent()` with `question.topic` (mapped to `topicId`), `question.subtopic`, `question.difficulty`
4. **`src/components/lesson/LessonView.tsx`** — After `submitAnswer()`, also call `masteryStore.addEvent()` with `lessonData.unit.topicId` (accessed via the existing `lessonData` memo from `course[activeLesson.unitIndex]`), difficulty='intermediate'. Skip if unit has no topicId.
5. **`src/app/(app)/profile/page.tsx`** — Replace basic mastery bars with computed mastery from `useMasteryStore` + `computeMastery()`
6. **`src/lib/db/schema.ts`** — Add `masteryEvents` table definition
7. **`src/app/api/user/reset-progress/route.ts`** — Also delete mastery_events on reset

### Database Table

```typescript
export const masteryEvents = pgTable('mastery_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  topicId: text('topic_id').notNull(),
  subtopic: text('subtopic'),
  difficulty: text('difficulty').notNull(),       // 'beginner' | 'intermediate' | 'advanced'
  correct: boolean('correct').notNull(),
  source: text('source').notNull(),               // 'practice' | 'course'
  answeredAt: timestamp('answered_at', { mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => [
  index('mastery_events_user_topic_idx').on(table.userId, table.topicId),
]);
```

**Question ID namespaces**: Practice question IDs (e.g., `q-em-001`) and course question IDs (e.g., `u1-L1-Q1`) use distinct prefixes and will not collide.

### Data Flow

```
User answers question (any mode)
  → Component calls existing store action (answerQuestion / submitAnswer)
  → Component ALSO calls masteryStore.addEvent({ topicId, subtopic, difficulty, correct, source })
  → Event persisted in localStorage via Zustand persist
  → On sync: POST /api/mastery sends new events to DB (append-only, deduped by event ID)

Profile page loads
  → Reads events from masteryStore
  → Calls computeMastery(events) per topic
  → Renders mastery bars with computed scores
```

Note: Both store writes happen synchronously in the same React event handler tick, so partial writes from crashes are extremely unlikely.

### Sync Strategy

- **When**: Sync triggers on the same occasions as existing progress sync — after session/lesson completion, and on profile page load.
- **Tracking new events**: The store tracks a `lastSyncedIndex: number` indicating how many events have been synced. On POST, only events after this index are sent. On success, the index advances.
- **Conflict resolution**: Events are append-only with client-generated UUIDs. The POST endpoint uses `ON CONFLICT (id) DO NOTHING` to handle duplicate submissions from retries.
- **Initial hydration**: On login, GET /api/mastery fetches all events from the DB and merges with local events (deduped by ID). Local events not in DB are re-synced on next POST.
- **Offline**: Events accumulate locally in localStorage. On reconnect, the next sync uploads all unsynced events.

### Local Storage Pruning

localStorage has a ~5-10MB limit. Each `AnswerEvent` is ~200-300 bytes JSON. To prevent unbounded growth:

- Events older than **90 days** are pruned from the local store on each `addEvent()` call. Since events at 60+ days contribute < 0.1% weight to mastery, this has negligible impact on computed scores.
- The DB retains all events permanently (no pruning).
- Pruning runs as a lightweight filter — no debounce needed since `addEvent()` is called at most once per question.

### Existing Systems — No Changes

- `useStore.topicProgress` — left untouched, still updated by practice sessions
- `useCourseStore.completedLessons` — left untouched, still tracks stars/accuracy
- `useStore.weakAreas` / `strongAreas` — still computed from old system; still drives weak-areas practice mode. Profile page uses new mastery for display only.

## Profile Display

The Topic Mastery section on the profile page changes from:
- **Before**: Raw accuracy bar per topic, "X% accuracy · N questions"
- **After**: Computed mastery bar per topic with:
  - Mastery % (0–100)
  - Level label: "Strong" / "Developing" / "Needs Work" / "Not Started"
  - "Last practiced X days ago" or "Not started"
  - Color-coded bar matching mastery level

## Edge Cases

- **Duplicate question re-answered**: Each answer is a separate event (retrying a question adds new events, doesn't overwrite). This is intentional — repeated practice contributes to mastery.
- **Unit 10 (interview)**: No topicId → no mastery events logged from those lessons.
- **No events for a topic**: mastery = 0, displayed as "Not Started"
- **Very old events**: Recency decay handles this naturally. Events from 28+ days ago contribute < 25% weight. After ~60 days they're nearly negligible.
- **Progress reset**: Delete all mastery_events for the user (both DB and Zustand store).
- **Topics with no course unit** (manufacturing, vibrations, real-world-mechanisms): Mastery comes exclusively from practice sessions. Profile still shows all 11 topics.

## Testing Strategy

- Unit tests for `computeMastery()` pure function with various event distributions
- Verify recency decay math (event from 14 days ago = half weight)
- Verify difficulty weighting (advanced correct > beginner correct)
- Verify confidence factor (few events = low mastery even if all correct)
- Integration: answer questions in both modes, verify mastery updates on profile
