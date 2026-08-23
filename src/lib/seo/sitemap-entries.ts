import type { MetadataRoute } from 'next';

import { listGuideRoutes } from '@/lib/learn/routes';

import { getPublicCourseTree } from './course-lookup';
import { absoluteUrl } from './urls';

export type SitemapEntryKind = 'static' | 'course' | 'section' | 'unit' | 'guide';

/**
 * One candidate URL, handed to the indexability predicate before it reaches
 * the sitemap. Fields beyond `kind`, `path` and `url` are populated only for
 * the levels where they make sense.
 */
export interface SitemapCandidate {
  kind: SitemapEntryKind;
  /** Normalized route path, leading slash, no trailing slash. */
  path: string;
  url: string;
  courseId?: string;
  /** Stable grouping key, derived from the section title. */
  sectionId?: string;
  /** `sectionIndex` from the content data, for predicates that key on it. */
  sectionIndex?: number;
  unitId?: string;
  /** Units only. A proxy for how much content the page will actually render. */
  lessonCount?: number;
  /** Guides only. The `/learn/[course]/[guide]` segment. */
  guideSlug?: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}

/**
 * Plug-in point for a content-quality allowlist.
 *
 * A later pass will gate thin `/learn` pages out of the sitemap. Replace the
 * default in `src/app/sitemap.ts` with a predicate of this shape; returning
 * `false` drops the URL from the sitemap and nothing else. Keeping the URL out
 * of the sitemap is not the same as `noindex`, so any page that must never be
 * indexed also needs `robots: { index: false }` in its own metadata.
 */
export type IndexabilityPredicate = (candidate: SitemapCandidate) => boolean;

/** Default predicate: everything the tree produces is eligible. */
export const allowAllUrls: IndexabilityPredicate = () => true;

/** Marketing and legal pages that exist regardless of course content. */
const STATIC_PAGES: { path: string; changeFrequency: SitemapCandidate['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/learn', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/get-started', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
];

const COURSE_PRIORITY = 0.8;
const SECTION_PRIORITY = 0.7;
const UNIT_PRIORITY = 0.6;
/** Guides outrank course hubs: they are the pages written to be landed on. */
const GUIDE_PRIORITY = 0.9;

function staticCandidates(): SitemapCandidate[] {
  return STATIC_PAGES.map(page => ({
    kind: 'static',
    path: page.path,
    url: absoluteUrl(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

/**
 * Courses flagged `requiresAccess` never appear: `getPublicCourseTree` filters
 * them out, so gated content such as mechanical engineering cannot leak into
 * the sitemap by accident.
 */
function courseCandidates(): SitemapCandidate[] {
  return getPublicCourseTree().flatMap(course => [
    {
      kind: 'course' as const,
      path: course.path,
      url: absoluteUrl(course.path),
      courseId: course.courseId,
      changeFrequency: 'weekly' as const,
      priority: COURSE_PRIORITY,
    },
    ...course.sections.flatMap(section => [
      {
        kind: 'section' as const,
        path: section.path,
        url: absoluteUrl(section.path),
        courseId: course.courseId,
        sectionId: section.sectionId,
        sectionIndex: section.sectionIndex,
        changeFrequency: 'monthly' as const,
        priority: SECTION_PRIORITY,
      },
      ...section.units.map(unit => ({
        kind: 'unit' as const,
        path: unit.path,
        url: absoluteUrl(unit.path),
        courseId: course.courseId,
        sectionId: section.sectionId,
        sectionIndex: section.sectionIndex,
        unitId: unit.unitId,
        lessonCount: unit.lessonCount,
        changeFrequency: 'monthly' as const,
        priority: UNIT_PRIORITY,
      })),
    ]),
  ]);
}

/**
 * Hand-written `/learn/[course]/[guide]` pages. These are the only content URLs
 * that currently carry enough prose to be worth indexing, so they get the
 * highest content priority in the file.
 */
function guideCandidates(): SitemapCandidate[] {
  return listGuideRoutes().map(({ course, guide, path }) => ({
    kind: 'guide' as const,
    path,
    url: absoluteUrl(path),
    courseId: course.courseId,
    guideSlug: guide.slug,
    changeFrequency: 'monthly' as const,
    priority: GUIDE_PRIORITY,
  }));
}

/** Every candidate URL, before the indexability predicate runs. */
export function buildSitemapCandidates(): SitemapCandidate[] {
  return [...staticCandidates(), ...courseCandidates(), ...guideCandidates()];
}

export interface SitemapOptions {
  isIndexable?: IndexabilityPredicate;
  /** Injected in tests so the generated XML is deterministic. */
  lastModified?: Date;
}

export function buildSitemapEntries(options: SitemapOptions = {}): MetadataRoute.Sitemap {
  const { isIndexable = allowAllUrls, lastModified = new Date() } = options;
  return buildSitemapCandidates()
    .filter(isIndexable)
    .map(candidate => ({
      url: candidate.url,
      lastModified,
      changeFrequency: candidate.changeFrequency,
      priority: candidate.priority,
    }));
}
