#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let checks=0;const check=(ok,message)=>{assert.ok(ok,message);checks++;console.log(`  ✓ ${message}`);};
async function makeContext(state={},options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',timezoneId:'Asia/Kolkata',...options});
  context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(state=>{
    if(!sessionStorage.getItem('fc-seed')){sessionStorage.setItem('fc-seed','1');localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...state}));}
  },state);return context;
}
const open=async(page,route='#/review')=>{await page.evaluate(route=>navigateTo(route),route);await page.locator('#fcSession').waitFor();};
const rate=async(page,perf='Good')=>{await page.locator('#fcFlipBtn').click();await page.locator('#fc'+perf+'Btn').click();};
try{
  const context=await makeContext();const page=await context.newPage();const errors=[];let documents=0,bundles=0;
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;if(new URL(r.url()).pathname.endsWith('/glossary.js'))bundles++;});
  await page.goto(BASE+'/lesson/02-networking/dns.html');await page.locator('.kt-cta a').waitFor();
  check(bundles===0,'reading key terms does not download the glossary bundle');
  await page.locator('.kt-cta a').click();await page.locator('#fcSession').waitFor();
  const terms=await page.evaluate(()=>GLOSSARY.filter(e=>e.pathId==='02-networking'&&e.subId==='dns').map(e=>e.term));
  check(await page.locator('#fcPathFilter').inputValue()==='02-networking'&&await page.locator('#fcLessonFilter').inputValue()==='02-networking/dns'&&await page.locator('[data-mode="all"]').getAttribute('aria-pressed')==='true','the lesson link opens its actual terms, including previously scheduled terms');
  check(await page.locator('#fcScope a').getAttribute('href')==='#/lesson/02-networking/dns'&&terms.includes(await page.locator('#fcTerm').innerText()),'focused practice offers the correct source lesson and a matching term');
  check(await page.locator('#fcDefinition').isHidden()&&await page.locator('#fcGoodBtn').isHidden()&&!await page.locator('.fc-src').isVisible(),'definitions, source links, and ratings stay hidden until reveal');
  const token=await page.evaluate(()=>renderGeneration);await page.locator('#fcFlipBtn').focus();await page.keyboard.press('Enter');
  check(await page.locator('#fcDefinition').isVisible()&&await page.evaluate(()=>document.activeElement.id)==='fcFlipBtn','a native keyboard control reveals the meaning without replacing itself');
  await page.locator('#fcGoodBtn').click();
  check(await page.evaluate(()=>document.activeElement.id)===(terms.length===1?'fcResultHeading':'fcTerm'),'rating moves focus into the next card or finish screen');
  for(let i=1;i<terms.length;i++){check(terms.includes(await page.locator('#fcTerm').innerText()),'every term in a focused session belongs to the selected lesson');await rate(page);}
  check((await page.locator('#fcResultHeading').innerText()).includes('finished')&&(await page.locator('.fc-empty').innerText()).includes(`${terms.length} distinct`),'a finite lesson session ends with its distinct-term summary');
  check(await page.evaluate(()=>renderGeneration)===token&&documents===1&&bundles===1,'reveals, ratings, and finishing never reload or reroute the document');
  check(await page.evaluate(()=>Object.keys(STATE.completed).length===0&&Object.keys(STATE.flashcards.reviews).length)>0,'flashcard ratings save review schedules without completing lessons');
  const downloadEvent=page.waitForEvent('download');await page.locator('#ankiExportBtn').click();const download=await downloadEvent;
  const csv=await readFile(await download.path(),'utf8');
  check(csv.split('\n').length===terms.length&&download.suggestedFilename().includes('dns'),'Anki export contains only the selected lesson deck');
  await page.reload();await page.locator('#fcSession').waitFor();
  check(await page.locator('#fcLessonFilter').inputValue()==='02-networking/dns'&&await page.evaluate(()=>Object.keys(STATE.flashcards.reviews).length)===terms.length,'a refreshed shared deck keeps its selection and saved ratings');
  await page.evaluate(()=>{STATE.flashcards.reviews['other-path/other-lesson/Keep me']={interval:3,ease:2.5,streak:1,due:'2099-01-01',ts:100};});
  await page.locator('.fc-maintenance summary').click();page.once('dialog',dialog=>dialog.dismiss());await page.locator('#fcResetBtn').click();
  check(await page.evaluate(()=>Object.keys(STATE.flashcards.reviews).length)===terms.length+1,'cancelling a reset keeps the existing schedules');
  page.once('dialog',dialog=>dialog.accept());await page.locator('#fcResetBtn').click();
  check(await page.evaluate(()=>Object.keys(STATE.flashcards.reviews).length===1&&!!STATE.flashcards.reviews['other-path/other-lesson/Keep me']),'reset removes only the selected lesson’s review history');
  await page.locator('#fcPathFilter').selectOption('02-networking');await page.locator('#fcSize').focus();await page.locator('#fcSize').selectOption('5');
  check(await page.evaluate(()=>document.activeElement.id)==='fcSize'&&new URL(page.url()).hash.includes('size=5'),'session controls preserve focus and update the shareable selection');
  let attempts=0;while(await page.locator('#fcFlipBtn').count()){await rate(page,'Again');attempts++;assert.ok(attempts<=10,'Again must not create an endless deck');}
  check(attempts===10&&(await page.locator('.fc-empty').innerText()).includes('5 distinct terms in 10 attempts'),'Again offers each term exactly one extra try and then finishes');
  await page.locator('#fcRestart').click();check(await page.locator('#fcTerm').count()===1,'another session starts only after an explicit action');
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} focused review fits ${width}px`);}
  }
  await open(page,'#/review?path=missing&lesson=%3Cimg%3E&mode=bad&size=-1');
  check((await page.locator('#fcScopeNotice').innerText()).includes('unavailable')&&await page.locator('#fcPathFilter').inputValue()==='all'&&await page.locator('#fcSize').inputValue()==='10','invalid shared selections recover with an explanation and safe defaults');
  await page.evaluate(()=>{const entry={...GLOSSARY[0],term:'<img src=x onerror="window.FC_BAD=true">',def:'<script>window.FC_BAD=true</script> '+'A long explanation. '.repeat(100)};GLOSSARY.splice(0,GLOSSARY.length,entry);});
  await page.locator('[data-mode="all"]').click();await page.locator('#fcFlipBtn').click();
  check(await page.locator('#fcCard img,#fcCard script').count()===0&&await page.evaluate(()=>!window.FC_BAD)&&await page.locator('.fc-def').innerText().then(t=>t.includes('<script>')),'term and definition markup is displayed as text');
  await page.setViewportSize({width:320,height:900});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.querySelector('#fcDefinition').scrollHeight<=document.querySelector('#fcCard').clientHeight),'long definitions expand naturally without clipping or horizontal overflow');
  const originalSave=await page.evaluate(()=>{window.__fcSave=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='kashsec_state_v1')throw new DOMException('full','QuotaExceededError');return window.__fcSave.call(this,key,value);};return true;});
  await page.locator('#fcGoodBtn').click();check(originalSave&&(await page.locator('#fcSaveStatus').innerText()).includes('storage is unavailable'),'failed browser storage is reported without losing the current session');
  check(errors.length===0,'normal review flows produce no JavaScript errors');await context.close();

  const dated=await makeContext();await dated.addInitScript(()=>{const RealDate=Date;window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:['2026-10-21T20:00:00Z']));}static now(){return new RealDate('2026-10-21T20:00:00Z').getTime();}};});
  const datedPage=await dated.newPage();await datedPage.goto(BASE+'/#/review?path=02-networking&lesson=dns&mode=all&size=5');await datedPage.locator('#fcTerm').waitFor();await rate(datedPage);
  check(await datedPage.evaluate(()=>Object.values(STATE.flashcards.reviews)[0].due)==='2026-10-23','tomorrow uses the learner’s local day after local midnight');await dated.close();

  const priority=await makeContext();const priorityPage=await priority.newPage();await priorityPage.goto(BASE+'/#/review?path=02-networking&size=5');await priorityPage.locator('#fcTerm').waitFor();
  const dueTerm=await priorityPage.evaluate(()=>{const e=GLOSSARY.find(e=>e.pathId==='02-networking');STATE.flashcards.reviews[`${e.pathId}/${e.subId}/${e.term}`]={interval:1,ease:2.5,streak:0,due:'2000-01-01'};return e.term;});
  await priorityPage.locator('[data-mode="due"]').click();check(await priorityPage.locator('#fcTerm').innerText()===dueTerm,'due terms are practised before unseen filler');
  await priorityPage.evaluate(()=>{for(const e of GLOSSARY)STATE.flashcards.reviews[`${e.pathId}/${e.subId}/${e.term}`]={interval:30,ease:2.5,streak:3,due:'2099-01-01'};});
  await priorityPage.locator('[data-mode="due"]').click();check(await priorityPage.locator('#fcFlipBtn').count()===0&&(await priorityPage.locator('#fcResultHeading').innerText()).includes('Nothing'),'a future-only deck explains that nothing is due');
  await priorityPage.locator('#fcBrowseAll').click();check(await priorityPage.locator('#fcTerm').count()===1,'scheduled terms can be revisited without erasing review history');
  await priorityPage.evaluate(()=>{for(const key of Object.keys(STATE.flashcards.reviews))STATE.flashcards.reviews[key]={interval:'bad',due:null};});
  await priorityPage.locator('[data-mode="due"]').click();await rate(priorityPage,'Easy');
  check(await priorityPage.evaluate(()=>Object.values(STATE.flashcards.reviews).some(r=>Number.isFinite(r.interval)&&r.interval===3)),'damaged scheduling fields recover to a valid review when rated');await priority.close();

  const synced=await makeContext();await synced.addInitScript(()=>{
    const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});
    window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'fc-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{window.__mergeStarted=true;await ready;return {data:{state:window.__remoteState||{}}};},upsert:async()=>{window.__merged=true;return {};},order(){return this;},limit:async()=>({data:[]})})})};
  });
  const syncPage=await synced.newPage();await syncPage.goto(BASE+'/#/review?path=02-networking&lesson=dns&mode=all');await syncPage.locator('#fcTerm').waitFor();await syncPage.locator('#fcFlipBtn').click();
  const activeTerm=await syncPage.locator('#fcTerm').innerText();const generation=await syncPage.evaluate(()=>renderGeneration);await syncPage.waitForFunction(()=>window.__mergeStarted);
  await syncPage.evaluate(()=>{const card=GLOSSARY.find(e=>e.term===document.getElementById('fcTerm').textContent&&e.pathId==='02-networking'&&e.subId==='dns');const key=`${card.pathId}/${card.subId}/${card.term}`;window.__remoteState={flashcards:{known:{[key]:100},reviews:{[key]:{interval:3,ease:2.5,streak:2,due:'2099-01-01',ts:100}}}};window.__releaseMerge();});await syncPage.waitForFunction(()=>window.__merged);
  check(await syncPage.locator('#fcTerm').innerText()===activeTerm&&await syncPage.locator('#fcDefinition').isVisible()&&await syncPage.evaluate(()=>renderGeneration)===generation,'late account restoration preserves the active term, revealed meaning, and session');
  check(await syncPage.locator('#fcGoodBtn small').innerText()==='in 8 days','synced schedules update the visible rating interval without replacing controls');
  await syncPage.locator('#fcGoodBtn').click();
  check(await syncPage.evaluate(()=>Object.values(STATE.flashcards.reviews).some(r=>r.interval===8)),'the rating uses the same synced interval that was shown');
  const merge=await syncPage.evaluate(async()=>{
    const record=ts=>({interval:3,ease:2.5,streak:2,due:'2099-01-01',ts});
    const local={...defaultState(),flashcards:{known:{same:300,legacy:true},reviews:{same:record(300),local:record(100),damaged:{interval:'bad'}}}};
    window.__remoteState={flashcards:{known:{same:100,legacy:200,remote:true,bad:'bad'},reviews:{same:record(100),remote:record(200),damaged:record(200),bad:{interval:'bad',ts:400}}}};
    const first=await SupabaseSync.pullAndMerge(local);
    window.__remoteState.flashcards.reviews.same=record(400);const second=await SupabaseSync.pullAndMerge(first);
    return {first,second};
  });
  check(merge.first.flashcards.reviews.same.ts===300&&merge.second.flashcards.reviews.same.ts===400&&!!merge.first.flashcards.reviews.local&&!!merge.first.flashcards.reviews.remote,'schedule merges preserve both devices and select the newest rating per term');
  check(merge.first.flashcards.reviews.damaged.ts===200&&!merge.first.flashcards.reviews.bad&&merge.first.flashcards.known.same===300&&merge.first.flashcards.known.legacy===200&&merge.first.flashcards.known.remote===true&&!merge.first.flashcards.known.bad,'sync rejects damaged remote records and preserves valid legacy known markers');await synced.close();

  for(const status of [503,200]){
    const failed=await makeContext();await failed.route('**/glossary.js',r=>r.fulfill({status,contentType:'application/javascript',body:'/* unavailable */'}),{times:1});
    const failedPage=await failed.newPage();await failedPage.goto(BASE+'/#/review');await failedPage.locator('#reviewRetry').click();await failedPage.locator('#fcTerm').waitFor();
    check(await failedPage.locator('#fcTerm').count()===1,`a ${status} missing glossary offers a working retry`);await failed.close();
  }
  const delayed=await makeContext();let held,release;const ready=new Promise(resolve=>{release=resolve;});await delayed.route('**/glossary.js',r=>{held=r;release();},{times:1});
  const delayedPage=await delayed.newPage();await delayedPage.goto(BASE+'/#/review',{waitUntil:'domcontentloaded'});await ready;await delayedPage.evaluate(()=>navigateTo('#/course'));await held.fulfill({response:await held.fetch()});await delayedPage.waitForFunction(()=>typeof GLOSSARY!=='undefined');
  check(await delayedPage.locator('#fcSession').count()===0&&await delayedPage.locator('.path-card').count()>0,'a late glossary cannot replace the next selected page');await delayed.close();

  const offline=await makeContext({}, {serviceWorkers:'allow'});const offlinePage=await offline.newPage();await offlinePage.goto(BASE+'/#/review?path=02-networking&lesson=dns&mode=all');await offlinePage.locator('#fcTerm').waitFor();
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
  await offlinePage.waitForFunction(async()=>!!navigator.serviceWorker.controller&&!!(await caches.match(new URL('glossary.js',location.origin).href)));
  await offline.setOffline(true);await offlinePage.reload();await offlinePage.locator('#fcTerm').waitFor();await rate(offlinePage);
  check(await offlinePage.locator('#fcLessonFilter').inputValue()==='02-networking/dns'&&await offlinePage.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('kashsec_state_v1')).flashcards.reviews).length)===1,'focused decks reload and save ratings offline');await offline.close();
  console.log(`\n  Flashcards: ${checks} checks passed\n`);
}finally{await browser.close();}
