# Octokeen

Gamified learning app for adults. Duolingo-style lessons across general-knowledge subjects. Next.js 16 App Router, TypeScript, Postgres via Drizzle.

**Canonical sources.** For the course list, `docs/courses.md` (mirrors `src/data/professions.ts`). For pricing and feature gating, `src/lib/pricing.ts`. Prefer the code over any document when they disagree, then fix the document.

## Load by topic

This file routes; it does not hold rules. Read the file for what you are doing.

| Doing | Read |
|---|---|
| Writing or editing course content | `docs/rules/content.md` |
| Writing, reviewing, or refactoring code | `docs/rules/code.md` |
| Building or changing UI | `docs/rules/ui.md` |
| Choosing colors, type, spacing, motion | `docs/design-language.md` |
| Drawing or editing SVG diagrams | `docs/svg-design-language.md` |
| Changing lesson flow, XP, streaks, progression | `DESIGN_SYSTEM.md` |
| Unfamiliar with the stack or a library | `docs/rules/stack.md` |
| Hitting unexpected behavior | `docs/rules/gotchas.md` |
| Planning a new course or section | `docs/course-expansion-plan.md` |
| Need architecture or data-flow context | `docs/project-overview.md` |

`docs/project-overview.md` is long and parts of it predate the current structure. Read it when you need system context, not by default, and trust the code over it.

## Non-negotiable

- **Never change an existing lesson or question `id`.** User progress is keyed on them.
- **Never delete a lesson** that `meta.ts` still lists. `loadUnitData` throws at runtime.
- **`scripts/seed-content.ts` writes to the production database.** Upsert-only and safe, but confirm before running.

## Before committing

```
npx tsc --noEmit
npx vitest run
```

Content changes also need `npx tsx scripts/qa-content.ts` with zero violations for the units you touched. See `docs/rules/content.md`.

7 test failures are pre-existing and unrelated: 3 XP-multiplier assertions, 2 Psychology meta-sync, 1 lesson-progression, 1 free-tier session gating. Anything beyond those is yours.
