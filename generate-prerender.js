#!/usr/bin/env node
/*
 * Prerenders static HTML for every lesson, path, tool and lab so search
 * engines can index them and readers can use the same canonical URL.
 *
 * Each generated file at lesson/<pathId>/<subId>.html contains:
 *   - a lesson-specific <title>, <meta description>, canonical link, and
 *     og:/twitter: tags, all filled in from the lesson content
 *   - the lesson's markdown, pre-rendered to HTML with `marked` so bots
 *     see the actual content, not an empty shell
 *   - schema.org JSON-LD (LearningResource + BreadcrumbList)
 *   - the shared app shell and scripts, which hydrate the same URL for
 *     interactive reading without redirecting the visitor
 *
 * CANONICAL RULE — the one thing to not get wrong here: the canonical URL
 * must be the .html file itself, never a legacy hash route. The app router
 * reads the pathname directly, while old hash links are upgraded to that
 * same URL for compatibility.
 *
 * Also regenerates sitemap.xml with <lastmod> taken from git history.
 *
 * Run after any lesson content change:
 *   node generate-prerender.js
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { TOOL_CONTENT, LAB_CONTENT } from './prerender-content.js';
import sanitizeHtml from 'sanitize-html';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kashsec.vercel.app';
const indexShell = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const shellHeader = indexShell.match(/<header\b[\s\S]*?<\/header>/)?.[0];
const shellFooter = indexShell.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
const shellScripts = indexShell.match(/<script src="quizzes\.js"[\s\S]*?(?=<\/body>)/)?.[0];
if (!shellHeader || !shellFooter || !shellScripts) throw new Error('index.html app shell could not be read');

const CONTENT_SANITIZER = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'figure', 'figcaption', 'img', 'div', 'span', 'section', 'article', 'details', 'summary'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'id', 'role', 'aria-label'],
    a: ['href', 'title', 'target', 'rel', 'name'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

/* AdSense site-verification tag, read from ads.js so the publisher ID has one
   home rather than being copied into 592 files by hand. Emitted on every
   prerendered page because these are real URLs Google can land on — verifying
   ownership from the homepage alone leaves the rest of the site unaccounted
   for. Empty clientId (ads disabled) emits nothing at all. */
const adsClientId =
  (fs.readFileSync(path.join(ROOT, 'ads.js'), 'utf8').match(/clientId:\s*'([^']*)'/) || [])[1] || '';
const adsenseMeta = adsClientId
  ? `\n<meta name="google-adsense-account" content="${adsClientId}">` : '';

function extractArray(name) {
  const match = appJs.match(new RegExp('const ' + name + ' = \\[[\\s\\S]*?\\n\\];'));
  if (!match) throw new Error('Could not find ' + name + ' array in app.js');
  return new Function(match[0] + '; return ' + name + ';')();
}
const PATHS = extractArray('PATHS');
// Tools and labs also get crawlable pages with interactive app shells.
const TOOLS = extractArray('TOOLS');
const LABS  = extractArray('LABS');
// The FAQ is the site's best shot at a rich result, but it only existed as
// an SPA route with no crawlable URL, so it could never earn one.
const FAQS  = extractArray('FAQS');

/* Practice tasks, for the crawlable practice page. Read from the generated
   tasks.js (questions only — answers there are hashes, and explanations are
   encrypted, so nothing sensitive can reach a static page by accident). */
let TASKS_META = { total: 0, tasks: [] };
try {
  const tasksJs = fs.readFileSync(path.join(ROOT, 'tasks.js'), 'utf8');
  const T = new Function(tasksJs + '; return TASKS;')();
  TASKS_META = { total: T.length, tasks: T.map(t => ({ path: t.path, q: t.q })) };
} catch {
  console.warn('tasks.js not found — practice page will be generated empty. Run generate-tasks.js first.');
}

// `marked` is a devDependency (npm install marked) — only needed at build
// time to prerender lesson HTML. The browser uses its own vendored copy
// (vendor/marked.min.js); this is a separate build-time instance.
let marked;
try {
  marked = (await import('marked')).marked;
} catch {}
if (!marked) {
  console.warn('marked not installed (run `npm install`) — falling back to a minimal renderer.');
  marked = { parse: (md) => md.split('\n\n').map(p => p.startsWith('#') ? `<h2>${p.replace(/^#+\s*/,'')}</h2>` : `<p>${p.replace(/\n/g,' ')}</p>`).join('\n') };
}

function escapeAttr(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ---- last-modified dates, straight from git ----
   A sitemap without <lastmod> gives crawlers no reason to revisit, so
   edits to existing lessons can sit unnoticed for weeks. One `git log`
   pass builds the whole map; git lists newest-first, so the first date we
   see for a file is its most recent change. Falls back to build date when
   there's no git history (fresh checkout, tarball, some CI setups). */
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const gitDates = new Map();
const dirtyPaths = new Set();
try {
  const log = execFileSync('git',
    ['log', '--pretty=format:@%cI', '--name-only', '--diff-filter=AMR'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let current = null;
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) { current = line.slice(1, 11); continue; }
    if (line && current && !gitDates.has(line)) gitDates.set(line, current);
  }
  // A build before committing changed source files should stamp the same
  // date the next CI build sees after that commit. Otherwise CI always finds
  // hundreds of changed dateModified/lastmod fields after each content edit.
  for (const args of [['diff', '--name-only'], ['ls-files', '--others', '--exclude-standard']]) {
    const changed = execFileSync('git', args, {cwd:ROOT, encoding:'utf8'});
    changed.split('\n').filter(Boolean).forEach(file => dirtyPaths.add(file.trim()));
  }
} catch {
  console.warn('git history unavailable — using build date for lastmod.');
}
const lastmodFor = (...files) => {
  // BUILD_DATE is UTC, while git commit dates retain the committer's local
  // calendar date. A dirty file must never make its published date go back.
  const dates = files.map(f => {
    const committed = gitDates.get(f);
    return dirtyPaths.has(f) && (!committed || BUILD_DATE > committed) ? BUILD_DATE : committed;
  }).filter(Boolean);
  return dates.length ? dates.sort().pop() : BUILD_DATE;
};
// The tool/lab/FAQ stubs are generated from data living in app.js, so
// app.js's own last commit is the honest "last modified" for them.
const APP_LASTMOD = lastmodFor('app.js');

// Cut text to at most `max` characters on a word boundary, adding an
// ellipsis when anything was dropped. Search engines show roughly the first
// 155-160 characters of a meta description; a hard slice used to end
// snippets mid-word ("...gives you the mental ").
function clampText(text, max){
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.—-]+$/, '') + '…';
}
const metaDesc = desc => clampText(desc, 158);

// Lesson description: the first prose paragraph, with Markdown links,
// inline HTML and emphasis markers reduced to plain text.
function firstPara(md){
  const noFront = md.replace(/^---[\s\S]*?---\n/,'');
  const paras = noFront.split(/\n\n+/).map(p=>p.trim()).filter(Boolean);
  for(const p of paras){
    if(p.startsWith('#') || p.startsWith(':::') || p.startsWith('~~~') || p.startsWith('```') || p.startsWith('???') || p.startsWith('<') || p.startsWith('|') || p.startsWith('!')) continue;
    const plain = p
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[*_`]/g, '');
    if (plain.trim()) return clampText(plain, 300);
  }
  return '';
}

// ISO 8601 duration from word count. 200wpm is the usual reading-speed
// figure for technical prose; rounded to 5 minutes so it reads as the
// estimate it is rather than false precision.
function readingTime(text){
  const words = (text.match(/\S+/g) || []).length;
  return 'PT' + Math.max(5, Math.round(words / 200 / 5) * 5) + 'M';
}

/* ---- breadcrumbs ----
   One array drives both the visible trail and the BreadcrumbList JSON-LD,
   so the two can't drift. The previous version hand-wrote the HTML and
   pointed every crumb at "/", which told Google nothing about hierarchy
   and gave readers two identical links. */
const crumbHtml = crumbs => crumbs
  .map((c, i) => i === crumbs.length - 1
    ? escapeAttr(c.name)
    : `<a href="${escapeAttr(c.url)}">${escapeAttr(c.name)}</a>`)
  .join(' · ');

const breadcrumbLd = crumbs => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: c.url,
  })),
});

const ORG = {
  '@type': 'EducationalOrganization',
  name: 'KashSec Academy',
  url: SITE + '/',
  logo: SITE + '/icons/icon-512.png',
  description: 'Free cybersecurity education for complete beginners.',
};

// Per-path social card from generate-og-image.js, when one has been built;
// otherwise the site-wide card. Checked on disk so a fresh clone that never
// ran build:og still emits valid tags.
const pathOgImage = id => fs.existsSync(path.join(ROOT, 'og', id + '.jpg')) ? `${SITE}/og/${id}.jpg` : null;

const template = ({title, desc, canonical, spaPath, contentHtml, crumbs, jsonLd = [], ogType = 'article', ogImage = null, ogAlt = null}) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<title>${escapeAttr(title)}</title>
<meta name="description" content="${escapeAttr(metaDesc(desc))}">
<link rel="canonical" href="${escapeAttr(canonical)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(metaDesc(desc))}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${escapeAttr(canonical)}">
<meta property="og:site_name" content="KashSec Academy">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${escapeAttr(ogImage || SITE + '/og-image.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeAttr(ogAlt || 'KashSec Academy — free cybersecurity course from absolute zero')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(title)}">
<meta name="twitter:description" content="${escapeAttr(metaDesc(desc))}">
<meta name="twitter:image" content="${escapeAttr(ogImage || SITE + '/og-image.png')}">
<meta name="twitter:image:alt" content="${escapeAttr(ogAlt || 'KashSec Academy — free cybersecurity course from absolute zero')}">
<meta name="theme-color" content="#0A0E13">${adsenseMeta}
<link rel="manifest" href="/manifest.json">
<link rel="alternate" type="application/rss+xml" title="KashSec Academy — What's new" href="/feed.xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script src="/ads.js" defer></script>
${[breadcrumbLd(crumbs), ...jsonLd]
  .map(o => `<script type="application/ld+json">\n${JSON.stringify(o).replace(/</g, '\\u003c')}\n</script>`).join('\n')}
</head>
<body>
<a class="skip" href="${escapeAttr(new URL(canonical).pathname)}#app">Skip to content</a>
${shellHeader}
<main id="app" tabindex="-1">
  <div class="reader-wrap"><div class="reader-main">
    <nav class="reader-crumb" aria-label="Breadcrumb">${crumbHtml(crumbs)}</nav>
    <div class="md" id="content"><article>${sanitizeHtml(contentHtml, CONTENT_SANITIZER)}</article></div>
  </div></div>
</main>
${shellFooter}
${shellScripts}
</body>
</html>
`;

/* Every sitemap entry carries a real <lastmod>. */
const sitemapUrls = [{ loc: SITE + '/', lastmod: lastmodFor('index.html', 'app.js'), priority: '1.0' }];

let written = 0;
const lessonUpdated = {};
for (const p of PATHS) {
  const flat = p.subs;
  for (let i = 0; i < flat.length; i++) {
    const s = flat[i];
    const rel = `course/${p.id}/${s.id}.md`;
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) continue;
    // Git checkouts may use CRLF on Windows and LF in CI. Normalize before
    // Markdown parsing so committed HTML is byte-identical on both.
    const md = fs.readFileSync(src, 'utf8').replace(/\r\n?/g, '\n');
    const canonical = `${SITE}/lesson/${p.id}/${s.id}.html`;
    const spaPath = `/#/lesson/${p.id}/${s.id}`;
    const title = `${s.title} — Path ${p.n} · KashSec Academy`;
    const desc = firstPara(md) || `${s.title}: ${s.desc || ''}`;
    const lastmod = lastmodFor(rel);
    lessonUpdated[`${p.id}/${s.id}`] = lastmod;
    // Strip our custom :::callouts / ???refs / ~~~svg so marked doesn't
    // mangle them; they're stylistic only, prerender content is for bots.
    let clean = md
      .replace(/^:::\w+(?:\s+.+?)?\n([\s\S]*?)\n:::$/gm, (_, body) => body)
      .replace(/^\?{3}\s*refs\s*\n([\s\S]*?)\n\?{3}$/gm, (_, body) => '\n### References\n' + body)
      .replace(/^~{3}svg(?:\s+(.+?))?\n[\s\S]*?\n~{3}$/gm, (_, cap) => cap ? `\n*[${cap}]*\n` : '')
      .replace(/^```mermaid\n[\s\S]*?\n```$/gm, '');

    // Prev/next links matter for more than convenience: without them the
    // only inbound link to a lesson stub is its path index, so crawl depth
    // and internal link equity both suffer across 500 pages.
    const prev = flat[i - 1], next = flat[i + 1];
    const pager = (prev || next) ? `<nav class="pager">` +
      (prev ? `<a href="/lesson/${p.id}/${prev.id}.html">← ${escapeAttr(prev.title)}</a>` : '<span></span>') +
      (next ? `<a href="/lesson/${p.id}/${next.id}.html">${escapeAttr(next.title)} →</a>` : '<span></span>') +
      `</nav>` : '';

    const contentHtml = marked.parse(clean) + pager;
    const crumbs = [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: 'Learning paths', url: SITE + '/lesson/' },
      { name: `Path ${p.n} — ${p.title}`, url: `${SITE}/lesson/${p.id}/` },
      { name: s.title, url: canonical },
    ];
    const lessonLd = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: s.title,
      headline: s.title,
      description: desc,
      url: canonical,
      inLanguage: 'en',
      dateModified: lastmod,
      learningResourceType: 'Lesson',
      image: pathOgImage(p.id) || `${SITE}/og-image.png`,
      educationalLevel: p.level || 'Beginner',
      timeRequired: readingTime(clean),
      isAccessibleForFree: true,
      isFamilyFriendly: true,
      teaches: s.desc || s.title,
      isPartOf: {
        '@type': 'Course',
        name: `Path ${p.n}: ${p.title}`,
        url: `${SITE}/lesson/${p.id}/`,
      },
      provider: ORG,
      publisher: ORG,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    };
    const outDir = path.join(ROOT, 'lesson', p.id);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, s.id + '.html'),
      template({ title, desc, canonical, spaPath, contentHtml, crumbs, jsonLd: [lessonLd],
        ogImage: pathOgImage(p.id), ogAlt: `KashSec Academy · Path ${p.n}: ${p.title}` }));
    sitemapUrls.push({ loc: canonical, lastmod, priority: '0.8' });
    written++;
  }
}

/* Path-overview stubs. These carry Course schema — the only page type here
   eligible for Google's course rich results, which is why each one gets a
   real syllabus rather than a bare link list. */
for (const p of PATHS) {
  const canonical = `${SITE}/lesson/${p.id}/`;
  const spaPath = `/#/lesson/${p.id}`;
  const title = `Path ${p.n}: ${p.title} — KashSec Academy`;
  const desc = p.desc || '';
  const lessonFiles = p.subs.map(s => `course/${p.id}/${s.id}.md`);
  const lastmod = lastmodFor(...lessonFiles);
  const contentHtml = `<h1>${escapeAttr(title)}</h1><p>${escapeAttr(desc)}</p>` +
    `<p><strong>Level:</strong> ${escapeAttr(p.level || 'Beginner')} · <strong>${p.subs.length} lessons</strong> · Free, no account needed.</p>` +
    `<h2>Lessons in this path</h2><ol>` +
    p.subs.map(s => `<li><a href="/lesson/${p.id}/${s.id}.html">${escapeAttr(s.title)}</a> — ${escapeAttr(s.desc || '')}</li>`).join('') +
    `</ol>`;
  const crumbs = [
    { name: 'KashSec Academy', url: SITE + '/' },
    { name: 'Learning paths', url: SITE + '/lesson/' },
    { name: `Path ${p.n} — ${p.title}`, url: canonical },
  ];
  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `Path ${p.n}: ${p.title}`,
    description: desc,
    url: canonical,
    image: pathOgImage(p.id) || `${SITE}/og-image.png`,
    inLanguage: 'en',
    dateModified: lastmod,
    educationalLevel: p.level || 'Beginner',
    isAccessibleForFree: true,
    provider: ORG,
    // Google's course rich result requires an offer stating the price,
    // even when — especially when — that price is zero.
    offers: { '@type': 'Offer', category: 'Free', price: '0', priceCurrency: 'USD' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT' + Math.max(1, Math.round(p.subs.length * 0.5)) + 'H',
    },
    syllabusSections: p.subs.map((s, i) => ({
      '@type': 'Syllabus', name: s.title, description: s.desc || '',
      url: `${SITE}/lesson/${p.id}/${s.id}.html`, position: i + 1,
    })),
    hasPart: p.subs.map(s => ({
      '@type': 'LearningResource', name: s.title,
      url: `${SITE}/lesson/${p.id}/${s.id}.html`,
    })),
  };
  const outDir = path.join(ROOT, 'lesson', p.id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'),
    template({ title, desc, canonical, spaPath, contentHtml, crumbs, jsonLd: [courseLd],
      ogImage: pathOgImage(p.id), ogAlt: `KashSec Academy · Path ${p.n}: ${p.title}` }));
  sitemapUrls.push({ loc: canonical, lastmod, priority: '0.9' });
}

/* A single hub linking every path. Without it the 26 path stubs are
   reachable only from the sitemap, which is a weak signal on its own. */
{
  const canonical = `${SITE}/lesson/`;
  const title = 'All learning paths — Free cybersecurity course · KashSec Academy';
  const totalLessons = PATHS.reduce((n, p) => n + p.subs.length, 0);
  const desc = `Every path in the free KashSec cybersecurity course — ${PATHS.length} paths and ${totalLessons} lessons, from complete beginner to advanced offensive and defensive security.`;
  const contentHtml = `<h1>All learning paths</h1><p>${escapeAttr(desc)}</p>` +
    PATHS.map(p => `<h2><a href="/lesson/${p.id}/">Path ${p.n}: ${escapeAttr(p.title)}</a></h2>` +
      `<p>${escapeAttr(p.desc || '')} <em>(${escapeAttr(p.level || 'Beginner')} · ${p.subs.length} lessons)</em></p><ul>` +
      p.subs.map(s => `<li><a href="/lesson/${p.id}/${s.id}.html">${escapeAttr(s.title)}</a></li>`).join('') +
      '</ul>').join('');
  const crumbs = [
    { name: 'KashSec Academy', url: SITE + '/' },
    { name: 'Learning paths', url: canonical },
  ];
  const lastmod = lastmodFor('app.js');
  fs.mkdirSync(path.join(ROOT, 'lesson'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'lesson', 'index.html'), template({
    title, desc, canonical, spaPath: '/#/course', contentHtml, crumbs, ogType: 'website',
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: 'KashSec Academy learning paths', numberOfItems: PATHS.length,
      itemListElement: PATHS.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: `Path ${p.n}: ${p.title}`,
        url: `${SITE}/lesson/${p.id}/`,
      })),
    }],
  }));
  sitemapUrls.push({ loc: canonical, lastmod, priority: '0.9' });
}

/* Crawlable stubs for each tool and lab.

   These are interactive client-side pages, so there's no lesson body to
   prerender. That used to mean the stub was ~53 words of unique prose
   followed by a list naming all 31 other tools — a list that was ~90% of
   the page and byte-identical across every page in the section. Thin,
   near-duplicate content at that ratio doesn't rank regardless of how the
   title is worded, so the long-form entries in prerender-content.js now
   carry each page and the link list is cut to a curated few. */

// `related` ids may cross sections: 'jwt-lab' is labs/jwt, 'regex-tool' is
// tools/regex, and a bare id stays in the current section.
function resolveRelated(id, dirName) {
  if (id.endsWith('-lab')) return { dir: 'labs', id: id.slice(0, -4) };
  if (id.endsWith('-tool')) return { dir: 'tools', id: id.slice(0, -5) };
  return { dir: dirName, id };
}

function writeStubSet(items, urlPrefix, dirName, kindLabel, indexTitle, indexDesc, content, titleFor) {
  const outDir = path.join(ROOT, dirName);
  const sectionUrl = `${SITE}/${dirName}/`;
  const plural = kindLabel[0].toUpperCase() + kindLabel.slice(1) + 's';
  fs.mkdirSync(outDir, { recursive: true });
  for (const it of items) {
    const canonical = `${SITE}/${dirName}/${it.id}.html`;
    const spaPath = `/#/${urlPrefix}/${it.id}`;
    const c = content[it.id];
    if (!c) throw new Error(`No prerender content for ${dirName}/${it.id} — add it to prerender-content.js`);
    const title = titleFor(it, c);
    // The meta description leads with what the page explains rather than
    // what the widget is, because that's the query it can actually win.
    const desc = `${it.desc} ${c.intro.split('. ')[0]}.`.replace(/\s+/g, ' ').slice(0, 300);

    const body =
      `<h1>${escapeAttr(it.title)}</h1>` +
      `<p><strong>${escapeAttr(it.desc)}</strong></p>` +
      `<p>${escapeAttr(c.intro)}</p>` +
      `<h2>How to use it</h2><ol>` +
      c.steps.map(s => `<li>${escapeAttr(s)}</li>`).join('') + `</ol>` +
      `<h2>What to take away</h2>` +
      c.notes.map(n => `<h3>${escapeAttr(n.h)}</h3><p>${escapeAttr(n.p)}</p>`).join('') +
      `<h2>Frequently asked questions</h2>` +
      c.faq.map(f => `<h3>${escapeAttr(f.q)}</h3><p>${escapeAttr(f.a)}</p>`).join('') +
      (it.related ? `<h2>Where this fits in the course</h2><p>This ${kindLabel} pairs with <strong>${escapeAttr(it.related)}</strong> — see <a href="/lesson/">all ${PATHS.length} learning paths</a>.</p>` : '') +
      `<p>It runs entirely in your browser: nothing is uploaded, no account is needed, and it is free.</p>` +
      `<h2>Related</h2><ul>` +
      (c.related || []).map(rid => {
        const r = resolveRelated(rid, dirName);
        const src = r.dir === 'labs' ? LABS : TOOLS;
        const target = src.find(o => o.id === r.id);
        if (!target) throw new Error(`${dirName}/${it.id} lists related "${rid}" which does not exist`);
        return `<li><a href="/${r.dir}/${r.id}.html">${escapeAttr(target.title)}</a> — ${escapeAttr(target.desc || '')}</li>`;
      }).join('') +
      `</ul><p><a href="/${dirName}/">Browse all ${items.length} ${kindLabel}s →</a></p>`;

    fs.writeFileSync(path.join(outDir, it.id + '.html'), template({
      title, desc, canonical, spaPath, contentHtml: body,
      crumbs: [
        { name: 'KashSec Academy', url: SITE + '/' },
        { name: plural, url: sectionUrl },
        { name: it.title, url: canonical },
      ],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: it.title,
          description: it.desc,
          url: canonical,
          applicationCategory: 'SecurityApplication',
          applicationSubCategory: kindLabel,
          operatingSystem: 'Any (runs in a web browser)',
          browserRequirements: 'Requires JavaScript',
          inLanguage: 'en',
          dateModified: APP_LASTMOD,
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: ORG,
        },
        // The FAQ blocks are the realistic rich-result opportunity here.
        // Head terms like "jwt decoder" belong to jwt.io and Auth0; the
        // questions underneath them are still winnable.
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: c.faq.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    }));
    sitemapUrls.push({ loc: canonical, lastmod: APP_LASTMOD, priority: '0.7' });
  }
  // Index stub for the section itself.
  const contentHtml = `<h1>${escapeAttr(indexTitle)}</h1><p>${escapeAttr(indexDesc)}</p><ul>` +
    items.map(o => `<li><a href="/${dirName}/${o.id}.html">${escapeAttr(o.title)}</a> — ${escapeAttr(o.desc || '')}</li>`).join('') + '</ul>';
  fs.writeFileSync(path.join(outDir, 'index.html'), template({
    title: indexTitle + ' · KashSec Academy', desc: indexDesc,
    canonical: sectionUrl, spaPath: `/#/${dirName}`, contentHtml, ogType: 'website',
    crumbs: [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: indexTitle, url: sectionUrl },
    ],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: indexTitle, numberOfItems: items.length,
      itemListElement: items.map((o, i) => ({
        '@type': 'ListItem', position: i + 1, name: o.title,
        url: `${SITE}/${dirName}/${o.id}.html`,
      })),
    }],
  }));
  sitemapUrls.push({ loc: sectionUrl, lastmod: APP_LASTMOD, priority: '0.8' });
  return items.length;
}

const toolsWritten = writeStubSet(
  TOOLS, 'tools', 'tools', 'security tool',
  'Free online security tools',
  'Encoders, hash tools, a JWT decoder, CVSS and subnet calculators, and more — all free, all running locally in your browser.',
  TOOL_CONTENT,
  (it) => `${it.title} — free, runs in your browser · KashSec Academy`);
const labsWritten = writeStubSet(
  LABS, 'labs', 'labs', 'security lab',
  'Free interactive security labs',
  'Practise SQL injection, XSS, IDOR, JWT forgery, SSRF, XXE, path traversal, log analysis and more — safe, simulated, and entirely in your browser.',
  LAB_CONTENT,
  // Labs compete for learner intent ("practise X safely"), which is a
  // query a hands-on simulation genuinely answers better than an article.
  (it) => `${it.title} — free hands-on practice, no setup · KashSec Academy`);

/* FAQ stub with FAQPage schema. The answers were already written and
   already public — they just had no URL a crawler could reach. */
{
  const canonical = `${SITE}/faq.html`;
  const title = 'Cybersecurity course FAQ — Is it free? Do I need experience? · KashSec Academy';
  const desc = 'Answers to the questions beginners ask before starting: whether the course is really free, whether you need experience or a powerful computer, whether any of it is illegal, and how long it takes.';
  const contentHtml = `<h1>Frequently asked questions</h1>` +
    FAQS.map(f => `<h2>${escapeAttr(f.q)}</h2><p>${escapeAttr(f.a)}</p>`).join('') +
    `<h2>Ready to start?</h2><p><a href="/lesson/">Browse all ${PATHS.length} learning paths</a> or jump straight into <a href="/lesson/00-fresher-basics/">Path 00 — Computer Basics</a>.</p>`;
  fs.writeFileSync(path.join(ROOT, 'faq.html'), template({
    title, desc, canonical, spaPath: '/#/faq', contentHtml, ogType: 'website',
    crumbs: [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: 'FAQ', url: canonical },
    ],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }],
  }));
  sitemapUrls.push({ loc: canonical, lastmod: APP_LASTMOD, priority: '0.7' });
}

/* Crawlable stubs for the practice-task and mock-exam sections.

   These shipped as SPA-only routes while every other section of the site
   had a static page, a sitemap entry and schema — so the two features most
   likely to attract search traffic were the two Google could not see.

   NOT included here, deliberately: #/search. Google's own guidance is to
   keep internal search result pages out of the index, and a results page
   has no content of its own to offer. It stays reachable and linkable for
   people; it just does not belong in a sitemap. */
{
  const canonical = `${SITE}/practice.html`;
  const total = TASKS_META.total;
  const title = `${total} free cybersecurity practice questions with answers · KashSec Academy`;
  const desc = `Type the answer, don't pick it. ${total} hands-on practice tasks across ${PATHS.length} paths — subnetting, Linux commands, CVSS scoring, log reading, web and cloud security. Free, no account, answers checked in your browser.`;

  // The questions are safe to publish: answers ship only as hashes, and
  // each explanation is encrypted under a key derived from its own answer.
  // So this page is genuinely useful crawlable content, not a doorway.
  const byPath = {};
  TASKS_META.tasks.forEach(t => { (byPath[t.path] = byPath[t.path] || []).push(t); });

  const contentHtml =
    `<h1>Practice tasks</h1>` +
    `<p><strong>${desc}</strong></p>` +
    `<p>Every task asks you to produce an answer rather than recognise one among four options — compute a subnet, write the command, read the output and name the flaw. Answers are verified in your browser against a stored hash, so nothing you type is sent anywhere and the answers are not readable in the page.</p>` +
    PATHS.filter(p => byPath[p.id]).map(p =>
      `<h2>Path ${p.n} — ${escapeAttr(p.title)}</h2><ul>` +
      byPath[p.id].map(t => `<li>${escapeAttr(t.q.split('\n')[0])}</li>`).join('') +
      `</ul><p><a href="/lesson/${p.id}/">Study Path ${p.n} first →</a></p>`
    ).join('') +
    `<h2>Related</h2><ul>` +
    `<li><a href="/exam.html">Timed mock exam</a> — sit a full paper under a clock</li>` +
    `<li><a href="/lesson/">All ${PATHS.length} learning paths</a></li>` +
    `<li><a href="/labs/">Interactive labs</a></li></ul>`;

  fs.writeFileSync(path.join(ROOT, 'practice.html'), template({
    title, desc, canonical, spaPath: '/#/tasks', contentHtml, ogType: 'website',
    crumbs: [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: 'Practice tasks', url: canonical },
    ],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Cybersecurity practice tasks',
      description: desc,
      url: canonical,
      learningResourceType: 'Practice problem set',
      educationalUse: 'practice',
      inLanguage: 'en',
      dateModified: APP_LASTMOD,
      isAccessibleForFree: true,
      provider: ORG,
      publisher: ORG,
    }],
  }));
  sitemapUrls.push({ loc: canonical, lastmod: APP_LASTMOD, priority: '0.8' });
}

{
  const canonical = `${SITE}/exam.html`;
  const title = 'Free timed cybersecurity practice exam — 90 questions, 90 minutes · KashSec Academy';
  const desc = `A timed mock exam drawn across all ${PATHS.length} paths, weighted by path size. Nothing is graded until you submit, the clock runs, and the score report breaks results down by path. Free, no account.`;
  const contentHtml =
    `<h1>Timed mock exam</h1>` +
    `<p><strong>${desc}</strong></p>` +
    `<h2>Why a timed paper is different from a quiz</h2>` +
    `<p>The path quizzes reveal the answer the moment you pick one, which is right for learning. Sitting a certification is a different skill: committing to an answer under a clock, with no feedback, while rationing time across questions you have not seen yet. This is the second mode.</p>` +
    `<h2>Three papers</h2><ul>` +
    `<li><strong>Full exam</strong> — 90 questions in 90 minutes, the shape of a real certification sitting.</li>` +
    `<li><strong>Short exam</strong> — 40 questions in 40 minutes.</li>` +
    `<li><strong>Quick drill</strong> — 20 questions in 15 minutes, deliberately tight on time.</li></ul>` +
    `<h2>What you get afterwards</h2>` +
    `<p>A pass mark measured against the paper, a per-path breakdown ranked weakest first, every question you missed with its explanation, and those questions added to a spaced-repetition queue so they come back later.</p>` +
    `<h2>Related</h2><ul>` +
    `<li><a href="/practice.html">Practice tasks</a> — typed answers, no time limit</li>` +
    `<li><a href="/lesson/">All ${PATHS.length} learning paths</a></li></ul>`;

  fs.writeFileSync(path.join(ROOT, 'exam.html'), template({
    title, desc, canonical, spaPath: '/#/exam', contentHtml, ogType: 'website',
    crumbs: [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: 'Timed mock exam', url: canonical },
    ],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Timed cybersecurity mock exam',
      description: desc,
      url: canonical,
      learningResourceType: 'Assessment',
      educationalUse: 'assessment',
      inLanguage: 'en',
      dateModified: APP_LASTMOD,
      isAccessibleForFree: true,
      provider: ORG,
      publisher: ORG,
    }],
  }));
  sitemapUrls.push({ loc: canonical, lastmod: APP_LASTMOD, priority: '0.8' });
}

/* About / Contact / Privacy / Terms.
 *
 * Generated from the LEGAL object in app.js rather than written out again
 * here, because two copies of a privacy policy is one copy too many: the
 * crawlable version is the one an ad network and a regulator will read, and
 * it drifting from what the site actually tells its own users is the whole
 * failure mode. One source, both renderings.
 *
 * These carry real schema types — AboutPage and ContactPage are the ones
 * Google understands as "this site is run by someone reachable", which is
 * the exact signal a bare course site lacks. */
{
  const LEGAL = new Function(
    appJs.match(/const LEGAL = \{[\s\S]*?\n\};/)[0] + '; return LEGAL;')();

  const LEGAL_META = {
    about:   { file: 'about.html',   type: 'AboutPage',   priority: '0.6' },
    contact: { file: 'contact.html', type: 'ContactPage', priority: '0.6' },
    privacy: { file: 'privacy.html', type: 'WebPage',     priority: '0.5' },
    terms:   { file: 'terms.html',   type: 'WebPage',     priority: '0.5' },
  };

  for (const [kind, meta] of Object.entries(LEGAL_META)) {
    const page = LEGAL[kind];
    if (!page) throw new Error(`LEGAL is missing "${kind}" — prerender and app.js disagree`);
    const canonical = `${SITE}/${meta.file}`;
    const title = `${page.title} · KashSec Academy`;
    const desc = page.lead;
    const contentHtml =
      /* escapeAttr, not a text-node escaper — there isn't one, and the
         escaping is identical for the characters that matter here. Section
         bodies are NOT escaped: they carry authored links, exactly as in
         the app renderer. Safe only because LEGAL is a constant. */
      `<h1>${escapeAttr(page.title)}</h1>` +
      `<p><strong>${escapeAttr(page.lead)}</strong></p>` +
      page.sections.map(s =>
        `<h2>${escapeAttr(s.h)}</h2>` + s.p.map(t => `<p>${t}</p>`).join('')
      ).join('');

    fs.writeFileSync(path.join(ROOT, meta.file), template({
      title, desc, canonical, spaPath: `/#/${kind}`, contentHtml, ogType: 'website',
      crumbs: [
        { name: 'KashSec Academy', url: SITE + '/' },
        { name: page.title, url: canonical },
      ],
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': meta.type,
        name: page.title,
        description: desc,
        url: canonical,
        inLanguage: 'en',
        dateModified: APP_LASTMOD,
        isPartOf: { '@type': 'WebSite', name: 'KashSec Academy', url: SITE + '/' },
        publisher: ORG,
      }],
    }));
    sitemapUrls.push({ loc: canonical, lastmod: APP_LASTMOD, priority: meta.priority });
  }
}

// Regenerate sitemap.xml. Priorities are relative hints only, but lastmod
// is the field that actually earns recrawls.
const smXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls.map(u =>
    `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`
  ).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), smXml);
fs.writeFileSync(path.join(ROOT, 'lesson-updated.js'),
  `/* Generated from source history by generate-prerender.js. Content change dates, not editorial review dates. */\nconst LESSON_UPDATED = ${JSON.stringify(lessonUpdated)};\n`);

console.log(`Prerender complete: ${written} lesson pages + ${PATHS.length} path overviews + 1 path hub + ${toolsWritten} tools + ${labsWritten} labs + 1 FAQ. sitemap.xml updated (${sitemapUrls.length} URLs).`);
