import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GuideBlocks } from '@/components/learn/GuideBlocks';
import { GuideByline } from '@/components/learn/GuideByline';
import { GuideCta } from '@/components/learn/GuideCta';
import { GuideQuiz } from '@/components/learn/GuideQuiz';
import { GuideRelated } from '@/components/learn/GuideRelated';
import { GuideViewTracker } from '@/components/learn/GuideViewTracker';
import { InlineText } from '@/components/learn/InlineText';
import { LearnBreadcrumbs } from '@/components/learn/LearnBreadcrumbs';
import { guideCrumbs } from '@/lib/learn/breadcrumbs';
import { buildLearnCourseJsonLd } from '@/lib/learn/course-json-ld';
import { guideReadingMinutes } from '@/lib/learn/guide-text';
import { listGuideRoutes, resolveGuideRoute } from '@/lib/learn/routes';
import { JsonLd } from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';

interface GuidePageProps {
  params: Promise<{ course: string; guide: string }>;
}

export function generateStaticParams(): { course: string; guide: string }[] {
  return listGuideRoutes().map(({ course, guide }) => ({ course: course.slug, guide: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { course, guide } = await params;
  const route = resolveGuideRoute(course, guide);
  if (!route) return {};

  return buildMetadata({
    title: route.guide.metaTitle,
    description: route.guide.metaDescription,
    path: route.path,
    keywords: route.guide.keywords,
    type: 'article',
  });
}

export default async function LearnGuidePage({ params }: GuidePageProps) {
  const { course: courseSlug, guide: guideSlug } = await params;
  const route = resolveGuideRoute(courseSlug, guideSlug);
  if (!route) notFound();

  const { course, guide } = route;
  const crumbs = guideCrumbs(route);

  return (
    <article>
      <JsonLd data={[buildLearnCourseJsonLd(route), buildBreadcrumbJsonLd(crumbs)]} />
      <GuideViewTracker guideSlug={guide.slug} professionId={course.courseId} />
      <LearnBreadcrumbs items={crumbs} />

      <h1 className="text-2xl font-extrabold leading-tight text-surface-900 dark:text-surface-50 sm:text-3xl">
        {guide.title}
      </h1>
      <GuideByline readingMinutes={guideReadingMinutes(guide)} updated={guide.updated} />

      <p className="mt-4 rounded-2xl border-l-4 border-primary-500 bg-white px-4 py-3 text-base leading-8 text-surface-700 dark:bg-surface-900 dark:text-surface-200">
        <InlineText text={guide.answer} />
      </p>

      <GuideBlocks blocks={guide.body} />

      <GuideRelated guide={guide} />

      <GuideQuiz guideSlug={guide.slug} professionId={course.courseId} questions={guide.quiz} />

      <section className="mt-10 rounded-2xl border-2 border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="text-lg font-extrabold text-surface-900 dark:text-surface-50">
          Keep going: {guide.nextStep.unitTitle}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300">
          <InlineText text={guide.nextStep.text} />
        </p>
        <GuideCta
          guideSlug={guide.slug}
          professionId={course.courseId}
          coursePath={course.path}
          courseName={course.name}
        />
      </section>
    </article>
  );
}
