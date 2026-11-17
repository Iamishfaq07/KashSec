/* Browser UI for CertLab, the Research Vault, the skills graph, and Fix & Verify.
   Loaded on demand from app.js. Progress stays in localStorage under its own key. */
import {
  CERT_TRACKS, RESEARCH, SKILLS, SECURE_INVOICE_POLICY, VULNERABLE_INVOICE_POLICY,
  buildStudyPlan, coverage, esc, explainNext, gradeInvoicePolicy, lessonHref,
  readinessLabel, researchById, researchKindLabel, scoreTrack, skillById, trackById
} from './model.js';

const STORAGE_KEY = 'kashsec_studio_v1';

function emptyState() {
  return { mastered: [], plans: {}, answers: {}, objectiveStatus: {}, researchRead: [], fix: { policy: { ...VULNERABLE_INVOICE_POLICY }, notes: '', ran: false } };
}

export function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '');
    const base = emptyState();
    if (!parsed || parsed.version !== 1) return base;
    return {
      ...base,
      ...parsed,
      fix: { ...base.fix, ...(parsed.fix || {}), policy: { ...base.fix.policy, ...((parsed.fix && parsed.fix.policy) || {}) } }
    };
  } catch {
    return emptyState();
  }
}

function saveState(state) {
  const payload = { ...state, version: 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function shell(title, lede, crumbs, body) {
  return `<section class="sec ks-studio">
    <nav class="ks-crumbs" aria-label="Breadcrumb"><a href="/">Home</a> · ${crumbs}</nav>
    <p class="sec-eyebrow">KashSec studio</p>
    <h1 class="sec-title">${title}</h1>
    <p class="sec-sub">${lede}</p>
    <div class="ks-jumps" role="navigation" aria-label="Studio sections">
      <a href="#/certlab">Cert prep</a>
      <a href="#/research">Research</a>
      <a href="#/skills">Skills</a>
      <a href="#/fix-verify">Fix & verify</a>
    </div>
    ${body}
  </section>`;
}

function statusOptions(selected) {
  return ['not-started', 'introduced', 'practiced', 'demonstrated', 'review-due'].map(value => {
    const label = value.replace('-', ' ');
    return `<option value="${value}"${value === selected ? ' selected' : ''}>${label}</option>`;
  }).join('');
}

function renderCertHome() {
  const cards = CERT_TRACKS.map(track => `<article class="ks-card">
      <p class="ks-kicker">${esc(track.vendor)} · ${esc(track.level)}</p>
      <h2><a href="#/certlab/${track.id}">${esc(track.name)}</a></h2>
      <p>${esc(track.status)}</p>
      <p class="ks-meta">Official pages checked ${esc(track.verifiedOn)}. ${track.objectives.length} starter objectives · ${track.questions.length} original questions.</p>
      <a class="btn-amber sm" href="#/certlab/${track.id}">Open plan</a>
    </article>`).join('');
  return shell('Certification prep', 'Three starter plans. They reuse KashSec lessons and labs. They are not official exams, vouchers, or pass predictions.', '<span>Cert prep</span>', `<div class="ks-grid">${cards}</div><p class="ks-note">Prices, languages, and booking rules change. Use the vendor link on the plan before you pay. Formative answers ship in the public source, so this is practice, not a sealed exam.</p>`);
}

function renderCertTrack(track, state) {
  const plan = state.plans[track.id] || buildStudyPlan(track, { today: todayISO(), minutesPerDay: 30 });
  const answers = state.answers[track.id] || {};
  const statuses = state.objectiveStatus[track.id] || {};
  const covered = coverage(track, statuses);
  const ready = readinessLabel(track, statuses, answers);
  const objectives = track.objectives.map(item => `<li class="ks-objective">
      <div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.domain)} · ${item.minutes} min · ${item.skills.map(id => esc(skillById(id)?.title || id)).join(', ')}</p>
        <p><a href="${lessonHref(item.lesson)}">Open the lesson</a> · <a href="${esc(item.practice.href)}">${esc(item.practice.label)}</a></p>
      </div>
      <label>Status
        <select data-objective="${esc(item.id)}">${statusOptions(statuses[item.id] || 'not-started')}</select>
      </label>
    </li>`).join('');
  const days = plan.days.map(day => `<li><time datetime="${esc(day.date)}">${esc(day.date)}</time> · ${day.minutes} min · ${day.objectiveIds.map(id => esc(track.objectives.find(item => item.id === id)?.title || id)).join('; ')}</li>`).join('');
  const questions = track.questions.map(question => `<fieldset class="ks-question">
      <legend>${esc(question.prompt)}</legend>
      ${question.choices.map((choice, index) => `<label><input type="radio" name="${esc(question.id)}" value="${index}"${answers[question.id] === index ? ' checked' : ''}> ${esc(choice)}</label>`).join('')}
    </fieldset>`).join('');
  const versions = track.versions.map(version => `<li><strong>${esc(version.code)}</strong> — ${esc(version.note)}</li>`).join('');
  const domains = track.domains.map(domain => `<li>${esc(domain.version)}: ${esc(domain.name)} — ${esc(domain.weight)}</li>`).join('');
  const links = track.official.map(link => `<li><a href="${esc(link.url)}" rel="noopener noreferrer">${esc(link.label)}</a></li>`).join('');
  return shell(esc(track.name), esc(track.status), `<a href="#/certlab">Cert prep</a> · <span>${esc(track.name)}</span>`, `
    <div class="ks-split">
      <section class="ks-card" aria-labelledby="ks-official">
        <h2 id="ks-official">What was checked</h2>
        <ul>${versions}</ul>
        ${domains ? `<h3>Published groupings</h3><ul>${domains}</ul>` : ''}
        <h3>Official pages</h3>
        <ul>${links}</ul>
        <p class="ks-note">${esc(track.notClaimed)}</p>
      </section>
      <form class="ks-card" id="ksPlan" aria-labelledby="ks-plan-title">
        <h2 id="ks-plan-title">Study plan</h2>
        <label>Minutes per day <input name="minutes" type="number" min="15" max="180" step="15" value="${plan.minutesPerDay}" required></label>
        <label>Start <input name="start" type="date" value="${esc(plan.start || todayISO())}" required></label>
        <label>Exam date, optional <input name="exam" type="date" value="${esc(plan.examDate || '')}"></label>
        <button class="btn-amber sm" type="submit">Rebuild plan</button>
        <p id="ksPlanStatus" role="status">${plan.overflowsExam ? 'This plan runs past the exam date. Reduce the scope or move the date. The calendar is still saved.' : `${plan.days.length} study days · ${plan.totalMinutes} minutes of starter objectives.`}</p>
        <ol class="ks-days">${days}</ol>
      </form>
    </div>
    <section class="ks-card" aria-labelledby="ks-cover">
      <h2 id="ks-cover">Objective coverage</h2>
      <p id="ksReady"><strong>${esc(ready.label)}.</strong> ${esc(ready.summary)}. ${covered.counts['review-due'] ? esc(String(covered.counts['review-due'])) + ' marked review due.' : ''}</p>
      <p class="ks-note">${esc(ready.limitation)}</p>
      <ul class="ks-objectives">${objectives}</ul>
    </section>
    <form class="ks-card" id="ksQuiz" aria-labelledby="ks-quiz-title">
      <h2 id="ks-quiz-title">Formative check</h2>
      <p>Original questions. Explanations appear after you check them. They are not timed and they are not sealed.</p>
      ${questions}
      <button class="btn-amber sm" type="submit">Check answers</button>
      <div id="ksQuizResult" role="status"></div>
    </form>`);
}

function renderResearchHome(state) {
  const topics = ['all', ...new Set(RESEARCH.flatMap(item => item.topics))];
  const cards = RESEARCH.map(item => `<article class="ks-card" data-topics="${esc(item.topics.join(' '))}">
      <p class="ks-kicker">${esc(researchKindLabel(item.kind))}${state.researchRead.includes(item.id) ? ' · read' : ''}</p>
      <h2><a href="#/research/${item.id}">${esc(item.title)}</a></h2>
      <p>${esc(item.summary)}</p>
      <p class="ks-meta">${item.checked ? `Source page checked ${esc(item.checked)}.` : 'Source page not re-fetched for this release.'} ${esc(item.license)}</p>
    </article>`).join('');
  const filters = topics.map((topic, index) => `<button type="button" data-topic="${esc(topic)}" aria-pressed="${index === 0 ? 'true' : 'false'}">${esc(topic)}</button>`).join('');
  return shell('Research vault', 'Curated links and two original fictional cases. External articles stay on their own sites.', '<span>Research</span>', `
    <div class="ks-filters" role="group" aria-label="Filter by topic">${filters}</div>
    <div class="ks-grid" id="ksResearchGrid">${cards}</div>`);
}

function renderResearchItem(item, state) {
  const href = item.url.startsWith('#') ? item.url : item.url;
  const external = item.url.startsWith('http');
  return shell(esc(item.title), esc(researchKindLabel(item.kind)), `<a href="#/research">Research</a> · <span>${esc(item.title)}</span>`, `
    <article class="ks-card">
      <p class="ks-meta">${esc(item.author)} · ${esc(item.publisher)}. ${item.checked ? `Checked ${esc(item.checked)}.` : 'Not re-fetched for this release.'}</p>
      <p>${esc(item.license)}</p>
      <h2>Why it is here</h2>
      <p>${esc(item.happened)}</p>
      <h2>What the source supports</h2>
      <p>${esc(item.evidence)}</p>
      <h2>What is uncertain</h2>
      <p>${esc(item.uncertainty)}</p>
      <h2>Defensive angle</h2>
      <p>${esc(item.defensive)}</p>
      <h2>Check yourself</h2>
      <p>${esc(item.check)}</p>
      <h2>Portfolio prompt</h2>
      <p>${esc(item.portfolio)}</p>
      <p><a href="${esc(href)}"${external ? ' rel="noopener noreferrer"' : ''}>${external ? 'Open the source' : 'Open the related exercise'}</a></p>
      <p>Related skills: ${item.skills.map(id => `<a href="#/skills/${id}">${esc(skillById(id)?.title || id)}</a>`).join(' · ')}</p>
      <button type="button" class="btn-ghost sm" id="ksMarkRead" aria-pressed="${state.researchRead.includes(item.id) ? 'true' : 'false'}">${state.researchRead.includes(item.id) ? 'Marked as read' : 'Mark as read'}</button>
    </article>`);
}

function renderSkills(state, focusId) {
  const focus = focusId ? skillById(focusId) : null;
  const next = explainNext(state.mastered);
  const list = SKILLS.map(skill => `<li>
      <a href="#/skills/${skill.id}"${skill.id === focusId ? ' aria-current="page"' : ''}>${esc(skill.title)}</a>
      <span>${state.mastered.includes(skill.id) ? 'marked done' : 'not marked'}</span>
    </li>`).join('');
  const detail = focus ? `<article class="ks-card">
      <h2>${esc(focus.title)}</h2>
      <p>${esc(focus.outcome)}</p>
      <p>Prerequisites: ${focus.prerequisites.length ? focus.prerequisites.map(id => `<a href="#/skills/${id}">${esc(skillById(id)?.title || id)}</a>`).join(', ') : 'none in this starter graph'}.</p>
      <h3>Lessons</h3>
      <ul>${focus.lessons.map(item => `<li><a href="${lessonHref(item)}">${esc(item.title)}</a></li>`).join('') || '<li>None linked yet.</li>'}</ul>
      <h3>Labs and tools</h3>
      <ul>${focus.labs.map(item => `<li><a href="#/labs/${item.id}">${esc(item.title)}</a></li>`).join('')}${focus.tools.map(item => `<li><a href="#/tools/${item.id}">${esc(item.title)}</a></li>`).join('')}${focus.expertLabs.map(item => `<li><a href="#/expert-labs/${item.id}">${esc(item.title)}</a></li>`).join('') || ''}</ul>
      <h3>Research and objectives</h3>
      <ul>${focus.research.map(id => `<li><a href="#/research/${id}">${esc(researchById(id)?.title || id)}</a></li>`).join('')}</ul>
      <button type="button" class="btn-amber sm" id="ksToggleSkill" aria-pressed="${state.mastered.includes(focus.id) ? 'true' : 'false'}">${state.mastered.includes(focus.id) ? 'Marked done' : 'Mark this skill done'}</button>
    </article>` : `<article class="ks-card"><h2>Pick a skill</h2><p>Open one to see the lesson, lab, tool, research note, and certification objective it supports.</p></article>`;
  return shell('Skills graph', 'A starter map of seven skills. Completing a path still lives in the course. This graph only records what you explicitly mark.', '<span>Skills</span>', `
    <p class="ks-note" id="ksNext">${esc(next.reason)}${next.skill ? ` <a href="#/skills/${next.skill.id}">Open ${esc(next.skill.title)}</a>.` : ''}</p>
    <div class="ks-split">
      <ol class="ks-skill-list">${list}</ol>
      ${detail}
    </div>`);
}

function renderFix(state) {
  const policy = state.fix.policy || VULNERABLE_INVOICE_POLICY;
  const select = (name, options) => `<label>${esc(name)} <select name="${esc(name)}">${options.map(([value, label]) => `<option value="${value}"${policy[name] === value ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>`;
  const grade = state.fix.ran ? gradeInvoicePolicy(policy) : null;
  const results = grade ? `<ol>${grade.results.map(result => `<li>${result.pass ? 'Pass' : 'Not yet'} · ${esc(result.title)}. Expected ${esc(result.expect)}, policy returned ${esc(result.got)}. ${esc(result.why)}</li>`).join('')}</ol><p role="status">${grade.passed ? 'All seven cases passed. The reference policy matches this result. A passing browser fixture still does not prove the real session code is safe.' : `${grade.passedCount} of ${grade.total} cases match. The reference policy stays hidden until they all pass.`}</p>${grade.passed ? `<p>Reference: tenant and role come from the session, owners must match, and support stays in the same tenant.</p>` : ''}` : '<p>Run the cases to see allow and deny results. Expected answers stay hidden until you do.</p>';
  return shell('Fix and verify', 'A fictional invoice API trusts the browser. Repair the policy and run both the allowed and the denied cases.', '<span>Fix & verify</span>', `
    <div class="ks-split">
      <form class="ks-card" id="ksFix">
        <h2>Policy</h2>
        <p>Inactive actors are always denied. The four choices below are the ones students get wrong.</p>
        ${select('tenantSource', [['query', 'Tenant from the query string'], ['session', 'Tenant from the trusted session']])}
        ${select('roleSource', [['query', 'Role from the query string'], ['session', 'Role from the trusted session']])}
        ${select('ownerCheck', [['none', 'Any logged-in user in the tenant'], ['match-user', 'Owner must match, unless support']])}
        ${select('supportScope', [['any-tenant', 'Support may read every tenant'], ['same-tenant', 'Support stays in its own tenant']])}
        <button class="btn-amber sm" type="submit">Run cases</button>
        <div id="ksFixResult">${results}</div>
      </form>
      <form class="ks-card" id="ksNotes">
        <h2>Case note</h2>
        <p>Saved only in this browser. Say what was wrong, what you changed, and what a production review would still need.</p>
        <label>Notes <textarea name="notes" rows="8">${esc(state.fix.notes || '')}</textarea></label>
        <button class="btn-ghost sm" type="submit">Save note</button>
        <p id="ksNoteStatus" role="status"></p>
        <p><a href="#/expert-labs/tenant-boundary">Open the expert case with the downloadable Python exercise</a></p>
        <p><a href="#/lesson/21-api-security/bola-and-bfla">Read object-level authorization</a></p>
        <p><a href="#/research/kashsec-invoice-boundary">Read the case card</a></p>
      </form>
    </div>`);
}

export function renderStudio(root, hash) {
  const state = loadState();
  const parts = hash.replace(/^#\//, '').split('/');
  const section = parts[0];
  const id = parts[1] ? decodeURIComponent(parts[1]) : '';
  let title = 'KashSec studio';
  if (section === 'certlab' && !id) {
    root.innerHTML = renderCertHome();
    title = 'Certification prep · KashSec Academy';
  } else if (section === 'certlab') {
    const track = trackById(id);
    if (!track) root.innerHTML = shell('Plan not found', 'That certification plan is not in this starter set.', `<a href="#/certlab">Cert prep</a>`, '<p><a href="#/certlab">Back to the three plans</a></p>');
    else {
      root.innerHTML = renderCertTrack(track, state);
      title = `${track.name} prep · KashSec Academy`;
      wireCert(root, track);
    }
  } else if (section === 'research' && !id) {
    root.innerHTML = renderResearchHome(state);
    title = 'Research vault · KashSec Academy';
    wireResearchFilters(root);
  } else if (section === 'research') {
    const item = researchById(id);
    if (!item) root.innerHTML = shell('Source not found', 'That card is not in the vault.', `<a href="#/research">Research</a>`, '<p><a href="#/research">Back to the vault</a></p>');
    else {
      root.innerHTML = renderResearchItem(item, state);
      title = `${item.title} · Research vault`;
      root.querySelector('#ksMarkRead')?.addEventListener('click', () => {
        const next = loadState();
        const has = next.researchRead.includes(item.id);
        next.researchRead = has ? next.researchRead.filter(entry => entry !== item.id) : next.researchRead.concat(item.id);
        saveState(next);
        renderStudio(root, hash);
      });
    }
  } else if (section === 'skills') {
    if (id && !skillById(id)) root.innerHTML = shell('Skill not found', 'That skill is outside the starter graph.', `<a href="#/skills">Skills</a>`, '<p><a href="#/skills">Back to the graph</a></p>');
    else {
      root.innerHTML = renderSkills(state, id);
      title = 'Skills graph · KashSec Academy';
      root.querySelector('#ksToggleSkill')?.addEventListener('click', () => {
        const skill = skillById(id);
        const next = loadState();
        next.mastered = next.mastered.includes(skill.id) ? next.mastered.filter(entry => entry !== skill.id) : next.mastered.concat(skill.id);
        saveState(next);
        renderStudio(root, hash);
      });
    }
  } else if (section === 'fix-verify') {
    root.innerHTML = renderFix(state);
    title = 'Fix and verify · KashSec Academy';
    wireFix(root);
  } else {
    root.innerHTML = shell('Studio', 'Choose a section.', '<span>Studio</span>', '<p><a href="#/certlab">Cert prep</a></p>');
  }
  document.title = title;
}

function wireCert(root, track) {
  root.querySelector('#ksPlan')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const plan = buildStudyPlan(track, {
      today: todayISO(),
      minutesPerDay: data.get('minutes'),
      start: String(data.get('start') || ''),
      examDate: String(data.get('exam') || '')
    });
    const next = loadState();
    next.plans[track.id] = plan;
    saveState(next);
    renderStudio(root, `#/certlab/${track.id}`);
  });
  root.querySelectorAll('[data-objective]').forEach(select => {
    select.addEventListener('change', () => {
      const next = loadState();
      next.objectiveStatus[track.id] = { ...(next.objectiveStatus[track.id] || {}), [select.dataset.objective]: select.value };
      saveState(next);
      const ready = readinessLabel(track, next.objectiveStatus[track.id], next.answers[track.id] || {});
      const node = root.querySelector('#ksReady');
      if (node) node.textContent = `${ready.label}. ${ready.summary}.`;
    });
  });
  root.querySelector('#ksQuiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = {};
    for (const question of track.questions) {
      const value = data.get(question.id);
      if (value !== null) answers[question.id] = Number(value);
    }
    const next = loadState();
    next.answers[track.id] = { ...(next.answers[track.id] || {}), ...answers };
    const result = scoreTrack(track, next.answers[track.id]);
    if (result.missed.length === 0) {
      next.objectiveStatus[track.id] = { ...(next.objectiveStatus[track.id] || {}) };
      for (const objective of track.objectives) {
        if ((next.objectiveStatus[track.id][objective.id] || 'not-started') === 'not-started') {
          next.objectiveStatus[track.id][objective.id] = 'practiced';
        }
      }
    }
    saveState(next);
    const host = root.querySelector('#ksQuizResult');
    const details = result.missed.map(item => `<li>${esc(track.questions.find(question => question.id === item.id)?.prompt || item.id)} — ${esc(item.explanation)}</li>`).join('');
    host.innerHTML = `<p><strong>${result.correct} of ${result.total} correct.</strong> This is a formative score stored in this browser.</p>${details ? `<ul>${details}</ul>` : '<p>Every answer matched. You can still reread the lessons. This is not a vendor score.</p>'}`;
  });
}

function wireResearchFilters(root) {
  const buttons = [...root.querySelectorAll('[data-topic]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(other => other.setAttribute('aria-pressed', other === button ? 'true' : 'false'));
    const topic = button.dataset.topic;
    root.querySelectorAll('#ksResearchGrid article').forEach(card => {
      card.hidden = topic !== 'all' && !card.dataset.topics.split(' ').includes(topic);
    });
  }));
}

function wireFix(root) {
  root.querySelector('#ksFix')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = loadState();
    next.fix.policy = {
      tenantSource: String(data.get('tenantSource')),
      roleSource: String(data.get('roleSource')),
      ownerCheck: String(data.get('ownerCheck')),
      supportScope: String(data.get('supportScope'))
    };
    next.fix.ran = true;
    if (gradeInvoicePolicy(next.fix.policy).passed && !next.mastered.includes('web.authz.object-level')) {
      next.mastered.push('web.authz.object-level');
    }
    saveState(next);
    renderStudio(root, '#/fix-verify');
  });
  root.querySelector('#ksNotes')?.addEventListener('submit', event => {
    event.preventDefault();
    const next = loadState();
    next.fix.notes = String(new FormData(event.currentTarget).get('notes') || '').slice(0, 5000);
    saveState(next);
    const status = root.querySelector('#ksNoteStatus');
    if (status) status.textContent = 'Note saved in this browser.';
  });
}

export { SECURE_INVOICE_POLICY };
