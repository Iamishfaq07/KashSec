# Path 01 — Introduction to Cybersecurity

> **Level:** Absolute beginner · **Lessons:** 5 · **Assumed knowledge:** none at all.

Welcome to the very beginning. This path has one job: to take someone who knows nothing about cybersecurity and give them a solid, unshakeable mental picture of what the field is, why it exists, who the players are, and the one rule that keeps you on the right side of the law. There is no technical work here yet — no commands, no tools. We are building understanding first, because everything you do later will make far more sense once these ideas are firm. Read slowly. Nothing here needs memorising; it needs *understanding*.

---

## Lesson 1.1 — What is cybersecurity?

### Why this matters
If you cannot explain in one plain sentence what cybersecurity is, everything built on top of it will feel like floating jargon. This lesson gives you that sentence and the picture behind it. Get this right and the whole field has a shape to hang on.

### Start with something you already understand: your home
Think about how you protect your home. You lock the front door so strangers cannot wander in. Maybe you have a fence, a camera by the door, or a dog that barks. You decide who gets a spare key — family, a trusted neighbour — but not a random stranger on the street. And if you own something especially valuable, like important documents or jewellery, you might lock *those* away in a safe, adding a second layer of protection inside the first.

Notice how many different ideas are quietly at work there:

- **Keeping intruders out** (the locked door).
- **Deciding who is allowed in** (who gets a key).
- **Watching for trouble** (the camera, the dog).
- **Extra protection for the most valuable things** (the safe).
- **Accepting you can't make it perfect** — you lock up, but you also have insurance in case.

You do all this almost without thinking, because protecting what matters is a deeply human instinct. Hold onto that feeling, because it maps perfectly onto our subject.

### The definition
> **Cybersecurity is the practice of protecting digital things — computers, phones, websites, apps, and the information inside them — from people who want to steal, damage, spy on, or misuse them.**

It is that same home-protecting instinct, applied to the digital world. Every technique you will ever learn is a digital version of a lock, a camera, a key policy, or a safe.

### What exactly are we protecting?
In the digital world there are three broad things worth guarding. Almost every topic later in this course is really about defending one of these three, so keep them in your back pocket:

1. **Data — the information itself.** Your photos, private messages, passwords, medical history, and bank details. For a company: customer records, financial figures, secret plans. Data is often what the attacker actually wants — it can be sold, held for ransom, or used to impersonate you.
2. **Systems — the machines.** Your laptop and phone, and the powerful computers called **servers** that quietly run websites, apps, and businesses behind the scenes. If an attacker controls the machine, they usually control the data on it too.
3. **Access — the rules about who can do what.** Making sure only the right people can open the right doors. A surprising number of real breaches are simply *someone getting access they were never supposed to have* — an employee who can see files they shouldn't, or a stranger who slips into an admin account.

A handy shorthand you'll see later is the **CIA triad** — Confidentiality, Integrity, Availability — which is just a more formal way of saying "keep data secret, keep it correct, and keep it available." We'll meet it properly in Path 06.

### Who are we protecting it from?
The people who try to break in are called **attackers** or **threat actors**. Forget the movie image of a lone genius in a dark hoodie. In reality they are more often:

- **Organised criminal groups** who treat hacking as a business, chasing money.
- **Automated programs** that attack millions of targets at once with no human watching.
- **Insiders** — people who already have some legitimate access and misuse it.
- Occasionally, **nation-states** with huge budgets and patience, targeting governments and big companies.

You'll meet each type properly in Lesson 1.3.

### Why the field exists at all
A century ago, almost everything valuable was physical, so all security was physical: locks, walls, guards. Today, enormous parts of your life are digital. Your money is numbers in a bank's computer. Your memories are photos in "the cloud" (which just means someone else's computers). Your identity is spread across dozens of online accounts. As our valuables moved into computers, a new kind of protection had to be invented to guard them there. **That protection is cybersecurity — and because the digital world only keeps growing, so does the need for people who understand it.**

> 💡 **Reassurance:** You do not need to be a genius or a "maths person." Cybersecurity is mostly curiosity, logical thinking, and patience. Every expert you've heard of started exactly where you are now — knowing nothing.

### 🚩 Challenge
In one sentence and without looking, what are the **three broad things** cybersecurity protects?

<details><summary>Answer</summary>Data (information), systems (machines), and access (who can do what).</details>

### Key terms
- **Cybersecurity** — protecting digital things from digital threats.
- **Data** — information (photos, passwords, records).
- **System** — a machine (laptop, phone, server).
- **Server** — a powerful computer that runs websites, apps, or services behind the scenes.
- **Attacker / threat actor** — a person or program trying to break in.

### Recap
- Cybersecurity is protecting digital things, the same instinct as locking and guarding a home.
- We protect **data**, **systems**, and **access**.
- Attackers are often automated or organised — not lone individuals.
- The field exists because our valuable things moved into computers, and anyone patient and curious can learn it.

---

## Lesson 1.2 — Why it matters to you

### Why this matters
Most beginners quietly believe "I'm too small to be a target," and that single belief is what gets them hacked. This lesson dismantles it, then shows you the two big rewards of learning this subject.

### "Why would anyone attack *me*?"
It's a fair question. The mistake hidden inside it is imagining a hacker *choosing you specifically*. For ordinary people, that's almost never how it works. Real attacks are far more like **fishing with a giant net than with a single hook.**

An attacker writes a program **once**, then points it at *millions* of people or websites automatically. The program tries the same trick on everyone, day and night, with no human involved. It doesn't know or care who you are. It only knows that out of a million attempts, a few thousand will succeed. If you happen to have a weak password or you click the wrong link, the net catches you — not because you were chosen, but simply because you were **reachable**.

> 💡 **The mindset shift every beginner needs:** you are not too small to be attacked. Automation makes *everyone* a target, all the time. "I'm not important enough" is not protection — it's a comforting myth.

### Real things that happen to ordinary people every single day
- **Phishing.** A fake email or text that looks like it's from your bank, a courier, or a social network tricks you into typing your password into a fake copy of the real site. Now the attacker has it.
- **Password reuse.** You used the same simple password on ten sites. One of those sites gets breached and leaks it. Attackers then try that password on your email, your bank, your shopping accounts — and it works, because you reused it. This is called **credential stuffing**, and it's devastatingly effective.
- **Ransomware.** You open an unexpected attachment or download a "free" program. Hidden malware quietly **encrypts** (scrambles) all your files — photos, documents, everything — then demands money to unscramble them.
- **Account takeover.** An attacker gets into your **email**. Because your email can reset the password of nearly every other account you own, that one foothold gives them your whole digital life.

None of these required you to be famous or rich. They required you to be online — which is everyone.

### Two very good reasons to learn this
**Reason one: it protects you and the people you love.** Even the basics in this course put you ahead of most people online. You'll spot the fake email, use strong and unique passwords, understand why "you've won a prize!" is bait, and know how to lock down the accounts that matter. You'll become the person your family and friends turn to for help.

**Reason two: it's one of the best careers you can build right now.** There is a genuine, worldwide shortage of skilled security people — far more open roles than there are people to fill them. That means good pay, the freedom to work remotely from almost anywhere, and strong job security. And unlike many professions, you can break in **without an expensive degree** if you build real, demonstrable skills — which is exactly what this course is designed to help you do.

> 💡 Every single skill you learn here is a skill an employer will pay for. You are not just learning a hobby to protect yourself — you're laying the first bricks of a serious career.

### 🚩 Challenge
What's the name of the attack where a password leaked from one site is automatically tried on many other sites?

<details><summary>Answer</summary>Credential stuffing (made possible by password reuse).</details>

### Key terms
- **Phishing** — fake messages that trick you into giving up secrets.
- **Credential stuffing** — reusing a leaked password across many sites automatically.
- **Ransomware** — malware that scrambles your files and demands payment.
- **Account takeover** — an attacker gaining control of one of your accounts (often email first).

### Recap
- Most attacks are automated and aimed at everyone at once — not at you personally.
- Being "small" doesn't protect you; being reachable is what matters.
- Everyday attacks include phishing, password reuse, ransomware, and account takeover.
- Learning this protects you and opens the door to a high-demand, well-paid career.

---

## Lesson 1.3 — Types of hackers (and the jobs)

### Why this matters
The word "hacker" carries a lot of baggage. Before you can decide what kind of security person *you* want to be, you need to see the real map of who's who — and the surprising variety of careers this field contains.

### What a "hacker" really is
Strip away the movies and a hacker is simply **someone who deeply understands how a system works and can make it do things it wasn't designed to do.** That skill, by itself, is neither good nor evil. A locksmith and a burglar have the exact same knowledge of locks. The difference is **intent and permission** — not knowledge.

### The "hats": good, bad, and in between
The field traditionally sorts hackers by the colour of an imaginary hat, borrowed from old cowboy films where the hero wore white and the villain wore black.

- **White hat** — the good guys, also called **ethical hackers**. They break into systems *with permission* to find weaknesses and help fix them before a criminal does. They're hired by companies or work through official programs. **This is what you are training to become.**
- **Black hat** — the criminals. They break in *without permission* to steal, damage, or spy. This is illegal and can lead to prison. We study how they think so we can defend against them — we never act like them.
- **Grey hat** — the murky middle. They might poke at a system without permission but without meaning harm, perhaps finding a flaw and reporting it uninvited. Their intentions may be good, but because they had **no permission**, what they do is usually still illegal and risky.

> ⚠️ The single line separating a white hat from a criminal is **permission**. Same skills, same tools — but the ethical hacker was *invited*. The next lesson is entirely about this line.

### The jobs you can aim for
"Cybersecurity" is not one job — it's a whole industry, the way "medicine" contains surgeons, nurses, and pharmacists. Here are the most popular roles so you can start picturing where you might fit:

- **SOC Analyst** — SOC stands for **Security Operations Centre**, a kind of security control room. These analysts watch alerts and network activity in real time, spot attacks as they happen, and respond. It's one of the most common *first* jobs in security.
- **Penetration Tester ("pentester")** — paid to legally break into a company's systems, then write a report explaining exactly how, so the holes can be closed. Very hands-on and offensive.
- **Bug Bounty Hunter** — an independent hacker who finds flaws in companies' websites through official programs and earns a cash reward for each valid one. Work from home, on your own schedule, for companies worldwide.
- **AppSec (Application Security) Engineer** — works alongside software developers to build safe software from the start, so bugs never ship. Great if you also enjoy building things.
- **Cloud Security Engineer** — secures the huge systems companies run on cloud services like Amazon, Microsoft, and Google. Fast-growing and in high demand.
- **Digital Forensics & Incident Responder (DFIR)** — the detective. When an attack happens, they investigate what the attacker did, how they got in, and how to recover.
- **GRC / Security Analyst** — Governance, Risk & Compliance. The strategic side: managing risk, writing policy, and making sure the organisation meets security standards.

You don't have to choose now. As you move through this course you'll naturally discover what excites you — breaking things, defending them, or investigating them.

### 🚩 Challenge
An ethical hacker and a criminal can have identical skills and use identical tools. What single thing separates them?

<details><summary>Answer</summary>Permission — the ethical hacker was authorised to test.</details>

### Key terms
- **White / black / grey hat** — ethical, criminal, and in-between hackers.
- **SOC** — Security Operations Centre; a real-time defence team.
- **Pentester** — a professional who legally breaks in and reports how.
- **DFIR** — Digital Forensics & Incident Response; the investigators.

### Recap
- A hacker is just someone who deeply understands and can bend systems — the skill is neutral.
- White hats hack with permission; black hats without and with harmful intent; grey hats sit uneasily between.
- Permission is the one line between ethical and criminal.
- Security is many careers: SOC, pentest, bug bounty, AppSec, cloud, forensics, GRC.

---

## Lesson 1.4 — The golden rule: only touch what you're allowed to

### Why this matters
This is the most important lesson in the entire course. If you forget everything else in this path, remember this. Everything you'll learn is genuinely powerful, and power pointed at the wrong target causes real harm and real legal trouble. Read this slowly, twice.

### The rule
> **Never test, scan, or hack any system unless you own it, or you have clear, explicit permission.**

That's the whole thing. It sounds simple — and it is — but people get into trouble by inventing exceptions. There are none.

- "I only *looked*" — still unauthorised access.
- "I was just *curious*" — not a defence in any court.
- "I didn't *change* anything" — doesn't matter.

In most countries, simply **accessing a computer system without permission is a crime**, even if you cause no damage at all.

### Why the law is this strict
Imagine someone walking down your street at night, quietly trying every front-door handle to see which are unlocked. Even if they never step inside, you'd feel violated, and the police would take it seriously. Networks work the same way. "Just checking whether the door is open" on a computer you don't own is treated as an attempt to break in — because the owner can't read your mind to know your intentions were harmless.

> ⚠️ Unauthorised hacking has led to real arrests, criminal records, and prison — including for teenagers who genuinely "just wanted to learn." A criminal record can follow you for life and, ironically, shut you out of the very security career you were building. It is never worth it.

### The good news: endless legal ground to practise on
You will never need to touch a system you don't own, because the community has built an enormous amount of **legal, safe, and often free** places designed specifically for practice:

- **Your own lab.** In Path 03 you'll build a safe practice computer *inside* your own machine (a "virtual machine"). You own it, so attack it all you like.
- **Training platforms.** [TryHackMe](https://tryhackme.com), [Hack The Box](https://hackthebox.com), and [PortSwigger's Web Security Academy](https://portswigger.net/web-security) give you deliberately vulnerable machines and guided lessons. This is where most professionals practise.
- **Official practice targets.** For example, the makers of Nmap run a server at `scanme.nmap.org` specifically so people can legally practise scanning.
- **Bug bounty programs.** Real companies publicly invite hackers to test their sites and even pay rewards — but you must stay strictly inside the **scope** (the published list of what you're allowed to touch) and their rules.

### A simple test before you ever act
Before running any tool at anything, ask yourself one question:

> **"Do I own this, or has someone clearly given me permission to test it?"**

If the answer isn't a confident *yes*, stop. Don't touch it. When in doubt, practise on your lab or a training platform. This one habit will protect you for your entire career.

### 🚩 Challenge
You find a website with an obvious-looking flaw. You're sure you could confirm it in seconds and you'd never cause harm. It's not yours and you have no permission. What do you do?

<details><summary>Answer</summary>Nothing — you leave it alone. Without ownership or permission, testing it is illegal regardless of intent. Practise the same technique on a legal lab instead, or if it runs a bug bounty program, test only within that program's scope.</details>

### Key terms
- **Authorisation / permission** — explicit approval to test a system.
- **Scope** — the exact list of assets a program allows you to test.
- **Unauthorised access** — touching a system without permission; a crime in most places.

### Recap
- Only ever test what you own or have explicit permission to test — no exceptions.
- Unauthorised access is a crime even with no damage and no bad intent.
- There's endless legal ground: your lab, TryHackMe, Hack The Box, PortSwigger, `scanme.nmap.org`, in-scope bug bounties.
- Before acting, always ask: "Do I own this or have clear permission?" If not, stop.

---

## Lesson 1.5 — How to actually learn this (and not give up)

### Why this matters
Most people who start cybersecurity quit — not because it's too hard, but because they study it the wrong way and burn out. A few simple habits make the difference between quitting in a month and still going strong in a year.

### Habit 1: Build the base before the fun
It is tempting to jump straight to "hacking." Resist it. The people who last are the ones who first understand **networking, Linux, and how the web works**. Skipping these is the single biggest reason beginners plateau and feel stuck — they can run a tool but have no idea what it's actually doing. That's exactly why this course spends its early paths on foundations. Trust the order.

### Habit 2: Learn by doing, not just reading
Reading about a command teaches you almost nothing; *typing it and seeing what happens* teaches you a lot. Do every 🧪 lab. Break things in your lab on purpose and fix them. Knowledge that passes through your fingers sticks; knowledge that only passes through your eyes fades by morning.

### Habit 3: Take notes like a professional
Real hackers keep detailed notes — every command, every finding, every "aha." Start a simple notes document from lesson one. Writing something in your own words is how you find out whether you actually understood it. Your notes will also become your personal reference and, later, the basis of your reports.

### Habit 4: Get comfortable being stuck
You will be confused constantly, forever. That is not a sign you're failing — it *is* the job. Every professional spends their day googling errors and reading documentation. Being stuck, searching, and slowly working it out is the actual skill. Learn to enjoy the puzzle.

### Habit 5: Go slow to go fast
There's no prize for rushing. It is far better to deeply understand one lesson a day than to skim ten and retain none. Depth beats speed every time in this field.

> 💡 A realistic pace: aim for one solid lesson per day, do the lab, and jot a few notes. In a few months of that quiet consistency, you'll be shocked how far you've come.

### 🧪 Lab — Set up your notes
1. Create a folder called `cyber-notes` on your computer (or start a free account on a notes app).
2. Make your first note titled "Path 01 — Introduction."
3. In your own words, write down: what cybersecurity is, and the golden rule about permission.
4. From now on, add a short note after every lesson. This habit alone will put you ahead of most learners.

### Recap
- Build foundations (networking, Linux, web) before jumping to hacking.
- Learn by doing — do every lab, break and fix things.
- Take notes in your own words from day one.
- Being stuck is normal and is the real skill; go slow to go fast.

---

## You've finished Path 01 🎉

You now understand what cybersecurity is, why it matters even to "small" targets, who the different hackers are, the careers ahead of you, the one legal rule that keeps you safe, and how to study so you don't burn out.

**Next up → `02-networking.md`:** we get technical (gently) and learn how computers actually talk to each other — the foundation under every attack and defence you'll ever study.
