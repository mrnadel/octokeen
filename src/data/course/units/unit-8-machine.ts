import type { Unit } from '../types';

export const unit8: Unit = {
  id: 'u8-machine',
  title: 'Machine Design',
  description: 'Shafts, bearings, gears, fasteners, springs, and seals — core machine element design for mechanical engineers.',
  color: '#6366F1',
  icon: '⚙️',
  lessons: [
    {
      id: 'u8-L1',
      title: 'Shafts & Keys',
      description: 'Shaft design for bending+torsion, keyway stress concentration, ASME shaft code, critical speed, whirling.',
      icon: '🔑',
      xpReward: 25,
      questions: [
        {
          id: 'u8-L1-Q1',
          type: 'multiple-choice',
          question: 'A shaft broke at a keyway location. The fracture surface shows smooth beach marks radiating from the keyway corner, with a small rough final fracture zone. What does this tell you about the failure, and what design change would you recommend?',
          options: [
            'The shaft was overloaded in a single event. Recommend increasing the shaft diameter to handle higher static loads.',
            'Fatigue failure initiated at the stress concentration from the keyway corner. Recommend increasing the keyway fillet radius, using a sled-runner end keyway, or switching to a spline connection to distribute load more evenly.',
            'The key was too loose, causing the shaft to twist and shear at the keyway. Recommend using a tighter-fitting key with an interference fit.',
            'Corrosion weakened the shaft at the keyway. Recommend switching to stainless steel or adding a protective coating.'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah1" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker></defs><rect x="40" y="60" width="240" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="8"/><text x="160" y="95" text-anchor="middle" font-size="12" fill="#1E293B" font-family="sans-serif">Shaft</text><rect x="120" y="42" width="80" height="18" fill="#CBD5E1" stroke="#334155" stroke-width="2"/><text x="160" y="55" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Key</text><rect x="120" y="60" width="80" height="15" fill="#94A3B8" stroke="#334155" stroke-width="1.5"/><text x="160" y="72" text-anchor="middle" font-size="8" fill="#1E293B" font-family="sans-serif">Keyway</text><circle cx="120" cy="75" r="8" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="3"/><text x="90" y="78" text-anchor="end" font-size="9" fill="#EF4444" font-family="sans-serif">Kt = 2-3</text><circle cx="200" cy="75" r="8" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="3"/><text x="230" y="78" font-size="9" fill="#EF4444" font-family="sans-serif">Kt = 2-3</text><line x1="160" y1="125" x2="160" y2="155" stroke="#EF4444" stroke-width="2" marker-end="url(#ah1)"/><text x="165" y="165" font-size="10" fill="#EF4444" font-family="sans-serif">Bending load</text><text x="50" y="25" font-size="10" fill="#6B7280" font-family="sans-serif">Stress concentrations</text><text x="50" y="37" font-size="10" fill="#6B7280" font-family="sans-serif">at keyway corners</text></svg>',
          explanation: 'Beach marks are the definitive indicator of fatigue failure. The crack originated at the keyway corner — a classic stress concentration site (Kt = 2.0-3.0). In a rotating shaft, bending creates fully reversed stress, and the keyway corner amplifies this stress by 2-3x, dramatically reducing fatigue life. Solutions: (1) increase the fillet radius at the keyway bottom and ends to reduce Kt, (2) use a sled-runner end keyway instead of a profile (Profil) end — the gradual runout reduces stress concentration, (3) for high-fatigue applications, replace the keyway entirely with an involute spline that distributes torque uniformly around the circumference, (4) shot-peen the keyway to introduce compressive residual stress. Simply making the shaft larger treats the symptom, not the root cause.',
          hint: 'Beach marks point to the failure mode. The location (keyway corner) points to the root cause. Think about what feature of the keyway makes it a fatigue problem.'
        },
        {
          id: 'u8-L1-Q2',
          type: 'multiple-choice',
          question: 'You are designing a shaft that must transmit 50 kW at 1500 RPM with a combined bending moment. Using the distortion energy theory, the minimum diameter calculates to 38 mm. What practical considerations would make you select a larger standard diameter?',
          options: [
            'No adjustment needed — 38 mm is the answer from the formula, so use 38 mm',
            'Round up to 40 mm for standard sizing. Additionally, account for keyway stress concentration (adds 25-50% to required size), bearing bore availability, manufacturing tolerances, and potential future load increases.',
            'Double it to 76 mm — always use a safety factor of 2.0 on calculated shaft diameter',
            'Only round up to the nearest mm (39 mm) — going larger wastes material and adds weight'
          ],
          correctIndex: 1,
          explanation: 'Shaft sizing never stops at the formula result. Practical considerations include: (1) Standard sizes — shafts and bearings come in standard bore increments (30, 35, 40, 45 mm), so 40 mm is the next standard size. (2) Keyway derating — if the shaft has a keyway, the stress concentration factor (Kt = 2-3) effectively reduces fatigue strength by 25-50%, requiring a larger diameter at that section. (3) Bearing fit — the shaft must match available bearing bore sizes. (4) Deflection limits — even if stress is acceptable, excessive shaft deflection can cause gear misalignment (limit ~0.5 mm/m for gears) or bearing edge loading. (5) Stepped diameters — shoulders for bearing and gear location require the nominal diameter to be larger than the minimum at the critical section. Always check both strength and stiffness criteria.',
          hint: 'The calculated minimum diameter is just the starting point. What real-world factors force you to go larger?'
        },
        {
          id: 'u8-L1-Q3',
          type: 'true-false',
          question: 'A shaft operating above its first critical speed (supercritical operation) will always experience dangerous vibrations and should be avoided in all engineering applications.',
          correctAnswer: false,
          explanation: 'Supercritical shaft operation is routine in many applications — turbomachinery, centrifugal separators, and dental drills operate above the first critical speed. The shaft passes through the critical speed during startup/shutdown, where vibrations peak, but at steady-state supercritical speeds the shaft self-centers (the center of mass moves inward). The key is passing through the critical speed quickly and having adequate damping. Many modern designs intentionally operate between the first and second critical speeds.',
          hint: 'Consider what happens to shaft deflection as speed continues to increase past the critical speed.'
        },
        {
          id: 'u8-L1-Q4',
          type: 'multiple-choice',
          question: 'In the ASME shaft design code, the shock/fatigue factor for bending (K_b) is always set higher than the factor for torsion (K_t) for the same loading condition. Why is bending treated as more severe than torsion in a rotating shaft?',
          options: [
            'Bending forces are always larger than torsional forces in real machines',
            'In a rotating shaft, a fixed bending load creates fully reversed stress (tension-compression each revolution), while torsion from a steady power source creates constant (non-reversed) shear stress',
            'Bending causes axial deflection that damages bearings, while torsion only causes angular twist that is less harmful',
            'The bending factor is arbitrary — older codes used equal factors, and modern codes should too'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker></defs><rect x="50" y="75" width="220" height="20" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="4"/><polygon points="50,100 60,120 40,120" fill="#334155"/><circle cx="270" cy="100" r="8" fill="none" stroke="#334155" stroke-width="2"/><line x1="265" y1="100" x2="275" y2="100" stroke="#334155" stroke-width="1.5"/><line x1="160" y1="75" x2="160" y2="40" stroke="#EF4444" stroke-width="2" marker-end="url(#ah2)"/><text x="165" y="40" font-size="10" fill="#EF4444" font-family="sans-serif">Gear load F</text><circle cx="160" cy="60" r="15" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3"/><path d="M 150,48 Q 160,45 170,48" fill="none" stroke="#3B82F6" stroke-width="1.5"/><text x="180" y="55" font-size="9" fill="#3B82F6" font-family="sans-serif">Rotation</text><text x="40" y="140" font-size="10" fill="#1E293B" font-family="sans-serif">Top fiber: T&#8594;C&#8594;T each rev</text><text x="40" y="155" font-size="10" fill="#EF4444" font-family="sans-serif">= Fully reversed (R = -1)</text><text x="40" y="170" font-size="10" fill="#6B7280" font-family="sans-serif">Torsion: constant if steady power</text><text x="40" y="20" font-size="10" fill="#6B7280" font-family="sans-serif">Static bending &#8594; cyclic stress</text><text x="40" y="32" font-size="10" fill="#6B7280" font-family="sans-serif">in a rotating shaft</text></svg>',
          explanation: 'This is a key insight in shaft design. Consider a horizontal shaft with a gear load pushing downward at midspan: the top fiber is in tension and the bottom in compression. As the shaft rotates 180°, those fibers swap — the previously tensioned fiber is now compressed. So a constant (static) bending load creates fully reversed cyclic stress in a rotating shaft, which is the most damaging fatigue condition (R = -1). Torsion from a steady motor, however, produces constant shear stress — not cyclic. That is why K_b = 1.5 even for "no shock" (to account for the fully reversed nature), while K_t = 1.0 for the same condition. If the torque also fluctuates (e.g., reciprocating compressor), K_t increases accordingly.',
          hint: 'Think about what a single point on the shaft surface experiences as the shaft rotates under a fixed bending load. Is it constant or cyclic?'
        },
        {
          id: 'u8-L1-Q5',
          type: 'multiple-choice',
          question: 'A centrifuge operates at 12,000 RPM but its first critical speed is calculated at 8,000 RPM. The operations team is worried about running above the critical speed. Is this design safe, and what must be ensured during operation?',
          options: [
            'This is unsafe — no shaft should ever operate above its first critical speed. Redesign the shaft to raise the critical speed above 12,000 RPM.',
            'This is safe in principle — supercritical operation is routine in turbomachinery and centrifuges. The shaft self-centers above the critical speed. However, it must pass through the critical speed quickly during startup/shutdown, and adequate damping must be provided.',
            'This is only safe if the shaft is perfectly balanced — even 1 gram of imbalance will cause immediate failure at any supercritical speed',
            'This is safe because the critical speed only matters at exactly 8,000 RPM — at higher speeds the vibration stops entirely on its own'
          ],
          correctIndex: 1,
          explanation: 'Supercritical operation (above the first critical speed) is completely routine in many high-speed machines: gas turbines, dental drills, centrifuges, and turbochargers all operate between the first and second critical speeds. At speeds above the critical, the shaft undergoes a phase inversion — the center of mass moves inside the geometric center, and the shaft effectively self-centers. The dangerous moment is passing THROUGH the critical speed during startup and shutdown, where resonance amplifies vibration. Solutions: (1) accelerate quickly through the critical speed range, (2) provide damping (squeeze-film dampers, elastomeric bearing mounts), (3) ensure adequate bearing clearance for the transient vibration, and (4) maintain good balance (though perfect balance is not required). The design should ensure the operating speed is at least 20% above the critical speed to avoid resonance.',
          hint: 'Think about what actually happens above the critical speed — does vibration keep increasing, or does something change?'
        },
        {
          id: 'u8-L1-Q6',
          type: 'fill-blank',
          question: 'The phenomenon where a rotating shaft deflects laterally at a specific speed equal to its natural frequency is called ___ (or whirling).',
          acceptedAnswers: ['critical speed', 'Critical speed', 'critical speed resonance', 'whirling', 'Whirling', 'whirl'],
          explanation: 'Critical speed (whirling) occurs when the shaft rotation speed coincides with a natural frequency of lateral vibration. At this speed, even small imbalances cause large lateral deflections due to resonance. The shaft bows outward and, if damping is insufficient, deflections grow until failure. Proper design ensures operating speed is at least 20% away from any critical speed, or provides adequate damping for supercritical operation.',
          hint: 'This occurs when rotational speed matches the natural frequency of transverse vibration.'
        }
      ]
    },
    {
      id: 'u8-L2',
      title: 'Bearings & Lubrication',
      description: 'Ball/roller/plain bearings, L10 life calculation, bearing selection, viscosity, lubrication regimes.',
      icon: '🛞',
      xpReward: 25,
      questions: [
        {
          id: 'u8-L2-Q1',
          type: 'multiple-choice',
          question: 'A ball bearing has a basic dynamic load rating C = 25 kN and operates under an equivalent radial load P = 5 kN. What is the L10 life in millions of revolutions?',
          options: [
            '25 million revolutions',
            '125 million revolutions',
            '625 million revolutions',
            '3125 million revolutions'
          ],
          correctIndex: 1,
          explanation: 'For ball bearings: L10 = (C/P)^p where p = 3 for ball bearings. L10 = (25/5)^3 = 5^3 = 125 million revolutions. For roller bearings, p = 10/3. The L10 life means 90% of a population of identical bearings will survive this many revolutions. At 1000 RPM, this equals 125×10⁶/(1000×60) = 2083 hours. Adjusted life (L10a) accounts for reliability, material, and lubrication factors.',
          hint: 'L10 = (C/P)^p with p = 3 for ball bearings. L10 is the life at 90% reliability.'
        },
        {
          id: 'u8-L2-Q2',
          type: 'multiple-choice',
          question: 'When would you choose a deep groove ball bearing over a tapered roller bearing, and vice versa? Consider a conveyor pulley shaft (heavy radial load, minimal axial load, low speed) vs. an electric motor shaft (moderate load, high speed, small axial loads).',
          options: [
            'Use tapered roller bearings for both — they are superior in every way and the cost difference is negligible',
            'Use deep groove ball bearings for both — their lower friction makes them universally preferred',
            'Conveyor pulley: tapered roller (handles heavy radial loads, accommodates mounting misalignment). Motor shaft: deep groove ball (lower friction at high speed, handles the moderate radial + small axial load in a single bearing, simpler mounting).',
            'The choice depends only on the catalog life calculation — whichever bearing gives longer L10 life at the required size is correct'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="15" y="40" width="130" height="120" fill="none" stroke="#6B7280" stroke-width="1" stroke-dasharray="4" rx="4"/><text x="80" y="30" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Deep Groove Ball</text><circle cx="80" cy="100" r="35" fill="none" stroke="#334155" stroke-width="2"/><circle cx="80" cy="100" r="20" fill="none" stroke="#334155" stroke-width="2"/><circle cx="80" cy="66" r="5" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><circle cx="104" cy="78" r="5" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><circle cx="56" cy="78" r="5" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><circle cx="110" cy="100" r="5" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><circle cx="50" cy="100" r="5" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><text x="80" y="148" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Low friction, high speed</text><rect x="175" y="40" width="130" height="120" fill="none" stroke="#6B7280" stroke-width="1" stroke-dasharray="4" rx="4"/><text x="240" y="30" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Tapered Roller</text><line x1="205" y1="70" x2="275" y2="70" stroke="#334155" stroke-width="2"/><line x1="200" y1="130" x2="280" y2="130" stroke="#334155" stroke-width="2"/><line x1="215" y1="78" x2="205" y2="122" stroke="#334155" stroke-width="2"/><line x1="235" y1="78" x2="225" y2="122" stroke="#334155" stroke-width="2"/><line x1="255" y1="78" x2="245" y2="122" stroke="#334155" stroke-width="2"/><line x1="275" y1="78" x2="265" y2="122" stroke="#334155" stroke-width="2"/><text x="240" y="148" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Heavy loads, combined R+A</text></svg>',
          explanation: 'Bearing selection is about matching the bearing type to the application requirements. Deep groove ball bearings: (1) lowest friction, best for high speeds, (2) handle moderate radial loads and small axial loads in both directions, (3) simple to mount (no preload adjustment needed), (4) widely available and inexpensive. They are the default choice for electric motors, pumps, and general machinery. Tapered roller bearings: (1) handle heavy combined radial and axial loads, (2) separate inner/outer races allow preload adjustment, (3) higher friction limits top speed, (4) must be used in opposing pairs to handle axial load in both directions. They are standard for heavy-duty applications like gearboxes, vehicle wheel hubs, and conveyor pulleys. Other factors: spherical roller bearings add misalignment tolerance for heavy loads; cylindrical rollers maximize radial capacity when no axial load exists.',
          hint: 'Match the bearing characteristics (load capacity, speed rating, friction, mounting complexity) to each application\'s specific requirements.'
        },
        {
          id: 'u8-L2-Q3',
          type: 'true-false',
          question: 'In hydrodynamic (journal) bearing lubrication, the load-carrying capacity increases with increasing lubricant viscosity, shaft speed, and decreasing bearing clearance.',
          correctAnswer: true,
          explanation: 'The Sommerfeld number S = (μNd)/(P × c²) governs hydrodynamic bearing performance, where μ is viscosity, N is speed, d is diameter, P is pressure, and c is clearance. Load capacity increases with higher viscosity and speed (more oil is dragged into the converging wedge) and with smaller clearance (higher pressure buildup). However, very small clearance causes excessive temperature rise, and very high viscosity increases power loss. The Raimondi-Boyd charts relate the Sommerfeld number to bearing performance parameters.',
          hint: 'Think about the hydrodynamic wedge effect — what parameters increase the pressure generated?'
        },
        {
          id: 'u8-L2-Q4',
          type: 'multiple-choice',
          question: 'A plain (journal) bearing in a large pump is showing intermittent high temperatures and occasional metal-to-metal contact noise at startup, but runs smoothly at full speed. Using the Stribeck curve concept, explain what is happening and propose a solution.',
          options: [
            'The bearing clearance is too large, causing the shaft to rattle at all speeds. Solution: replace with a tighter-clearance bearing.',
            'At low startup speeds, the bearing operates in boundary/mixed lubrication (metal contact, high friction) because there is not enough speed to build a full hydrodynamic film. At full speed, the film develops and contact ceases. Solution: install a hydrostatic jacking pump that pressurizes the bearing at startup, or use a bearing material with better boundary lubrication properties.',
            'The lubricant viscosity is too high, causing overheating at startup when flow is restricted. Solution: switch to a lower-viscosity oil.',
            'The shaft is misaligned and contacts the bearing only during startup acceleration. Solution: realign the shaft.'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="50" y1="155" x2="290" y2="155" stroke="#334155" stroke-width="2"/><line x1="50" y1="155" x2="50" y2="15" stroke="#334155" stroke-width="2"/><text x="170" y="175" text-anchor="middle" font-size="11" fill="#6B7280" font-family="sans-serif">Bearing parameter (&#956;N/P)</text><text x="18" y="85" text-anchor="middle" font-size="11" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,18,85)">Friction</text><path d="M 60,40 Q 90,140 120,145 Q 150,148 180,130 Q 230,100 280,70" fill="none" stroke="#334155" stroke-width="2.5"/><line x1="95" y1="20" x2="95" y2="155" stroke="#6B7280" stroke-width="1" stroke-dasharray="4"/><line x1="155" y1="20" x2="155" y2="155" stroke="#6B7280" stroke-width="1" stroke-dasharray="4"/><rect x="55" y="20" width="40" height="16" fill="#FEE2E2" rx="2"/><text x="75" y="32" text-anchor="middle" font-size="8" fill="#EF4444" font-family="sans-serif">Boundary</text><rect x="100" y="20" width="50" height="16" fill="#FEF3C7" rx="2"/><text x="125" y="32" text-anchor="middle" font-size="8" fill="#F97316" font-family="sans-serif">Mixed</text><rect x="160" y="20" width="90" height="16" fill="#DCFCE7" rx="2"/><text x="205" y="32" text-anchor="middle" font-size="8" fill="#16A34A" font-family="sans-serif">Hydrodynamic</text><circle cx="70" cy="70" r="4" fill="#EF4444"/><text x="75" y="65" font-size="9" fill="#EF4444" font-family="sans-serif">Startup</text></svg>',
          explanation: 'This is a classic Stribeck curve problem. Hydrodynamic bearings require relative motion between shaft and bearing to drag lubricant into the converging wedge and build pressure. At zero or low speed (startup/shutdown), there is insufficient velocity to generate a full fluid film — the bearing operates in the boundary or mixed lubrication regime where metal-to-metal contact occurs. Solutions: (1) hydrostatic lift (jacking oil) — an external pump pressurizes the bearing oil film before the shaft starts rotating, lifting it off the bearing surface. This is standard practice for large turbomachinery. (2) Use bearing materials with good boundary lubrication properties (Babbitt, which has embedded soft phases that smear under contact). (3) Slow-roll the shaft before applying load. (4) Use a lower-viscosity oil at startup temperature to improve initial film formation — though this is counterintuitive, as the operating temperature viscosity must still be adequate.',
          hint: 'On the Stribeck curve, low speed means low bearing parameter (μN/P), which puts you in boundary/mixed lubrication territory.'
        },
        {
          id: 'u8-L2-Q5',
          type: 'multiple-choice',
          question: 'A bearing in a gearbox failed prematurely. Inspection reveals spalling (flaking) on the inner raceway that is concentrated in a narrow band around the circumference. The outer race looks normal. What does this wear pattern tell you about the root cause?',
          options: [
            'Normal fatigue wear from exceeding L10 life — the bearing simply needs to be replaced with a higher-rated one',
            'Contaminated lubricant — abrasive particles caused accelerated surface damage on the inner race',
            'Misalignment — the load is concentrated on a narrow band instead of being distributed across the full raceway width, indicating the shaft or housing is tilted relative to the bearing axis',
            'Electrical discharge damage (fluting) — stray currents passed through the bearing, arcing across the lubricant film'
          ],
          correctIndex: 2,
          explanation: 'The wear pattern is diagnostic. Normal loading distributes contact across most of the raceway width. A narrow wear band indicates the load is concentrated in one area, which is the signature of misalignment — the inner and outer raceways are not parallel. The balls or rollers are forced to carry the entire load on a narrow contact strip, dramatically increasing contact stress and reducing life. The inner race typically shows this first because it rotates and experiences more stress cycles. Diagnosis: check shaft deflection, housing bore alignment, and mounting shoulder squareness. Contamination would cause random scratching everywhere, not a concentrated band. Electrical fluting creates evenly spaced washboard-like grooves. Simply upsizing the bearing does not fix a misalignment problem — the narrow contact band would still exist.',
          hint: 'The key clue is that the spalling is in a narrow band, not spread across the full width. What loading condition concentrates contact into a narrow strip?'
        },
        {
          id: 'u8-L2-Q6',
          type: 'fill-blank',
          question: 'The bearing life calculation that represents the number of revolutions at which 90% of bearings will survive is called L___ life.',
          acceptedAnswers: ['10', 'L10', 'ten'],
          explanation: 'L10 (pronounced "L-ten") life is the rated life at 90% reliability — meaning 10% of bearings in a population are expected to fail before reaching this life. The ISO 281 standard defines L10 = (C/P)^p million revolutions. For higher reliability, life adjustment factors are applied: L1 (99% reliability) is about 0.21 × L10, L5 (95%) is about 0.62 × L10. Modern adjusted rating life (L10a or Lnm) also accounts for lubrication conditions and contamination.',
          hint: 'The subscript represents the percentage of bearings that are expected to fail.'
        }
      ]
    },
    {
      id: 'u8-L3',
      title: 'Gears & Power Transmission',
      description: 'Spur/helical/bevel/worm gears, Lewis equation, gear ratios, tooth contact stress, gear trains, efficiency.',
      icon: '⚙️',
      xpReward: 30,
      questions: [
        {
          id: 'u8-L3-Q1',
          type: 'multiple-choice',
          question: 'A spur gear pair has a pinion with 20 teeth and a gear with 80 teeth. If the pinion rotates at 1200 RPM and transmits 10 kW, what is the torque on the gear?',
          options: [
            '79.6 N·m',
            '159.2 N·m',
            '318.4 N·m',
            '636.6 N·m'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><circle cx="110" cy="90" r="40" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 3"/><circle cx="110" cy="90" r="3" fill="#334155"/><text x="110" y="80" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Pinion</text><text x="110" y="105" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Z=20</text><circle cx="230" cy="90" r="70" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 3"/><circle cx="230" cy="90" r="3" fill="#334155"/><text x="230" y="80" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Gear</text><text x="230" y="105" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Z=80</text><line x1="148" y1="82" x2="162" y2="82" stroke="#334155" stroke-width="3"/><line x1="148" y1="90" x2="162" y2="90" stroke="#334155" stroke-width="3"/><line x1="148" y1="98" x2="162" y2="98" stroke="#334155" stroke-width="3"/><circle cx="155" cy="90" r="3" fill="#EF4444"/><text x="155" y="118" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">Pitch point</text><path d="M 95,55 Q 85,50 90,45" fill="none" stroke="#3B82F6" stroke-width="1.5"/><text x="75" y="48" font-size="9" fill="#3B82F6" font-family="sans-serif">1200 RPM</text><path d="M 260,35 Q 270,30 275,35" fill="none" stroke="#3B82F6" stroke-width="1.5"/><text x="255" y="28" font-size="9" fill="#3B82F6" font-family="sans-serif">300 RPM</text><text x="160" y="170" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Ratio = 80/20 = 4:1</text></svg>',
          explanation: 'Gear ratio = N_gear/N_pinion = 80/20 = 4. Gear speed = 1200/4 = 300 RPM. Torque on pinion: T_p = P/ω = 10000/(1200 × 2π/60) = 10000/125.66 = 79.6 N·m. Torque on gear: T_g = T_p × gear ratio = 79.6 × 4 = 318.4 N·m. Alternatively, T_g = P/(ω_g) = 10000/(300 × 2π/60) = 318.4 N·m. The gear amplifies torque by the gear ratio while reducing speed by the same factor (ignoring friction losses).',
          hint: 'Power is constant (P = Tω). Use the gear ratio to find the gear speed, then calculate torque.'
        },
        {
          id: 'u8-L3-Q2',
          type: 'multiple-choice',
          question: 'Gears in a gearbox are showing pitting on the tooth flanks after 6 months of service. The gears were designed for a 5-year life. What are the possible causes, and how would you investigate?',
          options: [
            'The gear teeth are too thin — pitting is caused by bending stress exceeding the material strength. Solution: redesign with a larger module.',
            'Pitting is surface contact fatigue caused by Hertzian stress exceeding the surface endurance limit. Investigate: lubricant quality/viscosity, actual vs. design loads, gear alignment (uneven face loading), surface hardness, and whether the gear material/heat treatment matches the contact stress requirements.',
            'Pitting is caused by abrasive wear from contaminated oil. The only investigation needed is an oil sample analysis — if the oil is clean, the gears are fine.',
            'Pitting always occurs on new gears during break-in and is not a concern. The pits will smooth out over time as the surfaces conform.'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah3" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker></defs><path d="M 60,160 Q 70,100 80,80 Q 90,60 100,50 Q 115,40 130,50 Q 140,60 150,80 Q 160,100 170,160" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><path d="M 150,10 Q 160,70 170,90 Q 180,110 190,120 Q 205,130 220,120 Q 230,110 240,90 Q 250,70 260,10" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><circle cx="165" cy="85" r="4" fill="#EF4444"/><text x="175" y="80" font-size="10" fill="#EF4444" font-family="sans-serif">Contact</text><text x="175" y="92" font-size="10" fill="#EF4444" font-family="sans-serif">point</text><line x1="165" y1="90" x2="165" y2="120" stroke="#EF4444" stroke-width="1.5" marker-end="url(#ah3)"/><text x="170" y="130" font-size="9" fill="#EF4444" font-family="sans-serif">Hertzian stress</text><ellipse cx="90" cy="140" rx="12" ry="4" fill="none" stroke="#F97316" stroke-width="1.5"/><ellipse cx="100" cy="135" rx="8" ry="3" fill="none" stroke="#F97316" stroke-width="1.5"/><text x="20" y="140" font-size="9" fill="#F97316" font-family="sans-serif">Pits</text><text x="50" y="30" font-size="11" fill="#1E293B" font-family="sans-serif">Tooth 1</text><text x="210" y="160" font-size="11" fill="#1E293B" font-family="sans-serif">Tooth 2</text></svg>',
          explanation: 'Pitting is surface fatigue failure driven by cyclic Hertzian (contact) stress. Subsurface cracks initiate at the depth of maximum shear stress and propagate to the surface, releasing particles and creating pits. Investigation checklist: (1) Check lubricant — wrong viscosity or degraded oil reduces film thickness, increasing metal-to-metal contact stress. (2) Verify actual loading — is the gearbox seeing higher loads than designed for (overloads, shock loads)? (3) Check tooth contact pattern — misalignment concentrates load on one end of the tooth, dramatically increasing local contact stress. (4) Verify surface hardness — case-hardened gears resist pitting better than through-hardened. (5) Initial pitting (micropitting during break-in) is normal and may arrest — but progressive pitting that grows over months indicates a design or application problem. The AGMA contact stress formula (based on Hertz theory) is used to design against pitting, and it depends on load, geometry, alignment, and surface conditions.',
          hint: 'Pitting is a contact stress (Hertzian) problem, not a bending stress problem. What factors affect the actual contact stress a tooth experiences?'
        },
        {
          id: 'u8-L3-Q3',
          type: 'true-false',
          question: 'A worm gear set is specified for a crane hoist to provide self-locking (the load holds position when the motor is turned off). However, self-locking worm gears are inherently less efficient than spur/helical gear sets, typically only 40-60% efficient, because the same friction that prevents back-driving also wastes energy during normal operation.',
          correctAnswer: true,
          explanation: 'This is a fundamental engineering trade-off. Self-locking occurs when the worm lead angle is less than the friction angle — the very same friction that prevents the gear from driving the worm backward also resists forward motion, consuming power as heat. Typical self-locking worm sets achieve only 40-60% efficiency compared to 95-98% for spur/helical gears. For lifting applications, this trade-off is worthwhile because the alternative (adding a separate brake to a high-efficiency gear train) adds complexity, cost, and a potential failure mode. Engineers must size the motor larger to overcome the friction losses and ensure adequate cooling to dissipate the heat. If self-locking is not needed, helical or planetary gears are far more efficient choices for speed reduction.',
          hint: 'Think about the relationship between friction and efficiency — friction that prevents back-driving must also resist forward motion.'
        },
        {
          id: 'u8-L3-Q4',
          type: 'multiple-choice',
          question: 'You are selecting gears for a speed reducer. You can choose between spur gears and helical gears. Both can achieve the required ratio. What are the trade-offs, and when would you prefer each type?',
          options: [
            'Spur gears are always preferred — they are simpler, cheaper, and have no disadvantages compared to helical gears',
            'Helical gears are always preferred — they are quieter and stronger in every way, making spur gears obsolete',
            'Helical gears: quieter, smoother (gradual tooth engagement), higher load capacity for same size, but they generate axial thrust loads requiring thrust bearings. Spur gears: no axial thrust, simpler bearing arrangements, easier to manufacture, preferred when noise is not critical or axial space is limited.',
            'The only difference is noise — choose helical for quiet environments and spur for industrial settings. Load capacity is identical.'
          ],
          correctIndex: 2,
          explanation: 'The spur vs. helical decision involves several trade-offs. Helical gears mesh gradually (the contact line sweeps across the tooth face), producing smoother, quieter operation and distributing load over a larger contact area, increasing bending and contact strength for the same module and face width. However, the helix angle creates an axial force component (F_axial = F_tangential × tan(helix angle)) that must be reacted by thrust bearings, adding complexity and cost. Herringbone (double-helical) gears cancel the thrust but are expensive to manufacture. Spur gears engage abruptly (entire tooth face contacts simultaneously), creating more noise and vibration, but generate no axial thrust and are simpler/cheaper to produce. In practice: spur gears dominate in low-speed, open gearing, and cost-sensitive applications; helical gears are standard in enclosed gearboxes where noise, vibration, and compact size matter.',
          hint: 'Think about how the tooth contact differs between spur (instantaneous full-face contact) and helical (gradual sweeping contact), and what force component the helix angle introduces.'
        },
        {
          id: 'u8-L3-Q5',
          type: 'multiple-choice',
          question: 'A gear train consists of three stages: stage 1 ratio = 3:1, stage 2 ratio = 4:1, stage 3 ratio = 2:1. If the input shaft runs at 2400 RPM, what is the output speed?',
          options: [
            '100 RPM',
            '200 RPM',
            '400 RPM',
            '800 RPM'
          ],
          correctIndex: 0,
          explanation: 'Overall gear ratio = 3 × 4 × 2 = 24:1 (reduction). Output speed = 2400/24 = 100 RPM. Gear ratios in series multiply. Output torque = input torque × 24 × η_total, where η_total is the product of individual stage efficiencies. If each stage is 97% efficient: η_total = 0.97³ = 0.913 (91.3%). Planetary gear trains can achieve higher ratios in a more compact package, which is why they are preferred when space is limited.',
          hint: 'For gears in series, the total ratio is the product of individual ratios.'
        },
        {
          id: 'u8-L3-Q6',
          type: 'fill-blank',
          question: 'The failure mode where repeated Hertzian contact stress causes surface fatigue, creating pits on gear tooth surfaces, is called ___.',
          acceptedAnswers: ['pitting', 'Pitting', 'surface pitting', 'Surface pitting', 'contact fatigue'],
          explanation: 'Pitting is surface fatigue failure caused by cyclic Hertzian (contact) stress. Subsurface cracks initiate at the depth of maximum shear stress, propagate to the surface, and release small particles, forming pits. The AGMA contact stress formula (based on Hertz theory) is used to design against pitting. Pitting typically occurs near the pitch line where sliding velocity changes direction. Proper hardness, surface finish, and lubrication are key to preventing pitting.',
          hint: 'This surface fatigue phenomenon creates small craters on the gear tooth contact surface.'
        }
      ]
    },
    {
      id: 'u8-L4',
      title: 'Fasteners & Joints',
      description: 'Bolt preload, bolt stiffness, gasket factors, welded joints (fillet/butt), adhesive bonding, joint design.',
      icon: '🔩',
      xpReward: 25,
      questions: [
        {
          id: 'u8-L4-Q1',
          type: 'multiple-choice',
          question: 'In a bolted joint under external tensile load, the bolt stiffness is k_b = 400 MN/m and the clamped member stiffness is k_c = 1200 MN/m. If the external load is 20 kN, how much additional load does the bolt carry?',
          options: [
            '5 kN',
            '10 kN',
            '15 kN',
            '20 kN'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah4" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker></defs><rect x="100" y="30" width="120" height="20" fill="#94A3B8" stroke="#334155" stroke-width="2"/><rect x="100" y="50" width="120" height="35" fill="#CBD5E1" stroke="#334155" stroke-width="2"/><rect x="100" y="85" width="120" height="35" fill="#CBD5E1" stroke="#334155" stroke-width="2"/><rect x="100" y="120" width="120" height="20" fill="#94A3B8" stroke="#334155" stroke-width="2"/><line x1="160" y1="25" x2="160" y2="145" stroke="#334155" stroke-width="3"/><circle cx="160" cy="25" r="6" fill="#334155"/><text x="172" y="29" font-size="9" fill="#1E293B" font-family="sans-serif">Bolt head</text><polygon points="155,145 165,145 160,150" fill="#334155"/><text x="172" y="148" font-size="9" fill="#1E293B" font-family="sans-serif">Nut</text><text x="140" y="72" text-anchor="end" font-size="9" fill="#1E293B" font-family="sans-serif">Members</text><line x1="60" y1="85" x2="60" y2="50" stroke="#EF4444" stroke-width="2" marker-end="url(#ah4)"/><line x1="60" y1="85" x2="60" y2="120" stroke="#EF4444" stroke-width="2" marker-end="url(#ah4)"/><text x="55" y="90" text-anchor="end" font-size="9" fill="#EF4444" font-family="sans-serif">F_ext</text><text x="240" y="55" font-size="9" fill="#3B82F6" font-family="sans-serif">k_b (bolt)</text><text x="240" y="75" font-size="9" fill="#3B82F6" font-family="sans-serif">k_c (clamp)</text><text x="240" y="110" font-size="9" fill="#6B7280" font-family="sans-serif">C = k_b/(k_b+k_c)</text><text x="240" y="125" font-size="9" fill="#6B7280" font-family="sans-serif">Bolt gets C&#215;F_ext</text></svg>',
          explanation: 'The stiffness ratio (load fraction carried by bolt) C = k_b/(k_b + k_c) = 400/(400 + 1200) = 0.25. Additional bolt load = C × F_ext = 0.25 × 20 = 5 kN. The clamped members absorb 75% of the external load by relieving compression. This is why proper preload is critical — it keeps the joint clamped so the bolt only sees a fraction of the external load. If preload is lost, the bolt sees the full external load and is far more likely to fail in fatigue.',
          hint: 'The load split depends on the stiffness ratio: C = k_b/(k_b + k_c).'
        },
        {
          id: 'u8-L4-Q2',
          type: 'multiple-choice',
          question: 'A technician tightened flanged bolts to the specified torque, but the gasket leaked under pressure. Upon investigation, the bolts were found to have variable preloads (some 30% below target, others 20% above). The torque wrench was calibrated correctly. What is the most likely cause of the preload scatter?',
          options: [
            'The torque wrench is inaccurate despite calibration — switch to a more expensive digital torque wrench',
            'Friction variation — torque-controlled tightening depends heavily on thread and bearing surface friction (which consumes 80-90% of applied torque), and differences in lubrication, surface finish, or thread condition between bolts caused widely varying preloads at the same torque',
            'The bolts are different grades — some are 8.8 and others are 10.9, causing different stretch at the same torque',
            'The flange is warped, preventing the bolts from clamping evenly'
          ],
          correctIndex: 1,
          explanation: 'This is a fundamental limitation of torque-controlled tightening. Only 10-20% of applied torque actually produces bolt stretch (preload); the remaining 80-90% is consumed by friction under the bolt head (~40%) and in the threads (~40%). The nut factor K in T = K × F × d varies from 0.15 (lubricated) to 0.25+ (dry/rusty), creating ±25-30% preload uncertainty even with a perfectly calibrated wrench. Causes of friction variation: inconsistent lubrication (one bolt oiled, another dry), varying thread condition (plating, rust, damage), debris under the bolt head, and re-used vs. new washers. Solutions for critical joints: (1) consistent lubrication on all fasteners, (2) angle-of-turn method (less friction-sensitive), (3) direct bolt stretch measurement with ultrasonics (±1% accuracy), or (4) tension-indicating washers (DTIs). This is why the specification should say "torque to X with threads lubricated per Y" rather than just "torque to X."',
          hint: 'If the torque wrench is accurate but preloads vary, what variable between the wrench and the bolt stretch is causing the inconsistency?'
        },
        {
          id: 'u8-L4-Q3',
          type: 'true-false',
          question: 'A bolted joint should always be designed so that the bolt is loaded in shear (like a pin) rather than in tension, because bolts are stronger in shear than in tension.',
          correctAnswer: false,
          explanation: 'This is false. Properly designed bolted joints usually load the bolt in tension (clamping force), not shear. A preloaded tension joint relies on the friction between the clamped surfaces (created by bolt preload) to resist shear loads — the bolt itself never sees shear. This is actually the stronger and more reliable design. Bolts loaded in shear (bearing-type joints where the bolt shank contacts the hole wall) are used when slip is acceptable, but they are vulnerable to fatigue from the cyclic bearing load and require tight hole tolerances. Furthermore, shear stress on the bolt acts on the reduced thread area in most configurations, which is a weak point. The preferred approach: preloaded bolts in tension, with shear loads carried by friction between clamped surfaces.',
          hint: 'Think about how a properly preloaded bolted joint resists shear loads — is it through the bolt shearing, or through friction between the clamped parts?'
        },
        {
          id: 'u8-L4-Q4',
          type: 'multiple-choice',
          question: 'A bolted joint uses an M12 × 1.75 bolt (tensile stress area = 84.3 mm²) of property class 8.8 (proof strength = 600 MPa). What is the maximum recommended preload?',
          options: [
            '25.3 kN',
            '37.9 kN',
            '50.6 kN',
            '67.4 kN'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="50" y1="155" x2="290" y2="155" stroke="#334155" stroke-width="2"/><line x1="50" y1="155" x2="50" y2="15" stroke="#334155" stroke-width="2"/><text x="170" y="175" text-anchor="middle" font-size="11" fill="#6B7280" font-family="sans-serif">Bolt Elongation</text><text x="18" y="90" text-anchor="middle" font-size="11" fill="#6B7280" font-family="sans-serif" transform="rotate(-90,18,90)">Force</text><polyline points="50,155 200,40 250,30 270,28" fill="none" stroke="#334155" stroke-width="2"/><line x1="50" y1="40" x2="200" y2="40" stroke="#6B7280" stroke-width="1" stroke-dasharray="4"/><text x="38" y="42" text-anchor="end" font-size="9" fill="#6B7280" font-family="sans-serif">Proof</text><line x1="50" y1="70" x2="165" y2="70" stroke="#3B82F6" stroke-width="1" stroke-dasharray="4"/><text x="38" y="72" text-anchor="end" font-size="9" fill="#3B82F6" font-family="sans-serif">75%</text><circle cx="165" cy="70" r="4" fill="#3B82F6"/><text x="170" y="65" font-size="10" fill="#3B82F6" font-family="sans-serif">Target preload</text><line x1="50" y1="55" x2="182" y2="55" stroke="#F97316" stroke-width="1" stroke-dasharray="4"/><text x="38" y="57" text-anchor="end" font-size="9" fill="#F97316" font-family="sans-serif">90%</text><text x="187" y="52" font-size="9" fill="#F97316" font-family="sans-serif">Max (permanent)</text><rect x="200" y="30" width="85" height="35" fill="#FEE2E2" rx="3" opacity="0.5"/><text x="242" y="50" text-anchor="middle" font-size="9" fill="#EF4444" font-family="sans-serif">Yield zone</text></svg>',
          explanation: 'The recommended preload is typically 75% of proof load for non-permanent connections (90% for permanent ones). Proof load = proof strength × tensile stress area = 600 × 84.3 = 50,580 N = 50.6 kN. Recommended preload = 0.75 × 50.6 = 37.9 kN. Going above 90% of proof load risks permanent deformation of the bolt. Property class 8.8 means minimum tensile strength of 800 MPa and proof strength of 0.8 × 800 = 640 MPa (though many references use 600 MPa as a nominal value for design).',
          hint: 'Target preload is typically 75% of proof load. Proof load = proof stress × A_tensile.'
        },
        {
          id: 'u8-L4-Q5',
          type: 'multiple-choice',
          question: 'You need to join an aluminum panel to a steel frame in a vehicle body. Welding is not feasible (dissimilar metals, thin aluminum), and bolting adds weight and creates stress concentrations. You are considering adhesive bonding. What are the key design considerations and limitations?',
          options: [
            'Adhesive bonding is always inferior to mechanical fastening — it should only be used for non-structural applications',
            'Design the joint for shear loading (lap joints), maximize bond area, avoid peel loads at edges, add fillets to reduce edge stress, and consider that adhesives degrade with temperature, moisture, and UV — plus they offer no visual indication of bond quality without NDT',
            'Simply apply adhesive to the mating surfaces and clamp them together — modern structural adhesives are stronger than the base metals in all loading conditions',
            'Adhesive bonding cannot join dissimilar metals — the different thermal expansion rates will always break the bond during thermal cycling'
          ],
          correctIndex: 1,
          explanation: 'Adhesive bonding is increasingly used in automotive (reducing weight 30-40% vs. spot welding) and aerospace. Key design rules: (1) Design for shear, not peel — adhesives are strong in shear (20-40 MPa) but very weak in peel (<5 kN/m). Lap joints, scarf joints, and doubled configurations maximize shear area. (2) Surface preparation is critical — degrease, abrade, and prime both surfaces. Aluminum needs chromate conversion or anodizing for durable bonds. (3) Thermal expansion mismatch between aluminum (23 μm/m/°C) and steel (12 μm/m/°C) creates shear stress in the bond during temperature changes — use flexible adhesives or keep bond lengths short to limit the differential strain. (4) Environmental durability — moisture and heat degrade most adhesives over time. Verify long-term performance with accelerated aging tests. (5) Inspection difficulty — adhesive bonds cannot be visually inspected for quality. Ultrasonic or tap testing checks for disbonds but cannot measure bond strength.',
          hint: 'Adhesive joints are strong in shear but weak in peel. What design choices maximize the strength of the joint?'
        },
        {
          id: 'u8-L4-Q6',
          type: 'fill-blank',
          question: 'The initial tension applied to a bolt during tightening, before any external load is applied, is called ___.',
          acceptedAnswers: ['preload', 'Preload', 'pre-load', 'Pre-load', 'clamping force', 'Clamping force', 'pretension', 'Pretension'],
          explanation: 'Preload (also called pretension or initial clamping force) is the tension in the bolt created during tightening. It compresses the clamped members, creating a friction force that resists joint separation and slip. Proper preload is critical: too low allows joint separation or slip under load, too high risks bolt yield. The preload is controlled during assembly by torque, angle-of-turn, or bolt stretch measurement. For critical joints, ultrasonic bolt stretch measurement provides ±1% accuracy.',
          hint: 'This is the force in the bolt when it is tightened, before any external service loads are applied.'
        }
      ]
    },
    {
      id: 'u8-L5',
      title: 'Springs & Seals',
      description: 'Helical spring design, Wahl factor, spring rate, O-ring/lip seal/mechanical seal selection, PV limits.',
      icon: '🌀',
      xpReward: 25,
      questions: [
        {
          id: 'u8-L5-Q1',
          type: 'multiple-choice',
          question: 'A helical compression spring has a mean coil diameter D = 30 mm, wire diameter d = 5 mm, and 8 active coils. Using G = 80 GPa, what is the spring rate?',
          options: [
            '14.5 N/mm',
            '23.1 N/mm',
            '28.9 N/mm',
            '36.2 N/mm'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="100" y1="15" x2="180" y2="15" stroke="#334155" stroke-width="2"/><path d="M 140,15 L 110,35 L 170,55 L 110,75 L 170,95 L 110,115 L 170,135 L 140,155" fill="none" stroke="#334155" stroke-width="2.5"/><line x1="100" y1="155" x2="180" y2="155" stroke="#334155" stroke-width="2"/><line x1="185" y1="55" x2="220" y2="55" stroke="#6B7280" stroke-width="1" stroke-dasharray="4"/><line x1="185" y1="75" x2="220" y2="75" stroke="#6B7280" stroke-width="1" stroke-dasharray="4"/><line x1="215" y1="55" x2="215" y2="75" stroke="#6B7280" stroke-width="1.5"/><text x="225" y="68" font-size="10" fill="#6B7280" font-family="sans-serif">p (pitch)</text><line x1="110" y1="90" x2="170" y2="90" stroke="#EF4444" stroke-width="1" stroke-dasharray="3"/><text x="190" y="93" font-size="10" fill="#EF4444" font-family="sans-serif">D = 30mm</text><text x="190" y="107" font-size="9" fill="#EF4444" font-family="sans-serif">(mean coil dia)</text><circle cx="110" cy="75" r="5" fill="none" stroke="#3B82F6" stroke-width="2"/><text x="75" y="78" text-anchor="end" font-size="10" fill="#3B82F6" font-family="sans-serif">d = 5mm</text><text x="75" y="90" text-anchor="end" font-size="9" fill="#3B82F6" font-family="sans-serif">(wire dia)</text><text x="240" y="140" font-size="10" fill="#1E293B" font-family="sans-serif">N_a = 8 coils</text><text x="240" y="155" font-size="10" fill="#1E293B" font-family="sans-serif">C = D/d = 6</text></svg>',
          explanation: 'Spring rate k = Gd⁴/(8D³Nₐ) = (80,000 × 5⁴)/(8 × 30³ × 8) = (80,000 × 625)/(8 × 27,000 × 8) = 50,000,000/1,728,000 ≈ 28.9 N/mm. The spring index C = D/d = 6, which is in the typical design range (4–12). This formula is fundamental to spring design — note that rate is inversely proportional to the cube of coil diameter and linearly to the number of active coils.',
          hint: 'k = Gd⁴/(8D³N_a). Be consistent with units — all in mm and MPa gives N/mm.'
        },
        {
          id: 'u8-L5-Q2',
          type: 'multiple-choice',
          question: 'A compression spring in a valve assembly keeps breaking after a few months. The fracture always occurs on the inner surface of the coil, roughly at the same location. The spring index (D/d) is 4.5. What is the likely cause, and what would you change?',
          options: [
            'The spring material is defective — replace the supplier and use the same design',
            'The spring index is too low (tightly wound), causing a high Wahl correction factor that amplifies stress on the inner coil surface. The spring is failing in fatigue at the highest-stress location. Increase the spring index to 6-8 by increasing coil diameter or decreasing wire diameter.',
            'The spring is corroding at that location because moisture collects on the inner surface. Solution: use a corrosion-resistant material.',
            'The spring is bottoming out (going solid) during operation, causing impact loads. Solution: add more clearance or a travel stop.'
          ],
          correctIndex: 1,
          explanation: 'A spring index of 4.5 is at the low end of the practical range (4-12). The Wahl factor K_w for C = 4.5 is approximately 1.35, meaning the actual peak shear stress on the inner coil surface is 35% higher than the simple torsion formula predicts. The inner surface sees higher stress due to two effects: (1) stress concentration from coil curvature (inner fibers are compressed more), and (2) direct shear adding to torsional shear. Fatigue cracks initiate at the highest-stress point — the inner surface of the coil — which matches the observed failure location. Fix: increase the spring index to 6-8 (reducing K_w to ~1.25 or less) by either increasing the mean coil diameter or decreasing the wire diameter. Also check that the design stress is below the endurance limit for the wire material (typically 45-50% of UTS for shot-peened springs). Shot peening the wire introduces compressive residual stress on the surface, significantly improving fatigue life.',
          hint: 'The failure location (inner coil surface) and the low spring index are connected. What correction factor increases stress on the inner surface of tightly wound springs?'
        },
        {
          id: 'u8-L5-Q3',
          type: 'true-false',
          question: 'O-ring seals rely primarily on the elastic deformation (squeeze) of the rubber to create a seal at low pressures, and on system pressure energizing the O-ring against the groove walls at higher pressures.',
          correctAnswer: true,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah5" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker></defs><rect x="40" y="20" width="240" height="55" fill="#CBD5E1" stroke="#334155" stroke-width="2"/><rect x="40" y="115" width="240" height="55" fill="#CBD5E1" stroke="#334155" stroke-width="2"/><rect x="100" y="75" width="120" height="40" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/><text x="160" y="100" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Groove</text><ellipse cx="160" cy="93" rx="20" ry="17" fill="#1E293B" stroke="#334155" stroke-width="1.5"/><text x="160" y="97" text-anchor="middle" font-size="9" fill="white" font-family="sans-serif">O-ring</text><line x1="160" y1="76" x2="160" y2="68" stroke="#EF4444" stroke-width="1.5"/><text x="200" y="68" font-size="9" fill="#EF4444" font-family="sans-serif">Squeeze</text><line x1="30" y1="93" x2="50" y2="93" stroke="#EF4444" stroke-width="2" marker-end="url(#ah5)"/><text x="15" y="88" font-size="9" fill="#EF4444" font-family="sans-serif">P</text><text x="230" y="93" font-size="9" fill="#6B7280" font-family="sans-serif">Sealing</text><text x="230" y="105" font-size="9" fill="#6B7280" font-family="sans-serif">surfaces</text><text x="160" y="15" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Upper housing</text><text x="160" y="178" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Lower housing</text></svg>',
          explanation: 'At low pressures, the O-ring seals through the initial squeeze (typically 10–30% compression) that creates contact stress against the mating surfaces. As system pressure increases, it pushes the O-ring against the downstream groove wall and contact surface, increasing the sealing force — this is the pressure-energized (self-energizing) effect. At high pressures (>10 MPa), back-up rings are needed to prevent the O-ring from extruding into the clearance gap. The Parker O-Ring Handbook is the standard reference for O-ring groove design.',
          hint: 'Consider the two sealing mechanisms: initial compression and pressure-activated.'
        },
        {
          id: 'u8-L5-Q4',
          type: 'multiple-choice',
          question: 'A lip seal on a rotating shaft is leaking oil after 18 months of service. The shaft surface under the seal shows a polished wear groove. What are the possible causes, and how would you prevent this on the replacement?',
          options: [
            'The seal was installed backward — lip seals only work in one direction. Simply install the new seal correctly.',
            'The shaft surface roughness was either too rough (abraded the lip) or too smooth (no micro-texture to retain oil film), or the shaft is not hard enough (minimum 45 HRC under the seal). Solutions: ensure shaft hardness ≥45 HRC, surface finish 0.2-0.5 μm Ra, install a wear sleeve if the groove is deep, and verify the seal lip spring tension.',
            'The oil viscosity was too low, causing it to pass through the seal regardless of seal condition. Solution: use thicker oil.',
            'Lip seals have a fixed life and always wear out — 18 months is normal. Just replace the seal on a regular schedule.'
          ],
          correctIndex: 1,
          explanation: 'Lip seal wear grooves are a common maintenance issue. Root causes: (1) Shaft hardness too low — a shaft below 45 HRC (30 HRC is typical for unhardened steel) allows the seal lip to wear a groove into the shaft surface. The groove then becomes a leak path the new seal cannot seal against. (2) Surface finish — too rough (>0.8 μm Ra) rapidly wears the lip; too smooth (<0.1 μm Ra) does not retain a micro-oil film, causing dry running and wear. The sweet spot is 0.2-0.5 μm Ra. (3) Shaft runout — excessive radial runout (>0.15 mm TIR) forces the lip to flex more than designed, accelerating wear. (4) Contamination — dirt entering between lip and shaft acts as an abrasive. Solutions: (1) if the groove is <0.25 mm deep, install the new seal at a slightly different axial position to contact unworn shaft. (2) For deeper grooves, install a hardened wear sleeve (press-fit thin-wall tube) over the shaft. (3) Ensure replacement shaft meets hardness and finish specifications.',
          hint: 'The wear groove is the key clue. What shaft properties prevent the seal from wearing into the shaft surface?'
        },
        {
          id: 'u8-L5-Q5',
          type: 'multiple-choice',
          question: 'You are selecting a seal for a centrifugal pump handling hot (90°C) chemical process fluid at 1.5 MPa. The pump runs continuously at 3000 RPM. Walk through the seal selection logic.',
          options: [
            'A standard nitrile rubber lip seal — it is the simplest and cheapest option for any rotating shaft',
            'A mechanical face seal with chemically resistant face materials (SiC/SiC or SiC/carbon) and fluoroelastomer secondary seals — it handles the pressure, temperature, speed, and chemical exposure that would destroy elastomeric contact seals',
            'An O-ring in a groove — O-rings are universal seals that work at any pressure and temperature',
            'A labyrinth seal — non-contact seals last forever because there is no wear'
          ],
          correctIndex: 1,
          explanation: 'This application eliminates most seal types. Lip seals: cannot handle 1.5 MPa continuous pressure (max ~0.05 MPa without special backing). Nitrile rubber degrades above 100°C and cannot resist many chemicals. O-rings: would extrude at 1.5 MPa at this gap and temperature without backup rings, and cannot handle the rotary motion at 3000 RPM. Labyrinth seals: are non-contacting and allow leakage by design — unacceptable for a chemical process fluid. Mechanical face seals are the industry standard for pumps because: (1) spring-loaded flat faces maintain sealing under pressure and thermal changes, (2) hard face materials (SiC, tungsten carbide) resist chemical attack and wear, (3) the fluid film between faces provides lubrication, limiting wear and heat generation, (4) secondary seals (O-rings, bellows) can be selected for the specific chemical environment. The API 682 standard governs mechanical seal selection for the process industry.',
          hint: 'Eliminate seal types that fail any of the four requirements: 1.5 MPa pressure, 90°C temperature, chemical resistance, continuous 3000 RPM rotation.'
        },
        {
          id: 'u8-L5-Q6',
          type: 'fill-blank',
          question: 'An O-ring seals at low pressure through its initial compression (squeeze), but at higher pressures it is pushed against the groove walls by the system pressure itself. This pressure-assisted sealing behavior is called ___-energizing.',
          acceptedAnswers: ['self', 'Self', 'pressure', 'Pressure', 'self-energizing', 'Self-energizing'],
          explanation: 'O-rings are self-energizing (or pressure-energizing) seals. At low/zero pressure, sealing depends on the initial squeeze (10-30% compression) that creates contact stress against the mating surfaces. As system pressure rises, it acts on the upstream side of the O-ring, pushing it more firmly against the downstream groove wall and the mating surface, increasing the contact stress proportionally to the pressure. This is why O-rings can seal higher pressures than their initial squeeze alone would suggest. However, above ~10 MPa, the O-ring can extrude into the clearance gap between mating parts, requiring backup rings (anti-extrusion rings) to support the O-ring.',
          hint: 'The system pressure itself assists the sealing action by pushing the O-ring against the groove surfaces more firmly.'
        }
      ]
    }
  ]
};
