#!/usr/bin/env node
/*
 * Practice tasks (#/tasks) — the typed-answer loop.
 *
 * The property that matters most here is negative: an answer must not be
 * recoverable from anything the browser downloads. Hashing the answer field
 * alone did not achieve that, because explanations restate answers and have
 * to ship too — so explanations are encrypted under a key derived from
 * their own answer. These checks pin both halves, plus the ordinary
 * behaviour of solving, rejecting, and persisting.
 *
 *   node tests/tasks.spec.js        (expects a server on :8000)
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const ok = [], bad = [];
const t = (name, pass, detail) => (pass ? ok : bad).push(`${name}${detail ? ` — ${detail}` : ''}`);

const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: 'block' });
await ctx.addInitScript(() => {
  try { const k = 'kashsec_state_v1'; const s = JSON.parse(localStorage.getItem(k) || '{}');
    s.tourDone = true; s.tourSeen = true; localStorage.setItem(k, JSON.stringify(s)); } catch (e) {}
});
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));

await p.goto(`${BASE}/index.html#/tasks`, { waitUntil: 'load' });
await p.waitForTimeout(2500);

t('task cards render', (await p.locator('.task-card').count()) > 0,
  `${await p.locator('.task-card').count()} cards`);
t('a rank bar is shown', (await p.locator('.rank-bar').count()) === 1);
t('per-path navigation is offered', (await p.locator('.task-pathchip').count()) > 5);

/* ---- the shipped file must not contain any answer ---- */
const shipped = await p.evaluate(async base => {
  const txt = await (await fetch(base + '/tasks.js')).text();
  return txt;
}, BASE);
/* Checked per task, not across the whole file. A naive substring search
   produces false positives: the CVSS task's question legitimately contains
   the word "availability" as scenario text, and that happens to be the
   answer to the separate CIA-triad task. The real property is narrower —
   no task may leak ITS OWN answer through its own hint, hash or ciphertext.

   A task's own question is exempt, because some tasks cannot exist without
   showing the material: "read this URL and say where it really goes" has
   to print the URL. */
const shippedTasks = await p.evaluate(src => new Function(src + '; return TASKS;')(), shipped);
const answerProbes = {
  'basics-url-domain': 'verify-account.xyz',
  'intro-cia-missing': 'availability',
  'cloud-metadata-ip': '169.254.169.254',
  'linux-suid-find': '-perm -4000',
  'mobile-apk-extension': 'androidmanifest.xml',
  'ctf-hex-decode': 'flag_found',
  'ctf-base64-decode': 'KashSec{n0t_3ncrypt10n}',
};
const selfLeaks = [];
for (const [id, ans] of Object.entries(answerProbes)) {
  const task = shippedTasks.find(x => x.id === id);
  if (!task) { selfLeaks.push(`${id}: task missing`); continue; }
  const opaque = [task.hint, JSON.stringify(task.h), JSON.stringify(task.e)].join(' ').toLowerCase();
  if (opaque.includes(ans.toLowerCase())) selfLeaks.push(`${id} leaks "${ans}"`);
}
t('no task leaks its own answer through hint, hash or ciphertext',
  selfLeaks.length === 0, selfLeaks.join(', '));

// And the plaintext explanations must be absent entirely — this is the
// property that hashing alone would NOT have given us.
const explainProbes = ['confidentiality is intact', 'is the metadata endpoint',
  'canonical form', 'declares permissions', 'base64 is an encoding'];
const explainLeaks = explainProbes.filter(x => shipped.toLowerCase().includes(x));
t('no explanation ships in clear text', explainLeaks.length === 0, explainLeaks.join('; '));
t('tasks file does ship hashes and ciphertext',
  /"h":\[/.test(shipped) && /"e":\[/.test(shipped));

/* ---- every authored answer must actually verify ----
   The content is hand-written, so the realistic failure is an answer that
   does not match its own hash: a typo, or a normalisation mismatch between
   the generator and the browser. Checking a sample would miss exactly the
   one that is broken, so every task is round-tripped here — hashed in the
   browser, matched, and its explanation decrypted.

   This reads tasks-source.js, which is the answer key and never ships. */
const { TASK_SOURCE } = await import('../tasks-source.js');
const roundTrip = await p.evaluate(async ({ tasks, source }) => {
  const normalise = s => String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/\.$/, '');
  const normaliseNumber = s => {
    const n = Number(String(s).replace(/[, ]/g, ''));
    return Number.isFinite(n) ? String(n) : normalise(s);
  };
  const enc = new TextEncoder();
  const sha = async str => {
    const b = await crypto.subtle.digest('SHA-256', enc.encode(str));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  };
  const decrypt = async (b64, norm) => {
    const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const kb = await crypto.subtle.digest('SHA-256', enc.encode(norm));
    const key = await crypto.subtle.importKey('raw', kb, 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, key, raw.slice(12));
    return new TextDecoder().decode(pt);
  };
  const fails = [];
  let checked = 0;
  for (const src of source) {
    const task = tasks.find(t => t.id === src.id);
    if (!task) { fails.push(`${src.id}: not in shipped file`); continue; }
    const answers = Array.isArray(src.answer) ? src.answer : [src.answer];
    for (const a of answers) {
      const norm = task.match === 'number' ? normaliseNumber(a) : normalise(a);
      const idx = task.h.indexOf(await sha(norm));
      if (idx === -1) { fails.push(`${src.id}: "${a}" does not verify`); continue; }
      try {
        const text = await decrypt(task.e[idx], norm);
        if (text !== src.explain) fails.push(`${src.id}: "${a}" decrypted the wrong text`);
      } catch (e) { fails.push(`${src.id}: "${a}" failed to decrypt`); }
      checked++;
    }
  }
  return { checked, fails };
}, { tasks: shippedTasks, source: TASK_SOURCE.map(t => ({ id: t.id, answer: t.answer, explain: t.explain })) });

t(`every authored answer verifies and decrypts (${roundTrip.checked} answer variants)`,
  roundTrip.fails.length === 0,
  roundTrip.fails.slice(0, 6).join('; '));

/* Every path should offer real practice, not one token task. */
const perPath = {};
shippedTasks.forEach(x => { perPath[x.path] = (perPath[x.path] || 0) + 1; });
const thin = Object.entries(perPath).filter(([, n]) => n < 4).map(([k, n]) => `${k}=${n}`);
t('every path with tasks has at least 4', thin.length === 0, thin.join(', '));

/* ---- solving ---- */
async function answer(taskId, text) {
  const card = p.locator(`.task-card[data-task="${taskId}"]`);
  await card.locator('.task-input').fill(text);
  await card.locator('button[type=submit]').click();
  await p.waitForTimeout(700);
  return {
    feedback: (await card.locator('.task-feedback').textContent() || '').trim(),
    solved: await card.evaluate(el => el.classList.contains('is-solved')),
    explain: await card.locator('.task-explain').evaluate(el => el.hidden ? '' : el.textContent).catch(() => ''),
  };
}

const wrong = await answer('intro-cia-missing', 'confidentiality');
t('a wrong answer is rejected', !wrong.solved && /not quite/i.test(wrong.feedback), wrong.feedback);
t('a wrong answer reveals no explanation', wrong.explain === '');

const right = await answer('intro-cia-missing', 'Availability.');
t('a correct answer is accepted despite case and a full stop', right.solved, right.feedback);
t('points are awarded on first solve', /\+\d+ pts/.test(right.feedback), right.feedback);
t('the explanation decrypts and appears', right.explain.length > 60, `${right.explain.length} chars`);
t('the explanation is the real teaching text',
  /confidentiality is intact/i.test(right.explain), right.explain.slice(0, 80));

const num = await answer('net-usable-hosts', ' 62 ');
t('a numeric answer tolerates surrounding whitespace', num.solved, num.feedback);

const contains = await answer('linux-suid-find', 'find / -perm -4000 -type f 2>/dev/null');
t('a "contains" task matches the fragment inside a full command', contains.solved, contains.feedback);

/* ---- persistence + scoring ---- */
const before = await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('kashsec_state_v1'));
  return Object.keys(s.tasksSolved || {}).length;
});
t('solved tasks are persisted', before === 3, `${before} stored`);

await p.reload({ waitUntil: 'load' });
await p.waitForTimeout(2500);
t('solved tasks stay solved after a reload',
  (await p.locator('.task-card.is-solved').count()) === 3);
t('a solved task cannot be re-submitted',
  await p.locator('.task-card.is-solved .task-input').first().isDisabled());

const rank = await p.locator('.rank-score').textContent();
t('the rank bar counts the solved tasks', /3\/\d+ tasks solved/.test(rank || ''), rank);

/* ---- per-path view ---- */
await p.goto(`${BASE}/index.html#/tasks/02-networking`, { waitUntil: 'load' });
await p.waitForTimeout(2500);
const scoped = await p.locator('.task-card').count();
t('a per-path view shows only that path\'s tasks', scoped > 0 && scoped < 10, `${scoped} cards`);

console.log(`\n  Practice tasks — ${ok.length + bad.length} checks\n`);
ok.forEach(n => console.log(`  ✓ ${n}`));
bad.forEach(n => console.log(`  ✗ ${n}`));
console.log(`\n  ${ok.length} passed, ${bad.length} failed`);
console.log(`  JS errors: ${errs.length ? errs.join(' | ') : 'none'}\n`);
await br.close();
process.exit(bad.length || errs.length ? 1 : 0);
