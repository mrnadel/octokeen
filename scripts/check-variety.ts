import { unit10 } from '../src/data/course/units/unit-10-interview';

for (const l of unit10.lessons) {
  if (l.type === 'conversation' || l.type === 'speed-round') continue;
  const types = new Set(l.questions.filter(q => q.type !== 'teaching').map(q => q.type));
  const ok = types.size >= 3 ? 'OK' : 'FAIL';
  console.log(`${l.id}: ${types.size} non-teaching types [${ok}]: ${[...types].join(', ')}`);
}
