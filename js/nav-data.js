/* ==========================================================================
   Navigation tree — single source of truth for sidebar + search index
   ========================================================================== */

const NAV_TREE = [
  {
    group: "Introduction",
    items: [
      { title: "AutoCheck Overview", href: "index.html", id: "overview" },
      { title: "Getting Started", href: "getting-started.html", id: "getting-started" },
      { title: "Architecture Overview", href: "architecture.html", id: "architecture" },
    ],
  },
  {
    group: "User Guide",
    items: [
      { title: "Configuration", href: "configuration.html", id: "configuration" },
      { title: "Language Support", href: "language-support.html", id: "language-support" },
      { title: "Checkpointing", href:"checkpoint-loop.html", id: "checkpoint-loop" },
      { title: "Resume Jobs", href:"resume-jobs.html", id: "resume-jobs" },
    ],
  },
  {
    group: "Features",
    items: [
      { title: "Snapshots", href: "snapshot.html", id: "snapshot" },
      { title: "Notifications", href: "notifications.html", id: "notifications"  },
      { title: "Utilities & Logging", href: "utilities.html", id: "utilities" },
    ],
  },
  {
    group: "Examples",
    items: [
      { title: "Python", href: "python.html", id: "python" },
      { title: "Java", href: "java.html", id: "java" },
      { title: "C", href: "c.html", id: "c" },
      { title: "C++", href: "cpp.html", id: "cpp" },
    ],
  },
  {
   group: "Reference",
   items: [
     { title: "FAQ",    href: "faq.html", id: "faq" },
     { title: "Limitations",   href: "limitations.html",  id: "limitations" },  // ← add this
     { title: "Glossary", href: "glossary.html", id: "glossary" },  ],
  },

];

// Flat ordered list for prev/next pagers
const NAV_FLAT = NAV_TREE.flatMap((g) => g.items);

function getAdjacentPages(currentId) {
  const idx = NAV_FLAT.findIndex((p) => p.id === currentId);
  return {
    prev: idx > 0 ? NAV_FLAT[idx - 1] : null,
    next: idx >= 0 && idx < NAV_FLAT.length - 1 ? NAV_FLAT[idx + 1] : null,
  };
}
