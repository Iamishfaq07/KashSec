#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=preview?(process.env.PREVIEW_BASE||'http://127.0.0.1:8080'):(process.env.BASE||'http://127.0.0.1:8000');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
async function context(){
  const c=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
  return c;
}
const url=BASE+'/expert-labs/tenant-boundary'+(preview?'':'.html');
try{
  const c=await context(),p=await c.newPage();let release,requested;
  const hold=new Promise(resolve=>{release=resolve;});const arrived=new Promise(resolve=>{requested=resolve;});
  await p.route('**/expert-labs.css',async route=>{requested();await hold;await route.continue();});
  await p.goto(url,{waitUntil:'domcontentloaded'});await arrived;
  assert.equal(await p.locator('#exNotes').count(),0,'unformatted form must not be presented as ready');
  if(!preview)assert.equal(await p.locator('[data-expert-static]').count(),1,'readable static brief remains during stylesheet loading');
  release();await p.locator('#exNotes').waitFor();
  assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('.ex-page')).maxWidth),'1100px');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await c.close();console.log('PASS: delayed styles retain the brief/loading state, then mount a styled case that fits 320px immediately.');
  const failed=await context(),fp=await failed.newPage();let blocked=true;
  await fp.route('**/expert-labs.css',route=>blocked?route.fulfill({status:503,body:'Unavailable'}):route.continue());
  await fp.goto(url);await fp.getByRole('button',{name:'Retry Expert Labs'}).waitFor();
  assert.equal(await fp.locator('#exNotes').count(),0);
  blocked=false;await fp.getByRole('button',{name:'Retry Expert Labs'}).click();await fp.locator('#exNotes').waitFor();
  assert.ok(await fp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await failed.close();console.log('PASS: a failed stylesheet has a working retry and cannot leave an unstyled wide form.');
}finally{await browser.close();}
