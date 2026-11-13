#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const BASE=process.env.BASE || 'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
try {
  for(const width of [390,1280]){
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    const external=[];
    await context.route('**/*',r=>{
      if(new URL(r.request().url()).origin===new URL(BASE).origin) return r.continue();
      external.push(r.request().url()); return r.abort();
    });
    await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
    const page=await context.newPage(); const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(BASE+'/tools/vulntriage.html');
    await page.locator('#vtCase').waitFor();
    assert.match(await page.locator('#toolBody').innerText(),/fictional data/i);
    await page.locator('#vtCheck').click();
    assert.match(await page.locator('#vtFeedback').innerText(),/Choose an answer first/);
    for(const [scenario,correct] of [[0,0],[1,1],[2,2]]){
      await page.locator('#vtCase').selectOption(String(scenario));
      await page.locator('#vtAnswer').selectOption(String((correct+1)%3));
      await page.locator('#vtCheck').click();
      assert.match(await page.locator('#vtFeedback').innerText(),/^Try again\./);
      await page.locator('#vtAnswer').selectOption(String(correct));
      assert.equal(await page.locator('#vtFeedback').innerText(),'');
      await page.locator('#vtAnswer').focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
      assert.match(await page.locator('#vtFeedback').innerText(),/^Good reasoning\./);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'tool fits viewport');
    await page.locator('#toolBody a').first().click();
    await page.waitForURL('**/lesson/22-devsecops-appsec/vulnerability-triage-in-practice.html');
    await page.locator('#mcOptions button').first().waitFor();
    assert.deepEqual(errors,[]);
    assert.ok(external.every(url=>!/(cisa\.gov|first\.org|nvd\.nist\.gov)/.test(url)),'no live vulnerability requests');
    await context.close();
  }
  console.log('PASS: fictional triage cases, feedback, keyboard, linked lesson and responsive fit.');
} finally { await browser.close(); }
