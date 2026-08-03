<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) { http_response_code(403); echo json_encode(['error' => 'file operations are local-only']); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); header('Allow: POST'); echo json_encode(['error' => 'POST required']); exit; }
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== '' && !hash_equals((string) (($_SERVER['HTTPS'] ?? '') !== '' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? ''), $_SERVER['HTTP_ORIGIN'])) { http_response_code(403); echo json_encode(['error' => 'cross-origin file operation rejected']); exit; }
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 2 * 1024 * 1024) { http_response_code(413); echo json_encode(['error' => 'request is too large']); exit; }
$root = realpath(__DIR__ . DIRECTORY_SEPARATOR . '..');
if ($root === false) { http_response_code(500); echo json_encode(['error' => 'workspace root is unavailable']); exit; }
$trashRoot = $root . DIRECTORY_SEPARATOR . '.xi-trash';
$input = json_decode((string) file_get_contents('php://input'), true);
$action = is_array($input) ? (string) ($input['action'] ?? '') : '';
$extensions = ['html', 'htm', 'php', 'css', 'js', 'json', 'md', 'xml', 'txt'];
function file_ops_fail(int $status, string $message): never { http_response_code($status); echo json_encode(['error' => $message]); exit; }
function file_ops_path(string $value, string $root, array $extensions, bool $allowDirectory = false): string {
    $value = trim(str_replace('\\', '/', $value), '/');
    if ($value === '' || str_contains($value, "\0")) file_ops_fail(400, 'a file path is required');
    foreach (explode('/', $value) as $part) if ($part === '' || $part === '.' || $part === '..' || str_starts_with($part, '.')) file_ops_fail(403, 'hidden and parent paths are not allowed');
    $target = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $value);
    if (!$allowDirectory && !in_array(strtolower(pathinfo($value, PATHINFO_EXTENSION)), $extensions, true)) file_ops_fail(403, 'file type is not editable');
    if (in_array(strtolower(basename($value)), ['file-ops.php', 'xi-server.php'], true)) file_ops_fail(403, 'server files cannot be changed here');
    $parentCandidate = dirname($target);
    while (!is_dir($parentCandidate) && $parentCandidate !== $root && dirname($parentCandidate) !== $parentCandidate) $parentCandidate = dirname($parentCandidate);
    $parent = realpath($parentCandidate);
    if ($parent === false || ($parent !== $root && !str_starts_with($parent, $root . DIRECTORY_SEPARATOR))) file_ops_fail(403, 'path escapes the workspace');
    if (file_exists($target) || is_link($target)) {
        $resolved = realpath($target);
        if ($resolved === false || ($resolved !== $root && !str_starts_with($resolved, $root . DIRECTORY_SEPARATOR))) file_ops_fail(403, 'symlink escapes the workspace');
        if (is_link($target)) file_ops_fail(403, 'symlinks are not editable');
    }
    return $target;
}
function file_ops_history(string $root): array { $file = $root . DIRECTORY_SEPARATOR . '.xi-trash' . DIRECTORY_SEPARATOR . 'history.json'; if (!is_file($file) || (int) filesize($file) > 512 * 1024) return []; $items = json_decode((string) file_get_contents($file), true); if (!is_array($items)) return []; return array_values(array_filter(array_slice($items, -20), static fn($item) => is_array($item) && preg_match('/^[a-f0-9]{12}$/', (string) ($item['id'] ?? '')) && in_array(($item['action'] ?? ''), ['create', 'copy', 'move', 'delete', 'write'], true))); }
function file_ops_save_history(string $root, array $items): void { $dir = $root . DIRECTORY_SEPARATOR . '.xi-trash'; if (is_link($dir) || (is_dir($dir) && (($resolved = realpath($dir)) === false || ($resolved !== $root && !str_starts_with($resolved, $root . DIRECTORY_SEPARATOR))))) file_ops_fail(403, 'trash directory escapes the workspace'); if (!is_dir($dir) && !mkdir($dir, 0750, true)) file_ops_fail(500, 'could not create temporary trash directory'); $items = array_slice($items, -20); if (file_put_contents($dir . DIRECTORY_SEPARATOR . 'history.json', json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL, LOCK_EX) === false) file_ops_fail(500, 'could not save undo history'); }
function file_ops_trash_path(string $relative, string $root): string { $normalized = ltrim(str_replace('\\', '/', $relative), '/'); if (!str_starts_with($normalized, '.xi-trash/') || str_contains($normalized, '/../') || str_ends_with($normalized, '/..')) file_ops_fail(403, 'invalid trash path'); $target = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $normalized); $trashRoot = realpath($root . DIRECTORY_SEPARATOR . '.xi-trash'); $parent = realpath(dirname($target)); if ($trashRoot === false || $parent === false || ($parent !== $trashRoot && !str_starts_with($parent, $trashRoot . DIRECTORY_SEPARATOR))) file_ops_fail(403, 'trash path escapes the workspace'); return $target; }
function file_ops_record(string $root, array $record): string { $record['id'] = bin2hex(random_bytes(6)); $record['time'] = gmdate('c'); $items = file_ops_history($root); $items[] = $record; file_ops_save_history($root, $items); return $record['id']; }
function file_ops_rel(string $target, string $root): string { return str_replace('\\', '/', substr($target, strlen($root) + 1)); }
function file_ops_remove_tree(string $target): bool { if (is_link($target) || is_file($target)) return unlink($target); if (!is_dir($target)) return true; foreach (scandir($target) ?: [] as $name) { if ($name === '.' || $name === '..') continue; if (!file_ops_remove_tree($target . DIRECTORY_SEPARATOR . $name)) return false; } return rmdir($target); }
if (!is_array($input) || !in_array($action, ['read', 'create', 'copy', 'move', 'delete', 'write', 'undo', 'list-history', 'list-trash'], true)) file_ops_fail(400, 'unsupported file operation');
if ($action === 'list-history') { echo json_encode(['items' => file_ops_history($root)]); exit; }
if ($action === 'list-trash') { echo json_encode(['items' => array_values(array_filter(file_ops_history($root), fn($item) => ($item['action'] ?? '') === 'delete'))]); exit; }
if ($action === 'read') { $source = file_ops_path((string) ($input['path'] ?? ''), $root, $extensions); if (!is_file($source) || is_link($source)) file_ops_fail(404, 'file not found'); echo json_encode(['ok' => true, 'path' => file_ops_rel($source, $root), 'content' => base64_encode((string) file_get_contents($source))]); exit; }
if ($action === 'undo') {
    $id = (string) ($input['id'] ?? ''); $items = file_ops_history($root); $found = null;
    foreach ($items as $index => $item) if (($item['id'] ?? '') === $id) { $found = [$index, $item]; break; }
    if (!$found) file_ops_fail(404, 'undo stage not found');
    [, $item] = $found; $kind = $item['action'] ?? '';
    if ($kind === 'delete') { $source = file_ops_path($item['path'], $root, $extensions, true); $trash = file_ops_trash_path((string) ($item['trash'] ?? ''), $root); if (file_exists($source) || is_link($source)) file_ops_fail(409, 'original path is already occupied'); if (!is_dir(dirname($source)) && !mkdir(dirname($source), 0750, true)) file_ops_fail(500, 'could not restore parent directory'); if (!file_exists($trash) || !rename($trash, $source)) file_ops_fail(500, 'could not restore deleted path'); }
    elseif ($kind === 'create' || $kind === 'copy') { $target = file_ops_path($kind === 'create' ? $item['path'] : $item['destination'], $root, $extensions, true); if (file_exists($target) && !file_ops_remove_tree($target)) file_ops_fail(500, 'could not undo path'); }
    elseif ($kind === 'write') { $target = file_ops_path((string) ($item['path'] ?? ''), $root, $extensions); $backup = file_ops_trash_path((string) ($item['backup'] ?? ''), $root); if (!is_file($backup) || !is_file($target) || !unlink($target) || !rename($backup, $target)) file_ops_fail(500, 'could not restore previous file version'); }
    elseif ($kind === 'move') { $source = file_ops_path($item['source'], $root, $extensions, true); $destination = file_ops_path($item['destination'], $root, $extensions, true); if (file_exists($source)) file_ops_fail(409, 'original move path is already occupied'); if (!rename($destination, $source)) file_ops_fail(500, 'could not undo move'); }
    $items = array_values(array_filter($items, fn($entry) => ($entry['id'] ?? '') !== $id)); file_ops_save_history($root, $items); echo json_encode(['ok' => true]); exit;
}
if ($action === 'create') { $target = file_ops_path((string) ($input['path'] ?? ''), $root, $extensions); $content = (string) ($input['content'] ?? ''); if (strlen($content) > 2 * 1024 * 1024) file_ops_fail(413, 'file is too large'); if (file_exists($target) || is_link($target)) file_ops_fail(409, 'file already exists'); if (!is_dir(dirname($target)) && !mkdir(dirname($target), 0750, true)) file_ops_fail(500, 'could not create parent directory'); if (file_put_contents($target, $content, LOCK_EX) === false) file_ops_fail(500, 'could not create file'); $id = file_ops_record($root, ['action' => 'create', 'path' => file_ops_rel($target, $root)]); echo json_encode(['ok' => true, 'id' => $id, 'path' => file_ops_rel($target, $root)]); exit; }
if ($action === 'write') {
    $source = file_ops_path((string) ($input['path'] ?? ''), $root, $extensions);
    if (!is_file($source) || is_link($source)) file_ops_fail(404, 'file not found');
    $content = (string) ($input['content'] ?? ''); if (strlen($content) > 2 * 1024 * 1024) file_ops_fail(413, 'file is too large');
    if (is_link($trashRoot) || (is_dir($trashRoot) && (($resolvedTrash = realpath($trashRoot)) === false || ($resolvedTrash !== $root && !str_starts_with($resolvedTrash, $root . DIRECTORY_SEPARATOR))))) file_ops_fail(403, 'trash directory escapes the workspace');
    $id = bin2hex(random_bytes(6)); $trashDir = $trashRoot . DIRECTORY_SEPARATOR . $id; if (!is_dir($trashDir) && !mkdir($trashDir, 0750, true)) file_ops_fail(500, 'could not create backup stage');
    $backup = $trashDir . DIRECTORY_SEPARATOR . 'file'; if (!copy($source, $backup)) file_ops_fail(500, 'could not create file backup');
    $temporary = tempnam(dirname($source), '.dompipe-write-'); if ($temporary === false || file_put_contents($temporary, $content, LOCK_EX) === false || !rename($temporary, $source)) { if ($temporary !== false && is_file($temporary)) @unlink($temporary); file_ops_fail(500, 'could not publish file'); }
    file_ops_save_history($root, array_merge(file_ops_history($root), [['id' => $id, 'time' => gmdate('c'), 'action' => 'write', 'path' => file_ops_rel($source, $root), 'backup' => file_ops_rel($backup, $root)]])); echo json_encode(['ok' => true, 'id' => $id, 'path' => file_ops_rel($source, $root)]); exit;
}
$source = file_ops_path((string) ($input['source'] ?? $input['path'] ?? ''), $root, $extensions, in_array($action, ['copy', 'move', 'delete'], true)); if (!file_exists($source)) file_ops_fail(404, 'source path not found');
if ($action === 'delete') { if ($source === $root) file_ops_fail(403, 'workspace root cannot be deleted'); if (is_link($trashRoot) || (is_dir($trashRoot) && (($resolvedTrash = realpath($trashRoot)) === false || ($resolvedTrash !== $root && !str_starts_with($resolvedTrash, $root . DIRECTORY_SEPARATOR))))) file_ops_fail(403, 'trash directory escapes the workspace'); $id = bin2hex(random_bytes(6)); $trashDir = $trashRoot . DIRECTORY_SEPARATOR . $id; if (!is_dir($trashDir) && !mkdir($trashDir, 0750, true)) file_ops_fail(500, 'could not create trash stage'); $trash = $trashDir . DIRECTORY_SEPARATOR . 'path'; if (!rename($source, $trash)) file_ops_fail(500, 'could not move path to trash'); $items = file_ops_history($root); $items[] = ['id' => $id, 'time' => gmdate('c'), 'action' => 'delete', 'path' => file_ops_rel($source, $root), 'trash' => file_ops_rel($trash, $root)]; file_ops_save_history($root, $items); echo json_encode(['ok' => true, 'id' => $id]); exit; }
$destination = file_ops_path((string) ($input['destination'] ?? ''), $root, $extensions, true); if (file_exists($destination)) file_ops_fail(409, 'destination already exists'); if (!is_dir(dirname($destination)) && !mkdir(dirname($destination), 0750, true)) file_ops_fail(500, 'could not create destination directory'); if ($action === 'copy' && is_dir($source)) { $copyTree = function (string $from, string $to) use (&$copyTree): bool { if (!mkdir($to, 0750, true)) return false; foreach (scandir($from) ?: [] as $name) { if ($name === '.' || $name === '..') continue; $fromChild = $from . DIRECTORY_SEPARATOR . $name; $toChild = $to . DIRECTORY_SEPARATOR . $name; if (is_dir($fromChild)) { if (!$copyTree($fromChild, $toChild)) return false; } elseif (!copy($fromChild, $toChild)) return false; } return true; }; $ok = $copyTree($source, $destination); } else { $ok = $action === 'copy' ? copy($source, $destination) : rename($source, $destination); } if (!$ok) file_ops_fail(500, "could not {$action} path"); $id = file_ops_record($root, ['action' => $action, 'source' => file_ops_rel($source, $root), 'destination' => file_ops_rel($destination, $root)]); echo json_encode(['ok' => true, 'id' => $id, 'path' => file_ops_rel($destination, $root)]);
