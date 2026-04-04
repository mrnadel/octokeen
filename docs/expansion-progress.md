# Course Expansion Progress Tracker

> This file tracks what's been done and what's next. Read this at the start of every session to know where to continue.
>
> **How to use:** At the start of any new chat session, say: "Continue the course expansion from where we left off. Read docs/expansion-progress.md"

---

## Current Status: EXPANSION PLAN COMPLETE

**Last updated:** 2026-04-04
**Last completed step:** All sprints done. 45 sections expanded, capstones written, calculation questions added, QA passed. All seeded and verified.
**Deferred to future:** Adaptive placement test, section checkpoints UI

---

## Phase 0: Upgrade Existing Content

### Batch 1: Fix critical quality issues
| Task | Course | Status | Notes |
|------|--------|--------|-------|
| Fix correctIndex bias | Psychology | DONE | 206 questions randomized, 21/29/28/22% distribution |
| Fix correctIndex bias | Space | DONE | 212 questions randomized, 25/27/27/21% distribution |
| Add question type variety | Psychology | DONE | 50 new: 20 sort-buckets, 20 order-steps, 10 scenarios |
| Add question type variety | Space | DONE | 56 new: 23 order-steps, 21 scenarios, 12 slider-estimates |
| Build QA automation script | All | DONE | scripts/qa-content.ts, found 910 violations to fix later |

### Batch 2: Globalization and structure
| Task | Course | Status | Notes |
|------|--------|--------|-------|
| Add country variants | Finance (Banking & Taxes) | DONE | 21 variants added |
| Add country variants | Finance (Debt & Credit) | DONE | 7 variants added |
| Add country variants | Finance (Retirement) | DONE | 16 variants added |
| Add country variants | Finance (Insurance) | DONE | 18 variants added |
| Add country variants | Finance (Credit Scores) | DONE | 16 variants added |
| Add country variants | Finance (other sections) | DEFERRED | Will add during expansion |
| Add review units | Finance | DONE | 3 review lessons added |
| Add review units | Psychology | DONE | 2 review lessons added |
| Add review units | Space | DONE | 2 review lessons added |
| Add section checkpoints | All 3 | DEFERRED | Will add with section infrastructure in Phase 1 |
| Add WEIRD caveats | Psychology | DONE | 15 caveats added across 5 units |
| Add global agencies + Southern sky | Space | DONE | 25+ additions, new "Space Goes Global" lesson |

### Batch 3: Naming and misconceptions
| Task | Course | Status | Notes |
|------|--------|--------|-------|
| Rename units to outcome-based | Finance | DONE | 7 unit renames |
| Rename units to outcome-based | Psychology | DONE | 8 unit + 8 lesson renames |
| Rename units to outcome-based | Space | DONE | 8 unit + 12 lesson renames |
| Add misconception teaching cards | Finance | DONE | 8 myth-busting cards across 6 unit files |
| Add misconception teaching cards | Psychology | DONE | 9 myth-busting cards across 5 unit files |
| Add misconception teaching cards | Space | DONE | 9 myth-busting cards across 5 unit files |

### Batch 4: Final audit
| Task | Course | Status | Notes |
|------|--------|--------|-------|
| Difficulty audit + fix | Finance | DONE | 17 fixes across 11 files |
| Difficulty audit + fix | Psychology | DONE | 2 fixes |
| Difficulty audit + fix | Space | DONE | 25+ fixes across 10 files |
| Add calculation questions | Psychology | DONE | 4 slider-estimate questions added |
| Add calculation questions | Space | DONE | 59 slider-estimate questions across sections 4-10 |
| Em dash audit | Psychology | DONE | 0 em dashes remaining |
| Em dash audit | Space | DONE | 0 em dashes remaining |
| Run QA automation script | All | DONE | ME has 623 pre-existing violations (not expansion scope). Non-ME courses clean. |

---

## Phase 1: Infrastructure

| Task | Status | Notes |
|------|--------|-------|
| Section metadata data model | DONE | sectionIndex + sectionTitle on all 33 units + metas |
| Section checkpoints UI | DEFERRED | Visual feature, will add when content expansion creates enough sections |
| Adaptive placement test | DEFERRED | Needs more content sections first |
| Glossary data structure | DONE | 180 finance + 139 psychology + 150 space terms |

---

## Phase 2: Content Expansion

### Sprint Status

| Sprint | Description | Status |
|--------|-------------|--------|
| 1 | Psychology Section 2 (Sensation & Perception) | DONE (9 units) |
| 2 | Space Section 4 (Light & Telescopes) | DONE (12 units) |
| 3 | Finance Section 13 (Estate Planning) | DONE (11 units) |
| 4 | Psychology Section 10 (Developmental) | DONE (11 units) |
| 5 | Space Section 12 (Amateur Astronomy) | DONE (11 units) |
| 6 | Finance Section 14 (Business) | DONE (11 units) |
| 7 | Psychology Section 11 (Mental Health) | DONE (15 units) |
| 8 | Psychology Section 12 (Therapy) | DONE (13 units) |
| 9 | Space Section 7 (Black Holes) | DONE (10 units) |
| 10a | Integrate written files: Psych 3,5,13 + Space 6,13 + Finance 5 | DONE (integrated + seeded) |
| — | **Sequential expansion (sections 1→15 per course, skipping done)** | |
| 10b | Finance S1 (What Is Money?) | DONE (8 units, seeded) |
| 10c | Finance S2 (Spending & Budgeting) | DONE (10 units, seeded) |
| 10d | Finance S3 (Saving & Emergency Planning) | DONE (11 units, seeded) |
| 10e | Finance S4 (Banking & Financial Systems) | DONE (11 units, seeded) |
| 10f | Finance S6 (Debt Mastery) | DONE (10 units, seeded) |
| 10g | Finance S7 (Credit System) | DONE (10 units, seeded) |
| 10h | Finance S8 (Investing Fundamentals) | DONE (10 units, seeded) |
| 10i | Finance S9 (Advanced Investing) | DONE (10 units, seeded) |
| 10j | Finance S10 (Real Estate) | DONE (10 units, seeded) |
| 10k | Finance S11 (Insurance & Risk) | DONE (10 units, seeded) |
| 10l | Finance S12 (Retirement Planning) | DONE (10 units, seeded) |
| 10m | Psychology S1 (Welcome to Your Mind) | DONE (8 units, seeded) |
| 10n | Psychology S4 (Memory) | DONE (10 units, seeded) |
| 10o | Psychology S6 (Cognitive Biases) | DONE (10 units, seeded) |
| 10p | Psychology S7 (Emotions & Motivation) | DONE (10 units, seeded) |
| 10q | Psychology S8 (Social Psychology) | DONE (10 units, seeded) |
| 10r | Psychology S9 (Personality) | DONE (10 units, seeded) |
| 10s | Psychology S14 (Research Methods) | DONE (10 units, seeded) |
| 10t | Space S1 (Looking Up) | DONE (8 units, seeded) |
| 10u | Space S2 (The Solar System) | DONE (10 units, seeded) |
| 10v | Space S3 (Earth & Moon) | DONE (10 units, seeded) |
| 10w | Space S5 (Stars) | DONE (10 units, seeded) |
| 10x | Space S8 (Cosmology) | DONE (10 units, seeded) |
| 10y | Space S9 (Rockets & Orbital Mechanics) | DONE (10 units, seeded) |
| 10z | Space S10 (Space Exploration History) | DONE (10 units, seeded) |
| 10aa | Space S11 (Exoplanets & Astrobiology) | DONE (10 units, seeded) |
| 10ab | Space S14 (Space Frontiers) | DONE (10 units, seeded) |
| 11 | Add calculation questions (all courses) | DONE (52 slider-estimate questions added across all 3 courses) |
| 12 | Capstone sections S15 (all courses) | DONE (Finance 12 units, Psych 11 units, Space 8 units) |
| 13 | QA pass and polish | DONE (0 violations in new content, 984 pre-existing in old ME/unit files) |

### Sprint 10a: COMPLETED
All 12 content files integrated into meta.ts and course-meta.ts loaders. Seeded and verified 2026-04-04.

### Per-Course Section Status

#### Personal Finance

| Section | Title | Status | Notes |
|---------|-------|--------|-------|
| 1 | What Is Money? | DONE | 8 units, seeded |
| 2 | Spending & Budgeting | DONE | 10 units, seeded |
| 3 | Saving & Emergency Planning | DONE | 11 units, seeded |
| 4 | Banking & Financial Systems | DONE | 11 units, seeded |
| 5 | Taxes | FILES WRITTEN | 13 units, needs meta integration |
| 6 | Debt Mastery | DONE | 10 units, seeded |
| 7 | Credit System | DONE | 10 units, seeded |
| 8 | Investing Fundamentals | DONE | 10 units, seeded |
| 9 | Advanced Investing | DONE | 10 units, seeded |
| 10 | Real Estate | DONE | 10 units, seeded |
| 11 | Insurance & Risk | DONE | 10 units, seeded |
| 12 | Retirement Planning | DONE | 10 units, seeded |
| 13 | Estate Planning | DONE | 11 units, seeded |
| 14 | Business & Self-Employment | DONE | 11 units, seeded |
| 15 | Financial Mastery (Capstone) | DONE | 12 units, seeded |

#### Psychology

| Section | Title | Status | Notes |
|---------|-------|--------|-------|
| 1 | Welcome to Your Mind | DONE | 8 units, seeded |
| 2 | Sensation & Perception | DONE | 9 units, seeded |
| 3 | Learning | FILES WRITTEN | 9 units, needs meta integration |
| 4 | Memory | DONE | 10 units, seeded |
| 5 | Thinking & Intelligence | FILES WRITTEN | 10 units, needs meta integration |
| 6 | Cognitive Biases | DONE | 10 units, seeded |
| 7 | Emotions & Motivation | DONE | 10 units, seeded |
| 8 | Social Psychology | DONE | 10 units, seeded |
| 9 | Personality | DONE | 10 units, seeded |
| 10 | Developmental Psychology | DONE | 11 units, seeded |
| 11 | Mental Health & Abnormal | DONE | 15 units, seeded |
| 12 | Therapy & Treatment | DONE | 13 units, seeded |
| 13 | Applied & Industrial | FILES WRITTEN | 11 units, needs meta integration |
| 14 | Research Methods | DONE | 10 units, seeded |
| 15 | Influence & Dark Patterns (Capstone) | DONE | 11 units, seeded |

#### Space & Astronomy

| Section | Title | Status | Notes |
|---------|-------|--------|-------|
| 1 | Looking Up | DONE | 8 units, seeded |
| 2 | The Solar System | DONE | 10 units, seeded |
| 3 | Earth & Moon | DONE | 10 units, seeded |
| 4 | Light & Telescopes | DONE | 12 units, seeded |
| 5 | Stars | DONE | 10 units, seeded |
| 6 | Galaxies | FILES WRITTEN | 10 units, needs meta integration |
| 7 | Black Holes & Extreme Physics | DONE | 10 units, seeded |
| 8 | Cosmology | DONE | 10 units, seeded |
| 9 | Rockets & Orbital Mechanics | DONE | 10 units, seeded |
| 10 | Space Exploration History | DONE | 10 units, seeded |
| 11 | Exoplanets & Astrobiology | DONE | 10 units, seeded |
| 12 | Astrophotography & Amateur Astronomy | DONE | 11 units, seeded |
| 13 | Space Technology & Engineering | FILES WRITTEN | 10 units, needs meta integration |
| 14 | Space Frontiers | DONE | 10 units, seeded |
| 15 | Mastery & Synthesis (Capstone) | DONE | 8 units, seeded |

### Final totals (seeded 2026-04-04)

| Course | Units | Lessons | Questions |
|--------|-------|---------|-----------|
| ME | 11 | 195 | 2,119 |
| Personal Finance | 170 | 901 | 6,639 |
| Psychology | 167 | 820 | 6,360 |
| Space & Astronomy | 159 | 782 | 5,950 |
| **Total** | **507** | **2,698** | **21,068** |

---

## How to Continue After a Chat Restart

1. Read this file: `docs/expansion-progress.md`
2. Read the plan: `docs/course-expansion-plan.md`
3. Read the writing rules: `docs/content-writing-guide.md`
4. **FIRST PRIORITY:** Integrate the 12 "FILES WRITTEN" section files into meta.ts + course-meta.ts + seed
5. Then continue with Sprint 10b (deepen existing sections), Sprint 11-13
6. Update this file with status changes as you go
