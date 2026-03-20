import type { Question } from '../types';

export const strengthOfMaterialsQuestions: Question[] = [
  // SOM-001 — Multiple Choice
  {
    id: 'som-001',
    type: 'multiple-choice',
    topic: 'strength-of-materials',
    subtopic: 'Stress & Strain',
    difficulty: 'beginner',
    question: 'A bolt is tightened to clamp two plates together. What type of stress is the bolt primarily under?',
    options: [
      { id: 'a', text: 'Pure shear stress along the thread interface' },
      { id: 'b', text: 'Tensile stress along its axis from the preload' },
      { id: 'c', text: 'Compressive stress because it is being squeezed by the nut' },
      { id: 'd', text: 'Bending stress from misalignment of the plates' },
    ],
    correctAnswer: 'b',
    explanation: 'When you torque a bolt, the nut pulls the bolt head and nut together, stretching the bolt shank. This creates axial tensile stress (preload). The clamped plates are in compression, not the bolt. The bolt also has torsional shear from the torquing process, but the dominant design stress is tension.',
    interviewInsight: 'This is a fundamental question that trips up candidates who confuse what is in tension vs. compression in a bolted joint. It shows understanding of how fasteners actually work.',
    realWorldConnection: 'Proper bolt preload is critical in automotive cylinder heads, pressure vessels, and structural steel connections. Under-torqued bolts allow joint separation; over-torqued bolts risk yielding.',
    commonMistake: 'Saying the bolt is in compression because you are "squeezing" things together. The plates are compressed; the bolt is stretched.',
    tags: ['bolt', 'preload', 'tensile-stress', 'fastener', 'joint'],
  },

  // SOM-002 — Multiple Choice
  {
    id: 'som-002',
    type: 'multiple-choice',
    topic: 'strength-of-materials',
    subtopic: 'Beam Bending',
    difficulty: 'beginner',
    question: 'Where is the maximum bending stress in a simply supported beam with a central point load?',
    options: [
      { id: 'a', text: 'At the supports, on the top surface' },
      { id: 'b', text: 'At mid-span, on the top and bottom surfaces' },
      { id: 'c', text: 'At the neutral axis, at mid-span' },
      { id: 'd', text: 'Uniformly distributed throughout the beam' },
    ],
    correctAnswer: 'b',
    explanation: 'The bending moment is maximum at mid-span for a central point load. Bending stress is zero at the neutral axis and maximum at the extreme fibers (top and bottom surfaces). The top fiber is in compression and the bottom in tension (for a downward load on a simple beam). At the supports, the bending moment is zero.',
    interviewInsight: 'This is Beam Bending 101. If a candidate cannot answer this correctly, deeper structural questions are off the table. Interviewers use it as a gate question.',
    realWorldConnection: 'This directly applies to bridge design, shelf brackets, automotive suspension links — anywhere a member carries a transverse load between supports.',
    commonMistake: 'Saying the stress is maximum at the neutral axis (it is zero there) or at the supports (the moment is zero there for a simply supported beam).',
    tags: ['bending', 'beam', 'stress-distribution', 'neutral-axis', 'simply-supported'],
  },

  // SOM-003 — What Fails First
  {
    id: 'som-003',
    type: 'what-fails-first',
    topic: 'strength-of-materials',
    subtopic: 'Fatigue & Fracture',
    difficulty: 'advanced',
    question: 'A shaft carries a steady torque and a rotating bending load. It has a keyway, a fillet radius change, and a press-fit hub. What fails first?',
    components: [
      { id: 'a', text: 'The keyway corner — stress concentration from the sharp geometry' },
      { id: 'b', text: 'The fillet at the diameter transition' },
      { id: 'c', text: 'The press-fit hub edge — fretting fatigue at the interface' },
      { id: 'd', text: 'The shaft body midway between features' },
    ],
    correctAnswer: 'a',
    failureMode: 'Fatigue crack initiation at the keyway corner due to the severe stress concentration factor (Kt ~ 3-5), combined with the rotating bending creating fully reversed stress cycles.',
    failureChain: [
      'Microscopic crack initiates at the sharp keyway corner where stress is amplified 3-5x',
      'Each revolution of the shaft cycles the crack from tension to compression',
      'Crack grows slowly through the cross-section following Paris law',
      'Remaining ligament becomes too small to carry the load',
      'Sudden overload fracture of the remaining section — shaft snaps',
    ],
    explanation: 'Keyways are notorious fatigue failure sites. The sharp corner acts as a stress riser with Kt values of 3-5. Under rotating bending, every point on the shaft surface experiences fully reversed stress. The keyway corner sees 3-5x the nominal stress, making it the most likely initiation site.',
    interviewInsight: 'This tests whether you understand stress concentrations and fatigue in combination. It is a very common real-world failure mode — shaft failures at keyways are documented extensively.',
    realWorldConnection: 'This is why modern high-performance shafts use splines instead of keyways, and why good design specifies generous fillet radii at all diameter transitions.',
    commonMistake: 'Choosing the fillet (which is also a stress riser but typically has a lower Kt than a keyway) or the shaft body (which has the lowest stress).',
    tags: ['fatigue', 'keyway', 'stress-concentration', 'shaft', 'rotating-bending', 'failure'],
  },

  // SOM-004 — Multi-Select
  {
    id: 'som-004',
    type: 'multi-select',
    topic: 'strength-of-materials',
    subtopic: 'Failure Theories',
    difficulty: 'intermediate',
    question: 'Which of the following statements about Von Mises yield criterion are TRUE? (Select all that apply)',
    options: [
      { id: 'a', text: 'It predicts yielding based on distortion energy (shape change), ignoring volumetric strain' },
      { id: 'b', text: 'It is best suited for brittle materials like cast iron' },
      { id: 'c', text: 'Under pure shear, Von Mises predicts yield at a shear stress of σ_y / √3' },
      { id: 'd', text: 'It produces a circular yield surface in the deviatoric (pi) plane' },
      { id: 'e', text: 'It always gives a more conservative prediction than the Tresca criterion' },
    ],
    correctAnswers: ['a', 'c', 'd'],
    explanation: 'Von Mises is based on distortion energy theory — it says yielding occurs when the energy associated with shape distortion reaches a critical value. This correctly ignores hydrostatic stress (which changes volume but not shape). For pure shear, it predicts τ_y = σ_y/√3 ≈ 0.577σ_y. Its yield surface is a cylinder (circle in the pi-plane). It is NOT for brittle materials (use Mohr-Coulomb or max normal stress). Tresca is actually more conservative than Von Mises, not the other way around.',
    interviewInsight: 'Failure theories are asked in almost every structural/mechanical design interview. The interviewer wants to see you know WHEN to use which criterion — Von Mises for ductile, max normal stress for brittle.',
    commonMistake: 'Confusing Von Mises (ductile) with brittle failure criteria. Also, many candidates get the Tresca vs. Von Mises conservatism backwards — Tresca is the inscribed hexagon, so it is more conservative.',
    tags: ['von-mises', 'yield-criterion', 'distortion-energy', 'tresca', 'failure-theory'],
  },

  // SOM-005 — Scenario
  {
    id: 'som-005',
    type: 'scenario',
    topic: 'strength-of-materials',
    subtopic: 'Fatigue & Fracture',
    difficulty: 'advanced',
    question: 'A shaft in a production line keeps failing near a keyway after about 3 months of operation. Walk me through your investigation.',
    context: 'The shaft is made of 4140 steel, heat-treated to 30 HRC. It transmits 50 HP at 1750 RPM through a keyway to a gear. Failures show a flat, smooth fracture surface with beach marks emanating from the keyway corner.',
    steps: [
      {
        prompt: 'What does the fracture surface tell you?',
        idealResponse: 'The flat, smooth surface with beach marks is the classic signature of fatigue failure. Beach marks (also called clamshell marks) indicate intermittent crack growth, confirming cyclic loading. The crack initiated at the keyway corner, which is the highest stress concentration point.',
      },
      {
        prompt: 'What are the possible root causes?',
        idealResponse: 'Several factors: (1) The keyway corner has a high stress concentration factor (Kt ~ 3-4) that was likely not accounted for in the original design. (2) The shaft may have been undersized for the combined torsion + bending loads. (3) Surface finish at the keyway might be poor from broaching. (4) Possible misalignment creating unexpected bending loads. (5) The 30 HRC hardness may have a notch-sensitivity factor that amplifies the geometric Kt.',
      },
      {
        prompt: 'How would you fix it?',
        idealResponse: 'Short-term: add a generous fillet radius at the keyway corners (even 1-2 mm helps enormously), shot-peen the keyway area to introduce compressive residual stresses. Long-term: consider switching to a splined connection (lower Kt), increase shaft diameter, or use a higher-fatigue-strength material. Also verify alignment and check for any unexpected dynamic loads.',
      },
    ],
    keyTakeaway: 'Fatigue failures are predictable if you account for stress concentrations, surface finish, and actual loading conditions. The beach marks tell the full story of how the crack grew.',
    explanation: 'This is one of the most common real-world shaft failures. The combination of a keyway (stress riser) with rotating bending (fully reversed stress) creates a textbook fatigue scenario. The 3-month lifetime suggests the stress is well above the endurance limit but below the static strength.',
    interviewInsight: 'This scenario tests your ability to read a fracture surface, identify root causes systematically, and propose practical fixes — not just textbook solutions.',
    commonMistake: 'Immediately jumping to "make it bigger" without diagnosing the root cause. Also, not recognizing beach marks as a fatigue indicator.',
    tags: ['fatigue', 'fracture-analysis', 'keyway', 'beach-marks', 'shaft-failure', 'root-cause'],
  },

  // SOM-006 — Multiple Choice
  {
    id: 'som-006',
    type: 'multiple-choice',
    topic: 'strength-of-materials',
    subtopic: 'Buckling & Stability',
    difficulty: 'intermediate',
    question: 'A slender column is pinned at both ends. If you double its length while keeping everything else the same, what happens to the critical buckling load?',
    options: [
      { id: 'a', text: 'It drops to 1/2 of the original' },
      { id: 'b', text: 'It drops to 1/4 of the original' },
      { id: 'c', text: 'It drops to 1/8 of the original' },
      { id: 'd', text: 'It stays the same because the material strength has not changed' },
    ],
    correctAnswer: 'b',
    explanation: 'Euler\'s buckling load is P_cr = π²EI / (KL)². The critical load is inversely proportional to the square of the effective length. Double the length → P_cr drops by a factor of 4 (to 1/4). This is why long slender columns are so much weaker than short ones.',
    interviewInsight: 'This tests whether you know the Euler formula and understand its L² dependence. Interviewers often follow up by asking about the difference between pinned-pinned and fixed-free end conditions.',
    realWorldConnection: 'This is why long hydraulic cylinder rods, car antenna masts, and tall building columns must be carefully analyzed for buckling — length is the dominant variable.',
    commonMistake: 'Saying 1/2 (linear relationship) instead of 1/4 (squared relationship). The L² term is the critical insight.',
    tags: ['buckling', 'euler', 'column', 'critical-load', 'slenderness'],
  },

  // SOM-007 — Two Choice Tradeoff
  {
    id: 'som-007',
    type: 'two-choice-tradeoff',
    topic: 'strength-of-materials',
    subtopic: 'Beam Bending',
    difficulty: 'intermediate',
    question: 'You need to stiffen a deflecting beam. Should you increase the width or the height of a rectangular cross-section?',
    choices: [
      {
        id: 'a',
        text: 'Increase the width (horizontal dimension)',
        pros: ['Improves lateral stability', 'Less likely to cause interference in tight spaces', 'Easier to machine or fabricate in some cases'],
        cons: ['Moment of inertia scales linearly with width (I = bh³/12)', 'Less efficient use of material for stiffness', 'Adds more weight for the same stiffness gain'],
      },
      {
        id: 'b',
        text: 'Increase the height (vertical dimension)',
        pros: ['Moment of inertia scales with the CUBE of height', 'Much more material-efficient for reducing deflection', 'A small height increase gives a large stiffness increase'],
        cons: ['May cause clearance issues vertically', 'Taller beams are more susceptible to lateral-torsional buckling', 'May require lateral bracing'],
      },
    ],
    preferredAnswer: 'b',
    acceptableAnswer: 'either',
    justification: 'Increasing height is overwhelmingly more effective because I = bh³/12 — stiffness scales with the cube of height but only linearly with width. Doubling the height gives 8x the stiffness; doubling the width gives only 2x. However, you must check for lateral-torsional buckling if the beam becomes tall and narrow.',
    explanation: 'This is one of the most important intuitions in structural design. It explains why I-beams have tall, thin webs — the material is placed far from the neutral axis where it contributes most to stiffness and strength.',
    interviewInsight: 'Interviewers love this because it reveals whether you have genuine structural intuition. The h³ relationship should be instant recall for any mechanical engineer.',
    commonMistake: 'Thinking width and height contribute equally, or not knowing the cubic relationship of height to stiffness.',
    tags: ['beam', 'moment-of-inertia', 'stiffness', 'I-beam', 'deflection', 'design'],
  },

  // SOM-008 — Confidence Rated
  {
    id: 'som-008',
    type: 'confidence-rated',
    topic: 'strength-of-materials',
    subtopic: 'Stress & Strain',
    difficulty: 'beginner',
    question: 'What does Poisson\'s ratio describe?',
    options: [
      { id: 'a', text: 'The ratio of shear stress to shear strain' },
      { id: 'b', text: 'The ratio of lateral contraction to axial elongation when a material is pulled in tension' },
      { id: 'c', text: 'The ratio of ultimate stress to yield stress' },
      { id: 'd', text: 'The ratio of elastic modulus to shear modulus' },
    ],
    correctAnswer: 'b',
    confidenceLevels: ['Guessing', 'Somewhat sure', 'Very confident'],
    explanation: 'Poisson\'s ratio ν = -(lateral strain)/(axial strain). When you stretch a rubber band, it gets thinner — that thinning relative to the stretching is Poisson\'s ratio. Typical values: steel ~0.3, rubber ~0.5 (incompressible), cork ~0. It connects E, G, and K through the relationship G = E / 2(1+ν).',
    interviewInsight: 'Basic definition question, but confidence calibration matters. A candidate who is unsure about Poisson\'s ratio needs to review fundamentals. This is an early filter question.',
    commonMistake: 'Confusing Poisson\'s ratio with the shear modulus relationship (option d is related but not the definition).',
    tags: ['poissons-ratio', 'strain', 'material-properties', 'elasticity'],
  },

  // SOM-009 — Spot the Flaw
  {
    id: 'som-009',
    type: 'spot-the-flaw',
    topic: 'strength-of-materials',
    subtopic: 'Failure Theories',
    difficulty: 'advanced',
    question: 'Spot the flaw in this engineering analysis:',
    statement: 'A cast iron bracket is loaded in combined tension and torsion. Using the Von Mises criterion, the equivalent stress is calculated as 180 MPa. The cast iron has a yield strength of 250 MPa, giving a safety factor of 1.39. The design is acceptable.',
    flaw: {
      text: 'Using the Von Mises criterion for cast iron analysis.',
      flawIndex: 1,
      flawExplanation: 'Von Mises is a yield criterion for DUCTILE materials. Cast iron is BRITTLE — it fails by fracture, not yielding, and behaves differently in tension vs. compression. The correct approach is to use the Maximum Normal Stress theory (Rankine) or the Coulomb-Mohr theory, which accounts for the asymmetry between tensile and compressive strengths in brittle materials.',
    },
    correctedStatement: 'A cast iron bracket under combined tension and torsion should be analyzed using the Coulomb-Mohr or Modified Mohr criterion, which accounts for cast iron\'s much higher compressive strength than tensile strength. The Von Mises criterion is inappropriate for brittle materials.',
    explanation: 'Cast iron typically has compressive strength 3-4x its tensile strength. Von Mises treats tension and compression symmetrically, so it dangerously overestimates the safety factor for a brittle material loaded in tension. The Mohr-Coulomb criterion captures this asymmetry.',
    interviewInsight: 'This is a critical practical error. Using the wrong failure theory can lead to unsafe designs. Interviewers test this to ensure you can match the right analysis tool to the right material.',
    commonMistake: 'Applying Von Mises to everything because it is the most commonly taught criterion. Engineers must choose the failure theory based on material behavior (ductile vs. brittle).',
    tags: ['von-mises', 'cast-iron', 'brittle', 'failure-theory', 'coulomb-mohr'],
  },

  // SOM-010 — Multiple Choice
  {
    id: 'som-010',
    type: 'multiple-choice',
    topic: 'strength-of-materials',
    subtopic: 'Torsion',
    difficulty: 'intermediate',
    question: 'Two shafts transmit the same power at the same RPM. Shaft A is solid with diameter d. Shaft B is hollow with outer diameter d and inner diameter d/2. How do their maximum shear stresses compare?',
    options: [
      { id: 'a', text: 'Shaft B has about 7% higher stress than Shaft A' },
      { id: 'b', text: 'Both have the same stress because they have the same outer diameter' },
      { id: 'c', text: 'Shaft B has about 50% higher stress because half the material is missing' },
      { id: 'd', text: 'Shaft A has higher stress because it has more material resisting the torque' },
    ],
    correctAnswer: 'a',
    explanation: 'Shear stress τ = Tc/J, where c is the outer radius (same for both) and T is the same (same power and RPM). For the solid shaft, J_solid = πd⁴/32. For the hollow shaft, J_hollow = π(d⁴ - (d/2)⁴)/32 = π(d⁴ - d⁴/16)/32 = π(15d⁴/16)/32 = (15/16) × J_solid. So J_hollow = 0.9375 × J_solid. The hollow shaft stress is 1/0.9375 = 1.067 times the solid shaft stress — about 6.7% higher. Yet the hollow shaft is 25% lighter!',
    interviewInsight: 'This shows whether you can work with the torsion formula quantitatively. The key insight is that removing the inner core barely affects stress because material near the center contributes very little to torsional resistance.',
    realWorldConnection: 'This is exactly why drive shafts, bicycle frames, and aircraft structures use hollow tubes — you lose almost no strength but save significant weight.',
    commonMistake: 'Saying 50% higher stress because "half the diameter is removed" — but only 1/16 of the polar moment is lost because J scales with r⁴.',
    tags: ['torsion', 'hollow-shaft', 'polar-moment', 'weight-saving', 'shear-stress'],
  },
];
