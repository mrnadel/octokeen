# Search demand research: which course to publish first

**Date:** 2026-08-23
**Method:** 54 live web searches, SERP composition read qualitatively. Content sampled directly from `src/data/course/professions/*/units/*.ts`.
**No search-volume data.** There is no Ahrefs/SEMrush/GKP access on this machine. Every claim below is traceable to a SERP I actually observed or a file I actually read. There is not a single estimated volume number in this document, on purpose.

---

## 1. The single most important finding

**Personal Finance is the worst of the three courses to publish first, and it is not close.**

Personal finance is the canonical YMYL ("Your Money or Your Life") vertical. Google applies its heaviest trust weighting there, and it shows up in every single finance SERP I ran. Across 14 finance queries, the top 8 results were owned by banks (Chase, Wells Fargo, Capital One, Ally, US Bank, TD, Citizens, Discover), brokerages (Fidelity, Vanguard, Schwab, Empower), bureaus (Experian, Equifax), or mega-publishers (NerdWallet, Bankrate, CNBC, Kiplinger, Motley Fool, Ramsey, US News, NPR). A domain with no authority and 11 users does not enter that set.

The decisive test: I searched **"personal finance quiz test your money knowledge"** — the query shape that matches Octokeen's product exactly. Even *that* SERP returned Council for Economic Education, Kiplinger, AARP, NerdWallet, Fidelity, and Stanford. Finance has no soft underbelly. The quiz-modifier escape hatch that works in the other two courses does not work in finance.

Compare the same test in the other courses:

- **"cognitive biases quiz test yourself"** → quizgecko, talenttransformation.com, cognitivebiaslab.com, ethicalhq.com, ideastogo.com, cognitiontoday.com. Small independent sites, several of them single-page tools.
- **"astronomy quiz solar system practice questions"** → ProProfs (three separate results), Ducksters, free-astronomy-quiz.com, FunTrivia, kids-world-travel-guide.com. Quiz farms and children's sites, most of them visually ancient.

That is the whole strategic picture in three searches.

## 2. Recommendation: build Psychology & Human Behavior first

**Psychology first. Space & Astronomy second. Personal Finance last, and only for the narrow non-YMYL slice identified in §6.**

### Why Psychology wins

| Signal | Psychology | Space & Astronomy | Personal Finance |
|---|---|---|---|
| Queries searched | 22 | 18 | 14 |
| Winnable | 11 | 9 | 1 |
| Contested | 8 | 4 | 3 |
| Hopeless | 3 | 5 | 10 |
| Winnable ratio | **50%** | 50% | **7%** |

Psychology and Astronomy tie on raw ratio. Psychology wins the tiebreak on four grounds:

1. **Volume of winnable surface.** Psychology has 187 units against Astronomy's 149, and a much higher share of them map to standalone concepts people search by name (every named bias, every named experiment, every named theorist, every named therapy). Astronomy's winnable set is concentrated in two narrow pockets (amateur-observing gear, and weird-physics concepts); most of its conceptual core is owned by NASA, ESA, and Wikipedia.
2. **Repeat-visit intent.** Psychology's winnable queries skew toward students revising and adults self-diagnosing patterns in their own behavior. Both are recurring-visit behaviors. Astronomy's winnable queries skew toward one-time equipment research — someone who buys a telescope does not come back.
3. **No mega-authority incumbent to displace.** Astronomy's SERPs almost always contain NASA or ESA. Psychology's winnable SERPs mostly do not contain APA; the incumbents are SimplyPsychology, Verywell Mind, PositivePsychology, Study.com, Vaia, and a long tail of therapy-practice marketing blogs. Those are beatable.
4. **Format fit.** The psychology topics that rank weakest are exactly the ones where an interactive "can you spot the bias in this scenario?" widget is a genuinely better answer than prose — and Octokeen's scenario question type already produces that content.

### The one real risk in choosing Psychology

Clinical psychology (depression, anxiety, PTSD, schizophrenia, eating disorders, medication) is YMYL-health and gets the same treatment finance gets. Sections 11 and 12 of the psychology course are almost entirely clinical. **Do not start there.** Start with sections 6 (biases), 3 (learning), 4 (memory), 9 (social influence), and 13 (applied/consumer/workplace), which are cognitive and social rather than clinical.

## 3. Ranked build list

Everything below is a topic I actually searched. Sorted by build priority: winnability × intent fit × content already existing in the repo.

### Tier 1 — build these first (winnable, strong content, format fits)

| # | Topic | Course / source section | SERP I observed | Page shape |
|---|---|---|---|---|
| 1 | Classical vs operant conditioning | psy §3 learning | psypost, YourDictionary, ChoosingTherapy, Indeed, tutor2u, lonestarmentalhealth, **Scribd ×2** | Written comparison table + worked examples, then quiz |
| 2 | Reinforcement schedules (fixed/variable, ratio/interval) | psy §3 `Reinforcement Schedules` | **Studocu**, Lumen OER ×3, SimplyPsychology, btexamreview, Brainscape | Written explainer + the four response-curve shapes as SVG, then quiz. Exam-revision intent — quiz is *not* a mismatch here |
| 3 | Confirmation bias examples in everyday life | psy §6 `Confirmation and Availability Bias` | **arXiv PDFs ×3**, Medium, a stray PDF, Scribbr, helpfulprofessor. Google has nothing good | Genuinely the weakest SERP I saw all day. Written examples list, then scenario quiz |
| 4 | Sunk cost fallacy examples | psy §6 `Sunk Cost Bias` | Grammarly, Scribbr, NIH blog, Indeed, **amoeboids.com** (a Jira plugin vendor), a Substack | Written + "which of these is sunk cost?" scenarios |
| 5 | Cognitive bias quiz / test yourself | psy §6 whole section | quizgecko, cognitivebiaslab, ethicalhq, ideastogo, cognitiontoday | **Pure interactive.** No prose needed. Highest product-intent match in the entire research |
| 6 | Left brain / right brain myth | psy §16 `Left Brain, Right Brain: Myth vs Reality` | invent.org, U-Utah, Wharton, themindcompany, a Substack, Hacker News, **a spam PDF on a NZ government domain** | Written myth-vs-fact, then quiz |
| 7 | Erikson's 8 stages | psy §10 `Erikson's 8 Life Challenges` | HelpGuide, newvisionpsychology.com.au, PositivePsychology, Wikipedia, ResearchGate, a psychiatry practice blog, academia.edu | Written stage table + quiz. SimplyPsychology notably absent |
| 8 | Telescope collimation (Newtonian) | astro §12 `Telescope Setup and Alignment` | Sky at Night, Houston Astro Society, Sky & Telescope, **astro-baby.com**, starfieldview.com, opticalmechanics.com | Written step-by-step with diagrams. Do **not** put a quiz first — this is a task, not a lesson |
| 9 | Telescope aperture vs magnification | astro §12 `Telescope Specs` | **Cloudy Nights forum at position 1**, highpointscientific, astrobackyard, telescopeguide.org, skiesandscopes, **Quora** | A forum thread outranking everything means Google found no good page. Written answer + a small aperture/magnification calculator |
| 10 | Star hopping / finding objects | astro §12 `Finding Objects: Star Hopping and GoTo Mounts` | lovethenightsky, starhopping.org, starlust, milwaukeeastro.org (an astronomy club), visitastronomy | Written how-to with star charts |
| 11 | Spaghettification | astro §7 `Spaghettification and Hawking Radiation` | Big Think, Wikipedia, **arXiv PDFs ×2**, Goodreads, an EPFL concept-graph page, **a University of Michigan student art project** | Written explainer with a tidal-force diagram |
| 12 | How rockets work in a vacuum | astro §9 `How Rockets Work` | spacecentre.nz, Straight Dope, factually.co, Brainly, Pearson, kroneckerwallis, **flatearth.ws**, studyaround.blog, Scribd | Written misconception-buster. Very weak SERP |

### Tier 2 — build after Tier 1 lands (contested, but a better page can place)

| # | Topic | Course | SERP note |
|---|---|---|---|
| 13 | Dunning-Kruger effect | psy §6 | Britannica + Psychology Today + Decision Lab, but also **Splunk's blog** and three Substacks. Beatable with a genuinely better page |
| 14 | Milgram experiment (summary + criticism) | psy §9 `Obedience and Authority` | Vaia, SimplyPsychology, structural-learning, Britannica. Study-aid sites rank — that is Octokeen's exact shape. Include the Gina Perry data-manipulation critique; most incumbents don't |
| 15 | Attachment styles | psy §10 | Cleveland Clinic, but also wellnessdynamics.co.uk, helloplentiful.com, attachmentproject.com, brewtifulliving.com |
| 16 | Anchoring bias | psy §6 | SimplyPsychology owns it, but MasterClass, InsideBE, and a small university blog also rank |
| 17 | How to break a bad habit / habit loop | psy §3 `Habits` | PsychToday, NYP, HelpGuide — but also **WhoWhatWear** (a fashion site), samuelthomasdavies.com, mindjournals, mooremomentum, Scribd |
| 18 | Cialdini's principles of persuasion | psy §9 `Persuasion Techniques` | cxl.com, Indeed UK, suebehaviouraldesign, gustdebacker.com, cognitigence.com. Marketing-blog territory, all beatable |
| 19 | Neutron star vs pulsar vs black hole | astro §7 | **Quora at position 1**, Universe Guide, littleastronomy.com, and four arXiv papers. Weak, but low intent |
| 20 | Dark matter evidence | astro §8 | arXiv, DOE, and **opticalmechanics.com occupying three of the top six slots** with near-duplicate AI-farm pages. Thin SERP for a huge topic |
| 21 | Redshift and blueshift | astro §4 | **Vaia at position 1**, space.com, ScienceABC, Medium, LCO, a Wikipedia *disambiguation* page |
| 22 | Fermi paradox solutions | astro §14 `SETI and the Fermi Paradox` | Cambridge Core, phys.org, a Berkeley professor's personal page, Medium, **Goodreads ×2** |
| 23 | Big Five / OCEAN | psy §8 | SimplyPsychology + PositivePsychology + Cleveland Clinic, but quizvex.com, actionableself.com, bigfive.ly also rank |
| 24 | Change blindness / inattentional blindness | psy §2 | Study.com, PubMed, APA, Yale demos, ScienceDirect, Wiley, PhilPapers. **Entirely academic — no consumer-grade explainer exists.** Clear gap, but needs an interactive demo to justify the page |
| 25 | Smartphone astrophotography of the Moon | astro §12 | space.com, Sky at Night, TechTimes, Medium, skiesandscopes, visitastronomy |
| 26 | What can you see with a 6-inch Dobsonian | astro §12 | **Stargazers Lounge forum**, telescopeguides.com, opticalmechanics ×2, Explore Scientific's own product page. Only six results returned at all |
| 27 | Spaced repetition / memory techniques | psy §4 `Memory Strategies That Work` | e-student, growthengineering, maestrolearning, BCU, collegeinfogeek, magneticmemorymethod, tutorlyft. All small. **Meta-relevant: Octokeen is itself spaced repetition, so this page converts** |
| 28 | Dark patterns in UX | psy §13 `Dark UX Patterns` | Eleken, UX Design Institute, uxtigers, UX Collective, uxplaybook. Professional-designer intent, not learner intent — lower conversion fit |
| 29 | Psychology of overspending | fin §2 `The Psychology of Spending` | Freedom Debt Relief, due.com, US News, and three small advisor blogs. **The only finance-adjacent topic with a soft SERP — because the angle is psychological, not financial** |

### Tier 3 — hopeless, do not build

Confirmed by direct search. Every one of these returned a top-8 owned entirely by institutions a new domain cannot displace.

**Finance (10 of 14 searched):** Roth vs traditional IRA (Vanguard/Schwab/Fidelity/Empower), APR vs APY (Equifax/Capital One/Fidelity/Marcus/NerdWallet), credit utilization ratio (Chase/TD/Experian/CNBC/Bankrate/Equifax), debt snowball vs avalanche (Discover/CNBC/Wells Fargo/Fidelity/Experian), emergency fund size (Chase/Fidelity/CNBC/Wells Fargo/Experian/NerdWallet/Ally), how to build credit from zero (Citi/Regions/Experian/Motley Fool), lifestyle creep (Ally/Fidelity/US News/NPR/Nasdaq), salary negotiation (NY Dept of Labor/Harvard HBS/Harvard PON/Robert Half/Indeed), compound interest (CFPB/Bankrate/Fidelity/Ramsey), the 4% rule (Prudential/NY Life/Citizens/Wikipedia/Stanford).

Two more finance topics are *contested-hard* rather than outright hopeless — 50/30/20 budget and zero-based budgeting both had a few small sites in the top 10 (solutions.bank, switchwize.com, waypointbudget.com) — but both SERPs also carry NerdWallet's and Ramsey's calculators, and neither is worth the effort ahead of Tier 1.

**Astronomy (5 of 18):** moon phases (NASA/Planetary Society/NatGeo/USNO), why Earth has seasons (NOAA/NWS/Climate.gov/EarthSky), what is a light-year (NASA ×2/Britannica/CNN/Space.com), exoplanet transit method (NASA/ESA/PBS/Planetary Society), astronomy solar-system quiz (ProProfs and kids' sites own it, and the audience is children, not adults).

**Psychology (3 of 22):** free online psychology courses (Coursera/Alison/Class Central — aggregator territory), replication crisis (PMC/Wikipedia/Noba/EBSCO — academic, and thin real-world demand), decision fatigue (Cleveland Clinic/Kaiser/AMA/Atlassian/Wikipedia — health YMYL).

---

## 4. The intent-mismatch problem — read this before building any page

This is the failure mode most likely to waste the build. **A quiz is not an answer.** Someone who searches "how do I collimate my telescope" and lands on a lesson gate will bounce in three seconds, and the bounce will be read as a quality signal.

Three page shapes, and which topics get which:

### Shape A — Answer-first, lesson CTA below the fold
The page must contain a complete, self-sufficient written answer that satisfies the query without any interaction. The lesson CTA appears only after the reader has what they came for.

Use for anything phrased as a question or a task: collimation (#8), aperture vs magnification (#9), star hopping (#10), rockets in a vacuum (#12), break a bad habit (#17), astrophotography (#25), what you can see with a 6-inch Dob (#26), spaced repetition (#27), emergency-fund-style how-to content generally.

### Shape B — Explainer with the interactive as reinforcement
A written explainer that stands alone, followed by an embedded 3-5 question check that reinforces rather than gates. This is the default for concept and definition topics.

Use for: classical vs operant (#1), reinforcement schedules (#2), confirmation bias (#3), sunk cost (#4), left/right brain (#6), Erikson (#7), spaghettification (#11), Dunning-Kruger (#13), Milgram (#14), attachment styles (#15), anchoring (#16), Cialdini (#18), dark matter (#20), redshift (#21), Fermi paradox (#22), Big Five (#23).

### Shape C — Interactive is the answer
The query itself asks for the interaction. Prose is optional and should be short.

Use for: cognitive bias quiz (#5), and any future "test yourself on X" page. **This is the only shape where the product is the SEO asset**, and it is also the shape with the weakest competition. If only one thing gets built, build #5.

### The exam-revision exception
Reinforcement schedules (#2), Piaget, Milgram, and the rest of the AP-Psychology-shaped topics are searched by students revising. For them, quiz *is* the intent. The SERPs confirm it: Quizlet, Brainscape, Studocu, Vaia, Study.com, ProProfs, Sporcle all rank on these queries with genuinely poor pages. Octokeen's question bank is better content than any of them. This is the most under-exploited seam found in this research.

---

## 5. A blocker the build agent must handle

The repo content is **not publishable as-is.** Measured directly:

- Teaching-card explanations average **120-200 characters** — one or two sentences each.
- Total prose per lesson, counting every question stem, option, explanation and distractor explanation: **~268 words (finance), ~321 (psychology), ~313 (astronomy).**

A single lesson rendered to a page is thin content and will not rank. The unit is the smallest viable publishing granularity: a 5-6 lesson unit yields roughly 1,500-1,900 words of raw material, and even that is fragmented across quiz scaffolding rather than written as prose.

**Implication:** every SEO page needs written prose that does not currently exist in the repo. The unit content is the *skeleton and the fact-check*, not the page. Budget for writing, not just for rendering. Publishing 187 auto-generated unit pages would be a mass-thin-content event on a domain with no authority to absorb it — start with 10-15 hand-written pages from Tier 1.

---

## 6. US-specific content constraint

Personal Finance is heavily US-bound. Counted occurrences across `personal-finance/units/*.ts`:

| Term | Occurrences |
|---|---|
| IRA | 530 |
| Roth | 476 |
| 401(k) / 401k | 434 |
| Social Security | 234 |
| IRS | 178 |
| FDIC | 137 |
| HSA | 110 |
| W-2 | 108 |
| FICO | 94 |
| S-Corp | 84 |
| 1099 | 76 |
| 529 | 56 |
| Medicare | 53 |

**21 of the 37 finance section files** contain 401(k), IRS, or FICO. The whole of sections 5 (taxes), 7 (credit), 12 (retirement), 13 (estate) and 14 (business) is US-jurisdiction content. Any finance page drawn from those sections can only target US search, cannot be marketed to UK/EU/CA/AU/IN audiences without rewriting, and inherits the hardest possible SERP competition. This compounds the §1 finding rather than being a separate issue.

The non-US-bound finance slice is small: sections 1-3 (money concepts, spending psychology, saving behaviour), section 6 (debt payoff *strategy*, not US loan products), and section 19 (behavioral finance / investor biases). Note that these are precisely the sections whose topics are psychological rather than product-specific — and #29 above shows that is also the only finance topic with a soft SERP.

Psychology and Astronomy are essentially jurisdiction-neutral. Minor exceptions: psychology's therapy and medication sections use US clinical framing (DSM, US licensure), and astronomy's northern-hemisphere observing content needs a hemisphere note. Neither is a targeting constraint.

---

## 7. Honest limits of this research

**What this research is.** A qualitative read of 54 live SERPs, plus a direct audit of what content actually exists in the repo. It answers "who would I have to beat, and how strong are they?" — which is the question that actually decides whether to build.

**What it is not, and cannot be, without paid tooling:**

1. **No search volumes. None.** I do not know whether "spaghettification" is searched 200 times a month or 20,000. Every topic above is ranked by *winnability*, not by traffic potential. A perfectly winnable topic with 40 searches a month is worthless, and this document cannot tell you which of the Tier 1 topics those are. This is the single biggest gap.
2. **No keyword difficulty or backlink data.** "Weak-looking SERP" is my read of page quality and domain recognisability. A tiny site can still hold position 1 on a strong backlink profile I cannot see.
3. **No SERP feature data.** The search tool returns organic links only. I could not observe People Also Ask boxes, featured snippets, video carousels, or AI Overviews — and AI Overviews in particular may be absorbing most of the clicks on exactly the definitional queries in Tier 1. **This is a material risk to the whole strategy** and is the one thing worth checking manually before building: open five Tier 1 queries in a real browser and see how far down the organic results start.
4. **Results are US-localised.** The search tool serves US results. UK/EU SERPs for the same queries may differ, which matters given §6.
5. **No click-through modelling.** Ranking third on a query where an AI Overview answers the question fully is worth close to nothing.
6. **Sample bias.** I chose 54 queries from a topic space of ~530 units. I deliberately weighted toward topics that *look* searchable, which inflates the apparent quality of the opportunity set across all three courses roughly equally — so the *comparison* between courses holds, but the absolute hit rate does not.

**What paid tooling would settle, in priority order:** volume for the 12 Tier 1 topics (would immediately reorder the list, and might eliminate half of it); keyword difficulty on Tier 2 to confirm the "beatable" calls; and AI Overview presence per query, which is a genuine existential question for definitional content in 2026.

**What I'd do in the meantime:** build the 12 Tier 1 pages, ship them, and let Google Search Console supply the volume data for free over 60-90 days. With 11 users and no ad budget, GSC impressions on 12 real pages is better data than any tool would give you, and it costs nothing but the build.
