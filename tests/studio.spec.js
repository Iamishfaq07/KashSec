#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validatePractice, gradeLab, labById, practiceEvidence, foundationFor } from '../studio/practice.js';
import {
  CERT_TRACKS, PENTEST_EXCHANGE, RESEARCH, SECURE_AGENT_POLICY, SECURE_IAM_POLICY, SECURE_INVOICE_POLICY, SKILLS, SOC_EVENTS, VULNERABLE_AGENT_POLICY, VULNERABLE_IAM_POLICY, VULNERABLE_INVOICE_POLICY,
  buildStudyPlan, buildStartRoute, careerGaps, coachAnswer, esc, explainNext, gradeAgentPolicy, gradeHunt, gradeIamPolicy, gradeInvoicePolicy, gradePentest, gradeTimeline, gradeTriage, northbridgeReport, passportEntries, passportJson, passportMarkdown, reviewQueue, scoreTrack, shiftQueue, studioPages, validateStudio
} from '../studio/model.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = validateStudio().concat(validatePractice());
assert.deepEqual(errors, [], errors.join('\n'));
assert.equal(esc('<script>"&"</script>'), '&lt;script&gt;&quot;&amp;&quot;&lt;/script&gt;');

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

const triage = gradeTriage(Object.fromEntries(SOC_EVENTS.map(event => [event.id, event.verdict])));
assert.equal(triage.passed, true);
assert.equal(triage.total, 5);
assert.equal(gradeTriage({ cross: 'expected' }).passed, false);
const precise = gradeHunt('api', 'tenant=birch');
assert.deepEqual(precise.ids, ['cross']);
assert.equal(precise.precise, true);
assert.equal(gradeHunt('api', 'status=200').precise, false);
assert.equal(gradePentest(PENTEST_EXCHANGE.answer).pass, true);
assert.equal(gradePentest(0).pass, false);
const review = reviewQueue(track, { 'secplus.q1': 0 });
assert.equal(review[0].objectiveId, 'secplus.architecture');
assert.equal(reviewQueue(track, perfect).length, 0);
assert.equal(gradeIamPolicy(SECURE_IAM_POLICY).passed, true);
assert.equal(gradeIamPolicy(VULNERABLE_IAM_POLICY).passed, false);
assert.equal(gradeAgentPolicy(SECURE_AGENT_POLICY).passed, true);
assert.equal(gradeAgentPolicy(VULNERABLE_AGENT_POLICY).passed, false);
assert.equal(gradeTimeline({ login: 'context', cross: 'finding', gap: 'exclude', reset: 'exclude' }).passed, true);
assert.equal(gradeTimeline({ cross: 'context' }).passed, false);
assert.match(northbridgeReport({}), /Assistant boundary not checked/);
const emptyReport = northbridgeReport({});
assert.match(emptyReport, /billing\.northbridge\.test/);
assert.match(emptyReport, /Not checked/);
assert.equal(emptyReport.includes('All invoice fixture cases passed'), false);
const passedReport = northbridgeReport({ fix: { ran: true, policy: SECURE_INVOICE_POLICY, notes: '' }, cybercity: { iamRan: true, iam: SECURE_IAM_POLICY } });
assert.match(passedReport, /All invoice fixture cases passed/);
assert.match(passedReport, /billing function only/);
const record = passportEntries({ fix: { ran: true, policy: VULNERABLE_INVOICE_POLICY }, cybercity: { iamRan: true, iam: SECURE_IAM_POLICY }, researchRead: ['owasp-api'], mastered: ['foundations.cia'] });
assert.equal(record.find(item => item.id === 'northbridge.policy').level, 'practiced');
assert.equal(passportEntries({ fix: { ran: true, policy: SECURE_INVOICE_POLICY } }).find(item => item.id === 'northbridge.policy').level, 'auto-verified');
assert.equal(record.find(item => item.id === 'northbridge.iam').level, 'auto-verified');
assert.equal(record.find(item => item.id === 'read.owasp-api').level, 'read');
assert.equal(record.find(item => item.id === 'skill.foundations.cia').level, 'self-reported');
assert.match(coachAnswer('next', { mastered: [] }).body, /starting skill/);
assert.match(coachAnswer('invoice', {}).body, /have not run/);
assert.equal(SKILLS.length > 7, true);
const oauth = labById('oauth');
assert.equal(gradeLab(oauth, oauth.secureInput).passed, true);
assert.equal(practiceEvidence({ oauth: { ran: true, input: oauth.vulnerableInput } })[0].level, 'practiced');
assert.equal(practiceEvidence({ oauth: { ran: true, input: oauth.secureInput } })[0].level, 'auto-verified');
const downloaded = JSON.parse(passportJson({ mastered: ['foundations.cia'] }));
assert.match(downloaded.limitation, /Not a certificate/);
assert.equal(downloaded.careerGaps.length, 21);
assert.equal(downloaded.careerGaps.find(item => item.id === 'soc').have, 1);
assert.equal(downloaded.careerGaps.find(item => item.id === 'mobile').total, 0);
assert.match(passportMarkdown({ mastered: ['foundations.cia'] }), /no starter skill is mapped/);
for (const skill of SKILLS) {
  for (const lesson of skill.lessons) {
    assert.ok(fs.existsSync(path.join(root, 'course', lesson.path, `${lesson.id}.md`)), `${skill.id} lesson ${lesson.id}`);
  }
  for (const lab of skill.labs) assert.ok(fs.existsSync(path.join(root, 'labs', `${lab.id}.html`)), `${skill.id} lab ${lab.id}`);
  for (const tool of skill.tools) assert.ok(fs.existsSync(path.join(root, 'tools', `${tool.id}.html`)), `${skill.id} tool ${tool.id}`);
  for (const lab of skill.expertLabs) assert.ok(fs.existsSync(path.join(root, 'expert-labs', `${lab.id}.html`)), `${skill.id} expert ${lab.id}`);
  for (const lab of skill.practice || []) assert.ok(fs.existsSync(path.join(root, 'practice', lab.id, 'index.html')), `${skill.id} practice ${lab.id}`);
}
assert.equal(foundationFor('10-fundamentals', 'cia-triad').title, 'The CIA triad');
assert.equal(foundationFor('10-fundamentals', 'missing'), null);
const shift = shiftQueue({});
assert.equal(shift.length, 6);
assert.equal(shift.every(item => item.level === 'not-started'), true);
const verifiedShift = shiftQueue({ practice: { phish: { ran: true, input: labById('phish').secureInput } }, cybercity: { triageRan: true, triage: Object.fromEntries(SOC_EVENTS.map(event => [event.id, event.verdict])) } });
assert.equal(verifiedShift.find(item => item.id === 'phish').level, 'verified');
assert.equal(verifiedShift.find(item => item.id === 'invoice-api').level, 'verified');
assert.equal(verifiedShift.find(item => item.id === 'ransom').level, 'not-started');

assert.ok(RESEARCH.some(item => item.kind === 'original-kashsec'));
assert.ok(RESEARCH.filter(item => item.kind === 'curated-external').every(item => item.url.startsWith('https://')));
assert.equal(new Set(RESEARCH.map(item => item.id)).size, RESEARCH.length);

const oscp = CERT_TRACKS.find(item => item.id === 'oscp-plus');
assert.match(oscp.versions[0].note, /23 hours and 45 minutes/);
assert.match(oscp.versions[0].note, /scaled scoring/);
const sc200 = CERT_TRACKS.find(item => item.id === 'sc-200');
assert.match(sc200.versions[0].note, /does not show domain percentages/);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const page of studioPages()) {
  const html = fs.readFileSync(path.join(root, page.file), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.equal(canonical, `https://kashsec.vercel.app${page.path}`, page.file);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), page.file);
  assert.equal((html.match(/<main\b[\s\S]*?<\/main>/)[0].match(/<h1\b/g) || []).length, 1, page.file);
  assert.ok(html.includes('ca-pub-7042949574293510'), page.file);
}
const gaps = careerGaps(['foundations.cia']);
assert.equal(gaps.length, 21);
assert.equal(gaps.find(item => item.id === 'soc').have, 1);
assert.equal(gaps.find(item => item.id === 'aisec').have, 0);
assert.equal(gaps.find(item => item.id === 'mobile').total, 0);
assert.equal(new Set(gaps.map(item => item.id)).size, 21);
for (const experience of ['beginner', 'some', 'experienced']) {
  for (const goal of ['unsure', 'pentest', 'soc', 'appsec', 'cloud', 'ai', 'cert', 'grc']) {
    const route = buildStartRoute({ experience, goal, minutes: 15 });
    const blob = JSON.stringify(route);
    assert.equal(blob.includes('expert-labs') || blob.includes('ad-attack'), false, `${experience} ${goal}`);
    assert.ok(route.first.href.startsWith('#/'));
    assert.equal(route.today.length >= 1, true);
  }
}
assert.equal(buildStartRoute({ experience: 'beginner', goal: 'pentest', minutes: 15 }).first.href, '#/lesson/10-fundamentals/cia-triad');
assert.equal(buildStartRoute({ experience: 'experienced', goal: 'appsec', minutes: 30 }).first.href, '#/fix-verify');
assert.equal(buildStartRoute({}).goal, 'unsure');
assert.ok(fs.existsSync(path.join(root, 'course/23-grc-compliance/what-is-grc.md')));
assert.ok(fs.existsSync(path.join(root, 'course/08-cloud-basics/shared-responsibility-model.md')));

console.log(`PASS: studio graph, ${CERT_TRACKS.length} cert plans, ${RESEARCH.length} research cards, and invoice policy checks.`);
