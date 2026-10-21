#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
let checks = 0;

// Exercise the real sync module and router without a real account or network.
async function makeContext({ signedIn = true, callback = false, delayMerge = false } = {}) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin
    ? route.continue() : route.abort());
  await context.addInitScript(({ signedIn, callback, delayMerge }) => {
    localStorage.setItem('kashsec_state_v1', JSON.stringify({ tourSeen: true }));
    const user = { id: 'navigation-test', email: 'learner@example.test' };
    window.__syncWrites = 0;
    const mergeReady = delayMerge ? new Promise(resolve => { window.__releaseMerge = resolve; }) : Promise.resolve();
    window.supabase = { createClient: () => ({
      auth: {
        getSession: async () => {
          // Supabase consumes callback tokens before notifying the app.
          if(callback) history.replaceState(null, '', location.pathname);
          return { data: { session: signedIn ? { user } : null } };
        },
        onAuthStateChange: listener => { window.__authChange = listener; }
      },
      from: () => ({
        select() { return this; },
        eq() { return this; },
        maybeSingle: async () => {
          window.__mergeStarted = true;
          await mergeReady;
          return { data: { state: { completed: { '03-linux/terminal-basics': 1730000000000 } } } };
        },
        upsert: async () => { window.__syncWrites++; return {}; },
        order() { return this; },
        limit: async () => ({ data: [] })
      })
    }) };
  }, { signedIn, callback, delayMerge });
  return context;
}

async function expectLocation(page, target) {
  const expected = new URL(target, BASE);
  const actual = new URL(page.url());
  assert.equal(actual.pathname + actual.search + actual.hash,
    expected.pathname + expected.search + expected.hash, `navigation retains ${target}`);
  await page.waitForFunction(() => (document.getElementById('app')?.innerText.length || 0) > 100);
  assert.ok((await page.locator('#app').innerText()).length > 100, `${target} renders content`);
  checks++;
}

async function waitForSync(page) {
  await page.waitForFunction(() => window.__syncWrites > 0);
  await page.waitForFunction(() => document.getElementById('accountNavLink')?.textContent === 'learner@example.test');
  assert.equal(await page.evaluate(() => !!STATE.completed['03-linux/terminal-basics']), true,
    'cloud progress still merges');
}

try {
  const context = await makeContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for(const target of ['/', '/index.html', '/lesson/', '/lesson/03-linux/',
    '/lesson/03-linux/terminal-basics.html', '/labs/', '/labs/sqli.html',
    '/tools/', '/tools/jwt.html', '/practice.html', '/exam.html', '/faq.html',
    '/#/glossary', '/#/progress']) {
    await page.goto(BASE + target, { waitUntil: 'load' });
    await waitForSync(page);
    await expectLocation(page, target);
  }

  // Follow real links from My Progress across full-page and hash navigation.
  for(const [href, target] of [['#/course', '/lesson/'],
    ['#/lesson/03-linux', '/lesson/03-linux/'],
    ['#/lesson/03-linux/terminal-basics', '/lesson/03-linux/terminal-basics.html'],
    ['#/labs', '/labs/'], ['#/tools', '/tools/'], ['#/glossary', '/#/glossary']]) {
    const link = page.locator(`a[href="${href}"]`).first();
    await link.click();
    await page.waitForURL(BASE + target);
    await waitForSync(page);
    await expectLocation(page, target);
  }
  await page.reload({ waitUntil: 'load' });
  await waitForSync(page);
  await expectLocation(page, '/#/glossary');
  assert.deepEqual(errors, [], 'signed-in navigation has no JavaScript errors');
  await context.close();

  for(const callback of ['/#access_token=test&refresh_token=test&type=magiclink',
    '/lesson/03-linux/terminal-basics.html?code=test']) {
    const callbackContext = await makeContext({ callback: true });
    const callbackPage = await callbackContext.newPage();
    await callbackPage.goto(BASE + callback, { waitUntil: 'load' });
    await waitForSync(callbackPage);
    await callbackPage.waitForURL(BASE + '/#/progress');
    await expectLocation(callbackPage, '/#/progress');
    await callbackContext.close();
  }

  const delayed = await makeContext({ callback: true, delayMerge: true });
  const delayedPage = await delayed.newPage();
  await delayedPage.goto(BASE + '/#access_token=test');
  await delayedPage.waitForFunction(() => window.__mergeStarted);
  await delayedPage.locator('a[href="#/glossary"]').first().click();
  await delayedPage.waitForURL(BASE + '/#/glossary');
  await delayedPage.evaluate(() => window.__releaseMerge());
  await waitForSync(delayedPage);
  await expectLocation(delayedPage, '/#/glossary');
  await delayed.close();

  const signedOut = await makeContext({ signedIn: false });
  const signedOutPage = await signedOut.newPage();
  await signedOutPage.goto(BASE + '/lesson/03-linux/terminal-basics.html');
  await signedOutPage.locator('#content h1').waitFor();
  await expectLocation(signedOutPage, '/lesson/03-linux/terminal-basics.html');
  await signedOut.close();
  console.log(`Auth navigation: ${checks} checks passed.`);
} finally {
  await browser.close();
}
