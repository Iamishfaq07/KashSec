# iOS App Security Basics

This path has focused on Android so far, deliberately — it's far more accessible for hands-on learning. iOS applies most of the same underlying concepts, but through a stricter, more locked-down platform, worth understanding even without a jailbroken device on hand.

## Why iOS testing is harder to get started with

Apple's platform is intentionally more closed than Android: sideloading apps outside the App Store is heavily restricted, root-equivalent access ("jailbreaking") requires exploiting the OS itself (increasingly difficult on modern iOS versions with each release), and Apple's App Store review process adds a layer of scrutiny Android's more open ecosystem doesn't consistently apply. This means a genuine, deep hands-on iOS security lab requires either an actual jailbroken device (running an older, jailbreakable iOS version, since new jailbreaks lag behind current iOS releases) or a paid, less accessible simulator-based workaround — which is exactly why this lesson focuses on transferable concepts rather than a full hands-on lab.

## The IPA — iOS's equivalent of an APK

An **IPA (iOS App Store Package)** is, like an APK, fundamentally a ZIP archive:

```
App.ipa (unzipped)
├── Payload/
│   └── AppName.app/
│       ├── Info.plist       ← app metadata, permissions, configuration
│       ├── AppName          ← the compiled binary (Mach-O format)
│       └── (resources, storyboards, etc.)
```

The **Info.plist** file is roughly iOS's equivalent of `AndroidManifest.xml` — it declares permission usage descriptions (the text shown to users when requesting camera/location/contacts access), URL schemes the app registers, and various security-relevant configuration flags.

## Static analysis on iOS

Tools like **[class-dump](https://github.com/nygard/class-dump)** and **[Hopper Disassembler](https://www.hopperapp.com/)** (Hopper has a limited free/demo tier) can extract class and method information, and disassemble the compiled Mach-O binary respectively — but iOS apps compiled from Swift are notably harder to reverse-engineer meaningfully than Android's Java/Kotlin, since Swift compiles to native ARM code without the intermediate bytecode representation that makes Android decompilation (via jadx) so much more readable.

## App Transport Security (ATS)

iOS enforces **App Transport Security** by default — requiring HTTPS with modern TLS for all network connections, unlike Android where plaintext HTTP historically required no special configuration to allow. Developers *can* explicitly disable ATS for specific domains via `Info.plist` exceptions:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>insecure-legacy-api.example.com</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

Checking a decompiled `Info.plist` for ATS exceptions like this is a quick, high-value static check — it directly flags any domain the developer has deliberately weakened the platform's default network security for, often for legacy reasons that were never revisited.

## The Keychain — iOS's secure storage

Exactly like the Android Keystore (covered in the previous lesson), the **iOS Keychain** is the correct, hardware-backed location for storing sensitive data — tokens, passwords, cryptographic keys. The same insecure-storage anti-patterns apply here too: apps that instead use `UserDefaults` (iOS's equivalent of SharedPreferences) or unencrypted local files for sensitive data are making exactly the same mistake covered in the previous lesson, just on the other platform.

## URL schemes and Universal Links — iOS's inter-app attack surface

Recall the exported-component risk from Path 15.4's Android manifest analysis — iOS has a direct parallel worth knowing by name. Apps register **custom URL schemes** (`myapp://action?param=value`) in `Info.plist` to let other apps or web pages launch them with specific data, and **Universal Links** provide a more modern, HTTPS-based equivalent tied to a verified domain. Both are a genuine inter-app attack surface: if an app blindly trusts and acts on parameters passed via a custom URL scheme — logging a user in, changing a setting, navigating to an internal screen — without validating that the calling context is legitimate, any other app (or a malicious webpage, for schemes triggerable from Safari) can potentially trigger that same action by crafting the right URL. This is functionally the mobile-platform cousin of an unauthenticated exported Android component, and worth checking for during any iOS app review: what URL schemes does `Info.plist` register, and does the code handling them perform any validation before acting on the parameters received.

:::tip The concepts transfer even without a jailbroken device
Even without hands-on access, understanding *what* to look for — ATS exceptions in `Info.plist`, Keychain usage versus `UserDefaults`, certificate pinning implementations — means you can meaningfully review iOS app documentation, discuss iOS-specific findings in an interview (Path 13), or contribute to a mobile security team covering both platforms even if your own hands-on lab time has focused primarily on Android.
:::

:::challenge Test yourself
Why might an iOS app be, in some ways, more resistant to casual static analysis than an equivalent Android app, even though both platforms package apps as ZIP-based archives with similar internal structure?
<details><summary>Show answer</summary>Android apps written in Java/Kotlin compile down to Dalvik/ART bytecode — an intermediate representation that tools like jadx can decompile back into genuinely readable, close-to-original Java source code, because bytecode retains far more structural information than fully native machine code does. iOS apps, particularly those written in Swift, compile directly to native ARM machine code (Mach-O binaries) with no equivalent intermediate bytecode layer preserved in the shipped app — disassembling native machine code back into readable, high-level logic is inherently lossier and more labor-intensive than decompiling bytecode, which is exactly why iOS static analysis tools like Hopper produce assembly-level output requiring far more manual reverse-engineering effort than jadx's relatively clean Java reconstruction on Android.</details>
:::

## Key terms

- **IPA** — the iOS app package format, structurally similar to an APK.
- **Info.plist** — iOS's app manifest/configuration file, roughly analogous to AndroidManifest.xml.
- **App Transport Security (ATS)** — iOS's default-enforced HTTPS requirement for network connections.
- **Keychain** — iOS's secure, hardware-backed storage for sensitive data.

## Recap

- iOS's stricter platform model makes deep hands-on testing harder to access than Android, but the underlying security concepts (secure storage, transport security, permission descriptions) directly parallel what you've already learned.
- Info.plist and ATS exceptions are quick, high-value static checks even without a jailbroken device.
- The Keychain (like Android's Keystore) is the correct home for sensitive data — apps using UserDefaults for secrets are making the same mistake as Android apps using plain SharedPreferences.

???refs
- [Apple: App Transport Security](https://developer.apple.com/documentation/security/preventing_insecure_network_connections) — official documentation.
- [OWASP MASTG — iOS section](https://mas.owasp.org/MASTG/iOS/0x06a-Platform-Overview/) — the free, detailed iOS-specific testing methodology.
???

**Next up →** [Mobile Privilege Escalation & Root Detection](#/lesson/15-mobile-security/mobile-privesc-root-detection)
