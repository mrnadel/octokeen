import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `sp-sec7-u3` ("Spaghettification and Hawking Radiation"),
 * lesson L1, in
 * `src/data/course/professions/space-astronomy/units/section-7-blackholes-part1.ts`.
 * Quiz items drawn from that lesson keep their original ids so the page and the
 * course cannot drift apart. The tidal-force figures below are computed from
 * the standard Newtonian gradient 2GML/r^3 and the Schwarzschild radius
 * 2GM/c^2, which agree with general relativity closely enough at and outside
 * the horizon for every number quoted here.
 */
export const spaghettificationGuide: LearnGuide = {
  slug: 'spaghettification',
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'Spaghettification: What a Black Hole Would Really Do to You',
  metaTitle: 'Spaghettification: Why Black Hole Size Matters',
  metaDescription:
    'Spaghettification is tidal stretching, not pulling. Why a small black hole shreds you thousands of km out and a supermassive one lets you cross unharmed.',
  keywords: [
    'spaghettification',
    'what is spaghettification',
    'tidal forces black hole',
    'falling into a black hole',
    'event horizon',
    'tidal disruption event',
  ],
  updated: '2026-08-23',
  answer:
    'Spaghettification is what extreme **tidal force** does to an object falling toward a black hole: it stretches the object head to foot, squeezes it from the sides, and draws it out into a thin strand. The key point almost every popular account skips is that tidal force is not a pull. It is the **difference** in pull across an object, which means it depends on how steeply gravity changes rather than on how strong gravity is. That single fact reverses the intuition: a small black hole would shred you thousands of kilometres before you arrived, while a supermassive one would let you cross its event horizon without feeling anything at all.',

  body: [
    { kind: 'heading', text: 'The word, and the thing it names' },
    {
      kind: 'paragraph',
      text: 'Stephen Hawking popularised the term in his 1988 book A Brief History of Time, describing an unlucky astronaut stretched out like spaghetti. It sounds like a joke, and it is a real, calculable effect that working astronomers use the word for. Spaghettification is the deformation of a body sitting in a steep gravitational gradient, and you can put numbers on it.',
    },

    { kind: 'heading', text: 'Gravity does not tear you apart. A gradient does.' },
    {
      kind: 'paragraph',
      text: 'Start with the fact that makes the rest make sense: **free fall feels like nothing**. Astronauts on the International Space Station float in roughly 90 percent of the gravity you feel standing on the ground. They are not beyond Earth\'s reach; they are falling, and falling is weightless. If a black hole simply pulled very hard, falling into one would be uneventful for exactly the same reason.',
    },
    {
      kind: 'paragraph',
      text: 'What you can feel is the difference across your body. Fall feet first and your feet are closer to the mass than your head, so they sit on a steeper part of the gradient and accelerate slightly harder. Relative to your centre, your feet run ahead and your head lags behind. Your skeleton and connective tissue hold you together against that separation until they cannot. Spaghettification is that contest, lost.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'You never feel gravity, only the change in it',
      text: 'Uniform gravity is undetectable from inside a falling object. Every sensation a black hole could ever give you comes from the gradient, which is why the correct question is never "how strong is it" but "how fast does it change over two metres".',
    },
    {
      kind: 'paragraph',
      text: 'The size of that difference across a body of length L, at distance r from a mass M, is roughly 2GML divided by r cubed. The cube is the whole story. Halve your distance and the stretch grows eightfold. Gravity itself follows an inverse square, so the tide always wins the race as you close in, no matter how mild it was when you started.',
    },
    {
      kind: 'paragraph',
      text: 'You also get squeezed. Your left and right sides fall along paths that both aim at the same centre, so those paths converge and push your sides together. The compression along each sideways axis is exactly half the stretch along the fall, so the three effects cancel and your volume is preserved as you are drawn out. That is why a noodle is a good picture of the result and a balloon is a bad one.',
    },

    { kind: 'heading', text: 'Why the mass of the black hole decides everything' },
    {
      kind: 'paragraph',
      text: 'Two quantities scale in opposite directions, and the clash between them is the part worth understanding. The event horizon radius grows in direct proportion to mass, about 3 kilometres per solar mass. The tidal stretch falls off as the cube of distance. Ask what the stretch is **at the horizon** and the mass mostly cancels out, leaving a tide that scales as one over mass squared. Double the mass of a black hole and the tide at its edge drops to a quarter.',
    },
    {
      kind: 'paragraph',
      text: 'So bigger black holes are gentler at the boundary, not fiercer. Here is what that looks like for a two metre human, falling feet first.',
    },
    {
      kind: 'table',
      caption: 'Head to foot stretch measured at the event horizon',
      columns: ['Black hole', 'Horizon radius', 'Stretch at the horizon', 'What happens to you'],
      rows: [
        [
          'Stellar mass, 10 suns',
          '30 km',
          'about 21 million g',
          'Torn apart thousands of kilometres before you arrive',
        ],
        [
          'Intermediate, 50,000 suns',
          '150,000 km',
          'about 1 g',
          'Roughly the tug of hanging from a bar. You cross intact',
        ],
        [
          'Sagittarius A*, 4.3 million suns',
          '12.7 million km',
          'about 0.0001 g',
          'Below the threshold of feeling. You cross unaware',
        ],
        [
          'M87*, 6.5 billion suns',
          '19 billion km, about 128 AU',
          'about 5 x 10^-11 g',
          'Undetectable by any instrument you could carry',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'Popular explanations usually say that spaghettification is what happens when you cross the event horizon, and that the more monstrous the black hole the worse it is. Both halves of that are wrong, and they are wrong in the same way: they treat the horizon as the dangerous place and mass as the danger, when the only thing that matters is the steepness of the gradient where you happen to be.',
    },

    { kind: 'heading', text: 'What a stellar mass black hole actually does to you' },
    {
      kind: 'paragraph',
      text: 'Take the 10 solar mass case, the kind formed by a collapsing massive star. Its horizon is a sphere 30 kilometres in radius, smaller than most cities. Here is the ladder on the way down, with the stretch measured head to foot.',
    },
    {
      kind: 'list',
      items: [
        '**8,000 km out.** The stretch reaches 1 g. It feels like someone gently pulling your ankles while you hang by your hands.',
        '**3,800 km out.** 10 g. Past what any human tolerates, and past what a spacesuit or a spacecraft frame is designed for.',
        '**Around 2,000 km out.** Connective tissue gives way and a person comes apart. That is roughly 65 horizon radii from the black hole, with nothing visible in front of you.',
        '**800 km out.** 1,000 g. Whatever remains is being drawn into a stream.',
        '**30 km, the horizon itself.** About 21 million g across two metres. Molecules do not survive a gradient like that, and atoms are next.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Notice what is missing from that list: any event at the horizon. Nothing marks it. By the time the stream of material that used to be you reaches the boundary, the interesting physics has been over for a while. The fall from 2,000 kilometres to the horizon takes under a tenth of a second.',
    },

    { kind: 'heading', text: 'Crossing a supermassive horizon without noticing' },
    {
      kind: 'paragraph',
      text: 'Now the opposite case. Sagittarius A*, the black hole at the centre of our galaxy, holds about 4.3 million solar masses. Its horizon radius is 12.7 million kilometres, roughly 18 times the radius of the Sun. Because that boundary sits so far from the centre, the gradient there is nearly flat: about a ten thousandth of a g spread across your whole body. You would not feel it. There is no wall, no flash, no jolt, and no local instrument reading that changes.',
    },
    {
      kind: 'paragraph',
      text: 'The horizon is a one way surface, defined by where light can no longer escape outward, and locally it looks exactly like empty space. What you would lose at that moment is every future in which you come back out. The clock is short and set entirely by mass: from the horizon, the longest possible remaining lifetime is about 66 seconds at Sagittarius A*, and about 28 hours at M87*.',
    },
    {
      kind: 'paragraph',
      text: 'Spaghettification still arrives. It just arrives later, out of sight, and all at once. During that final minute the tidal gradient climbs from imperceptible to unbounded, and the last part of the journey looks a great deal like the stellar mass case, compressed into the closing instants.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Crossing comfortably is not surviving',
      text: 'A painless horizon crossing is a fact about the gradient, not a loophole. Every path inside leads inward. The difference between the two cases is only where along the fall you are destroyed, not whether.',
    },

    { kind: 'heading', text: 'We have actually watched this happen' },
    {
      kind: 'paragraph',
      text: 'Spaghettification is not confined to thought experiments about astronauts. Stars get it too, and the events are bright enough to see across hundreds of millions of light years. A **tidal disruption event** is what astronomers call it when a star wanders close enough to a supermassive black hole that the gradient across the star exceeds the star\'s own self gravity.',
    },
    {
      kind: 'paragraph',
      text: 'The size logic repeats at stellar scale. A sun like star is pulled apart at roughly its own radius multiplied by the cube root of the mass ratio, which for a million solar mass black hole works out to about 70 million kilometres. That is around 24 times the horizon radius of the same black hole, so the shredding happens far outside, in plain view.',
    },
    {
      kind: 'paragraph',
      text: 'AT2019qiz, found in 2019 in a galaxy about 215 million light years away, was caught early enough to follow the whole sequence. Roughly half the star\'s mass was flung clear of the system entirely and the other half fell back, settling into a hot disc that flared for months. That flare is what telescopes record. The star was, quite literally, spaghettified.',
    },
    {
      kind: 'paragraph',
      text: 'The same rule cuts the other way at the top end. Above about 100 million solar masses, the distance at which a sun like star would be disrupted lies **inside** the event horizon, so the star is swallowed whole and produces no flare at all. Astronomers call that cutoff the Hills mass, and it is a direct consequence of horizon radius growing faster than tidal reach.',
    },

    { kind: 'heading', text: 'Three claims to be careful with' },
    {
      kind: 'table',
      columns: ['Common claim', 'What is actually true'],
      rows: [
        [
          'Spaghettification happens when you cross the event horizon',
          'It depends entirely on mass. For a 10 solar mass black hole it is finished thousands of kilometres earlier. For Sagittarius A* it has not started.',
        ],
        [
          'The bigger the black hole, the worse the stretching',
          'At the horizon, tidal stretch scales as one over mass squared. The most massive black holes are the gentlest place to cross.',
        ],
        [
          'A black hole pulls you apart',
          'A uniform pull would be undetectable. Only the difference in pull across your body does anything, which is why the effect is called a tidal force in the first place.',
        ],
        [
          'You are stretched into a line',
          'You are stretched along one axis and compressed along the other two, by exactly half as much each. Volume is conserved on the way down.',
        ],
      ],
    },

    {
      kind: 'takeaways',
      items: [
        'Spaghettification is caused by a gradient in gravity, not by gravity itself. In free fall, uniform gravity is undetectable.',
        'The stretch across a body scales as one over distance cubed, so it grows eight times for every halving of distance.',
        'At the event horizon the tide scales as one over mass squared. Small black holes are lethal far outside the horizon; supermassive ones are imperceptible at it.',
        'Falling into a 10 solar mass black hole, a person is torn apart around 2,000 km out, roughly 65 horizon radii before arriving.',
        'Tidal disruption events such as AT2019qiz are spaghettification observed directly, with about half the star ejected and half falling back as a months long flare.',
      ],
    },
  ],

  quiz: [
    {
      id: 'guide-spaghettification-Q1',
      prompt: 'You fall feet first toward a black hole. What actually pulls you apart?',
      options: [
        'The black hole\'s gravity acting on your body as a whole',
        'The difference in gravitational pull between your feet and your head',
        'The enormous speed you build up on the way down',
        'Friction against gas swirling around the black hole',
      ],
      correctIndex: 1,
      explanation:
        'Uniform gravity is undetectable in free fall, which is why astronauts float. Only the difference across your body does anything, and that difference is what the word tidal means.',
    },
    {
      id: 'sp-sec7-u3-L1-Q2',
      prompt: 'Why are tidal forces strongest near small black holes?',
      options: [
        'Small black holes spin faster',
        'Small black holes have stronger magnetism',
        'Small black holes are hotter',
        'The gravity gradient changes over a shorter distance',
      ],
      correctIndex: 3,
      explanation:
        'A small black hole packs its horizon in close to the centre, so you can reach a region where gravity changes very steeply over a couple of metres. A supermassive black hole keeps its horizon so far out that the gradient there is almost flat.',
    },
    {
      id: 'sp-sec7-u3-L1-Q4',
      prompt: 'Near which type of black hole would spaghettification happen before you reach the event horizon?',
      options: [
        'Stellar-mass black holes',
        'Only supermassive black holes',
        'Only intermediate black holes',
        'No black holes cause spaghettification',
      ],
      correctIndex: 0,
      explanation:
        'For a 10 solar mass black hole the stretch is already fatal thousands of kilometres out, against a horizon only 30 km in radius. Supermassive black holes have gradients at their horizons too gentle to feel.',
    },
    {
      id: 'guide-spaghettification-Q2',
      scenario:
        'An astronaut falls through the event horizon of Sagittarius A*, the 4.3 million solar mass black hole at the centre of the Milky Way, and reports feeling nothing unusual at the crossing.',
      prompt: 'Why is that report physically correct?',
      options: [
        'Supermassive black holes have weaker gravity than stellar ones',
        'The horizon is so far from the centre that the gravity gradient there is nearly flat',
        'The event horizon shields anything inside it from tidal forces',
        'Nothing can be felt once you are moving at close to light speed',
      ],
      correctIndex: 1,
      explanation:
        'Horizon radius grows in proportion to mass while tidal stretch falls off as distance cubed, so the tide at the horizon scales as one over mass squared. At Sagittarius A* that comes to roughly a ten thousandth of a g. Spaghettification still arrives, but much later and inside.',
    },
    {
      id: 'sp-sec7-u3-L1-Q6',
      scenario:
        'Scientists send a small probe toward a stellar black hole of 10 solar masses. The probe is about 1 meter long and approaching the event horizon.',
      prompt: 'What happens to the probe?',
      options: [
        'It orbits the black hole safely',
        'It is stretched into a thin strand before reaching the event horizon',
        'It passes through the event horizon intact',
        'It bounces off the event horizon',
      ],
      correctIndex: 1,
      explanation:
        'A 10 solar mass black hole has a horizon radius of only about 30 km, so the tidal gradient reaches structural failure levels while the probe is still hundreds or thousands of kilometres away.',
    },
  ],

  related: [
    {
      slug: 'how-rockets-work-in-a-vacuum',
      reason:
        'The other place everyday intuition about force in space gives the wrong answer, and the momentum argument that fixes it.',
    },
  ],

  nextStep: {
    unitTitle: 'Spaghettification and Hawking Radiation',
    text: 'The Space and Astronomy course follows this unit with Hawking radiation, black hole evaporation and the information paradox, so you see what happens to the material after it goes in as well as on the way down.',
  },
};
