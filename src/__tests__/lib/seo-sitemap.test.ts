import { describe, expect, it } from 'vitest';

import { APP_URL } from '@/lib/constants';
import { buildCourseTree } from '@/lib/seo/course-tree';
import { findUnitBySlug, getPublicCourseTree, listAllUnitNodes } from '@/lib/seo/course-lookup';
import { buildSitemapCandidates, buildSitemapEntries } from '@/lib/seo/sitemap-entries';

const GATED_COURSE_ID = 'mechanical-engineering';

/** Routes that serve `robots: noindex`. A sitemap listing one contradicts it. */
const NOINDEX_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/try'];

describe('buildCourseTree', () => {
  it('excludes courses that require granted access', () => {
    const ids = buildCourseTree().map(course => course.courseId);
    expect(ids).not.toContain(GATED_COURSE_ID);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('includes gated courses only when explicitly asked', () => {
    const ids = buildCourseTree({ includeGated: true }).map(course => course.courseId);
    expect(ids).toContain(GATED_COURSE_ID);
  });

  it('nests every unit under a section under a course', () => {
    for (const course of getPublicCourseTree()) {
      expect(course.path).toBe(`/learn/${course.slug}`);
      for (const section of course.sections) {
        expect(section.path).toBe(`${course.path}/${section.slug}`);
        for (const unit of section.units) {
          expect(unit.path).toBe(`${section.path}/${unit.slug}`);
        }
      }
    }
  });

  it('produces paths that resolve back to the same unit', () => {
    for (const { course, section, unit } of listAllUnitNodes()) {
      const resolved = findUnitBySlug(course.slug, section.slug, unit.slug);
      expect(resolved?.unit?.unitId).toBe(unit.unitId);
    }
  });
});

describe('buildSitemapCandidates', () => {
  it('never emits a duplicate URL', () => {
    const urls = buildSitemapCandidates().map(candidate => candidate.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('never emits a gated course URL', () => {
    const urls = buildSitemapCandidates().map(candidate => candidate.url);
    expect(urls.some(url => url.includes(GATED_COURSE_ID))).toBe(false);
  });

  it('keeps the static marketing pages', () => {
    const urls = buildSitemapCandidates().map(candidate => candidate.url);
    expect(urls).toContain(APP_URL);
    expect(urls).toContain(`${APP_URL}/pricing`);
    expect(urls).toContain(`${APP_URL}/refund-policy`);
  });

  it('stays well under the 50,000 URL cap for a single sitemap file', () => {
    expect(buildSitemapCandidates().length).toBeLessThan(50_000);
  });

  it('never lists a noindex auth route', () => {
    const paths = buildSitemapCandidates().map(candidate => candidate.path);
    for (const route of NOINDEX_ROUTES) expect(paths).not.toContain(route);
  });
});

describe('buildSitemapEntries', () => {
  it('applies the indexability predicate', () => {
    const entries = buildSitemapEntries({ isIndexable: candidate => candidate.kind === 'static' });
    expect(entries.every(entry => !entry.url.includes('/learn/'))).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('defaults to including every candidate', () => {
    expect(buildSitemapEntries().length).toBe(buildSitemapCandidates().length);
  });

  it('dates content URLs from the content, not from the build', () => {
    const content = buildSitemapEntries({
      isIndexable: candidate => candidate.kind === 'guide' || candidate.kind === 'course',
    });
    expect(content.length).toBeGreaterThan(0);
    for (const entry of content) expect(String(entry.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('omits lastmod rather than inventing one for pages with no content date', () => {
    const statics = buildSitemapEntries({ isIndexable: candidate => candidate.kind === 'static' });
    expect(statics.length).toBeGreaterThan(0);
    expect(statics.every(entry => entry.lastModified === undefined)).toBe(true);
  });

  it('never stamps every URL with the same date, which is the build-timestamp signature', () => {
    const stamps = new Set(buildSitemapEntries().map(entry => entry.lastModified));
    expect(stamps.size).toBeGreaterThan(1);
  });
});
