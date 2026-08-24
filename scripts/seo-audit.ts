/**
 * SEO Audit Harness
 *
 * Crawls every URL in a site's `sitemap.xml` and checks the objectively
 * testable SEO properties of each one. Runs against any origin:
 *
 *   npx tsx scripts/seo-audit.ts                          audits https://octokeen.com
 *   npx tsx scripts/seo-audit.ts http://localhost:3000    audits a local build
 *   npx tsx scripts/seo-audit.ts <base> --no-metrics      skips the throttled Core Web Vitals pass
 *   npx tsx scripts/seo-audit.ts <base> --no-render       also skips the hydrated-DOM link pass
 *   npx tsx scripts/seo-audit.ts <base> --json out.json   also writes machine-readable findings
 *
 * Two fetch paths, deliberately:
 *
 * 1. Raw HTTP with `redirect: 'manual'`, parsed through `DOMParser` inside a
 *    blank browser tab. `DOMParser` never executes scripts and never loads
 *    subresources, so what this pass sees is exactly what a crawler that does
 *    not render JavaScript sees. (jsdom is in devDependencies but ships no
 *    type declarations, and adding `@types/jsdom` is out of scope here.)
 * 2. A real Chromium page under mobile emulation with Lighthouse's mobile
 *    throttling, for LCP / CLS / TBT and render-blocking analysis.
 *
 * Every finding carries a severity that says how much weight to give it:
 *
 *   defect         Verifiably wrong. Contradicts the site's own output, breaks
 *                  a documented Google requirement, or breaks a web standard.
 *   best-practice  A widely held convention with no documented Google rule
 *                  behind it. Worth fixing; not a ranking factor on its own.
 *   preference     A judgement call. Listed so it is visible, not to be fixed
 *                  reflexively.
 *   info           Measured fact that needs a human decision.
 *
 * Where a numeric threshold is used, its source is named in a comment. Nothing
 * here invents a number and calls it a Google requirement.
 *
 * The run ends with a score out of 100 computed from `CHECK_REGISTRY`. See the
 * "Scoring" section below for the model and the three anti-gaming guards.
 *
 * Deviates from the 150-line cap in `docs/rules/code.md`, as
 * `scripts/seo-index-audit.ts` already does: a single-file CLI is the unit of
 * delivery for a script that is run, not imported.
 */

import * as fs from 'fs';
import * as path from 'path';

import { chromium, devices, type Browser, type Page } from '@playwright/test';

// ─── Configuration ─────────────────────────────────────────

const DEFAULT_BASE_URL = 'https://octokeen.com';

/**
 * `src/lib/seo/constants.ts` sets these. The audit reads the site's own
 * budgets rather than a generic industry number so a length finding always
 * means "the site broke its own rule", which is actionable.
 */
const TITLE_MAX_CHARS = 60;
const DESCRIPTION_MAX_CHARS = 155;

/**
 * Google publishes no minimum description length. 120 is the low end of the
 * range Google's own SERP snippets occupy; below it the snippet is usually
 * rewritten. Reported as best-practice, never as a requirement.
 */
const DESCRIPTION_MIN_CHARS = 120;

/**
 * No Google minimum for word count exists either. 300 is the floor the project
 * already chose in `src/lib/seo/indexable.ts` (MIN_PAGE_WORDS), so the audit
 * holds published pages to the same bar the codebase set for itself.
 */
const MIN_PAGE_WORDS = 300;

/** Jaccard similarity over 5-word shingles above which two pages are near-duplicates. */
const NEAR_DUPLICATE_THRESHOLD = 0.6;
const SHINGLE_SIZE = 5;

/**
 * A practical transfer budget, not a Google rule. Images above this dominate
 * LCP on a throttled mobile connection.
 */
const LARGE_IMAGE_BYTES = 200 * 1024;

/** web.dev "good" thresholds for the Core Web Vitals, 75th percentile of field data. */
const LCP_GOOD_MS = 2500;
const LCP_POOR_MS = 4000;
const CLS_GOOD = 0.1;
const CLS_POOR = 0.25;
/** TBT is a lab metric with no field threshold; 200ms is Lighthouse's "good" band. */
const TBT_GOOD_MS = 200;
const TBT_POOR_MS = 600;

/** Lighthouse mobile throttling: 4x CPU slowdown over a Slow 4G link. */
const CPU_THROTTLE_RATE = 4;
const NETWORK_DOWNLOAD_BPS = (1.6 * 1024 * 1024) / 8;
const NETWORK_UPLOAD_BPS = (750 * 1024) / 8;
const NETWORK_LATENCY_MS = 150;

const REQUEST_CONCURRENCY = 6;
const METRIC_SETTLE_MS = 5000;
const RENDER_SETTLE_MS = 2500;
const CRAWL_MAX_DEPTH = 4;

const USER_AGENT =
  'Mozilla/5.0 (compatible; OctokeenSeoAudit/1.0; +https://octokeen.com) Chrome/120 Safari/537.36';

// ─── Types ─────────────────────────────────────────────────

type Severity = 'defect' | 'best-practice' | 'preference' | 'info';

interface Finding {
  severity: Severity;
  /** Stable short code, so a fix can be tracked against it. */
  code: string;
  url: string;
  message: string;
  /** Repo path a fix would touch. Empty when the audit cannot attribute it. */
  file?: string;
}

interface HttpResult {
  finalUrl: string;
  status: number;
  /** Every hop before the final response, in order. */
  redirects: { from: string; to: string; status: number }[];
  headers: Record<string, string>;
  body: string;
  error?: string;
}

interface HeadingNode {
  level: number;
  text: string;
}

interface LinkNode {
  href: string;
  rel: string;
  text: string;
}

interface ImageNode {
  src: string;
  alt: string | null;
  width: string | null;
  height: string | null;
  loading: string | null;
  fetchpriority: string | null;
}

interface PageFacts {
  titles: string[];
  descriptions: string[];
  canonicals: string[];
  robotsMeta: string | null;
  lang: string | null;
  charset: string | null;
  viewport: string | null;
  headings: HeadingNode[];
  h1s: string[];
  bodyText: string;
  wordCount: number;
  og: Record<string, string>;
  twitter: Record<string, string>;
  jsonLd: string[];
  links: LinkNode[];
  images: ImageNode[];
  syncScripts: string[];
  headStylesheets: string[];
  hreflang: { lang: string; href: string }[];
}

interface PageMetrics {
  url: string;
  lcpMs: number;
  lcpElement: string;
  clsScore: number;
  clsSources: string[];
  tbtMs: number;
  longTaskCount: number;
  fcpMs: number;
  renderBlocking: string[];
  transferBytes: number;
  error?: string;
}

interface AuditedPage {
  url: string;
  http: HttpResult;
  facts: PageFacts | null;
}

// ─── HTTP ──────────────────────────────────────────────────

/** Follows redirects by hand so the chain itself can be inspected. */
async function fetchWithChain(url: string, method: 'GET' | 'HEAD' = 'GET'): Promise<HttpResult> {
  const redirects: HttpResult['redirects'] = [];
  let current = url;

  for (let hop = 0; hop <= 10; hop++) {
    let response: Response;
    try {
      response = await fetch(current, {
        method,
        redirect: 'manual',
        headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,*/*' },
      });
    } catch (err) {
      return {
        finalUrl: current,
        status: 0,
        redirects,
        headers: {},
        body: '',
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const location = headers['location'];
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, current).toString();
      redirects.push({ from: current, to: next, status: response.status });
      current = next;
      continue;
    }

    const body = method === 'GET' ? await response.text() : '';
    return { finalUrl: current, status: response.status, redirects, headers, body };
  }

  return { finalUrl: current, status: 0, redirects, headers: {}, body: '', error: 'redirect loop' };
}

/** Runs `worker` over `items` with a fixed concurrency ceiling. */
async function mapPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function run(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

// ─── Raw HTML extraction ───────────────────────────────────

/**
 * tsx compiles with esbuild's `keepNames`, which rewrites named arrow
 * functions to call a `__name` helper. That helper does not exist inside the
 * browser, so every `page.evaluate` callback throws `__name is not defined`.
 * Injecting an identity shim before navigation is the smallest fix that keeps
 * the in-page code type-checked rather than smuggled in as a string.
 */
const KEEP_NAMES_SHIM = 'globalThis.__name = globalThis.__name || function (fn) { return fn; };';

/**
 * Parses HTML with `DOMParser` in a blank tab. No scripts run, no subresources
 * load, so this is the no-JavaScript view of the page.
 */
async function extractFacts(page: Page, html: string): Promise<PageFacts> {
  return page.evaluate((source: string): PageFacts => {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const text = (node: Element | null): string => (node?.textContent ?? '').trim();
    const attr = (selector: string, name: string): string | null =>
      doc.querySelector(selector)?.getAttribute(name) ?? null;

    const meta: Record<string, string> = {};
    doc.querySelectorAll('meta').forEach(tag => {
      const key = tag.getAttribute('property') ?? tag.getAttribute('name');
      const value = tag.getAttribute('content');
      if (key && value !== null) meta[key.toLowerCase()] = value;
    });

    const prefixed = (prefix: string): Record<string, string> =>
      Object.fromEntries(Object.entries(meta).filter(([key]) => key.startsWith(prefix)));

    const clone = doc.body?.cloneNode(true);
    const cloneEl = clone instanceof HTMLElement ? clone : null;
    cloneEl?.querySelectorAll('script, style, noscript, svg, template').forEach(node => node.remove());
    const bodyText = (cloneEl?.textContent ?? '').replace(/\s+/g, ' ').trim();

    return {
      titles: Array.from(doc.querySelectorAll('title')).map(node => text(node)),
      descriptions: Array.from(doc.querySelectorAll('meta[name="description" i]')).map(
        node => node.getAttribute('content') ?? ''
      ),
      canonicals: Array.from(doc.querySelectorAll('link[rel="canonical" i]')).map(
        node => node.getAttribute('href') ?? ''
      ),
      robotsMeta: attr('meta[name="robots" i]', 'content'),
      lang: doc.documentElement?.getAttribute('lang') ?? null,
      charset:
        doc.querySelector('meta[charset]')?.getAttribute('charset') ??
        doc.querySelector('meta[http-equiv="content-type" i]')?.getAttribute('content') ??
        null,
      viewport: meta['viewport'] ?? null,
      headings: Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(node => ({
        level: Number(node.tagName.slice(1)),
        text: text(node).slice(0, 120),
      })),
      h1s: Array.from(doc.querySelectorAll('h1')).map(node => text(node)),
      bodyText,
      wordCount: bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0,
      og: prefixed('og:'),
      twitter: prefixed('twitter:'),
      jsonLd: Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map(
        node => node.textContent ?? ''
      ),
      links: Array.from(doc.querySelectorAll('a[href]')).map(node => ({
        href: node.getAttribute('href') ?? '',
        rel: node.getAttribute('rel') ?? '',
        text: text(node).slice(0, 80),
      })),
      images: Array.from(doc.querySelectorAll('img')).map(node => ({
        src: node.getAttribute('src') ?? '',
        alt: node.getAttribute('alt'),
        width: node.getAttribute('width'),
        height: node.getAttribute('height'),
        loading: node.getAttribute('loading'),
        fetchpriority: node.getAttribute('fetchpriority'),
      })),
      syncScripts: Array.from(doc.querySelectorAll('head script[src]'))
        .filter(node => !node.hasAttribute('async') && !node.hasAttribute('defer'))
        .map(node => node.getAttribute('src') ?? ''),
      headStylesheets: Array.from(doc.querySelectorAll('head link[rel="stylesheet" i]')).map(
        node => node.getAttribute('href') ?? ''
      ),
      hreflang: Array.from(doc.querySelectorAll('link[rel="alternate" i][hreflang]')).map(node => ({
        lang: node.getAttribute('hreflang') ?? '',
        href: node.getAttribute('href') ?? '',
      })),
    };
  }, html);
}

// ─── Per-page checks ───────────────────────────────────────

function checkResponse(page: AuditedPage, findings: Finding[]): void {
  const { url, http } = page;

  if (http.error) {
    findings.push({ severity: 'defect', code: 'HTTP_ERROR', url, message: `Request failed: ${http.error}` });
    return;
  }
  if (http.redirects.length > 0) {
    const chain = [url, ...http.redirects.map(hop => hop.to)].join(' -> ');
    findings.push({
      severity: 'defect',
      code: 'SITEMAP_REDIRECT',
      url,
      message: `Sitemap URL redirects instead of returning 200: ${chain}`,
      file: 'src/app/sitemap.ts',
    });
  }
  if (http.status !== 200) {
    findings.push({
      severity: 'defect',
      code: 'SITEMAP_NON_200',
      url,
      message: `Sitemap URL returned ${http.status}`,
      file: 'src/app/sitemap.ts',
    });
  }

  const xRobots = http.headers['x-robots-tag'];
  if (xRobots && /noindex/i.test(xRobots)) {
    findings.push({
      severity: 'defect',
      code: 'HEADER_NOINDEX',
      url,
      message: `X-Robots-Tag header carries noindex on a sitemap URL: "${xRobots}"`,
    });
  }
}

function checkDocumentBasics(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;

  if (!facts.lang) {
    findings.push({
      severity: 'defect',
      code: 'NO_LANG',
      url,
      message: 'No lang attribute on <html>. WCAG 2.2 success criterion 3.1.1 (Level A) requires one.',
      file: 'src/app/layout.tsx',
    });
  }
  if (!facts.charset) {
    findings.push({
      severity: 'defect',
      code: 'NO_CHARSET',
      url,
      message: 'No character encoding declaration. The HTML spec requires one in the first 1024 bytes.',
      file: 'src/app/layout.tsx',
    });
  }
  if (!facts.viewport) {
    findings.push({
      severity: 'defect',
      code: 'NO_VIEWPORT',
      url,
      message:
        'No viewport meta. Google indexes mobile-first and treats a missing viewport as not mobile-friendly.',
      file: 'src/app/layout.tsx',
    });
  }
}

function checkTitle(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;
  const title = facts.titles[0] ?? '';

  if (facts.titles.length === 0 || !title) {
    findings.push({ severity: 'defect', code: 'NO_TITLE', url, message: 'No <title> or an empty one.' });
    return;
  }
  if (facts.titles.length > 1) {
    findings.push({
      severity: 'defect',
      code: 'MULTIPLE_TITLE',
      url,
      message: `${facts.titles.length} <title> elements. The HTML spec allows one.`,
    });
  }
  if (title.length > TITLE_MAX_CHARS) {
    findings.push({
      severity: 'best-practice',
      code: 'TITLE_TOO_LONG',
      url,
      message: `Title is ${title.length} chars, over the project's own SEO_TITLE_MAX_LENGTH of ${TITLE_MAX_CHARS}. Google has no character limit; it truncates on pixel width.`,
      file: 'src/lib/seo/constants.ts',
    });
  }
}

function checkDescription(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;
  const description = facts.descriptions[0] ?? '';

  if (!description) {
    findings.push({
      severity: 'best-practice',
      code: 'NO_DESCRIPTION',
      url,
      message: 'No meta description. Not a ranking factor, but Google then writes the snippet itself.',
    });
    return;
  }
  if (facts.descriptions.length > 1) {
    findings.push({
      severity: 'defect',
      code: 'MULTIPLE_DESCRIPTION',
      url,
      message: `${facts.descriptions.length} meta description tags. Google picks one arbitrarily.`,
    });
  }
  if (description.length > DESCRIPTION_MAX_CHARS) {
    findings.push({
      severity: 'best-practice',
      code: 'DESCRIPTION_TOO_LONG',
      url,
      message: `Description is ${description.length} chars, over the project's SEO_DESCRIPTION_MAX_LENGTH of ${DESCRIPTION_MAX_CHARS}.`,
      file: 'src/lib/seo/constants.ts',
    });
  }
  if (description.length < DESCRIPTION_MIN_CHARS) {
    findings.push({
      severity: 'best-practice',
      code: 'DESCRIPTION_TOO_SHORT',
      url,
      message: `Description is ${description.length} chars, under the ${DESCRIPTION_MIN_CHARS}-char convention. No Google minimum exists.`,
    });
  }
}

function checkCanonical(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;

  if (facts.canonicals.length === 0) {
    findings.push({
      severity: 'best-practice',
      code: 'NO_CANONICAL',
      url,
      message: 'No rel=canonical. Google will pick one itself, usually correctly, but the signal is free.',
    });
    return;
  }
  if (facts.canonicals.length > 1) {
    findings.push({
      severity: 'defect',
      code: 'MULTIPLE_CANONICAL',
      url,
      message: `${facts.canonicals.length} canonical links. Google ignores all of them when they conflict.`,
    });
  }

  const canonical = facts.canonicals[0];
  if (!/^https?:\/\//i.test(canonical)) {
    findings.push({
      severity: 'best-practice',
      code: 'CANONICAL_RELATIVE',
      url,
      message: `Canonical "${canonical}" is relative. Google resolves it, but recommends absolute URLs.`,
      file: 'src/lib/seo/urls.ts',
    });
  }

  // A local build still emits production canonicals because APP_URL is fixed,
  // so compare origins only when the canonical already sits on the audited
  // host. Otherwise compare paths, which is the part the route controls.
  const canonicalUrl = new URL(canonical, url);
  const selfUrl = new URL(url);
  const sameHost = canonicalUrl.origin === selfUrl.origin;
  const resolved = sameHost
    ? canonicalUrl.toString().replace(/\/$/, '')
    : canonicalUrl.pathname.replace(/\/$/, '');
  const self = sameHost ? selfUrl.toString().replace(/\/$/, '') : selfUrl.pathname.replace(/\/$/, '');

  if (resolved !== self) {
    findings.push({
      severity: 'defect',
      code: 'CANONICAL_MISMATCH',
      url,
      message: `Canonical points at ${canonicalUrl.toString()}, not at this sitemap URL. Google will drop this URL in favour of the target.`,
    });
  }
}

function checkRobotsMeta(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  if (facts.robotsMeta && /noindex/i.test(facts.robotsMeta)) {
    findings.push({
      severity: 'defect',
      code: 'SITEMAP_NOINDEX',
      url: page.url,
      message: `Page is in the sitemap but carries meta robots "${facts.robotsMeta}". The two signals contradict each other.`,
      file: 'src/app/sitemap.ts',
    });
  }
}

function checkHeadings(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;

  if (facts.h1s.length === 0) {
    findings.push({
      severity: 'defect',
      code: 'NO_H1',
      url,
      message: 'No h1 in the server-rendered HTML.',
    });
  } else if (facts.h1s.length > 1) {
    findings.push({
      severity: 'best-practice',
      code: 'MULTIPLE_H1',
      url,
      message: `${facts.h1s.length} h1 elements: ${facts.h1s.map(h => JSON.stringify(h.slice(0, 40))).join(', ')}. Google states multiple h1s are fine; the convention is one.`,
    });
  }
  if (facts.h1s.some(heading => heading.trim() === '')) {
    findings.push({ severity: 'defect', code: 'EMPTY_H1', url, message: 'An h1 element is empty.' });
  }

  let previous = 0;
  for (const heading of facts.headings) {
    if (previous > 0 && heading.level > previous + 1) {
      findings.push({
        severity: 'best-practice',
        code: 'HEADING_SKIP',
        url,
        message: `Heading level jumps h${previous} -> h${heading.level} at ${JSON.stringify(heading.text.slice(0, 50))}. WCAG 1.3.1 asks for a sane outline; it is not a ranking factor.`,
      });
      break;
    }
    previous = heading.level;
  }
}

function checkSocialCard(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;
  const missingOg = ['og:title', 'og:description', 'og:url', 'og:image', 'og:type'].filter(
    key => !facts.og[key]
  );
  if (missingOg.length > 0) {
    findings.push({
      severity: 'best-practice',
      code: 'OG_INCOMPLETE',
      url,
      message: `Missing Open Graph tags: ${missingOg.join(', ')}. Not a ranking factor; controls the share card.`,
      file: 'src/lib/seo/metadata.ts',
    });
  }
  if (facts.og['og:image'] && !/^https?:\/\//i.test(facts.og['og:image'])) {
    findings.push({
      severity: 'defect',
      code: 'OG_IMAGE_RELATIVE',
      url,
      message: `og:image "${facts.og['og:image']}" is relative. Most crawlers, including Facebook's, require an absolute URL.`,
      file: 'src/lib/seo/metadata.ts',
    });
  }
  if (!facts.twitter['twitter:card']) {
    findings.push({
      severity: 'best-practice',
      code: 'TWITTER_CARD_MISSING',
      url,
      message: 'No twitter:card. X falls back to Open Graph, so the card still renders, just as a small one.',
    });
  }
  if (facts.og['og:image'] && !facts.og['og:image:alt'] && !facts.twitter['twitter:image:alt']) {
    findings.push({
      severity: 'preference',
      code: 'OG_IMAGE_NO_ALT',
      url,
      message: 'Share image has no alt text. Affects screen readers on social platforms only.',
    });
  }
}

function checkWordCount(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  // Thin content is a judgement Google makes about pages it indexes. A noindex
  // page is never judged, so its word count is not a finding.
  if (isNoIndex(facts)) return;
  if (facts.wordCount < MIN_PAGE_WORDS) {
    findings.push({
      severity: 'best-practice',
      code: 'THIN_CONTENT',
      url: page.url,
      message: `${facts.wordCount} server-rendered words, under the ${MIN_PAGE_WORDS}-word floor this project set in src/lib/seo/indexable.ts. Google publishes no word-count minimum.`,
      file: 'src/lib/seo/indexable.ts',
    });
  }
}

// ─── Structured data ───────────────────────────────────────

/**
 * Required and recommended properties per Google's structured-data
 * documentation, read 2026-08-24. Types Google documents no requirements for
 * are still checked against schema.org's own expected properties, flagged as
 * best-practice rather than defect.
 */
interface TypeRule {
  required: string[];
  recommended: string[];
  note?: string;
}

const SCHEMA_RULES: Record<string, TypeRule> = {
  // developers.google.com/search/docs/appearance/structured-data/course
  Course: { required: ['name', 'description'], recommended: ['provider', 'url'] },
  // developers.google.com/search/docs/appearance/structured-data/breadcrumb
  BreadcrumbList: { required: ['itemListElement'], recommended: [] },
  ListItem: { required: ['position', 'name'], recommended: ['item'] },
  // developers.google.com/search/docs/appearance/structured-data/logo
  Organization: {
    required: [],
    recommended: ['name', 'url', 'logo'],
    note: 'Google documents no required Organization properties; logo must be >= 112x112px and crawlable.',
  },
  // developers.google.com/search/docs/appearance/structured-data/software-app
  WebApplication: {
    required: ['name', 'offers'],
    recommended: ['applicationCategory', 'operatingSystem'],
    note: 'The software-app rich result also requires aggregateRating or review. Octokeen has neither, so this node is valid schema that cannot produce a rich result.',
  },
  SoftwareApplication: { required: ['name', 'offers'], recommended: [] },
  // FAQ rich results were removed from Google Search on 2025-06-15.
  FAQPage: {
    required: ['mainEntity'],
    recommended: [],
    note: 'FAQ rich results are retired. The markup is inert for Search.',
  },
  WebSite: { required: [], recommended: ['name', 'url'] },
  Question: { required: ['name', 'acceptedAnswer'], recommended: [] },
  Answer: { required: ['text'], recommended: [] },
  Offer: { required: ['price', 'priceCurrency'], recommended: [] },
};

/**
 * A JSON-LD node with an `@id` and no more than this many keys is treated as a
 * pointer to an entity defined elsewhere in the graph rather than a definition
 * of its own. `{ '@id', '@type', name, url }` is the common shape.
 */
const STUB_NODE_MAX_KEYS = 4;

/** Properties whose value the app cannot substantiate. Fabricating any of these earns a manual action. */
const UNSUBSTANTIABLE_PROPS = [
  'aggregateRating',
  'ratingValue',
  'reviewCount',
  'ratingCount',
  'review',
  'interactionCount',
  'userInteractionCount',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Flattens a JSON-LD document into every typed node it contains, including nested ones. */
function collectNodes(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    value.forEach(item => collectNodes(item, out));
    return out;
  }
  if (!isRecord(value)) return out;
  if (typeof value['@type'] === 'string') out.push(value);
  Object.values(value).forEach(child => collectNodes(child, out));
  return out;
}

function checkStructuredData(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const { url } = page;
  const declaredIds = new Set<string>();
  const referencedIds: string[] = [];

  for (const [index, block] of facts.jsonLd.entries()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block);
    } catch (err) {
      findings.push({
        severity: 'defect',
        code: 'JSONLD_PARSE_FAIL',
        url,
        message: `JSON-LD block ${index + 1} does not parse: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    if (isRecord(parsed) && !parsed['@context']) {
      findings.push({
        severity: 'defect',
        code: 'JSONLD_NO_CONTEXT',
        url,
        message: `JSON-LD block ${index + 1} has no @context. Google ignores nodes without one.`,
      });
    }

    for (const node of collectNodes(parsed)) {
      const type = String(node['@type']);
      const id = node['@id'];
      if (typeof id === 'string') {
        if (Object.keys(node).length > STUB_NODE_MAX_KEYS) declaredIds.add(id);
        else referencedIds.push(id);
      }

      const rule = SCHEMA_RULES[type];
      if (!rule) continue;

      // A node carrying an @id and little else is a reference to an entity
      // defined elsewhere, not a definition. Holding it to the required and
      // recommended property lists would report the same entity twice.
      if (typeof id === 'string' && Object.keys(node).length <= STUB_NODE_MAX_KEYS) continue;

      for (const prop of rule.required) {
        if (node[prop] === undefined || node[prop] === null || node[prop] === '') {
          findings.push({
            severity: 'defect',
            code: 'JSONLD_MISSING_REQUIRED',
            url,
            message: `${type} is missing the Google-required property "${prop}".`,
          });
        }
      }
      for (const prop of rule.recommended) {
        if (node[prop] === undefined) {
          findings.push({
            severity: 'best-practice',
            code: 'JSONLD_MISSING_RECOMMENDED',
            url,
            message: `${type} omits the recommended property "${prop}".`,
          });
        }
      }
      for (const prop of UNSUBSTANTIABLE_PROPS) {
        if (node[prop] !== undefined) {
          findings.push({
            severity: 'info',
            code: 'JSONLD_UNSUBSTANTIATED',
            url,
            message: `${type} declares "${prop}". Verify the site actually collects this; invented ratings are a spam-policy violation.`,
          });
        }
      }
    }
  }

  for (const id of referencedIds) {
    if (!declaredIds.has(id)) {
      findings.push({
        severity: 'best-practice',
        code: 'JSONLD_DANGLING_ID',
        url,
        message: `JSON-LD references @id "${id}" but no node on the page declares it. The reference resolves to nothing.`,
      });
    }
  }
}

/**
 * Google's general structured-data guidelines require marked-up content to be
 * visible on the page it is marked up on. This catches the common failure:
 * an FAQPage emitted from a shared layout onto pages that show no FAQ.
 */
function checkStructuredDataVisibility(page: AuditedPage, facts: PageFacts, findings: Finding[]): void {
  const haystack = facts.bodyText.toLowerCase();

  for (const block of facts.jsonLd) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block);
    } catch {
      continue;
    }
    for (const node of collectNodes(parsed)) {
      if (node['@type'] !== 'Question') continue;
      const name = typeof node.name === 'string' ? node.name : '';
      if (!name) continue;
      const probe = name.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 30);
      if (probe && !haystack.includes(probe)) {
        findings.push({
          severity: 'defect',
          code: 'JSONLD_CONTENT_MISMATCH',
          url: page.url,
          message: `FAQPage markup declares the question ${JSON.stringify(name)} but that text does not appear on the page. Google's structured-data guidelines require marked-up content to be visible to the user.`,
          file: 'src/app/layout.tsx',
        });
        break;
      }
    }
  }
}

// ─── Cross-page checks ─────────────────────────────────────

function shingles(text: string): Set<string> {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + SHINGLE_SIZE <= words.length; i++) {
    out.add(words.slice(i, i + SHINGLE_SIZE).join(' '));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach(item => {
    if (b.has(item)) shared++;
  });
  return shared / (a.size + b.size - shared);
}

function checkUniqueness(pages: AuditedPage[], findings: Finding[]): void {
  const group = (pick: (facts: PageFacts) => string, code: string, label: string): void => {
    const seen = new Map<string, string[]>();
    for (const page of pages) {
      if (!page.facts) continue;
      const value = pick(page.facts).trim();
      if (!value) continue;
      seen.set(value, [...(seen.get(value) ?? []), page.url]);
    }
    for (const [value, urls] of seen) {
      if (urls.length < 2) continue;
      // One finding per URL in the group, not one per group: the scorer counts
      // failing subjects, and a 4-way collision is four pages with a problem.
      for (const url of urls) {
        findings.push({
          severity: 'defect',
          code,
          url,
          message: `Duplicate ${label} ${JSON.stringify(value.slice(0, 70))} shared with ${urls.length - 1} other URL(s): ${urls.filter(other => other !== url).join(', ')}`,
        });
      }
    }
  };

  group(facts => facts.titles[0] ?? '', 'DUPLICATE_TITLE', 'title');
  group(facts => facts.descriptions[0] ?? '', 'DUPLICATE_DESCRIPTION', 'meta description');
  group(facts => facts.h1s[0] ?? '', 'DUPLICATE_H1', 'h1');
}

function checkNearDuplicateBodies(pages: AuditedPage[], findings: Finding[]): void {
  const indexed = pages
    .filter(page => page.facts && page.facts.wordCount > 0)
    .map(page => ({ url: page.url, set: shingles(page.facts?.bodyText ?? '') }));

  for (let i = 0; i < indexed.length; i++) {
    for (let j = i + 1; j < indexed.length; j++) {
      const score = jaccard(indexed[i].set, indexed[j].set);
      if (score >= NEAR_DUPLICATE_THRESHOLD) {
        findings.push({
          severity: 'defect',
          code: 'NEAR_DUPLICATE_BODY',
          url: indexed[i].url,
          message: `Body text is ${(score * 100).toFixed(0)}% identical to ${indexed[j].url} by 5-word shingle overlap. Google will pick one and drop the other.`,
        });
      }
    }
  }
}

// ─── Links, crawlability, orphans ──────────────────────────

function isSameOrigin(href: string, origin: string): boolean {
  try {
    return new URL(href, origin).origin === origin;
  } catch {
    return false;
  }
}

/** Strips the fragment and any trailing slash so two spellings of one page compare equal. */
function normalizeUrl(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    url.hash = '';
    const normalized = url.toString().replace(/\/$/, '');
    return normalized;
  } catch {
    return null;
  }
}

const NON_PAGE_EXTENSION = /\.(png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|json|xml|txt|pdf|zip|woff2?)$/i;

/**
 * Cloudflare rewrites `mailto:` into `/cdn-cgi/l/email-protection#<token>` and
 * serves 404 on the bare path. The link only works with its fragment and its
 * JavaScript, and no repo file controls it, so it is not a site link.
 */
const INFRASTRUCTURE_PATH = /^\/cdn-cgi\//;

function internalPageLinks(facts: PageFacts, pageUrl: string, origin: string): string[] {
  return facts.links
    .map(link => link.href)
    .filter(href => href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
    .filter(href => isSameOrigin(href, origin))
    .map(href => normalizeUrl(href, pageUrl))
    .filter((href): href is string => href !== null)
    .filter(href => !NON_PAGE_EXTENSION.test(new URL(href).pathname))
    .filter(href => !INFRASTRUCTURE_PATH.test(new URL(href).pathname));
}

interface LinkGraph {
  /** Every internal link target found anywhere, mapped to the pages that link to it. */
  inbound: Map<string, Set<string>>;
  /** Sitemap URLs reachable by following links from the homepage. */
  reachable: Set<string>;
}

async function buildLinkGraph(
  pages: AuditedPage[],
  origin: string,
  browserPage: Page
): Promise<LinkGraph> {
  const inbound = new Map<string, Set<string>>();
  const outbound = new Map<string, string[]>();

  for (const page of pages) {
    if (!page.facts) continue;
    const targets = internalPageLinks(page.facts, page.url, origin);
    outbound.set(normalizeUrl(page.url, origin) ?? page.url, targets);
    for (const target of targets) {
      if (!inbound.has(target)) inbound.set(target, new Set());
      inbound.get(target)?.add(page.url);
    }
  }

  // Crawl outward from the homepage so pages that link onward but are not in
  // the sitemap still contribute edges.
  const start = normalizeUrl(origin, origin) ?? origin;
  const reachable = new Set<string>([start]);
  let frontier = [start];

  for (let depth = 0; depth < CRAWL_MAX_DEPTH && frontier.length > 0; depth++) {
    const next: string[] = [];
    for (const url of frontier) {
      let targets = outbound.get(url);
      if (!targets) {
        const fetched = await fetchWithChain(url);
        if (fetched.status !== 200 || !fetched.body) continue;
        const facts = await extractFacts(browserPage, fetched.body);
        targets = internalPageLinks(facts, url, origin);
        outbound.set(url, targets);
        for (const target of targets) {
          if (!inbound.has(target)) inbound.set(target, new Set());
          inbound.get(target)?.add(url);
        }
      }
      for (const target of targets) {
        if (reachable.has(target)) continue;
        reachable.add(target);
        next.push(target);
      }
    }
    frontier = next;
  }

  return { inbound, reachable };
}

/**
 * Collects anchors from the hydrated DOM, so a link that only exists after
 * React runs is still counted. Googlebot renders JavaScript, so these links do
 * get discovered; plenty of other crawlers and every LLM fetcher do not.
 */
async function collectRenderedLinks(browser: Browser, url: string, origin: string): Promise<string[]> {
  const context = await browser.newContext({ userAgent: USER_AGENT });
  try {
    const page = await context.newPage();
    await page.addInitScript(KEEP_NAMES_SHIM);
    await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
    await page.waitForTimeout(RENDER_SETTLE_MS);
    const hrefs = await page.evaluate((): string[] =>
      Array.from(document.querySelectorAll('a[href]')).map(node => node.getAttribute('href') ?? '')
    );
    return hrefs
      .filter(href => href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
      .filter(href => isSameOrigin(href, origin))
      .map(href => normalizeUrl(href, url))
      .filter((href): href is string => href !== null)
      .filter(href => !NON_PAGE_EXTENSION.test(new URL(href).pathname))
      .filter(href => !INFRASTRUCTURE_PATH.test(new URL(href).pathname));
  } catch {
    return [];
  } finally {
    await context.close();
  }
}

/**
 * Reachability from the homepage over the hydrated DOM. Only URLs in `urls`
 * are expanded; anything else a page links to is marked reachable but its own
 * links are not followed, so this is a lower bound on the true rendered graph.
 */
async function buildRenderedReachability(
  browser: Browser,
  urls: string[],
  origin: string
): Promise<Set<string>> {
  const start = normalizeUrl(origin, origin) ?? origin;
  const targets = [...new Set([start, ...urls.map(url => normalizeUrl(url, origin) ?? url)])];
  const outbound = new Map<string, string[]>();

  for (const url of targets) {
    outbound.set(url, await collectRenderedLinks(browser, url, origin));
  }

  const reachable = new Set<string>([start]);
  let frontier = [start];
  for (let depth = 0; depth < CRAWL_MAX_DEPTH && frontier.length > 0; depth++) {
    const next: string[] = [];
    for (const url of frontier) {
      for (const target of outbound.get(url) ?? []) {
        if (reachable.has(target)) continue;
        reachable.add(target);
        if (outbound.has(target)) next.push(target);
      }
    }
    frontier = next;
  }
  return reachable;
}

/**
 * Reports orphans in two tiers. Unreachable with JavaScript is a defect: only
 * the sitemap is holding the page in the index. Unreachable without it is a
 * best-practice miss: Googlebot renders, but discovery is slower and every
 * non-rendering crawler misses the page entirely.
 */
/** True when the page tells crawlers not to index it. */
function isNoIndex(facts: PageFacts | null): boolean {
  return facts !== null && facts.robotsMeta !== null && /noindex/i.test(facts.robotsMeta);
}

function checkOrphans(
  pages: AuditedPage[],
  graph: LinkGraph,
  renderedReachable: Set<string> | null,
  origin: string,
  findings: Finding[]
): void {
  for (const page of pages) {
    const normalized = normalizeUrl(page.url, origin);
    if (!normalized) continue;
    // Internal linking exists to get a page crawled and to pass equity to it.
    // A noindex page wants neither, so an orphan finding against one is noise.
    // This is not an escape hatch: adding noindex to dodge these two checks
    // trips SITEMAP_NOINDEX at weight 9, which costs far more than it saves.
    if (isNoIndex(page.facts)) continue;
    const rawOk = graph.reachable.has(normalized);
    const renderedOk = renderedReachable === null ? rawOk : renderedReachable.has(normalized);

    if (!renderedOk) {
      findings.push({
        severity: 'defect',
        code: 'ORPHAN',
        url: page.url,
        message: `No internal link path from the homepage within ${CRAWL_MAX_DEPTH} hops, in raw HTML or in the hydrated DOM. Only the sitemap points at it, so it earns no internal link equity.`,
        file: 'src/components/landing/',
      });
      continue;
    }
    if (!rawOk) {
      findings.push({
        severity: 'best-practice',
        code: 'ORPHAN_WITHOUT_JS',
        url: page.url,
        message: `Reachable from the homepage only after JavaScript runs. Googlebot renders, so it will be found; non-rendering crawlers will not find it.`,
        file: 'src/components/landing/',
      });
    }
  }
}

/**
 * Google's site-name feature reads `WebSite` structured data and requires it on
 * the domain root specifically.
 * developers.google.com/search/docs/appearance/site-names
 */
function checkHomepageEntities(pages: AuditedPage[], origin: string, findings: Finding[]): void {
  const home = pages.find(page => (normalizeUrl(page.url, origin) ?? '') === (normalizeUrl(origin, origin) ?? ''));
  if (!home?.facts) return;

  const types = new Set<string>();
  for (const block of home.facts.jsonLd) {
    try {
      collectNodes(JSON.parse(block)).forEach(node => types.add(String(node['@type'])));
    } catch {
      continue;
    }
  }
  if (!types.has('WebSite')) {
    findings.push({
      severity: 'best-practice',
      code: 'NO_WEBSITE_ENTITY',
      url: home.url,
      message: 'Home page declares no WebSite structured data. Google reads WebSite name/url on the domain root to decide the site name shown in results.',
      file: 'src/app/layout.tsx',
    });
  }
}

/** Returns how many link targets were tested, which is the scoring population. */
async function checkLinkTargets(graph: LinkGraph, findings: Finding[]): Promise<number> {
  const targets = [...graph.inbound.keys()];
  const results = await mapPool(targets, REQUEST_CONCURRENCY, async target => ({
    target,
    result: await fetchWithChain(target, 'HEAD'),
  }));

  for (const { target, result } of results) {
    const sources = [...(graph.inbound.get(target) ?? [])].slice(0, 3).join(', ');
    if (result.error) {
      findings.push({
        severity: 'defect',
        code: 'LINK_ERROR',
        url: target,
        message: `Internal link target failed: ${result.error}. Linked from ${sources}`,
      });
      continue;
    }
    if (result.redirects.length > 1) {
      findings.push({
        severity: 'defect',
        code: 'LINK_CHAIN',
        url: target,
        message: `Internal link goes through ${result.redirects.length} redirects: ${result.redirects.map(hop => `${hop.status} -> ${hop.to}`).join(' ')}. Linked from ${sources}`,
      });
    } else if (result.redirects.length === 1) {
      findings.push({
        severity: 'best-practice',
        code: 'LINK_REDIRECT',
        url: target,
        message: `Internal link redirects (${result.redirects[0].status}) to ${result.redirects[0].to}. Link directly instead. Linked from ${sources}`,
      });
    }
    if (result.status >= 400 || result.status === 0) {
      findings.push({
        severity: 'defect',
        code: 'LINK_BROKEN',
        url: target,
        message: `Internal link returns ${result.status}. Linked from ${sources}`,
      });
    }
  }

  return targets.length;
}

// ─── robots.txt ────────────────────────────────────────────

interface RobotsGroup {
  agents: string[];
  allow: string[];
  disallow: string[];
}

function parseRobots(text: string): { groups: RobotsGroup[]; sitemaps: string[] } {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let expectingAgents = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(':').trim();

    if (key === 'user-agent') {
      if (!current || !expectingAgents) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
        expectingAgents = true;
      }
      current.agents.push(value.toLowerCase());
    } else if (key === 'allow' && current) {
      current.allow.push(value);
      expectingAgents = false;
    } else if (key === 'disallow' && current) {
      if (value) current.disallow.push(value);
      expectingAgents = false;
    } else if (key === 'sitemap') {
      sitemaps.push(value);
    }
  }
  return { groups, sitemaps };
}

/** Longest-match wins, matching Google's robots.txt precedence rule. */
function isPathBlocked(group: RobotsGroup, pathname: string): boolean {
  const match = (patterns: string[]): number =>
    patterns.reduce((best, pattern) => {
      const literal = pattern.replace(/\*$/, '');
      return pathname.startsWith(literal) ? Math.max(best, literal.length) : best;
    }, -1);
  const allow = match(group.allow);
  const disallow = match(group.disallow);
  return disallow > allow;
}

async function checkRobotsTxt(
  origin: string,
  sitemapUrls: string[],
  sitemapUrl: string,
  findings: Finding[]
): Promise<void> {
  const robots = await fetchWithChain(`${origin}/robots.txt`);
  if (robots.status !== 200) {
    findings.push({
      severity: 'defect',
      code: 'ROBOTS_MISSING',
      url: `${origin}/robots.txt`,
      message: `robots.txt returned ${robots.status}.`,
      file: 'src/app/robots.ts',
    });
    return;
  }

  const { groups, sitemaps } = parseRobots(robots.body);
  const wildcard = groups.find(group => group.agents.includes('*'));

  if (!wildcard) {
    findings.push({
      severity: 'best-practice',
      code: 'ROBOTS_NO_WILDCARD',
      url: `${origin}/robots.txt`,
      message: 'No `User-agent: *` group. Every unlisted crawler is unconstrained, which is usually intended but should be explicit.',
      file: 'src/app/robots.ts',
    });
  } else {
    for (const url of sitemapUrls) {
      if (isPathBlocked(wildcard, new URL(url).pathname || '/')) {
        findings.push({
          severity: 'defect',
          code: 'ROBOTS_BLOCKS_SITEMAP_URL',
          url,
          message: 'robots.txt disallows a URL that the sitemap advertises.',
          file: 'src/app/robots.ts',
        });
      }
    }
  }

  if (!sitemaps.some(entry => entry.replace(/\/$/, '') === sitemapUrl.replace(/\/$/, ''))) {
    findings.push({
      severity: 'best-practice',
      code: 'ROBOTS_NO_SITEMAP',
      url: `${origin}/robots.txt`,
      message: `robots.txt does not reference ${sitemapUrl}. Declared sitemaps: ${sitemaps.join(', ') || 'none'}`,
      file: 'src/app/robots.ts',
    });
  }

  const blockedAgents = groups
    .filter(group => group.disallow.includes('/'))
    .flatMap(group => group.agents);
  if (blockedAgents.length > 0) {
    findings.push({
      severity: 'info',
      code: 'ROBOTS_BLOCKED_AGENTS',
      url: `${origin}/robots.txt`,
      message: `Fully blocked user agents, read live from robots.txt: ${blockedAgents.join(', ')}. Blocking training crawlers is a recorded owner decision (see the comments in src/app/robots.ts), so this is reported for visibility and scored at zero. Worth re-reading only if a listed agent turns out to be a search or user-initiated fetcher rather than a training crawler.`,
      file: 'src/app/robots.ts',
    });
  }
}

// ─── Images ────────────────────────────────────────────────

/**
 * Returns both scoring populations: `elements` is every `<img>` occurrence
 * across the crawl, `assets` is the distinct same-origin files behind them.
 */
async function checkImages(
  pages: AuditedPage[],
  origin: string,
  findings: Finding[]
): Promise<{ elements: number; assets: number }> {
  const seen = new Set<string>();
  const toWeigh: { url: string; page: string }[] = [];
  let elements = 0;

  for (const page of pages) {
    if (!page.facts) continue;
    for (const image of page.facts.images) {
      if (!image.src) continue;
      elements++;
      if (image.alt === null) {
        findings.push({
          severity: 'defect',
          code: 'IMG_NO_ALT',
          url: page.url,
          message: `<img src="${image.src.slice(0, 80)}"> has no alt attribute. WCAG 1.1.1 (Level A) requires one; use alt="" for decoration.`,
        });
      }
      if (!image.width || !image.height) {
        findings.push({
          severity: 'best-practice',
          code: 'IMG_NO_DIMENSIONS',
          url: page.url,
          message: `<img src="${image.src.slice(0, 80)}"> has no width/height attributes, which is the usual cause of layout shift.`,
        });
      }
      const absolute = normalizeUrl(image.src, page.url);
      if (absolute && isSameOrigin(absolute, origin) && !seen.has(absolute)) {
        seen.add(absolute);
        toWeigh.push({ url: absolute, page: page.url });
      }
    }
  }

  const weighed = await mapPool(toWeigh, REQUEST_CONCURRENCY, async item => ({
    ...item,
    head: await fetchWithChain(item.url, 'HEAD'),
  }));

  for (const item of weighed) {
    if (item.head.status >= 400 || item.head.status === 0) {
      findings.push({
        severity: 'defect',
        code: 'IMG_BROKEN',
        url: item.page,
        message: `Image ${item.url} returns ${item.head.status}.`,
      });
      continue;
    }
    const bytes = Number(item.head.headers['content-length'] ?? 0);
    if (bytes > LARGE_IMAGE_BYTES) {
      findings.push({
        severity: 'best-practice',
        code: 'IMG_OVERSIZED',
        url: item.page,
        message: `Image ${item.url} is ${(bytes / 1024).toFixed(0)} KB, over the ${LARGE_IMAGE_BYTES / 1024} KB working budget. No Google limit exists; this is an LCP cost.`,
      });
    }
  }

  return { elements, assets: toWeigh.length };
}

// ─── Organization logo ─────────────────────────────────────

/**
 * Google's logo guidelines require the image to be at least 112x112 px and
 * crawlable. developers.google.com/search/docs/appearance/structured-data/logo
 */
const MIN_LOGO_PX = 112;

/** Reads intrinsic dimensions for the two formats this project ships. */
function imageDimensions(bytes: Buffer): { width: number; height: number } | null {
  const isPng = bytes.length > 24 && bytes.toString('latin1', 1, 4) === 'PNG';
  if (isPng) return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };

  const svg = bytes.toString('utf8', 0, 2048);
  if (!svg.includes('<svg')) return null;
  const explicit = /width="(\d+(?:\.\d+)?)"[^>]*height="(\d+(?:\.\d+)?)"/.exec(svg);
  if (explicit) return { width: Number(explicit[1]), height: Number(explicit[2]) };
  const viewBox = /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/.exec(svg);
  if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  return null;
}

function collectLogoUrls(pages: AuditedPage[]): Map<string, string> {
  const logos = new Map<string, string>();
  for (const page of pages) {
    for (const block of page.facts?.jsonLd ?? []) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(block);
      } catch {
        continue;
      }
      for (const node of collectNodes(parsed)) {
        if (node['@type'] !== 'Organization') continue;
        const logo = node.logo;
        const url =
          typeof logo === 'string'
            ? logo
            : isRecord(logo) && typeof logo.url === 'string'
              ? logo.url
              : null;
        if (url && !logos.has(url)) logos.set(url, page.url);
      }
    }
  }
  return logos;
}

async function checkOrganizationLogo(pages: AuditedPage[], findings: Finding[]): Promise<void> {
  for (const [logoUrl, pageUrl] of collectLogoUrls(pages)) {
    let bytes: Buffer;
    try {
      const response = await fetch(logoUrl, { headers: { 'user-agent': USER_AGENT } });
      if (!response.ok) {
        findings.push({
          severity: 'defect',
          code: 'LOGO_UNREACHABLE',
          url: pageUrl,
          message: `Organization logo ${logoUrl} returned ${response.status}. Google requires it to be crawlable.`,
          file: 'src/app/layout.tsx',
        });
        continue;
      }
      bytes = Buffer.from(await response.arrayBuffer());
    } catch (err) {
      findings.push({
        severity: 'defect',
        code: 'LOGO_UNREACHABLE',
        url: pageUrl,
        message: `Organization logo ${logoUrl} could not be fetched: ${err instanceof Error ? err.message : String(err)}`,
        file: 'src/app/layout.tsx',
      });
      continue;
    }

    const size = imageDimensions(bytes);
    if (!size) {
      findings.push({
        severity: 'info',
        code: 'LOGO_UNMEASURED',
        url: pageUrl,
        message: `Could not read intrinsic dimensions of ${logoUrl}. Confirm by hand that it is at least ${MIN_LOGO_PX}x${MIN_LOGO_PX} px.`,
      });
      continue;
    }
    if (size.width < MIN_LOGO_PX || size.height < MIN_LOGO_PX) {
      findings.push({
        severity: 'defect',
        code: 'LOGO_TOO_SMALL',
        url: pageUrl,
        message: `Organization logo ${logoUrl} is ${size.width}x${size.height}, under Google's documented ${MIN_LOGO_PX}x${MIN_LOGO_PX} minimum.`,
        file: 'src/app/layout.tsx',
      });
    }
  }
}

// ─── Site-level checks ─────────────────────────────────────

async function checkOriginHygiene(origin: string, findings: Finding[]): Promise<void> {
  const url = new URL(origin);
  const host = url.hostname;
  const alternate = host.startsWith('www.') ? host.slice(4) : `www.${host}`;

  const variants = [
    { label: 'http', target: `http://${host}/` },
    { label: 'alternate host', target: `${url.protocol}//${alternate}/` },
  ];

  for (const variant of variants) {
    const result = await fetchWithChain(variant.target);
    if (result.error) {
      findings.push({
        severity: 'info',
        code: 'ORIGIN_VARIANT_UNRESOLVED',
        url: variant.target,
        message: `${variant.label} variant did not resolve (${result.error}). Nothing to canonicalize, which is fine if the DNS record does not exist.`,
      });
      continue;
    }
    const landed = result.finalUrl.replace(/\/$/, '');
    if (result.status === 200 && landed !== origin.replace(/\/$/, '')) {
      findings.push({
        severity: 'defect',
        code: 'ORIGIN_DUPLICATE',
        url: variant.target,
        message: `${variant.label} variant serves 200 at ${result.finalUrl} instead of redirecting to ${origin}. The site is reachable at two origins.`,
      });
    }
  }

  const missing = await fetchWithChain(`${origin}/this-page-does-not-exist-${Date.now()}`);
  if (missing.status === 200) {
    findings.push({
      severity: 'defect',
      code: 'SOFT_404',
      url: missing.finalUrl,
      message: 'An unknown path returns 200. Google treats this as a soft 404 and it wastes crawl budget.',
      file: 'src/app/not-found.tsx',
    });
  } else if (missing.status !== 404 && missing.status !== 410) {
    findings.push({
      severity: 'best-practice',
      code: 'NOT_FOUND_STATUS',
      url: missing.finalUrl,
      message: `An unknown path returns ${missing.status} rather than 404.`,
      file: 'src/app/not-found.tsx',
    });
  }
}

// ─── Rendered metrics ──────────────────────────────────────

/**
 * Starts the observers before any page script runs. CLS uses the session-window
 * algorithm from web.dev (5s window, 1s gap, take the maximum window). TBT is
 * approximated as the sum of long-task time over 50ms after FCP; the true
 * definition runs FCP to Time to Interactive, which cannot be computed from
 * PerformanceObserver alone, so this is an upper bound.
 */
const OBSERVER_SCRIPT = `
window.__seoAudit = { lcp: 0, lcpElement: '', shifts: [], longTasks: [], fcp: 0 };
try {
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      window.__seoAudit.lcp = entry.startTime;
      const el = entry.element;
      window.__seoAudit.lcpElement = el
        ? el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')
        : '';
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const sources = (entry.sources || []).map(s => {
        const n = s.node;
        return n && n.tagName
          ? n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')
          : 'unknown';
      });
      window.__seoAudit.shifts.push({ value: entry.value, time: entry.startTime, sources: sources });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      window.__seoAudit.longTasks.push({ start: entry.startTime, duration: entry.duration });
    }
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') window.__seoAudit.fcp = entry.startTime;
    }
  }).observe({ type: 'paint', buffered: true });
} catch (err) { window.__seoAudit.error = String(err); }
`;

interface RawMetrics {
  lcp: number;
  lcpElement: string;
  fcp: number;
  shifts: { value: number; time: number; sources: string[] }[];
  longTasks: { start: number; duration: number }[];
  renderBlocking: string[];
  transferBytes: number;
}

async function measurePage(browser: Browser, url: string): Promise<PageMetrics> {
  const context = await browser.newContext({ ...devices['iPhone 14'] });
  const page = await context.newPage();

  try {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: NETWORK_LATENCY_MS,
      downloadThroughput: NETWORK_DOWNLOAD_BPS,
      uploadThroughput: NETWORK_UPLOAD_BPS,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

    await page.addInitScript(`${KEEP_NAMES_SHIM}
${OBSERVER_SCRIPT}`);
    await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(METRIC_SETTLE_MS);

    const raw = await page.evaluate((): RawMetrics => {
      const store = (window as unknown as { __seoAudit: RawMetrics }).__seoAudit;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const blocking = resources
        .filter(entry => {
          const status = (entry as PerformanceResourceTiming & { renderBlockingStatus?: string })
            .renderBlockingStatus;
          return status === 'blocking';
        })
        .map(entry => entry.name);
      const transfer = resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      return { ...store, renderBlocking: blocking, transferBytes: transfer };
    });

    return {
      url,
      lcpMs: Math.round(raw.lcp),
      lcpElement: raw.lcpElement,
      fcpMs: Math.round(raw.fcp),
      clsScore: maxSessionWindow(raw.shifts),
      clsSources: topShiftSources(raw.shifts),
      tbtMs: Math.round(
        raw.longTasks
          .filter(task => task.start >= raw.fcp)
          .reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0)
      ),
      longTaskCount: raw.longTasks.length,
      renderBlocking: [...new Set(raw.renderBlocking)],
      transferBytes: raw.transferBytes,
    };
  } catch (err) {
    return {
      url,
      lcpMs: 0,
      lcpElement: '',
      fcpMs: 0,
      clsScore: 0,
      clsSources: [],
      tbtMs: 0,
      longTaskCount: 0,
      renderBlocking: [],
      transferBytes: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    await context.close();
  }
}

/** CLS session window: 5s maximum window, 1s maximum gap, report the largest. */
function maxSessionWindow(shifts: { value: number; time: number }[]): number {
  let best = 0;
  let current = 0;
  let first = 0;
  let previous = 0;

  for (const shift of shifts) {
    if (current > 0 && (shift.time - previous > 1000 || shift.time - first > 5000)) {
      best = Math.max(best, current);
      current = 0;
    }
    if (current === 0) first = shift.time;
    current += shift.value;
    previous = shift.time;
  }
  return Number(Math.max(best, current).toFixed(4));
}

function topShiftSources(shifts: { value: number; sources: string[] }[]): string[] {
  const weights = new Map<string, number>();
  for (const shift of shifts) {
    for (const source of shift.sources) {
      weights.set(source, (weights.get(source) ?? 0) + shift.value);
    }
  }
  return [...weights.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([source, weight]) => `${source} (${weight.toFixed(3)})`);
}

function checkMetrics(metrics: PageMetrics[], findings: Finding[]): void {
  for (const metric of metrics) {
    if (metric.error) {
      findings.push({
        severity: 'info',
        code: 'METRICS_FAILED',
        url: metric.url,
        message: `Could not measure: ${metric.error}`,
      });
      continue;
    }
    if (metric.lcpMs > LCP_POOR_MS) {
      findings.push({
        severity: 'defect',
        code: 'LCP_POOR',
        url: metric.url,
        message: `LCP ${metric.lcpMs}ms, above web.dev's 4000ms "poor" line, on ${metric.lcpElement || 'an unidentified element'}. Lab measurement under Lighthouse mobile throttling, not field data.`,
      });
    } else if (metric.lcpMs > LCP_GOOD_MS) {
      findings.push({
        severity: 'best-practice',
        code: 'LCP_NEEDS_WORK',
        url: metric.url,
        message: `LCP ${metric.lcpMs}ms, above web.dev's 2500ms "good" line, on ${metric.lcpElement || 'an unidentified element'}.`,
      });
    }
    if (metric.clsScore > CLS_POOR) {
      findings.push({
        severity: 'defect',
        code: 'CLS_POOR',
        url: metric.url,
        message: `CLS ${metric.clsScore}, above the 0.25 "poor" line. Largest contributors: ${metric.clsSources.join(', ') || 'unattributed'}`,
      });
    } else if (metric.clsScore > CLS_GOOD) {
      findings.push({
        severity: 'best-practice',
        code: 'CLS_NEEDS_WORK',
        url: metric.url,
        message: `CLS ${metric.clsScore}, above the 0.1 "good" line. Largest contributors: ${metric.clsSources.join(', ') || 'unattributed'}`,
      });
    }
    if (metric.tbtMs > TBT_POOR_MS) {
      findings.push({
        severity: 'best-practice',
        code: 'TBT_POOR',
        url: metric.url,
        message: `TBT approximately ${metric.tbtMs}ms across ${metric.longTaskCount} long tasks, above Lighthouse's 600ms band. TBT is a lab proxy for INP, not itself a ranking signal.`,
      });
    } else if (metric.tbtMs > TBT_GOOD_MS) {
      findings.push({
        severity: 'preference',
        code: 'TBT_NEEDS_WORK',
        url: metric.url,
        message: `TBT approximately ${metric.tbtMs}ms, above Lighthouse's 200ms "good" band.`,
      });
    }
    if (metric.renderBlocking.length > 0) {
      findings.push({
        severity: 'best-practice',
        code: 'RENDER_BLOCKING',
        url: metric.url,
        message: `${metric.renderBlocking.length} render-blocking resources: ${metric.renderBlocking.slice(0, 3).join(', ')}`,
      });
    }
  }
}

// ─── Scoring ───────────────────────────────────────────────

/**
 * The score is `100 * earned / available`, where every registered check
 * contributes `weight * (subjectsPassing / subjectsEvaluated)`.
 *
 * Partial credit per check, not per finding, so the number does not depend on
 * how many URLs the site happens to have. A check that passes on 21 of 25 URLs
 * earns 84% of its weight whether the site has 25 pages or 2,500.
 *
 * Partial credit has one exception, the dilution floor: on a check weighted
 * `SEVERE_WEIGHT` or above, any failure at all forfeits at least half the
 * weight. Otherwise publishing more clean pages around an unfixed
 * canonicalization bug would raise the score on its own.
 *
 * WHAT THE WEIGHTS MEAN. They are a judgement about how much each property
 * plausibly affects search performance, banded roughly as:
 *
 *   9-10  Decides whether the URL can be indexed at all, or which URL is.
 *   5-8   Decides how well an indexed URL performs, or breaks a documented
 *         Google requirement.
 *   2-4   A real but secondary effect: Core Web Vitals, structured data
 *         eligibility, accessibility properties Google is known to read.
 *   1     Hygiene. Correct to fix, near-zero measurable search effect.
 *   0     Preference or information. Costs nothing; a 100 is reachable with
 *         these outstanding, because they are decisions, not defects.
 *
 * These are calibrated on plausible search impact ONLY. Difficulty of fixing
 * is deliberately not an input: an expensive problem costs the same as a cheap
 * one of equal consequence. They remain a judgement call, and reasonable people
 * would move several of them by a point or two. Every one carries its
 * justification on the same line so a disagreement is arguable rather than
 * mysterious.
 *
 * THREE GUARDS AGAINST RAISING THE SCORE WITHOUT FIXING ANYTHING:
 *
 * 1. A finding whose code is not in the registry aborts the run with exit 2.
 *    A new check cannot be added that costs nothing.
 * 2. A registered code whose owning check did not run scores ZERO, not full
 *    marks. Deleting a check lowers the score instead of raising it.
 * 3. `EXPECTED_TOTAL_WEIGHT` is asserted against the registry sum. Removing an
 *    entry, or quietly lowering a weight, aborts the run until someone edits
 *    that constant, which is a one-line diff that cannot be missed in review.
 *
 * Skipping a pass with `--no-metrics` or `--no-render` marks the score PARTIAL
 * and always exits non-zero, so a flag cannot be used to dodge a category.
 */

type CheckCategory =
  | 'Indexability'
  | 'Canonicalization'
  | 'Metadata'
  | 'Content'
  | 'Structured data'
  | 'Links & crawl'
  | 'Media'
  | 'Performance'
  | 'Sitemap & robots';

/** Which population a check is scored against. */
type CheckScope = 'page' | 'site' | 'link' | 'image' | 'imageAsset' | 'metric';

interface CheckSpec {
  category: CheckCategory;
  weight: number;
  scope: CheckScope;
  /** Why this weight. Kept on one line so the table reads as an argument. */
  why: string;
}

const CHECK_REGISTRY: Record<string, CheckSpec> = {
  // ── Indexability: can this URL enter the index at all ──
  HTTP_ERROR: { category: 'Indexability', weight: 10, scope: 'page', why: 'A URL that does not respond cannot be indexed.' },
  SITEMAP_NON_200: { category: 'Indexability', weight: 10, scope: 'page', why: 'Google drops non-200 sitemap URLs and reports them as errors.' },
  ROBOTS_BLOCKS_SITEMAP_URL: { category: 'Indexability', weight: 10, scope: 'page', why: 'Disallowed means never crawled, so nothing else about the page matters.' },
  SITEMAP_NOINDEX: { category: 'Indexability', weight: 9, scope: 'page', why: 'Submitting a noindex URL guarantees a Search Console error and no index entry.' },
  HEADER_NOINDEX: { category: 'Indexability', weight: 9, scope: 'page', why: 'Same effect as a noindex meta, and harder to notice.' },
  ORIGIN_DUPLICATE: { category: 'Indexability', weight: 7, scope: 'site', why: 'A second reachable origin splits every signal the site has.' },
  SITEMAP_REDIRECT: { category: 'Indexability', weight: 6, scope: 'page', why: 'Google indexes the target, so the advertised URL never enters the index.' },
  NO_VIEWPORT: { category: 'Indexability', weight: 5, scope: 'page', why: 'Google indexes mobile-first; no viewport reads as not mobile-friendly.' },
  SOFT_404: { category: 'Indexability', weight: 4, scope: 'site', why: 'Wastes crawl budget and can pull junk URLs into the index.' },
  NOT_FOUND_STATUS: { category: 'Indexability', weight: 2, scope: 'site', why: 'A wrong status on unknown paths confuses crawl scheduling.' },
  NO_LANG: { category: 'Indexability', weight: 2, scope: 'page', why: 'WCAG 2.2 SC 3.1.1 Level A; a weak signal for language targeting.' },
  NO_CHARSET: { category: 'Indexability', weight: 2, scope: 'page', why: 'HTML spec requirement; wrong decoding corrupts the indexed text.' },

  // ── Canonicalization: which URL gets indexed ──
  CANONICAL_MISMATCH: { category: 'Canonicalization', weight: 10, scope: 'page', why: 'Points Google at a different URL, so this one is dropped outright.' },
  MULTIPLE_CANONICAL: { category: 'Canonicalization', weight: 5, scope: 'page', why: 'Conflicting canonicals make Google ignore all of them and guess.' },
  NO_CANONICAL: { category: 'Canonicalization', weight: 4, scope: 'page', why: 'Google guesses, usually right, but the signal is free to give.' },
  CANONICAL_RELATIVE: { category: 'Canonicalization', weight: 1, scope: 'page', why: 'Google resolves it; absolute is only the documented recommendation.' },

  // ── Metadata ──
  NO_TITLE: { category: 'Metadata', weight: 8, scope: 'page', why: 'The title is the strongest on-page relevance signal Google reads.' },
  DUPLICATE_TITLE: { category: 'Metadata', weight: 6, scope: 'page', why: 'Identical titles invite Google to treat the pages as one.' },
  MULTIPLE_TITLE: { category: 'Metadata', weight: 3, scope: 'page', why: 'HTML allows one; which one Google reads is not defined.' },
  DUPLICATE_DESCRIPTION: { category: 'Metadata', weight: 3, scope: 'page', why: 'Not a ranking factor, but a duplication signal alongside the title.' },
  MULTIPLE_DESCRIPTION: { category: 'Metadata', weight: 2, scope: 'page', why: 'Google picks one arbitrarily, so the snippet becomes unpredictable.' },
  NO_DESCRIPTION: { category: 'Metadata', weight: 2, scope: 'page', why: 'Not a ranking factor; Google writes the snippet instead, usually worse.' },
  TITLE_TOO_LONG: { category: 'Metadata', weight: 1, scope: 'page', why: 'Truncation costs clicks, not rank. Google publishes no character limit.' },
  DESCRIPTION_TOO_LONG: { category: 'Metadata', weight: 1, scope: 'page', why: 'Same: a snippet display issue, not a ranking one.' },
  DESCRIPTION_TOO_SHORT: { category: 'Metadata', weight: 1, scope: 'page', why: 'No Google minimum exists; short descriptions get rewritten more often.' },
  OG_INCOMPLETE: { category: 'Metadata', weight: 1, scope: 'page', why: 'Controls the share card. No effect on Search ranking whatsoever.' },
  OG_IMAGE_RELATIVE: { category: 'Metadata', weight: 1, scope: 'page', why: 'Breaks the card on crawlers that require an absolute URL.' },
  TWITTER_CARD_MISSING: { category: 'Metadata', weight: 1, scope: 'page', why: 'X falls back to Open Graph, so the card still renders, just smaller.' },
  OG_IMAGE_NO_ALT: { category: 'Metadata', weight: 0, scope: 'page', why: 'Screen readers on social platforms only. A preference, not a defect.' },

  // ── Content ──
  NEAR_DUPLICATE_BODY: { category: 'Content', weight: 8, scope: 'page', why: 'Google picks one page and drops the other from the index.' },
  THIN_CONTENT: { category: 'Content', weight: 5, scope: 'page', why: 'Mass-published thin pages are what the helpful-content system demotes.' },
  NO_H1: { category: 'Content', weight: 3, scope: 'page', why: 'A real but modest relevance signal, and an accessibility landmark.' },
  EMPTY_H1: { category: 'Content', weight: 2, scope: 'page', why: 'Same as missing, with the added risk of looking deliberate.' },
  DUPLICATE_H1: { category: 'Content', weight: 2, scope: 'page', why: 'Reinforces a duplication read across otherwise distinct pages.' },
  MULTIPLE_H1: { category: 'Content', weight: 1, scope: 'page', why: 'Google has stated repeatedly that multiple h1s are fine. Convention only.' },
  HEADING_SKIP: { category: 'Content', weight: 1, scope: 'page', why: 'WCAG 1.3.1. No evidence Google ranks on heading-level continuity.' },

  // ── Structured data ──
  JSONLD_PARSE_FAIL: { category: 'Structured data', weight: 4, scope: 'page', why: 'Unparseable markup is ignored entirely, so no rich result is possible.' },
  JSONLD_CONTENT_MISMATCH: { category: 'Structured data', weight: 4, scope: 'page', why: 'Marking up content not on the page violates the structured-data guidelines and risks a manual action.' },
  JSONLD_NO_CONTEXT: { category: 'Structured data', weight: 3, scope: 'page', why: 'Google ignores nodes without @context, so the block does nothing.' },
  JSONLD_MISSING_REQUIRED: { category: 'Structured data', weight: 3, scope: 'page', why: 'A documented Google requirement; the type becomes ineligible.' },
  LOGO_UNREACHABLE: { category: 'Structured data', weight: 2, scope: 'site', why: 'Google requires the logo to be crawlable or the property is dropped.' },
  JSONLD_MISSING_RECOMMENDED: { category: 'Structured data', weight: 1, scope: 'page', why: 'Recommended, not required. Improves eligibility odds, does not gate them.' },
  JSONLD_DANGLING_ID: { category: 'Structured data', weight: 1, scope: 'page', why: 'The graph is still valid; the reference simply resolves to nothing.' },
  NO_WEBSITE_ENTITY: { category: 'Structured data', weight: 1, scope: 'site', why: 'Feeds the site name shown in results. Google infers one either way.' },
  LOGO_TOO_SMALL: { category: 'Structured data', weight: 1, scope: 'site', why: 'Below the documented 112x112 minimum the logo is not used.' },
  JSONLD_UNSUBSTANTIATED: { category: 'Structured data', weight: 0, scope: 'page', why: 'Needs a human to confirm the data exists. Not automatically wrong.' },
  LOGO_UNMEASURED: { category: 'Structured data', weight: 0, scope: 'site', why: 'A limitation of this harness, not a property of the site.' },

  // ── Links and crawlability ──
  ORPHAN: { category: 'Links & crawl', weight: 6, scope: 'page', why: 'No internal links means no internal link equity and slow discovery.' },
  LINK_BROKEN: { category: 'Links & crawl', weight: 5, scope: 'link', why: 'Wastes crawl budget and dead-ends users.' },
  LINK_ERROR: { category: 'Links & crawl', weight: 4, scope: 'link', why: 'Same effect as broken, with an unknown cause.' },
  ORPHAN_WITHOUT_JS: { category: 'Links & crawl', weight: 2, scope: 'page', why: 'Googlebot renders, so it is found; non-rendering crawlers are not.' },
  LINK_CHAIN: { category: 'Links & crawl', weight: 2, scope: 'link', why: 'Multi-hop redirects lose crawl budget and can be abandoned.' },
  LINK_REDIRECT: { category: 'Links & crawl', weight: 1, scope: 'link', why: 'A single hop is followed and consolidated. Tidiness, mostly.' },

  // ── Media ──
  IMG_NO_ALT: { category: 'Media', weight: 2, scope: 'image', why: 'WCAG 1.1.1 Level A, and the only text Google Images has to work with.' },
  IMG_BROKEN: { category: 'Media', weight: 2, scope: 'imageAsset', why: 'A missing image is a visible defect and a wasted request.' },
  IMG_NO_DIMENSIONS: { category: 'Media', weight: 1, scope: 'image', why: 'The usual cause of layout shift, which is already scored via CLS.' },
  IMG_OVERSIZED: { category: 'Media', weight: 1, scope: 'imageAsset', why: 'An LCP cost, already scored via LCP. No Google size limit exists.' },

  // ── Performance ──
  LCP_POOR: { category: 'Performance', weight: 4, scope: 'metric', why: 'A confirmed Core Web Vital, though a small ranking input next to relevance.' },
  CLS_POOR: { category: 'Performance', weight: 4, scope: 'metric', why: 'Same standing as LCP among the Core Web Vitals.' },
  LCP_NEEDS_WORK: { category: 'Performance', weight: 2, scope: 'metric', why: 'Between good and poor; worth points, but fewer.' },
  CLS_NEEDS_WORK: { category: 'Performance', weight: 2, scope: 'metric', why: 'Between good and poor; worth points, but fewer.' },
  TBT_POOR: { category: 'Performance', weight: 2, scope: 'metric', why: 'A lab proxy for INP, which is the actual vital. Indirect by construction.' },
  TBT_NEEDS_WORK: { category: 'Performance', weight: 1, scope: 'metric', why: 'Same, one band down.' },
  RENDER_BLOCKING: { category: 'Performance', weight: 1, scope: 'metric', why: 'A cause of poor LCP, which is scored directly. Counting it twice would double-charge.' },
  METRICS_FAILED: { category: 'Performance', weight: 0, scope: 'metric', why: 'A harness failure, not a site property.' },

  // ── Sitemap and robots ──
  ROBOTS_MISSING: { category: 'Sitemap & robots', weight: 6, scope: 'site', why: 'No robots.txt removes control over crawling and sitemap discovery.' },
  ROBOTS_NO_WILDCARD: { category: 'Sitemap & robots', weight: 1, scope: 'site', why: 'Unlisted crawlers are unconstrained, which is usually what is wanted.' },
  ROBOTS_NO_SITEMAP: { category: 'Sitemap & robots', weight: 1, scope: 'site', why: 'Search Console submission covers this; the line is a convenience.' },
  SITEMAP_LASTMOD_UNIFORM: { category: 'Sitemap & robots', weight: 1, scope: 'site', why: 'Google ignores lastmod it cannot trust, so the field is simply inert.' },
  SITEMAP_INERT_HINTS: { category: 'Sitemap & robots', weight: 0, scope: 'site', why: 'Google has said it ignores changefreq and priority. Harmless.' },
  ROBOTS_BLOCKED_AGENTS: { category: 'Sitemap & robots', weight: 0, scope: 'site', why: 'Blocking AI crawlers is an owner decision, not a defect.' },
  ORIGIN_VARIANT_UNRESOLVED: { category: 'Sitemap & robots', weight: 0, scope: 'site', why: 'A DNS record that does not exist is nothing to fix.' },
};

/**
 * Guard 3. Asserted against the registry sum on every run. Lowering a weight or
 * deleting an entry to raise the score also breaks this, and the fix is a
 * one-line diff that a reviewer cannot miss.
 */
const EXPECTED_TOTAL_WEIGHT = 219;

/**
 * Checks at or above this weight are the ones that decide whether a URL is
 * indexable or which URL is canonical. Any failure on one of them forfeits at
 * least `SEVERE_MIN_PENALTY` of its weight regardless of how few pages are
 * affected, so the score cannot be raised by publishing more clean pages
 * around an unfixed problem.
 */
const SEVERE_WEIGHT = 5;
const SEVERE_MIN_PENALTY = 0.5;

/**
 * Guard 2. Which check function owns which codes. A registered code whose owner
 * did not run is scored as a total failure, so removing a check costs its full
 * weight rather than awarding it.
 */
const CHECK_OWNERS: Record<string, readonly string[]> = {
  checkResponse: ['HTTP_ERROR', 'SITEMAP_REDIRECT', 'SITEMAP_NON_200', 'HEADER_NOINDEX'],
  checkDocumentBasics: ['NO_LANG', 'NO_CHARSET', 'NO_VIEWPORT'],
  checkTitle: ['NO_TITLE', 'MULTIPLE_TITLE', 'TITLE_TOO_LONG'],
  checkDescription: ['NO_DESCRIPTION', 'MULTIPLE_DESCRIPTION', 'DESCRIPTION_TOO_LONG', 'DESCRIPTION_TOO_SHORT'],
  checkCanonical: ['NO_CANONICAL', 'MULTIPLE_CANONICAL', 'CANONICAL_RELATIVE', 'CANONICAL_MISMATCH'],
  checkRobotsMeta: ['SITEMAP_NOINDEX'],
  checkHeadings: ['NO_H1', 'EMPTY_H1', 'MULTIPLE_H1', 'HEADING_SKIP'],
  checkSocialCard: ['OG_INCOMPLETE', 'OG_IMAGE_RELATIVE', 'TWITTER_CARD_MISSING', 'OG_IMAGE_NO_ALT'],
  checkWordCount: ['THIN_CONTENT'],
  checkStructuredData: [
    'JSONLD_PARSE_FAIL',
    'JSONLD_NO_CONTEXT',
    'JSONLD_MISSING_REQUIRED',
    'JSONLD_MISSING_RECOMMENDED',
    'JSONLD_DANGLING_ID',
    'JSONLD_UNSUBSTANTIATED',
  ],
  checkStructuredDataVisibility: ['JSONLD_CONTENT_MISMATCH'],
  checkUniqueness: ['DUPLICATE_TITLE', 'DUPLICATE_DESCRIPTION', 'DUPLICATE_H1'],
  checkNearDuplicateBodies: ['NEAR_DUPLICATE_BODY'],
  checkRobotsTxt: ['ROBOTS_MISSING', 'ROBOTS_NO_WILDCARD', 'ROBOTS_NO_SITEMAP', 'ROBOTS_BLOCKS_SITEMAP_URL', 'ROBOTS_BLOCKED_AGENTS'],
  checkOriginHygiene: ['ORIGIN_DUPLICATE', 'ORIGIN_VARIANT_UNRESOLVED', 'SOFT_404', 'NOT_FOUND_STATUS'],
  checkOrganizationLogo: ['LOGO_TOO_SMALL', 'LOGO_UNREACHABLE', 'LOGO_UNMEASURED'],
  checkImages: ['IMG_NO_ALT', 'IMG_NO_DIMENSIONS', 'IMG_OVERSIZED', 'IMG_BROKEN'],
  checkOrphans: ['ORPHAN', 'ORPHAN_WITHOUT_JS'],
  checkLinkTargets: ['LINK_BROKEN', 'LINK_ERROR', 'LINK_CHAIN', 'LINK_REDIRECT'],
  checkHomepageEntities: ['NO_WEBSITE_ENTITY'],
  checkSitemapHints: ['SITEMAP_LASTMOD_UNIFORM', 'SITEMAP_INERT_HINTS'],
  checkMetrics: [
    'LCP_POOR',
    'LCP_NEEDS_WORK',
    'CLS_POOR',
    'CLS_NEEDS_WORK',
    'TBT_POOR',
    'TBT_NEEDS_WORK',
    'RENDER_BLOCKING',
    'METRICS_FAILED',
  ],
};

/** Populations each scope is scored against, counted during the run. */
interface ScorePopulations {
  page: number;
  site: number;
  link: number;
  image: number;
  imageAsset: number;
  metric: number;
}

interface CheckScore {
  code: string;
  spec: CheckSpec;
  evaluated: boolean;
  population: number;
  failures: number;
  earned: number;
  available: number;
}

interface Scorecard {
  score: number;
  earned: number;
  available: number;
  partial: boolean;
  skipped: string[];
  checks: CheckScore[];
}

/** Distinct failing subjects for a code. Page-scoped codes dedupe by URL. */
function countFailures(findings: Finding[], code: string, scope: CheckScope): number {
  const matching = findings.filter(finding => finding.code === code);
  if (scope === 'page' || scope === 'site' || scope === 'metric') {
    return new Set(matching.map(finding => finding.url)).size;
  }
  return matching.length;
}

function scoreOne(
  code: string,
  spec: CheckSpec,
  findings: Finding[],
  populations: ScorePopulations,
  ran: Set<string>
): CheckScore {
  const population = populations[spec.scope];
  const evaluated = ran.has(code);

  // Not evaluated scores zero rather than full marks. Deleting a check is a
  // penalty, not a shortcut.
  if (!evaluated) {
    return { code, spec, evaluated: false, population, failures: 0, earned: 0, available: spec.weight };
  }
  // Nothing to measure. Excluded from both sides so an absent population
  // neither earns nor costs points; the report lists it as N/A.
  if (population === 0) {
    return { code, spec, evaluated: true, population: 0, failures: 0, earned: 0, available: 0 };
  }

  const failures = Math.min(countFailures(findings, code, spec.scope), population);
  const linear = spec.weight * (1 - failures / population);

  // Dilution floor. Without it, publishing more clean pages raises the score
  // without fixing anything: four broken canonicals out of 25 pages costs 1.6
  // points, and out of 250 pages costs 0.16. For checks that decide whether a
  // URL can be indexed at all, any failure costs at least half the weight.
  const capped =
    failures > 0 && spec.weight >= SEVERE_WEIGHT
      ? Math.min(linear, spec.weight * (1 - SEVERE_MIN_PENALTY))
      : linear;

  return { code, spec, evaluated: true, population, failures, earned: capped, available: spec.weight };
}

/**
 * Guard 1 and guard 3 run here. An unregistered finding code or a registry that
 * no longer sums to `EXPECTED_TOTAL_WEIGHT` throws, and `main` exits 2.
 */
function buildScorecard(
  findings: Finding[],
  populations: ScorePopulations,
  ran: Set<string>,
  skipped: string[]
): Scorecard {
  const registrySum = Object.values(CHECK_REGISTRY).reduce((sum, spec) => sum + spec.weight, 0);
  if (registrySum !== EXPECTED_TOTAL_WEIGHT) {
    throw new Error(
      `CHECK_REGISTRY sums to ${registrySum} but EXPECTED_TOTAL_WEIGHT is ${EXPECTED_TOTAL_WEIGHT}. ` +
        'A check was added, removed or reweighted. Update the constant deliberately.'
    );
  }

  const unregistered = [...new Set(findings.map(finding => finding.code))].filter(
    code => !CHECK_REGISTRY[code]
  );
  if (unregistered.length > 0) {
    throw new Error(
      `Findings emitted with unregistered codes: ${unregistered.join(', ')}. ` +
        'Add them to CHECK_REGISTRY and CHECK_OWNERS with a weight before they can be reported.'
    );
  }

  const checks = Object.entries(CHECK_REGISTRY).map(([code, spec]) =>
    scoreOne(code, spec, findings, populations, ran)
  );
  const earned = checks.reduce((sum, check) => sum + check.earned, 0);
  const available = checks.reduce((sum, check) => sum + check.available, 0);

  return {
    score: available === 0 ? 0 : (100 * earned) / available,
    earned,
    available,
    partial: skipped.length > 0,
    skipped,
    checks,
  };
}

function categoryTotals(scorecard: Scorecard): Map<CheckCategory, { earned: number; available: number }> {
  const totals = new Map<CheckCategory, { earned: number; available: number }>();
  for (const check of scorecard.checks) {
    const current = totals.get(check.spec.category) ?? { earned: 0, available: 0 };
    current.earned += check.earned;
    current.available += check.available;
    totals.set(check.spec.category, current);
  }
  return totals;
}

function printScore(scorecard: Scorecard): void {
  const line = '='.repeat(72);
  console.log(`\n${line}\nSCORE\n${line}`);

  console.log('\nBy category (points earned of points available):\n');
  const width = 20;
  for (const [category, totals] of categoryTotals(scorecard)) {
    const pct = totals.available === 0 ? 100 : (100 * totals.earned) / totals.available;
    const bar = '#'.repeat(Math.round(pct / 5)).padEnd(20, '.');
    console.log(
      `  ${category.padEnd(width)} ${bar} ${pct.toFixed(1).padStart(6)}%  ${totals.earned.toFixed(1).padStart(6)} / ${totals.available.toFixed(0).padStart(3)}`
    );
  }

  const failing = scorecard.checks
    .filter(check => check.earned < check.available)
    .sort((a, b) => b.available - b.earned - (a.available - a.earned));

  if (failing.length > 0) {
    console.log('\nEvery check costing points, worst first:\n');
    console.log(
      `  ${'check'.padEnd(30)} ${'cat'.padEnd(16)} ${'wt'.padStart(3)} ${'failing'.padStart(9)} ${'lost'.padStart(6)}`
    );
    for (const check of failing) {
      const lost = (check.available - check.earned).toFixed(2);
      const share = check.evaluated ? `${check.failures}/${check.population}` : 'NOT RUN';
      console.log(
        `  ${check.code.padEnd(30)} ${check.spec.category.slice(0, 16).padEnd(16)} ${`${check.spec.weight}`.padStart(3)} ${share.padStart(9)} ${lost.padStart(6)}`
      );
    }
  }

  const unscored = scorecard.checks.filter(check => check.spec.weight === 0);
  const notApplicable = scorecard.checks.filter(
    check => check.evaluated && check.population === 0 && check.spec.weight > 0
  );
  if (notApplicable.length > 0) {
    console.log(
      `\nNot applicable, excluded from the total (nothing to measure): ${notApplicable.map(check => check.code).join(', ')}`
    );
  }
  console.log(
    `\nDeliberately unscored (${unscored.length} checks, weight 0 — decisions and information, not defects):\n  ${unscored.map(check => check.code).join(', ')}`
  );

  console.log(`\n${line}`);
  console.log(
    `  SEO SCORE: ${scorecard.score.toFixed(1)} / 100${scorecard.partial ? '   (PARTIAL)' : ''}`
  );
  console.log(`  ${scorecard.earned.toFixed(1)} of ${scorecard.available.toFixed(0)} weighted points across ${scorecard.checks.length} checks.`);
  if (scorecard.partial) {
    console.log(`  PARTIAL: ${scorecard.skipped.join('; ')}. Re-run without those flags for a real score.`);
  }
  console.log(line);

  console.log(`
  100 means every property this harness can objectively test is correct.
  It does NOT mean the site ranks, and it is not a prediction that it will.

  A perfect score is silent on backlinks, domain authority, actual position in
  results, click-through rate, whether AI Overviews absorb the clicks, and
  whether the content is accurate or useful. Those decide whether this content
  ranks; none of them is measurable from here. The OUT OF SCOPE section above
  lists them in full.
`);
}

// ─── Reporting ─────────────────────────────────────────────

const CHECK_GROUPS = [
  { label: 'resp', codes: ['HTTP_ERROR', 'SITEMAP_REDIRECT', 'SITEMAP_NON_200', 'HEADER_NOINDEX'] },
  { label: 'doc', codes: ['NO_LANG', 'NO_CHARSET', 'NO_VIEWPORT'] },
  { label: 'title', codes: ['NO_TITLE', 'MULTIPLE_TITLE', 'TITLE_TOO_LONG', 'DUPLICATE_TITLE'] },
  {
    label: 'desc',
    codes: [
      'NO_DESCRIPTION',
      'MULTIPLE_DESCRIPTION',
      'DESCRIPTION_TOO_LONG',
      'DESCRIPTION_TOO_SHORT',
      'DUPLICATE_DESCRIPTION',
    ],
  },
  { label: 'canon', codes: ['NO_CANONICAL', 'MULTIPLE_CANONICAL', 'CANONICAL_RELATIVE', 'CANONICAL_MISMATCH'] },
  { label: 'head', codes: ['NO_H1', 'EMPTY_H1', 'MULTIPLE_H1', 'HEADING_SKIP', 'DUPLICATE_H1'] },
  { label: 'social', codes: ['OG_INCOMPLETE', 'OG_IMAGE_RELATIVE', 'TWITTER_CARD_MISSING', 'OG_IMAGE_NO_ALT'] },
  {
    label: 'schema',
    codes: [
      'JSONLD_PARSE_FAIL',
      'JSONLD_NO_CONTEXT',
      'JSONLD_MISSING_REQUIRED',
      'JSONLD_MISSING_RECOMMENDED',
      'JSONLD_DANGLING_ID',
      'JSONLD_CONTENT_MISMATCH',
      'NO_WEBSITE_ENTITY',
      'LOGO_TOO_SMALL',
      'LOGO_UNREACHABLE',
    ],
  },
  { label: 'content', codes: ['THIN_CONTENT', 'NEAR_DUPLICATE_BODY'] },
  { label: 'links', codes: ['ORPHAN', 'ORPHAN_WITHOUT_JS'] },
  { label: 'img', codes: ['IMG_NO_ALT', 'IMG_NO_DIMENSIONS', 'IMG_OVERSIZED', 'IMG_BROKEN'] },
  {
    label: 'perf',
    codes: ['LCP_POOR', 'LCP_NEEDS_WORK', 'CLS_POOR', 'CLS_NEEDS_WORK', 'TBT_POOR', 'TBT_NEEDS_WORK'],
  },
];

const SEVERITY_ORDER: Severity[] = ['defect', 'best-practice', 'preference', 'info'];

function cell(findings: Finding[], url: string, codes: string[]): string {
  const hits = findings.filter(finding => finding.url === url && codes.includes(finding.code));
  if (hits.length === 0) return 'ok  ';
  if (hits.some(hit => hit.severity === 'defect')) return `FAIL${hits.length}`;
  return `warn${hits.length}`;
}

function printMatrix(pages: AuditedPage[], findings: Finding[]): void {
  const width = Math.max(...pages.map(page => new URL(page.url).pathname.length), 8);
  const header = ['path'.padEnd(width), ...CHECK_GROUPS.map(group => group.label.padEnd(7))].join(' ');
  console.log(`\n${header}`);
  console.log('-'.repeat(header.length));

  for (const page of pages) {
    const path = new URL(page.url).pathname.padEnd(width);
    const cells = CHECK_GROUPS.map(group => cell(findings, page.url, group.codes).padEnd(7));
    console.log([path, ...cells].join(' '));
  }
}

function printFindings(findings: Finding[]): void {
  for (const severity of SEVERITY_ORDER) {
    const group = findings.filter(finding => finding.severity === severity);
    if (group.length === 0) continue;
    console.log(`\n${'='.repeat(72)}\n${severity.toUpperCase()} (${group.length})\n${'='.repeat(72)}`);

    const byCode = new Map<string, Finding[]>();
    for (const finding of group) {
      byCode.set(finding.code, [...(byCode.get(finding.code) ?? []), finding]);
    }
    for (const [code, items] of [...byCode.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`\n[${code}] x${items.length}${items[0].file ? `  -> ${items[0].file}` : ''}`);
      for (const item of items.slice(0, 8)) {
        console.log(`  ${new URL(item.url).pathname || '/'}`);
        console.log(`    ${item.message}`);
      }
      if (items.length > 8) console.log(`  ... and ${items.length - 8} more`);
    }
  }
}

function printMetrics(metrics: PageMetrics[]): void {
  if (metrics.length === 0) return;
  console.log(`\n${'='.repeat(72)}\nRENDERED METRICS (Chromium, iPhone 14 emulation, 4x CPU + Slow 4G)\n${'='.repeat(72)}`);
  const width = Math.max(...metrics.map(metric => new URL(metric.url).pathname.length), 8);
  console.log(
    `${'path'.padEnd(width)}  ${'LCP'.padStart(7)} ${'CLS'.padStart(7)} ${'TBT'.padStart(7)} ${'FCP'.padStart(7)}  ${'KB'.padStart(6)}  LCP element`
  );
  for (const metric of metrics) {
    console.log(
      `${new URL(metric.url).pathname.padEnd(width)}  ${`${metric.lcpMs}`.padStart(7)} ${`${metric.clsScore}`.padStart(7)} ${`${metric.tbtMs}`.padStart(7)} ${`${metric.fcpMs}`.padStart(7)}  ${`${Math.round(metric.transferBytes / 1024)}`.padStart(6)}  ${metric.lcpElement}`
    );
  }
}

function printUntestable(): void {
  console.log(`\n${'='.repeat(72)}\nOUT OF SCOPE FOR ANY HARNESS\n${'='.repeat(72)}`);
  for (const line of [
    'Backlinks and referring domains. No index of the web is available here.',
    'Domain authority / trust. Not a Google metric; third-party proxies need paid APIs.',
    'Actual rankings and impressions. Only Search Console can answer this, over months.',
    'Whether AI Overviews absorb the clicks. Not observable without SERP scraping.',
    'Search volume for the targeted terms. No keyword tool on this machine.',
    'Field Core Web Vitals (CrUX). Requires 28 days of real traffic at volume.',
    'Whether the content is accurate. This audit measures structure, not truth.',
    'Whether Google considers the content helpful. Not a computable property.',
  ]) {
    console.log(`  - ${line}`);
  }
}

// ─── Entry point ───────────────────────────────────────────

/**
 * Reads `<loc>` entries and rebases them onto the origin being audited.
 * `APP_URL` is a build-time constant, so a local build still advertises
 * production URLs. Without the rebase, pointing this at localhost would
 * silently audit production instead.
 */
/**
 * Google ignores `lastmod` unless it is consistently accurate, and ignores
 * `changefreq` and `priority` outright. One shared timestamp across every URL
 * is the signature of a build-time `new Date()` rather than a content date.
 * developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 */
function checkSitemapHints(xml: string, sitemapUrl: string, findings: Finding[]): void {
  const stamps = new Set([...xml.matchAll(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/g)].map(m => m[1]));
  const urlCount = [...xml.matchAll(/<loc>/g)].length;

  if (stamps.size === 1 && urlCount > 1) {
    findings.push({
      // A defect, not a best practice: the sitemap asserts that all 25 URLs
      // changed at one instant, which is false for all but the ones that did.
      // The severity tracks that the value is verifiably wrong. The weight
      // stays at 1 because the consequence is only that Google discards a
      // crawl-scheduling hint; there is no penalty for an untrusted lastmod.
      severity: 'defect',
      code: 'SITEMAP_LASTMOD_UNIFORM',
      url: sitemapUrl,
      message: `All ${urlCount} URLs share one lastmod (${[...stamps][0]}), so the sitemap asserts a modification date that is false for every page that did not change in that build. Google ignores lastmod it cannot verify.`,
      file: 'src/lib/seo/sitemap-entries.ts',
    });
  }
  if (/<priority>/.test(xml) || /<changefreq>/.test(xml)) {
    findings.push({
      severity: 'preference',
      code: 'SITEMAP_INERT_HINTS',
      url: sitemapUrl,
      message: 'Sitemap carries changefreq and/or priority. Google has stated it ignores both. Harmless, but they are not doing anything.',
      file: 'src/lib/seo/sitemap-entries.ts',
    });
  }
}

function parseSitemap(xml: string, origin: string): { urls: string[]; rebased: number } {
  let rebased = 0;
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(match => {
    const loc = new URL(match[1]);
    if (loc.origin === origin) return loc.toString();
    rebased++;
    return `${origin}${loc.pathname}${loc.search}`.replace(/\/$/, '') || origin;
  });
  return { urls, rebased };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const baseUrl = (args.find(arg => !arg.startsWith('--')) ?? DEFAULT_BASE_URL).replace(/\/$/, '');
  const skipMetrics = args.includes('--no-metrics');
  const skipRender = args.includes('--no-render');
  const jsonFlag = args.indexOf('--json');
  const jsonPath = jsonFlag >= 0 ? args[jsonFlag + 1] : null;
  const origin = new URL(baseUrl).origin;
  const findings: Finding[] = [];

  console.log(`SEO audit of ${origin}`);

  const sitemapUrl = `${origin}/sitemap.xml`;
  const sitemapResponse = await fetchWithChain(sitemapUrl);
  if (sitemapResponse.status !== 200) {
    console.error(`sitemap.xml returned ${sitemapResponse.status}. Nothing to audit.`);
    process.exit(1);
  }
  const { urls: sitemapUrls, rebased } = parseSitemap(sitemapResponse.body, origin);
  console.log(`${sitemapUrls.length} URLs in the sitemap`);
  if (rebased > 0) {
    console.log(
      `${rebased} of them advertise a different origin and were rebased onto ${origin}. Canonical checks compare paths for those.`
    );
  }
  console.log('');

  // Guard 2: every check that actually executes marks its codes here. A
  // registered code that never gets marked scores zero.
  const ran = new Set<string>();
  const markRan = (owner: string): void => {
    const codes = CHECK_OWNERS[owner];
    if (!codes) throw new Error(`Check "${owner}" is not listed in CHECK_OWNERS.`);
    codes.forEach(code => ran.add(code));
  };

  checkSitemapHints(sitemapResponse.body, sitemapUrl, findings);
  markRan('checkSitemapHints');

  const browser = await chromium.launch();
  const parserContext = await browser.newContext();
  const parserPage = await parserContext.newPage();
  await parserPage.addInitScript(KEEP_NAMES_SHIM);
  await parserPage.goto('about:blank');

  const fetched = await mapPool(sitemapUrls, REQUEST_CONCURRENCY, async url => ({
    url,
    http: await fetchWithChain(url),
  }));

  const pages: AuditedPage[] = [];
  for (const entry of fetched) {
    const facts = entry.http.body ? await extractFacts(parserPage, entry.http.body) : null;
    pages.push({ url: entry.url, http: entry.http, facts });
  }

  for (const page of pages) {
    checkResponse(page, findings);
    if (!page.facts) continue;
    checkDocumentBasics(page, page.facts, findings);
    checkTitle(page, page.facts, findings);
    checkDescription(page, page.facts, findings);
    checkCanonical(page, page.facts, findings);
    checkRobotsMeta(page, page.facts, findings);
    checkHeadings(page, page.facts, findings);
    checkSocialCard(page, page.facts, findings);
    checkWordCount(page, page.facts, findings);
    checkStructuredData(page, page.facts, findings);
    checkStructuredDataVisibility(page, page.facts, findings);
  }
  [
    'checkResponse',
    'checkDocumentBasics',
    'checkTitle',
    'checkDescription',
    'checkCanonical',
    'checkRobotsMeta',
    'checkHeadings',
    'checkSocialCard',
    'checkWordCount',
    'checkStructuredData',
    'checkStructuredDataVisibility',
  ].forEach(markRan);

  checkUniqueness(pages, findings);
  markRan('checkUniqueness');
  checkNearDuplicateBodies(pages, findings);
  markRan('checkNearDuplicateBodies');
  await checkRobotsTxt(origin, sitemapUrls, sitemapUrl, findings);
  markRan('checkRobotsTxt');
  await checkOriginHygiene(origin, findings);
  markRan('checkOriginHygiene');
  await checkOrganizationLogo(pages, findings);
  markRan('checkOrganizationLogo');
  const imageCounts = await checkImages(pages, origin, findings);
  markRan('checkImages');

  const graph = await buildLinkGraph(pages, origin, parserPage);
  const linkTargets = await checkLinkTargets(graph, findings);
  markRan('checkLinkTargets');
  checkHomepageEntities(pages, origin, findings);
  markRan('checkHomepageEntities');

  await parserContext.close();

  const renderedReachable = skipRender
    ? null
    : await buildRenderedReachability(browser, sitemapUrls, origin);
  checkOrphans(pages, graph, renderedReachable, origin, findings);
  // Without the render pass, ORPHAN_WITHOUT_JS cannot fire. Marking only the
  // half that ran keeps the skipped half at zero rather than free marks.
  ran.add('ORPHAN');
  if (!skipRender) ran.add('ORPHAN_WITHOUT_JS');

  const metrics: PageMetrics[] = [];
  if (!skipMetrics) {
    console.log('Measuring rendered metrics (this is slow: throttled, one page at a time)...');
    for (const page of pages) {
      if (page.http.status !== 200) continue;
      metrics.push(await measurePage(browser, page.url));
    }
    checkMetrics(metrics, findings);
    markRan('checkMetrics');
  }

  await browser.close();

  const skipped: string[] = [];
  if (skipMetrics) skipped.push('--no-metrics skipped the Core Web Vitals pass');
  if (skipRender) skipped.push('--no-render skipped the hydrated-DOM link pass');

  const populations: ScorePopulations = {
    page: pages.filter(page => page.facts !== null).length,
    site: 1,
    link: linkTargets,
    image: imageCounts.elements,
    imageAsset: imageCounts.assets,
    metric: metrics.length,
  };

  const scorecard = buildScorecard(findings, populations, ran, skipped);

  printMatrix(pages, findings);
  printMetrics(metrics);
  printFindings(findings);
  printUntestable();

  const counts = SEVERITY_ORDER.map(
    severity => `${severity}: ${findings.filter(finding => finding.severity === severity).length}`
  );
  console.log(`\n${'='.repeat(72)}\nSUMMARY  ${counts.join('  |  ')}\n${'='.repeat(72)}`);
  printScore(scorecard);

  if (jsonPath) {
    const out = path.resolve(process.cwd(), jsonPath);
    fs.writeFileSync(
      out,
      JSON.stringify({ baseUrl: origin, score: scorecard, findings, metrics }, null, 2)
    );
    console.log(`Findings written to ${out}`);
  }

  // Anything short of a perfect score exits non-zero, and so does a partial
  // run, so `--no-metrics` cannot be used to manufacture a green result.
  process.exit(scorecard.score >= 100 && !scorecard.partial ? 0 : 1);
}

main().catch(err => {
  // Exit 2 separates a broken registry from a failing site: guard 1 and guard 3
  // throw from `buildScorecard`, and that is a code problem, not an SEO one.
  const integrity = err instanceof Error && /CHECK_REGISTRY|CHECK_OWNERS|unregistered codes/.test(err.message);
  console.error(integrity ? 'SEO audit scoring integrity failure:' : 'SEO audit failed:', err);
  process.exit(integrity ? 2 : 1);
});
