import { NextRequest, NextResponse } from 'next/server';

const MIXPANEL_API = 'https://api-js.mixpanel.com';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = path.join('/');
  const search = req.nextUrl.searchParams.toString();
  const body = await req.text();

  const resp = await fetch(`${MIXPANEL_API}/${endpoint}?${search}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await resp.text();
  return new NextResponse(data, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
