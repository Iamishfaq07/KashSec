# Linux Networking Commands

Path 02 covered networking concepts and cross-platform troubleshooting tools. This lesson is the Linux-specific practical follow-up — the exact commands you'll use constantly once you're actually working at a Linux terminal, whether defending a system or testing one.

## Checking your own network configuration

```bash
ip addr             # modern standard: show all interfaces and their IPs
ifconfig             # older, still common on many systems
ip route             # show the routing table, including your default gateway
```

Directly applying the IP-addressing and routing concepts from Path 02 to a real, running Linux system in front of you.

## Testing connectivity

```bash
ping -c 4 8.8.8.8              # send exactly 4 pings (Linux's ping runs forever by default)
traceroute example.com          # trace the hop-by-hop path, from Path 02
```

## Seeing active connections: netstat and its modern replacement

```bash
netstat -tulnp        # older, still widely available
ss -tulnp              # modern, faster replacement for netstat
```

Both reveal which ports are actively listening for connections and which process owns each one — directly extending Path 07's netstat coverage to Linux, and genuinely one of the most useful commands for spotting an unexpected listening service (a potential backdoor, a misconfigured service accidentally exposed) during an investigation.

## curl and wget: making requests from the command line

```bash
curl https://example.com                    # fetch and display a page's content
curl -I https://example.com                  # fetch just the HTTP headers
wget https://example.com/file.zip            # download a file directly
```

`curl` in particular is genuinely essential throughout security work — testing an API (Path 21), checking HTTP security headers (the tool from Path 11's material), or simply confirming a web service is responding as expected, all without ever opening a browser.

## nmap: the network scanner you'll meet properly in Path 14

A brief preview, since you'll see the name constantly from here forward: **`nmap`** scans a target for open ports and running services — one of the single most important tools in a security professional's toolkit, covered in full, careful, authorized-use-only depth in Path 14's ethical hacking material. Mentioned here specifically so the name is already familiar when it reappears with the legal and ethical context it deserves.

:::danger nmap needs the same permission the golden rule requires
Exactly like Path 01's golden-rule lesson emphasized: scanning a network or system you don't have explicit permission to test is not something to casually try "just to see what it does." Save hands-on `nmap` practice for your own lab environment (Path 01's home-lab lesson) or Path 14's properly authorized material.
:::

:::challenge Test yourself
Why is checking active listening connections (`netstat`/`ss`) a genuinely valuable security habit, not just a networking curiosity?
<details><summary>Show answer</summary>A listening port represents a service actively waiting to accept incoming connections — and an unexpected listening port is one of the clearest, most direct signs that something on the system is reachable that shouldn't be, whether that's a misconfigured service accidentally exposed to the network or an actual backdoor an attacker installed. This directly extends the recognizing-compromise principle from Path 07 (originally covered for Windows) to Linux: knowing what "normal" looks like on a system you're responsible for — which ports should legitimately be listening — is exactly what makes an unexpected one stand out as worth investigating.</details>
:::

## Key terms

- **ss** — the modern replacement for `netstat`, showing active network connections and listening ports.
- **curl** — a command-line tool for making HTTP requests directly from the terminal.
- **nmap** — a network scanning tool for discovering open ports and services, covered fully (with proper authorization context) in Path 14.

## Recap

- `ip`/`ifconfig`, `ping`, and `traceroute` bring Path 02's networking concepts directly to your own Linux terminal.
- `netstat`/`ss` reveal active and listening connections — a genuinely high-value habit for spotting unexpected exposure or backdoors.
- `curl` and `wget` make HTTP requests and downloads directly from the command line, essential throughout security testing work.
- `nmap` is the major network-scanning tool you'll meet properly, with full legal and ethical context, in Path 14.

**Next up →** [SSH & Remote Access](#/lesson/03-linux/ssh-and-remote-access)
