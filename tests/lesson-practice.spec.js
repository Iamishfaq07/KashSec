#!/usr/bin/env node
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let checks=0;
const check=(ok,message)=>{assert.ok(ok,message);checks++;console.log(`  ✓ ${message}`);};
async function contextFor(options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',...options});
  context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(()=>{
    if(!sessionStorage.getItem('lp-seed')){
      sessionStorage.setItem('lp-seed','1');
      localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));
    }
  });
  return context;
}
async function navigate(page,route){await page.evaluate(route=>navigateTo(route),route);}
try{
  const context=await contextFor();const page=await context.newPage();
  const errors=[];let documents=0,bundles=0;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;if(/\/(playground|investigations)\.js$/.test(new URL(r.url()).pathname))bundles++;});
  await page.goto(BASE+'/lesson/11-web-security/idor.html');
  await page.locator('#content[aria-busy="false"]').waitFor();
  check(await page.locator('.lp-card').count()===2&&bundles===0,'IDOR reading suggests an experiment and a case without downloading either bundle');
  const registry=await page.evaluate(()=>LESSON_PRACTICE);
  for(const item of registry){
    for(const lesson of item.lessons)await access(new URL(`../course/${lesson}.md`,import.meta.url));
    await navigate(page,`#/${item.kind}/${item.id}?from=${encodeURIComponent(item.lessons[0])}`);
    await page.locator(item.kind==='playground'?'#pgExperiment':'#iwDecisionForm').waitFor();
    const data=await page.evaluate(({kind,id})=>(kind==='playground'?KashPlayground.EXERCISES:KashInvestigations.CASES).find(item=>item.id===id),item);
    check(data.title===item.title&&data.minutes===item.minutes,`${item.id} points to a real activity with a matching title and duration`);
    check((await page.locator('.practice-return a').getAttribute('href'))===`#/lesson/${item.lessons[0]}`,`${item.id} returns to its originating lesson`);
  }
  await navigate(page,'#/lesson/11-web-security/idor');await page.locator('#content[aria-busy="false"]').waitFor();
  await page.locator('#jumpLessonPractice').focus();await page.keyboard.press('Enter');
  check(await page.evaluate(()=>document.activeElement.id==='lessonPracticeHeading'&&document.getElementById('lessonPracticeHeading').getBoundingClientRect().top>0),'keyboard shortcut scrolls to practice and moves focus to its heading');
  await page.locator('.lp-card').first().locator('summary').click();
  check(await page.locator('.lp-card').first().locator('details').getAttribute('open')!==null,'a prediction prompt can be opened before starting');
  await page.locator('.notes-panel summary').click();await page.locator('#lessonNotes').fill('Signing in is not an ownership check.');
  await page.locator('.lp-card').first().locator('a').click();await page.locator('#pgRequest').waitFor();
  check(await page.evaluate(()=>STATE.notes['11-web-security/idor'])==='Signing in is not an ownership check.','opening practice flushes pending lesson notes');
  const activityURL=page.url();await page.reload();await page.locator('#pgRequest').waitFor();
  check(page.url()===activityURL&&await page.locator('.practice-return a').count()===1,'return context survives a direct activity refresh');
  await page.locator('#pgOwner').selectOption('birch');await page.locator('#pgOwnership').uncheck();await page.locator('#pgRequest').click();
  await page.locator('#pgOwnership').check();await page.locator('#pgRequest').click();
  await page.locator('#pgOwner').selectOption('acme');await page.locator('#pgRequest').click();
  await page.locator('.pg-next a').click();await page.locator('#lessonPracticeHeading').waitFor();
  check((await page.locator('[data-practice-status="playground/access"]').innerText()).includes('Experiment completed')&&!(await page.evaluate(()=>isComplete('11-web-security','idor'))),'completed practice updates its label without marking the lesson read');
  check(await page.locator('#lessonNotes').inputValue()==='Signing in is not an ownership check.','returning to the lesson preserves its notes');
  await page.goBack();await page.locator('#pgRequest').waitFor();await page.goForward();await page.locator('#lessonPracticeHeading').waitFor();
  check(documents===2,'lesson, activity, return, and browser back/forward use one document apart from the requested refresh');
  await page.locator('.lp-card').last().locator('a').click();await page.locator('#iwDecisionForm').waitFor();
  await page.locator('#iwNotes').fill('Evidence can confirm access without proving bulk extraction.');
  await page.locator('.practice-return a').click();await page.locator('#lessonPracticeHeading').waitFor();
  check(await page.evaluate(()=>STATE.investigations['cross-tenant-api'].notes)==='Evidence can confirm access without proving bulk extraction.','returning from a case flushes pending analyst notes');
  check((await page.locator('[data-practice-status="investigations/cross-tenant-api"]').innerText())==='Ready whenever you are','opening evidence alone does not claim findings were reviewed');
  await page.locator('.lp-card').last().locator('a').click();await page.locator('#iwDecisionForm').waitFor();
  for(const fieldset of await page.locator('#iwDecisionForm fieldset').all())await fieldset.locator('input').first().check();
  await page.locator('#iwSubmit').click();await page.locator('#iwResultHeading').waitFor();
  await page.locator('.practice-return a').click();await page.locator('#lessonPracticeHeading').waitFor();
  check((await page.locator('[data-practice-status="investigations/cross-tenant-api"]').innerText()).includes('Findings reviewed')&&!await page.evaluate(()=>isComplete('11-web-security','idor')),'reviewed findings update the case label without claiming reading completion or mastery');
  await navigate(page,'#/lesson/10-fundamentals/phishing');await page.locator('#lessonPracticeHeading').waitFor();
  await page.locator('#completeBtn').click();
  check((await page.locator('[data-practice-status="investigations/mailbox-takeover"]').innerText())==='Ready whenever you are','marking reading complete does not mark its activities complete');
  await navigate(page,'#/lesson/11-web-security/idor');await page.locator('#lessonPracticeHeading').waitFor();
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} lesson practice fits ${width}px`);
    }
  }
  for(const from of ['https://evil.example/','javascript:alert(1)','<img src=x onerror=alert(1)>','11-web-security/missing','03-linux/terminal-basics']){
    await navigate(page,'#/playground/access?from='+encodeURIComponent(from));await page.locator('#pgRequest').waitFor();
    check(await page.locator('.practice-return').count()===0&&await page.locator('.pg-next a').getAttribute('href')==='#/investigations/cross-tenant-api','invalid or unrelated lesson context falls back to normal activity navigation');
  }
  await navigate(page,'#/lesson/03-linux/terminal-basics');await page.locator('#content[aria-busy="false"]').waitFor();
  check(await page.locator('.lesson-practice,#jumpLessonPractice').count()===0,'unrelated lessons stay uncluttered');
  check(errors.length===0,'practice bridge flows produce no JavaScript errors');
  for(const [kind,id] of [['playground','access'],['investigations','cross-tenant-api']]){
    check(await page.evaluate(({kind,id})=>{
      const helper=practiceReturnHTML;
      try{
        practiceReturnHTML=undefined;
        if(kind==='playground')KashPlayground.renderExercise(id);else KashInvestigations.renderCase(id);
        return !!document.getElementById(kind==='playground'?'pgRequest':'iwDecisionForm')&&!document.querySelector('.practice-return');
      }finally{practiceReturnHTML=helper;}
    },{kind,id}),`${kind} bundle still supports an older cached shell calling it without lesson context`);
    check(await page.evaluate(({kind,id})=>{
      const module=kind==='playground'?KashPlayground:KashInvestigations;
      const method=kind==='playground'?'renderExercise':'renderCase';
      const original=module[method];let received;
      try{
        module[method]=activityId=>{received=activityId;app.innerHTML='<h1>Previously cached activity</h1>';};
        navigateTo(`#/${kind}/${id}?from=11-web-security%2Fidor`);
        return received===id&&app.querySelector('h1').textContent==='Previously cached activity';
      }finally{module[method]=original;}
    },{kind,id}),`${kind} loader passes a plain ID that an older cached activity bundle can still render`);
  }
  await context.close();
  const synced=await contextFor();
  await synced.addInitScript(()=>{
    const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});
    window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'lp-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{window.__mergeStarted=true;await ready;return {data:{state:{playgroundCompleted:{access:100},investigations:{'cross-tenant-api':{answers:{},reviewed:[],notes:'',updatedAt:100,submittedAt:100,bestScore:1,attempts:1}}}}};},upsert:async()=>{window.__merged=true;return {};},order(){return this;},limit:async()=>({data:[]})})})};
  });
  const syncPage=await synced.newPage();await syncPage.goto(BASE+'/lesson/11-web-security/idor.html');await syncPage.locator('#lessonPracticeHeading').waitFor();
  await syncPage.waitForFunction(()=>window.__mergeStarted);await syncPage.locator('.notes-panel summary').click();await syncPage.locator('#lessonNotes').fill('Keep this draft while progress arrives.');
  const generation=await syncPage.evaluate(()=>renderGeneration);await syncPage.evaluate(()=>window.__releaseMerge());await syncPage.waitForFunction(()=>window.__merged);
  await syncPage.waitForFunction(()=>document.querySelector('[data-practice-status="playground/access"]').textContent.includes('completed'));
  check((await syncPage.locator('[data-practice-status="investigations/cross-tenant-api"]').innerText()).includes('Findings reviewed')&&await syncPage.locator('#lessonNotes').inputValue()==='Keep this draft while progress arrives.'&&await syncPage.evaluate(()=>renderGeneration)===generation,'late account sync updates activity labels without replacing the lesson or its note draft');
  await synced.close();
  const offline=await contextFor({serviceWorkers:'allow'});const offlinePage=await offline.newPage();
  await offlinePage.goto(BASE+'/lesson/02-networking/dns.html');await offlinePage.locator('#content[aria-busy="false"]').waitFor();
  await offlinePage.locator('.lp-card a').click();await offlinePage.locator('#pgJourney').waitFor();
  // Resolve cache reads before polling their boolean result. Treating an
  // asynchronous predicate itself as ready can take the page offline while
  // its first worker is still installing and the shell cache is empty.
  let offlineReady=false;
  for(let attempt=0;attempt<100&&!offlineReady;attempt++){
    offlineReady=await offlinePage.evaluate(async()=>!!navigator.serviceWorker.controller&&!!(await caches.match(new URL('playground.js',location.origin).href))&&!!(await caches.match(new URL('course/02-networking/dns.md',location.origin).href)));
    if(!offlineReady)await offlinePage.waitForTimeout(100);
  }
  check(offlineReady,'the real offline controller and both cached resources are ready before disconnecting');
  const offlineSnapshot=await offlinePage.evaluate(async()=>({url:location.href,caches:await caches.keys(),worker:navigator.serviceWorker.controller?.scriptURL}));
  await offline.setOffline(true);
  try { await offlinePage.reload();await offlinePage.locator('#pgJourney').waitFor(); } catch(error) {
    console.log('Offline diagnostics before disconnecting:',offlineSnapshot);
    throw error;
  }
  await offlinePage.locator('.practice-return a').click();await offlinePage.locator('#content[aria-busy="false"]').waitFor();
  check((await offlinePage.locator('#content h1').innerText()).includes('DNS')&&await offlinePage.locator('#retryLesson').count()===0,'an opened lesson and experiment can be revisited and linked offline');
  await offline.close();
  console.log(`\n  Lesson practice: ${checks} checks passed\n`);
}finally{await browser.close();}
