# Webhook Security

The BOLA & BFLA lesson covered the two most common authorization failures in APIs that receive requests. This lesson covers the security of APIs on the *opposite* side of that relationship — **webhooks**, where your own application receives requests initiated by someone else's system, directly connecting to Path 11's SSRF lesson's trust-boundary framing, now applied to inbound rather than outbound requests.

## What a webhook actually is, and why it inverts the usual trust model

A **webhook** is a callback mechanism: instead of your application repeatedly polling another service for updates, that other service sends an HTTP request directly to an endpoint you expose, the moment an event occurs (a payment completes, a file finishes uploading, a form gets submitted). This inverts the usual API security model this path has covered so far — instead of your API authenticating a known, registered client, your API has to authenticate an *incoming* request from a third party you don't fully control.

## Why "it came from the right IP" isn't sufficient authentication

A genuinely common, insufficient webhook security approach: simply allowlisting the sender's known IP address range. This fails for several practical reasons — many webhook providers use dynamic or shared infrastructure with IP ranges that change without notice, and more fundamentally, IP-based trust says nothing about whether the specific *content* of a request was genuinely sent by the legitimate provider or forged by an attacker who's somehow gained network position to spoof or relay from a trusted range.

## Signature verification — the actual correct mechanism

The genuinely correct approach nearly every mature webhook provider implements: **signature verification**. The webhook provider computes a cryptographic signature (typically an HMAC, directly connecting to Path 00's hashing coverage) over the request body using a shared secret both parties know, and includes that signature in a request header. Your endpoint independently recomputes the same signature using the same shared secret and compares it against what was received — a mismatch means the request was either corrupted in transit or, more importantly, wasn't genuinely sent by the party holding the real shared secret.

```
Received signature header: sha256=a3f8b9c2...
Your computed signature:   sha256=a3f8b9c2...
Match? → Process the webhook
Mismatch? → Reject immediately, log the attempt
```

## Replay attacks — why signature verification alone isn't complete

A subtler risk directly connecting to Path 15's race-conditions-deep-dive lesson's check-then-act framing: even a properly signed webhook request can be **replayed** — an attacker who intercepts a single legitimate, correctly-signed request (through a compromised network position, a logging system, or a misconfigured proxy) can resend that exact same request repeatedly, and signature verification alone won't catch it, since the signature is still mathematically valid. Robust webhook handling includes a **timestamp check** (rejecting requests older than a defined window) and, ideally, tracking already-processed event IDs to reject exact duplicates — directly mirroring the idempotency concerns the race-conditions lesson raised for check-then-act operations generally.

## SSRF risk when *you* configure outbound webhooks

Directly connecting to Path 11's SSRF lesson: the reverse scenario also matters — if your own application lets users configure a webhook URL you'll send outbound requests to (a common feature: "notify this URL when an event happens"), that's a direct, classic SSRF vector unless carefully validated. An attacker configuring their own "webhook URL" as `http://169.254.169.254/latest/meta-data/` (the cloud metadata endpoint from Path 11's SSRF coverage) can trick your own server into making exactly the request that lesson warned about.

## Practical webhook security checklist

- Verify signatures on every incoming webhook, using a constant-time comparison function (avoiding timing-attack leakage, directly connecting to Path 00's cryptography coverage)
- Reject requests outside a reasonable timestamp window, and track processed event IDs to reject replays
- Validate and restrict any outbound webhook URLs your own application allows users to configure, using an allowlist approach rather than a blocklist
- Never trust webhook payload content for authorization decisions without independently verifying the referenced resource still exists and belongs to the expected account

:::challenge Test yourself
Why does signature verification alone fail to prevent a webhook replay attack, even though the replayed request's signature remains mathematically valid?
:::

## Practice: integrity, freshness, and one business effect

These checks solve different problems:

| Check | Question it answers | What it does not prove |
| --- | --- | --- |
| Signature over the provider's documented message | Was this message authenticated under the expected key? | That the event is new |
| Signed timestamp within an accepted window | Is this delivery recent enough under our contract? | That it has not already been processed |
| Durable event identity and atomic processing | Can this event apply the business change again? | That the sender's event is appropriate for this tenant |

Verify the exact bytes required by the provider **before** reformatting or trusting the JSON. Use a constant-time MAC comparison. Follow that provider's timestamp, retry, key-rotation, and response rules; not every webhook scheme uses the same signed fields.

Two workers can both observe an event as unseen. A process-local set only demonstrates serial deduplication. For a database-local update, an inbox row with a unique event key and the business update may share a transaction. For an external effect, use an outbox or an idempotent downstream operation and test crash recovery. “Exactly once” is not a property to assume from a successful demo.

Try [Signed once, processed twice](/expert-labs/webhook-replay.html). Its fictional HMAC contract and Python fixture let you repair verification and serial replay handling without a payment account. The report asks you to explain the concurrency and durability work still needed in a real integration.

## Key terms

- **Webhook** — a callback mechanism where a third-party service sends an event notification directly to your application's endpoint.
- **HMAC signature verification** — computing and comparing a cryptographic signature to confirm a webhook request genuinely came from the expected sender.
- **Replay attack** — resending a previously valid, correctly-signed request to trigger unintended repeated processing.

## Recap

Webhooks invert the usual API trust model, requiring you to authenticate an incoming request from a third party rather than a client you registered. IP allowlisting is insufficient; HMAC signature verification is the correct mechanism, but must be paired with timestamp and event-ID checks to prevent replay attacks. When your own application allows user-configured outbound webhook URLs, that's a direct SSRF vector requiring the same validation discipline Path 11 taught for any user-controlled destination URL.

???refs
- [Stripe — Webhook signature verification](https://stripe.com/docs/webhooks/signatures) — a widely-referenced, well-documented real-world implementation.
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
???
