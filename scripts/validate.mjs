import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceExtensions = new Set(['.js']);
const documentExtensions = new Set(['.html', '.php']);
const missing = [];
const syntaxErrors = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(root);

for (const file of files.filter(file => sourceExtensions.has(extname(file)))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    syntaxErrors.push(`${relative(root, file)}\n${result.stderr.trim()}`);
  }
}

// Match resource-bearing HTML attributes, not application state hooks such as
// data-action="pause". The latter is intentionally a command name, not a file.
const attributePattern = /(?<!data-)(?:src|href|action)\s*=\s*["']([^"']+)["']/gi;
for (const file of files.filter(file => documentExtensions.has(extname(file)))) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(attributePattern)) {
    const reference = match[1].split(/[?#]/, 1)[0];
    if (!reference || /^(?:https?:|mailto:|javascript:|data:|#|\/)/i.test(reference)) continue;
    if (reference.includes('%')) continue;
    const target = resolve(dirname(file), reference);
    if (!existsSync(target)) {
      missing.push(`${relative(root, file)} -> ${reference}`);
    }
  }
}

if (syntaxErrors.length || missing.length) {
  if (syntaxErrors.length) console.error(`JavaScript syntax errors:\n${syntaxErrors.join('\n')}`);
  if (missing.length) console.error(`Missing local document references:\n${missing.join('\n')}`);
  process.exit(1);
}

console.log(`Validated ${files.length} files: JavaScript syntax and local document references are valid.`);
