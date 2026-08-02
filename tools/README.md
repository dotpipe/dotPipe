# Local XI XI tools

`xi-xi-ssh.mjs` is the platform-neutral local SSH adapter for the XI XI remote console. It uses the native OpenSSH client on Windows, Linux, and macOS; it does not store passwords or private keys and does not expose them to the browser.

Copy `.xi-xi-ssh.example.json` to `.xi-xi-ssh.json` and replace the host, user, and key paths. Keep the real file out of version control. Use `ssh-add` with the local `ssh-agent` before connecting.

Supported safe commands:

```text
node tools/xi-xi-ssh.mjs status
node tools/xi-xi-ssh.mjs list
node tools/xi-xi-ssh.mjs get /path/to/file
```

The adapter requires strict host-key verification and `BatchMode=yes`. It intentionally does not accept arbitrary remote shell text. The dashboard can call this helper through a separately installed local broker without receiving SSH credentials.

## Dashboard integration

Start the local broker from the project directory:

```text
npm run ssh-broker
```

It listens only on `127.0.0.1:8790`, creates `.xi-xi-local-token` on first run, and prints the token once for entry into the Dashboard → SSH console modal. The token is not stored by the browser. The broker exposes only policy-approved operations.

Use `config.sites` in `.xi-xi-ssh.json` to register each managed computer. Every site has an independent policy:

```json
{
  "sites": [{
    "id": "production-linux",
    "name": "Production Linux",
    "host": "server.example.com",
    "user": "operator",
    "identityFile": "~/.ssh/id_ed25519",
    "knownHostsFile": "~/.ssh/known_hosts",
    "allow": ["status", "list", "get", "install"],
    "deny": ["shell", "sudo", "rm", "delete", "reboot", "shutdown"],
    "allowedPackages": ["jq"],
    "packageManager": "apt"
  }]
}
```

The allowlist is required for every operation and the denylist wins. Software installation is disabled unless `install` is in `allow` and the exact package name is in `allowedPackages`; the broker constructs the package-manager command itself. No arbitrary command, package flag, shell fragment, or `sudo` text is accepted from the dashboard. Supported package managers are `apt`, `dnf`, `pacman`, and `winget`.

### Dashboard connection

1. Start `npm run ssh-broker` on the same computer as the dashboard.
2. Open Dashboard → **SSH console**.
3. Enter the one-time token printed by the broker.
4. Press **Test broker** to load the registered site list.
5. Use only the displayed safe operations; the browser cannot submit arbitrary shell text.

The broker binds to loopback only. It must be kept in the same local security boundary as the dashboard; do not reverse-proxy port `8790` or expose it publicly.
