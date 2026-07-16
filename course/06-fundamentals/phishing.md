# Phishing & social engineering

Every technical control in the world can be undone by tricking a human. **Social engineering** exploits psychology, not code — and it remains the single most common way real attackers get their initial foothold.

## Why humans, not firewalls, are usually the weakest link

Verizon's annual Data Breach Investigations Report has consistently found that the vast majority of breaches involve a **human element** — someone clicking a link, entering credentials on a fake page, or being manipulated into an action that bypasses otherwise-solid technical defences. You can have a perfect firewall and still get breached because someone in accounting opened an invoice attachment.

## The psychological levers social engineers pull

Real social engineering, whether over email, phone, or in person, almost always leans on one or more of these:

- **Authority** — "This is the CEO, I need this done now." People defer to perceived power.
- **Urgency** — "Your account will be suspended in 1 hour." Panic short-circuits careful thinking.
- **Fear** — "Suspicious activity detected — verify your identity immediately." Threat triggers compliance.
- **Curiosity** — "See who viewed your profile" / an oddly-named attachment. Hard to resist clicking.
- **Trust/familiarity** — impersonating a known colleague, vendor, or brand.
- **Reciprocity** — offering something small first ("here's a free gift card") to lower guard before the real ask.
- **Social proof** — "Everyone on the team has already filled this out."

Recognising *which lever* is being pulled is often the fastest way to spot an attack in progress, even before you've spotted a technical red flag.

## Phishing — the classic email attack

**Phishing** is a fraudulent message (usually email) designed to trick the recipient into revealing credentials, running malware, or taking a harmful action.

### Anatomy of a phishing email

```
From: "Micros0ft Security" <security@micros0ft-support.com>
Subject: 🚨 Urgent: Unusual sign-in activity detected

We detected a sign-in to your account from an unrecognized device
in Kyiv, Ukraine. If this wasn't you, verify your identity immediately
or your account will be permanently locked in 24 hours.

[Verify My Account Now]  ← links to micr0soft-login.xyz/verify

Microsoft Account Team
```

Red flags to train yourself to spot instantly:

| Red flag | This example |
|---|---|
| Look-alike domain | `micros0ft-support.com` (zero instead of "o") |
| Mismatched/suspicious link | hovering shows `micr0soft-login.xyz`, not a real Microsoft domain |
| Urgency + fear | "24 hours", "permanently locked" |
| Generic greeting | no personal name used |
| Unusual sender for the claimed brand | real companies rarely email from random domains |
| Poor grammar/formatting | not always present in modern, well-crafted phishing — a dangerous myth that it's always obvious |

## Variants of phishing worth knowing by name

- **Spear phishing** — targeted at a specific individual, using researched personal details (their real boss's name, a recent project, a real vendor relationship). Far more convincing than generic phishing.
- **Whaling** — spear phishing aimed specifically at executives (the "big fish") — often to authorise fraudulent wire transfers.
- **Smishing** — phishing via SMS text message.
- **Vishing** — phishing via voice call, often now supercharged by **AI voice cloning** to impersonate a real person's voice convincingly.
- **Business Email Compromise (BEC)** — attacker compromises or spoofs a real executive's email to trick finance staff into wiring money — one of the costliest categories of cybercrime by total dollar losses.
- **Quishing** — phishing via malicious QR codes, increasingly common as QR-based menus/payments became normal.
- **Clone phishing** — taking a real, previously-delivered legitimate email and resending an near-identical copy with a malicious link swapped in.

## Social engineering beyond email

- **Pretexting** — inventing a false scenario to extract information, e.g., calling IT pretending to be a locked-out employee needing a password reset.
- **Baiting** — leaving an infected USB drive labeled "Confidential Salaries.xlsx" in a parking lot, hoping curiosity wins.
- **Tailgating/piggybacking** — following an employee through a badge-locked door without their own access ("Oh, can you hold that door? I forgot my badge.").
- **Quid pro quo** — offering a fake benefit (IT support, a prize) in exchange for information or access.
- **Watering hole** — compromising a website the target group is known to visit regularly, waiting for them to come to you rather than reaching out directly.

## Real, famous examples worth knowing

- **Twitter's 2020 breach** — attackers used a phone spear-phishing campaign against Twitter employees to gain access to internal admin tools, then hijacked major verified accounts (Obama, Musk, Apple) in a Bitcoin scam.
- **RSA SecurID breach (2011)** — a targeted spear-phishing email with a malicious Excel attachment ("2011 Recruitment plan.xls") compromised RSA, eventually affecting their SecurID token security worldwide.
- **Countless BEC cases** — companies routinely lose hundreds of thousands to millions of dollars to a single well-crafted fake "wire transfer" email impersonating a CEO or vendor.

## How organisations defend against social engineering

Because you can't "patch" human psychology the way you patch software, defence is layered:

- **Security awareness training** — regular, realistic training (not just annual compliance-checkbox videos).
- **Simulated phishing campaigns** — organisations send fake-but-harmless phishing emails to their own staff to measure and improve click rates over time.
- **Technical controls that don't rely on human judgement** — email filtering, DMARC/SPF/DKIM (Path 02 territory) to make domain spoofing harder, MFA (so a stolen password alone isn't enough).
- **Verification culture** — normalising "let me call you back on a known number to confirm" for any unusual request, especially involving money or credentials, with zero social penalty for double-checking.
- **Clear reporting paths** — a one-click "Report Phishing" button and a culture where reporting a suspicious email (even a false alarm) is praised, never mocked.

## AI-generated phishing — why the old "poor grammar" tell is dying

The red-flag table above notes that bad grammar isn't a reliable signal any more, and generative AI is the main reason why. Large language models let attackers produce grammatically flawless, contextually convincing phishing emails at essentially zero marginal cost per message — and worse, AI voice cloning (mentioned above under vishing) now needs only a short public audio sample of someone's real voice to produce a convincing fake call. Path 12's AI security material covers the flip side of this same technology directly: AI systems themselves becoming attack targets (via prompt injection) and attack *tools* (via AI-generated phishing content and deepfakes) are two faces of the same underlying shift — the economics of producing convincing deception have dropped dramatically, meaning volume and personalisation that once required real human effort per target can now be automated at scale.

## How to think like a defender when something feels "off"

A simple mental checklist worth internalising for life, not just this course:

1. **Am I being rushed?** Urgency is the single most common lever — slow down deliberately.
2. **Does the request match how this person/organisation normally communicates?**
3. **Can I verify through a separate, known-good channel** (calling a known phone number, not one in the suspicious message)?
4. **What does the sender actually gain if I comply?** If it doesn't make sense for them to need this from you specifically, be suspicious.
5. **Would I be embarrassed if I reported this and it turned out to be legitimate?** (You shouldn't be — reporting false alarms is *good*, not embarrassing.)

## 🧪 Lab — Phishing email teardown

Search for "phishing email examples" (many banks, universities, and CERTs publish real anonymised examples for training purposes) and find three real ones. For each, identify:

1. Which psychological lever(s) are being pulled?
2. What are the technical red flags (domain, links, headers if shown)?
3. What variant is it (spear phishing, BEC, vishing, etc.)?
4. What's the one action that would fully defeat this attack (without needing any technical skill)?

This exact exercise — teardown of real phishing samples — is standard onboarding at many security teams.

:::challenge Test yourself
An email claims to be from your CEO, asks you to urgently buy $2,000 in gift cards for a "client gift" and send the codes by reply, and says they're "in back-to-back meetings and can't take calls." Which two psychological levers are being combined here, and what's the single best verification step?

<details><summary>Show answer</summary><strong>Authority</strong> (claims to be the CEO) and <strong>urgency</strong> (needs it right now), plus a specific excuse to <strong>prevent verification</strong> (can't take calls) — that unavailability excuse is itself a major red flag. The best step: contact the CEO through a known, separate channel (their real known phone number or in person) rather than replying to the email, regardless of the stated unavailability.</details>
:::

## Key terms

- **Social engineering** — manipulating people rather than exploiting technical bugs.
- **Phishing / spear phishing / whaling** — generic, targeted, and executive-targeted email deception.
- **Smishing / vishing / quishing** — SMS-, voice-, and QR-code-based phishing.
- **BEC (Business Email Compromise)** — impersonating executives to trigger fraudulent payments.
- **Pretexting / baiting / tailgating** — non-email social engineering techniques.

## Recap

- Humans are consistently the most exploited "vulnerability" in real breaches.
- Phishing and its variants exploit authority, urgency, fear, and trust.
- Spear phishing and BEC are far more dangerous than generic mass phishing.
- Defence combines training, simulated phishing, technical filtering, MFA, and a strong verification culture.
- Slowing down and verifying through a separate channel defeats the vast majority of these attacks.

???refs
- [CISA — Avoiding Social Engineering and Phishing Attacks](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) — official US guidance.
- [Verizon DBIR](https://www.verizon.com/business/resources/reports/dbir/) — annual data on the human element in breaches.
- [FBI IC3 — Business Email Compromise](https://www.ic3.gov/Media/Y2023/PSA230609) — real BEC loss statistics.
- [Google/Jigsaw — Phishing Quiz](https://phishingquiz.withgoogle.com/) — free, excellent hands-on practice spotting real vs fake emails.
???

**Next up →** [Protect yourself: practical hardening](#/lesson/06-fundamentals/protect-yourself)
