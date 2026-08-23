# Writing a `/learn` guide

The public content surface is `/learn`. Everything under it is server-rendered
prose that a crawler reads without running JavaScript. Read
`docs/seo/search-demand.md` before writing anything: it decides which topics are
worth a page and which of the three page shapes each one gets.

Worked example to copy: `src/data/learn/guides/sunk-cost-fallacy.ts`.

## Adding a guide

Two files change. No route and no component is touched.

1. Create `src/data/learn/guides/<slug>.ts` exporting a `LearnGuide`.
2. Import it in `src/data/learn/guides/index.ts` and append it to `LEARN_GUIDES`.

The URL, the sitemap entry, the breadcrumbs, the metadata, the JSON-LD and the
static build all follow from the registry. `src/lib/learn/routes.ts` does the
join; you do not call it.

## The shape

```ts
export const myGuide: LearnGuide = {
  slug: 'anchoring-bias',            // never change one that has shipped
  courseId: PROFESSION_ID.PSYCHOLOGY,// must be a public course with an intro
  title: 'Anchoring Bias: ...',      // the <h1>, written for a reader
  metaTitle: 'Anchoring Bias ...',   // <title>, 47 chars of budget
  metaDescription: '...',            // 155 chars of budget
  keywords: ['anchoring bias', ...],
  updated: '2026-08-23',
  answer: 'The direct answer, ...',  // two or three sentences, above the fold
  body: [ /* GuideBlock[] */ ],
  quiz: [ /* 3 to 5 GuideQuizQuestion */ ],
  nextStep: { unitTitle: 'Anchoring', text: 'What the course adds.' },
};
```

### Blocks

`GuideBlock` in `src/data/learn/types.ts` is the whole vocabulary:

| kind | use it for |
|---|---|
| `heading` | an `h2`, or `h3` with `level: 3` |
| `paragraph` | ordinary prose |
| `list` | bullets, or numbered with `ordered: true` |
| `steps` | a numbered procedure with a title per step |
| `table` | comparisons and example grids; scrolls sideways on phones |
| `callout` | `insight`, `warning` or `example` |
| `takeaways` | the summary box, once, near the end |

Inline markup is `**bold**` and nothing else. No HTML is parsed, so guide copy
can never inject markup. If a guide needs something the list above cannot say,
add a block kind rather than special-casing one page: every later guide gets it.

### Quiz

`GuideQuizQuestion` is narrower than `CourseQuestion` on purpose. It is a
multiple-choice item with an optional scenario, and it reinforces rather than
gates: the explanation shows whichever option the reader picks, and nothing is
locked. Pull the wording from the unit the guide draws on and keep the original
question ids so the page and the course cannot drift.

`LessonView` is deliberately not reused here. It locks scroll, owns the viewport
and reads the hearts and mastery stores, all of which are wrong inside an
article.

## The bar

`src/__tests__/lib/learn-guides.test.ts` enforces these, so a guide that misses
one fails the suite rather than shipping:

- 700 words minimum of written prose, quiz excluded. Aim for 800 to 1200.
- 3 to 5 quiz questions, unique ids, `correctIndex` in range.
- Title and description inside the SERP budget.
- No em dash and no double hyphen anywhere in user-facing copy.
- The course must be public and must have an intro in `src/data/learn/courses.ts`.

The word floor is not arbitrary. `docs/seo/search-demand.md` §5 measures a
psychology lesson at roughly 321 words of raw material, which is thin content;
publishing pages at that weight is a sitewide risk, not a per-page one.

## Adding a course page

`/learn/[course]` reads `src/data/learn/courses.ts`. Every public course needs an
entry; a course without one renders no page and appears in no list. Same block
vocabulary, same punctuation rules.

## What is deliberately not built

Section and unit routes. The course tree in `src/lib/seo/course-tree.ts` still
enumerates roughly 600 of those paths, and `src/app/sitemap.ts` filters them out
because nothing renders them. If you build those routes later, gate them on
`isIndexable` from `src/lib/seo/indexable.ts` before listing them; the comment in
`src/app/sitemap.ts` says how.
