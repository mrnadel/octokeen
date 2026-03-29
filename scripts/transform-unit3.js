/**
 * Transform Unit 3 (Strength of Materials) to Duolingo quality.
 *
 * Phase 1: Split each lesson (33 items) into 3 sub-lessons (~11 items)
 * Phase 2: Add question type variety (match-pairs, sort-buckets, order-steps)
 * Phase 3: Add conversation + speed-round lessons
 * Phase 4: Fix difficulty ramping
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'course', 'units', 'unit-3-strength.ts');
const backupPath = filePath + '.bak';
const original = fs.readFileSync(backupPath, 'utf-8');

// ──── PARSE: Extract the full unit object ────
// We'll parse line by line to extract each lesson and its questions
function parseUnit(src) {
  const lines = src.split('\n');
  const lessons = [];
  let currentLesson = null;
  let currentQuestion = null;
  let questionLines = [];
  let lessonHeaderLines = [];
  let braceDepth = 0;
  let inLessonsArray = false;
  let inQuestions = false;
  let headerLines = []; // lines before lessons array
  let footerLines = []; // lines after lessons array closes

  // State machine
  let state = 'header'; // header | lesson-header | questions | footer
  let lessonBraceDepth = 0;
  let questionBraceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (state === 'header') {
      headerLines.push(line);
      if (trimmed === 'lessons: [') {
        state = 'between-lessons';
      }
      continue;
    }

    if (state === 'between-lessons') {
      if (trimmed === '{') {
        state = 'lesson-header';
        currentLesson = { headerLines: [line], questions: [] };
        lessonBraceDepth = 1;
        continue;
      }
      if (trimmed === '],') {
        state = 'footer';
        footerLines.push(line);
        continue;
      }
      // blank lines between lessons
      continue;
    }

    if (state === 'lesson-header') {
      currentLesson.headerLines.push(line);
      for (const ch of trimmed) {
        if (ch === '{') lessonBraceDepth++;
        if (ch === '}') lessonBraceDepth--;
      }
      if (trimmed.includes('questions: [')) {
        state = 'between-questions';
      }
      continue;
    }

    if (state === 'between-questions') {
      if (trimmed === '{') {
        state = 'in-question';
        questionLines = [line];
        questionBraceDepth = 1;
        continue;
      }
      if (trimmed === '],') {
        // End of questions array
        state = 'lesson-closing';
        continue;
      }
      continue;
    }

    if (state === 'in-question') {
      questionLines.push(line);
      for (const ch of trimmed) {
        if (ch === '{') questionBraceDepth++;
        if (ch === '}') questionBraceDepth--;
      }
      if (questionBraceDepth === 0) {
        // Parse the question block to extract id and type
        const block = questionLines.join('\n');
        const idMatch = block.match(/id: '([^']+)'/);
        const typeMatch = block.match(/type: '([^']+)'/);
        currentLesson.questions.push({
          id: idMatch ? idMatch[1] : '',
          type: typeMatch ? typeMatch[1] : '',
          raw: questionLines.join('\n'),
        });
        state = 'between-questions';
        questionLines = [];
        questionBraceDepth = 0;
      }
      continue;
    }

    if (state === 'lesson-closing') {
      // Skip the closing },
      if (trimmed.startsWith('}')) {
        // Extract lesson metadata from header
        const hdr = currentLesson.headerLines.join('\n');
        const idMatch = hdr.match(/id: '([^']+)'/);
        const titleMatch = hdr.match(/title: '([^']+)'/);
        currentLesson.id = idMatch ? idMatch[1] : '';
        currentLesson.title = titleMatch ? titleMatch[1] : '';
        lessons.push(currentLesson);
        currentLesson = null;
        state = 'between-lessons';
      }
      continue;
    }

    if (state === 'footer') {
      footerLines.push(line);
      continue;
    }
  }

  return { headerLines, lessons, footerLines };
}

const parsed = parseUnit(original);
console.log(`Parsed ${parsed.lessons.length} lessons`);
parsed.lessons.forEach(l => console.log(`  ${l.id}: ${l.title} (${l.questions.length} items)`));

// ──── PHASE 1+2+4: Split each lesson into 3 sub-lessons with new teaching cards and question variety ────

function splitLesson(lesson, lessonNum) {
  const qs = lesson.questions;
  // Each lesson has 33 items (T1, Q1-Q10, T2, Q11-Q20, T3, Q21-Q30)
  // Split into thirds: items 0-10 (11), 11-21 (11), 22-32 (11)
  const third = Math.ceil(qs.length / 3);
  const sub1 = qs.slice(0, 11);
  const sub2 = qs.slice(11, 22);
  const sub3 = qs.slice(22);

  return { sub1, sub2, sub3 };
}

// Generate new teaching cards for each sub-lesson topic
const teachingCards = {
  'u3-L1': {
    b: [
      {
        id: 'u3-L1b-T1',
        type: 'teaching',
        question: 'Elastic vs Plastic Behavior',
        explanation: "Below the yield point, a material springs back to its original shape. Above it, permanent deformation remains even after unloading.",
        hint: 'Think of a rubber band vs bending a paperclip.',
      },
      {
        id: 'u3-L1b-T2',
        type: 'teaching',
        question: 'Thermal and Composite Bar Stress',
        explanation: "When a bar is heated but restrained, thermal stress = E * alpha * deltaT. In composite bars, equal strain means load splits by axial stiffness EA.",
        hint: 'Restrained expansion creates compressive stress.',
      },
    ],
    c: [
      {
        id: 'u3-L1c-T1',
        type: 'teaching',
        question: 'Stress Concentrations in Real Parts',
        explanation: "Holes, notches, and sharp corners cause local stress spikes. The factor Kt multiplies the nominal stress: sigma_max = Kt * sigma_nominal.",
        hint: 'A small hole can triple the local stress (Kt = 3).',
      },
      {
        id: 'u3-L1c-T2',
        type: 'teaching',
        question: 'Elastic Constants and Their Connections',
        explanation: "E, G, K, and nu are all related. For isotropic materials, G = E/(2(1+nu)) and K = E/(3(1-2nu)). Only 2 of the 4 are independent.",
        hint: 'If you know E and nu, you can find G and K.',
      },
    ],
  },
  'u3-L2': {
    b: [
      {
        id: 'u3-L2b-T1',
        type: 'teaching',
        question: 'I-Beams and Efficient Sections',
        explanation: "I-beams concentrate material in flanges far from the neutral axis, maximizing I with minimal weight. The section modulus S = I/c gives sigma_max = M/S directly.",
        hint: 'Doubling beam depth increases stiffness 8x.',
      },
      {
        id: 'u3-L2b-T2',
        type: 'teaching',
        question: 'Shear Stress in Beams',
        explanation: "Transverse shear stress tau = VQ/(Ib) varies parabolically across a rectangle, with max at the neutral axis. For rectangles, tau_max = 3V/(2A).",
        hint: 'Shear stress is zero at the top and bottom surfaces.',
      },
    ],
    c: [
      {
        id: 'u3-L2c-T1',
        type: 'teaching',
        question: 'Deflection Formulas You Need',
        explanation: "SS beam + center load: delta = PL^3/(48EI). SS beam + UDL: delta = 5wL^4/(384EI). Cantilever + tip load: delta = PL^3/(3EI). Deflection is very sensitive to span.",
        hint: 'Codes often limit deflection to L/360.',
      },
      {
        id: 'u3-L2c-T2',
        type: 'teaching',
        question: 'The Parallel Axis Theorem',
        explanation: "To find I about any axis: I = Ic + Ad^2, where d is the distance from the centroid to the new axis. The centroidal axis always gives the minimum I.",
        hint: 'This is essential for composite cross-sections.',
      },
    ],
  },
  'u3-L3': {
    b: [
      {
        id: 'u3-L3b-T1',
        type: 'teaching',
        question: 'Drawing SFD and BMD Step by Step',
        explanation: "Start by finding support reactions. Then move along the beam: V changes by the load, and M changes by V. Point loads make V jump; distributed loads make V slope.",
        hint: 'dV/dx = -w and dM/dx = V are the key relationships.',
      },
      {
        id: 'u3-L3b-T2',
        type: 'teaching',
        question: 'Distributed vs Point Loads',
        explanation: "Under a UDL, shear varies linearly and moment is parabolic. Under a point load, shear jumps instantly and moment has a kink.",
        hint: 'The shape of the SFD tells you the shape of the BMD.',
      },
    ],
    c: [
      {
        id: 'u3-L3c-T1',
        type: 'teaching',
        question: 'Statically Indeterminate Beams',
        explanation: "When a beam has more supports than needed for equilibrium, it's statically indeterminate. You need compatibility equations (deflection conditions) in addition to equilibrium.",
        hint: 'Fixed-fixed beams are 3 degrees indeterminate.',
      },
      {
        id: 'u3-L3c-T2',
        type: 'teaching',
        question: 'Inflection Points and Contraflexure',
        explanation: "Where the bending moment changes sign, the beam curvature reverses. This point of zero moment is called the inflection point or point of contraflexure.",
        hint: 'The beam switches from sagging to hogging at this point.',
      },
    ],
  },
  'u3-L4': {
    b: [
      {
        id: 'u3-L4b-T1',
        type: 'teaching',
        question: 'Power Transmission in Shafts',
        explanation: "Power P = T * omega, where omega is in rad/s. Reducing RPM via gearing increases torque proportionally. Always convert RPM to rad/s first: omega = 2*pi*n/60.",
        hint: 'Halving RPM doubles the required torque.',
      },
      {
        id: 'u3-L4b-T2',
        type: 'teaching',
        question: 'Solid vs Hollow Shafts',
        explanation: "A hollow shaft has nearly the same torsional strength as a solid one because the center contributes little. J_hollow = pi(D^4 - d^4)/32.",
        hint: 'Removing the inner 50% of diameter removes only ~6% of J.',
      },
    ],
    c: [
      {
        id: 'u3-L4c-T1',
        type: 'teaching',
        question: 'Angle of Twist',
        explanation: "The angle of twist phi = TL/(GJ). Longer shafts twist more. Stiffer shafts (higher G or J) twist less. This formula assumes uniform torque and cross-section.",
        hint: 'For stepped shafts, add the twist of each segment.',
      },
      {
        id: 'u3-L4c-T2',
        type: 'teaching',
        question: 'Non-Circular Sections in Torsion',
        explanation: "The torsion formula tau = Tr/J only works for circular sections. Non-circular sections warp and have unequal shear stress distributions.",
        hint: 'Rectangular sections have max shear at the midpoint of the longer side.',
      },
    ],
  },
  'u3-L5': {
    b: [
      {
        id: 'u3-L5b-T1',
        type: 'teaching',
        question: 'Building and Reading Mohr\'s Circle',
        explanation: "Plot (sigma_x, tau_xy) and (sigma_y, -tau_xy), then draw the circle. The circle's leftmost and rightmost points give the principal stresses.",
        hint: 'The radius of the circle equals the max shear stress.',
      },
      {
        id: 'u3-L5b-T2',
        type: 'teaching',
        question: 'Stress on Inclined Planes',
        explanation: "Rotating the coordinate system changes the stress components but not the physical state. The principal stresses are the max and min normal stresses at any orientation.",
        hint: 'Shear stress is zero on principal planes.',
      },
    ],
    c: [
      {
        id: 'u3-L5c-T1',
        type: 'teaching',
        question: 'Combined Loading on Shafts',
        explanation: "Most shafts see bending + torsion simultaneously. The critical point has sigma = Mc/I (bending) and tau = Tc/J (torsion). Use Mohr\'s circle to find principal stresses.",
        hint: 'The critical point is usually the top or bottom of the shaft at the support.',
      },
      {
        id: 'u3-L5c-T2',
        type: 'teaching',
        question: 'Plane Stress vs Plane Strain',
        explanation: "Plane stress (thin plates): sigma_z = 0. Plane strain (thick bodies): epsilon_z = 0, but sigma_z is not zero. Most textbook problems are plane stress.",
        hint: 'A thin plate under in-plane loads is plane stress.',
      },
    ],
  },
  'u3-L6': {
    b: [
      {
        id: 'u3-L6b-T1',
        type: 'teaching',
        question: 'Factor of Safety in Practice',
        explanation: "FoS = material strength / applied stress. Higher FoS means a more conservative design. Typical values: 1.5-3 for static loads, 3-5 for fatigue, 5-10 for unknown loads.",
        hint: 'An FoS of 1.0 means zero margin: any uncertainty causes failure.',
      },
      {
        id: 'u3-L6b-T2',
        type: 'teaching',
        question: 'Brittle vs Ductile Failure Criteria',
        explanation: "Ductile materials (steel): use Von Mises or Tresca. Brittle materials (cast iron): use max normal stress or Coulomb-Mohr. Using the wrong theory gives wrong predictions.",
        hint: 'Ductile materials fail by yielding; brittle by fracture.',
      },
    ],
    c: [
      {
        id: 'u3-L6c-T1',
        type: 'teaching',
        question: 'Fatigue: Death by a Million Cycles',
        explanation: "Fatigue failure happens below the yield stress through repeated loading. The S-N curve shows that steels have an endurance limit, but aluminum does not.",
        hint: 'About 90% of all mechanical failures are fatigue failures.',
      },
      {
        id: 'u3-L6c-T2',
        type: 'teaching',
        question: 'Stress-Life vs Strain-Life Methods',
        explanation: "High-cycle fatigue (> 10^3 cycles) uses stress-life (S-N curves). Low-cycle fatigue uses strain-life methods because plastic strain dominates.",
        hint: 'Mean stress corrections (Goodman, Soderberg) account for non-zero mean stress.',
      },
    ],
  },
  'u3-L7': {
    b: [
      {
        id: 'u3-L7b-T1',
        type: 'teaching',
        question: 'Effective Length and End Conditions',
        explanation: "Euler buckling load Pcr = pi^2*EI/(Le)^2. The effective length Le depends on end conditions: fixed-fixed (0.5L), fixed-pinned (0.7L), pinned-pinned (L), fixed-free (2L).",
        hint: 'Fixed-fixed is 4x stronger than pinned-pinned.',
      },
      {
        id: 'u3-L7b-T2',
        type: 'teaching',
        question: 'Thin-Walled Pressure Vessels',
        explanation: "For cylinders: hoop stress sigma_h = pD/(2t) and axial stress sigma_a = pD/(4t). Hoop stress is always 2x axial stress, so longitudinal seams are the weakest.",
        hint: 'That is why sausages split lengthwise, not crosswise.',
      },
    ],
    c: [
      {
        id: 'u3-L7c-T1',
        type: 'teaching',
        question: 'Column Design Beyond Euler',
        explanation: "Euler's formula works only for long, slender columns. Short columns fail by crushing, not buckling. Johnson's formula bridges the gap for intermediate columns.",
        hint: 'The slenderness ratio Leff/r determines which formula to use.',
      },
      {
        id: 'u3-L7c-T2',
        type: 'teaching',
        question: 'Thick-Walled Vessels: Lame Equations',
        explanation: "When t/D > 0.05, thin-wall formulas are inaccurate. Lame equations account for stress variation through the wall: sigma_r and sigma_theta both vary with radius.",
        hint: 'Max stress always occurs at the inner wall.',
      },
    ],
  },
};

// New variety questions to insert into each sub-lesson
const varietyQuestions = {
  'u3-L1': {
    a: {
      matchPairs: `        {
          id: 'u3-L1-MP1',
          type: 'match-pairs',
          question: 'Match each property to its formula:',
          options: ['Stress', 'Strain', 'Young\\'s modulus', 'Poisson\\'s ratio'],
          matchTargets: ['F/A', 'deltaL/L', 'sigma/epsilon', '-epsilon_lat/epsilon_ax'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Stress = F/A, strain = deltaL/L, E = sigma/epsilon, and nu = -epsilon_lat/epsilon_ax. These 4 quantities describe elastic material behavior.",
        }`,
    },
    b: {
      sortBuckets: `        {
          id: 'u3-L1b-SB1',
          type: 'sort-buckets',
          question: 'Sort each property into the correct category:',
          options: ['Yield strength', 'Elastic modulus', 'UTS', 'Poisson\\'s ratio', 'Fracture strain', 'Resilience'],
          buckets: ['Material property (constant)', 'Depends on loading/deformation'],
          correctBuckets: [0, 0, 0, 0, 1, 1],
          explanation: "Yield strength, E, UTS, and nu are intrinsic material properties. Fracture strain depends on gage length, and resilience depends on yield strength and E together.",
        }`,
      orderSteps: `        {
          id: 'u3-L1b-OS1',
          type: 'order-steps',
          question: 'Put the stress-strain curve features in order from zero strain:',
          steps: ['Linear elastic region', 'Proportional limit', 'Yield point (0.2% offset)', 'Strain hardening to UTS', 'Necking and fracture'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "The curve starts linear, deviates at the proportional limit, yields, strain-hardens to UTS, then necks until fracture.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L1c-MP1',
          type: 'match-pairs',
          question: 'Match each elastic constant to its physical meaning:',
          options: ['E (Young\\'s modulus)', 'G (shear modulus)', 'K (bulk modulus)', 'nu (Poisson\\'s ratio)'],
          matchTargets: ['Resistance to axial stretch', 'Resistance to shape change', 'Resistance to volume change', 'Lateral vs axial strain ratio'],
          correctMatches: [0, 1, 2, 3],
          explanation: "E resists axial deformation, G resists shear, K resists volume change, and nu describes how much a material contracts laterally when stretched.",
        }`,
    },
  },
  'u3-L2': {
    a: {
      sortBuckets: `        {
          id: 'u3-L2-SB1',
          type: 'sort-buckets',
          question: 'Sort each factor by what it primarily affects:',
          options: ['Beam depth h', 'Material E', 'Applied load P', 'Beam width b', 'Span length L', 'Support conditions'],
          buckets: ['Strongly affects stiffness (I or EI)', 'Affects load/stress but not stiffness'],
          correctBuckets: [0, 0, 1, 0, 1, 1],
          explanation: "Depth (h^3 in I), width (linear in I), and E directly affect stiffness. Load, span, and supports affect the demand side, not the supply of stiffness.",
        }`,
    },
    b: {
      matchPairs: `        {
          id: 'u3-L2b-MP1',
          type: 'match-pairs',
          question: 'Match each cross-section to its I_x formula:',
          options: ['Solid rectangle (b x h)', 'Solid circle (diameter d)', 'Hollow circle (D, d)', 'I-beam (approximate)'],
          matchTargets: ['bh^3/12', 'pi*d^4/64', 'pi(D^4-d^4)/64', '2*b_f*t_f*(h/2)^2'],
          correctMatches: [0, 1, 2, 3],
          explanation: "These are the standard I formulas. The I-beam approximation ignores the web contribution, which is small because material near the NA contributes little.",
        }`,
      orderSteps: `        {
          id: 'u3-L2b-OS1',
          type: 'order-steps',
          question: 'Put the beam design steps in the correct order:',
          steps: ['Find support reactions', 'Draw shear and moment diagrams', 'Find maximum bending moment', 'Calculate required section modulus S = M/sigma_allow', 'Select a beam from steel tables'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "First find reactions, then SFD/BMD to get M_max, compute required S, and finally pick a standard section.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L2c-MP1',
          type: 'match-pairs',
          question: 'Match each beam case to its max deflection formula:',
          options: ['SS + center load P', 'SS + UDL w', 'Cantilever + tip load P', 'Cantilever + UDL w'],
          matchTargets: ['PL^3/(48EI)', '5wL^4/(384EI)', 'PL^3/(3EI)', 'wL^4/(8EI)'],
          correctMatches: [0, 1, 2, 3],
          explanation: "These 4 deflection formulas cover most practical cases. Cantilevers deflect much more than simply-supported beams for the same load.",
        }`,
    },
  },
  'u3-L3': {
    a: {
      matchPairs: `        {
          id: 'u3-L3-MP1',
          type: 'match-pairs',
          question: 'Match each loading to the SFD shape it produces:',
          options: ['No load (unloaded span)', 'Point load', 'Uniform distributed load (UDL)', 'Triangular distributed load'],
          matchTargets: ['Constant shear', 'Sudden jump in shear', 'Linear shear', 'Parabolic shear'],
          correctMatches: [0, 1, 2, 3],
          explanation: "dV/dx = -w. No load means constant V, UDL means linear V, and triangular load means parabolic V. Point loads cause discontinuous jumps.",
        }`,
    },
    b: {
      sortBuckets: `        {
          id: 'u3-L3b-SB1',
          type: 'sort-buckets',
          question: 'Sort each beam type by its determinacy:',
          options: ['Simply supported beam', 'Cantilever beam', 'Propped cantilever', 'Fixed-fixed beam', 'Overhanging beam', 'Continuous (3-span) beam'],
          buckets: ['Statically determinate', 'Statically indeterminate'],
          correctBuckets: [0, 0, 1, 1, 0, 1],
          explanation: "Simply supported, cantilever, and overhanging beams have just enough supports for equilibrium. Propped cantilever, fixed-fixed, and continuous beams have extra supports.",
        }`,
      orderSteps: `        {
          id: 'u3-L3b-OS1',
          type: 'order-steps',
          question: 'Put the steps for drawing SFD and BMD in order:',
          steps: ['Draw free body diagram and find reactions', 'Move left to right, tracking shear V', 'Note V jumps at point loads', 'Integrate V to get bending moment M', 'Identify M_max where V = 0'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "Always start with the FBD. Then build the SFD left to right, then integrate to get the BMD. M is maximum where V crosses zero.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L3c-MP1',
          type: 'match-pairs',
          question: 'Match each SFD/BMD relationship:',
          options: ['Slope of SFD', 'Area under SFD', 'Where SFD = 0', 'Slope of BMD'],
          matchTargets: ['-w (negative of distributed load)', 'Change in bending moment', 'Maximum or minimum moment', 'V (shear force)'],
          correctMatches: [0, 1, 2, 3],
          explanation: "dV/dx = -w and dM/dx = V. These differential relationships are the foundation for constructing SFD and BMD.",
        }`,
    },
  },
  'u3-L4': {
    a: {
      sortBuckets: `        {
          id: 'u3-L4-SB1',
          type: 'sort-buckets',
          question: 'Sort each quantity by whether it applies to bending or torsion:',
          options: ['sigma = My/I', 'tau = Tr/J', 'Section modulus S', 'Polar moment J', 'Neutral axis', 'Angle of twist phi'],
          buckets: ['Bending', 'Torsion'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: "Bending uses sigma, I, S, and the neutral axis concept. Torsion uses tau, J, and the angle of twist.",
        }`,
    },
    b: {
      matchPairs: `        {
          id: 'u3-L4b-MP1',
          type: 'match-pairs',
          question: 'Match each shaft parameter to its effect:',
          options: ['Increase diameter', 'Increase length', 'Use hollow shaft', 'Increase material G'],
          matchTargets: ['Reduces stress (tau) and twist (phi)', 'Increases twist but not stress', 'Saves weight with minimal strength loss', 'Reduces twist but not stress'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Diameter affects both stress and twist (J scales with d^4). Length only affects twist. G affects twist. Hollow shafts trade minimal J loss for major weight savings.",
        }`,
      orderSteps: `        {
          id: 'u3-L4b-OS1',
          type: 'order-steps',
          question: 'Put the shaft design steps in order:',
          steps: ['Determine required torque from power and RPM', 'Choose an allowable shear stress', 'Calculate required polar moment J = T*c/tau_allow', 'Select shaft diameter from J', 'Check angle of twist is within limits'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "Start from the torque requirement, then size the shaft for stress, and finally verify twist.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L4c-MP1',
          type: 'match-pairs',
          question: 'Match each cross-section to its polar moment J:',
          options: ['Solid circle (d)', 'Hollow circle (D, d)', 'Thin-walled tube (D, t)', 'Solid square (side a)'],
          matchTargets: ['pi*d^4/32', 'pi(D^4-d^4)/32', 'pi*D^3*t/4', '~0.141*a^4 (approximate)'],
          correctMatches: [0, 1, 2, 3],
          explanation: "J = pi*d^4/32 for solid circles and pi(D^4-d^4)/32 for hollow circles. Thin-walled tubes use J = pi*D^3*t/4. Non-circular sections have approximate formulas.",
        }`,
    },
  },
  'u3-L5': {
    a: {
      matchPairs: `        {
          id: 'u3-L5-MP1',
          type: 'match-pairs',
          question: 'Match each Mohr\\'s circle feature to its meaning:',
          options: ['Center of circle', 'Radius', 'Rightmost point', 'Topmost point'],
          matchTargets: ['Average normal stress', 'Maximum shear stress', 'Maximum principal stress', 'Max shear plane orientation'],
          correctMatches: [0, 1, 2, 3],
          explanation: "The center gives sigma_avg, the radius gives tau_max, the rightmost point gives sigma_1, and the topmost point shows the plane of max shear.",
        }`,
    },
    b: {
      sortBuckets: `        {
          id: 'u3-L5b-SB1',
          type: 'sort-buckets',
          question: 'Sort each statement about principal stresses:',
          options: ['Shear stress is zero', 'Normal stress is at its extreme', 'Planes are 90 degrees apart', 'Shear stress is maximum', 'Normal stress equals sigma_avg', 'Planes are 45 degrees from principal'],
          buckets: ['True on principal planes', 'True on max shear planes'],
          correctBuckets: [0, 0, 0, 1, 1, 1],
          explanation: "Principal planes have zero shear and extreme normal stress. Max shear planes are at 45 degrees to principal planes and have normal stress equal to the average.",
        }`,
      orderSteps: `        {
          id: 'u3-L5b-OS1',
          type: 'order-steps',
          question: 'Put the Mohr\\'s circle construction steps in order:',
          steps: ['Establish sign convention: tension positive, CW shear positive on Mohr\\'s', 'Plot point A = (sigma_x, tau_xy) and point B = (sigma_y, -tau_xy)', 'Find the center C = (sigma_avg, 0)', 'Draw the circle through A and B', 'Read principal stresses at the left and right extremes'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "These steps build the circle systematically. Once drawn, you can read all stress information directly from the geometry.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L5c-MP1',
          type: 'match-pairs',
          question: 'Match each failure pattern to the stress state that causes it:',
          options: ['45-degree fracture in torsion', 'Cup-and-cone tensile fracture', '90-degree fracture in torsion', 'Necking in tension'],
          matchTargets: ['Brittle: fails on max normal stress plane', 'Ductile: shear failure at 45 degrees', 'Ductile: fails on max shear plane', 'Ductile: localized plastic deformation'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Brittle materials fail on principal (45-degree in torsion) planes. Ductile materials fail on max shear (90-degree in torsion) planes.",
        }`,
    },
  },
  'u3-L6': {
    a: {
      sortBuckets: `        {
          id: 'u3-L6-SB1',
          type: 'sort-buckets',
          question: 'Sort each failure theory by material type:',
          options: ['Von Mises', 'Tresca', 'Max normal stress', 'Modified Mohr', 'Distortion energy', 'Coulomb-Mohr'],
          buckets: ['For ductile materials', 'For brittle materials'],
          correctBuckets: [0, 0, 1, 1, 0, 1],
          explanation: "Von Mises, Tresca, and distortion energy are for ductile materials. Max normal stress, Modified Mohr, and Coulomb-Mohr are for brittle materials.",
        }`,
    },
    b: {
      matchPairs: `        {
          id: 'u3-L6b-MP1',
          type: 'match-pairs',
          question: 'Match each failure theory to its criterion:',
          options: ['Von Mises', 'Tresca', 'Max normal stress', 'Goodman (fatigue)'],
          matchTargets: ['sigma_e = sqrt(sigma1^2 - sigma1*sigma2 + sigma2^2)', 'Max of |sigma1-sigma2|, |sigma2-sigma3|, |sigma1-sigma3|', 'Failure when sigma_1 reaches material UTS', 'sigma_a/Se + sigma_m/Sut = 1'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Each theory predicts failure differently. Von Mises is most accurate for ductile metals. Goodman is the standard fatigue criterion.",
        }`,
      orderSteps: `        {
          id: 'u3-L6b-OS1',
          type: 'order-steps',
          question: 'Put the fatigue analysis steps in order:',
          steps: ['Identify cyclic loading and find stress amplitude and mean stress', 'Determine the endurance limit Se from material data', 'Apply correction factors (surface, size, reliability)', 'Plot on Goodman or Soderberg diagram', 'Calculate fatigue safety factor'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "Fatigue analysis requires knowing the cyclic stress state, correcting the endurance limit for real conditions, then checking against a failure criterion.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L6c-MP1',
          type: 'match-pairs',
          question: 'Match each fatigue factor to what it corrects for:',
          options: ['Surface finish factor', 'Size factor', 'Reliability factor', 'Stress concentration factor'],
          matchTargets: ['Rougher surfaces lower endurance limit', 'Larger parts have lower endurance limit', 'Higher reliability needs lower allowable stress', 'Notches raise local stress above nominal'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Each factor reduces the textbook endurance limit to match real-world conditions. The corrected limit Se = ka*kb*kc*kd*ke*Se\\'.",
        }`,
    },
  },
  'u3-L7': {
    a: {
      matchPairs: `        {
          id: 'u3-L7-MP1',
          type: 'match-pairs',
          question: 'Match each column end condition to its effective length factor:',
          options: ['Fixed-fixed', 'Fixed-pinned', 'Pinned-pinned', 'Fixed-free (flagpole)'],
          matchTargets: ['K = 0.5', 'K = 0.7', 'K = 1.0', 'K = 2.0'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Fixed-fixed (K=0.5) is the strongest, fixed-free (K=2.0) is the weakest. The effective length Le = K*L determines buckling capacity.",
        }`,
    },
    b: {
      sortBuckets: `        {
          id: 'u3-L7b-SB1',
          type: 'sort-buckets',
          question: 'Sort each statement by whether it applies to columns or pressure vessels:',
          options: ['Euler\\'s formula', 'Hoop stress', 'Slenderness ratio', 'sigma_h = pD/(2t)', 'Effective length', 'Longitudinal seam is critical'],
          buckets: ['Column buckling', 'Pressure vessels'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: "Euler's formula, slenderness ratio, and effective length are column concepts. Hoop stress, sigma_h = pD/(2t), and longitudinal seam criticality are pressure vessel concepts.",
        }`,
      orderSteps: `        {
          id: 'u3-L7b-OS1',
          type: 'order-steps',
          question: 'Put the column design check steps in order:',
          steps: ['Determine end conditions and effective length Le', 'Calculate slenderness ratio Le/r', 'Compare to critical slenderness ratio', 'If slender: use Euler formula for Pcr', 'If intermediate: use Johnson formula'],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: "Always determine slenderness first. Long columns buckle (Euler), short columns crush, and intermediate columns use Johnson's formula.",
        }`,
    },
    c: {
      matchPairs: `        {
          id: 'u3-L7c-MP1',
          type: 'match-pairs',
          question: 'Match each pressure vessel formula:',
          options: ['Thin-wall hoop stress', 'Thin-wall axial stress', 'Sphere hoop stress', 'Lame (inner wall radial)'],
          matchTargets: ['pD/(2t)', 'pD/(4t)', 'pD/(4t)', '-p (compressive, equals internal pressure)'],
          correctMatches: [0, 1, 2, 3],
          explanation: "Cylinder hoop = pD/(2t), cylinder axial = sphere stress = pD/(4t). For thick walls, Lame shows radial stress at the inner wall equals -p.",
        }`,
    },
  },
};

// ──── BUILD OUTPUT ────
function buildSubLesson(lesson, suffix, questions, extraTeaching, extraVariety) {
  const lessonId = lesson.id;
  const newId = suffix === '' ? lessonId : `${lessonId}${suffix}`;
  let allItems = [];

  // Insert teaching cards at appropriate positions
  if (extraTeaching && extraTeaching.length > 0) {
    const firstItem = questions[0];
    const firstIsTeaching = firstItem && firstItem.type === 'teaching';

    if (!firstIsTeaching) {
      allItems.push(formatTeaching(extraTeaching[0]));
    }

    for (let i = 0; i < questions.length; i++) {
      allItems.push(questions[i].raw);
    }

    if (extraTeaching.length > 1 && !firstIsTeaching) {
      allItems.splice(5, 0, formatTeaching(extraTeaching[1]));
    } else if (extraTeaching.length > 1 && firstIsTeaching) {
      allItems.splice(6, 0, formatTeaching(extraTeaching[1]));
    }
  } else {
    allItems = questions.map(q => q.raw);
  }

  // Insert variety questions
  if (extraVariety) {
    if (extraVariety.matchPairs) {
      allItems.splice(Math.min(3, allItems.length), 0, extraVariety.matchPairs);
    }
    if (extraVariety.sortBuckets) {
      allItems.splice(Math.min(6, allItems.length), 0, extraVariety.sortBuckets);
    }
    if (extraVariety.orderSteps) {
      allItems.splice(Math.min(8, allItems.length), 0, extraVariety.orderSteps);
    }
  }

  // For sub-lesson 'a', reuse original header verbatim
  if (suffix === '') {
    // Reconstruct from original header lines, replacing questions array
    const hdrLines = lesson.headerLines.join('\n');
    return `${hdrLines}
${allItems.join(',\n')}
      ],
    }`;
  }

  // For 'b' and 'c', build fresh header with safe strings (no escaping needed)
  const hdr = lesson.headerLines.join('\n');
  const titleMatch = hdr.match(/title: '((?:[^'\\\\]|\\\\.)*)'/);
  const iconMatch = hdr.match(/icon: '([^']+)'/);
  const xpMatch = hdr.match(/xpReward: (\d+)/);
  const levelsMatch = hdr.match(/levels: (\d+)/);

  const baseTitle = titleMatch ? titleMatch[1] : 'Lesson';
  const icon = iconMatch ? iconMatch[1] : '📝';
  const xp = xpMatch ? parseInt(xpMatch[1]) : 20;
  const levels = levelsMatch ? parseInt(levelsMatch[1]) : 4;

  const subTitle = `${baseTitle} ${suffix === 'b' ? 'II' : 'III'}`;
  const subDesc = suffix === 'b'
    ? `${baseTitle}: intermediate concepts and calculations.`
    : `${baseTitle}: advanced applications and edge cases.`;

  return `    {
      id: '${newId}',
      title: '${subTitle}',
      description: '${subDesc}',
      icon: '${icon}',
      xpReward: ${xp},
      levels: ${levels},
      questions: [
${allItems.join(',\n')}
      ],
    }`;
}

function formatTeaching(t) {
  const hintLine = t.hint ? `\n          hint: '${t.hint.replace(/'/g, "\\'")}',` : '';
  return `        {
          id: '${t.id}',
          type: 'teaching',
          question: '${t.question.replace(/'/g, "\\'")}',
          explanation: '${t.explanation.replace(/'/g, "\\'")}',${hintLine}
        }`;
}

// Build all sub-lessons
const allSubLessons = [];

for (let li = 0; li < parsed.lessons.length; li++) {
  const lesson = parsed.lessons[li];
  const lessonNum = li + 1;
  const lessonId = lesson.id;
  const qs = lesson.questions;

  // Split into thirds
  const sub1 = qs.slice(0, 11);
  const sub2 = qs.slice(11, 22);
  const sub3 = qs.slice(22);

  const tc = teachingCards[lessonId];
  const vq = varietyQuestions[lessonId];

  // Sub-lesson a (first third, keeps original ID)
  allSubLessons.push(buildSubLesson(lesson, '', sub1, null, vq?.a));

  // Sub-lesson b
  allSubLessons.push(buildSubLesson(lesson, 'b', sub2, tc?.b, vq?.b));

  // Sub-lesson c
  allSubLessons.push(buildSubLesson(lesson, 'c', sub3, tc?.c, vq?.c));
}

// ──── PHASE 3: Conversation + Speed Round ────
const conversationLesson = `    {
      id: 'u3-L-conv',
      title: 'The Failing Bracket',
      description: 'Help an engineer diagnose and fix a bracket that keeps cracking in service.',
      icon: '💬',
      type: 'conversation',
      xpReward: 20,
      questions: [],
      conversationStartNodeId: 'u3-L-conv-C1',
      conversationNodes: [
        {
          id: 'u3-L-conv-C1',
          speaker: 'Alex',
          message: 'We have a steel bracket on our production line that keeps cracking after about 3 months. The static stress analysis shows it\\'s well below yield. What could be happening?',
          nextNodeId: 'u3-L-conv-C2',
        },
        {
          id: 'u3-L-conv-C2',
          speaker: 'Alex',
          message: 'What should we investigate first?',
          options: [
            {
              text: 'Check for cyclic loading. If the bracket sees repeated loads, fatigue failure can happen well below yield strength.',
              nextNodeId: 'u3-L-conv-C3',
              quality: 'great',
              feedback: 'Exactly right. Fatigue is the most common cause of failure below yield, especially with repeated loading.',
            },
            {
              text: 'Maybe increase the material thickness to add more safety margin.',
              nextNodeId: 'u3-L-conv-C3',
              quality: 'okay',
              feedback: 'Adding thickness helps, but without knowing the root cause, you might just delay the same failure.',
            },
            {
              text: 'The stress analysis must be wrong. Recalculate everything from scratch.',
              nextNodeId: 'u3-L-conv-C3',
              quality: 'poor',
              feedback: 'The analysis could be correct for static loads. The real issue is likely dynamic, which a static analysis would miss.',
            },
          ],
        },
        {
          id: 'u3-L-conv-C3',
          speaker: 'Alex',
          message: 'Good call. The bracket does vibrate during machine operation. We found the crack always starts at a sharp 90-degree corner. What\\'s causing that?',
          nextNodeId: 'u3-L-conv-C4',
        },
        {
          id: 'u3-L-conv-C4',
          speaker: 'Alex',
          message: 'Why does the crack start at that specific corner?',
          options: [
            {
              text: 'Sharp corners act as stress concentrators. The local stress at a sharp corner can be 3-5x higher than the nominal stress, creating a fatigue initiation site.',
              nextNodeId: 'u3-L-conv-C5',
              quality: 'great',
              feedback: 'Correct. Stress concentration factor Kt at sharp corners can be very high, making them prime fatigue crack initiation sites.',
            },
            {
              text: 'The corner might have a manufacturing defect from welding or bending.',
              nextNodeId: 'u3-L-conv-C5',
              quality: 'okay',
              feedback: 'Manufacturing defects can contribute, but even a perfectly made sharp corner is a stress riser.',
            },
            {
              text: 'The material is probably weaker at corners because of grain orientation.',
              nextNodeId: 'u3-L-conv-C5',
              quality: 'poor',
              feedback: 'Grain orientation has some effect, but the main issue is geometric stress concentration, not material variation.',
            },
          ],
        },
        {
          id: 'u3-L-conv-C5',
          speaker: 'Alex',
          message: 'Makes sense. So what\\'s the fix? We need this bracket to last at least 5 years.',
          nextNodeId: 'u3-L-conv-C6',
        },
        {
          id: 'u3-L-conv-C6',
          speaker: 'Alex',
          message: 'What design change would you recommend?',
          options: [
            {
              text: 'Add a generous fillet radius at the corner. Even a 5mm radius can reduce Kt from over 4 down to 1.5, dramatically improving fatigue life.',
              nextNodeId: 'u3-L-conv-C7',
              quality: 'great',
              feedback: 'Perfect. A fillet radius is the most effective and cheapest fix for stress concentration at corners.',
            },
            {
              text: 'Switch to a higher-strength steel. More strength means more fatigue resistance.',
              nextNodeId: 'u3-L-conv-C7',
              quality: 'okay',
              feedback: 'Higher strength helps, but high-strength steels are actually more sensitive to stress concentrations. The corner fillet is more important.',
            },
            {
              text: 'Add a gusset plate to reinforce the corner area.',
              nextNodeId: 'u3-L-conv-C7',
              quality: 'poor',
              feedback: 'A gusset adds material but creates new stress concentrations at its edges. Smoothing the geometry is more effective.',
            },
          ],
        },
        {
          id: 'u3-L-conv-C7',
          speaker: 'Alex',
          message: 'Great advice! We\\'ll add fillets to all the corners and run a fatigue analysis to verify the fix.',
        },
      ],
    }`;

const speedRoundLesson = `    {
      id: 'u3-L-speed',
      title: 'Strength of Materials Blitz',
      description: 'Race the clock on stress, strain, bending, torsion, and failure concepts.',
      icon: '⚡',
      type: 'speed-round',
      xpReward: 20,
      questions: [],
      speedTimeLimit: 60,
      speedQuestions: [
        {
          id: 'u3-L-speed-SQ1',
          question: 'Stress equals force divided by:',
          options: ['Area', 'Length', 'Volume', 'Mass'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ2',
          question: 'Strain is:',
          options: ['Dimensionless', 'In Pascals', 'In Newtons', 'In meters'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ3',
          question: 'Young\\'s modulus measures:',
          options: ['Stiffness', 'Strength', 'Hardness', 'Toughness'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ4',
          question: 'The neutral axis has zero:',
          options: ['Bending stress', 'Shear stress', 'Deflection', 'Strain energy'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ5',
          question: 'Hoop stress in a cylinder is _____ axial stress.',
          options: ['2x', '3x', 'Equal to', 'Half of'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ6',
          question: 'Euler buckling depends on:',
          options: ['EI and length', 'Yield strength', 'UTS', 'Hardness'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ7',
          question: 'Torsion formula: tau = Tr/___',
          options: ['J', 'I', 'S', 'A'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ8',
          question: 'Von Mises criterion is for:',
          options: ['Ductile metals', 'Brittle metals', 'Polymers', 'Ceramics'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ9',
          question: 'Mohr\\'s circle radius equals:',
          options: ['Max shear stress', 'Max normal stress', 'Average stress', 'Yield stress'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ10',
          question: 'Section modulus S = I divided by:',
          options: ['c (distance to extreme fiber)', 'A (area)', 'L (length)', 'E (modulus)'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ11',
          question: 'Poisson\\'s ratio for most metals is about:',
          options: ['0.3', '0.5', '0.1', '1.0'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ12',
          question: 'I-beams are efficient because material is:',
          options: ['Far from the NA', 'Near the NA', 'Uniformly distributed', 'At the web only'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ13',
          question: 'Where SFD crosses zero, the BMD has a:',
          options: ['Maximum or minimum', 'Zero crossing', 'Constant value', 'Discontinuity'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ14',
          question: 'Fatigue failures typically start at:',
          options: ['Stress concentrations', 'The center of the part', 'Compression zones', 'Supports'],
          correctIndex: 0,
        },
        {
          id: 'u3-L-speed-SQ15',
          question: 'Angle of twist phi = TL/(___)',
          options: ['GJ', 'EI', 'EA', 'GA'],
          correctIndex: 0,
        },
      ],
    }`;

// ──── ASSEMBLE FINAL FILE ────
const header = parsed.headerLines.join('\n');
const footer = parsed.footerLines.join('\n');

const lessonsBlock = [
  ...allSubLessons,
  conversationLesson,
  speedRoundLesson,
].join(',\n');

const output = `${header}
${lessonsBlock},
${footer}`;

fs.writeFileSync(filePath, output, 'utf-8');
console.log('\nTransformation complete!');
console.log(`Output written to ${filePath}`);
console.log(`Total sub-lessons: ${allSubLessons.length}`);
console.log(`Plus: 1 conversation, 1 speed-round`);
console.log(`Total lessons: ${allSubLessons.length + 2}`);
