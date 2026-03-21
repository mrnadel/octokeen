const fs = require('fs');

const files = [
  'src/data/course/units/unit-1-statics.ts',
  'src/data/course/units/unit-3-strength.ts',
  'src/data/course/units/unit-7-materials.ts'
];

const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

for (const relFile of files) {
  const file = baseDir + relFile;
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  let mcCount = 0;
  let biasedCount = 0;
  let totalQuestions = 0;

  // Find each multiple-choice question by scanning lines
  let i = 0;
  while (i < lines.length) {
    if (lines[i].match(/type:\s*['"]multiple-choice['"]/)) {
      totalQuestions++;

      // Find options array start
      let optStart = -1;
      let ciLine = -1;
      let correctIndex = -1;

      for (let j = i + 1; j < Math.min(lines.length, i + 50); j++) {
        if (lines[j].match(/^\s*options:\s*\[/)) {
          optStart = j;
        }
        const ciMatch = lines[j].match(/correctIndex:\s*(\d+)/);
        if (ciMatch && ciLine === -1) {
          correctIndex = parseInt(ciMatch[1]);
          ciLine = j;
          break;
        }
      }

      if (optStart === -1 || correctIndex === -1) {
        i++;
        continue;
      }

      // Find the closing bracket of options array
      let optEnd = -1;
      let depth = 0;
      for (let j = optStart; j < ciLine; j++) {
        for (const ch of lines[j]) {
          if (ch === '[') depth++;
          if (ch === ']') {
            depth--;
            if (depth === 0) {
              optEnd = j;
              break;
            }
          }
        }
        if (optEnd !== -1) break;
      }

      if (optEnd === -1) {
        i++;
        continue;
      }

      // Extract option strings from lines optStart to optEnd
      let optionsBlock = '';
      for (let j = optStart; j <= optEnd; j++) {
        optionsBlock += lines[j] + '\n';
      }

      // Parse option strings - handle both ' and " quoted
      let options = [];
      let optLineNums = [];

      for (let j = optStart + 1; j <= optEnd; j++) {
        const trimmed = lines[j].trim();
        if (trimmed === '' || trimmed === '],' || trimmed === ']') continue;

        // Try to extract the string content
        // Patterns: 'text', "text", 'text',  "text",
        let strMatch;
        // Try single-quoted
        strMatch = trimmed.match(/^'((?:[^'\\]|\\.)*)'[,\s]*$/);
        if (!strMatch) {
          // Try double-quoted
          strMatch = trimmed.match(/^"((?:[^"\\]|\\.)*)"[,\s]*$/);
        }
        if (strMatch) {
          options.push(strMatch[1]);
          optLineNums.push(j);
        }
      }

      if (options.length !== 4 || correctIndex >= 4) {
        i++;
        continue;
      }

      mcCount++;

      const correctLen = options[correctIndex].length;
      const wrongLens = options.filter((_, idx) => idx !== correctIndex).map(o => o.length);
      const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;

      if (avgWrongLen === 0) {
        i++;
        continue;
      }

      const bias = (correctLen - avgWrongLen) / avgWrongLen;

      if (bias > 0.30) {
        biasedCount++;
        // Find the question ID
        let qid = 'unknown';
        for (let b = i; b >= Math.max(0, i - 10); b--) {
          const idMatch = lines[b].match(/id:\s*['"]([^'"]+)['"]/);
          if (idMatch) { qid = idMatch[1]; break; }
        }

        console.log(qid + ' | ci=' + correctIndex + ' | bias=' + (bias*100).toFixed(0) + '% | correct=' + correctLen + ' avg_wrong=' + avgWrongLen.toFixed(0));
        for (let idx = 0; idx < 4; idx++) {
          const marker = idx === correctIndex ? ' ***' : '';
          console.log('  [' + idx + '] (' + options[idx].length + ') ' + options[idx] + marker);
        }
      }
    }
    i++;
  }

  console.log('\n=== ' + relFile.split('/').pop() + ': ' + biasedCount + '/' + mcCount + ' biased (' + (mcCount > 0 ? (biasedCount/mcCount*100).toFixed(1) : '0') + '%) ===\n');
}
