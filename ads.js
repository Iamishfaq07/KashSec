/*
 * Optional ads (Google AdSense). OFF by default — no script loads and no ad
 * slots render anywhere on the site until this is configured.
 *
 * To turn ads on:
 *   1. Apply at https://adsense.google.com with this site and get approved
 *      (Google reviews the site first; takes anywhere from a day to a couple
 *      of weeks). You'll get a publisher ID like "ca-pub-1234567890123456".
 *   2. Set CLIENT_ID below to that value.
 *   3. Update /ads.txt at the repo root with the same publisher ID (Google
 *      requires this file to actually pay out on ad impressions).
 *   4. In the AdSense dashboard, create two manual ad units — one for the
 *      lesson sidebar, one for below lesson content — and copy each unit's
 *      "data-ad-slot" ID into SLOTS below.
 *   5. In the AdSense dashboard under "Privacy & messaging", enable Google's
 *      built-in consent tool. That's the actual GDPR/UK consent requirement
 *      for serving ads in the EU/UK — it's a dashboard toggle, not code, and
 *      it works automatically with the standard loader below. Don't hand-roll
 *      a custom consent banner instead; Google requires ad consent to come
 *      from a certified CMP, and their own tool already is one.
 *
 * Until CLIENT_ID is set, this file (and every ad slot in the site) is a
 * complete no-op — nothing is requested, nothing renders, nothing shifts
 * layout.
 */
const ADS_CONFIG = {
  clientId: '', // e.g. 'ca-pub-1234567890123456' — empty = disabled
  slots: {
    sidebar: '',      // ad unit slot ID for the lesson-sidebar placement
    lessonBottom: ''  // ad unit slot ID for the end-of-lesson placement
  }
};
window.ADS_CONFIG = ADS_CONFIG;

(function () {
  if (!ADS_CONFIG.clientId) return; // disabled: no request, no script, nothing
  if (!navigator.onLine) return;    // PWA offline session — don't even try

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS_CONFIG.clientId)}`;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
})();
