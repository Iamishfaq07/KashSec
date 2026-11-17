#!/usr/bin/env node
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
  for(const width of [320,1280]){
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
    await context.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE+'/tools/dnsrecords.html');await page.locator('#dnsCase').waitFor();
    assert.match(await page.locator('#toolBody').innerText(),/no DNS queries/);
    assert.equal(await page.locator('#dnsResult').isHidden(),true);
    await page.locator('#dnsCheck').click();assert.match(await page.locator('#dnsFeedback').innerText(),/Choose a record type first/);
    const cases=[['A','192.0.2.20'],['AAAA','2001:db8::20'],['MX','MX 10 mail.lab.test.'],['CNAME','CNAME web.lab.test.'],['TXT','site-verification=training']];
    for(const [i,[type,record]] of cases.entries()){
      await page.locator('#dnsCase').selectOption(String(i));
      assert.equal(await page.locator('#dnsFeedback').innerText(),'');assert.equal(await page.locator('#dnsResult').isHidden(),true);
      await page.locator('#dnsType').selectOption(type==='A'?'MX':'A');await page.locator('#dnsCheck').click();
      assert.match(await page.locator('#dnsFeedback').innerText(),/^Try again/);assert.equal(await page.locator('#dnsResult').isHidden(),true);
      await page.locator('#dnsType').selectOption(type);await page.locator('#dnsType').focus();await page.keyboard.press('Tab');await page.keyboard.press('Enter');
      assert.match(await page.locator('#dnsFeedback').innerText(),/^Correct\./);assert.ok((await page.locator('#dnsRecord').innerText()).includes(record));
      assert.match(await page.locator('#dnsResult').innerText(),/does not guarantee/);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'tool fits viewport');
    await page.getByRole('link',{name:'Read the DNS lesson'}).click();await page.waitForURL('**/lesson/02-networking/dns.html');
    await page.locator('#content[aria-busy="false"]').waitFor();
    assert.match(await page.locator('#content').innerText(),/does not guarantee that every resolver/);
    assert.deepEqual(errors,[]);await context.close();
  }
  const offline=await browser.newContext({serviceWorkers:'allow'});
  await offline.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await offline.addInitScript(()=>localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true})));
  const page=await offline.newPage();
  await page.goto(BASE+'/tools/dnsrecords.html');await page.locator('#dnsCase').waitFor();
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await offline.setOffline(true);await page.reload();await page.locator('#dnsCase').waitFor();
  await page.locator('#dnsType').selectOption('A');await page.locator('#dnsCheck').click();
  assert.match(await page.locator('#dnsRecord').innerText(),/192\.0\.2\.20/,'opened practice works offline');
  await offline.close();
  console.log('PASS: five DNS record tasks, feedback, reset, keyboard navigation, TTL and lesson link.');
}finally{await browser.close();}
