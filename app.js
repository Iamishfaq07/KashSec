/* KashSec Academy v2 — two-level structure, Mermaid, callouts, external refs */

document.getElementById('year').textContent = new Date().getFullYear();

/* Init Mermaid with KashSec theme */
if(typeof mermaid !== 'undefined'){
  mermaid.initialize({
    startOnLoad:false,
    theme:'base',
    themeVariables:{
      primaryColor:'#111927', primaryTextColor:'#E9EEF3', primaryBorderColor:'#3FB6A8',
      lineColor:'#8496A6', secondaryColor:'#152131', tertiaryColor:'#0C1119',
      background:'#152131', mainBkg:'#111927', secondBkg:'#152131',
      fontFamily:'Inter, system-ui, sans-serif', fontSize:'14px'
    },
    flowchart:{curve:'basis',padding:15},
    sequence:{actorFontFamily:'Inter',noteFontFamily:'Inter',messageFontFamily:'Inter'}
  });
}

/* --- Course structure — each path has sub-lessons --- */
const PATHS = [
  {n:"01", id:"01-introduction", title:"Introduction to Cybersecurity", level:"Absolute beginner",
   desc:"What security is, why it matters, hacker types, the law, how to learn well.",
   subs:[
     {n:"1", id:"what-is-cybersecurity", title:"What is cybersecurity?", desc:"The concept, in plain English with everyday analogies."},
     {n:"2", id:"why-it-matters",        title:"Why it matters to you",   desc:"Everyday attacks, and the career door this opens."},
     {n:"3", id:"types-of-hackers",      title:"Types of hackers & careers", desc:"White/grey/black hats, and the jobs that exist."},
     {n:"4", id:"the-golden-rule",       title:"The golden rule: permission", desc:"The one legal line that keeps you safe forever."},
     {n:"5", id:"how-to-learn",          title:"How to actually learn this", desc:"The habits that prevent burnout and speed you up."}
   ]},
  {n:"02", id:"02-networking", title:"Networking Fundamentals", level:"Beginner",
   desc:"Networks, IP, ports, packets, TCP/UDP, DNS, HTTP/HTTPS — the bedrock.",
   subs:[
     {n:"1", id:"what-is-a-network",   title:"What is a network?",       desc:"The post-office picture that makes it all click."},
     {n:"2", id:"ip-addresses",        title:"IP addresses",             desc:"Private vs public, IPv4 vs IPv6, and finding yours."},
     {n:"3", id:"ports",               title:"Ports: the doors",         desc:"Well-known ports and why scanners knock on them."},
     {n:"4", id:"packets",             title:"Packets & the OSI layers", desc:"How data is chopped, wrapped, and reassembled."},
     {n:"5", id:"protocols",           title:"What is a protocol?",      desc:"Rules two computers agree on before talking."},
     {n:"6", id:"tcp-vs-udp",          title:"TCP vs UDP",               desc:"Registered mail vs postcard — plus the handshake."},
     {n:"7", id:"dns",                 title:"DNS: the phonebook",       desc:"How names become numbers, and what leaks."},
     {n:"8", id:"http-https",          title:"HTTP & HTTPS",             desc:"The web's language, and why the padlock matters."}
   ]},
  {n:"03", id:"03-linux", title:"Operating Systems & Linux", level:"Beginner",
   desc:"Install Kali in VirtualBox, then a full tour of the Linux command line.",
   subs:[
     {n:"1", id:"what-is-an-os",       title:"What is an operating system?", desc:"The manager that runs your computer."},
     {n:"2", id:"windows-linux-mac",   title:"Windows vs Linux vs macOS", desc:"The big three, and why security loves Linux."},
     {n:"3", id:"why-linux",           title:"Why hackers love Linux",  desc:"Open, scriptable, and the tools live here."},
     {n:"4", id:"virtualization",      title:"What is virtualization?", desc:"A whole computer inside your computer."},
     {n:"5", id:"install-virtualbox",  title:"Install VirtualBox",      desc:"Step-by-step with troubleshooting."},
     {n:"6", id:"install-kali",        title:"Install Kali Linux",      desc:"The pre-built image route, safely."},
     {n:"7", id:"snapshots-safety",    title:"Snapshots & safety",      desc:"Undo mistakes; network isolation."},
     {n:"8", id:"terminal-basics",     title:"Meet the terminal",       desc:"Your first commands, unafraid."},
     {n:"9", id:"files-and-folders",   title:"Files & folders",         desc:"Navigate, read, search — grep is gold."},
     {n:"10", id:"users-permissions",  title:"Users, permissions & sudo", desc:"Read rwx, install with apt, the SUID clue."},
     {n:"11", id:"bash-scripting",     title:"Your first bash script",  desc:"Pipes, redirection, loops — automation begins."}
   ]},
  {n:"04", id:"04-python", title:"Programming & Python", level:"Beginner",
   desc:"Programming from zero, then Python — build a real password-strength tool.",
   subs:[
     {n:"1", id:"what-is-programming", title:"What is programming?",    desc:"Recipes for computers, in plain English."},
     {n:"2", id:"variables-types",     title:"Variables & data types",  desc:"Labelled boxes: strings, numbers, booleans."},
     {n:"3", id:"if-else",             title:"Decisions with if/else",  desc:"The logic behind every login check."},
     {n:"4", id:"loops",               title:"Loops: repeat things",    desc:"How tools try 10,000 passwords in seconds."},
     {n:"5", id:"why-python",          title:"Why Python for security", desc:"Readable, ubiquitous, batteries included."},
     {n:"6", id:"first-program",       title:"Your first Python program", desc:"Print, input, comments — the write-save-run cycle."},
     {n:"7", id:"lists-functions",     title:"Lists & functions",       desc:"Wordlists and reusable code blocks."},
     {n:"8", id:"password-checker",    title:"Build a password checker", desc:"Combine everything into a real tool."},
     {n:"9", id:"where-next",          title:"Where to go next",        desc:"requests, socket, hashlib — and a mini port checker."}
   ]},
  {n:"05", id:"05-web-basics", title:"How the Web Works", level:"Beginner",
   desc:"Requests, HTML/CSS/JS, client/server, cookies, APIs, DevTools.",
   subs:[
     {n:"1", id:"page-load-journey",   title:"The page-load journey",   desc:"Every step from click to rendered page."},
     {n:"2", id:"html-css-js",         title:"HTML, CSS & JavaScript",  desc:"Structure, style, behaviour — and why XSS exists."},
     {n:"3", id:"client-vs-server",    title:"Client vs server",        desc:"The single most important web-security idea."},
     {n:"4", id:"cookies-sessions",    title:"Cookies, sessions, logins", desc:"How you stay logged in — and how attackers steal that."},
     {n:"5", id:"apis-json",           title:"APIs & JSON",             desc:"How modern apps really talk under the hood."},
     {n:"6", id:"devtools",            title:"Browser DevTools",        desc:"Your first hacking tool — free and built in."},
     {n:"7", id:"web-anatomy",         title:"Anatomy of a web app",    desc:"The full picture: client, server, DB, API, cookies."}
   ]},
  {n:"06", id:"06-fundamentals", title:"Cybersecurity Fundamentals", level:"Beginner→Intermediate",
   desc:"CIA triad, risk, malware, hashing, phishing, MFA, frameworks.",
   subs:[
     {n:"1", id:"cia-triad",           title:"The CIA triad",           desc:"Confidentiality, Integrity, Availability — the field's core."},
     {n:"2", id:"threats-risk",        title:"Threats, vulns & risk",   desc:"The unlocked-door analogy and the risk equation."},
     {n:"3", id:"attackers-kill-chain", title:"Attackers & the kill chain", desc:"Who attacks and the phases of an intrusion."},
     {n:"4", id:"malware",             title:"Malware families",        desc:"Virus, worm, trojan, ransomware, rootkit, spyware."},
     {n:"5", id:"passwords-hashing",   title:"Passwords & hashing",     desc:"How they should be stored, why reuse is a disaster."},
     {n:"6", id:"phishing",            title:"Phishing & social eng.",  desc:"Attacking humans, not computers."},
     {n:"7", id:"protect-yourself",    title:"MFA, updates, backups",   desc:"Habits that stop most real attacks."},
     {n:"8", id:"frameworks",          title:"Frameworks & compliance", desc:"NIST, ISO, OWASP, MITRE, PCI DSS, HIPAA, GDPR."}
   ]},
  {n:"07", id:"07-web-security", title:"Web Security & Hacking", level:"Intermediate",
   desc:"OWASP Top 10, Burp, IDOR, XSS, SQLi, command injection, SSRF, JWT.",
   subs:[
     {n:"1", id:"owasp-top-10",        title:"The OWASP Top 10",        desc:"The web hacker's shared checklist, in plain words."},
     {n:"2", id:"burp-setup",          title:"Burp Suite & PortSwigger", desc:"The professional's tool and free lab platform."},
     {n:"3", id:"web-recon",           title:"Web recon",               desc:"Subdomains, paths, parameters, JS files."},
     {n:"4", id:"idor",                title:"Broken access & IDOR",    desc:"The friendliest first bug — just change the ID."},
     {n:"5", id:"xss",                 title:"Cross-Site Scripting",    desc:"Reflected, stored, DOM — and how to prove it safely."},
     {n:"6", id:"sqli",                title:"SQL Injection",           desc:"The classic — with auth bypass, UNION, blind, sqlmap."},
     {n:"7", id:"cmd-and-upload",      title:"Command inj. & uploads",  desc:"Two paths to server takeover."},
     {n:"8", id:"ssrf-and-auth",       title:"SSRF & auth attacks",     desc:"Cloud metadata, JWT, credential attacks."},
     {n:"9", id:"web-roadmap",         title:"Your 90-day roadmap",     desc:"A concrete plan to reach real bug bounty."}
   ]},
  {n:"08", id:"08-network-security", title:"Network Security", level:"Intermediate",
   desc:"Nmap, Wireshark, firewalls, VPNs, IDS/IPS, Wi-Fi attacks, MITM.",
   subs:[
     {n:"1", id:"why-netsec",          title:"Why network security matters", desc:"Mapping, watching, filtering — the three activities."},
     {n:"2", id:"nmap",                title:"Scan networks with Nmap", desc:"The classic scanner, from -sV to NSE scripts."},
     {n:"3", id:"wireshark",           title:"See traffic with Wireshark", desc:"Watch real packets flow — plus tcpdump."},
     {n:"4", id:"firewalls-vpns",      title:"Firewalls, VPNs, proxies", desc:"The everyday defensive stack."},
     {n:"5", id:"ids-ips-siem",        title:"IDS, IPS & SIEM",         desc:"Modern detection: from Snort to SOC to SOAR."},
     {n:"6", id:"wifi-security",       title:"Wi-Fi security & attacks", desc:"WPA2/3, evil twin, handshake capture."},
     {n:"7", id:"mitm",                title:"Man-in-the-Middle",       desc:"How MITMs work, and how HTTPS defeats them."},
     {n:"8", id:"netsec-roadmap",      title:"Your network-security path", desc:"Red, blue, or engineering — pick a track."}
   ]},
  {n:"09", id:"09-ethical-hacking", title:"Ethical Hacking", level:"Intermediate→Advanced",
   desc:"The 5-phase methodology, from reconnaissance through reporting.",
   subs:[
     {n:"1", id:"what-is-eh",          title:"What ethical hacking really is", desc:"Same skills, opposite purpose. The RoE and scope."},
     {n:"2", id:"the-5-phases",        title:"The 5 phases",            desc:"The mental map every methodology reduces to."},
     {n:"3", id:"recon",               title:"Phase 1: Reconnaissance", desc:"OSINT, Google dorks, crt.sh, Shodan, GitHub."},
     {n:"4", id:"scan-enumerate",      title:"Phase 2: Scan & enumerate", desc:"Nmap deeper, per-service enum, searchsploit."},
     {n:"5", id:"exploitation",        title:"Phase 3: Exploitation",   desc:"Metasploit, reverse shells, Metasploitable lab."},
     {n:"6", id:"post-exploitation",   title:"Phase 4: Post-exploitation", desc:"Situational awareness, privesc, pivoting."},
     {n:"7", id:"reporting",           title:"Phase 5: Reporting",      desc:"The deliverable. CVSS, exec summary, details."},
     {n:"8", id:"eh-roadmap",          title:"Your ethical-hacking path", desc:"Security+ → eJPT → PNPT / OSCP."}
   ]},
  {n:"10", id:"10-bug-bounty", title:"Bug Bounty", level:"Intermediate→Advanced",
   desc:"Programs, recon pipelines, hunting IDOR & logic bugs, reports that pay.",
   subs:[
     {n:"1", id:"what-is-bb",          title:"What is a bug bounty?",   desc:"Platforms, scope, and responsible disclosure."},
     {n:"2", id:"choose-programs",     title:"Choosing programs",       desc:"Wide scope, newer, less-loved — beginner strategy."},
     {n:"3", id:"recon-pipeline",      title:"The recon pipeline",      desc:"subfinder → httpx → gau → nuclei — a real pipeline."},
     {n:"4", id:"report-writing",      title:"Reports that get paid",   desc:"The template, plus impact and CVSS."},
     {n:"5", id:"hunting-idor",        title:"Hunting IDOR",            desc:"Two-account method for beginners' goldmine."},
     {n:"6", id:"logic-and-chains",    title:"Business logic & chains", desc:"Race conditions, GraphQL, OAuth."},
     {n:"7", id:"automation-nuclei",   title:"Automation & nuclei",     desc:"Monitor while you sleep."},
     {n:"8", id:"bb-career",           title:"The bug-bounty career",   desc:"Economics, community, staying sane."}
   ]},
  {n:"11", id:"11-advanced", title:"Advanced Cyber Topics", level:"Advanced",
   desc:"Linux/Windows privesc, Active Directory, cloud, containers, malware, DFIR.",
   subs:[
     {n:"1", id:"linux-privesc",       title:"Linux privilege escalation", desc:"GTFOBins, SUID, capabilities, LinPEAS."},
     {n:"2", id:"windows-privesc",     title:"Windows privilege escalation", desc:"Services, tokens, Potato family."},
     {n:"3", id:"active-directory",    title:"Active Directory attacks", desc:"BloodHound, Kerberoast, Golden Ticket."},
     {n:"4", id:"cloud-security",      title:"Cloud security",          desc:"AWS/Azure/GCP, IAM, IMDS, flAWS lab."},
     {n:"5", id:"containers-k8s",      title:"Containers & Kubernetes", desc:"Docker sockets, RBAC, service tokens."},
     {n:"6", id:"malware-analysis",    title:"Malware analysis basics", desc:"Static & dynamic in a safe VM."},
     {n:"7", id:"dfir",                title:"Digital forensics & IR",  desc:"NIST 800-61, Sysmon, Volatility."},
     {n:"8", id:"specialise",          title:"Advanced career paths",   desc:"Where to specialise, and why."}
   ]},
  {n:"12", id:"12-ai-security", title:"AI & AI Security", level:"Advanced",
   desc:"How LLMs work, prompt injection, OWASP LLM Top 10, AI red teaming.",
   subs:[
     {n:"1", id:"how-llms-work",       title:"How LLMs actually work",  desc:"A friendly primer without the mystique."},
     {n:"2", id:"why-ai-security",     title:"Why AI security is new",  desc:"What makes AI attacks unlike any before."},
     {n:"3", id:"prompt-injection",    title:"Prompt injection",        desc:"The SQL injection of AI — direct and indirect."},
     {n:"4", id:"jailbreaks",          title:"Jailbreaks & bypasses",   desc:"Bypassing policy, not just instructions."},
     {n:"5", id:"llm-top-10",          title:"OWASP LLM Top 10",        desc:"The shared checklist for AI application security."},
     {n:"6", id:"poisoning-adv-ml",    title:"Poisoning & adversarial ML", desc:"Backdoors, extraction, adversarial examples."},
     {n:"7", id:"ai-red-teaming",      title:"AI red teaming",          desc:"Methodology, harms taxonomy, ethics."},
     {n:"8", id:"ai-career",           title:"Your AI-security career", desc:"The 12-month plan for a new frontier."}
   ]}
];

const CAREERS = [
  {role:"SOC Analyst",             desc:"Watch for and respond to attacks in real time.", follow:"02 → 06 → 08"},
  {role:"Penetration Tester",      desc:"Legally break into systems and report how.",     follow:"03 → 09 → 07"},
  {role:"AppSec Engineer",         desc:"Help developers ship safe software.",             follow:"04 → 05 → 07"},
  {role:"Bug Bounty Hunter",       desc:"Find bugs in real companies for cash rewards.",   follow:"05 → 07 → 10"},
  {role:"Cloud Security Engineer", desc:"Secure AWS, Azure, and Google Cloud.",            follow:"06 → 11"},
  {role:"Digital Forensics / IR",  desc:"Investigate incidents and evict attackers.",      follow:"03 → 08 → 11"},
  {role:"AI Red Teamer",           desc:"Adversarially test AI systems for safety.",       follow:"05 → 07 → 12"},
  {role:"Security / GRC Analyst",  desc:"Manage risk, policy, and compliance.",             follow:"01 → 06"}
];

const FAQS = [
  {q:"I have zero experience. Can I really do this?", a:"Yes — the course is built exactly for you. Start at path 1 and go in order. Every term is explained in plain words with everyday examples, and nothing is assumed."},
  {q:"Is it really free?", a:"Completely. Every lesson stays free forever. No card, no paywall, no upsell."},
  {q:"Do I need to buy anything or have a powerful computer?", a:"No. You'll install free software (VirtualBox + Kali Linux) that runs on a normal laptop. If your machine is very old, free browser labs like TryHackMe still let you practise."},
  {q:"Is any of this illegal?", a:"Not the way we teach it. You only ever practise on your own lab, on free legal training sites, or in-scope bug bounty programs. Path 01 covers the legal golden rule in detail."},
  {q:"How should I go through the course?", a:"Top to bottom, in order. Each path builds on the one before. Do the labs and challenges — hands-on practice is what makes it stick."},
  {q:"How long does the whole course take?", a:"At a sensible pace (a sub-lesson a day), the full course takes 3–4 months. Depth beats speed."}
];

/* --- Helpers --- */
const app = document.getElementById('app');

const totalSubLessons = () => PATHS.reduce((n,p)=>n+p.subs.length,0);

function findPath(id){ return PATHS.find(p=>p.id===id); }

function findSubContext(pathId, subId){
  const pIdx = PATHS.findIndex(p=>p.id===pathId);
  if(pIdx===-1) return null;
  const p = PATHS[pIdx];
  const sIdx = p.subs.findIndex(s=>s.id===subId);
  if(sIdx===-1) return null;
  const flat = [];
  PATHS.forEach(pp=>pp.subs.forEach(ss=>flat.push({pathId:pp.id,subId:ss.id,pathTitle:pp.title,subTitle:ss.title,pathN:pp.n,subN:ss.n})));
  const flatIdx = flat.findIndex(f=>f.pathId===pathId && f.subId===subId);
  return {path:p, sub:p.subs[sIdx], pathIdx:pIdx, subIdx:sIdx, prev:flat[flatIdx-1], next:flat[flatIdx+1]};
}

/* --- Router --- */
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

function route(){
  const hash = location.hash || '#/';
  window.scrollTo(0,0);
  if(hash === '#/' || hash === '#') return renderHome();
  if(hash === '#/course') return renderCourseIndex();
  if(hash === '#/careers') return renderCareers();
  if(hash === '#/faq') return renderFAQ();
  const partsSub = hash.match(/^#\/lesson\/([^/]+)\/([^/]+)$/);
  if(partsSub) return renderSubLesson(partsSub[1], partsSub[2]);
  const partsPath = hash.match(/^#\/lesson\/([^/]+)$/);
  if(partsPath) return renderPathOverview(partsPath[1]);
  renderNotFound();
}

/* --- Views --- */
function renderHome(){
  const total = totalSubLessons();
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">Free cybersecurity course · zero experience needed</div>
        <h1>Start cybersecurity from <span class="amber">absolute zero</span>.</h1>
        <p class="hero-sub">
          Networks, Linux, Python, web hacking, bug bounty, advanced topics, and AI security —
          all written in plain words with hands-on labs, diagrams, and links to real references.
          ${total}+ sub-lessons across ${PATHS.length} paths, always free.
        </p>
        <div class="hero-btns">
          <a class="btn-amber" href="#/lesson/01-introduction/what-is-cybersecurity">Begin lesson 1 →</a>
          <a class="btn-ghost" href="#/course">See the roadmap</a>
        </div>
        <div class="hero-stats">
          <div><div class="hstat-n">${PATHS.length}</div><div class="hstat-l">learning paths</div></div>
          <div><div class="hstat-n">${total}+</div><div class="hstat-l">sub-lessons</div></div>
          <div><div class="hstat-n">Labs</div><div class="hstat-l">+ challenges</div></div>
          <div><div class="hstat-n">₹0</div><div class="hstat-l">forever</div></div>
        </div>
      </div>
    </section>
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">The roadmap</div>
        <h2>Everything, in the right order</h2>
        <p class="sec-lead">Start at Path 01 and work down. Each path builds on the last, and every path is split into short sub-lessons.</p>
      </div>
      <div class="paths">
        ${PATHS.map(p=>`
          <a class="path-card" href="#/lesson/${p.id}">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
            <div class="path-meta">${p.subs.length} sub-lessons · ${p.level}</div>
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

function renderCourseIndex(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head">
        <div class="sec-eyebrow">The full course</div>
        <h2>12 paths, ${totalSubLessons()}+ sub-lessons</h2>
        <p class="sec-lead">Each path is split into short focused sub-lessons. Click a path to see its map.</p>
      </div>
      <div class="paths">
        ${PATHS.map(p=>`
          <a class="path-card" href="#/lesson/${p.id}">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
            <div class="path-meta">${p.subs.length} sub-lessons · ${p.level}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderPathOverview(pathId){
  const p = findPath(pathId);
  if(!p) return renderNotFound();
  app.innerHTML = `
    <section class="sec">
      <div class="path-overview">
        <div class="path-tag">Path ${p.n} · ${p.level}</div>
        <h1>${p.title}</h1>
        <p class="lead">${p.desc}</p>
        <div style="margin-top:1.5rem"><a class="btn-amber" href="#/lesson/${p.id}/${p.subs[0].id}">Start Sub-lesson 1 →</a></div>
        <div class="sublesson-grid">
          ${p.subs.map(s=>`
            <a class="sublesson-card" href="#/lesson/${p.id}/${s.id}">
              <div class="sl-n">${p.n}.${s.n}</div>
              <div class="sl-body">
                <div class="sl-t">${s.title}</div>
                <div class="sl-d">${s.desc}</div>
              </div>
              <svg class="sl-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          `).join('')}
        </div>
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
        <p class="sec-lead">Security has many careers. Here's what each does and which paths get you there.</p>
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

async function renderSubLesson(pathId, subId){
  const ctx = findSubContext(pathId, subId);
  if(!ctx) return renderNotFound();

  app.innerHTML = `
    <div class="reader-progress" id="rprog" style="width:0%"></div>
    <div class="reader-wrap">
      <aside class="sidebar" id="sidebar">
        <div class="sb-head">All paths</div>
        <div id="sbNav"></div>
      </aside>
      <div class="reader">
        <div class="reader-nav-top">
          <div class="reader-crumb">
            <a href="#/lesson/${ctx.path.id}" style="color:var(--teal);text-decoration:none">Path ${ctx.path.n}: ${ctx.path.title}</a>
            &nbsp;·&nbsp; Sub-lesson ${ctx.path.n}.${ctx.sub.n}
          </div>
          <button class="btn-ghost sm mobile-only" id="menuBtn">☰</button>
        </div>
        <div class="md" id="content"><div class="loading">Loading…</div></div>
        <div class="reader-nav">
          ${ctx.prev
            ? `<a class="btn-ghost sm" href="#/lesson/${ctx.prev.pathId}/${ctx.prev.subId}">← ${ctx.prev.pathN}.${ctx.prev.subN} ${ctx.prev.subTitle}</a>`
            : `<span></span>`}
          ${ctx.next
            ? `<a class="btn-amber sm" href="#/lesson/${ctx.next.pathId}/${ctx.next.subId}">${ctx.next.pathN}.${ctx.next.subN} ${ctx.next.subTitle} →</a>`
            : `<span></span>`}
        </div>
      </div>
    </div>
  `;

  renderSidebar(pathId, subId);
  document.getElementById('menuBtn')?.addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('open');
  });
  wireProgress();

  try{
    const res = await fetch(`course/${pathId}/${subId}.md`);
    if(!res.ok) throw new Error(res.status);
    const md = await res.text();
    document.getElementById('content').innerHTML = enrichMarkdown(md);
    // Render Mermaid diagrams
    if(typeof mermaid !== 'undefined'){
      try{ await mermaid.run({querySelector:'.mermaid'}); }catch(e){}
    }
  }catch(e){
    document.getElementById('content').innerHTML = `
      <h1>Coming soon</h1>
      <p>This sub-lesson (<code>course/${pathId}/${subId}.md</code>) hasn't been written yet.</p>
      <p>Path ${ctx.path.n} is being expanded into detailed sub-lessons — check back soon!</p>
      <p><a href="#/lesson/${pathId}">← Back to Path ${ctx.path.n}</a></p>
    `;
  }
}

function renderSidebar(activePathId, activeSubId){
  const nav = document.getElementById('sbNav');
  nav.innerHTML = PATHS.map(p=>{
    const isActive = p.id === activePathId;
    return `
      <div class="sb-path ${isActive?'active open':''}" data-pid="${p.id}">
        <button class="sb-path-head">
          <span class="n">${p.n}</span>
          <span class="name">${p.title}</span>
          <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <ul class="sb-sublist">
          <li><a href="#/lesson/${p.id}" class="${isActive && !activeSubId ? 'active':''}"><em>Overview</em></a></li>
          ${p.subs.map(s=>`
            <li><a href="#/lesson/${p.id}/${s.id}" class="${isActive && s.id===activeSubId?'active':''}">
              ${p.n}.${s.n} · ${s.title}
            </a></li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
  // Toggle path expansion on click
  nav.querySelectorAll('.sb-path-head').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const parent = btn.closest('.sb-path');
      parent.classList.toggle('open');
    });
  });
}

function wireProgress(){
  const bar = document.getElementById('rprog');
  if(!bar) return;
  const update = ()=>{
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrolled / height * 100) : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, {passive:true});
  update();
}

/* Transform markdown into rich HTML: callouts, Mermaid, references */
function enrichMarkdown(md){
  // Convert custom callout syntax:  :::tip TITLE ... :::
  md = md.replace(/^:::(\w+)(?:\s+(.+?))?\n([\s\S]*?)\n:::$/gm, (m, kind, title, body)=>{
    const bodyHtml = marked.parse(body.trim());
    const label = (title || defaultLabel(kind)).toUpperCase();
    return `<div class="callout ${kind}"><span class="ct-tag">${label}</span><div class="ct-body">${bodyHtml}</div></div>`;
  });

  // References block:  ??? refs ... ???
  md = md.replace(/^\?{3}\s*refs\s*\n([\s\S]*?)\n\?{3}$/gm, (m, body)=>{
    const bodyHtml = marked.parse(body.trim());
    return `<div class="ref-list"><div class="ref-list-title">📚 Further reading & references</div>${bodyHtml}</div>`;
  });

  // SVG figures:  ~~~svg CAPTION ... ~~~
  md = md.replace(/^~{3}svg(?:\s+(.+?))?\n([\s\S]*?)\n~{3}$/gm, (m, caption, body)=>{
    return `<figure class="svg-figure">${body.trim()}${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
  });

  // Render main markdown
  let html = marked.parse(md, {gfm:true, breaks:false});

  // Convert mermaid fenced blocks to .mermaid divs after marked runs
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (m, code)=> `<div class="mermaid">${decodeHtml(code)}</div>`);

  return html;
}

function decodeHtml(s){
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
}

function defaultLabel(kind){
  return ({tip:'TIP',warn:'WARNING',danger:'DANGER',lab:'🧪 LAB',challenge:'🚩 CHALLENGE',note:'NOTE'})[kind] || kind;
}

function renderNotFound(){
  app.innerHTML = `
    <section class="sec">
      <h2>Page not found</h2>
      <p style="color:var(--muted);margin-top:1rem">Try the <a href="#/">home page</a> or <a href="#/course">the full course</a>.</p>
    </section>
  `;
}

/* Mobile nav */
document.getElementById('hamb').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(a=>{
  a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open'));
});
