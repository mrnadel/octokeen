/**
 * Overhaul Unit 4 (Thermodynamics):
 * - Split 5 lessons x ~30 items into 15 sub-lessons x ~11 items
 * - Add question variety (match-pairs, sort-buckets, order-steps)
 * - Add conversation + speed-round lessons
 * - Add easy questions after teaching cards
 * - Ramp difficulty easy -> medium -> hard
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Read the backup
const original = readFileSync(join(root, 'src/data/course/units/unit-4-thermo.ts.bak'), 'utf8');

// We'll extract all the SVG diagrams from the original to reuse them
// Parse the file to find diagram strings keyed by question ID
const diagramMap = {};
const diagRegex = /id:\s*'(u4-[^']+)'[\s\S]*?diagram:\s*'(<svg[\s\S]*?<\/svg>)'/g;
let match;
while ((match = diagRegex.exec(original)) !== null) {
  diagramMap[match[1]] = match[2];
}

// Common diagrams to reuse
const systemDiagram = diagramMap['u4-L1-Q3'] || '';
const pvDiagram = diagramMap['u4-L2-Q24'] || '';
const pistonDiagram = diagramMap['u4-L1-Q4'] || '';
const phaseDiagram = diagramMap['u4-L1-Q5'] || '';
const domeDigram = diagramMap['u4-L1-Q14'] || '';
const compressorDiagram = diagramMap['u4-L2-Q22'] || '';
const hxDiagram = diagramMap['u4-L2-Q13'] || '';
const nozzleDiagram = diagramMap['u4-L2-Q2'] || '';
const pumpDiagram = diagramMap['u4-L2-Q19'] || '';
const throttleDiagram = diagramMap['u4-L2-Q3'] || '';
const gaugeDiagram = diagramMap['u4-L1-Q19'] || '';
const tankDiagram = diagramMap['u4-L2-Q5'] || '';
const freeExpDiagram = diagramMap['u4-L2-Q25'] || '';
const steamTableDiagram = diagramMap['u4-L1-Q11'] || '';
const boilerDiagram = diagramMap['u4-L1-Q26'] || '';
const iceHexDiagram = diagramMap['u4-L1-Q24'] || '';
const containerDiagram = diagramMap['u4-L1-Q8'] || '';
const vdwDiagram = diagramMap['u4-L1-Q10'] || '';
const zFactorDiagram = diagramMap['u4-L1-Q13'] || '';
const cpVsTDiagram = diagramMap['u4-L1-Q29'] || '';
const phDiagram = diagramMap['u4-L1-Q23'] || '';
const ottoCycleDiagram = diagramMap['u4-L2-Q16'] || '';
const mixDiagram = diagramMap['u4-L2-Q11'] || '';
const subcooledDiagram = diagramMap['u4-L1-Q21'] || '';
const tripDiagram = diagramMap['u4-L1-Q17'] || '';

// Helper to escape single quotes in SVGs
function d(svg) {
  if (!svg) return '';
  return svg.replace(/'/g, "\\'");
}

// Helper: returns a diagram attribute line or empty string
function diag(svg) {
  if (!svg) return '';
  return `\n          diagram: '${d(svg)}',`;
}

// Now build the new file content
const output = `import type { Unit } from '../types';

export const unit4: Unit = {
  id: 'u4-thermo',
  title: 'Thermodynamics',
  description: 'Laws of thermodynamics, properties, cycles, and energy systems for mechanical engineers.',
  color: '#F59E0B',
  icon: '🔥',
  topicId: 'thermodynamics',
  lessons: [
    // ═══════════════════════════════════════════════════════════
    // LESSON 1a: Properties & State (Basics)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L1',
      title: 'Properties & State: Basics',
      description: 'Thermodynamic state, intensive vs extensive properties, and the state postulate.',
      icon: '📝',
      xpReward: 20,
      levels: 4,
      questions: [
        {
          id: 'u4-L1-T1',
          type: 'teaching',
          question: 'What is thermodynamic state?',
          explanation: 'A thermodynamic state is the condition of a system defined by its properties, like temperature, pressure, and volume. You only need 2 independent properties to fully define the state of a simple substance.',
          hint: 'Think of it like GPS coordinates: 2 numbers pin down your location.',
        },
        {
          id: 'u4-L1-Q0a',
          type: 'true-false',
          question: 'You need exactly 2 independent properties to fully define the state of a simple compressible substance.',
          correctAnswer: true,
          explanation: 'The state postulate says 2 independent intensive properties fix the state of a simple compressible substance.',
          hint: 'This is the state postulate.',
        },
        {
          id: 'u4-L1-Q1',
          type: 'multiple-choice',
          question: 'System as "closed, rigid, and insulated." What constraints does this impose?',
          options: [
            'Mass is fixed, volume is constant, no heat transfer',
            'Mass is fixed, pressure and temperature are constant',
            'No mass or energy crosses the boundary at all',
            'Mass is fixed, volume is constant, entropy is constant',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q1'])}
          explanation: '"Closed" means no mass crosses the boundary. "Rigid" means constant volume. "Insulated" means no heat transfer (Q = 0).',
          hint: 'What each adjective constrains: closed, rigid, insulated.',
        },
        {
          id: 'u4-L1-T2',
          type: 'teaching',
          question: 'Intensive vs extensive properties',
          explanation: 'Intensive properties don\\'t depend on system size: temperature, pressure, density. Extensive properties scale with the amount of matter: mass, total volume, total energy. Dividing an extensive property by mass gives a specific (intensive) property.',
          hint: 'If you split a glass of water in half, temperature stays the same but total volume halves.',
        },
        {
          id: 'u4-L1-Q0b',
          type: 'multiple-choice',
          question: 'Which of these does NOT change when you split a system in half?',
          options: [
            'Temperature',
            'Total volume',
            'Total mass',
            'Total internal energy',
          ],
          correctIndex: 0,
          explanation: 'Temperature is intensive. It stays the same regardless of how much material you have.',
          hint: 'Intensive properties are independent of the amount of matter.',
        },
        {
          id: 'u4-L1-Q7',
          type: 'multiple-choice',
          question: 'Which of the following is an intensive property?',
          options: [
            'Temperature',
            'Total volume',
            'Total internal energy',
            'Mass',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q7'])}
          explanation: 'Intensive properties are independent of the size (mass) of the system. Temperature, pressure, density, and specific volume are intensive.',
          hint: 'What happens to this property if you split the system?',
        },
        {
          id: 'u4-L1-MP1',
          type: 'match-pairs',
          question: 'Match each property to its classification.',
          options: ['Temperature', 'Total volume', 'Density', 'Mass'],
          matchTargets: ['Intensive', 'Extensive', 'Intensive', 'Extensive'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Temperature and density don\\'t change with system size. Total volume and mass scale with the amount of matter.',
          hint: 'Does the property change if you double the amount of material?',
        },
        {
          id: 'u4-L1-Q18',
          type: 'true-false',
          question: 'Specific volume and density are inversely related: v = 1/p.',
          correctAnswer: true,${diag(diagramMap['u4-L1-Q18'])}
          explanation: 'Specific volume v (m3/kg) is volume per unit mass, while density p (kg/m3) is mass per unit volume. They are reciprocals: v = 1/p.',
          hint: 'Compare the definitions: v = V/m and p = m/V.',
        },
        {
          id: 'u4-L1-Q15',
          type: 'fill-blank',
          question: 'The state postulate says a simple compressible substance needs _____ independent intensive properties to fix its state.',
          blanks: ['2'],
          wordBank: ['2', '1', '3', '4', '0'],${diag(diagramMap['u4-L1-Q15'])}
          explanation: 'The state postulate says that the thermodynamic state of a simple compressible system is completely specified by two independent intensive properties.',
          hint: 'How many coordinates you need to locate a point on a map?',
        },
        {
          id: 'u4-L1-Q19',
          type: 'multiple-choice',
          question: 'A pressure gauge reads 350 kPa and atmospheric pressure is 101 kPa. What is the absolute pressure?',
          options: [
            '451 kPa',
            '350 kPa',
            '249 kPa',
            '101 kPa',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q19'])}
          explanation: 'P_abs = P_gauge + P_atm = 350 + 101 = 451 kPa. Gauges read zero at atmospheric pressure.',
          hint: 'Gauge pressure reads zero at atmospheric pressure.',
        },
        {
          id: 'u4-L1-Q22',
          type: 'true-false',
          question: 'The Gibbs phase rule for a non-reacting system is F = C - P + 2.',
          correctAnswer: true,${diag(diagramMap['u4-L1-Q22'])}
          explanation: 'The Gibbs phase rule determines how many independent intensive properties are needed to fix the state.',
          hint: 'Apply the formula to a pure substance in two-phase region.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 1b: Properties & State (Phase Diagrams)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L1b',
      title: 'Properties & State: Phases',
      description: 'Phase diagrams, quality, critical point, triple point, and subcooled liquid.',
      icon: '📝',
      xpReward: 20,
      levels: 4,
      questions: [
        {
          id: 'u4-L1b-T1',
          type: 'teaching',
          question: 'Phase diagrams and the critical point',
          explanation: 'Substances exist as solid, liquid, or vapor depending on temperature and pressure. On a phase diagram, the critical point is where liquid and vapor become indistinguishable. Above it, the substance is a "supercritical fluid" with no distinct phases.',
          hint: 'Water\\'s critical point is at 374C and 22.1 MPa.',
        },
        {
          id: 'u4-L1b-Q0a',
          type: 'multiple-choice',
          question: 'Above the critical point, a substance is called a:',
          options: [
            'Supercritical fluid',
            'Superheated vapor',
            'Compressed liquid',
            'Saturated mixture',
          ],
          correctIndex: 0,
          explanation: 'Above both the critical temperature and pressure, the substance is a supercritical fluid with no distinct liquid or vapor phases.',
          hint: 'There is no phase boundary above the critical point.',
        },
        {
          id: 'u4-L1-Q5',
          type: 'multiple-choice',
          question: 'At the critical point of a substance:',
          options: [
            'Liquid and vapor phases become indistinguishable',
            'The substance exists only as a solid phase',
            'Pressure is at its minimum for phase change',
            'Enthalpy of vaporization reaches its maximum',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q5'])}
          explanation: 'At the critical point, the properties of the liquid and vapor phases converge. Above it, the substance is a supercritical fluid.',
          hint: 'What happens to the difference between liquid and vapor here?',
        },
        {
          id: 'u4-L1-Q9',
          type: 'true-false',
          question: 'Pressure and temperature are independent properties in the two-phase (wet) region of a pure substance.',
          correctAnswer: false,${diag(diagramMap['u4-L1-Q9'])}
          explanation: 'In the two-phase region, P and T are linked by the saturation curve. You need a second independent property like quality (x).',
          hint: 'On the saturation curve, fixing P automatically fixes T.',
        },
        {
          id: 'u4-L1-Q8',
          type: 'multiple-choice',
          question: 'Wet steam at 100 kPa has quality x = 0.85. What does this mean physically?',
          options: [
            '85% of mass is saturated vapor, 15% is saturated liquid',
            '85% of the total volume is occupied by vapor',
            'The temperature is 85% of the saturation temperature',
            'The steam has lost 85% of its enthalpy of vaporization',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q8'])}
          explanation: 'Quality (x) is defined as the mass fraction of vapor in a two-phase mixture: x = m_vapor / m_total.',
          hint: 'Quality is defined as a mass ratio, not a volume ratio.',
        },
        {
          id: 'u4-L1-Q14',
          type: 'multiple-choice',
          question: 'On a T-v diagram for water, what does the horizontal line under the saturation dome represent?',
          options: [
            'Constant-pressure, constant-temperature boiling',
            'Isothermal compression of an ideal gas',
            'Isentropic expansion through a nozzle',
            'Constant-volume heating from liquid to superheated vapor',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q14'])}
          explanation: 'Under the dome, temperature and pressure are locked together. The horizontal line represents phase change at constant T and P.',
          hint: 'What happens to temperature during phase change?',
        },
        {
          id: 'u4-L1b-SB1',
          type: 'sort-buckets',
          question: 'Sort these into the correct region on a phase diagram.',
          options: ['T < T_sat at given P', 'x = 0.5 (quality)', 'T > T_sat at given P', 'Wet mixture', 'Superheated steam', 'Compressed liquid'],
          buckets: ['Two-phase region', 'Single-phase region'],
          correctBuckets: [1, 0, 1, 0, 1, 1],
          explanation: 'Two-phase mixtures have 0 < x < 1 and exist at saturation conditions. Subcooled liquid and superheated vapor are single-phase.',
          hint: 'The two-phase region is under the saturation dome.',
        },
        {
          id: 'u4-L1-Q17',
          type: 'multiple-choice',
          question: 'Which correctly describes the triple point of a substance?',
          options: [
            'It is the unique T and P where all three phases coexist',
            'It is the highest temperature at which a liquid can exist',
            'It is the point of direct solid-to-vapor transition only',
            'It is the average of the melting and boiling points',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q17'])}
          explanation: 'The triple point is a unique, invariant point on the phase diagram where all three phases coexist. For water, T_tp = 0.01C and P_tp = 0.611 kPa.',
          hint: 'How many phases can coexist at this special state?',
        },
        {
          id: 'u4-L1-Q27',
          type: 'true-false',
          question: 'A supercritical fluid has distinct liquid and vapor phases that can be identified by their different densities.',
          correctAnswer: false,${diag(diagramMap['u4-L1-Q27'])}
          explanation: 'Above the critical point, there is no phase boundary. The substance exists as a single supercritical fluid phase.',
          hint: 'What happens to the liquid-vapor distinction above the critical point?',
        },
        {
          id: 'u4-L1-Q21',
          type: 'multiple-choice',
          question: 'What is subcooled liquid?',
          options: [
            'A liquid below T_sat at its given pressure',
            'A liquid at exactly the saturation temperature',
            'A liquid that is above the critical pressure',
            'A liquid containing dissolved gases in it',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q21'])}
          explanation: 'A compressed (subcooled) liquid exists at a temperature below T_sat at its pressure. Its properties are very close to saturated liquid at the same temperature.',
          hint: 'Compare the actual temperature to T_sat at the given pressure.',
        },
        {
          id: 'u4-L1-Q28',
          type: 'multiple-choice',
          question: 'In property tables, what does the subscript "f" represent (as in v_f, h_f, s_f)?',
          options: [
            'Saturated liquid',
            'Final state of a process',
            'Frozen (solid) state',
            'Reference state',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q28'])}
          explanation: '"f" stands for saturated liquid (from German "flussig"), "g" for saturated vapor, and "fg" for the difference between them.',
          hint: 'This notation comes from German thermodynamic terminology.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 1c: Properties & State (Ideal Gas & Real Gas)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L1c',
      title: 'Properties & State: Gases',
      description: 'Ideal gas law, specific heats, van der Waals equation, and compressibility factor.',
      icon: '📝',
      xpReward: 20,
      levels: 4,
      questions: [
        {
          id: 'u4-L1c-T1',
          type: 'teaching',
          question: 'The ideal gas model',
          explanation: 'An ideal gas has no intermolecular forces and molecules that occupy negligible volume. This gives the simple equation PV = nRT. Real gases approach ideal behavior at low pressures and high temperatures.',
          hint: 'Try this now: check if air at room temperature and 1 atm is well-approximated as ideal (spoiler: it is).',
        },
        {
          id: 'u4-L1c-Q0a',
          type: 'fill-blank',
          question: 'A substance whose molecules have no intermolecular forces and negligible volume is modeled as a/an _____ gas.',
          blanks: ['ideal'],
          wordBank: ['ideal', 'real', 'van der Waals', 'noble', 'compressible'],
          explanation: 'The ideal gas model assumes no intermolecular forces and negligible molecular volume. PV = nRT.',
          hint: 'This model gives the simplest equation of state.',
        },
        {
          id: 'u4-L1-Q3',
          type: 'true-false',
          question: 'For an ideal gas, the internal energy depends only on temperature, not on pressure or volume.',
          correctAnswer: true,${diag(diagramMap['u4-L1-Q3'])}
          explanation: 'For an ideal gas, u = u(T) only. No intermolecular forces means energy depends only on molecular kinetic energy (temperature).',
        },
        {
          id: 'u4-L1-Q4',
          type: 'multiple-choice',
          question: 'Why is cp always greater than cv for any gas?',
          options: [
            'At constant pressure, the gas must also do expansion work',
            'At constant pressure, heat dissipates to surroundings faster',
            'At constant volume, energy is stored as intermolecular potential',
            'At constant pressure, molecular speeds increase due to lower density',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q4'])}
          explanation: 'At constant volume, all heat goes into raising internal energy. At constant pressure, extra energy is needed for expansion work too.',
          hint: 'Where does the extra energy go at constant pressure?',
        },
        {
          id: 'u4-L1c-T2',
          type: 'teaching',
          question: 'Specific heat ratio and ideal gas relations',
          explanation: 'The ratio gamma = cp/cv is key for ideal gas processes. For air at room temperature, gamma = 1.4. It appears in isentropic relations like Pv^gamma = constant and T2/T1 = (v1/v2)^(gamma-1).',
          hint: 'Diatomic gases (like N2 and O2 in air) have gamma = 1.4 because they have 5 degrees of freedom.',
        },
        {
          id: 'u4-L1-Q12',
          type: 'true-false',
          question: 'The specific heat ratio for air is approximately 1.4 because air behaves as a diatomic ideal gas.',
          correctAnswer: true,${diag(diagramMap['u4-L1-Q12'])}
          explanation: 'For a diatomic ideal gas with 5 active degrees of freedom: cv = (5/2)R and cp = (7/2)R, so gamma = 7/5 = 1.4.',
          hint: 'Count the degrees of freedom for a diatomic molecule.',
        },
        {
          id: 'u4-L1-Q16',
          type: 'multiple-choice',
          question: 'Ideal gas at 300 K occupies 2 m3. If heated to 600 K at constant pressure, what is the new volume?',
          options: [
            '4 m3',
            '2 m3',
            '6 m3',
            '1 m3',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q16'])}
          explanation: 'Charles\\'s Law at constant pressure: V1/T1 = V2/T2. So V2 = 2 x (600/300) = 4 m3.',
          hint: 'Apply Charles\\'s Law for constant-pressure processes.',
        },
        {
          id: 'u4-L1-Q20',
          type: 'multiple-choice',
          question: 'When using PV = mRT, the R value must be:',
          options: [
            'R = R_universal / M, which differs for each gas',
            'The universal gas constant R_u = 8.314 kJ/(kmol K) always',
            'The Boltzmann constant k_B = 1.38 x 10^-23 J/K',
            'Any value of R since the equation auto-adjusts',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q20'])}
          explanation: 'The specific gas constant R = R_u/M depends on molar mass M. For air (M = 28.97), R = 0.287 kJ/(kg K).',
          hint: 'Is the mass in your equation in kg or kmol?',
        },
        {
          id: 'u4-L1c-OS1',
          type: 'order-steps',
          question: 'Order the steps to find the state of steam at a given P and T.',
          steps: [
            'Look up T_sat at the given pressure',
            'Compare actual T to T_sat',
            'If T > T_sat, use superheated table',
            'If T < T_sat, use compressed liquid table',
            'Read the property value from the correct table',
          ],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'Always compare actual conditions to saturation conditions first, then pick the correct table.',
          hint: 'Start by finding out what phase the substance is in.',
        },
        {
          id: 'u4-L1-Q10',
          type: 'multiple-choice',
          question: 'In the van der Waals equation, what do "a" and "b" represent?',
          options: [
            '"a" for intermolecular attraction, "b" for molecular volume',
            '"a" for kinetic energy, "b" for potential energy',
            '"a" for temperature correction, "b" for pressure correction',
            '"a" for gas constant correction, "b" for compressibility factor',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q10'])}
          explanation: 'The van der Waals equation (P + a/v2)(v - b) = RT corrects the ideal gas law for attraction (a) and molecular volume (b).',
          hint: 'The ideal gas law assumes molecules are point masses with no attraction.',
        },
        {
          id: 'u4-L1-Q13',
          type: 'multiple-choice',
          question: 'What is the compressibility factor Z, and what does Z < 1 indicate?',
          options: [
            'Z = Pv/(RT); Z < 1 means intermolecular attraction dominates',
            'Z = cv/cp; Z < 1 means fewer degrees of freedom',
            'Z = P_actual/P_ideal; Z < 1 means actual pressure is below ideal',
            'Z = T_actual/T_critical; Z < 1 means gas is below critical temperature',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q13'])}
          explanation: 'Z = Pv/(RT) measures deviation from ideal gas behavior. Z = 1 means ideal. Z < 1 means attraction pulls molecules closer.',
          hint: 'Z compares actual volume to what an ideal gas would have.',
        },
        {
          id: 'u4-L1-Q30',
          type: 'multiple-choice',
          question: 'What is the principle of corresponding states?',
          options: [
            'All gases at the same reduced T and P have similar Z',
            'All gases share the same critical point properties',
            'Gases at equal reduced conditions have identical structures',
            'Reduced properties eliminate the need for equations of state',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L1-Q30'])}
          explanation: 'The principle of corresponding states lets a single generalized chart work for any gas when using reduced pressure and temperature.',
          hint: 'This principle allows a single chart to work for any gas.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 2a: First Law (Foundations)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L2',
      title: 'First Law: Foundations',
      description: 'Energy conservation, closed system energy balance, enthalpy, and work.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L2-T1',
          type: 'teaching',
          question: 'The first law of thermodynamics',
          explanation: 'Energy can\\'t be created or destroyed, only converted. For a closed system: the change in internal energy equals heat added minus work done by the system. In equation form: delta U = Q - W.',
          hint: 'Think of your bank account: deposits (heat in) minus withdrawals (work out) equals balance change.',
        },
        {
          id: 'u4-L2-Q0a',
          type: 'true-false',
          question: 'Energy can be created or destroyed in a thermodynamic process.',
          correctAnswer: false,
          explanation: 'The first law says energy is conserved. It can only be converted from one form to another.',
          hint: 'This is the most fundamental energy law in physics.',
        },
        {
          id: 'u4-L2-Q15',
          type: 'fill-blank',
          question: 'For a closed system, the first law states delta U = _____ - W, where Q is heat added and W is work done _____ the system.',
          blanks: ['Q', 'by'],
          wordBank: ['Q', 'by', 'W', 'on', 'H', 'to'],${diag(diagramMap['u4-L2-Q15'])}
          explanation: 'delta U = Q - W. Q is heat added to the system, W is work done by the system.',
          hint: 'The first law is an energy balance equation.',
        },
        {
          id: 'u4-L2-Q7',
          type: 'multiple-choice',
          question: 'What is the difference between a closed and an open system?',
          options: [
            'A closed system exchanges energy but not mass',
            'A closed system has no interactions at all',
            'A closed system is always rigid',
            'The terms are interchangeable',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q7'])}
          explanation: 'A closed system (control mass) has a fixed amount of mass. No mass crosses the boundary, but energy (heat and work) can.',
          hint: 'Which type allows mass to cross the system boundary?',
        },
        {
          id: 'u4-L2-T2',
          type: 'teaching',
          question: 'Enthalpy and open systems',
          explanation: 'Enthalpy (h = u + Pv) combines internal energy with flow work. For open systems like turbines and compressors, the steady-flow energy equation is: q - w_shaft = delta h + delta KE + delta PE. Most devices simplify by dropping KE and PE terms.',
          hint: 'Enthalpy is the "total package" of energy that flows with the fluid.',
        },
        {
          id: 'u4-L2-Q0b',
          type: 'fill-blank',
          question: 'Enthalpy is defined as h = u + _____.',
          blanks: ['Pv'],
          wordBank: ['Pv', 'Ts', 'cv T', 'Q', 'W'],
          explanation: 'h = u + Pv. It combines internal energy and flow work.',
          hint: 'This term accounts for the work needed to push fluid into a control volume.',
        },
        {
          id: 'u4-L2-Q1',
          type: 'multiple-choice',
          question: 'A heat engine claims to produce 600 kJ of work from 500 kJ of heat per cycle. What is wrong?',
          options: [
            'It violates the first law: in a cycle, W_net cannot exceed Q_in',
            'It violates the second law only',
            'Nothing is wrong: the extra 100 kJ comes from internal energy',
            'It violates the zeroth law',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q1'])}
          explanation: 'In a cycle, delta U = 0, so Q_net = W_net. You can\\'t get more work out than heat in.',
        },
        {
          id: 'u4-L2-Q12',
          type: 'true-false',
          question: 'Boundary work for a constant-volume process is always zero.',
          correctAnswer: true,${diag(diagramMap['u4-L2-Q12'])}
          explanation: 'W = integral of P dV. If dV = 0, then W = 0 regardless of pressure changes.',
          hint: 'What is dV for a constant-volume process?',
        },
        {
          id: 'u4-L2-MP1',
          type: 'match-pairs',
          question: 'Match each device to its key simplification in the SFEE.',
          options: ['Nozzle', 'Turbine', 'Throttle valve', 'Heat exchanger'],
          matchTargets: ['delta KE dominates, w_s = 0', 'w_s dominates, delta KE small', 'h_in = h_out (isenthalpic)', 'Q_hot = Q_cold, w_s = 0'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Each device has different dominant terms in the steady-flow energy equation.',
          hint: 'Think about what each device is designed to do.',
        },
        {
          id: 'u4-L2-Q21',
          type: 'true-false',
          question: 'Work done by a gas during expansion depends on the process path, not just the initial and final states.',
          correctAnswer: true,${diag(diagramMap['u4-L2-Q21'])}
          explanation: 'Work (W = integral of P dV) is a path function. The same endpoints can be connected by different paths giving different work values.',
          hint: 'On a P-V diagram, work is the area under the curve.',
        },
        {
          id: 'u4-L2-Q5',
          type: 'multiple-choice',
          question: 'An insulated rigid tank with 2 kg of air (cv = 0.718 kJ/(kg K)) at 300 K. A paddle wheel does 100 kJ of work on the gas. What is the final temperature?',
          options: [
            '369.6 K',
            '439.2 K',
            '300.0 K',
            '350.0 K',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q5'])}
          explanation: 'Q = 0 (insulated), W_boundary = 0 (rigid). First law: delta U = -W_paddle = +100 kJ. So delta T = 100/(2 x 0.718) = 69.6 K. T2 = 369.6 K.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 2b: First Law (Open Systems)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L2b',
      title: 'First Law: Open Systems',
      description: 'Steady-flow devices, nozzles, turbines, compressors, and mixing chambers.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L2b-T1',
          type: 'teaching',
          question: 'Steady-flow energy equation',
          explanation: 'For steady-state open systems: q - w_s = (h2 - h1) + (V2^2 - V1^2)/2 + g(z2 - z1). Most engineering devices let you drop one or more terms. Turbines focus on shaft work, nozzles on kinetic energy.',
          hint: 'Try this now: list which terms you\\'d drop for a turbine vs. a nozzle.',
        },
        {
          id: 'u4-L2b-Q0a',
          type: 'true-false',
          question: 'In a steady-state system, mass and energy within the control volume stay constant over time.',
          correctAnswer: true,
          explanation: 'Steady-state means dm/dt = 0 and dE/dt = 0. Whatever flows in must flow out.',
          hint: 'Steady means nothing changes with time inside the control volume.',
        },
        {
          id: 'u4-L2-Q2',
          type: 'multiple-choice',
          question: 'Why is KE change neglected for a turbine but is the primary term for a nozzle?',
          options: [
            'A turbine extracts energy as shaft work with modest velocity changes',
            'Turbines operate at low speeds so kinetic energy is always zero',
            'The fluid density changes through a turbine differently',
            'Turbines have long flow paths that dissipate KE as friction',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q2'])}
          explanation: 'In a turbine, shaft work dominates and velocity changes are small. In a nozzle, there\\'s no shaft work, so all enthalpy drop converts to kinetic energy.',
          hint: 'Compare the magnitude of shaft work vs. kinetic energy change.',
        },
        {
          id: 'u4-L2-Q3',
          type: 'true-false',
          question: 'A throttling valve is modeled as isenthalpic (h_in = h_out) because it has no work, negligible heat transfer, and small KE change.',
          correctAnswer: true,${diag(diagramMap['u4-L2-Q3'])}
          explanation: 'Apply the SFEE with w_s = 0, q = 0, and negligible KE: h1 = h2.',
          hint: 'Apply the SFEE to a small device with no work output.',
        },
        {
          id: 'u4-L2-Q11',
          type: 'multiple-choice',
          question: 'A mixing chamber receives 2 kg/s at 20C and 3 kg/s at 80C. Outlet temperature with no heat loss?',
          options: [
            '56C',
            '50C',
            '60C',
            '44C',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q11'])}
          explanation: 'Energy balance: 2(20) + 3(80) = 5(T_out). T_out = (40 + 240)/5 = 56C.',
          hint: 'Apply mass and energy balances to the mixing chamber.',
        },
        {
          id: 'u4-L2b-SB1',
          type: 'sort-buckets',
          question: 'Sort these devices: does the SFEE analysis keep or drop the shaft work term?',
          options: ['Turbine', 'Nozzle', 'Compressor', 'Throttle valve', 'Pump', 'Diffuser'],
          buckets: ['Has shaft work (w_s)', 'No shaft work (w_s = 0)'],
          correctBuckets: [0, 1, 0, 1, 0, 1],
          explanation: 'Turbines, compressors, and pumps have rotating shafts. Nozzles, diffusers, and throttle valves have no moving parts.',
          hint: 'Does the device have a rotating shaft?',
        },
        {
          id: 'u4-L2-Q10',
          type: 'multiple-choice',
          question: 'Steam turbine: inlet 50 m/s, outlet 200 m/s, enthalpy drop 1000 kJ/kg. Is it reasonable to neglect KE?',
          options: [
            'Yes: delta KE is about 19 kJ/kg vs. 1000 kJ/kg enthalpy drop',
            'No: KE is always significant in turbomachinery',
            'Only if the fluid is incompressible',
            'No: exit velocity of 200 m/s makes KE dominant',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q10'])}
          explanation: 'delta KE = (200^2 - 50^2)/(2 x 1000) = 18.75 kJ/kg. Compared to 1000 kJ/kg enthalpy drop, that\\'s under 2%.',
          hint: 'Calculate delta KE = (V2^2 - V1^2)/2 and compare to enthalpy drop.',
        },
        {
          id: 'u4-L2-Q14',
          type: 'multiple-choice',
          question: 'What is the back-work ratio (BWR)?',
          options: [
            'BWR = w_compressor/w_turbine: fraction of turbine work fed back',
            'BWR = w_turbine/w_compressor: the inverse of the work ratio',
            'BWR is the ratio of heat rejected to heat added',
            'BWR equals the isentropic efficiency of compression',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q14'])}
          explanation: 'The BWR tells you what fraction of turbine output goes to driving the compressor/pump. Rankine: ~1-3%. Brayton: ~40-80%.',
          hint: 'How much turbine work is "eaten up" by the compressor?',
        },
        {
          id: 'u4-L2-Q23',
          type: 'multiple-choice',
          question: 'What is flow work?',
          options: [
            'The work needed to push fluid across the control volume boundary',
            'The kinetic energy of the flowing fluid at the boundary',
            'The friction loss in the piping before the control volume',
            'The shaft work required to maintain steady flow',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q23'])}
          explanation: 'Flow work = Pv per unit mass. It\\'s the work done by upstream fluid to push a packet across the boundary. That\\'s why enthalpy (h = u + Pv) appears in open system equations.',
          hint: 'What work must be done to push a fluid element across the boundary?',
        },
        {
          id: 'u4-L2-Q17',
          type: 'multiple-choice',
          question: 'A turbine has isentropic efficiency of 85%. What does this mean?',
          options: [
            'Actual work output is 85% of the ideal isentropic output',
            'The turbine converts 85% of heat input into work',
            '85% of steam passes through without losses',
            'Exit temperature is 85% of the inlet temperature',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q17'])}
          explanation: 'Turbine isentropic efficiency: eta_t = w_actual / w_isentropic = (h1 - h2a)/(h1 - h2s).',
          hint: 'Compare actual work to the ideal (isentropic) work.',
        },
        {
          id: 'u4-L2-Q26',
          type: 'true-false',
          question: 'In a steady-state adiabatic nozzle, the exit velocity can be calculated from the enthalpy drop alone.',
          correctAnswer: true,${diag(diagramMap['u4-L2-Q26'])}
          explanation: 'With w_s = 0, q = 0, and small inlet velocity: V2 = sqrt(2(h1 - h2)). All enthalpy drop converts to kinetic energy.',
          hint: 'Apply the SFEE with no work and no heat transfer.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 2c: First Law (Processes & Calculations)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L2c',
      title: 'First Law: Processes',
      description: 'Polytropic processes, boundary work, free expansion, isentropic efficiency, and transient analysis.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L2c-T1',
          type: 'teaching',
          question: 'Boundary work and process paths',
          explanation: 'Boundary work is W = integral of P dV. It depends on the path, not just the start and end states. Common paths: constant volume (W=0), constant pressure (W = P x delta V), and polytropic (PV^n = constant).',
          hint: 'On a P-V diagram, the area under the curve equals the boundary work.',
        },
        {
          id: 'u4-L2c-Q0a',
          type: 'multiple-choice',
          question: 'If volume stays constant during a process, the boundary work is:',
          options: [
            'Zero',
            'P x delta V',
            'nRT ln(V2/V1)',
            'Depends on pressure',
          ],
          correctIndex: 0,
          explanation: 'W = integral of P dV. If dV = 0, the integral is zero regardless of pressure.',
          hint: 'What is dV when volume is constant?',
        },
        {
          id: 'u4-L2-Q24',
          type: 'fill-blank',
          question: 'A process in which Pv^n = constant is called a _____ process.',
          blanks: ['polytropic'],
          wordBank: ['polytropic', 'isentropic', 'isothermal', 'adiabatic', 'isobaric'],${diag(diagramMap['u4-L2-Q24'])}
          explanation: 'A polytropic process follows PV^n = constant. Special cases: n=0 (isobaric), n=1 (isothermal), n=gamma (isentropic).',
          hint: 'This general term covers all processes of the form PV^n = const.',
        },
        {
          id: 'u4-L2c-OS1',
          type: 'order-steps',
          question: 'Order the polytropic exponent from isobaric to isochoric.',
          steps: [
            'n = 0 (isobaric)',
            'n = 1 (isothermal)',
            'n = gamma (isentropic)',
            'n -> infinity (isochoric)',
          ],
          correctOrder: [0, 1, 2, 3],
          explanation: 'The polytropic exponent maps the full spectrum: n=0 (constant P), n=1 (constant T), n=gamma (constant s), n=infinity (constant V).',
          hint: 'As n increases, the process curve gets steeper on a P-V diagram.',
        },
        {
          id: 'u4-L2-Q4',
          type: 'multiple-choice',
          question: 'A compressor has polytropic exponent n = 1.25 (gamma = 1.4). What does this tell you?',
          options: [
            'The process lies between isothermal and isentropic compression',
            'The compressor is losing 25% of its energy to friction',
            'The gas has fewer degrees of freedom than expected',
            'The compression violates the second law',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q4'])}
          explanation: 'Since 1 < n < gamma, the process is between isothermal (n=1, most efficient) and isentropic (n=gamma). Real compressors fall in this range.',
          hint: 'Where does n = 1.25 fall between n = 1 and n = 1.4?',
        },
        {
          id: 'u4-L2-Q16',
          type: 'multiple-choice',
          question: 'Isothermal compression of ideal gas. What is the work done ON the gas?',
          options: [
            'W_on = nRT ln(V1/V2), positive since V1 > V2',
            'W_on = P(V2 - V1) for constant pressure',
            'W_on = ncv x delta T = 0 since T is constant',
            'W_on = nRT(1/V2 - 1/V1)',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q16'])}
          explanation: 'For isothermal ideal gas: W_by = nRT ln(V2/V1). Work done ON the gas = -W_by = nRT ln(V1/V2), which is positive for compression.',
          hint: 'For an ideal gas, P = nRT/V. Integrate P dV.',
        },
        {
          id: 'u4-L2-Q18',
          type: 'true-false',
          question: 'In adiabatic free expansion of an ideal gas, both temperature and internal energy remain unchanged.',
          correctAnswer: true,${diag(diagramMap['u4-L2-Q18'])}
          explanation: 'Free expansion into vacuum: Q = 0, W = 0 (no external pressure). First law: delta U = 0. For ideal gas, U depends only on T, so T stays constant too.',
          hint: 'What is the external pressure that the gas pushes against?',
        },
        {
          id: 'u4-L2-Q25',
          type: 'multiple-choice',
          question: 'Ideal gas in an insulated rigid tank, membrane ruptures into an equal-sized evacuated tank. What happens?',
          options: [
            'T stays constant, pressure halves as volume doubles',
            'T drops to half, pressure drops to one quarter',
            'T rises, pressure stays the same',
            'T and P both remain unchanged',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q25'])}
          explanation: 'Free expansion: Q = 0, W = 0, so delta U = 0 and T is constant. From PV = mRT with V doubled and T constant, P halves.',
          hint: 'Apply the first law with Q = 0 and W = 0.',
        },
        {
          id: 'u4-L2c-T2',
          type: 'teaching',
          question: 'Isentropic efficiency',
          explanation: 'Real devices aren\\'t perfectly reversible. Isentropic efficiency compares actual performance to the ideal. For turbines: eta = w_actual/w_ideal. For compressors: eta = w_ideal/w_actual (inverted because you want less work input).',
          hint: 'Turbine efficiency is actual/ideal. Compressor efficiency is ideal/actual. The "better" value is always in the numerator.',
        },
        {
          id: 'u4-L2-Q22',
          type: 'multiple-choice',
          question: 'Compressor: T1=300K, T2s=579K, T2a=620K. What is the isentropic efficiency?',
          options: [
            '87.2%: (579-300)/(620-300) = 279/320',
            '93.4%: T2a/T2s = 620/579',
            '106.2%: (620-300)/(579-300)',
            '48.4%: T1/T2a = 300/620',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q22'])}
          explanation: 'Compressor eta = w_ideal/w_actual = (h2s - h1)/(h2a - h1). For ideal gas: (T2s - T1)/(T2a - T1) = 279/320 = 87.2%.',
          hint: 'For compressors, ideal work goes in the numerator.',
        },
        {
          id: 'u4-L2-Q19',
          type: 'multiple-choice',
          question: 'Pump work for water (v_f = 0.00101 m3/kg) from 10 kPa to 10 MPa?',
          options: [
            'About 10.1 kJ/kg: w_pump = v_f x (P2 - P1)',
            'About 100 kJ/kg: w_pump = cp x delta T',
            'About 1000 kJ/kg: w_pump = P2 x v_f',
            'About 0.1 kJ/kg: negligible for liquid',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L2-Q19'])}
          explanation: 'For incompressible liquid: w_pump = v(P2 - P1) = 0.00101 x (10000 - 10) = 10.1 kJ/kg. Pumping liquid is cheap.',
          hint: 'Liquid is nearly incompressible, so v stays constant.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 3a: Second Law (Fundamentals)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L3',
      title: 'Second Law: Fundamentals',
      description: 'Entropy, Clausius and Kelvin-Planck statements, reversibility, and the Clausius inequality.',
      icon: '🔀',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L3-T1',
          type: 'teaching',
          question: 'What is entropy?',
          explanation: 'Entropy measures disorder or energy dispersal in a system. The second law says the total entropy of an isolated system always increases or stays the same. It never decreases. This is why heat flows from hot to cold, never the reverse, on its own.',
          hint: 'A broken egg never unbreaks itself. That\\'s entropy in action.',
        },
        {
          id: 'u4-L3-Q0a',
          type: 'true-false',
          question: 'Heat spontaneously flows from hot objects to cold objects, never the reverse.',
          correctAnswer: true,
          explanation: 'This is the Clausius statement of the second law. Reversing heat flow requires work input (like a refrigerator).',
          hint: 'Think about what happens when you put ice in hot coffee.',
        },
        {
          id: 'u4-L3-Q1',
          type: 'multiple-choice',
          question: 'The Kelvin-Planck statement says:',
          options: [
            'No heat engine can convert all heat input to work in a cycle',
            'No device can transfer heat from cold to hot spontaneously',
            'Entropy of an isolated system always decreases over time',
            'All reversible engines have the same efficiency',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q1'])}
          explanation: 'Kelvin-Planck: it\\'s impossible for a cycle to produce net work while exchanging heat with only one reservoir. Some heat must be rejected.',
          hint: 'Can you build a 100% efficient heat engine?',
        },
        {
          id: 'u4-L3-Q2',
          type: 'multiple-choice',
          question: 'A heat engine receives 1000 kJ from a hot source and rejects 600 kJ to a cold sink. What is its thermal efficiency?',
          options: [
            '40%',
            '60%',
            '167%',
            '37.5%',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q2'])}
          explanation: 'eta = W_net/Q_in = (1000-600)/1000 = 400/1000 = 40%. Or eta = 1 - Q_out/Q_in = 1 - 0.6 = 40%.',
          hint: 'Efficiency = net work output / heat input.',
        },
        {
          id: 'u4-L3-MP1',
          type: 'match-pairs',
          question: 'Match each second-law statement to its description.',
          options: ['Kelvin-Planck', 'Clausius', 'Carnot principle', 'Clausius inequality'],
          matchTargets: ['No 100% heat engine possible', 'Heat won\\'t flow cold to hot alone', 'No engine beats Carnot efficiency', 'Cyclic integral of dQ/T <= 0'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'These are four different ways to express the consequences of the second law.',
          hint: 'Each statement restricts what\\'s thermodynamically possible.',
        },
        {
          id: 'u4-L3-Q3',
          type: 'true-false',
          question: 'A reversible process generates zero entropy.',
          correctAnswer: true,${diag(diagramMap['u4-L3-Q3'])}
          explanation: 'Reversible processes are idealized: no friction, no unrestrained expansion, no heat transfer across finite temperature differences. S_gen = 0.',
          hint: 'What makes a process irreversible?',
        },
        {
          id: 'u4-L3-T2',
          type: 'teaching',
          question: 'The Carnot cycle',
          explanation: 'The Carnot cycle is the most efficient cycle possible between two temperature reservoirs. Its efficiency is eta_Carnot = 1 - T_cold/T_hot (using absolute temperatures). No real engine can beat it.',
          hint: 'The Carnot efficiency depends only on the reservoir temperatures, not the working fluid.',
        },
        {
          id: 'u4-L3-Q0b',
          type: 'multiple-choice',
          question: 'The Carnot efficiency between 300 K and 600 K is:',
          options: [
            '50%',
            '100%',
            '33%',
            '67%',
          ],
          correctIndex: 0,
          explanation: 'eta_Carnot = 1 - T_cold/T_hot = 1 - 300/600 = 0.5 = 50%.',
          hint: 'Use absolute temperatures in the Carnot formula.',
        },
        {
          id: 'u4-L3-Q4',
          type: 'multiple-choice',
          question: 'How can you increase the Carnot efficiency of a heat engine?',
          options: [
            'Raise the hot source temperature or lower the cold sink temperature',
            'Increase the mass flow rate of the working fluid',
            'Use a gas with a higher specific heat ratio',
            'Increase the pressure ratio of the cycle',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q4'])}
          explanation: 'eta_Carnot = 1 - T_cold/T_hot. Increasing T_hot or decreasing T_cold increases efficiency.',
          hint: 'Look at the two variables in the Carnot formula.',
        },
        {
          id: 'u4-L3-Q5',
          type: 'multiple-choice',
          question: 'An inventor claims an engine operating between 500 K and 300 K achieves 50% efficiency. Is this possible?',
          options: [
            'No: Carnot limit is 1 - 300/500 = 40%',
            'Yes: 50% is below the Carnot limit',
            'Yes: real engines can exceed Carnot if well designed',
            'No: efficiency can never exceed 25% for these temperatures',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q5'])}
          explanation: 'Carnot efficiency = 1 - 300/500 = 40%. Claiming 50% violates the second law.',
          hint: 'Calculate the maximum possible efficiency first.',
        },
        {
          id: 'u4-L3-Q6',
          type: 'fill-blank',
          question: 'In any irreversible process, the total entropy of the universe _____.',
          blanks: ['increases'],
          wordBank: ['increases', 'decreases', 'stays the same', 'is zero', 'oscillates'],${diag(diagramMap['u4-L3-Q6'])}
          explanation: 'The second law: delta S_universe = delta S_system + delta S_surroundings > 0 for all real (irreversible) processes.',
          hint: 'The second law says entropy generation is always positive for real processes.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 3b: Second Law (Entropy Calculations)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L3b',
      title: 'Second Law: Entropy Calculations',
      description: 'Entropy changes for ideal gases, T-s diagrams, isentropic processes, and entropy balance.',
      icon: '🔀',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L3b-T1',
          type: 'teaching',
          question: 'Entropy change for ideal gases',
          explanation: 'For an ideal gas: delta s = cv ln(T2/T1) + R ln(v2/v1), or equivalently delta s = cp ln(T2/T1) - R ln(P2/P1). For an isentropic process (delta s = 0), these simplify to the familiar relations like T2/T1 = (P2/P1)^((gamma-1)/gamma).',
          hint: 'These equations come from integrating T ds = du + P dv for an ideal gas.',
        },
        {
          id: 'u4-L3b-Q0a',
          type: 'true-false',
          question: 'For an isentropic process, the entropy change is zero.',
          correctAnswer: true,
          explanation: 'Isentropic means constant entropy. delta s = 0. This happens when a process is both adiabatic and reversible.',
          hint: 'Break apart the word: "isen" (same) + "tropic" (entropy).',
        },
        {
          id: 'u4-L3-Q7',
          type: 'multiple-choice',
          question: 'On a T-s diagram, what does the area under a reversible process curve represent?',
          options: [
            'Heat transfer',
            'Work done',
            'Entropy generation',
            'Internal energy change',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q7'])}
          explanation: 'On a T-s diagram, the area under a reversible process curve equals the heat transfer: Q_rev = integral of T ds.',
          hint: 'Compare T-s and P-V diagrams. What does area represent on each?',
        },
        {
          id: 'u4-L3-Q8',
          type: 'multiple-choice',
          question: 'Which process has zero heat transfer on a T-s diagram?',
          options: [
            'A vertical line (isentropic)',
            'A horizontal line (isothermal)',
            'A diagonal line going up-right',
            'Any curved path',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q8'])}
          explanation: 'A vertical line on T-s means delta s = 0 (isentropic). Since Q = integral of T ds, a vertical line has zero area under it, meaning Q = 0.',
          hint: 'No area under the curve means no heat transfer.',
        },
        {
          id: 'u4-L3b-SB1',
          type: 'sort-buckets',
          question: 'Sort these processes: does entropy increase, decrease, or stay the same for the system?',
          options: ['Isentropic expansion', 'Heat addition at constant T', 'Free expansion into vacuum', 'Reversible adiabatic compression', 'Friction in a pipe', 'Isentropic compression'],
          buckets: ['Entropy stays the same', 'Entropy increases'],
          correctBuckets: [0, 1, 1, 0, 1, 0],
          explanation: 'Isentropic processes have delta s = 0. Heat addition, free expansion, and friction all increase entropy.',
          hint: 'Isentropic = adiabatic + reversible. Irreversibilities always generate entropy.',
        },
        {
          id: 'u4-L3-Q9',
          type: 'true-false',
          question: 'Entropy is a state function: its change depends only on the initial and final states, not the path.',
          correctAnswer: true,${diag(diagramMap['u4-L3-Q9'])}
          explanation: 'Unlike heat and work, entropy is a property. delta S = S2 - S1 regardless of how you get from state 1 to state 2.',
          hint: 'Compare this to temperature and pressure, which are also state functions.',
        },
        {
          id: 'u4-L3-Q10',
          type: 'multiple-choice',
          question: 'For steam expanding isentropically in a turbine from state 1 to state 2:',
          options: [
            's1 = s2, and you can find h2 from the steam tables at s2 and P2',
            's1 > s2 because the turbine removes entropy',
            's1 < s2 because expansion always generates entropy',
            'The entropy change depends on the turbine design',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q10'])}
          explanation: 'Isentropic means s1 = s2. With s2 and P2 known, you can fully determine state 2 from steam tables.',
          hint: 'Isentropic = constant entropy. Two independent properties fix the state.',
        },
        {
          id: 'u4-L3-Q11',
          type: 'multiple-choice',
          question: 'Entropy generation in a heat exchanger with hot fluid (500 K to 400 K) and cold fluid (300 K to 350 K). Is the process reversible?',
          options: [
            'No: there is a finite temperature difference, so entropy is generated',
            'Yes: total heat is conserved so entropy is conserved',
            'Yes: both fluids return to similar temperatures',
            'No: but only because of friction in the pipes',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q11'])}
          explanation: 'Heat transfer across a finite temperature difference is always irreversible. Entropy is generated whenever T_hot > T_cold.',
          hint: 'Is heat transferring across a temperature difference?',
        },
        {
          id: 'u4-L3-Q12',
          type: 'true-false',
          question: 'Increasing the number of compression stages with intercooling reduces the total compressor work.',
          correctAnswer: true,${diag(diagramMap['u4-L3-Q12'])}
          explanation: 'Intercooling brings the compression process closer to isothermal, which requires less work than isentropic compression.',
          hint: 'Isothermal compression requires less work than isentropic.',
        },
        {
          id: 'u4-L3-Q13',
          type: 'multiple-choice',
          question: 'The entropy change of an ideal gas going from (T1, P1) to (T2, P2) is:',
          options: [
            'delta s = cp ln(T2/T1) - R ln(P2/P1)',
            'delta s = cv ln(T2/T1) - R ln(P2/P1)',
            'delta s = cp ln(P2/P1) - R ln(T2/T1)',
            'delta s = R ln(T2/T1) + cp ln(P2/P1)',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q13'])}
          explanation: 'For an ideal gas: delta s = cp ln(T2/T1) - R ln(P2/P1). This comes from the Tds relation and ideal gas law.',
          hint: 'Start with T ds = dh - v dP and use h = cp T and Pv = RT.',
        },
        {
          id: 'u4-L3-Q14',
          type: 'multiple-choice',
          question: 'Water is heated from 20C to 80C at constant pressure. During this process:',
          options: [
            'System entropy increases because heat is added',
            'System entropy decreases because the water is more organized',
            'System entropy stays the same (constant pressure)',
            'System entropy is undefined for liquids',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q14'])}
          explanation: 'Adding heat increases the entropy of the system. delta s = integral of dQ/T > 0 when Q > 0.',
          hint: 'Which direction does entropy change when heat flows in?',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 3c: Second Law (Applications & Irreversibility)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L3c',
      title: 'Second Law: Applications',
      description: 'Exergy, irreversibility, entropy in everyday devices, and perpetual motion machines.',
      icon: '🔀',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L3c-T1',
          type: 'teaching',
          question: 'Exergy: useful work potential',
          explanation: 'Exergy (or availability) is the maximum useful work you can extract from a system as it reaches equilibrium with its surroundings. Irreversibilities destroy exergy. The higher the entropy generation, the more exergy is wasted.',
          hint: 'A hot cup of coffee has exergy relative to the room. Once it cools to room temperature, its exergy is zero.',
        },
        {
          id: 'u4-L3c-Q0a',
          type: 'true-false',
          question: 'Irreversibilities destroy the useful work potential (exergy) of a system.',
          correctAnswer: true,
          explanation: 'Every irreversibility generates entropy and reduces the amount of useful work you can extract.',
          hint: 'Friction, unrestrained expansion, and heat transfer across temperature differences all destroy exergy.',
        },
        {
          id: 'u4-L3-Q15',
          type: 'fill-blank',
          question: 'A Carnot heat engine operating between 800 K and 300 K has an efficiency of _____.',
          blanks: ['62.5%'],
          wordBank: ['62.5%', '37.5%', '50%', '75%', '80%'],${diag(diagramMap['u4-L3-Q15'])}
          explanation: 'eta_Carnot = 1 - T_cold/T_hot = 1 - 300/800 = 0.625 = 62.5%.',
          hint: 'Plug the reservoir temperatures (in Kelvin) into the Carnot formula.',
        },
        {
          id: 'u4-L3c-OS1',
          type: 'order-steps',
          question: 'Rank these sources of irreversibility from most to least common in engineering systems.',
          steps: [
            'Heat transfer across finite temperature difference',
            'Friction (mechanical and fluid)',
            'Mixing of different substances',
            'Unrestrained expansion',
          ],
          correctOrder: [0, 1, 2, 3],
          explanation: 'Heat transfer and friction are by far the most common irreversibilities in real engineering systems.',
          hint: 'Think about which ones occur in nearly every real device.',
        },
        {
          id: 'u4-L3-Q16',
          type: 'multiple-choice',
          question: 'Which of these is NOT a source of irreversibility?',
          options: [
            'Quasi-static compression of a gas',
            'Friction between moving parts',
            'Rapid unrestrained expansion',
            'Heat transfer across a large temperature difference',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q16'])}
          explanation: 'Quasi-static (very slow) processes approach reversibility. The other three are classic irreversibilities.',
          hint: 'Which process is slow enough to be considered nearly ideal?',
        },
        {
          id: 'u4-L3-Q17',
          type: 'multiple-choice',
          question: 'A hot block (500 K) and cold block (300 K) are brought into contact. They reach 400 K. Did entropy increase?',
          options: [
            'Yes: heat transfer across a finite temperature difference always generates entropy',
            'No: total energy is conserved so entropy must be conserved',
            'No: the average temperature didn\\'t change',
            'It depends on the material of the blocks',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q17'])}
          explanation: 'The entropy gained by the cold block exceeds the entropy lost by the hot block. Net S_gen > 0.',
          hint: 'Calculate delta S for each block: delta S = mc ln(T2/T1).',
        },
        {
          id: 'u4-L3-Q18',
          type: 'true-false',
          question: 'A decrease in entropy of a system is impossible.',
          correctAnswer: false,${diag(diagramMap['u4-L3-Q18'])}
          explanation: 'A system\\'s entropy CAN decrease (e.g., when it loses heat). The second law says total entropy (system + surroundings) cannot decrease.',
          hint: 'The second law applies to the universe, not just the system.',
        },
        {
          id: 'u4-L3-Q19',
          type: 'multiple-choice',
          question: 'What is a perpetual motion machine of the second kind (PMM2)?',
          options: [
            'A device that converts heat entirely into work in a cycle',
            'A device that runs forever without friction',
            'A device that creates energy from nothing',
            'A device that transfers heat from cold to hot with no input',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q19'])}
          explanation: 'A PMM2 violates the Kelvin-Planck statement. It would be 100% efficient, extracting work from a single reservoir.',
          hint: 'PMM1 violates the first law. PMM2 violates the second law.',
        },
        {
          id: 'u4-L3c-MP1',
          type: 'match-pairs',
          question: 'Match each concept to its definition.',
          options: ['Exergy', 'Irreversibility', 'Entropy generation', 'Dead state'],
          matchTargets: ['Max useful work to equilibrium', 'Wasted work potential', 'Always >= 0 for real processes', 'Equilibrium with surroundings'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'These four concepts are all interconnected through the second law.',
          hint: 'Exergy is destroyed by irreversibilities, which are measured by entropy generation.',
        },
        {
          id: 'u4-L3-Q20',
          type: 'multiple-choice',
          question: 'Why is the isentropic efficiency of real devices always less than 100%?',
          options: [
            'Real devices have friction, heat losses, and other irreversibilities',
            'The working fluid is never truly ideal',
            'Temperature measurements are never perfectly accurate',
            'The second law limits efficiency to the Carnot value',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q20'])}
          explanation: 'Friction, fluid turbulence, heat loss, and non-equilibrium processes all generate entropy, reducing efficiency below the ideal.',
          hint: 'What causes a device to deviate from the ideal isentropic process?',
        },
        {
          id: 'u4-L3-Q30',
          type: 'multiple-choice',
          question: 'An engine that operates between a single thermal reservoir and produces net work is:',
          options: [
            'A perpetual motion machine of the second kind',
            'A Carnot engine operating at maximum efficiency',
            'Possible if the reservoir is large enough',
            'A reversible heat pump running in reverse',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L3-Q30'])}
          explanation: 'This violates the Kelvin-Planck statement. You need at least two reservoirs to operate a heat engine cycle.',
          hint: 'How many thermal reservoirs does a heat engine need?',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 4a: Power Cycles (Steam/Rankine)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L4',
      title: 'Power Cycles: Rankine',
      description: 'The Rankine cycle for steam power plants, reheat, regeneration, and efficiency improvements.',
      icon: '📝',
      xpReward: 30,
      levels: 4,
      questions: [
        {
          id: 'u4-L4-T1',
          type: 'teaching',
          question: 'Power cycles convert heat to work',
          explanation: 'A power cycle takes in heat, produces net work, and rejects waste heat. The thermal efficiency is eta = W_net / Q_in. The Rankine cycle powers most steam power plants: pump, boiler, turbine, condenser.',
          hint: 'Every power cycle needs a hot source, a cold sink, and a working fluid going around in a loop.',
        },
        {
          id: 'u4-L4-Q0a',
          type: 'multiple-choice',
          question: 'The 4 components of a basic Rankine cycle are:',
          options: [
            'Pump, boiler, turbine, condenser',
            'Compressor, combustor, turbine, exhaust',
            'Evaporator, compressor, condenser, expansion valve',
            'Intake, compression, combustion, exhaust',
          ],
          correctIndex: 0,
          explanation: 'The Rankine cycle: pump compresses liquid, boiler adds heat, turbine produces work, condenser rejects heat.',
          hint: 'This cycle uses water/steam as the working fluid.',
        },
        {
          id: 'u4-L4-Q1',
          type: 'multiple-choice',
          question: 'Why does the Rankine cycle have such a low back-work ratio (1-3%)?',
          options: [
            'Pumping liquid requires much less work than compressing gas',
            'The boiler provides most of the energy',
            'Steam turbines are more efficient than gas turbines',
            'The condenser recovers most of the pump work',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q1'])}
          explanation: 'Liquid is nearly incompressible, so the pump work (v x delta P) is tiny compared to turbine output. This is a key advantage of the Rankine cycle.',
          hint: 'Compare the specific volume of liquid water to steam.',
        },
        {
          id: 'u4-L4-OS1',
          type: 'order-steps',
          question: 'Order the Rankine cycle processes starting from the pump inlet.',
          steps: [
            'Pump: compress liquid to boiler pressure',
            'Boiler: heat liquid to superheated steam',
            'Turbine: expand steam, produce work',
            'Condenser: cool steam back to liquid',
          ],
          correctOrder: [0, 1, 2, 3],
          explanation: 'The Rankine cycle goes: pump (1-2), boiler (2-3), turbine (3-4), condenser (4-1).',
          hint: 'Follow the water around the loop.',
        },
        {
          id: 'u4-L4-Q2',
          type: 'multiple-choice',
          question: 'How does reheating improve the Rankine cycle?',
          options: [
            'It increases the average temperature of heat addition and improves steam quality at turbine exit',
            'It eliminates the need for a condenser',
            'It replaces the pump with a simpler device',
            'It reduces the boiler pressure requirement',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q2'])}
          explanation: 'Reheating: partially expand steam, reheat it in the boiler, then expand again. This raises the average T of heat addition and keeps exit quality high.',
          hint: 'What happens to steam quality if you expand too far in one stage?',
        },
        {
          id: 'u4-L4-Q3',
          type: 'true-false',
          question: 'Regeneration in the Rankine cycle uses extracted steam to preheat the feedwater before it enters the boiler.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q3'])}
          explanation: 'Feedwater heaters use steam extracted from the turbine to heat the compressed liquid. This raises the average temperature of heat addition.',
          hint: 'Why waste all the medium-temperature steam in the condenser?',
        },
        {
          id: 'u4-L4-SB1',
          type: 'sort-buckets',
          question: 'Sort these modifications: do they improve Rankine cycle efficiency or not?',
          options: ['Increase boiler pressure', 'Increase condenser pressure', 'Add reheat', 'Add feedwater heater', 'Lower boiler temperature', 'Lower condenser temperature'],
          buckets: ['Improves efficiency', 'Decreases efficiency'],
          correctBuckets: [0, 1, 0, 0, 1, 0],
          explanation: 'Efficiency improves by raising the average T of heat addition or lowering the average T of heat rejection.',
          hint: 'Think about how each change affects the average temperature of heat transfer.',
        },
        {
          id: 'u4-L4-Q4',
          type: 'multiple-choice',
          question: 'Why must steam quality at the turbine exit be kept above about 90%?',
          options: [
            'Liquid droplets erode the turbine blades',
            'Wet steam cannot produce any work',
            'The condenser cannot handle two-phase flow',
            'Low quality means the cycle has reversed',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q4'])}
          explanation: 'Water droplets in high-speed steam act like tiny bullets hitting the turbine blades, causing erosion and damage over time.',
          hint: 'What happens when liquid droplets hit blades moving at hundreds of m/s?',
        },
        {
          id: 'u4-L4-Q5',
          type: 'multiple-choice',
          question: 'What is the thermal efficiency of an ideal Rankine cycle if Q_in = 2500 kJ/kg and Q_out = 1800 kJ/kg?',
          options: [
            '28%',
            '72%',
            '38.9%',
            '50%',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q5'])}
          explanation: 'eta = 1 - Q_out/Q_in = 1 - 1800/2500 = 1 - 0.72 = 0.28 = 28%.',
          hint: 'eta = W_net/Q_in = (Q_in - Q_out)/Q_in.',
        },
        {
          id: 'u4-L4-T2',
          type: 'teaching',
          question: 'Supercritical and ultra-supercritical cycles',
          explanation: 'Modern power plants operate above the critical point (22.1 MPa for water). Supercritical Rankine cycles avoid the two-phase region in the boiler entirely, improving heat addition efficiency. Ultra-supercritical plants reach 45%+ thermal efficiency.',
          hint: 'Try this now: look up the operating pressure of a modern coal plant. It\\'s typically 25-30 MPa.',
        },
        {
          id: 'u4-L4-Q6',
          type: 'true-false',
          question: 'In a supercritical Rankine cycle, there is no distinct boiling process because the working fluid is above the critical point.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q6'])}
          explanation: 'Above the critical point, there\\'s no phase boundary. The fluid transitions smoothly from liquid-like to vapor-like density.',
          hint: 'What happens to the saturation dome above the critical point?',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 4b: Power Cycles (Gas/Otto/Diesel)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L4b',
      title: 'Power Cycles: Gas Engines',
      description: 'Otto cycle, Diesel cycle, Brayton cycle, compression ratio, and thermal efficiency.',
      icon: '📝',
      xpReward: 30,
      levels: 4,
      questions: [
        {
          id: 'u4-L4b-T1',
          type: 'teaching',
          question: 'The Otto cycle: gasoline engines',
          explanation: 'The ideal Otto cycle models spark-ignition engines with 4 processes: isentropic compression, constant-volume heat addition (combustion), isentropic expansion, and constant-volume heat rejection. Its efficiency depends only on the compression ratio: eta = 1 - 1/r^(gamma-1).',
          hint: 'Higher compression ratio = higher efficiency. But too high causes engine knock.',
        },
        {
          id: 'u4-L4b-Q0a',
          type: 'multiple-choice',
          question: 'In the ideal Otto cycle, combustion is modeled as:',
          options: [
            'Constant-volume heat addition',
            'Constant-pressure heat addition',
            'Isothermal heat addition',
            'Isentropic heat addition',
          ],
          correctIndex: 0,
          explanation: 'In gasoline engines, the fuel burns very quickly with the piston nearly stationary. This is modeled as constant-volume heat addition.',
          hint: 'The piston barely moves during the brief combustion event.',
        },
        {
          id: 'u4-L4-Q7',
          type: 'multiple-choice',
          question: 'The ideal Otto cycle efficiency with compression ratio r = 8 and gamma = 1.4 is approximately:',
          options: [
            '56.5%',
            '44.4%',
            '62.5%',
            '50.0%',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q7'])}
          explanation: 'eta = 1 - 1/r^(gamma-1) = 1 - 1/8^0.4 = 1 - 1/2.297 = 1 - 0.435 = 56.5%.',
          hint: 'Plug r = 8 and gamma = 1.4 into the formula.',
        },
        {
          id: 'u4-L4b-T2',
          type: 'teaching',
          question: 'The Diesel cycle: compression ignition',
          explanation: 'The Diesel cycle differs from Otto by having constant-pressure heat addition (fuel injected into hot compressed air). It has a higher compression ratio (14-25 vs. 8-12 for Otto) because there\\'s no knock limit. The cutoff ratio affects its efficiency.',
          hint: 'Diesel engines compress air alone. Fuel is injected after compression, and the hot air ignites it.',
        },
        {
          id: 'u4-L4-MP1',
          type: 'match-pairs',
          question: 'Match each cycle to its defining heat addition process.',
          options: ['Otto cycle', 'Diesel cycle', 'Brayton cycle', 'Rankine cycle'],
          matchTargets: ['Constant volume', 'Constant pressure (gas)', 'Constant pressure (gas turbine)', 'Constant pressure (boiler)'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'The heat addition process is the key difference between these power cycles.',
          hint: 'Otto = constant V. Diesel, Brayton, and Rankine all use constant P, but for different systems.',
        },
        {
          id: 'u4-L4-Q8',
          type: 'multiple-choice',
          question: 'For the same compression ratio, which cycle has higher efficiency: Otto or Diesel?',
          options: [
            'Otto, because constant-volume heat addition is more efficient',
            'Diesel, because it uses higher pressures',
            'They are equal at the same compression ratio',
            'It depends on the working fluid',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q8'])}
          explanation: 'At the same r, Otto > Diesel efficiency. But real Diesel engines use higher compression ratios, so their actual efficiency is often higher.',
          hint: 'Compare the T-s diagrams of Otto and Diesel at the same r.',
        },
        {
          id: 'u4-L4-Q9',
          type: 'true-false',
          question: 'In the Brayton cycle (gas turbine), the back-work ratio is much higher than in the Rankine cycle.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q9'])}
          explanation: 'Brayton BWR is 40-80% because compressing gas takes much more work than pumping liquid. Rankine BWR is only 1-3%.',
          hint: 'Compare the work needed to compress a gas vs. pump a liquid.',
        },
        {
          id: 'u4-L4-Q10',
          type: 'multiple-choice',
          question: 'How does increasing the pressure ratio affect ideal Brayton cycle efficiency?',
          options: [
            'Efficiency increases because eta = 1 - 1/r_p^((gamma-1)/gamma)',
            'Efficiency decreases because more compressor work is needed',
            'No effect: Brayton efficiency depends only on temperature ratio',
            'Efficiency first increases then decreases with pressure ratio',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q10'])}
          explanation: 'For an ideal Brayton cycle with constant gamma, efficiency depends only on the pressure ratio. Higher r_p means higher efficiency.',
          hint: 'The formula looks similar to Otto, but uses pressure ratio instead of volume ratio.',
        },
        {
          id: 'u4-L4-Q11',
          type: 'multiple-choice',
          question: 'What is the dual cycle, and when is it used?',
          options: [
            'Combination of constant-volume and constant-pressure heat addition, models real engines',
            'Two Carnot cycles in series for higher efficiency',
            'A cycle with two turbines and two compressors',
            'An Otto cycle followed by a Rankine bottoming cycle',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q11'])}
          explanation: 'The dual cycle (or limited-pressure cycle) combines features of both Otto and Diesel. It\\'s a more realistic model of actual engine combustion.',
          hint: 'Real combustion is neither purely constant-V nor constant-P.',
        },
        {
          id: 'u4-L4-Q12',
          type: 'true-false',
          question: 'In the ideal Brayton cycle, the thermal efficiency depends only on the pressure ratio, not on the maximum temperature.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q12'])}
          explanation: 'For ideal Brayton with constant gamma: eta = 1 - 1/r_p^((gamma-1)/gamma). T_max doesn\\'t appear, though it affects the specific work output.',
          hint: 'Look at the ideal Brayton efficiency formula. Does T_max appear?',
        },
        {
          id: 'u4-L4-Q13',
          type: 'multiple-choice',
          question: 'What is the advantage of a combined gas-steam (Brayton-Rankine) cycle?',
          options: [
            'It captures waste heat from the gas turbine exhaust to run a steam cycle',
            'It eliminates the need for a condenser',
            'It uses a single working fluid for both cycles',
            'It operates at lower temperatures for safety',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q13'])}
          explanation: 'Combined cycles reach 60%+ efficiency by using hot gas turbine exhaust (500-600C) as the heat source for a Rankine bottoming cycle.',
          hint: 'The exhaust from one cycle becomes the heat input for the next.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 4c: Power Cycles (Efficiency & Improvements)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L4c',
      title: 'Power Cycles: Efficiency',
      description: 'Cycle improvements, real vs ideal, combined cycles, and mean effective pressure.',
      icon: '📝',
      xpReward: 30,
      levels: 4,
      questions: [
        {
          id: 'u4-L4c-T1',
          type: 'teaching',
          question: 'Real vs ideal cycles',
          explanation: 'Real cycles differ from ideal ones due to friction, pressure drops, heat losses, and non-isentropic compression/expansion. The isentropic efficiency of each component (typically 80-90%) reduces the overall cycle efficiency significantly.',
          hint: 'A real gas turbine with 85% compressor and 90% turbine efficiencies might achieve only 30-35% thermal efficiency instead of the ideal 40-45%.',
        },
        {
          id: 'u4-L4c-Q0a',
          type: 'true-false',
          question: 'Real power cycles always have lower efficiency than their ideal counterparts.',
          correctAnswer: true,
          explanation: 'Friction, heat losses, and non-ideal component behavior reduce real cycle efficiency below the ideal.',
          hint: 'Irreversibilities always reduce performance.',
        },
        {
          id: 'u4-L4-Q14',
          type: 'multiple-choice',
          question: 'Mean effective pressure (MEP) is defined as:',
          options: [
            'W_net / displacement volume: the constant pressure that would produce the same work',
            'Maximum pressure in the cycle divided by the compression ratio',
            'Average of all pressures at each point in the cycle',
            'The pressure at which the piston moves fastest',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q14'])}
          explanation: 'MEP = W_net / (V_max - V_min). It\\'s a useful metric for comparing engines of different sizes.',
          hint: 'MEP lets you compare engines regardless of displacement volume.',
        },
        {
          id: 'u4-L4-Q15',
          type: 'fill-blank',
          question: 'The Brayton cycle uses _____ as the working fluid and consists of a compressor, combustion chamber, and turbine.',
          blanks: ['air'],
          wordBank: ['air', 'steam', 'refrigerant', 'helium', 'nitrogen'],${diag(diagramMap['u4-L4-Q15'])}
          explanation: 'The Brayton cycle (gas turbine cycle) uses air as the working fluid. It\\'s an open cycle in practice, but modeled as closed with air.',
          hint: 'This cycle is used in jet engines and gas turbine power plants.',
        },
        {
          id: 'u4-L4c-SB1',
          type: 'sort-buckets',
          question: 'Sort these: do they improve gas turbine (Brayton) efficiency or not?',
          options: ['Intercooling between compressor stages', 'Regeneration (exhaust heat recovery)', 'Lowering the pressure ratio', 'Reheating between turbine stages', 'Increasing compressor inlet temperature', 'Increasing turbine inlet temperature'],
          buckets: ['Improves efficiency', 'Decreases efficiency'],
          correctBuckets: [0, 0, 1, 0, 1, 0],
          explanation: 'Intercooling, regeneration, reheat, and higher turbine inlet temperature all help. Lower pressure ratio and higher compressor inlet temperature hurt.',
          hint: 'Ask: does this change bring us closer to the Carnot efficiency?',
        },
        {
          id: 'u4-L4-Q16',
          type: 'multiple-choice',
          question: 'Regeneration in the Brayton cycle works by:',
          options: [
            'Using hot turbine exhaust to preheat air before combustion',
            'Compressing the air in multiple stages',
            'Reheating the gas between turbine stages',
            'Cooling the air between compressor stages',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q16'])}
          explanation: 'A regenerator (heat exchanger) transfers heat from the hot exhaust to the compressed air entering the combustor, reducing fuel consumption.',
          hint: 'Why waste the hot exhaust when it can preheat the incoming air?',
        },
        {
          id: 'u4-L4-Q17',
          type: 'multiple-choice',
          question: 'Which modification is unique to the Brayton cycle (not applicable to Rankine)?',
          options: [
            'Intercooling between compressor stages',
            'Feedwater heating',
            'Condenser improvements',
            'Superheating the working fluid',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q17'])}
          explanation: 'Intercooling makes sense for gas compression (high BWR). Rankine cycles pump liquid with negligible work, so intercooling the pump adds no benefit.',
          hint: 'Which cycle has the high back-work ratio that makes compressor improvements worthwhile?',
        },
        {
          id: 'u4-L4-Q18',
          type: 'true-false',
          question: 'The Ericsson cycle (isothermal compression + isothermal expansion with regeneration) achieves Carnot efficiency.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q18'])}
          explanation: 'Both the Ericsson and Stirling cycles achieve Carnot efficiency when operated reversibly with perfect regeneration.',
          hint: 'Any cycle with all heat transfer at T_hot and T_cold can match Carnot.',
        },
        {
          id: 'u4-L4-Q19',
          type: 'multiple-choice',
          question: 'A combined cycle plant has a gas turbine efficiency of 38% and a steam bottoming cycle that captures 30% of the rejected heat. Overall efficiency?',
          options: [
            'About 56.6%',
            'About 68%',
            'About 38%',
            'About 50%',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q19'])}
          explanation: 'Gas turbine: Q_rejected = 62% of Q_in. Steam cycle captures 30% of that: 0.30 x 0.62 = 18.6%. Total: 38% + 18.6% = 56.6%.',
          hint: 'The steam cycle uses the gas turbine\\'s rejected heat as its input.',
        },
        {
          id: 'u4-L4-Q20',
          type: 'multiple-choice',
          question: 'Why don\\'t we just increase the compression ratio to get higher efficiency in real Otto engines?',
          options: [
            'Engine knock (pre-ignition) limits the compression ratio for gasoline',
            'Higher compression ratios reduce the displacement volume',
            'The ideal gas model breaks down at high pressures',
            'Friction losses increase linearly with compression ratio',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L4-Q20'])}
          explanation: 'Gasoline auto-ignites at high compression ratios, causing knock. Diesel engines avoid this because fuel is injected after compression.',
          hint: 'This is why Diesel engines can use higher compression ratios than gasoline engines.',
        },
        {
          id: 'u4-L4-Q21',
          type: 'true-false',
          question: 'Increasing the turbine inlet temperature is the most effective way to improve Brayton cycle specific work output.',
          correctAnswer: true,${diag(diagramMap['u4-L4-Q21'])}
          explanation: 'Higher T3 (turbine inlet) increases both efficiency and specific work. But material limits cap T3 at about 1500-1700C for modern gas turbines.',
          hint: 'T3 is limited by blade material strength at high temperatures.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 5a: Refrigeration (Basics)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L5',
      title: 'Refrigeration: Basics',
      description: 'Vapor compression cycle, COP, components, and the role of each device.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L5-T1',
          type: 'teaching',
          question: 'Refrigeration cycles move heat uphill',
          explanation: 'A refrigeration cycle uses work to move heat from a cold space to a warm one. The key metric is COP (coefficient of performance): COP_refrigerator = Q_cold / W_input. COP can be greater than 1 because you\\'re moving heat, not creating it.',
          hint: 'Your fridge uses about 100W of electricity to remove 300-400W of heat from the food compartment.',
        },
        {
          id: 'u4-L5-Q0a',
          type: 'true-false',
          question: 'The COP of a refrigerator can be greater than 1.',
          correctAnswer: true,
          explanation: 'COP = Q_cold / W. Since you\\'re moving heat (not creating it), you can move more energy than you input. A typical fridge COP is 2-4.',
          hint: 'COP is not the same as efficiency. It can exceed 1.',
        },
        {
          id: 'u4-L5-Q1',
          type: 'multiple-choice',
          question: 'The 4 components of a basic vapor-compression refrigeration cycle are:',
          options: [
            'Compressor, condenser, expansion valve, evaporator',
            'Pump, boiler, turbine, condenser',
            'Compressor, combustor, turbine, nozzle',
            'Compressor, regenerator, turbine, cooler',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q1'])}
          explanation: 'Vapor-compression refrigeration: compressor raises pressure, condenser rejects heat, expansion valve drops pressure, evaporator absorbs heat.',
          hint: 'This cycle is the reverse of a power cycle.',
        },
        {
          id: 'u4-L5-OS1',
          type: 'order-steps',
          question: 'Order the vapor-compression refrigeration cycle starting from the compressor inlet.',
          steps: [
            'Compressor: compress low-pressure vapor to high pressure',
            'Condenser: reject heat, vapor condenses to liquid',
            'Expansion valve: throttle to low pressure (isenthalpic)',
            'Evaporator: absorb heat from cold space, liquid evaporates',
          ],
          correctOrder: [0, 1, 2, 3],
          explanation: 'The refrigerant loops: compress, condense (reject heat), throttle, evaporate (absorb heat).',
          hint: 'Follow the refrigerant around the loop.',
        },
        {
          id: 'u4-L5-Q2',
          type: 'multiple-choice',
          question: 'Why is an expansion valve used instead of a turbine in most refrigeration cycles?',
          options: [
            'The work recovered would be tiny and not worth the complexity',
            'Turbines cannot handle two-phase flow at all',
            'The expansion must be isentropic for the cycle to work',
            'Expansion valves are more efficient than turbines',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q2'])}
          explanation: 'A turbine could recover some work, but the amount is small for a refrigerant. The cost and complexity aren\\'t worth it for most systems.',
          hint: 'Compare the cost of a turbine to the tiny amount of work it would recover.',
        },
        {
          id: 'u4-L5-T2',
          type: 'teaching',
          question: 'COP for refrigerators vs heat pumps',
          explanation: 'COP_refrigerator = Q_cold / W (you care about cooling). COP_heat_pump = Q_hot / W (you care about heating). Since Q_hot = Q_cold + W, COP_HP = COP_R + 1. A heat pump always has a higher COP than the same device used as a refrigerator.',
          hint: 'Both use the same cycle. The difference is which heat transfer you care about.',
        },
        {
          id: 'u4-L5-Q0b',
          type: 'multiple-choice',
          question: 'If COP_refrigerator = 3, then COP_heat_pump for the same cycle is:',
          options: [
            '4',
            '3',
            '2',
            '1/3',
          ],
          correctIndex: 0,
          explanation: 'COP_HP = COP_R + 1 = 3 + 1 = 4. The heat pump delivers all the cold-side heat plus the work input to the hot side.',
          hint: 'COP_HP = COP_R + 1.',
        },
        {
          id: 'u4-L5-Q3',
          type: 'true-false',
          question: 'A heat pump with COP = 4 delivers 4 kW of heating for every 1 kW of electricity consumed.',
          correctAnswer: true,${diag(diagramMap['u4-L5-Q3'])}
          explanation: 'COP_HP = Q_hot / W. So Q_hot = COP x W = 4 x 1 = 4 kW of heating.',
          hint: 'COP tells you how many units of heating you get per unit of work.',
        },
        {
          id: 'u4-L5-MP1',
          type: 'match-pairs',
          question: 'Match each refrigeration component to its thermodynamic process.',
          options: ['Compressor', 'Condenser', 'Expansion valve', 'Evaporator'],
          matchTargets: ['Isentropic compression (ideal)', 'Constant-pressure heat rejection', 'Isenthalpic throttling', 'Constant-pressure heat absorption'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'Each component performs a specific thermodynamic process in the cycle.',
          hint: 'Think about what happens to the refrigerant in each device.',
        },
        {
          id: 'u4-L5-Q4',
          type: 'multiple-choice',
          question: 'The Carnot COP of a refrigerator operating between -10C and 35C is:',
          options: [
            '5.84',
            '7.51',
            '0.17',
            '3.0',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q4'])}
          explanation: 'COP_Carnot = T_cold / (T_hot - T_cold) = 263 / (308 - 263) = 263/45 = 5.84.',
          hint: 'Convert to Kelvin: -10C = 263 K, 35C = 308 K.',
        },
        {
          id: 'u4-L5-Q5',
          type: 'multiple-choice',
          question: 'Why does lowering the evaporator temperature reduce COP?',
          options: [
            'The compressor must work harder to bridge a larger pressure difference',
            'The refrigerant absorbs less heat in a colder evaporator',
            'Colder temperatures make the refrigerant freeze',
            'The condenser becomes less effective at lower temperatures',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q5'])}
          explanation: 'Lower evaporator T means lower evaporator P, so the compressor has a bigger pressure ratio. More work for the same or less cooling.',
          hint: 'What happens to the pressure ratio when you lower the evaporator temperature?',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 5b: Refrigeration (Advanced Topics)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L5b',
      title: 'Refrigeration: Advanced',
      description: 'Refrigerants, absorption cycles, cascade systems, subcooling, superheating, and real-world issues.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L5b-T1',
          type: 'teaching',
          question: 'Refrigerant selection matters',
          explanation: 'A good refrigerant has a boiling point matched to the application, high latent heat, low toxicity, low flammability, and minimal environmental impact. CFCs (like R-12) were banned for ozone depletion. HFCs (like R-134a) are being phased down for high GWP. Natural refrigerants (CO2, ammonia, propane) are making a comeback.',
          hint: 'R-410A is common in home AC. R-744 (CO2) is used in heat pump water heaters.',
        },
        {
          id: 'u4-L5b-Q0a',
          type: 'multiple-choice',
          question: 'Why were CFC refrigerants like R-12 banned?',
          options: [
            'They destroy the ozone layer',
            'They are too expensive to produce',
            'They have very low COP',
            'They freeze at normal operating temperatures',
          ],
          correctIndex: 0,
          explanation: 'CFCs release chlorine in the stratosphere, which catalytically destroys ozone. The Montreal Protocol phased them out.',
          hint: 'This environmental issue was discovered in the 1980s.',
        },
        {
          id: 'u4-L5-Q6',
          type: 'fill-blank',
          question: 'Superheating at the evaporator exit ensures the refrigerant entering the _____ is completely vapor, protecting it from liquid damage.',
          blanks: ['compressor'],
          wordBank: ['compressor', 'condenser', 'evaporator', 'expansion valve', 'receiver'],${diag(diagramMap['u4-L5-Q6'])}
          explanation: 'Liquid refrigerant in the compressor can cause "liquid slugging" and damage the compressor valves and bearings.',
          hint: 'Which component can be damaged by liquid droplets?',
        },
        {
          id: 'u4-L5-Q7',
          type: 'multiple-choice',
          question: 'Why is subcooling the liquid before the expansion valve beneficial?',
          options: [
            'It increases the refrigeration effect by allowing more heat absorption in the evaporator',
            'It reduces the condenser pressure requirement',
            'It makes the expansion valve work more efficiently',
            'It prevents frost buildup on the evaporator',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q7'])}
          explanation: 'Subcooling reduces flash gas (vapor formed during throttling). More liquid enters the evaporator, so more heat can be absorbed.',
          hint: 'What happens to refrigerant quality at the expansion valve exit when you subcool?',
        },
        {
          id: 'u4-L5b-SB1',
          type: 'sort-buckets',
          question: 'Sort these refrigerants by environmental concern.',
          options: ['R-12 (CFC)', 'R-134a (HFC)', 'R-717 (ammonia)', 'R-22 (HCFC)', 'R-744 (CO2)', 'R-290 (propane)'],
          buckets: ['High environmental concern', 'Low environmental concern'],
          correctBuckets: [0, 0, 1, 0, 1, 1],
          explanation: 'CFCs and HCFCs deplete ozone. HFCs have high GWP. Natural refrigerants (ammonia, CO2, propane) have minimal environmental impact.',
          hint: 'Natural refrigerants are generally better for the environment.',
        },
        {
          id: 'u4-L5-Q8',
          type: 'multiple-choice',
          question: 'What is the main advantage of a cascade refrigeration system?',
          options: [
            'It can achieve very low temperatures using two separate refrigerant loops',
            'It uses only natural refrigerants',
            'It eliminates the need for a compressor',
            'It has a COP above the Carnot limit',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q8'])}
          explanation: 'A cascade system uses two or more refrigerant loops in series with a heat exchanger between them. Each loop handles a smaller temperature range.',
          hint: 'Single-stage cycles struggle to handle very large temperature differences.',
        },
        {
          id: 'u4-L5-Q9',
          type: 'true-false',
          question: 'An absorption refrigeration system replaces the compressor with a heat-driven absorber-generator pair.',
          correctAnswer: true,${diag(diagramMap['u4-L5-Q9'])}
          explanation: 'Absorption cycles use heat (gas, solar, waste heat) instead of mechanical work. The ammonia-water and lithium bromide-water systems are most common.',
          hint: 'These systems are useful where waste heat is available.',
        },
        {
          id: 'u4-L5-Q10',
          type: 'multiple-choice',
          question: 'What happens to system performance if the condenser is dirty and partially blocked?',
          options: [
            'Head pressure rises, COP drops, and energy consumption increases',
            'Head pressure drops, COP improves',
            'Evaporator temperature rises, improving capacity',
            'No change because the expansion valve compensates',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q10'])}
          explanation: 'A dirty condenser can\\'t reject heat effectively. Condensing pressure and temperature rise, making the compressor work harder for less cooling.',
          hint: 'If the condenser can\\'t dump heat, what happens to the pressure?',
        },
        {
          id: 'u4-L5-Q11',
          type: 'multiple-choice',
          question: 'What is the purpose of the accumulator (suction line accumulator) in a refrigeration system?',
          options: [
            'It catches liquid refrigerant before it reaches the compressor',
            'It stores excess refrigerant charge during low-load operation',
            'It reduces pressure pulsations from the compressor',
            'It subcools the liquid before the expansion valve',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q11'])}
          explanation: 'The accumulator sits in the suction line and traps any liquid that didn\\'t fully evaporate, protecting the compressor from liquid slugging.',
          hint: 'Compressors are designed for vapor, not liquid.',
        },
        {
          id: 'u4-L5-Q12',
          type: 'true-false',
          question: 'A thermoelectric cooler (Peltier device) uses refrigerant and a compressor to provide cooling.',
          correctAnswer: false,${diag(diagramMap['u4-L5-Q12'])}
          explanation: 'Peltier devices use the thermoelectric effect. An electric current flowing through a junction of two different materials pumps heat from one side to the other. No refrigerant or compressor needed.',
          hint: 'These are solid-state devices with no moving parts.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // LESSON 5c: Refrigeration (Real-World Systems)
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L5c',
      title: 'Refrigeration: Real Systems',
      description: 'Air conditioning, heat pump sizing, defrost cycles, troubleshooting, and system optimization.',
      icon: '📝',
      xpReward: 25,
      levels: 4,
      questions: [
        {
          id: 'u4-L5c-T1',
          type: 'teaching',
          question: 'Air conditioning systems',
          explanation: 'An AC unit is just a refrigerator that cools indoor air. A "ton of refrigeration" equals 3.517 kW (12,000 BTU/hr). The EER (energy efficiency ratio) and SEER (seasonal EER) rate AC units. Higher SEER = less electricity for the same cooling.',
          hint: 'A typical window AC has SEER around 10-12. Modern mini-splits reach SEER 20-30.',
        },
        {
          id: 'u4-L5c-Q0a',
          type: 'multiple-choice',
          question: '1 ton of refrigeration equals:',
          options: [
            '3.517 kW (12,000 BTU/hr)',
            '1 kW',
            '10 kW',
            '100 BTU/hr',
          ],
          correctIndex: 0,
          explanation: 'One ton of refrigeration is the cooling rate needed to freeze 1 short ton (2000 lb) of ice per day. It equals 3.517 kW.',
          hint: 'This unit comes from the ice-making industry.',
        },
        {
          id: 'u4-L5-Q13',
          type: 'multiple-choice',
          question: 'In a heat pump, what happens during the defrost cycle?',
          options: [
            'The cycle temporarily reverses to melt ice on the outdoor coil',
            'An electric heater warms the indoor coil',
            'The compressor shuts off and fan runs until ice melts',
            'Warm refrigerant bypasses the outdoor coil',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q13'])}
          explanation: 'The reversing valve switches the cycle so the outdoor coil temporarily acts as a condenser, melting the frost with hot refrigerant.',
          hint: 'How do you get heat to the outdoor coil to melt ice?',
        },
        {
          id: 'u4-L5-Q14',
          type: 'multiple-choice',
          question: 'Why does a heat pump become less effective as outdoor temperature drops?',
          options: [
            'The temperature lift increases, requiring more compressor work per unit of heat moved',
            'The refrigerant freezes in the outdoor coil',
            'The indoor thermostat limits the capacity',
            'The defrost cycle runs more often, but this is the only reason',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q14'])}
          explanation: 'As outdoor T drops, the evaporator pressure drops, increasing the pressure ratio. More work per unit of heat delivered means lower COP.',
          hint: 'What happens to COP as the temperature difference increases?',
        },
        {
          id: 'u4-L5c-MP1',
          type: 'match-pairs',
          question: 'Match each system issue to its likely cause.',
          options: ['High head pressure', 'Low suction pressure', 'Liquid slugging', 'Short cycling'],
          matchTargets: ['Dirty condenser or overcharge', 'Low refrigerant or restricted flow', 'Flooded evaporator or no superheat', 'Oversized equipment or faulty thermostat'],
          correctMatches: [0, 1, 2, 3],
          explanation: 'These are common HVAC/R troubleshooting scenarios linking symptoms to root causes.',
          hint: 'Think about what could cause each pressure or operational anomaly.',
        },
        {
          id: 'u4-L5-Q15',
          type: 'fill-blank',
          question: 'The SEER rating stands for _____ Energy Efficiency Ratio and measures seasonal cooling performance.',
          blanks: ['Seasonal'],
          wordBank: ['Seasonal', 'Standard', 'Simple', 'System', 'Steady-state'],${diag(diagramMap['u4-L5-Q15'])}
          explanation: 'SEER accounts for varying outdoor temperatures over a cooling season, giving a more realistic efficiency measure than a single-point EER.',
          hint: 'This rating averages performance over an entire cooling season.',
        },
        {
          id: 'u4-L5-Q16',
          type: 'multiple-choice',
          question: 'Variable-speed (inverter) compressors improve system efficiency by:',
          options: [
            'Matching compressor speed to the actual cooling load, avoiding on-off cycling',
            'Operating at maximum speed at all times',
            'Eliminating the need for an expansion valve',
            'Reducing the refrigerant charge requirement',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q16'])}
          explanation: 'Inverter compressors ramp up and down to match demand. This reduces energy waste from frequent start-stop cycles and maintains steadier temperatures.',
          hint: 'Which is more efficient: adjusting speed to match load, or running full blast and shutting off?',
        },
        {
          id: 'u4-L5-Q17',
          type: 'multiple-choice',
          question: 'In a multi-stage compression refrigeration system, flash gas intercooling:',
          options: [
            'Cools the refrigerant between compressor stages, reducing total work',
            'Heats the refrigerant to prevent liquid at the compressor inlet',
            'Removes oil from the refrigerant stream',
            'Bypasses the expansion valve at part load',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q17'])}
          explanation: 'Flash gas intercooling uses a flash chamber to cool the refrigerant between stages. This moves the process closer to isothermal compression.',
          hint: 'Same principle as intercooling in gas compression, but using the refrigerant itself.',
        },
        {
          id: 'u4-L5-Q18',
          type: 'true-false',
          question: 'An oversized AC unit is worse than a properly sized one because it short-cycles and fails to dehumidify.',
          correctAnswer: true,${diag(diagramMap['u4-L5-Q18'])}
          explanation: 'Oversized units cool the air quickly but shut off before removing enough moisture. This leads to a cold, clammy indoor environment.',
          hint: 'Dehumidification requires the coil to run long enough for moisture to condense.',
        },
        {
          id: 'u4-L5-Q19',
          type: 'multiple-choice',
          question: 'What happens when a system is overcharged with refrigerant?',
          options: [
            'Excess liquid in the condenser raises head pressure and reduces efficiency',
            'The evaporator temperature drops below design, improving cooling',
            'The compressor runs more efficiently with extra refrigerant',
            'Nothing changes because the expansion valve regulates flow',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q19'])}
          explanation: 'Overcharging floods the condenser with liquid, reducing condensing surface area. Head pressure rises, compressor works harder, COP drops.',
          hint: 'Where does excess refrigerant accumulate?',
        },
        {
          id: 'u4-L5-Q20',
          type: 'multiple-choice',
          question: 'Geothermal heat pumps have higher COP than air-source heat pumps because:',
          options: [
            'Ground temperature is more stable and moderate than air temperature',
            'They use a more efficient refrigerant',
            'They have larger compressors',
            'They operate at higher pressures',
          ],
          correctIndex: 0,${diag(diagramMap['u4-L5-Q20'])}
          explanation: 'Ground temperature stays around 10-15C year-round. In winter, this is much warmer than outdoor air, giving a smaller temperature lift and higher COP.',
          hint: 'Compare the heat source temperature for ground vs. air in winter.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // CONVERSATION LESSON
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L-conv',
      title: 'Power Plant Troubleshooting',
      description: 'Diagnose efficiency problems in a steam power plant with your senior engineer.',
      icon: '💬',
      xpReward: 30,
      type: 'conversation',
      levels: 1,
      questions: [],
      conversationStartNodeId: 'u4-L-conv-C1',
      conversationNodes: [
        {
          id: 'u4-L-conv-C1',
          speaker: 'Senior Engineer',
          message: 'Our 500 MW Rankine plant dropped from 38% to 33% thermal efficiency over the last 6 months. Management wants answers. Where do we start?',
          nextNodeId: 'u4-L-conv-D1',
        },
        {
          id: 'u4-L-conv-D1',
          speaker: 'You',
          message: '',
          options: [
            {
              text: 'Check the condenser vacuum and cooling water temperatures first.',
              nextNodeId: 'u4-L-conv-C2a',
              quality: 'great',
              feedback: 'Smart. Condenser issues are the most common cause of gradual efficiency loss in Rankine plants.',
            },
            {
              text: 'Inspect the boiler tubes for fouling and scale buildup.',
              nextNodeId: 'u4-L-conv-C2b',
              quality: 'okay',
              feedback: 'Boiler fouling matters, but condenser problems are more likely to cause a 5-point efficiency drop.',
            },
            {
              text: 'Replace the turbine blades since they must be worn.',
              nextNodeId: 'u4-L-conv-C2c',
              quality: 'poor',
              feedback: 'Jumping to blade replacement is expensive and premature. You should diagnose before prescribing.',
            },
          ],
        },
        {
          id: 'u4-L-conv-C2a',
          speaker: 'Senior Engineer',
          message: 'Good call. The condenser vacuum has degraded from 5 kPa to 12 kPa. Cooling water inlet temp is normal. What does this tell you?',
          nextNodeId: 'u4-L-conv-D2',
        },
        {
          id: 'u4-L-conv-C2b',
          speaker: 'Senior Engineer',
          message: 'We checked the boiler. Some fouling, but nothing major. However, the condenser vacuum degraded from 5 kPa to 12 kPa. What does this mean?',
          nextNodeId: 'u4-L-conv-D2',
        },
        {
          id: 'u4-L-conv-C2c',
          speaker: 'Senior Engineer',
          message: 'Let\\'s back up. Before touching the turbine, I noticed the condenser vacuum went from 5 kPa to 12 kPa. Cooling water inlet is normal. What do you think?',
          nextNodeId: 'u4-L-conv-D2',
        },
        {
          id: 'u4-L-conv-D2',
          speaker: 'You',
          message: '',
          options: [
            {
              text: 'The condenser tubes are likely fouled, reducing heat transfer and raising back-pressure on the turbine.',
              nextNodeId: 'u4-L-conv-C3a',
              quality: 'great',
              feedback: 'Exactly. Higher back-pressure means less enthalpy drop across the turbine, reducing work output.',
            },
            {
              text: 'Air leaks into the condenser are reducing the vacuum.',
              nextNodeId: 'u4-L-conv-C3b',
              quality: 'okay',
              feedback: 'Air leaks can degrade vacuum, but fouled tubes with normal cooling water temperature is more likely here.',
            },
            {
              text: 'The cooling water pump must be failing.',
              nextNodeId: 'u4-L-conv-C3c',
              quality: 'poor',
              feedback: 'If the pump were failing, cooling water flow would drop and the inlet temperature reading wouldn\\'t help. The data points to tube fouling.',
            },
          ],
        },
        {
          id: 'u4-L-conv-C3a',
          speaker: 'Senior Engineer',
          message: 'Confirmed. Cleaning crew found heavy biofouling on the tube surfaces. After cleaning, efficiency recovered to 37.5%. Management asks: how do we prevent this? What\\'s your recommendation?',
          nextNodeId: 'u4-L-conv-D3',
        },
        {
          id: 'u4-L-conv-C3b',
          speaker: 'Senior Engineer',
          message: 'We checked for air leaks. Minor ones found and sealed, but the main issue was biofouling on the condenser tubes. After cleaning, efficiency recovered to 37.5%. How do we prevent recurrence?',
          nextNodeId: 'u4-L-conv-D3',
        },
        {
          id: 'u4-L-conv-C3c',
          speaker: 'Senior Engineer',
          message: 'Pump checked out fine. Turns out the condenser tubes were heavily fouled with biofilm. After cleaning, efficiency went back to 37.5%. How should we prevent this going forward?',
          nextNodeId: 'u4-L-conv-D3',
        },
        {
          id: 'u4-L-conv-D3',
          speaker: 'You',
          message: '',
          options: [
            {
              text: 'Install an automatic tube cleaning system and set up monthly condenser performance monitoring.',
              nextNodeId: 'u4-L-conv-C4a',
              quality: 'great',
              feedback: 'Proactive cleaning and monitoring is the industry best practice. This catches problems early.',
            },
            {
              text: 'Schedule condenser cleaning every 6 months.',
              nextNodeId: 'u4-L-conv-C4b',
              quality: 'okay',
              feedback: 'Better than nothing, but fixed schedules can miss problems that develop faster. Condition-based monitoring is better.',
            },
            {
              text: 'Just clean it when efficiency drops again.',
              nextNodeId: 'u4-L-conv-C4c',
              quality: 'poor',
              feedback: 'Reactive maintenance means you lose revenue during the entire degradation period. Prevention saves money.',
            },
          ],
        },
        {
          id: 'u4-L-conv-C4a',
          speaker: 'Senior Engineer',
          message: 'Great recommendation. Automatic ball cleaning systems cost about $50K but save millions in fuel costs per year. This is exactly the kind of thermodynamic thinking that makes a good plant engineer.',
          nextNodeId: 'u4-L-conv-END',
        },
        {
          id: 'u4-L-conv-C4b',
          speaker: 'Senior Engineer',
          message: 'That\\'s a start. But consider automatic tube cleaning systems. They cost about $50K and pay for themselves in weeks through fuel savings. Something to think about.',
          nextNodeId: 'u4-L-conv-END',
        },
        {
          id: 'u4-L-conv-C4c',
          speaker: 'Senior Engineer',
          message: 'That\\'s how we got into this mess. Reactive maintenance is expensive. Look into automatic cleaning systems and performance monitoring. Prevention beats cure.',
          nextNodeId: 'u4-L-conv-END',
        },
        {
          id: 'u4-L-conv-END',
          speaker: 'Senior Engineer',
          message: 'Nice work today. Remember: in power plant engineering, small efficiency gains translate to huge fuel savings. A 1% improvement on a 500 MW plant saves about $2 million per year in fuel.',
        },
      ],
    },
    // ═══════════════════════════════════════════════════════════
    // SPEED ROUND
    // ═══════════════════════════════════════════════════════════
    {
      id: 'u4-L-speed',
      title: 'Thermo Speed Round',
      description: '15 rapid-fire thermodynamics questions in 60 seconds. How fast can you think?',
      icon: '⚡',
      xpReward: 25,
      type: 'speed-round',
      levels: 1,
      questions: [],
      speedTimeLimit: 60,
      speedQuestions: [
        { id: 'u4-L-speed-SQ1', question: 'What does the first law conserve?', options: ['Energy', 'Entropy', 'Enthalpy', 'Exergy'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ2', question: 'h = u + ?', options: ['Pv', 'Ts', 'Q', 'W'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ3', question: 'COP_HP = COP_R + ?', options: ['1', '0', '2', 'T_H/T_C'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ4', question: 'Carnot efficiency formula?', options: ['1 - T_C/T_H', '1 - T_H/T_C', 'T_C/T_H', 'W/Q_in'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ5', question: 'Quality x = ?', options: ['m_vap/m_total', 'V_vap/V_total', 'h_vap/h_total', 'T/T_sat'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ6', question: 'Ideal gas: u depends on?', options: ['T only', 'P only', 'V only', 'P and T'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ7', question: 'cp - cv = ? (ideal gas)', options: ['R', 'gamma', '0', 'Pv'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ8', question: 'Throttling is?', options: ['Isenthalpic', 'Isentropic', 'Isothermal', 'Isobaric'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ9', question: 'Rankine cycle pump work is?', options: ['Very small', 'Very large', 'Zero', 'Negative'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ10', question: 'Otto cycle heat addition?', options: ['Const. volume', 'Const. pressure', 'Isothermal', 'Isentropic'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ11', question: 'Z = 1 means?', options: ['Ideal gas', 'Real gas', 'Liquid', 'Supercritical'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ12', question: 'Air gamma at room T?', options: ['1.4', '1.0', '1.67', '2.0'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ13', question: 'Entropy of universe?', options: ['Increases', 'Decreases', 'Constant', 'Zero'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ14', question: 'Brayton working fluid?', options: ['Air', 'Steam', 'Refrigerant', 'Helium'], correctIndex: 0 },
        { id: 'u4-L-speed-SQ15', question: '"f" subscript means?', options: ['Sat. liquid', 'Final state', 'Frozen', 'Fluid'], correctIndex: 0 },
      ],
    },
  ],
};
`;

writeFileSync(
  join(root, 'src/data/course/units/unit-4-thermo.ts'),
  output,
  'utf8'
);

console.log('Unit 4 overhaul complete!');
console.log('File written to src/data/course/units/unit-4-thermo.ts');
`;

writeFileSync(join(root, 'scripts/overhaul-unit4.mjs'), output, 'utf8');
console.log('Done');
