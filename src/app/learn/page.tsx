import type { Metadata } from 'next';

import { LEARN_HUB } from '@/data/learn/hub';

import { GuideBlocks } from '@/components/learn/GuideBlocks';
import { LearnBreadcrumbs } from '@/components/learn/LearnBreadcrumbs';
import { LearnLinkCard } from '@/components/learn/LearnLinkCard';
import { hubCrumbs } from '@/lib/learn/breadcrumbs';
import { guideReadingMinutes } from '@/lib/learn/guide-text';
import { LEARN_HUB_PATH, listGuideRoutes, listPublishedCourses } from '@/lib/learn/routes';
import { JsonLd } from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';

const CRUMBS = hubCrumbs();

const SECTION_HEADING =
  'mt-10 mb-3 text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl';

export const metadata: Metadata = buildMetadata({
  title: LEARN_HUB.metaTitle,
  description: LEARN_HUB.metaDescription,
  path: LEARN_HUB_PATH,
  keywords: LEARN_HUB.keywords,
});

export default function LearnHubPage() {
  const courses = listPublishedCourses();
  const guides = listGuideRoutes();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(CRUMBS)} />
      <LearnBreadcrumbs items={CRUMBS} />

      <h1 className="text-2xl font-extrabold leading-tight text-surface-900 dark:text-surface-50 sm:text-3xl">
        {LEARN_HUB.title}
      </h1>
      <p className="mt-3 text-base leading-8 text-surface-600 dark:text-surface-300">
        {LEARN_HUB.intro}
      </p>

      <GuideBlocks blocks={LEARN_HUB.body} />

      <h2 className={SECTION_HEADING}>Guides</h2>
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

      <h2 className={SECTION_HEADING}>Courses</h2>
      <ul className="space-y-3">
        {courses.map(({ course, intro }) => (
          <LearnLinkCard
            key={course.path}
            href={course.path}
            title={intro.title}
            description={course.description}
            meta={`${course.unitCount} units`}
          />
        ))}
      </ul>
    </>
  );
}
