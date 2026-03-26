import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { course } from '../src/data/course';
import type { Unit } from '../src/data/course/types';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Missing POSTGRES_URL in .env.local');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seedUnits(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], units: Unit[], label: string) {
  let totalUnits = 0;
  let totalLessons = 0;
  let totalQuestions = 0;

  for (let ui = 0; ui < units.length; ui++) {
    const unit = units[ui];

    // Upsert unit
    await tx.insert(schema.courseUnits).values({
      id: unit.id,
      title: unit.title,
      description: unit.description,
      color: unit.color,
      icon: unit.icon,
      orderIndex: ui,
    }).onConflictDoUpdate({
      target: schema.courseUnits.id,
      set: {
        title: unit.title,
        description: unit.description,
        color: unit.color,
        icon: unit.icon,
        orderIndex: ui,
        updatedAt: sql`now()`,
      },
    });
    totalUnits++;
    console.log(`  [${label}] Unit ${ui + 1}/${units.length}: ${unit.title}`);

    for (let li = 0; li < unit.lessons.length; li++) {
      const lesson = unit.lessons[li];

      // Upsert lesson
      await tx.insert(schema.courseLessons).values({
        id: lesson.id,
        unitId: unit.id,
        title: lesson.title,
        description: lesson.description,
        icon: lesson.icon,
        xpReward: lesson.xpReward,
        orderIndex: li,
      }).onConflictDoUpdate({
        target: schema.courseLessons.id,
        set: {
          unitId: unit.id,
          title: lesson.title,
          description: lesson.description,
          icon: lesson.icon,
          xpReward: lesson.xpReward,
          orderIndex: li,
          updatedAt: sql`now()`,
        },
      });
      totalLessons++;

      for (let qi = 0; qi < lesson.questions.length; qi++) {
        const q = lesson.questions[qi];

        // Convert boolean correctAnswer to string for the text column
        let correctAnswer: string | undefined;
        if (q.correctAnswer !== undefined) {
          correctAnswer = String(q.correctAnswer);
        }

        await tx.insert(schema.courseQuestions).values({
          id: q.id,
          lessonId: lesson.id,
          type: q.type,
          question: q.question,
          options: q.options ?? null,
          correctIndex: q.correctIndex ?? null,
          correctAnswer: correctAnswer ?? null,
          acceptedAnswers: q.acceptedAnswers ?? null,
          blanks: q.blanks ?? null,
          wordBank: q.wordBank ?? null,
          buckets: q.buckets ?? null,
          correctBuckets: q.correctBuckets ?? null,
          matchTargets: q.matchTargets ?? null,
          correctMatches: q.correctMatches ?? null,
          steps: q.steps ?? null,
          correctOrder: q.correctOrder ?? null,
          correctIndices: q.correctIndices ?? null,
          sliderMin: q.sliderMin ?? null,
          sliderMax: q.sliderMax ?? null,
          correctValue: q.correctValue ?? null,
          tolerance: q.tolerance ?? null,
          unit: q.unit ?? null,
          scenario: q.scenario ?? null,
          rankCriteria: q.rankCriteria ?? null,
          tapZones: q.tapZones ?? null,
          correctZoneId: q.correctZoneId ?? null,
          explanation: q.explanation,
          hint: q.hint ?? null,
          diagram: q.diagram ?? null,
          orderIndex: qi,
        }).onConflictDoUpdate({
          target: schema.courseQuestions.id,
          set: {
            lessonId: lesson.id,
            type: q.type,
            question: q.question,
            options: q.options ?? null,
            correctIndex: q.correctIndex ?? null,
            correctAnswer: correctAnswer ?? null,
            acceptedAnswers: q.acceptedAnswers ?? null,
            blanks: q.blanks ?? null,
            wordBank: q.wordBank ?? null,
            buckets: q.buckets ?? null,
            correctBuckets: q.correctBuckets ?? null,
            matchTargets: q.matchTargets ?? null,
            correctMatches: q.correctMatches ?? null,
            steps: q.steps ?? null,
            correctOrder: q.correctOrder ?? null,
            correctIndices: q.correctIndices ?? null,
            sliderMin: q.sliderMin ?? null,
            sliderMax: q.sliderMax ?? null,
            correctValue: q.correctValue ?? null,
            tolerance: q.tolerance ?? null,
            unit: q.unit ?? null,
            scenario: q.scenario ?? null,
            rankCriteria: q.rankCriteria ?? null,
            tapZones: q.tapZones ?? null,
            correctZoneId: q.correctZoneId ?? null,
            explanation: q.explanation,
            hint: q.hint ?? null,
            diagram: q.diagram ?? null,
            orderIndex: qi,
            updatedAt: sql`now()`,
          },
        });
        totalQuestions++;
      }
    }
  }

  console.log(`  [${label}] Upserted: ${totalUnits} units, ${totalLessons} lessons, ${totalQuestions} questions`);
}

/** Check if a value looks like a Unit object */
function isUnit(val: unknown): val is Unit {
  return (
    typeof val === 'object' &&
    val !== null &&
    'id' in val &&
    'title' in val &&
    'lessons' in val &&
    Array.isArray((val as Unit).lessons)
  );
}

/** Dynamically discover and load units from a profession's units/ directory */
async function loadProfessionUnits(professionDir: string): Promise<Unit[]> {
  const unitsDir = path.join(professionDir, 'units');
  if (!fs.existsSync(unitsDir)) return [];

  const unitFiles = fs.readdirSync(unitsDir)
    .filter(f => f.startsWith('unit-') && f.endsWith('.ts'))
    .sort((a, b) => {
      // Sort by numeric suffix: unit-1.ts, unit-2.ts, ..., unit-10.ts
      const numA = parseInt(a.match(/unit-(\d+)/)?.[1] ?? '0');
      const numB = parseInt(b.match(/unit-(\d+)/)?.[1] ?? '0');
      return numA - numB;
    });

  const units: Unit[] = [];
  for (const file of unitFiles) {
    const filePath = path.join(unitsDir, file);
    const mod = await import(filePath);
    // Find the Unit export (could be any name)
    for (const key of Object.keys(mod)) {
      if (isUnit(mod[key])) {
        units.push(mod[key]);
        break;
      }
    }
  }
  return units;
}

/** Discover all profession directories under src/data/course/professions/ */
function discoverProfessions(): { name: string; dir: string }[] {
  const professionsDir = path.resolve(__dirname, '../src/data/course/professions');
  if (!fs.existsSync(professionsDir)) return [];

  return fs.readdirSync(professionsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({
      name: d.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      dir: path.join(professionsDir, d.name),
    }));
}

async function main() {
  console.log('=== Starting content seed ===\n');

  try {
    // 1. Seed ME course (main course from src/data/course/index.ts)
    console.log('--- Seeding ME course content ---');
    await db.transaction(async (tx) => {
      await seedUnits(tx, course, 'ME');
    });
    console.log('--- ME course seeded successfully ---\n');

    // 2. Dynamically discover and seed all profession courses
    const professions = discoverProfessions();
    for (const prof of professions) {
      console.log(`--- Seeding ${prof.name} course content ---`);
      const units = await loadProfessionUnits(prof.dir);
      if (units.length === 0) {
        console.log(`  [${prof.name}] No unit files found, skipping.\n`);
        continue;
      }
      await db.transaction(async (tx) => {
        await seedUnits(tx, units, prof.name);
      });
      console.log(`--- ${prof.name} course seeded successfully ---\n`);
    }

    console.log('=== All content seeded successfully ===');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
