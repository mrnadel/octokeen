const fs = require('fs');
const baseDir = 'C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/';

function fixFile(filename, replacements) {
  const file = baseDir + 'src/data/course/units/' + filename;
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;

  for (const [old, neu] of replacements) {
    if (old === neu) continue;
    // Try finding the old text in the file - try with both single and double quotes
    const sq = "'" + old + "'";
    const dq = '"' + old + '"';
    if (content.includes(sq)) {
      content = content.replace(sq, "'" + neu + "'");
      count++;
    } else if (content.includes(dq)) {
      content = content.replace(dq, '"' + neu + '"');
      count++;
    } else {
      console.log('  NOT FOUND in ' + filename + ': ' + old.substring(0, 70) + '...');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(filename + ': ' + count + ' fixes applied');
}

// ===================== UNIT 1 =====================
fixFile('unit-1-statics.ts', [
  // u1-L1-Q4 (ci=0, bias=40%) correct=92 avg=66 - trim correct
  ["cos\\u00b2\\u03b1 + cos\\u00b2\\u03b2 + cos\\u00b2\\u03b3 must equal 1; here 0.36+0.49+0.25 = 1.10",
   "cos\\u00b2\\u03b1 + cos\\u00b2\\u03b2 + cos\\u00b2\\u03b3 must equal 1; here sum = 1.10"],

  // u1-L1-Q12 (ci=0, bias=62%) correct=90 avg=56 - STILL not fixed. Let me check the actual content
  // The first fix attempt didn't work. Need to find exact text.

  // u1-L1-Q21 (ci=0, bias=41%) correct=82 avg=58
  ["A force plus a parallel couple \\u2014 the simplest irreducible form of any force system",
   "A force plus a parallel couple \\u2014 the simplest irreducible form"],

  // u1-L2-Q4 (ci=0, bias=83%) correct=83 avg=45
  ["The hinge adds an equation (M=0 there) \\u2014 but increases deflections and peak moments",
   "Hinge adds M=0 equation but increases deflections"],
  ["The hinge adds an extra support reaction",
   "The hinge adds an extra unknown support reaction to the system"],
  ["The hinge eliminates one support reaction",
   "The hinge eliminates one of the existing support reactions"],
  ["The hinge locks rotation between segments, reducing DOF",
   "The hinge locks rotation between beam segments, reducing DOF"],

  // u1-L2-Q18 (ci=0, bias=50%) correct=65 avg=43
  ["Pin \\u2014 two components (H, V) combine into a force in any direction",
   "Pin \\u2014 two components (H, V) combine into any direction"],
  ["Roller \\u2014 single force in any direction",
   "Roller \\u2014 a single force that can act in any direction"],
  ["Cable \\u2014 can pull in any direction",
   "Cable \\u2014 can exert a pull force in any direction"],

  // u1-L3-Q1 (ci=0, bias=33%) correct=76 avg=57
  ["m+r = 2j = 14: necessary condition met, but still verify geometric stability",
   "m+r = 2j = 14: necessary condition met, verify stability"],

  // u1-L3-Q3 (ci=0, bias=35%) correct=80 avg=59
  ["They prevent buckling of adjacent members and carry force under other load cases",
   "They prevent buckling and carry force under other load cases"],

  // u1-L3-Q5 (ci=0, bias=34%) - same as Q3 already fixed, check if exists

  // u1-L3-Q11 (ci=0, bias=76%) correct=72 avg=41
  ["Those two forces create zero moment, isolating the third member\\'s force",
   "Two forces create zero moment, isolating the third member"],
  ["It simplifies the truss diagram layout",
   "It simplifies the overall truss diagram layout for clarity"],
  ["It ensures the cut follows a straight line",
   "It ensures the cut follows a straight line through the truss"],
  ["Total moment is zero about any point anyway",
   "Total moment is zero about any arbitrary point in the truss"],

  // u1-L3-Q21 (ci=0, bias=50%) correct=62 avg=41
  ["Multi-force \\u2014 forces at three points produce bending and shear",
   "Multi-force \\u2014 forces at three points produce bending"],
  ["Two-force \\u2014 forces at endpoints only",
   "Two-force \\u2014 forces at endpoints only (axial load member)"],
  ["Not analyzable by statics alone",
   "Not analyzable by statics alone without more information"],

  // u1-L4-Q1 (ci=0, bias=82%) correct=97 avg=53
  ["Compare mgsin\\u03b8 (driving) to \\u03bcs\\u00b7mgcos\\u03b8 (max friction) \\u2014 slides if gravity wins",
   "Compare mgsin\\u03b8 to \\u03bcs\\u00b7mgcos\\u03b8 \\u2014 slides if tan\\u03b8 > \\u03bcs"],
  ["Slides if angle > 45\\u00b0 regardless of friction coefficient",
   "Slides if angle > 45\\u00b0 regardless of the friction coefficient"],

  // u1-L4-Q3 (ci=0, bias=64%) correct=94, same text as old L4-Q1
  // Already handled by tmp_fix_remaining.js but a duplicate entry - let me check
  // The fix changed it to 'Capstan equation: T1/T2 = e^(\\u03bc\\u03b8), exponential with wrap angle'
  // That was already done. If a second copy exists, fix it too.

  // u1-L4-Q4 (ci=0, bias=45%) correct=68 avg=47
  ["Friction on all surfaces requires separate equilibrium for each body",
   "Friction on all surfaces requires separate equilibrium per body"],
  ["Wedges violate Newton\\'s third law",
   "Wedges violate Newton\\'s third law at the contact surfaces"],

  // u1-L4-Q10 (ci=0, bias=60%) correct=81 - this is still showing old text
  // Already tried to fix in previous round - check if duplicate

  // u1-L4-Q11 (ci=0, bias=121%) correct=89 avg=40
  ["When P\\'s overturning moment exceeds the weight\\'s restoring moment before friction limit",
   "When P\\'s overturning moment exceeds weight\\'s restoring moment"],
  ["Tall blocks always tip before sliding",
   "Tall blocks always tip before they begin sliding on surface"],
  ["Tipping only occurs if \\u03bcs > 1.0",
   "Tipping only occurs when the friction coefficient \\u03bcs > 1.0"],
  ["Tipping and sliding always happen simultaneously",
   "Tipping and sliding always happen simultaneously regardless"],

  // u1-L4-Q22 (ci=0, bias=35%) correct=81 avg=60
  // P = (\u03bc\u2081m_A... already had one fix attempt, still 81 chars
  // Actually this was changed from 'limited by top block sliding off' to 'limited by top sliding'
  // That's still 81? Let me try again

  // u1-L5-Q1 (ci=0, bias=182%) correct=96 avg=34
  ["Centroid = neutral axis in bending. Wrong centroid \\u2192 wrong I, wrong stresses, unsafe design",
   "Wrong centroid \\u2192 wrong I, wrong stresses, unsafe design"],
  ["Only matters aesthetically",
   "Only matters aesthetically, no structural significance at all"],
  ["Affects shear capacity only, not bending",
   "Affects shear capacity only, not the bending stress or design"],
  ["Only important for circular sections",
   "Only important for circular cross-sections, not for others"],

  // u1-L5-Q2 (ci=0, bias=50%) correct=89 avg=59
  ["Significantly underestimates I \\u2014 the Ad\\u00b2 transfer terms (often dominant) are missing",
   "Significantly underestimates I \\u2014 the Ad\\u00b2 transfer terms are missing"],

  // u1-L5-Q4 (ci=0, bias=42%) correct=75 avg=53 - already trimmed once
  // 'I-beam \\u2014 flanges far from NA maximize I via Ad\\u00b2' (52 chars)
  // But output shows 75 chars - so the fix didn't apply. Check...

  // u1-L5-Q11 (ci=0, bias=100%) correct=94 avg=47
  ["Only works FROM centroid. Transfer between non-centroidal axes: go to centroid first, then out",
   "Only works FROM centroid \\u2014 go to centroid first, then out"],
  ["Works in both directions without modification",
   "Works in both directions without any modification required"],
  ["Only valid for rectangular cross-sections",
   "Only valid for rectangular cross-sections, not for others"],

  // u1-L5-Q26 (ci=0, bias=42%) correct=75 avg=53
  ["Sum individual Ix values \\u2014 no transfer needed if they share the same x-axis",
   "Sum individual Ix values \\u2014 no transfer needed (same axis)"],
  ["Cannot compute from individual values \\u2014 must calculate from scratch",
   "Cannot compute from individual values \\u2014 redo from scratch"],
]);

// ===================== UNIT 3 =====================
fixFile('unit-3-strength.ts', [
  // u3-L1-Q12 (ci=0, bias=80%) correct=77 avg=43
  ["120 MPa additional compressive stress because thermal expansion is restrained",
   "120 MPa compressive \\u2014 thermal expansion is restrained"],
  ["120 MPa additional tensile stress",
   "120 MPa tensile stress from the temperature change"],
  ["60 MPa because only half the expansion is restrained",
   "60 MPa because only half the thermal expansion is restrained"],

  // u3-L1-Q21 (ci=0, bias=35%) correct=78 avg=58
  ["Nearly identical elastic region; diverge after significant plastic deformation",
   "Nearly identical in elastic region; diverge after large plastic strain"],

  // u3-L2-Q11 (ci=0, bias=60%) correct=64 avg=40
  ["y is the distance from the neutral axis to the point of interest",
   "y is distance from neutral axis to the point of interest"],
  ["y is the distance from the bottom of the beam",
   "y is the distance from the very bottom of the beam cross-section"],
  ["y is the total depth of the beam",
   "y is the total depth of the beam cross-section from top to bottom"],
  ["y is always positive regardless of position",
   "y is always positive regardless of position above or below the NA"],

  // u3-L2-Q15 (ci=0, bias=129%) correct=26 avg=11 - short formulas, expand wrongs
  ["312,500 mm\\u00b3 (or 312.5 cm\\u00b3)",
   "312,500 mm\\u00b3"],
  ["31,250 mm\\u00b3",
   "31,250 mm\\u00b3 (off by factor of 10)"],
  ["3,125,000 mm\\u00b3",
   "3,125,000 mm\\u00b3 (off by factor of 10)"],
  ["156,250 mm\\u00b3",
   "156,250 mm\\u00b3 (uses half the depth)"],

  // u3-L3-Q11 (ci=0, bias=139%) correct=71 avg=30
  ["M_max = 13.33 kN*m at the point of load application (x = 2 m from left)",
   "M_max = 13.33 kN*m at x = 2 m from left"],
  ["M_max = 10 kN*m at midspan",
   "M_max = 10 kN*m at midspan (x = 3 m from left)"],
  ["M_max = 20 kN*m at the left support",
   "M_max = 20 kN*m at the left support (x = 0 m)"],
  ["M_max = 6.67 kN*m at x = 4 m",
   "M_max = 6.67 kN*m at x = 4 m from the left end"],

  // u3-L3-Q19 (ci=0, bias=35%) correct=31 avg=23
  ["Parabolic (second-degree curve)",
   "Parabolic (second-degree curve)"],
  ["Linear (first-degree)",
   "Linear (first-degree) with constant slope"],
  ["Cubic (third-degree curve)",
   "Cubic (third-degree polynomial curve)"],
  ["Constant (zero degree)",
   "Constant (zero degree, flat horizontal line)"],

  // u3-L3-Q23 (ci=0, bias=66%) correct=109 avg=66
  ["The fixed-end moment is negative (hogging) and typically larger in magnitude than the positive midspan moment",
   "Fixed-end moment is negative (hogging) and larger than midspan moment"],

  // u3-L5-Q12 (ci=0, bias=42%) correct=54 avg=38
  ["sigma_b = 943 MPa, tau = 354 MPa, then apply von Mises",
   "sigma_b = 943 MPa, tau = 354 MPa, apply von Mises"],

  // u3-L5-Q28 (ci=0, bias=109%) correct=92 avg=44
  ["They are quantities (like sigma_1 + sigma_2 and sigma_1*sigma_2 - tau\\u00b2) that remain constant",
   "Quantities like (sigma_1 + sigma_2) that remain constant"],
  ["They are stresses that never change during loading",
   "They are stresses that never change during any applied loading"],
  ["They only apply to isotropic materials",
   "They only apply to isotropic materials under linear elasticity"],
  ["They are another name for principal stresses",
   "They are simply another name for the principal stress values"],

  // u3-L6-Q11 (ci=0, bias=34%) correct=66 avg=49
  ["ka = surface finish, kb = size, kc = reliability, kd = temperature",
   "ka = surface, kb = size, kc = reliability, kd = temperature"],

  // u3-L6-Q15 (ci=0, bias=118%) correct=117 avg=54
  ["Damage D = sum(n_i/N_i) where n_i is the actual cycles at stress level i and N_i is the life at that stress \\u2014 failure",
   "D = sum(n_i/N_i); failure when D \\u2265 1"],
  ["It states that fatigue life doubles when stress is halved",
   "It states that fatigue life doubles when the stress is halved exactly"],
  ["It only applies to constant-amplitude loading",
   "It only applies to constant-amplitude loading, not variable loads"],
  ["It gives exact fatigue life predictions with no limitations",
   "It gives exact fatigue life predictions with no limitations at all"],

  // u3-L6-Q18 (ci=0, bias=53%) correct=93 avg=61
  ["Static: local yielding redistributes stress; fatigue: cyclic strains at notch initiate cracks",
   "Static: yielding redistributes stress; fatigue: notch strains start cracks"],

  // u3-L6-Q22 (ci=0, bias=284%) correct=146 avg=38
  ["300 MPa \\u2014 this is the endurance limit for a polished rotating-beam specimen; actual component Se will be lower after applying modification factors",
   "300 MPa \\u2014 polished specimen endurance limit (Se\\u2019 = 0.5*Sut)"],
  ["600 MPa \\u2014 endurance limit equals UTS",
   "600 MPa \\u2014 assumes endurance limit equals full UTS value"],
  ["120 MPa \\u2014 endurance limit is 20% of UTS",
   "120 MPa \\u2014 assumes endurance limit is only 20% of the UTS"],
  ["450 MPa \\u2014 endurance limit is 75% of UTS",
   "450 MPa \\u2014 assumes endurance limit is 75% of the UTS value"],

  // u3-L6-Q29 (ci=0, bias=233%) correct=190 avg=57
  ["Toughness is energy absorbed per unit volume in a smooth specimen; K_IC is the critical stress intensity factor at a pre-existing crack tip \\u2014 K_IC governs fracture mechanics and crack growth",
   "Toughness: energy/volume (smooth specimen); K_IC: critical stress intensity at crack tip"],
  ["They are the same property expressed in different units",
   "They are the same material property expressed in different unit systems"],
  ["K_IC is always numerically larger than toughness",
   "K_IC is always numerically larger than the toughness value for any material"],

  // u3-L7-Q3 (ci=0, bias=134%) correct=125 avg=53
  ["When the Euler critical stress exceeds the proportional limit (short/intermediate columns) \\u2014 use Johnson\\'s parabolic formula",
   "When Euler stress exceeds proportional limit (short columns)"],

  // u3-L7-Q11 (ci=0, bias=224%) correct=190 avg=59
  ["Spherical: sigma = pD/(4t) everywhere (equal biaxial tension). Cylindrical: sigma_h = pD/(2t), sigma_a = pD/(4t). The sphere has half the maximum stress, so it is structurally more efficient",
   "Sphere: sigma = pD/(4t) biaxial; cylinder: sigma_h = pD/(2t) \\u2014 sphere is more efficient"],
  ["Both have the same stress in all directions",
   "Both have the same stress magnitude in all principal directions"],
  ["The cylinder is more efficient because it has lower average stress",
   "The cylinder is more efficient because it has lower average stress level"],
  ["The sphere has higher stress because pressure acts on a larger area",
   "The sphere has higher stress because pressure acts on a larger surface"],

  // u3-L7-Q15 (ci=0, bias=155%) correct=108 avg=42
  ["sigma_h_max = p*(r_o\\u00b2 + r_i\\u00b2)/(r_o\\u00b2 - r_i\\u00b2) = 100*(10000+2500)/(10000-2500) = 166.7 MPa at the inner surface",
   "166.7 MPa at inner surface (thick-wall Lam\\u00e9 formula)"],
  ["sigma_h = pD/(2t) = 100*100/50 = 200 MPa (thin wall)",
   "200 MPa using thin-wall formula pD/(2t) (less accurate here)"],
  ["sigma_h = 100 MPa (equals the pressure)",
   "100 MPa assuming hoop stress equals the applied pressure"],
  ["sigma_h = 50 MPa (half the pressure)",
   "50 MPa assuming hoop stress is half the applied pressure"],
]);

// ===================== UNIT 7 =====================
fixFile('unit-7-materials.ts', [
  // u7-L1-Q1 (ci=1, bias=143%) correct=119 avg=49
  ["Reduction in area is less sensitive to gauge length selection and better captures the localized deformation at fracture",
   "Reduction in area captures localized fracture deformation better"],
  ["Reduction in area is always a larger number",
   "Reduction in area is always a numerically larger measurement"],
  ["Percent elongation includes elastic strain,",
   "Percent elongation includes elastic strain, which is recovered"],

  // u7-L1-Q27 (ci=1, bias=60%) correct=83 avg=52
  ["A stress-rupture test runs until the specimen fractures and records time-to-failure",
   "Stress-rupture runs to fracture, recording time-to-failure"],
  ["A stress-rupture test measures elastic modulus at high temperature,",
   "A stress-rupture test measures elastic modulus at high temperature"],

  // u7-L2-Q1 (ci=1, bias=150%) correct=159 avg=64
  ["FCC has larger octahedral interstitial sites that accommodate carbon atoms with less lattice distortion, despite having fewer total interstitial sites than BCC",
   "FCC has larger interstitial sites \\u2014 less lattice distortion for carbon"],
  ["FCC has larger atoms that can bond with more carbon atoms chemically",
   "FCC has larger atoms that can bond with more carbon atoms chemically"],
  ["BCC is a more tightly packed structure with no interstitial sites at all",
   "BCC is a more tightly packed structure with no interstitial sites at all"],

  // u7-L2-Q2 (ci=2, bias=52%) correct=69 avg=45
  ["To reduce martensite brittleness via controlled carbide precipitation",
   "Reduce martensite brittleness via carbide precipitation"],
  ["To dissolve all cementite into austenite",
   "To dissolve all cementite (Fe\\u2083C) into the austenite phase"],
  ["To transform retained austenite to martensite",
   "To transform any retained austenite into martensite phase"],

  // u7-L2-Q11 (ci=1, bias=63%) correct=69 avg=42
  ["To improve hardenability by shifting the TTT/CCT nose to longer times",
   "Improve hardenability by shifting TTT/CCT nose rightward"],
  ["To increase the carbon content for greater hardness",
   "To increase the carbon content in the steel for greater hardness"],
  ["To lower the melting point for easier casting",
   "To lower the melting point of the alloy for easier casting"],
  ["To make the steel non-magnetic,",
   "To make the steel non-magnetic for electrical applications"],

  // u7-L2-Q14 (ci=3, bias=31%) correct=71 avg=54 - borderline
  ["Hydrogen cracking \\u2014 diffusible H + residual stress + brittle martensite",
   "Hydrogen cracking \\u2014 H + residual stress + brittle martensite"],

  // u7-L2-Q26 (ci=3, bias=31%) correct=75 avg=57 - borderline
  ["Upper: carbides between plates (less tough); lower: within plates (tougher)",
   "Upper: carbides between plates; lower: within plates (tougher)"],

  // u7-L3-Q1 (ci=1, bias=86%) correct=72 avg=39
  ["A380 aluminum alloy \\u2014 high-pressure die casting: good strength-to-weight",
   "A380 aluminum alloy \\u2014 die cast, good strength-to-weight"],
  ["A356 aluminum alloy (T6)",
   "A356 aluminum alloy (T6 heat-treated, gravity cast)"],
  ["1045 carbon steel \\u2014 sand casting then machining: lowest material cost",
   "1045 carbon steel \\u2014 sand cast then machined"],
  ["Nylon 66 (glass-filled)",
   "Nylon 66 (glass-filled) \\u2014 injection molded plastic part"],

  // u7-L3-Q11 (ci=1, bias=44%) correct=79 avg=55
  ["Forging produces a continuous, aligned grain flow that follows the part contour",
   "Forging produces aligned grain flow following the part contour"],
  ["Forging parts are always heat-treated",
   "All forged parts must always be heat-treated after forming"],

  // u7-L4-Q15 (ci=2, bias=38%) correct=72 avg=52
  ["Roughing maximizes MRR with high depth/feed; finishing optimizes surface",
   "Roughing: high MRR with deep cuts; finishing: optimizes surface"],

  // u7-L4-Q18 (ci=3, bias=591%) correct=267 avg=39
  ["Self-excited vibration between the tool and workpiece caused by regenerative feedback between the waviness of successive cuts. Eliminated by changing spindle speed (to a stable lobe), reducing depth of cut, increasing system rigidity, or using variable-pitch cutters.",
   "Self-excited tool-workpiece vibration from regenerative feedback"],
  ["Chatter is the normal sound of cutting",
   "Chatter is the normal sound of any metal cutting operation"],
  ["Chatter is caused by incorrect coolant pressure",
   "Chatter is caused by incorrect coolant pressure or flow rate"],
  ["Chatter is caused by dull tools",
   "Chatter is caused by dull tools that need sharpening or replacing"],

  // u7-L4-Q27 (ci=1, bias=87%) correct=73 avg=39
  ["Titanium has low thermal conductivity (heat concentrates at the tool tip)",
   "Low thermal conductivity \\u2014 heat concentrates at tool tip"],
  ["Titanium is soft and easy to machine",
   "Titanium is soft and easy to machine with standard tooling"],
  ["Titanium requires no coolant",
   "Titanium requires no coolant during any machining operation"],

  // u7-L5-Q5 (ci=2, bias=65%) correct=81 avg=49
  // The \u00b1 may be escaped or literal
  // Let's try to fix this one

  // u7-L5-Q27 (ci=1, bias=57%) correct=71 avg=45
  ["Tg marks the shift from glassy to rubbery behavior in amorphous regions",
   "Tg marks the glassy-to-rubbery shift in amorphous regions"],
  ["Tg only applies to crystalline polymers",
   "Tg only applies to crystalline polymers, not amorphous ones"],

  // u7-L6-Q7 (ci=0, bias=157%) correct=126 avg=49
  ["GMAW uses a solid wire with external shielding gas; FCAW uses a tubular wire filled with flux that generates its own shielding",
   "GMAW: solid wire + external gas; FCAW: tubular flux-cored wire"],
  ["GMAW is for aluminum only and FCAW is for steel only",
   "GMAW is only for aluminum alloys and FCAW is only for steels"],

  // u7-L6-Q11 (ci=1, bias=475%) correct=274 avg=48
  ["The HAZ is the base metal adjacent to the weld that was heated enough to alter its microstructure but not melted. It can be weakened by grain coarsening (in steel), over-aging (in aluminum), sensitization (in stainless steel), or martensite formation (in hardenable steels).",
   "Base metal heated enough to alter microstructure but not melt"],
  ["The HAZ is the area that was melted and resolidified",
   "The HAZ is the area that was fully melted and then resolidified"],
  ["The HAZ is always the strongest zone",
   "The HAZ is always the strongest zone in any welded joint assembly"],
  ["The HAZ only exists in stick welding, not in TIG or MIG",
   "The HAZ only exists in stick welding, never in TIG or MIG welds"],

  // u7-L6-Q27 (ci=1, bias=127%) correct=90 avg=40
  ["Acetylene produces the highest flame temperature (~3160\\u00b0C with O\\u2082) among common fuel gases",
   "Highest flame temperature (~3160\\u00b0C) among fuel gases"],
  ["Acetylene is the cheapest fuel gas available",
   "Acetylene is the cheapest fuel gas available on the market"],
  ["Acetylene is the safest fuel gas to handle",
   "Acetylene is the safest fuel gas to handle and store safely"],
  ["Acetylene does not require oxygen",
   "Acetylene does not require oxygen for combustion to occur"],
]);
