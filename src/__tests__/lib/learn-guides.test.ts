import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { listCourseIntros } from '@/data/learn/courses';
import { LEARN_GUIDES } from '@/data/learn/guides';
import { LEARN_HUB } from '@/data/learn/hub';
import type { GuideBlock, LearnGuide } from '@/data/learn/types';
import { countGuideQuizWords, countGuideWords } from '@/lib/learn/guide-text';
import { listGuideRoutes, listPublishedCourses, resolveGuideRoute } from '@/lib/learn/routes';
import { findMetadataLengthIssues } from '@/lib/seo/metadata';
import { buildSitemapCandidates } from '@/lib/seo/sitemap-entries';

/**
 * The quality bar for `/learn`. `docs/seo/search-demand.md` §5 is explicit that
 * thin pages are a sitewide risk, not a per-page one, so these are the floors a
 * new guide has to clear before it ships rather than advice in a doc.
 */
const MIN_GUIDE_WORDS = 700;
const MIN_QUIZ_QUESTIONS = 3;
const MAX_QUIZ_QUESTIONS = 12;

/**
 * Most guides are answer-led: a reader searching a question must be able to
 * close the tab satisfied without touching the quiz, so 700 words of prose is
 * the floor.
 *
 * A few queries invert that. Someone searching "cognitive bias quiz" came to
 * be tested, and padding prose in front of the thing they asked for makes the
 * page worse. `docs/seo/search-demand.md` §4 calls this Shape C.
 *
 * A quiz-led guide is recognised by carrying at least QUIZ_LED_MIN_QUESTIONS
 * items. It gets a lower prose floor, but it does not escape the thin-content
 * guard: prose plus quiz still has to clear MIN_TOTAL_WORDS. The quiz renders
 * server-side, so those words are genuinely on the page.
 */
const QUIZ_LED_MIN_QUESTIONS = 8;
const QUIZ_LED_MIN_GUIDE_WORDS = 350;
const MIN_TOTAL_WORDS = 900;

function isQuizLed(guide: LearnGuide): boolean {
  return guide.quiz.length >= QUIZ_LED_MIN_QUESTIONS;
}

function minProseWords(guide: LearnGuide): number {
  return isQuizLed(guide) ? QUIZ_LED_MIN_GUIDE_WORDS : MIN_GUIDE_WORDS;
}

/** Em dash and double hyphen are banned in user-facing copy. */
const BANNED_PUNCTUATION = /—|--/;

function blockStrings(block: GuideBlock): string[] {
  switch (block.kind) {
    case 'heading':
    case 'paragraph':
      return [block.text];
    case 'list':
    case 'takeaways':
      return [...block.items];
    case 'steps':
      return block.items.flatMap(item => [item.title, item.text]);
    case 'table':
      return [block.caption ?? '', ...block.columns, ...block.rows.flat()];
    case 'callout':
      return [block.title, block.text];
  }
}

function guideStrings(guide: LearnGuide): string[] {
  return [
    guide.title,
    guide.metaTitle,
    guide.metaDescription,
    guide.answer,
    guide.nextStep.unitTitle,
    guide.nextStep.text,
    ...guide.body.flatMap(blockStrings),
    ...guide.quiz.flatMap(question => [
      question.prompt,
      question.scenario ?? '',
      question.explanation,
      ...question.options,
    ]),
  ];
}

describe('learn guide registry', () => {
  it('has a guide to test', () => {
    expect(LEARN_GUIDES.length).toBeGreaterThan(0);
  });

  it('gives every guide a unique course and slug pair', () => {
    const keys = LEARN_GUIDES.map(guide => `${guide.courseId}/${guide.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('publishes every guide under a public course', () => {
    expect(listGuideRoutes().length).toBe(LEARN_GUIDES.length);
  });

  it('resolves every guide path back to the same guide', () => {
    for (const { course, guide, path } of listGuideRoutes()) {
      expect(path).toBe(`${course.path}/${guide.slug}`);
      expect(resolveGuideRoute(course.slug, guide.slug)?.guide.slug).toBe(guide.slug);
    }
  });
});

describe.each(LEARN_GUIDES.map(guide => [guide.slug, guide] as const))(
  'guide %s',
  (_slug, guide) => {
    it('carries enough written prose to stand on its own', () => {
      expect(countGuideWords(guide)).toBeGreaterThanOrEqual(minProseWords(guide));
      expect(countGuideWords(guide) + countGuideQuizWords(guide)).toBeGreaterThanOrEqual(
        MIN_TOTAL_WORDS,
      );
    });

    it('reinforces with three to five questions', () => {
      expect(guide.quiz.length).toBeGreaterThanOrEqual(MIN_QUIZ_QUESTIONS);
      expect(guide.quiz.length).toBeLessThanOrEqual(MAX_QUIZ_QUESTIONS);
      expect(new Set(guide.quiz.map(question => question.id)).size).toBe(guide.quiz.length);
    });

    it('points every quiz answer at a real option', () => {
      for (const question of guide.quiz) {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThan(question.options.length);
        expect(new Set(question.options).size).toBe(question.options.length);
      }
    });

    it('fits its title and description in the SERP budget', () => {
      const issues = findMetadataLengthIssues({
        title: guide.metaTitle,
        description: guide.metaDescription,
        path: `/learn/${guide.courseId}/${guide.slug}`,
      });
      expect(issues).toEqual([]);
    });

    it('uses no em dash or double hyphen in copy', () => {
      const offenders = guideStrings(guide).filter(text => BANNED_PUNCTUATION.test(text));
      expect(offenders).toEqual([]);
    });
  }
);

describe('learn course and hub copy', () => {
  it('gives every public course an intro', () => {
    expect(listPublishedCourses().length).toBe(listCourseIntros().length);
  });

  it('fits every course title and description in the SERP budget', () => {
    for (const intro of listCourseIntros()) {
      expect(
        findMetadataLengthIssues({
          title: intro.metaTitle,
          description: intro.metaDescription,
          path: `/learn/${intro.courseId}`,
        })
      ).toEqual([]);
    }
  });

  it('uses no em dash or double hyphen in course or hub copy', () => {
    const copy = [
      LEARN_HUB.intro,
      ...LEARN_HUB.body.flatMap(blockStrings),
      ...listCourseIntros().flatMap(intro => [intro.intro, ...intro.body.flatMap(blockStrings)]),
    ];
    expect(copy.filter(text => BANNED_PUNCTUATION.test(text))).toEqual([]);
  });
});

describe('sitemap', () => {
  it('lists every guide', () => {
    const urls = sitemap().map(entry => entry.url);
    for (const { path } of listGuideRoutes()) {
      expect(urls.some(url => url.endsWith(path))).toBe(true);
    }
  });

  it('drops the section and unit URLs that have no route', () => {
    const listed = new Set(sitemap().map(entry => entry.url));
    const suppressed = buildSitemapCandidates().filter(
      candidate => candidate.kind === 'section' || candidate.kind === 'unit'
    );

    expect(suppressed.length).toBeGreaterThan(0);
    expect(suppressed.every(candidate => !listed.has(candidate.url))).toBe(true);
  });

  it('keeps every URL it does list on a route that exists', () => {
    const routable = new Set([
      '/learn',
      ...listPublishedCourses().map(({ course }) => course.path),
      ...listGuideRoutes().map(({ path }) => path),
    ]);

    const learnUrls = sitemap()
      .map(entry => new URL(entry.url).pathname)
      .filter(path => path.startsWith('/learn'));

    expect(learnUrls.length).toBeGreaterThan(0);
    for (const path of learnUrls) expect(routable.has(path)).toBe(true);
  });
});
