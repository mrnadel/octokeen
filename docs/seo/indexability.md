# Indexability gate

Octokeen is about to server-render course content for search engines. The content is
AI-generated and mostly unaudited. Google's helpful-content system demotes whole
domains over mass-published thin pages, so the decision "may this URL be indexed" has
to be a computed property of measured content quality, not a judgement call made once
at launch.

This document records the measurements, the gate, and what it would take to unlock
more pages.

- Gate: `src/lib/seo/indexable.ts`
- Manifest: `src/lib/seo/indexability-manifest.json` (generated, checked in)
- Audit CLI: `scripts/seo-index-audit.ts`
- Tests: `src/__tests__/lib/seo-indexable.test.ts`

## Where the numbers come from

The audit reads content through `loadUnitData`, the same loader the app uses, so it
can only ever score what the runtime actually serves. It then runs the existing 19
checks in `src/lib/content-qa.ts` and attributes every violation back to a unit and a
lesson by id.

Attribution has to go through ids. `QAViolation` carries `unitTitle` and
`lessonTitle` but no ids, and titles collide inside a single course (Personal Finance
has two units called "Reading Financial Statements", Psychology has two called
"Cross-Cultural Psychology"). The audit builds an index from every id a violation can
be filed under, question id, speed-question id, lesson id and unit id, back to its
owning unit.

### Correction to the headline number

`npx tsx scripts/qa-content.ts` reports **13,268** violations. That number
double-counts Mechanical Engineering and includes content the app never serves.

`src/data/course/professions/mechanical-engineering/units/` is a second, divergent
copy of the ME course. It holds the same unit and lesson ids as
`src/data/course/units/`, but the two files have drifted: the profession copy carries
138 em dash and double dash violations the live copy does not. `loadUnitData` and the
`src/data/course` barrel both read `src/data/course/units/`, so the profession copy is
dead content. The QA script's directory scan picks up both and reports the dead copy
as a fifth course.

Live content carries **12,130** violations. Everything below uses that figure.

Recommended follow-up, out of scope here: delete
`src/data/course/professions/mechanical-engineering/units/` or make
`scripts/qa-content.ts` skip it.

## The corpus

| | count |
|---|---|
| Courses | 4 |
| Sections | 50 |
| Units | 544 |
| Lessons | 2,800 |
| Questions | 20,966 |
| QA violations | 12,130 (109 error, 12,021 warning) |

One of those warnings, ME's CHECK 15 true/false skew, is raised against a course as a
whole and belongs to no unit. The audit's per-unit warning total is therefore 12,020.

## Violations per course

| Course | Units | Lessons | Violations | Errors | Thin units |
|---|---|---|---|---|---|
| mechanical-engineering | 11 | 195 | 1,000 | 0 | 0 |
| personal-finance | 197 | 991 | 4,015 | 45 | 28 |
| psychology | 187 | 914 | 3,867 | 56 | 28 |
| space-astronomy | 149 | 700 | 3,248 | 8 | 31 |

By check, across live content:

| Check | Count | What it catches |
|---|---|---|
| CHECK 19 | 4,506 | On-screen text over its word budget |
| CHECK 5 | 2,874 | Teaching card explanation over 2 sentences |
| CHECK 17 | 2,174 | Templated or duplicated distractor explanations |
| CHECK 16 | 1,288 | Teaching card title or hint too long |
| CHECK 2 | 721 | Correct option visibly longer than its distractors |
| CHECK 12 | 291 | Option text over 15 words |
| CHECK 3 | 127 | Standard lesson not carrying 2 to 3 teaching cards |
| CHECK 8 | 46 | Sort-buckets not 6 items and 2 buckets |
| CHECK 18 | 39 | Two lessons in a unit with an identical item sequence |
| CHECK 7 | 39 | Match-pairs not 4 pairs |
| CHECK 9 | 24 | Order-steps not 4 to 5 items |
| CHECK 15 | 1 | Course-wide true/false answer skew (ME) |

CHECK 1, 6, 13 and 14 do not fire on live content.

## Violations per section

Run `npx tsx scripts/seo-index-audit.ts` for the current table. As of the last run:

| Course | Section | Title | Units | Indexable | Violations to clear |
|---|---|---|---|---|---|
| mechanical-engineering | 0 | (ungrouped) | 11 | 0 | 966 |
| personal-finance | 1 | What Is Money? | 8 | 8 | 0 |
| personal-finance | 2 | Spending & Budgeting | 10 | 8 | 0 |
| personal-finance | 3 | Saving & Emergency Planning + Banking | 22 | 0 | 550 |
| personal-finance | 4 | Taxes | 13 | 0 | 459 |
| personal-finance | 6 | Debt Mastery | 10 | 0 | 62 |
| personal-finance | 7 | Credit System | 10 | 0 | 103 |
| personal-finance | 8 | Investing Fundamentals | 10 | 0 | 148 |
| personal-finance | 9 | Advanced Investing | 10 | 0 | 136 |
| personal-finance | 10 | Real Estate | 10 | 0 | 142 |
| personal-finance | 11 | Insurance & Risk | 10 | 0 | 125 |
| personal-finance | 12 | Retirement Planning | 10 | 0 | 189 |
| personal-finance | 13 | Plan Your Legacy | 11 | 0 | 332 |
| personal-finance | 14 | Business & Self-Employment | 11 | 0 | 266 |
| personal-finance | 15 | Financial Mastery | 12 | 0 | 181 |
| personal-finance | 16 | Portfolio Theory | 10 | 0 | 111 |
| personal-finance | 17 | Security Valuation | 10 | 0 | 242 |
| personal-finance | 18 | Economics & Behavior | 10 | 0 | 123 |
| personal-finance | 19 | Advanced Strategy | 10 | 0 | 255 |
| psychology | 1 | Welcome to Your Mind | 8 | 0 | 170 |
| psychology | 2 | How You Sense the World + Learning | 18 | 0 | 481 |
| psychology | 3 | How Your Memory Works | 10 | 0 | 234 |
| psychology | 4 | Thinking & Intelligence | 10 | 0 | 309 |
| psychology | 5 | Cognitive Biases | 10 | 0 | 76 |
| psychology | 6 | Emotions & Motivation | 10 | 0 | 104 |
| psychology | 7 | Social Psychology | 10 | 0 | 131 |
| psychology | 8 | Personality | 10 | 0 | 141 |
| psychology | 9 | Developmental Psychology | 11 | 0 | 276 |
| psychology | 10 | Mental Health & Abnormal Psychology | 15 | 0 | 262 |
| psychology | 11 | Therapy & Treatment | 13 | 0 | 218 |
| psychology | 12 | Applied & Industrial Psychology | 11 | 0 | 248 |
| psychology | 13 | Research Methods | 10 | 0 | 83 |
| psychology | 14 | Influence & Dark Patterns | 11 | 0 | 101 |
| psychology | 16 | Neuroscience Deep Dive | 10 | 0 | 156 |
| psychology | 17 | Statistics & Methods | 10 | 0 | 128 |
| psychology | 18 | Specialized Fields | 10 | 0 | 291 |
| space-astronomy | 1 | Looking Up | 8 | 0 | 129 |
| space-astronomy | 2 | The Solar System | 10 | 0 | 152 |
| space-astronomy | 3 | Earth & Moon | 10 | 0 | 186 |
| space-astronomy | 4 | Light & Telescopes + Stars | 22 | 0 | 317 |
| space-astronomy | 5 | Galaxies | 10 | 0 | 93 |
| space-astronomy | 6 | Black Holes & Extreme Physics | 10 | 0 | 137 |
| space-astronomy | 7 | Cosmology | 10 | 0 | 146 |
| space-astronomy | 8 | Rockets & Orbital Mechanics | 10 | 0 | 92 |
| space-astronomy | 9 | Space Exploration History | 10 | 0 | 39 |
| space-astronomy | 10 | Exoplanets & Astrobiology | 10 | 0 | 149 |
| space-astronomy | 11 | Astrophotography & Amateur Astronomy | 11 | 0 | 345 |
| space-astronomy | 12 | Space Technology & Engineering | 10 | 0 | 348 |
| space-astronomy | 13 | Space Frontiers | 10 | 0 | 292 |
| space-astronomy | 14 | Mastery & Synthesis | 8 | 0 | 242 |

"Violations to clear" counts only the units that are not thin. Fixing a thin unit's
violations does not publish it.

Two things about sections that whoever builds section URLs needs to know. First,
`sectionIndex` is not the number in the filename: `psychology/units/section-15-*.ts`
carries `sectionIndex: 14`, and Personal Finance has no `sectionIndex: 5` at all.
Second, four `sectionIndex` values each span two different `sectionTitle` values
(personal-finance 3, psychology 2, space-astronomy 4, plus ME's ungrouped 0), so a
URL keyed on `sectionIndex` merges two named sections into one page. `CourseMap.tsx`
groups the same way, so the gate matches the app, but the slug should probably be
built from the title rather than the index.

## The gate

A page is indexable when all of these hold. Anything the manifest does not recognise
is denied.

| Rule | Threshold | Why |
|---|---|---|
| Own prose | >= 300 words | Below this there is no page, only a widget |
| Teaching cards | >= 6 | The prose has to be spread across real teaching material |
| Error violations | 0 | Structurally broken items: missing options, out-of-bounds `correctIndex`, duplicate ids |
| Warning violations | <= 3 absolute | A large unit must not bank a bigger budget |
| Warning density | <= 0.05 per question | One slip per twenty items |

A section hub is indexable when at least 2 of its units are and at least half of them
are. A course hub is indexable when it has no course-wide violations and at least one
indexable section.

"Own prose" is the unit description plus, for every lesson in it, the lesson
description and the title, explanation and hint of each teaching card. Question stems,
answer options and answer explanations are excluded: they are the assessment, and
publishing them is a product decision, not an SEO one. If that decision changes the
word counts go up and more units qualify, so the gate is conservative in the safe
direction.

### Granularity: the unit is the atom

The brief asked whether one bad distractor explanation should sink a unit. It should
not, and under this gate it does not: a 40-question unit is allowed 2 warnings and a
60-question unit is allowed 3. A unit full of them fails on density long before it
reaches the absolute cap.

The unit, not the lesson, is the page. This is measured, not assumed:

- Median lesson: 106 to 126 words of own prose depending on course. The longest
  lesson in the entire 2,800-lesson corpus is 212 words.
- Median unit: 537 to 553 words in the profession courses, 1,829 in ME. p25 is 396 to
  463.

Publishing 2,800 pages averaging 115 words each is precisely the mass-produced thin
page pattern that gets a domain demoted. Publishing 544 pages averaging 550 words is a
normal content site.

The teaching-card floor makes this structural rather than a policy choice. CHECK 3
requires a standard lesson to carry 2 to 3 teaching cards, so a lesson can never
reach 6. **No lesson URL can ever pass the gate while that rule stands.** Lesson URLs
should not be in the sitemap at all. If the content model changes so that a lesson
carries more, the gate will let it through on its own.

Course-wide violations, currently only CHECK 15's true/false answer skew, block the
course hub but not its units. Answer-guessability is a property of the course as a
whole, and it does not make any individual unit page worse for a reader.

### Why the bar is this strict

The content is not mostly fine with a few bad spots. It is uniformly non-compliant, so
the warning thresholds are almost inert. Holding the prose floors and the zero-errors
rule fixed and sweeping the warning allowance:

| Warnings per question | cap 3 | cap 10 | no cap |
|---|---|---|---|
| 0 | 16 | 16 | 16 |
| 0.05 (chosen) | 16 | 16 | 16 |
| 0.10 | 16 | 16 | 16 |
| 0.20 | 16 | 26 | 29 |
| 0.50 | 16 | 50 | 163 |
| 1.00 | 16 | 50 | 355 |

Doubling the chosen allowance changes nothing. Removing the cap entirely and still
doubling it changes nothing. The count only moves once a unit is allowed to violate
the writing guide on one item in five, and it only moves usefully at roughly one
violation per question. There is no threshold that unlocks a useful number of pages
without publishing content that fails the project's own standard. The only thing that
unlocks pages here is content work, which is what the audit's unlock queue is for.

The chosen numbers therefore cost nothing today and buy tolerance later: once a
section has been audited, a single missed word budget will not knock its unit back out
of the index.

## What is publishable today

| | Indexable | Total | Share |
|---|---|---|---|
| Units | 16 | 544 | 2.9% |
| Sections | 2 | 50 | 4.0% |
| Courses | 1 | 4 | 25% |
| Lessons | 0 | 2,800 | 0% |

The 16 units are Personal Finance sections 1 and 2, the two sections that were audited
to zero violations, minus `fin-sec2-u4` (202 words, 4 teaching cards) and
`fin-sec2-u10` (237 words, 4 teaching cards), which pass QA but are too thin to be
pages. Section 2 still publishes as a hub, because 8 of its 10 units qualify.

Personal Finance is the only publishable course hub. Mechanical Engineering is also
blocked by a course-wide true/false skew, and is access-gated in `professions.ts`
anyway.

### What it would take

10,466 violations stand between 441 units and publication. Clearing all of them takes
the indexable count from 16 to 457 of 544.

The other 87 units cannot be unlocked by fixing anything. They are under 300 words or
under 6 teaching cards and need writing, not editing.

The cheapest wins as of the last run, all needing 4 to 5 violations cleared:
`fin-sec6-u1`, `fin-sec6-u9`, `sp-sec10-u1`, `psy-sec14-u5`, `psy-sec14-u8`,
`sp-sec10-u2`, `sp-sec10-u5`, `sp-sec10-u6`, `sp-sec10-u7`. Run the audit for the
current list; it prints the 20 cheapest every time.

Section-level, the shortest paths to a second publishable hub are
space-astronomy 9 (39 violations across 10 units), personal-finance 6 (62),
psychology 5 (76) and psychology 13 (83).

## How to call it

```ts
import { isIndexable, robotsFor, listIndexableUnits, getIndexDecision } from '@/lib/seo/indexable';

export type IndexTarget =
  | { kind: 'course'; courseId: string }
  | { kind: 'section'; courseId: string; sectionIndex: number }
  | { kind: 'unit'; courseId: string; unitId: string }
  | { kind: 'lesson'; courseId: string; lessonId: string };

function isIndexable(target: IndexTarget): boolean;
function getIndexDecision(target: IndexTarget): { indexable: boolean; blockers: IndexBlocker[] };
function robotsFor(target: IndexTarget): { index: boolean; follow: boolean };
function listIndexableUnits(): PageQuality[];
function listIndexableLessons(): PageQuality[];
function evaluatePage(quality: PageQuality | undefined): IndexDecision;
function manifestMeta(): { version: number; generatedAt: string; contentHash: string };
```

In a page route, `robotsFor` drops straight into `generateMetadata`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { courseId, unitId } = await params;
  return { title: ..., robots: robotsFor({ kind: 'unit', courseId, unitId }) };
}
```

Blocked pages get `index: false, follow: true`. They still render and still pass link
equity to the pages that did qualify; they just stay out of the index.

In `sitemap.ts`, list only what passed:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return listIndexableUnits().map((u) => ({ url: unitUrl(u.courseId, u.unitId), ... }));
}
```

`listIndexableLessons()` returns an empty array today and will keep doing so while
CHECK 3 caps lessons at 3 teaching cards.

### Integration points owned by someone else

`src/lib/seo/slugs.ts`, `src/lib/seo/metadata.ts`, `src/app/sitemap.ts` and
`src/app/robots.ts` were being edited concurrently and are untouched here. This module
deliberately knows nothing about URLs; it takes ids and returns a verdict. Whoever
owns slugs needs to map `courseId` and `unitId` to a path, and should read the note on
`sectionIndex` above before keying a URL on it.

`src/app/robots.ts` should not try to express this. Per-page `noindex` via metadata is
the right mechanism: 528 disallow lines in robots.txt would block crawling, which also
blocks Google from seeing the `noindex` on pages that later get fixed.

## The manifest

`src/lib/seo/indexability-manifest.json`, about 136 KB, checked in.

It holds facts, not verdicts: word counts, teaching card counts, question counts and
violation tallies per unit, plus one course-wide violation count per course.
Thresholds live in `indexable.ts`. Moving the bar therefore needs a code change and no
regeneration, and a threshold change is visible in a code review rather than buried in
a generated file.

Every unit gets a record. Lessons only get one once they clear the thin-content
floors, which today means none: 2,800 foregone conclusions would have taken the file
to 936 KB for no runtime benefit. Absence is denial, so the answer is identical either
way.

Regenerate after any content change:

```
npx tsx scripts/seo-index-audit.ts --write
```

Verify in CI, which exits 1 if the manifest no longer matches the content:

```
npx tsx scripts/seo-index-audit.ts --check
```

Without a flag the script only reports and touches nothing.

### Why a manifest

Page routes call the gate during rendering, so running 19 QA checks over 5 MB of
course data per request is not an option. The alternatives considered:

- **Compute at build time into route params.** Ties indexability to the route layer,
  and the sitemap and the page would each need their own copy.
- **Cache the QA result in Redis or the database.** Adds a network hop and a failure
  mode to a decision that must fail closed. A cache miss on a bad page would publish
  it.
- **Static manifest, chosen.** One JSON parse at process start, then a `Record`
  lookup and about six comparisons per call. No I/O, no failure mode, reviewable in a
  diff, and the same numbers feed the audit report.

The cost is staleness: an edited lesson does not change the manifest until someone
regenerates it. `--check` in CI closes that, and `contentHash` makes drift visible in
the report.

The module is server-only. Do not import it from a client component; the manifest
would land in the browser bundle.

## Conventions this deviates from

`docs/rules/code.md` caps a file at 150 lines. `src/lib/seo/indexable.ts` is 192,
of which 122 are code and the rest are the manifest type declarations and the
rationale for each threshold. The available seam, splitting the manifest shape away
from the evaluator that consumes it, would produce two files that are only ever
imported together. Left as one file deliberately.

`scripts/seo-index-audit.ts` reimplements nothing from `scripts/qa-content.ts`: it
loads content through `loadUnitData` rather than by scanning directories, which is
why it sees the live ME course and the QA script sees both copies.
