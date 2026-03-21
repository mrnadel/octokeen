const fs = require('fs');
const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

// For unit-1-statics.ts, fixes that failed because of Unicode escape sequences in source
// The source file has literal \u00b2 etc. not actual Unicode chars

const unit1File = baseDir + 'src/data/course/units/unit-1-statics.ts';
let content = fs.readFileSync(unit1File, 'utf8');

// Helper: do a raw string replacement
function rep(old, neu) {
  if (content.includes(old)) {
    content = content.replace(old, neu);
    return true;
  }
  return false;
}

let count = 0;

// u1-L1-Q4: correct too long (109 vs 64 avg)
if (rep(
  "'cos\\u00b2\\u03b1 + cos\\u00b2\\u03b2 + cos\\u00b2\\u03b3 must equal 1; here they sum to 1.10, so there is an error'",
  "'cos\\u00b2\\u03b1 + cos\\u00b2\\u03b2 + cos\\u00b2\\u03b3 must equal 1; here 0.36+0.49+0.25 = 1.10'"
)) count++;

// u1-L1-Q12: correct 90 vs avg 52
if (rep(
  "'In 3D where the perpendicular distance is hard to find \\u2014 r\\u00d7F handles it automatically'",
  "'In 3D where perpendicular distance is hard to find'"
)) count++;
if (rep(
  "'Only in 2D problems with more than three forces'",
  "'Only in 2D problems with more than three concurrent forces'"
)) count++;

// u1-L1-Q15: correct 94 vs avg 59
if (rep(
  "'It gives |F1||F2|cos\\u03b8, measuring alignment \\u2014 useful for projecting one force onto another'",
  "'It gives |F1||F2|cos\\u03b8, useful for projecting one force onto another'"
)) count++;

// u1-L1-Q16: correct 71 vs avg 42
if (rep(
  "'A pure couple of 30 N\\u00b7m (net force is zero, net moment is nonzero)'",
  "'A pure couple of 30 N\\u00b7m (zero net force)'"
)) count++;
if (rep(
  "'Zero force and zero moment \\u2014 complete equilibrium'",
  "'Zero force and zero moment \\u2014 the system is in full equilibrium'"
)) count++;

// u1-L2-Q12: correct 41 vs avg 28
if (rep(
  "'R = w\\u2080L/2 at 2L/3 from the light end'",
  "'R = w\\u2080L/2 at 2L/3 from light end'"
)) count++;
if (rep(
  "'R = w\\u2080L at L/2 (midpoint)'",
  "'R = w\\u2080L acting at L/2 from either end'"
)) count++;
if (rep(
  "'R = w\\u2080L/2 at L/2'",
  "'R = w\\u2080L/2 acting at the midpoint L/2'"
)) count++;
if (rep(
  "'R = w\\u2080L/3 at 2L/3 from left'",
  "'R = w\\u2080L/3 acting at 2L/3 from left end'"
)) count++;

// u1-L2-Q22: correct 71 vs avg 51
if (rep(
  "'Single tension force along the cable (45\\u00b0), unknown magnitude only'",
  "'Single tension force along the cable, unknown magnitude only'"
)) count++;

// u1-L3-Q3: correct 89 vs avg 58
if (rep(
  "'Method of sections: cut through the target member (and \\u22642 others), apply 3 equations'",
  "'Method of sections: cut through target member (\\u22643 cuts), use 3 equations'"
)) count++;

// u1-L3-Q7: correct 71 vs avg 49
if (rep(
  "'Zero \\u2014 it\\'s a zero-force member; the collinear pair carry equal forces'",
  "'Zero \\u2014 it is a zero-force member (collinear pair rule)'"
)) count++;

// u1-L3-Q8: correct 65 vs avg 36
if (rep(
  "'Tension \\u2014 efficient because slender tension members don\\'t buckle'",
  "'Tension \\u2014 slender members don\\'t buckle'"
)) count++;

// u1-L4-Q1: correct 94 vs avg 48
if (rep(
  "'Capstan equation: T1/T2 = e^(\\u03bc\\u03b8) \\u2014 tension ratio grows exponentially with wrap angle'",
  "'Capstan equation: T1/T2 = e^(\\u03bc\\u03b8), exponential with wrap angle'"
)) count++;

// u1-L4-Q7: correct 87 vs avg 55
if (rep(
  "'Increases with P until \\u03bcs\\u00b7N, then drops to \\u03bck\\u00b7N when sliding starts'",
  "'Increases with P up to \\u03bcs\\u00b7N, then drops to \\u03bck\\u00b7N'"
)) count++;

// u1-L4-Q8: correct 81 vs avg 51
if (rep(
  "'Yes \\u2014 5\\u00b0 < arctan(0.15) \\u2248 8.53\\u00b0, so it holds without applied force'",
  "'Yes \\u2014 5\\u00b0 < arctan(0.15) \\u2248 8.53\\u00b0, self-locking'"
)) count++;

// u1-L4-Q17: correct 63 vs avg 43
if (rep(
  "'tan\\u03b8 \\u2265 1/(2\\u03bcs) \\u2014 slips when angle is too shallow'",
  "'tan\\u03b8 \\u2265 1/(2\\u03bcs), slips when too shallow'"
)) count++;
if (rep(
  "'\\u03b8 must exceed 45\\u00b0 regardless of friction'",
  "'\\u03b8 must exceed 45\\u00b0 regardless of the friction value'"
)) count++;

// u1-L4-Q18: correct 99 vs avg 56
if (rep(
  "'Area of ring \\u221d r\\u00b7dr, moment arm = r, so integrand is r\\u00b2\\u00b7dr \\u2192 r\\u00b3 terms'",
  "'Ring area \\u221d r\\u00b7dr, arm = r, so integrand \\u2192 r\\u00b3'"
)) count++;

// u1-L4-Q20: correct 81 vs avg 60
if (rep(
  "'P = (\\u03bc\\u2081m_A + \\u03bc\\u2082(m_A+m_B))g \\u2014 limited by top block sliding off'",
  "'P = (\\u03bc\\u2081m_A + \\u03bc\\u2082(m_A+m_B))g \\u2014 limited by top sliding'"
)) count++;

// u1-L4-Q22: correct 64 vs avg 46
if (rep(
  "'Increased by 1/sin\\u03b2 \\u2248 3.24\\u00d7 due to wedging action'",
  "'Increased by 1/sin\\u03b2 \\u2248 3.24\\u00d7, wedging effect'"
)) count++;

// u1-L4-Q27: correct 93 vs avg 48
if (rep(
  "'\\u03b7 = tan\\u03b8/tan(\\u03b8+\\u03c6) < 50% whenever \\u03c6 > \\u03b8 (self-locking condition)'",
  "'\\u03b7 = tan\\u03b8/tan(\\u03b8+\\u03c6), always < 50% when self-locking'"
)) count++;

// u1-L5-Q1: correct 75 vs avg 47
if (rep(
  "'I-beam \\u2014 flanges far from neutral axis maximize I via Ad\\u00b2 contribution'",
  "'I-beam \\u2014 flanges far from NA maximize I via Ad\\u00b2'"
)) count++;

// u1-L5-Q14: correct 89 vs avg 54
if (rep(
  "'Unequal distances to extreme fibers \\u2192 different max tensile and compressive stresses'",
  "'Unequal distances to extreme fibers \\u2192 different max stresses'"
)) count++;

// u1-L5-Q20: correct=12, avg=5 (4R/(3π) vs R/2 etc) - all very short formulas, expand wrongs
if (rep("'R/2'", "'R/2 (semicircle half-radius)'")) count++;
if (rep("'R/3'", "'R/3 (one-third of the radius)'")) count++;

// u1-L4-Q15: correct 72 vs avg 52
// "Can reverse — friction acts up-slope at low P, then down-slope at high P"
// Check if it uses unicode dash
if (rep(
  "'Can reverse \\u2014 friction acts up-slope at low P, then down-slope at high P'",
  "'Can reverse \\u2014 up-slope at low P, down-slope at high P'"
)) count++;

fs.writeFileSync(unit1File, content, 'utf8');
console.log('unit-1-statics.ts: applied ' + count + ' additional fixes');

// Fix the remaining unit-3 issue
const unit3File = baseDir + 'src/data/course/units/unit-3-strength.ts';
let content3 = fs.readFileSync(unit3File, 'utf8');
let count3 = 0;

// u3-L7-Q1: The quote was escaped differently
if (content3.includes("When the Euler critical stress exceeds the proportional limit (short/intermediate columns) \\u2014 use Johnson\\'s parabolic formula")) {
  content3 = content3.replace(
    "When the Euler critical stress exceeds the proportional limit (short/intermediate columns) \\u2014 use Johnson\\'s parabolic formula",
    "When Euler stress exceeds proportional limit (short columns)"
  );
  count3++;
} else if (content3.includes("When the Euler critical stress exceeds the proportional limit (short/intermediate columns)")) {
  // Try without unicode
  const idx = content3.indexOf("When the Euler critical stress exceeds the proportional limit (short/intermediate columns)");
  // Get the full line
  const lineStart = content3.lastIndexOf('\n', idx) + 1;
  const lineEnd = content3.indexOf('\n', idx);
  const fullLine = content3.substring(lineStart, lineEnd);
  console.log('Found line: ' + fullLine.trim().substring(0, 100));
}

fs.writeFileSync(unit3File, content3, 'utf8');
console.log('unit-3-strength.ts: applied ' + count3 + ' additional fixes');

// Fix the remaining unit-7 issue
const unit7File = baseDir + 'src/data/course/units/unit-7-materials.ts';
let content7 = fs.readFileSync(unit7File, 'utf8');
let count7 = 0;

// u7-L5-Q4: has escaped apostrophe in "it's"
if (content7.includes("Ask the designer what function drives this tolerance. If it\\'s non-critical")) {
  content7 = content7.replace(
    /Ask the designer what function drives this tolerance\. If it\\'s non-critical[^'"]+/,
    "Ask the designer the function; if non-critical, propose relaxing to \\u00b10.05 mm"
  );
  count7++;
} else {
  // Search for the text
  const idx7 = content7.indexOf("Ask the designer what function drives this tolerance");
  if (idx7 >= 0) {
    const lineStart = content7.lastIndexOf('\n', idx7) + 1;
    const lineEnd = content7.indexOf('\n', idx7);
    const fullLine = content7.substring(lineStart, lineEnd);
    console.log('Found u7 line: ' + fullLine.trim().substring(0, 120));
  }
}

fs.writeFileSync(unit7File, content7, 'utf8');
console.log('unit-7-materials.ts: applied ' + count7 + ' additional fixes');
