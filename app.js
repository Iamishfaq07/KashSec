/* KashSec Academy — Full Router & Lesson Loader */

const COURSE_STRUCTURE = {
  '00-fresher-basics': { title: 'Fresher Basics', lessons: [] },
  '01-introduction': { title: 'Introduction', lessons: [] },
  '02-networking': { title: 'Networking', lessons: [] },
  '03-linux': { title: 'Linux', lessons: [] },
  '04-python': { title: 'Python', lessons: [] },
  '05-web-basics': { title: 'Web Basics', lessons: [] },
  '06-fundamentals': { title: 'Fundamentals', lessons: [] },
  '07-web-security': { title: 'Web Security', lessons: [] },
  '08-network-security': { title: 'Network Security', lessons: [] },
  '09-ethical-hacking': { title: 'Ethical Hacking', lessons: [] },
  '10-bug-bounty': { title: 'Bug Bounty', lessons: [] },
  '11-advanced': { title: 'Advanced', lessons: [] },
  '12-ai-security': { title: 'AI Security', lessons: [] },
  '13-career-prep': { title: 'Career Prep', lessons: [] }
};

let courseMeta = null;
let currentPath = '';
let currentLesson = '';

// Initialize course metadata
async function initCourse() {
  try {
    const promises = Object.keys(COURSE_STRUCTURE).map(pathId =>
      fetch(`course/${pathId}/`)
        .then(r => r.text())
        .then(html => parseLessonList(html, pathId))
        .catch(() => [])
    );
    
    const results = await Promise.all(promises);
    results.forEach((lessons, idx) => {
      const pathId = Object.keys(COURSE_STRUCTURE)[idx];
      COURSE_STRUCTURE[pathId].lessons = lessons;
    });
    
    courseMeta = true;
  } catch (e) {
    console.error('Failed to init course:', e);
  }
}

// Parse lesson list from directory HTML
function parseLessonList(html, pathId) {
  const lessons = [];
  const links = html.match(/href="[^"]*\.md"/g) || [];
  
  links.forEach((link, i) => {
    const filename = link.match(/href="([^"]*)\.md"/)[1];
    const slug = filename.replace(/\s+/g, '-').toLowerCase();
    const title = filename.replace(/\.md$/, '').replace(/-/g, ' ').replace(/^\d+-/, '');
    
    lessons.push({
      id: String(i + 1).padStart(2, '0'),
      slug,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      path: `course/${pathId}/${filename}.md`
    });
  });
  
  return lessons;
}

// Fetch and render home page
async function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">
          <span>🛡️ KASHSEC ACADEMY</span>
        </div>
        <h1>Learn <span class="amber">Cybersecurity</span> from Zero to Hero</h1>
        <p class="hero-sub">A completely free cybersecurity course for absolute beginners — from 'what is a network?' to advanced hacking and AI security. 13 paths, 110+ lessons.</p>
        <div class="hero-btns">
          <a href="#/course" class="btn-amber">Start Learning</a>
          <a href="#/faq" class="btn-ghost">Learn More</a>
        </div>
        <div class="hero-stats">
          <div>
            <div class="hstat-n">13</div>
            <div class="hstat-l">Learning Paths</div>
          </div>
          <div>
            <div class="hstat-n">110+</div>
            <div class="hstat-l">Lessons</div>
          </div>
          <div>
            <div class="hstat-n">100%</div>
            <div class="hstat-l">Free Forever</div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">Why KashSec?</div>
        <h2>Built for Beginners</h2>
      </div>
      <div class="features">
        <div class="feature-card">
          <div class="feature-ico">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <h3>Hands-On Learning</h3>
          <p>Labs, challenges, and practical exercises throughout every path.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-ico">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          </div>
          <h3>Structured Paths</h3>
          <p>Follow our curated learning paths or choose your own adventure.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-ico">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <h3>Always Free</h3>
          <p>No paywalls, no subscriptions, no strings attached.</p>
        </div>
      </div>
    </section>
  `;
  
  updateNav('#/');
}

// Fetch and render course overview
async function renderCourse() {
  const app = document.getElementById('app');
  
  const pathCards = Object.entries(COURSE_STRUCTURE)
    .map(([id, path], idx) => `
      <a href="#/path/${id}" class="path-card">
        <div class="path-num">PATH ${String(idx).padStart(2, '0')}</div>
        <div class="path-title">${path.title}</div>
        <div class="path-desc">Master the fundamentals and build real skills.</div>
        <div class="path-meta">${path.lessons.length} lessons</div>
      </a>
    `)
    .join('');
  
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <h2>All Learning Paths</h2>
        <p class="sec-lead">Choose a path that interests you, or follow them in order. Each path builds on core concepts while remaining self-contained.</p>
      </div>
      <div class="paths">
        ${pathCards}
      </div>
    </section>
  `;
  
  updateNav('#/course');
}

// Fetch and render path overview
async function renderPathOverview(pathId) {
  const app = document.getElementById('app');
  const path = COURSE_STRUCTURE[pathId];
  
  if (!path) {
    renderNotFound();
    return;
  }
  
  // Fetch lessons if not cached
  if (path.lessons.length === 0) {
    try {
      const res = await fetch(`course/${pathId}/`);
      const html = await res.text();
      path.lessons = parseLessonList(html, pathId);
    } catch (e) {
      console.error('Failed to load path:', e);
    }
  }
  
  const sublesson = path.lessons
    .map((lesson, i) => `
      <a href="#/lesson/${pathId}/${lesson.slug}" class="sublesson-card">
        <div class="sl-n">${lesson.id}</div>
        <div class="sl-body">
          <div class="sl-t">${lesson.title}</div>
          <div class="sl-d">Start learning</div>
        </div>
        <div class="sl-arrow">→</div>
      </a>
    `)
    .join('');
  
  app.innerHTML = `
    <div class="reader-wrap">
      <div class="sidebar">
        <div class="sb-head">Lessons</div>
        <ul class="sb-list">
          ${path.lessons.map((l, i) => `
            <li><a href="#/lesson/${pathId}/${l.slug}" class="sb-list-item">
              <span class="n">${l.id}</span>
              <span>${l.title}</span>
            </a></li>
          `).join('')}
        </ul>
      </div>
      <div class="reader">
        <div class="path-overview">
          <h1>${path.title}</h1>
          <p class="lead">Start your journey through this learning path. Complete lessons at your own pace.</p>
          <div class="sublesson-grid">
            ${sublesson}
          </div>
        </div>
      </div>
    </div>
  `;
  
  updateNav('#/course');
}

// Fetch and render lesson
async function renderLesson(pathId, lessonSlug) {
  const app = document.getElementById('app');
  const path = COURSE_STRUCTURE[pathId];
  
  if (!path) {
    renderNotFound();
    return;
  }
  
  // Find lesson
  let lesson = path.lessons.find(l => l.slug === lessonSlug);
  
  if (!lesson) {
    renderNotFound();
    return;
  }
  
  try {
    const res = await fetch(lesson.path);
    if (!res.ok) throw new Error('Not found');
    
    const md = await res.text();
    const html = marked.parse(md);
    
    // Build sidebar with all lessons
    const sidebarHtml = Object.entries(COURSE_STRUCTURE)
      .map(([pid, p]) => {
        const isActive = pid === pathId;
        const isOpen = pid === pathId;
        
        return `
          <div class="sb-path ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}">
            <button class="sb-path-head">
              <span class="n">${Object.keys(COURSE_STRUCTURE).indexOf(pid).toString().padStart(2, '0')}</span>
              <span class="name">${p.title}</span>
              <span class="chev">›</span>
            </button>
            <ul class="sb-sublist">
              ${p.lessons.map(l => `
                <li><a href="#/lesson/${pid}/${l.slug}" class="${(pid === pathId && l.slug === lessonSlug) ? 'active' : ''}">
                  ${l.title}
                </a></li>
              `).join('')}
            </ul>
          </div>
        `;
      })
      .join('');
    
    // Find prev/next lessons
    const currentIdx = path.lessons.findIndex(l => l.slug === lessonSlug);
    const prevLesson = currentIdx > 0 ? path.lessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < path.lessons.length - 1 ? path.lessons[currentIdx + 1] : null;
    
    let navHtml = '<div class="reader-nav">';
    if (prevLesson) {
      navHtml += `<a href="#/lesson/${pathId}/${prevLesson.slug}" class="btn-ghost">← ${prevLesson.title}</a>`;
    }
    if (nextLesson) {
      navHtml += `<a href="#/lesson/${pathId}/${nextLesson.slug}" class="btn-ghost">${nextLesson.title} →</a>`;
    }
    navHtml += '</div>';
    
    app.innerHTML = `
      <div class="reader-wrap">
        <div class="sidebar">
          <div class="sb-head">Paths</div>
          ${sidebarHtml}
        </div>
        <div class="reader">
          <div class="reader-nav-top">
            <div class="reader-crumb">${path.title} / ${lesson.title}</div>
          </div>
          <div class="md">
            ${html}
          </div>
          ${navHtml}
        </div>
      </div>
    `;
    
    // Re-initialize mermaid diagrams if present
    if (window.mermaid) {
      try {
        mermaid.contentLoaded();
      } catch (e) {
        console.log('Mermaid init:', e);
      }
    }
    
    updateNav('#/course');
  } catch (e) {
    console.error('Failed to load lesson:', e);
    renderNotFound();
  }
}

// Render FAQ page
async function renderFAQ() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <h2>Frequently Asked Questions</h2>
        <p class="sec-lead">Got questions? We've got answers.</p>
      </div>
      <div class="faq">
        <div class="faq-item">
          <button class="faq-q">
            <span>Is KashSec really free?</span>
            <span class="faq-chev">›</span>
          </button>
          <div class="faq-a">
            <p>Yes, completely free. No hidden paywalls, no premium tiers, no "catch." We believe cybersecurity education should be accessible to everyone.</p>
          </div>
        </div>
        
        <div class="faq-item">
          <button class="faq-q">
            <span>Do I need any prior coding experience?</span>
            <span class="faq-chev">›</span>
          </button>
          <div class="faq-a">
            <p>Nope. We start from absolute zero. Path 00 covers computer basics for complete freshers. If you can use the internet, you can learn cybersecurity with KashSec.</p>
          </div>
        </div>
        
        <div class="faq-item">
          <button class="faq-q">
            <span>How long does it take to complete?</span>
            <span class="faq-chev">›</span>
          </button>
          <div class="faq-a">
            <p>That depends on your pace. Most people spend 3–6 months going through all paths if they dedicate 5–10 hours per week. You can go faster or slower—there's no deadline.</p>
          </div>
        </div>
        
        <div class="faq-item">
          <button class="faq-q">
            <span>Will this get me a job?</span>
            <span class="faq-chev">›</span>
          </button>
          <div class="faq-a">
            <p>It's a solid foundation. We cover industry fundamentals, real tools, and hands-on labs. Path 13 (Career Prep) shows you how to build a portfolio and land interviews.</p>
          </div>
        </div>
        
        <div class="faq-item">
          <button class="faq-q">
            <span>Can I download the course?</span>
            <span class="faq-chev">›</span>
          </button>
          <div class="faq-a">
            <p>The entire course is open source on GitHub. Clone the repo and run it locally with <code>python3 -m http.server 8000</code>.</p>
          </div>
        </div>
      </div>
    </section>
  `;
  
  attachFAQHandlers();
  updateNav('#/faq');
}

// Render careers page
async function renderCareers() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <h2>Career Paths in Cybersecurity</h2>
        <p class="sec-lead">Your KashSec foundation opens doors to these roles and beyond.</p>
      </div>
      <div class="careers">
        <div class="career-card">
          <h3>Security Analyst</h3>
          <p>Monitor networks, detect threats, and respond to incidents. Perfect entry point for beginners.</p>
          <div class="career-follow">Learn: <span>Networking, Web Security, Tools</span></div>
        </div>
        
        <div class="career-card">
          <h3>Ethical Hacker (CEH)</h3>
          <p>Authorized penetration testing. Test security, find vulnerabilities before the bad guys do.</p>
          <div class="career-follow">Learn: <span>All paths (esp. 09 & 10)</span></div>
        </div>
        
        <div class="career-card">
          <h3>SIEM Analyst</h3>
          <p>Manage security information and event management systems. High-demand, well-paid role.</p>
          <div class="career-follow">Learn: <span>Networking, Fundamentals, Tools</span></div>
        </div>
        
        <div class="career-card">
          <h3>Bug Bounty Hunter</h3>
          <p>Find vulnerabilities in web apps and get paid. Flexible, independent, lucrative.</p>
          <div class="career-follow">Learn: <span>Web Security, Bug Bounty</span></div>
        </div>
        
        <div class="career-card">
          <h3>Security Architect</h3>
          <p>Design secure systems from the ground up. Leadership role, big picture thinking.</p>
          <div class="career-follow">Learn: <span>All paths</span></div>
        </div>
        
        <div class="career-card">
          <h3>AI/ML Security Specialist</h3>
          <p>Emerging role: secure AI systems, detect adversarial attacks, build safe models.</p>
          <div class="career-follow">Learn: <span>AI Security, Python</span></div>
        </div>
      </div>
    </section>
  `;
  
  updateNav('#/careers');
}

// Render 404 page
function renderNotFound() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="sec" style="text-align: center; padding: 6rem 2rem;">
      <h2>Page Not Found</h2>
      <p style="color: var(--muted);">Oops! This page doesn't exist.</p>
      <a href="#/" class="btn-amber" style="margin-top: 1.5rem;">Back to Home</a>
    </section>
  `;
}

// Attach FAQ click handlers
function attachFAQHandlers() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
    });
  });
}

// Update nav active state
function updateNav(hash) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.href.endsWith(hash) || (hash === '#/' && a.href.endsWith('#/'))) {
      a.classList.add('active');
    }
  });
}

// Main router
async function route() {
  const hash = window.location.hash.slice(1) || '/';
  
  // Parse hash
  const [, route, ...params] = hash.split('/').filter(Boolean);
  
  // Close mobile menu if open
  const navLinks = document.getElementById('navLinks');
  if (navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
  }
  
  // Route
  if (route === 'lesson' && params[0] && params[1]) {
    await renderLesson(params[0], params[1]);
  } else if (route === 'path' && params[0]) {
    await renderPathOverview(params[0]);
  } else if (route === 'course') {
    await renderCourse();
  } else if (route === 'faq') {
    await renderFAQ();
  } else if (route === 'careers') {
    await renderCareers();
  } else {
    await renderHome();
  }
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamb = document.getElementById('hamb');
  const navLinks = document.getElementById('navLinks');
  
  if (hamb) {
    hamb.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamb.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }
});

// Scroll event for nav styling
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const nav = document.getElementById('siteNav');
      if (nav) {
        if (window.scrollY > 10) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Route on hash change
window.addEventListener('hashchange', route);

// Initial load
window.addEventListener('load', async () => {
  await initCourse();
  await route();
});

console.log('%c[KashSec] Router initialized ✓', 'color:#10b981;font-weight:bold');
