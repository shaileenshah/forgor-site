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
    rip: FAMILIES, quiz: FAMILIES
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
})();
