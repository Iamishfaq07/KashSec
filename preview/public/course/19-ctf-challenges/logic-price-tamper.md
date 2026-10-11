# Web — Name Your Own Price

**Category:** Web · **Difficulty:** Easy

## Scenario

`shop.kashsec-labs.test`'s checkout page renders a hidden form field to hold the order total, which it submits along with your shipping details when you click "Place Order." You captured the request the page sends for a $249.99 item.

## Provided data

```
POST /api/checkout HTTP/1.1
Host: shop.kashsec-labs.test
Content-Type: application/x-www-form-urlencoded

item_id=771&quantity=1&unit_price=249.99&total=249.99&shipping=standard
```

The server's response after a successful order:

```json
{"order_id": 9012, "status": "confirmed", "charged": 249.99}
```

## Your task

Notice that `unit_price` and `total` are submitted *by the browser*, as plain form fields — not looked up server-side from a product catalog. Find the flag hidden in what happens when you change them before submitting.

:::challenge What should the server actually trust here?
<details><summary>Hint 1</summary>A price is exactly the kind of value that should never be trusted from client input at all — the server should look up the real price for <code>item_id 771</code> from its own database and compute the total itself, ignoring whatever the client happened to send.</details>
<details><summary>Hint 2</summary>Try resubmitting the exact same request, but with <code>unit_price=0.01</code> and <code>total=0.01</code> instead of the real price.</details>
<details><summary>Show full answer</summary>The server accepts the client-submitted price at face value and returns: <code>{"order_id": 9013, "status": "confirmed", "charged": 0.01, "flag": "KASHSEC{cl13nt_s1d3_pr1c1ng_1s_n0_pr1c1ng}"}</code>. This is a classic <strong>business logic vulnerability</strong> — there's no injection, no broken authentication, nothing that a vulnerability scanner would ever flag. The application is working exactly as coded; the code itself just trusts data (a price) that must always be recomputed server-side from a trusted source, never accepted as client input at all.</details>
:::

## The flag

```
KASHSEC{cl13nt_s1d3_pr1c1ng_1s_n0_pr1c1ng}
```

## Why this matters beyond the CTF

Client-side price manipulation is one of the most common — and most consistently underestimated — real-world e-commerce vulnerability classes, because it requires zero technical sophistication once you know to look for it: intercept a request, change a number, resubmit. Path 15's bug bounty material and Path 11's business-logic coverage both flag this exact pattern as a genuinely high-value, genuinely easy thing to test for in scope, precisely because so many applications still get it wrong. The fix has one shape, always: never trust a price, discount, or total from client input — the server must independently derive it from data it controls.

## Bonus round — a sneakier variant

The same checkout flow also accepts a `discount_code` field. This code is legitimate: `LAUNCH10` (10% off), captured from a real promotional banner on the site.

```
POST /api/checkout HTTP/1.1
Content-Type: application/x-www-form-urlencoded

item_id=771&quantity=1&unit_price=249.99&total=224.99&discount_code=LAUNCH10
```

:::challenge What if the server DOES recompute the price, but still trusts one input too many?
<details><summary>Hint</summary>Suppose (unlike the main challenge) this endpoint correctly ignores your submitted <code>unit_price</code> and <code>total</code> entirely, and looks up the real price server-side. It still accepts <code>discount_code</code> as client input, and applies whatever percentage that code maps to. What field remains attacker-controlled that could still cause damage?</details>
<details><summary>Show answer</summary>Even with price properly server-derived, the <code>quantity</code> field is still worth scrutinizing on its own — a negative quantity (<code>quantity=-5</code>) could, on a naively implemented server, produce a negative total, which some payment processors or internal ledger systems might process as a <em>credit</em ) to the attacker's account rather than a charge. This is the real lesson of business logic testing: fixing one obviously-wrong field (price) doesn't mean every other client-controlled field on the same endpoint has been considered. A thorough logic-bug review tests every input independently, including ones that look "already fixed" from a previous finding.</details>
:::

:::tip Why scanners miss this entire category
Automated vulnerability scanners are built to recognize known bad patterns — injection syntax, known CVE signatures, malformed input causing errors. A request with a suspiciously low but syntactically perfect price field looks completely normal to a scanner; there's no error, no crash, no telltale signature. Finding business logic bugs requires actually understanding what the application is <em>supposed</em> to enforce, then checking whether it actually does — which is exactly why this category rewards careful human thinking over automated tooling.
:::

**Next up →** [Web — The Coupon That Wouldn't Quit](#/lesson/19-ctf-challenges/logic-coupon-replay)
