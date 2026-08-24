import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `sp-sec9-u1` ("Newton's Laws in Space") lesson L3 and
 * `sp-sec9-u2` ("How Rockets Work") lesson L1, in
 * `src/data/course/professions/space-astronomy/units/section-9-rockets-part1.ts`.
 * Reused quiz items keep their original ids.
 *
 * The course states that rockets work in vacuum but never covers the pressure
 * term of the thrust equation, so the central fact of this page (an engine is
 * measurably stronger in vacuum) is written from the physics rather than from
 * the lesson text. Engine figures are the published sea level and vacuum
 * ratings for the RS-25 and Merlin 1D.
 */
export const howRocketsWorkInAVacuumGuide: LearnGuide = {
  slug: 'how-rockets-work-in-a-vacuum',
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'How Rockets Work in a Vacuum, and Why They Work Better There',
  metaTitle: 'Do Rockets Need Air? How Vacuum Thrust Works',
  metaDescription:
    'Rockets do not push against air. Momentum conservation explains the thrust, and the same engine makes 23 percent more of it in vacuum than at sea level.',
  keywords: [
    'how do rockets work in a vacuum',
    'do rockets need air to push against',
    'rocket thrust in space',
    'newtons third law rocket',
    'specific impulse vacuum',
    'rocket nozzle expansion ratio',
  ],
  updated: '2026-08-23',
  answer:
    'A rocket does not push against the air. It throws mass out of the back at high speed, and **conservation of momentum** means the rest of the vehicle has to move the other way. Nothing in that exchange involves the surroundings, which is why a rocket works in vacuum. The part that surprises people is that it works **better** there: the same engine that produces 1,859 kilonewtons of thrust at sea level produces 2,279 in vacuum, because the atmosphere had been pushing back on the nozzle the whole time.',

  body: [
    { kind: 'heading', text: 'The misconception, stated plainly' },
    {
      kind: 'paragraph',
      text: 'The belief goes like this: a rocket engine blasts hot gas downward, the gas hits the air below, and the air shoves the rocket up. Take the air away and there is nothing to shove against, so the rocket should hang there uselessly.',
    },
    {
      kind: 'paragraph',
      text: 'It is a reasonable thing to think, and worth being clear about why. Every method of moving a person has ever felt in their own body pushes on something external: you walk by pushing the ground, you swim by pushing water, an oar pushes a river. Launch footage reinforces it. The flame slams into the pad, the structure vanishes in billowing white, and it looks exactly like a thing shoving off the ground.',
    },
    {
      kind: 'paragraph',
      text: 'The reasoning is sound and the premise is false. A rocket is the one common machine that does not work that way.',
    },

    { kind: 'heading', text: 'What actually produces the thrust' },
    {
      kind: 'paragraph',
      text: 'Momentum in a closed system is conserved. A rocket sitting still has zero of it. Once it throws propellant backward, that propellant carries momentum one way, so the remaining vehicle must carry an exactly equal amount the other way. The books balance whether or not anything else is nearby.',
    },
    {
      kind: 'paragraph',
      text: 'Put numbers on it. A Merlin Vacuum engine, the upper stage engine on a Falcon 9, ejects roughly 287 kilograms of exhaust every second at about 3,413 metres per second. That is 979,000 kilogram metres per second of momentum leaving each second, so the stage receives the same amount in the opposite direction, which is another way of writing 979 kilonewtons of thrust.',
    },
    {
      kind: 'paragraph',
      text: 'Read that calculation again and look for the word air. It is not there. Mass flow rate and exhaust velocity are the only inputs, and both are set by what happens inside the engine.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'The version you can test at home',
      text: 'Sit on an office chair holding a heavy book. Throw the book. You roll backward. You did not push on the room, you pushed on the book, and the book pushed on you. A rocket does that continuously, with hot gas instead of a book.',
    },

    { kind: 'heading', text: 'Where the force is applied, physically' },
    {
      kind: 'paragraph',
      text: 'If you want the thrust as a mechanical push on solid metal rather than as a bookkeeping rule, look inside the combustion chamber. Fuel and oxidiser burn there at about 206 bar in a Space Shuttle main engine, over 200 times the pressure of the atmosphere outside.',
    },
    {
      kind: 'paragraph',
      text: 'That gas pushes outward equally in every direction, against every wall it touches. The forward end of the chamber is a solid dome, so gas pressing there pushes the engine forward. The aft end is not solid: it narrows to a throat and opens into the nozzle, with no wall to receive the matching backward push. The unbalanced pressure force that results **is** the thrust, and it is applied to metal inside the rocket. That is also what a test stand measures: load cells under the engine mounts, never anything in the air.',
    },

    { kind: 'heading', text: 'The surprise: vacuum makes it stronger' },
    {
      kind: 'paragraph',
      text: 'Thrust has two terms. The first is the momentum term above, mass flow multiplied by exhaust velocity. The second is a pressure term: the exhaust leaves the nozzle at some pressure while the ambient atmosphere pushes back on that same exit area from outside. Thrust equals mass flow times exhaust velocity, plus exit area times the difference between exit pressure and ambient pressure.',
    },
    {
      kind: 'paragraph',
      text: 'At sea level, ambient pressure is 101,325 pascals pressing inward on the open mouth of the nozzle. In vacuum it is zero. The term does not shrink, it disappears, and the engine gets stronger.',
    },
    {
      kind: 'table',
      caption: 'Published ratings for two well documented engines',
      columns: ['Engine', 'Sea level thrust', 'Vacuum thrust', 'Specific impulse, sea level to vacuum'],
      rows: [
        ['RS-25, Space Shuttle main engine', '1,859 kN', '2,279 kN', '366 s to 452 s'],
        ['Merlin 1D, Falcon 9 first stage', '845 kN', '914 kN', '282 s to 311 s'],
      ],
    },
    {
      kind: 'paragraph',
      text: 'The RS-25 gains 420 kilonewtons, about 23 percent, purely by leaving the atmosphere. That is not a coincidence. Its nozzle exit is 2.3 metres across, an area of 4.15 square metres, and sea level air pressure across that area comes to 421 kilonewtons. The entire gain is the atmosphere that stops pressing on the nozzle mouth. The same arithmetic accounts for the Merlin 1D and its smaller 69 kilonewton gain.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The number that settles the argument',
      text: 'If rockets needed air, thrust in vacuum would be zero. It is measurably higher instead, and the increase matches atmospheric pressure times nozzle area to within a couple of percent. That is the opposite of what the misconception predicts.',
    },
    {
      kind: 'paragraph',
      text: 'Specific impulse tells the same story. It measures thrust per unit of propellant burned, the honest measure of engine efficiency, and it rises by 20 to 25 percent in vacuum for both engines above. Aerodynamic drag goes to zero as well. A rocket in vacuum is not merely unimpaired. It is in its best operating environment.',
    },

    { kind: 'heading', text: 'Why vacuum engines have those enormous bells' },
    {
      kind: 'paragraph',
      text: 'The shape of real hardware is itself an argument. A nozzle converts heat and pressure into directed speed by letting the gas expand, and the more it expands the faster it goes. The ratio of exit area to throat area is the expansion ratio. An RS-25 runs about 69 to 1. An RL10 upper stage engine, which never operates in the atmosphere, reaches about 280 to 1 using a nozzle extension that unfolds after staging.',
    },
    {
      kind: 'paragraph',
      text: 'You cannot bolt that nozzle onto a first stage. Expand the exhaust below ambient pressure and the surrounding air crushes the plume inward, the flow separates from the wall, and the engine suffers side loads violent enough to destroy it. Sea level engines run short bells and accept a lower exhaust velocity as the price of surviving the lower atmosphere. The tradeoff runs opposite to the misconception: engineers are not adding hardware to cope with the absence of air, they are compromising designs to cope with its presence.',
    },

    { kind: 'heading', text: 'How we know, not just why it should be true' },
    {
      kind: 'list',
      items: [
        '**Engines are fired in vacuum chambers on the ground.** NASA\'s In-Space Propulsion Facility in Ohio holds a chamber 30 metres across where full scale upper stage engines run at simulated altitude. The measured thrust comes out higher than the same engine produces outside.',
        '**The Apollo lunar module took off from the Moon six times.** An ascent engine of about 15.6 kilonewtons lifted two astronauts off an airless surface on every landing mission. That is an experimental result, not a calculation.',
        '**Every orbital manoeuvre since 1957 depends on it.** Station keeping, docking, deorbit burns, interplanetary injections. Voyager 1 still fires thrusters to keep its antenna pointed at Earth from 25 billion kilometres away.',
        '**Goddard tested it directly, in 1915.** He fired rockets inside a vacuum chamber at Clark University and measured greater thrust than in air, half a century before anyone went to the Moon.',
      ],
    },

    { kind: 'heading', text: 'The 1920 editorial, and why it is worth knowing about' },
    {
      kind: 'paragraph',
      text: 'On 13 January 1920 the New York Times ran an unsigned editorial mocking Goddard for proposing a rocket that could reach the Moon. It said he appeared not to know the relation of action to reaction, or the need to have something better than a vacuum to react against, and that he seemed to lack the knowledge ladled out daily in high schools. On 17 July 1969, with Apollo 11 on its way, the paper printed a correction: further investigation had confirmed the findings of Isaac Newton in the seventeenth century, and the Times regretted the error.',
    },
    {
      kind: 'paragraph',
      text: 'The point is not that the editors were fools. It is that this mistake is old, intuitive, and caught a serious newspaper that believed it was defending basic physics. Anyone reaching the same conclusion today is reasoning from real experience of how pushing works. The experience is just an incomplete sample.',
    },

    { kind: 'heading', text: 'The follow up questions people actually ask' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Does the exhaust not need somewhere to go?',
          text: 'The momentum exchange is complete the moment the gas leaves the nozzle. What happens to the plume afterward has no effect on the vehicle.',
        },
        {
          title: 'Is the rocket not slower without air to react against?',
          text: 'It is faster. Thrust and specific impulse both rise, and drag drops to zero. The propellant supply is what limits you, not the atmosphere.',
        },
        {
          title: 'Then why does the first stage need so much thrust?',
          text: 'It lifts the whole vehicle out of a gravity well through the thickest part of an atmosphere. Air is a cost of the first minutes of flight, never a source of thrust.',
        },
        {
          title: 'What is the flame pushing on at launch, then?',
          text: 'Nothing that matters. Flame deflectors and water deluge protect the pad and damp acoustic energy. Remove all of it and the thrust is unchanged.',
        },
      ],
    },

    {
      kind: 'takeaways',
      items: [
        'A rocket accelerates by throwing propellant backward. Conservation of momentum requires the vehicle to move forward, with or without a surrounding medium.',
        'The force is applied inside the engine, as unbalanced gas pressure on the forward end of the combustion chamber. There is no wall at the back to cancel it.',
        'Thrust includes a pressure term equal to nozzle exit area times ambient pressure, so removing the atmosphere increases thrust rather than removing it.',
        'An RS-25 gains 420 kN going from sea level to vacuum, and 101,325 pascals times its 4.15 square metre nozzle exit is 421 kN. The match is the proof.',
        'Vacuum engines carry huge nozzles precisely because no air is present to make the exhaust separate from the walls. Sea level engines are the compromised ones.',
      ],
    },
  ],

  quiz: [
    {
      id: 'sp-sec9-u1-L5-SQ5',
      prompt: 'Do rockets need air to push against?',
      options: ['Yes', 'Only at launch', 'No', 'Only in orbit'],
      correctIndex: 2,
      explanation:
        'A rocket pushes on its own propellant and the propellant pushes back on the rocket. The surrounding air plays no part in generating thrust at any point in the flight.',
    },
    {
      id: 'guide-rockets-vacuum-Q1',
      scenario:
        'An RS-25 engine produces 1,859 kN of thrust when fired at sea level.',
      prompt: 'What does the same engine produce at the same throttle setting in vacuum?',
      options: [
        'Nothing, because it has no air to react against',
        'About 930 kN, roughly half as much',
        'About 1,859 kN, exactly the same',
        'About 2,279 kN, roughly 23 percent more',
      ],
      correctIndex: 3,
      explanation:
        'Vacuum thrust is higher. The 420 kN gain equals atmospheric pressure multiplied by the 4.15 square metre nozzle exit area, which is the air that had been pushing back on the nozzle at sea level.',
    },
    {
      id: 'guide-rockets-vacuum-Q2',
      prompt: 'Why does a rocket engine produce more thrust in vacuum than at sea level?',
      options: [
        'The exhaust can travel faster with no air in the way',
        'Ambient air pressure no longer pushes back on the nozzle exit area',
        'Fuel burns hotter when there is no atmosphere around the engine',
        'Gravity is weaker at the altitudes where vacuum engines run',
      ],
      correctIndex: 1,
      explanation:
        'Exhaust velocity is set inside the nozzle, not by the air outside it, and combustion happens in a sealed chamber at over 200 bar regardless of altitude. The gain is the pressure term of the thrust equation, exit area times ambient pressure, going to zero.',
    },
    {
      id: 'sp-sec9-u1-L3-Q6',
      prompt: 'If the force on the exhaust gas is 1,000 N, what is the thrust force on the rocket?',
      options: ['500 N', '1,000 N', '2,000 N', 'It depends on the rocket\'s mass'],
      correctIndex: 1,
      explanation:
        'Action and reaction forces are always equal and opposite. Mass changes how much the rocket accelerates under that force, not how large the force is.',
    },
    {
      id: 'guide-rockets-vacuum-Q3',
      scenario:
        'The Apollo lunar module ascent stage lifted two astronauts off the surface of the Moon on six separate missions. The Moon has no appreciable atmosphere.',
      prompt: 'What does that establish most directly?',
      options: [
        'That low gravity is what allows a rocket to work without air',
        'That rocket thrust does not require a surrounding medium',
        'That solid fuel engines behave differently from liquid ones in vacuum',
        'That the exhaust was reflecting off the lunar surface',
      ],
      correctIndex: 1,
      explanation:
        'The launches were an experiment run six times in a near perfect vacuum. Low lunar gravity made the job easier but is a separate matter from whether thrust is produced at all, and thrust is produced by expelling mass.',
    },
  ],

  related: [
    {
      slug: 'spaghettification',
      reason:
        'Another case where the obvious mental picture is wrong: a black hole does not tear you apart by pulling hard, and a bigger one is gentler than a small one.',
    },
  ],

  nextStep: {
    unitTitle: 'How Rockets Work',
    text: 'The Space and Astronomy course builds from Newton\'s laws through thrust, staging and the rocket equation, then into orbital mechanics, where the counterintuitive part is that speeding up moves you to a slower orbit.',
  },
};
