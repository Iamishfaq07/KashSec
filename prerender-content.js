/*
 * Long-form content for the tool and lab stub pages. Build-time only — this
 * file is imported by generate-prerender.js and never shipped to browsers,
 * so it costs visitors nothing.
 *
 * WHY THIS EXISTS
 * Every tool stub used to be ~53 words of unique prose followed by a link
 * list naming all 31 other tools. That list was ~90% of the page and byte
 * identical across all 32 pages, which is the textbook shape of thin,
 * near-duplicate content — no amount of keyword targeting ranks a page like
 * that. These entries give each page something a person would actually want
 * to read, and cut the link list down to a few genuinely related items.
 *
 * WHAT WE CAN REALISTICALLY RANK FOR
 * Not "jwt decoder" or "cvss calculator" — jwt.io, Auth0 and FIRST.org (the
 * body that publishes the CVSS standard) own those, and no amount of on-page
 * work beats a standards body on its own term. What this site has that none
 * of them do is a free course and a hands-on lab behind every tool, so each
 * page targets the learner's question ("what does this output mean", "is it
 * safe to paste this here") rather than the practitioner's bare tool query,
 * and links into the lesson and lab that answer it properly.
 *
 * Every `steps` entry describes controls the tool actually has — they were
 * read out of the render functions in app.js, not imagined. If you change a
 * tool's inputs, change its steps here too.
 */

export const TOOL_CONTENT = {
  dnsrecords: {
    intent:'dns record types A AAAA MX CNAME TXT practice',
    intro:'Practice choosing DNS record types with fictional, fixed examples. This exercise runs locally and does not query a resolver or report information about a live domain. After each correct answer it shows an example record and explains what it represents.',
    steps:['Choose one of the practice tasks.', 'Read the question and select a record type.', 'Check your answer and use the hint if needed.', 'Read the example record, then try another task.'],
    notes:[
      {h:'Addresses and names',p:'A and AAAA records carry IPv4 and IPv6 addresses. CNAME records name an alias target; following the target may require another lookup before an address is available.'},
      {h:'Mail and text',p:'MX records specify a mail exchanger and preference value. TXT records carry text that applications can interpret for different purposes; a TXT record is not inherently an email-security policy.'},
      {h:'Understand the TTL',p:'The numeric TTL in an answer describes a caching duration in seconds. It is useful when planning changes, but does not guarantee that every resolver will display the same change by a particular deadline.'}
    ],
    faq:[
      {q:'Does this tool perform DNS lookups?',a:'No. The names and addresses are fixed examples and the activity makes no DNS requests.'},
      {q:'What is the difference between A and AAAA?',a:'An A record contains an IPv4 address, while an AAAA record contains an IPv6 address.'},
      {q:'Does a low TTL guarantee instant propagation?',a:'No. TTLs describe caching and different resolver behavior can affect when an answer changes.'}
    ],
    related:['subnet','cidroverlap','httpstatus','httpbuilder']
  },
  httpstatus: {
    intent:'http status code practice 401 403 404 429',
    intro:'Practice interpreting four fictional HTTP responses and choosing an appropriate next step. The cases run in your browser without contacting a server. They focus on authentication, refused requests, missing or undisclosed resources, and rate limits.',
    steps:['Choose a sample response.', 'Read the status and any sample header.', 'Choose a next step and check the explanation.', 'Try each case, then compare it with the linked HTTP lesson.'],
    notes:[
      {h:'Authentication and refusal differ',p:'A 401 response indicates that valid authentication credentials are missing. A 403 means the server understood but refused the request; it does not prove the requester was identified.'},
      {h:'A missing page may be undisclosed',p:'A 404 can mean a current representation was not found or that the server is unwilling to disclose one. Check the URL and your authorized context rather than drawing conclusions from the status alone.'},
      {h:'Respect rate limits',p:'A 429 indicates too many requests. Retry-After may describe a delay, but a client should also consider whether a request is safe to repeat and follow the service’s documented limits.'}
    ],
    faq:[
      {q:'Does this tool send requests?',a:'No. It uses fictional responses built into the page; you do not need an account or a network service to work through them.'},
      {q:'Does 403 always mean I am authenticated?',a:'No. The server refuses the request, but the status alone does not establish whether it identified the requester.'},
      {q:'Does a 404 prove that a resource never existed?',a:'No. It can also indicate that the server is unwilling to disclose a current representation.'}
    ],
    related:['httpbuilder','headers','jwt','vulntriage']
  },
  vulntriage: {
    intent: 'vulnerability triage practice applicability mitigation verification',
    intro: 'Practice making defensible vulnerability decisions using fictional cases. The exercise separates evidence that a vulnerability is exploited from evidence that your own deployed service is affected. It does not query a live vulnerability database or calculate risk for a real organization.',
    steps: ['Choose one of the three fictional cases.', 'Read the evidence and choose the next action.', 'Check your reasoning and compare it with the explanation.', 'Read the linked lessons and repeat with a different case.'],
    notes: [
      {h:'Confirm applicability', p:'Find the version and configuration actually deployed on the affected asset. An inventory record or a catalog entry is a starting point, not proof that a particular service is vulnerable.'},
      {h:'Look beyond severity', p:'Consider exposure, reachability, observed exploitation, operational impact and uncertainty. A score is a useful input, but it does not make the decision for the asset owner.'},
      {h:'Verify closure', p:'A merged change is not necessarily deployed everywhere. Check the running build and relevant behavior, record what was tested, and identify remaining risk.'}
    ],
    faq: [
      {q:'Does this tool look up real CVEs?', a:'No. The cases are fictional and run locally. Consult current vendor advisories and authoritative catalogs for real findings.'},
      {q:'Does known exploitation prove my asset is affected?', a:'No. It is an important signal to investigate; verify the version, configuration and exposure on the relevant asset.'},
      {q:'Does a passing CI build prove remediation?', a:'It is useful evidence but does not prove that the fix was deployed to every affected asset. Verify the deployed change and relevant behavior.'}
    ],
    related: ['cvss', 'sbomcheck', 'riskregister', 'vulnreport']
  },
  encoder: {
    intent: 'base64 decode online privately',
    intro: 'Base64, URL and hex encoding are not encryption. They are ways of rewriting data so it survives being sent through systems that only cope with plain text. Attackers lean on that confusion constantly: an encoded payload looks scrambled enough to slip past a bored reviewer while being trivially readable by anyone who recognises the format.',
    steps: ['Pick a mode — Base64, URL or Hex.', 'Paste your text into Input.', 'Press Encode ↓ or Decode ↑.', 'Use ⇅ Move output to input to chain conversions, which is how you unpick a value that was encoded twice.'],
    notes: [
      { h: 'How to recognise each format', p: 'Base64 uses A–Z, a–z, 0–9, + and / and often ends in one or two = signs. URL encoding shows %20, %2F and similar. Hex is pairs of 0–9 and a–f, often twice the length of the original.' },
      { h: 'Encoding is not security', p: 'If you find a password, token or API key that is "protected" by Base64, treat it as fully exposed. That is a finding worth reporting, not a control.' },
    ],
    faq: [
      { q: 'Is Base64 a form of encryption?', a: 'No. Encryption needs a key that an attacker does not have. Base64 needs nothing at all — anyone can reverse it in seconds, including with this page. It is an encoding, not a cipher.' },
      { q: 'Is it safe to decode sensitive data in an online tool?', a: 'Usually not, because most online encoders send your input to a server. This one does not: everything runs in your browser, so nothing leaves your machine. Check that claim on any tool you use — view the network tab and watch for requests while you type.' },
      { q: 'Why does my Base64 string end in one or two equals signs?', a: 'That is padding. Base64 works in three-byte groups, so when the input does not divide evenly the encoder pads the result. It carries no meaning and does not indicate anything about the content.' },
    ],
    related: ['base32', 'hashid', 'entropy', 'cipher'],
  },
  hash: {
    intent: 'generate sha256 hash of text online',
    intro: 'A hash turns any input into a fixed-length fingerprint, and it only works one way — you cannot run it backwards to recover the original. That property is what makes hashes useful for verifying downloads, storing passwords and spotting tampering, and it is why "we hashed it" and "we encrypted it" mean very different things.',
    steps: ['Type or paste anything into Text to hash.', 'Read the digests generated for the input.', 'Change one character and watch every digest change completely — that is the avalanche effect.'],
    notes: [
      { h: 'The same input always gives the same hash', p: 'This is why hashes verify downloads. Publish the hash, and anyone can confirm their copy matches yours byte for byte.' },
      { h: 'Hashing a password is not enough on its own', p: 'Attackers precompute hashes of common passwords. Real password storage needs a unique salt per user and a deliberately slow algorithm such as bcrypt, scrypt or Argon2 — never a raw SHA-256.' },
    ],
    faq: [
      { q: 'Can a hash be reversed back into the original text?', a: 'Not directly. But if the input was short or predictable — a common password, a short number — an attacker can simply hash billions of guesses and compare. That is not reversing the hash, it is outrunning your input space, and it works just as well.' },
      { q: 'Why do MD5 and SHA-1 still appear if they are broken?', a: 'They are broken for security — collisions can be produced deliberately — but still fine as non-security checksums, and you will meet them constantly in old systems and CTF challenges. Recognising them matters; trusting them does not.' },
      { q: 'What is the difference between hashing and encryption?', a: 'Encryption is reversible with the right key, because the point is to get the data back. Hashing is deliberately one-way, because the point is to prove something matches without storing it.' },
    ],
    related: ['hashid', 'passwordcrack-lab', 'entropy', 'password'],
  },
  jwt: {
    intent: 'what is inside a jwt and how to read it',
    intro: 'A JSON Web Token is three Base64url segments separated by dots: a header saying how it was signed, a payload of claims about who you are, and a signature. The part that surprises people is that the payload is not encrypted. Anyone holding the token can read every claim inside it — this page just makes that obvious.',
    steps: ['Paste a JWT into the input box.', 'Read the decoded Header, Payload and Signature panes.', 'Check the exp claim to see when the token expires, and iss and aud to see who issued it and who it was meant for.'],
    notes: [
      { h: 'Decoding is not verifying', p: 'This page shows you what a token says. It does not prove the token is genuine — that requires the signing key, which lives on the server. A system that decodes a token without verifying its signature will accept anything you hand it.' },
      { h: 'Never put secrets in a payload', p: 'Because claims are readable by anyone with the token, a JWT payload is the wrong place for anything private. If you find one carrying internal IDs, roles or personal data, that is worth writing up.' },
      { h: 'The alg field is attacker-controlled input', p: 'Historically, libraries trusted the header\'s alg value — so setting it to none, or swapping RS256 for HS256, could make verification pass for a token the attacker signed themselves.' },
    ],
    faq: [
      { q: 'Is it safe to paste a real JWT into an online decoder?', a: 'Treat a JWT like a password — it usually is one, in the sense that holding it is enough to act as that user. Most online decoders post it to a server. This one decodes entirely in your browser and sends nothing anywhere, but the safe habit is to use expired or test tokens wherever you can.' },
      { q: 'Why can I read the payload without any key?', a: 'Because a standard JWT is signed, not encrypted. The signature proves the contents were not altered; it does nothing to hide them. If claims genuinely must stay private, the specification for that is JWE, not JWS.' },
      { q: 'How do I check whether a JWT is actually valid?', a: 'You need the issuer\'s signing key and must verify the signature, the expiry, and that the issuer and audience are the ones you expect. Checking expiry alone is a very common and very exploitable mistake.' },
    ],
    related: ['jwt-lab', 'base32', 'encoder', 'entropy'],
  },
  cvss: {
    intent: 'how to score a vulnerability with cvss',
    intro: 'CVSS turns a vulnerability into a number from 0 to 10 so that teams can argue about priorities with a shared vocabulary. The score comes from a handful of metrics about how the flaw is reached and what it costs you, and learning to pick those metrics honestly matters far more than the arithmetic.',
    steps: ['Choose CVSS 4.0 or the legacy 3.1 view.', 'Set the Base metrics; add Threat, Environmental, and Supplemental metrics when the context is known.', 'Copy the vector string with the score so another person can reproduce your assessment.'],
    notes: [
      { h: 'Attack Vector does most of the work', p: 'Network beats Adjacent beats Local beats Physical, and the gap is large. Reachability from the internet is the single biggest driver of a high score.' },
      { h: 'Scope change is the most misunderstood metric', p: 'Scope changes when the flaw lets you affect resources beyond the vulnerable component itself — a container escape, or a browser sandbox break. It pushes scores up sharply, so do not set it casually.' },
      { h: 'A base score is not a risk rating', p: 'CVSS base scores deliberately ignore your environment. A 9.8 on a system with no data and no network path may matter less to you than a 6.5 on your payment service. Use the score to start the conversation, not to end it.' },
    ],
    faq: [
      { q: 'What counts as a critical CVSS score?', a: 'On the standard scale: 0.1–3.9 Low, 4.0–6.9 Medium, 7.0–8.9 High, and 9.0–10.0 Critical. Those bands are conventions for reporting, not laws — plenty of organisations remap them to their own SLAs.' },
      { q: 'What is a CVSS vector string?', a: 'A compact text form of every metric you picked, like CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N. It lets anyone reproduce your exact score, so include it with the number in reports.' },
      { q: 'Should I be using CVSS 3.1 or 4.0?', a: 'CVSS 4.0 is the current standard and separates vulnerable-system from subsequent-system impacts. CVSS 3.1 remains useful when reading older reports. Always state the version and vector alongside the score.' },
    ],
    related: ['vulnreport', 'slacalc', 'riskregister', 'sbomcheck'],
  },
  subnet: {
    intent: 'what does slash 24 mean subnet calculator',
    intro: 'Subnetting is the piece of networking that stops most beginners cold, usually because it is taught as arithmetic instead of as a question: where does the network part of this address end and the host part begin? The slash number answers exactly that, and once it clicks the rest is bookkeeping.',
    steps: ['Enter an IPv4 address with a prefix, such as 192.168.1.10/24.', 'Read the network address, broadcast address, usable host range and total host count.', 'Try changing only the prefix and watch the ranges grow and shrink.'],
    notes: [
      { h: 'The prefix counts fixed bits', p: '/24 means the first 24 bits identify the network and the remaining 8 identify hosts, giving 256 addresses of which 254 are usable. Every prefix step down doubles the size of the block.' },
      { h: 'Two addresses are always spent', p: 'The first address in a block names the network itself and the last is the broadcast address, so a /24 holds 256 addresses but only 254 hosts.' },
      { h: 'Why this matters in security', p: 'Scan scoping, firewall rules and "is this address inside our network" checks are all subnet questions. Getting a prefix wrong in a rule is how internal services end up exposed.' },
    ],
    faq: [
      { q: 'How many hosts are in a /24?', a: '256 total addresses, 254 usable — the network and broadcast addresses are reserved. A /25 halves that to 126 usable, a /23 doubles it to 510.' },
      { q: 'What is the difference between CIDR notation and a subnet mask?', a: 'They express the same thing. /24 and 255.255.255.0 are identical statements: 24 leading one-bits. CIDR is just the shorter way to write it.' },
      { q: 'What are the private IP ranges?', a: '10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. They are not routable on the public internet, which is why an SSRF that reaches them is interesting to an attacker.' },
    ],
    related: ['vlsm', 'cidroverlap', 'ssrf-lab', 'httpbuilder'],
  },
  password: {
    intent: 'how strong is my password really',
    intro: 'Most password advice measures the wrong thing. Complexity rules — one capital, one digit, one symbol — produce passwords that are hard for humans to remember and easy for cracking rigs to guess, because everyone satisfies them the same predictable way. Length and unpredictability are what actually cost an attacker time.',
    steps: ['Type a password into the box — it is never sent anywhere.', 'Read the strength assessment and the reasoning behind it.', 'Try a long passphrase of unrelated words and compare it against a short password full of substitutions.'],
    notes: [
      { h: 'P@ssw0rd! is not a strong password', p: 'Cracking tools apply exactly these substitutions automatically. Replacing a with @ and o with 0 adds effectively nothing, because the rule is in every wordlist mangling ruleset.' },
      { h: 'Length beats complexity', p: 'Four unrelated words are far harder to crack than eight mixed characters, and far easier to remember. This is why passphrases have replaced complexity rules in modern guidance.' },
      { h: 'Reuse is the real risk', p: 'A perfect password used in two places is only as safe as the weaker site. Breach data means attackers do not need to crack anything — they just replay what leaked elsewhere.' },
    ],
    faq: [
      { q: 'Does this tool send my password anywhere?', a: 'No. The check runs entirely in your browser and nothing is transmitted or stored. That said, the correct instinct is never to type a real password into any website — try a variation instead.' },
      { q: 'How long should a password be?', a: 'Current guidance favours a minimum of 12–14 characters, and longer for anything valuable. Once you are past that, uniqueness and multi-factor authentication matter more than adding another symbol.' },
      { q: 'Are password managers safe?', a: 'Far safer than the alternative, which is reuse. One strong master password plus a manager gives every account a unique random secret, and that removes the single biggest cause of account takeover.' },
    ],
    related: ['passpolicy', 'passwordcrack-lab', 'entropy', 'hash'],
  },
  cipher: {
    intent: 'caesar cipher vigenere xor decoder online',
    intro: 'Classical ciphers are useless for protecting anything today, which is exactly why they are worth playing with. They are simple enough to break by hand, so you can watch each idea — shifting, keying, combining — fail for reasons that still explain how modern cryptography is attacked.',
    steps: ['Choose a cipher: Caesar/ROT shift, Vigenère with a keyword, or XOR with a key.', 'Enter your key.', 'Type into Input and press Encrypt ↓ or Decrypt ↑.'],
    notes: [
      { h: 'Caesar has only 25 keys', p: 'You can break it by trying all of them, which is why key space size is the first thing to ask about any cipher.' },
      { h: 'Vigenère hides letter frequency — until it does not', p: 'It resists simple frequency analysis, but repeating the key means repeating patterns, and the key length can be recovered from those repeats. Reusing key material is still how real systems fall.' },
      { h: 'XOR is genuinely unbreakable, under conditions nobody meets', p: 'XOR with a truly random key as long as the message, used once, is a one-time pad and is provably secure. Reuse that key even twice and the messages leak each other. This is not history — it is the same flaw that broke WEP.' },
    ],
    faq: [
      { q: 'What is ROT13?', a: 'A Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying it twice returns the original — which is why it survives as a way to hide spoilers, not secrets.' },
      { q: 'Are these ciphers safe to use for anything real?', a: 'No, and that is the point of the page. Every one of them is breakable by hand. For real work you want vetted modern algorithms in a library written by cryptographers.' },
      { q: 'Why do CTF challenges still use these?', a: 'Because recognising an encoding or a classical cipher quickly is a genuinely useful skill, and because they teach the reasoning — key space, frequency, reuse — that transfers to modern attacks.' },
    ],
    related: ['dhvisualizer', 'encoder', 'entropy', 'timingviz'],
  },
  regex: {
    intent: 'test a regex pattern with live matches',
    intro: 'Regular expressions are how you find a needle in a log file, and in security work you write them constantly — for grepping evidence, for detection rules, and occasionally for input validation, where they are also a classic source of bugs.',
    steps: ['Type a pattern into Pattern.', 'Paste sample text into Test text.', 'Watch matches highlight live as you refine the expression.'],
    notes: [
      { h: 'Build patterns incrementally', p: 'Start with something that matches too much, then tighten. Writing a long expression in one go and debugging it afterwards is how you lose an afternoon.' },
      { h: 'Anchors matter for validation', p: 'A pattern without ^ and $ matches anywhere inside the string. A validator checking for a safe value without anchoring can be defeated by putting the safe value next to a dangerous one.' },
      { h: 'Regex is the wrong tool for HTML and for blocklists', p: 'Filtering XSS or SQL injection by pattern-matching bad strings fails, because the space of encodings is effectively infinite. Parameterised queries and proper encoding fix those; regex does not.' },
    ],
    faq: [
      { q: 'What is catastrophic backtracking?', a: 'Some patterns with nested quantifiers take exponential time on crafted input, so a short string can hang a server. That is a denial-of-service bug known as ReDoS, and it is a real finding in real assessments.' },
      { q: 'What are the most useful pieces to learn first?', a: '\\d for digits, \\w for word characters, . for anything, + and * for repetition, ^ and $ for anchors, and parentheses for capture groups. That handful covers most log-hunting work.' },
      { q: 'Do all tools use the same regex syntax?', a: 'No. This tester uses JavaScript regex. grep, Python and PCRE differ in the details — lookbehind support and escaping especially — so test in the environment you will actually run in.' },
    ],
    related: ['logparser', 'yaratester', 'loganalysis-lab', 'codereview'],
  },
  hashid: {
    intent: 'identify what type of hash this is',
    intro: 'Before you can crack or verify a hash you have to know what it is, and the strongest clues are length and shape. This page reads those clues and tells you the likely candidates — the same first step a cracking workflow starts with.',
    steps: ['Paste a hash.', 'Read the candidate algorithms, ordered by likelihood.', 'Note the length — it is the single most informative feature.'],
    notes: [
      { h: 'Length narrows it fast', p: '32 hex characters suggests MD5, 40 suggests SHA-1, 64 suggests SHA-256. Those lengths are shared by other algorithms too, so treat the answer as a shortlist.' },
      { h: 'Prefixes are decisive when present', p: 'Strings starting $2a$ or $2b$ are bcrypt, $6$ is SHA-512-crypt, $argon2id$ is Argon2. A prefix beats any length guess.' },
      { h: 'Identification is not cracking', p: 'Knowing a hash is bcrypt tells you it will be slow and expensive to attack — which is exactly why bcrypt is chosen.' },
    ],
    faq: [
      { q: 'Why can one hash match several algorithms?', a: 'Because different algorithms can produce the same output length. MD5 and NTLM are both 32 hex characters, so context — where you found it, what system produced it — decides between them.' },
      { q: 'Can this tool crack the hash?', a: 'No, it only identifies the likely format. Try the Password Cracking Lab to see what actually happens when a dictionary attack meets a real hash.' },
      { q: 'What does the $ prefix mean?', a: 'It is Modular Crypt Format, which stores the algorithm, cost parameters and salt alongside the digest. It is a good sign — it means the system is using a proper password hash rather than a bare digest.' },
    ],
    related: ['hash', 'passwordcrack-lab', 'entropy', 'password'],
  },
  headers: {
    intent: 'check http security headers meaning',
    intro: 'HTTP response headers are where a site tells the browser how to defend it. Missing ones are among the most common findings in any web assessment, partly because they are easy to overlook and partly because nothing breaks when they are absent — until something does.',
    steps: ['Paste raw HTTP response headers.', 'Press Analyze headers.', 'Read which protective headers are present, which are missing, and why each one matters.'],
    notes: [
      { h: 'Content-Security-Policy is the heavyweight', p: 'A good CSP turns many XSS bugs from exploitable into harmless by controlling what the browser is allowed to load and run. It is also the hardest to deploy without breaking a site.' },
      { h: 'Strict-Transport-Security closes the first-request gap', p: 'Without HSTS, a user who types the domain without https:// makes one plaintext request that an attacker on the network can hijack.' },
      { h: 'X-Frame-Options and frame-ancestors stop clickjacking', p: 'Without one of them, your page can be framed invisibly under someone else\'s. The Clickjacking Simulator shows exactly what that looks like.' },
    ],
    faq: [
      { q: 'Which security headers actually matter most?', a: 'Content-Security-Policy, Strict-Transport-Security, and a framing control (X-Frame-Options or CSP frame-ancestors). X-XSS-Protection is obsolete and should be omitted rather than set.' },
      { q: 'Are missing security headers a real vulnerability?', a: 'On their own they are usually a low-severity finding, because they are defence in depth rather than a flaw. They matter because they decide whether a separate bug is exploitable or contained.' },
      { q: 'How do I see the headers for a site?', a: 'Open your browser devtools, go to the Network tab, reload, and click the first document request — or use curl -I on the command line.' },
    ],
    related: ['clickjacking-lab', 'httpbuilder', 'csrf-lab', 'codereview'],
  },
  vulnreport: {
    intent: 'how to write a vulnerability report template',
    intro: 'Finding a bug is the easy half. What gets it fixed — or paid — is a report that a stranger can reproduce without asking you a single question. This page gives you the structure that bug bounty triagers and internal security teams expect, and exports it as Markdown or PDF.',
    steps: ['Fill in the title, severity, and affected component or URL.', 'Write numbered steps to reproduce, then impact, then remediation.', 'Download as Markdown or print to PDF.'],
    notes: [
      { h: 'Steps to reproduce carry the whole report', p: 'Write them so someone with no context can follow along exactly. Include the account used, the exact request, and what you saw versus what you expected.' },
      { h: 'Impact means business consequence', p: '"Reflected XSS" is a finding. "Any user who clicks a crafted link has their session token sent to an attacker-controlled server" is an impact. The second is what gets prioritised.' },
      { h: 'Suggest a fix, but stay in your lane', p: 'Naming the correct control — parameterised queries, output encoding, an authorisation check — is helpful. Prescribing their architecture is not.' },
    ],
    faq: [
      { q: 'What should a vulnerability report contain?', a: 'A clear title, severity with a CVSS vector, the affected component, reproduction steps, demonstrated impact, and remediation guidance. Anything a triager has to ask you for is a delay.' },
      { q: 'How much detail is too much?', a: 'Screenshots and raw requests are welcome; speculation is not. Report what you observed and what it enables, not what you imagine might be possible elsewhere.' },
      { q: 'Do I need a CVSS score in the report?', a: 'Most programmes want one, and including the vector string rather than just the number lets the triager check your reasoning instead of arguing with your total.' },
    ],
    related: ['cvss', 'riskregister', 'slacalc', 'stride'],
  },
  resumehelper: {
    intent: 'match my resume to a cybersecurity job description',
    intro: 'Most security applications are filtered before a human sees them, on keyword overlap with the job description. That is not a reason to stuff your CV with terms you cannot defend — it is a reason to notice which real skills you already have and failed to name.',
    steps: ['Paste a job description.', 'Press Analyze.', 'Review the extracted terms and check which of them your CV genuinely evidences.'],
    notes: [
      { h: 'Only claim what you can be questioned on', p: 'Every keyword you add is a question you have invited in the interview. If you cannot talk for two minutes about it, leave it off.' },
      { h: 'Mirror their vocabulary', p: 'If the posting says "SIEM" and your CV says "log analysis platform", you are describing the same experience in a word the filter will not match. Use theirs.' },
      { h: 'Gaps are a study plan', p: 'Terms you do not recognise are the most useful output here. Look them up, and if they keep appearing across postings, that is your next path.' },
    ],
    faq: [
      { q: 'Does keyword matching really decide applications?', a: 'It decides the first pass at many larger employers. It does not decide the interview — a CV that clears the filter and then cannot be defended fails later and more expensively.' },
      { q: 'What if I have no professional experience yet?', a: 'Labs, CTFs, home lab builds and write-ups all count as evidence. What matters is that you can describe what you did and what you learned, not who paid you for it.' },
      { q: 'Is my job description sent anywhere?', a: 'No. The analysis runs entirely in your browser.' },
    ],
    related: ['portfoliogen', 'vulnreport', 'stride', 'controlmapper'],
  },
  portfoliogen: {
    intent: 'cybersecurity portfolio project ideas for beginners',
    intro: 'The gap between "I did an online course" and "I can do this job" is closed by projects you can show and talk about. This page generates a project brief with scope and deliverables, so you have something concrete to build rather than another tutorial to watch.',
    steps: ['Generate a project brief.', 'Read the scope and deliverables.', 'Download the brief as Markdown and use it as your README.'],
    notes: [
      { h: 'Write it up, or it did not happen', p: 'The write-up is the portfolio piece. What you tried, what failed, what you concluded — that is what shows judgement, and judgement is what gets hired.' },
      { h: 'Small and finished beats ambitious and abandoned', p: 'One tidy completed project you can explain in detail is worth more in an interview than three half-built repositories.' },
      { h: 'Stay legal', p: 'Build against your own lab, deliberately vulnerable applications, or systems you have written permission to test. Never a live third party.' },
    ],
    faq: [
      { q: 'What makes a good security portfolio project?', a: 'One that shows a decision, not just a tool run. A home lab with a documented detection you wrote and tested beats a screenshot of a scanner\'s output every time.' },
      { q: 'Do I need a GitHub account?', a: 'It helps, because it gives you somewhere to link from your CV, and public commit history is evidence in itself. A well-written blog post works too.' },
      { q: 'How long should a project take?', a: 'A weekend to two weeks is the useful range. Long enough to hit real problems, short enough that you actually finish and write it up.' },
    ],
    related: ['resumehelper', 'vulnreport', 'yaratester', 'stride'],
  },
  codereview: {
    intent: 'find security bugs in code snippet',
    intro: 'Secure code review is pattern recognition before it is anything else. Certain shapes — string-built queries, unvalidated redirects, hardcoded secrets — are worth a second look every time. This page flags a set of them in whatever you paste, so you can practise spotting the shapes.',
    steps: ['Paste a code snippet in any language.', 'Press Scan.', 'Read each flagged pattern and why it is risky.'],
    notes: [
      { h: 'Follow the untrusted input', p: 'Real review is a data-flow question: where does user input enter, and what does it reach? A dangerous function fed only by constants is not a bug.' },
      { h: 'Pattern matching finds shapes, not bugs', p: 'This is a teaching toy, not a static analyser. It will miss real flaws and flag safe code — which is also true of expensive commercial scanners, just less obviously.' },
      { h: 'Hardcoded secrets are the highest-value find', p: 'They are common, unambiguous, and immediately exploitable. The Leaked Secret Hunt lab is built entirely around this one class.' },
    ],
    faq: [
      { q: 'Can this replace a real SAST tool?', a: 'No. It has no parser, no data-flow analysis and no rule set worth the name. It exists to train your eye for the patterns that deserve attention.' },
      { q: 'What should I look for first in unfamiliar code?', a: 'Where input arrives, where queries are built, where files and URLs are opened, where authorisation is checked — and whether that last one happens at all.' },
      { q: 'Is my code sent anywhere?', a: 'No. The scan runs in your browser and nothing is uploaded.' },
    ],
    related: ['sbomcheck', 'clouddockersecrets-lab', 'regex', 'stride'],
  },
  attckmap: {
    intent: 'mitre attack technique lookup by name',
    intro: 'MITRE ATT&CK is the shared map of how intrusions actually unfold — tactics describing what an attacker is trying to achieve, and techniques describing how. It is the vocabulary detection engineers, threat hunters and red teams use to talk to each other precisely.',
    steps: ['Search by technique name, tactic, or ATT&CK ID.', 'Read the matching entries and the tactic each belongs to.'],
    notes: [
      { h: 'Tactic is the why, technique is the how', p: 'Credential Access is a tactic. Kerberoasting is a technique serving it. Reports that name only the technique leave out the intent.' },
      { h: 'IDs are the stable reference', p: 'Names get revised; T-numbers do not. Cite the ID in detections and reports so they survive renaming.' },
      { h: 'Coverage maps expose blind spots', p: 'Plotting your detections onto the matrix shows which tactics you cannot see at all — usually a more useful exercise than counting how many rules you have.' },
    ],
    faq: [
      { q: 'What is the difference between ATT&CK and the Cyber Kill Chain?', a: 'The Kill Chain is a short linear model of an intrusion. ATT&CK is a far more granular catalogue of observed behaviours, and it does not assume attackers move in a straight line — because they do not.' },
      { q: 'How is ATT&CK actually used day to day?', a: 'To tag detections, to structure red team plans and reports, to compare tooling coverage, and to communicate threat intel in terms everyone reads the same way.' },
      { q: 'Do I need to memorise technique IDs?', a: 'No. You will absorb the ones in your area naturally. Understanding the tactic structure is what matters.' },
    ],
    related: ['yaratester', 'loganalysis-lab', 'stride', 'controlmapper'],
  },
  stride: {
    intent: 'stride threat model worksheet example',
    intro: 'STRIDE is a checklist for asking "what could go wrong here" in a structured way: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege. Six prompts, applied to one component at a time, catch a surprising share of design flaws before any code exists.',
    steps: ['Name the system or feature being modelled.', 'Work through each STRIDE category for that component.', 'Download the completed worksheet as Markdown.'],
    notes: [
      { h: 'Model one component at a time', p: '"Our whole platform" produces nothing useful. "The password reset endpoint" produces real findings in twenty minutes.' },
      { h: 'Each letter maps to a control', p: 'Spoofing to authentication, Tampering to integrity, Repudiation to logging, Information disclosure to confidentiality, DoS to availability, Elevation to authorisation. That mapping turns a threat into a task.' },
      { h: 'Design-time bugs are the expensive ones', p: 'A missing authorisation check in a design costs a conversation. The same gap found in production costs an incident.' },
    ],
    faq: [
      { q: 'When should threat modelling happen?', a: 'While the design is still changeable — before or during implementation. Modelling after release still finds things, but the findings are much more expensive to act on.' },
      { q: 'Do I need a data flow diagram first?', a: 'A rough sketch of components, trust boundaries and data flows makes STRIDE far more productive. It does not need to be formal; a whiteboard photo works.' },
      { q: 'How does STRIDE compare to PASTA or attack trees?', a: 'STRIDE is the fastest to teach and the easiest to run in a normal team meeting. The others go deeper and cost more time; STRIDE is where nearly everyone should start.' },
    ],
    related: ['attckmap', 'riskregister', 'codereview', 'vulnreport'],
  },
  cidroverlap: {
    intent: 'do these two cidr ranges overlap',
    intro: 'Overlapping CIDR ranges cause outages and, worse, silent security failures — a firewall rule that unintentionally covers more than intended, or a VPC peering that cannot be established. Checking overlap by eye is error-prone in a way that checking it arithmetically is not.',
    steps: ['Enter CIDR A.', 'Enter CIDR B.', 'Read whether they overlap, and how.'],
    notes: [
      { h: 'Containment is a kind of overlap', p: '10.0.0.0/8 fully contains 10.1.2.0/24. Any rule written against the larger block silently applies to the smaller one.' },
      { h: 'Cloud networks fail loudly on this', p: 'VPC peering and VPN tunnels refuse overlapping address space outright, which is the most common reason a peering request is rejected.' },
      { h: 'Allow rules are where it bites', p: 'A deny rule that overlaps too much causes an outage you notice immediately. An allow rule that overlaps too much causes exposure you do not notice at all.' },
    ],
    faq: [
      { q: 'Why does overlapping address space break VPN and peering?', a: 'Routing needs one unambiguous destination for a prefix. When both sides claim the same range, there is no correct answer, so the connection is refused rather than silently misrouted.' },
      { q: 'How should I plan ranges to avoid this?', a: 'Allocate non-overlapping blocks per environment and region from the start, and keep the allocation written down somewhere authoritative. Retrofitting a renumbering is painful.' },
      { q: 'Is a /32 a valid CIDR?', a: 'Yes — it is a single host, and it is extremely common in firewall rules where you want to permit exactly one address.' },
    ],
    related: ['subnet', 'vlsm', 'headers', 'ssrf-lab'],
  },
  useragent: {
    intent: 'what does this user agent string mean',
    intro: 'User-Agent strings are a small archaeology exhibit — nearly every browser claims to be several others for compatibility reasons dating back decades. Reading them matters in log analysis, where the User-Agent is often the first thing that marks a request as automated.',
    steps: ['Paste a User-Agent string.', 'Read the parsed browser, engine and platform.'],
    notes: [
      { h: 'Almost every string starts with Mozilla/5.0', p: 'A historical compatibility hack that stuck. It tells you nothing; ignore it and read what follows.' },
      { h: 'It is self-reported and trivially forged', p: 'Anyone can send any User-Agent. Treat it as a hint during triage, never as an access control or an identity.' },
      { h: 'Default tool strings are gifts', p: 'python-requests, curl, sqlmap and similar defaults appear constantly in logs from unsophisticated automation. Attackers who change them are telling you something too.' },
    ],
    faq: [
      { q: 'Can I block attacks by User-Agent?', a: 'Only the laziest ones, and only until they change one line. It is useful for filtering noise in logs, not for defence.' },
      { q: 'Why does Chrome claim to be Safari and Mozilla?', a: 'Layers of compatibility sniffing over thirty years. Sites checked for competitors\' strings to serve better pages, so every browser added them, and now none can safely remove them.' },
      { q: 'What is User-Agent Client Hints?', a: 'A newer, structured replacement that sends less by default and more on request, intended to reduce fingerprinting. The old header is being frozen rather than removed.' },
    ],
    related: ['logparser', 'loganalysis-lab', 'httpbuilder', 'emailheaders'],
  },
  entropy: {
    intent: 'shannon entropy calculator for strings',
    intro: 'Entropy measures unpredictability, in bits. It is how you tell a random session token from a sequential ID, how packers and encryption announce themselves inside a binary, and how secret scanners decide that a long string in a repository is worth flagging.',
    steps: ['Paste text or hex.', 'Read the length and Shannon entropy.', 'Compare a real random token against a word or a predictable pattern.'],
    notes: [
      { h: 'Rough bands to carry in your head', p: 'English text sits near 4 bits per character. Base64 of random data approaches 6. Compressed or encrypted bytes approach 8 bits per byte, which is what makes high entropy suspicious inside an otherwise normal file.' },
      { h: 'High entropy is a hint, not a verdict', p: 'Secret scanners flag high-entropy strings and produce plenty of false positives on hashes, UUIDs and minified code. It narrows the search; it does not decide.' },
      { h: 'Low entropy in a token is a finding', p: 'A session identifier that is short, sequential or timestamp-derived can be guessed. Entropy is how you demonstrate that in a report.' },
    ],
    faq: [
      { q: 'What is a good entropy for a session token?', a: 'At least 128 bits of real randomness from a cryptographically secure generator. Note that this measures the generator, not the string — a long token from a predictable source is still weak.' },
      { q: 'Why do malware analysts check entropy?', a: 'Packed and encrypted sections have near-maximum entropy while normal code does not, so an entropy graph across a binary shows immediately where the interesting parts are.' },
      { q: 'Does high entropy mean a string is encrypted?', a: 'No. Compressed data, random identifiers and encoded binaries all score high. It means "not ordinary text", which is a much weaker claim.' },
    ],
    related: ['hashid', 'clouddockersecrets-lab', 'malwarestrings-lab', 'password'],
  },
  httpbuilder: {
    intent: 'what a raw http request looks like',
    intro: 'Every web attack is, underneath, a request you constructed by hand. Seeing the raw text — method, path, headers, blank line, body — removes the mystery from tools like Burp and curl, because they are all just editing this.',
    steps: ['Pick a method: GET, POST, PUT, DELETE or PATCH.', 'Set the path and host, then add headers one per line as Key: Value.', 'Add a body if needed and read the assembled raw request.'],
    notes: [
      { h: 'The blank line is structural', p: 'Exactly one empty line separates headers from body. Get it wrong and the server reads your body as headers — which is the basis of request smuggling.' },
      { h: 'Content-Type changes how the body is parsed', p: 'The same bytes are read differently as JSON, form-encoded or multipart. Flipping it is a standard trick for reaching a different parser.' },
      { h: 'The browser is not the boundary', p: 'Client-side validation only shapes what the browser sends. Anything you can construct here, an attacker can send directly — which is why server-side validation is the only kind that counts.' },
    ],
    faq: [
      { q: 'What is the difference between GET and POST, really?', a: 'Convention and placement. GET carries parameters in the URL and should not change state; POST carries them in a body. Nothing enforces this — a GET that deletes something is a bug, not an impossibility.' },
      { q: 'Does this tool send the request?', a: 'No. It assembles and displays the raw text so you can see the structure. Sending it is a job for curl or an intercepting proxy against a target you are allowed to test.' },
      { q: 'Why does HTTP use \\r\\n line endings?', a: 'The specification inherits them from earlier internet text protocols. It matters because parsers disagree about lone \\n, and that disagreement is exactly what smuggling attacks exploit.' },
    ],
    related: ['headers', 'csrf-lab', 'ssrf-lab', 'useragent'],
  },
  logparser: {
    intent: 'filter log lines with regex practice',
    intro: 'Incident response is mostly reading logs faster than the attacker moved. This page gives you a pile of lines and a regex filter, which is the same loop as grep — narrow, read, narrow again — without needing a shell.',
    steps: ['Paste log lines, one per line.', 'Enter a case-insensitive regex filter.', 'Refine until only the interesting lines remain.'],
    notes: [
      { h: 'Subtract noise before adding signal', p: 'Filtering out what you know is routine usually reveals more, faster, than guessing what the attack looks like.' },
      { h: 'Time is the backbone of every investigation', p: 'Once you find one suspicious event, pivot to everything around that timestamp. The story lives in the neighbours.' },
      { h: 'Absence is evidence', p: 'A gap where logs should be, or a service that stopped logging mid-incident, is itself a finding — and often a deliberate one.' },
    ],
    faq: [
      { q: 'What should I grep for first in auth logs?', a: '"Failed password" and "Accepted password" together — a burst of failures followed by an acceptance is a successful brute force, and that pattern is the fastest way to spot one.' },
      { q: 'How is this different from grep?', a: 'It is the same idea in a browser, so you can practise the reasoning before you have a box to run commands on. Real work happens in grep, awk or a SIEM.' },
      { q: 'Where do I practise on a realistic dataset?', a: 'The Log Analysis / IR Lab gives you a messy auth.log from a compromised machine and asks you to reconstruct what happened.' },
    ],
    related: ['loganalysis-lab', 'regex', 'useragent', 'emailheaders'],
  },
  riskregister: {
    intent: 'build a risk register likelihood impact',
    intro: 'A risk register is how security work gets funded. It records what could go wrong, how likely and how damaging that is, and — the part people skip — what you have decided to do about it and who owns that decision.',
    steps: ['Describe the risk.', 'Score likelihood and impact from 1 to 5.', 'Choose a treatment: Mitigate, Accept, Transfer or Avoid.', 'Add to the register and export as Markdown.'],
    notes: [
      { h: 'Score is likelihood times impact', p: 'A 5×5 grid gives 1 to 25. The number is only there to sort the list — do not defend it to two decimal places.' },
      { h: 'Accept is a real answer', p: 'Not every risk should be fixed. Accepting one explicitly, with a named owner and a review date, is a legitimate and auditable decision. Ignoring one is not.' },
      { h: 'Transfer does not move the consequences', p: 'Insurance and outsourcing move financial exposure. Your customers and your regulator still hold you responsible for the breach.' },
    ],
    faq: [
      { q: 'What are the four risk treatment options?', a: 'Mitigate (reduce it), Accept (live with it knowingly), Transfer (share the financial impact), and Avoid (stop doing the risky thing). Every risk gets exactly one, chosen deliberately.' },
      { q: 'How often should a register be reviewed?', a: 'Quarterly for most organisations, and immediately after any significant change or incident. A register nobody revisits is documentation, not management.' },
      { q: 'What is residual risk?', a: 'What remains after your controls are in place. It is the number that should be accepted or escalated — the pre-control score is only useful for showing the controls are worth their cost.' },
    ],
    related: ['slacalc', 'controlmapper', 'cvss', 'vendortiering-lab'],
  },
  sbomcheck: {
    intent: 'check dependencies for known vulnerabilities',
    intro: 'Most of the code in a modern application was written by strangers and pulled in automatically. A software bill of materials is the inventory of those strangers, and it is the difference between answering "are we affected?" in minutes or in weeks.',
    steps: ['Paste dependencies one per line as name@version.', 'Review the risk notes returned for each.'],
    notes: [
      { h: 'Transitive dependencies are where the risk hides', p: 'You install twenty packages and get eight hundred. The vulnerable one is almost never a package you chose deliberately.' },
      { h: 'Pin versions, then update them deliberately', p: 'Unpinned ranges mean your build is not reproducible and a compromised release can arrive without any change on your side.' },
      { h: 'Reachability changes severity', p: 'A critical CVE in a code path your application never calls is real but not urgent. Deciding that honestly is what stops alert fatigue.' },
    ],
    faq: [
      { q: 'What is an SBOM?', a: 'A machine-readable list of every component in your software, with versions and often licences. SPDX and CycloneDX are the two common formats, and both are increasingly required by procurement.' },
      { q: 'Why did Log4Shell matter so much?', a: 'Because a critical flaw sat in a library embedded so deeply and so widely that most organisations genuinely could not tell whether they used it. That inability to answer was the crisis, more than the bug.' },
      { q: 'Is this a real vulnerability scanner?', a: 'No — it is a teaching aid using a small illustrative dataset. Real work uses live advisory feeds through tools like Dependabot, Trivy, Grype or Snyk.' },
    ],
    related: ['codereview', 'cvss', 'clouddockersecrets-lab', 'riskregister'],
  },
  emailheaders: {
    intent: 'analyze email headers to check if spoofed',
    intro: 'The From address in an email is decoration — it is typed by whoever sent the message. What actually establishes origin is the header chain: the Received lines recording each hop, and the SPF, DKIM and DMARC results recording whether the sending domain authorised it.',
    steps: ['Paste raw email headers.', 'Read the parsed hops and authentication results.', 'Compare the visible From against the envelope sender and the authenticated domain.'],
    notes: [
      { h: 'Read Received headers bottom-up', p: 'The oldest hop is at the bottom. Everything above it was added later — and anything below the first server you trust could have been forged by the sender.' },
      { h: 'SPF, DKIM and DMARC answer different questions', p: 'SPF asks whether that server was allowed to send for the domain. DKIM asks whether the message was signed and unaltered. DMARC ties either result to the From address the human actually sees, which is the only one that matters for phishing.' },
      { h: 'Display name spoofing beats all three', p: 'A message from a genuine Gmail account with the display name "IT Helpdesk" passes every check, because nothing about it is technically forged. This is why most real phishing does not bother with spoofing at all.' },
    ],
    faq: [
      { q: 'How can I tell if an email was spoofed?', a: 'Check whether DMARC passed and whether it aligned with the visible From domain. SPF or DKIM passing for some other domain is exactly what a spoofed message looks like.' },
      { q: 'Where do I find the raw headers?', a: 'In Gmail, "Show original". In Outlook, "View message source" or message properties. Most clients hide it deliberately, because it is noise to almost everyone.' },
      { q: 'Does a passing SPF mean the email is safe?', a: 'No. It means the sending server was authorised by some domain. Attackers register their own domains and pass SPF perfectly — authentication proves origin, never intent.' },
    ],
    related: ['phishing-lab', 'useragent', 'logparser', 'headers'],
  },
  passpolicy: {
    intent: 'test whether a password meets policy rules',
    intro: 'Password policies are where good intentions become weak passwords. Complexity requirements push everyone toward the same predictable shapes, and forced rotation makes people iterate a number on the end. This page lets you test a candidate against a policy and see what the policy is really buying you.',
    steps: ['Enter a password to check.', 'Set the minimum length and toggle the uppercase, digit and symbol requirements.', 'See which rules pass and which fail.'],
    notes: [
      { h: 'Modern guidance moved away from complexity', p: 'NIST SP 800-63B now recommends longer minimums, screening against known-breached passwords, and dropping composition rules and scheduled expiry — because both demonstrably make passwords worse.' },
      { h: 'Blocklists beat rules', p: 'Checking a candidate against known-breached passwords stops far more account takeovers than any arrangement of character-class requirements.' },
      { h: 'Rotation without cause is counterproductive', p: 'Forcing 90-day changes produces Summer2024! then Autumn2024!. Rotate on evidence of compromise instead.' },
    ],
    faq: [
      { q: 'What does NIST actually recommend now?', a: 'A minimum of 8 characters and support for at least 64, screening against breach corpora, no composition rules, and no periodic expiry unless there is evidence of compromise.' },
      { q: 'Should I require a symbol?', a: 'It buys very little. Users satisfy it with a trailing ! that every cracking ruleset tries first. Length plus a breach blocklist is a far better use of the same friction.' },
      { q: 'Is my password sent anywhere?', a: 'No. The check runs entirely in your browser. Even so, test with a variation rather than a password you actually use.' },
    ],
    related: ['password', 'passwordcrack-lab', 'entropy', 'controlmapper'],
  },
  vlsm: {
    intent: 'vlsm subnet planner variable length',
    intro: 'Variable Length Subnet Masking is what you use when your networks are different sizes — which they always are. Rather than carving a block into equal pieces and wasting most of them, you allocate each subnet only as much space as it needs, largest first.',
    steps: ['Enter the base network in CIDR notation.', 'List the required host counts, one per line, largest first.', 'Press Plan subnets and read the allocation.'],
    notes: [
      { h: 'Largest first is not a style preference', p: 'Allocating big blocks first keeps the remaining space contiguous. Start small and you fragment the range so badly that a later large subnet will not fit at all.' },
      { h: 'Add two to every host count', p: 'The network and broadcast addresses are not usable. A subnet for 30 hosts needs 32 addresses, which is a /27.' },
      { h: 'Leave room to grow', p: 'Sizing exactly to today\'s count guarantees a renumbering project later. Round up a step where the address space allows.' },
    ],
    faq: [
      { q: 'What does VLSM mean in practice?', a: 'Using different prefix lengths within one address block, so a 500-host site and a 2-host point-to-point link do not both consume a /24.' },
      { q: 'How do I pick the prefix for a given host count?', a: 'Find the smallest power of two that is at least hosts plus two. 30 hosts needs 32 addresses, so /27; 100 hosts needs 128, so /25.' },
      { q: 'Why do point-to-point links use /30 or /31?', a: 'A /30 gives exactly two usable addresses, which is all a link between two routers needs. A /31 gives two with no broadcast address at all, which modern equipment supports and which halves the waste.' },
    ],
    related: ['subnet', 'cidroverlap', 'httpbuilder', 'headers'],
  },
  yaratester: {
    intent: 'write and test a yara rule online',
    intro: 'YARA is how malware analysts describe what a family looks like so that a machine can find it again. A rule is a set of strings plus a condition, and writing good ones is a balance: too specific and a recompile evades you, too loose and you drown in false positives.',
    steps: ['Enter rule strings, one per line — all must match, using simplified "and" logic.', 'Paste sample content to test against.', 'Adjust until the rule matches what you want and nothing else.'],
    notes: [
      { h: 'Pick strings the author cannot casually change', p: 'A hardcoded mutex name, an unusual error string or a distinctive constant survives recompilation. The output filename does not.' },
      { h: 'Always test against clean files', p: 'A rule that matches every sample is worthless if it also matches Notepad. False positives are what get a rule disabled in production.' },
      { h: 'Real YARA is richer than this', p: 'Full YARA supports hex patterns with wildcards, regular expressions, file offsets, module imports and complex boolean conditions. This page teaches the core idea.' },
    ],
    faq: [
      { q: 'What is YARA used for?', a: 'Classifying and identifying malware by pattern — in incident response, threat hunting, sandbox pipelines and endpoint tooling. It answers "have we seen this family before, anywhere?"' },
      { q: 'What makes a rule good?', a: 'It matches the whole family including future variants, matches nothing benign, and carries metadata saying who wrote it and why. The third part is what makes it maintainable.' },
      { q: 'Where do I practise on real samples?', a: 'The YARA Rule Builder Challenge gives you three malware samples and one clean file, and asks for a rule that separates them.' },
    ],
    related: ['yarabuilder-lab', 'malwarestrings-lab', 'regex', 'attckmap'],
  },
  slacalc: {
    intent: 'incident priority matrix impact urgency sla',
    intro: 'When an incident starts, the first argument is always about how bad it is. A priority matrix settles that in advance: impact times urgency gives a priority, and priority maps to a response time everyone already agreed to when nobody was panicking.',
    steps: ['Choose an Impact level — data exposure or outage, degraded service, or cosmetic.', 'Choose an Urgency level — actively exploited, exploitable but not observed, or theoretical.', 'Read the resulting priority score and SLA tier.'],
    notes: [
      { h: 'Impact and urgency are genuinely different', p: 'A critical flaw nobody is exploiting is high impact, low urgency. A noisy scanner hitting a trivial bug is the reverse. Collapsing them into one "severity" number is what causes triage arguments.' },
      { h: 'The clock behaviour is part of the tier', p: 'P1 and P2 usually run 24×7 with the clock never stopping. P3 and P4 typically pause overnight and at weekends. Agreeing this beforehand prevents a very unpleasant conversation later.' },
      { h: 'Priority is allowed to change', p: 'New information should re-triage an incident in either direction. What must not happen is a silent change with no record of who decided it.' },
    ],
    faq: [
      { q: 'What does P1 mean?', a: 'The highest priority tier: critical impact needing immediate response, typically with 24×7 engagement and executive notification. Exact definitions vary by organisation, which is why they must be written down.' },
      { q: 'How is this different from a CVSS score?', a: 'CVSS scores the vulnerability in the abstract. This scores the incident in your environment right now, including whether anyone is actually exploiting it. A 9.8 on a decommissioned box is not a P1.' },
      { q: 'Who should set the priority?', a: 'The incident commander, using an agreed matrix rather than instinct. The matrix exists so that the decision is defensible afterwards.' },
    ],
    related: ['irtabletop-lab', 'cvss', 'riskregister', 'vulnreport'],
  },
  controlmapper: {
    intent: 'map security controls across soc 2 iso 27001 nist',
    intro: 'Compliance frameworks overlap far more than they differ. Access review, encryption at rest and logging appear in all of them under different names and numbers. Seeing the mapping is what stops an organisation running three separate audit programmes for one set of controls.',
    steps: ['Pick a control area.', 'Read how each framework expresses that control.'],
    notes: [
      { h: 'Implement once, evidence many times', p: 'One well-run access review can satisfy SOC 2, ISO 27001 and several others simultaneously — provided the evidence is captured in a form each auditor accepts.' },
      { h: 'Compliant is not secure', p: 'Frameworks set a floor, and they are deliberately technology-neutral. Passing an audit means you met the floor, not that you would survive a determined attacker.' },
      { h: 'Auditors ask for evidence, not intentions', p: 'A written policy nobody follows fails. Tickets, logs, signed approvals and dated screenshots are what actually pass.' },
    ],
    faq: [
      { q: 'What is the difference between SOC 2 and ISO 27001?', a: 'SOC 2 is a US attestation report on controls against the Trust Services Criteria, produced by an auditor for your customers. ISO 27001 is an international certification of a management system. Customers ask for whichever their market expects.' },
      { q: 'Which framework should a small company start with?', a: 'Usually whichever your customers are asking for — that is the one blocking deals. If nobody is asking yet, the CIS Controls give the most security per unit of effort.' },
      { q: 'Can one control satisfy several frameworks?', a: 'Yes, and that is the entire point of mapping. The work is in collecting evidence in a form that every auditor accepts.' },
    ],
    related: ['riskregister', 'vendortiering-lab', 'stride', 'slacalc'],
  },
  dhvisualizer: {
    intent: 'diffie hellman key exchange explained step by step',
    intro: 'Diffie–Hellman answers a question that sounds impossible: how do two people agree on a shared secret while everyone is listening? Step through it with small numbers and the trick becomes clear — both sides do the same operations in a different order and land on the same value, while an eavesdropper who saw everything sent cannot.',
    steps: ['Set the shared prime p and generator g — these are public.', 'Choose Alice\'s private secret a and Bob\'s private secret b.', 'Follow what each sends, then what each computes, and confirm both arrive at the same shared secret.'],
    notes: [
      { h: 'Only the private secrets stay hidden', p: 'p, g, and both transmitted values are public. Security rests on the discrete logarithm problem: recovering a from g^a mod p is infeasible at real key sizes.' },
      { h: 'Real parameters are enormous', p: 'The numbers here are small so the arithmetic is visible. Production uses 2048-bit or larger groups, or elliptic curves, where the same idea holds with far shorter keys.' },
      { h: 'It has no authentication of its own', p: 'Plain Diffie–Hellman is wide open to a machine in the middle running two exchanges at once. That is why TLS pairs it with certificates — the exchange gives secrecy, the certificate gives identity.' },
    ],
    faq: [
      { q: 'Why can an eavesdropper not compute the shared secret?', a: 'They see g, p, g^a mod p and g^b mod p, but computing g^ab mod p from those requires solving the discrete logarithm, which has no known efficient classical algorithm at real key sizes.' },
      { q: 'What is forward secrecy?', a: 'Using a fresh ephemeral Diffie–Hellman exchange per session, so that compromising the server\'s long-term key later does not decrypt traffic captured earlier. It is why modern TLS prefers ECDHE.' },
      { q: 'Does quantum computing break this?', a: 'Shor\'s algorithm would break both Diffie–Hellman and RSA on a sufficiently large quantum computer, which is why post-quantum key exchange is being standardised and deployed now.' },
    ],
    related: ['cipher', 'entropy', 'timingviz', 'hash'],
  },
  base32: {
    intent: 'base32 and base85 encoder decoder',
    intro: 'Base32 and Base85 are the less famous relatives of Base64, and each exists for a reason. Base32 uses a case-insensitive alphabet with no easily confused characters, which is why TOTP secrets and onion addresses use it. Base85 packs more data into fewer characters, which is why PDF and Git internals do.',
    steps: ['Choose a format and a direction — encode or decode.', 'Paste your input.', 'Read the converted output.'],
    notes: [
      { h: 'Base32 is built to be typed and spoken', p: 'It omits 0, 1 and 8 to avoid confusion with O, I and B, and ignores case. That is why an authenticator app setup key is Base32 and not Base64.' },
      { h: 'Base85 is roughly 25% denser than Base64', p: 'It encodes four bytes as five characters instead of three as four. The cost is an alphabet full of punctuation that needs escaping in many contexts.' },
      { h: 'Recognise before you decode', p: 'All-uppercase letters and digits 2–7 with = padding is Base32. Mixed case with + and / is Base64. Heavy punctuation is likely Base85.' },
    ],
    faq: [
      { q: 'Why do TOTP secrets use Base32?', a: 'Because people type and read them aloud during setup. Case-insensitivity and the removal of confusable characters make that far less error-prone than Base64 would be.' },
      { q: 'Which is better, Base32 or Base64?', a: 'Neither — they trade differently. Base32 is longer but robust to human handling; Base64 is more compact and universally supported. Pick by whether a human touches the string.' },
      { q: 'Is any of this encryption?', a: 'No. All of these are reversible by anyone with no key at all. They change representation, never confidentiality.' },
    ],
    related: ['encoder', 'hashid', 'entropy', 'cipher'],
  },
  timingviz: {
    intent: 'timing attack constant time comparison explained',
    intro: 'A timing attack extracts secrets from how long a computation takes rather than what it returns. The classic case is string comparison that stops at the first wrong character — it leaks, one character at a time, how much of your guess was right. This page shows that leak happening.',
    steps: ['Watch the secret being guessed against your guess.', 'Compare the naive comparison against the constant-time comparison.', 'Observe how the matched prefix grows under the naive version and does not under the other.'],
    notes: [
      { h: 'Early exit is the whole bug', p: 'A comparison that returns as soon as it finds a mismatch takes longer for a more correct guess. That turns an exponential search into a linear one — character by character rather than all at once.' },
      { h: 'Constant-time means always the same work', p: 'A safe comparison examines every byte regardless, accumulating differences and checking once at the end. Use your language\'s provided function — hmac.compare_digest, crypto.timingSafeEqual — rather than writing one.' },
      { h: 'Network noise raises the cost, not the impossibility', p: 'Real timing attacks average many requests to pull the signal out of jitter. Remote timing attacks against real services have been demonstrated repeatedly; "it is over the network" is not a defence.' },
    ],
    faq: [
      { q: 'What is a side-channel attack?', a: 'One that reads something other than the intended output — time taken, power drawn, cache state, sound. The algorithm can be perfect and still leak through how it runs.' },
      { q: 'Where does this matter in practice?', a: 'Anywhere a secret is compared: API keys, HMAC signatures, password reset tokens, session identifiers. Signature verification is the most commonly affected.' },
      { q: 'How do I fix it in my own code?', a: 'Never compare secrets with == or a loop that breaks early. Use the constant-time comparison your standard library already provides.' },
    ],
    related: ['dhvisualizer', 'webhookforge-lab', 'racecondition-lab', 'entropy'],
  },
};

/*
 * Lab pages. Same problem, same fix — 42 pages that shared a 989-word link
 * list and differed by about 52 words each.
 *
 * Labs are the better ranking bet of the two sections. "sql injection
 * practice online free" and "learn xss safely" are learner-intent queries
 * where an interactive in-browser lab attached to a free course is a
 * genuinely better answer than a blog post, which is not something this
 * site can claim against jwt.io on "jwt decoder".
 */
export const LAB_CONTENT = {
  terminal: {
    intent: 'practise linux commands online without installing',
    intro: 'Every security path runs through a terminal eventually, and the usual first obstacle is not the commands — it is having somewhere safe to type them. This is a simulated shell with a fake filesystem, so nothing you do can break anything.',
    steps: ['Explore with ls and cd.', 'Read files with cat, then search them with grep.', 'Locate things with find, and check who you are with whoami.'],
    notes: [
      { h: 'Everything is a file', p: 'Linux exposes devices, processes and configuration as files, which is why a handful of file commands take you remarkably far.' },
      { h: 'Pipes are the real lesson', p: 'Each command does one thing; the power comes from chaining them so one\'s output becomes the next one\'s input.' },
    ],
    faq: [
      { q: 'Do I need to install Linux to learn the terminal?', a: 'Not to start. This runs in your browser. Once the commands feel natural, a real VM is the next step — Path 03 walks through building one.' },
      { q: 'Which commands should I learn first?', a: 'ls, cd, pwd, cat, grep, find and man. That set covers most of what early security work asks of you.' },
    ],
    related: ['linuxprivesc', 'loganalysis', 'logparser-tool', 'osint'],
  },
  webapp: {
    intent: 'practise xss and login bypass safely in browser',
    intro: 'A deliberately broken application, small enough to understand completely. It has a reflected XSS and a login you can walk past, which are the two bugs almost every web security course opens with — and for good reason, since both are still found constantly.',
    steps: ['Find the input that reflects into the page unescaped.', 'Prove code execution rather than just displaying text.', 'Walk past the login and note what the check was actually testing.'],
    notes: [
      { h: 'XSS is about context', p: 'The same payload behaves differently inside an HTML body, an attribute, or a script block. Escaping has to match where the data lands.' },
      { h: 'An alert box is a proof, not an impact', p: 'What makes XSS serious is what follows — stealing session tokens, performing actions as the victim, rewriting the page to phish them.' },
    ],
    faq: [
      { q: 'Is it legal to practise hacking here?', a: 'Yes. This is a simulation running in your own browser with no server behind it. That is the whole point — practise the technique somewhere you unambiguously own.' },
      { q: 'How is XSS actually fixed?', a: 'Context-aware output encoding, plus a Content Security Policy as a second layer. Blocklisting "bad" strings does not work; the space of encodings defeats it.' },
    ],
    related: ['sqli', 'csrf', 'clickjacking', 'headers-tool'],
  },
  sqli: {
    intent: 'sql injection practice online free login bypass',
    intro: 'SQL injection happens when input is glued into a query as text instead of passed as data. This lab shows you the query being built as you type, so you can watch your input stop being a username and start being SQL.',
    steps: ['Enter a normal username and watch the query that gets built.', 'Break out of the string context with a quote.', 'Make the WHERE clause always true and log in as the first user.'],
    notes: [
      { h: 'Watch the quotes', p: 'The classic \' OR \'1\'=\'1 works by closing the string the developer opened and appending a condition that is always true.' },
      { h: 'Parameterised queries are the fix', p: 'They send the query structure and the data on separate channels, so input cannot change the meaning of the statement. Escaping input is a workaround; this is a fix.' },
      { h: 'Blind SQLi has no error messages', p: 'Real targets often show nothing. Attackers infer answers from behaviour differences or response timing instead — slower, equally effective.' },
    ],
    faq: [
      { q: 'Is SQL injection still a real problem?', a: 'Yes. It remains in the OWASP Top 10 as part of Injection, and it still appears in breach reports — mostly in older code and hand-built queries that predate the team\'s current standards.' },
      { q: 'Do ORMs make you safe?', a: 'Mostly, because they parameterise by default. They stop protecting you the moment someone drops to raw SQL with string concatenation, which every ORM allows.' },
      { q: 'What is the difference between SQLi and NoSQL injection?', a: 'The same class of flaw in a different query language. MongoDB operators injected through JSON produce the same effect as \' OR 1=1 does in SQL.' },
    ],
    related: ['webapp', 'cmdinjection', 'codereview-tool', 'racecondition'],
  },
  phishing: {
    intent: 'phishing email quiz spot the red flags',
    intro: 'Phishing is the entry point for a large share of real breaches, and the defence is pattern recognition built by repetition. Judge each message, then see exactly which signals you caught and which you walked past.',
    steps: ['Read each message and decide: genuine or phish.', 'Commit to an answer before revealing.', 'Study the flags you missed — those are your blind spots.'],
    notes: [
      { h: 'Urgency is the near-universal tell', p: 'Almost every phish manufactures time pressure, because thinking is the defence it needs to bypass.' },
      { h: 'Read the domain right to left', p: 'The real domain is the part immediately before the first single slash. paypal.com.secure-login.xyz is not PayPal.' },
      { h: 'The best ones have no obvious flaws', p: 'A well-researched targeted message can be flawless. This is why verification through a separate channel beats inspection.' },
    ],
    faq: [
      { q: 'What is the fastest way to check a suspicious email?', a: 'Do not use anything in the message. Open a new tab, type the organisation\'s address yourself, and check your account there.' },
      { q: 'What is spear phishing?', a: 'Phishing tailored to you specifically, using real details about your job, colleagues or recent activity. Far harder to spot and far more successful.' },
      { q: 'Does MFA stop phishing?', a: 'It stops the reuse of a stolen password, which is most of the value. It does not stop real-time relay attacks or MFA fatigue — phishing-resistant factors like passkeys do.' },
    ],
    related: ['emailheaders-tool', 'osint', 'openredirect', 'prompt-injection'],
  },
  pcap: {
    intent: 'read a packet capture without wireshark',
    intro: 'Reading traffic is a distinct skill from attacking it, and it is the one blue teams live on. Load a sample capture and pick apart protocols, addresses and payloads — the same muscle Wireshark builds, without the install.',
    steps: ['Load the sample capture.', 'Identify the protocols present.', 'Follow a conversation between two addresses and read what crossed it.'],
    notes: [
      { h: 'Plaintext protocols leak everything', p: 'HTTP, FTP and Telnet carry credentials in the clear. Finding them in a capture is often the fastest win in an investigation.' },
      { h: 'Metadata survives encryption', p: 'TLS hides content, not who talked to whom, when, how often, or how much. Beaconing malware is frequently caught on timing alone.' },
    ],
    faq: [
      { q: 'What is a pcap file?', a: 'A recorded capture of network packets, written by tools like tcpdump or Wireshark, which can be replayed and analysed after the fact.' },
      { q: 'Can I see passwords in captured traffic?', a: 'In plaintext protocols, yes — which is precisely why they were replaced. In TLS traffic you see metadata only, unless you hold the keys.' },
    ],
    related: ['loganalysis', 'dnsrecon', 'useragent-tool', 'terminal'],
  },
  idor: {
    intent: 'idor vulnerability example change id in url',
    intro: 'Insecure Direct Object Reference is the bug where an application checks that you are logged in but forgets to check that the record you asked for is yours. Change a number in the URL, get someone else\'s data. It is trivially simple and enormously common.',
    steps: ['Open your own invoice and note the identifier.', 'Change it.', 'Read data that was never meant for you.'],
    notes: [
      { h: 'Authentication is not authorisation', p: 'Knowing who you are says nothing about what you may see. The check must happen per object, on every request, on the server.' },
      { h: 'Unguessable IDs are not a fix', p: 'A UUID makes the bug harder to find by hand, not harder to exploit once found — and IDs leak through exports, emails and referrers constantly.' },
    ],
    faq: [
      { q: 'Why is IDOR so common?', a: 'Because the missing code is invisible. Nothing breaks, no test fails, and the feature works perfectly for the developer testing with their own account.' },
      { q: 'How is it fixed?', a: 'Every request that names an object must verify that the authenticated user owns or may access that specific object, server-side, before returning anything.' },
      { q: 'Is IDOR the same as BOLA?', a: 'Effectively yes. BOLA — Broken Object Level Authorization — is the API-focused name, and it sits at number one on the OWASP API Security Top 10.' },
    ],
    related: ['bola-bfla', 'mass-assignment', 'graphql-introspection', 'webapp'],
  },
  jwt: {
    intent: 'jwt none algorithm attack practice',
    intro: 'A JWT is only as trustworthy as the verification behind it. Strip the signature, flip a claim from user to admin, and hand it to an endpoint that decodes without verifying — this lab lets you watch that succeed, then see what stops it.',
    steps: ['Decode the token and read its claims.', 'Change a claim — role, or user ID.', 'Try the alg: none trick and see the vulnerable endpoint accept it.'],
    notes: [
      { h: 'The alg header is attacker input', p: 'Any library that reads alg from the token to decide how to verify it has handed the attacker the decision. Pin the expected algorithm server-side.' },
      { h: 'RS256 to HS256 confusion', p: 'If a library accepts either, an attacker can sign with the public key as an HMAC secret — and the public key is, by definition, public.' },
      { h: 'Payloads are readable by design', p: 'Signing proves integrity, not confidentiality. Anything private in a JWT payload is already disclosed.' },
    ],
    faq: [
      { q: 'What is the alg none attack?', a: 'Setting the header algorithm to "none" and removing the signature. Libraries that honoured that value would treat the unsigned token as valid — which is why every current library rejects it by default.' },
      { q: 'How should JWTs be verified properly?', a: 'Pin the algorithm server-side, verify the signature with a key you control, then check exp, iss and aud. Skipping any of those is a finding.' },
      { q: 'Are JWTs a bad idea?', a: 'They are a reasonable tool that is frequently misused — especially as sessions, where their inability to be revoked before expiry is a genuine drawback.' },
    ],
    related: ['jwt-tool', 'oauthredirect', 'webhookforge', 'bola-bfla'],
  },
  traversal: {
    intent: 'path traversal dot dot slash example',
    intro: 'Path traversal is what happens when a filename comes from the user and is trusted. Add enough ../ and you climb out of the intended directory into the rest of the filesystem — configuration files, credentials, keys.',
    steps: ['Request a file the feature intends you to have.', 'Prefix ../ sequences to climb out of the folder.', 'Reach a file you were never meant to read.'],
    notes: [
      { h: 'Encoding defeats naive filters', p: '%2e%2e%2f, double encoding and mixed separators all decode to the same climb. Stripping the literal string ../ once is not a defence.' },
      { h: 'Resolve, then check', p: 'The fix is to canonicalise the full path and confirm it still sits inside the permitted directory — not to inspect the raw input.' },
    ],
    faq: [
      { q: 'What files do attackers look for?', a: '/etc/passwd on Linux as a quick proof, then the valuable targets: application configuration, .env files, private keys and cloud credentials.' },
      { q: 'How is path traversal fixed properly?', a: 'Never build a path from user input directly. Map an identifier to a known-safe filename, or canonicalise and verify containment before opening anything.' },
    ],
    related: ['ssrf', 'xxe', 'cmdinjection', 'clouddockersecrets'],
  },
  ssrf: {
    intent: 'ssrf attack internal metadata endpoint practice',
    intro: 'Server-Side Request Forgery turns a "fetch this URL for me" feature into a way to reach things the server can see and you cannot — internal services, admin panels, and in cloud environments the metadata endpoint holding credentials.',
    steps: ['Point the fetcher at an ordinary external URL.', 'Redirect it at internal-looking addresses.', 'Reach a service that assumed only the internal network could talk to it.'],
    notes: [
      { h: 'The server\'s network position is the prize', p: 'You are borrowing its access. Internal services that skipped authentication because "only our network can reach them" are the usual casualties.' },
      { h: 'Cloud metadata is the classic escalation', p: 'The link-local metadata address hands out temporary credentials to whatever asks from the instance. SSRF plus metadata has caused major real-world breaches.' },
      { h: 'Blocklists lose', p: 'Redirects, DNS records pointing at private addresses, alternative IP encodings and IPv6 all bypass "block 127.0.0.1" thinking. Allowlist destinations instead.' },
    ],
    faq: [
      { q: 'What makes SSRF dangerous when it returns nothing?', a: 'Blind SSRF still reaches internal services and can trigger state changes. Timing and error differences leak whether a host or port exists, which is enough to map an internal network.' },
      { q: 'How is SSRF prevented?', a: 'Allowlist the destinations the feature legitimately needs, resolve and validate the address after DNS, block redirects to private ranges, and require authentication on internal services regardless.' },
    ],
    related: ['xxe', 'traversal', 'iammisconfig', 'subnet-tool'],
  },
  xxe: {
    intent: 'xxe external entity file read example',
    intro: 'XML has a feature almost nobody wants: documents can define entities that pull in external content, including local files. Feed such a document to a parser with entity expansion enabled and a harmless-looking upload becomes a file read.',
    steps: ['Submit an ordinary XML document.', 'Define an external entity pointing at a local file.', 'Reference the entity and read the file back in the response.'],
    notes: [
      { h: 'It is a parser setting, not a code bug', p: 'The application often contains no mistake at all — the default configuration of the XML parser does the damage. Disable DTDs and external entities.' },
      { h: 'XXE frequently becomes SSRF', p: 'An entity can point at a URL as easily as a file, which turns the parser into a request-forging proxy.' },
      { h: 'It hides in unexpected formats', p: 'DOCX, XLSX, SVG and SAML assertions are all XML underneath, which is how XXE reaches applications that believe they never parse XML.' },
    ],
    faq: [
      { q: 'How do I stop XXE?', a: 'Disable DTD processing and external entity resolution in the parser. Every major XML library documents the exact flags; it is usually one line.' },
      { q: 'What is a billion laughs attack?', a: 'A denial-of-service using nested entities that expand exponentially, exhausting memory from a very small file. Disabling DTDs stops it too.' },
    ],
    related: ['ssrf', 'traversal', 'deserialization', 'codereview-tool'],
  },
  loganalysis: {
    intent: 'analyse auth log find the breach timeline',
    intro: 'A messy auth.log from a machine that was compromised. No exploitation here — this is the blue-team side: work out what happened, in what order, and where the attacker got in.',
    steps: ['Scan for authentication failures and find the burst.', 'Locate the success that follows it.', 'Build the timeline forward from there — what did they do once inside?'],
    notes: [
      { h: 'Failures then a success is the signature', p: 'Many failed passwords followed by an accepted one, from the same source, is a brute force that worked. It is the single most recognisable pattern in auth logs.' },
      { h: 'Pivot on time, then on identity', p: 'Find one confirmed event, examine everything around that timestamp, then follow the account or address wherever it goes.' },
      { h: 'Persistence is the next question', p: 'Attackers add keys, users, cron jobs and services. Finding entry without finding persistence means the incident is not over.' },
    ],
    faq: [
      { q: 'Where do Linux authentication logs live?', a: '/var/log/auth.log on Debian and Ubuntu, /var/log/secure on RHEL and derivatives. Systemd journals hold the same events via journalctl.' },
      { q: 'What is the first thing to check after a suspected compromise?', a: 'Who logged in, from where, and when — then what they ran. Preserve the evidence before changing anything, because remediation destroys the timeline.' },
    ],
    related: ['logparser-tool', 'irtabletop', 'malwarestrings', 'pcap'],
  },
  osint: {
    intent: 'osint reconnaissance practice safe target',
    intro: 'Open-source intelligence is the reconnaissance phase done entirely with public information. This is a fabricated company profile, so you can practise the methodology — pivoting from one detail to the next — without touching a real organisation.',
    steps: ['Start from the company name and find its public surface.', 'Pivot from each detail to the next.', 'Assemble what an attacker would know before sending a single packet.'],
    notes: [
      { h: 'People are the largest surface', p: 'Job postings name internal technology. Conference talks name architecture. Employee profiles name tools and teams. None of it requires touching the target.' },
      { h: 'Passive means genuinely passive', p: 'Reading public records is passive. Port scanning is not, and the line matters legally as well as tactically.' },
    ],
    faq: [
      { q: 'Is OSINT legal?', a: 'Gathering public information generally is. What you do with it is governed separately — and accessing a system without authorisation is not OSINT regardless of how you found it.' },
      { q: 'What do defenders do with OSINT?', a: 'Run it against themselves. Knowing what leaks about your own organisation is the only way to reduce it.' },
    ],
    related: ['dnsrecon', 'phishing', 'subdomaintakeover', 'clouddockersecrets'],
  },
  'bola-bfla': {
    intent: 'broken object level authorization api practice',
    intro: 'The top two entries in the OWASP API Security Top 10, in one lab. BOLA is reading a record that is not yours; BFLA is calling a function your role should not reach. Both come from the same omission — the authorisation check that never got written.',
    steps: ['Read your own employee record.', 'Change the identifier and read someone else\'s.', 'Call an administrative action without an admin role.'],
    notes: [
      { h: 'APIs make this worse than web UIs', p: 'A UI hides the admin button. An API documents the endpoint, and the client-side role check that hid it never existed on the server.' },
      { h: 'Object level and function level are separate checks', p: 'You need both: may this user touch this record, and may this user perform this action at all? Passing one says nothing about the other.' },
    ],
    faq: [
      { q: 'Why is BOLA number one on the API Top 10?', a: 'Because it is both the most common API flaw and among the most damaging — it usually exposes every record of a given type, not just one.' },
      { q: 'How do I test for it?', a: 'Create two accounts. Do everything as one, then replay each request with the other\'s session and see what still succeeds.' },
    ],
    related: ['idor', 'mass-assignment', 'graphql-introspection', 'rate-limit-bypass'],
  },
  'graphql-introspection': {
    intent: 'graphql introspection query hidden fields',
    intro: 'GraphQL exposes one endpoint that can describe itself completely. Introspection is a legitimate developer feature and an excellent attacker map — it hands over every type, field and mutation, including the ones the interface never shows.',
    steps: ['Send an introspection query against the endpoint.', 'Read the full schema it returns.', 'Query a field the user interface never exposes.'],
    notes: [
      { h: 'One endpoint, many operations', p: 'Traditional endpoint-level access rules do not map onto GraphQL. Authorisation has to live at the field and object level.' },
      { h: 'Disabling introspection is not access control', p: 'It slows discovery down. Schemas leak through error messages, client bundles and field suggestions regardless.' },
      { h: 'Query depth is a denial-of-service vector', p: 'Nested queries can be made to explode combinatorially. Depth limits, complexity scoring and timeouts are standard defences.' },
    ],
    faq: [
      { q: 'Should introspection be disabled in production?', a: 'Commonly yes, as defence in depth. It must not be your only control — every field still needs its own authorisation check.' },
      { q: 'Why do REST security tools miss GraphQL bugs?', a: 'They reason about URLs and methods. In GraphQL every request is a POST to the same path, so the interesting differences are inside the body.' },
    ],
    related: ['bola-bfla', 'mass-assignment', 'idor', 'rate-limit-bypass'],
  },
  'mass-assignment': {
    intent: 'mass assignment vulnerability privilege escalation',
    intro: 'A convenience feature in most web frameworks binds incoming JSON straight onto an object. Send a field the form never showed — isAdmin, role, balance — and if the binding is not restricted, it is written anyway.',
    steps: ['Update your profile normally and watch the request.', 'Add a field the form does not send.', 'Find the one that should not have been writable.'],
    notes: [
      { h: 'The form is not the contract', p: 'Whatever the UI displays, the endpoint accepts whatever it accepts. The server must define the allowed fields explicitly.' },
      { h: 'Allowlist the writable fields', p: 'Binding everything and blocklisting the dangerous names fails as soon as someone adds a field and forgets the list.' },
    ],
    faq: [
      { q: 'What is mass assignment also called?', a: 'Autobinding, or object injection. Rails documented it as mass assignment, and the name stuck across ecosystems.' },
      { q: 'How is it prevented?', a: 'Use an explicit input model — a DTO or serializer listing exactly the fields a client may set — and never bind a request body directly onto a persistence object.' },
    ],
    related: ['bola-bfla', 'idor', 'deserialization', 'graphql-introspection'],
  },
  'rate-limit-bypass': {
    intent: 'rate limit bypass x-forwarded-for header',
    intro: 'A login that locks you out after three bad guesses, and a rate limiter that decides who "you" are from a header you control. This is one of the most common real misconfigurations behind a proxy.',
    steps: ['Trigger the lockout with bad guesses.', 'Notice which header identifies you.', 'Change it and continue guessing.'],
    notes: [
      { h: 'X-Forwarded-For is client-supplied', p: 'It is a hint added by proxies and freely forged by anyone. Trusting it for identity means trusting the attacker.' },
      { h: 'Trust only your own proxy', p: 'Take the client address from the connection, or from the specific position in the header chain your own trusted proxy wrote.' },
      { h: 'Rate limit the account too', p: 'Limiting only by address lets a distributed attack through. Password spraying — one password against thousands of accounts — is designed to stay under per-address limits.' },
    ],
    faq: [
      { q: 'Should rate limiting be by IP or by account?', a: 'Both. Per-address stops one machine hammering you; per-account stops a distributed attack on a single user; global limits catch spraying across many.' },
      { q: 'Is rate limiting enough to protect a login?', a: 'No. It buys time. Multi-factor authentication, breach-password screening and anomaly detection are what actually stop credential attacks.' },
    ],
    related: ['passwordcrack', 'bola-bfla', 'racecondition', 'passpolicy-tool'],
  },
  'prompt-injection': {
    intent: 'prompt injection extract system prompt practice',
    intro: 'A support bot instructed never to reveal its system prompt. Prompt injection works because a language model sees instructions and data in the same channel, with no structural way to tell which is which.',
    steps: ['Ask directly and watch it refuse.', 'Reframe the request so the instruction arrives as something other than a request.', 'Get the system prompt out.'],
    notes: [
      { h: 'There is no parameterised query for prompts', p: 'SQL injection was solved by separating code from data. Language models have no equivalent boundary, which is why this class is not simply patched.' },
      { h: 'Treat model output as untrusted', p: 'The durable defence is downstream: never let model output reach a privileged action without validation and, for anything consequential, a human.' },
    ],
    faq: [
      { q: 'Why can prompt injection not just be fixed?', a: 'Because instructions and data share one channel by design. Mitigations reduce the rate; nothing yet removes the class the way parameterisation removed most SQLi.' },
      { q: 'Are system prompts meant to be secret?', a: 'Treat them as public. They leak reliably enough that anything genuinely sensitive does not belong in one.' },
    ],
    related: ['jailbreak', 'indirect-injection', 'agentic-risk', 'phishing'],
  },
  jailbreak: {
    intent: 'llm jailbreak roleplay framing example',
    intro: 'An assistant that refuses to hand over a secret code directly. Jailbreaks work by changing the frame — fiction, hypotheticals, personas — so the request no longer looks to the model like the thing it was told to refuse.',
    steps: ['Ask plainly and get refused.', 'Reframe as fiction, roleplay or a hypothetical.', 'Notice which framings shift the model\'s behaviour and which do not.'],
    notes: [
      { h: 'Safety training is statistical', p: 'Refusals are learned associations with how requests usually look, not rules. Change the shape enough and the association weakens.' },
      { h: 'This is why layered controls exist', p: 'Model-level refusal is one layer. Output filtering, tool permissioning and authorisation checks are what hold when it is bypassed.' },
    ],
    faq: [
      { q: 'What is the difference between jailbreaking and prompt injection?', a: 'Jailbreaking is the user talking the model out of its own guardrails. Prompt injection is a third party smuggling instructions in through content the model processes. Different attacker, different trust boundary.' },
      { q: 'Is finding jailbreaks useful work?', a: 'Yes — it is a real red-teaming discipline, and most AI labs run or fund it. Doing it on systems you are authorised to test is the important part.' },
    ],
    related: ['prompt-injection', 'indirect-injection', 'agentic-risk', 'webapp'],
  },
  'indirect-injection': {
    intent: 'indirect prompt injection poisoned document',
    intro: 'The dangerous form of prompt injection, because the victim is not the attacker. You control a job posting that an assistant is about to summarise for someone else — so you plant an instruction, and the model follows it on their behalf.',
    steps: ['Write a posting that reads normally to a human.', 'Embed an instruction aimed at the model.', 'Watch the assistant act on it for the other user.'],
    notes: [
      { h: 'Any retrieved content is an injection surface', p: 'Web pages, PDFs, emails, code comments, calendar invites — anything a model reads can carry instructions.' },
      { h: 'RAG widens the blast radius', p: 'A poisoned document in a shared knowledge base affects every user whose query retrieves it, not just the person who added it.' },
    ],
    faq: [
      { q: 'Why is indirect injection worse than direct?', a: 'Because the victim never sees the payload and never consented. It is the difference between someone talking their own assistant into misbehaving and someone weaponising yours.' },
      { q: 'What actually reduces the risk?', a: 'Constrain what the model may do with retrieved content, keep privileged actions behind explicit authorisation, and require human confirmation before anything consequential.' },
    ],
    related: ['prompt-injection', 'agentic-risk', 'jailbreak', 'phishing'],
  },
  'agentic-risk': {
    intent: 'ai agent email tool access security risk',
    intro: 'An AI agent with tool access is about to process an inbox. One message is designed to make it act against its user. Your job is the defender\'s: spot it and quarantine it before the agent gets there.',
    steps: ['Review the inbox as the agent would.', 'Identify the message written for the model rather than the human.', 'Quarantine it before processing.'],
    notes: [
      { h: 'Tool access converts text into consequences', p: 'A chatbot that is fooled produces bad text. An agent that is fooled sends email, moves money or deletes data.' },
      { h: 'Least privilege applies to agents too', p: 'Scope tool permissions to the task. Read-only defaults, explicit confirmation for anything irreversible.' },
      { h: 'The confused deputy problem, again', p: 'The agent holds authority the attacker does not, and is tricked into using it. That pattern is decades old; only the deputy is new.' },
    ],
    faq: [
      { q: 'What makes AI agents riskier than chatbots?', a: 'They take actions. Every tool you connect is a new way for a successful injection to reach the real world.' },
      { q: 'How should agent permissions be designed?', a: 'Minimum scope per task, read-only wherever possible, human approval for irreversible actions, and full logging of every tool call.' },
    ],
    related: ['indirect-injection', 'prompt-injection', 'iammisconfig', 'jailbreak'],
  },
  'ad-attack': {
    intent: 'active directory attack path kerberoasting golden ticket',
    intro: 'A guided walk through the Active Directory attack chain that shows up in most enterprise compromises: map the graph, find the path, Kerberoast a weak service account, and forge a Golden Ticket.',
    steps: ['Run graph-style recon and read the relationships.', 'Find the path from your foothold to Domain Admin.', 'Kerberoast a weak service account and crack it offline.', 'Forge a Golden Ticket and understand what it grants.'],
    notes: [
      { h: 'AD is a graph, and attackers read it as one', p: 'BloodHound made this mainstream: permissions that look harmless individually chain into a path to Domain Admin that nobody designed.' },
      { h: 'The krbtgt hash is the domain', p: 'It signs every ticket. Anyone holding it can mint credentials for any user, which is why recovery requires resetting it twice.' },
    ],
    faq: [
      { q: 'What is a Golden Ticket?', a: 'A Kerberos ticket-granting ticket forged with the krbtgt account hash. It grants access as any user to any service and survives password resets, which is why it is the definition of full domain compromise.' },
      { q: 'How is Kerberoasting detected?', a: 'Watch for unusual volumes of service ticket requests, especially with weak encryption types. Managed service accounts with long random passwords remove the payoff entirely.' },
    ],
    related: ['kerberoast', 'winprivesc', 'passwordcrack', 'loganalysis'],
  },
  csrf: {
    intent: 'csrf attack example how token prevents it',
    intro: 'Cross-Site Request Forgery abuses the fact that browsers attach your cookies to requests automatically, whoever caused them. A malicious page makes your browser perform a real, authenticated action — then you switch on a CSRF token and watch the same attack fail.',
    steps: ['Perform a normal transfer while logged in.', 'Trigger the same request from an attacker page.', 'Enable the CSRF token and watch it get rejected.'],
    notes: [
      { h: 'The browser is the confused deputy', p: 'It holds your session and attaches it to any request to that origin. The server cannot tell intent from the cookie alone.' },
      { h: 'Tokens work because the attacker cannot read them', p: 'The same-origin policy stops a malicious page reading a token from your session, so it cannot include one.' },
      { h: 'SameSite cookies changed the landscape', p: 'SameSite=Lax by default in modern browsers blocks most cross-site request patterns — which reduced CSRF sharply without eliminating it.' },
    ],
    faq: [
      { q: 'Is CSRF still relevant with SameSite cookies?', a: 'Less than it was, but yes. Legacy configurations, SameSite=None for third-party flows, and GET-based state changes all keep it alive.' },
      { q: 'What is the difference between CSRF and XSS?', a: 'CSRF makes your browser send a request you did not intend, without reading the response. XSS runs the attacker\'s code inside your origin, which is strictly worse — and defeats CSRF tokens outright.' },
    ],
    related: ['clickjacking', 'webapp', 'headers-tool', 'openredirect'],
  },
  cmdinjection: {
    intent: 'command injection ping tool chain commands',
    intro: 'A "ping this host" feature that builds a shell command by pasting your input into a string. Add a shell metacharacter and your second command runs alongside the first — with whatever privileges the web process holds.',
    steps: ['Ping a normal hostname.', 'Append a shell separator such as ; or &&.', 'Run a command the feature never intended.'],
    notes: [
      { h: 'The shell is the problem', p: 'Invoking a command through a shell means metacharacters are interpreted. Passing an argument array directly to the process avoids the shell entirely.' },
      { h: 'Blind command injection is common', p: 'When output is not returned, attackers confirm execution with timing — sleep 10 — or an outbound network callback.' },
    ],
    faq: [
      { q: 'How is command injection fixed?', a: 'Do not build shell strings from input. Use APIs that take an argument array, avoid shell invocation, and where a value must be user-supplied, allowlist its format strictly.' },
      { q: 'Which characters matter?', a: '; && || | & newline, plus $() and backticks for substitution. Any one of them can extend the intended command.' },
    ],
    related: ['sqli', 'traversal', 'linuxprivesc', 'codereview-tool'],
  },
  openredirect: {
    intent: 'open redirect phishing returnurl parameter',
    intro: 'A login page that sends you wherever returnUrl says. On its own it is rated low severity — until you notice it turns a genuinely trusted domain into the first hop of a phishing link that passes every eyeball check.',
    steps: ['Log in normally and watch the redirect.', 'Change returnUrl to an external destination.', 'See how the resulting link looks to a target.'],
    notes: [
      { h: 'The value is the trusted domain', p: 'The link starts with a domain the victim knows. That is what defeats "check the link before clicking" advice.' },
      { h: 'It escalates OAuth bugs', p: 'A redirect chained into an OAuth flow can leak authorisation codes and tokens, turning a low-severity finding into account takeover.' },
    ],
    faq: [
      { q: 'Why do triagers often rate open redirect as low?', a: 'In isolation it only moves a browser. It gets upgraded quickly when chained — into OAuth code theft, token leakage or a credible phishing campaign.' },
      { q: 'How is it fixed?', a: 'Allowlist permitted destinations, or accept only relative paths. Validating that the URL "contains" your domain fails against evil.com/?x=yoursite.com.' },
    ],
    related: ['oauthredirect', 'phishing', 'csrf', 'clickjacking'],
  },
  clickjacking: {
    intent: 'clickjacking invisible iframe demo',
    intro: 'An invisible frame sits over a fake game button. You think you are clicking Play; the click lands on "delete account" in a framed page where you are still logged in. Seeing it once makes the defence obvious.',
    steps: ['Click the visible button.', 'Reveal the transparent frame above it.', 'See where the click actually landed.'],
    notes: [
      { h: 'Nothing is forged', p: 'The victim really clicked, really authenticated, really authorised it. Only the intent was stolen — which is why server-side checks cannot detect it.' },
      { h: 'Framing controls are the fix', p: 'X-Frame-Options: DENY, or the modern CSP frame-ancestors directive, tells the browser not to allow framing at all.' },
    ],
    faq: [
      { q: 'How do I stop clickjacking?', a: 'Send Content-Security-Policy: frame-ancestors \'none\' (or an explicit allowlist). X-Frame-Options is the older equivalent and still worth sending for legacy clients.' },
      { q: 'What is likejacking?', a: 'The same technique aimed at social media buttons, harvesting likes, follows and shares from users who thought they clicked something else.' },
    ],
    related: ['csrf', 'headers-tool', 'webapp', 'openredirect'],
  },
  deserialization: {
    intent: 'insecure deserialization remember me cookie',
    intro: 'A "remember me" cookie that is a serialised object the server trusts and rebuilds. Add a field, and you are an administrator without ever logging in. In real systems this class reaches remote code execution.',
    steps: ['Decode the cookie and read the object.', 'Add or change a field.', 'Re-encode it and watch the server trust it.'],
    notes: [
      { h: 'Deserialising untrusted input is the flaw', p: 'Rebuilding an object from attacker-controlled bytes hands them influence over your program\'s state — and in many languages, over which code runs during construction.' },
      { h: 'Gadget chains turn this into RCE', p: 'Attackers assemble existing classes in the application\'s own dependencies into a chain that executes code purely as a side effect of deserialisation.' },
      { h: 'Use data formats, not object formats', p: 'Plain JSON parsed into a known structure carries none of this. Sign anything that must round-trip through the client.' },
    ],
    faq: [
      { q: 'Which languages are affected?', a: 'All of the common ones — Java, PHP, Python pickle, .NET, Ruby. The specific gadgets differ; the class does not.' },
      { q: 'How is it fixed?', a: 'Do not deserialise untrusted data. Where you must round-trip state through a client, use a simple data format and verify an HMAC signature before parsing.' },
    ],
    related: ['mass-assignment', 'jwt', 'webhookforge', 'xxe'],
  },
  subdomaintakeover: {
    intent: 'dangling cname subdomain takeover find',
    intro: 'Five DNS records, one of which points at a third-party resource that no longer exists. Claim that resource and you own content served from the target\'s own domain — with their certificate, their cookies, and their reputation.',
    steps: ['Review the DNS records.', 'Identify the CNAME pointing somewhere unclaimed.', 'Understand exactly what claiming it would grant.'],
    notes: [
      { h: 'Decommissioning order matters', p: 'The record outlives the resource because teams delete the service and forget the DNS entry. Remove the record first.' },
      { h: 'The impact is the domain, not the page', p: 'Content on a trusted subdomain can receive cookies scoped to the parent domain, pass domain validation for certificates, and defeat every "check the URL" instinct.' },
    ],
    faq: [
      { q: 'How do I find dangling records?', a: 'Enumerate your subdomains, resolve each one, and check whether the target still exists and is still yours. Continuous monitoring beats a one-off audit.' },
      { q: 'Why do bug bounty programmes pay well for these?', a: 'Because impact is high, exploitation is trivial, and the fix is a single DNS deletion. High severity, low effort, no downside to fixing.' },
    ],
    related: ['dnsrecon', 'osint', 'openredirect', 'clouddockersecrets'],
  },
  dnsrecon: {
    intent: 'dns enumeration subdomains attack surface',
    intro: 'A simulated dig. Query a target\'s likely subdomains and assemble the map — including the staging box, the old admin panel and the forgotten service that nobody has patched since it stopped being important.',
    steps: ['Query the obvious names.', 'Work through common subdomain patterns.', 'Assemble the picture of what is actually exposed.'],
    notes: [
      { h: 'Forgotten hosts are the valuable ones', p: 'dev, staging, old and test frequently run outdated software with weaker controls and real data.' },
      { h: 'Record types answer different questions', p: 'A and AAAA give addresses, MX gives mail infrastructure, TXT often leaks vendor relationships through verification records, CNAME reveals third-party hosting.' },
      { h: 'Certificate transparency is a free subdomain list', p: 'Every issued certificate is logged publicly, so requesting one for a private hostname publishes its name.' },
    ],
    faq: [
      { q: 'Is DNS enumeration legal?', a: 'Querying public DNS is public information lookup. Connecting to what you find is a separate question requiring authorisation.' },
      { q: 'How do defenders reduce DNS exposure?', a: 'Keep an authoritative inventory, remove records when services are decommissioned, avoid descriptive internal names in public zones, and monitor certificate transparency for your own domains.' },
    ],
    related: ['subdomaintakeover', 'osint', 'pcap', 'subnet-tool'],
  },
  winprivesc: {
    intent: 'windows privilege escalation unquoted service path',
    intro: 'A service running as SYSTEM whose binary sits somewhere you can write. No exploit, no memory corruption — just a misconfiguration, which is how most real privilege escalation happens.',
    steps: ['Enumerate services and their binary paths.', 'Find the one running as SYSTEM with a writable path.', 'Replace it and escalate on restart.'],
    notes: [
      { h: 'Misconfiguration beats exploitation', p: 'Weak service permissions, unquoted paths and writable directories in PATH are far more common than an unpatched kernel bug, and far more reliable.' },
      { h: 'Enumeration is most of the work', p: 'The escalation itself is usually seconds. Finding the one weak setting among hundreds is the skill.' },
    ],
    faq: [
      { q: 'What is an unquoted service path?', a: 'A service path with spaces and no quotes, so Windows tries each prefix in turn. C:\\Program Files\\My App\\svc.exe means it will try C:\\Program.exe first — writable by a low-privileged user in some configurations.' },
      { q: 'How is this prevented?', a: 'Quote service paths, restrict write access to service binaries and their directories, run services as low-privileged accounts, and audit permissions regularly.' },
    ],
    related: ['linuxprivesc', 'ad-attack', 'kerberoast', 'dockerescape'],
  },
  linuxprivesc: {
    intent: 'linux privilege escalation suid gtfobins',
    intro: 'Enumerate SUID binaries on a simulated machine and find the one that GTFOBins turns into a root shell. SUID means "run as the file\'s owner", and a single unnecessary SUID binary is often the whole path to root.',
    steps: ['List SUID binaries on the system.', 'Identify the one that should not be there.', 'Use its documented capability to become root.'],
    notes: [
      { h: 'Many normal tools escalate when SUID', p: 'find, vim, less and awk can all run commands. Harmless normally; a root shell when SUID.' },
      { h: 'GTFOBins is the reference', p: 'It catalogues exactly how each binary can be abused for shell access, file read and file write. Both sides use it.' },
      { h: 'Check sudo too', p: 'sudo -l often reveals a permitted command that shells out — the same escalation by a different route.' },
    ],
    faq: [
      { q: 'What does the SUID bit do?', a: 'Runs the program as its owner rather than as you. Necessary for a few tools like passwd; dangerous on anything that can execute arbitrary commands.' },
      { q: 'How do I find SUID binaries?', a: 'find / -perm -4000 -type f 2>/dev/null. Comparing that against a known-good baseline is what makes the result meaningful.' },
    ],
    related: ['winprivesc', 'terminal', 'dockerescape', 'cmdinjection'],
  },
  kerberoast: {
    intent: 'kerberoasting service ticket offline crack',
    intro: 'Any authenticated domain user can request a service ticket for any service account — and part of that ticket is encrypted with the account\'s password hash. Request it, take it offline, and crack at your leisure with nothing to detect.',
    steps: ['Identify service accounts with an SPN.', 'Request a service ticket for one.', 'Crack the returned hash offline.'],
    notes: [
      { h: 'The request itself is legitimate', p: 'Requesting a service ticket is ordinary Kerberos behaviour. That is what makes this quiet — the attack is the offline cracking, which your network never sees.' },
      { h: 'Service accounts are the weak point', p: 'They often have old passwords set by hand, excessive privileges, and no rotation policy. A 25-character random password makes the attack pointless.' },
    ],
    faq: [
      { q: 'What is an SPN?', a: 'A Service Principal Name — the identifier mapping a service to the account running it. Accounts with an SPN are the ones that can be Kerberoasted, which makes finding them step one.' },
      { q: 'How is Kerberoasting mitigated?', a: 'Group Managed Service Accounts with automatic long random passwords, AES encryption types rather than RC4, least privilege for service accounts, and alerting on unusual ticket request volume.' },
    ],
    related: ['ad-attack', 'passwordcrack', 'winprivesc', 'hashid-tool'],
  },
  iammisconfig: {
    intent: 'aws iam passrole privilege escalation',
    intro: 'One permission that looks minor on a policy review — and chains into full account takeover. iam:PassRole is the classic: the ability to hand a role to a service you can start is the ability to become that role.',
    steps: ['Review the role\'s permissions.', 'Find the one that permits passing a role.', 'Chain it into privileges you were never granted.'],
    notes: [
      { h: 'Permissions compose in ways policies do not show', p: 'Each grant looks reasonable alone. Escalation lives in the combination, which is why policy review by inspection misses it.' },
      { h: 'PassRole needs a resource constraint', p: 'Granting iam:PassRole on * lets the holder pass any role, including administrative ones. Constrain it to specific roles, always.' },
      { h: 'Cloud is an identity problem', p: 'There is no network perimeter to hide behind. Identity and its permissions are the perimeter.' },
    ],
    faq: [
      { q: 'What is iam:PassRole?', a: 'The permission to give a role to an AWS service when you create a resource. Without a resource constraint it is effectively "become any role this account has".' },
      { q: 'How do I find these paths in my own account?', a: 'Automated policy analysis — IAM Access Analyzer, or open-source tools that build the permission graph — because manual review reliably misses multi-step chains.' },
    ],
    related: ['dockerescape', 'ssrf', 'clouddockersecrets', 'controlmapper-tool'],
  },
  dockerescape: {
    intent: 'docker socket mount container escape',
    intro: 'A container with the host\'s Docker socket mounted inside it. That socket is the Docker daemon\'s full API, and the daemon runs as root on the host — so this is not really an escape so much as walking through a door that was left open.',
    steps: ['Notice the mounted socket.', 'Use it to start a privileged container.', 'Reach the host filesystem from inside it.'],
    notes: [
      { h: 'Socket access is root on the host', p: 'Anyone who can talk to the Docker socket can start a container mounting / with full privileges. Mounting it into a container grants that container root on the host.' },
      { h: 'Containers are not a security boundary by default', p: 'They isolate by convention and configuration. --privileged, host namespaces and sensitive mounts each remove what isolation there is.' },
    ],
    faq: [
      { q: 'Why do so many tools mount the Docker socket?', a: 'CI runners and monitoring agents genuinely need to manage containers. It is convenient and it is exactly as dangerous as giving them root — use a rootless daemon or a proxy that restricts the API.' },
      { q: 'How do I harden containers?', a: 'Run as non-root, drop capabilities, use read-only filesystems, avoid --privileged, never mount the socket, and apply seccomp and AppArmor profiles.' },
    ],
    related: ['iammisconfig', 'linuxprivesc', 'clouddockersecrets', 'sbomcheck-tool'],
  },
  malwarestrings: {
    intent: 'malware strings analysis find iocs',
    intro: 'A raw strings dump from a suspicious binary. Long before a disassembler, running strings tells you a great deal — and here you pick the indicators out of the noise: a C2 domain, a mutex, a registry key.',
    steps: ['Scan the dump for network indicators.', 'Find the mutex and the persistence mechanism.', 'Assemble the indicators of compromise.'],
    notes: [
      { h: 'Strings is the cheapest first step', p: 'Seconds of effort, frequently decisive. Domains, paths, registry keys and error messages all survive compilation.' },
      { h: 'Mutexes identify families', p: 'Malware uses a named mutex to avoid infecting a machine twice. That name is often a reliable, highly specific signature.' },
      { h: 'Packed samples give you nothing', p: 'Few meaningful strings and high entropy is itself the finding — it says unpack first.' },
    ],
    faq: [
      { q: 'What is an IOC?', a: 'An Indicator of Compromise — an observable like a domain, hash, file path or registry key that lets defenders search their estate for the same intrusion.' },
      { q: 'Is it safe to analyse malware?', a: 'Only in an isolated lab: an offline VM with snapshots and no path to your network. This lab is a static dump, so there is nothing here to execute.' },
    ],
    related: ['yarabuilder', 'yaratester-tool', 'entropy-tool', 'loganalysis'],
  },
  yarabuilder: {
    intent: 'write yara rule three samples one clean file',
    intro: 'Three malware samples and one clean file. Write a rule that catches all three and none of the clean one — which is the entire craft of detection engineering compressed into one exercise.',
    steps: ['Find strings common to all three samples.', 'Check none of them appear in the clean file.', 'Tighten until you have full coverage and no false positive.'],
    notes: [
      { h: 'The false positive is the hard constraint', p: 'A rule that catches everything is easy. A rule that catches everything and nothing else is detection engineering.' },
      { h: 'Choose durable strings', p: 'Pick what the author cannot casually change — protocol constants, unusual error text, a hardcoded mutex — not a filename.' },
    ],
    faq: [
      { q: 'What makes a YARA rule production-ready?', a: 'Coverage of the family including variants, no benign matches, metadata identifying author and purpose, and testing against a large clean corpus before deployment.' },
      { q: 'How specific is too specific?', a: 'If a recompile evades it, it is too specific. Hashing a single sample is the extreme case — perfectly precise and useless against the next build.' },
    ],
    related: ['yaratester-tool', 'malwarestrings', 'regex-tool', 'attckmap-tool'],
  },
  racecondition: {
    intent: 'race condition check then act coupon exploit',
    intro: 'A one-time coupon guarded by a check-then-act flaw. Fire requests fast enough and several pass the check before any of them writes the result — so one coupon redeems many times.',
    steps: ['Redeem the coupon normally.', 'Fire concurrent requests into the gap between check and act.', 'Redeem more times than should be possible.'],
    notes: [
      { h: 'The window is between check and write', p: 'Every request reads "unused" before the first write lands. Both operations must be atomic, or the check means nothing.' },
      { h: 'Database transactions or locks are the fix', p: 'A conditional update that both checks and writes in one statement, or an explicit lock. Application-level checks around separate reads and writes will always have this gap.' },
    ],
    faq: [
      { q: 'What is a TOCTOU bug?', a: 'Time-of-check to time-of-use — the general name for this class. State changes between validating something and acting on it, so the validation no longer describes reality.' },
      { q: 'Where do race conditions show up in the real world?', a: 'Coupon and voucher redemption, account balance transfers, rate limits, invite codes, and anywhere a "one time only" rule is enforced by reading then writing.' },
    ],
    related: ['rate-limit-bypass', 'sqli', 'timingviz-tool', 'bola-bfla'],
  },
  webhookforge: {
    intent: 'hmac webhook signature verification bypass',
    intro: 'Forge an HMAC-signed webhook without knowing the secret, then switch verification on properly and watch the same request bounce. This is what a signature actually buys you, demonstrated in both directions.',
    steps: ['Send a webhook with verification disabled.', 'Observe what the receiver accepts.', 'Enable verification and watch the forged request fail.'],
    notes: [
      { h: 'Sign the raw body, verify before parsing', p: 'Computing the signature over a re-serialised object rather than the exact received bytes is a common and subtle break.' },
      { h: 'Compare signatures in constant time', p: 'A byte-by-byte early-exit comparison leaks the correct signature through timing. The Timing Attack Visualizer shows exactly how.' },
      { h: 'Include a timestamp', p: 'Without one, a captured valid request can be replayed forever. Reject signatures outside a short window.' },
    ],
    faq: [
      { q: 'Why do webhooks need signatures at all?', a: 'The endpoint is public, so anyone can post to it. A signature is the only way to know the request came from the service you expect and was not modified in transit.' },
      { q: 'Is HTTPS enough on its own?', a: 'No. TLS protects the request in transit from third parties; it says nothing about who sent it. Anyone can open their own TLS connection to your endpoint.' },
    ],
    related: ['timingviz-tool', 'jwt', 'oauthredirect', 'deserialization'],
  },
  oauthredirect: {
    intent: 'oauth redirect uri validation authorization code theft',
    intro: 'An authorisation server that validates redirect_uri loosely. Because the authorisation code is delivered to that URI, controlling it means receiving the code — and the code exchanges for a token.',
    steps: ['Walk through the normal authorisation flow.', 'Alter redirect_uri within what the loose validation allows.', 'Receive the authorisation code at your own endpoint.'],
    notes: [
      { h: 'redirect_uri must be matched exactly', p: 'Prefix and substring matching both fail — an attacker appends a path or a subdomain the check accepts. Exact string comparison against registered values is the only safe rule.' },
      { h: 'PKCE closes the interception window', p: 'It binds the code to a secret the requesting client generated, so a stolen code cannot be exchanged by anyone else.' },
      { h: 'state is for CSRF, not this', p: 'The state parameter prevents cross-site request forgery in the flow. It does not stop code theft via a bad redirect.' },
    ],
    faq: [
      { q: 'Why is exact matching required?', a: 'Because any flexibility becomes an attacker-controlled destination. Allowing subdomains means one XSS on any subdomain becomes account takeover across the whole platform.' },
      { q: 'What is PKCE?', a: 'Proof Key for Code Exchange. The client sends a hash of a random verifier when requesting the code and the verifier itself when exchanging it, so an intercepted code is useless alone. Now recommended for all client types.' },
    ],
    related: ['openredirect', 'jwt', 'webhookforge', 'csrf'],
  },
  vendortiering: {
    intent: 'third party vendor risk tiering criteria',
    intro: 'Six vendors with very different levels of access to your data. Tier them and decide who needs a full security review — because reviewing everyone equally means reviewing everyone badly.',
    steps: ['Review what data each vendor touches.', 'Assign a tier based on access and criticality.', 'Decide the depth of review each tier warrants.'],
    notes: [
      { h: 'Tier by data access and criticality', p: 'A vendor holding customer records is a different problem from one supplying office snacks. Spend the review budget accordingly.' },
      { h: 'Fourth parties count', p: 'Your vendor\'s vendors touch your data too. Concentration risk hides one layer down, where everyone turns out to depend on the same provider.' },
      { h: 'Onboarding is not the end', p: 'Access grows, products change, companies get acquired. Tiering needs periodic review or it describes a company that no longer exists.' },
    ],
    faq: [
      { q: 'What decides a vendor\'s tier?', a: 'Sensitivity of data accessed, whether they connect to your systems, how badly their outage hurts you, and any regulatory exposure their failure creates.' },
      { q: 'Is a SOC 2 report enough assurance?', a: 'It is evidence, not a verdict. Read the scope, the period covered, and especially the exceptions — a clean report on a narrow scope can say very little about what you care about.' },
    ],
    related: ['controlmapper-tool', 'riskregister-tool', 'irtabletop', 'sbomcheck-tool'],
  },
  irtabletop: {
    intent: 'ransomware incident response tabletop exercise',
    intro: 'A branching ransomware scenario where you make the containment and communication calls under time pressure. The technical decisions turn out to be the easy ones.',
    steps: ['Assess the initial report.', 'Make containment decisions and live with the consequences.', 'Handle communication — internal, customer, regulatory.'],
    notes: [
      { h: 'Containment destroys evidence', p: 'Pulling a machine off the network stops the spread and ends your ability to see what happened. Both matter; you have to choose knowingly.' },
      { h: 'Communication failures outlast technical ones', p: 'Organisations recover from the outage. They do not recover as easily from having misled customers or missed a notification deadline.' },
      { h: 'Decide the ransom position in advance', p: 'Mid-incident is the worst possible time to first consider it, and there may be sanctions implications that need legal input, not engineering input.' },
    ],
    faq: [
      { q: 'What is a tabletop exercise?', a: 'A discussion-based rehearsal where the team talks through a scenario and makes decisions without touching production. It finds gaps in process and authority cheaply.' },
      { q: 'Who should be in the room?', a: 'Not just security. Legal, communications, an executive who can authorise spending, and whoever actually owns the affected systems. Most gaps found are between teams, not inside them.' },
    ],
    related: ['loganalysis', 'slacalc-tool', 'vendortiering', 'riskregister-tool'],
  },
  passwordcrack: {
    intent: 'dictionary attack which passwords crack',
    intro: 'Four hashed passwords and one wordlist. Watch which fall immediately and which survive — and understand precisely why, because the reason is the whole of password security in one demonstration.',
    steps: ['Run the wordlist against the hashes.', 'See which crack and how fast.', 'Compare what survived against what did not.'],
    notes: [
      { h: 'Attackers guess, they do not reverse', p: 'Cracking is hashing candidate passwords and comparing. Speed comes from the algorithm, and the candidate list comes from every previous breach.' },
      { h: 'Rules multiply a wordlist', p: 'Mangling rules turn password into P@ssw0rd, Password1 and Password2024 automatically. Predictable substitutions cost an attacker nothing.' },
      { h: 'Slow hashes are the defence', p: 'bcrypt, scrypt and Argon2 are deliberately expensive. The same rig that tries billions of SHA-256 guesses per second manages thousands against bcrypt.' },
    ],
    faq: [
      { q: 'Why does a salt matter if it is stored alongside the hash?', a: 'A salt is not secret; it is unique. It stops one precomputed table cracking every user at once and forces the attacker to attack each password separately.' },
      { q: 'What makes a password survive this?', a: 'Not being in any wordlist and not being derivable by common rules. Length plus genuine unpredictability — which in practice means a password manager generated it.' },
    ],
    related: ['hashid-tool', 'passpolicy-tool', 'kerberoast', 'password-tool'],
  },
  clouddockersecrets: {
    intent: 'find hardcoded api key in git repository',
    intro: 'A public repository dump containing a hardcoded API key. Automated scanners find these within minutes of a push, and so do attackers — this lab is about learning to see what they see.',
    steps: ['Search the repository for credential patterns.', 'Find the hardcoded key.', 'Consider what it grants and what it would take to remediate.'],
    notes: [
      { h: 'Deleting the commit does not help', p: 'Once pushed, a secret is compromised. Git history, forks, caches and scrapers all retain it. Rotate the credential — that is the fix, and the only one.' },
      { h: 'The usual hiding places', p: '.env committed by accident, config files, test fixtures, CI definitions, and code comments. Also notebooks and Dockerfiles, which people forget are code.' },
      { h: 'Prevention beats detection', p: 'Pre-commit hooks and server-side secret scanning stop the push. Finding it afterwards means you are already rotating.' },
    ],
    faq: [
      { q: 'What should I do if I have committed a secret?', a: 'Rotate it immediately — before rewriting history, before anything else. Then purge it from history and check the provider\'s logs for use you did not authorise.' },
      { q: 'How do I keep secrets out of repositories?', a: 'Environment variables or a secrets manager, a .gitignore that covers .env from day one, pre-commit scanning, and push protection enabled on the hosting platform.' },
    ],
    related: ['codereview-tool', 'entropy-tool', 'iammisconfig', 'dockerescape'],
  },
};
