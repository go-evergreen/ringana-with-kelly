/* Interactive dummy hub — not First Seeds. Dummy data only. */
(function () {
  "use strict";

  var app = document.getElementById("demoApp");
  if (!app) return;

  var captions = {
    sprout: {
      kicker: "🌱 Sprout",
      title: "The path is already built.",
      line: "Story, a few products, your page, then who you’d tell. Post Studio and Calendar are waiting when you want them."
    },
    learn: {
      kicker: "💡 Learn",
      title: "The whole library.",
      line: "Company, products, ingredients, FAQs, talking points, and The Fresh Match. Search any of it."
    },
    calendar: {
      kicker: "📅 Calendar",
      title: "More than dates.",
      line: "Zooms. October. A post vault. Pictures and videos. Posts from the team. Your own follow-ups."
    },
    leads: {
      kicker: "📧 Leads",
      title: "Your page. Your inbox.",
      line: "They leave a name. You see what they want and if they took the quiz."
    },
    grove: {
      kicker: "🌳 Grove",
      title: "The tree up top.",
      line: "Who joined with you. Who could use a cheer. A note you can send. That’s the tree in the header."
    },
    clients: {
      kicker: "🧴 Clients",
      title: "Your clients live here.",
      line: "Share your Fresh Shelf. See who showed up, leave a note, write them from this tab."
    },
    messages: {
      kicker: "💬 Messages",
      title: "What’s going on.",
      line: "Team notes, a zoom change, a message from the person walking you. Chat icon in the header."
    }
  };

  var sheets = {
    next: {
      tab: "sprout",
      html:
        '<p class="demo-kicker">What’s next</p>' +
        '<h2 class="demo-h1">Name who you’d tell.</h2>' +
        '<p class="demo-p">Five people you’d actually text. Hopeful is fine. This is just the names, so you can see them.</p>' +
        '<div class="demo-card" style="cursor:default"><strong>Maya — sister</strong><p>Already asking what’s in my bathroom.</p></div>' +
        '<div class="demo-card" style="cursor:default"><strong>Jordan — neighbor</strong><p>Reads every label at the store.</p></div>' +
        '<p class="demo-lock">Demo list. Your real names live in your hub, not here.</p>'
    },
    "step-story": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">Your story</p>' +
        '<h2 class="demo-h1">Three quiet answers.</h2>' +
        '<p class="demo-p">Why this, why now, why you. Messy is fine. Everything you share later grows from this.</p>' +
        '<div class="demo-card" style="cursor:default"><strong>Done in this demo</strong><p>In the real hub, your words stay with you.</p></div>'
    },
    "step-products": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">First few</p>' +
        '<h2 class="demo-h1">Heart 2–3 you’d talk about.</h2>' +
        '<p class="demo-p">A shortlist beats a catalog quiz. Open Learn so your story has real product knowledge behind it.</p>' +
        '<button type="button" class="demo-btn" data-tab="learn">Open Learn →</button>'
    },
    "step-ground": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">Your page</p>' +
        '<h2 class="demo-h1">Your patch of ground.</h2>' +
        '<p class="demo-p">A personal page people land on. They leave their name. It shows up only in your inbox — that’s the Leads tab.</p>' +
        '<button type="button" class="demo-btn" data-tab="leads">Open Leads →</button>'
    },
    "step-map": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">Your people</p>' +
        '<h2 class="demo-h1">Map your grove.</h2>' +
        '<p class="demo-p">Customers first. Partners optional. A list you can actually see — not a vague “I’ll post and see.”</p>' +
        '<p class="demo-lock">Demo peek. Your real names live in the hub.</p>'
    },
    "step-tell": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">Who you tell</p>' +
        '<h2 class="demo-h1">A peek.</h2>' +
        '<p class="demo-p">Locked steps can still be opened. In the real hub that’s “Open anyway.” Here it’s just a peek.</p>' +
        '<button type="button" class="demo-btn" data-open="next">See a dummy list →</button>'
    },
    "step-dates": {
      tab: "sprout",
      html:
        '<p class="demo-kicker">Team dates</p>' +
        '<h2 class="demo-h1">On the calendar.</h2>' +
        '<p class="demo-p">The next zoom, pre-reg, your own follow-ups. Tap Calendar to look around.</p>' +
        '<button type="button" class="demo-btn" data-tab="calendar">Open Calendar →</button>'
    },
    "event-zoom": {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Weekly</p>' +
        '<h2 class="demo-h1">Team zoom</h2>' +
        '<p class="demo-p">Come when you can. No pressure to be on camera. Replay shows up here after.</p>' +
        '<button type="button" class="demo-btn" data-toggle="going" id="demoGoing">I’ll try to be there</button>' +
        '<p class="demo-lock" id="demoGoingNote" hidden>Marked in this demo only — nothing is saved.</p>'
    },
    "event-rest": {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Sat · rest</p>' +
        '<h2 class="demo-h1">No post required.</h2>' +
        '<p class="demo-p">Reply to comments, check messages, or live your life. Consistency includes rest.</p>'
    },
    "event-prereg": {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Oct 1</p>' +
        '<h2 class="demo-h1">Partner pre-reg</h2>' +
        '<p class="demo-p">U.S. partner signup. The people who already walked the path walk in ready.</p>'
    },
    "add-event": {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Yours</p>' +
        '<h2 class="demo-h1">Add an event or follow-up</h2>' +
        '<p class="demo-p">Team dates are already here. In the real hub you can drop in your own — a follow-up you promised, a zoom you booked, a reminder that belongs to you.</p>' +
        '<p class="demo-lock">Demo peek. Your real calendar stays in the hub.</p>'
    },
    "lead-1": {
      tab: "leads",
      html:
        '<p class="demo-kicker">Inbox · demo</p>' +
        '<h2 class="demo-h1 demo-blur">Jordan M.</h2>' +
        '<p class="demo-p">Curious about the products. Contact stays hidden in this demo.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Products</span><span class="demo-chip">New</span></div>' +
        '<p class="demo-lock">In the real hub this is a name, a note, and a ping on your phone. Here it’s a blur on purpose.</p>'
    },
    "lead-2": {
      tab: "leads",
      html:
        '<p class="demo-kicker">Inbox · demo</p>' +
        '<h2 class="demo-h1 demo-blur">Sam R.</h2>' +
        '<p class="demo-p">Curious about products and the partnership.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Both</span><span class="demo-chip">Reached out</span></div>' +
        '<p class="demo-lock">Follow-up lives with the partner who owns the page — not a shared spreadsheet.</p>'
    },
    "prod-hydro": {
      tab: "learn",
      html:
        '<p class="demo-kicker">FRESH · hydration</p>' +
        '<h2 class="demo-h1">Hydro serum</h2>' +
        '<p class="demo-p">A lightweight serum for skin that feels dry by lunch. Plant waters and humectants — not a trend list.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Face</span><span class="demo-chip">Daily</span></div>' +
        '<p class="demo-lock">Short public-safe notes. Full ingredient pages live in the real Learn tab.</p>'
    },
    "prod-cleanse": {
      tab: "learn",
      html:
        '<p class="demo-kicker">FRESH · cleanse</p>' +
        '<h2 class="demo-h1">Cleanser</h2>' +
        '<p class="demo-p">Cleaning-milk energy: soft on skin, serious on dirt. Makeup comes off with a washcloth.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Face</span><span class="demo-chip">PM</span></div>'
    },
    "prod-cream": {
      tab: "learn",
      html:
        '<p class="demo-kicker">FRESH · cream</p>' +
        '<h2 class="demo-h1">Skin perfection</h2>' +
        '<p class="demo-p">Rich without heavy. Bakuchiol plus ceramides doing quiet work under the finish.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Face</span><span class="demo-chip">Night</span></div>'
    },
    "prod-caps": {
      tab: "learn",
      html:
        '<p class="demo-kicker">CAPS</p>' +
        '<h2 class="demo-h1">Protect</h2>' +
        '<p class="demo-p">A daily capsule for immune-season support — plant extracts, not a mystery blend.</p>' +
        '<p class="demo-lock">Not medical advice. The real hub has the full fact sheet.</p>'
    },
    "person-you": {
      tab: "grove",
      html:
        '<p class="demo-kicker">Your grove</p>' +
        '<h2 class="demo-h1">This would be you.</h2>' +
        '<p class="demo-p">When someone joins with your link, they land on your tree. Cheers and notes go one tap from here.</p>'
    },
    "person-maya": {
      tab: "grove",
      html:
        '<p class="demo-kicker">Needs a nudge</p>' +
        '<h2 class="demo-h1 demo-blur">Maya</h2>' +
        '<p class="demo-p">Story’s in. Hasn’t opened Learn yet. Dummy partner — not a real person on this page.</p>' +
        '<button type="button" class="demo-btn" data-open="cheer">Send a cheer</button>' +
        '<button type="button" class="demo-btn ghost" data-open="note">Leave a note</button>'
    },
    "person-jordan": {
      tab: "grove",
      html:
        '<p class="demo-kicker">In motion</p>' +
        '<h2 class="demo-h1 demo-blur">Jordan</h2>' +
        '<p class="demo-p">Picked three products. Ready for a cheer.</p>' +
        '<button type="button" class="demo-btn" data-open="cheer">Send a cheer</button>' +
        '<button type="button" class="demo-btn ghost" data-open="note">Leave a note</button>'
    },
    "person-demo": {
      tab: "grove",
      html:
        '<p class="demo-kicker">On your tree</p>' +
        '<h2 class="demo-h1">A dummy partner.</h2>' +
        '<p class="demo-p">In the real hub this is someone who joined with a team link. Cheers and notes go one tap from here. These names are fake — so you can see the shape of a grove, not a live team.</p>' +
        '<button type="button" class="demo-btn" data-open="cheer">Send a cheer</button>' +
        '<button type="button" class="demo-btn ghost" data-open="note">Leave a note</button>'
    },
    cheer: {
      tab: "grove",
      html:
        '<p class="demo-kicker">Cheer</p>' +
        '<h2 class="demo-h1">A warm line. One tap.</h2>' +
        '<div class="demo-card" style="cursor:default;font-family:Fraunces,serif;font-style:italic;font-size:15px;line-height:1.45">I see you showing up — that matters more than perfect posts.</div>' +
        '<button type="button" class="demo-btn" data-cheer="1">Send cheer</button>' +
        '<button type="button" class="demo-btn ghost" data-open="cheer-2">Choose another</button>'
    },
    "cheer-2": {
      tab: "grove",
      html:
        '<p class="demo-kicker">Cheer</p>' +
        '<h2 class="demo-h1">Another line.</h2>' +
        '<div class="demo-card" style="cursor:default;font-family:Fraunces,serif;font-style:italic;font-size:15px;line-height:1.45">Root by root. You’re doing the real work.</div>' +
        '<button type="button" class="demo-btn" data-cheer="1">Send cheer</button>' +
        '<button type="button" class="demo-btn ghost" data-open="cheer">Choose another</button>'
    },
    note: {
      tab: "grove",
      html:
        '<p class="demo-kicker">Note</p>' +
        '<h2 class="demo-h1">Your own words.</h2>' +
        '<p class="demo-p">In the real hub you type a short note and it lands in their messages. Here it’s just the shape of it.</p>' +
        '<div class="demo-card" style="cursor:default"><p>“Proud of the quiet work this week. When you’re ready, open Learn and heart two products you’d actually talk about.”</p></div>' +
        '<button type="button" class="demo-btn" data-cheer="note">Send note (demo)</button>'
    },
    faqs: {
      tab: "learn",
      html:
        '<p class="demo-kicker">Straight answers</p>' +
        '<h2 class="demo-h1">FAQs</h2>' +
        '<p class="demo-p">When someone asks about packs, bonuses, or “is this MLM.” Search lives in the real Learn tab.</p>' +
        '<div class="demo-fact"><b>Is this MLM?</b><p>Ringana is a network. We talk about it plainly in the hub — no fog, no hype.</p></div>' +
        '<div class="demo-fact"><b>What does it cost to start?</b><p>Current guidance lives under U.S. launch snapshot. Details can still refine.</p></div>' +
        '<p class="demo-lock">A peek. The searchable FAQ list stays in the hub.</p>'
    },
    "why-ringana": {
      tab: "learn",
      html:
        '<p class="demo-kicker">The company</p>' +
        '<h2 class="demo-h1">Why Ringana</h2>' +
        '<p class="demo-p">Fresh production. Thoughtful formulas. A family still at the helm since 1996.</p>' +
        '<div class="demo-fact"><b>Fresh</b><p>Made in small batches — not sitting in a warehouse for years.</p></div>' +
        '<div class="demo-fact"><b>The planet</b><p>Glass, COSMOS, vegan. How they treat the earth is part of the product.</p></div>' +
        '<div class="demo-fact"><b>The three words</b><p>Trendsetting. Excellence. Fresh. The full Why Ringana pages live in the hub.</p></div>' +
        '<p class="demo-lock">Preview only. Pillars, sustainability, and the launch snapshot open for partners.</p>'
    },
    "prod-library": {
      tab: "learn",
      html:
        '<p class="demo-kicker">Product library</p>' +
        '<h2 class="demo-h1">Learn the products</h2>' +
        '<p class="demo-p">Skincare, body, hair, baby, supplements — plus an ingredient guide for “what’s in it.”</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Face</span><span class="demo-chip">Body</span><span class="demo-chip">Hair</span><span class="demo-chip">Baby</span><span class="demo-chip">CAPS</span></div>' +
        '<button type="button" class="demo-card" data-open="prod-hydro"><strong>FRESH hydro serum</strong><p>Hydration that lasts.</p></button>' +
        '<button type="button" class="demo-card" data-open="prod-cleanse"><strong>FRESH cleanser</strong><p>Soft on skin, serious on dirt.</p></button>' +
        '<button type="button" class="demo-card" data-open="prod-cream"><strong>FRESH skin perfection</strong><p>Rich without heavy.</p></button>' +
        '<p class="demo-lock">A peek. Full fact sheets and the ingredient guide stay behind login.</p>'
    },
    talking: {
      tab: "learn",
      html:
        '<p class="demo-kicker">Conversation guide</p>' +
        '<h2 class="demo-h1">Talking fresh</h2>' +
        '<p class="demo-p">What to say when someone comments, objects, goes quiet, or asks about the business — structure you can steal, not a script to recite.</p>' +
        '<p class="demo-lock">The real guide is for partners. This is the door, not the library.</p>'
    },
    match: {
      tab: "learn",
      html:
        '<p class="demo-kicker">Shareable tool</p>' +
        '<h2 class="demo-h1">The Fresh Match</h2>' +
        '<p class="demo-p">A short quiz for people who already know you. They get a match, then they come back to you — not a shopping cart.</p>' +
        '<p class="demo-lock">Share one-to-one. Not a public funnel.</p>'
    },
    "week-plan": {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Suggested</p>' +
        '<h2 class="demo-h1">This week’s plan</h2>' +
        '<p class="demo-p">A calm rotation — not a cage. Curiosity one day, a helpful share the next, the zoom. Add your own events and follow-ups whenever you need them.</p>' +
        '<div class="demo-card" style="cursor:default"><strong>Give more than you ask.</strong><p>The week is mapped so you’re not staring at a blank square.</p></div>' +
        '<div class="demo-card" style="cursor:default"><strong>Weekly team zoom</strong><p>Show up if you can.</p></div>' +
        '<div class="demo-card" style="cursor:default"><strong>Your follow-up</strong><p>Add a reminder for someone you said you’d text back.</p></div>' +
        '<p class="demo-lock">The full suggested week lives in the hub. Ready captions stay private.</p>'
    },
    vault: {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Content library</p>' +
        '<h2 class="demo-h1">Post vault</h2>' +
        '<p class="demo-p">Reels, carousels, stories, and singles — browse by type. Steal the structure, rewrite it in your voice. So “what do I post?” has an answer besides a blank notes app.</p>' +
        '<div class="demo-chip-row"><span class="demo-chip">Reels</span><span class="demo-chip">Carousels</span><span class="demo-chip">Stories</span><span class="demo-chip">Singles</span></div>' +
        '<p class="demo-lock">Captions stay in the private hub. This demo will not show them.</p>'
    },
    "team-link": {
      tab: "grove",
      html:
        '<p class="demo-kicker">Team join link</p>' +
        '<h2 class="demo-h1">Share your unique team link</h2>' +
        '<p class="demo-p">When they sign in with this link, they’re linked to your team. Not your lead page — that’s under Leads.</p>' +
        '<p class="demo-lock">Demo only. No live join code here.</p>'
    },
    photos: {
      tab: "calendar",
      html:
        '<p class="demo-kicker">Pictures & videos</p>' +
        '<h2 class="demo-h1">Pictures & videos</h2>' +
        '<p class="demo-p">Browse the library — tap to open, press and hold to save. Pictures and videos, not just stills.</p>' +
        '<p class="demo-lock">The library stays in the private hub. This preview won’t show them.</p>'
    },
    "launch-snap": {
      tab: "learn",
      html:
        '<p class="demo-kicker">Current guidance</p>' +
        '<h2 class="demo-h1">U.S. launch snapshot</h2>' +
        '<div class="demo-fact"><b>Pre-registration</b><p>Starts <strong>October 1</strong>. $0 to reserve your spot.</p></div>' +
        '<div class="demo-fact"><b>Founder packs</b><p>Current guidance: about $220. Details can refine closer to launch.</p></div>' +
        '<div class="demo-fact"><b>Staying active</b><p>A personal order or a customer order once every 12 months.</p></div>' +
        '<p class="demo-lock">Preview of the accordion in Learn. Full cards and Miami details are in the hub.</p>'
    },
    "why-now": {
      tab: "learn",
      html:
        '<p class="demo-kicker">Learn</p>' +
        '<h2 class="demo-h1">Why start now?</h2>' +
        '<p class="demo-p">Momentum isn’t created on launch day. It’s created before.</p>' +
        '<p class="demo-p">By October, the hope is you’ll already understand the products, why freshness matters, and how The Fresh Grove holds you — so day one feels like a door you’ve already walked up to.</p>' +
        '<p class="demo-lock">A peek. The full Learn tab lives in the hub.</p>'
    },
    messages: {
      html:
        '<p class="demo-kicker">What’s new</p>' +
        '<h2 class="demo-h1">Messages</h2>' +
        '<p class="demo-p">Announcements for the grove, and notes sent to you. In the real hub this is a live board.</p>' +
        '<p class="demo-lock">Demo only — no live messages here.</p>'
    },
    settings: {
      html:
        '<p class="demo-kicker">Settings</p>' +
        '<h2 class="demo-h1">Your hub, your pace.</h2>' +
        '<p class="demo-p">Notifications, display name, and invite code live here in the real app. This demo doesn’t save anything.</p>' +
        '<p class="demo-lock">© 2026 The Fresh Grove. First Seeds demo — dummy data only.</p>'
    },
    roadmap: {
      html:
        '<p class="demo-kicker">Roadmap to launch</p>' +
        '<h2 class="demo-h1">The dates that matter.</h2>' +
        '<div class="demo-card" style="cursor:default"><strong>Oct 1</strong><p>Partner pre-reg opens.</p></div>' +
        '<div class="demo-card" style="cursor:default"><strong>Nov 2</strong><p>Products launch in the U.S.</p></div>' +
        '<p class="demo-lock">Same countdown chips as the real hub. Details can still shift.</p>'
    }
  };

  var sheetSteps = {
    "step-story": "story",
    "step-products": "products",
    "step-ground": "ground",
    "step-map": "map"
  };

  var sheetEl = document.getElementById("demoSheet");
  var sheetBody = document.getElementById("demoSheetBody");
  var toastEl = document.getElementById("demoToast");
  var toastTimer = 0;
  var currentTab = "sprout";
  var headerReturnTab = "sprout";
  var headerTabs = { grove: true, messages: true };
  var plant = { roots: 0, checks: { products: false, ground: false, map: false } };
  var introTimers = [];
  var introDone = false;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function byId(id) { return document.getElementById(id); }

  function checkCount() {
    var n = 0;
    if (plant.checks.products) n++;
    if (plant.checks.ground) n++;
    if (plant.checks.map) n++;
    return n;
  }

  function sproutStage() {
    var done = checkCount();
    if (done <= 0) return 0;
    if (done >= 3) return 6;
    return Math.max(1, Math.min(5, Math.ceil((done / 3) * 5)));
  }

  function growthPct() {
    return Math.round((plant.roots / 3) * 40 + (checkCount() / 3) * 60);
  }

  function plantCaption() {
    if (plant.roots < 3) return "Roots growing · " + plant.roots + " of 3.";
    if (checkCount() <= 0) return "Roots are in. Heart a few products to sprout.";
    if (checkCount() >= 3) return "Full bloom — demo path is done.";
    return checkCount() + " of 3 checks — growing in the hub.";
  }

  function pulsePlant() {
    var box = byId("demoPlant");
    if (!box) return;
    box.classList.remove("sprout-pulse");
    void box.offsetWidth;
    box.classList.add("sprout-pulse");
    window.setTimeout(function () { box.classList.remove("sprout-pulse"); }, 900);
  }

  function nextStepId() {
    if (plant.roots < 3) return "story";
    if (!plant.checks.products) return "products";
    if (!plant.checks.ground) return "ground";
    if (!plant.checks.map) return "map";
    return "";
  }

  function updateToday() {
    var title = byId("demoTodayTitle");
    var body = byId("demoTodayBody");
    var go = byId("demoTodayGo");
    if (!title || !body || !go) return;
    go.removeAttribute("data-open");
    go.removeAttribute("data-tab");
    go.removeAttribute("data-grow");
    go.setAttribute("data-locked", "");
    if (plant.roots < 3) {
      title.textContent = "Plant your roots";
      body.textContent = "Three quiet story answers. That’s what grows the roots underground.";
      go.textContent = "Let’s go →";
    } else if (!plant.checks.products) {
      title.textContent = "Pick your first few.";
      body.textContent = "Open Learn, then heart 2–3 you’d actually talk about.";
      go.textContent = "Open Pick Your First Few →";
    } else if (!plant.checks.ground) {
      title.textContent = "Your patch of ground.";
      body.textContent = "A simple page to share — so curious people land with you, not in a group chat.";
      go.textContent = "Set up your page →";
    } else if (!plant.checks.map) {
      title.textContent = "Map your grove.";
      body.textContent = "Customers first. Partners optional. Names you can actually see.";
      go.textContent = "Map your grove →";
    } else {
      title.textContent = "Soft start is done.";
      body.textContent = "All in unlocks Calendar, Post Studio, and Grow Your Grove.";
      go.textContent = "Open Learn →";
    }
  }

  function renderPlant() {
    var box = byId("demoPlant");
    var fn = window.FS && window.FS.plantSVG;
    if (box && fn) box.innerHTML = fn(sproutStage(), plant.roots, 3, "dpl");
    var roots = byId("demoStatRoots");
    var checks = byId("demoStatChecks");
    var cap = byId("demoPlantCaption");
    var label = byId("demoGrowthLabel");
    var fill = byId("demoFill");
    if (roots) roots.innerHTML = "<em>Roots</em> " + plant.roots + "/3";
    if (checks) checks.innerHTML = "<em>Checks</em> " + checkCount() + "/3";
    if (cap) cap.textContent = plantCaption();
    if (label) label.textContent = "Growth " + growthPct() + "%";
    if (fill) fill.style.width = growthPct() + "%";
    updateSteps();
    updateToday();
  }

  function updateSteps() {
    var nums = { story: "1", products: "2", ground: "3", map: "4" };
    qsa(".fs-step[data-step]", app).forEach(function (el) {
      var id = el.getAttribute("data-step");
      var done = id === "story" ? plant.roots >= 3 : !!plant.checks[id];
      var nextId = nextStepId();
      var isNext = id === nextId && !done;
      el.classList.toggle("done", done);
      el.classList.toggle("next", isNext);
      el.classList.toggle("locked", !done && !isNext);
      el.setAttribute("data-locked", "");
      var num = el.querySelector(".fs-num");
      if (num) num.textContent = done ? "✓" : (nums[id] || "");
      var st = el.querySelector(".fs-status");
      if (st) st.textContent = done ? "Done" : (isNext ? "Up next" : "In the hub");
    });
  }

  function stopIntro() {
    introTimers.forEach(function (id) { window.clearTimeout(id); });
    introTimers = [];
    introDone = true;
  }

  function completeStep(id) {
    var grew = false;
    if (id === "story" && plant.roots < 3) {
      stopIntro();
      plant.roots = 3;
      grew = true;
    } else if (plant.checks.hasOwnProperty(id) && !plant.checks[id]) {
      stopIntro();
      plant.checks[id] = true;
      grew = true;
    }
    if (grew) {
      renderPlant();
      pulsePlant();
    }
    return grew;
  }

  function playIntro() {
    if (introDone) return;
    renderPlant();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      plant.roots = 3;
      plant.checks.products = true;
      renderPlant();
      introDone = true;
      return;
    }
    function later(ms, fn) {
      introTimers.push(window.setTimeout(fn, ms));
    }
    later(280, function () { if (!introDone) { plant.roots = 1; renderPlant(); pulsePlant(); } });
    later(620, function () { if (!introDone) { plant.roots = 2; renderPlant(); pulsePlant(); } });
    later(980, function () { if (!introDone) { plant.roots = 3; renderPlant(); pulsePlant(); } });
    later(1500, function () {
      if (introDone) return;
      plant.checks.products = true;
      renderPlant();
      pulsePlant();
      introDone = true;
    });
  }

  function setCountdown() {
    function daysUntil(y, m, d) {
      return Math.max(0, Math.ceil((Date.UTC(y, m, d) - Date.now()) / 86400000));
    }
    var pre = byId("demoCdPre");
    var launch = byId("demoCdLaunch");
    if (pre) pre.textContent = String(daysUntil(2026, 9, 1));
    if (launch) launch.textContent = String(daysUntil(2026, 10, 2));
  }

  function setCaption(tab) {
    var cap = captions[tab] || captions.sprout;
    var k = byId("demoGuideKicker");
    var t = byId("demoGuideTitle");
    var line = byId("demoGuideLine");
    if (k) k.textContent = cap.kicker;
    if (t) t.textContent = cap.title;
    if (line) {
      line.textContent = cap.line || "";
      line.hidden = !cap.line;
    }
  }

  var savedPaneTop = 0;
  var savedWinX = 0;
  var savedWinY = 0;

  function snapshotScroll() {
    var pane = app.querySelector(".demo-tab.on");
    savedPaneTop = pane ? pane.scrollTop : 0;
    savedWinX = window.scrollX;
    savedWinY = window.scrollY;
  }

  function restoreScroll() {
    var pane = app.querySelector(".demo-tab.on");
    if (pane) pane.scrollTop = savedPaneTop;
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(savedWinX, savedWinY);
    html.style.scrollBehavior = prev;
  }

  function paintHeaderActions(tab) {
    var tree = byId("demoGroveTree");
    if (tree) {
      var treeOn = tab === "grove";
      tree.classList.toggle("on", treeOn);
      tree.setAttribute("aria-pressed", treeOn ? "true" : "false");
      tree.setAttribute("aria-label", treeOn ? "Close Grow Your Grove" : "Grow Your Grove");
      tree.setAttribute("title", treeOn ? "Close Grow Your Grove" : "Grow Your Grove");
    }
    var msg = byId("demoMessagesBtn");
    if (msg) {
      var msgOn = tab === "messages";
      msg.classList.toggle("on", msgOn);
      msg.setAttribute("aria-pressed", msgOn ? "true" : "false");
      msg.setAttribute("aria-label", msgOn ? "Close Messages" : "Messages");
      msg.setAttribute("title", msgOn ? "Close Messages" : "Messages");
    }
  }

  function toggleHeaderTab(tab) {
    if (currentTab === tab) {
      gotoTab(headerReturnTab || "sprout");
      return;
    }
    if (!headerTabs[currentTab]) headerReturnTab = currentTab;
    gotoTab(tab);
  }

  function showTab(tab) {
    qsa(".demo-tab", app).forEach(function (el) {
      var on = el.getAttribute("data-tab") === tab;
      var wasOn = el.classList.contains("on");
      el.classList.toggle("on", on);
      if (on && !wasOn) el.scrollTop = 0;
    });
    qsa(".demo-nav button", app).forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-tab") === tab);
    });
    paintHeaderActions(tab);
  }

  function closeSheet() {
    if (!sheetEl) return;
    sheetEl.classList.remove("open");
    window.setTimeout(function () {
      if (!sheetEl.classList.contains("open")) {
        sheetEl.hidden = true;
        if (sheetBody) sheetBody.innerHTML = "";
        sheetEl.scrollTop = 0;
      }
    }, 320);
  }

  function gotoTab(tab) {
    if (!captions[tab]) tab = "sprout";
    currentTab = tab;
    showTab(tab);
    closeSheet();
    setCaption(tab);
    var idx = tour.indexOf(tab);
    if (idx >= 0) {
      tourI = idx;
      setTourPos();
    }
  }

  function openSheet(id) {
    pauseTour();
    if (sheetSteps[id]) completeStep(sheetSteps[id]);
    var spec = sheets[id];
    if (!spec || !sheetEl || !sheetBody) return;
    if (spec.tab && spec.tab !== currentTab) {
      currentTab = spec.tab;
      showTab(spec.tab);
      setCaption(spec.tab);
    }
    sheetBody.innerHTML = spec.html;
    sheetEl.hidden = false;
    sheetEl.scrollTop = 0;
    window.requestAnimationFrame(function () {
      sheetEl.classList.add("open");
    });
  }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("on");
    }, 2200);
  }

  app.addEventListener("pointerdown", function (e) {
    pauseTour();
    snapshotScroll();
    if (e.pointerType !== "mouse") return;
    var el = e.target.closest("button, a, input, [tabindex]");
    if (!el || !app.contains(el)) return;
    e.preventDefault();
    if (typeof el.focus === "function") el.focus({ preventScroll: true });
  }, true);
  app.addEventListener("focusin", function () {
    restoreScroll();
    window.requestAnimationFrame(restoreScroll);
  });

  app.addEventListener("click", function (e) {
    if (e.target.closest("#demoGuide") || e.target.closest("#demoBack")) return;
    var treeBtn = e.target.closest("#demoGroveTree");
    if (treeBtn && app.contains(treeBtn)) {
      e.preventDefault();
      pauseTour();
      toggleHeaderTab("grove");
      return;
    }
    var msgBtn = e.target.closest("#demoMessagesBtn");
    if (msgBtn && app.contains(msgBtn)) {
      e.preventDefault();
      pauseTour();
      toggleHeaderTab("messages");
      return;
    }
    var tabBtn = e.target.closest(".demo-nav button[data-tab]");
    if (tabBtn && app.contains(tabBtn)) {
      e.preventDefault();
      pauseTour();
      gotoTab(tabBtn.getAttribute("data-tab"));
      return;
    }
    var hit = e.target.closest("button, a, [data-locked], .fs-step, .demo-lead-card, .fs-plantbox");
    if (hit && app.contains(hit)) {
      e.preventDefault();
      toast("Join the grove to see all the features");
      if (typeof hit.blur === "function") hit.blur();
      restoreScroll();
      window.requestAnimationFrame(restoreScroll);
    }
  });

  var back = document.getElementById("demoBack");
  if (back) back.addEventListener("click", function () { closeSheet(); });

  var tour = ["sprout", "calendar", "leads", "learn", "clients", "grove", "messages"];
  var tourI = 0;
  var tourTimer = 0;
  var tourPaused = false;
  var reduceTour = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setTourPos() {
    var el = byId("tourPos");
    if (el) el.textContent = (tourI + 1) + " / " + tour.length;
  }

  function pauseTour() {
    tourPaused = true;
    window.clearTimeout(tourTimer);
  }

  function scheduleTour() {
    window.clearTimeout(tourTimer);
    if (tourPaused || reduceTour) return;
    tourTimer = window.setTimeout(function () {
      tourI = (tourI + 1) % tour.length;
      gotoTab(tour[tourI]);
      scheduleTour();
    }, 9000);
  }

  function bindTour() {
    var guide = byId("demoGuide");
    if (!guide) return;
    guide.addEventListener("click", function () {
      pauseTour();
      tourI = (tourI + 1) % tour.length;
      gotoTab(tour[tourI]);
    });
  }

  setCaption("sprout");
  setTourPos();
  bindTour();
  setCountdown();
  renderPlant();

  var phone = document.getElementById("demoPhone");
  if (phone && "IntersectionObserver" in window) {
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (seen || !entry.isIntersecting) return;
        seen = true;
        playIntro();
        scheduleTour();
        io.disconnect();
      });
    }, { threshold: 0.35 });
    io.observe(phone);
  } else {
    playIntro();
    scheduleTour();
  }
})();
