#!/usr/bin/env node
/*
 * Data-integrity checks — pure Node, no browser, runs in ~1 second.
 *
 * These exist because every content bug this project has actually shipped was
 * a consistency failure between app.js's PATHS array and something else:
 * lessons registered with no file, quizzes missing for whole paths, orphaned
 * .md files nobody references, counts in the README drifting from reality.
 * A human reviewing a diff will not catch those; this will.
 *
 *   node tests/data-integrity.test.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const failures = [];
const passes = [];
function check(name, ok, detail) {
  if (ok) passes.push(name);
  else failures.push(detail ? `${name}\n      ${detail}` : name);
}

function extractArray(src, name) {
  const m = src.match(new RegExp('const ' + name + ' = \\[[\\s\\S]*?\\n\\];'));
  if (!m) throw new Error(`Could not find ${name} in app.js`);
  return new Function(m[0] + '; return ' + name + ';')();
}

const appJs = read('app.js');
const PATHS = extractArray(appJs, 'PATHS');
const TOOLS = extractArray(appJs, 'TOOLS');
const LABS = extractArray(appJs, 'LABS');

const quizzesJs = read('quizzes.js');
const QUIZZES = new Function(
  quizzesJs.match(/const QUIZZES = \{[\s\S]*?\n\};/)[0] + '; return QUIZZES;')();

const totalLessons = PATHS.reduce((s, p) => s + p.subs.length, 0);

/* ---- 1. every registered lesson has a file ---- */
const missingFiles = [];
for (const p of PATHS)
  for (const s of p.subs)
    if (!fs.existsSync(path.join(ROOT, 'course', p.id, s.id + '.md')))
      missingFiles.push(`${p.id}/${s.id}.md`);
check('every registered lesson has a markdown file', missingFiles.length === 0,
  missingFiles.join(', '));

/* ---- 2. no orphaned .md files ---- */
const registered = new Set();
PATHS.forEach(p => p.subs.forEach(s => registered.add(`${p.id}/${s.id}.md`)));
const orphans = [];
for (const dir of fs.readdirSync(path.join(ROOT, 'course'))) {
  const dirPath = path.join(ROOT, 'course', dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;
  for (const f of fs.readdirSync(dirPath))
    if (f.endsWith('.md') && !registered.has(`${dir}/${f}`)) orphans.push(`${dir}/${f}`);
}
check('no orphaned lesson files (present on disk, unreferenced by PATHS)',
  orphans.length === 0, orphans.join(', '));

/* ---- 3. every path has a quiz (the X/24 bug) ---- */
const noQuiz = PATHS.filter(p => !QUIZZES[p.id]).map(p => `${p.n} ${p.title}`);
check('every path has a quiz', noQuiz.length === 0, noQuiz.join(' | '));

/* ---- 4. quiz banks are deep enough for the features that consume them ---- */
// Weekly chains slice 7 questions; anything shallower silently under-delivers.
const MIN_QUESTIONS = 7;
const thin = Object.entries(QUIZZES)
  .filter(([, q]) => (q.questions || []).length < MIN_QUESTIONS)
  .map(([k, q]) => `${k}=${q.questions.length}`);
check(`every quiz has >= ${MIN_QUESTIONS} questions (weekly chains slice 7)`,
  thin.length === 0, thin.join(', '));

/* ---- 5. quiz questions are well-formed ---- */
const malformed = [];
for (const [pid, q] of Object.entries(QUIZZES)) {
  (q.questions || []).forEach((item, i) => {
    if (!item.q) malformed.push(`${pid}[${i}] missing q`);
    else if (!Array.isArray(item.options) || item.options.length !== 4)
      malformed.push(`${pid}[${i}] needs exactly 4 options`);
    else if (!(item.correct >= 0 && item.correct <= 3))
      malformed.push(`${pid}[${i}] correct index out of range`);
    else if (!item.explain) malformed.push(`${pid}[${i}] missing explain`);
  });
}
check('all quiz questions well-formed (4 options, valid index, explanation)',
  malformed.length === 0, malformed.slice(0, 8).join('; '));

/* ---- 6. no duplicate questions within a bank ---- */
const dupes = [];
for (const [pid, q] of Object.entries(QUIZZES)) {
  const seen = new Set();
  (q.questions || []).forEach(item => {
    if (seen.has(item.q)) dupes.push(`${pid}: ${item.q.slice(0, 50)}`);
    seen.add(item.q);
  });
}
check('no duplicate questions within a quiz', dupes.length === 0, dupes.join('; '));

/* ---- 7. unique ids ---- */
const pathIds = PATHS.map(p => p.id);
check('path ids unique', new Set(pathIds).size === pathIds.length);
const dupSubs = [];
PATHS.forEach(p => {
  const ids = p.subs.map(s => s.id);
  if (new Set(ids).size !== ids.length) dupSubs.push(p.id);
});
check('sub-lesson ids unique within each path', dupSubs.length === 0, dupSubs.join(', '));
const toolIds = TOOLS.map(t => t.id), labIds = LABS.map(l => l.id);
check('tool ids unique', new Set(toolIds).size === toolIds.length);
check('lab ids unique', new Set(labIds).size === labIds.length);

/* ---- 8. generated artifacts are in sync with source ---- */
const hashesExist = fs.existsSync(path.join(ROOT, 'lesson-hashes.js'));
check('lesson-hashes.js exists (run npm run build)', hashesExist);
if (hashesExist) {
  const LESSON_HASHES = new Function(
    read('lesson-hashes.js').match(/const LESSON_HASHES = \{[\s\S]*?\n\};/)[0] +
    '; return LESSON_HASHES;')();
  const unhashed = [];
  for (const p of PATHS)
    for (const s of p.subs)
      if (!LESSON_HASHES[`${p.id}/${s.id}`]) unhashed.push(`${p.id}/${s.id}`);
  check('every lesson has a content hash (artifacts rebuilt)',
    unhashed.length === 0, `${unhashed.length} unhashed — run npm run build`);
}

const swExists = fs.existsSync(path.join(ROOT, 'sw.js'));
check('sw.js exists', swExists);
if (swExists) {
  const sw = read('sw.js');
  const lessonUrls = JSON.parse(sw.match(/const LESSON_URLS = (\[[\s\S]*?\]);/)[1]);
  check('sw.js precache list matches lesson count (artifacts rebuilt)',
    lessonUrls.length === totalLessons,
    `sw.js has ${lessonUrls.length}, PATHS has ${totalLessons} — run npm run build`);
  // The large on-demand bundles must stay OUT of the blocking shell list.
  const shell = JSON.parse(sw.match(/const SHELL_URLS = (\[[\s\S]*?\]);/)[1]);
  check('search-index.js is not in the blocking precache shell',
    !shell.includes('search-index.js'),
    'a 600KB bundle in SHELL_URLS blocks service-worker install for everyone');
}

/* ---- 9. README counts match reality ---- */
const readme = read('README.md');
check(`README states ${PATHS.length} paths`, readme.includes(`${PATHS.length} learning paths`),
  `expected "${PATHS.length} learning paths"`);
check(`README states ${totalLessons} sub-lessons`, readme.includes(`${totalLessons} sub-lessons`),
  `expected "${totalLessons} sub-lessons"`);
const listedPaths = (readme.match(/`\d\d`/g) || []).length;
check('README path list covers every path', listedPaths >= PATHS.length,
  `README lists ${listedPaths} of ${PATHS.length}`);

/* ---- 10. index.html's SEO/social counts match reality ----
   These drove Google snippets and every social share while being two content
   expansions out of date, because nothing checked them. */
const indexHtml = read('index.html');
const staleCounts = [...indexHtml.matchAll(/(\d+) paths, (\d+) sub-lessons/g)]
  .filter(m => +m[1] !== PATHS.length || +m[2] !== totalLessons)
  .map(m => m[0]);
check('index.html meta counts match PATHS', staleCounts.length === 0,
  `stale: ${[...new Set(staleCounts)].join(', ')} — should be "${PATHS.length} paths, ${totalLessons} sub-lessons"`);

/* ---- 11. every internal cross-link in lesson markdown resolves ----
   With hundreds of lessons citing each other, a renamed slug silently becomes
   a dead end in the "Next up" chain. This catches that. */
const validLesson = new Set();
for (const p of PATHS) for (const s of p.subs) validLesson.add(`${p.id}/${s.id}`);
const labIdSet = new Set(labIds);
const toolIdSet = new Set(toolIds);
const deadLinks = [];
for (const p of PATHS) {
  for (const s of p.subs) {
    const f = `course/${p.id}/${s.id}.md`;
    if (!fs.existsSync(path.join(ROOT, f))) continue;
    const md = read(f);
    for (const m of md.matchAll(/#\/lesson\/([a-z0-9-]+)\/([a-z0-9-]+)/g))
      if (!validLesson.has(`${m[1]}/${m[2]}`)) deadLinks.push(`${f} → #/lesson/${m[1]}/${m[2]}`);
    for (const m of md.matchAll(/#\/labs\/([a-z0-9-]+)/g))
      if (!labIdSet.has(m[1])) deadLinks.push(`${f} → #/labs/${m[1]}`);
    for (const m of md.matchAll(/#\/tools\/([a-z0-9-]+)/g))
      if (!toolIdSet.has(m[1])) deadLinks.push(`${f} → #/tools/${m[1]}`);
  }
}
check('every internal cross-link in lesson markdown resolves', deadLinks.length === 0,
  deadLinks.slice(0, 8).join('\n      ') + (deadLinks.length > 8 ? `\n      …and ${deadLinks.length - 8} more` : ''));

/* ---- 12. every lab and tool is actually reachable ----
   An entry in LABS/TOOLS with no render function or no wired route renders a
   blank page; nothing previously verified the wiring. */
const unreachableLabs = LABS.filter(l => !new RegExp(`#/labs/${l.id}'\\)`).test(appJs)).map(l => l.id);
check('every LABS entry has a wired route', unreachableLabs.length === 0,
  `no #/labs/<id> route for: ${unreachableLabs.join(', ')}`);

const labFns = [...appJs.matchAll(/#\/labs\/[a-z0-9-]+'\)\s*renderLab(\w+)\(\)/g)].map(m => `renderLab${m[1]}`);
const definedFns = new Set([...appJs.matchAll(/function (renderLab\w+)\(/g)].map(m => m[1]));
const missingLabFns = labFns.filter(fn => !definedFns.has(fn));
check('every lab route points at a defined render function', missingLabFns.length === 0,
  `undefined: ${missingLabFns.join(', ')}`);

const toolDispatch = appJs.match(/\(\{encoder:toolEncoder[\s\S]*?\}\[id\]\)\(body\)/);
const dispatchIds = toolDispatch
  ? new Set([...toolDispatch[0].matchAll(/([a-z0-9]+)\s*:\s*tool\w+/gi)].map(m => m[1]))
  : new Set();
const unwiredTools = TOOLS.filter(t => !dispatchIds.has(t.id)).map(t => t.id);
check('every TOOLS entry is wired into renderTool dispatch', unwiredTools.length === 0,
  `missing dispatch for: ${unwiredTools.join(', ')}`);

/* ---- 13. prerendered pages self-canonicalise ----
   This shipped broken and nothing caught it: every stub's canonical pointed
   at the SPA hash route (`/#/lesson/a/b`). Google discards everything after
   `#`, so all 587 content pages declared themselves duplicates of the
   homepage — none of them could rank. The rule is simple enough to assert:
   a page's canonical is its own crawlable URL, and never contains a '#'. */
const SITE = 'https://kashsec.vercel.app';
const prerendered = [];
(function walk(dir) {
  if (!fs.existsSync(path.join(ROOT, dir))) return;
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel);
    else if (e.name.endsWith('.html')) prerendered.push(rel);
  }
})('lesson');
['tools', 'labs'].forEach(d => {
  if (!fs.existsSync(path.join(ROOT, d))) return;
  fs.readdirSync(path.join(ROOT, d))
    .filter(f => f.endsWith('.html')).forEach(f => prerendered.push(`${d}/${f}`));
});
if (fs.existsSync(path.join(ROOT, 'faq.html'))) prerendered.push('faq.html');

check('prerendered stubs exist (run npm run build)', prerendered.length > totalLessons,
  `found ${prerendered.length} prerendered pages, expected more than ${totalLessons}`);

const badCanonical = [];
const badJsonLd = [];
for (const rel of prerendered) {
  const html = read(rel);
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  // The URL this file is actually served at: index.html files answer to
  // their directory, everything else to its own .html path.
  const expected = SITE + '/' + rel.replace(/(^|\/)index\.html$/, '$1');
  if (!canon) badCanonical.push(`${rel}: no canonical`);
  else if (canon.includes('#')) badCanonical.push(`${rel}: canonical has a fragment — ${canon}`);
  else if (canon !== expected) badCanonical.push(`${rel}: canonical is ${canon}, expected ${expected}`);

  const og = (html.match(/<meta property="og:url" content="([^"]+)"/) || [])[1];
  if (og !== canon) badCanonical.push(`${rel}: og:url (${og}) disagrees with canonical`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const obj = JSON.parse(m[1]);
      if (!obj['@context'] || !obj['@type']) badJsonLd.push(`${rel}: block missing @context/@type`);
    } catch (e) { badJsonLd.push(`${rel}: ${e.message}`); }
  }
}
check('every prerendered page canonicalises to its own crawlable URL (no # fragments)',
  badCanonical.length === 0,
  badCanonical.slice(0, 6).join('\n      ') +
  (badCanonical.length > 6 ? `\n      …and ${badCanonical.length - 6} more` : ''));
check('all JSON-LD parses and declares @context + @type', badJsonLd.length === 0,
  badJsonLd.slice(0, 6).join('\n      '));

/* ---- 14. the sitemap agrees with what was prerendered ----
   A sitemap listing URLs that 404, or omitting pages that exist, wastes
   crawl budget in both directions. */
if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
  const sm = read('sitemap.xml');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const locSet = new Set(locs);
  check('no sitemap URL contains a hash fragment',
    !locs.some(u => u.includes('#')),
    locs.filter(u => u.includes('#')).slice(0, 4).join(', '));
  check('every sitemap URL has a <lastmod>',
    (sm.match(/<url>/g) || []).length === (sm.match(/<lastmod>/g) || []).length);
  const notListed = prerendered
    .map(rel => SITE + '/' + rel.replace(/(^|\/)index\.html$/, '$1'))
    .filter(u => !locSet.has(u));
  check('every prerendered page is listed in sitemap.xml', notListed.length === 0,
    `${notListed.length} missing, e.g. ${notListed.slice(0, 3).join(', ')}`);
}

/* ---- 15. tool and lab stubs are not thin content ----
   These pages shipped with ~53 words of unique prose each, followed by a
   link list naming every other item in the section — a list that was ~90%
   of the page and identical across all of them. Google treats that shape
   as thin, near-duplicate content, and no keyword targeting rescues it.
   The generator throws if an item has no entry in prerender-content.js;
   this catches the subtler regression where an entry exists but is a stub. */
const MIN_UNIQUE_WORDS = 180;
const stripTags = h => h
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ');
const thinPages = [];
for (const dir of ['tools', 'labs']) {
  if (!fs.existsSync(path.join(ROOT, dir))) continue;
  for (const f of fs.readdirSync(path.join(ROOT, dir))) {
    if (!f.endsWith('.html') || f === 'index.html') continue;
    const article = (read(`${dir}/${f}`).match(/<article>([\s\S]*?)<\/article>/) || [])[1] || '';
    // Discount the shared "Related" list — it is navigation, not content.
    const withoutNav = article.replace(/<h2>Related<\/h2><ul>[\s\S]*?<\/ul>/, '');
    const words = (stripTags(withoutNav).match(/\S+/g) || []).length;
    if (words < MIN_UNIQUE_WORDS) thinPages.push(`${dir}/${f} (${words} words)`);
  }
}
check(`every tool and lab page carries >= ${MIN_UNIQUE_WORDS} words of its own content`,
  thinPages.length === 0,
  thinPages.slice(0, 6).join(', ') + (thinPages.length > 6 ? ` …and ${thinPages.length - 6} more` : ''));

/* ---- 16. the social share image is not stale ----
   og-image.png is what every Reddit post, LinkedIn share, Twitter card and
   Slack unfurl displays — the first thing anyone sees of this site. It sat
   advertising "23 paths, 226+ lessons" through three content expansions,
   understating the course by more than half, because a PNG is opaque to
   every other check here. The generator now records the numbers it baked
   in; this compares them to reality. */
const ogMetaPath = path.join(ROOT, 'og-image.meta.json');
check('og-image.png exists', fs.existsSync(path.join(ROOT, 'og-image.png')));
check('og-image.meta.json exists (run npm run build)', fs.existsSync(ogMetaPath));
if (fs.existsSync(ogMetaPath)) {
  const meta = JSON.parse(read('og-image.meta.json'));
  const want = { paths: PATHS.length, lessons: totalLessons, labs: LABS.length, tools: TOOLS.length };
  const drift = Object.entries(want)
    .filter(([k, v]) => meta[k] !== v)
    .map(([k, v]) => `${k}: image says ${meta[k]}, actual ${v}`);
  check('social share image shows current counts', drift.length === 0,
    drift.join('; ') + ' — run npm run build:og');
}

/* ---- report ---- */
console.log(`\n  Data integrity — ${PATHS.length} paths, ${totalLessons} lessons, ` +
  `${Object.values(QUIZZES).reduce((s, q) => s + q.questions.length, 0)} quiz questions\n`);
passes.forEach(n => console.log(`  ✓ ${n}`));
failures.forEach(n => console.log(`  ✗ ${n}`));
console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`);
process.exit(failures.length ? 1 : 0);
