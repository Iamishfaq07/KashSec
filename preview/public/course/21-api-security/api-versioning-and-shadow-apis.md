# API Versioning & Shadow APIs

The what-are-APIs lesson introduced the basic client-server contract. This lesson covers something that contract rarely accounts for cleanly: what happens to that contract as it evolves over time, and what accumulates in the gaps — directly connecting to the api-breach-case-studies lesson's "internal API accidentally left public" pattern.

## Why API versioning exists, and why it creates risk

As an API evolves, breaking changes (renamed fields, removed endpoints, changed authentication requirements) would break every existing client if pushed instantly — so most real APIs maintain multiple versions simultaneously (`/api/v1/...`, `/api/v2/...`), giving clients time to migrate. This is a completely reasonable engineering practice, but it has a genuine security consequence: **older versions frequently receive less security attention** than the current version, since engineering focus naturally gravitates toward what's actively being developed.

## The deprecated-but-still-live endpoint

A genuinely common real-world finding: `/api/v1/users` was deprecated years ago in favor of `/api/v2/users`, with improved authorization logic added to the newer version — but the old `/api/v1/users` endpoint was never actually decommissioned, and still processes requests using its original, weaker logic. An attacker who discovers this old version (through historical documentation, cached search results, or simply guessing the version-numbering pattern) can bypass every security improvement made since, simply by calling the old path instead of the current one.

## Shadow APIs — the ones nobody documented

A **shadow API** is an API endpoint that exists and is reachable, but isn't tracked in any official inventory or documentation — created during rapid development, a proof-of-concept that made it to production, or a feature flag left permanently enabled for internal testing. Directly connecting to the OWASP API Top 10's "Improper Inventory Management" category, shadow APIs are dangerous precisely because you can't secure, monitor, or even meaningfully reason about something your own organization doesn't know exists.

## Zombie APIs — the ones everyone forgot

A **zombie API** is related but distinct: an endpoint that was properly documented and deployed at one point, but has since been forgotten — the team that built it moved on, the documentation went stale, and nobody currently at the organization has clear ownership or awareness that it's still live and reachable. The practical difference from a shadow API matters less than the shared consequence: both represent attack surface that exists in production without active security ownership.

## How attackers actually find these

- **Historical documentation and archives** — Wayback Machine snapshots, cached API documentation pages, and old blog posts sometimes reference endpoint patterns long after the current documentation has been updated
- **Version-pattern guessing** — directly connecting to the recon-pipeline mindset from Path 15's bug bounty content: if `/api/v2/` exists, systematically trying `/api/v1/`, `/api/v3/`, and `/api-beta/` is a near-zero-cost, frequently productive step
- **Mobile app decompilation** — older app versions still installed on some users' devices may call API versions the current app no longer uses, but that the server still accepts, directly connecting to Path 13's mobile reverse-engineering coverage
- **JavaScript bundle analysis** — client-side code for a web app frequently references API endpoints beyond what's actually rendered in the current UI, sometimes including deprecated or in-development paths

## Practical inventory management

The actual fix is organizational as much as technical: maintaining a genuinely accurate, continuously-updated **API inventory** — every endpoint, its version, its owner, and its deprecation status — and treating decommissioning an old API version as a real, tracked engineering task with a deadline, not something left to happen "eventually." An API gateway (covered later in this path) that requires every new endpoint to be explicitly registered before it's routable adds a structural forcing function, rather than relying purely on developer discipline.

:::challenge Test yourself
Why does a deprecated API version that still receives requests pose a genuinely worse risk than the exact same vulnerability existing in the current, actively-maintained version?
:::

## Key terms

- **Shadow API** — a reachable API endpoint that isn't tracked in any official documentation or inventory.
- **Zombie API** — a previously documented endpoint that's been forgotten and lost active ownership over time.
- **API inventory** — a maintained, accurate record of every live endpoint, its version, owner, and deprecation status.

## Recap

API versioning is a reasonable engineering practice that creates a real security consequence: older versions receive less attention while sometimes remaining fully reachable with weaker security logic. Shadow APIs (never documented) and zombie APIs (documented, then forgotten) both represent unowned attack surface, discoverable through historical archives, version-pattern guessing, and client-side code analysis. A genuinely accurate, continuously-maintained API inventory, paired with real decommissioning deadlines, is the practical fix.

???refs
- [OWASP API9:2023 — Improper Inventory Management](https://owasp.org/API-Security/editions/2023/en/0xa9-improper-inventory-management/)
- [Wayback Machine](https://web.archive.org/) — a useful tool for finding historical API documentation.
???
