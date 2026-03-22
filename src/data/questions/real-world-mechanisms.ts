import type { Question } from '../types';

export const realWorldMechanismsQuestions: Question[] = [
  // RWM-001 — Free Text / Explanation
  {
    id: 'rwm-001',
    type: 'free-text',
    topic: 'real-world-mechanisms',
    subtopic: 'Everyday Machines',
    difficulty: 'beginner',
    question: 'How does a hydraulic car jack work? Explain the physics that lets a small hand force lift a 2-ton car.',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Reservoir / body -->
  <rect x="40" y="140" width="320" height="80" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Fluid -->
  <rect x="42" y="170" width="316" height="48" rx="2" fill="#60a5fa" opacity="0.15"/>
  <!-- Small cylinder (pump) -->
  <rect x="70" y="80" width="40" height="90" rx="2" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
  <!-- Small piston -->
  <rect x="74" y="95" width="32" height="12" rx="1" fill="#60a5fa" stroke="#60a5fa" stroke-width="1"/>
  <!-- Pump handle -->
  <line x1="90" y1="95" x2="90" y2="40" stroke="#e2e8f0" stroke-width="2.5"/>
  <line x1="90" y1="40" x2="50" y2="40" stroke="#e2e8f0" stroke-width="2.5"/>
  <!-- Hand force arrow -->
  <line x1="50" y1="40" x2="50" y2="20" stroke="#f472b6" stroke-width="2"/>
  <polygon points="46,25 54,25 50,15" fill="#f472b6"/>
  <text x="50" y="12" text-anchor="middle" fill="#f472b6" font-size="10" font-weight="bold">F = 100 N</text>
  <!-- Small piston label -->
  <text x="90" y="78" text-anchor="middle" fill="#60a5fa" font-size="10">A = 2 cm\u00B2</text>
  <!-- Large cylinder (lift) -->
  <rect x="260" y="60" width="80" height="110" rx="2" fill="#334155" stroke="#34d399" stroke-width="1.5"/>
  <!-- Large piston -->
  <rect x="264" y="75" width="72" height="15" rx="1" fill="#34d399" stroke="#34d399" stroke-width="1"/>
  <!-- Lift platform -->
  <rect x="250" y="50" width="100" height="12" rx="2" fill="#334155" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="300" y="48" text-anchor="middle" fill="#e2e8f0" font-size="10" font-weight="bold">CAR (2 ton)</text>
  <!-- Lift force arrow -->
  <line x1="300" y1="75" x2="300" y2="35" stroke="#34d399" stroke-width="2"/>
  <polygon points="296,40 304,40 300,30" fill="#34d399"/>
  <text x="355" y="42" fill="#34d399" font-size="10" font-weight="bold">F = 2000 N</text>
  <!-- Large piston label -->
  <text x="300" y="105" text-anchor="middle" fill="#34d399" font-size="10">A = 40 cm\u00B2</text>
  <!-- Fluid connection arrows -->
  <line x1="110" y1="185" x2="260" y2="185" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="6,3"/>
  <polygon points="255,182 255,188 262,185" fill="#60a5fa"/>
  <!-- Pressure label -->
  <text x="185" y="180" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="bold">P = F/A = 50 N/cm\u00B2</text>
  <text x="185" y="195" text-anchor="middle" fill="#60a5fa" font-size="10">(equal throughout fluid)</text>
  <!-- Check valve symbol -->
  <circle cx="150" cy="170" r="6" fill="none" stroke="#fb923c" stroke-width="1.2"/>
  <polygon points="147,167 153,167 150,173" fill="#fb923c"/>
  <text x="150" y="162" text-anchor="middle" fill="#fb923c" font-size="8">Check valve</text>
  <!-- Pascal's principle -->
  <text x="200" y="245" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">Pascal\u2019s Principle: P\u2081 = P\u2082</text>
  <text x="200" y="263" text-anchor="middle" fill="#e2e8f0" font-size="11">Area ratio 40:2 = 20:1 mechanical advantage</text>
  <text x="200" y="280" text-anchor="middle" fill="#94a3b8" font-size="10">Trade-off: many pumps needed (force \u00D7 distance conserved)</text>
</svg>`,
    sampleAnswer: 'A hydraulic jack uses Pascal\'s principle: pressure applied to a confined fluid is transmitted equally in all directions. The jack has two cylinders — a small one (the pump) and a large one (the lift). When you pump the handle, you push a small piston into the small cylinder, creating high pressure. This pressure is transmitted through oil to the large piston.\n\nThe mechanical advantage comes from the area ratio. If the small piston has an area of 2 cm² and the large piston has 40 cm², the area ratio is 20:1. A 100 N hand force creates 50 N/cm² pressure, which acts on the 40 cm² large piston, generating 2,000 N of lift force. Combined with the lever ratio of the pump handle (typically 5:1-10:1), the total mechanical advantage can be 100:1 to 200:1.\n\nThe trade-off: you pump many times because each pump stroke moves only a small volume of oil, and the large piston moves very little per stroke (volume conservation). You gain force at the expense of distance.',
    keyPoints: [
      'Pascal\'s principle: pressure is transmitted equally through confined fluid',
      'Mechanical advantage = area ratio of large piston to small piston',
      'Handle lever provides additional mechanical advantage',
      'Conservation of energy: force gained = distance lost (many small pumps)',
      'Check valve holds pressure between pump strokes',
    ],
    explanation: 'The hydraulic jack is one of the best everyday demonstrations of Pascal\'s principle and mechanical advantage. The force multiplication is enormous but the trade-off in distance (many small pumps) is always present — energy is conserved.',
    interviewInsight: 'This is a "explain something simple" question that tests how well you can break down a familiar mechanism into physics principles. Clear communication of mechanical advantage and the force-distance trade-off is what the interviewer wants.',
    commonMistake: 'Not explaining the trade-off — students say "it multiplies force" without mentioning that distance is sacrificed. Some forget about the handle lever ratio, which provides additional mechanical advantage.',
    tags: ['hydraulic', 'pascal', 'mechanical-advantage', 'jack', 'pressure', 'everyday'],
  },

  // RWM-002 — Multiple Choice
  {
    id: 'rwm-002',
    type: 'multiple-choice',
    topic: 'real-world-mechanisms',
    subtopic: 'Automotive Systems',
    difficulty: 'intermediate',
    question: 'In a conventional rear-wheel-drive car, what does the differential do and why is it necessary?',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Top-down view of car turning -->
  <!-- Turn arc -->
  <path d="M 300 230 A 120 120 0 0 0 300 60" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6,3"/>
  <text x="340" y="150" fill="#94a3b8" font-size="10">Turn center</text>
  <circle cx="320" cy="145" r="3" fill="#94a3b8"/>
  <!-- Car body (simplified top-down) -->
  <rect x="100" y="80" width="100" height="160" rx="15" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Front wheels -->
  <rect x="82" y="95" width="18" height="35" rx="4" fill="#94a3b8" stroke="#94a3b8" stroke-width="1"/>
  <rect x="200" y="95" width="18" height="35" rx="4" fill="#94a3b8" stroke="#94a3b8" stroke-width="1"/>
  <!-- Rear axle -->
  <line x1="91" y1="215" x2="209" y2="215" stroke="#60a5fa" stroke-width="2.5"/>
  <!-- Differential (circle in center of rear axle) -->
  <circle cx="150" cy="215" r="14" fill="#334155" stroke="#f472b6" stroke-width="2"/>
  <!-- Spider gears inside -->
  <circle cx="145" cy="215" r="4" fill="none" stroke="#f472b6" stroke-width="1"/>
  <circle cx="155" cy="215" r="4" fill="none" stroke="#f472b6" stroke-width="1"/>
  <text x="150" y="245" text-anchor="middle" fill="#f472b6" font-size="10" font-weight="bold">Differential</text>
  <!-- Rear wheels -->
  <rect x="82" y="198" width="18" height="35" rx="4" fill="#94a3b8" stroke="#60a5fa" stroke-width="1.5"/>
  <rect x="200" y="198" width="18" height="35" rx="4" fill="#94a3b8" stroke="#34d399" stroke-width="1.5"/>
  <!-- Inner wheel arc (shorter) -->
  <path d="M 91 200 A 80 80 0 0 1 91 232" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4,2"/>
  <!-- Outer wheel arc (longer) -->
  <path d="M 209 198 A 150 150 0 0 1 209 232" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,2"/>
  <!-- Speed labels -->
  <text x="60" y="220" text-anchor="end" fill="#60a5fa" font-size="10" font-weight="bold">Slower</text>
  <text x="240" y="220" fill="#34d399" font-size="10" font-weight="bold">Faster</text>
  <!-- Arc length labels -->
  <text x="55" y="235" text-anchor="end" fill="#60a5fa" font-size="9">Shorter arc</text>
  <text x="240" y="235" fill="#34d399" font-size="9">Longer arc</text>
  <!-- Driveshaft from engine -->
  <line x1="150" y1="200" x2="150" y2="170" stroke="#fb923c" stroke-width="2.5"/>
  <text x="150" y="165" text-anchor="middle" fill="#fb923c" font-size="9">From engine</text>
  <!-- Key insight -->
  <text x="150" y="273" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Splits torque while allowing different wheel speeds</text>
  <!-- Turn direction arrow -->
  <path d="M 230 140 A 40 40 0 0 1 250 120" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
  <polygon points="250,117 254,125 247,123" fill="#e2e8f0"/>
  <text x="255" y="115" fill="#e2e8f0" font-size="10">Turn</text>
</svg>`,
    options: [
      { id: 'a', text: 'It changes gear ratios for different driving speeds, like a transmission' },
      { id: 'b', text: 'It allows the left and right wheels to rotate at different speeds during turns while transmitting torque to both' },
      { id: 'c', text: 'It absorbs road shocks before they reach the driveshaft, like a shock absorber' },
      { id: 'd', text: 'It disconnects the engine from the wheels when the car is coasting to save fuel' },
    ],
    correctAnswer: 'b',
    explanation: 'When a car turns, the outer wheel travels a longer arc than the inner wheel. Without a differential, both wheels would be forced to rotate at the same speed, causing the inner wheel to scrub and skip. The differential uses a set of bevel gears (spider gears on a cross pin) that allow the output shafts to rotate at different speeds while still splitting the engine torque between them. The average speed of both wheels equals the input speed.',
    interviewInsight: 'This is a classic mechanism question. The interviewer may follow up by asking about limited-slip differentials and why a standard open differential is bad for off-road or racing.',
    realWorldConnection: 'The limitation of an open differential: if one wheel loses traction (on ice), all the torque goes to the spinning wheel and none to the wheel with grip. Limited-slip differentials solve this by adding clutches or geared coupling between the output shafts.',
    commonMistake: 'Confusing the differential with the transmission. The transmission changes gear ratios; the differential splits torque between left and right wheels.',
    tags: ['differential', 'automotive', 'turning', 'bevel-gear', 'torque-split'],
  },

  // RWM-003 — Design Decision
  {
    id: 'rwm-003',
    type: 'design-decision',
    topic: 'real-world-mechanisms',
    subtopic: 'Everyday Machines',
    difficulty: 'intermediate',
    question: 'You are designing a door closer mechanism for a commercial building. Which type do you choose?',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Door frame -->
  <rect x="180" y="30" width="12" height="200" fill="#94a3b8" stroke="#94a3b8" stroke-width="1"/>
  <!-- Door (open position, angled) -->
  <line x1="186" y1="35" x2="310" y2="90" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
  <!-- Door (closed position, dashed) -->
  <line x1="186" y1="35" x2="186" y2="175" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="172" y="185" text-anchor="end" fill="#94a3b8" font-size="9">Closed</text>
  <!-- Door closer body (overhead) -->
  <rect x="195" y="38" width="55" height="18" rx="3" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="222" y="51" text-anchor="middle" fill="#60a5fa" font-size="8">Closer</text>
  <!-- Arm mechanism -->
  <line x1="250" y1="47" x2="290" y2="65" stroke="#60a5fa" stroke-width="2"/>
  <line x1="290" y1="65" x2="305" y2="82" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="250" cy="47" r="3" fill="#60a5fa"/>
  <circle cx="290" cy="65" r="2.5" fill="#60a5fa"/>
  <circle cx="305" cy="82" r="3" fill="#60a5fa"/>
  <!-- Hinge point -->
  <circle cx="186" cy="35" r="5" fill="#f472b6" stroke="#f472b6" stroke-width="1"/>
  <text x="176" y="30" text-anchor="end" fill="#f472b6" font-size="9">Hinge</text>
  <!-- Closing arc arrow -->
  <path d="M 290 100 A 110 110 0 0 1 195 170" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="198,167 190,172 198,174" fill="#34d399"/>
  <text x="260" y="150" fill="#34d399" font-size="10">Controlled</text>
  <text x="260" y="163" fill="#34d399" font-size="10">closing</text>
  <!-- Requirements box -->
  <rect x="10" y="210" width="380" height="62" rx="4" fill="none" stroke="#94a3b8" stroke-width="1"/>
  <text x="200" y="228" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Requirements</text>
  <text x="30" y="245" fill="#fb923c" font-size="10">Door: 50 kg</text>
  <text x="140" y="245" fill="#fb923c" font-size="10">ADA: max 5 lbf</text>
  <text x="270" y="245" fill="#fb923c" font-size="10">500+ cycles/day</text>
  <text x="30" y="262" fill="#94a3b8" font-size="10">Wind resistance needed</text>
  <text x="200" y="262" fill="#94a3b8" font-size="10">Adjustable closing + latching speed</text>
</svg>`,
    context: 'The door is a heavy (50 kg) exterior door that must close reliably against wind pressure. It needs to comply with ADA accessibility requirements (max opening force 5 lbf, closing speed controlled). The building has 500+ door cycles per day.',
    designOptions: [
      {
        id: 'a',
        text: 'Overhead hydraulic door closer (like a Norton/Dorma unit)',
        tradeoffs: 'Proven, adjustable closing speed and latching speed, handles heavy doors, ADA compliant with proper adjustment. Visible hardware, requires periodic valve adjustment.',
      },
      {
        id: 'b',
        text: 'Floor-mounted concealed spring closer',
        tradeoffs: 'Aesthetically clean (hidden in floor), handles heavy doors. Expensive to install (requires floor preparation), difficult to adjust and maintain, susceptible to debris ingress.',
      },
      {
        id: 'c',
        text: 'Pneumatic screen door closer',
        tradeoffs: 'Very cheap, easy to install. But inadequate for a heavy 50 kg door, no closing speed control, not ADA compliant, short life at 500 cycles/day.',
      },
      {
        id: 'd',
        text: 'Electromagnetic hold-open with automatic release on fire alarm',
        tradeoffs: 'Holds door open for traffic flow, releases to close on alarm. Requires electrical connection, backup spring closer still needed. Ideal for fire-rated corridors but adds complexity.',
      },
    ],
    bestOption: 'a',
    evaluationCriteria: ['Ability to handle 50 kg door weight', 'ADA compliance (adjustable force and speed)', 'Durability at 500+ cycles/day', 'Maintainability and adjustability', 'Cost-effectiveness'],
    explanation: 'The overhead hydraulic door closer is the industry standard for commercial doors because it provides adjustable closing speed, latching speed, and back-check (wind resistance) in a durable, maintainable package. The hydraulic valve allows fine-tuning for ADA compliance. At 500+ cycles/day, the hydraulic mechanism handles the duty cycle far better than spring-only designs.',
    interviewInsight: 'This question tests whether you can analyze a familiar mechanism with engineering rigor. The interviewer wants to see that you consider load capacity, duty cycle, compliance requirements, and maintainability — not just "which one looks right."',
    commonMistake: 'Choosing the concealed closer for aesthetics without considering the maintenance and accessibility implications. In a commercial setting, maintainability trumps aesthetics.',
    tags: ['door-closer', 'hydraulic', 'mechanism', 'ADA', 'commercial-building', 'design'],
  },

  // RWM-004 — Multiple Choice
  {
    id: 'rwm-004',
    type: 'multiple-choice',
    topic: 'real-world-mechanisms',
    subtopic: 'Linkages & Mechanisms',
    difficulty: 'intermediate',
    question: 'A four-bar linkage has link lengths of 2, 4, 5, and 6 cm. According to Grashof\'s criterion, which statement is true?',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Ground link (frame) -->
  <line x1="80" y1="180" x2="280" y2="180" stroke="#94a3b8" stroke-width="3"/>
  <!-- Ground hatching -->
  <line x1="80" y1="185" x2="70" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="100" y1="185" x2="90" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="120" y1="185" x2="110" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="140" y1="185" x2="130" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="160" y1="185" x2="150" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="180" y1="185" x2="170" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="200" y1="185" x2="190" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="220" y1="185" x2="210" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="240" y1="185" x2="230" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="260" y1="185" x2="250" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <line x1="280" y1="185" x2="270" y2="195" stroke="#94a3b8" stroke-width="1"/>
  <!-- Link 1 (ground) label -->
  <text x="180" y="200" text-anchor="middle" fill="#94a3b8" font-size="11">Ground (d = 5 cm)</text>
  <!-- Crank (shortest link = 2cm, can fully rotate) -->
  <line x1="80" y1="180" x2="110" y2="120" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
  <!-- Rotation arc for crank -->
  <path d="M 100 180 A 40 40 0 1 1 60 180" fill="none" stroke="#f472b6" stroke-width="1" stroke-dasharray="4,3"/>
  <polygon points="62,176 58,183 65,181" fill="#f472b6"/>
  <text x="50" y="148" fill="#f472b6" font-size="10" font-weight="bold">Crank</text>
  <text x="50" y="161" fill="#f472b6" font-size="10">(S = 2 cm)</text>
  <text x="50" y="174" fill="#f472b6" font-size="10">Full rotation</text>
  <!-- Coupler link -->
  <line x1="110" y1="120" x2="280" y2="120" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
  <text x="195" y="113" text-anchor="middle" fill="#60a5fa" font-size="11">Coupler (L = 6 cm)</text>
  <!-- Rocker -->
  <line x1="280" y1="180" x2="280" y2="120" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <!-- Rocker arc -->
  <path d="M 280 140 A 20 20 0 0 1 295 160" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="310" y="145" fill="#34d399" font-size="10" font-weight="bold">Rocker</text>
  <text x="310" y="158" fill="#34d399" font-size="10">(Q = 4 cm)</text>
  <!-- Joint circles -->
  <circle cx="80" cy="180" r="5" fill="#e2e8f0" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="110" cy="120" r="5" fill="#e2e8f0" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="280" cy="120" r="5" fill="#e2e8f0" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="280" cy="180" r="5" fill="#e2e8f0" stroke="#e2e8f0" stroke-width="1"/>
  <!-- Grashof check -->
  <rect x="50" y="220" width="300" height="45" rx="4" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <text x="200" y="238" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Grashof Check: S + L \u2264 P + Q</text>
  <text x="200" y="256" text-anchor="middle" fill="#34d399" font-size="12">2 + 6 = 8 \u2264 4 + 5 = 9  \u2713 Grashof linkage</text>
</svg>`,
    options: [
      { id: 'a', text: 'It is a Grashof linkage — the shortest link can make a full rotation' },
      { id: 'b', text: 'It is a non-Grashof linkage — no link can make a full rotation (all links rock)' },
      { id: 'c', text: 'It is a change-point mechanism — it can toggle between configurations' },
      { id: 'd', text: 'Cannot be determined without knowing which link is the ground' },
    ],
    correctAnswer: 'a',
    explanation: 'Grashof\'s criterion: S + L ≤ P + Q, where S = shortest link, L = longest link, P and Q are the other two. Here: S=2, L=6, P=4, Q=5. Check: 2 + 6 = 8, and 4 + 5 = 9. Since 8 < 9, Grashof\'s inequality is satisfied. The shortest link (2 cm) can make a full rotation relative to its adjacent link. The mechanism type (crank-rocker, double-crank, or double-rocker) depends on which link is grounded.',
    interviewInsight: 'Grashof\'s criterion is a quick, fundamental test for four-bar linkage mobility. Interviewers expect immediate recall of the S+L vs P+Q comparison.',
    realWorldConnection: 'Four-bar linkages are everywhere: windshield wipers (crank-rocker), steam engine valve gear, aircraft landing gear retraction mechanisms, and robotic arms.',
    commonMistake: 'Saying the answer depends on the ground link. Grashof\'s criterion determines IF full rotation is possible — the choice of ground link determines which type of mechanism results, but that is a separate question.',
    tags: ['four-bar', 'grashof', 'linkage', 'mechanism', 'rotation', 'mobility'],
  },

  // RWM-005 — Estimation
  {
    id: 'rwm-005',
    type: 'estimation',
    topic: 'real-world-mechanisms',
    subtopic: 'Everyday Machines',
    difficulty: 'intermediate',
    question: 'Estimate the gear ratio of a hand-operated winch that allows one person to pull a 2,000 kg boat up a ramp.',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Ramp surface -->
  <line x1="50" y1="250" x2="350" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <!-- Water line -->
  <line x1="20" y1="260" x2="100" y2="260" stroke="#60a5fa" stroke-width="1.5"/>
  <path d="M 20 265 Q 35 260 50 265 T 80 265 T 100 265" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
  <!-- Boat (simplified) -->
  <path d="M 120 210 L 100 230 L 200 240 L 220 220 Z" fill="#334155" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="160" y="232" text-anchor="middle" fill="#e2e8f0" font-size="10">2,000 kg</text>
  <!-- Weight vector (down) -->
  <line x1="160" y1="240" x2="160" y2="275" stroke="#f472b6" stroke-width="1.5"/>
  <polygon points="157,275 163,275 160,282" fill="#f472b6"/>
  <text x="175" y="280" fill="#f472b6" font-size="9">W = 20,000 N</text>
  <!-- Force component along ramp -->
  <line x1="160" y1="225" x2="110" y2="240" stroke="#fb923c" stroke-width="2"/>
  <polygon points="113,237 108,243 115,242" fill="#fb923c"/>
  <text x="100" y="220" fill="#fb923c" font-size="9">F_ramp = W\u00B7sin10\u00B0</text>
  <text x="100" y="232" fill="#fb923c" font-size="9">\u2248 3,470 N</text>
  <!-- Ramp angle -->
  <path d="M 100 250 A 40 40 0 0 0 105 243" fill="none" stroke="#94a3b8" stroke-width="1"/>
  <text x="115" y="255" fill="#94a3b8" font-size="10">10\u00B0</text>
  <!-- Cable from boat to winch -->
  <line x1="220" y1="218" x2="345" y2="115" stroke="#60a5fa" stroke-width="1.5"/>
  <!-- Winch at top -->
  <circle cx="350" cy="108" r="18" fill="#334155" stroke="#34d399" stroke-width="2"/>
  <!-- Drum (inner) -->
  <circle cx="350" cy="108" r="7" fill="#334155" stroke="#34d399" stroke-width="1.5"/>
  <!-- Crank handle -->
  <line x1="350" y1="108" x2="385" y2="85" stroke="#e2e8f0" stroke-width="2.5"/>
  <circle cx="385" cy="85" r="4" fill="#e2e8f0"/>
  <!-- Hand force -->
  <line x1="385" y1="82" x2="385" y2="60" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="382,63 388,63 385,55" fill="#34d399"/>
  <text x="385" y="52" text-anchor="middle" fill="#34d399" font-size="10" font-weight="bold">~150 N</text>
  <text x="385" y="43" text-anchor="middle" fill="#34d399" font-size="9">hand force</text>
  <!-- Winch label -->
  <text x="350" y="138" text-anchor="middle" fill="#34d399" font-size="10" font-weight="bold">Winch</text>
  <!-- Calculation box -->
  <rect x="20" y="15" width="230" height="70" rx="4" fill="none" stroke="#94a3b8" stroke-width="1"/>
  <text x="135" y="33" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Required mechanical advantage:</text>
  <text x="135" y="50" text-anchor="middle" fill="#e2e8f0" font-size="11">~4,450 N / 150 N \u2248 30:1</text>
  <text x="135" y="68" text-anchor="middle" fill="#94a3b8" font-size="10">= gear ratio (5:1) \u00D7 crank leverage (6:1)</text>
</svg>`,
    hints: [
      'A person can comfortably sustain about 100-200 N of force on a crank handle',
      'The boat on the ramp has a component of gravity along the ramp — assume 10° incline',
      'Consider both the gear ratio and the crank handle leverage',
    ],
    acceptableRange: { low: 15, high: 50, unit: ':1 total mechanical advantage', bestEstimate: 30 },
    approachSteps: [
      'Boat weight = 2,000 × 9.81 ≈ 20,000 N',
      'Force along a 10° ramp = 20,000 × sin(10°) ≈ 20,000 × 0.174 ≈ 3,470 N',
      'Add rolling friction (~5% of normal force): 20,000 × cos(10°) × 0.05 ≈ 985 N',
      'Total pull force ≈ 3,470 + 985 ≈ 4,450 N',
      'Comfortable hand force: ~150 N',
      'Required mechanical advantage = 4,450 / 150 ≈ 30:1',
      'This can be achieved by a 5:1 gear ratio and a crank handle with 6:1 lever ratio (handle radius / drum radius)',
      'For example: crank arm 30 cm, drum radius 5 cm → 6:1 leverage. Gear ratio: 5:1. Total: 30:1.',
    ],
    explanation: 'A boat winch combines gear reduction with crank handle leverage to achieve the necessary mechanical advantage. The total ratio of 30:1 means pulling 30 meters of crank handle travel for every 1 meter of boat movement.',
    interviewInsight: 'This estimation tests your ability to decompose a real-world problem: resolve forces on the ramp, account for friction, calculate the required mechanical advantage, and allocate it between gears and leverage.',
    commonMistake: 'Using the full weight (20,000 N) instead of the ramp component. Also, forgetting friction, which can add 20-30% to the required force.',
    tags: ['winch', 'mechanical-advantage', 'gear-ratio', 'ramp', 'estimation', 'boat'],
  },

  // RWM-006 — Spot the Flaw
  {
    id: 'rwm-006',
    type: 'spot-the-flaw',
    topic: 'real-world-mechanisms',
    subtopic: 'Failure Case Studies',
    difficulty: 'advanced',
    question: 'Spot the flaw in this failure analysis conclusion:',
    diagram: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Bridge tower (left) -->
  <rect x="40" y="40" width="20" height="160" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Bridge tower (right) -->
  <rect x="340" y="40" width="20" height="160" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Main cable catenary -->
  <path d="M 50 50 Q 200 130 350 50" fill="none" stroke="#60a5fa" stroke-width="3"/>
  <!-- Suspender cables -->
  <line x1="110" y1="78" x2="110" y2="180" stroke="#60a5fa" stroke-width="1"/>
  <line x1="160" y1="98" x2="160" y2="180" stroke="#60a5fa" stroke-width="1"/>
  <line x1="200" y1="108" x2="200" y2="180" stroke="#60a5fa" stroke-width="1"/>
  <line x1="240" y1="98" x2="240" y2="180" stroke="#60a5fa" stroke-width="1"/>
  <line x1="290" y1="78" x2="290" y2="180" stroke="#60a5fa" stroke-width="1"/>
  <!-- Bridge deck -->
  <rect x="60" y="180" width="280" height="10" fill="#334155" stroke="#94a3b8" stroke-width="1"/>
  <!-- Cable clamp (failure point) -->
  <rect x="155" y="72" width="12" height="16" rx="2" fill="#fb923c" stroke="#fb923c" stroke-width="1"/>
  <!-- Failure point X -->
  <text x="161" y="68" text-anchor="middle" fill="#fb923c" font-size="16" font-weight="bold">X</text>
  <line x1="161" y1="55" x2="161" y2="40" stroke="#fb923c" stroke-width="1"/>
  <text x="161" y="37" text-anchor="middle" fill="#fb923c" font-size="9" font-weight="bold">Failure at clamp</text>
  <!-- Water droplets at clamp -->
  <circle cx="155" cy="90" r="2" fill="#60a5fa" opacity="0.6"/>
  <circle cx="165" cy="92" r="2" fill="#60a5fa" opacity="0.6"/>
  <text x="180" y="95" fill="#60a5fa" font-size="8">Water pooling</text>
  <!-- Three contributing factors -->
  <rect x="20" y="210" width="110" height="55" rx="4" fill="none" stroke="#fb923c" stroke-width="1.5"/>
  <text x="75" y="228" text-anchor="middle" fill="#fb923c" font-size="10" font-weight="bold">Corrosion</text>
  <text x="75" y="242" text-anchor="middle" fill="#94a3b8" font-size="9">Water + salt at</text>
  <text x="75" y="254" text-anchor="middle" fill="#94a3b8" font-size="9">cable clamp</text>
  <text x="133" y="237" fill="#e2e8f0" font-size="14" font-weight="bold">+</text>
  <rect x="145" y="210" width="110" height="55" rx="4" fill="none" stroke="#f472b6" stroke-width="1.5"/>
  <text x="200" y="228" text-anchor="middle" fill="#f472b6" font-size="10" font-weight="bold">Static stress</text>
  <text x="200" y="242" text-anchor="middle" fill="#94a3b8" font-size="9">Constant cable</text>
  <text x="200" y="254" text-anchor="middle" fill="#94a3b8" font-size="9">tension</text>
  <text x="258" y="237" fill="#e2e8f0" font-size="14" font-weight="bold">+</text>
  <rect x="270" y="210" width="110" height="55" rx="4" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <text x="325" y="228" text-anchor="middle" fill="#34d399" font-size="10" font-weight="bold">Cyclic fatigue</text>
  <text x="325" y="242" text-anchor="middle" fill="#94a3b8" font-size="9">Traffic + wind</text>
  <text x="325" y="254" text-anchor="middle" fill="#94a3b8" font-size="9">loading</text>
  <!-- Bottom text -->
  <text x="200" y="278" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Flaw: Concluded corrosion only \u2014 missed synergistic SCC/fatigue</text>
</svg>`,
    statement: 'A steel bridge cable failed after 15 years of service. Visual inspection showed a corroded region at a cable clamp where water accumulated. The failure analysis concluded that the cable failed due to corrosion only, recommending better coating and drainage as the sole corrective actions.',
    flaw: {
      text: 'The failure analysis concluded that the cable failed due to corrosion only, recommending better coating and drainage as the sole corrective actions.',
      flawIndex: 2,
      flawExplanation: 'The analysis likely missed stress corrosion cracking (SCC) or corrosion fatigue. A bridge cable is under constant tension (stress) and cyclic loading from traffic and wind (fatigue). When corrosion reduces the cross-section and creates surface pits, these pits act as stress concentrators that accelerate crack initiation. The failure mode is not pure corrosion — it is the synergy of corrosion + stress + fatigue cycling. Corrective actions must address ALL three: corrosion protection AND load verification AND fatigue life reassessment.',
    },
    correctedStatement: 'The cable failure was likely caused by corrosion fatigue or stress corrosion cracking — the combined effect of corrosion, static tension, and cyclic loading from traffic. Corrective actions should include improved corrosion protection (coating and drainage), load-path verification, fatigue reassessment of remaining cables, and inspection of all cable clamp locations for similar damage.',
    explanation: 'Corrosion rarely acts alone in structural failures. The synergy between corrosion and mechanical loading (stress corrosion cracking, corrosion fatigue, hydrogen embrittlement) is far more dangerous than corrosion alone. A complete failure analysis must consider the loading environment.',
    interviewInsight: 'This tests whether you understand that real failures are usually multi-mechanism. An interviewer asking about failure analysis wants to see that you consider the full picture: environment + loading + material.',
    commonMistake: 'Accepting a single-cause failure analysis without considering synergistic mechanisms. Corrosion fatigue is much faster than either corrosion or fatigue acting alone.',
    tags: ['failure-analysis', 'corrosion-fatigue', 'SCC', 'bridge', 'cable', 'root-cause'],
  },

  // RWM-007 — Multi-Select
  {
    id: 'rwm-007',
    type: 'multi-select',
    topic: 'real-world-mechanisms',
    subtopic: 'Automotive Systems',
    difficulty: 'intermediate',
    question: 'Which of the following happen when you press the brake pedal in a car with disc brakes and ABS? (Select all that apply)',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Brake pedal -->
  <rect x="20" y="80" width="8" height="50" rx="2" fill="#e2e8f0" stroke="#e2e8f0" stroke-width="1"/>
  <ellipse cx="24" cy="135" rx="12" ry="8" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="24" y="155" text-anchor="middle" fill="#e2e8f0" font-size="9">Pedal</text>
  <!-- Foot force arrow -->
  <line x1="24" y1="75" x2="24" y2="55" stroke="#f472b6" stroke-width="1.5"/>
  <polygon points="21,58 27,58 24,50" fill="#f472b6"/>
  <text x="24" y="47" text-anchor="middle" fill="#f472b6" font-size="9">Foot force</text>
  <!-- Arrow to booster -->
  <line x1="36" y1="105" x2="58" y2="105" stroke="#94a3b8" stroke-width="1.2"/>
  <polygon points="55,102 55,108 62,105" fill="#94a3b8"/>
  <!-- Vacuum booster -->
  <circle cx="85" cy="105" r="22" fill="#334155" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="85" y="102" text-anchor="middle" fill="#60a5fa" font-size="8" font-weight="bold">Vacuum</text>
  <text x="85" y="113" text-anchor="middle" fill="#60a5fa" font-size="8" font-weight="bold">Booster</text>
  <text x="85" y="135" text-anchor="middle" fill="#60a5fa" font-size="8">3-4x amplify</text>
  <!-- Arrow to master cylinder -->
  <line x1="107" y1="105" x2="125" y2="105" stroke="#94a3b8" stroke-width="1.2"/>
  <polygon points="122,102 122,108 129,105" fill="#94a3b8"/>
  <!-- Master cylinder -->
  <rect x="130" y="90" width="45" height="30" rx="3" fill="#334155" stroke="#f472b6" stroke-width="1.5"/>
  <text x="152" y="103" text-anchor="middle" fill="#f472b6" font-size="8" font-weight="bold">Master</text>
  <text x="152" y="114" text-anchor="middle" fill="#f472b6" font-size="8" font-weight="bold">Cylinder</text>
  <!-- Brake lines -->
  <line x1="175" y1="95" x2="210" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="175" y1="115" x2="210" y2="150" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- ABS module -->
  <rect x="210" y="85" width="45" height="35" rx="3" fill="#334155" stroke="#fb923c" stroke-width="1.5"/>
  <text x="232" y="101" text-anchor="middle" fill="#fb923c" font-size="8" font-weight="bold">ABS</text>
  <text x="232" y="113" text-anchor="middle" fill="#fb923c" font-size="8" font-weight="bold">Module</text>
  <!-- Lines to calipers -->
  <line x1="255" y1="95" x2="285" y2="60" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="255" y1="115" x2="285" y2="150" stroke="#94a3b8" stroke-width="1.2"/>
  <!-- Disc brake (top) -->
  <circle cx="320" cy="50" r="28" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="320" cy="50" r="12" fill="none" stroke="#94a3b8" stroke-width="1"/>
  <!-- Caliper (top) -->
  <path d="M 305 25 L 305 75 L 310 75 L 310 55 L 330 55 L 330 75 L 335 75 L 335 25 Z" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <!-- Pads -->
  <rect x="308" y="40" width="4" height="15" fill="#34d399"/>
  <rect x="328" y="40" width="4" height="15" fill="#34d399"/>
  <text x="320" y="88" text-anchor="middle" fill="#34d399" font-size="8">Caliper + Pads</text>
  <!-- Disc brake (bottom) -->
  <circle cx="320" cy="160" r="28" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="320" cy="160" r="12" fill="none" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 305 135 L 305 185 L 310 185 L 310 165 L 330 165 L 330 185 L 335 185 L 335 135 Z" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <rect x="308" y="150" width="4" height="15" fill="#34d399"/>
  <rect x="328" y="150" width="4" height="15" fill="#34d399"/>
  <!-- ABS note -->
  <rect x="30" y="200" width="340" height="45" rx="4" fill="none" stroke="#fb923c" stroke-width="1.2"/>
  <text x="200" y="218" text-anchor="middle" fill="#fb923c" font-size="10" font-weight="bold">ABS modulates pressure 15-20x/sec to prevent lock-up</text>
  <text x="200" y="235" text-anchor="middle" fill="#e2e8f0" font-size="10">ABS can only REDUCE pressure, never INCREASE it</text>
  <!-- Flow sequence -->
  <text x="200" y="265" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Foot \u2192 Booster \u2192 Master Cyl \u2192 ABS \u2192 Calipers \u2192 Pads \u2192 Rotor</text>
  <text x="200" y="282" text-anchor="middle" fill="#94a3b8" font-size="10">Kinetic energy \u2192 Heat (via friction)</text>
</svg>`,
    options: [
      { id: 'a', text: 'The brake pedal pushes a piston in the master cylinder, pressurizing brake fluid' },
      { id: 'b', text: 'A vacuum booster amplifies your foot force before it reaches the master cylinder' },
      { id: 'c', text: 'Brake fluid pressure pushes caliper pistons against the brake pads, which squeeze the rotor' },
      { id: 'd', text: 'The ABS system actively increases braking force above what your foot applies' },
      { id: 'e', text: 'If a wheel starts to lock, ABS rapidly modulates pressure to that wheel to maintain traction' },
    ],
    correctAnswers: ['a', 'b', 'c', 'e'],
    explanation: 'The braking sequence: (b) The vacuum booster amplifies pedal force by 3-4x. (a) This amplified force pushes the master cylinder piston, pressurizing brake fluid. (c) Pressurized fluid actuates caliper pistons, clamping pads against the rotor — friction converts kinetic energy to heat. (e) ABS monitors wheel speed sensors; if one wheel decelerates faster than the others (locking), it rapidly cycles the hydraulic pressure to that wheel (15-20 times/second) to maintain grip. Option (d) is false — ABS can only reduce or maintain braking force, never increase it beyond what the driver applies. ABS prevents lock-up but does not shorten stopping distance on dry pavement.',
    interviewInsight: 'This tests understanding of a familiar system at a mechanistic level. The key insight is that ABS is a REDUCING system — it can only cut pressure to prevent lock-up, not add more braking force.',
    realWorldConnection: 'Understanding the limitations of ABS is important for automotive engineering. ABS reduces stopping distance on slippery surfaces (by maintaining some steering control) but can actually increase stopping distance on loose gravel or fresh snow.',
    commonMistake: 'Thinking ABS increases braking force (option d). It is a safety system that MODULATES pressure to prevent wheel lock-up, maintaining steering control during hard braking.',
    tags: ['brakes', 'ABS', 'hydraulic', 'automotive', 'master-cylinder', 'disc-brake'],
  },

  // RWM-008 — What Fails First
  {
    id: 'rwm-008',
    type: 'what-fails-first',
    topic: 'real-world-mechanisms',
    subtopic: 'Failure Case Studies',
    difficulty: 'advanced',
    question: 'A residential clothes dryer is making a loud squealing noise and occasionally not tumbling. What component has likely failed first?',
    diagram: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <!-- Dryer cabinet outline -->
  <rect x="60" y="30" width="280" height="220" rx="6" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Drum (large circle) -->
  <circle cx="200" cy="130" r="85" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Drum interior hatching for rotation -->
  <path d="M 200 45 A 85 85 0 0 1 285 130" fill="none" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,5"/>
  <!-- Drum rollers (bottom, where they support the drum) -->
  <circle cx="145" cy="200" r="8" fill="#334155" stroke="#f472b6" stroke-width="2.5"/>
  <circle cx="255" cy="200" r="8" fill="#334155" stroke="#f472b6" stroke-width="2.5"/>
  <!-- Roller flat spots (wear) -->
  <line x1="138" y1="207" x2="152" y2="207" stroke="#fb923c" stroke-width="2"/>
  <line x1="248" y1="207" x2="262" y2="207" stroke="#fb923c" stroke-width="2"/>
  <!-- Roller labels -->
  <line x1="145" y1="210" x2="120" y2="240" stroke="#f472b6" stroke-width="1"/>
  <text x="80" y="245" fill="#f472b6" font-size="10" font-weight="bold">Drum rollers</text>
  <text x="80" y="258" fill="#f472b6" font-size="10">(FAIL FIRST)</text>
  <!-- Flat spot callout -->
  <line x1="255" y1="210" x2="290" y2="240" stroke="#fb923c" stroke-width="1"/>
  <text x="275" y="250" fill="#fb923c" font-size="9">Worn flat spots</text>
  <text x="275" y="262" fill="#fb923c" font-size="9">\u2192 squealing</text>
  <!-- Belt around drum -->
  <ellipse cx="200" cy="130" rx="88" ry="88" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="8,4"/>
  <!-- Motor (bottom right) -->
  <rect x="280" y="215" width="35" height="25" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1"/>
  <text x="297" y="232" text-anchor="middle" fill="#94a3b8" font-size="8">Motor</text>
  <!-- Belt path to motor -->
  <line x1="280" y1="218" x2="260" y2="210" stroke="#60a5fa" stroke-width="1.5"/>
  <!-- Belt label -->
  <text x="310" y="195" fill="#60a5fa" font-size="9">Drive belt</text>
  <!-- Failure chain -->
  <text x="200" y="288" text-anchor="middle" fill="#e2e8f0" font-size="10">Failure chain: Rollers wear \u2192 friction/squeal \u2192 belt stress \u2192 belt breaks \u2192 drum stops</text>
  <!-- Noise indicator -->
  <text x="200" y="25" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="bold">SQUEAL + intermittent tumble failure</text>
  <!-- Rotation arrow -->
  <path d="M 235 48 A 82 82 0 0 1 280 85" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
  <polygon points="278,82 284,88 282,79" fill="#94a3b8"/>
</svg>`,
    components: [
      { id: 'a', text: 'The drum belt — stretched or broken from years of cycling' },
      { id: 'b', text: 'The drum roller bearings — worn from supporting the drum weight' },
      { id: 'c', text: 'The motor — burned out from overload' },
      { id: 'd', text: 'The heating element — open circuit from thermal cycling' },
    ],
    correctAnswer: 'b',
    failureMode: 'The drum support rollers (small plastic or rubber wheels that the drum rides on) wear flat over time. The worn rollers create excessive friction and a squealing noise. As they deteriorate further, the drum sags and may bind, causing intermittent failure to tumble.',
    failureChain: [
      'Drum rollers wear from thousands of hours of supporting the rotating drum',
      'Worn rollers develop flat spots, increasing friction and causing squealing',
      'Increased friction puts higher load on the belt and motor',
      'Drum sags as rollers wear, potentially causing the belt to slip or the drum to bind',
      'If not addressed, the belt eventually breaks from the increased tension/friction',
      'If the belt breaks, the motor runs freely but the drum does not turn — a fire hazard if heating continues',
    ],
    explanation: 'Clothes dryer drum rollers are the most common wear component. They are typically small polymer or rubber wheels that support the rear (and sometimes front) of the drum. They are cheap to replace but their failure cascades into belt and motor problems if ignored.',
    interviewInsight: 'This tests practical troubleshooting of a consumer product. The interviewer wants to see that you can diagnose from symptoms (squealing = friction, intermittent tumbling = worn rollers causing binding) rather than guessing.',
    realWorldConnection: 'Appliance repair is a billion-dollar industry. Understanding wear failure progression in consumer products is relevant for product design and reliability engineering.',
    commonMistake: 'Jumping to "motor failure" for any tumbling problem. Motors are robust; the wear parts (rollers, belt, bearings) almost always fail first.',
    tags: ['appliance', 'dryer', 'bearing', 'wear', 'troubleshooting', 'consumer-product'],
  },
];
