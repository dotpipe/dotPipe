<?php
declare(strict_types=1);

$configFile = __DIR__ . '/.xi';
$legacyConfigFile = __DIR__ . '/.xi-server.json';
require_once __DIR__ . '/xi-xml.php';

function xi_json(int $status, array $payload): never
{
    http_response_code($status);
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Pragma: no-cache');
    header('X-Content-Type-Options: nosniff');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function xi_fail(int $status, string $message, string $code = 'request_error'): never
{
    xi_json($status, ['ok' => false, 'status' => $status, 'code' => $code, 'error' => $message]);
}

function xi_xml_rules(?array $node): array
{
    if (!$node) return [];
    $values = [];
    foreach (['pattern', 'value'] as $tag) {
        foreach (xi_xml_children($node, $tag) as $item) $values[] = xi_xml_text($item);
    }
    if (!$values) {
        foreach (preg_split('/\R+/', xi_xml_text($node)) ?: [] as $line) {
            $line = trim($line, " \t\r\n,\"'");
            if ($line !== '') $values[] = $line;
        }
    }
    return array_values(array_unique(array_filter($values)));
}

function xi_xml_config(string $file): ?array
{
    $xml = xi_xml_parse($file);
    if (!$xml) return null;
    $source = xi_xml_child($xml, 'server') ?? $xml;
    $config = [];
    $attrs = $source['attrs'] ?? [];
    foreach (['root', 'auditLog', 'stateFile', 'endpointEntry', 'dashboardOrigin', 'operatorEmail', 'authStateFile'] as $key) {
        if (isset($attrs[$key])) $config[$key] = (string) $attrs[$key];
    }
    foreach (['allowWrites', 'allowBrowserWrites'] as $key) {
        if (isset($attrs[$key])) $config[$key] = filter_var((string) $attrs[$key], FILTER_VALIDATE_BOOLEAN);
    }
    foreach (['maxBytes', 'clockSkewSeconds', 'tokenAssertionIntervalSeconds', 'digestMaxBytes', 'digestMaxFiles'] as $key) {
        if (isset($attrs[$key])) $config[$key] = (int) $attrs[$key];
    }
    foreach (['allow', 'deny'] as $rule) {
        $ruleNode = xi_xml_child($source, $rule);
        if ($ruleNode) $config[$rule] = xi_xml_rules($ruleNode);
    }
    $config['keys'] = [];
    $keysNode = xi_xml_child($source, 'keys');
    foreach ($keysNode ? xi_xml_children($keysNode, 'key') : [] as $key) {
        $keyAttrs = $key['attrs'] ?? [];
        if (isset($keyAttrs['id'])) $config['keys'][(string) $keyAttrs['id']] = xi_xml_text($key);
    }
    $config['dashboardTokens'] = [];
    $dashboardTokensNode = xi_xml_child($source, 'dashboardTokens');
    foreach ($dashboardTokensNode ? xi_xml_children($dashboardTokensNode, 'token') : [] as $token) {
        $tokenAttrs = $token['attrs'] ?? [];
        if (isset($tokenAttrs['id'])) $config['dashboardTokens'][(string) $tokenAttrs['id']] = xi_xml_text($token);
    }
    $config['auditPrograms'] = [];
    $auditNode = xi_xml_child($source, 'audit');
    foreach ($auditNode ? xi_xml_children($auditNode, 'program') : [] as $program) {
        $programAttrs = $program['attrs'] ?? [];
        $id = trim((string) ($programAttrs['id'] ?? ''));
        if ($id === '') continue;
        $files = [];
        foreach (xi_xml_children($program, 'file') as $fileNode) $files[] = xi_xml_text($fileNode);
        $config['auditPrograms'][] = [
            'id' => $id,
            'name' => trim((string) ($programAttrs['name'] ?? $id)),
            'root' => trim((string) ($programAttrs['root'] ?? '.')),
            'entry' => trim((string) ($programAttrs['entry'] ?? '')),
            'files' => array_values(array_unique(array_filter($files))),
        ];
    }
    return $config;
}

function xi_load_config(string $file, string $legacyFile): ?array
{
    if (is_file($file)) return xi_xml_config($file);
    return is_file($legacyFile) ? json_decode((string) file_get_contents($legacyFile), true) : null;
}

function xi_state(string $root, array $config): array
{
    $file = $root . DIRECTORY_SEPARATOR . ($config['stateFile'] ?? '.xi-state.json');
    if (!is_file($file)) return [];
    $state = json_decode((string) file_get_contents($file), true);
    return is_array($state) ? $state : [];
}

function xi_save_state(string $root, array $config, array $state): void
{
    $file = $root . DIRECTORY_SEPARATOR . ($config['stateFile'] ?? '.xi-state.json');
    if (file_put_contents($file, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL, LOCK_EX) === false) {
        xi_fail(500, 'could not save endpoint state', 'state_write_failed');
    }
}

function xi_auth_file(string $root, array $config): string
{
    $configured = (string) ($config['authStateFile'] ?? '');
    $file = $configured !== ''
        ? (preg_match('~^(?:[A-Za-z]:[\\/]|/)~', $configured) ? $configured : dirname($root) . DIRECTORY_SEPARATOR . $configured)
        : dirname($root) . DIRECTORY_SEPARATOR . '.xi-auth.json';
    $resolvedParent = realpath(dirname($file));
    if ($resolvedParent !== false && ($resolvedParent === $root || str_starts_with($resolvedParent, $root . DIRECTORY_SEPARATOR))) {
        xi_fail(500, 'auth state must be stored outside the public site root', 'auth_state_exposed');
    }
    return $file;
}

function xi_auth_state(string $root, array $config): array
{
    $file = xi_auth_file($root, $config);
    if (!is_file($file)) return [];
    $state = json_decode((string) file_get_contents($file), true);
    return is_array($state) ? $state : [];
}

function xi_save_auth_state(string $root, array $config, array $state): void
{
    $file = xi_auth_file($root, $config);
    $parent = dirname($file);
    if (!is_dir($parent) && !mkdir($parent, 0700, true)) xi_fail(500, 'could not create protected auth directory', 'auth_state_failed');
    if (file_put_contents($file, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL, LOCK_EX) === false) xi_fail(500, 'could not save protected auth state', 'auth_state_failed');
    @chmod($file, 0600);
}

function xi_site_digest(string $root, array $config): string
{
    $entries = [];
    $totalBytes = 0;
    $totalFiles = 0;
    $maxBytes = max(1048576, (int) ($config['digestMaxBytes'] ?? 67108864));
    $maxFiles = max(100, (int) ($config['digestMaxFiles'] ?? 20000));
    try {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS | FilesystemIterator::CATCH_GET_CHILD));
    } catch (Throwable $error) {
        xi_fail(500, 'site snapshot could not be read', 'digest_read_failed');
    }
    foreach ($iterator as $file) {
        if (!$file->isFile()) continue;
        $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));
        $parts = explode('/', $relative);
        if (in_array('.xi-trash', $parts, true) || in_array('.git', $parts, true)) continue;
        if (in_array($relative, ['.xi-state.json'], true) || str_ends_with($relative, '.log')) continue;
        $content = file_get_contents($file->getPathname());
        if ($content === false) continue;
        $totalFiles++;
        $totalBytes += strlen($content);
        if ($totalFiles > $maxFiles || $totalBytes > $maxBytes) xi_fail(413, 'site snapshot exceeds digest limits', 'digest_limits');
        $entries[] = $relative . "\0" . strlen($content) . "\0" . base64_encode($content);
    }
    sort($entries, SORT_STRING);
    $gzip = gzencode(implode("\n", $entries), 9, ZLIB_ENCODING_GZIP);
    return hash('sha256', $gzip === false ? implode("\n", $entries) : $gzip);
}

function xi_digest_assertion(string $root, array $config): array
{
    $state = xi_auth_state($root, $config);
    $digest = xi_site_digest($root, $config);
    $now = time();
    $observations = array_values(array_filter((array) ($state['digestObservations'] ?? []), static fn($item) => is_array($item) && isset($item['digest'], $item['at'])));
    $last = end($observations);
    $interval = max(60, (int) ($config['tokenAssertionIntervalSeconds'] ?? 600));
    if (!$last || $last['digest'] !== $digest || $now - (int) $last['at'] >= $interval) $observations[] = ['digest' => $digest, 'at' => $now];
    $observations = array_slice($observations, -20);
    $matching = array_values(array_filter($observations, static fn($item) => $item['digest'] === $digest));
    $spaced = count($matching) >= 2 && ((int) $matching[count($matching) - 1]['at'] - (int) $matching[count($matching) - 2]['at']) >= $interval;
    $state['digestObservations'] = $observations;
    $state['currentDigest'] = $digest;
    $state['lastDigestAt'] = $now;
    xi_save_auth_state($root, $config, $state);
    return ['digest' => $digest, 'observations' => count($matching), 'required' => 2, 'intervalSeconds' => $interval, 'trusted' => $spaced, 'nextAssertionAt' => $spaced ? null : gmdate('c', $now + $interval)];
}

function xi_rotate_session(string $root, array $config): void
{
    $state = xi_auth_state($root, $config);
    $session = bin2hex(random_bytes(32));
    $state['sessionHash'] = hash('sha256', $session);
    $state['sessionExpiresAt'] = time() + 900;
    xi_save_auth_state($root, $config, $state);
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    setcookie('xi_xi_session', $session, ['expires' => time() + 900, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => $secure ? 'None' : 'Lax']);
}

function xi_alert_invalid_token(string $root, array $config, string $reason): void
{
    $email = trim((string) ($config['operatorEmail'] ?? ''));
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) return;
    $state = xi_auth_state($root, $config);
    if ((int) ($state['lastInvalidAlertAt'] ?? 0) > time() - 600) return;
    $state['lastInvalidAlertAt'] = time();
    xi_save_auth_state($root, $config, $state);
    @mail($email, 'XI XI token exchange rejected', "A dashboard token was rejected by the audited server. Reason: {$reason}\nTime: " . gmdate('c') . "\nRe-pair under supervision.");
}

function xi_pattern(string $pattern): string
{
    $quoted = preg_quote(ltrim(str_replace('\\', '/', $pattern), '/'), '~');
    return '~^' . str_replace(['\\\*\\\*', '\\\*'], ['.*', '[^/]*'], $quoted) . '$~i';
}

function xi_allowed(string $relative, array $config): bool
{
    $allow = (array) ($config['allow'] ?? []);
    $deny = (array) ($config['deny'] ?? []);
    if (!$allow || !array_filter($allow, fn($p) => is_string($p) && preg_match(xi_pattern($p), $relative))) return false;
    return !array_filter($deny, fn($p) => is_string($p) && preg_match(xi_pattern($p), $relative));
}

function xi_directory_allowed(string $relative, array $config): bool
{
    if (array_filter((array) ($config['deny'] ?? []), fn($p) => is_string($p) && preg_match(xi_pattern($p), $relative))) return false;
    if ($relative === '' || xi_allowed($relative, $config)) return true;
    $prefix = rtrim($relative, '/') . '/';
    foreach ((array) ($config['allow'] ?? []) as $pattern) {
        $normalized = ltrim(str_replace('\\', '/', (string) $pattern), '/');
        if (str_starts_with($normalized, $prefix) || str_contains($normalized, '*')) return true;
    }
    return false;
}

function xi_relative(string $value): string
{
    $value = ltrim(str_replace('\\', '/', $value), '/');
    if (str_contains($value, "\0")) xi_fail(400, 'invalid path', 'invalid_path');
    $safe = [];
    foreach (explode('/', $value) as $part) {
        if ($part === '' || $part === '.') continue;
        if ($part === '..') xi_fail(400, 'parent paths are not allowed', 'parent_path');
        $safe[] = $part;
    }
    return implode('/', $safe);
}

function xi_auth(array $config, string $action, string $remote, string $body, string $root): string
{
    $GLOBALS['xi_auth_context'] = ['type' => 'unknown', 'id' => null, 'fingerprint' => null];
    $headers = function_exists('getallheaders') ? array_change_key_case(getallheaders(), CASE_LOWER) : [];
    $authorization = (string) ($headers['authorization'] ?? '');
    $cookie = $_COOKIE['xi_xi_session'] ?? '';
    $authState = xi_auth_state($root, $config);
    if ($cookie !== '' && hash_equals((string) ($authState['sessionHash'] ?? ''), hash('sha256', $cookie)) && (int) ($authState['sessionExpiresAt'] ?? 0) >= time()) {
        if (in_array($action, ['write', 'patch'], true)) {
            $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
            $configuredOrigin = rtrim((string) ($config['dashboardOrigin'] ?? ''), '/');
            $fetchSite = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? ''));
            if ($origin !== '' && ($configuredOrigin === '' || !hash_equals($configuredOrigin, rtrim($origin, '/')))) xi_fail(403, 'cross-origin write rejected', 'origin_rejected');
            if (in_array($fetchSite, ['cross-site', 'none'], true)) xi_fail(403, 'cross-site write rejected', 'fetch_site_rejected');
        }
        $sessionActions = ['status', 'manifest', 'audit', 'list', 'read'];
        if (($config['allowBrowserWrites'] ?? false) === true) $sessionActions = array_merge($sessionActions, ['write', 'patch', 'pause', 'resume']);
        if (!in_array($action, $sessionActions, true)) xi_fail(403, 'dashboard session is not allowed to perform this action', 'session_scope');
        $GLOBALS['xi_auth_context'] = ['type' => 'session', 'id' => null, 'fingerprint' => 'sha256:' . hash('sha256', $cookie)];
        return 'dashboard-session';
    }
    if (preg_match('/^Bearer\s+(.+)$/i', $authorization, $match)) {
        $token = $match[1];
        $tokenHash = hash('sha256', $token);
        $usedTokens = (array) ($authState['usedBootstrapTokens'] ?? []);
        if (in_array($tokenHash, $usedTokens, true)) {
            xi_alert_invalid_token($root, $config, 'bootstrap token was already consumed');
            xi_fail(401, 'bootstrap token was already consumed; supervised re-pair required', 'token_consumed');
        }
        foreach ((array) ($config['dashboardTokens'] ?? []) as $trusted) {
            if (is_string($trusted) && hash_equals($trusted, $token)) {
                if (!in_array($action, ['status', 'manifest', 'audit', 'list', 'read'], true)) xi_fail(403, 'dashboard tokens are read-only', 'read_only_token');
                $authState['usedBootstrapTokens'] = array_slice(array_merge($usedTokens, [$tokenHash]), -20);
                xi_save_auth_state($root, $config, $authState);
                xi_rotate_session($root, $config);
                $GLOBALS['xi_auth_context'] = ['type' => 'dashboard-token', 'id' => null, 'fingerprint' => 'sha256:' . $tokenHash];
                return 'dashboard-token';
            }
        }
        xi_alert_invalid_token($root, $config, 'untrusted dashboard token');
        xi_fail(401, 'untrusted dashboard token; supervised re-pair required', 'untrusted_token');
    }
    $id = $headers['x-xi-key-id'] ?? '';
    $timestamp = $headers['x-xi-timestamp'] ?? '';
    $signature = $headers['x-xi-signature'] ?? '';
    if (!$id || !$timestamp || !$signature || abs(time() - (int) $timestamp) > (int) ($config['clockSkewSeconds'] ?? 300)) {
        xi_alert_invalid_token($root, $config, 'invalid or expired signature');
        xi_fail(401, 'invalid or expired signature; supervised re-pair required', 'invalid_signature');
    }
    $secret = $config['keys'][$id] ?? null;
    if (!is_string($secret)) { xi_alert_invalid_token($root, $config, 'untrusted key'); xi_fail(401, 'untrusted key; supervised re-pair required', 'untrusted_key'); }
    $expected = hash_hmac('sha256', $action . "\n" . '/' . $remote . "\n" . $timestamp . "\n" . $body, $secret);
    if (!hash_equals($expected, $signature)) { xi_alert_invalid_token($root, $config, 'signature mismatch'); xi_fail(401, 'signature mismatch; supervised re-pair required', 'signature_mismatch'); }
    $GLOBALS['xi_auth_context'] = ['type' => 'hmac-key', 'id' => (string) $id, 'fingerprint' => 'sha256:' . hash('sha256', $secret)];
    return 'xi-key';
}

function xi_change_receipt(string $action, string $remote, string $authMode): array
{
    $context = (array) ($GLOBALS['xi_auth_context'] ?? []);
    $receipt = [
        'status' => 'applied',
        'requestId' => bin2hex(random_bytes(16)),
        'action' => $action,
        'path' => '/' . $remote,
        'at' => gmdate('c'),
        'authMode' => $authMode,
        'credentialId' => $context['id'] ?? null,
        'tokenFingerprint' => $context['fingerprint'] ?? null,
    ];
    header('X-XI-Change: applied');
    header('X-XI-Request-Id: ' . $receipt['requestId']);
    return $receipt;
}

function xi_programs(array $config): array
{
    return array_map(static function (array $program): array {
        return [
            'id' => $program['id'],
            'name' => $program['name'],
            'root' => $program['root'],
            'entry' => $program['entry'],
            'files' => $program['files'],
        ];
    }, (array) ($config['auditPrograms'] ?? []));
}

function xi_json_pointer(string $path): array
{
    if ($path === '') return [];
    if (!str_starts_with($path, '/') || strlen($path) > 4096) xi_fail(400, 'invalid JSON Pointer', 'invalid_patch_path');
    return array_map(static function (string $part): string {
        if (preg_match('/~(?![01])/', $part)) xi_fail(400, 'invalid JSON Pointer escape', 'invalid_patch_path');
        return str_replace(['~1', '~0'], ['/', '~'], $part);
    }, explode('/', substr($path, 1)));
}

function xi_json_patch_apply(mixed $document, array $patch): mixed
{
    if (count($patch) > 1024) xi_fail(413, 'too many JSON Patch operations', 'patch_too_large');
    $result = $document;
    foreach ($patch as $operation) {
        if (!is_array($operation)) xi_fail(400, 'each JSON Patch operation must be an object', 'invalid_patch');
        $op = strtolower((string) ($operation['op'] ?? ''));
        $segments = xi_json_pointer((string) ($operation['path'] ?? ''));
        if (!in_array($op, ['add', 'replace', 'remove'], true)) xi_fail(400, 'only add, replace, and remove JSON Patch operations are allowed', 'invalid_patch_operation');
        if ($op !== 'remove' && !array_key_exists('value', $operation)) xi_fail(400, 'JSON Patch value is required', 'invalid_patch_value');
        if (!$segments) {
            if ($op === 'remove') xi_fail(400, 'the JSON document root cannot be removed', 'invalid_patch_path');
            $result = $operation['value'];
            continue;
        }
        $last = array_pop($segments);
        $parent =& $result;
        foreach ($segments as $segment) {
            if (!is_array($parent) || !array_key_exists($segment, $parent)) xi_fail(400, 'JSON Patch path does not exist', 'invalid_patch_path');
            $parent =& $parent[$segment];
        }
        if (!is_array($parent)) xi_fail(400, 'JSON Patch parent is not an object or array', 'invalid_patch_parent');
        $isList = array_is_list($parent);
        if ($isList) {
            if ($op === 'add' && $last === '-') {
                $parent[] = $operation['value'];
                continue;
            }
            if (!ctype_digit($last)) xi_fail(400, 'JSON array index is invalid', 'invalid_patch_index');
            $index = (int) $last;
            if ($op === 'add') {
                if ($index > count($parent)) xi_fail(400, 'JSON array index is out of range', 'invalid_patch_index');
                array_splice($parent, $index, 0, [$operation['value']]);
            } elseif ($index < 0 || $index >= count($parent)) {
                xi_fail(400, 'JSON array index is out of range', 'invalid_patch_index');
            } elseif ($op === 'remove') {
                array_splice($parent, $index, 1);
            } else {
                $parent[$index] = $operation['value'];
            }
        } elseif ($op === 'remove') {
            if (!array_key_exists($last, $parent)) xi_fail(400, 'JSON object key does not exist', 'invalid_patch_path');
            unset($parent[$last]);
        } elseif ($op === 'replace' && !array_key_exists($last, $parent)) {
            xi_fail(400, 'JSON object key does not exist', 'invalid_patch_path');
        } else {
            $parent[$last] = $operation['value'];
        }
        unset($parent);
    }
    return $result;
}

function xi_json_canonical(mixed $value): string
{
    try {
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        xi_fail(400, 'JSON document is not encodable', 'invalid_json');
    }
}

function xi_cors(array $config): void
{
    $origin = (string) ($config['dashboardOrigin'] ?? '');
    if ($origin === '*') xi_fail(500, 'dashboardOrigin cannot be wildcarded when credentials are enabled', 'invalid_origin');
    if ($origin !== '') header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-XI-Key-Id, X-XI-Timestamp, X-XI-Signature, X-XI-Token');
    header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
    if ($origin !== '') header('Access-Control-Allow-Credentials: true');
}

$config = xi_load_config($configFile, $legacyConfigFile);
if (!is_array($config)) xi_fail(500, 'XI server is not configured or has invalid XML', 'configuration_error');
xi_cors($config);
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') exit;

$action = (string) ($_GET['action'] ?? 'status');
$remote = xi_relative((string) ($_GET['path'] ?? ''));
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
$maxRequestBytes = max(1, (int) ($config['maxBytes'] ?? 1048576));
if ($contentLength > $maxRequestBytes) xi_fail(413, 'request is too large', 'file_too_large');
$body = file_get_contents('php://input') ?: '';
$actions = ['status', 'manifest', 'audit', 'list', 'read', 'write', 'patch', 'log', 'pause', 'resume', 'signal'];
if (!in_array($action, $actions, true)) xi_fail(400, 'unsupported action', 'unsupported_action');
$configuredRoot = (string) ($config['root'] ?? '.');
$rootPath = preg_match('~^(?:[A-Za-z]:[\\/]|/)~', $configuredRoot) ? $configuredRoot : __DIR__ . DIRECTORY_SEPARATOR . $configuredRoot;
$root = realpath($rootPath);
if ($root === false) xi_fail(500, 'invalid server root', 'invalid_root');
$authMode = xi_auth($config, $action, $remote, $body, $root);
$digestAssertion = xi_digest_assertion($root, $config);

if ($action === 'status') {
    xi_json(200, ['ok' => true, 'service' => 'xi', 'version' => 2, 'auth' => $authMode, 'siteDigest' => $digestAssertion, 'paused' => xi_state($root, $config)]);
}
if ($action === 'signal') {
    try { $signal = json_decode($body, true, 16, JSON_THROW_ON_ERROR); } catch (Throwable $error) { xi_fail(400, 'signal body must be valid JSON', 'invalid_signal'); }
    $clientDigest = strtolower(trim((string) ($signal['clientDigest'] ?? '')));
    if (!preg_match('/^[a-f0-9]{64}$/', $clientDigest)) xi_fail(400, 'signal requires a SHA256 clientDigest', 'invalid_client_digest');
    $serverDigest = (string) ($digestAssertion['digest'] ?? '');
    $matched = hash_equals($serverDigest, $clientDigest);
    $rebaseAllowed = ($config['allowWrites'] ?? false) === true && ($config['allowClientRebase'] ?? false) === true;
    xi_json(200, ['ok' => true, 'synced' => $matched, 'clientDigest' => $clientDigest, 'serverDigest' => $serverDigest, 'rebaseRequired' => !$matched, 'rebaseAllowed' => $rebaseAllowed, 'rebaseComplete' => ($signal['rebaseComplete'] ?? false) === true && $matched, 'siteDigest' => $digestAssertion]);
}
if ($action === 'manifest') {
    xi_json(200, [
        'ok' => true,
        'service' => 'xi',
        'version' => 2,
        'auth' => $authMode,
        'siteDigest' => $digestAssertion,
        'capabilities' => array_values(array_merge(['status', 'manifest', 'audit', 'list', 'read'], (($config['allowWrites'] ?? false) || ($config['allowBrowserWrites'] ?? false)) ? ['patch', 'pause', 'resume'] : [])),
        'programs' => xi_programs($config),
        'endpointEntry' => (string) ($config['endpointEntry'] ?? 'index.php'),
    ]);
}
if ($action === 'audit') {
    $file = (string) ($config['auditLog'] ?? '');
    $auditFile = $file === '' ? '' : $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $file);
    xi_json(200, ['ok' => true, 'programs' => xi_programs($config), 'siteDigest' => $digestAssertion, 'entries' => $auditFile && is_file($auditFile) ? array_slice(file($auditFile, FILE_IGNORE_NEW_LINES) ?: [], -100) : []]);
}
if ($action === 'log') {
    $file = (string) ($config['auditLog'] ?? '');
    $auditFile = $file === '' ? '' : $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $file);
    xi_json(200, ['entries' => $auditFile && is_file($auditFile) ? array_slice(file($auditFile, FILE_IGNORE_NEW_LINES) ?: [], -100) : []]);
}

if (in_array($action, ['read', 'write'], true)) {
    $requestedTarget = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $remote);
    if (is_dir($requestedTarget)) $remote = trim($remote, '/') . '/index.php';
}
if (in_array($action, ['pause', 'resume'], true)) {
    $endpoint = trim($remote, '/');
    $entry = (string) ($config['endpointEntry'] ?? 'index.php');
    if ($endpoint === '' || !xi_allowed($endpoint . '/' . $entry, $config)) xi_fail(404, 'endpoint not found', 'not_found');
    $state = xi_state($root, $config);
    if ($action === 'pause') $state[$endpoint] = ['pausedAt' => gmdate('c')]; else unset($state[$endpoint]);
    xi_save_state($root, $config, $state);
    xi_json(200, ['ok' => true, 'endpoint' => '/' . $endpoint, 'paused' => $action === 'pause']);
}
if ($action === 'list') {
    if (!xi_directory_allowed($remote, $config)) xi_fail(403, 'directory is not allowed', 'directory_not_allowed');
    $target = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $remote);
    if (!is_dir($target)) xi_fail(404, 'directory not found', 'not_found');
    if (is_link($target)) xi_fail(403, 'symlink directory is not allowed', 'symlink_rejected');
    $resolvedDirectory = realpath($target);
    if ($resolvedDirectory === false || ($resolvedDirectory !== $root && !str_starts_with($resolvedDirectory, $root . DIRECTORY_SEPARATOR))) xi_fail(403, 'directory escapes server root', 'root_escape');
    $items = [];
    foreach (scandir($target) ?: [] as $name) {
        if ($name === '.' || $name === '..') continue;
        $child = ($remote ? $remote . '/' : '') . $name;
        $childTarget = $target . DIRECTORY_SEPARATOR . $name;
        if ((is_dir($childTarget) && xi_directory_allowed($child, $config)) || (is_file($childTarget) && xi_allowed($child, $config))) {
            $items[] = ['name' => $name, 'type' => is_dir($childTarget) ? 'directory' : 'file'];
        }
    }
    xi_json(200, ['path' => '/' . $remote, 'items' => $items]);
}
if ($remote === '' || !xi_allowed($remote, $config)) xi_fail(403, 'path is not allowed', 'path_not_allowed');
$target = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $remote);
$realParent = realpath(dirname($target));
if ($realParent === false || ($realParent !== $root && !str_starts_with($realParent, $root . DIRECTORY_SEPARATOR))) xi_fail(403, 'path escapes server root', 'root_escape');
if (is_link($target)) xi_fail(403, 'symlink file is not allowed', 'symlink_rejected');
$realTarget = realpath($target);
if ($realTarget !== false && ($realTarget !== $root && !str_starts_with($realTarget, $root . DIRECTORY_SEPARATOR))) xi_fail(403, 'path escapes server root', 'root_escape');
if ($action === 'read') {
    if (!is_file($target)) xi_fail(404, 'file not found', 'not_found');
    $content = (string) file_get_contents($target);
    $payload = ['path' => '/' . $remote, 'content' => base64_encode($content)];
    if (strtolower(pathinfo($remote, PATHINFO_EXTENSION)) === 'json') {
        try {
            $payload['jsonHash'] = hash('sha256', xi_json_canonical(json_decode($content, true, 512, JSON_THROW_ON_ERROR)));
        } catch (JsonException $error) {
            xi_fail(500, 'JSON source is invalid', 'invalid_json_source');
        }
    }
    xi_json(200, $payload);
}
if ($action === 'patch') {
    if (!(($config['allowWrites'] ?? false) || ($authMode === 'dashboard-session' && ($config['allowBrowserWrites'] ?? false)))) xi_fail(403, 'writes are disabled', 'writes_disabled');
    if (strtolower(pathinfo($remote, PATHINFO_EXTENSION)) !== 'json') xi_fail(415, 'JSON Patch is only available for JSON resources', 'json_only');
    if (!is_file($target)) xi_fail(404, 'file not found', 'not_found');
    $request = json_decode($body, true);
    if (!is_array($request) || !array_key_exists('baseHash', $request) || !array_key_exists('document', $request) || !isset($request['patch']) || !is_array($request['patch'])) xi_fail(400, 'patch request requires baseHash, document, and patch', 'invalid_patch_request');
    $currentRaw = (string) file_get_contents($target);
    try {
        $current = json_decode($currentRaw, true, 512, JSON_THROW_ON_ERROR);
        $submitted = $request['document'];
        $currentHash = hash('sha256', xi_json_canonical($current));
        $baseHash = strtolower((string) $request['baseHash']);
        if (!preg_match('/^[a-f0-9]{64}$/', $baseHash) || !hash_equals($currentHash, $baseHash)) xi_json(409, ['ok' => false, 'status' => 409, 'code' => 'json_conflict', 'error' => 'JSON changed on the server; reload before publishing', 'document' => $current, 'jsonHash' => $currentHash]);
        $patched = xi_json_patch_apply($current, $request['patch']);
        $submittedCanonical = xi_json_canonical($submitted);
        $patchedCanonical = xi_json_canonical($patched);
        if (!hash_equals(hash('sha256', $patchedCanonical), hash('sha256', $submittedCanonical))) xi_fail(409, 'full JSON document does not match the supplied patch', 'patch_document_mismatch');
        if (strlen($patchedCanonical) > (int) ($config['maxBytes'] ?? 1048576)) xi_fail(413, 'JSON document is too large', 'file_too_large');
    } catch (JsonException $error) {
        xi_fail(400, 'JSON source or patch document is invalid', 'invalid_json');
    }
    $temporary = tempnam(dirname($target), '.xi-patch-');
    if ($temporary === false || file_put_contents($temporary, $patchedCanonical . PHP_EOL, LOCK_EX) === false) { if ($temporary !== false && is_file($temporary)) @unlink($temporary); xi_fail(500, 'could not stage JSON patch', 'patch_stage_failed'); }
    @chmod($temporary, fileperms($target) & 0777);
    if (!rename($temporary, $target)) { @unlink($temporary); xi_fail(500, 'could not publish JSON patch', 'patch_write_failed'); }
    $log = (string) ($config['auditLog'] ?? '');
    if ($log !== '') file_put_contents($root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $log), json_encode(['time' => gmdate('c'), 'action' => 'patch', 'path' => '/' . $remote, 'operations' => count($request['patch'])]) . PHP_EOL, FILE_APPEND | LOCK_EX);
    if ($authMode === 'dashboard-session') xi_rotate_session($root, $config);
    xi_json(200, ['ok' => true, 'path' => '/' . $remote, 'patch' => $request['patch'], 'document' => $submitted, 'jsonHash' => hash('sha256', $submittedCanonical), 'changeReceipt' => xi_change_receipt('patch', $remote, $authMode), 'siteDigest' => xi_digest_assertion($root, $config)]);
}
if (!(($config['allowWrites'] ?? false) || ($authMode === 'dashboard-session' && ($config['allowBrowserWrites'] ?? false)))) xi_fail(403, 'writes are disabled', 'writes_disabled');
if (strlen($body) > (int) ($config['maxBytes'] ?? 1048576)) xi_fail(413, 'file is too large', 'file_too_large');
if (!is_dir(dirname($target)) && !mkdir(dirname($target), 0750, true)) xi_fail(500, 'could not create directory', 'directory_create_failed');
if (file_put_contents($target, $body, LOCK_EX) === false) xi_fail(500, 'could not write file', 'write_failed');
$log = (string) ($config['auditLog'] ?? '');
if ($log !== '') file_put_contents($root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $log), json_encode(['time' => gmdate('c'), 'action' => 'write', 'path' => '/' . $remote]) . PHP_EOL, FILE_APPEND | LOCK_EX);
if ($authMode === 'dashboard-session') xi_rotate_session($root, $config);
xi_json(200, ['ok' => true, 'path' => '/' . $remote, 'bytes' => strlen($body), 'changeReceipt' => xi_change_receipt('write', $remote, $authMode), 'siteDigest' => xi_digest_assertion($root, $config)]);
