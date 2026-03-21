const fs = require('fs');
const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

function fixFile(filename, replacements) {
  const file = baseDir + 'src/data/course/units/' + filename;
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;

  for (const [old, neu] of replacements) {
    if (old === neu) continue;
    const sq = "'" + old + "'";
    const dq = '"' + old + '"';
    if (content.includes(sq)) {
      content = content.replace(sq, "'" + neu + "'");
      count++;
    } else if (content.includes(dq)) {
      content = content.replace(dq, '"' + neu + '"');
      count++;
    } else {
      console.log('  NOT FOUND: ' + old.substring(0, 60) + '...');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(filename + ': ' + count + ' fixes');
}

// These use literal UTF-8 em-dash (—) not escaped \u2014
fixFile('unit-1-statics.ts', [
  // u1-L1-Q21 (bias=41%) correct=82 avg=58
  ['A force plus a parallel couple \u2014 the simplest irreducible form of any force system',
   'A force plus a parallel couple \u2014 simplest irreducible form'],

  // u1-L2-Q4 (bias=83%) correct=83 avg=45
  ['The hinge adds an equation (M=0 there) \u2014 but increases deflections and peak moments',
   'Hinge adds M=0 equation but increases deflections'],
  ['The hinge locks rotation between segments, reducing DOF',
   'The hinge locks rotation between beam segments, reducing DOF'],

  // u1-L2-Q18 (bias=50%) correct=65 avg=43
  ['Pin \u2014 two components (H, V) combine into a force in any direction',
   'Pin \u2014 two components (H, V) combine into any direction'],
  ['Roller \u2014 single force in any direction',
   'Roller \u2014 a single force that can act in any direction'],
  ['Cable \u2014 can pull in any direction',
   'Cable \u2014 can exert a pull force in any direction'],

  // u1-L3-Q21 (bias=50%) correct=62 avg=41
  ['Multi-force \u2014 forces at three points produce bending and shear',
   'Multi-force \u2014 forces at three points produce bending'],
  ['Two-force \u2014 forces at endpoints only',
   'Two-force \u2014 forces at endpoints only (axial member)'],

  // u1-L4-Q1 line uses literal chars for Greek
  // Need to find exact text. Let me check...

  // u1-L5-Q2 (bias=50%) correct=89 avg=59
  ['Significantly underestimates I \u2014 the Ad\u00b2 transfer terms (often dominant) are missing',
   'Significantly underestimates I \u2014 Ad\u00b2 transfer terms are missing'],

  // u1-L5-Q26 (bias=42%) correct=75 avg=53
  ['Sum individual Ix values \u2014 no transfer needed if they share the same x-axis',
   'Sum individual Ix values \u2014 no transfer needed (same axis)'],
  ['Cannot compute from individual values \u2014 must calculate from scratch',
   'Cannot compute from individual values \u2014 redo from scratch'],
]);

// Now check unit-1 for remaining items with literal Unicode chars
const u1file = baseDir + 'src/data/course/units/unit-1-statics.ts';
let u1 = fs.readFileSync(u1file, 'utf8');
let u1count = 0;

// u1-L4-Q1: Compare mgsin... - find the actual text
const idx1 = u1.indexOf('Compare mgsin');
if (idx1 >= 0) {
  const lineStart = u1.lastIndexOf('\n', idx1) + 1;
  const lineEnd = u1.indexOf('\n', idx1);
  const line = u1.substring(lineStart, lineEnd).trim();
  // Extract the option string
  const m = line.match(/['"](.+?)['"]\s*,?\s*$/);
  if (m) {
    const oldOpt = m[1];
    // Trim it
    const newOpt = 'Compare mgsin\u03b8 to \u03bcs\u00b7mgcos\u03b8 \u2014 slides if tan\u03b8 > \u03bcs';
    if (oldOpt !== newOpt && u1.includes("'" + oldOpt + "'")) {
      u1 = u1.replace("'" + oldOpt + "'", "'" + newOpt + "'");
      u1count++;
    } else if (oldOpt !== newOpt && u1.includes('"' + oldOpt + '"')) {
      u1 = u1.replace('"' + oldOpt + '"', '"' + newOpt + '"');
      u1count++;
    }
  }
}

// u1-L4-Q10: still has old text
// "Yes — 5° < arctan(0.15) ≈ 8.53°, so it holds without applied force"
const idx2 = u1.indexOf('it holds without applied force');
if (idx2 >= 0) {
  const lineStart2 = u1.lastIndexOf('\n', idx2) + 1;
  const lineEnd2 = u1.indexOf('\n', idx2);
  const line2 = u1.substring(lineStart2, lineEnd2).trim();
  const m2 = line2.match(/['"](.+?)['"]\s*,?\s*$/);
  if (m2) {
    const oldOpt2 = m2[1];
    const newOpt2 = oldOpt2.replace(', so it holds without applied force', ', self-locking');
    if (u1.includes("'" + oldOpt2 + "'")) {
      u1 = u1.replace("'" + oldOpt2 + "'", "'" + newOpt2 + "'");
      u1count++;
    } else if (u1.includes('"' + oldOpt2 + '"')) {
      u1 = u1.replace('"' + oldOpt2 + '"', '"' + newOpt2 + '"');
      u1count++;
    }
  }
}

// u1-L4-Q3: Capstan equation with literal Unicode
const idx3 = u1.indexOf('tension ratio grows exponentially with wrap angle');
if (idx3 >= 0) {
  const lineStart3 = u1.lastIndexOf('\n', idx3) + 1;
  const lineEnd3 = u1.indexOf('\n', idx3);
  const line3 = u1.substring(lineStart3, lineEnd3).trim();
  const m3 = line3.match(/['"](.+?)['"]\s*,?\s*$/);
  if (m3) {
    const oldOpt3 = m3[1];
    const newOpt3 = oldOpt3.replace(' \u2014 tension ratio grows exponentially with wrap angle', ', exponential with wrap angle');
    if (u1.includes("'" + oldOpt3 + "'")) {
      u1 = u1.replace("'" + oldOpt3 + "'", "'" + newOpt3 + "'");
      u1count++;
    }
  }
}

fs.writeFileSync(u1file, u1, 'utf8');
console.log('unit-1-statics.ts (extra): ' + u1count + ' fixes');

// Fix unit-3 items with special chars
const u3file = baseDir + 'src/data/course/units/unit-3-strength.ts';
let u3 = fs.readFileSync(u3file, 'utf8');
let u3count = 0;

// Helper to find and replace option by unique substring
function fixBySubstr(content, substr, newText) {
  const idx = content.indexOf(substr);
  if (idx < 0) return [content, false];
  const lineStart = content.lastIndexOf('\n', idx) + 1;
  const lineEnd = content.indexOf('\n', idx);
  const line = content.substring(lineStart, lineEnd).trim();
  // Extract the full option string
  let m = line.match(/^'(.*)',?\s*$/);
  if (!m) m = line.match(/^"(.*)",?\s*$/);
  if (m) {
    const oldOpt = m[1];
    const quote = line[0];
    content = content.replace(quote + oldOpt + quote, quote + newText + quote);
    return [content, true];
  }
  return [content, false];
}

// u3-L2-Q15: 312,500 mm³ numbers - these use special chars
let ok;
[u3, ok] = fixBySubstr(u3, '312,500 mm', '312,500 mm\u00b3');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, '31,250 mm', '31,250 mm\u00b3 (off by factor of 10)');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, '3,125,000 mm', '3,125,000 mm\u00b3 (off by factor of 10)');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, '156,250 mm', '156,250 mm\u00b3 (uses half the depth)');
if (ok) u3count++;

// u3-L5-Q28: stress invariants
[u3, ok] = fixBySubstr(u3, 'sigma_1 + sigma_2 and sigma_1*sigma_2', 'Quantities like (sigma_1 + sigma_2) that remain constant');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'They are stresses that never change during loading', 'They are stresses that never change during any applied loading');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'They only apply to isotropic materials', 'They only apply to isotropic materials under linear elasticity');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'They are another name for principal stresses', 'They are simply another name for the principal stress values');
if (ok) u3count++;

// u3-L6-Q15: Miner's rule
[u3, ok] = fixBySubstr(u3, 'n_i is the actual cycles at stress level i', 'D = sum(n_i/N_i); failure when D \u2265 1');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'fatigue life doubles when stress is halved', 'It states that fatigue life doubles when the stress is halved exactly');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'It only applies to constant-amplitude loading', 'It only applies to constant-amplitude loading, not variable loads');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'It gives exact fatigue life predictions with no limitations', 'It gives exact fatigue life predictions with no limitations at all');
if (ok) u3count++;

// u3-L6-Q22: endurance limit
[u3, ok] = fixBySubstr(u3, 'polished rotating-beam specimen', "300 MPa \u2014 polished specimen endurance limit (Se' = 0.5*Sut)");
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'endurance limit equals UTS', '600 MPa \u2014 assumes endurance limit equals full UTS value');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'endurance limit is 20% of UTS', '120 MPa \u2014 assumes endurance limit is only 20% of the UTS');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'endurance limit is 75% of UTS', '450 MPa \u2014 assumes endurance limit is 75% of the UTS value');
if (ok) u3count++;

// u3-L6-Q29: toughness vs K_IC
[u3, ok] = fixBySubstr(u3, 'energy absorbed per unit volume in a smooth specimen', 'Toughness: energy/volume (smooth); K_IC: critical intensity at crack tip');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'They are the same property expressed in different units', 'They are the same material property expressed in different unit systems');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'K_IC is always numerically larger than toughness', 'K_IC is always numerically larger than the toughness value for any material');
if (ok) u3count++;

// u3-L7-Q3: Euler/Johnson
[u3, ok] = fixBySubstr(u3, 'proportional limit (short/intermediate columns)', 'When Euler stress exceeds proportional limit (short columns)');
if (ok) u3count++;

// u3-L7-Q15: thick-wall pressure vessel
[u3, ok] = fixBySubstr(u3, 'r_o') ; // just check if it's findable
// Need more specific approach
const idx_r = u3.indexOf('166.7 MPa at the inner surface');
if (idx_r >= 0) {
  const ls = u3.lastIndexOf('\n', idx_r) + 1;
  const le = u3.indexOf('\n', idx_r);
  const ln = u3.substring(ls, le).trim();
  const mm = ln.match(/^(['"])(.*)\1,?\s*$/);
  if (mm) {
    const q = mm[1];
    u3 = u3.replace(q + mm[2] + q, q + '166.7 MPa at inner surface (thick-wall Lam\u00e9 formula)' + q);
    u3count++;
  }
}
// Also fix the wrong answers for this question
[u3, ok] = fixBySubstr(u3, 'pD/(2t) = 100*100/50 = 200 MPa', '200 MPa using thin-wall formula pD/(2t) (less accurate here)');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'sigma_h = 100 MPa (equals the pressure)', '100 MPa assuming hoop stress equals the applied pressure');
if (ok) u3count++;
[u3, ok] = fixBySubstr(u3, 'sigma_h = 50 MPa (half the pressure)', '50 MPa assuming hoop stress is half the applied pressure');
if (ok) u3count++;

fs.writeFileSync(u3file, u3, 'utf8');
console.log('unit-3-strength.ts (extra): ' + u3count + ' fixes');

// Fix unit-7 items
const u7file = baseDir + 'src/data/course/units/unit-7-materials.ts';
let u7 = fs.readFileSync(u7file, 'utf8');
let u7count = 0;

// u7-L2-Q14 (ci=3, bias=31%)
[u7, ok] = fixBySubstr(u7, 'diffusible H + residual stress + brittle martensite', 'Hydrogen cracking \u2014 H + residual stress + martensite');
if (ok) u7count++;

// u7-L3-Q1: die casting
[u7, ok] = fixBySubstr(u7, 'high-pressure die casting: good strength-to-weight', 'A380 aluminum alloy \u2014 die cast, good strength-to-weight');
if (ok) u7count++;
[u7, ok] = fixBySubstr(u7, 'sand casting then machining: lowest material cost', '1045 carbon steel \u2014 sand cast then machined');
if (ok) u7count++;

// u7-L6-Q27: Acetylene
const idx_acet = u7.indexOf('3160');
if (idx_acet >= 0) {
  const ls7 = u7.lastIndexOf('\n', idx_acet) + 1;
  const le7 = u7.indexOf('\n', idx_acet);
  const ln7 = u7.substring(ls7, le7).trim();
  const mm7 = ln7.match(/^(['"])(.*)\1,?\s*$/);
  if (mm7) {
    const q7 = mm7[1];
    u7 = u7.replace(q7 + mm7[2] + q7, q7 + 'Highest flame temperature (~3160\u00b0C) among fuel gases' + q7);
    u7count++;
  }
}

// u7-L5-Q5: tolerance question - already partially fixed but still biased
[u7, ok] = fixBySubstr(u7, 'if non-critical, propose relaxing', 'Ask designer about function; if non-critical, relax tolerance');
if (ok) u7count++;

fs.writeFileSync(u7file, u7, 'utf8');
console.log('unit-7-materials.ts (extra): ' + u7count + ' fixes');
