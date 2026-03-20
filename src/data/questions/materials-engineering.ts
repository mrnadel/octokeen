import type { Question } from '../types';

export const materialsEngineeringQuestions: Question[] = [
  // MAT-001 — Material Selection
  {
    id: 'mat-001',
    type: 'material-selection',
    topic: 'materials-engineering',
    subtopic: 'Material Selection',
    difficulty: 'intermediate',
    question: 'You need to select a material for a bicycle frame that must be lightweight, stiff, and affordable for mass production. What do you choose?',
    requirements: [
      'High specific stiffness (E/ρ)',
      'Good fatigue resistance for cyclic loading from pedaling and road bumps',
      'Weldable or joinable for frame tube construction',
      'Cost-effective for production volumes of 50,000+ per year',
      'Corrosion resistance (exposed to rain and sweat)',
    ],
    candidates: [
      { id: 'a', name: '6061-T6 Aluminum', properties: 'E/ρ ≈ 25 GPa/(g/cm³), good fatigue life with proper design, TIG weldable, moderate cost, natural oxide layer for corrosion protection' },
      { id: 'b', name: 'Carbon Fiber Reinforced Polymer (CFRP)', properties: 'E/ρ ≈ 60+ GPa/(g/cm³), excellent fatigue in tension, requires specialized layup and molding, high cost, excellent corrosion resistance' },
      { id: 'c', name: '4130 Chromoly Steel', properties: 'E/ρ ≈ 26 GPa/(g/cm³), excellent fatigue life, easily TIG welded, low material cost but heavier, requires paint/coating for corrosion' },
      { id: 'd', name: 'Ti-6Al-4V Titanium', properties: 'E/ρ ≈ 25 GPa/(g/cm³), superb fatigue life and corrosion resistance, difficult and expensive to weld, very high cost' },
    ],
    bestChoice: 'a',
    selectionReasoning: 'For mass production at 50k+ units, 6061-T6 aluminum provides the best balance. Its specific stiffness is competitive with steel and titanium, it is easily TIG welded into frame tubes using hydroformed or butted tubing, and the cost is reasonable at scale. CFRP would be lighter but is 3-5x more expensive and requires more labor-intensive manufacturing. Steel is heavier. Titanium is cost-prohibitive for this volume.',
    explanation: 'Material selection is always a multi-objective optimization. The "best" material depends on the constraints — change the volume to 100 units (custom bikes) and titanium or CFRP becomes viable. Change the budget to premium and CFRP wins.',
    interviewInsight: 'Material selection questions test your ability to balance competing requirements. There is no universally correct answer — the interviewer wants to see your reasoning process and awareness of tradeoffs.',
    realWorldConnection: 'This is why the majority of mid-range bicycles use 6061-T6 aluminum. Only high-end bikes use CFRP, and boutique/custom bikes use titanium or steel.',
    commonMistake: 'Choosing CFRP because it is the "best" material without considering the cost constraint. Also, not recognizing that specific stiffness (E/ρ) is more relevant than absolute stiffness for a weight-limited application.',
    tags: ['material-selection', 'aluminum', 'bicycle', 'specific-stiffness', 'manufacturing'],
  },

  // MAT-002 — Multiple Choice
  {
    id: 'mat-002',
    type: 'multiple-choice',
    topic: 'materials-engineering',
    subtopic: 'Metals & Alloys',
    difficulty: 'beginner',
    question: 'What happens when you heat-treat 1045 carbon steel by quenching it in oil from 850°C?',
    options: [
      { id: 'a', text: 'It becomes softer and more ductile (annealing)' },
      { id: 'b', text: 'It transforms to martensite — hard, brittle, and strong' },
      { id: 'c', text: 'Nothing happens — 1045 steel cannot be heat treated' },
      { id: 'd', text: 'It becomes magnetic but does not change mechanical properties' },
    ],
    correctAnswer: 'b',
    explanation: 'At 850°C, the steel is fully austenitic (FCC crystal structure). Rapid quenching in oil prevents the equilibrium transformation to ferrite + pearlite. Instead, the austenite transforms to martensite (BCT structure) — a very hard, strong, but brittle phase. The carbon atoms are trapped in the distorted lattice, creating internal stress that makes the material hard. Tempering afterward restores some ductility.',
    interviewInsight: 'Heat treatment is one of the most commonly asked materials topics. Interviewers want to see that you understand the austenite-martensite transformation and its effects on properties.',
    realWorldConnection: 'This is how tools, springs, and gears are hardened. A blacksmith quenching a blade in oil is performing exactly this transformation. The subsequent tempering step (reheating to 200-600°C) controls the final hardness-toughness balance.',
    commonMistake: 'Confusing quenching (makes hard/brittle) with annealing (slow cool, makes soft/ductile). Also, not knowing that carbon content determines hardenability — pure iron cannot form martensite.',
    tags: ['heat-treatment', 'martensite', 'quenching', 'steel', 'phase-transformation'],
  },

  // MAT-003 — Scenario
  {
    id: 'mat-003',
    type: 'scenario',
    topic: 'materials-engineering',
    subtopic: 'Corrosion & Degradation',
    difficulty: 'advanced',
    question: 'You need to join two dissimilar metals in a corrosive marine environment. Walk through your options.',
    context: 'A stainless steel fitting must connect to an aluminum structural member on a boat. The joint will be exposed to saltwater spray. It must carry moderate structural loads.',
    steps: [
      {
        prompt: 'What is the primary concern with this joint?',
        idealResponse: 'Galvanic corrosion. Stainless steel and aluminum are far apart on the galvanic series — stainless steel is noble (cathodic) and aluminum is active (anodic). In saltwater (an excellent electrolyte), the aluminum will corrode preferentially and rapidly at the joint interface.',
      },
      {
        prompt: 'How would you mitigate the galvanic corrosion?',
        idealResponse: 'Several strategies: (1) Electrically isolate the metals using non-conductive bushings, washers, and sealant at the joint. Nylon or PTFE isolation kits are standard. (2) Apply a barrier coating or sealant (marine epoxy) to prevent electrolyte contact. (3) Use a sacrificial anode (zinc) nearby to protect the aluminum. (4) Consider a transition joint — a bimetallic strip that is friction-welded with aluminum on one side and stainless on the other.',
      },
      {
        prompt: 'Which joining method would you use for the structural connection?',
        idealResponse: 'Mechanical fastening with isolation is the most practical: stainless steel bolts with nylon insulating sleeves and washers to prevent metal-to-metal contact. Apply a polysulfide or silicone marine sealant in the joint to block water ingress. Avoid welding or brazing dissimilar metals — the intermetallic compounds are brittle, and the thermal cycle creates residual stresses that accelerate corrosion.',
      },
    ],
    keyTakeaway: 'Dissimilar metal joints in corrosive environments require electrical isolation, barrier coatings, or sacrificial protection. The galvanic series and the electrolyte aggressiveness determine the severity.',
    explanation: 'Galvanic corrosion is one of the most common failure modes in marine, automotive, and aerospace applications where mixed materials are unavoidable. The severity depends on the potential difference between the metals, the electrolyte conductivity, and the cathode-to-anode area ratio.',
    interviewInsight: 'This scenario tests corrosion knowledge AND practical problem-solving. The interviewer wants to see that you can identify the mechanism, quantify the risk (galvanic series), and propose multiple mitigation strategies.',
    commonMistake: 'Not considering galvanic corrosion at all when joining dissimilar metals. Also, suggesting welding — you generally cannot weld aluminum to stainless steel conventionally.',
    tags: ['galvanic-corrosion', 'dissimilar-metals', 'marine', 'isolation', 'joining'],
  },

  // MAT-004 — Multiple Choice
  {
    id: 'mat-004',
    type: 'multiple-choice',
    topic: 'materials-engineering',
    subtopic: 'Polymers & Elastomers',
    difficulty: 'intermediate',
    question: 'You are selecting a plastic for a snap-fit housing that must survive repeated assembly/disassembly. Which polymer is the WORST choice?',
    options: [
      { id: 'a', text: 'ABS — good toughness, moderate creep resistance' },
      { id: 'b', text: 'Polycarbonate — excellent impact strength and elastic recovery' },
      { id: 'c', text: 'Polystyrene (unfilled) — stiff but very brittle' },
      { id: 'd', text: 'Nylon 6/6 — tough, high fatigue resistance, good snap-fit performance' },
    ],
    correctAnswer: 'c',
    explanation: 'Polystyrene is stiff but extremely brittle — it has very low elongation at break (~1-2%). Snap-fits require the material to flex repeatedly without cracking, demanding good fatigue life and strain recovery. PS snap-fits will crack on the first or second deflection cycle. ABS, polycarbonate, and nylon all have much better toughness and strain tolerance for this application.',
    interviewInsight: 'This tests practical polymer selection. Snap-fits are everywhere in consumer products, automotive interiors, and electronics housings. Knowing which plastics can handle repeated flexing is essential.',
    realWorldConnection: 'This is why battery covers, phone cases, and LEGO bricks are made from ABS or nylon — not polystyrene. LEGO specifically uses ABS for its excellent snap-fit properties.',
    commonMistake: 'Choosing based on stiffness alone. Polystyrene is stiff, which seems good for a snap-fit, but stiffness without toughness means brittle fracture.',
    tags: ['polymer', 'snap-fit', 'polystyrene', 'ABS', 'toughness', 'brittle'],
  },

  // MAT-005 — Ranking
  {
    id: 'mat-005',
    type: 'ranking',
    topic: 'materials-engineering',
    subtopic: 'Metals & Alloys',
    difficulty: 'intermediate',
    question: 'Rank these materials by thermal conductivity (highest first):',
    items: [
      { id: 'a', text: 'Copper (pure)' },
      { id: 'b', text: 'Aluminum 6061' },
      { id: 'c', text: 'Stainless steel 304' },
      { id: 'd', text: 'Titanium Ti-6Al-4V' },
      { id: 'e', text: 'Diamond' },
    ],
    correctOrder: ['e', 'a', 'b', 'c', 'd'],
    explanation: 'Diamond: ~2000 W/mK (phonon conduction in perfect lattice). Copper: ~400 W/mK. Aluminum 6061: ~170 W/mK. Stainless steel 304: ~16 W/mK. Titanium Ti-6Al-4V: ~6.7 W/mK. The surprise is that stainless steel, despite being commonly described as a "poor thermal conductor," is still about 2.5x better than titanium alloy.',
    interviewInsight: 'Knowing the relative thermal conductivities of common engineering materials is expected. The titanium vs. stainless steel comparison surprises many candidates.',
    realWorldConnection: 'This is why copper is used for heat sinks, aluminum for cookware, and why titanium exhaust manifolds glow red hot — titanium\'s terrible thermal conductivity traps heat.',
    commonMistake: 'Putting stainless steel last because it is commonly described as having "poor" thermal conductivity. Titanium alloys are actually worse.',
    tags: ['thermal-conductivity', 'copper', 'aluminum', 'titanium', 'stainless', 'diamond'],
  },

  // MAT-006 — Two Choice Tradeoff
  {
    id: 'mat-006',
    type: 'two-choice-tradeoff',
    topic: 'materials-engineering',
    subtopic: 'Composites',
    difficulty: 'advanced',
    question: 'You are designing a pressure vessel for a natural gas vehicle. Carbon fiber composite or steel?',
    choices: [
      {
        id: 'a',
        text: 'Carbon fiber composite (Type IV: plastic liner + full carbon wrap)',
        pros: ['70% lighter than steel for same burst pressure', 'No corrosion from internal moisture or external environment', 'Higher specific strength allows thinner walls', 'Can store gas at higher pressures (700 bar for hydrogen)'],
        cons: ['5-10x higher manufacturing cost', 'Damage tolerance is poor — impact can create invisible delamination', 'Limited design life (15-25 years) due to stress rupture and fatigue', 'Inspection is complex — requires specialized NDT'],
      },
      {
        id: 'b',
        text: 'Steel (e.g., 4130 or 34CrMo4)',
        pros: ['Mature, well-understood technology', 'Excellent damage tolerance — dents before failing', 'Easy to inspect (visual, UT)', 'Lower cost, longer service life (30+ years)', 'Recyclable'],
        cons: ['Heavy — dominates vehicle weight penalty', 'Susceptible to corrosion if coating is damaged', 'Lower maximum working pressure for same weight', 'Internal surface can hydrogen-embrittle with certain gases'],
      },
    ],
    preferredAnswer: 'a',
    acceptableAnswer: 'either',
    justification: 'For a vehicle application where weight directly affects range and fuel economy, the carbon composite vessel is preferred despite higher cost. The 70% weight savings translates to significant range improvement. However, the design must account for impact damage vulnerability and the limited design life. Steel is better for stationary storage where weight is irrelevant.',
    explanation: 'This tradeoff appears in real CNG and hydrogen vehicle design. The industry is moving toward Type IV (all-composite) tanks for on-vehicle storage, while using steel Type I tanks for ground storage. Context determines the right answer.',
    interviewInsight: 'The interviewer wants to see that you understand the weight vs. cost vs. safety tradeoff and can tailor the recommendation to the application context.',
    commonMistake: 'Choosing steel because it is "safer" without considering that the weight penalty reduces vehicle range, which may be the critical design driver. Also, not knowing the Type I-IV classification of pressure vessels.',
    tags: ['composite', 'pressure-vessel', 'carbon-fiber', 'steel', 'CNG', 'hydrogen', 'weight'],
  },

  // MAT-007 — Confidence Rated
  {
    id: 'mat-007',
    type: 'confidence-rated',
    topic: 'materials-engineering',
    subtopic: 'Metals & Alloys',
    difficulty: 'beginner',
    question: 'What is the difference between hardness and toughness?',
    options: [
      { id: 'a', text: 'They are the same thing — harder materials are also tougher' },
      { id: 'b', text: 'Hardness is resistance to indentation/scratching; toughness is the total energy a material can absorb before fracture' },
      { id: 'c', text: 'Hardness measures tensile strength; toughness measures compressive strength' },
      { id: 'd', text: 'Toughness is the elastic modulus; hardness is the yield strength' },
    ],
    correctAnswer: 'b',
    confidenceLevels: ['Guessing', 'Somewhat sure', 'Very confident'],
    explanation: 'Hardness measures resistance to localized plastic deformation (indentation or scratching). Toughness is the area under the entire stress-strain curve — the total energy per unit volume a material can absorb before fracturing. They are often inversely correlated: glass is hard but not tough (shatters easily); rubber is tough but not hard. Hardened tool steel can be hard AND tough if properly tempered.',
    interviewInsight: 'This is a definitional question that candidates either know cold or confuse badly. It is often asked early in an interview to gauge fundamental materials literacy.',
    commonMistake: 'Thinking harder = tougher. A very hard material (like hardened, untempered martensite) can be extremely brittle and shatter easily — low toughness despite high hardness.',
    tags: ['hardness', 'toughness', 'material-properties', 'stress-strain', 'fundamentals'],
  },

  // MAT-008 — Material Selection
  {
    id: 'mat-008',
    type: 'material-selection',
    topic: 'materials-engineering',
    subtopic: 'Material Selection',
    difficulty: 'advanced',
    question: 'Select a material for a surgical implant (hip joint femoral head) that must survive 30+ years inside the human body.',
    requirements: [
      'Biocompatible — no toxic ion release, no immune response',
      'Extremely wear-resistant — millions of load cycles against a polymer or ceramic liner',
      'Corrosion-resistant in saline body fluid environment',
      'High fatigue strength for cyclic loading from walking (2 million cycles/year)',
      'Radiologically compatible — visible on X-ray for imaging',
    ],
    candidates: [
      { id: 'a', name: 'CoCrMo alloy (Cobalt-Chrome)', properties: 'Excellent wear resistance, proven biocompatibility, high fatigue strength, good corrosion resistance, high hardness (35 HRC), visible on X-ray' },
      { id: 'b', name: '316L Stainless Steel', properties: 'Good corrosion resistance, moderate wear resistance, cheaper than CoCr, but nickel content can cause allergic reaction, lower hardness' },
      { id: 'c', name: 'Ti-6Al-4V Titanium', properties: 'Excellent biocompatibility, lowest elastic modulus (reduces stress shielding), superb corrosion resistance, but poor wear resistance for articulating surfaces' },
      { id: 'd', name: 'Alumina Ceramic (Al2O3)', properties: 'Extremely hard and wear-resistant, inert and biocompatible, but brittle — risk of catastrophic fracture, difficult to manufacture precisely' },
    ],
    bestChoice: 'a',
    selectionReasoning: 'CoCrMo is the gold standard for hip femoral heads. Its combination of hardness, wear resistance, and corrosion resistance in body fluid is unmatched among metals. Ti-6Al-4V is excellent for stems (where low modulus reduces stress shielding) but terrible for articulating surfaces due to poor wear resistance. 316L SS has fallen out of favor due to nickel sensitivity concerns. Ceramic is an alternative for the femoral head but carries a small risk of catastrophic fracture.',
    explanation: 'Medical implant material selection is one of the most demanding applications in engineering. The material must survive a harsh chemical environment under millions of load cycles while producing no harmful biological response. Modern hip implants often use a CoCr femoral head on a Ti stem — each material optimized for its role.',
    interviewInsight: 'This is asked in biomedical engineering interviews but also in general materials science roles. It demonstrates that you can apply material selection principles to a highly constrained, life-critical application.',
    commonMistake: 'Choosing titanium for the femoral head. Titanium is great for implant stems but terrible for bearing surfaces — its oxide layer wears off and the released titanium debris causes tissue inflammation.',
    tags: ['biocompatible', 'implant', 'CoCr', 'titanium', 'wear', 'corrosion', 'medical'],
  },
];
