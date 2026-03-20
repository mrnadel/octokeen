import type { Question } from '../types';

export const engineeringMechanicsQuestions: Question[] = [
  // EM-001 — Multiple Choice
  {
    id: 'em-001',
    type: 'multiple-choice',
    topic: 'engineering-mechanics',
    subtopic: 'Statics & Equilibrium',
    difficulty: 'beginner',
    question: 'A rigid beam is pinned at one end and supported by a cable at the other. A load hangs from the midpoint. If you cut the cable, which direction does the reaction force at the pin shift?',
    options: [
      { id: 'a', text: 'The horizontal component vanishes and the vertical component equals the load' },
      { id: 'b', text: 'Both horizontal and vertical components increase' },
      { id: 'c', text: 'The reaction remains unchanged because the pin was already carrying the load' },
      { id: 'd', text: 'The pin cannot support the beam alone — the system collapses' },
    ],
    correctAnswer: 'a',
    explanation: 'The cable was providing both a vertical lift and a horizontal pull. Once cut, the beam can only be supported at the pin, which must now carry the full weight vertically. The horizontal component from the cable tension disappears. If the pin is truly frictionless with no horizontal load, the horizontal reaction drops to zero.',
    interviewInsight: 'Interviewers want to see that you can reason through equilibrium changes when a constraint is removed, not just solve textbook statics.',
    realWorldConnection: 'This is analogous to a rigging failure scenario — understanding how loads redistribute when a support fails is critical in crane and scaffolding design.',
    commonMistake: 'Candidates often forget that the cable was introducing a horizontal force component. They say the reaction "stays the same" because the total vertical load hasn\'t changed.',
    tags: ['statics', 'equilibrium', 'pin-reactions', 'cable', 'free-body-diagram'],
  },

  // EM-002 — Explanation / Free Text
  {
    id: 'em-002',
    type: 'free-text',
    topic: 'engineering-mechanics',
    subtopic: 'Free-Body Diagrams',
    difficulty: 'intermediate',
    question: 'Why does a bicycle stay upright while moving but fall over when stationary? Walk through the mechanics.',
    sampleAnswer: 'A moving bicycle is stabilized primarily by trail and caster effect in the steering geometry, supplemented by gyroscopic precession of the wheels. When the bike begins to lean, the front wheel steers into the fall due to the fork geometry (trail), creating a centripetal force that pushes the contact patch back under the center of gravity. Gyroscopic precession of the spinning wheel also contributes a steering torque in the same helpful direction, though it is a secondary effect. At rest, none of these dynamic corrections occur — there is no velocity to generate centripetal correction or gyroscopic torques, so the unstable inverted-pendulum simply topples.',
    keyPoints: [
      'Trail / caster effect causes counter-steering when the bike leans',
      'Gyroscopic precession provides a supplementary (not primary) stabilizing torque',
      'At rest, the system is an unstable inverted pendulum with no corrective mechanism',
      'Rider input also plays a role at low speeds',
    ],
    explanation: 'This is a famously subtle dynamics problem. The key insight is that geometry (trail) matters more than the gyroscopic effect most people cite. Research by Kooijman et al. (2011) showed bikes can self-stabilize even without spinning wheels if the geometry is right.',
    interviewInsight: 'This tests whether you can separate popular misconception (gyroscopes keep bikes up) from actual mechanics. Interviewers love it because it shows depth of understanding vs. surface knowledge.',
    realWorldConnection: 'Motorcycle and bicycle designers tune trail, rake angle, and wheel inertia to achieve the right self-stability envelope for their target speed range.',
    commonMistake: 'Almost everyone says "gyroscopic effect" as the sole answer. That is incomplete and not even the primary mechanism.',
    tags: ['dynamics', 'stability', 'gyroscope', 'bicycle', 'counter-steering'],
  },

  // EM-003 — Estimation
  {
    id: 'em-003',
    type: 'estimation',
    topic: 'engineering-mechanics',
    subtopic: 'Dynamics & Kinematics',
    difficulty: 'intermediate',
    question: 'Estimate the force your quadriceps must produce when you stand up from a chair.',
    hints: [
      'Consider your body weight and what fraction is being lifted',
      'Think about the lever arm at the knee joint',
      'The quadriceps attach to the tibia via the patellar tendon at a small moment arm from the knee center',
    ],
    acceptableRange: { low: 1500, high: 4500, unit: 'N', bestEstimate: 2800 },
    approachSteps: [
      'Assume an 80 kg person; weight = ~800 N',
      'When rising, roughly 70% of body weight is lifted by the legs, so ~560 N per leg needs to be overcome plus acceleration',
      'The external moment arm from knee to the center of gravity is roughly 25-30 cm',
      'The patellar tendon moment arm is only about 4-5 cm',
      'Mechanical disadvantage is roughly 6:1, so quadriceps force ~ 560 N x 6 = ~3,360 N per leg at peak',
      'Account for acceleration (standing up in ~1 s) which adds another 10-20%',
    ],
    explanation: 'The knee joint operates at a severe mechanical disadvantage. The patellar tendon inserts close to the knee pivot while the body weight acts at a long lever arm. This is why the quadriceps is the largest muscle in the body — it routinely generates forces 3-5 times body weight.',
    interviewInsight: 'Estimation questions test structured thinking and order-of-magnitude reasoning. Interviewers care about your approach, not hitting a magic number.',
    realWorldConnection: 'Knee implant designers and physical therapists must understand these forces. Knee replacement bearing surfaces are designed to handle up to 5-8x body weight during activities like stair descent.',
    commonMistake: 'Candidates often just say "body weight" without considering the mechanical advantage of the joint. The actual muscle force is many times larger than the external load.',
    tags: ['estimation', 'biomechanics', 'lever-arm', 'knee-joint', 'mechanical-advantage'],
  },

  // EM-004 — Two Choice Tradeoff
  {
    id: 'em-004',
    type: 'two-choice-tradeoff',
    topic: 'engineering-mechanics',
    subtopic: 'Friction & Contact',
    difficulty: 'intermediate',
    question: 'You are designing a braking system for a conveyor belt. Should you use a band brake or a disc brake?',
    choices: [
      {
        id: 'a',
        text: 'Band brake — a flexible band wraps around a drum',
        pros: ['Simple and cheap to manufacture', 'Self-energizing effect amplifies braking force', 'Compact design for high-torque applications'],
        cons: ['Uneven wear due to tension variation along the band', 'Sensitive to direction of rotation for self-energizing effect', 'Heat dissipation is poor — drum gets very hot'],
      },
      {
        id: 'b',
        text: 'Disc brake — caliper squeezes a flat disc',
        pros: ['Even wear on both pads', 'Better heat dissipation with exposed disc', 'Consistent braking regardless of rotation direction', 'Easier to inspect and replace pads'],
        cons: ['More expensive and complex', 'Requires hydraulic or pneumatic actuation', 'Heavier for equivalent torque capacity'],
      },
    ],
    preferredAnswer: 'b',
    acceptableAnswer: 'either',
    justification: 'For a conveyor belt that may run in both directions and needs reliable, repeatable braking with easy maintenance, the disc brake is generally preferred. However, if the conveyor only runs one direction and cost is paramount, a band brake with proper thermal management is a valid choice.',
    explanation: 'This is a classic tradeoff between simplicity/cost and performance/maintenance. The self-energizing effect of a band brake is powerful but also dangerous — if the friction coefficient changes (wet, worn lining), braking force changes dramatically.',
    interviewInsight: 'Tradeoff questions have no single right answer. Interviewers want to see that you identify the relevant criteria (cost, maintenance, direction, thermal) and reason through them systematically.',
    commonMistake: 'Candidates pick one without discussing the tradeoffs. The interviewer wants the analysis, not just the answer.',
    tags: ['brakes', 'friction', 'conveyor', 'design-tradeoff', 'self-energizing'],
  },

  // EM-005 — Ranking
  {
    id: 'em-005',
    type: 'ranking',
    topic: 'engineering-mechanics',
    subtopic: 'Work & Energy Methods',
    difficulty: 'intermediate',
    question: 'Rank these scenarios by the translational speed (and translational kinetic energy) the object has at the bottom of an identical frictionless ramp (highest first):',
    items: [
      { id: 'a', text: 'A solid steel sphere rolling without slipping' },
      { id: 'b', text: 'A hollow thin-walled sphere rolling without slipping' },
      { id: 'c', text: 'A frictionless block sliding (no rotation)' },
      { id: 'd', text: 'A solid cylinder rolling without slipping' },
    ],
    correctOrder: ['c', 'a', 'd', 'b'],
    explanation: 'All objects start with the same potential energy. The sliding block converts all PE to translational KE. Rolling objects split PE between translational and rotational KE. The fraction going to rotation depends on the moment of inertia: solid sphere (2/5 mr^2), solid cylinder (1/2 mr^2), hollow sphere (2/3 mr^2). Higher rotational inertia means less translational speed at the bottom, so the hollow sphere is slowest.',
    interviewInsight: 'This tests whether you truly understand energy partitioning between translational and rotational modes. It is one of the most commonly asked conceptual questions in dynamics interviews.',
    realWorldConnection: 'Flywheel energy storage systems exploit high rotational inertia. Understanding how energy partitions between rotation and translation also matters in vehicle dynamics — heavier wheels reduce acceleration.',
    commonMistake: 'Many candidates think all objects arrive at the same speed because they have the same mass and ramp height. They forget that rolling objects must "spend" some energy on spin.',
    tags: ['energy', 'rolling', 'moment-of-inertia', 'ranking', 'ramp'],
  },

  // EM-006 — Spot the Flaw
  {
    id: 'em-006',
    type: 'spot-the-flaw',
    topic: 'engineering-mechanics',
    subtopic: 'Statics & Equilibrium',
    difficulty: 'advanced',
    question: 'Spot the flaw in this engineering claim:',
    statement: 'A three-legged stool is less stable than a four-legged stool because it has fewer support points. That is why most chairs have four legs — the additional leg provides extra stability against tipping.',
    flaw: {
      text: 'A three-legged stool is less stable than a four-legged stool because it has fewer support points.',
      flawIndex: 0,
      flawExplanation: 'A three-legged stool is actually MORE stable in one important sense: it always sits flat on an uneven surface because three points always define a plane. A four-legged stool on an uneven surface will rock because four points are over-constrained unless the surface is perfectly flat. Four-legged chairs trade this advantage for a wider support polygon, which resists tipping better in all directions.',
    },
    correctedStatement: 'A three-legged stool always sits flat on uneven surfaces because three points define a unique plane, while a four-legged stool can rock. However, a four-legged chair provides a larger support polygon, which improves resistance to tipping — that is the actual reason most chairs have four legs.',
    explanation: 'The concepts of stability against wobble (three legs wins) and stability against tipping (larger polygon wins) are different. This is a classic confusion between determinacy and stability.',
    interviewInsight: 'This tests whether you understand static determinacy vs. practical stability. It also shows if you can communicate nuanced engineering concepts clearly.',
    commonMistake: 'Accepting the statement at face value without distinguishing between "will it wobble?" and "will it tip over?".',
    tags: ['statics', 'stability', 'determinacy', 'over-constrained', 'support-polygon'],
  },

  // EM-007 — Confidence Rated
  {
    id: 'em-007',
    type: 'confidence-rated',
    topic: 'engineering-mechanics',
    subtopic: 'Dynamics & Kinematics',
    difficulty: 'intermediate',
    question: 'A car is turning on a flat (unbanked) road at constant speed. What provides the centripetal force?',
    options: [
      { id: 'a', text: 'The engine driving the wheels forward' },
      { id: 'b', text: 'Static friction between the tires and road, directed toward the center of the turn' },
      { id: 'c', text: 'The normal force from the road tilting the car inward' },
      { id: 'd', text: 'The car\'s weight component resolved toward the turn center' },
    ],
    correctAnswer: 'b',
    confidenceLevels: ['Guessing', 'Somewhat sure', 'Very confident'],
    explanation: 'On a flat road, the only horizontal force available is friction. For a car turning at constant speed, static friction (not kinetic — the tires are not sliding) acts laterally, pointing toward the center of the circular path. This is why you skid on ice: no friction means no centripetal force.',
    interviewInsight: 'Confidence-rated questions reveal calibration. An engineer who is very confident and correct is great. One who is very confident and wrong has a calibration problem — that is a red flag.',
    realWorldConnection: 'Tire engineers design tread patterns and rubber compounds to maximize lateral grip. Race car engineers tune tire pressure and camber to optimize the friction circle.',
    commonMistake: 'Confusing the role of the engine (which provides tangential force for speed) with the centripetal force (which is perpendicular to velocity). Also, saying "kinetic friction" instead of "static friction."',
    tags: ['centripetal-force', 'friction', 'circular-motion', 'automotive', 'tires'],
  },

  // EM-008 — Scenario
  {
    id: 'em-008',
    type: 'scenario',
    topic: 'engineering-mechanics',
    subtopic: 'Work & Energy Methods',
    difficulty: 'advanced',
    question: 'You are designing a cargo elevator counterweight system. Walk through the design.',
    context: 'A freight elevator carries up to 2,000 kg of cargo. The car itself weighs 1,500 kg. It travels 20 meters between floors. Your task is to design the counterweight to minimize motor power.',
    steps: [
      {
        prompt: 'What should the counterweight mass be?',
        idealResponse: 'Set the counterweight to balance the car plus half the maximum payload: 1,500 + 1,000 = 2,500 kg. This way, the motor only needs to lift/lower the difference (up to 1,000 kg equivalent) regardless of load direction.',
      },
      {
        prompt: 'Why not set the counterweight equal to the full loaded weight (3,500 kg)?',
        idealResponse: 'If counterweight equals full load, the motor saves energy going up fully loaded but must work hard when the elevator is empty going up (lifting the 2,000 kg excess counterweight). Balancing at half-load minimizes the maximum imbalance in both directions.',
      },
      {
        prompt: 'How does this affect motor sizing?',
        idealResponse: 'The motor peak power is proportional to the maximum imbalance times velocity. With half-load balancing, the peak imbalance is 1,000 kg x g x v_max. Without a counterweight, it would be 3,500 kg x g x v_max — the motor would need to be 3.5 times larger.',
      },
    ],
    keyTakeaway: 'Counterweight design is an optimization problem: balance at the midpoint of the expected load range to minimize peak motor power and energy consumption.',
    explanation: 'This is one of the oldest and most elegant energy-saving mechanisms in engineering. Every traction elevator in the world uses this principle. The counterweight also reduces cable tension and brake loads.',
    interviewInsight: 'Scenario questions test your ability to think through a design problem step by step, making and defending engineering decisions. There is no single formula to apply.',
    commonMistake: 'Setting the counterweight equal to the car weight alone (1,500 kg) — this ignores that the average load is not zero. Or setting it to the full loaded weight and not considering the empty-car case.',
    tags: ['counterweight', 'elevator', 'energy', 'motor-sizing', 'optimization'],
  },
];
