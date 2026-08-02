# Validation

## Automated check

Run `npm test`. `scripts/validate.mjs` recursively checks `.js` syntax with `node --check` and verifies relative `src`, `href`, and `action` references in `.html` and `.php` files. It skips `.git` and `node_modules`.

## PHP checks

The repository has no PHP test runner. Use PHP lint for changed PHP files:

```powershell
php -l endpoint.php
php -l xi-server.php
php -l xi-server-node/gateway.php
php -l dashboard/file-ops.php
```

Then run the PHP server and request the dashboard, XI XI demo, API endpoints, and ELSN routes. A `200` page response proves routing only; it does not prove every interactive control.

## Manual coverage still required

Browser automation should exercise theme switching, API save/send/import/export, extension sync, page JSON load/preview, nested JSON editing, file create/copy/move/delete/undo/trash, and the XI/paused/denied response states. Verify XI with a real trusted key and HTTPS before using it outside loopback.

The validator does not inspect `ajax`, `xi`, CSS `url()`, PHP includes, database availability, remote URLs, or generated runtime DOM. Those require endpoint/browser tests.
