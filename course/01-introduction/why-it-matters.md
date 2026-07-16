# Why it matters to you

Most beginners quietly believe *"I'm too small to be a target"*, and that single belief is what gets them hacked. This lesson dismantles it, then shows you the two big rewards of learning this subject.

:::tip THE MINDSET SHIFT
By the end of this lesson you should be able to explain to a family member *why* automated attacks target everyone, not just the "important" people.
:::

## "Why would anyone attack *me*?"

It's a fair question. The mistake hidden inside it is imagining a hacker *choosing you specifically*. For ordinary people, that's almost never how it works. Real attacks are far more like **fishing with a giant net than with a single hook.**

An attacker writes a program **once**, then points it at *millions* of people or websites automatically. The program tries the same trick on everyone, day and night, with no human involved. It doesn't know or care who you are. It only knows that out of a million attempts, a few thousand will succeed. If you happen to have a weak password or you click the wrong link, the net catches you — not because you were chosen, but simply because you were **reachable**.

~~~svg How automated attacks scale
<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <!-- Attacker -->
  <circle cx="80" cy="130" r="35" fill="#E05548" opacity="0.2" stroke="#E05548" stroke-width="2"/>
  <text x="80" y="135" font-size="12" text-anchor="middle" fill="#E05548" font-weight="700">Attacker</text>
  <text x="80" y="185" font-size="10" text-anchor="middle" fill="#8496A6">1 program</text>
  <!-- Arrows to victims -->
  <g stroke="#EFA43A" stroke-width="1.5" fill="none" opacity="0.7">
    <line x1="120" y1="115" x2="250" y2="40"/>
    <line x1="120" y1="120" x2="250" y2="80"/>
    <line x1="120" y1="125" x2="250" y2="120"/>
    <line x1="120" y1="135" x2="250" y2="160"/>
    <line x1="120" y1="140" x2="250" y2="200"/>
    <line x1="120" y1="145" x2="250" y2="240"/>
  </g>
  <!-- Victims -->
  <g font-size="11" fill="#E9EEF3">
    <circle cx="280" cy="40" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <circle cx="280" cy="80" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <circle cx="280" cy="120" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <circle cx="280" cy="160" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <circle cx="280" cy="200" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <circle cx="280" cy="240" r="12" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <text x="320" y="45" fill="#8496A6">✗ resisted</text>
    <text x="320" y="85" fill="#8496A6">✗ resisted</text>
    <text x="320" y="125" fill="#E05548">✓ caught (weak password)</text>
    <text x="320" y="165" fill="#8496A6">✗ resisted</text>
    <text x="320" y="205" fill="#E05548">✓ caught (clicked phishing)</text>
    <text x="320" y="245" fill="#8496A6">✗ resisted</text>
  </g>
  <text x="300" y="20" font-size="12" text-anchor="middle" fill="#E9EEF3" font-weight="600">A single program → millions of targets → some are always caught</text>
</svg>
~~~

:::warn THE MINDSET SHIFT EVERY BEGINNER NEEDS
You are **not too small to be attacked**. Automation makes *everyone* a target, all the time. "I'm not important enough" is not protection — it's a comforting myth.
:::

## Real things that happen to ordinary people every single day

Here are the four attacks that account for the vast majority of everyday breaches. Every one of them is automated and non-targeted:

### 1. Phishing
A fake email or text that looks like it's from your bank, a courier, or a social network tricks you into typing your password into a fake copy of the real site. Now the attacker has it. We'll go deep on phishing in Path 06.

### 2. Password reuse (credential stuffing)
You used the same simple password on ten sites. One of those sites gets breached and leaks it. Attackers then try that password on your email, your bank, your shopping accounts — and it works, because you reused it. This is called **credential stuffing**, and it's devastatingly effective.

:::note NUMBER TO REMEMBER
Reports like [Verizon's Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/) consistently show that **stolen credentials are involved in a huge share of confirmed breaches every year** — often the single largest cause.
:::

### 3. Ransomware
You open an unexpected attachment or download a "free" program. Hidden malware quietly **encrypts** (scrambles) all your files — photos, documents, everything — then demands money to unscramble them.

### 4. Account takeover
An attacker gets into your **email**. Because your email can reset the password of nearly every other account you own, that one foothold gives them your whole digital life.

~~~svg Why your email is the master key
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <!-- Email in center -->
  <rect x="240" y="80" width="120" height="60" rx="8" fill="#EFA43A" stroke="#C77F1E" stroke-width="2"/>
  <text x="300" y="105" font-size="14" font-weight="700" text-anchor="middle" fill="#160f02">📧 EMAIL</text>
  <text x="300" y="128" font-size="10" text-anchor="middle" fill="#160f02">The master key</text>
  <!-- Spokes to other accounts -->
  <g font-size="11" fill="#E9EEF3" font-weight="500">
    <line x1="240" y1="110" x2="130" y2="45" stroke="#3FB6A8" stroke-width="1.5"/>
    <rect x="60" y="30" width="80" height="30" rx="4" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <text x="100" y="49" text-anchor="middle">🏦 Bank</text>
    <line x1="240" y1="140" x2="130" y2="175" stroke="#3FB6A8" stroke-width="1.5"/>
    <rect x="60" y="160" width="80" height="30" rx="4" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <text x="100" y="179" text-anchor="middle">🛒 Shopping</text>
    <line x1="360" y1="110" x2="470" y2="45" stroke="#3FB6A8" stroke-width="1.5"/>
    <rect x="450" y="30" width="80" height="30" rx="4" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <text x="490" y="49" text-anchor="middle">💬 Social</text>
    <line x1="360" y1="140" x2="470" y2="175" stroke="#3FB6A8" stroke-width="1.5"/>
    <rect x="450" y="160" width="80" height="30" rx="4" fill="#111927" stroke="#3FB6A8" stroke-width="1"/>
    <text x="490" y="179" text-anchor="middle">☁ Cloud</text>
  </g>
  <text x="300" y="205" font-size="11" text-anchor="middle" fill="#8496A6">Own the email → reset everything else</text>
</svg>
~~~

None of these attacks required you to be famous or rich. They required you to be *online* — which is everyone.

## You're not just a victim — you can become a weapon too

Here's a piece of the picture most beginners never consider: a compromised device doesn't just hurt *you*. Attackers frequently use one compromised machine as a stepping stone to attack others — sending phishing emails from your real, trusted email account to everyone in your contacts (who are far more likely to trust a message that genuinely comes from your address), or enlisting your device into a **botnet**: a network of thousands of compromised machines an attacker controls remotely, often used to attack other, much larger targets without your knowledge at all. Your own personal security isn't purely a personal matter — a compromised home computer can become one small part of a much larger attack against someone else entirely.

## The real financial and human cost

Beyond the individual scenarios above, the aggregate cost of cybercrime is genuinely enormous — industry reports consistently estimate global losses in the trillions of dollars annually, and that figure keeps climbing year over year. For an individual, the cost isn't only financial: victims of identity theft or ransomware often describe the experience as deeply stressful and time-consuming to resolve, frequently taking weeks or months to fully recover accounts, credit, and peace of mind — directly connecting to Path 20's identity theft protection lesson later in this course, which covers exactly how to prepare for and respond to this.

## Two very good reasons to learn this

### Reason 1: it protects you and the people you love
Even the basics in this course put you ahead of most people online. You'll:

- Spot the fake email before you click.
- Use strong and unique passwords via a password manager.
- Understand why "you've won a prize!" is bait.
- Know how to lock down the accounts that matter.
- Become the person your family and friends turn to for help.

### Reason 2: it's one of the best careers you can build right now
There is a genuine, worldwide **shortage of skilled security people**. Reports from [(ISC)²](https://www.isc2.org/Research/Workforce-Study) put the global shortage in the millions of unfilled roles. That means:

- Good pay.
- Freedom to work remotely from almost anywhere.
- Strong job security.
- And unlike many professions, you can break in **without an expensive degree** if you build real, demonstrable skills — which is exactly what this course is designed to help you do.

Security roles also span a genuinely wide range of day-to-day work, not just one narrow job description: some people spend their days finding vulnerabilities before attackers do (offensive security — Path 09, Path 10), others defend live systems and investigate incidents as they happen (defensive security — Path 08, Path 11), and others focus on policy, compliance, and risk management for entire organizations. Path 01's next lesson walks through these roles in detail, so you can start forming a sense of which direction genuinely interests you.

:::tip THIS IS BOTH A HOBBY AND A CAREER FOUNDATION
Every single skill you learn here is a skill an employer will pay for. You are not just learning to protect yourself — you're laying the first bricks of a serious career.
:::

:::challenge Reflect on your own stakes
Write down, honestly: what's the single account or device in your own life that would cause the most disruption if it were compromised today? For that one thing specifically, note whether you currently have a strong unique password and 2FA enabled — if not, that's your very first real action item from this entire course.
:::

:::challenge Test yourself
What's the name of the attack where a password leaked from **one** site is automatically tried on **many** other sites?

<details><summary>Show answer</summary>Credential stuffing (made possible by password reuse). It's why using a unique password on every site matters so much.</details>
:::

## Key terms

- **Phishing** — fake messages that trick you into giving up secrets.
- **Credential stuffing** — reusing a leaked password across many sites automatically.
- **Ransomware** — malware that scrambles your files and demands payment.
- **Account takeover** — an attacker gaining control of one of your accounts (often email first).

## Recap

- Most attacks are automated and aimed at everyone at once — not at you personally.
- Being "small" doesn't protect you; being *reachable* does.
- Everyday attacks: phishing, password reuse, ransomware, account takeover.
- Learning this protects you *and* opens the door to a high-demand career.

???refs
- [Verizon Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/) — the definitive annual breach analysis.
- [Have I Been Pwned](https://haveibeenpwned.com/) — check if your email has appeared in known breaches.
- [(ISC)² Cybersecurity Workforce Study](https://www.isc2.org/Research/Workforce-Study) — hard data on the security jobs shortage.
- [Google Phishing Quiz](https://phishingquiz.withgoogle.com/) — take it, then share it with family. Excellent free training.
???

**Next up →** [Types of hackers & careers](#/lesson/01-introduction/types-of-hackers)
