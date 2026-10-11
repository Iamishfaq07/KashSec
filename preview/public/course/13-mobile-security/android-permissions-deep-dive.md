# Android Permissions Deep Dive

The fundamentals lesson introduced permissions at a high level. This lesson goes properly deep — the actual permission model, why it changed dramatically over Android's history, and the security implications of getting it wrong as either a developer or an assessor.

## Install-time vs. runtime permissions

Older Android versions granted every permission an app requested at install time, all at once — meaning a user either accepted the app's entire permission list or didn't install it at all, with no granularity. Modern Android uses **runtime permissions** for anything sensitive (location, camera, contacts, microphone): the app must request each one individually, at the moment it's actually needed, and the user can grant or deny each independently — directly applying the least-privilege principle from throughout this course to end-user consent itself.

## Permission protection levels

- **Normal** — low-risk permissions (internet access, for instance) granted automatically at install time, no explicit user prompt needed
- **Dangerous** — the runtime-prompted category covering genuinely sensitive access (location, camera, contacts, SMS)
- **Signature** — granted automatically only to apps signed with the same certificate as the app declaring the permission, commonly used for communication between an organization's own suite of apps
- **Signature|System** — reserved for apps that are part of the Android system image itself or share a platform-level signature

## Why over-permissioned apps remain a genuine, common finding

Directly connecting to Path 09's device-and-location-privacy lesson's flashlight-app example: a mobile security assessment routinely finds apps requesting far more permissions than their stated function requires — exactly the disproportionate-permission-request pattern that lesson flagged as a data-harvesting warning sign, now examined from the assessor's side rather than the end user's.

```bash
adb shell dumpsys package com.example.app | grep permission
```

Reviewing an app's declared and actually-granted permissions is a genuinely quick, high-value first step in any mobile assessment, directly connecting to the mobile-testing-lab-setup lesson's ADB tooling.

## Permission scoping in modern Android: even more granular

Recent Android versions have introduced even finer-grained control — **scoped storage** (limiting file-system access to an app's own sandbox by default, rather than broad external storage access) and **approximate location** (letting a user grant general-area location without precise coordinates, directly connecting to Path 09's device-location-privacy lesson) both represent the same trend: narrowing the default blast radius of what any single permission grant actually exposes.

## The security implication of exported components, previewed

A permission alone doesn't fully determine an app's attack surface — the mobile-privesc-root-detection lesson later in this path covers **exported components**, where an app's own internal functionality can be reached by *other apps* on the device, entirely independent of the permission model covered in this lesson. Worth flagging now: permissions control what an app itself can access, while exported components control what *other* apps can reach within it — two genuinely separate attack surfaces.

:::challenge Test yourself
Why does the shift from install-time to runtime permissions represent a genuine security improvement, not just a UX change?
<details><summary>Show answer</summary>Install-time permissions forced an all-or-nothing decision before a user had any real context for why a specific permission might be needed — a user installing a photo-editing app might grant location access simply because refusing meant not installing the app at all, with no way to use the app's core functionality while declining unrelated, unnecessary access. Runtime permissions let a user make an informed decision <em>at the moment</em> a specific permission is actually being requested, with context about what triggered the request, and — critically — let a user grant some permissions while denying others, using the app's core functionality without necessarily accepting every requested access. This directly reduces the effectiveness of over-permissioned or data-harvesting apps, since a user can now decline a suspicious, disproportionate permission request (the flashlight-app example from Path 09) while still using the app's legitimate core feature, rather than facing an all-or-nothing choice.</details>
:::

## Key terms

- **Runtime permission** — a sensitive permission requested individually at the moment it's needed, rather than bundled at install time.
- **Scoped storage** — a modern Android restriction limiting default file-system access to an app's own sandbox.
- **Exported component** — part of an app's functionality reachable by other apps on the device, a separate attack surface from the permission model.

## Recap

- Modern Android's runtime permission model lets users make informed, granular decisions rather than an all-or-nothing install-time choice, directly applying least privilege to end-user consent.
- Over-permissioned apps remain a genuinely common real-world finding, directly connecting to Path 09's disproportionate-permission-request warning sign.
- Permissions and exported components are two separate attack surfaces — one controls what an app itself can access, the other controls what other apps can reach within it.

**Next up →** [Setting Up a Mobile Testing Lab](#/lesson/13-mobile-security/mobile-testing-lab-setup)
