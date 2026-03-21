const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'src', 'data', 'course', 'units');

for (const file of ['unit-1-statics.ts', 'unit-2-dynamics.ts', 'unit-3-strength.ts']) {
  const content = fs.readFileSync(path.join(base, file), 'utf-8');
  const lines = content.split('\n');
  let totalMC = 0, biasedCount = 0;
  const biased = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].match(/type:\s*['"]multiple-choice['"]/)) continue;
    totalMC++;

    let qId = 'unknown';
    for (let j = Math.max(0, i - 5); j <= i; j++) {
      const m = lines[j].match(/id:\s*'([^']+)'/);
      if (m) { qId = m[1]; break; }
    }

    let optionsStart = -1;
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      if (lines[j].match(/^\s*options:\s*\[/)) { optionsStart = j; break; }
    }
    if (optionsStart === -1) continue;
    let depth = 0, optionsEnd = -1, foundOpen = false;
    for (let j = optionsStart; j < Math.min(optionsStart + 30, lines.length); j++) {
      for (const ch of lines[j]) {
        if (ch === '[') { depth++; foundOpen = true; }
        if (ch === ']') { depth--; }
      }
      if (foundOpen && depth === 0) { optionsEnd = j; break; }
    }
    if (optionsEnd === -1) continue;
    let correctIndex = -1;
    for (let j = optionsEnd; j < Math.min(optionsEnd + 5, lines.length); j++) {
      const m = lines[j].match(/correctIndex:\s*(\d+)/);
      if (m) { correctIndex = parseInt(m[1]); break; }
    }
    if (correctIndex === -1) continue;
    const block = lines.slice(optionsStart, optionsEnd + 1).join('\n');
    const options = [];
    let inStr = false, cur = '', escaped = false;
    for (let ci = 0; ci < block.length; ci++) {
      const ch = block[ci];
      if (escaped) { if (inStr) cur += ch; escaped = false; continue; }
      if (ch === '\\') { escaped = true; if (inStr) cur += ch; continue; }
      if (ch === "'") {
        if (!inStr) { inStr = true; cur = ''; }
        else { inStr = false; options.push(cur); }
        continue;
      }
      if (inStr) cur += ch;
    }
    if (options.length !== 4) continue;
    const correctLen = options[correctIndex].length;
    const wrongLens = options.filter((_, idx) => idx !== correctIndex).map(o => o.length);
    const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;
    const ratio = correctLen / avgWrongLen;
    if (ratio > 1.3) {
      biasedCount++;
      biased.push({ qId, ratio: ratio.toFixed(2) });
    }
  }

  const pct = Math.round(100 * biasedCount / totalMC);
  const status = pct <= 15 ? 'PASS' : 'FAIL';
  console.log(`${file}: ${biasedCount}/${totalMC} biased (${pct}%) [${status}]`);
  if (biased.length > 0) {
    biased.forEach(b => console.log(`  - ${b.qId} ratio=${b.ratio}`));
  }
}
