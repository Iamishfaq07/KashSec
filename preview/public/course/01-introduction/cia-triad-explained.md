# The CIA Triad: the three things security actually protects

Every security control you'll learn about in this entire course — firewalls, encryption, backups, access control — exists to protect one of exactly three properties. This lesson introduces that framework now, early, so you have a mental hook to hang everything else on.

:::tip
Nothing to do with the intelligence agency — CIA here stands for **Confidentiality, Integrity, Availability**. Once you have this framework, you'll find yourself using it to instantly categorize almost any security problem you encounter for the rest of this course.
:::

## Confidentiality: keeping secrets secret

**Confidentiality** means only authorized people can see specific information. A password leak, a data breach exposing customer records, or someone reading your private messages are all confidentiality failures — the information didn't change, and the system didn't go down, but it ended up in front of eyes it shouldn't have.

## Integrity: keeping information accurate and untampered

**Integrity** means information stays accurate and hasn't been secretly changed by someone unauthorized. If an attacker can't read your bank balance but *can* quietly change the number, that's an integrity failure — often more dangerous than a confidentiality failure, because the damage isn't just exposure, it's corrupted trust in data everyone relies on being accurate.

## Availability: keeping systems usable when you need them

**Availability** means systems and data are actually accessible when legitimate users need them. A website knocked offline by a flood of fake traffic (a **DDoS attack**, covered properly in Path 12), or files locked by ransomware demanding payment, are both availability failures — nothing was necessarily read or changed, but the legitimate user simply can't get to what they need.

## Why the triad matters: not every threat attacks all three equally

Understanding which leg of the triad a given attack targets tells you a lot about how to defend against it:

| Scenario | Which leg fails | Why |
|---|---|---|
| A hacker steals a customer database | Confidentiality | Data was read by someone unauthorized |
| An attacker changes grades in a school's system | Integrity | Data was altered, not just seen |
| A hospital's systems are knocked offline by ransomware | Availability | Data can't be accessed at all, even by legitimate staff |

Some attacks hit more than one leg at once — ransomware, for instance, typically threatens both availability (files are locked) *and* confidentiality (attackers increasingly threaten to leak the data too, a tactic called double extortion).

:::challenge Categorize the attack
An attacker breaks into a company's inventory system and doesn't steal anything or take it offline — they just quietly change stock counts so certain products appear out of stock when they aren't.

<details><summary>Hint</summary>Was anything read that shouldn't have been? Did the system go down? What actually changed?</details>
<details><summary>Show answer</summary>This is an <strong>integrity</strong> failure. Nothing was leaked (confidentiality intact) and the system stayed online (availability intact) — but the data itself was altered without authorization, corrupting the accuracy of information the business depends on. This is exactly the kind of subtle attack the triad framework helps you spot: it's easy to focus security effort on "keeping attackers out" (confidentiality) and "keeping the lights on" (availability) while under-investing in making sure the data itself can't be quietly tampered with.</details>
:::

## 🧪 Hands-on lab — apply the triad to your own life

Think of three things you personally protect (a bank account, a private journal, a work file). For each, identify which leg of the triad matters most to you, and one concrete thing you already do (or should start doing) to protect it.

:::challenge Test yourself
1. Which leg of the CIA triad does a stolen password primarily threaten?
2. Why might an integrity failure sometimes be more dangerous than a confidentiality failure?
3. Name one attack type that threatens two legs of the triad at once, and explain how.
:::

## Key terms

- **Confidentiality** — only authorized people can access specific information.
- **Integrity** — information stays accurate and unaltered by unauthorized parties.
- **Availability** — systems and data remain accessible to legitimate users when needed.

## Recap

- The CIA triad (Confidentiality, Integrity, Availability) is the framework nearly every security control ultimately serves.
- Different attacks target different legs — a data breach hits confidentiality, tampered data hits integrity, and an outage hits availability.
- Some attacks, like modern ransomware, deliberately threaten multiple legs at once.
- Learning to instantly categorize "which leg does this attack threaten?" is one of the most useful habits you'll build in this entire course.

**Next up →** [Types of hackers & careers](#/lesson/01-introduction/types-of-hackers)
