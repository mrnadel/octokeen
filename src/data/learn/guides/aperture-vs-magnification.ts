import { PROFESSION_ID } from '@/data/professions';

import type { LearnGuide } from '../types';

/**
 * Source material: `sp-s4-u6` ("Telescope Specs: Aperture, Focal Length,
 * Magnification"), lessons L1 to L4, in
 * `src/data/course/professions/space-astronomy/units/section-4-light.ts`.
 * The reused quiz items keep their original ids so the page and the course
 * cannot drift apart.
 *
 * Shape A per `docs/seo/search-demand.md` §4. The query behind this page is
 * usually "is this 675x telescope any good", asked by someone with a purchase
 * decision in front of them, so the answer is complete before the check.
 */
export const apertureVsMagnificationGuide: LearnGuide = {
  slug: 'aperture-vs-magnification',
  courseId: PROFESSION_ID.SPACE_ASTRONOMY,
  title: 'Aperture vs Magnification: What Actually Decides What You See',
  metaTitle: 'Aperture vs Magnification in Telescopes',
  metaDescription:
    'Aperture sets how much light and detail a telescope can deliver. Magnification only enlarges it. Why a 675x claim on a small telescope is a warning sign.',
  keywords: [
    'aperture vs magnification',
    'telescope aperture',
    'telescope magnification',
    'maximum useful magnification',
    'exit pupil',
    'buying a first telescope',
  ],
  updated: '2026-08-23',
  answer:
    'Aperture, the diameter of the main lens or mirror, decides how much light a telescope collects and how much fine detail exists in the image at all. Magnification only decides how large you make that detail, and it costs nothing to change, because it is set by whichever eyepiece you push in. A telescope sold on a headline figure like 675x is being sold on the one number that means nothing on its own.',

  body: [
    { kind: 'heading', text: 'The direct answer about the 675x telescope' },
    {
      kind: 'paragraph',
      text: 'If the box leads with a magnification figure, that is the review. Telescopes made for people who observe are sold on aperture, because aperture is expensive to increase and magnification is not. A 60 mm telescope printed with 675x will genuinely produce 675x, in the sense that the eyepiece and Barlow in the box divide into the focal length and give that number. What it shows you at 675x is a dim, shivering blur about the size of a dinner plate and roughly as informative.',
    },
    {
      kind: 'paragraph',
      text: 'The useful ceiling for a 60 mm telescope is around 120x. Everything above that is empty magnification: a bigger image containing no extra information, which is a fair working definition of blur.',
    },

    { kind: 'heading', text: 'What aperture actually buys' },
    {
      kind: 'paragraph',
      text: 'Three things, and they all improve together as the mirror or lens gets wider.',
    },
    {
      kind: 'list',
      items: [
        '**Light.** Collecting area grows with the square of the diameter, so a 130 mm mirror gathers about 4.7 times as much light as a 60 mm one, and a 250 mm gathers 25 times as much as a 50 mm. Measured against a dark adapted human eye at roughly 7 mm, a 200 mm telescope collects about 800 times more.',
        '**Resolution.** Aperture sets the finest detail that physically exists in the image. Dawes\' limit puts the smallest separation two stars can show at about 116 divided by the aperture in millimetres, in arcseconds: 1.9 for a 60 mm, 0.58 for a 200 mm. No eyepiece recovers detail below that line, because it was never collected.',
        '**Reach.** Bigger apertures show fainter things. Under a genuinely dark sky the faintest star is roughly 2 plus five times the log of the aperture in millimetres, which lands a 70 mm near magnitude 11 and a 200 mm near magnitude 13.5.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Notice that magnification is not on that list. It is not a property of the telescope at all.',
    },

    { kind: 'heading', text: 'What magnification is' },
    {
      kind: 'paragraph',
      text: 'Magnification is a ratio between two focal lengths: the telescope\'s divided by the eyepiece\'s. A 1,200 mm telescope with a 15 mm eyepiece gives 80x. Swap in a 6 mm and the same telescope gives 200x. Nothing about the instrument changed. Any telescope can be made to produce any figure you like, which is precisely why the figure tells you nothing.',
    },
    {
      kind: 'paragraph',
      text: 'Magnification also costs brightness, and this is the part most people miss. An extended object such as a nebula or a galaxy spreads across more of the field as you magnify it, and the same light spread over more area is dimmer light. Double the magnification and surface brightness drops to a quarter. Pushing the power up on a faint object makes it bigger and fainter at once, and past a point it simply sinks into the sky background and vanishes.',
    },

    { kind: 'heading', text: 'The ceiling, and the lower ceiling the sky imposes' },
    {
      kind: 'paragraph',
      text: 'Two limits apply. On most nights it is the second that bites first.',
    },
    {
      kind: 'paragraph',
      text: 'The optical limit is about 2x the aperture in millimetres, or 50x per inch. Beyond it the diffraction blur is magnified along with everything else and you gain nothing. The same limit can be read off the exit pupil, which is the aperture divided by the magnification, or equivalently the eyepiece focal length divided by the focal ratio. Below about 0.5 mm the image goes dim and mushy. Above about 5 to 7 mm, depending on how wide your pupils still open, light spills past your iris and is thrown away.',
    },
    {
      kind: 'paragraph',
      text: 'The atmospheric limit is lower and far less negotiable. On an average night, turbulence smears fine detail somewhere between 150x and 250x no matter what telescope is under it. Nights that hold 300x and more do happen, and they are the reason large apertures are worth owning, but they are not most nights. A 300 mm telescope has an optical ceiling of 600x and will almost never use half of it.',
    },
    {
      kind: 'table',
      caption:
        'Optical ceilings assume perfect air. On a typical night the atmosphere caps you nearer 150x to 250x regardless of aperture, so the bottom rows rarely reach their number.',
      columns: ['Aperture', 'Optical ceiling', 'Finest detail', 'Faintest star, dark sky'],
      rows: [
        ['60 mm', 'about 120x', '1.9 arcsec', 'magnitude 10.9'],
        ['80 mm', 'about 160x', '1.5 arcsec', 'magnitude 11.5'],
        ['130 mm', 'about 260x', '0.9 arcsec', 'magnitude 12.6'],
        ['200 mm', 'about 400x', '0.58 arcsec', 'magnitude 13.5'],
        ['300 mm', 'about 600x', '0.39 arcsec', 'magnitude 14.4'],
      ],
    },

    { kind: 'heading', text: 'Why the 675x telescope fails, in numbers' },
    {
      kind: 'paragraph',
      text: 'Take the archetype: a 60 mm refractor on a thin aluminium tripod, packed with a 4 mm eyepiece and a 3x Barlow so the box can print a large number. Three separate things go wrong at once.',
    },
    {
      kind: 'list',
      items: [
        '**The exit pupil collapses.** 60 divided by 675 is 0.09 mm. You are looking through a pinhole. The image is desperately dim and the floaters in your own eye become part of the view.',
        '**There is no detail left to enlarge.** A 60 mm objective cannot resolve below about 1.9 arcseconds. At 675x you are looking at a hugely enlarged picture of the telescope\'s own blur circle.',
        '**The target will not stay in the field.** A 50 degree eyepiece at 675x shows 4.4 arcminutes of sky. Near the celestial equator that is under 20 seconds of drift before the object leaves the view, so the session becomes an exercise in nudging the tube.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Then there is the mount. A tripod light enough to ship with a 60 mm telescope rings for several seconds after every touch, and at 675x that ring is enormous. The practical result is that the highest magnification in the box is the one setting nobody uses twice.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The honest version of the answer',
      text: 'A 60 mm telescope that stops at 120x is a genuinely pleasant instrument for the Moon, Saturn\'s rings, Jupiter\'s belts and its four bright moons. The same telescope sold as a 675x telescope is the same optic with worse eyepieces and a worse tripod. Compare the aperture, the mount, and whether the eyepieces are standard 1.25 inch fittings you can upgrade later.',
    },

    { kind: 'heading', text: 'What different apertures actually show' },
    {
      kind: 'table',
      caption:
        'Assumes a settled telescope and reasonable skies. Light pollution changes the deep sky entries far more than the planetary ones.',
      columns: ['Aperture', 'What you can realistically expect'],
      rows: [
        [
          '60 to 70 mm',
          'Craters and mountain shadows on the Moon, Saturn\'s rings clearly separated from the planet, two dark belts on Jupiter with its four bright moons, the phases of Venus, the bright core of the Orion Nebula, the larger open clusters.',
        ],
        [
          '100 to 130 mm',
          'The Cassini division in Saturn\'s rings on a steady night, the Great Red Spot as a pale notch when it faces you, dozens of Messier objects as grey smudges, the brightest globular clusters starting to look grainy rather than smooth.',
        ],
        [
          '200 mm',
          'M13 breaking into hundreds of individual stars, galaxies with recognisable shapes instead of blobs, structure inside planetary nebulae, the polar cap and dark markings on Mars near opposition.',
        ],
        [
          '300 mm and up',
          'Spiral structure in a handful of galaxies from a genuinely dark site, a faint green grey tint in the brightest nebulae, several hundred galaxies within reach.',
        ],
      ],
    },

    { kind: 'heading', text: 'The eyepieces you actually need' },
    {
      kind: 'paragraph',
      text: 'Three of them, and you choose by exit pupil rather than by magnification, because exit pupil transfers between telescopes and magnification does not. The arithmetic is one line: eyepiece focal length equals the exit pupil you want multiplied by the focal ratio.',
    },
    {
      kind: 'list',
      items: [
        '**Low power, around a 5 mm exit pupil.** Finding things, large clusters, sweeping the Milky Way. On an f/5 telescope that is a 25 mm eyepiece.',
        '**Medium power, around a 2 mm exit pupil.** Most galaxies and nebulae, and the setting you will spend the evening on. On an f/5, a 10 mm.',
        '**High power, around a 0.7 to 1 mm exit pupil.** Planets, lunar detail, splitting close double stars. On an f/5, a 4 mm or 5 mm.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A Barlow doubles that set for the price of one eyepiece and is the only accessory worth buying before a better eyepiece. Note also that the same eyepiece gives a different magnification on a different telescope, which is one more reason the magnification number was never a specification of the instrument.',
    },

    { kind: 'heading', text: 'When aperture is not the answer' },
    {
      kind: 'paragraph',
      text: 'Aperture wins the specification argument and then loses to reality in three specific cases.',
    },
    {
      kind: 'list',
      items: [
        '**Portability.** A 300 mm Dobsonian that lives in a cupboard because it takes two trips to carry loses to a 100 mm that goes outside every week. Setup time is the strongest predictor of how often a telescope actually gets used.',
        '**Light pollution.** Aperture brightens the sky glow at exactly the same rate it brightens a nebula, so a larger telescope in a bright suburb does much less for faint fuzzies than the same telescope driven half an hour out of town. The Moon, the planets and double stars barely notice light pollution at all.',
        '**Focal ratio, if you photograph.** For imaging, focal ratio sets exposure time and often matters more than raw aperture. An f/4 system needs a quarter of the exposure an f/8 system needs for the same image brightness.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A related point worth saying plainly: a solid mount is worth more than the next size of tube. A 130 mm on a stable mount beats a 150 mm that shivers, because on the first one the high power range is usable and on the second it is theoretical.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'A big aperture out of alignment is a small aperture',
      text: 'Reflectors need their mirrors aligned to deliver the resolution their aperture promises, and a miscollimated 200 mm can show less planetary detail than a well aligned 100 mm. If your scope is a Newtonian or a Dobsonian and high power looks soft, check collimation before you conclude the aperture is not enough.',
    },

    {
      kind: 'takeaways',
      items: [
        'Aperture sets light collected, detail resolved and the faintest object within reach. Magnification sets none of the three.',
        'Magnification is telescope focal length divided by eyepiece focal length. Any telescope can produce any figure, so the figure is not a specification.',
        'The optical ceiling is about 2x the aperture in millimetres. On most nights the atmosphere caps you lower, around 150x to 250x.',
        'A 675x claim on a 60 mm telescope describes a setting that is dim, blurred, and drifts out of the field in under twenty seconds.',
        'Compare aperture, mount quality and eyepiece fitting. Ignore the headline magnification completely.',
      ],
    },

    { kind: 'heading', text: 'Related guides' },
    {
      kind: 'list',
      items: [
        '**How to collimate a Newtonian telescope**, at /learn/space-astronomy/telescope-collimation. The alignment procedure that decides whether your aperture delivers the detail it should.',
        '**Star hopping and finding objects**, at /learn/space-astronomy/star-hopping. Once you have chosen the telescope, this is how you point it at something worth seeing.',
      ],
    },
  ],

  quiz: [
    {
      id: 'sp-s4-u6-L1-Q3',
      prompt: 'What improves when you increase a telescope\'s aperture?',
      options: [
        'Light gathering and resolving power both improve',
        'Only magnification improves',
        'Only the field of view gets wider',
        'The image scale increases',
      ],
      correctIndex: 0,
      explanation:
        'A wider mirror or lens collects more light and resolves finer detail, and the two rise together. Magnification and field of view are set by the eyepiece, not by the aperture.',
    },
    {
      id: 'guide-aperture-vs-magnification-Q2',
      prompt: 'A 60 mm telescope is advertised at 675x. What is its highest useful magnification?',
      options: ['About 120x', 'About 240x', 'About 675x', 'It depends on the eyepiece supplied'],
      correctIndex: 0,
      explanation:
        'The ceiling is roughly 2x the aperture in millimetres, so 120x. Above that you enlarge the telescope\'s own blur circle, and the eyepiece cannot add detail the objective never collected.',
    },
    {
      id: 'sp-s4-u6-L3-Q6',
      scenario:
        'An observer wants a wide, bright view of the Orion Nebula through a 200 mm f/5 telescope with a 1,000 mm focal length.',
      prompt: 'Which eyepiece should they use?',
      options: ['4 mm, giving 250x', '10 mm, giving 100x', '25 mm, giving 40x', '2 mm, giving 500x'],
      correctIndex: 2,
      explanation:
        'The nebula is large and diffuse, so low power keeps it inside the field and keeps the surface brightness up. At 40x the exit pupil is 5 mm, close to the most your dark adapted eye can accept.',
    },
  ],

  nextStep: {
    unitTitle: 'Telescope Specs: Aperture, Focal Length, Magnification',
    text: 'The Space and Astronomy course covers this in six lessons, working through focal ratio, exit pupil and limiting magnitude as calculations you do yourself, then reading real spec sheets and comparing named telescope models against each other.',
  },
};
