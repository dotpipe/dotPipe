# dashboard — XI XI Control Panel

## Entry points

- `index.html`: control panel shell and all control views.
- `app.js`: local API/site/audit state, request editor, JSON/page views, extension sync, and control handlers.
- `xi-extension.js`: fetches an extension manifest and applies safe body data attributes/CSS.
- `xi-extension.php`: example background-PHP manifest with two API definitions and frontend trace metadata.
- `control-panel.php`: JSON metadata for surfaces, normalized statuses, and descriptive service tiers.
- `file-editor.html` / `file-editor.js`: separate-tab source, preview, HTML→JSON, and file-operation editor.
- `file-ops.php`: loopback-only create/copy/move/delete/undo/trash endpoint.
- `sample-page.json`: page component payload used by the JSON workspace.
- `styles.css`: themed control-panel and editor presentation.

## Storage and authority

API definitions, registered sites, local audit entries, XI drafts, and file drafts are browser storage. Remote bootstrap tokens are entered for one pairing request only and are not persisted by the dashboard. None of these controls enforce a remote server policy; use XI/ELSN for server-side writes and endpoint lifecycle.

## Remote audited source

The XI config view accepts an XI server URL and a separate read-only dashboard token. `Connect / audit` calls `action=manifest` and renders the server's configured audited programs. Selecting a listed file or entering a remote path calls authenticated `action=read`, decodes the base64 source response, and loads it into the dashboard source editor. The browser never receives the HMAC editor secret and the bootstrap token is not persisted. Configure `dashboardOrigin` on the server for cross-origin use.

The file editor's `Preview` tab keeps the complete page visible. Clicking a section loads only that section's innerHTML into the Source and HTML → JSON editors. `Publish live site` writes the resulting full page through the local protected file-operation endpoint and records a reversible history stage; refresh the separate site tab to verify the published page.

Site registration accepts only HTTP(S) URLs. Same-origin paths are checked before they are stored, and unreachable paths are rejected with a visible message while the dashboard remains usable. File previews inject a path-relative `<base>` so stylesheets and other relative assets resolve from the selected site's directory.

Clicking a registered site probes loopback URLs first and opens reachable sites in a new tab. The dashboard stays open; unreachable local sites produce an in-dashboard error instead of navigating to a dead page.

The SSH console connects only to profiles exposed by the local XI XI SSH broker. Start it beside the dashboard with `npm run ssh-broker`; it listens on loopback `127.0.0.1:8790` and prints a one-time local token. Enter that token in the SSH console, press **Test broker**, and the registered site list is loaded into the dashboard. The broker keeps keys and host verification on the dashboard computer. Each profile has `allow`, `deny`, `allowedPackages`, and `packageManager` policy; deny rules win, and installs require both the `install` operation and an exact package allowlist entry. The browser can never submit arbitrary shell text.

For remote JSON pages, load the JSON through the audited source controls, edit the complete document in the JSON workspace, and use `Publish JSON patch`. The dashboard creates a constrained `add`/`replace`/`remove` patch. XI receives the full document, patch, and base hash; it rejects stale or mismatched edits and atomically publishes only after the patch reproduces the submitted document.

After the first valid token exchange, the server replaces the token with an HttpOnly session cookie; the dashboard clears the bootstrap token. The server's `siteDigest` is displayed as a two-observation integrity assertion, not used as a bearer credential.

## File editor

Open `file-editor.html?file=landing/index.html`. Preview starts as the full page. Clicking a container selects only its inner HTML for Source and HTML→JSON editing. Invalid changes restore the last-good source and display a warning. File operations are local-only and keep up to 20 undo stages in `.xi-trash`.
