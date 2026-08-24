# AI search visibility: what is real, what is marketing

**Date:** 2026-08-24
**Scope:** How octokeen.com could earn a mention when someone asks ChatGPT, Claude, Perplexity or Google's AI features about the topics the `/learn` guides cover.
**Method:** Primary vendor documentation fetched directly where it exists, then published studies, then industry measurement. Every claim below carries a source type and a confidence grade. Where the honest answer is "nobody knows", it says so.

## How to read the confidence grades

| Grade | Means |
|---|---|
| **High** | First-party vendor documentation I fetched myself, or a study with disclosed methodology and adequate controls that I read. |
| **Medium** | Several independent measurements agreeing, methodology partly disclosed, no obvious confound. |
| **Low** | One vendor blog, undisclosed method, or a plausible mechanism with no measurement behind it. |
| **Unknown** | I could not establish it. Listed in §9 rather than dressed up. |

A grade describes the evidence, not how much I like the idea. Several things graded Low are still worth doing because they are cheap. Several things graded High are worth ignoring because they do not apply to a site this small.

---

## 1. The four things worth doing this month

### 1.1 Unblock `ChatGPT-User` in robots.txt. Ten minutes. Confidence: High.

`src/app/robots.ts` currently blocks `ChatGPT-User`. That agent is not a training crawler. OpenAI's own bot documentation describes it as the fetcher behind "user actions in ChatGPT and Custom GPTs", and states plainly that it is separate from `GPTBot` and does not feed foundation model training. Blocking it means that when a person pastes an Octokeen URL into ChatGPT, or asks ChatGPT to open a page they were just reading, the fetch is refused.

This is the only entry in the current block list that costs live visibility while protecting nothing. Same category, same reasoning: `Claude-User` and `Perplexity-User` are already unblocked and should stay that way.

Full per-agent table and reasoning in §4.

### 1.2 Verify the site in Bing Webmaster Tools and submit the sitemap. One hour. Confidence: Medium.

Bing indexation is the cheapest known floor for ChatGPT search eligibility. The caveat matters and is covered in §3.2: OpenAI has never documented what its search index is made of, and the widely repeated "ChatGPT Search uses Bing's index" is at best a partial truth in 2026, because OpenAI now runs `OAI-SearchBot` and its own index as well. But a page that is in neither Bing nor OpenAI's own crawl is very unlikely to be retrieved by anything, and Bing indexes small new domains far more readily than Google ranks them. Verification imports from Google Search Console in one click. IndexNow submission is a further small win for freshness.

This is graded Medium rather than High because the causal chain from "in Bing" to "cited by ChatGPT" is inferred, not documented.

### 1.3 Add referral measurement, because right now Octokeen can see nothing. Two hours. Confidence: High that it is currently blind, Medium on how much the measurement will show.

There is no analytics package in `package.json`. No `@vercel/analytics`, no gtag, no Plausible, nothing. Octokeen currently cannot tell the difference between an AI referral, a direct visit and a bookmark.

ChatGPT appends `utm_source=chatgpt.com` to outbound links, which makes it the one assistant that is reliably attributable. Perplexity and Gemini send ordinary referrers. Claude often sends nothing. AI Overviews send a `google.com` referrer indistinguishable from an ordinary organic click. So referral tracking catches a real but partial slice. It is still infinitely more than zero. Details and the honest ceiling in §8.

### 1.4 Check whether Google Search Console has the generative AI report for this property. Fifteen minutes. Confidence: High that the report exists, Unknown whether Octokeen has access.

Google shipped dedicated Search Generative AI performance reports in Search Console on 3 June 2026, covering impressions inside AI Overviews, AI Mode and AI features in Discover, broken down by page, country, device and date. Rollout was staged and started with a subset of properties. Data begins 18 May 2026 with no backfill, and the report is **impressions only**: no clicks, no click-through rate, no queries, no average position.

If the property has it, this is the single best free measurement Octokeen will get, because it is the only source that separates AI surface impressions from ordinary Search impressions.

### What is deliberately not on this list

Adding `llms.txt`, adding more schema markup, and rewriting guides in a "GEO-optimised" style are all absent, and §5 explains why each one failed to survive contact with the evidence.

---

## 2. The one framing that matters most

For a domain with no backlinks and no ranking history, **AI visibility is downstream of conventional search visibility, not parallel to it.** The retrieval paths that can realistically cite Octokeen this year all read from a search index. Getting into those indexes and ranking in them is the same work as SEO. There is a small, real, additional layer on top, described in §5, and it is worth doing because it is nearly free, but it is a multiplier on a base that has to exist first.

The corollary is uncomfortable and worth stating: if the twelve `/learn` guides do not rank anywhere, no amount of AI-specific optimisation will produce AI citations. The work in `docs/seo/search-demand.md` is the load-bearing work. This document is the trim.

---

## 3. The mechanics: three completely different paths

Conflating these is the most common error in GEO writing, and separating them changes almost every recommendation.

### 3.1 Path A: training data inclusion (the model's weights)

**What it is.** A crawler such as `GPTBot`, `ClaudeBot`, `CCBot`, `meta-externalagent` or `Applebot-Extended` collects pages that may be included in a pretraining or post-training corpus. If the content is included and learned, the model can produce it with no live lookup at all.

**Why this path is almost worthless to Octokeen. Confidence: High.**

Kandpal, Deng, Roberts, Wallace and Raffel, *Large Language Models Struggle to Learn Long-Tail Knowledge*, ICML 2023, established both correlational and causal relationships between a model's question-answering accuracy on a fact and the number of pretraining documents supporting that fact. Their estimate is that models would need scaling by many orders of magnitude to answer well on facts with little support in the pretraining data. Facts that appear in a handful of documents do not reliably survive into the weights.

Twelve pages on a domain with no inbound links is the definition of thin support. Meanwhile the facts those pages teach, the sunk cost fallacy, spaghettification, reinforcement schedules, already appear in the corpus thousands of times over from Wikipedia, SimplyPsychology, university course notes and textbooks. There is nothing in the guides that a model needs Octokeen to learn.

The path that could put "Octokeen" in the weights as a recommendable product is entity repetition across many independent sources, which is §7, not robots.txt.

**Second consequence.** Training paths are slow and one-way. Even in the best case, inclusion means the next model generation, months out, and cannot be reversed or corrected. Nothing you do to this path shows up this quarter.

**Third consequence, and the one that should settle the owner's dilemma.** Blocking training crawlers protects the *expression* of the guides, not the knowledge in them. The knowledge is public domain material available in a thousand places. Octokeen's actual defensible asset is the interactive product and the question bank, which is behind the app, not in the guides. Blocking `GPTBot` and `ClaudeBot` therefore costs close to nothing and protects close to nothing. It is a low-stakes decision presented by most GEO writing as a high-stakes one.

### 3.2 Path B: a dedicated search index the assistant queries

**What it is.** The assistant does not read the live web at answer time. It queries an index that a crawler built earlier, then summarises and cites what comes back. This is the path that produces almost all AI citations today.

| Surface | Index | Crawler that builds it | Documented? |
|---|---|---|---|
| ChatGPT search | OpenAI's own index, plus other sources | `OAI-SearchBot` | Agent documented, index composition **not** |
| Google AI Overviews, AI Mode | The ordinary Google Search index | `Googlebot` | Documented, High confidence |
| Perplexity | Perplexity's own index | `PerplexityBot` | Agent documented, scale claims are vendor-stated |
| Claude web search | Brave Search API, plus Anthropic's own index | `Claude-SearchBot`, Brave's crawler | Partly. See below |

**Google is the clearest and the most useful.** Google's AI features documentation, last updated 10 December 2025, states: *"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."* Eligibility is *"a page must be indexed and eligible to be shown in Google Search with a snippet, fulfilling the Search technical requirements."* This is a first-party statement that AI Overview eligibility is ordinary Google indexing, controlled by `Googlebot`, and nothing else.

**OpenAI is the most opaque.** OpenAI documents that `OAI-SearchBot` is *"used to surface websites in search results in ChatGPT's search features"*, recommends allowing it, and states it is separate and independent from `GPTBot`. What it does not document anywhere is what the ChatGPT search index actually contains, how much still comes from Bing, or how sources are ranked. The confident "ChatGPT uses Bing's index" claim you will find in every GEO blog was true at launch and is at best partial now. Treat the composition as **Unknown**.

There is one striking piece of evidence about how much opacity is involved. Semrush analysed over 230,000 prompts across ChatGPT search, Google AI Mode and Perplexity from 14 July to 12 October 2025, roughly 100 million citations, published 10 November 2025. In mid-September, when Google removed the `num=100` search parameter, ChatGPT's citation distribution shifted violently: Reddit citations collapsed from around 60% to around 10%, Wikipedia from around 55% to under 20%. AI Mode and Perplexity barely moved. A change to a Google SERP parameter should not be able to reshape ChatGPT's sources unless part of ChatGPT's retrieval was reading Google results. This is a strong hint that these pipelines are stranger and less stable than any vendor describes, and a good reason to distrust anyone selling a fixed model of "how ChatGPT chooses sources".

**Claude.** Anthropic's crawler documentation, last updated 7 April 2026, names three agents: `ClaudeBot` for training, `Claude-User` for fetching pages when a Claude user's query requires it, and `Claude-SearchBot` for *"improving search result quality and relevance"*. Separately, Anthropic listed Brave Search on its subprocessor list and TechCrunch reported in March 2025 that Claude's web search appeared to be Brave-powered, corroborated by identical result sets and a `BraveSearchParams` parameter in the API. So Claude's retrieval likely runs through Brave's index at least in part. Practical implication: being crawlable by Brave matters for Claude, and Brave is not blocked by Octokeen's robots.txt.

### 3.3 Path C: live retrieval at query time

**What it is.** A user pastes a URL, or asks a question that triggers an on-demand fetch of a specific page. `ChatGPT-User`, `Claude-User`, `Perplexity-User` and `meta-externalfetcher` do this. The fetch happens because a human asked, not because a crawler scheduled it.

**Volume is low. Value per event is high.** This path does not scale, but it is the path where a person already interested in Octokeen tries to learn more via an assistant and gets a blank instead of a page. Blocking it is the worst trade in the whole robots.txt because it costs the warmest traffic there is.

**A caveat vendors state and site owners forget.** Because these fetches are user-initiated, several vendors reserve the right to ignore robots.txt. OpenAI's documentation says of `ChatGPT-User` that *"robots.txt rules may not apply"*. Perplexity's documentation says `Perplexity-User` *"generally ignores robots.txt rules"*. Meta says `meta-externalfetcher` *"may bypass robots.txt rules"*. So blocking these agents is partly symbolic: you may lose the polite fetchers and keep the impolite ones. That asymmetry argues for allowing them deliberately rather than blocking them ineffectively.

---

## 4. The crawlers, and what to do about each one

### 4.1 Octokeen's live robots.txt, fetched 2026-08-24

Confirmed live at `https://octokeen.com/robots.txt`, and matching `D:\Work\Octokeen\src\app\robots.ts`:

- `User-agent: *` allows everything except `/api/`, `/admin/`, `/checkout/`, `/settings/`, `/onboarding/`, `/invite/`, `/dev/`
- Full `Disallow: /` for: `GPTBot`, `ChatGPT-User`, `CCBot`, `ClaudeBot`, `anthropic-ai`, `Bytespider`, `PetalBot`, `ImagesiftBot`
- Full `Disallow: /` for: `Scrapy`, `MJ12bot`, `DotBot`, `BLEXBot`
- Sitemap declared

**The most important thing about this file is what is not in it.** `OAI-SearchBot`, `PerplexityBot`, `Perplexity-User`, `Claude-User`, `Claude-SearchBot`, `Google-Extended`, `Googlebot`, `Bingbot`, `Applebot`, `meta-webindexer` and `meta-externalagent` are all absent and therefore allowed. That means the file is already close to the right shape for AI visibility: it blocks training crawlers and allows retrieval and indexing crawlers. It gets exactly one agent on the wrong side of that line.

### 4.2 The table

Function column: **T** training, **I** indexing for an assistant's search, **R** live retrieval at user request, **S** ordinary search engine.

| Agent | Operator | Function | Now | Recommend | Cost of blocking | Confidence |
|---|---|---|---|---|---|---|
| `Googlebot` | Google | S, and feeds AI Overviews and AI Mode | Allowed | **Keep allowed** | Total loss of Google, including all AI features | High |
| `Bingbot` | Microsoft | S, plausible input to ChatGPT search | Allowed | **Keep allowed** | Loses Bing, Copilot, DuckDuckGo, and probably part of ChatGPT | High |
| `OAI-SearchBot` | OpenAI | I | Allowed | **Keep allowed.** OpenAI explicitly recommends allowing it | Removal from ChatGPT search results | High |
| `ChatGPT-User` | OpenAI | R | **Blocked** | **Unblock. This is the fix** | A ChatGPT user cannot open an Octokeen page. No training benefit gained | High |
| `GPTBot` | OpenAI | T | Blocked | **Keep blocked** if the owner wants training protection. The cost is genuinely near zero | Excluded from OpenAI training. Does not affect ChatGPT search or citations | High |
| `OAI-AdsBot` | OpenAI | Ad landing page safety checks | Allowed | Keep allowed. Irrelevant unless ads are bought | Nothing today | High |
| `ClaudeBot` | Anthropic | T | Blocked | **Keep blocked.** Same reasoning as `GPTBot` | Excluded from Anthropic training. Does not affect Claude's search or fetching | High |
| `Claude-User` | Anthropic | R | Allowed | **Keep allowed** | A Claude user cannot open an Octokeen page | High |
| `Claude-SearchBot` | Anthropic | I | Allowed | **Keep allowed** | Removal from Claude's search index | High |
| `anthropic-ai` | Anthropic | Legacy token | Blocked | **Harmless, can stay.** Superseded by the three above | Nothing. It is not the live token | Medium |
| `PerplexityBot` | Perplexity | I | Allowed | **Keep allowed.** Perplexity states it is not used for foundation model training | Removal from Perplexity's index, which is its whole citation mechanism | High |
| `Perplexity-User` | Perplexity | R | Allowed | **Keep allowed.** Perplexity documents that it generally ignores robots.txt anyway | Little, because blocking it may not work | High |
| `Google-Extended` | Google | T for Gemini models, plus grounding in Gemini apps | Allowed | **Keep allowed.** See the note below, this one is widely misunderstood | Loses grounding in the Gemini app. Does **not** affect Google Search or AI Overviews | High |
| `GoogleOther` | Google | Generic R&D crawling | Allowed | Keep allowed. Low stakes either way | Nothing identifiable | Medium |
| `Applebot` | Apple | S for Siri and Spotlight | Allowed | **Keep allowed** | Loses Siri and Spotlight suggestions | High |
| `Applebot-Extended` | Apple | T opt-out token, not a crawler | Allowed | Owner's call. Blocking costs nothing visible | Excluded from Apple Intelligence training. Apple states it does not affect Apple search results | High |
| `meta-webindexer` | Meta | I for Meta AI search | Allowed | **Keep allowed** | Removal from Meta AI search | Medium |
| `meta-externalagent` | Meta | T | Allowed | **Block it** if training protection is the policy, for consistency with `GPTBot` and `ClaudeBot`. Currently it is an inconsistency | Excluded from Meta training. No retrieval cost | Medium |
| `meta-externalfetcher` | Meta | R | Allowed | Keep allowed | Meta says it may bypass robots.txt regardless | Medium |
| `facebookexternalhit` | Meta | Link preview cards | Allowed | **Keep allowed.** The existing code comment is correct | Every shared link loses its preview card | High |
| `CCBot` | Common Crawl | T corpus used by many downstream trainers | Blocked | **Keep blocked** under a training-protection policy, though it is the least consequential entry either way | Excluded from an open corpus and from academic and tooling use of it. No live retrieval path | Medium |
| `Bytespider` | ByteDance | T | Blocked | **Keep blocked.** One of the most aggressive crawlers by request volume, and reported to disregard robots.txt | Excluded from ByteDance training. No visibility cost for an English-language audience | Medium |
| `PetalBot` | Huawei | S for Petal Search | Blocked | Fine to leave blocked, but **the code comment is wrong.** It is a search engine crawler, not an AI training crawler | Loses Petal Search, which is a Huawei device surface. Negligible for this audience | High |
| `ImagesiftBot` | Hive | Image scraping | Blocked | **Keep blocked** | Nothing | High |
| `Scrapy`, `MJ12bot`, `DotBot`, `BLEXBot` | Various | Scraping, link graphs | Blocked | Keep blocked | Nothing relevant | High |

### 4.3 The Google-Extended point, because almost every GEO article gets it wrong

Google's crawler documentation, last updated 14 July 2026, states: *"Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search."* Its function is Gemini model training and grounding in Gemini apps.

Two consequences that people routinely reverse:

1. **Blocking `Google-Extended` does not remove you from AI Overviews or AI Mode.** Those are grounded in the Google Search index built by `Googlebot`. If you want out of AI Overviews, the only lever is `nosnippet`, `data-nosnippet`, `max-snippet` or `noindex`, which also degrade or remove your ordinary Search snippet. There is no AI Overviews opt-out that preserves normal Search presence. Confidence: High, first-party.
2. **Allowing `Google-Extended` does not help you rank.** Google states it is not a ranking signal. Anyone telling you to allow it "for AI SEO" is describing Gemini app grounding, which is a real but small surface, and should say so.

### 4.4 The change, if the owner accepts the recommendation

One file: `D:\Work\Octokeen\src\app\robots.ts`.

Remove `'ChatGPT-User'` from the `AI_CRAWLERS` array. Optionally add `'meta-externalagent'` for policy consistency. The block comment above `AI_CRAWLERS` currently reads "AI training and answer-engine crawlers", which conflates the two categories the whole of §3 separates. It would be more accurate as two arrays: training crawlers that are blocked, and retrieval or indexing crawlers that are deliberately allowed, with the second list written out explicitly so a future edit does not accidentally add one.

`PetalBot` should move out of `AI_CRAWLERS` into `SCRAPERS`, or into its own group, because it is a search engine crawler and the current grouping will mislead the next person to read the file.

**I have made no code change. This is research only.**

### 4.5 One study that appears to contradict all of this, and why it does not apply

BuzzStream published research on 19 March 2026 covering 4 million AI citations from 3,600 prompts across ChatGPT, Gemini, AI Overviews and AI Mode. Headline: sites blocking `OAI-SearchBot` were still cited 82.4% of the time, sites blocking `GPTBot` 88.2%, and roughly 95% of ChatGPT citations came from sites blocking training bots. The obvious reading is "blocking crawlers does not stop citations, so robots.txt does not matter."

That reading is wrong for Octokeen, for two reasons.

First, the study's own authors state they *"draw no causal conclusions"*, describe the mechanics as *"substantially opaque"*, and cannot distinguish between systems bypassing robots.txt, systems using previously crawled content, and systems relying on model memory.

Second and decisively, the sample is the **top 50 news sites per industry**. Those are exactly the domains that have licensing deals, that are already deep in every model's weights, that are cited from parametric memory rather than retrieval, and that Google's index has held for twenty years. Octokeen has none of those. A finding about whether Reuters can afford to block a crawler tells you nothing about whether a 12-page site can.

Confidence in the study's numbers: Medium. Confidence that they generalise to Octokeen: **very low, and this is a trap worth naming.**

---

## 5. What actually influences whether a page gets cited

This is the section where most GEO advice is invented, so it is graded hardest.

### 5.1 Ranking position is the dominant known factor. Confidence: High.

Google states it first-party: AI Overviews and AI Mode eligibility is ordinary Search eligibility with a snippet, and there are no additional requirements. Daniel Cheung's July 2026 review of the schema literature reaches the same conclusion from the other direction: across ten studies, *"the strongest predictor of AI citation is search ranking position"*.

There is a widely circulated counter-claim that only 38% of AI Overview citations now come from pages in Google's top 10, down from 76%, implying rank matters less than it did. I could not trace that figure to a disclosed methodology. Treat it as **Low confidence**. Even if it is directionally right, "citations reach beyond the top 10" is not the same as "ranking does not matter"; it means the eligible pool is the indexed corpus and depth-of-answer decides within it.

### 5.2 Structured data does not measurably help. Confidence: High, and this contradicts near-universal advice.

Google's AI features documentation says it outright: *"You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."*

The independent evidence agrees, and the pattern in it is instructive. Cheung's July 2026 review tabulated ten studies. Every study that controlled for ranking position found null or slightly negative. Every study that found a positive effect did not control for ranking.

- Fischman 2026, 730 AI citations, cross-platform. An initial significant *negative* association turned out to be an artifact of Google enriching top-10 results for schema-bearing pages. Once modelled with generalized estimating equations and query-clustered standard errors, the effect was **null**. Posted to SSRN, which means not peer reviewed.
- Ahrefs, 1,885 pages that added JSON-LD between August 2025 and March 2026 against roughly 4,000 matched controls: a 4.6% citation **decline**. Ahrefs also found cited pages are nearly 3x more likely to carry JSON-LD across 6 million URLs, and interpreted this as co-occurrence rather than cause, because well-maintained sites have both.
- Otterly planted a fact inside FAQ schema that appeared nowhere in visible text. No AI system used it.
- SearchAtlas bucketed domains by schema coverage and found the citation distributions *"highly similar"*.

The one that should settle it for a working site owner is Otterly's: if a fact exists only in markup, assistants do not see it. Whatever the retrieval layer reads, it reads the visible page.

**Practical instruction for Octokeen.** `src/lib/seo/structured-data.ts` already emits Organization, WebSite, Course and BreadcrumbList, and the guide route composes Course plus breadcrumb JSON-LD. That is the right amount. Keep it, because it earns Google rich results and breadcrumb display, which are traditional SEO wins. Do not add more schema for AI reasons, and do not let anyone sell you FAQPage or HowTo markup as an AI visibility play. Confidence: High.

### 5.3 llms.txt is, at present, unread. Confidence: High.

llms.txt is a proposal by Jeremy Howard, published 3 September 2024, revised to v2 on 10 August 2026. Its own site calls it *"a proposal to standardise"*, not a standard.

No major provider has committed to reading it in production. Google's Gary Illyes said in July 2025 that Google does not support it and does not plan to, and John Mueller compared it to the keywords meta tag. OpenAI and Anthropic publish llms.txt for their own developer docs, which is often cited as endorsement; publishing one is not the same as consuming one.

The decisive measurement: Ahrefs, updated 15 June 2026, examined server logs across roughly 137,000 domains and found that in May 2026, **97% of valid llms.txt files received zero requests.** Their verdict was that there is *"no evidence that llms.txt improves AI retrieval, boosts traffic, or enhances model accuracy"*.

It does have one real use: IDE agents such as Cursor and Cline read it, and Anthropic recommends it in its guidance on writing documentation for agents. That is a developer-documentation use case. Octokeen is a consumer learning app. **Do not build one.** Not because it is harmful, but because it is a file nothing will request and it would become one more thing to keep in sync.

### 5.4 Answer-first structure, statistics and quotations. Confidence: Medium, and weaker than it is usually sold.

This is the recommendation with the most respectable-looking citation behind it and the most misrepresented evidence.

**The pro case.** Aggarwal et al., *GEO: Generative Engine Optimization*, ACM SIGKDD 2024, is genuinely peer reviewed. It tested nine content modifications over GEO-bench, 10,000 queries, and found adding verifiable statistics, credible quotations and cited sources produced the largest gains, on the order of 30 to 40% on a position-adjusted word count metric. Fluency improvements gave 15 to 30%. Keyword stuffing did nothing or hurt. An "authoritative tone" did nothing.

**Why the numbers do not transfer.** The generative engine was **simulated**: Google retrieved the top 5 sources, then GPT-3.5-turbo synthesised an answer with citations. Only five documents competed per query, which mechanically inflates relative gains. All optimisations were LLM-generated, not human-written. The model is from 2023. Nobody has reproduced the effect sizes on live ChatGPT, Perplexity or AI Overviews.

**The counter-evidence, which is the finding most GEO vendors do not mention.** Puerto, Gubri, Green, Oh and Yun, *C-SEO Bench: Does Conversational SEO Work?*, arXiv 2506.11097, June 2025 and revised October 2025, built a benchmark across two tasks and three domains per task and concluded that *"most current C-SEO methods are not only largely ineffective but also frequently have a negative impact on document ranking"*, and that traditional SEO strategies were significantly more effective. They also found gains shrink as more competitors adopt the same techniques, which makes the whole category zero-sum.

**What survives.** The direction of the GEO paper is consistent with an obvious mechanism: retrieval operates over passages, and a passage that states a complete answer with a concrete figure is more extractable than one that builds to a conclusion over four paragraphs. The magnitude does not survive. And critically, the surviving advice is indistinguishable from good editorial practice.

**What this means for the guides.** The `answer` field in the `LearnGuide` type, per `docs/seo/learn-guides.md`, is already "two or three sentences" of direct answer above the fold. That is the single highest-value structural choice, and it is already made. The marginal additions worth making, each cheap:

- Put a concrete number in the answer where one honestly exists. Milgram's 65% obedience rate. Ebbinghaus curve retention figures. Named experiment sample sizes.
- Attribute claims to a named researcher and year in visible prose, not only in a footnote.
- Keep each `heading` block's following text self-sufficient, so a passage lifted out of context still reads as an answer.

Confidence that these help: **Medium.** Confidence that they cost anything: essentially zero, because they also make the guides better to read. That asymmetry, not the evidence strength, is why they are worth doing.

### 5.5 Question-shaped headings. Confidence: Low.

Universally recommended, thinly evidenced. The mechanism argument is that Google's AI Mode uses query fan-out, decomposing one query into parallel sub-queries, so a page containing an explicit answer to a sub-question can be retrieved for it. Query fan-out itself is real and Google-acknowledged. That a matching heading string improves retrieval is inference, not measurement, and modern retrieval is embedding-based rather than string-matching, which weakens the argument considerably.

Cheap, harmless, aligns with how people search. Do it if it fits the guide's voice. Do not restructure anything for it, and be suspicious of anyone who quotes a percentage for it.

### 5.6 JavaScript rendering. Confidence: Medium.

There are repeated reports that AI crawlers, including OpenAI's, do not execute JavaScript and parse HTML only. I could not find a first-party statement from OpenAI, Anthropic or Perplexity confirming this, so it is Medium rather than High.

It happens not to matter here. `docs/seo/learn-guides.md` records that everything under `/learn` is server-rendered prose readable without JavaScript. Octokeen is already on the right side of this, by an earlier decision. Worth stating explicitly so a future refactor does not undo it.

---

## 6. AI Overviews: what is known, and how bad the click impact is

`docs/seo/search-demand.md` §7 flags AI Overviews absorbing clicks on definitional queries as an open existential risk. It is a real risk and the evidence is better than the rest of this document's evidence.

### 6.1 How sources are selected

First-party, High confidence: eligibility is ordinary Search eligibility with a snippet, and Google states there are no special optimisations. Google also describes AI Mode using query fan-out, issuing multiple sub-queries in parallel across the live web, the Knowledge Graph and other sources, and synthesising the results, and says it prioritises information supported by high-quality web results in order to reduce hallucination.

Beyond that, source selection is **Unknown**. There is a large body of writing analysing Google's fan-out patents and inferring signals such as topical breadth, internal linking and entity relationships. Patents describe what a company considered patenting, not what ships. Treat all of it as speculation.

### 6.2 The click impact

**Pew Research Center, 22 July 2025.** The strongest available evidence, because it is real browsing behaviour rather than modelled clickstream. 900 U.S. adults on KnowledgePanel Digital with a browser tracking app, March 2025, 68,879 unique Google searches of which 12,593 produced AI summaries.

- Clicked a traditional result link on **8%** of visits where an AI summary appeared, versus **15%** where none did.
- Clicked a link **inside** the AI summary on **1%** of visits.
- Ended the browsing session entirely on **26%** of AI summary pages, versus 16% without.
- 18% of searches produced an AI summary; 88% of summaries cited three or more sources; median summary length 67 words.

**Ahrefs, published 17 April 2025, re-run for 2026.** 300,000 keywords, within-keyword comparison of March 2024 against March 2025 using aggregated Search Console data. Position 1 click-through rate fell about **34.5%** on keywords that gained an AI Overview. The 2026 re-run on December 2025 data reported up to **58%**. Ahrefs states it cannot fully isolate AI Overviews from other variables in the period.

### 6.3 What this means for Octokeen specifically

The honest reading is uncomfortable and it should change plans, not just be noted.

1. **The Pew 1% figure is the number that matters most, and it is the one usually skipped.** Being cited inside an AI Overview is worth very little traffic on its own. Ahrefs' claim that cited sites get 35% more clicks than uncited ones is vendor-reported with undisclosed methodology, **Low confidence**, and even taken at face value it is 35% more of a very small number. Do not build a strategy whose payoff is "get cited in AI Overviews".
2. **The Tier 1 topic list in `search-demand.md` is exactly the query shape most exposed.** "What is the sunk cost fallacy" is definitional, answerable in 67 words, and prime AI Overview territory. Some of that traffic is already gone and is not coming back.
3. **The queries that survive are the ones a 67-word summary cannot satisfy.** That is a genuinely useful filter and it points somewhere the existing research already pointed. `search-demand.md` §4 Shape C, the interactive "test yourself" pages, and item #5 the cognitive bias quiz, are the most defensible things on the whole list, because an AI Overview cannot deliver an interactive quiz. It can only describe that one exists somewhere and, if it does, name it. Multi-step tasks such as telescope collimation (#8) are similarly resistant, because they need diagrams and sequence.
4. **The strategic conclusion.** Definitional guides remain worth publishing, as entity-building and as the substrate that makes Octokeen citable, but their expected direct traffic should be revised down. The compounding asset is the interactive surface, which is also the product. That is a happier alignment than it first appears.

---

## 7. Brand and entity signals

The owner's actual goal, "be recommended when someone asks for a good app for learning about cognitive biases", is a **recommendation** query, not an informational one. This is a different problem from everything above, and it is the harder one.

### 7.1 What the evidence shows

**Ahrefs, 75,000 brands, published 26 May 2026.** Spearman correlations with AI visibility across ChatGPT, AI Mode and AI Overviews:

| Signal | Correlation |
|---|---|
| YouTube mentions (title, description or transcript) | 0.737 |
| Branded web mentions | 0.664 |
| Branded anchor text | 0.527 |
| Brand search volume | 0.392 |
| Backlinks | 0.218 |

Ahrefs states plainly that this is correlation, not causation, and that brands with high AI visibility also have high cross-platform presence. That caveat is doing heavy lifting: every one of these signals is also a proxy for "is a well known company", so the correlations mostly measure fame. Confidence in the numbers: Medium. Confidence that they identify causal levers: **Low.**

**Where citations actually come from.** Multiple independent measurements agree that Reddit, Wikipedia, YouTube and LinkedIn dominate cited domains across engines. Semrush's 230,000-prompt study found Reddit, Wikipedia, LinkedIn, Forbes and YouTube leading. One 2026 analysis reported that vendor-owned .com sites accounted for only 0.85% of citations in its category. SE Ranking reported domains with large Reddit mention volumes averaging around 3.9x the ChatGPT citations of domains with minimal Reddit presence, which is a vendor study with undisclosed controls, so **Low confidence** on the multiplier and Medium on the direction.

### 7.2 How this differs from link building, and it differs a lot

Link building needs a hyperlink on an indexed page. Entity building needs the **string "Octokeen" to appear near the topic "cognitive biases" in text that the retrieval layer reads.** An unlinked mention in a Reddit comment plausibly counts. A YouTube transcript plausibly counts. A backlink from a link farm plausibly does not.

This is why backlinks correlate at 0.218 while branded web mentions correlate at 0.664. It is also why the entire link-building industry's product is a poor fit for this goal.

### 7.3 What a solo owner with no budget can actually do

Ranked by honesty about expected return.

1. **Be genuinely useful on Reddit in the relevant subreddits.** r/psychology, r/cogsci, r/GetStudying, r/telescopes, r/askastronomy. Reddit is the most-cited domain across engines and its content is indexed by everything. This is also the recommendation most likely to backfire: self-promotion gets removed, and a removed comment is worth nothing. It only works as a byproduct of real participation, over months. Confidence that Reddit presence correlates with AI visibility: Medium. Confidence that a solo owner can manufacture it: **Low.**
2. **Answer the exact questions the guides cover, in public, where the answer is indexed.** The value is the topical co-occurrence of the brand name with the concept, not the link.
3. **YouTube, if there is any appetite for it.** Highest correlation in the Ahrefs data, and mechanically explicable: transcripts are text, YouTube is heavily indexed, and video content about a named product is rare enough to be distinctive. Also by far the highest effort item here, and I would not start with it.
4. **Wikipedia: no.** Octokeen does not meet notability requirements and an attempt would be reverted and could create a lasting negative record. Do not.
5. **Directory and listing pages.** "Best apps for learning psychology" listicles are precisely what assistants retrieve for recommendation queries. Getting included in even a few small ones is a direct, mechanical path to being a candidate answer. This is the most tractable item on the list for a solo owner, and the one I would do first.

### 7.4 The honest bottom line on §7

For recommendation queries specifically, Octokeen's realistic near-term position is **not citable**. There is no corpus of independent text discussing it. No robots.txt change, page structure or markup alters that. The only things that do are time and third-party discussion, and neither is purchasable at this budget. Anyone selling a faster route to this outcome is selling something. Confidence: High.

---

## 8. What is measurable

### 8.1 What Octokeen can see today: nothing

No analytics package exists in `package.json`. That is the first thing to fix, and it is why §1.3 is on the action list.

### 8.2 What is measurable once instrumented

| Source | What it shows | Reliability |
|---|---|---|
| `utm_source=chatgpt.com` in the query string | ChatGPT referrals, reasonably reliably. OpenAI appends it to outbound links | **Good** |
| Referrer `perplexity.ai` | Perplexity referrals | Good |
| Referrer `gemini.google.com` | Gemini app referrals | Good |
| Referrer `copilot.microsoft.com` | Copilot referrals | Good |
| Claude referrals | Often no referrer at all | **Poor** |
| AI Overview clicks | Referrer is `google.com`, identical to an ordinary organic click | **Not separable** |
| GSC generative AI report | Impressions in AI Overviews, AI Mode and Discover AI features, by page, country, device, date | Good, but impressions only |
| Server logs | Which AI crawlers fetched which pages and when | Good, if you can get at them |

A note on the GA4 configuration that every guide recommends: if `utm_source` is present but the referring domain is absent, GA4 can file the visit as Unassigned rather than Referral, so an AI channel group has to be defined explicitly and ordered above Referral. Worth knowing before concluding the traffic is not there.

### 8.3 Crawler-hit measurement, which is the underrated one

Whether `OAI-SearchBot`, `PerplexityBot` and `Claude-SearchBot` are actually fetching the `/learn` guides is directly observable in server logs, and it is a leading indicator: a page never fetched by `OAI-SearchBot` cannot be in ChatGPT's index. Octokeen is on Vercel, where runtime logs have short retention and log drains are a paid feature, so this may cost something. Cloudflare offers similar visibility free if the site is proxied through it. Worth checking what the current hosting exposes before assuming it is unavailable.

### 8.4 The honest ceiling

**Octokeen cannot determine whether it is being cited by an assistant.** It can determine whether an assistant sent someone, which is a strictly smaller thing. A citation with no click is invisible, and Pew's 1% in-summary click rate says most citations produce no click. Every commercial tool that claims to measure AI citations works by running a fixed prompt set on a schedule and recording what comes back, which is sampling a nondeterministic system, not measurement. For a site with 11 users, prompt-monitoring subscriptions are not worth the money.

What is worth doing: instrument referrals, check the GSC generative AI report monthly if it is available, and treat any ChatGPT referral at all as the first real signal. Confidence: High.

---

## 9. What I could not establish

Listed rather than smoothed over.

1. **What ChatGPT's search index actually contains.** OpenAI documents the crawler and not the index. The Bing relationship is undocumented and the Semrush `num=100` finding suggests a third component nobody has described. **Unknown**, and anyone who states it confidently is guessing.
2. **How AI Overviews rank candidate sources within the eligible pool.** Google says eligibility is ordinary Search eligibility. It says nothing about selection. Patent analysis is not evidence of shipped behaviour. **Unknown.**
3. **Whether any on-page change causes an increase in AI citations for a small site.** No study I found isolates a small, low-authority domain. All the controlled work is on large corpora dominated by established publishers. The GEO paper's engine was simulated. C-SEO Bench found the category largely ineffective. **Unknown, and this is the biggest gap in the document.**
4. **Whether the AI crawlers execute JavaScript.** Reported repeatedly, never stated first-party. Moot for Octokeen, which server-renders.
5. **Whether being cited in an AI Overview produces meaningful clicks.** Pew says 1% of visits include an in-summary click. Ahrefs says cited sites get 35% more clicks. These are not directly contradictory, since they measure different things, but nobody has reconciled them and the vendor figure has no disclosed method.
6. **Whether allowing `GPTBot` or `ClaudeBot` would produce any benefit at all for a site this size.** The long-tail knowledge literature says almost certainly not. Nobody has tested it directly, because you cannot run a controlled experiment on a training run. **Unknown, leaning strongly toward no.**
7. **Whether Octokeen is currently indexed in Bing at all.** Not checkable from here. §1.2 exists partly to find out.
8. **How fast any of this changes.** Anthropic's crawler documentation was last updated April 2026, Google's crawler documentation July 2026, Google's AI features documentation December 2025. Two of the studies cited here have already been superseded by their own re-runs with materially different numbers. Anything in this document over twelve months old should be re-checked before being acted on.

### What would settle the open questions

- **For question 3, the most important one:** publish the twelve guides, instrument referrals, then run a controlled internal test. Take six comparable guides, add concrete statistics and named-researcher attribution to three, leave three alone, and watch AI referral traffic and GSC generative AI impressions over 90 days. Six pages is not a study, but it is real data on this domain, and it costs nothing beyond the writing. It would beat every vendor blog on the subject for Octokeen's specific purposes.
- **For question 1:** nothing short of OpenAI publishing it.
- **For question 7:** Bing Webmaster Tools, one hour.

---

## 10. Sources

Primary vendor documentation, fetched 2026-08-24:

- [OpenAI, Bots](https://developers.openai.com/api/docs/bots)
- [Anthropic, Does Anthropic crawl data from the web](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), last updated 7 April 2026
- [Perplexity, Bots](https://docs.perplexity.ai/guides/bots)
- [Google, Google crawlers and fetchers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), last updated 14 July 2026
- [Google, AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), last updated 10 December 2025
- [Google Search Central, Introducing Search Generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), 3 June 2026
- [Meta, Web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)
- [Common Crawl, CCBot](https://commoncrawl.org/ccbot)
- [Apple, About Applebot](https://support.apple.com/en-us/119829)
- [llmstxt.org](https://llmstxt.org/), proposal v2, 10 August 2026

Studies:

- [Pew Research Center, Google users are less likely to click on links when an AI summary appears](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/), 22 July 2025
- [Kandpal et al., Large Language Models Struggle to Learn Long-Tail Knowledge, ICML 2023](https://arxiv.org/abs/2211.08411)
- [Aggarwal et al., GEO: Generative Engine Optimization, ACM SIGKDD 2024](https://dl.acm.org/doi/10.1145/3637528.3671900)
- [Puerto et al., C-SEO Bench: Does Conversational SEO Work?, arXiv 2506.11097](https://arxiv.org/abs/2506.11097)
- [Fischman, Does Schema Markup Predict AI Citation?, SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6284518), not peer reviewed
- [Ahrefs, AI Overviews Reduce Clicks by 34.5%](https://ahrefs.com/blog/ai-overviews-reduce-clicks/), 17 April 2025, re-run 2026
- [Ahrefs, An Analysis of AI Overview Brand Visibility Factors, 75K brands](https://ahrefs.com/blog/ai-overview-brand-correlation/), 26 May 2026
- [Ahrefs, What Is llms.txt, and Should You Care About It?](https://ahrefs.com/blog/what-is-llms-txt/), updated 15 June 2026
- [Semrush, The Most-Cited Domains in AI](https://www.semrush.com/blog/most-cited-domains-ai/), 10 November 2025
- [Daniel Cheung, Should You Bother With Schema Markup for AI Search?](https://www.danielkcheung.com/musings/schema-ai-citations-evidence-review), 6 July 2026
- [PPC Land, Blocking AI crawlers doesn't stop citations](https://ppc.land/blocking-ai-crawlers-doesnt-stop-citations-new-data-shows-why/), covering BuzzStream research, 19 March 2026
- [TechCrunch, Anthropic appears to be using Brave to power web searches](https://techcrunch.com/2025/03/21/anthropic-appears-to-be-using-brave-to-power-web-searches-for-its-claude-chatbot/), 21 March 2025

Repo files referenced, none modified:

- `D:\Work\Octokeen\src\app\robots.ts`
- `D:\Work\Octokeen\src\app\sitemap.ts`
- `D:\Work\Octokeen\src\lib\seo\structured-data.ts`
- `D:\Work\Octokeen\src\app\learn\[course]\[guide]\page.tsx`
- `D:\Work\Octokeen\package.json`
- `D:\Work\Octokeen\docs\seo\search-demand.md`
- `D:\Work\Octokeen\docs\seo\learn-guides.md`
