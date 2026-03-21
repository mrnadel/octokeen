import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { prepare: false });

async function verify() {
  const units = await sql`SELECT count(*) FROM course_units`;
  const lessons = await sql`SELECT count(*) FROM course_lessons`;
  const cQuestions = await sql`SELECT count(*) FROM course_questions`;
  const pQuestions = await sql`SELECT count(*) FROM practice_questions`;

  console.log('course_units:', units[0].count);
  console.log('course_lessons:', lessons[0].count);
  console.log('course_questions:', cQuestions[0].count);
  console.log('practice_questions:', pQuestions[0].count);

  await sql.end();
}

verify();
