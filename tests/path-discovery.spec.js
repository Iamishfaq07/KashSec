#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
let passed=0;
async function test(name,run,setup){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await context.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));});
  if(setup)await context.addInitScript(setup);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await run(page);assert.deepEqual(errors,[]);passed++;console.log('PASS '+name);}finally{await context.close();}
}
async function open(page,search=''){await page.goto(BASE+'/lesson/'+search,{waitUntil:'domcontentloaded'});await page.locator('#pathSearch').waitFor();}
const visible=page=>page.locator('#coursePaths .path-card:not(.is-filtered)');
try{
  await test('topics, lessons and credentials are searchable without fetching lesson bodies or the full index',async page=>{
    await open(page);const fetched=[];page.on('request',r=>fetched.push(r.url()));
    await page.locator('#pathSearch').fill('asvs');assert.ok(await visible(page).count()>=1);assert.match(await page.locator('.path-card[data-path="22-devsecops-appsec"]:not(.is-filtered)').innerText(),/Includes: Security Requirements with OWASP ASVS/);
    await page.locator('#pathSearch').fill('CSSLP');assert.equal(await visible(page).count(),1);assert.match(await visible(page).innerText(),/Related certification: Certified Secure Software/);
    await page.locator('#pathSearch').fill('subnetting');assert.ok(await visible(page).count()>0);assert.match(await page.locator('#pathSearchStatus').innerText(),/paths shown/);
    assert.ok(!fetched.some(url=>url.includes('/course/')||url.endsWith('/search-index.js')));
  });
  await test('query and level combine, persist on refresh and survive returning from a roadmap',async page=>{
    await open(page);await page.locator('#pathSearch').fill('CSSLP');await page.locator('.tier-chip[data-tier="advanced"]').click();
    assert.equal(await visible(page).count(),1);assert.equal(new URL(page.url()).searchParams.get('level'),'advanced');
    await page.reload();await page.locator('#pathSearch').waitFor();assert.equal(await page.locator('#pathSearch').inputValue(),'CSSLP');
    await visible(page).first().click();await page.waitForURL('**/lesson/22-devsecops-appsec/');await page.goBack();await page.locator('#pathSearch').waitFor();
    assert.equal(await page.locator('#pathSearch').inputValue(),'CSSLP');assert.equal(await visible(page).count(),1);
  });
  await test('empty results explain recovery and reset restores all paths and keyboard focus',async page=>{
    await open(page);await page.locator('#pathSearch').fill('no-such-topic-19344');assert.equal(await visible(page).count(),0);assert.ok(await page.locator('#tierEmpty').isVisible());
    await page.locator('#resetPathFilters').click();assert.equal(await visible(page).count(),26);assert.equal(await page.evaluate(()=>document.activeElement.id),'pathSearch');assert.equal(new URL(page.url()).search,'');
  });
  await test('same-page browser history updates filters and untrusted query text stays plain',async page=>{
    await open(page,'?q=CSSLP&level=not-a-level');assert.equal(await visible(page).count(),1);assert.equal(await page.locator('.tier-chip[aria-pressed="true"]').getAttribute('data-tier'),'all');
    await page.evaluate(()=>{history.pushState(null,'','/lesson/?q=Linux');dispatchEvent(new PopStateEvent('popstate'));});assert.equal(await page.locator('#pathSearch').inputValue(),'Linux');
    await page.locator('#pathSearch').fill('<img src=x onerror="window.__injected=true">');assert.equal(await page.evaluate(()=>window.__injected),undefined);assert.equal(await visible(page).count(),0);
  });
  await test('finder and its targets fit narrow screens and support keyboard navigation',async page=>{
    await page.setViewportSize({width:320,height:844});await open(page);await page.locator('#pathSearch').focus();await page.keyboard.type('CSSLP',{delay:15});
    assert.equal(await visible(page).count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await visible(page).first().focus();await page.keyboard.press('Enter');await page.waitForURL('**/lesson/22-devsecops-appsec/');
  });
  await test('certification planner reports storage failure and keeps filter, focus and the same control',async page=>{
    await page.goto(BASE+'/index.html#/certs');await page.locator('#certPathFilter').selectOption('22-devsecops-appsec');
    await page.evaluate(()=>{window.__select=document.querySelector('[data-cert="csslp"]');const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kashsec_state_v1')throw new Error('blocked');return set.call(this,k,v);};});
    const select=page.locator('.cert-status-select[data-cert="csslp"]');await select.focus();await select.selectOption('passed');
    assert.match(await page.locator('[data-cert-id="csslp"] .cert-plan-save').innerText(),/Could not save/);
    assert.equal(await page.evaluate(()=>window.__select===document.activeElement),true);assert.equal(await page.locator('#certPathFilter').inputValue(),'22-devsecops-appsec');assert.match(await page.locator('#certOverallStatus').innerText(),/^1\//);
    await page.reload();await page.locator('#certPathFilter').waitFor();assert.equal(await select.inputValue(),'not-started');
  });
  await test('an older offline worker cannot claim that new practice files have been saved',async page=>{
    await page.goto(BASE+'/lesson/22-devsecops-appsec/');await page.locator('#savePathOfflineBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('Apply the available site update'));
  },()=>{
    const sw=new EventTarget(),reg=new EventTarget();sw.controller={};
    reg.active={postMessage:(_,ports)=>ports[0].postMessage({type:'done',saved:18,total:18,failed:0})};
    sw.ready=Promise.resolve(reg);sw.register=async()=>reg;Object.defineProperty(navigator,'serviceWorker',{value:sw});
  });
  console.log(`Path discovery: ${passed} passed.`);
}finally{await browser.close();}
