# Device & Location Privacy

Every lesson so far in this path has focused on what you do online. This lesson covers something more physical and often overlooked: what your devices themselves reveal about your real-world location and habits, frequently without you actively doing anything at all.

:::tip
Location privacy is worth taking seriously for a reason beyond just "creepy" — precise, historical location data can reveal home address, workplace, daily routine, medical visits, and relationships, none of which most people would choose to hand over if asked directly, but which many apps collect by default anyway.
:::

## How your phone reveals location, even with GPS considerations aside

- **GPS** — the most precise source, but not the only one
- **Wi-Fi and Bluetooth scanning** — your phone can determine approximate location by detecting nearby Wi-Fi networks and Bluetooth devices and comparing them against a database, even without connecting to any of them and even with GPS disabled
- **Cell tower triangulation** — your carrier can approximate your location based on which cell towers your phone connects to, a baseline level of location awareness that exists independent of any app or setting
- **IP address geolocation** — a coarser but still real signal, revealing your general area (Path 08's cloud-networking material touched on IP-based location from a different angle) even for purely web-based activity with no app involved at all

## App permissions: the practical control point

Most location exposure in practice comes down to which apps you've granted **location permission** to, and how broadly:

- **"While using the app"** — location access only when the app is actively open and in use, generally the most privacy-respecting option for apps that genuinely need location (maps, weather)
- **"Always"** — location access even when the app is closed or running in the background, which a genuinely small number of apps actually need to function (a fitness tracker recording your full walk, for instance) — and worth specifically questioning for any app requesting it without an obvious reason
- **Precise vs. approximate location** — some platforms now let you grant an app your general area without your exact coordinates, a genuinely useful middle ground for apps that have some legitimate use for location without needing pinpoint precision

## Location history and the accounts that quietly keep it

Beyond individual apps, some account-level services maintain a long-term, detailed **location history** — a timeline of everywhere a device has been, often retained for years unless a user actively finds and disables it. This is meaningfully different from a single app's real-time location access: it's a persistent, searchable historical record, and it's frequently enabled by default as part of a broader account setup rather than something users deliberately opted into with full awareness of what it accumulates.

## Other device-level privacy signals worth knowing about

- **Ad identifiers** — a unique-per-device identifier (distinct from your name or account) that lets advertisers track behavior across different apps, resettable in most device settings, a genuinely useful periodic habit
- **Bluetooth and Wi-Fi discoverability** — leaving these broadly discoverable when not actively pairing a new device provides no benefit and a small amount of unnecessary exposure
- **Smart home and IoT devices** — increasingly common sources of always-on data collection (audio from smart speakers, video from doorbell cameras) worth the same permission-review scrutiny as phone apps

:::challenge Evaluate a permission request
A simple flashlight app requests "Always" location access and full contact list access during installation.

<details><summary>Hint</summary>Does a flashlight app have any plausible functional need for either of these permissions? What does a request this disproportionate to the app's actual purpose suggest?</details>
<details><summary>Show answer</summary>A flashlight app has no legitimate functional need for either location or contact access — its entire function is toggling the device's flash, which requires neither. A permission request this disproportionate to an app's stated purpose is a well-known warning sign of a data-harvesting app whose real business model is collecting and selling exactly this kind of information, sometimes for legitimate ad-targeting purposes and sometimes for less legitimate ones. The practical response: deny permissions that don't match an app's obvious function, and treat a flashlight app specifically requesting broad "Always" location and full contacts as a reason to look for a more narrowly-scoped alternative rather than granting the request out of habit.</details>
:::

## 🧪 Hands-on lab — audit your own device

On your own phone, review the location permission granted to your five most-used apps, and identify any set to "Always" that you can reasonably restrict to "While using the app" without breaking the app's actual function. Separately, check whether your device or a linked account maintains a location history, and review what it's actually retained.

:::challenge Test yourself
1. Name two ways a phone can reveal approximate location even with GPS disabled.
2. What's the practical difference between "While using the app" and "Always" location permission?
3. Why is a location history feature meaningfully different in risk from a single app's real-time location access?
:::

## Key terms

- **Location permission** — the granular control an operating system gives users over which apps can access device location, and under what conditions.
- **Location history** — a persistent, often long-retained timeline of a device's past locations, frequently maintained at the account level rather than per-app.
- **Ad identifier** — a resettable, device-level identifier used to track behavior across apps for advertising purposes.

## Recap

Your device reveals location through far more channels than GPS alone — Wi-Fi/Bluetooth scanning, cell tower proximity, and IP geolocation all contribute, largely invisibly. App-level location permissions are the most practical control point, and reviewing which apps have "Always" access (versus the more privacy-respecting "While using the app") against their actual functional need is a genuinely high-value, low-effort habit — directly extending this path's ongoing theme of understanding exactly what's being collected so you can make that choice deliberately.

???refs
- [EFF — Location Data and Privacy](https://www.eff.org/issues/location-tracking) — deeper coverage of location tracking mechanisms and mitigations
???

**Next up →** [Data Broker Opt-Outs](#/lesson/09-digital-privacy/data-broker-opt-outs)
