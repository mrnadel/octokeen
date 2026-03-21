const fs = require('fs');

const files = [
  'src/data/course/units/unit-4-thermo.ts',
  'src/data/course/units/unit-5-heat.ts',
  'src/data/course/units/unit-6-fluids.ts',
];

const basePath = '/c/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

for (const file of files) {
  const content = fs.readFileSync(basePath + file, 'utf8');

  const questionRegex = /id:\s*'([^']+)',\s*\n\s*type:\s*'multiple-choice',[\s\S]*?options:\s*\[([\s\S]*?)\],\s*\n\s*correctIndex:\s*(\d+)/g;

  let match;
  let totalMC = 0;
  let biasedCount = 0;

  while ((match = questionRegex.exec(content)) !== null) {
    const id = match[1];
    const optionsBlock = match[2];
    const correctIndex = parseInt(match[3]);

    const optionStrings = [];
    let inQuote = false;
    let current = '';
    let escaped = false;
    for (let i = 0; i < optionsBlock.length; i++) {
      const ch = optionsBlock[i];
      if (escaped) {
        current += ch;
        escaped = false;
        continue;
      }
      if (ch === '\') {
        escaped = true;
        current += ch;
        continue;
      }
      if (ch === "'" && !inQuote) {
        inQuote = true;
        current = '';
        continue;
      }
      if (ch === "'" && inQuote) {
        inQuote = false;
        optionStrings.push(current);
        continue;
      }
      if (inQuote) {
        current += ch;
      }
    }

    if (optionStrings.length < 3) continue;

    totalMC++;
    const correctLen = optionStrings[correctIndex].length;
    const wrongLens = optionStrings.filter((_, i) => i !== correctIndex).map(s => s.length);
    const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;

    const ratio = correctLen / avgWrongLen;
    const biased = ratio > 1.3;

    if (biased) {
      biasedCount++;
      console.log(id + ': correct=' + correctLen + ' avgWrong=' + Math.round(avgWrongLen) + ' ratio=' + ratio.toFixed(2) + ' lens=[' + optionStrings.map(s=>s.length).join(',') + '] ci=' + correctIndex);
    }
  }

  console.log('\n' + file + ': ' + biasedCount + '/' + totalMC + ' biased (' + Math.round(biasedCount/totalMC*100) + '%)\n');
}
