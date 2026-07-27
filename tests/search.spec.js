#!/usr/bin/env node
/*
 * Search: the two-tier body index and the linkable results page.
 *
 * The behaviour worth pinning is what does NOT get downloaded. Opening the
 * overlay used to fetch 427KB gzipped of lesson text immediately — including
 * for people who opened it and pressed Escape, and for people using it as a
 * command palette to jump to a page by name, which needs no body text at
 * all. Nothing should load until a real query is typed.
 *
 *   node tests/search.spec.js        (expects a server on :8000)
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const ok = [], bad = [];
const t = (name, pass, detail) => (pass ? ok : bad).push(`${name}${detail ? ` — ${detail}` : ''}`);

const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
await ctx.addInitScript(() => {
  try { const k = 'kashsec_state_v1'; const s = JSON.parse(localStorage.getItem(k) || '{}');
    s.tourDone = true; s.tourSeen = true; localStorage.setItem(k, JSON.stringify(s)); } catch (e) {}
});
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const fetched = [];
p.on('request', r => {
  const u = r.url();
  if (/search-(preview|index)\.js/.test(u)) fetched.push(u.split('/').pop());
});

/* ---- opening the overlay must cost nothing ---- */
await p.goto(`${BASE}/index.html#/`, { waitUntil: 'load' });
await p.waitForTimeout(2000);
fetched.length = 0;
await p.click('#searchBtn');
await p.waitForTimeout(1500);
t('opening search downloads no body index', fetched.length === 0, fetched.join(', ') || 'none');

/* ---- command-palette use (no query) still works with no index ---- */
t('command palette lists jump targets with no index loaded',
  (await p.locator('#searchResults .search-result, #searchResults .cmd-row').count()) > 0);

/* ---- typing pulls the preview tier first, then the full index ---- */
await p.fill('#searchInput', 'kerberoast');
await p.waitForTimeout(2500);
t('typing loads the preview tier first', fetched[0] === 'search-preview.js', fetched.join(' then ') || 'nothing');
await p.waitForTimeout(3500);
t('full index follows in the background', fetched.includes('search-index.js'), fetched.join(' then '));
t('body matches are found', (await p.locator('#searchResults .search-result').count()) > 0);

/* ---- the results page ---- */
await p.goto(`${BASE}/index.html#/search?q=kerberoasting`, { waitUntil: 'load' });
await p.waitForTimeout(3000);
const page1 = await p.evaluate(() => ({
  hits: document.querySelectorAll('.searchpage-hit').length,
  inputValue: document.getElementById('searchPageInput')?.value,
  title: document.title,
}));
t('deep link renders results', page1.hits > 0, `${page1.hits} hits`);
t('query is reflected in the input', page1.inputValue === 'kerberoasting', page1.inputValue);
t('document title carries the query', /kerberoasting/i.test(page1.title), page1.title);

/* ---- submitting the form updates the URL, so results stay linkable ---- */
await p.fill('#searchPageInput', 'subnet');
await p.press('#searchPageInput', 'Enter');
await p.waitForTimeout(2000);
t('submitting rewrites the hash', /#\/search\?q=subnet/.test(p.url()), p.url().split('index.html')[1]);
t('new query renders new results', (await p.locator('.searchpage-hit').count()) > 0);

/* ---- a query with no matches must not look broken ---- */
await p.goto(`${BASE}/index.html#/search?q=zzzzqqqxyzzy`, { waitUntil: 'load' });
await p.waitForTimeout(2500);
t('empty result set shows a clear message',
  (await p.locator('.search-empty').count()) === 1 && (await p.locator('.searchpage-hit').count()) === 0);

/* ---- a URL-encoded multi-word query round-trips ---- */
await p.goto(`${BASE}/index.html#/search?q=${encodeURIComponent('sql injection')}`, { waitUntil: 'load' });
await p.waitForTimeout(3000);
t('encoded multi-word query decodes correctly',
  (await p.evaluate(() => document.getElementById('searchPageInput')?.value)) === 'sql injection');
t('multi-word query returns hits', (await p.locator('.searchpage-hit').count()) > 0);

/* ---- SearchAction target must actually resolve ---- */
const target = await p.evaluate(() => {
  const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent));
  const site = blocks.find(b => b['@type'] === 'WebSite');
  return site && site.potentialAction ? site.potentialAction.target.urlTemplate : null;
});
t('WebSite declares a SearchAction', !!target, target || 'missing');
if (target) {
  await p.goto(target.replace('https://kashsec.vercel.app/', `${BASE}/index.html`).replace('{search_term_string}', 'linux'),
    { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  t('the declared SearchAction URL really returns results',
    (await p.locator('.searchpage-hit').count()) > 0);
}

console.log(`\n  Search — ${ok.length + bad.length} checks\n`);
ok.forEach(n => console.log(`  ✓ ${n}`));
bad.forEach(n => console.log(`  ✗ ${n}`));
console.log(`\n  ${ok.length} passed, ${bad.length} failed`);
console.log(`  JS errors: ${errs.length ? errs.join(' | ') : 'none'}\n`);
await br.close();
process.exit(bad.length || errs.length ? 1 : 0);
