#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.dismiss());

  const first = '/lesson/03-linux/terminal-basics.html';
  await page.goto(BASE + first);
  await page.locator('#content h1').waitFor();
  assert.equal(new URL(page.url()).pathname, first, 'direct lesson URL remains canonical');
  await page.reload();
  await page.locator('#content h1').waitFor();
  assert.equal(new URL(page.url()).pathname, first, 'refresh retains canonical URL');

  await page.goto(BASE + '/index.html#/lesson/03-linux/terminal-basics').catch(error => {
    if(!String(error).includes('ERR_ABORTED')) throw error; // legacy route redirects before load
  });
  await page.waitForURL('**' + first);
  await page.locator('#content h1').waitFor();

  const safeHtml = await page.evaluate(() => enrichMarkdown(
    '<img src=x onerror="alert(1)"><a href="javascript:alert(1)">bad</a>' +
    '<svg><foreignObject><script>alert(1)</script></foreignObject></svg>'
  ));
  assert.doesNotMatch(safeHtml, /onerror|javascript:|foreignObject|<script/i);

  await page.goto(BASE + '/labs/webapp.html');
  await page.locator('#xssFrame').waitFor();
  if(await page.locator('#tourSkip').isVisible()) await page.locator('#tourSkip').click();
  await page.evaluate(() => window.postMessage({ type:'kashsec:xss-demo', token:'forged' }, '*'));
  assert.equal(await page.locator('#xssHit').isVisible(), false, 'forged parent message cannot complete lab');
  await page.locator('#xssQuery').fill('<img src=x onerror="alert(1)">');
  await page.locator('#xssForm button[type="submit"]').click();
  await page.locator('#xssHit').waitFor({ state:'visible' });
  assert.deepEqual(errors, [], 'no browser JavaScript errors');

  const offline = await browser.newContext({ serviceWorkers: 'allow' });
  const offlinePage = await offline.newPage();
  await offlinePage.goto(BASE + '/');
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.waitForFunction(() => !!navigator.serviceWorker.controller);
  const offlineLesson = '/lesson/03-linux/users-permissions.html';
  await offlinePage.evaluate(async () => {
    await fetch('/course/03-linux/users-permissions.md');
    for (const name of await caches.keys()) {
      await (await caches.open(name)).delete('/lesson/03-linux/users-permissions.html');
    }
  });
  await offline.setOffline(true);
  await offlinePage.goto(BASE + offlineLesson);
  await offlinePage.locator('#content h1').waitFor();
  assert.equal(new URL(offlinePage.url()).pathname, offlineLesson,
    'uncached canonical lesson URL renders from the offline shell');
  await offline.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(BASE + first);
  assert.ok((await staticPage.locator('#content article').innerText()).length > 300,
    'lesson content is readable without JavaScript');
  await noJs.close();
  console.log('Canonical routing, static content, Markdown sanitization, and lab message checks passed.');
} finally {
  await browser.close();
}
