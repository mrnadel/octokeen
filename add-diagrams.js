const fs = require('fs');

// Load SVG data
const svgs = JSON.parse(fs.readFileSync('svgs-extracted.json', 'utf8'));

// Define question-to-SVG mappings for each unit
// Unit 1: Statics & Equilibrium
const unit1Mappings = {
  // L1: Force Systems & Resultants
  'u1-L1-Q2': 'Free Body Diagram',
  'u1-L1-Q3': 'Beam with Force Arrows',
  'u1-L1-Q4': 'Free Body Diagram',
  'u1-L1-Q5': 'Beam with Force Arrows',
  'u1-L1-Q6': 'Beam with Force Arrows',
  'u1-L1-Q8': 'Free Body Diagram',
  'u1-L1-Q9': 'Beam with Force Arrows',
  'u1-L1-Q11': 'Free Body Diagram',
  'u1-L1-Q12': 'Beam with Force Arrows',
  'u1-L1-Q13': 'Beam with Force Arrows',
  'u1-L1-Q17': 'Beam with Force Arrows',
  'u1-L1-Q18': 'Free Body Diagram',
  'u1-L1-Q19': 'Free Body Diagram',
  'u1-L1-Q23': 'Free Body Diagram',
  'u1-L1-Q25': 'Cantilever Beam',
  'u1-L1-Q26': 'Beam with Force Arrows',
  'u1-L1-Q27': 'Beam with Force Arrows',
  'u1-L1-Q30': 'Beam with Force Arrows',
  // L2: Free Body Diagrams
  'u1-L2-Q2': 'Free Body Diagram',
  'u1-L2-Q3': 'Beam with Force Arrows',
  'u1-L2-Q4': 'Beam with Force Arrows',
  'u1-L2-Q6': 'Cantilever Beam',
  'u1-L2-Q7': 'Pin Joint',
  'u1-L2-Q8': 'Free Body Diagram',
  'u1-L2-Q9': 'Free Body Diagram',
  'u1-L2-Q10': 'Beam with Force Arrows',
  'u1-L2-Q11': 'Beam with Force Arrows',
  'u1-L2-Q12': 'Free Body Diagram',
  'u1-L2-Q14': 'Beam with Force Arrows',
  'u1-L2-Q15': 'Free Body Diagram',
  'u1-L2-Q17': 'Free Body Diagram',
  'u1-L2-Q20': 'Beam with Force Arrows',
  'u1-L2-Q21': 'Shear Moment Diagram',
  'u1-L2-Q26': 'Beam with Force Arrows',
  'u1-L2-Q28': 'Balance Scale',
  'u1-L2-Q30': 'Pin Joint',
  // L3: Trusses & Frames
  'u1-L3-Q2': 'Truss Bridge',
  'u1-L3-Q3': 'Truss Bridge',
  'u1-L3-Q4': 'Truss Bridge',
  'u1-L3-Q5': 'Truss Bridge',
  'u1-L3-Q6': 'Truss Bridge',
  'u1-L3-Q8': 'Truss Bridge',
  'u1-L3-Q9': 'Truss Bridge',
  'u1-L3-Q11': 'Truss Bridge',
  'u1-L3-Q12': 'Truss Bridge',
  'u1-L3-Q14': 'Truss Bridge',
  'u1-L3-Q15': 'Free Body Diagram',
  'u1-L3-Q19': 'Truss Bridge',
  'u1-L3-Q20': 'Pin Joint',
  'u1-L3-Q22': 'Truss Bridge',
  'u1-L3-Q24': 'Truss Bridge',
  'u1-L3-Q26': 'Truss Bridge',
  'u1-L3-Q27': 'Truss Bridge',
  'u1-L3-Q30': 'Truss Bridge',
  // L4: Friction & Wedges
  'u1-L4-Q2': 'Screw Jack',
  'u1-L4-Q3': 'Capstan Equation',
  'u1-L4-Q4': 'Toggle Clamp',
  'u1-L4-Q5': 'Ball on Incline',
  'u1-L4-Q8': 'Free Body Diagram',
  'u1-L4-Q9': 'Ball on Incline',
  'u1-L4-Q10': 'Toggle Clamp',
  'u1-L4-Q11': 'Free Body Diagram',
  'u1-L4-Q15': 'Screw Jack',
  'u1-L4-Q17': 'Ball on Incline',
  'u1-L4-Q20': 'Free Body Diagram',
  'u1-L4-Q22': 'Free Body Diagram',
  'u1-L4-Q24': 'Belt-Pulley',
  'u1-L4-Q27': 'Brake Disc',
  'u1-L4-Q29': 'Toggle Clamp',
  'u1-L4-Q30': 'Capstan Equation',
  // L5: Centroids & Moments of Inertia
  'u1-L5-Q1': 'Beam with Force Arrows',
  'u1-L5-Q2': 'Moment of Inertia',
  'u1-L5-Q3': 'Moment of Inertia',
  'u1-L5-Q4': 'Cantilever Beam',
  'u1-L5-Q6': 'Column Buckling',
  'u1-L5-Q7': 'Moment of Inertia',
  'u1-L5-Q9': 'Moment of Inertia',
  'u1-L5-Q11': 'Parallel Axis',
  'u1-L5-Q12': 'Moment of Inertia',
  'u1-L5-Q15': 'Moment of Inertia',
  'u1-L5-Q17': 'Moment of Inertia',
  'u1-L5-Q19': 'Moment of Inertia',
  'u1-L5-Q20': 'Moment of Inertia',
  'u1-L5-Q21': 'Torsion',
  'u1-L5-Q25': 'Beam with Force Arrows',
  'u1-L5-Q27': 'Flexural Rigidity',
  'u1-L5-Q29': 'Moment of Inertia',
};

// Unit 2: Dynamics & Kinematics
const unit2Mappings = {
  // L1: Particle Kinematics
  'u2-L1-Q1': 'Ball on Incline',
  'u2-L1-Q2': 'Projectile',
  'u2-L1-Q3': 'Projectile',
  'u2-L1-Q4': 'Rotating Flywheel',
  'u2-L1-Q5': 'Projectile',
  'u2-L1-Q7': 'Ball on Incline',
  'u2-L1-Q8': 'Ball on Incline',
  'u2-L1-Q9': 'Pendulum',
  'u2-L1-Q11': 'Projectile',
  'u2-L1-Q12': 'Rotating Flywheel',
  'u2-L1-Q15': 'Rotating Flywheel',
  'u2-L1-Q16': 'Projectile',
  'u2-L1-Q17': 'Ball on Incline',
  'u2-L1-Q18': 'Rotating Flywheel',
  'u2-L1-Q19': 'Ball on Incline',
  'u2-L1-Q21': 'Spring-Mass System',
  'u2-L1-Q22': 'Vibration Isolation',
  'u2-L1-Q24': 'Rotating Flywheel',
  'u2-L1-Q25': 'Ball on Incline',
  'u2-L1-Q26': 'Rotating Flywheel',
  'u2-L1-Q29': 'Projectile',
  'u2-L1-Q30': 'Ball on Incline',
  // L2: Newton's Laws
  'u2-L2-Q1': 'Free Body Diagram',
  'u2-L2-Q2': 'Pulley System',
  'u2-L2-Q3': 'Ball on Incline',
  'u2-L2-Q4': 'Rotating Flywheel',
  'u2-L2-Q5': 'Spring-Mass System',
  'u2-L2-Q6': 'Rotating Flywheel',
  'u2-L2-Q8': 'Free Body Diagram',
  'u2-L2-Q9': 'Free Body Diagram',
  'u2-L2-Q10': 'Ball on Incline',
  'u2-L2-Q12': 'Pendulum',
  'u2-L2-Q13': 'Ball on Incline',
  'u2-L2-Q15': 'Ball on Incline',
  'u2-L2-Q16': 'Ball on Incline',
  'u2-L2-Q17': 'Spring-Mass System',
  'u2-L2-Q18': 'Free Body Diagram',
  'u2-L2-Q21': 'Ball on Incline',
  'u2-L2-Q22': 'Centrifuge',
  'u2-L2-Q24': 'Pulley System',
  'u2-L2-Q25': 'Belt-Pulley',
  'u2-L2-Q27': 'Rotating Flywheel',
  'u2-L2-Q28': 'Pulley System',
  'u2-L2-Q29': 'Spring-Mass System',
  'u2-L2-Q30': 'Ball on Incline',
  // L3: Work, Energy & Power
  'u2-L3-Q1': 'Work-Energy Theorem',
  'u2-L3-Q2': 'Spring-Mass System',
  'u2-L3-Q3': 'Work-Energy Theorem',
  'u2-L3-Q4': 'Pulley System',
  'u2-L3-Q5': 'Ball on Incline',
  'u2-L3-Q7': 'Ball on Incline',
  'u2-L3-Q9': 'Rotating Flywheel',
  'u2-L3-Q10': 'Free Body Diagram',
  'u2-L3-Q11': 'Potential Energy',
  'u2-L3-Q12': 'Ball on Incline',
  'u2-L3-Q15': 'Work-Energy Theorem',
  'u2-L3-Q17': 'Pulley System',
  'u2-L3-Q18': 'Spring-Mass System',
  'u2-L3-Q19': 'Gear Pair',
  'u2-L3-Q22': 'Ball on Incline',
  'u2-L3-Q24': 'Spring-Mass System',
  'u2-L3-Q25': 'Ball on Incline',
  'u2-L3-Q27': 'Potential Energy',
  'u2-L3-Q28': 'Ball on Incline',
  'u2-L3-Q29': 'Gear Pair',
  // L4: Impulse & Momentum
  'u2-L4-Q1': "D'Alembert Principle",
  'u2-L4-Q3': 'Ball on Incline',
  'u2-L4-Q4': 'Ball on Incline',
  'u2-L4-Q5': 'Ball on Incline',
  'u2-L4-Q7': 'Ball on Incline',
  'u2-L4-Q8': 'Pendulum',
  'u2-L4-Q9': 'Ball on Incline',
  'u2-L4-Q10': 'Projectile',
  'u2-L4-Q12': 'Ball on Incline',
  'u2-L4-Q14': 'Ball on Incline',
  'u2-L4-Q15': 'Projectile',
  'u2-L4-Q17': 'Ball on Incline',
  'u2-L4-Q19': 'Belt-Pulley',
  'u2-L4-Q21': 'Ball on Incline',
  'u2-L4-Q22': 'Projectile',
  'u2-L4-Q24': 'Pendulum',
  'u2-L4-Q27': 'Ball on Incline',
  'u2-L4-Q28': "D'Alembert Principle",
  'u2-L4-Q30': 'Projectile',
  // L5: Rotational Dynamics
  'u2-L5-Q1': 'Rotating Flywheel',
  'u2-L5-Q2': 'Ball on Incline',
  'u2-L5-Q3': 'Rotating Flywheel',
  'u2-L5-Q5': 'Gyroscope',
  'u2-L5-Q6': 'Rotating Flywheel',
  'u2-L5-Q7': 'Parallel Axis',
  'u2-L5-Q8': 'Angular Momentum',
  'u2-L5-Q9': 'Moment of Inertia',
  'u2-L5-Q10': 'Rotating Flywheel',
  'u2-L5-Q11': 'Ball on Incline',
  'u2-L5-Q12': 'Pulley System',
  'u2-L5-Q15': 'Angular Momentum',
  'u2-L5-Q17': 'Rotating Flywheel',
  'u2-L5-Q20': 'Moment of Inertia',
  'u2-L5-Q21': 'Rotating Flywheel',
  'u2-L5-Q22': 'Gear Pair',
  'u2-L5-Q25': 'Gyroscope',
  'u2-L5-Q26': 'Ball on Incline',
  'u2-L5-Q27': 'Angular Momentum',
  'u2-L5-Q28': 'Parallel Axis',
  'u2-L5-Q29': 'Rotating Flywheel',
  // L6: Free & Forced Vibration
  'u2-L6-Q1': 'Spring-Mass System',
  'u2-L6-Q2': 'Damper',
  'u2-L6-Q3': 'Vibration Isolation',
  'u2-L6-Q4': 'Vibration Isolation',
  'u2-L6-Q5': 'Vibration Isolation',
  'u2-L6-Q8': 'Damper',
  'u2-L6-Q9': 'Damper',
  'u2-L6-Q10': 'Spring-Mass System',
  'u2-L6-Q11': 'Damper',
  'u2-L6-Q14': 'Vibration Isolation',
  'u2-L6-Q15': 'Vibration Isolation',
  'u2-L6-Q16': 'Spring-Mass System',
  'u2-L6-Q17': 'Damper',
  'u2-L6-Q19': 'Vibration Isolation',
  'u2-L6-Q20': 'Spring-Mass System',
  'u2-L6-Q21': 'Vibration Isolation',
  'u2-L6-Q22': 'Spring-Mass System',
  'u2-L6-Q24': 'Vibration Isolation',
  'u2-L6-Q25': 'Rotating Flywheel',
  'u2-L6-Q27': 'Spring-Mass System',
  'u2-L6-Q28': 'Vibration Isolation',
  'u2-L6-Q30': 'Vibration Isolation',
};

// Unit 3: Strength of Materials
const unit3Mappings = {
  // L1: Stress & Strain Fundamentals
  'u3-L1-Q1': 'Tensile Specimen',
  'u3-L1-Q2': 'Poisson Ratio',
  'u3-L1-Q6': 'Stress-Strain Curve',
  'u3-L1-Q7': 'Tensile Specimen',
  'u3-L1-Q8': 'Tensile Specimen',
  'u3-L1-Q9': 'Elastic Modulus',
  'u3-L1-Q10': 'Stress-Strain Curve',
  'u3-L1-Q11': 'Tensile Specimen',
  'u3-L1-Q12': 'Bolted Joint',
  'u3-L1-Q13': 'Stress-Strain Curve',
  'u3-L1-Q14': 'Stress-Strain Curve',
  'u3-L1-Q15': 'Pin Joint',
  'u3-L1-Q16': 'Stress-Strain Curve',
  'u3-L1-Q17': 'Elastic Modulus',
  'u3-L1-Q19': 'Stress-Strain Curve',
  'u3-L1-Q20': 'Stress Concentration',
  'u3-L1-Q22': 'Poisson Ratio',
  'u3-L1-Q23': 'Tensile Specimen',
  'u3-L1-Q25': 'Bolted Joint',
  'u3-L1-Q26': 'Cantilever Beam',
  'u3-L1-Q28': 'Bolted Joint',
  'u3-L1-Q29': 'Tensile Specimen',
  // L2: Beam Bending
  'u3-L2-Q3': 'Beam with Force Arrows',
  'u3-L2-Q5': 'Cantilever Beam',
  'u3-L2-Q6': 'Flexural Rigidity',
  'u3-L2-Q7': 'Beam with Force Arrows',
  'u3-L2-Q8': 'Beam with Force Arrows',
  'u3-L2-Q9': 'Beam with Force Arrows',
  'u3-L2-Q10': 'Cantilever Beam',
  'u3-L2-Q11': 'Beam with Force Arrows',
  'u3-L2-Q12': 'Beam with Force Arrows',
  'u3-L2-Q14': 'Beam with Force Arrows',
  'u3-L2-Q15': 'Flexural Rigidity',
  'u3-L2-Q17': 'Beam with Force Arrows',
  'u3-L2-Q19': 'Superposition',
  'u3-L2-Q21': 'Superposition',
  'u3-L2-Q23': 'Cantilever Beam',
  'u3-L2-Q24': 'Beam with Force Arrows',
  'u3-L2-Q26': 'Column Buckling',
  'u3-L2-Q27': 'Beam with Force Arrows',
  'u3-L2-Q29': 'Beam with Force Arrows',
  'u3-L2-Q30': 'Beam with Force Arrows',
  // L3: Shear & Bending Diagrams
  'u3-L3-Q3': 'Shear Moment Diagram',
  'u3-L3-Q4': 'Shear Moment Diagram',
  'u3-L3-Q6': 'Shear Moment Diagram',
  'u3-L3-Q7': 'Shear Moment Diagram',
  'u3-L3-Q8': 'Shear Moment Diagram',
  'u3-L3-Q9': 'Shear Moment Diagram',
  'u3-L3-Q10': 'Beam with Force Arrows',
  'u3-L3-Q11': 'Shear Moment Diagram',
  'u3-L3-Q12': 'Cantilever Beam',
  'u3-L3-Q13': 'Shear Moment Diagram',
  'u3-L3-Q14': 'Beam with Force Arrows',
  'u3-L3-Q15': 'Beam with Force Arrows',
  'u3-L3-Q17': 'Shear Moment Diagram',
  'u3-L3-Q18': 'Beam with Force Arrows',
  'u3-L3-Q19': 'Shear Moment Diagram',
  'u3-L3-Q22': 'Shear Moment Diagram',
  'u3-L3-Q25': 'Shear Moment Diagram',
  'u3-L3-Q26': 'Conjugate Beam',
  'u3-L3-Q27': 'Cantilever Beam',
  'u3-L3-Q29': 'Shear Moment Diagram',
  'u3-L3-Q30': 'Shear Moment Diagram',
  // L4: Torsion
  'u3-L4-Q3': 'Torsion',
  'u3-L4-Q4': 'Gear Pair',
  'u3-L4-Q6': 'Torsion',
  'u3-L4-Q7': 'Torsion',
  'u3-L4-Q8': 'Torsion',
  'u3-L4-Q9': 'Torsion',
  'u3-L4-Q10': 'Torsion',
  'u3-L4-Q11': 'Torsion',
  'u3-L4-Q12': 'Torsion',
  'u3-L4-Q14': 'Shaft with Keyway',
  'u3-L4-Q15': 'Torsion',
  'u3-L4-Q18': 'Gear Pair',
  'u3-L4-Q20': 'Torsion',
  'u3-L4-Q22': 'Torsion',
  'u3-L4-Q23': 'Torsion',
  'u3-L4-Q25': 'Gear Pair',
  'u3-L4-Q28': 'Stress Concentration',
  'u3-L4-Q29': 'Torsion',
  'u3-L4-Q30': 'Torsion',
  // L5: Mohr's Circle
  'u3-L5-Q3': "Mohr's Circle",
  'u3-L5-Q6': "Mohr's Circle",
  'u3-L5-Q7': "Mohr's Circle",
  'u3-L5-Q8': "Mohr's Circle",
  'u3-L5-Q9': "Mohr's Circle",
  'u3-L5-Q10': 'Pressure Vessel',
  'u3-L5-Q11': "Mohr's Circle",
  'u3-L5-Q12': 'Torsion',
  'u3-L5-Q14': 'Beam with Force Arrows',
  'u3-L5-Q15': 'Beam with Force Arrows',
  'u3-L5-Q16': "Mohr's Circle",
  'u3-L5-Q17': "Mohr's Circle",
  'u3-L5-Q19': "Mohr's Circle",
  'u3-L5-Q21': 'Torsion',
  'u3-L5-Q22': 'Plane Strain',
  'u3-L5-Q24': "Mohr's Circle",
  'u3-L5-Q25': "Mohr's Circle",
  'u3-L5-Q26': "Mohr's Circle",
  'u3-L5-Q27': 'Pressure Vessel',
  'u3-L5-Q29': 'Weld Types',
  'u3-L5-Q30': "Mohr's Circle",
  // L6: Failure Theories
  'u3-L6-Q2': 'Yield Criteria',
  'u3-L6-Q3': 'Stress-Strain Curve',
  'u3-L6-Q7': 'Yield Criteria',
  'u3-L6-Q8': 'Crack Propagation',
  'u3-L6-Q9': 'Yield Criteria',
  'u3-L6-Q10': 'Fatigue S-N Curve',
  'u3-L6-Q11': 'Fatigue S-N Curve',
  'u3-L6-Q12': 'Fatigue S-N Curve',
  'u3-L6-Q14': 'Crack Propagation',
  'u3-L6-Q15': 'Fatigue S-N Curve',
  'u3-L6-Q16': 'Pressure Vessel',
  'u3-L6-Q18': 'Stress Concentration',
  'u3-L6-Q19': "Mohr's Circle",
  'u3-L6-Q20': 'Yield Criteria',
  'u3-L6-Q21': 'Fatigue S-N Curve',
  'u3-L6-Q22': 'Fatigue S-N Curve',
  'u3-L6-Q23': 'Yield Criteria',
  'u3-L6-Q25': 'Fatigue S-N Curve',
  'u3-L6-Q26': 'Stress Concentration',
  'u3-L6-Q27': 'Residual Stress',
  'u3-L6-Q28': 'Creep Curve',
  'u3-L6-Q29': 'Crack Propagation',
  'u3-L6-Q30': 'Factor of Safety',
  // L7: Column Buckling & Pressure Vessels
  'u3-L7-Q3': 'Euler Column',
  'u3-L7-Q5': 'Pressure Vessel',
  'u3-L7-Q6': 'Pressure Vessel',
  'u3-L7-Q7': 'Euler Column',
  'u3-L7-Q8': 'Column Buckling',
  'u3-L7-Q9': 'Buckling Modes',
  'u3-L7-Q10': 'Pressure Vessel',
  'u3-L7-Q11': 'Pressure Vessel',
  'u3-L7-Q12': 'Column Buckling',
  'u3-L7-Q14': 'Column Buckling',
  'u3-L7-Q15': 'Pressure Vessel',
  'u3-L7-Q16': 'Euler Column',
  'u3-L7-Q18': 'Column Buckling',
  'u3-L7-Q19': 'Pressure Vessel',
  'u3-L7-Q20': 'Eccentric Loading',
  'u3-L7-Q21': 'Pressure Vessel',
  'u3-L7-Q22': 'Pressure Vessel',
  'u3-L7-Q24': 'Column Buckling',
  'u3-L7-Q25': 'Pressure Vessel',
  'u3-L7-Q26': 'Pressure Vessel',
  'u3-L7-Q27': 'Column Buckling',
  'u3-L7-Q28': 'Pressure Vessel',
  'u3-L7-Q29': 'Buckling Modes',
  'u3-L7-Q30': 'Euler Column',
};

function processUnitFile(filepath, mappings) {
  let content = fs.readFileSync(filepath, 'utf8');
  let addedCount = 0;

  // Collect all insertions first
  const insertions = [];

  for (const [qId, svgName] of Object.entries(mappings)) {
    if (!svgs[svgName]) {
      console.log('WARNING: SVG "' + svgName + '" not found for ' + qId);
      continue;
    }

    // Find this question in the file
    const idPattern = "id: '" + qId + "'";
    const idIndex = content.indexOf(idPattern);
    if (idIndex === -1) {
      console.log('WARNING: Question ' + qId + ' not found in file');
      continue;
    }

    // Find the next question to bound this question block
    const nextQSearch = content.indexOf("id: '", idIndex + idPattern.length);
    const blockEnd = nextQSearch > -1 ? nextQSearch : content.length;
    const block = content.substring(idIndex, blockEnd);

    if (block.includes('diagram:')) {
      console.log('SKIP: ' + qId + ' already has diagram');
      continue;
    }

    // Find insertion point: after wordBank, correctAnswer, or correctIndex
    let insertOffset = -1;

    // Try wordBank first (it's a multi-line array)
    const wbIdx = block.indexOf('wordBank:');
    if (wbIdx !== -1) {
      const closeBracket = block.indexOf('],', wbIdx);
      if (closeBracket !== -1) {
        insertOffset = closeBracket + 2;
      }
    }

    // Try correctAnswer
    if (insertOffset === -1) {
      const caIdx = block.indexOf('correctAnswer:');
      if (caIdx !== -1) {
        const comma = block.indexOf(',', caIdx + 14);
        if (comma !== -1) {
          insertOffset = comma + 1;
        }
      }
    }

    // Try correctIndex
    if (insertOffset === -1) {
      const ciIdx = block.indexOf('correctIndex:');
      if (ciIdx !== -1) {
        const comma = block.indexOf(',', ciIdx + 13);
        if (comma !== -1) {
          insertOffset = comma + 1;
        }
      }
    }

    if (insertOffset === -1) {
      console.log('WARNING: Could not find insertion point for ' + qId);
      continue;
    }

    // Calculate indentation
    const beforeInsert = block.substring(0, insertOffset);
    const lastNewline = beforeInsert.lastIndexOf('\n');
    const lineContent = beforeInsert.substring(lastNewline + 1);
    const indentMatch = lineContent.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '          ';

    // Build the diagram line - escape single quotes in SVG
    const svgContent = svgs[svgName].replace(/'/g, "\\'");
    const diagramLine = '\n' + indent + "diagram: '" + svgContent + "',";

    const absolutePos = idIndex + insertOffset;
    insertions.push({ pos: absolutePos, line: diagramLine, qId: qId });
  }

  // Sort insertions by position descending (insert from end to avoid offset shifts)
  insertions.sort((a, b) => b.pos - a.pos);

  for (const ins of insertions) {
    content = content.substring(0, ins.pos) + ins.line + content.substring(ins.pos);
    addedCount++;
  }

  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Added ' + addedCount + ' diagrams to ' + filepath);
  return addedCount;
}

// Process all three unit files
const base = 'src/data/course/units';
let total = 0;
total += processUnitFile(base + '/unit-1-statics.ts', unit1Mappings);
total += processUnitFile(base + '/unit-2-dynamics.ts', unit2Mappings);
total += processUnitFile(base + '/unit-3-strength.ts', unit3Mappings);
console.log('\nTotal diagrams added: ' + total);
