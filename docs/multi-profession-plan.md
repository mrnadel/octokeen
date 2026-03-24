# Multi-Profession Transformation Plan

Transform MechReady from a single-profession ME app into a multi-profession learning platform with a hearts/lives system, while keeping the existing ME course intact and adding a Finance starter unit.

## Current State
- 10 ME units with ~1,700 questions in TypeScript files
- DB schema is already topic-agnostic (no ME columns)
- Gamification engine (XP, streaks, leagues, achievements) is topic-agnostic
- Practice algorithm is performance-based, topic-agnostic
- Brand constants already centralized in `src/lib/constants.ts`

## Phase Overview
1. **Profession Data Layer** — Introduce profession concept, refactor course loading
2. **Hearts System** — Add hearts/lives as the core conversion lever
3. **Finance Starter Content** — One unit with 3 lessons to test the multi-profession flow
4. **UI: Profession Picker** — Dashboard/onboarding profession selector
5. **Landing Page & Metadata** — Update to be multi-profession

---

## Step 1: Profession Data Layer

### 1a. Create profession registry
**File**: `src/data/professions.ts`

```ts
export interface Profession {
  id: string;           // 'mechanical-engineering' | 'personal-finance' | ...
  name: string;         // 'Mechanical Engineering'
  shortName: string;    // 'ME'
  icon: string;         // emoji or icon name
  color: string;        // brand color for this profession
  description: string;  // one-liner
  unitCount: number;    // how many units are available
  questionCount: number;
  isComingSoon?: boolean;
}

export const PROFESSIONS: Profession[] = [
  {
    id: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    icon: '⚙️',
    color: '#6366F1',
    description: 'Thermodynamics, fluid mechanics, materials, and machine design',
    unitCount: 10,
    questionCount: 1700,
  },
  {
    id: 'personal-finance',
    name: 'Personal Finance',
    shortName: 'Finance',
    icon: '💰',
    color: '#10B981',
    description: 'Budgeting, investing, taxes, and building wealth',
    unitCount: 1,
    questionCount: 30,
  },
];

export const DEFAULT_PROFESSION = 'mechanical-engineering';

export function getProfession(id: string) {
  return PROFESSIONS.find(p => p.id === id);
}
```

### 1b. Refactor course-meta.ts
**File**: `src/data/course/course-meta.ts`

Current: exports a single `courseMeta` array of 10 ME units.
Change: export a function `getCourseMetaForProfession(professionId)` that returns the right course meta.

- Keep existing ME course meta as `mechanical-engineering-meta.ts`
- Create `personal-finance-meta.ts` for the finance unit(s)
- `course-meta.ts` becomes a router that imports both and selects by profession ID

### 1c. Refactor unit loading
**File**: `src/data/course/units/`

Current: `loadUnitData(unitIndex)` does dynamic import of `unit-0.ts` through `unit-9.ts`.
Change: `loadUnitData(professionId, unitIndex)` that imports from a profession-namespaced path.

Structure:
```
src/data/course/
  professions/
    mechanical-engineering/
      meta.ts          (current courseMeta array, moved here)
      units/
        unit-0.ts ... unit-9.ts (existing ME content, moved here)
    personal-finance/
      meta.ts          (new finance course meta)
      units/
        unit-0.ts      (new: Budgeting Basics — 3 lessons, ~30 questions)
  course-meta.ts       (router: getCourseMetaForProfession)
  load-unit.ts         (router: loadUnitData(professionId, unitIndex))
  types.ts             (keep as-is, already generic)
```

### 1d. Update useCourseStore
**File**: `src/store/useCourseStore.ts`

Add `activeProfession: string` field (persisted in localStorage).
Update all methods that reference `courseMeta` to use `getCourseMetaForProfession(activeProfession)`.
Update `loadUnitData()` calls to pass `activeProfession`.
Progress is already keyed by `unitId-lessonId` — different professions have different IDs, so progress is naturally separated.

### 1e. Update useStore (practice)
**File**: `src/store/useStore.ts`

- Add `activeProfession: string` field.
- `gatherCourseQuestions()` already pulls from `useCourseStore` — will automatically get the right profession's questions.
- Remove hardcoded `'real-world-mechanisms'` filter in `selectQuestionsForSession()` — make it profession-aware.

### 1f. Update API route
**File**: `src/app/api/content/course/route.ts`

Add optional `?profession=` query param. Default to user's stored profession or `mechanical-engineering`.

---

## Step 2: Hearts System

### 2a. Add hearts to useStore
**File**: `src/store/useStore.ts`

Add to the persisted state:
```ts
hearts: {
  current: number;      // 0-5
  max: number;          // 5
  lastRechargeAt: number; // timestamp
  rechargeIntervalMs: number; // 4 hours = 14400000
}
```

Logic:
- On app load: calculate recharged hearts since `lastRechargeAt` (1 heart per 4 hours, max 5)
- On wrong answer: `hearts.current -= 1`
- When hearts === 0: show "Out of Hearts" modal (wait or upgrade to Pro)
- Pro users: hearts system is bypassed (unlimited)

### 2b. HeartDisplay component
**File**: `src/components/ui/HeartDisplay.tsx`

Show current hearts (filled/empty heart icons) in the top bar during practice sessions.
Animate heart loss on wrong answer.

### 2c. OutOfHeartsModal component
**File**: `src/components/ui/OutOfHeartsModal.tsx`

When hearts reach 0:
- Show time until next heart recharges
- "Practice old lessons to earn hearts" option (reviewing already-passed lessons)
- "Get unlimited hearts" → upgrade CTA (links to pricing)
- "Watch to earn a heart" → placeholder for future ad integration

### 2d. Integrate into practice flow
**Files**: Practice session components

- Before starting a question: check hearts > 0 (skip for Pro users)
- On wrong answer: decrement hearts, show animation
- On hearts === 0: pause session, show OutOfHeartsModal

### 2e. Update pricing.ts
**File**: `src/lib/pricing.ts`

Add to FEATURES:
```ts
unlimitedHearts: { free: false, pro: true }
```

Update tier descriptions to highlight hearts.

---

## Step 3: Finance Starter Content

### 3a. Create finance course meta
**File**: `src/data/course/professions/personal-finance/meta.ts`

One unit: "Budgeting Basics" with 3 lessons:
- Lesson 1: "Income & Expenses" (10 questions — MC, T/F, fill-blank)
- Lesson 2: "The 50/30/20 Rule" (10 questions)
- Lesson 3: "Emergency Funds" (10 questions)

### 3b. Create finance unit data
**File**: `src/data/course/professions/personal-finance/units/unit-0.ts`

30 questions total across 3 lessons. Question types:
- Multiple choice: "Which of these is a fixed expense?" → Rent, Concert tickets, Restaurant meals, Vacation
- True/False: "You should save at least 3-6 months of expenses in an emergency fund"
- Fill-blank (word bank): "The 50/30/20 rule suggests spending 50% on [needs], 30% on [wants], and 20% on [savings]"

Content covers: income types, fixed vs variable expenses, needs vs wants, budgeting rules, emergency fund sizing, debt basics.

---

## Step 4: UI — Profession Picker

### 4a. ProfessionPicker component
**File**: `src/components/profession/ProfessionPicker.tsx`

A card-grid selector showing available professions.
Each card: icon, name, description, question count, "Coming Soon" badge if applicable.
Used in: onboarding flow AND dashboard (to switch professions).

### 4b. Update onboarding (get-started)
**File**: `src/app/get-started/page.tsx`

Add a step before the first practice question: "What do you want to learn?"
Show ProfessionPicker. Selection sets `activeProfession` in both stores.
Demo questions change based on selected profession.

### 4c. Update dashboard
**File**: `src/app/(app)/page.tsx` (or wherever the home dashboard is)

Add a small profession indicator/switcher near the top. Clicking opens ProfessionPicker modal.
Course progress section shows the active profession's units.

### 4d. Update DesktopSideNav
Show active profession name/icon below the app logo.

---

## Step 5: Landing Page & Metadata

### 5a. Update LandingPage.tsx
- Hero: "Learn anything. Master everything." (generic, not ME-specific)
- Show profession cards instead of ME-specific topic list
- Demo questions cycle through professions
- Stats: "2 Professions | 1,700+ Questions | Free To Start"

### 5b. Update page metadata
All layout.tsx files that reference "Mechanical Engineering Interview Prep" → use APP_TAGLINE from constants (update constant to be generic).

### 5c. Update OG images
`opengraph-image.tsx` and `twitter-image.tsx` — generic tagline.

### 5d. Update constants.ts
```ts
APP_TAGLINE = 'Learn anything. Master everything.';
APP_DESCRIPTION = 'Gamified learning across professions...';
```

---

## File Change Summary

| Category | Files | New | Modified |
|----------|-------|-----|----------|
| Profession registry | 1 | `src/data/professions.ts` | — |
| Course restructure | ~15 | Finance meta + unit, load-unit router | course-meta.ts, existing unit imports |
| Hearts system | 3 | HeartDisplay, OutOfHeartsModal | useStore.ts, practice components |
| Profession picker UI | 2 | ProfessionPicker, ProfessionSwitcher | — |
| Store updates | 2 | — | useStore.ts, useCourseStore.ts |
| Onboarding | 1 | — | get-started/page.tsx |
| Landing page | 1 | — | LandingPage.tsx |
| Metadata/SEO | ~5 | — | layout files, OG images, constants.ts |
| API | 1 | — | api/content/course/route.ts |
| Pricing | 1 | — | pricing.ts |

---

## Execution Order

Steps 1–3 can be parallelized (data layer + hearts + content are independent).
Steps 4–5 depend on Step 1 (need profession concept to build UI).

**Parallel Track A**: Steps 1a-1f (profession data layer + store refactors)
**Parallel Track B**: Steps 2a-2e (hearts system)
**Parallel Track C**: Step 3a-3b (finance content creation)
**Sequential**: Steps 4-5 (after Track A completes)
