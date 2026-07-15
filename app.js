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

function route() {
  const hash = location.hash || '#/';
  console.log('%c[KashSec] route()', 'color:#60a5fa', hash);
  
  if (hash === '#/' || hash === '#') {
    renderHome();
  } 
  else if (hash.startsWith('#/lesson/')) {
    const parts = hash.replace('#/lesson/', '').split('/');
    console.log('%c[KashSec] route parts', 'color:#60a5fa', parts);
    if (parts.length === 1) {
      renderPathOverview(parts[0]);
    } else {
      // For now just show path overview
      renderPathOverview(parts[0]);
    }
  } else {
    // Unknown hash: fall back to home
    renderHome();
  }
}

// Debug: log clicks on anchors and make sure route runs for hash navigation
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  console.log('%c[KashSec] anchor click', 'color:#a78bfa', href);
  // If the link is an in-page hash route, ensure route runs after navigation
  if (href.startsWith('#/')) {
    // allow default browser behavior to change the hash, but also call route() just in case
    setTimeout(route, 0);
  }
});

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('hashchange', route);

console.log('%c[KashSec] Basic working version loaded', 'color:#22c55e');
