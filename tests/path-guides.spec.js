#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const paths=new Function(app.match(/const PATHS = \[[\s\S]*?\n\];/)[0]+';return PATHS;')();
const id='22-devsecops-appsec';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let passed=0;
async function test(name,run,seed={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(seed=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...seed}));},seed);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await run(page);assert.deepEqual(errors,[]);passed++;console.log('PASS '+name);}finally{await context.close();}
}
async function open(page,path=id){await page.goto(`${BASE}/lesson/${path}/`,{waitUntil:'domcontentloaded'});await page.locator('.path-map').waitFor();}
try{
  await test('static path maps stay graphical and navigable without JavaScript',async page=>{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    try{
      const fallback=await context.newPage();await fallback.goto(`${BASE}/lesson/${id}/`);
      assert.equal(await fallback.locator('.path-map-step').count(),4);
      assert.equal(await fallback.locator('.path-map').evaluate(el=>getComputedStyle(el).display),'grid');
      assert.equal(await fallback.locator('.path-map').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),4);
      await fallback.setViewportSize({width:390,height:844});
      assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      assert.equal(await fallback.locator('.path-map').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
      await fallback.locator('.path-map a').first().click();await fallback.waitForURL('**/what-is-devsecops.html');
      assert.match(await fallback.locator('#content h1').innerText(),/AppSec and DevSecOps/);
    }finally{await context.close();}
  });
  await test('all 26 paths expose a connected roadmap, evidence and official credentials',async page=>{
    for(const path of paths){
      await open(page,path.id);
      assert.equal(await page.locator('.path-map-step').count(),4,path.id);
      assert.equal(await page.locator('.sublesson-card').count(),path.subs.length,path.id);
      assert.ok(await page.locator('.path-cert-card .path-provider-link').count()>0,path.id);
      assert.equal(await page.locator('.path-map a[aria-current="step"]').count(),1,path.id);
      for(const href of await page.locator('.path-map a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))))assert.ok(href.startsWith('/lesson/'+path.id+'/'));
    }
  });
  await test('stage progress resumes the first unfinished lesson and supports keyboard activation',async page=>{
    await open(page);
    assert.match(await page.locator('.path-map-step').first().innerText(),/2\/4 complete/);
    const next=page.locator('.path-map a[aria-current="step"]');
    assert.match(await next.getAttribute('href'),/security-requirements-asvs\.html$/);
    await next.focus();await page.keyboard.press('Enter');
    await page.waitForURL('**/security-requirements-asvs.html');
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content h1').innerText(),/Testable Requirements/);
  },{completed:{[id+'/what-is-devsecops']:1,[id+'/shift-left-vs-shift-right']:1}});
  await test('finishing a stage marks it complete and advances the current stage',async page=>{
    await open(page);
    assert.match(await page.locator('.path-map-step').first().innerText(),/Stage 1 · Complete/);
    assert.match(await page.locator('.path-map a[aria-current="step"]').getAttribute('href'),/secure-code-review\.html$/);
  },{completed:Object.fromEntries(['what-is-devsecops','shift-left-vs-shift-right','security-requirements-asvs','threat-modeling-sdlc'].map(s=>[id+'/'+s,1]))});
  await test('certification plans persist between a path and its filtered planner without losing focus',async page=>{
    await open(page);await page.locator('.path-cert-select[data-cert="csslp"]').selectOption('studying');
    await page.goto(BASE+'/index.html#/certs');await page.locator('#certPathFilter').selectOption(id);
    assert.equal(await page.locator('.cert-track-card:visible').count(),3);
    const status=page.locator('.cert-status-select[data-cert="csslp"]');assert.equal(await status.inputValue(),'studying');
    await status.selectOption('passed');assert.equal(await page.locator('#certPathFilter').inputValue(),id);
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.cert),'csslp');
    await open(page);assert.equal(await page.locator('.path-cert-select[data-cert="csslp"]').inputValue(),'passed');
    await page.reload();await page.locator('.path-map').waitFor();assert.equal(await page.locator('.path-cert-select[data-cert="csslp"]').inputValue(),'passed');
  });
  await test('unknown saved certification statuses cannot break the planner',async page=>{
    await page.goto(BASE+'/index.html#/certs');await page.locator('#certPathFilter').waitFor();
    assert.equal(await page.locator('.cert-status-select[data-cert="csslp"]').inputValue(),'not-started');
    await open(page);assert.equal(await page.locator('.path-cert-select[data-cert="csslp"]').inputValue(),'not-started');
  },{certTracker:{csslp:'old-imported-status'}});
  await test('a failed certification save is explained and leaves lesson links working',async page=>{
    await open(page);
    await page.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kashsec_state_v1')throw new Error('blocked');return set.call(this,k,v);};});
    await page.locator('.path-cert-select[data-cert="csslp"]').selectOption('studying');
    assert.match(await page.locator('[data-path-cert="csslp"] .path-cert-save').innerText(),/Could not save/);
    await page.locator('.path-map a').first().click();await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content h1').innerText(),/AppSec and DevSecOps/);
  });
  await test('roadmaps fit phone, tablet and desktop widths with usable link targets',async page=>{
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});await open(page);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),String(width));
      assert.ok((await page.locator('.path-map-card>a').evaluateAll(links=>links.map(l=>l.getBoundingClientRect().height))).every(h=>h>=44));
      if(width===390 || width===1440){await page.locator('.path-learning-map').screenshot({path:`/tmp/kashsec-path-map-${width}.png`});}
    }
  });
  await test('the downloadable lab and all three new lessons are reachable',async page=>{
    const download=await page.request.get(BASE+'/downloads/appsec_invoice_lab.py');assert.equal(download.status(),200);assert.match(await download.text(),/class InvoiceSecurityTests/);
    for(const slug of ['security-requirements-asvs','secure-code-review','appsec-fix-verify-lab']){
      await page.goto(`${BASE}/lesson/${id}/${slug}.html`);await page.locator('#content[aria-busy="false"]').waitFor();
      assert.equal(await page.locator('#retryLesson').count(),0);assert.ok((await page.locator('#content').innerText()).length>1500);
    }
    assert.match(await page.locator('#content a[href="/downloads/appsec_invoice_lab.py"]').innerText(),/Download/);
  });
  console.log(`Path guide browser checks: ${passed} passed.`);
}finally{await browser.close();}
