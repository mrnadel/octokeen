import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { pushSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const unsubscribeSchema = z.object({
  endpoint: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = unsubscribeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }
  const { endpoint } = parsed.data;

  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));

  return NextResponse.json({ ok: true });
}
