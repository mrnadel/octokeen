// Script to rebuild unit-2-dynamics.ts with sub-lessons, new question types, conversation, and speed-round
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const srcPath = join(import.meta.dirname, '..', 'src', 'data', 'course', 'units', 'unit-2-dynamics.ts.bak');
const destPath = join(import.meta.dirname, '..', 'src', 'data', 'course', 'units', 'unit-2-dynamics.ts');

// Read the original file
const original = readFileSync(srcPath, 'utf-8');

// We need to parse out each lesson's questions. Let's use a regex-based approach.
// Extract everything between lessons: [ and the final ] to get lesson objects.

// Simple approach: use eval-like parsing by stripping the TypeScript parts
// Actually, let's just build the new file from scratch, referencing the original for diagrams.

// Extract all diagrams keyed by question ID
const diagramMap = {};
const diagramRegex = /id:\s*'(u2-[^']+)'[\s\S]*?diagram:\s*'(<svg[\s\S]*?<\/svg>)'/g;
let match;
while ((match = diagramRegex.exec(original)) !== null) {
  diagramMap[match[1]] = match[2];
}

console.log(`Found ${Object.keys(diagramMap).length} diagrams`);

// Helper to get a diagram by ID, or return undefined
function getDiagram(id) {
  return diagramMap[id];
}

// Helper to format a diagram string for inclusion
function diagramStr(id) {
  const d = getDiagram(id);
  if (!d) return '';
  // Escape single quotes within the SVG
  return `          diagram: '${d}',\n`;
}

// Helper to build a question object as a string
function mcQ(id, question, options, correctIndex, explanation, hint, diagramId) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'multiple-choice',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          options: [\n`;
  for (const opt of options) {
    s += `            '${esc(opt)}',\n`;
  }
  s += `          ],\n`;
  s += `          correctIndex: ${correctIndex},\n`;
  if (diagramId && getDiagram(diagramId)) {
    s += diagramStr(diagramId);
  }
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function tfQ(id, question, correctAnswer, explanation, hint, diagramId) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'true-false',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          correctAnswer: ${correctAnswer},\n`;
  if (diagramId && getDiagram(diagramId)) {
    s += diagramStr(diagramId);
  }
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function fbQ(id, question, blanks, wordBank, explanation, hint, diagramId) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'fill-blank',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          blanks: [${blanks.map(b => `'${esc(b)}'`).join(', ')}],\n`;
  s += `          wordBank: [${wordBank.map(w => `'${esc(w)}'`).join(', ')}],\n`;
  if (diagramId && getDiagram(diagramId)) {
    s += diagramStr(diagramId);
  }
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function teachQ(id, title, explanation, hint) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'teaching',\n`;
  s += `          question: '${esc(title)}',\n`;
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function matchQ(id, question, options, matchTargets, correctMatches, explanation, hint) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'match-pairs',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          options: [${options.map(o => `'${esc(o)}'`).join(', ')}],\n`;
  s += `          matchTargets: [${matchTargets.map(t => `'${esc(t)}'`).join(', ')}],\n`;
  s += `          correctMatches: [${correctMatches.join(', ')}],\n`;
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function sortQ(id, question, options, buckets, correctBuckets, explanation, hint) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'sort-buckets',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          options: [${options.map(o => `'${esc(o)}'`).join(', ')}],\n`;
  s += `          buckets: [${buckets.map(b => `'${esc(b)}'`).join(', ')}],\n`;
  s += `          correctBuckets: [${correctBuckets.join(', ')}],\n`;
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function orderQ(id, question, steps, correctOrder, explanation, hint) {
  let s = `        {\n`;
  s += `          id: '${id}',\n`;
  s += `          type: 'order-steps',\n`;
  s += `          question: '${esc(question)}',\n`;
  s += `          steps: [${steps.map(s => `'${esc(s)}'`).join(', ')}],\n`;
  s += `          correctOrder: [${correctOrder.join(', ')}],\n`;
  s += `          explanation: '${esc(explanation)}',\n`;
  if (hint) s += `          hint: '${esc(hint)}',\n`;
  s += `        }`;
  return s;
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Now extract original questions by parsing them out of the file
// We'll use a more robust extraction: find each question block by its ID

function extractQuestionBlock(id) {
  // Find the block starting with the id and ending before the next question/teaching block or end of questions array
  const idEscaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\{[\\s\\S]*?id:\\s*'${idEscaped}'[\\s\\S]*?(?:hint:[^}]*\\}|explanation:[^}]*\\}))`, 'm');
  const m = original.match(regex);
  if (m) return m[1].trim();
  return null;
}

// Extract each question object by finding balanced braces
function extractAllQuestions() {
  const questions = {};
  const idPattern = /id:\s*'(u2-L\d+-[TQ]\d+[a-z]?)'/g;
  let m;
  while ((m = idPattern.exec(original)) !== null) {
    const id = m[1];
    // Find the opening brace before this id
    const start = original.lastIndexOf('{', m.index);
    // Find the balanced closing brace
    let depth = 0;
    let end = start;
    for (let i = start; i < original.length; i++) {
      const ch = original[i];
      // Skip string contents
      if (ch === "'" && original[i-1] !== '\\') {
        i++;
        while (i < original.length && !(original[i] === "'" && original[i-1] !== '\\')) i++;
        continue;
      }
      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }

    let block = original.substring(start, end + 1).trim();
    questions[id] = block;
  }

  return questions;
}

const allQ = extractAllQuestions();
console.log(`Extracted ${Object.keys(allQ).length} question blocks`);

// Indent a question block to match lesson structure
function indent(block, spaces = 8) {
  const prefix = ' '.repeat(spaces);
  return block.split('\n').map((line, i) => {
    if (i === 0) return prefix + line.trimStart();
    return prefix + line.trimStart();
  }).join('\n');
}

// Re-indent a block to have consistent 8-space indentation
function reindent(block) {
  const lines = block.split('\n');
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '{') result.push('        {');
    else if (trimmed === '}' || trimmed === '},') result.push('        }');
    else result.push('          ' + trimmed);
  }
  return result.join('\n');
}

// Get an original question block, re-indented
function origQ(id) {
  const block = allQ[id];
  if (!block) {
    console.warn(`WARNING: Question ${id} not found!`);
    return `        // MISSING: ${id}`;
  }
  return reindent(block);
}

// Build the lesson structure
function lesson(id, title, description, icon, xpReward, questions, extra = '') {
  let s = `    {\n`;
  s += `      id: '${id}',\n`;
  s += `      title: '${esc(title)}',\n`;
  s += `      description: '${esc(description)}',\n`;
  s += `      icon: '${icon}',\n`;
  s += `      xpReward: ${xpReward},\n`;
  s += `      levels: 4,\n`;
  if (extra) s += extra;
  s += `      questions: [\n`;
  s += questions.join(',\n');
  s += `\n      ],\n`;
  s += `    }`;
  return s;
}

// ================================================================
// BUILD THE LESSONS
// ================================================================

const lessons = [];

// ===== LESSON 1: u2-L1 (Particle Kinematics: Position, Velocity, Acceleration) =====
// Original Q1-Q10 + T1, add 1 new teaching card, add varied types
// Difficulty: after each teaching card, next Q is trivially easy

lessons.push(lesson('u2-L1', 'Position, Velocity & Acceleration', 'Differentiation and integration of motion: position, velocity, and acceleration relationships.', '📝', 20, [
  // T1 - original
  origQ('u2-L1-T1'),
  // Easy Q right after teaching
  origQ('u2-L1-Q1'),
  // New teaching card
  teachQ('u2-L1-T1b', 'Differentiate Down, Integrate Up', 'Position to velocity: take the derivative. Velocity to acceleration: take the derivative again. To go backward, integrate and add the initial condition.', 'Each integration step introduces a constant of integration from initial conditions.'),
  // Easy Q after teaching
  tfQ('u2-L1-Q1b', 'Velocity is the first derivative of position with respect to time.', true, 'v = dx/dt. Differentiating position once gives velocity.', 'What operation converts position to velocity?'),
  // Original Q2 (medium)
  origQ('u2-L1-Q2'),
  // Convert to match-pairs for variety
  matchQ('u2-L1-Q2b', 'Match each kinematic quantity to its definition:',
    ['Position', 'Velocity', 'Acceleration', 'Jerk'],
    ['Where the object is', 'Rate of position change', 'Rate of velocity change', 'Rate of acceleration change'],
    [0, 1, 2, 3],
    'Each quantity is the time derivative of the one before it. Jerk (da/dt) matters in ride comfort and cam design.',
    'Each is the derivative of the previous quantity.'),
  // Original Q3 (medium)
  origQ('u2-L1-Q3'),
  // Original Q7 (medium-hard, calculation)
  origQ('u2-L1-Q7'),
  // Original Q8 (medium-hard, integration)
  origQ('u2-L1-Q8'),
  // Original Q9 (medium, conceptual)
  origQ('u2-L1-Q9'),
  // Original Q10 (hard, projectile calculation)
  origQ('u2-L1-Q10'),
]));

// ===== LESSON 1b: u2-L1b (Curvilinear & Relative Motion) =====
lessons.push(lesson('u2-L1b', 'Curvilinear & Relative Motion', 'Normal-tangential components, polar coordinates, and velocity of one object relative to another.', '📝', 20, [
  // Teaching: curvilinear
  origQ('u2-L1-T2'),
  // Easy after teaching
  origQ('u2-L1-Q4'),
  // New teaching card
  teachQ('u2-L1-T2b', 'Polar Coordinates for Curved Paths', 'Polar coordinates (r, theta) are ideal when an object moves along a curved path around a fixed point. Radial acceleration has a centripetal term, and transverse acceleration has a Coriolis term.', 'Use polar coordinates for problems involving orbits, cams, or rotating arms.'),
  // Easy after teaching
  origQ('u2-L1-Q6'),
  // sort-buckets for variety
  sortQ('u2-L1-Q4b', 'Sort each acceleration component to the correct type:',
    ['v squared / r', 'dv/dt along path', 'Changes direction', 'Changes speed', 'Points toward center', 'Tangent to path'],
    ['Normal (centripetal)', 'Tangential'],
    [0, 1, 0, 1, 0, 1],
    'Normal acceleration (v squared/r) changes direction and points toward the center. Tangential acceleration (dv/dt) changes speed and is tangent to the path.',
    'Which component changes speed vs. direction?'),
  // Original Q5 (boat crossing, medium)
  origQ('u2-L1-Q5'),
  // Original Q12 (total acceleration, medium-hard)
  origQ('u2-L1-Q12'),
  // Original Q13 (polar coords, hard)
  origQ('u2-L1-Q13'),
  // order-steps for variety
  orderQ('u2-L1-Q12b', 'Put these steps in order to find total acceleration on a curved path:',
    ['Find the tangential acceleration at = dv/dt', 'Find the normal acceleration an = v squared/r', 'Square both components', 'Add the squares together', 'Take the square root for total acceleration'],
    [0, 1, 2, 3, 4],
    'Total acceleration magnitude = sqrt(at squared + an squared). The two components are always perpendicular.',
    'Normal and tangential components are perpendicular.'),
  // Original Q14 (air resistance angle, hard)
  origQ('u2-L1-Q14'),
]));

// ===== LESSON 1c: u2-L1c (Projectile Motion & Advanced Kinematics) =====
lessons.push(lesson('u2-L1c', 'Projectiles & Advanced Kinematics', 'Projectile trajectories, integration techniques, and velocity as a function of position.', '📝', 20, [
  // Teaching: relative motion
  origQ('u2-L1-T3'),
  // Easy after teaching
  origQ('u2-L1-Q16'),
  // New teaching card
  teachQ('u2-L1-T3b', 'When Velocity Depends on Position', 'Sometimes v is given as v(s) instead of v(t). Use a = v(dv/ds) to find acceleration. This comes from the chain rule: a = dv/dt = (dv/ds)(ds/dt) = v(dv/ds).', 'This form is useful for spring problems and variable-force scenarios.'),
  // Easy after teaching
  origQ('u2-L1-Q23'),
  // match-pairs for variety
  matchQ('u2-L1-Q16b', 'Match each projectile property to its formula (no air resistance):',
    ['Maximum height', 'Range', 'Time of flight', 'Horizontal velocity'],
    ['v0 squared sin squared(theta) / 2g', 'v0 squared sin(2 theta) / g', '2 v0 sin(theta) / g', 'v0 cos(theta)'],
    [0, 1, 2, 3],
    'These formulas assume level ground and no air resistance. Range is maximized at theta = 45 degrees.',
    'Each formula involves the initial velocity components and g.'),
  // Original Q11 (relative motion, medium)
  origQ('u2-L1-Q11'),
  // Original Q15 (polar accel calc, hard)
  origQ('u2-L1-Q15'),
  // Original Q17 (max velocity, medium)
  origQ('u2-L1-Q17'),
  // Original Q18 (wheel rpm, medium)
  origQ('u2-L1-Q18'),
  // Original Q19 (braking distance, medium)
  origQ('u2-L1-Q19'),
  // Original Q20 (gravity varies, medium)
  origQ('u2-L1-Q20'),
  // Remaining L1 questions
  origQ('u2-L1-Q21'),
  origQ('u2-L1-Q22'),
  origQ('u2-L1-Q24'),
  origQ('u2-L1-Q25'),
  origQ('u2-L1-Q26'),
  origQ('u2-L1-Q27'),
  origQ('u2-L1-Q28'),
  origQ('u2-L1-Q29'),
  origQ('u2-L1-Q30'),
]));

// ===== LESSON 2: u2-L2 (Newton's Laws Fundamentals) =====
lessons.push(lesson('u2-L2', "Newton's Laws Fundamentals", 'The three laws of motion, free body diagrams, and friction on flat surfaces.', '📝', 20, [
  origQ('u2-L2-T1'),
  // Easy after teaching
  origQ('u2-L2-Q9'),
  // New teaching card
  teachQ('u2-L2-T1b', 'Drawing Free Body Diagrams', 'To solve any force problem: (1) isolate the object, (2) draw all external forces on it, (3) set up F=ma equations in each direction. Never include internal forces or forces on other objects.', 'Draw the FBD before writing any equations.'),
  // Easy after teaching
  tfQ('u2-L2-Q9b', 'In a free body diagram, you should include forces that the object exerts on other bodies.', false, 'An FBD shows only forces acting ON the isolated object, never forces it exerts on others.', 'Whose forces appear on the diagram?'),
  // Original Q1 (angled pull, medium)
  origQ('u2-L2-Q1'),
  // sort-buckets
  sortQ('u2-L2-Q1b', 'Sort each force into the correct category:',
    ['Weight (mg)', 'Normal force', 'Spring force', 'Kinetic friction', 'Static friction', 'Air drag'],
    ['Conservative', 'Non-conservative'],
    [0, 1, 0, 1, 1, 1],
    'Conservative forces (gravity, springs) have path-independent work. Non-conservative forces (friction, drag) depend on the path taken.',
    'Does the force depend on the path taken?'),
  // Original Q2 (Atwood, medium-hard)
  origQ('u2-L2-Q2'),
  // Original Q3 (car hilltop, medium)
  origQ('u2-L2-Q3'),
  // Original Q8 (two blocks tension, medium-hard)
  origQ('u2-L2-Q8'),
  // Original Q7 (incline slide, hard)
  origQ('u2-L2-Q7'),
  // Original Q5 (elevator, medium)
  origQ('u2-L2-Q5'),
]));

// ===== LESSON 2b: u2-L2b (Circular Motion & Banking) =====
lessons.push(lesson('u2-L2b', 'Circular Motion & Banked Curves', 'Centripetal force, banked curves, and vertical circles.', '📝', 20, [
  origQ('u2-L2-T3'),
  // Easy after teaching
  origQ('u2-L2-Q16'),
  // New teaching card
  teachQ('u2-L2-T3b', 'Banked Curves Reduce Friction Need', 'On a banked curve, the normal force has a horizontal component pointing toward the center. At the ideal banking speed, this component alone provides all the centripetal force, so friction is not needed at all.', 'The ideal speed is v = sqrt(r g tan theta).'),
  // Easy after teaching
  origQ('u2-L2-Q6'),
  // match-pairs
  matchQ('u2-L2-Q6b', 'Match each circular motion scenario to its centripetal force source:',
    ['Car on flat curve', 'Car on banked curve (ideal speed)', 'Satellite in orbit', 'Ball on a string'],
    ['Friction', 'Normal force horizontal component', 'Gravity', 'String tension'],
    [0, 1, 2, 3],
    'Different situations use different forces to provide the inward centripetal acceleration. The centripetal force is always directed toward the center.',
    'What force points toward the center in each case?'),
  // Original Q4 (icy curve, medium)
  origQ('u2-L2-Q4'),
  // Original Q10 (banked curve speed, medium-hard)
  origQ('u2-L2-Q10'),
  // Original Q12 (vertical circle, hard)
  origQ('u2-L2-Q12'),
  // Original Q14 (conical pendulum, hard)
  origQ('u2-L2-Q14'),
  // Original Q22 (washing machine, medium)
  origQ('u2-L2-Q22'),
  // Original Q27 (test track radius, hard)
  origQ('u2-L2-Q27'),
]));

// ===== LESSON 2c: u2-L2c (Connected Systems & Applications) =====
lessons.push(lesson('u2-L2c', 'Connected Systems & Real Problems', 'Pulleys, multiple bodies, conveyor belts, and tug-of-war physics.', '📝', 20, [
  origQ('u2-L2-T2'),
  // Easy after teaching
  origQ('u2-L2-Q26'),
  // New teaching card
  teachQ('u2-L2-T2b', 'System Method vs. Individual FBDs', 'For connected bodies, you can either: (1) treat the whole system as one to find acceleration (system approach), or (2) draw separate FBDs for each body to find internal forces like tension. Use method 1 first, then method 2.', 'System approach: a = F_net / m_total. Then isolate one body for tension.'),
  // Easy after teaching
  origQ('u2-L2-Q13'),
  // order-steps
  orderQ('u2-L2-Q13b', 'Put these steps in order to solve a two-body pulley problem:',
    ['Draw free body diagrams for each mass', 'Write F=ma for each mass separately', 'Note that both masses share the same acceleration magnitude', 'Solve the two equations simultaneously', 'Find the tension and acceleration'],
    [0, 1, 2, 3, 4],
    'The key insight is that the string constrains both masses to have the same acceleration magnitude (one goes up, one goes down).',
    'What constraint does the string provide?'),
  // Original Q11 (pulley work, medium)
  origQ('u2-L2-Q11'),
  // Original Q15 (box on truck, medium)
  origQ('u2-L2-Q15'),
  // Original Q18 (three blocks, medium-hard)
  origQ('u2-L2-Q18'),
  // Original Q20 (tug of war, medium)
  origQ('u2-L2-Q20'),
  // Original Q28 (Atwood tension calc, hard)
  origQ('u2-L2-Q28'),
  // Original Q30 (icy banked curve, hard)
  origQ('u2-L2-Q30'),
  // Remaining L2 questions
  origQ('u2-L2-Q17'),
  origQ('u2-L2-Q19'),
  origQ('u2-L2-Q21'),
  origQ('u2-L2-Q23'),
  origQ('u2-L2-Q24'),
  origQ('u2-L2-Q25'),
  origQ('u2-L2-Q29'),
]));

// ===== LESSON 3: u2-L3 (Work & Kinetic Energy) =====
lessons.push(lesson('u2-L3', 'Work & Kinetic Energy', 'Work by constant and variable forces, the work-energy theorem.', '⚡', 20, [
  origQ('u2-L3-T1'),
  // Easy after teaching
  origQ('u2-L3-Q3'),
  // New teaching card
  teachQ('u2-L3-T1b', 'Work by Variable Forces', 'When force varies with position, work equals the integral of F dx. Graphically, it is the area under the F-x curve. For a spring (F = kx), work = (1/2)kx squared.', 'The area under the force-displacement curve gives the work done.'),
  // Easy after teaching
  origQ('u2-L3-Q9'),
  // sort-buckets
  sortQ('u2-L3-Q3b', 'Sort each scenario by whether the work done is positive, negative, or zero:',
    ['Pushing a box forward', 'Friction on a sliding box', 'Normal force on a sliding box', 'Gravity on a falling ball', 'Gravity on a ball moving horizontally', 'Catching a baseball'],
    ['Positive work', 'Negative work', 'Zero work'],
    [0, 1, 2, 0, 2, 1],
    'Positive work: force and displacement same direction. Negative work: opposite directions. Zero work: force perpendicular to displacement.',
    'Compare the force direction to the displacement direction.'),
  // Original Q1 (when to use, medium)
  origQ('u2-L3-Q1'),
  // Original Q6 (friction work, fill-blank)
  origQ('u2-L3-Q6'),
  // Original Q7 (car braking energy, medium)
  origQ('u2-L3-Q7'),
  // Original Q10 (net work, medium-hard)
  origQ('u2-L3-Q10'),
  // Original Q15 (variable force integral, hard)
  origQ('u2-L3-Q15'),
]));

// ===== LESSON 3b: u2-L3b (Conservation of Energy) =====
lessons.push(lesson('u2-L3b', 'Conservation of Energy', 'Converting between kinetic, potential, and spring energy in frictionless and frictional systems.', '⚡', 20, [
  origQ('u2-L3-T2'),
  // Easy after teaching
  origQ('u2-L3-Q5'),
  // New teaching card
  teachQ('u2-L3-T2b', 'Spring Potential Energy', 'A compressed or stretched spring stores energy: PE = (1/2)kx squared. Energy scales with x squared, so doubling compression quadruples the stored energy. This is why spring-loaded mechanisms are sensitive to small displacement changes.', 'Double the compression means 4x the energy.'),
  // Easy after teaching
  origQ('u2-L3-Q16'),
  // match-pairs
  matchQ('u2-L3-Q5b', 'Match each energy type to its formula:',
    ['Kinetic energy', 'Gravitational PE', 'Spring PE', 'Rotational KE'],
    ['(1/2)mv squared', 'mgh', '(1/2)kx squared', '(1/2)I omega squared'],
    [0, 1, 2, 3],
    'These four forms of mechanical energy are the building blocks of energy conservation problems.',
    'Each energy type has a characteristic formula.'),
  // Original Q2 (spring double energy, medium)
  origQ('u2-L3-Q2'),
  // Original Q8 (spring launches ball, medium)
  origQ('u2-L3-Q8'),
  // Original Q12 (ramp speed, medium)
  origQ('u2-L3-Q12'),
  // Original Q14 (swing speed, medium)
  origQ('u2-L3-Q14'),
  // Original Q24 (ball on spring, hard)
  origQ('u2-L3-Q24'),
  // Original Q28 (incline with friction, hard)
  origQ('u2-L3-Q28'),
]));

// ===== LESSON 3c: u2-L3c (Power & Efficiency) =====
lessons.push(lesson('u2-L3c', 'Power & Efficiency', 'Power as the rate of energy transfer, motor sizing, and machine efficiency.', '⚡', 20, [
  origQ('u2-L3-T3'),
  // Easy after teaching
  origQ('u2-L3-Q13'),
  // New teaching card
  teachQ('u2-L3-T3b', 'Real Motors Need Extra Power', "A motor's rated power must exceed the ideal power calculation. Real systems lose energy to friction, heat, and electrical resistance. A motor running at 85% efficiency needs about 18% more input power than the ideal output.", 'Always apply an efficiency factor and safety margin when sizing motors.'),
  // Easy after teaching
  origQ('u2-L3-Q20'),
  // order-steps
  orderQ('u2-L3-Q13b', 'Put these steps in order to size a motor for a lifting application:',
    ['Calculate the steady-state lifting power: P = mgv', 'Add extra power for startup acceleration loads', 'Divide by the motor efficiency (typically 85-95%)', 'Apply a safety factor (typically 1.15 to 1.25)', 'Select the next standard motor size above your result'],
    [0, 1, 2, 3, 4],
    'Real motor sizing accounts for efficiency losses, transient loads, and safety margins beyond the ideal P = Fv calculation.',
    'The ideal power is just the starting point.'),
  // Original Q4 (motor sizing, medium)
  origQ('u2-L3-Q4'),
  // Original Q11 (pump power, medium)
  origQ('u2-L3-Q11'),
  // Original Q19 (engine torque, medium-hard)
  origQ('u2-L3-Q19'),
  // Original Q25 (car resistance, medium-hard)
  origQ('u2-L3-Q25'),
  // Original Q29 (efficiency, medium)
  origQ('u2-L3-Q29'),
  // Original Q30 (doubling speed power, hard)
  origQ('u2-L3-Q30'),
  // Remaining L3 questions
  origQ('u2-L3-Q17'),
  origQ('u2-L3-Q18'),
  origQ('u2-L3-Q21'),
  origQ('u2-L3-Q22'),
  origQ('u2-L3-Q23'),
  origQ('u2-L3-Q26'),
  origQ('u2-L3-Q27'),
]));

// ===== LESSON 4: u2-L4 (Momentum & Impulse Basics) =====
// Read remaining L4 questions
lessons.push(lesson('u2-L4', 'Momentum & Impulse Basics', 'Linear momentum, impulse-momentum theorem, and conservation of momentum.', '📝', 20, [
  origQ('u2-L4-T1'),
  // Easy after teaching
  origQ('u2-L4-Q3'),
  // New teaching card
  teachQ('u2-L4-T1b', 'Impulse Equals Momentum Change', 'Impulse (J = F times delta t) equals the change in momentum (delta p = m delta v). A larger force over a shorter time gives the same impulse as a smaller force over a longer time. This is why crumple zones save lives.', 'Crumple zones increase collision time to reduce peak force.'),
  // Easy after teaching (convert a simple one)
  origQ('u2-L4-Q9'),
  // match-pairs
  matchQ('u2-L4-Q3b', 'Match each collision type to its key property:',
    ['Perfectly elastic', 'Perfectly inelastic', 'Explosion', 'General collision'],
    ['KE and momentum both conserved', 'Objects stick together, max KE loss', 'Objects start together, separate', 'Only momentum conserved'],
    [0, 1, 2, 3],
    'Momentum is always conserved in all collisions (no external forces). Kinetic energy is only conserved in perfectly elastic collisions.',
    'Which quantity is always conserved in collisions?'),
  // Original Q1 (medium)
  origQ('u2-L4-Q1'),
  // Original Q2 (medium)
  origQ('u2-L4-Q2'),
  // Original Q4 (medium)
  origQ('u2-L4-Q4'),
  // Original Q5 (medium-hard)
  origQ('u2-L4-Q5'),
  // Original Q7 (medium-hard)
  origQ('u2-L4-Q7'),
  // Original Q8 (hard)
  origQ('u2-L4-Q8'),
]));

// ===== LESSON 4b =====
lessons.push(lesson('u2-L4b', 'Collisions & Restitution', 'Elastic and inelastic collisions, coefficient of restitution, and 2D impacts.', '📝', 20, [
  origQ('u2-L4-T2'),
  // Easy after teaching
  origQ('u2-L4-Q16'),
  // New teaching card
  teachQ('u2-L4-T2b', 'Coefficient of Restitution', 'The coefficient of restitution (e) measures bounciness: e = (separation speed)/(approach speed). e = 1 is perfectly elastic, e = 0 is perfectly inelastic. Real collisions fall between these extremes.', 'A tennis ball on concrete has e around 0.75, while putty has e near 0.'),
  // Easy after teaching
  origQ('u2-L4-Q13'),
  // sort-buckets
  sortQ('u2-L4-Q13b', 'Sort each real-world collision by its approximate restitution category:',
    ['Steel ball on steel plate', 'Car crash (crumple zone)', 'Tennis ball on racket', 'Clay dropped on floor', 'Billiard balls', 'Egg hitting ground'],
    ['High e (> 0.7)', 'Low e (< 0.3)'],
    [0, 1, 0, 1, 0, 1],
    'Hard, elastic materials (steel, billiard balls) have high e. Soft, deformable materials (clay, crumple zones, eggs) have low e.',
    'How much does the object deform permanently during impact?'),
  // Original Q10 (medium)
  origQ('u2-L4-Q10'),
  // Original Q11 (medium-hard)
  origQ('u2-L4-Q11'),
  // Original Q12 (medium-hard)
  origQ('u2-L4-Q12'),
  // Original Q14 (hard)
  origQ('u2-L4-Q14'),
  // Original Q15 (hard)
  origQ('u2-L4-Q15'),
  // Original Q6 (fill-blank)
  origQ('u2-L4-Q6'),
]));

// ===== LESSON 4c =====
lessons.push(lesson('u2-L4c', 'Momentum in Systems & Machines', 'Rocket propulsion, impact forces, ballistic pendulums, and angular impulse.', '📝', 20, [
  origQ('u2-L4-T3'),
  // Easy after teaching
  origQ('u2-L4-Q20'),
  // New teaching card
  teachQ('u2-L4-T3b', 'Rocket Propulsion Uses Momentum', 'A rocket expels mass backward at high speed. By conservation of momentum, the rocket accelerates forward. The thrust equals the mass flow rate times the exhaust velocity: F = dm/dt times v_exhaust.', 'Thrust depends on how fast mass is expelled and at what speed.'),
  // Easy after teaching
  origQ('u2-L4-Q23'),
  // order-steps
  orderQ('u2-L4-Q20b', 'Put these steps in order to solve a ballistic pendulum problem:',
    ['Apply conservation of momentum for the bullet-block collision', 'Find the velocity of the combined mass right after impact', 'Apply conservation of energy for the upward swing', 'Relate the kinetic energy to the maximum height', 'Solve for the unknown (usually bullet speed)'],
    [0, 1, 2, 3, 4],
    'Ballistic pendulums use momentum conservation during impact (not energy, since the collision is inelastic) and energy conservation during the swing.',
    'Which conservation law applies during which phase?'),
  // Original remaining Q17-Q30
  origQ('u2-L4-Q17'),
  origQ('u2-L4-Q18'),
  origQ('u2-L4-Q19'),
  origQ('u2-L4-Q21'),
  origQ('u2-L4-Q22'),
  origQ('u2-L4-Q24'),
  // Remaining L4 questions
  origQ('u2-L4-Q25'),
  origQ('u2-L4-Q26'),
  origQ('u2-L4-Q27'),
  origQ('u2-L4-Q28'),
  origQ('u2-L4-Q29'),
  origQ('u2-L4-Q30'),
]));

// ===== LESSON 5: u2-L5 (Torque & Moment of Inertia) =====
lessons.push(lesson('u2-L5', 'Torque & Moment of Inertia', 'Rotational analog of F=ma, mass distribution effects, and the parallel axis theorem.', '📝', 20, [
  origQ('u2-L5-T1'),
  // Easy after teaching
  origQ('u2-L5-Q3'),
  // New teaching card
  teachQ('u2-L5-T1b', 'Shape Determines Moment of Inertia', 'A solid cylinder has I = (1/2)mR squared, while a hollow cylinder has I = mR squared. The hollow one resists angular acceleration more because its mass is farther from the axis. This is why flywheels are hollow.', 'Mass farther from the axis contributes more to I.'),
  // Easy after teaching
  origQ('u2-L5-Q9'),
  // match-pairs
  matchQ('u2-L5-Q3b', 'Match each shape to its moment of inertia about its central axis:',
    ['Solid cylinder', 'Hollow cylinder', 'Solid sphere', 'Thin rod (center)'],
    ['(1/2)mR squared', 'mR squared', '(2/5)mR squared', '(1/12)mL squared'],
    [0, 1, 2, 3],
    'Solid objects have smaller I than hollow ones of the same mass and radius because their mass is distributed closer to the axis.',
    'Mass farther from the axis increases I.'),
  // Original Q1 (medium)
  origQ('u2-L5-Q1'),
  // Original Q2 (medium)
  origQ('u2-L5-Q2'),
  // Original Q4 (medium)
  origQ('u2-L5-Q4'),
  // Original Q5 (medium-hard)
  origQ('u2-L5-Q5'),
  // Original Q7 (hard)
  origQ('u2-L5-Q7'),
  // Original Q6 (fill-blank)
  origQ('u2-L5-Q6'),
]));

// ===== LESSON 5b =====
lessons.push(lesson('u2-L5b', 'Angular Momentum & Gyroscopes', 'Conservation of angular momentum, gyroscopic precession, and spinning stability.', '📝', 20, [
  origQ('u2-L5-T2'),
  // Easy after teaching
  origQ('u2-L5-Q16'),
  // New teaching card
  teachQ('u2-L5-T2b', 'Angular Momentum is Conserved', 'When no external torque acts, angular momentum L = I omega stays constant. If I decreases (skater pulls arms in), omega increases. This explains why figure skaters spin faster with arms tucked.', 'No external torque means L = I omega = constant.'),
  // Easy after teaching
  origQ('u2-L5-Q13'),
  // sort-buckets
  sortQ('u2-L5-Q13b', 'Sort each quantity to its linear or rotational analog:',
    ['Force', 'Torque', 'Mass', 'Moment of inertia', 'Velocity', 'Angular velocity'],
    ['Linear', 'Rotational'],
    [0, 1, 0, 1, 0, 1],
    'Every linear quantity has a rotational analog: F to tau, m to I, v to omega, p to L, a to alpha.',
    'Which quantities describe straight-line vs. spinning motion?'),
  // Original Q8 (medium)
  origQ('u2-L5-Q8'),
  // Original Q10 (medium)
  origQ('u2-L5-Q10'),
  // Original Q11 (medium-hard)
  origQ('u2-L5-Q11'),
  // Original Q12 (medium-hard)
  origQ('u2-L5-Q12'),
  // Original Q14 (hard)
  origQ('u2-L5-Q14'),
  // Original Q15 (hard)
  origQ('u2-L5-Q15'),
]));

// ===== LESSON 5c =====
lessons.push(lesson('u2-L5c', 'Rolling & Rotational Applications', 'Rolling without slipping, energy in rotation, and flywheels.', '📝', 20, [
  origQ('u2-L5-T3'),
  // Easy after teaching
  origQ('u2-L5-Q20'),
  // New teaching card
  teachQ('u2-L5-T3b', 'Rolling = Translation + Rotation', 'A rolling object has both translational KE ((1/2)mv squared) and rotational KE ((1/2)I omega squared). For rolling without slipping, v = R omega. A solid sphere rolls faster than a hollow one down the same ramp because it has a smaller fraction of energy in rotation.', 'Use v = R omega for rolling without slipping.'),
  // Easy after teaching
  origQ('u2-L5-Q23'),
  // order-steps
  orderQ('u2-L5-Q20b', 'Put these steps in order to solve a rolling-down-a-ramp problem:',
    ['Set gravitational PE equal to total KE', 'Write total KE as translational plus rotational', 'Substitute I for the specific shape', 'Apply the rolling constraint v = R omega', 'Solve for velocity at the bottom'],
    [0, 1, 2, 3, 4],
    'The rolling constraint v = R omega lets you express everything in terms of v. Shapes with larger I roll slower because more energy goes into spinning.',
    'The constraint v = R omega connects translation and rotation.'),
  // Original Q17 (medium)
  origQ('u2-L5-Q17'),
  // Original Q18 (medium)
  origQ('u2-L5-Q18'),
  // Original Q19 (medium-hard)
  origQ('u2-L5-Q19'),
  // Original Q21 (medium-hard)
  origQ('u2-L5-Q21'),
  // Original Q22 (hard)
  origQ('u2-L5-Q22'),
  // Original Q24-Q30
  origQ('u2-L5-Q24'),
  // Remaining L5 questions
  origQ('u2-L5-Q25'),
  origQ('u2-L5-Q26'),
  origQ('u2-L5-Q27'),
  origQ('u2-L5-Q28'),
  origQ('u2-L5-Q29'),
  origQ('u2-L5-Q30'),
]));

// ===== LESSON 6: u2-L6 (Natural Frequency & Free Vibration) =====
lessons.push(lesson('u2-L6', 'Natural Frequency & Free Vibration', 'Spring-mass systems, natural frequency, and the effects of damping on free vibration.', '📝', 25, [
  origQ('u2-L6-T1'),
  // Easy after teaching
  origQ('u2-L6-Q3'),
  // New teaching card
  teachQ('u2-L6-T1b', 'Damping Reduces Vibration Over Time', 'All real systems have some damping (friction, air resistance, material losses). Underdamped systems oscillate with decreasing amplitude. Critically damped systems return to rest fastest without oscillating. Overdamped systems creep slowly back to rest.', 'Critical damping is ideal for door closers and shock absorbers.'),
  // Easy after teaching
  origQ('u2-L6-Q9'),
  // match-pairs
  matchQ('u2-L6-Q3b', 'Match each damping condition to its behavior:',
    ['Underdamped', 'Critically damped', 'Overdamped', 'Undamped'],
    ['Oscillates with decaying amplitude', 'Returns to rest fastest, no overshoot', 'Slow return, no oscillation', 'Oscillates forever at constant amplitude'],
    [0, 1, 2, 3],
    'The damping ratio zeta determines the behavior: zeta < 1 is underdamped, zeta = 1 is critically damped, zeta > 1 is overdamped, zeta = 0 is undamped.',
    'The damping ratio determines which regime the system is in.'),
  // Original Q1 (medium)
  origQ('u2-L6-Q1'),
  // Original Q2 (medium)
  origQ('u2-L6-Q2'),
  // Original Q4 (medium)
  origQ('u2-L6-Q4'),
  // Original Q5 (medium-hard)
  origQ('u2-L6-Q5'),
  // Original Q6 (fill-blank)
  origQ('u2-L6-Q6'),
  // Original Q7 (hard)
  origQ('u2-L6-Q7'),
]));

// ===== LESSON 6b =====
lessons.push(lesson('u2-L6b', 'Forced Vibration & Resonance', 'Resonance, frequency ratio, and why operating near natural frequency is dangerous.', '📝', 25, [
  origQ('u2-L6-T2'),
  // Easy after teaching
  origQ('u2-L6-Q16'),
  // New teaching card
  teachQ('u2-L6-T2b', 'Resonance Amplifies Vibration', 'When the forcing frequency equals the natural frequency (omega/omega_n = 1), amplitudes become very large. This is resonance. With zero damping, the amplitude goes to infinity (in theory). Real systems have some damping, which limits the peak.', 'Always design operating speeds away from natural frequencies.'),
  // Easy after teaching
  origQ('u2-L6-Q13'),
  // sort-buckets
  sortQ('u2-L6-Q13b', 'Sort each vibration scenario by whether it is desirable or problematic:',
    ['Tuning fork vibrating at its natural frequency', 'Bridge oscillating in wind at resonance', 'Guitar string resonating in a sound box', 'Washing machine shaking violently at certain speeds', 'Ultrasonic cleaner at resonance', 'Engine mount transmitting vibration to chassis'],
    ['Desirable resonance', 'Problematic resonance'],
    [0, 1, 0, 1, 0, 1],
    'Resonance is useful in musical instruments and cleaning. It is dangerous in structures, rotating machinery, and vehicles.',
    'When is large vibration amplitude helpful vs. harmful?'),
  // Original Q8 (medium)
  origQ('u2-L6-Q8'),
  // Original Q10 (medium)
  origQ('u2-L6-Q10'),
  // Original Q11 (medium-hard)
  origQ('u2-L6-Q11'),
  // Original Q12 (medium-hard)
  origQ('u2-L6-Q12'),
  // Original Q14 (hard)
  origQ('u2-L6-Q14'),
  // Original Q15 (hard)
  origQ('u2-L6-Q15'),
]));

// ===== LESSON 6c =====
lessons.push(lesson('u2-L6c', 'Vibration Isolation & Absorbers', 'Transmissibility, vibration isolation design, and tuned mass dampers.', '📝', 25, [
  origQ('u2-L6-T3'),
  // Easy after teaching
  origQ('u2-L6-Q20'),
  // New teaching card
  teachQ('u2-L6-T3b', 'Isolation Requires High Frequency Ratio', 'Vibration isolation works when omega/omega_n > sqrt(2), approximately 1.41. Below this ratio, the mount actually amplifies vibration. Softer mounts (lower omega_n) give better isolation at a given operating speed.', 'Run fast and mount soft for good isolation.'),
  // Easy after teaching
  origQ('u2-L6-Q23'),
  // order-steps
  orderQ('u2-L6-Q20b', 'Put these steps in order to design a vibration isolation system:',
    ['Determine the machine operating frequency', 'Calculate the required frequency ratio (> 1.41)', 'Choose the target natural frequency of the mount', 'Select mount stiffness: k = m times omega_n squared', 'Verify transmissibility is below the acceptable level'],
    [0, 1, 2, 3, 4],
    'Start with the forcing frequency, then work backward to find the required mount stiffness that gives adequate isolation.',
    'The frequency ratio omega/omega_n must exceed sqrt(2) for isolation.'),
  // Original Q17 (medium)
  origQ('u2-L6-Q17'),
  // Original Q18 (medium)
  origQ('u2-L6-Q18'),
  // Original Q19 (medium-hard)
  origQ('u2-L6-Q19'),
  // Original Q21 (medium-hard)
  origQ('u2-L6-Q21'),
  // Original Q22 (hard)
  origQ('u2-L6-Q22'),
  // Original Q24-Q30
  origQ('u2-L6-Q24'),
  // Remaining L6 questions
  origQ('u2-L6-Q25'),
  origQ('u2-L6-Q26'),
  origQ('u2-L6-Q27'),
  origQ('u2-L6-Q28'),
  origQ('u2-L6-Q29'),
  origQ('u2-L6-Q30'),
]));

// ===== CONVERSATION LESSON =====
const convLesson = `    {
      id: 'u2-L-conv',
      title: 'The Vibrating Machine Mystery',
      description: 'Help a plant engineer diagnose why a new compressor is shaking the building.',
      icon: '💬',
      type: 'conversation',
      xpReward: 20,
      questions: [],
      conversationStartNodeId: 'u2-L-conv-C1',
      conversationNodes: [
        {
          id: 'u2-L-conv-C1',
          speaker: 'Plant Manager',
          message: 'We installed a new rotary compressor last week. It runs at 1800 rpm, and the whole floor vibrates badly. My operators are complaining. Can you figure out what is going on?',
          nextNodeId: 'u2-L-conv-C2',
        },
        {
          id: 'u2-L-conv-C2',
          speaker: 'Plant Manager',
          message: 'Where should we start?',
          options: [
            {
              text: 'First, let me check the natural frequency of the compressor-mount system. The vibration might be caused by resonance if the operating speed matches the mount\\'s natural frequency.',
              nextNodeId: 'u2-L-conv-C3',
              quality: 'great',
              feedback: 'Checking for resonance is the right first step. Severe vibration at a specific speed almost always points to a frequency match.',
            },
            {
              text: 'The compressor is probably defective. We should return it to the manufacturer and request a replacement unit.',
              nextNodeId: 'u2-L-conv-C3',
              quality: 'poor',
              feedback: 'Jumping to a defect conclusion skips the diagnostic process. The most common cause of severe vibration after installation is a resonance problem, not a defective machine.',
            },
            {
              text: 'Let me look at the mounting system. Maybe the bolts are loose.',
              nextNodeId: 'u2-L-conv-C3',
              quality: 'okay',
              feedback: 'Checking the mounting is reasonable, but loose bolts usually cause rattling, not floor-shaking vibration. A resonance check should come first.',
            },
          ],
        },
        {
          id: 'u2-L-conv-C3',
          speaker: 'Narrator',
          message: 'You measured the system. The compressor (200 kg) sits on rubber mounts with total stiffness k = 710,000 N/m. The natural frequency is sqrt(k/m) = sqrt(710000/200) = 188.4 rad/s = 1800 rpm. It matches the operating speed exactly.',
          nextNodeId: 'u2-L-conv-C4',
        },
        {
          id: 'u2-L-conv-C4',
          speaker: 'Plant Manager',
          message: 'So the natural frequency equals the running speed? What does that mean, and what should we do?',
          options: [
            {
              text: 'That is textbook resonance. The fix is to change the mount stiffness so the natural frequency is well below 1800 rpm. We need softer mounts, aiming for a frequency ratio above 1.41 so the mounts actually isolate vibration.',
              nextNodeId: 'u2-L-conv-C5',
              quality: 'great',
              feedback: 'Correct. Softer mounts lower the natural frequency, pushing the frequency ratio above sqrt(2) where isolation begins.',
            },
            {
              text: 'We need stiffer mounts to resist the vibration forces. The current mounts are too flexible.',
              nextNodeId: 'u2-L-conv-C5',
              quality: 'poor',
              feedback: 'Stiffer mounts would raise the natural frequency, but the compressor would still pass through resonance during startup/shutdown. Softer mounts that place omega_n well below operating speed are the standard solution.',
            },
            {
              text: 'We should add damping material to the mounts. That will reduce the vibration amplitude at resonance.',
              nextNodeId: 'u2-L-conv-C5',
              quality: 'okay',
              feedback: 'Adding damping helps limit the peak at resonance, but it does not eliminate the resonance condition. The better solution is to detune the system so resonance does not occur at the operating speed.',
            },
          ],
        },
        {
          id: 'u2-L-conv-C5',
          speaker: 'Narrator',
          message: 'You recommended replacing the mounts with softer ones (k = 80,000 N/m). The new natural frequency is sqrt(80000/200) = 20 rad/s = 191 rpm. The frequency ratio is 1800/191 = 9.4, well above sqrt(2). Transmissibility dropped to about 1%.',
          nextNodeId: 'u2-L-conv-C6',
        },
        {
          id: 'u2-L-conv-C6',
          speaker: 'Plant Manager',
          message: 'The vibration during startup still worries me. When the compressor ramps up through 191 rpm, will it shake?',
          options: [
            {
              text: 'Yes, there will be a brief spike when the speed passes through 191 rpm. But the compressor accelerates quickly through that range, so the transient is short. If needed, we can add some damping to limit the startup spike without hurting the steady-state isolation.',
              nextNodeId: 'u2-L-conv-C7',
              quality: 'great',
              feedback: 'Good engineering judgment. The transient resonance during speed ramp-up is real but brief. Adding moderate damping is the standard compromise for startup comfort.',
            },
            {
              text: 'No, resonance only happens at steady state. The compressor will not vibrate during the speed ramp.',
              nextNodeId: 'u2-L-conv-C7',
              quality: 'poor',
              feedback: 'Resonance occurs any time the forcing frequency matches the natural frequency, even briefly during speed transitions. The transient amplitude depends on how long the system stays near resonance.',
            },
            {
              text: 'We should avoid starting the compressor to prevent the resonance spike.',
              nextNodeId: 'u2-L-conv-C7',
              quality: 'okay',
              feedback: 'You cannot avoid starting the machine. The practical approach is to accept the brief transient and add damping if needed to limit the startup spike.',
            },
          ],
        },
        {
          id: 'u2-L-conv-C7',
          speaker: 'Plant Manager',
          message: 'The new mounts worked perfectly. Floor vibration dropped by 99%, and the brief startup shake is barely noticeable. Great diagnosis. Understanding resonance and frequency ratios saved us from an expensive and unnecessary compressor replacement.',
        },
      ],
    }`;

lessons.push(convLesson);

// ===== SPEED ROUND LESSON =====
const speedLesson = `    {
      id: 'u2-L-speed',
      title: 'Dynamics Speed Round',
      description: 'Race the clock: 15 rapid-fire questions on dynamics, kinematics, and vibration.',
      icon: '⚡',
      type: 'speed-round',
      xpReward: 20,
      questions: [],
      speedTimeLimit: 60,
      speedQuestions: [
        { id: 'u2-L-speed-SQ1', question: 'F = ma is Newton\\'s which law?', options: ['Second', 'First', 'Third', 'Fourth'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ2', question: 'Unit of impulse?', options: ['N times s', 'N/s', 'kg/s', 'J'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ3', question: 'Centripetal acceleration direction?', options: ['Toward center', 'Tangent to path', 'Outward', 'Upward'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ4', question: 'KE formula?', options: ['(1/2)mv squared', 'mgh', 'Fv', 'mv'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ5', question: 'Zero net force means?', options: ['Constant velocity', 'Zero velocity', 'Increasing speed', 'Decreasing speed'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ6', question: 'Coefficient of restitution for perfectly elastic?', options: ['1', '0', '0.5', 'Infinity'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ7', question: 'Natural frequency units?', options: ['rad/s or Hz', 'N/m', 'kg/s', 'm/s'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ8', question: 'Resonance occurs when forcing frequency equals?', options: ['Natural frequency', 'Damping frequency', 'Twice natural', 'Half natural'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ9', question: 'Power = Force times?', options: ['Velocity', 'Mass', 'Acceleration', 'Distance'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ10', question: 'Moment of inertia depends on mass and?', options: ['Distance from axis', 'Velocity', 'Temperature', 'Color'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ11', question: 'For rolling without slipping: v = ?', options: ['R omega', 'R alpha', 'R/omega', 'omega/R'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ12', question: 'Friction force opposes?', options: ['Relative motion', 'Normal force', 'Gravity', 'Velocity squared'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ13', question: 'Velocity at the top of projectile arc?', options: ['Horizontal only', 'Zero', 'Maximum', 'Vertical only'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ14', question: 'omega_n for spring-mass?', options: ['sqrt(k/m)', 'k/m', 'm/k', 'sqrt(m/k)'], correctIndex: 0 },
        { id: 'u2-L-speed-SQ15', question: 'Work done by a perpendicular force?', options: ['Zero', 'Maximum', 'Negative', 'Fv'], correctIndex: 0 },
      ],
    }`;

lessons.push(speedLesson);

// ================================================================
// ASSEMBLE THE FILE
// ================================================================

let output = `import type { Unit } from '../types';

export const unit2: Unit = {
  id: 'u2-dynamics',
  title: 'Dynamics & Kinematics',
  description: 'Motion, forces, energy, momentum, and rotational dynamics for particles and rigid bodies.',
  color: '#3B82F6',
  icon: '🚀',
  topicId: 'engineering-mechanics',
  lessons: [
`;

output += lessons.join(',\n');
output += `\n  ],\n};\n`;

writeFileSync(destPath, output, 'utf-8');
console.log(`\nFile written to ${destPath}`);
console.log(`Total lessons: ${lessons.length}`);
console.log(`File size: ${(output.length / 1024).toFixed(1)} KB`);
