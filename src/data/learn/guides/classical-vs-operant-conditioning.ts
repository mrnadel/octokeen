import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: section 3 ("Learning") of the psychology course, in
 * `src/data/course/professions/psychology/units/section-3-learning-part1.ts`
 * and `-part2.ts`. Specifically `psy-sec3-u1` (Pavlov's Dogs), `psy-sec3-u2`
 * (Skinner's Box and Learning by Consequences), `psy-sec3-u4` (Learning
 * Foundations Review) and `psy-sec3-u9` (Learning: Full Section Review).
 * The quiz items keep their original course ids so the page and the course
 * cannot drift apart.
 */
export const classicalVsOperantConditioningGuide: LearnGuide = {
  slug: 'classical-vs-operant-conditioning',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Classical vs Operant Conditioning: How to Tell Them Apart',
  metaTitle: 'Classical vs Operant Conditioning Explained',
  metaDescription:
    'Classical conditioning links two stimuli. Operant conditioning links behaviour to its consequences. The difference, a table, and worked examples.',
  keywords: [
    'classical vs operant conditioning',
    'classical conditioning',
    'operant conditioning',
    'difference between classical and operant conditioning',
    'pavlov',
    'skinner',
    'reinforcement and punishment',
  ],
  updated: '2026-08-23',
  answer:
    '**Classical conditioning** teaches you that one thing predicts another, and the response it produces is automatic: Pavlov paired a sound with food until the sound alone made his dogs salivate. **Operant conditioning** teaches you that your own behaviour changes what happens next, and the behaviour it produces is voluntary: Skinner rewarded a rat for pressing a lever until the rat kept pressing. The fastest way to tell them apart is timing. In classical conditioning the important event arrives before you act, and it arrives whether you act or not. In operant conditioning it arrives afterwards, because of what you did.',

  body: [
    { kind: 'heading', text: 'Both are associative learning, which is the part people skip' },
    {
      kind: 'paragraph',
      text: 'Learning, in psychology, means a relatively lasting change in behaviour that comes from experience. Reflexes do not count, and neither does growing up or being tired. Classical and operant conditioning are the two great forms of **associative** learning, and they differ in exactly one respect. Classical conditioning associates one **stimulus** with another stimulus. Operant conditioning associates a **behaviour** with a consequence. Everything below follows from that sentence.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The before-or-after test',
      text: 'Ask when the important event happens. Before the behaviour, and independent of it, means classical. After the behaviour, and caused by it, means operant.',
    },

    { kind: 'heading', text: 'Classical conditioning, and what Pavlov actually did' },
    {
      kind: 'paragraph',
      text: 'Ivan Pavlov was a Russian physiologist who won a Nobel Prize in 1904 for work on digestion, not on learning. He was measuring how much saliva dogs produced in response to food when the dogs started salivating before any food arrived, at the sight of the assistant who fed them. He treated these anticipatory secretions as a nuisance first and a research programme second.',
    },
    {
      kind: 'paragraph',
      text: 'Two details rarely survive into the textbook cartoon. Pavlov rarely used a bell: his laboratory ran metronomes, buzzers, tones and lights, chosen because they could be started and stopped precisely. And the salivation was not judged by eye. A minor operation routed one salivary duct out through the dog cheek so the drops could be counted, which is what made the results quantitative rather than anecdotal.',
    },
    {
      kind: 'paragraph',
      text: 'The vocabulary is four terms in two pairs. The **unconditioned stimulus** (US) already triggers a reaction with no learning required: food. The **unconditioned response** (UR) is that natural reaction: salivating at food. The **conditioned stimulus** (CS) is the originally neutral thing that has been paired with the US often enough to work alone: the metronome. The **conditioned response** (CR) is the learned reaction it now produces: salivating at the metronome.',
    },
    {
      kind: 'table',
      caption: 'The same experiment in three phases',
      columns: ['Phase', 'What is presented', 'What the dog does'],
      rows: [
        ['Before conditioning', 'Metronome alone (neutral stimulus)', 'Nothing useful. It pricks up its ears.'],
        ['Before conditioning', 'Food (US)', 'Salivates (UR), with no learning involved.'],
        ['During conditioning', 'Metronome, then food, repeatedly', 'Salivates to the food while the pairing is learned.'],
        ['After conditioning', 'Metronome alone (CS)', 'Salivates (CR). The sound now does the work.'],
      ],
    },
    {
      kind: 'paragraph',
      text: 'The UR and the CR are the same behaviour. Salivation is salivation. What changed is the trigger, and the trigger is the whole of what was learned. The response never tells you which term you are looking at. The stimulus does.',
    },
    {
      kind: 'paragraph',
      text: 'Present the CS often enough without the US and the CR fades. That is **extinction**. Leave a gap, present the CS again, and it frequently comes back on its own, weaker than before: **spontaneous recovery**. The association was suppressed rather than deleted. That is why exposure therapy for a phobia often goes well for a month and then has a bad week, and why a good therapist warns the client about it in advance.',
    },
    {
      kind: 'paragraph',
      text: '**Generalisation** is when stimuli resembling the CS trigger the response too, so somebody bitten by one black dog becomes wary of dogs in general. **Discrimination** is the opposite: responding to one specific stimulus and not to its neighbours. Generalisation gets you out of the way of a threat you have not personally met. Discrimination stops you flinching at everything.',
    },
    {
      kind: 'paragraph',
      text: 'The famous demonstration that human fear can be conditioned is Watson and Rayner\'s 1920 study of an infant they called Albert B, made afraid of a white rat by a steel bar struck behind his head. Treat it carefully. One participant, no control condition, fear rated by the two experimenters who wanted the effect, conditioning topped up between sessions, and no deconditioning at the end despite a claim to the contrary that keeps circulating. It is the origin of a research programme, not evidence on its own.',
    },

    { kind: 'heading', text: 'Operant conditioning: Thorndike, Skinner, and consequences' },
    {
      kind: 'paragraph',
      text: 'Edward Thorndike got there before Skinner. In the 1890s he put cats in puzzle boxes they could escape by pulling a loop, and timed them. The escape times fell gradually, in a smooth curve rather than a sudden drop, which told him the cats were not working the problem out. They were doing many things, and whichever thing opened the door got stronger. He called it the **law of effect**.',
    },
    {
      kind: 'paragraph',
      text: 'B. F. Skinner turned that into a measurement system. His operant chamber, which his students named the Skinner box and which he disliked calling that, let an animal press a lever for food while a recorder drew a continuous line of every response. And no, he did not raise his daughter in one. The air crib was a heated, filtered cot for a baby in a cold house.',
    },
    {
      kind: 'paragraph',
      text: 'The core of operant conditioning is two words used in a way that trips almost everybody. **Reinforcement** means the behaviour goes up. **Punishment** means it goes down. **Positive** means something was added. **Negative** means something was taken away. Neither word says anything about whether the consequence feels nice.',
    },
    {
      kind: 'table',
      caption: 'The four consequences, and what each does to the behaviour',
      columns: ['', 'Add something (positive)', 'Remove something (negative)'],
      rows: [
        [
          'Behaviour increases (reinforcement)',
          'Positive reinforcement: your manager thanks you publicly for a clear report, so you write the next one the same way.',
          'Negative reinforcement: buckling the seatbelt stops the chime, so you buckle up sooner every trip.',
        ],
        [
          'Behaviour decreases (punishment)',
          'Positive punishment: a speeding ticket arrives, so you take that stretch of road slower.',
          'Negative punishment: a teenager loses car privileges for a week, so breaking curfew becomes rarer.',
        ],
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Negative reinforcement is not punishment',
      text: 'This is the most common error in the whole topic. Negative reinforcement removes something unpleasant and the behaviour goes **up**. Taking aspirin because it ends a headache is negative reinforcement, and you reach for it faster next time. If the behaviour went down, it was punishment.',
    },
    {
      kind: 'paragraph',
      text: 'Operant conditioning also explains where new behaviour comes from, which classical conditioning cannot. **Shaping** reinforces successive approximations: you reward each step closer to the target rather than waiting for the finished behaviour to appear by luck. It is how a child gets from babbling to words, as the standard for adult attention quietly rises. It also raises a question classical conditioning never has to answer, namely how often the consequence should arrive, and [[schedules-of-reinforcement|the four schedules of reinforcement]] are the answer to it.',
    },
    {
      kind: 'paragraph',
      text: 'One caution the behaviourists learned the hard way: punishment suppresses a behaviour without teaching a replacement, and it produces avoidance of the punisher rather than of the act. Punish and do nothing else, and you get a learner who is careful in front of you.',
    },

    { kind: 'heading', text: 'The comparison, side by side' },
    {
      kind: 'table',
      caption: 'Classical against operant on the dimensions exams actually test',
      columns: ['Dimension', 'Classical conditioning', 'Operant conditioning'],
      rows: [
        ['What gets associated', 'One stimulus with another stimulus', 'A behaviour with its consequence'],
        ['Timing of the key event', 'Before the response', 'After the response'],
        ['Does it depend on the learner?', 'No. The US arrives either way.', 'Yes. No behaviour, no consequence.'],
        [
          'Type of behaviour',
          'Automatic and reflexive: salivating, flinching, nausea, arousal',
          'Voluntary and emitted: pressing, asking, studying, avoiding',
        ],
        ['Role of the learner', 'Largely passive. The pairing is done to them.', 'Active. They operate on the environment.'],
        ['Key names', 'Pavlov, Watson, Rescorla', 'Thorndike, Skinner'],
        ['How it is weakened', 'Present the CS without the US', 'Stop delivering the consequence'],
        ['Everyday example', 'A hospital corridor smell that makes you tense', 'Booking the appointment early so the dread ends sooner'],
      ],
    },

    { kind: 'heading', text: 'Three questions that settle almost any exam item' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Is the behaviour voluntary?',
          text: 'Salivating, sweating, feeling sick, a jolt of fear: automatic, so look classical. Pressing, buying, asking, revising, avoiding: voluntary, so look operant.',
        },
        {
          title: 'Did the important event depend on the learner?',
          text: 'If the outcome would have happened anyway, it is a pairing. If it happened because of what they did, it is a consequence.',
        },
        {
          title: 'If it is operant, ask up or down before add or remove',
          text: 'Did the behaviour become more likely or less likely? That settles reinforcement against punishment. Only then decide what was added or taken away.',
        },
        {
          title: 'Check whether both are running',
          text: 'In real situations they usually are. An answer naming the classical component and the operant component separately beats one that picks a side and hopes.',
        },
      ],
    },

    { kind: 'heading', text: 'Worked examples, including the ones that catch people out' },
    {
      kind: 'list',
      items: [
        '**The pedestrian crossing button.** At many junctions it does nothing at busy times, because the lights are already on a fixed cycle. People press repeatedly anyway, because the lights do eventually change, and the change reinforces whatever they happened to be doing. Operant, and specifically superstitious behaviour.',
        '**Food poisoning.** One bad prawn and the smell of that dish turns your stomach years later. Classical, and an odd case of it: a single pairing with hours between taste and illness, where most conditioning needs many pairings seconds apart.',
        '**The dog at the cupboard.** It salivates when the door squeaks, because the squeak predicts food. That is classical. It sits when told, because sitting has produced treats. That is operant. Same dog, both at once.',
        '**Sunscreen.** You put it on, the stinging stops, and you apply it sooner the next day. The behaviour went up and something unpleasant was removed, so this is negative reinforcement, not punishment.',
      ],
    },

    { kind: 'heading', text: 'Where the neat split breaks down' },
    {
      kind: 'paragraph',
      text: '**Phobias need both.** Mowrer two-factor account says the fear is acquired classically, by pairing, and then maintained operantly. Every time you avoid the feared thing your anxiety drops, and that drop negatively reinforces the avoidance. Worse, avoiding means the CS is never presented without the US, so extinction never gets a chance to run. The fear survives precisely because the escape works, and exposure therapy is the deliberate blocking of the operant half so the classical half can finally extinguish.',
    },
    {
      kind: 'paragraph',
      text: '**Pairing on its own is not enough.** The intuitive account is that things occurring together get linked. Robert Rescorla showed in 1968 that this is not what happens. Rats received identical numbers of tone-and-shock pairings, but one group also got shocks just as often with no tone, and that group learned very little. What conditions is **prediction**, not co-occurrence: the CS has to tell the animal something it did not already know. Kamin blocking effect is the same point from the other side, since a cue added next to one that already predicts the outcome perfectly is learned poorly.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'A sentence worth stealing',
      text: 'Classical conditioning changes what a stimulus means. Operant conditioning changes what a behaviour is worth. Most learning outside a laboratory is both, running at the same time, on the same event.',
    },

    {
      kind: 'takeaways',
      items: [
        'Classical conditioning associates two stimuli and produces automatic responses. Operant conditioning associates a behaviour with its consequence and produces voluntary ones.',
        'Timing is the fastest test. The important event comes before the behaviour in classical conditioning and after it in operant.',
        'Reinforcement means the behaviour increases and punishment means it decreases. Positive and negative only ever mean added and removed.',
        'Negative reinforcement increases behaviour. Confusing it with punishment is the most common mistake in the topic.',
        'Conditioning depends on prediction rather than mere co-occurrence, and most real situations involve both processes at once.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec3-u4-L2-Q3',
      prompt: 'What is the main difference between classical and operant conditioning?',
      options: [
        'Classical only works on dogs, operant works on all animals',
        'Classical involves automatic responses, operant involves voluntary behavior',
        'Classical uses rewards, operant uses only punishment',
        'Classical is faster than operant conditioning',
      ],
      correctIndex: 1,
      explanation:
        'Classical conditioning creates automatic associations between stimuli. Operant conditioning shapes voluntary behaviour through what follows it.',
    },
    {
      id: 'psy-sec3-u1-L3-Q3',
      prompt: 'In Pavlov\'s experiment, what was the conditioned stimulus (CS)?',
      options: ['The food', 'Salivation to the food', 'The bell', 'Salivation to the bell'],
      correctIndex: 2,
      explanation:
        'The sound began as neutral and became the conditioned stimulus once it had been paired with food. The food is the US, and both kinds of salivation are responses rather than stimuli.',
    },
    {
      id: 'psy-sec3-u2-L2-Q3',
      scenario: 'You put on sunscreen and your sunburn stops stinging. The next day, you apply sunscreen right away.',
      prompt: 'What type of reinforcement is this?',
      options: [
        'Positive reinforcement (sunscreen was added)',
        'Negative reinforcement (pain was removed)',
        'Positive punishment (stinging was added)',
        'No reinforcement occurred',
      ],
      correctIndex: 1,
      explanation:
        'Something unpleasant was taken away and the behaviour became more likely, which is negative reinforcement. The behaviour going up is what rules out punishment.',
    },
    {
      id: 'psy-sec3-u2-L5-Q2',
      scenario:
        'A teacher gives gold stars for completed homework (students do more homework) and takes away recess time for disrupting class (students disrupt less).',
      prompt: 'Identify all the operant processes at work.',
      options: [
        'Both are positive reinforcement',
        'Positive reinforcement for homework, negative punishment for disruption',
        'Both are negative reinforcement',
        'Classical conditioning for homework, punishment for disruption',
      ],
      correctIndex: 1,
      explanation:
        'Stars are added and homework increases, so that half is positive reinforcement. Recess is removed and disruption decreases, so that half is negative punishment.',
    },
    {
      id: 'psy-sec3-u9-L1-Q6',
      scenario:
        'A child was once stung by a wasp while playing near yellow flowers. Now she feels anxious around any yellow objects, including school buses and bananas.',
      prompt: 'What type of conditioning and process is occurring?',
      options: [
        'Operant conditioning with generalization',
        'Classical conditioning with stimulus generalization',
        'Habituation to the color yellow',
        'Negative reinforcement of avoidance behavior',
      ],
      correctIndex: 1,
      explanation:
        'The sting was the US and the yellow flowers became the CS, which makes the fear classically conditioned. Its spread to other yellow things is stimulus generalisation.',
    },
  ],

  related: [
    {
      slug: 'schedules-of-reinforcement',
      reason:
        'What happens after you know a behaviour is operant: the four rules that decide when a reward arrives, and the very different response patterns each one produces.',
    },
  ],

  nextStep: {
    unitTitle: 'Pavlov\'s Dogs',
    text: 'The Psychology and Human Behavior course runs this across four units, from Pavlov and extinction through Skinner\'s four consequences and shaping to reinforcement schedules, with scenario practice on every distinction rather than definitions to memorise.',
  },
};
