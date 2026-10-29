#!/usr/bin/env node
// Run against the preview dev server, after the root content build.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const BASE=process.env.PREVIEW_BASE||'http://localhost:8080';
const {paths}=JSON.parse(fs.readFileSync(new URL('../preview/src/data/catalog.json',import.meta.url)));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844},reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/paths/?q=CSSLP',{waitUntil:'domcontentloaded'});
  const finder=page.getByLabel('Find a path',{exact:true});await finder.waitFor();
  assert.equal(await page.locator('ul.mt-4>li').count(),1);
  await finder.fill('');await finder.pressSequentially('ASVS',{delay:30});
  await page.waitForFunction(()=>new URL(location.href).searchParams.get('q')==='ASVS');
  assert.ok(await page.locator('ul.mt-4>li').count()>=1);
  await finder.fill('CSSLP');await page.getByRole('button',{name:'Programs',exact:true}).click();
  assert.equal(await page.locator('ul.mt-4>li').count(),1);
  await page.reload({waitUntil:'domcontentloaded'});await finder.waitFor();assert.equal(await finder.inputValue(),'CSSLP');
  assert.equal(await page.getByRole('button',{name:'Programs',exact:true}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Offense & practice',exact:true}).click();assert.equal(await page.locator('ul.mt-4>li').count(),0);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();assert.equal(await page.locator('ul.mt-4>li').count(),paths.length);
  console.log('Preview: path finder matches topics/certificates; combined filters, typed input, refresh and reset passed.');
  for(const path of paths){
    await page.goto(`${BASE}/paths/${path.id}`,{waitUntil:'domcontentloaded'});
    await page.getByRole('heading',{name:`All ${path.lessons.length} lessons`,exact:true}).waitFor();
    assert.equal(await page.locator('ol[aria-label="Learning stages"]>li').count(),4,path.id);
    assert.ok(await page.locator('section[aria-labelledby="path-credentials-heading"] article a').count()>0,path.id);
    assert.equal(await page.locator('a[aria-current="step"]').count(),1,path.id);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path.id);
  }
  await page.goto(BASE+'/paths/22-devsecops-appsec');
  await page.getByRole('link',{name:/Start stage 1/}).click();
  await page.waitForURL('**/lesson/22-devsecops-appsec/what-is-devsecops');
  await page.locator('.prose-lesson').waitFor();
  assert.match(await page.locator('.prose-lesson').innerText(),/AppSec and DevSecOps/);
  const file=await page.request.get(BASE+'/downloads/appsec_invoice_lab.py');
  assert.equal(file.status(),200);assert.match(await file.text(),/class InvoiceSecurityTests/);
  assert.deepEqual(errors,[]);
  console.log(`Preview: ${paths.length} mobile roadmaps and credential sections passed; lesson navigation and lab download passed.`);
}finally{await browser.close();}
