import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!);

const r = await sql`ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS placement_unit_index integer DEFAULT 0 NOT NULL`;
console.log('Migration applied successfully');

const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'course_progress' ORDER BY ordinal_position`;
console.log('Columns:', cols.map(c => c.column_name).join(', '));
