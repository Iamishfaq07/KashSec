# Staying safe online (phishing & scams)

Here's a fact that surprises most beginners: the vast majority of successful cyberattacks don't involve any "hacking" of computers at all — they involve tricking a human. This category of attack is called **social engineering**, and **phishing** is by far its most common form. Understanding it is arguably more immediately useful to your own safety than any technical skill in this entire course.

## What is phishing?

**Phishing** is the practice of sending fraudulent messages — usually email, but increasingly text messages ("smishing") and phone calls ("vishing") — that impersonate a trusted source to trick you into revealing sensitive information, clicking a malicious link, or transferring money.

```mermaid
flowchart LR
    A["Attacker crafts message\nimpersonating your bank/boss/service"] --> B["You receive it,\nit looks legitimate"]
    B --> C{"Do you notice\nthe red flags?"}
    C -->|No| D["You click the link /\ngive up credentials"]
    C -->|Yes| E["You report it,\nno harm done"]
    D --> F["Attacker gains access\nto your account or money"]
```

## Why phishing actually works — the psychology behind it

Phishing isn't random luck — it deliberately exploits well-documented human psychological tendencies, the same principles studied extensively in the field of persuasion research: **authority** (we tend to comply with requests that appear to come from someone in charge), **urgency/scarcity** (pressure to act fast short-circuits careful thinking), **social proof** ("everyone else already verified their account"), and **reciprocity** (an unexpected "gift" or refund notification creates a felt obligation to respond). Understanding that these are deliberate, well-studied psychological levers — not just "attackers got lucky" — helps explain why even careful, intelligent people fall for well-crafted phishing under the right pressure, and why simply "being smart" isn't a reliable defense on its own; recognizing the *pattern* is what actually works.

## The most common phishing patterns

- **Urgency and fear** — "Your account will be suspended in 24 hours unless you verify now." Attackers manufacture pressure so you act before you think.
- **Impersonation of authority** — fake emails from your bank, your company's IT department, a delivery service, or even your own boss (this specific one is called **CEO fraud** or **business email compromise**).
- **Too-good-to-be-true offers** — fake prize wins, investment schemes, and "click here to claim" links.
- **Lookalike domains** — a link that looks like `paypa1.com` (with a "1" instead of an "l") or `amaz0n-support.net`, close enough to fool a quick glance.
- **Attachments disguised as documents** — invoices, resumes, or shipping notices that are actually malware (tying directly back to the file-extension trick from an earlier lesson).

### Typosquatting and homograph attacks — lookalike domains, explained deeper

**Typosquatting** registers domains that are one small typo away from a legitimate one (`gmial.com` instead of `gmail.com`), banking on the fact that people mistype URLs directly, or don't notice small typos in a link. A more sophisticated variant, the **homograph attack**, exploits the fact that many different alphabets contain characters that *look* visually identical to Latin letters (a Cyrillic "а" looks pixel-for-pixel identical to a Latin "a" in most fonts) — letting an attacker register a domain that displays as `аpple.com` in a browser's address bar while actually being a completely different underlying domain name. Modern browsers include some protection against the most common homograph patterns, but it's not foolproof, which is exactly why the "verify through a separate, known channel" habit below matters more than visually inspecting a URL alone.

:::danger Real-world scale of the problem
Phishing consistently ranks as the #1 initial access method in major data breach reports year after year (see Verizon's annual Data Breach Investigations Report in the references below). This isn't a rare, exotic threat — it's the everyday front door attackers use most.
:::

## Spotting the red flags

When you receive an unexpected message asking you to act, check these before doing anything:

1. **Hover before you click** — on desktop, hover over any link (without clicking) to see the actual destination URL in your browser or email client's status bar. Does it match where it claims to go?
2. **Check the sender's actual email address**, not just the display name — "Amazon Support" can be typed as the display name for literally any email address.
3. **Look for urgency and pressure tactics** — legitimate organizations rarely demand instant action under threat.
4. **Check for generic greetings** — "Dear Customer" instead of your actual name can be a sign of a mass phishing campaign (though targeted attacks, called **spear phishing**, can be personalized and much harder to spot).
5. **Verify through a separate channel** — if an email claims to be from your bank, don't click anything in it; instead, open your browser separately and log in directly, or call the number printed on your card.

:::tip
When in doubt, don't click — go directly to the website yourself by typing the address you already know, or call the organization using a phone number you find independently (not one provided in the suspicious message itself).
:::

## Beyond email — other common scam channels

- **Fake tech support calls/pop-ups** — a pop-up claiming "Your computer is infected, call this number now" is virtually always a scam designed to get remote access to your machine or your credit card.
- **Social media scams** — fake giveaways, romance scams, and cryptocurrency "investment" schemes are extremely common and specifically designed to exploit trust and urgency.
- **QR code phishing ("quishing")** — a malicious QR code (on a poster, a parking meter, or even printed on a fake sticker over a legitimate one) that leads to a phishing site — increasingly common as QR codes became a normal part of daily life.

## Other social engineering techniques worth knowing

Phishing is the most common form of social engineering, but not the only one — Path 10 covers this category in more depth, but it's worth previewing a few other terms now, since you'll encounter them by name throughout this course:

- **Pretexting** — inventing a fabricated scenario ("I'm calling from IT, I need to verify your password to fix an issue with your account") to extract information under false pretenses, often over the phone.
- **Baiting** — leaving something enticing (a USB drive labeled "Confidential — Salaries 2026" left in a parking lot) for a curious victim to pick up and plug in, hoping curiosity overrides caution.
- **Tailgating (piggybacking)** — physically following an authorized person through a secure door without their own access badge, relying on politeness ("could you hold the door?") rather than any digital trick at all.

## 🧪 Hands-on lab — build your own phishing radar

1. Look through your email's spam/junk folder — most providers catch a lot of phishing automatically, giving you a safe, real-world sample to study.
2. Pick one flagged email and identify at least three red flags from the list above (sender address, urgency language, suspicious links, generic greeting, etc.) without clicking anything inside it.
3. Try [Google's free Phishing Quiz](https://phishingquiz.withgoogle.com/) — a short, well-designed interactive test that shows real (defanged) phishing examples and explains what gives each one away.
4. Write down, in your own words, the one red flag you personally find hardest to spot — awareness of your own blind spot is genuinely valuable.
5. Find your email provider's official "report phishing" button (usually built directly into the interface) and use it on one genuine phishing email from your spam folder — this feeds real data back to providers that helps them improve filtering for everyone, not just you.
6. For a message using authority or urgency (from Task 2, or a fresh example), write one sentence identifying which specific psychological lever from this lesson's "why phishing works" section it's using.

:::challenge Test yourself
Why is "hover over the link to check where it actually goes" more reliable than just reading the link text itself?
<details><summary>Show answer</summary>The visible text of a link and its actual destination are two completely independent things in HTML — an attacker can display the text <code>https://yourbank.com</code> while the link secretly points anywhere they want, such as <code>https://yourbank-secure-login.attacker.net</code>. Hovering (or long-pressing on mobile) reveals the <em>real</em> underlying URL your browser will actually navigate to, which is the only reliable way to verify a link before clicking — reading the displayed text alone tells you nothing trustworthy about where you'll actually end up.</details>
:::

## Key terms

- **Phishing** — fraudulent messages impersonating a trusted source to steal information or money.
- **Spear phishing** — a personalized, targeted phishing attack aimed at a specific individual.
- **Social engineering** — manipulating people (rather than exploiting technical flaws) to gain access or information.
- **Smishing / vishing** — phishing via text message / phone call.
- **Typosquatting / homograph attack** — registering domains a typo or visual character trick away from a legitimate one.
- **Pretexting / baiting / tailgating** — other core social engineering techniques beyond phishing.
- **Business email compromise (CEO fraud)** — impersonating a company executive to authorize fraudulent transfers.

## Recap

- Most successful attacks target humans, not machines — phishing is the most common form, deliberately exploiting well-studied psychological levers like authority and urgency.
- Watch for urgency, impersonation, lookalike domains (including sophisticated homograph tricks), and unexpected attachments.
- Hover to verify real link destinations; verify unexpected requests through a separate, trusted channel.
- Scams have expanded well beyond email into texts, calls, social media, and even QR codes; social engineering itself extends beyond phishing into pretexting, baiting, and tailgating.

???refs
- [Google's Phishing Quiz](https://phishingquiz.withgoogle.com/) — free, interactive, genuinely useful practice.
- [Verizon Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/) — the annual industry-standard report on how real breaches actually happen.
- [CISA: Recognize and Report Phishing](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) — official US government guidance.
???

**Next up →** [How to learn tech effectively](#/lesson/00-fresher-basics/how-to-learn-tech)
