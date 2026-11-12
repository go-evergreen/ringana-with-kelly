(function () {
  var box = document.getElementById("quizPrompt");
  if (!box) return;
  var key = "fm-lead-quiz";
  function dismiss() {
    box.hidden = true;
    try { sessionStorage.setItem(key, "1"); } catch (e) {}
  }
  ["quizPromptLater", "quizPromptDismiss", "quizPromptGo", "quizNav"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", dismiss);
  });
  function show() {
    try { if (sessionStorage.getItem(key) === "1") return; } catch (e) {}
    box.hidden = false;
  }
  var params = new URLSearchParams(window.location.search);
  if (params.get("quizpop") === "1") show();
  else window.setTimeout(show, 60000);
})();
