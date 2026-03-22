# Realistic Fake User Pool System

**Date:** 2026-03-22
**Status:** Approved
**Goal:** Replace disposable weekly competitors with a persistent pool of ~250 fake users that look, feel, and behave like real people — creating the illusion of a busy, active platform for the current 2 real users.

## Context

MechReady's league system generates 29 fresh competitors every Monday using a seeded PRNG. They have names from a 60-name pool, country flag emojis, and single-letter initials as avatars. XP is simulated with activity buckets. The competitors are thin — just a name, flag, initial, and XP number. There's no profile depth, no persistent history, and no way to distinguish "regulars" from "strangers."

**Problem:** With only 2 real users, the league feels hollow. Competitors are obviously fake — identical gray circles with initials, no history, no personality. The app needs to feel populated and alive.

**Design philosophy:** Create a messy, realistic world. Some users are new and clueless, some are veterans. Some have profile pictures, some don't. Some picked gamertags, some use real names. Higher tiers attract more polished, serious users. The quality of the population naturally improves as you climb.

---

## 1. Data Model

### 1.1 `FakeUser` Interface

```typescript
interface FakeUser {
  id: string;                    // "fake-042"

  // Identity
  name: string;
  nameQuality: 1 | 2 | 3 | 4 | 5;  // 1=gamertag, 5=professional
  avatarType: 'none' | 'dicebear';
  avatarStyle?: string;          // DiceBear style name (adventurer, avataaars, etc.)
  avatarSeed: string;            // Seed for deterministic DiceBear SVG generation
  countryFlag: string;
  joinDate: string;              // ISO date

  // Progress (grows over time)
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: string[];  // IDs from existing 30 achievements
  topicMastery: {
    topicId: string;             // IDs from existing 11 topics
    masteryLevel: 'not-started' | 'needs-work' | 'developing' | 'strong';
  }[];

  // League
  currentTier: 1 | 2 | 3 | 4 | 5;

  // Internal simulation params (not displayed)
  activityLevel: number;         // 0-1, overall engagement intensity
  consistency: number;           // 0-1, streak maintenance probability
  lastProgressedWeek: string;    // ISO date of last simulated Monday
}
```

### 1.2 `LeagueCompetitor` Extension

The existing `LeagueCompetitor` interface gains one optional field:

```typescript
interface LeagueCompetitor {
  id: string;
  name: string;
  avatarInitial: string;
  countryFlag: string;
  weeklyXp: number;
  dailyXpRate: number;
  variance: number;
  fakeUserId?: string;  // Reference to FakeUser.id for profile lookup
}
```

This keeps backward compatibility. The league simulation logic continues to work with `weeklyXp`, `dailyXpRate`, and `variance` as before.

### 1.3 Storage Format

```typescript
interface FakeUserPool {
  version: 1;
  pool: FakeUser[];
  lastWeekProcessed: string; // ISO date of last Monday that triggered progression
}
```

- **Key:** `mechready-fake-users` (separate from `mechready-engagement`)
- **Size:** ~250 users × ~400 bytes ≈ 100KB
- **Version field** enables future migration — bumping version regenerates the pool

---

## 2. Name System

### 2.1 Quality Tiers

~250 unique names across 5 quality levels, diverse across Israeli, American, European, Asian, Latin American, and Middle Eastern/African origins.

| Quality | Style | Examples |
|---------|-------|---------|
| 1 — Gamertags | ME-themed + generic internet names | "ThermoKing", "StressStrain99", "GearHead42", "xX_Dan_Xx", "CADmonkey", "PressureDrop_Kid", "FluidDynamo", "TorqueMonster", "BoltBoy", "CoolGuy99" |
| 2 — Casual/lazy | Lowercase, first-name-only, missing caps | "danny", "Sara M", "mike_t", "noa r", "amit k", "priya s", "wei z", "carlos h" |
| 3 — Normal | Standard first+last or first+initial | "Dan Katz", "Sarah Chen", "Amit Levi", "Tyler W.", "Ryo Tanaka", "Maria G." |
| 4 — Full names | Complete, properly formatted | "Daniel Kowalski", "Priya Ramaswamy", "Eitan Goldberg", "Sofia Moretti", "Andrés Morales" |
| 5 — Polished | Professional-looking | "Dr. Sarah Martinez", "Eng. Wei Zhang", "Daniel K., PE", "Prof. Tanaka" |

### 2.2 Distribution by Tier

The name quality a fake user gets is weighted by their initial tier. This means Bronze leagues look like a mix of gamertags and casual names, while Masters looks professional.

| Tier | Q1 (gamertag) | Q2 (casual) | Q3 (normal) | Q4 (full) | Q5 (polished) |
|------|----|----|----|----|------|
| Bronze | 30% | 30% | 30% | 10% | 0% |
| Silver | 10% | 25% | 40% | 20% | 5% |
| Gold | 5% | 10% | 30% | 45% | 10% |
| Platinum | 0% | 5% | 15% | 50% | 30% |
| Masters | 0% | 0% | 10% | 40% | 50% |

### 2.3 Name Pool File

**Location:** `src/data/fake-names.ts`

Contains ~50 names per quality level (250 total). Each name includes a quality tag. Names are drawn without replacement during pool generation.

---

## 3. Avatar System

### 3.1 Technology

Uses `@dicebear/core` + `@dicebear/collection` npm packages for client-side SVG generation from seed strings. Zero API calls, works offline, fully deterministic (same seed = same avatar every time).

### 3.2 Styles

Multiple DiceBear styles are used for natural variety:

- `adventurer` — cartoon face illustrations
- `avataaars` — Memoji-style cartoon people
- `lorelei` — artistic line drawings
- `thumbs` — playful/abstract shapes

Each user with an avatar gets a seeded-random style assignment. The leaderboard ends up with a natural mix of avatar types — exactly like a real platform.

### 3.3 Avatar Probability by Tier

| Tier | No Avatar (initials only) | Has DiceBear Avatar |
|------|--------------------------|---------------------|
| Bronze | 50% | 50% |
| Silver | 35% | 65% |
| Gold | 20% | 80% |
| Platinum | 10% | 90% |
| Masters | 5% | 95% |

### 3.4 Rendering

- **No avatar:** Colored circle with first letter of name (existing pattern). Background color varies by user (seeded from a palette of 8-10 muted colors, not uniform gray).
- **DiceBear avatar:** Render SVG inline or as `data:image/svg+xml` URL. The `@dicebear/core` `createAvatar()` function returns an SVG string synchronously.

---

## 4. Profile Depth by Tier

Each tier defines realistic attribute ranges. Values are randomly picked within ranges at generation time, then grow through weekly progression.

| Attribute | Bronze | Silver | Gold | Platinum | Masters |
|-----------|--------|--------|------|----------|---------|
| Join date | 0-30 days ago | 1-12 wks ago | 3-24 wks ago | 6-40 wks ago | 12-52+ wks ago |
| Level | 1-5 | 3-12 | 8-25 | 15-40 | 25-50+ |
| Total XP | 0-1,500 | 1K-6K | 4K-18K | 12K-40K | 25K+ |
| Current streak | 0-5 (60% at 0-1) | 0-14 | 2-30 | 5-60 | 14-200 |
| Longest streak | 0-7 | 3-21 | 7-45 | 14-90 | 30-365 |
| Achievements | 0-3 | 2-8 | 5-15 | 8-22 | 12-27 |
| Topics attempted | 0-3 | 2-5 | 4-8 | 6-10 | 8-11 |
| Mastery quality | mostly needs-work | needs-work + developing | developing + some strong | developing to strong | mostly strong |

### 4.1 Achievement Assignment

Fake users receive achievements from the existing 30 achievement definitions. Assignments follow a logical progression:

- **Bronze:** Only early achievements — `ach-first-correct`, `ach-first-topic`, `ach-streak-3`
- **Silver:** Adds `ach-ten-correct`, `ach-streak-7`, `ach-daily-challenge-5`, `ach-five-topics`
- **Gold:** Adds `ach-fifty-correct`, `ach-streak-14`, `ach-perfect-session`, `ach-topic-master`, `ach-all-types`
- **Platinum:** Adds `ach-hundred-correct`, `ach-streak-30`, `ach-speed-round`, `ach-multi-master`, `ach-all-topics`
- **Masters:** All of the above plus `ach-interview-ready`, `ach-hard-streak`, `ach-scenario-master`

Hidden achievements (`ach-night-owl`, `ach-early-bird`, `ach-wrong-five`) are sprinkled randomly across all tiers at ~10% probability each — adds a fun "even bots practice at 2 AM" touch.

### 4.2 Topic Mastery Assignment

Topics are drawn from the existing 11 topic IDs. The number of topics and their mastery levels follow the tier ranges. Topics are assigned in a weighted order: critical-relevance topics (`engineering-mechanics`, `strength-of-materials`, `materials-engineering`, `design-tolerancing`) are more likely to be attempted first, since that mirrors how real users would prioritize.

---

## 5. Pool Generation

### 5.1 One-Time Initialization

On first app launch (or when `mechready-fake-users` key doesn't exist in localStorage):

1. Seed PRNG with `hashSeed("mechready-fake-pool-v1")`
2. Generate 250 users distributed across tiers:
   - **Bronze: ~80** (most users start here)
   - **Silver: ~70**
   - **Gold: ~50**
   - **Platinum: ~30**
   - **Masters: ~20**
3. For each user: generate name (quality based on tier distribution), avatar config, flag, join date, initial stats (all within tier ranges), achievements, topic mastery
4. Store as `FakeUserPool` object

### 5.2 Determinism

All generation uses the seeded PRNG (`Mulberry32` from existing `league-simulator.ts`). Same seed = same pool on any device. This means if a user clears localStorage and the pool regenerates, they get the same 250 people.

---

## 6. Weekly Progression

Every Monday when `simulateLeagueWeek()` detects a new week, before drawing competitors:

### 6.1 Progress Each Fake User

For each user in the pool:

- **XP gain:** `weeklyXp = tierXpRange.midpoint * activityLevel * (0.5 + random())`; added to `totalXp`
- **Streak:** if `random() < consistency`, streak += 7; otherwise streak resets to `random(0, 3)`
- **Longest streak:** `max(longestStreak, currentStreak)`
- **Level:** Recalculate from `totalXp` using same XP-to-level formula as real users
- **Achievements:** Check if new milestones are met based on updated stats (e.g., `totalXp > 5000` triggers XP-based achievements; `longestStreak >= 14` triggers streak achievements)
- **Topic mastery:** 15% chance per week to advance one random topic by one mastery level

### 6.2 Tier Movement

Simulate each user's weekly performance within their tier:

1. Group all fake users by `currentTier`
2. Assign each a simulated weekly XP rank within their tier group
3. Apply the same promotion/demotion rules used for the real league:
   - Top `promoteCount` users promote (if tier < 5)
   - Bottom `demoteCount` users demote (if tier > 1)
4. Update each user's `currentTier` accordingly

This creates natural tier movement over time — Bronze users gradually climb, Masters users occasionally fall back.

### 6.3 Churn

- **Inactive drift:** 5% of Bronze users per week have their `activityLevel` multiplied by 0.3 (simulates people losing interest). They'll naturally stagnate or get demoted.
- **New signups:** 2% chance per week to add a fresh Bronze user to the pool (replacing the most inactive user), simulating new people joining the platform.

---

## 7. League Drawing

### 7.1 New Function: `drawCompetitorsFromPool()`

Replaces the existing `generateCompetitors()`:

1. Filter pool by `currentTier === user's current tier`
2. Seed PRNG with `hashSeed(weekStartDate + tier)` (same seeding strategy as current system)
3. Shuffle filtered pool using seeded Fisher-Yates, take first 29
4. Map each `FakeUser` to a `LeagueCompetitor` object:
   - `id`: keep the fake user's ID
   - `name`: from fake user
   - `avatarInitial`: first character of name, uppercased
   - `countryFlag`: from fake user
   - `weeklyXp`: initialized to 0 (computed by `simulateCompetitorXp`)
   - `dailyXpRate`: derived from `activityLevel * tierXpRange.midpoint / 7`
   - `variance`: derived from `dailyXpRate * 0.3`
   - `fakeUserId`: set to `FakeUser.id`
5. Return the 29 `LeagueCompetitor` objects

### 7.2 Edge Case: Insufficient Tier Population

If fewer than 29 users exist at the current tier (possible for Masters early on), backfill from the adjacent lower tier.

### 7.3 XP Simulation

The existing `simulateCompetitorXp()` function continues to work unchanged — it uses `dailyXpRate` and `variance` which are now derived from the fake user's `activityLevel` instead of being generated from scratch.

---

## 8. Competitor Profile Preview

### 8.1 UI: Bottom Sheet

Tapping a competitor row in `LeagueBoard` opens a bottom sheet (not a full page navigation). This avoids the awkward "Add Friend" button problem and is lighter UX for a leaderboard context.

```
┌────────────────────────────────────┐
│  [DiceBear Avatar or Initials]     │
│  StressStrain99                     │
│  🇺🇸  Joined 3 weeks ago          │
│                                     │
│  Level 4    🔥 3-day streak         │
│  ⚡ 1,240 XP   🥉 Bronze           │
│                                     │
│  Achievements                       │
│  🎯 First Principles               │
│  🧱 Solid Foundation               │
│  🔥 Getting Warmed Up              │
│                                     │
│  Topics                             │
│  ⚖️ Eng. Mechanics    Developing   │
│  🏗️ Strength          Needs work   │
│  🔥 Thermo            Needs work   │
└────────────────────────────────────┘
```

### 8.2 Behavior

- **No "Add Friend" button** for fake users
- Read-only, no interaction beyond viewing
- Dismiss by tapping outside or swiping down
- If the friends system later adds real users to the league, the sheet can conditionally show "Add Friend" based on whether the competitor has a `fakeUserId` or not
- Uses existing card/sheet styling patterns from the app (indigo accents, slate surfaces)
- Achievement icons from existing `achievements.ts` definitions
- Topic mastery shown as colored dots/bars matching existing mastery level colors

### 8.3 Component

**Location:** `src/components/engagement/CompetitorPreview.tsx`

Props: `{ fakeUserId: string; isOpen: boolean; onClose: () => void }`

Looks up the full `FakeUser` from the pool in localStorage, renders the bottom sheet.

---

## 9. Avatar Rendering in LeagueBoard

### 9.1 Current State

All competitors show a gray circle with a white letter initial. The user shows an indigo circle.

### 9.2 New State

- **Competitors with DiceBear avatar:** Show the SVG avatar in a 32px circle (clipped). Rendered as inline SVG or `<img src="data:image/svg+xml,...">`.
- **Competitors with no avatar:** Show a colored circle with initial. Instead of uniform gray, each user gets a seeded color from a palette: slate, zinc, stone, amber, emerald, sky, violet, rose. Adds visual variety.
- **The real user:** Stays indigo circle with initial (unless they've set a profile picture via the existing profile system).

### 9.3 Performance

DiceBear SVG generation is synchronous and fast (~1ms per avatar). For a list of 30, this is negligible. Avatars can be generated once when the league board mounts and memoized.

---

## 10. Integration Points

### 10.1 File Changes

| File | Change |
|------|--------|
| **New:** `src/data/fake-names.ts` | ~250 names across 5 quality tiers |
| **New:** `src/lib/fake-user-generator.ts` | Pool generation, weekly progression, competitor drawing |
| **New:** `src/components/engagement/CompetitorPreview.tsx` | Bottom sheet profile preview |
| **Modify:** `src/data/engagement-types.ts` | Add `FakeUser`, `FakeUserPool` interfaces; add `fakeUserId?` to `LeagueCompetitor` |
| **Modify:** `src/lib/league-simulator.ts` | Replace `generateCompetitors()` with `drawCompetitorsFromPool()`; keep all other functions |
| **Modify:** `src/components/engagement/LeagueBoard.tsx` | Add click handler for competitor rows; render DiceBear avatars; varied initials colors |
| **Modify:** `src/components/engagement/LeagueCard.tsx` | Render DiceBear avatars for top-5 mini leaderboard |
| **Modify:** `src/lib/engagement-init.ts` | Call `initFakeUserPool()` and `progressFakeUsers()` on app mount |
| **New dependency:** `@dicebear/core`, `@dicebear/collection` | Client-side avatar SVG generation |

### 10.2 Initialization Flow

```
App mount
  → engagement-init.ts
    → initFakeUserPool()          // Create pool if missing
    → progressFakeUsers()         // Advance all users if new week
    → simulateLeagueWeek()        // Now uses drawCompetitorsFromPool() internally
```

---

## 11. What This Does NOT Change

- Real user XP earning, streak, level, achievement systems — untouched
- League promotion/demotion rules and thresholds — identical
- Engagement store structure (`mechready-engagement`) — fake users are separate storage
- Friends system design spec — can layer on top later
- The 30-competitor-per-league model — still 29 bots + 1 real user
- Quest system, gems, shop — untouched
- `simulateCompetitorXp()` function — still works the same, just with different input sources

---

## 12. Future Considerations

- When real users grow beyond 30, the fake user pool can be phased out — replace fake competitors with real ones
- The `fakeUserId` field on `LeagueCompetitor` makes it easy to distinguish fake from real in the UI
- The friends system's public profile page (`/user/[id]`) could optionally render fake user profiles at `/user/fake-042` if desired later
- The bottom sheet preview component is reusable for real user quick-views
