<?php
declare(strict_types=1);

/**
 * Parse the deliberately small .xi XML vocabulary without requiring
 * SimpleXML. External entities, doctypes, namespaces, and unknown markup are
 * rejected by the fallback parser rather than interpreted.
 */
function xi_xml_parse(string $file): ?array
{
    $contents = @file_get_contents($file);
    if ($contents === false || strlen($contents) > 4 * 1024 * 1024) return null;
    if (preg_match('/<!DOCTYPE|<!ENTITY|<\s*!/i', $contents)) return null;
    $contents = preg_replace('/^\s*<\?xml[^?]*\?>/i', '', $contents) ?? '';
    $contents = preg_replace('/<!--.*?-->/s', '', $contents) ?? '';
    $tokens = preg_split('/(<\/?[A-Za-z][A-Za-z0-9_.:-]*(?:\s+[^<>]*?)?\/?>)/s', $contents, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
    if (!$tokens) return null;
    $stack = [];
    $root = null;
    foreach ($tokens as $token) {
        if ($token[0] !== '<') {
            if ($stack) $stack[count($stack) - 1]['text'] .= $token;
            elseif (trim($token) !== '') return null;
            continue;
        }
        if (preg_match('/^<\/([A-Za-z][A-Za-z0-9_.:-]*)\s*>$/', $token, $close)) {
            if (!$stack || $stack[count($stack) - 1]['name'] !== $close[1]) return null;
            $node = array_pop($stack);
            if ($stack) $stack[count($stack) - 1]['children'][] = $node;
            elseif ($root !== null) return null;
            else $root = $node;
            continue;
        }
        if (!preg_match('/^<([A-Za-z][A-Za-z0-9_.:-]*)(.*?)\s*(\/?)>$/s', $token, $open)) return null;
        $attrs = [];
        $attributeText = trim($open[2]);
        while ($attributeText !== '') {
            if (!preg_match('/^([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*("[^"]*"|\'[^\']*\')(?:\s+|$)/s', $attributeText, $attribute)) return null;
            $attrs[$attribute[1]] = html_entity_decode(substr($attribute[2], 1, -1), ENT_QUOTES | ENT_XML1, 'UTF-8');
            $attributeText = trim(substr($attributeText, strlen($attribute[0])));
        }
        $node = ['name' => $open[1], 'attrs' => $attrs, 'children' => [], 'text' => ''];
        if ($open[3] === '/') {
            if ($stack) $stack[count($stack) - 1]['children'][] = $node;
            elseif ($root !== null) return null;
            else $root = $node;
        } else $stack[] = $node;
    }
    return !$stack && is_array($root) ? $root : null;
}

function xi_xml_children(array $node, string $name): array
{
    return array_values(array_filter($node['children'] ?? [], static fn($child) => is_array($child) && ($child['name'] ?? '') === $name));
}

function xi_xml_child(array $node, string $name): ?array
{
    return xi_xml_children($node, $name)[0] ?? null;
}

function xi_xml_text(array $node): string
{
    return trim(html_entity_decode((string) ($node['text'] ?? ''), ENT_QUOTES | ENT_XML1, 'UTF-8'));
}
