import type { Question } from '../types';

export const heatTransferQuestions: Question[] = [
  // HT-001 — Ranking
  {
    id: 'ht-001',
    type: 'ranking',
    topic: 'heat-transfer',
    subtopic: 'Conduction',
    difficulty: 'intermediate',
    question: 'Rank these heat transfer mechanisms by importance in cooling a laptop computer (most important first):',
    items: [
      { id: 'a', text: 'Forced convection from the internal fan blowing air over heat sinks' },
      { id: 'b', text: 'Conduction from the CPU die through thermal paste to the heat spreader' },
      { id: 'c', text: 'Radiation from the laptop chassis to the surroundings' },
      { id: 'd', text: 'Natural convection from the bottom of the laptop to ambient air' },
    ],
    correctOrder: ['b', 'a', 'd', 'c'],
    explanation: 'The thermal bottleneck in a laptop is ALWAYS conduction — getting heat from the tiny CPU die to the heat spreader and then to the heat sink fins. If this path has high resistance (bad thermal paste, poor contact), no amount of fan airflow helps. After conduction establishes the path, forced convection from the fan carries the heat away. Natural convection contributes modestly through the chassis. Radiation is minimal because surface temperatures are low (~50-80°C) and surface areas are small.',
    interviewInsight: 'This tests whether you understand thermal resistance networks and can identify the bottleneck. Electronics cooling interviews always focus on the weakest link in the thermal path.',
    realWorldConnection: 'This is why thermal paste application matters so much — a tiny air gap at the die interface can be the dominant thermal resistance. It is also why heat pipes are used: they provide very low thermal resistance over the distance from CPU to the fan.',
    commonMistake: 'Putting the fan first. The fan matters, but if the conduction path to the heat sink is poor, the fan is just blowing air over a cold heat sink while the CPU overheats.',
    tags: ['laptop', 'thermal-management', 'conduction', 'convection', 'electronics-cooling'],
  },

  // HT-002 — Multiple Choice
  {
    id: 'ht-002',
    type: 'multiple-choice',
    topic: 'heat-transfer',
    subtopic: 'Convection',
    difficulty: 'beginner',
    question: 'Why does blowing on hot soup cool it down faster?',
    options: [
      { id: 'a', text: 'Your breath is cooler than the soup, so it cools by conduction' },
      { id: 'b', text: 'Blowing removes the hot, humid boundary layer above the soup, increasing both convective and evaporative heat transfer' },
      { id: 'c', text: 'The wind chill effect makes the soup "feel" cooler' },
      { id: 'd', text: 'Blowing increases the soup\'s emissivity, enhancing radiation' },
    ],
    correctAnswer: 'b',
    explanation: 'Hot soup creates a stagnant boundary layer of warm, humid air above its surface. This layer acts as an insulating blanket, limiting both convective heat transfer and evaporative cooling. Blowing strips this boundary layer away, replacing it with fresh, cooler, drier air. This increases the temperature gradient (driving convection) and the humidity gradient (driving evaporation). Evaporation is actually the dominant cooling mechanism for hot liquids.',
    interviewInsight: 'This tests understanding of boundary layers and their role in convection. It also shows whether you recognize evaporation as a heat transfer mechanism in everyday situations.',
    realWorldConnection: 'The same principle drives cooling tower design, where water is sprayed into an air stream to maximize evaporative cooling. It is also why fan-assisted heat sinks work — disrupting the boundary layer.',
    commonMistake: 'Saying it is just because your breath is cold. Room-temperature breath would still cool the soup because the boundary layer removal is the dominant effect.',
    tags: ['convection', 'boundary-layer', 'evaporation', 'everyday-physics', 'cooling'],
  },

  // HT-003 — Design Decision
  {
    id: 'ht-003',
    type: 'design-decision',
    topic: 'heat-transfer',
    subtopic: 'Heat Exchangers',
    difficulty: 'advanced',
    question: 'You need to design a heat exchanger to cool engine oil from 120°C to 80°C using 20°C water. Which configuration do you choose?',
    context: 'Space is limited (under a car hood). Oil flow rate is 2 L/min. Water is available from the engine coolant circuit at 20°C inlet. Oil is viscous and prone to fouling.',
    designOptions: [
      {
        id: 'a',
        text: 'Shell-and-tube with oil on the tube side',
        tradeoffs: 'Easy to clean tube side, but shell-side oil flow is poor. Large footprint.',
      },
      {
        id: 'b',
        text: 'Plate-and-frame heat exchanger',
        tradeoffs: 'Very compact, high effectiveness, easy to add plates. But narrow channels can clog with viscous oil, and gaskets may degrade with hot oil.',
      },
      {
        id: 'c',
        text: 'Shell-and-tube with oil on the shell side and baffles',
        tradeoffs: 'Baffles create turbulence in the viscous oil, improving heat transfer. Shell side is harder to clean but handles viscous fluids better than narrow plates.',
      },
      {
        id: 'd',
        text: 'Brazed-plate compact heat exchanger',
        tradeoffs: 'Extremely compact and efficient. But cannot be disassembled for cleaning — if oil fouls the channels, the entire unit must be replaced.',
      },
    ],
    bestOption: 'c',
    evaluationCriteria: ['Ability to handle viscous oil', 'Fouling resistance and cleanability', 'Compact size for under-hood installation', 'Heat transfer effectiveness with low oil-side Reynolds number'],
    explanation: 'Viscous oil on the shell side with baffles is the classic solution. The baffles create cross-flow turbulence that compensates for the oil\'s high viscosity and low Reynolds number. Tube-side water flows easily due to low viscosity. The shell side can be cleaned by removing the tube bundle. Plate exchangers would be ideal for size but risk clogging with viscous, potentially degraded oil.',
    interviewInsight: 'Heat exchanger selection is a very common design interview question. The interviewer wants to see that you consider the fluid properties (viscosity, fouling), not just the thermal duty.',
    commonMistake: 'Choosing a plate heat exchanger purely for compactness without considering that viscous oil will clog narrow plate channels.',
    tags: ['heat-exchanger', 'oil-cooler', 'shell-and-tube', 'viscosity', 'fouling', 'design'],
  },

  // HT-004 — Multiple Choice
  {
    id: 'ht-004',
    type: 'multiple-choice',
    topic: 'heat-transfer',
    subtopic: 'Conduction',
    difficulty: 'intermediate',
    question: 'A composite wall has three layers: brick (k=0.7 W/mK, 20 cm), insulation (k=0.04 W/mK, 5 cm), and plaster (k=0.5 W/mK, 2 cm). Which layer dominates the total thermal resistance?',
    options: [
      { id: 'a', text: 'Brick — it is the thickest layer' },
      { id: 'b', text: 'Insulation — it has the lowest thermal conductivity' },
      { id: 'c', text: 'Plaster — it is on the inside surface' },
      { id: 'd', text: 'All three contribute roughly equally' },
    ],
    correctAnswer: 'b',
    explanation: 'Thermal resistance R = L/(kA). Per unit area: R_brick = 0.20/0.7 = 0.286 K/W per m². R_insulation = 0.05/0.04 = 1.25 K/W per m². R_plaster = 0.02/0.5 = 0.04 K/W per m². The insulation layer has 80% of the total resistance despite being the thinnest layer. This is entirely because of its very low thermal conductivity.',
    interviewInsight: 'This is a fundamental thermal design question. It tests whether you can quickly identify the dominant resistance in a thermal circuit — a critical skill for any thermal design engineer.',
    realWorldConnection: 'Building insulation codes are written around this principle. Adding 5 cm of insulation to a brick wall reduces heat loss more than doubling the brick thickness.',
    commonMistake: 'Assuming the thickest layer has the highest resistance. Thickness matters, but conductivity matters more — a thin layer of insulation dominates a thick brick wall.',
    tags: ['conduction', 'thermal-resistance', 'insulation', 'composite-wall', 'building'],
  },

  // HT-005 — Scenario
  {
    id: 'ht-005',
    type: 'scenario',
    topic: 'heat-transfer',
    subtopic: 'Radiation',
    difficulty: 'advanced',
    question: 'A satellite in space needs to reject 500W of waste heat from its electronics. Design the thermal control approach.',
    context: 'The satellite orbits Earth and alternates between sunlight and shadow. Electronics must stay between 0°C and 50°C. There is no air for convection. Available surfaces: 2 m² total external area.',
    steps: [
      {
        prompt: 'What heat transfer mechanism is available in space?',
        idealResponse: 'Only radiation. There is no atmosphere for convection, and conduction only moves heat within the spacecraft structure. All heat must ultimately be radiated to space (background temperature ~3K) from external radiator surfaces.',
      },
      {
        prompt: 'Estimate the required radiator area and temperature.',
        idealResponse: 'Using Stefan-Boltzmann: Q = εσAT⁴. For 500W with ε ≈ 0.85 (white paint), σ = 5.67×10⁻⁸, solve for A at T = 300K (27°C): A = 500/(0.85 × 5.67e-8 × 300⁴) = 500/390 ≈ 1.28 m². So about 1.3 m² of radiator at 27°C average. This is feasible within the 2 m² available.',
      },
      {
        prompt: 'How do you handle the sun-shadow thermal cycling?',
        idealResponse: 'Use multi-layer insulation (MLI) blankets on sun-facing surfaces to minimize solar heat absorption. Radiators should face away from the sun and Earth. Use heat pipes to spread thermal loads evenly. Consider louvers or variable-conductance heat pipes that close in shadow to prevent over-cooling, and open in sunlight to maximize rejection.',
      },
    ],
    keyTakeaway: 'Space thermal design relies entirely on radiation. The fourth-power dependence of radiation on temperature means radiator area is very sensitive to operating temperature.',
    explanation: 'Spacecraft thermal control is a pure radiation problem. The key challenge is managing the cyclic solar input while maintaining steady electronics temperatures. This requires both passive (MLI, coatings) and active (heat pipes, louvers) thermal control.',
    interviewInsight: 'This scenario is common in aerospace interviews. It tests radiation fundamentals and the ability to design a complete thermal system, not just calculate a single mode of heat transfer.',
    commonMistake: 'Forgetting that radiation scales with T⁴, so a small temperature increase gives a large increase in rejection capability. Also, neglecting solar input on the radiator surface.',
    tags: ['radiation', 'satellite', 'space', 'thermal-control', 'stefan-boltzmann', 'MLI'],
  },

  // HT-006 — Confidence Rated
  {
    id: 'ht-006',
    type: 'confidence-rated',
    topic: 'heat-transfer',
    subtopic: 'Convection',
    difficulty: 'intermediate',
    question: 'What does the Nusselt number physically represent?',
    options: [
      { id: 'a', text: 'The ratio of buoyancy forces to viscous forces in natural convection' },
      { id: 'b', text: 'The ratio of convective heat transfer to conductive heat transfer across a fluid layer' },
      { id: 'c', text: 'The ratio of thermal diffusivity to momentum diffusivity' },
      { id: 'd', text: 'The ratio of heat capacity rate of the hot fluid to that of the cold fluid' },
    ],
    correctAnswer: 'b',
    confidenceLevels: ['Guessing', 'Somewhat sure', 'Very confident'],
    explanation: 'Nu = hL/k, where h is the convective coefficient, L is a characteristic length, and k is the fluid thermal conductivity. Physically, it tells you how much better convection is than pure conduction for moving heat across the fluid layer. Nu = 1 means convection offers no improvement over conduction (stagnant fluid). A turbulent pipe flow might have Nu = 100+, meaning convection is 100x more effective than conduction alone.',
    interviewInsight: 'Dimensionless numbers are interview staples. The interviewer wants the physical meaning, not just the formula. Option (a) is Grashof, (c) is the inverse of Prandtl, (d) is the capacity ratio used in NTU method.',
    commonMistake: 'Confusing Nusselt with other dimensionless numbers. Memorize the physical meaning, not just the formula — that is what sticks in interviews.',
    tags: ['nusselt', 'dimensionless-number', 'convection', 'conduction', 'heat-transfer-coefficient'],
  },
];
