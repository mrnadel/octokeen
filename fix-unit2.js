/**
 * Fix unit-2-dynamics.ts option bias by replacing ONLY within option string literals.
 * This avoids the collateral damage caused by short replacement keys matching in explanations.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'course', 'units', 'unit-2-dynamics.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replacements map: old option text => new option text
// IMPORTANT: These must match EXACTLY what appears inside the single-quoted option strings
const replacements = [
  // Q1
  ['The accelerometer is broken — a moving object always has non-zero acceleration',
   'The accelerometer is broken or malfunctioning — any object that is physically moving must always register some non-zero acceleration reading'],
  ['The vehicle is in free fall, so the accelerometer reads zero relative to itself',
   'The vehicle is in free fall toward the ground, so the accelerometer reads zero relative to its own accelerating reference frame'],
  ['The vehicle is moving in a straight line, but it could be speeding up at a constant rate',
   'The vehicle is moving in a straight line, but it could be speeding up at a constant rate since constant acceleration reads as zero'],
  // Q2
  ['It is valid because the x and y axes are perpendicular — it never breaks down',
   'It is valid because the x and y axes are mathematically perpendicular, and this orthogonality guarantees independence under all real-world conditions'],
  ['It is an approximation that only works for small angles of launch (less than 15 degrees)',
   'It is only a valid approximation for projectiles launched at small angles less than 15 degrees from horizontal, failing for steeper trajectories'],
  ['It is valid only when the projectile stays close to the ground where gravity is constant',
   'It is valid only when the projectile stays close to the ground surface where gravitational acceleration can be treated as perfectly constant'],
  // Q4
  ['The driver is correct — acceleration requires a change in speed',
   'The driver is correct — acceleration by definition requires a measurable change in speed, and the speedometer confirms no speed change is occurring'],
  ['The driver is wrong — there is tangential acceleration even at constant speed because the car is on a curved path',
   'The driver is wrong — there is tangential acceleration present even at constant speed because any curved path inherently produces tangential acceleration'],
  ['The driver is correct — centripetal acceleration is fictitious and does not count as real acceleration',
   'The driver is correct — centripetal acceleration is a fictitious inertial effect that does not count as real physical acceleration in Newtonian mechanics'],
  // Q11 relative velocity
  ['100 km/h in a direction 36.9° north of west',
   '100 km/h directed at 36.9° north of west, based on the arctangent of the perpendicular velocity ratio'],
  ['140 km/h due northwest',
   '140 km/h directed due northwest, obtained by adding the two velocity magnitudes as scalar quantities'],
  ['20 km/h due north',
   '20 km/h directed due north, found by subtracting the smaller velocity magnitude from the larger one directly'],
  // Q14 optimal angle with drag
  ['Greater than 45° — the projectile needs more height to overcome drag',
   'Greater than 45° — the projectile needs additional height and a steeper trajectory to overcome the velocity-reducing effects of aerodynamic drag'],
  ['Exactly 45° — air resistance does not change the optimal angle',
   'Exactly 45° — air resistance affects the range magnitude but does not change the optimal launch angle from the classical vacuum solution'],
  ['It depends only on the drag coefficient, not the launch angle',
   'The maximum range depends only on the drag coefficient and projectile mass, not on the launch angle which is irrelevant when drag is present'],
  // Q16 curve fitting
  ['Numerical differentiation — it preserves all the raw data without making assumptions',
   'Numerical differentiation preserves all the raw experimental data points without making any assumptions about the underlying functional form'],
  ['Either method gives identical results for engineering applications',
   'Either method gives functionally identical results for all practical engineering applications, so the choice is purely one of personal preference'],
  ['Numerical differentiation is always better because curve fitting introduces modeling error',
   'Numerical differentiation is always the superior method because curve fitting introduces systematic modeling error from the assumed function shape'],
  // Q17 - tangential/normal acceleration (very short options)
  ["'50 rad/s²'", "'50 rad/s² — the angular acceleration equals the tangential acceleration divided by twice the wheel radius'"],
  ["'500 rad/s²'", "'500 rad/s² — the angular acceleration equals the total linear acceleration divided by the wheel radius directly'"],
  ["'250 rad/s²'", "'250 rad/s² — the angular acceleration is half the total linear acceleration because only the tangential component matters'"],
  // Q18 angled pull
  ['Friction increases — the angled pull adds a vertical component that presses the crate into the floor',
   'Friction increases because the angled pull adds a downward vertical component that presses the crate harder into the floor, raising the normal force'],
  ['Friction stays the same — the friction coefficient determines friction regardless of pull direction',
   'Friction stays exactly the same because the static friction coefficient alone determines the friction force regardless of the pull angle or direction'],
  ['Friction decreases only because the horizontal pulling component is smaller',
   'Friction decreases only because the horizontal component of the pulling force is smaller at the steeper angle, not because of any normal force change'],
  // Q19 Atwood
  ['Because the pulley absorbs most of the energy through friction',
   'Because the frictionless pulley absorbs most of the kinetic energy through internal friction in its bearings, leaving little energy for acceleration'],
  ['Because the rope tension reduces the net force to near zero',
   'Because the rope tension forces on each mass nearly cancel the gravitational forces, reducing the net driving force on the system to near zero'],
  ['Because gravity cannot accelerate a system with more than one mass at full g',
   'Because gravitational acceleration cannot accelerate any mechanical system containing more than one connected mass at the full rate of free fall'],
  // Q20 ice curve
  ['Safe speed drops by 75% in proportion to friction — from 25 m/s to about 6 m/s',
   'Safe speed drops by 75% in direct proportion to the friction coefficient reduction — from 25 m/s down to approximately 6.25 m/s on the icy curve'],
  ['Safe speed is unchanged because the car mass cancels out of the equation',
   'Safe speed is completely unchanged because the car mass cancels out of the centripetal force equation, making friction irrelevant for curved motion'],
  ['Safe speed drops slightly — from 25 m/s to about 20 m/s, since friction has minimal effect on curves',
   'Safe speed drops only slightly from 25 m/s to approximately 20 m/s, since the friction coefficient has minimal practical effect on curve negotiation'],
  // Q21 elevator
  ['Your actual weight (mg) changes because gravity is stronger in an accelerating frame',
   'Your actual gravitational weight (mg) physically changes because gravity is effectively stronger inside an accelerating non-inertial reference frame'],
  ['The elevator cable pulls you upward, temporarily increasing your mass',
   'The elevator cable pulls upward on the cabin and on you, temporarily increasing your effective inertial mass through the transmitted cable tension'],
  ['Air pressure changes in the elevator shaft create a buoyancy effect',
   'Air pressure changes within the enclosed elevator shaft create a buoyancy effect that pushes upward on your body during acceleration phases'],
  // Q22 block on incline
  ['Yes, friction exactly equals the gravity component along the incline',
   'Yes, the friction force exactly equals the gravity component along the incline surface, and both forces are always precisely balanced at any angle'],
  ['No, the block accelerates because there is no friction on an incline',
   'No, the block must accelerate because friction forces cannot develop on any inclined surface — friction only acts on perfectly horizontal contacts'],
  ['Yes, the normal force alone prevents sliding on any incline',
   'Yes, the normal force component alone is sufficient to prevent sliding on any incline angle, without requiring any tangential friction contribution'],
  // Q23 banked curve
  ['30 m/s — any speed works on a frictionless banked curve',
   '30 m/s — any speed will work on a frictionless banked curve because the banking angle compensates for all centripetal force requirements'],
  ['45 m/s — higher speed is always needed on banked curves',
   '45 m/s — a higher speed is always needed on banked curves because the vehicle must overcome the additional gravitational component along the bank'],
  ['15 m/s — the banking always reduces the required speed',
   '15 m/s — the banking angle always reduces the minimum required speed by providing an inward force component from the tilted road surface'],
  // Q24 pulley work
  ['The pulley creates extra energy by changing the direction of force',
   'The frictionless pulley creates extra mechanical energy by redirecting the applied force through the rope, effectively amplifying the work output'],
  ['The mechanical advantage means less total work is needed',
   'The mechanical advantage of the two-pulley system means less total work input is needed to lift the weight by the same vertical distance'],
  ['Friction in the pulleys actually makes this system more efficient than pulling directly',
   'Friction forces in the pulley bearings actually make this compound system more efficient than pulling the load directly without any pulleys'],
  // Q25 vertical loop - MUST use full string match to avoid matching inside explanations
  ["'4.43 m/s'", "'4.43 m/s — the minimum speed at the top of the loop, calculated using the full weight plus centripetal force requirement'"],
  ["'1.57 m/s'", "'1.57 m/s — the minimum speed is half the gravitational value because the loop radius reduces the effective gravitational pull'"],
  ["'9.81 m/s'", "'9.81 m/s — the minimum speed at the top equals g times the radius, ensuring that gravitational force provides full centripetal acceleration'"],
  // Q26 box on truck
  ['Yes — the box has no engine so it cannot accelerate with the truck',
   'Yes — the box will slide because it has no engine or drive mechanism of its own, so it cannot independently accelerate along with the truck'],
  ['Yes — friction always opposes motion so it pushes the box backward',
   'Yes — friction always opposes relative motion so it pushes the box backward relative to the truck bed as the truck accelerates forward'],
  // Q27 chandelier
  ['The rope at 60° from horizontal has higher tension because it is steeper',
   'The rope at 60° from horizontal has the higher tension because its steeper angle means it carries a larger share of the vertical weight component'],
  ['Both ropes have equal tension because they support the same weight',
   'Both ropes must have equal tension because they are both connected to the same weight and gravity distributes the load equally between them'],
  ['The rope at 30° has higher tension because it is more horizontal and must pull harder',
   'The rope at 30° from horizontal has higher tension because its more horizontal orientation requires a larger force to provide vertical support'],
  // Q28 work-energy
  ['When you need to find the acceleration at a specific instant',
   'When you need to find the instantaneous acceleration at a specific moment in time during a process with varying forces along the path'],
  ['When you need to find how long a process takes',
   'When you need to find how long a mechanical process takes to complete, since work-energy directly provides time information'],
  ['Only when all forces are constant and act in one direction',
   'Only when all applied forces are constant in magnitude and act in a single fixed direction throughout the entire path of motion'],
  // Q29 spring energy
  ['Double the compression to 10 mm (energy doubles linearly with displacement)',
   'Double the compression distance to 10 mm — since elastic potential energy scales linearly with displacement, doubling compression doubles energy'],
  ['Use two identical springs in parallel — this always doubles the energy regardless of compression',
   'Use two identical springs in parallel — this configuration always exactly doubles the stored energy regardless of the compression amount applied'],
  ['Increase compression to 10 mm AND double the spring stiffness for a combined 2x increase',
   'Increase compression to 10 mm and simultaneously double the spring stiffness for a combined 2x energy increase through both parameters at once'],
  // Q30 motor sizing
  ['The motor is oversized by 50% and a 10 kW motor would be sufficient',
   'The motor is significantly oversized by 50% — a 10 kW motor would be entirely sufficient since the steady-state power requirement is only 9.81 kW'],
  ['The motor is perfectly sized since it only needs 9.81 kW and has headroom',
   'The motor is perfectly sized since the steady-state lifting requirement is only 9.81 kW, leaving adequate headroom within the 15 kW rating'],
  ['The motor is undersized because you need to double the power for safety',
   'The motor is undersized because standard engineering practice requires doubling the calculated power for safety, giving a 19.62 kW requirement'],
  // Q31 roller coaster
  ['The mass does affect speed, but the track is designed so all cars have the same mass',
   'The mass does significantly affect the final speed, but the track is engineered so that all roller coaster cars have precisely the same total mass'],
  ['Heavier cars actually go faster due to greater momentum, but the difference is small',
   'Heavier cars actually travel faster at the bottom due to their greater momentum carrying them through friction losses, but the difference is small'],
  ['Mass cancels only if the track is perfectly smooth — any curvature makes mass relevant',
   'Mass cancels from the energy equation only if the track is perfectly smooth and frictionless — any curvature or friction makes mass relevant again'],
  // Q33 orbital energy
  ['Only PE changes — KE stays the same because speed is constant in any orbit',
   'Only potential energy changes — kinetic energy stays the same because the orbital speed is constant at every point in any circular orbit altitude'],
  ['Only KE changes — the satellite speeds up to reach higher orbit',
   'Only kinetic energy changes — the satellite speeds up when boosted to a higher orbit because additional thrust energy converts directly to velocity'],
  ['Neither changes — total energy is conserved in orbital mechanics',
   'Neither KE nor PE changes — total mechanical energy is always conserved in orbital mechanics, so moving between orbits requires zero net work'],
  // Q34 crumple zone
  ['Increasing duration reduces the total impulse, meaning less momentum change',
   'Increasing the collision duration reduces the total impulse delivered to the occupant, which directly means less overall momentum change occurs'],
  ['Crumple zones absorb momentum, so the occupant experiences less total momentum change',
   'Crumple zones physically absorb and dissipate momentum from the vehicle, so the occupant experiences significantly less total momentum change'],
  ['Longer duration allows the seatbelt to share the force, but the peak force on the body stays the same',
   'Longer duration allows the seatbelt system to share the force over more time, but the peak force on the occupant body remains exactly the same'],
  // Q35 inelastic collision energy
  ['It is destroyed — the law of conservation of energy has an exception for collisions',
   'The lost kinetic energy is permanently destroyed — the law of conservation of energy has a specific exception for inelastic collision processes'],
  ['It is temporarily stored and released later as the objects return to their original shape',
   'The kinetic energy is temporarily stored as elastic potential energy and released later as the deformed objects gradually return to their original shape'],
  ['It is transferred to the Earth through the ground reaction force',
   'The lost kinetic energy is transferred entirely to the Earth through the ground reaction force at the point of contact during the collision'],
  // Q36 perfectly inelastic
  ['Conservation of energy — calculate KE before and after to find the final velocity',
   'Conservation of energy — calculate the kinetic energy before and after the collision to directly find the final combined velocity of the masses'],
  ['Conservation of momentum only works for elastic collisions, so energy must be used here',
   'Conservation of momentum only applies to perfectly elastic collisions, so kinetic energy conservation must be used for inelastic collision analysis'],
  // Q37 billiard ball
  ['It is a coincidence that only happens at specific impact angles',
   'It is a coincidence that only happens at certain specific impact angles determined by the geometry of the collision and table friction conditions'],
  ['The 90° angle is due to friction between the balls during contact',
   'The 90° separation angle is caused by the tangential friction force between the smooth ball surfaces during their brief moment of physical contact'],
  ['All 2D elastic collisions result in 90° separation regardless of mass ratio',
   'All two-dimensional elastic collisions result in a 90° separation angle between the final velocity vectors regardless of the mass ratio involved'],
  // Q38 ballistic pendulum
  ['Momentum conservation is always more accurate than energy conservation',
   'Momentum conservation is always more accurate and reliable than energy conservation for analyzing any type of collision or impact event in mechanics'],
  ['Energy conservation cannot be applied to any part of this problem',
   'Energy conservation cannot be applied to any part of this two-phase ballistic pendulum problem because energy is lost in both the impact and swing'],
  ['Both methods could be used interchangeably for either phase',
   'Both conservation methods — momentum and energy — could be used interchangeably for either phase of the ballistic pendulum analysis with equal accuracy'],
  // Q39 flywheel mass distribution
  ['Distribute mass uniformly — a solid disk has the maximum I for a given mass',
   'Distribute the mass uniformly throughout a solid disk — a uniform solid disk produces the maximum moment of inertia for any given total mass value'],
  ['Concentrate mass at the center to reduce centrifugal stress on the spokes',
   'Concentrate all the mass at the center hub to minimize centrifugal stress on the spokes, which is the dominant structural failure mode at high speed'],
  ['The mass distribution does not matter — only total mass and angular velocity affect stored energy',
   'The radial mass distribution does not matter — only the total mass and the angular velocity determine the kinetic energy stored in the flywheel'],
  // Q40 solid vs hollow sphere
  ['They arrive simultaneously — mass and radius are the same, so the motion is identical',
   'They arrive at the bottom simultaneously — since both spheres have the same mass and radius, their translational motion down the incline is identical'],
  // Q41 flywheel KE
  ['About 1,974 J — energy doubles when speed doubles',
   'About 1,974 J — the stored kinetic energy doubles when the rotational speed doubles, following a linear relationship with angular velocity'],
  ['About 987 J — energy is independent of speed for a given flywheel',
   'About 987 J — the stored energy is independent of rotational speed for a given flywheel, depending only on the mass and radius values'],
  ['About 5,922 J — energy triples because both I and omega change',
   'About 5,922 J — the energy triples because both the moment of inertia and the angular velocity effectively change when speed doubles'],
  // Q42 gyroscopic precession
  ['Faster spin creates more centrifugal force that pushes outward and resists falling',
   'Faster spin creates more centrifugal force that pushes the gyroscope mass outward and directly resists the tendency to fall under gravitational torque'],
  ['Faster spin increases the gyroscopic friction, slowing precession',
   'Faster spin increases the internal gyroscopic friction within the bearings, which mechanically slows the precession rate through energy dissipation'],
  ['The precession rate is actually independent of spin speed — it depends only on the applied torque',
   'The precession rate is actually completely independent of the spin speed — it depends only on the magnitude of the externally applied gravitational torque'],
  // Q44 disk vs ring - use full quoted string to avoid matching inside explanations
  ["'They have the same acceleration'", "'They have the same linear acceleration down the incline because both have identical mass and experience the same gravitational force component'"],
  ["'The ring is twice as fast'", "'The ring accelerates twice as fast as the disk down the incline because its mass is concentrated at the outer radius for reduced resistance'"],
  ["'The disk is twice as fast'", "'The disk accelerates exactly twice as fast as the ring down the incline because its lower moment of inertia allows more translational acceleration'"],
  // Q45 gear direction
  ["'200 rpm in the same direction'", "'200 rpm in the same direction — the gear ratio inverts the speed but the meshing teeth maintain the same rotational direction'"],
  ["'50 rpm in the opposite direction'", "'50 rpm in the opposite direction — the gear ratio reduces speed by the teeth ratio and reverses the rotation direction of the output'"],
  ["'100 rpm in the same direction'", "'100 rpm in the same direction — the output gear rotates at the same speed as the input because the teeth ratio equals exactly unity'"],
  // Q46 perpendicular axis theorem
  ['Any three-dimensional body',
   'Any three-dimensional body regardless of shape — the perpendicular axis theorem applies universally to all rigid bodies in any orientation'],
  ['Only circular cross-section bodies',
   'Only bodies with circular cross-sections — the perpendicular axis theorem requires rotational symmetry to produce valid moment of inertia results'],
  ['Only symmetric bodies like squares and circles',
   'Only symmetric bodies such as squares and circles — the perpendicular axis theorem requires at least one axis of geometric symmetry to be valid'],
  // Q47 differential
  ['The inner wheel has more friction so it naturally slows down',
   'The inner wheel has more tire-road friction during a turn so it naturally slows down, and the differential simply accommodates this friction difference'],
  ['The outer wheel receives more torque from the engine',
   'The outer wheel receives proportionally more torque from the engine through the differential, which actively distributes power based on wheel speed'],
  ['Both wheels always rotate at the same speed — only the tire deformation differs',
   'Both wheels always rotate at exactly the same angular speed — the apparent speed difference is entirely due to tire deformation and elastic compliance'],
  // Q48 bicycle stability
  ['The forward motion creates an aerodynamic force that keeps the bike upright',
   'The forward motion of the bicycle creates a significant aerodynamic force that pushes against the bike and rider, keeping the system upright and stable'],
  ['The tires grip the road better when moving, preventing tipping',
   'The spinning tires grip the road surface better when the bicycle is moving forward, creating a larger friction footprint that prevents sideways tipping'],
  // Q49 natural frequency
  ['Increase spring stiffness — stiffer springs resist vibration better',
   'Increase the spring stiffness of the mounting system — stiffer springs inherently resist vibration better and prevent resonance in all conditions'],
  ['Remove mass — lighter systems always vibrate less',
   'Remove mass from the machine mounting — lighter systems always vibrate at lower amplitudes and are inherently less susceptible to resonance effects'],
  ['The natural frequency cannot be changed without replacing the machine entirely',
   'The natural frequency is an intrinsic property that cannot be changed without completely replacing the machine, its foundation, and all mounting hardware'],
  // Q50 damping types
  ['Both should be critically damped — this is always the optimal setting',
   'Both the door closer and car suspension should be critically damped — critical damping is universally the optimal setting for all mechanical systems'],
  ['Both should be underdamped — oscillation is acceptable in all mechanical systems',
   'Both should be underdamped — some oscillation is always acceptable in mechanical systems and provides faster response than other damping levels'],
  ['Door closer: underdamped (fast response). Car suspension: overdamped (maximum comfort)',
   'Door closer: underdamped for fast response and quick closing. Car suspension: overdamped for maximum passenger comfort and vibration absorption'],
  // Q51 stiffening mounts
  ['Adding stiffness is always beneficial because it makes the structure more rigid',
   'Adding stiffness to the isolation mounts is always beneficial because making the structure more rigid inherently reduces all vibration amplitudes'],
  ['The bumpers would add damping, which always reduces transmitted force',
   'The rubber bumpers would add damping to the system, and additional damping always reduces the transmitted force at every operating frequency range'],
  ['The extra stiffness would overload the machine bearings but would not affect vibration transmission',
   'The extra stiffness would overload the machine bearings due to increased constraint forces but would not affect the vibration transmission characteristics'],
  // Q52 unbalance
  ['The balance weights fell off at the higher speed due to centrifugal force',
   'The balance weights fell off at the higher speed due to centrifugal force exceeding the attachment strength, removing the compensating counterbalance mass'],
  ['Higher speed creates more aerodynamic turbulence around the shaft',
   'Higher speed creates significantly more aerodynamic turbulence around the rotating shaft, inducing additional lateral forces from the turbulent airflow'],
  ['The lubricant thins at higher speed, allowing more shaft movement',
   'The bearing lubricant thins at the higher operating speed due to shear heating, allowing more radial shaft movement within the bearing clearance'],
  // Q53 isolation effectiveness
  ['No, the machine is at resonance',
   'No, the machine is operating at resonance — the frequency ratio equals unity and the transmissibility reaches its maximum possible value'],
  ['Barely in the isolation range — transmissibility is about 0.5',
   'Barely within the isolation range — the transmissibility is approximately 0.5 at this frequency ratio, giving only 50% force reduction'],
  ['The machine is below the isolation range and vibration is amplified',
   'The machine is operating below the isolation frequency range and the vibration force is actually amplified rather than reduced by the mounts'],
  // Q54 damping at high freq
  ['Damping reduces the spring stiffness, changing the isolation characteristics',
   'Damping effectively reduces the equivalent spring stiffness of the isolation mount at high frequencies, fundamentally changing the isolation characteristics'],
  ['High-frequency vibrations generate heat in the damper which increases stiffness',
   'High-frequency vibrations generate significant heat in the damper material through viscous dissipation, which increases its dynamic stiffness over time'],
  ['This statement is incorrect — damping always reduces transmitted force',
   'This statement is incorrect — adding damping to any vibration isolation system always reduces the transmitted force at every excitation frequency'],
  // Q56 parallel springs
  ['Higher natural frequency because parallel springs are always stiffer',
   'Higher natural frequency because springs arranged in parallel are always stiffer than any equivalent single spring with the same total wire length'],
  ['Lower natural frequency because the load is distributed',
   'Lower natural frequency because distributing the load across four parallel springs reduces the effective stiffness that each individual spring provides'],
  ['Different natural frequency because the effective mass changes',
   'A different natural frequency because splitting one spring into four parallel springs changes the effective vibrating mass of the spring-mass system'],
  // Q57 earthquake resonance
  ['The amplification is always exactly 1/(2ζ) immediately',
   'The amplification factor always reaches exactly 1/(2ζ) immediately at the onset of resonant excitation, with no transient buildup period required'],
  ['Earthquakes cannot cause resonance because they are random, not harmonic',
   'Earthquakes cannot cause structural resonance because seismic ground motion is random and non-periodic, unlike the harmonic excitation for resonance'],
  ['The amplification is limited to about 2 regardless of damping',
   'The dynamic amplification factor is limited to approximately 2.0 regardless of the system damping ratio, because structural nonlinearities cap it'],
  // Q58 magnification factor
  ['About 25 — same as at resonance',
   'About 25 — the same value as at exact resonance because the magnification factor is constant across the entire frequency range near resonance'],
  ['About 1 — far from resonance',
   'About 1.0 — this frequency ratio is far enough from resonance that the dynamic magnification is negligible and the response equals the static value'],
  ['About 10 — half of the resonance value',
   'About 10 — exactly half of the peak resonance value, since the magnification decreases linearly with distance from the resonance frequency ratio'],
  // Q59 absorber creates resonances
  ['The two new resonances cancel each other out, so there is no concern',
   'The two new resonance frequencies cancel each other out through destructive interference, so there is no practical concern about vibration peaks'],
  ['The new resonances only exist theoretically and cannot occur in practice',
   'The new resonance frequencies only exist in theoretical mathematical models and cannot physically occur in any practical real-world installation'],
  ['The absorber eliminates all resonances, not just one frequency',
   'The tuned mass absorber eliminates all resonance frequencies from the system response, not just the single targeted forcing frequency designed for'],
];

// Apply replacements carefully - only within option strings (lines containing quotes in options arrays)
let count = 0;
for (const [oldText, newText] of replacements) {
  // Check if this is a full-string replacement (starts and ends with ')
  if (oldText.startsWith("'") && oldText.endsWith("'")) {
    const actual = oldText;
    const replacement = newText;
    if (content.includes(actual)) {
      content = content.split(actual).join(replacement);
      count++;
    }
  } else {
    // For normal replacements, we need to be careful to only match within option strings
    // Build a regex that matches the old text only when preceded by ' and followed by '
    // (i.e., it's the entire content of a single-quoted string)
    const escaped = oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp("'" + escaped + "'", 'g');
    const replacement = "'" + newText + "'";
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement);
      count++;
    }
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Applied ${count} replacements to unit-2-dynamics.ts`);

// Verify no explanations were corrupted
const lines = content.split('\n');
let issues = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('explanation:') && (
    lines[i].includes('the mechanical advantage') && !lines[i].includes('options') ||
    lines[i].includes('the moment of inertia about the rim') ||
    lines[i].includes('calculated assuming all kinetic energy')
  )) {
    issues++;
    console.log(`WARNING: Possible corruption at line ${i+1}`);
  }
}
if (issues === 0) console.log('No explanation corruptions detected');
