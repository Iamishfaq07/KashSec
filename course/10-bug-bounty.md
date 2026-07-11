# Path 10 — Bug Bounty

> **Level:** Intermediate → Advanced · **Lessons:** 8 · **Assumed knowledge:** Paths 01–09 (especially 07 and 09).

Everything you've learned so far can now be turned into something extraordinary: **finding real bugs in real companies' websites, legally, and getting paid for them.** This is bug bounty hunting. It's remote, flexible, open to anyone in the world, requires no degree, and the top hunters make more than most software engineers. It's also *hard* — most beginners give up in the first two months. This path gives you the mindset, the methodology, and the realistic expectations to actually stick with it.

Every technique here is done inside the strict *scope* of an authorised program. That's the whole game. **Out of scope = crime**, no matter how good the finding.

---

## Lesson 10.1 — What is a bug bounty and how does it work?

### Why this matters
Before you can succeed at bug bounties, you need to understand the ecosystem: who runs the programs, what the money actually is, and what "legal" means in this context. Getting this wrong is the fastest way to lose your account, your payout, or your freedom.

### The idea
A **bug bounty program** is a public (or private) invitation by a company: *"Come and try to hack our website(s). If you find a real security bug and report it responsibly, we'll pay you."* Rewards typically range from **$50 for a low-severity bug to $50,000+ for a critical one**. Some programs pay more; a handful pay less; a lot pay in "hall of fame" recognition rather than cash.

The company gets: continuous testing by thousands of independent researchers, at a fraction of the cost of a red team.
You get: legal permission to hack real systems, cash for real findings, and a portfolio that opens doors.

### The main platforms
Most programs live on a handful of platforms that handle triage, payment, and disputes:

- **HackerOne** (`hackerone.com`) — the largest. Many big-name programs. Good triage. Reputation-based invites to private programs.
- **Bugcrowd** (`bugcrowd.com`) — the other giant. Similar model.
- **Intigriti** (`intigriti.com`) — European favourite, growing fast, known for good triage.
- **YesWeHack** — European, strong government/enterprise presence.
- **HackenProof** — mostly Web3 / crypto programs.
- **Immunefi** — pure Web3, with some of the largest payouts in the industry ($50k–$10M).

Some companies (Google, Microsoft, Apple, Meta, GitHub) run **their own programs** off-platform. Once you're established, self-hosted programs often pay more.

### The three things you must read on every program
Before touching *any* target, read these carefully:

1. **Scope** — which assets you can test (specific domains, apps, mobile apps). Everything else is off-limits, even if it belongs to the same company.
2. **Out of scope** — often longer than the scope. Common off-limits things: DoS/DDoS, physical, social engineering, testing on real users, aggressive scanning.
3. **Rewards** — what pays what. Some programs cap severity, blacklist bug types, or exclude classes like self-XSS.

**Golden rule:** *if in doubt, ask.* Message the program before testing anything grey. Programs love thoughtful hunters.

### Responsible disclosure
Bug bounties follow **responsible disclosure**: you report the bug privately, the company fixes it, and *only then* (with permission) may you write publicly about it. Publishing without permission usually violates the program's rules and can get you banned across platforms.

### Realistic expectations (please read this)
Bug bounty is not passive income. The truth:

- **Most beginners find nothing** in their first 1–3 months. This is normal.
- **Most reports are duplicates or informational** early on. This is normal too.
- **Consistent hunters** (an hour or two a day for months) start seeing regular payouts.
- **Top hunters** (six figures a year) treat it as a full-time discipline for years, not a side hobby.

If you approach it as "learn deeply, keep records, iterate," you'll grow. If you approach it as "quick cash," you'll burn out fast.

### 🚩 Challenge
Which single document, on any bug bounty program, most determines what is legal for you to test?

<details><summary>Answer</summary>The scope (and the out-of-scope list). Anything outside it is not authorised, no matter how tempting.</details>

### Key terms
- **Bug bounty program** — an invitation to legally test and get paid for valid bugs.
- **Scope / out of scope** — what's allowed / forbidden.
- **HackerOne / Bugcrowd / Intigriti** — the biggest platforms.
- **Responsible disclosure** — private reporting; public only with permission.

### Recap
- Bug bounties = paid, legal hacking within a defined scope.
- HackerOne, Bugcrowd, and Intigriti are the biggest platforms; some big companies self-host.
- Always read scope, out-of-scope, and rewards before touching anything.
- Progress is slow at first — treat it as a discipline, not a lottery.

---

## Lesson 10.2 — Choosing programs & the beginner's strategy

### Why this matters
Choosing the *right* programs is at least half the battle. Beginners waste months on programs where they had almost no chance from day one. This lesson steers you towards where you can actually win.

### Two big axes: wide vs narrow scope, and old vs new programs

**Wide-scope programs** list many assets (`*.company.com`), including forgotten subdomains and acquisitions. Great for beginners because there's *more surface*, and less attention on the dusty corners.

**Narrow-scope programs** list one product with a small attack surface. Everyone tests them the same way; the easy bugs are gone. Better for experienced hunters who bring depth.

**Old programs** have been hunted for years; low-hanging bugs are extinct. **New programs** (recently launched, or newly public) still have easy wins. Watch for "new program" announcements on X/Twitter and platform newsletters.

**Beginner recipe: wide-scope + newer + fewer restrictions.**

### Where to start (realistic beginner options)
- **Public programs** on HackerOne, Bugcrowd, Intigriti with cash rewards and generous scope. Filter by "no bounty" *removed*.
- **VDPs (Vulnerability Disclosure Programs)** — no cash, but usually easier and give you real experience and a public profile. Great for your first submitted reports. Government sites often run these.
- **Bug bounty CTFs** and **live-hacking events** — hosted training/competitions. Excellent for learning.

Programs to avoid as a total beginner:
- **Google, Apple, Microsoft** — extremely hard, mature, and specialist. Come back in a year.
- **Anything with tiny scope + massive researcher volume** — you're competing against experts.

### Depth over breadth
The single best change most new hunters can make: **stop skimming, start committing.**

Instead of trying five programs a day, pick **one** wide-scope program and go deep for a month. Learn its infrastructure, its patterns, its subdomains, its authentication flow. This is where the *unique* bugs are — the ones nobody else found because they didn't stay long enough.

### The mindset
Most people never find a bug because they don't hunt long enough on any one target. If you spend two hours on a program, look at three subdomains, don't find anything obvious, and move on, you'll do that forever and find nothing. If you spend two weeks on one program, map every subdomain, understand every feature, you *will* find something eventually — because there's *always* something.

> 💡 **The 80/20 of bug bounty for beginners:** wide scope, older tech, less-loved parts of the app, and patience. That's it.

### 🚩 Challenge
Between a program with `*.company.com` and one with only `www.company.com`, which is friendlier to a beginner and why?

<details><summary>Answer</summary>The wide-scope one (`*.company.com`) — more surface means more forgotten corners where low-hanging bugs still live and less competition on each subdomain.</details>

### Key terms
- **Wide-scope / narrow-scope program** — many assets vs one.
- **VDP** — Vulnerability Disclosure Program; no cash but real practice.
- **Live-hacking event** — organised bug-hunting competition/training.

### Recap
- Pick wide-scope, newer programs with generous rules.
- Start with VDPs to build a public profile fast.
- Avoid the giants (Google/Apple/MS) as a total beginner.
- Depth beats breadth: one program for a month, not five in a day.

---

## Lesson 10.3 — The hunter's recon methodology

### Why this matters
Recon is even more important in bug bounty than in pentesting, because you're competing with thousands of others. The hunters who *see more* find more. This lesson turns your Path 09 recon into a repeatable pipeline you can automate.

### The five stages of bug-bounty recon
Every program you pick up should get this treatment before any testing:

1. **Asset discovery** — what does the company own?
2. **Subdomain enumeration** — every subdomain under each root domain.
3. **Live host / port / tech fingerprinting** — of every subdomain.
4. **URL and JS discovery** — every path, endpoint, and parameter.
5. **Content prioritisation** — pick the most interesting stuff to attack first.

### Stage 1 — Asset discovery
Sometimes the scope literally says `*.company.com`, sometimes it's the whole company including "acquisitions." To find all assets:

- **Whois** and **reverse whois** on the company's known domain.
- **Certificate transparency** (`crt.sh`) — all TLS certs ever issued reveal domain families.
- **ASN lookup** — an Autonomous System Number covers the company's IP ranges. Query on `bgp.he.net`.
- **Acquisitions** — Crunchbase and Wikipedia often list a company's purchases (each new acquisition is fresh surface).
- **Shodan** — search by the company's name, JARM hash, or SSL certificate subject.

### Stage 2 — Subdomain enumeration
The single highest-value recon activity for beginners. More subdomains = more bugs.

**Passive tools** (query public sources, don't touch the target):
```bash
subfinder -d target.com -all -silent > subs.txt
amass enum -passive -d target.com -o amass.txt
assetfinder --subs-only target.com >> subs.txt
sort -u subs.txt -o subs.txt        # de-duplicate
```

**Active tools** (query DNS directly — check scope allows it):
```bash
puredns bruteforce all.txt target.com -r resolvers.txt
```

**Alteration/permutation** (guessing variations like `dev-api`, `staging-2`, `test.api`):
```bash
gotator -sub subs.txt -perm perms.txt -depth 1 | puredns resolve -r resolvers.txt
```

Then combine everything and de-duplicate.

### Stage 3 — Alive, ports, tech
Filter to live hosts and fingerprint them:

```bash
cat subs.txt | httpx -silent -status-code -title -tech-detect -web-server > alive.txt
naabu -list alive.txt -top-ports 100 -silent > ports.txt
```

Look for **oddities** — a subdomain running an old CMS, an admin panel, an unexpected tech. Weird = interesting.

### Stage 4 — URLs, endpoints, JavaScript
The URLs, paths, and hidden endpoints are where most bugs actually live.

```bash
# Grab URLs from historical archives (Wayback, common crawl)
gau target.com | tee urls.txt
katana -u https://target.com -jc -d 5 > crawled.txt   # active crawler

# Find endpoints inside JavaScript files
cat urls.txt | grep '\.js$' | while read u; do
  curl -s "$u" | grep -Eo '(/[a-zA-Z0-9_-]+)+' >> js-endpoints.txt
done
sort -u js-endpoints.txt -o js-endpoints.txt
```

JS files leak *tons* of interesting stuff: hidden API paths, feature flags, sometimes even API keys. Tools like `linkfinder`, `secretfinder`, and `nuclei` templates for exposed secrets automate this.

### Stage 5 — Prioritise what to attack
You'll end with hundreds or thousands of URLs. Prioritise:

- **Authentication surfaces** — login, signup, password reset, MFA setup.
- **Money paths** — checkout, subscription, refunds, gift cards. Business-impact bugs pay big.
- **Admin panels** — even 403'd ones. Test for auth bypasses.
- **File uploads / image resizers / PDF generators** — SSRF, RCE, XSS gold.
- **URL parameters that look like references** (`id=`, `user=`, `next=`, `redirect=`) — IDOR, open redirect, SSRF.
- **APIs** — often less-loved than the UI, richer bugs.
- **Older subdomains** — different tech from the main site, often less-maintained.

### Automation is the multiplier
Package the whole pipeline as a script so you can point it at a new program and go make coffee. Public frameworks like **`reNgine`**, **`bbot`**, and **`reconftw`** wrap much of this into one command. Learn the tools individually first — the frameworks are only useful if you understand what they're doing.

### The scanning-vs-scope rule (please read)
Many programs **ban aggressive scanning**. Even when they don't, wisdom says: keep it polite. Passive recon is always fine. Active DNS enum is usually fine. High-rate port scans and brute-forcing directories should be *slow*. Getting IP-banned for hammering their infrastructure is embarrassing and can void your report.

### 🧪 Lab — Full recon on a legal target
Do the full pipeline against `hackerone.com/security` (their own bug bounty page) or a program you've legitimately signed up for. Follow every step:
1. Asset discovery.
2. Subdomain enum (passive first).
3. Live host + tech detection.
4. URL harvesting + JS analysis.
5. Prioritised list of the 10 most interesting things you found.

Write it up in your notes as a template you can reuse.

### 🚩 Challenge
Which two tools together give you a great starting subdomain list *without touching the target* directly?

<details><summary>Answer</summary>subfinder and amass (in passive mode) — both query public sources like certificate logs.</details>

### Key terms
- **Asset discovery / subdomain enum / URL discovery** — the three big recon buckets.
- **subfinder / amass / assetfinder / puredns / httpx / naabu / katana / gau** — pipeline tools.
- **linkfinder / secretfinder** — extract endpoints and secrets from JS.
- **reconftw / bbot / reNgine** — automation frameworks.

### Recap
- Recon is where bug bounty is won; more surface = more bugs.
- Pipeline: assets → subdomains → alive/tech → URLs/JS → prioritise.
- Scope always. Passive is safe; active is scoped and gentle.
- Automate the boring parts, but understand each tool.

---

## Lesson 10.4 — Writing reports that actually get paid

### Why this matters
Finding a bug is half the work. Writing a **clear report** is the other half. A great report gets paid quickly and often triaged as more severe than a bad report of the same bug. Reports are your *product*.

### What triagers see all day
Every day, program teams see hundreds of low-quality reports: vague, missing steps, wrong severity, exaggerated impact, or no impact explained. A clean, focused report stands out immediately and earns you a reputation as a trustworthy hunter. Reputation opens doors: invitations to private programs, faster triage, higher payouts.

### The universal structure
Use the same template every time:

```markdown
### Title
Concise, technical, and location-specific.
Good: "Stored XSS on /profile/bio via `bio` parameter"
Bad: "XSS Vulnerability" or "URGENT critical bug!!!"

### Summary
One paragraph, plain: what the bug is, where it is.

### Steps to Reproduce
1. Log in to https://target.com as user A.
2. Go to https://target.com/profile.
3. In the "Bio" field, enter: `<img src=x onerror=alert(document.domain)>`
4. Click Save.
5. Log out. Log in as user B. Visit user A's profile.
6. Observe the JavaScript alert executing in user B's browser.

### Impact
An attacker can execute arbitrary JavaScript in any user's browser
who views the attacker's profile. This allows:
- Session cookie theft → account takeover (if HttpOnly is absent).
- Forced actions as the victim (change email, exfiltrate data).
- Persistence: the payload runs for every viewer forever.

### Proof of Concept
[Attach a screenshot of the alert popping up as user B]

### Suggested Remediation
Encode user-supplied HTML on output. Use a well-tested library
(DOMPurify or the framework's built-in escaping). Add a strict
Content Security Policy that blocks inline scripts.

### References
- OWASP: XSS Prevention Cheat Sheet
- CWE-79
```

### The rules of great reports
- **Reproduction steps are king.** If a triager can't reproduce in 60 seconds, they close it. Every step, every URL, exact copy-pasteable payloads.
- **Impact must be believable.** "This is a critical bug" isn't impact. "*This lets any attacker take over any user's account by having them click a link*" is impact.
- **One bug per report.** Don't stuff five findings into one report. Split them; you'll be paid more.
- **Attach a video for complex bugs.** A 30-second screen recording removes all ambiguity.
- **Redact real data.** Even in your PoC, use test accounts and blur anything sensitive.
- **Don't oversell.** If a bug is medium, call it medium. Overclaiming burns your reputation.

### Severity and CVSS
Use CVSS v3.1 or v4 (from Path 09). Most platforms have a built-in calculator. If you're not sure, be conservative — the triager may adjust *up*, which is fine. What kills you is overclaiming and being adjusted *down* repeatedly.

### The "impact ladder"
For every finding, ask yourself: *how far can I take this?* Each rung on the ladder tends to raise the payout:

1. **The bug exists** — proof-of-concept only.
2. **You can affect yourself** — self-XSS, self-IDOR. Often out of scope.
3. **You can affect one other user with interaction** — reflected XSS via a link they click.
4. **You can affect any user, no interaction** — stored XSS, IDOR reading anyone's data.
5. **You can affect the company itself** — admin takeover, RCE, database read.

Chain findings when you can. IDOR that leaks emails → password reset flow abuse → account takeover is one *report*, not three.

### 🧪 Lab — Report an old finding
Take a bug you found in a PortSwigger lab from Path 07. Write it up as if it were a real bug bounty report, using the template above. Ask a friend to read the steps and tell you if they could reproduce. If not, sharpen the steps and try again.

### 🚩 Challenge
A vague, low-quality report will often be closed. What's the *single* section a triager depends on most to accept or reject?

<details><summary>Answer</summary>The Steps to Reproduce — if they can't reproduce in a minute or two, the report gets closed as "not reproducible."</details>

### Key terms
- **Triager** — the program team member reviewing your report.
- **PoC (Proof of Concept)** — the demonstration payload.
- **Impact ladder** — how far you can escalate the bug's real-world effect.

### Recap
- The report is your product; format it professionally every time.
- Reproduction steps decide most bugs' fate — write them like a recipe.
- Impact must be concrete and believable; don't oversell.
- Chain findings to maximise impact and payout.

---

## Lesson 10.5 — Hunting IDOR & broken access control (the beginner's goldmine)

### Why this matters
Broken access control (from Path 07) is the OWASP #1 for a reason: it's *everywhere*, especially in APIs. It's also one of the friendliest classes for beginners because it needs almost no exotic payload — just two accounts and patience.

### The mindset
Every time you see an ID, ask: *what happens if I change it?* Every time you see a role or permission, ask: *what happens if I try what I shouldn't be allowed to?*

Access control lives in the *server*. The client (browser) knows what buttons to show, but the server decides what actions are allowed. Bugs happen when the server assumes the client will behave.

### The two-account method (do this on every program)
1. Sign up as **User A** (your primary) and **User B** (your secondary).
2. As A, do everything you can — create resources, upload files, set preferences. Note every ID that appears in URLs, API responses, or Burp.
3. Log in as B (a separate browser profile is cleanest).
4. Try to access, modify, or delete A's resources by ID.

That's it. This one workflow, done thoroughly, finds a ridiculous number of bugs.

### Places to look
- **Direct object IDs in URLs**: `/orders/1042` → try 1041, 1043.
- **API endpoints**: `/api/v1/users/1042/settings` → `/api/v1/users/1043/settings`.
- **Nested IDs**: `/orgs/5/projects/12/tasks/88`. Change each independently.
- **UUIDs and long tokens** — feel unguessable, but check whether they leak elsewhere (in emails, other endpoints, cache headers, referrer, PDFs).
- **POST bodies** — hidden fields the app *sends back* to the server. If the app sends `user_id=42`, try `user_id=43`.
- **HTTP method swap** — the UI blocks `DELETE`, but the server may accept it. Try `PUT`, `PATCH`, `DELETE`, `HEAD`.
- **Different roles** — a normal user calling an admin endpoint. `/api/admin/users/delete/42` from a non-admin? Try it.
- **Older API versions** — `/api/v1/` may still exist with old, weaker auth even after `/api/v3/` shipped.

### Common bypasses
When the app *tries* to check but does it poorly:
- **JSON injection into role fields**: sending `{"role":"user","role":"admin"}` — some parsers keep the last.
- **Path traversal in IDs**: `/user/42/../43` sometimes reaches 43.
- **Wildcards or SQL-like values**: `%`, `*`, `null`, `0`, `-1`.
- **Header tricks**: `X-User-ID: 43`, `X-Forwarded-For: 127.0.0.1` (bypassing admin-panel IP checks).

### Escalating IDOR to real impact
Not all IDORs are equal. Reading someone's public-ish profile isn't the same as reading their password reset token. Try to escalate:

- IDOR to read email + IDOR to trigger password reset = account takeover.
- IDOR on `PATCH /users/{id}` that lets you change *anyone's* email = full ATO.
- IDOR reading everyone's invoices = mass PII leak (GDPR territory — big payout).

The higher up the ladder, the more you're paid.

### 🚩 Challenge
You find that changing `id=1042` to `id=1043` on `/api/orders/1042` returns another user's order. What single follow-up experiment turns this from a "read someone else's order" bug into potentially catastrophic?

<details><summary>Answer</summary>Try to modify or delete order 1043 (using PUT / PATCH / DELETE). If the server accepts, you have full CRUD access to any user's orders — a much bigger, higher-paying finding.</details>

### Key terms
- **Broken access control** — server not enforcing "should this user do this?"
- **IDOR** — Insecure Direct Object Reference; a common flavour.
- **Two-account method** — the standard technique for testing access control.
- **Vertical vs horizontal privesc** — reaching other users' data vs reaching admin actions.

### Recap
- Access control bugs are OWASP #1 and the friendliest for beginners.
- Use two accounts, systematically swap IDs and try forbidden actions.
- Look in URLs, APIs, POST bodies, method swaps, old API versions.
- Escalate to the highest realistic impact — the payout tracks with that.

---

## Lesson 10.6 — Business logic bugs & vulnerability chaining

### Why this matters
The classic bugs (XSS, SQLi, IDOR) are heavily hunted. **Business logic bugs** and **chained vulnerabilities** are where the interesting money hides now — because they need creativity, not just tools. This is where good hunters separate themselves.

### What business logic bugs are
Business logic bugs aren't about breaking a technical control — they're about **using features the way they were built, but in an unexpected order or state**, to get an outcome the designer didn't intend.

Classic examples:
- **Race conditions on gift cards.** You have a $10 gift card. You send 30 redeem requests simultaneously. The server checks the balance for each, sees it's $10, and applies each — you now have $300 of credit.
- **Price manipulation in the client.** The app sends `price=50` from the browser. Change it to `price=1`. If the server trusts it, you buy for a dollar.
- **Quantity overflow.** Buy `-1` of an item — the server *credits* you, adding to your balance instead of debiting.
- **Two-factor bypass.** After password step, before OTP step, the app also lets you `POST /account` — which the server accepts without checking that 2FA was completed.
- **Discount stacking** — apply the same coupon three times.
- **Reward abuse** — refer yourself with a second account.

None of these require exotic payloads. They require asking: *what's the intended flow, and what happens if I do the steps in a different order, or with different values?*

### Vulnerability chaining
A **chain** is where a series of *individually small* bugs together create a big impact. The whole is worth far more than the sum.

Classic chain: **open redirect + XSS + session token in URL = account takeover.** Individually each may be low-severity; together they're critical.

Another: **subdomain takeover → cookie scope → SSO bypass → admin access.** Four small things = full compromise.

Every time you find something small, ask: *what could I combine this with?*

### Race conditions specifically
Modern web apps often have subtle race conditions worth hunting for:
- **Duplicate resource creation** — invite the same user twice at the same instant.
- **Balance checks** — send N simultaneous purchase requests.
- **Rate-limit bypasses** — send 50 login attempts simultaneously through HTTP/2 multiplexing.

Burp Suite's **Repeater** now has a "send in parallel" (single-packet attack) feature specifically for this class. **PortSwigger has excellent labs on race conditions** — do them.

### GraphQL, OAuth, and SSO — modern hunting grounds
These modern technologies bring their own classes of bugs:

- **GraphQL** — introspection queries, batching abuse, and IDOR through query fields nested in ways the developer forgot to authorise.
- **OAuth / OIDC** — misconfigured `redirect_uri`, weak `state` parameter, misuse of implicit flow. Excellent research areas.
- **SAML** — signature stripping, XML external entity (XXE) in SAML responses. Deep and lucrative.

Great write-ups exist on all three — search HackerOne Hacktivity and Bug Bounty Reports Explained (YouTube).

### 🚩 Challenge
You find a gift card system that lets you *submit* multiple redeem requests before the server updates the balance, ending up with more credit than you started with. What class of bug is this?

<details><summary>Answer</summary>A race condition — specifically a "time-of-check to time-of-use" (TOCTOU) issue.</details>

### Key terms
- **Business logic bug** — abusing intended features in unintended ways.
- **Chain** — combining small bugs into a bigger impact.
- **Race condition / TOCTOU** — timing bugs from parallel requests.
- **GraphQL / OAuth / SAML** — modern rich attack surfaces.

### Recap
- Business logic bugs use features unexpectedly rather than breaking controls.
- Chaining small bugs multiplies severity; think "what could this combine with?"
- Race conditions are widespread and toolable (Burp's single-packet attack).
- GraphQL, OAuth, and SAML are modern hunting grounds worth studying.

---

## Lesson 10.7 — Advanced recon, automation & nuclei

### Why this matters
As you level up, you'll want to **hunt while you sleep**. Automation lets one hunter cover thousands of assets with continuous monitoring and templated detection. This lesson introduces the tools that turn recon from a one-off into an ongoing pipeline.

### Continuous monitoring
Programs *change*. New subdomains appear weekly, features ship daily, old ones die. Hunters who *notice* changes first often find the fresh bugs.

Simple continuous monitoring:
```bash
# Nightly cron: enumerate subdomains and diff against yesterday
subfinder -d target.com -silent > today.txt
diff yesterday.txt today.txt > new.txt
# Alert yourself (Discord/Slack webhook) if new.txt is non-empty
mv today.txt yesterday.txt
```

Now, any new subdomain the moment it appears — you get pinged. That's a real edge.

Add:
- **HTTP status change monitoring** — a 404 becoming a 200 = new feature.
- **JavaScript file monitoring** — new endpoints appearing in JS = new attack surface.
- **Certificate transparency real-time feed** (via `certstream`) — brand new subdomains as certs are issued.

### `nuclei` — templated vulnerability detection
**`nuclei`** (by ProjectDiscovery) is a fast, template-driven scanner. Community templates cover thousands of known CVEs, misconfigurations, and exposures:

```bash
nuclei -u https://target.com -t ~/nuclei-templates/ -severity critical,high
cat alive.txt | nuclei -t ~/nuclei-templates/exposures/
cat alive.txt | nuclei -t ~/nuclei-templates/technologies/  # tech fingerprint
```

You can also write your **own templates** to detect a specific vulnerability across your entire scope in seconds. When you've found one instance of a bug on one subdomain, a nuclei template is how you find every other instance across the program.

Templates you'll appreciate:
- **exposures** — leaked `.env`, `.git`, `swagger.json`, Firebase configs.
- **misconfiguration** — open S3 buckets, CORS misconfigurations, exposed dashboards.
- **cves** — known-CVE fingerprints across services.

### Automation frameworks
Once you're comfortable with individual tools, packaging them saves hours:
- **`reconftw`** — a comprehensive shell-based recon and scanning pipeline.
- **`bbot`** — modular OSINT + web + cloud recon; Python.
- **`reNgine`** — a web UI for continuous recon on many targets.

Learn the primitives first (subfinder, httpx, ffuf, nuclei) — frameworks are only useful when you understand what they do underneath.

### Wordlists — the hunter's crown jewels
Wordlists power directory brute-forcing, subdomain permutations, and fuzzing. Good sources:
- **`SecLists`** (`github.com/danielmiessler/SecLists`) — the canonical collection.
- **`OneListForAll`** — huge combined wordlists.
- **Custom lists** — extract words from a target's own JS, docs, and old sitemaps. These "custom" lists find bugs that generic wordlists miss.

### The ethical side of automation
- **Scope every tool** — don't fire nuclei at anything not in scope.
- **Rate-limit** — high concurrency can DoS a service and get you banned.
- **Duplicate management** — with automation you'll find many minor issues; keep good records so you don't spam programs with dupes.

### 🧪 Lab — Build a monitoring script
Write a shell script that:
1. Runs `subfinder` on your target.
2. Compares against the last run.
3. Runs `httpx` on any *new* subdomains.
4. Prints a summary you can eyeball daily.

Later, add nuclei on the new hosts. This is your bug bounty edge.

### 🚩 Challenge
Which single tool from ProjectDiscovery lets you write a template once and detect that specific vulnerability across your entire scope in seconds?

<details><summary>Answer</summary>nuclei.</details>

### Key terms
- **Continuous monitoring** — automated re-checks over time, alerting on change.
- **`nuclei`** — template-driven scanner.
- **SecLists** — canonical wordlist collection.
- **`reconftw` / `bbot` / `reNgine`** — automation frameworks.

### Recap
- Automation gives you scale — thousands of assets, continuous monitoring, templated detection.
- `nuclei` is the templated scanner every serious hunter uses.
- Diff-based monitoring on subdomains, HTTP status, and JS is your edge.
- Rate-limit and stay in scope; automation multiplies both value *and* risk.

---

## Lesson 10.8 — The bug bounty career: economics, communities & staying sane

### Why this matters
Bug bounty is a *career shape* as much as it's a skill. Understanding the economics and the community protects you from the pitfalls that burn most hunters out.

### The realistic economics
Some public data on payout distribution is grim but honest:

- **The top 1% of hunters make >90% of the money.** This is normal for any creative field (writing, YouTube, etc.).
- **The median public HackerOne report pays around $500** — but most hunters don't consistently find valid reports at all.
- **Consistent six-figure hunters** exist in the low thousands globally; they treat it as a full-time discipline.
- **Duplicates** — you'll get a lot of these early on. Sometimes you'll do great work only to find it was already reported. That's the game.

**The good news:** the *skill* you build is enormously valuable even if you never make a fortune on bounties. Every serious offensive-security job wants people who can do this work. Bug bounty is a fantastic *portfolio*.

### The community
Bug bounty has one of the most generous, sharing communities in tech:
- **HackerOne Hacktivity** (`hackerone.com/hacktivity`) — publicly disclosed reports. Read one every day.
- **NahamSec, InsiderPhD, John Hammond, TCM Security, Bug Bounty Reports Explained** on YouTube — free education, from beginner to advanced.
- **Twitter/X `#bugbountytips`** — daily nuggets from top hunters.
- **Bug Bounty Village** at DEF CON — annual events with talks and workshops.
- **Discord communities** for platforms (HackerOne's, Bugcrowd's, Intigriti's) — where beginners get help.

Give as well as take. Write up your findings (with permission) once fixed — you'll learn tenfold from the process, and the community will notice.

### Staying sane and avoiding burnout
Bug bounty burnout is real. Guard against it:

- **Time-box your sessions.** Set a start and stop time. Bug bounty is infinite; your energy isn't.
- **Take real breaks.** A day or a week off restores creativity better than grinding does.
- **Don't attach your identity to a single report.** Duplicates and closures happen; they're not about you.
- **Diversify.** Do CTFs, learn adjacent skills, or work on defence sometimes. Fresh angles find fresh bugs.
- **Have a life outside.** The hunters who last are the ones who don't hunt every waking hour.

### The tax and legal side
Different jurisdictions treat bounty income differently — it may be self-employment income, hobby income, or a gift. **Talk to a local accountant** before it becomes a problem. Some platforms handle payouts through PayPal, some through wire transfer, some through crypto for Web3 programs. Keep records of everything for tax time.

### Your first-year plan
A concrete 12-month plan for a beginner starting *now*:

- **Months 1–2:** finish PortSwigger's apprentice labs. Get your Burp fluency to muscle-memory. Sign up on HackerOne, Bugcrowd, Intigriti.
- **Months 3–4:** pick one wide-scope VDP (no cash but easier). Focus. Submit your first two reports of any severity. Get comfortable with the process.
- **Months 5–7:** move to public cash programs. Aim for your first *paid* bug. Continue writing up every finding. Follow ten great hunters on X.
- **Months 8–10:** double down on one program you now know intimately. Chase business logic and chained bugs.
- **Months 11–12:** consider private program invites you'll now be receiving. Attend one live-hacking event or online CTF. Write a blog post on something you learned.

Nothing about this year is glamorous. Everything about it is how real hunters actually grow.

### Where next in the course
- **Path 11 — Advanced Topics:** privesc, Active Directory, cloud, malware analysis, forensics. Skills that make you valuable in serious engagements.
- **Path 12 — AI & AI Security** (coming soon) — the emerging frontier and a huge hunting ground of tomorrow.

### 🚩 Challenge
What's the single most important discipline to avoid bug bounty burnout, according to this lesson?

<details><summary>Answer</summary>Time-boxing your sessions — set a stop time and stick to it. Bug bounty is infinite; your energy isn't.</details>

### Key terms
- **Public / private programs** — open to all / by invitation.
- **Hacktivity** — HackerOne's public feed of disclosed reports.
- **Duplicate ("dupe")** — someone else reported it first; you don't get paid.
- **Live-hacking event** — invite-only intensive hunt with cash prizes.

### Recap
- The economics are power-law: most money goes to the top few percent — but the skill you build is broadly valuable.
- The community is exceptionally generous; use it and give back.
- Guard against burnout with time-boxing, breaks, and life outside hacking.
- Sort out tax and payment logistics before your first big payout.

---

## You've finished Path 10 🎉

You now know the entire arc: platforms and programs, choosing wisely, recon that gives you an edge, reports that get paid, hunting IDOR and business logic, automation with nuclei, and how to sustain a bug bounty career without burning out. The rest is *reps* — hours in the tools, on real programs.

**Next up → `11-advanced.md`:** the advanced topics that make you valuable on real engagements — **privilege escalation** (Linux and Windows), **Active Directory attacks**, **cloud security** (AWS, Azure, GCP), **malware analysis basics**, and **digital forensics & incident response**. These are the areas where six-figure careers live.
