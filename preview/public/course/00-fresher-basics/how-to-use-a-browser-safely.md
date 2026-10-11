# Using your web browser safely

You'll spend more time in your web browser than in almost any other piece of software you own. This lesson covers the handful of browser habits that quietly prevent a huge share of everyday problems — before we get into anything more advanced.

## What a browser actually is

Your **web browser** (Chrome, Safari, Firefox, Edge, and others) is the program that turns the internet into something you can actually look at and click through — it takes an address you type or a link you click, fetches the page from wherever it lives, and displays it. Everything else in this course involving "visiting a site" happens through one of these.

## The padlock icon — what it means, and what it doesn't

Every browser shows a small padlock icon next to a website's address. This means the connection between you and that website is **encrypted** — nobody snooping on the network in between (your Wi-Fi provider, someone on the same coffee shop network) can read what you're sending or receiving.

:::warn The padlock does not mean "safe" or "trustworthy"
This is one of the most common misunderstandings in everyday internet use. The padlock only proves the *connection* is private — it says nothing about whether the site itself is legitimate. A scam or phishing site (covered in the very next lesson) can have a perfectly valid padlock too. Anyone can get one, including someone building a fake site specifically to trick you.
:::

## Reading a web address (URL) before you trust it

Before clicking a link or entering any information, get in the habit of glancing at the actual address:

- The real site is usually the part right before the first single slash (`/`) — in `https://accounts.google.com/signin`, the real site is `accounts.google.com`.
- Watch for lookalikes: `paypa1.com` (a "1" instead of an "l"), or `paypal.com.secure-login.net` (the real-looking part is actually just a subdomain of a completely different, unrelated site).
- If something looks slightly off, don't click — type the address you already know into the browser yourself instead.

## Browser extensions — useful, but worth being careful with

**Extensions** (or "add-ons") are small programs you install into your browser to add features — an ad blocker, a password manager, a grammar checker. They're genuinely useful, but because they can see and sometimes modify what you do in your browser, only install ones from your browser's official store, and periodically remove ones you no longer actually use.

## Private / Incognito windows — what they actually protect

A private or incognito window stops your browser from saving your history, cookies, and searches *on this device* after you close it. It does **not** make you anonymous online, doesn't hide your activity from your Wi-Fi provider or employer's network, and doesn't stop the websites you visit from knowing who you are once you log in. It's useful for "don't save this on a shared computer," not for privacy from the outside world (Path 09 covers real privacy tools in depth).

## 🧪 Hands-on lab — a five-minute browser check-up

1. Open your browser's extensions/add-ons page and remove anything you don't recognize or no longer use.
2. Visit your bank or email provider's real login page and look closely at the address bar — note exactly what the real domain looks like, so a fake one would stand out later.
3. Check whether your browser is set to update automatically (most are, by default) — this matters more than it sounds, as the next lesson explains.
4. Open a private/incognito window and confirm you understand what it does and doesn't protect against.

:::challenge Test yourself
Why doesn't the padlock icon guarantee that a website is trustworthy?
<details><summary>Show answer</summary>The padlock only certifies that the connection between your browser and the website is encrypted — it says nothing about who runs the website or what they intend to do with it. A scam site can obtain a valid padlock just as easily as a legitimate one, since the certificate process only verifies the connection, not the operator's honesty. Trustworthiness has to be judged from the actual web address and the site's behavior, not the padlock alone.</details>
:::

## Key terms

- **Web browser** — the program used to view and navigate websites.
- **Encrypted connection** — a connection where data traveling between you and a site can't be read by anyone else on the network in between.
- **Browser extension** — a small add-on program that adds functionality to your browser.
- **Private/incognito window** — a browsing mode that doesn't save history or cookies locally, but provides no anonymity from the outside world.

## Recap

- The padlock icon means the connection is encrypted — it says nothing about whether the site itself is trustworthy.
- Get in the habit of glancing at the actual web address before trusting a link, watching for lookalike domains.
- Only install browser extensions from official stores, and remove ones you don't use.
- Private/incognito mode hides your activity from this device's history, not from the internet at large.

**Next up →** [Wi-Fi & connecting safely](#/lesson/00-fresher-basics/wifi-and-connecting-safely)
