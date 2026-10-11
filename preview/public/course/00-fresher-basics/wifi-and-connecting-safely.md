# Wi-Fi & connecting safely

Almost everything you do online travels over Wi-Fi at some point — at home, at work, or at a coffee shop. This lesson covers what actually makes a Wi-Fi connection safe or risky, in plain language, before Path 02 goes into networking in much more technical depth.

## What "connecting to Wi-Fi" actually does

When you join a Wi-Fi network, your device starts routing all of its internet traffic through whatever router or access point runs that network. This matters because whoever controls that router — the network's owner, or in the case of a public network, potentially anyone else on it — has some ability to see or interfere with the traffic passing through, depending on how well the traffic itself is protected.

## Home Wi-Fi: the basics that matter

- **Change the router's default admin password.** Routers ship with well-known default logins (`admin`/`admin` is extremely common) that anyone can look up online — leaving it unchanged means anyone briefly on your network could reconfigure your router entirely.
- **Use WPA2 or WPA3 encryption**, not the older, broken WEP standard — this is usually already the default on any router bought in the last decade, but it's worth confirming in your router's settings.
- **Use a strong Wi-Fi password**, not the short one printed on the router by default — the same length-over-complexity logic from the passwords lesson applies here too.
- **Keep your router's firmware updated** — router manufacturers occasionally patch real security flaws, and most modern routers can update themselves automatically if you enable that setting.

## Public Wi-Fi: what actually changes

Public Wi-Fi (coffee shops, airports, hotels) isn't automatically dangerous, but it does remove a layer of trust you have at home — you don't know who set up the network, and in some cases you don't know who else is on it either.

:::tip The good news: HTTPS already protects most of what matters
Because the vast majority of modern websites use encrypted HTTPS connections (the padlock from the previous lesson), someone else on the same public Wi-Fi generally can't read what you're typing into a legitimate site, even without a VPN. The bigger public-Wi-Fi risk in practice is a fake "free wifi" network set up specifically to intercept traffic, or an unencrypted site that doesn't use HTTPS at all.
:::

- **Avoid networks with generic or suspicious names** — a network called "Free Airport WiFi" with no password could be entirely legitimate, or could be set up by someone nearby specifically to intercept traffic; when in doubt, ask staff for the official network name.
- **Avoid logging into sensitive accounts** (banking, in particular) on a network you don't fully trust, if you can reasonably wait.
- **A VPN adds a genuine extra layer** by encrypting all of your traffic before it even reaches the local network — useful on public Wi-Fi specifically, and covered in real depth in Path 09.

## Bluetooth and "nearby" connections, briefly

The same basic caution applies beyond Wi-Fi: turn off Bluetooth when you're not actively using it, and don't accept pairing requests or file transfers from devices you don't recognize.

## 🧪 Hands-on lab — a home network check-up

1. Log into your home router's admin page (usually at an address like `192.168.1.1` — check your router's manual if unsure) and confirm the default admin password has been changed.
2. Confirm your Wi-Fi network is using WPA2 or WPA3 encryption, not an older or open standard.
3. Check whether your router has an available firmware update, and whether automatic updates are enabled.
4. Next time you're on public Wi-Fi, make a habit of checking the network name with staff before connecting, rather than picking the first plausible-looking option.

:::challenge Test yourself
Why is a fake public Wi-Fi network with a plausible name a bigger practical risk than public Wi-Fi encryption itself?
<details><summary>Show answer</summary>Modern HTTPS encryption already protects the content of your traffic to most legitimate sites, even over public Wi-Fi — so the connection type itself isn't the primary danger. The bigger risk is connecting to a network set up specifically to intercept or manipulate your traffic before it ever reaches a legitimate, encrypted destination, which is exactly why verifying the network's real name with staff matters more than avoiding public Wi-Fi altogether.</details>
:::

## Key terms

- **Router** — the device that manages your home network and connects it to the internet.
- **WPA2/WPA3** — the current, secure Wi-Fi encryption standards; WEP is an older, broken standard to avoid.
- **VPN (Virtual Private Network)** — a service that encrypts all of your traffic before it reaches the local network, adding protection on untrusted networks.

## Recap

- Changing your router's default admin password and Wi-Fi password are the two highest-value home-network habits.
- Most public-Wi-Fi risk today comes from fake networks, not from encryption gaps in legitimate ones — HTTPS already protects most of what matters.
- A VPN adds a genuine extra layer of protection specifically useful on networks you don't fully trust.

**Next up →** [Files, folders & organizing yourself](#/lesson/00-fresher-basics/files-folders-you)
