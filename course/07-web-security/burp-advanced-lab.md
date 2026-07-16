# Advanced Burp Suite Lab

You've learned Burp's basics and the core vulnerability classes throughout this path. This lab has you combine them, using Burp as your primary tool the way a real web security assessment actually works — not testing one bug in isolation, but working through an application methodically.

## Lab setup

Use **PortSwigger's free Web Security Academy** labs (the same platform referenced throughout this path) or **DVWA (Damn Vulnerable Web Application)**, a free, deliberately vulnerable app you can run locally in Docker — both are legal, purpose-built targets.

## Challenges

1. **Intercept and modify a login request.** With Burp's Proxy running and your browser configured to route through it, submit a login form and catch the request in **Proxy → Intercept**. Send it to **Repeater**, then try modifying the username/password fields and resubmitting — watch how the response changes based on what you send.
2. **Use Repeater to test SQLi payloads systematically.** Take a request with a parameter you suspect might be vulnerable (a search box, a login field, an ID parameter) and, in Repeater, try the classic tests from Path 07's SQLi lesson one at a time: a single quote `'`, then `' OR '1'='1' --`, watching how the response (length, content, error messages) changes between each attempt.
3. **Find and exploit an IDOR vulnerability.** Using two test accounts if the lab supports it (the "two-account method" from Path 10's IDOR lesson), capture a request that accesses "your" data by ID, then modify just that ID in Repeater and check whether you can access someone else's.
4. **Run Burp's built-in scanner** (available in the paid Pro version, but the free Community Edition's manual Repeater/Intruder workflow covers everything above) against the lab target and compare what it flags to what you found manually — a genuinely instructive comparison of automated versus manual testing, echoed in Path 07's SQLi lab discussion of `sqlmap` versus manual testing.

**Success goal**: Find at least 2 different vulnerabilities using this workflow, and note how much of the process was really just "intercept → modify in Repeater → observe the response" repeated with different payloads.

:::tip Build a personal payload cheat-sheet
As you work through this lab (and the JWT and SSRF labs that follow), start keeping your own running list of payloads that worked, organized by vulnerability type. This becomes genuinely useful personal reference material fast, and is a legitimate, common practice among working security testers.
:::

:::challenge Write it up
Pick your best finding from this lab and write a short report following the structure from Path 09's Reporting lesson: title, severity, steps to reproduce (exact requests/payloads used), impact, and fix. This is the actual deliverable format used across the industry, not just a course exercise.
:::

## Key takeaway

Burp's real power isn't any single feature — it's the intercept → modify → observe loop, repeated systematically across every input a web application exposes. Once that loop becomes second nature, finding vulnerabilities becomes far less about memorizing exploits and far more about disciplined, methodical testing.

**Next up →** [Advanced JWT Lab](#/lesson/07-web-security/jwt-advanced-lab)
