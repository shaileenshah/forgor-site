/* Forgor: App Store links with campaign tags.
   Every link with data-store="<page>" gets ?ct=<page>[-<channel>].
   Channel comes from ?c= (or utm_source) on the URL, e.g. forgor.app/?c=ig -> ct=site-ig.
   PT = provider token from App Store Connect > Analytics > Campaigns; Apple only counts ct when pt is present. */
(function () {
  var PT = '128934949';
  var BASE = 'https://apps.apple.com/app/apple-store/id6813771857';
  /* Custom product pages (approved Oct 5, 2026): each page opens the App Store version that matches it. */
  var FAMILIES = '4fbf74f4-20ca-4cd2-b604-5401c02c9ab4';
  var HOMEOWNERS = '827f8569-b788-41cc-8752-0f3b54dc73ed';
  var RENEWALS = 'd96fd9d7-cbcc-4ca1-a45d-260e4163115e';
  var PPID = {
    passport: RENEWALS, trial: RENEWALS, registration: RENEWALS,
    homestead: HOMEOWNERS, 'new-to-texas': HOMEOWNERS, 'texas-homeowner-checklist': HOMEOWNERS,
    rip: FAMILIES, quiz: FAMILIES, birthdays: FAMILIES, 'household-dates-checklist': FAMILIES
  };
  /* Partner QR codes land on the homepage with ?c=<slug>: realtors and home services get the Homeowners page,
     schools, PTAs and family businesses get the Families page. */
  function ppidFor(page, c) {
    if (PPID[page]) return PPID[page];
    if (/^(realtor|re-|hoa|pest|hvac|roof|plumb|lawn|clean|home)/.test(c)) return HOMEOWNERS;
    if (/^(pta|school|preschool|daycare|library|vet|florist|bakery|icecream|coffee|family)/.test(c)) return FAMILIES;
    return '';
  }
  function channel() {
    var c = '';
    try {
      var q = new URLSearchParams(location.search);
      c = (q.get('c') || q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 16);
      if (c) { try { sessionStorage.setItem('forgor-c', c); } catch (e) {} }
      else { try { c = sessionStorage.getItem('forgor-c') || ''; } catch (e) {} }
    } catch (e) {}
    return c;
  }
  window.forgorStoreUrl = function (page) {
    var c = channel();
    var ct = (page + (c ? '-' + c : '')).slice(0, 40);
    var u = BASE + '?ct=' + encodeURIComponent(ct) + '&mt=8';
    var pp = ppidFor(page, c);
    if (pp) u += '&ppid=' + pp;
    if (PT) u += '&pt=' + PT;
    return u;
  };
  function apply() {
    document.querySelectorAll('[data-store]').forEach(function (a) { a.href = window.forgorStoreUrl(a.getAttribute('data-store')); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();

  /* Android (Oct 24, 2026): the app is iPhone-only for now, so App Store buttons on Android show
     a "coming soon" note instead of sending people to an Apple page that won't install. */
  window.forgorIsAndroid = /Android/i.test(navigator.userAgent || '');
  function androidNote() {
    var box = document.getElementById('forgorAndroid');
    if (!box) {
      var css = document.createElement('style');
      css.textContent = '#forgorAndroid{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.62)}' +
        '#forgorAndroid>div{max-width:320px;width:100%;border:1px solid rgba(255,255,255,.11);border-radius:22px;background:#181816;color:#EFE9DD;padding:28px 26px 22px;text-align:center;font-family:Manrope,-apple-system,system-ui,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
        '#forgorAndroid h3{font-family:"Playfair Display",Georgia,serif;font-weight:400;font-size:24px;line-height:1.2;margin:0}' +
        '#forgorAndroid p{color:#B9B2A4;font-size:14px;line-height:1.5;margin:12px 0 0}' +
        '#forgorAndroid a{display:inline-block;margin-top:18px;padding:11px 18px;border-radius:999px;background:#C6A664;color:#121212;text-decoration:none;font-weight:600;font-size:14px}' +
        '#forgorAndroid button{display:block;margin:12px auto 0;background:none;border:0;color:#8E8779;font:inherit;font-size:13px;cursor:pointer;padding:6px}';
      document.head.appendChild(css);
      box = document.createElement('div');
      box.id = 'forgorAndroid';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<div><h3>Forgor for Android<br>is on the way.</h3>' +
        '<p>Right now Forgor is iPhone only. The Android app is coming soon.</p>' +
        '<a href="mailto:hello@forgor.app?subject=Tell%20me%20when%20Forgor%20is%20on%20Android">Email me when it\'s ready</a>' +
        '<button type="button">Close</button></div>';
      box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'BUTTON') box.style.display = 'none'; });
      document.body.appendChild(box);
      try {
        var img = new Image();
        img.src = 'https://forgor.goatcounter.com/count?p=' + encodeURIComponent('/android-tap') + '&t=Android%20tap&rnd=' + Math.random().toString(36).slice(2);
      } catch (e) {}
    }
    box.style.display = 'flex';
  }
  window.forgorAndroidNote = androidNote;
  if (window.forgorIsAndroid) {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('[data-store], a[href*="apps.apple.com"]');
      if (!a) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      androidNote();
    }, true);
  }
})();
