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

// IDs are editorial data, independent of array order, titles and descriptions.
// Duplicate IDs make feed readers silently collapse distinct releases.
export function buildFeed(entries) {
  if (!Array.isArray(entries) || !entries.length) throw new Error('Feed needs release entries');
  const ids = new Set();
  for (const c of entries) {
    if (!c || typeof c.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) || ids.has(c.id))
      throw new Error('Every release needs a unique, stable id');
    ids.add(c.id);
    if (typeof c.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) ||
        !Number.isFinite(Date.parse(c.date + 'T12:00:00Z')) ||
        new Date(c.date + 'T12:00:00Z').toISOString().slice(0, 10) !== c.date)
      throw new Error('Release date must be a real YYYY-MM-DD date');
    if (typeof c.title !== 'string' || !c.title.trim() || !Array.isArray(c.items) ||
        !c.items.length || c.items.some(i => typeof i !== 'string' || !i.trim()))
      throw new Error('Release needs a title and update descriptions');
  }
  const items = entries.map((c) => {
    const pubDate = new Date(c.date + 'T12:00:00Z').toUTCString();
    const body = '<ul>' + c.items.map((i) => `<li>${esc(i)}</li>`).join('') + '</ul>';
    return `    <item>
      <title>${esc(c.title)}</title>
      <link>${SITE}/#/changelog</link>
      <guid isPermaLink="false">kashsec-${c.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(body)}</description>
    </item>`;
  }).join('\n');

  // A wall-clock timestamp makes every clean build change a committed file.
  // The latest published changelog item is the feed's actual content date.
  const lastBuild = new Date(Math.max(...entries.map(c =>
    Date.parse(c.date + 'T12:00:00Z')))).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KashSec Academy — What's new</title>
    <link>${SITE}/</link>
    <description>Updates to the free KashSec Academy cybersecurity course.</description>
    <language>en</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const xml = buildFeed(CHANGELOG);
  fs.writeFileSync(path.join(ROOT, 'feed.xml'), xml);
  console.log(`feed.xml written — ${CHANGELOG.length} entries.`);
}
