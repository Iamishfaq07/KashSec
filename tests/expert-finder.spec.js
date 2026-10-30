#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const key='kashsec_expert_labs_v1';
const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',viewport:{width:320,height:850}});
await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
await context.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,tourDone:true}));});
const p=await context.newPage(),other=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
const cards=()=>p.locator('[data-expert-card]:visible');
async function count(value){await p.waitForFunction(n=>document.querySelector('#exFilterStatus')?.textContent===`${n} of 6 cases shown.`,value);assert.equal(await cards().count(),value);}
try{
  await p.goto(BASE+'/expert-labs/');await p.locator('#exQuery').waitFor();await count(6);
  await p.locator('#exTrack').selectOption('AI Security');await count(2);
  await p.locator('#exQuery').fill('RAG revoked');await count(1);assert.equal(await cards().first().getAttribute('data-expert-card'),'rag-document-scope');
  const query=p.locator('#exQuery'),before=p.url();await query.press('Enter');assert.equal(p.url(),before);
  await query.fill('<img src=x onerror=window.__injected=true>');await count(0);assert.equal(await p.locator('#exFilterEmpty').isVisible(),true);assert.equal(await p.evaluate(()=>window.__injected),undefined);
  await p.getByRole('button',{name:'Clear filters'}).click();await count(6);assert.equal(await query.evaluate(el=>el===document.activeElement),true);
  await p.locator('#exDraftOnly').check();await count(0);
  await other.goto(BASE+'/labs/');
  await other.evaluate(key=>localStorage.setItem(key,JSON.stringify({'rag-document-scope':{notes:'Report begun in another tab',answers:[0,null,null,null]}})),key);
  await count(1);assert.match(await p.locator('[data-draft-status="rag-document-scope"]').innerText(),/1\/4 answers.*report started/);
  assert.match(await p.locator('[data-case-action="rag-document-scope"]').innerText(),/Continue case/);
  await p.locator('#exTrack').selectOption('AI Security');await query.fill('');await query.focus();
  await other.evaluate(key=>{const all=JSON.parse(localStorage.getItem(key));all['agent-tool-boundary']={notes:'Second case',answers:[]};localStorage.setItem(key,JSON.stringify(all));},key);
  await count(2);assert.equal(await query.evaluate(el=>el===document.activeElement),true,'storage refresh preserves focus');
  await other.evaluate(key=>localStorage.removeItem(key),key);await count(0);
  await other.evaluate(key=>localStorage.setItem(key,'{broken'),key);
  await p.waitForFunction(()=>document.getElementById('exDraftOnly').disabled);
  assert.equal(await p.locator('#exDraftOnly').isChecked(),false);await count(2);
  assert.match(await p.locator('#exCollectionStatus').innerText(),/could not be read/);
  for(const text of await p.locator('[data-draft-status]').allInnerTexts())assert.equal(text,'Draft status unavailable');
  await other.evaluate(key=>localStorage.setItem(key,'{}'),key);await p.waitForFunction(()=>!document.getElementById('exDraftOnly').disabled);
  await p.getByRole('button',{name:'Clear filters'}).click();await count(6);
  for(const width of [320,768,1440]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  await p.locator('[data-case-action="rag-document-scope"]').click();await p.locator('#exNotes').waitFor();
  await other.evaluate(key=>localStorage.setItem(key,JSON.stringify({'tenant-boundary':{notes:'Changed after leaving the hub',answers:[]}})),key);
  // A removed hub must not keep receiving storage callbacks into its old DOM.
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${preview?'preview':'main'} topic/text/draft filters, empty/reset/focus behavior, safe query text, live cross-tab summaries, unavailable-storage recovery, mobile layout and navigation cleanup.`);
}finally{await context.close();await browser.close();}
