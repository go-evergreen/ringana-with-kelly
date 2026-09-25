/* First Seeds — fire-and-forget dual-write from custom landing pages.
   Flodesk / Kit still own the visitor experience. Failures here are silent. */
(function (root) {
  "use strict";

  var SUPABASE_URL = "https://pqznpgqnfmnsvdgcwxiy.supabase.co";
  var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0.prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA";
  var INTERESTS = ["products", "business", "both"];

  function trim(v) {
    return String(v == null ? "" : v).trim();
  }

  function fieldLabel(el) {
    if (!el) return "";
    if (el.id) {
      try {
        var byFor = document.querySelector('label[for="' + el.id + '"]');
        if (byFor) return trim(byFor.textContent);
      } catch (err) {}
    }
    var wrap = el.closest && el.closest('[class*="__field"], [data-fs-lead-name]');
    if (!wrap) return "";
    var label = wrap.querySelector("label");
    return label ? trim(label.textContent) : "";
  }

  function fieldVisible(el) {
    if (!el) return false;
    var wrap = el.closest && el.closest('[class*="__field"]');
    if (wrap && getComputedStyle(wrap).display === "none") return false;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    return true;
  }

  function fieldHint(el) {
    var label = fieldLabel(el);
    var aria = el.getAttribute("aria-label") || "";
    var raw = String(el.name || el.id || el.placeholder || aria || label || "").toLowerCase();
    /* Flodesk / Kit hash the name/id/placeholder. Prefer the visible label. */
    if (/name|first|last|email|phone|tel|mobile|given|surname/.test(raw)) return raw;
    if (label) return label.toLowerCase();
    if (aria) return String(aria).toLowerCase();
    return raw;
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

  function looksHandleField(n) {
    return /(user\s*name|username|\bhandle\b|instagram|facebook|social)/.test(n);
  }

  function looksName(n, t, v, el) {
    if (t === "hidden" || t === "submit" || t === "checkbox" || t === "radio") return false;
    if (looksEmail(n, t, v) || looksPhone(n, t, v)) return false;
    if (looksHandleField(n)) return false;
    var ac = el ? String(el.getAttribute("autocomplete") || "").toLowerCase() : "";
    if (/^(name|given-name|family-name|nickname|additional-name)$/.test(ac)) return true;
    return /name|first|last|fname|lname|given|surname|fullname/.test(n);
  }

  function emailLocalPart(email) {
    return trim(email).toLowerCase().split("@")[0];
  }

  function isHandleLikeName(name, email) {
    var n = trim(name);
    if (n.length < 2) return true;
    if (looksLikeEmailValue(n) || n.indexOf("@") >= 0) return true;
    if (/\s/.test(n)) return false;
    if (/[._0-9]/.test(n)) return true;
    var local = emailLocalPart(email);
    var compactN = n.toLowerCase().replace(/[._+-]+/g, "");
    var compactLocal = local.replace(/[._+-]+/g, "");
    if (local && compactN === compactLocal && n.length >= 8 && n === n.toLowerCase()) return true;
    return false;
  }

  function ourNameInput(scope) {
    return (scope || document).querySelector("#fs-lead-name, [data-fs-lead-name] input")
      || document.querySelector("#fs-lead-name, [data-fs-lead-name] input");
  }

  function readOwnName(scope) {
    var el = ourNameInput(scope);
    return el ? trim(el.value) : "";
  }

  function readFields(scope) {
    var name = readOwnName(scope);
    var last = "";
    var email = "";
    var phone = "";
    var nodes = (scope || document).querySelectorAll("input, textarea");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest("[data-fs-interest], [data-fs-lead-name]")) continue;
      if (el.disabled || el.type === "password" || el.getAttribute("aria-hidden") === "true") continue;
      if (!fieldVisible(el)) continue;
      var t = String(el.type || "text").toLowerCase();
      if (t === "hidden") continue;
      var n = fieldHint(el);
      var v = trim(el.value);
      if (!v) continue;
      if (looksEmail(n, t, v)) email = v.toLowerCase();
      else if (looksPhone(n, t, v)) phone = v;
      else if (/last|family-name|surname/.test(n) || String(el.getAttribute("autocomplete") || "").toLowerCase() === "family-name") last = v;
      else if (!name && looksName(n, t, v, el)) name = v;
    }
    if (last && name && name.toLowerCase() !== last.toLowerCase()) name = name + " " + last;
    return { name: name, email: email, phone: phone };
  }

  function visibleNameFieldExists(scope) {
    if (ourNameInput(scope)) return true;
    var nodes = (scope || document).querySelectorAll("input, textarea");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest("[data-fs-interest]")) continue;
      if (el.disabled || el.type === "password" || el.getAttribute("aria-hidden") === "true") continue;
      if (!fieldVisible(el)) continue;
      var t = String(el.type || "text").toLowerCase();
      if (t === "hidden") continue;
      if (looksName(fieldHint(el), t, trim(el.value), el)) return true;
    }
    return false;
  }

  function nameReady(scope) {
    if (!visibleNameFieldExists(scope)) return true;
    var fields = readFields(scope);
    return !isHandleLikeName(fields.name, fields.email);
  }

  function readInterest(scope) {
    var box = scope || document;
    var hidden = box.querySelector("#fs-interest, [data-fs-interest-value]");
    if (hidden) {
      var v = trim(hidden.value).toLowerCase();
      if (INTERESTS.indexOf(v) >= 0) return v;
    }
    var on = box.querySelector("[data-fs-interest] [data-interest].on, [data-fs-interest] [data-interest][aria-pressed='true']");
    if (on) {
      var v2 = trim(on.getAttribute("data-interest")).toLowerCase();
      if (INTERESTS.indexOf(v2) >= 0) return v2;
    }
    return "";
  }

  function interestReady(scope) {
    var picker = (scope || document).querySelector("[data-fs-interest]");
    if (!picker) return true;
    return !!readInterest(scope);
  }

  function bindInterestPicker(scope) {
    var box = scope || document;
    var row = box.querySelector("[data-fs-interest]");
    if (!row || row.getAttribute("data-fs-interest-bound") === "1") return;
    row.setAttribute("data-fs-interest-bound", "1");
    var hidden = row.querySelector("#fs-interest, [data-fs-interest-value]");
    var err = row.querySelector("#fs-interest-error, [data-fs-interest-error]");
    row.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-interest]");
      if (!chip || !row.contains(chip)) return;
      var val = trim(chip.getAttribute("data-interest")).toLowerCase();
      if (INTERESTS.indexOf(val) < 0) return;
      row.querySelectorAll("[data-interest]").forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (hidden) hidden.value = val;
      if (err) err.hidden = true;
    });
  }

  function showInterestError(scope) {
    var err = (scope || document).querySelector("#fs-interest-error, [data-fs-interest-error]");
    if (err) err.hidden = false;
    var picker = (scope || document).querySelector("[data-fs-interest]");
    if (picker && picker.scrollIntoView) {
      picker.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function showNameError(scope) {
    var box = scope || document;
    var err = box.querySelector("#fs-name-error, [data-fs-name-error]")
      || document.querySelector("#fs-name-error, [data-fs-name-error]");
    if (!err) {
      var host = box.querySelector("[data-fs-lead-name]")
        || document.querySelector("[data-fs-lead-name]")
        || box.querySelector("[data-fs-interest]")
        || box;
      err = document.createElement("p");
      err.id = "fs-name-error";
      err.className = "letter-interest-error";
      err.textContent = "Please enter your name.";
      host.appendChild(err);
    }
    err.hidden = false;
    err.textContent = "Please enter your name.";
    if (err.scrollIntoView) err.scrollIntoView({ block: "nearest", behavior: "smooth" });
    var input = ourNameInput(box);
    if (input && input.focus) input.focus();
  }

  function hideNameError(scope) {
    var err = (scope || document).querySelector("#fs-name-error, [data-fs-name-error]")
      || document.querySelector("#fs-name-error, [data-fs-name-error]");
    if (err) err.hidden = true;
  }

  /* Never inject custom chips into Flodesk/Kit. Their observers fight
     insertBefore and freeze the whole page so Get First Access won't tap. */
  function keepInterestPickerOutsideForm(box) {
    var picker = box.querySelector("[data-fs-interest]");
    if (!picker) return;
    if (picker.classList.contains("is-in-form")) picker.classList.remove("is-in-form");
    var form = picker.closest && picker.closest("form");
    if (!form || !box.contains(form)) return;
    var host = box.querySelector("#fd-form-modal, #kit-form-modal, .letter-form");
    var parent = host && host.parentNode ? host.parentNode : box;
    if (picker.parentNode === parent) return;
    parent.insertBefore(picker, host || null);
  }

  function hideVendorNameFields(box) {
    if (!ourNameInput(box)) return;
    var nodes = box.querySelectorAll("input, textarea");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest("[data-fs-interest], [data-fs-lead-name]")) continue;
      var t = String(el.type || "text").toLowerCase();
      if (t === "hidden" || t === "email" || t === "submit" || t === "button") continue;
      if (!looksName(fieldHint(el), t, trim(el.value), el)) continue;
      var wrap = el.closest && el.closest('[class*="__field"]:not([class*="__fields"]):not([class*="__footer"])');
      if (wrap && /__field(\s|$)/.test(wrap.className || "")) wrap.style.display = "none";
      else if (!wrap) el.style.display = "none";
    }
  }

  function submitButton(box) {
    return (box || document).querySelector(
      'button[type="submit"], input[type="submit"], button.fd-btn, [class*="__button"], .formkit-submit, [data-element="submit"]'
    );
  }

  function revealSubmit(box) {
    var btn = submitButton(box);
    if (!btn) return;
    var footer = btn.closest && btn.closest('[class*="__footer"]');
    if (footer) {
      footer.style.display = "block";
      footer.style.visibility = "visible";
      footer.style.width = "100%";
    }
    btn.style.display = "block";
    btn.style.visibility = "visible";
    btn.style.width = "100%";
    try {
      btn.scrollIntoView({ block: "nearest", inline: "nearest" });
    } catch (err) {}
  }

  function syncNameIntoForm(box) {
    var ours = readOwnName(box);
    if (!ours) return;
    var nodes = box.querySelectorAll("input, textarea");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest("[data-fs-interest], [data-fs-lead-name]")) continue;
      if (el.disabled || el.type === "password") continue;
      var t = String(el.type || "text").toLowerCase();
      if (t === "hidden") continue;
      if (looksName(fieldHint(el), t, trim(el.value), el)) el.value = ours;
    }
  }

  function blockIfIncomplete(box, e) {
    var needInterest = !interestReady(box);
    var needName = !nameReady(box);
    if (!needInterest && !needName) return false;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (needInterest) showInterestError(box);
    if (needName) showNameError(box);
    return true;
  }

  function armFormGates(scope) {
    var box = scope || document;
    var form = box.querySelector('form[class*="__form"]');
    if (!form || form.dataset.fsInterestGate === "1") return;
    if (!box.querySelector("[data-fs-interest]") && !visibleNameFieldExists(box)) return;
    form.dataset.fsInterestGate = "1";
    form.addEventListener("submit", function (e) {
      blockIfIncomplete(box, e);
    }, true);
    form.addEventListener("click", function (e) {
      if (!isSubmitControl(e.target)) return;
      blockIfIncomplete(box, e);
    }, true);
  }

  function prettyFirstFromEmail(email) {
    var local = trim(email).split("@")[0];
    var token = (local.split(/[._+\s-]+/).filter(Boolean)[0] || "").replace(/\d+$/g, "");
    if (token.length < 2 || !/^[a-zA-Z][a-zA-Z']*$/.test(token)) return "";
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  }

  function fallbackName(fields) {
    var n = trim(fields.name);
    if (n.length >= 2 && !isHandleLikeName(n, fields.email)) return n.slice(0, 80);
    return prettyFirstFromEmail(n.indexOf("@") >= 0 ? n : fields.email) || "Friend";
  }

  function send(opts, fields, interest) {
    if (!opts || !opts.slug) return;
    if (!fields.email && !fields.phone) return;
    var picked = trim(interest || "").toLowerCase();
    if (INTERESTS.indexOf(picked) < 0) picked = "both";
    var payload = {
      p_slug: String(opts.slug).toLowerCase(),
      p_name: fallbackName(fields),
      p_email: trim(fields.email).slice(0, 120),
      p_phone: trim(fields.phone).slice(0, 40),
      p_interest: picked,
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
    if (el.closest("[data-fs-interest]")) return false;
    var btn = el.closest("button, input[type=submit], input[type=button]");
    if (!btn) return false;
    var t = String(btn.type || "submit").toLowerCase();
    if (t === "reset") return false;
    return t === "submit" || btn.getAttribute("type") == null || /submit|join|send|subscribe|access/i.test(btn.textContent || btn.value || "");
  }

  function looksSuccess(root) {
    if (!root || !root.querySelector) return false;
    var fd = root.querySelector("#fd-form-modal");
    if (fd && fd.classList && fd.classList.contains("is-submitted")) return true;
    if (root.classList && root.classList.contains("is-submitted")) return true;
    var hit = root.querySelector('[class*="success"], [class*="submitted"]');
    if (!hit) return false;
    var text = trim(hit.textContent);
    return text.length > 0 || hit.offsetParent !== null;
  }

  function watch(opts) {
    if (!opts || !opts.slug) return;
    var root = document.querySelector(opts.root || "#fd-form-modal") || document.body;
    var nameWrap = document.querySelector("[data-fs-lead-name]");
    if (nameWrap && nameWrap.parentNode && nameWrap.parentNode.contains(root)) {
      root = nameWrap.parentNode;
    }
    if (!root || root.getAttribute("data-fs-site-lead") === "1") return;
    root.setAttribute("data-fs-site-lead", "1");
    var last = { name: "", email: "", phone: "" };
    var sentKey = "";

    var armTimer = 0;
    function tickArms() {
      keepInterestPickerOutsideForm(root);
      bindInterestPicker(root);
      hideVendorNameFields(root);
      syncNameIntoForm(root);
      armFormGates(root);
      revealSubmit(root);
    }
    function scheduleArms() {
      if (armTimer) return;
      armTimer = setTimeout(function () {
        armTimer = 0;
        tickArms();
      }, 80);
    }

    function harvest() {
      try {
        var fresh = readFields(root);
        if (fresh.email || fresh.phone || fresh.name) last = fresh;
      } catch (err) {}
    }

    function maybeSend() {
      if (!interestReady(root) || !nameReady(root)) return;
      harvest();
      if (!last.email && !last.phone) return;
      var interest = readInterest(root);
      var key = (last.email || "") + "|" + (last.phone || "") + "|" + interest;
      if (key === sentKey) return;
      sentKey = key;
      send(opts, last, interest);
    }

    tickArms();
    root.addEventListener("input", function () {
      hideNameError(root);
      harvest();
      syncNameIntoForm(root);
      revealSubmit(root);
    }, true);
    root.addEventListener("focusin", function () {
      revealSubmit(root);
    }, true);
    root.addEventListener("change", harvest, true);
    root.addEventListener("submit", function () { maybeSend(); }, true);
    root.addEventListener("click", function (e) {
      if (isSubmitControl(e.target)) {
        harvest();
        syncNameIntoForm(root);
        maybeSend();
        setTimeout(maybeSend, 120);
        setTimeout(maybeSend, 500);
      }
    }, true);

    var modal = document.getElementById("connectModal");
    if (modal) {
      function nudgeArms() {
        tickArms();
      }
      try {
        var modalObs = new MutationObserver(function () {
          if (modal.classList.contains("open")) {
            nudgeArms();
            setTimeout(nudgeArms, 200);
            setTimeout(nudgeArms, 800);
            setTimeout(nudgeArms, 1800);
          }
        });
        modalObs.observe(modal, { attributes: true, attributeFilter: ["class"] });
      } catch (err3) {}
    }

    try {
      var obs = new MutationObserver(function () {
        scheduleArms();
        if (looksSuccess(root)) {
          maybeSend();
          setTimeout(maybeSend, 120);
        }
      });
      obs.observe(root, { childList: true, subtree: true });
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
      if (trim(fields.name).length < 2 || isHandleLikeName(fields.name, fields.email) || !trim(fields.phone)) {
        showJoinError(form, true);
        return;
      }
      showJoinError(form, false);
      send(opts, fields, readInterest(form));
      var sms = form.getAttribute("data-sms") || "";
      if (sms) {
        setTimeout(function () {
          window.location.href = sms;
        }, 40);
      }
    });
  }

  function refresh(rootSel) {
    var root =
      typeof rootSel === "string"
        ? document.querySelector(rootSel)
        : rootSel;
    if (!root) root = document.querySelector("#site-signup");
    if (!root) return;
    keepInterestPickerOutsideForm(root);
    bindInterestPicker(root);
    armFormGates(root);
  }

  root.FSSiteLead = { watch: watch, send: send, bindSmsJoin: bindSmsJoin, refresh: refresh };

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
