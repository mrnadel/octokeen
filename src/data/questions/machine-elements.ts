import type { Question } from '../types';

export const machineElementsQuestions: Question[] = [
  // ME-001 — Multiple Choice
  {
    id: 'me-001',
    type: 'multiple-choice',
    topic: 'machine-elements',
    subtopic: 'Bearings',
    difficulty: 'intermediate',
    question: 'A deep groove ball bearing has a basic dynamic load rating (C) of 25 kN. If the applied radial load is 5 kN, what is the approximate L10 life in millions of revolutions?',
    options: [
      { id: 'a', text: '5 million revolutions' },
      { id: 'b', text: '25 million revolutions' },
      { id: 'c', text: '125 million revolutions' },
      { id: 'd', text: '625 million revolutions' },
    ],
    correctAnswer: 'c',
    explanation: 'For ball bearings, L10 = (C/P)³ = (25/5)³ = 5³ = 125 million revolutions. The L10 life is the number of revolutions at which 10% of a population of identical bearings will have failed. The exponent is 3 for ball bearings and 10/3 for roller bearings. The cubic relationship means doubling the load reduces life by a factor of 8.',
    interviewInsight: 'Bearing life calculation is one of the most commonly asked machine design questions. The interviewer expects you to know the formula and the significance of the exponent.',
    realWorldConnection: 'Every rotating machine — from hard drives to wind turbines — requires this calculation. The bearing is often the life-limiting component, and under-specifying it means premature failure.',
    commonMistake: 'Using the wrong exponent (3 for ball bearings vs. 10/3 for roller bearings). Also, confusing C (dynamic load rating) with C0 (static load rating).',
    tags: ['bearing', 'L10-life', 'dynamic-load-rating', 'ball-bearing', 'fatigue'],
  },

  // ME-002 — What Fails First
  {
    id: 'me-002',
    type: 'what-fails-first',
    topic: 'machine-elements',
    subtopic: 'Gears & Gear Trains',
    difficulty: 'advanced',
    question: 'A spur gear pair in an industrial gearbox runs continuously at high torque and moderate speed. Which failure mode occurs first?',
    components: [
      { id: 'a', text: 'Tooth bending fatigue — crack at the root fillet' },
      { id: 'b', text: 'Surface pitting — fatigue spalling on the tooth flank' },
      { id: 'c', text: 'Scoring/scuffing — adhesive wear from metal-to-metal contact' },
      { id: 'd', text: 'Tooth tip fracture — overload breakage of a single tooth' },
    ],
    correctAnswer: 'b',
    failureMode: 'Surface pitting — Hertzian contact fatigue causes subsurface cracks that propagate to the surface, creating small pits on the tooth flanks. This is the most common gear failure mode in properly designed, well-lubricated gearboxes.',
    failureChain: [
      'Repeated Hertzian contact stress cycles create subsurface shear stress concentration',
      'Micro-cracks initiate at subsurface inclusions or defects where shear stress is maximum',
      'Cracks propagate toward the surface under continued cycling',
      'Small pits (spalls) form on the tooth flank — initially cosmetic but growing',
      'Pitting generates debris that contaminates the lubricant, accelerating wear of other components',
      'Eventually, a large pit undermines the tooth surface, leading to tooth breakage',
    ],
    explanation: 'In a well-designed gear system, bending fatigue is prevented by adequate root fillet radius and proper tooth size. Scoring is prevented by proper lubrication. Overload fracture requires a shock load beyond the design margin. That leaves pitting as the most common service failure mode — it is essentially contact fatigue and is the basis for gear life rating standards (AGMA, ISO).',
    interviewInsight: 'Gear failure modes are a standard interview topic for anyone working with power transmission. The interviewer wants to see that you know pitting is the normal life-limiting mode, not tooth breakage.',
    realWorldConnection: 'Gear oils contain anti-pitting additives (EP additives) specifically to delay this failure mode. Periodic oil analysis showing metallic particles is an early indicator of pitting.',
    commonMistake: 'Choosing tooth bending fatigue because it sounds more dramatic. In practice, pitting on the tooth flanks is far more common in well-designed gearboxes.',
    tags: ['gears', 'pitting', 'hertzian-contact', 'fatigue', 'failure-mode', 'lubrication'],
  },

  // ME-003 — Two Choice Tradeoff
  {
    id: 'me-003',
    type: 'two-choice-tradeoff',
    topic: 'machine-elements',
    subtopic: 'Bearings',
    difficulty: 'intermediate',
    question: 'For a high-speed spindle (15,000 RPM), should you use a rolling element bearing or a hydrodynamic (journal) bearing?',
    choices: [
      {
        id: 'a',
        text: 'Angular contact ball bearing (rolling element)',
        pros: ['Low friction at startup and low speeds', 'Precise radial and axial positioning', 'Standardized, readily available, easy to replace', 'Good for moderate speeds with ceramic hybrid options (Si3N4 balls)'],
        cons: ['Speed limited by DN number (bore mm × RPM)', 'Generates heat at high speeds from ball/race contact', 'Requires preload management', 'Finite fatigue life (L10 calculation applies)'],
      },
      {
        id: 'b',
        text: 'Hydrodynamic (fluid film) journal bearing',
        pros: ['No metal-to-metal contact at operating speed — very long life', 'Excellent damping of vibrations', 'Can handle very high speeds if properly designed', 'No fatigue life limit — theoretically infinite life with proper lubrication'],
        cons: ['High friction at startup (boundary lubrication until oil film forms)', 'Requires a pressurized oil supply system', 'Less precise positioning than rolling bearings', 'Complex design and analysis (Sommerfeld number, stability)'],
      },
    ],
    preferredAnswer: 'a',
    acceptableAnswer: 'either',
    justification: 'For a 15,000 RPM machine tool spindle, angular contact ball bearings (especially ceramic hybrid) are the standard choice. They provide the precise positioning needed for machining accuracy and are manageable at this speed with proper lubrication. Journal bearings could handle the speed but offer less positional precision and are more complex to implement. At much higher speeds (50,000+ RPM for dental drills or turbochargers), air bearings or specialized fluid film bearings become necessary.',
    explanation: 'Bearing selection for high-speed applications is a balance between speed capability, precision, damping, and system complexity. The DN number (bore diameter in mm × RPM) is a useful speed limit metric for rolling bearings.',
    interviewInsight: 'The interviewer wants to see that you understand BOTH bearing types and can articulate when each is appropriate. The follow-up question is usually about the DN limit.',
    commonMistake: 'Not knowing what a journal bearing is, or defaulting to "ball bearing for everything." Also, not considering ceramic hybrid bearings for high-speed applications.',
    tags: ['bearing', 'spindle', 'high-speed', 'journal-bearing', 'angular-contact', 'DN-number'],
  },

  // ME-004 — Multiple Choice
  {
    id: 'me-004',
    type: 'multiple-choice',
    topic: 'machine-elements',
    subtopic: 'Fasteners & Joints',
    difficulty: 'intermediate',
    question: 'A bolted joint clamps two steel flanges. The bolt preload is 40 kN. An external tensile force of 10 kN is applied to the joint. What is the approximate bolt force now?',
    options: [
      { id: 'a', text: '50 kN — preload plus external load' },
      { id: 'b', text: '43 kN — bolt force increases by only a fraction of the external load' },
      { id: 'c', text: '40 kN — the bolt force does not change because the joint is preloaded' },
      { id: 'd', text: '30 kN — the external force relieves some preload' },
    ],
    correctAnswer: 'b',
    explanation: 'In a preloaded bolted joint, the external load is shared between increasing the bolt force and relieving the clamp force on the joint members. The fraction going to the bolt is determined by the stiffness ratio: ΔF_bolt = C × F_external, where C = k_bolt / (k_bolt + k_members). For a typical steel-on-steel joint, C ≈ 0.2-0.3. So ΔF_bolt ≈ 0.3 × 10 = 3 kN. Total bolt force ≈ 43 kN. The joint members see their clamping force reduced from 40 kN to 33 kN.',
    interviewInsight: 'The bolt stiffness ratio concept is one of the most important and most commonly tested topics in mechanical design. It explains why properly preloaded bolts rarely fail from external loads.',
    realWorldConnection: 'This is critical for pressure vessel flanges, engine head bolts, and structural connections. Proper preload means the bolt barely "feels" the external load — most of it just relieves the clamp.',
    commonMistake: 'Saying 50 kN (simple addition). This would be true only if the joint members had zero stiffness — which would mean no clamping at all. The stiffness ratio is the key concept.',
    tags: ['bolt', 'preload', 'stiffness-ratio', 'joint', 'flange', 'clamping-force'],
  },

  // ME-005 — Free Text / Explanation
  {
    id: 'me-005',
    type: 'free-text',
    topic: 'machine-elements',
    subtopic: 'Seals & Gaskets',
    difficulty: 'intermediate',
    question: 'Explain why an O-ring groove is designed with a specific squeeze percentage. What happens if you use too much or too little squeeze?',
    sampleAnswer: 'An O-ring seals by being compressed (squeezed) between the groove and the mating surface. The squeeze creates a contact stress that exceeds the system pressure, preventing leakage. Standard squeeze is 10-30% of the O-ring cross-section diameter, depending on the application (static vs. dynamic, pressure level).\n\nToo little squeeze: The contact stress is insufficient to overcome the system pressure, especially as the O-ring ages, hardens, and takes a compression set. The seal leaks. At very low squeeze, the O-ring may not even contact the mating surface properly.\n\nToo much squeeze: Excessive squeeze creates high friction, accelerated wear, and heat generation in dynamic applications (reciprocating or rotating). It also overstresses the elastomer, causing premature compression set (permanent deformation), cracking, and nibbling (extrusion into the gap). The seal life is dramatically shortened.',
    keyPoints: [
      'Squeeze creates contact stress that must exceed fluid pressure',
      'Standard squeeze: 10-30% depending on application (less for dynamic seals)',
      'Too little: leakage, especially after compression set with aging',
      'Too much: friction, wear, heat, premature failure, extrusion',
      'Groove design must also account for thermal expansion and tolerance stack',
    ],
    explanation: 'O-ring groove design is deceptively complex. The groove volume, squeeze, and clearance gap all interact. Getting it wrong leads to either leaks or premature seal failure.',
    interviewInsight: 'Seal design comes up in almost every product design interview. The interviewer wants to know that you have designed (or at least thought about) actual sealing systems, not just placed an O-ring in a CAD model.',
    commonMistake: 'Thinking more squeeze is always better. Also, not accounting for thermal expansion of the O-ring material, which can increase effective squeeze at elevated temperatures.',
    tags: ['O-ring', 'seal', 'squeeze', 'groove-design', 'compression-set', 'elastomer'],
  },

  // ME-006 — Multiple Choice
  {
    id: 'me-006',
    type: 'multiple-choice',
    topic: 'machine-elements',
    subtopic: 'Gears & Gear Trains',
    difficulty: 'beginner',
    question: 'A motor drives a gear reducer with a 5:1 ratio. If the motor outputs 10 Nm at 3000 RPM, what are the approximate output torque and speed?',
    options: [
      { id: 'a', text: '50 Nm at 600 RPM' },
      { id: 'b', text: '2 Nm at 15,000 RPM' },
      { id: 'c', text: '50 Nm at 3000 RPM' },
      { id: 'd', text: '10 Nm at 600 RPM' },
    ],
    correctAnswer: 'a',
    explanation: 'A gear reducer with a 5:1 ratio reduces speed by 5× and increases torque by 5× (minus losses). Output speed = 3000/5 = 600 RPM. Output torque = 10 × 5 = 50 Nm (assuming 100% efficiency; real gearboxes are 85-98% efficient). Power is conserved: P_in = P_out (ideally). This is why gearboxes exist — to convert high-speed, low-torque motor output to low-speed, high-torque at the load.',
    interviewInsight: 'This is a fundamental machine elements question. If you cannot do gear ratio calculations instantly, the interviewer will question your mechanical engineering foundation.',
    realWorldConnection: 'Every application from car transmissions to robot joints to wind turbines uses gear ratios to match motor characteristics to load requirements.',
    commonMistake: 'Confusing speed increase with speed reduction. A "5:1 reducer" divides speed by 5 and multiplies torque by 5.',
    tags: ['gear-ratio', 'torque', 'speed', 'reducer', 'power-transmission'],
  },

  // ME-007 — Scenario
  {
    id: 'me-007',
    type: 'scenario',
    topic: 'machine-elements',
    subtopic: 'Shafts & Couplings',
    difficulty: 'advanced',
    question: 'A pump shaft connected to a motor through a flexible coupling is vibrating excessively. Diagnose and fix the problem.',
    context: 'A 50 HP motor at 1800 RPM drives a centrifugal pump through a jaw-type flexible coupling. After 6 months of operation, the coupling spider (elastomeric insert) has shredded, and the pump bearing has failed. The shaft shows wear marks at the bearing location.',
    steps: [
      {
        prompt: 'What is the most likely root cause?',
        idealResponse: 'Shaft misalignment — either angular, parallel (offset), or both. The flexible coupling was masking the misalignment by absorbing the resulting forces, but those forces overloaded the coupling spider and the pump bearing. The coupling is a symptom absorber, not a cure for misalignment.',
      },
      {
        prompt: 'How would you verify misalignment?',
        idealResponse: 'Use a dial indicator setup or laser alignment tool. Check for both angular misalignment (shafts at an angle) and parallel offset (shafts parallel but not collinear). Acceptable alignment for a jaw coupling at 1800 RPM is typically <0.05mm offset and <0.05mm/100mm angular. Also check for soft foot (base not flat), thermal growth (motor/pump expand when hot), and pipe strain (piping forces pulling the pump out of alignment).',
      },
      {
        prompt: 'How do you fix it permanently?',
        idealResponse: 'First, correct the alignment using laser alignment tools to bring within coupling specifications. Install a new coupling spider and bearing. Then address root causes: (1) Install shims for soft foot correction. (2) Account for thermal growth — align cold with a calculated offset so the shafts are aligned when hot. (3) Ensure piping does not impose forces on the pump flanges. (4) Implement a periodic alignment check program (annually or after any maintenance).',
      },
    ],
    keyTakeaway: 'Shaft misalignment is the #1 cause of coupling and bearing failure in rotating machinery. Flexible couplings accommodate SMALL misalignment — they are not a substitute for proper alignment.',
    explanation: 'Misalignment imposes cyclic forces on bearings and couplings at shaft rotational frequency. These forces accelerate fatigue in bearings and generate heat in coupling elements. The symptoms (coupling failure, bearing failure, vibration) are classic indicators.',
    interviewInsight: 'This is a real-world troubleshooting scenario that comes up in every rotating machinery interview. The interviewer wants to see systematic diagnosis, not guesswork.',
    commonMistake: 'Saying "replace the coupling with a stronger one." This treats the symptom, not the cause. The misalignment will just destroy the new coupling too, albeit more slowly.',
    tags: ['alignment', 'coupling', 'bearing-failure', 'vibration', 'troubleshooting', 'pump'],
  },

  // ME-008 — Multi-Select
  {
    id: 'me-008',
    type: 'multi-select',
    topic: 'machine-elements',
    subtopic: 'Fasteners & Joints',
    difficulty: 'intermediate',
    question: 'Which methods effectively prevent bolt loosening under vibration? (Select all that apply)',
    options: [
      { id: 'a', text: 'Split (helical) lock washers' },
      { id: 'b', text: 'Nylon-insert lock nuts (Nyloc)' },
      { id: 'c', text: 'Nord-Lock wedge-locking washers' },
      { id: 'd', text: 'Thread-locking adhesive (Loctite)' },
      { id: 'e', text: 'Using longer bolts to increase grip length' },
    ],
    correctAnswers: ['b', 'c', 'd'],
    explanation: 'Research (notably the Junker vibration test) has shown that split lock washers (a) are INEFFECTIVE at preventing vibration loosening — they can actually accelerate it by reducing friction under the bolt head. Longer bolts (e) increase resilience but do not prevent relative rotation. Effective methods include: Nyloc nuts (prevailing torque from deformed nylon insert), Nord-Lock washers (wedge-lock mechanism that uses bolt tension itself to resist loosening), and thread-locking adhesive (fills thread gaps and bonds chemically).',
    interviewInsight: 'The fact that split lock washers do not work is a surprise to many engineers. This is a practical knowledge question that separates engineers who have tested fastener locking methods from those who just copy existing designs.',
    realWorldConnection: 'NASA does not allow split lock washers in space hardware. Many automotive and aerospace companies have moved to Nord-Lock or similar positive-locking systems.',
    commonMistake: 'Selecting split lock washers because they are the most commonly used locking device. They are popular but experimentally shown to be ineffective against vibration loosening.',
    tags: ['bolt', 'locking', 'vibration', 'Nyloc', 'Nord-Lock', 'Loctite', 'fastener'],
  },
];
