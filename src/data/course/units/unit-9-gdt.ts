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
          question: 'A shaft is dimensioned as ∅25 h7 (25.000/24.979 mm) and a hole as ∅25 H7 (25.000/25.021 mm). What type of fit is this, and what is the maximum clearance?',
          options: [
            'Clearance fit, max clearance = 0.042 mm',
            'Interference fit, max interference = 0.021 mm',
            'Transition fit, could be clearance or interference',
            'Clearance fit, max clearance = 0.021 mm'
          ],
          correctIndex: 0,
          explanation: 'H7/h7 is a clearance fit (sliding fit). Maximum clearance = max hole − min shaft = 25.021 − 24.979 = 0.042 mm. Minimum clearance = min hole − max shaft = 25.000 − 25.000 = 0.000 mm (line-to-line contact). This is a commonly used fit for locating pins and sliding guides where no interference is desired. The \'h\' shaft has a fundamental deviation of zero (upper limit = nominal), and \'H\' hole also has zero fundamental deviation (lower limit = nominal).',
          hint: 'Calculate: max clearance = max hole − min shaft; min clearance = min hole − max shaft.'
        },
        {
          id: 'u9-L1-Q2',
          type: 'multiple-choice',
          question: 'Which ISO fit designation produces a light press fit suitable for locating a bearing outer ring in a housing?',
          options: [
            'H7/g6 (clearance)',
            'H7/k6 (transition)',
            'H7/p6 (interference)',
            'H7/f7 (loose running)'
          ],
          correctIndex: 2,
          explanation: 'H7/p6 provides a light to medium interference fit, ideal for bearing outer rings in housings. The \'p\' shaft deviation ensures interference even at the worst-case tolerance combination. H7/k6 is a transition fit (may or may not have interference — unreliable for bearing press fits). H7/g6 and H7/f7 are clearance fits used for running/sliding applications. Bearing manufacturers publish specific fit recommendations based on loading direction (rotating inner ring vs. rotating outer ring) and load magnitude.',
          hint: 'Bearing press fits need guaranteed interference. Which shaft letter gives a positive lower deviation?'
        },
        {
          id: 'u9-L1-Q3',
          type: 'true-false',
          question: 'An IT6 tolerance grade provides a tighter tolerance band than IT8 for the same nominal dimension.',
          correctAnswer: true,
          explanation: 'ISO tolerance grades (IT) range from IT01 (tightest) to IT18 (loosest). The tolerance value approximately doubles every 5 IT grades. For a 25 mm nominal diameter: IT6 = 0.013 mm, IT7 = 0.021 mm, IT8 = 0.033 mm. IT6 is typically achieved by grinding or precision turning, IT7 by standard turning/boring, and IT8 by milling. Specifying tighter tolerances than necessary increases manufacturing cost significantly.',
          hint: 'Higher IT numbers mean larger tolerance bands. Lower IT = tighter = more expensive.'
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
          explanation: 'Total tolerance = upper deviation − lower deviation = +0.05 − (−0.10) = 0.15 mm. This is bilateral tolerancing because the deviations are on both sides of the nominal (one positive, one negative), though they are asymmetric. Unilateral would be both deviations on the same side (e.g., +0.00/+0.15 or −0.15/−0.00). The allowable range is 49.90 to 50.05 mm. Bilateral symmetric (±0.075) is easiest for manufacturing because the target is the nominal dimension.',
          hint: 'Tolerance = upper limit − lower limit. Bilateral means deviations exist on both sides of nominal.'
        },
        {
          id: 'u9-L1-Q5',
          type: 'multiple-choice',
          question: 'When designing a clearance fit for a shaft rotating in a plain bearing at moderate speed, which ISO fit is most commonly recommended?',
          options: [
            'H7/h6 — close running fit',
            'H8/f7 — free running fit',
            'H7/g6 — sliding fit',
            'H11/c11 — loose running fit'
          ],
          correctIndex: 1,
          explanation: 'H8/f7 (free running fit) provides adequate clearance for a hydrodynamic oil film to develop in a plain bearing at moderate speeds. H7/h6 has too little clearance for a running bearing (suitable for location only). H7/g6 is a sliding fit with minimal clearance (suitable for slow-moving or oscillating fits). H11/c11 provides excessive clearance suitable only for rough assemblies. The specific fit depends on bearing L/D ratio, speed, load, and lubricant viscosity — bearing manufacturers provide detailed recommendations.',
          hint: 'A rotating shaft in a bearing needs enough clearance for an oil film to develop.'
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
          question: 'A hole is specified as ∅20.0 +0.1/0 with a positional tolerance of ∅0.2 at MMC. If the hole is produced at ∅20.08, what is the total positional tolerance available (including bonus)?',
          options: [
            '0.20 mm',
            '0.28 mm',
            '0.30 mm',
            '0.10 mm'
          ],
          correctIndex: 1,
          explanation: 'MMC of the hole = 20.0 mm (smallest hole = Maximum Material Condition for an internal feature). Actual size = 20.08 mm. Departure from MMC = 20.08 − 20.0 = 0.08 mm. Bonus tolerance = 0.08 mm. Total positional tolerance = stated tolerance + bonus = 0.20 + 0.08 = 0.28 mm. The MMC modifier allows more positional freedom when the feature is further from MMC, because there is more material available for assembly. This is the key advantage of using MMC in GD&T.',
          hint: 'Bonus tolerance = actual size departure from MMC. Total = stated + bonus.'
        },
        {
          id: 'u9-L2-Q2',
          type: 'multiple-choice',
          question: 'Which geometric tolerance controls the overall form of a cylindrical surface, limiting the variation to a zone between two coaxial cylinders?',
          options: [
            'Circularity (roundness)',
            'Straightness',
            'Cylindricity',
            'Concentricity'
          ],
          correctIndex: 2,
          explanation: 'Cylindricity controls the combined effect of circularity, straightness, and taper of a cylindrical surface. The tolerance zone is between two coaxial cylinders separated by the cylindricity tolerance value. Circularity only controls any single cross-section, straightness only controls line elements along the axis, and concentricity controls the relationship between two features. Cylindricity is the most comprehensive single-feature form control for cylinders and is harder to measure (requires multiple cross-sections along the length).',
          hint: 'This is the most comprehensive form control for a cylinder — it combines roundness and straightness.'
        },
        {
          id: 'u9-L2-Q3',
          type: 'true-false',
          question: 'A flatness tolerance of 0.05 mm means the entire surface must lie between two parallel planes 0.05 mm apart, regardless of the surface\'s orientation to any datum.',
          correctAnswer: true,
          explanation: 'Flatness is a form tolerance that does not reference any datum — the two parallel planes defining the tolerance zone float to best fit the actual surface (minimum zone evaluation). This means flatness only controls the surface\'s deviation from being perfectly flat, not its orientation or position relative to other features. If you need to control how flat a surface is AND its orientation relative to another feature, use parallelism or profile instead.',
          hint: 'Form tolerances (flatness, straightness, circularity, cylindricity) never reference datums.'
        },
        {
          id: 'u9-L2-Q4',
          type: 'multiple-choice',
          question: 'A perpendicularity tolerance of 0.1 mm is applied to a surface relative to datum A. What does this tolerance zone look like?',
          options: [
            'A single plane at exactly 90° to datum A',
            'Two parallel planes 0.1 mm apart, oriented at exactly 90° to datum A',
            'A cylindrical zone of diameter 0.1 mm around the ideal position',
            'A zone that varies depending on the feature size'
          ],
          correctIndex: 1,
          explanation: 'For a surface, the perpendicularity tolerance zone consists of two parallel planes 0.1 mm apart that are perfectly perpendicular to datum A. The entire toleranced surface must lie between these planes. Unlike flatness, the planes are locked in orientation relative to the datum. If perpendicularity were applied to a cylindrical feature (axis), the tolerance zone would be a cylinder of diameter 0.1 mm (with the ∅ symbol) oriented perpendicular to the datum plane.',
          hint: 'Orientation tolerances define zones fixed in orientation to a datum but free in location.'
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
          question: 'In a datum reference frame (DRF), how many degrees of freedom does the primary datum constrain?',
          options: [
            '1 degree of freedom',
            '2 degrees of freedom',
            '3 degrees of freedom',
            '6 degrees of freedom'
          ],
          correctIndex: 2,
          explanation: 'The primary datum (typically a planar surface) constrains 3 degrees of freedom: one translation (perpendicular to the surface) and two rotations (about axes in the surface plane). The secondary datum constrains 2 more DOF (one translation and one rotation), and the tertiary datum constrains the final 1 DOF (one translation). Together, the 3-2-1 datum system fully constrains all 6 degrees of freedom (3 translations + 3 rotations), establishing a unique coordinate frame for measurement.',
          hint: 'Think of the 3-2-1 rule: primary surface contacts 3 points of a datum simulator.'
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
          type: 'true-false',
          question: 'Datum targets are used when the entire surface is too large, irregular, or unreliable to use as a datum, and instead specific points, lines, or areas on the surface are designated as the datum contact.',
          correctAnswer: true,
          explanation: 'Datum targets specify discrete points, lines, or areas on a surface that establish the datum. They are essential for cast, forged, or sheet metal parts where the entire surface is rough, warped, or inconsistent. For example, three datum target points on a cast surface establish a primary datum plane. Datum targets are designated with a target symbol (divided circle showing the datum letter and target number, e.g., A1, A2, A3). They must be chosen to provide stable, repeatable location.',
          hint: 'Think about non-machined surfaces like castings — can you reliably rest the entire surface on a flat plate?'
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
          explanation: 'When a cylindrical bore is the secondary datum (after a planar primary datum A constrains 3 DOF), the bore constrains 2 additional DOF: the two translations perpendicular to the bore axis (X and Y if the bore axis is Z). The remaining unconstrained DOF is rotation about the bore axis, which requires a tertiary datum (e.g., a slot, hole, or flat). If the bore were the primary datum, it would constrain 4 DOF (2 translations + 2 rotations), leaving axial translation and axial rotation.',
          hint: 'The primary plane already constrains 3 DOF. What does a cylinder add to that?'
        },
        {
          id: 'u9-L3-Q5',
          type: 'multiple-choice',
          question: 'In practice, how should manufacturing fixturing relate to the datum reference frame specified on the engineering drawing?',
          options: [
            'Fixturing can use any convenient surfaces as long as dimensions are within tolerance',
            'The fixture locating surfaces should simulate the datum features and follow the datum precedence (primary, secondary, tertiary) specified on the drawing',
            'Fixturing datums are independent of drawing datums and selected for ease of machining only',
            'The datum reference frame only applies to final inspection, not manufacturing'
          ],
          correctIndex: 1,
          explanation: 'The manufacturing fixture should replicate the datum reference frame as closely as possible. The primary datum feature should be constrained first (3 points of contact), then the secondary (2 points), then the tertiary (1 point). If machining fixtures use different locating surfaces than the drawing datums, the resulting part geometry may meet tolerance when measured from the fixture datums but fail when inspected from the drawing datums. This is one of the most common sources of GD&T-related manufacturing problems.',
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
          explanation: 'Worst-case (arithmetic) stack-up simply adds all tolerances: total = ±(0.1 + 0.1 + 0.1 + 0.1 + 0.1) = ±0.50 mm. This guarantees 100% of assemblies will be within the resulting tolerance, but it is the most conservative method. In practice, it is unlikely that all 5 dimensions are simultaneously at their worst limit, which is why statistical methods (RSS) are often preferred for cost optimization.',
          hint: 'Worst-case = simple sum of all individual tolerances.'
        },
        {
          id: 'u9-L4-Q2',
          type: 'multiple-choice',
          question: 'Using the RSS (Root Sum Square) method on the same 5 dimensions (each ±0.1 mm), what is the statistical stack-up tolerance at approximately 99.73% confidence (3σ)?',
          options: [
            '±0.10 mm',
            '±0.22 mm',
            '±0.32 mm',
            '±0.50 mm'
          ],
          correctIndex: 1,
          explanation: 'RSS stack-up: T_total = √(Σt_i²) = √(5 × 0.1²) = √0.05 = 0.224 ≈ ±0.22 mm. This assumes each tolerance represents ±3σ of a normal distribution and the dimensions are independent. The RSS result (0.22 mm) is significantly less than worst-case (0.50 mm), allowing tighter assemblies or looser individual tolerances. The trade-off: ~0.27% of assemblies (2700 ppm) may exceed this tolerance. RSS becomes more advantageous as the number of contributors increases.',
          hint: 'RSS = square root of the sum of squares of individual tolerances.'
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
          question: 'A gap between two parts must be maintained between 0.5 mm and 1.5 mm. The gap is determined by 4 dimensions, each currently toleranced at ±0.2 mm. Using worst-case analysis, is the current tolerance allocation adequate?',
          options: [
            'Yes — worst-case stack is ±0.8 mm and the gap range of 1.0 mm can accommodate it',
            'No — worst-case stack is ±0.8 mm which exceeds the allowable gap variation of 1.0 mm',
            'Yes — worst-case stack is ±0.4 mm which is within the 1.0 mm gap range',
            'Cannot be determined without knowing nominal dimension values'
          ],
          correctIndex: 1,
          explanation: 'Worst-case tolerance stack = 4 × ±0.2 = ±0.8 mm, giving a total variation range of 1.6 mm. The allowable gap range is 1.5 − 0.5 = 1.0 mm. Since 1.6 > 1.0, the current tolerances are too loose — some assemblies will have gaps outside the 0.5–1.5 mm specification. Solutions: tighten individual tolerances to ±0.125 mm each (for worst-case), use RSS analysis (±0.4 mm ≈ 0.8 mm range, which fits), or redesign to reduce the number of stack contributors.',
          hint: 'Compare the total tolerance variation (2 × sum) against the allowable gap range (max − min gap).'
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
          explanation: 'The RSS (Root Sum Square) method assumes individual dimensions follow normal distributions and are statistically independent. It predicts the assembly variation at approximately 3σ confidence (99.73%). RSS gives a smaller total tolerance than worst-case, resulting in lower manufacturing cost. However, it accepts a small probability (~0.27%) that assemblies will be out of tolerance. For higher confidence, a safety factor (inflator) can be applied, or Monte Carlo simulation can be used for non-normal distributions.',
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
          question: 'A turned surface has a specified roughness of Ra 1.6 μm. What does Ra represent?',
          options: [
            'The maximum peak-to-valley height within the evaluation length',
            'The arithmetic mean of the absolute deviations from the mean line over the evaluation length',
            'The root mean square roughness over the evaluation length',
            'The average spacing between peaks'
          ],
          correctIndex: 1,
          explanation: 'Ra (arithmetic average roughness) is the most widely used surface roughness parameter. It is the average of the absolute values of profile height deviations from the mean line over the evaluation length. Ra 1.6 μm is achievable by fine turning or peripheral milling. While Ra is ubiquitous, it has limitations — different surface profiles can produce the same Ra value. For critical sealing or bearing surfaces, additional parameters like Rz (average peak-to-valley) or Rq (RMS roughness) may be specified.',
          hint: 'Ra stands for "Roughness average" — the mean of absolute deviations from the centerline.'
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
          explanation: 'Rz (average of the maximum peak-to-valley heights in each sampling length) is preferred for sealing surfaces because it captures the extreme deviations that affect seal contact and leakage. Ra averages out these extremes and can miss isolated deep valleys or high peaks. A surface with Ra 0.8 could have Rz values ranging from 4 to 12 μm depending on the process. For O-ring and lip seal surfaces, both Ra and Rz are typically specified (e.g., Ra ≤ 0.4 μm, Rz ≤ 2.5 μm).',
          hint: 'Seals are affected by the tallest peaks and deepest valleys, not just the average roughness.'
        },
        {
          id: 'u9-L5-Q3',
          type: 'true-false',
          question: 'A CMM (Coordinate Measuring Machine) measures part geometry by touching the part surface with a probe and recording the coordinates of each contact point in 3D space.',
          correctAnswer: true,
          explanation: 'A CMM uses a precision probe (typically a ruby ball on a stylus) mounted on a 3-axis Cartesian positioning system to measure part geometry. Each touch records X, Y, Z coordinates relative to the machine\'s reference frame. Software fits geometric primitives (planes, cylinders, spheres) to the collected points and calculates dimensions, form errors, and geometric tolerances. Modern CMMs achieve uncertainties of 1–3 μm. Scanning probes collect thousands of points continuously, while touch-trigger probes record discrete points.',
          hint: 'CMMs work by building a 3D map of the part surface through probe contact points.'
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
          hint: 'The measurement uncertainty should consume no more than 10–25% of the tolerance band.'
        },
        {
          id: 'u9-L5-Q6',
          type: 'fill-blank',
          question: 'The 3D precision measurement machine that uses a probe to measure part geometry and verify GD&T tolerances is called a ___ (abbreviation).',
          acceptedAnswers: ['CMM', 'cmm', 'Coordinate Measuring Machine', 'coordinate measuring machine'],
          explanation: 'The Coordinate Measuring Machine (CMM) is the primary metrology tool for verifying dimensional and geometric tolerances in manufacturing. Bridge-type CMMs are most common, with gantry types used for large parts and horizontal-arm types for very large assemblies. Modern CMMs integrate with CAD models, allowing direct comparison of measured geometry to the design intent. They can evaluate virtually all GD&T callouts (form, orientation, position, runout, profile) from a single setup.',
          hint: 'This three-letter abbreviation is the standard inspection equipment for GD&T verification.'
        }
      ]
    }
  ]
};
