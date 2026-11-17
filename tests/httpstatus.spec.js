#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.BASE || 'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
  for(const width of [320,1280]){
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE+'/tools/httpstatus.html');await page.locator('#hsCase').waitFor();
    await page.locator('#hsCheck').click();assert.match(await page.locator('#hsFeedback').innerText(),/Choose an answer first/);
    for(const [i,correct,status] of [[0,0,'401'],[1,1,'403'],[2,2,'404'],[3,0,'429']]){
      await page.locator('#hsCase').selectOption(String(i));
      assert.match(await page.locator('#hsResponse').innerText(),new RegExp(status));
      assert.equal(await page.locator('#hsFeedback').innerText(),'');
      await page.locator('#hsAnswer').selectOption(String((correct+1)%3));await page.locator('#hsCheck').click();
      assert.match(await page.locator('#hsFeedback').innerText(),/^Try again\./);
      await page.locator('#hsAnswer').selectOption(String(correct));
      await page.locator('#hsAnswer').focus();await page.keyboard.press('Tab');await page.keyboard.press('Enter');
      assert.match(await page.locator('#hsFeedback').innerText(),/^Good reasoning\./);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'tool fits viewport');
    await page.getByRole('link',{name:'Read about methods and status codes'}).click();
    await page.waitForURL('**/lesson/05-web-basics/http-methods-status-codes.html');
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content').innerText(),/does not prove that the server identified/);
    assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: HTTP response cases, feedback, keyboard, lesson and responsive fit.');
}finally{await browser.close();}
