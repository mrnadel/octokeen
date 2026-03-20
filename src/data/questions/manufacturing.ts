import type { Question } from '../types';

export const manufacturingQuestions: Question[] = [
  // MFG-001 — Multiple Choice
  {
    id: 'mfg-001',
    type: 'multiple-choice',
    topic: 'manufacturing',
    subtopic: 'Machining',
    difficulty: 'beginner',
    question: 'You need a surface finish of Ra 0.4 μm on a steel shaft. Which process is most appropriate?',
    options: [
      { id: 'a', text: 'Turning on a lathe with a standard insert' },
      { id: 'b', text: 'Cylindrical grinding' },
      { id: 'c', text: 'Rough milling' },
      { id: 'd', text: 'Sand casting with no post-machining' },
    ],
    correctAnswer: 'b',
    explanation: 'Ra 0.4 μm is a fine finish that requires an abrasive process. Standard turning typically achieves Ra 0.8-3.2 μm. Cylindrical grinding routinely achieves Ra 0.2-0.8 μm. Milling gives Ra 1.6-6.3 μm. Sand casting produces Ra 12-25 μm. For even finer finishes (Ra < 0.1), lapping or superfinishing would be needed.',
    interviewInsight: 'Knowing which process achieves which surface finish is fundamental manufacturing knowledge. Interviewers test this to see if you can specify realistic finishes on drawings.',
    realWorldConnection: 'Bearing journals, seal surfaces, and gauge blocks all require grinding or better finishes. Specifying an unnecessarily fine finish on a non-critical surface wastes money.',
    commonMistake: 'Thinking that turning can achieve any finish with a slow enough feed rate. While fine turning can approach Ra 0.8, achieving Ra 0.4 consistently requires grinding.',
    tags: ['surface-finish', 'grinding', 'turning', 'Ra', 'machining'],
  },

  // MFG-002 — Design Decision
  {
    id: 'mfg-002',
    type: 'design-decision',
    topic: 'manufacturing',
    subtopic: 'Casting & Molding',
    difficulty: 'intermediate',
    question: 'You need 10,000 units per year of a complex aluminum housing (about 300mm × 200mm × 100mm, 2-3mm wall thickness). Which process do you choose?',
    context: 'The part has internal ribs, bosses for fasteners, and requires a Class A external surface (painted). Tolerances are ±0.2mm on critical features. Weight target is under 400g.',
    designOptions: [
      {
        id: 'a',
        text: 'Sand casting',
        tradeoffs: 'Low tooling cost (~$5k), but poor surface finish (requires machining), wide tolerances (±1mm), slow cycle time. Porosity risk.',
      },
      {
        id: 'b',
        text: 'High-pressure die casting (HPDC)',
        tradeoffs: 'Excellent surface finish, tight tolerances (±0.1mm), fast cycle time (<60s). High tooling cost (~$50-100k). Can achieve 2mm walls. Some porosity from trapped air.',
      },
      {
        id: 'c',
        text: 'CNC machining from billet',
        tradeoffs: 'No tooling cost, excellent tolerances and finish. But very expensive per part for this geometry (lots of material removal, complex 5-axis work). Material waste >80%.',
      },
      {
        id: 'd',
        text: 'Investment casting',
        tradeoffs: 'Good surface finish, complex shapes possible, moderate tooling ($10-20k). But cycle time is long and cost per part is high for aluminum. Better suited for steel/superalloys.',
      },
    ],
    bestOption: 'b',
    evaluationCriteria: ['Per-unit cost at 10k/year volume', 'Surface finish quality', 'Dimensional accuracy', 'Ability to produce thin walls and complex geometry', 'Tooling amortization'],
    explanation: 'At 10,000 units/year, HPDC amortizes the high tooling cost to ~$5-10 per part while delivering near-net-shape parts with excellent surface finish. The fast cycle time (~30-60 seconds) and minimal secondary machining make it the cost winner. Sand casting would require too much post-machining. CNC is too expensive per part. Investment casting is overkill for aluminum.',
    interviewInsight: 'Process selection for a given volume and geometry is the most common manufacturing interview question. The interviewer wants to see that you can match process capabilities to requirements and consider the economics.',
    commonMistake: 'Choosing CNC machining because it gives the best quality — at 10k units/year, the per-part cost is prohibitive. Also, not knowing that die casting can achieve ±0.1mm tolerances.',
    tags: ['die-casting', 'aluminum', 'process-selection', 'volume', 'tooling-cost'],
  },

  // MFG-003 — Multi-Select
  {
    id: 'mfg-003',
    type: 'multi-select',
    topic: 'manufacturing',
    subtopic: 'Welding & Joining',
    difficulty: 'intermediate',
    question: 'Which of the following are TRUE about the heat-affected zone (HAZ) in a steel weld? (Select all that apply)',
    options: [
      { id: 'a', text: 'The HAZ is the region that melted and re-solidified during welding' },
      { id: 'b', text: 'The HAZ can be harder AND more brittle than the base metal due to uncontrolled cooling' },
      { id: 'c', text: 'Pre-heating the workpiece before welding can reduce HAZ hardness' },
      { id: 'd', text: 'The HAZ does not exist in aluminum welds — only in steel' },
      { id: 'e', text: 'The HAZ is often the weakest link in a welded joint and where cracks initiate' },
    ],
    correctAnswers: ['b', 'c', 'e'],
    explanation: 'The HAZ is the region ADJACENT to the weld that was heated enough to change microstructure but did NOT melt (option a is wrong — that is the fusion zone). In steel, rapid cooling in the HAZ can form martensite, making it hard and brittle (b). Pre-heating slows the cooling rate, preventing martensite formation (c). Aluminum also has a HAZ where the temper condition is lost (d is wrong). The HAZ is indeed where many weld failures initiate (e) because its microstructure is uncontrolled.',
    interviewInsight: 'Understanding the HAZ is critical for any role involving welded structures. The interviewer wants to see that you know the HAZ is NOT the weld itself, and that you understand the metallurgical changes that occur there.',
    commonMistake: 'Confusing the HAZ with the fusion zone (weld bead itself). The HAZ never melted — it was just heated enough to change its metallurgy.',
    tags: ['HAZ', 'welding', 'martensite', 'preheat', 'steel', 'cracking'],
  },

  // MFG-004 — Free Text / Explanation
  {
    id: 'mfg-004',
    type: 'explanation',
    topic: 'manufacturing',
    subtopic: 'Design for Manufacturing',
    difficulty: 'intermediate',
    question: 'A designer sends you a part with a deep, narrow slot (20mm deep, 2mm wide) machined into a steel block. You are the manufacturing engineer. What feedback do you give?',
    sampleAnswer: 'That slot has a depth-to-width aspect ratio of 10:1, which is very challenging to machine. Issues include:\n\n1. Tool deflection: A 2mm end mill is extremely flexible. At 20mm depth, it will deflect significantly, causing taper and poor surface finish on the slot walls.\n\n2. Chip evacuation: Chips cannot escape a deep narrow slot easily, leading to re-cutting, heat buildup, and potential tool breakage.\n\n3. Tool breakage: The slender tool is prone to snapping, especially if there is any chatter or chip packing.\n\n4. Cycle time: Multiple light passes are needed, with pecking cycles for chip clearing, dramatically increasing machining time.\n\nRecommendations: (1) Widen the slot to at least 4mm if function allows (aspect ratio drops to 5:1, much more feasible). (2) Add a relief radius at the bottom if sharp corners are not required. (3) Consider wire EDM if the narrow width is truly required — it handles deep narrow slots easily regardless of aspect ratio. (4) If volume justifies it, broaching is another option for through-slots.',
    keyPoints: [
      'High aspect ratio (10:1) causes tool deflection and chip evacuation problems',
      'Tool breakage risk is high with a 2mm end mill at 20mm depth',
      'DFM recommendation: widen the slot or use wire EDM',
      'Bottom corner radius should match available tool geometry',
      'Cost increases dramatically with aspect ratio',
    ],
    explanation: 'DFM feedback is one of the most valuable skills a manufacturing engineer brings. Catching impractical features before they reach the shop floor saves time, money, and frustration.',
    interviewInsight: 'This tests practical manufacturing knowledge that only comes from shop-floor experience or strong DFM training. The interviewer wants to see that you can identify a problem, explain WHY it is a problem, and propose alternatives.',
    commonMistake: 'Saying "it can be machined" without flagging the cost and quality issues. Also, not knowing about wire EDM as an alternative for difficult slot geometries.',
    tags: ['DFM', 'machining', 'slot', 'aspect-ratio', 'tool-deflection', 'wire-EDM'],
  },

  // MFG-005 — Multiple Choice
  {
    id: 'mfg-005',
    type: 'multiple-choice',
    topic: 'manufacturing',
    subtopic: 'Additive Manufacturing',
    difficulty: 'intermediate',
    question: 'Which additive manufacturing process would you choose for a functional metal prototype that needs to survive fatigue testing?',
    options: [
      { id: 'a', text: 'FDM with a metal-filled PLA filament' },
      { id: 'b', text: 'SLA with a castable resin followed by investment casting' },
      { id: 'c', text: 'Direct Metal Laser Sintering (DMLS) / Selective Laser Melting (SLM)' },
      { id: 'd', text: 'Binder Jetting with bronze infiltration' },
    ],
    correctAnswer: 'c',
    explanation: 'DMLS/SLM produces fully dense metal parts by melting metal powder layer-by-layer with a laser. The resulting parts have mechanical properties approaching wrought material (especially after HIP treatment). FDM metal-filled filament is not structural metal — it is plastic with metal particles. SLA + investment casting would work but adds lead time and cost. Binder Jetting with bronze infiltration produces parts with lower density and inferior mechanical properties compared to wrought metal, making them unsuitable for fatigue testing.',
    interviewInsight: 'Knowing the capabilities and limitations of different AM processes is increasingly important. The interviewer wants to see that you can match the process to the functional requirement.',
    realWorldConnection: 'DMLS is used for flight-qualified aerospace components (GE LEAP fuel nozzles), medical implants, and Formula 1 parts where complex geometry and full density are both required.',
    commonMistake: 'Thinking any "metal 3D printing" process produces fully dense, structural parts. FDM with metal-filled filament and binder jetting produce parts that look metallic but have inferior mechanical properties.',
    tags: ['additive-manufacturing', 'DMLS', 'SLM', 'metal-3D-printing', 'fatigue', 'prototype'],
  },

  // MFG-006 — Spot the Flaw
  {
    id: 'mfg-006',
    type: 'spot-the-flaw',
    topic: 'manufacturing',
    subtopic: 'Metal Forming',
    difficulty: 'intermediate',
    question: 'Spot the flaw in this manufacturing plan:',
    statement: 'To make 100,000 stainless steel brackets per year, we will laser-cut the flat blanks from sheet metal and then cold-form them in a press brake to create 90-degree bends. Since stainless steel is ductile, we can use the same bend radius as mild steel — one material thickness minimum.',
    flaw: {
      text: 'Since stainless steel is ductile, we can use the same bend radius as mild steel — one material thickness minimum.',
      flawIndex: 2,
      flawExplanation: 'Stainless steel work-hardens much more aggressively than mild steel and has higher springback. The minimum bend radius for stainless steel is typically 1.5-2× material thickness, compared to 0.5-1× for mild steel. Using too tight a radius will cause cracking on the outer surface of the bend. Additionally, the greater springback means you need to overbend by several degrees to achieve a 90° final angle.',
    },
    correctedStatement: 'Stainless steel requires a larger minimum bend radius (1.5-2× thickness) than mild steel due to its higher work-hardening rate and greater springback. The press brake must also compensate for this springback (typically 3-5° overbend for 90° final angle).',
    explanation: 'Stainless steel\'s work-hardening behavior is one of its defining characteristics. While it provides good formability overall, the higher flow stress and springback must be accounted for in bend tooling and process setup.',
    interviewInsight: 'This tests whether you know the practical differences between forming mild steel and stainless steel. It is a very common manufacturing engineering interview topic.',
    commonMistake: 'Assuming all "ductile metals" form the same way. Stainless steel, aluminum, and mild steel all have different minimum bend radii and springback characteristics.',
    tags: ['bending', 'stainless-steel', 'springback', 'work-hardening', 'press-brake', 'DFM'],
  },

  // MFG-007 — Ranking
  {
    id: 'mfg-007',
    type: 'ranking',
    topic: 'manufacturing',
    subtopic: 'Casting & Molding',
    difficulty: 'intermediate',
    question: 'Rank these manufacturing processes by typical dimensional tolerance capability (tightest first):',
    items: [
      { id: 'a', text: 'CNC machining (milling)' },
      { id: 'b', text: 'Sand casting' },
      { id: 'c', text: 'Injection molding (plastic)' },
      { id: 'd', text: 'Die casting (aluminum)' },
      { id: 'e', text: 'Sheet metal stamping' },
    ],
    correctOrder: ['a', 'c', 'd', 'e', 'b'],
    explanation: 'CNC machining: ±0.01-0.05mm. Injection molding: ±0.05-0.2mm (mold is machined precisely and plastic fills it faithfully). Die casting: ±0.1-0.3mm. Sheet metal stamping: ±0.1-0.5mm (depends on die quality and material). Sand casting: ±0.5-2.0mm (mold accuracy is limited by sand grain size and pattern wear).',
    interviewInsight: 'Knowing the tolerance capabilities of different processes helps you design parts that are manufacturable without excessive secondary operations. This is fundamental DFM knowledge.',
    realWorldConnection: 'Specifying a ±0.05mm tolerance on a sand casting forces unnecessary machining. Matching tolerances to process capability reduces cost and lead time.',
    commonMistake: 'Not knowing that injection molding can achieve very tight tolerances — many engineers assume "plastic = loose tolerance." A well-made injection mold can hold ±0.05mm.',
    tags: ['tolerance', 'process-capability', 'CNC', 'casting', 'injection-molding', 'stamping'],
  },

  // MFG-008 — Multiple Choice
  {
    id: 'mfg-008',
    type: 'multiple-choice',
    topic: 'manufacturing',
    subtopic: 'Welding & Joining',
    difficulty: 'beginner',
    question: 'You need to weld thin (1.5mm) aluminum sheet for a lightweight enclosure. Which welding process is most appropriate?',
    options: [
      { id: 'a', text: 'Shielded Metal Arc Welding (SMAW / stick welding)' },
      { id: 'b', text: 'TIG welding (GTAW) with AC current and argon shielding' },
      { id: 'c', text: 'Oxy-acetylene gas welding' },
      { id: 'd', text: 'Submerged arc welding (SAW)' },
    ],
    correctAnswer: 'b',
    explanation: 'TIG (GTAW) with AC current is the standard process for thin aluminum. AC current is required because it breaks up the tenacious aluminum oxide layer during the electrode-positive half-cycle while providing penetration during the electrode-negative half-cycle. Argon shielding prevents oxidation. TIG provides precise heat input control essential for thin material. SMAW is impractical for thin aluminum and produces poor-quality results. Oxy-acetylene provides too little heat control for thin sheet. SAW is for thick plate only.',
    interviewInsight: 'This is a basic joining knowledge question. Every mechanical engineer should know which welding process suits which application. The AC requirement for aluminum TIG welding is a common interview detail.',
    realWorldConnection: 'This is how aluminum boat hulls, aircraft skins, and electronic enclosures are welded. The aerospace industry relies heavily on TIG welding for aluminum and titanium.',
    commonMistake: 'Suggesting MIG (GMAW) — which does work for aluminum but is harder to control on thin sheet and produces more spatter. TIG is preferred for thin, high-quality work.',
    tags: ['TIG', 'aluminum', 'welding', 'GTAW', 'thin-sheet', 'AC-welding'],
  },
];
