/* KashSec Academy — quiz question bank.
   Each path has a short quiz; QUIZZES[pathId] = {title, passPct, questions:[...]}.
   Each question: {q, options:[4], correct: index, explain}.
   FINAL_QUIZ draws broader questions across every path. */

const QUIZZES = {
  "00-fresher-basics": {
    title: "Computer Basics & Security Mindset Quiz",
    passPct: 70,
    questions: [
      {q:"What are the two main components of any computer system?", options:["Hardware and Software","Hardware and Internet","RAM and CPU","Monitor and Keyboard"], correct:0, explain:"Hardware is the physical machine; software is the instructions that tell it what to do."},
      {q:"Which best describes how the internet works?", options:["Computers directly wired to one another","A network of networks passing data as packets","One giant computer in the cloud","Radio waves only"], correct:1, explain:"The internet is countless networks interconnected, moving data in small chunks called packets."},
      {q:"Where does your data typically live on a computer?", options:["Only inside the browser","In files organized into folders on storage","Nowhere — it's always temporary","Only on the internet"], correct:1, explain:"Files are stored on disk and organized into a folder hierarchy so you (and the OS) can find them."},
      {q:"What's the biggest reason strong, unique passwords matter?", options:["They're required by law","Reusing passwords means one breach can compromise many accounts","They look more professional","Websites require special characters"], correct:1, explain:"Password reuse is the single biggest reason breaches cascade across multiple accounts."},
      {q:"What's the best first response to a suspicious email asking you to click a link?", options:["Click it to see what happens","Reply asking if it's real","Verify the sender through another channel before clicking anything","Forward it to friends"], correct:2, explain:"Never act on the email itself — confirm through a separate, trusted channel first."}
    ]
  },
  "01-introduction": {
    title: "Introduction to Cybersecurity Quiz",
    passPct: 70,
    questions: [
      {q:"Which best defines cybersecurity?", options:["Only about hacking into other systems","Protecting digital systems, data, and people from harm","Building faster websites","Writing antivirus software only"], correct:1, explain:"Cybersecurity is the broad practice of protecting systems, data, and people — attack is only one small part of the field."},
      {q:"A \"white hat\" hacker is best described as:", options:["Someone who breaks the law for profit","A security researcher who hacks with permission","A hacker who only targets governments","Someone who never touches a computer"], correct:1, explain:"White hats operate with explicit authorization, using hacking skills defensively or to find and report bugs."},
      {q:"What is the \"golden rule\" of ethical hacking?", options:["Never get caught","Always have explicit written permission before testing a system","Only test systems you dislike","Hack first, ask later"], correct:1, explain:"Written authorization is the one line that separates legal security testing from a crime."},
      {q:"Which of these is NOT one of the standard hacker categories?", options:["White hat","Black hat","Grey hat","Rainbow hat"], correct:3, explain:"White, black, and grey hat are the standard categories — \"rainbow hat\" isn't a real term."},
      {q:"What's the best way to keep learning cybersecurity without burning out?", options:["Cram everything in one weekend","Consistent, small daily practice with hands-on labs","Only read theory, never practice","Skip fundamentals and jump straight to advanced exploits"], correct:1, explain:"Steady, hands-on repetition beats cramming — it's how the skills actually stick."}
    ]
  },
  "02-networking": {
    title: "Networking Fundamentals Quiz",
    passPct: 70,
    questions: [
      {q:"What does an IP address primarily identify?", options:["A file on disk","A device's location on a network","A person's identity","A web browser"], correct:1, explain:"An IP address is a network-layer address that identifies where a device is reachable, not who is using it."},
      {q:"What is a \"port\" in networking?", options:["A physical USB port","A numbered endpoint identifying a specific service on a device","A type of cable","A firewall rule only"], correct:1, explain:"Ports let a single IP address run many services at once — e.g. port 443 for HTTPS, port 22 for SSH."},
      {q:"What's the key difference between TCP and UDP?", options:["TCP is reliable and ordered; UDP is fast but unreliable","TCP is faster; UDP is more reliable","They are identical","UDP requires a handshake, TCP doesn't"], correct:0, explain:"TCP trades speed for guaranteed, ordered delivery; UDP trades reliability for raw speed."},
      {q:"What does DNS do?", options:["Encrypts network traffic","Translates domain names into IP addresses","Blocks malicious IPs","Assigns MAC addresses"], correct:1, explain:"DNS is the internet's phonebook, resolving human-friendly names to machine IP addresses."},
      {q:"What does the padlock icon in a browser indicate?", options:["The site is virus-free","The connection is encrypted with HTTPS","The site is government-approved","The site has no ads"], correct:1, explain:"The padlock only confirms an encrypted connection to that domain — nothing about the site's trustworthiness."}
    ]
  },
  "03-linux": {
    title: "Operating Systems & Linux Quiz",
    passPct: 70,
    questions: [
      {q:"What is the primary job of an operating system?", options:["Only to run games","Managing hardware resources and running programs","To connect to the internet only","To design websites"], correct:1, explain:"The OS mediates between hardware and every program that runs on top of it."},
      {q:"Why do many security professionals prefer Linux?", options:["It's the only OS that exists","It's open source, scriptable, and most security tools are built for it","It's the easiest OS for total beginners","It never needs updates"], correct:1, explain:"Openness, scriptability, and tool support make Linux the default environment for security work."},
      {q:"What is a VM snapshot used for?", options:["Taking a screenshot","Saving a VM's state so you can revert after mistakes","Compressing files","Speeding up the CPU"], correct:1, explain:"Snapshots let you experiment freely and roll back instantly if something breaks."},
      {q:"In Linux, what does the command `ls` do?", options:["Deletes a file","Lists files and directories","Logs out the user","Installs software"], correct:1, explain:"`ls` lists the contents of the current (or specified) directory."},
      {q:"What does `sudo` let you do in Linux?", options:["Search files","Run a command with elevated (administrator) privileges","Undo changes","Update software automatically"], correct:1, explain:"`sudo` temporarily elevates your privileges for a single command."}
    ]
  },
  "04-python": {
    title: "Programming & Python Quiz",
    passPct: 70,
    questions: [
      {q:"What is a \"variable\" in programming?", options:["A fixed constant","A named container that stores a value","A type of loop","A syntax error"], correct:1, explain:"A variable is a named slot in memory that can hold — and change — a value."},
      {q:"What does a loop let you do?", options:["Run a block of code repeatedly","Delete variables","Compile code faster","Connect to the internet"], correct:0, explain:"Loops repeat a block of code, which is exactly how tools brute-force thousands of passwords quickly."},
      {q:"Why is Python popular in security?", options:["It's the only language that works","Readable syntax and a huge ecosystem of security libraries","It's the fastest language ever","It doesn't need practice to use"], correct:1, explain:"Python's readability and libraries (requests, scapy, etc.) make it the go-to scripting language in security."},
      {q:"What does an `if/else` statement control?", options:["Import order","Which code runs based on a condition","Variable naming","Screen resolution"], correct:1, explain:"`if/else` branches execution based on whether a condition is true or false — the logic behind every login check."},
      {q:"What's a practical first security-related Python project?", options:["A 3D game","A password strength checker","A word processor","An operating system"], correct:1, explain:"A password checker combines variables, conditionals, and loops into one small, useful security tool."}
    ]
  },
  "05-web-basics": {
    title: "How the Web Works Quiz",
    passPct: 70,
    questions: [
      {q:"In the client-server model, who initiates most web requests?", options:["The server","The client (your browser)","The DNS resolver","The firewall"], correct:1, explain:"Your browser (the client) sends a request; the server responds — understanding this is core to web security."},
      {q:"What is a cookie primarily used for?", options:["Encrypting the browser","Storing small pieces of data like session or login state","Speeding up your CPU","Blocking scripts"], correct:1, explain:"Cookies let a stateless protocol (HTTP) remember who you are between requests."},
      {q:"What format do most modern web APIs use to exchange data?", options:["XML only","JSON","Plain text always","Binary only"], correct:1, explain:"JSON's simple, readable structure made it the dominant format for web APIs."},
      {q:"Why are browser DevTools useful for security learning?", options:["They can only edit CSS","They let you inspect requests, responses, and page behavior","They install malware","They're only for graphic design"], correct:1, explain:"DevTools expose exactly what your browser sends and receives — your first real hacking tool."},
      {q:"What's the \"anatomy\" of a typical web app?", options:["Just HTML","Client, server, database, and APIs working together","Only a database","Only a server"], correct:1, explain:"A real web app is a system of parts working together, not a single file."}
    ]
  },
  "06-fundamentals": {
    title: "Cybersecurity Fundamentals Quiz",
    passPct: 70,
    questions: [
      {q:"What does the \"C\" in the CIA triad stand for?", options:["Control","Confidentiality","Compliance","Cryptography"], correct:1, explain:"CIA = Confidentiality, Integrity, Availability — the three pillars security aims to protect."},
      {q:"What is \"risk\" generally defined as in security?", options:["The cost of a laptop","A function of threat, vulnerability, and impact","Only external hackers","A type of malware"], correct:1, explain:"Risk combines how likely an attack is with how exposed you are and how bad the outcome would be."},
      {q:"Which is a type of malware that encrypts your files for payment?", options:["Worm","Ransomware","Rootkit","Spyware"], correct:1, explain:"Ransomware locks up your data and demands payment to restore access."},
      {q:"Why is password hashing important?", options:["It makes passwords easier to remember","It protects stored passwords even if the database leaks","It speeds up login","It's only used for encryption"], correct:1, explain:"Hashing means a database breach doesn't hand attackers plaintext passwords directly."},
      {q:"What does MFA add to authentication?", options:["Multiple Failed Attempts lockouts","An additional verification factor beyond your password","A faster login","A backup password"], correct:1, explain:"MFA (Multi-Factor Authentication) means a stolen password alone isn't enough to get in."}
    ]
  },
  "07-web-security": {
    title: "Web Security & Hacking Quiz",
    passPct: 70,
    questions: [
      {q:"What is IDOR short for?", options:["Insecure Direct Object Reference","Internal Data Object Request","Invalid Domain Origin Rule","Internet Directory Object Record"], correct:0, explain:"IDOR happens when an app trusts a user-supplied ID without checking if they're allowed to access it."},
      {q:"What does XSS allow an attacker to do?", options:["Physically access a server","Inject malicious scripts that run in a victim's browser","Delete a database instantly","Change DNS records"], correct:1, explain:"Cross-Site Scripting runs attacker-controlled JavaScript in another user's browser session."},
      {q:"What is SQL Injection fundamentally exploiting?", options:["A weak password","Unsanitized user input being treated as part of a database query","A slow network","An expired certificate"], correct:1, explain:"When input isn't separated from the query structure, attackers can inject their own SQL logic."},
      {q:"What does SSRF stand for?", options:["Server-Side Request Forgery","Secure Socket Rate Filter","System Service Recovery Function","Session Sync Request Failure"], correct:0, explain:"SSRF tricks a server into making requests on the attacker's behalf, often reaching internal systems."},
      {q:"What is the OWASP Top 10?", options:["A list of the ten most popular hacking tools","A widely-used checklist of the most critical web application risks","A ranking of the best browsers","A list of hacking movies"], correct:1, explain:"It's the industry-standard reference for the most critical, common web application vulnerabilities."}
    ]
  },
  "08-network-security": {
    title: "Network Security Quiz",
    passPct: 70,
    questions: [
      {q:"What does Nmap primarily do?", options:["Encrypts traffic","Scans networks and ports to discover hosts and services","Writes reports automatically","Blocks malware"], correct:1, explain:"Nmap is the classic tool for discovering what's alive on a network and what services they run."},
      {q:"What is Wireshark used for?", options:["Sending phishing emails","Capturing and analyzing network packets","Managing passwords","Building websites"], correct:1, explain:"Wireshark lets you see the actual packets flowing across a network, in detail."},
      {q:"What's the main purpose of a firewall?", options:["Speed up the network","Filter traffic based on defined security rules","Store files","Replace antivirus entirely"], correct:1, explain:"A firewall enforces rules about what traffic is allowed in and out."},
      {q:"What does IDS stand for and do?", options:["Intrusion Detection System; monitors for and alerts on suspicious activity","Internet Domain Server; resolves names","Integrated Data Storage; backs up files","Instant Download Service; speeds downloads"], correct:0, explain:"An IDS watches traffic or logs and raises alerts on suspicious patterns — it detects, it doesn't block."},
      {q:"What is a Man-in-the-Middle (MITM) attack?", options:["Malware that deletes files","An attacker secretly intercepting communication between two parties","A denial-of-service flood","A weak password guess"], correct:1, explain:"MITM attacks position the attacker between two parties, able to read or alter traffic — HTTPS is the main defense."}
    ]
  },
  "09-ethical-hacking": {
    title: "Ethical Hacking Quiz",
    passPct: 70,
    questions: [
      {q:"What is the first phase of most ethical hacking methodologies?", options:["Exploitation","Reconnaissance","Reporting","Cleanup"], correct:1, explain:"You gather information about the target before ever attempting to attack it."},
      {q:"Why is a signed Rules of Engagement (RoE) important before testing?", options:["It's optional paperwork","It legally authorizes and scopes the test, protecting both parties","It's only needed for large companies","It speeds up scanning"], correct:1, explain:"The RoE is what turns hacking into a legal, authorized engagement instead of a crime."},
      {q:"What happens in the \"post-exploitation\" phase?", options:["Nothing — testing ends at access","Assessing what an attacker could do next: privesc, pivoting, data access","Writing the initial proposal","Buying new hardware"], correct:1, explain:"Post-exploitation shows the real-world impact of the access gained."},
      {q:"What is the most important deliverable of a penetration test?", options:["The exploit code","A clear report explaining findings, risk, and remediation","A list of tools used","A certificate of completion"], correct:1, explain:"The client pays for the report — it's what turns findings into actual fixes."},
      {q:"What's a common entry-level certification path into ethical hacking?", options:["Starting with OSCP directly","Security+ then more hands-on certs like eJPT or PNPT","No certifications needed, ever","A college degree only"], correct:1, explain:"Most people build up through foundational certs before tackling advanced, hands-on ones."}
    ]
  },
  "10-bug-bounty": {
    title: "Bug Bounty Quiz",
    passPct: 70,
    questions: [
      {q:"What is a bug bounty program?", options:["A paid subscription to a security tool","A program where companies pay researchers for responsibly disclosed vulnerabilities","An illegal hacking contest","A certification exam"], correct:1, explain:"Companies pay for legitimate vulnerability reports through defined, in-scope programs."},
      {q:"Why might beginners prefer wide-scope, newer programs?", options:["They pay more automatically","They tend to have more low-hanging fruit and less competition","They don't require reports","They're always private"], correct:1, explain:"Less-picked-over targets give beginners a realistic shot at finding something."},
      {q:"What is a \"recon pipeline\" typically used for?", options:["Writing final reports","Automating discovery of subdomains, endpoints, and changes at scale","Designing UI mockups","Encrypting traffic"], correct:1, explain:"A recon pipeline chains tools together to continuously map an attack surface."},
      {q:"What makes a bug bounty report get paid well?", options:["A vague description with no proof","Clear steps to reproduce, impact, and evidence","Reporting a theoretical bug with no evidence","Reporting the same bug to multiple programs"], correct:1, explain:"Clarity and proof are what convince a triager the bug is real and worth paying for."},
      {q:"What is an IDOR-style bug often described as for beginners?", options:["Impossible to find", "A friendly first bug — changing an ID reveals someone else's data","Only findable by AI","Not exploitable in practice"], correct:1, explain:"IDOR bugs are often simple to spot and a great entry point into bug hunting."}
    ]
  },
  "11-advanced": {
    title: "Advanced Cyber Topics Quiz",
    passPct: 70,
    questions: [
      {q:"What is privilege escalation?", options:["Lowering your access on purpose","Gaining higher-level access than originally granted","Changing your username","Updating software"], correct:1, explain:"Privesc is turning limited initial access into administrator or root-level control."},
      {q:"What is Active Directory primarily used for?", options:["Hosting websites","Centralized management of users, computers, and permissions in Windows networks","Sending emails","Antivirus scanning"], correct:1, explain:"AD is the backbone of identity and access management in most corporate Windows environments."},
      {q:"In cloud security, what does IAM stand for?", options:["Internet Access Manager","Identity and Access Management","Internal Audit Module","Integrated Application Monitor"], correct:1, explain:"IAM controls who (or what) can do what within a cloud environment."},
      {q:"What is the goal of DFIR?", options:["Designing new software","Digital Forensics and Incident Response — investigating and responding to breaches","Marketing security products","Building firewalls only"], correct:1, explain:"DFIR is about figuring out what happened during a breach and containing it."},
      {q:"What does \"purple teaming\" combine?", options:["Two red teams","Red team (attack) and blue team (defense) collaborating","Only automated tools","Sales and marketing teams"], correct:1, explain:"Purple teaming has attackers and defenders work together to improve detection and response."}
    ]
  },
  "12-ai-security": {
    title: "AI & AI Security Quiz",
    passPct: 70,
    questions: [
      {q:"At a basic level, how do LLMs generate text?", options:["By looking up answers in a fixed database","By predicting the most likely next token based on learned patterns","By directly copying training data","By running traditional if/else rules only"], correct:1, explain:"LLMs generate text one token at a time, based on probability patterns learned during training."},
      {q:"What is prompt injection often compared to?", options:["A denial-of-service attack","The \"SQL injection\" of AI — malicious instructions hidden in input","A phishing email only","A firewall bypass"], correct:1, explain:"Like SQL injection, it exploits an app's failure to separate trusted instructions from untrusted input."},
      {q:"What is a \"jailbreak\" in the context of LLMs?", options:["A physical hack of a server","An attempt to bypass an AI's safety policies through crafted prompts","Unlocking a smartphone","A type of malware"], correct:1, explain:"Jailbreaks try to trick a model into ignoring its safety guidelines."},
      {q:"What does the OWASP LLM Top 10 provide?", options:["A ranking of AI companies","A checklist of the most critical risks in LLM applications","A list of the best AI models","A programming language"], correct:1, explain:"It's the AI-application equivalent of the classic OWASP web Top 10."},
      {q:"Why is \"AI red teaming\" important?", options:["To make AI models faster","To adversarially test AI systems for safety and security issues before attackers do","To replace human developers","To increase model size"], correct:1, explain:"Red teaming finds an AI system's weaknesses proactively, before real attackers do."}
    ]
  },
  "13-career-prep": {
    title: "Career Prep Quiz",
    passPct: 70,
    questions: [
      {q:"What should a security resume emphasize most?", options:["Every tool you've ever heard of","Concrete projects, impact, and relevant skills","Personal hobbies unrelated to tech","Length over clarity"], correct:1, explain:"Specific, demonstrable impact stands out far more than a buzzword list."},
      {q:"Why do projects and a GitHub portfolio matter for landing a job?", options:["They're irrelevant to hiring","They provide tangible proof of hands-on skill beyond certificates","Only large companies check GitHub","They replace the need for interview prep entirely"], correct:1, explain:"Real projects prove you can actually do the work, not just recite theory."},
      {q:"What's a smart way to approach certifications?", options:["Get every certification you can find at once","Choose certifications aligned with your target role and timeline","Avoid certifications entirely","Only certifications matter, skills don't"], correct:1, explain:"Targeted certs aligned with your goals matter far more than a long, unfocused list."},
      {q:"What best describes effective job searching in security?", options:["Applying to one company and waiting","A mix of networking, targeted applications, and community involvement","Only relying on recruiters","Never following up"], correct:1, explain:"Multiple channels — network, applications, community — dramatically improve your odds."},
      {q:"What's a good habit during your first 90 days in a new security role?", options:["Staying silent and avoiding questions","Learning the environment, asking questions, and building trust","Immediately changing all existing processes","Working alone without communicating"], correct:1, explain:"Early on, understanding context and building trust matters more than making big changes."}
    ]
  }
};

const FINAL_QUIZ = {
  title: "KashSec Final Exam",
  passPct: 70,
  questions: [
    {q:"What does the CIA triad stand for?", options:["Confidentiality, Integrity, Availability","Control, Identity, Access","Cyber, Internet, Application","Confidentiality, Internet, Authorization"], correct:0, explain:"The three pillars security fundamentally protects."},
    {q:"What does HTTPS add on top of HTTP?", options:["Faster loading only","Encryption via TLS/SSL","A bigger padlock icon","Nothing meaningful"], correct:1, explain:"HTTPS encrypts the connection so data can't be read or tampered with in transit."},
    {q:"What is phishing?", options:["A network scanning technique","A social engineering attack tricking users into revealing information","A type of firewall","A programming language"], correct:1, explain:"Phishing targets humans, not machines, through deception."},
    {q:"What's the purpose of a VPN?", options:["Encrypt and tunnel traffic over an untrusted network","Speed up your CPU","Block all cookies","Replace antivirus"], correct:0, explain:"A VPN creates an encrypted tunnel, protecting traffic on untrusted networks."},
    {q:"What does the OWASP Top 10 list?", options:["The ten best hacking tools","The most critical common web application security risks","The top ten programming languages","The ten largest tech companies"], correct:1, explain:"It's the industry-standard reference for critical web app vulnerabilities."},
    {q:"What is SQL Injection?", options:["A hardware failure","Manipulating a database query via unsanitized user input","A type of malware","A network protocol"], correct:1, explain:"Untrusted input is treated as executable SQL instead of plain data."},
    {q:"What does IDOR exploit?", options:["Weak encryption","Broken access control via predictable object references","Slow servers","DNS misconfiguration"], correct:1, explain:"IDOR happens when an app fails to verify a user is authorized to access a referenced object."},
    {q:"What's the difference between a vulnerability and an exploit?", options:["They're the same thing","A vulnerability is a weakness; an exploit is what abuses it","An exploit is always legal","A vulnerability only affects hardware"], correct:1, explain:"A vulnerability is the flaw; an exploit is the technique or code that takes advantage of it."},
    {q:"What is the purpose of Nmap?", options:["Encrypting traffic","Network and port scanning to discover hosts and services","Writing documents","Managing passwords"], correct:1, explain:"Nmap maps out what's alive on a network and what's running."},
    {q:"What does DNS resolve?", options:["Passwords to hashes","Domain names to IP addresses","Files to folders","Ports to protocols"], correct:1, explain:"DNS is the internet's naming system, translating names into addresses."},
    {q:"What's the goal of a penetration test report?", options:["List every tool used","Communicate findings, risk, and remediation clearly","Impress with jargon","Prove the tester's skill only"], correct:1, explain:"The report is the actual deliverable that drives real-world fixes."},
    {q:"What is ransomware?", options:["Software that speeds up your PC","Malware that encrypts data and demands payment","A type of firewall","A network protocol"], correct:1, explain:"Ransomware holds data hostage until a ransom is paid."},
    {q:"What does MFA add to authentication?", options:["A backup password","An additional verification factor beyond your password","Faster logins","Automatic password resets"], correct:1, explain:"Multi-Factor Authentication means a stolen password alone isn't enough."},
    {q:"What is privilege escalation?", options:["Reducing your access","Gaining higher access than originally granted","Changing your email","Updating an app"], correct:1, explain:"Turning limited access into elevated, often administrator-level, control."},
    {q:"In Linux, what does `sudo` do?", options:["Search files","Run a command with elevated privileges","Delete a directory","Compress files"], correct:1, explain:"`sudo` temporarily elevates your privileges for a specific command."},
    {q:"What is a bug bounty program?", options:["A paid antivirus subscription","Paying researchers for responsibly disclosed vulnerabilities","A hacking video game","A type of malware"], correct:1, explain:"Companies reward researchers for legitimate, in-scope vulnerability reports."},
    {q:"What is prompt injection in AI security?", options:["A hardware exploit","Malicious instructions hidden in input to manipulate an LLM","A type of firewall","A network protocol"], correct:1, explain:"It's the AI-era equivalent of injecting untrusted instructions into a trusted context."},
    {q:"What is the \"golden rule\" of ethical hacking?", options:["Always get explicit written permission first","Never document your findings","Hack anything you find interesting","Work alone, always"], correct:0, explain:"Authorization is what makes hacking legal and ethical."},
    {q:"What is Active Directory used for?", options:["Hosting a blog","Centralized management of users, computers, and permissions in Windows networks","Sending marketing emails","Rendering 3D graphics"], correct:1, explain:"AD is the identity backbone of most enterprise Windows networks."},
    {q:"What's a strong first step when you receive a suspicious email?", options:["Click the link to investigate","Verify the sender through another channel before clicking anything","Reply asking if it's legitimate","Forward it to everyone you know"], correct:1, explain:"Never interact with the suspicious message itself — verify independently first."}
  ]
};
