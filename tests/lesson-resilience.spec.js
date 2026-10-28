#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const lesson = '/lesson/03-linux/terminal-basics.html';
const markdown = '**/course/03-linux/terminal-basics.md';
const key = '03-linux/terminal-basics';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
const results = [];
async function test(name, run) {
  const context = await browser.newContext({serviceWorkers:'block'});
  context.setDefaultTimeout(5000);
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin
    ? route.continue() : route.abort());
  await context.addInitScript(() => {
    const state = JSON.parse(localStorage.getItem('kashsec_state_v1') || '{}');
    state.tourSeen = true;
    localStorage.setItem('kashsec_state_v1', JSON.stringify(state));
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await run(page, context);
    assert.deepEqual(errors, [], 'no browser JavaScript errors');
    results.push([name,true]);
  } catch(error) { results.push([name,false,error.message]); }
  finally { await context.close(); }
}

try {
  await test('notes survive immediate canonical navigation', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#lessonNotes').waitFor({state:'attached'});
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = 'Remember: pipes connect command output to input.';
      notes.dispatchEvent(new Event('input',{bubbles:true}));
      location.assign('/lesson/03-linux/users-permissions.html');
    });
    await page.waitForURL('**/users-permissions.html');
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem('kashsec_state_v1')).notes[key], key),
      'Remember: pipes connect command output to input.');
  });

  await test('notes survive an immediate refresh and clearing them persists', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#lessonNotes').waitFor({state:'attached'});
    const reloaded = page.waitForEvent('load');
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = 'A note saved before refresh';
      notes.dispatchEvent(new Event('input',{bubbles:true}));
      location.reload();
    });
    await reloaded;
    await page.waitForFunction(() => document.getElementById('lessonNotes')?.value === 'A note saved before refresh');
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = '';
      notes.dispatchEvent(new Event('input',{bubbles:true}));
      location.assign('/lesson/');
    });
    await page.waitForURL('**/lesson/');
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem('kashsec_state_v1')).notes[key], key), undefined);
  });

  await test('notes survive in-page rerendering', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#lessonNotes').waitFor({state:'attached'});
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = 'Keep this when the session rerenders the page';
      notes.dispatchEvent(new Event('input',{bubbles:true}));
      route();
    });
    assert.equal(await page.locator('#lessonNotes').inputValue(), 'Keep this when the session rerenders the page');
  });

  await test('backgrounding flushes pending notes', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#lessonNotes').waitFor({state:'attached'});
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = 'Save before the browser is suspended';
      notes.dispatchEvent(new Event('input',{bubbles:true}));
      Object.defineProperty(document, 'visibilityState', {configurable:true,get:()=> 'hidden'});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem('kashsec_state_v1')).notes[key], key),
      'Save before the browser is suspended');
  });

  await test('notes autosave while staying in the lesson', async page => {
    await page.goto(BASE + lesson);
    await page.locator('.notes-panel summary').click();
    await page.locator('#lessonNotes').fill('Save after typing stops');
    await page.waitForFunction(key => JSON.parse(localStorage.getItem('kashsec_state_v1')).notes[key] ===
      'Save after typing stops', key);
    assert.equal(await page.locator('#notesStatus').innerText(), 'Saved');
  });

  await test('failed Markdown keeps static lesson text and retries without resetting notes', async page => {
    await page.route(markdown, route => route.fulfill({status:503,body:'temporarily unavailable'}), {times:1});
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.ok((await page.locator('#content article').innerText()).length > 800);
    assert.doesNotMatch(await page.locator('#content').innerText(), /Coming soon|hasn't been written/);
    await page.locator('.notes-panel summary').click();
    await page.locator('#lessonNotes').fill('Retain notes while retrying');
    await page.locator('#retryLesson').click();
    await page.locator('#retryLesson').waitFor({state:'detached'});
    await page.locator('#content .code-win').first().waitFor();
    assert.equal(await page.locator('#lessonNotes').inputValue(), 'Retain notes while retrying');
    assert.equal(await page.locator('.read-time').count(), 1);
  });

  await test('renderer failure retains readable text and a working retry', async page => {
    await page.route('**/vendor/marked.min.js', route => route.abort(), {times:1});
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.ok((await page.locator('#content article').innerText()).length > 800);
    await page.locator('#retryLesson').click();
    await page.locator('#content .code-win').first().waitFor();
  });

  await test('fallback tables scroll within a narrow screen and remain keyboard-accessible', async page => {
    await page.setViewportSize({width:390,height:844});
    await page.route(markdown, route => route.abort());
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.ok(await page.locator('#content article .table-scroll[tabindex="0"]').count() > 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  });

  await test('a stalled request times out, keeps readable text, and retries', async page => {
    await page.clock.install();
    let stalled;
    await page.route(markdown, route => { stalled = route; }, {times:1});
    const requested = page.waitForRequest(/\/course\/03-linux\/terminal-basics\.md$/);
    await page.goto(BASE + lesson);
    await requested;
    assert.ok((await page.locator('#content article').innerText()).length > 800,
      'text remains readable while the Markdown request is pending');
    await page.clock.fastForward(16000);
    await page.locator('#retryLesson').waitFor();
    assert.match(await page.locator('.lesson-load-notice').innerText(), /too long/);
    assert.ok((await page.locator('#content article').innerText()).length > 800);
    await stalled.abort().catch(()=>{}); // the browser has already aborted the request
    await page.locator('#retryLesson').click();
    await page.locator('#content .code-win').first().waitFor();
  });

  await test('a same-page rerender retains the original fallback', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#content .code-win').first().waitFor();
    await page.route(markdown, route => route.abort(), {times:1});
    await page.evaluate(() => route());
    await page.locator('#retryLesson').waitFor();
    assert.ok((await page.locator('#content article').innerText()).length > 800);
    assert.doesNotMatch(await page.locator('#content').innerText(), /Coming soon/);
  });

  await test('app shell without lesson text explains a failed load and can recover', async page => {
    // An offline shell has no prerendered article to fall back to.
    await page.route('**/lesson/03-linux/terminal-basics.html', async route => {
      const response = await page.request.get(BASE + '/index.html');
      await route.fulfill({status:200,contentType:'text/html',body:await response.text()});
    });
    await page.route(markdown, route => route.abort(), {times:1});
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.equal(await page.locator('#content article').count(), 0);
    assert.match(await page.locator('#content').innerText(), /connection|offline/i);
    assert.doesNotMatch(await page.locator('#content').innerText(), /Coming soon|hasn't been written/);
    await page.locator('#retryLesson').click();
    await page.locator('#content .code-win').first().waitFor();
  });
  await test('a failed sanitizer can be retried without showing unsafe HTML', async page => {
    await page.route('**/vendor/purify.min.js', route => route.abort(), {times:2});
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.ok((await page.locator('#content article').innerText()).length > 800);
    await page.locator('#retryLesson').click();
    await page.locator('#content .code-win').first().waitFor();
  });

  await test('an HTML error page returned with status 200 is not rendered as a lesson', async page => {
    await page.route(markdown, route => route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body>Hosting error</body></html>'}), {times:1});
    await page.goto(BASE + lesson);
    await page.locator('#retryLesson').waitFor();
    assert.doesNotMatch(await page.locator('#content').innerText(), /Hosting error/);
    await page.locator('#retryLesson').click();
    await page.locator('#content .code-win').first().waitFor();
  });

  await test('finish and continue saves completion and notes before advancing', async page => {
    await page.goto(BASE + lesson);
    await page.locator('#content .code-win').first().waitFor();
    await page.evaluate(() => {
      const notes = document.getElementById('lessonNotes');
      notes.value = 'A pipe connects two commands.';
      notes.dispatchEvent(new Event('input', {bubbles:true}));
      document.getElementById('finishAndContinue').click();
    });
    await page.waitForURL('**/linux-filesystem-hierarchy.html');
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('kashsec_state_v1')));
    assert.equal(state.notes[key], 'A pipe connects two commands.');
    assert.ok(state.completed[key]);
  });

  await test('tall code blocks become visible on small screens', async page => {
    await page.setViewportSize({width:390,height:640});
    await page.goto(BASE + lesson);
    await page.locator('#content .code-win').first().waitFor();
    await page.evaluate(() => {
      const block = document.createElement('pre');
      block.id = 'tallBlock';
      block.style.height = '30000px';
      block.textContent = 'Long sample';
      document.getElementById('content').appendChild(block);
      animateLessonBlocks(document.getElementById('content'));
      block.scrollIntoView({behavior:'instant',block:'start'});
    });
    await page.waitForFunction(() => document.getElementById('tallBlock').classList.contains('blk-in'));
  });

} finally { await browser.close(); }

for(const [name, passed, detail] of results) console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? ': '+detail : ''}`);
const failed = results.filter(([,passed])=>!passed).length;
console.log(`Lesson resilience: ${results.length - failed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);
