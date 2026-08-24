# Course characters

Six recurring characters, two per course. Registry: `src/components/ui/CharacterAvatar.tsx`.
Personalities: `src/data/course/professions/*/characters.ts`. Gallery: `/characters-preview.html`.

Hex values below are sampled from the shipped art (`public/characters/{id}.png`), clustered to
the colors that actually cover the figure. Use them verbatim when generating new poses.

## Shared style spec

Paste this into any image prompt so new poses match the existing set.

> Flat vector cartoon illustration, thick simplified shapes, no outlines, soft rounded
> silhouette. Oversized eyes with large white sclera and solid black pupils, thick single-stroke
> eyebrows, small simple nose, minimal mouth. Slight cel-shading: one darker tone per garment for
> folds, no gradients, no texture, no drop shadow. Flat matte colors only. Full transparent
> background, single character centered, nothing cropped at the edges. Friendly, modern
> educational-app art style.

Render targets: square-ish transparent PNG, 1024px on the long edge. Bust framing (head to
mid-torso) for reaction poses, full body for standing and walking poses.

Sheets are cut with `node scripts/crop-character-sheet.mjs <sheet.png> <characterId> <pose,pose,...>`,
which isolates each pose by alpha island so neighbouring figures never bleed into a crop.

---

## Alex — `pf-alex`

**Main color: `#0064F8` royal blue**

Personal Finance. Your Study Buddy. A 24-year-old in his first salaried job — casual, jokey,
knows he should save and keeps putting it off.

Young man, early twenties, light warm skin `#FBB277`. Messy medium-brown curly hair `#693512`
with a tuft standing up at the crown. Relaxed lidded eyes, easy half-smile. Wears an oversized
royal blue hoodie `#0064F8` with white drawstrings `#F8F8F6` and a darker blue `#0253CB` for
folds and the hood interior. Navy wide-leg jeans `#0C2C61`, navy-and-white low-top sneakers.

| role | hex |
|---|---|
| hoodie | `#0064F8` |
| hoodie shadow | `#0253CB` |
| jeans / sneakers | `#0C2C61` |
| hair | `#693512` |
| skin | `#FBB277` |
| drawstrings | `#F8F8F6` |

Existing poses: neutral, studying, walking, thinking, celebrating, listening, scrolling, confused.

## Jordan — `pf-jordan`

**Main color: `#EBEBEB` lab-coat white** (accent `#371962` deep purple)

Personal Finance. The Determined One. A 30-year-old single mom, lab tech, $38K in student loans —
careful, numbers-driven, anxious when the math doesn't work.

Woman, around thirty, light warm skin `#F9B67D`. Near-black plum hair `#191324` in a high top-knot
bun with a loose curl escaping at each temple. Large round black-framed glasses, big expressive
eyes. Wears an open white lab coat `#EBEBEB` (folds `#DFDDDF`) over a deep purple turtleneck and
wide trousers `#371962`. Brighter violet `#5728AA` for carried props — folder, tablet, notebook.
Black flat shoes.

| role | hex |
|---|---|
| lab coat | `#EBEBEB` |
| lab coat shadow | `#DFDDDF` |
| turtleneck / trousers | `#371962` |
| prop violet | `#5728AA` |
| hair | `#191324` |
| skin | `#F9B67D` |

Existing poses: neutral, celebrating, focused, idea, thinking, experiment.

## Dr. Maya — `psy-maya`

**Main color: `#0C5C20` forest green**

Psychology. The Professor. Warm but sharp, teaches through examples from her own research, asks
questions that linger.

Woman, warm brown skin `#C77245`. Voluminous dark warm-brown hair `#372221` in a large rounded
curly silhouette. Calm lidded eyes, small closed smile, white stud earrings. Wears a forest green
blazer and matching wide-leg trousers `#0C5C20` (highlight `#0F7225`) over a cream turtleneck
`#F9F2E7`. Pink flower brooch on the lapel. Carries a dark slate tablet. Dark green loafers.

| role | hex |
|---|---|
| blazer / trousers | `#0C5C20` |
| green highlight | `#0F7225` |
| hair | `#372221` |
| skin | `#C77245` |
| turtleneck | `#F9F2E7` |
| brooch | pink `#F58BA8` |

No pose art yet — one portrait only.

## Sam — `psy-sam`

**Main color: `#F95400` bright orange**

Psychology. The Curious Student. College sophomore hooked on an elective, full of "no way"
moments, connects everything to social media and gaming.

Young man, late teens, warm tan skin `#FBA865`. Dark brown curly hair `#5A2F17` under a bright
orange beanie `#F95400`. Wide open eyes, big open grin. Wears an orange hoodie `#F95400` with
white drawstrings, rust-brown trousers `#9C3606`, and black over-ear headphones `#313130` slung
around his neck. Cream high-top sneakers `#F8EAD4` with an orange stripe. Energetic, off-balance
poses — mid-hop, one leg kicked up.

| role | hex |
|---|---|
| hoodie / beanie | `#F95400` |
| trousers | `#9C3606` |
| hair | `#5A2F17` |
| skin | `#FBA865` |
| headphones | `#313130` |
| sneakers | `#F8EAD4` |

No pose art yet — one portrait only.

## Kai — `space-kai`

**Main color: `#017A71` teal**

Space. Backyard Astronomer. A 16-year-old with a new 8-inch Dobsonian — pure excitement and
impatience.

Teenage boy, golden-tan skin `#DF903C`. Spiky black hair `#1C1B1A`. Thick straight eyebrows,
wide eyes, open mouth mid-shout. Wears a teal t-shirt `#017A71` printed with a cyan planet
`#3CDEF7` inside a yellow ring `#F8C20F`, dark teal shorts `#024B48`, and teal sneakers with
white stripes `#F8F6F3`. Big kinetic poses — fist thrown up, arms out.

| role | hex |
|---|---|
| t-shirt | `#017A71` |
| shorts / sneakers | `#024B48` |
| hair | `#1C1B1A` |
| skin | `#DF903C` |
| planet graphic | `#3CDEF7` |
| planet ring | `#F8C20F` |

No pose art yet — one portrait only.

## Captain Nova — `space-nova`

**Main color: `#142F5B` navy flight suit**

Space. Astronaut Mentor. Retired, six months on the ISS. Quiet authority and genuine wonder.

Older person, silver-grey swept-back hair `#9C9A9B` with lighter highlights `#BEBCBC`, light warm
skin `#FBAF72`. Grey eyebrows, lidded confident eyes, small knowing smile. Wears a navy flight
suit `#142F5B` with a zip front, cargo pocket on the thigh, a yellow buckle on a navy belt, and
mission patches on both sleeves and the chest. Black boots `#201F22`. Composed, grounded poses —
arms crossed, hands on hips.

| role | hex |
|---|---|
| flight suit | `#142F5B` |
| suit shadow | `#0E2241` |
| hair | `#9C9A9B` |
| hair highlight | `#BEBCBC` |
| skin | `#FBAF72` |
| boots | `#201F22` |
| belt buckle | yellow `#F5C21E` |

No pose art yet — one portrait only.
