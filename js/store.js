/* Forgor: App Store links with campaign tags.
   Every link with data-store="<page>" gets ?ct=<page>[-<channel>].
   Channel comes from ?c= (or utm_source) on the URL, e.g. forgor.app/?c=ig -> ct=site-ig.
   PT = provider token from App Store Connect > Analytics > Campaigns; Apple only counts ct when pt is present. */
(function () {
  var PT = '128934949';
  var BASE = 'https://apps.apple.com/app/apple-store/id6813771857';
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
    if (PT) u += '&pt=' + PT;
    return u;
  };
  function apply() {
    document.querySelectorAll('[data-store]').forEach(function (a) { a.href = window.forgorStoreUrl(a.getAttribute('data-store')); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
