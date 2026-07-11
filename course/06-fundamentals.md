# Path 06 — Cybersecurity Fundamentals

> **Level:** Beginner → Intermediate · **Lessons:** 8 · **Assumed knowledge:** Paths 01–05.

You've built the practical foundations — networks, Linux, Python, the web. Now we cover the *conceptual* foundations: the vocabulary and mental models every security professional assumes you already know. This is the ground that certificates like **CompTIA Security+** and **CEH** cover, and it's the shared language of the industry. Every future path will lean on the words and models you meet here. Read carefully — this is a lesson in *thinking* like a security person.

---

## Lesson 6.1 — The CIA triad

### Why this matters
The entire field of security is built on three simple goals, remembered as the **CIA triad**. Once you know it, you'll see every security control fall into one of the three. It's the field's most important sentence.

### The three goals
Nothing to do with the spy agency — these are three properties every security control tries to protect:

- **Confidentiality** — keep secrets secret. Only the right people can *read* the data.
- **Integrity** — keep data correct. Nobody can *change* it undetected.
- **Availability** — keep it working. The system is *up* when people need it.

A bank illustrates all three: your account details are kept private (**confidentiality**), your balance can't be secretly altered (**integrity**), and the app stays online when you need to check it (**availability**).

### Real-world examples of each being broken
- **Confidentiality broken:** a breach dumps millions of customers' emails and passwords online.
- **Integrity broken:** an attacker sneaks into an online shop and changes prices, or edits a bank record.
- **Availability broken:** a **DDoS** attack floods a website with fake traffic so real users can't reach it.

The three often trade off. Encrypting a database heavily protects confidentiality but might slow it down (hurting availability). Making a system extremely available (many copies) increases the surface area for confidentiality attacks. Real security is picking the right balance for the situation.

### 🚩 Challenge
An attacker doesn't steal or change any data — they just take a website offline for hours. Which part of the CIA triad have they attacked?

<details><summary>Answer</summary>Availability — the system is no longer up when users need it.</details>

### Key terms
- **CIA triad** — Confidentiality, Integrity, Availability.
- **DDoS** — Distributed Denial of Service; floods a system to attack availability.

### Recap
- Security aims for Confidentiality (secret), Integrity (correct), Availability (up).
- Every control supports one (or more) of these three.
- They can trade off, and real security is picking the right balance.

---

## Lesson 6.2 — Threats, vulnerabilities & risk

### Why this matters
These three words get muddled constantly, even by professionals. Getting them straight lets you read security news, understand assessments, and communicate precisely.

### The unlocked-door analogy
Imagine your front door has no lock. Three ideas immediately appear:

- **Vulnerability** — the *weakness itself*. The unlocked door.
- **Threat** — *who or what could exploit it*. A burglar walking past.
- **Risk** — the *likelihood and cost of it actually happening*. High if you live in a busy area and keep valuables in view; low if you live in a remote lighthouse with nothing worth taking.

Formally, security folks often write:

> **Risk = Threat × Vulnerability × Impact**

You reduce risk by lowering any factor. Fix the vulnerability (put a lock on). Reduce the threat (move to a safer street). Reduce the impact (don't store valuables there).

### More words you'll hear
- **Exploit** — the *actual technique* that abuses a vulnerability. A picklock is an exploit; the unlocked door is the vulnerability.
- **Zero-day** — a vulnerability nobody has a fix for yet, often unknown to the vendor. Extremely valuable to attackers.
- **CVE** — a public, numbered identifier for a known vulnerability (e.g., `CVE-2024-1234`). You'll see these in vulnerability reports and patch notes.
- **Patch** — a fix released to close a vulnerability. "Patch Tuesday" is Microsoft's monthly release.
- **Attack surface** — everything an attacker could try to reach or interact with. Bigger surface = more risk.

### Defence in depth
No single control is perfect. **Defence in depth** means layering many controls so that if one fails, others still stop the attack. On your house: a lock *and* an alarm *and* a camera *and* a dog. On a network: a firewall *and* strong logins *and* least privilege *and* monitoring. Attackers only need one gap; defenders must cover them all.

### 🚩 Challenge
A widely used piece of software has a serious security flaw, but the vendor hasn't released a fix yet. What is this called?

<details><summary>Answer</summary>A zero-day (vulnerability).</details>

### Key terms
- **Vulnerability** — the weakness.
- **Threat** — who could exploit it.
- **Risk** — likelihood × impact.
- **Exploit** — the technique that abuses a vulnerability.
- **Zero-day / CVE / patch** — an unfixed flaw / a public flaw ID / the fix.
- **Attack surface** — everything exposed to attackers.
- **Defence in depth** — layered controls so one failure isn't fatal.

### Recap
- Vulnerability = weakness. Threat = who could exploit it. Risk = likelihood × impact.
- An exploit is the actual technique; a zero-day is an unfixed flaw.
- Bigger attack surfaces mean more risk; defence in depth reduces the damage of any single failure.

---

## Lesson 6.3 — Attackers and how they think (the kill chain)

### Why this matters
Attackers aren't magic — they follow predictable phases. If you know the pattern, you know *where* defenders can break the chain. This model is the shared mental map used across the whole industry.

### Who attacks
Not all attackers are the same. Their skill, motive, and patience vary hugely:

- **Script kiddies** — beginners running others' tools. High noise, low skill. They rely on easy targets.
- **Hacktivists** — attackers with a political or social cause.
- **Cybercriminals** — organised groups after money. Ransomware and fraud gangs live here.
- **Insiders** — employees or contractors misusing legitimate access. Hard to detect because they already belong.
- **Nation-state / APT** — well-funded, patient, and stealthy. APT stands for *Advanced Persistent Threat*. They target governments and big companies and can hide for months.

### The cyber kill chain
A famous seven-phase model (originally from Lockheed Martin) describes how a real intrusion typically unfolds. Defenders study it because **breaking any one link stops the attack**:

1. **Reconnaissance** — research the target (people, systems, tech).
2. **Weaponisation** — build the payload (e.g., a malicious document).
3. **Delivery** — get it to the victim (email, USB, malicious link).
4. **Exploitation** — trigger the vulnerability (open the attachment, run the script).
5. **Installation** — establish a foothold (drop malware, create a backdoor).
6. **Command & Control (C2)** — the attacker's remote control over the compromised machine.
7. **Actions on objectives** — steal data, encrypt files, move deeper, cause damage.

### MITRE ATT&CK — the modern reference
While the kill chain is the *phases*, the **MITRE ATT&CK** framework catalogues the *specific techniques* attackers use at each phase — hundreds of them, mapped to real-world incidents. SOC analysts and defenders live in it. When you're ready, bookmark **attack.mitre.org**; it's the single richest, freest resource in defensive security.

### 🚩 Challenge
What's the letter-perfect meaning of "APT"?

<details><summary>Answer</summary>Advanced Persistent Threat — a stealthy, well-funded, often state-sponsored attacker.</details>

### Key terms
- **Script kiddie / hacktivist / cybercriminal / insider / APT** — attacker types.
- **Kill chain** — the phases of an intrusion.
- **C2 (Command & Control)** — the attacker's remote channel to compromised machines.
- **MITRE ATT&CK** — a catalogue of specific attacker techniques.

### Recap
- Attackers vary from script kiddies to APTs, with very different skill and patience.
- Intrusions follow phases (recon → weaponise → deliver → exploit → install → C2 → objectives).
- Defenders aim to break any single link.
- MITRE ATT&CK is the shared language and technique catalogue — bookmark it.

---

## Lesson 6.4 — Malware: the germs of computers

### Why this matters
"Malware" is a huge umbrella covering many kinds of malicious software, each with a distinct trick. Knowing the types helps you talk about attacks precisely and defend against them appropriately.

### The germ analogy
**Malware** means *malicious software* — hostile programs designed to harm, spy on, or profit from a system. Think of them like different germs, each with its own way of infecting and spreading.

### The main families
- **Virus** — attaches itself to a legitimate file. Spreads when a user opens the infected file.
- **Worm** — spreads **by itself** across networks, without user interaction. Historically devastating (e.g., WannaCry).
- **Trojan** — pretends to be something useful (a game, a "cracked" app) but hides malicious code. Named after the Trojan Horse.
- **Ransomware** — encrypts your files and demands payment (usually in cryptocurrency) to unlock them. One of the biggest threats to businesses today.
- **Rootkit** — hides deep in the system to keep persistent, invisible access — often stealthier than the other types.
- **Spyware / Keylogger** — quietly watches and reports back: browsing habits, keystrokes, screenshots, credentials.
- **Adware** — pushes unwanted adverts; often bundled with free downloads. Annoying but usually less harmful.
- **Botnet client** — turns your machine into one of many "bots" a criminal controls remotely, often used for DDoS attacks or spam.
- **Fileless malware** — lives in memory only, leaving little trace on disk. Modern and hard to spot.

### How malware typically arrives
- **Phishing emails** with malicious attachments or links (the most common route).
- **Malicious downloads** — pirated software, fake installers, "free" tools from dodgy sites.
- **Drive-by downloads** — visiting a compromised website that silently exploits a browser flaw.
- **Removable media** — a dropped USB stick that a curious person plugs in.
- **Software supply chain** — a legitimate program is updated with malicious code (a growing, scary trend).

### Everyday defences that genuinely help
Not glamorous, but effective for you and everyone you help:

1. **Keep software updated.** Most malware exploits known, already-patched flaws.
2. **Do not open unexpected attachments** or run programs you didn't seek out.
3. **Use antivirus / EDR** software and let it update.
4. **Back up your important data** so ransomware can't hold you hostage.
5. **Least privilege** — don't run daily as an admin; a compromised admin account is far worse than a compromised standard user.

### 🚩 Challenge
Which type of malware encrypts your files and demands payment to unlock them?

<details><summary>Answer</summary>Ransomware.</details>

### Key terms
- **Virus / worm / trojan / ransomware / rootkit / spyware / adware / botnet** — malware families.
- **Fileless malware** — malicious code that lives in memory, not on disk.
- **EDR** — Endpoint Detection & Response; modern antivirus that also watches behaviour.
- **Least privilege** — using minimum necessary access day-to-day.

### Recap
- Malware is malicious software with many variants, each with a distinct trick.
- Big families: virus, worm, trojan, ransomware, rootkit, spyware.
- Common routes: phishing, dodgy downloads, USBs, supply chain.
- Practical defence: updates, no unexpected attachments, backups, least privilege.

---

## Lesson 6.5 — Passwords, hashing & why breaches hurt

### Why this matters
Passwords are the keys to your digital life. How companies handle them decides whether a breach is a minor inconvenience or a catastrophe. This lesson pulls back the curtain on what actually happens when you type a password.

### The wrong way (and why it's dead)
Storing passwords as **plain text** is the worst possible design — one breach hands attackers every user's login instantly. It's rare today, but it still happens on badly written sites. Recognise it as unforgivable.

### The right way: hashing
Well-built sites **never store your actual password**. They store a scrambled version called a **hash**, made by a one-way process. When you log in, they:

1. Take the password you just typed.
2. Hash it the same way.
3. Compare that hash to the stored one. If they match — you're in.

The stored hash is (in theory) useless to an attacker who steals the database — because you can't turn a hash back into the password. That's the whole point of "one-way."

Examples of hash algorithms:
- **MD5** and **SHA-1** — old, fast, and now considered broken for password use.
- **SHA-256 / SHA-3** — modern general-purpose hashes, but *still too fast* for passwords alone.
- **bcrypt / scrypt / argon2** — slow, purpose-built for passwords. **This is what a good site uses.**

### Why "fast" is bad for passwords
Attackers who steal a hash database try to crack it by **guessing**: hash a candidate password, compare it to the stolen hash, repeat billions of times. A fast hash like SHA-256 can be tried billions of times per second on a modern GPU. A slow hash like bcrypt might allow only thousands per second — a massive slowdown that makes cracking impractical.

### Salting — stopping rainbow tables
Even with hashing, there's a problem: if two users choose the same password, they get the same hash. Attackers precompute huge tables of common passwords and their hashes (called **rainbow tables**) and reverse-lookup any match instantly.

The fix is a **salt** — random extra data added to each password before hashing. Two users with the same password get *different* hashes because their salts differ. Rainbow tables become useless because the attacker would need a precomputed table for every possible salt.

> **In short:** a strong password system uses a slow hash (bcrypt/argon2) with a unique salt per user. Anything less is a bug.

### Why password reuse is such a disaster
When a weak site is breached and cracks your password, attackers immediately try it on your **email, bank, and shopping** accounts. This is **credential stuffing**, and it works terrifyingly well because most people reuse passwords. One breach becomes many.

The fix is boring but life-changing:

1. **Use a password manager** (Bitwarden, 1Password, KeePass). Let it generate a unique random password for every site.
2. **Turn on MFA** (next lesson) so even a stolen password isn't enough.
3. **Change reused passwords now** — start with your email account, which resets everything else.

### 🧪 Lab — See a hash yourself
1. In Kali, run:
   ```bash
   echo -n "password123" | sha256sum
   echo -n "password124" | sha256sum
   ```
2. Notice the two hashes are completely different despite the passwords differing by one character. That's a good hash.
3. Now run the first command again — the hash is identical to the first run. That's why unsalted hashes leak information: identical passwords give identical hashes.

### 🚩 Challenge
Two users choose the same password on a hashed-but-unsalted system. What's the giveaway an attacker sees?

<details><summary>Answer</summary>Their password hashes are identical — a big clue for the attacker.</details>

### Key terms
- **Hash** — a one-way scramble of data.
- **Salt** — random data added per password so identical inputs don't match.
- **bcrypt / scrypt / argon2** — slow hashes purpose-built for passwords.
- **Credential stuffing** — trying a stolen password across many sites.
- **Password manager** — an app that generates and stores strong unique passwords.

### Recap
- Good sites store hashes, not passwords, using slow algorithms (bcrypt/argon2).
- Salt stops identical passwords from producing identical hashes.
- Never reuse passwords — use a password manager and MFA.
- Old fast hashes (MD5, SHA-1) are unsafe for passwords.

---

## Lesson 6.6 — Phishing & social engineering

### Why this matters
The easiest way past every technical defence is **tricking a person**. Social engineering causes more real-world breaches than any single technical bug — and everyone in your life should know how to spot it.

### Attacking humans, not code
**Social engineering** is manipulating people into doing what an attacker wants — revealing information, running a program, granting access. It works because humans have consistent psychological levers (urgency, authority, curiosity, fear, helpfulness) that attackers can push.

### The forms you'll see
- **Phishing** — mass fake messages (usually email) designed to trick anyone who bites.
- **Spear-phishing** — a *targeted*, personalised version aimed at a specific person or company. Uses details about you to seem real.
- **Whaling** — spear-phishing aimed at *executives* (CEO, CFO) — high-value targets.
- **Vishing** — voice phishing. A phone call from "your bank" or "IT support."
- **Smishing** — SMS-based phishing ("your delivery is held, click here").
- **Pretexting** — a fabricated but believable story to win trust ("I'm from HR, I just need to confirm...").
- **Baiting** — leaving something tempting for the victim to find (a USB drive labelled "Payroll" in the car park).
- **Tailgating / piggybacking** — physically walking in behind someone who holds the door — bypassing physical security.
- **Quishing** — QR-code phishing; a poster or email with a malicious QR code.

### How to spot phishing
Learn these signals and share them widely — they save real people real money:

- **Urgency and fear** — "Your account will be closed in 24 hours!" Emotion clouds judgement, which is why attackers use it.
- **Odd sender address** — the display name looks right but the actual email is `no-reply@securebank-verify.co`. Hover to reveal.
- **Mismatched links** — hover over links (don't click). A link that says `bank.com` but points to `bank-security-check.ru` is a giveaway.
- **Requests for passwords, MFA codes, or gift cards** — legitimate organisations never ask for these.
- **Unexpected attachments** — especially `.zip`, `.iso`, `.doc`, or macro-enabled files.
- **Small mistakes** — grammar, spacing, off-brand logos. Modern phishing is polished, but tells still creep in.

### The professional habit
Never act on a message that pushes urgency. Instead:

1. **Pause.** Urgency is the enemy of good judgement.
2. **Verify through a separate channel.** Log in by typing the address yourself, or call the organisation using a number from their real website — never a number in the suspicious message.
3. **Report it** to your IT or security team so others get warned.

> ⚠️ **Modern twist — AI-powered phishing.** Attackers now use AI to write flawless, personalised messages and even clone voices for vishing calls. The tells of "bad grammar" are fading. The advice is the same: verify through a separate channel and slow down when someone is rushing you.

### 🧪 Lab — Get better at spotting phishing
1. Search for **"Google Phishing Quiz"** (a free interactive quiz from Jigsaw / Google).
2. Take the quiz — decide if each example is real or phishing.
3. Read the explanations carefully. Your accuracy will jump.
4. Share it with a family member — this single quiz genuinely reduces real risk.

### 🚩 Challenge
What do we call phishing that is specifically targeted at a senior executive?

<details><summary>Answer</summary>Whaling.</details>

### Key terms
- **Social engineering** — attacking humans, not systems.
- **Phishing / spear-phishing / whaling** — mass, targeted, executive-targeted variants.
- **Vishing / smishing / quishing** — voice / SMS / QR-code phishing.
- **Pretexting / baiting / tailgating** — story-based / temptation-based / physical variants.

### Recap
- Social engineering exploits psychology, not technology, and causes many real breaches.
- Signals: urgency, odd senders, mismatched links, secrets requested, unexpected attachments.
- Verify through a separate channel and slow down.
- AI is making phishing more convincing — the discipline of pausing matters more than ever.

---

## Lesson 6.7 — Protecting yourself: MFA, updates, backups & good hygiene

### Why this matters
Understanding threats is useful; turning that understanding into concrete habits is what actually protects you. These few habits stop the vast majority of real-world attacks against ordinary people.

### 1. Turn on MFA (everywhere it exists)
**Multi-Factor Authentication (MFA)** — also called Two-Factor Authentication (2FA) — asks for a second proof of identity after your password: a code from your phone, a hardware key, a fingerprint. Even if your password is stolen, an attacker is still locked out without the second factor.

Factors are classified as:
- **Something you know** — a password or PIN.
- **Something you have** — a phone with an app, a physical security key.
- **Something you are** — a fingerprint, face scan.

MFA combines two of those. It's the single highest-value security change you can make.

**Which second factor is best?**
- **Hardware keys** (YubiKey and similar) — the strongest and most phishing-resistant. If you can afford one, use it.
- **Authenticator apps** (Google Authenticator, Authy, Aegis) — very good. They generate codes offline.
- **SMS codes** — better than nothing, but *not* recommended when other options exist. Attackers can hijack phone numbers via "SIM swap" attacks.

> 💡 **Priority order:** turn MFA on for your **email account first**. Because email resets almost every other account, it's the master key. Protect it above all.

### 2. Install updates promptly
Updates are boring; they're also how most **known** flaws are closed. Attackers scan the internet for machines still running old, vulnerable versions — because it's free easy prey. Automatic updates on your OS, browser, and phone dramatically reduce your risk with zero ongoing effort.

### 3. Back up important data
Ransomware only wins if losing your files is catastrophic. Keep good backups and it becomes an annoyance instead of a disaster. The classic rule is the **3-2-1 backup rule**:

- **3** copies of your important data.
- On **2** different types of media (e.g., internal drive + external drive).
- With **1** copy **offsite** (cloud backup or a drive kept elsewhere).

Test your backups occasionally by restoring a file — an untested backup is a hope, not a plan.

### 4. Password managers and unique passwords
As we saw in Lesson 6.5: use a password manager (Bitwarden is free and excellent) and let it generate a long random password for every site. This alone kills credential-stuffing attacks.

### 5. Everyday hygiene
- Lock your screen when you walk away.
- Encrypt your laptop drive (BitLocker on Windows, FileVault on Mac). If it's stolen, your files are safe.
- Be careful with **public Wi-Fi**; use a VPN or your phone's hotspot for sensitive tasks.
- Watch your **browser extensions** — malicious ones can spy on everything you do. Install few, and only from trusted publishers.
- Watch what you share on social media — it fuels spear-phishing.

### 🚩 Challenge
Which single account, if compromised, would give an attacker the ability to reset most of your other accounts — and should therefore be protected with MFA first?

<details><summary>Answer</summary>Your email account.</details>

### Key terms
- **MFA / 2FA** — a second proof of identity beyond the password.
- **Something you know / have / are** — the three factor categories.
- **3-2-1 backup rule** — 3 copies, 2 media, 1 offsite.
- **SIM swap** — attackers hijacking a phone number to receive SMS codes.

### Recap
- Turn on MFA, starting with email; prefer app or hardware keys over SMS.
- Install updates; they close the flaws attackers rely on.
- Back up important data (3-2-1) and test restores.
- Use a password manager for unique passwords, and practise everyday hygiene.

---

## Lesson 6.8 — Frameworks, standards & compliance (the big picture)

### Why this matters
Companies don't reinvent security from scratch — they use established **frameworks and standards**. Even if you don't work in compliance, you'll bump into these terms constantly, so knowing what each is helps you speak the language and pick the right lens for a problem.

### Frameworks and standards you'll hear about
- **NIST Cybersecurity Framework (CSF)** — a widely used US-government framework organising security into five simple functions: **Identify, Protect, Detect, Respond, Recover**. Excellent as a mental model.
- **ISO/IEC 27001** — the international standard for managing information security. Companies get *certified* against it; it's a common contract requirement.
- **CIS Controls** — a prioritised, practical list of 18 controls (formerly "Top 20") that give the biggest security wins for the effort. A great starting point for any organisation.
- **OWASP** — a community focused on *application security*. You'll meet their famous **Top 10** web-risk list in Path 07.
- **MITRE ATT&CK** — the technique catalogue you met in Lesson 6.3, universal for defenders.

### Common compliance regulations
Depending on the industry and country, organisations face legal requirements about security and privacy:

- **PCI DSS** — for anyone handling **payment card** data.
- **HIPAA** — US law for **healthcare** data.
- **GDPR** — EU law for **personal** data, with big fines. Applies globally to anyone handling EU residents' data.
- **SOC 2** — reports on how a service provider protects customer data. Common for SaaS companies.

You don't need to memorise the details. Just recognise that "compliance" often *drives* the security work in a company, and lots of security jobs exist to help meet these standards.

### Roles that grow out of frameworks
- **GRC Analyst** (Governance, Risk & Compliance) — writes policy, runs risk assessments, prepares for audits.
- **Auditor** — independently checks whether a company actually follows its framework.
- **Compliance Officer / DPO** — ensures the organisation meets legal obligations.

These roles pay well and are wonderful entry points for people who love organisation, writing, and structured thinking rather than hands-on hacking.

### The takeaway
Not every security career is offensive. Enormous, important work exists in **governance and defence** — planning, standards, and making sure organisations do the boring, effective things well. If that resonates with you, this world is genuinely open.

### 🚩 Challenge
Which framework's five functions are Identify, Protect, Detect, Respond, and Recover?

<details><summary>Answer</summary>The NIST Cybersecurity Framework (CSF).</details>

### Key terms
- **NIST CSF / ISO 27001 / CIS Controls / OWASP / MITRE ATT&CK** — major frameworks and communities.
- **PCI DSS / HIPAA / GDPR / SOC 2** — common compliance regulations.
- **GRC** — Governance, Risk & Compliance; the strategic side of security.

### Recap
- Companies use frameworks like NIST CSF, ISO 27001, and CIS Controls to structure security.
- OWASP focuses on application security; MITRE ATT&CK maps techniques.
- Compliance regulations (PCI DSS, HIPAA, GDPR, SOC 2) drive a lot of real security work.
- Non-hands-on roles (GRC, audit, compliance) are respected, well-paid career paths.

---

## You've finished Path 06 🎉

You now speak the language of the industry. You understand the CIA triad, the risk equation, attacker types and the kill chain, malware families, how passwords are really stored, social engineering, the habits that protect ordinary people, and the frameworks companies actually use. Every future path will assume these ideas — and now you have them.

**Next up → `07-web-security.md`:** the hands-on core of web hacking — the OWASP Top 10 in plain English, then XSS, SQL injection, and IDOR with real labs on legal practice sites. This is where the fun really begins.
