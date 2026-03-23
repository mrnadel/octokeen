# Unified Practice Mode — Design Spec

## Problem

The app has two disconnected systems:
- **Course store** tracks lesson completion, stars, golden status (Skills page reads only this)
- **Practice store** tracks topic/subtopic accuracy (weak areas reads only this)

Practice pages exist at `/practice/*` but are unreachable from the UI. Users who want to "just practice" have no way to do so. Course and practice progress don't cross-pollinate.

## Solution

A unified "Smart Practice" mode that:
1. Draws questions from both course and practice pools
2. Uses an adaptive algorithm to target weak areas
3. Credits course questions answered in practice toward course lesson progress
4. Is accessible from the main page (one-tap) and from the Skills page (targeted)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Session length | 10 questions, fixed | Predictable, ~5 min, Duolingo-style |
| Question pools | Both unified | Course Qs count toward lessons; practice Qs build topic mastery |
| Entry points | EngagementBar + Skills page | Quick-start from home, targeted from Skills |
| Difficulty | Adaptive within session | Starts at user level, adjusts based on answers |

## Question Selection Algorithm

### Step 1 — Score Every Available Question

Each question gets a composite weight based on:

- **Weakness weight (0-5)**: Based on user's subtopic accuracy
  - Accuracy < 50% → weight 5
  - Accuracy < 65% → weight 3
  - Accuracy < 80% → weight 1
  - Accuracy >= 80% → weight 0.5
- **Recency penalty**:
  - Answered correctly in last 24h → excluded
  - Answered correctly in last 3 days → weight halved
- **Difficulty match**: Based on user's current performance level
  - Matching level → 2x
  - One level above → 1.5x
  - Two+ levels above or below → 0.5x
- **Never-seen bonus**: Questions never attempted → 1.5x weight

### Step 2 — Fill 10 Slots

Distribution:
- **6 questions** from weak areas (lowest-accuracy subtopics, highest-weighted)
- **2 questions** from medium areas (50-80% accuracy — reinforcement)
- **2 questions** from strong areas or unseen topics (confidence + discovery)

### Step 3 — Shuffle

Interleave weak/strong questions so the session doesn't front-load difficulty.

### In-Session Adaptation

- 3 correct in a row → next question picks from one difficulty tier higher
- 2 wrong in a row → next question drops one difficulty tier

## Course Progress Bridging

### Course Questions in Practice

When a course question (ID pattern `u*-L*-Q*`) is answered correctly in practice:
1. Add to the lesson's `correctQuestionIds` in `useCourseStore`
2. If all questions in that lesson are now correct AND lesson isn't yet completed → auto-complete with stars based on accuracy

### All Questions

When any question is answered in practice:
1. Update `topicProgress` and `subtopicBreakdown` in `useStore`
2. Recalculate `weakAreas` / `strongAreas`
3. Skills page reflects both course AND practice work

## UI Changes

### 1. EngagementBar — Add "Practice" Button

- Position: between Quests and League buttons
- Icon: brain/target emoji
- Behavior: one tap → starts 10-question smart session immediately
- No configuration — fully automatic question selection

### 2. Skills Page — Make Topics Tappable

- Each topic card becomes clickable → launches practice filtered to that topic
- Subtopics also tappable for focused drilling
- Same algorithm but scoped to selected topic/subtopic
- Still 10 questions per session

### 3. Session Flow

- Reuse existing `SessionView` component
- At session end, `SessionSummary` shows additional info: "X course lessons progressed"
- XP + quest progress awarded as usual through existing engagement system

## Architecture

### New Files

- `src/lib/practice-algorithm.ts` — Question selection, scoring, and adaptive logic

### Modified Files

- `src/app/(app)/practice/smart/page.tsx` — Smart practice session page (new route)
- `src/components/engagement/EngagementBar.tsx` — Add Practice button
- `src/app/(app)/skills/page.tsx` — Make topics/subtopics clickable
- `src/store/useStore.ts` — Bridge practice answers to useCourseStore
- `src/store/useCourseStore.ts` — Add `creditPracticeAnswer()` method

### Reused Components

- `SessionView` — renders question sequence with progress bar
- `QuestionCard` + all input type components — renders individual questions
- `SessionSummary` — shows results after session

### No Changes To

- Question data files (both pools used as-is)
- Database schema
- API routes
- Engagement/quest system (sessions already trigger quest progress)
