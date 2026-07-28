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
await browser.close();

// The numbers actually baked into the image, so a test can catch drift.
fs.writeFileSync(path.join(ROOT, 'og-image.meta.json'),
  JSON.stringify({ ...counts, generated: new Date().toISOString().slice(0, 10) }, null, 2) + '\n');

const kb = Math.round(fs.statSync(path.join(ROOT, 'og-image.png')).size / 1024);
console.log(`og-image.png written — ${counts.paths} paths, ${counts.lessons} lessons, ` +
  `${counts.labs} labs, ${counts.tools} tools, ${kb} KB.`);
