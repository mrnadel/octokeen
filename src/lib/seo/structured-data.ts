import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/lib/constants';
import { TIERS } from '@/lib/pricing';

import { absoluteUrl } from './urls';

/**
 * schema.org builders.
 *
 * Every value here has to be something the app can substantiate. Ratings,
 * review counts and enrollment figures are deliberately absent: Octokeen does
 * not collect them, and inventing them is what earns a manual action.
 */
export type JsonLdNode = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org';
const ORGANIZATION_ID = `${APP_URL}/#organization`;
const WEBSITE_ID = `${APP_URL}/#website`;
const WEB_APPLICATION_ID = `${APP_URL}/#webapp`;
const CONTENT_LANGUAGE = 'en-US';

/** Raster logo. schema.org logo consumers still prefer PNG over SVG. */
const LOGO_PATH = '/logo.png';

export function buildOrganizationJsonLd(): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    logo: { '@type': 'ImageObject', url: absoluteUrl(LOGO_PATH) },
  };
}

/**
 * No `potentialAction` / `SearchAction`: the app exposes no public search
 * endpoint, and declaring one that 404s is worse than declaring none. Add it
 * here only once a real `/search?q=` route exists.
 */
export function buildWebSiteJsonLd(): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    inLanguage: CONTENT_LANGUAGE,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/**
 * The product itself. Google's software-app rich result additionally requires
 * `aggregateRating` or `review`; Octokeen collects neither, so this node is
 * valid schema that stays ineligible rather than carrying invented numbers.
 */
export function buildWebApplicationJsonLd(): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebApplication',
    '@id': WEB_APPLICATION_ID,
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: CONTENT_LANGUAGE,
    publisher: { '@id': ORGANIZATION_ID },
    offers: buildTierOffers(),
  };
}

/** Offers are read from `TIERS` so the advertised price cannot drift. */
function buildTierOffers(): JsonLdNode[] {
  return Object.values(TIERS).map(tier => ({
    '@type': 'Offer',
    name: tier.name,
    description: tier.tagline,
    price: (tier.priceMonthly / 100).toFixed(2),
    priceCurrency: 'USD',
    category: tier.priceMonthly === 0 ? 'Free' : 'Subscription',
  }));
}

export interface CourseJsonLdInput {
  name: string;
  description: string;
  /** Route path for the course hub, e.g. `/learn/psychology`. */
  path: string;
  /** Section or topic names the course covers. Omit rather than invent. */
  teaches?: string[];
}

export function buildCourseJsonLd(input: CourseJsonLdInput): JsonLdNode {
  const url = absoluteUrl(input.path);
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Course',
    '@id': `${url}#course`,
    name: input.name,
    description: input.description,
    url,
    inLanguage: CONTENT_LANGUAGE,
    provider: { '@id': ORGANIZATION_ID, '@type': 'Organization', name: APP_NAME, url: APP_URL },
    ...(input.teaches?.length ? { teaches: input.teaches } : {}),
    offers: buildTierOffers(),
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Route path. The last crumb still gets an item URL, which Google allows. */
  path: string;
}

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbItem[]): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Strips the per-node `@context`; the graph declares it once at the top. */
function withoutContext(node: JsonLdNode): JsonLdNode {
  const copy = { ...node };
  delete copy['@context'];
  return copy;
}

/** Wraps several nodes into one `@graph` so a page emits a single script tag. */
export function buildJsonLdGraph(nodes: readonly JsonLdNode[]): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': nodes.map(withoutContext),
  };
}
