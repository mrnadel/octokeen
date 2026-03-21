# Content Feedback System — Design Spec

**Date:** 2026-03-21
**Status:** Draft

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
└── unique index on (userId, contentType, contentId)
```

The unique index ensures one flag per user per content item. On conflict, update the reason and timestamp (upsert).

### API Routes

**`POST /api/content-feedback`** — Submit or update a flag
- Auth required
- Body: `{ contentType, contentId, reason }`
- Upserts into `contentFeedback`
- Returns `{ ok: true }`

**`DELETE /api/content-feedback`** — Remove own flag (unflag)
- Auth required
- Body: `{ contentType, contentId }`
- Deletes the user's flag for that content item
- Returns `{ ok: true }`

**`GET /api/admin/content-feedback`** — Admin dashboard data
- Auth required (owner-only, hardcoded user ID check)
- Returns aggregated data: content items sorted by total flag count descending
- Each item includes: `contentId`, `contentType`, `totalFlags`, `reasons` breakdown (count per reason), `flagRate` (flags / total users who saw it — approximated from `topicProgress` or `sessionHistory`)

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
- Only accessible by the app owner (hardcoded ID or email check)
- Table columns: Content ID, Type, Question Text (first 80 chars), Total Flags, Reason Breakdown, Flag Rate
- Sortable by total flags (default) or flag rate
- Clicking a row expands to show full question text + explanation
- "Dismiss" button to mark an item as reviewed (adds a `dismissedAt` timestamp — doesn't delete flags, just hides from default view)
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

## Component Tree

```
FlagButton (new)
├── Props: contentType, contentId, questionText (for accessibility)
├── State: expanded (bool), flaggedReason (string | null), submitting (bool)
├── Fetches current flag status on mount (optional — can skip for perf, just fire-and-forget on submit)
└── Self-contained: handles its own API calls

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
    dismissedAt: timestamp('dismissed_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    uniqueIndex('content_feedback_user_content_idx').on(
      table.userId,
      table.contentType,
      table.contentId
    ),
  ]
);
```

## Files to Create/Modify

| File | Action | What |
|---|---|---|
| `src/lib/db/schema.ts` | Modify | Add `contentFeedback` table |
| `src/components/feedback/FlagButton.tsx` | Create | Flag button component |
| `src/components/feedback/FeedbackPanel.tsx` | Modify | Add `<FlagButton>` |
| `src/components/lesson/LessonView.tsx` | Modify | Add `<FlagButton>` in feedback bar |
| `src/app/api/content-feedback/route.ts` | Create | POST and DELETE endpoints |
| `src/app/api/admin/content-feedback/route.ts` | Create | GET endpoint for admin data |
| `src/app/(app)/admin/feedback/page.tsx` | Create | Admin feedback dashboard page |

## Out of Scope

- Free-text comments (too much friction, hard to aggregate)
- Positive ratings / thumbs-up (noise)
- Auto-hiding content based on flag threshold (too risky with small user base)
- Email/Slack notifications on new flags (over-engineering)
- Flag rate calculation based on actual impressions (would require impression tracking — approximate from existing progress data instead)
- Public display of flag counts to users
