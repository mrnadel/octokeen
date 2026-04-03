# Teaching Card Redesign — Variation A (Hero Mascot + Statement)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mascot-with-speech-bubble teaching card with a centered hero mascot, bold headline, one-liner, and expandable "Tell me more" section. Must work across all combinations of app theme (light/dark) and background type (none / dark bg / light bg).

**Architecture:** Add a `theme: 'dark' | 'light'` field to the background registry so backgrounds declare their luminance. LessonView passes this to TeachingCard alongside the existing `hasBackground` flag. TeachingCard uses a `useTeachingColors()` hook that resolves the right token set from 3 inputs: `isDark` (app theme), `hasBackground`, `bgTheme`. The card layout changes from horizontal mascot+bubble to centered hero mascot + big headline + one-liner + collapsible detail section.

**Tech Stack:** React 19, Framer Motion, TypeScript, Vitest

---

### Task 1: Add `theme` field to background registry

**Files:**
- Modify: `src/data/course/backgrounds/registry.ts`
- Modify: `src/data/course/backgrounds/space-stars.ts`

- [ ] **Step 1: Add `theme` to registry type and space-stars entry**

In `src/data/course/backgrounds/registry.ts`, add the `theme` field:

```ts
export const backgroundRegistry: Record<string, { name: string; category: string; theme: 'dark' | 'light' }> = {
  'space-stars': { name: 'Space Stars', category: 'Space', theme: 'dark' },
};
```

- [ ] **Step 2: Add `theme` to the space-stars background export**

In `src/data/course/backgrounds/space-stars.ts`, add `theme: 'dark'` to the exported object (line 19):

```ts
export const background = {
  name: 'Space Stars',
  category: 'Space',
  theme: 'dark' as const,
  css: `...`,
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/data/course/backgrounds/registry.ts src/data/course/backgrounds/space-stars.ts
git commit -m "feat(teaching): add theme field to background registry"
```

---

### Task 2: Thread `bgTheme` from LessonView to TeachingCard

**Files:**
- Modify: `src/components/lesson/LessonView.tsx`
- Modify: `src/components/lesson/TeachingCard.tsx` (props only — layout change is Task 4)

- [ ] **Step 1: Load bgTheme in LessonView**

In `LessonView.tsx`, add a `bgTheme` state alongside the existing `backgroundHtml`/`backgroundCss` states (~line 134):

```ts
const [backgroundHtml, setBackgroundHtml] = useState<string | null>(null);
const [backgroundCss, setBackgroundCss] = useState<string | null>(null);
const [bgTheme, setBgTheme] = useState<'dark' | 'light' | null>(null);
```

In the background-loading `useEffect` (~line 137), read `theme` from the loaded module:

```ts
useEffect(() => {
  const bgKey = lessonData?.lesson.background;
  if (!bgKey) {
    setBackgroundHtml(null);
    setBackgroundCss(null);
    setBgTheme(null);
    return;
  }
  let cancelled = false;
  import(`@/data/course/backgrounds/${bgKey}`).then((mod) => {
    if (!cancelled) {
      setBackgroundHtml(mod.background.html);
      setBackgroundCss(mod.background.css ?? null);
      setBgTheme(mod.background.theme ?? 'dark');
    }
  }).catch((err) => {
    console.warn('[LessonView] Failed to load background:', bgKey, err);
    if (!cancelled) { setBackgroundHtml(null); setBackgroundCss(null); setBgTheme(null); }
  });
  return () => { cancelled = true; };
}, [lessonData?.lesson.background]);
```

- [ ] **Step 2: Pass bgTheme to TeachingCard**

Find the `<TeachingCard` JSX (~line 814) and add the prop:

```tsx
<TeachingCard
  question={displayQuestion}
  unitColor={unitColor}
  onGotIt={handleTeachingGotIt}
  hasBackground={hasBackground}
  bgTheme={bgTheme}
/>
```

- [ ] **Step 3: Accept bgTheme in TeachingCard props**

In `TeachingCard.tsx`, update the interface:

```ts
interface TeachingCardProps {
  question: CourseQuestion;
  unitColor: string;
  onGotIt: () => void;
  hasBackground?: boolean;
  bgTheme?: 'dark' | 'light' | null;
}
```

And destructure it:

```ts
export default function TeachingCard({ question, unitColor, onGotIt, hasBackground, bgTheme }: TeachingCardProps) {
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/lesson/LessonView.tsx src/components/lesson/TeachingCard.tsx
git commit -m "feat(teaching): thread bgTheme from LessonView to TeachingCard"
```

---

### Task 3: Create `useTeachingColors` hook

**Files:**
- Create: `src/lib/teachingColors.ts`
- Create: `src/__tests__/lib/teachingColors.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/lib/teachingColors.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getTeachingColors } from '@/lib/teachingColors';

describe('getTeachingColors', () => {
  it('returns solid light tokens when no background and app is light', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: false, bgTheme: null });
    expect(c.cardBg).toBe('#FFFFFF');
    expect(c.title).toBe('#1E293B');
    expect(c.isGlass).toBe(false);
  });

  it('returns solid dark tokens when no background and app is dark', () => {
    const c = getTeachingColors({ isDark: true, hasBackground: false, bgTheme: null });
    expect(c.cardBg).toBe('#1E293B');
    expect(c.title).toBe('#F1F5F9');
    expect(c.isGlass).toBe(false);
  });

  it('returns glass + light text when background is dark', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: 'dark' });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#F1F5F9');
    expect(c.accent).toBe('#38BDF8');
  });

  it('returns glass + dark text when background is light', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: 'light' });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#1E293B');
    expect(c.accent).toBe('#0D9488');
  });

  it('defaults bgTheme to dark when hasBackground but bgTheme is null', () => {
    const c = getTeachingColors({ isDark: false, hasBackground: true, bgTheme: null });
    expect(c.isGlass).toBe(true);
    expect(c.title).toBe('#F1F5F9');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/lib/teachingColors.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement getTeachingColors**

Create `src/lib/teachingColors.ts`:

```ts
export interface TeachingColors {
  /** Whether cards should use backdrop-filter glass effect */
  isGlass: boolean;
  /** Card background (solid color or semi-transparent) */
  cardBg: string;
  /** Primary text (headline) */
  title: string;
  /** Secondary text (one-liner, detail) */
  body: string;
  /** Muted text (labels, tags) */
  muted: string;
  /** Accent color for highlights, numbers, strong text */
  accent: string;
  /** Softer accent for tags, secondary highlights */
  accentSoft: string;
  /** Card border */
  border: string;
  /** Hint background */
  hintBg: string;
  /** Hint border */
  hintBorder: string;
  /** Hint text */
  hintText: string;
  /** Expand card background (for "tell me more" detail cards) */
  expandCardBg: string;
  /** Expand card border */
  expandCardBorder: string;
}

interface TeachingColorInput {
  isDark: boolean;
  hasBackground: boolean;
  bgTheme: 'dark' | 'light' | null;
}

/** Pure function — no hooks, easily testable. */
export function getTeachingColors({ isDark, hasBackground, bgTheme }: TeachingColorInput): TeachingColors {
  // When there's a background, the background luminance determines text contrast
  // When there's no background, the app theme determines everything
  const effectiveDark = hasBackground
    ? (bgTheme ?? 'dark') === 'dark'
    : isDark;

  if (hasBackground && effectiveDark) {
    // Glass over dark background (e.g. space-stars)
    return {
      isGlass: true,
      cardBg: 'rgba(15, 23, 42, 0.6)',
      title: '#F1F5F9',
      body: '#CBD5E1',
      muted: '#64748B',
      accent: '#38BDF8',
      accentSoft: '#818CF8',
      border: 'rgba(148, 163, 184, 0.12)',
      hintBg: 'rgba(129, 140, 248, 0.08)',
      hintBorder: 'rgba(129, 140, 248, 0.15)',
      hintText: '#A78BFA',
      expandCardBg: 'rgba(15, 23, 42, 0.6)',
      expandCardBorder: 'rgba(148, 163, 184, 0.12)',
    };
  }

  if (hasBackground && !effectiveDark) {
    // Glass over light background
    return {
      isGlass: true,
      cardBg: 'rgba(255, 255, 255, 0.6)',
      title: '#1E293B',
      body: '#475569',
      muted: '#94A3B8',
      accent: '#0D9488',
      accentSoft: '#14B8A6',
      border: 'rgba(0, 0, 0, 0.08)',
      hintBg: 'rgba(254, 243, 199, 0.7)',
      hintBorder: 'rgba(253, 230, 138, 0.6)',
      hintText: '#92400E',
      expandCardBg: 'rgba(255, 255, 255, 0.6)',
      expandCardBorder: 'rgba(0, 0, 0, 0.08)',
    };
  }

  if (isDark) {
    // Solid dark (app dark mode, no background)
    return {
      isGlass: false,
      cardBg: '#1E293B',
      title: '#F1F5F9',
      body: '#CBD5E1',
      muted: '#64748B',
      accent: '#38BDF8',
      accentSoft: '#818CF8',
      border: '#334155',
      hintBg: 'rgba(181, 110, 0, 0.15)',
      hintBorder: '#92400E',
      hintText: '#F59E0B',
      expandCardBg: '#1E293B',
      expandCardBorder: '#334155',
    };
  }

  // Solid light (app light mode, no background)
  return {
    isGlass: false,
    cardBg: '#FFFFFF',
    title: '#1E293B',
    body: '#475569',
    muted: '#94A3B8',
    accent: '#0D9488',
    accentSoft: '#14B8A6',
    border: '#E2E8F0',
    hintBg: '#FEF3C7',
    hintBorder: '#FDE68A',
    hintText: '#92400E',
    expandCardBg: '#FFFFFF',
    expandCardBorder: '#E2E8F0',
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/lib/teachingColors.test.ts`
Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/teachingColors.ts src/__tests__/lib/teachingColors.test.ts
git commit -m "feat(teaching): add getTeachingColors with theme-aware token resolution"
```

---

### Task 4: Rewrite TeachingCard layout to Variation A

**Files:**
- Modify: `src/components/lesson/TeachingCard.tsx`

This is the main layout change. The new structure:

```
┌──────────────────────────┐
│      [mascot 100px]      │  ← centered, floating animation
│                          │
│   Bold Headline Text     │  ← 24px, 900 weight, centered
│                          │
│   One-liner with accent  │  ← 15px, 600 weight, centered
│                          │
│    ▾ Tell me more        │  ← expand trigger
│  ┌────────────────────┐  │
│  │ Detail card(s)     │  │  ← hidden by default, shown on tap
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 💡 Hint            │  │  ← inside expand section
│  └────────────────────┘  │
│                          │
│   ┌──────────────────┐   │
│   │     GOT IT!      │   │
│   └──────────────────┘   │
└──────────────────────────┘
```

- [ ] **Step 1: Rewrite TeachingCard.tsx**

Replace the entire content of `src/components/lesson/TeachingCard.tsx` with:

```tsx
'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import { Mascot, type MascotPose } from '@/components/ui/Mascot';
import { useLessonColors } from '@/lib/lessonColors';
import { getTeachingColors } from '@/lib/teachingColors';
import { useIsDark } from '@/store/useThemeStore';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import EngagingText from './EngagingText';

const DiagramDisplay = memo(function DiagramDisplay({ html, cardBg, border }: { html: string; cardBg: string; border: string }) {
  const sanitised = html
    .replace(/(<svg[^>]*)\sheight="auto"/gi, '$1')
    .replace(/(<svg[^>]*)\swidth="auto"/gi, '$1');
  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: 14,
        background: cardBg,
        border: `2px solid ${border}`,
        padding: 10,
        maxWidth: 400,
        margin: '0 auto',
      }}
      dangerouslySetInnerHTML={{ __html: sanitised }}
    />
  );
});

// Mascot poses to cycle through for teaching cards
const TEACHING_POSES: MascotPose[] = [
  'excited', 'thinking', 'proud', 'winking', 'laughing', 'neutral', 'explorer',
];
const SPACE_POSES: MascotPose[] = [
  'space-astronaut', 'space-flag', 'space-ufo', 'space-moon',
  'excited', 'thinking', 'explorer',
];

function getPoseForQuestion(questionId: string, useSpacePoses: boolean): MascotPose {
  const poses = useSpacePoses ? SPACE_POSES : TEACHING_POSES;
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) {
    hash = ((hash << 5) - hash + questionId.charCodeAt(i)) | 0;
  }
  return poses[Math.abs(hash) % poses.length];
}

/**
 * Split an explanation into a short one-liner (first sentence)
 * and the remaining detail text (rest).
 * Returns [oneLiner, detail] — detail may be empty string.
 */
function splitExplanation(text: string): [string, string] {
  // Find first sentence boundary (. ! ?) followed by space or end
  const match = text.match(/[.!?](?:\s|$)/);
  if (!match || match.index === undefined) return [text, ''];
  const end = match.index + 1;
  const first = text.slice(0, end).trim();
  const rest = text.slice(end).trim();
  return [first, rest];
}

interface TeachingCardProps {
  question: CourseQuestion;
  unitColor: string;
  onGotIt: () => void;
  hasBackground?: boolean;
  bgTheme?: 'dark' | 'light' | null;
}

export default function TeachingCard({ question, unitColor, onGotIt, hasBackground, bgTheme }: TeachingCardProps) {
  const isDark = useIsDark();
  const tc = getTeachingColors({
    isDark,
    hasBackground: !!hasBackground,
    bgTheme: bgTheme ?? null,
  });

  // Strip leading emoji from title
  const titleMatch = question.question.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
  const title = titleMatch ? question.question.slice(titleMatch[0].length) : question.question;

  const pose = useMemo(() => getPoseForQuestion(question.id, !!hasBackground), [question.id, hasBackground]);

  // Resolve localized explanation variant
  const [country, setCountry] = useState<string | null>(null);
  useEffect(() => {
    setCountry(localStorage.getItem(STORAGE_KEYS.COUNTRY));
  }, []);
  const displayExplanation = (country && question.variants?.[country]) || question.explanation;

  // Split explanation into one-liner + expandable detail
  const [oneLiner, detailText] = useMemo(() => splitExplanation(displayExplanation), [displayExplanation]);
  const hasExpandContent = detailText.length > 0 || !!question.hint;

  // Expand state
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = useCallback(() => setExpanded(prev => !prev), []);

  // Glass styles
  const glassProps = tc.isGlass
    ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } as const
    : {};

  return (
    <div className="flex flex-col flex-1" style={{ minHeight: '100%' }}>
      {/* Main content — centered */}
      <div
        className="flex flex-col items-center text-center flex-1 justify-center"
        style={{ padding: '20px 24px', gap: 14, maxWidth: 460, margin: '0 auto', width: '100%' }}
      >
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.05 }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: tc.isGlass
                ? `radial-gradient(circle, ${tc.accentSoft}30 0%, transparent 70%)`
                : `radial-gradient(circle, ${unitColor}18 0%, transparent 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mascot pose={pose} size={84} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: tc.title,
            lineHeight: 1.15,
            maxWidth: 300,
            margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {/* One-liner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: tc.body,
            lineHeight: 1.5,
            maxWidth: 300,
          }}
        >
          <EngagingText text={oneLiner} accentColor={tc.accent} />
        </motion.div>

        {/* Diagram if present */}
        {question.diagram && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <DiagramDisplay html={question.diagram} cardBg={tc.expandCardBg} border={tc.expandCardBorder} />
          </motion.div>
        )}
      </div>

      {/* Expand trigger + content */}
      {hasExpandContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}
        >
          <button
            onClick={toggleExpand}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 16px',
              width: '100%',
              cursor: 'pointer',
              color: tc.accentSoft,
              fontSize: 13,
              fontWeight: 700,
              background: 'none',
              border: 'none',
            }}
          >
            Tell me more
            <span
              style={{
                fontSize: 10,
                display: 'inline-block',
                transition: 'transform 0.3s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              &#9660;
            </span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', padding: '0 24px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
                  {/* Detail text */}
                  {detailText && (
                    <div
                      style={{
                        background: tc.expandCardBg,
                        border: `1.5px solid ${tc.expandCardBorder}`,
                        borderRadius: 14,
                        padding: '12px 16px',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: tc.body,
                        lineHeight: 1.5,
                        textAlign: 'left',
                        ...glassProps,
                      }}
                    >
                      <EngagingText text={detailText} accentColor={tc.accent} />
                    </div>
                  )}

                  {/* Hint */}
                  {question.hint && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        background: tc.hintBg,
                        border: `1.5px solid ${tc.hintBorder}`,
                        borderRadius: 10,
                      }}
                    >
                      <Mascot pose="thinking" size={28} className="flex-shrink-0" />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: tc.hintText, lineHeight: 1.4 }}>
                        <EngagingText text={question.hint} accentColor={tc.accent} />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Got it button */}
      <div style={{ marginTop: 'auto', padding: '16px 20px 28px' }}>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={onGotIt}
          whileTap={{ y: 4, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }}
          className="w-full"
          style={{
            padding: '15px 0',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            background: tc.isGlass ? tc.accentSoft : unitColor,
            color: '#FFFFFF',
            boxShadow: tc.isGlass
              ? `0 4px 0 color-mix(in srgb, ${tc.accentSoft} 70%, black), 0 0 20px ${tc.accentSoft}40`
              : `0 4px 0 color-mix(in srgb, ${unitColor} 70%, black)`,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Got it!
        </motion.button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/lesson/TeachingCard.tsx
git commit -m "feat(teaching): rewrite TeachingCard to Variation A hero layout"
```

---

### Task 5: Test splitExplanation logic

**Files:**
- Create: `src/__tests__/lib/splitExplanation.test.ts`
- Modify: `src/components/lesson/TeachingCard.tsx` (export the function)

- [ ] **Step 1: Export splitExplanation from TeachingCard**

At the top of TeachingCard.tsx, change the function declaration to be exported:

```ts
export function splitExplanation(text: string): [string, string] {
```

- [ ] **Step 2: Write tests**

Create `src/__tests__/lib/splitExplanation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { splitExplanation } from '@/components/lesson/TeachingCard';

describe('splitExplanation', () => {
  it('splits at first sentence boundary', () => {
    const [first, rest] = splitExplanation(
      'A force has both magnitude and direction. You need to break it into components.'
    );
    expect(first).toBe('A force has both magnitude and direction.');
    expect(rest).toBe('You need to break it into components.');
  });

  it('returns full text as one-liner when no sentence boundary', () => {
    const [first, rest] = splitExplanation('Forces are vectors');
    expect(first).toBe('Forces are vectors');
    expect(rest).toBe('');
  });

  it('handles exclamation marks as sentence boundary', () => {
    const [first, rest] = splitExplanation(
      'Welcome to space! Everything you see is part of the universe.'
    );
    expect(first).toBe('Welcome to space!');
    expect(rest).toBe('Everything you see is part of the universe.');
  });

  it('handles question marks as sentence boundary', () => {
    const [first, rest] = splitExplanation(
      'Did you know Earth spins at 1,600 km/h? That makes you a space traveler.'
    );
    expect(first).toBe('Did you know Earth spins at 1,600 km/h?');
    expect(rest).toBe('That makes you a space traveler.');
  });

  it('does not split on decimal points in numbers', () => {
    const [first, rest] = splitExplanation(
      'The value is 3.14 radians. That equals half a turn.'
    );
    // The regex finds "." after "14" but it's followed by a space — this is a known
    // edge case. Accept current behavior: splits at first period.
    expect(first).toBe('The value is 3.14 radians.');
    expect(rest).toBe('That equals half a turn.');
  });

  it('returns empty string detail for single-sentence text ending in period', () => {
    const [first, rest] = splitExplanation('A force is a vector.');
    expect(first).toBe('A force is a vector.');
    expect(rest).toBe('');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/__tests__/lib/splitExplanation.test.ts`
Expected: all 6 tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/lib/splitExplanation.test.ts src/components/lesson/TeachingCard.tsx
git commit -m "test(teaching): add tests for splitExplanation"
```

---

### Task 6: Visual smoke test and gallery entry

**Files:**
- Modify: `designs/teaching-card-variations.html` (update to show "current implementation" label)

- [ ] **Step 1: Run the dev server and test manually**

Run: `npm run dev`

Test these scenarios:
1. Open a regular lesson (no background) in light mode → should see solid white card, teal accents, centered mascot
2. Toggle dark mode → should see solid slate card, cyan accents
3. Open a space-astronomy lesson (has `space-stars` background) → should see glass card, indigo/cyan accents, starfield visible through card
4. Click "Tell me more" → should expand with detail text and hint
5. Click "Got it!" → should advance to next question

- [ ] **Step 2: Verify no regressions on question cards**

Navigate through a full lesson with mixed teaching + question types. Teaching cards use new layout, all other question types (multiple-choice, true-false, etc.) remain unchanged.

- [ ] **Step 3: Commit any fixes**

If any issues found, fix and commit with descriptive message.

---

### Task 7: Run full test suite

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: all tests pass, no regressions

- [ ] **Step 2: Final commit if any remaining changes**

```bash
git status
```

If clean, done. If changes remain, stage and commit.
