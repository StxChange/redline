/* Sweet 16 page: collection checklist + value estimator.
   Car names and color lists are read from the cards in the page,
   so the dropdowns always match what's displayed. */
(function () {
  'use strict';

  var track = typeof gtag === 'function' ? gtag : function () {};

  // ---------- Car data from the DOM ----------
  var cars = Array.prototype.map.call(document.querySelectorAll('.s16-card'), function (card) {
    return {
      num: card.querySelector('.s16-card-num').textContent.replace('#', '').trim(),
      name: card.querySelector('.s16-car-name').textContent.trim(),
      colors: Array.prototype.map.call(card.querySelectorAll('.swatch'), function (s) {
        return s.title;
      }),
      card: card
    };
  });

  // ================= Collection Checklist =================
  var STORAGE_KEY = 's16_owned';

  function loadOwned() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Set(Array.isArray(raw) ? raw : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveOwned(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) { /* private browsing — checklist just won't persist */ }
  }

  var owned = loadOwned();
  var countEl = document.getElementById('ownedCount');
  var fillEl = document.getElementById('progressFill');
  var hintEl = document.getElementById('checklistHint');
  var ctaEl = document.getElementById('checklistCta');
  var ctaTextEl = document.getElementById('checklistCtaText');
  var resetEl = document.getElementById('checklistReset');

  function renderChecklist() {
    var n = owned.size;
    countEl.textContent = n;
    fillEl.style.width = (n / cars.length * 100) + '%';
    ctaEl.hidden = n === 0;
    resetEl.hidden = n === 0;
    hintEl.hidden = n > 0;
    if (n === cars.length) {
      ctaTextEl.innerHTML = '<strong>The full Sweet 16 &mdash; congratulations!</strong> Log condition, colors &amp; values for every car you own.';
    } else if (n > 0) {
      ctaTextEl.innerHTML = 'Only <strong>' + (cars.length - n) + ' to go</strong>. Track condition, purchase price &amp; market value for every car.';
    }
    cars.forEach(function (car) {
      var isOwned = owned.has(car.num);
      car.card.classList.toggle('owned', isOwned);
      car.btn.textContent = isOwned ? '✓ Owned' : '+ I own this';
      car.btn.setAttribute('aria-pressed', isOwned);
    });
  }

  cars.forEach(function (car) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 's16-own-btn';
    btn.setAttribute('aria-label', 'Mark ' + car.name + ' as owned');
    btn.addEventListener('click', function () {
      if (owned.has(car.num)) owned.delete(car.num);
      else owned.add(car.num);
      saveOwned(owned);
      renderChecklist();
      track('event', 'checklist_toggle', { car: car.name, owned_count: owned.size });
    });
    car.card.appendChild(btn);
    car.btn = btn;
  });

  resetEl.addEventListener('click', function () {
    if (!confirm('Clear your checklist?')) return;
    owned.clear();
    saveOwned(owned);
    renderChecklist();
  });

  renderChecklist();

  // ================= Value Estimator =================
  // Ballpark ranges in USD for an unpackaged car in GOOD condition,
  // keyed by casting number: base = [min, max] for common colors,
  // rare = per-color overrides. Edit these to tune the tool.
  var VALUES = {
    '6217': { base: [40, 100],   rare: { 'Hot Pink': [2500, 5000] } },                          // Beatnik Bandit
    '6211': { base: [150, 400],  rare: { 'Rose': [800, 2500], 'Olive': [600, 1800] } },         // Custom Barracuda
    '6208': { base: [150, 450],  rare: { 'Gold': [700, 2000] } },                               // Custom Camaro
    '6215': { base: [125, 350],  rare: { 'Brown': [700, 2000], 'Creamy Pink': [700, 2000] } },  // Custom Corvette
    '6205': { base: [100, 300],  rare: { 'Brown': [500, 1500], 'Red': [400, 1200] } },          // Custom Cougar
    '6218': { base: [60, 150],   rare: { 'Hot Pink': [600, 1500], 'Magenta': [250, 600] } },    // Custom El Dorado
    '6212': { base: [80, 250],   rare: {} },                                                    // Custom Firebird
    '6213': { base: [80, 250],   rare: { 'Brown': [400, 1200] } },                              // Custom Fleetside
    '6206': { base: [150, 450],  rare: { 'Orange': [800, 2500], 'Brown': [700, 2000] } },       // Custom Mustang
    '6207': { base: [80, 250],   rare: {} },                                                    // Custom T-Bird
    '6220': { base: [75, 200],   rare: { 'Hot Pink': [500, 1500], 'Yellow': [300, 800] } },     // Custom Volkswagen
    '6210': { base: [75, 200],   rare: { 'Blue': [300, 800] } },                                // Deora
    '6214': { base: [40, 120],   rare: { 'White Enamel': [200, 500], 'Hot Pink': [400, 1000] } }, // Ford J-Car
    '6219': { base: [50, 150],   rare: { 'Brown': [300, 800], 'Hot Pink': [400, 1000] } },      // Hot Heap
    '6216': { base: [50, 150],   rare: {} },                                                    // Python
    '6209': { base: [50, 150],   rare: { 'Brown': [300, 800], 'Magenta': [200, 500] } }         // Silhouette
  };

  // Variant warnings shown under the estimate regardless of color.
  var SPECIAL_NOTES = {
    '6217': 'Early Hong Kong castings with four deep-dish wheels carry a premium.',
    '6208': 'White Enamel Camaros are considered prototypes and trade far above any of these ranges.',
    '6214': 'The Blue Enamel Indianapolis 500 promo version trades far above these ranges.',
    '6216': 'Check the base! A Python with the “Cheetah” base stamping is worth $4,000+ in any color.',
    '6220': 'A Hong Kong casting with no sunroof is one of the rarest Redlines made — far above these ranges.'
  };

  // Multipliers relative to "good" condition.
  var CONDITIONS = [
    { id: 'mint', label: 'Mint — like it left the blister', mult: 2.5 },
    { id: 'nearmint', label: 'Near Mint — minimal wear', mult: 1.75 },
    { id: 'good', label: 'Good — light wear, nice shine', mult: 1.0 },
    { id: 'fair', label: 'Fair — visible wear or toning', mult: 0.5 },
    { id: 'poor', label: 'Poor — heavy wear / restorable', mult: 0.25 }
  ];

  var carSel = document.getElementById('vtCar');
  var colorSel = document.getElementById('vtColor');
  var condSel = document.getElementById('vtCondition');
  var resultEl = document.getElementById('vtResult');
  var rangeEl = document.getElementById('vtRange');
  var noteEl = document.getElementById('vtNote');

  cars.forEach(function (car) {
    var opt = document.createElement('option');
    opt.value = car.num;
    opt.textContent = car.name;
    carSel.appendChild(opt);
  });

  CONDITIONS.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.label;
    condSel.appendChild(opt);
  });

  function carByNum(num) {
    for (var i = 0; i < cars.length; i++) if (cars[i].num === num) return cars[i];
    return null;
  }

  carSel.addEventListener('change', function () {
    var car = carByNum(carSel.value);
    colorSel.innerHTML = '';
    if (!car) {
      colorSel.disabled = true;
      colorSel.appendChild(new Option('Select a car first', ''));
    } else {
      colorSel.disabled = false;
      colorSel.appendChild(new Option('Select a color…', ''));
      car.colors.forEach(function (color) {
        colorSel.appendChild(new Option(color, color));
      });
    }
    renderEstimate();
  });
  colorSel.addEventListener('change', renderEstimate);
  condSel.addEventListener('change', renderEstimate);

  function money(v) {
    var rounded = v >= 1000 ? Math.round(v / 50) * 50 : Math.round(v / 5) * 5;
    return '$' + rounded.toLocaleString('en-US');
  }

  function renderEstimate() {
    var car = carByNum(carSel.value);
    var color = colorSel.value;
    var cond = null;
    for (var i = 0; i < CONDITIONS.length; i++) if (CONDITIONS[i].id === condSel.value) cond = CONDITIONS[i];

    if (!car || !color || !cond) {
      resultEl.hidden = true;
      return;
    }

    var data = VALUES[car.num];
    var isRare = Object.prototype.hasOwnProperty.call(data.rare, color);
    var range = isRare ? data.rare[color] : data.base;

    rangeEl.textContent = money(range[0] * cond.mult) + ' – ' + money(range[1] * cond.mult);

    var notes = [];
    if (isRare) notes.push(color + ' is one of the rarest colors for the ' + car.name + ' — have it verified before selling.');
    if (SPECIAL_NOTES[car.num]) notes.push(SPECIAL_NOTES[car.num]);
    noteEl.textContent = notes.join(' ');
    noteEl.hidden = notes.length === 0;

    resultEl.hidden = false;
    track('event', 'value_estimate', { car: car.name, color: color, condition: cond.id });
  }
})();
