import type { Question } from '../types';

export const thermodynamicsQuestions: Question[] = [
  // THERMO-001 — Multiple Choice
  {
    id: 'thermo-001',
    type: 'multiple-choice',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'beginner',
    question: 'Fridge door left open in a sealed, insulated kitchen. After hours, temperature will:',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Insulated kitchen boundary -->
      <rect x="20" y="20" width="360" height="260" rx="6" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8,4"/>
      <text x="200" y="16" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Sealed, Insulated Kitchen</text>
      <!-- Refrigerator body -->
      <rect x="50" y="60" width="120" height="180" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <text x="110" y="55" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">Refrigerator</text>
      <!-- Open door -->
      <line x1="170" y1="60" x2="200" y2="80" stroke="#94a3b8" stroke-width="2"/>
      <line x1="170" y1="240" x2="200" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <line x1="200" y1="80" x2="200" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <text x="195" y="155" text-anchor="start" fill="#34d399" font-family="system-ui, sans-serif" font-size="10" transform="rotate(90,195,155)">OPEN</text>
      <!-- Cold air inside fridge -->
      <text x="110" y="130" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">Q_in</text>
      <text x="110" y="150" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="11">(cold side)</text>
      <!-- Compressor at bottom -->
      <rect x="65" y="200" width="90" height="30" rx="3" fill="#334155" stroke="#fb923c" stroke-width="2"/>
      <text x="110" y="220" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="11">Compressor</text>
      <!-- Work input arrow -->
      <defs>
        <marker id="thermo001-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
        <marker id="thermo001-arrow-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker>
        <marker id="thermo001-arrow-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#60a5fa"/></marker>
      </defs>
      <!-- W_in from wall plug -->
      <line x1="30" y1="215" x2="60" y2="215" stroke="#34d399" stroke-width="2" marker-end="url(#thermo001-arrow)"/>
      <text x="30" y="208" fill="#34d399" font-family="system-ui, sans-serif" font-size="11">W_in</text>
      <!-- Q_hot output to room (wavy arrow) -->
      <path d="M170,100 Q185,95 195,100 Q205,105 215,100 Q225,95 240,100" fill="none" stroke="#f472b6" stroke-width="2" marker-end="url(#thermo001-arrow-red)"/>
      <path d="M170,120 Q185,115 195,120 Q205,125 215,120 Q225,115 240,120" fill="none" stroke="#f472b6" stroke-width="2" marker-end="url(#thermo001-arrow-red)"/>
      <text x="260" y="105" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12">Q_out = Q_in + W</text>
      <text x="260" y="125" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11">(heats the room)</text>
      <!-- Room temperature indicator -->
      <text x="300" y="200" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">T_room &#x2191;</text>
      <text x="300" y="220" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Net heat added</text>
      <text x="300" y="235" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">= W_compressor</text>
      <!-- Energy balance box -->
      <rect x="240" y="250" width="130" height="22" rx="3" fill="none" stroke="#60a5fa" stroke-width="1"/>
      <text x="305" y="265" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">1st Law: Energy in = Energy out</text>
    </svg>`,
    options: [
      { id: 'a', text: 'Decrease, because the fridge is cooling the room' },
      { id: 'b', text: 'Stay the same, because the cooling and heating balance out' },
      { id: 'c', text: 'Increase, because the refrigerator motor adds net energy to the room' },
      { id: 'd', text: 'Decrease initially, then increase once the compressor overheats' },
    ],
    correctAnswer: 'c',
    explanation: 'The fridge moves heat from inside to outside plus compressor work (Q_out = Q_in + W). Net effect: compressor work is added as heat to the room. Room warms up.',
    interviewInsight: 'Tests first-law reasoning: a fridge is a heat mover with an energy cost, not a cold-generator.',
    realWorldConnection: 'Why data center cooling is a massive energy cost — moving heat adds more heat.',
    commonMistake: 'Forgetting the compressor work input, which always ends up as heat.',
    tags: ['first-law', 'refrigerator', 'heat-pump', 'COP', 'energy-balance'],
  },

  // THERMO-002 — Ranking
  {
    id: 'thermo-002',
    type: 'ranking',
    topic: 'thermodynamics',
    subtopic: 'Power & Refrigeration Cycles',
    difficulty: 'intermediate',
    question: 'Rank by thermal efficiency (highest first), same temperature limits:',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo002-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#94a3b8"/></marker>
      </defs>
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Typical Thermal Efficiency Comparison</text>
      <!-- Y-axis -->
      <line x1="55" y1="35" x2="55" y2="260" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#thermo002-arrow)"/>
      <text x="18" y="150" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" transform="rotate(-90,18,150)">Thermal Efficiency (%)</text>
      <!-- Y-axis ticks -->
      <line x1="50" y1="248" x2="55" y2="248" stroke="#94a3b8" stroke-width="1"/>
      <text x="45" y="252" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">0</text>
      <line x1="50" y1="212" x2="55" y2="212" stroke="#94a3b8" stroke-width="1"/>
      <text x="45" y="216" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">20</text>
      <line x1="50" y1="176" x2="55" y2="176" stroke="#94a3b8" stroke-width="1"/>
      <text x="45" y="180" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">40</text>
      <line x1="50" y1="140" x2="55" y2="140" stroke="#94a3b8" stroke-width="1"/>
      <text x="45" y="144" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">60</text>
      <line x1="50" y1="104" x2="55" y2="104" stroke="#94a3b8" stroke-width="1"/>
      <text x="45" y="108" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">80</text>
      <!-- X-axis -->
      <line x1="55" y1="248" x2="385" y2="248" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Bars: Carnot ~65% -->
      <rect x="70" y="131" width="50" height="117" rx="2" fill="#60a5fa" opacity="0.8"/>
      <text x="95" y="126" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~65%</text>
      <text x="95" y="268" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Carnot</text>
      <text x="95" y="279" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">(ideal)</text>
      <!-- Combined cycle ~60% -->
      <rect x="135" y="140" width="50" height="108" rx="2" fill="#34d399" opacity="0.8"/>
      <text x="160" y="135" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~60%</text>
      <text x="160" y="268" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Combined</text>
      <text x="160" y="279" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">(gas+steam)</text>
      <!-- Otto ~30% -->
      <rect x="200" y="194" width="50" height="54" rx="2" fill="#f472b6" opacity="0.8"/>
      <text x="225" y="189" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~30%</text>
      <text x="225" y="268" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Otto</text>
      <text x="225" y="279" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">(gasoline)</text>
      <!-- Brayton ~28% -->
      <rect x="265" y="198" width="50" height="50" rx="2" fill="#fb923c" opacity="0.8"/>
      <text x="290" y="193" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~28%</text>
      <text x="290" y="268" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Brayton</text>
      <text x="290" y="279" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">(gas turb.)</text>
      <!-- Rankine ~35% -->
      <rect x="330" y="185" width="50" height="63" rx="2" fill="#f472b6" opacity="0.8"/>
      <text x="355" y="180" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~35%</text>
      <text x="355" y="268" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Rankine</text>
      <text x="355" y="279" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">(steam)</text>
      <!-- Temperature limits label -->
      <text x="220" y="295" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9" font-style="italic">Same T_hot and T_cold limits for all cycles</text>
    </svg>`,
    items: [
      { id: 'a', text: 'Carnot cycle (theoretical ideal)' },
      { id: 'b', text: 'Combined gas-steam cycle (modern power plant)' },
      { id: 'c', text: 'Simple Rankine cycle (coal power plant)' },
      { id: 'd', text: 'Otto cycle (gasoline car engine)' },
      { id: 'e', text: 'Simple Brayton cycle (single gas turbine)' },
    ],
    correctOrder: ['a', 'b', 'd', 'e', 'c'],
    explanation: 'Carnot is theoretical max. Combined cycle cascades gas + steam turbines for 55-62%. Otto 25-35%, Brayton 25-35%, Rankine 30-40% but limited by water saturation temperature.',
    interviewInsight: 'Shows practical knowledge of why combined cycle works — captures waste heat from one cycle to drive another.',
    realWorldConnection: 'CCGT plants achieve >60% efficiency, revolutionizing power generation.',
    commonMistake: 'Putting Carnot last as "just theoretical." Combined cycle gets remarkably close to Carnot.',
    tags: ['thermal-efficiency', 'carnot', 'rankine', 'otto', 'brayton', 'combined-cycle'],
  },

  // THERMO-003 — Two Choice Tradeoff
  {
    id: 'thermo-003',
    type: 'two-choice-tradeoff',
    topic: 'thermodynamics',
    subtopic: 'Applied Thermodynamics',
    difficulty: 'intermediate',
    question: 'Winter heating: electric resistance heater or heat pump?',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo003-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
        <marker id="thermo003-arr-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker>
        <marker id="thermo003-arr-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#60a5fa"/></marker>
      </defs>
      <text x="200" y="16" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Energy Flow Comparison</text>
      <!-- Left side: Resistance Heater -->
      <text x="100" y="38" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Resistance Heater</text>
      <rect x="45" y="100" width="110" height="50" rx="4" fill="#334155" stroke="#f472b6" stroke-width="2"/>
      <text x="100" y="122" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Resistance</text>
      <text x="100" y="138" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Heater</text>
      <!-- W_in arrow -->
      <line x1="100" y1="55" x2="100" y2="95" stroke="#34d399" stroke-width="2" marker-end="url(#thermo003-arr)"/>
      <text x="125" y="75" fill="#34d399" font-family="system-ui, sans-serif" font-size="11">W = 1 kW</text>
      <!-- Q_out arrow -->
      <line x1="100" y1="155" x2="100" y2="195" stroke="#f472b6" stroke-width="2" marker-end="url(#thermo003-arr-red)"/>
      <text x="125" y="182" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11">Q = 1 kW</text>
      <!-- Room -->
      <rect x="55" y="200" width="90" height="35" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="100" y="222" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Room</text>
      <!-- COP label -->
      <text x="100" y="255" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">COP = 1</text>
      <!-- Right side: Heat Pump -->
      <text x="300" y="38" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Heat Pump</text>
      <rect x="245" y="100" width="110" height="50" rx="4" fill="#334155" stroke="#60a5fa" stroke-width="2"/>
      <text x="300" y="122" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Heat</text>
      <text x="300" y="138" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Pump</text>
      <!-- W_in arrow -->
      <line x1="300" y1="55" x2="300" y2="95" stroke="#34d399" stroke-width="2" marker-end="url(#thermo003-arr)"/>
      <text x="325" y="75" fill="#34d399" font-family="system-ui, sans-serif" font-size="11">W = 1 kW</text>
      <!-- Q_cold from outside -->
      <line x1="225" y1="125" x2="242" y2="125" stroke="#60a5fa" stroke-width="2" marker-end="url(#thermo003-arr-blue)"/>
      <text x="210" y="115" text-anchor="end" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">Q_cold</text>
      <text x="210" y="128" text-anchor="end" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">2.5 kW</text>
      <text x="210" y="141" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">(from outdoors)</text>
      <!-- Q_hot output to room -->
      <line x1="300" y1="155" x2="300" y2="195" stroke="#f472b6" stroke-width="3" marker-end="url(#thermo003-arr-red)"/>
      <text x="335" y="182" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Q = 3.5 kW</text>
      <!-- Room -->
      <rect x="255" y="200" width="90" height="35" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="300" y="222" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Room</text>
      <!-- COP label -->
      <text x="300" y="255" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">COP = 3.5</text>
      <!-- Divider -->
      <line x1="200" y1="30" x2="200" y2="270" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,4"/>
      <!-- Bottom comparison -->
      <text x="200" y="285" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11">Same 1 kW electricity input &#x2192; 3.5x more heat with heat pump</text>
    </svg>`,
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
    explanation: 'Heat pump moves ambient heat using work input. Total heat = Q_cold + W > W. COP > 1 because it moves energy, not creates it.',
    interviewInsight: 'Tests understanding of COP and second law. Heat pump delivering more heat than electricity consumed is counterintuitive.',
    commonMistake: 'Doubting COP > 1. COP is not thermodynamic efficiency — it is useful heat / work input.',
    tags: ['heat-pump', 'COP', 'efficiency', 'HVAC', 'second-law', 'energy'],
  },

  // THERMO-004 — Free Text
  {
    id: 'thermo-004',
    type: 'multiple-choice',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'intermediate',
    question: 'Which statement best describes why entropy matters for engineering design?',
    options: [
      { id: 'a', text: 'Entropy determines the mass flow rate required in any thermodynamic cycle' },
      { id: 'b', text: 'Entropy sets the theoretical maximum efficiency of heat engines (Carnot limit) — every real process generates entropy, meaning some energy is always unavailable for useful work' },
      { id: 'c', text: 'Entropy only applies to closed systems and has no practical impact on open engineering systems' },
      { id: 'd', text: 'Entropy measures the total internal energy of a system and determines its temperature' },
    ],
    correctAnswer: 'b',
    diagram: `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Entropy: Energy Dispersal</text>
      <!-- Left: concentrated energy (low entropy) -->
      <rect x="30" y="50" width="140" height="140" rx="6" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="100" y="45" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Low Entropy</text>
      <!-- Hot coffee cup -->
      <rect x="65" y="85" width="70" height="50" rx="4" fill="#334155" stroke="#f472b6" stroke-width="2"/>
      <text x="100" y="115" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11">HOT</text>
      <!-- Steam lines above cup -->
      <path d="M80,80 Q82,70 85,75 Q88,80 90,70" fill="none" stroke="#f472b6" stroke-width="1.5" opacity="0.7"/>
      <path d="M100,80 Q102,70 105,75 Q108,80 110,70" fill="none" stroke="#f472b6" stroke-width="1.5" opacity="0.7"/>
      <!-- Cool surroundings dots -->
      <circle cx="50" cy="165" r="3" fill="#60a5fa" opacity="0.4"/>
      <circle cx="70" cy="170" r="3" fill="#60a5fa" opacity="0.4"/>
      <circle cx="130" cy="160" r="3" fill="#60a5fa" opacity="0.4"/>
      <circle cx="145" cy="175" r="3" fill="#60a5fa" opacity="0.4"/>
      <text x="100" y="155" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">cool surroundings</text>
      <!-- Arrow: time -->
      <defs>
        <marker id="thermo004-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
      </defs>
      <line x1="180" y1="120" x2="218" y2="120" stroke="#34d399" stroke-width="2.5" marker-end="url(#thermo004-arrow)"/>
      <text x="200" y="112" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="10">time</text>
      <!-- Right: dispersed energy (high entropy) -->
      <rect x="230" y="50" width="140" height="140" rx="6" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="300" y="45" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">High Entropy</text>
      <!-- Warm coffee cup (lukewarm) -->
      <rect x="265" y="85" width="70" height="50" rx="4" fill="#334155" stroke="#fb923c" stroke-width="1.5"/>
      <text x="300" y="115" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="11">warm</text>
      <!-- Warm surroundings dots -->
      <circle cx="245" cy="160" r="3" fill="#fb923c" opacity="0.5"/>
      <circle cx="260" cy="172" r="3" fill="#fb923c" opacity="0.5"/>
      <circle cx="280" cy="165" r="3" fill="#fb923c" opacity="0.5"/>
      <circle cx="320" cy="168" r="3" fill="#fb923c" opacity="0.5"/>
      <circle cx="340" cy="158" r="3" fill="#fb923c" opacity="0.5"/>
      <circle cx="355" cy="172" r="3" fill="#fb923c" opacity="0.5"/>
      <text x="300" y="155" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="10">warm surroundings</text>
      <!-- Bottom labels -->
      <text x="100" y="208" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">Energy concentrated</text>
      <text x="100" y="222" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">(useful, can do work)</text>
      <text x="300" y="208" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">Energy spread out</text>
      <text x="300" y="222" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">(less useful for work)</text>
      <!-- S arrow -->
      <text x="200" y="245" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12">S_universe always increases &#x2192; spontaneous direction</text>
    </svg>`,
    explanation: 'Entropy measures energy dispersal — not disorder. When you burn fuel, the energy doesn\'t vanish; it spreads into heat across the environment and becomes unavailable for useful work. This is why 100% efficient engines are impossible (Second Law).',
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
    question: 'At what temperature does water boil on Mount Everest (~34 kPa)?',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo005-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#94a3b8"/></marker>
      </defs>
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Phase Diagram: Pressure vs Temperature</text>
      <!-- Axes -->
      <line x1="60" y1="260" x2="380" y2="260" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#thermo005-arrow)"/>
      <line x1="60" y1="260" x2="60" y2="30" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#thermo005-arrow)"/>
      <text x="220" y="290" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">Temperature (&#xB0;C)</text>
      <text x="20" y="145" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12" transform="rotate(-90,20,145)">Pressure (kPa)</text>
      <!-- Liquid-vapor curve (vaporization line) -->
      <path d="M90,240 Q150,210 200,170 Q250,120 310,75 Q340,55 360,40" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <!-- Region labels -->
      <text x="130" y="100" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">LIQUID</text>
      <text x="300" y="200" fill="#f472b6" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">VAPOR</text>
      <!-- Sea level point: 101.3 kPa, 100°C -->
      <circle cx="262" cy="108" r="6" fill="#34d399" stroke="#34d399" stroke-width="1"/>
      <line x1="60" y1="108" x2="256" y2="108" stroke="#34d399" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="262" y1="108" x2="262" y2="260" stroke="#34d399" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="56" y="108" text-anchor="end" fill="#34d399" font-family="system-ui, sans-serif" font-size="10">101.3</text>
      <text x="262" y="274" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="10">100&#xB0;C</text>
      <text x="270" y="100" fill="#34d399" font-family="system-ui, sans-serif" font-size="10">Sea level</text>
      <!-- Everest point: 34 kPa, ~70°C -->
      <circle cx="192" cy="180" r="6" fill="#f472b6" stroke="#f472b6" stroke-width="1"/>
      <line x1="60" y1="180" x2="186" y2="180" stroke="#f472b6" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="192" y1="180" x2="192" y2="260" stroke="#f472b6" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="56" y="180" text-anchor="end" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10">34</text>
      <text x="192" y="274" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10">~70&#xB0;C</text>
      <text x="200" y="197" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10">Mt. Everest</text>
      <!-- Annotation -->
      <text x="330" y="250" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9" font-style="italic">Lower P &#x2192; Lower T_boil</text>
    </svg>`,
    options: [
      { id: 'a', text: '100°C — boiling point is a material property that does not change' },
      { id: 'b', text: '70°C — lower pressure means lower boiling point' },
      { id: 'c', text: '120°C — lower pressure means water needs more energy to boil' },
      { id: 'd', text: '100°C — pressure only affects the freezing point, not the boiling point' },
    ],
    correctAnswer: 'b',
    explanation: 'Boiling occurs when vapor pressure equals surrounding pressure. Lower atmospheric pressure = lower boiling temperature. At ~34 kPa, water boils at ~70°C.',
    interviewInsight: 'Tests phase behavior understanding and Clausius-Clapeyron relationship.',
    realWorldConnection: 'Why pressure cookers work, power plant condensers use vacuum, and pumps cavitate.',
    commonMistake: 'Thinking boiling point is fixed. It depends on pressure — the basis of steam tables.',
    tags: ['boiling-point', 'pressure', 'phase-change', 'vapor-pressure', 'altitude'],
  },

  // THERMO-006 — Estimation
  {
    id: 'thermo-006',
    type: 'estimation',
    topic: 'thermodynamics',
    subtopic: 'Applied Thermodynamics',
    difficulty: 'advanced',
    question: 'Estimate car engine thermal efficiency and fuel energy wasted as heat per gallon.',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo006-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
        <marker id="thermo006-arr-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker>
      </defs>
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Energy Flow: 1 Gallon of Gasoline (120 MJ)</text>
      <!-- Fuel input arrow (wide) -->
      <rect x="10" y="100" width="70" height="60" rx="3" fill="#334155" stroke="#fb923c" stroke-width="2"/>
      <text x="45" y="125" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="11">Fuel</text>
      <text x="45" y="142" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">120 MJ</text>
      <!-- Engine block -->
      <rect x="120" y="80" width="110" height="100" rx="5" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <text x="175" y="115" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Engine</text>
      <text x="175" y="135" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">&#x3B7; &#x2248; 30%</text>
      <text x="175" y="150" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">(Otto cycle)</text>
      <!-- Arrow fuel to engine -->
      <line x1="83" y1="130" x2="116" y2="130" stroke="#fb923c" stroke-width="3" marker-end="url(#thermo006-arr)"/>
      <!-- Useful work output -->
      <line x1="234" y1="110" x2="284" y2="110" stroke="#34d399" stroke-width="3" marker-end="url(#thermo006-arr)"/>
      <rect x="288" y="90" width="100" height="40" rx="3" fill="none" stroke="#34d399" stroke-width="2"/>
      <text x="338" y="108" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11">Useful Work</text>
      <text x="338" y="124" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">36 MJ (30%)</text>
      <!-- Waste heat outputs -->
      <!-- Exhaust -->
      <line x1="175" y1="184" x2="175" y2="210" stroke="#f472b6" stroke-width="2" marker-end="url(#thermo006-arr-red)"/>
      <rect x="120" y="213" width="55" height="45" rx="3" fill="none" stroke="#f472b6" stroke-width="1.5"/>
      <text x="148" y="229" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Exhaust</text>
      <text x="148" y="245" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~40 MJ</text>
      <!-- Coolant -->
      <line x1="234" y1="155" x2="265" y2="175" stroke="#f472b6" stroke-width="2" marker-end="url(#thermo006-arr-red)"/>
      <rect x="245" y="178" width="58" height="45" rx="3" fill="none" stroke="#f472b6" stroke-width="1.5"/>
      <text x="274" y="194" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Coolant</text>
      <text x="274" y="210" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~30 MJ</text>
      <!-- Friction/radiation -->
      <line x1="310" y1="155" x2="340" y2="175" stroke="#f472b6" stroke-width="1.5" marker-end="url(#thermo006-arr-red)"/>
      <rect x="315" y="178" width="70" height="45" rx="3" fill="none" stroke="#f472b6" stroke-width="1.5"/>
      <text x="350" y="194" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Friction/Rad.</text>
      <text x="350" y="210" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">~14 MJ</text>
      <!-- Total waste -->
      <rect x="120" y="260" width="268" height="18" rx="2" fill="none" stroke="#f472b6" stroke-width="1"/>
      <text x="254" y="274" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11">Total waste heat: 84 MJ (70%) &#x2248; 47 space heaters for 1 hour</text>
    </svg>`,
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
    explanation: 'Carnot limit ~60% (2000K combustion, 800K exhaust). Real engines achieve ~30% due to irreversibilities, friction, and incomplete combustion.',
    interviewInsight: 'Tests order-of-magnitude thinking and making abstract numbers tangible.',
    commonMistake: 'Overestimating efficiency at 50-60%. Modern gasoline engines are only 25-35% efficient.',
    tags: ['efficiency', 'engine', 'waste-heat', 'estimation', 'gasoline', 'automotive'],
  },

  // THERMO-007 — Multiple Choice (COP & Energy Conservation)
  {
    id: 'thermo-007',
    type: 'multiple-choice',
    topic: 'thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty: 'intermediate',
    question: 'An air conditioner has a COP of 4 and consumes 1 kW of electrical power. Which statement correctly describes this system?',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo007-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#60a5fa"/></marker>
        <marker id="thermo007-arr-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker>
        <marker id="thermo007-arr-grn" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
      </defs>
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Air Conditioner Energy Balance (COP = 4)</text>
      <!-- Cold room (left) -->
      <rect x="20" y="70" width="110" height="120" rx="5" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <text x="75" y="60" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Cold Room</text>
      <text x="75" y="120" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">Q_cold</text>
      <text x="75" y="140" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">4 kW</text>
      <text x="75" y="160" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">(heat removed)</text>
      <!-- AC unit (center) -->
      <rect x="155" y="80" width="90" height="100" rx="5" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <text x="200" y="115" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">A/C</text>
      <text x="200" y="133" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Unit</text>
      <text x="200" y="155" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">COP = 4</text>
      <!-- Hot outdoors (right) -->
      <rect x="270" y="70" width="110" height="120" rx="5" fill="none" stroke="#f472b6" stroke-width="2"/>
      <text x="325" y="60" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Hot Outdoors</text>
      <text x="325" y="120" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12">Q_hot</text>
      <text x="325" y="140" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">5 kW</text>
      <text x="325" y="160" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">(heat rejected)</text>
      <!-- Q_cold arrow -->
      <line x1="133" y1="130" x2="152" y2="130" stroke="#60a5fa" stroke-width="2.5" marker-end="url(#thermo007-arr)"/>
      <!-- Q_hot arrow -->
      <line x1="248" y1="130" x2="267" y2="130" stroke="#f472b6" stroke-width="2.5" marker-end="url(#thermo007-arr-red)"/>
      <!-- W_in arrow from top -->
      <line x1="200" y1="40" x2="200" y2="76" stroke="#34d399" stroke-width="2.5" marker-end="url(#thermo007-arr-grn)"/>
      <text x="200" y="35" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">W = 1 kW</text>
      <!-- Energy balance equation -->
      <rect x="60" y="210" width="280" height="55" rx="4" fill="none" stroke="#34d399" stroke-width="1.5"/>
      <text x="200" y="230" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">1st Law: Q_hot = Q_cold + W</text>
      <text x="200" y="248" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">5 kW = 4 kW + 1 kW  &#x2714; Energy conserved!</text>
      <!-- No violation note -->
      <text x="200" y="275" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-style="italic">No energy is created. COP &gt; 1 means heat is MOVED, not created.</text>
    </svg>`,
    options: [
      { id: 'a', text: 'The system is 400% efficient and creates 4 kW of cooling from 1 kW of electricity, violating conservation of energy' },
      { id: 'b', text: 'The system moves 4 kW of heat from the cold space using 1 kW of work, and rejects 5 kW total to the hot side — energy is conserved' },
      { id: 'c', text: 'COP of 4 means only 25% of the input energy is wasted, making this a highly efficient system' },
      { id: 'd', text: 'The system violates the second law of thermodynamics because it moves heat from cold to hot' },
    ],
    correctAnswer: 'b',
    explanation: 'A COP of 4 does NOT violate conservation of energy. The system absorbs Q_cold = 4 kW from the room and adds W = 1 kW from the compressor, then rejects Q_hot = Q_cold + W = 5 kW to the outdoors. COP > 1 simply means the device moves more heat than the work it consumes — no energy is created. Moving heat from cold to hot requires work input but does not violate any law.',
    interviewInsight: 'Tests clear thinking about energy balances and COP vs. thermodynamic efficiency.',
    commonMistake: 'Accepting the "violates conservation" claim. COP is not thermodynamic efficiency — it is useful heat / work input.',
    tags: ['COP', 'first-law', 'second-law', 'air-conditioning', 'energy-conservation'],
  },

  // THERMO-008 — Multi-Select
  {
    id: 'thermo-008',
    type: 'multi-select',
    topic: 'thermodynamics',
    subtopic: 'Power & Refrigeration Cycles',
    difficulty: 'advanced',
    question: 'Which modifications to a Rankine cycle INCREASE thermal efficiency? (Select all)',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thermo008-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5" fill="#60a5fa"/></marker>
        <marker id="thermo008-arr-grn" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5" fill="#34d399"/></marker>
      </defs>
      <text x="200" y="16" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">T-s Diagram: Rankine Cycle Modifications</text>
      <!-- Axes -->
      <line x1="50" y1="265" x2="380" y2="265" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="50" y1="265" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="215" y="290" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Entropy, s (kJ/kg&#xB7;K)</text>
      <text x="18" y="145" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" transform="rotate(-90,18,145)">Temperature, T (K)</text>
      <!-- Saturation dome -->
      <path d="M110,240 Q140,170 170,120 Q195,80 220,60 Q245,80 270,120 Q300,170 330,240" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
      <text x="220" y="55" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">critical point</text>
      <!-- Simple Rankine cycle (solid blue) -->
      <!-- State 1 (condenser exit) to State 2 (boiler entry - pump) -->
      <line x1="115" y1="235" x2="115" y2="130" stroke="#60a5fa" stroke-width="2" marker-end="url(#thermo008-arr)"/>
      <!-- State 2 to State 3 (boiling at constant T to sat vapor) -->
      <line x1="115" y1="130" x2="265" y2="130" stroke="#60a5fa" stroke-width="2" marker-end="url(#thermo008-arr)"/>
      <!-- State 3 to State 4 (expansion in turbine) -->
      <path d="M265,130 Q290,180 310,235" fill="none" stroke="#60a5fa" stroke-width="2" marker-end="url(#thermo008-arr)"/>
      <!-- State 4 back to State 1 (condensing) -->
      <line x1="310" y1="235" x2="115" y2="235" stroke="#60a5fa" stroke-width="2" marker-end="url(#thermo008-arr)"/>
      <!-- State labels -->
      <circle cx="115" cy="235" r="3" fill="#60a5fa"/>
      <text x="100" y="248" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">1</text>
      <circle cx="115" cy="130" r="3" fill="#60a5fa"/>
      <text x="100" y="128" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">2</text>
      <circle cx="265" cy="130" r="3" fill="#60a5fa"/>
      <text x="272" y="125" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">3</text>
      <circle cx="310" cy="235" r="3" fill="#60a5fa"/>
      <text x="317" y="248" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">4</text>
      <!-- Superheating modification (dashed green, extends from 3 rightward and up) -->
      <path d="M265,130 L265,80" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="5,3"/>
      <line x1="265" y1="80" x2="290" y2="80" stroke="#34d399" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#thermo008-arr-grn)"/>
      <text x="292" y="75" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">3' (superheat)</text>
      <!-- Expansion from superheated state -->
      <path d="M290,80 Q320,155 340,235" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="5,3"/>
      <!-- Higher boiler pressure modification annotation -->
      <path d="M115,95 L240,95" fill="none" stroke="#f472b6" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="178" y="89" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Higher P_boiler</text>
      <!-- Reheat annotation -->
      <text x="355" y="75" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">Reheat</text>
      <path d="M340,80 L340,130 L360,130" fill="none" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="3,3"/>
      <!-- Condenser pressure labels -->
      <text x="210" y="252" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="9">T_condenser (low P = better)</text>
      <!-- Legend -->
      <line x1="55" y1="280" x2="75" y2="280" stroke="#60a5fa" stroke-width="2"/>
      <text x="78" y="284" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="9">Simple Rankine</text>
      <line x1="155" y1="280" x2="175" y2="280" stroke="#34d399" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="178" y="284" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Superheat</text>
      <line x1="230" y1="280" x2="250" y2="280" stroke="#f472b6" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="253" y="284" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Higher P</text>
      <line x1="300" y1="280" x2="320" y2="280" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="323" y="284" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">Reheat</text>
    </svg>`,
    options: [
      { id: 'a', text: 'Superheating the steam beyond the saturation temperature before the turbine' },
      { id: 'b', text: 'Increasing the condenser pressure (higher heat rejection temperature)' },
      { id: 'c', text: 'Increasing the boiler pressure (higher average heat input temperature)' },
      { id: 'd', text: 'Adding a feedwater heater (regeneration) to preheat water entering the boiler' },
      { id: 'e', text: 'Adding a reheat stage between high-pressure and low-pressure turbines' },
    ],
    correctAnswers: ['a', 'c', 'd', 'e'],
    explanation: 'Higher average heat-addition temperature improves efficiency (superheat, higher boiler P, reheat, regeneration). Increasing condenser pressure DECREASES efficiency by raising rejection temperature.',
    interviewInsight: 'Tests the link between Carnot principle and practical cycle modifications.',
    commonMistake: 'Selecting higher condenser pressure. Higher rejection temperature hurts efficiency.',
    tags: ['rankine', 'superheat', 'reheat', 'regeneration', 'boiler-pressure', 'efficiency'],
  },
];
