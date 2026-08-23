import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `sp-sec12-u3` ("Finding Objects: Star Hopping and GoTo
 * Mounts"), lessons L1 to L5, in
 * `src/data/course/professions/space-astronomy/units/section-12-amateur.ts`.
 * Reused quiz items keep their original ids so the page and the course cannot
 * drift apart.
 *
 * Shape A per `docs/seo/search-demand.md` §4: this is a task, done outdoors,
 * usually mid attempt. The routes are northern hemisphere and say so, per §6.
 */
export const starHoppingGuide: LearnGuide = {
  slug: 'star-hopping',
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'Star Hopping: How to Find Deep Sky Objects Without GoTo',
  metaTitle: 'Star Hopping: Find Objects Without GoTo',
  metaDescription:
    'How to star hop to faint objects: field sizes, chart orientation, three worked northern hemisphere routes, and what a GoTo mount does and does not fix.',
  keywords: [
    'star hopping',
    'how to find deep sky objects',
    'finding objects with a telescope',
    'goto mount',
    'finder scope',
    'messier objects for beginners',
  ],
  updated: '2026-08-23',
  answer:
    'Star hopping means finding a faint object by starting at a bright star you can see with your eyes and walking to it through a chain of dimmer stars, one finder field at a time. You need a chart matched to what your finder actually shows, a sense of how many degrees your equipment covers, and patterns rather than single stars as landmarks. The routes below are northern hemisphere.',

  body: [
    { kind: 'heading', text: 'The method, in five steps' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Read the chart indoors first',
          text: 'Work out which bright star you will start from and what the chain looks like. Far easier at a table with the light on than crouched at an eyepiece in the dark.',
        },
        {
          title: 'Find the anchor with your eyes',
          text: 'A first or second magnitude star, or an obvious pattern like the Big Dipper or Orion\'s belt. If you cannot see the anchor from where you are standing, pick a different target tonight.',
        },
        {
          title: 'Hop through the finder, one field at a time',
          text: 'Move so a recognisable group at the edge of the field ends up at its centre. Each hop covers about one finder field and no more. Longer jumps are where people get lost.',
        },
        {
          title: 'Switch to your lowest power eyepiece',
          text: 'The finder gets you to the right couple of degrees. The low power eyepiece confirms the pattern, and usually the object is already in the field.',
        },
        {
          title: 'Verify before you increase power',
          text: 'Match at least three field stars against the chart, then reach for a shorter eyepiece. At high power a wrong field looks exactly like a right one.',
        },
      ],
    },

    { kind: 'heading', text: 'Know how much sky you are looking at' },
    {
      kind: 'paragraph',
      text: 'Almost every failed hop is a scale error rather than a navigation error. The observer moves five degrees meaning to move one, or hunts for a pattern twice the size of the field. Learn the numbers once and most of the problem goes away.',
    },
    {
      kind: 'list',
      items: [
        'At arm\'s length, your little fingernail covers about 1 degree, three middle fingers about 5, a closed fist about 10, and a spread hand about 20.',
        'A 6x30 finder shows roughly 7 degrees, a 9x50 roughly 5.5. A Telrad projects rings at 0.5, 2 and 4 degrees, which is why charts print Telrad circles over the target.',
        'Eyepiece true field equals apparent field divided by magnification. A 25 mm eyepiece with a 50 degree apparent field on a 1,200 mm telescope gives 48x and just over 1 degree.',
        'The full Moon is half a degree across and sits inside the inner Telrad ring, which surprises most people the first time they check.',
      ],
    },

    { kind: 'heading', text: 'The mistake that ruins most first attempts' },
    {
      kind: 'paragraph',
      text: 'Your telescope does not show you the chart. A Newtonian rotates the view by 180 degrees, so a printed chart works if you turn it upside down. A refractor or a Schmidt-Cassegrain used with a star diagonal gives a mirror image, correct way up but reversed left to right, and rotating the chart will never make that match. This is the commonest reason a beginner concludes star hopping does not work: a mirrored field turns every asymmetric pattern into its own reflection, and asymmetric patterns are what you navigate by.',
    },
    {
      kind: 'paragraph',
      text: 'The fixes are cheap. Use a chart app that mirrors the display to match your optical train, or fit a correct image finder, which matches a printed chart directly. Failing both, hold a paper chart up to a red torch and read it from the back.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Finding which way is west in the eyepiece',
      text: 'Turn tracking off and watch the field drift. Stars leave through the western edge. Once you know where west is, you know how to orient the chart and which way to push the tube.',
    },

    { kind: 'heading', text: 'Three hops worth learning' },
    {
      kind: 'paragraph',
      text: 'All three start from a pattern you can pick out without optical aid from an ordinary suburban garden. If you have never done this at all, warm up on M42: it is the middle point of light in Orion\'s sword, naked eye in winter, and needs no hop.',
    },

    { kind: 'heading', level: 3, text: 'M31, the Andromeda Galaxy, autumn' },
    {
      kind: 'paragraph',
      text: 'Start at the Great Square of Pegasus. Its north eastern corner star, Alpheratz, actually belongs to Andromeda, and two chains of stars run north east from it. Follow the brighter chain: Alpheratz to Delta Andromedae, about 6 degrees, then Delta to Mirach, about 7 more. Mirach is the obvious orange one and is the real landmark here.',
    },
    {
      kind: 'paragraph',
      text: 'At Mirach, turn roughly ninety degrees toward Cassiopeia. Hop about 3.5 degrees to Mu Andromedae, then about 3 more to Nu Andromedae. M31 sits around 1.5 degrees beyond Nu, in the same finder field, and a 50 mm finder under a decent sky already shows it as an elongated smudge. Cassiopeia is the rough backup: the shallower of the two V shapes in its W points about 15 degrees to the galaxy.',
    },
    {
      kind: 'paragraph',
      text: 'Expect an oval grey glow. M31 is several times the width of the full Moon and any real magnification shows only the bright core. A large telescope from a dark site adds a dust lane.',
    },

    { kind: 'heading', level: 3, text: 'M13, the Hercules cluster, summer' },
    {
      kind: 'paragraph',
      text: 'Find Vega, the brightest star high in the summer sky. West of it lies Hercules, whose useful feature is the Keystone, a lopsided quadrilateral of four medium bright stars. M13 sits on the western side of it, on the line from Eta Herculis at the north west corner down to Zeta Herculis at the south west corner, about a third of the way along. In a 50 mm finder it looks like a fuzzy star that refuses to come to focus, which is the right sign.',
    },
    {
      kind: 'paragraph',
      text: 'A 150 mm telescope at 150x starts to break the edges into individual points. A 200 mm resolves it across the face. This is the object that talks people into more aperture.',
    },

    { kind: 'heading', level: 3, text: 'M81 and M82, spring' },
    {
      kind: 'paragraph',
      text: 'Circumpolar from mid northern latitudes, so available most of the year. Take the Big Dipper\'s bowl and draw a diagonal from Phecda, the inner bottom star, through Dubhe, the outer top star and one of the two pointers. Continue the same distance again past Dubhe, roughly 10 degrees, and both galaxies land in one low power field: M81 a bright oval, M82 a thin streak beside it. Two galaxies in a single eyepiece view is rare.',
    },

    { kind: 'heading', text: 'How to tell you have actually found it' },
    {
      kind: 'list',
      items: [
        '**Match three stars, not one.** Any single star looks like any other. Three in the right relative positions is proof.',
        '**Use the nudge test.** Tap the tube. A smudge that moves with the field is real. One that stays put is inside your eye or on the eyepiece lens.',
        '**Use averted vision.** The rod cells that see faint light are absent from the centre of your retina, so look slightly to one side and the object brightens.',
        '**Expect a smudge.** Colour vision needs more light than the night sky supplies. Knowing that stops you dismissing the correct field as empty.',
        '**Protect your dark adaptation.** Twenty to thirty minutes to build, one glance at a phone screen to lose. Red light only. It is worth more than the next size of telescope and it is free.',
      ],
    },

    { kind: 'heading', text: 'GoTo, push to, and what the electronics do not fix' },
    {
      kind: 'paragraph',
      text: 'A GoTo mount slews to any of tens of thousands of catalogued objects, but only after you give it three things: your location, the correct date and time including time zone and daylight saving, and a two or three star alignment telling it how it is oriented. Get one wrong and it points confidently at the wrong patch of sky.',
    },
    {
      kind: 'paragraph',
      text: 'When a mount that was working suddenly misses everything by the same amount, the cause is mechanical: the tube was bumped or a clutch slipped. Re-align on one bright star and it comes back. A steady error from the start of the session points at the time or the coordinates instead, and on an equatorial mount a rough polar alignment degrades pointing across the whole sky.',
    },
    {
      kind: 'paragraph',
      text: 'Push to systems put encoders on a manual mount and show arrows to follow while you move the tube, for less money and no flat battery mid slew. Plate solving is the most accurate of all: it photographs the field, matches the pattern against a catalogue, and reports exactly where you are pointing. Phone apps now do it well.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'What GoTo cannot do',
      text: 'Landing on the right patch of sky still shows you only what your aperture and your sky allow. A mount that aims perfectly at a faint galaxy from a bright suburb gives you a perfectly aimed empty field, and nothing tells you which of the two failed. Star hopping tells you where you are, which is why experienced observers keep using it after buying the electronics.',
    },
    {
      kind: 'paragraph',
      text: 'The budget point is worth saying plainly. For the same money, a manual Dobsonian gives roughly twice the aperture of a GoTo telescope. If you can only have one, the aperture shows you more, and star hopping is the skill that makes it usable.',
    },

    { kind: 'heading', text: 'A note for the southern hemisphere' },
    {
      kind: 'paragraph',
      text: 'The method applies anywhere. The routes do not. The Big Dipper and Cassiopeia never rise from most of the southern hemisphere, and the sky appears rotated relative to northern charts, so any northern description of which way a pattern leans reads backwards. Use the Southern Cross and the Pointers, Alpha and Beta Centauri, as anchors, and note there is no bright pole star: extend the long axis of the Southern Cross about four and a half times its own length to reach the south celestial pole. The consolation is a better sky, with Omega Centauri, 47 Tucanae and both Magellanic Clouds visible to the naked eye from a dark site.',
    },

    {
      kind: 'takeaways',
      items: [
        'Star hopping is navigation by pattern: an anchor you can see, hops of about one finder field, then confirmation at low power.',
        'Learn your field sizes first. Most failed hops are scale errors, not navigation errors.',
        'A star diagonal mirrors the view, and rotating the chart cannot undo a reflection. Match the chart to the view before blaming your technique.',
        'Verify with three field stars, the nudge test and averted vision, and expect a grey smudge rather than a photograph.',
        'GoTo aims the telescope and nothing more. It cannot make an object brighter, and star hopping is what tells you whether it worked.',
      ],
    },

    { kind: 'heading', text: 'Related guides' },
    {
      kind: 'list',
      items: [
        '**Aperture versus magnification**, at /learn/space-astronomy/aperture-vs-magnification. What decides whether the object you just found is visible at all, and why low power finds more than high power.',
        '**How to collimate a Newtonian telescope**, at /learn/space-astronomy/telescope-collimation. If the field looks soft and the stars have tails, alignment is why, and the fix takes minutes.',
      ],
    },
  ],

  quiz: [
    {
      id: 'sp-sec12-u3-L1-Q6',
      prompt: 'Why is a low power eyepiece best for star hopping?',
      options: [
        'It makes individual stars brighter',
        'It shows a wider field, making chart patterns easier to match',
        'It removes atmospheric distortion',
        'It needs no refocusing between targets',
      ],
      correctIndex: 1,
      explanation:
        'A wide field holds enough stars at once for a pattern to be recognisable. Narrow the field and you are looking at three anonymous points that could be anywhere.',
    },
    {
      id: 'guide-star-hopping-Q2',
      prompt: 'Why can a chart never be rotated to match a view through a star diagonal?',
      options: [
        'The diagonal magnifies one axis more than the other',
        'The diagonal mirrors the image, and rotation cannot undo a reflection',
        'The diagonal turns the image upside down',
        'The diagonal narrows the field of view',
      ],
      correctIndex: 1,
      explanation:
        'A Newtonian rotates the view by 180 degrees, which rotating the chart fixes. A diagonal reflects it left to right, and no rotation turns a shape back into its own mirror image.',
    },
    {
      id: 'sp-sec12-u3-L3-Q4',
      prompt: 'Why might a GoTo mount miss its target by a noticeable amount?',
      options: [
        'The object database is too large',
        'Poor star alignment or wrong time and location settings',
        'The eyepiece magnification is too high',
        'The telescope tube is too long for the mount',
      ],
      correctIndex: 1,
      explanation:
        'The mount computes pointing from where it is, what time it is, and how it is oriented. Break any of the three and it aims precisely at the wrong place, including an hour of daylight saving entered wrongly.',
    },
  ],

  nextStep: {
    unitTitle: 'Finding Objects: Star Hopping and GoTo Mounts',
    text: 'The Space and Astronomy course covers this in five lessons, adding more classic hops, setting circles and celestial coordinates, digital push to encoders, and how experienced observers combine GoTo with hopping to check each other.',
  },
};
