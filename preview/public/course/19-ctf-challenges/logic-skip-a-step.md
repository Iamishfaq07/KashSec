# Web — Two Steps Forward, Zero Back

**Category:** Web · **Difficulty:** Hard

## Scenario

`shop.kashsec-labs.test`'s checkout is a three-step wizard: `/checkout/cart` → `/checkout/payment` → `/checkout/confirm`. You captured the three requests a normal purchase makes, in order.

## Provided data

```
POST /api/checkout/cart     {"session_id": "sess_88f2"}                    → {"step": "payment", "cart_total": 189.00}
POST /api/checkout/payment  {"session_id": "sess_88f2", "card_token": "tok_live_..."} → {"step": "confirm", "payment_verified": true}
POST /api/checkout/confirm  {"session_id": "sess_88f2"}                     → {"order_id": 4471, "status": "shipped"}
```

Each step is a completely independent API call, tracked only by the shared `session_id` — there's no single server-side call chaining the three steps together as one atomic transaction.

## Your task

The `/checkout/confirm` endpoint's job is to finalize an order — but does it actually verify that payment was confirmed for *this specific session* before doing so? Find out, and locate the flag.

:::challenge Can you skip straight to confirm?
<details><summary>Hint 1</summary>Try starting a brand-new session at <code>/checkout/cart</code> to get a fresh, valid <code>session_id</code> — then call <code>/checkout/confirm</code> directly with that new session ID, skipping the <code>/checkout/payment</code> step entirely.</details>
<details><summary>Hint 2</summary>The three steps only share state through <code>session_id</code>, and nothing in the scenario confirms that <code>/checkout/confirm</code> actually checks a <code>payment_verified</code> flag tied to that session before finalizing the order. Multi-step flows are only as safe as the weakest individual step's own enforcement — a later step assuming an earlier one "must have" run is not the same as it actually checking.</details>
<details><summary>Show full answer</summary>Calling <code>POST /api/checkout/confirm</code> with a fresh <code>session_id</code> that never went through <code>/checkout/payment</code> at all still succeeds: <code>{"order_id": 4472, "status": "shipped", "payment_verified": false, "flag": "KASHSEC{sk1pp3d_p4ym3nt_st1ll_g0t_sh1pp3d}"}</code>. The <code>/checkout/confirm</code> endpoint never independently verifies that a valid, completed payment actually exists for this session — it assumes, incorrectly, that reaching this endpoint at all implies the earlier steps happened in order. Because each step is a fully independent API call rather than a single server-enforced state machine, nothing stops a client from calling the endpoints in whatever order — or subset — they like.</details>
:::

## The flag

```
KASHSEC{sk1pp3d_p4ym3nt_st1ll_g0t_sh1pp3d}
```

## Why this matters beyond the CTF

Multi-step flows — checkout wizards, onboarding sequences, password-reset flows, KYC/identity verification — are consistently one of the richest sources of business logic bugs in real applications, precisely because developers build the *UI* to enforce step order (you can't click "Confirm" until you've clicked "Next" on the payment screen) while forgetting that the *API itself* must independently enforce the same order, since nothing stops a client from calling any endpoint directly. Path 15's bug bounty material on business logic testing specifically calls out "can later steps be reached without earlier ones?" as a standard test to run against any multi-step flow you encounter in scope.

## Bonus round — the same bug, worse consequences

A near-identical multi-step flow exists on this site's account-verification process: `/verify/send-code` → `/verify/check-code` → `/verify/mark-verified`.

:::challenge What's the worst-case version of this same flaw?
<details><summary>Hint</summary>Apply the exact same test — can you reach the final step directly, without ever actually proving you received and entered the correct verification code?</details>
<details><summary>Show answer</summary>If <code>/verify/mark-verified</code> doesn't independently check that <code>/verify/check-code</code> actually succeeded for this session, an attacker could mark <em>any</em> account "verified" without ever proving control of the email or phone number the verification was meant to confirm — a significantly more severe consequence than the checkout example, since it undermines an identity/ownership guarantee other parts of the system likely rely on (like account recovery, or elevated trust for verified accounts). This is exactly why business logic testing shouldn't stop at "I found one instance of this bug" — the same missing-check pattern is worth testing against every multi-step flow in scope, since the severity can vary enormously depending on what the skipped step was actually supposed to guarantee.</details>
:::

:::tip The universal test for multi-step flows
For any flow with sequential steps, ask: "if I call the *last* step directly, with data that looks plausible, does the server independently verify every earlier step actually happened — or does it just trust that reaching this endpoint implies the rest of the journey occurred?" This single question finds a disproportionate number of real business logic bugs relative to how simple it is to ask.
:::

**Next up →** [AI — Leak the System Prompt](#/lesson/19-ctf-challenges/ai-prompt-leak)
