# Reverse Engineering Mobile Apps

The APK-analysis lesson introduced decompiling an app's code. This lesson goes deeper into the actual reverse-engineering workflow — static and dynamic analysis working together, and the specific tool (Frida) that shows up constantly throughout the rest of this path.

## Static analysis: reading code without running it

The APK-analysis lesson's decompilation is genuinely static analysis — examining an app's code, resources, and configuration without ever executing it. Beyond simply reading decompiled Java/Kotlin, static analysis includes:

- **Reviewing `AndroidManifest.xml`** — revealing declared permissions (from the previous lesson), exported components (previewed there, covered fully in the privesc lesson), and other configuration details before ever running the app
- **Searching decompiled code for hardcoded secrets** — directly connecting to Path 04's secure-coding lesson's warning against hardcoded credentials, an even more common finding in mobile apps than in server-side code, since a mobile APK is trivially extractable and decompilable by anyone who downloads it
- **String analysis** — searching an app's compiled strings for API endpoints, internal comments left in by developers, or debug flags accidentally left enabled in a production build

## Dynamic analysis: watching the app actually run

**Dynamic analysis** observes an app's real behavior while it executes — network traffic (the intercepting-mobile-traffic lesson), file system access, and runtime function calls — revealing behavior that static analysis alone might miss, especially when code is obfuscated (previewed here, covered fully in the app-hardening lesson later in this path).

## Frida: dynamic instrumentation, hands-on

**Frida** is the dominant tool for mobile dynamic analysis, letting a researcher inject JavaScript into a running app's process to hook functions, intercept calls, and modify behavior in real time — genuinely the same underlying technique the intercepting-mobile-traffic lesson uses to bypass certificate pinning, generalized to any function in the app.

```javascript
// A simplified example: hooking a function to log its arguments
Java.perform(function() {
    var TargetClass = Java.use("com.example.app.SecurityCheck");
    TargetClass.isRooted.implementation = function() {
        console.log("isRooted() was called — forcing return false");
        return false;
    };
});
```

This exact pattern — hooking a specific function and overriding its return value — is precisely the technique the mobile-privesc-root-detection lesson later in this path uses to bypass root-detection checks, now shown in the general form that applies to essentially any function an app defines.

## Why combining static and dynamic analysis matters

Neither approach alone tells the complete story: static analysis can reveal code paths that are rarely triggered during normal use (an unusual condition, a hidden debug feature) that dynamic analysis might never happen to exercise, while dynamic analysis reveals genuine runtime behavior (actual network destinations, real decrypted values) that static analysis of obfuscated or encrypted code might never fully recover. A thorough mobile assessment moves between both approaches, using findings from each to guide the other.

:::challenge Test yourself
Why might a hardcoded API key be easier to find in a mobile app's decompiled code than in a typical server-side web application's source code?
<details><summary>Show answer</summary>A mobile app's compiled package (APK or IPA) ships directly to every single user who installs it — meaning anyone can download the app, decompile it using the exact tools this path has covered, and examine its code and embedded strings directly, entirely on their own device with no need to access the developer's actual servers or source repository at all. Server-side web application code, by contrast, never leaves the server — a user only ever sees the application's outputs (rendered pages, API responses), never the underlying source code itself, unless a separate vulnerability (like the source-code-disclosure risks covered elsewhere in this course) exposes it. This fundamental distribution difference is exactly why hardcoded secrets in mobile apps are considered an even more severe and more commonly found mistake than the equivalent in server-side code — the "attacker" doesn't need to breach anything at all, they just need to download the app like anyone else.</details>
:::

## Key terms

- **Static analysis** — examining an app's code and configuration without executing it.
- **Dynamic analysis** — observing an app's actual behavior while it runs.
- **Frida** — a dynamic instrumentation tool for hooking and modifying a running app's functions in real time.

## Recap

- Static analysis (decompiled code, manifest review, string searching) and dynamic analysis (observed runtime behavior) each reveal different information, and a thorough assessment combines both.
- Frida's function-hooking technique is the same underlying mechanism used throughout this path — from certificate-pinning bypass to root-detection bypass — just applied to different target functions.
- Hardcoded secrets are an even more severe finding in mobile apps than server-side code, precisely because the compiled app ships directly to every user, making decompilation trivially accessible to anyone.

**Next up →** [Insecure Data Storage](#/lesson/13-mobile-security/insecure-data-storage)
