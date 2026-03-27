import re, random, math

with open("modal-gallery.html", "r", encoding="utf-8") as f:
    html = f.read()

# FX CSS to inject
fx_css = """
  /* FX library */
  .heart-fx{position:absolute;animation:hfx var(--d,4s) var(--dl,0s) infinite ease-in-out;color:var(--c,#FF7878);}
  @keyframes hfx{0%{opacity:0;transform:translateY(0) scale(.3)}15%{opacity:.8}50%{transform:translateY(-150px) translateX(var(--dx,15px)) scale(1)}100%{opacity:0;transform:translateY(-300px) translateX(calc(var(--dx)*2)) scale(.5)}}
  .confetti-fx{position:absolute;animation:cfx var(--d,3s) var(--dl,0s) infinite linear;}
  @keyframes cfx{0%{opacity:1;transform:translateY(-20px) rotate(0)}100%{opacity:.2;transform:translateY(500px) rotate(var(--spin,720deg))}}
  .star-fx{position:absolute;animation:sfx var(--d,2.5s) var(--dl,0s) infinite ease-out;}
  @keyframes sfx{0%{opacity:0;transform:scale(0) rotate(0)}20%{opacity:1;transform:scale(1.2) rotate(30deg)}60%{opacity:.7;transform:scale(.9) rotate(60deg)}100%{opacity:0;transform:scale(.4) rotate(90deg) translateY(-40px)}}
  .sparkle-fx{position:absolute;border-radius:50%;animation:spfx var(--d,2s) var(--dl,0s) infinite ease-out;}
  @keyframes spfx{0%{opacity:0;transform:scale(0)}30%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0) translate(var(--dx,10px),var(--dy,-10px))}}
  .fw-fx{position:absolute;border-radius:50%;animation:fwfx var(--d,2.5s) var(--dl,0s) infinite ease-out;}
  @keyframes fwfx{0%{opacity:0;transform:translate(0,0) scale(0)}8%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translate(var(--fx,50px),var(--fy,-50px)) scale(.2)}}
  .snow-fx{position:absolute;border-radius:50%;background:rgba(255,255,255,.6);animation:snfx var(--d,6s) var(--dl,0s) infinite linear;}
  @keyframes snfx{0%{opacity:.7;transform:translateY(-10px) translateX(0)}50%{transform:translateY(50%) translateX(var(--dx,20px))}100%{opacity:0;transform:translateY(110%) translateX(0)}}
  .bokeh-fx{position:absolute;border-radius:50%;animation:bkfx var(--d,8s) var(--dl,0s) infinite ease-in-out;}
  @keyframes bkfx{0%{transform:translate(0,0);opacity:.1}33%{transform:translate(var(--dx,20px),var(--dy,-30px));opacity:.25}66%{transform:translate(calc(var(--dx)*-1),calc(var(--dy)*-.5));opacity:.12}100%{transform:translate(0,0);opacity:.1}}
  .bubble-fx{position:absolute;border-radius:50%;background:rgba(255,255,255,.12);animation:bbfx var(--d,7s) var(--dl,0s) infinite ease-in-out;}
  @keyframes bbfx{0%{opacity:0;transform:translateY(0) scale(.5)}12%{opacity:.5}85%{opacity:.2}100%{opacity:0;transform:translateY(-120%) scale(1.1)}}
"""

html = html.replace("  /* Flame spritesheet", fx_css + "\n  /* Flame spritesheet")

def R(a,b): return round(random.uniform(a,b), 1)
def pick(arr): return random.choice(arr)

def gen_hearts(count=10, colors=None):
    if not colors: colors = ['#FF4B4B','#FF7878','#FFAADE']
    els = []
    for i in range(count):
        x, dx, d, dl, sz = R(0,95), R(-30,30), R(3,7), R(0,8), R(14,24)
        els.append(f'<div class="heart-fx" style="left:{x}%;bottom:{R(-5,10)}%;--d:{d}s;--dl:{dl}s;--dx:{dx}px;--c:{pick(colors)};font-size:{sz}px">&#9829;</div>')
    return "\n    ".join(els)

def gen_confetti(count=25, colors=None):
    if not colors: colors = ['#FF4B4B','#FFC800','#58CC02','#1CB0F6','#CE82FF','#FF9600']
    els = []
    for i in range(count):
        x, w, h, d, dl, spin = R(-5,105), R(4,9), R(3,7), R(2,5), R(0,5), R(360,1080)
        br = "50%" if random.random() > .5 else "2px"
        els.append(f'<div class="confetti-fx" style="left:{x}%;top:-3%;width:{w}px;height:{h}px;--d:{d}s;--dl:{dl}s;--spin:{spin}deg;background:{pick(colors)};border-radius:{br}"></div>')
    return "\n    ".join(els)

def gen_stars(count=14, colors=None):
    if not colors: colors = ['#FFC800','#FFB100','#FBE56D','#FF9600']
    els = []
    for i in range(count):
        x, y, sz, d, dl = R(5,90), R(5,85), R(12,24), R(1.5,4), R(0,6)
        els.append(f'<div class="star-fx" style="left:{x}%;top:{y}%;--d:{d}s;--dl:{dl}s"><span style="font-size:{sz}px;color:{pick(colors)}">&#9733;</span></div>')
    return "\n    ".join(els)

def gen_sparkles(count=20, colors=None):
    if not colors: colors = ['white','#FFC800','#84D8FF','#FFAADE']
    els = []
    for i in range(count):
        x, y, sz, d, dl, dx, dy = R(0,100), R(0,100), R(2,6), R(1,3), R(0,5), R(-20,20), R(-20,20)
        els.append(f'<div class="sparkle-fx" style="left:{x}%;top:{y}%;width:{sz}px;height:{sz}px;--d:{d}s;--dl:{dl}s;--dx:{dx}px;--dy:{dy}px;background:{pick(colors)}"></div>')
    return "\n    ".join(els)

def gen_fireworks(bursts=3, dots=12, colors=None):
    if not colors: colors = ['#FF4B4B','#FFC800','#58CC02','#1CB0F6','#CE82FF']
    els = []
    for b in range(bursts):
        cx, cy, bdl = R(20,80), R(15,60), b * R(1.5,2.5)
        for i in range(dots):
            angle = (i/dots) * math.pi * 2
            dist = R(30,70)
            fx, fy = math.cos(angle)*dist, math.sin(angle)*dist
            d, dl, sz = R(1.5,3), bdl + R(0,.3), R(3,5)
            els.append(f'<div class="fw-fx" style="left:{cx}%;top:{cy}%;width:{sz}px;height:{sz}px;--d:{d}s;--dl:{dl}s;--fx:{fx:.0f}px;--fy:{fy:.0f}px;background:{pick(colors)}"></div>')
    return "\n    ".join(els)

def gen_snow(count=20):
    els = []
    for i in range(count):
        x, sz, d, dl, dx = R(-5,105), R(2,4), R(4,9), R(0,8), R(-30,30)
        els.append(f'<div class="snow-fx" style="left:{x}%;top:-3%;width:{sz}px;height:{sz}px;--d:{d}s;--dl:{dl}s;--dx:{dx}px"></div>')
    return "\n    ".join(els)

def gen_bokeh(count=8, colors=None):
    if not colors: colors = ['rgba(168,85,247,.15)','rgba(99,102,241,.12)','rgba(236,72,153,.1)']
    els = []
    for i in range(count):
        x, y, sz, d, dl, dx, dy = R(5,85), R(5,85), R(20,50), R(6,12), R(0,8), R(-30,30), R(-30,30)
        els.append(f'<div class="bokeh-fx" style="left:{x}%;top:{y}%;width:{sz}px;height:{sz}px;--d:{d}s;--dl:{dl}s;--dx:{dx}px;--dy:{dy}px;background:{pick(colors)}"></div>')
    return "\n    ".join(els)

def gen_bubbles(count=12):
    els = []
    for i in range(count):
        x, sz, d, dl = R(0,100), R(4,14), R(5,10), R(0,8)
        els.append(f'<div class="bubble-fx" style="left:{x}%;bottom:{R(-5,10)}%;width:{sz}px;height:{sz}px;--d:{d}s;--dl:{dl}s"></div>')
    return "\n    ".join(els)

# Replace all existing .pts blocks with new FX
# Find each screen by its comment marker, then replace the FIRST .pts block after it
screens = [
    ("OUT OF HEARTS", gen_hearts(10, ['#FF4B4B','#FF7878','#FFB2B2'])),
    ("TRIAL PROMPT", gen_sparkles(20, ['white','#FFC800','#84D8FF'])),
    ("UPGRADE", gen_sparkles(20, ['white','#FFC800','#84D8FF'])),
    ("SWITCH COURSE", gen_bubbles(12)),
    ("LEVEL UP (normal)", gen_sparkles(20)),
    ("LEVEL UP (milestone)", gen_stars(14)),
    ("STREAK MILESTONE", gen_confetti(30)),
    ("WELCOME BACK", gen_snow(20)),
    ("STREAK FREEZE", gen_bokeh(8)),
    ("LEAGUE WINNER", gen_fireworks(3, 12)),
    ("PROMOTED", gen_confetti(25)),
    ("STAYED", gen_bubbles(12)),
    ("DEMOTED", gen_hearts(8, ['#FF7878','#FFAADE','#FFB2B2'])),
    ("CHAPTER COMPLETE", gen_confetti(25)),
    ("CHAPTER MASTERED", gen_stars(16)),
    ("COURSE COMPLETE", gen_fireworks(4, 14)),
]

for keyword, fx in screens:
    # Find comment containing keyword, then find next <div class="pts...">...</div>
    comment_pat = re.compile(rf'<!--[^>]*{re.escape(keyword)}[^>]*-->', re.IGNORECASE)
    m = comment_pat.search(html)
    if not m:
        print(f"  SKIP {keyword} — no comment found")
        continue

    # From comment position, find the next .pts block
    after = m.end()
    pts_pat = re.compile(r'(<div class="pts[^"]*">)\s*(.*?)\s*(</div>)', re.DOTALL)
    pm = pts_pat.search(html, after)
    if not pm or pm.start() - after > 500:  # must be close to the comment
        print(f"  SKIP {keyword} — no .pts block nearby")
        continue

    # Replace the content
    new_block = pm.group(1) + "\n    " + fx + "\n  " + pm.group(3)
    html = html[:pm.start()] + new_block + html[pm.end():]
    print(f"  OK {keyword}")

# Remove old space-warp blocks
html = re.sub(r'\s*<div class="pts space-warp">.*?</div>\n', '\n', html, flags=re.DOTALL)

with open("modal-gallery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("\nDone!")
