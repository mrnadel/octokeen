const fs = require('fs');

// ============================================================
// REPLACEMENT SVGs
// ============================================================
const TAPERED_BAR = '<svg viewBox="0 0 80 80" fill="none"> <!-- Tapered bar under axial load --> <polygon points="10,30 70,35 70,45 10,50" fill="#58CC02" opacity="0.1" stroke="#3B8700" stroke-width="1.5"/> <text x="12" y="28" font-size="4" fill="#3B8700" opacity="0.5">A\u2081</text> <text x="62" y="33" font-size="4" fill="#3B8700" opacity="0.5">A\u2082</text> <line x1="3" y1="40" x2="9" y2="40" stroke="#3B8700" stroke-width="1.5"/> <polygon points="9,38 9,42 12,40" fill="#3B8700" opacity="0.5"/> <line x1="77" y1="40" x2="71" y2="40" stroke="#3B8700" stroke-width="1.5"/> <polygon points="71,38 71,42 68,40" fill="#3B8700" opacity="0.5"/> <text x="4" y="48" font-size="4" fill="#3B8700" opacity="0.4">F</text> <text x="73" y="48" font-size="4" fill="#3B8700" opacity="0.4">F</text> <text x="40" y="60" text-anchor="middle" font-size="4" fill="#58CC02" opacity="0.5">\u03c3 = F/A</text> <text x="40" y="68" text-anchor="middle" font-size="3.5" fill="#6B7280" opacity="0.5">max \u03c3 at min A</text> </svg>';

const HANGING_BAR = '<svg viewBox="0 0 80 80" fill="none"> <!-- Bar hanging under own weight --> <rect x="25" y="5" width="30" height="4" fill="#334155" opacity="0.3"/> <line x1="25" y1="5" x2="55" y2="5" stroke="#3B8700" stroke-width="2"/> <line x1="28" y1="5" x2="26" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <line x1="33" y1="5" x2="31" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <line x1="38" y1="5" x2="36" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <line x1="43" y1="5" x2="41" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <line x1="48" y1="5" x2="46" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <line x1="53" y1="5" x2="51" y2="2" stroke="#3B8700" stroke-width="0.5" opacity="0.3"/> <rect x="35" y="9" width="10" height="50" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="1.5" rx="1"/> <line x1="40" y1="20" x2="40" y2="26" stroke="#6B7280" stroke-width="0.5" opacity="0.3"/> <polygon points="39,26 41,26 40,28" fill="#6B7280" opacity="0.3"/> <line x1="40" y1="32" x2="40" y2="38" stroke="#6B7280" stroke-width="0.6" opacity="0.4"/> <polygon points="39,38 41,38 40,40" fill="#6B7280" opacity="0.4"/> <line x1="40" y1="44" x2="40" y2="50" stroke="#6B7280" stroke-width="0.7" opacity="0.5"/> <polygon points="39,50 41,50 40,52" fill="#6B7280" opacity="0.5"/> <text x="28" y="14" font-size="3" fill="#3B8700" opacity="0.4">x=0</text> <text x="28" y="60" font-size="3" fill="#3B8700" opacity="0.4">x=L</text> <line x1="50" y1="18" x2="50" y2="58" stroke="#A5E86C" stroke-width="0.5" opacity="0.3"/> <line x1="50" y1="18" x2="62" y2="18" stroke="#3B8700" stroke-width="1" opacity="0.4"/> <line x1="62" y1="18" x2="50" y2="58" stroke="#58CC02" stroke-width="1" opacity="0.5"/> <text x="64" y="17" font-size="3" fill="#3B8700" opacity="0.4">\u03c3max</text> <text x="51" y="62" font-size="3" fill="#6B7280" opacity="0.4">\u03c3=0</text> <text x="40" y="72" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">\u03c3(x) = \u03c1g(L\u2212x)</text> </svg>';

const RECT_CROSS = '<svg viewBox="0 0 80 80" fill="none"> <!-- Beam cross-section orientation --> <rect x="8" y="10" width="12" height="30" fill="#58CC02" opacity="0.1" stroke="#3B8700" stroke-width="1.5"/> <text x="14" y="8" text-anchor="middle" font-size="3.5" fill="#3B8700" opacity="0.5">50</text> <text x="3" y="27" font-size="3.5" fill="#3B8700" opacity="0.5">100</text> <path d="M 28,25 C 33,15 43,15 48,25" stroke="#6B7280" stroke-width="1" fill="none" stroke-dasharray="2,1"/> <polygon points="47,23 49,26 46,26" fill="#6B7280" opacity="0.5"/> <rect x="52" y="18" width="24" height="14" fill="#58CC02" opacity="0.1" stroke="#3B8700" stroke-width="1.5"/> <text x="64" y="16" text-anchor="middle" font-size="3.5" fill="#3B8700" opacity="0.5">100</text> <text x="49" y="27" font-size="3.5" fill="#3B8700" opacity="0.5">50</text> <line x1="8" y1="25" x2="20" y2="25" stroke="#A5E86C" stroke-width="0.5" stroke-dasharray="1,1"/> <line x1="52" y1="25" x2="76" y2="25" stroke="#A5E86C" stroke-width="0.5" stroke-dasharray="1,1"/> <text x="14" y="50" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">I=bh\u00B3/12</text> <text x="14" y="56" text-anchor="middle" font-size="3" fill="#58CC02" opacity="0.4">h=100</text> <text x="64" y="42" text-anchor="middle" font-size="3.5" fill="#6B7280" opacity="0.5">I=bh\u00B3/12</text> <text x="64" y="48" text-anchor="middle" font-size="3" fill="#6B7280" opacity="0.4">h=50</text> <text x="40" y="70" text-anchor="middle" font-size="3.5" fill="#334155" opacity="0.4">I \u221D h\u00B3</text> </svg>';

const HOLLOW_CIRCLE = '<svg viewBox="0 0 80 80" fill="none"> <!-- Hollow circular cross-section --> <circle cx="40" cy="38" r="25" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="2"/> <circle cx="40" cy="38" r="20" fill="white" stroke="#3B8700" stroke-width="1.5" stroke-dasharray="2,2"/> <line x1="40" y1="38" x2="65" y2="38" stroke="#6B7280" stroke-width="0.8" stroke-dasharray="1,1"/> <text x="53" y="36" font-size="3.5" fill="#3B8700" opacity="0.6">D</text> <line x1="40" y1="38" x2="40" y2="18" stroke="#6B7280" stroke-width="0.8" stroke-dasharray="1,1"/> <text x="42" y="26" font-size="3.5" fill="#3B8700" opacity="0.6">d</text> <circle cx="40" cy="38" r="1.5" fill="#3B8700" opacity="0.4"/> <text x="40" y="72" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">I = \u03c0(D\u2074\u2212d\u2074)/64</text> </svg>';

const SHEAR_DIST_RECT = '<svg viewBox="0 0 80 80" fill="none"> <!-- Shear stress distribution in rectangular section --> <rect x="15" y="10" width="20" height="55" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="1.5" rx="1"/> <line x1="15" y1="37.5" x2="35" y2="37.5" stroke="#A5E86C" stroke-width="0.8" stroke-dasharray="2,1"/> <text x="36" y="39" font-size="3.5" fill="#A5E86C" opacity="0.6">NA</text> <path d="M 42,10 Q 65,37.5 42,65" fill="none" stroke="#3B8700" stroke-width="1.5"/> <line x1="42" y1="10" x2="42" y2="65" stroke="#6B7280" stroke-width="0.5" opacity="0.3"/> <line x1="42" y1="15" x2="47" y2="15" stroke="#3B8700" stroke-width="0.6" opacity="0.3"/> <line x1="42" y1="25" x2="55" y2="25" stroke="#3B8700" stroke-width="0.8" opacity="0.4"/> <line x1="42" y1="37.5" x2="62" y2="37.5" stroke="#3B8700" stroke-width="1" opacity="0.6"/> <line x1="42" y1="50" x2="55" y2="50" stroke="#3B8700" stroke-width="0.8" opacity="0.4"/> <line x1="42" y1="60" x2="47" y2="60" stroke="#3B8700" stroke-width="0.6" opacity="0.3"/> <text x="64" y="39" font-size="3.5" fill="#3B8700" opacity="0.5">\u03c4max</text> <text x="44" y="9" font-size="3" fill="#6B7280" opacity="0.4">\u03c4=0</text> <text x="44" y="70" font-size="3" fill="#6B7280" opacity="0.4">\u03c4=0</text> <text x="40" y="78" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">\u03c4 = VQ/(Ib)</text> </svg>';

const I_VS_RECT = '<svg viewBox="0 0 80 80" fill="none"> <!-- Solid rectangle vs I-beam --> <rect x="8" y="18" width="14" height="40" fill="#58CC02" opacity="0.1" stroke="#3B8700" stroke-width="1.5"/> <text x="15" y="14" text-anchor="middle" font-size="3.5" fill="#3B8700" opacity="0.5">Rectangle</text> <rect x="53" y="18" width="20" height="4" fill="#58CC02" opacity="0.15" stroke="#3B8700" stroke-width="1.2"/> <rect x="60" y="22" width="6" height="32" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="1.2"/> <rect x="53" y="54" width="20" height="4" fill="#58CC02" opacity="0.15" stroke="#3B8700" stroke-width="1.2"/> <text x="63" y="14" text-anchor="middle" font-size="3.5" fill="#3B8700" opacity="0.5">I-beam</text> <line x1="8" y1="38" x2="22" y2="38" stroke="#A5E86C" stroke-width="0.5" stroke-dasharray="1,1"/> <line x1="53" y1="38" x2="73" y2="38" stroke="#A5E86C" stroke-width="0.5" stroke-dasharray="1,1"/> <text x="40" y="42" text-anchor="middle" font-size="3" fill="#6B7280" opacity="0.5">same A</text> <text x="40" y="70" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">I-beam: higher I</text> <text x="40" y="76" text-anchor="middle" font-size="3" fill="#6B7280" opacity="0.5">material far from NA</text> </svg>';

const SECTION_MOD = '<svg viewBox="0 0 80 80" fill="none"> <!-- Section modulus diagram --> <rect x="25" y="15" width="30" height="40" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="1.5" rx="1"/> <line x1="25" y1="35" x2="55" y2="35" stroke="#A5E86C" stroke-width="0.8" stroke-dasharray="2,1"/> <text x="57" y="37" font-size="3.5" fill="#A5E86C" opacity="0.6">NA</text> <line x1="60" y1="15" x2="60" y2="35" stroke="#6B7280" stroke-width="0.6"/> <line x1="58" y1="15" x2="62" y2="15" stroke="#6B7280" stroke-width="0.6"/> <line x1="58" y1="35" x2="62" y2="35" stroke="#6B7280" stroke-width="0.6"/> <text x="63" y="27" font-size="3.5" fill="#3B8700" opacity="0.5">c</text> <line x1="15" y1="15" x2="25" y2="35" stroke="#3B8700" stroke-width="1" opacity="0.5"/> <line x1="15" y1="55" x2="25" y2="35" stroke="#3B8700" stroke-width="1" opacity="0.5"/> <text x="10" y="14" font-size="3" fill="#3B8700" opacity="0.4">\u2212\u03c3</text> <text x="10" y="58" font-size="3" fill="#3B8700" opacity="0.4">+\u03c3</text> <text x="40" y="65" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">S = I/c</text> <text x="40" y="72" text-anchor="middle" font-size="3.5" fill="#3B8700" opacity="0.5">\u03c3max = M/S</text> </svg>';

const COMBINED_AXIAL_BEND = '<svg viewBox="0 0 80 80" fill="none"> <!-- Combined bending + axial --> <rect x="10" y="35" width="60" height="10" fill="#58CC02" opacity="0.08" stroke="#3B8700" stroke-width="1.5" rx="1"/> <line x1="2" y1="40" x2="9" y2="40" stroke="#3B8700" stroke-width="1.5"/> <polygon points="9,38 9,42 12,40" fill="#3B8700" opacity="0.5"/> <text x="2" y="36" font-size="3.5" fill="#3B8700" opacity="0.5">P</text> <path d="M 35,28 A 8,8 0 0,1 45,28" stroke="#58CC02" stroke-width="1" fill="none"/> <polygon points="45,28 44,25 47,27" fill="#58CC02" opacity="0.5"/> <text x="40" y="24" text-anchor="middle" font-size="3.5" fill="#58CC02" opacity="0.5">M</text> <text x="40" y="56" text-anchor="middle" font-size="3.5" fill="#334155" opacity="0.5">\u03c3 = P/A \u00B1 My/I</text> <rect x="15" y="62" width="8" height="8" fill="#3B8700" opacity="0.12" stroke="#3B8700" stroke-width="0.5"/> <text x="19" y="76" text-anchor="middle" font-size="2.5" fill="#3B8700" opacity="0.4">P/A</text> <text x="30" y="68" font-size="4" fill="#334155" opacity="0.3">+</text> <line x1="35" y1="62" x2="45" y2="70" stroke="#58CC02" stroke-width="1" opacity="0.5"/> <line x1="35" y1="62" x2="35" y2="70" stroke="#6B7280" stroke-width="0.5" opacity="0.3"/> <text x="40" y="76" text-anchor="middle" font-size="2.5" fill="#58CC02" opacity="0.4">My/I</text> <text x="52" y="68" font-size="4" fill="#334155" opacity="0.3">=</text> <line x1="57" y1="61" x2="67" y2="71" stroke="#3B8700" stroke-width="1.2" opacity="0.5"/> <line x1="57" y1="61" x2="57" y2="71" stroke="#6B7280" stroke-width="0.5" opacity="0.3"/> <text x="62" y="76" text-anchor="middle" font-size="2.5" fill="#3B8700" opacity="0.4">combined</text> </svg>';

// ============================================================
// Define mismatches to fix: questionId -> action
// ============================================================

const UNIT3_FIXES = {
  'u3-L1-Q7': TAPERED_BAR,
  'u3-L1-Q9': 'REMOVE',
  'u3-L1-Q17': 'REMOVE',
  'u3-L1-Q23': 'REMOVE',
  'u3-L1-Q26': HANGING_BAR,
  'u3-L2-Q4': RECT_CROSS,
  'u3-L2-Q6': SECTION_MOD,
  'u3-L2-Q8': I_VS_RECT,
  'u3-L2-Q15': SECTION_MOD,
  'u3-L2-Q17': SHEAR_DIST_RECT,
  'u3-L2-Q24': HOLLOW_CIRCLE,
  'u3-L2-Q26': 'REMOVE',
  'u3-L4-Q28': 'REMOVE',
  'u3-L5-Q14': COMBINED_AXIAL_BEND,
  'u3-L5-Q29': 'REMOVE',
  'u3-L6-Q1': 'REMOVE',
  'u3-L6-Q3': 'REMOVE',
  'u3-L6-Q5': 'REMOVE',
  'u3-L6-Q8': 'REMOVE',
  'u3-L6-Q16': 'REMOVE',
  'u3-L6-Q28': 'REMOVE',
};

const UNIT4_FIXES = {
  'u4-L1-Q1': 'REMOVE',
  'u4-L1-Q2': 'REMOVE',
  'u4-L1-Q8': 'REMOVE',
  'u4-L1-Q10': 'REMOVE',
  'u4-L1-Q11': 'REMOVE',
  'u4-L1-Q13': 'REMOVE',
  'u4-L1-Q16': 'REMOVE',
  'u4-L1-Q17': 'REMOVE',
  'u4-L1-Q21': 'REMOVE',
  'u4-L1-Q24': 'REMOVE',
  'u4-L2-Q5': 'REMOVE',
  'u4-L2-Q9': 'REMOVE',
  'u4-L2-Q10': 'REMOVE',
  'u4-L2-Q11': 'REMOVE',
  'u4-L2-Q25': 'REMOVE',
  'u4-L3-Q11': 'REMOVE',
  'u4-L3-Q20': 'REMOVE',
  'u4-L4-Q3': 'REMOVE',
  'u4-L4-Q6': 'REMOVE',
  'u4-L4-Q9': 'REMOVE',
  'u4-L4-Q10': 'REMOVE',
  'u4-L4-Q13': 'REMOVE',
  'u4-L4-Q15': 'REMOVE',
  'u4-L4-Q16': 'REMOVE',
  'u4-L4-Q17': 'REMOVE',
  'u4-L4-Q18': 'REMOVE',
  'u4-L4-Q19': 'REMOVE',
  'u4-L4-Q20': 'REMOVE',
  'u4-L4-Q21': 'REMOVE',
  'u4-L4-Q22': 'REMOVE',
  'u4-L4-Q24': 'REMOVE',
  'u4-L4-Q27': 'REMOVE',
  'u4-L4-Q30': 'REMOVE',
  'u4-L5-Q3': 'REMOVE',
  'u4-L5-Q6': 'REMOVE',
  'u4-L5-Q8': 'REMOVE',
  'u4-L5-Q10': 'REMOVE',
  'u4-L5-Q11': 'REMOVE',
  'u4-L5-Q12': 'REMOVE',
  'u4-L5-Q16': 'REMOVE',
  'u4-L5-Q17': 'REMOVE',
  'u4-L5-Q18': 'REMOVE',
  'u4-L5-Q19': 'REMOVE',
  'u4-L5-Q20': 'REMOVE',
  'u4-L5-Q22': 'REMOVE',
  'u4-L5-Q23': 'REMOVE',
  'u4-L5-Q24': 'REMOVE',
  'u4-L5-Q25': 'REMOVE',
  'u4-L5-Q26': 'REMOVE',
  'u4-L5-Q28': 'REMOVE',
  'u4-L5-Q29': 'REMOVE',
};

const UNIT5_FIXES = {
  'u5-L1-Q4': 'REMOVE',
  'u5-L1-Q30': 'REMOVE',
  'u5-L4-Q26': 'REMOVE',
  'u5-L4-Q30': 'REMOVE',
};

// ============================================================
// Process each file
// ============================================================
function processFile(filePath, fixes) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let currentId = null;
  let changeCount = 0;
  let changeList = [];
  const appliedFixes = {};

  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].trim();

    // Detect question id
    const idMatch = stripped.match(/id:\s*'([^']+)'/);
    if (idMatch && idMatch[1].includes('-Q')) {
      currentId = idMatch[1];
    }

    // Check if this line has a diagram and current question needs fixing
    if (currentId && fixes[currentId] && !appliedFixes[currentId] &&
        stripped.startsWith('diagram:') && stripped.includes('<svg')) {
      const fix = fixes[currentId];

      if (fix === 'REMOVE') {
        const indent = lines[i].match(/^(\s*)/)[1];
        lines[i] = indent + 'diagram: undefined,';
        changeCount++;
        changeList.push('  ' + currentId + ': REMOVED diagram');
      } else {
        const indent = lines[i].match(/^(\s*)/)[1];
        lines[i] = indent + "diagram: '" + fix + "',";
        changeCount++;
        changeList.push('  ' + currentId + ': REPLACED diagram');
      }

      appliedFixes[currentId] = true;
    }
  }

  if (changeCount > 0) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }

  return { changeCount, changeList };
}

// Process Unit 3
console.log('Processing Unit 3...');
const r3 = processFile(
  'src/data/course/units/unit-3-strength.ts',
  UNIT3_FIXES
);
console.log('  ' + r3.changeCount + ' changes');
r3.changeList.forEach(function(c) { console.log(c); });

// Process Unit 4
console.log('\nProcessing Unit 4...');
const r4 = processFile(
  'src/data/course/units/unit-4-thermo.ts',
  UNIT4_FIXES
);
console.log('  ' + r4.changeCount + ' changes');
r4.changeList.forEach(function(c) { console.log(c); });

// Process Unit 5
console.log('\nProcessing Unit 5...');
const r5 = processFile(
  'src/data/course/units/unit-5-heat.ts',
  UNIT5_FIXES
);
console.log('  ' + r5.changeCount + ' changes');
r5.changeList.forEach(function(c) { console.log(c); });

console.log('\nTotal: ' + (r3.changeCount + r4.changeCount + r5.changeCount) + ' diagram fixes applied');
