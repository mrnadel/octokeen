import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseUnits } from '@/lib/db/schema';
import { jsonOk } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { contentManagedError } from '@/lib/api/content-managed-response';

export const GET = withAdminAuth(async () => {
  const units = await db
    .select()
    .from(courseUnits)
    .orderBy(asc(courseUnits.orderIndex));

  return jsonOk({ units });
});

export async function POST() {
  return contentManagedError();
}
