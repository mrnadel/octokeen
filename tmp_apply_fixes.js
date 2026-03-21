const fs = require('fs');

// Comprehensive mapping of all fixes needed
// Format: { oldText: 'exact old option', newText: 'exact new option' }
// Strategy: trim correct answer first; expand wrong if needed

const fixes = {
  'unit-1-statics.ts': [
    // u1-L1-Q4 (ci=0, bias=70%) correct=109, avg_wrong=64
    { old: "cos\u00b2\u03b1 + cos\u00b2\u03b2 + cos\u00b2\u03b3 must equal 1; here they sum to 1.10, so there is an error",
      new: "cos\u00b2\u03b1 + cos\u00b2\u03b2 + cos\u00b2\u03b3 must equal 1; here 0.36+0.49+0.25 = 1.10" },
    { old: "All three values must be positive and between zero and one",
      new: "All three cosines must be positive and lie between zero and one" },

    // u1-L1-Q10 (ci=0, bias=47%) correct=86, avg_wrong=59
    { old: "Both magnitude and direction — it must equal and oppose the resultant of the other two",
      new: "Both magnitude and direction — it must oppose the others' resultant" },

    // u1-L1-Q12 (ci=0, bias=73%) correct=90, avg_wrong=52
    { old: "In 3D where the perpendicular distance is hard to find — r\u00d7F handles it automatically",
      new: "In 3D where perpendicular distance is hard to find" },
    { old: "Only when force is perpendicular to the position vector",
      new: "Only when force is perpendicular to the position vector" },
    { old: "Only in 2D problems with more than three forces",
      new: "Only in 2D problems with more than three concurrent forces" },

    // u1-L1-Q15 (ci=0, bias=58%) correct=94, avg_wrong=59
    { old: "It gives |F1||F2|cos\u03b8, measuring alignment — useful for projecting one force onto another",
      new: "It gives |F1||F2|cos\u03b8, useful for projecting one force onto another" },

    // u1-L1-Q16 (ci=0, bias=68%) correct=71, avg_wrong=42
    { old: "A pure couple of 30 N\u00b7m (net force is zero, net moment is nonzero)",
      new: "A pure couple of 30 N\u00b7m (zero net force)" },
    { old: "A single 20 N downward force at x = 3 m",
      new: "A single 20 N downward force at x = 3 m from origin" },
    { old: "A single 40 N downward force at x = 3 m",
      new: "A single 40 N downward force at x = 3 m from origin" },
    { old: "Zero force and zero moment — complete equilibrium",
      new: "Zero force and zero moment — the system is in full equilibrium" },

    // u1-L1-Q30 (ci=0, bias=48%) correct=74, avg_wrong=50
    { old: "Moment equilibrium fails — the system appears to have an unbalanced torque",
      new: "Moment equilibrium fails — appears to have unbalanced torque" },

    // u1-L2-Q1 (ci=0, bias=51%) correct=79, avg_wrong=52
    { old: "Total magnitude (area under load curve) and location (centroid of distribution)",
      new: "Total magnitude (area under load curve) and centroid location" },

    // u1-L2-Q5 (ci=0, bias=32%) correct=45, avg_wrong=34 — borderline
    { old: "Two: horizontal and vertical force components",
      new: "Two: horizontal and vertical force components" },
    { old: "One: vertical force only",
      new: "One: a single vertical reaction force only" },
    { old: "Three: two forces plus a moment",
      new: "Three: two force components plus a moment reaction" },

    // u1-L2-Q10 (ci=0, bias=48%) correct=85, avg_wrong=57
    { old: "Forces only at two endpoints — must be equal, opposite, and along the connecting line",
      new: "Forces at two endpoints only — equal, opposite, and collinear" },

    // u1-L2-Q12 (ci=0, bias=48%) correct=41, avg_wrong=28
    { old: "R = w\u2080L/2 at 2L/3 from the light end",
      new: "R = w\u2080L/2 at 2L/3 from light end" },
    { old: "R = w\u2080L at L/2 (midpoint)",
      new: "R = w\u2080L acting at L/2 from either end" },
    { old: "R = w\u2080L/2 at L/2",
      new: "R = w\u2080L/2 acting at the midpoint L/2" },
    { old: "R = w\u2080L/3 at 2L/3 from left",
      new: "R = w\u2080L/3 acting at 2L/3 from left end" },

    // u1-L2-Q14 (ci=0, bias=51%) correct=69, avg_wrong=46
    { old: "Statically indeterminate (degree 1) — need one compatibility equation",
      new: "Statically indeterminate (degree 1) — need compatibility" },
    { old: "Likely an FBD error — recheck support types",
      new: "Likely an FBD error — recheck support types at each end" },
    { old: "One reaction must be zero, making it solvable",
      new: "One reaction must be zero, making the system solvable" },
    { old: "The beam is unstable and will collapse under load",
      new: "The beam is unstable and will collapse under any applied load" },

    // u1-L2-Q22 (ci=0, bias=38%) correct=71, avg_wrong=51 — fix
    { old: "Single tension force along the cable (45\u00b0), unknown magnitude only",
      new: "Single tension force along the cable, unknown magnitude only" },
    { old: "Two independent components (H and V), each with unknown magnitude",
      new: "Two independent components (H and V), each with unknown magnitude" },

    // u1-L2-Q24 (ci=0, bias=48%) correct=84, avg_wrong=57
    { old: "Yes — pin at A balances horizontal P, both supports handle vertical loads and moment",
      new: "Yes — pin at A resists horizontal P, both supports share verticals" },

    // u1-L3-Q1 (ci=0, bias=124%) correct=98, avg_wrong=44
    { old: "Truss: axial loads only (lighter, more joints). Frame: bending + shear too (heavier, fewer joints)",
      new: "Truss: axial only (lighter). Frame: bending + shear too" },
    { old: "Trusses are always cheaper due to less material",
      new: "Trusses are always cheaper due to requiring less raw material" },
    { old: "Frames are always stronger due to rigid joints",
      new: "Frames are always stronger because of their rigid welded joints" },
    { old: "Trusses can only span up to about 10 m",
      new: "Trusses can only practically span distances up to about 10 m" },

    // u1-L3-Q3 (ci=0, bias=54%) correct=89, avg_wrong=58
    { old: "Method of sections: cut through the target member (and \u22642 others), apply 3 equations",
      new: "Method of sections: cut through target member (\u22643 cuts), use 3 equations" },

    // u1-L3-Q7 (ci=0, bias=45%) correct=71, avg_wrong=49
    { old: "Zero — it's a zero-force member; the collinear pair carry equal forces",
      new: "Zero — it is a zero-force member (collinear pair rule)" },
    { old: "Equal to the sum of forces in the collinear pair",
      new: "Equal to the sum of forces acting in the collinear pair" },
    { old: "Cannot be determined without full truss data",
      new: "Cannot be determined without analyzing the full truss data" },

    // u1-L3-Q8 (ci=0, bias=79%) correct=65, avg_wrong=36
    { old: "Tension — efficient because slender tension members don't buckle",
      new: "Tension — slender members don't buckle" },
    { old: "Compression, requiring heavier sections",
      new: "Compression, which requires heavier member sections" },
    { old: "No load — only verticals carry load",
      new: "No load at all — only vertical members carry any load" },
    { old: "Alternating tension and compression",
      new: "Alternating tension and compression along the length" },

    // u1-L3-Q10 (ci=0, bias=62%) correct=40, avg_wrong=25
    { old: "Indeterminate, degree 1 (m+r=13 > 2j=12)",
      new: "Indeterminate, degree 1 (m+r > 2j)" },
    { old: "Determinate (m+r = 2j)",
      new: "Determinate since m+r equals 2j exactly" },
    { old: "Unstable mechanism (m+r < 2j)",
      new: "Unstable mechanism because m+r is less than 2j" },
    { old: "Indeterminate, degree 2",
      new: "Indeterminate to the second degree (m+r=14)" },

    // u1-L3-Q12 (ci=0, bias=93%) correct=103, avg_wrong=53
    { old: "Frames have multi-force members (bending+shear+axial); trusses have only two-force members (axial only)",
      new: "Frames have multi-force members; trusses have two-force members" },

    // u1-L3-Q15 (ci=0, bias=35%) correct=68, avg_wrong=50
    { old: "Fewer members and joints than Pratt/Howe, reducing fabrication costs",
      new: "Fewer members and joints, reducing fabrication costs" },
    { old: "Better lateral load resistance than Pratt or Howe",
      new: "Better lateral load resistance than either Pratt or Howe trusses" },

    // u1-L3-Q17 (ci=0, bias=53%) correct=75, avg_wrong=49
    { old: "Combine both: joints first to reduce unknowns, then sections for the target",
      new: "Combine joints (reduce unknowns) then sections for target" },

    // u1-L3-Q18 (ci=0, bias=63%) correct=92, avg_wrong=56
    { old: "Equilibrium forces that member to zero, making the joint redundant — likely a modeling error",
      new: "Equilibrium forces that member to zero — likely a modeling error" },

    // u1-L3-Q22 (ci=0, bias=85%) correct=77, avg_wrong=42
    { old: "Reduces unsupported length of verticals, increasing their buckling resistance",
      new: "Reduces unsupported length, increasing buckling resistance" },
    { old: "Eliminates all diagonal members entirely",
      new: "Eliminates all diagonal members from the truss entirely" },
    { old: "Uses less material than any other truss type",
      new: "Uses less raw material than any other common truss type" },
    { old: "Self-supporting without external supports",
      new: "Self-supporting without requiring any external supports" },

    // u1-L4-Q1 (ci=0, bias=96%) correct=94, avg_wrong=48
    { old: "Capstan equation: T1/T2 = e^(\u03bc\u03b8) — tension ratio grows exponentially with wrap angle",
      new: "Capstan equation: T1/T2 = e^(\u03bc\u03b8), exponential with wrap angle" },
    { old: "More wraps increase the effective friction coefficient",
      new: "More wraps increase the effective coefficient of friction" },
    { old: "Normal force increases linearly with each wrap",
      new: "Normal force increases linearly with each successive wrap" },
    { old: "More wraps absorb more elastic strain energy",
      new: "More wraps absorb additional elastic strain energy storage" },

    // u1-L4-Q7 (ci=0, bias=58%) correct=87, avg_wrong=55
    { old: "Increases with P until \u03bcs\u00b7N, then drops to \u03bck\u00b7N when sliding starts",
      new: "Increases with P up to \u03bcs\u00b7N, then drops to \u03bck\u00b7N" },

    // u1-L4-Q8 (ci=0, bias=60%) correct=81, avg_wrong=51
    { old: "Yes — 5\u00b0 < arctan(0.15) \u2248 8.53\u00b0, so it holds without applied force",
      new: "Yes — 5\u00b0 < arctan(0.15) \u2248 8.53\u00b0, self-locking" },

    // u1-L4-Q15 (ci=0, bias=38%) correct=72, avg_wrong=52
    { old: "Can reverse — friction acts up-slope at low P, then down-slope at high P",
      new: "Can reverse — up-slope at low P, down-slope at high P" },

    // u1-L4-Q17 (ci=0, bias=48%) correct=63, avg_wrong=43
    { old: "tan\u03b8 \u2265 1/(2\u03bcs) — slips when angle is too shallow",
      new: "tan\u03b8 \u2265 1/(2\u03bcs), slips when too shallow" },
    { old: "\u03b8 must exceed 45\u00b0 regardless of friction",
      new: "\u03b8 must exceed 45\u00b0 regardless of the friction value" },
    { old: "A smooth wall prevents slipping entirely",
      new: "A perfectly smooth wall prevents any slipping entirely" },

    // u1-L4-Q18 (ci=0, bias=77%) correct=99, avg_wrong=56
    { old: "Area of ring \u221d r\u00b7dr, moment arm = r, so integrand is r\u00b2\u00b7dr \u2192 r\u00b3 terms",
      new: "Ring area \u221d r\u00b7dr, arm = r, so integrand \u2192 r\u00b3" },
    { old: "Friction per unit area increases with tangential speed",
      new: "Friction per unit area increases proportionally with tangential speed" },

    // u1-L4-Q20 (ci=0, bias=35%) correct=81, avg_wrong=60
    { old: "P = (\u03bc\u2081m_A + \u03bc\u2082(m_A+m_B))g — limited by top block sliding off",
      new: "P = (\u03bc\u2081m_A + \u03bc\u2082(m_A+m_B))g — limited by top sliding" },

    // u1-L4-Q22 (ci=0, bias=38%) correct=64, avg_wrong=46
    { old: "Increased by 1/sin\u03b2 \u2248 3.24\u00d7 due to wedging action",
      new: "Increased by 1/sin\u03b2 \u2248 3.24\u00d7, wedging effect" },
    { old: "Same as flat belt — groove angle has no effect",
      new: "Same as flat belt — the groove angle has no practical effect" },
    { old: "Doubled — belt contacts two surfaces",
      new: "Doubled since the belt now contacts two groove surfaces" },

    // u1-L4-Q24 (ci=0, bias=68%) correct=62, avg_wrong=37
    { old: "~2500 N — friction on all surfaces adds significant resistance",
      new: "~2500 N — friction adds significant resistance" },
    { old: "~500 N — 10:1 mechanical advantage",
      new: "~500 N — assumes a 10:1 mechanical advantage ratio" },
    { old: "~5000 N — no mechanical advantage",
      new: "~5000 N — assumes no mechanical advantage at all" },
    { old: "~875 N — only wedge surface friction matters",
      new: "~875 N — accounts for only the wedge surface friction" },

    // u1-L4-Q27 (ci=0, bias=95%) correct=93, avg_wrong=48
    { old: "\u03b7 = tan\u03b8/tan(\u03b8+\u03c6) < 50% whenever \u03c6 > \u03b8 (self-locking condition)",
      new: "\u03b7 = tan\u03b8/tan(\u03b8+\u03c6), always < 50% when self-locking" },
    { old: "Half the input energy always becomes heat in any screw",
      new: "Half the input energy always becomes heat in any screw type" },
    { old: "Thread geometry is designed to waste exactly 50%",
      new: "Thread geometry is specifically designed to waste exactly 50%" },
    { old: "Lubrication can push efficiency above 50%",
      new: "Lubrication can push screw efficiency above the 50% threshold" },

    // u1-L5-Q1 (ci=0, bias=59%) correct=75, avg_wrong=47
    { old: "I-beam — flanges far from neutral axis maximize I via Ad\u00b2 contribution",
      new: "I-beam — flanges far from NA maximize I via Ad\u00b2" },
    { old: "Solid circle — distributes stress most evenly",
      new: "Solid circle — distributes bending stress most evenly" },
    { old: "Solid square — equal stiffness in all directions",
      new: "Solid square — provides equal stiffness in all directions" },

    // u1-L5-Q14 (ci=0, bias=64%) correct=89, avg_wrong=54
    { old: "Unequal distances to extreme fibers \u2192 different max tensile and compressive stresses",
      new: "Unequal distances to extreme fibers \u2192 different max stresses" },

    // u1-L5-Q20 (ci=0, bias=140%) correct=12, avg_wrong=5 — very short, expand wrongs
    { old: "4R/(3\u03c0)",
      new: "4R/(3\u03c0)" },
    // These are formula options - can't meaningfully change without losing clarity
    // Skip this one as all are very short formulas

    // u1-L5-Q22 (ci=0, bias=32%) correct=67, avg_wrong=51 — borderline
    { old: "Ixy couples bending directions — vanishes with any axis of symmetry",
      new: "Ixy couples bending directions — zero with any symmetry axis" },

    // u1-L5-Q26 (ci=0, bias=31%) correct=63, avg_wrong=48
    { old: "Find the composite centroid — transfer distances d depend on it",
      new: "Find composite centroid — transfer distances d depend on it" },
  ],

  'unit-3-strength.ts': [
    // u3-L1-Q9 (ci=0, bias=34%) correct=66, avg_wrong=49
    { old: "About 64% — load distributes in proportion to EA (axial stiffness)",
      new: "About 64% — load distributes by EA (axial stiffness)" },

    // u3-L1-Q17 (ci=0, bias=51%) correct=84, avg_wrong=56
    { old: "Dislocations are initially pinned by interstitial carbon atoms; once they break free",
      new: "Dislocations pinned by interstitial C atoms; once they break free" },

    // u3-L1-Q19 (ci=0, bias=138%) correct=137, avg_wrong=58
    { old: "The elastic region and initial yielding are nearly identical; they diverge after significant plastic deformation due to barreling effects",
      new: "Nearly identical elastic region; diverge after significant plastic deformation" },

    // u3-L1-Q21 (ci=0, bias=68%) correct=91, avg_wrong=54
    { old: "Steel stores far more: U_r = Sy\u00b2/(2E) gives 20.4 kJ/m\u00b3 for copper vs. 156.3 kJ/m\u00b3 for steel",
      new: "Steel stores far more: U_r = Sy\u00b2/(2E) gives 156.3 vs. 20.4 kJ/m\u00b3" },

    // u3-L1-Q23 (ci=0, bias=37%) correct=77, avg_wrong=56
    { old: "Bearing stress = F/(d x t), where d is bolt diameter and t is plate thickness",
      new: "Bearing stress = F/(d x t), d = bolt diameter, t = plate thickness" },

    // u3-L1-Q25 (ci=0, bias=70%) correct=78, avg_wrong=46
    { old: "Stress is maximum at the top (sigma = rho*g*L) and zero at the free bottom end",
      new: "Maximum at top (sigma = rho*g*L), zero at free end" },
    { old: "Stress is uniform because the cross-section is constant",
      new: "Uniform stress because the cross-section is constant throughout" },
    { old: "Stress is maximum at the bottom where gravity acts",
      new: "Maximum at the bottom end where the gravitational force acts" },
    { old: "Stress is maximum at the midpoint",
      new: "Maximum stress occurs at the rod's midpoint along its length" },

    // u3-L1-Q26 (ci=0, bias=119%) correct=111, avg_wrong=51
    { old: "255 MPa — only 31% of proof strength; typical preload should target 75% of proof strength for reliable clamping",
      new: "255 MPa — only 31% of proof strength; should target 75%" },
    { old: "255 MPa — this exceeds allowable stress for any bolt grade",
      new: "255 MPa — exceeds the allowable stress for any standard bolt grade" },

    // u3-L2-Q5 (ci=0, bias=260%) correct=60, avg_wrong=17
    { old: "sigma = 3PL/(2bh\u00b2) — derived from M_max = PL/4 and S = bh\u00b2/6",
      new: "sigma = 3PL/(2bh\u00b2)" },
    { old: "sigma = PL/(bh\u00b2)",
      new: "sigma = PL/(bh\u00b2)" },
    { old: "sigma = 6PL/(bh\u00b2)",
      new: "sigma = 6PL/(bh\u00b2)" },
    { old: "sigma = PL/(4bh\u00b2)",
      new: "sigma = PL/(4bh\u00b2)" },

    // u3-L2-Q10 (ci=0, bias=150%) correct=50, avg_wrong=20
    { old: "Approximately 2.0 mm — using delta = 5wL^4/(384EI)",
      new: "Approximately 2.0 mm" },
    { old: "Approximately 0.5 mm",
      new: "Approximately 0.5 mm" },

    // u3-L2-Q15 (ci=0, bias=80%) correct=107, avg_wrong=59
    { old: "Parabolic distribution, maximum at the neutral axis: tau_max = 3V/(2A) = 1.5 times the average shear stress",
      new: "Parabolic, max at neutral axis: tau_max = 3V/(2A)" },
    { old: "Uniform across the section: tau = V/A everywhere",
      new: "Uniform across the entire section: tau = V/A everywhere" },

    // u3-L2-Q26 (ci=0, bias=51%) correct=79, avg_wrong=52
    { old: "S_required = M/sigma_allow = 1,212 cm\u00b3; select the lightest W-shape with S >= 1",
      new: "S_required = M/sigma_allow; select lightest W-shape with S >= that" },

    // u3-L3-Q7 (ci=0, bias=67%) correct=84, avg_wrong=50
    { old: "The SFD is unaffected (no jump), but the BMD has a sudden vertical jump equal to M_0",
      new: "SFD unaffected, but BMD jumps vertically by M_0" },
    { old: "Both the SFD and BMD have vertical jumps equal to M_0",
      new: "Both the SFD and BMD have simultaneous vertical jumps equal to M_0" },

    // u3-L3-Q10 (ci=0, bias=604%) correct=54, avg_wrong=8
    { old: "52.5 kN*m — sum of the point load moment (10 x 3 = 30)",
      new: "52.5 kN*m" },

    // u3-L3-Q14 (ci=0, bias=66%) correct=52, avg_wrong=31
    { old: "A concentrated couple (applied moment) at that point",
      new: "A concentrated couple at that point" },
    { old: "A concentrated point load",
      new: "A concentrated point load applied at that location" },
    { old: "A support reaction",
      new: "A support reaction force at that specific location" },

    // u3-L3-Q16 (ci=0, bias=138%) correct=92, avg_wrong=39
    { old: "A negative (hogging) moment of -40 kN*m develops at the right support from the overhang load",
      new: "A negative (hogging) moment of -40 kN*m at right support" },
    { old: "Zero moment because the right support is a roller",
      new: "Zero moment because the right support is a roller (no restraint)" },
    { old: "A positive (sagging) moment of 40 kN*m",
      new: "A positive (sagging) moment of 40 kN*m at the right support" },
    { old: "A negative moment of -20 kN*m",
      new: "A negative moment of -20 kN*m at the right support location" },

    // u3-L3-Q20 (ci=0, bias=135%) correct=112, avg_wrong=48
    { old: "It is the diagram showing the maximum and minimum possible moments at each point due to variable or moving loads",
      new: "Diagram of max and min possible moments at each point for moving loads" },
    { old: "It is the BMD for the most critical single load case only",
      new: "It is the BMD for the most critical single load case only" },
    { old: "It is the average of all possible BMDs",
      new: "It is the average of all possible bending moment diagrams combined" },
    { old: "It is only used for dynamic (vibration) analysis",
      new: "It is used only for dynamic vibration analysis applications" },

    // u3-L3-Q23 (ci=0, bias=212%) correct=176, avg_wrong=56
    { old: "They provide a single mathematical expression for V(x) and M(x) valid over the entire beam length, handling discontinuities from point loads and distributed loads automatically",
      new: "Single V(x) and M(x) expression valid over entire beam length" },

    // u3-L3-Q25 (ci=0, bias=754%) correct=37, avg_wrong=4
    { old: "16 kN — equal to the total UDL force,",
      new: "16 kN" },

    // u3-L3-Q29 (ci=0, bias=40%) correct=80, avg_wrong=57
    { old: "The maximum moment determines the required section modulus S = M_max/sigma_allow",
      new: "Max moment determines required section modulus S" },

    // u3-L4-Q5 (ci=0, bias=118%) correct=48, avg_wrong=22
    { old: "Approximately 48.9 MPa — using tau = 16T/(pi*d\u00b3)",
      new: "Approximately 48.9 MPa" },

    // u3-L4-Q7 (ci=0, bias=69%) correct=53, avg_wrong=31
    { old: "J_hollow/J_solid = 1 - (d/D)^4 = 1 - (0.75)^4 = 0.684",
      new: "1 - (d/D)^4 = 0.684, retaining 68.4%" },
    { old: "1 - (d/D)^2 = 0.4375, retaining 43.75%",
      new: "1 - (d/D)^2 = 0.4375, retaining 43.75%" },

    // u3-L4-Q10 (ci=0, bias=300%) correct=76, avg_wrong=19
    { old: "Approximately 28 mm — find T from P = T*omega, then d from tau = 16T/(pi*d\u00b3)",
      new: "Approximately 28 mm" },

    // u3-L4-Q15 (ci=0, bias=271%) correct=78, avg_wrong=21
    { old: "Approximately 285 N*m — output torque = input torque x gear ratio x efficiency",
      new: "Approximately 285 N*m" },

    // u3-L4-Q16 (ci=0, bias=65%) correct=54, avg_wrong=33
    { old: "500 N*m — the torque is constant between the two gears",
      new: "500 N*m — torque is constant between gears" },
    { old: "250 N*m — the torque is halved at the midpoint",
      new: "250 N*m — torque is halved at the shaft midpoint" },
    { old: "0 N*m — the torques cancel",
      new: "0 N*m — the applied torques cancel each other out" },
    { old: "1000 N*m — the torques add",
      new: "1000 N*m — the applied torques add together fully" },

    // u3-L4-Q18 (ci=0, bias=200%) correct=71, avg_wrong=24
    { old: "2^(1/3) = 1.26 — a 26% increase in diameter doubles the torque capacity",
      new: "2^(1/3) = 1.26 — 26% more diameter doubles capacity" },
    { old: "2.0 — double the diameter",
      new: "2.0 — double the diameter to double the capacity" },
    { old: "1.41 — square root of 2",
      new: "1.41 — square root of 2 (area-based reasoning)" },
    { old: "1.19 — fourth root of 2",
      new: "1.19 — fourth root of 2 (inertia-based reasoning)" },

    // u3-L4-Q22 (ci=0, bias=120%) correct=109, avg_wrong=50
    { old: "T/2 each — by symmetry and compatibility (both ends have the same length and stiffness, so each resists half)",
      new: "T/2 each — by symmetry both ends resist half" },
    { old: "The left end resists all T and the right end resists none",
      new: "The left end resists all T, the right end resists none" },

    // u3-L4-Q25 (ci=0, bias=112%) correct=121, avg_wrong=57
    { old: "Calculating shear stress and angle of twist in thin-walled closed (hollow) sections of arbitrary shape: tau = T/(2*A_m*t)",
      new: "Shear stress in thin-walled closed sections: tau = T/(2*A_m*t)" },

    // u3-L4-Q26 (ci=0, bias=132%) correct=160, avg_wrong=69
    { old: "The sharp corner creates a severe stress concentration (Kt = 3-5) that will initiate fatigue cracks, even if nominal stresses are well below the endurance limit",
      new: "Sharp corner creates stress concentration (Kt = 3-5) initiating fatigue cracks" },

    // u3-L5-Q2 (ci=0, bias=36%) correct=94, avg_wrong=69
    { old: "Brittle materials fail by maximum tensile stress (principal stress at 45 degrees to the axis),",
      new: "Brittle materials fail by max principal stress (at 45\u00b0 to axis)" },

    // u3-L5-Q7 (ci=0, bias=784%) correct=56, avg_wrong=6
    { old: "75 MPa — tau_max = (sigma_1 - sigma_2)/2 = (120-(-30))/2",
      new: "75 MPa" },

    // u3-L5-Q10 (ci=0, bias=95%) correct=74, avg_wrong=38
    { old: "First find sigma_b = 32M/(pi*d\u00b3) = 943 MPa and tau = 16T/(pi*d\u00b3) = 354 MPa",
      new: "sigma_b = 943 MPa, tau = 354 MPa, then apply von Mises" },

    // u3-L5-Q18 (ci=0, bias=76%) correct=88, avg_wrong=50
    { old: "theta_p = 0.5 * arctan(2*tau/(sigma_x - sigma_y)) = 0.5 * arctan(160/150) = 23.4 degrees",
      new: "23.4\u00b0 — from theta_p = 0.5*arctan(2*tau/\u0394sigma)" },
    { old: "45 degrees always for combined bending and torsion",
      new: "45 degrees always for combined bending and torsion loads" },
    { old: "0 degrees — the principal stress is along the shaft axis",
      new: "0 degrees — the principal stress is along the shaft axis" },
    { old: "90 degrees — perpendicular to the shaft axis",
      new: "90 degrees — perpendicular to the shaft axis direction" },

    // u3-L5-Q21 (ci=0, bias=242%) correct=213, avg_wrong=62
    { old: "Plane stress (sigma_z = 0) applies to thin plates loaded in-plane; plane strain (epsilon_z = 0) applies to long bodies with uniform cross-section loaded transversely — each has different Mohr's circle implications",
      new: "Plane stress: sigma_z=0 (thin plates); plane strain: epsilon_z=0 (long bodies)" },

    // u3-L5-Q27 (ci=0, bias=64%) correct=72, avg_wrong=44
    { old: "sigma_n = 100*cos\u00b2(30\u00b0) = 75 MPa, tau = 100*sin(30\u00b0)*cos(30\u00b0) = 43.3 MPa",
      new: "sigma_n = 75 MPa, tau = 43.3 MPa (from oblique plane formulas)" },
    { old: "sigma_n = 100*sin(30\u00b0) = 50 MPa, tau = 100*cos(30\u00b0) = 86.6 MPa",
      new: "sigma_n = 50 MPa, tau = 86.6 MPa (using sin/cos incorrectly)" },
    { old: "sigma_n = 100 MPa, tau = 0 on all planes",
      new: "sigma_n = 100 MPa, tau = 0 on all inclined planes" },
    { old: "sigma_n = 50 MPa, tau = 50 MPa",
      new: "sigma_n = 50 MPa, tau = 50 MPa (equal split assumption)" },

    // u3-L5-Q28 (ci=0, bias=190%) correct=115, avg_wrong=40
    { old: "Three circles — one for each pair of principal stresses. The largest circle gives the absolute maximum shear stress",
      new: "Three circles — one per principal stress pair; largest gives tau_max" },
    { old: "Only one circle, same as 2D",
      new: "Only one circle, same as the 2D Mohr analysis method" },
    { old: "None — Mohr's circle only works in 2D",
      new: "None — Mohr's circle is valid only for 2D stress states" },

    // u3-L6-Q5 (ci=0, bias=242%) correct=65, avg_wrong=19
    { old: "sigma_vm = sqrt(180\u00b2 - 180(-60) + (-60)\u00b2) = sqrt(46800) = 216 MPa",
      new: "sigma_vm = 216 MPa, FS = 350/216 = 1.62" },
    { old: "FS = 350/180 = 1.94",
      new: "FS = 350/180 = 1.94 (uses sigma_1 directly)" },
    { old: "FS = 350/240 = 1.46",
      new: "FS = 350/240 = 1.46 (uses Tresca criterion)" },
    { old: "FS = 350/120 = 2.92",
      new: "FS = 350/120 = 2.92 (uses sigma_2 magnitude)" },

    // u3-L6-Q8 (ci=0, bias=57%) correct=81, avg_wrong=52
    { old: "A plot of stress amplitude (S) vs. number of cycles to failure (N) on a log scale",
      new: "Plot of stress amplitude (S) vs. cycles to failure (N)" },

    // u3-L6-Q10 (ci=0, bias=41%) correct=77, avg_wrong=55
    { old: "Check: sigma_a/Se + sigma_m/Sut = 80/250 + 100/500 = 0.32 + 0.20 = 0.52 < 1.0",
      new: "Safe: sigma_a/Se + sigma_m/Sut = 0.52 < 1.0 (Goodman)" },

    // u3-L6-Q12 (ci=0, bias=85%) correct=107, avg_wrong=58
    { old: "A smooth region with beach marks (crack propagation zone) and a rough granular region (final fracture zone)",
      new: "Smooth region with beach marks plus rough granular final fracture" },

    // u3-L6-Q14 (ci=0, bias=335%) correct=84, avg_wrong=19
    { old: "sigma_vm = sqrt(400\u00b2 - 400*200 + 200\u00b2) = sqrt(120000) = 346 MPa. FS = 710/346 = 2.05",
      new: "FS = 710/346 = 2.05 (von Mises)" },
    { old: "FS = 710/400 = 1.78",
      new: "FS = 710/400 = 1.78 (max principal)" },
    { old: "FS = 1080/400 = 2.70",
      new: "FS = 1080/400 = 2.70 (uses Sut incorrectly)" },
    { old: "FS = 710/600 = 1.18",
      new: "FS = 710/600 = 1.18 (arithmetic sum)" },

    // u3-L6-Q16 (ci=0, bias=217%) correct=192, avg_wrong=61
    { old: "Under static loading, local yielding redistributes stress away from the concentration; in fatigue, even small cyclic plastic strains at the notch root initiate cracks that propagate to failure",
      new: "Static: local yielding redistributes stress; fatigue: cyclic strains at notch initiate cracks" },

    // u3-L6-Q18 (ci=0, bias=108%) correct=84, avg_wrong=40
    { old: "Check: sigma_1/Sut - sigma_2/Suc = 80/200 - (-250)/800 = 0.4 + 0.3125 = 0.7125 < 1.0",
      new: "Safe: sigma_1/Sut - sigma_2/Suc = 0.7125 < 1.0" },
    { old: "Unsafe because sigma_2 exceeds half of Suc",
      new: "Unsafe because sigma_2 exceeds half of the compressive strength" },
    { old: "Safe because both stresses are below Sut",
      new: "Safe because both individual stresses are below Sut value" },

    // u3-L6-Q19 (ci=0, bias=255%) correct=174, avg_wrong=49
    { old: "HCF (N > 10^3-10^4) involves primarily elastic strains and uses stress-life (S-N) approach; LCF involves significant plastic strains and uses strain-life (epsilon-N) approach",
      new: "HCF: elastic strains, S-N approach; LCF: plastic strains, epsilon-N" },
    { old: "HCF is for steel and LCF is for aluminum",
      new: "HCF applies to steel only and LCF applies to aluminum only" },
    { old: "HCF uses higher safety factors than LCF",
      new: "HCF uses higher safety factors than LCF in all applications" },

    // u3-L6-Q23 (ci=0, bias=119%) correct=62, avg_wrong=28
    { old: "Soderberg (most conservative, uses Sy) > Goodman (intermediate",
      new: "Soderberg > Goodman > Gerber" },
    { old: "Gerber > Goodman > Soderberg",
      new: "Gerber > Goodman > Soderberg (reversed)" },
    { old: "They all give the same result",
      new: "All three criteria give the same result" },
    { old: "Goodman > Soderberg > Gerber",
      new: "Goodman > Soderberg > Gerber (mixed up)" },

    // u3-L6-Q30 (ci=0, bias=121%) correct=181, avg_wrong=82
    { old: "No — Euler buckling load P_cr = pi^2*EI/(KL)^2 depends on E (stiffness) and I (geometry), NOT on yield strength. Higher-strength steel has the same E, so it buckles at the same load",
      new: "No — P_cr = pi^2*EI/(KL)^2 depends on E and I, not yield strength" },
    { old: "Yes — stronger steel resists more force in every failure mode including elastic buckling,",
      new: "Yes — stronger steel resists more force in every mode including buckling" },
    { old: "Yes — higher strength steel has a correspondingly higher modulus of elasticity",
      new: "Yes — higher strength steel has correspondingly higher elastic modulus" },
    { old: "No — but only because the column needs to be made shorter rather than stronger,",
      new: "No — but only because the column needs to be shorter, not stronger" },

    // u3-L7-Q1 (ci=0, bias=223%) correct=125, avg_wrong=39
    { old: "When the Euler critical stress exceeds the proportional limit (short/intermediate columns) — use Johnson's parabolic formula",
      new: "When Euler stress exceeds proportional limit (short columns)" },
    { old: "When the column has a circular cross-section",
      new: "When the column cross-section is circular in shape" },
    { old: "When the column is longer than 10 meters",
      new: "When the column exceeds a physical length of 10 meters" },
    { old: "When the column is made of steel",
      new: "When the column is made of any grade of structural steel" },

    // u3-L7-Q8 (ci=0, bias=70%) correct=55, avg_wrong=32
    { old: "sigma_h = pD/(2t) = 100 MPa, sigma_a = pD/(4t) = 50 MPa",
      new: "sigma_h = 100 MPa, sigma_a = 50 MPa" },
    { old: "sigma_h = 50 MPa, sigma_a = 100 MPa",
      new: "sigma_h = 50 MPa, sigma_a = 100 MPa" },
    { old: "sigma_h = 200 MPa, sigma_a = 100 MPa",
      new: "sigma_h = 200 MPa, sigma_a = 100 MPa" },
    { old: "sigma_h = sigma_a = 75 MPa",
      new: "sigma_h = sigma_a = 75 MPa (equal stress)" },

    // u3-L7-Q12 (ci=0, bias=56%) correct=75, avg_wrong=48
    { old: "r = sqrt(I/A) — equivalent distance where area is concentrated for buckling",
      new: "r = sqrt(I/A), equivalent concentrated-area distance" },

    // u3-L7-Q14 (ci=0, bias=729%) correct=58, avg_wrong=7
    { old: "K = 0.7 — the effective length is 70% of the actual length",
      new: "K = 0.7" },

    // u3-L7-Q18 (ci=0, bias=90%) correct=92, avg_wrong=48
    { old: "Internal steam pressure creates hoop stress (circumferential) that is twice the axial stress",
      new: "Hoop stress from internal pressure is twice the axial stress" },
    { old: "The split is random and has no structural explanation",
      new: "The split is random and has no structural explanation at all" },

    // u3-L7-Q22 (ci=0, bias=793%) correct=119, avg_wrong=13
    { old: "First find I = pi(D^4 - d^4)/64 = pi(150^4 - 140^4)/64 = 7.67 x 10^6 mm^4. P_cr = pi\u00b2(200,000)(7.67e6)/(4000\u00b2) = 946 kN",
      new: "P_cr = 946 kN" },
  ],

  'unit-7-materials.ts': [
    // u7-L1-Q2 (ci=1, bias=742%) correct=160, avg_wrong=19
    { old: "Creep — sustained stress at high temperature caused time-dependent plastic deformation. Next step: measure wall thickness and check for tertiary-stage cracking.",
      new: "Creep — time-dependent deformation from sustained high-temp stress" },
    { old: "Thermal fatigue",
      new: "Thermal fatigue from repeated heating and cooling cycles" },
    { old: "Stress corrosion cracking",
      new: "Stress corrosion cracking in a corrosive environment" },
    { old: "Overload yielding",
      new: "Overload yielding from a single excessive static load" },

    // u7-L1-Q12 (ci=3, bias=62%) correct=70, avg_wrong=43
    { old: "Shot peening to introduce compressive residual stresses on the surface",
      new: "Shot peening for compressive residual surface stresses" },
    { old: "Electroplating with chrome for corrosion resistance",
      new: "Electroplating with chrome for improved corrosion resistance" },
    { old: "Anodizing to increase surface hardness",
      new: "Anodizing to increase the surface hardness of the part" },

    // u7-L1-Q14 (ci=2, bias=124%) correct=112, avg_wrong=50
    { old: "Steel A — much higher impact toughness at low temperature ensures resistance to brittle fracture in cold weather",
      new: "Steel A — much higher impact toughness at low temperature" },
    { old: "Steel B — higher yield strength means less material",
      new: "Steel B — higher yield strength means less material is needed" },

    // u7-L1-Q15 (ci=1, bias=64%) correct=90, avg_wrong=55
    { old: "The toughness — the total energy per unit volume the material can absorb before fracturing",
      new: "The toughness — total energy per unit volume before fracture" },

    // u7-L1-Q17 (ci=0, bias=62%) correct=77, avg_wrong=48
    { old: "Charpy tests the specimen as a simply supported beam struck behind the notch,",
      new: "Charpy: simply supported beam struck behind the notch" },
    { old: "Charpy uses a V-notch and Izod does not use any notch,",
      new: "Charpy uses a V-notch and Izod uses no notch at all" },
    { old: "Charpy measures energy absorbed",
      new: "Charpy measures energy absorbed during the fracture event" },

    // u7-L1-Q21 (ci=1, bias=296%) correct=185, avg_wrong=47
    { old: "No — the HB-UTS correlation is for steels only. Cast iron has graphite flakes that reduce tensile strength without affecting hardness, so the correlation overpredicts UTS for cast iron.",
      new: "No — HB-UTS correlation is for steels only, not cast iron" },
    { old: "Yes — UTS \u2248 690 MPa, valid for all metals,",
      new: "Yes — UTS \u2248 690 MPa, this correlation is valid for all metals" },
    { old: "No — Brinell tests are invalid for cast iron",
      new: "No — Brinell hardness tests are invalid for all cast iron" },

    // u7-L1-Q24 (ci=3, bias=39%) correct=61, avg_wrong=44
    { old: "The stress amplitude was high relative to the endurance limit",
      new: "Stress amplitude was high relative to endurance limit" },

    // u7-L2-Q1 (ci=2, bias=85%) correct=84, avg_wrong=45
    { old: "To reduce brittleness of martensite by allowing controlled precipitation of carbides",
      new: "To reduce martensite brittleness via controlled carbide precipitation" },

    // u7-L2-Q4 (ci=1, bias=116%) correct=145, avg_wrong=67
    { old: "Normalizing — heat above the upper critical temperature and air cool. Faster than annealing, refines grains, and relieves most residual stresses.",
      new: "Normalizing — heat above upper critical temp and air cool" },
    { old: "Quench and temper — fastest way to refine the grain and relieve stress simultaneously — valid only at room temperature",
      new: "Quench and temper — fastest way to refine grain and relieve stress" },

    // u7-L2-Q5 (ci=0, bias=46%) correct=115, avg_wrong=79
    { old: "Lower bainite — a fine mixture of ferrite and carbides formed by isothermal transformation below the pearlite range",
      new: "Lower bainite — fine ferrite+carbides from isothermal transformation" },

    // u7-L2-Q12 (ci=3, bias=178%) correct=150, avg_wrong=54
    { old: "Hydrogen cracking — diffusible hydrogen combined with the high residual stresses and hard, brittle as-quenched martensite caused time-delayed fracture",
      new: "Hydrogen cracking — diffusible H + residual stress + brittle martensite" },

    // u7-L2-Q14 (ci=2, bias=272%) correct=103, avg_wrong=28
    { old: "Process annealing heats below the lower critical temperature (A\u2081) to recrystallize cold-worked ferrite,",
      new: "Process annealing heats below A\u2081 to recrystallize cold-worked ferrite" },
    { old: "Process annealing is for cast iron",
      new: "Process annealing is intended exclusively for cast iron parts" },
    { old: "Process annealing is faster",
      new: "Process annealing is faster because it skips phase transformation" },
    { old: "There is no difference",
      new: "There is no meaningful difference between the two treatments" },

    // u7-L2-Q17 (ci=0, bias=33%) correct=78, avg_wrong=59
    { old: "Austenite that did not transform during cooling — it is softer than martensite",
      new: "Austenite that did not transform during cooling — softer" },

    // u7-L2-Q19 (ci=2, bias=150%) correct=156, avg_wrong=62
    { old: "Proeutectoid ferrite forms first along austenite grain boundaries as the steel cools below A\u2083, then remaining austenite transforms to pearlite at A\u2081 (727\u00b0C)",
      new: "Proeutectoid ferrite forms at grain boundaries below A\u2083, then pearlite at A\u2081" },

    // u7-L2-Q21 (ci=1, bias=176%) correct=104, avg_wrong=38
    { old: "They increase hardenability by retarding the diffusion-controlled transformations (pearlite and bainite)",
      new: "Increase hardenability by retarding pearlite/bainite formation" },
    { old: "They increase the carbon content",
      new: "They directly increase the carbon content of the steel alloy" },
    { old: "They lower the melting point",
      new: "They lower the melting point of the steel significantly" },
    { old: "They eliminate the need for tempering after quenching",
      new: "They fully eliminate any need for tempering after quenching" },

    // u7-L2-Q22 (ci=0, bias=462%) correct=249, avg_wrong=44
    { old: "Precipitation of chromium carbides (Cr\u2082\u2083C\u2086) at grain boundaries in the 450-850\u00b0C range, depleting adjacent regions of chromium below the 10.5% needed for passivation. Prevented by using low-carbon grades (304L, 316L) or stabilized grades (321, 347).",
      new: "Cr carbide precipitation at grain boundaries depletes Cr below 10.5%" },
    { old: "Oxidation of the surface during heat treatment",
      new: "Oxidation of the surface during elevated-temperature heat treatment" },
    { old: "Absorption of nitrogen from the atmosphere",
      new: "Absorption of nitrogen from the surrounding furnace atmosphere" },
    { old: "Formation of sigma phase during rapid cooling",
      new: "Formation of brittle sigma phase during the rapid cooling stage" },

    // u7-L2-Q24 (ci=3, bias=386%) correct=170, avg_wrong=35
    { old: "Upper bainite has carbides between ferrite plates (lower toughness); lower bainite has carbides within ferrite plates (higher toughness). Both are stronger than pearlite.",
      new: "Upper: carbides between plates (less tough); lower: within plates (tougher)" },
    { old: "Upper bainite is FCC",
      new: "Upper bainite has a face-centered cubic crystal structure" },
    { old: "Upper bainite is harder than lower bainite",
      new: "Upper bainite is harder and tougher than lower bainite" },
    { old: "There is no difference — bainite is bainite",
      new: "There is no meaningful difference — bainite is always bainite" },

    // u7-L3-Q7 (ci=2, bias=46%) correct=59, avg_wrong=40
    { old: "Die casting produces parts with better dimensional accuracy",
      new: "Die casting gives better dimensional accuracy per part" },
    { old: "Die casting can produce larger parts",
      new: "Die casting can reliably produce significantly larger parts" },
    { old: "Die casting uses less energy per part",
      new: "Die casting uses significantly less energy per finished part" },

    // u7-L3-Q12 (ci=3, bias=301%) correct=186, avg_wrong=46
    { old: "Gas porosity — round, smooth-walled voids distributed throughout the casting. Shrinkage porosity — irregular, dendritic-shaped voids concentrated at last-to-solidify regions (hot spots).",
      new: "Gas: round smooth voids throughout; shrinkage: irregular voids at hot spots" },
    { old: "Gas porosity is caused by air entrapment during pouring",
      new: "Gas porosity is caused by air entrapment during the metal pouring" },
    { old: "Gas porosity occurs only at the surface",
      new: "Gas porosity occurs exclusively at the casting outer surface" },

    // u7-L3-Q14 (ci=2, bias=89%) correct=131, avg_wrong=69
    { old: "Inject wax pattern \u2192 attach to wax tree \u2192 build ceramic shell (repeated dipping) \u2192 melt out wax \u2192 pour metal \u2192 break shell \u2192 finish",
      new: "Wax pattern \u2192 ceramic shell \u2192 melt wax \u2192 pour metal \u2192 break shell" },

    // u7-L3-Q15 (ci=1, bias=121%) correct=138, avg_wrong=62
    { old: "Hot forging is performed above the recrystallization temperature (reducing forces and enabling large deformations without work hardening),",
      new: "Hot forging is above recrystallization temp — lower forces, no hardening" },

    // u7-L3-Q17 (ci=0, bias=64%) correct=88, avg_wrong=54
    { old: "The ratio of initial billet cross-sectional area to final extrudate cross-sectional area",
      new: "Ratio of initial billet area to final extrudate area" },
    { old: "The ratio of ram speed to extrusion speed",
      new: "The ratio of ram speed to the extrusion exit speed" },

    // u7-L3-Q22 (ci=0, bias=245%) correct=169, avg_wrong=49
    { old: "The gating system delivers molten metal from the ladle into the mold cavity in a controlled manner — components include pouring basin, sprue, runner, and gates (ingates)",
      new: "Delivers molten metal into mold cavity via sprue, runner, and gates" },
    { old: "The gating system holds the mold together",
      new: "The gating system mechanically holds the mold halves together" },
    { old: "The gating system removes gases from the mold",
      new: "The gating system removes trapped gases from inside the mold" },

    // u7-L3-Q26 (ci=2, bias=187%) correct=110, avg_wrong=38
    { old: "A shrink fit heats the outer part (or cools the inner part) to use thermal expansion/contraction for assembly,",
      new: "Shrink fit uses thermal expansion/contraction for assembly" },
    { old: "They are identical",
      new: "They are identical assembly methods with different names" },
    { old: "A press fit is permanent",
      new: "A press fit is always a permanent and irreversible assembly" },

    // u7-L4-Q7 (ci=2, bias=43%) correct=73, avg_wrong=51
    { old: "To cool the cutting zone (reducing thermal wear and workpiece distortion)",
      new: "To cool the cutting zone, reducing thermal wear and distortion" },

    // u7-L4-Q8 (ci=3, bias=223%) correct=83, avg_wrong=26
    { old: "Full slotting (full engagement) doubles the chip load and restricts chip evacuation",
      new: "Full slotting doubles chip load, restricts evacuation" },
    { old: "Risk of tool breakage",
      new: "Risk of premature tool breakage from excessive forces" },
    { old: "Risk of the workpiece melting",
      new: "Risk of the workpiece melting from excessive cutting heat" },
    { old: "Risk of poor surface finish",
      new: "Risk of poor surface finish due to excessive vibration" },

    // u7-L4-Q14 (ci=2, bias=100%) correct=100, avg_wrong=50
    { old: "Roughing maximizes material removal rate using high depth of cut and feed (accepting poorer finish),",
      new: "Roughing maximizes MRR with high depth/feed; finishing optimizes surface" },
    { old: "Roughing uses carbide tools and finishing uses HSS tools",
      new: "Roughing uses carbide tools and finishing always uses HSS tools" },

    // u7-L4-Q17 (ci=0, bias=89%) correct=109, avg_wrong=58
    { old: "Drill to 24.5 mm \u2192 bore to 24.9 mm \u2192 ream to 25H7. Each operation progressively improves accuracy and finish.",
      new: "Drill 24.5 mm \u2192 bore 24.9 mm \u2192 ream to 25H7 progressively" },

    // u7-L4-Q21 (ci=1, bias=187%) correct=203, avg_wrong=71
    { old: "3-axis has X/Y/Z linear axes; 4-axis adds one rotary axis (typically A); 5-axis adds two rotary axes (A and B or B and C), enabling machining of complex contoured surfaces and undercuts in a single setup",
      new: "3-axis: X/Y/Z linear; 4-axis adds one rotary; 5-axis adds two rotary" },

    // u7-L4-Q22 (ci=0, bias=390%) correct=173, avg_wrong=35
    { old: "Thermal expansion of the workpiece will cause dimensional errors beyond tolerance. Apply flood coolant, reduce cutting speed, or take lighter cuts to reduce heat generation.",
      new: "Thermal expansion causes dimensional errors — reduce heat input" },
    { old: "Hot chips are dangerous",
      new: "Hot chips pose a safety hazard to the machine operator" },
    { old: "The workpiece might melt — stop machining immediately",
      new: "The workpiece might melt — stop machining operations immediately" },
    { old: "High temperature is beneficial",
      new: "High temperature is actually beneficial for material removal" },

    // u7-L4-Q24 (ci=3, bias=97%) correct=84, avg_wrong=43
    { old: "The location of the part zero (program origin) relative to the machine home position",
      new: "The part zero (program origin) relative to machine home" },
    { old: "The type of cutting tool to be used",
      new: "The type of cutting tool to be used for that operation" },
    { old: "The spindle speed for the operation",
      new: "The spindle speed (RPM) for the specific machining operation" },

    // u7-L5-Q2 (ci=2, bias=522%) correct=253, avg_wrong=41
    { old: "Replace sharp internal corners with radii (\u22650.5 mm) to prevent stress concentration and improve flow; the deep narrow slot (15:1 aspect ratio) will be difficult to fill and eject — redesign as an assembly or use a side-action/EDM-cut feature in the mold",
      new: "Add corner radii and redesign the deep slot (hard to fill and eject)" },
    { old: "The design is fine for injection molding",
      new: "The current design is perfectly fine for injection molding" },
    { old: "Only the wall thickness needs to change",
      new: "Only the wall thickness needs to change for proper molding" },
    { old: "The whole part should be 3D printed instead",
      new: "The whole part should be 3D printed instead of injection molded" },

    // u7-L5-Q4 (ci=2, bias=164%) correct=230, avg_wrong=87
    { old: "Ask the designer what function drives this tolerance. If it's non-critical (clearance bore, no press fit, no sealing surface), propose relaxing to \u00b10.05 mm (achievable by boring) and show the cost savings. Document the rationale.",
      new: "Ask the designer the function; if non-critical, propose relaxing to \u00b10.05 mm" },
    { old: "Escalate to management — tolerance disputes should be resolved at a higher level to avoid conflict, assuming idealized boundary conditions that rarely exist in actual field installations",
      new: "Escalate to management — tolerance disputes need higher-level resolution" },

    // u7-L5-Q5 (ci=0, bias=260%) correct=156, avg_wrong=43
    { old: "SLA uses liquid photopolymer resin cured by UV laser and requires support structures for overhangs; SLS uses powdered polymers (or metals) sintered by laser",
      new: "SLA: UV-cured resin with supports; SLS: laser-sintered powder" },
    { old: "SLA and SLS use the same materials but different laser types,",
      new: "SLA and SLS use the same materials but different laser types" },
    { old: "SLS requires support structures",
      new: "SLS requires support structures for all overhanging features" },
    { old: "SLA can only produce transparent parts",
      new: "SLA can only produce transparent or translucent finished parts" },

    // u7-L5-Q7 (ci=2, bias=111%) correct=117, avg_wrong=55
    { old: "The inter-layer bond between deposited filament layers is weaker than the continuous extruded filament within a layer",
      new: "Inter-layer bond is weaker than continuous filament within a layer" },

    // u7-L5-Q8 (ci=3, bias=244%) correct=218, avg_wrong=63
    { old: "The stepped/terraced surface finish on curved and angled surfaces caused by the discrete layer thickness — minimized by using thinner layers, orienting surfaces vertically, or post-processing (sanding, vapor smoothing)",
      new: "Stepped surface on curves from discrete layers — fix with thinner layers" },
    { old: "The tendency for parts to warp upward at the corners, forming steps",
      new: "The tendency for parts to warp upward at the corners forming steps" },
    { old: "The increasing cost per unit as production volume increases",
      new: "The increasing per-unit cost as production volume scales upward" },

    // u7-L5-Q14 (ci=2, bias=35%) correct=93, avg_wrong=69
    { old: "K-factor defines the position of the neutral axis in a bend as a ratio of the sheet thickness",
      new: "K-factor locates the neutral axis in a bend as a thickness ratio" },

    // u7-L5-Q19 (ci=2, bias=44%) correct=80, avg_wrong=56
    { old: "Hot runners use heated manifolds to keep the plastic molten in the runner system",
      new: "Hot runners use heated manifolds to keep plastic molten" },
    { old: "Hot runners are simpler and cheaper than cold runners",
      new: "Hot runner systems are simpler and cheaper than cold runner systems" },

    // u7-L5-Q21 (ci=1, bias=128%) correct=158, avg_wrong=69
    { old: "Rapid melting and solidification of each layer creates severe thermal gradients that induce high residual stresses — enough to warp the part or cause cracking",
      new: "Severe thermal gradients from layer-by-layer melting cause residual stress" },

    // u7-L5-Q24 (ci=3, bias=38%) correct=47, avg_wrong=34
    { old: "Insufficient draft angle on the cavity surfaces",
      new: "Insufficient draft angle on cavity surfaces" },
    { old: "The injection pressure is too high",
      new: "The injection pressure is set too high for this mold" },

    // u7-L5-Q26 (ci=2, bias=82%) correct=74, avg_wrong=41
    { old: "FDM offers lower per-part cost at 50 units, no tooling, and design freedom",
      new: "FDM: lower per-part cost, no tooling, design freedom" },
    { old: "FDM is always better",
      new: "FDM is always the better manufacturing choice overall" },
    { old: "The only trade-off is surface finish",
      new: "The only trade-off is the final surface finish quality" },

    // u7-L6-Q10 (ci=0, bias=59%) correct=75, avg_wrong=47
    { old: "Angular distortion (V-shape) transverse to the weld and longitudinal bowing",
      new: "Angular distortion (V-shape) transverse to weld and bowing" },
    { old: "The plates bend upward uniformly",
      new: "The plates bend uniformly upward along the entire weld length" },

    // u7-L6-Q12 (ci=3, bias=48%) correct=69, avg_wrong=47
    { old: "Excessive voltage (long arc), incorrect wire feed speed (erratic arc)",
      new: "Excessive voltage (long arc) or incorrect wire feed speed" },

    // u7-L6-Q14 (ci=2, bias=38%) correct=76, avg_wrong=55
    { old: "A groove weld fills a prepared groove between members (butt joints, V-groove",
      new: "A groove weld fills a prepared groove between joined members" },

    // u7-L6-Q24 (ci=3, bias=162%) correct=96, avg_wrong=37
    { old: "Undercut is a groove melted into the base metal at the weld toe that is not filled by weld metal",
      new: "Undercut: groove melted at weld toe, not filled by weld metal" },
    { old: "They are the same defect with different names",
      new: "They are the same type of defect with different industry names" },
    { old: "Undercut is caused by too much filler",
      new: "Undercut is caused by using too much filler metal material" },
    { old: "Undercut is a surface defect",
      new: "Undercut is only a cosmetic surface defect, not structural" },

    // u7-L6-Q26 (ci=2, bias=63%) correct=78, avg_wrong=48
    { old: "A susceptible microstructure (hard martensite), sufficient diffusible hydrogen",
      new: "Susceptible microstructure (martensite), diffusible hydrogen" },
    { old: "Thin material, slow cooling, and low amperage",
      new: "Thin material, slow cooling rate, and low welding amperage" },
  ],
};

const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

// Apply fixes to each file
for (const [filename, fileFixes] of Object.entries(fixes)) {
  const file = baseDir + 'src/data/course/units/' + filename;
  let content = fs.readFileSync(file, 'utf8');
  let changeCount = 0;

  for (const fix of fileFixes) {
    if (fix.old === fix.new) continue; // skip no-ops

    // Try both quote styles
    const singleQuoted = "'" + fix.old + "'";
    const doubleQuoted = '"' + fix.old + '"';

    if (content.includes(singleQuoted)) {
      content = content.replace(singleQuoted, "'" + fix.new + "'");
      changeCount++;
    } else if (content.includes(doubleQuoted)) {
      content = content.replace(doubleQuoted, '"' + fix.new + '"');
      changeCount++;
    } else {
      console.log('WARNING: Not found in ' + filename + ': "' + fix.old.substring(0, 60) + '..."');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(filename + ': applied ' + changeCount + ' changes');
}

console.log('\nDone! Now re-running bias check...\n');
