// Comprehensive question validator
// Run: node validate-questions.mjs

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const UNITS_DIR = 'src/data/course/units';
const files = readdirSync(UNITS_DIR).filter(f => f.endsWith('.ts'));

const issues = [];
let totalQuestions = 0;
const fileCounts = {};

for (const file of files) {
  const filePath = join(UNITS_DIR, file);
  const content = readFileSync(filePath, 'utf-8');
  let fileQ = 0;

  // Find all question IDs
  const idRegex = /id:\s*'([^']+)'/g;
  let idMatch;
  const questionPositions = [];

  while ((idMatch = idRegex.exec(content)) !== null) {
    const qId = idMatch[1];
    if (!qId.match(/Q\d+$/)) continue;
    questionPositions.push({ id: qId, index: idMatch.index });
  }

  for (const { id: qId, index: idIdx } of questionPositions) {
    totalQuestions++;
    fileQ++;

    // Find opening brace
    let braceStart = content.lastIndexOf('{', idIdx);
    if (braceStart === -1) { issues.push({ file, id: qId, issue: 'No opening brace' }); continue; }

    // Find matching closing brace with proper string handling
    let depth = 0, i = braceStart;
    let inSingle = false, inDouble = false, inTemplate = false;

    for (; i < content.length; i++) {
      const ch = content[i];
      const prev = i > 0 ? content[i - 1] : '';
      if (inTemplate) { if (ch === '`' && prev !== '\\') inTemplate = false; continue; }
      if (inSingle) { if (ch === "'" && prev !== '\\') inSingle = false; continue; }
      if (inDouble) { if (ch === '"' && prev !== '\\') inDouble = false; continue; }
      if (ch === '`') { inTemplate = true; continue; }
      if (ch === "'") { inSingle = true; continue; }
      if (ch === '"') { inDouble = true; continue; }
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
    }

    if (depth !== 0) { issues.push({ file, id: qId, issue: 'Brace matching failed' }); continue; }
    const block = content.substring(braceStart, i + 1);

    // Extract type
    const typeMatch = block.match(/type:\s*'(multiple-choice|true-false|fill-blank)'/);
    if (!typeMatch) { issues.push({ file, id: qId, issue: 'No recognized type' }); continue; }
    const qType = typeMatch[1];

    // Robust string extraction
    const getStringProp = (prop) => {
      const propRe = new RegExp('(?:^|[,\\n\\s{])' + prop + '\\s*:', 'm');
      const pm = propRe.exec(block);
      if (!pm) return null;
      const afterColon = block.substring(pm.index + pm[0].length).trimStart();

      const fc = afterColon[0];
      if (fc === "'") { const m = afterColon.match(/^'((?:[^'\\]|\\.)*)'/s); return m ? m[1] : null; }
      if (fc === '"') { const m = afterColon.match(/^"((?:[^"\\]|\\.)*)"/s); return m ? m[1] : null; }
      if (fc === '`') { const end = afterColon.indexOf('`', 1); return end !== -1 ? afterColon.substring(1, end) : null; }
      // multiline value
      const trimmed = afterColon.replace(/^\n\s*/, '');
      const fc2 = trimmed[0];
      if (fc2 === "'") { const m = trimmed.match(/^'((?:[^'\\]|\\.)*)'/s); return m ? m[1] : null; }
      if (fc2 === '"') { const m = trimmed.match(/^"((?:[^"\\]|\\.)*)"/s); return m ? m[1] : null; }
      if (fc2 === '`') { const end = trimmed.indexOf('`', 1); return end !== -1 ? trimmed.substring(1, end) : null; }
      return null;
    };

    const getNumberProp = (prop) => {
      const re = new RegExp('(?:^|[,\\n\\s{])' + prop + '\\s*:\\s*(\\d+)', 'm');
      const m = block.match(re);
      return m ? parseInt(m[1]) : null;
    };

    const getBoolProp = (prop) => {
      const re = new RegExp('(?:^|[,\\n\\s{])' + prop + '\\s*:\\s*(true|false)', 'm');
      const m = block.match(re);
      return m ? m[1] === 'true' : null;
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
        if (c === ']') {
          d--;
          if (d === 0) {
            const arrStr = block.substring(bracketStart + 1, j);
            const entries = [];
            const strRe = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
            let sm;
            while ((sm = strRe.exec(arrStr)) !== null) {
              entries.push(sm[1] !== undefined ? sm[1] : sm[2]);
            }
            return entries;
          }
        }
      }
      return null;
    };

    const question = getStringProp('question');
    const explanation = getStringProp('explanation');

    // Common checks
    if (!question || question.trim() === '') {
      issues.push({ file, id: qId, issue: 'Question text is empty' });
    }
    if (!explanation || explanation.trim() === '') {
      issues.push({ file, id: qId, issue: 'Explanation is empty' });
    }

    if (qType === 'fill-blank') {
      const blanks = getStringArray('blanks');
      const wordBank = getStringArray('wordBank');

      if (!blanks) {
        issues.push({ file, id: qId, issue: 'fill-blank has NO blanks array' });
      } else {
        const blankCount = (question || '').split('_____').length - 1;

        if (blankCount === 0) {
          issues.push({ file, id: qId, issue: `fill-blank has NO _____ placeholders. Q: "${(question || '').substring(0, 100)}"` });
        }
        if (blanks.length === 0) {
          issues.push({ file, id: qId, issue: 'blanks array is empty' });
        }
        if (blankCount > 0 && blanks.length > 0 && blankCount !== blanks.length) {
          issues.push({ file, id: qId, issue: `MISMATCH: ${blankCount} _____ in text but ${blanks.length} in blanks array` });
        }
        for (let bi = 0; bi < blanks.length; bi++) {
          if (!blanks[bi] || blanks[bi].trim() === '') {
            issues.push({ file, id: qId, issue: `blanks[${bi}] is empty` });
          }
        }

        if (wordBank) {
          // Check that EVERY correct answer exists in the wordBank (case-insensitive)
          for (const b of blanks) {
            if (!wordBank.some(w => w.toLowerCase() === b.toLowerCase())) {
              issues.push({ file, id: qId, issue: `Correct answer "${b}" NOT in wordBank [${wordBank.join(', ')}]` });
            }
          }
          // Check for duplicate blanks answers that would consume the same word
          const blanksLower = blanks.map(b => b.toLowerCase());
          const blanksUnique = [...new Set(blanksLower)];
          for (const ub of blanksUnique) {
            const neededCount = blanksLower.filter(b => b === ub).length;
            const availCount = wordBank.filter(w => w.toLowerCase() === ub).length;
            if (neededCount > availCount) {
              issues.push({ file, id: qId, issue: `Need "${ub}" ${neededCount}x in blanks but wordBank only has it ${availCount}x` });
            }
          }
          // Check wordBank has at least as many words as blanks
          if (wordBank.length < blanks.length) {
            issues.push({ file, id: qId, issue: `wordBank (${wordBank.length}) smaller than blanks (${blanks.length})` });
          }
        } else {
          issues.push({ file, id: qId, issue: 'fill-blank has no wordBank' });
        }
      }
    }

    if (qType === 'multiple-choice') {
      const options = getStringArray('options');
      const correctIndex = getNumberProp('correctIndex');

      if (!options) {
        issues.push({ file, id: qId, issue: 'MC has NO options array' });
      } else {
        if (options.length < 2) {
          issues.push({ file, id: qId, issue: `MC has only ${options.length} option(s)` });
        }
        if (correctIndex === null) {
          issues.push({ file, id: qId, issue: 'MC has no correctIndex' });
        } else if (correctIndex < 0 || correctIndex >= options.length) {
          issues.push({ file, id: qId, issue: `correctIndex ${correctIndex} out of bounds (${options.length} options)` });
        }
        // Empty options
        for (let oi = 0; oi < options.length; oi++) {
          if (!options[oi] || options[oi].trim() === '') {
            issues.push({ file, id: qId, issue: `options[${oi}] is empty` });
          }
        }
        // Duplicates
        const lower = options.map(o => o.toLowerCase().trim());
        const seen = new Set();
        for (const o of lower) {
          if (seen.has(o)) { issues.push({ file, id: qId, issue: 'Duplicate options' }); break; }
          seen.add(o);
        }
      }
    }

    if (qType === 'true-false') {
      const correctAnswer = getBoolProp('correctAnswer');
      if (correctAnswer === null) {
        issues.push({ file, id: qId, issue: 'TF has no correctAnswer' });
      }
    }
  }

  fileCounts[file] = fileQ;
}

console.log(`Total questions scanned: ${totalQuestions}`);
console.log('Per file:');
for (const [f, c] of Object.entries(fileCounts).sort()) {
  console.log(`  ${f}: ${c}`);
}

if (issues.length === 0) {
  console.log('\nNo structural issues found in any question data.');
} else {
  const unique = [];
  const seen = new Set();
  for (const issue of issues) {
    const key = `${issue.id}|${issue.issue}`;
    if (!seen.has(key)) { seen.add(key); unique.push(issue); }
  }
  console.log(`\nFound ${unique.length} issue(s):\n`);
  for (const issue of unique) {
    console.log(`BROKEN: [${issue.id}] in [${issue.file}] — ${issue.issue}`);
  }
}
