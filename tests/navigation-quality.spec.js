#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
try {
  const context = await browser.newContext({viewport:{width:1280,height:900}, serviceWorkers:'block'});
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin
    ? route.continue() : route.abort());
  await context.addInitScript(() => localStorage.setItem('kashsec_state_v1', JSON.stringify({tourSeen:true})));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(BASE + '/lesson/');
  check(!await page.locator('#installBtn').isVisible(), 'install control stays hidden until the browser offers installation');
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', {cancelable:true});
    event.prompt = () => { window.__installPrompted = true; };
    event.userChoice = Promise.resolve({outcome:'dismissed'});
    window.dispatchEvent(event);
  });
  await page.locator('#installBtn').click();
  check(await page.evaluate(() => window.__installPrompted && document.getElementById('installBtn').hidden) &&
    !await page.locator('#installBtn').isVisible(), 'available install prompt works and then hides its control');

  const expectFits = async label => {
    // Wait for the ResizeObserver / font / account mutation layout pass.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const fits = await page.evaluate(() => {
      const nav = document.getElementById('siteNav');
      const cta = nav.querySelector('.nav-cta').getBoundingClientRect();
      const brand = nav.querySelector('.brand').getBoundingClientRect();
      const links = [...nav.querySelectorAll('.nav-links a')].filter(a => a.offsetParent);
      return nav.scrollWidth <= innerWidth + 1 && cta.right <= innerWidth && brand.right < cta.left &&
        (!links.length || (links[0].getBoundingClientRect().left >= brand.right + 3 &&
          links.at(-1).getBoundingClientRect().right <= cta.left - 3));
    });
    check(fits, label);
  };

  for(const width of [320,390,768,900,901,1024,1100,1101,1180,1280,1366,1600]) {
    await page.setViewportSize({width,height:900});
    await expectFits(`navigation fits at ${width}px with fallback fonts`);
  }
  await page.setViewportSize({width:1280,height:900});
  await page.evaluate(() => {
    updateAccountNav({email:'a.very.long.learner.account@example.company.test'});
    document.getElementById('installBtn').hidden = false;
    document.getElementById('streakBadge').hidden = false;
    document.getElementById('streakN').textContent = '365';
  });
  await expectFits('late account, install control, and streak do not overlap navigation');
  await page.evaluate(() => document.documentElement.style.fontSize = '20px');
  await expectFits('larger text falls back to an accessible menu');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '';
    document.getElementById('installBtn').hidden = true;
    document.getElementById('streakBadge').hidden = true;
  });

  await page.setViewportSize({width:844,height:320});
  await page.locator('#hamb').click();
  check(await page.evaluate(() => document.activeElement === document.querySelector('#navLinks a')),
    'opening primary menu moves keyboard focus inside');
  await page.locator('#accountNavLink').focus();
  check(await page.evaluate(() => {
    const menu = document.getElementById('navLinks');
    const rect = menu.getBoundingClientRect();
    const account = document.getElementById('accountNavLink').getBoundingClientRect();
    return rect.bottom <= innerHeight + 1 && menu.scrollHeight > menu.clientHeight &&
      account.top >= rect.top && account.bottom <= rect.bottom + 1;
  }), 'short-screen menu scrolls to its last control within the viewport');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => document.activeElement === document.getElementById('hamb') &&
    document.getElementById('navLinks').inert && document.getElementById('hamb').getAttribute('aria-expanded') === 'false'),
    'Escape closes primary menu and restores focus');
  await page.locator('#hamb').click();
  await page.locator('#searchBtn').focus();
  check(await page.evaluate(() => !document.getElementById('navLinks').classList.contains('open')),
    'primary menu closes when keyboard focus leaves');
  await page.locator('#hamb').click();
  await page.setViewportSize({width:844,height:900});
  await page.mouse.click(842, 898);
  check(await page.evaluate(() => document.getElementById('navLinks').inert), 'outside click closes primary menu');
  await page.evaluate(() => updateAccountNav(null));
  await page.locator('#hamb').focus();
  await page.setViewportSize({width:1600,height:900});
  await page.waitForFunction(() => !document.getElementById('siteNav').classList.contains('nav-collapsed'));
  check(await page.evaluate(() => !document.getElementById('navLinks').inert &&
    document.activeElement === document.querySelector('#navLinks a')), 'desktop resize restores visible navigation and focus');

  await page.setViewportSize({width:390,height:844});
  await page.goto(BASE + '/lesson/11-web-security/xss.html');
  await page.locator('#content h1').waitFor();
  check(!await page.locator('#reportMistakeForm').isVisible(), 'lesson feedback form begins hidden');
  await page.locator('#reportMistakeBtn').click();
  check(await page.locator('#reportMistakeForm').isVisible(), 'lesson feedback form opens on request');
  await page.locator('#reportMistakeCancel').click();
  check(!await page.locator('#reportMistakeForm').isVisible(), 'cancel hides the lesson feedback form again');
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  check(await page.evaluate(() => {
    const sidebar = document.getElementById('sidebar');
    sidebar.querySelector('button').focus();
    return sidebar.inert && !sidebar.contains(document.activeElement);
  }), 'offscreen lesson links cannot receive focus');
  await page.locator('#menuBtn').click();
  check(await page.evaluate(() => !document.getElementById('sidebar').inert &&
    document.activeElement === document.getElementById('closeLessonMenuBtn') &&
    document.getElementById('menuBtn').getAttribute('aria-expanded') === 'true'), 'lesson menu opens with a focused close control');
  const pathToggle = page.locator('.sb-path.active .sb-path-head');
  await pathToggle.click();
  check(await pathToggle.getAttribute('aria-expanded') === 'false', 'collapsed lesson group reports its state');
  await pathToggle.click();
  check(await pathToggle.getAttribute('aria-expanded') === 'true', 'expanded lesson group reports its state');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => document.getElementById('sidebar').inert &&
    document.activeElement === document.getElementById('menuBtn')), 'Escape closes lesson menu and restores focus');
  await page.locator('#menuBtn').click();
  await page.locator('#closeLessonMenuBtn').click();
  check(await page.evaluate(() => document.getElementById('sidebar').inert &&
    document.activeElement === document.getElementById('menuBtn')), 'lesson close button restores focus');
  await page.locator('#menuBtn').click();
  await page.mouse.click(385, 800);
  check(await page.evaluate(() => document.getElementById('sidebar').inert), 'outside click closes lesson menu');
  await page.locator('#menuBtn').click();
  await page.setViewportSize({width:1280,height:900});
  await page.waitForFunction(() => !document.getElementById('sidebar').inert);
  check(await page.evaluate(() => document.activeElement === document.querySelector('.sb-path.active .sb-path-head') &&
    !document.getElementById('sidebar').classList.contains('open')), 'desktop lesson resize keeps focus on a visible control');
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(() => document.getElementById('sidebar').inert);
  check(await page.evaluate(() => document.activeElement === document.getElementById('menuBtn')), 'mobile lesson resize moves focus out of the hidden sidebar');
  assert.deepEqual(errors, [], 'navigation has no JavaScript errors');
  await context.close();
  console.log(`Navigation quality: ${checks} checks passed.`);
} finally { await browser.close(); }
