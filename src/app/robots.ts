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
 * AI training and answer-engine crawlers. Blocking these is a deliberate owner
 * decision: it keeps course content out of model training sets at the cost of
 * visibility in AI answers. Do not change without the owner asking.
 */
const AI_CRAWLERS = ['GPTBot', 'ChatGPT-User', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'Bytespider', 'PetalBot', 'ImagesiftBot'];

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
      // Blocking it breaks every shared link's card.
      {
        userAgent: AI_CRAWLERS,
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
