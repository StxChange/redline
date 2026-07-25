"use client";

import { useMemo, useState } from "react";

type Confidence = "High" | "Medium" | "Needs verification";

type Car = {
  id: string;
  name: string;
  year: string;
  series: string;
  color: string;
  origin: string;
  qty: number;
  low: number;
  high: number;
  rarity: string;
  confidence: Confidence;
  image: string;
  note: string;
  verify: string;
  query: string;
  reference: string;
};

const cars: Car[] = [
  {
    id: "RL-01",
    name: "Turbofire",
    year: "1969",
    series: "California Custom Miniatures",
    color: "Spectraflame olive / green",
    origin: "U.S.A. only",
    qty: 2,
    low: 200,
    high: 400,
    rarity: "Common color; scarce on intact card",
    confidence: "High",
    image: "/collection/turbofire.jpeg",
    note: "Both examples retain their matching Turbofire buttons. Card and blister wear differ, so value each separately after seal inspection.",
    verify: "Photograph both card backs, blister edges, bases and any cracks.",
    query: "1969 Hot Wheels Redline Turbofire olive green blister pack button",
    reference: "https://onlineredlineguide.com/69/69_turbofire/69_turbofire.html",
  },
  {
    id: "RL-02",
    name: "Lola GT70",
    year: "1969",
    series: "Grand Prix Series",
    color: "Spectraflame red",
    origin: "U.S./Hong Kong variation — base required",
    qty: 1,
    low: 225,
    high: 350,
    rarity: "Popular Grand Prix casting",
    confidence: "Medium",
    image: "/collection/lola-gt70.png",
    note: "Photo identification is consistent with a red Lola GT70 on the green Grand Prix card with matching button.",
    verify: "Confirm the button text, base country and that the blister is factory sealed.",
    query: "1969 Hot Wheels Redline Lola GT70 red blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1969+Lola+GT+70&yearsearch=n",
  },
  {
    id: "RL-03",
    name: "Chaparral 2G",
    year: "1969",
    series: "Grand Prix Series",
    color: "White enamel with blue trim",
    origin: "Likely U.S.A.; base required",
    qty: 2,
    low: 350,
    high: 650,
    rarity: "Common color; complete wing/card is premium",
    confidence: "High",
    image: "/collection/chaparral.png",
    note: "Both cars appear to retain the signature tall rear wing and matching buttons. Original wings are a major value driver.",
    verify: "Confirm wings are original, inspect decal sheet/card back and photograph each blister seal.",
    query: "1969 Hot Wheels Redline Chaparral 2G white blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1969+Chaparral+2G&yearsearch=n",
  },
  {
    id: "RL-04",
    name: "Fire Chief Cruiser",
    year: "1970",
    series: "California Custom Miniatures",
    color: "Spectraflame red / copper, CHIEF graphics",
    origin: "U.S.A.",
    qty: 4,
    low: 225,
    high: 350,
    rarity: "Uncommon as a carded matched group",
    confidence: "High",
    image: "/collection/fire-chief.png",
    note: "Four similar examples create a useful mini-run. Roof beacon, side graphics and matching button are visible.",
    verify: "Record card/blister condition separately; check beacon and graphics on every car.",
    query: "Hot Wheels Redline Fire Chief Cruiser MOC blister pack button",
    reference: "https://www.ebay.com/itm/398103320075",
  },
  {
    id: "RL-05",
    name: "Indy Eagle",
    year: "1969",
    series: "Grand Prix Series",
    color: "Spectraflame green",
    origin: "Hong Kong only",
    qty: 2,
    low: 250,
    high: 425,
    rarity: "Common color; carded examples scarce",
    confidence: "High",
    image: "/collection/indy-eagle.jpeg",
    note: "Both have matching Indy Eagle buttons. Production examples have blue windscreens; interior color can change value.",
    verify: "Photograph windscreens, interiors, decal sheets, bases and complete blister seals.",
    query: "1969 Hot Wheels Redline Indy Eagle green blister pack button",
    reference: "https://onlineredlineguide.com/69/69_indy_eagle/69_indy_eagle.html",
  },
  {
    id: "RL-06",
    name: "Sand Crab",
    year: "1970",
    series: "California Custom Miniatures",
    color: "Spectraflame rose / hot pink",
    origin: "U.S.A.",
    qty: 2,
    low: 250,
    high: 450,
    rarity: "Desirable color; condition sensitive",
    confidence: "High",
    image: "/collection/sand-crab.jpeg",
    note: "Two vivid rose examples with matching buttons. The shade and original chrome engine/exhaust matter to collectors.",
    verify: "Confirm exact shade in daylight and inspect blisters for cracks or lifting.",
    query: "1970 Hot Wheels Redline Sand Crab rose pink blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1970+Sand+Crab&yearsearch=n",
  },
  {
    id: "RL-07",
    name: "Paddy Wagon",
    year: "1970",
    series: "California Custom Miniatures",
    color: "Spectraflame dark blue, POLICE graphics",
    origin: "U.S.A.",
    qty: 1,
    low: 250,
    high: 450,
    rarity: "Uncommon carded",
    confidence: "High",
    image: "/collection/paddy-wagon.jpeg",
    note: "Dark blue example with exposed chrome engine, police body and matching button.",
    verify: "Check roof/body paint, rear doors, graphics and all blister edges.",
    query: "1970 Hot Wheels Redline Paddy Wagon blue blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1970+Paddy+Wagon&yearsearch=n",
  },
  {
    id: "RL-08",
    name: "Custom Mustang",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame gold / olive gold",
    origin: "U.S./Hong Kong variation — base required",
    qty: 1,
    low: 400,
    high: 750,
    rarity: "Sweet 16; strong carded demand",
    confidence: "High",
    image: "/collection/custom-mustang.jpeg",
    note: "Gold fastback Sweet 16 example. Card has visible top-left creasing and edge wear, which is reflected in the working range.",
    verify: "Confirm base, interior color, tail paint, hood function and blister seal.",
    query: "1968 Hot Wheels Redline Custom Mustang gold original blister pack button",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
  {
    id: "RL-09",
    name: "Light My Firebird",
    year: "1970",
    series: "The Spoilers",
    color: "Spectraflame green with No. 1 graphics",
    origin: "U.S.A.",
    qty: 1,
    low: 250,
    high: 450,
    rarity: "Uncommon carded Spoilers issue",
    confidence: "High",
    image: "/collection/light-my-firebird.jpeg",
    note: "Firebird-based Spoilers casting with blown engine, rear airfoil and No. 1 graphics. Matching button appears present.",
    verify: "Confirm engine, airfoil, decals, button match and blister originality.",
    query: "1970 Hot Wheels Redline Light My Firebird green Spoilers blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1970+Light+My+Firebird&yearsearch=n",
  },
  {
    id: "RL-10",
    name: "Classic Nomad",
    year: "1970",
    series: "California Custom Miniatures",
    color: "Spectraflame magenta / rose",
    origin: "U.S.A.",
    qty: 1,
    low: 300,
    high: 600,
    rarity: "Desirable shade; uncommon carded",
    confidence: "High",
    image: "/collection/classic-nomad.jpeg",
    note: "Bright magenta Chevrolet Nomad with matching green-background button. The photo suggests attractive paint.",
    verify: "Confirm hood, engine, glass, base and full seal; inspect card corner wear.",
    query: "1970 Hot Wheels Redline Classic Nomad magenta rose blister pack button",
    reference: "https://redlinepriceguide.com/redline.php?car=1970+Classic+Nomad&yearsearch=n",
  },
  {
    id: "RL-11",
    name: "Hot Heap",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame olive green, white interior",
    origin: "Likely Hong Kong; base required",
    qty: 1,
    low: 350,
    high: 700,
    rarity: "Sweet 16; white interior adds interest",
    confidence: "High",
    image: "/collection/hot-heap.jpeg",
    note: "Complete-looking olive Hot Heap with white interior and exposed chrome motor. A second close-up supports the visual review.",
    verify: "Confirm the base, steering wheel/windshield parts, wheel type and blister seal.",
    query: "1968 Hot Wheels Redline Hot Heap olive green white interior blister pack",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
  {
    id: "RL-12",
    name: "Beatnik Bandit",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame orange / copper",
    origin: "U.S./Hong Kong variation — base required",
    qty: 1,
    low: 400,
    high: 900,
    rarity: "Iconic Sweet 16 show car",
    confidence: "High",
    image: "/collection/beatnik-bandit.jpeg",
    note: "Ed 'Big Daddy' Roth show-car casting with bubble top and matching button. Card wear is visible; bubble clarity looks promising.",
    verify: "Confirm canopy condition, steering stick, base origin, wheel type and seal.",
    query: "1968 Hot Wheels Redline Beatnik Bandit orange blister pack button",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
  {
    id: "RL-13",
    name: "Custom Volkswagen",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame red",
    origin: "U.S./Hong Kong variation — base required",
    qty: 1,
    low: 400,
    high: 800,
    rarity: "High-interest Sweet 16 casting",
    confidence: "High",
    image: "/collection/custom-volkswagen.jpeg",
    note: "Red Custom Volkswagen with exposed chrome engine and matching button. Card shows creases and top-edge wear.",
    verify: "Confirm sunroof/no-sunroof, painted headlights, base origin, engine and seal.",
    query: "1968 Hot Wheels Redline Custom Volkswagen red original blister pack button",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
  {
    id: "RL-14",
    name: "Custom Corvette",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame lime / antifreeze",
    origin: "U.S./Hong Kong variation — base required",
    qty: 1,
    low: 400,
    high: 800,
    rarity: "Sweet 16; strong color appeal",
    confidence: "High",
    image: "/collection/custom-corvette.png",
    note: "The right-hand car in the final photo shows the C3 Corvette profile and side gills; blister and button are partly obscured.",
    verify: "Provide an unobstructed full-card photo plus base, interior, hood and seal close-ups.",
    query: "1968 Hot Wheels Redline Custom Corvette antifreeze lime blister pack button",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
  {
    id: "RL-15",
    name: "Sweet 16 custom coupe — tentative",
    year: "1968",
    series: "Original Sweet 16",
    color: "Spectraflame antifreeze / lime",
    origin: "Base not visible",
    qty: 1,
    low: 350,
    high: 700,
    rarity: "Identity-dependent",
    confidence: "Needs verification",
    image: "/collection/tentative-custom.png",
    note: "The left-hand car in the final photo is partly blocked. Body shape suggests a Custom T-Bird or adjacent Sweet 16 custom, but the photo is not enough for a defensible identification.",
    verify: "Send one full side view, the collector button and a sharp base photo before assigning a model-specific value.",
    query: "1968 Hot Wheels Redline Sweet 16 antifreeze blister pack button",
    reference: "https://www.redlinepricing.com/sweet16.html",
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ebaySold(query: string) {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Complete=1&LH_Sold=1`;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [confidence, setConfidence] = useState("All");
  const [sort, setSort] = useState("id");
  const [selected, setSelected] = useState<Car | null>(null);

  const totals = useMemo(
    () =>
      cars.reduce(
        (sum, car) => ({
          qty: sum.qty + car.qty,
          low: sum.low + car.low * car.qty,
          high: sum.high + car.high * car.qty,
        }),
        { qty: 0, low: 0, high: 0 },
      ),
    [],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = cars.filter((car) => {
      const matches =
        !term ||
        [car.name, car.year, car.series, car.color, car.origin, car.rarity]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matches && (confidence === "All" || car.confidence === confidence);
    });
    return [...result].sort((a, b) => {
      if (sort === "high") return b.high * b.qty - a.high * a.qty;
      if (sort === "year") return a.year.localeCompare(b.year);
      return a.id.localeCompare(b.id);
    });
  }, [search, confidence, sort]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Redline appraisal home">
          <span className="brand-mark">RL</span>
          <span>
            <b>Private Collection</b>
            <small>Photo appraisal · July 2026</small>
          </span>
        </a>
        <nav>
          <a href="/pricing">Get an appraisal</a>
          <a href="#catalog">Catalog</a>
          <a href="#method">Method</a>
          <button type="button" onClick={() => window.print()}>
            Print report
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">PRIVATE WORKING APPRAISAL · USD</p>
          <h1>A carded Redline collection with real collector weight.</h1>
          <p className="hero-lede">
            A photo-led inventory of original-era Hot Wheels Redlines, with
            conservative fair-market ranges and live links to comparable eBay
            sold results.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#catalog">
              Review all cars <span>↓</span>
            </a>
            <a className="secondary-action" href="/pricing">
              Get your collection appraised <span>→</span>
            </a>
          </div>
          <p className="scope-note">
            Photo-only opinion, not an insurance certificate. Range assumes
            authentic cars, matching buttons and original sealed blisters.
          </p>
        </div>
        <figure className="hero-image">
          <img
            src="/collection/overview.jpeg"
            alt="Overview of the carded Hot Wheels Redline collection"
          />
          <figcaption>
            Group photo appears to show 23 cars; 22 are represented in the
            supplied close-ups.
          </figcaption>
        </figure>
      </section>

      <section className="summary" aria-label="Collection summary">
        <article>
          <span>Working fair-market range</span>
          <strong>
            {money.format(totals.low)}–{money.format(totals.high)}
          </strong>
          <small>22 close-up cars; one group-photo car excluded</small>
        </article>
        <article>
          <span>Cataloged</span>
          <strong>{totals.qty} cars</strong>
          <small>{cars.length} appraisal groups</small>
        </article>
        <article>
          <span>Highest leverage next step</span>
          <strong>Seal + base photos</strong>
          <small>Could materially tighten every range</small>
        </article>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CATALOG</p>
            <h2>Each car, priced with its uncertainty visible.</h2>
          </div>
          <p>
            “Sold comps” opens a live eBay completed-and-sold search so the
            market evidence stays current.
          </p>
        </div>

        <div className="filters">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, color, year or series"
              aria-label="Search the appraisal catalog"
            />
          </label>
          <label>
            <span className="sr-only">Filter by confidence</span>
            <select
              value={confidence}
              onChange={(event) => setConfidence(event.target.value)}
              aria-label="Filter by confidence"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Needs verification</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort catalog</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort catalog"
            >
              <option value="id">Sort: catalog order</option>
              <option value="high">Sort: highest value</option>
              <option value="year">Sort: year</option>
            </select>
          </label>
        </div>

        <div className="catalog-meta">
          <span>{filtered.length} appraisal groups shown</span>
          <span className="legend">
            <i className="dot high" /> High
            <i className="dot medium" /> Medium
            <i className="dot verify" /> Verify
          </span>
        </div>

        <div className="catalog-grid">
          {filtered.map((car) => (
            <article className="car-card" key={car.id}>
              <button
                className="image-button"
                type="button"
                onClick={() => setSelected(car)}
                aria-label={`Enlarge photo of ${car.name}`}
              >
                <img src={car.image} alt={`${car.name} appraisal photo`} />
                <span>View photo</span>
              </button>
              <div className="card-body">
                <div className="card-kicker">
                  <span>{car.id}</span>
                  <span className={`confidence ${car.confidence.toLowerCase().replaceAll(" ", "-")}`}>
                    {car.confidence}
                  </span>
                </div>
                <div className="name-row">
                  <div>
                    <h3>{car.name}</h3>
                    <p>
                      {car.year} · {car.series}
                    </p>
                  </div>
                  {car.qty > 1 && <b className="qty">×{car.qty}</b>}
                </div>
                <div className="price-row">
                  <span>Per-car range</span>
                  <strong>
                    {money.format(car.low)}–{money.format(car.high)}
                  </strong>
                </div>
                {car.qty > 1 && (
                  <p className="group-value">
                    Group: {money.format(car.low * car.qty)}–
                    {money.format(car.high * car.qty)}
                  </p>
                )}
                <dl>
                  <div>
                    <dt>Color</dt>
                    <dd>{car.color}</dd>
                  </div>
                  <div>
                    <dt>Origin</dt>
                    <dd>{car.origin}</dd>
                  </div>
                  <div>
                    <dt>Rarity</dt>
                    <dd>{car.rarity}</dd>
                  </div>
                </dl>
                <p className="car-note">{car.note}</p>
                <details>
                  <summary>What to verify</summary>
                  <p>{car.verify}</p>
                </details>
                <div className="card-actions">
                  <a
                    href={ebaySold(car.query)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    eBay sold comps <span>↗</span>
                  </a>
                  <a href={car.reference} target="_blank" rel="noreferrer">
                    Casting reference <span>↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="method">
        <div>
          <p className="eyebrow">HOW TO TIGHTEN THE RANGE</p>
          <h2>Five photos can turn this into a defensible inventory.</h2>
        </div>
        <ol>
          <li>
            <b>Full front and back</b>
            <span>One straight-on image of each card, including corners.</span>
          </li>
          <li>
            <b>Every blister edge</b>
            <span>Close-ups that reveal lifting, glue, cracks or repairs.</span>
          </li>
          <li>
            <b>Base stamp</b>
            <span>Country, casting marks, rivets and matching patina.</span>
          </li>
          <li>
            <b>Car details</b>
            <span>Interior, glass, wheels, engines, wings and small parts.</span>
          </li>
          <li>
            <b>Provenance</b>
            <span>Purchase history, prior owner and any grading records.</span>
          </li>
        </ol>
        <aside>
          <b>Important valuation rule</b>
          <p>
            A reseal, reproduction part or mismatched button can move a car
            from the carded tier toward loose-car value. Do not clean, polish
            or open anything before authentication.
          </p>
        </aside>
      </section>

      <footer>
        <p>
          Prepared as a private collecting aid · Market checked July 24, 2026
        </p>
        <p>
          <a href="/pricing">Appraisal pricing</a> · Not affiliated with Mattel
          or eBay
        </p>
      </footer>

      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} enlarged photo`}
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close enlarged photo"
          >
            ×
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={selected.image} alt={`${selected.name} enlarged`} />
            <figcaption>
              <b>{selected.name}</b>
              <span>
                {selected.year} · {selected.color}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
