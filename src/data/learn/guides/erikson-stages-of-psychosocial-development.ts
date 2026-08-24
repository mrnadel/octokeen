import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `psy-sec10-u6` ("Erikson's 8 Life Challenges"), lessons L1 to
 * L6, in
 * `src/data/course/professions/psychology/units/section-10-developmental-part1.ts`.
 * Lesson 6 ("Where Erikson Falls Short") supplies the criticism section. Quiz
 * items keep their original ids so the page and the course cannot drift apart.
 */
export const eriksonStagesGuide: LearnGuide = {
  slug: 'erikson-stages-of-psychosocial-development',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: "Erikson's Eight Stages: What the Theory Is Actually For",
  metaTitle: "Erikson's 8 Stages of Psychosocial Development",
  metaDescription:
    "Erikson's eight psychosocial stages explained, with the virtue from each, where the theory holds up empirically, and the parts that do not survive testing.",
  keywords: [
    'erikson stages of development',
    'eriksons 8 stages of psychosocial development',
    'psychosocial development',
    'identity vs role confusion',
    'generativity vs stagnation',
    'erik erikson theory criticism',
  ],
  updated: '2026-08-23',
  answer:
    'Erik Erikson proposed that personality is shaped by **eight psychosocial crises**, one per life phase, running from infancy to old age. Each is a tension between two pulls, and handling one well is said to yield a lasting strength he called a **virtue**. Treat it as a map of the questions that recur across a life rather than a tested developmental timetable, because the eight-step sequence itself has never been strongly supported.',

  body: [
    { kind: 'heading', text: 'The one idea worth keeping' },
    {
      kind: 'paragraph',
      text: 'Before the eight stages, most developmental theory stopped at puberty. Freud, whose circle Erikson trained in, had personality essentially settled by the end of childhood. Piaget mapped thinking up to adolescence and then stopped. Erikson said the interesting part carries on: a person at 55 is still developing, and the thing developing is their relationship to other people.',
    },
    {
      kind: 'paragraph',
      text: 'That claim is now so ordinary it is invisible, which is a sign of how completely it won. Adult development, midlife transitions, ageing as an active psychological process: all of it descends from Erikson. If you take one thing from the theory, take that, not the table.',
    },

    { kind: 'heading', text: 'What "crisis" means here' },
    {
      kind: 'paragraph',
      text: 'The word is badly translated and causes most of the misreadings. Erikson meant crisis in the medical sense of a turning point, the moment a fever breaks one way or the other. Not an emergency, not a breakdown, and not something that happens on a particular Tuesday. A stage is a period during which one question becomes loud.',
    },
    {
      kind: 'paragraph',
      text: 'Two more corrections follow from that. First, the outcome is never all of one pole. Some mistrust is useful; an infant who trusted everything would be in danger. Erikson wanted a favourable ratio, not a clean win. Second, a resolved stage does not stay resolved. Someone who built solid trust at two can have it demolished at 40 by a betrayal, and then has to rebuild it as an adult.',
    },

    { kind: 'heading', text: 'The eight stages' },
    {
      kind: 'table',
      caption: 'Erikson\'s psychosocial stages, the question each poses, and the strength it yields',
      columns: ['Stage', 'Rough age', 'The live question', 'Virtue'],
      rows: [
        [
          'Trust vs mistrust',
          'Birth to 18 months',
          'Is the world reliable? Does anyone come when I need something?',
          'Hope',
        ],
        [
          'Autonomy vs shame and doubt',
          '18 months to 3 years',
          'Can I act on my own without being humiliated for it?',
          'Will',
        ],
        [
          'Initiative vs guilt',
          '3 to 5 years',
          'Can I start things, plan them, and make them happen?',
          'Purpose',
        ],
        [
          'Industry vs inferiority',
          '6 to 12 years',
          'Am I competent at what the people around me value?',
          'Competence',
        ],
        [
          'Identity vs role confusion',
          '12 to 18 years',
          'Who am I, and does that hold together across the places I go?',
          'Fidelity',
        ],
        [
          'Intimacy vs isolation',
          '18 to 40 years',
          'Can I let someone close without disappearing into them?',
          'Love',
        ],
        [
          'Generativity vs stagnation',
          '40 to 65 years',
          'Am I making anything that outlasts me?',
          'Care',
        ],
        [
          'Integrity vs despair',
          '65 and older',
          'Looking back, was this a life I can accept as mine?',
          'Wisdom',
        ],
      ],
    },

    {
      kind: 'paragraph',
      text: 'Erikson claimed a fixed order, and he had a reason for it rather than a whim. He borrowed the **epigenetic principle** from embryology, where organs develop on a schedule and each one has a window in which it must form. Applied to personality, the claim is that each crisis becomes central when the person is developmentally ready for it and when the surrounding society starts demanding it. A four-year-old is not asked who they are; a sixteen-year-old is asked constantly. The ordering is a claim about what life puts in front of you and when, which is also why it dates so quickly.',
    },

    { kind: 'heading', text: 'The three adult stages, where the theory earns its keep' },
    {
      kind: 'paragraph',
      text: 'The childhood stages overlap heavily with attachment theory and with Piaget, and Erikson adds less there than the summaries suggest. Stages six, seven and eight are the original contribution, and they are the ones almost every competing account still borrows from.',
    },
    {
      kind: 'paragraph',
      text: '**Intimacy versus isolation** makes a specific and testable claim: you cannot merge with someone until there is a you to merge. Erikson thought people with an unsettled identity either avoid closeness or dissolve into a partner, adopting their politics, their friends and their weekends. The interesting half is the second failure mode, because it looks like intimacy from the outside and is the harder one to name.',
    },
    {
      kind: 'paragraph',
      text: '**Generativity versus stagnation** is the least understood stage and the most useful. Erikson\'s test is not whether you have dependents. It is whether anything you do has a beneficiary who is not you. A researcher who trains no one and a parent who treats a child as an extension of themselves can both be stagnating in his terms, while someone maintaining an obscure open-source library at midnight is squarely generative.',
    },
    {
      kind: 'paragraph',
      text: '**Integrity versus despair** was, when Erikson wrote it, close to the only serious psychological account of old age that was not about decline. He treated the review of a life as work, with a difficult outcome that has to be earned. Despair in his sense is not sadness; it is the sense that there is no longer time to become a different person, combined with an inability to accept the person you were.',
    },

    { kind: 'heading', text: 'What the stages look like off the page' },
    {
      kind: 'paragraph',
      text: 'Textbook examples tend to be so generic that the stages become interchangeable. Concrete ones separate them.',
    },
    {
      kind: 'list',
      items: [
        '**Industry, age 10.** A boy quits the football team. He does not dislike football. He is the slowest in his year and has worked out that turning up is a weekly public ranking he loses. Industry versus inferiority is not about ability; it is about whether effort still feels worth spending in front of an audience.',
        '**Identity, age 17.** A student commits to medicine because both parents are doctors and the question has never been opened. Erikson would say the commitment is real but untested. James Marcia later gave this a name: **foreclosure**, a commitment made without exploration.',
        '**Intimacy, age 29.** Someone with a wide, warm circle of friends who ends every romantic relationship at around the six-month mark, always for a defensible reason. Isolation in Erikson\'s sense is not loneliness. It is the pattern of keeping the door on the latch.',
        '**Generativity, age 52.** A warehouse supervisor who has no children, does not want any, and has trained eleven apprentices, four of whom now run their own shifts. Generativity is routinely misread as parenthood. Erikson meant anything that invests in people or work that continues after you.',
        '**Integrity, age 78.** A woman who regrets a career she never pursued, says so plainly, and is not tormented by it. Integrity is not the absence of regret. It is being able to hold the regret and still call the life hers.',
      ],
    },

    { kind: 'heading', text: 'The part of the theory that got tested' },
    {
      kind: 'paragraph',
      text: 'Most of Erikson\'s framework is descriptive, which is a polite way of saying it resists measurement. Two pieces of it were turned into instruments, and those are where the real evidence sits.',
    },
    {
      kind: 'paragraph',
      text: '**Marcia\'s identity statuses.** In the 1960s James Marcia took the identity stage and split it along two axes: has the person explored alternatives, and have they committed? That yields four statuses. **Achievement** means explored and committed. **Moratorium** means exploring, not yet committed. **Foreclosure** means committed without exploring. **Diffusion** means neither. Unlike the stages, these are codeable from an interview, and they have carried decades of research.',
    },
    {
      kind: 'paragraph',
      text: 'What that research found is not quite what Erikson predicted. Movement between statuses is common but far from one-directional; people slide back into exploration as often as they settle. Plenty of adults never reach achievement on some domains at all. The statuses turned out to be better as a description of where someone currently stands than as rungs on a ladder.',
    },
    {
      kind: 'paragraph',
      text: '**Generativity.** In the early 1990s Dan McAdams and Ed de St. Aubin built a scale for it, which finally made the seventh stage something you could correlate with other things. Generativity scores track fairly consistently with wellbeing, life satisfaction and social involvement in midlife. What the data does not show is that generativity switches on at 40 and off at 65. It varies across people far more than it varies across ages.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The pattern in both cases',
      text: 'Where a stage was operationalised, the content survived and the timetable did not. The questions Erikson identified are real and recurring. The claim that they arrive in a fixed order at fixed ages is the part that keeps failing.',
    },

    { kind: 'heading', text: 'Where the theory is weak' },
    {
      kind: 'paragraph',
      text: 'Saying this plainly is not an attack on Erikson. It is the difference between using the model and believing it.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'It is hard to falsify',
          text: 'There is no agreed measure of having resolved generativity versus stagnation. A theory whose central events cannot be scored cannot be strongly confirmed or disconfirmed, which is why it has survived so long without ever being verified.',
        },
        {
          title: 'The evidence base was clinical and biographical',
          text: 'Erikson built the model from psychoanalytic case work, fieldwork with Sioux and Yurok communities, and long psychobiographies of Martin Luther and Gandhi. That is a rich source of hypotheses and a poor source of proof. There was no cohort followed from birth to 80 behind the eight stages.',
        },
        {
          title: 'The age ranges assume a life course that has changed',
          text: 'Identity settled by 18, intimacy in the twenties, generativity from 40. Jeffrey Arnett\'s work on emerging adulthood describes a stretch from about 18 to 29 in which identity exploration is still the main business, sitting directly across the boundary Erikson drew. Late parenthood, career changes at 45 and returning to study at 50 all break the schedule.',
        },
        {
          title: 'Identity before intimacy is a gendered assumption',
          text: 'Erikson had identity settle first and intimacy follow, a sequence drawn largely from male lives of his era. Carol Gilligan argued that for many women the two develop together, identity forming through relationships rather than before them. The critique is itself debated, but the underlying point stands: the ordering was assumed, not demonstrated.',
        },
        {
          title: 'The cultural frame is Western and individualist',
          text: 'Marcia\'s foreclosure carries a built-in judgement that adopting your family\'s values without questioning them is a lesser outcome. In cultures where identity is properly defined by role and obligation, that is not a developmental shortfall. It is the intended result.',
        },
        {
          title: 'Real lives run several stages at once',
          text: 'Someone who emigrates at 30 rebuilds identity, relationships and working life simultaneously. Nothing in the model handles the ordinary case of three stages being live in the same year.',
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'A common exam trap',
      text: 'Erikson did not claim that failing an early stage locks you out of later ones. He held that earlier conflicts can be reopened and reworked at any age, which is a large part of what psychotherapy does. The rigid reading is a textbook simplification, not his position.',
    },

    { kind: 'heading', text: 'What to take from it' },
    {
      kind: 'paragraph',
      text: 'Read as biology, the theory is a stage model with thin support. Read as a set of questions, it is durable and unusually useful, because each stage names a tension people genuinely report and gives it a vocabulary.',
    },
    {
      kind: 'paragraph',
      text: 'Three ideas are worth carrying regardless of what you make of the sequence. Development does not end at 18. Conflicts recur rather than closing permanently. And the strengths in the right-hand column of the table, hope, will, purpose, competence, fidelity, love, care and wisdom, are described as things a person builds by resolving something difficult, not as traits you either have or lack. That last framing has probably influenced more therapists than any stage boundary Erikson drew.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Using the model without believing the timetable',
      text: 'Drop the ages and keep the questions. Ask which of the eight is currently loud for the person in front of you, allow that two or three can be loud at once, and treat the answer as a description of now rather than a diagnosis of a stage they are stuck in.',
    },

    {
      kind: 'takeaways',
      items: [
        'Erikson proposed eight psychosocial crises across the whole lifespan, each yielding a virtue when handled well.',
        'Crisis means turning point, not emergency, and the goal is a favourable balance rather than a clean win over the negative pole.',
        'Marcia\'s identity statuses and the generativity scale are the parts that were operationalised, and both support the content while undermining the fixed timetable.',
        'The main weaknesses are testability, a clinical and biographical evidence base, Western and gendered assumptions, and age ranges that no longer match how people live.',
        'The lasting contribution is the claim that personality keeps developing into old age, which was not the consensus when Erikson made it.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec10-u6-L2-Q2',
      prompt: 'Which virtue emerges from resolving the trust versus mistrust crisis?',
      options: ['Purpose', 'Will', 'Hope', 'Competence'],
      correctIndex: 2,
      explanation:
        'Hope is the virtue of stage 1: the working assumption that needs will be met and that the world is broadly reliable.',
    },
    {
      id: 'psy-sec10-u6-L3-Q4',
      scenario:
        'A 17-year-old has decided to become a doctor because their parents are doctors. They have never considered another path or questioned this one.',
      prompt: 'Which of Marcia\'s identity statuses does this describe?',
      options: [
        'Identity achievement, meaning explored and then committed',
        'Foreclosure, meaning committed without exploring alternatives',
        'Moratorium, meaning actively exploring but not yet committed',
        'Identity diffusion, meaning neither exploring nor committed',
      ],
      correctIndex: 1,
      explanation:
        'The commitment is genuine but untested. Marcia called this foreclosure, and it is the status most often mislabelled as healthy resolution.',
    },
    {
      id: 'psy-sec10-u6-L4-Q2',
      prompt: 'What is the core challenge of stage 6, intimacy versus isolation?',
      options: [
        'Forming deep, committed relationships rather than staying closed off',
        'Choosing a career rather than drifting without direction',
        'Raising children rather than remaining childless by choice',
        'Achieving financial independence rather than relying on others',
      ],
      correctIndex: 0,
      explanation:
        'The stage is about the capacity for close mutual bonds, not about hitting particular life milestones. A married person can be isolated in Erikson\'s sense.',
    },
    {
      id: 'psy-sec10-u6-L5-Q5',
      prompt:
        'A 52-year-old questioning whether their work has meant anything is revisiting which crisis?',
      options: [
        'Trust versus mistrust, reopened by disappointment',
        'Industry versus inferiority, carried over from childhood',
        'Intimacy versus isolation, triggered by relationship change',
        'Generativity versus stagnation, the central midlife question',
      ],
      correctIndex: 3,
      explanation:
        'Generativity asks whether you are producing anything that outlasts you. A midlife reckoning is usually that question arriving with force, sometimes alongside a reopened identity question.',
    },
    {
      id: 'psy-sec10-u6-L6-Q3',
      prompt: 'What is the main feminist criticism of Erikson\'s identity stage?',
      options: [
        'He claimed that women complete identity formation earlier than men do',
        'He modelled identity on male careers, with intimacy following after',
        'He excluded adult development from his account of women entirely',
        'He argued that identity is fixed by adolescence and never revisited',
      ],
      correctIndex: 1,
      explanation:
        'Carol Gilligan argued that identity and intimacy often develop together rather than in sequence, and that Erikson\'s ordering reflected the male lives he studied.',
    },
  ],

  related: [
    {
      slug: 'left-brain-right-brain-myth',
      reason:
        'A worked case of how a genuine finding turns into folklore, why the split-brain research never said what the personality quizzes claim, and how to answer it.',
    },
  ],

  nextStep: {
    unitTitle: "Erikson's 8 Life Challenges",
    text: 'The Psychology and Human Behavior course covers this in six lessons, including Marcia\'s four identity statuses in detail, how the stages sit alongside Piaget, Vygotsky and attachment theory, and a full lesson on where the model breaks down.',
  },
};
