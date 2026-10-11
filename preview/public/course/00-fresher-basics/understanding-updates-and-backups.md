# Updates & backups: the boring habits that save you

Nothing in this lesson is exciting, and that's exactly why most people skip it. Software updates and backups are two of the single highest-leverage habits in all of computing — quietly preventing enormous amounts of damage before it ever happens.

## Why "just click update later" is a real risk

When a company discovers a security flaw in their software, they fix it and release an **update** (sometimes called a **patch**). But the update itself often reveals exactly what was wrong to anyone paying attention — including attackers, who study patch notes specifically to find out what flaw was just fixed, then go looking for people who haven't installed the update yet. The gap between "the fix exists" and "you've actually installed it" is, in a very real sense, the most dangerous window your device will ever be in.

:::danger The update reminder you keep dismissing is a real risk, not a nag
Every "update available" notification you postpone indefinitely leaves a known, publicly documented flaw sitting unpatched on your device. This is one of the single most common ways real attacks succeed — not through some brilliant novel technique, but through a fix that already existed and simply wasn't installed yet.
:::

## What to actually keep updated

- **Your operating system** (Windows, macOS, iOS, Android) — usually the highest priority, since it underlies everything else
- **Your web browser** — one of the most frequently targeted pieces of software on any device, since it's the thing directly touching untrusted content from the internet all day
- **Apps you actually use regularly** — especially anything handling sensitive information (email, banking apps, messaging apps)

Most modern devices can update themselves automatically if you enable that setting — turning this on is a genuine "set it and forget it" win.

## Backups: the habit that undoes a disaster

A **backup** is simply a copy of your important files stored somewhere separate from your main device — so if that device is lost, stolen, breaks, or gets hit by ransomware (malicious software that encrypts your files and demands payment, covered later in this course), you still have your data.

### The 3-2-1 rule, in plain terms

A widely-used, simple guideline: keep **3** copies of anything genuinely important, on **2** different types of storage, with **1** copy stored somewhere physically separate (a cloud service, or a drive kept at a different location). This sounds like a lot for casual use — in practice, for most people, "an automatic cloud backup plus the original on your device" already satisfies most of the real protection this rule is aiming at.

### Why backups specifically defeat ransomware

Ransomware's entire threat is "pay us, or lose your files forever." A current, working backup completely removes that leverage — if your files are encrypted by an attacker, you simply restore from a backup that was never touched, and the attacker has nothing to hold over you. This is exactly why backups are considered one of the most effective defenses against ransomware specifically, not just device loss in general.

## 🧪 Hands-on lab — set up real protection

1. Check whether your operating system and browser are set to update automatically, and turn this on if they aren't.
2. Identify your genuinely important files (photos, documents, anything irreplaceable) and confirm whether they're currently backed up anywhere.
3. Set up at least one automatic backup method — a cloud storage service (Google Drive, iCloud, OneDrive) or an external drive with scheduled backups.
4. Actually test your backup once: try restoring or opening a single file from it, to confirm it genuinely works rather than assuming it does.

:::challenge Test yourself
Why does an unpatched security flaw become *more* dangerous, not less, once the update fixing it is released?
<details><summary>Show answer</summary>The update itself, along with its accompanying release notes, often describes what was wrong in enough detail for attackers to study it and figure out how to exploit it — even if the original discoverer reported it responsibly and privately. Once a fix is public, attackers specifically go looking for devices that haven't installed it yet, since they now know exactly what flaw to target and roughly how widespread it likely still is. This is why prompt updating matters more, not less, once a patch exists.</details>
:::

## Key terms

- **Update / patch** — a software release that fixes bugs or security flaws.
- **Backup** — a separate copy of important data, kept somewhere independent of your main device.
- **3-2-1 rule** — a backup guideline: 3 copies, on 2 storage types, with 1 stored separately.
- **Ransomware** — malicious software that encrypts your files and demands payment to restore them.

## Recap

- Delaying updates leaves known, publicly documented flaws unpatched — a genuine risk, not just an annoyance.
- Prioritize updating your operating system, browser, and any apps handling sensitive data; enable automatic updates where available.
- A working backup is one of the most effective defenses against both device loss and ransomware specifically.
- Test your backups occasionally — an untested backup is only a guess that it will work when you actually need it.

**Next up →** [Email basics & safety](#/lesson/00-fresher-basics/email-basics-and-safety)
