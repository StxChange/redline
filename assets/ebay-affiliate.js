/* ===== eBay Partner Network affiliate links =====
   1. Apply at https://partner.ebay.com (free).
   2. Once approved, create a campaign and paste its Campaign ID below.
   Links work without it (plain eBay searches) — you just won't earn
   commission until CAMPID is filled in. */

window.EPN = (function () {
  var CAMPID = ''; // <-- paste your EPN Campaign ID here, e.g. '5339012345'

  /* Builds an eBay US search URL with EPN tracking parameters.
     customid tags each link so EPN reports show which page/car converted. */
  function searchUrl(query, customid) {
    var base = 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(query);
    if (!CAMPID) return base;
    return base +
      '&mkcid=1&mkrid=711-53200-19255-0&siteid=0&toolid=10001&mkevt=1' +
      '&campid=' + encodeURIComponent(CAMPID) +
      '&customid=' + encodeURIComponent(customid || '');
  }

  return { searchUrl: searchUrl, ready: !!CAMPID };
})();

/* Auto-inject a "Find on eBay" button into every Sweet 16 car card. */
document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.s16-card');
  cards.forEach(function (card) {
    var nameEl = card.querySelector('.s16-car-name');
    var body = card.querySelector('.s16-card-body');
    if (!nameEl || !body) return;
    var name = nameEl.textContent.trim();
    var slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    var a = document.createElement('a');
    a.className = 'ebay-find-btn';
    a.href = window.EPN.searchUrl('1968 Hot Wheels Redline ' + name, 'sweet16-' + slug);
    a.target = '_blank';
    a.rel = 'noopener nofollow sponsored';
    a.innerHTML = 'Find <b>' + name + '</b> on eBay &rarr;';
    a.addEventListener('click', function () {
      if (typeof gtag === 'function') gtag('event', 'ebay_click', { item: slug });
    });
    body.appendChild(a);
  });
});
