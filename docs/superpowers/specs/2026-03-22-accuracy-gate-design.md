# Accuracy Gate for Lesson Progression

## Problem
Users can complete lessons with 0% accuracy and unlock subsequent lessons. No quality gate exists.

## Solution
Require **>=70% accuracy** to pass a lesson attempt. Failed attempts don't earn stars or unlock the next lesson.

## Design

### Core Rule
- `PASSING_ACCURACY = 70`
- Only passing attempts (>=70%) increment `attempts` count and earn stars
- Stars remain = successful attempt count (capped at 3), preserving the "3 variations + golden" system
- Failed attempts still track answered/correct question IDs (for retry pool focus)
- Failed attempts still award XP at 1x multiplier (accuracy <70% = 1x, as already coded)

### Data Model Changes

**`LessonProgress`** — add `passed: boolean`
- `true` once user passes any attempt (>=70%), stays true forever
- Migration: existing entries with `attempts > 0` default to `passed: true`

**`LessonResult`** — add `passed: boolean`
- Reflects whether this specific attempt met the 70% threshold

### Store Logic Changes

**`completeLesson()`:**
- If accuracy >= 70%: increment attempts, update stars, set `passed: true`
- If accuracy < 70%: DON'T increment attempts/stars, still merge question tracking data, still award XP

**`startLesson()`:**
- Change retry pool detection from `existing.attempts > 0` to `existing.answeredQuestionIds.length > 0`
- This ensures failed retries still focus on previously incorrect questions

**`isLessonUnlocked()`:**
- Change from `prevLessonId in completedLessons` to `completedLessons[prevLessonId]?.passed === true`

### UI Changes

**`ResultScreen`:**
- When `!passed`: heading = "Keep Practicing!", show "Need 7/10 to pass" hint, button = "Try Again"
- When `passed`: existing behavior unchanged
- "Try Again" restarts the same lesson (calls `startLesson` with same unit/lesson indices)

### Engagement Tracking
- Quest progress (lessons_completed, stars_earned, etc.) only fires on passing attempts
- XP and league XP still awarded on failure (already handled by accuracy multiplier)
