# Forensics — The EXIF Trail

**Category:** Forensics · **Difficulty:** Easy

## Scenario

A photo was posted to a fictional company's public "team offsite" blog post, then quietly taken down an hour later. You saved a copy before it disappeared. Someone on the security team wants to know: does this image reveal anything the company wouldn't want public?

## Provided data

The image's EXIF metadata, extracted with a standard metadata-reading tool:

```
Make: Apple
Model: iPhone 13 Pro
DateTimeOriginal: 2026:03:14 09:41:02
GPSLatitude: 37.7749 N
GPSLongitude: 122.4194 W
Software: KASHSEC{3x1f_g30_l0c4t10n_l34ks}
Artist: d.whitfield
```

## Your task

Nothing here is encrypted or hidden through any clever technique — the flag is sitting in plain sight in one of the metadata fields. Your actual task is explaining *why* this metadata matters, beyond just spotting the string.

:::challenge What does this metadata actually expose?
<details><summary>Hint 1</summary>Photos taken on smartphones routinely embed far more information than most people realize — device model, exact timestamp, and (if location services were enabled) precise GPS coordinates of exactly where the photo was taken.</details>
<details><summary>Hint 2</summary>Look at the <code>Artist</code> field specifically alongside the GPS coordinates and timestamp. What does combining "who took this," "exactly where," and "exactly when" let an outside observer learn about a real person, even from a photo that seems perfectly innocuous on its face?</details>
<details><summary>Show full answer</summary>The flag, <code>KASHSEC{3x1f_g30_l0c4t10n_l34ks}</code>, sits directly in the (deliberately mislabeled, for this exercise) <code>Software</code> field. But the more important finding is everything <em>around</em> it: the <code>GPSLatitude</code>/<code>GPSLongitude</code> fields pin the exact location the photo was taken to within a few meters, the <code>DateTimeOriginal</code> field gives the precise moment, and <code>Artist</code> names the specific person (<code>d.whitfield</code>) associated with the device. Combined, this reveals a named individual's precise physical location at a precise time — information the person almost certainly never intended to publish, and information that's trivially extractable by anyone who downloads the original image file, regardless of what privacy settings the *website* hosting it might have.</details>
:::

## The flag

```
KASHSEC{3x1f_g30_l0c4t10n_l34ks}
```

## Why this matters beyond the CTF

Location and metadata leakage through unstripped image EXIF data is a real, well-documented category of accidental disclosure — public figures, journalists' sources, and ordinary employees have all had physical locations exposed through metadata nobody thought to check before posting a "harmless" photo. This connects directly to Path 09's Digital Privacy material (metadata as a personal-security risk) and this section's own OSINT-flavored recon skills — reviewing image metadata is a genuinely standard step in real OSINT reconnaissance, precisely because so many organizations and individuals still don't strip it before publishing.

## Bonus round — what should have happened before this photo was published?

:::challenge Design the fix, not just the finding
<details><summary>Hint</summary>The problem isn't that the photo has metadata — cameras are supposed to record this information for legitimate reasons (organizing your own photo library, for instance). The problem is specifically that it survived all the way to public publication unchanged. Where in that pipeline should it have been addressed?</details>
<details><summary>Show answer</summary>The realistic fix is a publishing-pipeline step, not a photography-behavior change: any image uploaded to a public-facing platform (a CMS, a social media scheduler, a company blog tool) should automatically strip EXIF metadata — GPS coordinates, device identifiers, and personal fields like <code>Artist</code> — before the image is ever served publicly, while still preserving the original, metadata-intact file privately for internal purposes if genuinely needed. Many major social platforms already do this automatically today specifically because of incidents like the one this challenge is modeling; smaller or custom-built platforms (like a company's own blog CMS) frequently do not, which is exactly why this remains a live real-world finding worth checking for during OSINT-style reconnaissance or a privacy-focused security review.</details>
:::

:::tip A five-second check worth building into habit
Before publishing any photo publicly — personally or professionally — running it through an EXIF viewer (or simply stripping metadata by default) takes seconds and closes off an entire category of accidental disclosure that's otherwise invisible to anyone just looking at the image itself.
:::

**Next up →** [Linux — The Binary That Betrayed Root](#/lesson/19-ctf-challenges/linux-gtfobins)
