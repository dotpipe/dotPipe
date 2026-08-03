<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("XI installer is CLI-only.\n");
}

$options = getopt('', ['root::', 'key-id::', 'secret::', 'dashboard-token::', 'operator-email::', 'origin::', 'force', 'help']);
if (isset($options['help'])) {
    echo "XI server installer\n\nphp xi-install.php --root=/var/www/site --origin=https://xi.example\n";
    echo "Options: --key-id, --secret, --dashboard-token, --operator-email, --origin, --force\n";
    exit(0);
}

$root = realpath((string) ($options['root'] ?? getcwd()));
if ($root === false || !is_dir($root)) { fwrite(STDERR, "Invalid --root directory.\n"); exit(1); }
$configFile = $root . DIRECTORY_SEPARATOR . '.xi';
if (is_file($configFile) && !isset($options['force'])) { fwrite(STDERR, ".xi already exists; use --force only after backing it up.\n"); exit(1); }

$keyId = (string) ($options['key-id'] ?? 'editor-1');
$secret = (string) ($options['secret'] ?? bin2hex(random_bytes(32)));
$dashboardToken = (string) ($options['dashboard-token'] ?? bin2hex(random_bytes(24)));
$operatorEmail = (string) ($options['operator-email'] ?? '');
$origin = (string) ($options['origin'] ?? '');
$xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
$xml .= '<xi root="." auditLog=".xi-audit.log" endpointEntry="index.php" stateFile=".xi-state.json" tokenAssertionIntervalSeconds="600" allowWrites="false" allowBrowserWrites="false" maxBytes="1048576" clockSkewSeconds="300"';
if ($origin !== '') $xml .= ' dashboardOrigin="' . htmlspecialchars($origin, ENT_XML1) . '"';
if ($operatorEmail !== '') $xml .= ' operatorEmail="' . htmlspecialchars($operatorEmail, ENT_XML1) . '"';
$xml .= '>' . PHP_EOL;
$xml .= '  <keys><key id="' . htmlspecialchars($keyId, ENT_XML1) . '">' . htmlspecialchars($secret, ENT_XML1) . '</key></keys>' . PHP_EOL;
$xml .= '  <dashboardTokens><token id="xi-readonly">' . htmlspecialchars($dashboardToken, ENT_XML1) . '</token></dashboardTokens>' . PHP_EOL;
$xml .= "  <audit>\n";
$xml .= "    <program id=\"dompipe\" name=\"domPipe runtime\" root=\".\" entry=\"domPipe.js\"><file>domPipe.js</file><file>package.json</file></program>\n";
$xml .= "    <program id=\"xi\" name=\"XI XI control plane\" root=\"dashboard\" entry=\"index.html\"><file>dashboard/index.html</file><file>dashboard/app.js</file><file>dashboard/xi-extension.js</file></program>\n";
$xml .= "  </audit>\n";
$xml .= "  <allow>\n    \"**/index.php\"\n    \"dashboard/*.json\"\n    \"dashboard/*.html\"\n    \"dashboard/*.js\"\n    \"dashboard/*.css\"\n    \"*.html\"\n    \"*.css\"\n    \"*.js\"\n    \"package.json\"\n  </allow>\n";
$xml .= "  <deny>\n    \".git**\"\n    \".xi\"\n    \".xi*\"\n    \".xi-state.json\"\n    \"*.key.json\"\n    \"*.env\"\n    \"*.log\"\n    \"vendor/**\"\n  </deny>\n</xi>\n";
if (file_put_contents($configFile, $xml, LOCK_EX) === false) { fwrite(STDERR, "Could not write .xi.\n"); exit(1); }
@chmod($configFile, 0600);
echo "Installed XI configuration at {$configFile}\nHMAC key id: {$keyId}\nHMAC secret: {$secret}\nDashboard token: {$dashboardToken}\n";
echo "Keep these values private. Point the web server at xi-server.php and use the dashboard token only for read-only source audit.\n";
