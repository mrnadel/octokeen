/**
 * FX Registry — callable screen effects for celebrations, modals, and transitions.
 *
 * Usage in React:
 *   import { ScreenFX } from '@/components/ui/ScreenFX';
 *   <ScreenFX effect="confetti" />
 *   <ScreenFX effect="supernova" />
 *   <ScreenFX effect="xp-explosion" />
 *
 * Each effect is a pure function that generates DOM particles inside a container.
 * No dependencies — works with raw DOM for maximum performance.
 */

// ── Helpers ──
function R(min: number, max: number) { return min + Math.random() * (max - min); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

let _uid = 0;
function uid() { return 'fx' + (++_uid); }

function injectKF(name: string, css: string) {
  const s = document.createElement('style');
  s.textContent = `@keyframes ${name}{${css}}`;
  document.head.appendChild(s);
  return name;
}

function makeParticle(el: HTMLElement, style: Record<string, string>, animName: string, animDur: number, animDelay: number, fill = 'forwards') {
  const p = document.createElement('div');
  Object.assign(p.style, {
    position: 'absolute',
    ...style,
    animation: `${animName} ${animDur}s ${animDelay}s ${fill === 'forwards' ? 'ease-out forwards' : 'infinite ease-in-out'}`,
  });
  el.appendChild(p);
  return p;
}

// ── Effect type ──
export interface FXDefinition {
  /** Unique name used to call this effect */
  name: string;
  /** Display label for gallery */
  label: string;
  /** Category for grouping */
  category: 'celebration' | 'ambient' | 'center-burst' | 'weather' | 'dramatic';
  /** Background color/gradient suggestion */
  bg: string;
  /** Whether this is a one-shot or looping effect */
  loop: boolean;
  /** Generator: injects particles into container element */
  generate: (container: HTMLElement) => void;
}

// ── Effect definitions ──
export const fxRegistry: FXDefinition[] = [

  // ═══════════════════════
  // CELEBRATION
  // ═══════════════════════

  {
    name: 'confetti',
    label: 'Confetti Rain',
    category: 'celebration',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      const colors = ['#FF4B4B','#FFC800','#58CC02','#1CB0F6','#CE82FF','#FF9600','#FFAADE'];
      for (let i = 0; i < 45; i++) {
        const id = uid(), w = R(4,10), h = R(3,8), dur = R(2,5.5), dl = R(0,6), drift = R(-40,40), spin = R(360,1440);
        injectKF(id, `0%{opacity:1;transform:translateY(-20px) translateX(0) rotate(0deg)}50%{transform:translateY(240px) translateX(${drift*.6}px) rotate(${spin*.5}deg)}100%{opacity:.3;transform:translateY(500px) translateX(${drift}px) rotate(${spin}deg)}`);
        makeParticle(el, { width:w+'px', height:h+'px', left:R(-5,105)+'%', top:'-3%', background:pick(colors), borderRadius:Math.random()>.5?'50%':'2px' }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'stars',
    label: 'Gold Star Burst',
    category: 'celebration',
    bg: 'linear-gradient(180deg,#1a1a2e,#2d1b4e)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 18; i++) {
        const id = uid(), x = R(5,90), y = R(5,85), sz = R(10,26), dur = R(1.5,4), dl = R(0,6), drift = R(-20,20);
        injectKF(id, `0%{opacity:0;transform:scale(0) rotate(0deg)}${R(15,25)}%{opacity:1;transform:scale(${R(1,1.4)}) rotate(${R(20,60)}deg)}${R(50,70)}%{opacity:${R(.5,.9)};transform:scale(${R(.7,1)}) rotate(${R(40,90)}deg) translateY(${drift}px)}100%{opacity:0;transform:scale(${R(.2,.5)}) rotate(${R(60,120)}deg) translateY(${drift*2}px)}`);
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;left:${x}%;top:${y}%;animation:${id} ${dur}s ${dl}s infinite ease-out;`;
        s.innerHTML = `<span style="font-size:${sz}px;color:${pick(['#FFC800','#FFB100','#FBE56D','#FF9600'])}">★</span>`;
        el.appendChild(s);
      }
    },
  },

  {
    name: 'hearts',
    label: 'Floating Hearts',
    category: 'celebration',
    bg: 'linear-gradient(180deg,#2d1020,#1a1a2e)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 16; i++) {
        const id = uid(), x = R(0,95), sz = R(12,28), dur = R(3,8), dl = R(0,8), driftX = R(-50,50), riseY = R(200,400);
        injectKF(id, `0%{opacity:0;transform:translateY(0) translateX(0) scale(${R(.2,.5)}) rotate(${R(-20,20)}deg)}${R(10,20)}%{opacity:${R(.7,1)}}50%{transform:translateY(-${riseY*.5}px) translateX(${driftX*.7}px) scale(${R(.8,1.1)}) rotate(${R(-10,10)}deg)}100%{opacity:0;transform:translateY(-${riseY}px) translateX(${driftX}px) scale(${R(.3,.7)}) rotate(${R(-30,30)}deg)}`);
        const h = document.createElement('div');
        h.style.cssText = `position:absolute;left:${x}%;bottom:${R(-5,15)}%;animation:${id} ${dur}s ${dl}s infinite ease-in-out;font-size:${sz}px;color:${pick(['#FF4B4B','#FF7878','#FFAADE','#FFB2B2'])};`;
        h.textContent = '♥';
        el.appendChild(h);
      }
    },
  },

  {
    name: 'emoji-party',
    label: 'Emoji Party',
    category: 'celebration',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      const emojis = ['🎉','🎊','⭐','🔥','💪','🏆','💎','⚡','🚀','✨','🎯','🌟'];
      for (let i = 0; i < 18; i++) {
        const id = uid(), x = R(2,95), sz = R(14,30), dur = R(3.5,9), dl = R(0,10), driftX = R(-60,60), riseY = R(250,500);
        injectKF(id, `0%{opacity:0;transform:translateY(0) translateX(0) scale(${R(.3,.6)}) rotate(${R(-30,30)}deg)}${R(8,18)}%{opacity:1}50%{transform:translateY(-${riseY*.5}px) translateX(${driftX*.6}px) scale(${R(.8,1.1)}) rotate(${R(-15,15)}deg)}80%{opacity:${R(.4,.8)}}100%{opacity:0;transform:translateY(-${riseY}px) translateX(${driftX}px) scale(${R(.4,.8)}) rotate(${R(-40,40)}deg)}`);
        const e = document.createElement('div');
        e.style.cssText = `position:absolute;left:${x}%;bottom:${R(-10,20)}%;font-size:${sz}px;animation:${id} ${dur}s ${dl}s infinite ease-in-out;`;
        e.textContent = pick(emojis);
        el.appendChild(e);
      }
    },
  },

  {
    name: 'fireworks',
    label: 'Firework Burst',
    category: 'celebration',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      const colors = ['#FF4B4B','#FFC800','#58CC02','#1CB0F6','#CE82FF','#FF9600'];
      for (let burst = 0; burst < 4; burst++) {
        const cx = R(15,85), cy = R(15,75), burstDl = burst * R(1,2.5);
        for (let i = 0; i < 14; i++) {
          const id = uid(), angle = ((i+R(-.3,.3))/14)*Math.PI*2, dist = R(30,80), dur = R(1.5,3), dl = burstDl+R(0,.3);
          injectKF(id, `0%{opacity:0;transform:translate(0,0) scale(0)}8%{opacity:1;transform:scale(${R(.8,1.3)})}100%{opacity:0;transform:translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(${R(.1,.4)})}`);
          makeParticle(el, { width:R(3,6)+'px', height:R(3,6)+'px', borderRadius:'50%', left:cx+'%', top:cy+'%', background:pick(colors) }, id, dur, dl, 'infinite');
        }
      }
    },
  },

  {
    name: 'golden-rain',
    label: 'Golden Rain + Coins',
    category: 'celebration',
    bg: 'linear-gradient(180deg,#1a1020,#0a0a0a)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 30; i++) {
        const id = uid(), x = R(-5,105), sz = R(2,5), dur = R(3,8), dl = R(0,10), driftX = R(-30,30), fall = R(400,600);
        injectKF(id, `0%{opacity:0;transform:translateY(-10px)}${R(8,15)}%{opacity:${R(.4,.8)}}100%{opacity:0;transform:translateY(${fall}px) translateX(${driftX}px)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:x+'%', top:'-3%', background:`rgba(255,200,0,${R(.3,.7)})` }, id, dur, dl, 'infinite');
      }
      for (let i = 0; i < 12; i++) {
        const id = uid(), x = R(5,90), sz = R(16,28), dur = R(3.5,8), dl = R(0,12), spin = R(180,720), driftX = R(-40,40), fall = R(400,600);
        injectKF(id, `0%{opacity:0;transform:translateY(-30px) rotate(0)}${R(8,15)}%{opacity:1}100%{opacity:0;transform:translateY(${fall}px) translateX(${driftX}px) rotate(${spin}deg)}`);
        const c = document.createElement('div');
        c.style.cssText = `position:absolute;left:${x}%;top:-5%;font-size:${sz}px;animation:${id} ${dur}s ${dl}s infinite linear;`;
        c.textContent = pick(['🪙','💰','✨','💎','⭐']);
        el.appendChild(c);
      }
    },
  },

  // ═══════════════════════
  // AMBIENT
  // ═══════════════════════

  {
    name: 'bubbles',
    label: 'Rising Bubbles',
    category: 'ambient',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      for (let i = 0; i < 25; i++) {
        const id = uid(), s = R(4,18), x = R(0,100), drift = R(-30,30), dur = R(5,12), dl = R(0,10);
        injectKF(id, `0%{opacity:0;transform:translateY(0) translateX(0) scale(${R(.4,.7)})}12%{opacity:${R(.3,.7)}}50%{transform:translateY(-50%) translateX(${drift}px)}88%{opacity:${R(.1,.4)}}100%{opacity:0;transform:translateY(-110%) translateX(${drift*R(.5,2)}px) scale(${R(.8,1.3)})}`);
        makeParticle(el, { width:s+'px', height:s+'px', borderRadius:'50%', left:x+'%', bottom:R(-5,15)+'%', background:`rgba(255,255,255,${R(.06,.2)})` }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'sparkle-dust',
    label: 'Sparkle Dust',
    category: 'ambient',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      for (let i = 0; i < 35; i++) {
        const id = uid(), sz = R(2,6), x = R(0,100), y = R(0,100), dur = R(1,3.5), dl = R(0,5), dx = R(-25,25), dy = R(-25,25);
        injectKF(id, `0%{opacity:0;transform:scale(0) translate(0,0)}${R(20,40)}%{opacity:${R(.6,1)};transform:scale(${R(.8,1.3)})}100%{opacity:0;transform:scale(0) translate(${dx}px,${dy}px)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:x+'%', top:y+'%', background:pick(['white','#FFC800','#84D8FF','#FFAADE','#58CC02']) }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'bokeh',
    label: 'Bokeh Lights',
    category: 'ambient',
    bg: 'linear-gradient(135deg,#1a1030,#0a1520)',
    loop: true,
    generate(el) {
      const colors = ['rgba(255,200,0,0.12)','rgba(206,130,255,0.1)','rgba(28,176,246,0.1)','rgba(255,150,0,0.1)','rgba(88,204,2,0.08)'];
      for (let i = 0; i < 12; i++) {
        const id = uid(), sz = R(30,100), x = R(-10,100), y = R(-10,100), dur = R(7,16), dl = R(0,8), dx1 = R(-40,40), dy1 = R(-40,40), dx2 = R(-30,30), dy2 = R(-30,30);
        injectKF(id, `0%{transform:translate(0,0);opacity:${R(.05,.2)}}33%{transform:translate(${dx1}px,${dy1}px);opacity:${R(.15,.35)}}66%{transform:translate(${dx2}px,${dy2}px);opacity:${R(.08,.2)}}100%{transform:translate(0,0);opacity:${R(.05,.2)}}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:x+'%', top:y+'%', background:pick(colors) }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'swirl-orbs',
    label: 'Swirl Orbs',
    category: 'ambient',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      const colors = ['rgba(99,102,241,0.25)','rgba(206,130,255,0.2)','rgba(255,170,222,0.18)','rgba(28,176,246,0.2)','rgba(255,200,0,0.15)'];
      for (let i = 0; i < 10; i++) {
        const id = uid(), sz = R(25,70), x = R(5,90), y = R(5,90), dur = R(6,14), dl = R(0,6);
        const p1x = R(-60,60), p1y = R(-80,0), p2x = R(-50,50), p2y = R(-60,40), p3x = R(-40,40), p3y = R(-30,30);
        injectKF(id, `0%{transform:translate(0,0) scale(${R(.7,1)});opacity:${R(.2,.5)}}25%{transform:translate(${p1x}px,${p1y}px) scale(${R(.8,1.2)});opacity:${R(.3,.7)}}50%{transform:translate(${p2x}px,${p2y}px) scale(${R(.6,1.1)});opacity:${R(.2,.5)}}75%{transform:translate(${p3x}px,${p3y}px) scale(${R(.8,1.1)});opacity:${R(.3,.6)}}100%{transform:translate(0,0) scale(${R(.7,1)});opacity:${R(.2,.5)}}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:x+'%', top:y+'%', background:pick(colors), filter:`blur(${R(1,4)}px)` }, id, dur, dl, 'infinite');
      }
    },
  },

  // ═══════════════════════
  // CENTER-BURST (behind character)
  // ═══════════════════════

  {
    name: 'supernova',
    label: 'Center Supernova',
    category: 'center-burst',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      for (let i = 0; i < 12; i++) {
        const id = uid(), dur = R(1.5,4), dl = R(0,6), maxScale = R(3,8), sz = R(20,60);
        injectKF(id, `0%{opacity:${R(.5,.9)};transform:scale(0)}40%{opacity:${R(.3,.6)}}100%{opacity:0;transform:scale(${maxScale})}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:`calc(50% - ${sz/2}px)`, top:`calc(42% - ${sz/2}px)`, border:`${R(1,3)}px solid ${pick(['rgba(255,200,0,0.5)','rgba(255,75,75,0.4)','rgba(206,130,255,0.4)','rgba(88,204,2,0.4)'])}` }, id, dur, dl, 'infinite');
      }
      for (let i = 0; i < 30; i++) {
        const id = uid(), angle = R(0,Math.PI*2), dist = R(80,220), dur = R(1.5,4), dl = R(0,7), sz = R(2,6);
        injectKF(id, `0%{opacity:0;transform:translate(0,0) scale(0)}15%{opacity:${R(.6,1)};transform:scale(${R(.8,1.5)})}100%{opacity:0;transform:translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(${R(.1,.5)})}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:'50%', top:'42%', background:pick(['#FFC800','#FF4B4B','#58CC02','#1CB0F6','#CE82FF','white']) }, id, dur, dl, 'infinite');
      }
      // Center glow
      const gid = uid();
      injectKF(gid, `0%{opacity:.3;transform:scale(.8)}50%{opacity:.6;transform:scale(1.2)}100%{opacity:.3;transform:scale(.8)}`);
      makeParticle(el, { width:'120px', height:'120px', borderRadius:'50%', left:'calc(50% - 60px)', top:'calc(42% - 60px)', background:'radial-gradient(circle,rgba(255,200,0,0.3),transparent)' }, gid, 3, 0, 'infinite');
    },
  },

  {
    name: 'shockwave',
    label: 'Shockwave Blast',
    category: 'center-burst',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      for (let i = 0; i < 6; i++) {
        const id = uid(), dur = R(2,4), dl = i*R(.6,1.2), sz = R(30,50);
        injectKF(id, `0%{opacity:${R(.6,.9)};transform:scale(0);border-width:${R(3,6)}px}60%{opacity:${R(.2,.4)}}100%{opacity:0;transform:scale(${R(6,12)});border-width:1px}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:`calc(50% - ${sz/2}px)`, top:`calc(42% - ${sz/2}px)`, border:`3px solid ${pick(['rgba(99,102,241,0.6)','rgba(168,85,247,0.5)','rgba(255,200,0,0.5)'])}` }, id, dur, dl, 'infinite');
      }
      for (let i = 0; i < 20; i++) {
        const id = uid(), angle = R(0,Math.PI*2), dist = R(100,250), dur = R(1,3), dl = R(0,5), sz = R(3,8);
        injectKF(id, `0%{opacity:0;transform:translate(0,0) scale(0)}10%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) rotate(${R(180,720)}deg) scale(.2)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:Math.random()>.5?'50%':'2px', left:'50%', top:'42%', background:pick(['#FFC800','#FF9600','#FF4B4B','white','#84D8FF']) }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'power-up',
    label: 'Power Up Aura',
    category: 'center-burst',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      for (let i = 0; i < 8; i++) {
        const id = uid(), x = R(35,65), w = R(2,6), dur = R(.8,2.5), dl = R(0,5), h = R(100,300);
        injectKF(id, `0%{opacity:0;height:0;transform:translateY(0)}${R(10,25)}%{opacity:${R(.4,.8)};height:${h}px}100%{opacity:0;height:${h*1.5}px;transform:translateY(-${R(200,400)}px)}`);
        makeParticle(el, { width:w+'px', borderRadius:'2px', left:x+'%', top:'42%', background:`linear-gradient(to top,${pick(['rgba(99,102,241,0.6)','rgba(168,85,247,0.5)','rgba(255,200,0,0.5)','rgba(88,204,2,0.5)'])},transparent)` }, id, dur, dl, 'infinite');
      }
      for (let i = 0; i < 20; i++) {
        const id = uid(), angle = R(0,Math.PI*2), dist = R(50,180), dur = R(1.5,4), dl = R(0,6), sz = R(2,5), riseY = R(50,200);
        injectKF(id, `0%{opacity:0;transform:translate(0,0) scale(0)}15%{opacity:${R(.5,1)}}100%{opacity:0;transform:translate(${Math.cos(angle)*dist}px,${-riseY}px) scale(${R(.2,.5)})}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:'50%', top:'42%', background:pick(['#FFC800','#58CC02','#1CB0F6','white','#CE82FF']) }, id, dur, dl, 'infinite');
      }
      const gid = uid();
      injectKF(gid, `0%{opacity:.2;transform:scale(.6)}50%{opacity:.5;transform:scale(1.3)}100%{opacity:.2;transform:scale(.6)}`);
      makeParticle(el, { width:'160px', height:'160px', borderRadius:'50%', left:'calc(50% - 80px)', top:'calc(42% - 80px)', background:'radial-gradient(circle,rgba(99,102,241,0.3),rgba(168,85,247,0.15),transparent)' }, gid, R(2,4), 0, 'infinite');
    },
  },

  {
    name: 'xp-explosion',
    label: 'XP Explosion',
    category: 'center-burst',
    bg: '#1a1a2e',
    loop: true,
    generate(el) {
      for (let i = 0; i < 15; i++) {
        const id = uid(), angle = R(0,Math.PI*2), dist = R(80,200), dur = R(1.5,4), dl = R(0,7), sz = R(10,16);
        const xp = pick(['+5','+10','+15','+20','+25','+50','+XP','★']);
        injectKF(id, `0%{opacity:0;transform:translate(0,0) scale(0)}12%{opacity:1;transform:scale(${R(1,1.4)})}100%{opacity:0;transform:translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(${R(.4,.8)})}`);
        const t = document.createElement('div');
        t.style.cssText = `position:absolute;left:50%;top:42%;font-size:${sz}px;font-weight:900;color:${pick(['#FFC800','#FFB100','#58CC02','white','#84D8FF'])};animation:${id} ${dur}s ${dl}s infinite ease-out;white-space:nowrap;font-family:system-ui,sans-serif;`;
        t.textContent = xp;
        el.appendChild(t);
      }
      for (let i = 0; i < 4; i++) {
        const id = uid(), sz = R(30,50), dur = R(2,4), dl = R(0,5);
        injectKF(id, `0%{opacity:.7;transform:scale(0)}100%{opacity:0;transform:scale(${R(4,8)})}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:`calc(50% - ${sz/2}px)`, top:`calc(42% - ${sz/2}px)`, border:`2px solid rgba(255,200,0,${R(.3,.6)})` }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'level-up-rays',
    label: 'Level Up Rays',
    category: 'center-burst',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      const wrap = document.createElement('div');
      const wid = uid();
      injectKF(wid, `0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`);
      Object.assign(wrap.style, { position:'absolute', left:'0', top:'0', width:'100%', height:'100%', animation:`${wid} 25s 0s infinite linear` });
      for (let i = 0; i < 14; i++) {
        const angle = (i/14)*360+R(-5,5), w = R(3,8), h = R(100,200);
        const id = uid(), minO = R(.05,.15), maxO = R(.25,.55);
        injectKF(id, `0%{opacity:${minO}}50%{opacity:${maxO}}100%{opacity:${minO}}`);
        const ray = document.createElement('div');
        Object.assign(ray.style, { position:'absolute', width:w+'px', height:h+'px', left:'50%', top:'42%', transformOrigin:`${w/2}px 0`, transform:`rotate(${angle}deg) translateX(-${w/2}px)`, background:`linear-gradient(to bottom,${pick(['rgba(255,200,0,0.5)','rgba(255,180,0,0.4)','rgba(255,255,255,0.25)'])},transparent)`, borderRadius:'3px', animation:`${id} ${R(2,5)}s ${R(0,3)}s infinite ease-in-out` });
        wrap.appendChild(ray);
      }
      el.appendChild(wrap);
      const cid = uid();
      injectKF(cid, `0%{opacity:.15;transform:scale(.7)}50%{opacity:.5;transform:scale(1.2)}100%{opacity:.15;transform:scale(.7)}`);
      makeParticle(el, { width:'90px', height:'90px', borderRadius:'50%', left:'calc(50% - 45px)', top:'calc(42% - 45px)', background:'radial-gradient(circle,rgba(255,200,0,0.45),rgba(255,150,0,0.15),transparent)', zIndex:'2' }, cid, 2.5, 0, 'infinite');
    },
  },

  {
    name: 'portal',
    label: 'Portal Warp',
    category: 'center-burst',
    bg: '#050510',
    loop: true,
    generate(el) {
      for (let i = 0; i < 6; i++) {
        const sz = 40+i*30, dur = R(3,8);
        const id = uid();
        injectKF(id, `0%{transform:rotate(0deg)}100%{transform:rotate(${i%2===0?360:-360}deg)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:`calc(50% - ${sz/2}px)`, top:`calc(42% - ${sz/2}px)`, border:`${R(1,2.5)}px solid transparent`, borderTopColor:pick(['rgba(168,85,247,0.5)','rgba(99,102,241,0.4)','rgba(206,130,255,0.5)']), borderRightColor:pick(['rgba(168,85,247,0.3)','rgba(99,102,241,0.2)']), opacity:String(R(.4,.8)) }, id, dur, R(0,3), 'infinite');
      }
      for (let i = 0; i < 20; i++) {
        const id = uid(), startAngle = R(0,Math.PI*2), startDist = R(150,250), sz = R(1.5,4), dur = R(2,5), dl = R(0,8);
        injectKF(id, `0%{opacity:0;transform:translate(${Math.cos(startAngle)*startDist}px,${Math.sin(startAngle)*startDist}px) scale(1)}20%{opacity:${R(.5,.9)}}100%{opacity:0;transform:translate(0,0) scale(0)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:'50%', top:'42%', background:pick(['#CE82FF','#84D8FF','white','#FFAADE']) }, id, dur, dl, 'infinite');
      }
    },
  },

  // ═══════════════════════
  // WEATHER
  // ═══════════════════════

  {
    name: 'snow',
    label: 'Gentle Snow',
    category: 'weather',
    bg: 'linear-gradient(180deg,#1a2a3a,#0a1520)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 35; i++) {
        const id = uid(), sz = R(2,5), x = R(-5,105), dur = R(4,10), dl = R(0,10), driftX = R(-40,40), driftMid = R(-20,20);
        injectKF(id, `0%{opacity:${R(.5,.9)};transform:translateY(-10px) translateX(0)}33%{transform:translateY(33%) translateX(${driftMid}px)}66%{transform:translateY(66%) translateX(${driftX}px)}100%{opacity:0;transform:translateY(110%) translateX(${driftMid}px)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:x+'%', top:'-3%', background:'white' }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'rain',
    label: 'Diagonal Rain',
    category: 'weather',
    bg: 'linear-gradient(180deg,#102030,#0a1018)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 25; i++) {
        const id = uid(), x = R(-15,110), h = R(12,30), dur = R(.8,2.5), dl = R(0,5), angle = R(15,30);
        injectKF(id, `0%{opacity:0;transform:rotate(${angle}deg) translate(-40px,-30px)}${R(15,30)}%{opacity:${R(.3,.7)}}100%{opacity:0;transform:rotate(${angle}deg) translate(${R(60,120)}px,${R(400,600)}px)}`);
        makeParticle(el, { width:R(1,3)+'px', height:h+'px', borderRadius:'1px', left:x+'%', top:'-5%', background:`rgba(130,216,255,${R(.15,.4)})` }, id, dur, dl, 'infinite');
      }
    },
  },

  // ═══════════════════════
  // DRAMATIC
  // ═══════════════════════

  {
    name: 'lightning',
    label: 'Lightning Flash',
    category: 'dramatic',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      for (let i = 0; i < 4; i++) {
        const id = uid(), dur = R(3,7), dl = R(0,5), t1 = R(2,5), t2 = t1+R(1,3), t3 = t2+R(1,2);
        injectKF(id, `0%{opacity:0}${t1}%{opacity:${R(.4,.8)}}${t1+1}%{opacity:0}${t2}%{opacity:${R(.2,.5)}}${t2+0.8}%{opacity:0}${t3}%{opacity:${R(.1,.3)}}${t3+0.5}%{opacity:0}100%{opacity:0}`);
        makeParticle(el, { inset:'0', background:'white' }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'electric',
    label: 'Electric Field',
    category: 'dramatic',
    bg: '#0a0a1a',
    loop: true,
    generate(el) {
      for (let i = 0; i < 16; i++) {
        const id = uid(), angle = R(0,Math.PI*2), len = R(50,150), dur = R(2,6), dl = R(0,8);
        const deg = Math.atan2(Math.sin(angle),Math.cos(angle))*180/Math.PI;
        const t1 = R(3,10), t2 = t1+R(1,3), t3 = t2+R(3,10), t4 = t3+R(1,2);
        injectKF(id, `0%{opacity:0}${t1}%{opacity:0}${t1+.5}%{opacity:${R(.5,.9)}}${t2}%{opacity:0}${t3}%{opacity:0}${t3+.3}%{opacity:${R(.3,.7)}}${t4}%{opacity:0}100%{opacity:0}`);
        makeParticle(el, { width:len+'px', height:R(1.5,3)+'px', left:'50%', top:'42%', background:pick(['rgba(130,216,255,0.9)','rgba(99,102,241,0.8)','rgba(255,200,0,0.7)','rgba(255,255,255,0.8)']), transformOrigin:'0 50%', transform:`rotate(${deg}deg)`, borderRadius:'1px', boxShadow:`0 0 ${R(6,14)}px ${R(2,5)}px ${pick(['rgba(130,216,255,0.5)','rgba(99,102,241,0.4)'])}` }, id, dur, dl, 'infinite');
      }
      const oid = uid();
      injectKF(oid, `0%{opacity:.3;transform:scale(.85)}20%{opacity:.7;transform:scale(1.15)}40%{opacity:.2;transform:scale(.9)}60%{opacity:.6;transform:scale(1.1)}80%{opacity:.25;transform:scale(.95)}100%{opacity:.3;transform:scale(.85)}`);
      makeParticle(el, { width:'60px', height:'60px', borderRadius:'50%', left:'calc(50% - 30px)', top:'calc(42% - 30px)', background:'radial-gradient(circle,rgba(130,216,255,0.5),rgba(99,102,241,0.2),transparent)' }, oid, 2, 0, 'infinite');
    },
  },

  {
    name: 'speed-streaks',
    label: 'Speed Streaks',
    category: 'dramatic',
    bg: 'linear-gradient(180deg,#1a1040,#0a0a1a)',
    loop: true,
    generate(el) {
      for (let i = 0; i < 16; i++) {
        const id = uid(), h = R(30,140), x = R(-5,105), dur = R(.5,1.5), dl = R(0,5);
        injectKF(id, `0%{opacity:0;transform:translateY(-${h}px)}${R(30,50)}%{opacity:${R(.4,.9)}}100%{opacity:0;transform:translateY(${R(400,600)}px)}`);
        makeParticle(el, { width:R(1,3)+'px', height:h+'px', borderRadius:'2px', left:x+'%', top:'-10%', background:`linear-gradient(to bottom,transparent,${pick(['rgba(99,102,241,0.5)','rgba(168,85,247,0.5)','rgba(255,200,0,0.4)','rgba(28,176,246,0.4)'])},transparent)` }, id, dur, dl, 'infinite');
      }
    },
  },

  {
    name: 'spiral-galaxy',
    label: 'Spiral Galaxy',
    category: 'dramatic',
    bg: '#050510',
    loop: true,
    generate(el) {
      for (let i = 0; i < 40; i++) {
        const id = uid(), orbitR = R(20,160), dur = R(4,12), dl = R(0,8), sz = R(1.5,4);
        const a1 = R(0,Math.PI*2), a2 = a1+R(1.5,4), a3 = a2+R(1.5,4), a4 = a3+R(1.5,4), expand = R(1,1.8);
        injectKF(id, `0%{opacity:${R(.3,.7)};transform:translate(${Math.cos(a1)*orbitR}px,${Math.sin(a1)*orbitR}px)}25%{opacity:${R(.5,.9)};transform:translate(${Math.cos(a2)*orbitR*expand*.8}px,${Math.sin(a2)*orbitR*expand*.8}px)}50%{opacity:${R(.3,.7)};transform:translate(${Math.cos(a3)*orbitR*expand}px,${Math.sin(a3)*orbitR*expand}px)}75%{opacity:${R(.5,.8)};transform:translate(${Math.cos(a4)*orbitR*expand*1.1}px,${Math.sin(a4)*orbitR*expand*1.1}px)}100%{opacity:${R(.3,.7)};transform:translate(${Math.cos(a1)*orbitR}px,${Math.sin(a1)*orbitR}px)}`);
        makeParticle(el, { width:sz+'px', height:sz+'px', borderRadius:'50%', left:'50%', top:'42%', background:pick(['white','#FFC800','#84D8FF','#CE82FF','#FFAADE']) }, id, dur, dl, 'infinite');
      }
    },
  },
];

// ── Public API ──
export function getFX(name: string): FXDefinition | undefined {
  return fxRegistry.find(fx => fx.name === name);
}

export function triggerFX(container: HTMLElement, name: string) {
  const fx = getFX(name);
  if (!fx) { console.warn(`FX "${name}" not found`); return; }
  container.innerHTML = '';
  fx.generate(container);
}

export function clearFX(container: HTMLElement) {
  container.innerHTML = '';
}

export const fxNames = fxRegistry.map(fx => fx.name);
export type FXName = typeof fxNames[number];
