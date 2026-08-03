# XI Control Panel

## What it is

XI is a browser-based background interface, not the enforcement server. `dashboard/index.html` loads `domPipe.js`, `dashboard/app.js`, and `xi-extension.js`; `styles.css` supplies the shell and light/dark theme.

## Control surfaces

- **API workspace**: create, edit, duplicate, delete, save, import, export, format JSON headers/body, send requests, and inspect body/headers/metadata.
- **Sync PHP APIs**: fetch `dashboard/xi-extension.php`, apply its safe `frontend.bodyTag`/CSS trace, and register its API definitions.
- **JSON/pages**: load a JSON file, preview it through `modala`, inspect nested `children`/`body`/`content`/`items`, and edit a selected node's tag, class, text, or inner HTML.
- **Attributes**: inspect managed elements and edit ID, class, text, inner HTML, and JSON attributes. Applying an attribute updates domPipe's legacy/data-* mirror.
- **Files**: load a site-relative file, save a browser-local draft, and stage a downloadable replacement. The separate file-editor page adds source/preview/HTML→JSON editing and server-local file operations.
- **Endpoints/audit/tiers/XI config**: display registry lifecycle flags, local audit events, descriptive tier policy, and local `.xi` draft fields.
- **XI console**: accepts the dashboard's local command vocabulary (`help`, `status`, `list`, `inspect`, `pause`, `resume`, `get`) and reports that it is a browser-side control surface unless connected to a server workflow.

`control-panel.php` is the current machine-readable tier metadata: it reports 300, 3000, and 30000 requests/minute for Shared Hosting, Managed VPS, and Dedicated. The static tier cards in `dashboard/index.html` still display the older 60, 600, and 6000 labels; reconcile those presentation strings before treating the cards as authoritative.

## Site and API scope

API definitions are scoped by the dashboard URL and persisted in local storage. Registered sites are also local browser data; selecting one navigates to its URL. The dashboard does not discover every server automatically. A site must be registered by URL.

The registry stores `id`, `name`, `method`, `url`, `headers`, `body`, `serverUrl`, `idempotencyKey`, and `source`. Bearer tokens are kept in session storage and excluded from export. A request may resolve a relative API URL against `serverUrl` and adds an idempotency key when absent.

## File editor behavior

`file-editor.html?file=landing/index.html` opens a new editor tab. Preview defaults to the full webpage. Clicking a section selects only that element's `innerHTML`; Source and HTML→JSON then edit that nest. Applying a change swaps the selected portion into the baseline document. Invalid HTML/JSON shows a warning and keeps the last known-good source. “Zip all files” creates a browser download; it does not upload the archive.

The PHP file endpoint is local-only. It allows editable text extensions, rejects hidden/parent paths and server files, sends deletes to `.xi-trash`, and records create/copy/move/delete operations in a 20-entry undo stack. Undo removes the newest selected stage; the trash view can restore deleted files.

## Data model for page JSON

The editor expects component objects compatible with `modala`, for example:

```json
{
  "tagname": "section",
  "id": "hero",
  "class": "markdown",
  "children": [
    {"tagname": "h1", "textContent": "Hello"}
  ]
}
```

The root control-panel tree is a crosshatch/map, not a second renderer: it follows keys named `children`, `body`, `content`, and `items`, then edits the selected object in place.
