#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
async function makeContext(serviceWorkers = 'block') {
  const context = await browser.newContext({serviceWorkers});
  context.setDefaultTimeout(10000);
  await context.route('**/*', r=>new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
  await context.addInitScript(()=>{
    const state = JSON.parse(localStorage.getItem('kashsec_state_v1') || '{}');
    state.tourSeen = true;
    localStorage.setItem('kashsec_state_v1', JSON.stringify(state));
    window.__documentToken = Math.random();
  });
  return context;
}
try {
  const context = await makeContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e=>errors.push(e.message));
  let documents = 0;
  page.on('request', r=>{ if(r.isNavigationRequest() && r.frame() === page.mainFrame()) documents++; });
  await page.goto(BASE + '/lesson/');
  const token = await page.evaluate(()=>window.__documentToken);
  async function expectSingleNavigation(action, target) {
    const before = await page.evaluate(()=>renderGeneration);
    await action();
    await page.waitForURL(BASE + target);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    check(await page.evaluate(()=>renderGeneration) === before + 1, `${target} renders exactly once`);
    check(await page.evaluate(()=>window.__documentToken) === token && documents === 1,
      `${target} retains the document without reloading`);
  }
  async function click(href) {
    const link = page.locator(`a[href="${href}"]`).first();
    if(!await link.isVisible()) await page.locator('#hamb').click();
    await link.click();
  }
  await expectSingleNavigation(()=>click('#/lesson/03-linux'), '/lesson/03-linux/');
  await expectSingleNavigation(()=>click('#/lesson/03-linux/terminal-basics'), '/lesson/03-linux/terminal-basics.html');
  await page.locator('#content .code-win').first().waitFor();
  check(/terminal/i.test(await page.title()), 'lesson title follows soft navigation');
  check(await page.locator('link[rel="canonical"]').getAttribute('href') === BASE + '/lesson/03-linux/terminal-basics.html',
    'canonical metadata follows soft navigation');
  await expectSingleNavigation(()=>click('#/labs'), '/labs/');
  await expectSingleNavigation(async()=>{
    await page.evaluate(()=>{
      const link = document.createElement('a');
      link.id = 'nativeToolLink'; link.href = '/tools/jwt.html'; link.textContent = 'Open JWT tool';
      document.getElementById('app').appendChild(link);
    });
    await page.locator('#nativeToolLink').click();
  }, '/tools/jwt.html');
  check(/JWT/i.test(await page.title()), 'tool title follows a native canonical link');
  await expectSingleNavigation(()=>page.evaluate(()=>{ location.hash = '#/glossary'; }), '/#/glossary');
  await page.locator('#glossarySearch').waitFor();
  await expectSingleNavigation(()=>page.goBack(), '/tools/jwt.html');
  await expectSingleNavigation(()=>page.goForward(), '/#/glossary');
  await page.locator('#glossarySearch').fill('hashing');
  const beforeSame = await page.evaluate(()=>renderGeneration);
  await click('#/glossary');
  check(await page.evaluate(()=>renderGeneration) === beforeSame &&
    await page.locator('#glossarySearch').inputValue() === 'hashing', 'clicking the current route preserves its form and does not render again');
  await page.locator('.skip').focus();
  await page.keyboard.press('Enter');
  check(await page.evaluate(()=>document.activeElement === document.getElementById('app')) &&
    page.url() === BASE + '/#/glossary' && documents === 1, 'skip link focuses content without navigating home');

  const popupEvent = context.waitForEvent('page');
  await page.locator('a[href="#/labs"]').first().click({modifiers:['Control']});
  const popup = await popupEvent;
  await popup.waitForLoadState();
  check(page.url() === BASE + '/#/glossary' && await page.evaluate(()=>window.__documentToken) === token,
    'Ctrl-click opens a separate tab without rerouting this one');
  await popup.close();

  let pendingTasks;
  await page.route('**/tasks.js', r=>{ pendingTasks = r; }, {times:1});
  await expectSingleNavigation(()=>click('#/tasks'), '/practice.html');
  await page.waitForFunction(()=>typeof TASKS === 'undefined');
  await expectSingleNavigation(()=>click('#/labs'), '/labs/');
  assert.ok(pendingTasks, 'practice bundle request was held');
  await pendingTasks.fulfill({response:await pendingTasks.fetch()});
  await page.waitForFunction(()=>typeof TASKS !== 'undefined');
  check(await page.locator('.lab-card').count() > 0 && await page.locator('.task-card').count() === 0,
    'late practice loading cannot replace the page selected afterward');
  await expectSingleNavigation(()=>click('#/privacy'), '/privacy.html');
  check(/Privacy/i.test(await page.title()), 'legal pages keep their canonical URL and title');
  assert.deepEqual(errors, [], 'soft navigation has no JavaScript errors');

  const legacy = await context.newPage();
  let legacyDocuments = 0;
  legacy.on('request', r=>{ if(r.isNavigationRequest() && r.frame() === legacy.mainFrame()) legacyDocuments++; });
  await legacy.goto(BASE + '/index.html#/lesson/03-linux/terminal-basics');
  await legacy.waitForURL(BASE + '/lesson/03-linux/terminal-basics.html');
  check(legacyDocuments === 1 && await legacy.evaluate(()=>renderGeneration) === 1,
    'legacy lesson URLs canonicalize without a second document load or render');
  await context.close();

  const offline = await makeContext('allow');
  const offlinePage = await offline.newPage();
  let installDocuments = 0;
  offlinePage.on('request', r=>{ if(r.isNavigationRequest() && r.frame() === offlinePage.mainFrame()) installDocuments++; });
  await offlinePage.goto(BASE + '/');
  await offlinePage.evaluate(()=>navigator.serviceWorker.ready);
  await offlinePage.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await offlinePage.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  check(installDocuments === 1, 'first offline-worker installation does not reload the page');
  await offline.close();

  const update = await makeContext();
  await update.addInitScript(()=>{
    const sw = new EventTarget();
    const reg = new EventTarget();
    reg.waiting = {postMessage:()=>{
      sw.dispatchEvent(new Event('controllerchange'));
      sw.dispatchEvent(new Event('controllerchange'));
    }};
    sw.controller = {};
    sw.register = async()=>reg;
    Object.defineProperty(navigator, 'serviceWorker', {value:sw});
    window.__updateReg = reg;
  });
  const updatePage = await update.newPage();
  let updateDocuments = 0;
  updatePage.on('request', r=>{ if(r.isNavigationRequest() && r.frame() === updatePage.mainFrame()) updateDocuments++; });
  await updatePage.goto(BASE + '/');
  await updatePage.evaluate(()=>navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
  check(updateDocuments === 1, 'background worker changes do not refresh active work');
  await updatePage.evaluate(()=>showUpdateToast(window.__updateReg));
  const reloaded = updatePage.waitForEvent('load');
  await updatePage.locator('.toast-btn').click();
  await reloaded;
  check(updateDocuments === 2, 'accepting an offline update reloads exactly once');
  await update.close();
  console.log(`Refresh-free navigation: ${checks} checks passed.`);
} finally {await browser.close();}
