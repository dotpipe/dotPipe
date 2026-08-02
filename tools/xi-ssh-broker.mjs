#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { spawn } from 'node:child_process';

const root = process.cwd();
const configPath = path.join(root, '.xi-xi-ssh.json');
const tokenPath = path.join(root, '.xi-xi-local-token');
const port = Number(process.env.XI_XI_SSH_PORT || 8790);
const dashboardOrigin = process.env.XI_XI_DASHBOARD_ORIGIN || 'http://127.0.0.1:8787';
const expandHome = value => String(value || '').replace(/^~(?=$|[\\/])/, os.homedir());
const json = (response, status, body) => { response.writeHead(status, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(body)); };

async function loadConfig() {
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  if (Array.isArray(config.sites) && !config.sites.length) throw new Error('SSH config must register at least one site');
  const sourceProfiles = Array.isArray(config.sites) ? config.sites : [{ id: 'default', name: 'Default site', ...config }];
  const profiles = sourceProfiles.map(profile => { if (!profile.id || !profile.host || !profile.user) throw new Error('each SSH site requires id, host, and user'); return { ...profile, name: String(profile.name || profile.id), identityFile: expandHome(profile.identityFile || '~/.ssh/id_ed25519'), knownHostsFile: expandHome(profile.knownHostsFile || '~/.ssh/known_hosts'), port: Number(profile.port || 22), shell: profile.shell === 'powershell' ? 'powershell' : 'sh', allow: Array.isArray(profile.allow) ? profile.allow.map(value => String(value).toLowerCase()) : ['status', 'list', 'get'], deny: Array.isArray(profile.deny) ? profile.deny.map(value => String(value).toLowerCase()) : ['shell', 'sudo', 'rm', 'delete', 'reboot', 'shutdown'], allowedPackages: Array.isArray(profile.allowedPackages) ? profile.allowedPackages.map(String) : [], packageManager: ['apt', 'dnf', 'pacman', 'winget'].includes(profile.packageManager) ? profile.packageManager : 'apt' }; });
  return { profiles };
}
async function loadToken() {
  try { return (await fs.readFile(tokenPath, 'utf8')).trim(); } catch (error) { if (error.code !== 'ENOENT') throw error; const token = crypto.randomBytes(32).toString('hex'); await fs.writeFile(tokenPath, `${token}\n`, { mode: 0o600 }); console.log(`XI XI local broker token (enter once in the dashboard): ${token}`); return token; }
}
function quotePosix(value) { return `'${String(value).replaceAll("'", "'\\''")}'`; }
function quotePowerShell(value) { return `'${String(value).replaceAll("'", "''")}'`; }
function remoteCommand(command, config) {
  const quote = config.shell === 'powershell' ? quotePowerShell : quotePosix;
  const operation = command.split(/\s+/, 1)[0].toLowerCase();
  if (config.deny.some(item => operation === item.toLowerCase())) throw new Error(`operation denied by policy: ${operation}`);
  if (!config.allow.includes(operation)) throw new Error(`operation is not allowlisted: ${operation}`);
  if (command === 'status') return config.shell === 'powershell' ? '$env:COMPUTERNAME; whoami; $PSVersionTable.PSVersion.ToString()' : 'hostname; id -un; uname -sr';
  if (command === 'list') return config.shell === 'powershell' ? 'Get-ChildItem -Force | Select-Object Mode,Length,Name | Out-String' : 'ls -la';
  if (command.startsWith('get ')) return config.shell === 'powershell' ? `Get-Content -LiteralPath ${quote(command.slice(4))}` : `cat -- ${quote(command.slice(4))}`;
  if (command.startsWith('install ')) { const packageName = command.slice(8).trim(); if (!/^[A-Za-z0-9][A-Za-z0-9._+:-]{0,127}$/.test(packageName) || !config.allowedPackages.includes(packageName)) throw new Error('package is not allowlisted'); if (config.packageManager === 'winget') return `winget install --id ${quote(packageName)} --exact --silent --accept-source-agreements --accept-package-agreements`; if (config.shell === 'powershell') throw new Error('this package manager requires a PowerShell-compatible configuration'); return `sudo -n ${config.packageManager} install -y -- ${quote(packageName)}`; }
  throw new Error('allowed commands: status, list, get <remote-file>, install <allowlisted-package>');
}
function runSsh(command, config) {
  return new Promise((resolve, reject) => {
    const args = ['-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${config.knownHostsFile}`, '-i', config.identityFile, '-p', String(config.port), `${config.user}@${config.host}`, remoteCommand(command, config)];
    const child = spawn(process.platform === 'win32' ? 'ssh.exe' : 'ssh', args, { windowsHide: true }); let stdout = ''; let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; if (stdout.length > 512 * 1024) child.kill(); }); child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject); child.on('close', code => resolve({ code: code ?? 1, stdout: stdout.slice(0, 512 * 1024), stderr: stderr.slice(0, 16 * 1024) }));
  });
}
async function main() {
  const token = await loadToken();
  const server = http.createServer(async (request, response) => {
    const origin = request.headers.origin || '';
    if (origin && origin !== dashboardOrigin) return json(response, 403, { ok: false, error: 'origin rejected' });
    if (origin) response.setHeader('Access-Control-Allow-Origin', dashboardOrigin);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-XI-XI-Local-Token'); response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); response.setHeader('Vary', 'Origin');
    if (request.method === 'OPTIONS') return response.end();
    if (request.headers['x-xi-xi-local-token'] !== token) return json(response, 401, { ok: false, error: 'local broker token rejected' });
    if (request.url === '/health' && request.method === 'GET') return json(response, 200, { ok: true, service: 'xi-xi-ssh-broker' });
    if (request.url === '/profiles' && request.method === 'GET') { const config = await loadConfig(); return json(response, 200, { ok: true, sites: config.profiles.map(profile => ({ id: profile.id, name: profile.name, host: profile.host, user: profile.user, allow: profile.allow, deny: profile.deny, allowedPackages: profile.allowedPackages, packageManager: profile.packageManager })) }); }
    if (request.url !== '/run' || request.method !== 'POST') return json(response, 404, { ok: false, error: 'not found' });
    let raw = ''; for await (const chunk of request) { raw += chunk; if (raw.length > 4096) return json(response, 413, { ok: false, error: 'request too large' }); }
    try { const body = JSON.parse(raw || '{}'); const command = String(body.command || '').trim(); const config = await loadConfig(); const profile = config.profiles.find(item => item.id === String(body.site || 'default')) || config.profiles[0]; const result = await runSsh(command, profile); json(response, result.code === 0 ? 200 : 502, { ok: result.code === 0, code: result.code, site: profile.id, stdout: result.stdout, stderr: result.stderr }); } catch (error) { json(response, 400, { ok: false, error: error.message }); }
  });
  server.listen(port, '127.0.0.1', () => console.log(`XI XI SSH broker listening on http://127.0.0.1:${port}`));
}
main().catch(error => { console.error(`xi-xi-ssh-broker: ${error.message}`); process.exitCode = 1; });
