#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({ viewport: { width: 320, height: 800 }, serviceWorkers: 'block' });
context.setDefaultTimeout(15000);
await context.addInitScript(() => {
  localStorage.setItem('kashsec_state_v1', JSON.stringify({ tourSeen: true, tourDone: true }));
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(BASE + '/certlab/');
  await page.getByRole('heading', { name: 'Certification prep', level: 1 }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'Open plan' }).count(), 3);
  await page.getByRole('link', { name: 'CompTIA Security+' }).click();
  await page.getByRole('heading', { name: 'CompTIA Security+', level: 1 }).waitFor();
  await page.locator('#ksPlan input[name="minutes"]').fill('45');
  await page.locator('#ksPlan input[name="exam"]').fill('2026-11-19');
  await page.getByRole('button', { name: 'Rebuild plan' }).click();
  await page.getByText('This plan runs past the exam date').waitFor();
  await page.reload();
  await page.getByText('This plan runs past the exam date').waitFor();
  await page.locator('input[name="secplus.q1"][value="0"]').check();
  await page.locator('input[name="secplus.q2"][value="1"]').check();
  await page.locator('input[name="secplus.q3"][value="0"]').check();
  await page.locator('input[name="secplus.q4"][value="1"]').check();
  await page.getByRole('button', { name: 'Check answers' }).click();
  await page.getByText('3 of 4 correct').waitFor();
  assert.match(await page.locator('#ksQuizResult').innerText(), /trusted session/);
  assert.match(await page.locator('#ksQuizResult').innerText(), /review due/);

  await page.goto(BASE + '/cybercity/');
  await page.getByRole('heading', { name: 'Northbridge Billing', level: 1 }).waitFor();
  await page.getByRole('link', { name: 'Open the exchange' }).click();
  await page.getByRole('heading', { name: 'Tester desk', level: 1 }).waitFor();
  await page.getByLabel('The tenant and role in the query string').check();
  await page.getByRole('button', { name: 'Check the field' }).click();
  await page.getByText('That matches the fixture.').waitFor();

  await page.goto(BASE + '/cybercity/');
  await page.getByRole('link', { name: 'Open the log desk' }).click();
  await page.locator('#ksTriage select[name="login"]').selectOption('not-enough');
  await page.locator('#ksTriage select[name="cross"]').selectOption('suspicious');
  await page.locator('#ksTriage select[name="own"]').selectOption('expected');
  await page.locator('#ksTriage select[name="endpoint-gap"]').selectOption('not-enough');
  await page.locator('#ksTriage select[name="reset"]').selectOption('not-enough');
  await page.getByRole('button', { name: 'Check the lines' }).click();
  await page.getByText('All 5 lines match').waitFor();
  await page.locator('#ksHunt select[name="source"]').selectOption('api');
  await page.locator('#ksHunt select[name="token"]').selectOption('tenant=birch');
  await page.getByRole('button', { name: 'Run filter' }).click();
  await page.getByText('only the cross-tenant 200').waitFor();

  await page.goto(BASE + '/cybercity/');
  await page.getByRole('link', { name: 'Open the role' }).click();
  await page.locator('#ksIam select[name="actions"]').selectOption('invoices-read');
  await page.locator('#ksIam select[name="tenants"]').selectOption('caller');
  await page.locator('#ksIam select[name="principal"]').selectOption('billing-fn');
  await page.getByRole('button', { name: 'Run role cases' }).click();
  await page.getByText('All 4 role cases passed').waitFor();

  await page.goto(BASE + '/cybercity/');
  await page.getByRole('link', { name: 'Open the assistant' }).click();
  await page.locator('#ksAgent select[name="toolSource"]').selectOption('task');
  await page.locator('#ksAgent select[name="tenantSource"]').selectOption('task');
  await page.locator('#ksAgent select[name="objectSource"]').selectOption('task');
  await page.locator('#ksAgent select[name="honorApproved"]').selectOption('no');
  await page.getByRole('button', { name: 'Run assistant calls' }).click();
  await page.getByText('All 4 assistant calls matched').waitFor();

  await page.goto(BASE + '/cybercity/');
  await page.getByRole('link', { name: 'Write the timeline' }).click();
  await page.locator('#ksTimeline select[name="login"]').selectOption('context');
  await page.locator('#ksTimeline select[name="cross"]').selectOption('finding');
  await page.locator('#ksTimeline select[name="gap"]').selectOption('exclude');
  await page.locator('#ksTimeline select[name="reset"]').selectOption('exclude');
  await page.getByRole('button', { name: 'Check the note' }).click();
  await page.getByText('The note matches this fixture').waitFor();

  await page.goto(BASE + '/passport/');
  await page.getByRole('heading', { name: 'Skill record', level: 1 }).waitFor();
  await page.getByText('Cloud desk: billing role').waitFor();
  await page.goto(BASE + '/coach/');
  await page.getByRole('link', { name: 'What should I do next?' }).click();
  await page.getByText('starting skill').waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));

  await page.goto(BASE + '/fix-verify/');
  await page.getByRole('button', { name: 'Run cases' }).click();
  await page.getByText('The reference policy stays hidden').waitFor();
  await page.locator('#ksFix select[name="tenantSource"]').selectOption('session');
  await page.locator('#ksFix select[name="roleSource"]').selectOption('session');
  await page.locator('#ksFix select[name="ownerCheck"]').selectOption('match-user');
  await page.locator('#ksFix select[name="supportScope"]').selectOption('same-tenant');
  await page.getByRole('button', { name: 'Run cases' }).click();
  await page.getByText('All seven cases passed').waitFor();
  await page.locator('#ksNotes textarea').fill('Query tenant was the bug. <script>nope</script>');
  await page.getByRole('button', { name: 'Save note' }).click();
  await page.getByText('Note saved in this browser.').waitFor();
  await page.reload();
  assert.equal(await page.locator('#ksNotes textarea').inputValue(), 'Query tenant was the bug. <script>nope</script>');
  assert.equal(await page.locator('script', { hasText: 'nope' }).count(), 0);

  await page.goto(BASE + '/research/');
  await page.getByRole('button', { name: 'ai', exact: true }).click();
  assert.ok(await page.getByRole('link', { name: 'OWASP Top 10 for Large Language Model Applications' }).isVisible());
  assert.equal(await page.getByRole('link', { name: 'MITRE ATT&CK' }).isVisible(), false);
  await page.getByRole('link', { name: 'OWASP API Security Top 10' }).waitFor({ state: 'hidden' });

  await page.goto(BASE + '/skills/');
  await page.getByText('This is a starting skill').waitFor();
  await page.getByRole('link', { name: 'Confidentiality, integrity, and availability', exact: true }).click();
  await page.getByRole('button', { name: 'Mark this skill done' }).click();
  await page.getByText('This is next because you marked Confidentiality').waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.deepEqual(errors, []);
  console.log('PASS: CertLab plan, formative check, invoice repair, research filter, and skills recommendation.');
} finally {
  await browser.close();
}
