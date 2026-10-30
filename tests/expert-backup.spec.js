#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium}from'playwright';
import {parseExpertBackup}from'../expert-labs.js';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const key='kashsec_expert_labs_v1';
const record=notes=>({notes,answers:[0,1,null,null],version:1});
const envelope=drafts=>({format:'kashsec-expert-drafts',version:1,exportedAt:'2026-10-30T12:00:00.000Z',drafts});
const sample=envelope({'tenant-boundary':record('A report')});
assert.deepEqual(parseExpertBackup(JSON.stringify(sample)),sample.drafts);
const invalid=[{}, {...sample,version:2},{...sample,drafts:{}},{...sample,reviewScore:4},envelope({'unknown-case':record('x')}),envelope({'tenant-boundary':{...record('x'),version:2}}),envelope({'tenant-boundary':{...record('x'),answers:[0]}}),envelope({'tenant-boundary':{...record('x'),answers:[0,4,null,null]}}),envelope({'tenant-boundary':{...record('x'),reviewScore:4}}),envelope({'tenant-boundary':record('x'.repeat(12001))})];
for(const value of invalid)assert.throws(()=>parseExpertBackup(JSON.stringify(value)));
assert.throws(()=>parseExpertBackup('window.__bad=true'));
assert.throws(()=>parseExpertBackup(' '.repeat(524289)));
console.log('PASS: backup schema rejects unsupported versions, unknown cases, scores, malformed answers, oversized notes and executable text.');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const errors=[];
async function context(seed,extra){
  const c=await browser.newContext({serviceWorkers:'block',viewport:{width:320,height:900},reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(seed=>{try{localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,tourDone:true}));if(seed&&!localStorage.getItem('kashsec_expert_labs_v1'))localStorage.setItem('kashsec_expert_labs_v1',JSON.stringify(seed));}catch{}},seed);
  if(extra)await c.addInitScript('try { ('+extra.toString()+')(); } catch {}');
  c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  return c;
}
async function hub(page){await page.goto(BASE+'/expert-labs/');await page.locator('#exBackupFile').waitFor();}
async function upload(page,text){await page.locator('#exBackupFile').setInputFiles({name:'expert-drafts.json',mimeType:'application/json',buffer:Buffer.from(text)});}
const state=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),key);
const progress=page=>page.evaluate(()=>{
  const main=JSON.parse(localStorage.getItem('kashsec_state_v1')||'{}');const desk=JSON.parse(localStorage.getItem('kashsec-desk-v1')||'{"state":{}}').state;
  return JSON.stringify({completed:main.completed,quizScores:main.quizScores,done:desk.done,quizBest:desk.quizBest});
});
try{
  const notes='My findings <img src=x onerror=window.__backupExecuted=true>';
  const sourceData={'tenant-boundary':record(notes),'rag-document-scope':record('RAG evidence')};
  const source=await context(sourceData),sp=await source.newPage();await hub(sp);
  const pending=sp.waitForEvent('download');await sp.getByRole('button',{name:'Download draft backup',exact:true}).click();
  const backup=await fs.readFile(await(await pending).path(),'utf8');assert.deepEqual(parseExpertBackup(backup),sourceData);
  assert.deepEqual(Object.keys(JSON.parse(backup)).sort(),['drafts','exportedAt','format','version']);await source.close();

  const target=await context(),p=await target.newPage();await hub(p);const beforeProgress=await progress(p);
  await upload(p,backup);await p.locator('#exBackupPreview').waitFor({state:'visible'});
  assert.deepEqual(await state(p),{});assert.equal(await p.evaluate(()=>document.activeElement.id),'exBackupPreviewHeading');
  for(const width of [320,768,1440]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  await p.setViewportSize({width:320,height:900});
  await p.getByRole('button',{name:'Restore 2 new drafts',exact:true}).focus();await p.keyboard.press('Enter');
  assert.deepEqual(await state(p),sourceData);assert.equal(await progress(p),beforeProgress);
  await p.locator('[data-case-action="tenant-boundary"]').click();await p.locator('#exNotes').waitFor();
  assert.equal(await p.locator('#exNotes').inputValue(),notes);assert.ok(await p.locator('[name="ex-q-0"][value="0"]').isChecked());
  assert.equal(await p.locator('#exResults').isHidden(),true);assert.equal(await p.evaluate(()=>window.__backupExecuted),undefined);
  await target.close();console.log(`PASS: ${preview?'preview':'main'} downloads and restores exact drafts in a separate browser, without scores, HTML execution or fabricated review results.`);

  const existing={'tenant-boundary':record('Protected local draft'),'future-case':{notes:'Preserve unknown local data'}};
  const conflict=await context(existing),q=await conflict.newPage(),other=await conflict.newPage();await hub(q);
  await upload(q,backup);await q.getByRole('button',{name:'Restore 1 new draft',exact:true}).click();
  assert.equal((await state(q))['tenant-boundary'].notes,'Protected local draft');assert.equal((await state(q))['rag-document-scope'].notes,'RAG evidence');
  await upload(q,backup);await q.getByRole('button',{name:'Cancel restore',exact:true}).click();assert.equal(await q.locator('#exBackupPreview').isHidden(),true);
  await upload(q,backup);await q.getByRole('button',{name:/Replace 2 saved drafts/}).waitFor();
  await other.goto(BASE+'/labs/');await other.evaluate(key=>{const all=JSON.parse(localStorage.getItem(key));all['tenant-boundary'].notes='Changed after preview';localStorage.setItem(key,JSON.stringify(all));},key);
  await q.getByRole('button',{name:/Replace 2 saved drafts/}).click();assert.equal((await state(q))['tenant-boundary'].notes,'Changed after preview');
  assert.match(await q.locator('#exBackupStatus').innerText(),/changed since this preview/);
  await q.getByRole('button',{name:/Replace 2 saved drafts/}).click();assert.equal((await state(q))['tenant-boundary'].notes,notes);
  assert.deepEqual((await state(q))['future-case'],existing['future-case']);
  const snapshot=await state(q);
  let downloads=0;q.on('download',()=>downloads++);await q.getByRole('button',{name:'Download draft backup',exact:true}).click();
  assert.match(await q.locator('#exBackupStatus').innerText(),/could not be backed up/);assert.equal(downloads,0);assert.deepEqual(await state(q),snapshot);
  await upload(q,JSON.stringify(invalid[4]));await q.waitForFunction(()=>document.querySelector('#exBackupStatus').textContent.includes('Could not prepare'));
  assert.deepEqual(await state(q),snapshot);assert.equal(await q.locator('#exBackupPreview').isHidden(),true);
  await upload(q,'x'.repeat(524289));assert.match(await q.locator('#exBackupStatus').innerText(),/512 KB/);assert.deepEqual(await state(q),snapshot);
  for(const width of [320,768,1440]){await q.setViewportSize({width,height:900});assert.ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  await conflict.close();console.log('PASS: new-only restore preserves saved cases; explicit replacement rechecks changed data, cancel/invalid/oversized files leave storage unchanged, and unknown local records survive.');

  for(const kind of ['corrupt','blocked']){
    const c=await context(null,kind==='corrupt'?()=>localStorage.setItem('kashsec_expert_labs_v1','{broken'):()=>{
      const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kashsec_expert_labs_v1')throw Error('blocked');return original.call(this,k,v);};
    });const page=await c.newPage();await hub(page);await upload(page,backup);
    if(kind==='corrupt'){
      await page.waitForFunction(()=>document.querySelector('#exBackupStatus').textContent.includes('Could not prepare'));
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),'{broken');
    }else{
      await page.getByRole('button',{name:'Restore 2 new drafts',exact:true}).click();assert.match(await page.locator('#exBackupStatus').innerText(),/Could not restore/);assert.deepEqual(await state(page),{});
    }
    await c.close();
  }
  console.log('PASS: unreadable and unwritable storage report failure without claiming a successful restore.');
  const late=await context(null,()=>{
    const original=File.prototype.text;
    File.prototype.text=function(){
      if(this.name!=='slow.json')return original.call(this);
      return original.call(this).then(text=>new Promise(resolve=>{window.__releaseBackup=()=>resolve(text);}));
    };
  });const lp=await late.newPage();await hub(lp);
  const slow=()=>lp.locator('#exBackupFile').setInputFiles({name:'slow.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await slow();await lp.waitForFunction(()=>typeof window.__releaseBackup==='function');
  await upload(lp,JSON.stringify(envelope({'rag-document-scope':record('Latest selected file')})));
  await lp.waitForFunction(()=>document.querySelectorAll('#exBackupCases li').length===1);
  await lp.evaluate(()=>window.__releaseBackup());await lp.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await lp.locator('#exBackupCases li').count(),1);assert.ok((await lp.locator('#exBackupCases').innerText()).includes('RAG documents'));
  await lp.getByRole('button',{name:'Cancel restore',exact:true}).click();await lp.evaluate(()=>window.__releaseBackup=null);
  await slow();await lp.waitForFunction(()=>typeof window.__releaseBackup==='function');
  await lp.locator('[data-case-action="tenant-boundary"]').click();await lp.locator('#exNotes').waitFor();
  await lp.evaluate(()=>window.__releaseBackup());await lp.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await lp.locator('#exNotes').inputValue(),'');assert.deepEqual(await state(lp),{});
  await late.close();assert.deepEqual(errors,[]);
  console.log('PASS: a late file read cannot replace a newer preview or change a different route.');
}finally{await browser.close();}
