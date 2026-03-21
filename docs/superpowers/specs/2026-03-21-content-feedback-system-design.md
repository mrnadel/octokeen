# Content Feedback System — Design Spec

**Date:** 2026-03-21
**Status:** Approved

## Problem

Content quality issues (wrong answers, confusing wording, mismatched difficulty) go undetected because users have no way to signal them. Content is static TypeScript — fixing issues requires knowing which content is broken.

## Solution

A minimal-friction flag button that lets users report bad content in one or two taps. Flags are stored in the database, aggregated, and surfaced on an admin page sorted by severity so the author can prioritize fixes.

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Positive signal? | No | Absence of flags = good. Users rarely give positive feedback; it's noise. |
| Interaction model | Flag icon + reason chips | One tap to open, one tap to pick reason. Two taps max. |
| Reason categories | 4 fixed chips | "Confusing", "Wrong/Incorrect", "Too Easy", "Too Hard". Covers 95% of issues. No free text — keeps it fast and aggregatable. |
| Duplicates | One flag per user per content item | Upsert: user can change their reason but can't spam. |
| Scope | Questions (practice + course) | Both `FeedbackPanel` (practice sessions) and `LessonView` (course lessons) show the flag button on the post-answer feedback screen. |
| Auto-hide | No | Too risky with small user base. Manual review only. |

## Architecture

### Database

One new table in the existing Drizzle schema:

```
contentFeedback
├── id              text, PK, UUID
├── userId          text, FK → users.id, cascade delete
├── contentType     text, NOT NULL          // 'question' | 'lesson-question'
├── contentId       text, NOT NULL          // e.g. 'em-001' or 'u1-l2-q3'
├── reason          text, NOT NULL          // 'confusing' | 'incorrect' | 'too-easy' | 'too-hard'
├── createdAt       timestamp, default now
├── updatedAt       timestamp, default now
└── unique index on (userId, contentType, contentId)

contentFeedbackDismissals
├── id              text, PK, UUID
├── contentType     text, NOT NULL
├── contentId       text, NOT NULL
├── dismissedAt     timestamp, default now
└── unique index on (contentType, contentId)
```

The unique index on `contentFeedback` ensures one flag per user per content item. On conflict, update the reason and `updatedAt` (upsert).

The `contentFeedbackDismissals` table tracks which content items have been reviewed by the admin. This is separate from individual flags — dismissing a content item does not delete flags. If new flags arrive after dismissal, the item re-surfaces (new flag `createdAt` > `dismissedAt`).

### TypeScript Types

Defined near the schema or in `src/data/types.ts`:

```typescript
type ContentFeedbackType = 'question' | 'lesson-question';
type FeedbackReason = 'confusing' | 'incorrect' | 'too-easy' | 'too-hard';

const VALID_CONTENT_TYPES: ContentFeedbackType[] = ['question', 'lesson-question'];
const VALID_REASONS: FeedbackReason[] = ['confusing', 'incorrect', 'too-easy', 'too-hard'];
```

### API Routes

**`POST /api/content-feedback`** — Submit or update a flag
- Auth required
- Body: `{ contentType, contentId, reason }`
- Validates `contentType` against `VALID_CONTENT_TYPES`, `reason` against `VALID_REASONS`, and `contentId` is a non-empty string (max 50 chars). Returns 400 on invalid values.
- Upserts into `contentFeedback` (on conflict: update `reason` and `updatedAt`)
- Returns `{ ok: true }`

**`DELETE /api/content-feedback`** — Remove own flag (unflag)
- Auth required
- Body: `{ contentType, contentId }`
- Deletes the user's flag for that content item
- Idempotent: returns `{ ok: true }` even if no matching flag exists

**`GET /api/content-feedback?userId=X`** — Get user's flags (for client-side cache)
- Auth required (userId must match session user)
- Returns all flags for the user:

```typescript
interface UserFlagItem {
  contentType: ContentFeedbackType;
  contentId: string;
  reason: FeedbackReason;
}
// Response: { flags: UserFlagItem[] }
```

- Called once at app load, cached in Zustand store

**`GET /api/admin/content-feedback`** — Admin dashboard data
- Auth required (owner-only, hardcoded user ID check)
- Aggregates flags by `(contentType, contentId)`, sorted by total flag count descending
- Joins with static question data (imported from `/src/data/questions/` and `/src/data/course/`) to include question text
- Each item includes: `contentId`, `contentType`, `questionText` (first 80 chars), `totalFlags`, `reasons` breakdown (count per reason)
- Response type:

```typescript
interface FlaggedContentItem {
  contentId: string;
  contentType: ContentFeedbackType;
  questionText: string;
  totalFlags: number;
  reasons: Record<FeedbackReason, number>;
  dismissedAt: string | null;
}
```

**`GET /api/admin/content-feedback`** accepts optional `?includeDismissed=true` query param (default: false). When false, items whose `dismissedAt` is more recent than all their flags' `createdAt` are excluded.

**`POST /api/admin/content-feedback/dismiss`** — Dismiss a flagged item
- Auth required (owner-only)
- Body: `{ contentType, contentId }`
- Upserts into `contentFeedbackDismissals`
- Returns `{ ok: true }`

### UI Components

**`FlagButton` component** — small, unobtrusive
- **Placement:** Bottom-right corner of the feedback/explanation area, after the user answers a question
- **Default state:** Small flag icon (outline) with no label. Muted gray color (`#AFAFAF`). Does not compete with the "Continue" button.
- **Tapped state:** Expands inline to show 4 reason chips: `Confusing`, `Incorrect`, `Too Easy`, `Too Hard`. Tapping a chip submits the flag, shows a brief checkmark confirmation, then collapses.
- **Already flagged state:** Flag icon is filled/colored (red-ish). Tapping again shows "Remove flag?" option.
- **Animations:** Chip expansion uses Framer Motion (already in project). Keep it snappy — 200ms spring.

**Integration points:**

1. **`FeedbackPanel.tsx`** (practice sessions) — Add `<FlagButton>` below the explanation sections, above the "Continue" button.
2. **`LessonView.tsx`** (course lessons) — Add `<FlagButton>` in the post-answer feedback bar (the green/red bottom section), next to the explanation text.

**`/admin/feedback` page** — Simple table view
- Placed at `src/app/admin/feedback/page.tsx` — outside the `(app)` route group to avoid the 480px max-width constraint. Has its own auth check (owner-only).
- Table columns: Content ID, Type, Question Text (first 80 chars), Total Flags, Reason Breakdown
- Sorted by total flags (default)
- Clicking a row expands to show full question text + explanation
- "Dismiss" button to mark an item as reviewed (inserts into `contentFeedbackDismissals` — doesn't delete flags, just hides from default view). Items re-surface if new flags arrive after dismissal.
- Toggle to show/hide dismissed items

### Data Flow

```
User answers question
        ↓
Feedback screen appears (explanation, insights, etc.)
        ↓
User sees small flag icon (bottom-right)
        ↓
Tap flag → 4 reason chips expand inline
        ↓
Tap reason → POST /api/content-feedback → DB upsert
        ↓
Brief checkmark animation → chips collapse
        ↓
User continues normally (no interruption to flow)
```

### Admin Review Flow

```
Owner visits /admin/feedback
        ↓
Sees content sorted by flag count
        ↓
Reviews flagged content → edits TypeScript source files manually
        ↓
Marks item as dismissed
        ↓
Deploys updated content
```

### Zustand Store Integration

Flags are cached client-side in a new `useFeedbackStore.ts` (separate from the main `useStore` to keep concerns isolated). Store shape:

```typescript
interface FeedbackStore {
  flags: Map<string, FeedbackReason>; // key: `${contentType}:${contentId}`
  setFlag: (contentType: ContentFeedbackType, contentId: string, reason: FeedbackReason) => void;
  removeFlag: (contentType: ContentFeedbackType, contentId: string) => void;
  getFlag: (contentType: ContentFeedbackType, contentId: string) => FeedbackReason | null;
  hydrateFlags: (flags: UserFlagItem[]) => void;
}
```

The initial fetch is added to the existing `useDbSync` hook's `Promise.all` call (alongside progress and course-progress fetches). This ensures flags are available before any question is rendered.

### Admin Question Text Lookup

The admin API route imports static data to resolve question text:
- If `contentType === 'question'`: look up in `allQuestions` from `/src/data/questions/index.ts` by matching `question.id === contentId`
- If `contentType === 'lesson-question'`: iterate `course` from `/src/data/course/index.ts`, flatten all unit > lesson > questions, match by `question.id === contentId`

Both return `question.question` (the question text field), truncated to 80 chars for the table view.

## Component Tree

```
FlagButton (new)
├── Props: contentType (ContentFeedbackType), contentId (string)
├── State: expanded (bool), submitting (bool)
├── Reads flagged status from Zustand store (flags cached at app load via GET /api/content-feedback)
├── On submit: POST to API + update Zustand store (optimistic)
└── Self-contained: handles its own API calls, aria-label derived from contentId

FeedbackPanel (modified)
├── ...existing sections...
├── <FlagButton contentType="question" contentId={question.id} />
└── Continue button

LessonView feedback bar (modified)
├── ...existing correct/incorrect display...
├── <FlagButton contentType="lesson-question" contentId={currentQuestion.id} />
└── Continue button
```

## Schema Addition

Added to `src/lib/db/schema.ts`:

```typescript
export const contentFeedback = pgTable(
  'content_feedback',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    contentType: text('content_type').notNull(),
    contentId: text('content_id').notNull(),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    uniqueIndex('content_feedback_user_content_idx').on(
      table.userId,
      table.contentType,
      table.contentId
    ),
  ]
);

export const contentFeedbackDismissals = pgTable(
  'content_feedback_dismissals',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    contentType: text('content_type').notNull(),
    contentId: text('content_id').notNull(),
    dismissedAt: timestamp('dismissed_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    uniqueIndex('content_feedback_dismissal_idx').on(
      table.contentType,
      table.contentId
    ),
  ]
);
```

After adding the schema, run `npx drizzle-kit push` to apply the migration.

## Files to Create/Modify

| File | Action | What |
|---|---|---|
| `src/lib/db/schema.ts` | Modify | Add `contentFeedback` table |
| `src/components/feedback/FlagButton.tsx` | Create | Flag button component |
| `src/components/feedback/FeedbackPanel.tsx` | Modify | Add `<FlagButton>` |
| `src/components/lesson/LessonView.tsx` | Modify | Add `<FlagButton>` in feedback bar |
| `src/store/useFeedbackStore.ts` | Create | Zustand store for cached flags |
| `src/hooks/useDbSync.ts` | Modify | Add feedback fetch to hydration |
| `src/app/api/content-feedback/route.ts` | Create | POST, DELETE, and GET endpoints |
| `src/app/api/admin/content-feedback/route.ts` | Create | GET endpoint for admin data |
| `src/app/api/admin/content-feedback/dismiss/route.ts` | Create | POST endpoint for dismissing items |
| `src/app/admin/feedback/page.tsx` | Create | Admin feedback dashboard page (outside `(app)` group) |

## Out of Scope

- Free-text comments (too much friction, hard to aggregate)
- Positive ratings / thumbs-up (noise)
- Auto-hiding content based on flag threshold (too risky with small user base)
- Email/Slack notifications on new flags (over-engineering)
- Flag rate calculation (would require per-question impression tracking — total flag count is sufficient for a small user base)
- Public display of flag counts to users
- Rate limiting on feedback endpoints (upsert prevents duplicates; not worth the complexity at current scale)
