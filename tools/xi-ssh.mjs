#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const configPath = path.resolve(process.cwd(), '.xi-ssh.json');
const expandHome = value => String(value || '').replace(/^~(?=$|[\\/])/, os.homedir());
const fail = message => { console.error(`xi-ssh: ${message}`); process.exitCode = 1; };

async function loadConfig() {
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  if (!config.host || !config.user) throw new Error('config requires host and user');
  const identityFile = expandHome(config.identityFile || '~/.ssh/id_ed25519');
  const knownHostsFile = expandHome(config.knownHostsFile || '~/.ssh/known_hosts');
  if (!path.isAbsolute(identityFile) || !path.isAbsolute(knownHostsFile)) throw new Error('identityFile and knownHostsFile must be absolute or use ~');
  return { ...config, identityFile, knownHostsFile, port: Number(config.port || 22), shell: config.shell === 'powershell' ? 'powershell' : 'sh' };
}

function quotePosix(value) { return `'${String(value).replaceAll("'", "'\\''")}'`; }
function quotePowerShell(value) { return `'${String(value).replaceAll("'", "''")}'`; }
function remoteCommand(command, config) {
  const quote = config.shell === 'powershell' ? quotePowerShell : quotePosix;
  if (command === 'status') return config.shell === 'powershell' ? '$env:COMPUTERNAME; whoami; $PSVersionTable.PSVersion.ToString()' : 'hostname; id -un; uname -sr';
  if (command === 'list') return config.shell === 'powershell' ? 'Get-ChildItem -Force | Select-Object Mode,Length,Name | Out-String' : 'ls -la';
  if (command.startsWith('get ')) return config.shell === 'powershell' ? `Get-Content -LiteralPath ${quote(command.slice(4))}` : `cat -- ${quote(command.slice(4))}`;
  throw new Error('allowed commands: status, list, get <remote-file>');
}

async function main() {
  const config = await loadConfig();
  const command = process.argv.slice(2).join(' ').trim() || 'status';
  const args = ['-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${config.knownHostsFile}`, '-i', config.identityFile, '-p', String(config.port), `${config.user}@${config.host}`, remoteCommand(command, config)];
  const ssh = spawn(process.platform === 'win32' ? 'ssh.exe' : 'ssh', args, { stdio: 'inherit', windowsHide: true });
  ssh.on('error', error => fail(`could not start OpenSSH: ${error.message}`));
  ssh.on('exit', code => { if (code) process.exitCode = code; });
}

main().catch(error => fail(error.message));
