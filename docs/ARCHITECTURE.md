# Architecture

## Layers

1. **domPipe runtime (`domPipe.js`)** runs in a browser. It normalizes attributes, assigns IDs to active elements, initializes components, executes inline macros, renders JSON, and manages the live API registry.
2. **XI XI (`dashboard/`)** is an operator-facing browser interface. It edits API definitions and page JSON locally, sends requests, syncs `dashboard/xi-extension.php`, and opens source files in a separate editor page.
3. **XI XI CLI (`xi.mjs`)** is an optional Node CLI. It signs status, list, read, write, log, pause, and resume requests to `xi-server.php`.

On Linux, `xi install` provisions a user-level systemd service and timer that runs authenticated audits. The connection is outbound from the managed computer to the configured control/API server. Live changes travel through the signed API and JSON Patch path; the remote server never gets arbitrary shell access to the computer running `xi`.
4. **ELSN (`xi-server-node/gateway.php`)** is a PHP endpoint router. It maps a named directory to its `index.php`, applies XML allow/deny rules, reads pause state, and returns normalized errors.
5. **Examples** are isolated pages/endpoints that exercise the runtime. They are not one application and do not share a database.

## Browser request flow

`domPipe.js` loads first, then synchronizes attributes and IDs. `domContentLoad()` processes custom tags and `inline` elements. A normal API request can come from a `pipe`, `ajax` handler, `modala`, a timer/refresh component, or `domPipe.requestApi()`. JSON component responses are rendered by `modala()`; ordinary text is inserted into the selected target.

The API registry lives in `localStorage` under `domPipe.api-workspace.v1`. `domPipe.registerApis`, `replaceApi`, `removeApi`, and `requestApi` are the programmatic surface. The `domPipe.xi` facade adds inspection, subscriptions, `MessagePort` bridging, and window-message replacement.

## Server request flow

XI builds a canonical string from action, remote path, timestamp, and body, then sends an HMAC-SHA256 signature. `xi-server.php` validates the trusted key and clock window before resolving a confined path and applying allow/deny rules. ELSN is separate: it handles public endpoint dispatch and pause state; it does not implement the XI editing protocol.

## Persistence

- API definitions: browser `localStorage`, scoped by dashboard site URL.
- API tokens: browser `sessionStorage` only.
- Dashboard audit events: browser `localStorage`.
- XI pause state: `.xi-state.json`.
- XI write audit: configured audit log.
- Dashboard file undo/trash: local `.xi-trash/history.json`, capped at 20 stages and ignored by Git.

## Boundary to remember

The dashboard's labels are policy/UI descriptions; the PHP server is the enforcement point. A browser-local “paused” API flag does not pause a remote endpoint. Use XI/ELSN for server lifecycle changes.
