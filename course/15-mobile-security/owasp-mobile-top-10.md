# OWASP Mobile Top 10

Just as the OWASP Top 10 (Path 07) gives web hackers a shared checklist, the **OWASP Mobile Application Security** project maintains an equivalent list for mobile — the shared vocabulary and priority list every mobile security tester should know before diving into specific techniques.

## The list, explained plainly

1. **Improper Credential Usage** — hardcoded API keys, credentials embedded in app code, or weak session handling specific to mobile contexts.
2. **Inadequate Supply Chain Security** — vulnerable third-party SDKs and libraries bundled into the app, or a compromised build pipeline — mobile's version of the software supply chain risks referenced throughout this course.
3. **Insecure Authentication/Authorization** — weak biometric implementation, missing server-side authorization checks (the mobile equivalent of Path 07's IDOR), or authentication logic that can be bypassed by manipulating the client.
4. **Insufficient Input/Output Validation** — the mobile equivalent of injection flaws (Path 07's SQLi/XSS lessons), often overlooked because developers assume mobile apps are "safer" than web apps.
5. **Insecure Communication** — missing or broken TLS, disabled certificate validation, or apps that fall back to plaintext HTTP under certain conditions.
6. **Inadequate Privacy Controls** — collecting more personal data than necessary, or exposing personal data through logs, backups, or insecure storage.
7. **Insufficient Binary Protections** — apps with no obfuscation or anti-tampering measures, making reverse engineering (covered in this path's APK analysis lesson) trivially easy.
8. **Security Misconfiguration** — debug flags left enabled in production builds, verbose error messages, or overly permissive file/component permissions.
9. **Insecure Data Storage** — sensitive data saved unencrypted in local storage, databases, or backups (this path has a dedicated lesson on exactly this).
10. **Insufficient Cryptography** — weak or custom-rolled encryption, hardcoded encryption keys, or using deprecated algorithms — the mobile-specific version of the "never roll your own crypto" principle from Path 07's XOR cipher discussion.

```mermaid
flowchart TD
    A[OWASP Mobile Top 10] --> B[Client-side issues\nstorage, binary protection,\ncrypto, misconfig]
    A --> C[Communication issues\ninsecure network,\ncert validation]
    A --> D[Server-adjacent issues\nauth, authz, input validation\n- same as OWASP Web Top 10\napplied via mobile API]
```

## Why this list looks different from the Web Top 10

Notice how several items (#3, #4) are essentially the web vulnerabilities from Path 07, just triggered through a mobile app's API calls instead of a browser — a mobile app is still, ultimately, a client talking to a server, and every server-side lesson from earlier in this course applies directly to that backend regardless of what kind of client calls it. What's genuinely new here is everything related to the **client itself**: local storage, binary protection, and the app's own code being distributable and inspectable in ways a web server's backend code never is.

:::tip This list evolves — always check the current version
OWASP periodically revises this list based on real-world findings; the version summarized here reflects the current widely-referenced structure, but always check [owasp.org/www-project-mobile-top-10](https://owasp.org/www-project-mobile-top-10/) directly for the latest official wording and any updates before citing it formally (in a report, for instance).
:::

## How this list shapes the rest of this path

The remaining lessons in this path map directly onto specific items here: **Android APK Analysis** targets #7 (binary protection) and #8 (misconfiguration); **Insecure Data Storage** targets #9 directly; **Intercepting Mobile Traffic** targets #5; and the capstone lab pulls several of these together against a real deliberately-vulnerable app.

:::challenge Test yourself
Why do items #3 and #4 on this list ("Insecure Authentication/Authorization" and "Insufficient Input/Output Validation") look so similar to vulnerabilities you already learned in Path 07's web security material?
<details><summary>Show answer</summary>A mobile app's authentication and input handling logic almost always lives on the same backend server infrastructure that a web application would use — the mobile app itself is fundamentally just a different kind of client sending requests to that server, exactly like a browser is. If the server fails to properly validate authorization (checking whether the requesting user actually owns the resource they're requesting) or fails to sanitize input before using it in a database query, that vulnerability exists regardless of whether the request came from a web browser, a mobile app, or a raw API call crafted by hand — the underlying server-side flaw, and the fix, are identical. This is exactly why the web security skills from Path 07 remain directly relevant once you start testing the backend APIs mobile apps talk to.</details>
:::

## Key terms

- **OWASP Mobile Application Security (MAS)** — the umbrella project covering the Mobile Top 10, plus the detailed testing guide (MASTG) and verification standard (MASVS).
- **Binary protection** — anti-tampering and anti-reverse-engineering measures applied to a compiled app.
- **Supply chain security** — securing the third-party components and build process behind an app, not just its own code.

## Recap

- The OWASP Mobile Top 10 is the mobile-specific equivalent of Path 07's web Top 10, and shares several categories directly with it, applied to mobile's API-driven client-server model.
- What's genuinely mobile-specific is everything about the client itself — local storage, binary protection, cryptography, and platform-level misconfiguration.
- This list frames and motivates every remaining lesson in this path.

???refs
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/) — the official, current list.
- [OWASP MASTG (Mobile Application Security Testing Guide)](https://mas.owasp.org/MASTG/) — the definitive free, detailed hands-on testing methodology, well worth exploring beyond this course.
???

**Next up →** [Android APK Analysis](#/lesson/15-mobile-security/android-apk-analysis)
