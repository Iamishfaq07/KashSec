#!/usr/bin/env node
/* An offline pack must contain every lesson or produce no download at all. */
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({ acceptDownloads: true, serviceWorkers: 'block' });
await context.addInitScript(() => {
  const key = 'kashsec_state_v1';
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  state.tourDone = true; state.tourSeen = true; state.onboarded = true;
  localStorage.setItem(key, JSON.stringify(state));
});
for(const pattern of ['**://cdn.jsdelivr.net/**', '**://fonts.googleapis.com/**',
  '**://fonts.gstatic.com/**', '**://*.supabase.co/**', '**://pagead2.googlesyndication.com/**']){
  await context.route(pattern, route => route.abort());
}

const page = await context.newPage();
const results = [];
try {
  await page.goto(`${BASE}/lesson/03-linux/`, { waitUntil: 'load' });
  await page.locator('#downloadPackBtn').waitFor();
  let downloads = 0;
  page.on('download', () => { downloads++; });

  await page.route('**/course/03-linux/*.md', route =>
    route.fulfill({ status: 404, contentType: 'text/plain', body: 'missing' }), { times: 1 });
  await page.locator('#downloadPackBtn').click();
  await page.waitForFunction(() => document.getElementById('offlinePathStatus')
    ?.textContent.includes('No pack was downloaded.'));
  results.push(['missing lesson blocks an incomplete ZIP', downloads === 0 &&
    await page.locator('#downloadPackBtn').isEnabled()]);

  const expectedEntries = await page.locator('.sublesson-card').count() + 1;
  const nextDownload = page.waitForEvent('download');
  await page.locator('#downloadPackBtn').click();
  const download = await nextDownload;
  const zip = await readFile(await download.path());
  const end = zip.length - 22;
  const validZip = zip.readUInt32LE(end) === 0x06054b50;
  const entries = validZip ? zip.readUInt16LE(end + 10) : 0;
  results.push(['retry downloads every lesson', validZip && entries === expectedEntries &&
    !zip.includes(Buffer.from('Not available offline yet')) &&
    await page.locator('#offlinePathStatus').textContent() ===
      `Offline pack with all ${expectedEntries - 1} lessons downloaded.`]);
} catch(error) {
  results.push(['offline pack browser flow', false, error.message]);
} finally {
  await browser.close();
}

console.log(`\n  Offline pack — ${results.length} checks\n`);
for(const [name, passed, detail] of results)
  console.log(`  ${passed ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
const failed = results.filter(([, passed]) => !passed).length;
console.log(`\n  ${results.length - failed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
