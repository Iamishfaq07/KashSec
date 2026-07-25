# A tour of common cyberattacks

You'll spend the rest of this course learning individual attack types in real depth. This lesson is a bird's-eye tour first — a map of the territory, so every deep-dive lesson later on has a place to slot into, rather than arriving as an unconnected fact.

:::tip
Don't worry about memorizing every term perfectly right now. The goal of this lesson is recognition, not mastery — by the end, you should be able to hear any of these terms in the news and roughly know what category of attack it describes.
:::

## Malware — the umbrella term

**Malware** (malicious software) is the broad category covering any software designed to harm, exploit, or gain unauthorized access to a system. Specific types you'll hear constantly:

- **Virus** — malware that attaches itself to legitimate files and spreads when those files are shared
- **Worm** — malware that spreads on its own across networks, with no user action required
- **Ransomware** — malware that encrypts your files and demands payment to unlock them (mentioned in the CIA triad lesson as a classic availability attack)
- **Trojan** — malware disguised as something legitimate or desirable, tricking you into installing it yourself

Path 17 covers malware analysis in real depth; for now, just recognize the family.

## Phishing and social engineering

**Phishing** is a fake message designed to trick you into revealing information or clicking something malicious — covered in real detail in the email-safety lesson back in Path 00. The broader category, **social engineering**, covers any attack that manipulates human psychology rather than exploiting a technical flaw — the gift-card scams and fake-emergency scams from Path 00 both fall under this umbrella, and Path 10 covers the full psychological playbook.

## Attacks against passwords and accounts

- **Credential stuffing** — trying leaked username/password pairs from one breach against many other sites, relying on password reuse (covered in the passwords lesson)
- **Brute-force** — systematically trying every possible password combination
- **Credential phishing** — a fake login page designed to steal your real password when you type it in

## Attacks against websites and applications

- **SQL injection** — tricking a website's database into running commands it shouldn't, by sneaking code into a normal-looking input field (Path 11 covers this hands-on)
- **Cross-site scripting (XSS)** — injecting malicious code into a website that then runs in *other* visitors' browsers
- **DDoS (Distributed Denial of Service)** — flooding a service with fake traffic from many sources at once until it can't handle real users, a textbook availability attack

## Attacks against networks

- **Man-in-the-middle (MITM)** — secretly intercepting communication between two parties who believe they're talking directly to each other
- **Spoofing** — impersonating a trusted source (a device, a website, an email sender) to gain trust or access

## Why this overview matters even though you don't know the details yet

Every one of these terms will come back, explained properly with hands-on labs, later in this course. Having heard them once here means that when Path 11 says "let's exploit a SQL injection vulnerability," you're not hearing the term for the first time — you already know roughly where it fits (an attack against a website's database), and the deep dive builds on that foundation instead of starting from zero.

:::challenge Sort the attacks
Sort these three attacks by which category from this lesson they belong to: (1) a fake email claiming to be your bank, (2) a flood of traffic taking a website offline, (3) malicious code hidden inside a file disguised as a free game.

<details><summary>Show answer</summary>(1) is <strong>phishing / social engineering</strong> — it manipulates trust rather than exploiting a technical flaw. (2) is a <strong>DDoS attack</strong> — an availability attack against a network or service. (3) is a <strong>Trojan</strong> — malware disguised as something desirable to trick you into installing it. Recognizing which broad family an attack belongs to, even before knowing every technical detail, is exactly the skill this lesson is building.</details>
:::

## 🧪 Hands-on lab — spot the category in the news

Find one recent cybersecurity news story (a quick search for "data breach" or "ransomware attack" will surface plenty) and identify which category or categories from this lesson it falls under, based on the article's description of what happened.

:::challenge Test yourself
1. What's the difference between a virus and a worm?
2. Why is phishing categorized separately from malware, even though both can lead to a compromised account?
3. Name the attack type where an attacker secretly intercepts communication between two parties.
:::

## Key terms

- **Malware** — software designed to harm, exploit, or gain unauthorized access to a system.
- **DDoS (Distributed Denial of Service)** — flooding a service with traffic to make it unavailable to legitimate users.
- **Man-in-the-middle (MITM)** — secretly intercepting communication between two parties.
- **Spoofing** — impersonating a trusted source to gain trust or access.

## Recap

- This lesson is a map, not a deep dive — recognition now, real depth in later paths.
- Malware, phishing/social engineering, credential attacks, web application attacks, and network attacks are the broad families most specific attacks fall into.
- Having heard these terms once here means later, hands-on lessons build on a foundation instead of starting from zero.

**Next up →** [The golden rule: permission](#/lesson/01-introduction/the-golden-rule)
