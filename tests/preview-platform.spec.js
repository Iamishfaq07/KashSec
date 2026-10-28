#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const BASE = process.env.PREVIEW_BASE || 'http://127.0.0.1:8080';

for (const path of ['/api/auth/get-session','/api/auth/oauth2/get-session']) {
  const response = await fetch(BASE + path);
  assert.equal(response.status, 200, path);
  assert.equal(await response.json(), null, 'a visitor without a session remains signed out');
}
for (const [path, body] of [
  ['/api/auth/sign-in/oauth2',{providerId:'grok-google',callbackURL:BASE+'/paths'}],
  ['/api/auth/oauth2/sign-in/social',{provider:'grok-google',callbackURL:BASE+'/paths'}],
]) {
  const response = await fetch(BASE + path, {method:'POST',redirect:'manual',headers:{'content-type':'application/json',origin:BASE},body:JSON.stringify(body)});
  assert.equal(response.status, 200, 'sign-in initializes without contacting the broker');
  const data = await response.json();
  const authorization = new URL(data.url);
  assert.equal(authorization.searchParams.get('redirect_uri'), BASE + '/api/auth/oauth2/callback/grok-google', 'the registered callback URL stays unchanged');
  assert.ok(authorization.searchParams.get('state'), 'OAuth state is present');
  assert.ok(response.headers.get('set-cookie')?.includes('HttpOnly'), 'state cookie is not script-readable');
}
const malformed = await fetch(BASE+'/api/auth/sign-in/oauth2',{method:'POST',headers:{'content-type':'application/json',origin:BASE},body:'null'});
assert.equal(malformed.status,400);
const hostile = await fetch(BASE+'/api/auth/oauth2/sign-out',{method:'POST',headers:{'content-type':'application/json',origin:'https://attacker.invalid',cookie:'__Host-grok-auth.session_token=invalid-test-session'},body:'{}'});
assert.equal(hostile.status,403,'auth still rejects an untrusted origin');

const manifestResponse = await fetch(BASE+'/__grok/manifest.webmanifest');
assert.equal(manifestResponse.status,200);
const manifest = await manifestResponse.json();
assert.equal(manifest.name,'KashSec Academy');
for(const icon of manifest.icons) assert.equal((await fetch(BASE+icon.src)).status,200,'install icon is served');
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(BASE).origin?route.continue():route.abort());
  const page = await context.newPage();
  await page.goto(BASE+'/?install=1&platform=ios');
  assert.match(await page.locator('h1').innerText(),/KashSec Academy/);
  assert.equal(await page.locator('.button').getAttribute('href'),'/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'installation guide fits a phone');
  assert.equal(await page.evaluate(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0)),true,'install images load');
  console.log('Preview platform: old/new auth endpoints, OAuth callback compatibility, CSRF rejection, manifest, icon and mobile install page passed.');
} finally {await browser.close();}
