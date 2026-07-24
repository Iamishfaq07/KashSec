#!/usr/bin/env node
/*
 * Prerenders static HTML for every lesson so search engines can index all
 * 205 lesson URLs (the SPA is hash-routed, invisible to most crawlers).
 *
 * Each generated file at lesson/<pathId>/<subId>.html contains:
 *   - a lesson-specific <title>, <meta description>, canonical link, and
 *     og:/twitter: tags, all filled in from the lesson content
 *   - the lesson's markdown, pre-rendered to HTML with `marked` so bots
 *     see the actual content, not an empty shell
 *   - a small script that redirects real users into the SPA at
 *     `#/lesson/<pathId>/<subId>`, so navigation still uses the app
 *
 * Also regenerates sitemap.xml with entries for every lesson URL.
 *
 * Run after any lesson content change:
 *   node generate-prerender.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kashsec.vercel.app';

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const m = appJs.match(/const PATHS = \[[\s\S]*?\n\];/);
if (!m) throw new Error('Could not find PATHS array in app.js');
const PATHS = new Function(m[0] + '; return PATHS;')();

// Tools and labs are SPA-only routes, so they need their own crawlable
// stubs — several of them (JWT decoder, CVSS calculator, subnet
// calculator) target real search demand and were previously invisible.
function extractArray(name) {
  const match = appJs.match(new RegExp('const ' + name + ' = \\[[\\s\\S]*?\\n\\];'));
  if (!match) throw new Error('Could not find ' + name + ' array in app.js');
  return new Function(match[0] + '; return ' + name + ';')();
}
const TOOLS = extractArray('TOOLS');
const LABS = extractArray('LABS');

// `marked` is a devDependency (npm install marked) — only needed at build
// time to prerender lesson HTML; the live site still loads it from CDN in
// the browser (app.js's ensureMarkdownLibs), this is a separate copy.
let marked;
try {
  marked = (await import('marked')).marked;
} catch {}
if (!marked) {
  console.warn('marked not installed (run `npm install`) — falling back to a minimal renderer.');
  marked = { parse: (md) => md.split('\n\n').map(p => p.startsWith('#') ? `<h2>${p.replace(/^#+\s*/,'')}</h2>` : `<p>${p.replace(/\n/g,' ')}</p>`).join('\n') };
}

function escapeAttr(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Very rough description: first non-heading paragraph, first 200 chars.
function firstPara(md){
  const noFront = md.replace(/^---[\s\S]*?---\n/,'');
  const paras = noFront.split(/\n\n+/).map(p=>p.trim()).filter(Boolean);
  for(const p of paras){
    if(p.startsWith('#') || p.startsWith(':::') || p.startsWith('~~~') || p.startsWith('```') || p.startsWith('???')) continue;
    return p.replace(/\s+/g,' ').replace(/[*_`]/g,'').slice(0,200);
  }
  return '';
}

const template = ({title, desc, canonical, ogUrl, contentHtml, pathId, subId, breadcrumb}) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeAttr(title)}</title>
<meta name="description" content="${escapeAttr(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🛡%3C/text%3E%3C/svg%3E">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${ogUrl}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(title)}">
<meta name="twitter:description" content="${escapeAttr(desc)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<meta name="theme-color" content="#0A0E13">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"LearningResource","name":${JSON.stringify(title)},"description":${JSON.stringify(desc)},"url":${JSON.stringify(canonical)},"provider":{"@type":"Organization","name":"KashSec Academy","url":"${SITE}"},"isAccessibleForFree":true,"learningResourceType":"Lesson"}
</script>
<style>
:root{color-scheme:dark;--bg:#080A0F;--surface:#0F141E;--text:#EAEFF5;--muted:#94A3B2;--amber:#EFA43A;--teal:#5FE0CF;--border:rgba(255,255,255,.08)}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6}
main{max-width:760px;margin:0 auto;padding:1.5rem 1.2rem 3rem}
.spa-notice{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:.9rem 1.1rem;margin-bottom:1.5rem;color:var(--muted);font-size:.88rem}
.spa-notice a{color:var(--amber);text-decoration:none;font-weight:600}
.crumb{color:var(--muted);font-size:.8rem;margin-bottom:.4rem}
.crumb a{color:var(--teal);text-decoration:none}
h1,h2,h3,h4{font-family:Inter,system-ui,sans-serif;color:var(--text)}
h1{font-size:2rem;margin:.5rem 0 1rem}
h2{font-size:1.4rem;margin:2rem 0 .8rem;padding-top:.6rem;border-top:1px solid var(--border)}
a{color:var(--teal)}
code{background:rgba(63,182,168,.13);color:var(--teal);padding:.1rem .35rem;border-radius:4px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.9em}
pre{background:#050810;border:1px solid var(--border);border-radius:10px;padding:1rem;overflow-x:auto}
pre code{background:transparent;color:var(--text);padding:0}
blockquote{border-left:3px solid var(--amber);margin:1rem 0;padding:.4rem 1rem;color:var(--muted);background:var(--surface);border-radius:6px}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{border:1px solid var(--border);padding:.5rem .7rem;text-align:left}
th{background:var(--surface)}
img{max-width:100%;height:auto}
footer{color:var(--muted);font-size:.82rem;text-align:center;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border)}
</style>
</head>
<body>
<main>
  <div class="spa-notice">📱 Loading the interactive KashSec app… If it doesn't switch automatically, <a href="${canonical}">continue here →</a></div>
  <div class="crumb"><a href="/">KashSec Academy</a> · ${breadcrumb}</div>
  <article>${contentHtml}</article>
  <footer>© KashSec Academy · <a href="/">Interactive site</a> · <a href="/sitemap.xml">Sitemap</a></footer>
</main>
<script>
// Redirect actual users into the SPA. Search-engine crawlers get to read
// the content above before the redirect fires.
(function(){
  try {
    var target = ${JSON.stringify(canonical)};
    // Only redirect from the .html file, not from the SPA route itself.
    if (location.pathname.endsWith('.html')) location.replace(target);
  } catch (e) {}
})();
</script>
</body>
</html>
`;

let written = 0;
const sitemapUrls = [SITE + '/'];
for (const p of PATHS) {
  for (const s of p.subs) {
    const src = path.join(ROOT, 'course', p.id, s.id + '.md');
    if (!fs.existsSync(src)) continue;
    const md = fs.readFileSync(src, 'utf8');
    const canonical = `${SITE}/#/lesson/${p.id}/${s.id}`;
    const title = `${s.title} — Path ${p.n} · KashSec Academy`;
    const desc = firstPara(md) || `${s.title}: ${s.desc || ''}`;
    // Strip our custom :::callouts / ???refs / ~~~svg so marked doesn't
    // mangle them; they're stylistic only, prerender content is for bots.
    let clean = md
      .replace(/^:::\w+(?:\s+.+?)?\n([\s\S]*?)\n:::$/gm, (_, body) => body)
      .replace(/^\?{3}\s*refs\s*\n([\s\S]*?)\n\?{3}$/gm, (_, body) => '\n### References\n' + body)
      .replace(/^~{3}svg(?:\s+(.+?))?\n[\s\S]*?\n~{3}$/gm, (_, cap) => cap ? `\n*[${cap}]*\n` : '')
      .replace(/^```mermaid\n[\s\S]*?\n```$/gm, '');
    const contentHtml = marked.parse(clean);
    const breadcrumb = `<a href="/">Path ${p.n} — ${p.title}</a> · ${escapeAttr(s.title)}`;
    const outDir = path.join(ROOT, 'lesson', p.id);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, s.id + '.html'),
      template({title, desc, canonical, ogUrl: canonical, contentHtml, pathId:p.id, subId:s.id, breadcrumb}));
    sitemapUrls.push(`${SITE}/lesson/${p.id}/${s.id}.html`);
    written++;
  }
}

// Also emit path-overview stubs so #/lesson/<pathId> is indexable too.
for (const p of PATHS) {
  const canonical = `${SITE}/#/lesson/${p.id}`;
  const title = `Path ${p.n}: ${p.title} — KashSec Academy`;
  const desc = p.desc || '';
  const contentHtml = `<h1>${escapeAttr(title)}</h1><p>${escapeAttr(desc)}</p><h2>Sub-lessons</h2><ul>` +
    p.subs.map(s => `<li><a href="/lesson/${p.id}/${s.id}.html">${p.n}.${s.n} · ${escapeAttr(s.title)}</a> — ${escapeAttr(s.desc||'')}</li>`).join('') + '</ul>';
  const outDir = path.join(ROOT, 'lesson', p.id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'),
    template({title, desc, canonical, ogUrl:canonical, contentHtml, pathId:p.id, subId:'', breadcrumb: `Path ${p.n} — ${escapeAttr(p.title)}`}));
  sitemapUrls.push(`${SITE}/lesson/${p.id}/`);
}

/* Crawlable stubs for each tool and lab. These are interactive
   client-side pages, so there's no body content to prerender — the stub
   carries the title, description, and context a search engine needs,
   then hands real visitors to the SPA like the lesson stubs do. */
function writeStubSet(items, urlPrefix, dirName, kindLabel, indexTitle, indexDesc) {
  const outDir = path.join(ROOT, dirName);
  fs.mkdirSync(outDir, { recursive: true });
  for (const it of items) {
    const canonical = `${SITE}/#/${urlPrefix}/${it.id}`;
    const title = `${it.title} — Free online ${kindLabel} · KashSec Academy`;
    const desc = it.desc || '';
    const contentHtml =
      `<h1>${escapeAttr(it.title)}</h1>` +
      `<p>${escapeAttr(desc)}</p>` +
      (it.related ? `<p><strong>Pairs with:</strong> ${escapeAttr(it.related)}</p>` : '') +
      `<p>This ${kindLabel} runs entirely in your browser — nothing is uploaded, and it's free to use with no account.</p>` +
      `<h2>More free security ${kindLabel}s</h2><ul>` +
      items.filter(o => o.id !== it.id)
           .map(o => `<li><a href="/${dirName}/${o.id}.html">${escapeAttr(o.title)}</a> — ${escapeAttr(o.desc || '')}</li>`)
           .join('') + '</ul>';
    fs.writeFileSync(path.join(outDir, it.id + '.html'),
      template({ title, desc, canonical, ogUrl: canonical, contentHtml, pathId: '', subId: '',
                 breadcrumb: `<a href="/${dirName}/">${kindLabel[0].toUpperCase() + kindLabel.slice(1)}s</a> · ${escapeAttr(it.title)}` }));
    sitemapUrls.push(`${SITE}/${dirName}/${it.id}.html`);
  }
  // Index stub for the section itself.
  const canonical = `${SITE}/#/${dirName}`;
  const contentHtml = `<h1>${escapeAttr(indexTitle)}</h1><p>${escapeAttr(indexDesc)}</p><ul>` +
    items.map(o => `<li><a href="/${dirName}/${o.id}.html">${escapeAttr(o.title)}</a> — ${escapeAttr(o.desc || '')}</li>`).join('') + '</ul>';
  fs.writeFileSync(path.join(outDir, 'index.html'),
    template({ title: indexTitle + ' · KashSec Academy', desc: indexDesc, canonical, ogUrl: canonical,
               contentHtml, pathId: '', subId: '', breadcrumb: escapeAttr(indexTitle) }));
  sitemapUrls.push(`${SITE}/${dirName}/`);
  return items.length;
}

const toolsWritten = writeStubSet(
  TOOLS, 'tools', 'tools', 'security tool',
  'Free online security tools',
  'Encoders, hash tools, a JWT decoder, CVSS and subnet calculators, and more — all free, all running locally in your browser.');
const labsWritten = writeStubSet(
  LABS, 'labs', 'labs', 'security lab',
  'Free interactive security labs',
  'Practise SQL injection, XSS, IDOR, JWT forgery, SSRF, XXE, path traversal, log analysis and more — safe, simulated, and entirely in your browser.');

// Regenerate sitemap.xml with all URLs (home + lessons + paths + tools + labs).
const smXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), smXml);

console.log(`Prerender complete: ${written} lesson pages + ${PATHS.length} path overviews + ${toolsWritten} tools + ${labsWritten} labs. sitemap.xml updated (${sitemapUrls.length} URLs).`);
