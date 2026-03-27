#!/usr/bin/env node
/**
 * MEANINGFUL COMPOUND NAMES — both halves have meaning
 * Like: Duo+Lingo, Pin+terest, Snap+chat, You+Tube, Skill+share
 */

const candidates = [
  // === SKILL/CRAFT + GROWTH/BLOOM ===
  "skillbloom", "craftbloom", "knackbloom", "deftbloom", "honebloom",
  "skillseed", "craftseed", "knackseed", "deftseed", "honeseed",
  "skillbud", "craftbud", "knackbud", "deftbud", "honebud",
  "skillroot", "craftroot", "knackroot", "deftroot", "honeroot",
  "skillsprout", "craftsprout", "knacksprout", "deftsprout",

  // === SKILL + FUN/PLAY ===
  "skillpop", "craftpop", "knackpop", "deftpop", "honepop",
  "skillplay", "craftplay", "knackplay", "deftplay", "honeplay",
  "skilljoy", "craftjoy", "knackjoy", "deftjoy", "honejoy",
  "skillsnap", "craftsnap", "knacksnap", "deftsnap", "honesnap",
  "skillbuzz", "craftbuzz", "knackbuzz", "deftbuzz", "honebuzz",

  // === SKILL + PATH/JOURNEY ===
  "skillpath", "craftpath", "knackpath", "deftpath", "honepath",
  "skillway", "craftway", "knackway", "deftway", "honeway",
  "skillstep", "craftstep", "knackstep", "deftstep", "honestep",
  "skilltrail", "crafttrail", "knacktrail", "defttrail", "honetrail",
  "skillride", "craftride", "knackride", "deftride", "honeride",

  // === PLAY/FUN + SKILL ===
  "playcraft", "playdeft", "playknack", "playhone", "playskill",
  "funcraft", "fundeft", "funknack", "funhone", "funskill",
  "joycraft", "joydeft", "joyknack", "joyhone", "joyskill",
  "popcraft", "popdeft", "popknack", "pophone", "popskill",

  // === FORGE/BUILD + MEANING ===
  "forgemind", "forgewit", "forgejoy", "forgeplay", "forgepath",
  "mindforge", "witforge", "joyforge", "playforge", "pathforge",
  "forgespark", "forgesnap", "forgestep", "forgeleap", "forgerise",

  // === QUEST/GAME + SKILL ===
  "questcraft", "questknack", "questskill", "questhone", "questdeft",
  "skillquest", "craftquest", "knackquest", "honequest", "deftquest",
  "levelcraft", "levelknack", "levelskill", "levelhone", "leveldeft",
  "craftlevel", "knacklevel", "skilllevel", "honelevel", "deftlevel",

  // === SHORT MEANINGFUL (6-7 chars) ===
  "witpop", "acejoy", "joyace", "goacer", "upknack",
  "zenace", "acezen", "aceup", "goace", "upace",
  "acewit", "witace", "acepop", "popace", "acegem",
  "gemace", "acexpo", "xpoace", "acepro", "proace",
  "joyskl", "popskl", "snapskl", "buzzskl", "zipskl",
  "goknack", "upknack", "myknack", "reknack", "doknack",
  "gohone", "uphone", "myhone", "rehone", "dohone",
  "godeft", "updeft", "mydeft", "redeft", "dodeft",

  // === SPARK/FLASH + SKILL ===
  "sparknack", "sparkdeft", "sparkhone", "sparkwit", "sparkace",
  "knackspark", "deftspark", "honespark", "witspark", "acespark",
  "flashknack", "flashdeft", "flashhone", "flashwit", "flashace",
  "knackflash", "deftflash", "honeflash", "witflash", "aceflash",

  // === MIND/WIT + ACTION ===
  "mindpop", "mindsnap", "mindjoy", "mindleap", "mindstep",
  "witleap", "witstep", "witsnap", "witjoy", "witpop",
  "witcraft", "witknack", "withone", "witdeft", "witskill",
  "craftmind", "knackmind", "honemind", "deftmind", "skillmind",

  // === LEAP/RISE/SOAR + SKILL ===
  "leapcraft", "leapknack", "leapdeft", "leaphone", "leapskill",
  "craftleap", "knackleap", "deftleap", "honeleap", "skillleap",
  "risecraft", "riseknack", "risedeft", "risehone", "riseskill",
  "craftrise", "knackrise", "deftrise", "honerise", "skillrise",
  "soarcraft", "soarknack", "soardeft", "soarhone", "soarskill",

  // === HIVE/NEST/HUB + SKILL ===
  "skillhive", "crafthive", "knackhive", "defthive", "honehive",
  "skillnest", "craftnest", "knacknest", "deftnest", "honenest",
  "skillden", "craftden", "knackden", "deftden", "honeden",
  "skillcove", "craftcove", "knackcove", "deftcove", "honecove",

  // === MINT/FRESH + SKILL ===
  "skillmint", "craftmint", "knackmint", "deftmint", "honemint",
  "mintskill", "mintcraft", "mintknack", "mintdeft", "minthone",
  "freshknack", "freshdeft", "freshhone", "freshskill", "freshcraft",

  // === ZEN/FLOW + SKILL ===
  "skillzen", "craftzen", "knackzen", "deftzen", "honezen",
  "zenskill", "zencraft", "zenknack", "zendeft", "zenhone",
  "skillflow", "craftflow", "knackflow", "deftflow", "honeflow",
  "flowskill", "flowcraft", "flowknack", "flowdeft", "flowhone",

  // === DUAL/MULTI MEANING (like Duolingo) ===
  "polyskill", "multiknack", "omnicraft", "panoskill", "allcraft",
  "everknack", "everhone", "everdeft", "evercraft", "everskill",
  "anycourse", "anyskill", "anycraft", "anyknack", "anydeft",

  // === CLEVER WORDPLAY ===
  "knowhow", "canknack", "gotskill", "naildit", "gotcraft",
  "saywhat", "howdeft", "soknack", "didsomething", "welldone",
  "topnotch", "topknack", "topcraft", "topdeft", "tophone",
  "onpoint", "sharpmind", "keenmind", "quickwit", "brightwit",

  // === PRO/ACE + GROWTH ===
  "probud", "prosprout", "proseed", "proboom", "proburst",
  "acebud", "acesprout", "aceseed", "aceboom", "aceburst",
  "acebloom", "aceblossom", "acerise", "aceleap", "acesoar",

  // === STRIDE/PACE + SKILL ===
  "skillstride", "craftstride", "knackstride",
  "skillpace", "craftpace", "knackpace",
  "skillbound", "craftbound", "knackbound",
  "skilldash", "craftdash", "knackdash",
  "skillrush", "craftrush", "knackrush",

  // === LITTLE/MICRO + SKILL (bite-sized learning) ===
  "microknack", "microdeft", "microhone", "microskill", "microcraft",
  "bitecraft", "biteknack", "bitedeft", "bitehone", "biteskill",
  "tinycraft", "tinyknack", "tinydeft", "tinyhone", "tinyskill",

  // === DAILY/EVER + SKILL ===
  "dailyknack", "dailydeft", "dailyhone", "dailyskill", "dailycraft",
  "daycraft", "daydeft", "dayknack", "dayhone", "dayskill",
];

const unique = [...new Set(candidates)];
console.error(`Checking ${unique.length} meaningful compound names...`);

const CONCURRENCY = 10;
const DELAY_MS = 80;
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
      if (checked % 50 === 0) console.error(`  ... ${checked}/${unique.length} (${available.length} avail)`);
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
