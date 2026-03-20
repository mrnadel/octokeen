import type { Unit } from '../types';

export const unit6: Unit = {
  id: 'u6-fluids',
  title: 'Fluid Mechanics',
  description: 'Fluid properties, pipe flow, pumps, and dimensional analysis for mechanical engineering applications.',
  color: '#06B6D4',
  icon: '🌊',
  lessons: [
    {
      id: 'u6-L1',
      title: 'Fluid Properties & Statics',
      description: 'Viscosity, density, surface tension, Pascal\'s law, manometers, and hydrostatic forces on surfaces.',
      icon: '💧',
      xpReward: 20,
      questions: [
        {
          id: 'u6-L1-Q1',
          type: 'multiple-choice',
          question: 'A junior engineer says "pressure at a point in a static fluid depends on the shape of the container." Is this correct, and what principle governs static fluid pressure?',
          options: [
            'Incorrect — Pascal\'s law states that pressure at a given depth depends only on fluid density, gravity, and depth (P = ρgh), not on container shape or total fluid volume',
            'Correct — wider containers have more fluid weight, so pressure at the bottom is higher than in narrow containers at the same depth',
            'Incorrect — pressure is constant throughout any static fluid regardless of depth',
            'Correct — container shape affects the velocity profile, which changes the pressure distribution through Bernoulli\'s equation'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Hydrostatic Paradox</text><rect x="20" y="40" width="60" height="100" rx="0" fill="#DBEAFE" stroke="#334155" stroke-width="2"/><rect x="120" y="40" width="20" height="100" rx="0" fill="#DBEAFE" stroke="#334155" stroke-width="2"/><path d="M 210 40 L 210 140 L 280 140 L 280 40" stroke="#334155" stroke-width="2" fill="#DBEAFE"/><line x1="20" y1="40" x2="80" y2="40" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,3"/><line x1="120" y1="40" x2="140" y2="40" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,3"/><line x1="210" y1="40" x2="280" y2="40" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,3"/><text x="50" y="35" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">h</text><text x="130" y="35" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">h</text><text x="245" y="35" text-anchor="middle" font-size="9" fill="#3B82F6" font-family="sans-serif">h</text><line x1="5" y1="140" x2="95" y2="140" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><line x1="105" y1="140" x2="155" y2="140" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><line x1="195" y1="140" x2="295" y2="140" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><text x="50" y="155" text-anchor="middle" font-size="9" fill="#334155" font-family="sans-serif">P = ρgh</text><text x="130" y="155" text-anchor="middle" font-size="9" fill="#334155" font-family="sans-serif">P = ρgh</text><text x="245" y="155" text-anchor="middle" font-size="9" fill="#334155" font-family="sans-serif">P = ρgh</text><text x="160" y="175" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Same depth h = same pressure (regardless of shape)</text></svg>',
          explanation: 'This is the "hydrostatic paradox." Pressure at a point in a static fluid depends only on the vertical depth below the free surface: P = P_atm + ρgh. A tall, thin tube and a wide swimming pool will have identical pressure at the same depth, despite vastly different total fluid volumes and weights. This follows from Pascal\'s law — pressure is transmitted equally in all directions. The container walls provide the reaction forces that make up the difference in total weight. This principle is why hydraulic systems work: a small force on a small piston can generate a large force on a large piston, because pressure is transmitted undiminished. Bernoulli\'s equation applies only to flowing fluids, not statics.',
          hint: 'Think about the hydrostatic equation: does it include any term for container width or shape?'
        },
        {
          id: 'u6-L1-Q2',
          type: 'multiple-choice',
          question: 'A dam gate pivots at the bottom. An engineer designs the support structure to resist the hydrostatic force acting at the centroid of the gate (mid-height). Why is this design unsafe?',
          options: [
            'The resultant hydrostatic force acts at the center of pressure, which is BELOW the centroid — because pressure increases with depth, the force distribution is bottom-heavy, creating a larger moment than expected',
            'The resultant force acts at the centroid, but the engineer forgot to account for the weight of the gate itself',
            'Hydrostatic force acts at the TOP of the gate because water pressure pushes hardest at the surface where waves form',
            'The centroid calculation is correct for the force location, but the engineer underestimated the magnitude of the force'
          ],
          correctIndex: 0,
          explanation: 'This is a critical distinction: the centroid is where the total force would act if pressure were UNIFORM, but hydrostatic pressure increases linearly with depth (P = ρgh). This bottom-heavy pressure distribution shifts the resultant force below the centroid to the center of pressure. For a vertical rectangle with the top edge at the free surface, the center of pressure is at 2h/3 depth (not h/2). The difference matters enormously for structural design — the moment about the pivot is larger than a centroid-based calculation would predict. For a 10 m tall gate, this error shifts the force by 1.67 m, potentially increasing the moment by 50% and leading to structural failure. Always use the center of pressure formula: y_cp = y_c + I_xc/(y_c × A).',
          hint: 'Pressure is not uniform — it increases with depth. Where does this shift the resultant force?'
        },
        {
          id: 'u6-L1-Q3',
          type: 'multiple-choice',
          question: 'Honey, ketchup, and water all flow differently when poured. What distinguishes a Newtonian fluid from a non-Newtonian fluid, and why does this matter for engineering calculations?',
          options: [
            'A Newtonian fluid has a linear relationship between shear stress and shear rate (τ = μ·du/dy with constant μ). Non-Newtonian fluids have viscosity that changes with shear rate, making standard pipe flow equations invalid.',
            'Newtonian fluids are always low-viscosity like water; non-Newtonian fluids are always thick and viscous like honey',
            'Newtonian fluids obey gravity while non-Newtonian fluids can resist gravity, like ketchup staying in an inverted bottle',
            'The distinction is purely academic — all fluids can be modeled with the same equations by adjusting viscosity'
          ],
          correctIndex: 0,
          explanation: 'Newton\'s law of viscosity (τ = μ·du/dy) assumes a constant proportionality (viscosity μ) between shear stress and shear rate. Water, air, oils, and most simple fluids are Newtonian. Non-Newtonian fluids have viscosity that depends on shear rate: shear-thinning fluids (paint, blood, ketchup) become less viscous when sheared faster — paint flows when brushed but stays put on the wall. Shear-thickening fluids (cornstarch slurry) become more viscous under stress. This matters for engineering because standard equations (Hagen-Poiseuille, Moody chart, Bernoulli) assume Newtonian behavior. For non-Newtonian fluids, modified equations, rheological models (power law, Bingham plastic), and specialized pump selection are required. Many industrial fluids (polymers, food products, drilling mud, concrete) are non-Newtonian.',
          hint: 'Think about the relationship τ = μ × (du/dy). What if μ is not constant?'
        },
        {
          id: 'u6-L1-Q4',
          type: 'multiple-choice',
          question: 'A hydraulic press multiplies force by a factor of 100 using a large piston 100× the area of the small piston. A student claims this violates conservation of energy because "you get 100× the force for free." What is wrong with this reasoning?',
          options: [
            'Force is multiplied but distance is divided by the same ratio — the small piston must travel 100× farther than the large piston, so work input (F×d) equals work output. Energy is conserved.',
            'The energy difference is supplied by the pressurized hydraulic fluid, which stores the extra energy',
            'The 100× force multiplication only works for static loads — for moving loads the force ratio drops to 1:1',
            'Conservation of energy only applies to thermodynamic systems, not mechanical systems like hydraulic presses'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ah" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444"/></marker><marker id="ab" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/></marker></defs><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Hydraulic Press</text><rect x="30" y="100" width="260" height="40" rx="4" fill="#DBEAFE" stroke="#334155" stroke-width="2"/><text x="160" y="125" text-anchor="middle" font-size="11" fill="#1E40AF" font-family="sans-serif">Fluid (P uniform)</text><rect x="50" y="50" width="20" height="50" rx="2" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="60" y="45" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">A</text><rect x="190" y="70" width="80" height="30" rx="2" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="230" y="65" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">100A</text><line x1="60" y1="28" x2="60" y2="50" stroke="#EF4444" stroke-width="2" marker-end="url(#ah)"/><text x="72" y="35" font-size="10" fill="#991B1B" font-family="sans-serif">F</text><line x1="230" y1="70" x2="230" y2="55" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><text x="245" y="57" font-size="10" fill="#1E40AF" font-family="sans-serif">100F</text><line x1="50" y1="155" x2="70" y2="155" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3"/><text x="60" y="168" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">d1 (large)</text><line x1="190" y1="155" x2="270" y2="155" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3"/><text x="230" y="168" text-anchor="middle" font-size="8" fill="#6B7280" font-family="sans-serif">d2 = d1/100</text></svg>',
          explanation: 'Pascal\'s law gives force multiplication: F₂ = F₁ × (A₂/A₁). But since the fluid is incompressible, volume displaced must be equal: A₁ × d₁ = A₂ × d₂, so d₂ = d₁ × (A₁/A₂) = d₁/100. Work in = F₁ × d₁, work out = 100F₁ × d₁/100 = F₁ × d₁. Energy is perfectly conserved — you trade displacement for force, just like a mechanical lever. In real systems, friction losses and fluid compressibility mean work out < work in. This is the fundamental principle behind hydraulic jacks, brakes, excavators, and all hydraulic machinery. The hydraulic fluid transmits pressure, not energy — the energy comes from the operator or pump moving the small piston through a large distance.',
          hint: 'Think about what happens to the displacement when force is multiplied. Consider work = force × distance.'
        },
        {
          id: 'u6-L1-Q5',
          type: 'multiple-choice',
          question: 'Which of the following statements about surface tension is correct for engineering applications?',
          options: [
            'Surface tension increases with temperature for most liquids',
            'Capillary rise in a tube is inversely proportional to tube diameter',
            'Surface tension has units of N/m² (same as pressure)',
            'Surface tension effects become negligible as the characteristic length decreases'
          ],
          correctIndex: 1,
          explanation: 'Capillary rise h = 4σcos(θ)/(ρgd), which shows it is inversely proportional to tube diameter d. Surface tension decreases with temperature (not increases), has units of N/m (force per length, not area), and becomes more significant (not negligible) at small length scales — this is why microfluidics must account for surface tension effects.',
          hint: 'Consider the capillary rise equation and how each variable affects the height.'
        },
        {
          id: 'u6-L1-Q6',
          type: 'fill-blank',
          question: 'The ratio of dynamic viscosity to density (μ/ρ) is called the _____ viscosity, with SI units of m²/s.',
          acceptedAnswers: ['kinematic', 'Kinematic', 'KINEMATIC'],
          explanation: 'Kinematic viscosity ν = μ/ρ combines the fluid\'s resistance to deformation (dynamic viscosity μ) with its density. It appears naturally in the Reynolds number (Re = VD/ν) and governs how momentum diffuses through the fluid. Water at 20°C has ν ≈ 1.0 × 10⁻⁶ m²/s, while air has ν ≈ 1.5 × 10⁻⁵ m²/s — air actually has HIGHER kinematic viscosity than water despite being much less "thick," because its density is ~800× lower. This explains why air boundary layers are thicker than water boundary layers at the same velocity. The kinematic viscosity is also called "momentum diffusivity," analogous to thermal diffusivity (α = k/(ρc_p)) for heat and mass diffusivity for species transport.',
          hint: 'This form of viscosity has units of m²/s and appears in the Reynolds number formula Re = VD/___.'
        }
      ]
    },
    {
      id: 'u6-L2',
      title: 'Bernoulli & Energy Equation',
      description: 'Bernoulli equation, venturi meter, pitot tube, energy line/HGL, assumptions and limitations.',
      icon: '🎢',
      xpReward: 25,
      questions: [
        {
          id: 'u6-L2-Q1',
          type: 'multiple-choice',
          question: 'An engineer applies the Bernoulli equation to calculate flow through a long, rough industrial pipe and gets a result that significantly overestimates the actual flow rate. What is the most likely error in the analysis?',
          options: [
            'Bernoulli assumes inviscid (frictionless) flow — in a long rough pipe, friction losses are significant and must be accounted for using the energy equation with head loss terms',
            'Bernoulli only works for gases, not liquids — a different equation is needed for water flow',
            'The pipe diameter was measured incorrectly, causing an error in the continuity equation',
            'Bernoulli does not apply to horizontal pipes — it only works for flow with elevation changes'
          ],
          correctIndex: 0,
          explanation: 'This is one of the most common mistakes in fluid mechanics. Bernoulli\'s equation assumes steady, incompressible, INVISCID flow along a streamline. In a long pipe with rough walls, viscous friction converts kinetic energy into thermal energy, causing pressure to drop faster than Bernoulli predicts. The correct approach is the extended energy equation: P₁/ρg + V₁²/2g + z₁ = P₂/ρg + V₂²/2g + z₂ + h_f + Σh_minor, where h_f = f(L/D)(V²/2g) accounts for friction (Darcy-Weisbach) and Σh_minor accounts for fittings and valves. Bernoulli is an excellent tool for short, smooth sections (nozzles, venturis, pitot tubes) but NOT for pipe system analysis. Knowing when Bernoulli applies — and when it does not — is a fundamental engineering judgment skill.',
          hint: 'What are the assumptions of the Bernoulli equation, and which one is violated in a long rough pipe?'
        },
        {
          id: 'u6-L2-Q2',
          type: 'true-false',
          question: 'A pitot tube can accurately measure air velocity in a ventilation duct regardless of whether the flow is laminar or turbulent, as long as the probe is aligned with the flow direction.',
          correctAnswer: false,
          explanation: 'A pitot tube measures the velocity at a SINGLE POINT — it gives the local velocity where the probe tip is positioned. In turbulent pipe flow, the velocity profile is relatively flat (but not uniform), and in laminar flow the profile is parabolic. To get the average velocity (and therefore flow rate), you cannot just measure at one point. In practice, engineers use a "traverse" — measuring at multiple radial positions and averaging — or place the probe at the specific radius where local velocity equals the average (r ≈ 0.762R for turbulent flow). Simply measuring at the centerline gives the MAXIMUM velocity, which overestimates the average by ~18% for turbulent flow and 100% for laminar flow. This distinction between point measurement and average velocity is crucial for flow metering accuracy.',
          hint: 'Think about what velocity (local vs. average) a pitot tube actually measures.'
        },
        {
          id: 'u6-L2-Q3',
          type: 'multiple-choice',
          question: 'A pitot-static tube in an air duct reads a stagnation pressure of 101.8 kPa and a static pressure of 101.3 kPa (ρ_air = 1.2 kg/m³). What is the air velocity?',
          options: [
            '20.4 m/s',
            '28.9 m/s',
            '40.8 m/s',
            '14.4 m/s'
          ],
          correctIndex: 1,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ab" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/></marker></defs><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Pitot-Static Tube</text><rect x="10" y="50" width="300" height="70" rx="0" fill="#DBEAFE" stroke="#334155" stroke-width="2" opacity="0.3"/><text x="300" y="45" text-anchor="end" font-size="9" fill="#334155" font-family="sans-serif">Duct wall</text><line x1="10" y1="75" x2="100" y2="75" stroke="#3B82F6" stroke-width="1.5" marker-end="url(#ab)"/><line x1="10" y1="85" x2="100" y2="85" stroke="#3B82F6" stroke-width="1.5" marker-end="url(#ab)"/><line x1="10" y1="95" x2="100" y2="95" stroke="#3B82F6" stroke-width="1.5" marker-end="url(#ab)"/><text x="50" y="70" font-size="9" fill="#1E40AF" font-family="sans-serif">V (flow)</text><line x1="160" y1="85" x2="160" y2="30" stroke="#334155" stroke-width="2"/><circle cx="160" cy="85" r="3" fill="#334155"/><text x="175" y="35" font-size="9" fill="#334155" font-family="sans-serif">P_stag</text><line x1="200" y1="85" x2="200" y2="30" stroke="#6B7280" stroke-width="1.5"/><circle cx="200" cy="85" r="2" fill="none" stroke="#6B7280" stroke-width="1.5"/><text x="210" y="35" font-size="9" fill="#6B7280" font-family="sans-serif">P_static</text><text x="160" y="145" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">V = sqrt(2(P_stag - P_static)/ρ)</text><text x="160" y="165" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">= sqrt(2 × 500 / 1.2) = 28.9 m/s</text></svg>',
          explanation: 'From Bernoulli: V = sqrt(2(P_stag - P_static)/ρ) = sqrt(2 × 500 / 1.2) = sqrt(833.3) ≈ 28.9 m/s. The pitot-static tube directly measures the dynamic pressure (P_stag - P_static = ½ρV²). Key assumptions: (1) incompressible flow — valid since 28.9 m/s << speed of sound (343 m/s), so Mach < 0.1; (2) the probe is aligned with the flow direction; (3) the static port is not affected by the probe body. This is one of the most practical and direct applications of the Bernoulli equation.',
          hint: 'Dynamic pressure = stagnation - static = ½ρV². Solve for V.'
        },
        {
          id: 'u6-L2-Q4',
          type: 'multiple-choice',
          question: 'In a pipe flow system, the Hydraulic Grade Line (HGL) drops below the pipe centerline at a high point. What does this indicate?',
          options: [
            'Flow has reached sonic velocity at that point',
            'The static pressure at that point is below atmospheric, creating potential for cavitation or air ingestion',
            'The flow has become turbulent at that section',
            'The total energy of the flow has increased due to a pump'
          ],
          correctIndex: 1,
          explanation: 'The HGL represents the sum of pressure head and elevation head (P/ρg + z). When the HGL drops below the pipe, the pressure head is negative gauge (below atmospheric). This is dangerous because it can cause cavitation if pressure drops below vapor pressure, or air can be drawn in through any leaks. This is a key consideration in pipeline design over hills.',
          hint: 'Consider what the HGL physically represents in terms of pressure.'
        },
        {
          id: 'u6-L2-Q5',
          type: 'multiple-choice',
          question: 'A water main runs over a hill that is 8 meters above the pipeline\'s normal elevation. During high-demand periods, users on the hill report sputtering faucets and air in the water. What is the fluid mechanics explanation for this problem?',
          options: [
            'At the hilltop, the Hydraulic Grade Line drops below the pipe elevation — the gauge pressure becomes negative (below atmospheric), allowing dissolved air to come out of solution and potentially causing cavitation',
            'The water moves faster uphill due to gravity acceleration, reducing the flow available to hilltop users',
            'The pipe diameter is too large on the hill section, causing the flow to slow down and stop',
            'Thermal expansion of the pipe on the sun-exposed hilltop reduces the internal diameter and restricts flow'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">EGL &amp; HGL Over a Hill</text><path d="M 20 140 L 80 140 Q 160 30 240 140 L 300 140" stroke="#334155" stroke-width="2.5" fill="none"/><text x="160" y="55" font-size="9" fill="#334155" font-family="sans-serif">pipe (hill)</text><line x1="20" y1="110" x2="300" y2="120" stroke="#10B981" stroke-width="2"/><text x="305" y="118" font-size="9" fill="#065F46" font-family="sans-serif">EGL</text><line x1="20" y1="120" x2="300" y2="128" stroke="#3B82F6" stroke-width="2" stroke-dasharray="5,3"/><text x="305" y="130" font-size="9" fill="#1E40AF" font-family="sans-serif">HGL</text><line x1="130" y1="72" x2="130" y2="122" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3"/><line x1="190" y1="72" x2="190" y2="122" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3"/><rect x="120" y="72" width="80" height="18" rx="2" fill="#FEE2E2" stroke="#EF4444" stroke-width="1"/><text x="160" y="84" text-anchor="middle" font-size="8" fill="#991B1B" font-family="sans-serif">HGL below pipe!</text><text x="160" y="100" text-anchor="middle" font-size="8" fill="#991B1B" font-family="sans-serif">P &lt; P_atm</text><text x="160" y="165" text-anchor="middle" font-size="10" fill="#6B7280" font-family="sans-serif">Negative gauge pressure at hilltop</text></svg>',
          explanation: 'The Hydraulic Grade Line (HGL = P/ρg + z) represents the pressure head at each point. As the pipe rises over the hill, elevation z increases. If the HGL drops below the pipe elevation, the gauge pressure becomes negative (sub-atmospheric). This has several consequences: (1) dissolved gases come out of solution (Henry\'s law), creating air pockets; (2) if pressure drops below vapor pressure, cavitation occurs; (3) any small leak draws air IN rather than leaking water out. Solutions include: increasing the system pressure (booster pump), reducing pipe friction to maintain a higher HGL, installing air release valves at the hilltop, or rerouting the pipe to avoid the elevation rise. This HGL analysis is fundamental to pipeline design for water distribution systems.',
          hint: 'Think about what happens to the pressure as the pipe elevation increases. Draw the EGL and HGL.'
        },
        {
          id: 'u6-L2-Q6',
          type: 'fill-blank',
          question: 'The line representing total head (pressure head + velocity head + elevation head) in a pipe system is called the ___ Line.',
          acceptedAnswers: ['Energy Grade', 'energy grade', 'Energy', 'energy', 'EGL', 'egl', 'Total Energy'],
          explanation: 'The Energy Grade Line (EGL) represents the total mechanical energy at each point: P/ρg + V²/2g + z. It slopes downward in the direction of flow due to friction losses, and drops sharply at minor losses (valves, fittings). The HGL sits below the EGL by exactly V²/2g (the velocity head).',
          hint: 'This line is always above the HGL by exactly the velocity head.'
        }
      ]
    },
    {
      id: 'u6-L3',
      title: 'Pipe Flow & Losses',
      description: 'Reynolds number, laminar vs turbulent, Moody chart, major/minor losses, Darcy-Weisbach, pipe networks.',
      icon: '🔧',
      xpReward: 25,
      questions: [
        {
          id: 'u6-L3-Q1',
          type: 'multiple-choice',
          question: 'A building\'s plumbing system was designed 30 years ago with galvanized steel pipes. Over time, the flow rates at fixtures have decreased despite no changes to the supply pressure. What is the fluid mechanics explanation?',
          options: [
            'Corrosion and mineral deposits have increased the pipe roughness and reduced the effective diameter — both effects increase friction losses and reduce flow at the same supply pressure',
            'The water supply pressure has decreased over 30 years due to aging pumps at the municipal water plant',
            'Galvanized steel naturally shrinks over time due to thermal cycling, reducing the pipe diameter',
            'Biofilm growth on the pipe walls has made the fluid more viscous, increasing the Reynolds number and friction'
          ],
          correctIndex: 0,
          explanation: 'This is a classic aging infrastructure problem with clear fluid mechanics principles. Over decades, galvanized steel pipes develop internal corrosion (rust) and mineral scale deposits that: (1) increase surface roughness ε, which increases the friction factor f on the Moody chart, and (2) reduce the effective internal diameter D. Both effects compound — from Darcy-Weisbach, h_f = f(L/D)(V²/2g), a smaller D simultaneously increases L/D, increases velocity V (for the same flow rate through a smaller area), AND increases f (higher ε/D ratio). A pipe that started with ε/D ≈ 0.001 might deteriorate to ε/D ≈ 0.01-0.05, dramatically increasing friction losses. This is why aging buildings are often re-piped with copper or PEX, and why engineers must consider long-term fouling when sizing pipes.',
          hint: 'Think about the Darcy-Weisbach equation and what changes as pipes corrode internally.'
        },
        {
          id: 'u6-L3-Q2',
          type: 'multiple-choice',
          question: 'When sizing a pipe for a new installation, an engineer must balance pipe diameter against cost. What happens to friction head loss if you halve the pipe diameter while keeping the same flow rate?',
          options: [
            'Head loss increases by roughly 32× — velocity increases 4× (due to A ∝ D²), and h_f ∝ V²/D, so the combined effect is approximately D⁻⁵',
            'Head loss doubles, because resistance is inversely proportional to diameter',
            'Head loss increases by 4×, because the velocity doubles when diameter halves',
            'Head loss increases by 16×, because both velocity and the L/D ratio double'
          ],
          correctIndex: 0,
          explanation: 'This is one of the most important practical relationships in pipe sizing. From Darcy-Weisbach: h_f = f(L/D)(V²/2g). At constant flow rate Q, velocity V = Q/A = 4Q/(πD²), so V ∝ 1/D². Substituting: h_f ∝ (1/D)(1/D²)² = 1/D⁵ (assuming f is roughly constant). Halving D increases head loss by 2⁵ = 32×! This extreme sensitivity explains why pipe diameter is the most critical parameter in pipe system design. Oversizing the pipe slightly (by one standard size) can dramatically reduce pumping costs over the system\'s lifetime. Conversely, undersizing even slightly creates enormous pressure drops. This D⁻⁵ relationship (sometimes expressed as Q² × D⁻⁵ for flow dependence) is why experienced engineers rarely skimp on pipe diameter.',
          hint: 'Express velocity in terms of Q and D, substitute into Darcy-Weisbach, and see how h_f depends on D.'
        },
        {
          id: 'u6-L3-Q3',
          type: 'true-false',
          question: 'On the Moody chart, at very high Reynolds numbers (fully rough turbulent zone), the friction factor depends only on relative roughness ε/D and is independent of Reynolds number.',
          correctAnswer: true,
          explanation: 'In the fully rough turbulent zone, the viscous sublayer is so thin that roughness elements protrude through it, and skin friction is dominated by pressure drag on the roughness elements. The friction factor becomes independent of Re and depends only on ε/D. This is reflected in the Moody chart where the curves become horizontal at high Re, and by the von Kármán equation: 1/√f = −2 log(ε/3.7D).',
          hint: 'Think about what happens when roughness elements are much larger than the viscous sublayer.'
        },
        {
          id: 'u6-L3-Q4',
          type: 'multiple-choice',
          question: 'A pipe system has 200 m of straight pipe and 30 fittings (elbows, valves, tees). A junior engineer calculates only the major (friction) losses and ignores minor losses from fittings, arguing they are called "minor" so they must be small. When is this assumption dangerously wrong?',
          options: [
            'In short, fitting-dense systems (like a compact plant room) where minor losses from fittings can equal or exceed the major pipe friction losses — "minor" refers to being local, not small',
            'Minor losses are always truly minor — the name is accurate and they can be safely ignored in all cases',
            'Only in laminar flow systems, where the friction factor is lower and minor losses become relatively more important',
            'Only when the pipe diameter exceeds 300 mm, because larger fittings have disproportionately higher K values'
          ],
          correctIndex: 0,
          explanation: 'The term "minor losses" is misleading — it refers to losses that are LOCAL (occurring at a specific point) rather than distributed along the pipe length. In reality, minor losses can dominate the total system loss. Each fitting contributes h_minor = K(V²/2g), and in a compact system with many elbows, valves, reducers, and tees, the sum ΣK can be large. A general 90° elbow has K ≈ 0.9, a fully open gate valve K ≈ 0.2, a globe valve K ≈ 10. In a system with 30 fittings averaging K = 2, the equivalent length of minor losses is ΣK/f × D ≈ 2×30/0.02 × 0.15 = 450 m — more than double the actual pipe length! Always calculate both major and minor losses. The equivalent-length method (converting fittings to equivalent pipe length) is a practical way to include both.',
          hint: 'Calculate the equivalent pipe length of the fittings and compare it to the actual pipe length.'
        },
        {
          id: 'u6-L3-Q5',
          type: 'multiple-choice',
          question: 'For parallel pipe branches, what fundamental constraint determines how flow splits between the branches, and why is this different from series pipe connections?',
          options: [
            'In parallel branches, the head loss must be EQUAL across all branches (same pressure drop from junction to junction), while in series pipes the FLOW RATE is the same through all pipes',
            'In parallel branches, the flow rate is equal in each branch, while in series pipes the pressure drop is equal across each pipe',
            'In parallel branches, the velocity must be equal in all branches to satisfy Bernoulli\'s equation',
            'There is no constraint — flow distributes randomly in parallel branches'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ab" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/></marker></defs><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Parallel vs. Series Pipes</text><text x="85" y="30" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155" font-family="sans-serif">Parallel</text><circle cx="30" cy="70" r="5" fill="#334155"/><text x="30" y="60" text-anchor="middle" font-size="8" fill="#334155" font-family="sans-serif">A</text><circle cx="140" cy="70" r="5" fill="#334155"/><text x="140" y="60" text-anchor="middle" font-size="8" fill="#334155" font-family="sans-serif">B</text><path d="M 35 70 Q 85 40 135 70" stroke="#3B82F6" stroke-width="2" fill="none" marker-end="url(#ab)"/><path d="M 35 70 Q 85 100 135 70" stroke="#3B82F6" stroke-width="2" fill="none" marker-end="url(#ab)"/><text x="85" y="45" text-anchor="middle" font-size="8" fill="#1E40AF" font-family="sans-serif">Q_A</text><text x="85" y="105" text-anchor="middle" font-size="8" fill="#1E40AF" font-family="sans-serif">Q_B</text><text x="85" y="120" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">h_f,A = h_f,B</text><text x="85" y="132" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Q = Q_A + Q_B</text><text x="245" y="30" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155" font-family="sans-serif">Series</text><line x1="175" y1="70" x2="225" y2="70" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><line x1="235" y1="70" x2="285" y2="70" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><circle cx="175" cy="70" r="4" fill="#334155"/><circle cx="230" cy="70" r="4" fill="#334155"/><circle cx="290" cy="70" r="4" fill="#334155"/><text x="200" y="62" text-anchor="middle" font-size="8" fill="#1E40AF" font-family="sans-serif">Pipe 1</text><text x="260" y="62" text-anchor="middle" font-size="8" fill="#1E40AF" font-family="sans-serif">Pipe 2</text><text x="245" y="95" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Q same in both</text><text x="245" y="107" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">h_f = h_f,1 + h_f,2</text></svg>',
          explanation: 'This is directly analogous to electrical circuits. In parallel pipes (like parallel resistors), the "voltage" (pressure drop / head loss) is the same across all branches, while the "current" (flow rate) divides. In series pipes (like series resistors), the "current" (flow rate) is the same through all pipes, while the "voltage" (head loss) divides. For parallel branches: h_f,A = h_f,B, meaning K_A × Q_A² = K_B × Q_B², so Q_A/Q_B = √(K_B/K_A). The lower-resistance branch carries more flow. This principle governs pipe network analysis, manifold design, and flow distribution in heat exchangers. Getting even flow distribution (important in heat exchangers and cooling systems) requires making all parallel paths have equal resistance.',
          hint: 'Think about the pressure at the junction where branches split and where they rejoin. What must be true?'
        },
        {
          id: 'u6-L3-Q6',
          type: 'fill-blank',
          question: 'The head loss equation h_f = f(L/D)(V²/2g), which relates friction losses in pipe flow to the friction factor, pipe geometry, and velocity, is called the _____-Weisbach equation.',
          acceptedAnswers: ['Darcy', 'darcy', 'DARCY'],
          explanation: 'The Darcy-Weisbach equation h_f = f(L/D)(V²/2g) is the fundamental equation for calculating friction head loss in pipe flow. It applies to both laminar and turbulent flow — only the method of determining the friction factor f changes (f = 64/Re for laminar, Moody chart or Colebrook equation for turbulent). Head loss is proportional to pipe length, inversely proportional to diameter, and proportional to velocity squared. This equation, combined with the Moody chart for determining f, forms the backbone of all pipe system design and pump sizing calculations.',
          hint: 'This equation is named after Henry _____ and Julius Weisbach.'
        }
      ]
    },
    {
      id: 'u6-L4',
      title: 'Pumps & Turbomachinery',
      description: 'Pump curves, system curves, NPSH, cavitation, specific speed, affinity laws, pump selection.',
      icon: '⚙️',
      xpReward: 30,
      questions: [
        {
          id: 'u6-L4-Q1',
          type: 'multiple-choice',
          question: 'Compare centrifugal pumps vs. positive displacement pumps for pumping a high-viscosity fluid (like heavy oil at 500 cP). Which type is better suited, and why?',
          options: [
            'Positive displacement pumps — their flow rate is nearly independent of viscosity and they maintain efficiency with thick fluids. Centrifugal pumps lose head and efficiency dramatically as viscosity increases.',
            'Centrifugal pumps — their impeller generates more shear, which thins the oil and makes it easier to pump',
            'Either type works equally well — viscosity only affects the pipe system, not the pump itself',
            'Centrifugal pumps — they handle the higher pressure drop caused by viscous flow better due to their continuous flow characteristic'
          ],
          correctIndex: 0,
          explanation: 'This is one of the most important pump selection criteria. Centrifugal pumps rely on converting kinetic energy (velocity) to pressure, and high viscosity dampens the flow within the impeller, drastically reducing head and efficiency — a centrifugal pump rated for water might deliver only 30-50% of its rated head with heavy oil. Positive displacement (PD) pumps (gear, screw, lobe, piston) physically trap and push a fixed volume per revolution regardless of viscosity. Their flow rate is nearly constant vs. viscosity, and they actually seal BETTER with viscous fluids (less internal slip). The trade-off: PD pumps create pulsating flow, require relief valves for overpressure protection, and have higher maintenance costs. Rule of thumb: use centrifugal for water-like fluids (< 100 cP), PD for viscous fluids (> 100-200 cP).',
          hint: 'Think about how each pump type generates pressure and how viscosity affects that mechanism.'
        },
        {
          id: 'u6-L4-Q2',
          type: 'multiple-choice',
          question: 'A centrifugal pump works perfectly when pumping cold water (20°C) but cavitates severely when switched to hot water (90°C) in the same piping system with the same suction configuration. What is the thermodynamic explanation?',
          options: [
            'Hot water has much higher vapor pressure (~70 kPa at 90°C vs. ~2.3 kPa at 20°C), so the available NPSH drops drastically — the suction pressure that was safely above vapor pressure for cold water is now dangerously close to it',
            'Hot water is less viscous, so it flows faster through the suction pipe, creating higher velocity and lower static pressure at the pump inlet',
            'Hot water expands and becomes less dense, so the pump cannot generate enough head to overcome gravity in the suction line',
            'The pump seals soften at high temperature, allowing air ingestion that mimics cavitation symptoms'
          ],
          correctIndex: 0,
          explanation: 'Cavitation occurs when local pressure drops below the fluid\'s vapor pressure. NPSH_available = (P_atm - P_vapor)/(ρg) - z_s - h_losses. At 20°C, P_vapor ≈ 2.3 kPa, giving (101.3 - 2.3)/(ρg) ≈ 10.1 m of margin from atmospheric pressure. At 90°C, P_vapor ≈ 70 kPa, reducing the margin to (101.3 - 70)/(ρg) ≈ 3.3 m — a loss of nearly 7 m of available NPSH! The fix is not a different pump but a different INSTALLATION: place the pump below the tank (flooded suction reduces z_s), shorten and straighten the suction pipe (reduce h_losses), and increase suction pipe diameter. This is exactly why boiler feed pumps are always positioned at the lowest point in the system and are fed by elevated deaerator tanks.',
          hint: 'Look at the NPSH_available equation and consider how vapor pressure changes with temperature.'
        },
        {
          id: 'u6-L4-Q3',
          type: 'true-false',
          question: 'When two identical centrifugal pumps are connected in series, the combined flow rate doubles while the head remains the same as a single pump.',
          correctAnswer: false,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><defs><marker id="ab" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/></marker></defs><text x="85" y="14" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B" font-family="sans-serif">Series: H adds</text><text x="245" y="14" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B" font-family="sans-serif">Parallel: Q adds</text><line x1="165" y1="5" x2="165" y2="120" stroke="#6B7280" stroke-width="1" stroke-dasharray="4,3"/><line x1="20" y1="55" x2="55" y2="55" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><circle cx="70" cy="55" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="70" y="59" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">P</text><line x1="82" y1="55" x2="98" y2="55" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><circle cx="113" cy="55" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="113" y="59" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">P</text><line x1="125" y1="55" x2="155" y2="55" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><text x="90" y="82" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Same Q, H = 2H</text><line x1="180" y1="40" x2="210" y2="40" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><circle cx="225" cy="40" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="225" y="44" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">P</text><line x1="237" y1="40" x2="270" y2="40" stroke="#3B82F6" stroke-width="2"/><line x1="180" y1="70" x2="210" y2="70" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><circle cx="225" cy="70" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="2"/><text x="225" y="74" text-anchor="middle" font-size="9" fill="#1E293B" font-family="sans-serif">P</text><line x1="237" y1="70" x2="270" y2="70" stroke="#3B82F6" stroke-width="2"/><line x1="270" y1="40" x2="270" y2="70" stroke="#3B82F6" stroke-width="1.5"/><line x1="270" y1="55" x2="300" y2="55" stroke="#3B82F6" stroke-width="2" marker-end="url(#ab)"/><line x1="180" y1="40" x2="180" y2="70" stroke="#3B82F6" stroke-width="1.5"/><text x="245" y="98" text-anchor="middle" font-size="9" fill="#6B7280" font-family="sans-serif">Same H, Q = 2Q</text></svg>',
          explanation: 'Pumps in series add their heads at the same flow rate — they do NOT double the flow. The combined head is approximately 2H at any given Q. Pumps in parallel add flow rates at the same head. This is analogous to electrical circuits: series = more "voltage" (head), parallel = more "current" (flow). The actual operating point depends on the system curve intersection.',
          hint: 'Think about what happens to the pressure as fluid passes through one pump and then the next.'
        },
        {
          id: 'u6-L4-Q4',
          type: 'multiple-choice',
          question: 'A pump operating point is where the pump curve intersects the system curve. If a control valve downstream is partially closed, what happens to the operating point and why might this be a problem?',
          options: [
            'The system curve shifts upward (steeper), moving the operating point to lower flow and higher head — the pump works harder against the restriction, and if pushed too far left on the curve, it may enter an unstable/surge region',
            'The pump curve shifts downward because the valve adds resistance to the pump itself',
            'The operating point does not change — the control valve only affects downstream pressure, not the pump',
            'The system curve shifts downward, reducing the head the pump must produce and increasing flow rate'
          ],
          correctIndex: 0,
          diagram: '<svg viewBox="0 0 320 180" width="100%"><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E293B" font-family="sans-serif">Pump &amp; System Curves</text><text x="22" y="90" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">H</text><text x="175" y="172" text-anchor="middle" font-size="11" fill="#1E293B" font-family="sans-serif">Q</text><line x1="35" y1="20" x2="35" y2="165" stroke="#334155" stroke-width="2"/><line x1="35" y1="165" x2="310" y2="165" stroke="#334155" stroke-width="2"/><path d="M 40 40 Q 120 45 200 80 Q 260 110 295 155" stroke="#3B82F6" stroke-width="2.5" fill="none"/><text x="295" y="148" font-size="9" fill="#1E40AF" font-family="sans-serif">Pump</text><path d="M 40 130 Q 130 115 200 80 Q 250 55 290 30" stroke="#10B981" stroke-width="2" fill="none"/><text x="280" y="25" font-size="9" fill="#065F46" font-family="sans-serif">System</text><path d="M 40 110 Q 100 95 155 60 Q 200 35 240 20" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="5,3"/><text x="240" y="18" font-size="8" fill="#991B1B" font-family="sans-serif">Valve closed</text><circle cx="200" cy="80" r="4" fill="#334155"/><text x="205" y="95" font-size="9" fill="#334155" font-family="sans-serif">OP1</text><circle cx="140" cy="55" r="4" fill="#EF4444"/><text x="120" y="50" font-size="9" fill="#991B1B" font-family="sans-serif">OP2</text><line x1="200" y1="80" x2="140" y2="55" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#ah)"/></svg>',
          explanation: 'The system curve represents the total head the piping system requires at each flow rate: H_system = H_static + K_total × Q². Closing a valve increases K_total (adds resistance), making the parabola steeper. The pump curve (H vs. Q, characteristic of the pump at a given speed) does not change. The new intersection point is at lower Q and higher H — the pump "rides up" its curve. Problems arise if the operating point moves too far left: (1) the pump operates at low efficiency, (2) radial thrust increases on the impeller (bearing wear), (3) the flow may become unstable (recirculation, surging), and (4) minimum flow requirements may be violated, causing overheating. This is why VFD (variable frequency drive) speed control is preferred over throttling — it adjusts the pump curve rather than wasting energy across a valve.',
          hint: 'Draw the pump curve and system curve. What happens to their intersection when you add resistance?'
        },
        {
          id: 'u6-L4-Q5',
          type: 'multiple-choice',
          question: 'Cavitation in a centrifugal pump most commonly damages which component first?',
          options: [
            'The volute casing near the discharge',
            'The impeller vane surfaces near the inlet (eye)',
            'The mechanical seal faces',
            'The pump shaft at the coupling'
          ],
          correctIndex: 1,
          explanation: 'Cavitation damage occurs where vapor bubbles collapse — primarily on the low-pressure side of impeller vanes near the inlet (suction side/eye). The implosion of vapor bubbles creates localized pressure spikes that erode the metal surface, creating characteristic pitting. This is why NPSH analysis focuses on suction conditions, and why the impeller eye region is often the first to show cavitation damage.',
          hint: 'Think about where the pressure is lowest in the pump.'
        },
        {
          id: 'u6-L4-Q6',
          type: 'fill-blank',
          question: 'The minimum suction head required by a pump to avoid cavitation, specified by the manufacturer, is called NPSH___ (subscript).',
          acceptedAnswers: ['R', 'r', 'required', 'Required', 'REQUIRED'],
          explanation: 'NPSH_R (required) is determined by the pump manufacturer through testing — it is the minimum net positive suction head needed to prevent more than 3% head drop due to cavitation. The system designer must ensure that NPSH_A (available from the system) exceeds NPSH_R with an adequate safety margin, typically at least 0.5–1.0 m or 10–20%.',
          hint: 'There are two types of NPSH: one from the system (available) and one from the pump.'
        }
      ]
    },
    {
      id: 'u6-L5',
      title: 'Dimensional Analysis',
      description: 'Buckingham Pi theorem, dimensional homogeneity, similitude, Reynolds/Froude/Mach numbers, model testing.',
      icon: '📐',
      xpReward: 25,
      questions: [
        {
          id: 'u6-L5-Q1',
          type: 'multiple-choice',
          question: 'Why is dimensional analysis such a powerful tool in engineering, even though it does not solve the underlying physics equations?',
          options: [
            'It reduces the number of independent variables by grouping them into dimensionless parameters — a problem with 7 variables and 3 dimensions becomes 4 dimensionless groups, collapsing hundreds of experiments into a manageable set',
            'It directly solves the Navier-Stokes equations without numerical methods',
            'It eliminates the need for experimental testing by predicting exact numerical results',
            'It only works for simple linear systems, but for those systems it gives exact answers'
          ],
          correctIndex: 0,
          explanation: 'The Buckingham Pi theorem states that n variables involving k fundamental dimensions can be expressed as (n-k) independent dimensionless groups. Instead of varying 7 parameters independently (potentially thousands of test combinations), you vary 4 dimensionless groups. Moreover, these groups reveal the physics: the Reynolds number captures the inertia-viscosity balance, the Froude number captures gravity effects, etc. The same dimensionless relationships apply at any scale — a wind tunnel test at Re = 10⁶ on a model predicts the same drag coefficient as full-scale flight at Re = 10⁶. This principle underlies ALL engineering correlations (Nusselt number for heat transfer, friction factor for pipe flow, drag coefficient for aerodynamics). Dimensional analysis does not give the functional form — experiments or theory must still determine that — but it drastically reduces what needs to be measured.',
          hint: 'Think about how many experiments you would need with vs. without dimensionless grouping.'
        },
        {
          id: 'u6-L5-Q2',
          type: 'multiple-choice',
          question: 'A naval architect is testing a 1:25 scale ship model in a towing tank using Froude number similarity. A colleague points out that the Reynolds number of the model is far lower than the full-scale ship. Why is Froude similarity chosen over Reynolds similarity for ship testing, despite this mismatch?',
          options: [
            'Ship resistance is dominated by wave-making drag (governed by Froude number), and matching Reynolds similarity would require impossibly high model speeds — so engineers match Froude, accept the Re mismatch, and correct for viscous effects separately',
            'Reynolds number does not apply to ships because they operate on the water surface, not submerged',
            'The towing tank water has lower viscosity than seawater, which naturally compensates for the Reynolds number mismatch',
            'Froude similarity is simpler to calculate, so it is chosen for convenience despite giving less accurate results'
          ],
          correctIndex: 0,
          explanation: 'Ships create waves that extract energy (wave-making drag), and wave patterns are governed by the Froude number Fr = V/sqrt(gL). Matching Reynolds number at 1:25 scale would require V_model = V_ship × (L_ship/L_model) = V_ship × 25 — impossibly high speeds that would create compressibility effects and spray. Furthermore, achieving simultaneous Fr and Re similarity with the same fluid is mathematically impossible (they give contradictory velocity requirements). Since wave drag is the dominant force component, engineers match Froude number, measure the total drag, subtract an estimated viscous component (using flat-plate friction correlations at the model\'s Re), and then add back the viscous component estimated at the ship\'s Re. This "Froude + friction correction" method has been standard practice in naval architecture for over a century. Choosing which dimensionless number to match — based on which physical phenomenon dominates — is a core engineering judgment.',
          hint: 'What would the model speed need to be for Reynolds similarity at 1:25 scale? Is that practical?'
        },
        {
          id: 'u6-L5-Q3',
          type: 'true-false',
          question: 'It is generally impossible to achieve simultaneous Reynolds number and Froude number similarity in a scaled model using the same fluid as the prototype.',
          correctAnswer: true,
          explanation: 'Reynolds similarity requires V_m = V_p × (L_p/L_m) × (ν_m/ν_p), while Froude similarity requires V_m = V_p × √(L_m/L_p). For the same fluid (ν_m = ν_p), these give contradictory velocity requirements. Achieving both simultaneously would require a model fluid with ν_m = ν_p × (L_m/L_p)^(3/2), which is practically impossible for most scale ratios. This is why engineers must identify the dominant phenomenon and match the corresponding dimensionless number.',
          hint: 'Write out the velocity requirements for both Re and Fr similarity and see if they can be satisfied simultaneously.'
        },
        {
          id: 'u6-L5-Q4',
          type: 'multiple-choice',
          question: 'A 1:5 scale aircraft wing model needs Reynolds similarity testing at a prototype speed of 100 m/s. Using the same air, the model would need 500 m/s (supersonic!). How do advanced wind tunnels solve this problem without exceeding the speed of sound?',
          options: [
            'Pressurize the tunnel (increasing density) or cool the air to cryogenic temperatures (decreasing viscosity) — both reduce kinematic viscosity ν, allowing Re matching at lower speeds since Re = VL/ν',
            'Use a lighter gas like helium instead of air, which has lower density and allows higher speeds before reaching Mach 1',
            'Test at a larger scale (1:2 instead of 1:5) to reduce the required speed to 200 m/s, which is subsonic',
            'Accept the Reynolds number mismatch and apply a correction factor — exact matching is never possible'
          ],
          correctIndex: 0,
          explanation: 'The key insight is that Re = ρVL/(μ) = VL/ν. To increase Re without increasing V, you decrease ν. Two approaches: (1) Pressurized tunnels: increasing air pressure increases ρ while μ is nearly independent of pressure, so ν = μ/ρ drops. At 10 atm, ν is 1/10 of normal, so you only need 50 m/s instead of 500 m/s. (2) Cryogenic tunnels (like NASA\'s National Transonic Facility): cooling air to ~120 K increases ρ (cold air is denser) and decreases μ (viscosity drops with temperature for gases), giving ~6× reduction in ν. These facilities are extraordinarily expensive but essential for testing at flight Reynolds numbers. This problem illustrates why understanding the physics behind dimensionless numbers — not just the formulas — leads to creative engineering solutions.',
          hint: 'Re = VL/ν. You cannot change V or L easily — what about ν?'
        },
        {
          id: 'u6-L5-Q5',
          type: 'multiple-choice',
          question: 'An engineer needs to match the right dimensionless number for each problem. Which pairing is correct and why?',
          options: [
            'Ship hull → Froude (wave drag dominated by gravity), aircraft wing → Reynolds (viscous/pressure drag), fuel injector → Weber (droplet breakup vs. surface tension)',
            'Ship hull → Reynolds (skin friction), aircraft wing → Mach (compressibility), fuel injector → Froude (gravity settling)',
            'Ship hull → Weber (water surface tension), aircraft wing → Froude (lift vs. gravity), fuel injector → Reynolds (nozzle flow regime)',
            'All three use Reynolds number because viscous forces are always dominant in engineering applications'
          ],
          correctIndex: 0,
          explanation: 'Choosing the correct dimensionless number requires identifying the dominant physics: (1) Ships create waves on the free surface — wave-making drag depends on the gravity-inertia balance, governed by Froude number Fr = V/sqrt(gL). (2) Aircraft wings at subsonic speeds experience viscous boundary layers and pressure drag — the flow pattern depends on the inertia-viscosity balance, governed by Reynolds number Re = VL/ν. At transonic/supersonic speeds, Mach number becomes critical. (3) Fuel injectors break liquid jets into droplets — breakup occurs when inertial forces overcome surface tension, governed by Weber number We = ρV²L/σ. This ability to identify the dominant physical mechanism and match it to the right dimensionless group is one of the most valuable skills in engineering analysis and model testing.',
          hint: 'For each application, ask: what force balance determines the behavior? Gravity? Viscosity? Surface tension?'
        },
        {
          id: 'u6-L5-Q6',
          type: 'fill-blank',
          question: 'The principle that a model and prototype must have the same geometry, kinematics, and force ratios for valid scaling is called ___.',
          acceptedAnswers: ['similitude', 'Similitude', 'dynamic similitude', 'Dynamic similitude', 'complete similitude'],
          explanation: 'Similitude encompasses three levels: geometric (same shape ratios), kinematic (same velocity/acceleration ratios), and dynamic (same force ratios). Complete or dynamic similitude requires all relevant dimensionless numbers to match between model and prototype. In practice, only the most important dimensionless numbers are matched, as complete similitude is often impossible with scale models.',
          hint: 'This term describes the complete similarity between a model and its prototype.'
        }
      ]
    }
  ]
};
