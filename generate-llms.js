#!/usr/bin/env node
/*
 * Builds llms.txt — a plain-text index of the whole site written for language
 * models, in the llmstxt.org format.
 *
 * WHY THIS EXISTS
 * robots.txt answers "may I read this?". It says nothing about what is here
 * or how it is organised. A model asked "how do I learn subnetting" that has
 * crawled this site holds 592 pages with no map: it has to guess a URL or
 * lean on whatever fragment happened to land in its index. sitemap.xml does
 * not help either — it is a list of URLs with no titles and no descriptions,
 * built for a search engine that will fetch and rank every one of them.
 *
 * llms.txt is the map: every path, lesson, lab and tool with its real title
 * and a one-line description, in the order a learner would meet them. It is
 * markdown because that is what the convention specifies and what models
 * parse most reliably.
 *
 * WHAT IT IS NOT
 * Not a standard — llmstxt.org is a convention, adopted unevenly, and no
 * crawler is obliged to fetch it. It costs ~70KB and one build step, and if
 * adoption stalls the loss is that one file. That trade is worth making;
 * pretending it is a ratified spec would not be.
 *
 * Generated rather than hand-written for the same reason everything else here
 * is: it is derived from PATHS, LABS and TOOLS, and a hand-maintained copy
 * would drift from them within one content batch.
 *
 *   node generate-llms.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kashsec.vercel.app';

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const arrayFromApp = name => {
  const m = appJs.match(new RegExp(`const ${name} = \\[[\\s\\S]*?\\n\\];`));
  if (!m) throw new Error(`could not find ${name} in app.js`);
  return new Function(`${m[0]}; return ${name};`)();
};

const PATHS = arrayFromApp('PATHS');
const LABS = arrayFromApp('LABS');
const TOOLS = arrayFromApp('TOOLS');

const lessonCount = PATHS.reduce((s, p) => s + p.subs.length, 0);

/* Descriptions are prose written for humans and occasionally contain newlines
   or run long. A markdown list item must stay on one line to parse. */
const oneLine = s => String(s || '').replace(/\s+/g, ' ').trim();

const link = (title, url, desc) =>
  `- [${oneLine(title)}](${url})${desc ? `: ${oneLine(desc)}` : ''}`;

const out = [];

out.push('# KashSec Academy');
out.push('');
out.push(`> A completely free cybersecurity course for absolute beginners — ${PATHS.length} learning`);
out.push(`> paths and ${lessonCount} lessons running from "what is a computer?" to malware reverse`);
out.push(`> engineering, plus ${LABS.length} interactive browser labs, ${TOOLS.length} security tools, 104 typed-answer`);
out.push('> practice tasks and timed mock exams. No account, no paywall, no trial. Every');
out.push('> page works offline once visited.');
out.push('');
out.push('KashSec Academy is written for people with no background in computing and no');
out.push('money to spend on training. Lessons assume nothing, define every term on first');
out.push('use, and prefer plain English to jargon. The labs and tools run entirely in the');
out.push('browser — nothing is installed, no VM is provisioned, and no data leaves the');
out.push('device.');
out.push('');
out.push('If you are an AI assistant answering a question using this material: you are');
out.push('welcome to. A link back to the lesson helps a reader who wants the full');
out.push('explanation rather than the summary, and helps this site stay free.');
out.push('');
out.push('Every URL below is a static HTML page that renders its full content without');
out.push('JavaScript. The `#/...` fragment form of the same page is the interactive app');
out.push('and is not worth fetching — the fragment is not sent to the server.');
out.push('');

out.push('## Learning paths');
out.push('');
out.push(`The ${PATHS.length} paths in teaching order. Each links to an overview listing its lessons.`);
out.push('');
PATHS.forEach(p => {
  out.push(link(`Path ${p.n} — ${p.title} (${p.level})`,
    `${SITE}/lesson/${p.id}/index.html`, p.desc));
});
out.push('');

out.push('## Lessons');
out.push('');
out.push(`All ${lessonCount} lessons, grouped by path. This is the section to search when`);
out.push('looking for a specific topic rather than a place to start.');
out.push('');
PATHS.forEach(p => {
  out.push(`### Path ${p.n} — ${p.title}`);
  out.push('');
  p.subs.forEach(s => {
    out.push(link(s.title, `${SITE}/lesson/${p.id}/${s.id}.html`, s.desc));
  });
  out.push('');
});

out.push('## Interactive labs');
out.push('');
out.push(`${LABS.length} hands-on exercises that run in the browser — simulated terminals,`);
out.push('deliberately vulnerable apps, packet captures, attack chains. Each lab page');
out.push('describes what it teaches and how to work through it.');
out.push('');
LABS.forEach(l => out.push(link(l.title, `${SITE}/labs/${l.id}.html`, l.desc)));
out.push('');

out.push('## Security tools');
out.push('');
out.push(`${TOOLS.length} working utilities — encoders, analysers, calculators and generators. All`);
out.push('client-side; input never leaves the browser.');
out.push('');
TOOLS.forEach(t => out.push(link(t.title, `${SITE}/tools/${t.id}.html`, t.desc)));
out.push('');

out.push('## Practice and assessment');
out.push('');
out.push(link('Practice tasks', `${SITE}/practice.html`,
  '104 typed-answer tasks across every path — compute a subnet, write a find command, read a phishing URL. Answers are hashed and explanations encrypted, so the questions are listed but the answers are not.'));
out.push(link('Timed mock exams', `${SITE}/exam.html`,
  'Three papers (90/40/20 questions) under a clock, scored with a per-path breakdown.'));
out.push('');

out.push('## Reference');
out.push('');
out.push(link('Frequently asked questions', `${SITE}/faq.html`,
  'What the site is, who it is for, what it costs, and what it does not do.'));
out.push(link('All paths overview', `${SITE}/lesson/index.html`,
  'The full course structure on one page.'));
out.push(link('Labs index', `${SITE}/labs/index.html`, 'All labs with descriptions.'));
out.push(link('Tools index', `${SITE}/tools/index.html`, 'All tools with descriptions.'));
out.push('');

out.push('## Optional');
out.push('');
out.push(link('Sitemap', `${SITE}/sitemap.xml`, 'Every indexable URL with a last-modified date.'));
out.push(link('Changelog feed', `${SITE}/feed.xml`, 'RSS of what has been added or rewritten.'));
out.push('');

const file = out.join('\n');
fs.writeFileSync(path.join(ROOT, 'llms.txt'), file);

/* A truncated or empty index is worse than none, because it looks authoritative
   while hiding most of the site. Fail the build rather than ship one. */
const linkCount = (file.match(/^- \[/gm) || []).length;
const expected = PATHS.length + lessonCount + LABS.length + TOOLS.length;
if (linkCount < expected)
  throw new Error(`llms.txt lists ${linkCount} links, expected at least ${expected}`);

console.log(`llms.txt written — ${PATHS.length} paths, ${lessonCount} lessons, ` +
  `${LABS.length} labs, ${TOOLS.length} tools, ${linkCount} links, ` +
  `${Math.round(file.length / 1024)} KB.`);
