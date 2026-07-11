# Path 05 — How the Web Works

> **Level:** Beginner · **Lessons:** 7 · **Assumed knowledge:** Paths 01–04 (networking and HTTP especially).

Most hacking today is **web** hacking, and most bug bounty money is in the web. But you can't attack or defend something you don't understand. So before we touch a single vulnerability, this path builds a clear, confident picture of how websites actually work under the hood: what happens when you open a page, the three languages every page is built from, the all-important split between the client and the server, how sites remember you're logged in, and the free browser tool that becomes your first hacking instrument. Get this right and Path 07 (Web Security) will feel natural instead of overwhelming.

---

## Lesson 5.1 — What happens when you open a website

### Why this matters
The entire craft of web hacking is about carefully shaping what you send to a website and studying what comes back. If you understand that basic conversation, everything else clicks. This lesson slows down the second between "type an address" and "see a page."

### The journey of a click
You type `example.com` and hit Enter, and a page appears almost instantly. But a lot happens in that moment. Let's walk it step by step:

1. **DNS lookup.** Your browser asks DNS (the internet's phonebook from Path 02) to turn `example.com` into an IP address — the numeric location of the server.
2. **Connection.** Your browser opens a connection to that IP address, usually on port 443 (for HTTPS).
3. **The request.** Your browser sends an **HTTP request** that essentially says: "Please send me your homepage."
4. **The response.** The website's **server** sends back an **HTTP response** containing the page's code (HTML, CSS, JavaScript).
5. **Rendering.** Your browser reads that code and *draws* the page you see — text, images, buttons, layout.
6. **More requests.** The page usually needs extra pieces (images, stylesheets, scripts), so your browser fires off more requests to fetch each one, until the page is complete.

### The two words to remember forever
> **Request** = what your browser *sends*. **Response** = what the server *sends back*.

Almost all of web hacking is about crafting clever requests and examining the responses. When you later "test a website," you're really sending modified requests and watching how the responses change. Burn these two words into memory.

### Understanding a URL
The address you type — the **URL** — is packed with useful parts. Take this example:

```
https://shop.example.com/products?id=42&sort=price
```

- `https://` — the **protocol** (secure HTTP).
- `shop.example.com` — the **host** (`shop` is a *subdomain* of `example.com`).
- `/products` — the **path** (which page or resource).
- `?id=42&sort=price` — the **query string**: **parameters** named `id` (value `42`) and `sort` (value `price`), joined by `&`.

Those parameters are hugely important in security. They're often values *you* control that get sent to the server — and anything you control is something you can tamper with. A lot of web bugs live in parameters like `id=42`.

### 🚩 Challenge
In the URL `https://site.com/user?id=7`, what is the name and value of the parameter?

<details><summary>Answer</summary>The parameter's name is id and its value is 7.</details>

### Key terms
- **Request / response** — what you send / what the server returns.
- **URL** — a web address, made of protocol, host, path, and query string.
- **Parameter** — a named value in the query string (e.g., `id=42`).
- **Rendering** — the browser turning code into the visible page.

### Recap
- Opening a page is a request-and-response conversation over HTTP.
- DNS finds the server, the browser requests the page, the server responds, the browser renders it.
- A URL splits into protocol, host, path, and query-string parameters.
- Parameters are values you control — and a common home for web bugs.

---

## Lesson 5.2 — HTML, CSS & JavaScript in plain words

### Why this matters
Every web page is built from three languages. Knowing which does what tells you *where* different attacks live — especially why sneaking in JavaScript is so powerful.

### The house analogy
A web page is like a house built by three specialists:

- **HTML — the structure.** The walls, rooms, and doors. HTML defines *what's on the page*: the headings, paragraphs, images, buttons, and forms. Without HTML there is no page.
- **CSS — the style.** The paint, decoration, and layout. CSS defines *how it looks*: colours, fonts, spacing, positioning. Strip away CSS and you'd still have all the content, just plain and ugly.
- **JavaScript — the behaviour.** The moving, working parts. JavaScript defines *what the page does*: pop-ups, dropdown menus, live updates, form validation, animations. It runs **inside your browser**.

### A tiny concrete example
```html
<!-- HTML: structure -->
<h1>Welcome</h1>
<button id="hello">Click me</button>

<!-- CSS: style -->
<style>
  h1 { color: teal; }
  button { background: gold; }
</style>

<!-- JavaScript: behaviour -->
<script>
  document.getElementById("hello").onclick = function() {
    alert("Hello!");
  };
</script>
```

That's a heading (HTML), coloured (CSS), with a button that shows a pop-up when clicked (JavaScript). Every website, however complex, is built from these three working together.

### Why this matters so much for security
Here's the key insight: **JavaScript runs inside the visitor's browser.** So if an attacker can sneak *their own* JavaScript onto a page, it will run in other people's browsers — and JavaScript can do a lot (read what's on the page, grab cookies, act as the user). This is the entire basis of a huge attack class called **Cross-Site Scripting (XSS)**, which you'll learn in Path 07. For now, just lock in the idea: *unwanted JavaScript on a page is dangerous.*

Likewise, because HTML and CSS are sent to *your* browser, you can freely inspect and even modify them on your own screen — which we'll do with DevTools shortly. (Modifying them locally only changes *your* view, not the real server; understanding that distinction is the next lesson.)

### 🚩 Challenge
Which of the three web languages runs inside your browser and is the basis of XSS attacks?

<details><summary>Answer</summary>JavaScript.</details>

### Key terms
- **HTML** — structure (the content and elements).
- **CSS** — style (colours, fonts, layout).
- **JavaScript** — behaviour (interactivity), runs in the browser.
- **XSS** — an attack based on injecting unwanted JavaScript (covered later).

### Recap
- HTML is structure, CSS is style, JavaScript is behaviour.
- JavaScript runs inside your browser — which is why injected JavaScript (XSS) is dangerous.
- All three are sent to your browser, so you can inspect them locally.

---

## Lesson 5.3 — Client vs server (the most important web idea)

### Why this matters
This single distinction explains the majority of web vulnerabilities. Misunderstand it and web security will never quite make sense; understand it and you'll instantly see where many bugs come from.

### The restaurant analogy
Picture a restaurant:

- **The client** is *you and your browser* — the customer at the table placing an order.
- **The server** is the website's computer in the background — the *kitchen* that prepares and sends out the food.

You (the client) send an order (a request). The kitchen (the server) makes it and sends it out (the response). The customer never sees inside the kitchen, and — crucially — the kitchen should never blindly trust that the customer's order is honest.

### The golden rule of web security
Here's the idea that unlocks everything:

> **The client is fully under the user's control. The server must never trust it.**

Anything that happens in *your* browser — the HTML, the JavaScript, the values in a form, even "hidden" fields — can be **read and changed by the user** (that includes an attacker). Your browser is on the attacker's side of the screen. So any security check that only happens in the browser can simply be bypassed.

**Therefore, all real security checks must happen on the server**, in the kitchen, where the customer can't reach.

### A concrete example of why this matters
Imagine a shopping site where the price is sent from your browser like this:
```
POST /buy    item=laptop&price=999
```
If the site trusts that `price` value from the client, an attacker can change it to `price=1` and buy a laptop for one unit of currency. The flaw isn't the attacker changing their own request — that's always possible. The flaw is the **server trusting a value it should have decided itself**. The price should be looked up on the server, never accepted from the client.

This pattern — *the server trusting something it shouldn't* — is behind an enormous number of real vulnerabilities. Keep the restaurant in mind and you'll spot them.

### What runs where
- **Client-side** (in your browser): HTML, CSS, JavaScript. Fast, but fully visible and changeable by the user. Good for *convenience* checks (e.g., "you forgot to fill this box"), never for security.
- **Server-side** (on the website's machine): the real logic, the database, the *authoritative* checks. This is where trust must live.

### 🚩 Challenge
A website checks that you're old enough using only JavaScript in your browser. Why is that not secure?

<details><summary>Answer</summary>Because the client (browser) is fully under the user's control, so an attacker can disable or bypass the JavaScript check. Real checks must run on the server.</details>

### Key terms
- **Client** — your browser (fully user-controlled).
- **Server** — the website's machine (where trust must live).
- **Client-side / server-side** — code running in your browser vs on the server.

### Recap
- The client is the customer, the server is the kitchen.
- The client is fully controllable by the user, so the server must never trust it.
- All real security checks must happen server-side.
- Many web bugs are simply the server trusting something from the client it shouldn't.

---

## Lesson 5.4 — Cookies, sessions & logins

### Why this matters
Once you log in, how does a website remember it's you as you click around? The answer — cookies and sessions — is central to how accounts work, and stealing them is one of the most impactful attacks in web security.

### The problem HTTP has
HTTP is **stateless** — each request is independent and the server forgets you the instant it answers. So without a trick, you'd have to log in again on *every single page*. Cookies and sessions are the trick that fixes this.

### Cookies — the wristband
A **cookie** is a small piece of text a website stores in your browser and that your browser automatically sends back with every future request to that site. Think of it like a **wristband at an event**: you show ID once at the entrance, get a wristband, and after that you just flash the wristband to prove you already paid — you don't re-show ID at every door.

### Sessions — the site's memory of you
A **session** is the server's memory of your visit. When you log in, the server:
1. Checks your username and password.
2. Creates a session for you and generates a unique, hard-to-guess **session token**.
3. Sends that token to your browser as a cookie.

From then on, your browser sends the session cookie with every request, and the server looks it up and thinks "ah, this is Alex, already logged in." That cookie *is* your logged-in identity.

### Why this is a prime attack target
Here's the dangerous part:

> If an attacker steals your session cookie, they can wear your wristband — becoming *you* with no password needed.

This is exactly why:
- Session cookies should be marked `HttpOnly` (so page JavaScript can't read them) and `Secure` (only sent over HTTPS).
- XSS is so dangerous — injected JavaScript can try to steal the session cookie.
- You should log out of sensitive sites on shared computers (it invalidates the session).

Understanding cookies and sessions is the key to understanding account takeover, session hijacking, and much of authentication security.

### 🧪 Lab — See your own cookies
1. Log into any site you use (a throwaway account is fine).
2. Press **F12** to open DevTools, and find the **Application** tab (or **Storage** in Firefox).
3. Click **Cookies** and select the site. You'll see the cookies stored for you — very possibly a session token.
4. Notice the columns for `HttpOnly` and `Secure`. A well-protected session cookie has both ticked.
5. In your notes, write one sentence explaining what a session cookie represents.

### 🚩 Challenge
Why is stealing someone's session cookie so serious — what can an attacker do with it?

<details><summary>Answer</summary>They can impersonate the victim and access their account without needing the password, because the session cookie is what proves you're logged in.</details>

### Key terms
- **Stateless** — HTTP forgets you between requests.
- **Cookie** — small text stored in your browser and sent back automatically.
- **Session** — the server's memory of your logged-in visit.
- **Session token** — the unique value (in a cookie) that proves your identity.
- **HttpOnly / Secure** — cookie protections against theft.

### Recap
- HTTP is stateless, so cookies and sessions are needed to stay logged in.
- A cookie is like a wristband; the session token in it is your logged-in identity.
- Stealing a session cookie lets an attacker become you without a password.
- Protections include `HttpOnly` and `Secure` cookie flags.

---

## Lesson 5.5 — APIs and how modern apps talk

### Why this matters
Modern websites and apps constantly talk to **APIs** behind the scenes, and APIs are where a growing share of vulnerabilities (and bug bounties) live. A gentle understanding now pays off hugely later.

### What an API is
An **API** (Application Programming Interface) is simply a way for programs to talk to each other. When your phone's weather app shows the forecast, it isn't loading a web page — it's asking a weather **API** for the raw data ("give me today's forecast for this city") and displaying it nicely. The API is the waiter taking a structured order and bringing back structured food.

Modern web apps work the same way: the page in your browser (client) constantly makes small API requests to the server for data — your messages, your profile, your notifications — and updates the screen without reloading.

### JSON — the language APIs speak
APIs usually exchange data in a simple text format called **JSON**. You don't need to master it, just recognise it. It looks like labelled boxes:

```json
{
  "username": "alex",
  "role": "user",
  "email": "alex@example.com"
}
```

That's just data with names and values — readable by both humans and programs. When you test APIs, you'll send and receive JSON like this.

### Why APIs matter for security
- APIs often expose the app's real inner workings directly — the raw data and actions, without the polished UI in the way.
- Because developers sometimes assume "only our app calls this," they forget that **anyone** can call an API directly and tamper with the requests (remember: the client can't be trusted).
- Classic bugs like **IDOR** (changing an `id` to access someone else's data — Path 07) frequently live in APIs, where changing `/api/user/1001` to `/api/user/1002` may hand you another person's data.

### 🧪 Lab — Spot the API calls
1. Open a modern web app you use (a social or email site) and press **F12** → **Network** tab.
2. Filter by **Fetch/XHR** (these are the API calls).
3. Do something in the app — send a message, load your profile, scroll.
4. Watch API requests appear. Click one and look at the response — often JSON data. You're seeing the app's real conversation with its server.

### 🚩 Challenge
What simple text format do most modern APIs use to exchange data?

<details><summary>Answer</summary>JSON (JavaScript Object Notation).</details>

### Key terms
- **API** — a way for programs to talk to each other.
- **JSON** — a simple text format of names and values that APIs use.
- **Fetch/XHR** — the browser's behind-the-scenes API requests.

### Recap
- Modern apps constantly call APIs behind the scenes for data.
- APIs usually speak JSON — labelled data, readable by humans and programs.
- Anyone can call an API directly and tamper with requests, so APIs are a rich source of bugs.
- The Network tab's Fetch/XHR filter reveals an app's real API conversation.

---

## Lesson 5.6 — Browser DevTools: your first hacking tool

### Why this matters
Your browser hides a powerful, completely free tool that reveals a website's inner workings — its code, its requests, its cookies, and more. Learning DevTools now means you enter Path 07 already able to inspect what you're attacking.

### Opening the hood
Press **F12** (or right-click a page → **Inspect**) in any browser to open **Developer Tools**. It's built for web developers, but it's equally a hacker's best friend. Here are the tabs that matter most:

### The Elements tab — the live HTML
Shows the page's HTML structure, live. Hover over elements to highlight them on the page. You can even **edit the HTML right there** — but remember Lesson 5.3: this only changes *your local view*, not the real server. It's great for understanding a page and for spotting things like hidden form fields.

### The Network tab — every request and response
This is the big one for security. Every request the page makes shows up here with its full details.

1. Open DevTools → **Network**.
2. Do something on the site (log in, search, load a profile).
3. Watch the requests appear. Click one to see its **headers**, the exact **request** sent, and the full **response**.
4. **Right-click a request → Copy → Copy as cURL.** This gives you a command you can paste into your terminal to *replay* the exact request — and then modify it to test how the server reacts. This "copy, tamper, resend" loop is one of the most useful skills in web testing.

### The Console tab — run JavaScript
The Console lets you run JavaScript in the page's context. Type `document.cookie` to see the cookies the page's scripts can read, or `document.title` to get the page title. It's a quick way to poke at a page.

### The Application / Storage tab — cookies and storage
As you saw in Lesson 5.4, this shows cookies, plus other browser storage where apps sometimes stash tokens they shouldn't. Always worth a look.

### 🧪 Lab — A guided DevTools tour
1. Go to a normal website and press **F12**.
2. **Elements:** hover over elements and watch them highlight. Try editing a heading's text (double-click it) — see it change only on your screen.
3. **Network:** refresh the page and watch requests load. Click one and read its status code and headers. Right-click it → Copy as cURL, and paste it into a text file to see the raw request.
4. **Console:** type `document.title` and press Enter.
5. **Application/Storage:** find the site's cookies.
6. Note down what the Network tab is useful for — you'll use it constantly.

> 💡 Everything you just did — reading requests, replaying them, inspecting cookies and code — is exactly what web hackers do, and it's all free and built into your browser. DevTools is genuinely your first hacking tool.

### 🚩 Challenge
Which DevTools feature lets you copy a request so you can replay and modify it in your terminal?

<details><summary>Answer</summary>Right-click a request in the Network tab → Copy → Copy as cURL.</details>

### Key terms
- **DevTools** — the browser's built-in developer/hacking tools (F12).
- **Elements** — live HTML you can inspect and locally edit.
- **Network** — every request/response, with "Copy as cURL."
- **Console** — run JavaScript in the page.
- **Application/Storage** — cookies and browser storage.

### Recap
- F12 opens DevTools, a free and powerful inspection tool.
- Elements shows live HTML; Network shows requests/responses; Console runs JavaScript; Application shows cookies.
- "Copy as cURL" lets you replay and tamper with requests — a core web-testing skill.
- Editing the page in Elements only changes your local view, never the server.

---

## Lesson 5.7 — Putting it together: the anatomy of a web app

### Why this matters
Before diving into attacks, it helps to zoom out and see how all the pieces you've learned fit into one whole. This mental map makes every future vulnerability easier to place.

### The full picture
Here's a typical modern web application, using everything from this path:

1. **You (the client)** open the site. Your browser does a **DNS** lookup, connects over **HTTPS**, and sends an **HTTP request**.
2. **The server** receives it. Behind the scenes it may run application code, talk to a **database** (where users, passwords, and data live), and call internal **APIs**.
3. The server sends back a **response** — HTML, CSS, JavaScript.
4. Your browser **renders** the page. The page's **JavaScript** then makes ongoing **API requests** (JSON) to load and update data.
5. Because you logged in, a **session cookie** rides along with every request so the server knows who you are.

### Where the trust boundaries are
The single most important line to draw is between **client** and **server**. Everything on the client side you (and an attacker) control completely. Everything on the server side is where real trust and real security must live. A huge fraction of web vulnerabilities are the server failing to properly check something at that boundary:

- Trusting a **parameter** it should have validated (injection, tampering).
- Trusting the client about **who you are** or **what you can access** (broken access control, IDOR).
- Reflecting your input back into a page without cleaning it (XSS).
- Trusting data sent to an **API** that anyone can call.

### What comes next
You now have the complete mental model of a web app: request/response, the three languages, client vs server, cookies and sessions, APIs, and DevTools to inspect it all. In **Path 07 — Web Security**, we take this exact model and start finding real weaknesses in it — the OWASP Top 10, XSS, SQL injection, and IDOR — with hands-on labs on legal practice sites. You're ready.

### 🧪 Lab — Draw your own diagram
In your notes, draw a simple diagram of a web app: a "client" box (your browser) on the left, a "server" box on the right, and a "database" behind the server. Label the request going right and the response coming back. Draw a line between client and server labelled "trust boundary — the server must not trust the client." This one diagram will anchor everything in Path 07.

### 🚩 Challenge
Where in a web app must the real security checks happen, and why?

<details><summary>Answer</summary>On the server side, because the client (browser) is fully under the user's control and cannot be trusted.</details>

### Key terms
- **Database** — where a server stores users, passwords, and data.
- **Trust boundary** — the line (client ↔ server) where the server must validate everything.

### Recap
- A web app is: client → HTTP request → server (with database and APIs) → response → render → ongoing API calls, with a session cookie proving identity.
- The critical trust boundary is between client and server.
- Most web bugs are the server failing to properly check something at that boundary.
- You now have the full model needed to start web hacking in Path 07.

---

## You've finished Path 05 🎉

You understand how the web really works: the request/response conversation, URLs and parameters, HTML/CSS/JavaScript, the crucial client-vs-server split, cookies and sessions, APIs and JSON, and the browser DevTools that let you inspect and replay it all. This is the launchpad for everything in web hacking.

**Next up → `06-fundamentals.md`:** the core security concepts every professional knows — the CIA triad, threats and risk, malware, how passwords are really stored, and social engineering — the vocabulary and models that tie the whole field together.
