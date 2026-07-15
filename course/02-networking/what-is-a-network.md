# What is a network?

Before we attack or defend anything, we must understand how computers actually communicate. Networking is the *human body* that a security "doctor" needs to understand. This lesson gives you the mental model that everything else hangs on.

:::tip WHY THIS PATH MATTERS
Almost every attack you'll ever learn about travels across a network. If networking is fuzzy for you, hacking will feel like magic. Get this clear now and the rest of the course opens up.
:::

## The simplest definition

A **network** is two or more computers connected together so they can share information. That's genuinely all it is. When your phone messages a friend's phone, when your laptop loads a website, or when you stream a film to your TV, computers are talking over a network.

You're already surrounded by them:

- **Your home Wi-Fi** is a small network joining your phone, laptop, and TV.
- **Your workplace** has a bigger one.
- All these smaller networks are joined into one gigantic global network we call **the internet** — literally an *inter-network*, a network of networks.

## The post office picture

The easiest way to understand a network is a worldwide **postal system** — because it works almost exactly the same way.

~~~svg The internet is a postal system
<svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <!-- Your house -->
    <rect x="30" y="90" width="120" height="80" rx="8" fill="#111927" stroke="#3FB6A8" stroke-width="2"/>
    <text x="90" y="115" text-anchor="middle" font-size="30">🏠</text>
    <text x="90" y="150" text-anchor="middle" fill="#E9EEF3" font-weight="600">Your device</text>
    <text x="90" y="165" text-anchor="middle" fill="#8496A6" font-size="10">(a house)</text>
    <!-- Router -->
    <rect x="200" y="90" width="120" height="80" rx="8" fill="#111927" stroke="#EFA43A" stroke-width="2"/>
    <text x="260" y="115" text-anchor="middle" font-size="30">📮</text>
    <text x="260" y="150" text-anchor="middle" fill="#E9EEF3" font-weight="600">Your router</text>
    <text x="260" y="165" text-anchor="middle" fill="#8496A6" font-size="10">(local post office)</text>
    <!-- Internet -->
    <rect x="370" y="60" width="180" height="140" rx="8" fill="#111927" stroke="#E05548" stroke-width="2" stroke-dasharray="4"/>
    <text x="460" y="105" text-anchor="middle" font-size="30">🌍</text>
    <text x="460" y="140" text-anchor="middle" fill="#E9EEF3" font-weight="600">The internet</text>
    <text x="460" y="160" text-anchor="middle" fill="#8496A6" font-size="10">(worldwide delivery network)</text>
    <text x="460" y="180" text-anchor="middle" fill="#8496A6" font-size="10">of many routers</text>
    <!-- Destination -->
    <rect x="580" y="90" width="90" height="80" rx="8" fill="#111927" stroke="#3FB6A8" stroke-width="2"/>
    <text x="625" y="115" text-anchor="middle" font-size="30">🏢</text>
    <text x="625" y="150" text-anchor="middle" fill="#E9EEF3" font-weight="600">Server</text>
    <text x="625" y="165" text-anchor="middle" fill="#8496A6" font-size="10">(a building)</text>
    <!-- Arrows -->
    <g stroke="#3FB6A8" stroke-width="1.5" fill="none" marker-end="url(#arrow)">
      <line x1="150" y1="130" x2="200" y2="130"/>
      <line x1="320" y1="130" x2="370" y2="130"/>
      <line x1="550" y1="130" x2="580" y2="130"/>
    </g>
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#3FB6A8"/>
      </marker>
    </defs>
    <text x="350" y="30" text-anchor="middle" fill="#E9EEF3" font-weight="600" font-size="13">The post-office picture of a network</text>
  </g>
</svg>
~~~

To send information to another computer, it's like posting a letter: it needs an **address**, it gets **carried** step by step, and it eventually **arrives**.

- **Your devices** (phone, laptop, TV) are the **houses**. Each can send and receive letters.
- **Your router** — the Wi-Fi box from your internet provider — is your **local post office**. Everything you send goes there first, and it forwards mail to the world and brings replies back.
- **The internet** is the **worldwide delivery network** — all the roads, sorting centres, and other post offices that carry your letter to any other house on Earth.

## Wired vs wireless — same idea

Devices join a network in one of two ways:

- **Wired** — a physical **Ethernet cable** plugged into the router.
- **Wireless** — over **Wi-Fi**, radio waves in the air.

From the network's point of view it barely matters. One uses a physical road, the other uses radio waves, but both are just ways of carrying your "letters" to the local post office.

## A first tour of the pieces

Names you'll keep meeting:

| Device | Role |
|---|---|
| **Router** | Your local post office; connects your home to the internet and directs traffic. |
| **Switch** | Inside bigger networks, connects many computers locally (an internal mail room). |
| **Modem** | Translates your provider's signal into something your router understands. |
| **Client** | A device *asking* for something (your laptop loading a page). |
| **Server** | A computer *providing* something (the machine hosting the website). |
| **Access Point (AP)** | The Wi-Fi radio, often built into your router. |

Don't memorise the table — just recognise the words when they appear.

## Why a security learner cares

Every message you send, every site you visit, and every attack a hacker launches is a "letter" travelling this postal system. Once you can picture the post office, you can reason about *where* an attacker might:

- **Read** a letter as it passes (eavesdropping)
- **Forge** the address on an envelope (spoofing)
- **Impersonate** a post office (rogue router / evil twin Wi-Fi)
- **Block** the delivery route (denial of service)

This mental model will serve you through the entire course.

:::challenge Test yourself
In the post-office analogy, what real device plays the role of your "local post office"?

<details><summary>Show answer</summary>Your <strong>router</strong> — it takes everything you send and forwards it to the wider internet, and brings replies back to you.</details>
:::

## 🧪 Lab — Peek at your own network

Do this on your own home network only.

1. On your phone or laptop, open your Wi-Fi settings and note the **network name (SSID)** and its **security type** (WPA2/WPA3 hopefully — we cover this in Path 08).
2. Try to find the IP address of your **router**. On Windows: `ipconfig` and look for "Default Gateway." On macOS/Linux: `ip route | grep default`.
3. Open a browser and type that IP address (usually `192.168.1.1` or `192.168.0.1`). You'll see your router's admin login. **Don't log in unless you know the password** — but see, it's just a tiny web server sitting in your house.

## Key terms

- **Network** — two or more connected computers sharing information.
- **The internet** — a global network of networks.
- **Router** — connects your home network to the internet and directs traffic.
- **Client / server** — the device *asking* vs the device *providing*.

## Recap

- A network connects computers so they can share information.
- The internet is a "network of networks."
- The postal-system model: devices are houses, your router is the local post office, the internet is the global delivery network.
- Wired and wireless are just two ways to carry the same letters.

???refs
- [How the Internet works — Mozilla MDN](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work) — an excellent beginner explainer.
- [Cloudflare Learning: What is the Internet?](https://www.cloudflare.com/learning/network-layer/what-is-the-internet/) — short and clear.
- [Practical Networking: Fundamentals series](https://www.practicalnetworking.net/) — free deeper tutorials once you're ready.
- [Networking Basics — Cisco](https://www.cisco.com/c/en/us/solutions/small-business/resource-center/networking/networking-basics.html)
???

**Next up →** [IP addresses](#/lesson/02-networking/ip-addresses)
