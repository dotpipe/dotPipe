# XI Server Node and XI

## ELSN routing

`xi-server-node/gateway.php` is a PHP gateway. A request names an endpoint directory; the gateway removes a trailing `/index.php`, resolves the directory beneath the configured root, loads inherited/child `.xi` rules, and requires the configured entry file (normally `index.php`). Each endpoint is therefore a directory with an `index.php`.

Responses are deliberately normalized:

- denied or missing endpoint: `404` with code `not_found`;
- allowed endpoint in `.xi-state.json`: `503` with code `endpoint_paused` and `Retry-After: 30`;
- allowed active endpoint: the endpoint's response, normally `200`;
- invalid server configuration: `500` with code `configuration_error`.

The web server must route endpoint URLs to `gateway.php`. Directly serving a child `index.php` bypasses ELSN policy.

## `.xi` XML

Start with `.xi.example`. The root element may be `<xi>` or a compatibility `<server>` child. Attributes are `root`, `auditLog`, `endpointEntry`, `allowWrites`, `maxBytes`, and `clockSkewSeconds`. Child elements are:

```xml
<keys><key id="editor-1">secret</key></keys>
<allow>"**/index.php" "dashboard/*.json"</allow>
<deny>".git**" ".xi" "*.env"</deny>
```

The server parser also accepts one `<pattern>` per rule. `allow` is required; `deny` overrides it. `*` stays within one path segment and `**` crosses directories. A child `.xi` can override allow/deny and selected limits for its directory; the root identity and key trust still belong to the root configuration.

## XI server protocol

`xi-server.php` accepts `status`, `manifest`, `audit`, `list`, `read`, `write`, `patch`, `log`, `pause`, and `resume`. The `xi` CLI sends `X-XI-Key-Id`, `X-XI-Timestamp`, `X-XI-Signature`, and an idempotency key. The signature is HMAC-SHA256 over:

```text
action\n/path\ntimestamp\nrequest-body
```

Paths are normalized and parent traversal is rejected. Reads and writes are limited by the allowlist and root. Writes also require `allowWrites=true` and stay below `maxBytes`.

## Dashboard audit API

The XML `<audit>` section names programs and their source files. `action=manifest` returns the installed server capabilities and audited program list; `action=audit` returns the same program list plus the last audit-log entries. A `<dashboardTokens>` token enables browser dashboard access to `status`, `manifest`, `audit`, `list`, and `read` only. It cannot write, pause, or resume. Set `dashboardOrigin` to the exact dashboard origin for CORS and use a separate read-only token; never reuse the HMAC editor secret.

The dashboard can call `read` with `Authorization: Bearer <dashboard-token>`, decode the returned base64 source, and place it in its source editor. This is the true remote source path; the dashboard's old “Stage for XI” download remains a local fallback.

If `allowBrowserWrites="true"` is explicitly enabled, the paired HttpOnly session may also `PUT action=write` or `PUT action=patch`. A successful browser write rotates the session cookie and produces a new site digest. The installer leaves this disabled by default.

`action=patch` is restricted to JSON files. Its request body must contain `baseHash`, the complete resulting `document`, and an RFC 6902-style `patch` containing only `add`, `replace`, and `remove` operations. The server hashes the canonical current JSON, rejects stale bases with `409 json_conflict`, applies the patch, verifies that the resulting document exactly matches the submitted full document, and atomically replaces the file. This lets the dashboard update only the changed nested data while retaining a complete auditable document for recovery.

Successful `write` and `patch` responses include a `changeReceipt` and `X-XI-XI-Change: applied` acknowledgement. The receipt contains a request ID, action, path, timestamp, credential ID when applicable, and a one-way token fingerprint. It never returns the usable secret token. The dashboard emits the same receipt as `domPipe:change-ack`.

After the first valid bearer exchange, the server consumes that bootstrap token and trades it for a short-lived HttpOnly `xi_xi_session` cookie. Reusing the consumed token is rejected and alerts the operator. Invalid bearer tokens, expired exchange sessions, and bad HMAC credentials notify the `operatorEmail` configured in `.xi` through PHP's `mail()` transport, throttled to one alert per ten minutes. Re-pairing requires supervised replacement of the configured bootstrap token.

The server returns `siteDigest`, the SHA256 of a deterministic gzip snapshot excluding `.xi-trash`, `.git`, state JSON, and logs. It records observations and requires two observations at least `tokenAssertionIntervalSeconds` apart (default 600 seconds) before reporting the digest as trusted. The digest is integrity evidence, not an authentication secret.

## CLI

Create local, untracked configuration from the examples:

```powershell
Copy-Item .xi.json.example .xi.json
Copy-Item .xi.key.json.example .xi.key.json
npm link
xi status
xi list /dashboard
xi get /dashboard/sample-page.json sample-page.json
xi -e /dashboard/sample-page.json sample-page.json
xi diff /dashboard/sample-page.json sample-page.json
xi pause /health
xi resume /health
  xi log
  xi install --interval=5m
  xi uninstall
```

For a target webserver, copy `xi-server.php` and this repository's source to the target, then run the CLI-only installer from the target document root:

```powershell
php xi-install.php --root=. --origin=https://xi.example
```

It creates `.xi` with separate HMAC and read-only dashboard credentials, audited `domPipe`/XI XI program entries, allow/deny rules, and writes disabled. The generated credentials are printed once; store them securely. The installer applies mode `0600` on systems that support POSIX permissions and refuses to overwrite an existing `.xi` unless `--force` is supplied.

The CLI command is `xi`; its documented config remains `.xi.json` plus `.xi.key.json`. The server accepts `.xi`; the old `.xi-server.json` format remains only as a compatibility fallback for `xi-server.php`.

On Linux, `xi install` validates the local configuration and creates a user-level `xi-xi-audit.service` plus `xi-xi-audit.timer` under `~/.config/systemd/user/`. The timer runs `xi audit` after boot and at the configured interval, enables persistence across reboots, and does not require root. Existing unit files are never overwritten unless `--force` is supplied. The audited server communicates with `xi` through its signed HTTPS API; it does not receive an inbound shell connection.
