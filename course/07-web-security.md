# Path 07 — Web Security & Hacking

> **Level:** Intermediate · **Lessons:** 9 · **Assumed knowledge:** Paths 01–06 (especially 05 and the ethics from 01).

This is the path most people join a security course for. You now understand networks, Linux, Python, how the web works, and the core security vocabulary. It's time to find real weaknesses. In this path we'll walk through the famous **OWASP Top 10** in plain English, then take a properly hands-on look at the four vulnerabilities every web hacker learns first: **XSS, SQL injection, IDOR, and Command Injection**. You'll also meet **Burp Suite**, the professional's web-testing tool, and understand where **SSRF** and **file upload** flaws fit in.

Every hands-on activity here uses free, legal practice sites — mainly [PortSwigger's Web Security Academy](https://portswigger.net/web-security), which is superb and free. The golden rule from Path 01 still applies to every single lesson: **only touch what you own or are allowed to test.**

---

## Lesson 7.1 — The OWASP Top 10 in plain English

### Why this matters
The **OWASP Top 10** is the industry's shared checklist of the most common and impactful web weaknesses. Every web hacker, developer, and security engineer knows it. Learn it once and you'll have a mental *map* of where bugs live — everything else in this path fits into it.

### Who is OWASP?
**OWASP** is the *Open Worldwide Application Security Project* — a community of volunteers publishing free resources on web security. Their most famous output is the **Top 10**, refreshed every few years. We'll use the 2021 list (the current major version).

### The list in everyday words
Read this list once. You don't need to memorise it — the goal is *recognition*.

1. **Broken Access Control** — you can reach or do things you shouldn't. The single biggest category. (We'll attack this via IDOR.)
2. **Cryptographic Failures** — secrets stored or sent unsafely (plain HTTP, MD5 passwords, hard-coded keys).
3. **Injection** — sneaking commands into input boxes. Includes SQL injection, XSS, command injection.
4. **Insecure Design** — the app was designed unsafely from the start (no rate limits on login, no MFA, price sent from the client).
5. **Security Misconfiguration** — default passwords, verbose errors leaking internals, unnecessary features on, open cloud buckets.
6. **Vulnerable & Outdated Components** — using old libraries with known CVEs. Most apps are mostly other people's code.
7. **Identification & Authentication Failures** — weak login: no lockout, guessable passwords allowed, broken session handling.
8. **Software & Data Integrity Failures** — trusting code or data that wasn't verified (insecure deserialization, unsigned updates, compromised dependencies — the "supply chain" issue).
9. **Security Logging & Monitoring Failures** — if you can't see the attack, you can't stop it. Missing logs and alerts.
10. **Server-Side Request Forgery (SSRF)** — tricking the server into fetching things it shouldn't, often to reach internal services or cloud metadata.

### How the Top 10 relates to what you already know
This is where Path 05's client/server picture pays off. Almost every item is really about **the server trusting something it shouldn't**:

- Access Control → the server not checking whether *this* user should reach *that* data.
- Injection → the server treating your input as code instead of data.
- Auth Failures → the server accepting a weak or hijacked identity.
- SSRF → the server acting on a URL you gave it without checking.

Once you see the pattern, every future bug you meet slots naturally into this map.

### 🚩 Challenge
Which category of the OWASP Top 10 is currently #1 — and what does it mean in one line?

<details><summary>Answer</summary>Broken Access Control — users being able to reach or do things they shouldn't (like viewing another user's data).</details>

### Key terms
- **OWASP** — the community behind the Top 10 and much of web security.
- **OWASP Top 10** — the industry's shared list of top web risks.

### Recap
- The OWASP Top 10 is the map of common web weaknesses every professional knows.
- Access Control (#1) and Injection (#3) are the biggest for beginners to master.
- Most items are versions of "the server trusted the client when it shouldn't."

---

## Lesson 7.2 — Setting up your testing tools (Burp Suite & PortSwigger Academy)

### Why this matters
Real web hacking uses two things: a **testing proxy** (Burp Suite is the standard) and a **safe practice ground** (PortSwigger's free Web Security Academy). Setting both up is a rite of passage — you'll use them for the rest of your career.

### What is Burp Suite?
**Burp Suite** is a tool that sits between your browser and the target site so you can **see, pause, and modify** every request before it goes out, and every response before your browser renders it. Think of it as a control tower over your web traffic. The free **Community Edition** is enough for everything a beginner needs.

Kali already has Burp installed. Just search for it in the applications menu, or run `burpsuite` in the terminal.

### A tour of the two Burp features you'll use daily
- **Proxy** — the man-in-the-middle between browser and site.
  - **Intercept** — pause requests so you can edit them before they're sent.
  - **HTTP history** — a log of every request, replayable and searchable.
- **Repeater** — take any past request, tweak it, and send it again — as many times as you want. This is where most manual testing happens.

Other tabs (Intruder, Decoder, Sequencer) will come later; for now, Proxy + Repeater is 90% of your work.

### 🧪 Lab — Get set up (do this once)
1. **Open Burp** in Kali. Accept the defaults for a new project.
2. **Launch Burp's built-in browser** (Proxy → Intercept → Open Browser). This browser is already pre-configured to route through Burp — no manual proxy setup or certificate installation needed. (You can also configure your own browser, but the built-in one is friction-free.)
3. In the Burp browser, visit **`https://portswigger.net/web-security`** and create a free account.
4. Back in Burp, click **Proxy → HTTP history** and browse a normal site in the Burp browser. Watch requests appear in the history — this is your live x-ray.
5. Right-click any request → **Send to Repeater**. Switch to the **Repeater** tab and click **Send**. You've just replayed a request. Now change one small thing (a parameter value) and send again. Notice how the response changes. This is the core loop of manual web testing.

> 💡 The "browse → find an interesting request → send to Repeater → tweak and re-send" workflow is the muscle memory of every web tester. Practise it until it's automatic.

### 🚩 Challenge
Which Burp tab lets you take a captured request, modify it, and resend it as many times as you want?

<details><summary>Answer</summary>Repeater.</details>

### Key terms
- **Burp Suite** — the industry-standard web testing proxy.
- **Proxy** — sits between you and the site to inspect/modify traffic.
- **Intercept / HTTP history / Repeater** — pause requests / see them all / replay and modify.
- **PortSwigger Web Security Academy** — free, world-class practice labs.

### Recap
- Burp Suite (Community Edition, on Kali) is your testing proxy.
- Use its built-in browser for zero-friction setup.
- Repeater is where you tweak and resend requests — the core testing loop.
- PortSwigger's free Academy is where you'll practise every vulnerability from here on.

---

## Lesson 7.3 — Reconnaissance for web hackers

### Why this matters
Before finding bugs, you find *the surface* — every page, parameter, subdomain, and endpoint an app exposes. Poor recon means missed bugs. Even a quick tour of the target reveals attackable places others overlook.

### What to look for
When you're allowed to test a target (a lab, your own app, or an in-scope bug bounty program), gather the map first:

- **All subdomains** — `www.target.com` isn't the whole company. `dev.target.com`, `staging.target.com`, `old.target.com` are gold: less-loved, often less-patched.
- **All URLs and paths** — every page, every API endpoint. Directory brute-forcing (a wordlist tester like `gobuster` or `ffuf`) uncovers hidden `/admin`, `/backup`, `/api/v1/`.
- **All parameters** — every input the app takes. These are the injection surfaces.
- **The tech stack** — what language and framework it runs on. Older stacks may have known CVEs.
- **JavaScript files** — the client's JavaScript often leaks hidden API endpoints and even secrets. Scanning JS with tools like `linkfinder` reveals a wider attack surface than the UI shows.

### Gentle command-line recon (on a legal target)
```bash
# Passive: find subdomains from public sources
subfinder -d example.com -silent > subs.txt

# Active (only if in scope): check which are alive and what they run
cat subs.txt | httpx -silent -status-code -title -tech-detect

# Hidden paths on a single host
ffuf -u https://target.example.com/FUZZ -w /usr/share/wordlists/common.txt -mc 200,301,403
```

`ffuf` substitutes each word from a wordlist into `FUZZ` and reports interesting status codes. A `403 Forbidden` on `/admin` is not a wall — it's a *signpost* that something is there.

> ⚠️ **Scope, scope, scope.** On a bug bounty program, aggressive scanning is often explicitly banned. Read the rules of every program before scanning. On practice labs like PortSwigger, everything is allowed.

### The mindset
Great hunters go *wide* first. Don't dive at the login page everyone else attacks — explore every subdomain, every dusty corner. A forgotten `dev.target.com` running old software is a classic beginner-friendly find.

### 🚩 Challenge
Why is a `403 Forbidden` response during directory brute-forcing *interesting* rather than "closed"?

<details><summary>Answer</summary>It means something exists at that path — the server knows about it but denies access. That's a signpost worth investigating further.</details>

### Key terms
- **Subdomain** — `x.target.com`; often a soft target.
- **Directory brute-forcing** — trying a wordlist of paths to find hidden ones.
- **subfinder / httpx / ffuf** — recon tools you'll use often.

### Recap
- Recon first: subdomains, paths, parameters, tech, JavaScript.
- `subfinder` + `httpx` + `ffuf` is a great starter pipeline.
- Wide beats deep for beginners — forgotten assets hold easy wins.
- Always check the scope; some programs ban scanning.

---

## Lesson 7.4 — Broken Access Control & IDOR

### Why this matters
Access Control is #1 on the OWASP Top 10 for a reason. Its most beginner-friendly form is **IDOR** (Insecure Direct Object Reference) — a bug so simple ("change the number") that many find their first real vulnerability here.

### The core idea
Broken Access Control is when a site fails to check *whether you're allowed* to do or see something. The server hands over the goods without asking "is this really your data?" IDOR is one specific flavour: you can access someone else's stuff by changing an **identifier** in the URL or request.

### The invoice example
Say your invoice page uses this URL:

```
https://shop.example.com/invoice?id=1001
```

What happens if you change it to `id=1002`? If the site doesn't verify that invoice `1002` actually belongs to *you*, it happily returns a stranger's invoice. That's IDOR. Now scale it: `id=1003`, `1004`, `1005`... you could iterate through everyone's invoices. That's Broken Access Control in one paragraph.

### Where else it hides
IDOR isn't just about numbers in URLs. Look for any place a request references a resource by ID:

- **API endpoints** — `/api/user/1001/profile` → change to `1002`.
- **POST parameters** — form fields with hidden IDs.
- **UUIDs and tokens** — long random-looking IDs feel unguessable, but if any leak (in another response, an email, a support ticket), they can still be used.
- **Different HTTP verbs** — the app blocks `DELETE /post/1002` in the UI but the server still honours it if you send the request directly.
- **Vertical privesc** — normal user calling admin-only endpoints (`/api/admin/deleteUser`).

### The testing method
Effective IDOR testing needs **two accounts**:

1. Register two users, A and B.
2. As A, do actions and note the IDs the app uses (invoice IDs, post IDs, message IDs).
3. Log in as B. Try to access A's resources by ID.
4. If B can read, modify, or delete A's data — that's a bug.
5. Escalate: an IDOR that *changes* another user's email is account takeover. Always try to demonstrate the highest realistic impact.

### 🧪 Lab — Your first real IDOR
1. On PortSwigger Academy, open the **Access control vulnerabilities** category.
2. Do the apprentice lab: **"User ID controlled by request parameter"**.
3. Follow the guided steps — you'll swap a `userId` parameter and access another user's account.
4. Repeat with the next apprentice-level access-control labs. The muscle memory here pays off constantly.

### The fix (to advise defenders)
Enforce authorisation *server-side*, on **every request**, based on the logged-in user's identity — not on client-supplied IDs. And deny by default: assume nothing is allowed unless explicitly permitted.

### 🚩 Challenge
A support portal lets you view your ticket at `/ticket?id=442`. What's the very first thing an ethical tester tries on their own account?

<details><summary>Answer</summary>Change the id to a nearby value (e.g., 441 or 443) and see whether they get someone else's ticket. If yes, it's IDOR.</details>

### Key terms
- **Broken Access Control** — server fails to check "should this user have this?"
- **IDOR** — Insecure Direct Object Reference; changing an ID to access another's data.
- **Horizontal / vertical privesc** — reaching another user's data / reaching admin-only actions.

### Recap
- Access control is #1 on the OWASP Top 10; IDOR is its friendly first flavour.
- Test with two accounts: swap IDs and see if the server hands over B's data to A.
- Look everywhere IDs live — URLs, APIs, POST bodies, headers.
- The fix is server-side authorisation on every request.

---

## Lesson 7.5 — Cross-Site Scripting (XSS)

### Why this matters
XSS is the most-reported web vulnerability class, and once you truly *see* it, the concept clicks and a big chunk of the field opens up. XSS is also the classic path to session cookie theft and account takeover.

### The core idea
Remember from Path 05: JavaScript runs in the visitor's browser and can do a lot. **XSS happens when a website reflects your input into the page without cleaning it — so if your input includes JavaScript, the browser runs it as code instead of showing it as text.** Your JavaScript then runs in the browser of anyone who views the page.

### The three flavours of XSS

- **Reflected XSS** — Your payload is in the request (e.g., a URL parameter) and is *reflected* straight back in the response. Needs the victim to click a crafted link. Example: `search?q=<script>alert(1)</script>` and the response contains `You searched for <script>alert(1)</script>`.
- **Stored XSS** — Your payload is *saved* on the server (in a comment, profile bio, product review) and served to everyone who views that page. Most dangerous — one payload, many victims, no click needed.
- **DOM-based XSS** — The flaw is entirely in *client-side JavaScript* that writes untrusted data into the page (e.g., `document.getElementById("out").innerHTML = location.hash`). The server may never see the payload.

### The minimal proof-of-concept
```
<script>alert(document.domain)</script>
```

If pasting this into a search or comment box makes an alert pop up showing the site's domain, the page treated your text as code — that's XSS.

We use `alert(document.domain)` because it:
1. **Proves execution** — an alert only fires if code ran.
2. **Shows the domain** — proving the code ran in the target site's context, not somewhere else.
3. **Is harmless** — no data stolen, no user harmed.

> ⚠️ **Ethics rule:** always prove XSS with harmless payloads like `alert(document.domain)`. Never actually steal session cookies from real users — that turns a reportable bug into a crime.

### Real impact
`alert(1)` is just proof. In a real bug, the same execution point can:
- Steal session cookies (if not `HttpOnly`) — account takeover.
- Change what the user sees on the page.
- Make requests as the victim (change email, transfer funds, post messages).
- Log keystrokes.

### Finding XSS: the method
1. **Plant a unique marker.** Try a harmless string in every parameter, e.g., `kashsec7391`. Then search the response HTML for it. Where it reflects tells you *where* you can attack.
2. **Match the context.** The payload must match where your input lands:
   - Plain HTML → `<img src=x onerror=alert(1)>`
   - Inside an HTML attribute (e.g., `value="HERE"`) → break out first: `"><img src=x onerror=alert(1)>`
   - Inside existing JavaScript → close the string: `';alert(1);//`
3. **Beat the filter.** If simple payloads are blocked, try variations:
   - Blocks `<script>`? Use an event handler tag: `<img src=x onerror=alert(1)>` or `<svg onload=alert(1)>`.
   - Case-sensitive filter? Mix case: `<ImG sRc=x OnErRoR=alert(1)>`.
   - Nested strip? `<scr<script>ipt>` collapses back to `<script>` after naive removal.

### 🧪 Lab — Your first XSS
1. On PortSwigger Academy, open the **Cross-site scripting** category.
2. Do the apprentice lab: **"Reflected XSS into HTML context with nothing encoded"**.
3. Follow the guided steps — you'll make an alert pop up. Feel that "click."
4. Progress to **"Stored XSS into HTML context with nothing encoded"** to see the more dangerous, persistent flavour.

### The fix
- **Context-aware output encoding** — turn `<` into `&lt;` and so on, so it's shown as text, never treated as code.
- **Strict Content Security Policy (CSP)** — a browser rule blocking inline scripts and untrusted sources.
- **Framework auto-escaping** — React, Vue, and modern frameworks escape by default. Don't fight that unless you know exactly why.

### 🚩 Challenge
Which XSS flavour affects everyone who views the vulnerable page, with no click required from each victim?

<details><summary>Answer</summary>Stored XSS — the payload is saved on the server and served to every visitor.</details>

### Key terms
- **XSS** — running attacker-controlled JavaScript in a victim's browser.
- **Reflected / stored / DOM-based** — three XSS flavours.
- **alert(document.domain)** — the polite proof-of-concept payload.
- **CSP** — Content Security Policy; a browser-level XSS defence.

### Recap
- XSS = untrusted input rendered as executable code in a browser.
- Reflected needs a click; stored hits everyone; DOM-based lives in JS.
- Method: plant a marker → match the context → beat the filter.
- Prove harmlessly with `alert(document.domain)`; fix with output encoding and CSP.

---

## Lesson 7.6 — SQL Injection

### Why this matters
SQL injection is the classic web vulnerability — the one that leaks entire user tables and can even take over servers. It's less common today than XSS but far more impactful. Understanding it deeply teaches you the entire pattern of *injection* bugs.

### A quick primer on databases
Websites store data — users, orders, posts — in **databases**. They ask questions of the database using a language called **SQL** (Structured Query Language). A typical login might build this query:

```sql
SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'
```

That's saying: "give me any row from the users table where the username and password match."

### The core idea
**SQL injection happens when user input is glued directly into a SQL query.** Your input can then *change the query itself*, not just fill in blanks. You break out of being *data* and start writing *code* the database will execute.

### The classic auth bypass
If you type this as the username: `' OR '1'='1`

The query becomes:
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''
```

Because `'1'='1'` is *always true*, the `WHERE` clause matches — often logging you in as the first user in the table (frequently admin) with no password needed. Your input didn't fill in a slot; it changed the query's meaning.

### Detecting SQL injection
- **A quote error.** Add a `'` to a parameter (e.g., `id=1'`). If you get a 500 error or a SQL error message, the input reached the database unfiltered.
- **Boolean difference.** Compare `id=1 AND 1=1` (should behave normally) vs `id=1 AND 1=2` (should differ). If they behave differently, that's a strong hint.
- **Time delay.** `id=1' OR SLEEP(5)-- -` — if the page takes 5 extra seconds, you're in.

### Extracting data — UNION-based
When the query's results are shown on the page (like a product listing), `UNION SELECT` lets you append your own query and read from any table:

```
-- Step 1: find the column count (increase until it errors)
?id=1 ORDER BY 3-- -

-- Step 2: pull real data
?id=1 UNION SELECT username, password FROM users-- -
```

That's it. That single line can hand you every credential in a badly-built system.

### Blind SQL injection
Sometimes the app shows no results, just "success" or "fail." You then ask *yes/no* questions and read the answer from behaviour:

```
?id=1 AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'-- -
```

"Is the first letter of the first user's password an 'a'?" If the page behaves as "true," yes. Loop through positions and characters to reconstruct the value. Tedious by hand — hence tools like `sqlmap` — but the *idea* is elegant.

### 🧪 Lab — Your first SQLi
1. PortSwigger Academy → **SQL injection** → apprentice labs.
2. Start with **"SQL injection vulnerability in WHERE clause allowing retrieval of hidden data"**.
3. Then try **"SQL injection vulnerability allowing login bypass"** — the exact `' OR '1'='1` trick in a live environment.

### sqlmap — the automated helper
```bash
sqlmap -u 'https://lab.example.com/item?id=1' --batch --dbs
```

`sqlmap` finds and exploits SQL injection automatically. It's a great confirmation tool, but many bug bounty programs **ban automated tools** — always confirm manually first and read the rules.

### The fix
**Parameterised queries** (prepared statements). The code and the data travel separately, so input can never change the query structure:

```python
# WRONG — glued input
cursor.execute("SELECT * FROM users WHERE id = " + user_input)

# RIGHT — parameterised
cursor.execute("SELECT * FROM users WHERE id = ?", (user_input,))
```

Modern ORMs and query builders give you this for free. Name it as the fix in every report — it's the definitive answer.

### 🚩 Challenge
What's the classic beginner payload that turns a login check into "always true" and often logs you in as the first user?

<details><summary>Answer</summary>' OR '1'='1</details>

### Key terms
- **SQL injection** — user input changing the meaning of a database query.
- **UNION-based / blind SQLi** — extraction when results show / when they don't.
- **sqlmap** — the automated SQLi tool.
- **Parameterised queries** — the real fix.

### Recap
- SQLi = input changing the meaning of a database query.
- `' OR '1'='1` is the classic auth bypass; a stray `'` causing errors is the classic detection sign.
- Extract data with UNION or blind techniques; sqlmap automates it (with caution).
- Parameterised queries are the fix — always cite them in reports.

---

## Lesson 7.7 — Command Injection & File Upload

### Why this matters
These two bugs are simpler than SQLi but often more devastating: they can hand an attacker **direct control over the server**. Even a rare instance is a critical finding.

### Command Injection
Sometimes an application takes your input and passes it to the underlying **operating system**. If it does so unsafely, you can inject shell commands.

Suppose an app pings a host you specify:
```python
os.system("ping -c 1 " + user_input)   # dangerous
```

If you send `user_input = "8.8.8.8; cat /etc/passwd"`, the shell runs *two* commands: the ping *and* your command. That's command injection.

**Payload patterns you'll try:**
- `; cat /etc/passwd`
- `&& whoami`
- `| id`
- Backtick or `$(...)` variants: `` `id` `` or `$(id)`

If the response echoes the output, you've got RCE-lite — **Remote Code Execution** on the server. Even blind (no output), you can test with a time delay: `; sleep 5`.

**The fix:** never pass user input to the shell. Use safe language APIs that avoid a shell entirely (`subprocess.run(["ping", "-c", "1", host])`), and strictly validate that the input is what you expect (e.g., an IP address).

### Insecure File Upload
Sites that let users upload files (profile pictures, documents) are common — and often mishandled. The nightmare scenario is uploading a file that's *executed* by the server.

**Example:** an app accepts profile images but doesn't verify the file's type properly. You upload a file called `shell.php` containing a small PHP script that runs shell commands. If the server saves it in a place where PHP files execute, visiting `example.com/uploads/shell.php` runs your script — instant server control.

**Common bypasses when the app tries to filter:**
- **Client-only checks.** JavaScript in the browser checks the file type. Remember Path 05 — you can just skip that with Burp Repeater.
- **Extension blocking.** Blocks `.php`? Try `.phtml`, `.php5`, `.pht`, or `shell.php.jpg` (double extension).
- **MIME-type spoofing.** The `Content-Type` header is client-controlled — set it to `image/jpeg` and slip past a naive check.
- **Content sniffing.** The server checks the first bytes for `GIF89a`? Prepend `GIF89a` to your PHP file. The server thinks it's an image; the PHP interpreter still executes it.

**The fix:**
1. Validate on the **server**, using a real content check, not just the extension.
2. Store uploads **outside the web root** (so they can't be executed).
3. Use an **allowlist** of expected extensions (not a blocklist).
4. Rename uploaded files to something the user can't control.

### 🧪 Lab — Practise both
- **Command injection:** PortSwigger Academy → **OS command injection** → apprentice lab **"OS command injection, simple case"**.
- **File upload:** PortSwigger Academy → **File upload vulnerabilities** → apprentice lab **"Remote code execution via web shell upload"**.

Both give you a real shell on a lab server — a genuine milestone.

### 🚩 Challenge
An app filters uploaded filenames to block `.php`. Which two of these might still get through: `shell.php5`, `SHELL.PHP`, `shell.php.jpg`, `shell.js`?

<details><summary>Answer</summary>shell.php5 and (depending on the filter) SHELL.PHP or shell.php.jpg — extension blocklists commonly miss less-known PHP extensions, case variants, and double extensions. shell.js isn't PHP so won't help here.</details>

### Key terms
- **Command injection** — user input reaching the OS shell.
- **RCE** — Remote Code Execution; running attacker code on the server.
- **Web shell** — a small script uploaded to give command-line control over a server.
- **Allowlist / blocklist** — permit what's known good / block what's known bad.

### Recap
- Command injection puts your input into a shell — often lethal.
- Insecure file upload can lead to executing your code on the server (a web shell → RCE).
- Fixes: safe APIs (no shell), server-side content validation, allowlists, uploads outside the web root.

---

## Lesson 7.8 — SSRF & Authentication Attacks

### Why this matters
These two are on every advanced hacker's mind. **SSRF** turns the server into your errand-runner, sometimes stealing cloud credentials in a single request. **Authentication attacks** target the front door itself. You won't master them here, but you'll understand where they fit and why they're valued.

### Server-Side Request Forgery (SSRF)
Many apps fetch things from URLs *the user provides* — e.g., "import an image from a URL," "check the status of a webhook." **SSRF is tricking the app into fetching something it shouldn't** — usually an internal service or the cloud's metadata endpoint.

**Example:** an app has `fetch?url=<yours>`. You send:
```
fetch?url=http://localhost/admin
```
The **server** (not you) fetches its own internal admin panel — which is often not exposed to the internet — and returns the response to you. Instant internal access.

**The big one — cloud metadata.** Cloud providers (AWS, GCP, Azure) expose a special internal address (`169.254.169.254`) that returns metadata about the instance — *including temporary credentials*. A single SSRF that reaches it can escalate to full cloud account compromise:
```
fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

That's why SSRF has its own #10 slot on the Top 10.

**Common bypasses when the app tries to filter:**
- Alternate encodings: `http://127.0.0.1` vs `http://127.1` vs `http://[::]` vs `http://0` — all point to localhost.
- Redirects: point at your own server, which redirects to `169.254.169.254`.
- DNS rebinding (more advanced).

**The fix:** allowlist which destinations the server may fetch, block internal ranges (`127.0.0.0/8`, `10.0.0.0/8`, `169.254.0.0/16`), and use metadata service protections (IMDSv2 on AWS).

### Authentication attacks
The login form is a very attractive target. Common issues:

- **Weak password policy** — allowing "password123."
- **No rate limiting / lockout** — attackers can brute-force millions of guesses.
- **Credential stuffing** — using leaked password lists from other breaches.
- **Broken password reset** — predictable tokens, tokens leaked in URLs, no expiry.
- **Session management flaws** — session tokens not rotated after login, or long-lived cookies not invalidated on logout.
- **Weak MFA** — code by SMS (SIM swap), no rate limit on the code (brute the 6 digits).

**JWT — a modern class of issues.** Many APIs use **JSON Web Tokens** (self-contained tokens carrying a signed claim like "I am user 42, expiring at time X"). Classic JWT bugs:
- **"None" algorithm** — the token declares its own algorithm, and some libraries accept `"alg": "none"`, letting you forge any token.
- **Weak secret** — HMAC-signed tokens with guessable secrets can be cracked and re-signed.
- **Key confusion** — tricking the server into using a public key as if it were a symmetric secret.

### 🧪 Lab — Get exposure
- **SSRF:** PortSwigger Academy → **Server-side request forgery** → **"Basic SSRF against the local server"**.
- **Auth:** PortSwigger Academy → **Authentication** → the apprentice labs, especially those on brute force and password reset.
- **JWT:** PortSwigger Academy → **JWT** — save these for after you've done the basics.

### 🚩 Challenge
What internal-only IP address is famous for exposing cloud instance credentials via SSRF?

<details><summary>Answer</summary>169.254.169.254 — the AWS/Azure/GCP instance metadata service.</details>

### Key terms
- **SSRF** — making the server fetch a URL an attacker chose.
- **Cloud metadata endpoint (169.254.169.254)** — the classic SSRF prize.
- **JWT** — a self-contained signed token used by many APIs.
- **Credential stuffing / brute force** — reusing leaked passwords / trying many.

### Recap
- SSRF turns the server into your errand-runner; hitting cloud metadata can be catastrophic.
- Authentication bugs cover weak passwords, missing rate limits, broken resets, and JWT flaws.
- Both classes are highly valued in real work — PortSwigger has excellent free labs to explore them further.

---

## Lesson 7.9 — Your web-hacking roadmap

### Why this matters
You now have the mental map (OWASP Top 10), the tool (Burp), the practice ground (PortSwigger), and hands-on experience with the four beginner-friendly classics. This lesson turns that into a concrete plan so you keep growing without getting lost.

### The 90-day plan
A realistic, sustainable pace to become genuinely competent at web hacking:

**Weeks 1–3 — Foundations**
- Complete every **apprentice** lab on PortSwigger Academy (about 100). This alone will make you dangerous.
- Note *every* new payload, technique, and gotcha in your notes.

**Weeks 4–6 — Depth**
- Move to **practitioner**-level labs on the classes you enjoyed most (XSS, SQLi, Access Control, SSRF).
- Read a public **HackerOne report** every day. Their disclosed reports (hackerone.com/hacktivity) are free daily inspiration.

**Weeks 7–10 — Applied practice**
- Do TryHackMe's "Junior Penetration Tester" or "Web Fundamentals" paths for a change of pace.
- Try beginner **Hack The Box** web machines to see full targets, not just isolated labs.

**Weeks 11–13 — Real (but safe) targets**
- Look at **beginner-friendly bug bounty programs** with wide scopes. Sign up on HackerOne, Bugcrowd, and Intigriti. Read scopes carefully. Report anything valid.
- Don't expect income yet — expect learning. Every submitted report (even duplicates) teaches you the workflow.

### Habits that separate people who make it
- **Notes.** Keep a "personal cheat sheet" of every payload that worked, in your own words.
- **Curiosity.** When something breaks in an app, ask *why* — not just *how do I move on*.
- **Read others' work.** Bug bounty write-ups (Medium, Twitter/X, HackerOne Hacktivity) are the shortest path to seeing how experienced hunters actually think.
- **Discipline.** An hour a day, six days a week, for a few months, will take you *very* far. It's steady effort, not marathons.

### Where next in this course
- **Path 08 — Network Security:** Nmap and Wireshark, the "beyond-the-browser" side of security.
- **Path 09 — Ethical Hacking:** the full 5-phase methodology, from recon through reporting.
- **Path 10 — Bug Bounty:** turning your web skills into a real (potentially paid) side pursuit.
- **Path 11 — Advanced Topics:** privesc, Active Directory, cloud, forensics.
- **Path 12 — AI & AI Security:** the fresh frontier (coming soon).

### 🚩 Challenge
What's the single free platform this path recommends for weeks of guided web-security lab practice?

<details><summary>Answer</summary>PortSwigger's Web Security Academy (portswigger.net/web-security).</details>

### Recap
- You now have the model, the tool, the practice ground, and hands-on exposure to the classic four.
- The 90-day plan: PortSwigger apprentice → practitioner → TryHackMe/HTB → beginner bug bounty programs.
- The habits that matter: notes, curiosity, reading others' work, daily discipline.

---

## You've finished Path 07 🎉

You've walked the OWASP Top 10 in plain English, set up Burp Suite, learned proper web recon, and got real hands-on with **IDOR, XSS, SQL Injection, and Command Injection**, plus exposure to **file upload, SSRF, and authentication** bugs. You have a concrete 90-day plan to keep growing. This is a genuine milestone — you can now *test* web apps, not just read about them.

**Next up → `08-network-security.md`:** the world beyond the browser — using Nmap to map networks, Wireshark to see raw packets, and understanding firewalls, VPNs, and Wi-Fi security. The pentester's side of the field.
