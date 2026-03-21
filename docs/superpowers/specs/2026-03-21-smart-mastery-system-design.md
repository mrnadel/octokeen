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

Course questions have no `difficulty` field → default to `'intermediate'`.
Course questions have no `subtopic` field → leave `undefined`.

## Architecture

### New Files

1. **`src/data/mastery.ts`** — Types (`AnswerEvent`, `MasteryScore`) and pure computation function (`computeMastery`, `computeAllMastery`, `getMasteryLevel`)
2. **`src/store/useMasteryStore.ts`** — Zustand store with persist middleware. State: `events: AnswerEvent[]`. Actions: `addEvent()`, `getEvents(topicId?)`, `clearEvents()`. Does NOT compute mastery — that's the pure function's job.
3. **`src/app/api/mastery/route.ts`** — GET (fetch events from DB) and POST (sync events to DB, append-only)
4. **DB migration** — New `mastery_events` table

### Modified Files

1. **`src/data/course/types.ts`** — Add `topicId?: TopicId` to `Unit` interface
2. **`src/data/course/unit-*.ts`** (9 files) — Add `topicId` to each unit definition (skip u10)
3. **`src/components/session/SessionView.tsx`** — After `answerQuestion()`, also call `masteryStore.addEvent()` with the question's topic, subtopic, difficulty
4. **`src/components/lesson/LessonView.tsx`** — After `submitAnswer()`, also call `masteryStore.addEvent()` with the unit's topicId (if present), difficulty='intermediate'
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
});
```

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

### Existing Systems — No Changes

- `useStore.topicProgress` — left untouched, still updated by practice sessions
- `useCourseStore.completedLessons` — left untouched, still tracks stars/accuracy
- `useStore.weakAreas` / `strongAreas` — still computed from old system (profile page will use new system for display, but store internals unchanged)

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

## Testing Strategy

- Unit tests for `computeMastery()` pure function with various event distributions
- Verify recency decay math (event from 14 days ago = half weight)
- Verify difficulty weighting (advanced correct > beginner correct)
- Verify confidence factor (few events = low mastery even if all correct)
- Integration: answer questions in both modes, verify mastery updates on profile
