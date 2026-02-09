/**
 * Link metadata enhancements:
 * - Ensure every <a> has a reasonable `title` attribute (helps some SEO tools' "Title Missing" checks).
 * - Ensure external new-tab links include rel="noopener noreferrer".
 *
 * Note: `title` is not required for SEO, but adding it can reduce noisy audit warnings.
 */
(function () {
  function normalizeText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function getLinkLabel(a) {
    const aria = normalizeText(a.getAttribute("aria-label"));
    if (aria) return aria;

    const text = normalizeText(a.textContent);
    if (text) return text;

    const img = a.querySelector("img[alt]");
    if (img) {
      const alt = normalizeText(img.getAttribute("alt"));
      if (alt) return alt;
    }

    return "";
  }

  function ensureTitleAndRel() {
    const links = document.querySelectorAll("a[href]");

    for (const a of links) {
      // Add title if missing. Prefer a human label; fall back to href when truly empty.
      if (!a.hasAttribute("title")) {
        const label = getLinkLabel(a);
        const href = normalizeText(a.getAttribute("href"));
        const title = label || (href && href !== "#" ? href : "");
        if (title) a.setAttribute("title", title);
      }

      // Security for links opened in a new tab/window.
      if ((a.getAttribute("target") || "").toLowerCase() === "_blank") {
        const rel = new Set(
          normalizeText(a.getAttribute("rel"))
            .split(" ")
            .filter(Boolean)
        );
        rel.add("noopener");
        rel.add("noreferrer");
        a.setAttribute("rel", Array.from(rel).join(" "));
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureTitleAndRel, { once: true });
  } else {
    ensureTitleAndRel();
  }
})();

