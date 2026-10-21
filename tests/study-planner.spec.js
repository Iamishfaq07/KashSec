#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
let checks = 0;
const check = (value, message)=>{ assert.ok(value, message); checks++; console.log(`  ✓ ${message}`); };
async function makeContext(state = {}, options = {}){
  const context = await browser.newContext({timezoneId:'Asia/Kolkata', serviceWorkers:'block', ...options});
  context.setDefaultTimeout(10000);
  await context.route('**/*', route=>new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
  await context.addInitScript(state=>{
    if(!sessionStorage.getItem('planner-seeded')){
      sessionStorage.setItem('planner-seeded', '1');
      localStorage.setItem('kashsec_state_v1', JSON.stringify({tourSeen:true, ...state}));
    }
    window.__documentToken = Math.random();
  }, state);
  return context;
}
async function openPlanner(context){
  const page = await context.newPage();
  await page.goto(BASE + '/#/planner');
  await page.locator('#studyPlanForm').waitFor();
  return page;
}
async function savePlan(page, pathId, goal){
  await page.getByLabel('Learning focus').selectOption(pathId);
  await page.getByLabel('Lessons per day', {exact:true}).fill(String(goal));
  await page.getByRole('button', {name:'Save plan', exact:true}).click();
}
try {
  const context = await makeContext({notes:{'03-linux/terminal-basics':'Keep this note'}});
  const page = await openPlanner(context);
  const errors = [];
  page.on('pageerror', error=>errors.push(error.message));
  const token = await page.evaluate(()=>window.__documentToken);
  const generation = await page.evaluate(()=>renderGeneration);
  check(await page.locator('.study-queue li').count() === 2 &&
    await page.getByLabel('Learning focus').inputValue() === 'all', 'older progress receives a useful default plan');
  await savePlan(page, '03-linux', 3);
  check(await page.locator('#studyPlanStatus').textContent() === 'Study plan saved.' &&
    await page.locator('.study-queue li').count() === 3 &&
    await page.evaluate(()=>renderGeneration) === generation &&
    await page.evaluate(()=>window.__documentToken) === token, 'saving updates the plan without refreshing or rerouting');
  const saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('kashsec_state_v1')).studyPlan);
  check(saved.pathId === '03-linux' && saved.dailyGoal === 3 && saved.updatedAt > 0,
    'the chosen path and daily goal are saved');
  for(const value of ['0', '11', '1.5']){
    await page.getByLabel('Lessons per day', {exact:true}).fill(value);
    await page.getByRole('button', {name:'Save plan', exact:true}).click();
    check(await page.evaluate(()=>STATE.studyPlan.dailyGoal) === 3, `invalid goal ${value} cannot replace the saved plan`);
  }
  await page.reload();
  check(await page.getByLabel('Learning focus').inputValue() === '03-linux' &&
    await page.getByLabel('Lessons per day', {exact:true}).inputValue() === '3' &&
    await page.evaluate(()=>STATE.notes['03-linux/terminal-basics']) === 'Keep this note', 'reloading restores the plan and keeps existing notes');
  const firstHref = await page.locator('.study-lesson').first().getAttribute('href');
  await page.locator('.study-lesson').first().click();
  await page.locator('#completeBtn').click();
  await page.getByRole('link', {name:'Back to my study plan'}).click();
  check(await page.locator('#studyTodayCount').textContent() === '1' &&
    await page.locator('.study-queue li').count() === 2 &&
    await page.locator(`.study-lesson[href="${firstHref}"]`).count() === 0,
    'completing a queued lesson updates today and suggests the remaining work');
  check((await page.locator('.study-lesson').evaluateAll(links=>links.map(link=>link.getAttribute('href'))))
    .every(href=>href.startsWith('#/lesson/03-linux/')), 'every suggestion stays within the chosen path');

  await page.evaluate(()=>navigateTo('#/progress'));
  const downloadReady = page.waitForEvent('download');
  await page.locator('#exportProgressBtn').click();
  const backup = await readFile(await (await downloadReady).path());
  check(JSON.parse(backup).studyPlan.dailyGoal === 3, 'progress exports include the saved study plan');
  await page.getByRole('link', {name:'Open study planner →'}).click();
  await savePlan(page, 'all', 1);
  await page.evaluate(()=>navigateTo('#/progress'));
  page.once('dialog', dialog=>dialog.accept());
  await page.locator('#importProgressFile').setInputFiles({name:'planner-backup.json',mimeType:'application/json',buffer:backup});
  await page.waitForFunction(()=>STATE.studyPlan.dailyGoal === 3);
  await page.getByRole('link', {name:'Open study planner →'}).click();
  check(await page.getByLabel('Learning focus').inputValue() === '03-linux', 'importing a backup restores the saved plan');
  await savePlan(page,'03-linux',1);
  check(await page.locator('#studyTodayHeading').textContent() === 'Your daily goal is reached' &&
    await page.locator('.study-queue li').count() === 1, 'reaching the daily goal leaves a lesson ready for the next session');
  await page.evaluate(()=>navigateTo('#/course'));
  await page.getByRole('link', {name:'Open study planner →'}).click();
  check(await page.locator('#studyPlanForm').isVisible(), 'Course links directly to the saved planner');
  await page.evaluate(()=>navigateTo('#/course'));
  await page.keyboard.press('Control+k');
  await page.locator('#searchInput').fill('Study planner');
  await page.locator('#searchInput').press('Enter');
  await page.locator('#studyPlanForm').waitFor();
  check(page.url().endsWith('/#/planner'), 'the keyboard command palette opens the planner');

  const dates = await page.evaluate(()=>{
    // Sunday 23:59 and Monday 00:01 in India are both Sunday in UTC.
    STATE.studyPlan={pathId:'03-linux',dailyGoal:2,updatedAt:1};
    const keys=findPath('03-linux').subs.slice(0,3).map(sub=>lessonKey('03-linux',sub.id));
    STATE.completed={
      [keys[0]]:Date.parse('2026-10-25T18:29:00Z'),
      [keys[1]]:Date.parse('2026-10-25T18:31:00Z')
    };
    const sunday=studyPlanSnapshot(new Date('2026-10-25T18:29:30Z'));
    const monday=studyPlanSnapshot(new Date('2026-10-25T18:32:00Z'));
    return {sun:sunday.today,mon:monday.today,sundayWeek:sunday.week.map(day=>day.key),mondayWeek:monday.week.map(day=>day.key),mondayCount:monday.week[0].count};
  });
  check(dates.sun === 1 && dates.mon === 1 && dates.mondayCount === 1 &&
    dates.sundayWeek[0] === '2026-10-19' && dates.sundayWeek[6] === '2026-10-25' &&
    dates.mondayWeek[0] === '2026-10-26', 'local midnight and Monday week boundaries count lessons on the correct day');

  await page.evaluate(()=>{
    findPath('03-linux').subs.forEach(sub=>{ STATE.completed[lessonKey('03-linux',sub.id)]=Date.now(); });
    currentPlannerRefresh();
  });
  check(await page.locator('.study-lesson').count() === 0 && await page.getByRole('link', {name:'Review flashcards →'}).isVisible(),
    'a completed focus offers review instead of a broken next lesson');
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();}, theme);
    for(const width of [320,390,768,1280]){
      await page.setViewportSize({width,height:900});
      check(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth) &&
        await page.locator('#studyPath').evaluate(el=>el.getBoundingClientRect().width >= 100), `${theme} planner fits ${width}px without horizontal overflow`);
    }
  }
  check(errors.length === 0, 'planner interactions produce no JavaScript errors');
  await context.close();

  const damaged = await makeContext({studyPlan:{pathId:'<bad>',dailyGoal:999,updatedAt:'bad'},completed:{'03-linux/terminal-basics':1730000000000}});
  const repaired = await openPlanner(damaged);
  check(await repaired.evaluate(()=>STATE.studyPlan.pathId === 'all' && STATE.studyPlan.dailyGoal === 2 &&
    !!STATE.completed['03-linux/terminal-basics'] && !!localStorage.getItem('kashsec_state_recovery_v1')),
    'damaged planning settings recover without losing lesson progress');
  await damaged.close();

  // Run the real sync merge with a delayed cloud response to catch late form resets.
  for(const scenario of ['remote','local','dirty','invalid']){
    const localPlan={pathId:'03-linux',dailyGoal:2,updatedAt:scenario === 'local' ? 300 : 100};
    const remotePlan={pathId:'02-networking',dailyGoal:scenario === 'invalid' ? 99 : 5,updatedAt:200};
    const synced=await makeContext({studyPlan:localPlan});
    await synced.addInitScript(remotePlan=>{
      const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});
      window.__syncWrites=0;
      window.supabase={createClient:()=>({
        auth:{getSession:async()=>({data:{session:{user:{id:'planner-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},
        from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{
          window.__mergeStarted=true;await ready;return {data:{state:{studyPlan:remotePlan}}};
        },upsert:async()=>{window.__syncWrites++;return {};},order(){return this;},limit:async()=>({data:[]})})
      })};
    },remotePlan);
    const syncedPage=await openPlanner(synced);
    await syncedPage.waitForFunction(()=>window.__mergeStarted);
    if(scenario === 'dirty') await syncedPage.getByLabel('Lessons per day', {exact:true}).fill('7');
    const before=await syncedPage.evaluate(()=>renderGeneration);
    await syncedPage.evaluate(()=>window.__releaseMerge());
    await syncedPage.waitForFunction(()=>window.__syncWrites > 0);
    await syncedPage.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    if(scenario === 'dirty'){
      check(await syncedPage.getByLabel('Lessons per day', {exact:true}).inputValue() === '7', 'late cloud sync preserves unsaved planning edits');
      await syncedPage.getByRole('button', {name:'Save plan',exact:true}).click();
      check(await syncedPage.evaluate(()=>STATE.studyPlan.dailyGoal) === 7, 'preserved edits can be saved after cloud sync');
    } else if(scenario === 'invalid'){
      check(await syncedPage.getByLabel('Lessons per day', {exact:true}).inputValue() === '2' &&
        await syncedPage.getByLabel('Learning focus').inputValue() === '03-linux', 'damaged cloud settings cannot overwrite a valid local plan');
    } else {
      check(await syncedPage.getByLabel('Lessons per day', {exact:true}).inputValue() === (scenario === 'remote' ? '5' : '2'),
        `${scenario === 'remote' ? 'newer cloud' : 'newer local'} settings win the sync merge`);
      check(await syncedPage.getByLabel('Learning focus').inputValue() === (scenario === 'remote' ? '02-networking' : '03-linux'),
        `${scenario} sync also restores the selected focus`);
    }
    check(await syncedPage.evaluate(()=>renderGeneration) === before, `${scenario} cloud merge keeps the current page steady`);
    await synced.close();
  }

  const offline=await makeContext({}, {serviceWorkers:'allow'});
  const offlinePage=await openPlanner(offline);
  await offlinePage.evaluate(async()=>{
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
  });
  await offline.setOffline(true);
  await offlinePage.reload();
  await savePlan(offlinePage,'03-linux',4);
  check(await offlinePage.locator('.study-queue li').count() === 4 &&
    await offlinePage.evaluate(()=>JSON.parse(localStorage.getItem('kashsec_state_v1')).studyPlan.dailyGoal) === 4,
    'the planner reloads and saves goals offline after the first visit');
  await offline.close();
  console.log(`\n  Study planner: ${checks} checks passed\n`);
} finally {
  await browser.close();
}
