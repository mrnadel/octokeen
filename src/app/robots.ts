import { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/constants';

/**
 * Private or user-specific areas. Nothing here has search value and several
 * paths leak account state, so they stay out of the index.
 */
const DISALLOWED_PATHS = [
  '/api/',
  '/admin/',
  '/checkout/',
  '/settings/',
  '/onboarding/',
  '/invite/',
  '/dev/',
];

/**
 * AI TRAINING crawlers. Blocking these keeps course content out of model
 * pretraining sets. It does NOT affect whether an assistant can cite the site:
 * OpenAI, Anthropic and Google all document their training crawlers as separate
 * from their search and retrieval crawlers, so citations flow through the
 * retrieval agents below regardless.
 *
 * Deliberately absent, and they must stay absent:
 *   ChatGPT-User, Claude-User, Perplexity-User  live fetches made because a
 *     person asked an assistant about a page. Blocking these refuses a referral
 *     and protects nothing, since none of them feed training.
 *   OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, Bingbot
 *     search indexes. Every realistic path to being cited by an assistant reads
 *     from one of these.
 *   Google-Extended  controls Gemini training only. Blocking it does not remove
 *     the site from AI Overviews, which run off Googlebot.
 *
 * meta-externalagent (Meta AI training) is currently allowed while GPTBot and
 * ClaudeBot are blocked. That is inconsistent with the policy above and is left
 * for the owner to decide rather than changed silently.
 */
const AI_TRAINING_CRAWLERS = ['GPTBot', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'Bytespider', 'ImagesiftBot'];

/**
 * Scrapers and low-value link crawlers. They cost bandwidth and return
 * nothing. Note that these are separate from the SEO audit crawlers
 * (AhrefsBot, SemrushBot, DataForSeoBot), which are allowed so the owner can
 * audit his own site with the tools those crawlers feed.
 */
const SCRAPERS = ['Scrapy', 'MJ12bot', 'DotBot', 'BLEXBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      // facebookexternalhit is intentionally absent: it is the fetcher behind
      // Facebook, Messenger and WhatsApp link previews, not a scraper.
      // Blocking it breaks every shared link's card. PetalBot is absent for the
      // same class of reason: it is Huawei's search engine crawler, not an AI
      // training crawler, and blocking it only costs search visibility.
      {
        userAgent: AI_TRAINING_CRAWLERS,
        disallow: ['/'],
      },
      {
        userAgent: SCRAPERS,
        disallow: ['/'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
