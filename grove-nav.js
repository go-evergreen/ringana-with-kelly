(function () {
  var drop = document.querySelector(".nav-drop");
  if (drop) {
    var btn = drop.querySelector(".nav-plan");
    function setOpen(open) {
      drop.classList.toggle("is-open", open);
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!drop.classList.contains("is-open"));
      });
    }
    document.addEventListener("click", function (e) {
      if (!drop.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".carousel-slide");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    if (!track || slides.length < 2 || root.dataset.bound) return;
    root.dataset.bound = "1";
    var n = slides.length;
    var i = 0;
    function go(to) {
      i = (to + n) % n;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      slides.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
    }
    if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); go(i - 1); });
    if (next) next.addEventListener("click", function (e) { e.stopPropagation(); go(i + 1); });
  });

  document.querySelectorAll(".flip").forEach(function (card) {
    var face = card.querySelector(".flip-face");
    var back = card.querySelector(".flip-back");
    card.addEventListener("click", function () {
      var on = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", on ? "true" : "false");
      if (face) face.setAttribute("aria-hidden", on ? "true" : "false");
      if (back) back.setAttribute("aria-hidden", on ? "false" : "true");
    });
  });
})();
