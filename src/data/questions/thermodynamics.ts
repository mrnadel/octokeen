import type { Question } from '../types';

export const thermodynamicsQuestions: Question[] = [
  // THERMO-001 — Multiple Choice
  {
    id: 'thermo-001',
    type: 'multiple-choice',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'beginner',
    question: 'You leave the refrigerator door open in a sealed, insulated kitchen. After several hours, the kitchen temperature will:',
    options: [
      { id: 'a', text: 'Decrease, because the fridge is cooling the room' },
      { id: 'b', text: 'Stay the same, because the cooling and heating balance out' },
      { id: 'c', text: 'Increase, because the refrigerator motor adds net energy to the room' },
      { id: 'd', text: 'Decrease initially, then increase once the compressor overheats' },
    ],
    correctAnswer: 'c',
    explanation: 'A refrigerator is a heat pump that moves thermal energy from inside the fridge to the outside (the room) plus the work input from the compressor motor. With the door open, it cools air that immediately re-enters the fridge. Meanwhile, the compressor motor converts electrical energy to heat (Q_out = Q_in + W). The net effect is the work input being added as heat to the room. The room warms up.',
    interviewInsight: 'This is a classic first-law and second-law reasoning question. It tests whether you understand that a refrigerator is not a cold-generator — it is a heat mover with an energy cost.',
    realWorldConnection: 'This principle is why data center cooling is such a massive energy cost. Every watt of compute generates heat that must be moved, and the moving itself adds more heat.',
    commonMistake: 'Thinking the room cools down or stays the same. People forget about the compressor work input, which is always positive and always ends up as heat.',
    tags: ['first-law', 'refrigerator', 'heat-pump', 'COP', 'energy-balance'],
  },

  // THERMO-002 — Ranking
  {
    id: 'thermo-002',
    type: 'ranking',
    topic: 'thermodynamics',
    subtopic: 'Power & Refrigeration Cycles',
    difficulty: 'intermediate',
    question: 'Rank these power cycles by typical thermal efficiency (highest first) when operating between the same temperature limits:',
    items: [
      { id: 'a', text: 'Carnot cycle (theoretical ideal)' },
      { id: 'b', text: 'Combined gas-steam cycle (modern power plant)' },
      { id: 'c', text: 'Simple Rankine cycle (coal power plant)' },
      { id: 'd', text: 'Otto cycle (gasoline car engine)' },
      { id: 'e', text: 'Simple Brayton cycle (single gas turbine)' },
    ],
    correctOrder: ['a', 'b', 'd', 'e', 'c'],
    explanation: 'Carnot is always the theoretical max (~60-70% for typical limits). Combined cycle plants achieve 55-62% by cascading a gas turbine (Brayton) with a steam turbine (Rankine). The Otto cycle in modern engines reaches 25-35%. A simple Brayton (gas turbine) achieves 25-35%. A simple Rankine cycle typically achieves 30-40%, but when constrained to the same temperature limits as the others, its efficiency is limited by the saturation temperature of water.',
    interviewInsight: 'Knowing the relative efficiencies of real cycles shows practical knowledge. Interviewers want to see that you understand WHY combined cycle is better — it captures waste heat from one cycle to drive another.',
    realWorldConnection: 'Combined-cycle gas turbines (CCGT) have revolutionized power generation, achieving efficiencies above 60%. This is why many new power plants use this technology.',
    commonMistake: 'Putting Carnot last because "it is just theoretical." Also, not realizing that combined cycle can get remarkably close to Carnot efficiency for practical applications.',
    tags: ['thermal-efficiency', 'carnot', 'rankine', 'otto', 'brayton', 'combined-cycle'],
  },

  // THERMO-003 — Two Choice Tradeoff
  {
    id: 'thermo-003',
    type: 'two-choice-tradeoff',
    topic: 'thermodynamics',
    subtopic: 'Applied Thermodynamics',
    difficulty: 'intermediate',
    question: 'A building needs heating in winter. Should you use electric resistance heating or a heat pump?',
    choices: [
      {
        id: 'a',
        text: 'Electric resistance heater — converts electricity directly to heat',
        pros: ['Low upfront cost', 'Simple installation, no outdoor unit needed', 'Works at any outdoor temperature', '100% conversion efficiency (COP = 1)'],
        cons: ['Maximum COP is 1 — one unit of heat per unit of electricity', 'High operating costs', 'Purely converts high-grade energy (electricity) to low-grade energy (heat)'],
      },
      {
        id: 'b',
        text: 'Heat pump — moves heat from outdoors to indoors',
        pros: ['COP of 2.5-4.5 in moderate climates — 2.5 to 4.5 units of heat per unit of electricity', 'Much lower operating costs', 'Can reverse to provide cooling in summer', 'Lower carbon footprint per unit of heat'],
        cons: ['Higher upfront cost (2-3x more)', 'Performance degrades in very cold weather (COP drops below 2)', 'Requires outdoor unit and refrigerant lines', 'More complex maintenance'],
      },
    ],
    preferredAnswer: 'b',
    acceptableAnswer: 'either',
    justification: 'In most climates, a heat pump is far more efficient because it moves existing thermal energy rather than creating it from electricity. The COP advantage means 2.5-4.5x less electricity consumption. However, in extremely cold climates (below -15°C regularly), resistance heating or a dual-fuel system may be more practical.',
    explanation: 'A heat pump exploits the second law of thermodynamics: it takes low-grade ambient heat and "upgrades" it using work input. The total heat delivered is Q_cold + W, which is always greater than W alone. This is the thermodynamic reason heat pumps can have COP > 1 — they are not creating energy, they are moving it.',
    interviewInsight: 'This question tests whether you truly understand COP and the second law. The insight that a heat pump delivers more heat than the electricity it consumes is counterintuitive to many people.',
    commonMistake: 'Saying "nothing can be more than 100% efficient" and therefore doubting COP > 1. COP is not the same as thermodynamic efficiency — it is a ratio of useful heat to work input.',
    tags: ['heat-pump', 'COP', 'efficiency', 'HVAC', 'second-law', 'energy'],
  },

  // THERMO-004 — Free Text
  {
    id: 'thermo-004',
    type: 'free-text',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'intermediate',
    question: 'Explain entropy to a non-engineer in 60 seconds. Then explain why it matters for engineering design.',
    sampleAnswer: 'For a non-engineer: Entropy measures the "spreading out" of energy. Hot coffee cools down because its concentrated thermal energy spontaneously disperses into the surrounding air. Energy always spreads from concentrated to dispersed — that is the second law. You never see a cold coffee spontaneously get hot by pulling heat from the room, even though the first law (energy conservation) would allow it.\n\nFor engineering: Entropy tells us that every energy conversion wastes something. A car engine cannot convert all fuel energy to motion — some must become waste heat. Entropy sets the theoretical limit on efficiency for any thermal system (Carnot limit). It determines how much useful work we can extract, how to size heat rejection systems, and why perpetual motion machines are impossible.',
    keyPoints: [
      'Entropy measures energy dispersal / disorder',
      'Second law: entropy of an isolated system always increases',
      'Sets theoretical efficiency limits (Carnot)',
      'Every real process generates entropy — wasted potential for work',
      'Determines the direction of spontaneous processes',
    ],
    explanation: 'The ability to explain entropy simply is a hallmark of deep understanding. Engineers who can bridge technical concepts to plain language are more effective communicators and leaders.',
    interviewInsight: 'Communication skills matter as much as technical knowledge. If you can explain entropy clearly, you demonstrate mastery of the concept AND the ability to work with non-technical stakeholders.',
    commonMistake: 'Using the vague "disorder" analogy without connecting it to energy. Also, getting lost in mathematical definitions instead of building intuition first.',
    tags: ['entropy', 'second-law', 'communication', 'fundamentals', 'thermodynamics'],
  },

  // THERMO-005 — Multiple Choice
  {
    id: 'thermo-005',
    type: 'multiple-choice',
    topic: 'thermodynamics',
    subtopic: 'Properties & State',
    difficulty: 'beginner',
    question: 'Water boils at 100°C at sea level. On top of Mount Everest (atmospheric pressure ~34 kPa), it boils at roughly:',
    options: [
      { id: 'a', text: '100°C — boiling point is a material property that does not change' },
      { id: 'b', text: '70°C — lower pressure means lower boiling point' },
      { id: 'c', text: '120°C — lower pressure means water needs more energy to boil' },
      { id: 'd', text: '100°C — pressure only affects the freezing point, not the boiling point' },
    ],
    correctAnswer: 'b',
    explanation: 'Boiling occurs when the vapor pressure of the liquid equals the surrounding pressure. At lower atmospheric pressure, less energy (lower temperature) is needed for the vapor pressure to reach this threshold. At ~34 kPa (Everest summit), water boils at roughly 70°C. This is why pressure cookers work in reverse — high pressure raises the boiling point, cooking food faster.',
    interviewInsight: 'This tests understanding of phase behavior and the Clausius-Clapeyron relationship. It also connects to practical engineering: vacuum systems, pressure vessels, and boiler design.',
    realWorldConnection: 'This is why you cannot make a good cup of tea on Everest — the water is not hot enough when it boils. It is also why power plant condensers operate under vacuum, and why cavitation occurs in pumps.',
    commonMistake: 'Thinking boiling point is a fixed material constant. It depends on pressure — that is the entire basis of the steam tables.',
    tags: ['boiling-point', 'pressure', 'phase-change', 'vapor-pressure', 'altitude'],
  },

  // THERMO-006 — Estimation
  {
    id: 'thermo-006',
    type: 'estimation',
    topic: 'thermodynamics',
    subtopic: 'Applied Thermodynamics',
    difficulty: 'advanced',
    question: 'Estimate the thermal efficiency of a typical car engine and calculate how much fuel energy is wasted as heat per gallon of gasoline.',
    hints: [
      'A gallon of gasoline contains roughly 120 MJ (33.4 kWh) of chemical energy',
      'Think about the typical efficiency of a spark-ignition engine',
      'Consider where the waste heat goes: exhaust, coolant, radiation',
    ],
    acceptableRange: { low: 70, high: 100, unit: 'MJ wasted per gallon', bestEstimate: 84 },
    approachSteps: [
      'A typical gasoline car engine has a thermal efficiency of 25-30%. Take 30% as a reasonable modern estimate.',
      'Energy per gallon of gasoline ≈ 120 MJ',
      'Useful work = 0.30 × 120 = 36 MJ',
      'Wasted as heat = 120 - 36 = 84 MJ per gallon',
      'Breakdown: roughly 1/3 exhaust heat, 1/3 coolant heat, 1/3 useful work (with some to friction and accessories)',
      'At 30 mpg and 60 mph, this is about 168 MJ/hr ≈ 47 kW of waste heat — equivalent to 47 space heaters!',
    ],
    explanation: 'A car engine is fundamentally a heat engine limited by Carnot efficiency. With combustion temperatures around 2000K and exhaust at 800K, Carnot efficiency would be ~60%. Real engines achieve about half that due to irreversibilities, friction, and incomplete combustion.',
    interviewInsight: 'This question tests order-of-magnitude thinking and thermodynamic intuition. Showing the "equivalent space heaters" calculation demonstrates the ability to make abstract numbers tangible.',
    commonMistake: 'Overestimating engine efficiency (many people guess 50-60%). Modern gasoline engines are still only 25-35% efficient, which is why electrification is such a game-changer.',
    tags: ['efficiency', 'engine', 'waste-heat', 'estimation', 'gasoline', 'automotive'],
  },

  // THERMO-007 — Spot the Flaw
  {
    id: 'thermo-007',
    type: 'spot-the-flaw',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'intermediate',
    question: 'Spot the flaw in this claim about air conditioning:',
    statement: 'An air conditioner with a COP of 4 is 400% efficient, meaning it creates 4 times more cooling energy than the electrical energy it consumes. This violates conservation of energy but is allowed by the second law of thermodynamics.',
    flaw: {
      text: 'This violates conservation of energy but is allowed by the second law of thermodynamics.',
      flawIndex: 2,
      flawExplanation: 'A COP of 4 does NOT violate conservation of energy. The system absorbs Q_cold from the room and adds work W from the compressor, then rejects Q_hot = Q_cold + W to the outdoors. Energy is perfectly conserved. COP = Q_cold/W = 4 means the device moves 4 units of heat for every 1 unit of work, but it also rejects 5 units total outside. No energy is created.',
    },
    correctedStatement: 'An air conditioner with a COP of 4 moves 4 units of thermal energy from the cold space for every 1 unit of electrical work input. This is perfectly consistent with conservation of energy — the total heat rejected to the hot side equals Q_cold + W. COP is not "efficiency" in the thermodynamic sense, and no energy is created.',
    explanation: 'COP > 1 confuses many people into thinking energy is being created. The key insight is that the heat pump is MOVING existing thermal energy, not creating it. The work input is the "payment" to move heat from cold to hot, which would not happen spontaneously.',
    interviewInsight: 'This reveals whether you can think clearly about energy balances and distinguish between COP and thermodynamic efficiency. Many practicing engineers get confused by COP > 1.',
    commonMistake: 'Accepting the "violates conservation" claim or struggling to explain why COP > 1 is legitimate.',
    tags: ['COP', 'first-law', 'second-law', 'air-conditioning', 'energy-conservation'],
  },

  // THERMO-008 — Multi-Select
  {
    id: 'thermo-008',
    type: 'multi-select',
    topic: 'thermodynamics',
    subtopic: 'Power & Refrigeration Cycles',
    difficulty: 'advanced',
    question: 'Which of the following modifications to a simple Rankine cycle will INCREASE its thermal efficiency? (Select all that apply)',
    options: [
      { id: 'a', text: 'Superheating the steam beyond the saturation temperature before the turbine' },
      { id: 'b', text: 'Increasing the condenser pressure (higher heat rejection temperature)' },
      { id: 'c', text: 'Increasing the boiler pressure (higher average heat input temperature)' },
      { id: 'd', text: 'Adding a feedwater heater (regeneration) to preheat water entering the boiler' },
      { id: 'e', text: 'Adding a reheat stage between high-pressure and low-pressure turbines' },
    ],
    correctAnswers: ['a', 'c', 'd', 'e'],
    explanation: 'Raising the average temperature at which heat is added (superheating, higher boiler pressure, reheat) increases efficiency per the Carnot principle. Regeneration (feedwater heater) raises the average temperature of heat addition by using extracted steam to preheat feedwater. Increasing condenser pressure is WRONG — it raises the heat rejection temperature, which DECREASES efficiency. You want the condenser as cold (low pressure) as possible.',
    interviewInsight: 'This is a standard power engineering interview question. It tests whether you understand the link between the Carnot principle and practical cycle modifications.',
    commonMistake: 'Selecting option (b) — increasing condenser pressure. Higher rejection temperature hurts efficiency. Students sometimes confuse "higher pressure = better" as a blanket rule.',
    tags: ['rankine', 'superheat', 'reheat', 'regeneration', 'boiler-pressure', 'efficiency'],
  },
];
