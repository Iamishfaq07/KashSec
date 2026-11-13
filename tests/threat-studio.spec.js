#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const KEY='kashsec_threat_studio_v1';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
async function context(options={}){
  const c=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',...options});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(()=>{
    if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));
  });return c;
}
async function open(p){await p.goto(BASE+'/index.html#/tools/stride');await p.locator('#tsSave').waitFor();}
async function download(p,id){const event=p.waitForEvent('download');await p.locator(id).click();return readFile(await (await event).path(),'utf8');}
try{
  const c=await context(),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await open(p);
  await p.selectOption('#tsExample','api');await p.click('#tsUseExample');
  assert.match(await p.inputValue('#stSystem'),/invoice API/);
  assert.equal(await p.locator('#tsCoverage').innerText(),'2 of 6 categories documented');
  await p.fill('#st-spoofing','<img src=x onerror="window.injected=true">');
  await p.click('#tsSave');assert.match(await p.locator('#tsStatus').innerText(),/Saved in this browser/);
  const saved=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),KEY));
  await p.reload();await p.locator('#tsSave').waitFor();
  assert.equal(await p.inputValue('#st-spoofing'),saved.categories.spoofing.threat);
  assert.equal(await p.evaluate(()=>window.injected),undefined);
  const backup=JSON.parse(await download(p,'#tsExport'));assert.deepEqual(backup,saved);
  const report=await download(p,'#stDownload');
  assert.match(report,/Response \/ control/);assert.match(report,/Verification plan and results/);assert.match(report,/cross-organization/);
  assert.ok(!report.includes('Review status: tested'));
  await p.locator('#tsImport').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
  await p.waitForFunction(()=>document.querySelector('#tsStatus').textContent.startsWith('Import failed'));
  assert.match(await p.locator('#tsStatus').innerText(),/Import failed/);assert.equal(await p.inputValue('#stSystem'),saved.system);
  const imported={...backup,system:'Imported model'};
  await p.locator('#tsImport').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});
  await p.waitForFunction(()=>document.querySelector('#stSystem').value==='Imported model');
  assert.equal(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),KEY)).system,saved.system);
  await p.click('#tsSave');assert.equal(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),KEY)).system,'Imported model');
  // A second tab must not silently replace a newer saved draft.
  const other=await c.newPage();await open(other);await other.fill('#stSystem','Newer tab');await other.click('#tsSave');
  await p.fill('#stSystem','Stale tab');await p.click('#tsSave');
  assert.match(await p.locator('#tsStatus').innerText(),/changed in another tab/);
  assert.equal(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),KEY)).system,'Newer tab');
  p.once('dialog',d=>d.accept());await p.click('#tsLoad');assert.equal(await p.inputValue('#stSystem'),'Newer tab');
  await p.click('#tsBlank');assert.equal(await p.inputValue('#stSystem'),'');
  await p.selectOption('#tsExample','upload');p.once('dialog',d=>d.accept());await p.click('#tsUseExample');
  assert.match(await p.inputValue('#tsFlows'),/untrusted/);
  assert.deepEqual(errors,[]);await c.close();
  for(const colorScheme of ['dark','light']){
    const mobile=await context({viewport:{width:320,height:850},colorScheme}),q=await mobile.newPage();await open(q);
    assert.ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await q.locator('.ts-category summary').last().focus();await q.keyboard.press('Enter');
    assert.equal(await q.locator('.ts-category').last().getAttribute('open'),'');
    await q.locator('.ts-category [data-field="verification"]').last().fill('Verification evidence');
    await q.click('#tsSave');assert.match(await q.locator('#tsStatus').innerText(),/Saved in this browser/);await mobile.close();
  }
  const denied=await context(),d=await denied.newPage();
  await d.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','QuotaExceededError');};});
  await open(d);await d.fill('#stSystem','Keep me');await d.click('#tsSave');assert.match(await d.locator('#tsStatus').innerText(),/Could not save/);
  assert.equal(JSON.parse(await download(d,'#tsExport')).system,'Keep me');await denied.close();
  // First visit caches the module; a saved worksheet must reopen offline.
  const offline=await browser.newContext({serviceWorkers:'allow',reducedMotion:'reduce'}),o=await offline.newPage();
  await offline.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));});
  await open(o);await o.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));});
  await o.waitForFunction(async()=>!!(await caches.match(new URL('threat-studio.js',location.origin).href)));
  await o.fill('#stSystem','Offline model');await o.click('#tsSave');await offline.setOffline(true);await o.reload();await o.locator('#tsSave').waitFor();assert.equal(await o.inputValue('#stSystem'),'Offline model');await offline.close();
  console.log('PASS: templates, persistence, conflict protection, valid/invalid imports, exports, storage failure, mobile keyboard use and offline reload.');
}finally{await browser.close();}
