# Octokeen SVG Design Language

> Based on [Duolingo's illustration system](https://design.duolingo.com/illustration/shape-language).
> Icons that feel playful, approachable, and instantly recognizable.

---

## 0. Two systems, do not mix them

This repo draws two kinds of SVG and their rules **contradict each other**. Pick one before you draw a line.

| | **Icons** (sections 1-10) | **Characters** (section 11) |
|---|---|---|
| Outlines | 2.5px Eel `#4B4B4B` on everything | **None.** Zero strokes |
| Canvas | `0 0 64 64` | `0 64 600 496` bust |
| Shapes | ~15 | ~40 |
| Palette | Duolingo brand palette | Per-character skin/hair/clothing |
| Example | `src/components/icons/*.tsx` | `public/characters/psy-maya.svg` |

Applying icon outline rules to a character is the single fastest way to make it look wrong. Course NPCs are characters.

---

## 1. Philosophy

Borrowed directly from Duolingo:
- **Simple** — Target ~15 shapes per icon. If it has ~30, it's too complex.
- **Bold** — Thick Eel (#4B4B4B) outlines, confident shapes, no fussy detail.
- **Playful** — Rounded everything, vibrant colors, friendly proportions.
- **Flat** — No gradients. No drop shadows. No blur. Flat fills only.
- **Standalone** — Icons ARE the shape. No enclosing circles, squares, or badges. The object itself is the icon.

---

## 2. Construction: Three Shapes Only

All icons are built from **three basic shapes**:

1. **Rounded rectangle** (most common)
2. **Circle**
3. **Rounded triangle** (via paths with round joins)

You may cut and combine shapes with pathfinder operations, but **every resulting edge must remain rounded**. No pointy shapes. No sharp corners. Ever.

---

## 3. Grid & Canvas

| Property | Value |
|---|---|
| **ViewBox** | `0 0 64 64` |
| **Safe area** | 4px inset (content within 4–60) |
| **Center point** | `32, 32` |
| **Default render size** | 64×64px (scales freely) |

---

## 4. Stroke Rules

| Property | Value |
|---|---|
| **Outline stroke** | `2.5px` in Eel `#4B4B4B` |
| **Detail stroke** | `1.5px` in Eel `#4B4B4B` |
| **Stroke cap** | `round` (always) |
| **Stroke join** | `round` (always) |
| **Minimum gap** | `3px` between parallel strokes |

The Eel outline is what gives all icons the Duolingo family feel. Never omit it.

---

## 5. Color Rules

### NEVER:
- **Never use gradients** — all fills are flat solid colors
- **Never use white (#FFF) as a base fill** — use light pastels (Iguana, Sea Sponge, Canary, etc.)
- **Never use gray** — it appears lifeless. Use Anchovy #D2E4E8 or tinted neutrals instead
- **Never use colors outside the palette**

### DO:
- Use **2-3 colors max** per icon (plus Eel outline and optional white highlight)
- Be **playful and vibrant** — lean into saturated colors
- Use **white highlight spots** (small circles) sparingly for dimensionality

---

## 6. Color Palette (from Duolingo)

### Core Brand
| Name | Hex | Use |
|---|---|---|
| **Feather Green** | `#58CC02` | Primary, success, statics |
| **Mask Green** | `#89E219` | Secondary green, highlights |
| **Tree Frog** | `#58A700` | Dark green accent |

### Secondary
| Name | Hex | Use |
|---|---|---|
| **Macaw** | `#1CB0F6` | Blue, fluids, learning |
| **Cardinal** | `#FF4B4B` | Red, strength, wrong |
| **Bee** | `#FFC800` | Yellow, achievements |
| **Fox** | `#FF9600` | Orange, streak, thermo |
| **Beetle** | `#CE82FF` | Purple, dynamics, special |
| **Humpback** | `#2B70C9` | Dark blue, quests |

### Extended
| Name | Hex | Use |
|---|---|---|
| **Whale** | `#1899D6` | Mid blue |
| **Narwhal** | `#1453A3` | Deep blue |
| **Blue Jay** | `#84D8FF` | Light blue |
| **Moon Jelly** | `#7AF0F2` | Cyan/teal |
| **Turtle** | `#A5ED6E` | Light green |
| **Duck** | `#FBE56D` | Soft yellow |
| **Lion** | `#FFB100` | Warm yellow |
| **Camel** | `#E7A601` | Gold |
| **Guinea Pig** | `#CD7900` | Bronze |
| **Monkey** | `#E5A259` | Warm brown |
| **Grizzly** | `#A56644` | Dark brown |
| **Crab** | `#FF7878` | Soft red |
| **Flamingo** | `#FFB2B2` | Pink |
| **Starfish** | `#FFAADE` | Bright pink |
| **Betta** | `#9069CD` | Mid purple |
| **Butterfly** | `#6F4EA1` | Deep purple |
| **Fire Ant** | `#EA2B2B` | Dark red |

### Pastels (for light fills — NEVER use white)
| Name | Hex |
|---|---|
| **Sea Sponge** | `#D7FFB8` |
| **Canary** | `#FFF5D3` |
| **Walking Fish** | `#FFDFE0` |
| **Iguana** | `#DDF4FF` |
| **Beluga** | `#BBF2FF` |
| **Cheetah** | `#FFCE8E` |
| **Squid** | `#EBE3E3` |

### Outline
| Name | Hex | Use |
|---|---|---|
| **Eel** | `#4B4B4B` | ALL outlines and strokes |

---

## 7. Shadows

- Shadows are **pill-shaped** (rounded rectangles), placed directly **below** the object
- Shadow color: Eel `#4B4B4B` at `10-15%` opacity
- Shadow width: ~60-80% of object width
- Never use ovals (implies perspective) — always use `rx` rounded rects
- Shadow is optional for small icons

---

## 8. Animation Structure

Every icon uses **named groups** for animation targets:

```svg
<svg viewBox="0 0 64 64">
  <g data-part="shadow">    <!-- Pill shadow below object -->
  <g data-part="body">      <!-- Main shape (the icon itself) -->
  <g data-part="detail">    <!-- Inner details, accents -->
  <g data-part="highlight"> <!-- White shine spots -->
  <g data-part="badge">     <!-- Number or label (optional) -->
</svg>
```

### Pivot Points

| Part | Transform Origin | Animation |
|---|---|---|
| `shadow` | Center of shadow | Scale with body |
| `body` | Center of icon | Bounce, wiggle, spin |
| `detail` | Varies | Subtle movement |
| `highlight` | Top-left of icon | Shimmer, fade |
| `badge` | Center of badge | Pop-in, bounce |

---

## 9. Naming

```
{category}-{name}
```

Lowercase, kebab-case. Examples: `topic-statics`, `league-bronze`, `level-1`, `quest-double-up`.

---

## 10. Adding New Icons

1. Build from **rounded rectangles, circles, and rounded triangles** only
2. Pick **2-3 colors** from the palette + Eel outline
3. Keep it to **~15 shapes** maximum
4. Ensure every edge is **rounded**
5. Add a **white highlight circle** (optional, for dimensionality)
6. Group elements into `data-part` groups
7. Test at **24px, 48px, 64px, 128px**
8. Add to `public/svg-gallery.html`

---

## 11. Character Illustration

For course NPCs (Dr. Maya, Sam, Alex, Jordan, Kai). Reference implementation: `public/characters/psy-maya.svg`.

### 11.1 The rule that governs everything

**No outlines. Flat fills only.** A character is read entirely through silhouette and colour blocking. If two shapes need separating, you separate them with *tone*, never with a line. The only stroke permitted anywhere is the mouth curve, and `<path stroke-linecap="round">` used as a limb (see 11.5).

### 11.2 Shape inventory

Everything is built from four primitives. No exceptions, no hand-tuned bezier silhouettes.

1. `<circle>` — hair lobes, ears, pupils, brooch
2. `<rect rx>` — head, brows, hands, hair side-masses
3. `<ellipse>` — eye whites, eyelids
4. `<path stroke-linecap="round">` — sleeves and the mouth

If you find yourself writing a 12-node path with hand-placed control points, stop. It will not match the family.

### 11.3 Canvas and proportion

| Property | Value |
|---|---|
| ViewBox | `0 64 600 496` (bust crop) |
| Head | `rect`, roughly 170-192 wide x 180-206 tall — a squircle, not an oval. **The exact numbers are per character, see 11.14** |
| Hair width | ~1.3x head width |
| Hair height above crown | ~0.35x head height |
| Torso width | ~equal to head width, never wider |
| Head:torso | Head is deliberately oversized. Roughly 1:1 with the visible torso |

The squircle head is non-negotiable. An egg or oval face reads as generic cartoon, not this family.

### 11.4 The lidded eye

This is the highest-value detail in the whole system. It is what makes a face read as a person rather than a doll. Draw in this exact order:

```svg
<ellipse cx="262" cy="272" rx="26" ry="27" fill="#fff"/>          <!-- 1. white -->
<ellipse class="dark" cx="266" cy="266" rx="14" ry="17"/>          <!-- 2. pupil, pushed UP -->
<circle cx="259" cy="258" r="5.5" fill="#fff"/>                    <!-- 3. highlight -->
<ellipse class="skin" cx="262" cy="242" rx="33" ry="23"/>          <!-- 4. SKIN lid, crops 1-3 -->
<rect class="hair" x="-26" y="-6.5" width="52" height="13" rx="6.5"
      transform="translate(258 230) rotate(-9)"/>                  <!-- 5. brow bar -->
```

The lid is **skin-coloured and wider than the eye**, so it merges into the face and shaves the top off both the white and the pupil. The pupil sits high enough that the lid clips it. A full circular iris floating in a large white ellipse is the classic failure — it reads as googly.

### 11.5 Limbs and hands

- **Sleeves are capsules**: one `<path>` with `stroke-linecap="round"` and `stroke-width` ~42-46. Not an outlined shape. A bent arm is two capsule segments, the forearm slightly thinner than the upper arm.
- **Hands are mittens**: a single `rect rx` per hand. No fingers, no creases, no knuckle lines. Detail here always reads as scribble.
- **A bare mitten reads as a fist.** If the hand is gesturing, add one small `rect rx` thumb at ~-30 to -60 degrees off the mitten. That single shape is the difference between an open hand and a clenched one.
- **Every limb must be legible against what is behind it.** Two ways, pick one:
  1. Put the arm **outside the torso silhouette** — this is the Duolingo default and always the better answer.
  2. If it must cross the body, give it the darker tone *with real contrast*.

  A limb the same colour as the torso, drawn on top of the torso, is invisible. This is the single most common failure when building these — it has eaten an arm on three separate attempts. `#1E8449` sleeve on `#1E8449` torso vanishes; even `#17703E` was too close to read. `#145F38` works.
- With one arm forward and one back, the far limb takes the darker tone.

### 11.6 Two tones per material

Each material gets a base and exactly one darker shade, used only where a shape passes behind another:

```
skin    #C98756   skin-dk  #A96B41   (far hand, neck)
hair    #46301F   hair-dk  #3A2617   (side masses behind)
coat    #1E8449   coat-dk  #17703E   (sleeves)  coat-lt #2BA35C (lapels)
```

**Critical:** a same-coloured shape drawn inside another same-coloured shape is invisible. An arm the same green as the torso, drawn over the torso, simply vanishes. Either push it outside the silhouette or shift it to the darker tone.

### 11.7 Break the symmetry

A perfect mirror reads as a corporate icon. Every character gets:
- Head group rotated `-6°` about its centre, torso rotated `+3°` (see 11.8)
- Brows at different angles (`-9°` / `+7°`) and slightly different heights
- Nose and mouth offset a few px off centre
- Arms at different angles doing different jobs (see 11.9)

### 11.8 Torso: organic, not a bell jar

A torso built as an arch with straight sides reads as furniture. Give the silhouette three anchor points per side:

| Anchor | Behaviour |
|---|---|
| **Shoulder** | Slopes *outward and down* from the neck. Not a symmetrical dome |
| **Waist** | Pulls in ~10-15px |
| **Hem** | Flares back out, and runs off the bottom of the canvas so no hem edge is visible in the crop |

Then **counter-rotate**: torso `rotate(3)`, head `rotate(-6)`. Opposing tilts give a subtle S-curve through the figure — this is what makes it read as a body with weight rather than a stack of shapes.

### 11.9 Posing

Per [Duolingo's posing guidance](https://design.duolingo.com/illustration/characters): *"try not to use characters in a static, expressionless state, which could make them feel lifeless."* Their guide explicitly crosses out the front-facing, symmetric, arms-down stance.

Rules:
- **Never symmetric.** Both arms doing the same thing at the same angle is the crossed-out example.
- **One arm does something, the other does something else.** Gesturing + hanging. Holding + resting. Never a matched pair.
- **The pose should say what the character is.** Dr. Maya explains for a living, so she is caught mid-gesture, open hand raised.
- **Match the pose to the shape language.** Duolingo's own caveat: a character built from large blocks of colour (their gorilla) needs those blocks kept separated, so some poses simply will not work. If a pose makes two big shapes overlap into one blob, it is the wrong pose for that character.
- Bust crops constrain this. A gesture reading clearly at bust scale needs the hand **clear of the head and clear of the torso** — an arm raised close to the face reads as chin-scratching, and a forearm across the chest reads as a lump.

### 11.10 Build order

Painter's algorithm, back to front. Getting this wrong is most of the debugging:

```
backdrop → neck → torso → lapels → brooch → sleeves → hands
  → [head group: hair-back → ears → head → fringe → eyes → nose → mouth → earrings]
```

Ears go **after** the hair side-masses and **before** the head rect, so they peek out as nubs. The fringe goes **after** the head, so it overlaps the forehead.

### 11.11 Verify by rendering

Never ship a character you have only read as markup. Rasterise and look at it:

```bash
node -e "require('sharp')('public/characters/NAME.svg',{density:200}).flatten({background:'#ffffff'}).png().toFile('out.png')"
```

Check, in this order:
1. Does an arm disappear into the torso?
2. Do overlapping same-tone shapes merge into one blob?
3. Does the fringe cover the brows?
4. Does the pose read, or is it the crossed-out static stance?
5. Does a gesturing hand collide with the chin or the chest?

### 11.12 Checklist

1. Zero `stroke` attributes except mouth and sleeve capsules
2. Only circle / rect rx / ellipse / round-cap path
3. Squircle head, `rx` >= 0.35x width, with dimensions that differ from every other character
4. Skin-toned lid crops the pupil
5. Mittens, not fingers; thumb added if the hand is gesturing
6. Max two tones per material, and the darker one is genuinely darker
7. Torso has shoulder slope, waist taper, hem running off-canvas
8. Head and torso rotated in *opposite* directions
9. Arms asymmetric and doing different things; not a static front stance
10. Every limb legible — outside the silhouette, or in the contrasting tone
11. Rendered to PNG and eyeballed

### 11.13 One skeleton, six skulls

The single biggest failure mode of this system: build one face, then swap the hair and clothes onto it and call it a cast. Six characters sharing `rect x="208" y="148" width="184" height="196" rx="72"` are one character in six costumes, and it is instantly obvious.

The construction *method* is shared. The **numbers are not.** Every character gets its own skull, its own eye construction, and its own features, derived from who they are:

| Lever | Range | What it encodes |
|---|---|---|
| Head w x h | 168-192 x 180-206 | Round + wide = young. Long + narrow = older, precise. Square jaw = solid, mature |
| Head `rx` | 56-88 | High `rx` reads soft and childlike; low `rx` reads angular and adult |
| Eye white `rx` | 23-30 | Big = eager, naive. Small = focused, guarded |
| Eye spacing | 64-88 apart | Wide-set = young/open. Close-set = intense/analytical |
| **Lid `cy`** | 228-252 | **The strongest single lever.** A lid clipping only the top = wide awake. A lid covering a third of the eye = calm, knowing, or bored |
| Brow height | 210-238 | High + short = surprised, excitable. Low + long = composed |
| Nose | button / wedge / broad | Small button reads young |
| Mouth | closed curve / open grin | Open with a tooth row for the excitable ones only |

Worked example — the same recipe, opposite readings:

```
Maya  (professor, 40s)  head 184x196 rx72   eye rx26  lid cy242   closed smile
Sam   (student, 20)     head 192x194 rx88   eye rx30  lid cy230   open grin
```

Before shipping a new character, diff its head rect and lid `cy` against every existing one. If either matches, you have not designed a character yet.

### 11.14 Naming

`public/characters/{course-prefix}-{name}.svg` — e.g. `psy-maya.svg`, `pf-alex.svg`, `space-kai.svg`. Matches the existing PNG naming (`psy-maya-neutral.png`).

---

## 12. File Reference

| File | Purpose |
|---|---|
| `public/svg-gallery.html` | Living SVG gallery — view, search, copy, add icons |
| `public/characters/psy-maya.svg` | Reference character build (section 11) |
| `src/components/icons/*.tsx` | React components consumed by the app |
| `docs/svg-design-language.md` | This document |
