/**
 * Space Stars — animated deep-space background for space/astronomy lessons.
 *
 * Element count: 14 stars + 2 planets + 2 nebula + 1 aurora + 3 shooting stars
 *                + 1 comet + 1 satellite + 1 moon + 1 constellation = 26/30
 *
 * Features:
 * - Twinkling stars with varied sizes/colors/glow
 * - Supernova flash on star s4 every ~45s
 * - Saturn-ringed planet (p1) and small red planet (p2)
 * - Nebula breathing + slow position drift
 * - Aurora/nebula color wash — slow sweeping gradient
 * - Shooting stars with bright heads + meteor shower burst every ~35s
 * - Comet with correctly-angled trailing tail
 * - Satellite pass — image with wobbly tumble crossing screen
 * - Moon crescent with earthshine glow
 * - Constellation lines connecting star groups
 */
export const background = {
  name: 'Space Stars',
  category: 'Space',
  theme: 'dark' as const,
  css: `
#lb-space-stars {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #05080F 0%, #0a1128 25%, #15103a 55%, #0d0b2e 75%, #05080F 100%);
  overflow: hidden;
}

/* ── Stars ── */
#lb-space-stars .lb-star {
  position: absolute;
  border-radius: 50%;
  will-change: opacity, transform;
  opacity: 0.4;
  transform: scale(0.9);
  animation: lb-twinkle 4s infinite ease-in-out;
}
#lb-space-stars .lb-s1 { animation-duration: 3.2s; animation-delay: 0s; }
#lb-space-stars .lb-s2 { animation-duration: 4.5s; animation-delay: 0.8s; }
#lb-space-stars .lb-s3 { animation-duration: 3.7s; animation-delay: 1.5s; }
#lb-space-stars .lb-s4 {
  animation: lb-twinkle 5.1s 0.3s infinite ease-in-out, lb-supernova 45s 12s infinite ease-out;
}
#lb-space-stars .lb-s5 { animation-duration: 3.9s; animation-delay: 2.2s; }
#lb-space-stars .lb-s6 { animation-duration: 4.3s; animation-delay: 1s; }
#lb-space-stars .lb-s7 { animation-duration: 3.5s; animation-delay: 1.7s; }
#lb-space-stars .lb-s8 { animation-duration: 5.5s; animation-delay: 0.5s; }
#lb-space-stars .lb-s9 { animation-duration: 4s; animation-delay: 2.6s; }
#lb-space-stars .lb-s10 { animation-duration: 3.3s; animation-delay: 1.3s; }
#lb-space-stars .lb-s11 { animation-duration: 4.8s; animation-delay: 0.1s; }
#lb-space-stars .lb-s12 { animation-duration: 3.6s; animation-delay: 1.9s; }
#lb-space-stars .lb-s13 { animation-duration: 5.3s; animation-delay: 0.7s; }
#lb-space-stars .lb-s14 { animation-duration: 4.1s; animation-delay: 2.4s; }

/* ── Planets ── */
#lb-space-stars .lb-planet {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}
#lb-space-stars .lb-p1 { animation: lb-float 14s 0s infinite ease-in-out; }
#lb-space-stars .lb-p2 { animation: lb-float 18s 4s infinite ease-in-out; }
#lb-space-stars .lb-p1::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 78px; height: 14px;
  margin-left: -39px; margin-top: -7px;
  border: 1.5px solid rgba(129,140,248,0.3);
  border-radius: 50%;
  transform: rotate(-20deg);
  pointer-events: none;
}

/* ── Nebula ── */
#lb-space-stars .lb-nebula {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}
#lb-space-stars .lb-n1 { animation: lb-breathe 20s 0s infinite ease-in-out; }
#lb-space-stars .lb-n2 { animation: lb-breathe 25s 6s infinite ease-in-out; }

/* ── Aurora wash ── */
#lb-space-stars .lb-aurora {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.04) 0%, transparent 50%);
  will-change: transform, opacity;
  animation: lb-aurora 35s 0s infinite ease-in-out;
  opacity: 0;
  mix-blend-mode: screen;
  pointer-events: none;
}

/* ── Shooting stars ── */
#lb-space-stars .lb-shoot {
  position: absolute;
  height: 2px;
  border-radius: 2px;
  will-change: transform, opacity;
  opacity: 0;
  background: linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.95) 100%);
}
#lb-space-stars .lb-shoot::after {
  content: '';
  position: absolute;
  left: -1px; top: 50%;
  width: 4px; height: 4px; margin-top: -2px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 0 6px 2px rgba(255,255,255,0.5);
}
#lb-space-stars .lb-sh1 { width: 100px; animation: lb-shoot-a 35s 0s infinite linear; }
#lb-space-stars .lb-sh2 { width: 70px; animation: lb-shoot-b 35s 0s infinite linear; }
#lb-space-stars .lb-sh3 { width: 50px; animation: lb-shoot-c 35s 0s infinite linear; }

/* ── Comet ── */
#lb-space-stars .lb-comet {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #E0E7FF;
  box-shadow: 0 0 12px 4px rgba(224,231,255,0.6), 0 0 30px 8px rgba(99,102,241,0.2);
  will-change: transform, opacity;
  opacity: 0;
  animation: lb-comet 25s 5s infinite ease-in-out;
}
#lb-space-stars .lb-comet::after {
  content: '';
  position: absolute;
  top: 50%; right: 100%;
  width: 70px; height: 2px; margin-top: -1px;
  background: linear-gradient(90deg, transparent, rgba(224,231,255,0.5));
  border-radius: 2px;
  transform: none;
}

/* ── Satellite ── */
#lb-space-stars .lb-satellite {
  position: absolute;
  width: 44px; height: 44px;
  will-change: transform, opacity;
  opacity: 0;
  animation: lb-satellite 47s 15s infinite linear;
  pointer-events: none;
  filter: brightness(0.85) drop-shadow(0 0 3px rgba(99,200,255,0.3));
}

/* ── Moon crescent ── */
#lb-space-stars .lb-moon {
  position: absolute;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: transparent;
  box-shadow:
    6px -2px 0 0 #D4D4D8,
    6px -2px 10px 2px rgba(212,212,216,0.2),
    -1px 1px 10px 2px rgba(99,102,241,0.06);
  will-change: opacity;
  animation: lb-moon-glow 8s 0s infinite ease-in-out;
}

/* ── Constellation lines ── */
#lb-space-stars .lb-constellation {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  will-change: opacity;
  animation: lb-constellation 12s 0s infinite ease-in-out;
  pointer-events: none;
}

/* ── Keyframes ── */
@keyframes lb-twinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}
  25% { opacity: 0.55; transform: scale(1.05); }
  50% { opacity: 1; transform: scale(1.3); }
  75% { opacity: 0.55; transform: scale(1.05); }
}
@keyframes lb-supernova {
  0%, 92% { box-shadow: 0 0 12px 3px rgba(255,255,255,0.5); }
  95% { box-shadow: 0 0 50px 20px rgba(255,255,255,0.95), 0 0 100px 40px rgba(99,102,241,0.4); }
  97% { box-shadow: 0 0 30px 12px rgba(255,255,255,0.6), 0 0 60px 25px rgba(99,102,241,0.2); }
  100% { box-shadow: 0 0 12px 3px rgba(255,255,255,0.5); }
}
@keyframes lb-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1.5deg); }
  75% { transform: translateY(6px) rotate(-1deg); }
}
@keyframes lb-breathe {
  0%, 100% { transform: scale(1) translate(0,0); opacity: 0.4; }
  25% { transform: scale(1.08) translate(2%,-1%); opacity: 0.65; }
  50% { transform: scale(1.02) translate(-1%,2%); opacity: 0.5; }
  75% { transform: scale(0.95) translate(1%,1%); opacity: 0.55; }
}
@keyframes lb-aurora {
  0% { transform: translate(0,0) scale(1); opacity: 0; }
  20% { transform: translate(5%,-3%) scale(1.1); opacity: 0.7; }
  40% { transform: translate(-3%,5%) scale(1.05); opacity: 0.5; }
  60% { transform: translate(8%,2%) scale(1.15); opacity: 0.8; }
  80% { transform: translate(-2%,-5%) scale(0.95); opacity: 0.4; }
  100% { transform: translate(0,0) scale(1); opacity: 0; }
}
@keyframes lb-shoot-a {
  0% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
  11% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
  11.3% { transform: translate(0,0) rotate(-28deg); opacity: 1; }
  14% { transform: translate(-380px,200px) rotate(-28deg); opacity: 1; }
  14.5% { transform: translate(-380px,200px) rotate(-28deg); opacity: 0; }
  15% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
  69% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
  69.3% { transform: translate(0,0) rotate(-28deg); opacity: 1; }
  72% { transform: translate(-380px,200px) rotate(-28deg); opacity: 1; }
  72.5% { transform: translate(-380px,200px) rotate(-28deg); opacity: 0; }
  73% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
  100% { transform: translate(0,0) rotate(-28deg); opacity: 0; }
}
@keyframes lb-shoot-b {
  0% { transform: translate(0,0) rotate(-22deg); opacity: 0; }
  70% { transform: translate(0,0) rotate(-22deg); opacity: 0; }
  70.3% { transform: translate(0,0) rotate(-22deg); opacity: 0.85; }
  73% { transform: translate(-310px,125px) rotate(-22deg); opacity: 0.85; }
  73.5% { transform: translate(-310px,125px) rotate(-22deg); opacity: 0; }
  74% { transform: translate(0,0) rotate(-22deg); opacity: 0; }
  100% { transform: translate(0,0) rotate(-22deg); opacity: 0; }
}
@keyframes lb-shoot-c {
  0% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
  41% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
  41.3% { transform: translate(0,0) rotate(-40deg); opacity: 0.7; }
  44% { transform: translate(-250px,210px) rotate(-40deg); opacity: 0.7; }
  44.5% { transform: translate(-250px,210px) rotate(-40deg); opacity: 0; }
  45% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
  71% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
  71.3% { transform: translate(0,0) rotate(-40deg); opacity: 0.7; }
  74% { transform: translate(-250px,210px) rotate(-40deg); opacity: 0.7; }
  74.5% { transform: translate(-250px,210px) rotate(-40deg); opacity: 0; }
  75% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
  100% { transform: translate(0,0) rotate(-40deg); opacity: 0; }
}
@keyframes lb-comet {
  0% { transform: translate(0,0); opacity: 0; }
  2% { transform: translate(10px,2px); opacity: 0.9; }
  8% { transform: translate(100px,20px); opacity: 0.9; }
  15% { transform: translate(250px,55px); opacity: 0.8; }
  20% { transform: translate(350px,70px); opacity: 0.4; }
  23% { transform: translate(400px,78px); opacity: 0; }
  24% { transform: translate(0,0); opacity: 0; }
  100% { transform: translate(0,0); opacity: 0; }
}
@keyframes lb-satellite {
  0% { transform: translate(0,0) rotate(0deg); opacity: 0; }
  0.5% { transform: translate(14px,-3px) rotate(6deg); opacity: 0.75; }
  2% { transform: translate(56px,2px) rotate(-8deg); opacity: 0.75; }
  3.5% { transform: translate(98px,-4px) rotate(7deg); opacity: 0.75; }
  5% { transform: translate(141px,1px) rotate(-7deg); opacity: 0.75; }
  6.5% { transform: translate(183px,-3px) rotate(8deg); opacity: 0.75; }
  8% { transform: translate(225px,2px) rotate(-6deg); opacity: 0.75; }
  9.5% { transform: translate(267px,-4px) rotate(7deg); opacity: 0.75; }
  11% { transform: translate(310px,1px) rotate(-8deg); opacity: 0.75; }
  12.5% { transform: translate(352px,-3px) rotate(6deg); opacity: 0.75; }
  14% { transform: translate(394px,2px) rotate(-7deg); opacity: 0.75; }
  15% { transform: translate(422px,-1px) rotate(4deg); opacity: 0.75; }
  16% { transform: translate(450px,0px) rotate(0deg); opacity: 0; }
  17% { transform: translate(0,0) rotate(0deg); opacity: 0; }
  100% { transform: translate(0,0) rotate(0deg); opacity: 0; }
}
@keyframes lb-moon-glow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
@keyframes lb-constellation {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
@media (prefers-reduced-motion: reduce) {
  #lb-space-stars * { animation: none !important; }
  #lb-space-stars .lb-star { opacity: 0.6; transform: none; }
  #lb-space-stars .lb-shoot,
  #lb-space-stars .lb-comet,
  #lb-space-stars .lb-satellite { display: none; }
}
`,
  html: `<div id="lb-space-stars">
  <!-- Stars (14) — varied sizes, colors, glow intensities -->
  <div class="lb-star lb-s1" style="top:3%;left:10%;width:4px;height:4px;background:#fff;box-shadow:0 0 8px 2px rgba(255,255,255,0.6)"></div>
  <div class="lb-star lb-s2" style="top:7%;left:58%;width:3px;height:3px;background:#FDE68A;box-shadow:0 0 10px 3px rgba(253,230,138,0.5)"></div>
  <div class="lb-star lb-s3" style="top:5%;left:85%;width:2px;height:2px;background:#E0E7FF;box-shadow:0 0 6px 2px rgba(224,231,255,0.4)"></div>
  <div class="lb-star lb-s4" style="top:14%;left:32%;width:5px;height:5px;background:#fff;box-shadow:0 0 12px 3px rgba(255,255,255,0.5)"></div>
  <div class="lb-star lb-s5" style="top:20%;left:72%;width:2px;height:2px;background:#C4B5FD;box-shadow:0 0 7px 2px rgba(196,181,253,0.5)"></div>
  <div class="lb-star lb-s6" style="top:28%;left:6%;width:3px;height:3px;background:#E0E7FF;box-shadow:0 0 8px 2px rgba(224,231,255,0.4)"></div>
  <div class="lb-star lb-s7" style="top:35%;left:90%;width:3px;height:3px;background:#fff;box-shadow:0 0 7px 2px rgba(255,255,255,0.5)"></div>
  <div class="lb-star lb-s8" style="top:44%;left:45%;width:2px;height:2px;background:#FDE68A;box-shadow:0 0 6px 2px rgba(253,230,138,0.4)"></div>
  <div class="lb-star lb-s9" style="top:52%;left:15%;width:4px;height:4px;background:#C4B5FD;box-shadow:0 0 10px 3px rgba(196,181,253,0.4)"></div>
  <div class="lb-star lb-s10" style="top:60%;left:78%;width:2px;height:2px;background:#fff;box-shadow:0 0 5px 1px rgba(255,255,255,0.4)"></div>
  <div class="lb-star lb-s11" style="top:70%;left:40%;width:3px;height:3px;background:#E0E7FF;box-shadow:0 0 8px 2px rgba(224,231,255,0.5)"></div>
  <div class="lb-star lb-s12" style="top:78%;left:62%;width:2px;height:2px;background:#FDE68A;box-shadow:0 0 6px 2px rgba(253,230,138,0.3)"></div>
  <div class="lb-star lb-s13" style="top:86%;left:22%;width:3px;height:3px;background:#fff;box-shadow:0 0 9px 3px rgba(255,255,255,0.5)"></div>
  <div class="lb-star lb-s14" style="top:93%;left:50%;width:2px;height:2px;background:#C4B5FD;box-shadow:0 0 6px 2px rgba(196,181,253,0.4)"></div>

  <!-- Planets (2) — p1 has Saturn ring via ::before -->
  <div class="lb-planet lb-p1" style="bottom:10%;right:8%;width:50px;height:50px;background:linear-gradient(135deg,#818CF8 0%,#4338CA 60%,#312E81 100%);box-shadow:0 0 25px 5px rgba(99,102,241,0.25),inset -8px -4px 12px rgba(0,0,0,0.4)"></div>
  <div class="lb-planet lb-p2" style="top:18%;left:4%;width:30px;height:30px;background:linear-gradient(135deg,#FB7185 0%,#9D174D 60%,#4C0519 100%);box-shadow:0 0 18px 4px rgba(251,113,133,0.15),inset -5px -3px 8px rgba(0,0,0,0.4)"></div>

  <!-- Nebula glows (2) — large ambient color washes -->
  <div class="lb-nebula lb-n1" style="top:10%;right:-15%;width:280px;height:280px;background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,rgba(99,102,241,0.04) 40%,transparent 70%)"></div>
  <div class="lb-nebula lb-n2" style="bottom:15%;left:-12%;width:240px;height:240px;background:radial-gradient(circle,rgba(168,85,247,0.08) 0%,rgba(139,92,246,0.03) 45%,transparent 70%)"></div>

  <!-- Aurora wash (1) — slow sweeping gradient drift -->
  <div class="lb-aurora"></div>

  <!-- Shooting stars (3) — solo streaks + meteor shower cluster at ~70% -->
  <div class="lb-shoot lb-sh1" style="top:8%;right:5%"></div>
  <div class="lb-shoot lb-sh2" style="top:12%;right:10%"></div>
  <div class="lb-shoot lb-sh3" style="top:6%;right:15%"></div>

  <!-- Satellite (1) — image with wobbly tumble crossing the screen -->
  <img class="lb-satellite" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAArBAMAAAA6dJN0AAAAMFBMVEVMaXEGu/0Gm/caXa0JHXkuRb2OnO5bcuESpt2+zPkTOJHt8/9CvvwVgsB12P4O2v+d2eTvAAAAD3RSTlMA/v6eKvz5/Pf+Xf7+zP62Dw5hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABwUlEQVR42tWUvUsDQRDFF6IoAYvZRpHIMVsEBEHFgJaBgEjAziViJWjuiHbCJV6hEMlfoBKISaGchRZpA8dJIJ3hwA+0sJM0IihCTCOinps299XYuO3+eDP75u0Q8gen7zgACI0FEEPwEfMHaAAxyMCfWJCASn7EGdoUYMSbOGFoA6C3xjRStN+xfBnzMGUaQWhY5sTHPSEDNSfwyEBo/NQRvgmZN5wSi3sModLtQwAhJU6S8R6iusesixba7Y4Alkhy86BXo5qP7oPoVAD9U/OyYTrKJPIM2ojfp+R8LZM1tFXiRgAMb9+VayXZ4OvEjUAY3n3K1oycmT50sSvRYJPNnFwqZpRy6cgtNso1a2aLRVlTNfM55gbI11pO4Vpa3np1G11IUVPZNOeZ7R2gdNJJhMWlovIVXV8GMTpnQPpyKa6m+JKwTVgGL5ajj1nOuarddEMMaJtXjhiGVM71snBgEIA2fgAivRr6zHFY2xAZZZGKgfbXW73jfKw+JUrko5WKqPLW6nhksNodzHhLan96pVQMJmLVmeQJdAmrATDq/VcStwzRDyDhB4pSgQQQBf+9MkcLAZtn7iZoN8XJPzm/0tedu3NcY7oAAAAASUVORK5CYII=" style="top:55%;left:-8%" alt="" width="44" height="44" />

  <!-- Moon crescent (1) — with earthshine glow -->
  <div class="lb-moon" style="bottom:28%;right:18%"></div>

  <!-- Constellation lines (1) — faint connecting lines between stars -->
  <svg class="lb-constellation" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="10,3 32,14 6,28 10,3" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="0.2"/>
    <polyline points="15,52 40,70 22,86 15,52" fill="none" stroke="rgba(148,163,184,0.09)" stroke-width="0.2"/>
    <line x1="58" y1="7" x2="72" y2="20" stroke="rgba(148,163,184,0.08)" stroke-width="0.15"/>
    <line x1="78" y1="60" x2="62" y2="78" stroke="rgba(148,163,184,0.08)" stroke-width="0.15"/>
  </svg>
</div>
`,
};
