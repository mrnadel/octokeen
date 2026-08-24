#!/usr/bin/env node
/**
 * Cut a character pose sheet into one transparent PNG per pose.
 *
 *   node scripts/crop-character-sheet.mjs <sheet.png> <characterId> <pose,pose,...>
 *
 * Poses are named in reading order (rows top to bottom, left to right within a row).
 * Each pose is isolated by 8-connected alpha islands rather than a grid split, so a
 * neighbour whose bounding box overlaps this one never bleeds into the crop: every
 * pixel that does not belong to this pose's own islands is written fully transparent.
 * Detached props (sparkles, a lightbulb, a dropped shoe) are absorbed into the nearest
 * pose; isolated specks far from any pose are discarded as export noise.
 *
 * Writes public/characters/{id}-{pose}.png (1024) and -sm.png (256).
 */
import sharp from 'sharp';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../public/characters');
const PNG = { compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 85, effort: 10, colours: 256 };
const SPECK_AREA = 200;  // below this, a fragment must sit near its owner to survive
const SPECK_GAP = 25;    // px from the owner's bounding box

const [sheet, characterId, poseList] = process.argv.slice(2);
if (!sheet || !characterId || !poseList) {
  console.error('usage: crop-character-sheet.mjs <sheet.png> <characterId> <pose,pose,...>');
  process.exit(1);
}
const poses = poseList.split(',').map(p => p.trim()).filter(Boolean);

const { data, info } = await sharp(sheet).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const mask = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) mask[i] = data[i * C + 3] > 24 ? 1 : 0;

// Label every 8-connected island of opaque pixels.
const lab = new Int32Array(W * H).fill(-1);
const stack = new Int32Array(W * H);
const comps = [];
for (let p = 0; p < W * H; p++) {
  if (!mask[p] || lab[p] >= 0) continue;
  const id = comps.length;
  let sp = 0; stack[sp++] = p; lab[p] = id;
  let minx = W, maxx = 0, miny = H, maxy = 0, area = 0, sx = 0, sy = 0;
  while (sp > 0) {
    const q = stack[--sp], x = q % W, y = (q - x) / W;
    area++; sx += x; sy += y;
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (mask[n] && lab[n] < 0) { lab[n] = id; stack[sp++] = n; }
    }
  }
  comps.push({ id, minx, maxx, miny, maxy, area, cx: sx / area, cy: sy / area });
}
if (comps.length < poses.length) {
  console.error(`sheet has ${comps.length} islands but ${poses.length} poses were named`);
  process.exit(1);
}

// The largest islands are the figures; everything else is a prop or a speck.
const seeds = [...comps].sort((a, b) => b.area - a.area).slice(0, poses.length);
// seedBoxes stay frozen so ownership is decided against the figures alone. Measuring against
// a box that grows as props are absorbed makes assignment order-dependent: one absorbed prop
// drags the box toward a neighbour, which pulls in the neighbour's props too.
const seedBoxes = seeds.map(s => ({ minx: s.minx, maxx: s.maxx, miny: s.miny, maxy: s.maxy, cx: s.cx, cy: s.cy }));
const boxes = seeds.map(s => ({ minx: s.minx, maxx: s.maxx, miny: s.miny, maxy: s.maxy }));
const gap = (c, b) => Math.hypot(
  Math.max(b.minx - c.maxx, c.minx - b.maxx, 0),
  Math.max(b.miny - c.maxy, c.miny - b.maxy, 0),
);

const group = new Int32Array(comps.length).fill(-1);
seeds.forEach((s, gi) => { group[s.id] = gi; });
let dropped = 0;
for (const c of comps) {
  if (group[c.id] >= 0) continue;
  // Nearest by bounding-box gap, then by centroid. A prop drawn between two figures — a
  // thought bubble above one and beside the other — overlaps both boxes and ties at gap 0;
  // the centroid is what actually says whose it is.
  let best = 0, bestD = Infinity, bestC = Infinity;
  seedBoxes.forEach((b, gi) => {
    const d = gap(c, b);
    const cd = Math.hypot(c.cx - b.cx, c.cy - b.cy);
    if (d < bestD || (d === bestD && cd < bestC)) { bestD = d; bestC = cd; best = gi; }
  });
  if (c.area < SPECK_AREA && bestD > SPECK_GAP) { dropped++; continue; }
  group[c.id] = best;
  const b = boxes[best];
  b.minx = Math.min(b.minx, c.minx); b.maxx = Math.max(b.maxx, c.maxx);
  b.miny = Math.min(b.miny, c.miny); b.maxy = Math.max(b.maxy, c.maxy);
}

// Reading order: cluster figures into rows, then sort left to right inside each row.
const withCentre = boxes.map((b, i) => ({ i, b, cy: (b.miny + b.maxy) / 2, h: b.maxy - b.miny }));
const medianH = [...withCentre].sort((a, b) => a.h - b.h)[Math.floor(withCentre.length / 2)].h;
const byY = [...withCentre].sort((a, b) => a.cy - b.cy);
let row = 0, prevY = byY[0].cy;
for (const f of byY) {
  if (f.cy - prevY > medianH / 2) row++;
  f.row = row; prevY = f.cy;
}
const order = withCentre.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.b.minx - b.b.minx));

console.log(`${comps.length} islands, ${dropped} specks dropped, ${order.length} poses`);
for (let k = 0; k < order.length; k++) {
  const { i, b } = order[k];
  const w = b.maxx - b.minx + 1, h = b.maxy - b.miny + 1;
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sp = (b.miny + y) * W + (b.minx + x);
    if (lab[sp] < 0 || group[lab[sp]] !== i) continue;  // neighbour pixels stay transparent
    const dp = (y * w + x) * 4;
    buf[dp] = data[sp * C]; buf[dp + 1] = data[sp * C + 1];
    buf[dp + 2] = data[sp * C + 2]; buf[dp + 3] = data[sp * C + 3];
  }
  const base = `${characterId}-${poses[k]}`;
  for (const [suffix, size] of [['', 1024], ['-sm', 256]]) {
    await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
      .resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .png(PNG)
      .toFile(path.join(OUT, `${base}${suffix}.png`));
  }
  console.log(`  ${base}  ${w}x${h} @ [${b.minx},${b.miny}]`);
}
