# Browser DevTools Lab

DevTools is, genuinely, your very first hacking tool — free, built into every modern browser, and capable of far more than most casual users ever realize. This lab is the capstone of Path 05, tying together everything from page structure to cookies into one hands-on session.

## Tasks

1. **Open DevTools and explore every tab.** Press `F12` (or right-click → Inspect) on any website. Spend two minutes just clicking through each tab — **Elements**, **Console**, **Network**, **Application**, **Sources** — before doing anything else, to build a mental map of what lives where.
2. **Inspect and modify elements live.** In the **Elements** tab, double-click any text on the page and edit it directly — change a headline, a price, a name. This only changes what *you* see locally (nothing is actually sent to the server), but it's a genuinely useful trick for testing how a page would look with different content, and a common (harmless) prank format online is built entirely on this misunderstanding.
3. **Watch the Network tab while loading a page.** Open the **Network** tab, then reload the page. Watch every request fire in order — the HTML document first, then CSS, JavaScript, images, and often several API calls. Click on any request to see its full headers, response body, and timing — this is exactly the view Path 07's web reconnaissance lesson relies on constantly.
4. **Check Cookies and Storage.** In the **Application** tab, review Cookies (covered in the previous lab), plus `localStorage` and `sessionStorage` — many modern apps (including this very course site) store data client-side here instead of, or alongside, cookies.
5. **Run JavaScript in the Console.** Type `document.title` and press Enter — you'll see the page's title returned instantly. Try `document.cookie` to see (non-HttpOnly) cookies as a raw string. The Console is a live JavaScript environment running in the context of the current page — exactly what makes XSS (Path 07) so powerful: an attacker-controlled script running here has the same access you just demonstrated to yourself.

:::tip DevTools works on almost anything
This entire lab works on virtually any website — you don't need a special vulnerable lab environment for these particular exercises (though never submit forms, modify persisted server-side data, or attempt anything beyond passive inspection on a site without authorization). Practicing comfort with DevTools itself, on ordinary sites, is the actual goal here.
:::

:::challenge Prove a DevTools-based finding
Find a way to make a page's visible content say something different using only DevTools element editing, and take a screenshot as a simple proof-of-concept. Then, separately, use the Network tab to find one API call a page makes that you didn't expect, and note what data it sends or receives — many sites reveal more than intended in these background calls, exactly the kind of "always check every request" habit Path 07's recon lesson builds on.
:::

## Key takeaway

DevTools removes the mystery from "how does this website actually work" — every request, every cookie, every line of rendered HTML is fully inspectable, and comfort navigating it fluidly is a genuine prerequisite for effective web security testing in every path that follows.

**Explore more →** [Path 06 — Cybersecurity Fundamentals](#/lesson/06-fundamentals)
