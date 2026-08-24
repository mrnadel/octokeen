import { PROFESSION_ID, type ProfessionId } from '@/data/professions';

import type { GuideBlock, GuideRichText } from './types';

/**
 * Editorial copy for `/learn/[course]`.
 *
 * A course page is not a directory listing. `docs/seo/search-demand.md` §5 is
 * explicit that rendering the unit titles would be thin content, so these pages
 * carry written prose about the subject and link to the guides. Every public
 * course needs an entry here; a course without one renders no page.
 */
export interface LearnCourseIntro {
  courseId: ProfessionId;
  /** The `<h1>`. */
  title: string;
  /** `<title>` without the brand suffix. Budget is 47 characters. */
  metaTitle: string;
  /** Meta description. Budget is 155 characters. */
  metaDescription: string;
  keywords: string[];
  /**
   * ISO date of the last meaningful rewrite of this copy. Feeds the sitemap's
   * `lastmod`, so move it only when the words actually changed.
   */
  updated: string;
  /** Lead paragraph, directly under the heading. */
  intro: GuideRichText;
  body: GuideBlock[];
}

const PSYCHOLOGY: LearnCourseIntro = {
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Psychology and Human Behavior',
  metaTitle: 'Learn Psychology and Human Behavior',
  metaDescription:
    'Cognitive biases, memory, learning, social influence and personality, taught as short lessons with written guides to the topics people search for most.',
  keywords: [
    'learn psychology',
    'cognitive biases',
    'behavioral psychology',
    'psychology course',
    'social psychology',
  ],
  updated: '2026-08-23',
  intro:
    'Psychology is the study of why people do what they do, and almost all of it is about you as much as it is about anyone else. This course covers the parts with the most practical reach: how memory actually works, how habits form and break, how groups change individual behaviour, and the systematic errors in judgement that everyone makes and nobody notices from the inside.',
  body: [
    { kind: 'heading', text: 'What the course covers' },
    {
      kind: 'paragraph',
      text: 'The material runs from the foundations through to applied work, in eighteen units of short lessons. Perception and attention come first, because everything downstream depends on what you noticed. Learning and memory follow, including the evidence on spacing, retrieval and why rereading feels productive while doing almost nothing.',
    },
    {
      kind: 'paragraph',
      text: 'The middle of the course is cognitive biases, which is where most readers arrive from a search. Anchoring, confirmation bias, availability, sunk cost, status quo and the default effect each get their own unit, taught through scenarios rather than definitions, because recognising a bias in a situation is a different skill from being able to define it.',
    },
    {
      kind: 'paragraph',
      text: 'From there the course moves to personality and intelligence, social influence and obedience, development across the lifespan, and applied psychology in workplaces, marketing and product design. The clinical material sits at the end and is written as an informed overview, not as advice.',
    },
    { kind: 'heading', text: 'Who it is for' },
    {
      kind: 'paragraph',
      text: 'It is written for adults with no background in the subject, and it assumes you want to use the material rather than pass an exam with it. That said, the coverage lines up closely with an introductory syllabus, so it works for revision too. Lessons run about five minutes, which is the point: the research on spacing is clear that little and often beats a long session, and the course is built to be used that way.',
    },
    { kind: 'heading', text: 'A note on the clinical material' },
    {
      kind: 'paragraph',
      text: 'The units on mental health describe what conditions are and how they are studied and treated. They are educational and nothing in them is a substitute for a clinician. If something you read there sounds like your own experience, that is worth taking to a professional rather than to a quiz.',
    },
  ],
};

const SPACE_ASTRONOMY: LearnCourseIntro = {
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'Space and Astronomy',
  metaTitle: 'Learn Space and Astronomy',
  metaDescription:
    'From the solar system to black holes, cosmology and practical stargazing, taught as short lessons for adults starting from no background at all.',
  keywords: [
    'learn astronomy',
    'astronomy course',
    'space science',
    'stargazing for beginners',
    'cosmology basics',
  ],
  updated: '2026-08-23',
  intro:
    'Astronomy is the one science where the raw material is available to anyone who steps outside after dark. This course covers what is out there, how we know, and how to go and look at it yourself, starting from no physics background and building to the parts that sound like science fiction and are not.',
  body: [
    { kind: 'heading', text: 'What the course covers' },
    {
      kind: 'paragraph',
      text: 'The early units are the sky as seen from the ground: why the seasons happen, how the Moon moves, what a light year measures and why the answer changes how you read every other distance in the course. The solar system follows, planet by planet, with the moons that turn out to be more interesting than most of the planets.',
    },
    {
      kind: 'paragraph',
      text: 'The middle of the course covers stars from formation to death, including the ways a star can end: white dwarfs, neutron stars, and the black holes that get the attention. Tidal forces, event horizons and Hawking radiation are all treated properly rather than as slogans. Galaxies, dark matter and the expanding universe come next, which is where the observational evidence gets genuinely strange.',
    },
    {
      kind: 'paragraph',
      text: 'The last stretch is practical and human: how rockets work, why they work in a vacuum, the history of spaceflight, the search for life elsewhere, and a full unit on observing, covering telescope specifications, collimation, star hopping and what a modest instrument can actually show you.',
    },
    { kind: 'heading', text: 'Who it is for' },
    {
      kind: 'paragraph',
      text: 'For adults who found the subject interesting and never got a structured route into it. There is no maths beyond arithmetic and nothing is assumed. If you own a telescope and have not got much out of it yet, the observing units are written for exactly that problem.',
    },
  ],
};

const PERSONAL_FINANCE: LearnCourseIntro = {
  courseId: PROFESSION_ID.PERSONAL_FINANCE,
  title: 'Personal Finance',
  metaTitle: 'Learn Personal Finance',
  metaDescription:
    'Budgeting, debt, saving, investing and the behaviour behind all of it, taught as short lessons for adults who want the reasoning, not a product pitch.',
  keywords: [
    'learn personal finance',
    'personal finance course',
    'budgeting basics',
    'behavioral finance',
    'money psychology',
  ],
  updated: '2026-08-24',
  intro:
    'Most personal finance advice is either an advertisement or a slogan. This course is neither. It covers how money actually behaves, what the arithmetic of debt and compounding really implies, and why people who know all of that still do the opposite of it.',
  body: [
    { kind: 'heading', text: 'What the course covers' },
    {
      kind: 'paragraph',
      text: 'It opens with the foundations: what money is, how inflation erodes it, and how to read your own cash flow honestly. Then spending and saving behaviour, which is the part most courses skip and the part that decides the outcome. Budgeting methods are compared rather than prescribed, because the best one is the one you will still be using in six months.',
    },
    {
      kind: 'paragraph',
      text: 'Debt gets a full treatment: how interest compounds against you, how payoff strategies compare, and why the mathematically optimal order is not always the one that works. Investing follows, covering risk, diversification, index funds, fees and the long arithmetic that makes fees matter far more than they look.',
    },
    {
      kind: 'paragraph',
      text: 'The final section is behavioural finance, and it is the most useful one. Loss aversion, overconfidence, recency, herding and the sunk cost trap all show up in portfolios, and they cost more than any fee schedule.',
    },
    { kind: 'heading', text: 'Where to start, in order' },
    {
      kind: 'paragraph',
      text: 'Almost every question a beginner asks turns out to be a question about sequencing. The order below is not a preference; each step earns a higher guaranteed return than the one after it, so doing them out of order costs real money.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Measure the cash flow you actually have',
          text: 'Three months of statements, sorted into what arrives and what leaves. Nearly nobody guesses this correctly from memory, and every decision below is priced off the real number.',
        },
        {
          title: 'Build one month of essential spending in cash',
          text: 'Not six months, not yet. A single month of rent, food and bills is what stops the next unexpected repair from turning into new debt at credit-card rates.',
        },
        {
          title: 'Clear the high-interest debt',
          text: 'Paying off a balance charging 20 percent is a guaranteed, tax-free 20 percent return. No portfolio offers that, and no portfolio offers it with certainty.',
        },
        {
          title: 'Take any employer match on offer',
          text: 'If a workplace retirement plan matches contributions, contributing up to the match is an immediate return of 50 to 100 percent on that money. Skipping it is declining part of your salary.',
        },
        {
          title: 'Then invest, and make it boring',
          text: 'A broad, low-cost index fund bought on a fixed schedule and held through the falls. The choice is the easy part; staying invested during a bad year is the part the course spends most of its time on.',
        },
      ],
    },
    { kind: 'heading', text: 'Choosing a budgeting method' },
    {
      kind: 'paragraph',
      text: 'The four methods below are the ones the course compares. They differ in how much attention they demand and in how they fail, which is the more useful axis: a method you abandon in March leaves you worse off than a rougher one you keep all year.',
    },
    {
      kind: 'table',
      columns: ['Method', 'How it works', 'Suits you if'],
      rows: [
        [
          '50/30/20',
          'Half of take-home pay to needs, 30 percent to wants, 20 percent to saving and debt.',
          'You want one rule you can hold in your head and no spreadsheet.',
        ],
        [
          'Zero-based',
          'Every unit of income is assigned a job before the month starts, until nothing is unallocated.',
          'Your income is steady and detail motivates you rather than exhausting you.',
        ],
        [
          'Pay yourself first',
          'Saving leaves the account automatically on payday. Whatever remains is yours to spend freely.',
          'You currently save whatever is left over, which is to say nothing.',
        ],
        [
          'Sinking funds',
          'A set amount is set aside each month per category, and that category is only ever spent from its own pot.',
          'A few predictable categories keep overrunning and wrecking the month.',
        ],
      ],
      caption: 'Compared rather than prescribed. Pick the one whose failure mode you can live with.',
    },
    { kind: 'heading', text: 'A note on jurisdiction' },
    {
      kind: 'paragraph',
      text: 'Parts of the course cover tax-advantaged accounts, credit scoring and retirement vehicles as they exist in the United States. The concepts transfer, the account names and rules do not. The behavioural and mathematical material is jurisdiction neutral.',
    },
    { kind: 'heading', text: 'Who it is for' },
    {
      kind: 'paragraph',
      text: 'Adults who want to understand the reasoning rather than follow a script. Nothing here is financial advice; it is education, and the decisions stay yours.',
    },
    {
      kind: 'takeaways',
      items: [
        'Order matters more than optimisation. Clearing a 20 percent balance beats any investment you could make with the same money.',
        'Fees compound exactly the way returns do. One percentage point a year, over forty years, costs roughly a third of the final balance.',
        'The best budgeting method is the one still running in six months, which is usually the one that asks least of you.',
        'Most expensive money mistakes are behavioural rather than arithmetical, which is why the final section of the course is the one that pays for itself.',
      ],
    },
  ],
};

const INTROS: readonly LearnCourseIntro[] = [PSYCHOLOGY, SPACE_ASTRONOMY, PERSONAL_FINANCE];

export function findCourseIntro(courseId: string): LearnCourseIntro | null {
  return INTROS.find(intro => intro.courseId === courseId) ?? null;
}

export function listCourseIntros(): readonly LearnCourseIntro[] {
  return INTROS;
}
