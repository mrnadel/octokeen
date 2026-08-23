import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `psy-sec1-u6` ("Left Brain, Right Brain: Myth vs Reality"),
 * lessons L1 to L5, in
 * `src/data/course/professions/psychology/units/section-1-mind-part2.ts`, plus
 * the lateralization lesson in `psy-sec16-u1` (section 16, neuroscience part 1).
 * Quiz items keep their original ids so the page and the course cannot drift.
 */
export const leftBrainRightBrainMythGuide: LearnGuide = {
  slug: 'left-brain-right-brain-myth',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Left Brain, Right Brain: What the Myth Gets Wrong',
  metaTitle: 'Left Brain, Right Brain: Myth vs Reality',
  metaDescription:
    'The left-brained and right-brained personality split is a myth. What brain imaging really found, what is genuinely lateralised, and why it will not die.',
  keywords: [
    'left brain right brain',
    'left brain right brain myth',
    'is the left brain right brain theory true',
    'brain lateralization',
    'hemispheric specialisation',
    'split brain experiments',
  ],
  updated: '2026-08-23',
  answer:
    'There is no such thing as a **left-brained** or **right-brained** person. A 2013 study that scanned 1,011 people found lateralised brain networks but no individuals whose left or right hemisphere was globally stronger. What is true, and what the myth is built on top of, is **lateralisation**: some functions do lean to one side, language most obviously. Leaning is not owning, and a network preference is not a personality type.',

  body: [
    { kind: 'heading', text: 'The claim, stated plainly' },
    {
      kind: 'paragraph',
      text: 'The popular version goes like this. People come in two wirings. Left-brained people are logical, analytical, verbal and good with numbers. Right-brained people are creative, intuitive, visual and emotional. Your dominant hemisphere explains why you became an accountant rather than a painter, why you cannot draw, or why algebra never made sense.',
    },
    {
      kind: 'paragraph',
      text: 'Every part of that is wrong, and it is wrong in an unusual way. It was not invented from nothing. It is a real finding from real Nobel-winning research, stretched about ten times past what the research showed, and then sold as a personality test.',
    },

    { kind: 'heading', text: 'Why it is so appealing' },
    {
      kind: 'paragraph',
      text: 'Three things keep this myth alive when other pop-science claims quietly die.',
    },
    {
      kind: 'list',
      items: [
        '**It has a true story underneath it.** Hemispheric specialisation is genuine, well documented and taught in every neuroscience course. A myth anchored to a fact is far harder to dislodge than a myth anchored to nothing.',
        '**It explains a failure without blaming you.** "I am bad at maths because I am right-brained" converts an effort problem into a hardware problem. That is a comfortable trade, and it is exactly what makes the belief expensive.',
        '**It sorts people into two types.** People will take almost any two-box sorting system and run with it. The hemispheres offered a version that sounded anatomical, which made it feel like science rather than horoscope.',
      ],
    },

    { kind: 'heading', text: 'Where it came from: the split-brain studies' },
    {
      kind: 'paragraph',
      text: 'In the 1960s, Roger Sperry and Michael Gazzaniga studied a small group of patients whose **corpus callosum**, the thick band of roughly 200 million fibres joining the hemispheres, had been surgically cut to stop severe epileptic seizures spreading from one side to the other. Fewer than two dozen such patients have ever been studied in depth. Sperry shared the 1981 Nobel Prize for the work.',
    },
    {
      kind: 'paragraph',
      text: 'The experiments exploited the wiring of vision. Flash an image into the left visual field and it arrives in the right hemisphere. In an intact brain it crosses to the left hemisphere in milliseconds. In these patients it could not cross at all. Asked what they had seen, the patients said nothing, because speech is generated on the left and the left hemisphere genuinely had no information. Asked to reach under a screen with the left hand, which the right hemisphere controls, they picked out the correct object.',
    },
    {
      kind: 'paragraph',
      text: 'The most quoted result is stranger still. Gazzaniga showed one patient a chicken claw on the right and a snow scene on the left, then asked him to point at matching pictures. His right hand chose a chicken, his left hand chose a shovel. Asked why, he said he had picked the shovel to clean out the chicken shed. The speaking left hemisphere had no idea why the left hand had moved, so it invented a reason and believed it. Gazzaniga called this the **interpreter**, and it is a far more interesting finding than anything the myth took from this work.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'What the surgery actually demonstrated',
      text: 'Split-brain results show what happens when the bridge is cut. They say almost nothing about intact brains, where the bridge is not cut. Extending them to healthy people is the single mistake the whole myth rests on.',
    },
    {
      kind: 'paragraph',
      text: 'The pop-science leap happened fast. By 1979 Betty Edwards had published **Drawing on the Right Side of the Brain**, and through the 1980s a training industry grew up promising to unlock the neglected creative hemisphere. The teaching materials kept the two-boxes idea and dropped the detail that the original patients had undergone brain surgery.',
    },

    { kind: 'heading', text: 'What brain imaging actually found' },
    {
      kind: 'paragraph',
      text: 'The direct test came in 2013, when a team at the University of Utah analysed resting-state fMRI from 1,011 people aged 7 to 29 and measured how strongly each of thousands of brain regions connected to the left or the right side. The prediction from the myth is clear and testable: some people should show globally stronger left-side networks, others globally stronger right-side networks.',
    },
    {
      kind: 'paragraph',
      text: 'That is not what turned up. Individual regions were strongly lateralised, exactly as expected. Language hubs leaned left. Attention hubs leaned right. But when the researchers looked for people whose whole brain leaned one way, they found no such people. Lateralisation was a property of particular networks, not of individuals, and it did not sort the sample into two types.',
    },
    {
      kind: 'paragraph',
      text: 'This is why "both hemispheres are always active" is a slightly lazy rebuttal, even though it is true. The stronger point is the one the data makes: the axis the myth wants to measure does not vary between people in the way the myth requires.',
    },

    { kind: 'heading', text: 'What really is lateralised' },
    {
      kind: 'paragraph',
      text: 'Overcorrecting into "the hemispheres are identical" swaps one wrong answer for another. Real asymmetries exist, they are clinically important, and several of them show up in patients every week.',
    },
    {
      kind: 'table',
      caption: 'Genuine hemispheric asymmetries, and the limits of each',
      columns: ['Function', 'Which side leans', 'What that actually means'],
      rows: [
        [
          'Speech production and grammar',
          'Left, in most people',
          'Left-lateralised in around 95% of strong right-handers. Among strong left-handers the figure falls sharply, with roughly a quarter showing right-hemisphere or mixed dominance.',
        ],
        [
          'Tone, rhythm and sarcasm',
          'Right',
          'Right-hemisphere stroke patients can read a paragraph aloud fluently and still miss that the speaker was joking. Language is not a left-hemisphere function. The mechanics of it are.',
        ],
        [
          'Spatial attention',
          'Right',
          'Damage to the right parietal lobe can produce left neglect: the patient shaves one side of their face, eats the right half of the plate, and does not notice. The mirror-image syndrome after left-hemisphere damage is rarer and milder.',
        ],
        [
          'Face recognition',
          'Right',
          'The fusiform face area is larger and more responsive on the right, but recognising a face still recruits both sides.',
        ],
        [
          'Fine motor control',
          'Contralateral',
          'Each hemisphere drives the opposite hand. This is the least controversial asymmetry and the one people most often forget.',
        ],
        [
          'Logic, creativity, maths, memory, personality',
          'Neither',
          'These are not single functions and they have no hemisphere. Mental arithmetic, for instance, recruits parietal regions on both sides at once.',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'Notice the shape of the real picture. What lateralises are narrow, specific operations: producing a word, tracking where things are in space, reading a tone of voice. What the myth assigns to hemispheres are broad cultural categories: creativity, logic, being a numbers person. Those categories are not brain functions at all, which is why no scan will ever find one of them sitting on a single side.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The correction in one line',
      text: 'Specialisation is real. Domination is not. A hemisphere can do more of a job without being the only one doing it, and no job the myth cares about belongs to one side.',
    },

    { kind: 'heading', text: 'Why the myth is worth correcting' },
    {
      kind: 'paragraph',
      text: 'It would be harmless folklore except that it reaches classrooms. Surveys of teachers in the Netherlands and the United Kingdom have found roughly nine in ten agreeing that differences in hemispheric dominance help explain differences between learners. It travels alongside learning styles, and it does the same damage: it tells someone a skill is closed to them before they have practised it.',
    },
    {
      kind: 'paragraph',
      text: 'The failure mode is specific. A learner who believes they are right-brained stops attempting the thing they are bad at, which guarantees they stay bad at it, which confirms the belief. The myth is not merely false. It is self-fulfilling, and it costs most in exactly the cases where practice would have worked.',
    },

    { kind: 'heading', text: 'How to answer the claim when you hear it' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Concede the real part',
          text: 'Yes, the hemispheres differ. Speech production leans left, spatial attention leans right. Denying that outright loses the argument, because the person has heard it is true and it is.',
        },
        {
          title: 'Name where the evidence came from',
          text: 'It came from patients whose hemispheres were surgically disconnected. Everyone else has an intact corpus callosum shuttling information across constantly.',
        },
        {
          title: 'Give the imaging result',
          text: 'Scanning a thousand brains found lateralised networks and no lateralised people. There is no group whose whole brain leans one way.',
        },
        {
          title: 'Point out that the categories are wrong',
          text: 'Creativity and logic are not single operations. Composing a photograph, writing a chorus and debugging code all recruit both sides, and asking which hemisphere does creativity is like asking which hemisphere does Tuesday.',
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'A useful test for any brain-type quiz',
      text: 'Ask what measurement the result is based on. If the answer is ten questions about your hobbies and preferences rather than a scan of your brain, the quiz is measuring your hobbies and preferences.',
    },

    { kind: 'heading', text: 'One honest complication' },
    {
      kind: 'paragraph',
      text: 'The split-brain story itself is less settled than textbooks suggest. A 2017 study of two of the surviving patients reported that they could respond accurately to stimuli anywhere in the visual field using either hand, which sits awkwardly with the classic account of two separate conscious agents sharing a skull. It is two patients, it is contested, and it does nothing to rescue the myth. It is worth knowing because it shows the honest position: even the founding evidence is still being argued over, while the pop version stopped updating in 1979.',
    },

    {
      kind: 'takeaways',
      items: [
        'No one is left-brained or right-brained. Imaging of over a thousand people found lateralised networks and no lateralised individuals.',
        'The myth is a stretched reading of split-brain surgery, which shows what happens when the hemispheres are disconnected, not how intact brains work.',
        'Real asymmetries exist: speech production leans left, spatial attention and tone lean right, and each hemisphere drives the opposite hand.',
        'Creativity, logic and being a maths person are cultural categories rather than brain functions, so they cannot sit in one hemisphere.',
        'The cost of the myth is self-limitation. Believing a skill is closed to you by wiring is the most reliable way never to acquire it.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec1-u6-L3-Q2',
      prompt: 'What did large-scale brain imaging research find about hemisphere dominance?',
      options: [
        'People do not preferentially use one hemisphere over the other',
        'Around 65% of people turned out to be left-brain dominant',
        'Creative people showed clearly stronger right-hemisphere networks',
        'Analytical people showed clearly stronger left-hemisphere networks',
      ],
      correctIndex: 0,
      explanation:
        'Scanning 1,011 people turned up plenty of lateralised networks and no lateralised individuals. The axis the myth wants to measure does not vary between people.',
    },
    {
      id: 'psy-sec1-u6-L2-Q3',
      scenario:
        'A split-brain patient is shown an object in the left visual field only, so the image reaches the right hemisphere.',
      prompt: 'Why can the patient not say what the object is?',
      options: [
        'The right hemisphere cannot process visual information at all',
        'The right hemisphere saw it but cannot reach the language areas on the left',
        'The patient was not paying close enough attention to the screen',
        'Anything shown to only one visual field is never consciously perceived',
      ],
      correctIndex: 1,
      explanation:
        'The image arrived, but with the corpus callosum cut it could not travel to the speech areas on the left. The same patient can pick the object up with the left hand.',
    },
    {
      id: 'psy-sec16-u1-L4-Q4',
      prompt: 'Which statement about lateralisation is most accurate?',
      options: [
        'The left hemisphere does all logical thinking',
        'Some functions show hemisphere preferences, but both sides contribute',
        'The right hemisphere is completely devoted to creativity',
        'Lateralisation means each hemisphere works independently',
      ],
      correctIndex: 1,
      explanation:
        'Lateralisation is real but narrow. It applies to specific operations such as producing speech, not to broad categories such as logic or creativity.',
    },
    {
      id: 'psy-sec1-u6-L4-Q4',
      prompt:
        'A patient with right-hemisphere damage reads text fluently but no longer detects sarcasm. Why?',
      options: [
        'Reading uses the left hemisphere, while hearing tone relies on the right',
        'Sarcasm is a social convention and has no basis in the brain at all',
        'The damage has destroyed the ability to understand any language',
        'Reading and tone are both handled by the left hemisphere equally',
      ],
      correctIndex: 0,
      explanation:
        'The mechanics of language lean left. The music of it, meaning tone, rhythm and emotional colouring, leans right. Losing one leaves the other intact.',
    },
    {
      id: 'psy-sec1-u6-L5-Q6',
      scenario:
        'An online quiz claims to determine whether you are left-brained or right-brained from 10 questions about your hobbies and preferences.',
      prompt: 'What is the best evaluation of this test?',
      options: [
        'It is probably accurate, since brain-type theory came from Nobel-winning work',
        'It might reveal something useful about which hemisphere you rely on',
        'It has no scientific basis, because brain dominance types do not exist',
        'It is valid for right-handed people but unreliable for left-handers',
      ],
      correctIndex: 2,
      explanation:
        'There is nothing for it to measure. It is a preferences questionnaire, and its output describes your preferences rather than your brain.',
    },
  ],

  nextStep: {
    unitTitle: 'Left Brain, Right Brain: Myth vs Reality',
    text: 'The Psychology and Human Behavior course covers this in five lessons, walking through the split-brain demonstrations step by step, the way language divides between mechanics and tone, and how handedness changes the picture.',
  },
};
