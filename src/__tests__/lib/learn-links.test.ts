import { describe, expect, it } from 'vitest';

import { listCourseIntros } from '@/data/learn/courses';
import { FEATURED_GUIDE_LINKS } from '@/data/learn/featured';
import { LEARN_GUIDES } from '@/data/learn/guides';
import { LEARN_HUB } from '@/data/learn/hub';
import type { GuideBlock, LearnGuide } from '@/data/learn/types';
import { resolveGuideSlug } from '@/lib/learn/guide-links';
import { listGuideLinkAnchors, listGuideLinkSlugs } from '@/lib/learn/guide-markup';
import { listCourseGuideRoutes, listGuideRoutes, listPublishedCourses } from '@/lib/learn/routes';

/**
 * The internal linking of `/learn`, held by tests rather than by review.
 *
 * The surface shipped orphaned: nothing on the site pointed into it, and
 * guides pointed only back up at their course. The fixes are a `related`
 * array on every guide and `[[slug|anchor]]` markup inside the prose, and both
 * name a guide by slug alone. That is only safe if a slug nobody answers to
 * breaks the build, which is what most of this file is for.
 */

/** Anchor text that tells a reader and a crawler nothing about the target. */
const USELESS_ANCHORS = ['read more', 'click here', 'here', 'this', 'link', 'more', 'learn more'];
const MIN_ANCHOR_WORDS = 2;

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

/** Every string that goes through `InlineText`, so every string that may link. */
function richTextOf(guide: LearnGuide): string[] {
  return [guide.answer, guide.nextStep.text, ...guide.body.flatMap(blockStrings)];
}

function allRichText(): string[] {
  return [
    ...LEARN_GUIDES.flatMap(richTextOf),
    LEARN_HUB.intro,
    ...LEARN_HUB.body.flatMap(blockStrings),
    ...listCourseIntros().flatMap(intro => [intro.intro, ...intro.body.flatMap(blockStrings)]),
  ];
}

function findGuide(slug: string): LearnGuide | undefined {
  return LEARN_GUIDES.find(guide => guide.slug === slug);
}

describe('guide slugs', () => {
  it('are unique across every course, so a slug alone names one guide', () => {
    const slugs = LEARN_GUIDES.map(guide => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all resolve through the slug lookup the markup and relations use', () => {
    for (const guide of LEARN_GUIDES) {
      expect(resolveGuideSlug(guide.slug)?.guide.slug).toBe(guide.slug);
    }
  });

  it('resolves nothing for a slug no guide answers to', () => {
    expect(resolveGuideSlug('no-such-guide')).toBeNull();
  });
});

describe('declared relations', () => {
  it('leaves no guide without one, so nothing ships orphaned', () => {
    const orphans = LEARN_GUIDES.filter(guide => guide.related.length === 0).map(g => g.slug);
    expect(orphans).toEqual([]);
  });

  it('points every relation at a guide that exists', () => {
    const broken = LEARN_GUIDES.flatMap(guide =>
      guide.related
        .filter(relation => resolveGuideSlug(relation.slug) === null)
        .map(relation => `${guide.slug} -> ${relation.slug}`)
    );
    expect(broken).toEqual([]);
  });

  it('never relates a guide to itself', () => {
    const selfLinks = LEARN_GUIDES.filter(guide =>
      guide.related.some(relation => relation.slug === guide.slug)
    ).map(guide => guide.slug);
    expect(selfLinks).toEqual([]);
  });

  it('lists each target at most once per guide', () => {
    for (const guide of LEARN_GUIDES) {
      const targets = guide.related.map(relation => relation.slug);
      expect(new Set(targets).size).toBe(targets.length);
    }
  });

  it('makes every relation mutual', () => {
    const oneWay = LEARN_GUIDES.flatMap(guide =>
      guide.related
        .filter(relation => {
          const target = findGuide(relation.slug);
          return !target?.related.some(back => back.slug === guide.slug);
        })
        .map(relation => `${guide.slug} -> ${relation.slug} is not returned`)
    );
    expect(oneWay).toEqual([]);
  });

  it('gives a reason that reads as a sentence about the other guide', () => {
    for (const guide of LEARN_GUIDES) {
      for (const relation of guide.related) {
        expect(relation.reason.split(/\s+/).length).toBeGreaterThanOrEqual(8);
        expect(BANNED_PUNCTUATION.test(relation.reason)).toBe(false);
      }
    }
  });
});

describe('inline guide links', () => {
  it('has some, so the prose is doing linking work at all', () => {
    const linked = allRichText().flatMap(listGuideLinkSlugs);
    expect(linked.length).toBeGreaterThan(0);
  });

  it('points every one at a guide that exists', () => {
    const broken = allRichText()
      .flatMap(listGuideLinkSlugs)
      .filter(slug => resolveGuideSlug(slug) === null);
    expect(broken).toEqual([]);
  });

  it('never links a guide to itself from its own prose', () => {
    const selfLinks = LEARN_GUIDES.flatMap(guide =>
      richTextOf(guide)
        .flatMap(listGuideLinkSlugs)
        .filter(slug => slug === guide.slug)
        .map(slug => `${guide.slug} links to itself`)
    );
    expect(selfLinks).toEqual([]);
  });

  it('uses anchor text that describes where the reader lands', () => {
    const weak = allRichText()
      .flatMap(listGuideLinkAnchors)
      .filter(
        anchor =>
          USELESS_ANCHORS.includes(anchor.trim().toLowerCase()) ||
          anchor.trim().split(/\s+/).length < MIN_ANCHOR_WORDS
      );
    expect(weak).toEqual([]);
  });
});

describe('links into /learn from outside it', () => {
  it('points every featured landing link at a live guide route', () => {
    const paths = new Set(listGuideRoutes().map(route => route.path));
    const broken = FEATURED_GUIDE_LINKS.map(link => link.path).filter(path => !paths.has(path));
    expect(broken).toEqual([]);
  });

  it('keeps every featured label equal to that guide title', () => {
    const titleByPath = new Map(listGuideRoutes().map(route => [route.path, route.guide.title]));
    for (const { path, label } of FEATURED_GUIDE_LINKS) {
      expect(label).toBe(titleByPath.get(path));
    }
  });

  it('features guides from more than one course', () => {
    const courses = new Set(FEATURED_GUIDE_LINKS.map(link => link.path.split('/')[2]));
    expect(courses.size).toBeGreaterThan(1);
  });
});

describe('course hubs', () => {
  it('lists every guide belonging to the course', () => {
    for (const published of listPublishedCourses()) {
      const listed = listCourseGuideRoutes(published).map(route => route.guide.slug);
      const expected = LEARN_GUIDES.filter(
        guide => guide.courseId === published.course.courseId
      ).map(guide => guide.slug);
      expect(listed.sort()).toEqual(expected.sort());
    }
  });

  it('gives the psychology hub all seven psychology guides', () => {
    const psychology = listPublishedCourses().find(({ course }) => course.slug === 'psychology');
    expect(psychology).toBeDefined();
    if (!psychology) return;
    expect(listCourseGuideRoutes(psychology).length).toBe(
      LEARN_GUIDES.filter(guide => guide.courseId === psychology.course.courseId).length
    );
  });
});
