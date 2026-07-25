# API — The Order Number That Wasn't Yours

**Category:** API · **Difficulty:** Easy

## Scenario

`shop.kashsec-labs.test` has a mobile app backend at `/api/v2/`. You placed one order (order `#5510`) and, out of curiosity, opened your browser's DevTools to watch the app's network traffic while checking your order status.

## Provided data

The request your app made when you opened "My Order":

```
GET /api/v2/orders/5510 HTTP/1.1
Host: shop.kashsec-labs.test
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjo0NDIxfQ.redacted
```

And the response:

```json
{
  "order_id": 5510,
  "user_id": 4421,
  "item": "KashSec hoodie (M)",
  "shipping_address": "412 Birchwood Ln, Apt 3",
  "payment_last4": "4242"
}
```

Curious what a neighboring order number returns, you replay the exact same request with only the URL's number changed:

```
GET /api/v2/orders/5509 HTTP/1.1
Host: shop.kashsec-labs.test
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjo0NDIxfQ.redacted
```

## Your task

Find the flag hidden in whatever `/api/v2/orders/5509` actually returns.

:::challenge What does the API actually check?
<details><summary>Hint 1</summary>Your `Authorization` header proves *who you are* — it doesn't automatically mean the server checks whether the specific order you're asking for actually belongs to you.</details>
<details><summary>Hint 2</summary>This is the exact same underlying flaw from this section's earlier IDOR challenge — just wearing an API's clothing instead of a classic web app's. The OWASP API Top 10 has a name for it: it's the #1 item on that list.</details>
<details><summary>Show full answer</summary>The API accepts a valid, authenticated request and then fetches whatever order ID appears in the URL — without ever checking that <code>order_id 5509</code>'s owner matches the <code>user_id</code> encoded in your bearer token. Requesting <code>/api/v2/orders/5509</code> returns: <code>{"order_id": 5509, "user_id": 4420, "item": "Server rack cooling fan", "shipping_address": "KASHSEC{bol4_1s_th3_new_1dor}", "payment_last4": "8810"}</code> — someone else's full order, including their address, with the flag planted directly in the address field. This is <strong>BOLA (Broken Object Level Authorization)</strong>, the API Security path's #1 risk: your token proves identity, but the server never separately verified <em>authorization</em> for this specific object.</details>
:::

## The flag

```
KASHSEC{bol4_1s_th3_new_1dor}
```

## Why this matters beyond the CTF

BOLA is, by a wide margin, the most commonly found and most damaging API vulnerability class in real bug bounty programs and pentests — precisely because, like classic IDOR, it requires nothing more than two accounts and a willingness to change a number. Path 21's **BOLA & BFLA** lesson (and the matching **BOLA/BFLA Playground** lab) cover the full methodology: this challenge is the compressed, self-contained version of exactly that technique, applied to a JSON API instead of a rendered web page.

## Bonus round — a second, subtler variant

The same app has a `DELETE` endpoint for cancelling your own pending orders:

```
DELETE /api/v2/orders/5510 HTTP/1.1
Host: shop.kashsec-labs.test
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjo0NDIxfQ.redacted
```

:::challenge What happens if you point DELETE at order 5509 instead?
<details><summary>Hint</summary>You already confirmed GET on 5509 returns someone else's order with no ownership check. Does that necessarily mean DELETE has the exact same bug, or could the server check ownership on writes but not reads (or vice versa)?</details>
<details><summary>Show answer</summary>In a genuinely well-tested app, you can't know without actually trying — and that's the point of this bonus round. In this scenario, the same missing check applies to <code>DELETE</code> too: the endpoint only verifies the token is valid, not that the token's user owns the specific order being deleted, meaning any authenticated user could cancel <em>any other user's</em> pending order. This is why a real BOLA assessment tests every HTTP method on every object-referencing endpoint separately, rather than assuming a fix (or a bug) on one verb automatically applies to the others.</details>
:::

:::tip Two-account testing is the whole methodology
The entire technique demonstrated here — capture a legitimate request, replay it with a different object ID, see what comes back — is literally the entire BOLA-hunting methodology used in real assessments. It doesn't get more complicated than this; it just gets applied more exhaustively, across every endpoint and every HTTP method.
:::

**Next up →** [API — The Profile Update That Went Too Far](#/lesson/19-ctf-challenges/api-mass-assignment)
