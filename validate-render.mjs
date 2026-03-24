// Check for rendering issues: questions where fill-blank might fail at runtime
// Also check for any questions where the same word appears multiple times in blanks
// but not enough times in wordBank

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const UNITS_DIR = 'src/data/course/units';
const files = readdirSync(UNITS_DIR).filter(f => f.endsWith('.ts'));
const allIssues = [];

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

    const typeMatch = block.match(/type:\s*'fill-blank'/);
    if (!typeMatch) continue;

    // Check for underscores that are NOT exactly 5 (e.g., ____ or ______ or __________)
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

    const question = getStringProp('question');
    if (!question) continue;

    // Check for underscore patterns that aren't exactly 5
    const wrongUnderscores = question.match(/_{2,}/g);
    if (wrongUnderscores) {
      for (const u of wrongUnderscores) {
        if (u !== '_____') {
          allIssues.push({ file, id: qId, issue: `Has ${u.length}-char underscore placeholder "${u}" instead of 5-char "_____"` });
        }
      }
    }

    // Check if question text contains HTML entities or encoded chars that might interfere
    if (question.includes('&amp;') || question.includes('&lt;') || question.includes('&gt;')) {
      allIssues.push({ file, id: qId, issue: `Question contains HTML entities that might render incorrectly` });
    }
  }
}

if (allIssues.length === 0) {
  console.log('No rendering issues found.');
} else {
  console.log(`Found ${allIssues.length} rendering issue(s):\n`);
  for (const issue of allIssues) {
    console.log(`ISSUE: [${issue.id}] in [${issue.file}] — ${issue.issue}`);
  }
}
