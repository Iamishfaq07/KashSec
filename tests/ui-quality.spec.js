#!/usr/bin/env node
/*
 * UI quality gates, from the ui-ux-pro-max pre-delivery checklist.
 *
 * These guard the things that regress silently and that no other suite here
 * would catch: an emoji creeping back into a card grid, a card icon that
 * renders as an empty box because its name was typo'd, a tap target under
 * 32px, an animation that ignores prefers-reduced-motion, or text that
 * quietly drops under 4.5:1 contrast.
 *
 * The contrast check composites alpha layers. Reading backgroundColor off
 * the nearest painted ancestor treats a translucent chip fill as opaque,
 * which both invents failures and hides real ones — the difficulty chips
 * measure 1.39:1 that way and 12.67:1 once properly composited.
 *
 *   node tests/ui-quality.spec.js        (expects a server on :8000)
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const results = [];
const record = (name, ok, detail) => results.push({ name, ok, detail });

// WCAG relative luminance + contrast ratio.
const lum = ([r, g, b]) => {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* Runs inside the page. Returns [{sel, fg, bg}] with bg composited down
   through every translucent layer to the first opaque one. */
function measureContrast() {
  const parse = s => {
    const n = (s.match(/[\d.]+/g) || []).map(Number);
    return { c: n.slice(0, 3), a: n.length > 3 ? n[3] : 1 };
  };
  const effBg = el => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const { c, a } = parse(getComputedStyle(e).backgroundColor);
      if (a === 0) continue;
      stack.push({ c, a });
      if (a === 1) break;
    }
    if (!stack.length || stack[stack.length - 1].a !== 1) stack.push({ c: [255, 255, 255], a: 1 });
    let out = stack[stack.length - 1].c;
    for (let i = stack.length - 2; i >= 0; i--) {
      const { c, a } = stack[i];
      out = out.map((v, j) => a * c[j] + (1 - a) * v);
    }
    return out;
  };
  const out = [];
  const body = document.querySelector('.lab-card p, .lab-card .lab-desc, .sec-sub, .path-desc, p');
  if (body) out.push({ sel: 'body text', fg: parse(getComputedStyle(body).color).c, bg: effBg(body) });
  const seen = new Set();
  document.querySelectorAll('.level-chip').forEach(c => {
    if (seen.has(c.dataset.tier)) return;
    seen.add(c.dataset.tier);
    out.push({ sel: `level-chip[${c.dataset.tier}]`, fg: parse(getComputedStyle(c).color).c, bg: effBg(c) });
  });
  return out;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 }, serviceWorkers: 'block', colorScheme: theme,
    });
    // Skip the first-run tour; it covers the page and isn't what we're testing.
    await ctx.addInitScript(() => {
      try {
        const k = 'kashsec_state_v1';
        const s = JSON.parse(localStorage.getItem(k) || '{}');
        s.tourDone = true; s.onboarded = true; s.tourSeen = true;
        localStorage.setItem(k, JSON.stringify(s));
      } catch (e) {}
    });
    const page = await ctx.newPage();

    /* ---- tools page: the card icon grid ---- */
    await page.goto(`${BASE}/index.html#/tools`, { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Emoji rendered per-OS and, worse, repeated: one glyph covered three
    // unrelated tools, so the icon disambiguated nothing.
    const emoji = await page.evaluate(() =>
      [...document.querySelectorAll('.lab-ico, .cmd-ico')]
        .filter(el => /\p{Extended_Pictographic}/u.test(el.textContent || '')).length);
    record(`[${theme}] card icons are SVG, not emoji`, emoji === 0, `${emoji} emoji found`);

    // A typo'd icon name would otherwise fail silently as an empty box.
    const icons = await page.evaluate(() => {
      const all = [...document.querySelectorAll('.lab-ico')];
      return { total: all.length, empty: all.filter(el => !el.querySelector('svg')).length };
    });
    record(`[${theme}] every card icon rendered an SVG`,
      icons.total > 0 && icons.empty === 0, `${icons.total} icons, ${icons.empty} empty`);

    for (const m of await page.evaluate(measureContrast)) {
      const r = ratio(m.fg, m.bg);
      record(`[${theme}] ${m.sel} contrast >= 4.5:1`, r >= 4.5, `${r.toFixed(2)}:1`);
    }

    // Touch targets. 44px is the guideline; 32px is the floor below which
    // spacing can no longer compensate.
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, a.btn-amber, .icon-btn')]
        .filter(el => el.offsetParent !== null)
        .map(el => { const r = el.getBoundingClientRect(); return { t: el.className, w: Math.round(r.width), h: Math.round(r.height) }; })
        .filter(b => b.w > 0 && (b.w < 32 || b.h < 32)));
    record(`[${theme}] no interactive control under 32px`, small.length === 0,
      small.slice(0, 4).map(b => `${b.t} ${b.w}x${b.h}`).join(', '));

    // Removing focus rings is the most common accessibility regression there is.
    const focusVisible = await page.evaluate(() => {
      const b = document.querySelector('.nav-links a');
      if (!b) return null;
      b.focus();
      const s = getComputedStyle(b);
      return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
    });
    record(`[${theme}] focused control shows a visible indicator`, focusVisible !== false);

    /* ---- course page: the difficulty chips ----
       Their own pass, because each tier has a different fill and small
       uppercase text on a tinted background is exactly where contrast
       quietly fails. It did: the first version of these chips measured
       2.91:1 on the light theme. */
    await page.goto(`${BASE}/index.html#/course`, { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const tiers = (await page.evaluate(measureContrast)).filter(c => c.sel.startsWith('level-chip'));
    record(`[${theme}] difficulty chips render`, tiers.length >= 4, `${tiers.length} tiers found`);
    for (const m of tiers) {
      const r = ratio(m.fg, m.bg);
      record(`[${theme}] ${m.sel} contrast >= 4.5:1`, r >= 4.5, `${r.toFixed(2)}:1`);
    }

    await ctx.close();
  }

  /* ---- reduced motion must neutralise the reveal, not merely shorten it:
         content has to end up visible, not stuck mid-fade ---- */
  const rm = await browser.newContext({
    viewport: { width: 1280, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce',
  });
  const p2 = await rm.newPage();
  await p2.goto(`${BASE}/index.html#/labs`, { waitUntil: 'load' });
  await p2.waitForTimeout(1800);
  const motion = await p2.evaluate(() => {
    const cards = [...document.querySelectorAll('.labs-grid > *')];
    return {
      total: cards.length,
      hidden: cards.filter(c => parseFloat(getComputedStyle(c).opacity) < 0.99).length,
      moved: cards.filter(c => getComputedStyle(c).transform !== 'none').length,
    };
  });
  record('reduced-motion: all cards fully visible and untransformed',
    motion.total > 0 && motion.hidden === 0 && motion.moved === 0,
    `${motion.total} cards, ${motion.hidden} faded, ${motion.moved} transformed`);
  await rm.close();

  /* ---- structural checks added after a full-site audit ----
     Three defects that every existing suite walked straight past.

     1. NAV OVERFLOW. The bar laid out at roughly 1366px minimum, but the
        hamburger only took over below 900px. Between those two the row
        overflowed — by 392px at the narrow end — and because the body sets
        overflow-x:hidden it was clipped rather than scrollable. The Start
        button, the site's primary call to action, was simply invisible on
        every common laptop width. Nothing caught it because nothing here
        had ever measured a layout at more than one viewport size.

     2. NO <h1>. 25 routes had no <h1> anywhere in the document — the
        heading a screen reader user jumps to first, and the strongest
        on-page signal a search engine has.

     3. UNLABELLED CONTROLS. Six inputs reachable by keyboard with no
        accessible name at all. */
  const structural = await (async () => {
    const out = [];
    const ROUTES = ['#/', '#/course', '#/labs', '#/tools', '#/tasks', '#/exam', '#/glossary',
      '#/progress', '#/about', '#/privacy', '#/review', '#/daily', '#/search',
      '#/lesson/01-introduction', '#/lesson/01-introduction/cia-triad-explained',
      '#/labs/terminal', '#/tools/encoder', '#/quiz/01-introduction'];

    // 1. the nav must fit, and the CTA must be on screen, at every width a
    //    real visitor might use.
    const clipped = [];
    for (const w of [901, 1024, 1180, 1280, 1366, 1440, 1600]) {
      const c = await browser.newContext({ viewport: { width: w, height: 800 }, serviceWorkers: 'block' });
      const pg = await c.newPage();
      await pg.goto(`${BASE}/index.html#/course`, { waitUntil: 'load' });
      await pg.waitForTimeout(700);
      const bad = await pg.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const start = document.querySelector('#startBtn');
        const nav = document.querySelector('.nav');
        return { over: nav.scrollWidth - vw, cut: Math.round(start.getBoundingClientRect().right) > vw };
      });
      if (bad.cut || bad.over > 1) clipped.push(`${w}px(+${bad.over}${bad.cut ? ', CTA cut off' : ''})`);
      await c.close();
    }
    out.push(['the header fits and the Start button is visible at every width',
      clipped.length === 0, clipped.join(' ')]);

    // 2 + 3, measured on one pass over the routes.
    const noH1 = [], multiH1 = [], unlabelled = [];
    const c2 = await browser.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: 'block' });
    await c2.addInitScript(() => { try { const k = 'kashsec_state_v1';
      const st = JSON.parse(localStorage.getItem(k) || '{}');
      st.tourDone = true; st.tourSeen = true; localStorage.setItem(k, JSON.stringify(st)); } catch (e) {} });
    const pg2 = await c2.newPage();
    for (const r of ROUTES) {
      await pg2.goto(`${BASE}/index.html${r}`, { waitUntil: 'load' });
      await pg2.waitForTimeout(700);
      const d = await pg2.evaluate(() => {
        const h1 = document.querySelectorAll('#app h1').length;
        /* visibility:hidden must be excluded as well as display:none — the
           flashcard rating buttons are visibility-hidden until a card is
           flipped, so innerText reads empty while textContent is fine.
           A wrapping <label> with text is a valid accessible name; only
           checking label[for] invents failures on every tool page. */
        const bad = [...document.querySelectorAll('#app input,#app textarea,#app select,#app button')]
          .filter(el => {
            if (el.offsetParent === null || getComputedStyle(el).visibility === 'hidden') return false;
            if ((el.textContent || '').trim()) return false;
            if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) return false;
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return false;
            const w = el.closest('label');
            if (w && w.innerText.trim()) return false;
            return true;
          }).map(el => `${el.tagName.toLowerCase()}#${el.id || '?'}`);
        return { h1, bad };
      });
      if (d.h1 === 0) noH1.push(r);
      else if (d.h1 > 1) multiH1.push(`${r}(${d.h1})`);
      if (d.bad.length) unlabelled.push(`${r}: ${d.bad.join(', ')}`);
    }
    await c2.close();
    out.push([`every route has exactly one <h1> (${ROUTES.length} routes)`,
      noH1.length === 0 && multiH1.length === 0,
      [noH1.length ? `none on ${noH1.join(', ')}` : '', multiH1.length ? `several on ${multiH1.join(', ')}` : ''].filter(Boolean).join(' | ')]);
    out.push(['every interactive control has an accessible name',
      unlabelled.length === 0, unlabelled.join(' | ')]);
    return out;
  })();
  structural.forEach(([n, ok, d]) => record(n, ok, d));

  const mobileOverflow = [];
  for(const width of [320, 360, 390, 430, 768]){
    const mobile = await browser.newContext({viewport:{width,height:900}, serviceWorkers:'block'});
    await mobile.addInitScript(() => { try {
      const key = 'kashsec_state_v1';
      const state = JSON.parse(localStorage.getItem(key) || '{}');
      state.tourDone = true; state.tourSeen = true; state.onboarded = true;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (_) {} });
    const mobilePage = await mobile.newPage();
    for(const [name, route] of [['home','/'], ['careers','/index.html#/careers'], ['lesson','/lesson/11-web-security/xss.html']]){
      await mobilePage.goto(`${BASE}${route}`, {waitUntil:'load'});
      const excess = await mobilePage.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if(excess > 2) mobileOverflow.push(`${name}@${width}px (+${excess}px)`);
    }
    if(width === 320){
      await mobilePage.locator('#hamb').focus();
      await mobilePage.keyboard.press('Enter');
      const focusedFirstLink = await mobilePage.evaluate(() =>
        document.activeElement === document.querySelector('#navLinks a'));
      if(!focusedFirstLink) mobileOverflow.push('keyboard focus did not enter mobile menu');
      await mobilePage.keyboard.press('Escape');
      const menuClosed = await mobilePage.evaluate(() =>
        document.activeElement === document.querySelector('#hamb') &&
        document.querySelector('#hamb').getAttribute('aria-expanded') === 'false');
      if(!menuClosed) mobileOverflow.push('Escape did not close mobile menu and restore focus');
      await mobilePage.locator('#hamb').click();
      const randomVisible = await mobilePage.locator('#randomMobileBtn').isVisible();
      if(!randomVisible) mobileOverflow.push('random lesson missing from mobile menu');
      else {
        await mobilePage.locator('#randomMobileBtn').click();
        await mobilePage.waitForURL(url => url.pathname.startsWith('/lesson/') && url.pathname.endsWith('.html'));
      }
    }
    await mobile.close();
  }
  record('mobile pages fit 320–768px and keep random lesson available',
    mobileOverflow.length === 0, mobileOverflow.join(', '));
  /* Dialogs must keep Tab inside the visible panel and return focus to their
     opener. Otherwise keyboard users can operate the page behind a modal. */
  const dialogs = await browser.newContext({ serviceWorkers: 'block' });
  await dialogs.addInitScript(() => { try {
    const key = 'kashsec_state_v1';
    const state = JSON.parse(localStorage.getItem(key) || '{}');
    state.tourDone = true; state.tourSeen = true;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (_) {} });
  const dialogPage = await dialogs.newPage();
  await dialogPage.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  const searchButton = dialogPage.locator('#searchBtn');
  await searchButton.click();
  record('search dialog input has an accessible name',
    await dialogPage.getByRole('textbox', {name:'Search lessons'}).count() === 1);
  await dialogPage.locator('#searchInput').focus();
  await dialogPage.keyboard.press('Shift+Tab');
  const searchTrapped = await dialogPage.evaluate(() =>
    document.querySelector('.search-overlay.open')?.contains(document.activeElement) &&
    document.getElementById('app').inert);
  await dialogPage.keyboard.press('Escape');
  const searchRestored = await dialogPage.evaluate(() =>
    document.activeElement === document.getElementById('searchBtn') &&
    !document.getElementById('app').inert);
  record('search dialog traps Tab and restores focus', searchTrapped && searchRestored);

  await searchButton.focus();
  await dialogPage.keyboard.press('?');
  const shortcutFocused = await dialogPage.evaluate(() =>
    document.activeElement === document.getElementById('kbdCloseBtn'));
  await dialogPage.keyboard.press('Tab');
  const shortcutTrapped = await dialogPage.evaluate(() =>
    document.activeElement === document.getElementById('kbdCloseBtn'));
  await dialogPage.keyboard.press('Escape');
  const shortcutRestored = await dialogPage.evaluate(() =>
    document.activeElement === document.getElementById('searchBtn'));
  record('keyboard shortcuts dialog traps and restores focus',
    shortcutFocused && shortcutTrapped && shortcutRestored,
    `initial=${shortcutFocused}, tab=${shortcutTrapped}, restored=${shortcutRestored}`);

  await searchButton.focus();
  await dialogPage.evaluate(() => openAuth());
  record('account email input has an accessible name',
    await dialogPage.getByRole('textbox', {name:'Email address'}).count() === 1);
  await dialogPage.locator('#authCloseBtn').focus();
  for(let i = 0; i < 6; i++) await dialogPage.keyboard.press('Tab');
  const authTrapped = await dialogPage.evaluate(() =>
    document.querySelector('.auth-overlay.open')?.contains(document.activeElement) &&
    document.getElementById('app').inert);
  await dialogPage.keyboard.press('Escape');
  const authRestored = await dialogPage.evaluate(() =>
    document.activeElement === document.getElementById('searchBtn') &&
    !document.getElementById('app').inert);
  record('account dialog traps Tab and restores focus', authTrapped && authRestored);
  await dialogs.close();

  await browser.close();

  console.log(`\n  UI quality — ${results.length} checks\n`);
  let failed = 0;
  for (const r of results) {
    if (r.ok) { console.log(`  ✓ ${r.name}${r.detail ? ` — ${r.detail}` : ''}`); continue; }
    failed++; console.log(`  ✗ ${r.name}${r.detail ? `\n      ${r.detail}` : ''}`);
  }
  console.log(`\n  ${results.length - failed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
