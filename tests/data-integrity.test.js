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

/* ---- report ---- */
console.log(`\n  Data integrity — ${PATHS.length} paths, ${totalLessons} lessons, ` +
  `${Object.values(QUIZZES).reduce((s, q) => s + q.questions.length, 0)} quiz questions\n`);
passes.forEach(n => console.log(`  ✓ ${n}`));
failures.forEach(n => console.log(`  ✗ ${n}`));
console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`);
process.exit(failures.length ? 1 : 0);
