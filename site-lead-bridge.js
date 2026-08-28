/* First Seeds — fire-and-forget dual-write from custom landing pages.
   Flodesk / Kit still own the visitor experience. Failures here are silent. */
(function (root) {
  "use strict";

  var SUPABASE_URL = "https://pqznpgqnfmnsvdgcwxiy.supabase.co";
  var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0.prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA";

  function trim(v) {
    return String(v == null ? "" : v).trim();
  }

  function fieldLabel(el) {
    var wrap = el.closest && el.closest('[class*="__field"]');
    if (!wrap) return "";
    var label = wrap.querySelector("label");
    return label ? trim(label.textContent) : "";
  }

  function fieldVisible(el) {
    var wrap = el.closest && el.closest('[class*="__field"]');
    if (!wrap) return true;
    return getComputedStyle(wrap).display !== "none";
  }

  function fieldHint(el) {
    return String(
      el.name || el.id || el.placeholder || el.getAttribute("aria-label") || fieldLabel(el) || ""
    ).toLowerCase();
  }

  function looksLikeEmailValue(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(v));
  }

  function looksLikePhoneValue(v) {
    var digits = trim(v).replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function looksEmail(n, t, v) {
    if (t === "email" || /email|e-mail/.test(n)) return true;
    return looksLikeEmailValue(v);
  }

  function looksPhone(n, t, v) {
    if (t === "tel" || /phone|mobile|cell|number/.test(n)) return true;
    return looksLikePhoneValue(v);
  }

  function looksName(n, t, v) {
    if (t === "hidden" || t === "submit" || t === "checkbox" || t === "radio") return false;
    if (looksEmail(n, t, v) || looksPhone(n, t, v)) return false;
    return /name|first|last|fname|lname/.test(n);
  }

  function readFields(scope) {
    var name = "";
    var last = "";
    var email = "";
    var phone = "";
    var nodes = (scope || document).querySelectorAll("input, textarea");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.disabled || el.type === "password" || el.getAttribute("aria-hidden") === "true") continue;
      if (!fieldVisible(el)) continue;
      var t = String(el.type || "text").toLowerCase();
      if (t === "hidden") continue;
      var n = fieldHint(el);
      var v = trim(el.value);
      if (!v) continue;
      if (looksEmail(n, t, v)) email = v.toLowerCase();
      else if (looksPhone(n, t, v)) phone = v;
      else if (/last/.test(n)) last = v;
      else if (looksName(n, t, v)) {
        if (!name) name = v;
      }
    }
    if (last && name && name.toLowerCase() !== last.toLowerCase()) name = name + " " + last;
    return { name: name, email: email, phone: phone };
  }

  function fallbackName(fields) {
    var n = trim(fields.name);
    if (n.length >= 2) return n.slice(0, 80);
    var local = (fields.email || "").split("@")[0].replace(/[._-]+/g, " ");
    local = trim(local);
    if (local.length >= 2) return local.slice(0, 80);
    return "Friend";
  }

  function send(opts, fields) {
    if (!opts || !opts.slug) return;
    if (!fields.email && !fields.phone) return;
    var payload = {
      p_slug: String(opts.slug).toLowerCase(),
      p_name: fallbackName(fields),
      p_email: trim(fields.email).slice(0, 120),
      p_phone: trim(fields.phone).slice(0, 40),
      p_interest: "",
      p_hp: "",
      p_source: "site"
    };
    try {
      fetch(SUPABASE_URL + "/rest/v1/rpc/submit_lead", {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: "Bearer " + ANON_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (err) {}
  }

  function isSubmitControl(el) {
    if (!el || !el.closest) return false;
    var btn = el.closest("button, input[type=submit], input[type=button]");
    if (!btn) return false;
    var t = String(btn.type || "submit").toLowerCase();
    if (t === "reset") return false;
    return t === "submit" || btn.getAttribute("type") == null || /submit|join|send|subscribe|access/i.test(btn.textContent || btn.value || "");
  }

  function looksSuccess(root) {
    if (!root || !root.querySelector) return false;
    if (root.classList && root.classList.contains("is-submitted")) return true;
    var hit = root.querySelector('[class*="success"], [class*="submitted"]');
    if (!hit) return false;
    var text = trim(hit.textContent);
    return text.length > 0 || hit.offsetParent !== null;
  }

  function watch(opts) {
    if (!opts || !opts.slug) return;
    var root = document.querySelector(opts.root || "#fd-form-modal") || document.body;
    if (!root || root.getAttribute("data-fs-site-lead") === "1") return;
    root.setAttribute("data-fs-site-lead", "1");
    var last = { name: "", email: "", phone: "" };
    var sentKey = "";

    function harvest() {
      try {
        var fresh = readFields(root);
        if (fresh.email || fresh.phone || fresh.name) last = fresh;
      } catch (err) {}
    }

    function maybeSend() {
      harvest();
      if (!last.email && !last.phone) return;
      var key = (last.email || "") + "|" + (last.phone || "");
      if (key === sentKey) return;
      sentKey = key;
      send(opts, last);
    }

    root.addEventListener("input", harvest, true);
    root.addEventListener("change", harvest, true);
    root.addEventListener("submit", function () { maybeSend(); }, true);
    root.addEventListener("click", function (e) {
      if (isSubmitControl(e.target)) {
        harvest();
        maybeSend();
        setTimeout(maybeSend, 120);
        setTimeout(maybeSend, 500);
      }
    }, true);

    try {
      var obs = new MutationObserver(function () {
        if (looksSuccess(root)) {
          maybeSend();
          setTimeout(maybeSend, 120);
        }
      });
      obs.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });
    } catch (err2) {}
  }

  function showJoinError(form, on) {
    var el = form.querySelector("[data-fs-error]");
    if (!el) return;
    if (on) el.classList.add("is-on");
    else el.classList.remove("is-on");
  }

  /* One button: copy into First Seeds, then open the prefilled SMS. */
  function bindSmsJoin(opts) {
    if (!opts || !opts.slug) return;
    var form = document.querySelector(opts.form || "#fs-sms-join");
    if (!form || form.getAttribute("data-fs-sms-bound") === "1") return;
    form.setAttribute("data-fs-sms-bound", "1");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = form.querySelector(".letter-join-hp, input[name=website]");
      if (hp && trim(hp.value)) return;
      var fields = readFields(form);
      if (trim(fields.name).length < 2 || !trim(fields.phone)) {
        showJoinError(form, true);
        return;
      }
      showJoinError(form, false);
      send(opts, fields);
      var sms = form.getAttribute("data-sms") || "";
      if (sms) {
        setTimeout(function () {
          window.location.href = sms;
        }, 40);
      }
    });
  }

  root.FSSiteLead = { watch: watch, send: send, bindSmsJoin: bindSmsJoin };

  function bootFromConfig() {
    var cfg = root.FS_SITE_LEAD;
    if (!cfg || !cfg.slug) return;
    if (cfg.form) bindSmsJoin(cfg);
    else watch(cfg);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFromConfig);
  } else {
    bootFromConfig();
  }
})(window);
