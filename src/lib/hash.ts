/**
 * FNV-1a string hashing — the single implementation used for every
 * deterministic seed in the app (quest selection, league simulation,
 * fake-user generation, avatar colours).
 */

const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

/** Hash a string to an unsigned 32-bit integer. Stable across runs. */
export function fnv1a(str: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * FNV_PRIME) >>> 0;
  }
  return hash;
}
