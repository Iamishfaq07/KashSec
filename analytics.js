/*
 * Optional, privacy-friendly analytics (Plausible). OFF by default.
 *
 * Plausible is cookieless, collects no personal data, and needs no consent
 * banner. To turn it on:
 *   1. Create a free/self-hosted Plausible site for your domain.
 *   2. Set ANALYTICS_DOMAIN below to that domain (e.g. 'kashsec.vercel.app').
 *   3. (Self-hosted only) set ANALYTICS_SRC to your script URL.
 * Leave ANALYTICS_DOMAIN empty to keep analytics completely disabled — no
 * external request is made at all.
 */
(function () {
  const ANALYTICS_DOMAIN = ''; // e.g. 'kashsec.vercel.app' — empty = disabled
  const ANALYTICS_SRC = 'https://plausible.io/js/script.hash.js'; // hash mode = counts SPA hash routes

  if (!ANALYTICS_DOMAIN) return; // disabled: do nothing, load nothing

  const s = document.createElement('script');
  s.defer = true;
  s.setAttribute('data-domain', ANALYTICS_DOMAIN);
  s.src = ANALYTICS_SRC;
  document.head.appendChild(s);
})();
