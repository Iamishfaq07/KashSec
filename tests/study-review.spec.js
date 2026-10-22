#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let checks=0;const check=(ok,message)=>{assert.ok(ok,message);checks++;console.log(`  ✓ ${message}`);};
const initial={studyPlan:{pathId:'02-networking',dailyGoal:2,updatedAt:100},completed:{'02-networking/dns':100,'02-networking/http-https':200,'02-networking/ports':300,'03-linux/terminal-basics':400,'unknown/missing':500},notes:{'02-networking/dns':'PRIVATE note that should stay in the notebook'}};
async function makeContext(state=initial,options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',timezoneId:'Asia/Kolkata',...options});context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(state=>{if(!sessionStorage.getItem('sr-seed')){sessionStorage.setItem('sr-seed','1');localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...state}));}},state);return context;
}
const load=async page=>{await page.locator('#studyReviewLoad').click();await page.locator('#studyReviewContent').waitFor({state:'visible'});};
async function seedSchedules(page){
  await page.evaluate(()=>{
    const cards=sub=>GLOSSARY.filter(e=>e.pathId==='02-networking'&&e.subId===sub);
    const record=(e,due)=>{STATE.flashcards.reviews[`${e.pathId}/${e.subId}/${e.term}`]={interval:3,ease:2.5,streak:1,due,ts:100};};
    cards('dns').slice(0,2).forEach(e=>record(e,'2000-01-01'));cards('http-https').forEach(e=>record(e,'2099-01-01'));record(cards('http-https')[0],'2001-01-01');cards('ports').forEach(e=>record(e,'2099-01-01'));
    const unread=GLOSSARY.find(e=>e.pathId==='02-networking'&&!isComplete(e.pathId,e.subId));record(unread,'1999-01-01');saveState();currentPlannerRefresh();
  });
}
try{
  const context=await makeContext();const page=await context.newPage();const errors=[];let documents=0,bundles=0;
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;if(new URL(r.url()).pathname.endsWith('/glossary.js'))bundles++;});
  await page.goto(BASE+'/#/planner');await page.locator('#studyPlanForm').waitFor();
  check(bundles===0&&await page.locator('#studyReviewContent').isHidden(),'planning new lessons does not download review terms');
  const generation=await page.evaluate(()=>renderGeneration);await load(page);await seedSchedules(page);
  check(bundles===1&&await page.evaluate(()=>renderGeneration)===generation&&documents===1,'opening the review queue loads terms on demand without refreshing the planner');
  check((await page.locator('#studyReviewSummary').innerText()).startsWith('3 terms due')&&await page.locator('.sr-card').count()===2,'due totals include only completed lessons in the saved focus');
  check((await page.locator('.sr-card h3').first().innerText()).includes('DNS'),'the lesson with the oldest due terms comes first');
  check((await page.locator('.sr-card').first().innerText()).includes('You have notes')&&!(await page.locator('#studyReviews').innerText()).includes('PRIVATE'),'the queue signals available notes without exposing their text');
  const link=await page.locator('.sr-card .btn-amber').first().getAttribute('href');const query=new URLSearchParams(link.split('?')[1]);
  check(query.get('studied')==='1'&&query.get('path')==='02-networking'&&query.get('lesson')==='dns'&&query.get('size')==='5','a review link carries a five-term session and the completed-lesson boundary');
  check((await page.locator('.sr-card').first().locator('a').last().getAttribute('href')).includes('#/playground/network?from=02-networking%2Fdns'),'a lesson can also lead to its related hands-on experiment');
  await page.locator('[data-review-mode="new"]').focus();await page.keyboard.press('Space');
  check(await page.locator('.sr-card').count()===1&&await page.locator('[data-review-mode="new"]').getAttribute('aria-pressed')==='true'&&await page.evaluate(()=>document.activeElement.dataset.reviewMode)==='new','keyboard filtering preserves focus and shows lessons with unseen terms');
  await page.locator('[data-review-mode="all"]').click();check(await page.locator('.sr-card').count()===3,'All studied includes lessons whose terms are scheduled for later');
  await page.locator('[data-review-mode="due"]').click();await page.locator('.sr-card .btn-amber').first().click();await page.locator('#fcTerm').waitFor();
  check(await page.locator('#fcStudiedOnly').isChecked()&&await page.locator('#fcLessonFilter').inputValue()==='02-networking/dns','the queue opens the intended studied deck');
  const before=await page.evaluate(()=>JSON.stringify(STATE.completed));await page.locator('#fcFlipBtn').click();await page.locator('#fcGoodBtn').click();
  check(await page.evaluate(()=>JSON.stringify(STATE.completed))===before,'reviewing a term does not add lesson completions');
  await page.evaluate(()=>navigateTo('#/planner'));await load(page);
  check((await page.locator('#studyReviewSummary').innerText()).startsWith('2 terms due'),'returning to the queue reflects a saved rating');
  await page.locator('[data-review-mode="all"]').click();await page.getByLabel('Learning focus').selectOption('03-linux');
  check((await page.locator('#studyReviewSummary').innerText()).includes('Networking'),'an unsaved planner choice does not silently change the review focus');
  await page.getByRole('button',{name:'Save plan',exact:true}).click();
  check(await page.locator('[data-review-mode="all"]').getAttribute('aria-pressed')==='true'&&(await page.locator('#studyReviewSummary').innerText()).includes('Linux')&&await page.locator('.sr-card').count()===1,'saving a new focus updates the queue while preserving its selected filter');
  await page.evaluate(()=>{
    STATE.studyPlan.pathId='02-networking';const ids=[...new Set(GLOSSARY.filter(e=>e.pathId==='02-networking').map(e=>e.subId))].slice(0,8);
    STATE.completed=Object.fromEntries(ids.map((id,i)=>['02-networking/'+id,100+i]));currentPlannerRefresh();
  });
  check(await page.locator('.sr-card').count()===5&&await page.locator('#studyReviewMore').isVisible(),'a long queue begins with five lessons');
  await page.locator('#studyReviewMore').focus();await page.keyboard.press('Enter');
  check(await page.locator('.sr-card').count()===8&&await page.locator('#studyReviewMore').isHidden()&&await page.evaluate(()=>document.activeElement.matches('.sr-card h3')),'showing the remaining lessons keeps keyboard focus in the expanded queue');
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} review queue fits ${width}px`);}
  }
  const midnight=await page.evaluate(()=>{
    STATE.completed={'02-networking/dns':100};STATE.studyPlan.pathId='02-networking';STATE.flashcards.reviews={};
    const e=GLOSSARY.find(e=>e.pathId==='02-networking'&&e.subId==='dns');STATE.flashcards.reviews[`${e.pathId}/${e.subId}/${e.term}`]={interval:1,ease:2.5,streak:1,due:'2026-10-22'};
    return studyReviewSnapshot(new Date('2026-10-21T20:00:00Z')).due;
  });check(midnight===1,'due calculations use the learner’s local date after midnight');
  await page.evaluate(()=>{STATE.completed={'02-networking/dns':100};saveState();navigateTo('#/review?path=02-networking&studied=1&mode=all');});await page.locator('#fcTerm').waitFor();
  check(await page.locator('#fcStudiedOnly').isChecked()&&(await page.locator('.fc-src').getAttribute('href'))==='#/lesson/02-networking/dns','completed-only practice excludes unread lessons even within the same path');
  const exportReady=page.waitForEvent('download');await page.locator('#ankiExportBtn').click();const csv=await readFile(await(await exportReady).path(),'utf8');
  check(csv.split('\n').length===await page.evaluate(()=>GLOSSARY.filter(e=>e.pathId==='02-networking'&&e.subId==='dns').length),'completed-only exports include just studied terms');
  await page.reload();await page.locator('#fcSession').waitFor();check(await page.locator('#fcStudiedOnly').isChecked(),'the studied filter survives a refreshed shared URL');
  await page.evaluate(()=>{STATE.completed={};currentReviewRefresh();});await page.locator('#fcStudiedOnly').uncheck();await page.locator('#fcStudiedOnly').check();
  check(await page.locator('#fcTerm').count()===0&&await page.locator('#ankiExportBtn').isDisabled()&&(await page.locator('.fc-empty').innerText()).includes('No terms from completed lessons'),'an empty studied selection explains how to begin and cannot export an unrelated deck');
  await page.locator('#fcStudiedOnly').uncheck();check(await page.locator('#fcTerm').count()===1,'turning off the filter restores access to unread material');
  check(errors.length===0,'review-queue and completed-deck flows produce no JavaScript errors');await context.close();

  for(const state of [{}, {studyPlan:initial.studyPlan,completed:{'02-networking/unknown':100}}]){
    const empty=await makeContext(state);const emptyPage=await empty.newPage();await emptyPage.goto(BASE+'/#/planner');await load(emptyPage);
    check(await emptyPage.locator('.sr-card').count()===0&&(await emptyPage.locator('#studyReviewEmpty').innerText()).includes('Start with a lesson'),'new or unrecognised completion records do not invent recommendations');await empty.close();
  }
  const noTerms=await makeContext();const noTermsPage=await noTerms.newPage();await noTermsPage.goto(BASE+'/#/planner');await load(noTermsPage);
  await noTermsPage.evaluate(()=>{GLOSSARY.splice(0,GLOSSARY.length);currentPlannerRefresh();});
  check((await noTermsPage.locator('#studyReviewEmpty').innerText()).includes('do not have flashcards')&&(await noTermsPage.locator('#studyReviewCoverage').innerText()).includes('no flashcards'),'completed lessons without key terms have an honest text-and-notes fallback');await noTerms.close();

  const synced=await makeContext();await synced.addInitScript(()=>{
    const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'sr-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{window.__mergeStarted=true;await ready;return {data:{state:{completed:{'02-networking/dns-lab':600},studyPlan:{pathId:'02-networking',dailyGoal:3,updatedAt:200}}}};},upsert:async()=>{window.__merged=true;return {};},order(){return this;},limit:async()=>({data:[]})})})};
  });
  const syncPage=await synced.newPage();await syncPage.goto(BASE+'/#/planner');await load(syncPage);await syncPage.locator('[data-review-mode="all"]').click();await syncPage.getByLabel('Lessons per day',{exact:true}).fill('7');
  const syncGeneration=await syncPage.evaluate(()=>renderGeneration);await syncPage.waitForFunction(()=>window.__mergeStarted);await syncPage.evaluate(()=>window.__releaseMerge());await syncPage.waitForFunction(()=>window.__merged);
  check(await syncPage.getByLabel('Lessons per day',{exact:true}).inputValue()==='7'&&await syncPage.evaluate(()=>renderGeneration)===syncGeneration&&await syncPage.locator('[data-review-mode="all"]').getAttribute('aria-pressed')==='true'&&(await syncPage.locator('#studyReviewSummary').innerText()).includes('4 completed lessons'),'late sync refreshes review progress while retaining the planner draft, filter, and page');await synced.close();
  for(const status of [503,200]){
    const failed=await makeContext();await failed.route('**/glossary.js',r=>r.fulfill({status,contentType:'application/javascript',body:'/* unavailable */'}),{times:1});const failedPage=await failed.newPage();await failedPage.goto(BASE+'/#/planner');await failedPage.locator('#studyReviewLoad').click();
    await failedPage.waitForFunction(()=>document.getElementById('studyReviewLoad').textContent.includes('again'));
    await failedPage.getByLabel('Lessons per day',{exact:true}).fill('3');await failedPage.getByRole('button',{name:'Save plan',exact:true}).click();await load(failedPage);
    check(await failedPage.locator('#studyReviewContent').isVisible()&&await failedPage.evaluate(()=>STATE.studyPlan.dailyGoal)===3,`a ${status} glossary failure keeps the plan usable and offers a working retry`);await failed.close();
  }
  const delayed=await makeContext();let held,release;const ready=new Promise(resolve=>{release=resolve;});await delayed.route('**/glossary.js',r=>{held=r;release();},{times:1});const delayedPage=await delayed.newPage();await delayedPage.goto(BASE+'/#/planner');await delayedPage.locator('#studyReviewLoad').click();await ready;
  await delayedPage.evaluate(()=>navigateTo('#/course'));await held.fulfill({response:await held.fetch()});await delayedPage.waitForFunction(()=>typeof GLOSSARY!=='undefined');
  check(await delayedPage.locator('.path-card').count()>0&&await delayedPage.locator('#studyReviews').count()===0,'a late review load cannot replace the next chosen page');await delayed.close();
  const offline=await makeContext(initial,{serviceWorkers:'allow'});const offlinePage=await offline.newPage();await offlinePage.goto(BASE+'/#/planner');await load(offlinePage);
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
  await offlinePage.waitForFunction(async()=>!!await caches.match(new URL('glossary.js',location.origin).href));await offline.setOffline(true);await offlinePage.reload();await load(offlinePage);await offlinePage.locator('[data-review-mode="new"]').click();await offlinePage.locator('.sr-card .btn-amber').first().click();await offlinePage.locator('#fcTerm').waitFor();await offlinePage.locator('#fcFlipBtn').click();await offlinePage.locator('#fcGoodBtn').click();
  check(await offlinePage.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('kashsec_state_v1')).flashcards.reviews).length)===1&&await offlinePage.locator('#fcStudiedOnly').isChecked(),'the saved queue opens a studied deck and records a review offline');await offline.close();
  console.log(`\n  Study review: ${checks} checks passed\n`);
}finally{await browser.close();}
