/**
 * Space Stars — animated deep-space background for space/astronomy lessons.
 *
 * Element count: 14 stars + 2 planets + 2 nebula + 3 shooting stars + 1 comet = 22/30
 */
export const background = {
  name: 'Space Stars',
  category: 'Space',
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
  animation: lb-twinkle 4s infinite ease-in-out;
}
#lb-space-stars .lb-s1 { animation-duration: 3.2s; animation-delay: 0s; }
#lb-space-stars .lb-s2 { animation-duration: 4.5s; animation-delay: 0.8s; }
#lb-space-stars .lb-s3 { animation-duration: 3.7s; animation-delay: 1.5s; }
#lb-space-stars .lb-s4 { animation-duration: 5.1s; animation-delay: 0.3s; }
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

/* ── Nebula ── */
#lb-space-stars .lb-nebula {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}
#lb-space-stars .lb-n1 { animation: lb-breathe 20s 0s infinite ease-in-out; }
#lb-space-stars .lb-n2 { animation: lb-breathe 25s 6s infinite ease-in-out; }

/* ── Shooting stars ── */
#lb-space-stars .lb-shoot {
  position: absolute;
  height: 2px;
  border-radius: 2px;
  will-change: transform, opacity;
  opacity: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 40%, transparent 100%);
}
#lb-space-stars .lb-sh1 { width: 100px; animation: lb-shoot-a 9s 3s infinite linear; }
#lb-space-stars .lb-sh2 { width: 70px; animation: lb-shoot-b 13s 8s infinite linear; }
#lb-space-stars .lb-sh3 { width: 50px; animation: lb-shoot-c 11s 0s infinite linear; }

/* ── Comet ── */
#lb-space-stars .lb-comet {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E0E7FF;
  box-shadow: 0 0 12px 4px rgba(224,231,255,0.6), 0 0 30px 8px rgba(99,102,241,0.2);
  will-change: transform, opacity;
  opacity: 0;
  animation: lb-comet 20s 5s infinite ease-in-out;
}
#lb-space-stars .lb-comet::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  width: 60px;
  height: 2px;
  margin-top: -1px;
  background: linear-gradient(270deg, rgba(224,231,255,0.5), transparent);
  border-radius: 2px;
}

/* ── Keyframes ── */
@keyframes lb-twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.5); }
}
@keyframes lb-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1.5deg); }
  75% { transform: translateY(6px) rotate(-1deg); }
}
@keyframes lb-breathe {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  30% { transform: scale(1.08); opacity: 0.7; }
  70% { transform: scale(0.95); opacity: 0.5; }
}
@keyframes lb-shoot-a {
  0% { transform: translate(0, 0) rotate(-30deg); opacity: 0; }
  1% { opacity: 1; }
  5% { opacity: 1; }
  6% { transform: translate(400px, 230px) rotate(-30deg); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes lb-shoot-b {
  0% { transform: translate(0, 0) rotate(-22deg); opacity: 0; }
  0.8% { opacity: 0.8; }
  4% { opacity: 0.8; }
  4.5% { transform: translate(350px, 140px) rotate(-22deg); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes lb-shoot-c {
  0% { transform: translate(0, 0) rotate(-38deg); opacity: 0; }
  1.5% { opacity: 0.6; }
  5% { opacity: 0.6; }
  6% { transform: translate(280px, 220px) rotate(-38deg); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes lb-comet {
  0% { transform: translate(0, 0); opacity: 0; }
  3% { opacity: 0.9; }
  15% { transform: translate(250px, 80px); opacity: 0.9; }
  18% { transform: translate(320px, 100px); opacity: 0; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  #lb-space-stars * { animation: none !important; }
  #lb-space-stars .lb-star { opacity: 0.6; transform: none; }
  #lb-space-stars .lb-shoot, #lb-space-stars .lb-comet { display: none; }
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

  <!-- Planets (2) -->
  <div class="lb-planet lb-p1" style="bottom:10%;right:8%;width:50px;height:50px;background:linear-gradient(135deg,#818CF8 0%,#4338CA 60%,#312E81 100%);box-shadow:0 0 25px 5px rgba(99,102,241,0.25),inset -8px -4px 12px rgba(0,0,0,0.4)"></div>
  <div class="lb-planet lb-p2" style="top:18%;left:4%;width:30px;height:30px;background:linear-gradient(135deg,#FB7185 0%,#9D174D 60%,#4C0519 100%);box-shadow:0 0 18px 4px rgba(251,113,133,0.15),inset -5px -3px 8px rgba(0,0,0,0.4)"></div>

  <!-- Nebula glows (2) — large ambient color washes -->
  <div class="lb-nebula lb-n1" style="top:10%;right:-15%;width:280px;height:280px;background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,rgba(99,102,241,0.04) 40%,transparent 70%)"></div>
  <div class="lb-nebula lb-n2" style="bottom:15%;left:-12%;width:240px;height:240px;background:radial-gradient(circle,rgba(168,85,247,0.08) 0%,rgba(139,92,246,0.03) 45%,transparent 70%)"></div>

  <!-- Shooting stars (3) — fast diagonal streaks at long intervals -->
  <div class="lb-shoot lb-sh1" style="top:8%;left:2%"></div>
  <div class="lb-shoot lb-sh2" style="top:40%;left:10%"></div>
  <div class="lb-shoot lb-sh3" style="top:65%;left:30%"></div>

  <!-- Comet (1) — slow bright dot with trailing tail -->
  <div class="lb-comet" style="top:30%;left:5%"></div>
</div>
`,
};
