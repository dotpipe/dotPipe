# System Flow & Lifecycle

1. On DOMContentLoaded → `domContentLoad()` initializes custom tags.
2. `dotPipe.register()` scans elements with inline macros.
3. Inline macros parsed → `runInline(id)` executes pipelines.
4. Shells are handled by `runShellOpen`, `runShellClose`, `runShell`.
5. AJAX handled by `pipes()` and `modala()` functions.
