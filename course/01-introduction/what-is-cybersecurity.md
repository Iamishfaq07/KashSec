# What is cybersecurity?

Welcome to your very first sub-lesson. We're going to assume you know **absolutely nothing** about this subject — and that's exactly right. By the end of this short lesson you'll understand what cybersecurity actually is, why it exists, and the handful of ideas everything else in the field is built on.

:::tip WHY THIS LESSON
Understanding the *shape* of the field before diving into tools makes everything that follows click faster. Take your time here — nothing needs memorising, only understanding.
:::

## Start with something you already understand: your home

Think about how you protect your home. You lock the front door. You might have a fence, a camera, or a dog. You decide who gets a spare key — family, a trusted neighbour — but not a random stranger on the street. And if you own something especially valuable, like documents or jewellery, you might lock those in a safe as a second layer inside the first.

Notice how many different ideas are quietly at work there:

- **Keeping intruders out** — the locked door.
- **Deciding who is allowed in** — who gets a key.
- **Watching for trouble** — the camera, the dog.
- **Extra protection for the most valuable things** — the safe.
- **Accepting you can't be perfect** — you also have insurance in case.

You do all this almost without thinking, because protecting what matters is a deeply human instinct. Hold onto that feeling — it maps perfectly onto our subject.

## The definition

> **Cybersecurity is the practice of protecting digital things — computers, phones, websites, apps, and the information inside them — from people who want to steal, damage, spy on, or misuse them.**

It's that same home-protecting instinct, applied to the digital world. Every technique you'll ever learn is a digital version of a lock, a camera, a key policy, or a safe.

## What exactly are we protecting?

There are three broad things worth guarding. Almost every topic later in this course is really about defending one of these three:

~~~svg The three pillars of cybersecurity
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#EFA43A"/>
      <stop offset="100%" stop-color="#C77F1E"/>
    </linearGradient>
  </defs>
  <g font-family="Inter, sans-serif" fill="#E9EEF3">
    <!-- Data pillar -->
    <rect x="40" y="60" width="150" height="140" rx="10" fill="#111927" stroke="#3FB6A8" stroke-width="2"/>
    <text x="115" y="95" font-size="18" font-weight="700" text-anchor="middle" fill="#3FB6A8">DATA</text>
    <text x="115" y="125" font-size="12" text-anchor="middle" fill="#8496A6">Photos</text>
    <text x="115" y="145" font-size="12" text-anchor="middle" fill="#8496A6">Passwords</text>
    <text x="115" y="165" font-size="12" text-anchor="middle" fill="#8496A6">Bank details</text>
    <text x="115" y="185" font-size="12" text-anchor="middle" fill="#8496A6">Records</text>
    <!-- Systems pillar -->
    <rect x="225" y="60" width="150" height="140" rx="10" fill="#111927" stroke="url(#g1)" stroke-width="2"/>
    <text x="300" y="95" font-size="18" font-weight="700" text-anchor="middle" fill="#EFA43A">SYSTEMS</text>
    <text x="300" y="125" font-size="12" text-anchor="middle" fill="#8496A6">Laptops</text>
    <text x="300" y="145" font-size="12" text-anchor="middle" fill="#8496A6">Phones</text>
    <text x="300" y="165" font-size="12" text-anchor="middle" fill="#8496A6">Servers</text>
    <text x="300" y="185" font-size="12" text-anchor="middle" fill="#8496A6">Networks</text>
    <!-- Access pillar -->
    <rect x="410" y="60" width="150" height="140" rx="10" fill="#111927" stroke="#E05548" stroke-width="2"/>
    <text x="485" y="95" font-size="18" font-weight="700" text-anchor="middle" fill="#E05548">ACCESS</text>
    <text x="485" y="125" font-size="12" text-anchor="middle" fill="#8496A6">Who can</text>
    <text x="485" y="145" font-size="12" text-anchor="middle" fill="#8496A6">read, write,</text>
    <text x="485" y="165" font-size="12" text-anchor="middle" fill="#8496A6">delete, or</text>
    <text x="485" y="185" font-size="12" text-anchor="middle" fill="#8496A6">execute</text>
    <!-- Roof -->
    <text x="300" y="30" font-size="15" text-anchor="middle" fill="#E9EEF3" font-weight="600">What cybersecurity protects</text>
    <line x1="60" y1="45" x2="540" y2="45" stroke="#213043" stroke-width="1"/>
  </g>
</svg>
~~~

Let's unpack each one:

1. **Data — the information itself.** Your photos, private messages, passwords, medical history, and bank details. For a company: customer records, financial figures, secret plans. Data is often what the attacker actually wants — it can be sold, held for ransom, or used to impersonate you.
2. **Systems — the machines.** Your laptop and phone, and the powerful computers called **servers** that quietly run websites, apps, and businesses behind the scenes. If an attacker controls the machine, they usually control the data on it too.
3. **Access — the rules about who can do what.** Making sure only the right people can open the right doors. A surprising number of real breaches are simply *someone getting access they were never supposed to have* — an employee who sees files they shouldn't, or a stranger who slips into an admin account.

:::note THE CIA TRIAD
A handy shorthand you'll meet in Path 10 is the **CIA triad** — Confidentiality, Integrity, Availability — a more formal way of saying "keep data secret, keep it correct, and keep it available." Just the vocabulary here; we'll unpack it properly later.
:::

## Who are we protecting it from?

The people who try to break in are called **attackers** or **threat actors**. Forget the movie image of a lone genius in a hoodie. In reality they're more often:

- **Organised criminal groups** who treat hacking as a business.
- **Automated programs** that attack millions of targets at once, with no human watching.
- **Insiders** — people who already have some legitimate access and misuse it.
- Occasionally, **nation-states** with huge budgets, patience, and stealth.

You'll meet each type properly in sub-lesson **1.3**.

## A brief origin story — where this field actually came from

Cybersecurity as a distinct discipline is younger than you might expect. In 1988, a graduate student released a self-replicating program onto the fledgling internet — intended as an experiment, not an attack — but a bug in its code caused it to spread far more aggressively than planned, slowing or crashing roughly 10% of the internet's then-tiny number of connected machines. This became known as the **Morris Worm**, and it's widely considered the moment the world realized networked computers needed *dedicated*, ongoing defense — directly leading to the creation of the first Computer Emergency Response Team (CERT) that same year. Every SOC, every CERT, and every "incident response" job title you'll encounter throughout this course traces its lineage back to exactly this kind of realization.

## The attack surface keeps growing

A useful, recurring concept worth introducing early: your **attack surface** is the total sum of everywhere an attacker could possibly try to get in — every device, every account, every piece of software you use. Decades ago, that surface was small: a handful of computers, mostly disconnected from each other. Today it includes your phone, your smart TV, your car's onboard computer, your doorbell camera, your fitness watch, and dozens of cloud accounts — a category of connected everyday devices broadly called the **Internet of Things (IoT)**. Every new connected device is a new potential entry point, which is exactly why the field keeps expanding rather than ever feeling "finished."

## Why the field even exists

A century ago, almost everything valuable was physical, so all security was physical: locks, walls, guards. Today, enormous parts of your life are digital.

- Your **money** is numbers in a bank's computer.
- Your **memories** are photos "in the cloud" (which just means someone else's computers).
- Your **identity** is spread across dozens of online accounts.

As our valuables moved into computers, a new kind of protection had to be invented to guard them there. **That protection is cybersecurity — and because the digital world keeps growing, so does the need for people who understand it.**

## Security is a process, not a product

One more idea worth planting early, since it will save you real frustration later: there is no single tool, setting, or product you can buy or install that makes something "secure" once and for all. A locked door can still be picked; a firewall can still be misconfigured; a strong password can still be phished. Security is better understood as an ongoing **process** — a continuous cycle of assessing risk, applying layered defenses (a concept called **defense in depth**, which you'll see formalized throughout later paths), monitoring for problems, and adapting as new threats emerge. Anyone who tells you a single product makes you "hacker-proof" is, at best, oversimplifying.

:::tip REASSURANCE
You do not need to be a genius or a "maths person." Cybersecurity is mostly curiosity, logical thinking, and patience. Every expert you've heard of started exactly where you are now.
:::

:::challenge Test yourself
In one sentence and without looking, what are the **three broad things** cybersecurity protects?

<details><summary>Show answer</summary>Data (information), systems (machines), and access (who can do what).</details>
:::

:::challenge Map your own attack surface
List every internet-connected device you personally own or regularly use — don't stop at your phone and laptop; think about smart home devices, wearables, your car, and gaming consoles. For each one, note in one phrase what would happen if an attacker gained control of it. Most people are surprised by how long this list actually is.
:::

## Key terms

- **Cybersecurity** — protecting digital things from digital threats.
- **Data** — information (photos, passwords, records).
- **System** — a machine (laptop, phone, server).
- **Server** — a computer that runs websites, apps, or services behind the scenes.
- **Attacker / threat actor** — a person or program trying to break in.
- **Attack surface** — the total sum of everywhere an attacker could possibly attempt entry.
- **Defense in depth** — layering multiple independent security controls rather than relying on any single one.

## Recap

- Cybersecurity is protecting digital things, the same instinct as locking a home.
- We protect **data**, **systems**, and **access**.
- Attackers are often automated or organised — not lone individuals.
- The field exists because our valuable things moved into computers, and it traces its origin as a dedicated discipline back to incidents like the 1988 Morris Worm.
- Your attack surface keeps growing as more everyday devices connect to the internet.
- Security is an ongoing process of layered defense, not a one-time product you install.

???refs
- [Cybersecurity — Wikipedia overview](https://en.wikipedia.org/wiki/Computer_security) — a broad, encyclopedic intro.
- [NIST Cybersecurity Glossary](https://csrc.nist.gov/glossary) — the authoritative dictionary; bookmark this for later paths.
- [Cybersecurity 101 — CISA](https://www.cisa.gov/topics/cybersecurity-best-practices) — US government's introductory guidance for citizens.
- [Kaspersky "What is cybersecurity?"](https://usa.kaspersky.com/resource-center/definitions/what-is-cyber-security) — friendly beginner explainer.
- [The Morris Worm — CISA retrospective](https://www.cisa.gov/news-events/news/morris-worm-30-years-later) — a free, official look back at the incident that helped start the field.
???

**Next up →** [Why it matters to you](#/lesson/01-introduction/why-it-matters)
