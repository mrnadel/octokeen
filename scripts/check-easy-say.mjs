#!/usr/bin/env node
/**
 * EASY TO PRONOUNCE ONLY — no silent letters, no awkward clusters
 * Roots: keen, hone, savvy, nifty, sharp, slick, agile, swift, bright,
 *        clever, handy, nimble, ace, pro, forge, skill, craft, wit, ready
 * NO: apt (pt), deft (daft), knack (silent k), adept (pt)
 */

const roots = [
  "keen", "hone", "savvy", "nifty", "sharp", "slick", "agile",
  "swift", "bright", "clever", "handy", "nimble", "ace", "pro",
  "forge", "skill", "craft", "wit", "ready", "prime", "bold",
  "vibe", "glow", "level", "easy", "cool", "fresh", "crisp",
];

const funWords = [
  "pop", "joy", "play", "fun", "snap", "buzz", "zip", "hop",
  "dash", "boom", "zing", "zap", "kick", "flip", "vibe",
  "bloom", "bud", "seed", "grow", "rise", "leaf", "sprout",
  "leap", "soar", "climb", "run", "fly", "bolt", "rush",
  "spark", "flash", "glow", "beam", "blaze", "fire", "ray",
  "wit", "mind", "quest", "level", "rank", "gem", "star",
  "streak", "boost", "badge", "combo", "loot",
  "den", "cove", "nest", "hive", "hub", "bay", "nook", "grove",
  "mint", "dawn", "day", "flow", "wave", "peak", "way", "path",
  "step", "ride", "trail",
];

const prefixes = [
  "joy", "play", "fun", "pop", "day", "go", "up", "my", "re",
  "buzz", "snap", "flash", "spark", "bite", "zen", "ever",
  "all", "new", "top", "mini", "tiny",
];

const candidates = new Set();

for (const r of roots) {
  for (const w of funWords) {
    if (w === r) continue;
    const n1 = r + w;
    if (n1.length >= 5 && n1.length <= 10) candidates.add(n1);
    const n2 = w + r;
    if (n2.length >= 5 && n2.length <= 10) candidates.add(n2);
  }
  for (const p of prefixes) {
    if (p === r) continue;
    const n = p + r;
    if (n.length >= 5 && n.length <= 10) candidates.add(n);
  }
}

// Extra short combos (5-6 chars)
const shortRoots = ["ace", "pro", "wit", "hone", "keen", "bold", "vibe", "glow"];
const shortWords = ["pop", "joy", "fun", "hop", "zip", "bud", "go", "up", "day",
  "run", "fly", "gem", "bay", "hub", "den", "ray", "now", "zap", "wow", "win"];
for (const r of shortRoots) {
  for (const w of shortWords) {
    if (w === r) continue;
    const n1 = r + w;
    const n2 = w + r;
    if (n1.length >= 5 && n1.length <= 8) candidates.add(n1);
    if (n2.length >= 5 && n2.length <= 8) candidates.add(n2);
  }
}

const unique = [...candidates];
console.error(`Checking ${unique.length} easy-to-pronounce candidates...`);

const CONCURRENCY = 12;
const DELAY_MS = 70;
const available = [];
let checked = 0;

async function checkDomain(name) {
  const domain = `${name}.com`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://rdap.verisign.com/com/v1/domain/${domain}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/rdap+json' }
    });
    clearTimeout(timeout);
    checked++;
    if (res.status === 404) {
      available.push(name);
      console.error(`  ✓ ${domain} (${checked}/${unique.length})`);
    } else {
      if (checked % 100 === 0) console.error(`  ... ${checked}/${unique.length} (${available.length} avail)`);
    }
  } catch (err) { checked++; }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(checkDomain));
    if (i + CONCURRENCY < unique.length) await sleep(DELAY_MS);
  }
  console.error(`\nDone: ${available.length}/${checked}`);
  console.log(JSON.stringify(available, null, 2));
}

main().catch(console.error);
