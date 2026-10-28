#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const LESSON_URL='/lesson/03-linux/terminal-basics.html';
const NEXT='/lesson/03-linux/linux-filesystem-hierarchy.html';
const STORE='kashsec_reading_places_v1';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let passed=0;
async function test(name,run,setup){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
  if(setup)await context.addInitScript(setup);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try {await run(page);assert.deepEqual(errors,[]);passed++;console.log('PASS '+name);}finally{await context.close();}
}
async function open(page){await page.goto(BASE+LESSON_URL);await page.locator('#content .code-win').first().waitFor();}
async function pause(page){
  await page.evaluate(()=>{
    const c=document.getElementById('content');const rect=c.getBoundingClientRect();
    window.scrollTo({top:scrollY+rect.top+rect.height*.4,behavior:'instant'});
  });
  await page.waitForFunction(store=>!!JSON.parse(localStorage.getItem(store)||'{}')['03-linux/terminal-basics'],STORE);
  return page.evaluate(()=>scrollY);
}
try{
  await test('progress follows the article rather than notes and footer',async page=>{
    await open(page);
    await page.evaluate(()=>window.scrollTo({top:scrollY+document.getElementById('content').getBoundingClientRect().bottom-innerHeight+100,behavior:'instant'}));
    await page.waitForFunction(()=>Number(document.getElementById('rprog').getAttribute('aria-valuenow'))>=99);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight-scrollY>200));
  });
  await test('a reading place survives refresh and resumes only when requested',async page=>{
    await open(page);const previous=await pause(page);await page.reload();
    await page.locator('#resumeReading').waitFor();
    assert.ok(await page.evaluate(()=>scrollY<100),'no automatic jump');
    await page.locator('#resumeReading').click();
    await page.waitForFunction(y=>Math.abs(scrollY-y)<150,previous);
    assert.ok(await page.evaluate(()=>/^H[12]$/.test(document.activeElement.tagName)),'resume moves focus to the current section');
  });
  await test('start from top clears the saved place',async page=>{
    await open(page);await pause(page);await page.reload();
    await page.locator('#restartReading').click();
    assert.equal(await page.evaluate(store=>JSON.parse(localStorage.getItem(store)||'{}')['03-linux/terminal-basics'],STORE),undefined);
    await page.reload();await page.locator('#content .code-win').first().waitFor();
    assert.equal(await page.locator('#resumeReading').count(),0);
  });
  await test('completing a lesson clears its reading hint',async page=>{
    await open(page);await pause(page);await page.reload();await page.locator('#resumeReading').waitFor();await page.locator('#completeBtn').click();
    assert.equal(await page.locator('#resumeReading').count(),0);
    assert.equal(await page.evaluate(store=>JSON.parse(localStorage.getItem(store)||'{}')['03-linux/terminal-basics'],STORE),undefined);
    await page.reload();await page.locator('#content .code-win').first().waitFor();
    assert.equal(await page.locator('#resumeReading').count(),0);
  });
  await test('damaged or unavailable reading storage does not block lessons',async page=>{
    await open(page);await page.evaluate(()=>window.scrollTo({top:2500,behavior:'instant'}));
    await page.locator('#finishAndContinue').click();await page.waitForURL('**'+NEXT);
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.ok((await page.locator('#content').innerText()).length>800);
  },()=>{
    const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
    Storage.prototype.getItem=function(k){return k==='kashsec_reading_places_v1'?'bad JSON':get.call(this,k);};
    Storage.prototype.setItem=function(k,v){if(k==='kashsec_reading_places_v1')throw new DOMException('blocked','QuotaExceededError');return set.call(this,k,v);};
  });
  await test('next-lesson intent warms one file and navigation reuses it',async page=>{
    let requests=0;page.on('request',r=>{if(r.url().endsWith('/course/03-linux/linux-filesystem-hierarchy.md'))requests++;});
    await open(page);assert.equal(requests,0,'no speculative download on opening a lesson');
    const response=page.waitForResponse(r=>r.url().endsWith('/course/03-linux/linux-filesystem-hierarchy.md'));
    await page.locator('#finishAndContinue').hover();await response;
    await page.locator('#finishAndContinue').click();await page.waitForURL('**'+NEXT);
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.equal(requests,1,'the warmed Markdown is consumed without a duplicate request');
    assert.match(await page.locator('#content h1').innerText(),/filesystem/i);
  },()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,effectiveType:'4g'}}));

  await test('a bad prefetched response is discarded and navigation loads fresh text',async page=>{
    await page.route('**/course/03-linux/linux-filesystem-hierarchy.md',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html>Hosting error</html>'}),{times:1});
    await open(page);
    const response=page.waitForResponse(r=>r.url().endsWith('/course/03-linux/linux-filesystem-hierarchy.md'));
    await page.locator('#finishAndContinue').hover();await response;
    await page.locator('#finishAndContinue').click();await page.waitForURL('**'+NEXT);
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content h1').innerText(),/filesystem/i);
    assert.equal(await page.locator('#retryLesson').count(),0);
    assert.doesNotMatch(await page.locator('#content').innerText(),/Hosting error/);
  },()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,effectiveType:'4g'}}));
  for(const mode of ['save-data','slow'])await test(`${mode} connections skip speculative downloads`,async page=>{
    let requests=0;page.on('request',r=>{if(r.url().endsWith('/course/03-linux/linux-filesystem-hierarchy.md'))requests++;});
    await open(page);await page.locator('#finishAndContinue').hover();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(requests,0);
    await page.locator('#finishAndContinue').click();await page.waitForURL('**'+NEXT);
    await page.locator('#content[aria-busy="false"]').waitFor();assert.equal(requests,1,'required navigation still works');
  },mode==='save-data'?()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,effectiveType:'4g'}}):()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,effectiveType:'2g'}}));

  await test('resume controls fit a narrow phone and keep touch targets usable',async page=>{
    await page.setViewportSize({width:390,height:844});await open(page);await pause(page);await page.reload();
    await page.locator('#resumeReading').waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const sizes=await page.locator('.reader-resume button').evaluateAll(buttons=>buttons.map(b=>b.getBoundingClientRect().height));
    assert.ok(sizes.every(height=>height>=44));
    await page.screenshot({path:'/tmp/kashsec-reader-mobile.png'});
  },()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,theme:'light'})));
  await test('an outdated reading hint is not applied to changed lesson text',async page=>{
    await open(page);await pause(page);
    await page.evaluate(store=>{const places=JSON.parse(localStorage.getItem(store));places['03-linux/terminal-basics'].hash='old-version';localStorage.setItem(store,JSON.stringify(places));},STORE);
    // Leave at the top, so the departure flush does not replace the seeded old hash.
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.reload();await page.locator('#content .code-win').first().waitFor();
    assert.equal(await page.locator('#resumeReading').count(),0);
  });

  await test('notes do not claim to be saved when browser storage fails',async page=>{
    await open(page);
    await page.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kashsec_state_v1')throw new DOMException('blocked','QuotaExceededError');return set.call(this,k,v);};});
    await page.locator('.notes-panel summary').click();
    await page.locator('#lessonNotes').fill('Keep this note visible even when saving fails.');
    await page.waitForFunction(()=>document.getElementById('notesStatus').textContent.includes('Could not save'));
    assert.equal(await page.locator('#lessonNotes').inputValue(),'Keep this note visible even when saving fails.');
  });

  await test('phone contents start compact and section links move keyboard focus',async page=>{
    await page.setViewportSize({width:390,height:844});await open(page);
    assert.equal(await page.locator('.toc details').getAttribute('open'),null);
    await page.locator('.toc summary').focus();await page.keyboard.press('Enter');
    assert.notEqual(await page.locator('.toc details').getAttribute('open'),null);
    const link=page.locator('.toc a').nth(3);const target=(await link.getAttribute('href')).slice(1);
    await link.focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.toc details').getAttribute('open'),null);
    assert.equal(await page.evaluate(()=>document.activeElement.id),target);
    assert.ok(await page.evaluate(id=>document.getElementById(id).getBoundingClientRect().top<innerHeight,target));
  });

  await test('sidebar builds other paths on demand without losing their lesson links',async page=>{
    await open(page);
    assert.ok(await page.locator('#sbNav a').count()<100,'collapsed paths do not create hundreds of unused links');
    const group=page.locator('.sb-path[data-pid="02-networking"]');
    assert.equal(await group.locator('.sb-sublist a').count(),0);
    await group.locator('.sb-path-head').click();
    const expected=await page.evaluate(()=>PATHS.find(p=>p.id==='02-networking').subs.length+1);
    assert.equal(await group.locator('.sb-sublist a').count(),expected);
    await group.locator('.sb-path-head').click();await group.locator('.sb-path-head').click();
    assert.equal(await group.locator('.sb-sublist a').count(),expected,'reopening does not duplicate links');
    await group.locator('a[href="#/lesson/02-networking/dns"]').click();
    await page.waitForURL('**/lesson/02-networking/dns.html');
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content h1').innerText(),/DNS/);
  });

  await test('a failed next lesson never shows the previous lesson as its fallback',async page=>{
    await page.route('**/course/03-linux/terminal-basics.md',r=>r.abort());
    await page.route('**/course/03-linux/linux-filesystem-hierarchy.md',r=>r.abort(),{times:1});
    await page.goto(BASE+LESSON_URL);await page.locator('#retryLesson').waitFor();
    assert.match(await page.locator('#content article h1').innerText(),/terminal/i);
    await page.evaluate(()=>navigateTo('#/lesson/03-linux/linux-filesystem-hierarchy'));
    await page.locator('#retryLesson').waitFor();
    assert.equal(await page.locator('#content article').count(),0,'old lesson text is not cached under the new route');
    await page.locator('#retryLesson').click();await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content h1').innerText(),/filesystem/i);
  });
  await test('blocked clipboard selects the code for manual copying',async page=>{
    await open(page);const code=page.locator('#content .code-win pre code').first();const expected=await code.textContent();
    await page.locator('#content .code-copy').first().click();
    assert.equal((await page.evaluate(()=>getSelection().toString())).trimEnd(),expected.trimEnd());
    assert.equal(await page.locator('#content .code-copy').first().innerText(),'Code selected');
  },()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('denied','NotAllowedError');}}}));
  console.log(`Reader experience: ${passed} passed.`);
}finally{await browser.close();}
