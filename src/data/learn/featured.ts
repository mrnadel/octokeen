/**
 * The guides the signed-out landing page links to.
 *
 * Written as literal paths and titles rather than derived from `LEARN_GUIDES`
 * on purpose. `LandingPage` is lazily imported by `HomeApp`, which is a client
 * component, so anything this file imports can end up in a browser bundle, and
 * the guide registry carries every guide's full prose and quiz. Copying six
 * strings is the cheap side of that trade.
 *
 * Nothing here is allowed to drift: `src/__tests__/lib/learn-links.test.ts`
 * resolves every path against the live routes and asserts the label still
 * equals that guide's title, so a renamed slug or a rewritten heading fails
 * the suite rather than shipping a dead link on the strongest page on the
 * domain.
 *
 * Chosen for search demand rather than for coverage. See
 * `docs/seo/search-demand.md` §3: these are the Tier 1 topics whose SERPs a
 * new domain can realistically enter, spread across both published courses.
 */
export interface FeaturedGuideLink {
  /** Full path, e.g. `/learn/psychology/sunk-cost-fallacy`. */
  path: string;
  /** Anchor text. Always the guide's own title. */
  label: string;
}

export const FEATURED_GUIDE_LINKS: readonly FeaturedGuideLink[] = [
  {
    path: '/learn/psychology/cognitive-bias-quiz',
    label: 'Cognitive Bias Quiz: Twelve Scenarios, Twelve Biases',
  },
  {
    path: '/learn/psychology/sunk-cost-fallacy',
    label: 'The Sunk Cost Fallacy: Everyday Examples and How to Escape It',
  },
  {
    path: '/learn/psychology/confirmation-bias-examples',
    label: 'Confirmation Bias in Everyday Life: Twelve Real Examples',
  },
  {
    path: '/learn/psychology/classical-vs-operant-conditioning',
    label: 'Classical vs Operant Conditioning: How to Tell Them Apart',
  },
  {
    path: '/learn/space-astronomy/spaghettification',
    label: 'Spaghettification: What a Black Hole Would Really Do to You',
  },
  {
    path: '/learn/space-astronomy/telescope-collimation',
    label: 'How to Collimate a Newtonian Telescope',
  },
];
