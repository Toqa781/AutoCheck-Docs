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
    group: "CLI & Orchestration",
    items: [
      { title: "CLI & Orchestration Layer", href: "cli-orchestration.html", id: "cli-orchestration" },
      { title: "CLI Reference", href: "cli-reference.html", id: "cli-reference" },
      { title: "RunnerScript Orchestrator", href: "runnerscript.html", id: "runnerscript" },
    ],
  },
  {
    group: "Controller & Execution",
    items: [
      { title: "Controller & Execution Engine", href: "controller.html", id: "controller" },
      { title: "Checkpoint Loop & Triggers", href: "checkpoint-loop.html", id: "checkpoint-loop" },
      { title: "Signal Handling & PID", href: "signal-handling.html", id: "signal-handling" },
    ],
  },
  {
    group: "Configuration",
    items: [
      { title: "Configuration System", href: "configuration.html", id: "configuration" },
      { title: "ConfigManager Internals", href: "config-manager.html", id: "config-manager" },
      { title: "Configuration Schema", href: "config-schema.html", id: "config-schema" },
    ],
  },
  {
    group: "State Tracking",
    items: [
      { title: "State Tracking", href: "state-tracking.html", id: "state-tracking" },
      { title: "MLStateTracker", href: "ml-state-tracker.html", id: "ml-state-tracker" },
      { title: "HPCStateTracker", href: "hpc-state-tracker.html", id: "hpc-state-tracker" },
    ],
  },
  {
    group: "Provider & Layers",
    items: [
      { title: "Provider & Layers", href: "provider-layers.html", id: "provider-layers" },
      { title: "TraceLayer", href: "trace-layer.html", id: "trace-layer" },
      { title: "SignalLayer", href: "signal-layer.html", id: "signal-layer" },
    ],
  },
  {
    group: "Checkpoint Managers",
    items: [
      { title: "Checkpoint Managers", href: "checkpoint-managers.html", id: "checkpoint-managers" },
      { title: "PyTorchCheckpointManager", href: "pytorch-manager.html", id: "pytorch-manager" },
      { title: "KerasCheckpointManager", href: "keras-manager.html", id: "keras-manager" },
    ],
  },
  {
    group: "Reference",
    items: [
      { title: "Notification Service", href: "notifications.html", id: "notifications" },
      { title: "Utilities & Logging", href: "utilities.html", id: "utilities" },
      { title: "Testing Phase Examples", href: "testing-examples.html", id: "testing-examples" },
      { title: "Glossary", href: "glossary.html", id: "glossary" },
    ],
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
