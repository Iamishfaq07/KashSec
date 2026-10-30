#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium}from'playwright';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const context=await browser.newContext({serviceWorkers:'block',viewport:{width:320,height:850},reducedMotion:'reduce'});
await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,tourDone:true})));
const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
  if(!preview){
    let release,finish;const held=new Promise(r=>release=r),finished=new Promise(r=>finish=r);let attempts=0,aborts=0;
    p.on('requestfailed',r=>{if(r.url().endsWith('/search-index.js'))aborts++;});
    await context.route('**/search-preview.js',r=>r.fulfill({contentType:'application/javascript',body:'const SEARCH_PREVIEW=[];'}));
    const row=b=>({p:'18-ai-security',s:'mcp-tool-authorization',n:'18.24',pt:'AI',t:'Search recovery',b});
    await context.route('**/search-index.js',async r=>{
      attempts++;
      if(attempts===1){await held;await r.fulfill({contentType:'application/javascript',body:'const SEARCH_CONTENT='+JSON.stringify([row('obsolete body')])+';'}).catch(()=>{});finish();return;}
      await r.fulfill({contentType:'application/javascript',body:'const SEARCH_CONTENT='+JSON.stringify([row('retrytoken current data')])+';'});
    });
    await p.goto(BASE+'/#/search?q=retrytoken',{waitUntil:'domcontentloaded'});
    await p.getByRole('button',{name:'Retry lesson search'}).waitFor({timeout:18000});
    assert.equal(aborts,1,'timeout cancels the actual request');
    await p.getByRole('button',{name:'Retry lesson search'}).click();
    await p.waitForFunction(()=>Array.isArray(SEARCH_CONTENT));assert.equal(attempts,2);
    release();await finished;
    assert.equal(await p.evaluate(()=>SEARCH_CONTENT[0].b),'retrytoken current data');
    assert.ok((await p.locator('.searchpage-results').innerText()).includes('current data'));
    assert.equal(await p.locator('script[src*="search-index"],script[src*="search-preview"]').count(),0);
    console.log('PASS: actual index timeout is aborted; retry succeeds and late data cannot redeclare or replace the current index.');
  }else{
    let mode='stall',attempts=0,aborts=0,release,finish;
    const held=new Promise(r=>release=r),finished=new Promise(r=>finish=r);
    p.on('requestfailed',r=>{if(r.url().endsWith('/data/glossary.json'))aborts++;});
    await context.route('**/data/glossary.json',async r=>{
      attempts++;
      if(mode==='stall'){await held;await r.fulfill({contentType:'application/json',body:'[]'}).catch(()=>{});finish();return;}
      if(mode==='fail')return r.fulfill({status:503,body:'unavailable'});
      if(mode==='malformed')return r.fulfill({contentType:'application/json',body:'[{"term":27}]'});
      return r.fulfill({contentType:'application/json',body:JSON.stringify([{term:'retrytoken safe term',def:'Synthetic glossary definition',pathId:'18-ai-security',subId:'mcp-tool-authorization'}])});
    });
    await p.goto(BASE+'/');await p.getByRole('button',{name:'Search the academy',exact:true}).click();
    const dialog=p.getByRole('dialog'),input=dialog.getByRole('textbox');await input.fill('csrf');
    await dialog.getByRole('button',{name:'Retry glossary search'}).waitFor({timeout:15000});assert.ok(await dialog.locator('a[href$="/labs/csrf"]').isVisible());
    assert.equal(aborts,1);
    mode='fail';await dialog.getByRole('button',{name:'Retry glossary search'}).click();
    await dialog.getByRole('button',{name:'Retry glossary search'}).waitFor();assert.equal(attempts,2);
    mode='malformed';await dialog.getByRole('button',{name:'Retry glossary search'}).click();
    await p.waitForFunction(()=>document.querySelector('[role="dialog"] button')!==document.activeElement);
    await dialog.getByRole('button',{name:'Retry glossary search'}).waitFor();assert.equal(attempts,3);
    mode='ready';await input.fill('retrytoken');await dialog.getByRole('button',{name:'Retry glossary search'}).click();
    await dialog.getByRole('link',{name:/retrytoken safe term/}).waitFor();assert.equal(attempts,4);
    release();await finished;
    assert.equal(await input.evaluate(el=>el===document.activeElement),true);
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await dialog.getByRole('button',{name:'Close',exact:true}).click();
    await p.getByRole('button',{name:'Search the academy',exact:true}).click();await dialog.getByRole('textbox').fill('retrytoken');
    await dialog.getByRole('link',{name:/retrytoken safe term/}).waitFor();assert.equal(attempts,4,'successful data stays cached');
    console.log('PASS: preview cancels stalled downloads, retains metadata on failure, rejects malformed data, retries safely, preserves focus and reuses successful data.');
  }
  assert.deepEqual(errors,[]);
}finally{await context.close();await browser.close();}
