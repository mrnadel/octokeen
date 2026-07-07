import { NextResponse } from 'next/server';

const CONTENT_MANAGED_MESSAGE =
  'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.';

/** Shared 405 response for content CRUD routes that are managed via TypeScript source files. */
export function contentManagedError(): NextResponse {
  return NextResponse.json({ error: CONTENT_MANAGED_MESSAGE }, { status: 405 });
}
