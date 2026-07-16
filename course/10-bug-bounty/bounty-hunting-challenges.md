# Bug Bounty Hunting Challenges

This lab bridges everything you've learned across Path 07 (web security) and this path's earlier lessons into real hunting practice — starting with beginner-friendly vulnerability classes before pushing you toward an actual submission.

## Beginner challenges

1. **Find IDOR on a test program.** Using the two-account method from this path's IDOR lesson, register two accounts on a public bug bounty program's test/staging environment (many programs explicitly welcome this) or a dedicated practice platform, and systematically test every endpoint that references an ID for access control failures.
2. **Hunt for open redirects.** Look for any parameter that controls a redirect destination (`?redirect=`, `?next=`, `?returnUrl=`) and test whether it accepts an arbitrary external URL:
   ```
   https://target.com/login?redirect=https://evil-example.com
   ```
   Open redirects are frequently underestimated but genuinely useful in phishing chains — a link to the real, trusted domain that silently redirects to an attacker-controlled page is far more convincing than an obviously fake URL.
3. **Test for XSS in comments.** Revisit the techniques from Path 07's XSS practical lab against a real (in-scope) bug bounty target — comment fields, review sections, and profile bios are consistently among the highest-yield places to find stored XSS in real applications.

## Tools you should know

- **Burp Suite** — your primary interception and testing tool, covered throughout Path 07.
- **[Nuclei](https://github.com/projectdiscovery/nuclei)** — a free, fast vulnerability scanner using community-maintained templates, referenced in this path's automation lesson.
- **[Subfinder](https://github.com/projectdiscovery/subfinder)** — fast subdomain enumeration, the starting point of the recon pipeline covered next in this path.

## Building good hunting habits

:::tip Read the program's scope and policy before touching anything
Every bug bounty program defines exactly what's in scope (which domains, which vulnerability types) and what's explicitly disallowed (often things like automated scanning at high volume, social engineering, or physical testing). Reading this document fully, every time, before testing a new program is non-negotiable — testing outside scope, even accidentally, can get your account banned or, in rare cases, cross into legal risk.
:::

:::challenge Submit a real report this month
Pick one program on **HackerOne** or **Intigriti** (both host large numbers of legitimate, well-run programs, many with generous scope for beginners), read its policy fully, and submit at least one valid, well-written report using the structure from Path 09's Reporting lab — even a low-severity, informational finding is a genuine, real accomplishment worth completing and documenting in your GitHub portfolio (Path 13).
:::

## Key takeaway

The beginner-friendly vulnerability classes covered here — IDOR, open redirects, stored XSS — remain consistently among the most commonly *found and paid* bug bounty categories precisely because they require careful, methodical testing rather than exotic technique, which is exactly the skill this lab (and this entire course) has been building toward.

**Next up →** [Logic Bug Hunting Lab](#/lesson/10-bug-bounty/logic-bug-hunting-lab)
