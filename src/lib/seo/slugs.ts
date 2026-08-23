/**
 * URL slug generation for public content routes.
 *
 * Slugs are part of the public URL contract: they appear in the sitemap and in
 * the `/learn` routes that read them back. Keep `slugify` deterministic and
 * pure, and treat any change to it as a URL change that needs redirects.
 */

/** Entity that can be turned into a slug. `id` only breaks ties. */
export interface Sluggable {
  id: string;
  title: string;
}

const DIACRITIC_PATTERN = /[\u0300-\u036f]/g;
const APOSTROPHE_PATTERN = /['\u2018\u2019\u02bc]/g;
/** Every dash-like character, including the em and en dashes. */
const DASH_PATTERN = /[\u2010-\u2015]/g;
const NON_SLUG_PATTERN = /[^a-z0-9]+/g;

/**
 * Converts a human title into a lowercase kebab-case slug.
 *
 * Ampersands become "and" so "Psychology & Human Behavior" reads as
 * "psychology-and-human-behavior" rather than losing the conjunction.
 * Apostrophes are dropped rather than replaced, so "Newton's" stays "newtons".
 * Returns an empty string when the input has no slug-able characters; callers
 * decide what to do with that.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(DIACRITIC_PATTERN, '')
    .replace(DASH_PATTERN, '-')
    .replace(APOSTROPHE_PATTERN, '')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .toLowerCase()
    .replace(NON_SLUG_PATTERN, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slug used when a title contains nothing slug-able. */
export function fallbackSlug(id: string): string {
  const fromId = slugify(id);
  return fromId || 'item';
}

/**
 * Assigns a unique slug to every item in a sibling group, keyed by `id`.
 *
 * Collisions are broken by appending the slugified `id` to *every* member of
 * the colliding group, never to just one. Suffixing all of them keeps the
 * result independent of array order, so inserting a new unit cannot silently
 * change the URL of an existing one.
 */
export function resolveUniqueSlugs(items: readonly Sluggable[]): Map<string, string> {
  const byBase = new Map<string, Sluggable[]>();
  for (const item of items) {
    const base = slugify(item.title) || fallbackSlug(item.id);
    const group = byBase.get(base);
    if (group) group.push(item);
    else byBase.set(base, [item]);
  }

  const resolved = new Map<string, string>();
  const taken = new Set<string>();
  for (const [base, group] of byBase) {
    for (const item of group) {
      const slug = group.length === 1 ? base : `${base}-${fallbackSlug(item.id)}`;
      resolved.set(item.id, ensureUnique(slug, taken));
    }
  }
  return resolved;
}

/** Last-resort disambiguator. Ids are unique, so this rarely fires. */
function ensureUnique(slug: string, taken: Set<string>): string {
  let candidate = slug;
  let suffix = 2;
  while (taken.has(candidate)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  taken.add(candidate);
  return candidate;
}
