const fs = require('fs');
let content = fs.readFileSync('src/data/course/units/unit-10-interview.ts', 'utf8');

// Define swaps: questionId -> new correctIndex
const swaps = {
  // Lesson 1: [1,12,7,1] -> ~[5,6,5,5]
  'u10-L1-Q4': 0, 'u10-L1-Q5': 0, 'u10-L1-Q9': 0, 'u10-L1-Q12': 0, 'u10-L1-Q24': 0,
  'u10-L1-Q7': 3, 'u10-L1-Q10': 3, 'u10-L1-Q15': 3, 'u10-L1-Q25': 3, 'u10-L1-Q27': 3,
  // Lesson 2: [0,14,5,1] -> ~[5,5,5,5]
  'u10-L2-Q1': 0, 'u10-L2-Q4': 0, 'u10-L2-Q8': 0, 'u10-L2-Q12': 0, 'u10-L2-Q22': 0,
  'u10-L2-Q10': 3, 'u10-L2-Q14': 3, 'u10-L2-Q19': 3, 'u10-L2-Q26': 3,
  // Lesson 3: [0,8,12,0] -> ~[5,5,5,5]
  'u10-L3-Q4': 0, 'u10-L3-Q5': 0, 'u10-L3-Q11': 0, 'u10-L3-Q17': 0, 'u10-L3-Q19': 0,
  'u10-L3-Q7': 3, 'u10-L3-Q10': 3, 'u10-L3-Q20': 3, 'u10-L3-Q24': 3, 'u10-L3-Q29': 3,
  // Lesson 4: [0,15,5,0] -> ~[5,5,5,5]
  'u10-L4-Q4': 0, 'u10-L4-Q7': 0, 'u10-L4-Q10': 0, 'u10-L4-Q16': 0, 'u10-L4-Q28': 0,
  'u10-L4-Q5': 3, 'u10-L4-Q8': 3, 'u10-L4-Q11': 3, 'u10-L4-Q17': 3, 'u10-L4-Q24': 3,
  // Lesson 5: [0,11,9,0] -> ~[5,5,5,5]
  'u10-L5-Q4': 0, 'u10-L5-Q10': 0, 'u10-L5-Q12': 0, 'u10-L5-Q14': 0, 'u10-L5-Q22': 0,
  'u10-L5-Q8': 3, 'u10-L5-Q16': 3, 'u10-L5-Q17': 3, 'u10-L5-Q25': 3, 'u10-L5-Q28': 3,
  // Lesson 6: [1,14,4,0] -> ~[5,5,5,4]
  'u10-L6-Q1': 0, 'u10-L6-Q7': 0, 'u10-L6-Q14': 0, 'u10-L6-Q16': 0,
  'u10-L6-Q3': 3, 'u10-L6-Q11': 3, 'u10-L6-Q19': 3, 'u10-L6-Q26': 3,
};

let swapCount = 0;
let skipCount = 0;
let errorCount = 0;

for (const [qId, newIdx] of Object.entries(swaps)) {
  const idStr = "id: '" + qId + "'";
  const startPos = content.indexOf(idStr);
  if (startPos === -1) {
    console.log('NOT FOUND: ' + qId);
    errorCount++;
    continue;
  }

  // Find correctIndex in this question block (within next 3000 chars)
  const blockAfter = content.slice(startPos, startPos + 3000);
  const ciMatch = blockAfter.match(/correctIndex: (\d+)/);
  if (!ciMatch) {
    console.log('NO CI: ' + qId);
    errorCount++;
    continue;
  }
  const oldIdx = parseInt(ciMatch[1]);
  if (oldIdx === newIdx) {
    console.log('SKIP: ' + qId + ' already at ' + newIdx);
    skipCount++;
    continue;
  }

  // Find options array
  const optionsIdx = blockAfter.indexOf('options: [');
  if (optionsIdx === -1) {
    console.log('NO OPTIONS: ' + qId);
    errorCount++;
    continue;
  }

  // Find the range of the options array in the full content
  const optAbsStart = startPos + optionsIdx;

  // Find matching ]
  let depth = 0;
  let optAbsEnd = -1;
  for (let i = optAbsStart + 'options: ['.length - 1; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) {
        optAbsEnd = i + 1;
        break;
      }
    }
  }

  if (optAbsEnd === -1) {
    console.log('CANT FIND END: ' + qId);
    errorCount++;
    continue;
  }

  const optionsBlock = content.slice(optAbsStart, optAbsEnd);

  // Parse the 4 options. Each option is a line starting with whitespace + quote
  // They might be multi-line (though unlikely in this format)
  // Strategy: find the content between 'options: [\n' and the final '\n  ]'
  const innerStart = optionsBlock.indexOf('[\n') + 2;
  const innerEnd = optionsBlock.lastIndexOf('\n');
  const innerContent = optionsBlock.slice(innerStart, innerEnd);

  // Split options by finding top-level comma-separated quoted strings
  // Each option line is:   '...',  or   '...'  (last one no comma)
  const optionTexts = [];
  let current = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < innerContent.length; i++) {
    const ch = innerContent[i];
    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escaped = true;
      continue;
    }
    if (ch === "'" && !inString) {
      inString = true;
      current += ch;
      continue;
    }
    if (ch === "'" && inString) {
      inString = false;
      current += ch;
      // Now look for comma or end
      continue;
    }
    if (ch === ',' && !inString) {
      optionTexts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) optionTexts.push(current.trim());

  if (optionTexts.length !== 4) {
    console.log('WRONG COUNT (' + optionTexts.length + '): ' + qId);
    // Try to debug
    console.log('Inner content length:', innerContent.length);
    console.log('First 200 chars:', innerContent.slice(0, 200));
    errorCount++;
    continue;
  }

  // Swap options at oldIdx and newIdx
  const temp = optionTexts[oldIdx];
  optionTexts[oldIdx] = optionTexts[newIdx];
  optionTexts[newIdx] = temp;

  // Get the indentation from the original
  const indentMatch = innerContent.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : '            ';
  const closingIndent = optionsBlock.match(/(\s*)\]$/);
  const closeIndent = closingIndent ? closingIndent[1] : '          ';

  // Rebuild options block
  const newOptionsBlock = 'options: [\n' +
    optionTexts.map((opt, i) => indent + opt + (i < 3 ? ',' : '')).join('\n') +
    '\n' + closeIndent + ']';

  // Replace in content
  content = content.slice(0, optAbsStart) + newOptionsBlock + content.slice(optAbsEnd);

  // Update correctIndex - find it again since positions shifted
  const newStartPos = content.indexOf(idStr);
  const newBlockAfter = content.slice(newStartPos, newStartPos + 3000);
  const oldCiStr = 'correctIndex: ' + oldIdx;
  const newCiStr = 'correctIndex: ' + newIdx;
  const ciPosInBlock = newBlockAfter.indexOf(oldCiStr);
  if (ciPosInBlock === -1) {
    console.log('CANT FIND CI TO UPDATE: ' + qId);
    errorCount++;
    continue;
  }
  const ciAbsPos = newStartPos + ciPosInBlock;
  content = content.slice(0, ciAbsPos) + newCiStr + content.slice(ciAbsPos + oldCiStr.length);

  swapCount++;
  console.log('OK: ' + qId + ' ' + oldIdx + '->' + newIdx);
}

fs.writeFileSync('src/data/course/units/unit-10-interview.ts', content);
console.log('\nSwapped: ' + swapCount + ', Skipped: ' + skipCount + ', Errors: ' + errorCount);
