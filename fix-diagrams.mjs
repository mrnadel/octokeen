// Script to fix mismatched SVG diagrams in unit-9 and unit-10
// Strategy: Remove diagrams that don't match the question topic
// Keep diagrams that DO match

import { readFileSync, writeFileSync } from 'fs';

const UNIT9_PATH = 'src/data/course/units/unit-9-gdt.ts';
const UNIT10_PATH = 'src/data/course/units/unit-10-interview.ts';

// SVG signatures for the 5 mismatched diagram types
const STRAIN_GAUGE_MARKER = 'Wheatstone bridge';
const FLYWHEEL_MARKER = 'animateTransform attributeName="transform" type="rotate" values="0,40,40;360,40,40"';
const PRESS_FIT_MARKER = 'd_shaft > d_hole';
const BEAM_MARKER = 'Pin support (left)';
const LATHE_MARKER = '3-jaw chuck';
const BALL_BEARING_MARKER = 'Ball cage + balls';

// ---- UNIT 9: Questions where diagram IS correct ----
// u9-L1-Q1: Ball bearing on bearing fit question - CORRECT
// u9-L1-Q3: Tolerance zone diagram on fit type question - CORRECT
// u9-L1-Q5: Lathe on manufacturing tolerance capability - ACCEPTABLE
// u9-L1-Q7: H7/g6 tolerance zone diagram - CORRECT
// u9-L2-Q1: Feature control frame on GD&T position question - CORRECT
// u9-L2-Q21: Bolt joint diagram on fastener formula - CORRECT
// u9-L4-Q1: 3-part stack-up diagram - CORRECT

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let fixes = 0;

  // Find all diagram lines and check them
  const lines = content.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line has a diagram property
    if (line.includes('diagram:') && line.includes('<svg')) {
      // Look backward to find the question ID
      let questionId = '';
      let questionText = '';
      for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
        if (lines[j].includes("id: '")) {
          const match = lines[j].match(/id:\s*'([^']+)'/);
          if (match) questionId = match[1];
        }
        if (lines[j].includes("question: '") || lines[j].includes('question: "')) {
          const match = lines[j].match(/question:\s*['"](.+)/);
          if (match) questionText = match[1].substring(0, 80);
        }
      }

      // Check if diagram is mismatched
      const hasStrainGauge = line.includes(STRAIN_GAUGE_MARKER);
      const hasFlywheel = line.includes(FLYWHEEL_MARKER) && !line.includes('Feature Control Frame') && !line.includes('Tolerance');
      const hasPressFit = line.includes(PRESS_FIT_MARKER);
      const hasBeam = line.includes(BEAM_MARKER);
      const hasLathe = line.includes(LATHE_MARKER);
      const hasBallBearing = line.includes(BALL_BEARING_MARKER);

      // Determine if this is a CORRECT match
      let isCorrectMatch = false;

      // Unit 9 correct matches
      if (questionId === 'u9-L1-Q1' && hasBallBearing) isCorrectMatch = true; // Bearing fit
      if (questionId === 'u9-L1-Q3') isCorrectMatch = true; // Custom tolerance zone diagram
      if (questionId === 'u9-L1-Q5' && hasLathe) isCorrectMatch = true; // Manufacturing capability
      if (questionId === 'u9-L1-Q7') isCorrectMatch = true; // Custom H7/g6 diagram
      if (questionId === 'u9-L2-Q1') isCorrectMatch = true; // Custom FCF diagram
      if (questionId === 'u9-L2-Q21') isCorrectMatch = true; // Custom bolt joint
      if (questionId === 'u9-L4-Q1') isCorrectMatch = true; // Custom stack-up
      if (questionId === 'u9-L4-Q15') isCorrectMatch = true; // Strain rosette (gauges)

      // Check for specific wrong-SVG situations
      const isWrongSvg = (
        hasStrainGauge || // Strain gauge on non-strain questions
        (hasFlywheel && !questionId.includes('L1-Q1')) || // Flywheel on non-flywheel questions
        hasPressFit || // Press-fit on non-press-fit questions
        (hasBeam && !questionText.toLowerCase().includes('beam')) || // Beam on non-beam questions
        (hasLathe && questionId !== 'u9-L1-Q5') || // Lathe on non-manufacturing questions
        (hasBallBearing && questionId !== 'u9-L1-Q1' && !questionText.toLowerCase().includes('bearing'))
      );

      if (isWrongSvg && !isCorrectMatch) {
        // Remove the mismatched diagram line
        fixes++;
        console.log(`REMOVED: ${questionId} - ${questionText.substring(0, 60)}...`);
        // Skip this line (don't add to output)
        continue;
      }
    }

    newLines.push(line);
  }

  const result = newLines.join('\n');
  writeFileSync(filePath, result, 'utf-8');
  console.log(`\n${filePath}: Fixed ${fixes} mismatched diagrams`);
  return fixes;
}

console.log('=== Processing Unit 9 ===');
const fixes9 = processFile(UNIT9_PATH);

console.log('\n=== Processing Unit 10 ===');
const fixes10 = processFile(UNIT10_PATH);

console.log(`\nTotal fixes: ${fixes9 + fixes10}`);
