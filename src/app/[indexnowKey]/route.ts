import { NextResponse } from 'next/server';

/**
 * IndexNow key verification endpoint.
 *
 * IndexNow lets a site push "this URL changed" straight to participating
 * engines instead of waiting to be crawled. Bing, Yandex, Seznam and Naver
 * consume it; Google does not participate, so this complements Search Console
 * rather than replacing it.
 *
 * It matters more than Bing's search share suggests: Bing's index is what
 * ChatGPT search and Perplexity read from, so faster Bing indexing is the one
 * lever on AI-assistant visibility that needs no account and no API key. See
 * docs/seo/ai-visibility.md, which establishes that every realistic path to
 * being cited by an assistant reads from a search index.
 *
 * The protocol requires the key to be served as plain text at
 * https://<host>/<key>.txt. This route answers exactly that one path and 404s
 * everything else, so it cannot shadow a real route.
 */
const INDEXNOW_KEY = '90fff5b4919accbf67d212bb22a8f7e5';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ indexnowKey: string }> },
) {
  const { indexnowKey } = await params;

  if (indexnowKey !== `${INDEXNOW_KEY}.txt`) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
