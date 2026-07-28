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
];
