import { z } from 'zod';

/** A game-config value may be any JSON value except null/undefined. */
export const configValueSchema = z
  .unknown()
  .refine(v => v !== null && v !== undefined, { message: 'value must not be null' });
