import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { jsonOk, jsonError } from '@/lib/api-helpers';

const UNITS_DIR = join(process.cwd(), 'public', 'images', 'course', 'units');
const IMAGE_EXTENSIONS = ['webp', 'png', 'jpg', 'svg'];
const UNSAFE_ID_CHARS = /[^a-zA-Z0-9_-]/g;

function devOnly(): NextResponse | null {
  if (process.env.NODE_ENV !== 'development') {
    return jsonError('Dev only', 403);
  }
  return null;
}

/** POST — upload an image for a unit header */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = devOnly();
  if (guard) return guard;

  const form = await req.formData();
  const unitId = form.get('unitId') as string | null;
  const file = form.get('file') as File | null;

  if (!unitId || !file) {
    return jsonError('unitId and file required', 400);
  }

  // Sanitize unitId to prevent path traversal
  const safe = unitId.replace(UNSAFE_ID_CHARS, '');
  if (!safe) {
    return jsonError('Invalid unitId', 400);
  }

  if (!existsSync(UNITS_DIR)) {
    await mkdir(UNITS_DIR, { recursive: true });
  }

  const ext = file.type === 'image/webp' ? 'webp'
    : file.type === 'image/png' ? 'png'
    : file.type === 'image/svg+xml' ? 'svg'
    : 'jpg';

  const filename = `${safe}.${ext}`;
  const filePath = join(UNITS_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const url = `/images/course/units/${filename}?t=${Date.now()}`;
  return jsonOk({ url });
}

/** DELETE — remove a unit's header image override */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const guard = devOnly();
  if (guard) return guard;

  const { unitId } = (await req.json()) as { unitId?: string };
  if (!unitId) {
    return jsonError('unitId required', 400);
  }

  const safe = unitId.replace(UNSAFE_ID_CHARS, '');
  if (!safe) {
    return jsonError('Invalid unitId', 400);
  }

  // Try common extensions
  for (const ext of IMAGE_EXTENSIONS) {
    const filePath = join(UNITS_DIR, `${safe}.${ext}`);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  }

  return jsonOk({ ok: true });
}
