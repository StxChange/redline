(function () {
  "use strict";

  var cars = [
    {
      id: "RL-01", name: "Turbofire", year: "1969",
      series: "California Custom Miniatures",
      color: "Spectraflame olive / green", origin: "U.S.A. only", qty: 2,
      low: 200, high: 400, rarity: "Common color; scarce on intact card",
      confidence: "High", image: "collection/turbofire.jpeg",
      note: "Both examples retain their matching Turbofire buttons. Card and blister wear differ, so value each separately after seal inspection.",
      verify: "Photograph both card backs, blister edges, bases and any cracks.",
      query: "1969 Hot Wheels Redline Turbofire olive green blister pack button",
      reference: "https://onlineredlineguide.com/69/69_turbofire/69_turbofire.html"
    },
    {
      id: "RL-02", name: "Lola GT70", year: "1969",
      series: "Grand Prix Series", color: "Spectraflame red",
      origin: "U.S./Hong Kong variation — base required", qty: 1,
      low: 225, high: 350, rarity: "Popular Grand Prix casting",
      confidence: "Medium", image: "collection/lola-gt70.png",
      note: "Photo identification is consistent with a red Lola GT70 on the green Grand Prix card with matching button.",
      verify: "Confirm the button text, base country and that the blister is factory sealed.",
      query: "1969 Hot Wheels Redline Lola GT70 red blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1969+Lola+GT+70&yearsearch=n"
    },
    {
      id: "RL-03", name: "Chaparral 2G", year: "1969",
      series: "Grand Prix Series", color: "White enamel with blue trim",
      origin: "Likely U.S.A.; base required", qty: 2, low: 350, high: 650,
      rarity: "Common color; complete wing/card is premium",
      confidence: "High", image: "collection/chaparral.png",
      note: "Both cars appear to retain the signature tall rear wing and matching buttons. Original wings are a major value driver.",
      verify: "Confirm wings are original, inspect decal sheet/card back and photograph each blister seal.",
      query: "1969 Hot Wheels Redline Chaparral 2G white blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1969+Chaparral+2G&yearsearch=n"
    },
    {
      id: "RL-04", name: "Fire Chief Cruiser", year: "1970",
      series: "California Custom Miniatures",
      color: "Spectraflame red / copper, CHIEF graphics", origin: "U.S.A.",
      qty: 4, low: 225, high: 350,
      rarity: "Uncommon as a carded matched group", confidence: "High",
      image: "collection/fire-chief.png",
      note: "Four similar examples create a useful mini-run. Roof beacon, side graphics and matching button are visible.",
      verify: "Record card/blister condition separately; check beacon and graphics on every car.",
      query: "Hot Wheels Redline Fire Chief Cruiser MOC blister pack button",
      reference: "https://www.ebay.com/itm/398103320075"
    },
    {
      id: "RL-05", name: "Indy Eagle", year: "1969",
      series: "Grand Prix Series", color: "Spectraflame green",
      origin: "Hong Kong only", qty: 2, low: 250, high: 425,
      rarity: "Common color; carded examples scarce", confidence: "High",
      image: "collection/indy-eagle.jpeg",
      note: "Both have matching Indy Eagle buttons. Production examples have blue windscreens; interior color can change value.",
      verify: "Photograph windscreens, interiors, decal sheets, bases and complete blister seals.",
      query: "1969 Hot Wheels Redline Indy Eagle green blister pack button",
      reference: "https://onlineredlineguide.com/69/69_indy_eagle/69_indy_eagle.html"
    },
    {
      id: "RL-06", name: "Sand Crab", year: "1970",
      series: "California Custom Miniatures",
      color: "Spectraflame rose / hot pink", origin: "U.S.A.", qty: 2,
      low: 250, high: 450, rarity: "Desirable color; condition sensitive",
      confidence: "High", image: "collection/sand-crab.jpeg",
      note: "Two vivid rose examples with matching buttons. The shade and original chrome engine/exhaust matter to collectors.",
      verify: "Confirm exact shade in daylight and inspect blisters for cracks or lifting.",
      query: "1970 Hot Wheels Redline Sand Crab rose pink blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1970+Sand+Crab&yearsearch=n"
    },
    {
      id: "RL-07", name: "Paddy Wagon", year: "1970",
      series: "California Custom Miniatures",
      color: "Spectraflame dark blue, POLICE graphics", origin: "U.S.A.",
      qty: 1, low: 250, high: 450, rarity: "Uncommon carded",
      confidence: "High", image: "collection/paddy-wagon.jpeg",
      note: "Dark blue example with exposed chrome engine, police body and matching button.",
      verify: "Check roof/body paint, rear doors, graphics and all blister edges.",
      query: "1970 Hot Wheels Redline Paddy Wagon blue blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1970+Paddy+Wagon&yearsearch=n"
    },
    {
      id: "RL-08", name: "Custom Mustang", year: "1968",
      series: "Original Sweet 16", color: "Spectraflame gold / olive gold",
      origin: "U.S./Hong Kong variation — base required", qty: 1,
      low: 400, high: 750, rarity: "Sweet 16; strong carded demand",
      confidence: "High", image: "collection/custom-mustang.jpeg",
      note: "Gold fastback Sweet 16 example. Card has visible top-left creasing and edge wear, which is reflected in the working range.",
      verify: "Confirm base, interior color, tail paint, hood function and blister seal.",
      query: "1968 Hot Wheels Redline Custom Mustang gold original blister pack button",
      reference: "https://www.redlinepricing.com/sweet16.html"
    },
    {
      id: "RL-09", name: "Light My Firebird", year: "1970", series: "The Spoilers",
      color: "Spectraflame green with No. 1 graphics", origin: "U.S.A.",
      qty: 1, low: 250, high: 450,
      rarity: "Uncommon carded Spoilers issue", confidence: "High",
      image: "collection/light-my-firebird.jpeg",
      note: "Firebird-based Spoilers casting with blown engine, rear airfoil and No. 1 graphics. Matching button appears present.",
      verify: "Confirm engine, airfoil, decals, button match and blister originality.",
      query: "1970 Hot Wheels Redline Light My Firebird green Spoilers blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1970+Light+My+Firebird&yearsearch=n"
    },
    {
      id: "RL-10", name: "Classic Nomad", year: "1970",
      series: "California Custom Miniatures",
      color: "Spectraflame magenta / rose", origin: "U.S.A.", qty: 1,
      low: 300, high: 600, rarity: "Desirable shade; uncommon carded",
      confidence: "High", image: "collection/classic-nomad.jpeg",
      note: "Bright magenta Chevrolet Nomad with matching green-background button. The photo suggests attractive paint.",
      verify: "Confirm hood, engine, glass, base and full seal; inspect card corner wear.",
      query: "1970 Hot Wheels Redline Classic Nomad magenta rose blister pack button",
      reference: "https://redlinepriceguide.com/redline.php?car=1970+Classic+Nomad&yearsearch=n"
    },
    {
      id: "RL-11", name: "Hot Heap", year: "1968",
      series: "Original Sweet 16",
      color: "Spectraflame olive green, white interior",
      origin: "Likely Hong Kong; base required", qty: 1, low: 350, high: 700,
      rarity: "Sweet 16; white interior adds interest", confidence: "High",
      image: "collection/hot-heap.jpeg",
      note: "Complete-looking olive Hot Heap with white interior and exposed chrome motor. A second close-up supports the visual review.",
      verify: "Confirm the base, steering wheel/windshield parts, wheel type and blister seal.",
      query: "1968 Hot Wheels Redline Hot Heap olive green white interior blister pack",
      reference: "https://www.redlinepricing.com/sweet16.html"
    },
    {
      id: "RL-12", name: "Beatnik Bandit", year: "1968",
      series: "Original Sweet 16", color: "Spectraflame orange / copper",
      origin: "U.S./Hong Kong variation — base required", qty: 1,
      low: 400, high: 900, rarity: "Iconic Sweet 16 show car",
      confidence: "High", image: "collection/beatnik-bandit.jpeg",
      note: "Ed 'Big Daddy' Roth show-car casting with bubble top and matching button. Card wear is visible; bubble clarity looks promising.",
      verify: "Confirm canopy condition, steering stick, base origin, wheel type and seal.",
      query: "1968 Hot Wheels Redline Beatnik Bandit orange blister pack button",
      reference: "https://www.redlinepricing.com/sweet16.html"
    },
    {
      id: "RL-13", name: "Custom Volkswagen", year: "1968",
      series: "Original Sweet 16", color: "Spectraflame red",
      origin: "U.S./Hong Kong variation — base required", qty: 1,
      low: 400, high: 800, rarity: "High-interest Sweet 16 casting",
      confidence: "High", image: "collection/custom-volkswagen.jpeg",
      note: "Red Custom Volkswagen with exposed chrome engine and matching button. Card shows creases and top-edge wear.",
      verify: "Confirm sunroof/no-sunroof, painted headlights, base origin, engine and seal.",
      query: "1968 Hot Wheels Redline Custom Volkswagen red original blister pack button",
      reference: "https://www.redlinepricing.com/sweet16.html"
    },
    {
      id: "RL-14", name: "Pontiac GTO", year: "1967",
      series: "Original Sweet 16", color: "Spectraflame lime / antifreeze",
      origin: "U.S./Hong Kong variation — base required", qty: 1,
      low: 400, high: 800, rarity: "Strong color appeal",
      confidence: "High", image: "collection/pontiac-gto.png",
      note: "The right-hand car in the final photo shows Pontiac GTO profile and side gills; blister and button are partly obscured.",
      verify: "Provide an unobstructed full-card photo plus base, interior, hood and seal close-ups.",
      query: "1967 Hot Wheels Redline GTO antifreeze lime blister pack button",
      reference: "https://www.redlinepricing.com/sweet16.html"
    },
    {
      id: "RL-15", name: "Sweet 16 custom coupe — tentative", year: "1968",
      series: "Original Sweet 16", color: "Spectraflame antifreeze / lime",
      origin: "Base not visible", qty: 1, low: 350, high: 700,
      rarity: "Identity-dependent", confidence: "Needs verification",
      image: "collection/tentative-custom.png",
      note: "The left-hand car in the final photo is partly blocked. Body shape suggests a Custom T-Bird or adjacent Sweet 16 custom, but the photo is not enough for a defensible identification.",
      verify: "Send one full side view, the collector button and a sharp base photo before assigning a model-specific value.",
      query: "1968 Hot Wheels Redline Sweet 16 antifreeze blister pack button",
      reference: "https://www.redlinepricing.com/sweet16.html"
    }
  ];

  var money = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  });

  var grid = document.getElementById("catalog-grid");
  var search = document.getElementById("catalog-search");
  var confidence = document.getElementById("confidence-filter");
  var sort = document.getElementById("catalog-sort");
  var count = document.getElementById("catalog-count");
  var lightbox = document.getElementById("lightbox");

  function ebaySold(query) {
    return "https://www.ebay.com/sch/i.html?_nkw=" +
      encodeURIComponent(query) + "&LH_Complete=1&LH_Sold=1";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function confidenceClass(value) {
    return value.toLowerCase().replace(/\s+/g, "-");
  }

  function cardHtml(car) {
    var groupValue = car.qty > 1
      ? '<p class="group-value">Group: ' +
        money.format(car.low * car.qty) + "–" +
        money.format(car.high * car.qty) + "</p>"
      : "";
    var quantity = car.qty > 1 ? '<b class="qty">×' + car.qty + "</b>" : "";

    return [
      '<article class="car-card">',
      '<button class="image-button" type="button" data-car-id="' + car.id + '" aria-label="Enlarge photo of ' + escapeHtml(car.name) + '">',
      '<img src="' + car.image + '" alt="' + escapeHtml(car.name) + ' appraisal photo">',
      "<span>View photo</span></button>",
      '<div class="card-body"><div class="card-kicker"><span>' + car.id + "</span>",
      '<span class="confidence ' + confidenceClass(car.confidence) + '">' + car.confidence + "</span></div>",
      '<div class="name-row"><div><h3>' + escapeHtml(car.name) + "</h3><p>" +
        car.year + " · " + escapeHtml(car.series) + "</p></div>" + quantity + "</div>",
      '<div class="price-row"><span>Per-car range</span><strong>' +
        money.format(car.low) + "–" + money.format(car.high) + "</strong></div>",
      groupValue,
      "<dl><div><dt>Color</dt><dd>" + escapeHtml(car.color) + "</dd></div>",
      "<div><dt>Origin</dt><dd>" + escapeHtml(car.origin) + "</dd></div>",
      "<div><dt>Rarity</dt><dd>" + escapeHtml(car.rarity) + "</dd></div></dl>",
      '<p class="car-note">' + escapeHtml(car.note) + "</p>",
      "<details><summary>What to verify</summary><p>" + escapeHtml(car.verify) + "</p></details>",
      '<div class="card-actions"><a href="' + ebaySold(car.query) + '" target="_blank" rel="noreferrer">eBay sold comps <span>↗</span></a>',
      '<a href="' + car.reference + '" target="_blank" rel="noreferrer">Casting reference <span>↗</span></a></div>',
      "</div></article>"
    ].join("");
  }

  function render() {
    var term = search.value.trim().toLowerCase();
    var filtered = cars.filter(function (car) {
      var haystack = [
        car.name, car.year, car.series, car.color, car.origin, car.rarity
      ].join(" ").toLowerCase();
      return (!term || haystack.indexOf(term) !== -1) &&
        (confidence.value === "All" || car.confidence === confidence.value);
    });

    filtered.sort(function (a, b) {
      if (sort.value === "high") return b.high * b.qty - a.high * a.qty;
      if (sort.value === "year") return a.year.localeCompare(b.year);
      return a.id.localeCompare(b.id);
    });

    grid.innerHTML = filtered.map(cardHtml).join("");
    count.textContent = filtered.length + " appraisal groups shown";
  }

  function openLightbox(car) {
    document.getElementById("lightbox-image").src = car.image;
    document.getElementById("lightbox-image").alt = car.name + " enlarged";
    document.getElementById("lightbox-name").textContent = car.name;
    document.getElementById("lightbox-details").textContent =
      car.year + " · " + car.color;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  grid.addEventListener("click", function (event) {
    var button = event.target.closest("[data-car-id]");
    if (!button) return;
    var car = cars.find(function (item) {
      return item.id === button.getAttribute("data-car-id");
    });
    if (car) openLightbox(car);
  });

  search.addEventListener("input", render);
  confidence.addEventListener("change", render);
  sort.addEventListener("change", render);
  document.getElementById("print-report").addEventListener("click", function () {
    window.print();
  });
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  var totals = cars.reduce(function (sum, car) {
    sum.qty += car.qty;
    sum.low += car.low * car.qty;
    sum.high += car.high * car.qty;
    return sum;
  }, { qty: 0, low: 0, high: 0 });

  document.getElementById("total-range").textContent =
    money.format(totals.low) + "–" + money.format(totals.high);
  document.getElementById("total-cars").textContent = totals.qty + " cars";
  render();
})();
