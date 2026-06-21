/* ==========================================================================
   Search index — lightweight client-side fuzzy-ish search
   Each entry maps to a heading/section so results can deep-link.
   ========================================================================== */

const SEARCH_INDEX = [
  { title: "AutoCheck Overview", path: "Introduction", href: "index.html", snippet: "Automated checkpointing system for ML training and long-running HPC jobs." },
  { title: "Core Design Philosophy", path: "Introduction / Overview", href: "index.html#design-philosophy", snippet: "Zero code modification, sidecar execution model, framework agnostic." },
  { title: "Zero Code Modification", path: "Introduction / Overview", href: "index.html#design-philosophy", snippet: "Users never import AutoCheck or call save functions inside training loops." },
  { title: "Sidecar Execution Model", path: "Introduction / Overview", href: "index.html#design-philosophy", snippet: "AutonomousController runs in the main thread while the user script runs in a daemon thread." },
  { title: "Getting Started", path: "Introduction", href: "getting-started.html", snippet: "Installation, configuration, and running your first automated checkpointing job." },
  { title: "Installation", path: "Getting Started", href: "getting-started.html#installation", snippet: "pip install torch pyyaml — clone the repository and install requirements." },
  { title: "Requirements", path: "Getting Started", href: "getting-started.html#requirements", snippet: "Python 3.8+, PyTorch or TensorFlow, PyYAML." },
  { title: "Architecture Overview", path: "Introduction", href: "architecture.html", snippet: "Threading model, sidecar execution pattern, ML vs HPC mode differences." },
  { title: "Supervision Chain", path: "Architecture Overview", href: "architecture.html#supervision-chain", snippet: "Entry point to low-level state capture, component interaction diagram." },
  { title: "CLI & Orchestration Layer", path: "CLI & Orchestration", href: "cli-orchestration.html", snippet: "Handles run, stop, resume commands and prepares the execution environment." },
  { title: "CLI Reference (autocheck command)", path: "CLI & Orchestration", href: "cli-reference.html", snippet: "Full reference for the autocheck command-line interface and flags." },
  { title: "autocheck run", path: "CLI Reference", href: "cli-reference.html#run", snippet: "Starts a new supervised job using a configuration file." },
  { title: "autocheck resume", path: "CLI Reference", href: "cli-reference.html#resume", snippet: "Detects the latest checkpoint and resumes training from the last saved state." },
  { title: "RunnerScript Orchestrator", path: "CLI & Orchestration", href: "runnerscript.html", snippet: "Bootstraps the environment and the user's training script." },
  { title: "Controller and Execution Engine", path: "Controller & Execution", href: "controller.html", snippet: "AutonomousController manages the checkpoint loop and graceful shutdowns." },
  { title: "Checkpoint Loop and Trigger Logic", path: "Controller & Execution", href: "checkpoint-loop.html", snippet: "Time-based and step-based trigger policies for saving checkpoints." },
  { title: "Signal Handling and PID Management", path: "Controller & Execution", href: "signal-handling.html", snippet: "Intercepts SIGUSR1 and SIGTERM signals for HPC scheduler safety." },
  { title: "Configuration System", path: "Configuration", href: "configuration.html", snippet: "All checkpointing behavior controlled through a single config.yaml file." },
  { title: "ConfigManager Internals", path: "Configuration", href: "config-manager.html", snippet: "Loads and parses the YAML configuration file, exposes typed accessors." },
  { title: "Configuration Schema Reference", path: "Configuration", href: "config-schema.html", snippet: "Full reference of checkpointing and training keys: interval_minutes, storage_path, framework." },
  { title: "interval_minutes", path: "Configuration Schema", href: "config-schema.html#checkpointing", snippet: "Save a checkpoint every N minutes." },
  { title: "session_time_limit", path: "Configuration Schema", href: "config-schema.html#checkpointing", snippet: "Stop and save after N minutes to respect HPC job time limits." },
  { title: "State Tracking", path: "State Tracking", href: "state-tracking.html", snippet: "Maintains the current ground truth of the running job." },
  { title: "MLStateTracker", path: "State Tracking", href: "ml-state-tracker.html", snippet: "Tracks epoch, batch, loss, and accuracy for ML training jobs." },
  { title: "HPCStateTracker", path: "State Tracking", href: "hpc-state-tracker.html", snippet: "Tracks elapsed wall-clock time and job phase for HPC simulation jobs." },
  { title: "Provider and Layers", path: "Provider & Layers", href: "provider-layers.html", snippet: "TraceLayer for non-invasive inspection and SignalLayer for scheduler signals." },
  { title: "TraceLayer", path: "Provider & Layers", href: "trace-layer.html", snippet: "Uses sys.settrace to inspect user locals without modifying source code." },
  { title: "SignalLayer", path: "Provider & Layers", href: "signal-layer.html", snippet: "Intercepts OS signals such as SIGUSR1 and SIGTERM for HPC safety." },
  { title: "Checkpoint Managers", path: "Checkpoint Managers", href: "checkpoint-managers.html", snippet: "Framework-specific implementations that handle atomic file I/O." },
  { title: "PyTorchCheckpointManager", path: "Checkpoint Managers", href: "pytorch-manager.html", snippet: "Saves model weights, optimizer state, and scheduler state for PyTorch." },
  { title: "KerasCheckpointManager", path: "Checkpoint Managers", href: "keras-manager.html", snippet: "Saves model weights and training metadata for Keras / TensorFlow." },
  { title: "SKLearnCheckpointManager", path: "Checkpoint Managers", href: "keras-manager.html#sklearn", snippet: "Generic checkpoint manager for Scikit-Learn and framework-agnostic objects." },
  { title: "Notification Service", path: "Reference", href: "notifications.html", snippet: "Sends events when checkpoints are saved, jobs fail, or jobs complete." },
  { title: "Notification Configuration and Events", path: "Reference", href: "notifications.html#events", snippet: "Configurable event hooks: on_save, on_resume, on_failure." },
  { title: "Logging Infrastructure", path: "Reference", href: "utilities.html", snippet: "Structured logging utilities used throughout the controller and layers." },
  { title: "Enumerations and Custom Exceptions", path: "Reference", href: "utilities.html#exceptions", snippet: "JobState enum and custom exception types for checkpoint failures." },
  { title: "Testing Phase Examples", path: "Reference", href: "testing-examples.html", snippet: "ML training examples and HPC simulation examples used during validation." },
  { title: "Glossary", path: "Reference", href: "glossary.html", snippet: "Definitions for checkpoint, sidecar, state tracker, and other core terms." },
];

function searchIndex(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_INDEX
    .map((entry) => {
      const titleMatch = entry.title.toLowerCase().includes(q);
      const snippetMatch = entry.snippet.toLowerCase().includes(q);
      const pathMatch = entry.path.toLowerCase().includes(q);
      let score = 0;
      if (titleMatch) score += entry.title.toLowerCase().startsWith(q) ? 10 : 5;
      if (snippetMatch) score += 2;
      if (pathMatch) score += 1;
      return { ...entry, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    "<mark>" + text.slice(idx, idx + query.length) + "</mark>" +
    text.slice(idx + query.length)
  );
}
