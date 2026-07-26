# Cross-Platform Mobile Security

Every lesson so far has treated Android and iOS as the two native platforms. This lesson covers a genuinely different, increasingly common development approach — frameworks that build one codebase deployed to both platforms — and the distinct security considerations that come with it.

## What cross-platform frameworks actually are

**React Native**, **Flutter**, and similar frameworks let developers write an app's logic largely once, then deploy it to both Android and iOS, rather than maintaining two entirely separate native codebases — directly connecting to Path 05's web-frameworks-overview lesson's coverage of frontend frameworks, just applied to mobile rather than the browser.

## Why cross-platform apps introduce a distinct security surface

- **The JavaScript bridge (React Native specifically)** — React Native apps run application logic in JavaScript, communicating with native platform code through a **bridge** — a genuinely distinct attack surface, since data crossing this bridge needs the same validation discipline Path 11 taught for any trust boundary, and a poorly secured bridge can expose native functionality to script-level manipulation
- **Bundled JavaScript is even easier to extract than native code** — React Native's JavaScript bundle is frequently less obfuscated than compiled native code by default, meaning the reverse-engineering lesson's static-analysis techniques often require even less effort against a cross-platform app's business logic
- **Third-party plugin risk** — cross-platform frameworks rely heavily on a plugin ecosystem for native functionality, directly connecting to Path 10's supply-chain-security lesson: a vulnerable or malicious plugin becomes part of the app's trusted codebase the same way a compromised dependency does in any software supply chain

## Flutter's different approach, and its own tradeoffs

Flutter compiles to native ARM code rather than running an interpreted JavaScript bridge, which removes React Native's specific bridge-related attack surface — but Flutter apps still face the same underlying secure-storage, API-security, and permission-model considerations covered throughout this entire path, since those are platform-level concerns the development framework doesn't change.

## What stays exactly the same regardless of framework choice

Every single vulnerability class covered in this path — insecure data storage, certificate pinning (needing its own cross-platform-compatible implementation), API security, root/jailbreak detection — applies identically to a cross-platform app as to a fully native one. The framework changes *how* an app is built, not the underlying platform security model (permissions, sandboxing, secure enclave access) it ultimately runs on top of.

:::challenge Test yourself
Why might a React Native app's core business logic be genuinely easier to reverse-engineer than an equivalent native Android app's compiled code?
<details><summary>Show answer</summary>A native Android app compiles to bytecode that requires the decompilation process the APK-analysis lesson covered — a genuine, if not enormously difficult, extra step. A React Native app, by contrast, bundles its actual application logic as JavaScript, which is an interpreted language shipped in a form that's often considerably closer to its original, human-readable source than compiled native bytecode — without deliberate obfuscation (a topic the app-hardening lesson covers next), a React Native bundle can sometimes be nearly as readable as the original source code the developer actually wrote. This is exactly why cross-platform apps built with JavaScript-based frameworks deserve particular attention to obfuscation and code-hardening measures, precisely because their default, un-hardened state tends to expose more of the app's actual logic than an equivalent native binary would.</details>
:::

## Key terms

- **React Native bridge** — the communication layer between an app's JavaScript logic and native platform code, a distinct attack surface.
- **Cross-platform framework** — a development approach (React Native, Flutter) building one codebase deployed to both Android and iOS.

## Recap

- Cross-platform frameworks introduce their own distinct considerations — React Native's bridge, easier-to-extract JavaScript bundles, and third-party plugin supply-chain risk — on top of, not instead of, every platform-level security concern this path has covered.
- Flutter's compiled-native approach removes the bridge-specific risk but doesn't change the underlying platform security model any framework ultimately builds on.
- Every vulnerability class covered elsewhere in this path applies identically to cross-platform apps, since the framework changes how an app is built, not the platform it ultimately runs on.

**Next up →** [Mobile Privilege Escalation & Root Detection](#/lesson/13-mobile-security/mobile-privesc-root-detection)
