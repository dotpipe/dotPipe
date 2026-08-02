<?php
declare(strict_types=1);
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'xi-xml.php';

function elsn_reply(int $status, string $code, string $message): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'status' => $status, 'code' => $code, 'error' => $message]);
    exit;
}

function elsn_under(string $path, string $root): bool
{
    return $path === $root || str_starts_with($path, $root . DIRECTORY_SEPARATOR);
}

function elsn_rules(array $xml, string $name): array
{
    $values = [];
    $rule = xi_xml_child($xml, $name);
    if (!$rule) return [];
    foreach (xi_xml_children($rule, 'pattern') as $value) $values[] = xi_xml_text($value);
    foreach (preg_split('/\R+/', xi_xml_text($rule)) ?: [] as $value) {
        $value = trim($value, " \t\r\n,\"'");
        if ($value !== '') $values[] = $value;
    }
    return array_values(array_unique(array_filter($values)));
}

$defaultRoot = is_file(__DIR__ . DIRECTORY_SEPARATOR . '.xi') ? __DIR__ : dirname(__DIR__);
$root = realpath((string) (getenv('ELSN_ROOT') ?: $defaultRoot));
$configFile = $root === false ? '' : $root . DIRECTORY_SEPARATOR . '.xi';
if ($root === false || !is_file($configFile) || is_link($configFile)) elsn_reply(500, 'configuration_error', 'xi configuration is missing');
$xml = xi_xml_parse($configFile);
if (!$xml) elsn_reply(500, 'configuration_error', 'xi configuration is invalid');
$source = xi_xml_child($xml, 'server') ?? $xml;
$allow = elsn_rules($source, 'allow');
$deny = elsn_rules($source, 'deny');
$entry = trim((string) (($source['attrs'] ?? [])['endpointEntry'] ?? 'index.php'));
if ($entry === '' || str_contains($entry, '/') || str_contains($entry, '\\') || $entry === '.' || $entry === '..') elsn_reply(500, 'configuration_error', 'endpoint entry is invalid');

$requestPath = trim((string) ($_GET['endpoint'] ?? parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH)), '/');
$requestPath = preg_replace('~/index\.php$~i', '', $requestPath);
$parts = array_values(array_filter(explode('/', str_replace('\\', '/', $requestPath)), fn($part) => $part !== ''));
if (in_array('..', $parts, true) || in_array('.', $parts, true) || array_filter($parts, fn($part) => str_contains($part, "\0"))) elsn_reply(404, 'not_found', 'endpoint not found');
$endpoint = implode('/', $parts);
$directory = $root;
foreach ($parts as $part) {
    $directory .= DIRECTORY_SEPARATOR . $part;
    if (is_link($directory)) elsn_reply(404, 'not_found', 'endpoint not found');
    $resolved = realpath($directory);
    if ($resolved === false || !elsn_under($resolved, $root)) elsn_reply(404, 'not_found', 'endpoint not found');
    $localFile = $directory . DIRECTORY_SEPARATOR . '.xi';
    if (is_link($localFile)) elsn_reply(404, 'not_found', 'endpoint not found');
    if (is_file($localFile)) {
        $local = xi_xml_parse($localFile);
        if ($local !== null) {
            $localAllow = elsn_rules($local, 'allow');
            $localDeny = elsn_rules($local, 'deny');
            if ($localAllow) $allow = $localAllow;
            if ($localDeny) $deny = $localDeny;
        }
    }
}
$pattern = static fn(string $value): string => '~^' . str_replace(['\\*\\*', '\\*'], ['.*', '[^/]*'], preg_quote(ltrim(str_replace('\\', '/', $value), '/'), '~')) . '$~i';
$isAllowed = $endpoint !== '' && (bool) array_filter($allow, fn($value) => preg_match($pattern((string) $value), $endpoint . '/' . $entry)) && !(bool) array_filter($deny, fn($value) => preg_match($pattern((string) $value), $endpoint));
if (!$isAllowed) elsn_reply(404, 'not_found', 'endpoint not found');

$stateFile = $root . DIRECTORY_SEPARATOR . (string) (($source['attrs'] ?? [])['stateFile'] ?? '.xi-state.json');
if (is_link($stateFile)) elsn_reply(500, 'configuration_error', 'state file is a symlink');
$state = is_file($stateFile) ? json_decode((string) file_get_contents($stateFile), true) : [];
if (is_array($state) && isset($state[$endpoint])) {
    header('Retry-After: 30');
    elsn_reply(503, 'endpoint_paused', 'endpoint is paused');
}
$target = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $endpoint) . DIRECTORY_SEPARATOR . $entry;
if (is_link($target) || !is_file($target)) elsn_reply(404, 'not_found', 'endpoint not found');
$resolvedTarget = realpath($target);
if ($resolvedTarget === false || !elsn_under($resolvedTarget, $root)) elsn_reply(404, 'not_found', 'endpoint not found');
http_response_code(200);
require $resolvedTarget;
