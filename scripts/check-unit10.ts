import { unit10 } from '../src/data/course/units/unit-10-interview';

let issues = 0;
for (const lesson of unit10.lessons) {
  for (let i = 0; i < lesson.questions.length; i++) {
    const q = lesson.questions[i];
    if (!q || !q.id) {
      console.log('PROBLEM:', lesson.id, 'idx', i, 'value:', q);
      issues++;
    }
  }
  const types = lesson.questions.map(q => q.type);
  const uniqueTypes = [...new Set(types)];
  console.log(`${lesson.id}: ${lesson.questions.length} qs, types: ${uniqueTypes.join(', ')}`);
}
console.log(`\nTotal lessons: ${unit10.lessons.length}`);
console.log(`Issues found: ${issues}`);

// Check conversation
const conv = unit10.lessons.find(l => l.type === 'conversation');
if (conv) {
  console.log(`\nConversation: ${conv.id}, nodes: ${conv.conversationNodes?.length}`);
}

// Check speed-round
const speed = unit10.lessons.find(l => l.type === 'speed-round');
if (speed) {
  console.log(`Speed-round: ${speed.id}, questions: ${speed.speedQuestions?.length}, timeLimit: ${speed.speedTimeLimit}`);
}
