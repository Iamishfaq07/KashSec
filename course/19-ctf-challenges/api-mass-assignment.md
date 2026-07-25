# API — The Profile Update That Went Too Far

**Category:** API · **Difficulty:** Medium

## Scenario

`forum.kashsec-labs.test` lets you update your own profile through a `PATCH` request. You captured the request the site's own "Edit Profile" form sends when you change your bio.

## Provided data

The legitimate request the UI sends:

```
PATCH /api/v1/users/me HTTP/1.1
Host: forum.kashsec-labs.test
Content-Type: application/json
Cookie: session=redacted

{"display_name": "kash_fan_92", "bio": "long-time lurker, first-time poster"}
```

Server response:

```json
{"display_name": "kash_fan_92", "bio": "long-time lurker, first-time poster", "role": "member", "verified": false}
```

Notice the response includes two fields — `role` and `verified` — that the UI never gave you any option to set.

## Your task

The server's update logic is, in essence, `Object.assign(user, request.body)` — it merges whatever JSON keys you send directly onto your account record, with no allow-list restricting which fields a client is permitted to touch. Craft a request that reveals the flag.

:::challenge Find the field that shouldn't be writable
<details><summary>Hint 1</summary>The response already told you two field names that exist on your account but that the UI never exposes as editable: <code>role</code> and <code>verified</code>. If the server accepts any field you send, what happens if you just... send one of those?</details>
<details><summary>Hint 2</summary>Try sending a <code>role</code> value the forum reserves for site staff — <code>"moderator"</code> is a reasonable guess for a forum. Include it alongside a normal field like <code>bio</code> so the request still looks like an ordinary profile edit.</details>
<details><summary>Show full answer</summary>Sending <code>{"bio": "testing", "role": "moderator"}</code> succeeds, and the server responds: <code>{"display_name": "kash_fan_92", "bio": "testing", "role": "moderator", "verified": false, "flag": "KASHSEC{m4ss_4ssignment_4dmin_f0r_free}"}</code>. The endpoint never restricts which fields a client may set — it binds the entire request body onto the account record. Because <code>role</code> happens to be one of those fields, a "profile update" endpoint becomes a privilege-escalation vector. The forum's response even includes a bonus flag field once you're recognized as staff-tier, confirming the escalation worked.</details>
:::

## The flag

```
KASHSEC{m4ss_4ssignment_4dmin_f0r_free}
```

## Why this matters beyond the CTF

Mass assignment is one of the sneakier API vulnerability classes precisely because it's invisible from the client-side UI — the form never shows you a `role` dropdown, so a developer reviewing the frontend sees nothing wrong. The bug only becomes visible when you inspect what the *API itself* actually accepts, independent of what the UI happens to expose. Path 21's **Mass Assignment Toy** lab walks through this exact pattern hands-on, and the matching lesson covers the fix: explicit allow-lists for every writable field, never a raw `Object.assign` onto a live model.

## Bonus round — a field with no obvious name

The same endpoint also silently accepts a field the response never showed you at all: `account_balance`.

:::challenge How would you even find a field the server never mentions?
<details><summary>Hint</summary>You can't discover an invisible field purely by observation — but you <em>can</em> make educated guesses based on what the app clearly does (it's a forum with some kind of paid tier, based on the "verified" field hinting at premium status). Real-world mass assignment hunting often means trying plausible field names based on the app's domain, not just the ones you've already seen.</details>
<details><summary>Show answer</summary>Sending <code>{"bio": "testing", "account_balance": 999999}</code> succeeds and the field appears in the response on your next profile fetch — confirming the server accepts and stores a completely undocumented, UI-invisible field just because it happened to exist as a column on the underlying user model. This is the honest, uncomfortable truth about testing for mass assignment against a real target: you often can't enumerate every vulnerable field from the outside. The practical defense-side lesson matters more here than the offense-side one — a server should never trust that "the field isn't in the docs" provides any real protection, which is exactly why allow-listing (not guessing what attackers might try) is the only reliable fix.</details>
:::

:::danger This generalizes past "role" fields
Mass assignment isn't only a privilege-escalation bug. Depending on the target model, it can just as easily let you set a price to zero, mark an unpaid invoice as paid, or flip a "verified" flag meant to be earned, not self-assigned. Whatever field exists on the model and isn't explicitly protected is fair game to a client that sends it.
:::

**Next up →** [API — Locked Out, Sort Of](#/lesson/19-ctf-challenges/api-rate-limit-bypass)
