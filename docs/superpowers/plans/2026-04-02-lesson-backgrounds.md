# Lesson Backgrounds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional per-lesson background system that renders full-screen animated HTML/CSS/SVG scenes behind lesson content, with lazy loading and gallery integration.

**Architecture:** Each background is a standalone file exporting an HTML/CSS/SVG snippet. Lessons reference backgrounds by key. LessonView dynamically imports only the needed background and renders it as an absolute layer behind glass-styled cards. Gallery.html gets a new "Backgrounds" tab.

**Tech Stack:** TypeScript, React, CSS animations, dynamic `import()`, HTML/SVG

**Spec:** `docs/superpowers/specs/2026-04-02-lesson-backgrounds-design.md`

---

### Task 1: Add `background` field to Lesson type

**Files:**
- Modify: `src/data/course/types.ts:117-139`

- [ ] **Step 1: Add the optional field**

In `src/data/course/types.ts`, add `background?: string` to the `Lesson` interface after the `caseStudyTitle` field (line 138):

```typescript
  caseStudyTitle?: string;
  // Background
  background?: string;          // key into backgrounds library (e.g. 'space-stars')
}
```

- [ ] **Step 2: Verify the project compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors (existing errors if any are unrelated)

- [ ] **Step 3: Commit**

```bash
git add src/data/course/types.ts
git commit -m "feat: add optional background field to Lesson type"
```

---

### Task 2: Create background registry and first background

**Files:**
- Create: `src/data/course/backgrounds/registry.ts`
- Create: `src/data/course/backgrounds/space-stars.ts`

- [ ] **Step 1: Create the registry file**

Create `src/data/course/backgrounds/registry.ts`:

```typescript
/**
 * Lightweight manifest of available lesson backgrounds.
 * Only metadata — NO html content imported here.
 * Each key must match a file in this directory (e.g. 'space-stars' → './space-stars.ts').
 */
export const backgroundRegistry: Record<string, { name: string; category: string }> = {
  'space-stars': { name: 'Space Stars', category: 'Space' },
};
```

- [ ] **Step 2: Create the space-stars background**

Create `src/data/course/backgrounds/space-stars.ts`:

```typescript
/**
 * Space Stars — animated deep-space background for space/astronomy lessons.
 *
 * Authoring rules:
 * - Max 30 animated elements (GPU budget)
 * - CSS animations use transform/opacity only
 * - All selectors scoped under #lb-space-stars
 * - All @keyframes prefixed lb-space-stars-
 * - Must include prefers-reduced-motion media query
 */
export const background = {
  name: 'Space Stars',
  category: 'Space',
  html: `
<style>
  #lb-space-stars {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, #0B0E1A 0%, #0f1535 30%, #1a1050 60%, #0B0E1A 100%);
    overflow: hidden;
  }
  #lb-space-stars .lb-star {
    position: absolute;
    border-radius: 50%;
    will-change: opacity;
    animation: lb-space-stars-twinkle var(--d, 4s) var(--dl, 0s) infinite ease-in-out;
  }
  #lb-space-stars .lb-planet {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    animation: lb-space-stars-float var(--d, 8s) var(--dl, 0s) infinite ease-in-out;
  }
  #lb-space-stars .lb-nebula {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    animation: lb-space-stars-drift var(--d, 15s) var(--dl, 0s) infinite ease-in-out;
  }
  @keyframes lb-space-stars-twinkle {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 1; }
  }
  @keyframes lb-space-stars-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes lb-space-stars-drift {
    0% { transform: translate(0, 0); }
    50% { transform: translate(4px, -5px); }
    100% { transform: translate(0, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    #lb-space-stars * { animation: none !important; }
  }
</style>
<div id="lb-space-stars">
  <!-- Stars (18 elements) -->
  <div class="lb-star" style="top:4%;left:12%;width:3px;height:3px;background:#fff;box-shadow:0 0 6px 1px rgba(255,255,255,0.5);--d:3.5s;--dl:0s"></div>
  <div class="lb-star" style="top:8%;left:55%;width:4px;height:4px;background:#FDE68A;box-shadow:0 0 10px 2px rgba(253,230,138,0.4);--d:4.2s;--dl:1.2s"></div>
  <div class="lb-star" style="top:6%;left:82%;width:2px;height:2px;background:#E0E7FF;box-shadow:0 0 5px 1px rgba(224,231,255,0.4);--d:3.8s;--dl:0.6s"></div>
  <div class="lb-star" style="top:15%;left:28%;width:2px;height:2px;background:#fff;box-shadow:0 0 4px rgba(255,255,255,0.4);--d:5s;--dl:2.1s"></div>
  <div class="lb-star" style="top:18%;left:68%;width:3px;height:3px;background:#C4B5FD;box-shadow:0 0 7px 1px rgba(196,181,253,0.4);--d:4.5s;--dl:0.3s"></div>
  <div class="lb-star" style="top:25%;left:8%;width:2px;height:2px;background:#E0E7FF;box-shadow:0 0 5px rgba(224,231,255,0.3);--d:3.2s;--dl:1.8s"></div>
  <div class="lb-star" style="top:30%;left:92%;width:3px;height:3px;background:#fff;box-shadow:0 0 6px rgba(255,255,255,0.5);--d:4.8s;--dl:0.9s"></div>
  <div class="lb-star" style="top:38%;left:42%;width:2px;height:2px;background:#FDE68A;box-shadow:0 0 5px rgba(253,230,138,0.3);--d:5.5s;--dl:2.5s"></div>
  <div class="lb-star" style="top:42%;left:5%;width:3px;height:3px;background:#C4B5FD;box-shadow:0 0 7px rgba(196,181,253,0.4);--d:3.6s;--dl:1.4s"></div>
  <div class="lb-star" style="top:48%;left:75%;width:2px;height:2px;background:#fff;box-shadow:0 0 4px rgba(255,255,255,0.3);--d:4.1s;--dl:0.7s"></div>
  <div class="lb-star" style="top:55%;left:18%;width:3px;height:3px;background:#E0E7FF;box-shadow:0 0 6px rgba(224,231,255,0.4);--d:4.7s;--dl:2s"></div>
  <div class="lb-star" style="top:60%;left:88%;width:2px;height:2px;background:#FDE68A;box-shadow:0 0 5px rgba(253,230,138,0.3);--d:3.4s;--dl:1.1s"></div>
  <div class="lb-star" style="top:68%;left:35%;width:3px;height:3px;background:#fff;box-shadow:0 0 7px rgba(255,255,255,0.5);--d:5.2s;--dl:0.4s"></div>
  <div class="lb-star" style="top:72%;left:62%;width:2px;height:2px;background:#C4B5FD;box-shadow:0 0 5px rgba(196,181,253,0.3);--d:3.9s;--dl:1.6s"></div>
  <div class="lb-star" style="top:80%;left:48%;width:3px;height:3px;background:#E0E7FF;box-shadow:0 0 6px rgba(224,231,255,0.4);--d:4.3s;--dl:2.3s"></div>
  <div class="lb-star" style="top:85%;left:15%;width:2px;height:2px;background:#fff;box-shadow:0 0 4px rgba(255,255,255,0.3);--d:5.1s;--dl:0.8s"></div>
  <div class="lb-star" style="top:90%;left:78%;width:3px;height:3px;background:#FDE68A;box-shadow:0 0 7px rgba(253,230,138,0.4);--d:3.7s;--dl:1.9s"></div>
  <div class="lb-star" style="top:95%;left:30%;width:2px;height:2px;background:#C4B5FD;box-shadow:0 0 5px rgba(196,181,253,0.3);--d:4.6s;--dl:0.2s"></div>

  <!-- Planets (2 elements) -->
  <div class="lb-planet" style="bottom:12%;right:8%;width:45px;height:45px;background:linear-gradient(135deg,#818CF8,#4338CA);box-shadow:0 0 20px rgba(99,102,241,0.3),inset -6px -3px 10px rgba(0,0,0,0.3);--d:10s;--dl:0s"></div>
  <div class="lb-planet" style="top:20%;left:6%;width:28px;height:28px;background:linear-gradient(135deg,#F472B6,#9D174D);box-shadow:0 0 14px rgba(244,114,182,0.2),inset -4px -2px 6px rgba(0,0,0,0.3);--d:12s;--dl:3s"></div>

  <!-- Nebula glows (2 elements) -->
  <div class="lb-nebula" style="top:15%;right:-8%;width:200px;height:200px;background:radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%);--d:18s;--dl:0s"></div>
  <div class="lb-nebula" style="bottom:25%;left:-8%;width:180px;height:180px;background:radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 70%);--d:20s;--dl:5s"></div>
</div>
`,
};
```

Total animated elements: 22 (18 stars + 2 planets + 2 nebula) — within the 30 cap.

- [ ] **Step 3: Verify the project compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/data/course/backgrounds/registry.ts src/data/course/backgrounds/space-stars.ts
git commit -m "feat: add background registry and space-stars background"
```

---

### Task 3: Load and render background in LessonView

**Files:**
- Modify: `src/components/lesson/LessonView.tsx`

This is the core integration. The background loads lazily when a lesson has a `background` key, renders as an absolute layer behind content, and pauses animations when overlays are active.

- [ ] **Step 1: Add background state and lazy loading**

In `LessonView.tsx`, after the existing `useMemo` blocks for lesson data (around line 121), add state and an effect to lazily load the background:

```typescript
  // === LESSON BACKGROUND ===
  const [backgroundHtml, setBackgroundHtml] = useState<string | null>(null);

  useEffect(() => {
    // Load background for lesson-mode only (adapter mode has no backgrounds)
    const bgKey = lessonData?.lesson.background;
    if (!bgKey) {
      setBackgroundHtml(null);
      return;
    }
    let cancelled = false;
    import(`@/data/course/backgrounds/${bgKey}`).then((mod) => {
      if (!cancelled) setBackgroundHtml(mod.background.html);
    }).catch((err) => {
      console.warn('[LessonView] Failed to load background:', bgKey, err);
      if (!cancelled) setBackgroundHtml(null);
    });
    return () => { cancelled = true; };
  }, [lessonData?.lesson.background]);

  const hasBackground = backgroundHtml !== null;
  const overlayActive = showExitConfirm || showOutOfHearts;
```

- [ ] **Step 2: Add background layer to the render**

In the JSX, find the main container div (line 486):

```tsx
<div className="w-full h-full max-w-3xl flex flex-col bg-[#FAFAFA] lg:shadow-lg lg:border-x lg:border-gray-200">
```

Replace it with:

```tsx
<div
  className="w-full h-full max-w-3xl flex flex-col lg:shadow-lg lg:border-x lg:border-gray-200"
  style={{ position: 'relative', background: hasBackground ? 'transparent' : c.cardBg }}
>
  {/* Background layer */}
  {hasBackground && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{ __html: backgroundHtml! }}
    />
  )}
```

Ensure the closing `</div>{/* end centered wrapper */}` on line 984 stays unchanged.

- [ ] **Step 3: Add glass styling to the header when background is active**

Find the top bar div (line 488-495). Update its style to use glass when background is present:

```tsx
<div
  className="flex items-center flex-shrink-0 z-20"
  style={{
    padding: '10px 16px',
    gap: 12,
    borderBottom: hasBackground ? '1px solid rgba(255,255,255,0.08)' : `2px solid ${c.headerBorder}`,
    background: hasBackground ? 'rgba(255,255,255,0.06)' : c.cardBg,
    backdropFilter: hasBackground ? 'blur(8px)' : undefined,
    WebkitBackdropFilter: hasBackground ? 'blur(8px)' : undefined,
    position: 'relative',
    zIndex: 20,
  }}
>
```

- [ ] **Step 4: Add glass styling to the content area**

Find the content area div (line 706-708). Update its style:

```tsx
<div
  className="flex-1 overflow-y-auto overflow-x-hidden"
  style={{
    padding: '16px 20px 20px',
    position: 'relative',
    zIndex: 1,
  }}
>
```

- [ ] **Step 5: Add glass styling to the bottom bar (unchecked state)**

Find the bottom bar div (line 869-875). Update its style for when background is active:

```tsx
<div
  style={{
    padding: '12px 20px',
    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
    borderTop: hasBackground ? '1px solid rgba(255,255,255,0.08)' : `2px solid ${c.headerBorder}`,
    background: hasBackground ? 'rgba(15,23,42,0.75)' : c.cardBg,
    backdropFilter: hasBackground ? 'blur(8px)' : undefined,
    WebkitBackdropFilter: hasBackground ? 'blur(8px)' : undefined,
    position: 'relative',
    zIndex: 10,
  }}
>
```

- [ ] **Step 6: Add animation pause when overlays are active**

Find the background `div` you added in Step 2 and update it to pause animations:

```tsx
{hasBackground && (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      animationPlayState: overlayActive ? 'paused' : 'running',
    }}
    dangerouslySetInnerHTML={{ __html: backgroundHtml! }}
  />
)}
```

Note: `animationPlayState` on the container pauses all descendant CSS animations via inheritance.

- [ ] **Step 7: Update the outer motion.div background**

Find the `motion.div` at line 472-484. The `backgroundColor: c.bg` should be transparent when a background is active so the background layer shows through:

```tsx
style={{
  backgroundColor: hasBackground ? '#0B0E1A' : c.bg,
  paddingTop: 'env(safe-area-inset-top, 0px)',
}}
```

- [ ] **Step 8: Verify the project compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 9: Commit**

```bash
git add src/components/lesson/LessonView.tsx
git commit -m "feat: render lesson backgrounds with glass card styling"
```

---

### Task 4: Wire up a test lesson with the space-stars background

**Files:**
- Modify: one unit data file (whichever has space/astronomy lessons)

- [ ] **Step 1: Find the space/astronomy unit**

Run: `grep -rn "space\|astronomy\|Space\|Astronomy" src/data/course/units/ --include="*.ts" | head -10`

Identify which unit file contains space/astronomy lessons. If no space unit exists, pick the first lesson of unit 1 for testing.

- [ ] **Step 2: Add `background: 'space-stars'` to a lesson**

Open the unit file and add `background: 'space-stars'` to the first lesson's definition. For example:

```typescript
{
  id: 'uX-L1',
  title: '...',
  description: '...',
  icon: '...',
  xpReward: 20,
  background: 'space-stars',  // ← add this line
  questions: [ ... ]
}
```

- [ ] **Step 3: Manual test**

Run: `npm run dev`

1. Open the app in browser
2. Navigate to the lesson with the background
3. Verify: full-screen space background renders behind content
4. Verify: cards have glass styling (translucent, blurred)
5. Verify: header has glass styling
6. Verify: stars twinkle, planets float
7. Verify: opening exit confirmation pauses animations
8. Verify: closing the confirmation resumes animations
9. Navigate to a different lesson WITHOUT a background — verify it looks completely normal (no glass, normal solid cards)

- [ ] **Step 4: Commit**

```bash
git add src/data/course/units/<unit-file>.ts
git commit -m "feat: add space-stars background to first space lesson"
```

---

### Task 5: Add "Backgrounds" tab to gallery.html

**Files:**
- Modify: `gallery.html`

- [ ] **Step 1: Add the Backgrounds tab button**

In `gallery.html`, find the tab bar buttons (around line 115-121). Add a new button after "SVG Diagrams":

```html
    <button class="tab-btn" data-tab="diagrams">SVG Diagrams</button>
    <button class="tab-btn" data-tab="backgrounds">Backgrounds</button>
    <button class="tab-btn" data-tab="sounds">Sounds</button>
```

- [ ] **Step 2: Add the Backgrounds tab panel**

Find the `<div id="tab-diagrams">` section (around line 1454). Add a new tab panel after it (before `<div id="tab-badges">`):

```html
<div id="tab-backgrounds" style="display:none">
<div class="sec" id="bg-sec-space">Space</div>
<div class="fx-grid">

<div class="fx-wrap">
<div class="fx-label">space-stars</div>
<div class="fx-phone" style="background:#0B0E1A;">
  <!-- Paste the inner HTML from space-stars.ts (the content inside the <div id="lb-space-stars">) -->
  <!-- Include the <style> block too -->
</div>
</div>

</div>
</div>
```

Copy the full `html` content from `space-stars.ts` into the `.fx-phone` div. This is a one-time copy for the gallery — the gallery is a static HTML file.

- [ ] **Step 3: Register the tab in the JavaScript**

Find the `panels` object (around line 12238). Add the backgrounds panel:

```javascript
var panels = {
    screens: document.getElementById('tab-screens'),
    fx: document.getElementById('tab-fx'),
    mascots: document.getElementById('tab-mascots'),
    badges: document.getElementById('tab-badges'),
    diagrams: document.getElementById('tab-diagrams'),
    backgrounds: document.getElementById('tab-backgrounds'),
    sounds: document.getElementById('tab-sounds')
};
```

Find the `sidebarConfigs` object (around line 12249). Add backgrounds config:

```javascript
    backgrounds: [
      {label:'Space', target:'bg-sec-space'}
    ],
```

- [ ] **Step 4: Verify gallery renders**

Open `file:///D:/Work/Octokeen/gallery.html` in a browser.

1. Click the "Backgrounds" tab
2. Verify: the space-stars background appears in a phone-shaped viewport
3. Verify: stars twinkle and planets float
4. Verify: sidebar shows "Space" category

- [ ] **Step 5: Commit**

```bash
git add gallery.html
git commit -m "feat: add Backgrounds tab to gallery with space-stars preview"
```

---

### Task 6: Add glass card styling to question cards when background is active

**Files:**
- Modify: `src/components/lesson/LessonView.tsx`

The question cards themselves (QuestionCard, TeachingCard, etc.) use `useLessonColors()` for their card background. When a lesson has a background, these cards need to use glass styling instead. The cleanest approach is to pass a `hasBackground` prop or use CSS.

- [ ] **Step 1: Add hasBackground as a CSS class on the content wrapper**

In `LessonView.tsx`, find the content area `<div>` wrapping the question cards (the one updated in Task 3, Step 4). Add a className:

```tsx
<div
  className={`flex-1 overflow-y-auto overflow-x-hidden ${hasBackground ? 'lesson-has-background' : ''}`}
  style={{
    padding: '16px 20px 20px',
    position: 'relative',
    zIndex: 1,
  }}
>
```

- [ ] **Step 2: Add global CSS for glass card overrides**

In `src/app/globals.css`, add a section for lesson background glass overrides. These use the `.lesson-has-background` ancestor selector to conditionally apply glass styling to all card-like elements within the lesson:

```css
/* ─── Lesson Background Glass Overrides ─── */
.lesson-has-background .question-card,
.lesson-has-background .teaching-card {
  background: rgba(15, 23, 42, 0.75) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

Note: This depends on QuestionCard and TeachingCard having `.question-card` and `.teaching-card` class names. Check the components — if they don't have these classes, add them to the outermost wrapper div in each component.

- [ ] **Step 3: Verify question-card and teaching-card class names exist**

Check `src/components/lesson/QuestionCard.tsx` and `src/components/lesson/TeachingCard.tsx` for their outermost container class names. If they don't already have identifiable class names, add `className="question-card"` / `className="teaching-card"` to their root elements.

- [ ] **Step 4: Manual test**

Run: `npm run dev`

1. Open a lesson with `background: 'space-stars'`
2. Verify: question cards have glass/translucent styling
3. Verify: teaching cards have glass/translucent styling
4. Verify: text is still readable through the glass
5. Open a lesson WITHOUT a background — verify cards look normal (no glass)

- [ ] **Step 5: Commit**

```bash
git add src/components/lesson/LessonView.tsx src/app/globals.css src/components/lesson/QuestionCard.tsx src/components/lesson/TeachingCard.tsx
git commit -m "feat: glass card styling when lesson background is active"
```

---

### Task 7: Final verification and cleanup

**Files:** None new — verification only

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: Clean (no new errors)

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: All existing tests pass

- [ ] **Step 3: Test reduced motion**

1. In browser DevTools, enable "Prefers reduced motion" emulation
2. Open a lesson with the space-stars background
3. Verify: all animations are stopped (stars don't twinkle, planets don't float)
4. Verify: background still displays (just static)

- [ ] **Step 4: Test lesson without background**

1. Open any lesson that does NOT have a `background` field
2. Verify: zero visual difference from before this feature
3. Verify: no console errors about background loading

- [ ] **Step 5: Test adapter mode (practice sessions)**

1. Start a practice session (not a course lesson)
2. Verify: no background renders (adapter mode has no background support)
3. Verify: no console errors

- [ ] **Step 6: Verify gallery**

1. Open `file:///D:/Work/Octokeen/gallery.html`
2. Click "Backgrounds" tab
3. Verify: space-stars renders with animations in phone viewport
4. Verify: all other tabs still work correctly

- [ ] **Step 7: Verify bundle splitting**

Run: `npm run build 2>&1 | tail -30`

Check the build output — the `space-stars.ts` background should appear as a separate chunk, NOT bundled into the main lesson chunk. Look for a chunk with "space-stars" in its name or a small standalone chunk.

- [ ] **Step 8: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: lesson backgrounds final cleanup"
```
