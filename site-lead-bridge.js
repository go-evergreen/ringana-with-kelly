/* First Seeds — fire-and-forget dual-write from custom landing pages.
   Flodesk / Kit still own the visitor experience. Failures here are silent. */
(function (root) {
  "use strict";

  var SUPABASE_URL = "https://pqznpgqnfmnsvdgcwxiy.supabase.co";
  var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0.prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA";

  function trim(v) {
    return String(v == null ? "" : v).trim();
  }

  function looksEmail(n, t) {
    return t === "email" || /email|e-mail/.test(n);
  }

  function looksPhone(n, t) {
    return t === "tel" || /phone|mobile|cell/.test(n);
  }

  function looksName(n, t) {
    if (t === "hidden" || t === "submit" || t === "checkbox" || t === "radio") return false;
    if (looksEmail(n, t) || looksPhone(n, t)) return false;
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
      var t = String(el.type || "text").toLowerCase();
      var n = String(el.name || el.id || el.placeholder || el.getAttribute("aria-label") || "").toLowerCase();
      var v = trim(el.value);
      if (!v) continue;
      if (looksEmail(n, t)) email = v.toLowerCase();
      else if (looksPhone(n, t)) phone = v;
      else if (/last/.test(n)) last = v;
      else if (looksName(n, t)) {
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
      p_interest: "both",
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
      try { last = readFields(root); } catch (err) {}
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
      if (isSubmitControl(e.target)) setTimeout(maybeSend, 80);
    }, true);

    try {
      var obs = new MutationObserver(function () {
        if (looksSuccess(root)) maybeSend();
      });
      obs.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });
    } catch (err2) {}
  }

  root.FSSiteLead = { watch: watch };

  function bootFromConfig() {
    if (root.FS_SITE_LEAD && root.FS_SITE_LEAD.slug) watch(root.FS_SITE_LEAD);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFromConfig);
  } else {
    bootFromConfig();
  }
})(window);
