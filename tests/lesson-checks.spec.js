#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const read = file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const app = read('app.js');
const checks = new Function(app.match(/const LESSON_CHECKS = \{[\s\S]*?\n\};/)[0]+';return LESSON_CHECKS;')();
const paths = new Function(app.match(/const PATHS = \[[\s\S]*?\n\];/)[0]+';return PATHS;')();
const pathId = '22-devsecops-appsec';
const path = paths.find(p=>p.id===pathId);
assert.equal(Object.keys(checks).filter(key=>key.startsWith(pathId+'/')).length,path.subs.length);
assert.equal(Object.keys(checks).filter(key=>key.startsWith('18-ai-security/')).length,3);
assert.deepEqual(checks,JSON.parse(read('preview/src/data/lesson-checks.json')));
for(const [key,q] of Object.entries(checks)){
  const [checkPath,checkSub]=key.split('/');
  assert.ok(paths.find(p=>p.id===checkPath)?.subs.some(s=>s.id===checkSub));
  assert.ok(q,`${key}: dedicated question keyed by lesson ID`);
  assert.ok(q.q && q.explain && q.review);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4);
  const headings=read(`course/${key}.md`).split('\n').filter(line=>/^#{2,3} /.test(line)).map(line=>line.replace(/^#+ /,''));
  assert.ok(headings.includes(q.review),`${key}: review target exists in the source lesson`);
}
console.log('PASS: 18 AppSec and three new AI lessons have dedicated checks, real review targets, and identical preview data.');
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',viewport:{width:390,height:844}});
await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const host=()=>page.locator(preview?'[data-lesson-check]':'#microCheck');
const buttons=()=>host().locator(preview?'[data-check-option]':'#mcOptions button');
const feedback=()=>host().locator(preview?'[data-check-feedback]':'#mcFeedback');
async function open(sub,activePath=pathId){
  if(preview)await page.goto(`${BASE}/lesson/${activePath}/${sub.id}`,{waitUntil:'domcontentloaded'});
  else if(new URL(page.url()).origin!==new URL(BASE).origin)await page.goto(`${BASE}/lesson/${activePath}/${sub.id}.html`,{waitUntil:'domcontentloaded'});
  else await page.evaluate(route=>navigateTo(route),`#/lesson/${activePath}/${sub.id}`);
  await buttons().first().waitFor();
}
try{
  for(const [key,q] of Object.entries(checks)){
    const [activePath,subId]=key.split('/');
    const sub=paths.find(p=>p.id===activePath).subs.find(s=>s.id===subId);await open(sub,activePath);
    assert.ok((await host().innerText()).includes(q.q));
    assert.equal(await buttons().count(),4);
    assert.equal(await buttons().evaluateAll(items=>items.some(b=>b.disabled)),false);
    await buttons().nth((q.correct+1)%4).click();
    assert.match(await feedback().innerText(),/^Not quite\./);
    assert.ok((await feedback().innerText()).includes(q.explain));
    assert.equal(await buttons().evaluateAll(items=>items.every(b=>b.disabled)),true);
    assert.equal(await feedback().evaluate(el=>el===document.activeElement),true);
    await host().getByRole('button',{name:'Review this idea'}).click();
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),q.review);
    await host().getByRole('button',{name:'Try again',exact:true}).click();
    await page.waitForFunction(sel=>document.querySelector(sel)===document.activeElement,preview?'[data-check-option]':'#mcOptions button');
    assert.equal((await feedback().innerText()).trim(),'');
    await buttons().nth(q.correct).focus();await page.keyboard.press('Enter');
    assert.match(await feedback().innerText(),/^Correct\./);
    if(!preview){
      assert.equal(await page.evaluate(()=>Object.keys(STATE.quizScores).length),0);
      assert.equal(await page.evaluate(({pathId,subId})=>isComplete(pathId,subId),{pathId:activePath,subId:sub.id}),false);
    }else{
      const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('kashsec-desk-v1')||'{"state":{}}').state);
      assert.equal(Object.keys(state.quizBest||{}).length,0);
      assert.equal(Boolean(state.done?.[`${activePath}/${sub.id}`]),false);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${sub.id}: no horizontal overflow`);
  }
  console.log(`PASS: ${preview?'preview':'main'} all 21 checks, wrong/correct answers, feedback focus, real review targets, keyboard retries, and mobile fit.`);
  // Returning to an answered lesson starts a new optional check; scores do not
  // leak between lessons or survive a refresh as an implied assessment result.
  await open(path.subs[0]);assert.equal((await feedback().innerText()).trim(),'');
  await page.reload();await buttons().first().waitFor();assert.equal((await feedback().innerText()).trim(),'');
  for(const width of [320,768,1440]){
    await page.setViewportSize({width,height:900});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`check fits ${width}px`);
  }
  if(preview){
    await page.getByRole('button',{name:'Finish & continue'}).click();
    await page.waitForURL(`**/lesson/${pathId}/${path.subs[1].id}`);await buttons().first().waitFor();
    assert.equal(await page.evaluate(key=>Boolean(JSON.parse(localStorage.getItem('kashsec-desk-v1')).state.done[key]),`${pathId}/${path.subs[0].id}`),true);
  }else{
    await page.locator('#finishAndContinue').click();
    await page.waitForURL(`**/lesson/${pathId}/${path.subs[1].id}.html`);await buttons().first().waitFor();
    assert.equal(await page.evaluate(id=>isComplete(id,'what-is-devsecops'),pathId),true);
  }
  assert.equal((await feedback().innerText()).trim(),'');
  console.log('PASS: optional checks never block finish-and-continue, and the next lesson starts unanswered.');
  if(!preview){
    await page.evaluate(()=>navigateTo('#/lesson/03-linux/terminal-basics'));await page.locator('#mcOptions').waitFor();
    assert.match(await host().innerText(),/Optional path practice/i);
    assert.match(await host().innerText(),/may cover a later lesson/);
    await buttons().first().click();await host().getByRole('link',{name:'Browse path lessons'}).click();
    await page.waitForURL('**/lesson/03-linux/');
    console.log('PASS: broader practice is clearly labeled, skippable, and links to the full path.');
  } else {
    await page.goto(`${BASE}/lesson/03-linux/terminal-basics`);await page.locator('.prose-lesson').waitFor();
    assert.equal(await host().count(),0);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: navigation and refresh reset optional practice without JavaScript errors.');
}finally{await context.close();await browser.close();}
