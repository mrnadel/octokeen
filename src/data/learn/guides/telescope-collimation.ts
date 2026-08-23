import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `sp-sec12-u2` ("Telescope Setup and Alignment"), lesson L4
 * ("Focusing and Collimation"), in
 * `src/data/course/professions/space-astronomy/units/section-12-amateur.ts`.
 *
 * Shape A per `docs/seo/search-demand.md` §4: the reader is standing next to a
 * telescope in the dark trying to finish a job, so the whole procedure is above
 * the check and the check is optional. The course unit names collimation and
 * its symptom but never gives the procedure, so the steps below are written
 * from standard Newtonian practice rather than lifted from the lesson.
 */
export const telescopeCollimationGuide: LearnGuide = {
  slug: 'telescope-collimation',
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'How to Collimate a Newtonian Telescope',
  metaTitle: 'How to Collimate a Newtonian Telescope',
  metaDescription:
    'Step by step Newtonian collimation: secondary first, then primary, with a collimation cap or laser, and the defocused star test that confirms it worked.',
  keywords: [
    'telescope collimation',
    'how to collimate a newtonian telescope',
    'collimate a dobsonian',
    'laser collimator',
    'collimation cap',
    'star test collimation',
  ],
  updated: '2026-08-23',
  answer:
    'Collimation aligns a reflector\'s mirrors so a star focuses to a point instead of a smear. Work in one order: centre the secondary under the focuser, tilt the secondary until the primary\'s reflection sits centred inside it, then tilt the primary until everything is concentric. A solid tube Newtonian that has not been knocked usually needs only the last step, and that takes about two minutes.',

  body: [
    { kind: 'heading', text: 'What miscollimation looks like, and what it does not' },
    {
      kind: 'paragraph',
      text: 'The signature is asymmetry. A collimated Newtonian shows a bright star at high power inside even, concentric rings. A miscollimated one piles the rings up on one side and gives the star a small comet tail that points the same way wherever you move the star in the field. Planets smear toward one edge and never quite snap into focus. Three other faults also soften an image, so rule them out before touching a screw.',
    },
    {
      kind: 'list',
      items: [
        '**Seeing.** The image boils in every direction at once and changes second to second. Atmospheric turbulence, and no adjustment fixes it.',
        '**A tube still cooling.** A warm mirror in cold air throws a soft plume across the star and the focus point wanders. Give it thirty to sixty minutes outside.',
        '**Pinched optics.** Stars look triangular rather than comet shaped. A mirror is clamped too tightly. Back the retaining clips off until it can just be rocked with a fingertip, and leave the collimation screws alone.',
        '**Coma at the rim.** Normal in a fast Newtonian. Round stars in the middle and flared stars only at the edge means you are looking at the optical design, not a fault.',
      ],
    },

    { kind: 'heading', text: 'What you need' },
    {
      kind: 'list',
      items: [
        '**A collimation cap or Cheshire eyepiece.** A cap is a plug with a small central hole, and a film canister lid with a hole punched dead centre does the same job. A Cheshire adds a crosshair and an angled reflective face and is worth the small cost.',
        '**A centre spot on the primary.** A ring sticker at the exact middle of the main mirror. It sits inside the shadow of the secondary, so it never appears in an image.',
        '**The right keys.** Secondary holders usually take a small hex key; primary cells vary. Find out in daylight, not at midnight in a field.',
        '**Something evenly lit to aim at.** A white wall, paper held opposite the focuser, or an overcast sky.',
      ],
    },

    { kind: 'heading', text: 'Step 1. Centre the secondary under the focuser' },
    {
      kind: 'paragraph',
      text: 'Skip this unless the secondary has been removed or knocked. On most telescopes it is set once and stays set for years, and the odds are that only the primary has drifted.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Rack the focuser most of the way in',
          text: 'Take the eyepiece out, drop the collimation cap in, and look through the hole at the small oval mirror hanging in the tube.',
        },
        {
          title: 'Judge the outline, not the reflections',
          text: 'Ignore everything reflected for now. The secondary\'s own outline should look circular and sit centred in the drawtube, with an even gap all the way round.',
        },
        {
          title: 'Move it with the central bolt',
          text: 'Loosen the three small tilt screws a fraction, then turn the central bolt to slide the secondary along the tube toward or away from the primary, and rotate the holder so the mirror faces the focuser squarely.',
        },
        {
          title: 'Do not chase the offset',
          text: 'At f/5 and below the secondary is meant to sit slightly offset away from the focuser. You never measure this. Setting the tilt in step 2 produces it for you.',
        },
      ],
    },

    { kind: 'heading', text: 'Step 2. Tilt the secondary until the primary is centred in it' },
    {
      kind: 'paragraph',
      text: 'Still looking through the cap, switch attention from the outline to the reflection. You want the whole circle of the primary sitting concentric inside the secondary, with an even sliver of the secondary\'s own edge showing all the way around it.',
    },
    {
      kind: 'paragraph',
      text: 'The three small screws around the central bolt do this. They work against each other, so loosen one a little and take up the slack on the other two, keeping the holder snug throughout. An eighth of a turn moves more than you expect.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Never back all three secondary screws off at once',
      text: 'With all three slack the mirror can swing on its own weight and land on the primary. Loosen one, take up on the others, and keep the assembly under tension the whole time.',
    },

    { kind: 'heading', text: 'Step 3. Tilt the primary until everything is concentric' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Point the tube where you will observe',
          text: 'Mirror cells sag. Collimating at the zenith and then observing at forty degrees puts the alignment back out, so set the tube near the altitude you plan to use.',
        },
        {
          title: 'Release the locks first',
          text: 'Most primary cells have three large adjusters and three locking screws. Back the locks off before turning an adjuster, or the screws bind, release suddenly, and the mirror jumps past where you wanted it.',
        },
        {
          title: 'Stack the reflections',
          text: 'Turn the adjusters until the reflected secondary, the spider vanes and the small bright dot of the cap hole are concentric inside the ring of the centre spot. With a Cheshire, the crosshair lands inside that ring.',
        },
        {
          title: 'Move in eighths of a turn',
          text: 'Turn one adjuster an eighth and look again. If the target moved further off centre, that was the wrong screw or direction. Go back and try another.',
        },
        {
          title: 'Re-snug the locks, then look again',
          text: 'Tightening the locks can shift the mirror. Nip them up gently, check once more, and correct if it moved.',
        },
      ],
    },

    { kind: 'heading', text: 'Step 4. Confirm on a star' },
    {
      kind: 'paragraph',
      text: 'A cap gets you close. The star test tells you whether you are there, because it is the only check that runs light through the whole optical path.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Let the tube cool',
          text: 'Thirty to sixty minutes outside, longer for a large mirror. A star test on a warm telescope tests the temperature, not the mirrors.',
        },
        {
          title: 'Pick a moderately bright star, high up',
          text: 'Second or third magnitude, away from the horizon. A very bright star floods the pattern and a low one sits under too much atmosphere.',
        },
        {
          title: 'Go to high power and defocus slightly',
          text: 'Roughly one and a half times the aperture in millimetres, so about 300x on a 200 mm. Rack out until you see a small disc with two or three rings and a dark central shadow.',
        },
        {
          title: 'Nudge, recentre, repeat',
          text: 'A concentric shadow inside even rings means you are done. If it is pushed to one side, turn a primary adjuster a little in the direction that moves the star toward the thin side of the rings, recentre the star with the mount, and look again. If it got worse, reverse.',
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'If the rings are boiling, stop',
      text: 'A star test needs steady seeing. When the rings will not hold still long enough to judge, you are measuring the atmosphere, and every adjustment is guesswork you will undo tomorrow.',
    },

    { kind: 'heading', text: 'Laser collimators, and when they lie' },
    {
      kind: 'paragraph',
      text: 'A laser is fast and lets you work alone at the back of the tube, but it has two failure modes a cap does not. The first is the laser itself: one that is not aligned inside its own barrel will confidently tell you the telescope is wrong. Check it by dropping it in the focuser, aiming at a wall a few metres away and rotating it slowly. A dot that traces a circle means the laser is out. The second is drawtube slop, which lets the laser tilt.',
    },
    {
      kind: 'paragraph',
      text: 'The barlowed laser method removes both. Put a Barlow between the focuser and the laser, and instead of a dot you get the shadow of the primary\'s centre spot projected on the laser\'s target face. Centre that shadow on the target hole. Reading a shadow rather than a beam makes the laser\'s own alignment and a wobbly focuser irrelevant. One limit remains: a laser sets the secondary\'s tilt but cannot tell you whether the secondary is positioned correctly under the focuser, which is where a cap or sight tube still wins.',
    },

    { kind: 'heading', text: 'How often you actually need to do this' },
    {
      kind: 'table',
      caption: 'Collimation is maintenance, not ritual. Frequency tracks how much the optics get moved.',
      columns: ['Telescope', 'How often to check'],
      rows: [
        [
          'Truss or collapsible Dobsonian',
          'Every session. The tube geometry is rebuilt each time you set up, and the check takes about a minute once familiar.',
        ],
        [
          'Solid tube Newtonian that travels by car',
          'Every session or two. Expect the primary to want a tweak and the secondary to want nothing.',
        ],
        [
          'Solid tube Newtonian kept indoors',
          'Monthly, and any time high power looks soft on a night with steady air.',
        ],
        [
          'Schmidt-Cassegrain or Maksutov',
          'Rarely, and only the secondary. Three screws on the front corrector plate, adjusted on a defocused star.',
        ],
        ['Refractor', 'Never in normal use. The lens cell is aligned at the factory and sealed.'],
      ],
    },

    {
      kind: 'takeaways',
      items: [
        'Collimation is the alignment of a reflector\'s mirrors. Its signature is asymmetry: comet shaped stars and planets smeared to one side.',
        'The order is fixed. Secondary position, then secondary tilt, then primary tilt.',
        'A collimation cap and a centre spotted primary do everything a beginner needs. A laser is faster and only as trustworthy as its own alignment.',
        'Finish on a defocused star at high power, with the tube cooled and the air steady. Concentric rings mean you are done.',
        'Truss and collapsible telescopes want a check every session. A sealed refractor never needs one.',
      ],
    },

    { kind: 'heading', text: 'Related guides' },
    {
      kind: 'list',
      items: [
        '**Aperture versus magnification**, at /learn/space-astronomy/aperture-vs-magnification. Why the headline number on a telescope box matters least, and what to compare instead.',
        '**Star hopping and finding objects**, at /learn/space-astronomy/star-hopping. Getting to a target without a GoTo mount.',
      ],
    },
  ],

  quiz: [
    {
      id: 'sp-sec12-u2-L4-Q6',
      scenario:
        'You are observing Jupiter through your Newtonian. The planet looks smeared to one side, and stars show comet-like tails instead of round discs.',
      prompt: 'What is most likely wrong?',
      options: [
        'The eyepiece is dirty',
        'The mirrors are miscollimated',
        'Jupiter is too close to Earth tonight',
        'The mount is tracking too fast',
      ],
      correctIndex: 1,
      explanation:
        'One-sided smearing and comet shaped stars are the classic signature of misalignment. Dirt and dew cut contrast but leave stars round, and tracking errors trail the whole field rather than one side of a star.',
    },
    {
      id: 'guide-telescope-collimation-Q2',
      prompt: 'Which order do you adjust a Newtonian in?',
      options: [
        'Primary tilt, then secondary tilt, then secondary position',
        'Secondary position, then secondary tilt, then primary tilt',
        'Either order, as long as you finish with a star test',
        'Primary tilt only, since the secondary is factory set',
      ],
      correctIndex: 1,
      explanation:
        'Moving the secondary changes where the primary needs to point, so any primary work done first is discarded. Work outward from the focuser and each step stays valid.',
    },
    {
      id: 'guide-telescope-collimation-Q3',
      prompt: 'How do you check that a laser collimator is itself aligned?',
      options: [
        'Compare its dot against a collimation cap',
        'Rotate it in the focuser and see whether the dot traces a circle',
        'Check that the beam reaches the primary centre spot',
        'Measure the beam width at the far end of the tube',
      ],
      correctIndex: 1,
      explanation:
        'A laser out of alignment in its own barrel sweeps a circle as you rotate it. A stationary dot means the beam runs down the barrel axis, which is the only condition under which its readings mean anything.',
    },
  ],

  nextStep: {
    unitTitle: 'Telescope Setup and Alignment',
    text: 'The Space and Astronomy course covers this in five lessons, adding mount levelling and balance, polar alignment for both hemispheres, finder and GoTo star alignment, and the thermal settling that explains most soft images people blame on collimation.',
  },
};
