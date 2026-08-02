# Security and deployment notes

## Trust boundaries

- `domPipe.js` runs with the page's browser privileges. Do not put secrets in HTML, API JSON, `localStorage`, exported definitions, or page JSON.
- Dashboard data is local browser state, not authenticated server state.
- `dashboard/file-ops.php` intentionally accepts only loopback clients. Do not expose it through a public web server.
- XI secrets in `.xi.key.json` and `<keys>` values in `.xi` are credentials. Replace example values, keep them outside source control, and rotate them.
- `operatorEmail` belongs in `.xi`; it is used only for throttled invalid-token/re-pair alerts and should be protected with the rest of the server configuration.
- ELSN and XI are separate server surfaces. Put both behind HTTPS and an outer authentication/network boundary.

## Write policy

Keep `allowWrites=false` until the server is intentionally configured. Use a narrow `allow` whitelist and a broad defensive `deny` list for `.git`, `.xi`, `.env`, key files, logs, vendor internals, and state files. A deny match wins over an allow match.

Keep `allowBrowserWrites=false` unless the dashboard is an explicitly trusted operator surface. When enabled, only the paired HttpOnly session can write; the bootstrap token remains read-only and is consumed after pairing.

Browser writes also require the configured exact `dashboardOrigin`; wildcard origins are rejected when credentialed CORS is enabled. The file editor preview is sandboxed so edited HTML cannot directly share the dashboard document's origin.

The runtime also rejects `javascript:`/`vbscript:` resource URLs, blocks JSON-defined inline event-handler attributes, validates API headers and methods, caps the persisted API registry, and accepts window API-registry messages only from the page's configured origin. Relative and HTTP(S) resources remain supported.

Dashboard page publishing is local-only, POST-only, loopback-restricted, same-origin checked, size-limited, path-confined, and backed up into the twenty-stage undo history before replacement.

Remote terminal access must use the local OpenSSH adapter and agent. Private keys, passwords, and `known_hosts` stay on the dashboard computer. The adapter uses strict host-key checking, batch mode, per-site allow/deny policies, and no arbitrary shell text. Software installation requires both an explicitly allowed `install` operation and an exact `allowedPackages` entry; the broker constructs the package-manager command and never accepts package flags or shell fragments from the browser.

`.xi` parsing does not require SimpleXML. The fallback parser is intentionally limited to the project’s XML vocabulary, rejects doctypes/entities and malformed markup, and fails closed when parsing is ambiguous.

Change acknowledgements expose only a request ID, credential ID, and one-way token fingerprint. Raw HMAC secrets, bearer tokens, session values, and private keys are never returned in a change response or DOM event.

The dashboard SSH console talks only to the loopback broker on `127.0.0.1`. The broker requires a local token, exact dashboard-origin CORS, and a server-side SSH configuration. It does not expose an unrestricted terminal.

The dashboard can describe tier limits, but `dashboard/control-panel.php` is metadata and does not enforce quotas. Enforcement belongs in the server or hosting layer.

The site gzip SHA256 digest is content integrity evidence, not a secret. Authorization uses the short-lived HttpOnly exchange session; the digest is observed twice with the configured ten-minute spacing before it is marked trusted.

## Endpoint safety

Use `gateway.php` as the only public entry for ELSN endpoints. Verify the web-server rewrite before deployment. Test denied, paused, active, malformed-path, invalid-key, expired-signature, oversized-write, and write-disabled cases.

Do not use PHP’s built-in server as the production front end. Apache must have `AllowOverride` enabled for the supplied ELSN `.htaccess`; Nginx must explicitly deny direct `/<endpoint>/index.php` requests and route public endpoint requests through `gateway.php`.

The repository includes `docs/apache-xi-xi.conf.example` as a starting point for an Apache virtual host. Restrict the listener and `Require` scope to the intended deployment network before exposing it beyond localhost.

## Known demo limitations

The chat PHP endpoints store JSON session files under `addons/sessions`; they are examples, not a production authentication or messaging service. `crud.php` opens a MySQL PDO connection from a relative config path and should not be exposed without application authentication and prepared operational configuration. Several example pages intentionally use local/demo data and styles.
