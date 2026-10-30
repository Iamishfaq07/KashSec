#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const caseURL=id=>`${BASE}/expert-labs/${id}${preview?'':'.html'}`;
const key='kashsec_expert_labs_v1';
async function context(setup){
  const c=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',viewport:{width:320,height:900}});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));});
  if(setup)await c.addInitScript(setup);
  return c;
}
async function open(page,id='tenant-boundary'){await page.goto(caseURL(id));await page.locator('#exNotes').waitFor();}
try{
  const c=await context();const first=await c.newPage(),second=await c.newPage();const errors=[];
  for(const page of [first,second])page.on('pageerror',e=>errors.push(e.message));
  await open(first);await open(second);
  await first.locator('#exNotes').fill('Saved in the first tab');
  const alternative='My alternative report <img src=x onerror="window.__draftInjected=true">';
  await second.locator('#exNotes').fill(alternative);
  assert.match(await second.locator('#exSaveStatus').innerText(),/Another tab changed this case/);
  assert.equal(await second.locator('#exNotes').inputValue(),alternative);
  assert.equal(await second.locator('#exOtherDraft').textContent(),'Saved in the first tab');
  assert.equal(await second.evaluate(key=>JSON.parse(localStorage.getItem(key))['tenant-boundary'].notes,key),'Saved in the first tab');
  await second.locator('[name="ex-q-0"][value="0"]').check();
  assert.equal(await second.evaluate(key=>JSON.parse(localStorage.getItem(key))['tenant-boundary'].answers[0],key),null);
  const pending=second.waitForEvent('download');await second.getByRole('button',{name:'Download my report'}).click();
  const report=await fs.readFile(await(await pending).path(),'utf8');assert.ok(report.includes(alternative));
  assert.equal(await second.evaluate(()=>window.__draftInjected),undefined);
  await first.locator('#exNotes').fill('A newer saved version');
  await second.getByRole('button',{name:'Load saved draft'}).click();
  assert.equal(await second.locator('#exNotes').inputValue(),'A newer saved version','resolution reads the latest stored draft');
  assert.equal(await second.evaluate(()=>document.activeElement.id),'exNotes');
  assert.ok(await second.locator('#exConflict').isHidden());
  await second.locator('#exNotes').fill('Resolved continuation');
  assert.equal(await second.evaluate(key=>JSON.parse(localStorage.getItem(key))['tenant-boundary'].notes,key),'Resolved continuation');
  await first.locator('#exNotes').fill('Older tab keeps its local work');
  assert.match(await first.locator('#exSaveStatus').innerText(),/Auto-save is paused/);
  await first.evaluate(key=>localStorage.setItem(key,'{}'),key);
  await first.getByRole('button',{name:'Load saved draft'}).click();
  assert.equal(await first.locator('#exNotes').inputValue(),'Older tab keeps its local work');
  assert.match(await first.locator('#exSaveStatus').innerText(),/saved draft is no longer available/);
  await first.evaluate(key=>localStorage.setItem(key,JSON.stringify({'tenant-boundary':{notes:27,answers:[99]}})),key);
  await first.getByRole('button',{name:'Load saved draft'}).click();
  assert.equal(await first.locator('#exNotes').inputValue(),'Older tab keeps its local work');
  assert.match(await first.locator('#exSaveStatus').innerText(),/saved draft is no longer available/);
  await first.evaluate(key=>localStorage.setItem(key,'{broken'),key);
  await first.getByRole('button',{name:'Load saved draft'}).click();
  assert.equal(await first.locator('#exNotes').inputValue(),'Older tab keeps its local work','unreadable saved data must not replace the current draft');
  assert.match(await first.locator('#exSaveStatus').innerText(),/Could not read or save/);
  assert.equal(await first.evaluate(key=>localStorage.getItem(key),key),'{broken');
  assert.deepEqual(errors,[]);await c.close();
  console.log('PASS: two real tabs preserve the newer saved case, retain/export local alternatives, reload the latest draft, and preserve work if reload fails.');

  const flow=await context(()=>{
    if(sessionStorage.getItem('expert-workflow-seeded'))return;
    sessionStorage.setItem('expert-workflow-seeded','1');
    localStorage.setItem('kashsec_expert_labs_v1',JSON.stringify({
      'tenant-boundary':{notes:'Findings drafted',answers:[0,1,null,null]},
      'webhook-replay':{notes:'',answers:[null,null,null,null]},
      'release-trust':{notes:null,answers:[99,'0',false,null]}
    }));
  });const p=await flow.newPage();
  await p.goto(BASE+'/expert-labs/');await p.locator('[data-draft-status="tenant-boundary"]').waitFor();
  assert.match(await p.locator('[data-draft-status="tenant-boundary"]').innerText(),/2\/4 answers.*report started/);
  assert.match(await p.locator('[data-case-action="tenant-boundary"]').innerText(),/Continue case/);
  for(const id of ['webhook-replay','release-trust','cloud-scope'])assert.match(await p.locator(`[data-draft-status="${id}"]`).innerText(),/No saved draft/);
  await p.locator('[data-case-action="tenant-boundary"]').click();await p.locator('#exNotes').waitFor();
  const before=p.url();
  const steps=p.getByRole('navigation',{name:'Case steps'}).getByRole('link');
  for(const link of await steps.all()){
    const target=(await link.getAttribute('href')).slice(1);await link.focus();await p.keyboard.press('Enter');
    assert.equal(await p.evaluate(()=>document.activeElement.id),target);
    assert.equal(p.url(),before,'step navigation does not pollute browser history');
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await p.getByRole('navigation',{name:'Case sequence'}).getByRole('link',{name:/Next case/}).click();await p.locator('#exNotes').waitFor();
  assert.match(await p.locator('h1').innerText(),/Signed once, processed twice/);assert.equal(await p.locator('#exNotes').inputValue(),'');
  await p.locator('#exNotes').fill('Webhook review started');
  await p.getByRole('navigation',{name:'Case sequence'}).getByRole('link',{name:'All expert cases',exact:true}).click();
  await p.locator('[data-draft-status="webhook-replay"]').waitFor();
  assert.match(await p.locator('[data-case-action="webhook-replay"]').innerText(),/Continue case/);
  assert.match(await p.locator('[data-draft-status="webhook-replay"]').innerText(),/0\/4 answers.*report started/);
  await p.locator('[data-case-action="rag-document-scope"]').click();await p.locator('#exNotes').waitFor();
  assert.equal(await p.getByRole('navigation',{name:'Case sequence'}).getByRole('link',{name:/Next case/}).count(),0);
  if(!preview)assert.equal(await p.evaluate(()=>Object.keys(STATE.labsCompleted).length+Object.keys(STATE.quizScores).length),0);
  await flow.close();
  console.log('PASS: legacy draft summaries, continue links, keyboard step focus, case progression, 320px layout, and course-score isolation.');
  const denied=await context(()=>{
    const get=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(k==='kashsec_expert_labs_v1')throw Error('unavailable');return get.call(this,k);};
  });const dp=await denied.newPage();await dp.goto(BASE+'/expert-labs/');await dp.locator('#exCollectionStatus').waitFor();
  assert.match(await dp.locator('#exCollectionStatus').innerText(),/could not be read/);
  assert.equal(await dp.locator('[data-case-action]').count(),6);
  for(const text of await dp.locator('[data-draft-status]').allInnerTexts())assert.equal(text,'Draft status unavailable');
  await denied.close();
  console.log('PASS: unavailable draft storage leaves the collection usable and explains the missing status.');
}finally{await browser.close();}
