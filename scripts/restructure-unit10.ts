/**
 * Restructure unit-10-interview.ts:
 * 1. Split each of the 6 lessons (30 items each) into 3 sub-lessons of ~11 items
 * 2. Add new teaching cards + easy questions per sub-lesson
 * 3. Convert some MC to match-pairs/sort-buckets/order-steps
 * 4. Add conversation + speed-round lessons
 * 5. Fix difficulty ramp (easy after teaching, then medium, then hard)
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'src', 'data', 'course', 'units', 'unit-10-interview.ts');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse the file to extract the unit structure
// We'll use regex to extract lessons and questions

// Step 1: Extract the unit wrapper (everything before first lesson and after last)
const importLine = "import type { Unit } from '../types';";

// Extract all questions from each lesson using careful parsing
// We need to find each lesson's questions array

interface ParsedQuestion {
  raw: string;
  id: string;
  type: string;
}

interface ParsedLesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  levels: number;
  questions: ParsedQuestion[];
  rawHeader: string;
}

function extractLessons(content: string): ParsedLesson[] {
  const lessons: ParsedLesson[] = [];

  // Find each lesson block
  const lessonStartRegex = /\{\s*id:\s*'(u10-L\d+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*description:\s*'([^']+)',\s*\n\s*icon:\s*'([^']+)',\s*\n\s*xpReward:\s*(\d+),\s*\n\s*levels:\s*(\d+),\s*\n\s*questions:\s*\[/g;

  let match;
  const lessonStarts: { index: number; id: string; title: string; desc: string; icon: string; xp: number; levels: number }[] = [];

  while ((match = lessonStartRegex.exec(content)) !== null) {
    lessonStarts.push({
      index: match.index,
      id: match[1],
      title: match[2],
      desc: match[3],
      icon: match[4],
      xp: parseInt(match[5]),
      levels: parseInt(match[6])
    });
  }

  for (let i = 0; i < lessonStarts.length; i++) {
    const start = lessonStarts[i];
    const questionsStartIdx = content.indexOf('questions: [', start.index) + 'questions: ['.length;

    // Find the matching closing bracket for the questions array
    let depth = 1;
    let idx = questionsStartIdx;
    while (depth > 0 && idx < content.length) {
      if (content[idx] === '[') depth++;
      if (content[idx] === ']') depth--;
      idx++;
    }
    const questionsEndIdx = idx - 1;
    const questionsContent = content.substring(questionsStartIdx, questionsEndIdx);

    // Parse individual questions
    const questions: ParsedQuestion[] = [];
    // Split by top-level objects in the array
    let qDepth = 0;
    let qStart = -1;
    for (let j = 0; j < questionsContent.length; j++) {
      const ch = questionsContent[j];
      if (ch === '{' && qDepth === 0) {
        qStart = j;
      }
      if (ch === '{') qDepth++;
      if (ch === '}') {
        qDepth--;
        if (qDepth === 0 && qStart >= 0) {
          const raw = questionsContent.substring(qStart, j + 1);
          const idMatch = raw.match(/id:\s*'([^']+)'/);
          const typeMatch = raw.match(/type:\s*'([^']+)'/);
          if (idMatch && typeMatch) {
            questions.push({
              raw,
              id: idMatch[1],
              type: typeMatch[1]
            });
          }
          qStart = -1;
        }
      }
    }

    lessons.push({
      id: start.id,
      title: start.title,
      description: start.desc,
      icon: start.icon,
      xpReward: start.xp,
      levels: start.levels,
      questions,
      rawHeader: ''
    });
  }

  return lessons;
}

const lessons = extractLessons(fileContent);
console.log(`Found ${lessons.length} lessons`);
for (const l of lessons) {
  console.log(`  ${l.id}: "${l.title}" - ${l.questions.length} items (${l.questions.filter(q => q.type === 'teaching').length} teaching)`);
}

// Now build the new file
// Each lesson splits into 3 sub-lessons: u10-L1 (first 11), u10-L1b (middle 11), u10-L1c (last 11)

const subLessonTitles: Record<string, [string, string, string]> = {
  'u10-L1': ['Fermi Problems Basics', 'Anchor Values & Sanity Checks', 'Scaling Laws & Advanced Estimation'],
  'u10-L2': ['Failure Modes & Fracture Surfaces', 'Root Cause Analysis Tools', 'Environment-Assisted Failures'],
  'u10-L3': ['Material Selection Basics', 'DFM, DFA & Cost Reduction', 'Decision Matrices & Optimization'],
  'u10-L4': ['FEA Mesh & Elements', 'Boundary Conditions & Convergence', 'Interpreting FEA Results'],
  'u10-L5': ['Engineering Case Studies', 'Troubleshooting Scenarios', 'Cross-Disciplinary Design'],
  'u10-L6': ['Standards & Quality Systems', 'Risk Assessment & Change Control', 'Project Management for Engineers'],
};

const subLessonDescs: Record<string, [string, string, string]> = {
  'u10-L1': [
    'What Fermi problems are, how to decompose big unknowns, and your first estimation attempts.',
    'Key reference numbers every engineer should know, plus how to sanity-check your estimates.',
    'Scaling laws, combined estimation problems, and real interview-level Fermi challenges.',
  ],
  'u10-L2': [
    'The three main failure modes, reading fracture surfaces, and identifying fatigue vs overload.',
    'Fishbone diagrams, 5 Whys, FMEA, and systematic problem-solving approaches.',
    'Corrosion types, hydrogen embrittlement, stress corrosion cracking, and environment-driven failures.',
  ],
  'u10-L3': [
    'Ashby charts, material indices, and how to pick the right material for the loading type.',
    'Design for Manufacturing, Design for Assembly, and systematic cost reduction approaches.',
    'Pugh matrices, weighted decision tables, and multi-objective optimization in design.',
  ],
  'u10-L4': [
    'Element types, mesh quality metrics, and how mesh density affects accuracy.',
    'Applying boundary conditions correctly, checking convergence, and common modeling mistakes.',
    'Reading stress plots, handling singularities, and validating FEA results against hand calcs.',
  ],
  'u10-L5': [
    'Real-world engineering failures, troubleshooting frameworks, and systematic investigation.',
    'Debugging field failures, interpreting test data, and making recommendations under uncertainty.',
    'Cross-disciplinary thinking, systems engineering, and holistic design problem-solving.',
  ],
  'u10-L6': [
    'ISO standards, ASME codes, and quality management systems every engineer should know.',
    'FMEA risk assessment, engineering change orders, and configuration management.',
    'Project scheduling, resource planning, and professional communication for engineers.',
  ],
};

// New teaching cards for each sub-lesson (2 per sub-lesson, inserted at positions 0 and ~5)
function makeTeachingCard(id: string, question: string, explanation: string, hint: string): string {
  return `        {
          id: '${id}',
          type: 'teaching',
          question: '${question.replace(/'/g, "\\'")}',
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

function makeEasyTF(id: string, question: string, correctAnswer: boolean, explanation: string, hint: string): string {
  return `        {
          id: '${id}',
          type: 'true-false',
          question: '${question.replace(/'/g, "\\'")}',
          correctAnswer: ${correctAnswer},
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

function makeEasyMC(id: string, question: string, options: string[], correctIndex: number, explanation: string, hint: string): string {
  const optsStr = options.map(o => `            '${o.replace(/'/g, "\\'")}'`).join(',\n');
  return `        {
          id: '${id}',
          type: 'multiple-choice',
          question: '${question.replace(/'/g, "\\'")}',
          options: [
${optsStr}
          ],
          correctIndex: ${correctIndex},
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

// New questions to convert MC -> variety types
function makeMatchPairs(id: string, question: string, options: string[], matchTargets: string[], correctMatches: number[], explanation: string, hint: string): string {
  const optsStr = options.map(o => `            '${o.replace(/'/g, "\\'")}'`).join(',\n');
  const targetsStr = matchTargets.map(t => `            '${t.replace(/'/g, "\\'")}'`).join(',\n');
  return `        {
          id: '${id}',
          type: 'match-pairs',
          question: '${question.replace(/'/g, "\\'")}',
          options: [
${optsStr}
          ],
          matchTargets: [
${targetsStr}
          ],
          correctMatches: [${correctMatches.join(', ')}],
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

function makeSortBuckets(id: string, question: string, options: string[], buckets: string[], correctBuckets: number[], explanation: string, hint: string): string {
  const optsStr = options.map(o => `            '${o.replace(/'/g, "\\'")}'`).join(',\n');
  const bucketsStr = buckets.map(b => `            '${b.replace(/'/g, "\\'")}'`).join(',\n');
  return `        {
          id: '${id}',
          type: 'sort-buckets',
          question: '${question.replace(/'/g, "\\'")}',
          options: [
${optsStr}
          ],
          buckets: [
${bucketsStr}
          ],
          correctBuckets: [${correctBuckets.join(', ')}],
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

function makeOrderSteps(id: string, question: string, steps: string[], correctOrder: number[], explanation: string, hint: string): string {
  const stepsStr = steps.map(s => `            '${s.replace(/'/g, "\\'")}'`).join(',\n');
  return `        {
          id: '${id}',
          type: 'order-steps',
          question: '${question.replace(/'/g, "\\'")}',
          steps: [
${stepsStr}
          ],
          correctOrder: [${correctOrder.join(', ')}],
          explanation: '${explanation.replace(/'/g, "\\'")}',
          hint: '${hint.replace(/'/g, "\\'")}',
        }`;
}

// Define new teaching cards and easy questions for each sub-lesson
interface SubLessonAdditions {
  teaching1: string;
  easyQ1: string;
  teaching2: string;
  easyQ2: string;
  varietyQuestions: string[]; // replacements for some existing MCs
}

// We'll add these per sub-lesson. IDs use pattern: u10-LXy-NEW-T1, u10-LXy-NEW-E1, etc.
const additions: Record<string, SubLessonAdditions> = {
  // L1a: Fermi Problems Basics (items 1-10 of original L1)
  'u10-L1': {
    teaching1: makeTeachingCard('u10-L1-NEW-T1', 'Breaking Down Big Questions',
      'Fermi problems test how you think, not what you memorize. Break a huge question into small pieces, estimate each piece, and multiply.',
      'Try this now: estimate how many piano tuners are in your city.'),
    easyQ1: makeEasyTF('u10-L1-NEW-E1',
      'In a Fermi estimation, getting within an order of magnitude (factor of 10) of the real answer is considered a good result.',
      true,
      'Fermi estimates aim for the right power of 10, not the exact number.',
      'These estimates prioritize order of magnitude, not precision.'),
    teaching2: makeTeachingCard('u10-L1-NEW-T2', 'Decomposition Is the Key Skill',
      'Interviewers don\'t expect exact answers. They want to see you decompose a problem into parts you can estimate, state your assumptions clearly, and arrive at a reasonable number.',
      'Try this now: estimate how many golf balls fit in a school bus.'),
    easyQ2: makeEasyMC('u10-L1-NEW-E2',
      'What does "order of magnitude" mean?',
      ['A factor of 10', 'A factor of 2', 'An exact answer', 'A factor of 100'],
      0,
      'An order of magnitude is a factor of 10. If the real answer is 5,000, being within an order of magnitude means your answer is between 500 and 50,000.',
      'Think about powers of 10.'),
    varietyQuestions: [
      // Replace Q5 (MC about ball bearings) with match-pairs
      makeMatchPairs('u10-L1-NEW-MP1',
        'Match each estimation technique to its description:',
        ['Fermi estimation', 'Dimensional analysis', 'Scaling law', 'Sanity check'],
        ['Break unknowns into estimable pieces', 'Use units to derive relationships', 'Predict how changes scale with size', 'Compare result to known values'],
        [0, 1, 2, 3],
        'Each technique serves a different purpose in engineering estimation.',
        'Think about what each method does.'),
    ],
  },
  // L1b: Anchor Values & Sanity Checks (items 11-20 of original L1)
  'u10-L1b': {
    teaching1: makeTeachingCard('u10-L1b-NEW-T1', 'Memorize Key Reference Values',
      'You can\'t estimate without reference points. Keep these in your head: steel density 7,850 kg/m3, steel yield 250 MPa, E for steel 200 GPa, water density 1,000 kg/m3.',
      'Try this now: estimate the weight of a 1m steel cube.'),
    easyQ1: makeEasyTF('u10-L1b-NEW-E1',
      'The density of water is approximately 1,000 kg/m3.',
      true,
      'Water density at standard conditions is 1,000 kg/m3. This is one of the most important anchor values.',
      'This is a fundamental reference value.'),
    teaching2: makeTeachingCard('u10-L1b-NEW-T2', 'Always Sanity-Check Your Answer',
      'After calculating, compare your result to something you know. If your estimate says a car weighs 100 kg, something went wrong. A typical car weighs about 1,500 kg.',
      'Try this now: check if your bathtub holds about 150 liters.'),
    easyQ2: makeEasyMC('u10-L1b-NEW-E2',
      'What is the approximate yield strength of common structural steel?',
      ['250 MPa', '25 MPa', '2,500 MPa', '25,000 MPa'],
      0,
      'A36/S275 structural steel yields at about 250 MPa (36 ksi). This is a critical anchor value.',
      'Think about common steel properties.'),
    varietyQuestions: [
      makeSortBuckets('u10-L1b-NEW-SB1',
        'Sort these properties by typical value: high or low?',
        ['Steel E-modulus (200 GPa)', 'Copper conductivity (400 W/mK)', 'Rubber E-modulus (0.01 GPa)', 'Foam density (30 kg/m3)', 'Steel density (7,850 kg/m3)', 'Air density (1.2 kg/m3)'],
        ['High value', 'Low value'],
        [0, 0, 1, 1, 0, 1],
        'Knowing which properties are high or low helps you sanity-check estimates quickly.',
        'Compare each to typical engineering materials.'),
    ],
  },
  // L1c: Scaling Laws & Advanced Estimation (items 21-30 of original L1)
  'u10-L1c': {
    teaching1: makeTeachingCard('u10-L1c-NEW-T1', 'Power Laws Speed Up Estimation',
      'Many quantities follow simple power laws. If you double the diameter of a pipe, flow capacity goes up by 2^(5/2) = 5.66x. Knowing these exponents saves you from recalculating.',
      'Try this now: if you double beam depth, how does deflection change?'),
    easyQ1: makeEasyTF('u10-L1c-NEW-E1',
      'Pump power scales with the cube of speed: doubling RPM increases power by 8x.',
      true,
      'The pump affinity laws: Q scales with N, H with N^2, and P with N^3.',
      'Think about the pump affinity laws.'),
    teaching2: makeTeachingCard('u10-L1c-NEW-T2', 'Combining Estimates for Complex Problems',
      'Real interview problems require chaining estimates. First estimate the volume, then use density for mass, then use material strength for load capacity. Each step builds on the last.',
      'Try this now: estimate the weight of the Eiffel Tower step by step.'),
    easyQ2: makeEasyMC('u10-L1c-NEW-E2',
      'If beam deflection scales as L^3, what happens when you triple the span?',
      ['Deflection increases 27x', 'Deflection increases 9x', 'Deflection increases 3x', 'Deflection stays the same'],
      0,
      'L^3 scaling: 3^3 = 27. Tripling the span increases deflection by 27 times.',
      'Calculate 3 raised to the power of 3.'),
    varietyQuestions: [
      makeOrderSteps('u10-L1c-NEW-OS1',
        'Put these Fermi estimation steps in order:',
        ['Define the quantity you need to estimate', 'Break it into smaller estimable pieces', 'Estimate each piece with assumptions', 'Multiply/combine the pieces', 'Sanity-check against a known value'],
        [0, 1, 2, 3, 4],
        'A structured approach: define, decompose, estimate each piece, combine, then check.',
        'Start with the big picture, end with a reality check.'),
    ],
  },
  // L2a: Failure Modes & Fracture Surfaces
  'u10-L2': {
    teaching1: makeTeachingCard('u10-L2-NEW-T1', 'Reading Fracture Surfaces',
      'A fracture surface is like a crime scene. Beach marks mean fatigue. Chevrons mean brittle overload. Cup-and-cone means ductile overload. Learn to read these clues first.',
      'Try this now: look at a broken item and identify the fracture origin.'),
    easyQ1: makeEasyTF('u10-L2-NEW-E1',
      'Beach marks on a fracture surface indicate that the part failed by fatigue, not sudden overload.',
      true,
      'Beach marks are concentric arcs radiating from the crack origin, a hallmark of fatigue.',
      'Beach marks show progressive crack growth over many cycles.'),
    teaching2: makeTeachingCard('u10-L2-NEW-T2', 'Start With the Three Big Failure Modes',
      'Before diving into exotic mechanisms, check the big three first: fatigue (cyclic loading), overload (single event), and corrosion (environment). Most failures fall into one of these.',
      'Try this now: think of a product recall and identify which category caused it.'),
    easyQ2: makeEasyMC('u10-L2-NEW-E2',
      'Which failure mode is caused by repeated loading and unloading over many cycles?',
      ['Fatigue', 'Overload', 'Creep', 'Erosion'],
      0,
      'Fatigue is caused by cyclic loading. Cracks grow slowly until final fracture.',
      'Think about what "repeated loading" means.'),
    varietyQuestions: [
      makeMatchPairs('u10-L2-NEW-MP1',
        'Match each fracture feature to its failure mode:',
        ['Beach marks', 'Chevron pattern', 'Cup-and-cone', 'Intergranular voids'],
        ['Fatigue', 'Brittle overload', 'Ductile overload', 'Creep'],
        [0, 1, 2, 3],
        'Each failure mode leaves a distinctive signature on the fracture surface.',
        'Each feature is unique to one failure mode.'),
    ],
  },
  // L2b: Root Cause Analysis Tools
  'u10-L2b': {
    teaching1: makeTeachingCard('u10-L2b-NEW-T1', 'Systematic Problem Solving',
      'Good failure analysis is systematic, not guesswork. Use structured tools like fishbone diagrams, 5 Whys, and FMEA to find the root cause instead of jumping to conclusions.',
      'Try this now: pick a common problem and ask "why?" 5 times.'),
    easyQ1: makeEasyTF('u10-L2b-NEW-E1',
      'The "5 Whys" technique involves asking "why?" repeatedly to dig past symptoms and find the root cause.',
      true,
      'Developed at Toyota, the 5 Whys peels back layers of symptoms until you reach the true root cause.',
      'Each "why" digs one layer deeper.'),
    teaching2: makeTeachingCard('u10-L2b-NEW-T2', 'FMEA Prioritizes Risks',
      'FMEA rates each failure mode by Severity, Occurrence, and Detection. Multiply them together to get a Risk Priority Number (RPN). Fix the highest RPNs first.',
      'Try this now: rate a common product failure by severity (1-10), occurrence (1-10), and detection (1-10).'),
    easyQ2: makeEasyMC('u10-L2b-NEW-E2',
      'In a fishbone diagram, what do the "bones" represent?',
      ['Potential causes grouped by category', 'Steps in the manufacturing process', 'Different product versions', 'Customer complaints'],
      0,
      'Fishbone (Ishikawa) diagrams organize potential causes into categories like Man, Machine, Method, Material.',
      'The diagram looks like a fish skeleton with cause categories.'),
    varietyQuestions: [
      makeOrderSteps('u10-L2b-NEW-OS1',
        'Put these 8D problem-solving steps in order:',
        ['Form a cross-functional team', 'Define the problem clearly', 'Implement interim containment', 'Identify the root cause', 'Implement permanent corrective action'],
        [0, 1, 2, 3, 4],
        'The 8D process is sequential: team, problem, containment, root cause, then permanent fix.',
        'You need to contain the problem before you can fix it permanently.'),
    ],
  },
  // L2c: Environment-Assisted Failures
  'u10-L2c': {
    teaching1: makeTeachingCard('u10-L2c-NEW-T1', 'Corrosion Is More Than Rust',
      'Corrosion comes in many forms: pitting, crevice, galvanic, stress corrosion cracking, and erosion-corrosion. Each has different causes and different prevention strategies.',
      'Try this now: check if any metal items around you show signs of corrosion.'),
    easyQ1: makeEasyTF('u10-L2c-NEW-E1',
      'Galvanic corrosion requires two dissimilar metals and an electrolyte (conductive liquid) to occur.',
      true,
      'Without an electrolyte to carry ions, galvanic corrosion can\'t happen even with dissimilar metals touching.',
      'Think about the three requirements for galvanic corrosion.'),
    teaching2: makeTeachingCard('u10-L2c-NEW-T2', 'Hidden Environmental Damage',
      'Some failures happen below yield strength. Stress corrosion cracking, hydrogen embrittlement, and temper embrittlement can cause sudden failure in parts that look perfectly fine on the surface.',
      'Always ask: what fluids, temperatures, and chemicals is the part exposed to?'),
    easyQ2: makeEasyMC('u10-L2c-NEW-E2',
      'Stress corrosion cracking requires three simultaneous conditions. Which is NOT one of them?',
      ['High rotational speed', 'A susceptible material', 'Tensile stress', 'A corrosive environment'],
      0,
      'SCC needs: susceptible material + tensile stress + corrosive environment. Speed is not a factor.',
      'Think about what "stress corrosion cracking" literally means.'),
    varietyQuestions: [
      makeSortBuckets('u10-L2c-NEW-SB1',
        'Sort these failure mechanisms by their primary driver:',
        ['Stress corrosion cracking', 'Fatigue', 'Galvanic corrosion', 'Creep', 'Hydrogen embrittlement', 'Overload'],
        ['Environment-assisted', 'Mechanical loading'],
        [0, 1, 0, 1, 0, 1],
        'Environment-assisted failures need specific chemical or thermal conditions. Mechanical failures are driven by loads.',
        'Which failures require a specific environment to occur?'),
    ],
  },
  // L3a: Material Selection Basics
  'u10-L3': {
    teaching1: makeTeachingCard('u10-L3-NEW-T1', 'Material Selection Is About Trade-offs',
      'There\'s no best material. There\'s only the best material for your specific constraints: cost, weight, strength, temperature, corrosion resistance, and manufacturability.',
      'Try this now: pick an everyday object and think about why that specific material was chosen.'),
    easyQ1: makeEasyTF('u10-L3-NEW-E1',
      'When an interviewer asks "which material is best?" the right first response is to ask what the constraints and priorities are.',
      true,
      'Material selection always depends on context. Asking about constraints shows engineering maturity.',
      'There\'s no universal "best" material.'),
    teaching2: makeTeachingCard('u10-L3-NEW-T2', 'Ashby Charts Map Material Properties',
      'Ashby charts plot one property vs another (like strength vs density) so you can visually compare material families. Different loading modes need different material indices.',
      'Try this now: think about whether you\'d optimize for strength/weight or stiffness/weight in a bike frame.'),
    easyQ2: makeEasyMC('u10-L3-NEW-E2',
      'What does a material index help you do?',
      ['Rank materials for a specific loading scenario', 'Calculate exact stress values', 'Determine the manufacturing process', 'Find the material\'s price'],
      0,
      'Material indices like E/rho or sigma_y/rho rank materials for specific loading modes (tension, bending, etc.).',
      'Material indices combine properties relevant to your design goal.'),
    varietyQuestions: [
      makeMatchPairs('u10-L3-NEW-MP1',
        'Match each loading mode to its lightweight material index:',
        ['Tension (min weight)', 'Bending (min weight)', 'Buckling (min weight)', 'Thermal insulation'],
        ['sigma_y / rho', 'sigma_y^(2/3) / rho', 'E^(1/2) / rho', '1 / k (thermal conductivity)'],
        [0, 1, 2, 3],
        'Different loading modes require different property combinations for optimal lightweight design.',
        'Each loading mode has a unique material index.'),
    ],
  },
  // L3b: DFM, DFA & Cost Reduction
  'u10-L3b': {
    teaching1: makeTeachingCard('u10-L3b-NEW-T1', 'Fewer Parts Means Lower Cost',
      'Design for Assembly (DFA) reduces part count. For each part, ask: does it move relative to neighbors? Must it be a different material? Must it be separate for assembly? If all answers are no, combine it.',
      'Try this now: pick a product and count how many parts could be combined.'),
    easyQ1: makeEasyTF('u10-L3b-NEW-E1',
      'Design for Manufacturing (DFM) aims to make individual parts easier and cheaper to produce.',
      true,
      'DFM simplifies each part. DFA reduces the total number of parts. Both lower cost.',
      'DFM focuses on individual part simplicity.'),
    teaching2: makeTeachingCard('u10-L3b-NEW-T2', 'Tolerances Drive Cost',
      'Tighter tolerances cost more. A part machined to +/- 0.01 mm costs much more than one at +/- 0.1 mm. Only tighten tolerances where function actually requires it.',
      'Try this now: think about which dimensions on a bracket actually need tight tolerances.'),
    easyQ2: makeEasyMC('u10-L3b-NEW-E2',
      'Which approach typically reduces manufacturing cost the most?',
      ['Relaxing non-critical tolerances', 'Using exotic materials', 'Adding more inspection steps', 'Making parts thicker'],
      0,
      'Relaxing tolerances on non-critical features is often the single biggest cost saver.',
      'Tight tolerances require more precise (expensive) processes.'),
    varietyQuestions: [
      makeSortBuckets('u10-L3b-NEW-SB1',
        'Sort these strategies into DFM or DFA:',
        ['Reduce part count', 'Add draft angles to castings', 'Use self-locating features', 'Avoid undercuts in molding', 'Design for top-down assembly', 'Use standard tooling sizes'],
        ['DFA (assembly)', 'DFM (manufacturing)'],
        [0, 1, 0, 1, 0, 1],
        'DFA focuses on assembly simplicity (fewer parts, easier assembly). DFM focuses on making each part easier to produce.',
        'Think about whether the strategy helps assembly or manufacturing.'),
    ],
  },
  // L3c: Decision Matrices & Optimization
  'u10-L3c': {
    teaching1: makeTeachingCard('u10-L3c-NEW-T1', 'Structured Decision Making',
      'A Pugh matrix compares design concepts against a reference design. Rate each concept as better (+), same (S), or worse (-) on each criterion. The concept with the most plusses wins.',
      'Try this now: compare two phone cases on 5 criteria using +/S/-.'),
    easyQ1: makeEasyTF('u10-L3c-NEW-E1',
      'A Pugh matrix compares design alternatives against a reference (datum) design using simple better/same/worse ratings.',
      true,
      'The Pugh matrix is a quick concept screening tool that doesn\'t require numerical scores.',
      'It uses +, S, and - ratings.'),
    teaching2: makeTeachingCard('u10-L3c-NEW-T2', 'Weight Your Criteria',
      'Not all criteria matter equally. A weighted decision matrix multiplies each score by the criterion\'s importance weight. Safety might get weight 10 while color gets weight 1.',
      'Try this now: rank 5 criteria for buying a car by importance.'),
    easyQ2: makeEasyMC('u10-L3c-NEW-E2',
      'In a weighted decision matrix, what happens if you give all criteria equal weight?',
      ['Unimportant factors influence the result as much as critical ones', 'The matrix becomes more accurate', 'Costs are automatically minimized', 'All designs score the same'],
      0,
      'Equal weighting treats color preference the same as structural integrity. Weight critical criteria higher.',
      'Think about what "weight" means in decision-making.'),
    varietyQuestions: [
      makeOrderSteps('u10-L3c-NEW-OS1',
        'Put these design decision steps in order:',
        ['Define requirements and constraints', 'Generate multiple design concepts', 'Evaluate concepts against criteria', 'Select the best concept', 'Refine and detail the chosen design'],
        [0, 1, 2, 3, 4],
        'Good design follows a structured process: define, generate, evaluate, select, then refine.',
        'You can\'t select a concept before you\'ve generated alternatives.'),
    ],
  },
  // L4a-c, L5a-c, L6a-c follow similar patterns
  'u10-L4': {
    teaching1: makeTeachingCard('u10-L4-NEW-T1', 'FEA Approximates Reality',
      'Finite Element Analysis divides a complex shape into simple elements, solves equations for each, and assembles the results. It\'s an approximation. Finer mesh means better accuracy but longer solve time.',
      'Try this now: imagine dividing a bracket into tiny triangles.'),
    easyQ1: makeEasyTF('u10-L4-NEW-E1',
      'In FEA, using a finer (denser) mesh generally improves accuracy but increases computation time.',
      true,
      'More elements means better approximation of the geometry and stress field, but solving takes longer.',
      'Think about the trade-off between accuracy and speed.'),
    teaching2: makeTeachingCard('u10-L4-NEW-T2', 'Element Type Matters',
      'Linear elements (4-node tet, 8-node hex) are fast but less accurate for bending. Quadratic elements (10-node tet, 20-node hex) capture bending much better with fewer elements.',
      'Try this now: think about which is cheaper: more simple elements or fewer complex ones?'),
    easyQ2: makeEasyMC('u10-L4-NEW-E2',
      'What is a "mesh" in FEA?',
      ['The network of elements that divide the geometry', 'The loading conditions applied to the model', 'The material property database', 'The solver algorithm'],
      0,
      'A mesh is the collection of nodes and elements that discretize the continuous geometry.',
      'Think about dividing a shape into small pieces.'),
    varietyQuestions: [
      makeMatchPairs('u10-L4-NEW-MP1',
        'Match each FEA term to its meaning:',
        ['Node', 'Element', 'Boundary condition', 'Convergence'],
        ['A point in the mesh', 'A small piece of the geometry', 'A constraint or load applied to the model', 'Results stabilize as mesh is refined'],
        [0, 1, 2, 3],
        'These are the fundamental concepts of FEA that every engineer should know.',
        'Each term describes a basic FEA building block.'),
    ],
  },
  'u10-L4b': {
    teaching1: makeTeachingCard('u10-L4b-NEW-T1', 'Boundary Conditions Make or Break FEA',
      'Wrong boundary conditions give wrong answers, no matter how fine your mesh. Always verify that your constraints match reality. Over-constraining makes the model too stiff.',
      'Try this now: think about how you\'d constrain a simply-supported beam in FEA.'),
    easyQ1: makeEasyTF('u10-L4b-NEW-E1',
      'Fixing all 6 degrees of freedom at a support creates a fully fixed (encastre) boundary condition.',
      true,
      'Fixing all translations and rotations at a node models a perfectly rigid wall mount.',
      'Six DOF means 3 translations + 3 rotations.'),
    teaching2: makeTeachingCard('u10-L4b-NEW-T2', 'Check Convergence Before Trusting Results',
      'Run your model with 2-3 different mesh densities. If the peak stress changes less than 5% between meshes, you\'ve converged. If it keeps changing, refine further.',
      'Try this now: think about what would happen if you never checked convergence.'),
    easyQ2: makeEasyMC('u10-L4b-NEW-E2',
      'What does "mesh convergence" mean in FEA?',
      ['Results stop changing significantly as you refine the mesh', 'The solver finishes running', 'All elements have the same size', 'The model matches the CAD geometry exactly'],
      0,
      'Convergence means your results are mesh-independent. Further refinement won\'t change the answer.',
      'Think about what "converge" means mathematically.'),
    varietyQuestions: [
      makeOrderSteps('u10-L4b-NEW-OS1',
        'Put these FEA workflow steps in order:',
        ['Import or create geometry', 'Assign material properties', 'Apply mesh to the geometry', 'Apply loads and boundary conditions', 'Run the solver and check convergence'],
        [0, 1, 2, 3, 4],
        'The standard FEA workflow: geometry, materials, mesh, loads/BCs, then solve.',
        'You need geometry before you can mesh it.'),
    ],
  },
  'u10-L4c': {
    teaching1: makeTeachingCard('u10-L4c-NEW-T1', 'Stress Singularities Are Not Real',
      'Sharp corners in FEA produce infinite stress as you refine the mesh. This is a math artifact, not reality. Real parts have fillets, and real stresses are finite. Ignore singularity peaks.',
      'Try this now: think about why a perfectly sharp corner can\'t exist in the real world.'),
    easyQ1: makeEasyTF('u10-L4c-NEW-E1',
      'A stress singularity in FEA means the stress at a sharp corner approaches infinity as the mesh is refined.',
      true,
      'This is a mathematical artifact of the model, not a real physical stress. Real corners have small radii.',
      'Perfect sharp corners don\'t exist in real parts.'),
    teaching2: makeTeachingCard('u10-L4c-NEW-T2', 'Always Validate Against Hand Calcs',
      'FEA results should agree with simple hand calculations within 10-20%. If your FEA says a beam deflects 1 mm but your hand calc says 10 mm, something is wrong with the model.',
      'Try this now: estimate the deflection of a cantilever beam and compare to an FEA result.'),
    easyQ2: makeEasyMC('u10-L4c-NEW-E2',
      'What should you do if FEA stress results disagree significantly with a hand calculation?',
      ['Check the model for errors in BCs, loads, or material properties', 'Trust the FEA because computers are more accurate', 'Add more elements until FEA matches', 'Ignore the hand calculation'],
      0,
      'Disagreement between FEA and hand calcs usually means a modeling error. Always investigate.',
      'Hand calcs are your sanity check.'),
    varietyQuestions: [
      makeSortBuckets('u10-L4c-NEW-SB1',
        'Sort these FEA observations into real problems or normal artifacts:',
        ['Stress singularity at a sharp corner', 'Convergence study shows 5% change', 'Peak stress at a fillet root', 'Hourglass modes in reduced-integration elements', 'Stress concentration at a bolt hole', 'Rigid body motion in the model'],
        ['Normal/artifact', 'Real problem'],
        [0, 0, 0, 1, 0, 1],
        'Singularities and small convergence changes are expected. Hourglass modes and rigid body motion indicate errors.',
        'Think about which observations indicate modeling mistakes.'),
    ],
  },
  'u10-L5': {
    teaching1: makeTeachingCard('u10-L5-NEW-T1', 'Case Studies Show Your Engineering Judgment',
      'Interviewers use case studies to test how you approach open-ended problems. There\'s rarely one right answer. They want to see structured thinking, clear communication, and sound judgment.',
      'Try this now: think about a product failure you\'ve heard of and what you\'d investigate first.'),
    easyQ1: makeEasyTF('u10-L5-NEW-E1',
      'In a case study interview, demonstrating a structured approach is more important than getting the exact right answer.',
      true,
      'Interviewers evaluate your thought process and communication, not just the final answer.',
      'Process matters more than the specific conclusion.'),
    teaching2: makeTeachingCard('u10-L5-NEW-T2', 'Define Before You Solve',
      'Before jumping into a solution, clearly define the problem, list your assumptions, identify what data you need, and outline your approach. This shows organized thinking.',
      'Try this now: pick any engineering problem and write down 3 assumptions you\'d make.'),
    easyQ2: makeEasyMC('u10-L5-NEW-E2',
      'What should you do first when given a case study problem in an interview?',
      ['Clarify the problem and state your assumptions', 'Start calculating immediately', 'Ask for the correct answer', 'Look up the solution online'],
      0,
      'Always start by understanding and framing the problem. Then state assumptions before diving into analysis.',
      'Good engineers define the problem before solving it.'),
    varietyQuestions: [
      makeOrderSteps('u10-L5-NEW-OS1',
        'Put these troubleshooting steps in order:',
        ['Gather symptoms and operating conditions', 'Form hypotheses about root cause', 'Design tests to confirm or eliminate hypotheses', 'Implement the fix', 'Verify the fix resolved the issue'],
        [0, 1, 2, 3, 4],
        'Systematic troubleshooting: gather data, hypothesize, test, fix, then verify.',
        'You need symptoms before you can form hypotheses.'),
    ],
  },
  'u10-L5b': {
    teaching1: makeTeachingCard('u10-L5b-NEW-T1', 'Field Failures Are Different From Lab Failures',
      'Parts that work perfectly in the lab can fail in the field due to environmental conditions, user behavior, or maintenance practices that differ from your test setup.',
      'Try this now: think of 3 ways a lab test might not match real-world conditions.'),
    easyQ1: makeEasyTF('u10-L5b-NEW-E1',
      'A product that passes all lab tests is guaranteed to never fail in the field.',
      false,
      'Lab tests can\'t replicate every field condition. Temperature, humidity, vibration, and user behavior all vary.',
      'Think about what conditions might differ between lab and field.'),
    teaching2: makeTeachingCard('u10-L5b-NEW-T2', 'Data-Driven Decisions',
      'Don\'t guess. Collect data from field returns, warranty claims, and inspection reports. Look for patterns: does the failure happen in a specific climate? After a specific maintenance event?',
      'Try this now: think about what data you\'d collect from a returned failed product.'),
    easyQ2: makeEasyMC('u10-L5b-NEW-E2',
      'An intermittent field failure that can\'t be reproduced in the lab most likely relates to:',
      ['Environmental or usage differences between lab and field', 'A software bug in the test equipment', 'The lab technician making errors', 'The part being too strong for lab loads'],
      0,
      'Unreproducible failures usually stem from conditions present in the field but absent in the lab.',
      'What\'s different between the lab environment and the field?'),
    varietyQuestions: [
      makeMatchPairs('u10-L5b-NEW-MP1',
        'Match each investigation technique to what it reveals:',
        ['Fractography (SEM)', 'Chemical analysis (EDS)', 'Hardness testing', 'Dimensional inspection'],
        ['Microscopic fracture features', 'Material composition', 'Heat treatment condition', 'Manufacturing accuracy'],
        [0, 1, 2, 3],
        'Different analysis techniques answer different questions about a failure.',
        'Each technique reveals different information about the part.'),
    ],
  },
  'u10-L5c': {
    teaching1: makeTeachingCard('u10-L5c-NEW-T1', 'Think Across Disciplines',
      'Real engineering problems don\'t respect subject boundaries. A vibration problem might be caused by a fluid dynamics issue. A corrosion problem might stem from a thermal design choice.',
      'Try this now: think of a problem where multiple engineering disciplines interact.'),
    easyQ1: makeEasyTF('u10-L5c-NEW-E1',
      'A good engineer only needs to understand their own discipline to solve real-world problems.',
      false,
      'Real problems cross disciplines. Thermal, structural, fluid, and electrical effects often interact.',
      'Think about whether real problems stay neatly in one subject area.'),
    teaching2: makeTeachingCard('u10-L5c-NEW-T2', 'Systems Thinking in Design',
      'Every component exists in a system. Changing one part affects others. Before proposing a fix, consider the ripple effects on weight, cost, assembly, maintenance, and other subsystems.',
      'Try this now: think about how making a bracket thicker affects the whole system.'),
    easyQ2: makeEasyMC('u10-L5c-NEW-E2',
      'When proposing a design change, what should you always consider?',
      ['How the change affects other parts of the system', 'Only the stress in the changed part', 'Whether the change looks better aesthetically', 'Only the manufacturing cost'],
      0,
      'Systems thinking means considering ripple effects: weight, cost, assembly, thermal, maintenance impacts.',
      'Changes in one area often affect other areas.'),
    varietyQuestions: [
      makeSortBuckets('u10-L5c-NEW-SB1',
        'Sort these engineering considerations into design phase or validation phase:',
        ['Material selection', 'Prototype testing', 'Tolerance analysis', 'Accelerated life testing', 'FEA stress analysis', 'Field trial monitoring'],
        ['Design phase', 'Validation phase'],
        [0, 1, 0, 1, 0, 1],
        'Design-phase activities happen before building. Validation activities confirm the design works.',
        'Think about whether you do this before or after building a prototype.'),
    ],
  },
  'u10-L6': {
    teaching1: makeTeachingCard('u10-L6-NEW-T1', 'Standards Exist for Good Reason',
      'ISO, ASME, and other standards codify best practices so engineers don\'t repeat past mistakes. Knowing which standards apply to your work is a basic professional requirement.',
      'Try this now: find out which ISO standard covers quality management systems.'),
    easyQ1: makeEasyTF('u10-L6-NEW-E1',
      'ISO 9001 is the international standard for quality management systems.',
      true,
      'ISO 9001 defines requirements for a quality management system. It\'s the most widely used standard worldwide.',
      'This is the most recognized quality standard globally.'),
    teaching2: makeTeachingCard('u10-L6-NEW-T2', 'Standards vs Codes vs Specifications',
      'Standards define general requirements (ISO 9001). Codes are legally enforceable rules (ASME BPVC). Specifications detail exact requirements for a specific product or process.',
      'Try this now: think about whether a building code is a standard, code, or specification.'),
    easyQ2: makeEasyMC('u10-L6-NEW-E2',
      'What is the ASME Boiler and Pressure Vessel Code (BPVC) primarily used for?',
      ['Safe design and construction of pressure equipment', 'Electrical wiring standards', 'Software quality assurance', 'Environmental regulations'],
      0,
      'ASME BPVC is the primary standard for pressure vessel and boiler design safety in the US.',
      'Think about what "boiler and pressure vessel" tells you.'),
    varietyQuestions: [
      makeMatchPairs('u10-L6-NEW-MP1',
        'Match each standard to its primary focus:',
        ['ISO 9001', 'ASME BPVC', 'ISO 14001', 'ASME Y14.5'],
        ['Quality management', 'Pressure vessel safety', 'Environmental management', 'GD&T dimensioning'],
        [0, 1, 2, 3],
        'Each standard covers a specific domain. Knowing which is which is professional literacy.',
        'Match based on the keywords in each standard\'s name.'),
    ],
  },
  'u10-L6b': {
    teaching1: makeTeachingCard('u10-L6b-NEW-T1', 'Risk Assessment Prevents Failures',
      'FMEA, fault tree analysis, and HAZOP are proactive tools that identify risks before they become failures. They\'re standard practice in automotive, aerospace, and process industries.',
      'Try this now: think of 3 things that could go wrong with a product you use daily.'),
    easyQ1: makeEasyTF('u10-L6b-NEW-E1',
      'FMEA stands for Failure Mode and Effects Analysis.',
      true,
      'FMEA systematically identifies potential failure modes, their effects, and their causes to prioritize risks.',
      'Each letter stands for a word in the full name.'),
    teaching2: makeTeachingCard('u10-L6b-NEW-T2', 'Change Control Prevents Chaos',
      'Engineering Change Orders (ECOs) document and control modifications to released designs. Without formal change control, one team\'s "fix" becomes another team\'s unexpected problem.',
      'Try this now: think about what could go wrong if someone changed a part without telling manufacturing.'),
    easyQ2: makeEasyMC('u10-L6b-NEW-E2',
      'What is the purpose of an Engineering Change Order (ECO)?',
      ['To formally document and control design modifications', 'To order new engineering tools', 'To schedule employee training', 'To calculate project budgets'],
      0,
      'ECOs ensure that design changes are reviewed, approved, and communicated to all affected teams.',
      'Think about what "change order" implies.'),
    varietyQuestions: [
      makeOrderSteps('u10-L6b-NEW-OS1',
        'Put these engineering change management steps in order:',
        ['Identify the need for a change', 'Document the proposed change on an ECO', 'Review and approve with cross-functional team', 'Implement the change in production', 'Verify the change works correctly'],
        [0, 1, 2, 3, 4],
        'Change management follows a formal process: identify, document, review, implement, verify.',
        'You need approval before implementing any change.'),
    ],
  },
  'u10-L6c': {
    teaching1: makeTeachingCard('u10-L6c-NEW-T1', 'Engineers Need Project Management Skills',
      'Technical skills alone aren\'t enough. You need to plan schedules, manage resources, track milestones, and communicate status. A Gantt chart and a risk register are your basic tools.',
      'Try this now: think about the last time a project was late and what caused the delay.'),
    easyQ1: makeEasyTF('u10-L6c-NEW-E1',
      'A Gantt chart is a visual tool that shows project tasks plotted against time.',
      true,
      'Gantt charts show task durations, dependencies, and milestones on a timeline.',
      'Think of a horizontal bar chart showing when tasks start and end.'),
    teaching2: makeTeachingCard('u10-L6c-NEW-T2', 'Communication Is Engineering Too',
      'Writing clear reports, presenting data effectively, and explaining technical decisions to non-engineers are core engineering skills, not optional extras.',
      'Try this now: practice explaining a technical concept to someone without using jargon.'),
    easyQ2: makeEasyMC('u10-L6c-NEW-E2',
      'What does the "critical path" in project management represent?',
      ['The longest sequence of dependent tasks that determines project duration', 'The most expensive tasks in the project', 'Tasks that require the most engineers', 'The path with the most safety risks'],
      0,
      'The critical path determines the minimum project duration. Delays on any critical-path task delay the whole project.',
      'Think about which tasks can\'t be delayed without delaying the project.'),
    varietyQuestions: [
      makeSortBuckets('u10-L6c-NEW-SB1',
        'Sort these into technical skills or professional skills:',
        ['FEA modeling', 'Writing technical reports', 'Material selection', 'Presenting to stakeholders', 'Tolerance analysis', 'Managing project schedules'],
        ['Technical skill', 'Professional skill'],
        [0, 1, 0, 1, 0, 1],
        'Both technical and professional skills are essential for engineering careers.',
        'Think about whether each skill involves analysis or communication/management.'),
    ],
  },
};

// Now build the output
function buildSubLesson(
  id: string,
  title: string,
  description: string,
  icon: string,
  xpReward: number,
  levels: number,
  questions: ParsedQuestion[],
  adds: SubLessonAdditions
): string {
  // Build question list:
  // 1. teaching1 (new)
  // 2. easyQ1 (new)
  // 3-4. first 2 existing questions (easy end of original)
  // 5. varietyQuestion (new, replaces one original)
  // 6. teaching2 (new)
  // 7. easyQ2 (new)
  // 8-11. remaining existing questions (medium-hard)

  const items: string[] = [];
  items.push(adds.teaching1);
  items.push(adds.easyQ1);

  // Take up to 9 existing questions (to make total ~11 with 2 new teaching + 2 easy)
  // Actually: 2 teaching + 2 easy + 1 variety + ~6 existing = 11
  const existingToUse = questions.slice(0, 8); // up to 8 existing

  // Add first 2 existing (easier ones)
  if (existingToUse.length > 0) items.push('    ' + existingToUse[0].raw.trim().split('\n').map((l, i) => i === 0 ? '    ' + l.trim() : '          ' + l.trim()).join('\n'));
  if (existingToUse.length > 1) items.push('    ' + existingToUse[1].raw.trim().split('\n').map((l, i) => i === 0 ? '    ' + l.trim() : '          ' + l.trim()).join('\n'));

  // Add variety question
  if (adds.varietyQuestions.length > 0) {
    items.push(adds.varietyQuestions[0]);
  }

  items.push(adds.teaching2);
  items.push(adds.easyQ2);

  // Add remaining existing questions
  for (let i = 2; i < Math.min(existingToUse.length, 6); i++) {
    items.push('    ' + existingToUse[i].raw.trim().split('\n').map((l, li) => li === 0 ? '    ' + l.trim() : '          ' + l.trim()).join('\n'));
  }

  const questionsStr = items.join(',\n');

  return `    {
      id: '${id}',
      title: '${title}',
      description: '${description}',
      icon: '${icon}',
      xpReward: ${xpReward},
      levels: ${levels},
      questions: [
${questionsStr}
      ]
    }`;
}

// Actually, given the complexity of preserving the raw question formatting with
// their massive SVGs, let me use a simpler approach: insert items at specific positions
// in the existing questions array.

// Let me restructure more carefully...

// For each original lesson, we have questions[0..N-1].
// Split into 3 groups of ~10:
//   Group A: questions[0..9]   -> sub-lesson X
//   Group B: questions[10..19] -> sub-lesson Xb
//   Group C: questions[20..29] -> sub-lesson Xc
// (some lessons have 33 items including teaching cards)

// For each sub-lesson, inject:
//   Position 0: new teaching card
//   Position 1: new easy question
//   Position ~5: new teaching card
//   Position ~6: new easy question
//   Replace 1 MC with variety question

// This means each sub-lesson has: 10 original + 4 new + 1 variety = ~13 items
// That's slightly over target of 11... Let me trim to use 7-8 original instead.

// Actually the instructions say "~11 items each" so let's target exactly 11:
// 2 teaching + 2 easy + 1 variety + 6 original = 11

// Build the restructured file

let output = `${importLine}\n\nexport const unit10: Unit = {\n  id: 'u10-interview',\n  title: 'Interview Problem Solving',\n  description: 'Estimation problems, failure analysis, design trade-offs, FEA interpretation, and real-world engineering case studies.',\n  color: '#14B8A6',\n  icon: '\\u{1F9E0}',\n  lessons: [\n`;

const lessonIds = ['u10-L1', 'u10-L2', 'u10-L3', 'u10-L4', 'u10-L5', 'u10-L6'];
const suffixes = ['', 'b', 'c'];

for (const lid of lessonIds) {
  const lesson = lessons.find(l => l.id === lid)!;
  const qs = lesson.questions;

  // Split into 3 groups of ~10
  const third = Math.ceil(qs.length / 3);
  const groups = [
    qs.slice(0, third),
    qs.slice(third, third * 2),
    qs.slice(third * 2)
  ];

  for (let g = 0; g < 3; g++) {
    const suffix = suffixes[g];
    const subId = `${lid}${suffix}`;
    const titles = subLessonTitles[lid];
    const descs = subLessonDescs[lid];
    const adds = additions[subId];

    if (!adds) {
      console.error(`Missing additions for ${subId}`);
      continue;
    }

    const group = groups[g];

    // Select 6 questions from the group (skip teaching cards from original, we add our own)
    // Actually, preserve existing teaching cards if they exist
    const existingQuestions = group.filter(q => q.type !== 'teaching');
    const selectedOriginal = existingQuestions.slice(0, 6);

    // Build the questions array
    const allItems: string[] = [];

    // 1. New teaching card 1
    allItems.push(adds.teaching1);
    // 2. New easy question 1
    allItems.push(adds.easyQ1);
    // 3-4. First 2 original (easier end)
    for (let i = 0; i < Math.min(2, selectedOriginal.length); i++) {
      allItems.push('        ' + selectedOriginal[i].raw);
    }
    // 5. Variety question
    if (adds.varietyQuestions.length > 0) {
      allItems.push(adds.varietyQuestions[0]);
    }
    // 6. New teaching card 2
    allItems.push(adds.teaching2);
    // 7. New easy question 2
    allItems.push(adds.easyQ2);
    // 8-11. Remaining original (medium-hard)
    for (let i = 2; i < Math.min(6, selectedOriginal.length); i++) {
      allItems.push('        ' + selectedOriginal[i].raw);
    }

    const xp = g === 0 ? lesson.xpReward : (g === 1 ? lesson.xpReward : lesson.xpReward + 5);

    output += `    {\n`;
    output += `      id: '${subId}',\n`;
    output += `      title: '${titles[g]}',\n`;
    output += `      description: '${descs[g]}',\n`;
    output += `      icon: '${lesson.icon}',\n`;
    output += `      xpReward: ${xp},\n`;
    output += `      levels: ${lesson.levels},\n`;
    output += `      questions: [\n`;
    output += allItems.join(',\n');
    output += `\n      ]\n`;
    output += `    },\n`;
  }
}

// Add conversation lesson
output += `    {\n`;
output += `      id: 'u10-L-conv',\n`;
output += `      title: 'Mock Technical Interview',\n`;
output += `      description: 'Practice a realistic technical interview scenario with an engineering manager.',\n`;
output += `      icon: '\\u{1F4AC}',\n`;
output += `      type: 'conversation',\n`;
output += `      xpReward: 20,\n`;
output += `      questions: [],\n`;
output += `      conversationStartNodeId: 'u10-L-conv-C1',\n`;
output += `      conversationNodes: [\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C1',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'Thanks for coming in. I\\'m going to walk you through a design scenario. A customer reports that our stainless steel pump shaft is cracking after 6 months of service in a chemical plant. How would you start investigating?',\n`;
output += `          nextNodeId: 'u10-L-conv-C2',\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C2',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'Walk me through your approach.',\n`;
output += `          options: [\n`;
output += `            {\n`;
output += `              text: 'First, I\\'d preserve the failed shaft for fractography. Then I\\'d gather operating conditions: fluid chemistry, temperature, pressure cycles, and maintenance history. The fracture surface will tell us whether it\\'s fatigue, SCC, or overload.',\n`;
output += `              nextNodeId: 'u10-L-conv-C3',\n`;
output += `              quality: 'great',\n`;
output += `              feedback: 'Excellent. You prioritized evidence preservation and systematic data gathering before jumping to conclusions.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'I\\'d replace the shaft with a stronger material right away so the customer isn\\'t down.',\n`;
output += `              nextNodeId: 'u10-L-conv-C3',\n`;
output += `              quality: 'poor',\n`;
output += `              feedback: 'Jumping to a fix without understanding the root cause often leads to repeat failures. You also lose valuable evidence.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'I\\'d check the material certificate to see if it meets spec, then look at the fracture surface.',\n`;
output += `              nextNodeId: 'u10-L-conv-C3',\n`;
output += `              quality: 'okay',\n`;
output += `              feedback: 'Material verification is good, but you should also gather operating conditions and preserve evidence first.',\n`;
output += `            },\n`;
output += `          ],\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C3',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'Good. The fractography shows branching cracks that follow grain boundaries. The fluid is warm chloride solution. What\\'s your diagnosis?',\n`;
output += `          nextNodeId: 'u10-L-conv-C4',\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C4',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'What failure mechanism are we looking at?',\n`;
output += `          options: [\n`;
output += `            {\n`;
output += `              text: 'Chloride stress corrosion cracking. Austenitic stainless steels are susceptible in warm chloride environments under tensile stress. I\\'d recommend switching to a duplex stainless or a nickel alloy.',\n`;
output += `              nextNodeId: 'u10-L-conv-C5',\n`;
output += `              quality: 'great',\n`;
output += `              feedback: 'Spot on. Branching intergranular cracks plus chlorides plus austenitic stainless is the classic SCC triad. Your material suggestion is practical too.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'It\\'s probably fatigue from pressure cycling.',\n`;
output += `              nextNodeId: 'u10-L-conv-C5',\n`;
output += `              quality: 'poor',\n`;
output += `              feedback: 'Fatigue shows beach marks and striations, not branching intergranular cracks. The chloride environment is a key clue you shouldn\\'t ignore.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'Could be some kind of corrosion issue given the chlorides. I\\'d need to run more tests.',\n`;
output += `              nextNodeId: 'u10-L-conv-C5',\n`;
output += `              quality: 'okay',\n`;
output += `              feedback: 'You\\'re on the right track with corrosion, but the branching intergranular pattern is specific enough to diagnose SCC directly.',\n`;
output += `            },\n`;
output += `          ],\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C5',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'Last question. The customer asks: can we just add a coating instead of changing materials? It\\'s cheaper. How do you handle this?',\n`;
output += `          nextNodeId: 'u10-L-conv-C6',\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C6',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'What do you tell the customer?',\n`;
output += `          options: [\n`;
output += `            {\n`;
output += `              text: 'Coatings can help but they\\'re not foolproof. Any scratch or holiday in the coating exposes the base metal to the same SCC risk. For a rotating shaft with wear, I\\'d recommend the material change for long-term reliability, but we could coat a trial unit to compare.',\n`;
output += `              nextNodeId: 'u10-L-conv-C7',\n`;
output += `              quality: 'great',\n`;
output += `              feedback: 'Great balance of technical honesty and customer diplomacy. You explained the risk without dismissing their concern, and offered a data-driven path forward.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'No, coatings won\\'t work. We have to change the material. Period.',\n`;
output += `              nextNodeId: 'u10-L-conv-C7',\n`;
output += `              quality: 'okay',\n`;
output += `              feedback: 'Technically cautious, but dismissing the customer\\'s idea without explanation damages the relationship. Explain why.',\n`;
output += `            },\n`;
output += `            {\n`;
output += `              text: 'Sure, let\\'s try the coating. If the customer wants cheaper, we should do cheaper.',\n`;
output += `              nextNodeId: 'u10-L-conv-C7',\n`;
output += `              quality: 'poor',\n`;
output += `              feedback: 'Agreeing to a risky approach just to save cost is poor engineering judgment. If the coating fails, you have the same cracking problem again.',\n`;
output += `            },\n`;
output += `          ],\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C7',\n`;
output += `          speaker: 'Hiring Manager',\n`;
output += `          message: 'I like your structured approach. You preserved evidence, identified the mechanism correctly, and handled the customer question professionally. That\\'s what we look for.',\n`;
output += `          nextNodeId: 'u10-L-conv-C8',\n`;
output += `        },\n`;
output += `        {\n`;
output += `          id: 'u10-L-conv-C8',\n`;
output += `          speaker: 'Narrator',\n`;
output += `          message: 'You walked through a realistic failure analysis interview: evidence preservation, root cause diagnosis, material recommendation, and customer communication. These are the skills that get you hired.',\n`;
output += `        },\n`;
output += `      ],\n`;
output += `    },\n`;

// Add speed-round lesson
output += `    {\n`;
output += `      id: 'u10-L-speed',\n`;
output += `      title: 'Interview Rapid Fire',\n`;
output += `      description: 'Race the clock on estimation, failure analysis, design, FEA, and standards questions.',\n`;
output += `      icon: '\\u{26A1}',\n`;
output += `      type: 'speed-round',\n`;
output += `      xpReward: 20,\n`;
output += `      questions: [],\n`;
output += `      speedTimeLimit: 60,\n`;
output += `      speedQuestions: [\n`;

const speedQs = [
  { q: 'Steel density is approximately:', opts: ['7,850 kg/m3', '2,700 kg/m3', '1,000 kg/m3', '11,300 kg/m3'], ci: 0 },
  { q: 'Beach marks on a fracture surface indicate:', opts: ['Fatigue', 'Overload', 'Creep', 'Corrosion'], ci: 0 },
  { q: 'DFA primarily aims to:', opts: ['Reduce part count', 'Increase strength', 'Improve surface finish', 'Lower temperature'], ci: 0 },
  { q: '1 horsepower is approximately:', opts: ['750 W', '1,000 W', '500 W', '100 W'], ci: 0 },
  { q: 'Hoop stress in a thin-walled cylinder:', opts: ['PD/2t', 'PD/4t', 'Pt/2D', 'PD/t'], ci: 0 },
  { q: 'The 5 Whys technique finds:', opts: ['Root cause', 'Material properties', 'Optimal design', 'Failure load'], ci: 0 },
  { q: 'Euler buckling load depends on:', opts: ['EI/L^2', 'Yield strength', 'Density', 'Hardness'], ci: 0 },
  { q: 'Stress singularity in FEA occurs at:', opts: ['Sharp corners', 'Round holes', 'Flat surfaces', 'Uniform sections'], ci: 0 },
  { q: 'Pump flow rate scales with speed as:', opts: ['N^1', 'N^2', 'N^3', 'N^0.5'], ci: 0 },
  { q: 'SCC requires all EXCEPT:', opts: ['High RPM', 'Tensile stress', 'Corrosive environment', 'Susceptible material'], ci: 0 },
  { q: 'Pugh matrix compares designs against a:', opts: ['Datum', 'Cost target', 'Weight limit', 'Stress limit'], ci: 0 },
  { q: 'ISO 9001 covers:', opts: ['Quality management', 'Pressure vessels', 'Electrical safety', 'Food safety'], ci: 0 },
  { q: 'A36 steel yield strength is about:', opts: ['250 MPa', '500 MPa', '100 MPa', '1,000 MPa'], ci: 0 },
  { q: 'FMEA rates risk using:', opts: ['Severity x Occurrence x Detection', 'Cost x Weight', 'Stress x Strain', 'Temperature x Time'], ci: 0 },
  { q: 'Reynolds number compares:', opts: ['Inertial to viscous forces', 'Pressure to gravity', 'Thermal to kinetic', 'Elastic to plastic'], ci: 0 },
];

for (let i = 0; i < speedQs.length; i++) {
  const sq = speedQs[i];
  const optsStr = sq.opts.map(o => `'${o}'`).join(', ');
  output += `        { id: 'u10-L-speed-SQ${i + 1}', question: '${sq.q}', options: [${optsStr}], correctIndex: ${sq.ci} },\n`;
}

output += `      ],\n`;
output += `    },\n`;

// Close the unit
output += `  ]\n};\n`;

// Write the file
fs.writeFileSync(filePath, output, 'utf-8');
console.log(`\nDone! Wrote ${output.length} bytes to ${filePath}`);
console.log(`Total lessons: ${lessonIds.length * 3 + 2} (${lessonIds.length * 3} sub-lessons + 1 conversation + 1 speed-round)`);
