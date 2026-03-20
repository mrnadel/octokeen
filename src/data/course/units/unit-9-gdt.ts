import type { Unit } from '../types';

export const unit9: Unit = {
  id: 'u9-gdt',
  title: 'GD&T & Tolerancing',
  description: 'Geometric dimensioning and tolerancing, datum systems, tolerance stack-ups, surface finish, and metrology.',
  color: '#EC4899',
  icon: '📏',
  lessons: [
    {
      id: 'u9-L1',
      title: 'Tolerance Fundamentals',
      description: 'Tolerance/allowance, clearance/interference/transition fits, ISO/ANSI tolerance grades, bilateral/unilateral.',
      icon: '📐',
      xpReward: 20,
      questions: [
        {
          id: 'u9-L1-Q1',
          type: 'multiple-choice',
          question: 'A bearing manufacturer recommends an interference fit for the inner ring on a rotating shaft, but a clearance fit for the outer ring in the housing. Why are the fit types different for the same bearing?',
          options: [
            'It is arbitrary — both rings could use the same fit type without any functional difference',
            'The rotating ring must have an interference fit to prevent creep (relative rotation under load), while the stationary ring uses a clearance fit to allow axial float and easier assembly/disassembly',
            'The inner ring needs interference because it is smaller in diameter and therefore weaker',
            'Clearance on the outer ring is only for thermal expansion — functionally both should be interference fits'
          ],
          correctIndex: 1,
          explanation: 'The ring that rotates relative to the load direction must have an interference fit to prevent "creep" — gradual rotation of the ring relative to its seat due to cyclic loading. If the inner ring creeps on the shaft, it causes fretting, wear, and eventual failure. The stationary ring (outer, in this case) can use a clearance or light transition fit to allow axial float for thermal expansion and simplify replacement. If the outer ring rotated instead (e.g., wheel hub bearing), the fit recommendations reverse. This is a fundamental bearing application concept.',
          hint: 'Think about which ring sees the rotating load vector and what happens if it slips on its seat.'
        },
        {
          id: 'u9-L1-Q2',
          type: 'multiple-choice',
          question: 'A junior engineer specifies H7/s6 (heavy interference) for a ∅15 mm aluminum pin in a ∅15 mm aluminum housing on a consumer product. During assembly, the housing cracks. What went wrong, and what would you recommend?',
          options: [
            'The tolerance grade was too loose — they should have used H6/s5 for a tighter fit',
            'H7/s6 is a heavy press fit that generates hoop stresses exceeding aluminum\'s yield strength in thin-walled housings; they should use a lighter fit (H7/p6 or H7/n6), increase wall thickness, or switch to a slip fit with a retaining compound',
            'The cracking is a material defect — H7/s6 is appropriate for aluminum',
            'They should have used the same fit but heated the housing before assembly'
          ],
          correctIndex: 1,
          explanation: 'H7/s6 produces very high interference, especially problematic in aluminum which has lower yield strength (~275 MPa for 6061-T6 vs. ~530 MPa for medium carbon steel) and lower fracture toughness. The hoop stress from the press fit can exceed the housing material\'s capability, especially with thin walls. Solutions: use a lighter interference fit (H7/n6 or H7/p6), increase the housing wall thickness (OD/ID ratio), use Loctite retaining compound with a slip fit, or heat the housing before assembly to reduce insertion stress. This is a common design mistake when engineers apply steel-based fit recommendations to aluminum.',
          hint: 'Consider the material properties of aluminum vs. steel when selecting interference fit levels.'
        },
        {
          id: 'u9-L1-Q3',
          type: 'multiple-choice',
          question: 'You inherit a drawing that specifies ∅50 +0.000/−0.050 mm for a bore and ∅50 +0.025/+0.050 mm for the mating shaft. What type of fit is this, and is there a potential design concern?',
          options: [
            'Clearance fit with no concerns — the shaft is always smaller than the hole',
            'Interference fit — the shaft maximum (50.050) always exceeds the hole maximum (50.000), guaranteeing interference; the concern is whether the assembly method (press, thermal, hydraulic) is specified',
            'Transition fit — sometimes clearance, sometimes interference depending on actual sizes',
            'The tolerances are invalid because the shaft cannot be larger than nominal'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="60" y="30" width="90" height="120" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="170" y="30" width="90" height="120" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="95" y="50" width="20" height="80" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5"/><rect x="205" y="45" width="20" height="90" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/><text x="105" y="155" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Bore</text><text x="215" y="155" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Shaft</text><text x="105" y="25" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">49.950–50.000</text><text x="215" y="25" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">50.025–50.050</text><line x1="140" y1="90" x2="175" y2="90" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,3"/><text x="157" y="85" text-anchor="middle" font-size="10" fill="#EF4444" font-family="sans-serif">Interference</text><text x="160" y="175" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Shaft always larger than bore = guaranteed interference</text></svg>',
          explanation: 'Maximum shaft = 50.050, minimum shaft = 50.025. Maximum hole = 50.000, minimum hole = 49.950. Even the smallest shaft (50.025) exceeds the largest hole (50.000), so interference is guaranteed. Min interference = 50.025 − 50.000 = 0.025 mm; max interference = 50.050 − 49.950 = 0.100 mm. The design concern: the drawing should specify the assembly method — press fit at room temperature, thermal shrink fit (heat housing to ~150°C), or hydraulic expansion. Without this, manufacturing may attempt to force the parts, risking damage. Always pair interference fit callouts with assembly instructions.',
          hint: 'Check if the smallest shaft can fit in the largest hole. If not, interference is guaranteed.'
        },
        {
          id: 'u9-L1-Q4',
          type: 'multiple-choice',
          question: 'A dimension is specified as 50 +0.05/−0.10 mm. What is the tolerance, and is it bilateral or unilateral?',
          options: [
            'Tolerance = 0.05 mm, unilateral',
            'Tolerance = 0.10 mm, unilateral',
            'Tolerance = 0.15 mm, bilateral',
            'Tolerance = 0.15 mm, unilateral'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="40" y1="90" x2="280" y2="90" stroke="#334155" stroke-width="2"/><line x1="160" y1="40" x2="160" y2="140" stroke="#334155" stroke-width="1" stroke-dasharray="4,3"/><rect x="80" y="55" width="160" height="70" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" opacity="0.5" rx="2"/><line x1="80" y1="55" x2="280" y2="55" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,2"/><line x1="80" y1="125" x2="280" y2="125" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,2"/><text x="160" y="150" text-anchor="middle" font-size="13" font-weight="bold" fill="#1E293B" font-family="sans-serif">50.00 (nominal)</text><text x="290" y="58" text-anchor="start" font-size="11" fill="#3B82F6" font-family="sans-serif">+0.05</text><text x="290" y="128" text-anchor="start" font-size="11" fill="#3B82F6" font-family="sans-serif">−0.10</text><text x="45" y="93" text-anchor="start" font-size="11" fill="#6B7280" font-family="sans-serif">Total = 0.15</text><text x="160" y="175" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Bilateral tolerance: deviations on both sides of nominal</text></svg>',
          explanation: 'Total tolerance = upper deviation − lower deviation = +0.05 − (−0.10) = 0.15 mm. This is bilateral tolerancing because the deviations are on both sides of the nominal (one positive, one negative), though they are asymmetric. Unilateral would be both deviations on the same side (e.g., +0.00/+0.15 or −0.15/−0.00). The allowable range is 49.90 to 50.05 mm. Bilateral symmetric (±0.075) is easiest for manufacturing because the target is the nominal dimension.',
          hint: 'Tolerance = upper limit − lower limit. Bilateral means deviations exist on both sides of nominal.'
        },
        {
          id: 'u9-L1-Q5',
          type: 'multiple-choice',
          question: 'A manufacturing engineer complains that your drawing has an IT6 tolerance on a rough cast surface that gets no machining. Why is this a problem, and how do you resolve it?',
          options: [
            'IT6 is too loose for a cast surface — they should be asking for IT5 or tighter',
            'IT6 requires precision machining (grinding or fine turning) and cannot be achieved on an as-cast surface; you should either add a machining operation to that surface or relax the tolerance to IT11–IT14 (typical for sand casting)',
            'The tolerance grade does not matter for cast surfaces since they are not functional',
            'The engineer is wrong — modern casting processes can easily achieve IT6'
          ],
          correctIndex: 1,
          explanation: 'ISO tolerance grades reflect manufacturing process capability. Sand casting typically achieves IT11–IT16, investment casting IT7–IT9, die casting IT8–IT10. IT6 requires precision machining (grinding, honing, or fine turning). Specifying IT6 on an unmachined cast surface means either the surface must be machined (adding cost and a machining datum), or the tolerance must be relaxed to match the casting process capability. This is a common DFM issue — always match tolerance grades to the actual manufacturing process for each surface.',
          hint: 'Think about what tolerance grades different manufacturing processes can realistically achieve.'
        },
        {
          id: 'u9-L1-Q6',
          type: 'fill-blank',
          question: 'The minimum intended difference in size between mating parts in a clearance fit is called the ___.',
          acceptedAnswers: ['allowance', 'Allowance', 'minimum clearance', 'Minimum clearance'],
          explanation: 'Allowance is the minimum clearance (in a clearance fit) or maximum interference (in an interference fit) between mating parts. For a clearance fit, allowance = minimum hole size − maximum shaft size, and it must be positive. It represents the tightest possible fit condition. Tolerance is the permissible variation in a single dimension, while allowance describes the designed gap or interference between two mating parts.',
          hint: 'This is the tightest possible fit between mating parts — the designed minimum gap.'
        }
      ]
    },
    {
      id: 'u9-L2',
      title: 'Geometric Tolerancing',
      description: 'Form (flatness, cylindricity, circularity, straightness), orientation (perpendicularity, angularity, parallelism), MMC/LMC, bonus tolerance.',
      icon: '🔷',
      xpReward: 25,
      questions: [
        {
          id: 'u9-L2-Q1',
          type: 'multiple-choice',
          question: 'Why is position tolerance almost always applied at MMC rather than RFS for clearance-hole bolt patterns?',
          options: [
            'MMC is simply the default — there is no functional reason to prefer it over RFS',
            'Because at MMC the holes are smallest and shafts largest (tightest fit), so if position is controlled at that worst case the assembly is guaranteed; bonus tolerance as features depart from MMC reduces scrap without sacrificing function',
            'RFS is actually preferred but MMC is cheaper to inspect',
            'MMC only applies to shafts, not holes, so it is used for the bolt side only'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="20" y="15" width="185" height="50" fill="none" stroke="#334155" stroke-width="2" rx="2"/><line x1="55" y1="15" x2="55" y2="65" stroke="#334155" stroke-width="2"/><line x1="125" y1="15" x2="125" y2="65" stroke="#334155" stroke-width="2"/><line x1="165" y1="15" x2="165" y2="65" stroke="#334155" stroke-width="2"/><text x="37" y="45" text-anchor="middle" font-size="18" fill="#334155" font-family="sans-serif">⌖</text><text x="90" y="44" text-anchor="middle" font-size="12" fill="#334155" font-family="sans-serif">∅ 0.25</text><text x="145" y="44" text-anchor="middle" font-size="13" fill="#334155" font-family="sans-serif">Ⓜ</text><text x="190" y="44" text-anchor="middle" font-size="13" font-weight="bold" fill="#10B981" font-family="sans-serif">A</text><text x="20" y="85" text-anchor="start" font-size="11" fill="#1E293B" font-family="sans-serif">At MMC (smallest hole):</text><text x="30" y="100" text-anchor="start" font-size="11" fill="#334155" font-family="sans-serif">Position tol = 0.25</text><text x="20" y="120" text-anchor="start" font-size="11" fill="#1E293B" font-family="sans-serif">Hole 0.10 larger than MMC:</text><text x="30" y="135" text-anchor="start" font-size="11" fill="#3B82F6" font-family="sans-serif">Position tol = 0.25 + 0.10 = 0.35</text><rect x="225" y="75" width="70" height="70" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><circle cx="260" cy="110" r="18" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5"/><circle cx="260" cy="110" r="12" fill="white" stroke="#334155" stroke-width="1.5"/><text x="260" y="160" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Bonus zone</text></svg>',
          explanation: 'The functional requirement for a bolt pattern is that the bolts pass through the holes. The worst case for assembly is when holes are at their smallest (MMC) and bolts at their largest (MMC) — that is when positional error matters most. If a hole is produced larger than MMC, there is extra clearance, so additional positional error can be tolerated without affecting assembly. This "bonus tolerance" reduces rejection rates and manufacturing cost without any risk to function. RFS (Regardless of Feature Size) provides no bonus tolerance and is used when position must be controlled independent of size — typically for press-fit or precision alignment features.',
          hint: 'Think about when assembly fit is tightest and when extra positional error can be tolerated.'
        },
        {
          id: 'u9-L2-Q2',
          type: 'multiple-choice',
          question: 'A junior engineer\'s drawing shows flatness applied to a cylindrical bore surface. What is wrong with this callout, and what should they use instead?',
          options: [
            'Nothing is wrong — flatness can apply to any surface',
            'Flatness only applies to planar surfaces; for a cylindrical bore, they should use cylindricity (to control the overall form) or circularity (to control individual cross-sections)',
            'They should use straightness instead of flatness since the bore is long',
            'The issue is that flatness needs a datum reference and they forgot to add one'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="15" y="20" width="130" height="40" fill="none" stroke="#EF4444" stroke-width="2" rx="2"/><line x1="45" y1="20" x2="45" y2="60" stroke="#EF4444" stroke-width="2"/><text x="30" y="46" text-anchor="middle" font-size="16" fill="#EF4444" font-family="sans-serif">⏥</text><text x="90" y="46" text-anchor="middle" font-size="12" fill="#EF4444" font-family="sans-serif">0.05</text><text x="80" y="75" text-anchor="middle" font-size="10" fill="#EF4444" font-family="sans-serif">WRONG on cylinder</text><line x1="155" y1="40" x2="170" y2="40" stroke="#334155" stroke-width="2"/><text x="162" y="35" text-anchor="middle" font-size="14" fill="#334155" font-family="sans-serif">→</text><rect x="175" y="20" width="130" height="40" fill="none" stroke="#10B981" stroke-width="2" rx="2"/><line x1="205" y1="20" x2="205" y2="60" stroke="#10B981" stroke-width="2"/><text x="190" y="46" text-anchor="middle" font-size="16" fill="#10B981" font-family="sans-serif">⌭</text><text x="250" y="46" text-anchor="middle" font-size="12" fill="#10B981" font-family="sans-serif">0.05</text><text x="240" y="75" text-anchor="middle" font-size="10" fill="#10B981" font-family="sans-serif">Cylindricity</text><rect x="175" y="85" width="130" height="40" fill="none" stroke="#10B981" stroke-width="2" rx="2"/><line x1="205" y1="85" x2="205" y2="125" stroke="#10B981" stroke-width="2"/><text x="190" y="111" text-anchor="middle" font-size="16" fill="#10B981" font-family="sans-serif">○</text><text x="250" y="111" text-anchor="middle" font-size="12" fill="#10B981" font-family="sans-serif">0.05</text><text x="240" y="140" text-anchor="middle" font-size="10" fill="#10B981" font-family="sans-serif">Circularity</text><ellipse cx="80" cy="130" rx="40" ry="20" fill="none" stroke="#334155" stroke-width="1.5"/><line x1="40" y1="90" x2="40" y2="130" stroke="#334155" stroke-width="1.5"/><line x1="120" y1="90" x2="120" y2="130" stroke="#334155" stroke-width="1.5"/><ellipse cx="80" cy="90" rx="40" ry="20" fill="none" stroke="#334155" stroke-width="1.5"/><text x="80" y="165" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Cylindrical bore</text></svg>',
          explanation: 'Flatness is a form tolerance that applies only to nominally flat (planar) surfaces — the tolerance zone is two parallel planes. Applying it to a curved surface is meaningless per ASME Y14.5 / ISO 1101. For a cylindrical bore: cylindricity controls the entire surface (zone between two coaxial cylinders), circularity controls individual cross-sections (zone between two concentric circles), and straightness can control line elements along the axis. The choice depends on what functional requirement drives the control. Flatness also never requires a datum reference — it is a self-referencing form control.',
          hint: 'Consider which geometric surfaces each form tolerance is defined for.'
        },
        {
          id: 'u9-L2-Q3',
          type: 'multiple-choice',
          question: 'When would you specify a profile of a surface tolerance instead of combining individual form and orientation tolerances?',
          options: [
            'Profile tolerance is only used for aesthetic surfaces where appearance matters',
            'When you need to control the shape, orientation, and location of a complex or freeform surface simultaneously with a single callout, rather than stacking multiple individual tolerances',
            'Profile is always preferred because it is simpler to inspect than other tolerances',
            'Only when the surface is flat — profile cannot be applied to curved surfaces'
          ],
          correctIndex: 1,
          explanation: 'Profile of a surface is the most versatile GD&T tolerance — it controls form, orientation, size, and location simultaneously relative to datums. It is ideal for: complex contoured surfaces (airfoils, cam profiles, injection-molded shapes) where individual form/orientation callouts would be impractical; surfaces where the CAD model defines the true profile; and situations where you want one tolerance to control everything about the surface. Without datum references, profile controls only form. With datums, it controls orientation and/or location as well. Using individual tolerances (flatness + perpendicularity + position) can lead to tolerance stacking and ambiguity that a single profile callout avoids.',
          hint: 'Think about complex surfaces where multiple geometric controls would be needed — is there a single tolerance that handles all of them?'
        },
        {
          id: 'u9-L2-Q4',
          type: 'multiple-choice',
          question: 'Parts are passing CMM inspection for position tolerance but consistently failing during assembly. What are the most likely causes?',
          options: [
            'The parts are defective — CMM results must be wrong',
            'The CMM datum setup does not replicate the actual assembly datum contacts (different datum features, wrong datum precedence, or point-contact vs. surface-contact differences), causing the measurement to pass on a different coordinate system than the assembly uses',
            'Position tolerance is not relevant to assembly — only size matters',
            'The CMM is measuring in metric but the assembly is designed in imperial units'
          ],
          correctIndex: 1,
          explanation: 'This is one of the most common GD&T problems in manufacturing. If the CMM datum alignment differs from the physical assembly datum contact, the coordinate systems diverge, and a part that "passes" on the CMM may be out of tolerance in the actual assembly. Common specific causes: CMM uses best-fit alignment instead of 3-2-1 datum simulation; CMM contacts different points on the datum feature than the assembly fixture; datum precedence (A|B|C order) does not match assembly; or the CMM ignores material condition modifiers. The fix: ensure the CMM program\'s datum alignment replicates the physical assembly interface exactly.',
          hint: 'If inspection says "pass" but reality says "fail," the measurement might not be testing what the assembly actually needs.'
        },
        {
          id: 'u9-L2-Q5',
          type: 'multiple-choice',
          question: 'When should the LMC (Least Material Condition) modifier be used instead of MMC?',
          options: [
            'When maximizing assembly clearance is the primary concern',
            'When controlling minimum wall thickness between features (e.g., a hole near an edge)',
            'When reducing manufacturing cost is the main goal',
            'When the feature is a shaft rather than a hole'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="30" y="20" width="260" height="100" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><circle cx="230" cy="70" r="30" fill="white" stroke="#334155" stroke-width="2"/><circle cx="230" cy="70" r="35" fill="none" stroke="#3B82F6" stroke-width="1" stroke-dasharray="4,3"/><line x1="260" y1="70" x2="290" y2="70" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/><line x1="260" y1="20" x2="290" y2="20" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/><text x="295" y="50" text-anchor="start" font-size="10" fill="#EF4444" font-family="sans-serif">Min wall</text><line x1="288" y1="25" x2="288" y2="65" stroke="#EF4444" stroke-width="1.5"/><line x1="285" y1="25" x2="291" y2="25" stroke="#EF4444" stroke-width="1.5"/><line x1="285" y1="65" x2="291" y2="65" stroke="#EF4444" stroke-width="1.5"/><text x="230" y="74" text-anchor="middle" font-size="10" fill="#3B82F6" font-family="sans-serif">LMC</text><text x="100" y="140" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">At LMC: largest hole, thinnest wall</text><text x="100" y="155" text-anchor="middle" font-size="11" fill="#3B82F6" font-family="sans-serif">Ⓛ controls min wall thickness</text><text x="80" y="55" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Part edge</text><line x1="30" y1="20" x2="30" y2="120" stroke="#334155" stroke-width="2.5"/></svg>',
          explanation: 'LMC is used when the critical concern is minimum wall thickness or minimum remaining material — for example, a hole close to an edge, or a bore close to an outer diameter. At LMC, the feature has the least material (largest hole or smallest shaft), meaning the wall is thinnest. The LMC modifier gives bonus tolerance as the feature departs from LMC toward MMC, where there is more wall material. This is less common than MMC but critical for structural integrity and minimum material checks.',
          hint: 'Think about when having less material is the dangerous condition — thin walls near edges.'
        },
        {
          id: 'u9-L2-Q6',
          type: 'fill-blank',
          question: 'The condition where a feature of size contains the maximum amount of material (smallest hole, largest shaft) is called ___.',
          acceptedAnswers: ['MMC', 'mmc', 'Maximum Material Condition', 'maximum material condition'],
          explanation: 'Maximum Material Condition (MMC) is when a feature has the most material: smallest hole or largest shaft. It represents the tightest fit condition between mating parts. The MMC modifier (circled M) is used with geometric tolerances to allow bonus tolerance as the feature departs from MMC. This is based on the principle that if a hole is larger than its MMC, it can tolerate more positional error and still assemble with the mating shaft.',
          hint: 'This condition represents the most material everywhere — tightest fit for mating parts.'
        }
      ]
    },
    {
      id: 'u9-L3',
      title: 'Datum Systems',
      description: 'Datum features, datum reference frame, primary/secondary/tertiary datums, datum targets, fixturing.',
      icon: '📌',
      xpReward: 25,
      questions: [
        {
          id: 'u9-L3-Q1',
          type: 'multiple-choice',
          question: 'A new engineer asks you: "Why does it matter which datum I call primary vs. secondary? Can\'t I just pick any three surfaces?" How do you explain the significance of datum precedence?',
          options: [
            'It does not matter — datum letters are just labels and any order works the same',
            'Datum precedence determines which surface is constrained first (most tightly) and controls the most degrees of freedom; changing the order changes the coordinate system and can cause different measurement results on the same part',
            'The order only matters for CMM programming, not for the actual part function',
            'Primary datum must always be the largest surface, secondary the next largest, and tertiary the smallest'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="80" y="30" width="160" height="110" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><line x1="80" y1="140" x2="260" y2="140" stroke="#10B981" stroke-width="3"/><text x="170" y="158" text-anchor="middle" font-size="12" font-weight="bold" fill="#10B981" font-family="sans-serif">A (Primary: 3 DOF)</text><line x1="260" y1="30" x2="260" y2="140" stroke="#3B82F6" stroke-width="3"/><text x="275" y="85" text-anchor="start" font-size="11" font-weight="bold" fill="#3B82F6" font-family="sans-serif">B</text><text x="275" y="100" text-anchor="start" font-size="10" fill="#3B82F6" font-family="sans-serif">(2 DOF)</text><circle cx="80" cy="85" r="5" fill="#EC4899" stroke="#EC4899" stroke-width="2"/><text x="55" y="80" text-anchor="end" font-size="11" font-weight="bold" fill="#EC4899" font-family="sans-serif">C</text><text x="55" y="95" text-anchor="end" font-size="10" fill="#EC4899" font-family="sans-serif">(1 DOF)</text><circle cx="120" cy="140" r="3" fill="#10B981"/><circle cx="170" cy="140" r="3" fill="#10B981"/><circle cx="220" cy="140" r="3" fill="#10B981"/><circle cx="260" cy="70" r="3" fill="#3B82F6"/><circle cx="260" cy="110" r="3" fill="#3B82F6"/><text x="170" y="22" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">3-2-1 Datum Reference Frame</text></svg>',
          explanation: 'The primary datum constrains 3 DOF and is contacted first (the part "sits" on it fully). The secondary constrains 2 more DOF, and the tertiary constrains the last 1. If you swap primary and secondary, the part orients differently — features that were in-tolerance may become out-of-tolerance and vice versa. The correct datum precedence mirrors how the part is located in the actual assembly. For example, if a flange face seats against a mating surface first, then a bore centers the part, then a pin locks rotation — that is the A-B-C order. Reversing this misaligns the inspection coordinate system with the assembly reality.',
          hint: 'Think about what changes physically when a part contacts datum A first vs. datum B first.'
        },
        {
          id: 'u9-L3-Q2',
          type: 'multiple-choice',
          question: 'When selecting datum features for a machined part, which principle should guide the selection?',
          options: [
            'Always select the smallest features as datums',
            'Select functional surfaces — datums should represent how the part is assembled, located, or constrained in service',
            'Always use three mutually perpendicular flat surfaces',
            'Select the features with the tightest tolerances as datums'
          ],
          correctIndex: 1,
          explanation: 'Datum selection should follow the functional principle: datums should represent the surfaces that locate and constrain the part in its assembly. This ensures that manufacturing measurements reflect the actual assembly conditions. For example, if a bearing bore locates the part in the assembly, that bore should be a datum. Additionally, datums should be repeatable (stable contact), accessible for measurement, and compatible with manufacturing fixturing. The inspection fixturing should simulate the actual assembly datum contact.',
          hint: 'Datums should mirror how the part is located and constrained in the real assembly.'
        },
        {
          id: 'u9-L3-Q3',
          type: 'multiple-choice',
          question: 'You receive a cast iron housing with rough, uneven as-cast surfaces. The drawing calls out the entire bottom face as datum A. The part rocks on the CMM granite surface plate. What is the problem, and what GD&T tool solves it?',
          options: [
            'The CMM granite is not flat enough — replace it with a more precise surface plate',
            'The rough cast surface is unreliable as a full-surface datum because it causes inconsistent contact; datum targets (specific points, lines, or areas on the surface) should be used instead to ensure repeatable, stable datum establishment',
            'The part needs to be ground flat on the bottom before inspection',
            'Apply a flatness tolerance to datum A and the rocking will be controlled'
          ],
          correctIndex: 1,
          explanation: 'Datum targets specify discrete points, lines, or areas on a surface that establish the datum. They are essential for cast, forged, or sheet metal parts where the entire surface is rough, warped, or inconsistent. For example, three datum target points (A1, A2, A3) on the cast bottom surface establish a primary datum plane through exactly those three points, providing repeatable, stable contact regardless of surface irregularities. Without datum targets, the part may contact the surface plate at different high spots each time, causing measurement variation. Datum targets are designated with a target symbol (divided circle showing the datum letter and target number).',
          hint: 'If the whole surface cannot make reliable contact, how can you designate specific contact locations?'
        },
        {
          id: 'u9-L3-Q4',
          type: 'multiple-choice',
          question: 'A cylindrical feature is used as both the primary and secondary datum (e.g., |A|B| in the feature control frame, where A is a face and B is a bore). What does the bore (datum B) constrain?',
          options: [
            '3 degrees of freedom (one translation + two rotations)',
            '2 degrees of freedom (two translations perpendicular to the bore axis)',
            '1 degree of freedom (rotation about the bore axis)',
            '4 degrees of freedom (all but axial translation and axial rotation)'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="90" y="25" width="140" height="20" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><rect x="120" y="45" width="80" height="90" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><ellipse cx="160" cy="90" rx="25" ry="25" fill="white" stroke="#3B82F6" stroke-width="2"/><line x1="90" y1="45" x2="230" y2="45" stroke="#10B981" stroke-width="3"/><text x="45" y="42" text-anchor="end" font-size="12" font-weight="bold" fill="#10B981" font-family="sans-serif">A (face)</text><text x="45" y="55" text-anchor="end" font-size="10" fill="#10B981" font-family="sans-serif">3 DOF</text><text x="215" y="93" text-anchor="start" font-size="12" font-weight="bold" fill="#3B82F6" font-family="sans-serif">B (bore)</text><text x="215" y="108" text-anchor="start" font-size="10" fill="#3B82F6" font-family="sans-serif">2 DOF: X, Y</text><line x1="135" y1="90" x2="110" y2="90" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/><text x="105" y="87" text-anchor="end" font-size="10" fill="#6B7280" font-family="sans-serif">X</text><line x1="160" y1="115" x2="160" y2="140" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/><text x="165" y="148" text-anchor="start" font-size="10" fill="#6B7280" font-family="sans-serif">Y</text><path d="M 150 65 A 15 15 0 0 1 170 65" fill="none" stroke="#EC4899" stroke-width="1.5" stroke-dasharray="3,2"/><text x="160" y="18" text-anchor="middle" font-size="10" fill="#EC4899" font-family="sans-serif">Rotation about bore axis unconstrained (need C)</text></svg>',
          explanation: 'When a cylindrical bore is the secondary datum (after a planar primary datum A constrains 3 DOF), the bore constrains 2 additional DOF: the two translations perpendicular to the bore axis (X and Y if the bore axis is Z). The remaining unconstrained DOF is rotation about the bore axis, which requires a tertiary datum (e.g., a slot, hole, or flat). If the bore were the primary datum, it would constrain 4 DOF (2 translations + 2 rotations), leaving axial translation and axial rotation.',
          hint: 'The primary plane already constrains 3 DOF. What does a cylinder add to that?'
        },
        {
          id: 'u9-L3-Q5',
          type: 'multiple-choice',
          question: 'A machinist complains that parts keep failing inspection even though they look correct on the machine. You discover the machining fixture locates the part differently from the datum reference frame on the drawing. Why does this cause failures, and how should it be resolved?',
          options: [
            'The machinist should just adjust the CNC program offsets until parts pass inspection',
            'Fixture locating surfaces must simulate the drawing\'s datum features and follow the datum precedence (primary, secondary, tertiary); when they do not, the part is made in one coordinate system but inspected in another, causing systematic errors that cannot be corrected by offsets alone',
            'The drawing datums are just for inspection — manufacturing can use whatever fixturing is convenient',
            'The inspector should re-datum to match the machining fixture setup'
          ],
          correctIndex: 1,
          explanation: 'The manufacturing fixture should replicate the datum reference frame as closely as possible. The primary datum feature should be constrained first (3 points of contact), then the secondary (2 points), then the tertiary (1 point). If machining fixtures use different locating surfaces than the drawing datums, the resulting part geometry may meet tolerance when measured from the fixture datums but fail when inspected from the drawing datums. This is one of the most common sources of GD&T-related manufacturing problems. The fix is to redesign the fixture to simulate the drawing datums, or (if there is a good reason) to revise the drawing datums to match the manufacturing reality.',
          hint: 'If the part is made using one coordinate system but inspected using another, problems arise.'
        },
        {
          id: 'u9-L3-Q6',
          type: 'fill-blank',
          question: 'The system of three mutually perpendicular datum planes that fully constrains a part in 6 degrees of freedom is called the datum ___ frame.',
          acceptedAnswers: ['reference', 'Reference', 'DRF'],
          explanation: 'The Datum Reference Frame (DRF) is established by three mutually perpendicular datum planes derived from the primary, secondary, and tertiary datum features. It serves as the coordinate system from which all geometric tolerances are evaluated. The DRF is analogous to a workholding fixture or machine tool coordinate system. Every feature control frame that references datums is evaluated relative to this coordinate frame. Proper DRF establishment is fundamental to correct GD&T interpretation and inspection.',
          hint: 'This is the 3D coordinate system established by the three datums.'
        }
      ]
    },
    {
      id: 'u9-L4',
      title: 'Tolerance Stack-Up',
      description: 'Worst-case analysis, RSS (statistical), 1D chain analysis, gap analysis, tolerance allocation.',
      icon: '📊',
      xpReward: 30,
      questions: [
        {
          id: 'u9-L4-Q1',
          type: 'multiple-choice',
          question: 'A 1D tolerance stack has 5 dimensions, each with a tolerance of ±0.1 mm. Using worst-case analysis, what is the total stack-up tolerance?',
          options: [
            '±0.22 mm',
            '±0.50 mm',
            '±0.10 mm',
            '±1.00 mm'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="20" y="60" width="56" height="40" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" rx="2"/><rect x="76" y="60" width="56" height="40" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" rx="2"/><rect x="132" y="60" width="56" height="40" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" rx="2"/><rect x="188" y="60" width="56" height="40" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" rx="2"/><rect x="244" y="60" width="56" height="40" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.5" rx="2"/><text x="48" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">±0.1</text><text x="104" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">±0.1</text><text x="160" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">±0.1</text><text x="216" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">±0.1</text><text x="272" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">±0.1</text><line x1="20" y1="115" x2="300" y2="115" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><line x1="20" y1="110" x2="20" y2="120" stroke="#6B7280" stroke-width="1.5"/><line x1="300" y1="110" x2="300" y2="120" stroke="#6B7280" stroke-width="1.5"/><text x="160" y="135" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Worst-case: ±(0.1 x 5) = ±0.50</text><text x="160" y="155" text-anchor="middle" font-size="11" fill="#3B82F6" font-family="sans-serif">RSS: ±0.1 x √5 = ±0.22</text><text x="160" y="45" text-anchor="middle" font-size="12" fill="#1E293B" font-family="sans-serif">1D Tolerance Chain — 5 Dimensions</text></svg>',
          explanation: 'Worst-case (arithmetic) stack-up simply adds all tolerances: total = ±(0.1 + 0.1 + 0.1 + 0.1 + 0.1) = ±0.50 mm. This guarantees 100% of assemblies will be within the resulting tolerance, but it is the most conservative method. In practice, it is unlikely that all 5 dimensions are simultaneously at their worst limit, which is why statistical methods (RSS) are often preferred for cost optimization.',
          hint: 'Worst-case = simple sum of all individual tolerances.'
        },
        {
          id: 'u9-L4-Q2',
          type: 'multiple-choice',
          question: 'Compare worst-case vs. RSS tolerance stack-up analysis. When would you insist on using worst-case even though RSS gives a smaller (cheaper) tolerance?',
          options: [
            'Always use RSS — worst-case is obsolete and overly conservative',
            'When production volumes are very high — RSS only works for small batches',
            'When the consequence of failure is severe (safety-critical, medical, aerospace), production volumes are low (statistical assumptions weaken), or contractual/regulatory requirements mandate 100% interchangeability',
            'Only when the customer specifically requests it in the purchase order'
          ],
          correctIndex: 2,
          explanation: 'RSS assumes normal distributions and statistical independence, predicting ~99.73% of assemblies will be within tolerance (at 3-sigma). The ~0.27% that fall outside may be acceptable for consumer electronics but unacceptable for aircraft flight controls, medical implants, or explosive ordnance. Low production volumes (dozens, not thousands) undermine the statistical basis — with only 50 assemblies, even a 1% failure rate means real failures. Additionally, some standards (MIL-specs, certain automotive safety requirements) mandate worst-case analysis. The engineering judgment is knowing when the cost savings of RSS are worth the residual risk.',
          hint: 'Think about when even a 0.27% failure rate (2700 ppm) is unacceptable.'
        },
        {
          id: 'u9-L4-Q3',
          type: 'true-false',
          question: 'In a 1D tolerance chain, if a dimension contributes positively to the gap (increasing the gap as it increases), it is called an "increasing" contributor, and its tolerance adds in the positive direction.',
          correctAnswer: true,
          explanation: 'In 1D chain analysis, each dimension is classified as either an "increasing" contributor (gap increases as dimension increases) or a "decreasing" contributor (gap decreases as dimension increases). The nominal gap = sum of increasing dimensions − sum of decreasing dimensions. For worst-case gap analysis: maximum gap uses max of increasing and min of decreasing; minimum gap uses min of increasing and max of decreasing. Properly identifying positive and negative contributors is the most critical step in tolerance analysis.',
          hint: 'Think about the direction each dimension pushes the gap — does it open or close the gap?'
        },
        {
          id: 'u9-L4-Q4',
          type: 'multiple-choice',
          question: 'You are reviewing a 4-part assembly where the tolerance stack-up shows the gap can go negative (interference) under worst-case analysis, but RSS analysis shows the gap stays positive with comfortable margin. How do you decide which analysis to trust?',
          options: [
            'Always trust worst-case — if it shows interference, the design must be changed',
            'Always trust RSS — worst-case is unrealistically pessimistic',
            'Evaluate the consequences of the gap going negative, the production volume, and the process capability (Cpk) of each dimension; if interference causes a safety issue or the volumes are too low for statistics, redesign; if it causes only a cosmetic issue and volumes are high with well-controlled processes, RSS may be acceptable with inspection sampling',
            'Run a Monte Carlo simulation and if it agrees with RSS, use that result'
          ],
          correctIndex: 2,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="20" y="50" width="60" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="80" y="50" width="50" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="130" y="50" width="55" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="185" y="50" width="50" height="60" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><rect x="240" y="40" width="15" height="80" fill="none" stroke="#334155" stroke-width="2" rx="1"/><text x="50" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Part 1</text><text x="105" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Part 2</text><text x="157" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Part 3</text><text x="210" y="84" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Part 4</text><rect x="235" y="50" width="5" height="60" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1" opacity="0.7"/><text x="247" y="84" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">Gap?</text><line x1="20" y1="130" x2="255" y2="130" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><text x="50" y="145" text-anchor="middle" font-size="10" fill="#EF4444" font-family="sans-serif">WC: gap &lt; 0</text><text x="180" y="145" text-anchor="middle" font-size="10" fill="#10B981" font-family="sans-serif">RSS: gap &gt; 0</text><text x="160" y="170" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Decision depends on risk, volume, and Cpk</text></svg>',
          explanation: 'This is a judgment call that depends on context. Key factors: (1) Consequence severity — if negative gap means the product jams, leaks, or fails unsafely, worst-case governs. If it means a slight visual gap variation, RSS is reasonable. (2) Volume — RSS relies on statistical distributions; for 10 units/year, statistics are meaningless. For 100,000/year, they are valid. (3) Process capability — if Cpk > 1.33 for all contributors, the actual distributions are tighter than the tolerance bands, making RSS even more favorable. (4) Cost of failure vs. cost of tighter tolerances. Monte Carlo simulation with actual process data is the most sophisticated approach but requires real Cpk data from production.',
          hint: 'There is no universal right answer — it depends on risk, volume, and process control.'
        },
        {
          id: 'u9-L4-Q5',
          type: 'multiple-choice',
          question: 'When allocating tolerances to multiple dimensions in a stack-up, what approach optimizes cost?',
          options: [
            'Assign equal tolerance to every dimension',
            'Assign tighter tolerances to dimensions that are easier/cheaper to control, and looser tolerances to expensive ones',
            'Always use the tightest tolerance possible on every dimension',
            'Use only RSS analysis and ignore worst-case entirely'
          ],
          correctIndex: 1,
          explanation: 'Cost-optimized tolerance allocation assigns tighter tolerances to dimensions that are inexpensive to control (e.g., features machined in the same setup, turned diameters, injection molded dimensions) and looser tolerances to costly ones (e.g., features between different setups, large castings, cross-drilled holes). This is because manufacturing cost increases exponentially as tolerance tightens. Methods like Lagrange multiplier optimization or cost-tolerance models help distribute tolerances to minimize total cost while meeting the stack-up requirement.',
          hint: 'Tolerance is directly tied to cost — tighter = more expensive. Allocate strategically.'
        },
        {
          id: 'u9-L4-Q6',
          type: 'fill-blank',
          question: 'The statistical tolerance analysis method that computes the total tolerance as the square root of the sum of squared individual tolerances is called the ___ method.',
          acceptedAnswers: ['RSS', 'rss', 'Root Sum Square', 'root sum square', 'Root Sum of Squares', 'root sum of squares'],
          explanation: 'The RSS (Root Sum Square) method assumes individual dimensions follow normal distributions and are statistically independent. It predicts the assembly variation at approximately 3-sigma confidence (99.73%). RSS gives a smaller total tolerance than worst-case, resulting in lower manufacturing cost. However, it accepts a small probability (~0.27%) that assemblies will be out of tolerance. For higher confidence, a safety factor (inflator) can be applied, or Monte Carlo simulation can be used for non-normal distributions.',
          hint: 'This method uses the Pythagorean-like combination of individual tolerances.'
        }
      ]
    },
    {
      id: 'u9-L5',
      title: 'Surface Finish & Metrology',
      description: 'Ra/Rz/Rq, surface lay symbols, CMM basics, profilometry, measurement uncertainty.',
      icon: '🔬',
      xpReward: 25,
      questions: [
        {
          id: 'u9-L5-Q1',
          type: 'multiple-choice',
          question: 'A drawing specifies Ra 0.8 on a hydraulic cylinder bore, but the seals still leak. The Ra measurement confirms the surface meets spec. What might the Ra value be missing, and what additional parameter would you check?',
          options: [
            'Ra is the only relevant surface parameter — the leak must be caused by something else entirely',
            'Ra averages out the profile and can hide deep scratches or isolated peaks; check Rz (average max peak-to-valley height) or Rmax (single largest peak-to-valley), as isolated deep valleys create leak paths that Ra cannot detect',
            'The surface is too smooth — increase Ra to allow the seal to grip better',
            'Ra measurement was taken in the wrong direction — re-measure perpendicular to the lay'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><line x1="30" y1="90" x2="290" y2="90" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><path d="M30 90 L50 82 L65 96 L80 84 L95 94 L110 86 L125 93 L140 85 L155 95 L170 83 L185 92 L200 87 L215 91 L230 85 L245 93 L260 88 L275 90 L290 87" fill="none" stroke="#334155" stroke-width="2"/><path d="M30 90 L50 82 L65 96 L80 84 L95 94 L100 60 L105 94 L110 86 L125 93 L140 85 L155 95 L170 83 L185 92 L200 87 L215 91 L230 85 L245 93 L260 88 L275 90 L290 87" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="5,3"/><text x="25" y="93" text-anchor="end" font-size="10" fill="#6B7280" font-family="sans-serif">Mean</text><line x1="100" y1="60" x2="100" y2="45" stroke="#EF4444" stroke-width="1"/><text x="100" y="40" text-anchor="middle" font-size="10" fill="#EF4444" font-family="sans-serif">Deep scratch</text><text x="160" y="30" text-anchor="middle" font-size="11" fill="#334155" font-family="sans-serif">Same Ra — different Rz</text><rect x="30" y="140" width="100" height="25" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1" rx="2"/><text x="80" y="157" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Ra = average</text><rect x="160" y="140" width="130" height="25" fill="#FEE2E2" stroke="#EF4444" stroke-width="1" rx="2"/><text x="225" y="157" text-anchor="middle" font-size="10" fill="#1E293B" font-family="sans-serif">Rz = peak-to-valley</text></svg>',
          explanation: 'Ra (arithmetic average roughness) is a statistical average that can mask extreme features. Two surfaces with identical Ra can have very different Rz values — one may have a uniform profile while the other has deep isolated scratches that create leak paths. For sealing surfaces, Rz (or Rmax) is critical because a single deep valley can provide a continuous leak channel. Best practice for seal surfaces: specify both Ra and Rz (e.g., Ra ≤ 0.4 and Rz ≤ 2.5). Additionally, the lay direction matters — circumferential lay (from honing) is preferred for reciprocating seals because it does not create axial leak paths.',
          hint: 'Think about what kind of surface feature would allow fluid to bypass a seal, and whether Ra can detect it.'
        },
        {
          id: 'u9-L5-Q2',
          type: 'multiple-choice',
          question: 'Which surface roughness parameter is preferred for sealing surfaces because it better characterizes the peak heights that affect seal contact?',
          options: [
            'Ra (arithmetic average)',
            'Rz (average maximum height)',
            'Rq (root mean square)',
            'Rsk (skewness)'
          ],
          correctIndex: 1,
          explanation: 'Rz (average of the maximum peak-to-valley heights in each sampling length) is preferred for sealing surfaces because it captures the extreme deviations that affect seal contact and leakage. Ra averages out these extremes and can miss isolated deep valleys or high peaks. A surface with Ra 0.8 could have Rz values ranging from 4 to 12 depending on the process. For O-ring and lip seal surfaces, both Ra and Rz are typically specified (e.g., Ra ≤ 0.4 and Rz ≤ 2.5).',
          hint: 'Seals are affected by the tallest peaks and deepest valleys, not just the average roughness.'
        },
        {
          id: 'u9-L5-Q3',
          type: 'multiple-choice',
          question: 'Your CMM reports a flatness of 0.012 mm for a datum surface, but the CMM probed only 9 points on a 200 mm x 200 mm surface. A colleague argues this result may not be reliable. Are they right, and why?',
          options: [
            'They are wrong — 9 points is sufficient for any flatness measurement',
            'They are right — 9 points on a large surface may miss local deviations between probe points; increasing point density (or using a scanning probe) gives a more complete picture of the actual surface form, and the reported flatness could understate the true value',
            'Point count does not matter because the CMM software interpolates between points perfectly',
            'They are right, but only because the CMM probe tip radius was too large'
          ],
          correctIndex: 1,
          explanation: 'CMM measurements are only as good as the sampling strategy. With 9 points on a 200 mm x 200 mm surface, the average spacing is ~67 mm — any waviness, local high spots, or low spots between probe points are invisible. The reported flatness is the flatness of the 9-point sample, not the actual surface. Increasing to 25-50+ points, or using a continuous scanning probe, dramatically improves measurement confidence. ISO 12781 (flatness) and ASME B89.3.1 provide guidance on minimum point counts. This is a critical concept: measurement sampling strategy directly affects the reliability of reported tolerances.',
          hint: 'Can 9 discrete points fully represent the shape of a 200 mm x 200 mm surface?'
        },
        {
          id: 'u9-L5-Q4',
          type: 'multiple-choice',
          question: 'The surface lay symbol "⊥" on a drawing indicates that the surface texture pattern (lay) is:',
          options: [
            'Parallel to the surface boundary line',
            'Perpendicular to the surface boundary line',
            'Multi-directional (no dominant direction)',
            'Circular relative to the center of the surface'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><rect x="30" y="20" width="120" height="100" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><line x1="50" y1="25" x2="50" y2="115" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="70" y1="25" x2="70" y2="115" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="90" y1="25" x2="90" y2="115" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="110" y1="25" x2="110" y2="115" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="130" y1="25" x2="130" y2="115" stroke="#6B7280" stroke-width="1" opacity="0.5"/><text x="90" y="140" text-anchor="middle" font-size="11" fill="#334155" font-family="sans-serif">⊥ Perpendicular</text><line x1="30" y1="120" x2="150" y2="120" stroke="#334155" stroke-width="2.5"/><text x="90" y="158" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Lay ⊥ to boundary</text><rect x="190" y="20" width="110" height="100" fill="#E2E8F0" stroke="#334155" stroke-width="2" rx="2"/><line x1="195" y1="40" x2="295" y2="40" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="195" y1="55" x2="295" y2="55" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="195" y1="70" x2="295" y2="70" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="195" y1="85" x2="295" y2="85" stroke="#6B7280" stroke-width="1" opacity="0.5"/><line x1="195" y1="100" x2="295" y2="100" stroke="#6B7280" stroke-width="1" opacity="0.5"/><text x="245" y="140" text-anchor="middle" font-size="11" fill="#334155" font-family="sans-serif">= Parallel</text><line x1="190" y1="120" x2="300" y2="120" stroke="#334155" stroke-width="2.5"/><text x="245" y="158" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Lay ∥ to boundary</text></svg>',
          explanation: 'The lay symbol "⊥" indicates the predominant surface pattern runs perpendicular to the boundary line (the edge of the surface as viewed on the drawing). Lay is the directional pattern left by the manufacturing process — for example, turning creates circumferential lay (symbolized "C"), face milling creates parallel lay ("=" or "⊥" depending on feed direction), and lapping creates multi-directional lay ("M"). Lay direction affects seal performance, friction, and coating adhesion.',
          hint: 'This symbol shows the direction of the machining marks relative to the drawing view edge.'
        },
        {
          id: 'u9-L5-Q5',
          type: 'multiple-choice',
          question: 'A measurement instrument has an uncertainty of ±0.005 mm. According to the common 10:1 (or at minimum 4:1) gauge maker\'s rule, what is the tightest tolerance this instrument should be used to inspect?',
          options: [
            '±0.005 mm',
            '±0.010 mm',
            '±0.020 mm',
            '±0.050 mm'
          ],
          correctIndex: 2,
          explanation: 'The gauge maker\'s rule (gauge R&R principle) recommends that measurement uncertainty should be at most 1/4 to 1/10 of the tolerance being inspected. With ±0.005 mm uncertainty: minimum tolerance = 4 × 0.005 = 0.020 mm (at 4:1 ratio). At 10:1, the minimum tolerance would be 0.050 mm. Using an instrument too close to the tolerance leads to excessive Type I (rejecting good parts) and Type II (accepting bad parts) errors. This is formalized in ASME B89 and ISO 14253 measurement uncertainty standards.',
          hint: 'The measurement uncertainty should consume no more than 10-25% of the tolerance band.'
        },
        {
          id: 'u9-L5-Q6',
          type: 'multiple-choice',
          question: 'You discover a tolerance on a legacy drawing that seems unnecessarily tight — Ra 0.2 on a non-sealing, non-bearing surface that is hidden inside an enclosure. How do you handle it?',
          options: [
            'Just change it to Ra 3.2 and notify manufacturing — it is obviously a mistake',
            'Leave it as-is to avoid any risk — if it has worked for years, do not change it',
            'Investigate the design intent by reviewing assembly context, service history, and talking to the original designer if possible; if no functional reason is found, propose a change through the formal ECR/ECO process with documented justification and ensure affected BOMs and inspection plans are updated',
            'Ask manufacturing to ignore it and machine to whatever finish is convenient'
          ],
          correctIndex: 2,
          explanation: 'Tight tolerances on legacy drawings may exist for a reason not obvious from the drawing alone (e.g., a past failure that drove the change, a customer requirement, a coating adhesion need). Changing without investigation risks reintroducing a solved problem. The proper approach: (1) Research — check ECO history, talk to original designer, review assembly. (2) If no functional reason is found, document the rationale for relaxation. (3) Submit a formal ECR with cost savings analysis. (4) After approval, update the drawing, inspection plan, and any affected documents through the ECO process. Never make undocumented tolerance changes — they create configuration control problems.',
          hint: 'Legacy drawings may have hidden reasons for tight tolerances. What is the safe, professional process for changing them?'
        }
      ]
    }
  ]
};
