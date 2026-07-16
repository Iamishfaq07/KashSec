# Android APK Analysis

An APK is far more inspectable than most people — including many developers — realize. This lesson covers **static analysis**: examining an app's code and structure without ever running it, often revealing hardcoded secrets, weak security controls, and a full map of the app's behavior before you write a single test request.

## What's actually inside an APK

An APK is, structurally, just a ZIP file. Rename any `.apk` to `.zip` and extract it, and you'll find:

```
app.apk (unzipped)
├── AndroidManifest.xml   ← permissions, components, entry points
├── classes.dex           ← compiled app code (Dalvik bytecode)
├── res/                  ← resources: layouts, strings, images
├── assets/               ← raw files bundled by the developer
└── lib/                  ← native (C/C++) libraries, if any
```

## Tools for decompiling

- **[jadx](https://github.com/skylot/jadx)** — free, open-source, decompiles `classes.dex` bytecode back into readable (if imperfect) Java source code. This is your primary tool for actually reading an app's logic.
- **[apktool](https://apktool.org/)** — free, decodes resources and disassembles code into a readable intermediate format (Smali), and — importantly — can also *rebuild* a modified APK, useful for testing patches to an app's behavior.
- **[MobSF (Mobile Security Framework)](https://github.com/MobSF/Mobile-Security-Framework-MobSF)** — a free, all-in-one automated static (and dynamic) analysis platform that runs many of these checks automatically and produces a structured report — an excellent way to get a fast first pass before manual review.

## The AndroidManifest.xml — read this first

Every APK contains this file, declaring every permission the app requests, every activity/service/component it exposes, and critically, whether any of those components are marked `exported="true"` — meaning *other apps on the device* can potentially interact with them directly, bypassing the app's own UI entirely.

```bash
# Using apktool to decode the manifest into readable XML:
apktool d app.apk -o app_decoded
cat app_decoded/AndroidManifest.xml
```

Look specifically for: permissions that seem disproportionate to the app's purpose (echoing Path 15's fundamentals lesson), and any exported component with no matching permission requirement — a classic real-world Android vulnerability class, since an exported, unprotected component can sometimes be triggered by any other app installed on the device.

## Decompiling and reading the code

```bash
jadx app.apk -d app_source
```

Once decompiled, search the resulting Java source systematically for the same categories the OWASP Mobile Top 10 flags:

```bash
grep -r "password" app_source/ --include="*.java" -i
grep -r "api_key\|apikey\|secret" app_source/ --include="*.java" -i
grep -r "http://" app_source/ --include="*.java"    # plaintext HTTP endpoints
```

Hardcoded API keys and credentials found this way are a genuinely, surprisingly common real-world finding — developers frequently embed secrets directly in app code, not realizing that "compiled" doesn't mean "unreadable."

:::tip Check string resources too, not just code
Sensitive values are sometimes stored in `res/values/strings.xml` rather than directly in code — always grep both locations when hunting for hardcoded secrets.
:::

## What decompiled code can't fully recover

Decompilation reconstructs readable-ish source, but variable and method names are often mangled or generic if the app was obfuscated (via tools like ProGuard/R8, common in production Android builds) — you'll frequently need to trace logic by *behavior* (what does this method call, what does it return) rather than relying on self-explanatory names, a genuinely useful close-reading skill this lesson starts building.

:::challenge Analyze a real APK
Download any free, legitimate app's APK (via a tool like `apk-mirror` alternatives, or pull one directly off your own device with `adb pull`), decompile it with jadx, and answer: how many permissions does it request, are any exported components present in the manifest, and can you find any hardcoded strings that look like they shouldn't be there (URLs, keys, or debug flags)?
:::

## Key takeaway

Compiled doesn't mean unreadable — with free, widely available tools, an APK's structure, permissions, and a substantial portion of its actual logic are all directly inspectable, which is exactly why hardcoded secrets and exported components remain such consistently common real-world Android findings.

**Next up →** [Insecure Data Storage](#/lesson/15-mobile-security/insecure-data-storage)
