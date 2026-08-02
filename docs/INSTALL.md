# XI XI installation

`install.sh` is the Linux/WSL staging installer. It requires Debian or Ubuntu with `apt-get` and must be run as root:

```bash
sudo bash ./install.sh --operator-email=operator@example.com
```

It installs Apache, PHP, Node.js, and OpenSSL; creates random `.xi`, `.xi.json`, and `.xi.key.json` credentials; configures the Apache PHP module and rewrite support; and enables a loopback-only virtual host at `http://127.0.0.1:8789/dashboard/`. The credential receipt is written outside the web root at `../.xi-xi-credentials.txt` with mode `0600`.

The installer replaces Apache `ports.conf` with the single loopback listener and preserves the previous file as `/etc/apache2/ports.conf.xi-xi.bak`. This is intentional for a dedicated local XI host; do not use it on a machine that already serves other Apache sites without reviewing that backup first.

The installer does not enable the audit timer as root. After switching to the intended operator account, configure `.xi.json` and run:

```bash
xi install --interval=5m
```

Use `--force` only after reviewing existing credentials and configuration. Use `--dry-run` to inspect the planned port and origin without changing the system.
