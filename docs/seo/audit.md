# SEO audit

`scripts/seo-audit.ts` crawls every URL in a sitemap and checks the objectively
testable SEO properties of each one. This document records what it checks, what
each threshold is measured against, and what the last run found.

```
npx tsx scripts/seo-audit.ts                          audits https://octokeen.com
npx tsx scripts/seo-audit.ts http://localhost:3121    audits a local build
npx tsx scripts/seo-audit.ts <base> --no-metrics      skips the throttled Core Web Vitals pass
npx tsx scripts/seo-audit.ts <base> --no-render       also skips the hydrated-DOM link pass
npx tsx scripts/seo-audit.ts <base> --json out.json   writes machine-readable findings
```

Every run ends with a score out of 100. Exit code is 0 only on a complete run
that scores 100, 1 otherwise, and 2 when the scoring registry itself is
inconsistent. A full production run takes roughly 12 minutes;
`--no-metrics --no-render` finishes in about 90 seconds but is marked PARTIAL
and always exits non-zero.

## The score

**100 means every property this harness can objectively test is correct. It is
not a prediction that the site ranks.** The script prints that sentence itself
on every run, next to the number, so a green result read out of context cannot
be mistaken for a ranking forecast. What a perfect score stays silent on is in
[What no harness can test](#what-no-harness-can-test) below.

### How it is computed

`100 × earned / available`. Every check in `CHECK_REGISTRY` contributes
`weight × (subjects passing / subjects evaluated)`.

Credit is partial per check rather than per finding, so the number does not
depend on how many URLs the site has: a check passing on 21 of 25 URLs earns
84% of its weight whether the site has 25 pages or 2,500.

One exception, the **dilution floor**. On a check weighted `SEVERE_WEIGHT` (5)
or above, any failure at all forfeits at least half the weight. Without it,
publishing more clean pages around an unfixed canonicalization bug would raise
the score on its own — four broken canonicals cost 1.6 points across 25 pages
and 0.16 across 250.

Each check is scored against the population its scope names: `page` (URLs
fetched with parseable HTML), `site` (one), `link` (internal link targets
tested), `image` (every `<img>` occurrence), `imageAsset` (distinct same-origin
image files), `metric` (pages measured in the browser). A population of zero
means the check is not applicable; it is excluded from both sides of the ratio
and listed as such in the output.

### What the weights mean

The full table lives in `CHECK_REGISTRY` in `scripts/seo-audit.ts`, one line
per check, each carrying its weight and a one-line justification. The bands:

| Weight | Meaning | Examples |
|---|---|---|
| 9-10 | Decides whether the URL can be indexed at all, or which URL is | `CANONICAL_MISMATCH`, `ROBOTS_BLOCKS_SITEMAP_URL`, `SITEMAP_NON_200`, `SITEMAP_NOINDEX` |
| 5-8 | Decides how well an indexed URL performs, or breaks a documented Google requirement | `NO_TITLE`, `NEAR_DUPLICATE_BODY`, `ORPHAN`, `THIN_CONTENT`, `LINK_BROKEN` |
| 2-4 | Real but secondary: Core Web Vitals, structured-data eligibility, accessibility properties Google reads | `LCP_POOR`, `JSONLD_CONTENT_MISMATCH`, `NO_H1`, `IMG_NO_ALT` |
| 1 | Hygiene. Correct to fix, near-zero measurable search effect | `TITLE_TOO_LONG`, `OG_INCOMPLETE`, `MULTIPLE_H1`, `HEADING_SKIP` |
| 0 | Preference or information. A 100 is reachable with these outstanding | `ROBOTS_BLOCKED_AGENTS`, `SITEMAP_INERT_HINTS`, `JSONLD_UNSUBSTANTIATED` |

These are calibrated on plausible search impact **only**. Difficulty of fixing
is deliberately not an input: an expensive problem costs the same as a cheap one
of equal consequence. `TBT_POOR` is weighted 2 rather than 4 not because it is
hard to fix but because TBT is a lab proxy for INP rather than the vital itself.
`MULTIPLE_H1` is weighted 1 because Google has stated repeatedly that multiple
h1s are fine.

They remain a judgement call, and reasonable people would move several of them
by a point or two. Every entry carries its reasoning on the same line so a
disagreement is arguable rather than mysterious.

### Why the number cannot be raised without fixing something

Three guards, all verified by deliberately breaking them:

1. **A finding whose code is not in the registry aborts the run with exit 2.**
   A new check cannot be added that costs nothing.
2. **A registered code whose owning check did not run scores zero, not full
   marks.** `CHECK_OWNERS` maps each check function to the codes it emits, and
   `main` marks them as it calls each one. Deleting a check *lowers* the score.
   Verified: unmarking `checkCanonical` while leaving it running dropped the
   score from 81.0 to 74.1 and printed all four canonical checks as `NOT RUN`.
3. **`EXPECTED_TOTAL_WEIGHT` is asserted against the registry sum on every
   run.** Deleting an entry or quietly lowering a weight aborts with exit 2
   until someone edits that constant, which is a one-line diff a reviewer
   cannot miss.

Skipping a pass with `--no-metrics` or `--no-render` marks the score PARTIAL and
always exits non-zero, so a flag cannot be used to dodge a category either.

### noindex pages are exempt from index-quality checks

`ORPHAN`, `ORPHAN_WITHOUT_JS` and `THIN_CONTENT` are skipped on any page
carrying `noindex`. Internal linking exists to get a page crawled and to pass
equity to it, and thin content is a judgement Google makes about pages it
indexes; a page that asks not to be indexed wants none of that, so a finding
against one is noise.

This is not an escape hatch. A sitemap URL carrying `noindex` already trips
`SITEMAP_NOINDEX` at weight 9, so adding `noindex` to dodge these three checks
costs far more than it saves.

### Reading the breakdown

The score section prints per-category totals, then every check costing points
sorted worst-first with its weight, its failing-of-evaluated ratio and the
points lost. A low score always says exactly which checks failed and on how many
subjects. It also lists the weight-0 checks explicitly, so "deliberately
unscored" is visible rather than silent.

## How it fetches

Two paths, because they answer different questions.

**Raw HTTP**, with `redirect: 'manual'` so the redirect chain itself is
visible. The HTML is parsed with `DOMParser` inside a blank browser tab.
`DOMParser` executes no scripts and loads no subresources, so this pass sees
exactly what a crawler that does not render JavaScript sees. (`jsdom` is in
devDependencies but ships no type declarations, and adding `@types/jsdom` was
out of scope.)

**A real Chromium page** under iPhone 14 emulation with Lighthouse's mobile
throttling — 4x CPU slowdown over a Slow 4G link (150 ms RTT, 1.6 Mbps down).
This pass measures LCP, CLS and TBT, identifies layout-shift sources and
render-blocking resources, and collects the hydrated DOM's links.

A local build still advertises production URLs in its sitemap, because
`APP_URL` is a build-time constant. The harness rebases every `<loc>` onto the
origin being audited and falls back to path comparison for canonicals, so
pointing it at localhost audits localhost.

## Severity

The harness will not tell you something is a Google requirement when it is not.

| Severity | Meaning |
|---|---|
| `defect` | Verifiably wrong. Contradicts the site's own output, breaks a documented Google requirement, or breaks a web standard. |
| `best-practice` | A widely held convention with no documented Google rule behind it. Worth fixing; not a ranking factor on its own. |
| `preference` | A judgement call, listed so it is visible. |
| `info` | A measured fact that needs a human decision. |

**Severity and weight are independent axes, deliberately.** Severity says
whether the finding is true; weight says how much it costs. They come apart
often enough to be worth stating: `SITEMAP_LASTMOD_UNIFORM` is a `defect`
weighted 1, because the sitemap does assert a modification date that is false,
and the only consequence is that Google discards a crawl-scheduling hint.
`TITLE_TOO_LONG` is `best-practice` weighted 1 for the opposite reason — no
rule is broken, and nothing is lost but snippet width. Reading either axis
alone will mislead.

Every numeric threshold names its source in a comment at the top of
`scripts/seo-audit.ts`. Three of them are the project's own numbers, not
industry ones: title 60 chars and description 155 chars come from
`src/lib/seo/constants.ts`, and the 300-word floor comes from `MIN_PAGE_WORDS`
in `src/lib/seo/indexable.ts`. A length finding therefore always means "the
site broke its own rule".

## What it checks

**Response.** Sitemap URLs must return 200 without redirecting. `X-Robots-Tag`
must not carry `noindex` on a sitemap URL.

**Document.** `lang` on `<html>` (WCAG 2.2 SC 3.1.1, Level A), a charset
declaration (HTML spec), and a viewport meta (mobile-first indexing).

**Title, description, canonical.** Presence, count, length against the
project's own budgets, uniqueness across the site, and whether the canonical
resolves to the URL the sitemap advertises.

**Headings.** An h1 must exist and be non-empty. Multiple h1s are reported as
best-practice only: Google has stated repeatedly that multiple h1s are fine.
Skipped heading levels are reported against WCAG 1.3.1, not as a ranking issue.

**Social cards.** Open Graph completeness, absolute `og:image`, Twitter card
type. None of this is a ranking factor; it controls what a shared link looks
like.

**Structured data.** Every JSON-LD block must parse and carry `@context`.
Typed nodes are checked against Google's documented required and recommended
properties (read 2026-08-24):

| Type | Google-required | Notes |
|---|---|---|
| `Course` | `name`, `description` | `provider` recommended |
| `BreadcrumbList` | `itemListElement` | |
| `ListItem` | `position`, `name` | `item` optional on the last crumb |
| `Organization` | none documented | logo must be >= 112x112 px and crawlable |
| `WebApplication` | `name`, `offers` | the rich result *also* needs `aggregateRating` or `review` |
| `FAQPage` | `mainEntity` | FAQ rich results were removed from Search on 2025-06-15 |
| `Offer` | `price`, `priceCurrency` | |

A node carrying an `@id` and no more than four keys is treated as a reference
to an entity defined elsewhere, not a definition, so it is not held to the
property lists. If nothing on the page declares that `@id`, the reference is
reported as dangling.

Two further structured-data checks:

- Any `Question` whose `name` does not appear in the page's visible text is a
  content mismatch. Google's general structured-data guidelines require marked-up
  content to be visible to the user.
- `aggregateRating`, `reviewCount`, `interactionCount` and their relatives are
  flagged for human confirmation. Inventing them is a spam-policy violation.

**Links and crawlability.** Every internal link target is fetched and checked
for 4xx, for redirects, and for chains. Orphans are reported in two tiers:
unreachable from the homepage even after JavaScript runs is a defect;
unreachable only without JavaScript is best-practice, because Googlebot renders
but most other crawlers do not. `robots.txt` is parsed with Google's
longest-match precedence rule and tested against every sitemap URL.

**Images.** Missing `alt` (WCAG 1.1.1), missing `width`/`height`, 4xx, and a
200 KB transfer budget. That budget is a working number, not a Google rule.

**Origin hygiene.** Whether `http://` and the `www`/apex counterpart redirect
to the canonical origin, and whether an unknown path returns 404 rather than a
soft 404.

**Content quality.** Server-rendered word count against `MIN_PAGE_WORDS`, and
near-duplicate detection via Jaccard similarity over 5-word shingles at a 0.6
threshold.

**Sitemap hints.** One shared `lastmod` across every URL is the signature of a
build-time `new Date()`; Google ignores `lastmod` it cannot trust.
`changefreq` and `priority` are reported as inert, because Google has said it
ignores both.

## What no harness can test

These are the factors that will actually decide whether the `/learn` content
ranks. A clean audit is not a prediction of success.

- Backlinks and referring domains. No index of the web is available here.
- Domain authority or trust. Not a Google metric; third-party proxies need paid APIs.
- Actual rankings, impressions and clicks. Only Search Console answers this, over months.
- Whether AI Overviews absorb the clicks on these queries. `docs/seo/search-demand.md` §7.3 already flags this as a material risk to the whole strategy.
- Search volume. No keyword tool on this machine.
- Field Core Web Vitals (CrUX). Needs 28 days of real traffic at volume. Everything this harness reports is lab data.
- Whether the content is accurate, or whether Google's helpful-content systems consider it helpful. This audit measures structure, not truth.

## Deviations from `docs/rules/code.md`

The 150-line file cap does not apply cleanly to a single-file CLI, for the same
reason `scripts/seo-index-audit.ts` runs to 396 lines: the script is the unit of
delivery, and splitting it would produce modules that are only ever imported
together. The type assertions in the browser-context code (`performance
.getEntriesByType('resource') as PerformanceResourceTiming[]`, the `window
.__seoAudit` accessor) are at the boundary between typed Node code and the
untyped page, which the rules permit.

`scripts/seo-audit.ts` also injects a one-line `__name` identity shim before
every `page.evaluate`. tsx compiles with esbuild's `keepNames`, which rewrites
named arrow functions to call a `__name` helper that does not exist inside the
browser. The shim is the smallest fix that keeps the in-page code type-checked
rather than smuggled in as a string.

## Last run

Production, `https://octokeen.com`, 2026-08-24. 25 sitemap URLs. Complete run,
no flags. Fixes were landing on production during this session, so re-run before
treating any of these numbers as current.

### **Score: 86.8 / 100** — 190.0 of 219 weighted points across 72 checks

| Category | Score | Points |
|---|---|---|
| Media | 100.0% | 6.0 / 6 |
| Metadata | 98.3% | 29.5 / 30 |
| Indexability | 94.1% | 71.5 / 76 |
| Sitemap & robots | 88.9% | 8.0 / 9 |
| Content | 87.4% | 19.2 / 22 |
| Links & crawl | 83.8% | 16.8 / 20 |
| Canonicalization | 75.0% | 15.0 / 20 |
| Performance | 66.8% | 10.7 / 16 |
| Structured data | 67.0% | 13.4 / 20 |

The 29.0 points lost, worst first. `failing` is failing subjects of subjects
evaluated; checks weighted 5 or more are subject to the dilution floor.

| Check | Weight | Failing | Points lost |
|---|---|---|---|
| `CANONICAL_MISMATCH` | 10 | 4/25 | 5.00 |
| `SITEMAP_NOINDEX` | 9 | 2/25 | 4.50 |
| `JSONLD_CONTENT_MISMATCH` | 4 | 25/25 | 4.00 |
| `ORPHAN` | 6 | 2/25 | 3.00 |
| `THIN_CONTENT` | 5 | 4/25 | 2.50 |
| `TBT_POOR` | 2 | 25/25 | 2.00 |
| `LCP_POOR` | 4 | 7/25 | 1.12 |
| `LCP_NEEDS_WORK` | 2 | 14/25 | 1.12 |
| `NO_WEBSITE_ENTITY` | 1 | 1/1 | 1.00 |
| `LOGO_TOO_SMALL` | 1 | 1/1 | 1.00 |
| `RENDER_BLOCKING` | 1 | 25/25 | 1.00 |
| `SITEMAP_LASTMOD_UNIFORM` | 1 | 1/1 | 1.00 |
| `JSONLD_DANGLING_ID` | 1 | 15/25 | 0.60 |
| `DESCRIPTION_TOO_SHORT` | 1 | 7/25 | 0.28 |
| `OG_INCOMPLETE` | 1 | 6/25 | 0.24 |
| `NO_H1` | 3 | 2/25 | 0.24 |
| `LINK_REDIRECT` | 1 | 7/30 | 0.23 |
| `CLS_NEEDS_WORK` | 2 | 1/25 | 0.08 |
| `HEADING_SKIP` | 1 | 1/25 | 0.04 |

Raw finding counts for the same run:
`defect: 44 | best-practice: 106 | preference: 1 | info: 1`.

Five checks account for 19.0 of the 29.0 points lost, and four of the five are
one code change each. Note the shape of it: `CANONICAL_MISMATCH` costs 5.00 on
4 of 25 URLs while `JSONLD_CONTENT_MISMATCH` costs 4.00 on all 25, because the
first decides whether a URL can be indexed and the second decides whether a
retired rich result renders.

### Measurement noise

Do not read small movements as progress. Between two complete runs 90 minutes
apart, with the site unchanged in every respect these checks measure, the score
moved 86.9 to 86.8 purely from LCP variance over the public internet: one page
crossed the 2500 ms line and `LCP_NEEDS_WORK` went from 12/25 to 14/25.
Anything under about half a point is noise. The structural checks are
deterministic and do not drift.

### Defects

| Code | Count | Where | What |
|---|---|---|---|
| `JSONLD_CONTENT_MISMATCH` | 25 | `src/app/layout.tsx:127` | The `FAQPage` node is emitted from the root layout, so all 25 URLs claim FAQ content. Only `/pricing` displays any of it, and even there the third question is not on the page. |
| `CANONICAL_MISMATCH` | 4 | `src/lib/metadata.ts:16`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` | `/pricing`, `/contact`, `/login` and `/register` canonicalize to the homepage. `createAppMetadata` sets no `alternates.canonical`, so the root layout's `canonical: APP_URL` is inherited. |
| `NO_H1` | 2 | `src/app/get-started/`, `src/app/(auth)/login/` | No h1 in server-rendered HTML, and none after hydration either. |
| `SITEMAP_NOINDEX` | 2 | `src/lib/seo/sitemap-entries.ts` | `/login` and `/register` are listed in the sitemap and carry `robots: noindex, nofollow`. |
| `ORPHAN` | 2 | `src/components/landing/LandingFooter.tsx` | `/pricing` and `/refund-policy` have no internal link path from the homepage in either the raw or the hydrated DOM. |
| `LOGO_TOO_SMALL` | 1 | `src/app/layout.tsx:122` | `Organization.logo` is `favicon.svg`, a 32x32 viewBox, under Google's documented 112x112 minimum. `public/logo.png` is 512x512 and `buildOrganizationJsonLd` in `src/lib/seo/structured-data.ts` already points at it, but nothing calls that builder. |
| `SITEMAP_LASTMOD_UNIFORM` | 1 | `src/lib/seo/sitemap-entries.ts:149` | `lastModified` defaults to `new Date()`, so every URL claims it changed at build time. False for every page that did not change in that build. Weight 1: the only consequence is that Google discards the hint. |

### Rendered metrics

Chromium, iPhone 14 emulation, 4x CPU throttling over Slow 4G. Lab data, not
CrUX. Transfer is 756 to 819 KB on every page.

| | Best | Worst | Median |
|---|---|---|---|
| LCP | 2380 ms (`/learn/personal-finance`) | 11520 ms (`/get-started`) | 2808 ms |
| CLS | 0 | 0.1267 (`/learn/space-astronomy/spaghettification`) | 0.0038 |
| TBT | 1623 ms (`/learn`) | 4166 ms (`/get-started`) | 2061 ms |

TBT is above Lighthouse's 600 ms band on all 25 URLs. The LCP element on every
`/learn` page is a paragraph that paints at FCP, so LCP there is bounded by how
long the main thread is busy, not by an image. Two CSS chunks are
render-blocking on every page.

`/get-started` and `/pricing` are the only pages whose LCP element is an image.
