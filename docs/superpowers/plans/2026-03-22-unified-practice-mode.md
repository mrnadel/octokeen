# Unified Practice Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a smart practice mode that draws from both course and practice question pools, targets user weak areas with adaptive difficulty, and credits course questions answered in practice toward course lesson progress.

**Architecture:** New `practice-algorithm.ts` module handles question scoring/selection. A new `smart-practice` session type integrates into the existing `useStore` session system. `useCourseStore` gets a `creditPracticeAnswer()` method for cross-store bridging. UI changes: Practice button in EngagementBar, clickable topics on Skills page.

**Tech Stack:** React, Zustand, Next.js App Router, TypeScript, Framer Motion

**Spec:** `docs/superpowers/specs/2026-03-22-unified-practice-mode-design.md`

**Note:** `smart-practice` is FREE tier (not added to `PRO_SESSION_TYPES`) — all users should be able to practice their weak areas.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/practice-algorithm.ts` | Create | Question scoring, bucket selection, performance building |
| `src/store/useStore.ts` | Modify | Add `smart-practice` session type, bridge answers to course store |
| `src/store/useCourseStore.ts` | Modify | Add `creditPracticeAnswer()` method |
| `src/app/(app)/practice/smart/page.tsx` | Create | Smart practice session page (auto-starts or accepts topic param) |
| `src/components/engagement/EngagementBar.tsx` | Modify | Add Practice button between Quests and League |
| `src/app/(app)/skills/page.tsx` | Modify | Make topic rows clickable → navigate to smart practice with topic filter |

---

### Task 1: Practice Algorithm — Question Scoring & Selection

**Files:**
- Create: `src/lib/practice-algorithm.ts`

This is the core algorithm. It scores every available question and selects 10 using a weighted bucket system.

- [ ] **Step 1: Create the practice algorithm module**

```typescript
// src/lib/practice-algorithm.ts

import type { Question, TopicId, Difficulty, TopicProgress } from '@/data/types';
import type { CourseQuestion, Unit } from '@/data/course/types';
import { course } from '@/data/course';
import { shuffleArray } from '@/lib/utils';

// --- Types ---

interface UserPerformance {
  topicProgress: TopicProgress[];
  sessionHistory: { date: string; topicsCovered: TopicId[] }[];
  answeredQuestionIds: Set<string>;       // all question IDs answered recently (last 24h)
  recentCorrectIds: Set<string>;          // question IDs answered correctly in last 3 days
}

interface ScoredQuestion {
  question: Question;
  weight: number;
  bucket: 'weak' | 'medium' | 'strong';
  sourceType: 'practice' | 'course';
  courseLessonId?: string;   // if from course, which lesson it belongs to
}

// --- Helpers ---

/** Get the user's overall difficulty level based on their accuracy across all topics */
function getUserLevel(topicProgress: TopicProgress[]): Difficulty {
  const totalAttempted = topicProgress.reduce((s, t) => s + t.questionsAttempted, 0);
  const totalCorrect = topicProgress.reduce((s, t) => s + t.questionsCorrect, 0);
  if (totalAttempted < 10) return 'beginner';
  const accuracy = totalCorrect / totalAttempted;
  if (accuracy >= 0.75) return 'advanced';
  if (accuracy >= 0.5) return 'intermediate';
  return 'beginner';
}

/** Get subtopic accuracy for a given topic */
function getSubtopicAccuracy(
  topicProgress: TopicProgress[],
  topicId: TopicId,
  subtopic: string
): number | null {
  const tp = topicProgress.find(t => t.topicId === topicId);
  if (!tp) return null;
  const sub = tp.subtopicBreakdown[subtopic];
  if (!sub || sub.attempted === 0) return null;
  return sub.correct / sub.attempted;
}

/** Get topic-level accuracy */
function getTopicAccuracy(topicProgress: TopicProgress[], topicId: TopicId): number | null {
  const tp = topicProgress.find(t => t.topicId === topicId);
  if (!tp || tp.questionsAttempted === 0) return null;
  return tp.questionsCorrect / tp.questionsAttempted;
}

/** Determine which bucket a question falls into based on subtopic/topic accuracy */
function classifyBucket(accuracy: number | null): 'weak' | 'medium' | 'strong' {
  if (accuracy === null) return 'strong'; // unseen topics go to "discovery" = strong bucket
  if (accuracy < 0.5) return 'weak';
  if (accuracy < 0.8) return 'medium';
  return 'strong';
}

/** Score a question based on weakness, recency, difficulty match, and novelty */
function scoreQuestion(
  question: Question,
  performance: UserPerformance,
  userLevel: Difficulty,
): ScoredQuestion {
  const { topicProgress, answeredQuestionIds, recentCorrectIds } = performance;

  // --- Weakness weight ---
  const subtopicAcc = getSubtopicAccuracy(topicProgress, question.topic, question.subtopic);
  const topicAcc = getTopicAccuracy(topicProgress, question.topic);
  // Use subtopic accuracy if available, fall back to topic
  const accuracy = subtopicAcc ?? topicAcc;

  let weaknessWeight: number;
  if (accuracy === null) weaknessWeight = 2;        // unseen
  else if (accuracy < 0.5) weaknessWeight = 5;
  else if (accuracy < 0.65) weaknessWeight = 3;
  else if (accuracy < 0.8) weaknessWeight = 1;
  else weaknessWeight = 0.5;

  // --- Recency penalty ---
  if (answeredQuestionIds.has(question.id)) {
    // Answered in last 24h — exclude (weight 0)
    return { question, weight: 0, bucket: classifyBucket(accuracy), sourceType: 'practice' };
  }
  if (recentCorrectIds.has(question.id)) {
    weaknessWeight *= 0.5; // halve weight for recently correct
  }

  // --- Difficulty match ---
  const diffLevels: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };
  const userLvl = diffLevels[userLevel];
  const qLvl = diffLevels[question.difficulty];
  const diff = Math.abs(userLvl - qLvl);
  const diffMultiplier = diff === 0 ? 2 : diff === 1 ? 1.5 : 0.5;

  // --- Never-seen bonus ---
  const noveltyMultiplier = accuracy === null ? 1.5 : 1;

  const weight = weaknessWeight * diffMultiplier * noveltyMultiplier;
  const bucket = classifyBucket(accuracy);

  return { question, weight, bucket, sourceType: 'practice' };
}

// --- Course Question Adapter ---

/** Convert course multiple-choice questions to practice Question format.
 *  Only adapts 'multiple-choice' type — true-false and fill-blank course
 *  questions use incompatible rendering and are skipped. */
function adaptCourseQuestions(courseData: Unit[]): { question: Question; lessonId: string }[] {
  const adapted: { question: Question; lessonId: string }[] = [];

  for (const unit of courseData) {
    const topicId = unit.topicId;
    if (!topicId) continue;

    for (const lesson of unit.lessons) {
      for (const cq of lesson.questions) {
        // Only adapt multiple-choice — true-false/fill-blank have
        // incompatible fields and different rendering components
        if (cq.type !== 'multiple-choice' || !cq.options || cq.correctIndex === undefined) continue;

        const q: Question = {
          id: cq.id,
          type: 'multiple-choice',
          topic: topicId,
          subtopic: lesson.title.toLowerCase().replace(/\s+/g, '-'),
          difficulty: 'beginner' as Difficulty,
          question: cq.question,
          options: cq.options.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
          correctAnswer: String.fromCharCode(97 + cq.correctIndex),
          explanation: cq.explanation,
          interviewInsight: '',
          commonMistake: '',
          tags: [],
          diagram: cq.diagram,
        } as Question;
        adapted.push({ question: q, lessonId: lesson.id });
      }
    }
  }

  return adapted;
}

// --- Main Selection Function ---

export interface SmartPracticeOptions {
  topicId?: TopicId;        // filter to a specific topic (from Skills page)
  subtopic?: string;        // filter to a specific subtopic
  count?: number;           // default 10
}

export interface SelectedQuestion {
  question: Question;
  sourceType: 'practice' | 'course';
  courseLessonId?: string;
}

export function selectSmartPracticeQuestions(
  practiceQuestions: Question[],
  courseData: Unit[],
  performance: UserPerformance,
  options: SmartPracticeOptions = {},
): SelectedQuestion[] {
  const count = options.count ?? 10;
  const userLevel = getUserLevel(performance.topicProgress);

  // --- Build unified pool ---
  const scored: (ScoredQuestion & { courseLessonId?: string })[] = [];

  // Score practice questions
  let practicePool = practiceQuestions;
  if (options.topicId) practicePool = practicePool.filter(q => q.topic === options.topicId);
  if (options.subtopic) practicePool = practicePool.filter(q => q.subtopic === options.subtopic);

  for (const q of practicePool) {
    const s = scoreQuestion(q, performance, userLevel);
    if (s.weight > 0) scored.push({ ...s, sourceType: 'practice' });
  }

  // Score course questions
  let courseAdapted = adaptCourseQuestions(courseData);
  if (options.topicId) courseAdapted = courseAdapted.filter(c => c.question.topic === options.topicId);

  for (const { question, lessonId } of courseAdapted) {
    const s = scoreQuestion(question, performance, userLevel);
    if (s.weight > 0) scored.push({ ...s, sourceType: 'course', courseLessonId: lessonId });
  }

  if (scored.length === 0) return [];

  // --- Fill buckets ---
  const weak = scored.filter(s => s.bucket === 'weak').sort((a, b) => b.weight - a.weight);
  const medium = scored.filter(s => s.bucket === 'medium').sort((a, b) => b.weight - a.weight);
  const strong = scored.filter(s => s.bucket === 'strong').sort((a, b) => b.weight - a.weight);

  // Target: 6 weak, 2 medium, 2 strong — but flex if buckets are thin
  const selected: typeof scored = [];

  function pickFromBucket(bucket: typeof scored, target: number) {
    const shuffled = shuffleWeighted(bucket.filter(s => !selected.includes(s)));
    for (let i = 0; i < Math.min(target, shuffled.length); i++) {
      selected.push(shuffled[i]);
    }
  }

  pickFromBucket(weak, 6);
  pickFromBucket(medium, 2);
  pickFromBucket(strong, 2);

  // If we don't have enough, fill from any bucket
  if (selected.length < count) {
    const remaining = scored.filter(s => !selected.includes(s)).sort((a, b) => b.weight - a.weight);
    for (const s of remaining) {
      if (selected.length >= count) break;
      selected.push(s);
    }
  }

  // Shuffle final selection so weak/strong are interleaved
  const final = shuffleArray(selected.slice(0, count));

  return final.map(s => ({
    question: s.question,
    sourceType: s.sourceType,
    courseLessonId: s.courseLessonId,
  }));
}

/** Weighted shuffle — higher weight items are more likely to appear early */
function shuffleWeighted<T extends { weight: number }>(items: T[]): T[] {
  const result: T[] = [];
  const remaining = [...items];

  while (remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let pickedIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      random -= remaining[i].weight;
      if (random <= 0) {
        pickedIndex = i;
        break;
      }
    }

    result.push(remaining[pickedIndex]);
    remaining.splice(pickedIndex, 1);
  }

  return result;
}

// --- Performance Builder ---
// NOTE: Recency-based exclusion (24h exclude, 3-day penalty) is defined in the
// scoring function but not yet populated here. The algorithm still works well via
// subtopic accuracy weighting — recency tracking can be added later by storing
// per-question answer timestamps. TODO: add per-question timestamp tracking.

/** Build UserPerformance from store state for the algorithm */
export function buildPerformance(
  topicProgress: TopicProgress[],
  sessionHistory: { date: string; topicsCovered: TopicId[] }[],
): UserPerformance {
  return {
    topicProgress,
    sessionHistory,
    answeredQuestionIds: new Set(),
    recentCorrectIds: new Set(),
  };
}
```

- [ ] **Step 2: Verify the module compiles**

Run: `npx tsc --noEmit src/lib/practice-algorithm.ts 2>&1 | head -20`

If there are import errors, fix them. The key thing is that `Question` type has `topic`, `subtopic`, `difficulty`, `id` fields, and `TopicProgress` has `subtopicBreakdown`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/practice-algorithm.ts
git commit -m "feat: add smart practice question selection algorithm"
```

---

### Task 2: Add `creditPracticeAnswer` to Course Store

**Files:**
- Modify: `src/store/useCourseStore.ts`

When a course question is answered correctly in smart practice, credit it toward the lesson's progress.

- [ ] **Step 1: Add the `creditPracticeAnswer` method to the CourseState interface**

In `src/store/useCourseStore.ts`, add to the `CourseState` interface (around line 46, before the Debug section):

```typescript
  // Practice bridging
  creditPracticeAnswer: (questionId: string, correct: boolean) => void;
```

- [ ] **Step 2: Implement `creditPracticeAnswer` in the store**

Add the implementation inside the `create` call, after `dismissCourseCompletion` (around line 300, before `debugSetProgress`). This function:
1. Finds which lesson the question belongs to
2. Adds to `correctQuestionIds` if correct
3. Adds to `answeredQuestionIds` always
4. Does NOT auto-complete lessons (the user should still go through the course flow for that)

```typescript
      creditPracticeAnswer: (questionId: string, correct: boolean) => {
        // Find which lesson this question belongs to
        const courseData = get().courseData;
        let targetLessonId: string | null = null;

        for (const unit of courseData) {
          for (const lesson of unit.lessons) {
            if (lesson.questions.some(q => q.id === questionId)) {
              targetLessonId = lesson.id;
              break;
            }
          }
          if (targetLessonId) break;
        }

        if (!targetLessonId) return; // not a course question

        set(state => {
          const existing = state.progress.completedLessons[targetLessonId!];

          // Build updated arrays
          const prevAnswered = existing?.answeredQuestionIds ?? [];
          const prevCorrect = existing?.correctQuestionIds ?? [];
          const newAnswered = prevAnswered.includes(questionId) ? prevAnswered : [...prevAnswered, questionId];
          const newCorrect = correct && !prevCorrect.includes(questionId)
            ? [...prevCorrect, questionId]
            : prevCorrect;

          if (!existing) {
            // Lesson not yet started through course — just track the question IDs
            // Don't create a full LessonProgress entry (user hasn't done the lesson yet)
            // Store in a separate lightweight tracker
            return state; // For now, only credit existing lessons
          }

          return {
            progress: {
              ...state.progress,
              completedLessons: {
                ...state.progress.completedLessons,
                [targetLessonId!]: {
                  ...existing,
                  answeredQuestionIds: newAnswered,
                  correctQuestionIds: newCorrect,
                },
              },
            },
          };
        });
      },
```

- [ ] **Step 3: Commit**

```bash
git add src/store/useCourseStore.ts
git commit -m "feat: add creditPracticeAnswer to bridge practice → course progress"
```

---

### Task 3: Add `smart-practice` Session Type to useStore

**Files:**
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: Add `smart-practice` to the SessionType union**

In `src/store/useStore.ts` line 16, update the type:

```typescript
export type SessionType = 'adaptive' | 'topic-deep-dive' | 'interview-sim' | 'daily-challenge' | 'real-world' | 'weak-areas' | 'smart-practice';
```

- [ ] **Step 2: Add smart-practice case to `selectQuestionsForSession`**

In the `selectQuestionsForSession` function (line 108), add a case for `smart-practice` before the default. Since smart practice uses its own algorithm externally, this case just needs to handle the `questionIds` pass-through (questions will be pre-selected by `practice-algorithm.ts` and passed via `options.questionIds`):

The existing code at line 112-113 already handles `options.questionIds`:
```typescript
if (options?.questionIds) {
  return options.questionIds.map(id => allQs.find(q => q.id === id)!).filter(Boolean);
}
```

So `smart-practice` just needs to be a valid case. Add it to the switch:

```typescript
    case 'smart-practice':
      pool = [...allQs];
      count = 10;
      break;
```

- [ ] **Step 3: Bridge answers to course store in `answerQuestion`**

Add `import { useCourseStore } from '@/store/useCourseStore';` at the top of `src/store/useStore.ts`.

**Circular import note:** `useCourseStore` already imports `useStore`. This circular reference is safe because Zustand stores are lazily evaluated — the `create()` callback only runs when the store is first accessed, not at module import time. Both stores can import each other without issues.

In the `answerQuestion` method (line 307), after the closing `));` of the `set` call (after line 333), add:

```typescript
        // Bridge to course store if this is a course question
        if (questionId.match(/^u\d+-L\d+-Q/)) {
          useCourseStore.getState().creditPracticeAnswer(questionId, correct);
        }
```

- [ ] **Step 4: Commit**

```bash
git add src/store/useStore.ts
git commit -m "feat: add smart-practice session type with course answer bridging"
```

---

### Task 4: Smart Practice Page

**Files:**
- Create: `src/app/(app)/practice/smart/page.tsx`

This page auto-starts a smart practice session. It reads `?topic=xxx` from the URL for topic-filtered practice (from Skills page), or starts with full algorithm if no param.

- [ ] **Step 1: Create the smart practice page**

```typescript
// src/app/(app)/practice/smart/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession, useSessionActions, useProgress } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import SessionView from '@/components/session/SessionView';
import {
  selectSmartPracticeQuestions,
  buildPerformance,
} from '@/lib/practice-algorithm';
import type { TopicId } from '@/data/types';
import { Brain, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SmartPracticePage() {
  const { session, sessionSummary } = useSession();
  const { startSession, abandonSession } = useSessionActions();
  const progress = useProgress();
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [noQuestions, setNoQuestions] = useState(false);

  const topicFilter = searchParams.get('topic') as TopicId | null;

  // Auto-start session on mount
  useEffect(() => {
    if (started.current || session || sessionSummary) return;
    started.current = true;

    const questions = useStore.getState().questions;
    const courseData = useCourseStore.getState().courseData;
    const perf = buildPerformance(
      progress.topicProgress,
      progress.sessionHistory,
    );

    const selected = selectSmartPracticeQuestions(
      questions,
      courseData,
      perf,
      { topicId: topicFilter ?? undefined },
    );

    if (selected.length === 0) {
      setNoQuestions(true);
      return;
    }

    // Start session with pre-selected question IDs
    startSession('smart-practice', {
      topicId: topicFilter ?? undefined,
      questionIds: selected.map(s => s.question.id),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show session view when active
  if (session || sessionSummary) {
    return <SessionView />;
  }

  // No questions found
  if (noQuestions) {
    return (
      <div className="max-w-2xl mx-auto text-center px-4 py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-100 mb-4">
          <Brain className="w-8 h-8 text-surface-400" />
        </div>
        <h1 className="text-xl font-bold text-surface-900 mb-2">No Questions Available</h1>
        <p className="text-surface-500 mb-6">
          {topicFilter
            ? `No practice questions found for this topic. Try a different one!`
            : 'No practice questions available right now. Complete some lessons first!'}
        </p>
        <Link
          href={topicFilter ? '/skills' : '/'}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Go back
        </Link>
      </div>
    );
  }

  // Loading state
  return (
    <div className="max-w-2xl mx-auto text-center px-4 py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 mb-4">
        <Brain className="w-8 h-8 text-violet-500" />
      </div>
      <h1 className="text-xl font-bold text-surface-900 mb-2">Smart Practice</h1>
      <p className="text-surface-500 mb-6">
        {topicFilter
          ? `Preparing questions for ${topicFilter.replace(/-/g, ' ')}...`
          : 'Analyzing your weak areas and preparing questions...'}
      </p>
      <Link
        href={topicFilter ? '/skills' : '/'}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface-400 hover:text-surface-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Go back
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: `npx next build 2>&1 | tail -30` (or just check for TypeScript errors with `npx tsc --noEmit`)

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/practice/smart/page.tsx
git commit -m "feat: add smart practice page with auto-start session"
```

---

### Task 5: Add Practice Button to EngagementBar

**Files:**
- Modify: `src/components/engagement/EngagementBar.tsx`

- [ ] **Step 1: Add Practice button to the `buttons` array**

In `src/components/engagement/EngagementBar.tsx`, find the `buttons` array (line 159). Add a Practice entry as the FIRST item, before League:

```typescript
  const buttons = [
    {
      href: '/practice/smart',
      icon: '🧠',
      label: 'Practice',
      badge: null,
      badgeDone: false,
      bg: '#F5F3FF',
      border: '#DDD6FE',
      color: '#7C3AED',
    },
    {
      href: '/league',
      icon: tier.icon,
      // ... rest of existing League button
```

This will render a "Practice" button alongside Quests, League, and Skills — all in one row.

- [ ] **Step 2: Commit**

```bash
git add src/components/engagement/EngagementBar.tsx
git commit -m "feat: add Practice button to EngagementBar"
```

---

### Task 6: Make Skills Page Topics Clickable

**Files:**
- Modify: `src/app/(app)/skills/page.tsx`

- [ ] **Step 1: Add router import**

At the top of `src/app/(app)/skills/page.tsx`, add `useRouter`:

```typescript
import { useRouter } from 'next/navigation';
```

- [ ] **Step 2: Add router to the page component and pass to TopicRow**

Inside `SkillMapPage`, add:
```typescript
const router = useRouter();
```

Then update all `<TopicRow>` usages to pass an `onPractice` callback:

```tsx
<TopicRow key={t.id} topic={t} onPractice={(topicId) => router.push(`/practice/smart?topic=${topicId}`)} />
```

And for compact rows:
```tsx
<TopicRow key={t.id} topic={t} compact onPractice={(topicId) => router.push(`/practice/smart?topic=${topicId}`)} />
```

- [ ] **Step 3: Update TopicRow to accept `onPractice` and be clickable**

In the `TopicRowProps` interface, add:
```typescript
  onPractice?: (topicId: string) => void;
```

In the `TopicRow` component, update the function signature:
```typescript
function TopicRow({ topic, compact, onPractice }: TopicRowProps) {
```

Wrap the entire topic card `<div>` with a clickable handler. Replace the outer `<div>` with:

```tsx
    <button
      onClick={() => onPractice?.(topic.id)}
      className="w-full text-left transition-transform active:scale-[0.98]"
      style={{
        background: 'white',
        borderRadius: 16,
        border: `2px solid ${meta.color}25`,
        padding: compact ? '14px 16px' : '16px 16px 14px',
        cursor: onPractice ? 'pointer' : 'default',
      }}
    >
```

And close with `</button>` instead of `</div>`.

Add a small "Practice" indicator on the right side of the header row, after the score percentage:

```tsx
{onPractice && topic.attempted > 0 && (
  <span
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: '#7C3AED',
      background: '#F5F3FF',
      padding: '2px 8px',
      borderRadius: 8,
      marginLeft: 8,
      flexShrink: 0,
    }}
  >
    Practice →
  </span>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/skills/page.tsx
git commit -m "feat: make Skills page topics clickable for targeted practice"
```

---

### Task 7: Integration Testing & Polish

**Files:**
- All modified files

- [ ] **Step 1: Verify the full flow works**

Run the dev server: `npm run dev`

Test these flows:
1. **EngagementBar → Practice**: Click the Practice button on the home page. Verify it navigates to `/practice/smart` and auto-starts a 10-question session.
2. **Skills → Topic Practice**: Go to Skills page, click on a topic. Verify it navigates to `/practice/smart?topic=engineering-mechanics` and starts a filtered session.
3. **Session completion**: Complete a session. Verify XP, quest progress, and session summary all work.
4. **Course bridging**: If a course question (ID like `u1-L1-Q1`) appears in practice and is answered correctly, verify `useCourseStore.progress.completedLessons` gets updated.

- [ ] **Step 2: Fix any TypeScript errors**

Run: `npx tsc --noEmit`

Fix any type mismatches between `Question` fields and what the algorithm expects.

- [ ] **Step 3: Commit final polish**

```bash
git add -A
git commit -m "feat: unified smart practice mode — complete integration"
```
