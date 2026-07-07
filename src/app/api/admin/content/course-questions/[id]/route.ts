import { contentManagedError } from '@/lib/api/content-managed-response';

export async function PUT() {
  return contentManagedError();
}

export async function DELETE() {
  return contentManagedError();
}
