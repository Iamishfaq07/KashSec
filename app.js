/* KashSec Academy — client-side SPA
   Hash routing so it works on GitHub Pages without server config.
   Loads markdown files from ./course/ and renders with marked. */

document.getElementById('year').textContent = new Date().getFullYear();

/* --- Content metadata --- */
const PATHS = [
  {n:"01", id:"01-introduction",    title:"Introduction to Cybersecurity", level:"Absolute beginner", lessons:5,  desc:"What security is, why it matters, hacker types, the law, how to actually learn."},
  {n:"02", id:"02-networking",      title:"Networking Fundamentals",       level:"Beginner",          lessons:8,  desc:"Networks, IP, ports, packets, TCP/UDP, DNS, HTTP/HTTPS — the bedrock."},
  {n:"03", id:"03-linux",           title:"Operating Systems & Linux",     level:"Beginner",          lessons:11, desc:"Install Kali in VirtualBox, then a full tour of the Linux command line."},
  {n:"04", id:"04-python",          title:"Programming & Python",          level:"Beginner",          lessons:9,  desc:"Programming from zero, then Python — build a real password-strength checker."},
  {n:"05", id:"05-web-basics",      title:"How the Web Works",             level:"Beginner",          lessons:7,  desc:"Requests, HTML/CSS/JS, client/server, cookies, APIs, DevTools."},
  {n:"06", id:"06-fundamentals",    title:"Cybersecurity Fundamentals",    level:"Beginner→Intermediate", lessons:8, desc:"CIA triad, risk, malware, hashing, phishing, MFA, frameworks."},
  {n:"07", id:"07-web-security",    title:"Web Security & Hacking",        level:"Intermediate",      lessons:9,  desc:"OWASP Top 10, Burp, IDOR, XSS, SQLi, command injection, SSRF, JWT."},
  {n:"08", id:"08-network-security",title:"Network Security",              level:"Intermediate",      lessons:8,  desc:"Nmap, Wireshark, firewalls, VPNs, IDS/IPS, Wi-Fi attacks, MITM."},
  {n:"09", id:"09-ethical-hacking", title:"Ethical Hacking",               level:"Intermediate→Advanced", lessons:8, desc:"The 5-phase methodology, from reconnaissance through reporting."},
  {n:"10", id:"10-bug-bounty",      title:"Bug Bounty",                    level:"Intermediate→Advanced", lessons:8, desc:"Programs, recon pipelines, hunting IDOR & logic bugs, reports that pay."},
  {n:"11", id:"11-advanced",        title:"Advanced Cyber Topics",         level:"Advanced",          lessons:8,  desc:"Linux/Windows privesc, Active Directory, cloud, containers, malware, DFIR."},
  {n:"12", id:"12-ai-security",     title:"AI & AI Security",              level:"Advanced",          lessons:8,  desc:"How LLMs work, prompt injection, OWASP LLM Top 10, AI red teaming."}
];

const CAREERS = [
  {role:"SOC Analyst",             desc:"Watch for and respond to attacks in real time.", follow:"02 → 06 → 08"},
  {role:"Penetration Tester",      desc:"Legally break into systems and report how.",     follow:"03 → 09 → 07"},
  {role:"AppSec Engineer",         desc:"Help developers ship safe software.",             follow:"04 → 05 → 07"},
  {role:"Bug Bounty Hunter",       desc:"Find bugs in real companies for cash rewards.",   follow:"05 → 07 → 10"},
  {role:"Cloud Security Engineer", desc:"Secure AWS, Azure, and Google Cloud.",            follow:"06 → 11"},
  {role:"Digital Forensics / IR",  desc:"Investigate incidents and evict attackers.",      follow:"03 → 08 → 11"},
  {role:"AI Red Teamer",           desc:"Adversarially test AI systems for safety flaws.", follow:"05 → 07 → 12"},
  {role:"Security / GRC Analyst",  desc:"Manage risk, policy, and compliance strategy.",   follow:"01 → 06"}
];

const FAQS = [
  {q:"I have zero experience. Can I really do this?", a:"Yes — the course is built exactly for you. Start at lesson one and go in order. Every term is explained in plain words with everyday examples, and nothing is assumed."},
  {q:"Is it really free?", a:"Completely. Every lesson stays free forever. No card, no paywall, no upsell."},
  {q:"Do I need to buy anything or have a powerful computer?", a:"No. You'll install free software (VirtualBox + Kali Linux) that runs on a normal laptop. If your machine is very old, free browser labs like TryHackMe still let you practise everything."},
  {q:"Is any of this illegal?", a:"Not the way we teach it. You only ever practise on your own lab, on free legal training sites, or on programs that invite testing. Path 01 covers the legal golden rule in detail."},
  {q:"How should I go through the course?", a:"Top to bottom, in order. Each path builds on the one before. Do the labs and challenges — hands-on practice is what makes it stick."},
  {q:"How long does the whole course take?", a:"At one solid lesson per day (about 20 minutes), the full 12 paths take roughly 3–4 months. Take your time — depth beats speed."}
];

/* --- Router --- */
const app = document.getElementById('app');
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

function route(){
  const hash = location.hash || '#/';
  window.scrollTo(0, 0);
  if(hash === '#/' || hash === '#') return renderHome();
  if(hash === '#/course') return renderCourse();
  if(hash === '#/careers') return renderCareers();
  if(hash === '#/faq') return renderFAQ();
  if(hash.startsWith('#/lesson/')) return renderLesson(hash.replace('#/lesson/',''));
  renderNotFound();
}

/* --- Views --- */
function renderHome(){
  const totalLessons = PATHS.reduce((n,p)=>n+p.lessons,0);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">Free cybersecurity course · zero experience needed</div>
        <h1>Start cybersecurity from <span class="amber">absolute zero</span>.</h1>
        <p class="hero-sub">
          No background required. Networks, Linux, Python, web hacking, bug bounty, advanced topics, and AI security —
          all written in plain words with hands-on labs. ${totalLessons}+ lessons across ${PATHS.length} paths, always free.
        </p>
        <div class="hero-btns">
          <a class="btn-amber" href="#/lesson/01-introduction">Begin lesson 1 →</a>
          <a class="btn-ghost" href="#/course">See the roadmap</a>
        </div>
        <div class="hero-stats">
          <div><div class="hstat-n">${PATHS.length}</div><div class="hstat-l">learning paths</div></div>
          <div><div class="hstat-n">${totalLessons}+</div><div class="hstat-l">lessons</div></div>
          <div><div class="hstat-n">Labs</div><div class="hstat-l">+ challenges</div></div>
          <div><div class="hstat-n">₹0</div><div class="hstat-l">forever</div></div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">The roadmap</div>
        <h2>Everything, in the right order</h2>
        <p class="sec-lead">Start at Path 01 and work down. Each path builds on the last, so you're never lost.</p>
      </div>
      <div class="paths">
        ${PATHS.map(p=>`
          <a class="path-card" href="#/lesson/${p.id}">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
            <div class="path-meta">${p.lessons} lessons · ${p.level}</div>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">Careers</div>
        <h2>Where can this take you?</h2>
        <p class="sec-lead">Security is many jobs — here's a shortlist and which paths lead to each.</p>
      </div>
      <div class="careers">
        ${CAREERS.slice(0,4).map(c=>`
          <div class="career-card">
            <h3>${c.role}</h3><p>${c.desc}</p>
            <div class="career-follow"><span>Follow:</span> ${c.follow}</div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:1.4rem"><a class="btn-ghost" href="#/careers">See all careers →</a></div>
    </section>

    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">Questions</div>
        <h2>Good to know</h2>
      </div>
      ${faqHTML(FAQS.slice(0,4))}
      <div style="text-align:center;margin-top:1.4rem"><a class="btn-ghost" href="#/faq">All FAQs →</a></div>
    </section>
  `;
  wireFAQ();
}

function renderCourse(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">The full course</div>
        <h2>12 paths from zero to advanced</h2>
        <p class="sec-lead">Written to be as detailed as a real textbook, with labs and challenges throughout. Read top to bottom.</p>
      </div>
      <div class="paths">
        ${PATHS.map(p=>`
          <a class="path-card" href="#/lesson/${p.id}">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
            <div class="path-meta">${p.lessons} lessons · ${p.level}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCareers(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">Careers</div>
        <h2>Where this course leads</h2>
        <p class="sec-lead">Security has many careers. Here's what each does and which paths in this course get you there.</p>
      </div>
      <div class="careers">
        ${CAREERS.map(c=>`
          <div class="career-card">
            <h3>${c.role}</h3><p>${c.desc}</p>
            <div class="career-follow"><span>Follow paths:</span> ${c.follow}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderFAQ(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">FAQ</div>
        <h2>Common questions</h2>
      </div>
      ${faqHTML(FAQS)}
    </section>
  `;
  wireFAQ();
}

function faqHTML(items){
  return `<div class="faq">${items.map(f=>`
    <div class="faq-item">
      <button class="faq-q">
        <span>${f.q}</span>
        <svg class="faq-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('')}</div>`;
}

function wireFAQ(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('.faq-q').addEventListener('click',()=>item.classList.toggle('open'));
  });
}

async function renderLesson(id){
  const idx = PATHS.findIndex(p=>p.id===id);
  if(idx===-1) return renderNotFound();
  const p = PATHS[idx];
  const prev = PATHS[idx-1];
  const next = PATHS[idx+1];

  app.innerHTML = `
    <div class="reader-wrap">
      <aside class="sidebar" id="sidebar">
        <div class="sb-head">All paths</div>
        <ul class="sb-list">
          ${PATHS.map(pp=>`
            <li><a href="#/lesson/${pp.id}" class="${pp.id===id?'active':''}">
              <span class="n">${pp.n}</span><span>${pp.title}</span>
            </a></li>
          `).join('')}
        </ul>
      </aside>
      <div class="reader">
        <div class="reader-nav-top">
          <div class="reader-crumb">PATH ${p.n} · ${p.level}</div>
          <button class="btn-ghost sm mobile-only" id="menuBtn">☰ Paths</button>
        </div>
        <div class="md" id="content"><div class="loading">Loading lesson…</div></div>
        <div class="reader-nav">
          ${prev?`<a class="btn-ghost sm" href="#/lesson/${prev.id}">← ${prev.title}</a>`:'<span></span>'}
          ${next?`<a class="btn-amber sm" href="#/lesson/${next.id}">${next.title} →</a>`:'<span></span>'}
        </div>
      </div>
    </div>
  `;

  document.getElementById('menuBtn')?.addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('open');
  });

  try{
    const res = await fetch(`course/${id}.md`);
    if(!res.ok) throw new Error(res.status);
    const md = await res.text();
    document.getElementById('content').innerHTML = marked.parse(md, {gfm:true, breaks:false});
  }catch(e){
    document.getElementById('content').innerHTML = `
      <h1>Could not load lesson</h1>
      <p>The lesson file <code>course/${id}.md</code> couldn't be fetched.</p>
      <p>If you're viewing this locally by double-clicking the HTML file, browsers block <code>fetch()</code> on <code>file://</code> for security. Run a tiny local server instead:</p>
      <pre><code>cd kashsec-site
python3 -m http.server 8000
# then open http://localhost:8000</code></pre>
      <p>On GitHub Pages this works automatically — no server config needed.</p>
    `;
  }
}

function renderNotFound(){
  app.innerHTML = `
    <section class="sec">
      <h2>Page not found</h2>
      <p style="color:var(--muted);margin-top:1rem">The link you followed doesn't exist. Try the <a href="#/">home page</a> or <a href="#/course">the full course</a>.</p>
    </section>
  `;
}

/* Mobile nav toggle */
document.getElementById('hamb').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(a=>{
  a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open'));
});
