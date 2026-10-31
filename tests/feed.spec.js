import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import {buildFeed} from '../generate-feed.js';

const source=await fs.readFile(new URL('../app.js',import.meta.url),'utf8');
const declaration=source.match(/const CHANGELOG = \[[\s\S]*?\n\];/)[0];
const entries=new Function(declaration+';return CHANGELOG')();
const xml=await fs.readFile(new URL('../feed.xml',import.meta.url),'utf8');
assert.equal(xml,buildFeed(entries),'committed feed matches its source');
assert.equal(new Set(entries.map(c=>c.id)).size,entries.length);
// Preserve the original date-only identity once per historical publication day.
for(const date of new Set(entries.map(c=>c.date)))
  assert.ok(entries.some(c=>c.date===date&&c.id===date),'legacy identity retained: '+date);
const guidList=text=>[...text.matchAll(/<guid[^>]*>(.*?)<\/guid>/g)].map(m=>m[1]);
const originalIds=guidList(xml);
assert.equal(new Set(originalIds).size,entries.length,'same-day releases remain distinct');
assert.deepEqual(guidList(buildFeed(entries.map(c=>({...c,title:c.title+' edited',items:['Revised wording']})))),originalIds);
assert.deepEqual(guidList(buildFeed([...entries].reverse())),[...originalIds].reverse());
const extra={...entries[0],id:'new-same-day-release'};
assert.deepEqual(guidList(buildFeed([extra,...entries])).slice(1),originalIds);
assert.equal(buildFeed(entries),buildFeed(entries),'deterministic generation');
for(const bad of [[],[{...extra,id:undefined}],[extra,extra],[{...extra,id:'bad<&'}],
  [{...extra,date:'2026-02-30'}],[{...extra,date:'not a date'}],
  [{...extra,title:''}],[{...extra,items:[]}],[{...extra,items:[null]}]])
  assert.throws(()=>buildFeed(bad));
console.log(`PASS: ${entries.length} unique stable release IDs, legacy identities, edits/reordering, same-day insertion and invalid-source rejection.`);

const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const BASE=process.env.BASE||'http://127.0.0.1:8000';
try{
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:320,height:850},reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  const page=await context.newPage();
  const sample={id:'escaping-test',date:'2026-10-31',title:'Tools & <AI> "quotes"',items:['<img src=x onerror=alert(1)> & readable']};
  const parsed=await page.evaluate(({actual,sample})=>{
    const parse=text=>new DOMParser().parseFromString(text,'application/xml');
    const feed=parse(actual),test=parse(sample);
    const html=new DOMParser().parseFromString(test.querySelector('item description').textContent,'text/html');
    return {errors:feed.querySelectorAll('parsererror').length+test.querySelectorAll('parsererror').length,
      count:feed.querySelectorAll('item').length,guids:[...feed.querySelectorAll('guid')].map(e=>e.textContent),
      self:feed.getElementsByTagNameNS('http://www.w3.org/2005/Atom','link')[0]?.getAttribute('href'),
      title:test.querySelector('item title').textContent,body:html.body.textContent,images:html.querySelectorAll('img').length};
  },{actual:xml,sample:buildFeed([sample])});
  assert.equal(parsed.errors,0);assert.equal(parsed.count,entries.length);
  assert.deepEqual(parsed.guids,originalIds);assert.equal(parsed.self,'https://kashsec.vercel.app/feed.xml');
  assert.equal(parsed.title,sample.title);assert.equal(parsed.body,sample.items[0]);assert.equal(parsed.images,0);
  console.log('PASS: actual RSS parses as XML, self link resolves, and reserved characters remain literal safe text.');
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/#/changelog');
  const follow=page.getByRole('link',{name:'Follow updates with RSS',exact:true});
  await follow.waitFor();assert.equal(await follow.getAttribute('href'),'/feed.xml');
  assert.equal(await page.locator('.cl-entry').count(),entries.length);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await follow.click();
  const delivered=await page.evaluate(async()=>{
    const response=await fetch('/feed.xml');const text=await response.text();
    const doc=new DOMParser().parseFromString(text,'application/xml');
    return {status:response.status,errors:doc.querySelectorAll('parsererror').length,ids:[...doc.querySelectorAll('guid')].map(e=>e.textContent)};
  });
  assert.equal(delivered.status,200);assert.equal(delivered.errors,0);assert.deepEqual(delivered.ids,originalIds);
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS: mobile changelog exposes a working subscription link and serves every release with its distinct ID.');
}finally{await browser.close();}
