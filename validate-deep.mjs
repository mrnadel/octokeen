// Deep validator: check for issues that go beyond structural validity
// Run: node validate-deep.mjs

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const UNITS_DIR = 'src/data/course/units';
const files = readdirSync(UNITS_DIR).filter(f => f.endsWith('.ts'));
const issues = [];
let totalFillBlank = 0;

for (const file of files) {
  const filePath = join(UNITS_DIR, file);
  const content = readFileSync(filePath, 'utf-8');

  const idRegex = /id:\s*'([^']+)'/g;
  let idMatch;
  const questionPositions = [];

  while ((idMatch = idRegex.exec(content)) !== null) {
    const qId = idMatch[1];
    if (!qId.match(/Q\d+$/)) continue;
    questionPositions.push({ id: qId, index: idMatch.index });
  }

  for (const { id: qId, index: idIdx } of questionPositions) {
    let braceStart = content.lastIndexOf('{', idIdx);
    if (braceStart === -1) continue;

    let depth = 0, i = braceStart;
    let inSingle = false, inDouble = false, inTemplate = false;
    for (; i < content.length; i++) {
      const ch = content[i], prev = i > 0 ? content[i - 1] : '';
      if (inTemplate) { if (ch === '`' && prev !== '\\') inTemplate = false; continue; }
      if (inSingle) { if (ch === "'" && prev !== '\\') inSingle = false; continue; }
      if (inDouble) { if (ch === '"' && prev !== '\\') inDouble = false; continue; }
      if (ch === '`') { inTemplate = true; continue; }
      if (ch === "'") { inSingle = true; continue; }
      if (ch === '"') { inDouble = true; continue; }
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;
    const block = content.substring(braceStart, i + 1);

    const typeMatch = block.match(/type:\s*'(multiple-choice|true-false|fill-blank)'/);
    if (!typeMatch) continue;
    const qType = typeMatch[1];

    const getStringProp = (prop) => {
      const propRe = new RegExp('(?:^|[,\\n\\s{])' + prop + '\\s*:', 'm');
      const pm = propRe.exec(block);
      if (!pm) return null;
      const afterColon = block.substring(pm.index + pm[0].length).trimStart();
      const fc = afterColon[0];
      if (fc === "'") { const m = afterColon.match(/^'((?:[^'\\]|\\.)*)'/s); return m ? m[1] : null; }
      if (fc === '"') { const m = afterColon.match(/^"((?:[^"\\]|\\.)*)"/s); return m ? m[1] : null; }
      if (fc === '`') { const end = afterColon.indexOf('`', 1); return end !== -1 ? afterColon.substring(1, end) : null; }
      const trimmed = afterColon.replace(/^\n\s*/, '');
      const fc2 = trimmed[0];
      if (fc2 === "'") { const m = trimmed.match(/^'((?:[^'\\]|\\.)*)'/s); return m ? m[1] : null; }
      if (fc2 === '"') { const m = trimmed.match(/^"((?:[^"\\]|\\.)*)"/s); return m ? m[1] : null; }
      if (fc2 === '`') { const end = trimmed.indexOf('`', 1); return end !== -1 ? trimmed.substring(1, end) : null; }
      return null;
    };

    const getStringArray = (prop) => {
      const propRe = new RegExp('(?:^|[,\\n\\s{])' + prop + '\\s*:\\s*\\[', 'm');
      const pm = propRe.exec(block);
      if (!pm) return null;
      const bracketStart = block.indexOf('[', pm.index);
      if (bracketStart === -1) return null;
      let d = 0, inS = false, inD = false, inT = false;
      for (let j = bracketStart; j < block.length; j++) {
        const c = block[j], p = j > 0 ? block[j - 1] : '';
        if (inT) { if (c === '`' && p !== '\\') inT = false; continue; }
        if (inS) { if (c === "'" && p !== '\\') inS = false; continue; }
        if (inD) { if (c === '"' && p !== '\\') inD = false; continue; }
        if (c === '`') { inT = true; continue; }
        if (c === "'") { inS = true; continue; }
        if (c === '"') { inD = true; continue; }
        if (c === '[') d++;
        if (c === ']') { d--; if (d === 0) {
          const arrStr = block.substring(bracketStart + 1, j);
          const entries = [];
          const strRe = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
          let sm;
          while ((sm = strRe.exec(arrStr)) !== null) entries.push(sm[1] !== undefined ? sm[1] : sm[2]);
          return entries;
        }}
      }
      return null;
    };

    if (qType === 'fill-blank') {
      totalFillBlank++;
      const question = getStringProp('question');
      const blanks = getStringArray('blanks');
      const wordBank = getStringArray('wordBank');

      if (!blanks || !wordBank || !question) continue;

      const blankCount = question.split('_____').length - 1;

      // 1. Duplicate blank answers needing more wordBank entries
      const blanksLower = blanks.map(b => b.toLowerCase());
      const blanksUnique = [...new Set(blanksLower)];
      for (const ub of blanksUnique) {
        const neededCount = blanksLower.filter(b => b === ub).length;
        const availCount = wordBank.filter(w => w.toLowerCase() === ub).length;
        if (neededCount > availCount) {
          issues.push({ file, id: qId, issue: `BLOCKING: blank answer "${ub}" needed ${neededCount}x but wordBank only has it ${availCount}x — user cannot fill all blanks` });
        }
      }

      // 2. Blank count mismatch
      if (blankCount !== blanks.length) {
        issues.push({ file, id: qId, issue: `BLOCKING: ${blankCount} _____ placeholders vs ${blanks.length} blanks entries` });
      }

      // 3. WordBank missing correct answer entirely
      for (const b of blanks) {
        if (!wordBank.some(w => w.toLowerCase() === b.toLowerCase())) {
          issues.push({ file, id: qId, issue: `BLOCKING: correct answer "${b}" is NOT in wordBank at all` });
        }
      }

      // 4. Check for weird characters in blanks that might cause matching issues
      for (const b of blanks) {
        // Check for non-ASCII that might be visually similar but different Unicode points
        // e.g., em-dash vs en-dash, curly quotes vs straight quotes
        if (/[\u2013\u2014\u2018\u2019\u201C\u201D]/.test(b)) {
          issues.push({ file, id: qId, issue: `WARNING: blank "${b}" contains special Unicode chars (dashes/quotes) that may cause matching issues` });
        }
      }

      // 5. Check wordBank for entries that are substrings of each other (confusing)
      // Not a bug but useful to note

      // 6. Question ends with _____ but no trailing text - check rendering
      if (question.endsWith('_____')) {
        // This is fine for rendering, just noting it
      }
    }
  }
}

console.log(`Scanned ${totalFillBlank} fill-blank questions.\n`);

if (issues.length === 0) {
  console.log('No blocking issues found.');
} else {
  const unique = [];
  const seen = new Set();
  for (const issue of issues) {
    const key = `${issue.id}|${issue.issue}`;
    if (!seen.has(key)) { seen.add(key); unique.push(issue); }
  }
  console.log(`Found ${unique.length} issue(s):\n`);
  for (const issue of unique) {
    console.log(`BROKEN: [${issue.id}] in [${issue.file}] — ${issue.issue}`);
  }
}
