import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Shape C in `docs/seo/search-demand.md` §4: the reader came to be tested, so
 * the twelve items carry the page and the prose only frames them. The body is
 * deliberately short and the words are spent in the explanations, which is
 * where a reader who answers wrong actually learns something.
 *
 * Source material: the whole of section 6 ("Cognitive Biases") in
 * `src/data/course/professions/psychology/units/section-6-biases-part1.ts` and
 * `-part2.ts`. Every item keeps its original course id and targets a different
 * bias, so the set works as a diagnostic rather than a drill. Sunk cost is
 * deliberately absent: it has its own guide.
 */
export const cognitiveBiasQuizGuide: LearnGuide = {
  slug: 'cognitive-bias-quiz',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Cognitive Bias Quiz: Twelve Scenarios, Twelve Biases',
  metaTitle: 'Cognitive Bias Quiz: 12 Scenarios to Try',
  metaDescription:
    'Twelve real scenarios, one cognitive bias in each. Answer, then find out which bias it was and why it is so easy to miss. No signup and no score to beat.',
  keywords: [
    'cognitive bias quiz',
    'cognitive bias test',
    'test yourself cognitive biases',
    'spot the bias quiz',
    'list of cognitive biases',
    'bias blind spot',
  ],
  updated: '2026-08-23',
  answer:
    'Twelve scenarios are waiting below, each built around a single **cognitive bias**, with the explanation appearing the moment you answer. Nothing is gated and nothing is scored against you. The short version of what follows: the hard part was never learning the definitions, it is recognising a bias while you are inside one.',

  body: [
    { kind: 'heading', text: 'How to take it' },
    {
      kind: 'paragraph',
      text: 'Try to name the bias in your head **before** you read the four options. Picking the right label off a list is recognition, which is easy and fades. Producing it from nothing is recall, and recall is what will actually fire when a colleague says "we have always done it this way". Roediger and Karpicke found that students tested on a passage remembered far more of it a week later than students who reread it, and had confidently predicted the opposite.',
    },

    { kind: 'heading', text: 'The twelve biases below' },
    {
      kind: 'paragraph',
      text: 'Revise first if you want. The second column is the useful one: biases never announce themselves, but the sentence they produce is fairly consistent. The sunk cost fallacy is the obvious absence, and that is on purpose, because [[sunk-cost-fallacy|the sunk cost fallacy has a full guide of its own]].',
    },
    {
      kind: 'table',
      columns: ['Bias', 'What it sounds like from the inside'],
      rows: [
        ['Anchoring', '"1,800 is reasonable, given what the other one cost."'],
        ['Availability heuristic', '"You hear about this constantly at the moment."'],
        ['Confirmation bias', '"Every source I checked said the same thing."'],
        ['Framing effect', '"A 90 percent survival rate. That sounds fine."'],
        ['Endowment effect', '"I would not let it go for that."'],
        ['Status quo bias', '"It works. Switching would be disruptive."'],
        ['Dunning-Kruger effect', '"This is simpler than people make out."'],
        ['Fundamental attribution error', '"He is disorganised. I had a genuine emergency."'],
        ['In-group bias', '"She would fit in well here."'],
        ['Halo and horn effect', '"If he is late for this, imagine the rest."'],
        ['Choice overload', '"I will decide once I have compared a few more."'],
        ['Bias blind spot', '"I am the level-headed one in this room."'],
      ],
    },

    { kind: 'heading', text: 'What your score means, and what it does not' },
    {
      kind: 'paragraph',
      text: 'Scoring well means you can identify a bias in a tidy paragraph written by someone who knew which bias they were writing about. That is a real skill and it is not the same as catching yourself. The gap has a name: Pronin, Lin and Ross called it the **bias blind spot** in 2002, after finding that people rate themselves as less affected than the average person, which cannot be true of everyone at once. West, Meserve and Stanovich then tested whether cognitive ability protects against it. It does not. On several measures the blind spot was slightly larger in people who scored higher on reasoning tests.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Twelve out of twelve does not make you unbiased',
      text: 'Awareness on its own is a weak intervention. What reliably helps is structure imposed before the decision: criteria fixed before you see the options, a stopping rule agreed in advance, a pre-mortem, a checklist, someone whose job is to disagree. Knowing the names is where that starts, not where it ends.',
    },

    {
      kind: 'takeaways',
      items: [
        'Name the bias before you read the options. Recall transfers to real situations, recognition mostly does not.',
        'A high score measures pattern-matching on clean examples. The bias blind spot is strongest in people confident they do not have one.',
        'Awareness is the start. Structure fixed before the decision is what changes outcomes.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec6-u4-L2-Q3',
      scenario:
        'A furniture shop displays a $5,000 sofa next to an $1,800 sofa. Most customers buy the $1,800 one and describe it as reasonable.',
      prompt: 'Which bias is the shop using?',
      options: [
        'Anchoring, with the $5,000 sofa as the reference point',
        'Confirmation bias about what a sofa normally costs',
        'Availability heuristic from recently seen furniture ads',
        'Loss aversion about missing out on the cheaper one',
      ],
      correctIndex: 0,
      explanation:
        'Reasonable compared to what? The $5,000 tag is the only reference point in the room, and it is doing the pricing work. Move it to $2,400 and the same sofa at the same price stops feeling like a bargain. Nothing about the sofa changed.',
    },
    {
      id: 'psy-sec6-u4-L2-Q1',
      scenario:
        'A doctor estimates that a rare disease is fairly common, because she has treated three cases this month. The actual rate is about one in 100,000.',
      prompt: 'Which bias is primarily at work?',
      options: [
        'Availability heuristic',
        'Confirmation bias',
        'Anchoring bias',
        'Status quo bias',
      ],
      correctIndex: 0,
      explanation:
        'Three vivid recent cases come to mind instantly, and ease of recall is quietly standing in for frequency. Notice she is not defending a prior belief, which is what would make this confirmation bias instead. Expertise does not help here: her sample is real, it is just not representative.',
    },
    {
      id: 'psy-sec6-u4-L2-Q2',
      scenario:
        'A political supporter reads ten articles about their candidate. They share the two that are favourable and never mention the eight that are critical.',
      prompt: 'Which bias is this?',
      options: [
        'Confirmation bias',
        'The halo effect',
        'Loss aversion',
        'Anchoring bias',
      ],
      correctIndex: 0,
      explanation:
        'All ten were read, so nothing was filtered on the way in. The filtering happened on the way out. That matters, because it means the person could sincerely tell you they consider both sides, and they would not be lying. Confirmation bias mostly operates after the reading.',
    },
    {
      id: 'psy-sec6-u2-L2-Q5',
      scenario:
        'One outlet runs the headline "Crime drops 20 percent in city". Another covers the same figures as "One in five crimes still unsolved".',
      prompt: 'What is happening here?',
      options: [
        'Positive and negative framing of identical data',
        'One outlet is misreporting the statistics',
        'Anchoring, because both headlines quote a number',
        'The two headlines describe different events',
      ],
      correctIndex: 0,
      explanation:
        'Both are accurate and neither is lying, which is what makes framing so effective. The frame arrives before you start thinking and sets what the number means. The classic demonstration is medical: a treatment described as having 90 percent survival gets chosen far more often than the same treatment described as having 10 percent mortality.',
    },
    {
      id: 'psy-sec6-u2-L3-Q6',
      scenario:
        'Researchers hand out coffee mugs. Owners will not sell for less than about $7. People without a mug will not pay more than about $3 for the same one.',
      prompt: 'What explains the gap?',
      options: [
        'The endowment effect: owning it raises what it seems worth',
        'Anchoring bias: an early price set expectations',
        'Confirmation bias: owners look for reasons to keep it',
        'The framing effect: the mug was described differently',
      ],
      correctIndex: 0,
      explanation:
        'Same mug, same room, same minute, and the price roughly doubles the moment it belongs to you. Loss aversion is the engine: giving up the mug registers as a loss, and losses weigh more than the equivalent gain. The effect shrinks when people trade often, which is a hint it is partly about unfamiliarity with trading.',
    },
    {
      id: 'psy-sec6-u6-L3-Q5',
      scenario:
        'A company runs software that crashes weekly. A newer product is cheaper and more reliable. Management says: "We have always used this system. Switching would be disruptive."',
      prompt: 'Which bias is driving that decision?',
      options: [
        'Status quo bias: the familiar option wins by default',
        'Sunk cost fallacy: they are protecting past spending',
        'Confirmation bias: they only read positive reviews',
        'Availability heuristic: they overestimate the crash rate',
      ],
      correctIndex: 0,
      explanation:
        'No past spending is mentioned, which is exactly what separates this from the sunk cost fallacy. The entire argument is the effort of moving, and effort of moving is what status quo bias is made of. It is also why changing the default option, rather than arguing, tends to be the thing that works.',
    },
    {
      id: 'psy-sec6-u10-L2-Q2',
      scenario:
        'A nurse in her first week says "I think I am really good at this". Her supervisor of twenty years says "the more I learn, the more I realise I do not know".',
      prompt: 'What explains the difference?',
      options: [
        'The nurse is at the Dunning-Kruger peak, the supervisor is calibrated',
        'The nurse is genuinely more capable than her supervisor is',
        'The supervisor is showing imposter syndrome after twenty years',
        'Both are miscalibrated by roughly the same amount',
      ],
      correctIndex: 0,
      explanation:
        'The skill needed to do the job is largely the skill needed to judge how well you are doing it, so lacking one costs you the other. Worth knowing: statisticians have argued that part of the classic Dunning-Kruger graph is what you would get from measurement noise alone. The underlying point about beginners holds up better than the famous chart does.',
    },
    {
      id: 'psy-sec6-u7-L3-Q5',
      scenario:
        'A colleague misses an important deadline. You missed one last month, because of a family emergency.',
      prompt: 'What does the fundamental attribution error predict you will conclude?',
      options: [
        'That your colleague is unreliable, while your own miss was unavoidable',
        'That both misses had understandable causes behind them',
        'That both misses point to the same organisational problem',
        'That your own miss reflects worse on you than theirs does',
      ],
      correctIndex: 0,
      explanation:
        'You can see every circumstance around your own miss and almost none around theirs, so theirs gets explained by character. The asymmetry is largely about what information you have rather than how fair you are, which is why the fix is asking what you cannot see rather than resolving to be nicer.',
    },
    {
      id: 'psy-sec6-u7-L1-Q5',
      scenario:
        'A hiring manager consistently rates candidates from their own university higher, even when other applicants are better qualified.',
      prompt: 'Which bias is at work?',
      options: [
        'In-group bias favouring fellow alumni',
        'The halo effect from an impressive institution',
        'Anchoring bias from the first application read',
        'Confirmation bias about university rankings',
      ],
      correctIndex: 0,
      explanation:
        'The trigger is shared membership, not any quality of the candidate. Tajfel showed favouritism appears even when groups are assigned by coin flip and members never meet, so an alma mater is more than enough. It is hard to argue away as good judgement because it feels, from the inside, like recognising a good fit.',
    },
    {
      id: 'psy-sec6-u7-L2-Q4',
      scenario:
        'A candidate arrives late to an interview. Despite strong qualifications, the interviewer rates them low on competence, reliability and creativity.',
      prompt: 'Which effect is this?',
      options: [
        'The horn effect: one bad impression spread across unrelated traits',
        'The halo effect: a positive impression spread across traits',
        'Anchoring bias: the arrival time set a numerical anchor',
        'Status quo bias: the interviewer prefers the current postholder',
      ],
      correctIndex: 0,
      explanation:
        'Lateness might reasonably touch reliability. It has no bearing whatsoever on creativity, and that is the tell: the impression has leaked into a rating it cannot possibly inform. Structured scoring, one trait at a time against fixed criteria, is the standard defence and it works better than trying to be fair.',
    },
    {
      id: 'psy-sec6-u8-L2-Q3',
      scenario:
        'A restaurant has 150 dishes on the menu. Customers take fifteen minutes to order and often say afterwards that they wish they had picked something else.',
      prompt: 'Which effect explains both the delay and the regret?',
      options: [
        'Choice overload: too many options slow the decision and sour it',
        'Anchoring: the first price on the menu sets expectations',
        'Availability: diners recall dishes they have seen others eating',
        'Status quo bias: diners default to their usual order',
      ],
      correctIndex: 0,
      explanation:
        'More options should mean a better fit. Past a point it reverses, because the search cost climbs and every dish you did not order becomes a reason to suspect you chose wrong. Be careful with this one: a 2010 meta-analysis by Scheibehenne and colleagues found the average effect close to zero, so it is real in some settings rather than a law.',
    },
    {
      id: 'psy-sec6-u1-L4-Q6',
      scenario:
        'A manager says: "My team decides on emotion, but I always think logically." Measured, the manager is exactly as emotional in decisions as the team.',
      prompt: 'What is the manager showing?',
      options: [
        'The bias blind spot',
        'The Dunning-Kruger effect',
        'Confirmation bias',
        'In-group bias',
      ],
      correctIndex: 0,
      explanation:
        'You judge other people on their behaviour, which is visible, and yourself on your intentions, which feel reasonable from the inside. Everyone leaves that comparison looking like the level-headed one. If you got the other eleven and still think this one does not apply to you, that is the finding.',
    },
  ],

  related: [
    {
      slug: 'sunk-cost-fallacy',
      reason:
        'The bias the quiz leaves out, covered in full: what counts as a sunk cost, why quitting feels like losing, and the question that breaks the trap.',
    },
    {
      slug: 'confirmation-bias-examples',
      reason:
        'The bias the quiz returns to most often, in twelve everyday cases, split by which of its three moves is doing the damage.',
    },
  ],

  nextStep: {
    unitTitle: 'Mental Shortcuts',
    text: 'These twelve are drawn from the cognitive biases section of the Psychology and Human Behavior course, which opens here and runs to ten units. It ends on debiasing: pre-mortems, considering the opposite, and the structures that work when awareness alone does not.',
  },
};
