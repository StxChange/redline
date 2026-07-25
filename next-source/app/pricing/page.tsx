"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type Package = {
  id: string;
  name: string;
  price: number;
  limit: string;
  description: string;
  features: string[];
  featured?: boolean;
  originalPrice?: number;
};

const packages: Package[] = [
  {
    id: "quick",
    name: "Quick Check",
    price: 39,
    limit: "Up to 3 cars",
    description: "A focused opinion before you buy, sell or insure a few key cars.",
    features: [
      "Casting and year identification",
      "Color and visible variation notes",
      "Per-car market range",
      "Links to comparable eBay sales",
    ],
  },
  {
    id: "collection",
    name: "Collection Evaluation",
    price: 149,
    limit: "Up to 15 cars",
    description: "A practical catalog and valuation for a growing collection.",
    features: [
      "Everything in Quick Check",
      "Rarity and country-of-origin notes",
      "Condition observations",
      "Collection total range",
      "Printable summary",
    ],
  },
  {
    id: "interactive",
    name: "Interactive Collection Report",
    price: 249,
    originalPrice: 299,
    limit: "Up to 25 cars",
    description: "The complete website-style report shown in our live example.",
    features: [
      "Searchable interactive catalog",
      "Individual photos and detailed notes",
      "Live sold-comparable searches",
      "Verification checklist",
      "Private shareable report link",
      "One follow-up revision",
    ],
    featured: true,
  },
  {
    id: "large",
    name: "Large Collection",
    price: 499,
    limit: "Up to 50 cars",
    description: "A structured appraisal for a substantial Redline collection.",
    features: [
      "Everything in Interactive Report",
      "Expanded collection inventory",
      "Priority review",
      "Collection-level observations",
      "One follow-up revision",
    ],
  },
];

const goals = [
  "Understand my collection value",
  "Prepare to sell",
  "Insurance documentation",
  "Estate or family records",
  "Confirm a purchase",
];

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState("interactive");
  const [submitted, setSubmitted] = useState(false);

  const selected = useMemo(
    () => packages.find((item) => item.id === selectedPackage) ?? packages[2],
    [selectedPackage],
  );

  function beginSignup(packageId: string) {
    setSelectedPackage(packageId);
    window.setTimeout(() => {
      document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      `Redline appraisal signup — ${selected.name}`,
    );
    const body = encodeURIComponent(
      [
        `I would like to purchase the ${selected.name} for $${selected.price}.`,
        "",
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Approximate number of cars: ${data.get("carCount")}`,
        `Main goal: ${data.get("goal")}`,
        `Photo or folder link: ${data.get("photoLink") || "Will send separately"}`,
        `Notes: ${data.get("notes") || "None"}`,
        "",
        "Please send me the PayPal checkout link and photo instructions.",
      ].join("\n"),
    );

    setSubmitted(true);
    window.location.href = `mailto:eric@stxchange.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="pricing-page">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="View the sample appraisal">
          <span className="brand-mark">RL</span>
          <span>
            <b>Redline Appraisals</b>
            <small>By RedlinePricing.com</small>
          </span>
        </Link>
        <nav>
          <Link href="/#catalog">Sample report</Link>
          <a href="#packages">Pricing</a>
          <a href="#process">How it works</a>
          <a className="nav-cta" href="#signup">
            Get started
          </a>
        </nav>
      </header>

      <section className="sales-hero">
        <div>
          <p className="eyebrow">KNOW WHAT YOUR REDLINES ARE WORTH</p>
          <h1>Your collection, identified and valued car by car.</h1>
          <p className="sales-lede">
            Turn your photos into a clear collector report with names, years,
            colors, rarity notes, price ranges and links to similar sold cars.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#packages">
              View packages <span>↓</span>
            </a>
            <Link className="secondary-action" href="/#catalog">
              Explore a real example <span>↗</span>
            </Link>
          </div>
          <div className="trust-row" aria-label="Service highlights">
            <span>Photo-led review</span>
            <span>Current market evidence</span>
            <span>Private collector report</span>
          </div>
        </div>

        <Link className="sample-promo" href="/#catalog">
          <figure>
            <img
              src="/collection/overview.jpeg"
              alt="Carded vintage Hot Wheels Redline collection used in a sample appraisal"
            />
          </figure>
          <div className="sample-promo-copy">
            <p>LIVE SAMPLE REPORT</p>
            <strong>22 cars · 15 appraisal groups</strong>
            <span>
              See the photographs, pricing ranges, rarity notes and sold-market
              links a collector receives.
            </span>
            <b>Open the complete example →</b>
          </div>
        </Link>
      </section>

      <section className="proof-strip" aria-label="Sample report contents">
        <article>
          <b>Identify</b>
          <span>Model, year, series, color and origin</span>
        </article>
        <article>
          <b>Appraise</b>
          <span>Per-car and total fair-market ranges</span>
        </article>
        <article>
          <b>Compare</b>
          <span>Direct links to current eBay sold searches</span>
        </article>
        <article>
          <b>Verify</b>
          <span>Condition and authenticity photo checklist</span>
        </article>
      </section>

      <section className="package-section" id="packages">
        <div className="section-heading">
          <div>
            <p className="eyebrow">STRAIGHTFORWARD PRICING</p>
            <h2>Choose the depth that fits your collection.</h2>
          </div>
          <p>
            Flat pricing keeps the evaluation independent from the value of
            your cars. Every package includes a written market range.
          </p>
        </div>

        <div className="package-grid">
          {packages.map((item) => (
            <article
              className={`package-card${item.featured ? " featured" : ""}`}
              key={item.id}
            >
              {item.featured && <span className="popular">Best example match</span>}
              <p className="package-limit">{item.limit}</p>
              <h3>{item.name}</h3>
              <p className="package-description">{item.description}</p>
              <div className="package-price">
                {item.originalPrice && <del>${item.originalPrice}</del>}
                <strong>${item.price}</strong>
                <span>one-time</span>
              </div>
              <ul>
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button type="button" onClick={() => beginSignup(item.id)}>
                Choose {item.name} <span>→</span>
              </button>
            </article>
          ))}
        </div>

        <div className="add-ons">
          <span>
            <b>Additional cars</b> $10 each
          </span>
          <span>
            <b>Rush service</b> +$99
          </span>
          <span>
            <b>Annual market refresh</b> $79
          </span>
        </div>
      </section>

      <section className="process-section" id="process">
        <div>
          <p className="eyebrow">FROM PHOTOS TO REPORT</p>
          <h2>A simple collector-first process.</h2>
          <p>
            You keep the cars in your possession. The first review is completed
            from your photos, and we tell you exactly when a closer image is
            needed.
          </p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <b>Choose a package</b>
              <p>Tell us how many cars you have and what you need the report for.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <b>Pay securely with PayPal</b>
              <p>We confirm your order and send the photo checklist.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <b>Share your photographs</b>
              <p>Front, back, blister edges, base and important details.</p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <b>Receive your appraisal</b>
              <p>Get the inventory, value ranges, evidence links and next steps.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="signup-section" id="signup">
        <div className="signup-copy">
          <p className="eyebrow">START YOUR APPRAISAL</p>
          <h2>Tell us about your collection.</h2>
          <p>
            We will confirm the scope and email your secure PayPal checkout link
            with the photo instructions.
          </p>
          <div className="selected-order">
            <span>Selected package</span>
            <b>{selected.name}</b>
            <strong>${selected.price}</strong>
            <small>{selected.limit}</small>
          </div>
        </div>

        <form className="signup-form" onSubmit={submitSignup}>
          <label>
            Package
            <select
              name="package"
              value={selectedPackage}
              onChange={(event) => setSelectedPackage(event.target.value)}
            >
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — ${item.price}
                </option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Approximate number of cars
              <input name="carCount" type="number" min="1" required />
            </label>
            <label>
              Main goal
              <select name="goal" defaultValue={goals[0]}>
                {goals.map((goal) => (
                  <option key={goal}>{goal}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Photo or shared-folder link <span>(optional)</span>
            <input
              name="photoLink"
              type="url"
              placeholder="Google Drive, Dropbox or another share link"
            />
          </label>
          <label>
            Anything else we should know? <span>(optional)</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Carded or loose cars, deadlines, special concerns…"
            />
          </label>
          <label className="consent">
            <input name="consent" type="checkbox" required />
            <span>
              I understand this is a collector market evaluation, not a
              certified appraisal for insurance, estate, tax or legal use.
            </span>
          </label>
          <button className="paypal-button" type="submit">
            <span className="paypal-wordmark">PayPal</span>
            Request secure checkout · ${selected.price}
          </button>
          <small className="form-note">
            This opens a prepared email to RedlinePricing.com. Your payment link
            and upload instructions will be sent after the collection size is
            confirmed.
          </small>
          {submitted && (
            <p className="submitted-message" role="status">
              Your email is ready. Send it to finish your signup.
            </p>
          )}
        </form>
      </section>

      <section className="faq-section">
        <div>
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2>Before you send the cars—or rather, don’t.</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Do I mail you my cars?</summary>
            <p>
              No. The service starts with photographs. Keep the collection
              safely in your possession.
            </p>
          </details>
          <details>
            <summary>Are the prices guaranteed sale prices?</summary>
            <p>
              No. Ranges are informed opinions based on visible condition and
              comparable market activity. The final sale price depends on
              authenticity, condition, venue, timing and buyer demand.
            </p>
          </details>
          <details>
            <summary>What if a car cannot be identified from my photo?</summary>
            <p>
              The report will mark the uncertainty and request a specific
              follow-up view instead of forcing an identification.
            </p>
          </details>
          <details>
            <summary>Can you help me sell the collection?</summary>
            <p>
              Selling help can be discussed separately after the independent
              evaluation. Any sales arrangement is separate from the appraisal
              price.
            </p>
          </details>
        </div>
      </section>

      <footer>
        <p>
          © 2026 RedlinePricing.com · Collector market evaluations
        </p>
        <p>
          <Link href="/#catalog">Sample report</Link> ·{" "}
          <a href="mailto:eric@stxchange.com">eric@stxchange.com</a>
        </p>
      </footer>
    </main>
  );
}
