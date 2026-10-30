#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const root=new URL('..',import.meta.url);
const read=file=>fs.readFile(new URL(file,root),'utf8');
const SITE='https://kashsec.vercel.app';
const locs=[...(await read('sitemap.xml')).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(locs).size,locs.length);
const titles=new Set(),descriptions=new Set();
for(const loc of locs){
  assert.ok(loc.startsWith(SITE+'/')&&!loc.includes('#')&&!loc.includes('?'));
  const pathname=new URL(loc).pathname;
  const file=pathname==='/'?'index.html':pathname.endsWith('/')?pathname.slice(1)+'index.html':pathname.slice(1);
  const html=await read(file);
  assert.ok(html.includes(`<link rel="canonical" href="${loc}">`),file+': self canonical');
  assert.ok(html.includes(`<meta property="og:url" content="${loc}">`),file+': consistent social URL');
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),file+': indexable');
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title&&description,file+': metadata');
  assert.ok(!titles.has(title),file+': distinct title');titles.add(title);
  assert.ok(!descriptions.has(description),file+': distinct description');descriptions.add(description);
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
  assert.equal((main.match(/<h1\b/g)||[]).length,1,file+': one main heading');
  assert.ok(main.replace(/<[^>]*>/g,' ').trim().length>200,file+': readable initial HTML');
  for(const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(block[1]);
  const shared=html.match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
  for(const target of ['/lesson/','/labs/','/tools/','/faq.html'])assert.ok(shared.includes(`href="${target}"`),file+': canonical shared link '+target);
}
assert.ok(!(await read('sitemap.xml')).includes('/404.html'));
assert.ok((await read('404.html')).includes('content="noindex"'));
console.log(`PASS: ${locs.length} unique sitemap pages have self-canonicals, consistent social URLs, distinct metadata, one heading, readable HTML, valid JSON-LD and crawlable primary links.`);

const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
async function context(options={}){
  const c=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce',viewport:{width:320,height:850},...options});
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  return c;
}
try{
  const c=await context({javaScriptEnabled:false}),p=await c.newPage();
  await p.goto(BASE+'/');await p.locator('[data-home-static]').waitFor();
  assert.equal(await p.locator('[data-home-static] a[href^="/lesson/"][href$="/"]').count(),30);
  assert.ok((await p.locator('main').innerText()).includes('491'));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.getByRole('link',{name:'AI tool authorization lab',exact:true}).click();
  assert.ok((await p.locator('main').innerText()).includes('agent_tool_allowed'));
  assert.equal(await p.locator('h1').innerText(),'AI tools inside the task boundary');
  await p.goto(BASE+'/lesson/18-ai-security/mcp-tool-authorization.html');
  assert.ok((await p.locator('main').innerText()).includes('token'));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  for(const id of ['rag-tenant-isolation','ai-security-release-gates']){
    await p.goto(BASE+'/lesson/18-ai-security/'+id+'.html');
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' fits mobile without JS');
  }
  await c.close();console.log('PASS: mobile no-JavaScript homepage, new AI lesson and expert brief remain readable and linked.');

  const live=await context(),q=await live.newPage();
  await live.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true,tourDone:true})));
  const errors=[];q.on('pageerror',e=>errors.push(e.message));
  await q.goto(BASE+'/');await q.locator('#homeAIPractice').waitFor();
  await q.evaluate(()=>window.__seoNavigationToken='same document');
  await q.getByRole('link',{name:/Start with the lessons/}).click();
  await q.locator('#content[aria-busy="false"]').waitFor();
  assert.ok(q.url().endsWith('/lesson/18-ai-security/mcp-tool-authorization.html'));
  assert.equal(await q.evaluate(()=>window.__seoNavigationToken),'same document');
  assert.equal(await q.locator('#navLinks a[aria-current="page"]').innerText(),'Course');
  await q.locator('#navLinks a[href="/labs/"]').evaluate(el=>el.click());
  await q.waitForFunction(()=>document.querySelector('#navLinks a[aria-current="page"]')?.textContent==='Labs');
  assert.equal(await q.evaluate(()=>window.__seoNavigationToken),'same document');
  assert.deepEqual(errors,[]);await live.close();
  console.log('PASS: new homepage practice links, canonical lesson navigation and active shared navigation preserve the running document.');
  const recovery=await context(),rp=await recovery.newPage(),recoveryErrors=[];
  rp.on('pageerror',e=>recoveryErrors.push(e.message));
  await rp.addInitScript(()=>{if(location.pathname==='/404.html')history.replaceState(null,'','/%E0%A4%A');});
  await rp.goto(BASE+'/404.html');
  assert.equal(await rp.locator('#nfPath').innerText(),'/%E0%A4%A');
  await rp.locator('#nfQ').fill('linux');await rp.getByRole('button',{name:'Search',exact:true}).click();
  await rp.waitForURL(BASE+'/#/search?q=linux');await rp.locator('.searchpage-hit').first().waitFor();
  assert.deepEqual(recoveryErrors,[]);await recovery.close();
  console.log('PASS: malformed URL escapes preserve the 404 recovery page and its search flow.');
}finally{await browser.close();}
