// Transform unit-7-materials.ts: split lessons, add variety, add conversation + speed-round
const fs = require('fs');

// Convert a JS object to TypeScript-style object literal string
function toTS(obj, indent = 8) {
  const pad = ' '.repeat(indent);
  const pad2 = ' '.repeat(indent + 2);
  let lines = ['{'];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const valStr = formatValue(value, indent + 2);
    lines.push(`${pad2}${key}: ${valStr},`);
  }
  lines.push(`${pad}}`);
  return lines.join('\n');
}

function formatValue(value, indent) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Use single quotes, escape internal single quotes
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Check if all elements are simple (strings/numbers)
    const allSimple = value.every(v => typeof v === 'string' || typeof v === 'number');
    if (allSimple) {
      const items = value.map(v => formatValue(v, indent));
      const oneLine = `[${items.join(', ')}]`;
      if (oneLine.length < 100) return oneLine;
    }
    const pad = ' '.repeat(indent);
    const pad2 = ' '.repeat(indent + 2);
    const items = value.map(v => `${pad2}${formatValue(v, indent + 2)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    return toTS(value, indent);
  }
  return String(value);
}

const src = fs.readFileSync('src/data/course/units/unit-7-materials.ts', 'utf8');

// ---- Parse existing lessons ----
// Find each lesson block
function extractLessons(source) {
  const lessons = [];
  // Find lesson-level objects by matching  id: 'u7-L<digit>',
  const lessonRegex = /\{\s*\n\s*id: 'u7-L(\d)',/g;
  const starts = [];
  let m;
  while ((m = lessonRegex.exec(source)) !== null) {
    starts.push({ num: parseInt(m[1]), charIndex: m.index });
  }

  for (let i = 0; i < starts.length; i++) {
    const startIdx = starts[i].charIndex;
    const endIdx = i < starts.length - 1 ? starts[i + 1].charIndex : source.lastIndexOf('}');
    const block = source.substring(startIdx, endIdx);

    // Extract lesson metadata
    const titleMatch = block.match(/title: '([^']+)'/);
    const descMatch = block.match(/description: '([^']+)'/);
    const iconMatch = block.match(/icon: '([^']+)'/);
    const xpMatch = block.match(/xpReward: (\d+)/);

    // Extract questions array
    const questions = extractQuestions(block, starts[i].num);

    lessons.push({
      num: starts[i].num,
      title: titleMatch ? titleMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      icon: iconMatch ? iconMatch[1] : '',
      xpReward: xpMatch ? parseInt(xpMatch[1]) : 20,
      questions: questions,
      rawBlock: block,
    });
  }
  return lessons;
}

function findMatchingBrace(str, startIdx) {
  // startIdx points to the opening {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  for (let i = startIdx; i < str.length; i++) {
    const c = str[i];
    if (inString) {
      if (c === '\\') { i++; continue; }
      if (c === stringChar) inString = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inString = true;
      stringChar = c;
      continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return str.length - 1;
}

function extractQuestions(lessonBlock, lessonNum) {
  // Find each question object by matching id: 'u7-L<num>-<type>'
  const qRegex = new RegExp(`\\{\\s*\\n\\s*id: 'u7-L${lessonNum}-(T\\d|Q\\d+)'`, 'g');
  const qStarts = [];
  let m;
  while ((m = qRegex.exec(lessonBlock)) !== null) {
    qStarts.push({ id: m[1], charIndex: m.index });
  }

  const questions = [];
  for (let i = 0; i < qStarts.length; i++) {
    const startIdx = qStarts[i].charIndex;
    // Find the matching closing brace for this question object
    const endBrace = findMatchingBrace(lessonBlock, startIdx);
    let block = lessonBlock.substring(startIdx, endBrace + 1);

    questions.push({
      id: `u7-L${lessonNum}-${qStarts[i].id}`,
      idSuffix: qStarts[i].id,
      raw: block,
    });
  }
  return questions;
}

const lessons = extractLessons(src);
console.log(`Parsed ${lessons.length} lessons`);
for (const l of lessons) {
  console.log(`  L${l.num}: "${l.title}" - ${l.questions.length} items`);
}

// ---- Build new file ----

// Sub-lesson titles for each lesson
const subLessonTitles = {
  1: [
    ['Tensile Test Basics', 'Stress-strain curves, yield strength, UTS, ductility measures.'],
    ['Hardness, Creep, and Fatigue', 'Hardness tests, creep at high temperature, fatigue S-N curves.'],
    ['Fracture and Toughness', 'Fracture toughness K_IC, impact testing, material selection.'],
  ],
  2: [
    ['Iron-Carbon Diagram', 'Phases, eutectoid reaction, carbon solubility limits.'],
    ['Heat Treatment Processes', 'Quenching, tempering, annealing, normalizing, hardenability.'],
    ['Advanced Heat Treatment', 'Case hardening, CCT vs TTT, precipitation hardening.'],
  ],
  3: [
    ['Casting Processes', 'Sand, investment, and die casting, defects, shrinkage.'],
    ['Forming Processes', 'Forging, rolling, extrusion, drawing, formability.'],
    ['Casting and Forming Defects', 'Porosity, hot tears, grain flow, DFM for cast/formed parts.'],
  ],
  4: [
    ['Turning, Milling, and Drilling', 'Basic machining operations, cutting parameters.'],
    ['Tool Wear and Surface Finish', 'Tool life, crater/flank wear, surface roughness.'],
    ['CNC and Process Planning', 'G-code basics, speeds and feeds, process selection.'],
  ],
  5: [
    ['Additive Manufacturing', '3D printing processes: FDM, SLA, SLS, DMLS.'],
    ['Injection Molding and Sheet Metal', 'Mold design, gate placement, bending, DFM.'],
    ['Design for Manufacturing', 'Tolerances, process selection, cost considerations.'],
  ],
  6: [
    ['Welding Processes', 'MIG, TIG, stick, laser welding fundamentals.'],
    ['HAZ and Weld Defects', 'Heat-affected zone metallurgy, porosity, cracking.'],
    ['Joint Design and Inspection', 'Fillet sizing, weld symbols, NDE methods.'],
  ],
};

// New teaching cards for each sub-lesson (need 1-2 per sub-lesson to reach 2 total)
// Original has T1 in first third, T2 in second third, T3 in last third
// Each third already has 1 teaching card, so we need 1 more per sub-lesson

function makeNewTeachingCards(lessonNum, subIdx) {
  const cards = {
    1: [
      // L1a: already has T1. Add one more.
      [{
        id: `u7-L1-T1b`,
        type: 'teaching',
        question: 'Engineering vs True Stress',
        explanation: `Engineering stress uses the original cross-section area. True stress uses the actual (instantaneous) area, which shrinks during necking. That's why engineering stress appears to drop after UTS, even though the material keeps getting stronger.`,
        hint: 'Try this now: sketch a stress-strain curve and mark where engineering and true stress diverge.',
      }],
      // L1b: already has T2. Add one more.
      [{
        id: `u7-L1b-T1`,
        type: 'teaching',
        question: 'Surface Finish and Fatigue Life',
        explanation: `Rough surfaces act like tiny stress concentrators that nucleate fatigue cracks. Shot peening introduces compressive residual stress, which fights back by closing surface cracks before they grow.`,
        hint: 'A polished lab specimen always has a higher endurance limit than a real machined part.',
      }],
      // L1c: already has T3. Add one more.
      [{
        id: `u7-L1c-T1`,
        type: 'teaching',
        question: 'Choosing Materials by Temperature',
        explanation: `BCC metals (carbon steel) become brittle below their DBTT. FCC metals (stainless steel, aluminum) stay ductile even at cryogenic temperatures. For high-temperature service, creep rupture data governs the design, not room-temperature strength.`,
        hint: 'Try this now: think about which crystal structure you would pick for a liquid nitrogen tank.',
      }],
    ],
    2: [
      [{
        id: `u7-L2-T1b`,
        type: 'teaching',
        question: 'Steels vs Cast Irons',
        explanation: `Steels have less than 2.14% carbon. Cast irons have more. That boundary matters because above 2.14% C, a eutectic reaction forms at 1147 degrees C, lowering the melting point and making the alloy easy to cast.`,
        hint: 'Cast irons are cheap to cast but brittle in tension due to graphite flakes (gray) or nodules (ductile).',
      }],
      [{
        id: `u7-L2b-T1`,
        type: 'teaching',
        question: 'The Jominy End-Quench Test',
        explanation: `The Jominy test quenches one end of a standard bar and measures hardness along its length. A steep drop means poor hardenability (only the surface gets hard). A flat curve means great hardenability (even thick sections harden through).`,
        hint: 'Alloying elements like Cr, Mo, and Ni shift the TTT nose right, improving hardenability.',
      }],
      [{
        id: `u7-L2c-T1`,
        type: 'teaching',
        question: 'Precipitation Hardening',
        explanation: `Some alloys (like 17-4 PH stainless and aluminum 2024) can be strengthened by dissolving atoms at high temperature, then aging at a lower temperature to form tiny precipitates that block dislocations.`,
        hint: 'Try this now: compare solution-treated vs aged properties of an aluminum 6061 alloy.',
      }],
    ],
    3: [
      [{
        id: `u7-L3-T1b`,
        type: 'teaching',
        question: 'Casting Shrinkage',
        explanation: `Metals shrink when they solidify and again when they cool. Designers add shrinkage allowance to patterns (typically 1-2% for steel, less for aluminum). Risers feed liquid metal into the casting to compensate for solidification shrinkage.`,
        hint: 'The last region to solidify should be in the riser, not in the part.',
      }],
      [{
        id: `u7-L3b-T1`,
        type: 'teaching',
        question: 'Hot vs Cold Working',
        explanation: `Hot working (above the recrystallization temperature) allows large deformations without cracking, and the metal recrystallizes into fine grains. Cold working (below recrystallization) strain-hardens the metal, increasing strength but reducing ductility.`,
        hint: 'Cold-rolled steel is stronger than hot-rolled steel of the same grade.',
      }],
      [{
        id: `u7-L3c-T1`,
        type: 'teaching',
        question: 'Grain Flow in Forgings',
        explanation: `Forging aligns the grain structure along the part's shape, like wood grain in a baseball bat. This grain flow makes forgings stronger and more fatigue-resistant than castings or machined bar stock, especially in the direction of loading.`,
        hint: 'Try this now: think about why a forged crankshaft outlasts a cast one.',
      }],
    ],
    4: [
      [{
        id: `u7-L4-T1b`,
        type: 'teaching',
        question: 'Cutting Speed, Feed, and Depth',
        explanation: `Cutting speed (m/min) is how fast the tool edge moves across the workpiece. Feed (mm/rev) is how far the tool advances per revolution. Depth of cut (mm) is how deep the tool bites. Speed affects tool life most, depth of cut affects force most.`,
        hint: 'Doubling cutting speed roughly halves tool life (Taylor equation).',
      }],
      [{
        id: `u7-L4b-T1`,
        type: 'teaching',
        question: 'Tool Wear Mechanisms',
        explanation: `Flank wear is gradual abrasion on the clearance face. Crater wear is chemical erosion on the rake face from hot chips. Built-up edge (BUE) is work material welding to the tool tip at low speeds. Each mechanism has a different fix.`,
        hint: 'Increase speed to eliminate BUE. Use coated inserts to reduce crater wear.',
      }],
      [{
        id: `u7-L4c-T1`,
        type: 'teaching',
        question: 'CNC Coordinate Systems',
        explanation: `CNC machines use G-codes for motion (G00 rapid, G01 linear feed, G02/G03 arcs) and M-codes for machine functions (M03 spindle on, M05 spindle off, M08 coolant on). Programs define tool paths in X, Y, Z coordinates.`,
        hint: 'Try this now: trace what G01 X50 Y25 F200 would do on a milling machine.',
      }],
    ],
    5: [
      [{
        id: `u7-L5-T1b`,
        type: 'teaching',
        question: 'Design for Additive Manufacturing',
        explanation: `AM lets you create internal channels, lattice structures, and topology-optimized shapes that are impossible to machine. But parts need support structures for overhangs, and build orientation affects strength (weaker between layers).`,
        hint: 'Orient the part so critical loads are in-plane with the layers, not perpendicular.',
      }],
      [{
        id: `u7-L5b-T1`,
        type: 'teaching',
        question: 'Injection Molding Basics',
        explanation: `Injection molding melts plastic pellets and forces them into a steel mold cavity under high pressure. It produces consistent, high-volume parts with tight tolerances. Key design rules: uniform wall thickness, draft angles, and rounded corners.`,
        hint: 'Thick sections cause sink marks. Thin sections may not fill completely.',
      }],
      [{
        id: `u7-L5c-T1`,
        type: 'teaching',
        question: 'Process Selection Strategy',
        explanation: `Choose the manufacturing process based on material, volume, geometry, tolerance, and cost. Low volume favors machining or AM. High volume favors casting, forging, or injection molding. Tight tolerances favor machining or grinding.`,
        hint: 'Try this now: pick a process for 100,000 aluminum brackets with 0.1 mm tolerance.',
      }],
    ],
    6: [
      [{
        id: `u7-L6-T1b`,
        type: 'teaching',
        question: 'Shielding in Welding',
        explanation: `Molten metal reacts with oxygen and nitrogen in air, causing porosity and embrittlement. MIG uses a gas shield (argon or CO2). Stick electrodes have a flux coating that burns off and shields the weld pool. TIG uses a separate argon gas stream.`,
        hint: 'If you see porosity in a MIG weld, check the gas flow rate and look for drafts.',
      }],
      [{
        id: `u7-L6b-T1`,
        type: 'teaching',
        question: 'The Heat-Affected Zone',
        explanation: `The HAZ is the region next to the weld that gets hot enough to change microstructure but doesn't melt. In carbon steel, the HAZ can form hard, brittle martensite if the part cools too fast. Preheating slows cooling and prevents this.`,
        hint: 'Higher carbon equivalent (CE) means more preheat is needed.',
      }],
      [{
        id: `u7-L6c-T1`,
        type: 'teaching',
        question: 'Weld Inspection Methods',
        explanation: `Visual inspection catches surface defects. Dye penetrant testing (PT) finds surface cracks. Magnetic particle testing (MT) finds surface and near-surface cracks in ferromagnetic materials. Radiography (RT) and ultrasonic testing (UT) find internal defects.`,
        hint: 'Try this now: decide which NDE method you would use for a pressure vessel butt weld.',
      }],
    ],
  };
  return cards[lessonNum][subIdx];
}

// New question-type conversions
// For each sub-lesson we need to convert 2-3 MC questions to match-pairs/sort-buckets/order-steps

function makeNewTypeQuestions(lessonNum, subIdx) {
  const questions = {
    1: [
      // L1a sub-lesson: add match-pairs + order-steps
      [
        {
          id: 'u7-L1-MP1',
          type: 'match-pairs',
          question: 'Match each mechanical test to what it measures',
          options: ['Tensile test', 'Charpy test', 'Rockwell test', 'Creep test'],
          matchTargets: ['Stress-strain curve', 'Impact toughness', 'Indentation hardness', 'Time-dependent deformation'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Tensile tests produce stress-strain curves. Charpy tests measure impact energy. Rockwell measures hardness by indentation depth. Creep tests measure deformation under sustained load at high temperature.',
          hint: 'Think about what each test physically does to the specimen.',
        },
        {
          id: 'u7-L1-OS1',
          type: 'order-steps',
          question: 'Order the regions of a tensile stress-strain curve from start to finish',
          steps: ['Linear elastic region', 'Yielding begins', 'Strain hardening to UTS', 'Necking to fracture'],
          correctOrder: [0, 1, 2, 3],
          explanation: 'The curve starts with a linear elastic region (slope = E), then yielding, then strain hardening up to UTS, and finally necking and fracture.',
          hint: 'Start with the straight-line portion of the curve.',
        },
      ],
      // L1b sub-lesson
      [
        {
          id: 'u7-L1b-SB1',
          type: 'sort-buckets',
          question: 'Sort these into the correct failure mechanism category',
          options: ['Beach marks on fracture surface', 'Permanent bulging at 550 degrees C', 'Sudden snap at -40 degrees C', 'Crack growth under cyclic load', 'Slow elongation over 10 years', 'V-notch specimen shatters on impact'],
          buckets: ['Fatigue', 'Creep / Brittle fracture'],
          correctBuckets: [0, 1, 1, 0, 1, 1],
          explanation: 'Beach marks and crack growth under cyclic load are fatigue indicators. Permanent bulging at high temperature and slow elongation are creep. Sudden snap at low temperature and V-notch shattering are brittle fracture.',
          hint: 'Fatigue involves repeated loading cycles. Creep involves high temperature and time.',
        },
        {
          id: 'u7-L1b-MP1',
          type: 'match-pairs',
          question: 'Match each surface treatment to its primary benefit',
          options: ['Shot peening', 'Carburizing', 'Chrome plating', 'Nitriding'],
          matchTargets: ['Compressive residual stress', 'Hard carbon-rich case', 'Corrosion resistance', 'Hard nitrogen-rich surface'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Shot peening introduces compressive stress for fatigue resistance. Carburizing adds carbon for a hard case. Chrome plating resists corrosion. Nitriding diffuses nitrogen for surface hardness.',
          hint: 'Each treatment changes the surface in a different way.',
        },
      ],
      // L1c sub-lesson
      [
        {
          id: 'u7-L1c-SB1',
          type: 'sort-buckets',
          question: 'Sort these materials by crystal structure',
          options: ['Carbon steel', 'Aluminum', 'Ferritic stainless', 'Austenitic stainless', 'Copper', 'Chromium'],
          buckets: ['BCC', 'FCC'],
          correctBuckets: [0, 1, 0, 1, 1, 0],
          explanation: 'Carbon steel, ferritic stainless, and chromium are BCC. Aluminum, austenitic stainless, and copper are FCC. BCC metals show a ductile-to-brittle transition. FCC metals do not.',
          hint: 'Think about which metals stay ductile at low temperatures.',
        },
        {
          id: 'u7-L1c-OS1',
          type: 'order-steps',
          question: 'Order these materials by elastic modulus, highest to lowest',
          steps: ['Steel (~200 GPa)', 'Copper (~120 GPa)', 'Titanium (~110 GPa)', 'Aluminum (~70 GPa)'],
          correctOrder: [0, 1, 2, 3],
          explanation: 'Steel has the highest E at ~200 GPa, followed by copper ~120, titanium ~110, and aluminum ~70 GPa. Elastic modulus depends on atomic bonding, not heat treatment.',
          hint: 'Steel is the stiffest common engineering metal.',
        },
      ],
    ],
    2: [
      [
        {
          id: 'u7-L2-MP1',
          type: 'match-pairs',
          question: 'Match each phase to its description',
          options: ['Ferrite', 'Austenite', 'Cementite', 'Pearlite'],
          matchTargets: ['BCC iron, soft and ductile', 'FCC iron, high carbon solubility', 'Fe3C, hard and brittle', 'Lamellar ferrite + cementite'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Ferrite is BCC and soft. Austenite is FCC and dissolves more carbon. Cementite (Fe3C) is the hard carbide. Pearlite is the lamellar mix of ferrite and cementite.',
          hint: 'The eutectoid reaction produces pearlite from austenite.',
        },
        {
          id: 'u7-L2-OS1',
          type: 'order-steps',
          question: 'Order the cooling transformation products from softest to hardest',
          steps: ['Spheroidite', 'Coarse pearlite', 'Fine pearlite', 'Bainite', 'Martensite'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'Spheroidite is the softest (globular carbides). Coarse pearlite is next, then fine pearlite, then bainite, and martensite is the hardest.',
          hint: 'Faster cooling generally produces harder microstructures.',
        },
      ],
      [
        {
          id: 'u7-L2b-SB1',
          type: 'sort-buckets',
          question: 'Sort these heat treatments by their primary purpose',
          options: ['Quenching', 'Tempering', 'Annealing', 'Normalizing', 'Case carburizing', 'Spheroidizing'],
          buckets: ['Increase hardness', 'Increase ductility/toughness'],
          correctBuckets: [0, 1, 1, 1, 0, 1],
          explanation: 'Quenching and case carburizing increase hardness. Tempering, annealing, normalizing, and spheroidizing all improve ductility or toughness.',
          hint: 'Most heat treatments aim to soften steel, not harden it.',
        },
        {
          id: 'u7-L2b-MP1',
          type: 'match-pairs',
          question: 'Match the alloy element to its primary role in steel',
          options: ['Chromium', 'Molybdenum', 'Nickel', 'Vanadium'],
          matchTargets: ['Corrosion resistance', 'Hardenability, temper resistance', 'Toughness at low temperature', 'Grain refinement'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Cr gives corrosion resistance (stainless). Mo improves hardenability and temper resistance. Ni improves low-temp toughness. V refines grain size.',
          hint: 'Stainless steel needs at least 10.5% chromium.',
        },
      ],
      [
        {
          id: 'u7-L2c-SB1',
          type: 'sort-buckets',
          question: 'Sort these into equilibrium vs non-equilibrium phases',
          options: ['Ferrite', 'Martensite', 'Austenite', 'Bainite', 'Cementite', 'Retained austenite'],
          buckets: ['Equilibrium (on phase diagram)', 'Non-equilibrium'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: 'Ferrite, austenite, and cementite appear on the equilibrium Fe-C diagram. Martensite, bainite, and retained austenite are non-equilibrium phases that require specific cooling conditions.',
          hint: 'The phase diagram only shows what forms given infinite time.',
        },
        {
          id: 'u7-L2c-OS1',
          type: 'order-steps',
          question: 'Order the steps of a quench-and-temper heat treatment',
          steps: ['Austenitize above A3', 'Rapid quench in oil or water', 'Confirm martensite formed', 'Temper at moderate temperature', 'Air cool to room temperature'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'First austenitize, then quench to form martensite, verify hardness, then temper to restore toughness, and finally air cool.',
          hint: 'Tempering always comes after quenching.',
        },
      ],
    ],
    3: [
      [
        {
          id: 'u7-L3-MP1',
          type: 'match-pairs',
          question: 'Match each casting process to its best use case',
          options: ['Sand casting', 'Die casting', 'Investment casting', 'Centrifugal casting'],
          matchTargets: ['Large, low-volume parts', 'High-volume aluminum parts', 'Complex aerospace parts', 'Pipes and tubes'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Sand casting handles large parts cheaply. Die casting is fast for high-volume production. Investment casting gives precision for complex shapes. Centrifugal casting makes hollow cylindrical parts.',
          hint: 'Think about volume, complexity, and part shape.',
        },
        {
          id: 'u7-L3-OS1',
          type: 'order-steps',
          question: 'Order the sand casting process steps',
          steps: ['Make pattern and core', 'Pack sand around pattern', 'Remove pattern, close mold', 'Pour molten metal', 'Cool, shake out, and clean'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'Sand casting starts with pattern making, then molding, then closing, pouring, and finally shakeout and cleaning.',
          hint: 'The pattern creates the cavity shape.',
        },
      ],
      [
        {
          id: 'u7-L3b-SB1',
          type: 'sort-buckets',
          question: 'Sort these into hot working vs cold working processes',
          options: ['Hot rolling', 'Cold drawing', 'Forging at 1100 degrees C', 'Stamping sheet metal at room temp', 'Hot extrusion', 'Cold heading of bolts'],
          buckets: ['Hot working', 'Cold working'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: 'Hot working happens above the recrystallization temperature (metal stays soft). Cold working happens below it (metal strain-hardens).',
          hint: 'Hot working allows large deformations without cracking.',
        },
        {
          id: 'u7-L3b-MP1',
          type: 'match-pairs',
          question: 'Match each forming defect to its cause',
          options: ['Orange peel', 'Springback', 'Wrinkling', 'Barreling'],
          matchTargets: ['Coarse grain structure', 'Elastic recovery after bending', 'Insufficient blank holder force', 'Friction in compression'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Orange peel comes from coarse grains. Springback is elastic recovery. Wrinkling happens when the blank holder is too loose. Barreling results from friction during compression.',
          hint: 'Each defect has a distinct physical mechanism.',
        },
      ],
      [
        {
          id: 'u7-L3c-SB1',
          type: 'sort-buckets',
          question: 'Sort these casting defects by root cause',
          options: ['Shrinkage cavity', 'Hot tear', 'Misrun', 'Cold shut', 'Porosity from dissolved gas', 'Metal penetration'],
          buckets: ['Solidification/shrinkage', 'Filling/pouring'],
          correctBuckets: [0, 0, 1, 1, 0, 1],
          explanation: 'Shrinkage cavities, hot tears, and gas porosity relate to solidification. Misruns, cold shuts, and metal penetration relate to how the metal fills the mold.',
          hint: 'Does the defect happen during filling or during solidification?',
        },
        {
          id: 'u7-L3c-OS1',
          type: 'order-steps',
          question: 'Order the investment casting (lost-wax) steps',
          steps: ['Inject wax pattern', 'Assemble wax tree', 'Dip in ceramic slurry', 'Burn out wax', 'Pour molten metal'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'Investment casting: make wax pattern, assemble tree, build ceramic shell, burn out wax, pour metal.',
          hint: 'The wax melts out to leave the mold cavity.',
        },
      ],
    ],
    4: [
      [
        {
          id: 'u7-L4-MP1',
          type: 'match-pairs',
          question: 'Match each machining operation to its setup',
          options: ['Turning', 'Milling', 'Drilling', 'Grinding'],
          matchTargets: ['Workpiece spins, single-point tool', 'Rotating multi-tooth cutter', 'Rotating two-flute bit', 'Abrasive wheel, fine finish'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'In turning the work rotates. In milling the cutter rotates. Drilling uses a two-flute rotating bit. Grinding uses an abrasive wheel for precision.',
          hint: 'Which part rotates: the tool or the workpiece?',
        },
        {
          id: 'u7-L4-SB1',
          type: 'sort-buckets',
          question: 'Sort these into conventional vs climb milling',
          options: ['Cutter opposes feed direction', 'Better surface finish', 'Chip starts thin, exits thick', 'Cutter moves with feed direction', 'Chip starts thick, exits thin', 'Preferred on CNC machines'],
          buckets: ['Conventional milling', 'Climb milling'],
          correctBuckets: [0, 1, 0, 1, 1, 1],
          explanation: 'Conventional milling: cutter opposes feed, chip goes thin-to-thick. Climb milling: cutter moves with feed, chip goes thick-to-thin, giving better finish.',
          hint: 'Climb milling is preferred when the machine has no backlash.',
        },
      ],
      [
        {
          id: 'u7-L4b-MP1',
          type: 'match-pairs',
          question: 'Match each wear type to where it occurs on the tool',
          options: ['Flank wear', 'Crater wear', 'Built-up edge', 'Notch wear'],
          matchTargets: ['Clearance face', 'Rake face', 'Tool tip', 'Depth-of-cut line'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Flank wear is on the clearance face. Crater wear forms on the rake face from hot chips. BUE welds to the tip. Notch wear occurs at the depth-of-cut boundary.',
          hint: 'Each wear type has a specific location on the cutting tool.',
        },
        {
          id: 'u7-L4b-OS1',
          type: 'order-steps',
          question: 'Order these surface finishes from roughest to smoothest',
          steps: ['Rough turning', 'Finish turning', 'Cylindrical grinding', 'Lapping/polishing'],
          correctOrder: [0, 1, 2, 3],
          explanation: 'Rough turning is coarsest, then finish turning, then grinding, and lapping/polishing gives the smoothest surface (mirror finish).',
          hint: 'Each process removes less material and leaves a finer surface.',
        },
      ],
      [
        {
          id: 'u7-L4c-SB1',
          type: 'sort-buckets',
          question: 'Sort these G-codes by function',
          options: ['G00', 'G01', 'G02', 'G28', 'G90', 'G41'],
          buckets: ['Motion commands', 'Machine setup commands'],
          correctBuckets: [0, 0, 0, 1, 1, 1],
          explanation: 'G00 (rapid), G01 (linear feed), and G02 (circular arc) are motion commands. G28 (home), G90 (absolute mode), and G41 (cutter compensation) are setup commands.',
          hint: 'Motion G-codes move the tool. Setup G-codes configure the machine.',
        },
        {
          id: 'u7-L4c-MP1',
          type: 'match-pairs',
          question: 'Match the machining parameter to its primary effect',
          options: ['Cutting speed', 'Feed rate', 'Depth of cut', 'Nose radius'],
          matchTargets: ['Tool life (Taylor equation)', 'Surface roughness', 'Cutting force', 'Surface finish quality'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Cutting speed most affects tool life. Feed rate most affects surface roughness. Depth of cut most affects cutting force. Larger nose radius improves surface finish.',
          hint: 'The Taylor equation relates cutting speed to tool life.',
        },
      ],
    ],
    5: [
      [
        {
          id: 'u7-L5-MP1',
          type: 'match-pairs',
          question: 'Match each AM process to its material form',
          options: ['FDM', 'SLA', 'SLS', 'DMLS'],
          matchTargets: ['Plastic filament', 'Liquid resin', 'Polymer powder', 'Metal powder'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'FDM extrudes plastic filament. SLA cures liquid resin with UV. SLS sinters polymer powder with a laser. DMLS fuses metal powder with a laser.',
          hint: 'Each AM process uses a different material form and energy source.',
        },
        {
          id: 'u7-L5-OS1',
          type: 'order-steps',
          question: 'Order the metal AM (DMLS) workflow',
          steps: ['Prepare CAD model and supports', 'Spread thin powder layer', 'Laser fuses powder selectively', 'Repeat layers until complete', 'Stress-relieve and remove from plate'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'Metal AM starts with CAD prep, then builds layer by layer (spread, fuse, repeat), and finishes with heat treatment and removal.',
          hint: 'Post-processing is critical for metal AM parts.',
        },
      ],
      [
        {
          id: 'u7-L5b-SB1',
          type: 'sort-buckets',
          question: 'Sort these design features by manufacturing friendliness',
          options: ['Uniform wall thickness', 'Sharp internal corners', 'Draft angles on walls', 'Undercuts', 'Generous fillets', 'Zero-draft vertical walls'],
          buckets: ['Good for injection molding', 'Bad for injection molding'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: 'Uniform walls, draft angles, and fillets are injection molding friendly. Sharp corners, undercuts, and zero-draft walls cause problems.',
          hint: 'The part needs to release cleanly from the mold.',
        },
        {
          id: 'u7-L5b-MP1',
          type: 'match-pairs',
          question: 'Match each sheet metal term to its meaning',
          options: ['K-factor', 'Bend allowance', 'Springback', 'Minimum bend radius'],
          matchTargets: ['Neutral axis position ratio', 'Arc length of the bend', 'Elastic recovery after forming', 'Smallest radius before cracking'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'K-factor locates the neutral axis. Bend allowance is the arc length consumed by the bend. Springback is elastic recovery. Minimum bend radius prevents cracking.',
          hint: 'These terms all relate to how sheet metal behaves during bending.',
        },
      ],
      [
        {
          id: 'u7-L5c-SB1',
          type: 'sort-buckets',
          question: 'Sort by best manufacturing process match',
          options: ['1 prototype bracket', '500,000 plastic housings', '50 titanium aerospace parts', '10,000 aluminum engine blocks', 'Custom lattice implant', 'Million steel fasteners'],
          buckets: ['Machining or AM', 'Casting or molding'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: 'Low volume, complex, or custom parts suit machining or AM. High volume production suits casting, molding, or forging.',
          hint: 'Volume is the biggest factor in process selection.',
        },
        {
          id: 'u7-L5c-OS1',
          type: 'order-steps',
          question: 'Order the injection molding cycle',
          steps: ['Close mold', 'Inject molten plastic', 'Pack and hold pressure', 'Cool part in mold', 'Open mold and eject'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'The cycle: close, inject, pack/hold, cool, eject. Cooling time is usually the longest step.',
          hint: 'Packing pressure compensates for shrinkage during cooling.',
        },
      ],
    ],
    6: [
      [
        {
          id: 'u7-L6-MP1',
          type: 'match-pairs',
          question: 'Match each welding process to its key feature',
          options: ['MIG (GMAW)', 'TIG (GTAW)', 'Stick (SMAW)', 'Laser welding'],
          matchTargets: ['Continuous wire feed, fast', 'Non-consumable tungsten, precise', 'Flux-coated rod, works outdoors', 'Narrow deep weld, automated'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'MIG feeds wire continuously for speed. TIG uses tungsten for precision. Stick uses flux coating for outdoor portability. Laser welding is narrow and automated.',
          hint: 'Each process trades off speed, quality, and convenience.',
        },
        {
          id: 'u7-L6-SB1',
          type: 'sort-buckets',
          question: 'Sort these into consumable vs non-consumable electrode processes',
          options: ['MIG (GMAW)', 'TIG (GTAW)', 'Stick (SMAW)', 'Flux-cored (FCAW)', 'Submerged arc (SAW)', 'Plasma arc (PAW)'],
          buckets: ['Consumable electrode', 'Non-consumable electrode'],
          correctBuckets: [0, 1, 0, 0, 0, 1],
          explanation: 'MIG, Stick, FCAW, and SAW all consume their electrode. TIG and PAW use a non-consumable tungsten electrode with separate filler.',
          hint: 'Does the electrode melt into the weld pool?',
        },
      ],
      [
        {
          id: 'u7-L6b-MP1',
          type: 'match-pairs',
          question: 'Match each weld defect to its cause',
          options: ['Porosity', 'Lack of fusion', 'Hydrogen cracking', 'Undercut'],
          matchTargets: ['Trapped gas bubbles', 'Insufficient heat input', 'Moisture + hard HAZ', 'Excessive current, edge melting'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Porosity comes from gas. Lack of fusion means the base metal did not melt. Hydrogen cracking needs moisture, stress, and a hard microstructure. Undercut is excessive melting of the base metal edge.',
          hint: 'Each defect has a specific root cause and fix.',
        },
        {
          id: 'u7-L6b-OS1',
          type: 'order-steps',
          question: 'Order the factors needed for hydrogen cracking (from most to least controllable)',
          steps: ['Moisture source (remove it)', 'Preheat to slow cooling', 'Use low-hydrogen electrodes', 'Post-weld heat treatment'],
          correctOrder: [0, 1, 2, 3],
          explanation: 'To prevent hydrogen cracking: control moisture first, then manage cooling rate with preheat, use low-H electrodes, and PWHT as a final measure.',
          hint: 'Hydrogen cracking needs hydrogen, stress, and a susceptible microstructure.',
        },
      ],
      [
        {
          id: 'u7-L6c-SB1',
          type: 'sort-buckets',
          question: 'Sort these NDE methods by defect detection capability',
          options: ['Visual inspection (VT)', 'Dye penetrant (PT)', 'Magnetic particle (MT)', 'Ultrasonic (UT)', 'Radiography (RT)', 'Eddy current (ET)'],
          buckets: ['Surface defects only', 'Internal defects too'],
          correctBuckets: [0, 0, 0, 1, 1, 0],
          explanation: 'VT, PT, MT, and ET detect surface or near-surface defects. UT and RT can find internal defects like voids, inclusions, and lack of fusion.',
          hint: 'Can the method see inside the material?',
        },
        {
          id: 'u7-L6c-MP1',
          type: 'match-pairs',
          question: 'Match each joint type to its typical application',
          options: ['Butt joint', 'Fillet (T-joint)', 'Lap joint', 'Corner joint'],
          matchTargets: ['Pipe or plate end-to-end', 'Stiffener to plate', 'Overlapping sheets', 'Box or frame corner'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Butt joints connect plates end-to-end. T-joints attach stiffeners. Lap joints overlap sheets. Corner joints form box structures.',
          hint: 'Think about how the pieces physically fit together.',
        },
      ],
    ],
  };
  return questions[lessonNum][subIdx];
}

// Easy question after teaching card (trivially easy, warm-up)
function makeEasyQuestion(lessonNum, subIdx) {
  const easy = {
    1: [
      { id: 'u7-L1-EZ1', type: 'true-false', question: 'A tensile test pulls a specimen apart until it breaks.', correctAnswer: true, explanation: 'Yes. A tensile test applies a pulling force that increases until the specimen fractures.', hint: 'Think about what "tensile" means.' },
      { id: 'u7-L1b-EZ1', type: 'true-false', question: 'Fatigue failure can happen even when the stress is below the yield strength.', correctAnswer: true, explanation: 'Correct. Fatigue cracks grow under repeated cyclic loading, even at stresses well below yield.', hint: 'Repeated loading is the key here.' },
      { id: 'u7-L1c-EZ1', type: 'true-false', question: 'Higher fracture toughness (K_IC) means a material is better at resisting crack growth.', correctAnswer: true, explanation: 'Yes. K_IC measures resistance to crack propagation. Higher is better.', hint: 'Toughness and crack resistance go together.' },
    ],
    2: [
      { id: 'u7-L2-EZ1', type: 'true-false', question: 'The iron-carbon phase diagram shows which phases exist at different temperatures and carbon contents.', correctAnswer: true, explanation: 'Exactly. The phase diagram is the roadmap for understanding steel microstructures.', hint: 'Phase diagrams map temperature vs composition.' },
      { id: 'u7-L2b-EZ1', type: 'true-false', question: 'Quenching makes steel harder by forming martensite.', correctAnswer: true, explanation: 'Right. Rapid cooling traps carbon in the lattice, forming the hard martensite phase.', hint: 'Fast cooling = hard.' },
      { id: 'u7-L2c-EZ1', type: 'true-false', question: 'Martensite appears on the equilibrium Fe-C phase diagram.', correctAnswer: false, explanation: 'No. Martensite is a non-equilibrium phase. It only forms with rapid cooling, not slow equilibrium cooling.', hint: 'The phase diagram shows equilibrium conditions only.' },
    ],
    3: [
      { id: 'u7-L3-EZ1', type: 'true-false', question: 'In casting, molten metal is poured into a mold shaped like the final part.', correctAnswer: true, explanation: 'Yes. Casting fills a mold cavity with liquid metal that solidifies into the desired shape.', hint: 'Casting is one of the oldest manufacturing processes.' },
      { id: 'u7-L3b-EZ1', type: 'true-false', question: 'Hot working happens above the recrystallization temperature.', correctAnswer: true, explanation: 'Correct. Above recrystallization temperature, the metal can be deformed extensively without strain hardening.', hint: 'The metal stays soft because new grains form continuously.' },
      { id: 'u7-L3c-EZ1', type: 'true-false', question: 'Forged parts generally have better fatigue life than cast parts of the same shape.', correctAnswer: true, explanation: 'Yes. Forging creates aligned grain flow and eliminates porosity, both of which improve fatigue resistance.', hint: 'Think about internal defects and grain structure.' },
    ],
    4: [
      { id: 'u7-L4-EZ1', type: 'true-false', question: 'In turning, the workpiece rotates while the cutting tool stays mostly stationary.', correctAnswer: true, explanation: 'Yes. The lathe spins the workpiece. The tool moves linearly to shape it.', hint: 'Turning happens on a lathe.' },
      { id: 'u7-L4b-EZ1', type: 'true-false', question: 'Tool wear increases as cutting speed increases.', correctAnswer: true, explanation: 'Correct. Higher speed means more heat at the tool tip, which accelerates wear.', hint: 'Speed and heat are directly related.' },
      { id: 'u7-L4c-EZ1', type: 'true-false', question: 'CNC machines follow programmed instructions to move the cutting tool.', correctAnswer: true, explanation: 'Yes. CNC (computer numerical control) reads G-code and M-code to automate tool motion.', hint: 'CNC replaced manual machine operation.' },
    ],
    5: [
      { id: 'u7-L5-EZ1', type: 'true-false', question: 'Additive manufacturing builds parts by adding material layer by layer.', correctAnswer: true, explanation: 'Yes. Unlike machining (subtractive), AM adds material where needed.', hint: 'The name says it: additive.' },
      { id: 'u7-L5b-EZ1', type: 'true-false', question: 'Injection molding is best suited for high-volume plastic part production.', correctAnswer: true, explanation: 'Correct. The high tooling cost is offset by very low per-part cost at high volumes.', hint: 'Molds are expensive but each shot is cheap.' },
      { id: 'u7-L5c-EZ1', type: 'true-false', question: 'Higher production volume usually means lower cost per part.', correctAnswer: true, explanation: 'Yes. Fixed costs (tooling, setup) spread across more parts, reducing unit cost.', hint: 'Economy of scale.' },
    ],
    6: [
      { id: 'u7-L6-EZ1', type: 'true-false', question: 'MIG welding uses a continuously fed wire electrode.', correctAnswer: true, explanation: 'Yes. MIG (GMAW) feeds a solid wire electrode through a gun, making it fast and easy to learn.', hint: 'MIG stands for metal inert gas.' },
      { id: 'u7-L6b-EZ1', type: 'true-false', question: 'The heat-affected zone (HAZ) is the region next to a weld that was heated but did not melt.', correctAnswer: true, explanation: 'Correct. The HAZ experiences microstructural changes from heat without reaching the melting point.', hint: 'The HAZ sits between the weld metal and unaffected base metal.' },
      { id: 'u7-L6c-EZ1', type: 'true-false', question: 'Ultrasonic testing can detect internal defects inside a weld.', correctAnswer: true, explanation: 'Yes. UT sends sound waves through the material and detects reflections from internal flaws.', hint: 'Sound waves can travel through solid metal.' },
    ],
  };
  return easy[lessonNum][subIdx];
}

// ---- Build the output ----

let output = `import type { Unit } from '../types';

export const unit7: Unit = {
  id: 'u7-materials',
  title: 'Materials & Manufacturing',
  description: 'Material properties, phase diagrams, heat treatment, casting, forming, machining, and modern manufacturing processes.',
  color: '#F97316',
  icon: '\u{1F3ED}',
  topicId: 'materials-engineering',
  lessons: [
`;

// Process each lesson: split into 3 sub-lessons
for (const lesson of lessons) {
  const n = lesson.num;
  const qs = lesson.questions;
  // Split: items 0-10 (sub a), 11-21 (sub b), 22-32 (sub c)
  const thirds = [
    qs.slice(0, 11),  // T1 + Q1-Q10
    qs.slice(11, 22), // Q11-Q20 (includes T2)
    qs.slice(22, 33), // Q21-Q30 (includes T3)
  ];

  const suffixes = ['', 'b', 'c'];

  for (let si = 0; si < 3; si++) {
    const suffix = suffixes[si];
    const lessonId = `u7-L${n}${suffix}`;
    const [subTitle, subDesc] = subLessonTitles[n][si];
    const xp = si === 0 ? lesson.xpReward : (si === 1 ? lesson.xpReward + 5 : lesson.xpReward + 10);

    output += `    {\n`;
    output += `      id: '${lessonId}',\n`;
    output += `      title: '${subTitle}',\n`;
    output += `      description: '${subDesc}',\n`;
    output += `      icon: '${lesson.icon}',\n`;
    output += `      xpReward: ${xp},\n`;
    output += `      levels: 4,\n`;
    output += `      questions: [\n`;

    const items = thirds[si];
    const newTeachingCards = makeNewTeachingCards(n, si);
    const newTypeQs = makeNewTypeQuestions(n, si);
    const easyQ = makeEasyQuestion(n, si);

    // Structure preserves ALL original question IDs:
    // T1 -> easy -> Q1-Q3 -> T2(new) -> Q4-Q6 -> newType1 -> newType2 -> Q7-Q10
    // Total: 2 teaching + 1 easy + 10 existing + 2 new-type = 15 items

    // Find existing teaching card in this third
    const teachingIdx = items.findIndex(q => q.idSuffix.startsWith('T'));

    // Get regular questions (non-teaching)
    const regularQs = items.filter((q, idx) => idx !== teachingIdx);

    // 1. Existing teaching card
    if (teachingIdx >= 0) {
      output += `        ${items[teachingIdx].raw},\n`;
    }

    // 2. Trivially easy question right after teaching card
    output += `        ${toTS(easyQ)},\n`;

    // 3. First batch of questions (easy, items 0-2)
    for (let qi = 0; qi < 3 && qi < regularQs.length; qi++) {
      output += `        ${regularQs[qi].raw},\n`;
    }

    // 4. New teaching card (second one)
    for (const tc of newTeachingCards) {
      output += `        ${toTS(tc)},\n`;
    }

    // 5. Middle questions (medium, items 3-5)
    for (let qi = 3; qi < 6 && qi < regularQs.length; qi++) {
      output += `        ${regularQs[qi].raw},\n`;
    }

    // 6. New question types (variety)
    for (const ntq of newTypeQs) {
      output += `        ${toTS(ntq)},\n`;
    }

    // 7. Remaining questions (harder, items 6+)
    for (let qi = 6; qi < regularQs.length; qi++) {
      output += `        ${regularQs[qi].raw},\n`;
    }

    output += `      ]\n`;
    output += `    },\n`;
  }
}

// ---- Conversation lesson ----
output += `    {
      id: 'u7-L-conv',
      title: 'Materials Selection Meeting',
      description: 'Help an engineer choose the right material for a critical component.',
      icon: '\u{1F4AC}',
      xpReward: 25,
      type: 'conversation',
      questions: [],
      conversationStartNodeId: 'u7-L-conv-C1',
      conversationNodes: [
        {
          id: 'u7-L-conv-C1',
          speaker: 'Lead Engineer',
          message: "We need to pick a material for a new pressure vessel. It'll operate at -50 degrees C with cyclic pressurization. What's your first concern?",
          options: [
            {
              text: "Low-temperature toughness. We need an FCC metal or one well above its DBTT.",
              nextNodeId: 'u7-L-conv-N1',
              quality: 'great',
              feedback: 'Exactly right. At -50 degrees C, BCC steels risk brittle fracture. FCC metals like austenitic stainless stay ductile.',
            },
            {
              text: "We should focus on getting the highest yield strength possible.",
              nextNodeId: 'u7-L-conv-N1',
              quality: 'okay',
              feedback: "Strength matters, but at -50 degrees C the bigger risk is brittle fracture. Toughness comes first.",
            },
            {
              text: "Let's just use whatever we used last time.",
              nextNodeId: 'u7-L-conv-N1',
              quality: 'poor',
              feedback: "The operating conditions are different. Temperature changes the failure mode. You need to evaluate the material for this specific application.",
            },
          ],
        },
        {
          id: 'u7-L-conv-N1',
          speaker: 'Lead Engineer',
          message: "Good thinking on temperature. Now, the cyclic loading means fatigue is a concern too. The design team proposed 4340 steel, quenched and tempered to 50 HRC. Thoughts?",
          nextNodeId: 'u7-L-conv-C2',
        },
        {
          id: 'u7-L-conv-C2',
          speaker: 'Lead Engineer',
          message: "So, 4340 at 50 HRC for a cyclic-pressure vessel at -50 degrees C. What do you think?",
          options: [
            {
              text: "That's too hard. High hardness means low K_IC. At -50 degrees C with fatigue cracks, we'll get brittle fracture. Temper it softer or switch to 304L stainless.",
              nextNodeId: 'u7-L-conv-N2',
              quality: 'great',
              feedback: "Spot on. 4340 at 50 HRC has poor fracture toughness. Combined with low temperature and cyclic loading, it's a recipe for catastrophic failure.",
            },
            {
              text: "4340 is a great alloy. 50 HRC should give excellent fatigue strength.",
              nextNodeId: 'u7-L-conv-N2',
              quality: 'okay',
              feedback: "4340 is indeed excellent, but at 50 HRC its fracture toughness is dangerously low for a pressure vessel at -50 degrees C. Hardness isn't everything.",
            },
            {
              text: "I don't know enough about 4340 to comment.",
              nextNodeId: 'u7-L-conv-N2',
              quality: 'poor',
              feedback: "In an interview, you should work through what you know: high HRC means low toughness, and low temperature makes BCC metals more brittle. Put those together.",
            },
          ],
        },
        {
          id: 'u7-L-conv-N2',
          speaker: 'Lead Engineer',
          message: "Right. We switched to 304L stainless. Now the fabrication team says they want to weld the vessel without preheat or PWHT. The wall is 25 mm thick. Any concerns?",
          nextNodeId: 'u7-L-conv-C3',
        },
        {
          id: 'u7-L-conv-C3',
          speaker: 'Lead Engineer',
          message: "Welding 25 mm thick 304L without preheat or post-weld heat treatment. Your call?",
          options: [
            {
              text: "304L is fine without preheat, it's austenitic with low carbon so no martensite in the HAZ. But we should check for sensitization and verify the ferrite number to avoid hot cracking.",
              nextNodeId: 'u7-L-conv-END',
              quality: 'great',
              feedback: "Perfect. Austenitic stainless doesn't need preheat because it doesn't form martensite. The L grade resists sensitization. Checking ferrite number prevents solidification cracking.",
            },
            {
              text: "25 mm thick plate always needs preheat, regardless of material.",
              nextNodeId: 'u7-L-conv-END',
              quality: 'okay',
              feedback: "Preheat is critical for carbon steel to avoid hydrogen cracking, but austenitic stainless is different. It doesn't form martensite, so preheat isn't needed. Material matters.",
            },
            {
              text: "I'd skip the preheat and PWHT to save time and money.",
              nextNodeId: 'u7-L-conv-END',
              quality: 'poor',
              feedback: "You got the right answer (no preheat needed) but for the wrong reason. The correct reasoning is that 304L doesn't form martensite, not that it saves money. Engineering decisions need engineering justification.",
            },
          ],
        },
        {
          id: 'u7-L-conv-END',
          speaker: 'Narrator',
          message: "You've worked through a real material selection problem: choosing the right alloy for temperature, loading, and weldability. In interviews, showing you can connect material science to practical decisions is what sets you apart.",
        },
      ],
    },\n`;

// ---- Speed round lesson ----
output += `    {
      id: 'u7-L-speed',
      title: 'Materials Rapid Fire',
      description: '15 quick questions on materials and manufacturing. 60 seconds.',
      icon: '\u{26A1}',
      xpReward: 20,
      type: 'speed-round',
      questions: [],
      speedTimeLimit: 60,
      speedQuestions: [
        { id: 'u7-L-speed-SQ1', question: 'What crystal structure is austenite?', options: ['BCC', 'FCC', 'HCP', 'BCT'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ2', question: 'Elastic modulus of steel?', options: ['70 GPa', '120 GPa', '200 GPa', '400 GPa'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ3', question: 'Eutectoid carbon content in steel?', options: ['0.02%', '0.4%', '0.8%', '2.14%'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ4', question: 'Hardest microstructure in steel?', options: ['Ferrite', 'Pearlite', 'Bainite', 'Martensite'], correctIndex: 3 },
        { id: 'u7-L-speed-SQ5', question: 'Which test measures impact toughness?', options: ['Tensile', 'Charpy', 'Rockwell', 'Creep'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ6', question: 'Beach marks indicate which failure?', options: ['Creep', 'Fatigue', 'Corrosion', 'Yielding'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ7', question: 'MIG welding electrode type?', options: ['Non-consumable', 'Consumable wire', 'Flux-coated', 'Tungsten'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ8', question: 'FDM uses which material form?', options: ['Powder', 'Resin', 'Filament', 'Sheet'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ9', question: 'In turning, what rotates?', options: ['Tool', 'Workpiece', 'Both', 'Neither'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ10', question: 'Quenching medium for highest cooling rate?', options: ['Air', 'Oil', 'Water', 'Furnace'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ11', question: 'Poisson ratio of steel?', options: ['0.1', '0.3', '0.5', '0.7'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ12', question: 'Which casting process uses wax patterns?', options: ['Sand', 'Die', 'Investment', 'Centrifugal'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ13', question: 'G01 in CNC means?', options: ['Rapid move', 'Linear feed', 'Arc CW', 'Home'], correctIndex: 1 },
        { id: 'u7-L-speed-SQ14', question: 'Steel vs cast iron boundary?', options: ['0.8% C', '1.0% C', '2.14% C', '4.3% C'], correctIndex: 2 },
        { id: 'u7-L-speed-SQ15', question: 'Purpose of tempering?', options: ['Increase hardness', 'Restore toughness', 'Add carbon', 'Remove stress'], correctIndex: 1 },
      ],
    },\n`;

output += `  ]\n};\n`;

fs.writeFileSync('src/data/course/units/unit-7-materials.ts', output, 'utf8');
console.log('\\nDone! New file written.');
console.log('File size:', (output.length / 1024).toFixed(1) + ' KB');
