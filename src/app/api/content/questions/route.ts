import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { practiceQuestions } from '@/lib/db/schema';

export async function GET() {
  const rows = await db
    .select()
    .from(practiceQuestions)
    .orderBy(asc(practiceQuestions.orderIndex));

  const questions = rows.map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { typeData, orderIndex, createdAt, updatedAt, ...base } = row;

    // Merge typeData fields into the top-level object
    return {
      ...base,
      ...(typeData && typeof typeData === 'object' ? typeData : {}),
    };
  });

  return NextResponse.json({ questions });
}
