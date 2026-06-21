/* ==========================================================================
   App bootstrap — sidebar render, command palette, mobile nav, scroll-spy,
   copy-to-clipboard for code blocks.
   ========================================================================== */

(function () {
  "use strict";

  function currentPageId() {
    return document.body.getAttribute("data-page");
  }

  /* ---------------- Sidebar ---------------- */

  function renderSidebar() {
    const mount = document.getElementById("sidebar-nav");
    if (!mount) return;
    const activeId = currentPageId();

    const html = NAV_TREE.map((group) => {
      const items = group.items
        .map((item) => {
          const isActive = item.id === activeId;
          return `
            <li>
              <a class="nav-link${isActive ? " is-active" : ""}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
                <span class="tick"></span>
                <span>${item.title}</span>
              </a>
            </li>`;
        })
        .join("");
      return `
        <div class="nav-group">
          <div class="nav-group__label">${group.group}</div>
          <ul class="nav-list">${items}</ul>
        </div>`;
    }).join("");

    mount.innerHTML = html;

    const activeEl = mount.querySelector(".is-active");
    if (activeEl) {
      requestAnimationFrame(() => {
        activeEl.scrollIntoView({ block: "center" });
      });
    }
  }

  /* ---------------- Pager (prev/next) ---------------- */

  function renderPager() {
    const mount = document.getElementById("pager");
    if (!mount) return;
    const { prev, next } = getAdjacentPages(currentPageId());

    let html = "";
    if (prev) {
      html += `
        <a class="pager__link pager__link--prev" href="${prev.href}">
          <span class="pager__dir">← Previous</span>
          <span class="pager__title">${prev.title}</span>
        </a>`;
    } else {
      html += `<span></span>`;
    }
    if (next) {
      html += `
        <a class="pager__link pager__link--next" href="${next.href}">
          <span class="pager__dir">Next →</span>
          <span class="pager__title">${next.title}</span>
        </a>`;
    }
    mount.innerHTML = html;
  }

  /* ---------------- Right rail: on-this-page + scroll spy ---------------- */

  function renderRail() {
    const railList = document.getElementById("rail-list");
    if (!railList) return;
    const headings = document.querySelectorAll(".prose h2, .prose h3");
    if (!headings.length) {
      const railEl = document.querySelector(".rail");
      if (railEl) railEl.style.display = "none";
      return;
    }

    const links = [];
    headings.forEach((h) => {
      const isSub = h.tagName === "H3";
      links.push(
        `<li><a href="#${h.id}" class="${isSub ? "nested" : ""}" data-target="${h.id}">${h.textContent}</a></li>`
      );
    });
    railList.innerHTML = links.join("");

    const linkEls = Array.from(railList.querySelectorAll("a"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = railList.querySelector(`a[data-target="${entry.target.id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            linkEls.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  /* ---------------- Mobile nav toggle ---------------- */

  function setupMobileNav() {
    const shell = document.querySelector(".shell");
    const btn = document.getElementById("menu-btn");
    const scrim = document.getElementById("scrim");
    if (!shell || !btn) return;

    function close() { shell.classList.remove("nav-open"); }
    btn.addEventListener("click", () => shell.classList.toggle("nav-open"));
    if (scrim) scrim.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    document.getElementById("sidebar-nav")?.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });
  }

  /* ---------------- Command palette ---------------- */

  function setupPalette() {
    const overlay = document.getElementById("palette-overlay");
    const input = document.getElementById("palette-input");
    const results = document.getElementById("palette-results");
    const triggers = document.querySelectorAll("[data-open-search]");
    if (!overlay || !input || !results) return;

    let selectedIndex = -1;
    let currentResults = [];

    function open() {
      overlay.classList.add("is-open");
      input.value = "";
      renderResults("");
      setTimeout(() => input.focus(), 10);
    }

    function close() {
      overlay.classList.remove("is-open");
    }

    function renderResults(query) {
      currentResults = query ? searchIndex(query) : [];
      selectedIndex = currentResults.length ? 0 : -1;

      if (!query) {
        results.innerHTML = `<div class="palette__empty">Type to search the AutoCheck docs — pages, config keys, classes…</div>`;
        return;
      }
      if (!currentResults.length) {
        results.innerHTML = `<div class="palette__empty">No results for "${query}".</div>`;
        return;
      }

      results.innerHTML = currentResults
        .map((r, i) => `
          <div class="palette__item${i === selectedIndex ? " is-selected" : ""}" data-href="${r.href}" data-index="${i}">
            <div class="palette__item-title">${highlightMatch(r.title, query)}</div>
            <div class="palette__item-path">${r.path}</div>
            <div class="palette__item-snippet">${r.snippet}</div>
          </div>`)
        .join("");
    }

    function updateSelection() {
      results.querySelectorAll(".palette__item").forEach((el, i) => {
        el.classList.toggle("is-selected", i === selectedIndex);
      });
      const sel = results.querySelector(".is-selected");
      if (sel) sel.scrollIntoView({ block: "nearest" });
    }

    function navigateTo(href) {
      window.location.href = href;
    }

    triggers.forEach((t) => t.addEventListener("click", open));

    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k";
      if (cmdK) {
        e.preventDefault();
        overlay.classList.contains("is-open") ? close() : open();
        return;
      }
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        open();
      }
      if (!overlay.classList.contains("is-open")) return;

      if (e.key === "Escape") { close(); }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentResults.length) {
          selectedIndex = (selectedIndex + 1) % currentResults.length;
          updateSelection();
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentResults.length) {
          selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
          updateSelection();
        }
      }
      if (e.key === "Enter") {
        if (selectedIndex >= 0 && currentResults[selectedIndex]) {
          navigateTo(currentResults[selectedIndex].href);
        }
      }
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    input.addEventListener("input", () => renderResults(input.value));

    results.addEventListener("click", (e) => {
      const item = e.target.closest(".palette__item");
      if (item) navigateTo(item.getAttribute("data-href"));
    });
  }

  /* ---------------- Copy-to-clipboard for code blocks ---------------- */

  function setupCopyButtons() {
    document.querySelectorAll(".code-block__copy").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const block = btn.closest(".code-block");
        const codeEl = block.querySelector("pre code, pre");
        const text = codeEl ? codeEl.textContent : "";
        try {
          await navigator.clipboard.writeText(text);
          const original = btn.innerHTML;
          btn.classList.add("is-copied");
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied`;
          setTimeout(() => {
            btn.classList.remove("is-copied");
            btn.innerHTML = original;
          }, 1600);
        } catch (err) {
          /* clipboard unavailable — silently ignore */
        }
      });
    });
  }

  /* ---------------- Boot ---------------- */

  document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    renderPager();
    renderRail();
    setupMobileNav();
    setupPalette();
    setupCopyButtons();
  });
})();
