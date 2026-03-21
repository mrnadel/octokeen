const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'src/data/course/units');

function fixFile(filename, replacements) {
    const filepath = path.join(BASE, filename);
    let content = fs.readFileSync(filepath, 'utf-8');
    let changeCount = 0;
    let warnings = [];

    for (const [oldStr, newStr] of replacements) {
        if (oldStr === newStr) continue;
        const count = content.split(oldStr).length - 1;
        if (count === 0) {
            warnings.push('NOT FOUND: ' + oldStr.substring(0, 70));
        } else if (count > 1) {
            warnings.push('MULTIPLE (' + count + '): ' + oldStr.substring(0, 70));
        } else {
            content = content.replace(oldStr, newStr);
            changeCount++;
        }
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log('DONE: ' + filename + ' - ' + changeCount + ' changes');
    warnings.forEach(w => console.log('  WARN: ' + w));
}

// ==================== UNIT 4 THERMO ====================
fixFile('unit-4-thermo.ts', [
    // Line 37 - correct[0] 65 chars, wrong avg 26 chars
    ["'If the steam is superheated — temperature could be well above 120'", "'If the steam is superheated above saturation'"],
    ["'If the pipe is insulated'", "'If the pipe is well insulated from ambient'"],
    ["'If the pipe diameter is large'", "'If the pipe diameter is sufficiently large'"],
    ["'If the flow is turbulent'", "'If the flow regime is fully turbulent'"],

    // Line 73 - correct[0] 52, wrongs 36/47/48
    ["'The liquid and vapor phases become indistinguishable'", "'Liquid and vapor phases become indistinguishable'"],
    ["'The substance exists as a solid only'", "'The substance exists only as a solid phase'"],
    ["'The pressure is at its minimum for phase change'", "'Pressure is at its minimum for phase change'"],
    ["'The enthalpy of vaporization reaches its maximum'", "'Enthalpy of vaporization reaches its maximum'"],

    // Line 110 - correct[0] 68, wrongs 44/52/54
    ["'85% of the total mass is saturated vapor and 15% is saturated liquid'", "'85% of mass is saturated vapor, 15% is saturated liquid'"],

    // Line 263 - correct[0] 73, wrongs 57/45/55
    ["'The specific gas constant R = R_universal / M, which differs for each gas'", "'R = R_universal / M, which differs for each gas'"],
    ["'The universal gas constant R_u = 8.314 kJ/(kmol\\xB7K) always'", "'R_u = 8.314 kJ/(kmol\\xB7K) applied universally'"],
    ["'Any value of R since the equation automatically adjusts'", "'Any value of R since the equation auto-adjusts'"],

    // Line 277 - correct[0] 51, wrongs 46/36/29
    ["'A liquid at temperature below T_sat at its pressure'", "'A liquid below T_sat at its given pressure'"],
    ["'A liquid above the critical pressure'", "'A liquid that is above the critical pressure'"],
    ["'A liquid with dissolved gases'", "'A liquid containing dissolved gases in it'"],

    // Line 315 - correct[0] 74, wrongs 60/46/54
    ["'Hydrogen bonding forces water molecules into a hexagonal crystal structure'", "'Hydrogen bonding forces molecules into hexagonal crystals'"],
    ["'The phase change releases energy that pushes molecules apart'", "'Phase change releases energy pushing molecules apart'"],
    ["'Ice traps air bubbles that increase its volume'", "'Ice traps air bubbles that increase its overall volume'"],
    ["'Freezing is an endothermic process that absorbs energy'", "'Freezing is an endothermic process absorbing energy'"],

    // Line 339 - correct[0] 75 (truncated), wrongs 71/46/37
    ["'It is the energy required to convert saturated liquid to saturated vapor at'", "'Energy to convert saturated liquid to saturated vapor'"],
    ["'It is the energy needed to raise the temperature of a gas by one degree'", "'Energy to raise a gas temperature by one degree'"],
    ["'It is the work done by the vapor as it expands'", "'The work done by the vapor as it expands outward'"],
    ["'It is the difference between enthalpy'", "'The difference between liquid and vapor enthalpy'"],

    // Line 362 - correct[0] 70, wrongs 59/59/28
    ["'Final state of a process consistent with equilibrium theory'", "'Final state of a process at equilibrium conditions'"],
    ["'Frozen (solid) state using standard thermodynamic relations'", "'Frozen (solid) state in thermodynamic notation'"],
    ["'Reference (foundation) state'", "'Reference (foundation) state of the system'"],

    // Line 376 - correct[0] 70, wrongs 68/45/33
    ["'Yes \\u2014 cp is constant for all gases at all temperatures by definition'", "'Yes \\u2014 cp is constant for all gases by definition'"],
    ["'Yes \\u2014 the variation is negligible'", "'Yes \\u2014 the variation is negligible for gases'"],

    // Line 602 - correct[0] 70, wrongs 56/46/59
    ["'W_on = -nRT ln(V\\u2082/V\\u2081) = nRT ln(V\\u2081/V\\u2082), which is positive since V\\u2081 > V\\u2082'", "'W_on = nRT ln(V\\u2081/V\\u2082), positive since V\\u2081 > V\\u2082'"],
    ["'W_on = P(V\\u2082 - V\\u2081) using standard thermodynamic relations'", "'W_on = P(V\\u2082 - V\\u2081) for constant pressure work'"],
    ["'W_on = nRT(1/V\\u2082 - 1/V\\u2081) per conventional engineering models'", "'W_on = nRT(1/V\\u2082 - 1/V\\u2081) per engineering models'"],

    // Line 617 - correct[0] 76 (truncated), wrongs 52/58/60
    ["'The actual work output is 85% of the work output that an ideal turbine would'", "'Actual work output is 85% of ideal turbine output'"],
    ["'The turbine converts 85% of the heat input into work'", "'The turbine converts 85% of heat input into work'"],
    ["'85% of the steam passes through the turbine without losses'", "'85% of steam passes through without any losses'"],
    ["'The turbine exit temperature is 85% of the inlet temperature'", "'Exit temperature is 85% of the inlet temperature'"],

    // Line 715 - correct[0] 78, wrongs 56/56/54
    ["'Temperature remains 400 K, and pressure drops to half since the volume doubles'", "'T stays 400 K, pressure halves as volume doubles'"],
    ["'Temperature drops to 200 K and pressure drops to 125 kPa'", "'T drops to 200 K, pressure drops to 125 kPa'"],
    ["'Temperature rises to 800 K and pressure stays at 500 kPa'", "'T rises to 800 K, pressure stays at 500 kPa'"],
    ["'Temperature remains 400 K and pressure remains 500 kPa'", "'T remains 400 K, pressure remains 500 kPa'"],

    // Line 738 - correct[0] 69, wrongs 63/42/58
    ["'150.75 kJ, because at constant pressure Q = mcp\\u0394T = 0.5 \\xD7 1.005 \\xD7 300'", "'150.75 kJ, Q = mcp\\u0394T = 0.5 \\xD7 1.005 \\xD7 300'"],
    ["'107.7 kJ, because Q = mcv\\u0394T and the volume change is irrelevant'", "'107.7 kJ, Q = mcv\\u0394T ignoring volume change'"],
    ["'86.1 kJ, because Q = mR\\u0394T based on equilibrium assumptions'", "'86.1 kJ, Q = mR\\u0394T from equilibrium model'"],

    // Line 767 - correct[0] 78 (truncated), wrongs 51/68/75
    ["'\\u2248 43 K, from the kinetic energy converting to enthalpy: \\u0394T = (V\\u2081\\xB2 - V\\u2082\\xB2)/(2cp)'", "'\\u2248 43 K, from \\u0394T = (V\\u2081\\xB2 - V\\u2082\\xB2)/(2cp) kinetic to enthalpy'"],
    ["'\\u2248 0 K, because the process is adiabatic so temperature cannot change'", "'\\u2248 0 K, adiabatic process so temperature cannot change'"],
    ["'\\u2248 300 K, because the inlet velocity in m/s equals the temperature rise in K'", "'\\u2248 300 K, inlet velocity in m/s equals temperature rise'"],

    // Line 911 - correct[0] 75 (truncated), wrongs 71/70/38
    ["'Friction, heat transfer across finite temperature differences, unrestrained'", "'Friction, heat transfer across finite \\u0394T, mixing'"],
    ["'Only mechanical friction \\u2014 all other processes are naturally reversible'", "'Only mechanical friction \\u2014 all others are reversible'"],
    ["'Heat transfer at any rate, whether finite or infinitesimal temperature'", "'Heat transfer at any rate, finite or infinitesimal'"],
    ["'Only processes involving phase changes'", "'Only processes that involve phase changes of matter'"],

    // Line 926 - correct[0] 25, wrongs 17/17/21 - math formulas, expand wrongs
    ["'T\\u2082/T\\u2081 = (P\\u2082/P\\u2081)^\\u03B3'", "'T\\u2082/T\\u2081 = (P\\u2082/P\\u2081)^\\u03B3 exponent'"],
    ["'T\\u2082/T\\u2081 = (V\\u2082/V\\u2081)^\\u03B3'", "'T\\u2082/T\\u2081 = (V\\u2082/V\\u2081)^\\u03B3 exponent'"],
    ["'T\\u2082/T\\u2081 = (P\\u2082/P\\u2081)^(1/\\u03B3)'", "'T\\u2082/T\\u2081 = (P\\u2082/P\\u2081)^(1/\\u03B3) ratio'"],

    // Line 1062 - correct[0] 74, wrongs 31/46/35
    ["'Entropy change within the CV, net entropy transfer, and entropy generation'", "'Entropy change in CV, net entropy transfer, generation'"],
    ["'Entropy change, enthalpy change'", "'Entropy change and enthalpy change in the system'"],
    ["'Heat transfer, work output, and kinetic energy'", "'Heat transfer, work output, and kinetic energy terms'"],
    ["'Entropy inflow, entropy destruction'", "'Entropy inflow and entropy destruction terms'"],

    // Line 1115 - correct[0] 66, wrongs 48/44/45
    ["'1.33 kJ/K \\u2014 calculated as Q/T_cold - Q/T_hot = 1000/300 - 1000/500'", "'1.33 kJ/K \\u2014 Q/T_cold - Q/T_hot = 1000/300 - 1000/500'"],

    // Line 1192 - correct[0] 75 (truncated), wrongs 57/42/46
    ["'Compressing a liquid requires far less work than compressing a vapor at the'", "'Compressing liquid requires far less work than vapor'"],
    ["'Liquids can be compressed to higher pressures than vapors'", "'Liquids compress to higher pressures than vapors'"],

    // Line 1206 - correct[0] 72 (truncated), wrongs 62/47/69
    ["'At high compression ratios, the air-fuel mixture auto-ignites before the'", "'High compression ratios cause air-fuel auto-ignition'"],
    ["'Higher compression ratios would require thicker cylinder walls'", "'Higher ratios would require thicker cylinder walls'"],
    ["'The intake valves cannot close fast enough at high compression ratios'", "'Intake valves cannot close fast enough at high ratios'"],

    // Line 1359 - correct[0] 72 (truncated), wrongs 35/71/53
    ["'To preheat the boiler feedwater, raising the average temperature of heat'", "'Preheat boiler feedwater, raising average heat input T'"],
    ["'To reduce the turbine exit velocity'", "'To reduce the turbine exit velocity significantly'"],
    ["'To provide heating steam for the plant buildings as a secondary benefit'", "'Provide heating steam for plant buildings as benefit'"],
    ["'To prevent the turbine from overspeeding at low loads'", "'Prevent the turbine from overspeeding at low loads'"],

    // Line 1500 - correct[0] 73, wrongs 73/73/36
    ["'Gas turbines produce thrust directly'", "'Gas turbines produce thrust directly from exhaust'"],

    // Line 1538 - correct[0] 69, wrongs 36/44/54
    ["'It replaces combustion with external heat addition, treats exhaust as'", "'Replaces combustion with external heat addition'"],
    ["'It assumes the air is incompressible'", "'It assumes the air is fully incompressible'"],
    ["'It accounts for real gas effects but neglects friction'", "'Accounts for real gas effects, neglects friction'"],

    // Line 1667 - correct[0] 61, wrongs 50/50/50 - trim correct
    ["'Compressor, condenser, expansion valve (throttle), evaporator'", "'Compressor, condenser, expansion valve, evaporator'"],

    // Line 1760 - correct[0] 73, wrongs 59/47/54
    ["'To trap any liquid refrigerant that might exit the evaporator during load'", "'Trap liquid refrigerant exiting the evaporator'"],
    ["'To store excess refrigerant for seasonal charge adjustments'", "'Store excess refrigerant for seasonal adjustments'"],
    ["'To increase the system pressure during start-up'", "'Increase the system pressure during start-up'"],
    ["'To filter out contaminants from the refrigerant stream'", "'Filter out contaminants from the refrigerant'"],

    // Line 1784 - correct[0] 48, wrongs 44/29/36
    ["'0.5 \\u2014 COP = T_L/T_H = 253/313'", "'0.5 \\u2014 COP = T_L/T_H = 253/313 ratio'"],

    // Line 1838 - correct[0] 72, wrongs 40/64/59
    ["'A capillary tube is a fixed-restriction device with no moving parts that'", "'Capillary tube is a fixed-restriction, no moving parts'"],
    ["'A capillary tube provides better control'", "'A capillary tube provides much better control'"],
    ["'A capillary tube works only with high-pressure refrigerants'", "'Capillary tube works only with high-pressure fluids'"],

    // Line 1956 - correct[0] 73, wrongs 38/68/67
    ["'In a DX system, the refrigerant directly cools the air in the air handler'", "'In DX systems, refrigerant directly cools the air'"],
    ["'A DX system uses direct current motors'", "'A DX system uses direct current motors only'"],
    ["'A DX system has no compressor; a chilled water system always has one'", "'DX has no compressor; chilled water always has one'"],
    ["'There is no difference \\u2014 both terms describe the same configuration'", "'No difference \\u2014 both describe the same configuration'"],
]);

// ==================== UNIT 5 HEAT ====================
fixFile('unit-5-heat.ts', [
    // Line 61 - correct[0] 73, wrongs 66/56/62
    ["'Apply thermal paste to fill the microscopic air gaps between the surfaces'", "'Apply thermal paste to fill microscopic air gaps'"],
    ["'Polish both surfaces to a mirror finish to eliminate all roughness'", "'Polish both surfaces to a mirror finish'"],
    ["'Increase the heat sink mass to store more thermal energy'", "'Increase heat sink mass to store more energy'"],
    ["'Add a thin copper shim between the surfaces to spread the heat'", "'Add a thin copper shim between the surfaces'"],

    // Line 75 - correct[0] 52, wrongs 33/26/34
    ["'Mismatched thermal conductivities'", "'Mismatched thermal conductivities between parts'"],
    ["'Radiation between surfaces'", "'Radiation heat exchange between the surfaces'"],
    ["'Chemical reaction at the interface'", "'Chemical reaction occurring at the interface'"],

    // Line 229 - correct[0] 73, wrongs 18/65/46
    ["'Alpha = k/ \\u2014 it represents how quickly a material adjusts its temperature'", "'Alpha = k/(rho*cp), how quickly temperature adjusts'"],
    ["'Alpha = k * rho*cp'", "'Alpha = k * rho*cp, product of thermal properties'"],
    ["'Alpha is simply another name for thermal conductivity in SI units'", "'Alpha is another name for thermal conductivity'"],

    // Line 385 - correct[0] 71, wrongs 22/69/34
    ["'The high-k wire acts as a thermal fin, conducting heat along its length'", "'High-k wire acts as thermal fin, conducting heat'"],
    ["'The wire has no effect'", "'The wire has no significant effect on measurement'"],
    ["'The wire improves accuracy by conducting heat more effectively to the'", "'Wire improves accuracy by conducting heat effectively'"],
    ["'The high-k wire only causes errors'", "'The high-k wire only causes measurement errors'"],

    // Line 492 - correct[0] 68, wrongs 36/41/47
    ["'It lumps all the complex fluid mechanics into a single coefficient h'", "'It lumps complex fluid mechanics into one coefficient h'"],
    ["'It only works for gases, not liquids'", "'It only works for gases, not for liquid phases'"],
    ["'It assumes radiation is always negligible'", "'It assumes that radiation is always negligible'"],

    // Line 507 - correct[0] 75, wrongs 10/58/58
    ["'Heat transfer through the fluid is no better than pure conduction through a'", "'Heat transfer equals pure conduction through stagnant layer'"],
    ["'Convection'", "'Convection is the only mode of heat transfer present'"],

    // Line 561 - correct[0] 70, wrongs 47/57/24
    ["'It requires fully developed turbulent flow, moderate Prandtl, moderate'", "'Requires developed turbulent flow, moderate Pr and Re'"],
    ["'It works for all Reynolds numbers, both laminar'", "'Works for all Reynolds numbers, laminar and turbulent'"],
    ["'It is exact for any fluid as long as the pipe is circular'", "'It is exact for any fluid in a circular pipe section'"],
    ["'It only applies to gases'", "'It only applies to gases, not liquid flows at all'"],

    // Line 600 - correct[0] 75, wrongs 32/53/64
    ["'A continuous vapor film forms on the surface, insulating it from the liquid'", "'Continuous vapor film forms, insulating from liquid'"],
    ["'The liquid completely evaporates'", "'The liquid completely evaporates from the surface'"],
    ["'The surface temperature drops below saturation and boiling stops'", "'Surface temperature drops below saturation, stops'"],

    // Line 625 - correct[0] 76, wrongs 72/32/62
    ["'It is the pipe length needed for the thermal boundary layer to fully develop'", "'Pipe length for thermal boundary layer to develop'"],
    ["'It is the pipe length needed for the fluid to reach the wall temperature'", "'Pipe length for the fluid to reach wall temperature'"],
    ["'It only matters for laminar flow'", "'It only matters for laminar flow in circular pipes'"],
    ["'It is the distance the fluid must travel before heating begins'", "'Distance the fluid must travel before heating begins'"],

    // Line 649 - correct[0] 72, wrongs 69/52/40
    ["'Use the Gnielinski correlation which is valid for Re > 2300, or consider'", "'Use Gnielinski correlation, valid for Re > 2300'"],
    ["'Use the laminar correlation since Re is closer to 2300 than to 10,000'", "'Use laminar correlation since Re is closer to 2300'"],
    ["'Average the laminar and turbulent correlation values'", "'Average the laminar and turbulent correlations'"],
    ["'Transition flow is impossible to sustain'", "'Transition flow is impossible to sustain at all'"],

    // Line 702 - correct[0] 72, wrongs 48/64/67
    ["'Staggered tubes force the flow to follow a more tortuous path, promoting'", "'Staggered tubes force a tortuous path, promoting mixing'"],
    ["'Staggered arrangements are easier to manufacture'", "'Staggered tube arrangements are easier to manufacture'"],
    ["'In-line arrangements cause resonant vibration that damages tubes'", "'In-line arrangements cause resonant vibration damage'"],
    ["'Staggered tubes have lower pressure drop for the same heat transfer'", "'Staggered tubes have lower pressure drop for same Q'"],

    // Line 717 - correct[0] 64, wrongs 33/31/42
    ["'At film temperature T_f = (T_s + T_\\u221E)/2 or bulk mean temperature'", "'At film temperature T_f = (T_s + T_\\u221E)/2'"],
    ["'Always at the surface temperature'", "'Always evaluated at the surface temperature'"],
    ["'Always at the inlet temperature'", "'Always evaluated at the inlet temperature'"],

    // Line 780 - correct[0] 80, wrongs 37/37/77
    ["'For Pr = 1, the Stanton number St = h/ equals half the friction factor: St = f/2'", "'For Pr = 1, Stanton number St equals f/2'"],
    ["'The Reynolds analogy states that heat'", "'Reynolds analogy states heat equals momentum'"],
    ["'It applies only to natural convection'", "'It applies only to natural convection flows'"],
    ["'It relates the Reynolds number to the Nusselt number as Nu = Re for all flows'", "'It relates Re to Nu as Nu = Re for all flows'"],

    // Line 834 - correct[0] 68, wrongs 63/45/28
    ["'White paint (high \\u03B5) \\u2014 in the vacuum of space there is no convection'", "'White paint (high \\u03B5) \\u2014 no convection in vacuum'"],
    ["'Polished aluminum \\u2014 reflective surfaces always reject more heat'", "'Polished aluminum \\u2014 reflective rejects more heat'"],
    ["'Either surface works equally well \\u2014 in vacuum'", "'Either surface works equally well in vacuum'"],
    ["'Polished aluminum \\u2014 in space'", "'Polished aluminum \\u2014 always better in space'"],

    // Line 1002 - correct[0] 66, wrongs 60/18/41
    ["'Surface resistance/ accounts for the surface not being a blackbody'", "'Surface resistance accounts for non-blackbody surface'"],
    ["'Surface resistance is the conduction resistance of the solid'", "'Surface resistance is conduction resistance of solid'"],
    ["'Surface resistance'", "'Surface resistance is a purely geometric factor'"],
    ["'Surface resistance applies to metals only'", "'Surface resistance applies only to metal surfaces'"],

    // Line 1167 - correct[0] 71, wrongs 27/57/62
    ["'H_rad = epsilon*sigma**, allowing radiation to be written as q = h_rad*'", "'H_rad linearizes radiation as q = h_rad * delta_T'"],
    ["'H_rad = epsilon*sigma*T_s^4'", "'H_rad = epsilon*sigma*T_s^4, fourth power of T'"],
    ["'H_rad = sigma/epsilon, the inverse of emissive resistance'", "'H_rad = sigma/epsilon, inverse of emissive resistance'"],
    ["'H_rad is always equal to the convective h for the same surface'", "'H_rad always equals convective h for same surface'"],

    // Line 1230 - correct[0] 72, wrongs 38/36/44
    ["'In counter-flow, the cold fluid outlet can approach the hot fluid outlet'", "'Counter-flow cold outlet can approach hot inlet T'"],
    ["'Counter-flow generates more turbulence'", "'Counter-flow generates significantly more turbulence'"],
    ["'Counter-flow has lower pressure drop'", "'Counter-flow arrangement has lower pressure drop'"],

    // Line 1382 - correct[0] 63, wrongs 41/59/60 - trim correct slightly
    ["'Fouling inside the tubes \\u2014 deposits increase thermal resistance'", "'Fouling inside tubes \\u2014 deposits raise thermal resistance'"],
    ["'The pump has degraded, reducing flow rate'", "'The pump has degraded, reducing the flow rate'"],
    ["'The hot fluid has cooled down before reaching the exchanger'", "'Hot fluid has cooled before reaching the exchanger'"],
    ["'The tube material has changed thermal conductivity over time'", "'Tube material changed thermal conductivity over time'"],

    // Line 1523 - correct[0] 75, wrongs 65/51/67
    ["'The temperature approach is the smallest temperature difference between the'", "'Smallest temperature difference between the two streams'"],
    ["'It is the temperature of the approach piping before the exchanger'", "'Temperature of the approach piping before exchanger'"],
    ["'It is the difference between the fluid temperatures'", "'The difference between the inlet fluid temperatures'"],
    ["'The temperature approach must always exceed 50 C for safe operation'", "'Temperature approach must always exceed 50 C safely'"],

    // Line 1547 - correct[0] 72, wrongs 66/50/71
    ["'The corrugations promote turbulence at low Reynolds numbers, create high'", "'Corrugations promote turbulence at low Re, high area'"],
    ["'Corrugations are purely structural and do not affect heat transfer'", "'Corrugations are purely structural, no thermal effect'"],
    ["'The corrugations increase the fluid residence time'", "'Corrugations increase the fluid residence time only'"],
    ["'Corrugations reduce the surface area to make the exchanger more compact'", "'Corrugations reduce surface area for compact design'"],

    // Line 1577 - correct[0] 80, wrongs 28/69/61
    ["'Particulate, biological, chemical reaction, corrosion, and precipitation/scaling'", "'Particulate, biological, chemical, corrosion, scaling'"],
    ["'Only calcium carbonate scale'", "'Only calcium carbonate scale deposits on tubes'"],
    ["'Fouling occurs only in cooling water systems, never in process fluids'", "'Fouling occurs only in cooling water, not process'"],
    ["'There is only one type of fouling \\u2014 general dirt accumulation'", "'Only one type of fouling \\u2014 general dirt accumulation'"],

    // Line 1611 - correct[0] 67, wrongs 57/27/52
    ["'If the fin material has low conductivity relative to the convection'", "'If fin material has low conductivity relative to h'"],
    ["'Fins always improve heat transfer \\u2014 there is no condition'", "'Fins always improve heat transfer regardless'"],
    ["'Fins act as insulation only'", "'Fins act as insulation only, never enhancing Q'"],
    ["'Fins reduce heat transfer when the flow is turbulent'", "'Fins reduce heat transfer in turbulent flow only'"],

    // Line 1626 - correct[0] 78, wrongs 33/65/33
    ["'More short fins generally perform better \\u2014 shorter fins have higher efficiency'", "'More short fins perform better \\u2014 higher efficiency'"],
    ["'Fewer tall fins are always better'", "'Fewer tall fins are always better for cooling'"],
    ["'The performance is identical since total fin mass determines heat'", "'Performance is identical since fin mass determines Q'"],
    ["'More short fins are always better'", "'More short fins are unconditionally better'"],

    // Line 1663 - correct[0] 73, wrongs 47/24/42
    ["'Aluminum offers the best compromise: its conductivity) provides ~90%+ fin'", "'Aluminum offers best cost-to-conductivity compromise'"],
    ["'Copper fins are too soft'", "'Copper fins are too soft for practical use'"],
    ["'Aluminum has higher emissivity than copper'", "'Aluminum has higher emissivity than copper does'"],

    // Line 1884 - correct[0] 76, wrongs 73/46/75
    ["'Replace the actual fin length L with a corrected length L_c = L + t/2 or L_c'", "'Replace L with corrected length L_c = L + t/2'"],
    ["'Double the actual fin length to account for heat transfer from both sides'", "'Double the fin length for heat from both sides'"],
    ["'Subtract the tip thickness from the fin length'", "'Subtract the tip thickness from total fin length'"],
    ["'The corrected length is always 10% longer than the actual length regardless'", "'Corrected length is always 10% longer regardless'"],

    // Line 1899 - correct[0] 77, wrongs 33/39/34
    ["'100 C \\u2014 calculated as delta_T = Q * R_th = 40 W * 2.5 C/W. If ambient is 25 C'", "'100 C \\u2014 \\u0394T = Q \\xD7 R_th = 40 \\xD7 2.5 = 100 C rise'"],
    ["'16 C \\u2014 calculated as Q/R = 40/2.5'", "'16 C \\u2014 calculated as Q/R = 40/2.5 = 16 C'"],
    ["'42.5 C \\u2014 calculated as Q + R = 40 + 2.5'", "'42.5 C \\u2014 Q + R = 40 + 2.5 = 42.5 C sum'"],
    ["'1.0 C \\u2014 calculated as R/Q = 2.5/40'", "'1.0 C \\u2014 calculated as R/Q = 2.5/40 ratio'"],

    // Line 1948 - correct[0] 74, wrongs 31/72/71
    ["'Contact resistance adds a thermal bottleneck at the fin base, reducing the'", "'Contact resistance adds bottleneck at the fin base'"],
    ["'Contact resistance only matters'", "'Contact resistance matters only for very thin fins'"],
    ["'Contact resistance has no effect because the fin base area is very small'", "'Contact resistance has no effect, fin base is small'"],
    ["'Contact resistance increases the fin effectiveness by slowing heat flow'", "'Contact resistance raises effectiveness by slowing Q'"],

    // Line 1978 - correct[0] 79, wrongs 43/79/52
    ["'Q = h * A_total * eta_o * (T_base - T_ambient) = 30 * 0.05 * 0.85 * 55 = 70.1 W'", "'70.1 W \\u2014 Q = h \\xD7 A \\xD7 \\u03B7_o \\xD7 \\u0394T = 30 \\xD7 0.05 \\xD7 0.85 \\xD7 55'"],
    ["'Q = h * A_total * = 30 * 0.05 * 55 = 82.5 W'", "'82.5 W \\u2014 Q = h \\xD7 A \\xD7 \\u0394T = 30 \\xD7 0.05 \\xD7 55 (no \\u03B7)'"],
    ["'Q = h * eta_o * (T_base - T_ambient) = 30 * 0.85 * 55 = 1402.5 W (missing area)'", "'1402.5 W \\u2014 Q = h \\xD7 \\u03B7_o \\xD7 \\u0394T (missing area term)'"],
    ["'Q = h * A_total * eta_o = 30 * 0.05 * 0.85 = 1.275 W'", "'1.275 W \\u2014 Q = h \\xD7 A \\xD7 \\u03B7_o (missing \\u0394T term)'"],

    // Line 2103 - correct[0] 69, wrongs 45/68/66
    ["'Increase the convection coefficient h, decrease the part volume V, or'", "'Increase h, decrease V, or increase surface area'"],
    ["'Increase the thermal conductivity of the part'", "'Increase the thermal conductivity of the part only'"],
    ["'Increase the part surface area by making it larger in all dimensions'", "'Increase surface area by making part larger overall'"],
    ["'Use a quenchant with lower specific heat to reduce heat absorption'", "'Use quenchant with lower cp to reduce heat absorbed'"],

    // Line 2221 - correct[0] 77, wrongs 74/38/42
    ["'Large Bi creates steep temperature gradients between the fast-cooling surface'", "'Large Bi creates steep gradients, thermal stress risk'"],
    ["'Thicker parts are less likely to crack'", "'Thicker parts are less likely to crack overall'"],
    ["'The cooling rate has no effect on cracking'", "'The cooling rate has no effect on cracking risk'"],

    // Line 2348 - correct[0] 72, wrongs 53/33/68
    ["'The laser heating time is so short that the thermal penetration depth is'", "'Heating time is so short, penetration depth is small'"],
    ["'Laser heating is too complex for any analytical model'", "'Laser heating is too complex for analytical models'"],
    ["'The semi-infinite model is chosen'", "'The semi-infinite model is chosen for convenience'"],
    ["'The model works only because steel has infinite thermal conductivity'", "'Model works only if steel has infinite conductivity'"],
]);

// ==================== UNIT 6 FLUIDS ====================
fixFile('unit-6-fluids.ts', [
    // Line 37 - correct[0] 62, wrongs 40/45/58
    ["'The resultant hydrostatic force acts at the center of pressure'", "'Resultant hydrostatic force acts at center of pressure'"],
    ["'The resultant force acts at the centroid'", "'The resultant force acts at the centroid of area'"],
    ["'The centroid calculation is correct for the force location'", "'Centroid calculation is correct for force location'"],

    // Line 52 - correct[0] 64, wrongs 52/29/34
    ["'A Newtonian fluid has a linear relationship between shear stress'", "'Linear relationship between shear stress and strain rate'"],
    ["'Newtonian fluids obey gravity'", "'Newtonian fluids are defined by obeying gravity'"],
    ["'The distinction is purely academic'", "'The distinction is purely academic with no use'"],

    // Line 294 - correct[0] 79, wrongs 38/72/76
    ["'By definition, a fluid deforms continuously under any applied shear stress \\u2014 so'", "'A fluid deforms continuously under any applied shear'"],
    ["'Fluids at rest have infinite viscosity'", "'Fluids at rest have infinite viscosity value'"],
    ["'The gravitational force exactly cancels all internal shear stresses in a'", "'Gravity exactly cancels all internal shear stresses'"],
    ["'Shear stress exists in a static fluid, but it is balanced by pressure forces'", "'Shear stress exists in static fluid, balanced by P'"],

    // Line 333 - correct[0] 74, wrongs 70/63/41
    ["'Vapor pressure is the pressure at which a liquid begins to boil at a given'", "'Pressure at which a liquid begins to boil at given T'"],
    ["'Vapor pressure is the maximum pressure a fluid can withstand before it'", "'Maximum pressure a fluid can withstand before failing'"],
    ["'Vapor pressure is the pressure exerted by vapors above a liquid'", "'Pressure exerted by vapors above a liquid surface'"],
    ["'Vapor pressure is only relevant for gases'", "'Vapor pressure is only relevant for gas phases'"],

    // Line 429 - correct[0] 69, wrongs 43/42/44
    ["'Bernoulli assumes inviscid (frictionless) flow \\u2014 in a long rough pipe'", "'Bernoulli assumes inviscid flow \\u2014 fails in rough pipes'"],
    ["'Bernoulli only works for gases, not liquids'", "'Bernoulli only works for gases, not for liquids'"],
    ["'The pipe diameter was measured incorrectly'", "'The pipe diameter was likely measured incorrectly'"],
    ["'Bernoulli does not apply to horizontal pipes'", "'Bernoulli does not apply to horizontal pipe flow'"],

    // Line 562 - correct[0] 72 (truncated), wrongs 64/48/23
    ["'The continuity equation'", "'The continuity equation conserves momentum'"],

    // Line 577 - correct[0] 72, wrongs 49/19/19
    ["'The theory is wrong'", "'The theory is wrong but irrelevant to real lift'"],

    // Line 616 - correct[0] 77, wrongs 71/42/64
    ["'The difference equals the velocity head V\\xB2/ \\u2014 the EGL includes kinetic energy'", "'Difference equals velocity head V\\xB2/(2g) \\u2014 EGL has KE'"],
    ["'The difference equals the friction head loss at that point according to'", "'Difference equals the friction head loss at that point'"],
    ["'The difference equals the elevation head z'", "'The difference equals the elevation head z value'"],
    ["'They are the same line in constant-diameter pipes using standard'", "'They are the same line in constant-diameter pipes'"],

    // Line 758 - correct[0] 72, wrongs 44/69/30
    ["'The jet follows a projectile path and strikes the ground at a horizontal'", "'Jet follows projectile path, landing at 2\\u221A(h\\u2081h\\u2082)'"],
    ["'The jet always lands directly below the hole'", "'The jet always lands directly below the hole'"],
    ["'The horizontal distance equals h\\u2082, the height of water above the hole'", "'Horizontal distance equals h\\u2082, height above hole'"],
    ["'The jet travels infinitely far'", "'The jet travels infinitely far from the tank'"],

    // Line 845 - correct[0] 74, wrongs 17/25/26
    ["'Head loss increases by roughly 32\\xD7 \\u2014 velocity increases 4\\xD7 (due to A \\u221D D\\xB2)'", "'Head loss increases ~32\\xD7, velocity up 4\\xD7 (A \\u221D D\\xB2)'"],
    ["'Head loss doubles'", "'Head loss doubles due to diameter reduction'"],
    ["'Head loss increases by 4\\xD7'", "'Head loss increases by 4\\xD7 from diameter change'"],
    ["'Head loss increases by 16\\xD7'", "'Head loss increases by 16\\xD7 from velocity change'"],

    // Line 869 - correct[0] 74, wrongs 58/64/42
    ["'In short, fitting-dense systems where minor losses from fittings can equal'", "'Short, fitting-dense systems where minor losses dominate'"],
    ["'Minor losses are always truly minor \\u2014 the name is accurate'", "'Minor losses are always truly minor \\u2014 name is accurate'"],
    ["'Only in laminar flow systems, where the friction factor is lower'", "'Only in laminar flow where the friction factor is lower'"],
    ["'Only when the pipe diameter exceeds 300 mm'", "'Only when the pipe diameter exceeds 300 mm overall'"],

    // Line 909 - correct[0] 73 (truncated), wrongs 73/73/26
    ["'Re has no physical meaning'", "'Re has no physical meaning in fluid mechanics'"],

    // Line 993 - correct[0] 66, wrongs 25/30/31
    ["'Re = VD/\\u03BD = 2 \\xD7 0.05 / 1.0 \\xD7 10\\u207B\\u2076 = 100,000 \\u2014 fully turbulent flow'", "'Re = VD/\\u03BD = 100,000 \\u2014 fully turbulent flow'"],
    ["'Re = 1,000 \\u2014 laminar flow'", "'Re = 1,000 \\u2014 laminar flow regime'"],
    ["'Re = 5,000 \\u2014 transitional flow'", "'Re = 5,000 \\u2014 transitional flow regime'"],
    ["'Re = 50,000 \\u2014 transitional flow'", "'Re = 50,000 \\u2014 transitional flow regime'"],

    // Line 1032 - correct[0] 67, wrongs 23/42/23
    ["'Globe valve (K \\u2248 6-10) is much higher than gate valve (K \\u2248 0.1-0.2)'", "'Globe valve K \\u2248 6-10, much higher than gate K \\u2248 0.1-0.2'"],
    ["'Gate valve has higher K'", "'Gate valve has higher K than globe valve overall'"],
    ["'Both have similar K values when fully open'", "'Both have similar K values when fully open position'"],
    ["'Globe valve has lower K'", "'Globe valve has lower K than gate valve overall'"],

    // Line 1057 - correct[0] 75, wrongs 67/41/40
    ["'Major losses are distributed friction losses along straight pipe sections).'", "'Distributed friction losses along straight pipe sections'"],
    ["'Major losses are always larger than minor losses in any pipe system'", "'Major losses are always larger than minor losses'"],
    ["'Major losses occur only in turbulent flow'", "'Major losses occur only in turbulent flow regime'"],
    ["'Major losses are caused by pipe material'", "'Major losses are caused by the pipe material only'"],

    // Line 1159 - correct[0] 79, wrongs 66/58/69
    ["'Water hammer is a pressure transient caused by a sudden change in flow velocity'", "'Pressure transient from sudden change in flow velocity'"],
    ["'Water hammer is the noise created by turbulent flow in rough pipes'", "'Noise created by turbulent flow in rough pipes'"],
    ["'Water hammer is the vibration of pipes due to pump cycling'", "'Vibration of pipes caused by pump cycling events'"],
    ["'Water hammer only occurs in steam systems when condensate accumulates'", "'Only occurs in steam systems with condensate buildup'"],

    // Line 1174 - correct[0] 64, wrongs 19/38/55
    ["'F = 0.316/Re^(1/4) \\u2014 valid for smooth pipes with 4000 < Re < 10\\u2075'", "'f = 0.316/Re^0.25, smooth pipes, 4000 < Re < 10\\u2075'"],
    ["'f = 64/Re (laminar)'", "'f = 64/Re for laminar flow in smooth pipes'"],

    // Line 1198 - correct[0] 77, wrongs 34/19/59
    ["'The 6-inch pipe is almost certainly more economical \\u2014 head loss scales as D\\u207B\\u2075'", "'6-inch is more economical \\u2014 head loss scales as D\\u207B\\u2075'"],
    ["'The 4-inch pipe is more economical'", "'The 4-inch pipe is more economical for this flow'"],
    ["'They are equivalent'", "'They are equivalent in total lifecycle cost terms'"],
    ["'The comparison cannot be made without knowing the flow rate'", "'Comparison cannot be made without the flow rate'"],

    // Line 1237 - correct[0] 80, wrongs 55/71/17
    ["'Positive displacement pumps \\u2014 their flow rate is nearly independent of viscosity'", "'PD pumps \\u2014 flow rate is nearly independent of viscosity'"],
    ["'Centrifugal pumps \\u2014 their impeller generates more shear'", "'Centrifugal pumps \\u2014 impeller generates more shear'"],
    ["'Either type works equally well \\u2014 viscosity only affects the pipe system'", "'Either type works well \\u2014 viscosity only affects pipe'"],
    ["'Centrifugal pumps'", "'Centrifugal pumps are preferred for all viscosities'"],

    // Line 1252 - correct[0] 79, wrongs 25/40/70
    ["'Hot water has much higher vapor pressure (~70 kPa at 90\\xB0C vs. ~2.3 kPa at 20\\xB0C)'", "'Hot water has higher vapor pressure (~70 vs ~2.3 kPa)'"],
    ["'Hot water is less viscous'", "'Hot water is less viscous and flows more easily'"],
    ["'Hot water expands and becomes less dense'", "'Hot water expands and becomes significantly less dense'"],
    ["'The pump seals soften at high temperature, allowing air ingestion that'", "'Pump seals soften at high T, allowing air ingestion'"],

    // Line 1291 - correct[1] 47, wrongs 36/25/30 - expand wrongs
    ["'The volute casing near the discharge'", "'The volute casing near the discharge port'"],
    ["'The mechanical seal faces'", "'The mechanical seal faces of the pump'"],
    ["'The pump shaft at the coupling'", "'The pump shaft at the coupling flange'"],

    // Line 1385 - correct[0] 74, wrongs 60/32/70
    ["'PD pumps deliver a nearly constant flow regardless of discharge pressure \\u2014'", "'PD pumps deliver constant flow regardless of pressure'"],
    ["'The relief valve prevents air from entering the pump suction'", "'Relief valve prevents air entering the pump suction'"],
    ["'PD pumps generate pulsating flow'", "'PD pumps generate pulsating flow requiring damping'"],
    ["'The relief valve is only needed during startup to prevent water hammer'", "'Relief valve is only needed during pump startup'"],

    // Line 1449 - correct[0] 73, wrongs 45/63/58
    ["'Pelton wheel: low specific speed. Francis: medium specific speed. Kaplan:'", "'Pelton: low Ns. Francis: medium Ns. Kaplan: high Ns'"],
    ["'All three turbines work at any specific speed'", "'All three turbines work at any specific speed range'"],
    ["'Pelton wheels are for large rivers, Kaplan for mountain streams'", "'Pelton for large rivers, Kaplan for mountain streams'"],
    ["'The selection is based on turbine cost, not specific speed'", "'Selection is based on turbine cost, not specific speed'"],

    // Line 1542 - correct[0] 74, wrongs 74/51/65
    ["'Wear rings are replaceable rings that create a close clearance between the'", "'Replaceable rings creating close clearance for sealing'"],
    ["'Wear rings protect the shaft from corrosion in aggressive chemical service'", "'Wear rings protect shaft from chemical corrosion'"],
    ["'Wear rings seal the pump from external leakage to the environment'", "'Wear rings seal the pump from external leakage'"],

    // Line 1621 - correct[0] 75, wrongs 60/24/69
    ["'Losses are split into three categories: hydraulic losses, volumetric losses'", "'Hydraulic, volumetric, and mechanical loss categories'"],
    ["'All 25% is lost as heat in the motor, not in the pump itself'", "'All 25% is lost as heat in the motor, not the pump'"],
    ["'All 25% is lost as noise'", "'All 25% is lost as noise from the pump operation'"],
    ["'The losses occur only at the pump discharge nozzle as a pressure drop'", "'Losses occur only at the discharge nozzle as \\u0394P'"],

    // Line 1684 - correct[0] 63, wrongs 44/62/35
    ["'Pressurize the tunnel or cool the air to cryogenic temperatures'", "'Pressurize the tunnel or cool air to cryogenic T'"],
    ["'Accept the Reynolds number mismatch'", "'Accept the Reynolds number mismatch as given'"],

    // Line 1699 - correct[0] 67, wrongs 66/67/29
    ["'All three use Reynolds number'", "'All three applications use Reynolds number only'"],

    // Line 1778 - correct[0] 70, wrongs 63/40/53
    ["'Every term in a valid physical equation must have the same dimensions.'", "'Every term in a valid equation must have same dimensions'"],
    ["'Dimensional homogeneity means all variables must be in SI units'", "'Dimensional homogeneity means all must be in SI units'"],
    ["'It means all terms must be dimensionless'", "'It means all terms must be dimensionless quantities'"],

    // Line 1793 - correct[0] 74, wrongs 8/46/40
    ["'Ma = V/c. Compressibility effects become significant above Ma \\u2248 0.3. Below'", "'Ma = V/c, compressibility significant above Ma \\u2248 0.3'"],
    ["'Ma = V/c'", "'Ma = V/c is the basic definition without context'"],
    ["'Ma is only relevant for supersonic flows'", "'Ma is only relevant for supersonic flow conditions'"],

    // Line 1896 - correct[0] 79, wrongs 66/45/74
    ["'If the dependent variable is a repeating variable, it appears in every Pi group'", "'Dependent variable as repeating appears in every Pi'"],
    ["'The dependent variable must be excluded entirely from the analysis'", "'Dependent variable must be excluded from the analysis'"],
    ["'Repeating variables must all be dimensionless'", "'Repeating variables must all be dimensionless values'"],
    ["'There is no such rule \\u2014 the dependent variable can be a repeating variable'", "'No such rule \\u2014 dependent variable can be repeating'"],

    // Line 1975 - correct[0] 76, wrongs 71/67/33
    ["'The key groups are the impeller Reynolds number, the power number), the flow'", "'Impeller Re, power number, and flow number are key'"],
    ["'Only the Reynolds number matters \\u2014 all other groups are derived from it'", "'Only Re matters \\u2014 all other groups are derived from it'"],
    ["'The Froude number is the only important parameter for stirred tanks'", "'Froude number is the only important parameter here'"],
    ["'No dimensional analysis is needed'", "'No dimensional analysis is needed for stirred tanks'"],

    // Line 1990 - correct[0] 71, wrongs 71/71/33
    ["'The formal Buckingham method systematically combines each non-repeating'", "'Buckingham method systematically forms Pi groups'"],
    ["'The formal method gives more groups than inspection -- following from a'", "'Formal method gives more groups than inspection'"],
    ["'Inspection only works for simple problems with 2-3 variables -- per the'", "'Inspection only works for simple 2-3 variable cases'"],
    ["'The formal method is always wrong'", "'The formal method is always wrong in practice'"],

    // Line 2014 - correct[0] 60, wrongs 37/20/43
    ["'In river/estuary models, using the same scale for horizontal'", "'Same horizontal and vertical scale causes issues'"],
    ["'Distorted models are cheaper to build'", "'Distorted models are cheaper to build overall'"],
    ["'Distortion is needed'", "'Distortion is needed for proper flow modeling'"],
    ["'Distorted models are never used in practice'", "'Distorted models are never used in real practice'"],
]);

// ==================== UNIT 8 MACHINE ====================
fixFile('unit-8-machine.ts', [
    // Line 22 - correct[1] 77, wrongs 43/74/43
    ["'Fatigue failure initiated at the stress concentration from the keyway corner.'", "'Fatigue initiated at stress concentration from keyway.'"],
    ["'The shaft was overloaded in a single event.'", "'The shaft was overloaded in a single static event.'"],
    ["'Corrosion weakened the shaft at the keyway.'", "'Corrosion gradually weakened the shaft at the keyway.'"],

    // Line 218 - correct[2] 77, wrongs 73/59/54
    ["'Use the reciprocal sum: 1/omega_c^2 = 1/omega_1^2 + 1/omega_2^2 + 1/omega_3^2'", "'Reciprocal sum: 1/\\u03C9_c\\xB2 = 1/\\u03C9_1\\xB2 + 1/\\u03C9_2\\xB2 + 1/\\u03C9_3\\xB2'"],
    ["'Add all individual critical speeds: omega_c = omega_1 + omega_2 + omega_3'", "'Add all speeds: \\u03C9_c = \\u03C9_1 + \\u03C9_2 + \\u03C9_3 directly'"],
    ["'Take the average: omega_c = (omega_1 + omega_2 + omega_3)/3'", "'Average: \\u03C9_c = (\\u03C9_1 + \\u03C9_2 + \\u03C9_3)/3 of each speed'"],
    ["'Use the product: omega_c = omega_1 * omega_2 * omega_3'", "'Product: \\u03C9_c = \\u03C9_1 \\xD7 \\u03C9_2 \\xD7 \\u03C9_3 of all speeds'"],

    // Line 539 - correct[1] 72, wrongs 64/49/49
    ["'It can accommodate angular misalignment of 2-3 degrees between the inner'", "'Accommodates angular misalignment of 2-3\\xB0 between rings'"],
    ["'It has a higher load capacity than standard deep groove bearings'", "'Higher load capacity than standard deep groove bearings'"],
    ["'It has lower friction than any other bearing type'", "'It has lower friction than any other bearing type used'"],

    // Line 593 - correct[0] 61, wrongs 46/49/50 - trim correct
    ["'L1 = 0.21 \\xD7 L10 (about one-fifth of the standard life rating)'", "'L1 = 0.21 \\xD7 L10 (about one-fifth of standard life)'"],
    ["'L1 = 0.99 \\xD7 L10 (essentially the same as standard)'", "'L1 = 0.99 \\xD7 L10 (essentially same as standard)'"],

    // Line 672 - correct[0] 74, wrongs 23/49/42
    ["'The shaft center is displaced 60% of the radial clearance from the bearing'", "'Shaft center displaced 60% of radial clearance'"],
    ["'The bearing is 60% worn'", "'The bearing is 60% worn from its original size'"],
    ["'The shaft is rotating at 60% of the maximum speed'", "'Shaft is rotating at 60% of the maximum speed'"],
    ["'The oil fills 60% of the bearing clearance'", "'The oil fills 60% of the bearing clearance gap'"],

    // Line 736 - correct[1] 77, wrongs 72/52/50
    ["'They have a speed limitation due to centrifugal forces on the balls \\u2014 at high'", "'Speed limited by centrifugal forces on balls at high RPM'"],
    ["'They cannot handle any radial load \\u2014 they are purely axial load bearings'", "'Cannot handle any radial load \\u2014 purely axial bearings'"],

    // Line 902 - correct[2] 75, wrongs 61/60/42
    ["'The number of teeth (which determines the tooth shape/geometry at the root)'", "'Number of teeth determines tooth geometry at the root'"],
    ["'Only the gear material and hardness \\u2014 a secondary effect only'", "'Only the gear material and hardness affect bending'"],
    ["'Only the module and face width, prior to any post-processing'", "'Only the module and face width, not tooth count'"],
    ["'The rotational speed and power transmitted'", "'The rotational speed and the power transmitted'"],

    // Line 1048 - correct[1] 77, wrongs 53/75/43
    ["'The pinion makes more contact cycles than the gear (because it rotates faster'", "'Pinion makes more contact cycles, rotating faster'"],
    ["'The pinion is always the input gear, and input gears must be harder by code'", "'Pinion is always input gear, must be harder by code'"],
    ["'Making the pinion harder reduces gear noise'", "'Making the pinion harder significantly reduces noise'"],

    // Line 1102 - correct[1] 70, wrongs 45/38/54
    ["'Internal dynamic loads generated by gear tooth errors, profile errors,'", "'Internal dynamic loads from tooth errors and profiles'"],
    ["'The effect of material density on gear weight'", "'Effect of material density on overall gear weight'"],
    ["'The dynamic viscosity of the lubricant'", "'The dynamic viscosity of the lubricant in the mesh'"],
    ["'The effect of gear inertia during startup and shutdown'", "'Effect of gear inertia during startup and shutdown'"],

    // Line 1166 - correct[1] 76, wrongs 39/61/35
    ["'To avoid undercutting of the tooth root when the pinion has fewer teeth than'", "'Avoid tooth root undercutting when pinion has few teeth'"],
    ["'To make the gear cheaper to manufacture'", "'To make the gear cheaper to manufacture overall'"],
    ["'To increase the gear ratio beyond what the tooth count allows'", "'Increase the gear ratio beyond tooth count limits'"],
    ["'To reduce gear noise at high speeds'", "'To reduce gear noise at high operating speeds'"],

    // Line 1190 - correct[1] 72, wrongs 72/45/41 (correct[1] = wrongs too)
    // Actually correct is [1], wrongs are [0] 72, [2] 45, [3] 41
    ["'Scoring failure governed by flash temperature'", "'Scoring failure governed by flash temperature rise'"],
    ["'Wear failure governed by sliding velocity'", "'Wear failure governed by the sliding velocity rate'"],

    // Line 1355 - correct[1] 73, wrongs 71/37/33
    ["'In slip-critical connections, the load is transferred by friction between'", "'Slip-critical transfers load by friction between plates'"],
    ["'They are the same \\u2014 just different terminology used by different codes,'", "'Same concept \\u2014 different terminology by different codes'"],
    ["'Slip-critical uses higher-grade bolts'", "'Slip-critical uses higher-grade bolts than bearing'"],
    ["'Slip-critical is for static loads'", "'Slip-critical connections are for static loads only'"],

    // Line 1394 - correct[1] 68, wrongs 25/33/53
    ["'k_b = 1 / (L_s/(E*A_d) + L_t/(E*A_t)) \\u2014 the bolt acts as two springs'", "'k_b = 1/(L_s/(EA_d) + L_t/(EA_t)), two springs in series'"],
    ["'k_b = E*A_d / (L_s + L_t)'", "'k_b = E\\xD7A_d / (L_s + L_t) using full shank area'"],
    ["'k_b = E*(A_d + A_t) / (L_s + L_t)'", "'k_b = E\\xD7(A_d + A_t) / (L_s + L_t) average area'"],
    ["'k_b = E*A_t / L_t (only the threaded portion matters)'", "'k_b = E\\xD7A_t / L_t, only threaded portion matters'"],

    // Line 1409 - correct[1] 74, wrongs 44/46/39
    ["'A complete joint penetration (CJP) butt weld has the full cross-section of'", "'CJP butt weld has the full cross-section of parent metal'"],
    ["'Butt welds are cheaper and faster to produce'", "'Butt welds are cheaper and faster to produce overall'"],
    ["'Butt welds do not require any edge preparation'", "'Butt welds do not require any edge preparation work'"],
    ["'Butt welds never have residual stresses'", "'Butt welds never develop any residual stresses'"],

    // Line 1434 - correct[2] 78, wrongs 52/54/57
    ["'It depends on the gasket type and internal pressure \\u2014 soft gaskets (low m, low'", "'Depends on gasket type and pressure \\u2014 soft vs metallic'"],
    ["'The seating condition always requires more bolt load'", "'Seating condition always requires more bolt load'"],
    ["'The operating condition always requires more bolt load'", "'Operating condition always requires more bolt load'"],

    // Line 1449 - correct[1] 74, wrongs 53/46/39
    ["'A vibration test that applies transverse (side-to-side) motion to a bolted'", "'Vibration test applying transverse motion to a joint'"],
    ["'A test for bolt tensile strength under impact loading'", "'A test for bolt tensile strength under impact loads'"],
    ["'A test for gasket creep under high temperature'", "'A test for gasket creep under high temperature use'"],
    ["'A non-destructive test for weld defects'", "'A non-destructive testing method for weld defects'"],

    // Line 1513 - correct[1] 77, wrongs 74/72/34
    ["'At the weld toe \\u2014 the geometric transition between the weld face and the base'", "'At the weld toe \\u2014 transition between weld and base'"],
    ["'At the center of the weld bead, where the metal is hottest during welding,'", "'At center of weld bead, where metal is hottest'"],
    ["'In the base metal far from the weld, where residual stresses are highest'", "'In base metal far from weld, highest residual stress'"],
    ["'At the midpoint of the weld length'", "'At the midpoint of the weld length precisely'"],

    // Line 1639 - correct[1] 75, wrongs 72/40/74
    ["'The spring index is too low (tightly wound), causing a high Wahl correction'", "'Spring index too low, causing high Wahl correction factor'"],
    ["'The spring material is defective \\u2014 replace the supplier and use the same'", "'Spring material is defective \\u2014 replace the supplier'"],
    ["'The spring is corroding at that location'", "'The spring is corroding at that specific location'"],
    ["'The spring is bottoming out (going solid) during operation, causing impact'", "'Spring is bottoming out during operation causing impact'"],

    // Line 1781 - correct[1] 72, wrongs 64/49/69
    ["'The free length to mean diameter ratio (L_f/D = 6) is too high \\u2014 springs'", "'L_f/D = 6 is too high \\u2014 spring will buckle under load'"],
    ["'The spring material is too soft \\u2014 use a higher-grade spring wire'", "'Material is too soft \\u2014 use a higher-grade wire'"],
    ["'The wire diameter is too large \\u2014 use thinner wire'", "'Wire diameter is too large \\u2014 use thinner wire'"],
    ["'The number of coils is too few \\u2014 add more coils to stiffen the spring'", "'Too few coils \\u2014 add more coils to stiffen spring'"],

    // Line 1820 - correct[2] 75, wrongs 42/61/53
    ["'Bending stress \\u2014 each leaf acts as a beam, with the stress varying linearly'", "'Bending stress \\u2014 each leaf acts as a loaded beam'"],
    ["'Pure torsion \\u2014 the leaves twist under load'", "'Pure torsion \\u2014 the leaves twist under the load'"],
    ["'Pure tension \\u2014 the leaves are stretched by the vehicle weight'", "'Pure tension \\u2014 leaves stretched by vehicle weight'"],
    ["'Uniform compressive stress through the leaf thickness'", "'Uniform compressive stress through leaf thickness'"],

    // Line 1884 - correct[1] 73, wrongs 61/49/50
    ["'At the hooks (end loops) \\u2014 the bend radius at the hook transition creates'", "'At hooks \\u2014 bend radius at hook transition is critical'"],
    ["'At the center of the spring body, where the stress is highest'", "'At center of spring body, where stress is highest'"],
    ["'At the point where the spring contacts its anchor'", "'At the point where spring contacts its anchor point'"],

    // Line 1938 - correct[1] 71, wrongs 34/33/48
    ["'Particulate contamination in the process fluid \\u2014 hard particles entered'", "'Particulate contamination \\u2014 hard particles entered'"],
    ["'The seal was installed upside down'", "'The seal was installed upside down incorrectly'"],
    ["'The seal spring force is too high'", "'The seal spring force is set too high for use'"],
    ["'The shaft speed is too low for hydrodynamic lift'", "'Shaft speed is too low for hydrodynamic lift'"],

    // Line 1953 - correct[0] 74, wrongs 43/44/74
    ["'They are different names for the same component \\u2014 a hard ring installed on'", "'Different names for the same hard ring component'"],
    ["'Backup rings prevent the O-ring from moving'", "'Backup rings prevent the O-ring from moving out'"],
    ["'They serve completely different functions \\u2014 backup rings center the O-ring'", "'Different functions \\u2014 backup rings center the O-ring'"],
]);

// ==================== UNIT 9 GDT ====================
fixFile('unit-9-gdt.ts', [
    // Line 51 - correct[1] 77, wrongs 74/36/74
    ["'Interference fit \\u2014 the shaft maximum (50.050) always exceeds the hole maximum'", "'Interference fit \\u2014 shaft max always exceeds hole min'"],
    ["'Clearance fit with no concerns \\u2014 the shaft is always smaller than the hole'", "'Clearance fit \\u2014 shaft is always smaller than the hole'"],
    ["'Transition fit \\u2014 sometimes clearance'", "'Transition fit \\u2014 sometimes clearance, sometimes not'"],
    ["'The tolerances are invalid because the shaft cannot be larger than nominal'", "'Tolerances are invalid, shaft cannot exceed nominal'"],

    // Line 106 - correct[0] 71, wrongs 42/49/57
    ["'A hole with fundamental deviation H and IT grade 7, mating with a shaft'", "'Hole with H deviation and IT7, mating with g6 shaft'"],
    ["'A hole of 7 mm mating with a shaft of 6 mm'", "'A hole of 7 mm mating with a shaft of 6 mm size'"],
    ["'A transition fit where H and g are surface finish symbols'", "'Transition fit where H and g are surface finishes'"],

    // Line 315 - correct[1] 71, wrongs 49/58/41
    ["'Tolerance is the total permissible variation in a single part dimension'", "'Tolerance is total permissible variation in one part'"],
    ["'They are synonyms and can be used interchangeably'", "'They are synonyms and are used interchangeably'"],
    ["'Tolerance applies to holes and allowance applies to shafts'", "'Tolerance applies to holes, allowance to shafts'"],

    // Line 354 - correct[1] 76, wrongs 76/67/57
    ["'At MMC (\\u220520.05 for a shaft), the feature must have perfect form \\u2014 meaning it'", "'At MMC the feature must have perfect form per Rule #1'"],
    ["'The feature can have any form as long as its two-point measurement is within'", "'Any form is acceptable if two-point measurement is OK'"],
    ["'Form control requires a separate GD&T callout regardless of Rule #1'", "'Form control requires separate GD&T callout always'"],
    ["'Rule #1 only applies to angular dimensions, not diameters'", "'Rule #1 only applies to angles, not to diameters'"],

    // Line 427 - correct[1] 78, wrongs 75/55/75
    ["'Because at MMC the holes are smallest and shafts largest (tightest fit), so if'", "'At MMC holes are smallest, shafts largest \\u2014 tightest'"],
    ["'MMC is simply the default \\u2014 there is no functional reason to prefer it over'", "'MMC is the default \\u2014 no functional reason to prefer it'"],
    ["'MMC only applies to shafts, not holes, so it is used for the bolt side only'", "'MMC only applies to shafts, not holes, for bolts only'"],

    // Line 580 - correct[1] 74, wrongs 45/40/25
    ["'Two parallel planes 0.05 apart that are exactly perpendicular to datum A \\u2014'", "'Two planes 0.05 apart, perpendicular to datum A'"],
    ["'A cylinder of \\u22050.05 around the surface normal'", "'A cylinder of \\u22050.05 around the surface normal axis'"],
    ["'A single plane exactly 0.05 from datum A'", "'A single plane exactly 0.05 away from datum A'"],
    ["'A square zone 0.05 \\xD7 0.05'", "'A square zone of 0.05 \\xD7 0.05 around the feature'"],

    // Line 595 - correct[1] 74, wrongs 30/69/41
    ["'\\u220520.15 \\u2014 MMC size (20.1) plus the geometric tolerance (0.05), representing'", "'\\u220520.15 \\u2014 MMC size (20.1) plus geometric tol (0.05)'"],
    ["'\\u220520.00 \\u2014 just the nominal size'", "'\\u220520.00 \\u2014 just the nominal size of the feature'"],
    ["'\\u220520.10 \\u2014 just the MMC size \\u2014 an incomplete explanation that overlooks'", "'\\u220520.10 \\u2014 just the MMC size, incomplete explanation'"],
    ["'\\u220520.05 \\u2014 nominal plus geometric tolerance'", "'\\u220520.05 \\u2014 nominal size plus geometric tolerance'"],

    // Line 634 - correct[1] 68, wrongs 52/53/35
    ["'The surface must lie between two parallel planes 0.1 apart, oriented'", "'Surface between two planes 0.1 apart at 45\\xB0 to A'"],
    ["'The surface must be at exactly 45\\xB0 \\xB1 0.1\\xB0 to datum A'", "'Surface must be at exactly 45\\xB0 \\xB1 0.1\\xB0 to datum A'"],
    ["'The feature must be within a cylindrical zone of \\u22050.1'", "'Feature must be within a cylindrical zone of \\u22050.1'"],
    ["'The surface must be flat within 0.1'", "'The surface must be flat within 0.1 tolerance'"],

    // Line 674 - correct[1] 72, wrongs 45/51/52
    ["'Yes \\u2014 orientation tolerances (parallelism, perpendicularity, angularity)'", "'Yes \\u2014 orientation tolerances inherently control form'"],
    ["'No \\u2014 parallelism and flatness are independent'", "'No \\u2014 parallelism and flatness are independent controls'"],
    ["'Parallelism does not apply to surfaces, only to axes'", "'Parallelism does not apply to surfaces, only axes'"],

    // Line 698 - correct[1] 74, wrongs 25/25/33
    ["'T = (MMC hole size \\u2212 MMC fastener size) / 2, applied equally to each part,'", "'T = (MMC hole \\u2212 MMC fastener) / 2 per part'"],
    ["'T = hole size \\xD7 bolt size'", "'T = hole size \\xD7 bolt size product formula'"],
    ["'T = hole size + bolt size'", "'T = hole size + bolt size summed together'"],
    ["'T = MMC hole size \\u2212 LMC bolt size'", "'T = MMC hole size minus LMC bolt size value'"],

    // Line 713 - correct[1] 78, wrongs 64/66/54
    ["'The lower segment (FRTZF \\u2014 Feature Relating Tolerance Zone Framework) controls'", "'FRTZF controls pattern location relative to datums'"],
    ["'The same thing as the upper segment but with a tighter tolerance'", "'Same as upper segment but with a tighter tolerance'"],
    ["'The lower segment applies only to the smallest hole in the pattern'", "'Lower segment applies only to the smallest hole'"],
    ["'The lower segment overrides the upper segment entirely'", "'The lower segment overrides upper segment entirely'"],

    // Line 736 - correct[0] 72, wrongs 58/65/51
    ["'A tolerance zone extending beyond the feature into the mating part space'", "'Zone extending beyond feature into mating part space'"],
    ["'A tolerance zone that applies only in projected (2D) views'", "'A tolerance zone applied only in projected 2D views'"],
    ["'A zone projected onto the datum plane for measurement convenience'", "'Zone projected onto datum plane for measurement ease'"],

    // Line 776 - correct[1] 76, wrongs 37/70/51
    ["'Circular runout \\u2014 to control the face wobble (axial FIM) as the part rotates'", "'Circular runout \\u2014 controls face wobble as part rotates'"],
    ["'Flatness \\u2014 to ensure the face is flat'", "'Flatness \\u2014 to ensure the face surface is flat'"],
    ["'Parallelism \\u2014 to ensure the face is parallel to a reference, excluding'", "'Parallelism \\u2014 face parallel to a reference surface'"],

    // Line 883 - correct[1] 70, wrongs 54/50/67
    ["'2 degrees of freedom (two translations perpendicular to the bore axis)'", "'2 DOF (two translations perpendicular to bore axis)'"],
    ["'3 degrees of freedom (one translation + two rotations)'", "'3 DOF (one translation plus two rotations total)'"],
    ["'1 degree of freedom (rotation about the bore axis)'", "'1 DOF (rotation about the bore axis only)'"],
    ["'4 degrees of freedom (all but axial translation and axial rotation)'", "'4 DOF (all but axial translation and rotation)'"],

    // Line 977 - correct[2] 75, wrongs 50/74/36
    ["'4 DOF \\u2014 two translations perpendicular to the axis plus two rotations about'", "'4 DOF \\u2014 two translations plus two rotations about it'"],
    ["'2 DOF \\u2014 two translations perpendicular to the axis'", "'2 DOF \\u2014 two translations perpendicular to axis'"],
    ["'3 DOF \\u2014 two translations perpendicular to the axis plus one rotation about'", "'3 DOF \\u2014 two translations plus one rotation about it'"],
    ["'5 DOF \\u2014 all except axial translation'", "'5 DOF \\u2014 all except the axial translation only'"],

    // Line 1055 - correct[1] 76, wrongs 57/50/63
    ["'The datum simulator is a fixed pin at the virtual condition size of the bore'", "'Datum simulator is a fixed pin at virtual condition'"],
    ["'The datum axis is established at the MMC size of the bore'", "'Datum axis established at the MMC size of the bore'"],
    ["'The tolerance only applies when the bore is at MMC'", "'Tolerance only applies when the bore is at MMC size'"],
    ["'The bore must be produced at exactly MMC to function as a datum'", "'Bore must be produced at exactly MMC to be a datum'"],

    // Line 1069 - correct[1] 76, wrongs 66/46/48
    ["'Use datum targets with a specified clamping/restraint system that replicates'", "'Use datum targets with clamping that replicates use'"],
    ["'Use standard full-surface datums \\u2014 the flexibility does not matter'", "'Use standard full-surface datums for sheet metal'"],

    // Line 1105 - correct[1] 73, wrongs 54/62/54
    ["'To fully define the measurement coordinate system and eliminate ambiguity'", "'To fully define measurement coordinate system'"],
    ["'It is never necessary \\u2014 one datum is always sufficient'", "'It is never necessary \\u2014 one datum is sufficient'"],
    ["'Additional datums are only for CMM alignment, not for function'", "'Additional datums are only for CMM alignment'"],
    ["'Multiple datums are only needed for position tolerance'", "'Multiple datums are only for position tolerance'"],

    // Line 1128 - correct[1] 75, wrongs 40/49/63
    ["'A cone establishes a datum axis and a datum point simultaneously \\u2014 the axis'", "'Cone establishes both a datum axis and datum point'"],
    ["'A cone cannot be used as a datum feature'", "'A cone cannot be used as a datum feature at all'"],
    ["'A cone establishes two datum planes perpendicular to each other'", "'Cone establishes two perpendicular datum planes'"],

    // Line 1142 - correct[1] 76, wrongs 76/59/57
    ["'All geometric tolerances sharing the same datum reference frame and material'", "'Tolerances sharing same DRF and modifier are linked'"],
    ["'All datums must be manufactured at the same time, which would only hold true'", "'All datums must be manufactured at the same time'"],
    ["'The three datums must be measured simultaneously on the CMM'", "'Three datums must be measured simultaneously on CMM'"],
    ["'The datum features must all have the same tolerance value'", "'Datum features must all have the same tolerance'"],

    // Line 1164 - correct[1] 77, wrongs 46/39/50
    ["'The flange face as primary datum (A), the bore or pilot diameter as secondary'", "'Flange face primary (A), bore secondary, hole clocks'"],
    ["'Two of the four holes as datums A and B'", "'Two of the four holes serve as datums A and B'"],
    ["'The outer diameter of the flange as the only datum'", "'Outer diameter of the flange as the only datum'"],

    // Line 1178 - correct[1] 76, wrongs 45/53/58
    ["'The part rocks on the datum simulator, contacting different high points each'", "'Part rocks on simulator, contacting different points'"],
    ["'The datum plane is wavy, matching the surface'", "'Datum plane is wavy, matching the actual surface'"],
    ["'The CMM software automatically corrects for poor form'", "'CMM software automatically corrects for poor form'"],
    ["'Poor form on a datum feature has no effect on measurements'", "'Poor form on datum feature has no effect at all'"],

    // Line 1311 - correct[1] 77, wrongs 46/35/32
    ["'Identify the critical assembly requirement (the gap or clearance of interest)'", "'Identify the critical assembly gap or clearance'"],
    ["'Select the analysis method (worst-case or RSS)'", "'Select analysis method (worst-case or RSS approach)'"],
    ["'Assign tolerances to all dimensions'", "'Assign tolerances to all contributing dimensions'"],
    ["'Build a prototype and measure it'", "'Build a prototype and measure it for validation'"],

    // Line 1656 - correct[1] 78, wrongs 78/27/24
    ["'They are right \\u2014 9 points on a large surface may miss local deviations between'", "'Right \\u2014 9 points on large surface may miss deviations'"],
    ["'They are wrong \\u2014 9 points is sufficient for any flatness measurement, provided'", "'Wrong \\u2014 9 points is sufficient for flatness measurement'"],
    ["'Point count does not matter'", "'Point count does not matter for this measurement'"],
    ["'They are right, but only'", "'They are right, but only for very small surfaces'"],

    // Line 1972 - correct[1] 78, wrongs 28/57/69
    ["'The surface must not be machined \\u2014 it must remain in the as-manufactured state'", "'Surface must remain in as-manufactured state (unmachined)'"],
    ["'The surface must be machined'", "'The surface must be machined to specification'"],
    ["'The surface requires electrical discharge machining (EDM)'", "'The surface requires electrical discharge machining'"],
    ["'The roughness applies only to the first article, not production parts'", "'Roughness applies only to first article, not production'"],
]);

console.log('\nAll files processed. Running verification...');
