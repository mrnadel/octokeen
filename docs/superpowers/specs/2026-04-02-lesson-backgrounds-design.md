# Lesson Backgrounds System — Design Spec

> **Date:** 2026-04-02 | **Status:** Draft

## Overview

Add an optional per-lesson background system that renders full-screen animated scenes (HTML/CSS/SVG snippets) behind lesson content. Backgrounds are authored in a library of standalone files, loaded lazily on demand, and displayed in the gallery for easy browsing.

## Goals

- Let specific lessons have immersive full-screen animated backgrounds (e.g., space starfield for space-themed lessons)
- Zero impact on lessons without backgrounds — no visual or performance change
- Simple authoring: pick a background key, assign it to a lesson
- Lazy loading: only the active background loads, never the whole library
- Gallery integration: all backgrounds viewable in `gallery.html`

## Non-Goals

- Per-question backgrounds (backgrounds are per-lesson, not per-question)
- Programmatic/dynamic backgrounds (each background is a static authored snippet)
- Light-mode background variants (backgrounds are dark-mode native; when a lesson has a background, it renders regardless of light/dark mode — the background itself provides the dark atmosphere, and glass card styling adapts accordingly)

---

## 1. Data Model

### Lesson type change

In `src/data/course/types.ts`, add one optional field to `Lesson`:

```typescript
export interface Lesson {
  // ... existing fields ...
  background?: string  // key into background library (e.g., 'space-stars')
}
```

No database changes. Backgrounds are cosmetic, resolved at render time from static files.

### Background file shape

Each background file exports a single object:

```typescript
// src/data/course/backgrounds/space-stars.ts
export const background = {
  name: 'Space Stars',
  category: 'Space',
  html: `
    <style>
      #lb-space-stars .lb-star { ... }
      @keyframes lb-space-stars-twinkle { ... }
    </style>
    <div id="lb-space-stars">
      <!-- SVG/HTML elements -->
    </div>
  `,
}
```

---

## 2. File Structure

```
src/data/course/backgrounds/
  registry.ts              → lightweight manifest (names + categories, NO html)
  space-stars.ts           → full background snippet
  gears-mechanical.ts      → full background snippet
  (future backgrounds...)
```

### Registry (metadata only)

`registry.ts` exports a name/category map for gallery sidebar building and validation. It never imports the HTML content:

```typescript
export const backgroundRegistry: Record<string, { name: string; category: string }> = {
  'space-stars': { name: 'Space Stars', category: 'Space' },
  'gears-mechanical': { name: 'Mechanical Gears', category: 'Mechanical' },
}
```

### Lazy loading

At render time, the active background loads via dynamic import:

```typescript
const mod = await import(`@/data/course/backgrounds/${lesson.background}`)
const bg = mod.background  // { name, category, html }
```

Only the single background file for the active lesson loads. All other background files stay out of the bundle.

---

## 3. Rendering

### LessonView integration

In `LessonView.tsx`, the background renders as the first child of the lesson container — an absolute-positioned layer at z-index 0:

```tsx
<div className="lesson-container" style={{ position: 'relative', overflow: 'hidden' }}>
  {backgroundHtml && (
    <div
      className="lesson-background"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        animationPlayState: overlayActive ? 'paused' : 'running',
      }}
      dangerouslySetInnerHTML={{ __html: backgroundHtml }}
    />
  )}
  {/* existing content at zIndex 1+ */}
</div>
```

### Glass card styling (when background active)

When a background is present, cards switch to translucent glass styling:

| Element | Normal | With Background |
|---------|--------|-----------------|
| Card bg | `cardBg` (solid) | `rgba(15,23,42,0.75)` + `backdrop-filter: blur(12px)` |
| Card border | `border` (solid) | `rgba(255,255,255,0.08)` |
| Header | `#1E293B` (solid) | `rgba(255,255,255,0.06)` + `backdrop-filter: blur(8px)` |
| Footer | solid gradient | gradient from `transparent` to base bg color |

A boolean `hasBackground` flag in the component controls which style set applies. Existing `useLessonColors()` is not modified — the glass overrides are local to the background feature.

### Animation pause

When overlays are active (out-of-hearts modal, exit confirmation, interstitial ads), set `animation-play-state: paused` on the background container. This stops all CSS animations, saving GPU cycles.

Detection: the component already tracks overlay state via existing modal booleans.

---

## 4. Style Scoping

Every background's CSS must be scoped under a unique container ID to prevent collisions:

- Container ID format: `lb-{background-key}` (e.g., `#lb-space-stars`)
- All CSS selectors prefixed: `#lb-space-stars .lb-star { ... }`
- All `@keyframes` names prefixed: `@keyframes lb-space-stars-twinkle { ... }`

This prevents any style leakage between backgrounds or into the main app.

---

## 5. Performance Constraints

### Authoring rules (documented, not enforced in code)

- **Max 30 animated elements** per background — keeps GPU compositing manageable on low-end mobile
- **CSS animations only** — `transform` and `opacity` properties only (GPU-composited, no layout/paint)
- **`will-change: transform, opacity`** on animated elements
- **No JavaScript** in background snippets — pure HTML/CSS/SVG
- **`prefers-reduced-motion` media query** — every background must include:
  ```css
  @media (prefers-reduced-motion: reduce) {
    #lb-space-stars * { animation: none !important; }
  }
  ```

### Runtime guarantees

- Dynamic imports → only active background loads (0KB for lessons without backgrounds)
- React replaces `innerHTML` on lesson change → no stale DOM or style tags
- Animation pause on overlay → no wasted GPU when not visible
- No `requestAnimationFrame` or JS timers → nothing to clean up on unmount

---

## 6. Gallery Integration

Add a **"Backgrounds"** tab to `gallery.html`:

- Each background rendered inside a phone-shaped viewport (reuse the FX tab's `.fx-phone` pattern)
- Grouped by category using `<details>` blocks
- Shows background name and key underneath each preview
- Sidebar navigation built dynamically (same pattern as SVG Diagrams tab)
- All backgrounds are statically embedded in gallery.html (dev tool, no lazy loading needed)

---

## 7. First Background: `space-stars`

An animated deep-space scene:

- **Base:** dark gradient (`#0B0E1A` → `#1a1050` → `#0B0E1A`)
- **Stars:** 15-20 dots with staggered `twinkle` animation (opacity 0.3↔1, 3-6s periods, varying delays)
- **Planets:** 2 small circles with `float` animation (translateY ±6px, 8-12s)
- **Nebula glows:** 2 radial gradients with `drift` animation (subtle position shift, 15-20s)
- **Star colors:** white, `#E0E7FF` (blue-white), `#FDE68A` (warm yellow), `#C4B5FD` (purple)
- **Total animated elements:** ~22 (within the 30 cap)

---

## 8. Files Changed

| File | Change |
|------|--------|
| `src/data/course/types.ts` | Add `background?: string` to `Lesson` interface |
| `src/data/course/backgrounds/registry.ts` | New — lightweight name/category manifest |
| `src/data/course/backgrounds/space-stars.ts` | New — first background snippet |
| `src/components/lesson/LessonView.tsx` | Load background, render layer, glass card styling, animation pause |
| `gallery.html` | Add "Backgrounds" tab with phone-viewport previews |
| `src/data/course/course-meta.ts` | No change (background field won't be in metadata) |

### Not changed

- `useLessonColors.ts` — glass overrides are local to LessonView, not a global color change
- Database schema — backgrounds are cosmetic, no persistence needed
- `useCourseStore.ts` — no state changes, background is resolved at render time
- Question card components — they don't know about backgrounds, they just render on top
