# Insecure Data Storage

This is OWASP Mobile Top 10 item #9, and consistently one of the most common findings in real mobile security assessments — apps storing sensitive data locally without encryption, trusting the sandbox alone (Path 13's fundamentals lesson) to protect it, when the sandbox boundary is exactly what a rooted device or a stolen, unlocked phone bypasses.

## Where apps store data locally

| Storage mechanism | Typical use | Common mistake |
|---|---|---|
| **SharedPreferences** (Android) | Simple key-value settings | Storing tokens, passwords, or PII in plain text |
| **SQLite databases** | Structured local data | Storing sensitive fields unencrypted |
| **Internal/external files** | Cached data, logs, exports | Writing sensitive data to world-readable external storage |
| **Keystore/Keychain** | The *correct* place for secrets | Underused — many apps skip it in favor of simpler (insecure) options |

## Hunting for insecure storage, hands-on

Using ADB against a rooted emulator (Path 13's lab setup lesson) with an app installed:

```bash
adb shell
run-as com.example.vulnerableapp    # only works on debuggable apps without root
# or, with root:
su
cd /data/data/com.example.vulnerableapp

ls shared_prefs/
cat shared_prefs/*.xml              # check for plaintext secrets

ls databases/
sqlite3 databases/app.db ".dump"    # dump the entire local database
```

On real (non-debug) production apps, `run-as` won't work without matching debuggable flags — this is exactly why the earlier lab setup lesson emphasized getting proper root access on your test emulator, which bypasses this restriction entirely.

## What "bad" looks like

```xml
<!-- shared_prefs/user_data.xml — a real anti-pattern -->
<map>
    <string name="auth_token">eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ...</string>
    <string name="password">SuperSecret123</string>
</map>
```

Anyone with root access to the device (or physical access to a backup, covered below) can read this file directly, in plain text, with no exploitation required at all — this is a *configuration* failure, not a technical vulnerability requiring exploitation.

## Backups — an often-overlooked leak path

Android's `adb backup` feature (and iOS's iTunes/Finder backups) can capture an app's local data entirely, including everything covered above, **unless the app explicitly opts out**:

```xml
<!-- AndroidManifest.xml -->
<application android:allowBackup="false" ...>
```

Checking for `android:allowBackup="true"` (or its absence, which defaults to allowing backups on many Android versions) during the APK analysis from the previous lesson is a genuinely quick, high-value check — an app storing sensitive unencrypted data with backups enabled can leak that entire dataset to anyone with brief physical access to an unlocked device and a computer.

## Logs and clipboard — two more overlooked leak paths

Beyond persistent storage, two transient data paths regularly leak sensitive information without anyone noticing until it's flagged. **System logs** (readable via `adb logcat` on a debug-enabled or rooted device) are a genuinely common accidental leak: developers routinely `Log.d("token", authToken)` during development and forget to strip it before shipping to production, and unlike a crash that would get noticed immediately, a stray debug log line can persist through many release cycles unnoticed since nothing about the app's visible behavior changes:

```bash
adb logcat | grep -i "token\|password\|secret"
```

The **clipboard** is the second overlooked path — any app can read whatever's currently on the system clipboard on many Android versions (more recent versions have added notifications and restrictions, but older or unpatched devices remain exposed), meaning a password manager or banking app that copies a password or OTP code to the clipboard for convenience is briefly exposing that value to any other app on the device that chooses to poll clipboard contents. Checking both of these during an assessment — not just the persistent storage locations covered above — rounds out a genuinely thorough insecure-storage review.

## The correct approach — using the platform Keystore/Keychain

Both platforms provide a hardware-backed secure storage mechanism specifically designed for secrets: the **Android Keystore** and **iOS Keychain**. Data stored here is encrypted using keys that never leave secure hardware (on supporting devices), meaning even root access alone typically can't directly extract the raw secret the way it can with a plain SharedPreferences file.

```java
// Simplified illustration — using Android's EncryptedSharedPreferences
// (built on top of the Keystore) instead of plain SharedPreferences:
EncryptedSharedPreferences.create(
    "secure_prefs",
    masterKeyAlias,
    context,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
);
```

:::danger Only test on your own devices and apps
Everything in this lesson — reading local storage, checking backup settings — must only be practiced against your own test devices and apps you built or have explicit authorization to test (the vulnerable practice apps referenced throughout this path are ideal). Extracting data from someone else's device, even one you have brief physical access to, without authorization, is unauthorized access.
:::

:::challenge Audit a vulnerable practice app
Using DIVA or InsecureBankv2 (installed in the lab setup lesson) on your rooted emulator, find at least one piece of sensitive data stored insecurely — check SharedPreferences and the local SQLite database. Document exactly what you found, where, and what the correct fix would look like (Keystore-backed encrypted storage, or simply not storing that data locally at all).
:::

## Key takeaway

Insecure local storage requires zero exploitation to abuse — just root access or a backup extraction and the willingness to look. This makes it one of the highest-yield, lowest-effort findings in mobile testing, and exactly why checking local storage should be one of the very first things you do in any mobile security assessment.

**Next up →** [Intercepting Mobile Traffic](#/lesson/13-mobile-security/intercepting-mobile-traffic)
