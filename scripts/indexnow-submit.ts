/**
 * Push every indexable URL to IndexNow.
 *
 *     npx tsx scripts/indexnow-submit.ts [baseUrl]
 *
 * IndexNow tells participating engines a URL changed instead of waiting for a
 * crawl. Bing, Yandex, Seznam and Naver consume it. Google does not, so this
 * complements Search Console rather than replacing it.
 *
 * URLs come from the sitemap, so this cannot advertise a path the sitemap
 * would not, and anything the indexability gate excludes stays excluded.
 */
import { buildSitemapEntries, allowAllUrls } from '@/lib/seo/sitemap-entries';

const INDEXNOW_KEY = '90fff5b4919accbf67d212bb22a8f7e5';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function main(): Promise<void> {
  const baseUrl = (process.argv[2] ?? 'https://octokeen.com').replace(/\/$/, '');
  const host = new URL(baseUrl).host;

  const urlList = buildSitemapEntries({ isIndexable: allowAllUrls }).map(entry => entry.url);

  console.log(`Submitting ${urlList.length} URLs for ${host}`);

  // Verify the key is actually reachable first. IndexNow rejects the whole
  // batch with 403 if it cannot fetch the key, and a silent 403 looks a lot
  // like success if you are not reading the status.
  const keyUrl = `${baseUrl}/${INDEXNOW_KEY}.txt`;
  const keyCheck = await fetch(keyUrl);
  const keyBody = (await keyCheck.text()).trim();

  if (!keyCheck.ok || keyBody !== INDEXNOW_KEY) {
    console.error(`Key file not serving correctly at ${keyUrl}`);
    console.error(`  status ${keyCheck.status}, body ${JSON.stringify(keyBody.slice(0, 60))}`);
    console.error('Deploy first. IndexNow fetches this to prove you own the host.');
    process.exit(1);
  }
  console.log(`Key verified at ${keyUrl}`);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: keyUrl, urlList }),
  });

  const body = await response.text();

  // 200 and 202 both mean accepted. 202 means the key is still being validated.
  if (response.status === 200 || response.status === 202) {
    console.log(`Accepted (${response.status}). ${urlList.length} URLs submitted.`);
    console.log('Bing and Yandex crawl on their own schedule; this removes the discovery delay, not the crawl.');
    return;
  }

  console.error(`Rejected (${response.status}): ${body.slice(0, 300)}`);
  process.exit(1);
}

void main();
