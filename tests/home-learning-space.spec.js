#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
try {
  for (const [theme, width] of [['light', 1280], ['dark', 320]]) {
    const context = await browser.newContext({viewport:{width,height:900}, colorScheme:theme, reducedMotion:'reduce', serviceWorkers:'block'});
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
    await context.addInitScript(() => localStorage.setItem('kashsec_state_v1', JSON.stringify({tourSeen:true})));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(BASE + '/');
    await page.locator('#homeSessionPick a').first().waitFor();
    assert.equal(await page.locator('[data-session="learn"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#homeSessionPick a').first().getAttribute('href'), '#/lesson/01-introduction/what-is-cybersecurity');
    assert.match(await page.locator('#homeSessionPick .home-session-daily').getAttribute('href'), /^#\/lesson\//);
    await page.locator('[data-session="practice"]').click();
    assert.equal(await page.locator('[data-session="learn"]').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('[data-session="practice"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#homeSessionPick a').getAttribute('href'), '#/labs/phishing');
    await page.locator('[data-session="review"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-session="review"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#homeSessionPick a').getAttribute('href'), '#/review');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} ${width}px fits viewport`);
    assert.ok(await page.locator('.home-session').evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), `${theme} ${width}px keeps the activity panel visible after focus`);
    await page.locator('#homeSessionPick a').click();
    await page.waitForURL('**/#/review');
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await browser.newContext({serviceWorkers:'block', reducedMotion:'reduce'});
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
  await context.addInitScript(() => localStorage.setItem('kashsec_state_v1', JSON.stringify({
    tourSeen:true,
    completed:{'01-introduction/what-is-cybersecurity':1700000000000},
    lastVisited:{pathId:'01-introduction',subId:'what-is-cybersecurity',ts:1700000000000}
  })));
  const page = await context.newPage();
  await page.goto(BASE + '/');
  assert.match(await page.locator('.home-session-progress').innerText(), /1 of 491 lessons completed/);
  assert.equal(await page.locator('#homeSessionPick a').first().getAttribute('href'), '#/lesson/01-introduction/what-is-cybersecurity');
  assert.match(await page.locator('#homeSessionPick').innerText(), /PICK UP WHERE YOU LEFT OFF/i);
  assert.equal(await page.locator('.home-hero-copy .btn-amber').getAttribute('href'), '#/lesson/01-introduction/what-is-cybersecurity');
  await page.locator('.home-hero-copy .btn-amber').click();
  await page.waitForURL('**/lesson/01-introduction/what-is-cybersecurity.html');
  await context.close();
  console.log('PASS: home activity choices, keyboard interaction, navigation, progress, resume, and responsive layouts.');
} finally { await browser.close(); }
