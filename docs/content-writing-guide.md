# Octokeen Content Guide

Rules for writing course content. Read fully before writing or editing lessons.

**Voice:** helpful, direct, conversational, slightly playful. Never preachy, academic, or sarcastic. Learners are "learners", never "users".

---

## What is enforced

`npx tsx scripts/qa-content.ts` runs 19 checks. Run it after every content change. Rules marked with a check below are machine-verified; everything else is on you.

| Check | Rule |
|---|---|
| 1 | No em dashes or double dashes |
| 2 | Correct option leads longest distractor by no more than 4 words |
| 3 | Standard lesson has 2-3 teaching cards |
| 4 | Teaching cards have no `options` |
| 5 | Teaching card explanation is 2 sentences or fewer |
| 6 | No duplicate question IDs |
| 7 | Match-pairs has exactly 4 pairs |
| 8 | Sort-buckets has exactly 6 items, 2 buckets |
| 9 | Order-steps has 4-5 items |
| 10 | Speed-round has exactly 15 questions, 60s limit |
| 11 | Conversation has exactly 3 decision points |
| 12 | No option exceeds 15 words |
| 13 | Required fields present per question type |
| 14 | `correctIndex` within bounds |
| 15 | True/false answers not skewed past 65% either way |
| 16 | Teaching card title under 8 words, hint 1 sentence |
| 17 | Distractor explanations distinct and not templated |
| 18 | No two lessons in a unit share an identical item-type sequence |
| 19 | On-screen text stays inside its word budget |

**`correctIndex` position does not matter.** `QuestionCard.tsx` shuffles option order per question, as do `ScenarioCard`, `MatchPairsCard`, `SortBucketsCard`, `CategorySwipeCard` and `OrderStepsCard`. Stored position never reaches the learner. Do not spend effort redistributing it. True/false has **no** shuffle, so its balance is real (CHECK 15).

---

## Banned patterns

These shipped to production and had to be rewritten across two sections. Every one passed a type check.

**1. Templated distractor explanations.** The worst offender by volume: roughly 600 instances of the option quoted back with the correct answer's explanation appended.

```
BAD   '"Earning more at work" is wrong because you cannot improve what you do not measure.'
BAD   'This amount (80) is too low, the correct calculation gives 292.'
BAD   'This statement is actually true, exactly. Statements track every transaction.'
BAD   'This answer is too narrow, it ignores other important factors.'
GOOD  'Earning more without tracking just raises the ceiling on untracked spending.'
```

Each distractor names the specific error *that option* makes. CHECK 17 rejects the shapes above and any two identical reasons in one question.

**2. Text reused across questions.** Explanations pasted from other lessons put a credit-card fraud line on a lifestyle-inflation question, and a character named Mia into a scenario about Sam. Every explanation references only its own question.

**3. Characters that drift.** Use the name and pronouns the scenario establishes, nothing else. If the scenario gives no pronoun, use they/them. Never introduce a pronoun for the first time inside feedback.

**4. Answer leaked by formatting.** The correct option must not be the only long one, the only one showing a formula, or the only serious answer.

```
BAD   "$832 (40 x $16 + 8 x $24)" against "$640 (40 x $16)"
GOOD  "$832" against "$640", with the working in the explanation
```

Joke distractors ("Control the weather", "Which bank has the nicer logo") make a question free. Every distractor is a mistake a real beginner could make.

**5. Opinion graded as fact.** If two answers are defensible, the question is broken. Rank-orders and "what did you learn" items are the usual culprits.

**6. Concept tested before it is taught.** Every tested concept needs a teaching card first, in this lesson or an earlier one. A term defined only inside an answer explanation does not count.

**7. Contradictions across lessons.** One unit graded two different lifecycle orders as correct. Before adding a rule, ratio or ordering, grep the course for the concept and match what is already taught.

**8. Missing currency symbols.** Always `$1,000`, never `1,000`. One file lost every symbol and rendered "the ATM charges a 3 fee".

---

## Teach against a misconception

Explaining a correct idea to someone who already believes a wrong one usually fails. They file your explanation next to the belief instead of replacing it. Derek Muller's research on physics videos found exactly this: correct-only explanations were rated clearer and taught nothing, while versions that raised the misconception first, refuted it, then explained were rated *more confusing* and taught significantly more.

**Distractors: always.** Every wrong option should be a belief a real learner holds. This is the highest-value version of the rule and it costs no extra screen text. A distractor that is a genuine misconception makes the question non-trivial, and its explanation writes itself: name the belief, say why it fails. The learner who picks it gets a correction aimed exactly at what they think.

```
WEAK    "Control the weather" / "Which bank has the nicer logo"
STRONG  "Carrying a balance builds your credit score"
```

**Lesson openings: when a real misconception exists.** Name it, refute it, give the correct model, inside the 2-sentence card limit.

```
FLAT    "Overtime eligibility depends on job duties and pay level."
BETTER  "Most people think a salary means no overtime. Duties and pay level decide it, not how you are paid."
```

**Do not invent one.** If you cannot point to someone who actually believes the wrong thing, the format does not apply. A fabricated misconception ("most people think checking accounts pay high interest") is a false claim in a course whose credibility is the product. Definitional lessons and Unit 1 foundations usually have no misconception to attack, because the learner has no model yet rather than a wrong one.

Fit varies by subject. Personal finance is dense with misconceptions (credit scores, renting, minimum payments, tax brackets). Space and astronomy is more unknown-to-learner than wrongly-known.

---

## Writing that reads as human

Generated content fails in recognisable ways. These are the tells found in this codebase, and what to do instead.

**Vary the shape of lessons.** Two lessons in a unit must not share an identical item-type sequence (CHECK 18). Identical skeletons make a learner feel the template before they feel the subject.

**Use specific numbers, not round ones.** `$47` reads as a real receipt. `$50` reads as a placeholder. Round numbers everywhere are a generation tell.

**Name the consequence in the learner's own terms.**

```
FLAT    "This costs you $312 per year."
BETTER  "That is $312 a year, about a month of groceries."
```

**Vary sentence length.** Uniform 15-word sentences read as machine output. Follow a long sentence with a short one. Let the rhythm change.

**Commit, or say it is genuinely debated.** Hedging into "it depends on various factors" teaches nothing. Either give the answer or name the specific thing it depends on.

**Say the uncomfortable part.** Real writing admits when something is annoying, counterintuitive, or unfair. "Your first raise mostly disappears into taxes and lifestyle" earns trust. Relentless positivity does not.

**One concrete example beats two abstract ones.** A named person with one specific detail lands harder than a general rule stated twice.

**Do not restate the question in the explanation.** If the explanation only rephrases the stem, it teaches nothing. Say why.

**No unsourced statistics.** "Research shows the average person spends $200 to $300 a month on subscriptions" invites a reader to check it and find nothing. Attribute it or drop the number.

**Read the lesson out loud in your head.** If you would not say it to a friend at a table, rewrite it.

---

## Dated figures

Content outlives the year it was written in. A stale tax number in a finance course is the fastest way to lose a knowledgeable reader.

- **Prefer year-neutral phrasing.** "The IRS sets annual contribution limits" needs no maintenance. "$7,000" does.
- **When the number is the teaching point**, use the current figure, name the year in the text, and put a source comment above it.
- **Never mix years.** 2023 and 2024 figures appeared side by side in one question. That inconsistency is the clearest generated-content tell there is.
- Deposit insurance, contribution limits, tax brackets, standard deductions and app pricing all expire. Re-check them before each release.

---

## Word budget

Length is the highest-leverage edit available, and this is not a style opinion.

- Mayer's **coherence principle** (cutting extraneous material) held in **23 of 23** experiments at a median effect size of **0.86**. Removing words reliably improves learning.
- Learners read **20-28%** of the words on a screen (Nielsen Norman Group). 79% scan, 16% read word by word. Text you add is mostly text nobody sees.
- Sessions are 3-5 minutes on a phone. Every extra line spends attention you need for the next lesson.

Cutting text is therefore not a trade against depth. It *is* the depth.

| Field | Budget | Aim for |
|---|---|---|
| Question stem | 20 | 7 |
| Hint | 20 | 14 |
| Option | 15 (CHECK 12) | 6 |
| Distractor explanation | 25 | 14 |
| Explanation | 35 | 18 |
| Scenario | 40 | 25 |

CHECK 19 enforces the budget column. **The aim column is the target** and it is roughly half. Budgets catch outliers; they do not describe good writing. A lesson where every field sits at its cap is a wall of text that happens to pass.

How to cut without losing meaning:

```
BEFORE  "When you keep money in savings, the bank lends it out to other borrowers and
         earns from those loans. Interest is your share of that, paid as a reward for
         letting the bank hold your money."                                   (36 words)
AFTER   "The bank lends your savings to other borrowers and earns from those loans.
         Interest is your cut, paid for letting the bank hold your money."    (24 words)
```

Delete throat-clearing ("When you", "It is important to note"). Cut a clause that restates the one before it. Replace a phrase with a word. If it still will not fit, you are teaching two things and need two cards.

---

## Country-specific content

Teach concepts, not jurisdictions. When a rule is country-specific:

- Put the scope in the **question stem or unit description**, once: "In the US, sort each worker by overtime eligibility".
- Or give the card a `variants` block keyed by country code.
- Do not tack "details vary by country" onto individual hints. It breaks the one-sentence hint rule and tells the learner the lesson may not apply to them.
- A card with `variants` sitting beside a sibling card without one will contradict it. Add variants to both or neither.

---

## Structure

### Course

| | |
|---|---|
| Units | 150-200 |
| Lessons | 780-1,000 |
| Questions | 5,900-7,400 |
| Progression | Linear. Each unit builds on the last. |

Units are grouped into **sections**, one file per section under `professions/<course>/units/section-<n>-<name>-part<n>.ts`, each exporting an array of Units. `meta.ts` holds lightweight unit and lesson metadata, and its titles and descriptions must stay byte-identical to the unit files. `loadUnitData` throws on a mismatch and the content-safety test catches it.

Arc: foundations (vocabulary, recognition questions, heavy teaching cards) to core concepts (application, harder types) to depth (edge cases, judgment) to mastery (synthesis, capstone).

### Unit

| | |
|---|---|
| Lessons | 3-7 standard (average 5) |
| Teaching cards | 2-3 per lesson (CHECK 3) |
| Question types | 5 or more across the unit |
| Difficulty | First lesson accessible, last lesson hardest |
| XP | 15-20 early, 25-35 late |

Conversation and speed-round lessons go near the end of a section, not in every unit. A unit's first lesson opens with a teaching card saying what the unit covers.

### Lesson

3-5 minutes, one sub-topic. A learner should be able to state what they learned in one sentence.

| | |
|---|---|
| Items | 8-12 total |
| Teaching cards | 2-3, spaced evenly, never clumped (CHECK 3) |
| Question types | 3 or more different, no more than 3 multiple-choice in a row |
| Difficulty | easy (2-3), medium (3-4), hard (2-3) |
| After a teaching card | Next question must be **trivially easy** |

The post-card question must *apply* the idea, not echo the card's sentence back as a true/false. Cards teach; questions use.

Titles describe the sub-topic. Never roman numerals, numbers, or "Part X".

---

## Question types

### Teaching card

```typescript
{ id: 'u1-L1-T1', type: 'teaching',
  question: 'Short title under 8 words',
  explanation: 'One or two sentences. The core concept, nothing more.',
  hint: 'One practical sentence.' }
```

Title under 8 words, sentence case, no emojis (CHECK 16). Explanation 2 sentences maximum; if you need more, write two cards (CHECK 5). Hint exactly one sentence (CHECK 16). No `options`, no `diagram` (CHECK 4). At least 2 hints per unit open with "Try this now:" and a real action.

### Multiple-choice

```typescript
{ id: 'u1-L1-Q1', type: 'multiple-choice',
  question: 'One sentence question?',
  options: ['A', 'B', 'C', 'D'], correctIndex: 2,
  explanation: 'One sentence.', hint: 'One sentence.',
  distractorExplanations: { 0: '...', 1: '...', 3: '...' } }
```

Exactly 4 options, each under 15 words (CHECK 12), close in length, correct option never the longest (CHECK 2). Each distractor wrong for its own reason, named in `distractorExplanations` (CHECK 17).

### True/false

Clear, unambiguous, no double negatives. Must state a **claim to judge**, not a narrated fact. Roughly 50/50 across a course (CHECK 15), and vary the answer at repeated positions: a lesson slot that always answers `true` is free points.

### Other types

| Type | Shape |
|---|---|
| Fill-blank | Key vocabulary in the blanks, not filler words |
| Sort-buckets | Exactly 6 items, 2 buckets, split 3/3 (CHECK 8) |
| Match-pairs | Exactly 4 pairs, 1:1, no two targets named the same (CHECK 7) |
| Order-steps | 4-5 steps, one defensible order (CHECK 9) |
| Scenario | Concrete situation, then one question about it |
| Speed-round | 15 questions, 60s, options 1-4 words (CHECK 10) |
| Conversation | 3 decision points, options great/okay/poor, 7-10 nodes (CHECK 11) |

**Match-pairs grades by strict index equality**: `correctMatches[optionIndex] = matchTargetIndex`. A key that disagrees with the question's own explanation silently marks correct learners wrong. Verify every mapping by hand.

**Recompute all arithmetic by hand before commit**, including every branch of a conversation. A capstone shipped recommending a budget that overspent its own stated income.

---

## Writing style

- 20 words per sentence maximum. Simple words: "use" not "utilize".
- Contractions: "you're", "it's".
- Numerals: "3 dogs", "20%", "$1,200". No comma in XP: "2567 XP".
- Sentence case everywhere. Capitalize proper nouns only.
- Oxford comma. No semicolons. **No em dashes or double dashes** (CHECK 1).
- Correct answer: brief positive plus the fact. Wrong answer: neutral correction plus the fact.

Banned openers: "Obviously", "Of course", "Nope", "Classic mistake", "Spoiler:", "Here's the thing:", "Not even close", "Did you know?", "Let me explain". Just say the thing.

Unsourced statistics are a liability. "Research shows the average person spends $200 to $300 a month on subscriptions" invites a reader to check it. Attribute it in-text or make the point without the number.

---

## IDs

| Element | Pattern |
|---|---|
| Unit | `<course>-sec<N>-u<N>` |
| Lesson | `<unit>-L<N>`, with `b`/`c` suffix when split |
| Teaching card | `<lesson>-T<N>` |
| Question | `<lesson>-Q<N>` |
| Conversation | `<unit>-L-conv`, nodes `-C<N>` |
| Speed-round | `<unit>-L-speed`, questions `-SQ<N>` |

**Never change an existing ID.** User progress is keyed on lesson and question IDs, so renaming one orphans that progress. Never delete a lesson that `meta.ts` still lists.

---

## Workflow

**Before writing:** read this guide, check `docs/course-expansion-plan.md` for section plans, and check what earlier units already teach so you neither repeat nor assume it.

**After writing:**

1. `npx tsc --noEmit`
2. `npx tsx scripts/qa-content.ts`, zero violations for the units you touched
3. `npx vitest run src/__tests__/data/content-safety.test.ts`, catches meta and data desync
4. `npx tsx scripts/seed-content.ts`, which **writes to the production database**. Upsert-only and safe, but confirm with the repo owner before running it.

QA is necessary, not sufficient. Every defect that reached production passed a type check, and the worst of them (backwards answer keys, budgets that do not balance, explanations describing a different question) are invisible to automation. Content rewritten in bulk needs a human or a fresh agent to read it back.
