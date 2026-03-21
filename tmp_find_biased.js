const fs = require('fs');

const files = [
  'src/data/course/units/unit-1-statics.ts',
  'src/data/course/units/unit-3-strength.ts',
  'src/data/course/units/unit-7-materials.ts'
];

const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

for (const relFile of files) {
  const file = baseDir + relFile;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  let mcCount = 0;
  let biasedCount = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.match(/type:\s*['"]multiple-choice['"]/)) {
      mcCount++;
      let optionsStart = -1;
      let correctIndex = -1;
      let questionId = '';

      for (let b = i; b >= Math.max(0, i - 15); b--) {
        const idMatch = lines[b].match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
          questionId = idMatch[1];
          break;
        }
      }

      for (let j = i; j < Math.min(lines.length, i + 40); j++) {
        if (lines[j].match(/options:\s*\[/)) {
          optionsStart = j;
        }
        const ciMatch = lines[j].match(/correctIndex:\s*(\d+)/);
        if (ciMatch) {
          correctIndex = parseInt(ciMatch[1]);
        }
      }

      if (optionsStart >= 0 && correctIndex >= 0) {
        let options = [];
        let j = optionsStart;
        let bracketDepth = 0;
        let optionsText = '';
        while (j < lines.length) {
          optionsText += lines[j] + '\n';
          for (const ch of lines[j]) {
            if (ch === '[') bracketDepth++;
            if (ch === ']') bracketDepth--;
          }
          if (bracketDepth <= 0 && optionsText.includes('[')) break;
          j++;
        }

        // Extract strings - handle quotes properly
        let inStr = false;
        let strChar = '';
        let current = '';
        let escaped = false;
        for (let c = 0; c < optionsText.length; c++) {
          const ch = optionsText[c];
          if (escaped) {
            current += ch;
            escaped = false;
            continue;
          }
          if (ch === String.fromCharCode(92)) { // backslash
            escaped = true;
            current += ch;
            continue;
          }
          if (!inStr && (ch === "'" || ch === '"' || ch === '`')) {
            inStr = true;
            strChar = ch;
            current = '';
            continue;
          }
          if (inStr && ch === strChar) {
            options.push(current);
            inStr = false;
            continue;
          }
          if (inStr) {
            current += ch;
          }
        }

        if (options.length >= 4) {
          options = options.slice(0, 4);
          const correctLen = options[correctIndex].length;
          const wrongLens = options.filter((_, idx) => idx !== correctIndex).map(o => o.length);
          const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;

          const bias = (correctLen - avgWrongLen) / avgWrongLen;

          if (bias > 0.30) {
            biasedCount++;
            console.log('');
            console.log('FILE: ' + relFile.split('/').pop());
            console.log('  ID: ' + questionId + ' (options at line ' + (optionsStart + 1) + ')');
            console.log('  correctIndex: ' + correctIndex);
            console.log('  Bias: ' + (bias * 100).toFixed(1) + '%');
            for (let idx = 0; idx < 4; idx++) {
              const marker = idx === correctIndex ? ' [CORRECT]' : '';
              console.log('  opt' + idx + ' (' + options[idx].length + ' chars): "' + options[idx] + '"' + marker);
            }
            console.log('  Avg wrong: ' + avgWrongLen.toFixed(1) + ' chars');
          }
        }
      }
    }
    i++;
  }
  console.log('\n=== ' + relFile.split('/').pop() + ': ' + biasedCount + '/' + mcCount + ' MC biased (' + (mcCount > 0 ? (biasedCount/mcCount*100).toFixed(1) : '0') + '%) ===');
}
