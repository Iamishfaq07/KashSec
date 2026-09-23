#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(BASE + '/tools/cvss.html');
  await page.locator('.cvss-opts[data-k="AV"]').waitFor();
  if(await page.locator('#tourSkip').isVisible()) await page.locator('#tourSkip').click();
  // FIRST's Log4Shell v4.0 Base+Threat example scores 9.3.
  const example = {AV:'N',AC:'L',AT:'N',PR:'N',UI:'N',VC:'H',VI:'H',VA:'H',SC:'N',SI:'N',SA:'N',E:'A'};
  for(const [key,value] of Object.entries(example)){
    await page.locator(`.cvss-opts[data-k="${key}"] [data-v="${value}"]`).click();
  }
  await page.waitForFunction(() => document.querySelector('#cvssResult .cvss-num')?.textContent === '9.3');
  assert.match(await page.locator('#cvssVector').innerText(), /^CVSS:4\.0\/AV:N\/AC:L\/AT:N/);
  await page.locator('[data-cvss-version="3"]').click();
  await page.locator('#cvssVector').getByText('CVSS:3.1/', {exact:false}).waitFor();
  assert.deepEqual(errors, []);
  console.log('CVSS 4.0 matches FIRST Log4Shell example; CVSS 3.1 remains available.');
} finally {
  await browser.close();
}
