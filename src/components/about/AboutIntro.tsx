import { Fragment } from 'react';

import { listPublishedCourses } from '@/lib/learn/routes';

import { AboutHeading, AboutLink, AboutText } from './AboutProse';

const LEAD =
  'mt-4 rounded-2xl border-l-4 border-primary-500 bg-white px-4 py-3 text-base leading-8 text-surface-700 dark:bg-surface-900 dark:text-surface-200';

/** The live courses, linked, as a readable sentence fragment. */
function CourseLinks() {
  const courses = listPublishedCourses();
  const lastIndex = courses.length - 1;
  // Course names contain "and", so three or more of them need the serial comma
  // to stay readable: "Psychology and Human Behavior, and Space and Astronomy".
  const finalJoin = courses.length > 2 ? ', and ' : ' and ';

  return (
    <>
      {courses.map(({ course, intro }, index) => (
        <Fragment key={course.path}>
          {index === 0 ? '' : index === lastIndex ? finalJoin : ', '}
          <AboutLink href={course.path}>{intro.title}</AboutLink>
        </Fragment>
      ))}
    </>
  );
}

/** The answer to "who is responsible for this", in the first two sentences. */
export function AboutIntro() {
  return (
    <section>
      <h1 className="text-2xl font-extrabold leading-tight text-surface-900 dark:text-surface-50 sm:text-3xl">
        Who makes Octokeen
      </h1>
      <p className={LEAD}>
        Octokeen is made by one person. I build it, I run it, and I am the one answerable for
        every lesson on it. There is no team, no editorial board and no panel of reviewers, and
        this page exists so you do not have to guess at any of that before deciding how much to
        trust what you read here.
      </p>

      <AboutHeading>What Octokeen is</AboutHeading>
      <AboutText>
        Octokeen teaches general knowledge in short lessons: a question, a short explanation, and
        enough of a streak to make tomorrow easier than today. The live courses are{' '}
        <CourseLinks />. Alongside them are the written{' '}
        <AboutLink href="/learn">guides</AboutLink>, which are longer pages that each answer a
        single question properly.
      </AboutText>
      <AboutText>
        I am not a psychologist, an astronomer or a financial adviser, and none of this is advice
        about your health or your money. It is general education, written to be accurate. Treat it
        the way you would treat a well made textbook chapter, not the way you would treat a
        professional you hired.
      </AboutText>
    </section>
  );
}
