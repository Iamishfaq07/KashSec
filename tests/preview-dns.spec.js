#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.PREVIEW_BASE||'http://127.0.0.1:8080';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/lesson/02-networking/dns');await page.locator('.prose-lesson').waitFor();
  const link=page.getByRole('link',{name:'DNS Record Practice',exact:true});
  assert.equal(await link.getAttribute('href'),'https://kashsec.vercel.app/tools/dnsrecords.html');
  assert.match(await page.locator('.prose-lesson').innerText(),/does not guarantee that every resolver/);
  assert.equal(await page.locator('h1').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS: preview DNS lesson, main-site practice link, TTL explanation and mobile fit.');
}finally{await browser.close();}
