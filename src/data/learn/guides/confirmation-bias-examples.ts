import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `psy-sec6-u3` ("Confirmation and Availability Bias"),
 * lessons L1 to L4, in
 * `src/data/course/professions/psychology/units/section-6-biases-part1.ts`.
 * The quiz items below are drawn from that unit and keep their original ids so
 * the page and the course cannot drift apart.
 */
export const confirmationBiasExamplesGuide: LearnGuide = {
  slug: 'confirmation-bias-examples',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Confirmation Bias in Everyday Life: Twelve Real Examples',
  metaTitle: 'Confirmation Bias: 12 Everyday Examples',
  metaDescription:
    'Twelve concrete examples of confirmation bias, the three moves it makes, what the research really shows, and four fixes that survive contact with it.',
  keywords: [
    'confirmation bias',
    'confirmation bias examples',
    'confirmation bias in everyday life',
    'examples of confirmation bias',
    'cognitive biases',
    'positive test strategy',
  ],
  updated: '2026-08-23',
  answer:
    '**Confirmation bias** is the habit of treating evidence differently depending on whether it agrees with you. It runs in three moves: you search where a yes is likely, you read ambiguous things as fitting, and you remember the hits while the misses quietly fade. The defence that works is not open-mindedness in general but one specific act, deciding in advance what would count as proof you are wrong.',

  body: [
    { kind: 'heading', text: 'The three moves' },
    {
      kind: 'paragraph',
      text: 'Most explanations stop at "people prefer information that agrees with them", which is true and almost useless, because nobody ever catches themselves in that form. It gets catchable when you split it into the three distinct things it actually does.',
    },
    {
      kind: 'list',
      items: [
        '**Selective search.** You go looking where a yes is likely. The question you type into the search bar already contains the answer you expect to find.',
        '**Selective interpretation.** Ambiguous evidence gets read as supporting whatever you already thought. The same fact would have been read the other way had you started from the other side.',
        '**Selective recall.** Confirming episodes stay vivid and countable. Disconfirming ones never get filed, so when you total up your experience the score was rigged before you started counting.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The third is the sneakiest, because it arrives feeling like data. When you say "this always happens to me", you are reporting a memory count rather than a frequency, and memory was never keeping a fair one.',
    },

    { kind: 'heading', text: 'Twelve examples, and which move each one is' },
    {
      kind: 'paragraph',
      text: 'None of these involve politics or the news, which is where every other list starts. These are the small, dull, expensive versions that happen on an ordinary Tuesday.',
    },
    {
      kind: 'table',
      caption: 'Everyday confirmation bias, sorted by the move it makes',
      columns: ['Situation', 'What it looks like', 'Move'],
      rows: [
        [
          'Debugging code you wrote yourself',
          'You are certain the fault is in your function, so you scan the log for lines mentioning it and skim straight past the one saying the config file never loaded.',
          'Search',
        ],
        [
          'Running an A/B test',
          'The new design pulls ahead on day two, so you stop the test and ship. Had it been losing on day two you would have let it run the full fortnight.',
          'Search',
        ],
        [
          'Reference-checking a candidate you already liked',
          'Every question invites a yes. Was she reliable, was she easy to work with, would you hire her again.',
          'Search',
        ],
        [
          'Chasing a noise in the car',
          'You have decided it is the brake pads, so you book a brake job, and hear exactly the same noise on the drive home.',
          'Search',
        ],
        [
          'A used car you have already fallen for',
          'The rust along the sill becomes cosmetic. The two-year gap in the service history becomes proof it was barely driven.',
          'Interpret',
        ],
        [
          'Watching your own team',
          'The tackle against you was reckless. The identical tackle by your side was committed, and the referee is having a shocker.',
          'Interpret',
        ],
        [
          'Suspecting a partner is still attached to an ex',
          'Mentioning a holiday from four years ago is evidence. Never mentioning it is evidence of avoidance. Nothing they can do counts as disproof.',
          'Interpret',
        ],
        [
          'A parent who has cast one child as the messy one',
          'Both leave mugs on the table. One mug is an off day, the other mug is a personality.',
          'Interpret',
        ],
        [
          'Starting a new supplement',
          'On day four you feel sharper and credit the capsules. Days one to three, when you felt no different at all, do not come to mind.',
          'Recall',
        ],
        [
          'Picking a queue at the supermarket',
          'You know for a fact you always choose the slow one. You can name four times you did and none of the times you did not.',
          'Recall',
        ],
        [
          'A manager who has decided someone is unreliable',
          'The employee is on time nine mornings in ten. The one late morning is the one the manager can still describe six weeks later.',
          'Recall',
        ],
        [
          'Any stretch of weeks you were told would be unlucky',
          'You notice the laptop crash and the cancelled train. The uneventful weeks either side were never counted, because nobody asked you to count them.',
          'Recall',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'Four of each, which is roughly the ratio in life. Notice that nobody in that table is lying, lazy or stupid. Every one of them is doing something that feels from the inside like ordinary careful thinking.',
    },

    { kind: 'heading', text: 'Why "keep an open mind" does not work' },
    {
      kind: 'paragraph',
      text: 'In 1960 Peter Wason gave people the sequence 2, 4, 6 and told them it followed a rule he had in mind. They could propose as many further triples as they liked, would be told yes or no each time, and were to announce the rule only when confident. Almost everyone guessed something like "ascending even numbers" and then tested 8, 10, 12. Then 20, 22, 24. Every test came back yes, confidence climbed, and fewer than a quarter got the rule right at the first attempt. The rule was **any three numbers in ascending order**.',
    },
    {
      kind: 'paragraph',
      text: 'The triple that cracks it in one move is 1, 2, 3, and hardly anyone reaches for it. That is the part worth sitting with. Those participants were not refusing to gather evidence. They were gathering it enthusiastically. They just kept gathering the kind that could only ever say yes.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'It is a testing strategy, not stubbornness',
      text: 'Klayman and Ha argued in 1987 that what Wason found is a **positive test strategy**: when checking an idea, people look at cases where they expect it to hold. That is usually an efficient way to search, and it only misleads when the truth is broader than your guess, which is precisely how the 2, 4, 6 task was built. Read that way, confirmation bias is a good habit pointed at the wrong shape of problem.',
    },

    { kind: 'heading', text: 'What the research shows, and what it does not' },
    {
      kind: 'paragraph',
      text: 'The firmest evidence is about what people choose to read. A 2009 meta-analysis by Hart and colleagues pooled 91 studies covering close to 8,000 participants and found people select information agreeing with their existing view roughly twice as often as information challenging it. Not exclusively. About two to one, which is a real and workable effect rather than the caricature of someone who never hears a contrary word.',
    },
    {
      kind: 'paragraph',
      text: 'The famous 1979 study by Lord, Ross and Lepper gave supporters and opponents of the death penalty two fabricated studies, one pointing each way. Both sides judged the study that agreed with them to be the better conducted one. That half, **biased assimilation**, has held up. The headline claim that both sides then became more extreme has held up far less well: it showed up mainly on self-reports of having changed, and later work using direct before-and-after attitude measures often failed to find it. Where you see confirmation bias described as making people more polarised every time they meet an opposing argument, that is the shaky half of a real result.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'The backfire effect mostly did not replicate',
      text: 'A widely repeated claim says correcting someone strengthens the false belief. It comes from a 2010 study that found it under narrow conditions. A far larger effort by Wood and Porter, covering 52 issues and more than ten thousand participants, found the opposite: people generally moved toward the facts, and backfire was essentially absent. Correcting a friend is not futile. It is just slower and duller than either side of that argument suggests.',
    },

    { kind: 'heading', text: 'Where it stops being a quirk' },
    {
      kind: 'paragraph',
      text: 'Three settings where the same three moves carry real consequences, and where the field had to change its procedures because willpower did not fix it.',
    },
    {
      kind: 'list',
      items: [
        '**Fingerprint identification.** Dror, Charlton and Peron gave five latent print examiners a pair of prints each had personally judged a match in real casework about five years earlier. This time the prints arrived with context implying the FBI had got them wrong. Four of the five changed their conclusion. The sample is tiny, five experts with one pair each, and it is still one of the reasons forensic labs now withhold case context from examiners.',
        '**Medical diagnosis.** The first plausible diagnosis becomes the lens for everything after it. Later results get read as consistent with it rather than as tests of it, and the moment for asking what else this could be passes without anyone noticing. Clinicians call it premature closure, and it is a large part of why diagnostic checklists exist.',
        '**Hiring.** Dana, Dawes and Peterson had people predict how students would perform academically. Adding an unstructured interview made the predictions worse than using the background data alone. In one condition the interviewees answered at random, and the interviewers still came away feeling they had learned who these people were.',
      ],
    },

    { kind: 'heading', text: 'Four things that actually reduce it' },
    {
      kind: 'paragraph',
      text: 'Awareness on its own does close to nothing, and the fingerprint examiners are the proof: bias was their professional subject and it did not save them. What works is changing the procedure so the bias has less to grip.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Write down what would prove you wrong, before you look',
          text: 'Name a specific observation, not a category. Not "evidence against", but "if the config had loaded, this line would say so". Once it is written down you cannot quietly redefine it later.',
        },
        {
          title: 'Fix the stopping rule in advance',
          text: 'Decide how long the test runs, how many references you will call, how many quotes you will collect. Confirmation bias mostly gets in through the decision to stop looking, and that decision always arrives just after good news.',
        },
        {
          title: 'Consider the opposite, in its strong form',
          text: 'Lord, Lepper and Preston found in 1984 that telling people to be objective changed nothing, while asking whether they would judge this evidence the same way had it pointed the other way did reduce the bias. The specific counterfactual is the active ingredient.',
        },
        {
          title: 'Give someone the job of disagreeing, and cover for doing it',
          text: 'A dissenter with nothing to lose finds what a polite room cannot. A pre-mortem, where the team assumes the plan has already failed and explains why, is the same idea with the awkwardness engineered out.',
        },
      ],
    },

    { kind: 'heading', text: 'Not everything is confirmation bias' },
    {
      kind: 'paragraph',
      text: 'The term has spread far enough to be used for any reasoning error involving a belief, which makes it useless. Three near neighbours worth keeping apart.',
    },
    {
      kind: 'table',
      columns: ['Looks similar', 'How to tell it apart'],
      rows: [
        [
          'Availability heuristic',
          'You judge something as common because examples come to mind easily, with no prior belief under defence. Cancelling a flight after a crash documentary is availability. Reading only reviews that agree with the booking you already made is confirmation.',
        ],
        [
          'Motivated reasoning',
          'Confirmation bias runs on what you already think. Motivated reasoning runs on what you want to be true. They travel together, and the second is harder to shift, because the conclusion is doing a job for you.',
        ],
        [
          '[[sunk-cost-fallacy|The sunk cost fallacy]]',
          'What holds you in place is money or time already spent, not a belief already held. It is a close relative, and the two feed each other: having invested, you now have a reason to read every ambiguous signal as encouraging.',
        ],
      ],
    },

    {
      kind: 'takeaways',
      items: [
        'Confirmation bias is three separate habits: selective search, selective interpretation and selective recall. Naming which one you are in is most of the work.',
        'The mechanism underneath is a positive test strategy, which is usually sensible. It fails when the truth is broader than your hypothesis.',
        'People choose agreeable information about twice as often as challenging information. That is the real size of it, and it is smaller than the folklore.',
        'The backfire effect largely failed to replicate. Correcting people generally works.',
        'Deciding in advance what would prove you wrong, and when you will stop looking, beats any amount of resolving to be open-minded.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec6-u3-L1-Q2',
      prompt: 'Which of these is an example of confirmation bias?',
      options: [
        'Reading only positive reviews after buying a product',
        'Carefully comparing all options before a purchase',
        'Changing your mind when presented with new evidence',
        'Picking news sources at random each morning',
      ],
      correctIndex: 0,
      explanation:
        'The purchase is already made, so those reviews are not informing a decision. They are collecting yeses for one you have taken, which is selective search.',
    },
    {
      id: 'psy-sec6-u3-L1-Q4',
      scenario:
        'A manager believes one employee is unreliable. The employee arrives on time nine days out of ten, and the manager only remembers the one late day.',
      prompt: 'Which of the three moves is this?',
      options: [
        'Selective recall: the confirming day is the one that stuck',
        'Selective search: the manager went through the attendance records',
        'Selective interpretation: the manager misread the rota',
        'This is not confirmation bias at all',
      ],
      correctIndex: 0,
      explanation:
        'Nobody went looking and nothing was misread. The belief decided which morning was worth storing, and the stored count now passes itself off as evidence.',
    },
    {
      id: 'psy-sec6-u3-L2-Q2',
      prompt: 'How does an echo chamber strengthen confirmation bias?',
      options: [
        'It exposes you to many competing viewpoints at the same time',
        'It surrounds you with agreement until the belief feels like fact',
        'It forces you to keep defending your opinions against critics',
        'It has no real connection to confirmation bias',
      ],
      correctIndex: 1,
      explanation:
        'It removes the disconfirming half of the evidence before you ever see it. You are not ignoring the counterargument, which is worse: you never learn there is one.',
    },
    {
      id: 'psy-sec6-u3-L3-Q6',
      scenario:
        'After watching a documentary about plane crashes, a traveller cancels their flight and drives instead, even though driving is more dangerous per mile.',
      prompt: 'Which bias is this?',
      options: [
        'Availability heuristic: the documentary made crashes easy to picture',
        'Confirmation bias: the traveller already disliked flying',
        'Anchoring bias: the documentary set a numerical reference point',
        'Framing effect: the same risk was described in negative terms',
      ],
      correctIndex: 0,
      explanation:
        'No prior belief is being protected here. Vivid recent footage inflated the felt frequency of crashes, which is availability. Confirmation bias needs a view that was already in place.',
    },
    {
      id: 'psy-sec6-u3-L1-Q5',
      prompt: 'What most reliably reduces confirmation bias?',
      options: [
        'Trusting your first instinct more often',
        'Deciding in advance what evidence would prove you wrong',
        'Resolving to keep an open mind about the question',
        'Discussing the question only with people who know the subject',
      ],
      correctIndex: 1,
      explanation:
        'General resolutions to be objective have been tested and do not move the needle. A specific disconfirming test, written down before you look, is the one that does.',
    },
  ],

  related: [
    {
      slug: 'sunk-cost-fallacy',
      reason:
        'The close relative that runs on spent money rather than held belief, with ten examples and the one question that gets you out of it.',
    },
    {
      slug: 'cognitive-bias-quiz',
      reason:
        'Practice telling confirmation bias apart from availability, anchoring and the rest, in twelve scenarios written so more than one label looks plausible.',
    },
  ],

  nextStep: {
    unitTitle: 'Confirmation and Availability Bias',
    text: 'The Psychology and Human Behavior course runs this unit over five lessons, pairing confirmation bias with the availability heuristic it is so often confused with, and finishing on a conversation where you have to talk a friend out of both.',
  },
};
