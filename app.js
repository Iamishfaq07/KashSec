/* KashSec Academy - Minimal Working Version */

// Guard access to the year element so a missing #year doesn't throw and stop the script
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const PATHS = [
  {
    n: "00",
    id: "00-fresher-basics",
    title: "Computer Basics & Security Mindset",
    level: "Absolute fresher",
    desc: "For complete beginners.",
    subs: [
      { n: "1", id: "what-is-a-computer", title: "What is a computer really?", desc: "Hardware, software, OS." },
      { n: "2", id: "how-internet-works", title: "How the internet works", desc: "From your phone to the world." }
    ]
  }
];

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
  app.innerHTML = `
    <section class="sec">
      <h1>${path.title}</h1>
      <p>${path.desc}</p>
      
      <div class="sublesson-grid">
        ${path.subs.map(s => `
          <a href="#/lesson/${path.id}/${s.id}" class="sublesson-card">
            <div>${path.n}.${s.n} · ${s.title}</div>
            <div>${s.desc}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLesson(pathId, lessonId) {
  const path = PATHS.find(p => p.id === pathId);
  if (!path) return renderHome();
  const lesson = path.subs.find(s => s.id === lessonId);
  if (!lesson) return renderPathOverview(pathId);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <section class="sec">
      <a class="back-link" href="#/lesson/${path.id}">← Back to ${path.title}</a>
      <h1>${lesson.title}</h1>
      <p>${lesson.desc}</p>

      <article class="lesson-content">
        <p>(Lesson content not yet available — this is a placeholder.)</p>
        <pre><code>// You can author markdown content for lessons and render it with marked.js</code></pre>
      </article>
    </section>
  `;
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
        // render the specific lesson when path and lesson id are present
        renderLesson(parts[0], parts[1]);
      }
    } else {
      // Unknown hash: fall back to home
      renderHome();
    }
  } catch (err) {
    console.error('[KashSec] route error', err);
  }
}

// Robust click handler for in-page anchors
// This prevents other scripts or CSS from blocking navigation and ensures route() runs.
document.addEventListener('click', (e) => {
  // find closest anchor
  const a = e.target.closest ? e.target.closest('a') : null;
  if (!a) return;

  const href = a.getAttribute('href');
  if (!href) return;

  // ignore external links and mailto links
  if (/^(https?:|mailto:|tel:)/.test(href)) return;

  // if internal route link starting with #/
  if (href.startsWith('#/')) {
    // Prevent any other script from stopping the navigation by taking control here
    e.preventDefault();

    if (location.hash !== href) {
      // update the hash (this triggers hashchange normally)
      location.hash = href;
      // ensure route runs if hashchange is ignored for any reason
      setTimeout(route, 0);
    } else {
      // same-hash clicked — force route
      route();
    }
    return;
  }

  // allow normal behavior for other anchors (including fragment links like #app)
});

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('hashchange', route);

console.log('%c[KashSec] Basic working version loaded', 'color:#22c55e');
