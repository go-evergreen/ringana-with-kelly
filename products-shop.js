(function () {
  var buttons = document.querySelectorAll("[data-shop-filter]");
  var cards = document.querySelectorAll(".shop-card");
  var count = document.getElementById("shopCount");
  if (!buttons.length || !cards.length) return;

  function apply(filter) {
    var n = 0;
    cards.forEach(function (card) {
      var show = filter === "all" || card.getAttribute("data-cat") === filter;
      card.hidden = !show;
      if (!show) card.classList.remove("is-lit");
      if (show) n += 1;
    });
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-shop-filter") === filter;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (count) count.textContent = n + (n === 1 ? " product" : " products");
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-shop-filter"));
    });
  });
})();

(function () {
  var sets = {
    boosters: [
      { slug: "fresh-glow-booster", img: "packs/fresh-glow-booster.png?v=1", name: "glow booster", line: "Glow with the flow.", price: "$63.70", soon: false },
      { slug: "fresh-lifting-booster", img: "packs/fresh-lifting-booster.png?v=1", name: "lifting booster", line: "Your secret to youthful skin.", price: "$87.30", soon: false },
      { slug: "fresh-clarifying-booster", img: "packs/fresh-clarifying-booster.png?v=1", name: "clarifying booster", line: "Your skin? Naturally clear.", price: "$63.70", soon: false }
    ],
    creams: [
      { slug: "fresh-cream-light", img: "packs/fresh-cream-light.png?v=5", name: "cream light", line: "Your new anti-shine strategy.", price: "$65.20", soon: false },
      { slug: "fresh-cream-medium", img: "packs/fresh-cream-medium.png?v=5", name: "cream medium", line: "Zen mode for your skin.", price: "$71.70", soon: false },
      { slug: "fresh-cream-rich", img: "packs/fresh-cream-rich.png?v=5", name: "cream rich", line: "The crème de la crème for dry skin.", price: "$79.50", soon: false }
    ],
    cleansers: [
      { slug: "fresh-cleanser", img: "packs/fresh-cleanser.png?v=5", name: "cleanser", line: "Milk on. Everyday off.", price: "$35.50", soon: false },
      { slug: "fresh-cleansing-water", img: "packs/fresh-cleansing-water.png?v=5", name: "cleansing water", line: "Deeply clean.", price: "$35.50", soon: false }
    ],
    eyes: [
      { slug: "fresh-eye-serum", img: "packs/fresh-eye-serum.png?v=5", name: "eye serum", line: "For the look of rested eyes.", price: "$63.40", soon: false },
      { slug: "fresh-eye-cream", img: "packs/fresh-eye-cream.png?v=5", name: "eye cream", line: "Eye care for today.", price: "$69.80", soon: false }
    ],
    shampoos: [
      { slug: "fresh-repair-shampoo", img: "packs/fresh-repair-shampoo.png?v=5", name: "repair shampoo", line: "Soft hair, for days.", price: "$27.60", soon: false },
      { slug: "fresh-volume-shampoo", img: "packs/fresh-volume-shampoo.png?v=2", name: "volume shampoo", line: "The volumizer.", price: "$27.60", soon: false }
    ],
    toners: [
      { slug: "fresh-toner-calm", img: "packs/fresh-toner-calm.png?v=5", name: "toner calm", line: "The fine-mist reset.", price: "$34.80", soon: false },
      { slug: "fresh-toner-pure", img: "packs/fresh-toner-pure.png?v=5", name: "toner pure", line: "Clarify your skin.", price: "$34.80", soon: false }
    ],
    lips: [
      { slug: "fresh-lip-balm-classic", img: "packs/fresh-lip-balm-classic.png?v=5", name: "lip balm classic", line: "Melts on like butter.", price: "$18.50", soon: false },
      { slug: "fresh-tinted-balm-rosewood", img: "packs/fresh-tinted-balm-lip-cheek-rosewood.png?v=1", name: "tinted lip balm", line: "Lip balm and blush.", price: "$19.50", soon: false }
    ],
    milks: [
      { slug: "fresh-body-milk-light", img: "packs/fresh-body-milk-light.png?v=5", name: "body milk light", line: "Absorbs in seconds.", price: "$49.40", soon: false },
      { slug: "fresh-body-milk-rich", img: "packs/fresh-body-milk-rich.png?v=5", name: "body milk rich", line: "Wrap your skin in richness.", price: "$50.80", soon: true }
    ]
  };

  document.querySelectorAll("[data-switch]").forEach(function (card) {
    var slides = sets[card.getAttribute("data-switch")];
    if (!slides) return;
    var i = 0;
    var img = card.querySelector("img");
    var shot = card.querySelector(".switch-shot");
    var name = card.querySelector(".switch-name");
    var line = card.querySelector(".switch-line");
    var price = card.querySelector(".switch-price");
    var go = card.querySelector(".switch-go");
    var soon = card.querySelector(".shop-soon");
    var fav = card.querySelector(".shop-fav");
    var thoughts = card.querySelector(".shop-thoughts");
    function show(n) {
      i = (n + slides.length) % slides.length;
      var s = slides[i];
      var url = "https://amorose.ringana.us/produkt/" + s.slug + "/?lang=en";
      img.src = s.img;
      img.alt = s.name;
      if (shot) { shot.href = url; shot.removeAttribute("data-open-connect"); shot.target = "_blank"; shot.rel = "noopener"; }
      if (name) name.textContent = s.name;
      if (line) line.textContent = s.line;
      if (price) price.textContent = s.price || "";
      if (go) { go.href = url; go.removeAttribute("data-open-connect"); go.target = "_blank"; go.rel = "noopener"; go.textContent = "Shop this"; }
      var hit = card.querySelector(".shop-hit");
      if (hit) {
        hit.href = url;
        hit.removeAttribute("data-open-connect");
        hit.target = "_blank";
        hit.rel = "noopener";
        hit.setAttribute("aria-label", s.name);
      }
      if (soon) soon.hidden = !s.soon;
      if (fav) fav.hidden = !s.fav;
      if (thoughts) {
        var verdict = thoughts.querySelector(".verdict");
        var note = thoughts.querySelector(".note");
        if (s.thoughts && verdict && note) {
          thoughts.hidden = false;
          verdict.textContent = s.thoughts.verdict;
          note.textContent = s.thoughts.note;
        } else {
          thoughts.open = false;
          thoughts.hidden = true;
        }
      }
    }
    card.querySelector(".switch-prev").addEventListener("click", function () { show(i - 1); });
    card.querySelector(".switch-next").addEventListener("click", function () { show(i + 1); });
  });
})();

(function () {
  document.querySelectorAll(".shop-card").forEach(function (card) {
    var go = card.querySelector(".shop-go");
    if (!go || !go.href) return;
    var hit = document.createElement("a");
    hit.className = "shop-hit";
    hit.href = go.href;
    hit.target = "_blank";
    hit.rel = "noopener";
    var name = card.querySelector("h3");
    hit.setAttribute("aria-label", name ? name.textContent.replace(/\s+/g, " ").trim() : "Shop this");
    card.appendChild(hit);
  });
})();

(function () {
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)");
  if (!coarse.matches) return;
  var grid = document.querySelector(".shop-grid");
  if (!grid) return;

  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".shop-card");
    if (!card || !grid.contains(card)) return;
    if (e.target.closest(".switch-arrow, .shop-thoughts, .shop-go")) return;
    if (e.target.closest("a")) e.preventDefault();
    var on = card.classList.contains("is-lit");
    grid.querySelectorAll(".shop-card.is-lit").forEach(function (other) {
      other.classList.remove("is-lit");
    });
    if (!on) card.classList.add("is-lit");
  });
})();
