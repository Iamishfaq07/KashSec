#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import {chromium} from 'playwright';
const BASE=process.env.BASE || 'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;console.log(`  ✓ ${message}`);};
async function makeContext(state={},options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',...options});
  context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(state=>{
    if(!sessionStorage.getItem('sg-seeded')){
      sessionStorage.setItem('sg-seeded','1');localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...state}));
    }
  },state);
  return context;
}
async function choose(page,experience,focus){
  await page.locator(`input[name="experience"][value="${experience}"]`).check();
  await page.locator(`input[name="focus"][value="${focus}"]`).check();
}
async function save(page){await page.locator('#sgSave').click();}
async function open(page){await page.evaluate(()=>navigateTo('#/start'));await page.locator('#sgForm').waitFor();}
try{
  const sandbox={window:{}};
  for(const file of ['playground.js','investigations.js','learning-guide.js'])vm.runInNewContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),sandbox);
  const guide=sandbox.window.KashLearningGuide;
  const cases=sandbox.window.KashInvestigations.CASES;
  const exercises=sandbox.window.KashPlayground.EXERCISES;
  const appJs=await readFile(new URL('../app.js',import.meta.url),'utf8');
  const paths=new Function(appJs.match(/const PATHS = \[[\s\S]*?\n\];/)[0]+'; return PATHS;')();
  for(const focus of guide.FOCUSES){
    for(const experience of guide.EXPERIENCES){
      const route=guide.ROUTES[focus.id][experience.id];
      assert.ok(paths.some(path=>path.id===route.path));
      assert.ok(route.steps.length>=3 && new Set(route.steps.map(step=>step.href)).size===route.steps.length);
      for(const step of route.steps){
        if(step.kind==='lesson'){
          assert.ok(paths.find(path=>path.id===step.path)?.subs.some(sub=>sub.id===step.id));
          await access(new URL(`../lesson/${step.path}/${step.id}.html`,import.meta.url));
        }else if(step.kind==='experiment')assert.ok(exercises.some(item=>item.id===step.id));
        else assert.ok(cases.some(item=>item.id===step.id));
      }
      check(true,`${focus.id}/${experience.id} connects real, distinct learning activities`);
    }
  }
  const context=await makeContext({studyPlan:{pathId:'03-linux',dailyGoal:7,updatedAt:100},notes:{'03-linux/terminal-basics':'Keep these notes'}});
  const page=await context.newPage();const errors=[];let documents=0,bundles=0;
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;if(new URL(r.url()).pathname.endsWith('/learning-guide.js'))bundles++;});
  await page.goto(BASE+'/');
  check(bundles===0,'Home does not download the starting-guide bundle');
  await page.getByRole('link',{name:'Find my starting point',exact:true}).click();
  await page.locator('#sgForm').waitFor();
  const generation=await page.evaluate(()=>renderGeneration);
  check(bundles===1 && await page.locator('.sg-steps>li').count()===4 && await page.evaluate(()=>STATE.learningGuide.updatedAt)===0,'the guide opens an unsaved beginner preview');
  check(await page.locator('#sgContinue').getAttribute('href')==='#/lesson/00-fresher-basics/what-is-a-computer','the first beginner step starts with computer basics');
  await choose(page,'some','web');
  check(await page.locator('.sg-steps>li').count()===3 && await page.evaluate(()=>STATE.learningGuide.focus)==='basics' && await page.evaluate(()=>STATE.studyPlan.pathId)==='03-linux','previewing choices leaves saved preferences and the planner unchanged');
  await save(page);
  check(await page.evaluate(()=>STATE.learningGuide.focus==='web'&&STATE.learningGuide.experience==='some'&&STATE.learningGuide.updatedAt>0&&renderGeneration)===generation,'saving a route persists it without rerouting');
  await choose(page,'practice','defense');
  await page.reload();await page.locator('#sgForm').waitFor();
  check(await page.locator('input[name="focus"][value="web"]').isChecked() && await page.locator('input[name="experience"][value="some"]').isChecked(),'reloading restores saved choices rather than an unsaved preview');
  await page.locator('#sgUsePlanner').click();
  check(await page.evaluate(()=>STATE.studyPlan.pathId==='21-api-security'&&STATE.studyPlan.dailyGoal===7),'the explicit planner action sets the focus and keeps the daily goal');
  await page.getByRole('link',{name:'Open study planner →',exact:true}).click();
  await page.locator('#studyPlanForm').waitFor();
  check(await page.locator('#studyPath').inputValue()==='21-api-security' && await page.locator('#studyGoal').inputValue()==='7','the existing planner uses the selected guide focus');
  await open(page);await choose(page,'new','basics');await save(page);
  await page.locator('#sgJump').focus();await page.keyboard.press('Enter');
  check(await page.evaluate(()=>document.activeElement.id)==='sgRouteHeading','the route jump works by keyboard and focuses its heading');
  await page.locator('#sgContinue').click();
  await page.locator('#completeBtn').click();
  await page.getByRole('link',{name:'Back to my starting route',exact:true}).click();
  await page.locator('#sgForm').waitFor();
  check(await page.locator('#sgProgressCount').innerText()==='1 of 4 explored' && await page.locator('#sgContinue').getAttribute('href')==='#/playground/network','marking a real lesson complete advances the next step');
  await page.locator('#sgContinue').click();await page.locator('#pgNext').waitFor();
  for(let i=0;i<5;i++)await page.locator('#pgNext').click();
  await page.locator('#pgChangeTrip').click();await page.locator('#pgNext').click();
  await page.getByRole('link',{name:'Back to my starting route →',exact:true}).click();
  await page.locator('#sgForm').waitFor();
  check(await page.locator('#sgProgressCount').innerText()==='2 of 4 explored','finishing a real experiment updates route progress');
  await choose(page,'practice','web');await save(page);
  await page.locator('#sgContinue').click();await page.locator('#iwDecisionForm').waitFor();
  for(const q of cases.find(item=>item.id==='cross-tenant-api').questions)await page.locator(`input[name="${q.id}"][value="${q.correct}"]`).check();
  await page.locator('#iwSubmit').click();await page.locator('#iwResultHeading').waitFor();
  await page.getByRole('link',{name:'Back to my starting route →',exact:true}).click();
  await page.locator('#sgForm').waitFor();
  check(await page.locator('#sgProgressCount').innerText()==='1 of 3 explored' && await page.locator('#sgContinue').getAttribute('href')==='#/lesson/21-api-security/bola-and-bfla','reviewing a real case advances the route to its lesson');
  await page.evaluate(()=>{
    for(const step of KashLearningGuide.ROUTES.web.practice.steps){
      if(step.kind==='lesson')STATE.completed[lessonKey(step.path,step.id)]=Date.now();
      if(step.kind==='experiment')STATE.playgroundCompleted[step.id]=Date.now();
    }
    saveState();currentStartGuideRefresh();
  });
  check(await page.locator('#sgContinue').count()===0 && (await page.locator('#sgNext').innerText()).includes('every step'),'a finished route offers review and course continuation without a broken next link');
  await page.evaluate(()=>navigateTo('#/progress'));
  const downloadReady=page.waitForEvent('download');await page.locator('#exportProgressBtn').click();
  const backup=await readFile(await(await downloadReady).path());
  check(JSON.parse(backup).learningGuide.focus==='web','progress exports include saved route choices');
  await page.evaluate(()=>{STATE.learningGuide={experience:'new',focus:'basics',updatedAt:0};saveState();});
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#importProgressFile').setInputFiles({name:'starting-route.json',mimeType:'application/json',buffer:backup});
  await page.waitForFunction(()=>STATE.learningGuide.focus==='web');await open(page);
  check(await page.locator('input[name="experience"][value="practice"]').isChecked() && await page.evaluate(()=>STATE.notes['03-linux/terminal-basics'])==='Keep these notes','import restores the route while preserving the rest of the backup');
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} starting guide fits ${width}px`);
    }
  }
  check(documents===2,'route previews, save actions, and activity links do not reload the document');
  check(errors.length===0,'starting-guide flows produce no JavaScript errors');
  await context.close();

  const damaged=await makeContext({learningGuide:{experience:'bad',focus:null,updatedAt:1e99},completed:{'03-linux/terminal-basics':1730000000000}});
  const damagedPage=await damaged.newPage();await damagedPage.goto(BASE+'/#/start');await damagedPage.locator('#sgForm').waitFor();
  check(await damagedPage.evaluate(()=>STATE.learningGuide.experience==='new'&&STATE.learningGuide.focus==='basics'&&STATE.learningGuide.updatedAt===0&&!!STATE.completed['03-linux/terminal-basics']&&!!localStorage.getItem('kashsec_state_recovery_v1')),'damaged guide settings recover without losing lesson progress');
  await damaged.close();

  for(const mode of ['remote','local','dirty','invalid']){
    const synced=await makeContext({learningGuide:{experience:'new',focus:'basics',updatedAt:mode==='local'?300:100}});
    await synced.addInitScript(mode=>{
      const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});window.__writes=0;
      window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'sg-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{window.__mergeStarted=true;await ready;return {data:{state:{learningGuide:{experience:'practice',focus:mode==='invalid'?'unknown':'web',updatedAt:200},playgroundCompleted:{network:100}}}};},upsert:async()=>{window.__writes++;return {};},order(){return this;},limit:async()=>({data:[]})})})};
    },mode);
    const syncPage=await synced.newPage();await syncPage.goto(BASE+'/#/start');await syncPage.locator('#sgForm').waitFor();
    await syncPage.waitForFunction(()=>window.__mergeStarted);const before=await syncPage.evaluate(()=>renderGeneration);
    if(mode==='dirty')await choose(syncPage,'new','defense');
    await syncPage.evaluate(()=>window.__releaseMerge());await syncPage.waitForFunction(()=>window.__writes>0);
    await syncPage.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    const expected=mode==='remote'?'web':mode==='dirty'?'defense':'basics';
    check(await syncPage.locator(`input[name="focus"][value="${expected}"]`).isChecked() && await syncPage.evaluate(()=>renderGeneration)===before,`${mode} sync keeps the appropriate choices without rerouting`);
    if(mode==='dirty'){
      check(await syncPage.locator('#sgProgressCount').innerText()==='1 of 4 explored','late progress sync updates the preview without resetting unsaved choices');
      await save(syncPage);check(await syncPage.evaluate(()=>STATE.learningGuide.focus)==='defense','unsaved choices can be saved after a late merge');
    }
    await synced.close();
  }
  for(const mode of ['unavailable','empty']){
    const failed=await makeContext();
    await failed.route('**/learning-guide.js',r=>r.fulfill({status:mode==='empty'?200:503,contentType:'application/javascript',body:'/* bundle unavailable */'}),{times:1});
    const failedPage=await failed.newPage();await failedPage.goto(BASE+'/#/start');await failedPage.locator('#sgLoadRetry').click();await failedPage.locator('#sgForm').waitFor();
    check(await failedPage.locator('.sg-steps>li').count()===4,`${mode} guide loading offers a working retry`);await failed.close();
  }
  const delayed=await makeContext();let held,release;const heldReady=new Promise(resolve=>{release=resolve;});
  await delayed.route('**/learning-guide.js',r=>{held=r;release();},{times:1});
  const delayedPage=await delayed.newPage();await delayedPage.goto(BASE+'/lesson/');await delayedPage.evaluate(()=>navigateTo('#/start'));await heldReady;
  await delayedPage.evaluate(()=>navigateTo('#/labs'));await held.fulfill({response:await held.fetch()});await delayedPage.waitForFunction(()=>!!window.KashLearningGuide);
  check(await delayedPage.locator('.lab-card').count()>0 && await delayedPage.locator('#sgForm').count()===0,'late guide loading cannot replace a page selected afterwards');await delayed.close();

  const offline=await makeContext({}, {serviceWorkers:'allow'});const offlinePage=await offline.newPage();
  await offlinePage.goto(BASE+'/#/start');await offlinePage.locator('#sgForm').waitFor();
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await offlinePage.waitForFunction(async()=>!!(await caches.match(new URL('learning-guide.js',location.origin).href)));
  await offline.setOffline(true);await offlinePage.reload();await offlinePage.locator('#sgForm').waitFor();
  await choose(offlinePage,'some','web');await save(offlinePage);
  check(await offlinePage.evaluate(()=>JSON.parse(localStorage.getItem('kashsec_state_v1')).learningGuide.focus)==='web' && await offlinePage.locator('.sg-steps>li').count()===3,'the guide reloads, previews routes, and saves choices offline');
  await offline.close();
  console.log(`\n  Starting guide: ${checks} checks passed\n`);
}finally{await browser.close();}
