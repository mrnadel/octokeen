'use client';

import type { ReactNode } from 'react';
import { useGlossary } from '@/components/lesson/GlossaryContext';
import { GlossaryTerm } from '@/components/ui/GlossaryTerm';
import { buildGlossarySegments } from '@/lib/glossary-matcher';

export function GlossaryText({ text }: { text: string }): ReactNode {
  const { matcher, sectionIndex, accentColor, activeTerm, openPopover } = useGlossary();

  if (!text) return null;
  if (!matcher) return <>{text}</>;

  const matches = matcher.findTerms(text, sectionIndex);
  if (matches.length === 0) return <>{text}</>;

  const segments = buildGlossarySegments(text, matches, (match, matchedText) => (
    <GlossaryTerm
      key={`${match.term}-${match.start}`}
      accentColor={accentColor}
      isActive={activeTerm === match.term}
      onTap={(rect) => openPopover(match, rect)}
    >
      {matchedText}
    </GlossaryTerm>
  ));

  return <>{segments}</>;
}
