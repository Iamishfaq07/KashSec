#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {chromium} from 'playwright';
import {EXPERT_LABS} from '../expert-labs.js';
const root=new URL('..',import.meta.url);
const read=file=>fs.readFile(new URL(file,root),'utf8');
assert.equal(EXPERT_LABS.length,6);assert.equal(new Set(EXPERT_LABS.map(l=>l.id)).size,6);
for(const lab of EXPERT_LABS){
  assert.equal(lab.questions.length,4);assert.ok(lab.tasks.length>=4&&lab.evidence.length>=3&&lab.hints.length===2&&lab.limits);
  for(const q of lab.questions){assert.equal(new Set(q.options).size,4);assert.ok(q.correct>=0&&q.correct<4&&q.explain);}
  for(const item of lab.prerequisites)await fs.access(new URL(`course/${item.key}.md`,root));
  const html=await read(`expert-labs/${lab.id}.html`);
  for(const file of lab.evidence)assert.ok(html.includes(file.name));
  assert.ok(html.includes(`python expert_security_lab.py --lab ${lab.suite}`));
  const args=['downloads/expert_security_lab.py','--lab',lab.suite];
  const reference=spawnSync('python3',[...args,'--reference'],{cwd:root,encoding:'utf8'});
  assert.equal(reference.status,0,reference.stderr);
  const starter=spawnSync('python3',args,{cwd:root,encoding:'utf8'});
  assert.equal(starter.status,1,`${lab.id}: starter must expose the intended defect`);
  assert.match(starter.stderr,/FAILED/);
}
for(const file of ['expert-labs.js','expert-labs.css','downloads/expert_security_lab.py'])assert.equal(await read(file),await read('preview/public/'+file));
console.log('PASS: six complete cases, real prerequisite links, no-JS briefs, shared frontend files, failing starters and passing references.');
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const labURL=id=>`${BASE}/expert-labs/${id}${preview?'':'.html'}`;
async function contextFor(setup,options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',viewport:{width:390,height:844},...options});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));});
  if(setup)await context.addInitScript(setup);
  return context;
}
async function fileFrom(page,button){const pending=page.waitForEvent('download');await button.click();const file=await pending;return fs.readFile(await file.path(),'utf8');}
async function ready(page){await page.locator('#exNotes').waitFor();}
async function poll(page,fn){for(let i=0;i<150;i++){if(await page.evaluate(fn))return;await page.waitForTimeout(100);}throw Error('Offline resources did not become ready');}
try{
  const context=await contextFor();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let bundles=0;page.on('request',r=>{if(new URL(r.url()).pathname==='/expert-labs.js')bundles++;});
  await page.goto(BASE+'/labs/');await page.getByRole('link',{name:/Expert Labs/}).waitFor();assert.equal(bundles,0,'lab listing does not fetch the expert bundle');
  await page.getByRole('link',{name:/Expert Labs/}).click();await page.locator('.ex-grid .ex-card').first().waitFor();assert.equal(await page.locator('.ex-grid .ex-card').count(),6);
  assert.match(await page.locator('.ex-tabs [aria-current]').innerText(),/Expert Labs/);
  for(const lab of EXPERT_LABS){
    await page.goto(labURL(lab.id));await ready(page);assert.match(await page.locator('h1').innerText(),new RegExp(lab.title));
    assert.equal(await page.locator('.ex-evidence details').count(),3);
    await page.getByRole('button',{name:'Review my reasoning'}).click();assert.match(await page.locator('#exReviewStatus').innerText(),/question 1/);
    assert.equal(await page.evaluate(()=>document.activeElement.name),'ex-q-0');
    for(const [i,q] of lab.questions.entries())await page.locator(`[name="ex-q-${i}"][value="${q.correct}"]`).check();
    await page.getByRole('button',{name:'Review my reasoning'}).click();assert.match(await page.locator('#exResultHeading').innerText(),/4 of 4/);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'exResultHeading');
    const draft=`${lab.id}: Test evidence and remaining risk. <img src=x onerror="window.__bad=true">`;
    await page.locator('#exNotes').fill(draft);assert.match(await page.locator('#exSaveStatus').innerText(),/Draft saved/);
    await page.locator('[name="ex-q-0"]').nth((lab.questions[0].correct+1)%4).check();assert.equal(await page.locator('#exResults').isHidden(),true);
    const report=await fileFrom(page,page.getByRole('button',{name:'Download my report'}));
    assert.ok(report.includes(draft));assert.match(report,/Current answers have not been reviewed/);assert.ok(!report.includes('Current answers reviewed: 4/4'));
    const evidence=JSON.parse(await fileFrom(page,page.getByRole('button',{name:'Download evidence JSON'})));
    assert.deepEqual(evidence.evidence,lab.evidence);assert.equal(evidence.fictional,true);
    await page.reload();await ready(page);assert.equal(await page.locator('#exNotes').inputValue(),draft);assert.equal(await page.locator('#exResults').isHidden(),true);
    assert.equal(await page.evaluate(()=>window.__bad),undefined);
    for(const width of [320,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lab.id} fits ${width}px`);}
    if(!preview)assert.equal(await page.evaluate(()=>Object.keys(STATE.labsCompleted).length+Object.keys(STATE.quizScores).length),0);
  }
  const python=await fileFrom(page,page.getByRole('link',{name:'Download Python exercise'}));assert.equal(python,await read('downloads/expert_security_lab.py'));
  // Saving a draft must not discard a different case written by another tab.
  await page.evaluate(()=>{const key='kashsec_expert_labs_v1',all=JSON.parse(localStorage.getItem(key));all['tenant-boundary']={notes:'Other tab retained',answers:[1,2,3,0]};localStorage.setItem(key,JSON.stringify(all));});
  await page.locator('#exNotes').fill('Cloud scope current tab');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kashsec_expert_labs_v1'))['tenant-boundary'].notes),'Other tab retained');
  assert.deepEqual(errors,[]);await context.close();
  console.log(`PASS: ${preview?'preview':'main'} collection tab, all six cases, review completeness/focus, stale-score prevention, drafts, safe report/evidence/Python downloads, cross-tab preservation and mobile widths.`);
  for(const failure of ['corrupt','unavailable']){
    const context=await contextFor(failure==='corrupt'?()=>localStorage.setItem('kashsec_expert_labs_v1','{broken'):()=>{
      const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kashsec_expert_labs_v1')throw Error('storage blocked');return original.call(this,k,v);};
    });const page=await context.newPage();await page.goto(labURL('tenant-boundary'));await ready(page);await page.locator('#exNotes').fill('Keep in downloaded report');
    assert.match(await page.locator('#exSaveStatus').innerText(),/Could not read or save/);
    assert.ok((await fileFrom(page,page.getByRole('button',{name:'Download my report'}))).includes('Keep in downloaded report'));
    if(failure==='corrupt')assert.equal(await page.evaluate(()=>localStorage.getItem('kashsec_expert_labs_v1')),'{broken');
    await context.close();
  }
  console.log('PASS: corrupt and unavailable storage preserve current work, explain the failure, and permit report export.');
  const retry=await contextFor();const retryPage=await retry.newPage();let blocked=true;
  await retryPage.route('**/expert-labs.js*',r=>blocked?r.fulfill({status:503,body:'Unavailable'}):r.continue());
  await retryPage.goto(labURL('release-trust'));await retryPage.getByRole('button',{name:'Retry Expert Labs'}).waitFor();
  if(!preview){assert.equal(await retryPage.locator('[data-expert-static]').count(),1);assert.equal(await retryPage.locator('h1').count(),1);}
  blocked=false;await retryPage.getByRole('button',{name:'Retry Expert Labs'}).click();await ready(retryPage);assert.match(await retryPage.locator('h1').innerText(),/signed artifact/);await retry.close();
  console.log('PASS: failed bundle loading has a working retry and does not lose the static case brief.');
  if(!preview){
    const delayed=await contextFor();const dp=await delayed.newPage();let release;let requested;
    const arrived=new Promise(resolve=>{requested=resolve;});const hold=new Promise(resolve=>{release=resolve;});
    await dp.route('**/expert-labs.js',async route=>{requested();await hold;await route.continue();});
    await dp.goto(labURL('tenant-boundary'),{waitUntil:'domcontentloaded'});await arrived;
    await dp.evaluate(()=>navigateTo('#/labs'));await dp.getByRole('heading',{name:'Practise inside the browser'}).waitFor();
    const loaded=dp.waitForResponse(r=>new URL(r.url()).pathname==='/expert-labs.js');release();await loaded;
    await dp.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(await dp.locator('.ex-page').count(),0);await delayed.close();
    console.log('PASS: a late expert module cannot replace a different route.');
    const noJS=await contextFor(null,{javaScriptEnabled:false});const page=await noJS.newPage();await page.goto(BASE+'/expert-labs/');assert.equal(await page.locator('[data-expert-static] li a').count(),6);
    for(const lab of EXPERT_LABS){await page.goto(labURL(lab.id));assert.ok((await page.locator('[data-expert-static]').innerText()).includes(lab.tasks[0]));}await noJS.close();
    const offline=await contextFor(null,{serviceWorkers:'allow'});const op=await offline.newPage();await op.goto(labURL('webhook-replay'));await ready(op);
    await poll(op,()=>!!navigator.serviceWorker.controller);
    await op.evaluate(()=>fetch('/downloads/expert_security_lab.py').then(r=>r.text()));
    await poll(op,async()=>!!navigator.serviceWorker.controller&&!!(await caches.match('/expert-labs.js'))&&!!(await caches.match('/expert-labs.css'))&&!!(await caches.match('/downloads/expert_security_lab.py')));
    await op.locator('#exNotes').fill('Offline draft retained');await offline.setOffline(true);await op.reload();await ready(op);
    assert.equal(await op.locator('#exNotes').inputValue(),'Offline draft retained');assert.ok((await op.evaluate(()=>fetch('/downloads/expert_security_lab.py').then(r=>r.text()))).includes('class ExpertSecurityTests'));
    await offline.close();console.log('PASS: no-JS briefs and a genuinely offline case reload with exercise and draft.');
  }
}finally{await browser.close();}
