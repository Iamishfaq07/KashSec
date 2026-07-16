/* KashSec Academy v2 — two-level structure, Mermaid, callouts, external refs */

document.getElementById('year').textContent = new Date().getFullYear();
document.body.classList.add('reveal-ready');

/* Lazily load marked + Mermaid only when a lesson actually needs to render
   markdown. This means the home/course/careers/FAQ pages never depend on an
   external CDN to appear, and a slow/blocked CDN can never leave the whole
   site stuck on "Loading…" — only that one lesson's content is affected,
   with a clear retry message instead of an infinite spinner. */
let libsPromise = null;
function loadScript(src){
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=>resolve();
    s.onerror = ()=>reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}
function withTimeout(promise, ms, label){
  return Promise.race([
    promise,
    new Promise((_,reject)=>setTimeout(()=>reject(new Error(label + ' timed out')), ms))
  ]);
}
function ensureMarkdownLibs(){
  if(typeof marked !== 'undefined' && typeof mermaid !== 'undefined') return Promise.resolve();
  if(libsPromise) return libsPromise;
  libsPromise = withTimeout(
    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
      .then(()=>loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js')),
    12000, 'Loading the lesson renderer'
  ).then(()=>{
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
  }).catch(err=>{ libsPromise = null; throw err; }); // allow retry on next lesson visit
  return libsPromise;
}

/* ============================================================
   STORE — everything below is local-only (localStorage), no
   account, no server. One JSON blob is the single source of
   truth for progress, bookmarks, notes, quiz scores, and prefs.
   ============================================================ */
const STORE_KEY = 'kashsec_state_v1';
function defaultState(){
  return {
    completed:{},      // { "pathId/subId": timestamp }
    bookmarks:{},      // { "pathId/subId": timestamp }
    notes:{},          // { "pathId/subId": "text" }
    quizScores:{},      // { pathId: {score,total,pct,passed,ts} }
    finalQuiz:null,      // {score,total,pct,passed,ts}
    lastVisited:null,    // {pathId,subId,ts}
    theme:null,          // 'dark' | 'light' | null(=auto)
    certName:'',         // last name used for the certificate
    achievements:{},     // { achievementId: timestamp }
    visitDays:{},        // { "YYYY-MM-DD": true }
    usedSearch:false
  };
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return Object.assign(defaultState(), JSON.parse(raw));
  }catch(e){}
  return defaultState();
}
let STATE = loadState();
function saveState(){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); }catch(e){}
  if(typeof SupabaseSync !== 'undefined') SupabaseSync.pushState(STATE);
}
const lessonKey = (pathId,subId) => pathId+'/'+subId;

function isComplete(pathId,subId){ return !!STATE.completed[lessonKey(pathId,subId)]; }
function toggleComplete(pathId,subId){
  const k = lessonKey(pathId,subId);
  const nowComplete = !STATE.completed[k];
  if(nowComplete) STATE.completed[k] = Date.now(); else delete STATE.completed[k];
  saveState();
  checkAchievements();
  return nowComplete;
}
function isBookmarked(pathId,subId){ return !!STATE.bookmarks[lessonKey(pathId,subId)]; }
function toggleBookmark(pathId,subId){
  const k = lessonKey(pathId,subId);
  const nowSaved = !STATE.bookmarks[k];
  if(nowSaved) STATE.bookmarks[k] = Date.now(); else delete STATE.bookmarks[k];
  saveState();
  checkAchievements();
  return nowSaved;
}
function getNote(pathId,subId){ return STATE.notes[lessonKey(pathId,subId)] || ''; }
function setNote(pathId,subId,text){
  const k = lessonKey(pathId,subId);
  if(text && text.trim()) STATE.notes[k] = text; else delete STATE.notes[k];
  saveState();
  checkAchievements();
}
function pathProgress(pathId){
  const p = findPath(pathId);
  if(!p) return {done:0,total:0,pct:0};
  const total = p.subs.length;
  const done = p.subs.filter(s=>isComplete(pathId,s.id)).length;
  return {done,total,pct: total ? Math.round(done/total*100) : 0};
}
function overallProgress(){
  const total = totalSubLessons();
  const done = Object.keys(STATE.completed).length;
  return {done,total,pct: total ? Math.round(done/total*100) : 0};
}
function recordVisit(pathId,subId){
  STATE.lastVisited = {pathId,subId,ts:Date.now()};
  const day = new Date().toISOString().slice(0,10);
  STATE.visitDays[day] = true;
  saveState();
  checkAchievements();
}
function quizPassCount(){ return Object.values(STATE.quizScores).filter(q=>q.passed).length; }

/* ---------- Theme ---------- */
function currentTheme(){
  return document.documentElement.getAttribute('data-theme') || 'dark';
}
function applyTheme(){
  const theme = STATE.theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle')?.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', theme === 'light' ? '#F6F7FA' : '#0A0E13');
}
function toggleTheme(){
  STATE.theme = currentTheme() === 'light' ? 'dark' : 'light';
  saveState();
  applyTheme();
  STATE.achievements['theme-explorer-seen-dark'] = STATE.achievements['theme-explorer-seen-dark'] || (currentTheme()==='dark');
  STATE.achievements['theme-explorer-seen-light'] = STATE.achievements['theme-explorer-seen-light'] || (currentTheme()==='light');
  checkAchievements();
}
applyTheme();

/* ---------- Achievements ---------- */
const ACHIEVEMENTS = [
  {id:'first-lesson', ico:'🎯', t:'First Steps', d:'Complete your first lesson.',
   check:()=>Object.keys(STATE.completed).length >= 1},
  {id:'ten-lessons', ico:'📈', t:'Getting Serious', d:'Complete 10 lessons.',
   check:()=>Object.keys(STATE.completed).length >= 10},
  {id:'fifty-percent', ico:'🔥', t:'Halfway There', d:'Reach 50% overall progress.',
   check:()=>overallProgress().pct >= 50},
  {id:'all-complete', ico:'🏆', t:'Course Complete', d:'Complete every lesson in the course.',
   check:()=>overallProgress().pct >= 100},
  {id:'first-path', ico:'🚀', t:'Path Pioneer', d:'Finish every lesson in a single path.',
   check:()=>PATHS.some(p=>pathProgress(p.id).pct >= 100)},
  {id:'quiz-pass', ico:'✅', t:'Quiz Taker', d:'Pass your first path quiz.',
   check:()=>quizPassCount() >= 1},
  {id:'quiz-master', ico:'🧠', t:'Quiz Master', d:'Pass 5 path quizzes.',
   check:()=>quizPassCount() >= 5},
  {id:'final-quiz', ico:'🎓', t:'Exam Ready', d:'Pass the Final Exam.',
   check:()=>!!(STATE.finalQuiz && STATE.finalQuiz.passed)},
  {id:'certificate', ico:'📜', t:'Certified', d:'Generate your certificate of completion.',
   check:()=>!!STATE.achievements['_certificate_issued']},
  {id:'bookworm', ico:'🔖', t:'Bookworm', d:'Bookmark 5 lessons to revisit later.',
   check:()=>Object.keys(STATE.bookmarks).length >= 5},
  {id:'note-taker', ico:'✍️', t:'Note Taker', d:'Write notes on 3 lessons.',
   check:()=>Object.keys(STATE.notes).length >= 3},
  {id:'streak', ico:'📅', t:'Consistent Learner', d:'Visit the course on 3 different days.',
   check:()=>Object.keys(STATE.visitDays).length >= 3},
  {id:'theme-explorer', ico:'🌓', t:'Night & Day', d:'Try both the light and dark themes.',
   check:()=>!!(STATE.achievements['theme-explorer-seen-dark'] && STATE.achievements['theme-explorer-seen-light'])},
  {id:'searcher', ico:'🔍', t:'Explorer', d:'Use search to jump straight to a lesson.',
   check:()=>!!STATE.usedSearch}
];
let pendingToasts = [];
function checkAchievements(){
  let newlyUnlocked = [];
  ACHIEVEMENTS.forEach(a=>{
    if(STATE.achievements[a.id]) return;
    try{
      if(a.check()){ STATE.achievements[a.id] = Date.now(); newlyUnlocked.push(a); }
    }catch(e){}
  });
  if(newlyUnlocked.length){
    saveState();
    newlyUnlocked.forEach(a=>showAchievementToast(a));
    refreshProgressRing();
  }
}
function showAchievementToast(a){
  let host = document.getElementById('toastHost');
  if(!host){
    host = document.createElement('div');
    host.id = 'toastHost';
    host.className = 'toast-host';
    host.setAttribute('aria-live','polite');
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-ico">${a.ico}</span><div><div class="toast-t">Achievement unlocked</div><div class="toast-d">${a.t} — ${a.d}</div></div>`;
  host.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('in'));
  if(typeof fireConfetti === 'function') fireConfetti({count:36, x:window.innerWidth-140, y:110});
  setTimeout(()=>{
    el.classList.remove('in');
    setTimeout(()=>el.remove(), 400);
  }, 4200);
}
function refreshProgressRing(){
  const ring = document.getElementById('ringFill');
  if(!ring) return;
  const R = 15.5, C = 2*Math.PI*R;
  const pct = overallProgress().pct;
  ring.setAttribute('stroke-dasharray', C.toFixed(1));
  ring.setAttribute('stroke-dashoffset', (C - (C*pct/100)).toFixed(1));
  const btn = document.getElementById('progressRingBtn');
  if(btn) btn.setAttribute('aria-label', `Your progress: ${pct}% complete`);
}

/* --- Course structure — each path has sub-lessons --- */
const PATHS = [
  {n:"00", id:"00-fresher-basics", title:"Computer Basics & Security Mindset", level:"Absolute fresher",
   desc:"For complete beginners — what a computer is, how the internet works, and staying safe online before anything else.",
   subs:[
     {n:"1", id:"what-is-a-computer",   title:"What is a computer really?", desc:"Hardware, software, and the OS, explained simply."},
     {n:"2", id:"how-internet-works",   title:"How the internet works",     desc:"From your phone to the world, in plain English."},
     {n:"3", id:"files-folders-you",    title:"Files, folders & organizing yourself", desc:"Where your data lives, and how to stay tidy."},
     {n:"4", id:"how-to-learn-tech",    title:"How to learn tech effectively", desc:"The habits that make the difference."},
     {n:"5", id:"passwords-accounts",   title:"Passwords & accounts basics", desc:"Your first line of defense, done right."},
     {n:"6", id:"staying-safe-online",  title:"Staying safe online",        desc:"Phishing, scams, and the basics of online safety."}
   ]},
  {n:"01", id:"01-introduction", title:"Introduction to Cybersecurity", level:"Absolute beginner",
   desc:"What security is, why it matters, hacker types, the law, how to learn well.",
   subs:[
     {n:"1", id:"what-is-cybersecurity", title:"What is cybersecurity?", desc:"The concept, in plain English with everyday analogies."},
     {n:"2", id:"why-it-matters",        title:"Why it matters to you",   desc:"Everyday attacks, and the career door this opens."},
     {n:"3", id:"types-of-hackers",      title:"Types of hackers & careers", desc:"White/grey/black hats, and the jobs that exist."},
     {n:"4", id:"the-golden-rule",       title:"The golden rule: permission", desc:"The one legal line that keeps you safe forever."},
     {n:"5", id:"how-to-learn",          title:"How to actually learn this", desc:"The habits that prevent burnout and speed you up."},
     {n:"6", id:"security-mindset-lab",  title:"Security Mindset Lab",    desc:"A hands-on exercise to develop the right way of thinking about security."}
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
     {n:"8", id:"http-https",          title:"HTTP & HTTPS",             desc:"The web's language, and why the padlock matters."},
     {n:"9", id:"dns-lab",             title:"DNS Lab",                  desc:"Understand how DNS works and how it can be abused."},
     {n:"10", id:"practical-packet-lab", title:"Practical Packet Analysis Intro", desc:"See how data actually moves, hands-on."}
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
     {n:"11", id:"bash-scripting",     title:"Your first bash script",  desc:"Pipes, redirection, loops — automation begins."},
     {n:"12", id:"advanced-terminal-lab", title:"Advanced Terminal Lab", desc:"Level up your command line skills."},
     {n:"13", id:"linux-forensics-lab", title:"Linux Forensics Basics Lab", desc:"Learn to investigate a Linux system."}
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
     {n:"9", id:"where-next",          title:"Where to go next",        desc:"requests, socket, hashlib — and a mini port checker."},
     {n:"10", id:"automation-for-security", title:"Automation for Security", desc:"Why scripting and automation are essential in security."},
     {n:"11", id:"security-scripting-lab", title:"Security Scripting Lab", desc:"Turn Python into a real security tool."}
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
     {n:"7", id:"web-anatomy",         title:"Anatomy of a web app",    desc:"The full picture: client, server, DB, API, cookies."},
     {n:"8", id:"cookies-sessions-lab", title:"Cookies & Sessions Lab", desc:"Understand how authentication state is managed and attacked."},
     {n:"9", id:"devtools-lab",        title:"Browser DevTools Lab",    desc:"Learn to use your browser as a hacking tool."}
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
     {n:"8", id:"frameworks",          title:"Frameworks & compliance", desc:"NIST, ISO, OWASP, MITRE, PCI DSS, HIPAA, GDPR."},
     {n:"9", id:"risk-assessment-lab", title:"Risk Assessment Lab",     desc:"Practice thinking like a risk analyst."},
     {n:"10", id:"social-engineering-lab", title:"Social Engineering Lab", desc:"Understand how attackers manipulate people."}
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
     {n:"9", id:"web-roadmap",         title:"Your 90-day roadmap",     desc:"A concrete plan to reach real bug bounty."},
     {n:"10", id:"burp-advanced-lab",  title:"Advanced Burp Suite Lab", desc:"Take your Burp skills to the next level."},
     {n:"11", id:"jwt-advanced-lab",   title:"Advanced JWT Lab",        desc:"Deep dive into JWT attacks and defenses."},
     {n:"12", id:"ssrf-jwt-lab",       title:"SSRF & JWT Lab",          desc:"Practice two important modern web attacks."},
     {n:"13", id:"xss-practical-lab",  title:"XSS Practical Lab",       desc:"Learn to find and exploit Cross-Site Scripting safely."}
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
     {n:"8", id:"netsec-roadmap",      title:"Your network-security path", desc:"Red, blue, or engineering — pick a track."},
     {n:"9", id:"nmap-advanced-lab",   title:"Advanced Nmap Lab",       desc:"Master network scanning like a professional."},
     {n:"10", id:"wireshark-advanced-lab", title:"Advanced Wireshark Lab", desc:"Go deeper with packet analysis."}
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
     {n:"8", id:"eh-roadmap",          title:"Your ethical-hacking path", desc:"Security+ → eJPT → PNPT / OSCP."},
     {n:"9", id:"advanced-exploitation-lab", title:"Advanced Exploitation Lab", desc:"Take exploitation skills further."},
     {n:"10", id:"metasploit-lab",     title:"Metasploit Practical Lab", desc:"Get comfortable with the most popular exploitation framework."},
     {n:"11", id:"practical-recon-lab", title:"Practical Reconnaissance Lab", desc:"Hands-on OSINT and reconnaissance practice."},
     {n:"12", id:"reporting-lab",      title:"Reporting Lab",           desc:"Learn to write professional penetration test reports."}
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
     {n:"8", id:"bb-career",           title:"The bug-bounty career",   desc:"Economics, community, staying sane."},
     {n:"9", id:"bounty-hunting-challenges", title:"Bug Bounty Hunting Challenges", desc:"Practical challenges to level up your hunting skills."},
     {n:"10", id:"logic-bug-hunting-lab", title:"Logic Bug Hunting Lab", desc:"Practice finding business logic vulnerabilities."},
     {n:"11", id:"recon-pipeline-lab", title:"Recon Pipeline Lab",      desc:"Build and run a real reconnaissance pipeline."}
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
     {n:"8", id:"specialise",          title:"Advanced career paths",   desc:"Where to specialise, and why."},
     {n:"9", id:"cloud-security-lab",  title:"Cloud Security Lab",      desc:"Get hands-on with common cloud misconfigurations."},
     {n:"10", id:"containers-k8s-lab", title:"Containers & Kubernetes Lab", desc:"Practice container security basics."},
     {n:"11", id:"devsecops-lab",      title:"DevSecOps Lab",           desc:"Integrate security into the development lifecycle."},
     {n:"12", id:"dfir-lab",           title:"Digital Forensics & IR Lab", desc:"Practice basic incident response and forensics."},
     {n:"13", id:"malware-analysis-lab", title:"Malware Analysis Lab",  desc:"Get started with basic malware analysis in a safe environment."},
     {n:"14", id:"practical-linux-privesc-lab", title:"Practical Linux Privilege Escalation Lab", desc:"Get hands-on with real privesc techniques in a safe environment."},
     {n:"15", id:"purple-teaming-lab", title:"Purple Teaming Lab",      desc:"Learn to combine red and blue team perspectives."},
     {n:"16", id:"threat-hunting-lab", title:"Threat Hunting Lab",      desc:"Learn proactive detection instead of just reacting."},
     {n:"17", id:"threat-modeling-lab", title:"Threat Modeling Lab",    desc:"Learn to systematically find risks before attackers do."},
     {n:"18", id:"windows-privesc-lab", title:"Windows Privilege Escalation Lab", desc:"Practice common Windows privesc techniques."}
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
     {n:"8", id:"ai-career",           title:"Your AI-security career", desc:"The 12-month plan for a new frontier."},
     {n:"9", id:"agentic-ai-risks",    title:"Agentic AI Risks",        desc:"As AI agents become more powerful, new risks emerge."},
     {n:"10", id:"llm-attack-taxonomy", title:"LLM Attack Taxonomy",    desc:"A clear map of the different ways attackers try to break AI systems."},
     {n:"11", id:"llm-governance",     title:"LLM Governance & Compliance", desc:"Managing AI systems responsibly at scale."},
     {n:"12", id:"llm-red-teaming-playbooks", title:"LLM Red Teaming Playbooks", desc:"Structured approaches to systematically test LLM applications."},
     {n:"13", id:"llm-supply-chain-attacks", title:"LLM Supply Chain Attacks", desc:"Attacks that target the components and data used to build and run LLMs."},
     {n:"14", id:"practical-ai-labs",  title:"Practical AI Red Teaming Labs", desc:"Hands-on challenges you can do safely with free or low-cost LLMs."},
     {n:"15", id:"securing-llm-apps",  title:"Securing LLM Applications", desc:"How to build and deploy LLMs more securely."}
   ]},
  {n:"13", id:"13-career-prep", title:"Career Prep", level:"All levels",
   desc:"Resume, portfolio, interviews, and the job search — turn your skills into an offer.",
   subs:[
     {n:"1", id:"building-resume",       title:"Building your security resume", desc:"Your resume is your first impression."},
     {n:"2", id:"certifications-roadmap", title:"Certifications that actually help", desc:"Not all certs are equal — focus on the right ones at the right time."},
     {n:"3", id:"github-portfolio",      title:"Building projects & GitHub portfolio", desc:"Projects beat certificates alone."},
     {n:"4", id:"job-search",            title:"Job search strategy",     desc:"Where and how to find security jobs effectively."},
     {n:"5", id:"interview-prep",        title:"Interview preparation",   desc:"Technical and soft skills that win jobs."},
     {n:"6", id:"networking-community",  title:"Networking & community",  desc:"Connections often matter as much as skills."},
     {n:"7", id:"first-90-days",         title:"Your first 90 days in a security job", desc:"How to succeed once you land the role."}
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

const ICON = {
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  terminal:'<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  map:'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>'
};
const svgIco = (name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

const FEATURES = [
  {ico:"book",     t:"Plain-English first", d:"Every term is defined the moment it appears — no assumed knowledge, no jargon walls, ever."},
  {ico:"terminal", t:"Hands-on labs",       d:"Real exercises and challenges in a safe, legal lab you build yourself and fully control."},
  {ico:"grid",     t:"Diagrams that click", d:"Mermaid flowcharts and hand-drawn SVGs turn abstract ideas into pictures you remember."},
  {ico:"map",      t:"A real roadmap",      d:"12 ordered paths, 97 focused sub-lessons — each one building on the one before it."},
  {ico:"link",     t:"Curated references",  d:"Every lesson ends with links to the best free resources, so you always know where to go deeper."},
  {ico:"unlock",   t:"Free, forever",       d:"No account, no paywall, no tracking. World-class security education, open to everyone."}
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

/* Bumped on every navigation so in-flight async work (a lesson fetch
   still resolving after the user clicked elsewhere) can tell it's stale
   and skip writing into DOM nodes that no longer exist. */
let renderGeneration = 0;

function route(){
  renderGeneration++;
  // Magic-link / OAuth redirects land back on the site with auth tokens
  // riding in the URL (e.g. #access_token=...). That's not a real route —
  // show a brief loading state and let the auth bootstrap below redirect
  // to a clean hash once the session is established, instead of flashing
  // a 404 while Supabase parses and strips the tokens.
  if(typeof SupabaseSync !== 'undefined' && SupabaseSync.isAuthCallbackUrl()){
    app.innerHTML = `<div class="loading">Signing you in…</div>`;
    return;
  }
  const hash = location.hash || '#/';
  window.scrollTo(0,0);
  if(hash === '#/' || hash === '#') renderHome();
  else if(hash === '#/course') renderCourseIndex();
  else if(hash === '#/careers') renderCareers();
  else if(hash === '#/faq') renderFAQ();
  else if(hash === '#/roadmap') renderRoadmap();
  else if(hash === '#/progress') renderProgressHub();
  else if(hash === '#/certificate') renderCertificate();
  else if(hash === '#/quiz/final') renderQuiz('final');
  else {
    const partsQuiz = hash.match(/^#\/quiz\/([^/]+)$/);
    const partsSub = hash.match(/^#\/lesson\/([^/]+)\/([^/]+)$/);
    const partsPath = hash.match(/^#\/lesson\/([^/]+)$/);
    if(partsQuiz) renderQuiz(partsQuiz[1]);
    else if(partsSub) renderSubLesson(partsSub[1], partsSub[2]);
    else if(partsPath) renderPathOverview(partsPath[1]);
    else renderNotFound();
  }
  afterRender();
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Runs after every view render: reveal-on-scroll, cursor spotlight,
   active nav highlight, and hero count-up. */
function afterRender(){
  updateActiveNav();
  setupReveal();
  wireSpotlight();
  countUp();
  playRouteTransition();
  animateProgressBars();
}

/* Whole-view fade+slide whenever a route renders. Purely a CSS class
   toggle on already-painted content — never delays the actual render. */
function playRouteTransition(){
  if(prefersReduced()) return;
  app.classList.remove('route-transition');
  void app.offsetWidth; // force reflow so the animation restarts
  app.classList.add('route-transition');
}

/* Mini progress bars render at width:0 and animate up to their real
   value right after paint, so completion always feels like it "fills in". */
function animateProgressBars(){
  const bars = app.querySelectorAll('.mini-progress-fill[data-pct]');
  if(!bars.length) return;
  requestAnimationFrame(()=>{
    bars.forEach(b=> b.style.width = b.getAttribute('data-pct') + '%');
  });
}

/* Lightweight canvas confetti for celebratory moments (achievement
   unlocks, quiz pass, certificate earned). Self-cleans; no-ops under
   prefers-reduced-motion. */
function fireConfetti(opts){
  if(prefersReduced()) return;
  const count = (opts && opts.count) || 90;
  const originX = (opts && opts.x) || window.innerWidth/2;
  const originY = (opts && opts.y) || window.innerHeight*0.3;
  const colors = ['#EFA43A','#FFC369','#3FB6A8','#5FE0CF','#E05548'];

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:500';
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const particles = Array.from({length:count}, ()=>({
    x: originX, y: originY,
    vx: (Math.random()-0.5)*11,
    vy: Math.random()*-11 - 4,
    size: Math.random()*6+4,
    color: colors[Math.floor(Math.random()*colors.length)],
    rot: Math.random()*Math.PI*2,
    vr: (Math.random()-0.5)*0.3,
    shape: Math.random()>0.5 ? 'rect' : 'circle'
  }));

  const gravity = 0.35, drag = 0.992;
  let frame = 0;
  const maxFrames = 130;

  function tick(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.vx *= drag; p.vy = p.vy*drag + gravity;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = frame > maxFrames-30 ? Math.max(0,(maxFrames-frame)/30) : 1;
      if(p.shape==='rect') ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*0.66);
      else{ ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    if(frame < maxFrames) requestAnimationFrame(tick);
    else canvas.remove();
  }
  requestAnimationFrame(tick);
}

function updateActiveNav(){
  const hash = location.hash || '#/';
  document.querySelectorAll('#navLinks a').forEach(a=>{
    const href = a.getAttribute('href') || '';
    if(!href.startsWith('#')) return; // skip external (GitHub)
    const active = href === hash || (href === '#/course' && hash.startsWith('#/lesson'));
    a.classList.toggle('active', active);
    if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
}

let revealObserver;
function setupReveal(){
  const els = app.querySelectorAll('[data-reveal]');
  if(!els.length) return;
  if(prefersReduced() || !('IntersectionObserver' in window)){
    els.forEach(e=>e.classList.add('in'));
    return;
  }
  if(revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries,obs)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  },{rootMargin:'0px 0px -8% 0px', threshold:0.06});
  els.forEach(e=>revealObserver.observe(e));
  // Safety net: never leave content hidden if the observer misses.
  setTimeout(()=>els.forEach(e=>e.classList.add('in')), 1600);
}

function wireSpotlight(){
  if(window.matchMedia('(pointer: coarse)').matches) return; // touch: skip
  app.querySelectorAll('[data-spotlight]').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

function countUp(){
  const els = app.querySelectorAll('[data-count]');
  if(!els.length) return;
  els.forEach(el=>{
    const target = parseInt(el.getAttribute('data-count'),10);
    const suffix = el.getAttribute('data-suffix') || '';
    if(prefersReduced() || !target){ el.textContent = target + suffix; return; }
    const dur = 1100, start = performance.now();
    const tick = (now)=>{
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* --- Views --- */
function renderHome(){
  const total = totalSubLessons();
  const continueCtx = STATE.lastVisited ? findSubContext(STATE.lastVisited.pathId, STATE.lastVisited.subId) : null;
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow" data-reveal>${continueCtx ? '▶ Welcome back' : 'Free cybersecurity course · zero experience needed'}</div>
        <h1 data-reveal style="--i:1">${continueCtx ? `Pick up right where you <span class="amber">left off</span>.` : `Start cybersecurity from <span class="amber">absolute zero</span>.`}</h1>
        <p class="hero-sub" data-reveal style="--i:2">
          ${continueCtx
            ? `You were on <strong>${continueCtx.path.n}.${continueCtx.sub.n} · ${continueCtx.sub.title}</strong> in ${continueCtx.path.title}. Jump back in, or explore the rest of the course — ${total}+ sub-lessons across ${PATHS.length} paths, always free.`
            : `Networks, Linux, Python, web hacking, bug bounty, advanced topics, and AI security —
          all written in plain words with hands-on labs, diagrams, and links to real references.
          ${total}+ sub-lessons across ${PATHS.length} paths, always free.`}
        </p>
        <div class="hero-btns" data-reveal style="--i:3">
          ${continueCtx
            ? `<a class="btn-amber" href="#/lesson/${continueCtx.path.id}/${continueCtx.sub.id}">Continue learning →</a>`
            : `<a class="btn-amber" href="#/lesson/01-introduction/what-is-cybersecurity">Begin lesson 1 →</a>`}
          <a class="btn-ghost" href="#/roadmap">See the roadmap</a>
        </div>
        <div class="hero-stats" data-reveal style="--i:4">
          <div><div class="hstat-n" data-count="${PATHS.length}">${PATHS.length}</div><div class="hstat-l">learning paths</div></div>
          <div><div class="hstat-n" data-count="${total}" data-suffix="+">${total}+</div><div class="hstat-l">sub-lessons</div></div>
          <div><div class="hstat-n">Labs</div><div class="hstat-l">+ challenges</div></div>
          <div><div class="hstat-n">₹0</div><div class="hstat-l">forever</div></div>
        </div>
      </div>
    </section>
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Why KashSec</div>
        <h2>Built to actually get you there</h2>
        <p class="sec-lead">Most security resources assume you already know the basics. This one doesn't — it's engineered for the complete beginner, end to end.</p>
      </div>
      <div class="features">
        ${FEATURES.map((f,i)=>`
          <div class="feature-card" data-spotlight data-reveal style="--i:${i}">
            <div class="feature-ico">${svgIco(f.ico)}</div>
            <h3>${f.t}</h3>
            <p>${f.d}</p>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">The roadmap</div>
        <h2>Everything, in the right order</h2>
        <p class="sec-lead">Start at Path 01 and work down. Each path builds on the last, and every path is split into short sub-lessons.</p>
      </div>
      <div class="paths">
        ${PATHS.map((p,i)=>`
${pathCardHTML(p,i)}
        `).join('')}
      </div>
    </section>
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Careers</div>
        <h2>Where can this take you?</h2>
        <p class="sec-lead">Security is many jobs — here's a shortlist and which paths lead to each.</p>
      </div>
      <div class="careers">
        ${CAREERS.slice(0,4).map((c,i)=>`
          <div class="career-card" data-spotlight data-reveal style="--i:${i}">
            <h3>${c.role}</h3><p>${c.desc}</p>
            <div class="career-follow"><span>Follow:</span> ${c.follow}</div>
          </div>
        `).join('')}
      </div>
      <div class="sec-cta" data-reveal><a class="btn-ghost" href="#/careers">See all careers →</a></div>
    </section>
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Questions</div>
        <h2>Good to know</h2>
      </div>
      ${faqHTML(FAQS.slice(0,4))}
      <div class="sec-cta" data-reveal><a class="btn-ghost" href="#/faq">All FAQs →</a></div>
    </section>
  `;
  wireFAQ();
}

function renderCourseIndex(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">The full course</div>
        <h2>${PATHS.length} paths, ${totalSubLessons()}+ sub-lessons</h2>
        <p class="sec-lead">Each path is split into short focused sub-lessons. Click a path to see its map.</p>
      </div>
      <div class="paths">
        ${PATHS.map((p,i)=>`
${pathCardHTML(p,i)}
        `).join('')}
      </div>
    </section>
  `;
}

function renderPathOverview(pathId){
  const p = findPath(pathId);
  if(!p) return renderNotFound();
  const prog = pathProgress(p.id);
  const firstUnfinished = p.subs.find(s=>!isComplete(p.id,s.id)) || p.subs[0];
  const startLabel = prog.done > 0 ? (prog.pct>=100 ? 'Review from the start' : 'Continue') : 'Start Sub-lesson 1';
  const quiz = QUIZZES && QUIZZES[p.id];
  const quizResult = STATE.quizScores[p.id];
  app.innerHTML = `
    <section class="sec">
      <div class="path-overview">
        <div class="path-tag" data-reveal>Path ${p.n} · ${p.level}</div>
        <h1 data-reveal style="--i:1">${p.title}</h1>
        <p class="lead" data-reveal style="--i:2">${p.desc}</p>
        <div data-reveal style="--i:3">
          <div class="mini-progress" style="max-width:22rem;margin:0 0 1.4rem">
            <div class="mini-progress-track"><div class="mini-progress-fill" style="width:0%" data-pct="${prog.pct}"></div></div>
            <div class="mini-progress-label"><span>${prog.done}/${prog.total} lessons complete</span><span>${prog.pct}%</span></div>
          </div>
          <div class="hero-btns" style="justify-content:flex-start;margin-bottom:0">
            <a class="btn-amber" href="#/lesson/${p.id}/${firstUnfinished.id}">${startLabel} →</a>
            ${quiz ? `<a class="btn-ghost" href="#/quiz/${p.id}">${quizResult ? (quizResult.passed?'✅ Retake quiz':'Retake quiz') : '📝 Take the path quiz'}</a>` : ''}
          </div>
        </div>
        <div class="sublesson-grid">
          ${p.subs.map((s,i)=>`
            <a class="sublesson-card ${isComplete(p.id,s.id)?'is-complete':''}" href="#/lesson/${p.id}/${s.id}" data-reveal style="--i:${i}">
              <div class="sl-n">${isComplete(p.id,s.id) ? '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg>' : p.n+'.'+s.n}</div>
              <div class="sl-body">
                <div class="sl-t">${s.title}</div>
                <div class="sl-d">${s.desc}</div>
              </div>
              ${isBookmarked(p.id,s.id) ? '<svg class="sl-bookmark" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' : ''}
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
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Careers</div>
        <h2>Where this course leads</h2>
        <p class="sec-lead">Security has many careers. Here's what each does and which paths get you there.</p>
      </div>
      <div class="careers">
        ${CAREERS.map((c,i)=>`
          <div class="career-card" data-spotlight data-reveal style="--i:${i%4}">
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
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">FAQ</div>
        <h2>Common questions</h2>
      </div>
      ${faqHTML(FAQS)}
    </section>
  `;
  wireFAQ();
}

function pathCardHTML(p, i){
  const prog = pathProgress(p.id);
  const done = prog.pct >= 100;
  return `
    <a class="path-card ${done?'is-complete':''}" href="#/lesson/${p.id}" data-spotlight data-reveal style="--i:${i%3}">
      <div class="path-title-row">
        <div class="path-num">PATH ${p.n}</div>
        <span class="path-check" title="Path complete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </span>
      </div>
      <div class="path-title">${p.title}</div>
      <div class="path-desc">${p.desc}</div>
      <div class="path-meta">${p.subs.length} sub-lessons · ${p.level}</div>
      ${prog.done > 0 ? `
        <div class="mini-progress">
          <div class="mini-progress-track"><div class="mini-progress-fill" style="width:0%" data-pct="${prog.pct}"></div></div>
          <div class="mini-progress-label"><span>${prog.done}/${prog.total} done</span><span>${prog.pct}%</span></div>
        </div>
      ` : ''}
    </a>
  `;
}

function faqHTML(items){
  return `<div class="faq">${items.map((f,i)=>`
    <div class="faq-item" data-reveal style="--i:${i}">
      <button class="faq-q" aria-expanded="false">
        <span>${f.q}</span>
        <svg class="faq-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('')}</div>`;
}

function wireFAQ(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click',()=>{
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}

async function renderSubLesson(pathId, subId){
  const ctx = findSubContext(pathId, subId);
  if(!ctx) return renderNotFound();
  const myGen = renderGeneration;

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
          <div class="reader-actions">
            <button class="icon-btn ${isBookmarked(pathId,subId)?'active':''}" id="bookmarkBtn" type="button" aria-label="Bookmark this lesson" aria-pressed="${isBookmarked(pathId,subId)}">
              <svg viewBox="0 0 24 24" fill="${isBookmarked(pathId,subId)?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button class="complete-btn ${isComplete(pathId,subId)?'done':''}" id="completeBtn" type="button" aria-pressed="${isComplete(pathId,subId)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span id="completeBtnLabel">${isComplete(pathId,subId) ? 'Completed' : 'Mark complete'}</span>
            </button>
            <button class="btn-ghost sm mobile-only" id="menuBtn" aria-label="Open lesson menu">☰ Lessons</button>
          </div>
        </div>
        <div class="md" id="content"><div class="loading">Loading…</div></div>
        <details class="notes-panel">
          <summary>✍️ My notes on this lesson</summary>
          <div class="notes-panel-body">
            <textarea id="lessonNotes" placeholder="Jot down anything you want to remember — only visible to you, saved automatically.">${escapeHtml(getNote(pathId,subId))}</textarea>
            <div class="notes-status" id="notesStatus"></div>
          </div>
        </details>
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

  recordVisit(pathId, subId);

  document.getElementById('bookmarkBtn').addEventListener('click', ()=>{
    const saved = toggleBookmark(pathId, subId);
    const btn = document.getElementById('bookmarkBtn');
    btn.classList.toggle('active', saved);
    btn.setAttribute('aria-pressed', saved);
    btn.querySelector('svg').setAttribute('fill', saved ? 'currentColor' : 'none');
  });

  document.getElementById('completeBtn').addEventListener('click', ()=>{
    const done = toggleComplete(pathId, subId);
    const btn = document.getElementById('completeBtn');
    btn.classList.toggle('done', done);
    btn.setAttribute('aria-pressed', done);
    document.getElementById('completeBtnLabel').textContent = done ? 'Completed' : 'Mark complete';
    refreshProgressRing();
  });

  let notesTimer = null;
  const notesEl = document.getElementById('lessonNotes');
  const notesStatus = document.getElementById('notesStatus');
  notesEl.addEventListener('input', ()=>{
    clearTimeout(notesTimer);
    notesStatus.textContent = 'Saving…';
    notesTimer = setTimeout(()=>{
      setNote(pathId, subId, notesEl.value);
      notesStatus.textContent = 'Saved';
      setTimeout(()=>{ if(notesStatus.textContent==='Saved') notesStatus.textContent=''; }, 1800);
    }, 500);
  });
  wireProgress();

  try{
    await ensureMarkdownLibs();
  }catch(e){
    if(myGen !== renderGeneration) return; // navigated away while loading — don't touch a dead DOM
    const contentEl = document.getElementById('content');
    if(!contentEl) return;
    contentEl.innerHTML = `
      <h1>Couldn't load the lesson renderer</h1>
      <p>Your connection may be slow or blocking <code>cdn.jsdelivr.net</code>. Check your network and try again.</p>
      <p><button class="btn-amber sm" id="retryLibs" type="button">Retry</button></p>
    `;
    document.getElementById('retryLibs')?.addEventListener('click', ()=>renderSubLesson(pathId, subId));
    return;
  }
  if(myGen !== renderGeneration) return;

  try{
    const res = await fetch(`course/${pathId}/${subId}.md`);
    if(!res.ok) throw new Error(res.status);
    const md = await res.text();
    if(myGen !== renderGeneration) return;
    const contentEl = document.getElementById('content');
    if(!contentEl) return;
    contentEl.innerHTML = enrichMarkdown(md);
    // Render Mermaid diagrams
    if(typeof mermaid !== 'undefined'){
      try{ await mermaid.run({querySelector:'.mermaid'}); }catch(e){}
    }
  }catch(e){
    if(myGen !== renderGeneration) return;
    const contentEl = document.getElementById('content');
    if(!contentEl) return;
    contentEl.innerHTML = `
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

  // Wrap tables in a scrollable container. A table's <thead>/<tr> children keep
  // their native table layout regardless of any display:block on <table> itself,
  // so without this wrapper wide tables blow out the whole page's width instead
  // of scrolling on their own.
  html = html.replace(/<table>([\s\S]*?)<\/table>/g,
    (m)=> `<div class="table-scroll">${m}</div>`);

  return html;
}

function decodeHtml(s){
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
}

function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function defaultLabel(kind){
  return ({tip:'TIP',warn:'WARNING',danger:'DANGER',lab:'🧪 LAB',challenge:'🚩 CHALLENGE',note:'NOTE'})[kind] || kind;
}

function renderNotFound(){
  app.innerHTML = `
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">404</div>
        <h2>This page wandered off</h2>
        <p class="sec-lead">The link may be old or mistyped. Let's get you back on track.</p>
      </div>
      <div class="hero-btns" data-reveal style="--i:1">
        <a class="btn-amber" href="#/">Back to home</a>
        <a class="btn-ghost" href="#/course">Browse the course</a>
      </div>
    </section>
  `;
}

/* ============================================================
   Quiz engine — used for both per-path quizzes and the Final Exam.
   Question-by-question, locks in an answer before revealing it,
   then a results screen with a full review.
   ============================================================ */
function renderQuiz(id){
  const isFinal = id === 'final';
  const quiz = isFinal ? FINAL_QUIZ : QUIZZES[id];
  const path = isFinal ? null : findPath(id);
  if(!quiz || (!isFinal && !path)) return renderNotFound();

  let qi = 0;
  const answers = new Array(quiz.questions.length).fill(null);
  let finished = false;

  function scoreNow(){
    const total = quiz.questions.length;
    const score = answers.reduce((n,a,i)=> n + (a===quiz.questions[i].correct ? 1 : 0), 0);
    return {score, total, pct: Math.round(score/total*100)};
  }

  function paintQuestion(){
    const q = quiz.questions[qi];
    const answered = answers[qi] !== null;
    app.innerHTML = `
      <section class="sec">
        <div class="quiz-wrap">
          <div class="quiz-head" data-reveal>
            <div class="sec-eyebrow">${isFinal ? 'Final Exam' : `Path ${path.n} Quiz`}</div>
            <h2>${quiz.title}</h2>
          </div>
          <div class="quiz-progress-dots">
            ${quiz.questions.map((_,i)=>`<div class="quiz-dot ${i===qi?'current':answers[i]!==null?'answered':''}"></div>`).join('')}
          </div>
          <div class="quiz-card" data-reveal>
            <div class="quiz-qn">Question ${qi+1} of ${quiz.questions.length}</div>
            <div class="quiz-q">${q.q}</div>
            <div class="quiz-options">
              ${q.options.map((opt,oi)=>{
                let cls = '';
                if(answered){
                  if(oi===q.correct) cls = 'correct';
                  else if(oi===answers[qi]) cls = 'wrong';
                }
                return `<button class="quiz-opt ${cls}" data-oi="${oi}" ${answered?'disabled':''} type="button">
                  <span class="opt-letter">${String.fromCharCode(65+oi)}</span><span>${opt}</span>
                </button>`;
              }).join('')}
            </div>
            ${answered ? `<div class="quiz-explain"><strong>${answers[qi]===q.correct?'Correct — ':'Not quite — '}</strong>${q.explain}</div>` : ''}
          </div>
          <div class="quiz-nav">
            ${answered ? `<button class="btn-amber" id="quizNextBtn" type="button">${qi < quiz.questions.length-1 ? 'Next question →' : 'See results →'}</button>` : ''}
          </div>
        </div>
      </section>
    `;
    setupReveal();
    app.querySelectorAll('.quiz-opt').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(answers[qi] !== null) return;
        answers[qi] = parseInt(btn.getAttribute('data-oi'),10);
        paintQuestion();
      });
    });
    document.getElementById('quizNextBtn')?.addEventListener('click', ()=>{
      if(qi < quiz.questions.length-1){ qi++; window.scrollTo(0,0); paintQuestion(); }
      else finish();
    });
  }

  function finish(){
    const {score,total,pct} = scoreNow();
    const passed = pct >= quiz.passPct;
    const result = {score,total,pct,passed,ts:Date.now()};
    if(isFinal) STATE.finalQuiz = result; else STATE.quizScores[id] = result;
    saveState();
    checkAchievements();
    finished = true;
    window.scrollTo(0,0);
    paintResult();
  }

  function paintResult(){
    const {score,total,pct} = scoreNow();
    const passed = pct >= quiz.passPct;
    const R = 66, C = 2*Math.PI*R;
    app.innerHTML = `
      <section class="sec">
        <div class="quiz-result">
          <div class="sec-eyebrow" data-reveal>${isFinal ? 'Final Exam' : `Path ${path.n} Quiz`} results</div>
          <div class="quiz-result-ring" data-reveal style="--i:1">
            <svg viewBox="0 0 150 150">
              <circle class="ring-track" cx="75" cy="75" r="${R}"/>
              <circle class="ring-fill ${passed?'pass':'fail'}" cx="75" cy="75" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C-(C*pct/100)).toFixed(1)}"/>
            </svg>
            <div class="quiz-result-pct">${pct}%</div>
          </div>
          <div class="quiz-result-msg" data-reveal style="--i:2">${passed ? (isFinal ? '🎉 You passed the Final Exam!' : '✅ Path quiz passed!') : 'Not quite — review below and try again'}</div>
          <p class="sec-lead" data-reveal style="--i:3">You scored ${score} out of ${total} (need ${quiz.passPct}% to pass).</p>
          <div class="hero-btns" data-reveal style="--i:4">
            <button class="btn-amber" id="retakeBtn" type="button">Retake quiz</button>
            ${isFinal
              ? (passed ? `<a class="btn-ghost" href="#/certificate">Get your certificate →</a>` : `<a class="btn-ghost" href="#/progress">Back to progress</a>`)
              : `<a class="btn-ghost" href="#/lesson/${id}">Back to path</a>`}
          </div>
          <div class="quiz-review" data-reveal style="--i:5">
            ${quiz.questions.map((q,i)=>{
              const right = answers[i]===q.correct;
              return `<div class="quiz-review-item ${right?'':'wrong'}">
                <div class="qr-q">${i+1}. ${q.q}</div>
                <div class="qr-a">${right
                  ? `<span class="right-answer">✓ ${q.options[q.correct]}</span>`
                  : `<span class="wrong-answer">${q.options[answers[i]]}</span> → <span class="right-answer">${q.options[q.correct]}</span>`}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>
    `;
    setupReveal();
    if(passed) fireConfetti({count: isFinal ? 140 : 80});
    document.getElementById('retakeBtn')?.addEventListener('click', ()=>{
      qi = 0; answers.fill(null); finished = false;
      window.scrollTo(0,0);
      paintQuestion();
    });
  }

  paintQuestion();
}

/* ============================================================
   Certificate — unlocks once the Final Exam is passed. Drawn on a
   <canvas> so it can be downloaded as a PNG, printed to PDF via the
   browser's native print dialog, and shared to LinkedIn.
   ============================================================ */
function certId(name){
  let h = 0;
  const s = name + '|' + (STATE.finalQuiz ? STATE.finalQuiz.ts : '');
  for(let i=0;i<s.length;i++){ h = ((h<<5)-h + s.charCodeAt(i))|0; }
  return 'KS-' + Math.abs(h).toString(36).toUpperCase().slice(0,6).padStart(6,'0');
}

const CERT_SIGNER_NAME = 'Ishfaq';
const CERT_SIGNER_TITLE = 'KashSec Academy';

function drawCertificate(canvas, name){
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2;

  // Background: warm base + soft vignette + a faint dot-grid texture,
  // confined behind everything else drawn afterward.
  ctx.fillStyle = '#FBF9F4';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle = 'rgba(20,20,20,0.035)';
  for(let y=70; y<H-70; y+=22){
    for(let x=70; x<W-70; x+=22){
      ctx.beginPath(); ctx.arc(x,y,1,0,Math.PI*2); ctx.fill();
    }
  }
  const vign = ctx.createRadialGradient(W/2,H/2,H*0.2, W/2,H/2,W*0.65);
  vign.addColorStop(0,'rgba(20,20,20,0)');
  vign.addColorStop(1,'rgba(180,150,90,0.08)');
  ctx.fillStyle = vign;
  ctx.fillRect(0,0,W,H);

  // Faint shield watermark, centered behind the text.
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#0E8377';
  ctx.lineWidth = 5;
  drawShieldPath(ctx, cx, H/2 - 10, 340, 400);
  ctx.stroke();
  ctx.restore();

  // Outer + inner border
  ctx.strokeStyle = '#C77F1E';
  ctx.lineWidth = 6;
  ctx.strokeRect(28,28,W-56,H-56);
  ctx.strokeStyle = '#12897E';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(46,46,W-92,H-92);

  // Top accent bar — brand gradient
  const barGrad = ctx.createLinearGradient(46,0,W-46,0);
  barGrad.addColorStop(0,'#C97B0F'); barGrad.addColorStop(0.5,'#E39A2E'); barGrad.addColorStop(1,'#0E8377');
  ctx.fillStyle = barGrad;
  ctx.fillRect(46, 46, W-92, 7);

  // Corner ornaments: dot + bracket lines
  ctx.fillStyle = '#EFA43A';
  [[28,28],[W-28,28],[28,H-28],[W-28,H-28]].forEach(([ccx,ccy])=>{
    ctx.beginPath(); ctx.arc(ccx,ccy,7,0,Math.PI*2); ctx.fill();
  });
  ctx.strokeStyle = '#0E8377'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  const bl = 26;
  [[70,70,1,1],[W-70,70,-1,1],[70,H-70,1,-1],[W-70,H-70,-1,-1]].forEach(([bx,by,dx,dy])=>{
    ctx.beginPath(); ctx.moveTo(bx+dx*bl, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by+dy*bl); ctx.stroke();
  });

  // Brand mark
  const bmY = 118;
  const bmGrad = ctx.createLinearGradient(cx-30,bmY-30,cx+30,bmY+30);
  bmGrad.addColorStop(0,'#F5B152'); bmGrad.addColorStop(1,'#EA9C2C');
  ctx.fillStyle = bmGrad;
  roundRect(ctx, cx-30, bmY-30, 60, 60, 14); ctx.fill();
  ctx.fillStyle = '#1a1204';
  ctx.font = '700 30px Menlo, Consolas, monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('>_', cx, bmY+2);

  ctx.fillStyle = '#1B2430';
  ctx.font = '700 30px Georgia, "Times New Roman", serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('KashSec Academy', cx, bmY+66);

  // Eyebrow, flanked by short decorative lines
  const eyebrowY = bmY+118;
  ctx.fillStyle = '#0E8377';
  ctx.font = '700 16px Menlo, Consolas, monospace';
  const eyebrowText = 'C E R T I F I C A T E   O F   C O M P L E T I O N';
  const eyebrowW = ctx.measureText(eyebrowText).width;
  ctx.fillText(eyebrowText, cx, eyebrowY);
  ctx.strokeStyle = 'rgba(14,131,119,0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx-eyebrowW/2-46, eyebrowY-6); ctx.lineTo(cx-eyebrowW/2-14, eyebrowY-6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+eyebrowW/2+14, eyebrowY-6); ctx.lineTo(cx+eyebrowW/2+46, eyebrowY-6); ctx.stroke();

  // "This certifies that"
  ctx.fillStyle = '#5B6472';
  ctx.font = '400 22px Georgia, serif';
  ctx.fillText('This certifies that', cx, bmY+178);

  // Name — auto-shrink to fit
  let nameSize = 66;
  ctx.font = `italic 700 ${nameSize}px Georgia, "Times New Roman", serif`;
  while(ctx.measureText(name).width > W - 260 && nameSize > 28){
    nameSize -= 2;
    ctx.font = `italic 700 ${nameSize}px Georgia, "Times New Roman", serif`;
  }
  ctx.fillStyle = '#12151C';
  ctx.fillText(name, cx, bmY+178+nameSize+18);
  const nameBaseline = bmY+178+nameSize+18;
  const underlineGrad = ctx.createLinearGradient(cx-180,0,cx+180,0);
  underlineGrad.addColorStop(0,'rgba(201,123,15,0)'); underlineGrad.addColorStop(0.5,'#C97B0F'); underlineGrad.addColorStop(1,'rgba(201,123,15,0)');
  ctx.strokeStyle = underlineGrad; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx-180, nameBaseline+18); ctx.lineTo(cx+180, nameBaseline+18); ctx.stroke();

  // Body text
  ctx.fillStyle = '#333c49';
  ctx.font = '400 21px Georgia, serif';
  const total = totalSubLessons();
  const bodyLines = wrapText(ctx, `has successfully completed the KashSec Academy cybersecurity curriculum — ${PATHS.length} learning paths and ${total} sub-lessons — and passed the Final Exam with a score of ${STATE.finalQuiz.pct}%.`,
    cx, nameBaseline+62, W-320, 30);
  const bodyBottom = nameBaseline + 62 + (bodyLines-1)*30;

  // Date + signature row — positioned relative to where the body text
  // actually ends, so short names/bodies don't leave a huge empty gap.
  const rowY = Math.min(bodyBottom + 150, H-150);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#12151C';
  ctx.font = '700 18px Georgia, serif';
  ctx.fillText(new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}), 110, rowY);
  ctx.strokeStyle = '#D7DCE5'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(90, rowY+14); ctx.lineTo(330, rowY+14); ctx.stroke();
  ctx.fillStyle = '#8188A0'; ctx.font = '400 13px Menlo, Consolas, monospace';
  ctx.fillText('DATE ISSUED', 90, rowY+36);

  // Signature block: a script-style name, small org line, then the rule
  // and printed caption — mirrors a real diploma's signature line.
  ctx.textAlign = 'right';
  ctx.fillStyle = '#12151C';
  ctx.font = `italic 700 27px Georgia, "Times New Roman", serif`;
  ctx.fillText(CERT_SIGNER_NAME, W-110, rowY-16);
  ctx.fillStyle = '#5B6472';
  ctx.font = '400 13px Georgia, serif';
  ctx.fillText(CERT_SIGNER_TITLE, W-110, rowY);
  ctx.strokeStyle = '#D7DCE5'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W-330, rowY+14); ctx.lineTo(W-90, rowY+14); ctx.stroke();
  ctx.fillStyle = '#8188A0'; ctx.font = '400 13px Menlo, Consolas, monospace';
  ctx.fillText('AUTHORIZED SIGNATURE', W-90, rowY+36);

  // Seal — a ribboned medallion
  drawRibbonSeal(ctx, cx, rowY-4);

  // Cert ID footer
  ctx.textAlign = 'center'; ctx.fillStyle = '#A7ADBB'; ctx.font = '400 13px Menlo, Consolas, monospace';
  ctx.fillText(`Certificate ID: ${certId(name)}  ·  Verify at kashsec.academy`, cx, H-40);
}

function drawShieldPath(ctx, cx, cy, w, h){
  const hw = w/2;
  ctx.beginPath();
  ctx.moveTo(cx-hw, cy-h*0.38);
  ctx.lineTo(cx-hw, cy-h*0.02);
  ctx.bezierCurveTo(cx-hw, cy+h*0.30, cx-hw*0.52, cy+h*0.44, cx, cy+h*0.5);
  ctx.bezierCurveTo(cx+hw*0.52, cy+h*0.44, cx+hw, cy+h*0.30, cx+hw, cy-h*0.02);
  ctx.lineTo(cx+hw, cy-h*0.38);
  ctx.quadraticCurveTo(cx, cy-h*0.56, cx-hw, cy-h*0.38);
  ctx.closePath();
}

function drawRibbonSeal(ctx, sealX, sealY){
  // Ribbon tails
  ctx.fillStyle = '#0B6F64';
  ctx.beginPath();
  ctx.moveTo(sealX-22, sealY+18); ctx.lineTo(sealX-34, sealY+72); ctx.lineTo(sealX-10, sealY+58); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#0E8377';
  ctx.beginPath();
  ctx.moveTo(sealX+22, sealY+18); ctx.lineTo(sealX+34, sealY+72); ctx.lineTo(sealX+10, sealY+58); ctx.closePath(); ctx.fill();

  // Outer ring
  ctx.beginPath(); ctx.arc(sealX, sealY, 48, 0, Math.PI*2);
  ctx.fillStyle = '#EFA43A'; ctx.fill();
  // Inner medallion
  ctx.beginPath(); ctx.arc(sealX, sealY, 40, 0, Math.PI*2);
  ctx.fillStyle = '#0E8377'; ctx.fill();
  // Thin decorative ring
  ctx.beginPath(); ctx.arc(sealX, sealY, 34, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
  // Checkmark
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4.5; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(sealX-16,sealY); ctx.lineTo(sealX-5,sealY+12); ctx.lineTo(sealX+18,sealY-14); ctx.stroke();
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' ');
  let line = '';
  ctx.textAlign = 'center';
  const lines = [];
  words.forEach(word=>{
    const test = line + word + ' ';
    if(ctx.measureText(test).width > maxWidth && line){
      lines.push(line);
      line = word + ' ';
    } else line = test;
  });
  lines.push(line);
  lines.forEach((l,i)=> ctx.fillText(l.trim(), x, y + i*lineHeight));
  return lines.length;
}

function renderCertificate(){
  const passed = !!(STATE.finalQuiz && STATE.finalQuiz.passed);

  if(!passed){
    app.innerHTML = `
      <section class="sec">
        <div class="cert-wrap">
          <div class="sec-eyebrow" data-reveal>Certificate</div>
          <h2 data-reveal style="--i:1">Your certificate is waiting</h2>
          <div class="cert-locked" data-reveal style="--i:2">
            <div class="lock-ico">🔒</div>
            <h3 style="margin-bottom:.6rem">Pass the Final Exam to unlock it</h3>
            <p class="sec-lead" style="margin:0 0 1.4rem">The certificate of completion is issued once you pass the ${FINAL_QUIZ.questions.length}-question Final Exam covering the whole course.</p>
            <a class="btn-amber" href="#/quiz/final">Take the Final Exam →</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="sec">
      <div class="cert-wrap">
        <div class="sec-eyebrow" data-reveal>Certificate</div>
        <h2 data-reveal style="--i:1">🎉 You've earned it</h2>
        <p class="sec-lead" data-reveal style="--i:2">Enter your name exactly as you'd like it to appear, then generate your certificate.</p>
        <form class="cert-form" id="certForm" data-reveal style="--i:3">
          <input type="text" id="certNameInput" placeholder="Your full name" maxlength="60" value="${escapeHtml(STATE.certName)}" required>
          <button class="btn-amber" type="submit">Generate certificate</button>
        </form>
        <div id="certOutput"></div>
      </div>
    </section>
  `;

  const form = document.getElementById('certForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('certNameInput').value.trim();
    if(!name) return;
    STATE.certName = name;
    STATE.achievements['_certificate_issued'] = STATE.achievements['_certificate_issued'] || Date.now();
    saveState();
    checkAchievements();
    paintCertOutput(name);
    fireConfetti({count:160});
  });

  if(STATE.certName) paintCertOutput(STATE.certName);
}

function paintCertOutput(name){
  const out = document.getElementById('certOutput');
  out.innerHTML = `
    <div class="cert-canvas-wrap" data-reveal style="--i:4">
      <canvas id="certCanvas" width="1400" height="990"></canvas>
    </div>
    <div class="cert-actions" data-reveal style="--i:5">
      <button class="btn-amber" id="dlPngBtn" type="button">⬇ Download PNG</button>
      <button class="btn-ghost" id="printBtn" type="button">🖨 Print / Save as PDF</button>
      <button class="btn-ghost" id="linkedinBtn" type="button">Share on LinkedIn</button>
      <button class="btn-ghost" id="copyCaptionBtn" type="button">Copy caption</button>
    </div>
  `;
  const canvas = document.getElementById('certCanvas');
  drawCertificate(canvas, name);
  setupReveal();

  document.getElementById('dlPngBtn').addEventListener('click', ()=>{
    const a = document.createElement('a');
    a.download = `kashsec-certificate-${name.replace(/\s+/g,'-').toLowerCase()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  });

  document.getElementById('printBtn').addEventListener('click', ()=>{
    let printArea = document.getElementById('certPrintArea');
    if(!printArea){
      printArea = document.createElement('div');
      printArea.id = 'certPrintArea';
      document.body.appendChild(printArea);
    }
    printArea.innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Certificate">`;
    window.print();
  });

  document.getElementById('linkedinBtn').addEventListener('click', ()=>{
    const url = encodeURIComponent(location.href.split('#')[0]);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=600');
  });

  document.getElementById('copyCaptionBtn').addEventListener('click', async ()=>{
    const caption = `I just completed the KashSec Academy cybersecurity course — ${PATHS.length} paths and ${totalSubLessons()} lessons, capped off with the Final Exam. 🎓🛡️\n\nFree, self-paced, and open to anyone starting from zero: https://kashsec.vercel.app/\n\n#CyberSecurity #KashSecAcademy #LearningInPublic`;
    try{
      await navigator.clipboard.writeText(caption);
      const btn = document.getElementById('copyCaptionBtn');
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(()=>{ btn.textContent = original; }, 1600);
    }catch(e){
      alert(caption);
    }
  });
}

/* ============================================================
   Roadmap — a visual, clickable timeline of all paths with your
   progress overlaid: done, in-progress, or not started.
   ============================================================ */
function renderRoadmap(){
  const overall = overallProgress();
  const activePathId = STATE.lastVisited ? STATE.lastVisited.pathId : (PATHS.find(p=>pathProgress(p.id).pct<100)||PATHS[0]).id;

  app.innerHTML = `
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Roadmap</div>
        <h2>Your journey through KashSec</h2>
        <p class="sec-lead">Every path, in order. Click any node to jump straight in — your progress is tracked automatically.</p>
        <div class="mini-progress" style="max-width:26rem;margin-top:1.3rem">
          <div class="mini-progress-track"><div class="mini-progress-fill" style="width:0%" data-pct="${overall.pct}"></div></div>
          <div class="mini-progress-label"><span>${overall.done}/${overall.total} lessons complete</span><span>${overall.pct}%</span></div>
        </div>
      </div>
      <div class="roadmap-wrap">
        <div class="roadmap-line"></div>
        ${PATHS.map((p,i)=>{
          const prog = pathProgress(p.id);
          const done = prog.pct >= 100;
          const active = !done && p.id === activePathId;
          return `
            <a class="roadmap-node ${done?'done':active?'active':''}" href="#/lesson/${p.id}" data-reveal style="--i:${i%6}">
              <div class="roadmap-dot">${done
                ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
                : p.n}</div>
              <div class="roadmap-card">
                <div class="roadmap-card-title">${p.title}</div>
                <div class="roadmap-card-desc">${p.desc}</div>
                <div class="mini-progress" style="margin-top:.6rem">
                  <div class="mini-progress-track"><div class="mini-progress-fill" style="width:0%" data-pct="${prog.pct}"></div></div>
                  <div class="mini-progress-label"><span>${prog.done}/${prog.total} done</span><span>${p.level}</span></div>
                </div>
              </div>
            </a>
          `;
        }).join('')}
        <a class="roadmap-node ${STATE.finalQuiz && STATE.finalQuiz.passed ? 'done':''}" href="#/quiz/final" data-reveal style="--i:0">
          <div class="roadmap-dot">${STATE.finalQuiz && STATE.finalQuiz.passed
            ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
            : '🎓'}</div>
          <div class="roadmap-card">
            <div class="roadmap-card-title">Final Exam</div>
            <div class="roadmap-card-desc">20 questions across every path — pass it to unlock your certificate.</div>
          </div>
        </a>
      </div>
    </section>
  `;
}

/* ============================================================
   Progress hub — the personal dashboard: overall stats, per-path
   progress, achievements, bookmarks, notes, and the certificate CTA.
   ============================================================ */
function renderProgressHub(){
  const overall = overallProgress();
  const unlockedCount = Object.keys(STATE.achievements).filter(k=>!k.startsWith('_') && !k.startsWith('theme-explorer-seen')).length;
  const bookmarkEntries = Object.keys(STATE.bookmarks)
    .sort((a,b)=>STATE.bookmarks[b]-STATE.bookmarks[a])
    .map(k=>{ const [pathId,subId]=k.split('/'); return findSubContext(pathId,subId); })
    .filter(Boolean);
  const noteEntries = Object.keys(STATE.notes)
    .map(k=>{ const [pathId,subId]=k.split('/'); return findSubContext(pathId,subId); })
    .filter(Boolean);

  const continueCtx = STATE.lastVisited ? findSubContext(STATE.lastVisited.pathId, STATE.lastVisited.subId) : null;

  app.innerHTML = `
    <section class="sec">
      <div class="sec-head" data-reveal>
        <div class="sec-eyebrow">Your progress</div>
        <h2>Track everything in one place</h2>
        <p class="sec-lead">Progress, bookmarks, notes, achievements, and your certificate — all saved locally in this browser.</p>
      </div>

      ${continueCtx ? `
        <div class="hero-btns" style="justify-content:flex-start" data-reveal style="--i:1">
          <a class="btn-amber" href="#/lesson/${continueCtx.path.id}/${continueCtx.sub.id}">▶ Continue: ${continueCtx.path.n}.${continueCtx.sub.n} ${continueCtx.sub.title} →</a>
        </div>
      ` : ''}

      ${typeof SupabaseSync !== 'undefined' && SupabaseSync.CONFIGURED ? `
        <div class="hub-section" data-reveal style="--i:1">
          <div class="hub-section-head"><h3 style="font-family:'Space Grotesk';font-size:1.15rem">☁️ Sync</h3></div>
          ${SupabaseSync.isSignedIn()
            ? `<div class="hub-list-item" style="cursor:default"><div><div class="hli-t">Signed in as ${escapeHtml(SupabaseSync.userEmail()||'')}</div><div class="hli-d">Progress syncs automatically</div></div><button class="btn-ghost sm" id="hubSignOutBtn" type="button">Sign out</button></div>`
            : `<div class="hub-list-item" style="cursor:default"><div><div class="hli-t">Not signed in</div><div class="hli-d">Sign in to back up and sync across devices</div></div><button class="btn-amber sm" id="hubSignInBtn" type="button">Sign in →</button></div>`}
        </div>
      ` : ''}

      <div class="hub-grid" data-reveal style="--i:2">
        <div class="hub-stat"><div class="hub-stat-n">${overall.pct}%</div><div class="hub-stat-l">Overall complete</div></div>
        <div class="hub-stat"><div class="hub-stat-n">${overall.done}/${overall.total}</div><div class="hub-stat-l">Lessons done</div></div>
        <div class="hub-stat"><div class="hub-stat-n">${quizPassCount()}/${PATHS.length}</div><div class="hub-stat-l">Quizzes passed</div></div>
        <div class="hub-stat"><div class="hub-stat-n">${unlockedCount}/${ACHIEVEMENTS.length}</div><div class="hub-stat-l">Achievements</div></div>
      </div>

      <div class="hub-section" data-reveal style="--i:3">
        <div class="hub-section-head">
          <h3 style="font-family:'Space Grotesk';font-size:1.15rem">📜 Certificate</h3>
        </div>
        ${STATE.finalQuiz && STATE.finalQuiz.passed
          ? `<div class="hub-list-item" style="cursor:default"><div><div class="hli-t">Final Exam passed — ${STATE.finalQuiz.pct}%</div><div class="hli-d">Your certificate is ready</div></div><a class="btn-amber sm" href="#/certificate">View certificate →</a></div>`
          : `<div class="hub-list-item" style="cursor:default"><div><div class="hli-t">Not yet unlocked</div><div class="hli-d">Pass the Final Exam to earn your certificate</div></div><a class="btn-ghost sm" href="#/quiz/final">Take Final Exam →</a></div>`}
      </div>

      <div class="hub-section" data-reveal style="--i:4">
        <div class="hub-section-head"><h3 style="font-family:'Space Grotesk';font-size:1.15rem">🗺️ Path progress</h3></div>
        ${PATHS.map(p=>{
          const prog = pathProgress(p.id);
          return `
            <a class="hub-path-row" href="#/lesson/${p.id}" style="text-decoration:none;color:inherit">
              <span class="hpr-name">${p.n} · ${p.title}</span>
              <div class="mini-progress"><div class="mini-progress-track"><div class="mini-progress-fill" style="width:0%" data-pct="${prog.pct}"></div></div></div>
              <span style="font-family:'JetBrains Mono';font-size:.75rem;color:var(--muted2);flex:none">${prog.done}/${prog.total}</span>
            </a>
          `;
        }).join('')}
      </div>

      <div class="hub-section" data-reveal style="--i:5">
        <div class="hub-section-head"><h3 style="font-family:'Space Grotesk';font-size:1.15rem">🏅 Achievements</h3></div>
        <div class="badge-grid">
          ${ACHIEVEMENTS.map(a=>`
            <div class="badge-card ${STATE.achievements[a.id]?'':'locked'}">
              <div class="badge-ico">${a.ico}</div>
              <div class="badge-t">${a.t}</div>
              <div class="badge-d">${a.d}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="hub-section" data-reveal style="--i:6">
        <div class="hub-section-head"><h3 style="font-family:'Space Grotesk';font-size:1.15rem">🔖 Bookmarks</h3></div>
        ${bookmarkEntries.length ? bookmarkEntries.map(ctx=>`
          <a class="hub-list-item" href="#/lesson/${ctx.path.id}/${ctx.sub.id}">
            <div><div class="hli-t">${ctx.path.n}.${ctx.sub.n} · ${ctx.sub.title}</div><div class="hli-d">${ctx.path.title}</div></div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        `).join('') : `<div class="hub-empty">No bookmarks yet — save a lesson with the 🔖 icon while reading.</div>`}
      </div>

      <div class="hub-section" data-reveal style="--i:7">
        <div class="hub-section-head"><h3 style="font-family:'Space Grotesk';font-size:1.15rem">✍️ Notes</h3></div>
        ${noteEntries.length ? noteEntries.map(ctx=>`
          <a class="hub-list-item" href="#/lesson/${ctx.path.id}/${ctx.sub.id}">
            <div><div class="hli-t">${ctx.path.n}.${ctx.sub.n} · ${ctx.sub.title}</div><div class="hli-d">${escapeHtml(getNote(ctx.path.id,ctx.sub.id)).slice(0,80)}${getNote(ctx.path.id,ctx.sub.id).length>80?'…':''}</div></div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        `).join('') : `<div class="hub-empty">No notes yet — jot one down from the notes panel on any lesson.</div>`}
      </div>

      <div class="hub-section" data-reveal style="--i:8">
        <button class="btn-ghost sm" id="resetProgressBtn" type="button">Reset all local progress</button>
      </div>
    </section>
  `;

  document.getElementById('hubSignInBtn')?.addEventListener('click', openAuth);
  document.getElementById('hubSignOutBtn')?.addEventListener('click', async ()=>{
    const genAtClick = renderGeneration;
    await SupabaseSync.signOut();
    if(genAtClick !== renderGeneration) return; // navigated away before sign-out finished
    renderProgressHub();
    afterRender();
  });

  document.getElementById('resetProgressBtn')?.addEventListener('click', ()=>{
    if(confirm('This clears all progress, bookmarks, notes, quiz scores, and achievements stored in this browser. This cannot be undone. Continue?')){
      STATE = defaultState();
      saveState();
      applyTheme();
      refreshProgressRing();
      renderProgressHub();
      afterRender();
    }
  });
}

/* Mobile nav */
const hamb = document.getElementById('hamb');
const navLinks = document.getElementById('navLinks');
hamb.addEventListener('click',()=>{
  const open = navLinks.classList.toggle('open');
  hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('#navLinks a').forEach(a=>{
  a.addEventListener('click',()=>{
    navLinks.classList.remove('open');
    hamb.setAttribute('aria-expanded','false');
  });
});

/* Sticky-nav shadow on scroll */
const siteNav = document.getElementById('siteNav');
const onScroll = ()=> siteNav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* Theme toggle */
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

/* Progress ring: reflects overall completion, links to the progress hub */
refreshProgressRing();

/* ============================================================
   Global search — Ctrl/Cmd+K or the search icon. Searches path and
   sub-lesson titles/descriptions (metadata only — the lesson bodies
   themselves aren't fetched, so results are instant).
   ============================================================ */
const SEARCH_INDEX = [];
PATHS.forEach(p=>{
  SEARCH_INDEX.push({type:'path', title:p.title, desc:p.desc, url:`#/lesson/${p.id}`, context:`Path ${p.n}`});
  p.subs.forEach(s=>{
    SEARCH_INDEX.push({type:'lesson', title:s.title, desc:s.desc, url:`#/lesson/${p.id}/${s.id}`, context:`${p.n}.${s.n} · ${p.title}`});
  });
});

let searchOverlay = null, searchActiveIndex = -1, searchCurrentResults = [];

function buildSearchOverlay(){
  if(searchOverlay) return searchOverlay;
  searchOverlay = document.createElement('div');
  searchOverlay.className = 'search-overlay';
  searchOverlay.innerHTML = `
    <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search lessons">
      <div class="search-input-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="searchInput" placeholder="Search 151 lessons across 14 paths…" autocomplete="off" spellcheck="false">
        <kbd>Esc</kbd>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
  `;
  document.body.appendChild(searchOverlay);
  searchOverlay.addEventListener('click', (e)=>{ if(e.target === searchOverlay) closeSearch(); });
  const input = searchOverlay.querySelector('#searchInput');
  input.addEventListener('input', ()=> runSearch(input.value));
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeSearch();
    else if(e.key === 'ArrowDown'){ e.preventDefault(); moveSearchSelection(1); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); moveSearchSelection(-1); }
    else if(e.key === 'Enter'){ e.preventDefault(); const r = searchCurrentResults[searchActiveIndex] || searchCurrentResults[0]; if(r) goToSearchResult(r); }
  });
  return searchOverlay;
}

function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlightMatch(text, q){
  if(!q) return text;
  return text.replace(new RegExp('(' + escapeRegex(q) + ')', 'ig'), '<mark>$1</mark>');
}

function runSearch(q){
  const resultsEl = document.getElementById('searchResults');
  q = q.trim();
  if(!q){
    searchCurrentResults = [];
    resultsEl.innerHTML = `<div class="search-empty">Type to search lesson titles and topics — or press <kbd>↵</kbd> on a result to jump in.</div>`;
    return;
  }
  const ql = q.toLowerCase();
  searchCurrentResults = SEARCH_INDEX
    .map(item=>{
      const t = item.title.toLowerCase(), d = item.desc.toLowerCase();
      let score = -1;
      if(t.startsWith(ql)) score = 100;
      else if(t.includes(ql)) score = 70;
      else if(d.includes(ql)) score = 30;
      return {...item, score};
    })
    .filter(item=>item.score > -1)
    .sort((a,b)=>b.score-a.score)
    .slice(0,30);

  searchActiveIndex = searchCurrentResults.length ? 0 : -1;
  if(!searchCurrentResults.length){
    resultsEl.innerHTML = `<div class="search-empty">No lessons matched "${escapeHtml(q)}".</div>`;
    return;
  }
  resultsEl.innerHTML = searchCurrentResults.map((r,i)=>`
    <a class="search-result ${i===0?'active':''}" href="${r.url}" data-idx="${i}">
      <div class="sr-path">${r.context}${r.type==='path'?' · Path overview':''}</div>
      <div class="sr-title">${highlightMatch(r.title, q)}</div>
      <div class="sr-desc">${highlightMatch(r.desc, q)}</div>
    </a>
  `).join('');
  resultsEl.querySelectorAll('.search-result').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); goToSearchResult(searchCurrentResults[parseInt(el.getAttribute('data-idx'),10)]); });
    el.addEventListener('mouseenter', ()=>{ searchActiveIndex = parseInt(el.getAttribute('data-idx'),10); updateSearchActiveClass(); });
  });
}

function moveSearchSelection(dir){
  if(!searchCurrentResults.length) return;
  searchActiveIndex = (searchActiveIndex + dir + searchCurrentResults.length) % searchCurrentResults.length;
  updateSearchActiveClass();
  document.querySelectorAll('.search-result')[searchActiveIndex]?.scrollIntoView({block:'nearest'});
}
function updateSearchActiveClass(){
  document.querySelectorAll('.search-result').forEach((el,i)=> el.classList.toggle('active', i===searchActiveIndex));
}
function goToSearchResult(r){
  STATE.usedSearch = true;
  saveState();
  checkAchievements();
  closeSearch();
  location.hash = r.url;
}

function openSearch(){
  const overlay = buildSearchOverlay();
  overlay.classList.add('open');
  const input = overlay.querySelector('#searchInput');
  input.value = '';
  runSearch('');
  setTimeout(()=>input.focus(), 30);
}
function closeSearch(){
  searchOverlay?.classList.remove('open');
}

document.getElementById('searchBtn').addEventListener('click', openSearch);
window.addEventListener('keydown', (e)=>{
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    openSearch();
  }
});

/* ============================================================
   Optional account + cloud sync (Supabase). Everything here is
   inert when SupabaseSync.CONFIGURED is false — see sync.js. The
   nav's "Sign in" link stays hidden until sync is actually set up.
   ============================================================ */
let authOverlay = null;

function buildAuthOverlay(){
  if(authOverlay) return authOverlay;
  authOverlay = document.createElement('div');
  authOverlay.className = 'search-overlay auth-overlay';
  authOverlay.innerHTML = `
    <div class="search-modal auth-modal" role="dialog" aria-modal="true" aria-label="Account">
      <div class="auth-header">
        <span></span>
        <button class="icon-btn" id="authCloseBtn" aria-label="Close" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="auth-body" id="authBody"></div>
    </div>
  `;
  document.body.appendChild(authOverlay);
  authOverlay.addEventListener('click', (e)=>{ if(e.target === authOverlay) closeAuth(); });
  document.getElementById('authCloseBtn').addEventListener('click', closeAuth);
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && authOverlay.classList.contains('open')) closeAuth(); });
  return authOverlay;
}

function paintAuthSignedOut(){
  const body = document.getElementById('authBody');
  body.innerHTML = `
    <div class="sec-eyebrow">Optional</div>
    <h3 class="auth-title">Sign in to sync</h3>
    <p class="auth-sub">Back up your progress, bookmarks, notes, and quiz scores, and pick up on any device. The site works completely fine without this.</p>
    <form id="magicLinkForm" class="auth-form">
      <input type="email" id="authEmailInput" placeholder="you@example.com" required autocomplete="email">
      <button class="btn-amber sm" type="submit">Send link</button>
    </form>
    <div class="auth-divider"><span>or</span></div>
    <button class="btn-ghost auth-google" id="googleSignInBtn" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>
    <div class="auth-status" id="authStatus"></div>
  `;
  document.getElementById('magicLinkForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('authEmailInput').value.trim();
    if(!email) return;
    const status = document.getElementById('authStatus');
    status.textContent = 'Sending…';
    try{
      await SupabaseSync.signInWithEmail(email);
      document.getElementById('authBody').innerHTML = `
        <div class="sec-eyebrow">Check your email</div>
        <h3 class="auth-title">Link sent to ${escapeHtml(email)}</h3>
        <p class="auth-sub">Click the link in that email on this device to finish signing in. You can close this window.</p>
      `;
    }catch(err){
      status.textContent = 'Something went wrong — ' + (err.message || 'please try again.');
    }
  });
  document.getElementById('googleSignInBtn').addEventListener('click', async ()=>{
    const status = document.getElementById('authStatus');
    try{ await SupabaseSync.signInWithGoogle(); }
    catch(err){ status.textContent = 'Something went wrong — ' + (err.message || 'please try again.'); }
  });
}

function paintAuthSignedIn(){
  const body = document.getElementById('authBody');
  body.innerHTML = `
    <div class="sec-eyebrow">Signed in</div>
    <h3 class="auth-title" style="word-break:break-all">${escapeHtml(SupabaseSync.userEmail()||'')}</h3>
    <p class="auth-sub">Your progress syncs automatically in the background.</p>
    <button class="btn-ghost auth-google" id="signOutBtn" type="button">Sign out</button>
  `;
  document.getElementById('signOutBtn').addEventListener('click', async ()=>{
    await SupabaseSync.signOut();
    closeAuth();
  });
}

function openAuth(){
  buildAuthOverlay();
  authOverlay.classList.add('open');
  if(SupabaseSync.isSignedIn()) paintAuthSignedIn(); else paintAuthSignedOut();
}
function closeAuth(){ authOverlay?.classList.remove('open'); }

function updateAccountNav(user){
  const link = document.getElementById('accountNavLink');
  if(!link) return;
  if(!SupabaseSync.CONFIGURED){ link.style.display = 'none'; return; }
  link.style.display = '';
  link.textContent = user ? (user.email || 'Account') : 'Sign in';
  link.title = user ? 'Manage your account' : 'Sign in to sync your progress';
}

document.getElementById('accountNavLink')?.addEventListener('click', (e)=>{
  e.preventDefault();
  navLinks.classList.remove('open');
  openAuth();
});

/* Auth bootstrap: pick up an existing session, merge local + cloud
   progress on sign-in, and land on a clean URL after a magic-link or
   OAuth redirect. */
if(typeof SupabaseSync !== 'undefined' && SupabaseSync.CONFIGURED){
  let handledInitialSignIn = false;
  SupabaseSync.onAuthChange(async (user)=>{
    updateAccountNav(user);
    if(user && !handledInitialSignIn){
      handledInitialSignIn = true;
      STATE = await SupabaseSync.pullAndMerge(STATE);
      try{ localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); }catch(e){}
      refreshProgressRing();
      if(SupabaseSync.isAuthCallbackUrl() || !location.hash || location.hash === '#'){
        location.hash = '#/progress';
      } else {
        route();
      }
      if(authOverlay && authOverlay.classList.contains('open')) closeAuth();
    }
    if(!user) handledInitialSignIn = false;
  });
  SupabaseSync.init();
} else {
  updateAccountNav(null);
}
