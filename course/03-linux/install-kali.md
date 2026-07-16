# Install Kali Linux

Kali is the security-focused Linux distribution most professionals learn on. It comes pre-loaded with hundreds of security tools — Nmap, Burp Suite, Metasploit, Wireshark, John the Ripper, and more — all ready to use. In this lesson you'll add it as a VM inside VirtualBox.

## Two ways to install (pick the easy one)

There are two paths:

- **Pre-built VirtualBox image (recommended for beginners).** Download a Kali VM someone else already built, import it, done. About 15 minutes.
- **ISO from scratch.** Download an installer ISO, create an empty VM, walk through the installer. About 40 minutes. Useful later for practice; skip for now.

We'll do the pre-built image.

## Step 1 — Download the Kali VirtualBox image

1. Go to [kali.org/get-kali/#kali-virtual-machines](https://www.kali.org/get-kali/#kali-virtual-machines).
2. Choose **Kali Linux VirtualBox 64-bit** (or 32-bit if you're on very old hardware).
3. Download the file. It's ~3–4 GB — grab a drink.

You'll also see a **SHA256 hash** on the download page. This is a fingerprint that proves the file wasn't tampered with. We use hashes constantly in security — first taste right here.

```bash
# Verify the download matches Kali's published hash:
# On Linux / macOS:
shasum -a 256 kali-linux-*.7z

# On Windows PowerShell:
Get-FileHash kali-linux-*.7z -Algorithm SHA256
```

Compare the output to the hash on kali.org. Match = good file. Mismatch = re-download.

:::tip WHY WE HASH DOWNLOADS
If an attacker replaced the file on a mirror with a malicious one, the hash would be different. Verifying hashes is a cheap habit that has caught real supply-chain attacks. Do it every time you download tools.
:::

## Step 2 — Extract the archive

The download is a `.7z` archive. Extract it with **7-Zip** (Windows), **The Unarchiver** (Mac), or `7z x kali-linux-*.7z` on Linux.

Inside you'll find a folder with `.vbox` and `.vmdk` files — that's the pre-built VM.

## Step 3 — Import into VirtualBox

1. Open VirtualBox.
2. Double-click the `.vbox` file (or **Machine → Add** in VirtualBox and select it).
3. The Kali VM appears in your list.
4. Before starting it, click **Settings** and adjust:
   - **System → Base Memory:** 4096 MB minimum (2048 works but sluggish). More = smoother.
   - **System → Processor:** 2 CPUs minimum.
   - **Display → Video Memory:** 128 MB.
   - **Network → Adapter 1:** for now leave as **NAT** — it gets internet without exposing your host.

Click **OK** and start the VM.

## Step 4 — Log in

Default credentials for the pre-built image are:

```
Username: kali
Password: kali
```

**Change the password immediately** with the `passwd` command after logging in (next lesson).

~~~svg Your first Kali desktop
<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <!-- Host frame -->
    <rect x="20" y="20" width="660" height="260" rx="10" fill="#0C1119" stroke="#213043" stroke-width="1.5"/>
    <text x="45" y="40" fill="#8496A6" font-size="11">VirtualBox window on your host</text>
    <!-- Kali desktop -->
    <rect x="45" y="55" width="610" height="205" rx="6" fill="#080c12" stroke="#3FB6A8"/>
    <!-- Top bar -->
    <rect x="45" y="55" width="610" height="20" rx="0" fill="#111927"/>
    <text x="60" y="70" fill="#3FB6A8" font-size="11" font-weight="700">🐉 Kali</text>
    <text x="600" y="70" fill="#8496A6" font-size="10" text-anchor="end">kali@kali</text>
    <!-- Wallpaper text -->
    <text x="350" y="140" text-anchor="middle" fill="#3FB6A8" font-size="30" font-weight="700">KALI</text>
    <text x="350" y="165" text-anchor="middle" fill="#8496A6" font-size="11">The tools of the trade, ready</text>
    <!-- Bottom bar -->
    <rect x="45" y="230" width="610" height="30" rx="0" fill="#111927"/>
    <text x="55" y="248" fill="#E9EEF3" font-size="10">📁 Files</text>
    <text x="105" y="248" fill="#E9EEF3" font-size="10">🌐 Firefox</text>
    <text x="170" y="248" fill="#E9EEF3" font-size="10">💻 Terminal</text>
    <text x="240" y="248" fill="#EFA43A" font-size="10">🕷 Burp</text>
    <text x="290" y="248" fill="#EFA43A" font-size="10">🎯 Metasploit</text>
    <text x="370" y="248" fill="#EFA43A" font-size="10">📡 Wireshark</text>
    <text x="450" y="248" fill="#EFA43A" font-size="10">🔍 Nmap</text>
  </g>
</svg>
~~~

You should see the Kali desktop — a dark theme, a menu with dozens of security tools, and a terminal you can open. Congratulations: **you now own a hacker's workstation.**

## Step 5 — First updates

Open a terminal (top-left menu, or Ctrl+Alt+T) and run:

```bash
# Update package lists and install updates
sudo apt update && sudo apt upgrade -y
```

You'll be asked for your password (the one you'll change next lesson). This takes 10–30 minutes on first run. Do it, get coffee.

## Common install issues

| Problem | Fix |
|---|---|
| VM won't start: "VT-x is disabled" | Enable VT-x/AMD-V in BIOS |
| Screen tiny, doesn't resize | Install **Guest Additions** (Devices → Insert Guest Additions CD → run installer inside Kali) |
| No internet in Kali | Network adapter should be NAT; try `sudo dhclient` inside Kali |
| Keyboard layout wrong | `sudo dpkg-reconfigure keyboard-configuration` |
| Time drifts | Guest Additions usually fixes it |
| Slow performance | Give more RAM and CPUs in VM Settings |

## A quick tour of what's already installed

Kali ships with hundreds of tools pre-installed, organized into categories accessible from its applications menu — worth a brief browse now, even though you won't use most of them for a while:

- **Information Gathering** — recon tools (Path 09), including `nmap`, `theHarvester`.
- **Web Application Analysis** — Burp Suite, `sqlmap` (Path 07).
- **Password Attacks** — `hashcat`, `john` (referenced in Path 17's crypto material).
- **Exploitation Tools** — Metasploit Framework (Path 09).
- **Sniffing & Spoofing** — Wireshark (Path 08).
- **Forensics** — Autopsy, Volatility (Path 11's DFIR lab).

You'll formally meet most of these tools by name throughout the rest of this course — this browse is just so the menu feels familiar rather than overwhelming the first time you actually need something from it.

:::note Kali defaults to a non-root user, and that's intentional
Older Kali versions ran everything as `root` by default — a convenient but genuinely risky default, since any tool you ran (or any mistake you made) had full system privileges automatically. Modern Kali defaults to a standard, non-root `kali` user instead, requiring explicit `sudo` for privileged actions — directly applying the principle of least privilege from Path 00's fundamentals, now to your own primary security workstation.
:::

## Alternative — Kali in Docker or WSL

For lighter footprints:

- **Kali in WSL:** `wsl --install -d kali-linux` on Windows — command-line only, no GUI, but very fast.
- **Kali in Docker:** `docker run -it --rm kalilinux/kali-rolling` — a throwaway Kali container in seconds.

Both are useful *supplements* to a real VM, not full replacements. Some tools need the VM's graphical apps (Burp, Wireshark).

## 🧪 Lab — Take your first snapshot

Snapshots are your safety net. Take one right now before you touch anything.

1. Shut down the VM cleanly (top-left menu → Power Off).
2. In VirtualBox Manager, select Kali → click the **Snapshots** button (top right).
3. Click **Take** and name it **`fresh-install`**.

Now if you ever break Kali beyond repair, you can restore this snapshot in seconds. We'll use snapshots deliberately in the next lesson.

:::challenge Test yourself
What single command updates the package lists and applies all available updates in Kali?

<details><summary>Show answer</summary><code>sudo apt update && sudo apt upgrade -y</code></details>
:::

## Key terms

- **Kali Linux** — Debian-based security distro pre-loaded with tools.
- **VirtualBox image (OVA/VMDK)** — pre-built VM you import instead of installing.
- **SHA256 hash** — fingerprint proving a file wasn't tampered with.
- **Snapshot** — a saved VM state you can restore.
- **Guest Additions** — VirtualBox add-ons for smooth display, clipboard, and shared folders.

## Recap

- Download the pre-built Kali VirtualBox image; verify its SHA256 hash.
- Import into VirtualBox, give it 4 GB RAM and 2 CPUs.
- Default login is `kali` / `kali` — change immediately.
- Update everything with `sudo apt update && sudo apt upgrade -y`.
- Take a **fresh-install** snapshot before touching anything.

???refs
- [Kali VM images](https://www.kali.org/get-kali/#kali-virtual-machines) — official downloads.
- [Kali Docs](https://www.kali.org/docs/) — installation help and tips.
- [Guest Additions guide](https://www.virtualbox.org/manual/ch04.html) — install for smooth VM experience.
- [Kali tools list](https://www.kali.org/tools/) — every pre-installed tool with docs.
???

**Next up →** [Snapshots & lab safety](#/lesson/03-linux/snapshots-safety)
