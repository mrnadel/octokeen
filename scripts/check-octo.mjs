#!/usr/bin/env node
/**
 * Octo/octopus-themed names for a dumbo octopus mascot
 * 8 arms = 8 skills, tentacles reaching for knowledge, etc.
 */

const candidates = [
  // === OCTO + SKILL/LEARNING ===
  "octohone", "octokeen", "octojoy", "octopop", "octoplay",
  "octobuzz", "octosnap", "octozip", "octodash", "octoleap",
  "octorise", "octosoar", "octoglow", "octobolt", "octospark",
  "octoflash", "octobloom", "octobud", "octoseed", "octogrow",
  "octoquest", "octolevel", "octorank", "octoboost", "octopeak",
  "octowit", "octomind", "octobrain", "octosavvy", "octowise",
  "octoforge", "octoskill", "octocraft", "octosharp", "octobold",
  "octofun", "octonifty", "octoswift", "octovibe", "octocrisp",
  "octoflow", "octoden", "octocove", "octonest", "octohive",
  "octogrove", "octopath", "octoway", "octostep", "octotrail",

  // === OCTO + GAMIFICATION ===
  "octogem", "octostar", "octobadge", "octostreak", "octocombo",
  "octoloot", "octotier", "octoscore", "octocoin", "octowin",
  "octochamp", "octopro", "octoace", "octohero", "octogold",

  // === OCTO + FUN SOUNDS ===
  "octozing", "octozap", "octoboom", "octowham", "octobam",
  "octokick", "octohop", "octoskip", "octoflip", "octospin",

  // === OCTO + CUTE ===
  "octopals", "octobuds", "octocrew", "octosquad", "octogang",
  "octofam", "octoclub", "octopack", "octobean", "octomochi",

  // === WORDPLAY ON OCTOPUS ===
  "octopush", "octopull", "octopulse", "octoplus", "octoplex",

  // === SHORT OCTO COMBOS ===
  "octofy", "octoly", "octosy", "octovy", "octozy",
  "octora", "octova", "octomo", "octono", "octopo",
  "octoio", "octogo", "octoup", "octodo", "octobe",

  // === EIGHT/TENTACLE THEME ===
  "eighthone", "eightskill", "eightcraft", "eightwise",
  "armshone", "armskeen", "armsjoy", "armspop",
  "tentakeen", "tentahone", "tentajoy", "tentapop",
  "tentaplay", "tentabuzz", "tentasnap", "tentaleap",

  // === INKED/INK THEME (octopus ink) ===
  "inkhone", "inkkeen", "inkjoy", "inkpop", "inkplay",
  "inkbuzz", "inksnap", "inkleap", "inkbloom", "inkspark",
  "inkquest", "inklevel", "inkforge", "inkbold", "inkflow",
  "inkden", "inkcove", "inkpath", "inkwise", "inkvibe",

  // === DEEP SEA THEME ===
  "deephone", "deepkeen", "deepjoy", "deeppop", "deepplay",
  "deepbuzz", "deepleap", "deepbloom", "deepspark", "deepquest",
  "deepflow", "deepcove", "deepden", "deeppath", "deepwise",
  "deepglow", "deepbolt", "deeprise", "deepsoar", "deepvibe",

  // === DUMBO OCTOPUS SPECIFIC ===
  "dumbokeen", "dumbojoy", "dumbopop", "dumboplay", "dumbohone",
  "dumbobuzz", "dumbosnap", "dumboleap", "dumbobloom", "dumbospark",
  "dumbowise", "dumbobud", "dumboquest", "dumbolevel", "dumboflow",

  // === OCTO- PREFIX BRANDS ===
  "octoleap", "octojolt", "octogrit", "octozest", "octoflare",
  "octomint", "octobeam", "octoray", "octoblaze", "octonova",
  "octoprime", "octofresh", "octonew", "octodawn", "octomorn",
  "octochill", "octogroove", "octovolt", "octopulse", "octowave",

  // === PLAYFUL VARIATIONS ===
  "octobuddy", "octofriend", "octohelper", "octoguide", "octocoach",
  "octolearn", "octostudy", "octotutor", "octoteach", "octoprep",

  // === REVERSE: SKILL + OCTO ===
  "keenocto", "honeocto", "joyocto", "popocto", "playocto",
  "buzzocto", "snapocto", "leapocto", "bloomocto", "sparkocto",
  "questocto", "levelocto", "boldocto", "sharpocto", "witocto",
];

const unique = [...new Set(candidates)];
console.error(`Checking ${unique.length} octo-themed candidates...`);

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
      if (checked % 40 === 0) console.error(`  ... ${checked}/${unique.length} (${available.length} avail)`);
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
