#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
const BASE=process.env.BASE || 'http://127.0.0.1:8000';
const headers=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url))).headers.find(x=>x.source==='/(.*)').headers;
const enforced=headers.find(x=>x.key==='Content-Security-Policy').value;
const reportOnly=headers.find(x=>x.key==='Content-Security-Policy-Report-Only').value;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
try{
  for(const initial of [{width:1440,height:900},{width:390,height:844}]){
    const context=await browser.newContext({viewport:initial,serviceWorkers:'block'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    const page=await context.newPage();await page.goto(BASE+'/');await page.locator('#tourSkip').waitFor();
    for(const viewport of [{width:390,height:844},{width:1440,height:900},{width:320,height:320}]){
      await page.setViewportSize(viewport);
      await page.waitForFunction(()=>{const r=document.querySelector('.tour-card').getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;});
      assert.equal(await page.locator('#tourSkip').evaluate(e=>e===document.activeElement),true,'resize preserves focus');
      await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#tourNext').evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.locator('#tourSkip').evaluate(e=>e===document.activeElement),true);
    }
    await page.keyboard.press('Tab');await page.keyboard.press('Enter');
    assert.match(await page.locator('.tour-step-count').innerText(),/Step 2/i);
    await page.keyboard.press('Escape');assert.equal(await page.locator('#tourOverlay').count(),0);
    await page.setViewportSize(initial);assert.equal(await page.locator('#tourOverlay').count(),0,'resize cannot recreate a dismissed tour');
    await context.close();
  }
  {
    const context=await browser.newContext({serviceWorkers:'block'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    const page=await context.newPage();
    await page.goto(BASE+'/');
    await page.locator('#searchBtn').click();
    await page.locator('#searchInput').waitFor();
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('#tourOverlay').count(),0,'tour waits for an open dialog');
    assert.equal(await page.locator('#searchInput').evaluate(e=>e===document.activeElement),true,'search keeps focus');
    await page.keyboard.press('Escape');
    await page.locator('#tourSkip').waitFor();
    await page.evaluate(()=>document.querySelectorAll('a[href="#/tracks"]').forEach(el=>el.remove()));
    await page.locator('#tourNext').click();
    assert.match(await page.locator('.tour-step-count').innerText(),/Step 3/i);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#searchBtn').evaluate(e=>e===document.activeElement),true,'skipped step preserves original focus');
    await context.close();
  }
  {
    const context=await browser.newContext({serviceWorkers:'block'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    const page=await context.newPage(); await page.goto(BASE+'/');
    await page.locator('#tourSkip').waitFor();
    await page.keyboard.press('Control+k');
    await page.locator('#searchInput').waitFor();
    assert.equal(await page.locator('#tourOverlay').count(),0,'opening search dismisses the tour');
    assert.equal(await page.locator('#searchInput').evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Escape');
    await context.close();
  }
  const context=await browser.newContext({serviceWorkers:'block'});
  await context.addInitScript(()=>{
    localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));
    window.policyViolations=[];
    document.addEventListener('securitypolicyviolation',e=>window.policyViolations.push({disposition:e.disposition,uri:e.blockedURI}));
  });
  await context.route('**/*',async r=>{
    const url=new URL(r.request().url());
    if(url.origin===new URL(BASE).origin){
      const response=await r.fetch();
      await r.fulfill({response,headers:{...response.headers(),'content-security-policy':enforced,'content-security-policy-report-only':reportOnly}});
    } else if(url.pathname==='/policy-fixture.js'){
      await r.fulfill({contentType:'text/javascript',body:'window.policyFixtureLoaded=(window.policyFixtureLoaded||0)+1'});
    } else await r.abort();
  });
  const page=await context.newPage();await page.goto(BASE+'/');await page.locator('.home-hero h1').waitFor();
  for(const host of ['cdn.jsdelivr.net','plausible.io','pagead2.googlesyndication.com','adservice.googleadservices.doubleclick.net','www.googletagservices.com','va.vercel-scripts.com','vitals.vercel-insights.com']){
    await page.evaluate(async host=>{await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://'+host+'/policy-fixture.js';s.onload=resolve;s.onerror=reject;document.head.append(s);});},host);
  }
  assert.equal(await page.evaluate(()=>window.policyFixtureLoaded),7,'declared integrations execute');
  assert.deepEqual(await page.evaluate(()=>window.policyViolations.filter(x=>x.uri.endsWith('/policy-fixture.js'))),[],'declared integrations produce no report');
  await page.evaluate(async()=>{await new Promise(resolve=>{const s=document.createElement('script');s.src='https://unlisted.example/policy-fixture.js';s.onload=resolve;document.head.append(s);});});
  await page.waitForFunction(()=>window.policyViolations.some(x=>x.uri.includes('unlisted.example')&&x.disposition==='report'));
  assert.equal(await page.evaluate(()=>window.policyFixtureLoaded),8,'report-only does not block unlisted script');
  await page.goto(BASE+'/lesson/03-linux/terminal-basics.html');await page.locator('#content h1').waitFor();
  assert.deepEqual(await page.evaluate(()=>window.policyViolations.filter(x=>x.disposition==='enforce')),[]);
  await context.close();
  console.log('PASS: tour resize both directions, short viewport, focus, keyboard dismissal; CSP reports unlisted scripts and permits declared integrations.');
}finally{await browser.close();}
