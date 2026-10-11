# Web — The Coupon That Wouldn't Quit

**Category:** Web · **Difficulty:** Medium

## Scenario

`shop.kashsec-labs.test` runs a one-time-use coupon system: `WELCOME15` gives 15% off, and is meant to be redeemable exactly once per account. You've read the (leaked, internal) pseudocode describing how redemption is implemented.

## Provided data

```python
def redeem_coupon(user, code):
    coupon = db.get_coupon(code)
    if coupon.used_by_user(user):
        return error("Already redeemed")
    apply_discount(user.cart, coupon.percent)
    order = create_order(user.cart)
    charge_payment(order)
    mark_coupon_used(coupon, user)   # <-- happens LAST, after payment
    return success(order)
```

A note on the checkout page's behavior: "Place Order" can be double-clicked, and the frontend has no protection against it — each click fires an independent request to `/api/redeem_coupon`.

## Your task

There's no injection, no broken authentication, nothing a scanner would flag. Something about the *order of operations* in this pseudocode makes the coupon reusable in a single narrow window. Find it, and figure out what the flag-bearing consequence would be.

:::challenge Spot the race condition
<details><summary>Hint 1</summary>Read the function line by line, in order. The check ("has this user already used this coupon?") happens at the very top. The action that actually <em>records</em> the coupon as used happens at the very bottom — after the discount is applied, the order is created, and payment is charged.</details>
<details><summary>Hint 2</summary>Now imagine two requests to redeem the same coupon arrive at the server at nearly the same instant — close enough that both pass the "already redeemed?" check before either one has reached the line that marks the coupon used. What happens to each of them independently?</details>
<details><summary>Show full answer</summary>This is a classic <strong>Time-Of-Check to Time-Of-Use (TOCTOU) race condition</strong>. If two redemption requests for the same coupon arrive close enough together, both can pass <code>coupon.used_by_user(user)</code> — which returns <code>false</code> for both, since neither has been marked used yet — before either one reaches <code>mark_coupon_used()</code> at the end. Both requests then proceed to apply the discount, create an order, and charge payment, and only afterward does the coupon finally get marked used (twice, redundantly, by two separate requests). The double-click behavior mentioned in the scenario is exactly the trigger: two near-simultaneous requests exploit the gap between the check and the action. In this scenario, successfully firing two overlapping redemption requests returns a second order confirmation containing: <code>{"order_id": 9021, "discount_applied": true, "flag": "KASHSEC{r4c3_c0nd1t10ns_d0nt_c4re_4b0ut_0rder}"}</code> — a second 15%-off order the coupon was never supposed to permit.</details>
:::

## The flag

```
KASHSEC{r4c3_c0nd1t10ns_d0nt_c4re_4b0ut_0rder}
```

## Why this matters beyond the CTF

Race conditions in business logic ("check then act" patterns with a gap in between) are a genuinely underappreciated real-world vulnerability class, showing up in coupon systems, account balance transfers, inventory reservation, and rate limiters alike — anywhere a system checks a condition and only updates state afterward, rather than atomically. They're also notoriously hard to find with automated scanners, since exploiting them requires precise timing, not a malformed payload. Path 21's rate-limiting lesson touches this same "check then act" pattern from a different angle; the underlying principle — make the check-and-update a single atomic operation, not two separate steps with a gap — applies identically here.

## Bonus round — how would you actually fire two near-simultaneous requests?

:::challenge What's the practical technique for exploiting a race window this narrow?
<details><summary>Hint</summary>A human manually double-clicking a button is far too slow and inconsistent to reliably land both requests inside a race window that might only be open for a few milliseconds. What tooling would give you the timing precision needed?</details>
<details><summary>Show answer</summary>Real-world race condition testing typically uses tooling built specifically for this — Burp Suite's "Turbo Intruder" extension, for example, can fire many requests within the same network packet or with sub-millisecond timing precision, dramatically increasing the odds of landing multiple requests inside a narrow check-then-act window compared to any manual approach. The core idea (send the same request many times, as close together in time as your tooling allows, and see whether more than one "wins") stays the same as the double-click description in this challenge — it's just executed with far more precision and repetition than manual clicking could ever achieve, which is exactly why race conditions that seem like they'd only trigger "by extreme luck" are, in practice, quite reliably exploitable with the right tools.</details>
:::

:::danger This category generalizes past coupons
The exact same "check happens early, the state-changing action happens late" shape shows up in withdrawal limits, one-time password redemption, seat reservation systems, and inventory counters. Whenever a piece of pseudocode (or your own code) checks a condition and then does something consequential several steps later, ask: could two of these run at once, and would that matter?
:::

**Next up →** [Web — Two Steps Forward, Zero Back](#/lesson/19-ctf-challenges/logic-skip-a-step)
