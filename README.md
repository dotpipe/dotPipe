# domPipe / XI

domPipe is a dependency-light browser runtime for declarative HTML behavior. It scans custom elements and framework attributes, fetches HTML/JSON, renders JSON component trees, runs inline macros, and provides higher-level components such as carts, tabs, columns, refreshers, CSV views, login forms, and carousels.

This repository also contains XI: a local/operator control plane for API definitions and JSON pages; the `xi` signed Node CLI; and XI Server Node (ELSN), a small PHP gateway that exposes only configured endpoint directories.

## Start here

```powershell
npm test
php -S 127.0.0.1:8787 -t .
```

Then open:

- `http://127.0.0.1:8787/dashboard/` — XI Control Panel.
- `http://127.0.0.1:8787/xi-demo/` — configured polling site.
- `http://127.0.0.1:8787/landing/` — domPipe showcase page.

PHP is required for the PHP endpoints and demos. Node.js is required only for `npm test` and the optional XI CLI; the browser runtime itself has no Node.js dependency.

## Documentation map

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime and control-plane boundaries.
- [`docs/DOMPIPE-RUNTIME.md`](docs/DOMPIPE-RUNTIME.md) — lifecycle, public APIs, attributes, tags, macros, Markdown, and listeners.
- [`docs/XI-XI.md`](docs/XI-XI.md) — dashboard behavior, API registry, JSON/page editor, file editor, and site registry.
- [`docs/ELSN-XI.md`](docs/ELSN-XI.md) — signed server protocol, XML `.xi` rules, endpoint status, and CLI commands.
- [`docs/SECURITY.md`](docs/SECURITY.md) — trust boundaries, write controls, secrets, and deployment cautions.
- [`docs/EXAMPLES.md`](docs/EXAMPLES.md) — verified purpose and entry point for each example directory.
- [`docs/VALIDATION.md`](docs/VALIDATION.md) — checks that exist today and their limits.

Each runnable directory has a local `README.md` with its entry points, data files, and observed behavior.

## Package and runtime

`package.json` names the package `xi`, exposes `domPipe.js` as its main file, and maps the `xi` executable to `xi.mjs`. `xi-core.mjs` contains the signed server-editing implementation.

On Linux, run `xi install` from a configured project directory to create and enable the user-level XI XI audit timer. It validates `.xi.json` and `.xi.key.json` first, writes no secrets into the unit file, and requires `--force` before replacing existing units.

For a fuller Debian/Ubuntu or WSL setup, review [`docs/INSTALL.md`](docs/INSTALL.md) and run `sudo bash ./install.sh`. It installs and configures a loopback-only Apache/PHP runtime, generates local credentials, and leaves the audit timer as an explicit operator-user opt-in.

```powershell
npm test
```

That validator checks JavaScript syntax and local `src`, `href`, and `action` document references. It does not execute every browser interaction or PHP route.

## Important contracts

- Existing domPipe attributes remain supported. The runtime mirrors every recognized attribute to its `data-*` spelling and accepts data-only spelling on active domPipe elements. The normalized programming surface is `domPipe.xi.attributes`; `getDataAttributes()` lists normalized names.
- Active custom tags and `inline` elements require unique IDs. Missing or duplicate IDs are repaired with a generated `domPipe-<tag>-<number>` ID and a console warning.
- `.listen` containers receive `domPipe:listen` events for initial registration, DOM mutation, and XI replacement.
- The API registry is browser-local (`localStorage`) and hot-swappable. API replacement emits `domPipe:api-registry-updated`; session tokens are kept in `sessionStorage` and are not exported.
- ELSN denies a route with `404`, reports an allowed paused route with `503`, and executes an allowed active endpoint normally. The gateway must be the route entry point; direct access to endpoint `index.php` files bypasses lifecycle checks.
- XI browser pairing uses a one-time dashboard token only to establish a short-lived HttpOnly exchange session. Invalid credentials alert the `operatorEmail` configured in `.xi`. The returned site SHA256 gzip digest is integrity evidence and requires two ten-minute-spaced observations before being trusted; it is not used as the secret.
- The native remote-console path is OpenSSH-based and platform-neutral: Windows, Linux, and macOS use their local `ssh-agent`, private key, and `known_hosts`. The browser never receives SSH credentials; see [`tools/README.md`](tools/README.md).

## Naming and scope

The source package is named `domPipe`; the GitHub repository is [`dompipe/xi`](https://github.com/dompipe/xi). Local `.xi-trash` state and XI secrets are development state, not distributable configuration.

## License and provenance

`package.json` declares MIT. The root README previously contained donation addresses; those are intentionally not repeated in the technical documentation.
