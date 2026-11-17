#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import {chromium} from 'playwright';

const BASE=process.env.BASE || 'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;console.log(`  ✓ ${message}`);};
const sandbox={window:{}};
vm.runInNewContext(await readFile(new URL('../investigations.js',import.meta.url),'utf8'),sandbox);
const cases=sandbox.window.KashInvestigations.CASES;
async function contextFor(state={},options={}){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',...options});
  context.setDefaultTimeout(10000);
  await context.route('**/*',r=>new URL(r.request().url()).origin === new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(state=>{
    if(!sessionStorage.getItem('case-seeded')){
      sessionStorage.setItem('case-seeded','1');
      localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,...state}));
    }
    window.__documentToken=Math.random();
  },state);
  return context;
}
const openCase=async(page,id)=>{
  await page.evaluate(id=>navigateTo('#/investigations/'+id),id);
  await page.locator('#iwDecisionForm').waitFor();
};
async function answer(page,item,correct=true){
  for(const question of item.questions){
    const index=correct?question.correct:(question.correct+1)%question.options.length;
    await page.locator(`input[name="${question.id}"][value="${index}"]`).check();
  }
  await page.locator('#iwSubmit').click();
  await page.locator('#iwResultHeading').waitFor();
}
try{
  check(cases.length===4 && new Set(cases.map(item=>item.id)).size===cases.length,'four distinct investigation cases are available');
  for(const item of cases){
    check(item.evidence.length===3 && new Set(item.evidence.map(file=>file.id)).size===3 && item.evidence.every(file=>file.text.length>300),`${item.id}: evidence files are complete and distinct`);
    check(item.questions.length===3 && new Set(item.questions.map(q=>q.id)).size===3 &&
      item.questions.every(q=>q.correct>=0 && q.correct<q.options.length && q.why.length>100 && q.refs.every(ref=>item.evidence.some(file=>file.id===ref))),`${item.id}: decisions and evidence references are consistent`);
    for(const link of item.related) await access(new URL(`../lesson/${link.path}/index.html`,import.meta.url));
    check(item.sources.every(source=>source.url.startsWith('https://')),'case response guidance has direct primary references');
  }
  const context=await contextFor();
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let bundles=0,documents=0;
  page.on('request',r=>{if(new URL(r.url()).pathname.endsWith('/investigations.js'))bundles++;if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documents++;});
  await page.goto(BASE+'/lesson/');
  check(bundles===0,'opening Course does not download the investigation bundle');
  await page.evaluate(()=>navigateTo('#/labs'));
  await page.getByRole('link',{name:'Open the workbench →'}).click();
  await page.locator('.iw-card').first().waitFor();
  check(bundles===1 && await page.locator('.iw-card').count()===cases.length,'Labs opens the lazily loaded caseboard');
  await page.getByLabel('Focus',{exact:true}).selectOption('Cloud');
  check(await page.locator('.iw-card:visible').count()===1 && /outlived/.test(await page.locator('.iw-card:visible').innerText()),'the caseboard focus filter shows the matching discipline');
  await page.getByLabel('Focus',{exact:true}).selectOption('all');
  await page.locator('a[href="#/investigations/mailbox-takeover"]').click();
  await page.locator('#iwDecisionForm').waitFor();
  const generation=await page.evaluate(()=>renderGeneration);
  const token=await page.evaluate(()=>window.__documentToken);
  check(await page.locator('#iwInspected').textContent()==='1/3 opened' && await page.locator('#iwDebrief').textContent()==='', 'opening a case shows evidence without revealing the debrief');
  await page.locator('#iwSubmit').click();
  check(await page.locator('#iwResultHeading').count()===0,'an incomplete decision form cannot be reviewed');
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  check(await page.getByRole('tab',{selected:true}).getAttribute('id')==='iwTab-identity','keyboard arrows select and focus evidence tabs');
  await page.keyboard.press('End');
  check(await page.locator('#iwInspected').textContent()==='3/3 opened' && await page.locator('#iwEvidencePanel').getAttribute('aria-labelledby')==='iwTab-mailbox','all evidence is tracked and the panel labels follow the selected tab');
  await page.getByLabel('Find in evidence',{exact:true}).fill('session-702');
  check(await page.locator('[data-find]').count()===2 && await page.locator('#iwEvidenceText mark').count()>0,'evidence search finds matching files and highlights the matching text');
  await page.locator('[data-find="identity"]').click();
  check(await page.getByRole('tab',{selected:true}).getAttribute('id')==='iwTab-identity','a search hit opens the matching artifact');
  await page.getByLabel('Find in evidence',{exact:true}).fill('<img src=x onerror=alert(1)>');
  check(await page.locator('#iwFindResults').innerText()==='No evidence matches this text.' && await page.locator('#iwEvidenceText img').count()===0,'evidence search treats markup as plain text');
  await page.getByLabel('Find in evidence',{exact:true}).fill('');
  const evidenceReady=page.waitForEvent('download');
  await page.locator('#iwDownloadEvidence').click();
  const evidence=await readFile(await (await evidenceReady).path(),'utf8');
  check(evidence.includes('CASE 01 / E1') && evidence.includes('CASE 01 / E3') && !evidence.includes('Supported response:'),'the evidence pack contains every file without the decision review');
  await page.locator('#iwNotes').fill('E2: session-702 matches E3. <script>window.BAD=true</script>');
  await page.evaluate(()=>navigateTo('#/labs'));
  await openCase(page,'mailbox-takeover');
  check((await page.locator('#iwNotes').inputValue()).includes('session-702') && !await page.evaluate(()=>window.BAD),'immediate navigation preserves analyst notes as text');
  await page.locator('input[name="assessment"][value="1"]').check();
  await page.locator('#iwNotes').fill('Saved immediately before refresh.');
  await page.reload();
  await page.locator('#iwDecisionForm').waitFor();
  check(await page.locator('#iwNotes').inputValue()==='Saved immediately before refresh.' && await page.locator('input[name="assessment"][value="1"]').isChecked(),'notes and draft decisions survive an immediate refresh');
  const reviewGeneration=await page.evaluate(()=>renderGeneration);
  await answer(page,cases[0],false);
  check(await page.locator('#iwResultHeading').innerText()==='0 of 3 decisions matched' && await page.locator('.iw-feedback').count()===3,'review grades each decision and explains the evidence');
  check(await page.locator('input[type="radio"]:enabled').count()===0 && await page.locator('#iwSubmit').isHidden(),'reviewed decisions stay locked until a new attempt');
  check(await page.evaluate(()=>renderGeneration)===reviewGeneration,'review updates the current page without rerouting');
  const reportReady=page.waitForEvent('download');
  await page.locator('#iwDownloadReport').click();
  const report=await readFile(await (await reportReady).path(),'utf8');
  check(report.includes('Saved immediately before refresh.') && report.includes('Supported response:') && report.includes('fictional training case') && report.includes('## Model handover'),'downloaded reports contain analyst notes, decisions, explanations, and the training context');
  await page.locator('[data-ref="mailbox"]').last().click();
  check(await page.locator('#iwEvidencePanel').getAttribute('aria-labelledby')==='iwTab-mailbox','debrief citations reopen the underlying evidence');
  await page.locator('#iwRetry').click();
  check(await page.locator('input:checked').count()===0 && await page.locator('#iwNotes').inputValue()==='Saved immediately before refresh.' && await page.locator('#iwDebrief').innerText()==='', 'new attempts reset decisions while keeping notes');
  for(const item of cases){
    if(item!==cases[0])await openCase(page,item.id);
    if(item.id==='patch-rollout'){
      check((await page.locator('#iwEvidenceText').innerText()).replace(/\s+/g,' ').includes('not establish that Atlas itself was attacked'),'the advisory distinguishes outside exploitation from local evidence');
      await page.locator('#iwTab-inventory').click();
      check((await page.locator('#iwEvidenceText').innerText()).includes('Region west') && (await page.locator('#iwEvidenceText').innerText()).includes('1.2.4'),'the inventory identifies the still-affected region');
    }
    await answer(page,item);
    check(await page.locator('#iwResultHeading').innerText()==='3 of 3 decisions matched',`${item.id}: supported decisions produce a complete review`);
    if(item.id==='patch-rollout'){
      const reportReady=page.waitForEvent('download');await page.locator('#iwDownloadReport').click();
      const report=await readFile(await (await reportReady).path(),'utf8');
      check(report.includes('west remains exposed') && report.includes('No Atlas exploitation is established'),'the case report retains the exposure and investigation limits');
    }
  }
  check(await page.evaluate(()=>STATE.investigations['mailbox-takeover'].bestScore)===100 &&
    await page.evaluate(()=>STATE.investigations['mailbox-takeover'].attempts)===2,'best review and attempt count survive retries');
  await page.evaluate(()=>navigateTo('#/investigations'));
  await page.locator('.iw-board').waitFor();
  check(new RegExp(`${cases.length}\\s*\\/\\s*${cases.length}`).test(await page.locator('.iw-board>strong').innerText()) && await page.getByRole('link',{name:'Review debrief →'}).count()===cases.length,'the caseboard summarises reviewed cases');
  await page.evaluate(()=>navigateTo('#/progress'));
  const backupReady=page.waitForEvent('download');
  await page.locator('#exportProgressBtn').click();
  const backup=await readFile(await (await backupReady).path());
  check(Object.keys(JSON.parse(backup).investigations).length===cases.length,'progress backups include all casework');
  await page.evaluate(()=>{STATE.investigations={};saveState();});
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#importProgressFile').setInputFiles({name:'casework.json',mimeType:'application/json',buffer:backup});
  await page.waitForFunction(count=>Object.keys(STATE.investigations).length===count,cases.length);
  await openCase(page,'mailbox-takeover');
  check(await page.locator('#iwResultHeading').innerText()==='3 of 3 decisions matched','imported casework restores a completed review');
  for(const theme of ['dark','light']){
    await page.evaluate(theme=>{STATE.theme=theme;applyTheme();},theme);
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      check(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`${theme} case workspace fits ${width}px`);
    }
  }
  await page.setViewportSize({width:320,height:900});
  await page.locator('#iwEvidenceText').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.getElementById('iwEvidenceText').scrollLeft>0);
  check(await page.locator('#iwEvidenceText').evaluate(el=>el.scrollLeft>0),'long evidence lines can be scrolled with the keyboard on a phone-sized screen');
  check(errors.length===0,'casework flows have no JavaScript errors');
  // The explicit refresh above is the only new document after the initial visit.
  check(documents===2,'case navigation, searches, answers, and reviews never reload the document');
  assert.ok(generation>0 && token);
  await context.close();

  const damaged=await contextFor({investigations:{'mailbox-takeover':{notes:'Keep my evidence notes',answers:null,reviewed:[null],bestScore:200,submittedAt:1e99}},completed:{'03-linux/terminal-basics':1730000000000}});
  const damagedPage=await damaged.newPage();
  await damagedPage.goto(BASE+'/#/investigations/mailbox-takeover');
  await damagedPage.locator('#iwNotes').waitFor();
  check(await damagedPage.locator('#iwNotes').inputValue()==='Keep my evidence notes' &&
    await damagedPage.evaluate(()=>STATE.investigations['mailbox-takeover'].submittedAt===0 && !!STATE.completed['03-linux/terminal-basics'] && !!localStorage.getItem('kashsec_state_recovery_v1')),'damaged case fields recover while preserving notes and lesson progress');
  await damaged.close();

  const fullStorage=await contextFor();
  const fullPage=await fullStorage.newPage();
  await fullPage.goto(BASE+'/#/investigations/mailbox-takeover');
  await fullPage.locator('#iwNotes').waitFor();
  await fullPage.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Storage full','QuotaExceededError');};});
  await fullPage.locator('#iwNotes').fill('Copyable notes when storage is full');
  await fullPage.waitForFunction(()=>document.getElementById('iwSaveStatus').textContent.includes('Could not save locally'));
  check(await fullPage.locator('#iwNotes').inputValue()==='Copyable notes when storage is full','storage failures leave notes readable and clearly report that local saving failed');
  await fullStorage.close();

  const delayed=await contextFor();
  let held;
  await delayed.route('**/investigations.js',route=>{held=route;},{times:1});
  const delayedPage=await delayed.newPage();
  await delayedPage.goto(BASE+'/lesson/');
  await delayedPage.evaluate(()=>navigateTo('#/investigations'));
  await delayedPage.waitForFunction(()=>document.querySelector('.loading')?.textContent.includes('Workbench'));
  await delayedPage.evaluate(()=>navigateTo('#/labs'));
  assert.ok(held);
  await held.fulfill({response:await held.fetch()});
  await delayedPage.waitForFunction(()=>!!window.KashInvestigations);
  check(await delayedPage.locator('.lab-card').count()>0 && await delayedPage.locator('.iw-card').count()===0,'a late bundle cannot replace a page selected afterwards');
  await delayed.close();

  const failed=await contextFor();
  await failed.route('**/investigations.js',route=>route.fulfill({status:503,body:'Unavailable'}),{times:1});
  const failedPage=await failed.newPage();
  await failedPage.goto(BASE+'/#/investigations');
  await failedPage.locator('#iwLoadRetry').click();
  await failedPage.locator('.iw-card').first().waitFor();
  check(await failedPage.locator('.iw-card').count()===cases.length,'a failed bundle has a working in-page retry');
  await failedPage.evaluate(()=>navigateTo('#/investigations/unknown'));
  await failedPage.waitForFunction(()=>!document.querySelector('.loading'));
  check(await failedPage.locator('#iwDecisionForm').count()===0 && await failedPage.locator('#app h1').count()===1,'unknown cases show a safe not-found page');
  await failed.close();

  for(const mode of ['restore','editing','hub']){
    const synced=await contextFor();
    await synced.addInitScript(()=>{
      const mergeReady=new Promise(resolve=>{window.__releaseMerge=resolve;});
      window.__writes=0;
      window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'case-test',email:'analyst@example.test'}}}}),onAuthStateChange(){}},
        from:()=>({select(){return this;},eq(){return this;},maybeSingle:async()=>{
          window.__mergeStarted=true;await mergeReady;
          const record={notes:'Cloud analyst notes',answers:{assessment:1,containment:0,scope:2},reviewed:['mailbox'],updatedAt:200,submittedAt:200,bestScore:100,attempts:1};
          return {data:{state:{investigations:{'mailbox-takeover':record,'exposed-cloud-key':{...record,answers:{confirmed:1,containment:2,limits:0}}}}}};
        },upsert:async()=>{window.__writes++;return {};},order(){return this;},limit:async()=>({data:[]})})})};
    });
    const syncedPage=await synced.newPage();
    await syncedPage.goto(BASE+(mode==='hub'?'/#/investigations':'/#/investigations/mailbox-takeover'));
    await syncedPage.locator(mode==='hub'?'.iw-board':'#iwDecisionForm').waitFor();
    await syncedPage.waitForFunction(()=>window.__mergeStarted);
    const before=await syncedPage.evaluate(()=>renderGeneration);
    if(mode==='editing')await syncedPage.locator('#iwNotes').fill('My current local analysis');
    if(mode==='hub')await syncedPage.getByLabel('Focus',{exact:true}).selectOption('Cloud');
    await syncedPage.evaluate(()=>window.__releaseMerge());
    await syncedPage.waitForFunction(()=>window.__writes>0);
    await syncedPage.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    if(mode==='hub'){
      check(new RegExp(`2\\s*\\/\\s*${cases.length}`).test(await syncedPage.locator('.iw-board>strong').innerText()) &&
        await syncedPage.locator('.iw-card:visible').count()===1 && await syncedPage.getByLabel('Focus',{exact:true}).inputValue()==='Cloud',
        'late sync updates caseboard progress while preserving the selected filter');
    }else{
      check(await syncedPage.locator('#iwNotes').inputValue()===(mode==='restore'?'Cloud analyst notes':'My current local analysis'),`${mode}: sync restores remote notes or preserves newer active editing`);
    }
    check(await syncedPage.evaluate(()=>!!STATE.investigations['exposed-cloud-key']) && await syncedPage.evaluate(()=>renderGeneration)===before,`${mode}: case records merge independently without rerouting`);
    if(mode==='restore')check(await syncedPage.locator('#iwResultHeading').innerText()==='3 of 3 decisions matched','opening evidence on a fresh device does not overwrite the cloud review');
    await synced.close();
  }

  const offline=await contextFor({}, {serviceWorkers:'allow'});
  const offlinePage=await offline.newPage();
  await offlinePage.goto(BASE+'/#/investigations/mailbox-takeover');
  await offlinePage.locator('#iwDecisionForm').waitFor();
  await offlinePage.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await offlinePage.waitForFunction(async()=>!!(await caches.match(new URL('investigations.js',location.origin).href)));
  await offlinePage.locator('#iwNotes').fill('Offline notebook');
  await offline.setOffline(true);
  await offlinePage.reload();
  await offlinePage.locator('#iwDecisionForm').waitFor();
  check(await offlinePage.locator('#iwNotes').inputValue()==='Offline notebook','opened cases and notes reload offline');
  await answer(offlinePage,cases[0]);
  check(await offlinePage.locator('#iwResultHeading').innerText()==='3 of 3 decisions matched','evidence and decision review work offline');
  await openCase(offlinePage,'patch-rollout');
  await offlinePage.locator('#iwNotes').fill('Confirm west deployment');
  await offlinePage.reload();await offlinePage.locator('#iwDecisionForm').waitFor();
  check(await offlinePage.locator('#iwNotes').inputValue()==='Confirm west deployment','new case notes reload offline');
  await answer(offlinePage,cases.find(item=>item.id==='patch-rollout'));
  check(await offlinePage.locator('#iwResultHeading').innerText()==='3 of 3 decisions matched','new case evidence and decisions work offline');
  await offline.close();
  console.log(`\n  Incident Workbench: ${checks} checks passed\n`);
}finally{await browser.close();}
