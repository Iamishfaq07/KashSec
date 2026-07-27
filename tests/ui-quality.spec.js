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
