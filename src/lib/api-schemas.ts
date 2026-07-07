import { z } from 'zod';

export const emailSchema = z.string().email();
export const userIdSchema = z.string().uuid();
export const confirmationSchema = z.object({ confirmation: z.string() });
/** Available for API routes that need pagination query params. */
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});
