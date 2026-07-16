# Crypto Hands-On Lab

This capstone lab turns every concept from this path — encoding vs. encryption vs. hashing, symmetric and asymmetric encryption, digital certificates — into hands-on practice using free, beginner-friendly tools.

## The main tool — CyberChef

**[CyberChef](https://gchq.github.io/CyberChef/)** (free, built by GCHQ, runs entirely in your browser with no installation) is the single best tool for building intuition across every topic in this path — a drag-and-drop interface for encoding, decoding, encrypting, decrypting, and hashing data, letting you chain operations together and watch the output change in real time.

## Tasks

1. **Encoding vs. encryption, hands-on.** In CyberChef, drag "To Base64" onto a piece of text, then drag "From Base64" right after it — confirm it round-trips perfectly with zero secret involved. Now try "AES Encrypt" with a key of your choice, followed by "AES Decrypt" using the *same* key — confirm it also round-trips, but this time try decrypting with a *different* key and observe the failure. This hands-on contrast is the fastest way to cement Path 06's opening distinction.
2. **Hash a few things and observe the avalanche effect.** Use CyberChef's "SHA2" operation (256-bit) on the string `KashSec`, then change just one character to `Kashsec` and hash again — compare the two outputs side by side and confirm they share no visible resemblance, despite the tiny input change.
3. **Break a Caesar cipher.** Encode a short message with "ROT13" (a special case of the Caesar cipher shifting by 13), then use CyberChef's "Brute Force" or manually try each of the 25 possible shifts using "ROT13 Brute Force" — confirm how trivially fast this classical cipher falls, directly connecting back to Path 06's opening lesson.
4. **Generate and inspect an RSA key pair.** Using a terminal with OpenSSL installed (pre-installed on most Linux/macOS systems):
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   cat public.pem
   ```
   Open both files and notice: the public key is genuinely safe to share (paste it anywhere), while the private key must never leave your control — exactly the asymmetric distinction from this path's second lesson.
5. **Encrypt a message with your RSA key pair.**
   ```bash
   echo "Test message for KashSec crypto lab" > message.txt
   openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin
   openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt
   cat decrypted.txt
   ```
   Confirm the message round-trips correctly — and try decrypting `encrypted.bin` with a *different* private key you generate, confirming it fails, exactly as expected from this path's asymmetric encryption lesson.
6. **Inspect a real website's certificate.** Visit any HTTPS site, click the padlock icon in your browser's address bar, and view the certificate details — find the issuing Certificate Authority, the domain(s) it's valid for, and its expiration date, connecting directly to this path's digital signatures & certificates lesson.
7. **Demonstrate ECB mode's pattern leakage.** In CyberChef, take a repetitive piece of text (e.g., the same short phrase repeated 20 times) and encrypt it with "AES Encrypt" using ECB mode versus CBC mode — compare the two ciphertext outputs and notice the ECB output shows an obvious repeating structure that CBC's output doesn't, a text-based echo of the classic "ECB penguin" image referenced in Path 06's symmetric encryption lesson.

8. **Sign and verify a message with HMAC.** In CyberChef, drag "HMAC" onto a short message using SHA256 and a key of your choice, then change a single character in the original message and recompute the HMAC — confirm the output changes completely. This is a direct, hands-on demonstration of Path 06.4's HMAC discussion: without the correct key, an attacker modifying the message has no way to produce a matching HMAC tag, which is exactly the integrity+authenticity guarantee that makes it useful for verifying JWTs and webhook payloads.
9. **Generate a certificate signing request (CSR).** Using OpenSSL, generate a fresh key pair and a CSR — the exact artifact a real website operator submits to a CA when requesting a certificate:
   ```bash
   openssl req -new -newkey rsa:2048 -nodes -keyout lab.key -out lab.csr \
     -subj "/CN=lab.kashsec-labs.test"
   openssl req -in lab.csr -noout -text
   ```
   Reading the CSR's decoded output (the last command) shows exactly the identity information — the domain name in `CN`, the public key — that a CA would review and sign, connecting directly to this path's certificate-issuance diagram.

:::challenge Build a mini crypto reference sheet
Using everything from this lab, create your own one-page cheat sheet: when to use encoding vs. encryption vs. hashing, when to use symmetric vs. asymmetric encryption, and the 8 crypto mistakes from the previous lesson, each with a one-line "how to avoid it." Save it in your notes — this is exactly the kind of reference that pays off constantly across the rest of this course.
:::

## Where crypto concepts show up throughout this course

Now that you've built this foundation, revisit (or look forward to) exactly where it applies: Path 02's HTTPS discussion, Path 11's JWT lessons and labs, Path 13's mobile Keystore/Keychain lessons, Path 17's ransomware mechanics and static analysis entropy checks, and this course's CTF Zone's layered-cipher and XOR challenges — every one of these now has real conceptual grounding behind it, rather than being isolated vocabulary.

## Key takeaway

Cryptography stops feeling like abstract math the moment you actually manipulate real ciphertext, hashes, and keys yourself — the CyberChef and OpenSSL exercises in this lab are exactly the kind of hands-on repetition that turns "I've heard of AES" into genuine, applicable understanding.

## 🎓 Path complete

You've now covered the encoding/encryption/hashing distinction, symmetric encryption (AES, modes of operation), asymmetric encryption (RSA, hybrid encryption, digital signatures), hashing and password storage, the certificate infrastructure behind HTTPS, the eight recurring real-world crypto mistakes, and hands-on practice with CyberChef and OpenSSL. Every crypto reference throughout the rest of this course should now make genuine sense.

???refs
- [CyberChef](https://gchq.github.io/CyberChef/) — the free, browser-based tool used throughout this lab.
- [OpenSSL Cookbook](https://www.feistyduck.com/library/openssl-cookbook/) — a free, practical reference for OpenSSL command-line usage.
???

**Explore more →** [Back to all paths](#/course) · [CTF Zone](#/lesson/19-ctf-challenges)
