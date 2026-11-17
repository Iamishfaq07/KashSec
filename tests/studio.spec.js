#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CERT_TRACKS, RESEARCH, SECURE_INVOICE_POLICY, SKILLS, VULNERABLE_INVOICE_POLICY,
  buildStudyPlan, explainNext, gradeInvoicePolicy, scoreTrack, validateStudio
} from '../studio/model.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = validateStudio();
assert.deepEqual(errors, [], errors.join('\n'));

for (const skill of SKILLS) {
  for (const lesson of skill.lessons) {
    assert.ok(fs.existsSync(path.join(root, 'course', lesson.path, `${lesson.id}.md`)), `${skill.id} lesson ${lesson.path}/${lesson.id}`);
  }
}
for (const track of CERT_TRACKS) {
  for (const objective of track.objectives) {
    const lesson = objective.lesson;
    assert.ok(fs.existsSync(path.join(root, 'course', lesson.path, `${lesson.id}.md`)), `${objective.id} lesson`);
  }
}
const experts = fs.readFileSync(path.join(root, 'expert-labs.js'), 'utf8');
assert.ok(experts.includes('tenant-boundary') && experts.includes('agent-tool-boundary'));
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
for (const skill of SKILLS) {
  for (const lab of skill.labs) assert.match(app, new RegExp(`id:'${lab.id}'`));
  for (const tool of skill.tools) assert.match(app, new RegExp(`id:'${tool.id}'`));
}

const secure = gradeInvoicePolicy(SECURE_INVOICE_POLICY);
assert.equal(secure.passed, true);
assert.equal(secure.passedCount, 7);
const open = gradeInvoicePolicy(VULNERABLE_INVOICE_POLICY);
assert.equal(open.passed, false);
assert.ok(open.results.some(result => result.id === 'other-tenant' && result.pass === false));
assert.ok(open.results.some(result => result.id === 'spoof-role' && result.pass === false));

const track = CERT_TRACKS.find(item => item.id === 'security-plus');
const perfect = Object.fromEntries(track.questions.map(question => [question.id, question.answer]));
assert.equal(scoreTrack(track, perfect).correct, track.questions.length);
assert.equal(scoreTrack(track, { 'secplus.q1': 0 }).missed.length > 0, true);

const plan = buildStudyPlan(track, { minutesPerDay: 30, start: '2026-11-18', examDate: '2026-11-19', today: '2026-11-18' });
assert.ok(plan.days.length > 1);
assert.equal(plan.overflowsExam, true);
assert.equal(plan.days[0].date, '2026-11-18');

const first = explainNext([]);
assert.equal(first.skill.id, 'foundations.cia');
const second = explainNext(['foundations.cia']);
assert.equal(second.skill.id, 'networking.dns.resolution');
assert.match(second.reason, /Confidentiality, integrity, and availability/);

assert.ok(RESEARCH.some(item => item.kind === 'original-kashsec'));
assert.ok(RESEARCH.filter(item => item.kind === 'curated-external').every(item => item.url.startsWith('https://')));
assert.equal(new Set(RESEARCH.map(item => item.id)).size, RESEARCH.length);

const oscp = CERT_TRACKS.find(item => item.id === 'oscp-plus');
assert.match(oscp.versions[0].note, /23 hours and 45 minutes/);
assert.match(oscp.versions[0].note, /scaled scoring/);
const sc200 = CERT_TRACKS.find(item => item.id === 'sc-200');
assert.match(sc200.versions[0].note, /does not show domain percentages/);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of ['certlab/index.html', 'research/index.html', 'skills/index.html', 'fix-verify/index.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.ok(canonical && sitemap.includes(`<loc>${canonical}</loc>`), file);
  assert.equal((html.match(/<main\b[\s\S]*?<\/main>/)[0].match(/<h1\b/g) || []).length, 1, file);
  assert.ok(html.includes('ca-pub-7042949574293510'), file);
}

console.log(`PASS: studio graph, ${CERT_TRACKS.length} cert plans, ${RESEARCH.length} research cards, and invoice policy checks.`);
