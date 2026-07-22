#!/usr/bin/env node
/*
 * Builds feed.xml (RSS 2.0) from the CHANGELOG array in app.js, so readers
 * and aggregators can follow what's new.
 *   node generate-feed.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kashsec.vercel.app';

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const m = appJs.match(/const CHANGELOG = \[[\s\S]*?\n\];/);
if (!m) throw new Error('Could not find CHANGELOG array in app.js');
const CHANGELOG = new Function(m[0] + '; return CHANGELOG;')();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const items = CHANGELOG.map((c) => {
  const pubDate = new Date(c.date + 'T12:00:00Z').toUTCString();
  const body = '<ul>' + c.items.map((i) => `<li>${esc(i)}</li>`).join('') + '</ul>';
  return `    <item>
      <title>${esc(c.title)}</title>
      <link>${SITE}/#/changelog</link>
      <guid isPermaLink="false">kashsec-${c.date}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(body)}</description>
    </item>`;
}).join('\n');

const lastBuild = new Date().toUTCString();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>KashSec Academy — What's new</title>
    <link>${SITE}/</link>
    <description>Updates to the free KashSec Academy cybersecurity course.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(ROOT, 'feed.xml'), xml);
console.log(`feed.xml written — ${CHANGELOG.length} entries.`);
