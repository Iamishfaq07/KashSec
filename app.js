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

function route(){
  const hash = location.hash || '#/';
  window.scrollTo(0,0);
  if(hash === '#/' || hash === '#') renderHome();
  else if(hash === '#/course') renderCourseIndex();
  else if(hash === '#/careers') renderCareers();
  else if(hash === '#/faq') renderFAQ();
  else {
    const partsSub = hash.match(/^#\/lesson\/([^/]+)\/([^/]+)$/);
    const partsPath = hash.match(/^#\/lesson\/([^/]+)$/);
    if(partsSub) renderSubLesson(partsSub[1], partsSub[2]);
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
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow" data-reveal>Free cybersecurity course · zero experience needed</div>
        <h1 data-reveal style="--i:1">Start cybersecurity from <span class="amber">absolute zero</span>.</h1>
        <p class="hero-sub" data-reveal style="--i:2">
          Networks, Linux, Python, web hacking, bug bounty, advanced topics, and AI security —
          all written in plain words with hands-on labs, diagrams, and links to real references.
          ${total}+ sub-lessons across ${PATHS.length} paths, always free.
        </p>
        <div class="hero-btns" data-reveal style="--i:3">
          <a class="btn-amber" href="#/lesson/01-introduction/what-is-cybersecurity">Begin lesson 1 →</a>
          <a class="btn-ghost" href="#/course">See the roadmap</a>
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
          <a class="path-card" href="#/lesson/${p.id}" data-spotlight data-reveal style="--i:${i%3}">
            <div class="path-num">PATH ${p.n}</div>
            <div class="path-title">${p.title}</div>
            <div class="path-desc">${p.desc}</div>
            <div class="path-meta">${p.subs.length} sub-lessons · ${p.level}</div>
          </a>
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
        <h2>12 paths, ${totalSubLessons()}+ sub-lessons</h2>
        <p class="sec-lead">Each path is split into short focused sub-lessons. Click a path to see its map.</p>
      </div>
      <div class="paths">
        ${PATHS.map((p,i)=>`
          <a class="path-card" href="#/lesson/${p.id}" data-spotlight data-reveal style="--i:${i%3}">
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
        <div class="path-tag" data-reveal>Path ${p.n} · ${p.level}</div>
        <h1 data-reveal style="--i:1">${p.title}</h1>
        <p class="lead" data-reveal style="--i:2">${p.desc}</p>
        <div data-reveal style="--i:3;margin-top:1.5rem"><a class="btn-amber" href="#/lesson/${p.id}/${p.subs[0].id}">Start Sub-lesson 1 →</a></div>
        <div class="sublesson-grid">
          ${p.subs.map((s,i)=>`
            <a class="sublesson-card" href="#/lesson/${p.id}/${s.id}" data-reveal style="--i:${i}">
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
          <button class="btn-ghost sm mobile-only" id="menuBtn" aria-label="Open lesson menu">☰ Lessons</button>
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
    await ensureMarkdownLibs();
  }catch(e){
    document.getElementById('content').innerHTML = `
      <h1>Couldn't load the lesson renderer</h1>
      <p>Your connection may be slow or blocking <code>cdn.jsdelivr.net</code>. Check your network and try again.</p>
      <p><button class="btn-amber sm" id="retryLibs" type="button">Retry</button></p>
    `;
    document.getElementById('retryLibs')?.addEventListener('click', ()=>renderSubLesson(pathId, subId));
    return;
  }

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
