# Launch venues for the cognitive bias quiz

**Asset:** https://octokeen.com/learn/psychology/cognitive-bias-quiz
**Verified:** 2026-08-25. Every subscriber count, rule quotation and activity observation below was fetched live on that date. Nothing here is recalled from training data.
**Method:** Reddit `about.json`, `about/rules.json`, `new.json` and `top.json?t=week`. Hacker News guidelines from `news.ycombinator.com`; Show HN outcome distribution computed from 1,000 real submissions via the Algolia HN API. Product Hunt rules from `producthunt.com/launch`; competitive level from the live 2026-08-24 leaderboard. TikTok account entitlements and business verification from `ads.tiktok.com/help` (server-rendered, machine-readable). YouTube and Instagram link policy from their official help centres.

**A note on what could not be read.** TikTok's consumer help centre (`support.tiktok.com`, which redirects to `tiktok.com/support/faq_detail`) and TikTok's Community Guidelines pages are JavaScript-only single-page apps that return a 35KB shell with 26 characters of text. They cannot be read over plain HTTP, and browser automation was ruled out mid-task. Where that blocked a question, it is marked unverified in §10 rather than filled with a guess. TikTok's **Business** Help Center is server-rendered and was fully readable, and it happens to be the system that documents the link question definitively.

---

## 1. The honest number first

**A good week gets 250 to 600 visitors. Not thousands.**

Adding TikTok, YouTube Shorts and Instagram Reels raises the ceiling over the longer run but adds very little to *this week*, for a reason established in §4: **a new TikTok account cannot display a clickable link to an external site at all**, and the gate is not follower count — it is business verification requiring a business licence, which takes 1–5 business days. Short-form is the best channel here over six weeks and close to the worst over six days.

There is a real tail. If the r/coolguides infographic hits — the top post there this week scored 7,848 points on *"A cool guide to the Paradox of Tolerance"*, a psychology-adjacent concept — several thousand visits in two days is possible. I put that at roughly one in eight across the whole week.

Plan for 350. Be pleased with 1,000. Do not build any expectation on 10,000.

---

## 2. Three things about the assets that cost traffic, found while verifying

### 2a. The quiz has no score and no share mechanism

The page states outright that nothing is scored; fetching it confirms twelve questions with inline explanations and no result screen. The brief said "people share a quiz" — but people share a *result*. "I got 4/12" is the shareable object; a quiz with no score gives a visitor nothing to post, and gives a TikTok video no payoff frame.

This is the highest-leverage fix available this week, and it now matters more than it did before TikTok entered scope, because a score screen is the natural final beat of a short-form video.

### 2b. The page loads Google AdSense

Verified in source: `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3282358085183080`, loaded as auto-ads globally and suppressed only inside the Android TWA wrapper. On Hacker News, auto-ads around a Show HN reliably draw negative top comments. On Reddit, several venues below have moderators who treat an ad-monetised destination as blogspam even where no rule names ads. Consider suppressing auto-ads on this one URL for the week.

### 2c. The four rendered videos are paid-ad creatives for the app, not organic content for the quiz

This one materially changes how TikTok should be approached, so it is worth being precise. Read from `marketing/promo-video/src/tiktok/`:

- **Format:** 1080×1920, 30fps, `TOTAL_FRAMES = 450` — **15 seconds** each. Four files in `marketing/promo-video/out/`, ~10–12MB each, rendered 2026-08-25.
- **They were designed as ads.** `variants.ts` opens with "Hook choice alone moves cost per install by several times on identical body footage, ad groups running five or more creatives beat ad groups running fewer." `theme.ts` sizes the bottom safe area at 340px because "in-feed ads carry a CTA button the organic spec does not account for." These are TikTok Ads Manager creatives with A/B-testable hooks, not organic posts.
- **Three of the four do not promote the quiz.** The hook voiceovers are: *"You've been on your phone three and a half hours today"* (doomscroll), *"You're an adult who never got taught how money works"* (callout), *"I learned more in five minutes here than four years of school"* (claim). Only the **quiz** variant — *"Ninety percent of adults get this wrong. Can you?"* — is a bias-quiz hook.
- **The CTA is "Start learning"** (`CtaScene.tsx`), which points at the app, not the quiz.

So the honest position is: **one usable organic asset exists, not four.** The strategy premise in the brief was "nobody shares a learning app" — three of these four videos advertise the learning app. Posting all four organically will read as a brand running ads in the feed, which is the single most reliably ignored thing in organic short-form.

---

## 3. Ranking, ordered by realistic traffic *this week*

Short-form sits low here purely on the one-week horizon. Its six-week ranking is different and is stated in §4f.

| # | Venue | Size / reach | Verified status | One-shot? |
|---|---|---|---|---|
| 1 | r/BehavioralEconomics | 55,982 | public; self-promo capped at 1 per 30 days | Monthly |
| 2 | r/coolguides | 6,091,233 | public; image-only, no self-promo rule | Revisit, new guide |
| 3 | Hacker News (Show HN) | — | quiz qualifies under current rules | One-shot |
| 4 | r/slatestarcodex | 82,912 | public; **no self-promotion rule at all** | Sparingly |
| 5 | r/WebGames | 142,224 | public; quizzes have live precedent | Every 3 months |
| 6 | **YouTube Shorts** | new channel | **clickable channel links, no stated gate** | Ongoing |
| 7 | r/studytips | 270,355 | public; self-promo "tastefully" allowed | Every few days |
| 8 | **Instagram Reels** | new account | **bio link + Story link sticker, ungated** | Ongoing |
| 9 | **TikTok** | new account | **no clickable link without business verification** | Ongoing |
| 10 | r/SideProject | 818,283 | public; zero published rules | Revisit |
| 11 | r/IMadeThis / r/alphaandbetausers | 39,276 / 43,086 | public; no published rules | Revisit |
| 12 | Product Hunt | — | free; personal accounts only | One-shot per version |

---

## 4. Short-form video — the link question, answered

### 4a. The direct answer

**No. A brand-new TikTok account cannot put a clickable external link in its bio today. And the gate is not 1,000 followers — that recollection is wrong in 2026.**

The gate is an **entitlement level**, and the levels are documented in TikTok's Business Help Center article *"About TikTok account entitlements"*, last updated **May 2026**. Quoted verbatim from the feature table, row "Business Profile & Decoration":

| Level | What the document says |
|---|---|
| **General TikTok Account** | *"Business information (address, phone, email) and bio-link **cannot be displayed**. Business Page is not available."* |
| **TikTok Account with Advanced Access** | *"Basic Decoration Tools (ability to edit Business information (address, phone, email), bio-link, and Business Page, **but cannot display on profile**)"* |
| **Verified Business Account (VBA)** | *"All Advanced Access Features · **Public Display of Business Profile**"* |

Read that middle row carefully, because it is the trap. At Advanced Access you **can enter a bio link and it still will not display publicly.** You get a settings field, not a link. Only the Verified Business Account tier turns on "Public Display of Business Profile".

The VBA tier also unlocks the stronger mechanism, from the same table under "Conversion Tools":

> *"Organic Conversion Anchors (ability to attach destination link or app download link to videos or profile)"*

That is a link attached to **individual videos**, which is worth considerably more than a bio link. Same gate.

**I searched all three fetched TikTok business documents for any follower threshold — the strings "follower", "followers" and "1,000" appear nowhere in any of them.** The gating variable is verification, not audience size.

### 4b. How to clear the gate, and how long it takes

From *"How to verify a TikTok account"*, Business Help Center, last updated **May 2026**:

> *"TikTok accounts of all types and sizes can apply for business verification."*

> *"**You'll need a valid business license that matches the region where the business operates.** Additional documents may be required depending on your country."*

> *"Enter your Legal business name and Business license ID exactly as they appear on your document."*

> *"Your application will be sent for review... **This typically takes 1-5 business days.**"*

> *"Note: Business verification feature is only available for users aged 18+."*

The United States is on the list of markets where business verification is available (the article enumerates ~90 markets including US, GB, DE, CA, AU).

**So the decision splits cleanly:**

- **If Octokeen is a registered business with a licence ID** — apply for business verification today. The link is live in 1–5 business days, i.e. late this week or early next. Everything posted before then earns views and zero visits, but the videos keep working once the link turns on, since the profile link applies retroactively to the whole back catalogue.
- **If it is not a registered business** — there is no route to a public clickable link on TikTok at all, at any follower count, and TikTok becomes a pure awareness channel for the foreseeable future.

**This is the single most important thing to determine before spending a day on TikTok**, and it is a question only the owner can answer.

### 4c. Routes to a clickable destination without verification

I found none that work, and I checked the obvious ones:

- **Organic Conversion Anchors** — same VBA gate. No.
- **Links in comments** — TikTok does not render comment URLs as clickable links. No.
- **Plain-text URL typed into the bio description** — this is a different field from the structured "bio-link" the entitlements table governs, and I **could not verify** whether a General account may display a plain-text URL there. Even if permitted it would not be clickable, so a viewer must retype it. Treat as near-zero regardless.
- **TikTok Ads Manager** — a paid in-feed ad carries a real CTA button with no verification requirement. This is the one route that bypasses everything, and it costs money. The four existing creatives were built for exactly this, which is presumably why they were built. Out of scope for a zero budget, but note that the assets are already correct for it if a budget ever appears.
- **Send traffic via a platform that does allow links** — put the quiz link in the YouTube channel profile and the Instagram bio, and have the TikTok bio name the site as text. Weak, but it is the only free composition available.

### 4d. Does an external URL suppress reach?

**Partially verified, and I want to be exact about which part.**

What I could not read: TikTok's Community Guidelines and For You Feed Eligibility Standards pages are JS-only and returned 30 characters of text over HTTP. I could not quote them directly.

What a search-engine summary of those pages reported — **this is a summary of the official page, not a quote I verified against the page itself** — is that content is ineligible for the For You feed where spam is present, and that spam includes "random text, irrelevant promotions, or links". Directionally this matches how every short-form platform behaves, but I am not willing to present it as a verified quotation.

**A separate note with a real date attached:** search results indicate TikTok is **updating its Community Guidelines on 24 September 2026**, about a month out. Whatever policy reading is made now should be re-checked after that date.

**Practical stance, which does not depend on resolving the above:** do not put a URL in the caption or burn one into the frame. It cannot be clicked anyway (§4a), it looks like advertising to viewers, and it is the exact pattern spam classifiers are tuned for. The upside is zero and the downside is real.

### 4e. Realistic reach for a zero-follower account

**I could not verify this to the standard applied elsewhere in this document.** TikTok's Creative Center API, which publishes real hashtag and trend data, returned `{"code":40101,"msg":"no permission"}` on every query — it requires an authenticated session. Every other source I found was either a marketing blog or a `tiktok.com/discover` page, which is user-generated content, not documentation.

What I can say without overclaiming:

- TikTok's distribution is content-signal driven rather than follower driven — this is the structural reason a new account can outperform an established one, and it is the genuine argument for TikTok that the brief was reaching for.
- Third-party estimates put algorithm calibration for a new account at roughly 2–4 weeks of regular posting. **Unverified, from marketing blogs, treat as folklore.**
- Four videos is well below what any of those sources describe as enough signal.

**My honest construction for week one:** four 15-second videos on a brand-new account, plausibly a few hundred views each. Off-platform click-through from short-form is low even with a working link, and with no clickable link it rounds to nothing. **Expect 5–30 visits from TikTok this week, and possibly zero.** The views are not the problem; the missing link is.

### 4f. Why TikTok still deserves the week-one effort

Everything above argues it produces no traffic this week, and that is correct. It should still be started this week, for one reason the Reddit and HN venues cannot match: **it compounds and it is repeatable without limit.** r/BehavioralEconomics allows one post per 30 days. Hacker News is one shot. A TikTok account can post daily forever, and the fifteenth video benefits from the fourteen before it.

Ranked over six weeks rather than six days, TikTok is first and Reddit is second. Ranked over this week, as the brief asked, it is ninth. Both statements are true and neither should be used to argue the other away.

### 4g. A concrete content warning: "bias" means K-pop on TikTok

Worth knowing before choosing hashtags. Searching TikTok-adjacent sources for "spot the bias", "guess the bias" and "bias quiz" returns, essentially without exception, K-pop fandom content — "Guess My Enhypen Bias", "Try to Guess My BTS Bias", "New Jeans Bias Quiz", "Whats Your Bias Trend". On TikTok, **"bias" primarily denotes a favourite band member, not a cognitive error.**

Two consequences. Hashtagging `#bias` or `#biasquiz` puts the video in front of a large, engaged, entirely wrong audience, and early wrong-audience signal is actively harmful during calibration. And the algorithm's topic classifier may file the content into K-pop adjacency on the strength of the word alone.

**Use `#cognitivebias`, `#psychologyfacts`, `#behavioraleconomics` and similar. Never bare `#bias`.** Whether the cognitive-bias quiz format itself is currently performing on TikTok I **could not verify** — that needed the Creative Center, which needs auth.

### 4h. YouTube Shorts — better link situation than TikTok, and this is the surprise

The brief assumed YouTube descriptions take clickable links. **For Shorts specifically, they do not.** From YouTube's official help article *"Sharing links with your audiences"*:

> *"To reduce spam and scam attempts, URLs placed in YouTube Shorts comments and Shorts descriptions are non-clickable."*

But the same article gives a route TikTok does not:

> creators can use *"channel profile links to showcase up to 14 links on your channel page"*

Those are clickable, and **the article states no subscriber threshold for them.** A brand-new channel with zero subscribers can put the quiz URL on its channel page as a clickable link today, with no verification, no business licence and no waiting period.

The other exception is brand-deal links, which attach a clickable sticker to a Short — irrelevant here, since it requires a brand partner activating the link.

**Net: YouTube Shorts is the only short-form platform where a zero-follower account gets a working clickable destination on day one.** That is why it sits at #6 in the ranking and TikTok at #9, which inverts the usual ordering. Reach per video on a new YouTube channel is generally lower than TikTok's, but a smaller number multiplied by a link that works beats a larger number multiplied by no link.

### 4i. Instagram Reels — ungated, verified

- **Story link sticker: available to all accounts.** From Instagram's own announcement, dated **27 October 2021**: *"Today, we're expanding the ability to add links in Stories to all accounts"*, and *"you now have a space to share in Stories – regardless of your account size."* The announcement confirms the prior restriction existed ("limited to verified accounts or those with a certain number of followers") and that it was removed.
- **Bio link:** I could not read `help.instagram.com/362497417173378` — it renders as a JS shell like the TikTok pages. Note, though, that the 2021 announcement was specifically about opening up *Stories* links, which implies the bio website field was never the gated one. I am flagging this as inference rather than verification.
- **Reels captions:** links are not clickable on Instagram outside the bio and Story stickers.

**Net: post the Reel, put the quiz link in the bio, and reshare the Reel to a Story with a link sticker pointing at the quiz.** That last step is the actual traffic mechanism and it works from day one on a zero-follower account.

### 4j. Can the same four videos go to all three?

**Yes, technically — same 1080×1920 vertical, same 15-second length, no per-platform re-render needed.** Uploading to all three is maybe twenty minutes total.

Two cautions worth more than the twenty minutes saved:

1. **Only the `quiz` variant is on-message for the quiz** (§2c). Posting the money and school hooks alongside it dilutes a brand-new account's topic signal at exactly the moment the algorithm is deciding what the account is about. On a fresh account, posting four videos about three different things is worse than posting one video about one thing.
2. **Visible watermarks from another platform are downranked** on all three. Upload the original files from `marketing/promo-video/out/` to each platform separately. Never download from TikTok and re-upload the watermarked copy.

**Per-platform link summary:**

| Platform | Clickable link for a zero-follower account? | Mechanism |
|---|---|---|
| **YouTube Shorts** | **Yes** | Channel profile links, up to 14, no stated gate. Descriptions and comments are non-clickable. |
| **Instagram Reels** | **Yes** | Bio link, plus Story link sticker, all accounts since Oct 2021. Captions non-clickable. |
| **TikTok** | **No** | Requires Verified Business Account: business licence, 1–5 business days. |

---

## 5. Verified detail — Reddit, HN, Product Hunt

### r/BehavioralEconomics — best single bet this week

- **Verified 2026-08-25:** 55,982 subscribers, `subreddit_type: public`, `submission_type: any`.
- **The complete rule list is two rules, quoted in full:**
  > *"**Blog Promotion** :: If you are promoting your blog or website, we limit to one post per 30 days."*
  > *"**Research tag** :: Reserved for primary research articles"*
- **No karma or account-age minimum published.**
- **Activity:** top of week 345 points / 42 comments on a self-post about psychological principles in medical exam rooms. Recent posts at 103, 96, 90 points. Posts within the last 31 hours.
- **Format that performs: text posts, decisively.** Every high-scoring post in the last fortnight is `self.BehavioralEconomics`. The two `i.redd.it` link posts in the same window scored 0 and 0.
- **Direct precedent:** eight days ago, *"I built a bias-training app and I am not convinced recognition training transfers. Would l..."* — 9 points, not removed. Self-promotion framed as an intellectual question survives here.
- **How to post:** a text post that makes an argument, with the quiz linked in the body as evidence rather than as the point. Do not title it "I made a quiz."
- **Realistic: 100–350 visits.**

### r/coolguides — highest ceiling, indirect traffic

- **Verified 2026-08-25:** 6,091,233 subscribers, public, `submission_type: link`.
- **Rules, quoted:**
  > *"**Direct links to images** :: Only direct links to images of type .png, .jpg, and .jpeg are allowed"*
  > *"**Image hosts must either be Reddit or Imgur**"*
  > *"**Post title does not start with \"A cool guide\"** :: ...all posts must be prefixed with \"A cool guide\"."*
  > *"**Infographics will be removed** :: ...If your guide is more of a visual essay than a structured table or list, then chances are that is an infographic."*
- **No self-promotion rule exists in the list.** Nothing forbids making the guide yourself. But you cannot link to your site — the post is a bare image.
- **Activity, top of week:** 7,848 / 1,159 / 901 / 372 / 325 / 306 points. New posts every 2–8 hours.
- **The trap:** rule 2 removes infographics. A twelve-bias guide must be a **structured table or grid** — name, one-line definition, one-line example. This is the most likely removal reason.
- **Realistic: 50–400 visits**, with a genuine tail to several thousand.
- **Effort:** the only venue needing real asset production. Two to three hours.

### Hacker News — Show HN

- **The quiz qualifies.** From `showhn.html`, fetched 2026-08-25:
  > *"Show HN is for something you've made that other people can play with."*
  > *"Make it easy for users to try your thing out, ideally without barriers such as signups."*
  > Off topic: *"Blog posts, sign-up pages, newsletters, lists, and other reading material. Those can't be tried out, so can't be Show HNs."*

  A twelve-question interactive quiz with no signup is squarely inside this and explicitly outside the off-topic list.
- **From `newsguidelines.html`:** *"Please don't use HN primarily for promotion"*, *"Don't solicit upvotes, comments, or submissions"*, *"Please don't delete and repost."*
- **Realistic distribution, computed from 1,000 Show HN submissions in the last 45 days:**

  | Outcome | Share |
  |---|---|
  | Median score | **2 points** |
  | ≥ 5 points | 21.8% |
  | ≥ 10 points | 8.6% |
  | ≥ 50 points (roughly front page) | **3.1%** |
  | ≥ 100 points | 0.9% |

- **Sobering precedent, same source:** *"Show HN: My Side Project to Explore Cognitive Biases Ruling Your Life"* (cognitivebiases.net) scored **4 points**; *"Show HN: The Meme Vaccine"* scored **6**. Bias-themed Show HNs have a track record and it is not good — HN's audience considers itself bias-literate and argues with the quiz rather than sharing it.
- **Best posting time, computed from the same 1,000 posts** (share reaching ≥10 points, by UTC submission hour):

  | UTC hour | ≥10 pts rate |
  |---|---|
  | 17:00 | **19.4%** |
  | 18:00 | 17.9% |
  | 13:00 | 13.3% |
  | 14:00 | 12.2% |
  | 02:00–03:00, 20:00 | 0.0% |

  **Post at 17:00–18:00 UTC** (≈10am US Pacific, 1pm Eastern), Tuesday to Thursday.
- **Realistic: 2–6 points, 50–150 visits**, with ~3% odds of the front page.
- **One-shot.** Delete-and-repost is against the guidelines.

### r/slatestarcodex — the underrated one

- **Verified 2026-08-25:** 82,912 subscribers, public, `submission_type: any`.
- **There is no self-promotion rule.** The complete list: avoid culture war content; no personal attacks; no low-effort comments; no antagonising users; no calls for violence; "not relevant to the subreddit"; *"Provide a submission statement for any external linkpost with a non-descriptive title"*; and *"Your comments and posts should be written by you, not by LLMs."*
- **Activity:** top of week 135, 87, 70, 68, 60, 46 points; newest posts 5, 13, 18 hours old.
- **Why it fits:** the rationalist-adjacent audience whose founding text is largely about cognitive bias. They engage with the content of the twelve items and they click.
- **The catch:** a demanding audience. If any scenario has a defensible second answer, that becomes the top comment. Read all twelve adversarially first.
- **Realistic: 100–400 visits.**

### r/WebGames — small, safe, quizzes have precedent

- **Verified 2026-08-25:** 142,224 subscribers, public, `submission_type: link`.
- **Rules quoted:**
  > *"**P1: Webgame** :: links must be to *web*games... musn't require downloading to play, and musn't be webtoys."*
  > *"**P3. Post Titles Must Begin With the Game's Name**"*
  > *"**P5. Posted Games Must Not Require Signing Up.**"*
  > *"**P2: Wait Three Months to Repost a Game**"*
- **Is a quiz a "webgame" or a banned "webtoy"?** Observed practice settles it: top of week includes *"Guess the Flag → how well do you actually know the world's flags?"* (9 points) and *"Geonaut: a free browser geography quiz"* (6 points); and posted within the last 7 hours, *"SPOT IT — a daily 60-second puzzle: read one conversation and mark the lines manipulating..."* from `spotit.psyoptin.com` — a psychology-manipulation quiz, live and not removed. **Quizzes pass.**
- **Honest about scale:** top of week tops out at 55 points. Zero risk, small reward.
- **Realistic: 20–80 visits.**

### r/studytips — self-promotion explicitly permitted

- **Verified 2026-08-25:** 270,355 subscribers, public.
- **Quoted:**
  > *"**Self-promotion is allowed (tastefully)** :: Sharing your latest stuff is welcomed if it's on topic, following Reddit's rules, and your last share is far from the top of the page. (Give it a few days.)"*
  > *"**Use a specific, relevant & descriptive title**"*
- **Activity:** very high volume, top of week 323 points, but the median post sits at 1–2 points.
- **Fit is indirect.** The honest angle is retrieval practice — testing yourself beats rereading — with the quiz as the worked example.
- **Realistic: 10–50 visits.**

### r/SideProject — free, low value, with a caveat

- **Verified 2026-08-25:** 818,283 subscribers, public, `submission_type: any`.
- **`about/rules.json` returned an empty array.** No rules are published through the API, and I could not render the sidebar widget to check for unpublished ones. **Treat the absence of rules as unconfirmed, not as permission.**
- **Activity is the problem.** Twelve posts arrived in under an hour, every one at 1 point. Top of week is 593, 442, 437, 392, 389 — **all `v.redd.it`, all video.** A link post is invisible within minutes.
- **Realistic: 10–40 visits**, almost all other founders.

### r/IMadeThis and r/alphaandbetausers — filler

- **r/IMadeThis:** 39,276 subs, public, no published rules. Top of week 65 points; typical post 1 point.
- **r/alphaandbetausers:** 43,086 subs, public, self-post only, no published rules. Top of week 21 points; typical post 1 point.
- **Realistic: 10–30 visits each.** Zero risk, lowest priority.

### Product Hunt — real effort, poor fit at this stage

- **Rules verified from producthunt.com/launch, 2026-08-25:** free; *"Company accounts are prohibited"*; makers should submit their own products and third-party hunters give no advantage; *"12:01 am Pacific Time is the best time to launch"*; **you may not ask for upvotes**, only for visits and comments; *"You can launch as often as you have new significant product iterations available."*
- **Live competitive level, 2026-08-24 leaderboard:** #1 PaymentKit 439 upvotes; #5 192; #10 Trama 103. Top-10 cutoff ≈100 upvotes.
- **Why it is a poor fit:** with 11 registered users, clearing 100 upvotes without an upvote-solicitation network is unlikely, and soliciting upvotes is against the rules.
- **Realistic: 30–100 visits.** A full day of effort.
- **On the traffic claims:** the "5,000–50,000 visitors" figures circulating in 2026 come from launch-service marketing blogs that sell launch assistance. I found no independent source. Discount them.

---

## 6. Venues you should NOT use

Each is commonly recommended for exactly this asset. Each is verified closed, and two carry real risk.

### r/InternetIsBeautiful — banned outright, and dead anyway

The venue everyone names first for an interactive quiz. Closed twice over.

> *"**No Webgames** :: webgames are not allowed. **This includes quizzes, puzzles, etc.**"*

Rule 3 of the current live list, fetched 2026-08-25. Quizzes are named explicitly. Two further rules also catch you:

> *"**No accounts designed for self-promotion** :: This sub follows the 90/10 rule for self-promotion... 90% of your recent participation on Reddit should have nothing to do with a site you own or operate."*

> *"**No Stores or Demos** :: ...Free demos or freemium tiered services where the full version or key functionality requires payment are also not allowed."*

And separately, **it is functionally dead as a channel** despite 16,636,807 subscribers. Its `/new` feed on 2026-08-25 showed approved posts at 0h, then 132h, 263h, 290h, 350h and 356h ago. Top of week contained **one** post, at 71 points. Roughly one or two submissions per week survive moderation. **Do not post here.**

### r/psychology — your post will be removed

4,901,924 subscribers. Two rules independently kill it:

> *"**Peer-reviewed citations for all submissions** :: Submissions need to cite at least one peer-reviewed study..."*

> *"**No self-help, blogspam, or \"guru\" websites** :: Links to self-help, blogspam, "guru" websites, or other unsourced material are not appropriate and will be removed."*

A quiz on a commercial learning app with AdSense is the exact shape rule 4 exists to remove. Note also *"Politics/racial/etc.-focused articles only allowed on Wednesdays"* — heavily and actively moderated. **Do not post the quiz here.**

### r/GetStudying — zero-tolerance ban, 3.3M subscribers

> *"**Do not promote your personal content** :: Do NOT promote your courses, apps, Discord servers, or blog/YT content... Using the "resource" flair does not give you permission to advertise. **This is a zero tolerance rule.**"*

3,311,301 subscribers and no route in. The rule pre-empts the obvious workaround. **Do not post.**

### r/todayilearned — structurally impossible

41,601,451 subscribers.

> *"**No submissions about software/websites**"* and *"**No recent sources** :: Any sources... more recent than two months are not allowed."*

Your page is a website and it is new. Both fail. **Do not post.**

### r/EverythingScience and r/science — no

r/science (34,500,820) requires peer-reviewed research published within six months. r/EverythingScience (661,109):

> *"**No promotional material** :: This includes, but is not limited to: general webpages, crowdfunding, sales pages, lecture courses, asking questions, surveys, etc."*

plus a 10% affiliation cap. **Do not post to either.**

### r/Anki — genuine ban risk, do not post cold

204,106 subscribers. Rule 3 does allow "responsible self-promotion", which is why it looks viable. Rule 5 is the problem:

> *"**No research for other products/services** :: ...(e.g. research for decks/add-ons is OK, **research for an Anki competitor is not OK**). For Anki-adjacent projects that might fall under this rule, contact mods for approval before posting."*

Octokeen is a spaced-repetition learning app; a moderator can reasonably read it as a competitor. The rule supplies its own escape hatch. **Modmail them first.** Free, five minutes.

### r/cogsci — allowed but nearly pointless

143,952 subscribers. The rule is permissive — *"Limited self-promotion is tolerated, but the sub is not here as merely a source for free advertisement"* — but *"Low quality pop-science will be removed"* requires "references and citations to actual scientific work", a bar a quiz page does not meet. Activity is thin: top of week 120 points on one thread, everything else 2–10. **Expect 10–30 visits.**

### r/CriticalThinking — dead

9,929 subscribers. **The most recent post is 5,438 hours old — roughly seven and a half months.** Top-of-week is empty. It also requires "1 month, 100 post karma, 100 comment karma, 200 combined karma". **Skip.**

### r/YouShouldKnow — big reach, but you cannot link

5,626,510 subscribers, self-post only, genuinely enormous: top of week 4,146 / 3,795 / 3,429 / 2,839 points, and a frequency-illusion YSK scored 2,344 in the last year. But:

> *"**No spam or self promotion.** :: This subreddit is not the place to be self-advertising your websites, products and services."*

Listed so you know the reach exists and the door is shut. **Do not link to Octokeen from a YSK post.**

### Lobsters — off-topic and invite-only

From lobste.rs/about: invitation-only; new users cannot submit to new domains for 70 days; self-promotion "should be less than a quarter of one's stories and comments"; and off-topic content explicitly includes *"entrepreneurship, management, company news, investing, world events, and personal productivity systems."* A psychology quiz is outside the site's computing scope. **Do not attempt.**

### Uneed — free tier is closed

Verified on uneed.best 2026-08-25: their own blog announces *"We are closing the free waiting line (again)"*, noting the free queue *"reached a 6+ month wait."* **Not available on a zero budget.**

### TikTok: do not put the URL in the caption or burn it into the frame

Covered in §4d. It is not clickable, it reads as advertising, and it is the pattern spam classifiers target. Zero upside.

### TikTok: do not post all four videos to a fresh account on day one

Covered in §2c and §4j. Three of the four advertise the app on unrelated hooks (phone time, money, school). Posting four videos about three subjects to a brand-new account muddies topic classification during the period when it matters most.

### Wikipedia external links

Adding your own site to the cognitive bias article is a conflict-of-interest edit, will be reverted, and can get the domain onto the spam blacklist — which is shared and hard to reverse. **Do not.**

---

## 7. Where the traffic estimate comes from

Built from observed upvote counts and a conservative click-through assumption (2–5% of upvoters for link posts, 1–3% for text posts where the link sits in the body, 1–3% for image posts where the link sits in a comment).

| Venue | Expected visits | Basis |
|---|---|---|
| r/BehavioralEconomics | 100–350 | Observed top posts 90–345 points; text format |
| r/slatestarcodex | 100–400 | Observed 46–135 points; engaged audience |
| r/coolguides | 50–400 | Observed 200–7,848 range; link only in comments |
| Hacker News | 50–150 | Median Show HN = 2 points across 1,000 posts |
| r/WebGames | 20–80 | Observed weekly ceiling of 55 points |
| r/studytips | 10–50 | High volume, median post 1–2 points |
| r/SideProject | 10–40 | Every observed new post at 1 point |
| r/IMadeThis + r/alphaandbetausers | 20–60 | Typical post 1 point |
| Product Hunt | 30–100 | Top-10 cutoff observed at 103 upvotes |
| **YouTube Shorts** | 10–40 | Clickable channel link, but low new-channel reach |
| **Instagram Reels** | 5–30 | Bio link + Story sticker work; reach is the constraint |
| **TikTok** | **0–30** | **No clickable link until verification completes** |
| **Total, typical week** | **~250–600** | |

Two caveats in opposite directions. **Downward:** if two or three Reddit posts get removed — normal — the low end applies, and if the business-verification answer is "no registered business" then TikTok contributes zero rather than 30. **Upward:** one coolguides hit or a 3%-probability HN front page changes the total by an order of magnitude.

Not in the table: these visitors are largely other founders and casual browsers. On a 250–600 visitor week, expect single-digit signups.

---

## 8. Day-by-day plan

### Day 0 — before anything else, two decisions (30 minutes)

1. **Answer the business-verification question.** Does Octokeen have a registered business with a licence ID? If yes, start the TikTok business verification application **today** — it takes 1–5 business days and nothing on TikTok produces a single visit until it completes. Starting it on Friday wastes the week. If no, accept that TikTok is awareness-only and weight Days 1–4 accordingly.
2. **Set up the two ungated link destinations**, which take ten minutes and work immediately: add the quiz URL as a **YouTube channel profile link** on a new channel, and as the **Instagram bio link** on a new account. Both are verified ungated (§4h, §4i).

### Day 1 (Tuesday) — r/BehavioralEconomics, and build the image

**Morning.** Post the text post to r/BehavioralEconomics. First because it has the best ratio of audience fit to rule permissiveness anywhere here, and because its rule allows one promotional post per 30 days — use the slot early, reuse it next month.

Write an actual argument: identifying a bias in a clean paragraph is a different skill from catching one in a live decision — a claim the quiz page itself makes. Link the quiz in the body as the artefact, not as the point. Stay in the thread two hours; every high-scoring post there has a real comment thread.

**Afternoon.** Build the coolguides image. Twelve biases as a structured grid — name, one-line definition, one-line example. Table or list layout, **not** a narrative visual essay; rule 2 removes infographics and that is the likeliest removal reason. Export PNG, upload to Imgur or Reddit directly.

**Three minutes each, near-zero return, zero risk:** r/SideProject, r/IMadeThis, r/alphaandbetausers.

### Day 2 (Wednesday) — Hacker News, r/coolguides, and the first video

**17:00 UTC exactly** (10am Pacific, 1pm Eastern). Submit *"Show HN: A twelve-scenario cognitive bias quiz, no signup"*. That hour showed 19.4% reaching 10+ points against ~2% in the dead hours. Add a first comment saying what you built and what you are unsure about. Do not ask anyone to upvote. Expect 2–6 points; two prior bias Show HNs scored 4 and 6. If it is dead after an hour it is dead — do not delete and repost.

**Separate window.** Post the image to r/coolguides. Title must begin exactly "A cool guide". Direct image link only. One comment linking the interactive version. Highest-ceiling post of the week.

**Short-form starts here, with one video not four.** Post the **`quiz` variant only** — `octokeen-tiktok-quiz.mp4`, the *"Ninety percent of adults get this wrong. Can you?"* hook, the only one of the four that is about the quiz. Upload the original file separately to TikTok, YouTube Shorts and Instagram Reels; never re-upload a watermarked download. Hashtag `#cognitivebias`, `#psychologyfacts`, `#behavioraleconomics` — **never bare `#bias`**, which is K-pop territory (§4g). No URL in the caption or burned into the frame. On Instagram, reshare the Reel to a Story with a **link sticker** pointing at the quiz — that is the actual traffic mechanism.

### Day 3 (Thursday) — r/slatestarcodex

Link post with a submission statement. Say what the twelve items test and be upfront about what a quiz score does and does not tell you; this audience rewards that and punishes overclaiming. Reread all twelve scenarios adversarially first — if one has a defensible second answer, fix it before posting.

### Day 4 (Friday) — r/WebGames, r/studytips, second video

r/WebGames: title must begin with the name; three-month repost cooldown, so pick a stable name. r/studytips: lead with retrieval practice, not "I made a quiz"; the title rule requires specificity.

**Modmail r/Anki. Do not post there.** Ask whether an interactive spaced-repetition-adjacent bias quiz falls under their competitor rule. Their rules invite exactly this. Costs nothing; either opens a 204k-subscriber door or closes it cleanly.

**Second short-form video.** If a second bias-specific hook can be rendered by reusing the existing body footage — the architecture in `TikTokAd.tsx` makes the hook the only variable, which is precisely what it was built for — that is a far better use of an hour than posting the money or school variants. Same three platforms.

### Day 5 onward — the part that actually compounds

Reddit is now spent for the month at the venues that matter. From here the only channel that keeps giving is short-form: keep posting bias-specific videos on a regular cadence to all three platforms. If TikTok business verification was started on Day 0, it should complete around here — turn on the profile link and, if the Verified Business Account tier grants them, attach **Organic Conversion Anchors** to the back catalogue, which converts every previously posted video into a clickable one retroactively.

**Product Hunt: I would skip it.** With no audience the observed 103-upvote top-10 cutoff is out of reach, and the day is better spent on a second coolguides image or on the missing score screen (§2a). Launch on Product Hunt when there is something to launch to.

### One-shot vs revisitable

- **One-shot:** Hacker News (no delete-and-repost), Product Hunt (per significant version).
- **Monthly:** r/BehavioralEconomics — one per 30 days, honour it exactly.
- **Every 3 months:** r/WebGames.
- **Freely revisitable:** r/coolguides (a *different* guide), r/studytips, r/SideProject, r/IMadeThis, r/slatestarcodex (sparingly).
- **Unlimited and compounding:** TikTok, YouTube Shorts, Instagram Reels. This is the only row in this list with no cap, and it is why short-form outranks everything over six weeks despite ranking ninth over six days.

---

## 9. On the claim that TikTok inverts the ranking

The brief's reasoning was that Reddit gates new accounts via karma and account age while TikTok does not, so TikTok should outrank Reddit. The first half is correct and is the largest blind spot in this document (§10.4). The second half does not follow, for a verified reason.

TikTok does not gate *posting*, but it gates *linking* — and it gates linking harder than Reddit gates posting. A Reddit karma threshold is cleared by a few days of ordinary commenting. TikTok's link gate requires a **business licence** and **1–5 business days** of formal review (§4b). For the specific goal of traffic this week, TikTok is the more restrictive platform, not the less.

The genuine correction the brief prompted is different and more useful: **YouTube Shorts and Instagram Reels take the same asset and both give a zero-follower account a working clickable link on day one.** That was not in my original report and it should have been. Short-form belongs in the plan from Day 2 — just with YouTube and Instagram carrying the link, TikTok carrying the reach, and the understanding that the payoff arrives in week six rather than week one.

---

## 10. What I could not verify

Stated explicitly, because acting on a guess here is worse than acting on nothing.

1. **TikTok's consumer help centre and Community Guidelines.** `support.tiktok.com` redirects to `tiktok.com/support/faq_detail`, and both those pages and `tiktok.com/community-guidelines/*` are JavaScript-only: they return ~1MB of markup containing 26–30 characters of text over plain HTTP. Browser automation was ruled out mid-task at the owner's request, so **I could not read them.** Consequence: the §4a link finding rests on the **Business** Help Center, which is server-rendered and authoritative for business features and which mentions no follower threshold anywhere. **I cannot rule out that a separate consumer-side bio-link path exists at some follower count.** What I can say is that TikTok's own entitlements documentation describes the link as gated by verification tier, not by audience size, and the words "follower" and "1,000" appear nowhere in any of the three business documents I read.

2. **Whether an external URL suppresses TikTok reach.** Only a search-engine summary of the For You Feed Eligibility Standards was available, not the page itself (§4d). Reported as a summary, not a quote. Also: TikTok is updating its Community Guidelines on **24 September 2026**, so any reading should be rechecked then.

3. **Realistic first-video reach and whether the bias-quiz format performs on TikTok.** TikTok's Creative Center API returned `{"code":40101,"msg":"no permission"}` on every query — it needs an authenticated session. Everything else available was marketing blogs or `tiktok.com/discover` pages, which are user-generated. The numbers in §4e are my construction, flagged as such, not measurements. The one thing I *can* evidence is that "bias" on TikTok overwhelmingly means K-pop (§4g), which is visible in the composition of the search results themselves.

4. **Reddit account age and karma minimums — the largest blind spot.** Only r/CriticalThinking published thresholds (1 month, 100/100/200 karma). Subreddits commonly enforce age and karma gates through AutoModerator, which never appears in `rules.json`. **If the posting account is new, expect silent removals at several of these venues regardless of the published rules.** Checking this needs an account, and I did not create one.

5. **r/SideProject's actual rules.** `about/rules.json` returned an empty array on 2026-08-25 and I could not render the sidebar widget. Recommended as low-risk on observed content, not on a verified rule.

6. **r/Infographics and r/interestingasfuck.** Reddit rate-limited me (HTTP 429) before I could fetch these. Both are plausible homes for the coolguides image and I have **no verified data on either.** Check before posting.

7. **Instagram's bio-link help page.** `help.instagram.com/362497417173378` renders as a JS shell. The Stories link sticker being ungated is verified from Instagram's own 2021 announcement; the bio link being ungated is **inference** from the fact that the announcement was specifically about opening up Stories.

8. **Whether a TikTok General account may display a plain-text (non-clickable) URL in the bio description.** Different field from the structured bio-link the entitlements table governs. Unverified, and near-worthless either way since it would not be clickable.

9. **Reddit's `restrict_posting` field is not a reliable signal.** It returned `true` for r/psychology, r/cogsci, r/GetStudying, r/Anki and r/InternetIsBeautiful alike, including plainly open subs. I used `subreddit_type` instead. Two subs came back genuinely `restricted`: r/quizzes (1,075 subscribers) and r/DecisionMaking (894) — both too small to matter.

10. **MetaFilter Projects** (HTTP 403 on both attempts) and **BetaList** (login wall only). Current rules, cost and activity unverified for both.

11. **Discord servers.** Psychology Nerds (~4,400 members) and Psychology Den (~2,800) surfaced via third-party server directories, not from the servers themselves. Membership, activity and link rules unverified without joining, which was out of scope. At those sizes a link drop is worth perhaps 5–20 clicks and most such servers ban cold self-promotion. **Low priority and unverified.**

12. **Newsletters.** Habit Weekly publishes no submission process — only a generic contact link. Behavioral Scientist, Irrational Labs and The Decision Lab exist and are plausible but publish no verifiable submission route. Newsletter placement is a weeks-to-months channel. **Nothing here helps by Friday.** A personal email to the Habit Weekly curator is the best attempt and belongs in next month's plan.

13. **Product Hunt traffic figures.** The 2026 numbers in circulation come exclusively from companies selling launch services. I verified competitive level directly from the live leaderboard instead; the upstream traffic claims remain unverified.
