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
    diagram: `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Deep Groove Ball Bearing — L10 Life</text>
      <!-- Outer ring -->
      <circle cx="150" cy="150" r="80" fill="none" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="150" cy="150" r="65" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Inner ring -->
      <circle cx="150" cy="150" r="35" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="150" cy="150" r="22" fill="none" stroke="#94a3b8" stroke-width="3"/>
      <!-- Shaft hole -->
      <circle cx="150" cy="150" r="18" fill="#334155" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4,2"/>
      <!-- Balls in raceway -->
      <circle cx="150" cy="80" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="203" cy="97" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="220" cy="150" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="203" cy="203" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="150" cy="220" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="97" cy="203" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="80" cy="150" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="97" cy="97" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Radial load arrow -->
      <line x1="150" y1="260" x2="150" y2="235" stroke="#f472b6" stroke-width="2.5" marker-end="url(#me001-arr)"/>
      <text x="150" y="275" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">P = 5 kN</text>
      <defs><marker id="me001-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker></defs>
      <!-- Formula box -->
      <rect x="250" y="50" width="140" height="100" fill="#334155" stroke="#60a5fa" stroke-width="1.5" rx="6"/>
      <text x="320" y="72" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Ball Bearing:</text>
      <text x="320" y="92" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">L10 = (C/P)&#xB3;</text>
      <text x="320" y="115" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">= (25/5)&#xB3;</text>
      <text x="320" y="135" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">= 125 M rev</text>
      <!-- Note about exponent -->
      <rect x="250" y="165" width="140" height="55" fill="none" stroke="#94a3b8" stroke-width="1" rx="4" stroke-dasharray="4,2"/>
      <text x="320" y="182" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">Exponent:</text>
      <text x="320" y="197" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">Ball = 3</text>
      <text x="320" y="212" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10">Roller = 10/3</text>
      <!-- C rating label -->
      <text x="320" y="240" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">C = 25 kN (dynamic rating)</text>
      <text x="320" y="255" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">2x load = 1/8 life!</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Gear Tooth Failure: Surface Pitting</text>
      <!-- Single gear tooth profile (enlarged) -->
      <path d="M80 260 L80 100 Q80 80 95 70 L110 65 Q130 60 140 70 L155 80 Q165 100 165 100 L165 260" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <!-- Root fillet -->
      <path d="M75 260 Q78 245 80 240" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M170 260 Q167 245 165 240" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Tooth flank label -->
      <text x="50" y="170" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">Tooth</text>
      <text x="50" y="182" text-anchor="end" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">Flank</text>
      <line x1="53" y1="175" x2="78" y2="175" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,2"/>
      <!-- Pitting damage on flank -->
      <ellipse cx="90" cy="140" rx="6" ry="4" fill="#334155" stroke="#f472b6" stroke-width="1.5"/>
      <ellipse cx="100" cy="160" rx="8" ry="5" fill="#334155" stroke="#f472b6" stroke-width="1.5"/>
      <ellipse cx="88" cy="180" rx="5" ry="3" fill="#334155" stroke="#f472b6" stroke-width="1.5"/>
      <ellipse cx="95" cy="200" rx="7" ry="4" fill="#334155" stroke="#f472b6" stroke-width="1.5"/>
      <ellipse cx="105" cy="125" rx="4" ry="3" fill="#334155" stroke="#f472b6" stroke-width="1"/>
      <!-- Pitting label -->
      <text x="30" y="128" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Pits</text>
      <line x1="45" y1="130" x2="84" y2="139" stroke="#f472b6" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Hertzian contact stress diagram (right side) -->
      <text x="300" y="55" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Hertzian Contact Stress</text>
      <!-- Two circles in contact -->
      <circle cx="300" cy="105" r="30" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="300" cy="165" r="30" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Contact point -->
      <circle cx="300" cy="135" r="2" fill="#f472b6"/>
      <!-- Stress distribution below surface -->
      <path d="M275 138 Q288 145 300 160 Q312 145 325 138" fill="#f472b6" opacity="0.2" stroke="#f472b6" stroke-width="1"/>
      <text x="300" y="155" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">Max shear</text>
      <text x="300" y="163" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">below surface</text>
      <!-- Failure chain on right -->
      <text x="220" y="195" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Failure Chain:</text>
      <!-- Step arrows -->
      <rect x="220" y="203" width="170" height="16" fill="none" stroke="#60a5fa" stroke-width="1" rx="3"/>
      <text x="305" y="214" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="8">1. Cyclic Hertzian stress</text>
      <line x1="305" y1="219" x2="305" y2="225" stroke="#94a3b8" stroke-width="1" marker-end="url(#me002-arr)"/>
      <rect x="220" y="226" width="170" height="16" fill="none" stroke="#60a5fa" stroke-width="1" rx="3"/>
      <text x="305" y="237" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="8">2. Subsurface crack initiation</text>
      <line x1="305" y1="242" x2="305" y2="248" stroke="#94a3b8" stroke-width="1" marker-end="url(#me002-arr)"/>
      <rect x="220" y="249" width="170" height="16" fill="none" stroke="#f472b6" stroke-width="1" rx="3"/>
      <text x="305" y="260" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">3. Cracks reach surface = pits</text>
      <line x1="305" y1="265" x2="305" y2="271" stroke="#94a3b8" stroke-width="1" marker-end="url(#me002-arr)"/>
      <rect x="220" y="272" width="170" height="16" fill="none" stroke="#fb923c" stroke-width="1" rx="3"/>
      <text x="305" y="283" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="8">4. Debris contaminates lube</text>
      <defs><marker id="me002-arr" markerWidth="6" markerHeight="5" refX="3" refY="5" orient="auto"><path d="M0,0 L3,5 L6,0" fill="#94a3b8"/></marker></defs>
      <!-- Root fillet label -->
      <text x="122" y="270" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Root fillet (bending fatigue</text>
      <text x="122" y="280" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">prevented by proper design)</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Bearing Comparison: Rolling vs. Journal</text>
      <!-- LEFT: Angular Contact Ball Bearing -->
      <text x="110" y="48" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Angular Contact</text>
      <text x="110" y="62" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Ball Bearing</text>
      <!-- Outer ring -->
      <circle cx="110" cy="145" r="55" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="110" cy="145" r="43" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <!-- Inner ring -->
      <circle cx="110" cy="145" r="25" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="110" cy="145" r="15" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <!-- Shaft center -->
      <circle cx="110" cy="145" r="12" fill="#334155" stroke="#60a5fa" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Balls (angled contact line shown) -->
      <circle cx="110" cy="91" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="148" cy="105" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="160" cy="145" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="148" cy="185" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="110" cy="199" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="72" cy="185" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="60" cy="145" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="72" cy="105" r="8" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Contact angle line -->
      <line x1="95" y1="100" x2="125" y2="85" stroke="#f472b6" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="135" y="80" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">Contact</text>
      <text x="135" y="88" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">angle</text>
      <!-- RIGHT: Journal Bearing cross-section -->
      <text x="310" y="48" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Hydrodynamic</text>
      <text x="310" y="62" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Journal Bearing</text>
      <!-- Bearing housing (outer) -->
      <circle cx="310" cy="145" r="55" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <!-- Bearing bore -->
      <circle cx="310" cy="145" r="42" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Oil film (crescent shape) -->
      <path d="M268 145 A42 42 0 1 1 352 145 A38 38 0 1 0 268 145" fill="#fb923c" opacity="0.25" stroke="#fb923c" stroke-width="1"/>
      <!-- Shaft (offset for eccentricity) -->
      <circle cx="313" cy="150" r="36" fill="#334155" stroke="#60a5fa" stroke-width="2"/>
      <!-- Oil film label -->
      <text x="270" y="115" fill="#fb923c" font-family="system-ui, sans-serif" font-size="8">Oil film</text>
      <text x="270" y="123" fill="#fb923c" font-family="system-ui, sans-serif" font-size="8">(wedge)</text>
      <!-- Minimum film thickness -->
      <line x1="340" y1="183" x2="355" y2="195" stroke="#f472b6" stroke-width="1"/>
      <text x="352" y="205" fill="#f472b6" font-family="system-ui, sans-serif" font-size="7">h_min</text>
      <!-- Rotation arrow -->
      <path d="M330 120 A20 20 0 0 1 340 140" fill="none" stroke="#34d399" stroke-width="1.5" marker-end="url(#me003-arr)"/>
      <defs><marker id="me003-arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#34d399"/></marker></defs>
      <!-- Comparison table -->
      <line x1="30" y1="218" x2="390" y2="218" stroke="#94a3b8" stroke-width="0.5"/>
      <text x="80" y="234" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Property</text>
      <text x="200" y="234" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="9">Rolling Element</text>
      <text x="330" y="234" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Journal</text>
      <line x1="30" y1="238" x2="390" y2="238" stroke="#94a3b8" stroke-width="0.3"/>
      <text x="80" y="252" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Precision</text>
      <text x="200" y="252" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Excellent</text>
      <text x="330" y="252" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Moderate</text>
      <text x="80" y="266" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Damping</text>
      <text x="200" y="266" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Low</text>
      <text x="330" y="266" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Excellent</text>
      <text x="80" y="280" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Startup friction</text>
      <text x="200" y="280" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Low</text>
      <text x="330" y="280" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">High</text>
      <text x="80" y="294" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">At 15k RPM</text>
      <text x="200" y="294" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">Preferred</text>
      <text x="330" y="294" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Possible</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Bolted Joint — Stiffness Ratio</text>
      <!-- Top flange -->
      <rect x="60" y="70" width="170" height="40" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Cross-hatch top flange -->
      <line x1="65" y1="75" x2="85" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="85" y1="75" x2="105" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="105" y1="75" x2="125" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="125" y1="75" x2="145" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="145" y1="75" x2="165" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="165" y1="75" x2="185" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="185" y1="75" x2="205" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="205" y1="75" x2="225" y2="105" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <!-- Bottom flange -->
      <rect x="60" y="110" width="170" height="40" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Cross-hatch bottom flange -->
      <line x1="65" y1="115" x2="85" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="85" y1="115" x2="105" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="105" y1="115" x2="125" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="125" y1="115" x2="145" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="145" y1="115" x2="165" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="165" y1="115" x2="185" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="185" y1="115" x2="205" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <line x1="205" y1="115" x2="225" y2="145" stroke="#94a3b8" stroke-width="0.3" opacity="0.3"/>
      <!-- Bolt shank -->
      <rect x="138" y="50" width="14" height="120" fill="#60a5fa" opacity="0.6" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Bolt head -->
      <rect x="130" y="50" width="30" height="14" fill="#60a5fa" opacity="0.8" stroke="#60a5fa" stroke-width="1.5" rx="2"/>
      <!-- Nut -->
      <rect x="130" y="156" width="30" height="14" fill="#60a5fa" opacity="0.8" stroke="#60a5fa" stroke-width="1.5" rx="2"/>
      <!-- Hole through flanges -->
      <rect x="138" y="70" width="14" height="80" fill="#334155"/>
      <!-- Bolt over hole -->
      <rect x="140" y="70" width="10" height="80" fill="#60a5fa" opacity="0.5"/>
      <!-- Preload arrows (compression on flanges) -->
      <line x1="145" y1="55" x2="145" y2="68" stroke="#34d399" stroke-width="2" marker-end="url(#me004-arr-g)"/>
      <line x1="145" y1="168" x2="145" y2="155" stroke="#34d399" stroke-width="2" marker-end="url(#me004-arr-g)"/>
      <defs>
        <marker id="me004-arr-g" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#34d399"/></marker>
        <marker id="me004-arr-p" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#f472b6"/></marker>
      </defs>
      <!-- External force arrows -->
      <line x1="75" y1="42" x2="75" y2="25" stroke="#f472b6" stroke-width="2" marker-end="url(#me004-arr-p)"/>
      <line x1="75" y1="178" x2="75" y2="195" stroke="#f472b6" stroke-width="2" marker-end="url(#me004-arr-p)"/>
      <text x="75" y="18" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">F_ext = 10 kN</text>
      <text x="75" y="208" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">F_ext = 10 kN</text>
      <!-- Clamp zone (cone) -->
      <path d="M130 75 L100 105 L100 115 L130 145 L160 145 L190 115 L190 105 L160 75 Z" fill="#34d399" opacity="0.08" stroke="#34d399" stroke-width="0.5" stroke-dasharray="4,2"/>
      <text x="47" y="115" fill="#34d399" font-family="system-ui, sans-serif" font-size="8">Clamp</text>
      <text x="47" y="124" fill="#34d399" font-family="system-ui, sans-serif" font-size="8">cone</text>
      <!-- Formula box (right side) -->
      <rect x="250" y="45" width="140" height="120" fill="#334155" stroke="#60a5fa" stroke-width="1.5" rx="6"/>
      <text x="320" y="65" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Stiffness Ratio:</text>
      <text x="320" y="82" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10">C = k_b / (k_b + k_m)</text>
      <text x="320" y="98" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">C &#x2248; 0.2-0.3 (typical)</text>
      <line x1="260" y1="105" x2="380" y2="105" stroke="#94a3b8" stroke-width="0.5"/>
      <text x="320" y="120" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">F_bolt = F_pre + C&#xD7;F_ext</text>
      <text x="320" y="137" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">= 40 + 0.3&#xD7;10</text>
      <text x="320" y="157" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">&#x2248; 43 kN</text>
      <!-- Joint force diagram -->
      <rect x="250" y="180" width="140" height="60" fill="none" stroke="#94a3b8" stroke-width="1" rx="4" stroke-dasharray="4,2"/>
      <text x="320" y="198" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Bolt sees: +3 kN (small!)</text>
      <text x="320" y="213" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Joint clamp reduced: -7 kN</text>
      <text x="320" y="228" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">NOT 50 kN (simple addition)</text>
      <!-- Labels -->
      <text x="200" y="260" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10">Preload F_pre = 40 kN</text>
      <text x="200" y="278" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">k_b = bolt stiffness | k_m = member stiffness (much stiffer)</text>
      <text x="200" y="293" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">The bolt barely "feels" the external load — most just relieves the clamp</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">O-Ring Groove Design: Squeeze</text>
      <!-- LEFT: Correct squeeze (10-30%) -->
      <text x="100" y="48" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Correct: 10-30%</text>
      <!-- Groove (rectangular pocket) -->
      <rect x="40" y="80" width="120" height="50" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Mating surface (top) -->
      <rect x="20" y="60" width="160" height="20" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Housing (bottom/sides of groove) -->
      <rect x="20" y="130" width="60" height="30" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="120" y="130" width="60" height="30" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="20" y="80" width="20" height="80" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="160" y="80" width="20" height="80" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- O-ring (squeezed - oval shape) -->
      <ellipse cx="100" cy="95" rx="28" ry="18" fill="#60a5fa" opacity="0.5" stroke="#60a5fa" stroke-width="2"/>
      <!-- Contact stress arrows -->
      <line x1="85" y1="80" x2="85" y2="88" stroke="#34d399" stroke-width="1.5" marker-end="url(#me005-arr)"/>
      <line x1="100" y1="80" x2="100" y2="86" stroke="#34d399" stroke-width="1.5" marker-end="url(#me005-arr)"/>
      <line x1="115" y1="80" x2="115" y2="88" stroke="#34d399" stroke-width="1.5" marker-end="url(#me005-arr)"/>
      <defs><marker id="me005-arr" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L5,2 L0,4" fill="#34d399"/></marker></defs>
      <text x="100" y="72" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="8">Contact stress > pressure</text>
      <!-- Squeeze dimension -->
      <line x1="170" y1="80" x2="170" y2="95" stroke="#f472b6" stroke-width="1"/>
      <line x1="167" y1="80" x2="173" y2="80" stroke="#f472b6" stroke-width="1"/>
      <line x1="167" y1="95" x2="173" y2="95" stroke="#f472b6" stroke-width="1"/>
      <text x="182" y="90" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">Squeeze</text>
      <!-- Check mark -->
      <text x="100" y="145" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="16">&#x2713;</text>
      <text x="100" y="160" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Seals properly</text>
      <!-- RIGHT TOP: Too little squeeze -->
      <text x="310" y="48" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Too Little Squeeze</text>
      <!-- Groove -->
      <rect x="260" y="60" width="100" height="45" fill="#334155" stroke="#94a3b8" stroke-width="1"/>
      <!-- Mating surface -->
      <line x1="250" y1="60" x2="370" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- O-ring barely touching -->
      <ellipse cx="310" cy="82" rx="22" ry="18" fill="#60a5fa" opacity="0.3" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Gap showing leak -->
      <line x1="295" y1="60" x2="295" y2="68" stroke="#fb923c" stroke-width="2" stroke-dasharray="2,2"/>
      <line x1="325" y1="60" x2="325" y2="68" stroke="#fb923c" stroke-width="2" stroke-dasharray="2,2"/>
      <text x="310" y="115" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">Leak! Insufficient</text>
      <text x="310" y="125" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="9">contact stress</text>
      <!-- RIGHT BOTTOM: Too much squeeze -->
      <text x="310" y="150" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Too Much Squeeze</text>
      <!-- Groove -->
      <rect x="260" y="162" width="100" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1"/>
      <!-- Mating surface -->
      <line x1="250" y1="162" x2="370" y2="162" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- O-ring crushed flat -->
      <ellipse cx="310" cy="175" rx="35" ry="10" fill="#60a5fa" opacity="0.5" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Extrusion out of gap -->
      <path d="M360 170 Q370 172 375 175 Q370 178 360 180" fill="#f472b6" opacity="0.4" stroke="#f472b6" stroke-width="1"/>
      <text x="383" y="178" fill="#f472b6" font-family="system-ui, sans-serif" font-size="7">Nibbling/</text>
      <text x="383" y="186" fill="#f472b6" font-family="system-ui, sans-serif" font-size="7">extrusion</text>
      <text x="310" y="210" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Excessive wear, heat,</text>
      <text x="310" y="220" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">compression set</text>
      <!-- Bottom summary -->
      <rect x="30" y="235" width="350" height="40" fill="none" stroke="#94a3b8" stroke-width="1" rx="4" stroke-dasharray="4,2"/>
      <text x="205" y="252" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">Static seal: 15-30% squeeze | Dynamic seal: 10-20% squeeze</text>
      <text x="205" y="267" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Groove volume must exceed O-ring volume for thermal expansion</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Gear Reducer — 5:1 Ratio</text>
      <!-- Motor -->
      <rect x="20" y="90" width="70" height="60" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="4"/>
      <text x="55" y="125" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">Motor</text>
      <!-- Motor shaft -->
      <rect x="90" y="113" width="35" height="14" fill="#94a3b8" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Pinion (small gear) -->
      <circle cx="140" cy="120" r="22" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="140" cy="120" r="18" fill="#334155" stroke="#60a5fa" stroke-width="1" stroke-dasharray="3,2"/>
      <circle cx="140" cy="120" r="5" fill="#94a3b8"/>
      <!-- Gear teeth on pinion (simplified) -->
      <line x1="140" y1="96" x2="140" y2="100" stroke="#60a5fa" stroke-width="2"/>
      <line x1="161" y1="113" x2="157" y2="115" stroke="#60a5fa" stroke-width="2"/>
      <line x1="157" y1="137" x2="153" y2="134" stroke="#60a5fa" stroke-width="2"/>
      <line x1="140" y1="144" x2="140" y2="140" stroke="#60a5fa" stroke-width="2"/>
      <line x1="119" y1="137" x2="123" y2="134" stroke="#60a5fa" stroke-width="2"/>
      <line x1="119" y1="113" x2="123" y2="115" stroke="#60a5fa" stroke-width="2"/>
      <text x="140" y="80" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="9">Pinion</text>
      <text x="140" y="90" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="9">(Z=20)</text>
      <!-- Gear (large gear) -->
      <circle cx="230" cy="120" r="60" fill="none" stroke="#f472b6" stroke-width="2"/>
      <circle cx="230" cy="120" r="54" fill="#334155" stroke="#f472b6" stroke-width="1" stroke-dasharray="3,2"/>
      <circle cx="230" cy="120" r="8" fill="#94a3b8"/>
      <!-- Gear teeth (simplified) -->
      <line x1="230" y1="58" x2="230" y2="64" stroke="#f472b6" stroke-width="2"/>
      <line x1="260" y1="62" x2="258" y2="68" stroke="#f472b6" stroke-width="2"/>
      <line x1="284" y1="82" x2="280" y2="86" stroke="#f472b6" stroke-width="2"/>
      <line x1="292" y1="114" x2="286" y2="116" stroke="#f472b6" stroke-width="2"/>
      <line x1="284" y1="156" x2="280" y2="152" stroke="#f472b6" stroke-width="2"/>
      <line x1="260" y1="176" x2="258" y2="170" stroke="#f472b6" stroke-width="2"/>
      <line x1="230" y1="182" x2="230" y2="176" stroke="#f472b6" stroke-width="2"/>
      <line x1="200" y1="176" x2="202" y2="170" stroke="#f472b6" stroke-width="2"/>
      <line x1="176" y1="156" x2="180" y2="152" stroke="#f472b6" stroke-width="2"/>
      <line x1="176" y1="82" x2="180" y2="86" stroke="#f472b6" stroke-width="2"/>
      <line x1="200" y1="62" x2="202" y2="68" stroke="#f472b6" stroke-width="2"/>
      <text x="230" y="50" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="9">Gear (Z=100)</text>
      <!-- Output shaft -->
      <rect x="290" y="113" width="35" height="14" fill="#94a3b8" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Load -->
      <rect x="325" y="90" width="65" height="60" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="4"/>
      <text x="358" y="125" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">Load</text>
      <!-- Rotation arrows -->
      <path d="M140 70 A10 10 0 0 1 152 74" fill="none" stroke="#60a5fa" stroke-width="1.5" marker-end="url(#me006-arr-b)"/>
      <path d="M245 55 A10 10 0 0 0 233 59" fill="none" stroke="#f472b6" stroke-width="1.5" marker-end="url(#me006-arr-p)"/>
      <defs>
        <marker id="me006-arr-b" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#60a5fa"/></marker>
        <marker id="me006-arr-p" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#f472b6"/></marker>
      </defs>
      <!-- Input values -->
      <rect x="15" y="195" width="120" height="55" fill="none" stroke="#60a5fa" stroke-width="1" rx="4"/>
      <text x="75" y="212" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Input:</text>
      <text x="75" y="227" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">3000 RPM</text>
      <text x="75" y="242" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">10 Nm</text>
      <!-- Arrow between boxes -->
      <line x1="140" y1="222" x2="258" y2="222" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#me006-arr-s)"/>
      <text x="200" y="218" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">&#xF7;5 speed | &#xD7;5 torque</text>
      <defs><marker id="me006-arr-s" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#94a3b8"/></marker></defs>
      <!-- Output values -->
      <rect x="263" y="195" width="120" height="55" fill="none" stroke="#34d399" stroke-width="1.5" rx="4"/>
      <text x="323" y="212" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Output:</text>
      <text x="323" y="227" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">600 RPM</text>
      <text x="323" y="242" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">50 Nm</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="18" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Shaft Misalignment — Angular + Parallel</text>
      <!-- TOP: Aligned (correct) -->
      <text x="30" y="50" fill="#34d399" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Correct:</text>
      <!-- Motor block -->
      <rect x="40" y="55" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <text x="80" y="77" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Motor</text>
      <!-- Motor shaft -->
      <rect x="120" y="67" width="40" height="10" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
      <!-- Coupling -->
      <rect x="155" y="62" width="20" height="20" fill="#334155" stroke="#34d399" stroke-width="2" rx="3"/>
      <!-- Pump shaft -->
      <rect x="170" y="67" width="40" height="10" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
      <!-- Pump block -->
      <rect x="210" y="55" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <text x="250" y="77" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Pump</text>
      <!-- Centerline -->
      <line x1="40" y1="72" x2="290" y2="72" stroke="#34d399" stroke-width="0.5" stroke-dasharray="4,3"/>
      <text x="310" y="75" fill="#34d399" font-family="system-ui, sans-serif" font-size="9">Aligned</text>
      <!-- MIDDLE: Parallel (offset) misalignment -->
      <text x="30" y="115" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Parallel offset:</text>
      <!-- Motor -->
      <rect x="40" y="120" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <text x="80" y="142" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Motor</text>
      <!-- Motor shaft -->
      <rect x="120" y="132" width="40" height="10" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
      <!-- Coupling (stressed) -->
      <rect x="155" y="127" width="20" height="25" fill="#334155" stroke="#f472b6" stroke-width="2" rx="3"/>
      <!-- Pump shaft (offset) -->
      <rect x="170" y="138" width="40" height="10" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
      <!-- Pump -->
      <rect x="210" y="126" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <text x="250" y="148" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Pump</text>
      <!-- Offset dimension -->
      <line x1="310" y1="137" x2="310" y2="143" stroke="#f472b6" stroke-width="1"/>
      <line x1="307" y1="137" x2="313" y2="137" stroke="#f472b6" stroke-width="1"/>
      <line x1="307" y1="143" x2="313" y2="143" stroke="#f472b6" stroke-width="1"/>
      <text x="325" y="143" fill="#f472b6" font-family="system-ui, sans-serif" font-size="8">offset</text>
      <!-- BOTTOM: Angular misalignment -->
      <text x="30" y="180" fill="#fb923c" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Angular:</text>
      <!-- Motor -->
      <rect x="40" y="185" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <text x="80" y="207" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Motor</text>
      <!-- Motor shaft -->
      <rect x="120" y="197" width="40" height="10" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
      <!-- Coupling (stressed) -->
      <rect x="155" y="190" width="20" height="24" fill="#334155" stroke="#fb923c" stroke-width="2" rx="3" transform="rotate(5,165,202)"/>
      <!-- Pump shaft (angled) -->
      <line x1="170" y1="200" x2="210" y2="195" stroke="#60a5fa" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
      <!-- Pump (angled slightly) -->
      <rect x="210" y="178" width="80" height="35" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3" transform="rotate(-3,250,196)"/>
      <text x="250" y="200" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="9">Pump</text>
      <!-- Angle -->
      <path d="M165 202 L175 202 L175 198" fill="none" stroke="#fb923c" stroke-width="1"/>
      <text x="325" y="200" fill="#fb923c" font-family="system-ui, sans-serif" font-size="8">angle</text>
      <!-- Failure consequences box -->
      <rect x="20" y="230" width="175" height="45" fill="none" stroke="#f472b6" stroke-width="1" rx="4"/>
      <text x="107" y="244" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Misalignment causes:</text>
      <text x="107" y="258" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Coupling spider shredded</text>
      <text x="107" y="270" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Bearing fatigue + vibration</text>
      <!-- Fix box -->
      <rect x="210" y="230" width="175" height="45" fill="none" stroke="#34d399" stroke-width="1" rx="4"/>
      <text x="297" y="244" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Fix:</text>
      <text x="297" y="258" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Laser alignment (&lt;0.05mm)</text>
      <text x="297" y="270" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Check soft foot + thermal growth</text>
    </svg>`,
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
    diagram: `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="200" y="20" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Bolt Locking Methods</text>
      <!-- Row 1: Split lock washer (INEFFECTIVE) -->
      <rect x="15" y="35" width="115" height="105" fill="none" stroke="#f472b6" stroke-width="1.5" rx="4"/>
      <!-- Washer shape (helical split) -->
      <ellipse cx="72" cy="72" rx="18" ry="18" fill="none" stroke="#94a3b8" stroke-width="2"/>
      <line x1="72" y1="54" x2="72" y2="60" stroke="#334155" stroke-width="4"/>
      <line x1="66" y1="56" x2="78" y2="52" stroke="#94a3b8" stroke-width="2"/>
      <text x="72" y="105" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Split Lock</text>
      <text x="72" y="115" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Washer</text>
      <!-- X mark -->
      <text x="72" y="135" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">&#x2717; INEFFECTIVE</text>
      <!-- Row 1: Nyloc nut (EFFECTIVE) -->
      <rect x="143" y="35" width="115" height="105" fill="none" stroke="#34d399" stroke-width="1.5" rx="4"/>
      <!-- Nut shape with nylon insert -->
      <rect x="178" y="55" width="30" height="25" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="2"/>
      <!-- Nylon insert (top) -->
      <rect x="178" y="50" width="30" height="10" fill="#60a5fa" opacity="0.4" stroke="#60a5fa" stroke-width="1" rx="2"/>
      <!-- Thread lines -->
      <line x1="185" y1="60" x2="201" y2="60" stroke="#94a3b8" stroke-width="0.5"/>
      <line x1="185" y1="65" x2="201" y2="65" stroke="#94a3b8" stroke-width="0.5"/>
      <line x1="185" y1="70" x2="201" y2="70" stroke="#94a3b8" stroke-width="0.5"/>
      <text x="193" y="46" text-anchor="middle" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="7">Nylon</text>
      <text x="200" y="105" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Nyloc Nut</text>
      <text x="200" y="115" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="8">(prevailing torque)</text>
      <text x="200" y="135" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">&#x2713; EFFECTIVE</text>
      <!-- Row 1: Nord-Lock (EFFECTIVE) -->
      <rect x="271" y="35" width="115" height="105" fill="none" stroke="#34d399" stroke-width="1.5" rx="4"/>
      <!-- Nord-Lock washer pair (wedge pattern) -->
      <rect x="305" y="55" width="30" height="6" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="305" y="61" width="30" height="6" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Wedge teeth pattern (zigzag between washers) -->
      <path d="M308 61 L312 58 L316 61 L320 58 L324 61 L328 58 L332 61" stroke="#fb923c" stroke-width="1"/>
      <!-- Radial serrations on outer faces -->
      <line x1="308" y1="55" x2="310" y2="53" stroke="#94a3b8" stroke-width="0.5"/>
      <line x1="315" y1="55" x2="317" y2="53" stroke="#94a3b8" stroke-width="0.5"/>
      <line x1="322" y1="55" x2="324" y2="53" stroke="#94a3b8" stroke-width="0.5"/>
      <line x1="329" y1="55" x2="331" y2="53" stroke="#94a3b8" stroke-width="0.5"/>
      <text x="328" y="83" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Nord-Lock</text>
      <text x="328" y="93" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="8">Wedge-locking</text>
      <text x="328" y="105" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="7">cam angle > thread</text>
      <text x="328" y="115" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="7">pitch angle</text>
      <text x="328" y="135" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">&#x2713; EFFECTIVE</text>
      <!-- Row 2: Loctite (EFFECTIVE) -->
      <rect x="80" y="150" width="115" height="105" fill="none" stroke="#34d399" stroke-width="1.5" rx="4"/>
      <!-- Bolt with threadlocker -->
      <rect x="125" y="165" width="10" height="40" fill="#94a3b8" stroke="#94a3b8" stroke-width="1" rx="1"/>
      <!-- Thread lines -->
      <line x1="125" y1="175" x2="135" y2="175" stroke="#60a5fa" stroke-width="0.5"/>
      <line x1="125" y1="180" x2="135" y2="180" stroke="#60a5fa" stroke-width="0.5"/>
      <line x1="125" y1="185" x2="135" y2="185" stroke="#60a5fa" stroke-width="0.5"/>
      <line x1="125" y1="190" x2="135" y2="190" stroke="#60a5fa" stroke-width="0.5"/>
      <line x1="125" y1="195" x2="135" y2="195" stroke="#60a5fa" stroke-width="0.5"/>
      <!-- Adhesive in threads (colored) -->
      <rect x="123" y="172" width="14" height="30" fill="#f472b6" opacity="0.2" stroke="none" rx="2"/>
      <text x="137" y="195" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="7" transform="rotate(90,145,188)">Adhesive</text>
      <text x="137" y="222" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Thread-locking</text>
      <text x="137" y="232" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="8">Adhesive (Loctite)</text>
      <text x="137" y="250" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">&#x2713; EFFECTIVE</text>
      <!-- Row 2: Longer bolt (NOT effective) -->
      <rect x="210" y="150" width="115" height="105" fill="none" stroke="#94a3b8" stroke-width="1" rx="4" stroke-dasharray="4,2"/>
      <!-- Long bolt -->
      <rect x="260" y="160" width="8" height="55" fill="#94a3b8" stroke="#94a3b8" stroke-width="1" rx="1"/>
      <rect x="255" y="155" width="18" height="10" fill="#94a3b8" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Length dimension arrow -->
      <line x1="280" y1="160" x2="280" y2="215" stroke="#94a3b8" stroke-width="0.5"/>
      <text x="290" y="190" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="7">longer</text>
      <text x="267" y="232" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9">Longer Bolt</text>
      <text x="267" y="242" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8">more resilient but</text>
      <text x="267" y="250" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="10">does not prevent</text>
      <text x="267" y="260" text-anchor="middle" fill="#fb923c" font-family="system-ui, sans-serif" font-size="10">rotation</text>
      <!-- Bottom note -->
      <text x="200" y="285" text-anchor="middle" fill="#f472b6" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Split lock washers: NASA-banned, Junker test proven ineffective</text>
    </svg>`,
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
