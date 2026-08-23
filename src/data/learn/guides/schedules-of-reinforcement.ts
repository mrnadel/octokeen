import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `psy-sec3-u3` ("Reinforcement Schedules"), lessons L1 to L5,
 * plus the schedule lesson of `psy-sec3-u4` ("Learning Foundations Review"), in
 * `src/data/course/professions/psychology/units/section-3-learning-part1.ts`.
 * The quiz items are drawn from those lessons and keep their original ids so
 * the page and the course cannot drift apart.
 */
export const schedulesOfReinforcementGuide: LearnGuide = {
  slug: 'schedules-of-reinforcement',
  courseId: PROFESSION_ID.PSYCHOLOGY,
  title: 'Schedules of Reinforcement: Fixed, Variable, Ratio and Interval',
  metaTitle: 'Schedules of Reinforcement: The 4 Types',
  metaDescription:
    'Fixed and variable, ratio and interval. What each schedule does to response rate and extinction, with real examples and a revision table.',
  keywords: [
    'schedules of reinforcement',
    'reinforcement schedules',
    'fixed ratio',
    'variable ratio',
    'fixed interval',
    'variable interval',
    'partial reinforcement extinction effect',
    'operant conditioning',
  ],
  updated: '2026-08-23',
  answer:
    'A **schedule of reinforcement** is the rule that decides which responses get rewarded. Two questions define it: is the reward earned by counting responses (**ratio**) or by waiting out time (**interval**), and is the requirement constant (**fixed**) or unpredictable (**variable**)? That gives four schedules, FR, VR, FI and VI, each producing a different rate and pattern of behaviour. Variable ratio produces the fastest and most persistent responding, which is why gambling machines are built on it.',

  body: [
    { kind: 'heading', text: 'Two questions define every schedule' },
    {
      kind: 'paragraph',
      text: 'Once a behaviour exists, the interesting question is not whether you reward it but how often, and on what rule. Skinner and Charles Ferster catalogued the answers across years of pigeon data, and the system reduces to two questions.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**What is being counted, responses or seconds?** If the reward depends on how many times you do the thing, it is a **ratio** schedule. If it depends on time passing before the thing counts again, it is an **interval** schedule.',
        '**Is the requirement constant or unpredictable?** A **fixed** schedule uses the same number or the same delay every time. A **variable** schedule scatters the requirement around an average.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The baseline all four are measured against is **continuous reinforcement**, where every correct response is rewarded. It teaches a new behaviour faster than anything else, and it is also the most fragile thing you can build. Stop rewarding and it collapses almost at once, because the first unrewarded response is unlike anything the learner has met.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The partial reinforcement extinction effect',
      text: 'Behaviour maintained on a partial schedule survives far longer once rewards stop. The learner has already lived through dry spells, so another one carries no information. A vending machine that has always worked gets abandoned after a single failure. A slot machine that rarely pays gets played for hours.',
    },

    { kind: 'heading', text: 'Fixed ratio: a set number of responses' },
    {
      kind: 'paragraph',
      text: 'On a **fixed ratio** schedule the reward arrives after a set number of responses. FR-10 means every tenth response pays. Piece-rate work is the purest human case: a garment worker paid per finished seam, a tree planter paid per sapling, an annotator paid per labelled image. The loyalty card that gives you the ninth coffee free is the same rule wearing a friendlier face.',
    },
    {
      kind: 'paragraph',
      text: 'Fixed ratio produces a high response rate, because responding faster genuinely does get you paid sooner, broken by a distinctive gap after each reward. Textbooks call that the **post-reinforcement pause**, which is slightly misleading: its length tracks the size of the ratio still ahead rather than the reward just received, so many researchers now call it the pre-ratio pause. Push the requirement up too far or too fast and responding does not merely slow, it falls apart. That is **ratio strain**, and anyone who has watched a bonus target get quietly raised each quarter until the team stopped chasing it has seen it.',
    },

    { kind: 'heading', text: 'Variable ratio: an unpredictable number of responses' },
    {
      kind: 'paragraph',
      text: 'On a **variable ratio** schedule the reward still depends on how many responses you make, but the number changes each time and only the average is stable. VR-10 pays every tenth response on average, sometimes after two, sometimes after thirty.',
    },
    {
      kind: 'paragraph',
      text: 'This is the strongest schedule there is. It produces the highest and steadiest rate of the four, with no pause after reward, because the very next response could be the paying one. It is the most resistant to extinction for the same reason: no run of failures ever proves the game has ended. Beyond the slot machine, the pattern turns up wherever effort is cheap and payoff is rare. A salesperson on a cold-call list, an angler recasting, a wildlife photographer holding the shutter down, someone sending out job applications. Uniform work, scattered reward, and stopping always feels like quitting one response too early.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Be careful with the slot machine claim',
      text: 'A modern gaming machine is not running a counter toward a hidden target. Each spin is an independent draw, which is technically a **random ratio** rather than a variable ratio, and machines layer near misses and losses dressed up as wins on top. Same family of psychology, different mechanism, and saying so is more accurate than the version most revision sites print.',
    },

    { kind: 'heading', text: 'Fixed interval: the first response after a set time' },
    {
      kind: 'paragraph',
      text: 'On a **fixed interval** schedule, reward becomes available after a set period and goes to the first response made once that period has elapsed. Responding before the clock runs out achieves nothing. FI-60 pays the first response after sixty seconds, whether you made one response in that minute or four hundred.',
    },
    {
      kind: 'paragraph',
      text: 'That contingency produces the most recognisable pattern in the field: the **scallop**. Responding drops to almost nothing right after a reward, then accelerates as the deadline nears. Students revising are the standard illustration and a fair one. A better one: in 1972 Weisberg and Waldrop published cumulative records of bills passed by the United States Congress in Science, and the curves scalloped. Little legislation early in a session, a steep run of it before adjournment, session after session.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'The paycheck example is looser than it looks',
      text: 'Nearly every textbook offers the regular paycheck as fixed interval, and as a memory hook it works. It is a loose fit. A salary is not delivered to the first thing you do after Friday arrives; it is paid whether you respond or not. For a clean example, use a reward that genuinely requires a response after the wait.',
    },

    { kind: 'heading', text: 'Variable interval: the first response after an unpredictable wait' },
    {
      kind: 'paragraph',
      text: 'On a **variable interval** schedule the waiting period changes each time. Reward still goes to the first response after the delay elapses, but you never know how long that was. VI-60 averages a minute and might be five seconds or three.',
    },
    {
      kind: 'paragraph',
      text: 'The result is slow, steady and remarkably even responding. There is no point hammering, because extra responses do not shorten the wait, and no point stopping, because the reward could become available at any moment. Checking an inbox is the canonical modern case. So is a random drug-testing programme, an unannounced walkthrough by a manager, and a mobile speed camera that might be anywhere on the route.',
    },

    { kind: 'heading', text: 'The four schedules at a glance' },
    {
      kind: 'table',
      caption: 'What each schedule does, and where you have met it',
      columns: ['Schedule', 'Reward depends on', 'Rate', 'Pattern', 'Example'],
      rows: [
        [
          'Fixed ratio (FR)',
          'A set number of responses',
          'High',
          'Steady bursts with a pause after each reward',
          'Paid per finished item, ninth coffee free',
        ],
        [
          'Variable ratio (VR)',
          'An unpredictable number of responses',
          'Highest',
          'Fast and even, no pauses',
          'Cold calls, loot drops, gaming machines',
        ],
        [
          'Fixed interval (FI)',
          'The first response after a set delay',
          'Low overall',
          'Scalloped: nothing, then a rush before the deadline',
          'Revising for a scheduled exam',
        ],
        [
          'Variable interval (VI)',
          'The first response after an unpredictable delay',
          'Moderate',
          'Slow and very steady',
          'Checking the inbox, random inspections',
        ],
      ],
    },

    { kind: 'heading', text: 'How to read the response curves' },
    {
      kind: 'paragraph',
      text: 'The four graphs in every textbook are **cumulative records**, and most students misread them because nobody explains what they are. The line never goes down. Each response steps it up by a fixed amount, so the line is a running total and the only thing carrying information is the **slope**. Steep means fast responding. Flat means none.',
    },
    {
      kind: 'paragraph',
      text: 'Read that way the four shapes make sense. Variable ratio is a near-straight steep line. Fixed ratio is the same climb interrupted by short flat shelves, one after each reward. Fixed interval is a repeating scallop, flat and then curving up into each deadline. Variable interval is a straight line at a gentler angle, low but unwavering.',
    },

    { kind: 'heading', text: 'Why ratio beats interval, and variable beats fixed' },
    {
      kind: 'paragraph',
      text: 'Ratio schedules always produce faster responding than interval schedules, and the reason is mechanical rather than motivational. On a ratio schedule the reward is a function of your response count, so doubling your rate roughly doubles your income. On an interval schedule time has to pass regardless, so extra responses buy nothing. Nobody is trying harder. One of them is being paid for speed.',
    },
    {
      kind: 'paragraph',
      text: 'The extinction story is about information. When rewards stop, the learner has to work out whether this is a normal dry spell or the end. On a fixed schedule that is obvious the moment an expected reward fails to appear. On a variable schedule there is no expected point, so a long gap looks like the gaps that have paid out before. Variable schedules therefore outlast fixed ones, and variable ratio outlasts everything.',
    },

    { kind: 'heading', text: 'What the research shows, and what it does not' },
    {
      kind: 'paragraph',
      text: 'Almost all of the classic schedule data comes from food-deprived pigeons and rats making thousands of responses in an operant chamber. Humans given verbal instructions often do not reproduce the curves. On fixed interval schedules people tend to settle into either a low steady rate or a high steady rate rather than the pigeon scallop, and a stated rule about how the task works can override the real contingency, so behaviour keeps following the instruction after the instruction stops being true.',
    },
    {
      kind: 'paragraph',
      text: 'Resist the urge to label every app a variable ratio schedule, too. It has become the default explanation for anything habit-forming and is usually more assertion than analysis. A feed refresh is not running a counter toward a hidden payout, and a notification is not contingent on your responses at all. The defensible claim is narrower: unpredictable reward timing sustains behaviour far better than predictable timing, and products built for engagement exploit that.',
    },

    { kind: 'heading', text: 'Using schedules on yourself' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Start continuous',
          text: 'While a behaviour is new, reward it every single time. Acquisition is fastest here, and durability is not yet the problem you have.',
        },
        {
          title: 'Thin it out gradually',
          text: 'Once the behaviour is reliable, move to partial reinforcement in steps. Jumping from every time to occasionally is how you get ratio strain.',
        },
        {
          title: 'Make it unpredictable',
          text: 'A variable schedule is what carries the behaviour through the weeks when nothing seems to be working. This is the whole trick.',
        },
        {
          title: 'Match the schedule to the behaviour',
          text: 'Ratio suits output you want more of. Interval suits attention you want spread evenly. A deadline you control is a fixed interval and it will scallop, so plan around that.',
        },
      ],
    },

    {
      kind: 'takeaways',
      items: [
        'A schedule is defined by two questions: responses or time, and fixed or unpredictable. That yields FR, VR, FI and VI.',
        'Continuous reinforcement teaches fastest and extinguishes fastest. Partial reinforcement is what makes a behaviour last.',
        'Ratio schedules produce faster responding than interval schedules, because on a ratio schedule speed genuinely pays.',
        'Variable ratio is the strongest schedule: highest rate, no pauses, most resistant to extinction.',
        'Most schedule data comes from animals in operant chambers, and instructed humans often depart from the classic curves.',
      ],
    },
  ],

  quiz: [
    {
      id: 'psy-sec3-u3-L2-Q2',
      prompt: 'A factory worker earns a bonus for every 50 items assembled. What schedule is this?',
      options: ['Fixed interval', 'Variable interval', 'Fixed ratio', 'Variable ratio'],
      correctIndex: 2,
      explanation:
        'The reward is tied to a set number of responses, which makes it a ratio schedule, and the number never changes, which makes it fixed.',
    },
    {
      id: 'psy-sec3-u3-L5-Q1',
      prompt: 'Video games often use random loot drops to keep players playing. What schedule is this?',
      options: [
        'Fixed interval (loot drops every hour)',
        'Fixed ratio (loot drops every 10 enemies)',
        'Variable ratio (loot drops after unpredictable numbers of actions)',
        'Continuous (loot drops every action)',
      ],
      correctIndex: 2,
      explanation:
        'The drop depends on how many actions you take, but the number is scattered around an average. That is variable ratio, and it is why the next fight always feels worth having.',
    },
    {
      id: 'psy-sec3-u4-L3-Q5',
      scenario: 'Students do very little studying right after a midterm but study intensely as the final exam approaches.',
      prompt: 'What schedule and behavior pattern does this describe?',
      options: [
        'Variable ratio: unpredictable exam timing',
        'Fixed interval: the scalloped pattern of effort',
        'Fixed ratio: studying a set number of chapters',
        'Continuous reinforcement: every study session is graded',
      ],
      correctIndex: 1,
      explanation:
        'The reward arrives on a known date rather than after a number of responses, and effort accelerates into it. Flat, then steep, then flat again is the fixed interval scallop.',
    },
    {
      id: 'psy-sec3-u3-L4-Q4',
      scenario: 'A manager wants employees to consistently check a shared inbox throughout the day, not just at predictable times.',
      prompt: 'Which schedule would be most effective?',
      options: [
        'Fixed interval: check once per hour',
        'Fixed ratio: check after every 10 emails sent',
        'Variable interval: send important messages at unpredictable times',
        'Continuous: reward every single inbox check',
      ],
      correctIndex: 2,
      explanation:
        'Unpredictable timing removes any moment at which checking is pointless, so the rate stays low but steady all day. That even spread is what variable interval produces.',
    },
    {
      id: 'psy-sec3-u4-L3-Q3',
      scenario:
        'A vending machine that always works (continuous) is abandoned after one failure. A slot machine that rarely pays (partial) is played for hours without winning.',
      prompt: 'What reinforcement principle explains this?',
      options: [
        'Partial reinforcement extinction effect',
        'Stimulus generalization across machines',
        'Negative punishment from the vending machine',
        'Classical conditioning from machine sounds',
      ],
      correctIndex: 0,
      explanation:
        'A single failure is startling information on a continuous schedule and no information at all on a partial one. That asymmetry is the partial reinforcement extinction effect.',
    },
  ],

  nextStep: {
    unitTitle: 'Reinforcement Schedules',
    text: 'The Psychology and Human Behavior course covers this in five lessons, working from continuous versus partial reinforcement through each schedule to spotting them in apps, workplaces and your own habits, with scenario practice throughout.',
  },
};
