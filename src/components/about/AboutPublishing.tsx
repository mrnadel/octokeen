import { AboutHeading, AboutLink, AboutText } from './AboutProse';

interface AboutPublishingProps {
  courses: number;
  units: number;
  lessons: number;
  guides: number;
  indexableUnits: number;
}

/**
 * What is published, what is deliberately held back, and how to report an
 * error. The counts come from `getPublishedContentStats`, so the restraint
 * this section claims is measured rather than asserted.
 *
 * Contact goes through `/contact` and the support address. No personal email.
 */
export function AboutPublishing({ courses, units, lessons, guides, indexableUnits }: AboutPublishingProps) {
  const unitCount = units.toLocaleString('en-US');

  return (
    <section>
      <AboutHeading>What gets published, and what is held back</AboutHeading>
      <AboutText>
        Most of the material is not on the open web, on purpose. The public pages are {guides}{' '}
        written guides and {courses} course overviews. The {unitCount} course units and{' '}
        {lessons.toLocaleString('en-US')} lessons behind them have no public pages at all.
      </AboutText>
      <AboutText>
        When they do get pages, a quality gate decides which ones qualify, and it is strict. A unit
        needs zero structural errors, has to stay inside a small budget of lesser warnings, has to
        carry at least 300 words of its own writing, and has to have at least six teaching cards.
        The gate fails closed, so anything it cannot measure stays out.
      </AboutText>
      <AboutText>
        Run against the courses as they stand, that gate passes {indexableUnits} units out of{' '}
        {unitCount}. That is not a typo and it is not a target. Nothing here gets published because
        it exists. It gets published because it was measured and passed, and the rest waits until
        the writing is good enough.
      </AboutText>

      <AboutHeading>Where the facts come from</AboutHeading>
      <AboutText>
        Where a lesson or a guide rests on a specific piece of research, the text names it: the
        researchers, usually the year, often the size of the sample. There is no bibliography and no
        link to the paper. I am not going to call that a citation policy, because it is not one. It
        is enough to let you look the study up yourself, which is the part that matters.
      </AboutText>

      <AboutHeading>If you find a mistake</AboutHeading>
      <AboutText>
        Tell me and I will fix it. The <AboutLink href="/contact">contact page</AboutLink> has the
        address, alongside the questions people ask most. Naming the exact question or the exact
        sentence makes it faster. Corrections go in as soon as I can verify them, and a claim I
        cannot verify comes out rather than getting softened.
      </AboutText>
    </section>
  );
}
