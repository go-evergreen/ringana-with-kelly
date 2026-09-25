/* Factory flip + FAQ doors for Taylor's business page */
(function () {
  "use strict";

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function bindFaqDoors() {
    var buttons = qsa("[data-faq-cat]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-faq-cat");
        var already = btn.classList.contains("on");
        buttons.forEach(function (b) {
          var on = !already && b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-expanded", on ? "true" : "false");
        });
        qsa(".faq-group").forEach(function (p) {
          var show = !already && p.getAttribute("data-faq-group") === id;
          p.classList.toggle("on", show);
          if (show) p.removeAttribute("hidden");
          else p.setAttribute("hidden", "");
          qsa("details", p).forEach(function (d) { d.open = false; });
        });
      });
    });
    qsa(".faq-group").forEach(function (group) {
      qsa("details", group).forEach(function (d) {
        d.addEventListener("toggle", function () {
          if (!d.open) return;
          qsa("details", group).forEach(function (other) {
            if (other !== d) other.open = false;
          });
        });
      });
    });
  }

  function bindCarousels() {
    qsa("[data-carousel]").forEach(function (root) {
      var track = root.querySelector(".carousel-track");
      var slides = root.querySelectorAll(".carousel-slide");
      var prev = root.querySelector("[data-carousel-prev]");
      var next = root.querySelector("[data-carousel-next]");
      if (!track || slides.length < 2) return;
      var n = slides.length;
      var i = 0;
      var startX = 0;
      var dragging = false;

      function go(to) {
        i = (to + n) % n;
        track.style.transform = "translateX(" + (-i * 100) + "%)";
        slides.forEach(function (s, idx) {
          s.classList.toggle("is-active", idx === i);
        });
      }

      if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); go(i - 1); });
      if (next) next.addEventListener("click", function (e) { e.stopPropagation(); go(i + 1); });

      var viewport = root.querySelector(".carousel-viewport");
      if (viewport) {
        var moved = false;
        viewport.addEventListener("pointerdown", function (e) {
          if (e.target.closest("button, a")) {
            dragging = false;
            moved = false;
            return;
          }
          dragging = true;
          moved = false;
          startX = e.clientX;
        });
        viewport.addEventListener("pointerup", function (e) {
          if (!dragging) return;
          dragging = false;
          var dx = e.clientX - startX;
          if (dx > 40) { moved = true; go(i - 1); }
          else if (dx < -40) { moved = true; go(i + 1); }
        });
        viewport.addEventListener("pointerleave", function () { dragging = false; });
        viewport.addEventListener("click", function (e) {
          if (moved) { moved = false; return; }
          if (e.target.closest("button, a")) return;
          go(i === 0 ? 1 : 0);
        });
      }
    });
  }

  bindFaqDoors();
  bindCarousels();
})();
