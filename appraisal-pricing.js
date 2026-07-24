(function () {
  "use strict";

  var config = window.REDLINE_APPRAISAL_CONFIG || {};
  var email = config.contactEmail || "eric@stxchange.com";
  var paypalLinks = config.paypalLinks || {};

  var packages = {
    quick: { name: "Quick Check", price: 39, limit: "Up to 3 cars" },
    collection: { name: "Collection Evaluation", price: 149, limit: "Up to 15 cars" },
    interactive: {
      name: "Interactive Collection Report",
      price: 249,
      limit: "Up to 25 cars"
    },
    large: { name: "Large Collection", price: 499, limit: "Up to 50 cars" }
  };

  var form = document.getElementById("appraisal-form");
  var packageSelect = document.getElementById("package-select");
  var selectedName = document.getElementById("selected-name");
  var selectedPrice = document.getElementById("selected-price");
  var selectedLimit = document.getElementById("selected-limit");
  var paypalButton = document.getElementById("paypal-button");
  var paypalLabel = document.getElementById("paypal-label");
  var checkoutNote = document.getElementById("checkout-note");

  if (config.sampleReportUrl) {
    document.querySelectorAll("[data-sample-link]").forEach(function (link) {
      link.href = config.sampleReportUrl;
    });
  }

  function selectedPackage() {
    return packages[packageSelect.value] || packages.interactive;
  }

  function emailUrl(subject, body) {
    return "mailto:" + encodeURIComponent(email) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function checkoutRequestUrl(item) {
    return emailUrl(
      "PayPal checkout request — " + item.name,
      "Please send me the PayPal checkout link for the " +
        item.name + " ($" + item.price + ")."
    );
  }

  function updatePackage() {
    var item = selectedPackage();
    var directLink = paypalLinks[packageSelect.value];

    selectedName.textContent = item.name;
    selectedPrice.textContent = "$" + item.price;
    selectedLimit.textContent = item.limit;

    if (directLink) {
      paypalButton.href = directLink;
      paypalLabel.textContent = "2. Pay securely · $" + item.price;
      checkoutNote.textContent =
        "Payment opens on PayPal. Email your collection details before paying.";
    } else {
      paypalButton.href = checkoutRequestUrl(item);
      paypalLabel.textContent = "2. Request secure checkout · $" + item.price;
      checkoutNote.textContent =
        "Add your package Payment Links in appraisal-config.js to enable direct checkout.";
    }
  }

  document.querySelectorAll("[data-package]").forEach(function (button) {
    button.addEventListener("click", function () {
      packageSelect.value = button.getAttribute("data-package");
      updatePackage();
      document.getElementById("signup").scrollIntoView({ behavior: "smooth" });
    });
  });

  packageSelect.addEventListener("change", updatePackage);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    var data = new FormData(form);
    var item = selectedPackage();
    var body = [
      "I would like to purchase the " + item.name + " for $" + item.price + ".",
      "",
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Approximate number of cars: " + data.get("carCount"),
      "Main goal: " + data.get("goal"),
      "Photo or folder link: " + (data.get("photoLink") || "Will send separately"),
      "Notes: " + (data.get("notes") || "None")
    ].join("\n");

    window.location.href = emailUrl("Redline appraisal signup — " + item.name, body);
  });

  updatePackage();
})();
