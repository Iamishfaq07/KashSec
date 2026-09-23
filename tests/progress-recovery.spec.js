#!/usr/bin/env node
/* Damaged browser state must not blank the site or silently erase recoverable data. */
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const results = [];
const makeContext = async raw => {
  const context = await browser.newContext({acceptDownloads:true, serviceWorkers:'block'});
  await context.addInitScript(value => {
    if(sessionStorage.getItem('recovery-test-seeded')) return;
    sessionStorage.setItem('recovery-test-seeded', '1');
    localStorage.setItem('kashsec_state_v1', value);
  }, raw);
  for(const pattern of ['**://cdn.jsdelivr.net/**', '**://fonts.googleapis.com/**',
    '**://fonts.gstatic.com/**', '**://*.supabase.co/**', '**://pagead2.googlesyndication.com/**'])
    await context.route(pattern, route => route.abort());
  return context;
};

try {
  const damaged = JSON.stringify({
    completed:{'03-linux/terminal-basics':1730000000000},
    quizScores:null,
    theme:'auto-time',
    achievements:{'theme-explorer-seen-dark':true},
    flashcards:{known:null,reviews:{}},
    readingPrefs:null,
    examInProgress:{picks:[],answers:[],endsAt:'broken'},
    examAttempts:[null]
  });
  const context = await makeContext(damaged);
  const page = await context.newPage();
  await page.goto(`${BASE}/lesson/03-linux/`, {waitUntil:'load'});
  await page.locator('#app h1').waitFor();
  const salvaged = await page.evaluate(() => ({
    complete:!!STATE.completed['03-linux/terminal-basics'],
    scores:Object.keys(STATE.quizScores).length,
    flashcards:!!STATE.flashcards.known,
    theme:STATE.theme,
    achievement:STATE.achievements['theme-explorer-seen-dark'],
    exam:STATE.examInProgress,
    attempts:STATE.examAttempts.length,
    backup:localStorage.getItem('kashsec_state_recovery_v1')
  }));
  results.push(['healthy progress survives damaged fields', salvaged.complete &&
    salvaged.scores === 0 && salvaged.flashcards && salvaged.theme === 'auto-time' &&
    salvaged.achievement === true && salvaged.exam === null &&
    salvaged.attempts === 0 && salvaged.backup === damaged]);

  await page.goto(`${BASE}/index.html#/progress`, {waitUntil:'load'});
  await page.locator('#importProgressFile').waitFor({state:'attached'});
  const dialogEvent = page.waitForEvent('dialog');
  const upload = page.locator('#importProgressFile').setInputFiles({
    name:'damaged.json', mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify({completed:{},quizScores:null}))
  });
  const dialog = await dialogEvent;
  const alertText = dialog.message();
  await dialog.accept();
  await upload;
  results.push(['damaged import leaves current progress intact',
    alertText.includes('unreadable progress fields') &&
    await page.evaluate(() => !!STATE.completed['03-linux/terminal-basics'])]);
  await context.close();

  const olderContext = await makeContext(JSON.stringify({
    completed:{'03-linux/terminal-basics':1730000000000},
    flashcards:{known:{legacy:true}},
    readingPrefs:{size:'large'}
  }));
  const olderPage = await olderContext.newPage();
  await olderPage.goto(`${BASE}/`, {waitUntil:'load'});
  results.push(['older state fills new fields without a false recovery warning',
    await olderPage.evaluate(() => STATE.readingPrefs.size === 'large' &&
      STATE.readingPrefs.width === 'normal' && STATE.flashcards.known.legacy === true &&
      !document.querySelector('.state-recovery-notice'))]);
  await olderContext.close();

  const broken = '{broken json';
  const badContext = await makeContext(broken);
  const badPage = await badContext.newPage();
  await badPage.goto(`${BASE}/`, {waitUntil:'load'});
  await badPage.locator('.state-recovery-notice').waitFor();
  const notice = badPage.locator('.state-recovery-notice');
  const downloadEvent = badPage.waitForEvent('download');
  await notice.getByRole('button', {name:'Download original data'}).click();
  const download = await downloadEvent;
  const original = await readFile(await download.path(), 'utf8');
  await badPage.locator('#themeToggle').click(); // overwrite the active state, not its recovery copy
  await badPage.reload({waitUntil:'load'});
  await badPage.goto(`${BASE}/index.html#/progress`, {waitUntil:'load'});
  const backupStillThere = await badPage.evaluate(() =>
    localStorage.getItem('kashsec_state_recovery_v1') === '{broken json');
  results.push(['invalid JSON remains downloadable after normal use', original === broken &&
    backupStillThere && await badPage.locator('#downloadRecoveryBtn').isVisible()]);
  await badContext.close();
} catch(error) {
  results.push(['progress recovery browser flow', false, error.message]);
} finally {
  await browser.close();
}

console.log(`\n  Progress recovery — ${results.length} checks\n`);
for(const [name, passed, detail] of results)
  console.log(`  ${passed ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
const failed = results.filter(([, passed]) => !passed).length;
console.log(`\n  ${results.length - failed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
