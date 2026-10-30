#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
async function context(){
  const c=await browser.newContext({serviceWorkers:'block',viewport:{width:320,height:850},reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,tourDone:true})));
  return c;
}
try{
  if(!preview){
    const c=await context(),p=await c.newPage();
    let release;const gate=new Promise(r=>release=r);
    await c.route('**/search-preview.js',async r=>{await gate;await r.fulfill({contentType:'application/javascript',body:'const SEARCH_PREVIEW=[];'});});
    await c.route('**/search-index.js',r=>r.fulfill({contentType:'application/javascript',body:'const SEARCH_CONTENT='+JSON.stringify([{p:"appsec",s:"intro",t:"Security test",n:"1",pt:"Test",b:"subnet <img src=x onerror=window.searchInjected=true> & raw text"}])+';'}));
    await p.goto(BASE+'/index.html#/search?q=linux',{waitUntil:'domcontentloaded'});await p.locator('#searchPageInput').waitFor();
    await p.evaluate(()=>location.hash='#/search?q=subnet');await p.waitForFunction(()=>document.title.startsWith('subnet'));
    await p.locator('#searchPageInput').fill('my next draft');
    await p.locator('#searchPageInput').evaluate(el=>el.setSelectionRange(2,5));
    const input=await p.locator('#searchPageInput').elementHandle();
    // A second consumer must receive both tiers while the original page request is pending.
    await p.locator('#searchBtn').click();await p.locator('#searchInput').fill('subnet');
    await p.locator('#searchInput').press('ArrowDown');
    const selected = await p.locator('#searchResults .active').getAttribute('href');
    release();
    await p.waitForFunction(()=>typeof SEARCH_CONTENT!=='undefined');
    await p.waitForFunction(()=>document.querySelector('#searchResults').textContent.includes('Security test'));
    assert.ok((await p.locator('h1').innerText()).includes('subnet'));
    assert.equal(await p.locator('#searchResults .active').getAttribute('href'),selected,'async tiers preserve arrow selection');
    assert.equal(await p.locator('#searchPageInput').inputValue(),'my next draft');
    assert.equal(await input.evaluate(el=>el===document.getElementById('searchPageInput')),true,'async refresh preserves the input node');
    assert.equal(await p.locator('.searchpage-results img').count(),0);
    assert.ok((await p.locator('.searchpage-results').innerText()).includes('<img src=x'));
    assert.equal(await p.evaluate(()=>window.searchInjected),undefined);
    await p.getByRole('button',{name:'Close search',exact:true}).click();
    await c.close();console.log('PASS: delayed tiers preserve newer routes and typed drafts, update both consumers, and escape body snippets.');

    const retry=await context(),q=await retry.newPage();let fail=true;
    await retry.route(/search-(preview|index)\.js$/,r=>fail?r.abort():r.continue());
    await q.goto(BASE+'/index.html#/search?q=subnet');
    await q.getByRole('button',{name:'Retry lesson search'}).waitFor();
    assert.ok(!(await q.locator('#searchPageStatus').innerText()).includes('Searching lesson text'));
    fail=false;await q.getByRole('button',{name:'Retry lesson search'}).click();
    await q.waitForFunction(()=>typeof SEARCH_CONTENT!=='undefined');
    await q.getByRole('button',{name:'Retry lesson search'}).waitFor({state:'detached'});
    await q.evaluate(()=>location.hash='#/search?q=x');await q.waitForFunction(()=>document.title.startsWith('x —'));
    assert.ok(!(await q.locator('#searchPageStatus').innerText()).includes('Searching lesson text'));
    await retry.close();console.log('PASS: failed tiers show a working retry and one-character searches never claim to be loading.');

    const stalled=await context(),s=await stalled.newPage();let unstall;
    const stalledGate=new Promise(resolve=>unstall=resolve);
    await stalled.route('**/search-preview.js',async r=>{await stalledGate;await r.abort().catch(()=>{});});
    await stalled.route('**/search-index.js',r=>r.fulfill({contentType:'application/javascript',body:'/* invalid successful response */'}));
    await s.goto(BASE+'/index.html#/search?q=csrf',{waitUntil:'domcontentloaded'});
    await s.getByRole('button',{name:'Retry lesson search'}).waitFor({timeout:18000});
    assert.ok(await s.locator('.searchpage-hit[href="#/labs/csrf"]').isVisible());
    unstall();await stalled.close();console.log('PASS: a stalled preview times out; a missing full-index payload reports failure while metadata stays usable.');

    const fallback=await context(),f=await fallback.newPage();
    await fallback.route('**/search-preview.js',r=>r.abort());
    await f.goto(BASE+'/index.html#/search?q=kerberoast');await f.waitForFunction(()=>typeof SEARCH_CONTENT!=='undefined');
    assert.ok(await f.locator('.searchpage-hit').count());
    await f.evaluate(()=>location.hash='#/search?q=csrf');await f.waitForFunction(()=>!!document.querySelector('.searchpage-hit[href="#/labs/csrf"]'));
    await f.locator('#searchBtn').click();
    assert.equal(await f.locator('#searchResults a[href^="#/labs/"]').count(),42);
    await fallback.close();console.log('PASS: full search survives preview failure; all 42 labs are discoverable from the palette and results page.');
  }
  const c=await context(),p=await c.newPage();let downloads=0;
  p.on('request',r=>{if(/search-(preview|index)\.js|data\/glossary\.json/.test(r.url()))downloads++;});
  await p.goto(BASE+(preview?'/':'/index.html#/'));
  const trigger=preview?p.getByRole('button',{name:'Search the academy',exact:true}):p.locator('#searchBtn');
  await trigger.focus();await trigger.click();
  const dialog=p.getByRole('dialog',{name:preview?'Search the academy':'Search lessons',exact:true});
  const input=dialog.getByRole('textbox');await input.waitFor();
  assert.equal(downloads,0,'opening search downloads no body/glossary index');
  assert.equal(await input.evaluate(el=>document.activeElement===el),true);
  await input.press('Shift+Tab');
  assert.equal(await dialog.locator('a').last().evaluate(el=>el===document.activeElement),true);
  await p.keyboard.press('Tab');assert.equal(await input.evaluate(el=>document.activeElement===el),true);
  assert.equal(await p.locator('main').evaluate(el=>!!el.closest('[inert]')),true,'background content is inert');
  await input.fill('csrf');await dialog.locator('a[href$="/labs/csrf"]').waitFor();
  await input.press('ArrowDown');assert.ok((await dialog.getByRole('status').allTextContents()).join(' ').includes('of'));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const close=dialog.getByRole('button',{name:preview?'Close':'Close search',exact:true});
  await close.focus();await close.press('Enter');await dialog.waitFor({state:preview?'detached':'hidden'});
  assert.equal(await trigger.evaluate(el=>el===document.activeElement),true,'closing returns focus to the trigger');
  await c.close();console.log(`PASS: ${preview?'preview':'main'} mobile search stays lazy, traps/returns focus, announces arrow selection, and closes with Enter.`);
}finally{await browser.close();}
