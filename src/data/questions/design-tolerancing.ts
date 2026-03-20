import type { Question } from '../types';

export const designTolerancingQuestions: Question[] = [
  // DT-001 — Multiple Choice
  {
    id: 'dt-001',
    type: 'multiple-choice',
    topic: 'design-tolerancing',
    subtopic: 'GD&T Fundamentals',
    difficulty: 'beginner',
    question: 'On a GD&T drawing, a position tolerance of ⌀0.25 is specified at MMC for a hole. The hole\'s actual size is 0.5 mm larger than its MMC size. What is the total allowable positional tolerance?',
    options: [
      { id: 'a', text: '⌀0.25 — the tolerance is fixed regardless of actual size' },
      { id: 'b', text: '⌀0.75 — bonus tolerance equals the departure from MMC' },
      { id: 'c', text: '⌀0.50 — bonus tolerance is twice the departure from MMC' },
      { id: 'd', text: '⌀0.125 — tolerance shrinks at larger sizes' },
    ],
    correctAnswer: 'b',
    explanation: 'At MMC (Maximum Material Condition), the positional tolerance is the stated value: ⌀0.25. When the hole is produced larger than MMC, bonus tolerance is gained. Bonus = actual size - MMC size = 0.5 mm. Total positional tolerance = 0.25 + 0.50 = ⌀0.75. This "bonus tolerance" concept exists because a larger hole is easier to assemble even if its position shifts — the function (pin fits in hole) is still guaranteed.',
    interviewInsight: 'Bonus tolerance / MMC is one of the most commonly asked GD&T topics. If you do not understand MMC and bonus tolerance, you cannot read or create functional GD&T drawings.',
    realWorldConnection: 'This directly affects inspection — a hole that is at the large end of its size tolerance is allowed more positional deviation. This reduces scrap rates while still guaranteeing assembly.',
    commonMistake: 'Thinking the tolerance is always fixed at ⌀0.25 regardless of actual size (this would be RFS — Regardless of Feature Size). MMC explicitly allows bonus tolerance.',
    tags: ['GD&T', 'MMC', 'bonus-tolerance', 'position', 'hole', 'tolerance'],
  },

  // DT-002 — Estimation
  {
    id: 'dt-002',
    type: 'estimation',
    topic: 'design-tolerancing',
    subtopic: 'Tolerance Stack-Up',
    difficulty: 'advanced',
    question: 'Three parts are stacked in series. Each has a dimension of 25.0 ± 0.1 mm. Estimate the total assembly dimension and tolerance using both worst-case and RSS methods.',
    hints: [
      'Worst-case: all tolerances add up directly',
      'RSS: tolerances add in quadrature (root sum of squares)',
      'Compare the two results to see the cost-quality tradeoff',
    ],
    acceptableRange: { low: 74.7, high: 75.3, unit: 'mm total (WC range)', bestEstimate: 75.0 },
    approachSteps: [
      'Nominal total = 3 × 25.0 = 75.0 mm',
      'Worst-case tolerance = ±(0.1 + 0.1 + 0.1) = ±0.3 mm → range: 74.7 to 75.3 mm',
      'RSS tolerance = ±√(0.1² + 0.1² + 0.1²) = ±√(0.03) = ±0.173 mm → range: 74.827 to 75.173 mm',
      'RSS is 42% tighter than worst-case, reflecting statistical reality',
      'Use worst-case when failure is catastrophic (safety-critical assemblies)',
      'Use RSS when statistical quality is acceptable (consumer products, high-volume)',
    ],
    explanation: 'Worst-case analysis guarantees 100% assembly success but requires tighter individual tolerances (more expensive). RSS assumes tolerances follow normal distributions and rarely all stack in the same direction — it gives ~99.73% (3σ) success rate with looser individual tolerances.',
    interviewInsight: 'Tolerance stack-up is a core design engineering skill. The worst-case vs. RSS decision is a cost-quality tradeoff that comes up in every product design interview.',
    commonMistake: 'Using worst-case for everything (too conservative, drives cost up). Or using RSS without understanding that it allows a small percentage of assemblies to fall outside the tolerance.',
    tags: ['tolerance-stack', 'worst-case', 'RSS', 'statistical', 'assembly', 'dimension'],
  },

  // DT-003 — Free Text / Explanation
  {
    id: 'dt-003',
    type: 'explanation',
    topic: 'design-tolerancing',
    subtopic: 'Fits & Limits',
    difficulty: 'intermediate',
    question: 'A design calls for a bearing pressed into a housing (interference fit) and a shaft that slides into the bearing inner race (clearance fit). Explain how you specify these fits and why.',
    sampleAnswer: 'The bearing outer race-to-housing interface is an interference fit because the bearing must not rotate or move within the housing during operation. A typical specification is H7/p6 (ISO system): the housing bore is H7 (hole basis, tolerance just above nominal) and the bearing OD is p6 (shaft basis, tolerance above nominal, creating interference). The interference is typically 0.005-0.025 mm, requiring the bearing to be pressed in or the housing heated for thermal installation.\n\nThe shaft-to-bearing inner race interface is a clearance or transition fit. For a rotating shaft, the inner race typically rotates with the shaft and is specified as k5/H7 or m5/H7 (slight interference to light press fit). However, if the inner race is stationary and the shaft rotates relative to it, a looser fit (g6/H7) may be acceptable.\n\nThe rationale: tight fits prevent fretting (micro-motion wear) between the bearing race and housing/shaft. The loaded race must ALWAYS be interference fit to prevent creep.',
    keyPoints: [
      'Interference fit (H7/p6) for bearing OD in housing — prevents creep and fretting',
      'Transition or light interference fit (k5 or m5 on shaft) for bearing ID on shaft',
      'The loaded race gets the tighter fit',
      'ISO hole-basis system (H) is standard for bearing housings',
      'Excessive interference can distort the bearing race and reduce clearance',
    ],
    explanation: 'Bearing fit specification is one of the most practical applications of the ISO fits and limits system. Every bearing catalog includes recommended fits based on load direction, magnitude, and operating conditions.',
    interviewInsight: 'This is asked in every machine design interview. It tests whether you understand the ISO fit system AND the practical reasoning behind bearing installation fits.',
    commonMistake: 'Specifying clearance on both the inner and outer race — the bearing would spin in the housing. Also, excessive interference that distorts the bearing race.',
    tags: ['fits', 'bearing', 'interference', 'clearance', 'ISO-tolerance', 'H7', 'housing'],
  },

  // DT-004 — Multiple Choice
  {
    id: 'dt-004',
    type: 'multiple-choice',
    topic: 'design-tolerancing',
    subtopic: 'GD&T Fundamentals',
    difficulty: 'intermediate',
    question: 'What is the difference between parallelism and flatness in GD&T?',
    options: [
      { id: 'a', text: 'They are identical — both control how flat a surface is' },
      { id: 'b', text: 'Flatness controls the form of a surface in isolation; parallelism controls the orientation of a surface relative to a datum' },
      { id: 'c', text: 'Parallelism is for round features; flatness is for flat features' },
      { id: 'd', text: 'Flatness requires a datum reference; parallelism does not' },
    ],
    correctAnswer: 'b',
    explanation: 'Flatness is a form control — it says "this surface must lie between two parallel planes 0.XX mm apart" with NO reference to any other feature. Parallelism is an orientation control — it says "this surface must lie between two parallel planes 0.XX mm apart that are also parallel to a datum surface." Parallelism inherently controls flatness (a parallel surface must also be flat within the parallelism tolerance), but flatness does NOT control parallelism.',
    interviewInsight: 'Understanding the hierarchy of GD&T controls (form → orientation → location) is essential. Interviewers test whether you know that higher-level controls refine lower-level ones.',
    realWorldConnection: 'Mating surfaces (flanges, sealing faces) often need both flatness and parallelism controlled. The base of a machine tool needs parallelism to a reference surface to ensure the tool cuts straight.',
    commonMistake: 'Thinking flatness and parallelism are interchangeable. Flatness has no datum; parallelism requires one. This is a fundamental GD&T hierarchy concept.',
    tags: ['GD&T', 'flatness', 'parallelism', 'form', 'orientation', 'datum'],
  },

  // DT-005 — Spot the Flaw
  {
    id: 'dt-005',
    type: 'spot-the-flaw',
    topic: 'design-tolerancing',
    subtopic: 'Engineering Drawings',
    difficulty: 'advanced',
    question: 'Spot the flaw in this GD&T callout:',
    statement: 'A cylindrical shaft feature has a position tolerance of ⌀0.05 mm applied at MMC, referenced to datums A, B, and C. Datum A is the shaft\'s own cylindrical surface.',
    flaw: {
      text: 'Datum A is the shaft\'s own cylindrical surface.',
      flawIndex: 2,
      flawExplanation: 'You cannot reference a feature\'s position to itself. A position tolerance controls where a feature is relative to a datum reference frame. If the datum IS the feature itself, the callout is circular and meaningless — the feature is always at its own location. Datum A should be an independent feature (like a flat mounting face or a different bore) that establishes the reference frame for the shaft\'s position.',
    },
    correctedStatement: 'The position tolerance for the cylindrical shaft should reference independent datums — for example, datum A as a mounting face (primary, establishing a plane), datum B as a locating bore (secondary, establishing an axis), and datum C if needed for rotational constraint.',
    explanation: 'Self-referencing datums are a common GD&T error. The purpose of datums is to establish an external reference frame. A feature cannot be its own reference — that provides no constraint or verification.',
    interviewInsight: 'GD&T errors are very common in industry. The interviewer wants to see that you can catch logical errors in tolerance callouts, not just read valid ones.',
    commonMistake: 'Not recognizing that self-referencing is circular. This error appears on real engineering drawings more often than you would expect.',
    tags: ['GD&T', 'datum', 'position', 'self-reference', 'drawing-error', 'tolerance'],
  },

  // DT-006 — Design Decision
  {
    id: 'dt-006',
    type: 'design-decision',
    topic: 'design-tolerancing',
    subtopic: 'Tolerance Stack-Up',
    difficulty: 'advanced',
    question: 'Your assembly has a critical gap that must be 1.0 ± 0.3 mm. The tolerance stack-up of the five contributing parts gives ±0.5 mm worst-case. How do you fix it?',
    context: 'The assembly is for an automotive sensor mount. The gap controls the sensor-to-target distance and directly affects measurement accuracy. Annual volume is 200,000 units.',
    designOptions: [
      {
        id: 'a',
        text: 'Tighten individual part tolerances to bring the stack within ±0.3 mm',
        tradeoffs: 'Requires each part tolerance to shrink by ~40%. This means tighter process controls, more scrap, higher part cost. May require grinding instead of turning for some features.',
      },
      {
        id: 'b',
        text: 'Add a selectable shim (available in 0.1 mm increments) to compensate for the stack',
        tradeoffs: 'Shims are cheap but require measurement during assembly to select the right thickness. Adds assembly time and labor cost. Creates a kitting challenge.',
      },
      {
        id: 'c',
        text: 'Redesign to reduce the number of contributors in the stack (fewer parts)',
        tradeoffs: 'Fewer parts in the chain means fewer tolerances stacking up. May require a more complex single part that combines functions. Tooling redesign cost.',
      },
      {
        id: 'd',
        text: 'Use statistical (RSS) tolerance analysis and accept the ~0.3% assembly fallout',
        tradeoffs: 'RSS gives ±0.22 mm, which is within spec. But 0.3% fallout means ~600 units/year need rework. May be acceptable depending on rework cost vs. tighter tolerance cost.',
      },
    ],
    bestOption: 'c',
    evaluationCriteria: ['Assembly cost impact', 'Robustness of solution', 'Part cost impact', 'Long-term manufacturing stability'],
    explanation: 'Reducing the number of parts in the tolerance chain is the most robust solution. If you can combine two parts into one, you eliminate one set of tolerances entirely. This is superior to tightening tolerances (which fights physics) or adding shims (which adds assembly complexity). Statistical acceptance (d) is viable at high volumes but requires ongoing process monitoring.',
    interviewInsight: 'Tolerance management is a core product design skill. The interviewer wants to see that you think about the system design, not just crunch numbers. Redesigning the stack is a higher-level solution than tightening tolerances.',
    commonMistake: 'Immediately choosing option (a) without considering the cost. Also, not recognizing that reducing the number of contributors is the most permanent fix.',
    tags: ['tolerance-stack', 'shim', 'DFM', 'assembly', 'gap', 'redesign'],
  },
];
