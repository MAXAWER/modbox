/* ===========================================================================
   ModBox — one script for every page on the site.

   Two switches and nothing else. There is no router: /privacy, /terms and
   /support are real addresses serving real documents, because a Store
   reviewer opens the privacy URL directly and a fragment on a single page is
   not an answer to that. What makes it one site is the shared shell, not a
   shared bundle of history entries.
   =========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;

  /* ------------------------------------------------------------ language */

  function clean(value) {
    if (!value) { return null; }
    value = String(value).toLowerCase();
    if (value.indexOf("ru") === 0) { return "ru"; }
    if (value.indexOf("en") === 0) { return "en"; }
    return null;
  }

  var langButtons = document.querySelectorAll("[data-switch='lang'] button");

  function setLang(lang, remember) {
    body.setAttribute("data-active", lang);

    // Not decoration: it is what a screen reader pronounces with, and what
    // stops the browser offering to translate a page already in the reader's
    // language.
    root.setAttribute("lang", lang);

    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].setAttribute(
        "aria-pressed", String(langButtons[i].getAttribute("data-set-lang") === lang));
    }

    // The tab, the history entry and the bookmark are all named by <title>,
    // so a page reading English announced itself in Russian everywhere
    // outside its own body until this existed.
    var titled = document.querySelector("title");
    if (titled && titled.getAttribute("data-" + lang)) {
      document.title = titled.getAttribute("data-" + lang);
    }

    // Every link that stays on this site carries the choice with it, so the
    // language survives moving between the documents.
    var links = document.querySelectorAll("a[data-keep-lang]");
    for (var k = 0; k < links.length; k++) {
      var base = links[k].getAttribute("data-href") || links[k].getAttribute("href");
      if (!links[k].getAttribute("data-href")) { links[k].setAttribute("data-href", base); }
      links[k].setAttribute("href", base + (base.indexOf("?") < 0 ? "?" : "&") + "lang=" + lang);
    }

    if (remember) {
      try { localStorage.setItem("modbox-lang", lang); } catch (e) { /* private mode */ }
    }
  }

  // ?lang=en wins over both the remembered choice and the browser's own
  // language. ModBox appends it to say which language its window is in, and
  // that is not a guess: somebody reading English software should not be
  // handed a Russian policy because their browser is Russian. A visitor from
  // a search engine sends no parameter and keeps the old behaviour exactly.
  function asked() {
    var query = null;
    try {
      query = new URLSearchParams(window.location.search).get("lang");
    } catch (e) {
      var m = /[?&]lang=([^&]*)/.exec(window.location.search || "");
      query = m ? decodeURIComponent(m[1]) : null;
    }
    return clean(query) || clean((window.location.hash || "").replace(/^#/, ""));
  }

  for (var i = 0; i < langButtons.length; i++) {
    langButtons[i].addEventListener("click", function () {
      setLang(this.getAttribute("data-set-lang"), true);
    });
  }

  var wanted = asked();
  if (wanted) {
    // Remembered, so the site and the application stop disagreeing after one
    // visit rather than on every visit.
    setLang(wanted, true);
  } else {
    var saved = null;
    try { saved = localStorage.getItem("modbox-lang"); } catch (e) { /* ignore */ }
    // Deliberately not remembered. Writing down a guess about the browser
    // would freeze that guess for ever, including for a reader who never
    // pressed either button.
    setLang(clean(saved) || clean(navigator.language) || "en", false);
  }

  /* --------------------------------------------------------------- theme */

  var themeButtons = document.querySelectorAll("[data-switch='theme'] button");

  function setTheme(choice, remember) {
    if (choice === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", choice);
    }
    for (var i = 0; i < themeButtons.length; i++) {
      themeButtons[i].setAttribute(
        "aria-pressed", String(themeButtons[i].getAttribute("data-theme") === choice));
    }
    if (remember) {
      try { localStorage.setItem("modbox-theme", choice); } catch (e) { /* ignore */ }
    }
  }

  for (var t = 0; t < themeButtons.length; t++) {
    themeButtons[t].addEventListener("click", function () {
      setTheme(this.getAttribute("data-theme"), true);
    });
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem("modbox-theme"); } catch (e) { /* ignore */ }
  setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "auto", false);
})();
