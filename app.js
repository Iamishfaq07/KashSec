/* KashSec Academy - Minimal Working Version (improved) */

// Safe year fill
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Basic course structure (expanded). Add more paths/subs as files are authored.
const PATHS = [
  {
    n: "00",
    id: "00-fresher-basics",
    title: "Computer Basics & Security Mindset",
    level: "Absolute fresher",
    desc: "For complete beginners.",
    subs: [
      { n: "1", id: "what-is-a-computer", title: "What is a computer really?", desc: "Hardware, software, OS." },
      { n: "2", id: "how-internet-works", title: "How the internet works", desc: "From your phone to the world." },
      { n: "3", id: "files-folders-you", title: "Files, folders & you", desc: "Where your data lives." },
      { n: "4", id: "how-to-learn-tech", title: "How to learn tech", desc: "Study habits and practice." },
      { n: "5", id: "passwords-accounts", title: "Passwords & accounts", desc: "Keep access safe." },
      { n: "6", id: "staying-safe-online", title: "Staying safe online", desc: "Basic online safety." }
    ]
  },
  { n: "01", id: "01-introduction", title: "Introduction", level: "Beginner", desc: "Orientation & roadmap.", subs: [] },
  { n: "02", id: "02-networking", title: "Networking Basics", level: "Beginner", desc: "How networks work.", subs: [] },
  { n: "03", id: "03-linux", title: "Linux Essentials", level: "Beginner", desc: "Command line & system basics.", subs: [] },
  { n: "04", id: "04-python", title: "Python for Security", level: "Beginner", desc: "Scripting for automation.", subs: [] },
  { n: "05", id: "05-web-basics", title: "Web Basics", level: "Beginner", desc: "HTTP, browsers, HTML.", subs: [] },
  { n: "06", id: "06-fundamentals", title: "Security Fundamentals", level: "Intermediate", desc: "Threats & defenses.", subs: [] },
  { n: "07", id: "07-web-security", title: "Web Security", level: "Intermediate", desc: "OWASP & testing.", subs: [] },
  { n: "08", id: "08-network-security", title: "Network Security", level: "Intermediate", desc: "Firewalls, IDS/IPS.", subs: [] },
  { n: "09", id: "09-ethical-hacking", title: "Ethical Hacking", level: "Advanced", desc: "Pentesting basics.", subs: [] },
  { n: "10", id: "10-bug-bounty", title: "Bug Bounty", level: "Advanced", desc: "Report vulnerabilities.", subs: [] },
  { n: "11", id: "11-advanced", title: "Advanced topics", level: "Advanced", desc: "Deep dives.", subs: [] },
  { n: "12", id: "12-ai-security", title: "AI & Security", level: "Advanced", desc: "Securing models.", subs: [] },
  { n: "13", id: "13-career-prep", title: "Career Prep", level: "All", desc: "Getting hired.", subs: [] }
];

function setLoadingHTML(app, message = 'Loading…') {
  if (!app) return;
  app.innerHTML = `<div class="loading">${message}</div>`;
}

function renderHome() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <section class="sec">
      <h1>Welcome to KashSec</h1>
      <p>Site is being restored. Click below to explore.</p>
      
      <div class="paths">
        ${PATHS.map(p => `
          <a href="#/lesson/${p.id}" class="path-card">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCourse() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <section class="sec">
      <h1>All paths</h1>
      <p>Overview of all available learning paths.</p>
      <div class="paths">
        ${PATHS.map(p => `
          <a href="#/lesson/${p.id}" class="path-card">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCareers() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <section class="sec">
      <h1>Careers</h1>
      <p>Information about careers after completing the course.</p>
    </section>
  `;
}

function renderFAQ() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <section class="sec">
      <h1>FAQ</h1>
      <p>Frequently asked questions.</p>
    </section>
  `;
}

function renderPathOverview(pathId) {
  const path = PATHS.find(p => p.id === pathId);
  if (!path) return renderHome();

  const app = document.getElementById('app');
  if (!app) return;

  // If subs are empty, show a placeholder that lessons will be listed when authored
  const subsHTML = (path.subs && path.subs.length)
    ? path.subs.map(s => `
        <a href="#/lesson/${path.id}/${s.id}" class="sublesson-card">
          <div>${path.n}.${s.n} · ${s.title}</div>
          <div>${s.desc}</div>
        </a>
      `).join('')
    : '<div class="empty">Lessons coming soon.</div>';

  app.innerHTML = `
    <section class="sec">
      <h1>${path.title}</h1>
      <p>${path.desc}</p>
      
      <div class="sublesson-grid">
        ${subsHTML}
      </div>
    </section>
  `;
}

function renderLesson(pathId, lessonId) {
  const path = PATHS.find(p => p.id === pathId);
  if (!path) return renderHome();

  const app = document.getElementById('app');
  if (!app) return;

  setLoadingHTML(app, 'Loading lesson…');

  // Attempt to fetch markdown file for the lesson and render using marked.js
  const mdPath = `course/${pathId}/${lessonId}.md`;
  fetch(mdPath).then(res => {
    if (!res.ok) throw new Error('Lesson not found');
    return res.text();
  }).then(md => {
    const html = (typeof marked !== 'undefined') ? marked.parse(md) : `<pre>${md.replace(/</g,'&lt;')}</pre>`;
    app.innerHTML = `
      <section class="sec lesson">
        <a class="back-link" href="#/lesson/${path.id}">← Back to ${path.title}</a>
        <h1>${lessonId.replace(/-/g,' ')}</h1>
        <div class="lesson-content">${html}</div>
      </section>
    `;
    // move focus for accessibility
    const first = app.querySelector('h1'); if (first) first.focus && first.focus();
  }).catch(err => {
    app.innerHTML = `
      <section class="sec">
        <a class="back-link" href="#/lesson/${path.id}">← Back to ${path.title}</a>
        <h1>Lesson not found</h1>
        <p>We couldn't load this lesson (${lessonId}). It may not be authored yet.</p>
      </section>
    `;
    console.warn('[KashSec] failed to fetch lesson', mdPath, err);
  });
}

function route() {
  try {
    const hash = location.hash || '#/';
    console.log('%c[KashSec] route()', 'color:#60a5fa', hash);

    if (hash === '#/' || hash === '#') {
      renderHome();
    } else if (hash === '#/course') {
      renderCourse();
    } else if (hash === '#/careers') {
      renderCareers();
    } else if (hash === '#/faq') {
      renderFAQ();
    } else if (hash.startsWith('#/lesson/')) {
      const parts = hash.replace('#/lesson/', '').split('/');
      console.log('%c[KashSec] route parts', 'color:#60a5fa', parts);
      if (parts.length === 1) {
        renderPathOverview(parts[0]);
      } else if (parts.length >= 2) {
        renderLesson(parts[0], parts[1]);
      }
    } else {
      renderHome();
    }
  } catch (err) {
    console.error('[KashSec] route error', err);
  }
}

// Robust click handler for in-page anchors
document.addEventListener('click', (e) => {
  const a = e.target.closest ? e.target.closest('a') : null;
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (/^(https?:|mailto:|tel:)/.test(href)) return;
  if (href.startsWith('#/')) {
    e.preventDefault();
    if (location.hash !== href) {
      location.hash = href;
      setTimeout(route, 0);
    } else {
      route();
    }
    return;
  }
});

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('hashchange', route);

console.log('%c[KashSec] Basic working version loaded', 'color:#22c55e');
