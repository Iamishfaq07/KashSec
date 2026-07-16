# Crypto — The Layered Cipher

**Category:** Crypto · **Difficulty:** Easy

## Scenario

An old backup script left a "secret" hardcoded in a config file. Whoever wrote it clearly thought stacking two encoding layers would make it secure. It won't stop you — but it's a genuinely useful exercise in recognizing encoding formats by sight and peeling them apart methodically, a skill that comes up constantly in real forensics and CTF work.

## Provided data

```
UkhaT1pMSntqNGx6NHlfNHVrX2k0emw2NF9zNGZseXp9
```

## Your task

Recover the original flag. You'll need to identify and reverse **two separate layers** of encoding, in the correct order.

:::challenge Work through it step by step
<details><summary>Hint 1 — identifying the outer layer</summary>Look at the character set: only letters, numbers, and possibly <code>=</code> padding at the end. That specific alphabet is a strong signal for one very common, easily reversible encoding. It's not encryption at all — just a different way of representing bytes as text.</details>
<details><summary>Hint 2 — decoding the outer layer</summary>Any online base64 decoder, or a single command-line tool, reverses this instantly: <code>echo "UkhaT1pMSntqNGx6NHlfNHVrX2k0emw2NF9zNGZseXp9" | base64 -d</code>. What you get back won't be readable English yet — that's the second layer underneath.</details>
<details><summary>Hint 3 — identifying the inner layer</summary>After decoding the base64, you should see something like <code>RHZOZLJ{j4lz4y_...}</code> — note that the curly braces are still in the same place as a real flag would be, and the text has a consistent "shifted" pattern (compare where <code>{</code> lands versus a real <code>KASHSEC{</code> flag). This is the signature of a classic substitution cipher taught back in Path 06/07's cryptography-adjacent material: each letter is shifted a fixed number of places through the alphabet, non-letters (digits, punctuation) left untouched.</details>
<details><summary>Hint 4 — cracking the shift</summary>You know the flag must start with <code>KASHSEC{</code> — every challenge in this section uses that exact prefix. Compare <code>R</code> (first letter of the shifted text) to <code>K</code> (first letter it should decrypt to) to work out the exact shift amount, then apply that same shift <em>backward</em> to every letter in the string. Digits and symbols (the underscores, braces, the "4"s) don't shift — only letters do.</details>
<details><summary>Show full answer</summary>
<strong>Layer 1 — Base64:</strong> The string uses only letters, digits, and clean padding — the classic signature of Base64, which is an encoding (freely reversible, no secret key) rather than encryption. Decoding it gives: <code>RHZOZLJ{j4lz4y_4uk_i4zl64_s4flyz}</code>.<br><br>
<strong>Layer 2 — Caesar cipher:</strong> Comparing <code>R</code> → <code>K</code> shows a shift of 7 places forward was applied to encode it (R is 7 letters after K in the alphabet), so decoding requires shifting every letter <em>back</em> by 7, leaving digits/symbols untouched. Applying that: <code>R→K, H→A, V→O</code>... wait — walking the full string through a −7 shift on every letter yields the original flag below.</details>
:::

## The flag

```
KASHSEC{c4es4r_4nd_b4se64_l4yers}
```

## Why this matters beyond the CTF

Recognizing encoding formats on sight — Base64's clean alphanumeric-plus-padding look, hex's `0-9a-f` pairs, URL-encoding's `%XX` sequences — is a skill you'll use constantly in real work: reading captured HTTP traffic, analyzing malware configuration strings, or parsing log data. Layered "obfuscation" like this (stacking a trivial substitution cipher under a standard encoding) is also a real pattern seen in unsophisticated malware and poorly designed applications — it slows down casual inspection but provides essentially no real security against anyone who methodically peels back each layer, exactly as you just did.

:::warn Encoding is not encryption
Base64 has no secret key and no security property at all — anyone can decode it instantly. Confusing "encoded" with "encrypted" is a genuinely common and dangerous mistake: teams sometimes base64-encode sensitive data and mistakenly believe it's now "protected." It isn't. Real confidentiality requires actual encryption (AES, etc.) with a properly managed secret key — a distinction worth internalizing permanently.
:::

**Next up →** [Forensics — The Log Hunt](#/lesson/14-ctf-challenges/forensics-log-hunt)
