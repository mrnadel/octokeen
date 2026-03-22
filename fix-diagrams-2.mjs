// Second pass: Remove remaining mismatched flywheel diagrams
import { readFileSync, writeFileSync } from 'fs';

function processFile(filePath, idsToRemove) {
  let content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let fixes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('diagram:') && line.includes('<svg')) {
      let qid = '';
      for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
        const idMatch = lines[j].match(/id:\s*'([^']+)'/);
        if (idMatch && !qid) { qid = idMatch[1]; }
      }
      if (idsToRemove.includes(qid)) {
        fixes++;
        console.log(`REMOVED: ${qid}`);
        continue; // skip this line
      }
    }
    newLines.push(line);
  }

  writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`Fixed ${fixes} in ${filePath}`);
  return fixes;
}

// Unit 9: Generic flywheel on tolerance questions
const unit9Removals = [
  'u9-L1-Q11', // gear hub fit - flywheel diagram
  'u9-L1-Q14', // bore tolerancing - flywheel diagram
  'u9-L1-Q16', // basic size concept - flywheel diagram
  'u9-L1-Q19', // H7/H6 hole tolerance - flywheel diagram
];

// Unit 10: Generic flywheel on non-rotation questions
const unit10Removals = [
  'u10-L1-Q16', // shaft torque estimation - flywheel not shaft
  'u10-L1-Q18', // buckling load - flywheel not column
  'u10-L3-Q12', // stiffening ribs - flywheel irrelevant
  'u10-L5-Q27', // piping thermal expansion - flywheel irrelevant
];

console.log('=== Unit 9 ===');
processFile('src/data/course/units/unit-9-gdt.ts', unit9Removals);

console.log('\n=== Unit 10 ===');
processFile('src/data/course/units/unit-10-interview.ts', unit10Removals);
