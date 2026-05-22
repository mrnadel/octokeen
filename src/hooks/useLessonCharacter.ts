import { useState, useEffect } from 'react';
import type { CharacterLines } from '@/data/course/character-lines';

export interface UseLessonCharacterReturn {
  lessonCharacter: { id: string; name: string } | null;
  charLines: CharacterLines[] | null;
}

/**
 * Loads the character for the current lesson section and provides the raw
 * character data needed to compute teaching and celebration dialogue lines.
 *
 * Only active in lesson mode (pass undefined for sectionIndex to skip loading).
 *
 * @param sectionIndex     - The section index from the lesson unit (undefined = skip)
 * @param activeProfession - The active profession ID used to load character data
 * @param activeUnitIndex  - The active lesson unit index (used as dep to re-load on lesson change)
 */
export function useLessonCharacter(
  sectionIndex: number | undefined,
  activeProfession: string,
  activeUnitIndex: number | undefined,
): UseLessonCharacterReturn {
  const [lessonCharacter, setLessonCharacter] = useState<{ id: string; name: string } | null>(null);
  const [charLines, setCharLines] = useState<CharacterLines[] | null>(null);

  useEffect(() => {
    if (sectionIndex == null) return;
    let cancelled = false;
    (async () => {
      const { loadCharacters, loadSectionCharacterMap, loadCharacterLines, getCharacterForSection } = await import('@/lib/story-utils');
      const [characters, sectionMap, lines] = await Promise.all([
        loadCharacters(activeProfession),
        loadSectionCharacterMap(activeProfession),
        loadCharacterLines(activeProfession),
      ]);
      if (cancelled) return;
      const char = getCharacterForSection(sectionIndex, sectionMap, characters);
      if (char) {
        setLessonCharacter({ id: char.id, name: char.name });
        setCharLines(lines);
      }
    })();
    return () => { cancelled = true; };
  }, [activeUnitIndex, activeProfession, sectionIndex]);

  return { lessonCharacter, charLines };
}
