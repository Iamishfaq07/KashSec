/* KashSec Academy — practice task SOURCE (answers in plain text).
 *
 * This file is the authoring surface and is NOT shipped to browsers.
 * `node generate-tasks.js` reads it, hashes every answer, and writes
 * tasks.js — which is what the site loads. Keeping the two apart means an
 * answer never appears in anything a learner can view-source on, while the
 * answers stay readable and reviewable here in the repo.
 *
 * TASK SHAPE
 *   id      stable slug, used as the progress key — never renumber it
 *   path    pathId the task belongs to
 *   q       the question (may contain a fenced block via \n)
 *   answer  the expected answer, or an array of equally-correct answers
 *   match   'exact'    normalised string equality (default)
 *           'number'   numeric equality, tolerant of formatting
 *           'contains' the answer must appear inside what was typed
 *   hint    shown on request, costs nothing but is recorded
 *   explain shown after a correct answer — this is where the teaching is
 *   points  1-3 for recall, 4-6 for applied work
 *
 * WRITING GOOD TASKS
 * The point of this system is to make people *do* something rather than
 * recognise an option. A task whose answer can be guessed from the question,
 * or that just asks a definition back, adds nothing the quizzes don't
 * already do. Prefer: compute this, read this output and name the flaw,
 * spot the wrong line. Every answer must be unambiguous enough that a
 * correct understanding produces exactly one string.
 */

export const TASK_SOURCE = [
  /* ---- 00 Computer Basics & Security Mindset ---- */
  { id: 'basics-url-domain', path: '00-fresher-basics', points: 3, match: 'exact',
    q: 'Read this link the way a browser does. Which domain does it actually go to?\n\nhttps://paypal.com.secure-login.verify-account.xyz/login',
    answer: ['verify-account.xyz', 'https://verify-account.xyz'],
    hint: 'The real domain is the last two labels before the first single slash — read right to left, not left to right.',
    explain: 'Everything before the final two labels is decoration the attacker controls. paypal.com here is just a subdomain of verify-account.xyz. Reading a domain right-to-left from the first slash is the single most useful habit for spotting a phishing link.' },
  { id: 'basics-backup-rule', path: '00-fresher-basics', points: 2, match: 'exact',
    q: 'A backup strategy keeps 3 copies of your data, on 2 different kinds of media, with 1 copy off-site. What is this rule called? (write it as digits with dashes)',
    answer: ['3-2-1', '321', '3 2 1'],
    hint: 'Name it by the three numbers, in the order given.',
    explain: 'The 3-2-1 rule survives the failures that actually happen: a dead drive (second copy), a house fire or theft (off-site copy), and ransomware that encrypts everything reachable from the machine (offline or versioned copy).' },

  /* ---- 01 Introduction to Cybersecurity ---- */
  { id: 'intro-cia-missing', path: '01-introduction', points: 3, match: 'exact',
    q: 'A ransomware attack encrypts a hospital\'s records. Staff cannot read them, but the attacker never copied them out and never altered them. Which single element of the CIA triad has been broken?',
    answer: ['availability'],
    hint: 'Nothing leaked and nothing was changed — but nobody can use the data.',
    explain: 'Confidentiality is intact (no copy was taken), integrity is intact (the plaintext was not altered). Availability is destroyed. This is why availability belongs in the triad at all: the harm here is total even though nothing was stolen.' },
  { id: 'intro-hat-colour', path: '01-introduction', points: 2, match: 'exact',
    q: 'Someone finds a serious flaw in a company\'s site without being asked, does not exploit it, and reports it to them privately. Which "hat" describes them? (one word)',
    answer: ['grey', 'gray', 'greyhat', 'grayhat', 'grey hat', 'gray hat'],
    hint: 'They had no permission, but no malice either.',
    explain: 'White hat means acting with authorisation; black hat means acting with malice. Testing without permission but reporting responsibly sits between the two — and note that "no harm intended" is not a legal defence in most jurisdictions. Permission is what separates the first from the third.' },

  /* ---- 02 Networking Fundamentals ---- */
  { id: 'net-usable-hosts', path: '02-networking', points: 4, match: 'number',
    q: 'How many USABLE host addresses are there in a /26 network?',
    answer: 62,
    hint: 'Work out the total addresses first, then subtract the two that can never be assigned to a host.',
    explain: '32 − 26 = 6 host bits, so 2^6 = 64 total addresses. The first names the network and the last is the broadcast address, leaving 62 assignable. This subtract-two step is where most subnetting mistakes happen.' },
  { id: 'net-broadcast', path: '02-networking', points: 5, match: 'exact',
    q: 'What is the broadcast address of 192.168.10.0/26?',
    answer: ['192.168.10.63'],
    hint: 'A /26 block holds 64 addresses. Count from .0 and stop at the last one in the block.',
    explain: 'The block runs .0 to .63. The network address is 192.168.10.0, the usable range is .1 to .62, and the broadcast is 192.168.10.63. The next block starts at .64.' },
  { id: 'net-port-dns', path: '02-networking', points: 2, match: 'number',
    q: 'Which port number does DNS normally use?',
    answer: 53,
    hint: 'It is under 100, and it is used over both UDP and TCP.',
    explain: 'DNS uses port 53, usually over UDP for ordinary lookups and over TCP when a response is too large or for zone transfers. Recognising well-known ports on sight makes reading a scan or a firewall rule much faster.' },

  /* ---- 03 Operating Systems & Linux ---- */
  { id: 'linux-suid-find', path: '03-linux', points: 5, match: 'contains',
    q: 'Write the find command that lists every SUID binary on a system, discarding permission errors.\n\n(the answer needs the permission test and the error redirect)',
    answer: ['-perm -4000'],
    hint: 'SUID is the 4000 bit. Errors go to file descriptor 2.',
    explain: 'find / -perm -4000 -type f 2>/dev/null is the canonical form. The -4000 tests the SUID bit specifically, and 2>/dev/null discards the flood of "Permission denied" lines that would otherwise bury the result. This is usually the first command run after landing on a Linux box.' },
  { id: 'linux-chmod-644', path: '03-linux', points: 4, match: 'exact',
    q: 'A file should be readable and writable by its owner, and read-only for everyone else. What numeric chmod mode is that?',
    answer: ['644', '0644'],
    hint: 'read=4, write=2, execute=1 — add them up per column.',
    explain: 'Owner gets read+write = 6, group gets read = 4, others get read = 4. 644 is the correct mode for most configuration and data files; 664 or 666 hand write access to people who should not have it.' },

  /* ---- 04 Programming & Python ---- */
  { id: 'py-eq-vs-is', path: '04-python', points: 3, match: 'exact',
    q: 'In Python, which operator asks "are these the same object in memory?" rather than "do these have the same value?" (write the operator only)',
    answer: ['is'],
    hint: 'Two letters.',
    explain: '== compares values; is compares identity. Using is to compare strings or numbers appears to work for small values because of interning, then fails unpredictably for larger ones — a classic source of bugs that pass in testing.' },

  /* ---- 05 How the Web Works ---- */
  { id: 'web-status-403', path: '05-web-basics', points: 3, match: 'number',
    q: 'A server understood your request and knows who you are, but refuses to let you have the resource. Which HTTP status code is that?',
    answer: 403,
    hint: 'It is not 401 — you are already authenticated.',
    explain: '401 Unauthorized means "you have not authenticated"; 403 Forbidden means "you have, and you still may not". Telling them apart matters in testing: a 403 confirms the resource exists, which is information a 404 would have withheld.' },
  { id: 'web-method-idempotent', path: '05-web-basics', points: 3, match: 'exact',
    q: 'Which HTTP method should never change server state? (write the method in capitals)',
    answer: ['GET'],
    hint: 'It is the one your browser uses just to fetch a page.',
    explain: 'GET is defined as safe: it should only read. A GET that deletes or transfers something is not merely bad style — it is directly exploitable via CSRF, prefetching and link crawlers, all of which will fire it without a user ever deciding to.' },

  /* ---- 06 Cryptography Fundamentals ---- */
  { id: 'crypto-rot13', path: '06-crypto-fundamentals', points: 4, match: 'exact',
    q: 'Decode this ROT13 string:\n\nfrpher',
    answer: ['secure'],
    hint: 'Shift every letter back 13 places — or forward 13, which is the same thing.',
    explain: 'ROT13 is a Caesar cipher with a shift of 13, and since the alphabet has 26 letters, applying it twice returns the original. That self-inverse property is why it survives as a spoiler-hiding convention and not as security.' },
  { id: 'crypto-hash-length', path: '06-crypto-fundamentals', points: 3, match: 'exact',
    q: 'You find a 32-character hexadecimal hash in a database dump. Which algorithm is the most likely candidate? (name only)',
    answer: ['md5'],
    hint: '32 hex characters is 128 bits.',
    explain: '32 hex characters = 128 bits, which points at MD5 (NTLM is the other common 32-char candidate — context decides). SHA-1 is 40 characters and SHA-256 is 64. Length is the first and most informative clue when identifying a hash.' },
  { id: 'crypto-salt-purpose', path: '06-crypto-fundamentals', points: 4, match: 'exact',
    q: 'A password salt is stored in plain text right next to the hash, so it is not secret. In one word, what property must a salt have to do its job?',
    answer: ['unique', 'uniqueness', 'random'],
    hint: 'It is not about being hidden.',
    explain: 'A salt does not need to be secret, it needs to be unique per user. That uniqueness means one precomputed table cannot crack every account at once, and two users with the same password get different hashes — forcing the attacker to attack each password separately.' },

  /* ---- 07 Windows Security Basics ---- */
  { id: 'win-hive-sam', path: '07-windows-security', points: 4, match: 'exact',
    q: 'Which registry hive holds local user account password hashes on Windows? (three letters)',
    answer: ['sam'],
    hint: 'It stands for Security Account Manager.',
    explain: 'The SAM hive holds local account hashes. It is locked while Windows runs, which is why attackers dump it from a shadow copy or from memory via LSASS instead — and why monitoring for those two accesses is worth more than watching the file itself.' },

  /* ---- 08 Cloud Computing Basics ---- */
  { id: 'cloud-metadata-ip', path: '08-cloud-basics', points: 5, match: 'exact',
    q: 'Which link-local IP address serves instance metadata (and temporary credentials) on AWS, Azure and GCP?',
    answer: ['169.254.169.254'],
    hint: 'It is in the 169.254.0.0/16 link-local range, and the last two octets repeat the first two.',
    explain: '169.254.169.254 is the metadata endpoint. It is the reason SSRF is so much more severe in cloud environments than on-premises: a server-side fetch pointed at it returns role credentials. IMDSv2 requires a PUT-obtained token specifically to break that single-GET attack.' },

  /* ---- 09 Digital Privacy & Personal Security ---- */
  { id: 'privacy-mfa-strongest', path: '09-digital-privacy', points: 3, match: 'exact',
    q: 'Which second factor is resistant to real-time phishing because it is cryptographically bound to the site\'s domain? (one word)',
    answer: ['passkey', 'passkeys', 'fido2', 'webauthn', 'fido'],
    hint: 'It replaces the password entirely, and the browser will not release it to a domain it was not registered for.',
    explain: 'Passkeys (WebAuthn/FIDO2) sign a challenge tied to the origin, so a proxy on a lookalike domain gets a signature that is useless to it. SMS and TOTP codes are just strings a victim can be talked into reading out, which is why relay attacks defeat them.' },

  /* ---- 10 Cybersecurity Fundamentals ---- */
  { id: 'fund-cvss-vector', path: '10-fundamentals', points: 6, match: 'contains',
    q: 'A flaw is reachable over the internet, needs no privileges, needs no user interaction, is easy to exploit, does not change scope, and fully compromises confidentiality, integrity and availability. Write the CVSS 3.1 base vector string.',
    answer: ['AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'],
    hint: 'Start with CVSS:3.1/ then work through AV, AC, PR, UI, S, C, I, A in that order.',
    explain: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H scores 9.8 Critical — the classic unauthenticated remote code execution vector. Including the vector string rather than only the number lets a reader check your reasoning instead of arguing with your total.' },

  /* ---- 11 Web Security ---- */
  { id: 'web-sqli-payload', path: '11-web-security', points: 5, match: 'contains',
    q: "A login builds its query as:\n\nSELECT * FROM users WHERE user='$u' AND pass='$p'\n\nWhat do you type into the username field to log in as the first user without knowing any password?",
    answer: ["' or '1'='1", "' or 1=1--", "' or '1'='1'--", "' or '1'='1' --", "admin'--", "' or 1=1#"],
    hint: 'Close the string the developer opened, then add a condition that is always true — or comment out the rest.',
    explain: "Closing the quote breaks out of the string context so the rest of your input is read as SQL. ' OR '1'='1 makes the WHERE clause always true; admin'-- comments away the password check entirely. Parameterised queries fix this by sending structure and data on separate channels, so input can never change the statement's meaning." },
  { id: 'web-xss-context', path: '11-web-security', points: 4, match: 'exact',
    q: 'Which HTTP response header, properly configured, can turn many XSS bugs from exploitable into harmless by controlling what the browser is allowed to execute?',
    answer: ['content-security-policy', 'csp', 'content security policy'],
    hint: 'It is the heavyweight of the security headers, and the hardest to deploy without breaking things.',
    explain: 'A Content-Security-Policy restricting script sources means an injected <script> has nothing it is permitted to run. It is defence in depth, not a substitute for output encoding — but it is what decides whether a missed encoding becomes an incident.' },

  /* ---- 12 Network Security ---- */
  { id: 'netsec-nmap-syn', path: '12-network-security', points: 4, match: 'contains',
    q: 'Which single nmap flag performs a TCP SYN ("half-open") scan?',
    answer: ['-sS'],
    hint: 'Two characters after the dash; the capital letter matters.',
    explain: '-sS sends a SYN and never completes the handshake, so the connection is often not logged by the application. -sT completes it and is far noisier. Note that -sS requires raw socket privileges, which is why it needs root.' },

  /* ---- 13 Mobile App Security ---- */
  { id: 'mobile-apk-extension', path: '13-mobile-security', points: 2, match: 'exact',
    q: 'An Android app package is really a ZIP archive with a different extension. Which file inside it declares the app\'s permissions? (full filename)',
    answer: ['androidmanifest.xml'],
    hint: 'It is an XML file, and its name says exactly what it does.',
    explain: 'AndroidManifest.xml declares permissions, components and exported activities. Reading it is the first step of any mobile assessment — an exported activity or an over-broad permission is visible there before you run the app at all.' },

  /* ---- 14 Ethical Hacking ---- */
  { id: 'eh-methodology-first', path: '14-ethical-hacking', points: 3, match: 'exact',
    q: 'In the five-phase ethical hacking methodology, which phase comes immediately before Gaining Access? (one or two words)',
    answer: ['scanning', 'scanning and enumeration', 'enumeration'],
    hint: 'It follows Reconnaissance and involves actively probing what you found.',
    explain: 'Reconnaissance → Scanning → Gaining Access → Maintaining Access → Covering Tracks. The line between recon and scanning matters legally as well as tactically: reading public records is passive, sending packets at a host is not.' },

  /* ---- 15 Bug Bounty ---- */
  { id: 'bb-impact-statement', path: '15-bug-bounty', points: 4, match: 'exact',
    q: 'A triager will downgrade a report that describes the bug but not its consequence. In one word, what is the section that turns "reflected XSS" into "an attacker steals any user\'s session"?',
    answer: ['impact'],
    hint: 'It is the part that answers "so what?"',
    explain: 'Impact is what gets a report prioritised and paid. "Reflected XSS on /search" is a finding; "any user who clicks a crafted link has their session token sent to an attacker-controlled host" is an impact, and it is the sentence that decides severity.' },

  /* ---- 16 Advanced Cyber Topics ---- */
  { id: 'adv-kerberoast-target', path: '16-advanced', points: 5, match: 'exact',
    q: 'Kerberoasting only works against accounts that have one particular attribute set. What is that attribute called? (three letters)',
    answer: ['spn', 'serviceprincipalname', 'service principal name'],
    hint: 'It maps a service to the account that runs it.',
    explain: 'Any account with a Service Principal Name can have a service ticket requested for it by any authenticated domain user, and part of that ticket is encrypted with the account\'s password hash. Finding accounts with an SPN is therefore step one — and Group Managed Service Accounts, with long random passwords, remove the payoff.' },

  /* ---- 17 Malware & Reverse Engineering ---- */
  { id: 'malware-entropy', path: '17-malware-re', points: 5, match: 'number',
    q: 'Shannon entropy is measured in bits per byte. What is the maximum possible value for a byte, and therefore the value that packed or encrypted data approaches?',
    answer: 8,
    hint: 'How many bits are in a byte?',
    explain: 'A byte holds 8 bits, so maximum entropy is 8 bits per byte. Ordinary code sits well below that; a section approaching 8 is compressed, encrypted or packed. An entropy graph across a binary shows immediately which parts need unpacking before anything else is worth doing.' },

  /* ---- 20 Career Prep ---- */
  { id: 'career-star', path: '20-career-prep', points: 3, match: 'exact',
    q: 'Which four-letter framework structures a behavioural interview answer as Situation, Task, Action, Result?',
    answer: ['star'],
    hint: 'It is an acronym of those four words.',
    explain: 'STAR keeps a behavioural answer concrete and finite. Most weak answers stop after Situation and Task — the interviewer is listening for what *you* did and what changed as a result, which is the Action and Result half.' },

  /* ---- 19 CTF Challenges ---- */
  { id: 'ctf-base64-decode', path: '19-ctf-challenges', points: 4, match: 'exact',
    q: 'Decode this Base64 string:\n\nS2FzaFNlY3tuMHRfM25jcnlwdDEwbn0=',
    answer: ['KashSec{n0t_3ncrypt10n}'],
    hint: 'The trailing = is padding. Any Base64 decoder will do — including the one in this site\'s Tools section.',
    explain: 'The flag says it: Base64 is an encoding, not encryption. Anyone can reverse it with no key at all. Finding credentials "protected" by Base64 is a real finding, not a control.' },
  { id: 'ctf-hex-decode', path: '19-ctf-challenges', points: 4, match: 'exact',
    q: 'Decode this hex string to ASCII:\n\n666c61675f666f756e64',
    answer: ['flag_found'],
    hint: 'Take the characters two at a time; each pair is one byte.',
    explain: 'Each pair of hex digits is one byte, and 0x66 is "f". Recognising a hex string on sight — pairs of 0-9 and a-f, usually even length — is one of the fastest wins in a CTF.' },

  /* ---- 18 AI & AI Security ---- */
  { id: 'ai-injection-channel', path: '18-ai-security', points: 4, match: 'exact',
    q: 'Prompt injection is hard to eliminate because a language model receives instructions and data through the same what? (one word)',
    answer: ['channel', 'context', 'input'],
    hint: 'SQL injection was solved by separating exactly this into two of them.',
    explain: 'Parameterised queries fixed SQL injection by sending code and data on separate channels. A language model has one channel, so nothing structurally distinguishes an instruction from content that merely looks like one. That is why the durable defences are downstream — constraining what the model is permitted to *do*.' },

  /* ---- 21 API Security ---- */
  { id: 'api-bola-rank', path: '21-api-security', points: 4, match: 'number',
    q: 'On the OWASP API Security Top 10, what position does Broken Object Level Authorization (BOLA) hold?',
    answer: 1,
    hint: 'It is the one at the very top.',
    explain: 'BOLA is API1 — both the most common API flaw and among the most damaging, because it usually exposes every record of a type rather than one. Testing for it needs two accounts: do everything as one, replay each request as the other, see what still succeeds.' },

  /* ---- 22 DevSecOps & AppSec ---- */
  { id: 'devsecops-sbom-format', path: '22-devsecops-appsec', points: 3, match: 'exact',
    q: 'Name one of the two widely used machine-readable SBOM formats. (one word)',
    answer: ['spdx', 'cyclonedx', 'cyclone dx'],
    hint: 'One is a Linux Foundation standard; the other comes from OWASP.',
    explain: 'SPDX and CycloneDX are the two formats procurement and tooling actually accept. The value of an SBOM is answering "are we affected?" in minutes rather than weeks — the inability to answer that was the real crisis during Log4Shell, more than the bug itself.' },

  /* ---- 23 GRC & Compliance ---- */
  { id: 'grc-risk-treatments', path: '23-grc-compliance', points: 4, match: 'exact',
    q: 'The four risk treatment options are Mitigate, Transfer, Avoid and one more — the one where you knowingly do nothing, with a named owner and a review date. Which is it? (one word)',
    answer: ['accept', 'acceptance'],
    hint: 'It is a legitimate decision, not a failure to decide.',
    explain: 'Accepting a risk explicitly — owner, rationale, review date — is a defensible and auditable decision. Ignoring one is neither. Insurance and outsourcing (Transfer) move financial exposure but never move the consequences to your customers or your regulator.' },

  /* ---- 24 Zero Trust Architecture ---- */
  { id: 'zt-perimeter', path: '24-zero-trust', points: 3, match: 'exact',
    q: 'Zero Trust replaces the network perimeter with a different primary control plane. What is it? (one word)',
    answer: ['identity'],
    hint: 'It is the thing you verify on every request, regardless of where it came from.',
    explain: 'In Zero Trust, identity is the perimeter: every request is authenticated and authorised on its own merits, and being on the corporate network grants nothing. That is why "never trust, always verify" is a statement about location no longer implying trust.' },

  /* ---- 25 OT/ICS & Critical Infrastructure ---- */
  { id: 'ics-purdue-level', path: '25-ot-ics-security', points: 4, match: 'number',
    q: 'In the Purdue Model, which level is the DMZ that separates the enterprise IT network from the OT network? (a number, which may include a decimal)',
    answer: [3.5, '3.5', 'level 3.5'],
    hint: 'It sits between Level 3 and Level 4 — and its number says exactly that.',
    explain: 'Level 3.5 is the IT/OT DMZ, the controlled boundary where data crosses between business systems and plant operations. Attacks like the Ukraine grid intrusions worked by traversing that boundary, which is why segmentation there is the highest-value OT control.' },

  /* ==================== BATCH 2 ====================
     Weighted toward work rather than recall: read this output and name the
     flaw, compute this, spot the wrong line. A task you can answer without
     opening anything is a quiz question wearing a costume. */

  /* ---- 00 Computer Basics ---- */
  { id: 'basics-https-padlock', path: '00-fresher-basics', points: 3, match: 'exact',
    q: 'A site shows a padlock and a valid certificate. Which one of these does that actually prove?\n\n  A) the site is run by an honest company\n  B) the connection to the site is encrypted\n  C) the site is not a scam\n\n(answer with the letter)',
    answer: ['b'],
    hint: 'A certificate is issued to whoever proves they control the domain — nothing more.',
    explain: 'A certificate proves the traffic is encrypted and that whoever holds it controls that domain. It says nothing about honesty. Phishing sites get certificates freely and instantly, which is exactly why "look for the padlock" stopped being useful advice.' },
  { id: 'basics-update-why', path: '00-fresher-basics', points: 3, match: 'exact',
    q: 'A flaw is published on Monday and patched the same day. Attackers start exploiting unpatched machines on Tuesday. What is the general name for an attack against a flaw that has a patch available but not yet applied? (two words)',
    answer: ['n-day', 'n day', 'nday', 'one-day', 'known vulnerability'],
    hint: 'It is the opposite of the case where nobody has a fix yet.',
    explain: 'A zero-day has no patch. An n-day does — and that is what makes it dangerous at scale, because publication tells every attacker exactly what to look for while most machines are still unpatched. Almost every mass compromise is n-day, not zero-day.' },

  /* ---- 01 Introduction ---- */
  { id: 'intro-least-privilege', path: '01-introduction', points: 3, match: 'exact',
    q: 'A backup service is given full administrator rights because "it needs to read everything". Which security principle does that violate? (three words)',
    answer: ['least privilege', 'principle of least privilege', 'principle of least privilege.'],
    hint: 'It is about giving exactly the access needed and no more.',
    explain: 'Reading files needs read access, not administrator. The principle matters because every over-granted permission becomes the attacker\'s permission the moment that account is compromised — and service accounts are compromised constantly.' },
  { id: 'intro-defence-depth', path: '01-introduction', points: 3, match: 'exact',
    q: 'A company has a firewall, endpoint detection, MFA, network segmentation and backups — deliberately overlapping, so no single failure is fatal. What is this strategy called? (three words)',
    answer: ['defence in depth', 'defense in depth', 'defence-in-depth', 'defense-in-depth'],
    hint: 'It is about layers, not any one control being perfect.',
    explain: 'Defence in depth assumes every control will eventually fail and arranges that no single failure is decisive. It is why "we have a firewall" was never a security posture, and why the interesting question about any control is what happens when it does not work.' },

  /* ---- 02 Networking ---- */
  { id: 'net-cidr-from-mask', path: '02-networking', points: 4, match: 'exact',
    q: 'Write 255.255.255.240 in CIDR notation (include the slash).',
    answer: ['/28', '28'],
    hint: 'Count the one-bits. 240 in binary is 11110000.',
    explain: '255.255.255 is 24 one-bits, and 240 adds 4 more, so /28. That block holds 16 addresses and 14 usable hosts — a common size for a small server segment.' },

  /* ---- 03 Linux ---- */
  { id: 'linux-grep-count', path: '03-linux', points: 4, match: 'contains',
    q: 'You want the NUMBER of lines in auth.log containing "Failed password", not the lines themselves. Which single grep flag gives you that?',
    answer: ['-c'],
    hint: 'It is one letter, and it stands for count.',
    explain: 'grep -c "Failed password" /var/log/auth.log prints the count. During triage this is how you tell a handful of typos from a brute-force run in one command, before reading anything.' },
  { id: 'linux-sudo-list', path: '03-linux', points: 4, match: 'contains',
    q: 'You have landed on a Linux box as a normal user. Which command lists what commands you are permitted to run through sudo?',
    answer: ['sudo -l'],
    hint: 'It is sudo plus a single letter flag meaning "list".',
    explain: 'sudo -l prints your sudo rights. It is one of the highest-value first commands on any Linux box: a single NOPASSWD entry on something that can shell out is often the entire privilege escalation path.' },

  /* ---- 04 Python ---- */
  { id: 'py-mutable-default', path: '04-python', points: 5, match: 'number',
    q: 'What does this print?\n\ndef add(x, items=[]):\n    items.append(x)\n    return items\n\nprint(len(add(1)))\nprint(len(add(2)))\n\n(give the SECOND number only)',
    answer: 2,
    hint: 'The default list is created once, when the function is defined — not on each call.',
    explain: 'It prints 1 then 2. A mutable default argument is evaluated once at definition time, so the same list is reused across calls and accumulates. The fix is items=None with items = items or [] inside. This bug is subtle because the first call always looks correct.' },
  { id: 'py-fstring-inject', path: '04-python', points: 5, match: 'exact',
    q: 'This code builds a query:\n\ncur.execute(f"SELECT * FROM users WHERE id = {uid}")\n\nWhat single character should replace the f-string interpolation to make it a parameterised query in Python\'s DB-API?',
    answer: ['?', '%s'],
    hint: 'It is a placeholder character, and the value is then passed as a separate argument.',
    explain: 'cur.execute("SELECT * FROM users WHERE id = ?", (uid,)) sends the query structure and the data on separate channels, so uid can never change the statement\'s meaning. sqlite3 uses ?, psycopg2 uses %s — the principle is identical.' },
  { id: 'py-open-file', path: '04-python', points: 3, match: 'contains',
    q: 'Which Python keyword opens a file so it is closed automatically even if an exception is raised mid-block?',
    answer: ['with'],
    hint: 'It introduces a context manager.',
    explain: 'with open(path) as f: guarantees the file is closed on the way out, exception or not. Without it, an exception leaks the handle — which on a long-running process eventually exhausts the file descriptor limit.' },

  /* ---- 05 How the Web Works ---- */
  { id: 'web-cookie-flag', path: '05-web-basics', points: 4, match: 'exact',
    q: 'Which cookie attribute stops JavaScript from reading a session cookie, so an XSS bug cannot simply steal it? (one word)',
    answer: ['httponly', 'http-only', 'http only'],
    hint: 'Its name says which protocol may see it and implies which language may not.',
    explain: 'HttpOnly means document.cookie cannot read it, so injected script cannot exfiltrate the session directly. It does not stop XSS — the attacker can still act as the user inside the page — but it removes the simplest and most damaging outcome.' },
  { id: 'web-status-301-302', path: '05-web-basics', points: 3, match: 'number',
    q: 'You are moving a page permanently and want search engines to transfer its ranking to the new URL. Which HTTP status code should the old URL return?',
    answer: 301,
    hint: 'The other common redirect code means "temporary" and passes nothing on.',
    explain: '301 Moved Permanently tells crawlers to update their index and carry signals across. A 302 says "temporary", so the old URL keeps the ranking — using 302 for a permanent move is a common and costly SEO mistake.' },

  /* ---- 06 Cryptography ---- */
  { id: 'crypto-xor-reuse', path: '06-crypto-fundamentals', points: 5, match: 'exact',
    q: 'A one-time pad is provably unbreakable, but only if three conditions hold: the key is truly random, it is as long as the message, and one more. What is the third? (one word — what you must never do with the key)',
    answer: ['reuse', 'reused', 'repeat', 'never reuse', 'do not reuse'],
    hint: 'It is in the name of the cipher itself.',
    explain: 'Use the key once. XOR the same keystream against two messages and the key cancels out, leaving the two plaintexts combined with each other — recoverable without the key at all. This is not a historical curiosity: it is precisely how WEP fell.' },

  /* ---- 07 Windows Security ---- */
  { id: 'win-event-4625', path: '07-windows-security', points: 5, match: 'number',
    q: 'Which Windows Security event ID records a FAILED logon attempt — the one you would count to spot a brute-force run?',
    answer: 4625,
    hint: 'The successful-logon event is 4624. The failure is the very next number.',
    explain: '4624 is a successful logon, 4625 a failed one. A burst of 4625s from one source followed by a 4624 is the signature of a brute force that worked — the single most recognisable pattern in Windows security logs.' },
  { id: 'win-lsass', path: '07-windows-security', points: 5, match: 'exact',
    q: 'Which Windows process holds credential material in memory and is therefore the classic target for tools like Mimikatz? (process name, no extension)',
    answer: ['lsass', 'lsass.exe'],
    hint: 'It stands for Local Security Authority Subsystem Service.',
    explain: 'LSASS caches credentials so users are not prompted constantly, which is also why dumping its memory yields hashes and sometimes plaintext. Credential Guard exists specifically to isolate this, and alerting on unexpected LSASS handle access is one of the highest-value detections available.' },
  { id: 'win-uac-not-boundary', path: '07-windows-security', points: 4, match: 'exact',
    q: 'Microsoft states that UAC is a convenience feature, not a security what? (one word)',
    answer: ['boundary', 'barrier'],
    hint: 'It is the word for something an attacker is not supposed to be able to cross.',
    explain: 'Microsoft explicitly does not treat UAC bypasses as security vulnerabilities, because UAC is not a security boundary — it reduces accidental privilege use. Treating a UAC prompt as a control that stops an attacker already running code as you is a misreading of what it is for.' },

  /* ---- 08 Cloud ---- */
  { id: 'cloud-shared-responsibility', path: '08-cloud-basics', points: 4, match: 'exact',
    q: 'Under the shared responsibility model for IaaS, who is responsible for patching the operating system on a virtual machine you launched — the cloud provider, or the customer? (one word)',
    answer: ['customer', 'you', 'the customer'],
    hint: 'The provider is responsible for the infrastructure the VM runs on, not what runs inside it.',
    explain: 'The provider secures the hardware, hypervisor and physical facilities; everything from the guest OS upward is yours. Nearly every "cloud breach" is a customer-side misconfiguration — an open bucket, an over-broad role, an unpatched instance — not a provider failure.' },
  { id: 'cloud-s3-public', path: '08-cloud-basics', points: 4, match: 'exact',
    q: 'A storage bucket holding customer records is readable by anyone with the URL. In one word, what is the class of failure? (not the technology — the mistake)',
    answer: ['misconfiguration', 'misconfigured', 'configuration'],
    hint: 'No software flaw was exploited and no credential was stolen.',
    explain: 'Nothing was hacked: a setting was wrong. Misconfiguration is the dominant cause of cloud data exposure, which is why the effective controls are preventive — block-public-access at the account level, policy-as-code, and automated drift detection.' },
  { id: 'cloud-region-latency', path: '08-cloud-basics', points: 3, match: 'exact',
    q: 'Within a cloud region, what is the name for an isolated group of data centres with independent power and cooling, used so one failure does not take down a whole region? (two words)',
    answer: ['availability zone', 'availability zones', 'az'],
    hint: 'Its two-letter abbreviation is used constantly in cloud documentation.',
    explain: 'Availability Zones are physically separate but network-close, so you get fault isolation without meaningful latency cost. Running in a single AZ is the most common reason a "highly available" system turns out not to be.' },

  /* ---- 09 Digital Privacy ---- */
  { id: 'privacy-vpn-limit', path: '09-digital-privacy', points: 4, match: 'exact',
    q: 'A VPN moves the point where your traffic enters the internet. Who can now see your browsing that could not before? (one word — the party you are now trusting)',
    answer: ['vpn provider', 'provider', 'vpn', 'the vpn provider'],
    hint: 'You have not removed an observer, you have swapped which one it is.',
    explain: 'A VPN takes visibility away from your ISP and local network and hands it to the VPN provider. That is a real improvement on hostile public Wi-Fi, and no improvement at all if the provider logs. A VPN relocates trust; it does not eliminate it.' },
  { id: 'privacy-fingerprint', path: '09-digital-privacy', points: 4, match: 'exact',
    q: 'A site identifies you across visits without any cookie, by combining your screen size, fonts, timezone, GPU and extensions into a near-unique signature. What is this technique called? (one word)',
    answer: ['fingerprinting', 'fingerprint', 'browser fingerprinting', 'device fingerprinting'],
    hint: 'The name comes from the fact that the combination identifies you the way a physical mark does.',
    explain: 'Fingerprinting survives clearing cookies and private browsing, because none of the individual signals are secret — it is the combination that is unique. This is why anti-fingerprinting browsers make you look generic rather than trying to hide the values.' },
  { id: 'privacy-e2ee-metadata', path: '09-digital-privacy', points: 4, match: 'exact',
    q: 'A messaging app is end-to-end encrypted, so the provider cannot read message content. What can they still see? (one word)',
    answer: ['metadata', 'meta data', 'meta-data'],
    hint: 'It is everything about the message except what it says.',
    explain: 'Who talked to whom, when, how often, message sizes, and from where. Metadata is frequently more revealing than content — a pattern of calls can establish a relationship without a single word being read, which is why serious messengers work to minimise what they retain.' },

  /* ---- 10 Fundamentals ---- */
  { id: 'fund-cvss-band', path: '10-fundamentals', points: 3, match: 'exact',
    q: 'A vulnerability scores 7.5 on CVSS 3.1. Which severity band is that? (one word)',
    answer: ['high'],
    hint: 'There are four bands. The third of them begins at exactly 7.0.',
    explain: '0.1-3.9 Low, 4.0-6.9 Medium, 7.0-8.9 High, 9.0-10.0 Critical. These bands are reporting conventions rather than laws, and plenty of organisations remap them to their own response SLAs.' },
  { id: 'fund-risk-formula', path: '10-fundamentals', points: 4, match: 'number',
    q: 'On a 5x5 risk matrix, a risk is scored likelihood 4 and impact 5. What is its risk score?',
    answer: 20,
    hint: 'The two values combine the simplest way they could.',
    explain: 'Likelihood times impact, so 20 out of a possible 25. The number exists only to sort the register — defending it to two decimal places misunderstands what it is for. What matters is the treatment decision and who owns it.' },
  { id: 'fund-vuln-vs-threat', path: '10-fundamentals', points: 4, match: 'exact',
    q: 'An unpatched server is one thing; a ransomware group that exploits it is another. Which of the two is the THREAT? (one word from: server, group)',
    answer: ['group', 'the group', 'ransomware group'],
    hint: 'A threat is an actor or event; the weakness they act upon has a different name.',
    explain: 'The unpatched server is the vulnerability — the weakness. The ransomware group is the threat — the actor able to exploit it. Risk is what emerges when a threat meets a vulnerability and something of value is at stake. Muddling the three makes risk conversations impossible to follow.' },

  /* ---- 11 Web Security ---- */
  { id: 'web-idor-fix', path: '11-web-security', points: 5, match: 'exact',
    q: 'GET /api/invoice/1042 returns someone else\'s invoice when you change the number. Switching to a UUID makes it harder to guess. Is that a fix? (yes or no)',
    answer: ['no'],
    hint: 'Think about what is still missing from the server\'s handling of the request.',
    explain: 'No. The missing piece is an authorisation check — does this user own this object? An unguessable ID is obscurity: IDs leak through exports, emails, referrers and logs, and once leaked the record is still served. The check must happen server-side on every request.' },
  { id: 'web-csrf-token-why', path: '11-web-security', points: 5, match: 'exact',
    q: 'A CSRF token works because a malicious page on another origin cannot do what with it? (one word)',
    answer: ['read', 'read it'],
    hint: 'The same-origin policy governs what a page from one origin may do to another.',
    explain: 'The same-origin policy stops the attacker\'s page reading a token out of your session, so it cannot include one in a forged request. Note the corollary: XSS runs inside your origin, so it CAN read the token — which is why XSS defeats CSRF protection entirely.' },

  /* ---- 12 Network Security ---- */
  { id: 'netsec-nmap-ports', path: '12-network-security', points: 4, match: 'contains',
    q: 'Which nmap flag scans ALL 65535 TCP ports rather than the default top 1000?',
    answer: ['-p-', '-p 1-65535'],
    hint: 'It is the port flag with nothing after the dash.',
    explain: 'nmap -p- scans every TCP port. The default top-1000 is fast and misses services deliberately parked on high ports — which is exactly where an interesting admin interface tends to be found.' },
  { id: 'netsec-ids-vs-ips', path: '12-network-security', points: 4, match: 'exact',
    q: 'One system watches traffic and alerts; the other sits inline and can drop the packet. Which is the IPS — the one that alerts, or the one that drops? (one word: alerts or drops)',
    answer: ['drops', 'drop'],
    hint: 'The P stands for Prevention.',
    explain: 'An IDS detects and alerts; an IPS prevents, sitting inline so it can drop. The tradeoff is exactly that inline position: an IPS can stop an attack, and a false positive drops legitimate traffic. That is why many organisations run detection first and enable prevention rule by rule.' },
  { id: 'netsec-segmentation', path: '12-network-security', points: 4, match: 'exact',
    q: 'An attacker compromises a receptionist\'s laptop and finds the payment servers reachable from it. Which network control was missing? (one word)',
    answer: ['segmentation', 'segmented', 'micro-segmentation', 'microsegmentation'],
    hint: 'It is about dividing a flat network so one compromise does not reach everything.',
    explain: 'Segmentation limits lateral movement: a compromised desk machine should have no route to a payment segment. Most of the damage in large breaches happens after initial access, so what a flat network really costs you is the ability to contain anything.' },

  /* ---- 13 Mobile Security ---- */
  { id: 'mobile-cert-pinning', path: '13-mobile-security', points: 5, match: 'exact',
    q: 'An app refuses to work when you route it through an intercepting proxy, even after installing your CA. Which defence is the app using? (two words)',
    answer: ['certificate pinning', 'cert pinning', 'ssl pinning', 'tls pinning', 'pinning'],
    hint: 'The app is checking for a specific certificate rather than any trusted one.',
    explain: 'The app compares the server certificate against one it was shipped with, so adding a CA to the device trust store changes nothing. It defeats casual interception — and it is why mobile testing usually starts with unpinning via Frida or patching the APK.' },
  { id: 'mobile-storage-risk', path: '13-mobile-security', points: 4, match: 'exact',
    q: 'On a rooted or jailbroken device, which app storage location should never hold an authentication token in plain text? (one word — the general term for app-private on-device storage)',
    answer: ['local storage', 'localstorage', 'shared preferences', 'sharedpreferences', 'device storage', 'local'],
    hint: 'It is the ordinary place an app saves its own files, which root access reads freely.',
    explain: 'App-private storage is only private while the OS enforces it — root or jailbreak removes that boundary entirely. Tokens belong in the platform keystore (Android Keystore, iOS Keychain), which is backed by hardware on modern devices.' },
  { id: 'mobile-exported-activity', path: '13-mobile-security', points: 5, match: 'exact',
    q: 'In AndroidManifest.xml, which attribute set to true lets other apps on the device launch a component directly? (one word, the attribute name)',
    answer: ['exported', 'android:exported'],
    hint: 'The word describes making something available outside its own app.',
    explain: 'android:exported="true" makes a component reachable by any other app on the device. When that component skips its own permission check, it becomes a direct entry point — which is why enumerating exported components is one of the first steps in a mobile assessment.' },

  /* ---- 14 Ethical Hacking ---- */
  { id: 'eh-scope-first', path: '14-ethical-hacking', points: 4, match: 'exact',
    q: 'Before any testing begins, what single document defines what you may test, when, and how — and is your legal protection? (three words, or its common abbreviation)',
    answer: ['rules of engagement', 'roe', 'rules-of-engagement'],
    hint: 'It is the agreement that turns testing into authorised testing.',
    explain: 'The Rules of Engagement fix scope, timing, permitted techniques and contacts. Without it you have no authorisation, and authorisation is the only thing separating a penetration test from an offence. Anything outside the ROE is out of bounds however interesting it looks.' },
  { id: 'eh-passive-vs-active', path: '14-ethical-hacking', points: 4, match: 'exact',
    q: 'Reading a company\'s public DNS records versus port-scanning their servers: which of these two is ACTIVE reconnaissance? (answer: dns or portscan)',
    answer: ['portscan', 'port scan', 'port-scan', 'portscanning', 'scanning'],
    hint: 'One of them sends packets at the target\'s systems.',
    explain: 'Passive recon reads public sources without touching the target; active recon sends traffic to it. The line is legal as well as tactical — reading public records is not unauthorised access, and probing systems without permission can be.' },
  { id: 'eh-pivot-term', path: '14-ethical-hacking', points: 5, match: 'exact',
    q: 'You have compromised one machine and use it as a route to reach systems you could not touch directly. What is this movement through the network called? (two words)',
    answer: ['lateral movement', 'lateral-movement', 'pivoting', 'lateral'],
    hint: 'It is sideways progress, not upward — you are not gaining privileges, you are gaining reach.',
    explain: 'Lateral movement is how initial access becomes a breach. Escalation gains privilege, lateral movement gains reach, and most of the damage happens during the latter — which is why segmentation and internal detection matter more than perimeter strength.' },

  /* ---- 15 Bug Bounty ---- */
  { id: 'bb-duplicate', path: '15-bug-bounty', points: 3, match: 'exact',
    q: 'You submit a valid, well-written report and receive no bounty because someone reported the same bug two days earlier. What status will the report be closed as? (one word)',
    answer: ['duplicate', 'dupe'],
    hint: 'The finding was real, but not first.',
    explain: 'Duplicates are the ordinary reality of bug bounty: only the first report is paid. It is the main reason hunters favour newly launched scope, recently changed features, and areas requiring unusual setup — anywhere the crowd has not already been.' },
  { id: 'bb-out-of-scope', path: '15-bug-bounty', points: 4, match: 'exact',
    q: 'A program\'s policy lists *.example.com as in scope, and explicitly excludes blog.example.com. You find a critical flaw on blog.example.com. Should you exploit it further to prove impact? (yes or no)',
    answer: ['no'],
    hint: 'The exclusion is part of the authorisation, not a suggestion.',
    explain: 'No. Scope is the boundary of your legal authorisation, and an explicit exclusion removes it entirely for that host. Report it as a courtesy if you like, but testing further is unauthorised access regardless of how severe the flaw is.' },
  { id: 'bb-poc-quality', path: '15-bug-bounty', points: 4, match: 'exact',
    q: 'A triager cannot reproduce your finding from your report. What is the most likely outcome? (one word)',
    answer: ['closed', 'rejected', 'informative', 'not applicable', 'n/a'],
    hint: 'It is what happens to a report nobody can confirm.',
    explain: 'Irreproducible reports get closed, however real the bug was. This is why reproduction steps carry the report: exact account used, exact request, what you saw versus what you expected. Anything a triager has to ask you for is delay, and delay is where duplicates happen.' },

  /* ---- 16 Advanced ---- */
  { id: 'adv-golden-ticket-hash', path: '16-advanced', points: 6, match: 'exact',
    q: 'Forging a Golden Ticket requires the password hash of one specific account. Which account? (one word)',
    answer: ['krbtgt'],
    hint: 'It is the account that signs every Kerberos ticket in the domain.',
    explain: 'The krbtgt hash signs all ticket-granting tickets, so holding it lets you mint credentials for any user, for any service, that survive password resets. Recovery requires resetting krbtgt twice — which is why it is the definition of total domain compromise.' },
  { id: 'adv-pth', path: '16-advanced', points: 5, match: 'exact',
    q: 'An attacker authenticates as a user without ever knowing or cracking their password, by presenting the NTLM hash directly. What is this attack called? (three words)',
    answer: ['pass the hash', 'pass-the-hash', 'passthehash', 'pth'],
    hint: 'The name describes exactly what is handed over instead of a password.',
    explain: 'NTLM authentication accepts the hash as the credential, so the hash IS the password for authentication purposes. That is why "we hash passwords" provides no protection here, and why credential isolation and disabling NTLM where possible matter more than password complexity.' },
  { id: 'adv-bloodhound-purpose', path: '16-advanced', points: 5, match: 'exact',
    q: 'BloodHound treats Active Directory as which mathematical structure, so it can compute shortest paths to Domain Admin? (one word)',
    answer: ['graph', 'a graph', 'directed graph'],
    hint: 'Nodes and edges.',
    explain: 'Modelling AD as a graph of principals and permission edges makes the shortest path to Domain Admin computable. That reframing is the whole contribution: individually reasonable permissions chain into a path nobody designed, and no human review of a permissions list finds it.' },

  /* ---- 17 Malware & RE ---- */
  { id: 'malware-mutex-why', path: '17-malware-re', points: 5, match: 'exact',
    q: 'Malware creates a named mutex on startup and exits if it already exists. What is it preventing? (one word)',
    answer: ['reinfection', 'double infection', 'duplicate', 'reinfecting', 'multiple instances', 'two instances'],
    hint: 'It is checking whether a copy of itself is already running.',
    explain: 'The mutex stops a second instance infecting an already-infected machine, which would be noisy and unstable. That name is often highly distinctive and rarely changes between builds, which makes it excellent detection material — a rare case of malware handing defenders a stable signature.' },
  { id: 'malware-static-vs-dynamic', path: '17-malware-re', points: 4, match: 'exact',
    q: 'Running strings and reading the PE headers without executing the sample: is that static or dynamic analysis? (one word)',
    answer: ['static'],
    hint: 'Nothing was executed.',
    explain: 'Static analysis examines the file without running it — safe, fast, and defeated by packing. Dynamic analysis runs it in an isolated sandbox and sees what it actually does, at the cost of needing containment and of malware that detects sandboxes and behaves.' },
  { id: 'malware-c2-term', path: '17-malware-re', points: 4, match: 'exact',
    q: 'Implanted malware periodically contacts its operator to fetch instructions. What is the regular, timed nature of that callback called? (one word)',
    answer: ['beacon', 'beaconing', 'beacons'],
    hint: 'The word describes a signal sent at intervals.',
    explain: 'Beaconing is often the most detectable thing malware does. Even over TLS, where content is hidden, the regularity of the interval stands out against human traffic — which is why detection focuses on timing and jitter rather than payload.' },

  /* ---- 18 AI Security ---- */
  { id: 'ai-indirect-source', path: '18-ai-security', points: 5, match: 'exact',
    q: 'An assistant summarises a web page that contains hidden instructions, and follows them. Is this direct or indirect prompt injection? (one word)',
    answer: ['indirect'],
    hint: 'Consider who supplied the malicious text — the user, or a third party.',
    explain: 'Indirect: the payload arrived through content the model retrieved, not from the user. It is the more dangerous form because the victim never sees it and never consented — the difference between talking your own assistant into misbehaving and weaponising someone else\'s.' },
  { id: 'ai-agent-control', path: '18-ai-security', points: 5, match: 'exact',
    q: 'Since prompt injection cannot be reliably prevented at the model, where must the durable control live — at the model\'s input, or at what the model is permitted to DO? (answer: input or actions)',
    answer: ['actions', 'action', 'tools', 'what it can do'],
    hint: 'One of these two can be enforced deterministically; the other cannot.',
    explain: 'Input filtering is probabilistic and endlessly bypassable. Constraining actions is deterministic: least-privilege tool scopes, read-only defaults, and human confirmation before anything irreversible. Assume the model will be fooled and make that survivable.' },
  { id: 'ai-training-poison', path: '18-ai-security', points: 5, match: 'exact',
    q: 'An attacker contributes crafted examples to a dataset so the resulting model behaves incorrectly on chosen inputs. What is this attack called? (two words)',
    answer: ['data poisoning', 'training data poisoning', 'poisoning', 'dataset poisoning'],
    hint: 'It happens before the model is trained, not after it is deployed.',
    explain: 'Data poisoning attacks the supply chain of the model itself, and it is uniquely hard to detect because the model behaves perfectly on everything except the attacker\'s trigger. Provenance and curation of training data are the defences; inspecting the finished model is not.' },

  /* ---- 19 CTF ---- */
  { id: 'ctf-rot13-flag', path: '19-ctf-challenges', points: 4, match: 'exact',
    q: 'Decode this ROT13 flag:\n\nXnfuFrp{ebg13_vf_abg_pelcgb}',
    answer: ['KashSec{rot13_is_not_crypto}'],
    hint: 'Shift every letter 13 places. Digits and punctuation are unchanged.',
    explain: 'ROT13 leaves digits and symbols alone, which is why the braces and underscores survive intact and give the flag format away immediately. Recognising the shape KashSec{...} inside scrambled text is usually the fastest route to identifying the encoding.' },
  { id: 'ctf-magic-bytes', path: '19-ctf-challenges', points: 5, match: 'exact',
    q: 'A file named image.png will not open. Its first bytes are:\n\n50 4B 03 04\n\nWhat kind of file is it really? (the common extension, no dot)',
    answer: ['zip'],
    hint: 'Those four bytes read as "PK" in ASCII — the initials of the format\'s creator.',
    explain: '50 4B is "PK", the ZIP magic number. Extensions are a naming convention; the first bytes are what a parser actually reads. Checking magic bytes rather than the extension is both a CTF reflex and a real defence against upload filters that trust the filename.' },

  /* ---- 20 Career Prep ---- */
  { id: 'career-quantify', path: '20-career-prep', points: 4, match: 'exact',
    q: 'Which CV bullet is stronger?\n\n  A) "Responsible for vulnerability management"\n  B) "Cut mean time to patch critical findings from 45 days to 9"\n\n(answer with the letter)',
    answer: ['b'],
    hint: 'One states a duty; the other states an outcome with numbers.',
    explain: 'B names an outcome and quantifies it. "Responsible for" describes what you were assigned; a number describes what changed because you were there. Every bullet you can attach a figure to is worth more than three that you cannot.' },
  { id: 'career-first-role', path: '20-career-prep', points: 3, match: 'exact',
    q: 'Which role is the most common entry point into cybersecurity, monitoring alerts and triaging incidents? (three words, or the common short form)',
    answer: ['soc analyst', 'security analyst', 'soc analyst tier 1', 'tier 1 soc analyst', 'soc'],
    hint: 'It works in the Security Operations Centre.',
    explain: 'SOC analyst is the most common way in, because it needs breadth rather than deep specialisation and teaches you what normal looks like — which is the foundation for detection engineering, incident response and threat hunting alike.' },
  { id: 'career-portfolio-proof', path: '20-career-prep', points: 4, match: 'exact',
    q: 'You have no professional experience. Which is better evidence to an interviewer: a certificate of course completion, or a written-up project showing what you tried, what failed and what you concluded? (answer: certificate or writeup)',
    answer: ['writeup', 'write-up', 'write up', 'project', 'the writeup'],
    hint: 'One shows you attended; the other shows you can think.',
    explain: 'A write-up demonstrates judgement — what you tried, why it failed, what you did next. Certificates show attendance, which everyone applying also has. The write-up is also something you can be asked about for twenty minutes, and that conversation is the interview.' },

  /* ---- 21 API Security ---- */
  { id: 'api-mass-assign-fix', path: '21-api-security', points: 5, match: 'exact',
    q: 'A PATCH /profile endpoint binds the whole JSON body onto the user object, so sending {"isAdmin":true} works. Should the fix blocklist dangerous fields, or allowlist writable ones? (one word)',
    answer: ['allowlist', 'allow-list', 'allow list', 'whitelist'],
    hint: 'One approach fails silently the next time someone adds a field.',
    explain: 'Allowlist the fields a client may set. A blocklist is wrong by default: add a sensitive field later and forget to list it, and the hole opens itself. This is why explicit input models — a DTO or serializer — beat binding a request body straight onto a persistence object.' },
  { id: 'api-rate-limit-header', path: '21-api-security', points: 5, match: 'exact',
    q: 'A rate limiter behind a proxy identifies clients by a request header the client itself can set. Which header is it almost always? (the header name)',
    answer: ['x-forwarded-for', 'xff', 'x forwarded for'],
    hint: 'It is the header proxies add to record the original client address.',
    explain: 'X-Forwarded-For is a hint added by proxies and freely forged by anyone. Trusting it for identity means trusting the attacker. Take the address from the connection, or from the specific position in the chain your own trusted proxy wrote — and rate limit per account as well, or spraying walks straight past.' },
  { id: 'api-graphql-depth', path: '21-api-security', points: 5, match: 'exact',
    q: 'A GraphQL query nests related fields into each other repeatedly until the server exhausts its resources. Which limit stops this class of attack? (one word — the property being limited)',
    answer: ['depth', 'query depth', 'nesting'],
    hint: 'It is about how deeply a query may nest, not how many are sent.',
    explain: 'Depth limiting caps nesting so a single query cannot explode combinatorially; complexity scoring and timeouts complement it. Rate limiting alone does not help here, because the damage comes from one expensive query rather than many cheap ones.' },

  /* ---- 22 DevSecOps ---- */
  { id: 'devsecops-shift-left', path: '22-devsecops-appsec', points: 4, match: 'exact',
    q: 'Moving security testing earlier — into design and the developer\'s editor rather than a pre-release gate — is known as shifting security which direction? (one word)',
    answer: ['left'],
    hint: 'Picture the delivery pipeline drawn as a line with release at the far end. You are moving testing towards the start of it.',
    explain: 'Shifting left cuts the cost of a defect by finding it before it is built on. The failure mode to avoid is shifting the *noise* left too — flooding developers with unprioritised scanner output trains them to ignore all of it.' },
  { id: 'devsecops-secret-rotate', path: '22-devsecops-appsec', points: 5, match: 'exact',
    q: 'An API key was committed and pushed to a public repository an hour ago. What is the FIRST action — rewrite git history, or rotate the key? (answer: history or rotate)',
    answer: ['rotate', 'rotate the key', 'rotate it'],
    hint: 'Consider what has already happened to that secret in the last hour.',
    explain: 'Rotate first. Once pushed, the secret is compromised: forks, clones, caches and automated scrapers already have it, and rewriting history removes none of those. History cleanup is worth doing afterwards, but the credential is dead the moment it lands.' },
  { id: 'devsecops-sast-vs-dast', path: '22-devsecops-appsec', points: 4, match: 'exact',
    q: 'One tool reads source code without running it; the other attacks the running application from outside. Which one is DAST? (answer: source or running)',
    answer: ['running', 'the running one', 'running application'],
    hint: 'The D stands for Dynamic.',
    explain: 'SAST is static — it reads code and finds flaws early but produces false positives about paths that are never reachable. DAST is dynamic, testing the deployed app, so its findings are real but arrive late and only cover what it can reach. They find genuinely different bugs.' },

  /* ---- 23 GRC ---- */
  { id: 'grc-soc2-type', path: '23-grc-compliance', points: 4, match: 'exact',
    q: 'One SOC 2 report assesses controls at a single point in time; the other assesses their operating effectiveness across a period of months. Which is the more rigorous — Type 1 or Type 2? (answer with the number)',
    answer: ['2', 'type 2', 'type ii', 'ii'],
    hint: 'One is a snapshot, the other is a film.',
    explain: 'Type 1 says the controls were designed and in place on a date; Type 2 says they actually operated over a period, typically 3 to 12 months. Customers ask for Type 2 because a snapshot can be arranged, and sustained operation cannot.' },
  { id: 'grc-evidence', path: '23-grc-compliance', points: 4, match: 'exact',
    q: 'An auditor is shown a well-written access review policy that nobody has ever actually run. Does the control pass? (yes or no)',
    answer: ['no'],
    hint: 'Auditors test whether something happened, not whether it was written down.',
    explain: 'No. Auditors ask for evidence that the control operated — dated tickets, approvals, logs, signed reviews. A policy with no evidence behind it is documentation, not a control, and this gap is the most common finding in a first audit.' },
  { id: 'grc-residual-risk', path: '23-grc-compliance', points: 4, match: 'exact',
    q: 'What is the name for the risk that remains after your controls are in place — the number that should actually be accepted or escalated? (two words)',
    answer: ['residual risk', 'residual'],
    hint: 'It is what is left over.',
    explain: 'Residual risk is what remains post-control, and it is the figure a decision should be made about. The pre-control (inherent) score is mainly useful for showing that the controls are worth what they cost.' },

  /* ---- 24 Zero Trust ---- */
  { id: 'zt-vpn-difference', path: '24-zero-trust', points: 5, match: 'exact',
    q: 'A VPN grants access to a network; ZTNA grants access to something narrower. What is it? (one word)',
    answer: ['application', 'applications', 'app', 'apps', 'resource'],
    hint: 'It is the specific thing you actually needed, not everything around it.',
    explain: 'ZTNA brokers access per application, so a compromised device reaches only what it was authorised for. A VPN drops you onto the network, where everything else becomes reachable — which is why VPN access so often converts directly into lateral movement.' },
  { id: 'zt-implicit-trust', path: '24-zero-trust', points: 4, match: 'exact',
    q: 'Traditional network security grants trust based on one property of a request that Zero Trust explicitly refuses to treat as meaningful. What is that property? (one word)',
    answer: ['location', 'network location', 'position'],
    hint: 'It is about where the request came from, not who sent it.',
    explain: 'Being inside the network is not evidence of anything. Zero Trust removes location from the trust decision and replaces it with verified identity and device posture, checked per request — which is what makes "never trust, always verify" a concrete design rule rather than a slogan.' },
  { id: 'zt-device-posture', path: '24-zero-trust', points: 4, match: 'exact',
    q: 'Beyond verifying WHO is asking, Zero Trust also verifies the state of the machine they are asking from — patch level, disk encryption, EDR presence. What is this check called? (two words)',
    answer: ['device posture', 'device health', 'posture', 'device posture check'],
    hint: 'It is about the condition of the endpoint at the moment of the request.',
    explain: 'A valid identity on a compromised laptop is still a compromised session. Posture checks make access conditional on device state, so an unpatched or unmanaged machine gets reduced access or none — and they must be evaluated continuously, not just at login.' },

  /* ---- 25 OT/ICS ---- */
  { id: 'ics-availability-first', path: '25-ot-ics-security', points: 5, match: 'exact',
    q: 'In IT the CIA triad is usually ordered Confidentiality, Integrity, Availability. In OT it is commonly reversed. Which element comes FIRST in OT? (one word)',
    answer: ['availability'],
    hint: 'Consider what happens if a control system stops responding while a physical process is running.',
    explain: 'In OT the process is physical, so stopping it can be dangerous or destructive — a turbine or a furnace does not pause gracefully. That inversion explains most OT security decisions, including why patching windows are rare and why anything inline is treated with suspicion.' },
  { id: 'ics-modbus-auth', path: '25-ot-ics-security', points: 5, match: 'exact',
    q: 'Modbus, designed in 1979, has no built-in authentication or encryption. What did its designers assume would provide security? (one word — a property of the network it ran on)',
    answer: ['isolation', 'isolated', 'air gap', 'airgap', 'air-gap', 'physical isolation', 'segregation'],
    hint: 'They assumed nobody hostile could reach the wire in the first place.',
    explain: 'Modbus assumed a physically isolated serial network. When those networks were bridged to IP for convenience, the assumption silently became false while the protocol did not change — which is why OT security relies on segmentation and monitoring rather than fixing protocols that cannot be fixed.' },
  { id: 'ics-stuxnet-target', path: '25-ot-ics-security', points: 5, match: 'exact',
    q: 'Stuxnet was notable for crossing an air gap and then manipulating a specific class of industrial device while reporting normal readings to operators. Which class of device? (one word, or its abbreviation)',
    answer: ['plc', 'plcs', 'programmable logic controller', 'programmable logic controllers'],
    hint: 'It is the controller that directly drives industrial equipment.',
    explain: 'Stuxnet reprogrammed PLCs driving centrifuges while replaying normal values to the monitoring systems. That combination — physical effect plus falsified telemetry — is what made it a turning point: it proved code could cause physical destruction while the operators watched a screen saying everything was fine.' },

];
