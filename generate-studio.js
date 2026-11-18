#!/usr/bin/env node
/* Writes the crawlable CertLab, Research, Skills, and Fix & Verify pages
   and keeps their sitemap entries after prerender regenerates sitemap.xml. */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { studioPages } from './studio/model.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://kashsec.vercel.app';

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function studioLastmod() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const dirty = new Set();
    for (const args of [['diff', '--name-only'], ['ls-files', '--others', '--exclude-standard']]) {
      execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean).forEach(file => dirty.add(file.trim()));
    }
    const raw = execFileSync('git', ['log', '-1', '--format=%ct', '--', 'studio/model.js'], { cwd: ROOT, encoding: 'utf8' }).trim();
    const committed = raw ? new Date(Number(raw) * 1000).toISOString().slice(0, 10) : '';
    if (['studio/model.js', 'generate-studio.js', 'app.js'].some(file => dirty.has(file)) && (!committed || today > committed)) return today;
    return committed || today;
  } catch {
    return today;
  }
}

export function publishStudio() {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const header = index.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  const footer = index.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  const scripts = index.match(/<script src="quizzes\.js"[\s\S]*?(?=<\/body>)/)?.[0];
  if (!header || !footer || !scripts) throw new Error('index.html shell could not be read for studio pages');
  const lastmod = studioLastmod();
  const entries = [];
  for (const page of studioPages()) {
    const canonical = `${SITE}${page.path}`;
    const crumbs = [
      { name: 'KashSec Academy', url: SITE + '/' },
      { name: page.heading, url: canonical }
    ];
    const jsonLd = [
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, position) => ({ '@type': 'ListItem', position: position + 1, name: crumb.name, item: crumb.url })) },
      { '@context': 'https://schema.org', '@type': 'LearningResource', name: page.heading, description: page.description, url: canonical, isAccessibleForFree: true, inLanguage: 'en', provider: { '@type': 'Organization', name: 'KashSec Academy', url: SITE + '/' } }
    ];
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<title>${escapeAttr(page.title)}</title>
<meta name="description" content="${escapeAttr(page.description)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192">
<meta property="og:title" content="${escapeAttr(page.title)}">
<meta property="og:description" content="${escapeAttr(page.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="KashSec Academy">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeAttr(page.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(page.title)}">
<meta name="twitter:description" content="${escapeAttr(page.description)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<meta name="twitter:image:alt" content="${escapeAttr(page.title)}">
<meta name="theme-color" content="#0A0E13" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F6F7FA" media="(prefers-color-scheme: light)">
<meta name="google-adsense-account" content="ca-pub-7042949574293510">
<link rel="manifest" href="/manifest.json">
<link rel="alternate" type="application/rss+xml" title="KashSec Academy — What's new" href="/feed.xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"></noscript>
<link rel="stylesheet" href="/styles.css">
<script src="/ads.js" defer></script>
${jsonLd.map(item => `<script type="application/ld+json">\n${JSON.stringify(item).replace(/</g, '\\u003c')}\n</script>`).join('\n')}
</head>
<body>
<a class="skip" href="${page.path}#app">Skip to content</a>
${header}
<main id="app" tabindex="-1">
  <div class="reader-wrap static-reader"><div class="reader-main">
    <nav class="reader-crumb" aria-label="Breadcrumb"><a href="${SITE}/">KashSec Academy</a> · ${escapeAttr(page.heading)}</nav>
    <div class="md" id="content"><article><h1>${escapeAttr(page.heading)}</h1>${page.body}</article></div>
  </div></div>
</main>
${footer}
${scripts}
</body>
</html>
`;
    const destination = path.join(ROOT, page.file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, html);
    entries.push(`  <url><loc>${canonical}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  }
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemap = sitemap.replace(/\n?  <url><loc>https:\/\/kashsec\.vercel\.app\/(?:certlab|research|skills|fix-verify|cybercity|passport|coach|practice|foundations|shift|start)\/[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
  if (!sitemap.includes('</urlset>')) throw new Error('sitemap.xml has no urlset');
  sitemap = sitemap.replace('</urlset>', `${entries.join('\n')}\n</urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Studio pages written (${entries.length}), sitemap updated, lastmod ${lastmod}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) publishStudio();
