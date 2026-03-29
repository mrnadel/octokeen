import { unit10 } from '../src/data/course/units/unit-10-interview';

console.log('=== Unit 10 Final Validation ===\n');
console.log(`Unit: ${unit10.title} (${unit10.id})`);
console.log(`Total lessons: ${unit10.lessons.length}\n`);

let totalQuestions = 0;
const allTypes = new Set<string>();

for (const l of unit10.lessons) {
  const types = new Set(l.questions.map(q => q.type));
  const nonTeaching = l.questions.filter(q => q.type !== 'teaching');
  const teachingCount = l.questions.filter(q => q.type === 'teaching').length;
  totalQuestions += l.questions.length;

  for (const t of types) allTypes.add(t);

  const typeStr = l.type ? ` [${l.type}]` : '';
  const convInfo = l.conversationNodes ? ` conv:${l.conversationNodes.length}nodes` : '';
  const speedInfo = l.speedQuestions ? ` speed:${l.speedQuestions.length}qs/${l.speedTimeLimit}s` : '';

  console.log(`  ${l.id}: ${l.title}${typeStr}`);
  console.log(`    ${l.questions.length} items (${teachingCount} teaching, ${nonTeaching.length} questions)${convInfo}${speedInfo}`);
  console.log(`    Types: ${[...types].join(', ')}`);
}

console.log(`\nTotal questions across all lessons: ${totalQuestions}`);
console.log(`All question types used: ${[...allTypes].join(', ')}`);

// Check conversation decision points
const conv = unit10.lessons.find(l => l.type === 'conversation');
if (conv && conv.conversationNodes) {
  const decisions = conv.conversationNodes.filter(n => n.options && n.options.length > 0);
  console.log(`\nConversation: ${decisions.length} decision points`);
  for (const d of decisions) {
    const qualities = d.options!.map(o => o.quality);
    console.log(`  ${d.id}: ${qualities.join(', ')}`);
  }
}

// Check speed round
const speed = unit10.lessons.find(l => l.type === 'speed-round');
if (speed && speed.speedQuestions) {
  console.log(`\nSpeed round: ${speed.speedQuestions.length} questions, ${speed.speedTimeLimit}s`);
}

console.log('\n=== Validation Complete ===');
