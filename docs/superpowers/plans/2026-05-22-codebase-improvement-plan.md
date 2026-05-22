# Octokeen Codebase Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematically address all rule violations and ship queued feature improvements across security, code quality, content, and UI.

**Architecture:** Fix-first (Phases 1–3), then feature (Phase 4). Each phase is independently shippable. Parallel streams within a phase can execute concurrently.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS 4, Drizzle ORM + PostgreSQL, NextAuth v5, Zustand 5, Vitest, Zod 4

---

## Phase 1 — Security & Quick Compliance

*All items here are small, high-priority, and independently shippable.*

---

### Task 1-A: Fix Auth on Invite Set-Cookie Route

**Files:**
- Modify: `src/app/api/invite/set-cookie/route.ts`

- [ ] **Step 1: Read the current route**

Read `src/app/api/invite/set-cookie/route.ts` to understand the handler.

- [ ] **Step 2: Add auth check**

Add `getAuthUserId()` as the first operation in the POST handler, before any DB query. Pattern matches other protected routes:

```typescript
import { getAuthUserId } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // ... rest of handler
}
```

- [ ] **Step 3: Verify invite flow still works**

Test the invite flow end-to-end: generate an invite code → share → new user visits → cookie is set.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/invite/set-cookie/route.ts
git commit -m "fix: require auth on invite set-cookie route"
```

---

### Task 1-B: Fix Double Dashes in User-Facing Copy

**Files:**
- Modify: `src/data/course/course-meta.ts` (9 instances)
- Modify: `src/data/course/professions/personal-finance/CURRICULUM-RESEARCH.md` (40 instances)

- [ ] **Step 1: Fix course-meta.ts**

Search for all ` -- ` in `src/data/course/course-meta.ts` and replace with em-dash `—` or a period + new sentence. Run:

```bash
grep -n " -- " src/data/course/course-meta.ts
```

For each hit, replace ` -- ` with ` — ` (em-dash with spaces) or rewrite the sentence.

- [ ] **Step 2: Fix CURRICULUM-RESEARCH.md**

```bash
sed -i 's/ -- / — /g' "src/data/course/professions/personal-finance/CURRICULUM-RESEARCH.md"
```

Review the file to ensure replacements read naturally.

- [ ] **Step 3: Verify no regressions**

```bash
grep -r " -- " src/data/course/course-meta.ts src/data/course/professions/personal-finance/CURRICULUM-RESEARCH.md
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/data/course/course-meta.ts "src/data/course/professions/personal-finance/CURRICULUM-RESEARCH.md"
git commit -m "fix: replace double dashes with em-dashes in user-facing copy"
```

---

### Task 1-C: Fix TypeScript `as any` in Stores

**Files:**
- Modify: `src/store/useStore.ts:203`
- Modify: `src/store/useCourseStore.ts` (lines 1285, 1288, 1373, 1375–1377)

- [ ] **Step 1: Fix useStore.ts:203**

Read `src/store/useStore.ts` lines 195–215. The `pool as any` cast means the function parameter type doesn't match. Either:
- Update `selectSmartPracticeQuestions` to accept `pool`'s actual type, or
- Narrow `pool` with a type guard before passing

Replace `pool as any` with properly typed code.

- [ ] **Step 2: Fix useCourseStore.ts migration logic**

Read `src/store/useCourseStore.ts` lines 1280–1295 and 1370–1380. The `as any` casts are in state migration code reading old persisted state. Replace with explicit type guards:

```typescript
// Instead of: (lp as any).passed ?? (lp.attempts > 0)
// Use:
const legacyLp = lp as Record<string, unknown>;
const passed = typeof legacyLp.passed === 'boolean' ? legacyLp.passed : (lp.attempts > 0);
```

Apply the same pattern to `correctQuestionIds`, `activeDays`, `courseIntros`, `placementUnitIndex`, `viewedStoryUnlocks`.

- [ ] **Step 3: Verify TypeScript passes**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/store/useStore.ts src/store/useCourseStore.ts
git commit -m "fix: remove unsafe 'as any' casts from store migration logic"
```

---

### Task 1-D: Replace Console Calls with Structured Logging

**Files:**
- Modify: `src/app/api/course-progress/route.ts`
- Modify: `src/app/api/admin/content-overview/route.ts`
- Modify: `src/app/api/paddle/webhook/route.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/api/cron/league-finalize/route.ts`
- Modify: `src/app/api/paddle/checkout/route.ts`
- Modify: `src/app/api/admin/grant-pro/route.ts`
- Modify: `src/app/api/paddle/portal/route.ts`
- Modify: `src/lib/auth.ts`
- Modify: `src/lib/activity-feed.ts`
- Modify: `src/lib/account-cleanup.ts`
- Modify: `src/lib/email.ts` (line 24, 31 — unguarded)
- Modify: `src/lib/env.ts` (line 117)
- Modify: `src/lib/auth-utils.ts` (line 28)

- [ ] **Step 1: Check if a server logger utility exists**

```bash
grep -r "createLogger\|serverLogger\|logger\." src/lib/ --include="*.ts" -l
```

If one exists, use it. If not, create `src/lib/logger.ts`:

```typescript
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  error: (msg: string, ...args: unknown[]) => isDev && console.error(msg, ...args),
  warn: (msg: string, ...args: unknown[]) => isDev && console.warn(msg, ...args),
  log: (msg: string, ...args: unknown[]) => isDev && console.log(msg, ...args),
};
```

- [ ] **Step 2: Replace console calls in API routes**

For each file listed, replace unguarded `console.error/warn/log` calls with `logger.error/warn/log` from the utility above. Example:

```typescript
// Before:
console.error('Registration error:', error);

// After:
import { logger } from '@/lib/logger';
logger.error('Registration error:', error);
```

- [ ] **Step 3: Fix email.ts and env.ts unguarded warnings**

Lines 24 and 31 in `src/lib/email.ts` should use `logger.warn` and `logger.error`.
Line 117 in `src/lib/env.ts` should use `logger.warn`.
Line 28 in `src/lib/auth-utils.ts` should use `logger.warn`.

- [ ] **Step 4: Verify no unguarded console calls remain in server code**

```bash
grep -r "console\." src/app/api src/lib --include="*.ts" | grep -v "process.env.NODE_ENV"
```

Expected: only guarded calls remain (if any).

- [ ] **Step 5: Run tests**

```bash
npm test
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/logger.ts src/app/api src/lib
git commit -m "fix: replace unguarded console calls with dev-only logger in server code"
```

---

## Phase 2 — API Hardening

---

### Task 2-A: Add Zod Validation to 29 API Routes

**Files:** (29 routes — see full list below)

- [ ] **Step 1: Create shared validation schemas**

Create `src/lib/api-schemas.ts` for schemas used across multiple routes:

```typescript
import { z } from 'zod';

export const emailSchema = z.string().email();
export const userIdSchema = z.string().uuid();
export const confirmationSchema = z.object({ confirmation: z.string() });
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});
```

- [ ] **Step 2: Add Zod to friend request routes**

`src/app/api/friends/request/route.ts` — add:

```typescript
const schema = z.object({ receiverId: z.string().uuid() });
const result = schema.safeParse(await req.json());
if (!result.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
const { receiverId } = result.data;
```

`src/app/api/friends/request/[id]/route.ts` — add:

```typescript
const schema = z.object({ action: z.enum(['accept', 'decline']) });
```

- [ ] **Step 3: Add Zod to admin content routes**

For each of these 6 routes, add a Zod schema matching the fields extracted:
- `src/app/api/admin/content/units/route.ts`
- `src/app/api/admin/content/units/[id]/route.ts`
- `src/app/api/admin/content/lessons/route.ts`
- `src/app/api/admin/content/lessons/[id]/route.ts`
- `src/app/api/admin/content/course-questions/route.ts`
- `src/app/api/admin/content/course-questions/[id]/route.ts`

Read each file, identify the fields extracted from the request body, and wrap in a Zod schema with `safeParse`.

- [ ] **Step 4: Add Zod to remaining high-priority routes**

Routes requiring Zod validation (prioritize by risk):
1. `src/app/api/user/profile/route.ts` — validate displayName (max 50 chars), country (string), profilePublic (boolean), image (url)
2. `src/app/api/user/delete-account/route.ts` — validate `{ confirmation: z.literal('DELETE') }`
3. `src/app/api/user/reset-progress/route.ts` — validate `{ confirmation: z.literal('RESET') }`
4. `src/app/api/mastery/route.ts` — validate events array with `z.array(...).max(200)`
5. `src/app/api/league/route.ts` (POST + PATCH)
6. `src/app/api/content-feedback/route.ts` (POST + DELETE)
7. `src/app/api/waitlist/route.ts`
8. `src/app/api/push/subscribe/route.ts`
9. `src/app/api/push/unsubscribe/route.ts`
10. `src/app/api/auth/forgot-password/route.ts`
11. `src/app/api/feature-flags/route.ts`
12. `src/app/api/admin/users/route.ts` (PATCH + DELETE)
13. `src/app/api/admin/course-access/route.ts`
14. `src/app/api/admin/content-feedback/dismiss/route.ts`
15. `src/app/api/friends/activity/route.ts`

- [ ] **Step 5: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api src/lib/api-schemas.ts
git commit -m "fix: add Zod validation to all API routes missing schema validation"
```

---

### Task 2-B: Add Rate Limiting to 10 Missing Endpoints

**Files:**
- Modify: `src/app/api/paddle/webhook/route.ts`
- Modify: `src/app/api/progress/route.ts`
- Modify: `src/app/api/engagement/route.ts`
- Modify: `src/app/api/mastery/route.ts`
- Modify: `src/app/api/user/profile/route.ts`
- Modify: `src/app/api/user/delete-account/route.ts`
- Modify: `src/app/api/user/reset-progress/route.ts`
- Modify: `src/app/api/friends/request/[id]/route.ts`
- Modify: `src/app/api/push/subscribe/route.ts`
- Modify: `src/app/api/push/unsubscribe/route.ts`

- [ ] **Step 1: Read the rate limiting utility**

```bash
grep -r "rateLimit\|RATE_LIMITS\|applyRateLimit" src/lib/ --include="*.ts" -l
```

Read the rate limiting utility to understand the API pattern (likely `src/lib/rate-limit.ts`).

- [ ] **Step 2: Add rate limiting to webhook**

Paddle webhooks are signature-verified, so use IP-based limit at 100/min:

```typescript
const limit = await rateLimit({ identifier: req.ip ?? 'unknown', max: 100, window: '1m' });
if (!limit.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

- [ ] **Step 3: Add per-user rate limits to progress, engagement, mastery**

These are authenticated endpoints, use user ID:

```typescript
const userId = await getAuthUserId();
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const limit = await rateLimit({ identifier: userId, max: 10, window: '1m' });
if (!limit.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

- [ ] **Step 4: Add strict rate limits to destructive endpoints**

`delete-account` and `reset-progress` — 1 per hour:

```typescript
const limit = await rateLimit({ identifier: userId, max: 1, window: '1h' });
```

- [ ] **Step 5: Add rate limit to profile PATCH and friend request PATCH**

Profile: 10/min. Friend request: 30/min.

- [ ] **Step 6: Verify push endpoints**

Read `src/app/api/push/subscribe/route.ts` and `unsubscribe/route.ts`. Add per-user rate limits.

- [ ] **Step 7: Run tests**

```bash
npm test
```

- [ ] **Step 8: Commit**

```bash
git add src/app/api
git commit -m "fix: add rate limiting to all unprotected write endpoints"
```

---

## Phase 3 — Code Quality

---

### Task 3-A: Replace Inline Spinners and Errors with Reusable Components

**Files:**
- Modify: `src/components/engagement/CourseCompleteCelebration.tsx:114`
- Modify: `src/components/profile/ProfileView.tsx:136,168`
- Modify: `src/components/ui/ShareButton.tsx:65`
- Modify: `src/components/course/OnboardingPlacementTest.tsx:219`
- Modify: `src/components/friends/UserSearch.tsx:93`
- Modify: `src/components/friends/FriendRequestCard.tsx:127`
- Modify: `src/components/ui/UpgradeModal.tsx:60`
- Modify: `src/components/session/SessionView.tsx:60-68`
- Modify: `src/components/course/CourseMap.tsx:654-658`

- [ ] **Step 1: Read LoadingSpinner component**

Read `src/components/ui/LoadingSpinner.tsx` to understand the props (size, card, etc.).

- [ ] **Step 2: Replace inline Loader2 spinners**

For each of the 8 files with inline `<Loader2 className="... animate-spin" />`, replace with `<LoadingSpinner size={N} card={false} />` where N matches the original icon size (w-4 → size=16, w-6 → size=24, etc.).

Pattern to find:
```tsx
// Before:
<Loader2 className="w-4 h-4 animate-spin" />

// After:
<LoadingSpinner size={16} card={false} />
```

- [ ] **Step 3: Replace custom SessionView spinner**

Read `src/components/session/SessionView.tsx:60-68`. Replace the custom spinner div with `<LoadingSpinner card={false} />`.

- [ ] **Step 4: Read ErrorRetry component**

Read `src/components/ui/ErrorRetry.tsx` to understand props.

- [ ] **Step 5: Replace inline error in CourseMap**

Read `src/components/course/CourseMap.tsx:650-665`. Replace the inline error message with:

```tsx
<ErrorRetry
  title="Content load failed"
  subtitle="Please refresh and try again"
  onRetry={dismissContentLoadError}
  card={false}
/>
```

- [ ] **Step 6: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "refactor: replace inline spinners/errors with LoadingSpinner and ErrorRetry components"
```

---

### Task 3-B: Add Error Boundaries to Lazy-Loaded Components

**Files:**
- Modify: `src/app/(app)/page.tsx`
- Modify: `src/app/admin/content/page.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/reset-password/page.tsx`
- Modify: `src/app/(auth)/verify-email/page.tsx`

- [ ] **Step 1: Read existing ErrorBoundary component**

```bash
grep -r "class ErrorBoundary\|function ErrorBoundary" src/ --include="*.tsx" -l
```

Read the ErrorBoundary component to understand usage.

- [ ] **Step 2: Wrap home page lazy groups**

Read `src/app/(app)/page.tsx` and identify the Suspense groups:
1. Celebration overlays (WelcomeBack, DailyRewardClaimModal, LeagueWinner, etc.)
2. Lesson flow (LessonView, ResultScreen, etc.)
3. Course intro (CourseIntroFlow, OnboardingPlacementTest)

Wrap each group:
```tsx
<ErrorBoundary fallback={null}>
  <Suspense fallback={null}>
    <WelcomeBack />
    {/* ... */}
  </Suspense>
</ErrorBoundary>
```

- [ ] **Step 3: Add error boundary to admin CourseEditor**

Read `src/app/admin/content/page.tsx`. Wrap the lazy `CourseEditor` in an ErrorBoundary with admin-friendly message.

- [ ] **Step 4: Add error boundary to auth pages**

For login, reset-password, verify-email — wrap the `<Suspense>` with ErrorBoundary:

```tsx
<ErrorBoundary fallback={<div className="h-6" />}>
  <Suspense fallback={<div className="h-6" />}>
    <SearchParamsConsumer />
  </Suspense>
</ErrorBoundary>
```

- [ ] **Step 5: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/app
git commit -m "fix: add error boundaries around all lazy-loaded component groups"
```

---

### Task 3-C: Add Missing Entries to Modal Gallery

**Files:**
- Modify: `modal-gallery.html`

Missing entries (16 total):
1. `BlueprintCelebration` — unit completion celebration
2. `StreakContinued` — streak continuation modal
3. `StreakFreeze` — streak freeze banner + repair modal
4. `StreakMilestone` — streak milestone celebration
5. `LeagueWinner` — league winner modal
6. `WelcomeBack` — comeback welcome modal
7. `ProfessionPickerModal` — profession switcher modal
8. `ActiveEventBanner` — XP event floating banner
9. `DailyLimitBanner` — daily limit banner for free users
10. `EmailVerificationBanner` — email verification reminder
11. `OfflineBanner` — offline status banner
12. `OutOfHeartsModal` — out of hearts modal
13. `TrialPromptModal` — trial/upgrade prompt
14. `UpgradeModal` — pro upgrade modal
15. `ToastNotification` — generic toast system
16. `GlossaryPopover` — glossary term popover
17. `CookieConsent` — cookie consent banner

- [ ] **Step 1: Read modal-gallery.html**

Read `modal-gallery.html` to understand the existing entry format.

- [ ] **Step 2: Read each missing component**

For each of the 17 missing components, read the source file to capture: trigger, visual style (background color, FX), key elements, component file path.

- [ ] **Step 3: Add entries to the gallery**

For each component, add a `<div class="entry">` block following the existing pattern. Include:
- `<h2>` display name
- `<div class="tags">` with component name, type (modal/banner/toast/popover), and any Gap labels
- `<div class="preview">` with 2–3 sentence description covering trigger, visual style, and component path

- [ ] **Step 4: Add new "Toast & Notifications" section**

Create a new section for toast system components (ToastNotification, adaptive toasts, micro-celebrations, StoreToastBridge).

- [ ] **Step 5: Verify all paths are correct**

```bash
grep -o 'src/components/[^.]*\.tsx' modal-gallery.html | while read f; do
  if [ ! -f "$f" ]; then echo "MISSING: $f"; fi
done
```

- [ ] **Step 6: Commit**

```bash
git add modal-gallery.html
git commit -m "docs: add 17 missing modal/overlay/toast entries to modal gallery"
```

---

### Task 3-D: Add Critical Path Integration Tests

**Files:**
- Create: `src/__tests__/api/paddle-webhook.integration.test.ts`
- Create: `src/__tests__/api/auth-register.integration.test.ts`
- Create: `src/__tests__/api/progress-sync.integration.test.ts`
- Create: `src/__tests__/api/engagement-sync.integration.test.ts`

- [ ] **Step 1: Check existing test setup**

Read `vitest.config.ts` and an existing test in `src/__tests__/` to understand the test patterns used.

- [ ] **Step 2: Create test helper**

Create `src/__tests__/helpers/api-test-utils.ts` with helpers for mocking auth, DB, and Paddle:

```typescript
import { vi } from 'vitest';

export function mockAuthUser(userId: string) {
  vi.mock('@/lib/auth-utils', () => ({
    getAuthUserId: vi.fn().mockResolvedValue(userId),
  }));
}

export function mockDatabase() {
  // Mock the db module with vi.mock
}
```

- [ ] **Step 3: Write Paddle webhook test**

```typescript
// src/__tests__/api/paddle-webhook.integration.test.ts
import { describe, it, expect, vi } from 'vitest';

describe('POST /api/paddle/webhook', () => {
  it('rejects requests without valid Paddle signature', async () => {
    // ...
  });

  it('processes subscription_created event and updates user tier', async () => {
    // ...
  });

  it('processes subscription_canceled event and downgrades user', async () => {
    // ...
  });

  it('handles duplicate webhook delivery idempotently', async () => {
    // ...
  });
});
```

- [ ] **Step 4: Run test to verify it fails with expected reason**

```bash
npx vitest run src/__tests__/api/paddle-webhook.integration.test.ts
```

- [ ] **Step 5: Implement minimal passing code for the tests**

Fill in the test bodies with mocks and assertions, then run to verify they pass.

- [ ] **Step 6: Repeat for auth registration test**

```typescript
// src/__tests__/api/auth-register.integration.test.ts
describe('POST /api/auth/register', () => {
  it('rejects duplicate email', async () => { /* ... */ });
  it('hashes password before storing', async () => { /* ... */ });
  it('enforces rate limiting (max 5 per minute)', async () => { /* ... */ });
  it('creates user and sends verification email', async () => { /* ... */ });
});
```

- [ ] **Step 7: Repeat for progress sync test**

```typescript
// src/__tests__/api/progress-sync.integration.test.ts
describe('GET/POST /api/progress', () => {
  it('returns 401 without auth', async () => { /* ... */ });
  it('POST saves session and updates progress', async () => { /* ... */ });
  it('GET returns user progress for the correct profession', async () => { /* ... */ });
});
```

- [ ] **Step 8: Repeat for engagement sync test**

```typescript
// src/__tests__/api/engagement-sync.integration.test.ts
describe('POST /api/engagement', () => {
  it('returns 401 without auth', async () => { /* ... */ });
  it('recharges hearts based on elapsed time', async () => { /* ... */ });
  it('deducts correct gem count for shop purchases', async () => { /* ... */ });
});
```

- [ ] **Step 9: Run full test suite**

```bash
npm test
```

Expected: all new tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/__tests__/api/
git commit -m "test: add integration tests for all critical API paths"
```

---

### Task 3-E: Optimize Images

**Files:**
- Create: `scripts/optimize-images.ts`
- Modify: `package.json`

- [ ] **Step 1: Verify sharp is in devDependencies**

```bash
cat package.json | grep sharp
```

Expected: `"sharp": "^0.34.5"` in devDependencies.

- [ ] **Step 2: Create optimization script**

Create `scripts/optimize-images.ts`:

```typescript
import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const PNG_DIRS = ['public/characters', 'public/mascot', 'public/badges', 'public/quest-icons', 'public/effects'];
const QUALITY = 75;

async function optimizePng(filePath: string) {
  const stats = await fs.stat(filePath);
  const originalSize = stats.size;

  const buffer = await sharp(filePath)
    .png({ quality: QUALITY, compressionLevel: 9, palette: true })
    .toBuffer();

  if (buffer.length < originalSize) {
    await fs.writeFile(filePath, buffer);
    const savings = Math.round((1 - buffer.length / originalSize) * 100);
    console.log(`✓ ${path.basename(filePath)}: ${Math.round(originalSize / 1024)}KB → ${Math.round(buffer.length / 1024)}KB (-${savings}%)`);
  }
}

async function main() {
  for (const dir of PNG_DIRS) {
    const files = await glob(`${dir}/**/*.png`);
    await Promise.all(files.map(optimizePng));
  }
  console.log('Image optimization complete.');
}

main().catch(console.error);
```

- [ ] **Step 3: Add npm script**

In `package.json`, add to the `scripts` object:

```json
"optimize-images": "tsx scripts/optimize-images.ts"
```

- [ ] **Step 4: Run optimization on the 41 largest files**

```bash
npm run optimize-images
```

Review output — verify no quality degradation on character/mascot images.

- [ ] **Step 5: Verify images load correctly**

Start dev server and visually verify characters and badges look correct.

- [ ] **Step 6: Commit**

```bash
git add scripts/optimize-images.ts package.json public/
git commit -m "perf: add image optimization script and compress 230+ PNG assets"
```

---

### Task 3-F: Fix Teaching Card Walls of Text

**Files:**
- Modify: `src/data/course/professions/personal-finance/units/unit-8.ts:37`
- Modify: `src/data/course/professions/psychology/units/section-6-biases-part1.ts:1257-1259`
- Modify: `src/data/course/professions/personal-finance/units/section-8-investing-part1.ts:902`

Rule: Each teaching card's main `explanation` field must be 1 sentence maximum (≤140 characters). Long explanations must be split into multiple cards or moved to a `detailText` field (if available).

- [ ] **Step 1: Audit all teaching cards with long explanations**

```bash
grep -n '"explanation"' src/data/course/**/*.ts | awk -F'"' '{if(length($4) > 140) print NR": "length($4)" chars — "$0}'
```

*(Run from project root; adjust glob if needed.)*

- [ ] **Step 2: Fix known violations**

**Violation 1** — `unit-8.ts:37` "Why People Care About Crypto":
Read the file and shorten the explanation to one punchy sentence. Move remaining detail to a `detailText` field or split into multiple teaching cards.

**Violation 2** — `section-6-biases-part1.ts:1257-1259` "Confirmation bias has 3 parts":
Split the 4-sentence explanation into 4 cards:
- Card 1: "Confirmation bias means you favor information that supports what you already believe."
- Card 2: "Selective searching: you look for confirming evidence instead of disconfirming."
- Card 3: "Selective interpretation: ambiguous data gets read as supporting your view."
- Card 4: "Selective memory: you remember confirming facts better than contradicting ones."

**Violation 3** — `section-8-investing-part1.ts:902` compound interest:
Shorten to: "Someone who starts investing in their 20s often ends up with more money than someone who waits until their 30s — even if they invest for fewer years."

- [ ] **Step 3: Re-run seed script**

```bash
npx tsx scripts/seed-content.ts
```

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/data/course/
git commit -m "content: split long teaching card explanations into single-sentence format"
```

---

## Phase 4 — Features

*(Requires Phase 1–3 foundations)*

---

### Task 4-A: Content Import Path Consolidation

**Phase:** 4
**Parallel Stream:** CONTENT-C
**Effort:** 4 hours
**Prereqs:** none

**Overview:** Unify 4 inconsistent patterns for accessing course content into a single `src/data/course/api.ts` entry point. Fixes: dual lesson-lookup APIs, heavy synchronous import, missing profession awareness.

**Files:**
- Create: `src/data/course/api.ts`
- Modify: `src/app/api/admin/content-feedback/route.ts`
- Modify: `src/app/api/course-progress/route.ts`
- Modify: `src/store/useCourseStore.ts`
- Modify: `src/app/api/content/course/route.ts`
- Modify: `src/app/api/admin/content-overview/route.ts`

- [ ] **Step 1: Create the unified API module**

Create `src/data/course/api.ts` with these exports:

```typescript
// Lightweight metadata (sync, safe anywhere)
export { getCourseMetaForProfession, getLessonByIdMeta, getTotalLessonsMeta } from './course-meta';

// Full content (async, profession-aware)
export async function getCourseData(professionId: string, options?: { unitIndices?: number[] }): Promise<Unit[]>
export async function getUnitData(unitIndex: number, professionId: string): Promise<Unit>
export async function getLessonData(lessonId: string, professionId: string): Promise<Lesson>

// Legacy ME support (deprecated)
/** @deprecated Use getCourseData('mechanical-engineering') */
export async function getLegacyMECourse(): Promise<Unit[]>
```

Implement `getCourseData` using `loadUnitData` internally.

- [ ] **Step 2: Write failing test**

```typescript
// src/__tests__/data/course-api.test.ts
it('getCourseData returns all units for a profession', async () => {
  const units = await getCourseData('mechanical-engineering');
  expect(units.length).toBeGreaterThan(0);
  expect(units[0].lessons).toBeDefined();
});
```

Run: `npx vitest run src/__tests__/data/course-api.test.ts`
Expected: FAIL (function not implemented)

- [ ] **Step 3: Implement getCourseData**

```typescript
export async function getCourseData(professionId: string, options?: { unitIndices?: number[] }): Promise<Unit[]> {
  const meta = getCourseMetaForProfession(professionId);
  const indices = options?.unitIndices ?? meta.map((_, i) => i);
  return Promise.all(indices.map(i => loadUnitData(i, professionId)));
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npx vitest run src/__tests__/data/course-api.test.ts
```

- [ ] **Step 5: Migrate content-feedback route**

Update `src/app/api/admin/content-feedback/route.ts` to use `getCourseData(professionId)` instead of `import { course } from '@/data/course'`.

- [ ] **Step 6: Migrate course-progress route**

Update `src/app/api/course-progress/route.ts` — replace `getLessonById` with `getLessonByIdMeta`.

- [ ] **Step 7: Update store and remaining consumers**

Replace `loadUnitData` calls in `useCourseStore.ts` with `getUnitData` from the new api.ts.
Replace `loadUnitData` calls in other API routes and components.

- [ ] **Step 8: Verify zero direct imports from @/data/course outside data/ folder**

```bash
grep -r "from '@/data/course'" src/ --include="*.ts" --include="*.tsx" | grep -v "src/data/"
```

Expected: 0 results.

- [ ] **Step 9: Run full test suite**

```bash
npm test
```

- [ ] **Step 10: Commit**

```bash
git add src/data/course/api.ts src/app/api src/store/useCourseStore.ts
git commit -m "refactor: unify course content access through src/data/course/api.ts"
```

---

### Task 4-B: Admin Game Balance Panel

**Phase:** 4
**Parallel Stream:** UI-E
**Effort:** 2 days
**Prereqs:** none (can run alongside other Phase 4 work)

**Overview:** Create an admin UI panel to view and modify game balance parameters (XP multipliers, heart settings, gem shop prices, quest targets) without code deployment. Backed by a new `game_config` database table with audit history.

**Files:**
- Create: `src/lib/db/migrations/0XXX_game_config.sql`
- Modify: `src/lib/db/schema.ts`
- Create: `src/app/api/admin/game-config/route.ts`
- Create: `src/app/api/admin/game-config/[key]/route.ts`
- Create: `src/app/api/admin/game-config/batch/route.ts`
- Create: `src/app/api/admin/game-config/history/route.ts`
- Create: `src/app/admin/game-balance/page.tsx`
- Modify: `src/app/admin/layout.tsx` (add nav link)

- [ ] **Step 1: Write failing test for game config DB schema**

```typescript
// src/__tests__/api/admin-game-config.test.ts
it('GET /api/admin/game-config returns all configs', async () => {
  // Mock DB, mock admin auth
  // Expect 200 with array of configs
});
```

Run and verify it fails.

- [ ] **Step 2: Create database migration**

Add to `src/lib/db/schema.ts`:

```typescript
export const gameConfig = pgTable('game_config', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  category: text('category').notNull(), // 'xp' | 'hearts' | 'shop_prices' | 'quests' | 'adaptive'
  key: text('key').notNull(),
  value: jsonb('value').notNull(),
  description: text('description'),
  minValue: real('min_value'),
  maxValue: real('max_value'),
  isLocked: boolean('is_locked').default(false).notNull(),
  lastModifiedBy: text('last_modified_by'),
  lastModifiedAt: timestamp('last_modified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniqueKey: unique().on(t.category, t.key),
}));
```

Run: `npx drizzle-kit push`
Expected: `game_config` table created in DB.

- [ ] **Step 3: Create seed script for game config defaults**

Create `scripts/seed-game-config.ts` that reads all constants from `src/lib/game-config.ts` and `src/data/gem-shop.ts` and inserts them into `game_config`.

Run: `npx tsx scripts/seed-game-config.ts`
Expected: all current values seeded.

- [ ] **Step 4: Create API routes**

Create `src/app/api/admin/game-config/route.ts`:
- `GET` — list all configs grouped by category
- `POST` — upsert a single config key/value

Create `src/app/api/admin/game-config/[key]/route.ts`:
- `PATCH` — update a single config value with validation against min/max

Create `src/app/api/admin/game-config/batch/route.ts`:
- `POST` — bulk update (e.g., `{ multiplier: 1.1 }` applied to all shop prices)

Create `src/app/api/admin/game-config/history/route.ts`:
- `GET` — return last 30 days of changes with diffs

All routes must use `requireAdmin()` as first operation.

- [ ] **Step 5: Run tests**

```bash
npx vitest run src/__tests__/api/admin-game-config.test.ts
```

Expected: PASS.

- [ ] **Step 6: Create admin UI page**

Create `src/app/admin/game-balance/page.tsx` with 4 sections:
1. **XP Tuning** — sliders for base XP values, speed bonus thresholds
2. **Shop Pricing** — searchable item list with gem cost editor
3. **Quest Config** — daily/weekly targets and reward editor
4. **Engagement Settings** — hearts, daily goal XP mapping

Each section fetches `/api/admin/game-config?category=xp` (etc.) and renders editable fields. On change, debounced PATCH to update.

- [ ] **Step 7: Add nav link**

Add "Game Balance" to the admin sidebar in `src/app/admin/layout.tsx`.

- [ ] **Step 8: Test the panel manually**

Start dev server. Navigate to `/admin/game-balance`. Verify:
- All sections load with current values
- Changing a value persists after reload
- Locked configs show as disabled

- [ ] **Step 9: Commit**

```bash
git add src/lib/db/schema.ts src/app/api/admin/game-config/ src/app/admin/game-balance/ scripts/seed-game-config.ts
git commit -m "feat: add admin game balance panel with DB-backed config and audit history"
```

---

### Task 4-C: Dynamic Page Metadata (SEO)

**Phase:** 2
**Parallel Stream:** UI-G
**Effort:** 2–3 days
**Prereqs:** none

**Overview:** Zero application pages currently export Next.js metadata. 42 of 48 page.tsx files have no metadata. The root layout has a fallback title template but page-level titles, descriptions, and canonical URLs are missing. Many `'use client'` pages need a server shell + client component split before metadata can be added.

**Files:**
- Modify: `src/app/(app)/privacy/page.tsx`, `src/app/(app)/terms/page.tsx`, `src/app/(app)/refund-policy/page.tsx` (add OG/twitter)
- Modify: `src/app/(app)/calculators/page.tsx` (fix type, add OG/twitter)
- Modify (split): `src/app/get-started/page.tsx`, `src/app/(app)/pricing/page.tsx`, `src/app/(app)/contact/page.tsx`, `src/app/(app)/page.tsx`
- Modify (add noindex): all auth pages, settings, practice, admin, dev pages
- Modify (add indexable metadata): achievements, league, shop, skills, glossary pages

**Metadata format reference:**

For `'use client'` pages — split into server shell + client:
```typescript
// page.tsx (Server Component)
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Page Title', description: '...' };
export { default } from './PageClient';

// PageClient.tsx ('use client')
'use client';
export default function PageClient() { /* original code */ }
```

For public pages with SEO value:
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Under 160 chars.',
  alternates: { canonical: '/route' },
  openGraph: { title: '...', description: '...', url: `${APP_URL}/route`, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: '...', description: '...', images: ['/og-image.png'] },
};
```

For noindex pages:
```typescript
export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
};
```

- [ ] **Step 1: Add OG/twitter to 3 legal pages**

Add `openGraph` and `twitter` blocks to `privacy/page.tsx`, `terms/page.tsx`, `refund-policy/page.tsx`.
✓ *Done when:* All three export full `openGraph` + `twitter` objects.

- [ ] **Step 2: Fix calculators page metadata**

Add `import type { Metadata } from 'next'`, type the existing export, add `openGraph`, `twitter`, `alternates.canonical`.

- [ ] **Step 3: Split and add metadata to public/marketing pages**

Priority order: `get-started` → `pricing` → `contact` → `/` (home). For each:
1. Rename current file to `PageClient.tsx`
2. Create new `page.tsx` that exports `metadata` and `export { default } from './PageClient'`
3. Remove `'use client'` from `page.tsx`

✓ *Done when:* `curl https://octokeen.com/get-started` shows `<title>Get Started | Octokeen</title>` without JS.

- [ ] **Step 4: Add noindex metadata to auth pages**

For `login`, `register`, `forgot-password`, `reset-password`, `verify-email` — split into server shells and export `metadata` with `robots: { index: false, follow: false }`.

- [ ] **Step 5: Add noindex metadata to private app pages**

Onboarding, checkout/success, settings (all), practice (all), `/try`, competitor profile.
Each needs at minimum `title` + `robots: { index: false }`.

- [ ] **Step 6: Add noindex to admin and dev pages**

All `src/app/admin/*/page.tsx` and `src/app/dev/*/page.tsx` — export `metadata` with `robots: { index: false, follow: false }`.

- [ ] **Step 7: Add indexable metadata to authenticated hub pages**

`/achievements`, `/league`, `/shop`, `/skills`, `/glossary`, `/quests`, `/streak`, `/friends`, `/units` — add title + description + OG + twitter. These sections have value for logged-in users following links.

- [ ] **Step 8: Add dynamic metadata for public user profiles**

`src/app/(app)/user/[id]/page.tsx` — add `generateMetadata` that fetches `displayName` and returns `title: "${Name}'s Profile"` + `robots: { index: false }`.

- [ ] **Step 9: Remove imperative title override in app layout**

`src/app/(app)/layout.tsx` — remove the `{courseTitle && <title>...</title>}` JSX. Convert to `useEffect(() => { document.title = courseTitle; }, [courseTitle])` (client-only) if needed.

- [ ] **Step 10: Verify metadataBase and run build**

```bash
npm run build 2>&1 | grep -i "metadata\|warning"
```

Expected: no metadata resolution warnings. Spot-check canonical tags on marketing pages.

- [ ] **Step 11: Commit**

```bash
git add src/app/
git commit -m "feat: add Next.js metadata to all 48 pages (SEO + social + robots)"
```

---

### Task 4-D: Content Authority Clarification

**Phase:** 4
**Parallel Stream:** CONTENT-A
**Effort:** 3–5 days
**Prereqs:** none

**Overview:** Two systems claim ownership of course content: static TypeScript files (what the app actually serves) and DB tables (what the admin panel reads/writes). They can silently diverge. This task declares TS files the canonical source of truth, demotes the DB to a read-only replica, disables admin write paths, and wires the seed script into the deploy pipeline.

**Files:**
- Modify: `docs/courses.md` (add Content Authority section)
- Modify: `src/app/api/admin/content/units/route.ts` (disable POST)
- Modify: `src/app/api/admin/content/units/[id]/route.ts` (disable PUT/DELETE, fix auth)
- Modify: `src/app/api/admin/content/lessons/route.ts` (disable POST)
- Modify: `src/app/api/admin/content/lessons/[id]/route.ts` (disable PUT/DELETE)
- Modify: `src/app/api/admin/content/course-questions/route.ts` (disable POST)
- Modify: `src/app/api/admin/content/course-questions/[id]/route.ts` (disable PUT/DELETE)
- Modify: `package.json` (add seed-content script, add to postbuild)
- Modify: `src/app/admin/content/` (remove edit forms from UI)

- [ ] **Step 1: Document the authority decision**

Add `## Content Authority` section to `docs/courses.md`:
- "Static TS files in `src/data/course/` are the canonical source of truth"
- "DB tables (`course_units`, `course_lessons`, `course_questions`) are a read-only replica rebuilt on every deploy"
- "Never edit content via the admin panel or DB directly — edit the TS source files, then run `npm run seed-content`"

✓ *Done when:* `docs/courses.md` has the section with all 3 rules.

- [ ] **Step 2: Disable admin content write routes**

In each of the 6 write-path routes (POST on list routes, PUT/DELETE on `[id]` routes), replace the handler with:

```typescript
export async function POST() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}
```

- [ ] **Step 3: Fix auth inconsistency in units [id] route**

`src/app/api/admin/content/units/[id]/route.ts` — replace `ADMIN_USER_ID` env-var check with `requireAdmin()` from `@/lib/auth-utils`.

- [ ] **Step 4: Add seed-content npm script**

In `package.json`:
```json
"seed-content": "tsx scripts/seed-content.ts",
"postbuild": "tsx scripts/seed-content.ts"
```

Test: `npm run seed-content` — expected: completes without error.

- [ ] **Step 5: Update admin content UI to read-only**

Read `src/app/admin/content/` to find create/edit/delete form components. Remove or hide them. The panel should show only the read view from the existing `GET` endpoints.

- [ ] **Step 6: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Run tests**

```bash
npm test
```

- [ ] **Step 8: Commit**

```bash
git add docs/courses.md src/app/api/admin/content/ src/app/admin/content/ package.json
git commit -m "fix: declare TS files as content authority; disable admin content write routes; add seed to postbuild"
```

---

### Task 4-E: Seed Script Dynamic Loader

**Phase:** 3
**Parallel Stream:** CONTENT-B
**Effort:** 2–4 hours
**Prereqs:** none

**Overview:** The seed script has a dynamic discovery system for `professions/` subdirectories, but the Mechanical Engineering (ME) course is still hard-coded via a static import from `src/data/course/index.ts`. Moving ME into the `professions/` directory structure makes the seed fully self-discoverable — new courses require zero seed script changes.

**Files:**
- Create: `src/data/course/professions/mechanical-engineering/units/` (copy 11 unit files)
- Modify: `scripts/seed-content.ts` (remove ME hard-code, add per-file error handling)

- [ ] **Step 1: Create ME profession directory**

```bash
mkdir -p src/data/course/professions/mechanical-engineering/units
```

Copy (not move) the 11 existing ME unit files from `src/data/course/units/` into `src/data/course/professions/mechanical-engineering/units/`, preserving the `unit-N.ts` naming pattern.

✓ *Done when:* `discoverProfessions()` would find `mechanical-engineering` alongside `personal-finance`, `psychology`, `space-astronomy`.

- [ ] **Step 2: Run seed with new directory to verify discovery**

Before removing the hard-code, run:

```bash
npx tsx scripts/seed-content.ts
```

Verify ME units are seeded twice (once from index.ts, once from new professions dir). Then check the DB has correct data.

- [ ] **Step 3: Remove ME hard-code from seed script**

In `scripts/seed-content.ts`:
1. Delete `import { course } from '../src/data/course'`
2. Delete the ME-specific `db.transaction` block
3. Verify no remaining reference to `course` variable

- [ ] **Step 4: Add per-file error handling in loadProfessionUnits**

Wrap the `await import(...)` call for unit files in a try/catch:

```typescript
try {
  const mod = await import(pathToFileURL(unitFilePath).href);
  // ... process mod
} catch (err) {
  console.error(`[ERROR] Failed to load ${unitFilePath}: ${(err as Error).message}`);
  throw err;
}
```

✓ *Done when:* Temporarily corrupting one unit file causes a clear error message with the filename before exiting.

- [ ] **Step 5: Add unit shape validation**

After collecting all units, add a warning guard:

```typescript
for (const unit of units) {
  if (!unit.lessons?.length) {
    console.warn(`[WARN] Unit ${unit.id} has no lessons — check source file`);
  }
  for (const lesson of unit.lessons ?? []) {
    if (!lesson.questions?.length) {
      console.warn(`[WARN] Lesson ${lesson.id} has no questions`);
    }
  }
}
```

- [ ] **Step 6: Keep src/data/course/index.ts unchanged**

Verify runtime app still works:

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 7: Run full seed to verify correctness**

```bash
npm run seed-content
```

Expected: ME units seeded from `professions/mechanical-engineering/`, same question counts as before.

- [ ] **Step 8: Commit**

```bash
git add src/data/course/professions/mechanical-engineering/ scripts/seed-content.ts
git commit -m "refactor: move ME course into professions/ directory; make seed script fully dynamic"
```

---

## Appendix: Rule Violation Summary

| Rule | Violations | Phase | Priority |
|------|------------|-------|----------|
| Auth on protected routes | 1 (invite/set-cookie) | 1 | High |
| No double dashes in copy | 49 user-facing instances | 1 | High |
| TypeScript no `as any` | 5 violations in 2 store files | 1 | Medium |
| No console.log in prod | 14 server-side files | 1 | Medium |
| Zod at API boundaries | 29 routes without safeParse | 2 | High |
| Rate limiting coverage | 10 endpoints missing limits | 2 | High |
| Reusable UI components | 10 files with inline spinners | 3 | Medium |
| Error boundary coverage | 3 gaps in lazy-loaded areas | 3 | High |
| Modal gallery completeness | 17 missing entries | 3 | Low |
| Critical path test coverage | 4 untested API paths | 3 | High |
| Image compression | 41 files over 100KB | 3 | Medium |
| Teaching cards walls of text | 4+ known violations | 3 | Medium |
| God components >500 lines | 24 files | Ongoing | Low |
