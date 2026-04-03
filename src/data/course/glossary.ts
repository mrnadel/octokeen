import type { GlossaryEntry } from './types';
import { PROFESSION_ID } from '@/data/professions';

const cache = new Map<string, GlossaryEntry[]>();

/**
 * Load the glossary for a given profession.
 * Returns null for professions without a glossary (e.g., ME).
 * Caches after first load.
 */
export async function getGlossary(professionId: string): Promise<GlossaryEntry[] | null> {
  if (professionId === PROFESSION_ID.MECHANICAL_ENGINEERING) return null;

  const cached = cache.get(professionId);
  if (cached) return cached;

  let entries: GlossaryEntry[];

  switch (professionId) {
    case PROFESSION_ID.PERSONAL_FINANCE: {
      const mod = await import('./professions/personal-finance/glossary');
      entries = mod.financeGlossary;
      break;
    }
    case PROFESSION_ID.PSYCHOLOGY: {
      const mod = await import('./professions/psychology/glossary');
      entries = mod.psychologyGlossary;
      break;
    }
    case PROFESSION_ID.SPACE_ASTRONOMY: {
      const mod = await import('./professions/space-astronomy/glossary');
      entries = mod.spaceGlossary;
      break;
    }
    default:
      return null;
  }

  cache.set(professionId, entries);
  return entries;
}
