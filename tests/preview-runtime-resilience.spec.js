#!/usr/bin/env node
// Requires `npm --prefix preview run build:dev`. Only generated output is modified,
// and the asset is restored even when an assertion fails.
import assert from 'node:assert/strict';
import { rename } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../preview/', import.meta.url));
const asset = root + '.vercel/output/functions/__server.func/node_modules/@electric-sql/pglite/dist/pglite.data';
const missing = asset + '.runtime-test';
const base = 'http://127.0.0.1:8082';
let child, browser;
let restored = false;
await rename(asset, missing);
try {
  child = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--port','8082'], {
    cwd:root, detached:true, env:{...process.env,DATABASE_URL:"",BETTER_AUTH_URL:base}, stdio:['ignore','pipe','pipe'],
  });
  // Consume output so a full pipe cannot stall the server. Error details are
  // deliberately not printed because auth failures can contain private data.
  child.stdout.resume(); child.stderr.resume();
  let ready = false;
  const deadline = Date.now()+30000;
  while(Date.now()<deadline) {
    try { if((await fetch(base+'/__grok/manifest.webmanifest')).ok) { ready=true; break; } } catch {}
    assert.equal(child.exitCode,null,'the built server remains running');
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(ready,'built preview starts');
  const response = await fetch(base+'/api/auth/oauth2/get-session');
  assert.equal(response.status,503,'a missing database asset fails auth without affecting lessons');
  browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
  const context = await browser.newContext();
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page = await context.newPage();
  await page.goto(base+'/lesson/03-linux/terminal-basics');
  await page.locator('.prose-lesson .code-block').first().waitFor();
  assert.equal(child.exitCode,null,'a database warm-up failure does not kill the server');
  await rename(missing,asset);
  restored = true;
  const recovered = await fetch(base+'/api/auth/oauth2/get-session');
  assert.equal(recovered.status,200,'auth can retry after its database becomes available');
  assert.equal(await recovered.json(),null);
  console.log('Built runtime: database failure leaves lessons working; auth recovers after the asset is restored.');
} finally {
  await browser?.close();
  if(child?.pid) { try { process.kill(-child.pid,'SIGTERM'); } catch {} }
  if(!restored) await rename(missing,asset);
}
