#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const commandName = path.basename(process.argv[1] || 'xi.mjs', '.mjs');
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const fail = message => { console.error(`${commandName}: ${message}`); process.exitCode = 1; };
const cwd = process.cwd();
function usage() { console.log(`XI - signed server editor\n\nUsage:\n  ${commandName} status\n  ${commandName} audit\n  ${commandName} signal [--rebase]\n  ${commandName} list [remote-directory]\n  ${commandName} get <remote-file> [local-file]\n  ${commandName} -e <remote-file> <local-file>\n  ${commandName} upload <remote-file> <local-file>\n  ${commandName} diff <remote-file> <local-file>\n  ${commandName} pause <endpoint>\n  ${commandName} resume <endpoint>\n  ${commandName} log\n  ${commandName} install [--interval=5m] [--force]\n  ${commandName} uninstall\n\nConfiguration: .xi.json and .xi.key.json`); }
async function readJson(file, fallback = {}) { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; } }
function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
function jsonPointerPart(value) { return String(value).replaceAll('~', '~0').replaceAll('/', '~1'); }
function createJsonPatch(before, after, pathName = '') { if (Object.is(before, after)) return []; if (Array.isArray(before) || Array.isArray(after)) return [{ op: 'replace', path: pathName, value: cloneJson(after) }]; const beforeObject = before && typeof before === 'object'; const afterObject = after && typeof after === 'object'; if (!beforeObject || !afterObject) return [{ op: 'replace', path: pathName, value: cloneJson(after) }]; const operations = []; Object.keys(before).filter(key => !Object.prototype.hasOwnProperty.call(after, key)).sort().forEach(key => operations.push({ op: 'remove', path: `${pathName}/${jsonPointerPart(key)}` })); Object.keys(after).sort().forEach(key => { const childPath = `${pathName}/${jsonPointerPart(key)}`; if (!Object.prototype.hasOwnProperty.call(before, key)) operations.push({ op: 'add', path: childPath, value: cloneJson(after[key]) }); else operations.push(...createJsonPatch(before[key], after[key], childPath)); }); return operations; }
async function loadConfig() { const config = await readJson(path.join(cwd, '.xi.json')); const key = await readJson(path.resolve(cwd, config.keyfile || '.xi.key.json')); if (!config.url || !key.id || !key.secret) throw new Error('configuration requires url and a trusted keyfile with id and secret'); return { config, key }; }
async function localSnapshot() {
  const files = [];
  async function walk(directory, prefix = '') {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name === '.git' || entry.name === '.xi-trash' || relative === '.xi-state.json' || relative.endsWith('.log')) continue;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target, relative);
      else if (entry.isFile()) { const content = await fs.readFile(target); files.push({ path: relative.replaceAll(path.sep, '/'), content }); }
    }
  }
  await walk(cwd);
  const entries = [...files].sort((a, b) => a.path.localeCompare(b.path)).map(file => `${file.path}\0${file.content.length}\0${file.content.toString('base64')}`);
  const digest = crypto.createHash('sha256').update(zlib.gzipSync(entries.join('\n'), { level: 9 })).digest('hex');
  return { digest, files };
}
function systemdQuote(value) { return `"${String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`; }
function runLocal(command, args) { const result = spawnSync(command, args, { encoding: 'utf8', windowsHide: true }); if (result.error) throw result.error; if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} failed`).trim()); return result.stdout.trim(); }
function installArguments(args) { const intervalArg = args.find(value => value.startsWith('--interval=')); const interval = intervalArg ? intervalArg.slice('--interval='.length) : '5m'; if (!/^\d+[smhd]$/.test(interval) || Number.parseInt(interval, 10) < 1) throw new Error('interval must look like 1m, 5m, 1h, or 1d'); return { interval, force: args.includes('--force') }; }
async function installSystemd(args) {
  if (process.platform !== 'linux') throw new Error('systemd installation is supported on Linux only; use the platform service manager on this computer');
  const systemdCheck = spawnSync('systemctl', ['--user', '--version'], { encoding: 'utf8', windowsHide: true });
  if (systemdCheck.error || systemdCheck.status !== 0) throw new Error('systemctl user services are unavailable');
  await loadConfig();
  const { interval, force } = installArguments(args);
  const unitDirectory = path.join(process.env.XDG_CONFIG_HOME || path.join(process.env.HOME || '', '.config'), 'systemd', 'user');
  if (!unitDirectory || unitDirectory === path.parse(unitDirectory).root) throw new Error('could not determine the user systemd directory');
  await fs.mkdir(unitDirectory, { recursive: true, mode: 0o700 });
  const servicePath = path.join(unitDirectory, 'xi-audit.service');
  const timerPath = path.join(unitDirectory, 'xi-audit.timer');
  for (const target of [servicePath, timerPath]) { try { const stat = await fs.lstat(target); if (stat.isSymbolicLink()) throw new Error(`${target} is a symlink`); if (!force) throw new Error(`${target} already exists; use --force to replace it`); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
  const nodePath = process.execPath;
  const cliPath = path.resolve(moduleDirectory, 'xi.mjs');
  const service = `[Unit]\nDescription=XI audit\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=oneshot\nWorkingDirectory=${systemdQuote(cwd)}\nExecStart=${systemdQuote(nodePath)} ${systemdQuote(cliPath)} audit\n`;
  const timer = `[Unit]\nDescription=XI audit timer\n\n[Timer]\nOnBootSec=2min\nOnUnitActiveSec=${interval}\nPersistent=true\nUnit=xi-audit.service\n\n[Install]\nWantedBy=timers.target\n`;
  await fs.writeFile(servicePath, service, { mode: 0o600 });
  await fs.writeFile(timerPath, timer, { mode: 0o600 });
  runLocal('systemctl', ['--user', 'daemon-reload']);
  runLocal('systemctl', ['--user', 'enable', '--now', 'xi-audit.timer']);
  console.log(JSON.stringify({ ok: true, platform: 'linux', service: servicePath, timer: timerPath, interval, enabled: true }, null, 2));
}
async function uninstallSystemd() {
  if (process.platform !== 'linux') throw new Error('systemd uninstallation is supported on Linux only');
  const unitDirectory = path.join(process.env.XDG_CONFIG_HOME || path.join(process.env.HOME || '', '.config'), 'systemd', 'user');
  const servicePath = path.join(unitDirectory, 'xi-audit.service');
  const timerPath = path.join(unitDirectory, 'xi-audit.timer');
  runLocal('systemctl', ['--user', 'disable', '--now', 'xi-audit.timer']);
  for (const target of [servicePath, timerPath]) { try { const stat = await fs.lstat(target); if (stat.isSymbolicLink()) throw new Error(`${target} is a symlink`); await fs.unlink(target); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
  runLocal('systemctl', ['--user', 'daemon-reload']);
  console.log(JSON.stringify({ ok: true, removed: [servicePath, timerPath] }, null, 2));
}
function remotePath(value = '/') { const normalized = `/${String(value).replaceAll('\\', '/').replace(/^\/+/, '')}`; if (normalized.includes('/../') || normalized.endsWith('/..') || normalized.includes('\0')) throw new Error('invalid remote path'); return normalized; }
async function request(action, remote, body, contentType = 'application/octet-stream') {
  const { config, key } = await loadConfig(); const target = new URL(config.url); target.searchParams.set('action', action); if (remote) target.searchParams.set('path', remotePath(remote));
  const payload = body || Buffer.alloc(0); const timestamp = String(Math.floor(Date.now() / 1000)); const canonical = `${action}\n${remotePath(remote || '/')}\n${timestamp}\n${payload.toString('utf8')}`;
  const signature = crypto.createHmac('sha256', key.secret).update(canonical).digest('hex');
  const response = await fetch(target, { method: ['write', 'patch', 'signal'].includes(action) ? 'PUT' : 'GET', body: payload.length ? payload : undefined, headers: { Accept: 'application/json', 'Content-Type': contentType, 'X-XI-Key-Id': key.id, 'X-XI-Timestamp': timestamp, 'X-XI-Signature': signature, 'Idempotency-Key': `xi-${crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 24)}` } });
  const text = await response.text(); let data; try { data = JSON.parse(text); } catch { data = { content: text }; } if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${data.error || text}`); return data;
}
async function main(args) {
  if (!args.length || args.includes('--help') || args.includes('-h')) return usage(); let command = args.shift(); if (command === '-e') command = 'upload';
  if (command === 'status') return console.log(JSON.stringify(await request('status'), null, 2));
  if (command === 'audit') return console.log(JSON.stringify(await request('audit'), null, 2));
  if (command === 'signal') {
    const snapshot = await localSnapshot();
    const rebase = args.includes('--rebase');
    const result = await request('signal', '/', JSON.stringify({ clientDigest: snapshot.digest, rebase }), 'application/json');
    if (!rebase || !result.rebaseRequired) return console.log(JSON.stringify({ ...result, clientDigest: snapshot.digest }, null, 2));
    if (!result.rebaseAllowed) throw new Error('server detected drift but client rebase is not enabled on both sides');
    for (const file of snapshot.files) await request('write', file.path, file.content);
    const verified = await request('signal', '/', JSON.stringify({ clientDigest: snapshot.digest, rebaseComplete: true }), 'application/json');
    return console.log(JSON.stringify({ ...verified, clientDigest: snapshot.digest, uploadedFiles: snapshot.files.length }, null, 2));
  }
  if (command === 'install') return installSystemd(args);
  if (command === 'uninstall') return uninstallSystemd();
  if (command === 'patch') {
    const remote = args.shift(); const local = args.shift();
    if (!remote || !local || !remote.toLowerCase().endsWith('.json') || !local.toLowerCase().endsWith('.json')) throw new Error('patch requires a remote JSON path and local JSON file');
    const current = await request('read', remote);
    const before = JSON.parse(Buffer.from(current.content || '', 'base64').toString('utf8'));
    const document = JSON.parse(await fs.readFile(path.resolve(cwd, local), 'utf8'));
    const patch = createJsonPatch(before, document);
    if (!patch.length) return console.log(JSON.stringify({ ok: true, changed: false, patch: [] }, null, 2));
    if (!current.jsonHash) throw new Error('server did not return a JSON base hash; update xi-server.php first');
    return console.log(JSON.stringify(await request('patch', remote, JSON.stringify({ baseHash: current.jsonHash, document, patch }), 'application/json'), null, 2));
  }
  if (command === 'list') return console.log(JSON.stringify(await request('list', args[0] || '/'), null, 2));
  if (command === 'log') return console.log(JSON.stringify(await request('log'), null, 2));
  if (command === 'pause' || command === 'resume') { const endpoint = args.shift(); if (!endpoint) throw new Error(`${command} requires an endpoint name`); return console.log(JSON.stringify(await request(command, endpoint), null, 2)); }
  if (!['get', 'upload', 'diff'].includes(command)) throw new Error(`unknown command '${command}'`);
  const remote = args.shift(); const local = args.shift(); if (!remote || (command !== 'get' && !local)) throw new Error(`${command} requires a remote path and ${command === 'get' ? 'optional local path' : 'local path'}`);
  if (command === 'get') { const result = await request('read', remote); const content = Buffer.from(result.content || '', 'base64'); if (local) await fs.writeFile(path.resolve(cwd, local), content); else process.stdout.write(content); return; }
  const content = await fs.readFile(path.resolve(cwd, local)); if (command === 'diff') { const remoteResult = await request('read', remote); console.log(Buffer.from(remoteResult.content || '', 'base64').equals(content) ? 'unchanged' : 'changed'); } else console.log(JSON.stringify(await request('write', remote, content, 'application/octet-stream'), null, 2));
}
main(process.argv.slice(2)).catch(error => fail(error.message));
