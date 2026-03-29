import { unit1 } from '../src/data/course/units/unit-1-statics';

console.log('Unit:', unit1.id, unit1.title);
console.log('Lessons:', unit1.lessons.length);
let total = 0;
for (const l of unit1.lessons) {
  const qCount = l.questions.length;
  total += qCount;
  const ltype = l.type || 'standard';
  console.log(`  ${l.id} - ${l.title}: ${qCount} questions (${ltype})`);
  for (let qi = 0; qi < l.questions.length; qi++) {
    const q = l.questions[qi];
    if (!q || !q.id) {
      console.error(`    BAD QUESTION at index ${qi}:`, q);
    }
  }
}
console.log('Total questions:', total);
console.log('All unit-1 questions validated.');
