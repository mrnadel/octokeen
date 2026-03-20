import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return NextResponse.json({
    hasPassword: !!user?.passwordHash,
  });
}

export async function PATCH(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { displayName } = await request.json();

  if (!displayName || displayName.length < 2 || displayName.length > 50) {
    return NextResponse.json(
      { error: 'Display name must be 2-50 characters' },
      { status: 400 }
    );
  }

  await db
    .update(users)
    .set({ displayName, name: displayName, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return NextResponse.json({ ok: true });
}
