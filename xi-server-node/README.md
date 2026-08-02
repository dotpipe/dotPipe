# xi-server-node (ELSN)

`gateway.php` is the public endpoint router. It reads the root `.xi`, maps `/health` to `/health/index.php`, applies allow/deny rules, checks `.xi-state.json`, and returns 404/503/endpoint responses. Keep endpoint directories shaped as `name/index.php`. Direct child-file access bypasses the gateway and must be blocked by the web-server configuration.

The router uses the shared `xi-xml.php` parser, so the constrained `.xi` format does not require PHP SimpleXML or another XML extension. If SimpleXML is unavailable, the fallback accepts only the expected safe XML structure and rejects doctypes, entities, malformed tags, and oversized files.

The included `.htaccess` blocks direct endpoint `index.php` access when Apache overrides are enabled. For Nginx, deny `/<endpoint>/index.php` and expose only `gateway.php` (or route the public endpoint location to it); the PHP built-in server does not enforce either web-server rule.

See [`../docs/ELSN-XI.md`](../docs/ELSN-XI.md) for XML rules, pause/resume state, and signed XI operations. `health/index.php` is the minimal endpoint example. `xi-server-node.elsn` is descriptive package metadata; it is not the router configuration.

The companion `xi-server.php` exposes the authenticated audit API: `manifest` lists configured audited programs, `audit` returns programs plus recent audit entries, and `read` returns allowed source as base64. A separate dashboard token can be read-only; HMAC editor keys remain server/operator credentials.
