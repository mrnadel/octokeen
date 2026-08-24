# Why every page blocks the main thread for two seconds

**Date:** 2026-08-24
**Scope:** Why octokeen.com pages take 2 s of blocked main thread and up to 7.5 s to reach LCP on a mid-tier phone, and what to do about it in priority order.
**Method:** Chromium, iPhone 14 emulation, Lighthouse mobile throttling (4x CPU, 1.6 Mbit/150 ms RTT). Measured against **live octokeen.com** and against the local production build on `:3121`. Every number below was measured, not estimated, unless it says otherwise. Each fix was A/B tested by disabling the suspected cause and re-measuring, so the "expected effect" column is a measurement, not a guess.

## How to read this

Three separate questions get three separate answers, and the report keeps them apart:

| Column | Means |
|---|---|
| **Real UX** | A user on a mid-tier phone would notice this. Worth doing regardless of Google. |
| **Plausible ranking** | LCP and CLS are Core Web Vitals. Google uses field (CrUX) data, which Octokeen does not have and will not have soon. Marked where the mechanism is real but the payoff is speculative. |
| **Scoreboard** | Moves a lab number. No user notices. Listed so it is visible, not to be chased. |

**The honesty caveat, up front.** TBT is a lab proxy for INP. INP is the actual Core Web Vital and is measured from 28 days of field data. Octokeen has 11 users, so there is **no CrUX record for this origin and will not be one for a long time**. Nothing in this document should be sold as a ranking win. The case for doing most of it is that a two-second blocked main thread on a 4x-throttled phone is a genuinely unpleasant experience for exactly the audience this app targets — people doing five-minute lessons on a phone — and that the two biggest fixes are cheap.

---

## 1. The headline: the biggest single item is not JavaScript you wrote

### 1.1 The shared bundle

Every one of the 25 sitemap URLs loads an identical floor of JavaScript. Measured from the local production build (`.next` chunk sizes, gzip as served):

| Chunk | Raw | Gzip | What it is |
|---|---:|---:|---|
| `0d_wsr3fwih0-.js` | **638,388 B** | **138,836 B** | **`src/data/course/course-meta.ts` — every unit and lesson title for all four courses** |
| `0lti660swrj~l.js` | 233,018 B | 72,577 B | react-dom client runtime |
| `0c7la7ud1qx_n.js` | 137,246 B | 37,304 B | Next App Router client runtime |
| `17lspm.dtkfjh.js` | 136,377 B | 44,551 B | framer-motion |
| `03~yq9q893hmn.js` | 112,594 B | 39,392 B | legacy polyfills — served `noModule`, **modern browsers never fetch it** |
| `0vct-da6ybkg6.js` | 88,818 B | 26,375 B | next-auth client + session plumbing |
| 12 others | 344,493 B | 88,833 B | stores, Paddle/ad glue, misc |
| **Total shared floor** | **1,640,934 B** | **447,868 B** | of which ~409 KB actually transfers (polyfills excluded) |

**The single biggest contributor to the shared bundle is `course-meta.ts` at 638 KB raw / 138.8 KB gzipped — 39 % of the shared JavaScript, on every page including `/about`, `/privacy` and all 12 `/learn` guides that never touch course data.**

It is confirmed present on `/`, `/pricing`, `/learn`, `/learn/space-astronomy/spaghettification` and `/about` — the chunk appears in the `<script>` list of all five.

Measured cost at 4x CPU throttle, with download excluded (fetched first, then evaluated from a blob in a CSP-bypassed context):

- **52 ms** to compile and register
- **85 ms** to execute the module factory — i.e. to construct the 638 KB array literal
- **~690 ms** of Slow-4G download time for its 138.8 KB, competing with everything else on the critical path

So it costs roughly **140 ms of main thread and 0.7 s of bandwidth on every page**, and on public pages it buys nothing at all.

### 1.2 Why it is in the shared bundle — two paths, both must be cut

`src/app/layout.tsx` mounts two client components that reach it:

1. `src/components/dev/DebugTierToggle.tsx:8` — `import { getTotalLessonsMeta, loadUnitData, courseMeta } from '@/data/course/course-meta'`. The component returns `null` in production (line 354), but that is a *render-time* guard. The import graph ships regardless.
2. `MixpanelProvider` → `src/store/useStore.ts:16` → `src/store/useCourseStore.ts:5` — `import { loadUnitData, getCourseMetaForProfession } from '@/data/course/course-meta'`.

**Removing `DebugTierToggle` alone would not drop the chunk.** Both edges have to go. This is the most commonly-missed part of the fix.

### 1.3 What is inside it

`course-meta.ts` statically imports all four courses:

| Source file | Size |
|---|---:|
| `src/data/course/professions/personal-finance/meta.ts` | 255,726 B |
| `src/data/course/professions/psychology/meta.ts` | 228,392 B |
| `src/data/course/professions/space-astronomy/meta.ts` | 173,068 B |
| mechanical-engineering, inlined in `course-meta.ts` itself | 112,903 B |

A signed-in learner needs **one** of these. A visitor to `/pricing` or a `/learn` guide needs **none**. Mechanical engineering is access-gated (`requiresAccess`) and still ships to every anonymous visitor.

---

## 2. The biggest LCP problem is not an image — it is that the LCP element starts invisible

`/get-started` (11,520 ms) and `/pricing` were the two worst LCP pages in the audit, and the two where the LCP element is an `<img>`. The natural assumption is image weight. **That assumption is wrong.**

| Image | On disk | Served |
|---|---:|---:|
| `public/mascot/upgrade-pro.png` (`/pricing` LCP) | 25,304 B | 25,304 B |
| `public/mascot/winking.png` (`/get-started` LCP) | 7,136 B | 7,136 B via `/_next/image` |

Seven and twenty-five kilobytes. These images are not the problem.

The problem is that both sit inside a framer-motion wrapper with an `initial` state of `opacity: 0`, and framer-motion serialises that into the server-rendered HTML:

```
$ curl -s https://octokeen.com/pricing | grep -o '<div class="text-center mb-6"[^>]*>'
<div class="text-center mb-6" style="opacity:0;transform:translateY(20px)">
```

- `src/app/(app)/pricing/page.tsx:211` — `<motion.div initial={{ opacity: 0, y: 20 }}>` wrapping the hero and its `<img>`
- `src/app/get-started/GetStartedStepHeading.tsx:9` — `MASCOT_ENTER = { initial: { scale: 0.5, opacity: 0 } }` wrapping the `<Mascot>`

**19 elements are server-rendered at `opacity:0` on `/pricing`, 10 on `/`.** They cannot paint until React hydrates and framer-motion runs the entrance animation. LCP is therefore bounded by hydration of a 1.6 MB bundle, not by the image.

`/learn` pages, which have **zero** `opacity:0` elements in their SSR output, have LCP == FCP. That is the control group, and it confirms the mechanism.

**A/B proof.** Injecting `[style*="opacity:0"]{opacity:1 !important;transform:none !important}` before first paint, everything else identical, on live production:

| Page | LCP baseline | LCP with hero visible | Delta |
|---|---:|---:|---:|
| `/pricing` | 7,468 ms | **3,416 ms** | **−4,052 ms (−54 %)** |
| `/get-started` | 6,208 ms | **3,084 ms** | **−3,124 ms (−50 %)** |

In both cases LCP collapses to roughly FCP. This is the single largest available win in the app and it is a handful of lines.

Secondary, on `/get-started` only: `Mascot` accepts a `priority` prop (`src/components/ui/Mascot.tsx:63`) and `GetStartedStepHeading` never passes it, so the LCP image is `loading="lazy"` — its request does not even start until layout runs after hydration. Fixing the opacity makes this matter; fix both together.

---

## 3. Third-party scripts are half the blocked main thread

Measured on live production, same throttling, by aborting requests at the network layer:

| Page | Baseline TBT | AdSense blocked | AdSense + Cloudflare blocked |
|---|---:|---:|---:|
| `/pricing` | 1,845 ms | 1,197 ms (−648) | **877 ms (−968 total, −52 %)** |
| `/learn/space-astronomy/spaghettification` | 2,144 ms | 1,707 ms (−437) | **1,506 ms (−638 total, −30 %)** |
| `/` (local build) | 1,412 ms | 842 ms (−570, −40 %) | — |

CPU self-time attribution from a sampled profile on production, per page:

| Script | Self time |
|---|---:|
| `pagead2.googlesyndication.com/.../show_ads_impl_fy2021.js` | 320–342 ms |
| `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` | 190–196 ms |
| `/cdn-cgi/challenge-platform/scripts/jsd/main.js` (Cloudflare bot detection) | **473–523 ms** |
| `static.cloudflareinsights.com/beacon.min.js` | 47–56 ms |
| **Third-party total** | **~1,030–1,120 ms** |

Transfer cost of AdSense, measured from resource timing: **235–236 KB and 9–10 extra requests on every page**, which is 22–28 % of total page weight.

Three separate observations, kept separate because they are three different decisions:

**3.1 AdSense.** ~520 ms of main thread and ~236 KB on every page. It is loaded from an inline script in `src/app/layout.tsx:147-157` that does `document.head.appendChild` during HTML parse — i.e. it is requested *before* the app's own JavaScript, competing for bandwidth on the critical path. On a site with 11 users and no ad revenue this is pure cost. **That is the owner's call and this document does not make it.** The number is 520 ms of CPU, 236 KB, and roughly 1 s of LCP on `/pricing` (7,468 → 6,240 ms with ads blocked). If ads stay, moving the injection to fire after `load` instead of during parse recovers most of the critical-path contention at no revenue cost.

**3.2 Cloudflare's bot-detection script is the single most expensive third party, at ~500 ms.** `/cdn-cgi/challenge-platform/scripts/jsd/main.js` is injected by Cloudflare, not by this codebase. It is Bot Fight Mode / JS Detections. It costs more main thread than AdSense does and it is a dashboard toggle, not a code change. This did not appear in the local measurements because it only exists on the proxied production domain — worth knowing, because it means local profiling systematically under-reports production TBT by ~25 %.

**3.3 Sentry, Mixpanel and Paddle are all fine.** Verified rather than assumed:

- **Sentry ships nothing to the client at all.** `grep -lF "@sentry" .next/static/chunks/*.js` and `grep -lF "sentry-trace"` both return nothing. `sentry.client.config.ts` exists but Next 16 expects `instrumentation-client.ts`, so it is never picked up. Zero perf cost — and also **zero client-side error reporting**, which is a correctness bug worth a separate ticket, not a performance one.
- **Mixpanel is correctly deferred.** `src/lib/mixpanel.ts:17` loads it via `await import('mixpanel-browser')` and only after cookie consent. It does not appear on the critical path.
- **Paddle** is in a shared chunk (~66 KB raw / 21 KB gzip, alongside ad glue) but shows only ~115 ms of self time and only on pages that use it.

---

## 4. The CLS on the spaghettification guide is font swap, not an ad

Reproduced exactly on production: **CLS = 0.1267 at 3,114 ms**, attributed to `p.mt-4.rounded-2xl` — the answer paragraph at `src/app/learn/[course]/[guide]/page.tsx:68`.

The shift geometry gives it away:

```
P.mt-4.rounded-2xl  y=233 h=431  ->  y=263 h=401
#text (reading time) y=201 h=16  ->  y=231 h=16
```

Everything above moves down exactly 30 px, and the paragraph itself gets 30 px *shorter*. One line gained above, one line lost below. That is a re-wrap, and a re-wrap at 3.1 s is the web font arriving.

`next/font` generates a metric-adjusted `Nunito Fallback` with `local(Arial)` plus `ascent-override`/`descent-override`. Those overrides fix *height*, so the fallback occupies the right vertical space — but they cannot fix *glyph width*, so line-break positions still change when the real font swaps in. That is the residual CLS that `display: 'swap'` always leaves behind.

**A/B proof:** blocking `**/_next/static/media/*.woff2` and re-measuring the same page gives **CLS = 0** (and, incidentally, FCP 2,520 ms with LCP == FCP). Three unblocked runs against the local build gave CLS 0 as well, because on localhost the font arrives before the reflow window — which is why this only shows up against a real network.

Not an AdSense auto-ad, which was the other plausible candidate: there are no `<ins class="adsbygoogle">` slots anywhere under `/learn` (`src/components/ads/AdUnit.tsx` is not used there), and blocking googlesyndication entirely leaves CLS at 0.1267.

---

## 5. The two render-blocking CSS chunks are a non-issue

Reported honestly because the answer is "leave it alone":

| Chunk | Raw | Gzip | What |
|---|---:|---:|---|
| `0qy801m6q-xd1.css` | 138,136 B | **21,509 B** | Tailwind v4 output for the whole app |
| `0~~d43e1zzibz.css` | 3,777 B | **1,005 B** | the `@font-face` block emitted by `next/font` |

22.5 KB gzipped, total, for all CSS on every page. Tailwind v4 already emits only the utilities the source uses; 138 KB raw across ~300 components is normal and it compresses 6.4:1. Splitting it would add requests and round trips to save single-digit kilobytes. **No action. This was worth checking and it came back clean.**

One adjacent finding that *is* actionable: **fonts are 79 KB and half of it is wasted.** Two woff2 files are preloaded on every page — Nunito latin (39,152 B) and JetBrains Mono latin (40,480 B). `--font-jetbrains` is referenced only by `font-mono`, which appears in `/progress`, `/settings`, `/admin/*` and `/certificate`. **No public or `/learn` page renders a monospace glyph, yet every one of them preloads 40 KB of monospace font on the critical path.**

---

## 6. Ranked plan

Ordered by (impact ÷ risk). Effort is wall-clock for someone who knows the codebase.

### Tier 1 — high impact, low risk. Do these first.

| # | Change | File(s) | Effect (measured) | Effort | Confidence | Category |
|---|---|---|---|---|---|---|
| 1 | **Stop server-rendering the `/pricing` hero at `opacity:0`.** Render the hero visible and let the animation be additive (animate a child, or use a CSS `@keyframes` fade that starts from `opacity:1` for the LCP element), so the `<img>` paints at FCP. | `src/app/(app)/pricing/page.tsx:211` | **LCP 7,468 → 3,416 ms (−4.0 s)** | 30 min | High — A/B'd | Real UX + plausible ranking |
| 2 | **Same for the `/get-started` mascot**, and pass `priority` to `<Mascot>` so the image is not lazy-loaded. | `src/app/get-started/GetStartedStepHeading.tsx:9,37` | **LCP 6,208 → 3,084 ms (−3.1 s)** | 30 min | High — A/B'd | Real UX + plausible ranking |
| 3 | **Turn off Cloudflare Bot Fight Mode / JS Detections** for this zone (dashboard, no code). | none | **TBT −320 to −500 ms on every page** | 10 min | High — A/B'd | Real UX |
| 4 | **Cut both static import edges into `course-meta.ts`.** Make `useCourseStore` reach it through `await import()` like `useStore.ts:151` already does, and take `courseMeta`/`getTotalLessonsMeta` out of `DebugTierToggle` (or drop the component from the root layout entirely — it renders `null` in production). | `src/store/useCourseStore.ts:5`, `src/components/dev/DebugTierToggle.tsx:8`, and `src/app/layout.tsx` if the component is unmounted | **−138.8 KB gzip and ~140 ms CPU on every page**; ~0.7 s less Slow-4G contention | 2–4 h | High on the measurement, Medium on the refactor landing cleanly | Real UX |
| 5 | **Move the AdSense injection out of the parse-time critical path** — fire it on `load` rather than `document.head.appendChild` during HTML parse. Keeps the ads, removes the bandwidth race. | `src/app/layout.tsx:147-157` | LCP −0.5 to −1 s; TBT unchanged (work is deferred, not removed) | 20 min | Medium | Real UX |

### Tier 2 — worth doing, more thought required.

| # | Change | File(s) | Effect | Effort | Confidence | Category |
|---|---|---|---|---|---|---|
| 6 | **Drop JetBrains Mono from the root layout**, or scope it to the four routes that use `font-mono`. | `src/app/layout.tsx:33-37` | −40 KB and one preload on every page | 1 h | High | Real UX |
| 7 | **Split `course-meta.ts` per profession** behind `getCourseMetaForProfession` so a learner loads one course's meta, not four. Follow-on from #4; without #4 it changes nothing. | `src/data/course/course-meta.ts` | On top of #4: a learner who does need meta loads ~150–200 KB raw instead of 638 KB | 3–5 h | Medium | Real UX |
| 8 | **`display: 'optional'` on Nunito** (or accept the shift). Eliminates the 0.1267 CLS outright; the cost is that a first-visit user on a slow connection sees Arial for the whole page load. | `src/app/layout.tsx:27-31` | **CLS 0.1267 → 0** on `/learn/*` | 15 min | High on the mechanism — A/B'd via font blocking | Plausible ranking; a *design* regression, so it is a judgement call, not an obvious win |
| 9 | **`prefetch={false}` on low-intent links** (footer `/privacy`, repeated `/try`). The guide page currently fires ~20 RSC prefetches, ~100 KB, several for the same URL under different router-state hashes. | `src/components/layout/Footer.tsx` and similar | ~100 KB less Slow-4G contention; costs instant navigation on those links | 1 h | Medium | Real UX, with a genuine tradeoff |
| 10 | **Lazy-load `CookieConsent`.** It is what drags framer-motion (136 KB raw) into the root chunk, for a banner most visitors never see. Marginal on its own because ~115 files import framer-motion, so it lands in most route chunks anyway. | `src/app/layout.tsx:167`, `src/components/ui/CookieConsent.tsx:4` | Small; only helps `/learn` and other framer-free routes | 1 h | Low | Scoreboard, mostly |

### Tier 3 — the owner's call, not an engineering call.

| # | Change | Effect | Category |
|---|---|---|---|
| 11 | **Remove AdSense entirely.** ~520 ms of main thread, ~236 KB, 9–10 requests, ~1 s of LCP on `/pricing`, on every page, for a site with 11 users and no ad revenue. This document reports the number and stops there. | TBT −437 to −648 ms; transfer −236 KB | Real UX, if the revenue tradeoff is acceptable |

### Not worth doing now

- **Splitting the CSS.** 22.5 KB gzipped total. Adding round trips to save kilobytes is a net loss. See §5.
- **Converting the mascot PNGs to WebP/AVIF, or adding `next/image` to `/pricing`'s raw `<img>`.** The LCP images are 7 KB and 25 KB. This is scoreboard-chasing that would have looked like the obvious fix and would have moved LCP by approximately zero. The lint suppression on `src/app/(app)/pricing/page.tsx:226` is fine as it stands.
- **Removing the polyfill chunk.** 112 KB raw, served `noModule`, never fetched by any browser Chromium-based auditing represents. It shows up in a directory listing and in nothing else.
- **Any attempt to reduce react-dom or the App Router runtime.** 370 KB raw combined and architectural. Next 16 with React 19 is the floor.
- **Route-level code splitting of `/get-started`'s five steps.** All five step components are statically imported into one client chunk. Real, but items 1–4 dominate it by an order of magnitude, and `/get-started` is being edited right now (see §7).

---

## 7. Sequencing: what collides with work in flight

Three agents are currently editing `src/lib/metadata.ts`, `src/lib/seo/**`, `src/app/layout.tsx`, `src/app/(auth)/**`, `src/components/landing/**`, `src/app/try/**`, `src/app/learn/**` and `src/data/learn/**`.

**Blocked on `src/app/layout.tsx` — do not start until that file is free:**

- #5 AdSense injection timing
- #6 JetBrains Mono removal
- #8 `display: 'optional'` for the CLS fix
- #10 lazy `CookieConsent`
- the `<DebugTierToggle />` unmount half of #4

**Safe to start immediately — none of these files are claimed:**

- #1 `src/app/(app)/pricing/page.tsx` — `(app)`, not `(auth)`
- #2 `src/app/get-started/**` — not under `(auth)`; confirm with the agent on `(auth)` that they read it the same way
- #3 Cloudflare dashboard — no files at all
- #4's import-graph half: `src/store/useCourseStore.ts`, `src/components/dev/DebugTierToggle.tsx`
- #7 `src/data/course/**` — distinct from the claimed `src/data/learn/**`
- #9 `src/components/layout/Footer.tsx`

**Recommended order:** #3 and #1 and #2 in parallel today (three files, no overlap, ~4 s of LCP and ~0.4 s of TBT between them), then #4's import surgery, then the `layout.tsx` batch (#5, #6, #8) as one commit once that file is released.

---

## 8. Measurement notes and caveats

- **Local `next start` on `:3121` mis-authenticates.** `/login`, `/register` and `/get-started` all 307 to `/`, and `/profile` returns 200 to an anonymous request — the local server treats every visitor as signed in. **Production is correct** (`https://octokeen.com/login` → 200, `/profile` → 307), so this is an environment artifact of that server process, not a bug. It is why all `/get-started` numbers here were taken against production.
- **Local profiling under-reports production TBT by roughly 25 %,** because Cloudflare's bot-detection script (§3.2) only exists on the proxied domain. Do not tune against localhost alone.
- **An earlier isolated parse-cost measurement returned implausible numbers (12 ms for 638 KB) because the site's own CSP blocked the injected `blob:` script.** The figures in §1.1 were re-taken with `bypassCSP: true` and the script erroring silently was verified to no longer happen. Flagged because the same trap will catch the next person who profiles this app.
- **`content-length` sums are unreliable here** — `next start` serves gzipped bodies with the uncompressed length in `HEAD`. All transfer figures use `PerformanceResourceTiming.encodedBodySize`.
- **No application code was changed.** The A/B results come from network-level request blocking and a pre-paint stylesheet injection in the measuring browser, not from edits to the repo.
- Measurement scripts live in the session scratchpad, not in the repo. They are throwaway; `scripts/seo-audit.ts` remains the durable harness.

## 9. What this does not establish

- **That any of it improves rankings.** No CrUX record exists for this origin. Core Web Vitals are a field-data signal, and there is no field data. The LCP and CLS fixes are the ones with a real mechanism behind a ranking claim, and even those pay nothing until there is traffic to measure.
- **Whether real users experience the modelled conditions.** 4x CPU / Slow 4G is Lighthouse's mid-tier-phone model, not a measurement of Octokeen's 11 users.
- **What `/get-started`'s LCP actually is for a signed-out user on production.** The audit measured 11,520 ms; this report measured 6,208 ms baseline on the same URL. Both are bad, both respond to the same fix, and the gap is probably cache warmth and ad-auction variance — but it was not run down.
