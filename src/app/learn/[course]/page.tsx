import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GuideBlocks } from '@/components/learn/GuideBlocks';
import { LearnBreadcrumbs } from '@/components/learn/LearnBreadcrumbs';
import { LearnLinkCard } from '@/components/learn/LearnLinkCard';
import { courseCrumbs } from '@/lib/learn/breadcrumbs';
import { buildLearnCourseJsonLd } from '@/lib/learn/course-json-ld';
import { guideReadingMinutes } from '@/lib/learn/guide-text';
import {
  listCourseGuideRoutes,
  listPublishedCourses,
  resolvePublishedCourse,
} from '@/lib/learn/routes';
import { JsonLd } from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';

interface CoursePageProps {
  params: Promise<{ course: string }>;
}

export function generateStaticParams(): { course: string }[] {
  return listPublishedCourses().map(({ course }) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const resolved = resolvePublishedCourse(courseSlug);
  if (!resolved) return {};

  const { course, intro } = resolved;
  return buildMetadata({
    title: intro.metaTitle,
    description: intro.metaDescription,
    path: course.path,
    keywords: intro.keywords,
  });
}

export default async function LearnCoursePage({ params }: CoursePageProps) {
  const { course: courseSlug } = await params;
  const resolved = resolvePublishedCourse(courseSlug);
  if (!resolved) notFound();

  const { course, intro } = resolved;
  const guides = listCourseGuideRoutes(resolved);
  const crumbs = courseCrumbs(resolved);

  return (
    <>
      <JsonLd data={[buildLearnCourseJsonLd(resolved), buildBreadcrumbJsonLd(crumbs)]} />
      <LearnBreadcrumbs items={crumbs} />

      <h1 className="text-2xl font-extrabold leading-tight text-surface-900 dark:text-surface-50 sm:text-3xl">
        {intro.title}
      </h1>
      <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-surface-400">
        {course.unitCount} units, {course.lessonCount} lessons
      </p>
      <p className="mt-3 text-base leading-8 text-surface-600 dark:text-surface-300">
        {intro.intro}
      </p>

      <GuideBlocks blocks={intro.body} />

      {guides.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl">
            Guides in this subject
          </h2>
          <ul className="space-y-3">
            {guides.map(({ guide, path }) => (
              <LearnLinkCard
                key={path}
                href={path}
                title={guide.title}
                description={guide.metaDescription}
                meta={`${guideReadingMinutes(guide)} min read`}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 rounded-2xl border-2 border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="text-lg font-extrabold text-surface-900 dark:text-surface-50">
          Start the course
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300">
          The first lesson runs in the browser with no account and no card. It takes about five
          minutes.
        </p>
        <Link
          href="/try"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary-600 py-4 text-sm font-extrabold text-white shadow-[0_6px_0_var(--color-primary-800)]"
        >
          Try a free lesson
        </Link>
      </section>
    </>
  );
}
