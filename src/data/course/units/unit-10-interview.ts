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
          question: 'You need to estimate the power required to keep a car moving at 100 km/h on a flat highway. Assuming drag coefficient Cd = 0.3, frontal area A = 2.2 m², and air density ρ = 1.2 kg/m³, what is the approximate aerodynamic drag power?',
          options: [
            '5 kW',
            '9 kW',
            '17 kW',
            '35 kW'
          ],
          correctIndex: 2,
          explanation: 'Drag force F = ½ρCdAV² = 0.5 × 1.2 × 0.3 × 2.2 × (27.78)² = 0.396 × 771.7 = 305 N. Power = F × V = 305 × 27.78 = 8,473 W ≈ 8.5 kW for aerodynamic drag alone. Adding rolling resistance (Crr ≈ 0.01, F_rr = 0.01 × 1500 × 9.81 = 147 N, P_rr = 4.1 kW) plus drivetrain losses (~15%), total power ≈ 17 kW. In interviews, showing a structured approach and identifying all major contributors matters more than exact numbers.',
          hint: 'P_drag = ½ρCdAV³. Don\'t forget rolling resistance and drivetrain losses for total power.'
        },
        {
          id: 'u10-L1-Q2',
          type: 'multiple-choice',
          question: 'A steel beam deflects 5 mm under a given load. If you double the beam\'s depth (height) while keeping the width the same, by approximately what factor does the deflection decrease?',
          options: [
            '2× (halves)',
            '4× (quarters)',
            '8× (one-eighth)',
            '16× (one-sixteenth)'
          ],
          correctIndex: 2,
          explanation: 'Deflection is inversely proportional to the moment of inertia I. For a rectangular beam, I = bh³/12. Doubling h increases I by 2³ = 8 times. Therefore deflection decreases by a factor of 8 to about 0.625 mm. This h³ relationship is why beam depth is the most efficient dimension to increase for stiffness. In interviews, knowing these scaling relationships lets you quickly evaluate design changes: width gives linear improvement, depth gives cubic improvement.',
          hint: 'Deflection ∝ 1/I, and I ∝ h³ for a rectangular section. How does doubling h affect I?'
        },
        {
          id: 'u10-L1-Q3',
          type: 'true-false',
          question: 'For a quick sanity check: the yield strength of common structural steel (A36/S275) is approximately 250 MPa, mild steel\'s Young\'s modulus is approximately 200 GPa, and water at room temperature weighs approximately 10 kN/m³.',
          correctAnswer: true,
          explanation: 'These are essential "anchor values" every mechanical engineer should know: A36 steel yield ≈ 250 MPa (36 ksi), E_steel ≈ 200 GPa (29 Msi), γ_water ≈ 9.81 kN/m³ ≈ 10 kN/m³. Other critical values: aluminum E ≈ 70 GPa, steel density ≈ 7850 kg/m³, aluminum density ≈ 2700 kg/m³, atmospheric pressure ≈ 101 kPa, g ≈ 9.81 m/s². Having these memorized enables rapid estimation and helps catch errors in calculations (sanity checking).',
          hint: 'These are fundamental "anchor numbers" that every mechanical engineer should have memorized.'
        },
        {
          id: 'u10-L1-Q4',
          type: 'multiple-choice',
          question: 'You want to estimate the natural frequency of a simply supported steel beam (L = 1 m, rectangular cross-section 50 × 10 mm, density 7850 kg/m³). Which order of magnitude is the first natural frequency closest to?',
          options: [
            '~5 Hz',
            '~50 Hz',
            '~500 Hz',
            '~5000 Hz'
          ],
          correctIndex: 1,
          explanation: 'f₁ = (π/2) × √(EI/(ρAL⁴)). I = 50 × 10³/12 = 4167 mm⁴ = 4.167 × 10⁻⁹ m⁴. A = 50 × 10 = 500 mm² = 5 × 10⁻⁴ m². EI = 200 × 10⁹ × 4.167 × 10⁻⁹ = 833.4 N·m². ρA = 7850 × 5 × 10⁻⁴ = 3.925 kg/m. f₁ = (π/2)√(833.4/(3.925 × 1)) = 1.571 × √212.3 = 1.571 × 14.57 = 22.9 Hz ≈ order of ~50 Hz. The key insight: thin beams have low natural frequencies. Doubling thickness quadruples frequency (f ∝ h for thin rectangular beams).',
          hint: 'f₁ = (π/2L²)√(EI/ρA) for a simply supported beam. Estimate the order of magnitude.'
        },
        {
          id: 'u10-L1-Q5',
          type: 'multiple-choice',
          question: 'An interviewer asks: "How many ball bearings fit inside this room (4m × 5m × 3m)?" The bearings are 10 mm diameter. What is the best estimation approach?',
          options: [
            'Calculate exact room volume divided by sphere volume, no adjustments',
            'Calculate room volume, divide by sphere volume, then multiply by a packing fraction (~0.64 for random packing)',
            'Count how many bearings fit along each edge and multiply the three numbers',
            'Estimate it as "millions" without any calculation'
          ],
          correctIndex: 1,
          explanation: 'Room volume = 4 × 5 × 3 = 60 m³. Sphere volume = (4/3)π(0.005)³ = 5.24 × 10⁻⁷ m³. Naive count = 60/5.24 × 10⁻⁷ = 1.15 × 10⁸. Apply random packing fraction (0.64): ≈ 0.64 × 1.15 × 10⁸ ≈ 73 million. In Fermi problems, the packing fraction is the critical insight — spheres don\'t fill space completely. Showing you know the packing fraction (~0.64 random, ~0.74 FCC/HCP optimal) demonstrates engineering judgment. The exact answer matters less than the structured approach.',
          hint: 'Spheres cannot fill 100% of space. The packing fraction for random sphere packing is about 0.64.'
        },
        {
          id: 'u10-L1-Q6',
          type: 'fill-blank',
          question: 'Quick estimation problems that require breaking a complex question into simpler, estimable parts are commonly called ___ problems (named after the physicist who popularized them).',
          acceptedAnswers: ['Fermi', 'fermi', 'Fermi estimation'],
          explanation: 'Fermi problems (named after Enrico Fermi) test the ability to make reasonable estimates using logic, approximation, and known anchor values. Classic examples: "How many piano tuners are in Chicago?" or "How many golf balls fit in a school bus?" In engineering interviews, they assess structured thinking, physical intuition, and ability to identify the dominant factors. The key skill is decomposing the problem into parts you can estimate independently and combining them.',
          hint: 'This Italian-American physicist was famous for making quick order-of-magnitude estimates.'
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
          question: 'A rotating shaft fracture surface shows a smooth, flat region with beach marks (concentric arc lines) covering 80% of the cross-section, and a rough, granular final fracture zone covering 20%. What does this indicate?',
          options: [
            'Sudden overload failure — the part was undersized',
            'Fatigue failure under relatively low stress — the crack grew slowly through most of the section before fast fracture',
            'Hydrogen embrittlement',
            'Stress corrosion cracking'
          ],
          correctIndex: 1,
          explanation: 'Beach marks (macroscopic concentric arcs radiating from the crack origin) are the hallmark of fatigue failure. A large smooth fatigue zone (80%) relative to the rough final fracture zone (20%) indicates the nominal stress was relatively low — the crack had time to propagate through most of the section before the remaining area was insufficient. High-stress fatigue shows the opposite: small fatigue zone and large final fracture zone. The beach mark pattern also reveals the crack origin location, which is critical for root cause analysis.',
          hint: 'Beach marks indicate progressive crack growth. The ratio of fatigue zone to final fracture zone indicates the stress level.'
        },
        {
          id: 'u10-L2-Q2',
          type: 'multiple-choice',
          question: 'A stainless steel pipe carrying chloride-containing water at 80°C cracks along the grain boundaries after 2 years of service with no significant corrosion or wall thinning. The most likely failure mechanism is:',
          options: [
            'General corrosion',
            'Fatigue cracking',
            'Stress corrosion cracking (SCC)',
            'Erosion-corrosion'
          ],
          correctIndex: 2,
          explanation: 'Stress corrosion cracking (SCC) requires three simultaneous conditions: susceptible material (austenitic stainless steel), aggressive environment (chloride ions at elevated temperature), and tensile stress (residual or applied). SCC in austenitic stainless steels is typically transgranular and branching. The absence of significant wall loss rules out general corrosion and erosion. The time-dependent nature and specific conditions (chloride + temperature + stress) are classic SCC indicators. Prevention: use duplex stainless steel, reduce chlorides, stress-relieve, or lower temperature.',
          hint: 'Three conditions are needed: susceptible material + corrosive environment + tensile stress.'
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
          question: 'A cast iron bracket fails suddenly during winter operation at −20°C with a flat, granular fracture surface and no visible plastic deformation. What failure mode is most likely?',
          options: [
            'Fatigue failure',
            'Creep rupture',
            'Brittle fracture',
            'Ductile overload'
          ],
          correctIndex: 2,
          explanation: 'The combination of cold temperature, flat granular fracture, and absence of plastic deformation points to brittle fracture. Cast iron is a BCC material with a ductile-to-brittle transition temperature (DBTT) that can be above 0°C for gray cast iron. At −20°C, the material has low toughness and fractures in a brittle manner. The flat, granular (cleavage) surface is characteristic of transgranular brittle fracture. Prevention: use ductile iron or steel, design for low stress concentrations, and verify material toughness at the minimum service temperature using Charpy testing.',
          hint: 'Cold temperature + no plastic deformation + granular fracture surface = what failure mode?'
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
          explanation: 'The 6M categories in a fishbone diagram are: Man (people/operators), Machine (equipment), Method (process/procedures), Material (raw materials/components), Measurement (inspection/calibration), and Mother Nature (environment — temperature, humidity, contamination). "Marketing" is not a standard category. The fishbone diagram is a brainstorming tool to systematically identify potential causes of a problem. Each "bone" branches into sub-causes, creating a comprehensive cause map. It is most effective when used by a cross-functional team.',
          hint: 'The 6Ms: Man, Machine, Method, Material, Measurement, and Mother Nature (Environment).'
        },
        {
          id: 'u10-L2-Q6',
          type: 'fill-blank',
          question: 'The failure analysis technique of asking "why?" repeatedly (typically five times) to drill down from symptoms to the fundamental root cause is called the ___ Whys method.',
          acceptedAnswers: ['5', 'five', 'Five', '5 Whys'],
          explanation: 'The 5 Whys method (developed by Sakichi Toyoda, used at Toyota) involves asking "Why?" iteratively to peel back layers of symptoms and reach the true root cause. Example: Bearing failed → Why? Insufficient lubrication → Why? Grease port blocked → Why? No preventive maintenance schedule → Why? No PM program for auxiliary equipment → Root cause: gap in maintenance management system. The "5" is a guideline, not a rule — some problems need 3 iterations, others 7. The key is to keep asking until you reach a systemic cause that can be corrected.',
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
          question: 'On an Ashby chart plotting Young\'s modulus (E) vs. density (ρ), the material index for a stiff, lightweight beam in bending is E^(1/2)/ρ. Which material family typically falls on the optimal guideline for this index?',
          options: [
            'Steels — they have the highest absolute stiffness',
            'CFRP composites and wood — they have the best stiffness-to-weight ratio in bending',
            'Titanium alloys — they combine strength and low density',
            'Aluminum alloys — they are the lightest metals'
          ],
          correctIndex: 1,
          explanation: 'For minimum-weight beam design (bending stiffness constraint), the material index is E^(1/2)/ρ. CFRP composites and natural wood achieve the highest values of this index, placing them on the optimal guideline on the Ashby chart. Steel has high absolute E but also high ρ, giving a poor E^(1/2)/ρ ratio. This is why aircraft use composites for stiffness-critical structures. The material index changes with the loading mode: E/ρ for axial stiffness (tension/compression), E^(1/3)/ρ for plate bending.',
          hint: 'The optimal material minimizes weight while maintaining stiffness. Think about E^(1/2)/ρ ratios.'
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
          explanation: 'The Pugh matrix compares design concepts against a reference (datum) design using criteria scored as better (+), same (S), or worse (−). Advantages: it forces explicit evaluation of each concept against multiple criteria, identifies the strongest concepts, and often reveals hybrid solutions by combining the best features of top-ranked concepts. It does not eliminate judgment — the criteria selection and weighting still require engineering experience. It is a structured framework for making design decisions transparent and defensible.',
          hint: 'The Pugh matrix compares alternatives to a datum using +/S/− scores across multiple criteria.'
        },
        {
          id: 'u10-L3-Q3',
          type: 'true-false',
          question: 'Design for Assembly (DFA) primarily focuses on reducing the total number of parts in a product, while Design for Manufacturing (DFM) focuses on making each individual part easier and cheaper to produce.',
          correctAnswer: true,
          explanation: 'DFA aims to minimize part count by asking three questions for each part: Does it move relative to adjacent parts? Does it need to be different material? Does it need to be separate for assembly/service? If the answer to all three is "no," the part is a candidate for elimination or combination. DFM focuses on individual parts: avoiding tight tolerances, reducing machining setups, designing for the intended process. Together, DFMA reduces product cost by 30–50% typically. Boothroyd-Dewhurst DFMA is the most widely used methodology.',
          hint: 'DFA reduces the number of parts; DFM simplifies each remaining part.'
        },
        {
          id: 'u10-L3-Q4',
          type: 'multiple-choice',
          question: 'You must select between aluminum 6061-T6 and steel AISI 1045 for a bracket. The bracket must support 10 kN and weigh as little as possible. The relevant yield strengths are: Al 6061-T6 σ_y = 275 MPa (ρ = 2700 kg/m³), AISI 1045 σ_y = 530 MPa (ρ = 7850 kg/m³). Which material gives the lighter bracket for a simple tension member?',
          options: [
            'Steel — it is much stronger so less material is needed',
            'Aluminum — its strength-to-density ratio (σ_y/ρ) is higher',
            'They are approximately equal in weight for the same load capacity',
            'Cannot be determined without knowing the exact geometry'
          ],
          correctIndex: 1,
          explanation: 'For a tension member, weight ∝ ρ/σ_y. Aluminum: ρ/σ_y = 2700/275 = 9.82 kg/m³ per MPa. Steel: ρ/σ_y = 7850/530 = 14.81 kg/m³ per MPa. Aluminum is ~34% lighter for the same tensile load capacity. However, if stiffness (not strength) controls the design, the comparison changes: E/ρ for aluminum (70000/2700 = 25.9) vs. steel (200000/7850 = 25.5) are nearly equal — aluminum offers no weight savings for stiffness-limited tension members. Always identify whether strength or stiffness governs before selecting materials.',
          hint: 'Compare specific strength (σ_y/ρ). For tension, weight is proportional to ρ/σ_y × load.'
        },
        {
          id: 'u10-L3-Q5',
          type: 'multiple-choice',
          question: 'An interviewer asks: "You need to reduce the cost of a machined part by 30%. What approaches would you consider?" Which response demonstrates the best engineering thinking?',
          options: [
            'Use cheaper material — this is always the biggest cost driver',
            'Reduce all tolerances by 30% to decrease machining time',
            'Systematically analyze the part for material change, tolerance relaxation on non-critical features, reduced number of machining setups, and potential process change (e.g., casting + machining instead of machining from billet)',
            'Switch to 3D printing — it is always cheaper than machining'
          ],
          correctIndex: 2,
          explanation: 'A systematic approach considers all cost drivers: material cost (can a cheaper alloy or near-net-shape blank reduce material waste?), machining time (can non-critical tolerances be relaxed to allow faster feeds or fewer passes?), setup time (can features be redesigned to reduce the number of fixturing setups?), and process substitution (would casting/forging + finish machining be cheaper at this volume?). Single-focus answers miss significant savings opportunities. In interviews, structured problem-solving methodology matters as much as technical knowledge.',
          hint: 'Good engineering is systematic — consider material, tolerances, setups, and process alternatives.'
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
          question: 'In an FEA stress analysis, you observe that the maximum stress at a sharp re-entrant corner keeps increasing as you refine the mesh. This likely indicates:',
          options: [
            'The model is diverging and the analysis has failed',
            'A stress singularity — the theoretical stress at a sharp corner is infinite, and mesh refinement approaches this singularity',
            'The material model is incorrect',
            'The boundary conditions are wrong'
          ],
          correctIndex: 1,
          explanation: 'Sharp re-entrant corners (e.g., 90° internal corners without fillets) create stress singularities where the theoretical elastic stress is mathematically infinite. As the mesh is refined, FEA increasingly captures this singularity, and the peak stress grows without bound — it never converges. This does NOT mean the real part will fail at that stress. Solutions: add a fillet radius (which eliminates the singularity and the stress converges), or evaluate stress slightly away from the corner, or use sub-modeling with appropriate local treatment.',
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
          question: 'A mesh convergence study is performed by progressively refining the mesh and checking that the key result (e.g., maximum von Mises stress at a specific location) stabilizes to within an acceptable tolerance (typically 2–5%).',
          correctAnswer: true,
          explanation: 'Mesh convergence ensures that results are independent of mesh density. The process: run the analysis with an initial mesh, refine (globally or locally), re-run, and compare key results. When the result changes by less than the acceptance criterion (typically 2–5%) between successive refinements, the mesh is considered converged. Important: always check convergence at the location of interest (not the overall maximum, which may be at a singularity). Report convergence information in any FEA study — results without convergence evidence are not credible.',
          hint: 'Convergence means further mesh refinement does not significantly change the results.'
        },
        {
          id: 'u10-L4-Q4',
          type: 'multiple-choice',
          question: 'For a thin-walled pressure vessel FEA model, which element type is most computationally efficient while still providing accurate results?',
          options: [
            'Solid 3D hexahedral elements with fine mesh through thickness',
            'Shell elements with mid-surface extraction',
            'Truss (bar) elements',
            '2D plane stress elements'
          ],
          correctIndex: 1,
          explanation: 'Shell elements are ideal for thin-walled structures (t/R < 1/10) because they model the mid-surface without requiring multiple elements through the thickness. This dramatically reduces model size (typically 10–100× fewer elements than solid modeling). Shell elements capture membrane stress, bending stress, and transverse shear. They are the standard choice for pressure vessels, piping, aircraft fuselages, car bodies, and sheet metal structures. Solid elements should be used for thick-walled structures, local stress details, or where through-thickness stress variation is complex.',
          hint: 'For thin-walled structures, which element type eliminates the need for multiple elements through the wall thickness?'
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
          explanation: 'In a static analysis, reaction forces must balance applied forces (Newton\'s third law). A 10% imbalance (50 N) indicates a significant problem. Common causes: inadequately constrained rigid body motion (the model "flies away" and the solver applies artificial forces), contact surfaces not properly engaged, inertia relief settings, unconverged nonlinear solution, or numerical issues. The first check in any FEA analysis should be global force and moment equilibrium — if reactions don\'t balance applied loads to within 0.1–1%, the results cannot be trusted.',
          hint: 'In static equilibrium, ΣF = 0. What does an imbalance tell you about the model?'
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
            'Approve it — a safety factor above 1.0 means it won\'t yield',
            'Reject it — a safety factor of 1.1 is dangerously low for a dynamically loaded consumer product; recommend increasing to at least 2.0–3.0 considering load uncertainty, material variability, fatigue, and liability',
            'Approve it but add a warning label',
            'Reject it and recommend switching to steel'
          ],
          correctIndex: 1,
          explanation: 'A safety factor of 1.1 against yield under dynamic loading is unacceptable for a consumer product. Reasons: load estimates have uncertainty (±20–30% typical), material properties vary (±10%), fatigue strength is lower than static yield (typically 40–50% of UTS), and consumer products face unpredictable abuse loads. Industry standards typically require SF = 2.0–4.0 for dynamic consumer products. Additionally, product liability exposure makes low safety factors a business risk. The recommendation should include specific options: increase thickness, add stiffening ribs, or change cross-section geometry.',
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
          question: 'A pump in a chemical plant loses flow rate gradually over 6 months, then suddenly fails to pump. No leak is visible. What is the most likely diagnosis?',
          options: [
            'The motor has reversed direction due to wiring fault',
            'Impeller erosion/corrosion has progressively reduced performance until the pump can no longer overcome system head, or the impeller has completely failed',
            'Air in the suction line from day one',
            'The discharge valve was closed during startup'
          ],
          correctIndex: 1,
          explanation: 'The gradual degradation over months followed by complete failure is characteristic of progressive impeller damage (erosion, corrosion, or cavitation damage). As the impeller loses material, the pump curve shifts downward — less head and flow at each operating point. Eventually, the pump can no longer overcome the system static head (minimum head at zero flow), and flow drops to zero. Other clues: increasing vibration over time (imbalance from uneven material loss), increasing power consumption, and cavitation noise. This scenario is classic for pumps handling abrasive or corrosive fluids.',
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
          explanation: 'Design for Manufacturing (DFM) ensures that part designs are compatible with the intended manufacturing processes at acceptable cost and quality. Key DFM principles include: using standard tooling sizes, avoiding features that require special setups, maintaining uniform wall thickness (casting/molding), specifying tolerances no tighter than necessary, and designing features accessible to cutting tools. DFM is most effective when applied early in the design phase, where 70–80% of manufacturing cost is determined. It requires collaboration between design and manufacturing engineers.',
          hint: 'This DFM practice ensures designs can be produced efficiently and economically.'
        }
      ]
    }
  ]
};
