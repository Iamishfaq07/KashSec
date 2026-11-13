#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const appSource=fs.readFileSync(path.join(root,'app.js'),'utf8');
const paths=new Function(appSource.match(/const PATHS = \[[\s\S]*?\n\];/)[0]+';return PATHS;')();
const appsecCount=paths.find(p=>p.id==='22-devsecops-appsec').subs.length;
const overrides=new Map(),requests=new Map();
const asset='/downloads/appsec_invoice_lab.py',lesson='/course/22-devsecops-appsec/appsec-fix-verify-lab.md';
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  requests.set(pathname,(requests.get(pathname)||0)+1);
  const override=overrides.get(pathname);
  if(override?.hold)return;
  if(override){res.writeHead(override.status||200,{'Content-Type':override.type||'text/html'});res.end(override.body);return;}
  const filename=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end('missing');return;}
  const types={'.js':'application/javascript','.css':'text/css','.html':'text/html','.md':'text/markdown','.py':'text/plain','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
  res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(filename).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const BASE=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});let passed=0;
async function test(name,run,workers='block'){
  overrides.clear();requests.clear();
  const context=await browser.newContext({acceptDownloads:true,serviceWorkers:workers,reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===BASE?r.continue():r.abort());
  await context.addInitScript(()=>{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await run(page,context);assert.deepEqual(errors,[]);passed++;console.log('PASS '+name);}finally{await context.close();}
}
async function open(page){await page.goto(BASE+'/lesson/22-devsecops-appsec/',{waitUntil:'domcontentloaded'});await page.locator('#downloadPackBtn').waitFor();}
function entries(bytes){
  const files=new Map();let offset=0;
  while(bytes.readUInt32LE(offset)===0x04034b50){
    const size=bytes.readUInt32LE(offset+18),nameLength=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28),start=offset+30+nameLength+extra;
    const name=bytes.subarray(offset+30,offset+30+nameLength).toString();files.set(name,bytes.subarray(start,start+size).toString());offset=start+size;
  }
  assert.equal(bytes.readUInt32LE(offset),0x02014b50);return files;
}
async function workerReady(page){await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);}
try{
  await test('Search indexes stay lazy, validate into the content cache, and recover during an offline reload',async (page,context)=>{
    await page.goto(BASE+'/');await workerReady(page);
    assert.equal(requests.get('/search-index.js')||0,0);assert.equal(requests.get('/search-preview.js')||0,0);
    await page.evaluate(()=>location.hash='#/search?q=kerberoasting');
    await page.waitForFunction(()=>Array.isArray(SEARCH_CONTENT));
    assert.equal(await page.evaluate(()=>SEARCH_CONTENT.length),await page.evaluate(()=>totalSubLessons()));
    assert.ok(await page.evaluate(async()=>!!await(await caches.open('kashsec-content')).match('/search-index.js')));
    await context.setOffline(true);await page.reload();await page.waitForFunction(()=>Array.isArray(SEARCH_CONTENT));
    assert.equal(await page.evaluate(()=>SEARCH_CONTENT.length),await page.evaluate(()=>totalSubLessons()));assert.ok(await page.locator('.searchpage-hit').count());
    assert.equal(await page.getByRole('button',{name:'Retry lesson search'}).count(),0);
  },'allow');
  await test('Poisoned search cache entries and bad network data are rejected; a fresh retry repairs offline search',async page=>{
    overrides.set('/search-preview.js',{type:'application/javascript',body:'<html>Hosting error</html>'});
    overrides.set('/search-index.js',{type:'application/javascript',body:'const SEARCH_CONTENT=[];window.__searchExecuted=true;'});
    await page.goto(BASE+'/');await workerReady(page);
    await page.evaluate(async()=>{
      const cache=await caches.open('kashsec-content');
      await cache.put('/search-preview.js',new Response('const SEARCH_PREVIEW=[null];',{headers:{'Content-Type':'application/javascript'}}));
      await cache.put('/search-index.js',new Response('const SEARCH_CONTENT=[{"b":42}];',{headers:{'Content-Type':'application/javascript'}}));
      location.hash='#/search?q=csrf';
    });
    await page.getByRole('button',{name:'Retry lesson search'}).waitFor();
    assert.equal(await page.evaluate(()=>window.__searchExecuted),undefined);
    assert.equal(await page.evaluate(async()=>!!await(await caches.open('kashsec-content')).match('/search-index.js')),false);
    assert.ok(await page.locator('.searchpage-hit[href="#/labs/csrf"]').isVisible());
    overrides.delete('/search-preview.js');overrides.delete('/search-index.js');
    await page.getByRole('button',{name:'Retry lesson search'}).click();await page.waitForFunction(()=>Array.isArray(SEARCH_CONTENT));
    assert.equal(await page.evaluate(()=>SEARCH_CONTENT.length),await page.evaluate(()=>totalSubLessons()));
  },'allow');
  await test('AppSec ZIP includes the complete exercise, local lesson links and useful roadmap guidance',async page=>{
    await open(page);const event=page.waitForEvent('download');await page.locator('#downloadPackBtn').click();const download=await event;
    const files=entries(fs.readFileSync(await download.path()));assert.equal(files.size,appsecCount+2);assert.equal(files.get('appsec_invoice_lab.py'),fs.readFileSync(path.join(root,asset),'utf8'));
    for(const id of ['vulnerability-triage-in-practice','verify-vulnerability-remediation']) assert.ok([...files.keys()].some(name=>name.endsWith('-'+id+'.md')));
    const lab=[...files].find(([name])=>name.endsWith('-appsec-fix-verify-lab.md'))[1];assert.ok(lab.includes('(./appsec_invoice_lab.py)'));assert.ok(!lab.includes('/downloads/'));
    assert.match(files.get('00-index.md'),/Your learning route/);assert.match(files.get('00-index.md'),/CSSLP/);assert.match(files.get('00-index.md'),/Python 3.10/);
    assert.ok([...files.keys()].every(name=>!name.includes('..')&&!name.startsWith('/')));
  });
  await test('AI path ZIP includes all new lessons and the exact expert policy exercise',async page=>{
    await page.goto(BASE+'/lesson/18-ai-security/',{waitUntil:'domcontentloaded'});await page.locator('#downloadPackBtn').waitFor();
    const pending=page.waitForEvent('download');await page.locator('#downloadPackBtn').click();const download=await pending;
    const files=entries(fs.readFileSync(await download.path()));assert.equal(files.size,28);
    assert.equal(files.get('expert_security_lab.py'),fs.readFileSync(path.join(root,'downloads/expert_security_lab.py'),'utf8'));
    for(const id of ['mcp-tool-authorization','rag-tenant-isolation','ai-security-release-gates'])assert.ok([...files.keys()].some(name=>name.endsWith('-'+id+'.md')));
    assert.match(files.get('00-index.md'),/expert_security_lab.py/);
  });
  await test('HTML practice-file errors block the ZIP, and a fresh retry produces a complete pack',async page=>{
    overrides.set(asset,{body:'<!doctype html><html>Hosting error</html>'});await open(page);let downloads=0;page.on('download',()=>downloads++);
    await page.locator('#downloadPackBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('No pack was downloaded.'));assert.equal(downloads,0);
    overrides.delete(asset);const event=page.waitForEvent('download');await page.locator('#downloadPackBtn').click();await event;assert.equal(downloads,1);
  });
  await test('HTML lesson responses cannot be silently shipped in a ZIP',async page=>{
    overrides.set(lesson,{body:'<!doctype html><html>Error</html>'});await open(page);let downloads=0;page.on('download',()=>downloads++);await page.locator('#downloadPackBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('No pack was downloaded.'));assert.equal(downloads,0);
  });
  await test('a provenance marker cannot disguise an HTML lesson response',async page=>{
    overrides.set(lesson,{type:'text/plain',body:'<!-- coderabbit-ai-generated:v1 -->\n<html>\n# Not a lesson\n</html>'});
    await open(page);let downloads=0;page.on('download',()=>downloads++);
    await page.locator('#downloadPackBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('No pack was downloaded.'));
    assert.equal(downloads,0);
  });
  await test('stalled pack requests can be cancelled or abandoned by navigation without a later download',async page=>{
    overrides.set(lesson,{hold:true});await open(page);let downloads=0;page.on('download',()=>downloads++);
    await page.locator('#downloadPackBtn').click();await page.locator('#cancelPackBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('Download cancelled'));assert.equal(await page.locator('#downloadPackBtn').isEnabled(),true);assert.equal(downloads,0);
    await page.locator('#downloadPackBtn').click();await page.evaluate(()=>navigateTo('#/course'));await page.locator('#pathSearch').waitFor();assert.equal(downloads,0);
  });
  await test('unresponsive pack files time out and leave a usable retry control',async page=>{
    overrides.set(lesson,{hold:true});await open(page);
    await page.evaluate(()=>{const timer=window.setTimeout;window.setTimeout=(fn,ms,...args)=>timer(fn,ms===12000?150:ms,...args);});
    await page.locator('#downloadPackBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('No pack was downloaded.'));assert.ok(await page.locator('#downloadPackBtn').isEnabled());assert.equal(await page.locator('#cancelPackBtn').isVisible(),false);
  });
  await test('offline saving reports a missing practice file, retries it, and serves the exercise without a network',async(page,context)=>{
    await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});await workerReady(page);assert.equal(requests.get(asset)||0,0);
    overrides.set(asset,{body:'<!doctype html><html>Not a lab</html>'});await open(page);await page.locator('#savePathOfflineBtn').click();await page.waitForFunction(()=>document.getElementById('offlinePathStatus').textContent.includes('files failed'));
    assert.ok((await page.locator('#offlinePathStatus').innerText()).includes(`${appsecCount} of ${appsecCount} lessons and 0 of 1 practice files`));
    assert.equal(await page.evaluate(async asset=>!!(await(await caches.open('kashsec-content')).match(asset)),asset),false);
    overrides.delete(asset);await page.locator('#savePathOfflineBtn').click();await page.waitForFunction(count=>document.getElementById('offlinePathStatus').textContent.startsWith(`All ${count} lessons and 1 practice file saved`),appsecCount);
    await context.setOffline(true);await page.goto(BASE+'/lesson/22-devsecops-appsec/appsec-fix-verify-lab.html',{waitUntil:'domcontentloaded'});await page.locator('#content[aria-busy="false"]').waitFor();assert.equal(await page.locator('#retryLesson').count(),0);
    const text=await page.evaluate(async asset=>{const response=await fetch(asset);return response.text();},asset);assert.match(text,/class InvoiceSecurityTests/);
  },'allow');
  await test('bad cached lesson text and HTML network errors cannot poison offline reading or retries',async page=>{
    await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});await workerReady(page);
    await page.evaluate(async lesson=>{const cache=await caches.open('kashsec-content');await cache.put(lesson,new Response('<!doctype html><html>Old error</html>',{headers:{'Content-Type':'text/html'}}));},lesson);
    overrides.set(lesson,{type:'text/plain',body:'<!-- coderabbit-ai-generated:v1 -->\n<html>\n# Not a lesson\n</html>'});await page.goto(BASE+'/lesson/22-devsecops-appsec/appsec-fix-verify-lab.html',{waitUntil:'domcontentloaded'});await page.locator('#retryLesson').waitFor();
    assert.equal(await page.evaluate(async lesson=>!!(await(await caches.open('kashsec-content')).match(lesson)),lesson),false);
    overrides.delete(lesson);await page.locator('#retryLesson').click();await page.locator('#content[aria-busy="false"]').waitFor();assert.equal(await page.locator('#retryLesson').count(),0);
    assert.match(await page.locator('#content h1').innerText(),/Fix & Verify/);
    overrides.set(lesson,{body:'<!doctype html><html>Another error</html>'});await page.reload({waitUntil:'domcontentloaded'});await page.locator('#content[aria-busy="false"]').waitFor();assert.equal(await page.locator('#retryLesson').count(),0);
  },'allow');
  console.log(`Offline practice: ${passed} passed.`);
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
