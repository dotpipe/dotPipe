#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PORT=8789
ORIGIN=""
OPERATOR_EMAIL=""
FORCE=0
DRY_RUN=0

usage() {
  cat <<'EOF'
XI XI Linux installer

Usage:
  sudo ./install.sh [options]

Options:
  --port=8789                 Loopback Apache port.
  --origin=http://...         Exact dashboard origin; defaults to the local port.
  --operator-email=...        Address for supervised invalid-token alerts.
  --force                     Replace existing generated configs and Apache site.
  --dry-run                   Print planned actions without changing the host.
  --help                      Show this help.

The installer binds Apache to 127.0.0.1 only and takes ownership of Apache's
ports.conf. It does not create a public listener or install an audit timer as
root. Run `xi install` later as the intended operator user if desired.
EOF
}

for argument in "$@"; do
  case "$argument" in
    --port=*) PORT="${argument#*=}" ;;
    --origin=*) ORIGIN="${argument#*=}" ;;
    --operator-email=*) OPERATOR_EMAIL="${argument#*=}" ;;
    --force) FORCE=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $argument" >&2; usage >&2; exit 2 ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1024 || PORT > 65535 )); then
  echo "Port must be between 1024 and 65535." >&2
  exit 2
fi
ORIGIN="${ORIGIN:-http://127.0.0.1:${PORT}}"
if ! [[ "$ORIGIN" =~ ^https?://127\.0\.0\.1(:[0-9]+)?$ ]]; then
  echo "Origin must be an explicit loopback HTTP(S) URL." >&2
  exit 2
fi
if (( DRY_RUN )); then
  echo "Would install XI XI at: $ROOT"
  echo "Would bind Apache to: 127.0.0.1:$PORT"
  echo "Would use dashboard origin: $ORIGIN"
  exit 0
fi
if (( EUID != 0 )); then
  echo "Run this installer with sudo." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
if command -v apt-get >/dev/null 2>&1; then
  apt-get update -qq
  apt-get install -y -qq apache2 php-cli libapache2-mod-php nodejs openssl
else
  echo "This installer currently supports Debian/Ubuntu hosts with apt-get." >&2
  exit 1
fi

if [[ -e "$ROOT/.xi" && "$FORCE" != 1 ]]; then
  echo "$ROOT/.xi already exists; use --force only after reviewing it." >&2
  exit 1
fi
if [[ -e "$ROOT/.xi.json" && "$FORCE" != 1 ]]; then
  echo "$ROOT/.xi.json already exists; use --force only after reviewing it." >&2
  exit 1
fi

SECRET="$(openssl rand -hex 32)"
DASHBOARD_TOKEN="$(openssl rand -hex 24)"
INSTALLER_ARGS=(--root="$ROOT" --secret="$SECRET" --dashboard-token="$DASHBOARD_TOKEN" --origin="$ORIGIN")
[[ -n "$OPERATOR_EMAIL" ]] && INSTALLER_ARGS+=(--operator-email="$OPERATOR_EMAIL")
(( FORCE )) && INSTALLER_ARGS+=(--force)
php "$ROOT/xi-install.php" "${INSTALLER_ARGS[@]}" >/dev/null

umask 077
printf '{\n  "url": "%s/xi-server.php",\n  "keyfile": ".xi.key.json",\n  "timeoutSeconds": 15\n}\n' "$ORIGIN" > "$ROOT/.xi.json"
printf '{\n  "id": "editor-1",\n  "secret": "%s"\n}\n' "$SECRET" > "$ROOT/.xi.key.json"
chmod 600 "$ROOT/.xi" "$ROOT/.xi.json" "$ROOT/.xi.key.json"
printf 'HMAC key id: editor-1\nHMAC secret: %s\nDashboard token: %s\n' "$SECRET" "$DASHBOARD_TOKEN" > "$ROOT/../.xi-credentials.txt"
chmod 600 "$ROOT/../.xi-credentials.txt"

APACHE_PORTS_BACKUP="/etc/apache2/ports.conf.xi.bak"
if [[ ! -e "$APACHE_PORTS_BACKUP" ]]; then cp /etc/apache2/ports.conf "$APACHE_PORTS_BACKUP"; fi
printf 'Listen 127.0.0.1:%s\n' "$PORT" > /etc/apache2/ports.conf
cat > /etc/apache2/sites-available/xi.conf <<EOF
<VirtualHost 127.0.0.1:${PORT}>
    ServerName xi.local
    DocumentRoot ${ROOT}
    <Directory ${ROOT}>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog \${APACHE_LOG_DIR}/xi-error.log
    CustomLog \${APACHE_LOG_DIR}/xi-access.log combined
</VirtualHost>
EOF

a2dismod mpm_event >/dev/null 2>&1 || true
a2enmod mpm_prefork rewrite >/dev/null
PHP_MODULE="$(basename "$(find /etc/apache2/mods-available -maxdepth 1 -name 'php*.load' -print -quit)" .load)"
[[ -n "$PHP_MODULE" ]] && a2enmod "$PHP_MODULE" >/dev/null
a2dissite 000-default >/dev/null 2>&1 || true
a2ensite xi >/dev/null
apache2ctl configtest
systemctl enable --now apache2

chmod +x "$ROOT/xi.mjs" "$ROOT/xi-core.mjs" "$ROOT/tools/xi-ssh.mjs" "$ROOT/tools/xi-ssh-broker.mjs"
ln -sfn "$ROOT/xi.mjs" /usr/local/bin/xi

echo "XI XI installed at http://127.0.0.1:${PORT}/dashboard/"
echo "Credentials saved outside the web root: $ROOT/../.xi-credentials.txt"
echo "Apache is loopback-only; no public listener was created."
echo "Run 'npm run ssh-broker' as the operator user for the local SSH dashboard console."
echo "Run 'xi install --interval=5m' as the operator user to opt into the audit timer."
