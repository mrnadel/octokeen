import type { Unit } from '../types';

export const unit10: Unit = {
  id: 'u10-interview',
  title: 'Interview Problem Solving',
  description: 'Estimation problems, failure analysis, design trade-offs, FEA interpretation, and real-world engineering case studies.',
  color: '#14B8A6',
  icon: '🧠',
  lessons: [
    {
      id: 'u10-L1',
      title: 'Estimation Problems',
      description: 'Back-of-envelope calculations, order-of-magnitude estimation, Fermi problems, quick sanity checks.',
      icon: '🧮',
      xpReward: 25,
      questions: [
        {
          id: 'u10-L1-Q1',
          type: 'multiple-choice',
          question: 'An interviewer asks you to estimate the power needed to keep a car at highway speed. What is the structured approach they are looking for?',
          options: [
            'Look up the engine horsepower from the car\'s spec sheet and report that number',
            'Guess "about 100 kW" since that is a typical engine rating',
            'Break the problem into contributors (aerodynamic drag, rolling resistance, drivetrain losses), estimate each using known physics (drag = 1/2*rho*Cd*A*V^2, rolling = Crr*m*g), sum them, and state your assumptions clearly',
            'Calculate only aerodynamic drag since it dominates at highway speed — the other terms are negligible'
          ],
          correctIndex: 2,
          explanation: 'Interviewers want to see structured decomposition, not a single formula. The key steps: (1) Identify all contributors — aero drag (~8-10 kW at 100 km/h for a typical car), rolling resistance (~4 kW), and drivetrain losses (~15%). (2) State assumptions (Cd, frontal area, mass, Crr) and note where you got them. (3) Compute each term. (4) Sum and sanity-check against known values (a car at 100 km/h needs roughly 15-20 kW at the engine). Showing you know to include ALL contributors and can reason about their relative magnitudes is more valuable than getting a precise number.',
          hint: 'The interviewer cares about your problem-solving framework, not the exact answer.'
        },
        {
          id: 'u10-L1-Q2',
          type: 'multiple-choice',
          question: 'A steel beam deflects 5 mm under a given load. If you double the beam\'s depth (height) while keeping the width the same, by approximately what factor does the deflection decrease?',
          options: [
            '2x (halves)',
            '4x (quarters)',
            '8x (one-eighth)',
            '16x (one-sixteenth)'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="30" y="70" width="40" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="1"/><text x="50" y="105" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">b</text><line x1="25" y1="70" x2="25" y2="130" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/><line x1="22" y1="70" x2="28" y2="70" stroke="#6B7280" stroke-width="1"/><line x1="22" y1="130" x2="28" y2="130" stroke="#6B7280" stroke-width="1"/><text x="18" y="104" text-anchor="end" font-size="10" fill="#6B7280" font-family="sans-serif">h</text><rect x="120" y="40" width="40" height="120" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2" rx="1"/><text x="140" y="105" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">b</text><line x1="115" y1="40" x2="115" y2="160" stroke="#3B82F6" stroke-width="1" stroke-dasharray="3,2"/><line x1="112" y1="40" x2="118" y2="40" stroke="#3B82F6" stroke-width="1"/><line x1="112" y1="160" x2="118" y2="160" stroke="#3B82F6" stroke-width="1"/><text x="108" y="104" text-anchor="end" font-size="10" fill="#3B82F6" font-family="sans-serif">2h</text><text x="50" y="55" text-anchor="middle" font-size="10" fill="#334155" font-family="sans-serif">Original</text><text x="140" y="27" text-anchor="middle" font-size="10" fill="#3B82F6" font-family="sans-serif">Doubled</text><text x="245" y="50" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">I = bh³/12</text><text x="245" y="75" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">2h → I × 8</text><text x="245" y="100" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">δ ∝ 1/I</text><text x="245" y="130" text-anchor="middle" font-size="13" font-weight="bold" fill="#3B82F6" font-family="sans-serif">δ reduces 8×</text><text x="245" y="155" text-anchor="middle" font-size="11" fill="#6B7280" font-family="sans-serif">5 mm → 0.625 mm</text></svg>',
          explanation: 'Deflection is inversely proportional to the moment of inertia I. For a rectangular beam, I = bh^3/12. Doubling h increases I by 2^3 = 8 times. Therefore deflection decreases by a factor of 8 to about 0.625 mm. This h^3 relationship is why beam depth is the most efficient dimension to increase for stiffness. In interviews, knowing these scaling relationships lets you quickly evaluate design changes: width gives linear improvement, depth gives cubic improvement.',
          hint: 'Deflection is proportional to 1/I, and I is proportional to h^3 for a rectangular section. How does doubling h affect I?'
        },
        {
          id: 'u10-L1-Q3',
          type: 'true-false',
          question: 'For a quick sanity check: the yield strength of common structural steel (A36/S275) is approximately 250 MPa, mild steel\'s Young\'s modulus is approximately 200 GPa, and water at room temperature weighs approximately 10 kN/m^3.',
          correctAnswer: true,
          explanation: 'These are essential "anchor values" every mechanical engineer should know: A36 steel yield ~ 250 MPa (36 ksi), E_steel ~ 200 GPa (29 Msi), gamma_water ~ 9.81 kN/m^3 ~ 10 kN/m^3. Other critical values: aluminum E ~ 70 GPa, steel density ~ 7850 kg/m^3, aluminum density ~ 2700 kg/m^3, atmospheric pressure ~ 101 kPa, g ~ 9.81 m/s^2. Having these memorized enables rapid estimation and helps catch errors in calculations (sanity checking).',
          hint: 'These are fundamental "anchor numbers" that every mechanical engineer should have memorized.'
        },
        {
          id: 'u10-L1-Q4',
          type: 'multiple-choice',
          question: 'An interviewer asks: "You need a quick estimate — will this steel shelf bracket vibrate noticeably?" Without doing a full calculation, what key factors determine whether vibration is a concern?',
          options: [
            'Only the weight of the load on the shelf matters — heavier loads always vibrate more',
            'Compare the excitation frequency (foot traffic ~1-3 Hz, machinery ~10-60 Hz, HVAC ~50-120 Hz) to the bracket\'s natural frequency; if they are close, resonance amplifies vibration; thin, long brackets with heavy loads have low natural frequencies and are most susceptible',
            'Vibration only matters for rotating equipment — a shelf bracket cannot vibrate noticeably',
            'Just make the bracket thicker — that always eliminates vibration regardless of the excitation source'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="30" y1="160" x2="290" y2="160" stroke="#6B7280" stroke-width="1"/><line x1="30" y1="160" x2="30" y2="20" stroke="#6B7280" stroke-width="1"/><text x="160" y="175" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Frequency</text><text x="18" y="90" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,18,90)">Amplitude</text><path d="M40 155 Q80 150 120 145 Q140 140 155 100 Q160 40 165 100 Q170 140 190 148 Q230 155 280 158" fill="none" stroke="#334155" stroke-width="2"/><line x1="160" y1="35" x2="160" y2="160" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,3"/><text x="160" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="#EF4444" font-family="sans-serif">fn (resonance)</text><rect x="55" y="145" width="40" height="12" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1" rx="1"/><text x="75" y="140" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">1-3 Hz</text><rect x="100" y="133" width="35" height="12" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1" rx="1"/><text x="117" y="128" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">10-60</text><text x="75" y="130" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">foot traffic</text><text x="117" y="118" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">machinery</text></svg>',
          explanation: 'The key engineering judgment: vibration is a concern when the excitation frequency is near the natural frequency (resonance). For a quick mental estimate: natural frequency scales as sqrt(stiffness/mass), and for a cantilever bracket, stiffness scales as EI/L^3 while mass scales as rho*A*L. So f_n is proportional to (thickness/L^2). A thin, long bracket with a heavy load will have a low natural frequency that could coincide with foot traffic or nearby machinery. Making it thicker increases f_n (moves away from low-frequency excitations), but the reasoning about WHY — matching excitation to natural frequency — is what the interviewer wants to hear.',
          hint: 'Think about the relationship between excitation frequency and natural frequency, and what drives each.'
        },
        {
          id: 'u10-L1-Q5',
          type: 'multiple-choice',
          question: 'An interviewer asks: "How many ball bearings fit inside this room?" What is the best estimation approach?',
          options: [
            'Calculate exact room volume divided by sphere volume, no adjustments',
            'Calculate room volume, divide by sphere volume, then multiply by a packing fraction (~0.64 for random packing)',
            'Count how many bearings fit along each edge and multiply the three numbers',
            'Estimate it as "millions" without any calculation'
          ],
          correctIndex: 1,
          explanation: 'Room volume = L x W x H. Sphere volume = (4/3)*pi*r^3. Naive count = room volume / sphere volume. But the critical insight is the packing fraction: spheres cannot fill 100% of space. Random packing gives ~64% fill, FCC/HCP optimal packing gives ~74%. Applying the packing fraction: count = 0.64 x (room volume / sphere volume). For a typical room (4x5x3 m) with 10 mm bearings, this yields roughly 73 million. Showing you know the packing fraction demonstrates physics intuition. The exact answer matters less than the structured approach and awareness of the packing correction.',
          hint: 'Spheres cannot fill 100% of space. The packing fraction for random sphere packing is about 0.64.'
        },
        {
          id: 'u10-L1-Q6',
          type: 'multiple-choice',
          question: 'You are asked to sanity-check a colleague\'s calculation that a small electric motor produces 500 N*m of torque. The motor is about the size of a coffee can (roughly 100 mm diameter, 150 mm long). Is this plausible?',
          options: [
            'Yes, modern motors are very powerful for their size',
            'No — a motor that size typically produces 1-10 N*m continuously; 500 N*m would require a motor the size of a washing machine drum or a large gearbox; the calculation likely has a unit error or missed a gear ratio',
            'It depends entirely on the voltage — at high enough voltage any motor can produce 500 N*m',
            'Cannot be determined without knowing the exact motor model number'
          ],
          correctIndex: 1,
          explanation: 'Engineering sanity-checking means having calibrated intuition for physical quantities. A coffee-can-sized motor (NEMA 34 / ~90 mm frame) typically produces 1-5 N*m continuously, maybe 10-15 N*m peak. 500 N*m requires an industrial servo the size of a small barrel, or a small motor with a ~100:1 gear reduction. The most common error: confusing N*mm with N*m (factor of 1000) or forgetting a gearbox ratio. In interviews, demonstrating that you can "smell" a wrong answer — that you have physical intuition for magnitudes — is extremely valuable. Always ask yourself: "Does this number make physical sense?"',
          hint: 'Think about motors you have encountered — how big was the motor and what torque did it produce?'
        }
      ]
    },
    {
      id: 'u10-L2',
      title: 'Failure Analysis',
      description: 'Root cause analysis, failure modes (fatigue, corrosion, overload, creep), fractography basics, 8D/fishbone.',
      icon: '🔍',
      xpReward: 30,
      questions: [
        {
          id: 'u10-L2-Q1',
          type: 'multiple-choice',
          question: 'A rotating shaft fracture surface shows a smooth, flat region with beach marks (concentric arc lines) covering 80% of the cross-section, and a rough, granular final fracture zone covering 20%. What does this indicate about the loading, and what should you look for at the crack origin?',
          options: [
            'Sudden overload failure under high stress — the part was undersized for the load',
            'Fatigue failure under relatively low stress (crack grew slowly through most of the section); look for a stress concentrator at the origin: keyway, sharp fillet, corrosion pit, or machining mark',
            'Hydrogen embrittlement — the smooth region is the embrittled zone',
            'Stress corrosion cracking — the beach marks indicate cyclic environmental exposure'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><circle cx="160" cy="95" r="70" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><path d="M160 25 A70 70 0 1 0 220 140" fill="#D1D5DB" stroke="none"/><path d="M160 25 A70 70 0 0 1 220 140" fill="#F3F4F6" stroke="none"/><circle cx="160" cy="95" r="70" fill="none" stroke="#334155" stroke-width="2"/><path d="M155 35 A60 60 0 0 1 210 130" fill="none" stroke="#6B7280" stroke-width="0.8"/><path d="M152 45 A50 50 0 0 1 200 125" fill="none" stroke="#6B7280" stroke-width="0.8"/><path d="M149 55 A40 40 0 0 1 195 118" fill="none" stroke="#6B7280" stroke-width="0.8"/><path d="M148 65 A32 32 0 0 1 190 112" fill="none" stroke="#6B7280" stroke-width="0.8"/><line x1="160" y1="25" x2="165" y2="12" stroke="#EF4444" stroke-width="1.5"/><circle cx="160" cy="25" r="4" fill="#EF4444" stroke="none"/><text x="170" y="10" text-anchor="start" font-size="10" font-weight="bold" fill="#EF4444" font-family="sans-serif">Origin</text><text x="110" y="95" text-anchor="middle" font-size="10" fill="#334155" font-family="sans-serif">Smooth</text><text x="110" y="108" text-anchor="middle" font-size="10" fill="#334155" font-family="sans-serif">(80%)</text><text x="110" y="80" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Beach marks</text><text x="200" y="80" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Rough</text><text x="200" y="93" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">(20%)</text><text x="160" y="178" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Fatigue fracture surface — low nominal stress</text></svg>',
          explanation: 'Beach marks (macroscopic concentric arcs radiating from the crack origin) are the hallmark of fatigue failure. A large smooth fatigue zone (80%) relative to the rough final fracture zone (20%) indicates the nominal stress was relatively low — the crack had time to propagate through most of the section before fast fracture. High-stress fatigue shows the opposite ratio. The beach mark pattern reveals the crack origin location, which is critical for root cause analysis. At the origin, you almost always find a stress concentrator: a sharp corner, keyway, surface scratch, corrosion pit, or inclusion. Identifying this concentrator and eliminating it (adding a fillet, improving surface finish, shot peening) prevents recurrence.',
          hint: 'Beach marks indicate progressive crack growth. The ratio of fatigue zone to final fracture zone indicates the stress level.'
        },
        {
          id: 'u10-L2-Q2',
          type: 'multiple-choice',
          question: 'A stainless steel pipe carrying chloride-containing water at 80 degrees C develops branching cracks after 2 years of service with no significant wall thinning. What is the most likely failure mechanism, and what design change would you recommend?',
          options: [
            'General corrosion — switch to a thicker pipe wall',
            'Fatigue cracking from pressure cycles — reduce operating pressure',
            'Stress corrosion cracking (SCC) — the three required factors are present (susceptible austenitic SS, chloride environment, tensile stress); recommend switching to duplex stainless steel, reducing chlorides, or stress-relieving the pipe',
            'Erosion-corrosion from high flow velocity — reduce flow rate'
          ],
          correctIndex: 2,
          explanation: 'Stress corrosion cracking requires three simultaneous conditions: susceptible material (austenitic stainless steel), aggressive environment (chloride ions at elevated temperature), and tensile stress (residual or applied). Chloride-induced SCC in austenitic stainless steels is characteristically transgranular with a branching crack morphology. The absence of wall thinning rules out general corrosion and erosion. Prevention strategies address one or more of the three legs: material change (duplex SS like 2205 has much higher SCC resistance), environment change (reduce chloride concentration, lower temperature), or stress reduction (stress-relieve welds, reduce operating pressure). The best solution depends on cost, feasibility, and the specific application.',
          hint: 'Three conditions are needed: susceptible material + corrosive environment + tensile stress. Address any one to prevent it.'
        },
        {
          id: 'u10-L2-Q3',
          type: 'true-false',
          question: 'In the 8D (Eight Disciplines) problem-solving methodology, the first step is to implement a permanent corrective action.',
          correctAnswer: false,
          explanation: 'The 8D methodology follows a structured sequence: D1 (form a team), D2 (describe the problem), D3 (implement interim containment action — protect the customer), D4 (identify root cause), D5 (choose permanent corrective action), D6 (implement permanent corrective action), D7 (prevent recurrence — update systems/processes), D8 (congratulate the team). Implementing a permanent fix first (skipping root cause analysis) is a common mistake that often leads to fixing symptoms rather than root causes. The interim containment action (D3) protects customers while the team investigates.',
          hint: 'The 8D methodology starts with team formation and problem definition, not with solutions.'
        },
        {
          id: 'u10-L2-Q4',
          type: 'multiple-choice',
          question: 'Walk me through how you would approach debugging a product that fails intermittently in the field but works fine in the lab.',
          options: [
            'The field failures are user error — provide better training documentation',
            'Replicate the exact field conditions in the lab (temperature, humidity, vibration, power quality, duty cycle, orientation) and test with actual field-returned units; investigate differences between lab and field environments systematically, check for thermal cycling effects, connector fretting from vibration, or load combinations not captured in lab testing',
            'Increase the safety factor by 50% and ship the updated design — that should cover whatever is causing it',
            'Add more sensors to the product and wait for more field data before taking any action'
          ],
          correctIndex: 1,
          explanation: 'Intermittent field failures that cannot be reproduced in the lab almost always stem from environmental or usage differences. A structured approach: (1) Gather field data — failure frequency, conditions, geographic patterns, common user behaviors. (2) Compare lab vs. field environments — temperature range, humidity, vibration spectrum, power quality, duty cycle, orientation. (3) Test field-returned units (they may carry evidence of the failure mode). (4) Reproduce one environmental factor at a time to isolate the cause. Common culprits: thermal cycling causing connector fretting or solder fatigue, vibration loosening fasteners, humidity causing corrosion or swelling, or load combinations not in the original test plan. The interview insight: showing you approach this systematically rather than guessing demonstrates engineering maturity.',
          hint: 'What differences exist between the lab environment and the field that could explain intermittent behavior?'
        },
        {
          id: 'u10-L2-Q5',
          type: 'multiple-choice',
          question: 'In a fishbone (Ishikawa) diagram for manufacturing defect analysis, which of the following is NOT one of the standard "6M" categories?',
          options: [
            'Man (People)',
            'Machine',
            'Method',
            'Marketing'
          ],
          correctIndex: 3,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="20" y1="90" x2="260" y2="90" stroke="#334155" stroke-width="2.5"/><rect x="260" y="72" width="55" height="36" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5" rx="3"/><text x="287" y="94" text-anchor="middle" font-size="10" font-weight="bold" fill="#EF4444" font-family="sans-serif">Defect</text><line x1="60" y1="35" x2="90" y2="90" stroke="#334155" stroke-width="1.5"/><line x1="120" y1="35" x2="140" y2="90" stroke="#334155" stroke-width="1.5"/><line x1="190" y1="35" x2="200" y2="90" stroke="#334155" stroke-width="1.5"/><line x1="60" y1="145" x2="90" y2="90" stroke="#334155" stroke-width="1.5"/><line x1="130" y1="145" x2="150" y2="90" stroke="#334155" stroke-width="1.5"/><line x1="200" y1="145" x2="210" y2="90" stroke="#334155" stroke-width="1.5"/><text x="55" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6" font-family="sans-serif">Man</text><text x="120" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6" font-family="sans-serif">Machine</text><text x="195" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6" font-family="sans-serif">Method</text><text x="55" y="160" text-anchor="middle" font-size="10" font-weight="bold" fill="#10B981" font-family="sans-serif">Material</text><text x="130" y="160" text-anchor="middle" font-size="10" font-weight="bold" fill="#10B981" font-family="sans-serif">Measure</text><text x="205" y="160" text-anchor="middle" font-size="10" font-weight="bold" fill="#10B981" font-family="sans-serif">Mother N.</text><line x1="45" y1="50" x2="65" y2="45" stroke="#6B7280" stroke-width="1"/><line x1="105" y1="50" x2="122" y2="42" stroke="#6B7280" stroke-width="1"/><line x1="48" y1="130" x2="65" y2="137" stroke="#6B7280" stroke-width="1"/><line x1="115" y1="130" x2="130" y2="138" stroke="#6B7280" stroke-width="1"/></svg>',
          explanation: 'The 6M categories in a fishbone diagram are: Man (people/operators), Machine (equipment), Method (process/procedures), Material (raw materials/components), Measurement (inspection/calibration), and Mother Nature (environment — temperature, humidity, contamination). "Marketing" is not a standard category. The fishbone diagram is a brainstorming tool to systematically identify potential causes of a problem. Each "bone" branches into sub-causes, creating a comprehensive cause map. It is most effective when used by a cross-functional team.',
          hint: 'The 6Ms: Man, Machine, Method, Material, Measurement, and Mother Nature (Environment).'
        },
        {
          id: 'u10-L2-Q6',
          type: 'fill-blank',
          question: 'The failure analysis technique of asking "why?" repeatedly (typically five times) to drill down from symptoms to the fundamental root cause is called the ___ Whys method.',
          acceptedAnswers: ['5', 'five', 'Five', '5 Whys'],
          explanation: 'The 5 Whys method (developed by Sakichi Toyoda, used at Toyota) involves asking "Why?" iteratively to peel back layers of symptoms and reach the true root cause. Example: Bearing failed -> Why? Insufficient lubrication -> Why? Grease port blocked -> Why? No preventive maintenance schedule -> Why? No PM program for auxiliary equipment -> Root cause: gap in maintenance management system. The "5" is a guideline, not a rule — some problems need 3 iterations, others 7. The key is to keep asking until you reach a systemic cause that can be corrected.',
          hint: 'This Toyota-originated method uses repeated questioning to find the root cause.'
        }
      ]
    },
    {
      id: 'u10-L3',
      title: 'Design Trade-offs',
      description: 'Material selection (Ashby charts), cost vs performance, weight optimization, DFM vs DFA, Pugh matrix.',
      icon: '⚖️',
      xpReward: 30,
      questions: [
        {
          id: 'u10-L3-Q1',
          type: 'multiple-choice',
          question: 'An interviewer says: "I need to select a material for a lightweight stiff beam. Steel has E = 200 GPa and density 7850 kg/m^3. Aluminum has E = 70 GPa and density 2700 kg/m^3. Which is better for a bending beam?" What is the correct reasoning?',
          options: [
            'Steel — it has 3x the stiffness of aluminum, so less material is needed',
            'Aluminum — it is lighter and stiffness does not matter for beams',
            'For a beam in bending, the material index is E^(1/2)/rho (not E/rho); aluminum has a slight advantage (3.10 vs 1.80), but the real insight is that in bending, depth matters more than material because I scales with h^3',
            'They are identical because E/rho is the same for both metals (~25 GPa/(g/cm^3))'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="40" y1="155" x2="290" y2="155" stroke="#6B7280" stroke-width="1"/><line x1="40" y1="155" x2="40" y2="20" stroke="#6B7280" stroke-width="1"/><text x="165" y="175" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Density (kg/m³)</text><text x="25" y="90" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,25,90)">E (GPa)</text><circle cx="100" cy="60" r="6" fill="#3B82F6" stroke="#334155" stroke-width="1.5"/><text x="112" y="55" text-anchor="start" font-size="11" font-weight="bold" fill="#3B82F6" font-family="sans-serif">Al</text><text x="112" y="68" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">70, 2700</text><circle cx="230" cy="35" r="6" fill="#334155" stroke="#334155" stroke-width="1.5"/><text x="242" y="30" text-anchor="start" font-size="11" font-weight="bold" fill="#334155" font-family="sans-serif">Steel</text><text x="242" y="43" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">200, 7850</text><line x1="60" y1="140" x2="260" y2="40" stroke="#10B981" stroke-width="1.5" stroke-dasharray="5,3"/><text x="260" y="55" text-anchor="start" font-size="9" fill="#10B981" font-family="sans-serif">E½/ρ</text><text x="100" y="135" text-anchor="middle" font-size="10" fill="#3B82F6" font-family="sans-serif">Al: 3.10</text><text x="230" y="135" text-anchor="middle" font-size="10" fill="#334155" font-family="sans-serif">Steel: 1.80</text><text x="165" y="120" text-anchor="middle" font-size="11" fill="#10B981" font-family="sans-serif">Al wins for bending beams</text></svg>',
          explanation: 'For minimum-weight design, the correct material index depends on the loading mode. Tension/compression: E/rho (steel and aluminum are nearly equal at ~25.5). Beam bending: E^(1/2)/rho (aluminum wins: sqrt(70)/2.7 = 3.10 vs sqrt(200)/7.85 = 1.80). Plate bending: E^(1/3)/rho (aluminum wins more). But the deeper insight is that for bending, increasing beam depth (h) is far more effective than changing material, because I = bh^3/12. This is why I-beams are deep and thin, not short and thick. The interviewer wants you to know WHICH index applies to WHICH loading case and to understand the geometric alternative.',
          hint: 'The material index changes with loading mode: E/rho for tension, E^(1/2)/rho for beam bending.'
        },
        {
          id: 'u10-L3-Q2',
          type: 'multiple-choice',
          question: 'A Pugh matrix is used for concept selection. What is its key advantage over other decision methods?',
          options: [
            'It provides exact numerical optimization of design parameters',
            'It enables systematic comparison of multiple design concepts against weighted criteria relative to a baseline (datum) design',
            'It eliminates the need for engineering judgment in design selection',
            'It automatically generates the optimal design solution'
          ],
          correctIndex: 1,
          explanation: 'The Pugh matrix compares design concepts against a reference (datum) design using criteria scored as better (+), same (S), or worse (-). Advantages: it forces explicit evaluation of each concept against multiple criteria, identifies the strongest concepts, and often reveals hybrid solutions by combining the best features of top-ranked concepts. It does not eliminate judgment — the criteria selection and weighting still require engineering experience. It is a structured framework for making design decisions transparent and defensible.',
          hint: 'The Pugh matrix compares alternatives to a datum using +/S/- scores across multiple criteria.'
        },
        {
          id: 'u10-L3-Q3',
          type: 'true-false',
          question: 'Design for Assembly (DFA) primarily focuses on reducing the total number of parts in a product, while Design for Manufacturing (DFM) focuses on making each individual part easier and cheaper to produce.',
          correctAnswer: true,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="15" y="25" width="140" height="130" fill="none" stroke="#3B82F6" stroke-width="2" rx="4"/><text x="85" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#3B82F6" font-family="sans-serif">DFA</text><rect x="30" y="40" width="25" height="20" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><rect x="60" y="40" width="25" height="20" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><rect x="90" y="40" width="25" height="20" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><rect x="120" y="40" width="25" height="20" fill="#EF4444" stroke="#EF4444" stroke-width="1.5" rx="2" opacity="0.3"/><line x1="120" y1="38" x2="147" y2="62" stroke="#EF4444" stroke-width="2"/><text x="85" y="80" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Reduce part count</text><text x="85" y="95" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Different material?</text><text x="85" y="108" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Relative motion?</text><text x="85" y="121" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Must be separate?</text><text x="85" y="148" text-anchor="middle" font-size="10" fill="#3B82F6" font-family="sans-serif">If 3x No → eliminate</text><rect x="170" y="25" width="140" height="130" fill="none" stroke="#10B981" stroke-width="2" rx="4"/><text x="240" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#10B981" font-family="sans-serif">DFM</text><rect x="195" y="45" width="90" height="35" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="240" y="58" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">Each part simpler</text><text x="240" y="70" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">& cheaper to make</text><text x="240" y="100" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Relax tolerances</text><text x="240" y="115" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Fewer setups</text><text x="240" y="130" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Standard tooling</text><text x="240" y="148" text-anchor="middle" font-size="10" fill="#10B981" font-family="sans-serif">30-50% cost savings</text></svg>',
          explanation: 'DFA aims to minimize part count by asking three questions for each part: Does it move relative to adjacent parts? Does it need to be different material? Does it need to be separate for assembly/service? If the answer to all three is "no," the part is a candidate for elimination or combination. DFM focuses on individual parts: avoiding tight tolerances, reducing machining setups, designing for the intended process. Together, DFMA reduces product cost by 30-50% typically. Boothroyd-Dewhurst DFMA is the most widely used methodology.',
          hint: 'DFA reduces the number of parts; DFM simplifies each remaining part.'
        },
        {
          id: 'u10-L3-Q4',
          type: 'multiple-choice',
          question: 'An interviewer asks: "You need to reduce the cost of a machined part by 30%. Walk me through your approach." Which response demonstrates the best engineering thinking?',
          options: [
            'Use cheaper material — this is always the biggest cost driver',
            'Reduce all tolerances by 30% to decrease machining time',
            'Systematically analyze the part for material change, tolerance relaxation on non-critical features, reduced number of machining setups, and potential process change (e.g., casting + machining instead of machining from billet)',
            'Switch to 3D printing — additive manufacturing is always cheaper than machining'
          ],
          correctIndex: 2,
          explanation: 'A systematic approach considers all cost drivers: material cost (can a cheaper alloy or near-net-shape blank reduce material waste?), machining time (can non-critical tolerances be relaxed to allow faster feeds or fewer passes?), setup time (can features be redesigned to reduce the number of fixturing setups?), and process substitution (would casting/forging + finish machining be cheaper at this volume?). Single-focus answers miss significant savings opportunities. In interviews, structured problem-solving methodology matters as much as technical knowledge.',
          hint: 'Good engineering is systematic — consider material, tolerances, setups, and process alternatives.'
        },
        {
          id: 'u10-L3-Q5',
          type: 'multiple-choice',
          question: 'You are designing a consumer product bracket that could be made from sheet metal, die casting, or injection-molded plastic. Production volume is 50,000 units/year. How do you approach the material and process selection?',
          options: [
            'Always choose the cheapest material — injection-molded plastic is the obvious answer',
            'Always choose the strongest material — die cast aluminum guarantees structural performance',
            'Evaluate each option against the functional requirements (load, temperature, environment), then compare unit cost at the production volume (tooling amortization + piece cost), lead time, and secondary operations; the right answer depends on the specific performance requirements and cost targets',
            'Pick whatever the previous version of the product used — changing materials is too risky'
          ],
          correctIndex: 2,
          explanation: 'Material and process selection is always context-dependent. At 50,000/year: injection molding has high tooling cost ($10-50K) but very low piece cost; die casting has moderate tooling cost ($20-80K) and moderate piece cost; sheet metal has low tooling cost ($2-10K) and moderate piece cost. But cost alone does not decide: if the bracket sees 80 degrees C, many plastics lose stiffness; if it needs electrical grounding, metal is required; if it has complex 3D geometry, casting or molding beats sheet metal. The structured approach: first filter by functional requirements (eliminate options that cannot meet the spec), then optimize on cost, weight, and lead time among the viable options.',
          hint: 'The right process depends on volume, performance requirements, geometry complexity, and cost targets — not just one factor.'
        },
        {
          id: 'u10-L3-Q6',
          type: 'fill-blank',
          question: 'The material selection charts that plot one material property against another (e.g., strength vs. density), enabling systematic material comparison, are called ___ charts.',
          acceptedAnswers: ['Ashby', 'ashby', 'Ashby material', 'Cambridge'],
          explanation: 'Ashby charts (developed by Prof. Mike Ashby at Cambridge University) plot material property pairs on log-log scales, with materials grouped by family (metals, polymers, ceramics, composites). Guideline slopes on these charts represent material indices for specific design objectives (e.g., minimum weight for given stiffness). The CES EduPack software implements these charts with a database of thousands of materials. Ashby charts are the standard tool for the screening stage of systematic material selection in mechanical design.',
          hint: 'Named after the Cambridge professor who developed this systematic approach to material selection.'
        }
      ]
    },
    {
      id: 'u10-L4',
      title: 'FEA & Simulation',
      description: 'Mesh quality, boundary conditions, convergence, element types, interpreting stress results, singularities.',
      icon: '💻',
      xpReward: 25,
      questions: [
        {
          id: 'u10-L4-Q1',
          type: 'multiple-choice',
          question: 'In an FEA stress analysis, you observe that the maximum stress at a sharp re-entrant corner keeps increasing as you refine the mesh. Your manager asks if the part will fail at that location. What is your response?',
          options: [
            'Yes, the stress is extremely high and increasing — the part will definitely fail there',
            'The model has diverged and all results are invalid — start over',
            'The sharp corner creates a stress singularity where theoretical elastic stress is infinite; the FEA result at that exact point is not physically meaningful; either add a fillet radius to get a convergent result, evaluate stress slightly away from the corner, or use fracture mechanics if a crack-like feature is intended',
            'Just use the stress from the coarsest mesh — that is the most conservative answer'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="30" y="30" width="120" height="80" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><rect x="150" y="60" width="60" height="50" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><rect x="140" y="55" width="15" height="15" fill="#EF4444" stroke="#EF4444" stroke-width="1" opacity="0.8"/><rect x="133" y="48" width="25" height="25" fill="#FEE2E2" stroke="#EF4444" stroke-width="1" opacity="0.4" rx="1"/><text x="148" y="42" text-anchor="middle" font-size="9" font-weight="bold" fill="#EF4444" font-family="sans-serif">Singularity</text><text x="148" y="30" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">σ → ∞</text><line x1="230" y1="30" x2="300" y2="30" stroke="#6B7280" stroke-width="1"/><line x1="230" y1="30" x2="230" y2="130" stroke="#6B7280" stroke-width="1"/><text x="265" y="25" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">σ_max</text><text x="225" y="80" text-anchor="end" font-size="9" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,225,80)">Mesh →</text><path d="M235 120 L250 100 L265 75 L280 55 L295 35" fill="none" stroke="#EF4444" stroke-width="2"/><text x="280" y="125" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">No convergence!</text><text x="160" y="140" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Fix: add fillet radius or evaluate away from corner</text><path d="M42 110 Q42 118 50 118" fill="none" stroke="#10B981" stroke-width="2"/><text x="46" y="132" text-anchor="middle" font-size="9" fill="#10B981" font-family="sans-serif">Fillet</text></svg>',
          explanation: 'Sharp re-entrant corners create stress singularities where the theoretical elastic stress is mathematically infinite. As the mesh is refined, FEA increasingly captures this singularity and the peak stress grows without bound — it never converges. This does NOT mean the real part will fail there, because: (1) real parts have small fillet radii, not infinitely sharp corners, (2) local plasticity limits the actual stress, and (3) the stress drops rapidly away from the singularity. The engineering response: add the actual fillet radius (the stress will then converge), or evaluate stress at a distance equal to one fillet radius from the corner, or use sub-modeling. Reporting the singular stress value as a design result is a common junior engineer mistake.',
          hint: 'What happens to the theoretical stress at a perfectly sharp corner in elasticity theory?'
        },
        {
          id: 'u10-L4-Q2',
          type: 'multiple-choice',
          question: 'You are modeling a bolted joint in FEA. Which approach is most appropriate for a structural-level analysis where you need stress distribution in the joined parts but not detailed bolt thread stress?',
          options: [
            'Model every thread of every bolt with fine mesh',
            'Use beam elements or rigid connectors to represent bolts with appropriate preload, and connect to the flanges via contact or coupling',
            'Ignore the bolts entirely and model the joint as a single continuous body',
            'Apply a fixed boundary condition at all bolt hole locations'
          ],
          correctIndex: 1,
          explanation: 'Modeling individual bolt threads is computationally expensive and unnecessary for structural analysis. Beam elements or connector elements (with preload) accurately capture the load transfer and stiffness of the joint while keeping model size manageable. They connect to the flange surfaces via coupling constraints (distributing or kinematic). Ignoring bolts entirely loses the preload and clamping effects. Fixed BCs at bolt holes overconstrain the model. Detailed thread modeling is only justified for bolt fatigue or thread failure studies at the component level.',
          hint: 'Think about the appropriate level of modeling detail for the question being asked.'
        },
        {
          id: 'u10-L4-Q3',
          type: 'true-false',
          question: 'A mesh convergence study is performed by progressively refining the mesh and checking that the key result (e.g., maximum von Mises stress at a specific location) stabilizes to within an acceptable tolerance (typically 2-5%).',
          correctAnswer: true,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="40" y1="155" x2="290" y2="155" stroke="#6B7280" stroke-width="1"/><line x1="40" y1="155" x2="40" y2="20" stroke="#6B7280" stroke-width="1"/><text x="165" y="175" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Number of elements →</text><text x="25" y="90" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,25,90)">σ (MPa)</text><circle cx="70" cy="130" r="4" fill="#334155"/><circle cx="110" cy="95" r="4" fill="#334155"/><circle cx="150" cy="70" r="4" fill="#334155"/><circle cx="190" cy="62" r="4" fill="#334155"/><circle cx="230" cy="59" r="4" fill="#10B981"/><circle cx="270" cy="58" r="4" fill="#10B981"/><path d="M70 130 Q90 110 110 95 Q130 80 150 70 Q170 64 190 62 Q210 60 230 59 Q250 58 270 58" fill="none" stroke="#334155" stroke-width="2"/><line x1="180" y1="55" x2="290" y2="55" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,3"/><rect x="195" y="25" width="95" height="25" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1" rx="3"/><text x="242" y="42" text-anchor="middle" font-size="10" fill="#3B82F6" font-family="sans-serif">Converged (&lt;2%)</text><text x="70" y="147" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Coarse</text><text x="270" y="147" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Fine</text></svg>',
          explanation: 'Mesh convergence ensures that results are independent of mesh density. The process: run the analysis with an initial mesh, refine (globally or locally), re-run, and compare key results. When the result changes by less than the acceptance criterion (typically 2-5%) between successive refinements, the mesh is considered converged. Important: always check convergence at the location of interest (not the overall maximum, which may be at a singularity). Report convergence information in any FEA study — results without convergence evidence are not credible.',
          hint: 'Convergence means further mesh refinement does not significantly change the results.'
        },
        {
          id: 'u10-L4-Q4',
          type: 'multiple-choice',
          question: 'A colleague shows you an FEA result of a bracket with a maximum von Mises stress of 350 MPa in 6061-T6 aluminum (yield = 276 MPa). They conclude the bracket will fail. Is their conclusion correct?',
          options: [
            'Yes — stress exceeds yield, so the bracket will definitely break in service',
            'No — first check WHERE the 350 MPa occurs: if it is at a singularity (sharp corner without fillet), the value is an artifact; if it is at a stress concentration with a real fillet, check if local yielding is acceptable (it often is for static loads if the high-stress zone is small and ductile redistribution occurs); also verify boundary conditions and mesh convergence',
            'No — von Mises stress is not relevant for aluminum; use maximum principal stress instead',
            'Yes — any FEA stress above yield means immediate failure'
          ],
          correctIndex: 1,
          explanation: 'The correct response requires engineering judgment, not just comparing numbers. Key checks: (1) Location — is the peak at a singularity? If so, the number is meaningless. (2) If real, is the high-stress zone highly localized? For ductile materials under static load, local yielding at a stress concentration redistributes load without causing failure (Neuber\'s rule). (3) Is the boundary condition realistic? Overly rigid BCs create artificial stress concentrations. (4) Is the mesh converged at that location? The conclusion "stress > yield = failure" is a common oversimplification. Real engineering requires understanding what the number means in context.',
          hint: 'Before accepting a peak stress value, check where it is, whether the mesh is converged there, and whether local yielding matters.'
        },
        {
          id: 'u10-L4-Q5',
          type: 'multiple-choice',
          question: 'After running an FEA analysis, you check the reaction forces at the boundary conditions. They sum to 450 N, but the total applied load is 500 N. What does this indicate?',
          options: [
            'The analysis is correct — a 10% imbalance is normal',
            'There is a force equilibrium error indicating a problem with the model (inertial effects, contact issues, insufficient constraints, or solver failure)',
            'The missing 50 N was absorbed by material damping',
            'This is expected due to stress stiffening effects'
          ],
          correctIndex: 1,
          explanation: 'In a static analysis, reaction forces must balance applied forces (Newton\'s third law). A 10% imbalance (50 N) indicates a significant problem. Common causes: inadequately constrained rigid body motion (the model "flies away" and the solver applies artificial forces), contact surfaces not properly engaged, inertia relief settings, unconverged nonlinear solution, or numerical issues. The first check in any FEA analysis should be global force and moment equilibrium — if reactions do not balance applied loads to within 0.1-1%, the results cannot be trusted.',
          hint: 'In static equilibrium, the sum of all forces equals zero. What does an imbalance tell you about the model?'
        },
        {
          id: 'u10-L4-Q6',
          type: 'fill-blank',
          question: 'The process of progressively refining the FEA mesh and verifying that results stabilize is called a mesh ___ study.',
          acceptedAnswers: ['convergence', 'Convergence', 'refinement', 'sensitivity', 'independence'],
          explanation: 'A mesh convergence (or mesh independence/sensitivity) study is a mandatory part of any credible FEA analysis. It demonstrates that the numerical discretization is fine enough to capture the physical behavior accurately. Without it, results could be mesh-dependent artifacts. Best practice: plot the key result vs. element count or characteristic element size, and show asymptotic convergence. Adaptive meshing in modern solvers can automate this process for simple analyses, but complex models still require manual convergence studies.',
          hint: 'This study proves that making the mesh finer does not significantly change the answer.'
        }
      ]
    },
    {
      id: 'u10-L5',
      title: 'Case Studies & Scenarios',
      description: 'Real-world engineering problems, troubleshooting scenarios, design review situations, cross-disciplinary thinking.',
      icon: '📋',
      xpReward: 30,
      questions: [
        {
          id: 'u10-L5-Q1',
          type: 'multiple-choice',
          question: 'A production line reports that 5% of machined aluminum housings are failing a leak test after assembly. The leak occurs at the O-ring seal interface. What should be your first investigation step?',
          options: [
            'Redesign the O-ring groove to a different size',
            'Switch to a more expensive seal material',
            'Measure the O-ring groove dimensions and surface finish on failed vs. passing parts to identify the out-of-spec parameter',
            'Increase the clamping force on all assemblies by 50%'
          ],
          correctIndex: 2,
          explanation: 'Before changing the design, gather data to identify the root cause. Measure groove dimensions (width, depth, diameter), surface finish (Ra), and inspect O-rings on failed parts. The 5% failure rate suggests a dimension at the edge of tolerance causing intermittent issues. Common causes: groove depth too shallow (insufficient O-ring squeeze), surface finish too rough (leak path), groove diameter out of tolerance, or contamination. Data-driven investigation prevents expensive design changes that may not address the actual root cause. This diagnostic approach is what interviewers want to see.',
          hint: 'In quality problems, always gather data first — measure before making changes.'
        },
        {
          id: 'u10-L5-Q2',
          type: 'multiple-choice',
          question: 'During a design review, a colleague proposes using a 3 mm thick aluminum bracket where your stress analysis shows a safety factor of 1.1 against yield. The part is for a consumer product with dynamic loads. What is your recommendation?',
          options: [
            'Approve it — a safety factor above 1.0 means it will not yield',
            'Reject it — a safety factor of 1.1 is dangerously low for a dynamically loaded consumer product; recommend increasing to at least 2.0-3.0 considering load uncertainty, material variability, fatigue, and liability',
            'Approve it but add a warning label',
            'Reject it and recommend switching to steel'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="30" y="30" width="70" height="120" fill="none" stroke="#334155" stroke-width="2" rx="3"/><text x="65" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155" font-family="sans-serif">SF = 1.1</text><rect x="30" y="135" width="70" height="15" fill="#EF4444" stroke="none" opacity="0.6" rx="2"/><text x="65" y="147" text-anchor="middle" font-size="9" fill="white" font-family="sans-serif">σ_applied</text><line x1="30" y1="135" x2="100" y2="135" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,3"/><text x="105" y="138" text-anchor="start" font-size="9" fill="#EF4444" font-family="sans-serif">σ_yield</text><rect x="140" y="30" width="70" height="120" fill="none" stroke="#334155" stroke-width="2" rx="3"/><text x="175" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#10B981" font-family="sans-serif">SF = 2.5</text><rect x="140" y="100" width="70" height="50" fill="#10B981" stroke="none" opacity="0.3" rx="2"/><text x="175" y="130" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">σ_applied</text><line x1="140" y1="100" x2="210" y2="100" stroke="#10B981" stroke-width="2" stroke-dasharray="4,3"/><text x="230" y="55" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">Margins for:</text><text x="230" y="70" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">- Load uncertainty</text><text x="230" y="85" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">- Material variability</text><text x="230" y="100" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">- Fatigue derating</text><text x="230" y="115" text-anchor="start" font-size="9" fill="#6B7280" font-family="sans-serif">- Abuse loads</text><text x="160" y="170" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Dynamic consumer product requires SF = 2.0–3.0</text></svg>',
          explanation: 'A safety factor of 1.1 against yield under dynamic loading is unacceptable for a consumer product. Reasons: load estimates have uncertainty (+/- 20-30% typical), material properties vary (+/- 10%), fatigue strength is lower than static yield (typically 40-50% of UTS), and consumer products face unpredictable abuse loads. Industry standards typically require SF = 2.0-4.0 for dynamic consumer products. Additionally, product liability exposure makes low safety factors a business risk. The recommendation should include specific options: increase thickness, add stiffening ribs, or change cross-section geometry.',
          hint: 'Consider all the uncertainties: load estimation, material variability, fatigue, abuse conditions, and liability.'
        },
        {
          id: 'u10-L5-Q3',
          type: 'true-false',
          question: 'When troubleshooting a vibration problem on a rotating machine, increasing the support structure stiffness will always reduce the vibration amplitude.',
          correctAnswer: false,
          explanation: 'Increasing stiffness changes the natural frequency of the system, which could move it closer to the excitation frequency (making vibration worse) or further away (making it better). If the operating speed is below the current natural frequency, increasing stiffness (raising the natural frequency further away) will help. But if the operating speed is above the natural frequency, increasing stiffness could bring the natural frequency UP toward the operating speed, potentially passing through resonance. The correct approach is to first identify the excitation frequency and current natural frequencies before modifying stiffness.',
          hint: 'Think about what happens when you change the natural frequency relative to the excitation frequency.'
        },
        {
          id: 'u10-L5-Q4',
          type: 'multiple-choice',
          question: 'A pump in a chemical plant loses flow rate gradually over 6 months, then suddenly fails to pump. No leak is visible. What is the most likely diagnosis, and what inspection would confirm it?',
          options: [
            'The motor has reversed direction due to wiring fault — check phase rotation',
            'Progressive impeller erosion/corrosion has reduced performance until the pump can no longer overcome system head; confirm by inspecting the impeller for material loss and comparing the current pump curve to the original',
            'Air in the suction line from day one — check for suction leaks',
            'The discharge valve was closed during startup — check valve position'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="40" y1="155" x2="290" y2="155" stroke="#6B7280" stroke-width="1"/><line x1="40" y1="155" x2="40" y2="20" stroke="#6B7280" stroke-width="1"/><text x="165" y="175" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Flow rate (Q)</text><text x="25" y="90" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,25,90)">Head (H)</text><path d="M50 40 Q100 42 150 55 Q200 75 260 140" fill="none" stroke="#334155" stroke-width="2"/><text x="260" y="135" text-anchor="start" font-size="9" fill="#334155" font-family="sans-serif">New</text><path d="M50 65 Q100 70 140 85 Q180 110 220 150" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="5,3"/><text x="222" y="148" text-anchor="start" font-size="9" fill="#EF4444" font-family="sans-serif">Worn</text><path d="M50 130 Q120 110 180 95 Q220 85 270 80" fill="none" stroke="#3B82F6" stroke-width="1.5"/><text x="272" y="78" text-anchor="start" font-size="9" fill="#3B82F6" font-family="sans-serif">System</text><circle cx="175" cy="88" r="4" fill="#334155"/><circle cx="135" cy="100" r="4" fill="#EF4444"/><text x="170" y="25" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Pump curve shifts down with erosion</text></svg>',
          explanation: 'The gradual degradation over months followed by complete failure is characteristic of progressive impeller damage (erosion, corrosion, or cavitation damage). As the impeller loses material, the pump curve shifts downward — less head and flow at each operating point. Eventually, the pump can no longer overcome the system static head, and flow drops to zero. Confirming evidence: visual inspection shows material loss on impeller vanes, performance test shows a degraded pump curve, and vibration data would have shown increasing imbalance (from uneven material loss) in the months prior. This scenario is classic for pumps handling abrasive or corrosive fluids.',
          hint: 'The gradual decline rules out sudden events. What progressive damage mechanism reduces pump performance?'
        },
        {
          id: 'u10-L5-Q5',
          type: 'multiple-choice',
          question: 'An interviewer presents a design with three possible materials and asks you to justify your selection. Which response format best demonstrates engineering judgment?',
          options: [
            'Pick the cheapest option and explain the cost savings',
            'Pick the strongest option and explain it is the safest choice',
            'Present a structured comparison addressing mechanical requirements, environmental conditions, manufacturability, cost, and availability, then recommend based on the critical design drivers with clear rationale',
            'Ask the interviewer which one they prefer'
          ],
          correctIndex: 2,
          explanation: 'Engineering material selection requires balancing multiple factors. A structured comparison should address: Does each material meet the minimum mechanical requirements (strength, stiffness, fatigue life)? Is it compatible with the operating environment (temperature, corrosion, UV)? Can it be manufactured into the required shape with required tolerances? What are the relative costs (material + processing)? Is it available in the needed form? The recommendation should clearly state which factor is the primary design driver and why the selected material best satisfies it. This structured thinking is exactly what interviewers evaluate.',
          hint: 'Engineering decisions require balancing multiple factors — show your structured decision-making process.'
        },
        {
          id: 'u10-L5-Q6',
          type: 'fill-blank',
          question: 'The engineering practice of evaluating a design to ensure it can be economically manufactured with available processes is called Design for ___ (abbreviated DFM).',
          acceptedAnswers: ['Manufacturing', 'manufacturing', 'Manufacturability', 'manufacturability', 'Manufacture'],
          explanation: 'Design for Manufacturing (DFM) ensures that part designs are compatible with the intended manufacturing processes at acceptable cost and quality. Key DFM principles include: using standard tooling sizes, avoiding features that require special setups, maintaining uniform wall thickness (casting/molding), specifying tolerances no tighter than necessary, and designing features accessible to cutting tools. DFM is most effective when applied early in the design phase, where 70-80% of manufacturing cost is determined. It requires collaboration between design and manufacturing engineers.',
          hint: 'This DFM practice ensures designs can be produced efficiently and economically.'
        }
      ]
    },
    {
      id: 'u10-L6',
      title: 'Standards & Professional Practice',
      description: 'ISO/ASME standards, quality management systems, engineering change management, risk assessment, and project management for engineers.',
      icon: '📜',
      xpReward: 25,
      questions: [
        {
          id: 'u10-L6-Q1',
          type: 'multiple-choice',
          question: 'A defense/aerospace company requires a quality management system that goes beyond ISO 9001 with additional requirements for product safety, configuration management, and risk management. Which standard should they certify to?',
          options: [
            'ISO 14001 — Environmental Management',
            'AS9100 — Quality Management Systems for Aviation, Space, and Defense',
            'ISO 45001 — Occupational Health and Safety',
            'IATF 16949 — Automotive Quality Management'
          ],
          correctIndex: 1,
          explanation: 'AS9100 (current revision AS9100D, based on ISO 9001:2015 structure) adds aerospace-specific requirements to ISO 9001 including: configuration management, product safety, counterfeit parts prevention, risk management throughout the product lifecycle, special process control (welding, heat treatment, NDT), and first article inspection (FAI per AS9102). Nearly all aerospace and defense contractors require AS9100 certification from their supply chain. It is audited by accredited registrars under the IAQG (International Aerospace Quality Group) OASIS database.',
          hint: 'This standard is the aerospace/defense extension of ISO 9001, adding product safety and configuration management.'
        },
        {
          id: 'u10-L6-Q2',
          type: 'multiple-choice',
          question: 'An engineer is designing a pressure vessel to operate at 15 bar and 300 degrees C. Which ASME code section governs the design rules for unfired pressure vessels, and what is the primary design approach it uses?',
          options: [
            'ASME BPVC Section VIII — design by rule (Division 1) or design by analysis (Division 2), using allowable stress tables for the material at the design temperature',
            'ASME B31.1 — power piping code, using wall thickness formulas based on operating pressure',
            'ASME BPVC Section III — nuclear component rules',
            'ASME Y14.5 — dimensioning and tolerancing standard'
          ],
          correctIndex: 0,
          explanation: 'ASME BPVC Section VIII covers unfired pressure vessels. Division 1 uses "design by rule" with established formulas (e.g., t = PR/(SE - 0.6P) for cylindrical shells), pre-computed allowable stresses, and standard configurations. Division 2 uses "design by analysis" with detailed stress categorization (primary, secondary, peak) and allows higher allowable stresses in exchange for more rigorous analysis (typically FEA). Division 2 often results in thinner, lighter vessels but requires more engineering effort. The designer must select the appropriate material from the code\'s allowable stress tables at the design temperature.',
          hint: 'BPVC stands for Boiler and Pressure Vessel Code. Section VIII specifically addresses non-nuclear, unfired vessels.'
        },
        {
          id: 'u10-L6-Q3',
          type: 'multiple-choice',
          question: 'A drawing created per ISO standards uses a first-angle projection symbol (the truncated cone). An American colleague used to ASME Y14.5 / third-angle projection reviews it. What is the key difference they must be aware of to avoid misinterpretation?',
          options: [
            'There is no difference — ISO and ASME use identical projection methods',
            'In first-angle projection (ISO default), the view is placed on the opposite side from the viewing direction (right side view appears on the LEFT), which is reversed from third-angle projection (ASME default) where the right side view appears on the RIGHT',
            'ISO uses metric units and ASME uses imperial — projection method is the same',
            'First-angle projection only shows two views; third-angle projection requires three'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><text x="95" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155" font-family="sans-serif">1st Angle (ISO)</text><rect x="50" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><polygon points="70,50 80,55 80,80 60,80 60,55" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1"/><text x="70" y="70" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">Front</text><rect x="5" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="25" y="70" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">Right</text><text x="25" y="100" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">→ appears LEFT</text><rect x="95" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="115" y="70" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">Left</text><rect x="50" y="90" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="70" y="115" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">Top</text><text x="245" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155" font-family="sans-serif">3rd Angle (ASME)</text><rect x="200" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><polygon points="220,50 230,55 230,80 210,80 210,55" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1"/><text x="220" y="70" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">Front</text><rect x="245" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="265" y="70" text-anchor="middle" font-size="9" fill="#10B981" font-family="sans-serif">Right</text><text x="265" y="100" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">→ appears RIGHT</text><rect x="155" y="45" width="40" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="175" y="70" text-anchor="middle" font-size="9" fill="#10B981" font-family="sans-serif">Left</text><rect x="200" y="25" width="40" height="18" fill="#E2E8F0" stroke="#334155" stroke-width="1.5" rx="2"/><text x="220" y="38" text-anchor="middle" font-size="8" fill="#10B981" font-family="sans-serif">Top</text><text x="160" y="155" text-anchor="middle" font-size="10" fill="#EF4444" font-family="sans-serif">Views are mirrored — check the projection symbol!</text></svg>',
          explanation: 'In first-angle projection (default in most of Europe and Asia per ISO 128), the object is conceptually placed between the observer and the projection plane — so the right side view appears to the LEFT of the front view. In third-angle projection (default in the US/Canada per ASME Y14.3), the projection plane is between the observer and the object — the right side view appears to the RIGHT. Misreading the projection convention causes left-right or top-bottom mirror errors in manufacturing. Always check the projection symbol in the title block.',
          hint: 'The projection symbol (truncated cone) in the title block tells you which convention is used. Think about where the side views are placed relative to the front view.'
        },
        {
          id: 'u10-L6-Q4',
          type: 'true-false',
          question: 'In the engineering change process, an ECR (Engineering Change Request) must be approved and converted into an ECO (Engineering Change Order) before any design changes are implemented in released production drawings.',
          correctAnswer: true,
          explanation: 'The ECR/ECO process is a formal change management system required by most quality standards (ISO 9001, AS9100). An ECR documents the proposed change, its justification (cost reduction, defect fix, performance improvement), and impact assessment (affected parts, tooling, inventory, qualification testing). After cross-functional review (design, manufacturing, quality, procurement), an approved ECR becomes an ECO, which authorizes the actual drawing and BOM revisions, triggers revision letter updates, and establishes effectivity (when the change takes effect in production). Bypassing this process risks uncontrolled changes, configuration mismatches, and audit nonconformances.',
          hint: 'Think about the two-stage gate: first propose and assess (ECR), then authorize and implement (ECO).'
        },
        {
          id: 'u10-L6-Q5',
          type: 'multiple-choice',
          question: 'During a DFMEA review, a failure mode has Severity = 9 (safety impact), Occurrence = 2 (rare), and Detection = 8 (hard to detect before reaching the customer). Two engineers disagree on the priority: one says the low Occurrence means it is low risk, the other says the high Severity demands action regardless. Who is right?',
          options: [
            'The first engineer — low Occurrence means the risk is acceptable regardless of Severity',
            'Neither — just calculate the RPN (9 x 2 x 8 = 144) and if it is below 200, no action is needed',
            'The second engineer — modern FMEA practice (AIAG-VDA) prioritizes Severity first; any safety-related failure mode (Severity 8-10) requires action regardless of Occurrence, and the poor Detection rating (8) makes it worse because failures will reach the customer undetected',
            'Both are wrong — only Detection matters because that is what the company can control'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="20" y="20" width="280" height="25" fill="#334155" stroke="none" rx="3"/><text x="55" y="37" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="sans-serif">Severity</text><text x="130" y="37" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="sans-serif">Occurrence</text><text x="210" y="37" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="sans-serif">Detection</text><text x="278" y="37" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="sans-serif">RPN</text><rect x="20" y="48" width="280" height="28" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5" rx="3"/><text x="55" y="66" text-anchor="middle" font-size="13" font-weight="bold" fill="#EF4444" font-family="sans-serif">9</text><text x="130" y="66" text-anchor="middle" font-size="13" fill="#10B981" font-family="sans-serif">2</text><text x="210" y="66" text-anchor="middle" font-size="13" font-weight="bold" fill="#EF4444" font-family="sans-serif">8</text><text x="278" y="66" text-anchor="middle" font-size="12" fill="#334155" font-family="sans-serif">144</text><text x="55" y="95" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">Safety!</text><text x="130" y="95" text-anchor="middle" font-size="9" fill="#10B981" font-family="sans-serif">Rare</text><text x="210" y="95" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">Hard to detect</text><rect x="30" y="110" width="260" height="25" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" rx="3"/><text x="160" y="127" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400E" font-family="sans-serif">AIAG-VDA: Severity 8-10 = HIGH priority (action required)</text><text x="160" y="155" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">RPN alone can mask safety risks — prioritize Severity first</text></svg>',
          explanation: 'Modern FMEA methodology (AIAG-VDA FMEA Handbook, 2019) moved away from RPN precisely because it can mask high-severity risks. A failure with S=9, O=2, D=8 has RPN=144, which might seem moderate. But it represents a rare safety event that is almost undetectable — exactly the type of failure that causes recalls and injuries. The AIAG-VDA Action Priority (AP) matrix classifies this as HIGH priority requiring mandatory action. The old RPN approach allowed engineers to "game" the numbers by arguing low Occurrence offsets high Severity, which led to inadequate risk management. Severity-first thinking is now the standard.',
          hint: 'Think about which is worse: a frequent cosmetic defect or a rare but undetectable safety failure.'
        },
        {
          id: 'u10-L6-Q6',
          type: 'fill-blank',
          question: 'In project scheduling, the longest sequence of dependent tasks that determines the minimum project duration is called the ___ path.',
          acceptedAnswers: ['critical', 'Critical'],
          explanation: 'The critical path is the longest chain of dependent activities in a project network; any delay on a critical-path task directly delays the project completion date. Tasks not on the critical path have "float" (slack) — they can be delayed without affecting the overall deadline. Critical path method (CPM) analysis helps engineers identify which tasks to prioritize and where to allocate resources. In engineering projects, the critical path often runs through long-lead procurement items (castings, custom forgings), qualification testing, or regulatory approvals rather than through the design tasks themselves.',
          hint: 'This scheduling concept identifies which chain of tasks determines the minimum total project duration — any delay on this path delays the whole project.'
        }
      ]
    }
  ]
};
