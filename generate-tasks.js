#!/usr/bin/env node
/*
 * Builds tasks.js from tasks-source.js.
 *
 * THE PROBLEM THIS SOLVES
 * These are typed-answer tasks, not multiple choice — the whole value is
 * having to work the answer out. So the answer must not be readable in the
 * page source. Hashing the answer field is the obvious first step, but on
 * its own it achieves nothing: a good explanation usually restates the
 * answer ("Availability is destroyed", "169.254.169.254 is the metadata
 * endpoint"), and the explanation has to ship too. Hashing the answer while
 * shipping the explanation in clear text would have been security theatre.
 *
 * So each explanation is encrypted with AES-256-GCM under a key derived
 * from its own answer. You can only read the explanation once you know the
 * answer, which is exactly the property we want, and it means explanations
 * can be written well instead of contorted to avoid naming the answer.
 *
 * Where a task accepts several equivalent answers, the explanation is
 * encrypted once per variant, so whichever one the learner types can
 * decrypt it. Explanations are a few hundred bytes, so the duplication is
 * cheap.
 *
 * WHAT THIS IS NOT
 * It is not protection against a determined attacker: answer spaces here
 * are small, and anyone willing to grind candidate answers through the same
 * hash will get there. The goal is to stop casual view-source spoiling. A
 * learner who invests real effort in cheating has chosen not to learn, and
 * no mechanism fixes that.
 *
 *   node generate-tasks.js
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { TASK_SOURCE } from './tasks-source.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const previousTasks = new Map();
try {
  const old = fs.readFileSync(path.join(ROOT, 'tasks.js'), 'utf8');
  const match = old.match(/const TASKS = (\[[\s\S]*\]);/);
  if (match) JSON.parse(match[1]).forEach(task => previousTasks.set(task.id, task));
} catch { /* First build has no generated file to reuse. */ }

/* MUST stay byte-identical to normaliseAnswer() in app.js, or a correct
   answer will hash differently in the browser and never verify. Lowercase,
   trim, collapse internal whitespace, drop a trailing full stop. */
function normalise(s) {
  return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/\.$/, '');
}

/* Numbers are normalised through Number() first, so "62", " 62 ", "62.0"
   and "+62" all reduce to the same string before hashing. */
function normaliseNumber(s) {
  const n = Number(String(s).replace(/[, ]/g, ''));
  return Number.isFinite(n) ? String(n) : normalise(s);
}

const keyFor = norm => crypto.createHash('sha256').update(norm, 'utf8').digest();
const hashFor = norm => crypto.createHash('sha256').update(norm, 'utf8').digest('hex');

function encrypt(plaintext, norm, previous) {
  // Reuse a valid ciphertext when the answer and explanation have not
  // changed. A new random IV is generated only for new or edited material;
  // deriving the IV from content would reuse a GCM nonce across revisions.
  if (previous) {
    try { if (decrypt(previous, norm) === plaintext) return previous; }
    catch { /* The prior ciphertext belongs to another answer or is invalid. */ }
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFor(norm), iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  // GCM tag appended, matching what WebCrypto's decrypt() expects.
  return Buffer.concat([iv, ct, cipher.getAuthTag()]).toString('base64');
}

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const PATHS = new Function(
  appJs.match(/const PATHS = \[[\s\S]*?\n\];/)[0] + '; return PATHS;')();
const validPaths = new Set(PATHS.map(p => p.id));

const seen = new Set();
const out = TASK_SOURCE.map(t => {
  if (!t.id) throw new Error('task with no id');
  if (seen.has(t.id)) throw new Error(`duplicate task id: ${t.id}`);
  seen.add(t.id);
  if (!validPaths.has(t.path)) throw new Error(`task ${t.id} names unknown path "${t.path}"`);
  if (!t.q || !t.explain) throw new Error(`task ${t.id} needs both q and explain`);
  if (t.answer === undefined || t.answer === null || t.answer === '')
    throw new Error(`task ${t.id} has no answer`);

  const match = t.match || 'exact';
  const answers = (Array.isArray(t.answer) ? t.answer : [t.answer]).map(String);
  const norms = answers.map(a => (match === 'number' ? normaliseNumber(a) : normalise(a)));

  // A hint that gives the answer away defeats the point, and it ships in
  // clear text because it is meant to be readable on request.
  if (norms.some(n => normalise(t.hint || '').includes(n) && n.length > 3))
    throw new Error(`task ${t.id}: the hint contains the answer`);

  return {
    id: t.id, path: t.path, q: t.q, match,
    points: t.points || 3,
    hint: t.hint || '',
    h: norms.map(hashFor),
    e: norms.map((n, i) => encrypt(t.explain, n, previousTasks.get(t.id)?.e?.[i])),
  };
});

if (!out.length) throw new Error('no tasks generated');

/* Refuse to ship if the opaque fields are not actually opaque.
 *
 * An earlier version of this checked the property the lazy way: lowercase
 * the hashes and the base64 ciphertext and look for the answer as a
 * substring. That is not a check, it is a coin flip. Base64 lowercases into
 * a 36-symbol alphabet, so a four-letter answer turns up by chance about
 * once per half-million characters, and this file ships roughly two hundred
 * thousand of them — measured at 1.3% of builds failing on a task whose
 * content nobody had touched ("drop", "fido" and "read" were the usual
 * culprits). A build that fails one time in eighty for no reason is worse
 * than no guard, because the first instinct is to re-run it until it passes,
 * and by then a real failure would be re-run away too.
 *
 * So check the properties that are actually true or actually false, every
 * time, for every task:
 *   1. the hint — real plaintext, genuinely greppable — must not give the
 *      answer away. (The question is exempt: "read this URL and say where it
 *      really goes" cannot exist without printing the URL.)
 *   2. every ciphertext must decrypt back to its own explanation under the
 *      key derived from its own answer, so a typo here can't ship a task
 *      whose explanation is unreadable to a learner who answered correctly;
 *   3. and must NOT decrypt under any other answer's key, which is the
 *      statement "you need the answer to read this" in its testable form;
 *   4. the decrypted-to bytes must not simply be the plaintext, i.e.
 *      encryption happened at all.
 */
function decrypt(b64, norm) {
  const raw = Buffer.from(b64, 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', keyFor(norm), raw.subarray(0, 12));
  d.setAuthTag(raw.subarray(raw.length - 16));
  return Buffer.concat([d.update(raw.subarray(12, raw.length - 16)), d.final()]).toString('utf8');
}

const leaks = [];
out.forEach((task, i) => {
  const src = TASK_SOURCE[i];
  const answers = (Array.isArray(src.answer) ? src.answer : [src.answer]).map(String);
  const norms = answers.map(a => (task.match === 'number' ? normaliseNumber(a) : normalise(a)));
  const hint = normalise(task.hint);

  norms.forEach((n, j) => {
    if (n.length > 3 && hint.includes(n)) leaks.push(`${task.id}: the hint contains "${answers[j]}"`);

    if (Buffer.from(task.e[j], 'base64').includes(src.explain))
      leaks.push(`${task.id}: explanation ${j} shipped unencrypted`);

    try {
      if (decrypt(task.e[j], n) !== src.explain)
        leaks.push(`${task.id}: "${answers[j]}" decrypts to the wrong text`);
    } catch (e) {
      leaks.push(`${task.id}: "${answers[j]}" does not decrypt with its own answer`);
    }

    // Distinct answers must not open each other's ciphertext. Equal norms
    // can and do occur ("grey hat" and "greyhat" do not collide, but a
    // number task's "62" and "62.0" both reduce to "62"), and those share a
    // key by construction, so they are not a finding.
    norms.forEach((other, k) => {
      if (k === j || other === n) return;
      try { decrypt(task.e[j], other); leaks.push(`${task.id}: "${answers[k]}" opens "${answers[j]}"`); }
      catch (e) { /* expected: GCM rejects the wrong key */ }
    });
  });
});
if (leaks.length) throw new Error('task answers are not opaque:\n  ' + leaks.join('\n  '));

const byPath = {};
out.forEach(t => { byPath[t.path] = (byPath[t.path] || 0) + 1; });

const file = `/* AUTO-GENERATED by generate-tasks.js — do not hand-edit.

   h[] holds SHA-256 hashes of each accepted answer, normalised.
   e[] holds the explanation, AES-256-GCM encrypted under a key derived
   from the matching answer — so the explanation cannot be read out of this
   file without already knowing the answer. Both arrays are parallel.

   Edit tasks-source.js and run \`npm run build:tasks\`. */

const TASKS = ${JSON.stringify(out)};
`;
fs.writeFileSync(path.join(ROOT, 'tasks.js'), file);

const totalPoints = out.reduce((n, t) => n + t.points, 0);
console.log(`tasks.js written — ${out.length} tasks across ${Object.keys(byPath).length} paths, ` +
  `${totalPoints} points, ${Math.round(Buffer.byteLength(file) / 1024)} KB. ` +
  `No answer recoverable from shipped fields.`);
