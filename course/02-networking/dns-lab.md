# DNS Lab

DNS is the internet's phonebook — this lab has you actually query it directly, the way real reconnaissance and troubleshooting both do, rather than just trusting whatever a browser silently resolves behind the scenes.

## Tools

`dig` and `nslookup` come pre-installed on most systems (Linux/macOS have `dig`; Windows has `nslookup` built in, and can get `dig` via WSL). No special setup required.

## Tasks

1. **Query different record types.** DNS holds far more than just the `A` record (IPv4 address) most people think of:
   ```bash
   dig example.com A       # IPv4 address
   dig example.com AAAA    # IPv6 address
   dig example.com MX      # mail servers
   dig example.com TXT     # arbitrary text — often SPF/DKIM email security records
   dig example.com NS      # authoritative nameservers
   ```
   Run all five against a real domain you're curious about and note what each reveals.
2. **Find the authoritative nameservers.** The `NS` records from Task 1 tell you exactly which servers are authoritative for a domain — meaning they hold the actual, canonical DNS records, as opposed to intermediate caching resolvers. Query one directly to see the freshest possible data:
   ```bash
   dig @<nameserver-from-NS-record> example.com A
   ```
3. **Look up historical DNS data.** Services like [SecurityTrails](https://securitytrails.com/) and [viewdns.info](https://viewdns.info/) keep historical records of what a domain used to resolve to — genuinely useful in real reconnaissance, since old, forgotten subdomains sometimes still point to decommissioned-but-still-accessible infrastructure.
4. **Hunt for interesting records.** `TXT` records in particular often reveal more than intended — SPF records reveal which mail providers a company uses, and occasionally you'll find verification tokens for third-party services (Google Workspace, AWS, etc.) that hint at what infrastructure a company relies on.

5. **Test for a zone transfer misconfiguration (read-only, against a lab target only).** A **zone transfer** (`AXFR`) is meant to let secondary DNS servers replicate a domain's complete record set from the primary server — but if misconfigured to allow transfers from *anyone*, it hands an attacker the domain's entire DNS map in one request, including internal-only subdomains never meant to be public:
   ```bash
   dig axfr @<nameserver> example.com
   ```
   Properly configured servers refuse this for unauthorized requesters (you'll almost always see a "Transfer failed" or refusal against real-world domains) — but it's a classic, well-documented misconfiguration worth knowing how to check for, entirely passively, with zero exploitation involved.
6. **Brute-force subdomains with a wordlist tool.** Historical data (Task 3) only surfaces subdomains that existed publicly before; a wordlist-based brute-force tool like `dnsx` or `gobuster dns` tries many common subdomain name guesses (`dev`, `staging`, `api`, `admin`, and thousands more) directly:
   ```bash
   gobuster dns -d example.com -w /usr/share/wordlists/subdomains.txt
   ```
   Only run this against a domain you own or that has an explicit, current bug bounty program permitting this kind of active enumeration.

:::tip DNS is a reconnaissance goldmine, not just plumbing
Path 14's reconnaissance lesson and Path 15's recon pipeline both lean heavily on DNS enumeration for exactly this reason — subdomain discovery, mail infrastructure mapping, and third-party service fingerprinting all start here, often before a single request even hits the target's actual web server.
:::

:::challenge Map a domain's DNS footprint
Pick a domain (your own site, or any organization that publishes a public bug bounty scope — never an arbitrary company without permission), and produce a short report: its nameservers, mail infrastructure (MX + relevant TXT records), any subdomains you can find via historical data tools, and one observation about what this data reveals about their infrastructure choices.
:::

## Key takeaway

DNS records are public by design, and querying them directly (rather than relying only on what a browser shows you) reveals a surprising amount about an organization's infrastructure — which is exactly why DNS enumeration is one of the very first steps in almost every real penetration test and bug bounty engagement.

**Next up →** [Practical Packet Analysis Intro](#/lesson/02-networking/practical-packet-lab)
