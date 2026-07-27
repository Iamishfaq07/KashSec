#!/usr/bin/env node
/*
 * Timed mock exam (#/exam).
 *
 * The path quizzes reveal the answer as soon as you pick one; the exam must
 * not. These checks pin the behaviours that separate the two — nothing
 * graded before submit, a paper that survives a refresh, an expired clock
 * that submits rather than resumes — plus the wiring into the existing
 * spaced-repetition queue.
 *
 * Written test-first against the real UI, and it earned its keep: it caught
 * that "Sit another paper" was a dead link, because the result view renders
 * *at* #/exam, so an anchor to #/exam is a same-hash no-op.
 *
 *   node tests/exam.spec.js        (expects a server on :8000)
 */
import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://127.0.0.1:8000';

const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: 'block' });
await ctx.addInitScript(() => {
  try { const k = 'kashsec_state_v1'; const s = JSON.parse(localStorage.getItem(k) || '{}');
    s.tourDone = true; s.tourSeen = true; localStorage.setItem(k, JSON.stringify(s)); } catch (e) {}
});
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
p.on('dialog', d => d.accept());
const ok = [], bad = [];
const t = (name, pass, detail) => (pass ? ok : bad).push(`${name}${detail ? ` — ${detail}` : ''}`);

await p.goto(`${BASE}/index.html#/exam`, { waitUntil: 'load' });
await p.waitForTimeout(2000);
t('three presets offered', await p.locator('.exam-preset').count() === 3);

await p.locator('[data-preset="sprint"]').click();
await p.waitForTimeout(800);
const paper = await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('kashsec_state_v1')).examInProgress;
  return { n: s.picks.length,
    paths: new Set(s.picks.map(x => x.pathId)).size,
    dupes: s.picks.length - new Set(s.picks.map(x => x.pathId + '#' + x.index)).size };
});
t('paper has exactly 20 questions', paper.n === 20, `${paper.n}`);
t('no duplicate questions', paper.dupes === 0, `${paper.dupes} dupes`);
t('spread across many paths', paper.paths >= 15, `${paper.paths} paths`);
t('clock starts at 15:00', (await p.locator('#examClock').textContent()) === '15:00');
t('navigator has one cell per question', await p.locator('.exam-cell').count() === 20);
t('no correctness revealed before submit',
  await p.evaluate(() => document.querySelectorAll('.quiz-opt.correct,.quiz-opt.wrong,.quiz-explain').length) === 0);

for (let i = 0; i < paper.n; i++) {
  await p.locator(`[data-jump="${i}"]`).click(); await p.waitForTimeout(45);
  await p.locator('.quiz-opt').first().click(); await p.waitForTimeout(45);
}
t('all questions answered', await p.evaluate(() =>
  JSON.parse(localStorage.getItem('kashsec_state_v1')).examInProgress.answers.filter(a => a !== null).length) === 20);

await p.locator('[data-jump="2"]').click(); await p.waitForTimeout(80);
await p.locator('#examFlagBtn').click(); await p.waitForTimeout(150);
await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1800);
const resumed = await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('kashsec_state_v1')).examInProgress;
  return s ? { a: s.answers.filter(x => x !== null).length, f: (s.flags || []).length } : null;
});
t('refresh resumes the paper', await p.locator('#examClock').count() === 1);
t('answers survive refresh', resumed && resumed.a === 20, JSON.stringify(resumed));
t('flags survive refresh', resumed && resumed.f === 1);

await p.locator('#examSubmitBtn').click();
await p.waitForTimeout(1400);
const res = await p.evaluate(() => {
  const st = JSON.parse(localStorage.getItem('kashsec_state_v1'));
  return { pathRows: document.querySelectorAll('.exam-table tbody tr').length,
    missedItems: document.querySelectorAll('.exam-missed-item').length,
    cleared: st.examInProgress === null,
    attempts: (st.examAttempts || []).length,
    queue: Object.keys(st.missedQuestions || {}).length,
    score: document.querySelectorAll('.exam-score').length };
});
t('per-path breakdown rendered', res.pathRows > 0, `${res.pathRows} rows`);
t('missed questions listed with explanations', res.missedItems > 0, `${res.missedItems}`);
t('in-progress attempt cleared on submit', res.cleared);
t('attempt saved to history', res.attempts === 1);
t('wrong answers fed the spaced-repetition queue', res.queue > 0, `${res.queue} queued`);
t('score bar rendered', res.score === 1);

// The bug the first run caught: this button sits at #/exam, so an anchor
// to #/exam would be a no-op.
await p.locator('#examAgainBtn').click(); await p.waitForTimeout(700);
t('"Sit another paper" returns to the start screen', await p.locator('.exam-preset').count() === 3);
t('history table now shows the attempt', await p.locator('[data-review]').count() === 1);
await p.locator('[data-review]').first().click(); await p.waitForTimeout(700);
t('reviewing a past attempt reopens its result', await p.locator('.exam-score').count() === 1);

// Timer expiry auto-submits.
await p.evaluate(() => {
  const k = 'kashsec_state_v1'; const s = JSON.parse(localStorage.getItem(k));
  s.examInProgress = { preset: 'sprint', picks: [{ pathId: '03-linux', index: 0 }],
    answers: [null], flags: [], qi: 0, startedAt: Date.now() - 1000, endsAt: Date.now() - 1 };
  localStorage.setItem(k, JSON.stringify(s));
});
// Reload straight away: navigating elsewhere first lets that page's
// in-memory STATE (which has no in-progress exam) write back over the seed.
await p.reload({ waitUntil: 'load' });
await p.waitForTimeout(1800);
t('an expired paper is submitted, not resumed', await p.evaluate(() =>
  JSON.parse(localStorage.getItem('kashsec_state_v1')).examInProgress === null));

console.log(`\n  Mock exam — ${ok.length + bad.length} checks\n`);
ok.forEach(n => console.log(`  ✓ ${n}`));
bad.forEach(n => console.log(`  ✗ ${n}`));
console.log(`\n  ${ok.length} passed, ${bad.length} failed`);
console.log(`  JS errors: ${errs.length ? errs.join(' | ') : 'none'}\n`);
await br.close();
process.exit(bad.length || errs.length ? 1 : 0);
