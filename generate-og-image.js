#!/usr/bin/env node
/*
 * Builds og-image.png — the card shown on every Reddit post, LinkedIn share,
 * Twitter card, Discord embed and Slack unfurl.
 *
 * WHY THIS IS GENERATED
 * It was hand-made once and then went three content expansions stale: it
 * advertised "23 paths · 226+ lessons" while the course had grown to 26 and
 * 485. That image is the first thing anyone ever sees of this site, and it
 * was underselling it by more than half — for months, silently, because a
 * PNG is opaque to every test in the repo.
 *
 * Now the counts come from PATHS/LABS/TOOLS at build time, and the numbers
 * used are written alongside it to og-image.meta.json so a test can fail
 * when they drift (see tests/data-integrity.test.js).
 *
 * Rendered with Playwright, which is already a devDependency for the test
 * suites — no new tooling, and full control over type and colour. If
 * Chromium is unavailable the existing PNG is left alone with a warning
 * rather than failing the build, so a contributor without browsers can
 * still run `npm run build`.
 *
 *   node generate-og-image.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

function extractArray(name) {
  const m = appJs.match(new RegExp('const ' + name + ' = \\[[\\s\\S]*?\\n\\];'));
  if (!m) throw new Error('Could not find ' + name + ' array in app.js');
  return new Function(m[0] + '; return ' + name + ';')();
}
const PATHS = extractArray('PATHS');
const LABS = extractArray('LABS');
const TOOLS = extractArray('TOOLS');

const counts = {
  paths: PATHS.length,
  lessons: PATHS.reduce((n, p) => n + p.subs.length, 0),
  labs: LABS.length,
  tools: TOOLS.length,
};

/* The chips carry the four things that actually differentiate this from
   TryHackMe and HackTheBox Academy: it is free, it needs no account, it
   works offline, and it starts from zero. Those are the pitch. */
const chips = [
  `${counts.paths} paths`,
  `${counts.lessons} lessons`,
  `${counts.labs} hands-on labs`,
  `${counts.tools} free tools`,
];

const html = `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:'Inter';src:local('Inter'),local('DejaVu Sans');}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;
    font-family:Inter,'DejaVu Sans',system-ui,sans-serif;
    background:#080A0F;color:#EAEFF5;position:relative}
  /* Faint grid + two corner glows, matching the site's hero treatment. */
  .grid{position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
    background-size:44px 44px}
  .glow-a{position:absolute;right:-160px;top:-200px;width:720px;height:620px;border-radius:50%;
    background:radial-gradient(circle,rgba(239,164,58,.30),transparent 68%)}
  .glow-b{position:absolute;left:-200px;bottom:-260px;width:760px;height:660px;border-radius:50%;
    background:radial-gradient(circle,rgba(63,182,168,.26),transparent 68%)}
  main{position:relative;padding:74px 88px;height:100%;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:18px;margin-bottom:56px}
  .mark{width:62px;height:62px;border-radius:16px;background:rgba(239,164,58,.14);
    border:1px solid rgba(239,164,58,.45);display:flex;align-items:center;justify-content:center}
  .mark svg{width:30px;height:30px}
  .brand-txt{font-size:40px;font-weight:800;letter-spacing:-.9px}
  .dot{color:#EFA43A}
  h1{font-size:70px;line-height:1.06;font-weight:800;letter-spacing:-2.4px;max-width:1010px}
  .amber{color:#EFA43A}
  .teal{color:#5FE0CF}
  .sub{margin-top:26px;font-size:27px;color:#94A3B2;font-weight:500;letter-spacing:-.2px}
  .chips{margin-top:auto;display:flex;gap:14px;flex-wrap:wrap}
  .chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:13px 24px;
    font-size:23px;color:#C9D3DE;font-weight:600;background:rgba(255,255,255,.035)}
  .chip.hot{border-color:rgba(239,164,58,.55);color:#EFA43A;background:rgba(239,164,58,.10)}
  .bar{position:absolute;left:0;right:0;bottom:0;height:9px;
    background:linear-gradient(90deg,#EFA43A,#5FE0CF)}
</style>
<div class="grid"></div><div class="glow-a"></div><div class="glow-b"></div>
<main>
  <div class="brand">
    <span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#EFA43A" stroke-width="2.6"
      stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/></svg></span>
    <span class="brand-txt">KashSec<span class="dot">.</span></span>
  </div>
  <h1>Cybersecurity from <span class="amber">absolute zero</span> to <span class="teal">job-ready</span>.</h1>
  <div class="sub">Free forever · no account · works offline · plain English</div>
  <div class="chips">${chips.map((c, i) => `<div class="chip${i === 0 ? ' hot' : ''}">${c}</div>`).join('')}</div>
</main>
<div class="bar"></div>`;

/* Path glyphs come from the same KICON/PATH_ICON tables the site renders,
   so a card and the path's on-site icon can't disagree. */
function extractObject(name) {
  const m = appJs.match(new RegExp('const ' + name + ' = \\{[\\s\\S]*?\\n\\};'));
  if (!m) throw new Error('Could not find ' + name + ' object in app.js');
  return new Function(m[0] + '; return ' + name + ';')();
}
const KICON = extractObject('KICON');
const PATH_ICON = extractObject('PATH_ICON');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pathCardHtml = p => `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;
    font-family:Inter,'DejaVu Sans',system-ui,sans-serif;
    background:#080A0F;color:#EAEFF5;position:relative}
  .grid{position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
    background-size:44px 44px}
  .glow-a{position:absolute;right:-120px;top:-160px;width:700px;height:640px;border-radius:50%;
    background:radial-gradient(circle,rgba(63,182,168,.28),transparent 66%)}
  .glow-b{position:absolute;left:-220px;bottom:-300px;width:760px;height:660px;border-radius:50%;
    background:radial-gradient(circle,rgba(239,164,58,.22),transparent 68%)}
  main{position:relative;padding:66px 80px;height:100%;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:800;letter-spacing:-.6px}
  .mark{width:48px;height:48px;border-radius:13px;background:rgba(239,164,58,.14);
    border:1px solid rgba(239,164,58,.45);display:flex;align-items:center;justify-content:center}
  .mark svg{width:24px;height:24px}
  .dot{color:#EFA43A}
  .eyebrow{margin-top:58px;font-family:'DejaVu Sans Mono',monospace;font-size:22px;letter-spacing:3px;
    text-transform:uppercase;color:#5FE0CF}
  h1{margin-top:16px;font-size:${p.title.length > 34 ? 58 : 68}px;line-height:1.06;font-weight:800;
    letter-spacing:-2px;max-width:780px}
  .sub{margin-top:22px;font-size:25px;line-height:1.4;color:#94A3B2;max-width:760px;
    display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .chips{margin-top:auto;display:flex;gap:12px}
  .chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:11px 22px;
    font-size:21px;color:#C9D3DE;font-weight:600;background:rgba(255,255,255,.035)}
  .chip.hot{border-color:rgba(239,164,58,.55);color:#EFA43A;background:rgba(239,164,58,.10)}
  .ico{position:absolute;right:92px;top:170px;width:250px;height:250px;border-radius:56px;
    display:flex;align-items:center;justify-content:center;
    background:linear-gradient(160deg,rgba(63,182,168,.16),rgba(239,164,58,.08));
    border:1px solid rgba(95,224,207,.35);box-shadow:0 30px 90px -30px rgba(63,182,168,.55)}
  .ico svg{width:130px;height:130px}
  .ring{position:absolute;right:52px;top:130px;width:330px;height:330px;border-radius:50%;
    border:2px dashed rgba(95,224,207,.22)}
  .bar{position:absolute;left:0;right:0;bottom:0;height:9px;background:linear-gradient(90deg,#EFA43A,#5FE0CF)}
</style>
<div class="grid"></div><div class="glow-a"></div><div class="glow-b"></div>
<div class="ring"></div>
<div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#5FE0CF" stroke-width="1.6"
  stroke-linecap="round" stroke-linejoin="round">${KICON[PATH_ICON[p.id]] || KICON.doc}</svg></div>
<main>
  <div class="brand">
    <span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#EFA43A" stroke-width="2.6"
      stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/></svg></span>
    <span>KashSec<span class="dot">.</span> Academy</span>
  </div>
  <div class="eyebrow">Path ${esc(p.n)} · ${esc(p.level)}</div>
  <h1>${esc(p.title)}</h1>
  <div class="sub">${esc(p.desc)}</div>
  <div class="chips"><div class="chip hot">${p.subs.length} lessons</div><div class="chip">Free forever</div><div class="chip">No account</div></div>
</main>
<div class="bar"></div>`;

const SECTIONS = [
  { id: 'labs', eyebrow: 'Interactive labs', title: `${LABS.length} hands-on labs, right in your browser`,
    sub: 'SQL injection, JWT forgery, phishing, prompt injection, Active Directory and more. No install, no VM.',
    icons: LABS.slice(0, 9).map(l => l.ico), chips: [`${LABS.length} labs`, 'Free forever', 'Runs in your browser'] },
  { id: 'tools', eyebrow: 'Security tools', title: `${TOOLS.length} free security tools`,
    sub: 'Encoders, hash and JWT tools, CVSS calculator, subnetting, regex and more. Nothing you type leaves your browser.',
    icons: TOOLS.slice(0, 9).map(t => t.ico), chips: [`${TOOLS.length} tools`, 'Free forever', '100% client-side'] },
];
const sectionCardHtml = sec => pathCardHtml({ n: '', id: '', title: sec.title, desc: sec.sub, level: '', subs: [] })
  .replace(/<div class="eyebrow">[\s\S]*?<\/div>/, `<div class="eyebrow">${esc(sec.eyebrow)}</div>`)
  .replace(/<div class="chips">[\s\S]*?<\/div>\n<\/main>/, `<div class="chips">${sec.chips.map((c, i) => `<div class="chip${i ? '' : ' hot'}">${esc(c)}</div>`).join('')}</div>\n</main>`)
  .replace(/<div class="ring"><\/div>\s*<div class="ico">[\s\S]*?<\/div>/,
    `<div class="grid8">${sec.icons.map(n => `<div class="g"><svg viewBox="0 0 24 24" fill="none" stroke="#5FE0CF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${KICON[n] || ''}</svg></div>`).join('')}</div>`)
  .replace('</style>', `.grid8{position:absolute;right:80px;top:150px;display:grid;grid-template-columns:repeat(3,104px);gap:16px}
  .g{width:104px;height:104px;border-radius:26px;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(160deg,rgba(63,182,168,.14),rgba(239,164,58,.06));border:1px solid rgba(95,224,207,.28)}
  .g:nth-child(5){border-color:rgba(239,164,58,.55);box-shadow:0 20px 60px -24px rgba(239,164,58,.6)}
  .g svg{width:50px;height:50px}
  h1{max-width:700px!important}.sub{max-width:690px!important}</style>`);

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {}

if (!chromium) {
  console.warn('playwright not installed — og-image.png left unchanged.');
  process.exit(0);
}

let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
} catch (err) {
  console.warn(`Chromium unavailable (${err.message.split('\n')[0]}) — og-image.png left unchanged.`);
  process.exit(0);
}

const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(300);            // let the radial gradients settle
await page.screenshot({ path: path.join(ROOT, 'og-image.png') });

/* ---- one card per learning path ----
   Every lesson used to share the site card, so a link to "Kerberoasting"
   and a link to "What is a computer?" unfurled identically. Each path now
   gets its own card — its glyph, title, level and lesson count — and the
   prerendered lesson pages point at it (see generate-prerender.js).
   JPEG rather than PNG: these are photographic gradients, and 26 PNGs at
   ~280 KB each would add 7 MB to the repo for no visible gain. */
const OG_DIR = path.join(ROOT, 'og');
fs.mkdirSync(OG_DIR, { recursive: true });
for (const p of PATHS) {
  await page.setContent(pathCardHtml(p), { waitUntil: 'load' });
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(OG_DIR, p.id + '.jpg'), type: 'jpeg', quality: 84 });
}

/* ---- section cards: labs and tools ----
   The 74 lab and tool pages shared the site card. Each section now gets
   one that says what it is, with a grid of that section's own glyphs. */
for (const sec of SECTIONS) {
  await page.setContent(sectionCardHtml(sec), { waitUntil: 'load' });
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(OG_DIR, sec.id + '.jpg'), type: 'jpeg', quality: 84 });
}
await browser.close();

// The numbers actually baked into the image, so a test can catch drift.
fs.writeFileSync(path.join(ROOT, 'og-image.meta.json'),
  JSON.stringify({ ...counts, generated: new Date().toISOString().slice(0, 10),
    pathLessons: Object.fromEntries(PATHS.map(p => [p.id, p.subs.length])) }, null, 2) + '\n');

const kb = Math.round(fs.statSync(path.join(ROOT, 'og-image.png')).size / 1024);
console.log(`og-image.png written — ${counts.paths} paths, ${counts.lessons} lessons, ` +
  `${counts.labs} labs, ${counts.tools} tools, ${kb} KB. Plus ${PATHS.length} path cards in og/.`);
