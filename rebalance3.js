const fs = require('fs');
let content = fs.readFileSync('src/data/course/units/unit-10-interview.ts', 'utf8');

const swaps = {
  'u10-L1-Q14': 1,  // was 2->1
  'u10-L1-Q22': 1,  // was 2->1
};

for (const [qId, newIdx] of Object.entries(swaps)) {
  const idStr = "id: '" + qId + "'";
  const startPos = content.indexOf(idStr);
  if (startPos === -1) { console.log('NOT FOUND: ' + qId); continue; }

  const blockAfter = content.slice(startPos, startPos + 3000);
  const ciMatch = blockAfter.match(/correctIndex: (\d+)/);
  if (!ciMatch) { console.log('NO CI: ' + qId); continue; }
  const oldIdx = parseInt(ciMatch[1]);
  if (oldIdx === newIdx) { console.log('SKIP: ' + qId); continue; }

  const optionsIdx = blockAfter.indexOf('options: [');
  if (optionsIdx === -1) { console.log('NO OPTIONS: ' + qId); continue; }

  const optAbsStart = startPos + optionsIdx;
  let depth = 0;
  let optAbsEnd = -1;
  for (let i = optAbsStart + 'options: ['.length - 1; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') { depth--; if (depth === 0) { optAbsEnd = i + 1; break; } }
  }
  if (optAbsEnd === -1) { console.log('CANT FIND END: ' + qId); continue; }

  const optionsBlock = content.slice(optAbsStart, optAbsEnd);
  const innerStart = optionsBlock.indexOf('[\n') + 2;
  const innerEnd = optionsBlock.lastIndexOf('\n');
  const innerContent = optionsBlock.slice(innerStart, innerEnd);

  const optionTexts = [];
  let current = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < innerContent.length; i++) {
    const ch = innerContent[i];
    if (escaped) { current += ch; escaped = false; continue; }
    if (ch === '\\') { current += ch; escaped = true; continue; }
    if (ch === "'" && !inString) { inString = true; current += ch; continue; }
    if (ch === "'" && inString) { inString = false; current += ch; continue; }
    if (ch === ',' && !inString) { optionTexts.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) optionTexts.push(current.trim());

  if (optionTexts.length !== 4) { console.log('WRONG COUNT (' + optionTexts.length + '): ' + qId); continue; }

  const temp = optionTexts[oldIdx];
  optionTexts[oldIdx] = optionTexts[newIdx];
  optionTexts[newIdx] = temp;

  const indentMatch = innerContent.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : '            ';
  const closingIndent = optionsBlock.match(/(\s*)\]$/);
  const closeIndent = closingIndent ? closingIndent[1] : '          ';

  const newOptionsBlock = 'options: [\n' +
    optionTexts.map((opt, i) => indent + opt + (i < 3 ? ',' : '')).join('\n') +
    '\n' + closeIndent + ']';

  content = content.slice(0, optAbsStart) + newOptionsBlock + content.slice(optAbsEnd);

  const newStartPos = content.indexOf(idStr);
  const newBlockAfter = content.slice(newStartPos, newStartPos + 3000);
  const oldCiStr = 'correctIndex: ' + oldIdx;
  const newCiStr = 'correctIndex: ' + newIdx;
  const ciPosInBlock = newBlockAfter.indexOf(oldCiStr);
  if (ciPosInBlock === -1) { console.log('CANT FIND CI: ' + qId); continue; }
  const ciAbsPos = newStartPos + ciPosInBlock;
  content = content.slice(0, ciAbsPos) + newCiStr + content.slice(ciAbsPos + oldCiStr.length);

  console.log('OK: ' + qId + ' ' + oldIdx + '->' + newIdx);
}

fs.writeFileSync('src/data/course/units/unit-10-interview.ts', content);
console.log('Done!');
