import { AboutHeading, AboutItem, AboutList, AboutStrong, AboutSubheading, AboutText } from './AboutProse';

/**
 * What is checked before a lesson ships, and where the checking stops.
 *
 * Every claim here is verifiable in the repository: the checks are the ones in
 * `src/lib/content-qa.ts`, and the two defects are the ones fixed in commit
 * 37f13e65. Two rules for anyone editing this file. Nothing may describe a
 * review step that does not exist, and nothing may assert who or what writes
 * the material. Not "written by experts", not "our team", not "hand-crafted".
 * The page does not discuss authorship at all, and a false claim about it is
 * the one thing that would make every other claim here worth less.
 */
export function AboutProcess() {
  return (
    <section>
      <AboutHeading>How lessons are checked</AboutHeading>
      <AboutText>
        Every lesson is run through 19 automated checks, and what those checks find is what decides
        whether the material around it can be published at all. The checks are the part of this you
        can hold me to, so they are the part worth describing in detail. They test three kinds of
        thing.
      </AboutText>
      <AboutList>
        <AboutItem>
          <AboutStrong>Structure.</AboutStrong> A match-pairs question has to offer exactly four
          pairs. A sorting question has to have six items and two buckets. An ordering question has
          to have four or five steps. A speed round has to be fifteen questions on a sixty second
          clock. The answer marked correct has to exist among the options. No two questions may
          share an id, because your progress is stored against those ids.
        </AboutItem>
        <AboutItem>
          <AboutStrong>Wording.</AboutStrong> The explanation attached to a wrong answer has to say
          what is wrong with that answer, rather than restate the right one in different words. That
          single pattern accounted for most of the defects in an earlier audit. The correct option
          may not run noticeably longer than the wrong ones either, because length is a tell that
          lets you score well without knowing anything.
        </AboutItem>
        <AboutItem>
          <AboutStrong>Length.</AboutStrong> Teaching text has a word budget per field and a two
          sentence ceiling per card. A wall of text on a phone does not get read, so a lesson that
          needs one is a lesson that needs rewriting.
        </AboutItem>
      </AboutList>

      <AboutSubheading>What the checks do not catch</AboutSubheading>
      <AboutText>
        They do not know whether anything is true. Not one of the 19 reads a claim and asks whether
        it is correct. They measure shape, wording and length, and a confident, well formed,
        carefully budgeted falsehood goes straight through all of them.
      </AboutText>
      <AboutText>Two real examples, both found by reading the content rather than running anything over it:</AboutText>
      <AboutList>
        <AboutItem>
          A match-pairs question offered <AboutStrong>massively overrepresented in news</AboutStrong>{' '}
          and <AboutStrong>wildly overrepresented relative to actual risk</AboutStrong> as two
          separate answers. They mean the same thing, so the question had two correct answers and
          could not be answered on its merits. All 19 checks passed it.
        </AboutItem>
        <AboutItem>
          An explanation claimed that switching a pension to automatic enrolment raises
          participation from 30% to 80% or more. Those figures were not real. They now read 49% to
          86%, which is what Madrian and Shea actually measured, and the lesson names the study. All
          19 checks passed the wrong version too.
        </AboutItem>
      </AboutList>
      <AboutText>
        Both were fixed in August 2026. They are on this page because a process is only worth
        something to you if you also know what it misses.
      </AboutText>
    </section>
  );
}
