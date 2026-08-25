import type { Metadata } from 'next';

import { AboutIntro } from '@/components/about/AboutIntro';
import { AboutProcess } from '@/components/about/AboutProcess';
import { AboutPublishing } from '@/components/about/AboutPublishing';
import { LearnBreadcrumbs } from '@/components/learn/LearnBreadcrumbs';
import { getPublishedContentStats } from '@/lib/learn/content-stats';
import { JsonLd } from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  ABOUT_PATH,
  buildAboutPageJsonLd,
  buildBreadcrumbJsonLd,
  type BreadcrumbItem,
} from '@/lib/seo/structured-data';

/**
 * The page that answers "who is responsible for this content".
 *
 * Server component, no session, no client island: a reader deciding whether to
 * trust the site and a crawler assessing it have to see the same words in the
 * same HTML. The counts in the copy are derived in `getPublishedContentStats`
 * rather than typed in, so the page cannot make a claim about the corpus that
 * the corpus has outgrown. It does not discuss who or what writes the lessons,
 * and must never assert human authorship in order to fill that silence.
 */
const TITLE = 'Who makes Octokeen';

const DESCRIPTION =
  'Octokeen is made by one person. The 19 checks every lesson runs, what they miss, why most of the course stays unpublished, and how to report an error.';

/** Last meaningful rewrite of this copy. The display string is written out so
 *  no date parsing sits between the constant and what a reader sees. */
const UPDATED = '2026-08-25';
const UPDATED_LABEL = 'August 25, 2026';

const CRUMBS: BreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: ABOUT_PATH },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: ABOUT_PATH,
  keywords: [
    'about octokeen',
    'octokeen quality checks',
    'octokeen editorial process',
    'how octokeen lessons are checked',
  ],
});

export default function AboutPage() {
  const stats = getPublishedContentStats();

  return (
    <article>
      <JsonLd
        data={[
          buildAboutPageJsonLd({ name: TITLE, description: DESCRIPTION }),
          buildBreadcrumbJsonLd(CRUMBS),
        ]}
      />
      <LearnBreadcrumbs items={CRUMBS} />

      <AboutIntro />
      <AboutProcess />
      <AboutPublishing
        courses={stats.courses}
        units={stats.units}
        lessons={stats.lessons}
        guides={stats.guides}
        indexableUnits={stats.indexableUnits}
      />

      <p className="mt-10 text-xs font-extrabold uppercase tracking-wide text-surface-400">
        Last updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
      </p>
    </article>
  );
}
