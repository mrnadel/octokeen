import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `psy-sec6-u6` ("Sunk Cost Bias"), lessons L1 and L2, in
 * `src/data/course/professions/psychology/units/section-6-biases-part2.ts`.
 * The quiz items below are drawn from that unit and keep their original ids so
 * the page and the course cannot drift apart.
 */
export const sunkCostFallacyGuide: LearnGuide = {
  slug: 'sunk-cost-fallacy',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'The Sunk Cost Fallacy: Everyday Examples and How to Escape It',
  metaTitle: 'Sunk Cost Fallacy: Examples and Fixes',
  metaDescription:
    'What the sunk cost fallacy is, ten everyday examples, why quitting feels like losing, and the one question that reliably breaks the trap.',
  keywords: [
    'sunk cost fallacy',
    'sunk cost fallacy examples',
    'sunk cost',
    'escalation of commitment',
    'concorde fallacy',
    'cognitive biases',
  ],
  updated: '2026-08-23',
  answer:
    'A **sunk cost** is money, time or effort you have already spent and cannot get back. The **sunk cost fallacy** is letting that spending decide what you do next. The fix is to judge the choice in front of you only by what it costs from here and what it returns from here, because the past cannot be changed by any decision you make today.',

  body: [
    { kind: 'heading', text: 'What a sunk cost actually is' },
    {
      kind: 'paragraph',
      text: 'Economists split every cost into two kinds. A **recoverable cost** is one you can still avoid or get refunded. A **sunk cost** is one that is gone whatever you decide. The ticket you cannot return, the two years of a degree you have already sat through, the eleven thousand words of a novel nobody wants: all sunk.',
    },
    {
      kind: 'paragraph',
      text: 'That distinction is not a technicality. It changes which numbers belong in the decision. If you are choosing whether to keep going, the only figures that matter are what continuing will cost from today, and what it will return from today. Everything spent before this moment appears on both sides of the comparison and cancels out. It is real, it happened, and it is irrelevant to the choice.',
    },
    {
      kind: 'paragraph',
      text: 'The fallacy is treating a sunk cost as if it were an investment that still needs protecting. Once you notice that framing, you start seeing it everywhere, usually in the phrase "but I have already put so much into this."',
    },

    { kind: 'heading', text: 'Ten everyday examples' },
    {
      kind: 'paragraph',
      text: 'Sunk cost thinking rarely announces itself. It arrives as a reasonable-sounding sentence. Here is what those sentences are actually claiming.',
    },
    {
      kind: 'table',
      caption: 'The sunk cost story, and what the numbers say instead',
      columns: ['Situation', 'What you tell yourself', 'What is actually true'],
      rows: [
        [
          'A film you are not enjoying, forty minutes in',
          'I paid for the ticket',
          'The ticket is spent either way. The only live question is how you spend the next eighty minutes.',
        ],
        [
          'A meal you do not like',
          'It would be a waste not to finish it',
          'The waste already happened at the till. Eating on adds discomfort to it.',
        ],
        [
          'A gym membership you never use',
          'Cancelling means the last eight months were for nothing',
          'The eight months are gone. Cancelling stops month nine.',
        ],
        [
          'A degree in a subject you have come to dislike',
          'Three years would be wasted',
          'Three years are spent regardless. The decision is about the next thirty.',
        ],
        [
          'A stock that has fallen sharply',
          'I will sell once it gets back to what I paid',
          'The purchase price is a fact about your past, not about the company. Would you buy it today at this price?',
        ],
        [
          'A relationship that stopped working years ago',
          'We have too much history to end it',
          'History is a reason to end it kindly, not a reason to continue.',
        ],
        [
          'A software project that is late and going nowhere',
          'We are too far in to stop now',
          'Being far in is exactly what makes stopping cheap relative to finishing.',
        ],
        [
          'A queue you have been standing in for twenty minutes',
          'I have waited this long',
          'The twenty minutes buy you nothing. Only the remaining wait counts.',
        ],
        [
          'A house renovation running well over budget',
          'We have to finish or the money is lost',
          'Finishing is worth it only if the finished house is worth the remaining spend.',
        ],
        [
          'A career you trained for and no longer want',
          'I would be throwing away my training',
          'Training already paid for is a floor you keep, not a debt you owe.',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'The pattern is identical in all ten. A past number is doing work it has no right to do, and the sentence that carries it always sounds like prudence rather than the error it is.',
    },

    { kind: 'heading', text: 'Why it is so hard to shake' },
    {
      kind: 'paragraph',
      text: 'Knowing the rule does not make you immune, because the fallacy is not really an arithmetic mistake. It is an emotional one, and at least four forces push in the same direction.',
    },
    {
      kind: 'list',
      items: [
        '**Loss aversion.** Losses feel roughly twice as bad as equivalent gains feel good. Quitting converts a vague, deferred loss into a definite, present one. Continuing keeps the loss theoretical, so the brain prefers it even when continuing costs more.',
        '**Identity.** Once a project is part of how you describe yourself, abandoning it feels like admitting you were the kind of person who was wrong. The bigger your public association with the thing, the higher that price feels.',
        '**Public commitment.** Having told people you would finish, stopping now reads as breaking a promise rather than as updating on new information.',
        '**Sheer size.** The more you have put in, the more there seems to be to waste, so the pull gets stronger exactly as the case for quitting gets stronger. This inversion is the trap.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The waste already happened',
      text: 'Quitting does not waste what you spent. The spending is what wasted it, and that is finished. Quitting is the thing that stops the waste from growing.',
    },

    { kind: 'heading', text: 'Escalation of commitment: the fallacy with a budget' },
    {
      kind: 'paragraph',
      text: 'The organisational version has its own name. **Escalation of commitment** is what happens when a group responds to a failing project by putting more into it, precisely in order to justify what has already gone in. Each new round of funding raises the stakes, which raises the cost of admitting failure, which makes the next round easier to approve. It compounds.',
    },
    {
      kind: 'paragraph',
      text: 'Escalation is worse than the individual version for a structural reason: the person who has to call it off is usually the person who championed it. Killing the project means publicly marking their own judgement down. Organisations that handle this well separate the two roles, giving the stop-or-continue call to someone with no stake in the original decision.',
    },

    { kind: 'heading', text: 'The Concorde, and why the fallacy has a second name' },
    {
      kind: 'paragraph',
      text: 'The textbook case is Concorde. The British and French governments went on funding the supersonic airliner for years after internal analysis showed it would never recover its costs. The reasoning on record was not that the plane would eventually pay: it was that too much had already been committed to stop. The programme ran, the money went, and the aircraft never turned a commercial profit.',
    },
    {
      kind: 'paragraph',
      text: 'The case is famous enough that the sunk cost fallacy is sometimes called the **Concorde fallacy**, particularly in biology, where the same logic is used to ask whether animals defend a nest in proportion to what they have already invested in it. If two governments with full information and expert advice could not escape it, an individual noticing it in the mirror is doing well.',
    },

    { kind: 'heading', text: 'The question that breaks the trap' },
    {
      kind: 'paragraph',
      text: 'There is one reliable move, and it is a question:',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Ask this',
      text: 'Knowing everything I know now, and starting from scratch today, would I choose to begin this?',
    },
    {
      kind: 'paragraph',
      text: 'It works because it deletes the sunk cost from the frame. You cannot answer it by counting what you have spent, because the question stipulates you have spent nothing. What is left is the only comparison that was ever valid: cost from here against value from here.',
    },
    {
      kind: 'paragraph',
      text: 'Note which questions do not work. "How much have I already put in?" restates the bias. "What will people think if I stop?" swaps one bias for another. "How much more will it take to finish?" sounds forward-looking but usually smuggles the sunk cost back in, because the answer gets judged against the total already spent rather than against the value of finishing.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Notice the sentence',
          text: 'Catch yourself saying some version of "after all this time" or "we are too far in". That phrase is the tell.',
        },
        {
          title: 'Name the sunk figure and set it aside',
          text: 'Say the number out loud: eight months, three years, two million. Then write it down somewhere it is not part of the decision.',
        },
        {
          title: 'Ask the fresh-start question',
          text: 'Would you begin this today, from zero, knowing what you now know?',
        },
        {
          title: 'Price only what is left',
          text: 'Compare the remaining cost against the remaining benefit, and decide on that comparison alone.',
        },
      ],
    },

    { kind: 'heading', text: 'What the sunk cost fallacy is not' },
    {
      kind: 'paragraph',
      text: 'Three neighbouring ideas get mislabelled as sunk cost, and telling them apart is most of what a good answer to an exam question requires.',
    },
    {
      kind: 'table',
      columns: ['Concept', 'How it differs'],
      rows: [
        [
          'Status quo bias',
          'Preferring the current arrangement because change takes effort. No past investment is needed; the inertia is the whole cause.',
        ],
        [
          'Loss aversion',
          'The underlying asymmetry that makes losses hurt more than gains please. It is the engine of the sunk cost fallacy rather than the fallacy itself.',
        ],
        [
          'Opportunity cost',
          'The value of the best thing you gave up. It is forward-looking and entirely legitimate, and it is usually the argument for quitting.',
        ],
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Not every persistence is a fallacy',
      text: 'Sticking with something hard is not automatically an error. Persistence is rational whenever the remaining benefit still beats the remaining cost. The fallacy is specifically about using past spending as the reason, when the forward numbers do not support it.',
    },
    {
      kind: 'paragraph',
      text: 'There is also a legitimate cousin worth knowing: reputation. If quitting genuinely damages your credibility, that damage is a real future cost and belongs in the calculation. What it does not do is turn the money you already spent into a reason. Keep the two separate and you keep the reasoning honest.',
    },

    {
      kind: 'takeaways',
      items: [
        'A sunk cost is spending you cannot recover. It should carry no weight in any decision about what to do next.',
        'The fallacy runs on loss aversion, identity, public commitment and sheer size, which is why knowing the rule is not enough.',
        'The group version, escalation of commitment, compounds because each new round makes admitting failure more expensive.',
        'Ask whether you would start today from zero. It is the only question that removes the sunk cost from the frame.',
        'Persisting is fine when the remaining benefit beats the remaining cost. The error is persisting because of what is already gone.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec6-u6-L1-Q2',
      prompt: 'What should rational decision-making focus on?',
      options: [
        'How much you have already spent',
        'How much time you have already invested',
        'Future costs and benefits only',
        'What other people will think of the decision',
      ],
      correctIndex: 2,
      explanation:
        'Rational decisions look forward. Past spending appears on both sides of the comparison and cancels out, so it cannot change which option is better.',
    },
    {
      id: 'psy-sec6-u6-L1-Q3',
      scenario:
        'You spent $100 on concert tickets. On the night, you feel ill and a blizzard is forecast. A friend offers to drive, but you would have a miserable time.',
      prompt: 'What is the rational choice here?',
      options: [
        'Go anyway, because you already spent $100',
        'Stay home. The $100 is a sunk cost and cannot be recovered.',
        'Go, because staying home would mean the money was wasted',
        'Go, because a friend has offered to drive',
      ],
      correctIndex: 1,
      explanation:
        'The $100 is gone whichever way you choose. Going while ill through a blizzard adds a bad evening to a cost you were paying regardless.',
    },
    {
      id: 'psy-sec6-u6-L2-Q2',
      scenario: 'A company has spent $2 million on a product that is not working.',
      prompt: 'What does escalation of commitment predict they will do?',
      options: [
        'Cut their losses immediately and stop',
        'Invest even more to try to make it work',
        'Ask customers whether they want the product',
        'Rationally evaluate the remaining potential',
      ],
      correctIndex: 1,
      explanation:
        'Escalation of commitment predicts doubling down. Each additional round of spending is justified by the spending before it, which is what makes it compound.',
    },
    {
      id: 'psy-sec6-u6-L2-Q4',
      prompt: 'Which question most reliably breaks sunk cost thinking?',
      options: [
        'How much have I already spent on this?',
        'Would I start this today, knowing what I know now?',
        'What will people think of me if I stop?',
        'How much more will it take to finish?',
      ],
      correctIndex: 1,
      explanation:
        'It is the only one of the four that removes the past spending from the frame, leaving nothing to judge but the cost and value that are still ahead of you.',
    },
    {
      id: 'psy-sec6-u6-L3-Q2',
      prompt: 'Which of these is status quo bias rather than the sunk cost fallacy?',
      options: [
        'Finishing a bad book because you paid for it',
        'Staying on a worse insurance plan because switching is a hassle',
        'Funding a failing project to justify what it has already cost',
        'Holding a losing stock until it returns to your purchase price',
      ],
      correctIndex: 1,
      explanation:
        'Status quo bias needs no past investment at all. The inertia comes from the effort of changing, whereas the sunk cost fallacy is driven by what has already been spent.',
    },
  ],

  nextStep: {
    unitTitle: 'Sunk Cost Bias',
    text: 'The Psychology and Human Behavior course covers this in five lessons, adding status quo bias, the default effect and the choice architecture that exploits both, with scenario practice on each.',
  },
};
