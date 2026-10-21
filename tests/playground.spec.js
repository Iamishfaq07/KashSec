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
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(BASE).origin?route.continue():route.abort());
  await context.addInitScript(state=>{
    if(!sessionStorage.getItem('pg-seeded')){
      sessionStorage.setItem('pg-seeded','1');localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...state}));
    }
  },state);
  return context;
}
async function open(page,id){
  await page.evaluate(id=>navigateTo('#/playground'+(id?'/'+id:'')),id);
  await page.locator(id?'#pgExperiment':'.pg-grid').waitFor();
}
async function steps(page,count){for(let i=0;i<count;i++)await page.locator('#pgNext').click();}
try{
  const sandbox={window:{}};
  vm.runInNewContext(await readFile(new URL('../playground.js',import.meta.url),'utf8'),sandbox);
  const exercises=sandbox.window.KashPlayground.EXERCISES;
  check(exercises.length===3 && new Set(exercises.map(item=>item.id)).size===3,'three distinct beginner experiments are registered');
  for(const item of exercises){
    if(item.next.startsWith('#/lesson/'))await access(new URL('../lesson/'+item.next.slice(9)+'/index.html',import.meta.url));
    check(item.goal.length>20 && item.source.startsWith('https://'),`${item.id} has a learning goal, next step, and reference`);
  }
  const context=await makeContext();
  const page=await context.newPage();
  const errors=[];let documents=0,bundles=0;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;if(new URL(r.url()).pathname.endsWith('/playground.js'))bundles++;});
  await page.goto(BASE+'/lesson/');
  check(bundles===0,'Course does not download the experiment bundle');
  await page.getByRole('link',{name:'Try the beginner Learning Playground →'}).click();
  await page.locator('.pg-grid').waitFor();
  check(bundles===1 && await page.locator('.pg-card').count()===3,'the beginner entry opens three experiments on demand');
  await page.locator('a[href="#/playground/network"]').click();
  await page.locator('#pgJourney').waitFor();
  check(await page.locator('#pgBack').isDisabled() && await page.locator('[aria-current="step"]').textContent()==='1Start with a name','network exploration starts at a clearly labelled first step');
  await steps(page,5);
  check((await page.locator('#pgJourneyFeedback').innerText()).includes('200 OK') && await page.locator('#pgNext').isDisabled(), 'the successful trip ends with a page response');
  check(await page.locator('#pgComplete').isHidden(),'one successful trip still leaves the blocked-trip goal to explore');
  await page.getByRole('button',{name:'Try a blocked trip',exact:true}).click();
  check(await page.locator('#pgJourney').inputValue()==='dns' && await page.locator('#pgNext').isEnabled(),'a completed trip offers a direct next experiment without scrolling back to the settings');
  await steps(page,1);
  check(/name could not be found/.test(await page.locator('#pgJourneyFeedback').innerText()) && await page.locator('#pgNext').isDisabled(), 'a name lookup failure stops before a server connection');
  check(await page.locator('#pgComplete').isVisible() && await page.evaluate(()=>!!STATE.playgroundCompleted.network),'success and failure exploration save the completed network experiment');
  await page.locator('#pgBack').click();
  check(await page.locator('#pgBack').isDisabled() && await page.locator('#pgNext').isEnabled(),'previous-step navigation stays within the trip');
  await page.locator('#pgJourney').selectOption('certificate');
  await steps(page,3);
  check((await page.locator('#pgJourneyFeedback').innerText()).includes('certificate check failed') && await page.locator('#pgNext').isDisabled() && !(await page.locator('#pgJourneyFeedback').innerText()).includes('GET / sent'),'a failed certificate check stops before the page request');
  await page.locator('#pgRestart').click();
  check(await page.locator('[aria-current="step"]').getAttribute('data-stage')==='0','restart returns to the first step without clearing completion');

  await open(page,'encoding');
  const phrase='Hello नमस्ते 👋';
  await page.getByLabel('Type a short message',{exact:true}).fill(phrase);
  check(await page.locator('#pgByteCount').innerText()===`${Buffer.byteLength(phrase)} bytes`,'the byte display correctly handles mixed scripts and emoji');
  await page.locator('#pgEncode').click();
  check(await page.locator('#pgBase64').inputValue()===Buffer.from(phrase).toString('base64'),'UTF-8 text encodes to the expected Base64');
  await page.locator('#pgDecode').click();
  check(await page.locator('#pgEncodingFeedback p').innerText()===phrase && await page.locator('#pgComplete').isVisible(),'decoding restores the same Unicode message and completes the goal');
  const raw=await page.evaluate(()=>localStorage.getItem('kashsec_state_v1'));
  check(!raw.includes(phrase) && !raw.includes(Buffer.from(phrase).toString('base64')),'typed messages and their encoded representation are not saved');
  await page.locator('#pgBase64').fill('%%%');
  await page.locator('#pgDecode').click();
  check((await page.locator('#pgEncodingFeedback').innerText()).includes('did not decode'),'invalid Base64 gets a readable recovery message');
  await page.locator('#pgBase64').fill('/w==');
  await page.locator('#pgDecode').click();
  check((await page.locator('#pgEncodingFeedback').innerText()).includes('non-text bytes'),'invalid UTF-8 bytes are explained rather than silently replaced');
  await page.locator('#pgMessage').fill('<img src=x onerror="window.BAD=true">');
  await page.locator('#pgEncode').click();await page.locator('#pgDecode').click();
  check(await page.locator('#pgEncodingFeedback img').count()===0 && !await page.evaluate(()=>window.BAD),'decoded markup stays plain text');
  await page.locator('#pgMessage').fill('');await page.locator('#pgEncode').click();
  check((await page.locator('#pgEncodingFeedback').innerText()).includes('Add a message first'),'empty text receives a clear next step');
  await page.locator('#pgResetEncoding').click();
  check(await page.locator('#pgMessage').inputValue()==='Hello 👋' && await page.locator('#pgBase64').inputValue()==='' && await page.locator('#pgComplete').isVisible(),'encoding can restart with a fresh message while keeping completed progress');

  await open(page,'access');
  await page.locator('#pgRequest').click();
  check((await page.locator('#pgAccessFeedback').innerText()).includes('wrong invoice'),'the missing check demonstrates cross-customer disclosure');
  await page.getByLabel('Make the server check invoice ownership (authorisation)',{exact:true}).check();
  check((await page.locator('#pgAccessFeedback').innerText()).includes('Settings changed'),'changing a setting clears the stale request result');
  await page.locator('#pgRequest').click();
  check((await page.locator('#pgAccessFeedback').innerText()).includes('403'),'the ownership check denies the other customer');
  await page.getByLabel('Invoice owner',{exact:true}).selectOption('acme');
  await page.locator('#pgRequest').click();
  check((await page.locator('#pgAccessFeedback').innerText()).includes('200') && await page.locator('#pgComplete').isVisible(),'the ownership check allows the correct customer and completes the goals');
  await page.getByLabel('I am signed in (authentication)',{exact:true}).uncheck();
  await page.locator('#pgRequest').click();
  check((await page.locator('#pgAccessFeedback').innerText()).includes('401') && !(await page.locator('#pgAccessFeedback').innerText()).includes('200'),'signed-out requests return no invoice regardless of ownership');
  await page.locator('#pgResetAccess').click();
  check(await page.locator('#pgOwnership').isChecked()===false && await page.locator('#pgSignedIn').isChecked() && await page.locator('#pgComplete').isVisible(),'reset restores the demo and retains completed progress');
  check(documents===1,'all experiment interactions retain the current document');
  await open(page);
  check(await page.locator('#pgTotal').innerText()==='3 of 3 experiments completed','the playground summarises completed experiments');
  await page.reload();await page.locator('#pgTotal').waitFor();
  check(await page.locator('#pgTotal').innerText()==='3 of 3 experiments completed','completion survives a reload');
  await page.evaluate(()=>navigateTo('#/progress'));
  const ready=page.waitForEvent('download');await page.locator('#exportProgressBtn').click();
  const backup=await readFile(await(await ready).path());
  check(Object.keys(JSON.parse(backup).playgroundCompleted).length===3,'progress backups include completed experiments');
  await page.evaluate(()=>{STATE.playgroundCompleted={};saveState();});
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#importProgressFile').setInputFiles({name:'playground.json',mimeType:'application/json',buffer:backup});
  await page.waitForFunction(()=>Object.keys(STATE.playgroundCompleted).length===3);
  await open(page);
  check(await page.locator('#pgTotal').innerText()==='3 of 3 experiments completed','import restores completed experiments');
  for(const theme of ['light','dark']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const id of ['network','encoding','access']){
      await open(page,id);
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`${theme}/${id}/${width} has no overflow`);
      }
      check(true,`${theme} ${id} experiment fits phone, tablet, and desktop widths`);
    }
  }
  await page.evaluate(()=>navigateTo('#/investigations/cross-tenant-api'));
  await page.locator('#iwDecisionForm').waitFor();
  await page.getByText('First investigation? Follow these three steps',{exact:true}).click();
  check(await page.locator('.iw-guide ol li').count()===3,'investigations offer a readable three-step starting guide');
  await page.getByText('Explain the terms in this case',{exact:true}).click();
  check(await page.locator('.iw-terms dt').count()===3,'case terms have plain-language explanations');
  await page.locator('.iw-hint summary').first().click();
  await page.locator('[data-hint-ref]').first().click();
  check(await page.locator('#iwEvidencePanel').getAttribute('aria-labelledby')==='iwTab-requests' && await page.locator('#iwResultHeading').count()===0,'optional hints open relevant evidence without revealing the debrief');
  check(errors.length===0,'guided learning produces no JavaScript errors');
  await context.close();

  const failed=await makeContext();
  await failed.route('**/playground.js',r=>r.fulfill({status:503,body:'Unavailable'}),{times:1});
  const failedPage=await failed.newPage();await failedPage.goto(BASE+'/#/playground');
  await failedPage.locator('#pgLoadRetry').click();await failedPage.locator('.pg-grid').waitFor();
  check(await failedPage.locator('.pg-card').count()===3,'a failed playground load has a working retry');
  await failedPage.evaluate(()=>navigateTo('#/playground/unknown'));
  await failedPage.waitForFunction(()=>!document.querySelector('.loading'));
  check(await failedPage.locator('#pgExperiment').count()===0 && await failedPage.locator('#app h1').count()===1,'unknown experiments show a safe not-found page');
  await failed.close();

  const delayed=await makeContext();let held,release;
  const heldReady=new Promise(resolve=>{release=resolve;});
  await delayed.route('**/playground.js',r=>{held=r;release();},{times:1});
  const delayedPage=await delayed.newPage();await delayedPage.goto(BASE+'/lesson/');
  await delayedPage.evaluate(()=>navigateTo('#/playground'));await heldReady;
  await delayedPage.evaluate(()=>navigateTo('#/labs'));
  await held.fulfill({response:await held.fetch()});await delayedPage.waitForFunction(()=>!!window.KashPlayground);
  check(await delayedPage.locator('.lab-card').count()>0 && await delayedPage.locator('.pg-card').count()===0,'late experiment loading cannot replace a page selected afterwards');
  await delayed.close();

  const synced=await makeContext({playgroundCompleted:{network:100}});
  await synced.addInitScript(()=>{
    const ready=new Promise(resolve=>{window.__releaseMerge=resolve;});window.__writes=0;
    window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'pg-test',email:'learner@example.test'}}}}),onAuthStateChange(){}},from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{window.__mergeStarted=true;await ready;return {data:{state:{playgroundCompleted:{encoding:200}}}};},upsert:async()=>{window.__writes++;return {};},order(){return this;},limit:async()=>({data:[]})})})};
  });
  const syncPage=await synced.newPage();await syncPage.goto(BASE+'/#/playground');await syncPage.locator('#pgTotal').waitFor();
  const generation=await syncPage.evaluate(()=>renderGeneration);await syncPage.waitForFunction(()=>window.__mergeStarted);
  await syncPage.evaluate(()=>window.__releaseMerge());await syncPage.waitForFunction(()=>window.__writes>0);
  await syncPage.waitForFunction(()=>document.getElementById('pgTotal').textContent.startsWith('2 of'));
  check(await syncPage.evaluate(()=>!!STATE.playgroundCompleted.network && !!STATE.playgroundCompleted.encoding && renderGeneration)===generation,'cloud completion merges additively without rerouting');
  await synced.close();

  const offline=await makeContext({}, {serviceWorkers:'allow'});
  const offlinePage=await offline.newPage();await offlinePage.goto(BASE+'/#/playground/encoding');await offlinePage.locator('#pgMessage').waitFor();
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await offlinePage.waitForFunction(async()=>!!(await caches.match(new URL('playground.js',location.origin).href)));
  await offline.setOffline(true);await offlinePage.reload();await offlinePage.locator('#pgMessage').waitFor();
  await offlinePage.locator('#pgEncode').click();await offlinePage.locator('#pgDecode').click();
  check(await offlinePage.locator('#pgComplete').isVisible(),'opened experiments reload, explain results, and save completion offline');
  await offline.close();
  console.log(`\n  Learning Playground: ${checks} checks passed\n`);
}finally{await browser.close();}
